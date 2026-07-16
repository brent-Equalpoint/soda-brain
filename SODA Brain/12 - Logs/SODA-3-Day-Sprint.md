# SODA — 3-Day Decks-Clearing Sprint

*Clear the open list (the prerequisite) so the Attendee UI Overhaul can roll out. **Day 1 starts
2026-06-28** (unless Brent overrides). Companion to [[SODA-Backlog]] and [[SODA-Attendee-UI-Overhaul]].
Tick boxes as we go.*

**Starting line — already shipped this week:** ✅ front-door fix · ✅ single-screen editor + focus
picker · ✅ navigation · ✅ Leave Room · ✅ attendee emails in the CSV · ✅ copy-survey-link · ✅ first
robot (E2E) test · ✅ **front-door email-probe security fix (the Day-1 P0), shipped + live 2026-06-27** ·
✅ Sentry monitoring code wired (awaiting your DSN key).

---

## ▢ Day 1 · 2026-06-28 — Lock the safety net + close the security hole

**I build:**
- [ ] **CI** — an automatic test-runner that checks every change *before* it can go live.
- [ ] **2 more robot tests** — "returning sign-in" and "leave → come back."
- [x] **Front-door security fix (P0)** — ✅ DONE: shipped to production 2026-06-27 (commit ec8e088). The
  returning door (`/signin`) no longer leaks whether an email already has a SODA account. (Pulled forward
  out of this sprint.)

**You (5–10 min each):**
- [ ] Decide **Doppler vs Vercel** for secrets.
- [ ] **Verify the email domain** in Resend so survey/recap emails actually send.
- [ ] **Review the DESIGN.md proposal** and decide whether to adopt it as the single design-token source
  (file: `05 - Design/Design System/DESIGN.md`). Pairs with the universal-UI / native direction
  ([[SODA-Universal-UI-Expo-Migration-Plan]]).

*Done when: nothing can break in production without a robot catching it. (The email-probe gap is already
closed, shipped 2026-06-27.)*

---

## ▢ Day 2 · 2026-06-29 — Quick attendee UX wins

**I build:**
- [ ] **In-event info card (#3)** — when you're already in an event, show "you're in [event] · X here"
  instead of the "enter a code" box.
- [ ] **Declutter the per-chip "specifics"** — tuck it behind one "Add specifics" toggle.
- [ ] **First-run tutorial + friendlier sign-in error screens** (the rest of the front-door polish).

**You:**
- [ ] **Send the first UI rebuild designs** (the micro-card) so the overhaul can start right after.
- [ ] Confirm the **consent wording** covers "your email may be shared with the host."

*Done when: the small rough edges from the pilot are gone.*

---

## ▢ Day 3 · 2026-06-30 — Survey tools + tidy + ship

**I build:**
- [x] **Printable / PDF survey results report** (the friendly version of the raw CSV).
- [ ] **Non-responder survey reminder** (email only the people who skipped it).
- [ ] **Final pass** — everything green, deployed, backlog + manifest reconciled.

**You:**
- [x] Flip the **Supabase toggles** (email rate-limit headroom, double-email, email styling).
- [x] Turn on **Sentry** — the code is already wired and verified (`soda-observability` branch); just add
  your DSN key in Vercel to light it up.

*Done when: the open list is cleared to its core, and the **UI Overhaul is ready to begin**.*

---

## Parked past these 3 days
Not blockers for the overhaul: CAPTCHA · the Clerk/Zustand architecture decision · load testing (k6) ·
visual regression · session replay · the deeper iOS "my live event" fix · event-times extras.

## Reality check
Days 2–3 are full. If one runs long, the survey report + matches-in-recap slip to a Day 4 — nothing
else. The **overhaul itself** starts after this sprint, rolling out per screen as designs arrive, with
the robot guarding each one.
