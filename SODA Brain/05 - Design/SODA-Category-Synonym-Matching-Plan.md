# SODA — Category-Synonym Matching (Plan)

*A proposal, not a build. Let the matching engine recognize that different words can mean the same
intent, so an **Investment** offer meets a **Funding** need, and a **Hiring** offer meets a **Looking for
work** need, instead of missing them. Created 2026-06-28 at Brent's direction ("plan it"). Sibling of
[[SODA-Focus-Aware-Matching-Plan]]; both sharpen the same engine. No code yet.*

---

## Current logic + the gap (grounded in the code)

The engine matches on the **exact category string** (case-insensitive). Looking at your real catalog
(`apps/web/lib/catalog.ts`):

- **Offers:** Introductions, Advice, Mentorship, Feedback, **Hiring**, **Investment**, Collaboration.
- **Needs:** Introductions, Advice, Mentorship, Feedback, **Looking for work**, **Funding**, Collaboration.

The shared words (Introductions, Advice, Mentorship, Feedback, Collaboration) match fine. But notice:
**"Hiring" only exists as an offer, "Looking for work" only as a need**, and **"Investment" only as an
offer, "Funding" only as a need.** They are complementary intents, a hiring manager and a job-seeker, an
investor and a founder raising, but because the *words differ*, the engine **can never match them.** The
engine's own comment flags this ("Capital ≈ Funding ... a future enhancement").

## The pilot evidence (why this matters)

Coffee Connect's "Most Wanted" gaps were **Looking for work (5 need / 0 offer)** and **Funding (4 need /
0 offer)**. Those may be **partly phantom gaps**: if anyone in that room offered **Hiring** or
**Investment**, the supply existed, the engine just couldn't see it across the word difference. So
real, high-value connections (a job, a check) may have been **sitting in the room and never surfaced.**
That is the single most valuable thing this fixes.

## The key difference from focus-aware matching

- **Focus-aware** only *re-ranks* existing matches, no new pairs, very safe.
- **Synonyms *add* matches** (they recover pairs the engine currently misses). So this **changes
  results**, which means the equivalence list must be **curated conservatively** and **validated**, or it
  could create false matches.

## The design

**1. A curated equivalence map (recommended over AI, for now).** A small, explicit set of "same intent"
groups, one source of truth (a shared constant like `FOCUS_OPTIONS`). Start **conservative**, only true
synonyms, not merely "related" ideas:
- **employment:** { Hiring, Looking for work }
- **capital:** { Investment, Funding, Capital }
- (candidates to weigh: Introductions ≈ Networking ≈ Connections. **Not** Advice ≈ Mentorship, too
  different, merging would over-match.)

**2. Match on equivalence, not exact string.** The engine treats two categories as matching if they are
the same word **or in the same group**. The existing offer-meets-need direction is unchanged, so a
*Hiring* offer now meets a *Looking for work* need.

**3. Apply the same grouping to the "Most Wanted" gaps.** Count supply and demand by *intent group*, so
the gap analysis shows what is **truly** unmet (Looking-for-work demand nets against Hiring supply)
instead of phantom gaps. The host intelligence gets more honest, not just the matches.

**4. Be transparent.** Label a synonym match so it's clear *why* it fired, e.g. *"Hiring ↔ Looking for
work (related)"*. Never silently pretend two different words are identical, hosts should trust the logic.

**5. Composes with focus-aware matching.** Resolve category equivalence first (do the intents meet?),
then score focus alignment on top. The two stack cleanly.

## What it touches (small, contained)

- A shared **equivalence map** constant (with `FOCUS_OPTIONS`, native-ready for `@soda/core`).
- `apps/web/lib/matching/index.ts` — the category comparison (`overlap`) uses the map; the gap tally
  groups by intent.
- `apps/web/lib/match-format.ts` + Intel / Nudge surfaces — the "related" label.
- `apps/web/lib/matching/index.test.ts` — synonym + gap-grouping cases.

## Why it needs care (more than focus-aware)

Because it **adds** matches, a too-broad map creates false pairs. Mitigations: a **conservative**
curated list, **transparency** (the "related" label), **tests**, and a **re-run on the Coffee Connect
export** to review exactly which new matches appear before trusting it.

## Decisions for you (the forks)

1. **Curated map now, or semantic/AI later?** Recommended: **curated now** (your catalog is small and
   known; deterministic and controllable). Semantic later for custom/free-text categories.
2. **Which groups to start with?** Recommended: **employment** and **capital** only (the two the pilot
   exposed). Add more deliberately.
3. **Label synonym matches "related"?** Recommended yes (transparency).
4. **Global map now, per-event custom later?** Recommended global now.
5. **Group the gaps by intent too?** Recommended yes (more honest "Most Wanted").

## Validation

**Re-run the engine on the Coffee Connect export.** If the "Funding 0-offer" / "Looking-for-work 0-offer"
gaps shrink once Investment/Hiring are recognized, that is direct proof, and tells you whether real
connections were missed that night.

## Future (noted, not in scope)

- **Semantic matching** (embeddings) for arbitrary custom categories ("A.I." ≈ "artificial
  intelligence"), could use the existing Anthropic stack; heavier, non-deterministic, do only when custom
  chips proliferate.
- **Per-event synonym maps** for hosts who tailor their chip menus.

## What we are NOT doing

Not making the map broad or "fuzzy", not adding AI/semantic matching yet, not merging merely-related
concepts, and no code until approved. Pure data + logic, so it moves to `@soda/core` per
[[SODA-Native-Ready-Architecture]].

## References

[[SODA-Focus-Aware-Matching-Plan]] (the sibling; stacks with this) ·
[[SODA-Pilot-Report-Coffee-Connect]] (the phantom-gaps evidence) · [[SODA-Backlog]]. Engine:
`apps/web/lib/matching/index.ts`; catalog: `apps/web/lib/catalog.ts`.
