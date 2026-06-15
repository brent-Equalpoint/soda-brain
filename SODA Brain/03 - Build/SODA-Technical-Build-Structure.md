# SODA: Technical Build Structure

*The canonical build document for Claude Code. SODA is the consumer product of Equalpoint's Relational OS, a room operating system for live events. This document encodes the stack, the repository structure, the data model, the non-negotiable rules, and the build order. It reflects the experience-first inversion: front end first, backend second. Read this before opening any other file.*

---

## 0. The core inversion: experience-first

The build order changed. The old structure was product-logic and backend first, then a UI laid on top. SODA is now built the other way around, because the product is the feeling in the room, and a backend built before the experience is a backend built on guesses.

Every slice follows the same seven steps, in this order:

1. **UX flow.** Pull the screen and its path from the flow maps and the screen specs. Know where it sits in the night.
2. **Prototype.** Build the front end first, against mock data, using the paste-ready prompt for that screen. Make it feel right on a phone.
3. **Approval.** Confirm the experience before any backend exists. If it does not feel right, fix it here, where it is cheap.
4. **API contract.** Only now, freeze the types and the request and response shapes in `packages/contracts`. The approved experience defines the contract, not the reverse.
5. **Backend.** Build the Supabase tables with RLS, the endpoints, and the proximity service if the slice needs presence. The contract is the spec.
6. **Wire.** Replace the mock data with real calls. The front end does not change shape, because the contract was drawn from it.
7. **Ship.** Pass the Ghost QA gate, then release the slice.

The rule of thumb: a backend table is never written before the screen that needs it has been prototyped and approved. Build the experience, let it pull the contract out of itself, then build to that contract.

---

## 1. The stack

- **Web app:** Next.js 16.2 (App Router), Turbopack native, on React 19.2, shipped as an installable PWA. One codebase serves the attendee experience and the host tools. Caching is opt-in through the use cache directive and Partial Prerendering, fetch is uncached by default.
- **Backbone:** Supabase. Postgres for data, Row Level Security on every table, Realtime for room presence, pg_cron 1.6.4 for the warmth sweep. Supabase was chosen over Firebase for Postgres portability, the data layer is not locked to a vendor.
- **Proximity, for the pilot:** the room is defined by who scanned the event QR and is present in realtime through Supabase Realtime. Browser Bluetooth is not used, because Web Bluetooth does not run on Safari or any iOS browser, and a live audience is heavily iPhone. True micro-proximity, sensing who is physically near you, is a later, native-only capability and is out of the pilot. A FastAPI service returns only if and when that native layer is built.
- **Auth:** Supabase Auth with email one-time codes, through the @supabase/ssr package (not the deprecated auth-helpers), using the new publishable and secret API keys (the legacy anon and service_role keys are on a deprecation clock). Sessions persist and never expire mid-event.
- **Hosting:** Vercel (Next.js 16.2 deployment). Serverless functions reach Supabase through the transaction pooler, never a direct per-invocation connection. Per SODA-029.
- **Realtime capacity (pre-pilot check):** Before any pilot, confirm the expected room size against the Supabase Realtime concurrent-connection ceiling for the plan (roughly 200 on Free, 500 on Pro, higher on Team or self-host), be on a plan that covers it with headroom, and load-test the Room View at expected concurrency. The never-drop-a-session promise depends on this number.
- **AI:** the Claude API for follow-up drafts only, behind a two-call approval gate. Default model claude-sonnet-4-6 for draft quality, or claude-haiku-4-5-20251001 for speed and cost at scale, with prompt caching on the system prompt.
- **Secrets:** injected from the environment, never read from a committed file.

The key scaling metric to design against is concurrent realtime connections per event, not total users. A single full room is the load that matters. This maps onto Supabase Realtime plan tiers: roughly 200 concurrent on Free, around 500 on Pro, and higher only on a Team plan or self-hosted Realtime, so a large room needs that choice made before the event. Re-track presence on a visibility change with a fresh timestamp to avoid ghost guests.

---

## 2. Repository structure

```
soda/
  apps/
    web/                      Next.js 16.2 PWA (attendee + host)
      app/
        (attendee)/           the event-night and home routes
          join/               entry QR, welcome, sign-in
          room/               room view and the acts
          home/               overview, events, contacts, profile
        (host)/               sign-in, setup, command center, admin
        api/                  route handlers (the only path to the DB from the client)
      components/             organized to mirror references/components map
      lib/
        warmth/               the warmth formula and helpers (single source)
        supabase/             typed client and server helpers
        ai/                   draft prompt builder and gate client
      styles/                 the locked dark-mode tokens
    proximity/                FastAPI service, DEFERRED, native proximity only, not in the pilot
  packages/
    contracts/                shared zod schemas and TypeScript types (the API contracts)
    ui/                       shared primitives and design tokens
  supabase/
    migrations/               every schema change, each paired with its RLS policy
    policies/                 RLS policy library, reviewed as a unit
    seed/                     a seeded pilot event for local work
  docs/
    BUILD.md                  this document
    specs/                    the screen specs (attendee, home, host, auth, event mode)
    flows/                    the four flow maps and the master map
    prompts/                  the paste-ready prompts for each screen
    inventory/                the component inventory, the source of truth for what exists
  SESSION.md                  running build state, updated after every slice
  AGENTS.md                   the agentic constitution and protocol
```

