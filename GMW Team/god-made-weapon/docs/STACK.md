# STACK.md
## Equal Point — Technology Stack
## God Made Weapon — Required reading every session

> Every agent reads this file at session startup.
> This is the single source of truth for what the team builds against.
> No agent uses a default from their own MD if it conflicts with what is written here.
> Stack changes require human approval and a CHANGELOG entry before any agent implements them.

---

## Frontend

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.2 (App Router) | Server Components by default. `'use client'` only when needed. Turbopack is the default bundler. |
| Language | TypeScript 6.0 | Strict mode always. No `any`. Ever. TS 7.0 beta exists — not yet production. |
| Styling | CSS with design tokens | See design tokens section below |
| State | [Add from Obsidian] | — |
| Data fetching | Supabase client + API routes | No direct Supabase calls from client components. Go through API routes. |
| Loading states | SkeletonLoader | Not spinners. SkeletonLoader for all async states. |
| Forms | Zod v4 | Zod schemas for all form inputs. Use top-level format functions: z.uuid(), z.email() — not chained. |
| Testing | `data-testid` on interactive elements | Required on every interactive element. |
| Mobile | Expo | Separate mobile app. Screens: ScannerScreen, TodayCard, ConnectionDetailScreen |

### Frontend Conventions

- Server Components by default. Add `'use client'` only when the component needs browser APIs, event handlers, or React hooks.
- No direct Supabase calls from client components. All data goes through Next.js API routes.
- SkeletonLoader for every async state. No raw spinners.
- One component per file. Named exports, not default exports.
- Full file path as a comment at the top of each file.
- Components added to the map in `references/components.md` when created.
- `data-testid` on every interactive element. Required, not optional.
- Turbopack is the default bundler — do not add Webpack config or Webpack-specific plugins.
- Middleware has been replaced by `proxy.ts` in Next.js 16. Do not create `middleware.ts`. Use `proxy.ts` for network boundary logic.
- Cache Components use `use cache` directive with PPR. Do not use the old `experimental.ppr` flag — it was removed in Next.js 16.
- Use `next dev --inspect` for debugging instead of console-based approaches.

---

## Backend

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Node.js | Via Next.js API routes |
| Framework | Next.js API Routes | App Router route handlers |
| Database client | Supabase JS client | Server-side only for mutations |
| Validation | Zod v4 | All API request and response bodies |
| Auth | Clerk | Session management and webhook sync |
| AI | Claude API (Anthropic) | Draft generation only. Model: claude-sonnet-4-20250514 |
| Warmth logic | `lib/warmth/formula.ts` | Import from here. Never reimplement. |

### Backend Conventions

- Zod schemas on every API endpoint — request body and response shape.
- No untyped inputs reach business logic. Validate at the boundary.
- Validation errors return: `{ error: string, field?: string, code: string }`
- No raw Supabase errors reach API responses. Catch and format all errors.
- Full file path as a comment at the top of each file.
- TypeScript strict mode. No `any`.

### API Route Map

13 endpoints. Full spec at `references/api-routes.md`. Do not add endpoints without updating that file.

### The Approval Gate — Two Calls, Never One

```
POST /api/draft          → generates text only. No DB write. Ever.
POST /api/draft/approve  → writes to DB. Resets warmth. Only here.
```

These are never merged. This is Rule 4 from CONTEXT.md.

---

## Database

| Layer | Technology | Notes |
|---|---|---|
| Database | PostgreSQL via Supabase | Managed Supabase instance |
| ORM/Client | Supabase JS client | Server-side only |
| Security | Row Level Security (RLS) | Required on every table. No exceptions. |
| Scheduled jobs | pg_cron | Nightly warmth decay sweep |
| Schema | 4 core tables | Full schema at `references/schema.md` |

### Database Conventions

- Every new table: `ENABLE ROW LEVEL SECURITY` + policy immediately. No table exists without both.
- Every migration includes the `down` migration alongside the `up` migration.
- No destructive migrations (drop column, drop table, truncate) without explicit human approval.
- Index naming: `idx_[table]_[column(s)]`
- Every foreign key has an explicit `ON DELETE` behavior.
- `status` is a derived cache field. Always recomputable from `warmth_score + days_since_contact`.
- Warmth formula: `max(0, round(base_warmth × e^(−0.01 × days_since_contact)))` — implemented in `lib/warmth/formula.ts` only.

---

## Authentication

