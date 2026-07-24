# SODA — Universal Build Master Plan

*The unifying plan for three things that are really one: the attendee UI overhaul, turning the
JSON-controlled HTML into reusable universal components, and a backend that serves web and mobile from
one place. Created 2026-06-29 at Brent's direction. This does not replace the existing plans, it
sequences and connects them: [[SODA-Attendee-UI-Overhaul]], [[SODA-Universal-UI-Expo-Migration-Plan]],
[[SODA-Native-Ready-Architecture]], [[SODA-Event-Room-URLs-Plan]], and the Design System.*

---

## The one-paragraph version (plain English)

You asked for three plans. They are one move. Your designers already drew the attendee screens as
**JSON + a small renderer** (the "JSON controlled HTML"), with tokens that were deliberately written to
work on web AND phones. SODA's **backend is already about 80% phone-ready** (the API is plain web
requests any app can call; only sign-in storage and styling are web-only). So the smart play is to build
the overhaul **once**, as a set of **universal components** (one codebase that renders on the web today
and on iOS/Android later), instead of building it for web now and rebuilding it for phones in a year.
We prove it with a small **spike** first (one screen, both platforms, real data), then roll the overhaul
out screen by screen with the robot tests guarding each one. The live app never breaks during any of it.

---

## Why these three are one initiative

| You asked for | What it really is | Already exists |
|---|---|---|
| **UI overhaul** of the attendee flow | Rebuild the attendee screens to the new design | [[SODA-Attendee-UI-Overhaul]] (phases A to F) |
| **Reconstruct the JSON-controlled HTML into universal components** | Turn each JSON screen + renderer into one typed, reusable component that runs on web + native | The raw material is the `Attendee Flow Design/JSON CTRL` files + the Design System's 19 atoms |
| **Backend for web + mobile** | One backend both the web app and a phone app call | Already built (Supabase + REST API); needs a sign-in/storage adapter for phones |

The connective insight: **if we rebuild the overhaul directly in universal components, all three happen
at the same time.** The overhaul screens ARE the universal components; building them once means the web
app and the future phone app share them. Doing the overhaul in plain web code first would mean building
every screen twice.

---

## The big accelerator: your design is already platform-neutral

The explore pass found the JSON-controlled HTML at
`05 - Design/Attendee Flow Design/` (the `JSON CTRL` folder and siblings). What matters:

- **The screens are data + a renderer.** Each file (Home, Room, Intro Starter, Moment Modals, Nav, plus
  the integrated `SODA-Live-Fire.html`) is a JSON state object (`{ screen, hero, cards, people, ... }`)
  plus a function that renders it. The data decides what shows; the view just draws it. **That is exactly
  the shape a universal component wants** (data in, view out, no fetching inside).
- **The tokens are already cross-platform.** `JSON CTRL/soda.tokens.json` says in its own header:
  *"Values are platform neutral. Behavior is applied per platform... compiles_to: web CSS custom
  properties, native: TypeScript theme imported by Expo."* Colors, type scale, spacing (4px grid), radii,
  and the warmth enum are all there, platform-agnostic.
- **The data model is written down.** `Attendee Flow Design/SODA-Handoff.json` is the full contract
  reference (fields, rules, the stack), and rules like `face_rule: "me_face_has_no_chips"` and
  `view.density: "tabs"` live in the DATA, not the template. That is the same "server decides, client
  renders" discipline the backend already follows.
- **The atoms are drawn too.** Separately, `Design System/components/` holds 19 React atoms (Button,
  Input, Chip, CodeInput, SegmentedToggle, ResendControl, Avatar, Badge, StatTile, ContactRow, EventCard,
  EventRow, RolePill, Toast, ProgressBar, BottomSheet, TabBar, SectionHeader, Carousel), each with a
  `.jsx`, a `.d.ts` (types), and a `.prompt.md` (build guidance).

So "reconstruct the JSON HTML into universal components" is unusually clean: **each JSON state becomes a
typed contract; each renderer becomes a universal view; the tokens become the one token file.** We are
transcribing an existing, well-formed design, not inventing one.

---

## Where we are today (grounded in the code)

From the backend/native-readiness audit:

