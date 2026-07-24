# SODA — Focus-Aware Matching (Plan)

*A proposal, not a build. Make the matching engine reward **focus alignment**, so "Collaboration in AI"
meeting "Collaboration in AI" outranks "Collaboration in AI" meeting "Collaboration in real estate",
without losing any real pairs. Created 2026-06-28 at Brent's direction ("plan it"). Builds on the
specific-chips fix from [[SODA-Pilot-Report-Coffee-Connect]] and uses the focus picker already shipped.
No code yet, consistent with how we've been working.*

---

## The current logic (grounded in the code)

- A chip is `{ category, context }`. `category` is the topic (Mentorship, Collaboration). `context` is
  the **focus** ("Design"), capped at 40 chars, **defaults to empty** when none is set, and is chosen
  from a structured 16-item menu (`FOCUS_OPTIONS`: Design, Engineering, Product, AI, Web3, ...) or typed.
- The engine (`apps/web/lib/matching/index.ts`) makes a match when **one person offers a category another
  needs**. It keys on **category only**: its own comment says *"the context never affects whether two
  people match, it just rides along."*
- **So focus is captured, shown, and feeds the nudge wording, but it does not affect the match.**

## The problem (the insight to fix)

Because focus is ignored in the decision, **"Collaboration in AI" needing and "Collaboration in real
estate" offering is treated as an equal match to two people who both focus on AI.** The room fills with
broad, low-signal pairs sitting next to genuinely aligned ones, with no way to tell them apart. The
engine *under-filters*.

## The principle (the important part)

**Focus should STRENGTHEN and RANK a match, never hard-gate it.** Two reasons not to simply delete
focus-mismatched pairs:
1. **Don't lose real (looser) connections or serendipity** — two collaborators in different fields can
   still be worth introducing.
2. **Free-text focus is messy** — "AI" vs "A.I." vs "machine learning". A hard requirement would wrongly
   reject real pairs. Ranking is forgiving where a hard filter is brittle.

## The design

**1. The match decision stays exactly as it is** (category overlap, the proven engine). No pair is lost.

**2. Classify the focus of every overlapping chip** (pair the giver's offer chip with the receiver's
need chip of the same category, compare their `context`, case-insensitive + trimmed):
- **Aligned** — both contexts present and equal ("Collaboration in AI" ↔ "Collaboration in AI").
- **Divergent** — both present but different ("...in AI" ↔ "...in real estate"). The weak case.
- **Unscoped** — one or both contexts empty ("Collaboration" with no focus). Not a mismatch, just
  unspecified, treated as neutral.

**3. Rank and label, don't reject:**
- Sort order becomes **mutual first, then most aligned, then overlap count** (today it's mutual then
  count). Aligned pairs rise to the top.
- Each match carries an **alignment summary** (counts of aligned / divergent / unscoped, or a simple
  `aligned | broad` label) so the Intel view and the room can show *"Collaboration in AI (aligned)"* vs
  *"Collaboration (broad)"*.
- The **Nudge queue prioritizes aligned matches**, so the host nudges the strongest pairs first.

**4. Keep `score` meaning intact** (category-overlap count) so nothing downstream breaks; add the
alignment as new, separate information.

## What it touches (small, contained)

- `apps/web/lib/matching/index.ts` — extend `overlap` to pair offer-chip with need-chip and classify
  focus; add the alignment tally; weight the sort.
- `packages/contracts/src/matching.ts` — add an alignment field to `MatchSchema`.
- `apps/web/lib/match-format.ts` — render the aligned / broad label.
- The **Intel** view (host cockpit) + the **Nudge** queue — surface aligned-first + the label.
- `apps/web/lib/matching/index.test.ts` — add focus-alignment cases.

## Why it's safe

The **set of matches does not shrink** — the same pairs still match on category. Only the *ranking*, a
*label*, and *extra detail* are added. No one loses a connection; aligned ones simply rise. The engine
stays a pure, deterministic, tested function. Backward-compatible.

## Validation

Extend the unit test with aligned / divergent / unscoped cases. Optionally **re-run it on the Coffee
Connect export** to watch the generic "Collaboration" pairs sink and the specific ones rise, the visible
proof it works.

## Decisions for you (the forks)

1. **Divergent matches: rank-low + label, or hide entirely?** Recommended: **keep, rank low, label
   "broad"** (never hide, don't lose serendipity).
2. **How much should alignment boost ranking?** A tunable weight; start by sorting aligned-first within
   each mutual/one-way tier.
3. **Unscoped (no focus) = neutral, right?** Recommended yes (it's unspecified, not a mismatch).
4. **Free-text focus matching:** exact normalized match now; semantic/synonyms later.

## Related sibling (note, not in scope here)

The same exported data exposes a **category-synonym** gap: a *Funding* need and an *Investment* offer are
the same intent but different category strings, so the engine misses them (the pilot's "Funding 4 need /
0 offer" while Investment was on offer). The engine comment flags this ("Capital ≈ Funding"). It's a
natural follow-on to focus-aware matching but a separate change; logging it alongside.

## What we are NOT doing

Not changing the match decision (category still makes the match), not hard-rejecting divergent pairs, no
semantic/AI matching yet, and no code until this is approved. Pure logic, so it later moves to the shared
`@soda/core` package per [[SODA-Native-Ready-Architecture]].

## References

[[SODA-Pilot-Report-Coffee-Connect]] (the specific-chips precursor) · [[SODA-Backlog]] ·
[[SODA-Native-Ready-Architecture]]. Engine: `apps/web/lib/matching/index.ts`; chip shape:
`packages/contracts/src/attendance.ts`; focus menu: `apps/web/lib/catalog.ts` (`FOCUS_OPTIONS`).
