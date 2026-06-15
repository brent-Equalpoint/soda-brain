# verification/equal-point-spec.md
## Equal Point — Ghost QA Verification Spec
### Loaded by: Ghost
### Triggered when: Any QA pass on the Equal Point project

> Ghost loads this file alongside verification/SKILL.md at the start of every QA phase.
> This file defines WHAT Ghost tests on Equal Point specifically.
> agents/ghost.md defines HOW.
> The non-negotiable rules below are checked on every task. No exceptions.

---

## 1. Stack Identity

**Project:** Equal Point
**What it does:** Personal relationship intelligence platform (Relational OS). Warmth decay engine, AI-assisted follow-up drafts, network graph visualization.
**Repo:** equal-point (see docs/CONTEXT.md for repo URL)
**Environments:** local | staging | production
**Ghost tests against:** staging (primary), production (post-deploy smoke test only)

---

## 2. Non-Negotiable Rules — Must Pass on Every Task

Sourced from `docs/CONTEXT.md`. Ghost must confirm ALL of the following before issuing CLEAR TO SHIP.
If any fail: HOLD. No exceptions.

| Rule | What Ghost Tests | Passes When | Fails When |
|---|---|---|---|
| **No auto-send** | Trigger every send-adjacent action in the feature | User must take an explicit send action | Any message sends automatically |
| **RLS on all tables** | Test cross-user data access on every new/modified table | User A cannot read User B's records | Any record is accessible across user boundary |
| **Warmth formula is read-only** | Grep new code for warmth calculation outside `lib/warmth/formula.ts` | Formula only lives in that file | Any inline reimplementation found |
| **Approval gate: two calls** | Confirm POST /api/draft does not write to DB | /api/draft returns text only | DB write found in the draft generation call |
| **Notifications cap** | Trigger notification for same connection within 7 days | Second notification is suppressed | Second notification fires within the window |
| **Secrets via Doppler only** | Grep committed files for secret patterns | No credentials in any file | Any token, key, or password found in code |
| **Status is derived** | Verify status field cannot be set directly via API | API rejects direct status writes | Status can be set without activity data |

---

## 3. External Services

### Supabase
**Purpose:** Primary database (Postgres), Row Level Security, Realtime channels, pg_cron for warmth decay.
**Owner:** Kennis Beck
**Test:** Authenticated request to a protected endpoint returns correct data.
**Test — cross-user:** Modify resource ID in request to another user's resource. Expect 403 or empty set.
**Test — RLS:** Disable app-level auth and attempt direct DB query. Expect RLS to block access.
**Passing:** 200 with correct data for own resources. Empty or 403 for other user's resources.
**Failing:** Data from another user's records returned.

### Clerk
**Purpose:** Authentication — session management, OTP, webhook sync to Supabase.
**Owner:** Kennis Beck
**Test:** Unauthenticated request to protected endpoint.
**Test:** Expired session token reused.
**Passing:** 401 returned. Redirect to sign-in.
**Failing:** Data returned without valid session.

### Anthropic Claude API
**Purpose:** AI draft generation only. Never auto-sends.
**Owner:** Kennis Beck
**Test:** Call POST /api/draft. Inspect response — text only, no DB write.
**Test:** Confirm /api/draft/approve is the only path that writes to DB.
**Passing:** Draft generated, no history record created until /approve is called.
**Failing:** DB write found in /draft response. Or: message sent without user action.

### Cloudflare Pages
**Purpose:** Frontend hosting.
**Owner:** Brianna Ops
**Test:** Deployed URL loads in under 3 seconds. No console errors on primary routes.
**Passing:** 200 on all primary routes, no JS errors.
**Failing:** Any primary route 404s or throws uncaught errors.

### Doppler
**Purpose:** Secrets management — all env vars injected at runtime.
**Owner:** Brianna Ops
**Test:** Grep committed files and build output for any secret values.
**Passing:** No secrets in any file.
**Failing:** Any credential, token, or key found in a committed or built file.

---

## 4. Auth Model

**Provider:** Clerk
**Session mechanism:** JWT + Clerk session cookie

**Test — authenticated request:**
Make API call with valid Clerk session token. Expect 200 and correct data.

**Test — unauthenticated request:**
Make API call without auth header. Expect 401.

**Test — wrong user data access:**
Authenticate as User A. Modify resource ID to User B's resource. Expect 403 or 404.

**Test — webhook verification:**
Confirm Clerk webhook endpoint validates the `svix-signature` header. Request without valid signature returns 400.

---

## 5. Database and Security Model

**Database:** PostgreSQL via Supabase
**Security model:** Row Level Security (RLS) — policy-enforced at the database layer

**Tables Ghost tests:**
For every new or modified table, Ghost verifies:
- RLS is enabled (`ENABLE ROW LEVEL SECURITY`)
- A policy exists that restricts reads and writes to the owning user
- Cross-user access returns empty set or 403, never another user's data

**Cross-user isolation test:**
1. Create two test users (User A and User B)
2. User A creates a record
3. Authenticate as User B
4. Attempt to read User A's record via API
5. Expected: empty result or 403. Never User A's data.

