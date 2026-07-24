# SODA Build Checklist
*Fire this off in order. Each section is one Claude Code session. Do not start the next section until the current one is checked off.*

---

## PRE-FLIGHT: Before you open Claude Code

- [ ] Anthropic API key in hand
- [ ] Supabase account ready (project not yet created)
- [ ] Vercel account ready (project not yet created)
- [ ] Resend account ready, sending domain verified, SPF/DKIM/DMARC passing
- [ ] Sentry account ready (project not yet created)
- [ ] GitHub repo created, empty, cloned locally
- [ ] Brain files copied into repo at these paths:
  - `README.md` ← SODA-INDEX.md renamed
  - `decisions/SODA-DECISIONS.md`
  - `skills/SODA-SKILL.md`
  - `build/SODA-BUILD-ERROR-LOG.md`
- [ ] CLAUDE.md created at repo root with this content:

```
# SODA
Read these in order before doing anything:
1. README.md   index and read order
2. skills/SODA-SKILL.md   how to approach this project
3. decisions/SODA-DECISIONS.md   every binding choice, this wins over everything
4. build/SODA-BUILD-ERROR-LOG.md   known failures, do not repeat them

Rules that cannot be broken:
- RLS on every table at creation, no exceptions
- Never auto-send a draft, two-call gate always
- Never expose the secret key to the client
- Never drop a session mid-event
- No em dashes in any written output
```

- [ ] `.env.local` file created (empty, placeholders only, not committed)
- [ ] `.gitignore` includes `.env*`

---

## PHASE 0: Foundation plumbing
*One session. Goal: a live Vercel deploy that renders a dark screen with the SODA wordmark. Nothing more.*

### Open Claude Code and paste this prompt:

```
Read CLAUDE.md and the four brain files before you do anything.
Then scaffold Phase 0 from the technical build structure:

1. Init Next.js 16 with App Router, Turbopack, TypeScript, Tailwind
2. Apply the dark token set from the skill file to globals.css and
   tailwind.config.ts (canvas #111111, card #1A1A1A, border #262826,
   off-white #F5F5F5, green #3BD75C, amber #F59E0B, purple #A47BFF,
   muted #8A8A8A, red #EF4444)
3. Create the font setup: Archivo Black for display, DM Sans for UI,
   DM Mono for eyebrows via next/font
4. Create the proxy.ts middleware file (not middleware.ts, we are on
   Next.js 16)   empty protection shell for now
5. Create the empty route shells listed in the technical build structure
6. Add a PWA manifest at public/manifest.json: name SODA, short_name SODA,
   display standalone, background_color and theme_color #111111, icons
   placeholder at 192 and 512
7. Add a minimal service worker that caches the app shell only
8. Wire Sentry: run the wizard or scaffold instrumentation-client.ts,
   instrumentation.ts with onRequestError, and sentry.server.config.ts.
   Confirm source maps upload. Strip all request bodies and auth headers.
9. Create the Supabase project via the dashboard (I will do this manually),
   then wire @supabase/ssr with the new publishable and secret keys into
   .env.local. Create the Supabase client helpers for server and client.
10. Deploy to Vercel. Confirm a dark canvas with the SODA wordmark renders
    at the production URL.

Log every decision you make that is not already in decisions/SODA-DECISIONS.md.
Append any build errors and their fixes to build/SODA-BUILD-ERROR-LOG.md.
```

### Phase 0 done when:
- [ ] `npm run dev` starts clean, no errors
- [ ] Dark canvas renders locally
- [ ] Vercel deploy is live at production URL
- [ ] Supabase project exists, publishable key in `.env.local`
- [ ] Sentry receives a test error with a readable stack trace
- [ ] `public/manifest.json` validates in Chrome DevTools > Application
- [ ] No secret key in any client file (grep for `SERVICE_ROLE` in `app/`)
- [ ] Force-RLS toggle ON in Supabase dashboard (do this manually)

---

## SLICE 1: Scan to Room View
*The core promise. One end-to-end path: QR scanned, sign in, land in a live room with presence.*

### Manual step first:
- [ ] Create the pilot event row in Supabase manually (host_name, qr_token, status: live)

### Paste this prompt:

