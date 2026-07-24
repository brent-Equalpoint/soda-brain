# SODA — Attendee UI / Frontend Overhaul (Plan + Checklist)

*The forward plan for re-building the attendee experience as a cohesive, friendlier UI layer, driven
by the founder's uploaded designs. Created 2026-06-27. Baseline = the shipped attendee flow (see
[[SODA-Flows-As-Built]]). Rolls out **after** the current open work clears (see [[SODA-Backlog]]).*

---

## Why now

The attendee experience is **functionally complete and live**: the foundation plus this cycle's
front-door fixes, single-screen editor, navigation, and Leave Room are all on grabsoda.app, tested,
and guarded by a Playwright end-to-end flow. With the function solid, the next initiative is a
deliberate **UI / frontend overhaul** — re-build the attendee screens to a consistent, more
user-friendly visual + interaction layer from the founder's designs. **The logic, data, routing,
realtime, and the flow fixes all stay; only the presentation layer is rebuilt.**

## Principles & guardrails (locked)

- **Design-driven.** The founder uploads designs per screen; we implement against the design system,
  not freehand. (Incoming: the micro-card edit, the templates swipe — see Backlog #2/#3.)
- **Preserve the spine.** Keep routing, data, RPCs, realtime, session, and the shipped flow fixes
  (front-door re-entry, Leave Room, the modal-centering fix). A re-skin must not change behavior.
- **Guard every change with tests.** The Playwright E2E flow (sign-up → room → leave) + the 33 unit
  tests re-run on every change — a re-skin can't silently break a journey. Expand E2E per rebuilt
  flow; add CI so it runs on every push. *This is exactly why the harness was built.*
- **Design system is the single source.** `globals.css` tokens only. Locked rules: buttons darken on
  press (never scale), chips are `rounded-full`, **no em dashes** (use "to"), green = interactive /
  confirming only, purple = private, amber = timers, red = errors only.
- **Mobile-first PWA.** Every screen verified on a mobile viewport; respect reduced-motion.
- **Incremental, never big-bang.** Ship per screen or small cluster; each screen stays shippable on
  its own, deployed code-only the same clean way as this cycle's batch.

## Baseline — the current attendee surface (what we're rebuilding)

- **Entry & auth:** the front door (`/`, `entry-hub`), sign-in (`/signin` + the join `sign-in-step`:
  email code / Google / password), the returning `card-choice`.
- **Onboarding & card:** the stepped profile builder (`profile-step`), the single-screen
  `card-editor` + the focus chip-picker modal, `card-chips`, `step-progress`.
- **The room (the heart):** `room/page` shell + `room-header`, `roster-views` (Grid / List / Cards),
  `attendee-card`, the Act overlays (`live-drop-overlay`, `chance-overlay`, `nudge-overlay`),
  `comment-overlay`, `notes-sheet`, `wall-view`.
- **Home & relationships:** `home/page` (your card + your people + the "In an event?" code box + the
  re-entry recap banner), `draft-composer`.
- **Leave & close:** the leave recap (`/left`), `/wrap`, `/survey`, `/send-off`.
- **Account:** `/account`, `/account/password`.
- **Shared kit (atoms):** `avatar`, `chip`, `primary-button`, `card-chips`, `card-editor`,
  `event-code-box`, `loading`, `logo-splash` / `startup-splash`, `screen-header`, `app-tabs`,
  `stat-card`, `sign-out-button`.

## Approach — phases

Order flexes to the founder's design delivery; the room gets the most test coverage (highest value,
highest risk). Each phase ships incrementally.

- **A · Foundation.** Audit + extend the design tokens and the **shared component kit** (the atoms)
  against the new designs, so every screen composes from a consistent set. Includes empty / loading /
  error states (spec: [[SODA-Empty-Loading-Error-States]]).
- **B · Entry & onboarding.** Front door → sign-in → first-time card build → card editor. The first
  impression. **Lead fix (from Latinos N Tech, where guests got trapped after sign-in before a card
  existed): separate "join an event" from "build your card"** so a signed-in guest can't fall into the
  card flow by accident and dead-end. See [[SODA-Report-Latinos-N-Tech]].
- **C · The room.** The heart + highest-stakes (live, realtime): the shell, header, roster views, the
  attendee card, and the Act overlays. Heaviest E2E coverage.
- **D · Home & relationships.** Your card → the **micro-card edit (#2)** and the **templates swipe
  (#2/#3)**; your people + the draft composer. The held card-templates backend + its DB migration
  ship here, with the UI.
- **E · Close & follow-up.** Leave recap → wrap → survey → send-off.
- **F · Account & polish.** Account, a motion pass, the empty/loading/error states sweep, and an
  accessibility pass.

## The checklist

### Cross-cutting (start first, run continuously)
- [ ] Audit + extend design tokens in `globals.css` against the new designs.
- [ ] Rebuild / confirm the shared component kit (Avatar, Chip, Button, CardChips, inputs, headers).
- [ ] Empty / loading / error state for every screen.
- [ ] Motion pass (calm, on-brand; reduced-motion respected).
- [ ] Accessibility sweep (labels, contrast, 44px touch targets, focus order).
- [ ] Expand E2E per rebuilt flow (returning sign-in; leave → re-enter; host go-live) + add CI.

### Screens
- [ ] **Front door** (`/`)
- [ ] **Sign-in** (`/signin` + join `sign-in-step`) — code / Google / password
- [ ] **Returning card-choice**
- [ ] **Profile builder** (first-time onboarding)
- [ ] **Card editor** (single-screen) + focus picker → **micro-card #2** (designs incoming)
- [ ] **Room shell + header**
- [ ] **Roster views** (Grid / List / Cards) + attendee card
- [ ] **Act overlays** — Drop, Chance, Nudge
- [ ] **Comment sheet + Notes sheet**
- [ ] **Wall view**
- [ ] **Home** — your card + **templates swipe (#2/#3)** + your people + draft composer + code box
- [ ] **Leave recap** (`/left`)
- [ ] **Wrap** (`/wrap`)
- [ ] **Survey** (`/survey`)
- [ ] **Send-off** (`/send-off`)
- [ ] **Account** + password

## Sequencing / rollout

1. **Prerequisite:** clear the current open work first ([[SODA-Backlog]]) — the UX/security/decision
   items — before rolling this out.
2. **Then roll out by phase** as the founder delivers designs; ship per screen, code-only; the E2E
   flow guards each step.
3. **Fold in the held card-templates** (backend + swipe UI + its DB migration) during Phase D — the
   one place a database change ships in this overhaul.

## References

[[SODA-Flows-As-Built]] (the as-built flows) · [[SODA-Backlog]] (open items, the prerequisite) ·
[[SODA-Status-Manifest]] (snapshot) · the Design System (`05 - Design/Design System`) ·
[[SODA-Empty-Loading-Error-States]] · [[SODA-Design-Spec-Home-Screen]] ·
[[SODA-Design-Spec-Remaining-Screens]].
