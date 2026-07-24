// lib/standardization/layer2-fuzzy.ts
//
// Layer 2 — Fuzzy Matching
// ----------------------------------------
// No AI. Pure string math. Runs at read time when a new connection
// is created — checks existing connections for near-duplicates.
//
// Three algorithms, each catching different failure modes:
//
//   Jaro-Winkler   → "Mike Johnson" vs "Michael Johnson" (prefix-aware)
//   Token Sort     → "Johnson Mike" vs "Mike Johnson" (word order variants)
//   Levenshtein    → "Equalpoint" vs "Equallpoint" (typos, single char edits)
//
// We run all three and take the MAX score — most generous wins.
// If max ≥ threshold → candidate is a potential duplicate.

import {
  normalizeForComparison,
  normalizeTags,
  normalizeTag,
} from './layer1-normalize'
import type {
  RawConnection,
  DuplicateCandidate,
  ConfidenceLevel,
} from './types'

// ---------------------------------------------------------------------------
// Jaro-Winkler Distance
// Best for person names — gives bonus score for matching prefixes.
// "Mike" vs "Michael" → higher score than Levenshtein because "Mich" matches "Mike" prefix.
// ---------------------------------------------------------------------------

function jaroSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0
  if (s1.length === 0 || s2.length === 0) return 0.0

  const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1
  const s1Matches = new Array(s1.length).fill(false)
  const s2Matches = new Array(s2.length).fill(false)

  let matches = 0
  let transpositions = 0

  for (let i = 0; i < s1.length; i++) {
    const start = Math.max(0, i - matchDistance)
    const end = Math.min(i + matchDistance + 1, s2.length)

    for (let j = start; j < end; j++) {
      if (s2Matches[j] || s1[i] !== s2[j]) continue
      s1Matches[i] = true
      s2Matches[j] = true
      matches++
      break
    }
  }

  if (matches === 0) return 0.0

  let k = 0
  for (let i = 0; i < s1.length; i++) {
    if (!s1Matches[i]) continue
    while (!s2Matches[k]) k++
    if (s1[i] !== s2[k]) transpositions++
    k++
  }

  return (
    (matches / s1.length +
      matches / s2.length +
      (matches - transpositions / 2) / matches) /
    3
  )
}

export function jaroWinklerSimilarity(s1: string, s2: string, p = 0.1): number {
  const jaro = jaroSimilarity(s1, s2)

  // Count matching prefix (max 4 chars)
  let prefixLength = 0
  for (let i = 0; i < Math.min(4, Math.min(s1.length, s2.length)); i++) {
    if (s1[i] === s2[i]) prefixLength++
    else break
  }

  return jaro + prefixLength * p * (1 - jaro)
}

// ---------------------------------------------------------------------------
// Token Sort Ratio
// Best for name-order variants: "Johnson Mike" vs "Mike Johnson"
// Splits into tokens, sorts them, joins, then compares.
// ---------------------------------------------------------------------------

function tokenSortSimilarity(s1: string, s2: string): number {
  const tokens1 = s1.split(/\s+/).sort().join(' ')
  const tokens2 = s2.split(/\s+/).sort().join(' ')
  return jaroWinklerSimilarity(tokens1, tokens2)
}

// ---------------------------------------------------------------------------
// Levenshtein Distance → normalized to similarity score
// Best for typos: "Equallpoint" vs "Equalpoint"
// ---------------------------------------------------------------------------

function levenshteinDistance(s1: string, s2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2[i - 1] === s1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,  // substitution
          matrix[i][j - 1] + 1,       // insertion
          matrix[i - 1][j] + 1        // deletion
        )
      }
    }
  }

  return matrix[s2.length][s1.length]
}

export function levenshteinSimilarity(s1: string, s2: string): number {
  const distance = levenshteinDistance(s1, s2)
  const maxLength = Math.max(s1.length, s2.length)
  if (maxLength === 0) return 1.0
  return 1 - distance / maxLength
}