**Write and read-back test:**
1. Write a record via POST endpoint
2. Read it back via GET endpoint
3. Confirm all fields match exactly, no data loss, no transformation errors

---

## 6. Critical Business Logic Checks

### Warmth Decay

**What this rule protects:** The warmth formula is the core intelligence engine. Any inline reimplementation would diverge from the canonical formula and corrupt relationship scores.
**How Ghost tests it:** Grep all new and modified files for warmth calculation patterns (`e^`, `Math.exp`, `decay`, `warmth_score`) outside of `lib/warmth/formula.ts`.
**Passing:** Zero occurrences outside the canonical file.
**Failing:** Any warmth calculation found in a route, component, or migration.
**Severity:** Critical

---

### Approval Gate Integrity

**What this rule protects:** The two-call approval gate ensures users always review and manually approve AI drafts before anything is sent.
**How Ghost tests it:**
1. Call POST /api/draft with valid input
2. Check the database — no history record should exist
3. Call POST /api/draft/approve
4. Check the database — history record now exists
**Passing:** Draft generates text only. Approve writes to DB.
**Failing:** Draft call writes to DB. Or: no human approve step exists.
**Severity:** Critical

---

### Notification Cap

**What this rule protects:** Prevents connection fatigue from over-notification.
**How Ghost tests it:**
1. Trigger a notification for Connection X
2. Immediately trigger another for the same Connection X
3. Check: second notification is suppressed server-side
**Passing:** Only one notification per connection within the 7-day window.
**Failing:** Second notification fires within the cap window.
**Severity:** High

---

### Status Derivation

**What this rule protects:** Connection status must always be computable from activity data. Storing status directly creates drift.
**How Ghost tests it:** Attempt to set `status` directly via API without corresponding activity data.
**Passing:** API rejects the direct write. Status is always derived.
**Failing:** Status field can be set directly, bypassing derivation.
**Severity:** Medium

---

## 7. API Contract

**Contract file:** `references/api-routes.md`
**Total endpoints:** 13 (as of last audit — verify current count in reference file)

**Ghost validates per endpoint:**
- Endpoint exists and responds
- Request schema matches the contract (field names, types, required vs optional)
- Response schema matches the contract
- Auth requirement is enforced
- Error responses match the defined error format: `{ error, field?, code }`

**Endpoints with special handling:**
- `POST /api/draft` — verify no DB write occurs (approval gate)
- `POST /api/draft/approve` — verify DB write occurs here and only here
- Any endpoint touching warmth — verify no inline formula

---

## 8. Environment Variables

Ghost confirms env vars are loaded by verifying that service-dependent endpoints respond.
Ghost does not read env var values directly.

| Variable | Confirmed Via |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Any Supabase-dependent endpoint responds |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side Supabase reads work |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase writes work |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth UI renders |
| `CLERK_SECRET_KEY` | Clerk webhook verification works |
| `ANTHROPIC_API_KEY` | POST /api/draft returns a generated draft |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry captures at least one test error |

---

## 9. Code Review Checklist — Mode 1 Additions

Project-specific rules Ghost checks during code review, in addition to the universal protocol in `agents/ghost.md`:

- [ ] No direct Supabase calls from `'use client'` components — all go through API routes
- [ ] No warmth formula calculation outside `lib/warmth/formula.ts`
- [ ] No `middleware.ts` — Next.js 16 uses `proxy.ts`
- [ ] All new Supabase tables have RLS enabled and policies present in the migration
- [ ] No `.env` file committed — `.gitignore` covers it
- [ ] All new API routes have Clerk auth middleware on protected endpoints
- [ ] Env vars referenced by name only — no hardcoded values
- [ ] No auto-send logic anywhere in the feature

---

## 10. Pass Conditions

Ghost issues CLEAR TO SHIP only when every item below is true.

**Mode 1 — Code Review:**
- [ ] Universal code review protocol passed (agents/ghost.md)
- [ ] All items in Section 9 checklist passed
- [ ] All 7 non-negotiable rules verified clean (Section 2)

**Mode 2 — Live Testing:**
- [ ] All external services in Section 3 passed
- [ ] All auth tests in Section 4 passed
- [ ] All database and security tests in Section 5 passed
- [ ] All critical business logic checks in Section 6 passed
- [ ] API contract validation in Section 7 passed
- [ ] All environment variables in Section 8 confirmed loaded
- [ ] All 7 non-negotiable rules verified in live environment (Section 2)

Ghost issues CONDITIONAL SHIP if non-critical items are outstanding and the human has reviewed them.
Ghost issues HOLD if any Critical or High severity item fails.

---

## 11. Bug ID Format

`BUG-GMW-###-NNN`

`###` = task ID, `NNN` = sequential bug number within that task.
Example: `BUG-GMW-007-001`, `BUG-GMW-007-002`

---

*Equal Point — equal-point-spec.md v1.0*
*Loaded by Ghost alongside verification/SKILL.md. Read-only.*
*Maintained by human. Update when non-negotiable rules change.*
