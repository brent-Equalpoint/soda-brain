# QA Checklist — Master
## God Made Weapon | Ghost QA
## Binary: pass or fail. No partial credit.
## Both Code Review Agent (Mode 1) and Live Testing Agent (Mode 2) reference this file.

---

## Section 1: Equalpoint Non-Negotiables

Each item is P1 on failure.

| # | Check | Pass Condition | Mode |
|---|-------|---------------|------|
| N1 | No auto-send | No autoSend/auto_send/auto-send in codebase | 1 |
| N2 | RLS on every table | All tables: rls_enabled = true AND at least one policy | 1 |
| N3 | Warmth formula location | All warmth calculations import from lib/warmth/formula.ts only | 1 |
| N4 | Two-call gate | POST /api/draft contains no database write | 1 |
| N5 | Notification cap server-side | Cap check in API layer reads last_notified from DB | 1 |
| N6 | Secrets from env only | No literal credentials in src/ | 1 |
| N7 | Status derived, not source | Status writes always accompany warmth recalculation | 1 |
| N8 | Private nudge RLS | No API route returns another user's draft or nudge | 1+2 |
| N9 | Master key logged | All operator_access actions write to operator_access_log | 1+2 |
| N10 | Discard signal logged | Dismissed drafts write to draft_feedback | 1+2 |
| N11 | POST /api/draft fires correctly | Returns draft text, no DB write | 2 |
| N12 | POST /api/draft/approve fires correctly | Writes to DB, resets warmth | 2 |
| N13 | RLS boundary enforced live | User A cannot read User B's connections in deployed env | 2 |

---

## Section 2: TypeScript Standards

Each item is P2 on failure unless it allows an injection vector (P1).

| # | Check | Pass Condition | Mode |
|---|-------|---------------|------|
| T1 | TypeScript strict mode | zero `any` types, zero implicit types | 1 |
| T2 | Server Components default | `use client` present only where interaction requires it | 1 |
| T3 | Zod on all API bodies | All request and response bodies have Zod schemas | 1 |
| T4 | No client-side Supabase calls | All DB reads/writes through API routes | 1 |
| T5 | Error handling on async | Every async operation has explicit error handling | 1 |
| T6 | Zod v4 syntax | z.uuid(), z.email() — not z.string().uuid() | 1 |

---

## Section 3: UX Spec

Each item is P2 on failure, P1 if warmth score or numeric tier is exposed.

| # | Check | Pass Condition | Mode |
|---|-------|---------------|------|
| U1 | No raw warmth score | warmth_score / warmthScore not in any component file | 1 |
| U2 | Warmth phrases only | Only "in rhythm" and "it's been a while" appear | 1 |
| U3 | WCAG AA contrast | All text passes AA on its background | 1 |
| U4 | Warmth tiers in human language | No numeric tier 1–5 exposed in UI | 1 |
| U5 | SkeletonLoader on async | No spinners. Every async state has SkeletonLoader | 1 |
| U6 | data-testid on all interactive | Every button, input, link has data-testid attribute | 1 |

---

## Section 4: Endpoint Behavior (Mode 2)

| # | Endpoint | Expected Behavior | Edge Case |
|---|----------|------------------|-----------|
| E1 | POST /api/draft | Returns draft text. No DB write. 200. | Missing connection → 404. Expired session → 401. |
| E2 | POST /api/draft/approve | Writes draft. Resets warmth. 200. | Already approved → 409. Missing draft → 400. |
| E3 | GET /api/connections | Returns current user's connections only. 200. | No connections → 200 empty array, not 404. |
| E4 | POST /api/connections | Creates connection. Initializes warmth. 201. | Duplicate QR scan → 409. |
| E5 | Warmth cron | Decays all warmth scores. Updates status. Respects cap. | Null score → skip, log. New connection < 1 day → skip decay. |
| E6 | Push notification | Sends if cap not hit. Updates last_notified. | Cap hit → skip, log. No push token → log, do not error. |

---

## Section 5: Critical Flows (Mode 2)

| Flow | Steps | Pass Condition |
|------|-------|---------------|
| F1 | QR scan → connection created | connection row exists, warmth initialized, user can see connection |
| F2 | Draft → two-call gate | draft generated (no write), approve fires (write + warmth reset) |
| F3 | Nightly sweep | warmth decays, notification cap respected, status updates |
| F4 | Empty state | user with no connections sees empty state UI, not error |
| F5 | RLS boundary | User A authenticated. Attempt to read User B's connections. Must 403 or return empty. |

---

## Verdict Rules

- Any N-series (non-negotiable) failure = FAIL. Full stop.
- Any E-series (endpoint) failure = FAIL. Full stop.
- Any F-series (critical flow) failure = FAIL. Full stop.
- T-series and U-series failures = FAIL if count > 0. All findings must be resolved.
- A conditional pass does not exist. Ghost either passes or fails.
