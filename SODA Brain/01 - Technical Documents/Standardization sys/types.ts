// lib/standardization/types.ts
//
// Entity Standardization — Shared Types
// ----------------------------------------
// Used across all three layers (normalize, fuzzy, AI).
// The StandardizationEngine is the single interface — callers
// never need to know which layers are active.

export interface RawConnection {
  id: string
  owner_id: string
  display_name: string
  title: string | null
  city: string | null
  tags: string[]
  meeting_context: string | null
}

// A candidate match — one potentially duplicate connection
export interface DuplicateCandidate {
  connection_id: string
  display_name: string
  title: string | null
  city: string | null
  similarity: number           // 0.0 → 1.0
  match_layer: MatchLayer      // which layer found it
  confidence: ConfidenceLevel
}

// Which layer detected the match
export type MatchLayer =
  | 'normalize'   // Layer 1: text normalization caught it (exact after cleaning)
  | 'fuzzy'       // Layer 2: edit distance / token match
  | 'ai'          // Layer 3: Claude resolved it semantically

export type ConfidenceLevel =
  | 'high'    // ≥ 0.92 — very likely same person, show merge prompt
  | 'medium'  // 0.75–0.91 — probably same, ask user
  | 'low'     // 0.60–0.74 — maybe same, surface as suggestion only

// The result surface to the UI
export interface StandardizationResult {
  input_name: string
  normalized_name: string          // what Layer 1 produced
  duplicates: DuplicateCandidate[] // sorted by similarity desc
  ai_groups: EntityGroup[]         // Layer 3 output (empty if AI not available)
  layers_run: MatchLayer[]         // which layers actually executed
  ran_at: string                   // ISO timestamp
}

// Layer 3 output — a group of entities the LLM says are the same
export interface EntityGroup {
  canonical: string              // the best/most complete form
  variants: string[]             // all the other forms in this group
  connection_ids: string[]       // which connection records are affected
  reasoning: string              // why the LLM thinks these match
}

// Tag standardization result
export interface TagStandardizationResult {
  original_tags: string[]
  normalized_tags: string[]      // after Layer 1
  merged_tags: string[]          // after fuzzy dedup
  ai_canonical_tags: string[]    // after Layer 3 (if available)
}

// Config passed into the engine
export interface StandardizationConfig {
  // Layer 1 always runs — no config needed
  fuzzy: {
    enabled: boolean
    threshold: number            // 0.0–1.0, default 0.80
    algorithm: 'levenshtein' | 'token_sort' | 'jaro_winkler'
  }
  ai: {
    enabled: boolean             // false if ANTHROPIC_API_KEY not set
    model: string                // default: claude-haiku-4-5-20251001
    max_entities_per_call: number // default: 50 (stay under context limits)
  }
}

export const DEFAULT_CONFIG: StandardizationConfig = {
  fuzzy: {
    enabled: true,
    threshold: 0.80,
    algorithm: 'jaro_winkler',
  },
  ai: {
    enabled: !!process.env.ANTHROPIC_API_KEY,
    model: process.env.CLAUDE_DRAFT_MODEL ?? 'claude-haiku-4-5-20251001',
    max_entities_per_call: 50,
  },
}