- **Already universal (reuse as-is):** the whole REST API under `apps/web/app/api/*` (plain JSON requests
  a phone app can call), `packages/contracts` (all Zod schemas + realtime event names), the realtime
  pattern (bare-ping broadcasts, refetch under RLS), and pure logic in `lib/` (`identity`, `dates`,
  `catalog`, `realtime-broadcast`) and `packages/ui/tokens.ts`.
- **Web-coupled (needs an adapter or a rebuild for phones):**
  1. **Sign-in storage** — web uses secure cookies; phones need token storage (an adapter).
  2. **Social sign-in redirects** — web uses the browser URL; phones need deep links.
  3. **Styling** — every screen uses Tailwind classes (web-only); phones need a style layer (NativeWind
     solves this, see below).
  4. **"My live event" memory** — `lib/room-session.ts` uses browser storage; needs the same storage
     adapter (this also closes the "lost my room" bug, see [[SODA-Event-Room-URLs-Plan]]).
  5. **Small bits** — CSS animations, `document.visibilitychange`, and QR camera scanning each need a
     native equivalent.

**Conclusion: the backend and data are ready; only the presentation layer is web-locked.** That is the
single thing the universal kit fixes.

---

## The strategy: build the overhaul ONCE, in universal components

Two ways to do the overhaul:

- **Option A (recommended): build it in universal components from the start.** Use Expo Router +
  NativeWind so one component renders on web (becomes the new PWA) and on iOS/Android. The overhaul
  screens are the universal kit. The web app you ship IS the thing the phone app reuses. One build.
- **Option B (fallback): overhaul in plain web code now, port to phones later.** Faster to start, but
  every screen gets built twice and the two drift apart. Only fall back to this if the spike (below) says
  universal is not ready.

This mirrors [[SODA-Universal-UI-Expo-Migration-Plan]]'s Fork A, and the JSON-CTRL discovery makes A even
safer because the design is already platform-neutral. **We do not commit to A blind — we prove it with a
spike first.**

---

## The plan, phased (each phase parallel to the live app, reversible)

### Phase 0 — Foundation (no user-visible change, low risk)
Lay the native-ready groundwork from [[SODA-Native-Ready-Architecture]], usable by web immediately:
- Make **`soda.tokens.json` the one source of truth**: generate `packages/ui/tokens.ts` (native theme)
  AND the web CSS variables from it, so web and native can never drift.
- Create **`@soda/core`**: move the pure logic (matching, warmth, dates, catalog, identity, match-format,
  event-status) out of `apps/web` so both web and a phone app import it. (Mirrors `@soda/contracts`.)
- Build the **storage + auth adapters**: one small interface for "where the session lives" (cookies on
  web, secure storage on native) and "how sign-in redirects" (URL on web, deep link on native). This also
  fixes the "lost my room" bug today.
- Adopt the **"logic in hooks, drawing in dumb views"** convention for new screens (so native reuses the
  hook and only redraws the view).

### Phase 1 — The Spike (1 to 2 weeks, zero production change, the go/no-go gate)
Build **one** attendee flow (recommend **the Room**, the heart of the app) as universal components with
Expo Router + NativeWind, rendering on web AND a phone simulator, against the **real Supabase backend**.
Nothing ships. At the end: a clear go/no-go on Option A and a real effort estimate. **This is the
decision gate Brent + Alysha sign off on.**

### Phase 2 — The Universal Component Kit (the "reconstruct JSON HTML" track)
With the spike green, transcribe the design into the kit, in two layers:
- **Atoms** from `Design System/components/` (Button, Chip, Avatar, Input, BottomSheet, TabBar, ...).
- **Composites** from the JSON-CTRL screens (ProfileCard + face rule, RosterGrid/List + MicroCard, the
  CardExpand modal, the Hero, ConnectionRow + warmth, the variant-driven MomentModal, the IntroSheet).
- **Method per component:** the JSON state becomes a typed contract (extend `@soda/contracts`); the
  renderer becomes a pure universal view; tokens come from the one token file. Each atom/composite gets a
  visual check against its source HTML.

### Phase 3 — The Overhaul, built in the kit (the "UI overhaul" track)
Rebuild the attendee screens screen-by-screen using the kit, design-driven from the JSON-CTRL prototypes,
in the order from [[SODA-Attendee-UI-Overhaul]] (Entry/onboarding, then the Room, then Home/relationships,
then close/follow-up, then account/polish). Each screen:
- ships independently to the live PWA,
- is guarded by the Playwright E2E flow (expand coverage per screen),
- never touches the logic, data, RPCs, or realtime (those carry over untouched),
- folds in the held design work (micro-card edit, templates swipe) and the addressable room URLs
  (`/room/[eventId]`, `/e/[code]`) from [[SODA-Event-Room-URLs-Plan]] as the Room screen is rebuilt.

