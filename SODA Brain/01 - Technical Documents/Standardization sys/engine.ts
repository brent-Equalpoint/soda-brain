// lib/standardization/engine.ts
//
// Standardization Engine
// ----------------------------------------
// The single entry point for all standardization work.
// Orchestrates Layer 1 → Layer 2 → Layer 3 in sequence.
//
// Callers never need to know which layers are active.
// The engine degrades gracefully:
//   - AI key missing → Layer 3 skipped, Layers 1+2 still run
//   - No existing connections → Layer 2 skips, Layer 1 still runs
//   - All layers run → fullest possible result
//
// IMPORTANT: The engine surfaces candidates. It NEVER merges connections.
// Merging requires explicit user action via the UI (MergeConfirmModal).

import { runLayer1, normalizeTags } from './layer1-normalize'
import { findFuzzyCandidates, findDuplicateTags } from './layer2-fuzzy'
import {
  isAIAvailable,
  resolveEntityGroups,
  resolveTagGroups,
  confirmDuplicatePair,
} from './layer3-ai'
import type {
  RawConnection,
  StandardizationResult,
  TagStandardizationResult,
  StandardizationConfig,
  DuplicateCandidate,
  MatchLayer,
} from './types'
import { DEFAULT_CONFIG } from './types'

// ---------------------------------------------------------------------------
// Name Standardization
// Run when a new connection is created — checks for duplicates.
// ---------------------------------------------------------------------------

/**
 * Run all three layers against an incoming name and return a
 * StandardizationResult for the UI to act on.
 *
 * @param incomingName - the display_name being written
 * @param existingConnections - all existing connections for this owner
 * @param config - optional config override (defaults apply)
 */
