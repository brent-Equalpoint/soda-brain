# SODA — Build Status Manifest

**As of 2026-06-26 · Equalpoint, Inc., piloted by Futureland · Cleveland**
*A printable snapshot: what's done and tested, what's built and waiting, what broke and how we fixed
it, and what's left. Companion to SODA-Session-Work-Log.md and SODA-Backlog.md.*

---

## At a glance

- **Live on grabsoda.app:** the full attendee + host + operator app (foundation), plus this cycle's
  brand layer, scheduled event times, the ops-login gate, and the returning/closing flow. **12
  commits shipped.**
- **Built + verified, HELD for your final localhost test, then deploy:** the front-door fixes, the
  single-screen card editor + focus picker, the labelled-Home navigation, the Leave Room flow, a
  modal-centering fix, and an automated test harness. **6 commits, all green.**
- **Tested:** typecheck + production build + 33 unit tests + 1 end-to-end browser flow — all passing.
  Manual walk-throughs in progress.
- **In process / backlog:** a UX-friendliness pass, card-templates UI, testing/CI expansion, security
  follow-ups, and a few decisions on your side.

---

## 1. Completed & SHIPPED to production (live on grabsoda.app)

### Foundation (earlier phases — live)
- **Attendee app:** scan QR / enter code → host-branded sign-in → build a card → live room (the
  directory, leave notes, the live Acts **Drop** & **Chance**, nudges, announcements) → close →
  survey → send-off. Your card + your people (warmth, nudges, follow-up drafts) live on Home.
- **Host app:** **Admin** (create → go live → share link + QR → close → CSV exports; manual check-in;
  collaborators) and the **Command Center** cockpit (**Acts / Room / Survey / Feed / Intel** + host
  settings + chip-moderation + the matching engine + Announce-to-room). **Door kiosk** for the
  entrance.
- **Operator:** the gated **Ops console** + **Ops analytics** across all events.
- **Security model:** every write goes through an owner-checked security-definer RPC behind RLS;
  realtime carries only bare pings (nothing private or spoofable).

### This cycle (shipped)
- **Brand layer** — app-open logo splash (black, ease in/out), the SODA logo across the app + home
  header + event/room entry; iOS splash-centering + em-dash copy fixes.
- **Signed-in landing tidy** — leads with Your card, adds Sign out, hides Host sign-in.
- **Discrete Delete-account** — a quiet link that only turns red on intent.
- **Scheduled start/end event times + timezone** + a soft, dismissible cockpit "end the night" nudge.
- **(2026-06-24)** join flow one-welcome-moment; **SODA-042** ops login gate + audit; returning/closed
  flow (5h welcome-back, dedicated /wrap screen, survey link in the recap email).

---

## 2. Built + verified, HELD for deploy (committed, not yet live)

*Branch `soda-card-templates`, 6 commits, each green (typecheck, production build, 33 unit tests).
Awaiting your localhost verdict; deploys to production on your go.*

1. **Front-door dead-end fixes** *(the worst pilot failure)* — `/home` "Back to {host}'s room"; a
   Cancel escape in the card builder; the room with no local session lands on the hub, not the "need
   your QR" error.
2. **Single-screen card editor** — fast one-screen editing (name/role/offers/needs + sticky Save),
   replacing the stepped builder for editing on /home and in the room.
3. **Focus chip picker** — each offer/need's focus ("Mentorship in design") is a chip picker in a
   modal (controlled menu + add-your-own).
4. **Navigation** — a labelled **"Home"** from inside the room; an **"In an event?"** code box on
   /home (join from your card screen); front door + /home share one component.
5. **Leave Room** — **← Leave** → confirm → recap (connections + time) → Back to the room / Home;
   session kept for re-entry; /home banner shows the recap.
6. **Modal-centering fix** — entry animations no longer trap pop-ups inside the tall page.
7. **Card templates — BACKEND** — a `profile_cards` table (one active card, capped at 5), the
   create/edit/activate/delete logic, contracts, and the API. *(Swipe UI still to build.)*
8. **Automated test harness** — Playwright + the first end-to-end flow.

---

## 3. Testing status

| Layer | What it covers | Status |
|---|---|---|
| **Typecheck** | TypeScript strict, 3 packages | ✅ green |
| **Production build** | Next.js build of every screen/route | ✅ green |
| **Unit tests** | 33 tests: matching engine, dates/warmth, data shapes, access roles, ops-login | ✅ green |
| **End-to-end browser** | 1 flow: sign-up → room → leave (Playwright, mobile) | ✅ passing |
| **DB migrations** | local apply + `supabase db lint` | ✅ clean |
| **Manual smoke** | localhost walk-throughs of the held batch | 🔄 in progress (your test) |
| **CI (auto-run)** | runs tests on every push before deploy | ❌ none yet (Vercel build is the only auto gate) |

---

## 4. Failures & fixes (the record)

### This cycle
- **[Production failure] The front door.** Returning guests who closed the screen got stuck on their
  card with no way into their live room. → Fixed three pre-existing dead-ends (back-to-room, builder
  Cancel, room→hub redirect). *Held for deploy.*
