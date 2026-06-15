# SKILL: implementation
## God Made Weapon — Builder Playbook
### Loaded by: Aniya Fronte, Kennis Beck
### Triggered when: Implementation phase begins on an approved plan

---

## When to Load

Load when activated with an approved PLAN.md, resuming a task, or fixing a Ghost-returned bug.
Do not load without an approved plan. Stop and tell the Orchestrator.

---

## Step 0: Orient

Read in order before touching any code:
1. `.agent/AGENTS.md` (if not already read this session)
2. Your own agent MD
3. `docs/PLAN.md` — extract your steps and their dependencies
4. All prior handoff briefs in your activation context

Extract from handoff briefs:
- What was built
- Decisions that affect your work
- What they need from you
- Open questions you inherited

If a dependency is not marked `[x]` complete in PLAN.md: do not begin that step. Blocker format in Section 5.
If a handoff brief is vague: flag to Orchestrator before proceeding.

---

## Step 1: The Work Loop

```
READ step → PLAN smallest unit → BUILD → LINT → VERIFY → COMMIT → UPDATE PLAN.md → repeat
```

**Smallest unit:** one component, one endpoint, one migration, one test. Not the whole step.
Small units catch broken assumptions early. At unit 8 it costs hours. At unit 1 it costs minutes.

**Never:**
- Skip LINT or VERIFY because you feel confident
- Batch multiple units into one commit
- Mark a step complete before every unit is built, linted, verified, and committed
- Build anything outside your assigned steps — log out-of-scope ideas as Future Tasks

---

## Step 2: Verification

Before committing, answer these questions. If any is no: fix it first.

### Aniya Fronte

1. Does it render correctly in all states? (default, loading, error, empty, success)
2. Do all interactive elements work with keyboard and meet WCAG 2.1 AA contrast?
3. Does the layout hold at 375px, 768px, and 1280px with no overflow?
4. Does every API call handle loading, error, and empty states?
5. Do all tests pass? No `console.log`. No untyped `any`. Component under 200 lines.

### Kennis Beck

1. Does the endpoint return the correct shape on valid input and correct errors on invalid?
2. Does it reject unauthenticated requests? Are all inputs validated before hitting the DB?
3. Are database writes correct? No N+1 queries? Indexes on filtered fields?
4. Are all error paths structured? No stack traces or DB errors in API responses?
5. Do all tests pass? No `console.log`. No untyped `any`. No secrets in any file.

### API Contract Alignment (both agents)

If the request or response shape does not match the documented contract: do not adapt silently.
Use the cross-domain flag in Section 6.

---

## Step 3: Commit Protocol

Commit at the completion of every verified, lint-clean unit.

**Format:** `[GMW-###] [Agent Name]: [What was built — specific, active voice]`

Examples:
```
[GMW-012] Aniya Fronte: Add UserAvatar component with upload and error states
[GMW-012] Kennis Beck: Add POST /api/user/profile with Zod validation
```

**Never commit:**
- `.env` files or secrets
- `node_modules/` or build output
- `console.log` statements
- Failing tests
- Files with lint errors

**Branch:** always `gmw-###-short-description`. Never commit to `main` or `production`.

---

## Step 4: Update PLAN.md

Mark steps complete only when every unit is built, linted, verified, and committed.

```markdown
### Step N: [Title]
**Status:** [x] COMPLETE
**Completed:** [session marker]
```

Partial progress: leave the step unchecked. Add a progress note below it.
Decisions that differ from the plan: add an implementation note inline.
New risks discovered: add to the Risks table immediately.

---

## Step 5: Blocker Protocol

A blocker is anything outside your domain or control that prevents step completion.
Research, debugging your own code, and fixing your own lint errors are not blockers.

```
## BLOCKER — [Agent Name]
Task ID: GMW-###
Step blocked: Step [N] — [Title]
Type: Dependency not ready / Contract mismatch / Human decision needed / External unavailable
What I cannot do: [Specific]
What I need: [Specific ask — from which agent or human]
Completed before blocking: [What is safe]
Can I continue on another step? Yes — Step [N] / No — all steps blocked
```

Surface to Orchestrator immediately. Continue on unblocked steps if any exist.

---

## Step 6: Cross-Domain Flag

You flag it. You do not fix it.

```
## CROSS-DOMAIN FLAG — [Your Name] → [Agent Name]
Task ID: GMW-###
What I found: [Specific issue]
Where: [File, endpoint, component]
How it affects my work: [Impact]
What I need: [Specific ask]
My step status: Pausing / Continuing with workaround — [describe]
```

