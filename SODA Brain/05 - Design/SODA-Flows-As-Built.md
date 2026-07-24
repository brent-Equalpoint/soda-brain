# SODA — Flows, As Built

*A current-state inventory of every user flow in SODA: the source of truth for the UX-friendliness
pass. This reflects what is actually **shipped or in-flight** as of **2026-06-25**, which is distinct
from the design-era intent maps ([[SODA-Attendee-Flow-Map]], [[SODA-Host-Flow-Map]]). When the two
disagree, this file describes reality (the built app); the maps describe the original design.*

**Status legend:** 🟢 live on grabsoda.app · 🟡 built + committed, **held for the localhost test**
before deploy · 🔵 planned / backend-only · ⚪ parked

You have ~14 distinct flows across three kinds of people: **Attendee**, **Host/Owner**, **Operator**.

---

## 🟢 Attendee (the guest) — the heart of the app

### 1. First-time sign-up → into the room 🟢
Scan the event QR (or type the event code at the front door) → host-branded **Sign-In** (email
6-digit code, Google, or password) → **build your card** (role → what you offer → what you need) →
"You're in" splash → the **live room**. Routes: `/join` → `/room`.

### 2. Returning sign-in 🟢
Front door → "Have a SODA card? Sign in" (`/signin`) or type a code → sign in →
**"Keep how you showed up, or change it"** → the room. Returning guests only at `/signin` (no new
account there).

### 3. The live room 🟢 *(room navigation 🟡)*
The live directory: everyone (Grid / List / Cards), who's here now (presence), leave a private
**note**, **edit your card** in place, and the host's live **Acts** (Drop, Chance), **nudges**,
**announcements**, and your **notes inbox**. Route: `/room`.

### 4. Leave the room 🟡 *(new)*
**← Leave** → "Leave the room?" confirm → **recap** (connections + time) → Back to the room / Home.
Session is kept, so re-entry is one tap (the front door + the home banner both offer it). Routes:
`/room` → `/left`.

### 5. Home — your card & your people 🟢 *(recap card + code box 🟡)*
**Your card** (Edit), and **Your people** — the connections that outlive the night, each with a
warmth bar, "reach out" nudges, and a follow-up **draft composer**. Plus a "Back to {host}'s room"
banner (now with a recap) and an "In an event?" code box. Route: `/home`.

### 6. The front door 🟢
Smart routing on app open: still in a live room → "step back in"; just closed → the wrap; otherwise
the hub (enter a code / your card / sign in). Route: `/`.

### 7. Closing the night 🟢
Host ends it → **"That's a wrap"** (`/wrap`) → post-event **Survey** (the host's own questions,
`/survey`) → **Send-Off** (warm goodbye + your connection count + the host's next-step button,
`/send-off`). A recap email also goes out with a survey link.

### 8. Account 🟢
Manage your identity, set/change a password (`/account/password`), delete your account, Privacy
Policy (`/privacy`). Route: `/account`.

---

## 🔵 Host / Owner (running the event) — all 🟢

### 9. Host sign-in
One login, two tools (Admin + Command Center).

### 10. Admin — back office (`/admin`)
Create an event → take it **live** → share the **link + scannable QR** → manage dates & settings →
**close** the night → **export CSVs** (attendees, matches, survey). Also: delete a draft,
**manual check-in** for stubborn phones, invite **Collaborators**.

### 11. Command Center — the live cockpit (`/host`), in tabs
- **Acts** — fire the **Drop**, **Chance**, **Nudge**; **Announce** to the room
- **Room** — the live roster
- **Survey** — author questions + watch answers come in live
- **Feed** — the live activity stream
- **Intel** — the **matching engine** (who can help whom, mutual matches, top connector,
  supply/demand gaps)
- **Settings** — note limit, editable Send-Off copy, the onboarding **chip menus**, the
  **chip-moderation** queue

### 12. Door kiosk (`/kiosk`)
A locked screen for a shared device at the entrance: big **QR + code + live headcount**, with one-tap
greeter **check-in**. No app navigation, no personal data — a guest can't wander off.

---

## ⚫ Operator (Equalpoint — above every host) — 🟢

### 13. Ops console (`/ops`)
The master board across every host/event, behind a **server-gated** sign-in with an audit log
(SODA-042).

### 14. Ops analytics (`/analytics`)
The platform pulse: totals + per-event breakdown across every event.

---

## Access model

**Operator** (master key, all events) › **Owner** (their own events, incl. export/delete) ›
**Collaborator** (can run a night, can't export or delete).

---

## UX-honing backlog — rough edges to make friendlier

The reason this file exists. Seeded with what we already know; add to it as the pass continues.

- **Card editing → a micro card** (#2): drop the separate EDIT button; tap a simpler **micro card**
  to expand it into a full profile modal you edit from. *Designs being uploaded — see
  [[SODA-Card-Design-Ideas]].*
- **In-event info card** (#3): when you ARE in a live event, swap the "In an event?" code box (and an
  Account slot) for a **current-event card** (event name + live headcount). *Ticket for later.*
- **Per-chip detail declutter** (parked): collapse the per-chip "Add specifics" behind one
  disclosure instead of an always-open list.
- **Matches in the leave recap** (🔵): attendees can't see their matches yet (that's host-only Intel);
  the leave recap shows connections + time for now, matches later.
- **Card templates — swipe to pick a "way to show up"** (🔵): keep several saved cards (Founder,
  Artist…) and swipe on home to choose one. Backend built; the swipe carousel is the next piece.
- **Held for the localhost test, then deploy (all 🟡):** the front-door dead-end fixes, the
  single-screen card editor + focus picker, the labelled-Home navigation, and the Leave Room flow.

---

*See also: the **test plan** that walks every flow below for dead ends / loops / fires:
[[SODA-Flow-Test-Plan]]. Design-era intent in [[SODA-Attendee-Flow-Map]] + [[SODA-Host-Flow-Map]]; the
running [[SODA-Session-Work-Log]]; the pilot findings in [[SODA-Pilot-Report-Coffee-Connect]].*
