# SKILL: spec-to-plan
## God Made Weapon — Orchestrator Playbook
### Loaded by: Orchestrator
### Triggered when: A new task arrives without an approved PLAN.md

> The plan is the contract. Nothing activates until it is approved.

---

## When to Load

Load when: TASK.md has content but no approved PLAN.md exists, or the human has significantly changed scope.
Skip if PLAN.md is already marked APPROVED — read it and resume from the last incomplete step.

---

## Step 1: Parse the Task

Read `docs/TASK.md` in full. Extract:

```
TASK_TITLE:
TASK_DESCRIPTION:
DEFINITION_OF_DONE: [if stated]
CONSTRAINTS: [if stated]
OPEN_QUESTIONS: [if any]
```

Three checks before proceeding:
1. Specific enough to plan? (Can you answer: what will exist or work differently when done?) If no → Step 1A.
2. Definition of done stated? If no → construct one in Step 3 and confirm at approval.
3. Open questions that block planning? Resolvable on your own: stack defaults, agent assignment, step ordering. Requires human: product decisions, ambiguous scope, two valid paths with different outcomes.

---

## Step 1A: Clarification Protocol

```
## Orchestrator — Clarification Needed
**Task ID:** GMW-###

**What I have:** [what is clear]
**What I need:**
1. [question — one per line, max 5, prioritize blockers]
**What I will decide on my own:** [assumptions with defaults from AGENTS.md]
```

Wait for response. Update extracted fields. Proceed to Step 1.5.

---

## Step 1.5: Experience Gate

**Skip if:** backend-only, infrastructure, QA, hotfix, or deploy task. Proceed directly to Step 2.

**Run if:** the task produces anything a user sees, touches, or moves through.

Confirm answers exist for all four before writing any plan steps:

```
EG-1. What is the user trying to do? [job to be done — one sentence]
EG-2. What are the screens, states, and flows? [every screen, every state, entry to completion]
EG-3. What are the permissions? [who can see it, who can act, what happens without permission]
EG-4. What is the "done" moment? [the felt experience of success — not a technical condition]
```

If all four answered in TASK.md or CONTEXT.md: record answers, proceed to Step 2.

If any unanswered:

```
## Orchestrator — Experience Gate
**Task ID:** GMW-###

**What I have:** [summary]
**What I need:** [only the unanswered EG questions]

I will not write plan steps until these are answered.
```

Wait. Then proceed to Step 2.

**Prototype flag.** After the four questions are answered, record:

```
PROTOTYPE_REQUIRED: Yes / No
PROTOTYPE_REASON: [one sentence]
```

Prototype required when: new screen or flow not built before, UX pattern unclear, new interaction model, reasonable uncertainty about feel.
Prototype not required when: extending an existing pattern, backend-only, bug fix on understood flow.

If `PROTOTYPE_REQUIRED: Yes`, activation order is locked:
```
Aniya Fronte (prototype, mock data) → Human approves → Kennis Beck (contract from screens) → Aniya Fronte (wire) → Brianna Ops → Ghost
```
Kennis Beck never activates before the human approves the prototype. The contract is derived from the screens.

---

## Step 2: Classify the Task

| Classification | Criteria | Activation Order |
|---|---|---|
| **Experience-First Build** | New screen/flow, prototype required | Aniya Fronte (proto) → Human → Kennis Beck → Aniya Fronte (wire) → Brianna Ops → Ghost |
| **Feature Build** | New functionality, UX pattern understood | Aniya Fronte → Kennis Beck → Brianna Ops → Ghost |
| **Frontend Only** | UI change, no backend impact | Aniya Fronte → Ghost |
| **Backend Only** | API/data change, no UI impact | Kennis Beck → Ghost |
| **Deploy Only** | Existing code needs to ship | Brianna Ops → Ghost |
| **Bug Fix** | Known defect | [Owner] → Ghost (regression) |
| **Hotfix** | Critical production issue | [Owner] → Ghost (smoke) → Brianna Ops |
| **Code Review** | Evaluation, not new work | [Owner] → Ghost |
| **QA Only** | Testing only | Ghost |
| **Full Audit** | All layers | Aniya Fronte → Kennis Beck → Brianna Ops → Ghost |

Rules: prototype required → always Experience-First Build. Unsure → Experience-First (a prototype costs less than a rework). Single domain → skip uninvolved agents.