The `docs/` folder is not decoration. Claude Code reads the matching spec and flow before building a screen, and the prompt before prototyping it.

---

## 3. The data model

Postgres, every table with Row Level Security from the moment it is created. The model separates what is permanent (a person, their account) from what is per-event (their tiny profile that night), and treats a relationship as its own co-owned record rather than a line between two people.

### Core tables

```sql
-- A permanent person, keyed to the auth user. Survives every event.
profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users,
  email text unique not null,
  name text,
  photo_url text,
  is_operator boolean not null default false,   -- the master key flag
  created_at timestamptz not null default now()
);

-- An event is a container. Brand-agnostic: the host's identity rides on it.
events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id),
  host_name text not null,
  host_logo_url text,
  mode text not null default 'full',            -- 'full' | 'simple'
  status text not null default 'draft',          -- 'draft' | 'live' | 'closed'
  qr_token text unique not null,
  created_at timestamptz not null default now()
);

-- The three-level access model, per event. Operator is platform-level (profiles.is_operator).
event_roles (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  profile_id uuid not null references profiles(id),
  role text not null,                            -- 'owner' | 'collaborator'
  unique (event_id, profile_id)
);

-- A person at one event: the tiny profile they build that night (the chips).
attendances (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  profile_id uuid not null references profiles(id),
  role_text text,                                -- who they are in the room
  offer text,                                    -- what they bring
  need text,                                     -- what they seek
  photo_url text,
  joined_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

-- A relationship as a first-class, co-owned record. Not an edge.
connections (
  id uuid primary key default gen_random_uuid(),
  origin_event_id uuid references events(id),
  profile_a uuid not null references profiles(id),
  profile_b uuid not null references profiles(id),
  base_warmth int not null default 100,
  warmth_score int not null default 100,         -- derived cache, recomputable
  last_contact_at timestamptz not null default now(),
  shared_context jsonb not null default '{}',    -- versioned shared context
  created_at timestamptz not null default now(),
  check (profile_a < profile_b)                  -- one record per pair
);

-- The acts the host fires into the room.
moments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  type text not null,                            -- 'drop' | 'chance' | 'nudge'
  payload jsonb,
  fired_by uuid references profiles(id),
  fired_at timestamptz not null default now()
);

-- A nudge is private to its recipient. RLS enforces this, not the UI.
nudges (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  recipient_profile_id uuid not null references profiles(id),
  type text not null,
  message text,
  status text not null default 'shown',          -- 'shown' | 'dismissed' | 'acted'
  created_at timestamptz not null default now()
);

-- AI follow-up drafts. Two-call gate: generated here, approved separately.
drafts (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references connections(id),
  generated_text text not null,
  status text not null default 'pending',        -- 'pending' | 'approved' | 'discarded'
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

-- The closed gap: every draft outcome is logged, including discards.
draft_feedback (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references drafts(id),
  signal text not null,                          -- 'approved' | 'discarded' | 'edited'
  reason text,
  created_at timestamptz not null default now()
);

-- The master key, made accountable. Every operator reach is recorded.
operator_access_log (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references profiles(id),
  event_id uuid not null references events(id),
  action text not null,
  created_at timestamptz not null default now()
);
```

### RLS, the shape of it

- **profiles:** a person reads and writes only their own.
- **events:** owners and collaborators reach an event through `event_roles`. Operators read all, and every such read writes a row to `operator_access_log`. Attendees read a minimal public view resolved by `qr_token`.
- **attendances:** a person reads and writes their own. A host of the event reads all of that event's. Export is gated to owner and operator, never collaborator.
- **connections:** readable only by `profile_a` and `profile_b`. Co-owned, two-sided.
- **nudges:** readable only by `recipient_profile_id`. This is the sacred one.
- **drafts and draft_feedback:** readable only by the owner of the connection.

A table without an RLS policy is a bug, not an unfinished feature.

---

## 4. The non-negotiable rules

These hold across every slice. They are inherited from the Relational OS engine and extended for the room.

