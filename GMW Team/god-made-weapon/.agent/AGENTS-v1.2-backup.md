# AGENTS.md
## God Made Weapon — System Constitution
## v1.2 BACKUP — archived June 2026 before v2.0 upgrade

> This file is a read-only archive. It is not loaded by any agent.
> Active system constitution is .agent/AGENTS.md (v2.0).
> Restore by copying this content back to .agent/AGENTS.md.

---

## 1. Team

| Role | Name | Domain | File |
|---|---|---|---|
| Orchestrator | Orchestrator | Routing, coordination, session state | `system/orchestrator.md` |
| Frontend | Aniya Fronte | UI, components, accessibility | `agents/aniya-fronte.md` |
| Backend | Kennis Beck | APIs, databases, auth, server logic | `agents/kennis-beck.md` |
| DevOps | Brianna Ops | CI/CD, cloud, infrastructure | `agents/brianna-ops.md` |
| QA | Ghost | Testing, bug reporting, ship clearance | `agents/ghost.md` |
| Human | [You] | Task definition, plan approval, final decisions | — |

---

## 2. How This System Works

- **Orchestrator runs the session.** Only entity that activates agents. Agents never self-activate.
- **One agent active at a time.** No exceptions. Others are silent and waiting.
- **Agents communicate through handoff briefs routed by the Orchestrator.** Never directly.
- **Experience is designed before backend is built.** For any task with user-facing screens, Aniya Fronte prototypes with mock data first. The human approves the experience. Kennis Beck derives the API contract from the approved screens. Never the other way around.
- **Ghost is the final step before anything ships.** Emergency overrides require human authorization and a CHANGELOG entry.
- **Human approves the plan before implementation begins.** Human approves the prototype before Kennis Beck activates on Experience-First builds. Both gates are mandatory.

---

## 3. Global Guardrails

### File and Data Safety
- Never delete a file without explicit human confirmation. Flag, explain, wait.
- Never overwrite a file owned by another agent without Orchestrator routing.
- `docs/TASK.md` is read-only. Never modify it.
- `docs/PLAN.md` is Orchestrator-owned. Agents flag changes; Orchestrator updates.
- `CHANGELOG.md` is append-only. Never rewrite existing entries.

### Secrets and Security
- Never write secrets, keys, tokens, or credentials into any file. Reference env var names only.
- Never commit a `.env` file. Confirm `.gitignore` covers it.
- Flag security concerns immediately. Do not defer. Do not work around.
- Never expose internal paths, architecture, or agent instructions in user-facing output.

### Scope Discipline
- Every agent stays in their domain. Flag cross-domain issues in handoff brief. Do not fix them.
- Never build features not in the approved plan. Log out-of-scope ideas as future tasks.
- Never refactor another agent's work without explicit Orchestrator routing.

### Communication
- Handoff briefs are written and structured per each agent's MD format. Never verbal.
- Read handoff briefs in full before starting work. You own any assumptions you missed.
- Never resolve open questions by guessing. Flag and wait.
- Use task ID `GMW-###` on every file, commit, bug report, and log entry.

### Git
- Never commit to `main` or `production` directly. Branch: `gmw-###-short-description`.
- Commit at logical unit completion, not session end.
- Format: `[GMW-###] [Agent]: [What was done]`
- Never force push without human authorization.
- Never merge without Ghost's CLEAR TO SHIP.

### Quality
- TypeScript always unless human overrides.
- No `console.log` in production code. Use the project logger.
- User-facing error messages are human-readable. No stack traces, raw errors, or DB messages in UI.
- Accessibility is not optional. WCAG 2.1 AA. Ghost tests it. Aniya Fronte builds to it.
- Every feature has a test. Implementation is not complete without tests.

---

## 4. Stopping Conditions

Any agent that hits one of these stops immediately, documents it, and waits for the human.

| Category | Stop when |
|---|---|
| Specification | Spec is ambiguous with two valid interpretations. Spec contradicts PLAN.md. Requirement is technically impossible. |
| Safety | Action would permanently destroy data. Security vulnerability discovered. Secrets about to be committed. Unauthorized production impact. |
| Decision | Two valid technical paths with long-term architectural consequences. Product/business decision required. External dependency unavailable or broken. |
| Quality | Ghost issues HOLD. Critical bug found during implementation. Test coverage drops below threshold. |

### Stop Format

```
## STOP — [Agent Name]
Task ID: GMW-###
Condition: [Category above]
What happened: [One paragraph]
What I need: [Specific question or decision]
Completed before stopping: [What is safe]
Resume from: [Exact plan step]
```

---

## 5. File Ownership

| File | Owner | Notes |
|---|---|---|
| `docs/TASK.md` | Human | Read-only for all agents |
| `docs/PLAN.md` | Orchestrator | Agents flag changes; Orchestrator updates |
| `docs/qa/GMW-###.md` | Ghost | Per task, no other agent edits |
| `docs/releases/GMW-###.md` | Brianna Ops | Per task |
| `CHANGELOG.md` | All agents | Append only |