| Layer | Technology | Notes |
|---|---|---|
| Auth provider | Clerk | Session management, user identity |
| Sync | Clerk webhooks | Syncs Clerk user data to Supabase |
| Session | Clerk server helpers | Used in API routes for auth verification |

### Auth Conventions

- Never bypass Clerk session handling.
- Every protected API route verifies the Clerk session before touching any data.
- Webhook sync keeps Supabase user records in sync with Clerk. Do not write user records directly without going through Clerk first.

---

## Infrastructure and Deployment

| Layer | Technology | Notes |
|---|---|---|
| Frontend hosting | Cloudflare Pages | Production and staging |
| Secrets | Doppler | All secrets injected via `process.env`. No committed `.env` files. |
| Error tracking | Sentry | All environments |
| Backend | [Add from Obsidian] | — |
| Database hosting | Supabase managed | — |
| CI/CD | [Add from Obsidian] | — |

### Infrastructure Conventions

- Secrets come from Doppler only. Never from committed `.env` files.
- `.env.example` has placeholder values only. Real values never committed.
- Every deployment verifies all required environment variables are set before proceeding.
- Sentry source maps uploaded on every production deploy.

---

## External Services

| Service | Purpose | Owner | Notes |
|---|---|---|---|
| Supabase | Database + auth + storage | Kennis Beck | Managed Postgres + RLS + pg_cron |
| Clerk | Authentication | Kennis Beck | Session management, webhook sync |
| Anthropic Claude API | AI draft generation | Kennis Beck | claude-sonnet-4-20250514. Draft only, no auto-send. |
| Cloudflare Pages | Frontend hosting | Brianna Ops | — |
| Doppler | Secrets management | Brianna Ops | All environments |
| Sentry | Error tracking | Brianna Ops | All environments |
| Expo | Mobile build + distribution | Aniya Fronte | iOS + Android |

---

## Design System

### Color Tokens

```css
--dark-green:  #203229   /* sidebar, headers, dark backgrounds */
--light-green: #B1FA63   /* accent, highlights, active badge text */
--green:       #3BD75C   /* active status, success */
--off-white:   #FBFBFB   /* page background */
--charcoal:    #212121   /* body text */
--purple:      #813BD7   /* secondary accent */
--border:      #E2E8E4   /* dividers, card borders */
```

### Status Colors

```
Active      → #3BD75C  (--green)
Followed Up → #F59E0B
Cooling     → #9CA3AF
```

### Typography

- **Font:** Public Sans
- **Weights used:** 300, 400, 600, 700, 800

### Full Token Reference

See `references/design-tokens.md` for complete spacing, border radius, shadow, and component-level tokens. Always read this before writing any styles.

---

## Environment Variables

All variables are injected by Doppler. Template at `.env.example`.

| Variable | Purpose | Owner |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Kennis Beck |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for client | Kennis Beck |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role for server | Kennis Beck |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Kennis Beck |
| `CLERK_SECRET_KEY` | Clerk secret key | Kennis Beck |
| `ANTHROPIC_API_KEY` | Claude API key | Kennis Beck |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry project DSN | Brianna Ops |
| `DOPPLER_TOKEN` | Doppler service token | Brianna Ops |

Add new variables to `.env.example` with a description. Update this table.

---

## What Aniya Fronte Builds

- All React components and pages in `app/` and `components/`
- Mobile screens in the Expo app
- All UI states: loading (SkeletonLoader), error, empty, success
- Consumes API routes — never calls Supabase directly from the client

## What Kennis Beck Builds

- All API routes in `app/api/`
- Database migrations and RLS policies
- Warmth engine logic (imports from `lib/warmth/formula.ts`)
- Claude API integration
- Clerk webhook handlers
- Zod schemas in `lib/schemas/`

## What Brianna Ops Manages

- Cloudflare Pages deployment pipeline
- Doppler environment configuration
- Sentry setup and source maps
- Expo build and distribution
- CI/CD pipeline

## What Ghost Tests

- Full QA per `verification/SKILL.md`
- API contract validation against `references/api-routes.md`
- RLS policy testing — can a user access another user's data?
- Warmth formula validation — does the decay compute correctly?
- Approval gate integrity — does `/api/draft` ever write to DB?
- Notification cap enforcement — does the 7-day cap hold server-side?

---

*Equal Point STACK.md — maintained by the human.*
*Agents read this. Agents do not modify this.*
*Update bracketed placeholders from Obsidian before first session.*
