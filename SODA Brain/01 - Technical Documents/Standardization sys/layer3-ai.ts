// lib/standardization/layer3-ai.ts
//
// Layer 3 — Claude AI Resolution
// ----------------------------------------
// Only runs when ANTHROPIC_API_KEY is set in the environment.
// If the key is missing → layer returns empty results gracefully.
// Layers 1 and 2 still run. The system degrades safely.
//
// What Layer 3 catches that Layers 1 & 2 cannot:
//   "AI" vs "Artificial Intelligence"           (abbreviation → full form)
//   "Mike" vs "Michael"                          (nickname → formal name)
//   "warmth score" vs "relationship health"      (synonym concepts)
//   "BTW" vs "Black Tech Week"                   (acronym → full name)
//   "founder" vs "entrepreneur"                  (semantic equivalents in tags)
//
// The key rule: Layer 3 surfaces suggestions only.
// Nothing is merged without explicit user confirmation.
// This mirrors the two-call approval gate pattern from the AI layer.

import Anthropic from '@anthropic-ai/sdk'
import type {
  RawConnection,
  EntityGroup,
  StandardizationConfig,
} from './types'
import { normalizeForComparison } from './layer1-normalize'

// ---------------------------------------------------------------------------
// AI Availability Check
// ---------------------------------------------------------------------------

/**
 * Returns true if the AI layer can run.
 * Called before any Anthropic client is instantiated.
 */
export function isAIAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
}

// ---------------------------------------------------------------------------
// Entity Group Resolution
// Sends a batch of unique names to Claude and asks it to find groups
// that refer to the same real-world entity.
// ---------------------------------------------------------------------------

const ENTITY_RESOLUTION_PROMPT = `You are an entity resolution expert for a professional networking application.

You will receive a list of names extracted from a user's connection database.
Your job is to identify groups of names that likely refer to the SAME real person.

Rules:
- Only group names if you are reasonably confident they are the same person
- Consider: nicknames (Mike/Michael), name order variants (Johnson Mike / Mike Johnson), missing middle names
- Do NOT group names just because they sound similar or share a last name
- Each name can only appear in ONE group
- Names not in any group are unique — do not include them in output
- Return ONLY valid JSON, no commentary, no markdown

Return this exact JSON structure:
{
  "groups": [
    {
      "canonical": "the most complete/formal version of the name",
      "variants": ["other versions of the same name"],
      "reasoning": "one sentence explaining why these match"
    }
  ]
}

If no groups are found, return: { "groups": [] }`

const TAG_RESOLUTION_PROMPT = `You are a taxonomy expert for a professional networking application.

You will receive a list of tags that users have applied to their connections.
Your job is to identify groups of tags that mean the same thing or are close synonyms.

Rules:
- Only group tags if they clearly mean the same concept in a professional context
- Consider: "founder" and "entrepreneur" (same concept), "vc" and "venture capital" (abbreviation)
- Do NOT group tags that have meaningfully different professional implications
- Return ONLY valid JSON, no commentary, no markdown

Return this exact JSON structure:
{
  "groups": [
    {
      "canonical": "the clearest/most common version of this tag",
      "variants": ["other versions"],
      "reasoning": "one sentence explaining the grouping"
    }
  ]
}

If no groups are found, return: { "groups": [] }`

// ---------------------------------------------------------------------------
// Name Resolution
// ---------------------------------------------------------------------------

/**
 * Ask Claude to find entity groups among a list of connection names.
 * Returns EntityGroup[] — each group is a set of names that are the same person.
 *
 * Batches requests to stay within max_entities_per_call config.
 * Returns empty array if AI is not available — never throws.
 */
