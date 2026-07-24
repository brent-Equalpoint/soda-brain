# SODA — URL-Addressable Event Rooms (Plan)

*A proposal, not a build. Make event rooms addressable by URL (a clean per-event join link + a durable
room address) instead of living only in the phone's local storage. Created 2026-06-27 at Brent's
direction ("plan it"). Pairs with [[SODA-Universal-UI-Expo-Migration-Plan]] (fold it in there, routing is
being reshaped for Expo anyway) and closes the "lost my room" fragility. **No sudden moves: the current
`/room` + session keeps working; nothing changes until this is approved and, ideally, folded into the
overhaul.**

---

## The principle: separate the *address* from the *key*

- **Address** = *which* room (the URL).
- **Key** = *what lets you in* (the join code / QR token + sign-in).

Keep them separate, and make sure **knowing the address is never the same as having access.** Access is
enforced by sign-in + the database rules (RLS) + an attendance record, never by the URL being secret.

## Current state (grounded in the code)

- The room is **one address, `/room`**. *Which* event you're in lives **only in local storage**
  (`soda.room.session`, in `lib/room-session.ts`): `{ eventId, hostName, joinedAt, me{...} }`.
- **~10 screens read that session** (entry hub, room, home, left, wrap, survey, send-off, account,
  startup-splash, join). `eventId` is already the pivot the whole app runs on, it's just hidden in
  storage instead of in the URL.
- **Joining:** a code → `/api/event/code` → a token → `/join?t=…` → writes the room session → `/room`.
- **Partial precedent already exists:** `/kiosk?event=…`, `/survey?event=…`, `/send-off?token=…` already
  carry the event in the URL. The room is the main screen that doesn't.

**The consequence:** if local storage is wiped (the iOS "lost my room" bug), the app forgets which event
you were in, because nothing else remembers it. The URL should.

## Target design

- **A public per-event join link → `/e/[code]`.** The shareable "key URL" a host hands out
  (*"join tonight's room: grabsoda.app/e/M652TS"*). It resolves the code to the event and runs the
  join/sign-in flow. This is the **key**, so it is **rate-limited** (the gap noted in the DB-health
  review).
- **A durable room address → `/room/[eventId]`.** The `eventId` (a UUID) becomes the **source of truth**
  for which room you're in. Local storage drops to a *fast-restore cache* + your presence identity, not
  the only record. The UUID is unguessable, and access is still gated by RLS + your attendance row, so
  exposing it is safe.
- **The code/token stays the key, kept separate from the room address.** Don't put the join code in the
  room URL; the join link owns the code, the room owns the UUID.

## Why this is worth doing (SODA-specific payoffs)

1. **Durability, fixes "lost my room."** The URL carries the event; a wiped cache no longer strands a
   guest. Paired with a small server-side "my attendance for this event" lookup, the room can rebuild
   *who you are* from (signed-in user + eventId) even with empty storage. This is the deep fix for that
   bug.
2. **Shareable.** One clean link per event for hosts to post.
3. **Native-ready.** `/room/[eventId]` is exactly how Expo Router addresses screens too, so doing it now
   feeds the migration instead of being redone.
4. **Conventional + debuggable.** Standard resource-in-URL pattern; analytics and Sentry can attribute by
   event automatically.

## Security rules (locked)

- **URL is not access.** RLS + sign-in + an attendance row gate the room; a guessed URL gets nothing.
- **`eventId` is a UUID** (unguessable) so it's safe in the URL.
- **Rate-limit `/e/[code]` and the code resolver** (ties to the rate-limiting item).
- The short join **code is a credential**, keep codes non-trivial; consider per-event expiry/rotation so
  an old flyer's code can't be reused forever (product choice).

## Migration approach (safe, backward-compatible)

Nothing breaks at any step:
- **Keep `/room` working.** It reads the session and **redirects** to `/room/[eventId]` when a session
  exists, so old bookmarks and the current flow keep working.
- **Dual-source the eventId:** URL first, fall back to the stored session; keep writing the session on
  entry for instant restore.
- **Add the server-side attendance re-resolve** so the room can rebuild `me` from (auth user + eventId)
  when storage is empty.
- **Migrate the ~10 session-reading screens** to "eventId from the URL, session as cache," one at a time.

## Phases (each reversible, parallel to the live app)

- **Phase 0 · Design + decide (no code).** Confirm the URL shapes (`/e/[code]` for join, `/room/[eventId]`
  for the room) and the redirect behavior.
- **Phase 1 · `/room/[eventId]` alias.** Add it alongside `/room`; `/room` redirects into it when a
  session exists. Non-breaking.
- **Phase 2 · The public `/e/[code]` join link** + rate-limiting.
- **Phase 3 · Server-side attendance re-resolve** (the durable lost-my-room fix).
- **Phase 4 · Migrate the session-reading screens** to URL-first; retire the storage-only dependence.

**Recommended:** do this **inside the universal-UI / overhaul work** (Phase C, "the room"), since routing
is being reshaped for Expo Router anyway, doing it twice is wasteful.

## Blast radius

`lib/room-session.ts` + the ~10 screens that read the session (entry-hub, room, home, left, wrap, survey,
send-off, account, startup-splash, join) + the join/code APIs (`/api/event/code`, `/api/room/[eventId]`,
`/api/event/state`). Significant but bounded, and `eventId` is already the shared pivot, so it's a
re-plumb, not a redesign.

## Decisions needed

1. **Room address format:** `/room/[eventId]` (UUID, recommended, stable + unguessable) vs a pretty
   `/r/[code]` (blurs address and key, not recommended).
2. **Public join link format:** `/e/[code]` (recommended) or `/join/[code]`.
3. **Standalone now, or fold into the overhaul** (recommended: fold in).
4. **Per-event code expiry/rotation:** yes or no (product call).

## What we are NOT doing

No sudden move. The current `/room` + local-storage session keeps working untouched. Nothing ships until
this is approved and (ideally) folded into the overhaul, behind the same parity gate
([[SODA-Flow-Test-Plan]]).

## References

[[SODA-Universal-UI-Expo-Migration-Plan]] (fold in here) · [[SODA-Flows-As-Built]] ·
[[SODA-Native-Ready-Architecture]] · [[SODA-Backlog]] (the "lost my room" + rate-limiting items this
resolves) · [[SODA-Flow-Test-Plan]] (the parity gate).
