# SODA Master Ops Rebuild - Clone the Admin Shell

**Status:** Proposed (awaiting Brent's go)
**Date:** 2026-07-13
**Design source:** the same one Admin used - `05 - Design/ADMIN Design/` (STYLE-SPEC.md + SODA Admin.dc.html). No new design work needed; that is the point.

---

## 1. What this is, in plain English

The Admin door (`/admin`, the host back-office) was re-housed in the vault's ADMIN design in July: the dark sidebar with icon navigation, the view header, the panel cards, the right rail with tallies, fully responsive down to a phone. Master Ops (`/ops`, Brent's console) never got that treatment - it is still a plain single-column page from an earlier era.

This plan clones the Admin look for Ops **without forking it**: the shell Admin uses becomes a shared piece that both doors import. Ops gets the exact same visual language - same sidebar, same cards, same type, same responsiveness - and any future polish to the shell lands on both doors at once. All of Ops' powers (the live board, host onboarding, update announcements, lifecycle actions) keep working unchanged; only the house around them changes.

---

## 2. The donor: what Admin's rebuild actually consists of

| Piece | File | What it is |
|---|---|---|
| The style contract | `app/(host)/admin/admin.css` (809 lines) | Every colour/type/spacing value lifted verbatim from the vault spec, scoped to `.adm` (plus `.adm-scrim`/`.adm-toast` for overlays) so the attendee app is untouched. Includes the **palette remap**: shared app components rendered inside the door get re-skinned to the admin surface automatically. |
| The shell | `_components/admin-shell.tsx` | The chrome: sidebar (brand, status pill, icon nav with badges, identity foot) / main (view header + scrolling content) / right rail (tallies). Responsive: below 760px the sidebar becomes a top header + horizontally scrolling nav pills; below 1100px the rail drops. Also exports the door primitives: `AdmToast`, `AdmConfirm`, `useAdmDialog` (focus-trapped dialogs). |
| The app model | `_components/admin-app.tsx` | `AdmNavItem[]` nav (id, label, Tabler icon, badge, tone) + views clamped to what the state allows. |

The key property: **the shell is already generic.** Nav items, rail stats, brand label, and view content are all data/props. Nothing in it is host-specific except what `admin-app.tsx` feeds it.

## 3. The patient: what Ops is today

`/ops` (671 lines total across three files), server-gated at `page.tsx` (signed-in + `is_operator`, non-operators never receive the console):

- **The stats trio** - events / live now / guests.
- **Onboard a host** - email + brand + first event.
- **Announce an update** - the "what's new" compose panel (shipped 2026-07-13), with preview + history.
- **The all-events board** - every event across every host, with lifecycle actions (go live / end) and the event details editor.
- **The sign-in door** - `ops-sign-in.tsx` with the SODA-042 pre-auth gate (email must be on the operators list before a code is ever sent).
- **Analytics** lives at a separate bare `/analytics` page (per ADR-020, ops + analytics eventually move together to `ops.grabsoda.app`).

All data flows through operator-checked APIs (`/api/ops/*`); none of that changes.

---

## 4. The plan

### Phase 1 - Promote the shell to a shared door kit (no visible change)

Move the reusable pieces out of Admin's folder into a shared home, e.g. `apps/web/components/door/`:

- `admin-shell.tsx` → `door/door-shell.tsx` (rename exports to neutral: `DoorShell`, nav/rail types; keep `AdmToast`/`AdmConfirm`/`useAdmDialog` as-is - the `Adm` prefix is cosmetic).
- `admin.css` → `door/door.css`, **verbatim** (it stays the pin-level contract; the "do not restyle" note rides along). The `.adm` scope class stays - Ops simply renders inside `.adm` too; it is a scope name, not a semantic.
- Admin's imports update; **zero pixel change to /admin** - verified by before/after screenshots (desktop + <760 mobile) on the design harness or a signed-in run.

Why promote instead of copy: Brent's ask is "clone how admin looks." A copy drifts (two 800-line CSS files, fixes landing in one). A shared shell makes the clone literal and permanent.