export async function resolveEntityGroups(
  connections: RawConnection[],
  config: StandardizationConfig
): Promise<EntityGroup[]> {
  if (!isAIAvailable() || !config.ai.enabled) {
    return []
  }

  const client = new Anthropic()
  const allGroups: EntityGroup[] = []

  // Build unique name list with connection IDs for later mapping
  const nameToIds = new Map<string, string[]>()
  for (const conn of connections) {
    const key = normalizeForComparison(conn.display_name)
    if (!nameToIds.has(key)) {
      nameToIds.set(key, [])
    }
    nameToIds.get(key)!.push(conn.id)
  }

  const uniqueNames = [...nameToIds.keys()]

  // Batch into chunks to stay within token limits
  const batchSize = config.ai.max_entities_per_call
  const batches: string[][] = []
  for (let i = 0; i < uniqueNames.length; i += batchSize) {
    batches.push(uniqueNames.slice(i, i + batchSize))
  }

  for (const batch of batches) {
    try {
      const nameList = batch.map((n, i) => `${i + 1}. ${n}`).join('\n')

      const response = await client.messages.create({
        model: config.ai.model,
        max_tokens: 1000,
        system: ENTITY_RESOLUTION_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Here are the connection names to analyze:\n\n${nameList}`,
          },
        ],
      })

      const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
      const parsed = safeParseJSON<{ groups: Array<{canonical: string; variants: string[]; reasoning: string}> }>(rawText)

      if (parsed?.groups) {
        for (const group of parsed.groups) {
          // Map canonical + variants back to connection IDs
          const allNamesInGroup = [group.canonical, ...group.variants]
          const connectionIds = allNamesInGroup.flatMap(
            name => nameToIds.get(normalizeForComparison(name)) ?? []
          )

          if (connectionIds.length > 1) {
            allGroups.push({
              canonical: group.canonical,
              variants: group.variants,
              connection_ids: connectionIds,
              reasoning: group.reasoning,
            })
          }
        }
      }
    } catch (err) {
      // Layer 3 failure is non-fatal — log and continue
      console.error('[standardization/layer3] Entity resolution batch failed:', err)
    }
  }

  return allGroups
}

// ---------------------------------------------------------------------------
// Tag Resolution
// ---------------------------------------------------------------------------

/**
 * Ask Claude to find synonym groups among a user's tags.
 * Returns groups of tags that mean the same thing.
 *
 * Returns empty array if AI is not available — never throws.
 */
export async function resolveTagGroups(
  tags: string[],
  config: StandardizationConfig
): Promise<Array<{ canonical: string; variants: string[]; reasoning: string }>> {
  if (!isAIAvailable() || !config.ai.enabled || tags.length < 2) {
    return []
  }

  const client = new Anthropic()

  try {
    const tagList = tags.map((t, i) => `${i + 1}. ${t}`).join('\n')

    const response = await client.messages.create({
      model: config.ai.model,
      max_tokens: 800,
      system: TAG_RESOLUTION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Here are the tags to analyze:\n\n${tagList}`,
        },
      ],
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = safeParseJSON<{ groups: Array<{canonical: string; variants: string[]; reasoning: string}> }>(rawText)

    return parsed?.groups ?? []
  } catch (err) {
    console.error('[standardization/layer3] Tag resolution failed:', err)
    return []
  }
}

// ---------------------------------------------------------------------------
// Duplicate Pair Confirmation
// Used when Layers 1/2 found a candidate and we want Claude to
// confirm or deny the match before showing a UI prompt.
// Reduces false positives without requiring a full batch call.
// ---------------------------------------------------------------------------

export interface ConfirmationResult {
  is_same_person: boolean
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
}

/**
 * Ask Claude whether two specific names refer to the same person.
 * Used to filter Layer 2 candidates before surfacing them in the UI.
 *
 * Returns null if AI is not available — caller falls back to Layer 2 score alone.
 */
export async function confirmDuplicatePair(
  nameA: string,
  contextA: { title?: string | null; city?: string | null },
  nameB: string,
  contextB: { title?: string | null; city?: string | null },
  config: StandardizationConfig
): Promise<ConfirmationResult | null> {
  if (!isAIAvailable() || !config.ai.enabled) {
    return null
  }

  const client = new Anthropic()

  const prompt = `Are these two connection records likely the same person?

Person A: "${nameA}"${contextA.title ? `, ${contextA.title}` : ''}${contextA.city ? `, ${contextA.city}` : ''}
Person B: "${nameB}"${contextB.title ? `, ${contextB.title}` : ''}${contextB.city ? `, ${contextB.city}` : ''}

Consider: nicknames, formal vs informal names, name order variants, typos.
Also consider: if titles or cities differ significantly, they may be different people.

Return ONLY valid JSON:
{
  "is_same_person": true or false,
  "confidence": "high" or "medium" or "low",
  "reasoning": "one sentence"
}`

  try {
    const response = await client.messages.create({
      model: config.ai.model,
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
    return safeParseJSON<ConfirmationResult>(rawText)
  } catch (err) {
    console.error('[standardization/layer3] Pair confirmation failed:', err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Safe JSON Parser
// Layer 3 responses are expected to be JSON but LLMs can produce
// markdown fences or extra whitespace. Strip and parse safely.
// ---------------------------------------------------------------------------

function safeParseJSON<T>(raw: string): T | null {
  try {
    // Strip markdown code fences if present
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim()

    return JSON.parse(cleaned) as T
  } catch {
    return null
  }
}
