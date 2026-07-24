# SODA — Attendee App Rebuild (Build Plan)

*The governing plan for rebuilding the attendee app from the design handoff at
`05 - Design/Attendee Design new/design_handoff_attendee_app/` (its README.md is the spec; six
reference screenshots; the .dc.html prototype is reference-only, not portable code). Decisions locked
with Brent 2026-07-06. The Onboarding rebuild is a separate handoff, deliberately waiting.*

## Decisions locked (Brent)

1. **Fonts: Be Vietnam Pro (display + body) + DM Mono (labels/eyebrows).** This resolves the June
   "fonts killed, TBD" state. The attendee handoff file showed Archivo/Hanken Grotesk/Space Mono, but
   its own README flags the Onboarding package's Be Vietnam Pro/DM Mono as the later, likely-intended
   direction; Brent confirmed it. Both are Google Fonts (Expo-loadable). Set in soda.tokens.json v1.3.0
   and the live app together.
2. **All four net-new systems are greenlit:** attendee Recap, Notifications (actionable, with prefs),
   Convene, and Messaging (Inbox, 1:1 + group). Phased after the visual rebuild; each needs cloud
   migrations that get a specific per-batch go before touching the production database.
3. **Rollout: not going live at BTW.** Build everything now at speed; Brent tests from tomorrow on the
   branch's Vercel preview URL. Production (grabsoda.app) stays on the current app for Latinos N Tech
   (Jul 9) and BTW (Jul 14 to 16); the rebuild merges after.

## Status (2026-07-06)
Phase A BUILT and on the `soda-attendee-rebuild` preview (commit 5a80b91). Phase B BUILT same day
(commit 9766806): the recap works on the preview now (no tables needed); convene, notifications, and
messaging are fully coded and gated ONLY on the batched migration
(`supabase/migrations/20260706010000_attendee_systems.sql`), which is written but NOT applied to any
database — it applies local-first with a real-JWT security pass, then cloud, on Brent's explicit go.

## Phases

- **Phase A (now): the visual rebuild over the existing backend.** No DB change. New tokens (the
  purple "private" system, gold, warn, surface-3, clamp display type) + font swap; kit atoms
  (BottomSheet, SegmentedToggle, Toast+Undo, StatTile, TopBar, TabBar); the app shell (top bar +
  5-tab nav: Home, Rooms, Card, People, Inbox); rebuilt Home (live/idle hero, card rail, rooms rail,
  kept warm), Card (faces + single-toggle inline edit), People (Convene/Contacts UI + Person Actions
  sheet), You (stats + settings + Equalpoint card), Room (status row, live search, moments grid,
  grid/list roster, card-expand + chip-detail sheets, session-once anchored tour), Inbox shell (empty
  state). Branch: `soda-attendee-rebuild`.
- **Phase B: the new backends**, one batched migration go: Convene list, Notifications (+fan-out),
  Messaging (threads/messages, RLS, realtime, soft-delete for Undo), attendee Recap (reuses the host
  recap computation, self-scoped), multi-card unpark (`soda-card-templates` branch: profile_cards
  migration + API already built) extended with the new card fields (business, website, show-up
  statement, signature), Lobby (scheduled times + RSVP).
- **Phase C: polish passes** from the walk + the States catalog (offline/error/loading behaviors),
  acts full-bleed refinement, moment-modal variants, Connect-in-Person QR exchange (reuses the shipped
  in-app scanner).

## Standing rules honored
No em dashes in copy; 44px targets; no colored side-accent borders anywhere (eyebrow color carries
meaning); warmth is language, never a number; person-level actions live in sheets, never inline on
rows; destructive actions toast with Undo; notifications must route to what they reference; the
purple system marks "private, just for you" everywhere. Native-ready discipline throughout (logic in
hooks, presentational views, everything token-traced) per [[SODA-Native-Ready-Architecture]] and
[[SODA-Design-Precision-System-Plan]].

## References
Spec: the handoff README (authoritative). Related: [[SODA-Universal-Build-Master-Plan]] (this rebuild
is its Phase 3 executed in-place on Next.js with native-ready discipline; the Expo move stays future),
[[SODA-Attendee-UI-Overhaul]] (superseded by this plan's concrete handoff), the Onboarding handoff
(waiting, ships second so both flows read as one product).