### Phase 2 - Re-house Ops in the shell

`ops-console.tsx` becomes the Ops equivalent of `admin-app.tsx`: it feeds the shared shell nav + views and keeps every existing handler.

**Nav (the left rail views):**

| View | Contents (all existing) |
|---|---|
| **Board** (default) | The stats trio as rail-style tallies + the all-events board with lifecycle actions + details editor |
| **Hosts** | Onboard a host (room to grow: a host list later) |
| **Updates** | The Announce-an-update panel (compose + preview + history) |
| **Analytics** | Nav item linking to `/analytics` for now (see Phase 3) |

- Sidebar brand: **Master Ops** with the Equalpoint eyebrow; the status pill shows `LIVE NOW: n` (live event count).
- Badges: events count on Board, live count tone-green; unread/none elsewhere.
- Right rail: platform tallies (events / live now / guests / hosts) + the latest published update - the ops version of Admin's "tonight" numbers. Drops below 1100px exactly like Admin's.
- Identity foot: operator email + sign out (already exists, restyled).
- **The sign-in door** (`ops-sign-in.tsx`): keep the pre-auth gate logic byte-for-byte, re-dress the form in the door language (panel card, spec inputs, spec buttons).
- Feedback: replace inline `obMsg`-style text with the shell's `AdmToast`, and the end-event confirm with `AdmConfirm` - same interaction grammar as Admin.

**Unchanged on purpose:** `page.tsx` server gate, every `/api/ops/*` route, the operator model, the updates system. This is a re-housing, not a rewrite.

### Phase 3 (optional, later) - Analytics under the same roof

Bring `/analytics` in as a real view inside the Ops shell (it is operator-gated already and ADR-020 moves the two together to `ops.grabsoda.app`). Kept out of Phase 2 so the reskin ships without touching the charts. The ADR-020 host-gate work is orthogonal and unaffected - when the subdomain flips on, it carries the new look with it.

---

## 5. Verification

- **Admin regression:** before/after screenshots of /admin at desktop + mobile widths after Phase 1; pixel-identical is the bar (the CSS moves verbatim, so any diff is a bug).
- **Ops:** screenshots of every view at desktop + <760 + the sign-in door; the existing operator flows clicked through (onboard, publish update, unpublish, go-live/end, details edit).
- Typecheck, 158-test suite, production build - the usual gates.
- No migrations, no API changes, no new env: **code-only ship**, deployable the same day it is built.

## 6. Size and risks

- **Size:** Phase 1 + 2 together are roughly one session (the shell is already generic; Ops' logic all exists). Phase 3 is a small follow-up.
- **Risk - overlay scoping:** admin.css deliberately scopes tokens to `.adm, .adm-scrim, .adm-toast` because modals portal outside the shell. Ops reuses those exact classes, so its overlays inherit correctly. Anything Ops portals to `<body>` must carry the scope class - same rule Admin already follows.
- **Risk - embedded shared components:** Ops embeds `EventDetailsEditor` (an app-token component). Inside the door scope it gets the palette remap automatically - the same mechanism that re-skins the survey/check-in editors inside Admin. Expected to just work; verified by screenshot.
- **Icons:** Tabler icons are SELF-HOSTED (`@tabler/icons-webfont`, pinned, imported in Admin's `page.tsx` - never the CDN; that was a deliberate post-audit fix). Ops' `page.tsx` adds the same import.
- **Shipped-then-fixed lessons that must carry over** (from the Admin post-ship audit): the responsive media queries MUST stay last in the stylesheet (source order beats them otherwise - this was a real production bug once), and the token scope must include the overlay classes, since modals/toasts portal outside the shell.

## 7. The one decision

Ship Phases 1+2 together (Admin shell extraction + Ops re-housing, one PR, one deploy) - or split them into two deploys so the Admin no-change refactor is proven live before Ops lands on it? **Recommendation: one ship.** The extraction is mechanical, the screenshot regression catches any drift, and both doors are operator/host surfaces with tiny blast radius compared to the attendee app.
