# Equalpoint + SODA — Entity Standardization

Source, architecture, and implementation guide.

---

## 1. Source: AI-Powered Knowledge Graph Generator

The entity standardization system draws its core design from the open-source project [ai-knowledge-graph](https://github.com/robert-mcdermott/ai-knowledge-graph) by Robert McDermott. The project takes unstructured text documents and uses an LLM to extract Subject-Predicate-Object (SPO) triplets, then visualizes the relationships as an interactive knowledge graph.

### 1.1 What the Source Project Does

The source project runs a four-phase pipeline. Phase 1 chunks input text and extracts SPO triplets per chunk via LLM. Phase 2 standardizes entity names across all chunks, resolving "AI", "artificial intelligence", and "AI system" into one canonical node. Phase 3 infers relationships between disconnected graph communities that were not explicitly stated in the text. Phase 4 generates an interactive HTML visualization using PyVis with Louvain community detection.

### 1.2 What Equalpoint Borrows

Equalpoint does not use the source project directly. It adapts the entity standardization logic from Phase 2 into a TypeScript system suited to a real-time web application. Three specific ideas carry over: the three-pass funnel (text normalization, fuzzy matching, LLM resolution) as a layered, progressively intelligent approach; the LLM-assisted entity grouping prompt pattern, which sends a batch of unique names and asks for groups that refer to the same real-world entity; and the graceful degradation principle, where the LLM layer is optional and the system produces useful results without it.

### 1.3 Why This Matters for SODA

SODA collects freeform display_name entries at QR scan time during live events. Pilot 1 (Coffee Connect, 19 attendees) produced 145 matches. Pilot 3 (BTW Cincinnati, est. 200 attendees) is projected to produce 1,500 or more connection events across three days. Without standardization, the same person can exist as five separate nodes in the relationship graph, each with its own warmth decay timer. The entity standardization system resolves this before it compounds into a data quality problem at launch.

> **Key insight.** Competitors automate the writing. Equalpoint automates the remembering. Entity standardization is what makes the remembering reliable.

---

## 2. Architecture: The Three-Layer Funnel

The system runs three layers in sequence. Each layer is independent. Each layer catches what the previous one missed. The engine orchestrates all three and exposes a single interface to the rest of the application.

| Layer | Cost | Speed | When runs | What it catches |
|---|---|---|---|---|
| Layer 1: Normalize | Free | Instant | At write time | "Mike Johnson." vs "mike johnson" |
| Layer 2: Fuzzy | Free | Fast | At read time | "Mike" vs "Michael", typos, word order |
| Layer 3: AI | API cost | Async | Optional / batch | "BTW" vs "Black Tech Week", semantic synonyms |

### 2.1 Layer 1: Text Normalization

Layer 1 runs synchronously at write time via both a Supabase database trigger and a TypeScript helper. It is always active and costs nothing. It catches the easy duplicates before they ever hit the database.

**Catches:** "Mike Johnson." vs "mike johnson" · double spaces · trailing punctuation · case variants

**Does not catch:** "Michael Johnson" vs "Mike Johnson" · "AI" vs "Artificial Intelligence" · semantic synonyms

The Supabase trigger and the TypeScript helper must stay in sync. If you change the normalization logic in code, update the SQL function.

```typescript
// lib/standardization/layer1-normalize.ts
export function normalizeName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s'\-\.]/g, '')
    .replace(/\.$/, '')
    .trim()
}
```

### 2.2 Layer 2: Fuzzy Matching

Layer 2 runs at read time when a new connection is created. It checks the incoming display_name against all existing connections for that owner using three string similarity algorithms. The highest score across all three determines whether a candidate is surfaced.

**Catches:** "Mike" vs "Michael" · "Johnson Mike" vs "Mike Johnson" · "Equallpoint" vs "Equalpoint"

**Does not catch:** "AI" vs "Artificial Intelligence" · "founder" vs "entrepreneur" · semantic concepts

Three algorithms run in parallel. The maximum score wins.

- **Jaro-Winkler** gives bonus score for matching prefixes. Best for person names where the first few characters are the most identifying.
- **Token Sort** sorts words alphabetically before comparing. Catches "Johnson Mike" vs "Mike Johnson".
- **Levenshtein** counts character edits. Best for typos and minor spelling variants.

Confidence thresholds:

- **0.92 and above** — "Very likely" (high confidence) — show merge prompt prominently
- **0.75 to 0.91** — "Possibly" (medium confidence) — show as suggestion
- **0.60 to 0.74** — "Maybe" (low confidence) — logged, not surfaced to user

### 2.3 Layer 3: Claude AI Resolution

Layer 3 activates automatically when `ANTHROPIC_API_KEY` is set in Doppler. It catches semantic equivalences that string math cannot detect. The AI layer runs in two modes.

**Catches:** "BTW" vs "Black Tech Week" · "Mike" vs "Michael" (nickname) · "warmth score" vs "relationship health"

- **Pair confirmation** runs in real time for medium-confidence Layer 2 matches. Asks Claude whether two specific names refer to the same person, using title and city as additional context.
- **Batch resolution** runs post-pilot against the full connection set. Sends up to 50 unique names per call and asks Claude to group them. Used by Nelson for Study One research data cleaning.

> **Rule.** Layer 3 is optional. Remove `ANTHROPIC_API_KEY` and Layers 1 and 2 continue running without any code change. The system degrades safely.

### 2.4 The Engine

The engine (`engine.ts`) is the single interface for all standardization work. Callers import `standardizeName()` for real-time connection creation checks, or `batchStandardize()` for post-pilot research. The engine coordinates all three layers, deduplicates candidates, and returns a typed `StandardizationResult`.

> **Rule.** The engine surfaces candidates. It never merges connections. Merging requires explicit user action via `DuplicateWarningBanner` and the merge API route. This mirrors the two-call draft approval gate from the AI layer.

---

## 3. Implementation Files

Nine files implement the full system.

| File | Layer | Location in codebase |
|---|---|---|
| `types.ts` | All | `lib/standardization/types.ts` |
| `layer1-normalize.ts` | Layer 1 | `lib/standardization/layer1-normalize.ts` |
| `layer2-fuzzy.ts` | Layer 2 | `lib/standardization/layer2-fuzzy.ts` |
| `layer3-ai.ts` | Layer 3 | `lib/standardization/layer3-ai.ts` |
| `engine.ts` | Orchestrator | `lib/standardization/engine.ts` |
| `standardize/route.ts` | API | `app/api/connections/standardize/route.ts` |
| `merge/route.ts` | API | `app/api/connections/merge/route.ts` |
| `DuplicateWarningBanner.tsx` | UI | `components/DuplicateWarningBanner.tsx` |
| `migration_standardization.sql` | DB | Run in Supabase SQL Editor |

### 3.1 types.ts

Defines all shared TypeScript types used across the system. Key types include `RawConnection` (the input shape from Supabase), `DuplicateCandidate` (a single match with similarity score, layer, and confidence), `EntityGroup` (an AI-resolved group of equivalent entities), and `StandardizationConfig` (runtime configuration with `DEFAULT_CONFIG`). All layers import from this file.

### 3.2 layer1-normalize.ts

Pure functions with zero dependencies. Exports `normalizeName()`, `normalizeForComparison()`, `normalizeTags()`, and `runLayer1()`. The file also contains the Supabase SQL trigger as a comment block for easy copying into the SQL Editor. The TypeScript and SQL logic must stay in sync.

### 3.3 layer2-fuzzy.ts

Implements all three similarity algorithms (Jaro-Winkler, Token Sort, Levenshtein) from scratch with no external dependencies. The main export `findFuzzyCandidates()` takes an incoming name and the owner's existing connections and returns scored candidates above the threshold. Also exports `findDuplicateTags()` for tag deduplication.

### 3.4 layer3-ai.ts

All functions check `isAIAvailable()` before instantiating the Anthropic client. If the API key is absent, all functions return empty results without throwing. Key exports: `resolveEntityGroups()` for batch name resolution, `resolveTagGroups()` for tag synonym detection, `confirmDuplicatePair()` for real-time pair confirmation. All Claude calls use the model from `process.env.CLAUDE_DRAFT_MODEL`, defaulting to `claude-haiku-4-5-20251001`.

### 3.5 engine.ts

Orchestrates all three layers. `standardizeName()` is the real-time entry point called on connection creation. `batchStandardize()` is the research entry point called post-pilot by Nelson's Arrow export pipeline. `standardizeTags()` cleans a user's full tag collection. The engine deduplicates across layers so the same `connection_id` is never returned twice.

### 3.6 API Routes

Two routes. `POST /api/connections/standardize` is the check endpoint — it reads existing connections and returns `StandardizationResult` with no DB writes. `PATCH /api/connections/merge` is the action endpoint — it moves history from source to target, archives the source, updates the canonical `display_name`, and logs the merge in `connection_history`. Both routes verify `owner_id` before any operation.

### 3.7 DuplicateWarningBanner.tsx

A client component rendered inside the connection creation form. It displays high and medium confidence candidates as selectable cards. When a user selects a candidate, a name picker appears letting them choose which `display_name` to keep. The "Yes, merge them" button calls the merge API route. "No, these are different people" dismisses the banner and proceeds with the original connection creation. The banner shows "Checked with AI + fuzzy matching" or "Checked with fuzzy matching" based on AI availability.

### 3.8 migration_standardization.sql

Contains three objects to create in Supabase: the `normalize_connection_fields()` trigger function, the trigger itself bound to `BEFORE INSERT OR UPDATE` on the connections table, and two indexes (one on `owner_id` + `display_name`, one GIN index on `tags`). Also contains a commented backfill query to normalize existing records, which should be run once and then removed.

---

## 4. Request Flow

### 4.1 Real-Time Flow (Connection Creation)

This flow runs every time a user creates a new connection in SODA or Equalpoint.

```
User types display_name in connection form
  → FE calls POST /api/connections/standardize
      Layer 1 runs: normalize input + find exact matches
      Layer 2 runs: fuzzy match against owner's existing connections
      Layer 3 runs: confirm medium-confidence pairs (if AI available)
      Returns: StandardizationResult

  → If result.duplicates.length > 0:
      DuplicateWarningBanner renders
      User selects "same person" → PATCH /api/connections/merge
      User selects "different person" → POST /api/connections (original flow)

  → If result.duplicates.length === 0:
      POST /api/connections (original flow, no interruption)
      Supabase trigger normalizes display_name on write
```

### 4.2 Batch Flow (Post-Pilot Research)

This flow runs after each pilot event as part of the Arrow export pipeline.

```
Nelson runs: python arrow/export.py --pilot 3 --event btw-cincinnati
  → Pulls connections + history from Supabase
  → Writes Parquet files to ./data/

Nelson runs: python arrow/analysis.py --data ./data --pilot 3
  → Loads Parquet files
  → Calls batchStandardize() via engine.ts
      Layer 1: exact duplicate groups
      Layer 2: fuzzy duplicate groups
      Layer 3: AI entity groups (full batch, 50 names per call)
  → Returns BatchStandardizationResult
  → Study One analysis runs on clean, deduplicated dataset
```

---

## 5. Non-Negotiable Rules

All seven rules from the Equalpoint SKILL.md apply to this system. Three have specific implications for entity standardization.

> **Rule 2 — RLS on every table.** The standardize route reads only connections where `owner_id = userId`. The merge route verifies ownership of both source and target before any write. No cross-user data access is possible.

> **Rule 4 — The approval gate is two calls.** `POST /api/connections/standardize` checks only. `PATCH /api/connections/merge` acts only. They are never merged. The UI always sits between them.

> **Rule 6 — Secrets via Doppler.** `ANTHROPIC_API_KEY` is never committed. `layer3-ai.ts` reads from `process.env` only. If the key is absent the layer silently skips.

One additional rule specific to standardization:

> **Never auto-merge.** The user is always the final decision-maker. `DuplicateWarningBanner` requires explicit confirmation before calling the merge route. This applies even to high-confidence matches.

---

## 6. Deployment Sequence

Deploy in this exact order. Each step depends on the previous.

| Step | Action | What it does | Owner |
|---|---|---|---|
| 1 | Run `migration_standardization.sql` | Adds normalization trigger + indexes to Supabase | Nelson |
| 2 | Deploy TypeScript files | Activates Layers 1 and 2 in the connection creation flow | Brent |
| 3 | Add `ANTHROPIC_API_KEY` to Doppler | Activates Layer 3 automatically (no code change) | Brent |
| 4 | Run backfill SQL (one-time) | Normalizes all existing `display_name` records | Nelson |
| 5 | Monitor `DuplicateWarningBanner` | Validate confidence thresholds with real BTW data | Alysha |

### 6.1 Before BTW Cincinnati (July 14-16, 2026)

Run `migration_standardization.sql` in Supabase (Step 1). The trigger and indexes activate immediately. Data written from this point forward is normalized at the DB level.

Deploy TypeScript files with the next build (Step 2). The standardize route and `DuplicateWarningBanner` activate in the connection creation flow.

Run the backfill query once (Step 4). Normalizes all existing `display_name` records from Pilots 1 and 2. Comment out after running.

### 6.2 Before September 14 Launch

Confirm `ANTHROPIC_API_KEY` is in Doppler production config (Step 3). Layer 3 activates automatically.

Monitor `DuplicateWarningBanner` threshold performance (Step 5). Adjust the fuzzy threshold in `DEFAULT_CONFIG` if BTW data shows too many false positives or missed duplicates.

### 6.3 Post-BTW (July 17+, 2026)

Nelson runs the Arrow export against the BTW date range. Three Parquet files land in `./data/` as the Pilot 3 research artifact.

Nelson runs `analysis.py` to produce Study One findings. The batch standardization pass cleans the research dataset before analysis runs.

---

## 7. SODA-Specific Notes

### 7.1 SODA-EMBED-002 Compatibility

The entity standardization system operates within SODA's ambient nudge constraint. The `DuplicateWarningBanner` is a user-initiated UI element that appears only during connection creation, not as an ambient notification. It does not violate the Ghost language lockout. The standardization API routes do not emit push notifications.

### 7.2 Chip System Interaction

The seven chip types (capital, talent, customers, knowledge, community, resources, creative) are enum values with no freeform text. They do not require standardization. Tag standardization (Layer 2 `findDuplicateTags`, Layer 3 `resolveTagGroups`) applies to the `tags` jsonb field on connections, not to `chip_type` values in the `loop_events` ledger.

### 7.3 Study One Data Integrity

The `loop_events` ledger is append-only. Entity standardization does not write to `loop_events`. It operates on the `connections` and `connection_history` tables only. Study One analysis uses the Parquet export of `loop_events` as its primary source, and uses the batch standardization output from connection data as a supplementary research artifact for understanding identity resolution quality across the pilot cohort.

---

## 8. Future Considerations

### 8.1 pgvector Integration (Season 2)

The Semantic Connection Search feature already plans to use pgvector for embedding-based similarity search. When that infrastructure is in place, Layer 2 fuzzy matching can be supplemented with vector similarity against name embeddings stored in Supabase. This would catch "Mike" vs "Michael" at the DB layer without a separate Python fuzzy matching pass. The engine interface remains unchanged; only the Layer 2 implementation evolves.

### 8.2 Apache Spark Integration (Season 3)

When the user base grows past tens of thousands, the batch standardization pass becomes a Spark job. The Parquet files produced by the Arrow export are already Spark-readable. The `batchStandardize()` function signature maps cleanly to a Spark DataFrame transform. No architectural changes are required; the engine becomes the interface to a distributed computation.

### 8.3 Feedback Loop

Every user decision in `DuplicateWarningBanner` (merge or dismiss) is a labeled training signal. When the user confirms a merge, that is a true positive. When the user dismisses, that is a false positive. These signals should eventually feed back into the confidence thresholds and potentially fine-tune the Layer 3 prompt. The merge API route logs the merge in `connection_history` with metadata that makes these signals recoverable from the Parquet export.

---

## Appendix: Quick Reference

### API Endpoints Added

- **`POST /api/connections/standardize`** — Check for duplicates (no DB write). Body: `{ display_name }`. Returns `StandardizationResult`.
- **`PATCH /api/connections/merge`** — Merge two connections (writes DB). Body: `{ source_id, target_id, canonical_name }`. Returns `{ ok, merged_into, canonical_name }`.

### Environment Variables

- **`ANTHROPIC_API_KEY`** — Activates Layer 3. Set in Doppler. Required for AI pair confirmation and batch resolution. Optional at runtime.
- **`CLAUDE_DRAFT_MODEL`** — Specifies the Claude model for Layer 3 calls. Defaults to `claude-haiku-4-5-20251001`.

### Confidence Threshold Quick Reference

- **0.92+** — High — `DuplicateWarningBanner` shows "Very likely" pill. Merge prompt is prominent.
- **0.75–0.91** — Medium — Banner shows "Possibly" pill. Layer 3 confirmation runs if AI available.
- **0.60–0.74** — Low — Not surfaced in UI. Available in `StandardizationResult.duplicates` for logging.
- **Below 0.60** — Not a candidate. Filtered out before the result is returned.

### Pilot Sequencing Reference

- **Pilot 1** — Coffee Connect — June 17, 2026 — 19 attendees, 145 matches, 62 mutual
- **Pilot 2** — Latinos N Tech — July 9, 2026 — 25 sign-ins, 50+ physically present
- **Pilot 3** — BTW Cincinnati — July 14-16, 2026 — founding Study One dataset
- **Launch** — September 14, 2026 — Futureland 4th anniversary

---

*Document prepared June 2026. Equalpoint Inc. (Delaware C-Corp) and Futureland Inc. (Cleveland 501(c)(3)). Confidential.*
