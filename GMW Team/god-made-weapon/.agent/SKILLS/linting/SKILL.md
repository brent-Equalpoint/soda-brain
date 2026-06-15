# SKILL: linting
## God Made Weapon — Linting and Formatting Playbook
### Loaded by: Aniya Fronte, Kennis Beck
### Triggered when: Between BUILD and VERIFY in every work loop iteration

> Lint runs after every build unit. Not at session end. Not before a commit batch. Every unit. Every time.
> Code is not lint-clean until zero errors AND zero warnings. Warnings suppressed are not warnings fixed.

---

## Commands

Run in this order every time:

```bash
npm run format          # Prettier — run first, removes formatting noise
npm run lint            # ESLint — fix all errors before proceeding
npx tsc --noEmit        # TypeScript — catches what ESLint misses
npm run test            # Confirm tests still pass after lint fixes
```

If a `npm run` script does not exist, use the direct command:
```bash
npx prettier --write path/to/file.ts
npx eslint path/to/file.ts
```

If a config file is missing (`.eslintrc.json`, `.prettierrc`, `tsconfig.json`): flag as a blocker. Do not run lint without a config.

Config file ownership: `.eslintrc.json`, `.prettierrc`, `.eslintignore`, `.prettierignore` → Brianna Ops / Human. `tsconfig.json` → Kennis Beck / Brianna Ops. Never modify without human approval.

---

## Error vs Warning

| Level | Blocks commit | Action |
|---|---|---|
| Error (`✖`) | Yes | Fix before VERIFY. No exceptions. |
| Warning (`⚠`) | No | Fix before handoff. Disclose in handoff brief if unresolved. |

---

## Common Errors — Fix Reference

| Rule | Fix |
|---|---|
| `no-explicit-any` | Replace with actual type or `unknown`. If third-party has no types, suppress with a comment explaining why. |
| `no-console` | Remove. Use `lib/logger`. If logger missing, flag as blocker. |
| `no-unused-vars` | Remove if unused. Prefix with `_` if intentionally ignored (e.g. destructuring). |
| `import/order` | Reorder: Node built-ins → external packages → internal aliases → relative. Auto-fixable: `npx eslint --fix`. |
| `explicit-function-return-type` | Add return type: `async function getUser(id: string): Promise<User \| null>` |
| `Object is possibly null` | Add null check or use optional chaining (`?.`). Never use `!` without a comment. |
| `Type X not assignable to Y` | Fix the type mismatch. Do not silence with `as` unless safe and documented. |

**`react-hooks/exhaustive-deps` — never suppress.**
This is always a logic issue. Ask: if this dependency changes, should the effect re-run?
- Yes → add it to the array.
- No → restructure with `useCallback` or move the value outside the component.

---

## Auto-Fix

Safe to auto-fix: import ordering, unused variable prefixing, consistent returns, simple formatting.
Not safe: `exhaustive-deps`, type-related rules, anything that changes code behavior.

```bash
npx eslint --fix path/to/file.ts
```

Always review the diff after auto-fix. If it changed something you do not understand: revert and fix manually.

---

## Never

- Modify `.eslintrc.json` without human approval. Flag config issues as stopping conditions.
- Use `// eslint-disable-file` — never appropriate. Refactor the file instead.
- Suppress `react-hooks/exhaustive-deps` — always a logic issue.
- Suppress `no-explicit-any` without a comment explaining why `unknown` does not solve it.
- Commit with any lint errors. A commit with errors poisons the branch.

---

## Equal Point Specific

**No direct Supabase from client components** — ESLint cannot catch this. Manually scan any new `'use client'` file for direct Supabase imports during the lint step.
```typescript
// Wrong — inside 'use client'
import { supabase } from '@/lib/supabase';
// Right — call the API route
const data = await fetch('/api/connections').then(r => r.json());
```

**No warmth formula outside `lib/warmth/formula.ts`** — flag immediately, route to Kennis Beck.
**No `middleware.ts`** — Next.js 16 uses `proxy.ts`. Flag any `middleware.ts` created or modified.
**Env vars from `process.env` only** — never import from `.env` directly, never hardcode values.

---

## Legacy Files

If editing a file with pre-existing lint errors unrelated to your changes:
- Fix only errors caused by your changes.
- Document pre-existing errors in handoff brief: "File X has N pre-existing lint errors. Recommend cleanup task."
- Never mix feature work and lint cleanup in the same commit.

---

## Handoff Lint Status

Include in every handoff brief:

```
## Lint Status — GMW-###
- npm run format: PASS
- npm run lint: PASS (0 errors, 0 warnings)
- npx tsc --noEmit: PASS (0 errors)
- Suppressions used: None / [file, line, rule, reason]
- Pre-existing issues not fixed: None / [description]
```

Lint not clean at handoff = blocker. Fix before handing off.

---

*God Made Weapon — linting SKILL.md v1.1 — trimmed*
*Loaded by Aniya Fronte and Kennis Beck. Read-only.*
