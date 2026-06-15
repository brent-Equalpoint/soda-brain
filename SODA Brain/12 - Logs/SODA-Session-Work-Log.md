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
