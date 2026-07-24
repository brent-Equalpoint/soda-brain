# SODA Back-Office Design Drop — Handshake for Claude Code

This document travels with the design drop and answers the migration brief
(`admin-migration-brief`). Read the brief first; this maps the delivered design onto it,
screen by screen, so the front-end pass is mechanical. House style applied: no em dashes.

---

## 1. What is in this drop

| File | What it is |
| --- | --- |
| `SODA Admin.dc.html` | The working design prototype. One file, all screens, fully interactive on mock data. Open it in a browser; every flow below is walkable. |
| `design_handoff_admin/STATE-LOGIC.md` | The complete state contract: every state field, initial value, transition, threshold, and rule, tagged [ADMIN] / [HOST] / [SHELL]. Treat it as the source of truth for behavior. |
| `fonts/BeVietnamPro-*.woff2` | Type. Display and body are Be Vietnam Pro; labels/metadata use Public Sans. |

The prototype is deliberately a **single surface with a view switcher** so the whole system could
be designed and tested in one place. It is NOT the target IA. Section 3 assigns every view to its
door. Splitting it is your job; changing what the screens do is not.

## 2. Compliance with the hard rule (brief §0)

- The prototype touches no backend. All data is mock, constructed in one class.
- Nothing in the design assumes schema, RLS, RPC, or route-handler changes.
- Where the design shows data the current API may not expose (see §6 ledger), it is flagged,
  not silently required. Wire what exists; stub or hide what does not, and flag it back.

## 3. View → door assignment (brief §1)

Split the prototype's views across the two host doors exactly as follows:

**ADMIN `/admin` (set up, before/after the night)**
- Events (list, two-step creation with survey builder, Make live, per-event Codes modal)
- Funnel analytics
- Offers vs Needs (supply/demand)
- Chip Queue (write-in approval)
- Manual Check-in (including the door QR tiles and custom chips)
- Recap (generation status + push)
- Export (attendees CSV, matches CSV, full-night JSON)

**HOST `/host` (run live, during the night)**
- The Room (grid/list roster, search, presence, person cards)
- Live Moments (Drop / Chance / Nudge with delivery status, The Spotlight)
- Call-out (multi-select + floating action bar + block guard)
- Messages (host DM threads) and the person-card composer
- Safety (block/report queue, resolve, remove with confirm + undo)
- Matches + intro chains
- Activity log (shared write surface, lives in HOST; ADMIN can link to it)
- Attendee phone preview rail

**Shared chrome [SHELL]:** sidebar/nav pattern, toast + undo, confirm modal, responsive
breakpoints (<760 mobile, <1100 narrow), Door mode. These are one component set used by both
doors so the two surfaces read as one product.

**Check-in note:** the brief lists check-in under both doors' histories. The design puts the
full check-in form in ADMIN and reaches it live via **Door mode**, which is the stripped
role-surface (nav collapses to Check-in + The Room, identity flips to Door staff). Re-house
`check-in-form.tsx` once; both entries point at it.

## 4. Screen → component map (brief §5.4)

| Prototype view | Re-houses (from brief §2) |
| --- | --- |
| Events + creation + survey builder | `manage-event.tsx` (tabbed setup), `survey-tab.tsx`, `survey-editor.tsx` |
| Chip Queue | `chip-moderation.tsx` |
| Manual Check-in + Door mode | `check-in-form.tsx` |
| The Room (grid/list) | `room-view.tsx` |
| Live Moments | `control-card.tsx`, `chance-control.tsx`, `nudge-control.tsx`, Drop control, `sync-control.tsx` |
| Funnel / Offers vs Needs / Matches | `intel-view.tsx`, `stat-bar.tsx` |
| Activity log | `activity-feed.tsx` |
| Recap + Export | send-off copy + export pieces inside `manage-event.tsx` |
| Survey monitor (live responses) | `survey-monitor.tsx`, lands in HOST next to Live Moments; visual style follows the Chip Queue rows |
| Collaborators panel | `collaborators-panel.tsx`, lands in ADMIN under Events (event detail); not mocked in the prototype, apply the Events row + modal pattern |
| Shell (sidebar, header, rail) | replaces `cockpit.tsx` shell and the admin page chrome |
| Settings control | `settings-control.tsx`, folds into ADMIN event detail |

