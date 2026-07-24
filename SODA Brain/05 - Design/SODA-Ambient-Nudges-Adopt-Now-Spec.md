# SODA — Ambient Nudges (the "adopt now" spec)

*A spec, not a build. The cheap, on-brand half of [[SODA-Embeddings-Ambient-Matching-Architecture]]: take
the **"hide the number, show a plain-English reason"** posture from SODA-EMBED-002 and apply it to SODA's
**current rule-based engine**, with **no embeddings, no pgvector, no Doppler, no foreign schema.** Created
2026-06-28 at Brent's direction ("spec it"). No code yet.*

---

## The principle

Surface matches by **order + a plain-English reason**, never by a number. The engine can still compute a
strength internally to decide the order, but the user only ever sees **a name, a reason in plain English,
and an action.** This is the best idea in the EMBED-002 spec and it needs none of its heavy machinery.

## Grounded in what you already have

Your live engine (`apps/web/lib/matching/index.ts`) already produces everything this needs:
- each match carries the **overlapping chips** (`aGives` / `bGives`) — the raw material for a reason,
- the room **gaps** (Most Wanted: "5 need / 0 offer"),
- the **top connector**.

It also already has a **Nudge act** and **draft generation** (chip-based wording). So this is a
**presentation + posture layer** on top of the existing engine, not a new system. It also **stacks
cleanly** with the rule-based [[SODA-Focus-Aware-Matching-Plan]] and
[[SODA-Category-Synonym-Matching-Plan]] (those decide the *order*; this decides the *words*).

## The spec

### A. Drop the per-match strength number
- Keep the **order** (strongest first) but **stop showing the per-match score / rank / "strength."**
- **No labels** like "top match," "best match," "X% compatible," "recommended."
- **Keep room-level plain counts** for the host (they're useful analytics, not a per-person rank): total
  matches, mutual count, and the Most Wanted "N need / M offer." The ban is on *computed match-strength
  numbers shown as a rank*, not on plain counts of people.

### B. A rule-based reason string per match
- Add a `reason` to each match, built by a pure function from the overlapping chips, **citing only chip
  facts**: *"Lorena offers Mentorship in design. You listed Mentorship as something you're looking for."*
- Priority order for the reason: they-offer-your-need → you-offer-their-need → mutual → shared focus.
- Lead with the reason on every match surface; it is the point, not a subtitle.

### C. Operator gap nudges (from your existing gaps)
- Turn the Most Wanted table into plain-English operator lines: *"Nine people are looking for legal
  counsel. No one has offered it yet. Consider flagging this from the stage."* (Counts of people are
  fine; no strength scores.)
- Input is the engine's existing `gaps` array. Low effort, high value, on-brand.

### D. A lightweight "connector" nudge (from your existing top connector)
- *"Lorena connects more people in this room than anyone, route introductions through her thoughtfully."*
- This is the *simple* version. The full EMBED-002 "bridges two **worlds**" needs a worlds/clusters
  concept SODA doesn't have, **defer that** to the embeddings track.

### E. (Optional, the one piece that carries a small migration) the loop funnel
- Track **shown → tapped → intro → met** so you can measure whether matches become real connections.
- Needs a small `loop_events`-style table + light instrumentation. Valuable, but it's the one item here
  that isn't zero-migration, so it can be a **fast-follow**, not part of the first, no-DB-change pass.

### Language discipline (a matching house rule)
Adopt the EMBED-002 locked-out terms as a rule for all matching copy: never **score, strength,
compatibility, similarity, recommended, top/best match, ranked, "X out of Y," percentages.** Reasons cite
chips only; no qualitative strength words; no urgency. (It extends your existing no-em-dash rule.)

## What it touches (small; no migration except optional E)

- `apps/web/lib/matching/index.ts` — add the `reason` builder + the operator nudge text (pure functions).
- `packages/contracts/src/matching.ts` — add the `reason` field to the match shape.
- `apps/web/lib/match-format.ts` + the **host Intel** surface — lead with reasons, drop per-match numbers.
- *(optional E only)* a small `loop_events` table + instrumentation.

*Scope note:* matches are **host-facing today** (attendees don't see their matches yet). This posture
applies to the host Intel surface now and is ready for an attendee-facing match view when that ships
(it's a separate backlog item).

## Why it's safe + not wasted

- **Pure presentation/posture** on the existing engine, no new infrastructure, no embeddings, and
  **no DB change** (except optional E). The match *logic* is unchanged.
- **Durable regardless of the engine fork:** if you later adopt the embeddings engine, it slots *under*
  this layer (vector ordering replaces rule ordering) without changing the posture or the reason strings.
  So building this now survives that decision.

## Decisions for you (small)

1. **Keep room-level aggregate counts for the host, or hide every number?** Recommended: keep the
   aggregates (they're useful), drop only per-match strength.
2. **Include the loop funnel (E) now (small migration) or fast-follow?** Recommended: fast-follow; ship
   the zero-migration A–D first.
3. **Add an attendee-facing match view now, or keep host-only** for this pass? Recommended: host-only
   now; attendee matches are their own product step.

## What we are NOT doing

No embeddings, no pgvector, no Doppler dependency, no worlds/bridges model, no foreign `soda_*` schema,
and no code until you say go. Pure logic, so it later moves to `@soda/core` per
[[SODA-Native-Ready-Architecture]].

## References

The full vision: [[SODA-Embeddings-Ambient-Matching-Architecture]] (this is its no-infra subset) · stacks
with [[SODA-Focus-Aware-Matching-Plan]] + [[SODA-Category-Synonym-Matching-Plan]] · source posture:
SODA-EMBED-002. Engine: `apps/web/lib/matching/index.ts`.
