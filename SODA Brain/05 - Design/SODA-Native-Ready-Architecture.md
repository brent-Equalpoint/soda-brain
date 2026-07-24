# SODA — Native-Ready Architecture

*How we build NOW so the eventual move to Expo (native iOS + Android) is cheap, without migrating yet.
Created 2026-06-27. Direction set by Brent ("not migrating yet, but build from this structure now").
The migration analysis lives in this conversation; this doc is the standing build discipline until then.*

---

## The principle

React Native (Expo) has **no HTML or CSS**, so when we move, **every screen's look gets rebuilt** but
the **logic, data, and backend carry over**. So we build now to **maximize the carry-over and isolate
the web-only parts behind swappable edges.** Nothing here slows feature work; it is mostly *where* code
goes, not *more* code.

## What already carries over (you're partway there)

- ✅ **The whole backend** — Supabase (database, security rules, RPCs, Realtime, Auth) works identically
  from a native app. The hard, valuable part of SODA does not move.
- ✅ **`@soda/contracts`** — 18 shared schema files. Pure, shared, native-ready. **This is the pattern
  to copy for everything else.**
- 🟡 **`tokens.ts`** — exists as typed values, but is a mirror of `globals.css`. Needs to become the
  *source*, not the copy.
- 🟡 **`apps/web/lib/`** — lots of pure logic (matching, warmth, dates, match-format, catalog,
  event-status, draft templates), much of it already unit-tested, but it lives inside the web app
  instead of a shared package.

## The rules (going forward)

1. **Shared logic lives in a package, not `apps/web`.** Pure business logic belongs in a shared
   `@soda/core` package (mirroring how `@soda/contracts` already works). Native reuses it verbatim.
   *Test: "could the native app need this function?" If yes, it goes in a package.*
2. **Thin client, fat server.** Push logic into API routes + Supabase RPCs. The [[ops-login-gate]] and
   the returning-door email-probe fix are the model: the browser calls a server endpoint; native will
   call the same one. Less logic in the UI = less to rewrite.
3. **Logic in hooks, rendering in dumb views.** Build a screen as a platform-agnostic hook (data, state,
   handlers, no DOM) **plus** a thin view (the JSX/styling). Native reuses the hook and rewrites only
   the view. *This is the single highest-leverage habit.*
4. **Tokens as the TS source of truth.** Make `packages/ui/tokens.ts` canonical; have the web derive its
   CSS from it; expand it beyond color to spacing, radii, and type scale. Web and native read one source.
5. **Isolate web-only APIs behind small adapters.** `localStorage`, `window`, cookies, `next/navigation`,
   `<img>` are web-only. Wrap the ones logic depends on (especially session/storage) so native swaps the
   implementation (browser storage to native secure storage). This also fixes the "lost my room"
   fragility flagged in the tech-debt review.

## First concrete moves (small, low-risk, high-payoff)

- [ ] **Create `packages/core`** and promote the pure, already-tested modules into it (matching, warmth,
  dates, match-format, catalog, event-status, draft templates, identity). Verifiable by the existing
  unit tests.
- [ ] **Make `tokens.ts` canonical** and expand it (spacing / radii / type), keeping `globals.css` in
  sync from it.
- [ ] **Adopt the hook + dumb-view convention** for all new screens (and apply it as the overhaul
  rebuilds each one).
- [ ] **Wrap session/storage in a `sessionStore` adapter** (native-ready, and closes the "lost my room"
  bug at the same time).

## The overhaul tie-in (important)

The planned [[SODA-Attendee-UI-Overhaul]] should be built **in this structure**: logic in
hooks/packages, views kept thin. Done that way, the overhaul is the **last time we rebuild views in the
web stack before native**, the portable logic underneath survives the Expo move untouched. Do the
overhaul the old way and we pay for those screens twice.

## What we are NOT doing yet

Not migrating. No Expo app, no React Native, no app-store work yet. This is purely how the *current* web
build is structured so the future move (Brent's call, targeted to begin around July 2026) is cheap.

## References

[[SODA-Attendee-UI-Overhaul]] (build it in this structure) · [[SODA-Flows-As-Built]] ·
[[SODA-Backlog]] · [[SODA-Flow-Test-Plan]]. Migration analysis: this conversation (carries-over vs
rebuild, the spike-first recommendation).
