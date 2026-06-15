# SKILL: verification
## God Made Weapon — QA Playbook
### Loaded by: Ghost
### Triggered when: QA phase begins on completed implementation work

> Ghost does not build. Ghost does not fix. Ghost finds what everyone else missed and documents it precisely.
> Every assumption an agent made is a test target. Test those first.

---

## When to Load

Load when: Brianna Ops has handed off, QA-only task, regression pass after bug fix, code review with coverage evaluation.
Do not load if: nothing has been implemented (tell Orchestrator), or you are being asked to fix a bug (flag and wait).

---

## Step 0: Read Before Testing

Read in full before running a single test:
1. `.agent/AGENTS.md`
2. `agents/ghost.md`
3. `docs/TASK.md` and `docs/PLAN.md`
4. Every handoff brief in the activation context — in order

Extract from each handoff brief:
- What was built
- **Assumptions made** → these are test targets
- **Open questions left** → these are test targets
- Files produced (verify they exist and work)

List all assumption and question targets before building the test plan:
```
[Agent] assumed: [assumption] → Test: [how to validate/invalidate]
[Agent] left open: [question] → Test: [how to surface if it caused a problem]
```

---

## Step 1: Test Plan

Create `docs/qa/GMW-###.md` before running any test.

```markdown
# QA Report — GMW-###
## Task: [title] | Activation: Full / Regression / Smoke | Environment: Local / Staging / Production

## Test Plan
### Scope: [components, endpoints, flows in scope — and why anything is out of scope]
### Assumption/Question Targets
| Source | Assumption or Question | Test Approach |
|---|---|---|
### Known Risks
| Risk | Severity | Test Approach |
|---|---|---|
```

---

## Step 2: Test Execution Order

Test in this order. Blast radius determines priority.

### 1. Authentication and Authorization — test first, always

- Unauthenticated users cannot reach protected routes or data
- Authenticated users cannot access another user's resources (test with manipulated IDs)
- Session expiration is handled gracefully, not broken
- Login/logout/token refresh work end to end
- Brute force behavior: what happens with repeated auth calls?
- Manipulated or expired JWT: what does the system return?

### 2. Data Integrity

- Create: saves correctly, API response matches sent data, UI reflects without refresh
- Read: displays exactly as stored, empty state handled, no stale data after update
- Update: saves correctly, partial updates do not corrupt other fields
- Delete: disappears from UI, returns 404 from API, cascades handled correctly
- Cross-entity: related counts and relationships stay consistent, no orphaned records

### 3. Error States

| Scenario | Expected |
|---|---|
| 400 Bad Request | Field-level error message, not generic |
| 401 Unauthorized | Redirect to login or clear message |
| 403 Forbidden | Clear "no permission" message |
| 404 Not Found | Helpful not-found state, not blank page |
| 500 Server Error | Generic "something went wrong", no stack trace |
| Network failure | Clear offline or retry state |
| Form with errors | Does not navigate away, does not clear valid fields |
| Double submit | Handled — no duplicate records |
| Timeout | User sees feedback, not a hung UI |

### 4. Edge Cases

Inputs to test on every form field and API parameter:
- Empty string, whitespace-only, max length, one over max length
- Special characters: `< > & " ' / \ ; : ( ) { } [ ]`
- Unicode, emoji, right-to-left text
- SQL injection: `'; DROP TABLE users; --`
- XSS: `<script>alert('xss')</script>` and `<img src=x onerror=alert('xss')>`
- Negative numbers, zero, non-numeric in numeric fields

State edge cases:
- Back button after form submit
- Page refresh mid-flow
- Same feature open in two tabs
- Slow connection (throttle to 3G)
- Empty dataset, extremely large dataset

### 5. Happy Path

Walk the exact flow from the task's definition of done. Every step documented.
If the happy path fails: file a Critical bug and continue the full QA pass.

### 6. Accessibility

- All interactive elements reachable by Tab in logical order
- Focus visible on all interactive elements
- Modal dialogs trap focus, release on close
- All images have alt text or `aria-hidden="true"` if decorative
- Form inputs have associated labels (not just placeholder)
- Error messages announced to screen readers
- Text contrast: 4.5:1 body, 3:1 large text and UI components
- No information conveyed by color alone
- Readable at 200% zoom without horizontal scroll
- Touch targets: minimum 44x44px

### 7. Security Surface

```
SQL injection: ' OR '1'='1    and    '; DROP TABLE users; --
XSS:          <script>alert('xss')</script>
              <img src=x onerror=alert('xss')>
Path:         ../../../etc/passwd
```

Expected: all rejected with validation error, no execution, no raw error exposure.

Authorization: for every protected resource, test as unauthenticated (expect 401), as wrong user (expect 403/404), as correct user (expect 200). Modify the resource ID in the URL. Same expectations.

API: no sensitive data in URL params, no internal info in error responses, CORS locked to expected origins, rate limiting on auth endpoints.

### 8. API Contract Validation