export async function standardizeName(
  incomingName: string,
  existingConnections: RawConnection[],
  config: StandardizationConfig = DEFAULT_CONFIG
): Promise<StandardizationResult> {
  const layersRun: MatchLayer[] = []
  const allCandidates: DuplicateCandidate[] = []

  // ── Layer 1: Text Normalization ──────────────────────────────────────
  const layer1 = runLayer1(incomingName)
  layersRun.push('normalize')

  // Check for exact matches after normalization
  const exactMatches = existingConnections.filter(conn =>
    layer1.normalized_for_comparison ===
    runLayer1(conn.display_name).normalized_for_comparison
  )

  for (const match of exactMatches) {
    allCandidates.push({
      connection_id: match.id,
      display_name: match.display_name,
      title: match.title,
      city: match.city,
      similarity: 1.0,
      match_layer: 'normalize',
      confidence: 'high',
    })
  }

  // ── Layer 2: Fuzzy Matching ──────────────────────────────────────────
  if (config.fuzzy.enabled && existingConnections.length > 0) {
    layersRun.push('fuzzy')

    // Exclude exact matches already found in Layer 1
    const exactIds = new Set(exactMatches.map(m => m.id))
    const fuzzyPool = existingConnections.filter(c => !exactIds.has(c.id))

    const fuzzyCandidates = findFuzzyCandidates(
      incomingName,
      fuzzyPool,
      { threshold: config.fuzzy.threshold }
    )

    // Optional: confirm high-value fuzzy candidates with AI
    for (const candidate of fuzzyCandidates) {
      if (config.ai.enabled && isAIAvailable() && candidate.confidence === 'medium') {
        const conn = existingConnections.find(c => c.id === candidate.connection_id)
        if (conn) {
          const confirmation = await confirmDuplicatePair(
            incomingName,
            { title: null, city: null },
            conn.display_name,
            { title: conn.title, city: conn.city },
            config
          )

          if (confirmation) {
            // Upgrade or downgrade confidence based on AI assessment
            candidate.confidence = confirmation.confidence
            candidate.match_layer = 'ai'
            layersRun.push('ai')
          }
        }
      }

      allCandidates.push(candidate)
    }
  }

  // ── Layer 3: Full Batch AI Resolution ────────────────────────────────
  // Only runs for batch contexts (post-pilot research, not real-time).
  // Real-time flow uses the pair confirmation above instead.
  const aiGroups =
    config.ai.enabled && isAIAvailable() && existingConnections.length >= 5
      ? await resolveEntityGroups(existingConnections, config)
      : []

  if (aiGroups.length > 0 && !layersRun.includes('ai')) {
    layersRun.push('ai')
  }

  // Deduplicate candidates by connection_id (Layer 2 + AI may overlap)
  const seen = new Set<string>()
  const deduped: DuplicateCandidate[] = []
  for (const c of allCandidates) {
    if (!seen.has(c.connection_id)) {
      seen.add(c.connection_id)
      deduped.push(c)
    }
  }

  return {
    input_name: incomingName,
    normalized_name: layer1.normalized,
    duplicates: deduped.sort((a, b) => b.similarity - a.similarity),
    ai_groups: aiGroups,
    layers_run: [...new Set(layersRun)],
    ran_at: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Tag Standardization
// Run against a user's full tag collection to find duplicates.
// ---------------------------------------------------------------------------

/**
 * Standardize a user's tag collection across all three layers.
 * Returns normalized tags and any duplicate groups found.
 */
export async function standardizeTags(
  rawTags: string[],
  config: StandardizationConfig = DEFAULT_CONFIG
): Promise<TagStandardizationResult> {
  // Layer 1: normalize all tags
  const normalizedTags = normalizeTags(rawTags)

  // Layer 2: fuzzy dedup
  const fuzzyGroups = findDuplicateTags(normalizedTags)
  const mergedTags = normalizeTags(
    // Keep canonical from each group, drop duplicates
    normalizedTags.filter(tag => {
      return !fuzzyGroups.some(g => g.duplicates.includes(tag))
    })
  )

  // Layer 3: semantic synonym detection
  const aiGroups =
    config.ai.enabled && isAIAvailable() && mergedTags.length >= 3
      ? await resolveTagGroups(mergedTags, config)
      : []

  // Apply AI canonical forms if available
  const aiCanonicalTags = mergedTags.map(tag => {
    const group = aiGroups.find(g => g.variants.includes(tag))
    return group ? group.canonical : tag
  })

  return {
    original_tags: rawTags,
    normalized_tags: normalizedTags,
    merged_tags: mergedTags,
    ai_canonical_tags: [...new Set(aiCanonicalTags)],
  }
}

// ---------------------------------------------------------------------------
// Batch Standardization (Research / Post-Pilot)
// Runs all three layers against an entire owner's connection set.
// Not for real-time use — call from the Arrow export pipeline or
// an admin route, not from the connection creation flow.
// ---------------------------------------------------------------------------

export interface BatchStandardizationResult {
  total_connections: number
  exact_duplicate_groups: Array<{ ids: string[]; canonical_name: string }>
  fuzzy_duplicate_groups: Array<{ ids: string[]; similarity: number; names: string[] }>
  ai_entity_groups: Array<{ ids: string[]; canonical: string; reasoning: string }>
  tag_result: TagStandardizationResult
  layers_run: MatchLayer[]
  ran_at: string
}

export async function batchStandardize(
  connections: RawConnection[],
  config: StandardizationConfig = DEFAULT_CONFIG
): Promise<BatchStandardizationResult> {
  const layersRun: MatchLayer[] = ['normalize']

  // ── Layer 1: Find exact-match groups ────────────────────────────────
  const normalizedMap = new Map<string, string[]>()
  for (const conn of connections) {
    const key = runLayer1(conn.display_name).normalized_for_comparison
    if (!normalizedMap.has(key)) normalizedMap.set(key, [])
    normalizedMap.get(key)!.push(conn.id)
  }

  const exactGroups = [...normalizedMap.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([normalized, ids]) => ({
      ids,
      canonical_name: connections.find(c => ids.includes(c.id))?.display_name ?? normalized,
    }))

  // ── Layer 2: Fuzzy groups ────────────────────────────────────────────
  const fuzzyGroups: BatchStandardizationResult['fuzzy_duplicate_groups'] = []

  if (config.fuzzy.enabled) {
    layersRun.push('fuzzy')
    const processed = new Set<string>()

    for (const conn of connections) {
      if (processed.has(conn.id)) continue

      const others = connections.filter(
        c => c.id !== conn.id && !processed.has(c.id)
      )

      const candidates = findFuzzyCandidates(
        conn.display_name,
        others,
        { threshold: config.fuzzy.threshold }
      )

      if (candidates.length > 0) {
        const groupIds = [conn.id, ...candidates.map(c => c.connection_id)]
        fuzzyGroups.push({
          ids: groupIds,
          similarity: candidates[0].similarity,
          names: [conn.display_name, ...candidates.map(c => c.display_name)],
        })
        groupIds.forEach(id => processed.add(id))
      }
    }
  }

  // ── Layer 3: AI entity groups ────────────────────────────────────────
  let aiGroups: BatchStandardizationResult['ai_entity_groups'] = []

  if (config.ai.enabled && isAIAvailable()) {
    layersRun.push('ai')
    const resolved = await resolveEntityGroups(connections, config)
    aiGroups = resolved.map(g => ({
      ids: g.connection_ids,
      canonical: g.canonical,
      reasoning: g.reasoning,
    }))
  }

  // ── Tags ─────────────────────────────────────────────────────────────
  const allTags = connections.flatMap(c => c.tags)
  const tagResult = await standardizeTags(allTags, config)

  return {
    total_connections: connections.length,
    exact_duplicate_groups: exactGroups,
    fuzzy_duplicate_groups: fuzzyGroups,
    ai_entity_groups: aiGroups,
    tag_result: tagResult,
    layers_run: [...new Set(layersRun)],
    ran_at: new Date().toISOString(),
  }
}
