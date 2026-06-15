# God Made Weapon
## Agentic Dev Team for Claude Code

---

## The Team

| Agent | Role | File |
|---|---|---|
| **Aniya Fronte** | Frontend Engineer | `agents/aniya-fronte.md` |
| **Kennis Beck** | Backend Engineer | `agents/kennis-beck.md` |
| **Brianna Ops** | DevOps Engineer | `agents/brianna-ops.md` |
| **Ghost** | QA Specialist | `agents/ghost.md` |

---

## The System

| Component | Purpose | File |
|---|---|---|
| **Orchestrator** | Smart routing brain. Decides who runs, when, and why. | `system/orchestrator.md` |
| **Harness** | Execution wrapper. Activates agents with full context. | `system/harness.md` |

---

## How to Start

```
Load the following files in order:
1. .agent/AGENTS.md
2. system/orchestrator.md
3. docs/CONTEXT.md
4. docs/STACK.md
5. docs/TASK.md

You are the Orchestrator of the God Made Weapon dev team.
Follow the session startup sequence in AGENTS.md.
```

The Orchestrator reads everything, classifies the task, picks the route, and runs the team.

---

## Core Principles

- One agent active at a time. Always.
- Every agent reads every prior handoff brief before starting.
- Agents communicate through the Orchestrator. Never directly.
- Ghost is the last step before anything ships.
- The Orchestrator declares completion. Nobody else.

---

## File Structure

```
project/
├── README.md
├── CHANGELOG.md
├── CLAUDE.md               ← Claude Code entry point
├── .env.example
│
├── .agent/
│   ├── AGENTS.md
│   ├── SESSION.md          ← live session state (Orchestrator writes)
│   └── SKILLS/
│       ├── spec-to-plan/
│       │   └── SKILL.md
│       ├── implementation/
│       │   └── SKILL.md
│       ├── linting/
│       │   └── SKILL.md
│       ├── verification/
│       │   └── SKILL.md
│       │   └── equal-point-spec.md
│       └── release/
│           └── SKILL.md
│
├── agents/
│   ├── aniya-fronte.md
│   ├── kennis-beck.md
│   ├── brianna-ops.md
│   └── ghost.md
│
├── system/
│   ├── orchestrator.md
│   └── harness.md
│
├── docs/
│   ├── CONTEXT.md          ← project context, rules, what's built
│   ├── STACK.md            ← tech stack, single source of truth
│   ├── TASK.md             ← current task brief
│   ├── PLAN.md             ← orchestrator-generated plan
│   ├── QA.md               ← QA index
│   ├── qa/
│   │   └── GMW-###.md      ← Ghost writes one per task
│   └── releases/
│       └── GMW-###.md      ← Brianna Ops writes one per task
│
└── tests/
    ├── unit/
    ├── integration/
    ├── e2e/
    └── fixtures/
```