```
Read CLAUDE.md and the brain files. We are building Slice 1 from the
technical build structure: scan a QR to a live Room View.

Build in this order   do not skip ahead:

1. DATABASE (RLS at creation, no exceptions):
   Create migrations for: profiles, events, event_roles, attendances.
   Every table gets RLS on before any policy. Policies use
   (select auth.uid()) not auth.uid(). Index every FK and every
   policy column. Seed the pilot event from the decisions log.

2. AUTH (SODA-025, SODA-031):
   Wire Supabase Auth email one-time code via @supabase/ssr.
   The QR token resolves to the event server-side, validates against
   the events table, then routes to sign-in. After sign-in, upsert
   the profile and create the attendance row, then redirect to the
   Room View. No phone field anywhere.

3. ROOM VIEW (server shell + client island):
   Server component fetches the event (host_name, logo, mode) and
   the initial attendance list. The presence list is a client island
   that holds the Supabase Realtime subscription. Pass the initial
   state as props. Re-track presence on visibilitychange. The shell
   streams instantly; the socket connects underneath.

4. PROXY.TS:
   Protect the room route. Refresh the Supabase session. Keep
   webhook routes public.

QA gate before you say done:
- Sign in with a test email on a real phone (or simulator)
- Confirm the room shows, presence updates, RLS blocks another
  user from reading a different event's data
- Run the Supabase Security and Performance advisors, report findings
- Append any errors and fixes to the build error log
```

### Slice 1 done when:
- [ ] QR URL opens sign-in on mobile browser
- [ ] Email code arrives via Resend
- [ ] After sign-in: Room View renders with host name and presence
- [ ] A second test account cannot read the first account's room data
- [ ] Supabase Security advisor: zero findings
- [ ] Supabase Performance advisor: zero unindexed FK findings
- [ ] No `select *` anywhere in the codebase (grep it)
- [ ] Sentry receives errors from the room route in production

---

## SLICE 2: Profile and chips
*A guest sets their role, offer, and need. The attendance row becomes meaningful.*

```
Read CLAUDE.md and brain files. Slice 2: the profile and chip editor.

1. DATABASE: Add role_text, offer, need, photo columns to attendances
   (if not already). Photo goes to Supabase Storage with a signed URL,
   never the public bucket.

2. UI: Build the chip editor screen per the attendee flow spec.
   Each chip is at least 44px touch target (SODA-032).
   Saves via a Server Action that upserts the attendance row.
   Optimistic UI, server confirms.

3. Home shell: stub the Home screen so after sign-in the guest
   can reach Profile and back to the Room View.

QA gate: edit chips, close and reopen, confirm they persist.
Append errors to the build error log.
```

### Slice 2 done when:
- [ ] Chips save and persist across sessions
- [ ] Photo upload works and returns a signed URL
- [ ] All chip targets are 44px minimum (inspect in DevTools)
- [ ] Keyboard operability: tab and enter work on all chip controls

---

## SLICE 3: The acts (Drop, Chance, Nudge)
*The host fires a moment. Guests receive it in real time.*

```
Read CLAUDE.md and brain files. Slice 3: the three acts.

1. DATABASE: Create moments table (type, event_id, fired_at, RLS:
   host-write, attendee-read scoped to their event).
   Create nudges table (sender, recipient, content, RLS: recipient-only
   read, this is the private nudge, it must be airtight).
   Create drafts and draft_feedback tables per the data model.

2. COMMAND CENTER gating (SODA-032 remediation):
   No act fires unless event status is live. Gate this server-side
   in the route handler, not only in the UI.

3. THE DROP and CHANCE: host Server Action fires the moment,
   Realtime broadcasts to the room, attendees see it on their screen.

4. THE NUDGE (two-call gate, SODA rules):
   POST /api/draft: calls Claude API (claude-sonnet-4-6), returns
   a draft, never writes it. The host sees it.
   POST /api/draft/approve: writes the nudge row only after explicit
   approval. Logs the discard signal to draft_feedback if dismissed.
   Never collapses the two calls into one.

5. PRIVATE NUDGE: recipient_profile_id RLS policy, tested with a
   second account that should not see it.

QA gate:
- Fire each act as host, confirm attendee sees it
- Attempt to fire an act on a draft event, confirm it is blocked
- Approve and discard a draft, confirm draft_feedback row written
- Log in as a non-recipient, confirm nudge is invisible
```

### Slice 3 done when:
- [ ] All three acts fire and appear on attendee screen in under 2s
- [ ] Acts blocked on non-live events (tested)
- [ ] Draft generates and approves as two separate calls
- [ ] Discard writes to draft_feedback (check in Supabase table editor)
- [ ] Non-recipient cannot read a nudge (RLS tested with second account)

---