1. **No auto-send.** SODA drafts a follow-up. The person sends it. Nothing leaves on its own.
2. **RLS on every table, at creation.** The migration that creates a table includes its policy.
3. **The warmth formula is fixed:** `max(0, round(base_warmth * e^(-0.01 * days_since_contact)))`. Changing the decay rate is a spec change, not a code change.
4. **The approval gate is two calls.** `POST /api/draft` generates text and writes nothing. `POST /api/draft/approve` writes history and resets warmth. They never merge.
5. **The private nudge is sacred.** Recipient-only, enforced in RLS, never exposed to a host or another guest.
6. **Never drop a session mid-event.** Neither an attendee nor a host is bounced to a login while an event is live.
7. **Derived state is a cache.** `warmth_score` and any status must always be recomputable from `base_warmth` and `last_contact_at`.
8. **Per-event scoping, brand-agnostic.** The host owns the event's data. Equalpoint owns the platform. The host's identity rides on the attendee screens.
9. **The master key is logged.** Every operator reach into an event writes to `operator_access_log`.
10. **The discard signal is logged.** A dismissed draft writes to `draft_feedback`, so the AI gate can learn.
11. **Secrets come from the environment.** Never from a committed file.

---

## 5. The build order

Phases, each built experience-first per the seven steps in section 0. The vertical slice comes first, because it proves the whole spine end to end before breadth is added.

### Phase 0: Foundation
Scaffold the repo, wire Supabase and Auth, lay in the dark-mode tokens, stand up empty route shells, and seed a pilot event. No features yet, just the ground.

### Phase 1: The vertical slice, scan to Room View
The proof. Entry QR, Welcome, Sign-In with an email code, the tiny profile (role, offer, need), and the Room View showing the room fill in realtime. Prototype the screens first against mock presence, approve the feel, then build `events`, `attendances`, and Realtime presence, then wire. When a second phone scanning in appears on the first phone's Room View, the spine works.

### Phase 2: The acts
A minimal host Command Center that fires the Drop, the Chance, and the Nudge into the live room. The nudge lands privately. This is the first host-side surface.

### Phase 3: Closing the night
Comment, Survey, Send-Off, the recap email, and the lifecycle message. The night resolves and reaches into the next day.

### Phase 4: The home area
The persistent profile and the three tabs, Overview, Events, and Contacts. Connections with warmth decay, the follow-up nudge, the AI draft behind its two-call gate, and the discard feedback. This is where the Relational OS engine comes online.

### Phase 5: Host and access
The three-level access model in `event_roles` and RLS, host sign-in and account setup, collaborator onboarding and the role-scoped tutorial, the host welcome-back and its routing, the Event Mode control, and collaborator management. The operator console stays reserved.

### Phase 6: States, sessions, and failure modes
The empty, loading, and error states, the never-drop session behavior, the code-not-arriving and camera-permission help, the install prompt, and sign-out and kiosk mode.

### Phase 7: Hardening and pilot
A full RLS audit, the motion layer, performance against concurrent realtime connections, and the PWA pilot in a real room.

The build manifest tracks each item's status. A phase is done when its slices are shipped and its manifest items move from specified to built.

---

## 6. Conventions for Claude Code

- TypeScript strict mode. No `any`.
- Server Components by default. `'use client'` only when the screen needs it.
- Zod schemas for every API request and response, living in `packages/contracts`.
- No direct Supabase calls from client components. Everything goes through an API route.
- Skeleton loaders for async states, not spinners.
- `data-testid` on every interactive element.
- A full file path comment at the top of each file.
- The warmth formula is imported from `lib/warmth`, never reimplemented inline.
- Before building a screen, read its spec in `docs/specs`, its path in `docs/flows`, and its prompt in `docs/prompts`.
- A migration that adds a table or column ships with its RLS policy in the same change.
- After every slice, update `SESSION.md` with what shipped and what is next.

### Definition of done, per slice
The experience matches the spec on a phone. The contract is frozen in `packages/contracts`. Every touched table has an RLS policy, and it has been tested with a second account. No code path sends anything on a person's behalf. The Ghost QA gate passed. `SESSION.md` is updated.

---

## 7. Design tokens

SODA is dark mode only.

```
--canvas:    #111111   the near-black ground
--card:      #1A1A1A   raised surfaces
--border:    #262826   dividers and card edges
--green:     #3BD75C   interactive and confirming, only
--deep-green:#203229   warm surfaces
--off-white: #F5F5F5   primary text
--muted:     #777777   secondary text
--amber:     #F59E0B   timers, only
--purple:    #A47BFF   a nudge, always
--red:       (errors only)
```

Green is reserved for what is interactive or confirming. Amber means a timer. Purple always means a nudge. An 8 point grid, 44 pixel minimum touch targets, one dominant element per screen.

---

*A name tag knows you showed up. SODA knows who you became to the room. Build the experience first, and let it tell you what the system needs to be.*
