# SODA Build Session, Work Log

*A record of everything produced and decided in this session. A product of Equalpoint, Inc., piloted by Futureland. Cleveland, 2026.*

---

## Safepoints

> A safepoint is a known-good state. Set one whenever a slice ships, a prototype is approved, or a risky migration completes. If something breaks, find the last safepoint and rewind to it — branch, commit, verified files, next action, all captured in a single entry.
>
> Full format and when-to-set rules: `SODA Build Error Log/BUILD-ERROR-LOG.md`

| ID | What's stable | Task | Branch / Commit | Date | Agent |
|---|---|---|---|---|---|
| SAFE-001 | Full design surface specified. Component inventory at 92. Build manifest at 105 items. No code shipped — this is the pre-build baseline before Phase 0 starts. | — | main / pre-build | 2026-06-09 | Orchestrator |
| SAFE-002 | Phase 0 foundation scaffold shipped in the `Soda` repo. pnpm + Turborepo monorepo; Next.js 16.2 (Turbopack) PWA shell with locked dark-mode tokens (Tailwind v4 `@theme`, `--muted` #8A8A8A); empty route shells (`/`, `/join`, `/room`, `/home`, `/host`, `/api/health`); Supabase auth wiring (`@supabase/ssr` + `proxy.ts`, no cloud project linked); `packages/contracts` (Zod v4) + `packages/ui`; single-source `lib/warmth`. STRICT experience-first — no application tables, no seed yet (deferred to Phase 1). Verified green: `pnpm install`, typecheck 3/3, `next build`, dev boot + route probes (all 200). Quality gates: TS strict + Prettier (ESLint removed by decision). | GMW-001 | gmw-001-phase-0-foundation / c180a94 | 2026-06-11 | Orchestrator |
| SAFE-003 | Host surfaces complete — the full host loop runs end to end. **Admin** (create → go-live → close lifecycle, link + scannable QR share, confirm-guardrails, delete-a-draft, manual check-in, CSV exports) and the **Command Center** (Acts / Room / Survey / Feed / Intel tabs, host controls, chip moderation, host-authored surveys, the matching engine, Announce-to-room). Phase 3 Resend recap email + Phase 4 warmth-decay sweep (pg_cron) + AI draft gate also shipped earlier in the day. Every backend write goes through an owner-checked security-definer RPC behind RLS; realtime is bare pings (no spoofable content); each slice verified with real-JWT tests (owner-can / non-owner-can't / private-stays-private). Brand-agnostic: the cockpit runs the owner's LIVE event (#8). Typecheck 3/3 green throughout. AI drafts + recap email parked on external keys/domain. | GMW-001 | gmw-001-phase-0-foundation / 5833b03 | 2026-06-12 | Build |
| SAFE-004 | Three live fixes shipped to production (grabsoda.app) and verified: the join flow (one welcome moment, no double-welcome on Google), the SODA-042 ops login pre-authorization gate plus a server-side /ops lock and an attempt audit log, and the returning/closed-event flow (status-aware 5h welcome-back, a dedicated centered /wrap screen, a 30-minute wrap window, and a survey link in the recap email). Two additive Supabase migrations applied local and cloud (email_is_operator + ops_login_attempts; get_event_state), db lint clean. Typecheck 3/3, production build, and 33 unit tests green. | Attendee/Ops fixes | main / 606f591 | 2026-06-24 | Build |
| SAFE-005 | Brand + polish layer shipped to production (grabsoda.app) and verified: app-open logo splash (solid black, ease in/out), the SODA logo across brand marks + home header + event/room entry, the iOS splash-centering + em-dash copy fixes, the signed-in landing tidy (lead with Your card, Sign out, hide Host sign-in), a discrete Delete-account, and scheduled start/end times + timezone with a soft, dismissible cockpit end-nudge. Typecheck 3/3, production build, 33 tests green; one additive migration (event times) applied local + cloud, lint clean. NOT deployed — committed on feature branches, held for a founder localhost test: the front-door dead-end fixes + single-screen card editor + focus picker (a6c9fbb), the card-templates backend (7636703), and the navigation overhaul (7024535). | Brand/polish ship + attendee batch held | main / bb0b278 | 2026-06-25 | Build |
| SAFE-006 | The attendee UX batch shipped to production (grabsoda.app) and verified: the front-door dead-end fixes, the single-screen card editor + focus chip-picker, the labelled-Home navigation + /home code box, Leave Room (confirm → recap → re-entry), and a modal-centering fix — plus a Playwright end-to-end harness (sign-up → room → leave, passing in ~9s). Two host tools also live: attendee emails in the CSV export, and a "copy survey link" button in the Admin. ALL deployed code-only (no DB migration), each on its own clean branch off production; clean build (71 pages), typecheck, 33 unit tests green. Held by choice (NOT on prod): the card-templates backend (carries a DB migration + has no UI yet) — ships later with its swipe UI. | Attendee UX + host tools | main / d678a76 | 2026-06-26 | Build |
| SAFE-007 | The observability, identity, and safety-net layer shipped to production (grabsoda.app) and verified. Five user/security ships: the front-door email-probe close (a signed-out person can no longer tell whether an email has a SODA account; the sibling of the 06-24 ops fix), Sentry monitoring (errors + performance + masked session replay, env-gated), a discreet sign-out on Home and the host cockpit, ambient nudges (plain-English "why you two match" reasons + operator signals, no strength numbers), and a standalone profile front door (a new /signup + redesigned /signin: name+email+password, 6-digit code, or Google, enumeration-safe, LinkedIn behind a flag, plus a new /terms). Plus the build's own safety net: a GitHub Actions CI gate (format + typecheck + build + 43 tests on every push and PR) and structured server logging (apps/web/lib/log.ts, one JSON line per event, no PII, the "what happened" syslog alongside Sentry's "what broke"). All code-only, no DB migration. Typecheck 3/3, production build, 43 unit tests, and format:check all green; CI gates validated locally before the first push. Held by choice (NOT shipped): the shared Input atom (branch soda-input-atom, deferred to the kit phase). | Observability + profile auth + CI/logging | main / b4e7851 | 2026-06-29 | Build |

<!-- Add new safepoints as rows here — newest at bottom -->

---

This was a host-and-access session on top of an already-built attendee and home surface. By the end, the full design surface for SODA is specified, inventoried, simulated, and tracked, and the honest next move is leaving design to build the first working slice.

---

## What got built or updated

Every file lives in the outputs folder. Specs ship in both Word and Markdown, visual and interactive work ships as HTML, and the tracker is a spreadsheet plus a readable Word twin.

### New specifications

- **Auth, Sessions, and Failures** (docx + md). Session rules, identity and dedup with fragmentation named as the worst silent failure, the two coming-back cases, a full failure pass including iOS storage eviction, and three prompts.
- **Event Mode fold** (docx + md). The Full-versus-Simple preset that sits over the act toggles, a dial not a switch, with chips kept lit in Simple so the rolodex and nudges still feed. One prompt.
- **Host Access** (docx + md). The three-level model, Operator the master key, Host Owner, and Collaborator, plus login, sessions, lockout and recovery, the master-key safeguards, and three prompts. The operator console is reserved.
- **Collaborator Onboarding and the Host Welcome-Back** (docx + md). The event-specific collaborator welcome, a short skippable tutorial scoped to the role, and the returning-host greeting that routes into a live Command Center. Three prompts.

### New visual and interactive work

- **Profile Simulation** (html). A working clickthrough of the home and profile area, with a live warmth bar and a time-advance control that demonstrates nudge timing.
- **Profile Flow Map** (html). The home area and the follow-up loop, eighteen nodes.
- **Simple Mode Sketch** (html). An interactive Full-versus-Simple toggle showing which screens stay lit.
- **Host and Access Simulation** (html). The host and access flows, clickable, with a role switch across Operator, Owner, and Collaborator and a live toggle, so you can watch what each role sees and where it gets routed. Sign-in, the code-not-arriving help with a working resend, first-time onboarding, the returning path, the install sheet, and an operator console preview. Passed twenty-six interaction checks.
- **Master Flow Map** (html). The whole system in one picture, five phases from entry through the host side, with the branches and cross-links tagged.

### Decks and the tracker

- **Deck Drafts** (docx). Three narratives, an investor deck, a pilot and partner deck, and a product walkthrough, with bracketed placeholders.
- **Home Screen spec** (docx + md). The tabbed home, screens seventeen through twenty.
- **Build Manifest** (xlsx + docx). Created this session and updated as work landed, a live spreadsheet with status and layer rollups plus a readable Word version.

### The component inventory, grown

- **Component Inventory** (md, static html, mobile html). Folded up from 78 entries to **92**, adding two categories, Access and Sessions, and Host Access and Onboarding, plus the Profile Detail and the Event Mode control. The mobile version is the tappable showcase, with a phone model and an inline prompt for each new screen.

---

## What got decided and locked

- **The three-level access model.** Operator is the master key above every event, Owner controls their own events including export, Collaborator can run a night but cannot export or delete.
- **Admin and Command are two tools for one host, not two accounts.** A host logs in once and moves between building an event and running it.
- **Event Mode keeps the chips in Simple.** Even when the room view and the acts go quiet, sign-in, photo, chips, survey, and send-off stay lit, so the data still flows.
- **Identity fragmentation is the worst silent failure**, with a merge path, and iOS storage eviction is a real risk the install prompt helps guard against.
- **Never drop a host mid-event.** The attendee rule now extends to hosts, with the Operator as the recovery fallback.
- **The master key carries safeguards.** Tightly held, logged when used, and disclosed in the privacy policy.
- **Collaborator onboarding is event-specific and the tutorial is role-scoped**, skippable and revisitable, never teaching a power the role does not have.

---

## The tracker, by the numbers

The manifest ended the session at **105 items**:

- 7 locked
- 74 specified
- 5 built
- 4 prototyped
- 5 drafted
- 5 reserved
- 5 pending

The Host Access layer alone holds ten items. The auth, host, and onboarding work is folded into the inventory and marked built, and the host simulation is logged as a prototype.

---

## Where it stands, and the next move

The design surface is essentially complete: the attendee flow, the home area, the event layer, Event Mode, the states, auth and failures, and the full host and access layer, all specified, with an inventory, four flow maps, two working simulations, and a reconciled manifest.

The honest next move is to leave design and build the thin vertical slice, scan to Room View, then the PWA pilot. That is the step that flips the first manifest item from specified to built. Alongside it sit two non-design tasks before any real room: filling the privacy-policy placeholders with counsel review, and creating the actual pilot event. Deliberately saved for last is the motion layer, and the Profile Detail still wants a formal spec to match its prototype.

*A name tag knows you showed up. SODA knows who you became to the room.*

---

# Daily Log

## 2026-06-12 — Build session: the host comes alive (Phases 3–5)

This was the day SODA stopped being a prototype the engineer drives and became a tool the **host** drives. Twenty-six commits carried the experience through the close of the night (Phase 3), the relationship layer (Phase 4), and the entire host surface (Phase 5). The room app already worked; today the person running the room got their cockpit and their back office.

The throughline: **experience-first, then lock it down.** Each slice shipped against the working app, then every backend change was proven with real-JWT tests — sign in as the owner (can), sign in as a guest (can't), confirm the private things stay private — before moving on.

### What got built

**Closing the night (Phase 3).** The Resend recap email now fires on close, idempotent and best-effort (it never blocks the close, and no-ops until the domain verifies). The Send-Off shows each guest their **real** connection count for the night, not a stub — and hides the line gracefully at zero.

**The relationship layer (Phase 4).** The AI follow-up draft gate — AI / Auto Default / Manual — with mock responses and an open plug for the Anthropic key (drops in with no code change). A nightly **warmth-decay sweep** on pg_cron recomputes connection warmth from the single-source formula; cooled connections surface a purple "reach out" nudge on the home rolodex; a discarded AI draft is logged. The notes-per-person cap became a **host-controllable signal** rather than a fixed rule.

**Host controls (Phase 5).** The Command Center grew a Settings panel the host owns per event: the note limit, the **editable Send-Off** copy/CTA, and the **onboarding chip menus**. Offers and needs were split into their own menus (so "Looking for work" stops reading as something you offer). Guests can now **add their own chips**, which land in a **host moderation** queue. And the **survey is host-authored** — create/edit the questions per event, in the Survey tab.

**The cockpit (Phase 5).** The Command Center became a real multi-view surface — **Acts / Room / Survey / Feed / Intel** — built on the owner's live event (the hardcoded pilot token is gone; the host's brand rides on the event). A live **Activity Feed**, an ownership gate so a stale session can't land in the cockpit, and the **matching engine**: who-can-help-whom from offer↔need overlap, mutual matches, top connector, and supply/demand gaps — surfaced in the **Intel** tab and now powering the Nudge queue. Plus **Announce to the room** (owner-posted, RLS-read, ping-only — unspoofable).

**The Admin — the missing half (Phase 5).** A back office where the host **creates** an event, takes it **live**, shares the join **link or QR**, runs it, and **closes** it. Guardrails on the significant actions (confirm go-live and end-the-night; delete a stray draft; a real date picker). **Manual check-in** mints a placeholder account for a walk-in so they're a first-class attendee with no phone. And **CSV exports** — attendees, matches, survey — for records and grant reporting.

**Two real bugs caught and fixed.** A control fired as the night ended could stack a live act overlay and the closing screen on a guest's phone — fixed in three layers (a closed event refuses to fire acts; the host's buttons go off; the room clears overlays on close). And closing from the Admin didn't tell the room — now it broadcasts, and the room self-heals on its next refetch.

### What got decided and verified

- **One security pattern, everywhere.** Writes go through owner-checked security-definer RPCs; reads are RLS-scoped; realtime carries only bare pings, never private or spoofable content. The sacred Nudge stays recipient-only; the new Announce is host-only by the same shape.
- **Brand-agnostic for real.** The cockpit resolves the owner's live event and wears that event's host name — Futureland is the pilot wearing SODA, not baked in (#8).
- **The founder's two host mocks** (Admin + Command Center) were captured as a build spec at `Soda/docs/mocks/README.md` — the naming map (Sync = Drop, Roulette = Chance), the matching-engine and anchor/rotating-survey concepts, and what's built vs. not. The cross-event **Operator console stays reserved**, as the access spec intends.
- **Matching is exact-label overlap for now** — synonyms (Capital ≈ Funding) are a noted future enhancement.

### Where it stands, and the next move

The host is now a genuine end-to-end tool: **create → go live (QR/link) → run the night (acts, intel, announce, check-in) → close → export.** The attendee loop and the host loop both close.

Parked on external dependencies: **AI follow-up drafts** (Anthropic key held by choice) and the **recap email** (waiting on `updates.futurelandcle.com` to verify). Parked as build work: the **richer survey** (vibe / NPS + the anchor/rotating question bank), the **design pass** (every screen is still a functional wireframe, not the SODA brand), and **deploying online** for a real room. One standing risk noted: the design corpus (this vault + the GMW system) is unversioned — worth a backup before it grows.

*The night now has a driver. Next, it gets a face.*

---

## 2026-06-24 — Live-fixes day: safer doors, smoother edges

A polish-and-harden day on top of the live app, after the first pilot. Three fixes, all shipped to production (grabsoda.app) and verified (typecheck, production build, 33 unit tests, two additive Supabase migrations applied local and cloud, db lint clean), ahead of a roughly 20-person room that night.

### What got fixed

**1. The join flow, one welcome moment (commit b5ffbe3).**
Scanning the QR used to show a "You made it in" welcome, then sign-in, then the same welcome again (the Google sign-in round-trip reloaded the page and reset it to the start). The separate welcome screen is now gone: sign-in leads, wearing the host's brand and a warmer line with no "ninety seconds" countdown, and the "You're in" celebration moved to a brief splash that appears after a first-timer signs in and then carries them straight into building their card. The double-welcome cannot happen anymore, because the Google return now runs through the same path as the email-code sign-in.

**2. The ops door, locked down: SODA-042 (commit 53db84f).**
The first item from the new Ops Manual gap analysis. Before, the operator login asked Supabase for a sign-in code straight from the browser with no check, so the ops door would email a code to any address that already had an account and it leaked whether an email existed. Now the request goes through the server: it checks the email against the existing operators list first, sends a code only to a real operator, answers with the same neutral message either way, and records every attempt in a locked-down audit table. The /ops page is also locked on the server now, so a non-operator never even loads the console. Important context: the ops data itself was already safe (every ops action checks operator status in the database), so this was hardening plus an audit trail, not a data leak. We reused the existing operators list as the single source of truth instead of adding a second list. CAPTCHA was deliberately deferred (it would require adding the widget to every sign-in screen first, or all sign-ins break).

**3. The returning and closing experience (commit 606f591).**
The bug: reopening grabsoda.app showed "Welcome back, you're in [host]'s room" even when that room had already closed, and tapping it dropped you onto a faded room with a see-through "That's a wrap" message. Now the welcome-back shortcut checks the room's real status first. While the room is live (and the saved session is under 5 hours old) it offers "step back in." Within 30 minutes of close it shows a warm "the night closed" card that leads to a dedicated, centered "That's a wrap" screen (its own screen now, not an overlay) with the survey button. After 30 minutes the stale shortcut clears itself. The entry screen was also decluttered: the duplicate big "SODA" heading and the tagline are gone (just the small logo), and the returning screen is now only the welcome-back gate plus a small "at a different event? enter a code" fallback. Finally, the recap email that sends when the host ends the night now carries a "Take the survey" button, so people who skip it in the moment still have a way back to it.

### What got decided

- Ops allowlist: reuse the existing operators list, not a separate one (avoids two lists drifting apart).
- CAPTCHA: deferred to a later build.
- Rate limits before a live event: do NOT tighten them right before a room. At an in-person event everyone shares the venue WiFi (one IP address), so tight per-IP limits can lock out the whole room, and the email-per-hour cap must sit above the headcount or codes stop sending. For about 20 people, Resend's 100-per-day cap is comfortable.
- Survey email: add the link to the recap email now (simple, ships tonight). The targeted "email only the people who skipped it" reminder is a follow-up build (needs a scheduled job), parked for now.

### Where it stands, and the next move

All three fixes are live for the night's test. The smoke test (returning while live, returning after close, the centered wrap screen, the join flow including Google, and the ops door) is the immediate next step.

Parked: the per-chip "add detail" declutter on the profile step (the agreed approach is a single collapsed "Add specifics" disclosure), the targeted non-responder survey reminder, and the CAPTCHA build. Still open from the ops manual: the matching gap on the attendee front door (anyone can probe whether an email exists, the sibling of the ops fix) and the Doppler versus Vercel secrets decision.

*The doors got safer, and the way back in got honest about whether the room is still there.*

---

## 2026-06-25 — Two halves: ship the face, build the doors (and hold them)

A day in two movements. First the **brand layer went live** — the app finally looks like SODA, not a wireframe. Then a long **build-and-hold** pass on the attendee experience: the front door, card editing, navigation, and the start of card templates, all staged behind a localhost test rather than pushed straight to a live room.

### Shipped to production (grabsoda.app)

**The face.** The app now opens on a logo splash — solid black, the SODA mark eased in and eased back out to the screen — and the real logo replaces the old brand marks everywhere: the home header, the brand marks across the app, and the event + room entry beats. A smoothing pass killed the iOS glitch where the screen flashed before the splash, re-centered the logo, and fixed an em-dash in button copy.

**The landing, tidied.** The signed-in front door now leads with Your card, adds a Sign out, and hides Host sign-in (which belongs to hosts, not guests).

**Delete account, made quiet.** No longer a loud button in the account screen — a small grey text link that only turns into a red confirm when you reach for it.

**Event times.** Events can carry a scheduled start and end with a timezone (composed correctly through Postgres `at time zone`, shown in the event's own zone). When the scheduled end passes, the cockpit shows the host a soft, dismissible nudge to close the night — a reminder, never an automatic close. One additive migration, applied local and cloud, lint clean.

### Built, verified, and HELD for a localhost test (not yet live)

Three commits sit on feature branches, each green (typecheck, production build, 33 tests), deliberately not deployed until the founder walks the flow on localhost.

**1. The front door, no more dead-ends.** The pilot's worst failure: a guest who signed in, closed the screen by accident, and came back got *stuck* — trapped on their card with no way into the room they were already in. Three pre-existing traps, all fixed: `/home` now shows a green "Back to {host}'s room" whenever a fresh live session exists; the card builder got a Cancel escape (it was one-way); and the room, when the local session is gone (iOS eviction, a different browser), now lands on the hub, not the "you need your QR" error.

**2. Editing your card, one fast screen.** Editing is no longer the three-step onboarding walk. A new single-screen editor shows name, role, offers, and needs all at once with a sticky Save — used both on `/home` and by tapping your own card in the room (first-time sign-up keeps the guided steps). And each offer/need's *focus* ("Mentorship in [design]") became a chip picker in a modal — pick from a controlled menu or add your own — so what people write stays consistent.

**3. The way home, made obvious.** Once you were in a room or deep in your card, there was no clear way back. Now every move is a *labelled* control, not a logo you have to guess is tappable: the room header carries a worded "Home" exit, and `/home` gained the "In an event?" code box so you can join an event straight from your card screen. The front door and `/home` now share one code-box component.

### Planned, with the backend already built

**Card templates — your "ways to show up."** A returning guest will keep several saved cards (a Founder card, an Artist card) and swipe on the home screen to pick which one they show up as. Designed in full, and the entire backend is built and committed: a `profile_cards` table with a database-guaranteed single active card, the create / edit / activate / delete operations (capped at five, owner-only), a consistency guard so the active card never drifts when you edit it in a room, an idempotent seed that gives every existing guest their current card as template one, the contracts, and the API. The visible half — the swipe carousel on home — is deferred until the held batch ships and tests clean.

### What got decided

- **Ship the face, hold the doors.** The brand/polish layer goes to production immediately; the attendee-experience batch waits behind a real localhost walk-through before it touches a live room.
- **Templates carry only the way you show up.** Name and email are one shared identity that auto-fills; a template varies only its label + role/offers/needs. Picking one sets your active card for the next room you enter. Email capture is deferred until there's a place it's used.
- **Two screens, linked — not merged.** The front door and the card screen both stay, connected by explicit labelled controls, because a bare logo isn't a discoverable way home.

### Where it stands, and the next move

Live: the brand layer and event times. Staged on branches and waiting on the founder's test: the front-door fixes, the single-screen editor + focus picker, and the navigation overhaul — one clean deploy once OK'd. The local test environment is up for the full walk-through (local Supabase running, a live FUTURELAND "Creative Meetup" event seeded — code **M652TS** — with sign-in codes landing in Mailpit).

Next: the test verdict, then deploy the held batch, then build the templates swipe UI, and ship templates + navigation together as the "home screen" release.

*The app got its face today. Next it gets a memory of every way you've shown up.*

---

## 2026-06-26 — Ship day: the doors open, and a robot to guard them

The day the held work went live. Yesterday's batch sat behind a localhost test; today the founder walked it, said go, and it shipped — and around it landed two host tools, the first end-to-end browser test, and the records to navigate it all. **Three clean production deploys, none dragging unfinished work along.**

### What shipped to production (grabsoda.app)

**The attendee UX batch — the front door is fixed.** Yesterday's held work, tested and deployed code-only (no database change): the front-door dead-end fixes (a returning guest can always get back into their live room), the single-screen card editor + the focus chip-picker, the labelled-"Home" navigation + the "In an event?" code box on /home, and **Leave Room** — built fresh today: a `← Leave` control → an "are you sure?" confirm → a recap screen (connections made + time in the room) → one tap back in, your spot saved. Plus a modal-centering fix.

**Attendee emails in the CSV export.** The attendee export carried everything but emails (they live in the sign-in layer, not on the attendance row). Added an Email column, read with the service role the same way the recap email does; walk-ins (no real address) come out blank. Raised from the Latinos N Tech export. Flagged: this hands hosts attendee contact info, so the sign-in consent must cover it (operator's call, made knowingly).

**Copy the survey link.** A host button in the Admin → Survey tab copies an event's survey link (`/survey?event=<id>`) so the host can share it directly — beyond the recap email + the in-app close flow. Only attendees can submit, so it stays scoped to the room.

### What got built around it

**The bug Leave Room surfaced, and its fix.** The leave confirm first opened *below the fold* — you had to scroll to see it. Root cause: the entry animations ended on a lingering transform, which silently makes an element the anchor for any pop-up inside it, so the modal pinned to the tall room instead of the screen. Fixed by ending the animations on `transform: none` (identical look, no trap) — which fixed *every* in-room pop-up at once.

**The first end-to-end browser test.** Playwright, on a mobile viewport: a real browser walks sign-up → enter the event code → email-code sign-up (the 6-digit code read straight from the local mailbox) → build a card → into the room → Leave → recap. It passes in ~9 seconds and fails loudly with a screenshot if any step regresses — the journey-level safety net the 33 unit tests can't give. No CI yet (backlogged).

### What got decided

- **Ship finished, code-only work independently; hold anything with a migration or no UI.** The two host tools and the UX batch each deployed on their own clean branch off production. The card-templates backend (which carries a DB migration and has no UI yet) was deliberately *left out* of the deploy — it ships later, together with its swipe carousel UI. Production only ever gets finished, user-facing work.
- **Guard the doors with end-to-end tests, not every corner.** Start with the one critical attendee flow; add a CI gate next.
- **Attendee emails are now visible to hosts** — a real data-sharing change, made knowingly; the consent/privacy wording must match it.

### Records, so nothing lives only in chat

Three reference docs landed in the vault: **SODA-Flows-As-Built** (every flow, as built, with status tags), **SODA-Backlog** (the single running open-work list with owner tags), and **SODA-Status-Manifest** (a printable snapshot — shipped / held / failures + fixes).

### Where it stands, and the next move

The attendee experience people actually touch is now whole on production: a fixed front door, fast card editing, a clear way home, and a graceful way out with a way back in. Held by choice: the **card-templates** feature — backend done, parked until its swipe UI arrives (the founder is sending UI rebuilds). On deck: those UI rebuilds (the micro-card edit, the templates carousel), then ship templates as one release *with* its migration; and a CI gate so the robot runs on every push.

*The doors opened today — and for the first time, a robot walks through them before anyone else has to.*

---

## 2026-06-29 — The watching layer: see what happens, know who you are, catch what breaks

A session about the things you do not see until you need them. The room app works and the doors are fixed; this stretch built the layer underneath it: a way to watch the app run, a real front door to your own profile, and a robot that checks the build before it can reach a live room. Five user-facing and security ships went to production, and two pieces of build infrastructure landed on top. All code-only, no database change. Every gate green before each push.

### What shipped to production (grabsoda.app)

**1. The front door stopped leaking (commit ec8e088).** The last open item from the ops manual: the same email-probe weakness we closed on the operator door back on the 24th still existed on the attendee returning door. Anyone could type an email into the sign-in screen and tell, from how it responded, whether that email already had a SODA account. Now the returning door answers through the server with one identical, neutral response either way, and only sends a code when the account actually exists. No one can use SODA's front door to find out who is or is not a member.

**2. Sentry, the crash detector (commits abce6fc, fb26c30).** SODA had no way to know when something broke for a real person on a real phone. Sentry is now wired in: it catches errors as they happen, watches page performance (real-user monitoring), and can replay a broken session as a silent screen recording with every name, email, and typed character masked out. It only switches on when its key is present, so it stays dark in local development and lights up in production. This is the "what broke" alarm.

**3. Sign out, where it belongs (commit 3014a0b).** A small but real gap: there was no way to sign out of your own account from the home screen or the host cockpit, so testing a second email meant clearing browser data. A discreet sign-out now sits on both, the ordinary best-practice control you expect to find.

**4. Ambient nudges, in plain English (commits 796d773, 57513e9).** The matching engine knew who could help whom, but it spoke in numbers. Now when SODA suggests two people connect, it says *why* in a human sentence ("you both work in design; she's looking for what you offer") instead of a match-strength score, and it feeds the host quiet operator signals about where the room's energy and gaps are. No bare strength numbers anywhere a guest can see.

**5. A real front door to your profile (commit 708032e).** Until now the only way to get a SODA account was to scan an event's QR code; there was no way to simply sign up. SODA now has a standalone profile door, redesigned from your mockups: a newcomer creates an account directly with name, email, and a password (or Google), proven by a 6-digit code sent to their email, and lands on their home screen. A returning person signs back in by code or password, with a "forgot password" path. The event QR flow is untouched. It is enumeration-safe throughout (the "Sign up" versus "Welcome back" split is which page you chose, never something the app detects from your email), and a new /terms page joins /privacy on every screen. LinkedIn is built but sits behind a flag until its provider is configured in Supabase, so it never appears as a broken button.

### What got built underneath it

**The robot that guards the build (CI, part of commit b4e7851).** Every time code reaches the main line, GitHub now runs the exact checks we used to run by hand before shipping: formatting, type safety, a full production build, and all 43 automated tests. A mistake turns the check red *before* it can reach grabsoda.app, instead of after a guest hits it. The gates were validated locally first so the very first run is honest and green, not red on day one. (Running the browser-level end-to-end test in this robot too is the noted next step; it needs a database and mailbox stood up in the cloud.)

**The syslog, the "what happened" layer (lib/log.ts, part of commit b4e7851).** Sentry catches what *breaks*. But Nelson's point was that the most dangerous failures are the ones that do not crash: a path that quietly does the wrong thing and never throws an error (the front-door trap was exactly that). So SODA now writes a tidy one-line record for normal events as they happen, captured in the hosting logs, recording the flow itself and not just the crashes. A privacy rule is built into its shape so it can only ever carry IDs, statuses, and counts, never anyone's name, email, or words. Two routes are instrumented to start (attendance saves and sign-in code requests); more get added as they matter.

### Planned and specified (written down, not yet built)

A large amount of forward design landed in the vault this session, so the thinking lives somewhere other than chat:

- **A full flow test plan** (`05 - Design/SODA-Flow-Test-Plan.md`) — every path through SODA, checked for loops and dead ends.
- **The matching engine's future**, in three specs: making matches aware of a person's *focus* (`SODA-Focus-Aware-Matching-Plan.md`), teaching it that Capital and Funding mean the same thing (`SODA-Category-Synonym-Matching-Plan.md`), and the deeper meaning-based "ambient" architecture (`SODA-Embeddings-Ambient-Matching-Architecture.md`) plus the adopt-now slice of it (`SODA-Ambient-Nudges-Adopt-Now-Spec.md`).
- **The native-app direction** — how to build now so a real phone-store app is a short hop later (`SODA-Native-Ready-Architecture.md`, `SODA-Universal-UI-Expo-Migration-Plan.md`), and giving every event room its own web address (`SODA-Event-Room-URLs-Plan.md`).
- **The design system, written down** (`Design System/DESIGN.md`) and **the logging and observability plan** (`12 - Logs/SODA-Logging-Observability-Plan.md`).
- **The Latinos N Tech pilot report** (`12 - Logs/Pilot Log/`), with its date corrected to June 24, 2026, plus a deeper pilot log. (Worth restating from that thread: reports are saved to this vault only; nothing is emailed or sent anywhere automatically.)

### What got decided

- **Just Sentry, not a second tool.** We weighed adding a separate analytics product alongside Sentry and decided Sentry's own real-user monitoring and session replay already cover what we need; one tool, less to run.
- **A syslog *and* Sentry, because they answer different questions.** Sentry is the alarm for what breaks; the syslog is the diary of what happened. The silent-wrong-path failure is exactly why you need the second one.
- **Sign up before you set a password.** At signup the email is proven by the code *first*, then the password is set, so there is never a "confirm your email" email and no way to probe who is a member.
- **LinkedIn ships dark until it is wired.** The button exists but stays hidden behind a flag until its provider is configured, so guests never meet a broken control.
- **Hold the Input atom for the kit phase.** A shared text-input building block was started (to cut repeated code) but deliberately parked, not shipped, since it is internal cleanup with no user-facing effect.

### Your action items

- **Configure LinkedIn in the Supabase dashboard** (the OAuth app + credentials) whenever you want that sign-in button to go live; it is built and waiting behind its flag.
- **Watch the first CI run** at github.com/brent-Equalpoint/soda/actions; it should come back green.
- Nothing else is required; everything shipped is live now.

### Where it stands, and the next move

SODA can now be watched while it runs (the syslog), alarmed when it breaks (Sentry), and guarded before bad code reaches a room (CI). People can make a SODA account through a real front door, not only by scanning a QR. Held by choice: the Input atom (kit-phase cleanup) and, still from before, the card-templates feature waiting on its swipe UI. On deck from the plans written this session: the matching upgrades (focus-aware, then synonyms), the attendee-UI rebuild as your designs arrive, and folding the browser-level test into the CI robot.

*SODA spent today learning to watch itself: to notice what happened, to remember who you are, and to stop a mistake at the door.*

---

## 2026-06-29 (cont.) — Smarter matching, and what the chip bank revealed

The same day's second movement: the matching engine got smarter, that change was proven on real pilot data before it went live, and chasing one honest question ("how does our chip bank look?") surfaced a designed-but-unbuilt system that becomes the next initiative.

### Shipped to production (grabsoda.app) — commit 2b6706b

**Smarter matching: synonyms + focus-aware ranking.** Two upgrades to the engine, both from the written plans, stacked cleanly and deployed code-only (no database change).

- **Synonyms.** The engine used to match only on the exact same word, so someone offering **Investment** never met someone needing **Funding**, and **Hiring** never met **Looking for work**, even though those are the same intent. Now a small, deliberately conservative map bridges them (capital = investment/funding/capital; employment = hiring/looking-for-work). Bridged matches carry a **"Related"** tag so it is clear why they fired. The "Most Wanted" gaps now group by intent too, so a phantom "Funding, nobody offering" gap nets against the Investment that was on offer.
- **Focus-aware ranking.** When two people match, the engine now compares the focus on their chips ("Collaboration in AI" vs "in real estate") and tags the match **Aligned**, **Broad**, or neutral. It only ranks and labels, it never deletes a match, so no connection is lost. The strongest (mutual, then aligned) rise to the top, so the host nudges the best pairs first.
- **Where it shows:** Aligned / Broad / Related tags in the Intel view and the Recap; Focus + Related columns added to the matches CSV; the Nudge queue prioritizes aligned matches for free off the new sort. Verified green: 62 unit tests (19 new), typecheck, build, formatting.

### Validated on real pilot data BEFORE deploy

Per the plan's own caution (synonyms ADD matches, so prove them first), the new engine was re-run on the real Latinos N Tech room export (25 people, 2026-06-24). Three findings:

1. **Zero fake matches.** The synonyms created **0 brand-new pairs** between people who were not already connected. The risk was inventing spurious matches; there were none. (The room is already densely linked through generic chips, so synonyms enrich existing matches rather than fabricate.)
2. **The real win: mutual matches rose 55 to 67 (+12).** Synonyms turned 12 one-way matches into two-way ones, where both people help each other, the strong signal SODA leads with. These are the investor-meets-founder and hiring-meets-jobseeker upgrades that were hiding behind different words.
3. **The pilot's scary gaps were mostly phantom.** "Funding, 5 needed, 0 offered" became a real gap of 2 once the 3 Investment offers counted; "Looking for work, 4 needed, 0 offered" became a real gap of 1 once the 3 Hiring offers counted. A host staring at that panel had been chasing a problem the room had mostly already solved.
4. **Focus was barely used** in that older data (0 aligned, 5 broad, 203 neutral), so focus-aware ranking had little to bite on. The feature is correct; its payoff grows as people actually fill in a focus.

### The chip bank discovery (the next initiative)

Asked "how does our chip bank look?", the dig turned up a real gap: **two chip banks exist and have drifted.**

- **What ships** (`apps/web/lib/catalog.ts`) is thin: 7 offers, 7 needs, a flat 16-focus list, no context layer.
- **What was designed** (the vault's `SODA Chips Bank/bank.ts`) is ~3x richer (20 needs, 22 offers, ~45 focus) and built on a **seven-context taxonomy** (capital, talent, customers, knowledge, community, resources, creative) where every chip is tagged with its intent.
- **But the engine that drives it was never built:** `bank.ts` imports a `types.ts` and a `suggestions.ts` that exist only as described intent in its comments, nowhere in the vault or the zip.

The designed system would unlock **context-aware focus suggestions** (pick Funding + Mentorship, and only capital/knowledge focuses surface, not all 45), which is the real fix for the "everyone just picks Collaboration" noise the pilot flagged. And its context tags ARE the complete version of the synonym map just shipped: the hand-rolled 2 groups become all 7 contexts from one source of truth. The pilot data backs the need: people free-typed "Leads" (~5), "Networking," and "Social Media / Marketing" because the thin menu had no home for them.

### What got decided

- **Ship the matching increment now; plan the chip bank as its superset.** The synonym + focus fix is safe, validated, and helps the very next room, and it is a clean subset the bigger bank work later subsumes. So it deployed today.
- **Chip Bank v2 is the next initiative.** Adopt the designed seven-context bank, rebuild the two missing files (types + the suggestion engine), merge in the pilot-surfaced labels, wire context-aware focus suggestions, and point the matcher at the bank's tags (retiring the hand-rolled synonym map). Full plan: **[[SODA-Chip-Bank-v2-Plan]]**.
- **Conservative bridging stays.** Single-context chips bridge; broad multi-context chips (Collaboration, Feedback) keep matching on the exact word, so the engine never over-matches.

### Where it stands, and the next move

The matching engine is live and measurably smarter: more mutual matches, honest gaps, the strongest pairs first. The next initiative is **Chip Bank v2**, the designed end-state that fixes match quality at the source (the input) and makes the focus layer something people will actually use. It composes with the attendee UI overhaul (both are pre-room, onboarding-time work) and stays native-ready (engine + bank move to `@soda/core`).

*The room got smarter about who belongs together today. Next, it gets smarter about the words people use to say so.*
