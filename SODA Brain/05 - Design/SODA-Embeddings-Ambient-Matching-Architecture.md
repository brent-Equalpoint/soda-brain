# SODA — Embeddings-Based Ambient Matching (Core Architecture Proposal)

*A proposal to fold the **SODA-EMBED-002** spec (embedding/vector matching with hidden scores and ambient
nudges) into SODA's core architecture. Created 2026-06-28 at Brent's direction ("add this to our core
architecture"). This is the embeddings / "Epicure"-class approach discussed 2026-06-27. **It is a major,
foundation-level change and needs Brent + Alysha sign-off; no code yet.** The single most important point
is the reconciliation below: the spec is written against a different schema and team than your live SODA.*

---

## What the spec is (and what's genuinely great about it)

SODA-EMBED-002 replaces score-based matching with **embeddings**: at check-in each person becomes a
384-dimension vector (pgvector in Supabase); matches are found by **cosine "offer-need arc distance"**;
and crucially **the score is never shown** — users see only **ambient nudges** (a name, a plain-English
reason, an action). Three nudge types: **match** (attendee), **gap** and **bridge** (operator).

**The product posture is excellent and on-brand:** no numbers, plain English, reasons that cite only
chip facts, "first is not labeled best." That matches SODA's whole ethos. Several ideas here are worth
adopting **regardless** of the embeddings decision (see "Adopt now" below).

## The critical reconciliation (read first)

**This spec does not match your live SODA.** I checked the whole codebase, and none of its tables or
concepts exist here. It was clearly written for a **different / parallel build** (most likely
Equalpoint's matching team). Concretely:

| The spec assumes | Your live SODA actually has |
|---|---|
| `soda_attendees`, `soda_events`, `soda_worlds`, `soda_person_embeddings`, `soda_chip_matches`, `loop_events`, `soda_operator_nudges` | `events`, `attendances` (offers/needs jsonb, `profile_id`), `profiles`, `ops_login_attempts`, `profile_cards` — **no `soda_` prefix** |
| Concepts: **worlds, bridges, titles, `is_bridge`, the Equalpoint warmth clock/graph, loop_events, Study One** | None of these exist in SODA's model today |
| Team + gate: **Kennis / Aniya / Nelson / Ghost**, BTW Cincinnati, July 14 | Your context is GMW + Brent/Alysha; different team and deadline |
| **Doppler** for all secrets | Doppler-vs-Vercel is **still an open decision** in your backlog |
| `lib/warmth/formula.ts`, `references/schema.md`, a 7-rule `CLAUDE.md`, **numbered** migrations (`006_…`) | `lib/warmth/index.ts`, **timestamped** migrations (`20260624…`) |

**So "add as-is" is not possible** — it references tables you don't have. To adopt it, the spec must be
**mapped onto your real schema** (or you decide to adopt its `soda_*` / worlds / bridges data model
wholesale, a big call). That mapping is the work this proposal scopes.

## The fork this forces (vs the matching plans from yesterday)

This **supersedes** the two rule-based matching plans ([[SODA-Focus-Aware-Matching-Plan]],
[[SODA-Category-Synonym-Matching-Plan]]). Embeddings **subsume** both: a good vector space naturally puts
*Funding ≈ Investment* and same-focus people close together, so synonyms and focus-alignment fall out of
the math instead of hand-curated lists. The honest trade:

- **Rule-based (the two plans):** transparent, deterministic, no model, host can see exactly why, but you
  hand-maintain the lists, and it can't handle open/custom vocabulary.
- **Embeddings (this spec):** automatic semantic + focus matching, handles custom chips, but it needs an
  embedding model (cost + a dependency), is **opaque** (you can't easily say *why* two vectors are close),
  and is heavier infra.

**A likely best-of-both:** embeddings do the *ordering*; the rule-based overlap stays as the **reason
string + a transparency/sanity layer** (the spec already does exactly this — its `buildReason` /
`computeOverlap` are rule-based). So the two plans aren't wasted; they become the explain-layer.

## Adopt now (low-cost, on-brand, no embeddings needed)

Independent of the big infrastructure decision, these ideas can improve the **current** engine cheaply:
- **Hide the numeric match strength** behind plain-English reasons ("ambient nudges"). On-brand, small.
- **Reason-string discipline:** cite chip facts only, no "strong match" / numbers / urgency.
- **Operator gap + bridge nudges** (your "Most Wanted" already does gaps; bridges would be new).
- **A loop funnel in events** (shown → tapped → intro → loop-closed) for real feedback. (SODA has no
  `loop_events` yet; this is a small, valuable addition.)

## What full adoption requires (the heavy half)

- **pgvector** enabled on your Supabase + new embedding tables (a real DB migration).
- **An embedding model** to vectorize chips at check-in (a Vercel edge function), which is a **new
  dependency + per-person cost** (the spec uses 384-dim vectors; the model/source must be chosen).
- A **cron / on-demand nudge-compute job**.
- New surfaces (NudgeMatchCard, OperatorNudgePanel, etc.) mapped to your design system + tokens.
- A decision on the **worlds / bridges** data model (a genuine product addition, not just plumbing).

## Decisions for you + Alysha (foundation-level)

1. **Adopt embeddings over the rule-based direction?** (It supersedes the two matching plans.)
2. **Map onto your existing `events`/`attendances`/`profiles`, or adopt the spec's `soda_*` + worlds/
   bridges model?** (Determines the whole migration.)
3. **Is this Equalpoint's team's spec to integrate** — and how do the two teams/processes (the Ghost
   gate, Kennis/Aniya/Nelson) reconcile with your GMW build?
4. **OK to take on pgvector + an embedding model** (infra + cost)? Note the spec **assumes Doppler** — so
   adopting it effectively decides your open Doppler-vs-Vercel question.
5. **Add the "worlds / bridges" product concept**, or drop those nudge types for v1?

## Safety + sequencing (no sudden moves)

This is a major addition (a DB extension, new tables, an embedding pipeline, a cron, new surfaces), so:
- **Spike first** — pgvector + embeddings on your **real** schema, one event, behind a flag, proving the
  "offer-need arc" ordering against the rule-based result before committing. Nothing in production moves.
- **Explicit per-action authorization before any cloud DB push** (your standing rule), plus Alysha
  sign-off (it's foundation-level, pairs with the Clerk/Zustand + Doppler decisions).
- Built in parallel, reversible, behind the parity gate ([[SODA-Flow-Test-Plan]]).
- It fits the **native-ready** rules (vectors stay server-side, the client gets plain data) — that part
  is already aligned with [[SODA-Native-Ready-Architecture]].

## What we are NOT doing

Not pasting the spec's schema/code into the live app (it references tables you don't have), not running a
DB migration without explicit authorization + Alysha's sign-off, not deciding Doppler by accident, and no
code until the fork above is resolved.

## References

The source spec: **SODA-EMBED-002** (June 23, 2026; supersedes EMBED-001). Reconciles with /
supersedes [[SODA-Focus-Aware-Matching-Plan]] + [[SODA-Category-Synonym-Matching-Plan]] (they become the
reason/transparency layer). Ties to [[SODA-Native-Ready-Architecture]], [[SODA-Backlog]] (the Doppler +
Clerk/Zustand decisions), [[SODA-Universal-UI-Expo-Migration-Plan]]. Live engine today:
`apps/web/lib/matching/index.ts`; live schema: `events` / `attendances` / `profiles`.