### Phase 4 — Backend for web + mobile (the "backend" track, mostly already done)
Formalize the one-backend setup so a phone app is a first-class client:
- The REST API + Zod contracts are the shared interface (already true). Keep new endpoints contract-first.
- Land the **auth/session adapter** so a native app signs in (token storage + deep-link OAuth) against
  the same Supabase, same RLS, same RPCs. No second backend, ever.
- Keep "thin client, fat server": logic stays in API routes + Supabase RPCs so both clients stay dumb.

### Phase 5 — Native launch (future, additive)
When the universal web build reaches parity, point grabsoda.app's attendee experience at it, then add
the iOS/Android target via Expo EAS (camera QR, push notifications, app-store builds). The host and
operator tools stay on Next.js for now (desktop-leaning, lower native value).

---

## Track 2 detail — the JSON-CTRL to universal-component map

| Source (vault) | Becomes (universal kit) | Contract |
|---|---|---|
| `JSON CTRL/soda.tokens.json` | the one token file (web CSS + native theme) | tokens |
| `SODA-Handoff.json` | typed contracts in `@soda/contracts` | the data model |
| `SODA-Home-JSON.html` | Hero, ProfileCard (face rule), RoomRow, ConnectionRow (warmth), TabBar | `home` state |
| `SODA-Room-JSON.html` | RosterGrid, RosterList, MicroCard, CardExpand modal, Chip, Avatar, MatchBadge | `room` + `expand` |
| `SODA-Intro-Starter-JSON.html` | IntroSheet, ToneSelector | `intro` states |
| `SODA-Moment-Modals-JSON.html` | MomentModal (variant-driven), BigNum, AvatarStrip | `moment` variants |
| `SODA-Nav-JSON.html` | the four tab screens (Rooms, Card, People, You) | `nav` |
| `SODA-Live-Fire.html` | the integrated reference to check the assembled flow | full state |
| `Design System/components/*` | the 19 atoms, one-to-one | each `.d.ts` |

The discipline that makes this clean: these views are **presentational** (data in, view out). Fetching
and state live in hooks/screens, exactly the native-ready convention. So a component built here runs
unchanged on web and native.

---

## Track 3 detail — the native-ready ledger (backend web + mobile)

**Ready now (no change):** REST API (`apps/web/app/api/*`), `packages/contracts`, realtime pattern,
Supabase RLS + security-definer RPCs, pure logic in `lib/`, `tokens.ts`.

**Needs an adapter (Phase 0/4), not a rewrite:**
- Session storage: cookies (web) vs secure storage (native), behind one interface.
- OAuth redirect: browser URL (web) vs deep link (native).
- "My live event" memory: browser storage today, behind the same storage adapter (also fixes "lost my
  room").

**Needs a native equivalent at launch (Phase 5):** CSS animations to Reanimated, `visibilitychange` to
app lifecycle, QR scanning to the device camera.

**Never changes:** one Supabase backend, one set of RLS policies and RPCs, one contract layer. The phone
app is just another client of the same server.

---

## The memory layer: where Equalpoint's entity standardization sits with this build

This plan builds SODA's **live room** (the attendee experience). It is worth naming the layer ABOVE it,
because a separate architecture (the entity standardization system, reviewed 2026-06-30) plugs in there,
and the two are easy to conflate.

**Two resolution layers, on purpose:**
- **SODA, the room (what this plan builds):** RELATIONSHIP resolution. Inside one live event, who should
  meet whom. Signed-in users, one profile each, the matching engine we just upgraded.
- **Equalpoint, the memory (a layer up):** ENTITY resolution. Across many events over time, whether
  "Mike Johnson" and "Michael Johnson" are the same human, so they do not become five nodes with five
  warmth timers. This is what the three-layer standardization funnel (normalize, then fuzzy, then
  optional AI) handles, and it is foundational to Equalpoint's thesis ("automate the remembering").

**How it relates to this build:**
- It is a textbook **fat-server, thin-client** component: the standardization engine is pure server-side
  TypeScript, reusable by web or native with zero change, exactly the native-ready shape this plan wants.
  So it composes cleanly with the universal direction without being part of the attendee UI work.
- Its only client surface, a duplicate-merge banner, is the thin view. It currently wears Equalpoint's
  light theme; if it ever appears inside SODA it takes the dark restyle, otherwise it stays an Equalpoint
  screen.
- It does NOT overlap SODA's matching engine. The one near-overlap is its tag-synonym merging vs the chip
  bank, and those stay separate by design (freeform tags can take AI merging; the controlled chip menu
  stays a curated map, per [[SODA-Chip-Bank-v2-Plan]]).

**The architectural decisions (not the code bugs):**
1. **Home it in the Equalpoint layer**, consuming SODA's event data, rather than bolting it into the live
   room. It already assumes Equalpoint's schema (`connections`, `connection_history`, `loop_events`, the
   EMBED-002 universe), not live SODA's `events`/`attendances`/`profiles`. So it either lives in Equalpoint
   (its natural home) or that schema is reconciled first. Same mapping caveat as the rest of the EMBED-002
   material.
