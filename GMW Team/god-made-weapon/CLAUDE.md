# CLAUDE.md
## God Made Weapon — Claude Code Entry Point

> This file registers the GMW multi-agent system with Claude Code.
> Claude Code reads this file automatically at session start.
> Do not modify without updating the startup sequence in .agent/AGENTS.md.

---

## What This Is

God Made Weapon (GMW) is a structured multi-agent Claude Code system for building Equal Point — a personal relationship intelligence platform (Relational OS).

**Project root:** `god-made-weapon/`
**App being built:** Equal Point (see `docs/CONTEXT.md` and `docs/STACK.md`)

---

## How to Start a GMW Session

Load these five files in order before doing anything else:

```
1. .agent/AGENTS.md          — system constitution, all global rules
2. system/orchestrator.md    — routing and session management
3. docs/CONTEXT.md           — Equal Point context and non-negotiable rules
4. docs/STACK.md             — full technology stack
5. docs/TASK.md              — current task definition
```

Then tell the Orchestrator the task. It will assign a Task ID, generate a PLAN.md, and route to the correct agent.

---

## Agents

| Agent | Role | File |
|---|---|---|
| Orchestrator | Routing, coordination, session state | `system/orchestrator.md` |
| Aniya Fronte | Frontend — UI, components, accessibility | `agents/aniya-fronte.md` |
| Kennis Beck | Backend — APIs, database, auth, server logic | `agents/kennis-beck.md` |
| Brianna Ops | DevOps — CI/CD, cloud, infrastructure | `agents/brianna-ops.md` |
| Ghost | QA — testing, bug reporting, ship clearance | `agents/ghost.md` |

---

## Skills

| Skill | When Used | File |
|---|---|---|
| spec-to-plan | Converting a task into an approved PLAN.md | `.agent/SKILLS/spec-to-plan/SKILL.md` |
| implementation | Executing approved plan steps (build phase) | `.agent/SKILLS/implementation/SKILL.md` |
| linting | After every BUILD step, before VERIFY | `.agent/SKILLS/linting/SKILL.md` |
| verification | QA and testing pass (Ghost) | `.agent/SKILLS/verification/SKILL.md` |
| release | Deployment and release (Brianna Ops) | `.agent/SKILLS/release/SKILL.md` |

---

## Session State

Current task, active agent, and next required action: `.agent/SESSION.md`

---

## Rules That Cannot Be Overridden

1. No Equal Point feature ships without Ghost's CLEAR TO SHIP
2. No secrets in any file — Doppler only
3. RLS on every Supabase table
4. Auto-send is never implemented
5. Human approves every plan before implementation begins
6. Experience is designed before backend is built — Aniya Fronte prototypes first

Full rules: `.agent/AGENTS.md`
Full Equal Point non-negotiables: `docs/CONTEXT.md`

---

## Build Protocol (Experience-First)

```
UX flow → Aniya Fronte (prototype, mock data) → Human approves
→ Kennis Beck (derives contract from screens) → Aniya Fronte (wires live data)
→ Brianna Ops (deploys) → Ghost (tests) → Ship
```

The contract is derived from the screens. Never the other way around.
