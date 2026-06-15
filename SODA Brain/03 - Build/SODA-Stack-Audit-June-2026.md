# SODA Stack Audit — June 2026

> Audit run: 2026-06-11. All versions confirmed against official release channels and npm registry.
> Update this document each time a dependency is upgraded. Reference it before starting any new phase.

---

## Current Versions — Confirmed

| Technology | Version in Use | Latest Stable | Status |
|---|---|---|---|
| Next.js | 16.2 (16.2.7 LTS) | 16.2.7 LTS | ✓ Current |
| React | 19.2 | 19.2.7 | ✓ Current |
| TypeScript | 6.0 | 6.0 (TS 7.0 beta — not production) | ✓ Current |
| Zod | v4 (4.4.3) | 4.4.3 | ✓ Current — **breaking from v3** |
| @supabase/supabase-js | 2.108.1 | 2.108.1 | ✓ Current |
| @supabase/ssr | current | current | ✓ Correct package (not auth-helpers) |
| Supabase Postgres | 17 | 17 | ✓ Current — migrating from 15 |
| pg_cron | 1.6.4 | 1.6.4 | ✓ Current |
| FastAPI | 0.136.3 | 0.136.3 | Deferred (no pilot BLE) |
| Tailwind CSS | 4.3.0 | 4.3.0 | ✓ Current — **breaking from v3** |
| Claude Sonnet | claude-sonnet-4-6 | claude-sonnet-4-6 | ✓ Correct |
| Claude Haiku | claude-haiku-4-5-20251001 | claude-haiku-4-5-20251001 | ✓ Correct |
| Claude Fable | claude-fable-5 | Fable 5 (GA June 9, 2026) | ✓ Use for GMW complex tasks |

---

## Breaking Changes — Must Read Before Building

### Zod v4 (breaking from v3)

If any existing code or spec was written against Zod v3, it will not work without migration.

**Key breaks:**
- `z.string().uuid()` → `z.uuid()` (format validators are now top-level, not chained)
- `z.string().email()` → `z.email()`
- Error customization: `message` param replaced with `error`. `invalid_type_error` / `required_error` dropped.
- `.catch()` and `.default()` on optional properties: in v4, caught values are always returned even when not present in input.
- `POSITIVE_INFINITY` / `NEGATIVE_INFINITY` no longer valid for `z.number()`.

**Migration path:** Run the community codemod `zod-v3-to-v4`, then fix manual cases. Most projects take one day. Major ecosystem libraries (tRPC v11+, @tanstack/react-form, react-hook-form v8 + @hookform/resolvers v4+) are all Zod v4 compatible.

**SODA implication:** All schemas in `packages/contracts` must be written to Zod v4. Do not use `z.string().uuid()` — use `z.uuid()`. Do not use chained format validators — use top-level functions.

---

### Tailwind CSS v4 (breaking from v3)

**Key breaks:**
- No more `tailwind.config.js` — all theme configuration moves into your CSS file using `@theme` directives.
- Replace `@tailwind base; @tailwind components; @tailwind utilities;` with `@import "tailwindcss"`.
- `bg-gradient-to-*` class family renamed (run upgrade tool).
- With Turbopack (Next.js 16 default), add `@source` directive in `globals.css` to fix HMR file-watching.

**Migration tool:** `npx @tailwindcss/upgrade` handles ~90% of class renames automatically.

**SODA implication:** SODA uses CSS custom properties (design tokens) for its color system. Tailwind utilities are used for layout only. When building with Tailwind v4, use `@import "tailwindcss"` and define the SODA token palette in the `@theme` block, not in a JS config.

---

### Supabase Postgres 17

Supabase is moving the default self-hosted Docker Compose database image from Postgres 15 to Postgres 17 the week of June 15, 2026.

**For hosted Supabase projects:** Check your project's Postgres version in Infrastructure Settings and upgrade to 17 before or alongside Phase 0.

**For new projects:** Default is Postgres 17. pg_cron 1.6.4 is the current extension version — confirm it's enabled in Extensions settings.

**New Supabase default (April 2026):** Tables in the `public` schema are NOT exposed to the Data API and GraphQL API by default on new projects. If your project was created after April 28, 2026, explicitly expose tables you need via the API.

---

### TypeScript 6.0 → 7.0 Beta

TypeScript 6.0 is the current stable release. TS 7.0 beta is available and is 10x faster (rewritten in Go), but is not production-ready.

**Use TypeScript 6.0 strict for SODA builds.** Do not adopt TS 7.0 until it reaches stable.

**No breaking changes** between TS 5.x and 6.0 for most codebases — 6.0 is primarily a stepping-stone toward the Go-based 7.0.

---

### Next.js 16.2 — What's New

- 400% faster dev server startup vs 16.0
- 200+ Turbopack fixes since 16.0
- Stable Adapter API for cross-provider deployment

**SODA implication:** Ensure `package.json` pins `next: "^16.2.7"` and that the Turbopack dev server is the default (`next dev --turbopack` or configured in package.json).

---

### Claude Fable 5

Fable 5 became generally available June 9, 2026. Pricing: $10/$50 per million tokens (input/output). This is the model the GMW Orchestrator assigns to Ghost for full QA passes and to agents for complex architecture decisions.

The symbolic name "Fable" in `orchestrator.md` maps to Fable 5. Model string for direct API use: confirm in the Anthropic API docs — the symbolic `fable` alias always routes to the latest Fable.

---

## What Was Checked — Unchanged and Correct

These do not need updates:

- **Supabase Auth**: `@supabase/ssr` is the correct package (auth-helpers are deprecated ✓). Publishable and secret API key pattern is current ✓.
- **Claude model strings**: `claude-sonnet-4-6` and `claude-haiku-4-5-20251001` confirmed current ✓.
- **React 19.2**: Correct. Next.js 16 ships with React 19.2 ✓.
- **Realtime connection limits**: Free ~200, Pro ~500, Team higher. Still accurate ✓.
- **FastAPI**: Deferred until native BLE proximity layer — no changes needed now.
- **Vercel hosting**: Still the correct deployment target for Next.js 16 ✓.
- **Transaction pooler for Supabase connections**: Still the right pattern for serverless ✓.

---

## Next Audit

Schedule a stack check at the start of each build phase, or whenever a major dependency releases a new major version.
