// lib/standardization/layer1-normalize.ts
//
// Layer 1 — Text Normalization
// ----------------------------------------
// Zero dependencies. Zero AI. Zero network calls.
// Runs synchronously at write time (Supabase trigger + TS helper).
//
// What it catches:
//   "Mike Johnson" → "mike johnson"
//   "  Mike Johnson  " → "mike johnson"
//   "Mike Johnson." → "mike johnson"
//   "MIKE JOHNSON" → "mike johnson"
//   "Mike  Johnson" → "mike johnson" (double space)
//
// What it does NOT catch:
//   "Michael Johnson" vs "Mike Johnson" → Layer 2 handles this
//   "AI" vs "Artificial Intelligence" → Layer 3 handles this

// ---------------------------------------------------------------------------
// Name Normalization
// ---------------------------------------------------------------------------

/**
 * Normalize a display_name for consistent comparison and storage.
 * Applied at write time on every connection insert/update.
 *
 * Returns the normalized string — does NOT mutate the original.
 */
export function normalizeName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    // collapse all internal whitespace to single space
    .replace(/\s+/g, ' ')
    // remove punctuation that isn't part of a name (periods, commas, etc.)
    // keep hyphens (Mary-Jane), apostrophes (O'Brien), dots in initials (J.R.)
    .replace(/[^\w\s'\-\.]/g, '')
    // remove trailing dots (e.g. "mike johnson.")
    .replace(/\.$/, '')
    .trim()
}

/**
 * Normalize a name for comparison only — strips everything non-alpha.
 * More aggressive than normalizeName — used for duplicate detection,
 * never for storage.
 */
export function normalizeForComparison(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // strip ALL non-alphanumeric
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Check if two names are exact matches after Layer 1 normalization.
 * If true → definite duplicate, no fuzzy or AI needed.
 */
export function isExactMatchAfterNormalize(a: string, b: string): boolean {
  return normalizeForComparison(a) === normalizeForComparison(b)
}

// ---------------------------------------------------------------------------
// Tag Normalization
// ---------------------------------------------------------------------------

/**
 * Normalize a single tag.
 * "Founder" → "founder"
 * "Tech Founder" → "tech founder"
 * " startup-founder " → "startup founder" (hyphens → spaces for consistency)
 */
export function normalizeTag(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[-_]/g, ' ')   // hyphens and underscores → spaces
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '') // remove punctuation
    .trim()
}

/**
 * Normalize an array of tags and deduplicate exact matches.
 * ["Founder", "founder", "Tech Founder"] → ["founder", "tech founder"]
 */
export function normalizeTags(tags: string[]): string[] {
  const normalized = tags.map(normalizeTag).filter(Boolean)
  // deduplicate exact matches after normalization
  return [...new Set(normalized)]
}

// ---------------------------------------------------------------------------
// Meeting Context Normalization
// ---------------------------------------------------------------------------

/**
 * Normalize meeting_context for consistent storage.
 * Trims whitespace, collapses runs, lowercases for comparison only
 * (we store the user's original casing for display).
 */
export function normalizeMeetingContext(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ')
}

export function normalizeMeetingContextForComparison(raw: string): string {
  return normalizeMeetingContext(raw).toLowerCase()
}

// ---------------------------------------------------------------------------
// SQL Trigger (Supabase — run in SQL Editor)
// ---------------------------------------------------------------------------
//
// This mirrors the TypeScript normalization in the database layer.
// Both must stay in sync. If you change the TS, update the SQL.
//
// Run this migration in Supabase SQL Editor:
//
// ```sql
// CREATE OR REPLACE FUNCTION normalize_connection_fields()
// RETURNS TRIGGER AS $$
// BEGIN
//     -- Normalize display_name: trim, collapse spaces, lowercase
//     NEW.display_name = LOWER(
//         TRIM(REGEXP_REPLACE(NEW.display_name, '\s+', ' ', 'g'))
//     );
//
//     -- Normalize title if present
//     IF NEW.title IS NOT NULL THEN
//         NEW.title = TRIM(REGEXP_REPLACE(NEW.title, '\s+', ' ', 'g'));
//     END IF;
//
//     -- Normalize city if present
//     IF NEW.city IS NOT NULL THEN
//         NEW.city = TRIM(REGEXP_REPLACE(NEW.city, '\s+', ' ', 'g'));
//     END IF;
//
//     RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;
//
// CREATE TRIGGER normalize_on_connection_write
// BEFORE INSERT OR UPDATE ON connections
// FOR EACH ROW EXECUTE FUNCTION normalize_connection_fields();
// ```

// ---------------------------------------------------------------------------
// Layer 1 Result Shape
// ---------------------------------------------------------------------------

export interface Layer1Result {
  original: string
  normalized: string
  normalized_for_comparison: string
  changed: boolean  // true if normalization made any difference
}

export function runLayer1(raw: string): Layer1Result {
  const normalized = normalizeName(raw)
  const normalized_for_comparison = normalizeForComparison(raw)

  return {
    original: raw,
    normalized,
    normalized_for_comparison,
    changed: normalized !== raw,
  }
}
