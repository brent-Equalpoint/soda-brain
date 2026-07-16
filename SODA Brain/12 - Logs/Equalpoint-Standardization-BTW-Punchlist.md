# Equalpoint Standardization — Two Fixes Before BTW (Punch-List for Nelson)

*Two correctness fixes in the entity standardization system, both gating the BTW Cincinnati pilot
(July 14 to 16). Each is small and self-contained. Reviewed 2026-06-30. Files live in Equalpoint's
`lib/standardization/`. Placement and schema-reconciliation questions are separate and can wait; these
two are correctness and should land first.*

---

## Fix 1 (P0) — The AI pair-confirmation ignores its own `is_same_person` verdict

**File:** `lib/standardization/engine.ts`, in `standardizeName()`, the Layer 2 fuzzy loop.

**The bug.** After Claude confirms a pair, the code copies `confirmation.confidence` onto the candidate
and pushes it no matter what. It never reads `confirmation.is_same_person`. `confidence` is the
confidence in the VERDICT, not a match score, so when Claude returns
`{ is_same_person: false, confidence: "high" }` (high confidence they are DIFFERENT people), the code
labels the candidate "high" and still surfaces it as a prominent "Very likely" duplicate. The layer meant
to REDUCE false positives can manufacture them, and an AI-rejected pair is never dropped.

**The fix.** Drop the candidate when the verdict is negative; only adopt confidence when it is positive.

```diff
       if (confirmation) {
-        // Upgrade or downgrade confidence based on AI assessment
-        candidate.confidence = confirmation.confidence
-        candidate.match_layer = 'ai'
-        layersRun.push('ai')
+        layersRun.push('ai')
+        // confirmation.confidence is confidence in the VERDICT, not a match score.
+        // AI says these are NOT the same person: drop the candidate, do not surface it.
+        if (!confirmation.is_same_person) {
+          continue
+        }
+        // AI confirms the same person: adopt its confidence in the match.
+        candidate.confidence = confirmation.confidence
+        candidate.match_layer = 'ai'
       }
```

The `continue` skips the `allCandidates.push(candidate)` at the end of that loop iteration, so a confirmed
non-match never reaches the result.

**Tests (add to the engine test):**
- AI returns `{ is_same_person: false, confidence: 'high' }` -> the candidate is NOT in
  `result.duplicates`.
- AI returns `{ is_same_person: true, confidence: 'high' }` -> the candidate IS present, with
  `confidence === 'high'` and `match_layer === 'ai'`.
- AI unavailable (`confirmDuplicatePair` returns null) -> candidate is surfaced on the Layer 2 score
  alone (unchanged behavior).

---

## Fix 2 (P0) — Name normalization deletes accented characters (mangles the pilot cohort's names)

**File:** `lib/standardization/layer1-normalize.ts`.

**The bug.** Both `normalizeName` (`[^\w\s'\-\.]`) and `normalizeForComparison` (`[^a-z0-9\s]`) DELETE any
non-ASCII letter rather than folding it, because `\w` and `a-z` are ASCII only. So "José" becomes "jos",
"Muñoz" becomes "muoz", "André" becomes "andr". This breaks exact and fuzzy matching for accented names
and can collapse genuinely different names. For a Latino-heavy and Black-founder cohort (Latinos N Tech,
BTW) this is a correctness and inclusion problem.

**The fix.** Fold diacritics to their base letter BEFORE stripping, via Unicode NFD decomposition. "José"
decomposes to "Jose" plus a combining accent; drop the combining marks and the base letter survives.

Add one helper near the top of the file:

```ts
/**
 * Fold accented characters to their base ASCII letter instead of deleting them.
 * "José" -> "Jose", "Muñoz" -> "Munoz", "André" -> "Andre".
 * NFD splits an accented letter into base + a diacritic mark; we drop the marks.
 */
function foldDiacritics(s: string): string {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}
```

Then fold at the START of each normalizer:

```diff
 export function normalizeForComparison(raw: string): string {
-  return raw
+  return foldDiacritics(raw)
     .toLowerCase()
     .replace(/[^a-z0-9\s]/g, '')
     .replace(/\s+/g, ' ')
     .trim()
 }
```

```diff
 export function normalizeName(raw: string): string {
-  return raw
+  return foldDiacritics(raw)
     .trim()
     .toLowerCase()
     .replace(/\s+/g, ' ')
     .replace(/[^\w\s'\-\.]/g, '')
     .replace(/\.$/, '')
     .trim()
 }
```

For consistency, do the same in `normalizeTag` (folds "Café" -> "cafe"):

```diff
 export function normalizeTag(raw: string): string {
-  return raw
+  return foldDiacritics(raw)
     .trim()
     .toLowerCase()
     .replace(/[-_]/g, ' ')
     .replace(/\s+/g, ' ')
     .replace(/[^\w\s]/g, '')
     .trim()
 }
```

`normalizeForComparison` is the dedup-critical one (it runs on both sides at read time); the other two
fold for consistency. Note: `\p{Diacritic}` needs the `u` flag (shown). If the repo's TS target is below
ES2018, use the explicit range `/[̀-ͯ]/g` instead, which needs no flag.

**Tests (add to the layer1 test):**
- `normalizeForComparison('José') === normalizeForComparison('Jose')` (both `'jose'`).
- `normalizeForComparison('Muñoz') === 'munoz'` (not `'muoz'`).
- `isExactMatchAfterNormalize('André Silva', 'Andre Silva') === true`.
- Edge case to acknowledge, not necessarily fix now: letters with no NFD decomposition (ø, ł, ß) still get
  stripped. Acceptable for BTW; note it.

---

## While you are in there (NOT BTW-gating, optional)

- **SQL trigger vs TS drift.** The `normalize_connection_fields()` trigger only lowercases, trims, and
  collapses spaces; it does not strip punctuation or fold accents like the TS does. This does NOT break
  dedup (the TS comparison re-normalizes both sides at read time), so it can wait. Two real but
  non-gating notes: the trigger lowercases the STORED `display_name`, which loses the user's casing for
  display ("José Garcia" stored as "josé garcia"); and the doc claims TS and SQL stay in sync, which is
  not currently true. Decide whether the trigger should stop lowercasing for storage (keep display
  casing) and let TS own all comparison.
- **JSON robustness.** Layer 3 asks for JSON in the prompt and hand-strips markdown fences. Swapping to
  the SDK's structured outputs (`client.messages.parse()` with a schema) makes the response
  guaranteed-valid and deletes `safeParseJSON` and the fence regex. Robustness improvement, not a gate.

---

## Verification checklist before BTW
- [ ] Fix 1 diff applied in `engine.ts`; the three engine tests pass.
- [ ] Fix 2 helper + three function edits applied in `layer1-normalize.ts`; the layer1 tests pass.
- [ ] Existing standardization tests still green.
- [ ] Spot-check on real Latinos N Tech / prior export names with accents: accented and unaccented
      spellings of the same name now match; distinct names still do not collapse.

*Both fixes are correctness and independent of where the system ultimately lives (Equalpoint layer vs a
SODA schema reconciliation). Land them first; the placement decision can follow.*