## SLICE 4: Home, Contacts, Recap
*The after. Warmth, connections, the recap email.*

```
Read CLAUDE.md and brain files. Slice 4: the home layer.

1. DATABASE: Create connections table per the data model
   (profile_a, profile_b, base_warmth, warmth_score, shared_context,
   smaller UUID first, co-owned). Create pg_cron job for the warmth
   decay sweep: warmth = max(0, round(base * e^(-0.01 * days_since))).

2. HOME SCREEN: Overview, Events list, Contacts rolodex.
   Each section fetches its own data in parallel inside a Suspense
   boundary, scoped columns only, paginated, no select *.

3. CONTACTS: The rolodex. Warmth bar renders from warmth_score.
   Follow-up draft uses the two-call gate same as the nudge.

4. RECAP EMAIL: When the host closes the event, fire a Resend
   transactional email to each attendee. Subject, their connections
   from the night, a link back to the app. Plain text version included.
   Send is idempotent (idempotency key per attendance row).

QA gate:
- Open home on a second device, confirm events and contacts load
- Advance pg_cron manually, confirm warmth_score changes
- Close a test event, confirm recap email arrives with plain text
- Check Resend dashboard: no bounces, delivery confirmed
```

### Slice 4 done when:
- [ ] Home loads in under 1s on a real phone on LTE
- [ ] Warmth decay runs on schedule (confirm in pg_cron logs)
- [ ] Recap email delivers with plain text and no broken links
- [ ] Rolodex paginates, no unbounded reads

---

## SLICE 5: The card system (after the pilot fixes)
*This is the card redesign from the June 23 design session. It comes after Slices 1 to 4 and the pilot fixes, and after the test suite exists so the chip migration lands behind a gate. Full direction lives in SODA-Card-Design-Ideas. Build it as its own slice, not mixed into the core flow.*

### Build order within the slice
- [ ] Chip data model migrated to jsonb with {category, context[]} per chip (this is SODA-039, context as an array to allow multiple focuses). RLS tests pass before and after the migration.
- [ ] Front-and-back card component. Front is Me (name, role, agency lockup, signature). Back holds Offers and Needs. The card flips between them.
- [ ] Micro card in the room shows identity and match signal only. No offer or need chips on the face. Tapping opens the full card.
- [ ] Full card opens from a micro card (centered overlay or bottom sheet, decide once and stay consistent).
- [ ] Card is editable in place by its owner: offers, needs, focuses, role, signature, without leaving the room.
- [ ] Signature capture on the Me face. Use signature_pad. Store the trimmed PNG to Supabase Storage with a signed URL, or SVG path data. New Storage bucket plus its RLS policy. Signing is never a gate.
- [ ] Auto-fit the signature so it spans most of the line regardless of how big it was drawn. Optional S/M/L width control.
- [ ] Intro starter: tapping a chip on someone else's card opens a suggested, editable opener that references that chip. Viewer sends, edits, or skips. Nothing sends on its own.
- [ ] In-room focus enrichment modal, triggered by a match moment. Add a focus or two per chip with type-or-tap suggestions. This is the deferred-specificity flow from SODA-Onboarding-Flow-MultiFocus.

### Chip system implementation (the uploaded code)
*The chip system is now real TypeScript: a typed bank, context-aware suggestions, the input component, the wiring component, and a migration. This is the order to land it safely. Two of these steps are risky-ten units, treat them as such.*

**Step 0: Populate and verify the bank (bank.ts).** The whole suggestion engine reads from the bank. Every chip is tagged into the seven-context taxonomy (capital, talent, customers, knowledge, community, resources, creative). Suggestion quality is exactly as good as the tagging. Review every tag before trusting the suggestions. This is light work but high leverage. Done when: selecting a capital Need surfaces only capital-context Focus chips, with nothing from unrelated contexts bleeding in.

**Step 1: The migration (RISKY-TEN, data integrity).** Run add_chip_columns.sql, which adds needs_chips, offers_chips, focus_chips as jsonb[] and backfills from the old tags column. Before running: back up the connections table, run against a copy of real data first, confirm the backfill result. Note the backfill defaults every migrated chip to knowledge context, so migrated chips will not get smart suggestions until re-tagged. That is acceptable but know it. Run the RLS tests before and after even though the migration comment says the existing policy covers the new columns. Done when: the columns exist, the backfill is verified on a copy, and every RLS test still passes.

