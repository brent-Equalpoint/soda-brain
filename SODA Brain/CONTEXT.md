# SODA — CONTEXT.md
> GMW project context. Load this after the 5 GMW startup files when working on SODA.
> For deep reference, read `03 - Build/SODA-Technical-Build-Structure.md`.

---

## What SODA Is

SODA is a room operating system for live events — a mobile PWA that turns a room full of strangers into a structured experience with three live acts (Drop, Chance, Nudge), real-time presence, and a warmth-based relationship layer that persists after the night ends.

It is a consumer product of Equalpoint, Inc. The first pilot client is Futureland Inc. The host owns their event's data. Equalpoint owns the platform.

---

## The Stack

- **Web app:** Next.js 16.2 (16.2.7 LTS), App Router, Turbopack native, React 19.2, shipped as a PWA (attendee + host in one codebase)
- **Database:** Supabase — Postgres 17, RLS on every table, Realtime for room presence, pg_cron 1.6.4 for warmth sweep
- **Proximity:** FastAPI service (BLE coordination and presence — runs alongside, not inside Next.js)
- **Auth:** Supabase Auth, email one-time codes, sessions never expire mid-event
- **AI:** Claude API, follow-up drafts only, behind a two-call approval gate
- **Language:** TypeScript 6.0 strict. No `any`. Zod v4 for all schemas in `packages/contracts` — use top-level format functions (z.uuid(), z.email()), not chained methods.
- **Secrets:** Environment only. Never committed.

---

## Build Approach: Experience-First

Every slice follows this order. Do not deviate:

1. **UX flow** — read the spec and flow map for the screen
2. **Prototype** — build the front end against mock data first
3. **Approval** — confirm the experience before any backend exists
4. **API contract** — freeze types and request/response shapes in `packages/contracts`
5. **Backend** — Supabase tables + RLS + endpoints, built to the contract
6. **Wire** — replace mock data with real calls. Front end shape does not change.
7. **Ship** — pass Ghost QA gate, then release

**Rule:** No backend table is written before the screen that needs it has been prototyped and approved.

---

## Non-Negotiable Rules

These hold across every slice. Ghost verifies all of them before issuing CLEAR TO SHIP.

1. **No auto-send.** SODA drafts a follow-up. The person sends it. Nothing leaves on its own.
2. **RLS on every table, at creation.** The migration that creates a table includes its policy.
3. **The warmth formula is fixed:** `max(0, round(base_warmth * e^(-0.01 * days_since_contact)))`. Changing the decay rate is a spec change, not a code change.
4. **The approval gate is two calls.** `POST /api/draft` generates, writes nothing. `POST /api/draft/approve` writes and resets warmth. They never merge.
5. **The private nudge is sacred.** Recipient-only, enforced in RLS, never exposed to a host or another guest.
6. **Never drop a session mid-event.** No attendee or host is bounced to login while an event is live.
7. **Derived state is a cache.** `warmth_score` is always recomputable from `base_warmth` and `last_contact_at`.
8. **Per-event scoping, brand-agnostic.** Host identity rides on every attendee screen. Nothing hardcoded.
9. **The master key is logged.** Every operator reach into an event writes to `operator_access_log`.
10. **The discard signal is logged.** A dismissed draft writes to `draft_feedback`.
11. **Secrets from environment only.** Never from a committed file.

---

## Build Phases

| Phase | What | Status |
|---|---|---|
| 0 | Foundation — scaffold, Supabase, auth, tokens, empty routes, seed | Specified |
| 1 | Vertical slice — QR → Welcome → Sign-In → Profile chips → Room View (realtime) | **Start here** |
| 2 | The acts — Drop, Chance, Nudge + minimal host Command Center | Specified |
| 3 | Closing the night — Comment, Survey, Send-Off, recap email | Specified |
| 4 | Home area — persistent profile, connections, warmth decay, AI draft gate | Specified |
| 5 | Host and access — 3-level access model, host sign-in, collaborator onboarding | Specified |
| 6 | States, sessions, failure modes | Specified |
| 7 | Hardening and pilot — RLS audit, motion, performance, PWA pilot | Specified |

Phase 1 is the proof: when a second phone scanning in appears live on the first phone's Room View, the spine works.

---

## Where Key Documents Live

All paths relative to `SODA Build/SODA Brain/`:

| What | Where |
|---|---|
| Full technical spec + data model | `03 - Build/SODA-Technical-Build-Structure.md` |
| Component inventory (every screen) | `03 - Build/SODA-Component-Inventory.md` or `05 - Design/SODA-Component-Inventory.md` |
| Design specs (attendee, host, home, auth) | `05 - Design/` |
| Flow maps | `05 - Design/SODA-Attendee-Flow-Map.md`, `SODA-Host-Flow-Map.md` |
| Brand + design tokens | `04 - Brand Guidelines/` |
| Privacy + consent rules | `06 - Privacy/` |
| Screen prompts (paste-ready) | `03 - Build/SODA-Technical-Build-Structure.md` (embedded) |
| Build manifest + status tracker | `03 - Build/SODA-Build-Manifest.xlsx` |
| User journeys and personas | `10 - User Journey and Personas/` |

---

## Build Logging

| Log type | File |
|---|---|
| Session work log (what shipped, decisions made, safepoints) | `12 - Logs/SODA-Session-Work-Log.md` |
| Build errors (failed builds, root cause, fix) | `SODA Build Error Log/BUILD-ERROR-LOG.md` |
| Safepoints (known-good state anchors) | Both files above — see formats inside |

**After every slice:** update the session log with what shipped and what is next. Set a safepoint row.

**After every build error:** log it before moving on. Reference the last safepoint so the team knows where to rewind.

**Set a safepoint when:**
- Ghost issues CLEAR TO SHIP on any slice
- A prototype is approved and backend work is about to begin
- Before any migration that alters existing table structure
- At the end of a completed phase

**To rewind:** find the last `SAFE-###` entry in the session log, check out the branch, and the entry tells you exactly what was verified clean and what the next planned action was.

---

## Design Tokens (dark mode only)

```
--canvas:     #111111   near-black ground
--card:       #1A1A1A   raised surfaces
--border:     #262826   dividers
--green:      #3BD75C   interactive and confirming only
--deep-green: #203229   warm surfaces
--off-white:  #F5F5F5   primary text
--muted:      #777777   secondary text
--amber:      #F59E0B   timers only
--purple:     #A47BFF   nudge, always
--red:        (errors only)
```

Green = interactive or confirming. Amber = timer. Purple = nudge. 8pt grid, 44px minimum touch targets.

---

## Code Conventions (Claude Code)

- TypeScript strict. No `any`.
- Server Components by default. `'use client'` only when needed.
- Zod schemas for every API request/response in `packages/contracts`.
- No direct Supabase calls from client components — everything through an API route.
- Skeleton loaders for async states, not spinners.
- `data-testid` on every interactive element.
- Full file path comment at the top of each file.
- Warmth formula imported from `lib/warmth` — never reimplemented inline.
- Before building a screen: read its spec in `docs/specs`, its flow in `docs/flows`.
- Every migration ships with its RLS policy in the same change.

---

*A name tag knows you showed up. SODA knows who you became to the room.*