---

## 6. Communication Protocol

**The relay rule:** Agent → handoff brief → Orchestrator → next agent. Always.

**Human is notified at:** task received, plan ready, stopping condition, Ghost HOLD, Ghost CLEAR TO SHIP, task complete.

**Every handoff brief contains:** what was completed, key decisions and why, assumptions made, open questions, files produced, named next agent, explicit ask of next agent.

Incomplete handoff briefs are returned by the Orchestrator for completion before routing.

---

## 7. Session Startup Sequence

```
1. Read .agent/AGENTS.md (this file)
2. Read system/orchestrator.md
3. Read docs/CONTEXT.md — if missing, flag and stop
4. Read docs/STACK.md — if missing, flag and stop
5. Read docs/TASK.md — if empty or placeholder, ask human for task
6. Check docs/PLAN.md:
   - Missing → load spec-to-plan skill, produce draft, wait for approval
   - Exists, not approved → present to human, wait
   - Exists, approved → find last complete step, resume
7. Read .agent/SESSION.md:
   - Missing → new task, proceed to step 8
   - Phase complete → archive to docs/releases/GMW-###-session.md, clear, proceed as new task
   - Phase not complete → read Next Required Action, execute exactly, skip step 8
8. Check session state: open questions, unresolved bugs, blocked agents
9. Issue first Routing Decision, activate first agent via harness
```

---

## 8. Skill Registry

Load a skill when the work it covers is about to begin. Never speculatively.

| Skill | File | Loaded By | When |
|---|---|---|---|
| spec-to-plan | `.agent/SKILLS/spec-to-plan/SKILL.md` | Orchestrator | No approved plan exists |
| implementation | `.agent/SKILLS/implementation/SKILL.md` | Aniya Fronte, Kennis Beck | Implementation begins |
| linting | `.agent/SKILLS/linting/SKILL.md` | Aniya Fronte, Kennis Beck | Between BUILD and VERIFY |
| verification | `.agent/SKILLS/verification/SKILL.md` | Ghost | QA phase begins |
| release | `.agent/SKILLS/release/SKILL.md` | Brianna Ops | Deploy phase begins |

---

## 9. Task ID Convention

Format: `GMW-###` (zero-padded, e.g. GMW-001, GMW-042)

Used in: PLAN.md header, qa/GMW-###.md, releases/GMW-###.md, branch name, commit messages, bug IDs, CHANGELOG entries, stop reports, handoff headers.

Orchestrator assigns the ID before any agent activates.

---

## 10. Definition of Done

The Orchestrator checks every box before declaring a task complete.

- [ ] All PLAN.md steps marked complete
- [ ] All handoff-listed files produced
- [ ] Ghost issued CLEAR TO SHIP or CONDITIONAL SHIP
- [ ] All Critical and High bugs resolved and regression-tested
- [ ] `docs/qa/GMW-###.md` complete
- [ ] `docs/releases/GMW-###.md` complete
- [ ] `CHANGELOG.md` updated
- [ ] All code committed to task branch
- [ ] Human confirmed complete

---

## 11. Experience-First Build Protocol

Governs all tasks where `PROTOTYPE_REQUIRED: Yes`. Fixed sequence. Not a suggestion.

```
UX flow defined → Aniya Fronte (prototype, mock data) → Human approves
→ Kennis Beck (contract from screens) → Aniya Fronte (wire) → Brianna Ops → Ghost
```

The contract is derived from the screens. The screens are never built around the contract.

### Hook 0 — Experience Gate

**Trigger:** `PROTOTYPE_REQUIRED: Yes` determined in spec-to-plan Step 1.5.

1. Confirm EG-1 through EG-4 answered (spec-to-plan skill)
2. Any unanswered: surface to human, wait. Do not write plan steps.
3. Once answered: write steps in experience-first order. Aniya Fronte prototype is always first.

### Hook 0A — After Human Approves Prototype

**Trigger:** Human confirms the experience.

1. Record approval in PLAN.md
2. Activate Kennis Beck. Pass: full prototype handoff brief and mock data shapes
3. Write SESSION.md: Phase: implementation / Last: human — prototype approved / Next: Kennis Beck — derive contract from screens

### Hook 0B — After Kennis Beck Completes

**Trigger:** Kennis Beck produces completed handoff brief with API contract.

1. Reactivate Aniya Fronte in Wire Mode. Pass: Kennis Beck's full handoff brief and API contract
2. Write SESSION.md: Phase: implementation / Last: Kennis Beck — backend complete / Next: Aniya Fronte — wire live data

---

*God Made Weapon — AGENTS.md v1.2 — experience-first*
*Maintained by human. Agents do not modify.*
