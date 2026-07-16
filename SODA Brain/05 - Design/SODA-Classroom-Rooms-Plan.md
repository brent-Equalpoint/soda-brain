# SODA Classroom Rooms — ephemeral, minor-safe events

**Status: DESIGN LOCKED 2026-07-15 (Brent's calls in AskUserQuestion) · BUILD IN PROGRESS —
priority: an event with students is within a week.**

## Why

Brent has an event where kids under 18 will use the app. Policy posture (plain-English, not
legal advice; school confirms its own policy — under-13s trigger COPPA): **data minimization
beats consent machinery.** Collect the least possible, keep none of it. A classroom room's
guest data self-deletes an hour after close; faculty gets an aggregates-only report.

## Decisions (Brent, 2026-07-15)

1. **The student card**: Name · School (the role slot) · "College I'm aiming for" (the business
   slot, optional) · offers/needs chips as always. Same ProfileCard component, relabeled
   prompts. **NO email, no phone, no account** — entry is Supabase anonymous sign-in.
2. **Wipe timing**: automatic at close + 1 hour (a sweep, like the warmth sweep). Kids see
   their in-room recap before it; nothing survives but the aggregate report.
3. **Timeline**: within a week — immediate build priority.

## Architecture (rails that already exist)

- **Door**: `events.classroom` flag. Join flow: code → detects classroom (new anon-callable
  `get_event_classroom(join_code)`) → `supabase.auth.signInAnonymously()` → relabeled
  profile-step (Name / Your school / College you're aiming for · optional / chips) →
  `upsert_my_attendance` as normal. RLS untouched (anon users are real `auth.uid()`s).
  ⚠ Requires Brent to enable **Anonymous sign-ins** in Supabase Auth settings (Dashboard →
  Authentication → Providers/Settings). Verify `handle_new_user` trigger tolerates a null
  email before shipping the door.
- **In-room**: everything works (cards, matches, Drops, Chance, connections, moments).
- **What classroom rooms SKIP**: recap emails (no email exists), the 48h reconnect window +
  /wrap survey push (recap roster route + wrap should treat classroom like already-closed),
  key cards, post-event messaging. Anonymous profiles must be excluded from the ops People
  directory (filter `is_anonymous` server-side or accept until wipe — decide at build).
- **Wipe** (`wipe_classroom_event`, security definer): mirror `sim_wipe_event`'s PROVEN
  deletion order but (a) gate on `e.classroom` not `e.simulated`, (b) collect profiles via
  `auth.users.is_anonymous` join (NEVER touch a real account — a host/faculty real account in
  the room survives; only its attendance row goes), (c) KEEP the event row, delete
  attendances + guest data + anonymous profiles + anonymous auth.users, (d) SNAPSHOT FIRST.
  ⚠ Because the event row is kept (unlike sim), event-scoped tables that sim relied on the
  event-delete cascade for must be deleted explicitly — VERIFY COLUMN NAMES in migrations
  before writing: comments(event_id), survey_responses(event_id), nudges(event_id?),
  host_messages(keying?), drops/drop_responses, chance_rounds/pairings, announcements,
  thread_stats (contentless — may keep? decide: wipe for cleanliness), room_moments (keep —
  host content), attendance_connect_tokens (cascade check). plpgsql bodies are NOT
  column-checked at migration time — test the wipe end-to-end locally (adapt
  scripts/sim-wipe-check.mjs into a classroom-wipe-check).
- **Auto-sweep**: `sweep_classroom_wipes()` — events where classroom AND status='closed' AND
  closed_at < now() - interval '1 hour' AND attendances still exist → wipe each. Schedule via
  `cron.schedule('soda-classroom-wipe', '*/15 * * * *', ...)` with the warmth-sweep's
  best-effort DO block. Admin also gets a manual "Wipe now" (nice-to-have, auto is the
  guarantee).
- **Faculty report**: `classroom_reports` table (event_id PK, event_name, held_on, attendees,
  connections, drops, drop_answers, chance_rounds, offer_counts jsonb, need_counts jsonb,
  created_at) — filled by the wipe BEFORE deletion (SQL-computable aggregates only; chips via
  jsonb_array_elements on attendances.offers/needs, top ~12 categories). RLS: is_event_host
  read. Admin event view renders it after the wipe ("What the faculty sees") + a print/CSV
  export. NO names, no PII anywhere in it.
- **Flagging an event**: `set_event_classroom(event_id, on)` RPC (is_event_owner gate) + a
  toggle in Admin's event settings, set BEFORE the night (block flipping while live?
  v1: allow only while draft).

## Build checklist

- [ ] Migration `20260716020000_classroom_rooms.sql`: column + toggle RPC +
      get_event_classroom + classroom_reports + wipe fn + sweep + cron (validate locally,
      then TEST THE WIPE against a seeded local classroom event)
- [ ] classroom-wipe-check script (prove zero guest rows + zero anon users remain)
- [ ] Join flow: classroom detection + anonymous sign-in + relabeled profile step
- [ ] Skips: recap email screen-out (already skips .invalid-style? anon has NO email — verify
      user-emails lib), reconnect window off, key-card offer off, People-directory exclusion
- [ ] Admin: classroom toggle (draft events) + faculty report view + export
- [ ] Room: no behavior change needed (verify recap /wrap path for anon users)
- [ ] Brent: enable Anonymous sign-ins (dashboard) + apply migration + a dry-run classroom
      event before the real night

## Open items

- Under-13 attendees: recommend the school handles device/participation consent per its own
  policy; the app's posture is PII-zero-after-one-hour either way.
- Faculty report delivery: v1 = host views/prints from Admin.