Surface to Orchestrator. Continue on unaffected steps.

---

## Step 7: CHANGELOG Update

Update at step completion, significant architectural decisions, and self-caught bugs.

```markdown
## [GMW-###] [Title] — [Agent] — [session marker]
### Added / Changed / Fixed / Notes
- [One line per item]
```

Append only. Never edit previous entries.

---

## Step 8: Handoff Preparation

Do not write the handoff brief until every box is checked:

- [ ] All my PLAN.md steps marked `[x] COMPLETE`
- [ ] All units committed, no uncommitted changes
- [ ] Lint clean, TypeScript compiles, all tests passing
- [ ] CHANGELOG updated
- [ ] New env vars documented by name (not value)
- [ ] New dependencies documented with reason
- [ ] Blockers and cross-domain flags resolved or documented
- [ ] Assumptions and out-of-scope items listed

**Handoff brief must contain:** what was built (specific files and names), key decisions and why, assumptions made, open questions, files produced, named next agent, explicit ask, what breaks if the ask is missed.

Test: could the next agent start correctly from only this brief? If no, add what is missing.

---

## Agent Addenda

### Aniya Fronte

#### Prototype Mode (when PROTOTYPE_REQUIRED: Yes)

**Produces:** screens with hardcoded mock data, all states visible (empty, loading simulated, error simulated, success, edge cases), all flows navigable end to end. The human clicks through the full experience before Kennis Beck touches a schema.

**Rules:**
- No API calls. Use hardcoded JSON or `mocks/[feature].ts`.
- Every screen shows every state. No "loading TODO" placeholders.
- Commit: `[GMW-###] Aniya Fronte: Prototype — [feature] with mock data`
- This is not production code. It gets replaced during the wire step.

**Prototype handoff brief — to the human, not Kennis Beck:**

```
## Aniya Fronte — Prototype Complete

### What I Built
[Every screen, state, and flow. Specific and visual.]

### Mock Data Used
[Shape of hardcoded data. This is Kennis Beck's contract input.]

### Experience Questions for Human Review
[UX judgment calls the human should evaluate.]

### What Felt Wrong
[Anything that felt awkward to build or likely to feel awkward to use.]

### What Kennis Beck Will Need
[Data each screen needs, writes that happen, what the API must support.
Not the contract. The input for Kennis Beck to derive the contract from.]

---

## Handoff Brief → Human

**Why:** Prototype ready for experience review.
**What I need:** Approve the experience or direct changes. Kennis Beck does not activate until you approve.

— Aniya Fronte, built.
```

**After approval:** Orchestrator activates Kennis Beck with the prototype handoff brief and mock data shapes as contract input.

**Wire step:** Aniya Fronte reactivates after Kennis Beck completes. Replace mock data with live API calls one component at a time. Verify each before moving to the next. Handle real states. Commit each: `[GMW-###] Aniya Fronte: Wire [ComponentName] to live data`

---

#### Standard Mode (when PROTOTYPE_REQUIRED: No)

- One component per file. Named exports. `ComponentName.tsx` + `ComponentName.test.tsx`.
- No inline styles except dynamic values Tailwind cannot express.
- State: `useState` first. Zustand only when two or more components need it. No prop drilling beyond two levels.
- Never call an undocumented API endpoint. All calls through typed fetch wrapper or React Query.
- `React.memo` only with demonstrated performance problem. Use `next/image` for content images.

### Kennis Beck

- **Contract derived from approved screens when PROTOTYPE_REQUIRED: Yes.** Read Aniya Fronte's prototype handoff brief and mock data shapes before writing a schema. The screens define what the API needs, not the other way around.
- Define full API contract in a comment block at the top of the route file before writing implementation.
- Every migration includes the down migration. Destructive migrations require human approval (stopping condition).
- Index naming: `idx_[table]_[column(s)]`. Every foreign key has an explicit `ON DELETE` behavior.
- Validate at the boundary. Zod schemas in `schemas/`. Errors return `{ error, field?, code }`.
- Every protected endpoint has middleware. Auth middleware tested independently.
- Every new env var in `.env.example` with a placeholder value and description comment.

---

*God Made Weapon — implementation SKILL.md v1.1 — trimmed*
*Loaded by Aniya Fronte and Kennis Beck. Read-only.*