**Step 2: The API route (adjacent to RISKY-TEN, the RLS boundary).** Add the StoredChipSchema and the three optional chip fields to the PATCH /api/connections/:id Zod schema, exactly as sketched in the migration file. Validate every incoming chip so a malformed context cannot be written. Keep the legacy tags field in the schema until the migration is fully verified in production. Write the integration test that confirms a second user cannot PATCH another user's connection chips before trusting the route. Done when: a valid chip update writes, an invalid context is rejected, and a cross-user PATCH is blocked by RLS.

**Step 3: The components (light, frontend).** Drop in ChipBankInput, suggestions.ts, and ChipsSection. These read the bank and the API and carry low risk. One required change: the components are styled for the Equalpoint light theme (purple #813BD7, white dropdowns, light inputs). They need SODA's dark-theme token pass, the canvas, the card surface, the green, before they ship in SODA. This is a restyle, not a rebuild. Done when: the three inputs render in SODA's dark theme, Focus shows context-matched suggestions driven by selected Needs and Offers, and custom chips can be typed.

**Decisions already settled by the code (do not relitigate):**
- [ ] Context taxonomy is seven fixed values. Custom typed chips default to knowledge. Changing the taxonomy later is another migration, so confirm seven is right now.
- [ ] Three dedicated columns replace the single tags blob. Cleaner, but three things to keep in sync across API, types, and UI. The uploaded code already does this consistently.
- [ ] Context supports single or array per chip, which matches the multifocus extension. Already reconciled.

### Decisions to lock before starting this slice
- [ ] Reconcile front-and-back with the three-tab control: does the back show Offers and Needs together, or do the tabs split them?
- [ ] Editing in place: card flips to edit mode, or a modal handles edits (match the focus modal pattern)?
- [ ] Intro starter: reuse the nudge channel and its two-call gate, or a lighter in-room message since both people are present?
- [ ] Intro opener: template (instant, ship first) or AI-drafted per chip (richer, costs a call, add later)?
- [ ] Tapping a chip on your own card (edit) versus someone else's card (intro): same gesture, two meanings. Confirm the rule.

### Slice 5 done when:
- [ ] A person can open another card, flip it, tap a chip, and send an edited intro
- [ ] A person can edit their own card in place and the room reflects it live
- [ ] A signature can be drawn, auto-fits the line, and persists to Storage
- [ ] The chip migration is complete and every RLS test still passes
- [ ] Shape and style variants are noted as later, component built flexible enough to allow them

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

## PRE-PILOT GATE
*Run this before any real room. Every item must pass.*

### Supabase
- [ ] Security advisor: zero findings
- [ ] Performance advisor: zero findings
- [ ] Every table has RLS, verified with a public-key request (should return empty or 403)
- [ ] No `select *` in the codebase
- [ ] pg_stat_statements on, slowest queries reviewed
- [ ] Realtime enabled only on presence, moments, nudges

### Auth and email
- [ ] Supabase auth-email rate limit raised to cover expected room size
- [ ] Resend send limit confirmed against that number
- [ ] SPF, DKIM, DMARC all passing (check Resend dashboard)
- [ ] Sign-in code arrives in under 30s on a real phone
- [ ] Google social sign-in tested on Android Chrome
- [ ] Webview detection tested: social buttons suppress in Instagram browser

### PWA install
- [ ] Manifest validates in Chrome DevTools with zero errors
- [ ] Install tested on real Android phone: native prompt appears
- [ ] Install tested on real iPhone: two-tap instructions shown
- [ ] Start_url opens to Home after install, not a specific event
- [ ] Service worker caches shell, room data fetches fresh

### Sentry
- [ ] Source maps uploading, test error shows file and line
- [ ] No email, code, nudge content, or auth header in any error payload
- [ ] Session Replay masking confirmed
- [ ] Alerts wired to a channel for the live window

### Capacity
- [ ] Expected room size confirmed against Supabase plan Realtime ceiling
- [ ] Load test the Room View at that concurrency before the event

### Security
- [ ] Secret key absent from all client bundles (grep confirmed)
- [ ] Operator access log table exists and is writing
- [ ] QR token rotation works (host can regenerate)
- [ ] Privacy policy reviewed by counsel, social-provider data listed

---

## OPEN THE ROOM
- [ ] Set pilot event status to live in Supabase
- [ ] Test the QR on a real phone end to end: scan, code, room, chips, act, home, recap
- [ ] Sentry dashboard open during the event
- [ ] Someone watching the Realtime connection count

*The first manifest item is now Built.*

