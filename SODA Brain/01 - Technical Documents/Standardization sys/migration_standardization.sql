-- equalpoint-standardization/migration_standardization.sql
--
-- Entity Standardization — Database Migration
-- -----------------------------------------------
-- Run this in Supabase SQL Editor before deploying
-- the standardization engine.
--
-- What this adds:
--   1. Trigger: normalize display_name, title, city on every write
--   2. Index: fast lookup for normalized name comparison
--   3. Index: GIN index on tags for fast tag queries


-- ── 1. Normalization Trigger ─────────────────────────────────────────────
-- Mirrors the TypeScript Layer 1 logic at the DB level.
-- Both must stay in sync — if you change the TS, update this SQL.

CREATE OR REPLACE FUNCTION normalize_connection_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Normalize display_name: trim, collapse spaces, lowercase
    -- Matches normalizeForComparison() in layer1-normalize.ts
    NEW.display_name = LOWER(
        TRIM(REGEXP_REPLACE(NEW.display_name, '\s+', ' ', 'g'))
    );

    -- Normalize title (preserve user casing in storage, normalize for DB consistency)
    IF NEW.title IS NOT NULL THEN
        NEW.title = TRIM(REGEXP_REPLACE(NEW.title, '\s+', ' ', 'g'));
    END IF;

    -- Normalize city
    IF NEW.city IS NOT NULL THEN
        NEW.city = TRIM(REGEXP_REPLACE(NEW.city, '\s+', ' ', 'g'));
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate to pick up any changes
DROP TRIGGER IF EXISTS normalize_on_connection_write ON connections;

CREATE TRIGGER normalize_on_connection_write
BEFORE INSERT OR UPDATE ON connections
FOR EACH ROW EXECUTE FUNCTION normalize_connection_fields();


-- ── 2. Index for Normalized Name Lookup ──────────────────────────────────
-- Speeds up the Layer 2 fuzzy query — finding existing connections
-- for an owner when a new connection is created.

CREATE INDEX IF NOT EXISTS connections_owner_name_idx
    ON connections (owner_id, display_name)
    WHERE status != 'archived';


-- ── 3. GIN Index on Tags ─────────────────────────────────────────────────
-- Speeds up tag standardization queries and the Map View tag filter.

CREATE INDEX IF NOT EXISTS connections_tags_gin_idx
    ON connections USING GIN (tags);


-- ── 4. Verify ────────────────────────────────────────────────────────────
-- After running, verify the trigger exists:
--
-- SELECT trigger_name, event_manipulation, action_timing
-- FROM information_schema.triggers
-- WHERE event_object_table = 'connections';
--
-- Expected output:
--   normalize_on_connection_write | INSERT | BEFORE
--   normalize_on_connection_write | UPDATE | BEFORE


-- ── 5. Backfill Existing Records ─────────────────────────────────────────
-- Run this ONCE to normalize existing connection names.
-- Safe to run — it only updates, never deletes.
-- Comment out after running.

-- UPDATE connections
-- SET display_name = LOWER(TRIM(REGEXP_REPLACE(display_name, '\s+', ' ', 'g')))
-- WHERE display_name != LOWER(TRIM(REGEXP_REPLACE(display_name, '\s+', ' ', 'g')));
