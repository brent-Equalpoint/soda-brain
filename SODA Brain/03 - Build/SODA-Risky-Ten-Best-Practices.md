# SODA: The Risky Ten, Best Practices

**Date logged:** June 23, 2026

*Ten units carry the real engineering risk in SODA. Every other unit is assembly. This is the standalone reference, also embedded in the build checklist. A product of Equalpoint, Inc.*

---

## THE RISKY TEN: handle these the right way

*These are the ten units where a mistake is expensive, invisible, or unsafe. Every other unit is assembly. When you reach one of these, the practice below travels with it. Each one gets its own slice, its own test, and its own verified step before the next. Never bundle two risky units in one push.*

### The shared rule
Build one risky unit, write its test, verify it passes, then move on. If something breaks later, you can tell which unit did it because each landed alone behind its own gate. The test suite is built first (the seven test-suite units) precisely so these ten land behind it.

### 1. RLS policies (security boundary)
- Deny by default. Every table starts with RLS enabled and zero access, then you open narrow allows.
- Write the policy and its RLS integration test in the same commit. Never the policy alone.
- A test that should return empty but returns data is a build-breaking failure, not a warning.
- Re-run all RLS tests after any schema change, including migrations.

### 2. The two-call nudge gate (trust boundary)
- Generate and send are physically separate endpoints. The send endpoint requires an explicit human confirmation token.
- There must be no code path where a draft becomes a sent message without a person's tap.
- Test it by attempting to send without the confirm and asserting it fails.
- The intro starter rides this same gate. Same rule applies.

### 3. The chip jsonb migration (data integrity)
- Back up before running. Write the migration to be reversible.
- Test on a copy of real data before production.
- Preserve the old data until the new shape is verified, do not transform in place.
- Run the RLS tests before and after to prove the migration opened no hole.

### 4. The realtime subscription (scale)
- Test at real scale before the event, not after. The load test opens the expected concurrency and confirms zero drops.
- Works fine at three people and fails at two hundred, so the only honest test is at room size.
- Confirm the Supabase plan's Realtime ceiling covers the expected room before you rely on it.

### 5. QR token validation (security boundary)
- Validate server-side every time. Never trust a token the client hands you.
- Scope each token to one event with an expiry. A stale token must not work after the event.
- Host can rotate the token. Test that rotation invalidates the old one.

### 6. Clerk and Supabase auth integration (security boundary)
- Follow the official Clerk plus Supabase third-party auth pattern exactly. Do not improvise auth.
- RLS for attendee tables reads the Clerk sub claim, not auth.uid().
- Test the full path: sign in, land in room, confirm a second account cannot read the first account's data.
- Fix the Supabase double-email setting first as the short-term patch.

### 7. Signature storage (security boundary)
- The Storage bucket gets its own RLS policy the same day it is created.
- Serve through signed URLs with short expiry, never public links.
- The only unit touching file storage, so it is the only one with a new access-control surface. Treat it like one.

### 8. The warmth formula (data integrity)
- One source of truth, imported everywhere, never re-implemented in two places.
- Locked behind a unit test asserting the exact expression: max(0, round(base * exp(-0.01 * days))).
- Any refactor that drifts it fails the test loudly. That is the point.

### 9. The match computation at scale (scale)
- Compute server-side and cache. Do not recompute on every client.
- Pairwise matching grows fast, so measure it at the room sizes you actually expect.
- Correct at 19 (the pilot proved it). The job is staying correct and fast at a few hundred.

### 10. The act trigger and broadcast (scale)
- Use Supabase realtime broadcast rather than a hand-rolled fan-out.
- Make each act idempotent so firing twice does not double-fire on phones.
- Test with several real devices connected at once before trusting it live.

### The meta-practice
Spend the care where the risk is. A beautiful screen on a leaky RLS policy is worse than a plain one on a solid policy. These ten get your attention and a senior review. The other 58 units move fast precisely because these ten are solid.

---


---

## Applied: the chip system implementation

The uploaded chip code touches two of the risky ten directly. Here is how the general practices apply to this specific work.

### The chip migration (unit 3, data integrity)
- The migration adds three jsonb columns and backfills from the old tags column. Back up connections first, run against a copy, verify the backfill.
- Known tradeoff: the backfill defaults every migrated chip to the knowledge context. Those chips will not get context-matched suggestions until re-tagged. Acceptable, but documented so it is not a surprise.
- Run the RLS tests before and after. The migration comment claims the existing policy covers the new columns. That claim is exactly what the test verifies, so do not take it on faith.

### The chip API route (unit 1, RLS boundary)
- Validate every incoming chip against the StoredChipSchema. A malformed context must be rejected before it is written.
- Keep the legacy tags field in the Zod schema until the migration is fully verified in production. Remove it only after.
- Write the cross-user PATCH test: a second user must not be able to update another user's connection chips. This is the RLS boundary test for this route.

### The bank tagging (not risky, but high leverage)
- The bank is not a risky-ten unit, but the suggestion quality depends entirely on its context tags. A mis-tagged chip surfaces in the wrong rooms.
- Treat the bank like content that needs review, not code that compiles. Read every tag. The test is human: does a capital Need surface only capital Focus chips?