Nothing from §2 is removed. Two intentional merges: settings into event detail, and survey
authoring into event creation (step 2) with the same builder reachable from event detail for
editing.

## 5. Gates and navigation (brief §5.1, §5.3)

The prototype does not mock sign-in screens. Build three distinct gates using the attendee
onboarding's visual language (`SODA Onboarding.dc.html` is the reference for the entry feel):

- `/admin` gate: its own screen, copy oriented to setup ("Set up your room").
- `/host` gate: its own screen, copy oriented to going live ("Run the room").
- `/ops` keeps its existing separate sign-in pattern, restyled to match.
- Kill the shared `host-sign-in.tsx` by splitting it into the two gates above; both still call
  the frozen `resolveHostRole`, nothing about auth changes.

Navigation model:
- A persistent, deliberate ADMIN ↔ HOST switcher in the sidebar header area (same identity,
  two tools). One click, clearly labeled "Set up" / "Run live". It is a navigation between
  doors, not a mode toggle inside one door.
- From Master Ops, an explicit "Open as host" action per event steps the operator into ADMIN
  or HOST for that event. No silent landing.
- Door mode is not a door. It is a stripped in-HOST role surface for volunteers.

## 6. Mock vs real ledger

Wire these to the existing frozen endpoints; the design treats them as live data:
events, attendees/roster, presence status, chip queue, matches, survey definitions and
responses, reports/blocks, check-in, exports.

**Prototype mocks to replace:**
- QR patterns are deterministic fakes. Encode the real join links (`/join?t=...`). The event
  code / link / QR generation contract is in STATE-LOGIC §12 and §13.
- Delivery numbers (sent / unreachable) are fixed mocks per act.
- `blockedPairs`, funnel counts, supply/demand tallies, activity seed rows: all mock data.
- The attendee phone preview simulates the phone; if a real preview channel exists, wire it,
  otherwise keep the simulation, it is host-facing UI only.

**Flag-if-no-endpoint (per brief §6, these may need endpoints; do not build them, flag them):**
call-out, The Spotlight, host→attendee DMs, delivery telemetry, activity/audit log persistence,
block-aware targeting checks, per-event short code + join token, recap push. If an existing
`/api/host/*` route covers one, wire it; otherwise ship the UI behind a disabled or hidden state
and report the gap.

## 7. Behavior contracts to preserve exactly

From STATE-LOGIC.md, the ones most easily lost in translation:
- Funnel thresholds: drop rate ≤14% green Holding, ≥15% amber Worth a look, ≥30% red Alert plus
  the calm alert strip. Delta text is always amber. First step is neutral Source.
- Undo semantics: destructive-lite actions (chip reject, report resolve, removals) restore a
  snapshot within a 5.2s toast window. Removals and recap push and make-live gate behind the
  confirm modal first.
- Block guard: a selection containing a blocked pair disables Call out and shows the warning
  inline. Targeting features never reach blocked pairs or departed guests.
- Presence: "Checked in" and "In room now" are different numbers; Left quietly people are
  excluded from selection, Spotlight, and pairings.
- One-shot acts vs re-firable Spotlight.
- Custom chips at check-in persist for the session and pre-select on add.

## 8. Definition of done

- [ ] Three doors, three gates, zero shared sign-in surfaces.
- [ ] Every §2 component re-housed per the map in §4, nothing dropped.
- [ ] Every view walkable at 375px, 768px, and 1280px (prototype breakpoints: 760 / 1100).
- [ ] All STATE-LOGIC transitions reproduced (spot-check §7 list).
- [ ] All frozen `/api/host/*` and `/api/ops/*` routes still wired to a screen.
- [ ] Gap report delivered for every §6 flag-if-no-endpoint item.
- [ ] Copy check: no em dashes anywhere in product copy.
