# CHANGELOG
## God Made Weapon — Agentic Dev Team

> Append only. Never edit a previous entry.
> Format: [GMW-###] or [SYSTEM] · Agent or Human · Session marker
> Every meaningful change to the system or to a project task is logged here.

---

## [SYSTEM] Initial System Build — Human + Orchestrator — May 2026

### Added

**Agent Identities**
- `agents/aniya-fronte.md` — Frontend Engineer. Identity, domain, rules of engagement, output format, handoff protocol, stack defaults.
- `agents/kennis-beck.md` — Backend Engineer. Identity, domain, rules of engagement, output format, handoff protocol, stack defaults.
- `agents/brianna-ops.md` — DevOps Engineer. Identity, domain, rules of engagement, output format, handoff protocol, stack defaults.
- `agents/ghost.md` — QA Specialist. Identity, domain, rules of engagement, output format, handoff protocol, test priority order.

**System Files**
- `system/orchestrator.md` — Smart routing brain. Task classification, activation order logic, bug routing, session state tracking, routing decision format.
- `system/harness.md` — Execution wrapper. Agent activation format, harness rules, phase templates (Feature Build, Code Review, Debug, QA Only, Hotfix, Deploy Only), example activation.

**Constitution**
- `.agent/AGENTS.md` (299 lines) — System constitution. Team declaration, how the system works, global guardrails (file safety, secrets, scope discipline, communication, Git, quality), stopping conditions, file ownership, communication protocol, session startup sequence, skill registry, task ID convention (GMW-###), definition of done.

**Skills**
- `.agent/SKILLS/spec-to-plan/SKILL.md` (398 lines) — Orchestrator's planning playbook. Task parsing, clarification protocol, task classification, definition of done construction, risk scanning, plan step writing, PLAN.md template, approval gate, approval response handling, Git branch setup, pre-activation quality checks.
- `.agent/SKILLS/implementation/SKILL.md` (574 lines) — Builder playbook for Aniya Fronte and Kennis Beck. Orientation sequence, work loop, frontend and backend verification checklists, API contract alignment check, commit protocol, PLAN.md update rules, blocker protocol, cross-domain flagging, CHANGELOG update standards, handoff preparation checklist. Agent-specific addenda for component structure, styling, state, API consumption (Aniya Fronte) and API design, database, validation, auth, environment variables (Kennis Beck).
- `.agent/SKILLS/verification/SKILL.md` (646 lines) — Ghost's QA field manual. Pre-test read protocol, assumption and question targeting, test plan construction, seven-priority test execution order (auth, data integrity, error states, edge cases, happy path, accessibility, performance), security surface testing, cross-browser and cross-device testing, API contract validation, environment validation, bug reporting format and severity definitions, regression pass protocol, smoke test protocol, QA report template.
- `.agent/SKILLS/release/SKILL.md` (701 lines) — Brianna Ops's deployment playbook. Pre-deployment gate and hard stop conditions, pre-deployment checklist (code, environment, database, infrastructure, communication), rollback plan template (written before every deploy), three-stage deploy sequence (staging, production, 15-minute watch), environment variable management standards, CI/CD pipeline structure with GitHub Actions defaults, monitoring and alerting thresholds, cost documentation format, release document template, CHANGELOG update format, Ghost handoff format.

**Project Files**
- `README.md` — Human-facing project overview. Team roster, system components, startup prompt, core principles, complete folder structure.
- `CHANGELOG.md` — This file. Running log of all system and task changes.

### System Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Agent activation model | One agent active at a time | Prevents domain overlap, maintains clean handoff chain |
| Inter-agent communication | Through Orchestrator only | Orchestrator maintains full session state at all times |
| Handoff mechanism | Written handoff briefs, read in full | Assumptions and open questions are explicit, not assumed |
| QA position | Ghost is always last before ship | No code ships without adversarial review |
| Plan approval | Human approves PLAN.md before any agent activates | Prevents building the wrong thing |
| Task traceability | GMW-### convention across all files, commits, bugs | Every artifact is traceable to its task |
| Skill storage | `.agent/SKILLS/` shared, not per-agent | Skills are team infrastructure, not personal property |
| File ownership | Explicit owner per file in AGENTS.md | Prevents agents overwriting each other's work |

### Naming History

| Original name | Final name | File |
|---|---|---|
| Ayina | Aniya Fronte | `agents/aniya-fronte.md` |
| Kennis | Kennis Beck | `agents/kennis-beck.md` |
| FORGE | Aniya Fronte | — |
| CORE | Kennis Beck | — |

---

## How to Write a Task Entry

When a task ships, append an entry in this format:

```markdown
## [GMW-###] [Task title] — [Agent(s)] — [Session marker]

### Added
- [What was added]

### Changed
- [What was changed, what it was before, why]

### Fixed
- [What was fixed during implementation — not post-Ghost bugs]

### Infrastructure
- [Infrastructure added or changed — Brianna Ops entries]

### Known Issues Shipped
- [Any bugs shipped under CONDITIONAL SHIP with BUG ID and tracking note]

### Notes
- [Any decisions worth preserving in the historical record]
```

---

*God Made Weapon — CHANGELOG.md*
*Append only. The history of this system lives here.*

---

## [GMW-AUDIT-01] Maintenance Pass — Orchestrator — 2026-06-09

### Fixed
- `system/harness.md`: Agent File References corrected (ayina.md → aniya-fronte.md, kennis.md → kennis-beck.md)
- `.agent/AGENTS.md`: upgraded to v1.2 — Section 11 (Experience-First Build Protocol, Hook 0/0A/0B) added
- `.agent/AGENTS.md`: SESSION.md read step added to Section 7 startup sequence (Step 7)
- `.agent/AGENTS.md`: linting added to Section 8 skill registry (was present in file, not in registry)
- `.agent/SKILLS/implementation/SKILL.md`: upgraded to v1.2 — LINT step added to work loop, Prototype Mode, Wire step, Standard Mode, and contract-from-screens note added
- `.agent/SESSION.md`: created — session state tracking file
- `.env.example`: moved from docs/env.example to project root
- `CLAUDE.md`: created — Claude Code entry point and SODA Brain registration
- `README.md`: file structure updated to include SESSION.md, CLAUDE.md, linting skill, equal-point-spec.md
- `docs/PLAN.md`: Prototype Required field added to template
- `docs/qa/README.md`: created
- `docs/releases/README.md`: created
- `tests/README.md`: created
- `.agent/SKILLS/verification/equal-point-spec.md`: created — Equal Point-specific Ghost QA spec

### Notes
- AGENTS.md is now v1.2 (experience-first). Prior v1.0 file on disk was missing Section 11 entirely.
- Stale files in parent GMW Dev Team/ folder (ayina.md, kennis.md, flat SKILL.md, displaced .agent/SKILLS/ duplicates) — pending separate cleanup pass. Do not delete without confirming none are referenced by an active process.