2. **Two correctness fixes gate the BTW pilot (July 14 to 16):** the pair-confirmation ignores Claude's
   own `is_same_person` verdict (it can surface a confirmed non-match as "very likely"), and name
   normalization strips accents (it mangles the pilot cohort's names, "José" becomes "jos"). Independent
   of where it lives.
3. **Keep the tag-vs-chip synonym split** deliberate.

**Net:** sound architecture, foundational to Equalpoint, correctly one layer above the room, and
native-ready by shape. The work is placement plus schema reconciliation plus the two bugs, not a redesign.
Source: the entity standardization files + `equalpoint-entity-standardization.md` (Equalpoint).

---

## The safety contract (locked, same as the migration plan)

1. The **live PWA keeps serving** the whole way through.
2. **One backend** (Supabase). It is never forked.
3. Every phase runs **in parallel and is reversible**; nothing replaces anything until it passes a parity
   check ([[SODA-Flow-Test-Plan]]).
4. **Spike before commitment** (Phase 1 gates the rest).
5. Onboarding/room changes are **built and held for a localhost walk** before they deploy (the
   established experience-first pattern).

---

## Decisions for you (and Alysha)

1. **The direction (the big one):** Option A (build the overhaul as universal components, Expo Router +
   NativeWind, web now + native later) vs Option B (overhaul in web code now, port later). Recommended: A,
   confirmed by the spike. Needs Brent + Alysha sign-off.
2. **Green-light the Phase 1 spike?** 1 to 2 weeks, one flow (the Room), both platforms, real backend,
   zero production change. This is the cheapest way to de-risk the whole initiative.
3. **Styling layer:** NativeWind (Tailwind-style classes that work on web + native, so the overhaul is
   written once). Recommended. Alternative: a plain token-based style layer.
4. **Scope:** attendee app goes universal first; host + operator tools stay on Next.js for now.
   Recommended yes.
5. **Sequencing vs the sprint/backlog:** do we pause the small UX backlog items and start Phase 0 +
   the spike, or clear the backlog first? Recommended: start Phase 0 + the spike now (they are low-risk
   and parallel), keep the backlog as fill-in.

## What I would do first (if you greenlight)
Phase 0 is safe and useful no matter what (tokens unified, `@soda/core`, the storage adapter that also
fixes "lost my room"). I can start there immediately, in parallel with you and Alysha deciding A vs B,
then run the spike. None of it touches the live app until a screen is ready and you have walked it.

## References
[[SODA-Attendee-UI-Overhaul]] · [[SODA-Universal-UI-Expo-Migration-Plan]] ·
[[SODA-Native-Ready-Architecture]] · [[SODA-Event-Room-URLs-Plan]] · [[SODA-Chip-Bank-v2-Plan]]
(onboarding chips, composes with Entry/onboarding) · [[SODA-Flow-Test-Plan]] (the parity gate) ·
Design System (`05 - Design/Design System/`, DESIGN.md + tokens + the 19 atoms) · the JSON-CTRL source
(`05 - Design/Attendee Flow Design/`) · [[SODA-Design-Precision-System-Plan]] (the enforceable token +
precision foundation) · the entity standardization system (`equalpoint-entity-standardization.md`, the
Equalpoint memory layer above this build).
