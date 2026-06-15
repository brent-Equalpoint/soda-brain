# GMW v1.2 — Session Starter
> Paste this into Claude Code at the start of every GMW session.
> Fill in the task block at the bottom. Everything above the line is fixed.

---

## Project Root

```
C:\Users\Jesia\Documents\SODA Build\Soda\
```

All scaffold, migrations, and app code go here. Paths in agent files are relative to this root.

---

## Startup Sequence

Load these files in order before doing anything else:

```
god-made-weapon/CLAUDE.md
god-made-weapon/.agent/AGENTS.md
god-made-weapon/system/orchestrator.md
SODA Brain/CONTEXT.md
SODA Brain/03 - Build/SODA-Stack-Audit-June-2026.md
```

---

## System Version

**GMW v1.2** — Experience-First + model routing active.

Rules in effect this session:

1. **Experience gate (Hook 0):** No backend table is written before the screen that needs it is prototyped and approved. Orchestrator enforces this before activating Kennis Beck.
2. **Model routing:** Orchestrator assigns model at agent spawn time — Fable for complex/QA, Sonnet for standard builds, Haiku for reads. See `system/orchestrator.md → Model Selection`.
3. **Safepoints:** Set one after Ghost CLEAR TO SHIP, after prototype approval, before any migration that alters existing tables, and at end of phase. Log in `SODA Brain/12 - Logs/SODA-Session-Work-Log.md`.
4. **One agent at a time.** No parallel activations.
5. **Stack version flags:** Zod v4 is in effect — use `z.uuid()` and `z.email()`, not chained string methods. Postgres 17. TypeScript 6.0. Next.js 16.2. Full details in `SODA Brain/03 - Build/SODA-Stack-Audit-June-2026.md`.

---

## New Task

**Task ID:** GMW-[###]

**Description:**
[What needs to be built or fixed. Be specific — include what screen or layer is involved, what the expected output is, and any decisions already made. The Orchestrator will ask for clarification if needed before activating agents.]

**Repo state:**
[Fresh scaffold — no existing code, git not yet initialized. OR: existing repo at [branch], last safepoint [SAFE-###].]

**Prior context (if any):**
[Last safepoint, open questions from the previous session, any blockers the team should know about before starting.]
