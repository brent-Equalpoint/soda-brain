---
name: soda
description: >
  Expert skill for building, extending, and debugging SODA, the room operating system for live
  events that is the consumer product of Equalpoint's Relational OS. Use this skill whenever the
  user asks to build a screen, wire a flow, create a Supabase migration, fire an act, work on the
  Room View, the warmth engine, the AI draft layer, the host Command Center, the three-level access
  model, Event Mode, or anything that maps to the SODA codebase. Also trigger on "build this in
  SODA", "add this screen", "how should I implement X in our stack", "write the presence channel",
  "create the connection record". This skill encodes the full project context so the agent never
  has to ask about the stack, the data model, or the rules.
---

# SODA Build Skill

You are building **SODA**, a room operating system for live events, the consumer surface of
Equalpoint's Relational OS. Before writing any code, internalize the rules below. They are
constraints, not suggestions.

## Quick context

A guest scans an event QR, builds a tiny profile in seconds (role, offer, need), and enters a live
Room View. The host fires three acts into the room: the Drop, the Chance, and the private Nudge.
After the night the guest keeps a home area of the people they met, with warmth that decays over
time and an AI draft to follow up that the guest sends themselves. SODA never sends anything.

**Stack:** Next.js 16.2 (App Router), Turbopack native, React 19.2, shipped as a PWA. Supabase
(Postgres, RLS, Realtime, pg_cron) as the backbone, with auth through @supabase/ssr and the new
publishable and secret keys. The room is defined by QR check-in plus Supabase Realtime presence,
browser Bluetooth is not used because it does not run on iOS. The Claude API for drafts only,
default claude-sonnet-4-6. Secrets injected from the environment.

**The scaling metric is concurrent realtime connections per event, not total users.**

## The build order is experience-first

Every slice, in this order: UX flow, prototype against mock data, approve the feel, freeze the API
contract in packages/contracts, build the backend with RLS, wire, ship behind the Ghost QA gate.
Never write a backend table before the screen that needs it is prototyped and approved. Build the
experience, let it pull the contract out of itself, then build to that contract.

## The non-negotiable rules

1. **No auto-send.** SODA drafts. The person sends. Nothing leaves on its own.
2. **RLS on every table, at creation.** The migration that creates a table includes its policy.
3. **Warmth is fixed:** `max(0, round(base_warmth * e^(-0.01 * days_since_contact)))`. Changing the rate is a spec change.
4. **The approval gate is two calls.** `POST /api/draft` generates only. `POST /api/draft/approve` writes. Never merge.
5. **The private nudge is sacred.** Recipient-only, enforced in RLS.
6. **Never drop a session mid-event,** attendee or host.
7. **Derived state is a cache.** warmth_score and status always recompute from base_warmth and last_contact_at.
8. **Per-event scoping, brand-agnostic.** Host owns the event data, Equalpoint owns the platform, the host identity rides on attendee screens.
9. **The Operator master key is logged.** Every operator reach into an event writes to operator_access_log.
10. **The discard signal is logged** to draft_feedback.
11. **Secrets from the environment,** never a committed file.

## The data model

Permanent versus per-event is the core split. A person and their account are permanent. Their tiny
profile that night is per-event. A relationship is its own co-owned record, not an edge.

- `profiles`, a permanent person, keyed to the auth user. `is_operator` is the master key flag.
- `events`, a container. host_name, host_logo_url, mode (full|simple), status (draft|live|closed), qr_token.
- `event_roles`, per event: role (owner|collaborator). Operator is platform-level on the profile.
- `attendances`, a person at one event: role_text, offer, need, photo. The chips.
- `connections`, a co-owned relationship: profile_a, profile_b, base_warmth, warmth_score, shared_context. One row per pair, smaller id first.
- `moments`, the acts: type (drop|chance|nudge), fired_by, fired_at.
- `nudges`, recipient-only. RLS restricts reads to recipient_profile_id.
- `drafts`, AI follow-ups: status (pending|approved|discarded).
- `draft_feedback`, approved | discarded | edited, the closed gap.
- `operator_access_log`, every operator reach into an event.

## How to approach a build task

1. **Identify the area:** Entry & Access, Event Night (profile, room, acts), Closing (comment, survey, send-off, recap), Home (overview, events, contacts, follow-up), Host (sign-in, setup, command center, admin), Access (three-level model, sessions), States & failures.
2. **Read the right docs first.** The screen spec in docs/specs, its path in docs/flows, its prompt in docs/prompts. For the data, the technical build structure. For verification, the QA guide. For settled calls, the decision log.
3. **Write in the project's patterns.** TypeScript strict, no any. Server Components by default. Zod for all API bodies, in packages/contracts. No direct Supabase from client components, go through an API route. Skeleton loaders, not spinners. data-testid on interactive elements. A file path comment at the top of each file.
4. **Warmth comes from lib/warmth,** never reimplemented inline.
5. **Follow the two-call gate** for any AI draft work.
6. **Migrations ship with their RLS policy** in the same change.

## Design system

Dark mode only.

```
--canvas:     #111111   the near-black ground
--card:       #1A1A1A   raised surfaces
--border:     #262826   dividers and card edges
--green:      #3BD75C   interactive and confirming, only
--deep-green: #203229   warm surfaces
--off-white:  #F5F5F5   primary text
--muted:      #777777   secondary text
--amber:      #F59E0B   timers, only
--purple:     #A47BFF   a nudge, always
--red:                  errors only
```

Green is interactive or confirming. Amber is a timer. Purple is always a nudge. 8 point grid, 44
pixel touch targets, one dominant element per screen.

## Output standards

- Always include TypeScript types. Never any.
- A full file path comment at the top of each file.
- The minimal correct implementation. Do not add what was not asked.
- If you touch warmth, run the decay table in comments to verify.
- If you add a table or column, include the migration SQL and the RLS policy.
- After a slice, update SESSION.md and, if anything broke, the build error log.

## Definition of done, per slice

The experience matches the spec on a phone. The contract is frozen in packages/contracts. Every
touched table has an RLS policy, tested with a second account. No code path sends on a person's
behalf. The Ghost QA gate passed. SESSION.md is updated.

---

*SODA Build Skill. A product of Equalpoint, Inc. Build the experience first, and let it tell you what the system needs to be.*
