# CONTEXT.md
## Equal Point — Project Context
## God Made Weapon — Required reading every session

> Every agent reads this file at session startup before reading TASK.md or PLAN.md.
> This is the onboarding document for the project.
> Do not make decisions that contradict what is written here without surfacing it
> as a stopping condition and getting human approval first.

---

## What Equal Point Is

Equal Point is a **Relational OS** — a personal relationship intelligence platform.
It tracks relationship health via a warmth score that decays over time when contact
lapses. It uses Claude AI to draft follow-up messages that the user approves and
sends manually. It visualizes the user's network as a dynamic graph.

**The core loop:**
```
Meet someone → Add connection → Warmth score starts high
→ Time passes, no contact → Warmth decays
→ Equal Point surfaces who needs attention
→ Claude drafts a follow-up → User approves and sends manually
→ Contact logged → Warmth resets
```

---

## Who It's For

A single user managing a meaningful professional and personal network. This is not
a CRM for teams. It is a personal intelligence layer for relationship-aware people
who want to stay warm with the people that matter.

---

## The 7 Non-Negotiable Rules

These are hard constraints. No agent overrides them. No task changes them without
an explicit human-approved spec change logged in CHANGELOG.md.

**Rule 1 — No auto-send**
Equal Point never sends messages. It drafts. The user copies and sends manually.
No exceptions. No "send on behalf of." Never.

**Rule 2 — RLS on every table**
Every new Supabase table requires `ENABLE ROW LEVEL SECURITY` and a policy
immediately. No table is created without both. Kennis Beck enforces this on every
migration.

**Rule 3 — Warmth formula is fixed**
```
max(0, round(base_warmth × e^(−0.01 × days_since_contact)))
```
The decay rate (0.01) is not changed without a spec change. The formula and its
helpers live in `lib/warmth/formula.ts`. Import from there. Never reimplement inline.

**Rule 4 — Approval gate is two calls**
`POST /api/draft` generates text only — no DB write.
`POST /api/draft/approve` writes to DB — only here, never merged with generation.
These two calls are never combined into one.

**Rule 5 — Notifications cap**
Maximum 1 push notification per connection per 7 days. Enforced server-side in
the nightly sweep. Never client-side enforced only.

**Rule 6 — Secrets via Doppler**
Never read from committed `.env` files. All secrets come from `process.env`
injected by Doppler. `.env` files are never committed.

**Rule 7 — Status is derived**
`status` in the DB is a cache. It must always be recomputable from
`warmth_score + days_since_contact`. Never treat it as a source of truth.

---

## What Has Been Built

### Core Architecture
- Next.js 16.2 (App Router) setup with TypeScript strict mode. Turbopack default bundler. proxy.ts replaces middleware.
- Supabase backend with Postgres, RLS, and pg_cron
- Clerk authentication with webhook sync
- Claude API integration for draft generation
- Cloudflare Pages deployment
- Expo mobile app (in progress)
- Doppler secrets management
- Sentry error tracking

### Feature Areas
- **Auth/Profile:** Clerk session, profile setup, webhook sync
- **Connection Flow:** QR scan, manual add, MeetingContextModal, confirmation
- **Warmth Engine:** Decay cron, status computation, base_warmth update
- **AI Layer:** Draft generation, approval gate, prompt builder
- **Dashboard:** ConnectionList, WarmthSummaryBar, ActionQueue, SearchBar
- **Connection Profile:** ConnectionHeader, WarmthTimeline, NotesEditor, TagsEditor
- **Map View:** NetworkGraph, NodeTooltip, GraphFilterPanel, IntroductionSuggestion
- **Notifications:** Nightly sweep, push delivery, NotificationCenter
- **Mobile:** ScannerScreen, TodayCard, ConnectionDetailScreen (Expo)
- **Database:** 4 core tables with migrations, RLS policies, cron jobs

### Component Inventory
65 components organized by journey stage. Full map at `references/components.md`.
Every new component is added to that map when created.

### API Surface
13 API endpoints. Full spec at `references/api-routes.md`.
All endpoints validated with Zod. No raw untyped inputs reach business logic.

---

## What Is Incomplete or Needs Updates

> This section is updated by the Orchestrator after the first audit task.
> Fill in from Obsidian brain before first God Made Weapon session.

- [ ] [List what is broken or incomplete — pull from Obsidian]
- [ ] [List what needs updating]
- [ ] [List what is partially built]

---

## What Must Not Be Touched

These areas are stable and out of scope unless a task explicitly targets them:

- The warmth formula in `lib/warmth/formula.ts` — do not modify the decay rate
- The two-call approval gate structure — do not merge `/api/draft` and `/api/draft/approve`
- Existing RLS policies — do not drop or modify without explicit human approval
- Clerk authentication flow — do not bypass or modify session handling
- The notification cap logic in the nightly sweep — do not change the 7-day window

---

## Reference Files

Read the relevant reference before working on that area. Do not guess at schema
column names, API shapes, or component names. These files are the source of truth.

| Reference | Path | Read when |
|---|---|---|
| Database schema | `references/schema.md` | Any DB work, migrations, queries |
| Warmth formula | `references/warmth.md` | Any warmth, decay, or status work |
| AI layer | `references/ai-layer.md` | Any draft, Claude API, or approval gate work |
| Component map | `references/components.md` | Any frontend component work |
| Design tokens | `references/design-tokens.md` | Any styling or UI work |
| API routes | `references/api-routes.md` | Any endpoint work or API consumption |

For complex tasks, read all relevant references before starting.

---

## Approval Gate Flow

This flow is sacred. Every agent knows it. No agent deviates from it.

```
User requests draft
  → POST /api/draft           (generates text only — no DB write)
  → User sees AIDraftCard
  → User clicks Approve
  → POST /api/draft/approve   (writes history, resets warmth — ONLY here)
```

---

## Repository

- **GitHub:** [Add repo URL from Obsidian]
- **Primary branch:** main
- **Staging branch:** staging
- **Local path:** [Add local path]
- **Deployment:** Cloudflare Pages (frontend) · [Add backend deployment]

---

## Key Contacts

- **Project owner:** Alysha (Future)
- **Technical team:** Brent Montgomery (Tech Operations), Nelson Foster (Lead Engineer)

---

*Equal Point CONTEXT.md — maintained by the human.*
*Agents read this. Agents do not modify this.*
*Update the "Incomplete or Needs Updates" section from Obsidian before first session.*
