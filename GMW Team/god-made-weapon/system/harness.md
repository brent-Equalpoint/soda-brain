# God Made Weapon — Agent Harness
## Execution Wrapper for Agent Activation

---

## What the Harness Does

The harness is the **execution layer** between a task and an agent. It ensures every agent starts with the right context, operates within their domain, produces structured output, and stops cleanly so the next agent can begin.

Think of it as the mission briefing room. Before any agent touches work, the harness frames the mission, arms them with context, and sets the rules for how they report back.

---

## How to Activate an Agent

To activate an agent in Claude Code, begin your prompt with this harness block. Replace bracketed fields with actual values.

```
## HARNESS ACTIVATION

**Team:** God Made Weapon
**Agent:** [ANIYA FRONTE | KENNIS BECK | BRIANNA OPS | GHOST]
**Task ID:** [GMW-###]
**Activated by:** [ORCHESTRATOR | USER]
**Phase:** [FEATURE BUILD | CODE REVIEW | DEBUG | QA | HOTFIX | DEPLOY]

---

## Mission Brief

**Task:** [One sentence. What needs to be done.]

**Context:**
[2-5 sentences. Background the agent needs to understand the task. 
What exists, what's been decided, what the goal is.]

**Inputs:**
[Everything the agent is starting with: files, contracts, previous handoff briefs, 
links, schema definitions, design specs. List them explicitly.]

**Expected Output:**
[What a completed task looks like. Be specific: files, documentation, test results, etc.]

**Constraints:**
[What the agent must not do. Stack restrictions, scope limits, time constraints.]

**Previous Agent Context:**
[If handed off from another agent, paste their full handoff brief here.
If this is the first activation, write: "None. This is the first activation."]

---

## Active Agent Loaded: [AGENT NAME]

[Agent reads their .md file and begins operating under their identity, 
rules of engagement, and output format.]
```

---

## Harness Rules

### One Agent at a Time
The harness only activates one agent per session. The active agent completes their work, produces their handoff brief, and goes silent. The Orchestrator then issues a new harness activation for the next agent.

**Never activate two agents in the same prompt.**

### Context Carries Forward
Every harness activation must include the previous agent's handoff brief under "Previous Agent Context." Context is never assumed. It is always explicit.

If previous handoff briefs are long, include them in full. Agents make better decisions with full context than with summaries.

### Task IDs Are Consistent
Every task in a session shares a Task ID (example: GMW-001). This ID persists through every agent activation for that task. It makes bug reports, file references, and conversations traceable.

### Output Is Structured
Every agent produces output in the format defined in their `.md` file. Do not accept freeform responses. If an agent produces output without the required structure, prompt: "Please reformat your response using your output template."

### Handoff Briefs Are Sacred
The handoff brief is the only thing an agent passes to the next. It must be complete. It must be specific. It must name the next agent explicitly. A vague handoff is a broken handoff.

---

## Harness Templates by Phase

### Feature Build (Full Pipeline)
```
Phase: FEATURE BUILD
Activation order: ORCHESTRATOR → ANIYA FRONTE → KENNIS BECK → BRIANNA OPS → GHOST → ORCHESTRATOR
```

### Code Review
```
Phase: CODE REVIEW
Activation order: ORCHESTRATOR → [AGENT WHOSE CODE IS BEING REVIEWED] → GHOST → ORCHESTRATOR
```

### Debug Session
```
Phase: DEBUG
Activation order: ORCHESTRATOR → [AGENT WHO OWNS THE BROKEN THING] → GHOST (regression) → ORCHESTRATOR
```

### QA Only
```
Phase: QA
Activation order: ORCHESTRATOR → GHOST → ORCHESTRATOR
```

### Hotfix
```
Phase: HOTFIX
Activation order: ORCHESTRATOR → [RESPONSIBLE AGENT] → GHOST (smoke test) → BRIANNA OPS → ORCHESTRATOR
```

### Deploy Only
```
Phase: DEPLOY
Activation order: ORCHESTRATOR → BRIANNA OPS → GHOST → ORCHESTRATOR
```

---

## Agent File References

Load these before activating each agent:

| Agent | File |
|---|---|
| Aniya Fronte | `agents/aniya-fronte.md` |
| Kennis Beck | `agents/kennis-beck.md` |
| Brianna Ops | `agents/brianna-ops.md` |
| Ghost | `agents/ghost.md` |

---

## Example Harness Activation

```
## HARNESS ACTIVATION

**Team:** God Made Weapon
**Agent:** ANIYA FRONTE
**Task ID:** GMW-012
**Activated by:** ORCHESTRATOR
**Phase:** FEATURE BUILD

---

## Mission Brief

**Task:** Build the user profile settings page.

**Context:**
Kennis Beck has completed the backend for user profile management. 
The API contract is included below. The design brief calls for an editable form 
with avatar upload, display name, email, and notification preferences. 
The component must be accessible and mobile-first.

**Inputs:**
- API contract from Kennis Beck (see Previous Agent Context below)
- Design spec: minimal card layout, single column on mobile, two column on desktop
- Auth is handled: assume the user object is available via useAuth() hook

**Expected Output:**
- ProfileSettings.tsx component
- Supporting sub-components as needed
- Unit tests for form validation logic
- Handoff brief for Kennis Beck if any API changes are required, or for Brianna Ops if ready to deploy

**Constraints:**
- Do not modify the API contract without flagging it first
- No third-party form libraries. Use controlled components.
- Tailwind CSS only

**Previous Agent Context:**
[Kennis Beck's full handoff brief pasted here]

---

## Active Agent Loaded: Aniya Fronte
```