Use Postman or a REST client — independent of the frontend. For every endpoint:
- Path exists at documented URL
- Request shape accepted as documented
- Response shape matches documented contract exactly (field names, types, nesting)
- Error codes match documented codes
- Optional fields behave as documented

Mismatch in implementation: Kennis Beck bug. Mismatch in docs only: documentation bug. Both get filed.

### 9. Environment Validation

- All env vars set in deployment environment
- No `localhost` URLs in deployed build
- SSL active, certificate valid
- CORS allows deployed frontend origin
- No debug mode, verbose logging, or dev flags in production
- Assets, CDN, and file storage paths resolve correctly

### 10. Performance (flag, do not block)

Flag as Medium: page load over 3s, API response over 500ms reads / 1000ms writes, new page adds over 200KB JS, unoptimized images, visible layout shift.
Flag as High only if the feature is unusable due to performance.

### 11. Cross-Browser

Test in: Chrome, Firefox, Safari, Edge (desktop); iOS Safari, Android Chrome (mobile).
Check: layout renders correctly, interactive elements work, forms submit, no browser-specific console errors, fonts and images load.

---

## Step 3: Severity Definitions

| Severity | Definition |
|---|---|
| Critical | Feature completely unusable. Data loss or security breach possible. Blocks ship. |
| High | Core functionality broken. Workaround is impossible or very difficult. Blocks ship. |
| Medium | Functionality degraded or incomplete. Workaround exists. Does not block ship. |
| Low | Cosmetic or minor edge case. Minimal user impact. Tracked but does not block. |

---

## Step 4: Bug Report Format

```
[BUG-GMW-###-NNN] | Severity: Critical / High / Medium / Low
Component: Aniya Fronte / Kennis Beck / Brianna Ops
Environment: Local / Staging / Production | Browser/Device: [if applicable]

Steps to Reproduce:
1. [exact]
2. [exact]
3. [exact]

Expected: [what should happen]
Actual: [what actually happens — exact error or behavior]
Notes: [logs, screenshots, suggested fix if obvious, related assumption this broke]
```

Bug ID: `BUG-GMW-###-NNN` (task ID + sequential from 001)

Bug routing:
- UI, components, styling, accessibility, frontend routing → Aniya Fronte
- API, database, business logic, validation, auth → Kennis Beck
- CI/CD, environment config, CORS, SSL, CDN → Brianna Ops

---

## Step 5: Regression Pass

Scope: the fixed bug + adjacent functionality only. Not a full pass.

```markdown
## Regression Pass — [Bug ID(s)] — [session marker]
### Fix Verified
| Bug ID | What was tested | Result |
|---|---|---|
### Adjacent Tests
| What was tested | Result | Notes |
|---|---|---|
### New Bugs Found: [bug reports if any]
### Ship Recommendation: [ ] CLEAR  [ ] HOLD  [ ] CONDITIONAL
```

---

## Step 6: Smoke Test

For hotfixes only. Three checks, under 15 minutes:
1. The specific fix is no longer reproducible
2. Primary user flows still work (auth, primary action, data display)
3. System is reachable, API responds, no 500s on primary routes

---

## Step 7: QA Report

Finalize `docs/qa/GMW-###.md`:

```markdown
# QA Report — GMW-###
## Task: [title] | Activation: [type] | Environment: [env] | Completed: [marker]

## Coverage Summary
[What was tested — components, endpoints, flows, browsers, devices]

## Test Results
| Category | Run | Pass | Fail | Skip |
|---|---|---|---|---|
| Auth | | | | |
| Data integrity | | | | |
| Error states | | | | |
| Edge cases | | | | |
| Happy path | | | | |
| Accessibility | | | | |
| Security | | | | |
| API contract | | | | |
| Environment | | | | |
| Cross-browser | | | | |
| Performance | | | | |
| **Total** | | | | |

## Bug Reports
[All bugs filed in full using Step 4 format]

## Assumption/Question Audit
| Source | Assumption/Question | Tested | Result |
|---|---|---|---|

## What Is Clean
[Specific components, endpoints, and flows verified solid]

## Routing
→ Aniya Fronte: [Bug IDs or None]
→ Kennis Beck: [Bug IDs or None]
→ Brianna Ops: [Bug IDs or None]
→ No action: [Bug IDs or None]

## Ship Recommendation
[ ] CLEAR TO SHIP — no Critical or High bugs
[ ] HOLD — [N] Critical / [N] High must be resolved. Bug IDs: [list]
[ ] CONDITIONAL SHIP — no Critical, accepted risk. Condition: [what must be true]

— Ghost, vanishing.
```

---

## What Ghost Never Does

- Fix bugs. Find, file, route. The owning agent fixes.
- Ship work. That is Brianna Ops after CLEAR TO SHIP.
- Skip a bug report. "I'll mention it" is not a report.
- Close a bug without retesting the fix.
- Start testing without reading all handoff briefs first.
- Reduce severity ratings due to time pressure. Critical is Critical.

---

*God Made Weapon — verification SKILL.md v1.1 — trimmed*
*Loaded by Ghost. Read-only.*
