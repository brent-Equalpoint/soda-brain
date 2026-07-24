# Equalpoint Spec — Non-Negotiable Rules
## God Made Weapon | Ghost QA
## This is the single source of truth for both Code Review Agent and Live Testing Agent.
## These rules do not change without a new SODA decision entry.

---

## The Seven Non-Negotiable Rules

Every QA pass — Mode 1 or Mode 2 — reads this file first. A violation of any rule below is a P1 finding. Blocks BTW. Fix before any other work.

---

### Rule 1: No Auto-Send

Draft generation and approval are always two separate calls. They never merge.

- POST /api/draft: generates the draft. Writes nothing to the database. Returns draft text only.
- POST /api/draft/approve: writes the approved draft. Resets warmth. Sends the nudge.

These two calls must never be combined into one. Auto-send is not a feature. It is a violation.

**Grep check:**
```bash
grep -rn "autoSend\|auto_send\|auto-send" src/
```
Any result is P1.

---

### Rule 2: RLS on Every Table

Row Level Security must be enabled on every Supabase table at creation. The migration that creates the table must include its RLS policy in the same migration file. RLS cannot be added "later."

**SQL check:**
```sql
SELECT tablename, rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```
Any table with rls_enabled = false is P1.

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```
Any table with RLS enabled but no policy is P1.

---

### Rule 3: Warmth Formula — One Location

The warmth formula is:
```
max(0, round(base_warmth * e^(-0.01 * days_since_contact)))
```

It lives in src/lib/warmth/formula.ts. It is imported everywhere it is used. It is never reimplemented inline. The decay rate (0.01) is a spec value. Changing it requires a new SODA decision, not a code change.

**Grep check:**
```bash
grep -rn "Math.exp" src/
grep -rn "0\.01" src/
grep -rn "base_warmth" src/
```
Any result outside src/lib/warmth/formula.ts is P1.

---

### Rule 4: Two-Call Gate Intact

POST /api/draft generates. POST /api/draft/approve writes and resets warmth. The draft route handler must contain no database write. The approve handler must not call the draft generator internally.

**Check:**
```bash
cat src/app/api/draft/route.ts
```
No INSERT, UPDATE, or DELETE anywhere in this file. Any write is P1.

---

### Rule 5: Notification Cap Enforced Server-Side

Maximum 1 push notification per connection per 7 days. This cap is enforced in the API layer, not the client. The client does not decide whether to send a notification.

**Grep check:**
```bash
grep -rn "push\|notification\|notify" src/app/api
```
Locate the cap check. It must read from the database last_notified field. It must reject if within 7 days. Any cap logic missing or client-side is P1.

---

### Rule 6: Secrets from Environment Only

No secret values — API keys, database URLs, service role keys, JWT secrets — are committed to the codebase. All secrets are read from process.env. No hardcoded strings. No .env files committed.

**Check:**
```bash
grep -rn "SUPABASE_SERVICE_ROLE_KEY\|SUPABASE_URL\|ANTHROPIC_API_KEY" src/
grep -rn "sk-ant-\|eyJ" src/
```
Any literal credential anywhere in src/ is P1.

---

### Rule 7: Status Field Is Derived, Never Source of Truth

The connection status field (warmth tier label) is computed from the warmth score. It is cached for display performance. It is never written directly as the primary record of a connection's state. The warmth score is the source of truth.

**Check:**
```bash
grep -rn "status.*=.*['\"]" src/app/api
grep -rn "UPDATE.*status" src/
```
Any direct status write that does not accompany a warmth score recalculation is P1.

---

### Rule 8: Pre-Authorization Gate on Code Issuance

Any flow that sends a code, link, or credential to a user must first verify the user is authorized. This check must:
- Run server-side, before any OTP is generated
- Use the service role key, never the anon key
- Return an identical response for authorized and unauthorized paths (neutral response)
- Never expose the authorized list to the client

**Grep check:**
```bash
grep -rn "sendCode\|send_code\|generateOTP\|generate_otp\|createOTP" src/app/api
```
For each result: trace upward to confirm an authorized list check precedes it. Any code issuance without a prior server-side authorization check is P1.

The authorized list table must have RLS set to service role only. Cipher verifies this on every auth ticket.

---

### Rule 9: ChipCategory Enum — Five Values Only

The ChipCategory enum has exactly five values:

```
professional | interest | location | goal | identity
```

No sixth value may be added without a formal spec change and Brent approval. This is a data model boundary. It affects the research schema, the pipeline contract, and every downstream analysis that segments by category.

**Grep check:**
```bash
grep -rn "ChipCategory\|chip_category" src/
```
Any ChipCategory value outside the five above is P1. Any inline string comparison that introduces an unlisted category is P1.

---

## Additional Design Rules (P1 on violation)

### Private Nudge
The nudge is recipient-only. RLS enforces this. No API route returns another user's draft or approved nudge content.

### Master Key Logging
Every operator reach into an event writes to operator_access_log. No operator action is unlogged.

### Discard Signal Logging
A dismissed draft writes to draft_feedback. Discard signals are never silently dropped.

### Session Continuity
No session is dropped mid-event. If a session error occurs, the reconnection path is automatic. Ghost tests this in F3.

---

## When a Rule Must Change

These rules do not change through code changes. They change through a new entry in SODA DECISIONS.md. The decision must be reviewed and signed before any code implementing the change is written.

Ghost flags any implementation contradicting a rule without a corresponding SODA decision as P1, regardless of who wrote the code or when.