- **[Bug] Leave-room pop-up appeared below the fold** (you had to scroll to see it). → Root cause:
  entry animations ended on a lingering invisible "transform," which trapped pop-ups inside the tall
  scrolling page. Fixed by ending the animations cleanly (no leftover transform); fixes every in-room
  pop-up at once. *Held.*
- **[Design] The fast editor first dropped the per-chip focus** ("Mentorship in [x]"). → You flagged
  it; rebuilt focus as a chip picker in a modal. *Held.*
- **[Data] The leave recap wanted "matches,"** but attendees can't see matches today (host-only). →
  Deferred matches; recap shows connections + time.
- **[Dev environment] Installing the test tool crashed the running dev server** (a Turbopack
  workspace-root hiccup). → Restarted; healthy; your test event still live.
- **[Typecheck] The test helper tripped strict null-checking** on a regex result. → Fixed.

### Earlier this build (fixed and shipped)
- **Double "you're in" welcome** on Google sign-in (the round-trip reset it). → Fixed: one welcome
  moment.
- **"Welcome back" shown for a room that had already closed.** → Fixed: status-aware shortcut.
- **A live Act could stack on top of the closing screen.** → Fixed in three layers.
- **Closing from Admin didn't tell the room.** → Fixed: it broadcasts; the room self-heals.

### Process safeguards that worked
- Cloud database pushes and production deploys were correctly **blocked until you explicitly
  authorized each one** — no accidental production changes. Every batch built on its own branch.

---

## 5. In process / to be completed (backlog)

*Full detail with owner tags in SODA-Backlog.md. Owner key: **[me]** = ready to build on your go ·
**[you]** = your action/decision · **[blocked]** = waiting · **[idea]** = not committed.*

### 🧪 Testing & Quality
- [me] More E2E flows (returning sign-in, leave→re-enter, host go-live) · [me] **CI pipeline**
  (auto-run all tests before deploy) · [me] iPhone/Safari E2E · [you] Sentry (prod error monitoring) ·
  [idea] k6 load test (a packed room) · [idea] visual regression · [idea] session replay.

### 🎨 UX / flows polish (current focus)
- [blocked] **Micro-card edit (#2)** — *waiting on your card designs* · [me] **In-event info card
  (#3)** · [me] per-chip declutter · [me] matches in the leave recap · [me] first-run tutorial +
  per-error screens.

### 🚧 Built, awaiting your go
- [you] **Deploy the held batch** (everything in §2) · [me] **Card templates swipe UI** (Phase 5).

### 🔐 Security & ops
- [me] **Attendee front-door email-probe gate (P0)** · [idea] CAPTCHA · [me] eviction-proof "my live
  event" lookup (deeper iOS fix).

### ⚙️ Decisions / dashboard toggles (your side)
- [you] Doppler vs Vercel (secrets) · [you] Clerk/Zustand foundation (Alysha's call) · [you] Supabase
  toggles (email rate-limit, double-email, email styling).

### 📅 Deferred follow-ups
- [me] Non-responder survey reminder · [me] event-times follow-ups (ops-board display, auto-open,
  reminders) · [me] QR-splash consolidation.

---

## 6. Key decisions locked (this cycle)

- **Ship the brand/polish layer; hold the attendee-experience batch** behind a real localhost test.
- **Card templates** carry only the *way you show up* (label + role/offers/needs); name + email are
  one shared identity; picking a template sets your active card; email capture deferred.
- **Two homes, linked, not merged;** navigation uses labelled controls, never a logo you must guess.
- **Leave Room keeps your session** (re-entry); recap = connections + time (matches later).
- **Guard the doors with end-to-end tests, not every corner;** add a CI gate next.

---

## Addendum — 2026-06-27

**Status update since this snapshot:** the held attendee batch (§2) and both host tools **shipped to
production** — front-door fix, single-screen editor + focus picker, navigation, Leave Room, the modal
fix, the e2e harness; the attendee-email CSV column; and copy-survey-link. All deployed code-only on
clean branches off main. **Held by choice:** the card-templates backend (carries a DB migration + has
no UI yet) — ships later with its swipe UI.

**Next initiative — Attendee UI / Frontend Overhaul (post-backlog).** With the attendee flow
functionally complete and live, the next major thrust is a deliberate **UI / frontend overhaul** of
the attendee experience: re-building the screens to a cohesive, friendlier UI from the founder's
designs, while the logic / data / flows stay put. It rolls out **after** the current open work clears
([[SODA-Backlog]]). Full plan + checklist: **[[SODA-Attendee-UI-Overhaul]]**. Guard rail: the
Playwright E2E flow re-walks sign-up → room → leave on every change, so the re-skin can't break a
journey.

---

*Pointers: SODA-Session-Work-Log.md (the narrative) · SODA-Backlog.md (the open list) ·
SODA-Flows-As-Built.md (every flow) · SODA-Attendee-UI-Overhaul.md (the next initiative). A name tag
knows you showed up. SODA knows who you became to the room.*