// ---------------------------------------------------------------------------
// Combined Score
// Run all three, take the max. Most generous interpretation wins.
// This minimizes false negatives (missing a real duplicate)
// at the cost of some false positives (showing a merge prompt unnecessarily).
// Users are always the final decision-maker — never auto-merge.
// ---------------------------------------------------------------------------

export function combinedSimilarity(a: string, b: string): number {
  const a_norm = normalizeForComparison(a)
  const b_norm = normalizeForComparison(b)

  if (a_norm === b_norm) return 1.0  // Layer 1 would have caught this
  if (a_norm.length === 0 || b_norm.length === 0) return 0.0

  const scores = [
    jaroWinklerSimilarity(a_norm, b_norm),
    tokenSortSimilarity(a_norm, b_norm),
    levenshteinSimilarity(a_norm, b_norm),
  ]

  return Math.max(...scores)
}

// ---------------------------------------------------------------------------
// Confidence Mapping
// ---------------------------------------------------------------------------

export function scoreToConfidence(score: number): ConfidenceLevel {
  if (score >= 0.92) return 'high'
  if (score >= 0.75) return 'medium'
  return 'low'
}

// ---------------------------------------------------------------------------
// Main Layer 2 Function
// Run against existing connections for a given owner when a new
// connection is created.
// ---------------------------------------------------------------------------

export interface Layer2Options {
  threshold?: number   // minimum similarity to surface (default 0.75)
  limit?: number       // max candidates to return (default 5)
}

/**
 * Find potential duplicate connections for a given name
 * by running fuzzy matching against all existing connections for that owner.
 *
 * Returns candidates sorted by similarity descending.
 * Only returns candidates above the threshold.
 */
export function findFuzzyCandidates(
  incomingName: string,
  existingConnections: RawConnection[],
  options: Layer2Options = {}
): DuplicateCandidate[] {
  const threshold = options.threshold ?? 0.75
  const limit = options.limit ?? 5

  const candidates: DuplicateCandidate[] = []

  for (const conn of existingConnections) {
    // Skip exact matches — Layer 1 already flagged those
    if (normalizeForComparison(conn.display_name) === normalizeForComparison(incomingName)) {
      continue
    }

    const score = combinedSimilarity(incomingName, conn.display_name)

    if (score >= threshold) {
      candidates.push({
        connection_id: conn.id,
        display_name: conn.display_name,
        title: conn.title,
        city: conn.city,
        similarity: Math.round(score * 1000) / 1000, // round to 3 decimal places
        match_layer: 'fuzzy',
        confidence: scoreToConfidence(score),
      })
    }
  }

  return candidates
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

// ---------------------------------------------------------------------------
// Tag Fuzzy Deduplication
// Finds tags in a user's collection that are near-duplicates.
// "startup founder" vs "founder startup" → same after token sort
// "tech" vs "technology" → Layer 3 needed, below fuzzy threshold
// ---------------------------------------------------------------------------

export interface TagDuplicateGroup {
  canonical: string         // the shortest/most common form
  duplicates: string[]      // the other forms that match
  score: number
}

export function findDuplicateTags(tags: string[]): TagDuplicateGroup[] {
  const normalized = tags.map(normalizeTag)
  const groups: TagDuplicateGroup[] = []
  const processed = new Set<number>()

  for (let i = 0; i < normalized.length; i++) {
    if (processed.has(i)) continue

    const group: string[] = []

    for (let j = i + 1; j < normalized.length; j++) {
      if (processed.has(j)) continue

      const score = combinedSimilarity(normalized[i], normalized[j])
      if (score >= 0.85) {
        group.push(tags[j])
        processed.add(j)
      }
    }

    if (group.length > 0) {
      groups.push({
        canonical: tags[i],   // keep first occurrence as canonical
        duplicates: group,
        score: Math.max(...group.map(g => combinedSimilarity(normalized[i], normalizeTag(g)))),
      })
      processed.add(i)
    }
  }

  return groups
}