```
CLASSIFICATION:
PROTOTYPE_REQUIRED: Yes / No
ACTIVATION_ORDER:
CLASSIFICATION_REASON: [one sentence]
```

---

## Step 3: Definition of Done

Use the human's definition exactly if provided. If not, construct using these questions:
- What can the user do after this ships that they could not before?
- What does a passing Ghost test look like?
- Are there performance, accessibility, or security requirements?

```
DEFINITION_OF_DONE:
- [ ] [binary condition]
- [ ] [binary condition]
```

---

## Step 4: Risk Scan

Flag before writing steps:
- Touches auth, payments, or user data?
- Depends on a third-party API?
- Requires a database migration?
- Changes an existing public API contract?
- Any step with two valid technical paths with meaningfully different consequences?

```
RISKS:
- [description] — Severity: High/Medium/Low — Owner: [agent]

PRE-PLAN DECISIONS NEEDED:
- [decision] — Options: A vs B — Recommended: [A/B] — Reason: [one sentence]
```

Unresolvable fork without a recommendation → surface to human before writing steps.

---

## Step 5: Write Plan Steps

Each step must have exactly one owner, be specific enough to execute, be ordered by dependency, and be scoped to what is in the task.

```
Step [N]: [what gets done]
Owner: [Agent]
Depends on: [Step N or nothing]
Produces: [concrete output]
Done when: [binary condition]
```

Ordering: Experience Gate resolved → prototype (if required) → human approval (if prototype) → contract → implementation → infrastructure → Ghost.

---

## Step 6: Write PLAN.md

```markdown
# PLAN.md
## Task: GMW-### — [Title]
**Status:** PENDING APPROVAL
**Classification:** [Step 2]
**Prototype Required:** Yes / No
**Activation Order:** [Step 2]
**Created:** [marker]

## Task Summary
[2-3 sentences for an agent who has not read TASK.md]

## Definition of Done
- [ ] [condition]

## Risks
| Risk | Severity | Owner |
|---|---|---|

## Pre-Plan Decisions Made
| Decision | Choice | Reason |
|---|---|---|

---

## Implementation Steps

### Step 1: [Title]
**Owner:** [Agent]
**Depends on:** Nothing
**Produces:** [output]
**Done when:** [binary condition]

---

[continue for all steps]

---

## Future Tasks Identified
[GMW-FUTURE-N: description]

## Open Questions Remaining
[must be answered before relevant step begins]

---

## Human Approval
**Approved by:**
**Status:** PENDING APPROVAL
[ ] Steps, scope, and definition of done are correct. Proceed.
[Notes:]
```

---

## Step 7: Present for Approval

```
## Orchestrator — Plan Ready for Approval
**Task ID:** GMW-###

Confirm:
1. Task summary reflects what you want built
2. Definition of done matches your success criteria
3. Steps are in the right order, nothing missing
4. Scope is correct

Approve: "Approved" or "Approved — [notes]"
Request changes: tell me what to change — I will revise and re-present.
Add scope: tell me what to add — activation order may change.

Plan at: docs/PLAN.md. I will not activate until you approve.
```

Wait. Do not proceed.

---

## Step 8: Handle Approval Response

**Approved:** mark PLAN.md APPROVED, create branch `gmw-###-short-description` from `main`, activate first agent.
**Changes requested:** revise PLAN.md, return to Step 7.
**Scope added:** add steps in dependency order, re-classify if needed, return to Step 7.
**Major change:** restart from Step 1 with new direction.

---

## Step 9: Git Branch Setup

```
Branch: gmw-###-[short-description] from main
```

- [ ] Branch created from correct base
- [ ] Branch name follows GMW convention
- [ ] Working directory clean
- [ ] First agent's context includes branch name

Branch fails → stopping condition before any agent activates.

---

## Pre-Activation Checklist

- [ ] PLAN.md marked APPROVED
- [ ] Every step has one owner and a binary "Done when"
- [ ] All pre-plan decisions documented
- [ ] All risks documented with owners
- [ ] Git branch exists and is clean
- [ ] First agent harness includes: task ID, plan summary, their step, session context

---

*God Made Weapon — spec-to-plan SKILL.md v1.2 — trimmed*
*Loaded by the Orchestrator. Read-only.*
