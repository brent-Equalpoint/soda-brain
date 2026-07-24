# SODA — Chip Bank v2 (Plan)

*A proposal, partly built. Adopt the designed seven-context chip bank as the real source of truth for
Needs, Offers, and Focus, and build the context-aware suggestion engine it was always meant to drive.
This fixes match quality at the SOURCE (the input people pick) instead of patching the output. Created
2026-06-29 at Brent's direction ("plan v2, deploy matching now"); the FOUNDATION shipped to a branch
the same day (see Status below).*

> **CORRECTION (2026-06-29, from building the foundation):** an earlier draft of this plan said to
> "point the matcher at the bank's context tags." That is WRONG and was removed. The seven contexts are
> deliberately BROAD (the `knowledge` context holds both Advice and Mentorship), so using them to decide
> category matches would make "Advice offered" meet "Mentorship needed" — exactly the over-matching the
> pilot flagged. **Contexts drive the focus SUGGESTIONS; the matching engine keeps its own curated,
> narrower synonym map** (`apps/web/lib/matching/intent.ts`, shipped). Two concerns, two groupings.

## Status (what is built vs. planned)

- **BUILT + verified, on branch `soda-chip-bank-v2` (commit 22dd339), NOT deployed:** the foundation —
  `apps/web/lib/chips/types.ts` (the seven-context taxonomy + `ChipEntry`), `apps/web/lib/chips/bank.ts`
  (the designed bank + the pilot-label pass), `apps/web/lib/chips/suggestions.ts` (`getFocusSuggestions`,
  the never-written engine). 13 tests, 75 total green. Nothing live changed.
- **PLANNED (touches live onboarding, build-and-hold for a localhost walk):** wire the focus picker to
  `getFocusSuggestions`; optionally expand the Needs/Offers menus from the bank; keep host customization.

---

## Why now (grounded in what exists)

Three things are true today, and together they make this the highest-leverage match-quality work:

1. **Two chip banks exist and have drifted.** What SHIPS (`apps/web/lib/catalog.ts`) is thin: 7 offers,
   7 needs, a flat 16-item focus list, and no context layer. What was DESIGNED (`SODA Chips Bank/bank.ts`
   in the vault) is ~3x richer (20 needs, 22 offers, ~45 focus chips) and every chip is tagged with one
   or more of a **seven-context taxonomy**.
2. **The designed suggestion engine was never built.** `bank.ts` imports `./types` (the context type +
   `ChipEntry`) and references `./suggestions` (`getFocusSuggestions`) and the design is described in its
   header comments, but **neither file exists** anywhere in the vault or the zip. So the bank is fully
   specified; the brain that consumes it is not written.
3. **The pilot proves the thin bank hurts matches.** On the real Latinos N Tech export (2026-06-24),
   people free-typed what the menu lacked: **"Leads"** (~5 people, a top-3 need), **"Networking"** (2),
   **"Social Media Strategy & Marketing"** (~4 offered it), plus "Visual Media," "Business English." And
   **"Collaboration" got over-picked** because it is the catch-all when nothing specific fits, which is
   the "everyone matches on Collaboration" noise the [[SODA-Pilot-Report-Coffee-Connect]] flagged.

The just-shipped [[SODA-Category-Synonym-Matching-Plan]] (the engine now bridges Funding↔Investment and
Hiring↔Looking-for-work) is a 2-group hand-rolled subset of the bank's taxonomy. Chip Bank v2 is its
complete, single-source superset.

## The seven contexts (the spine)

Every chip is tagged with one or more intent contexts (from `bank.ts`):

| Context | Means |
|---|---|
| **capital** | money, funding, investment, grants, loans |
| **talent** | people, hiring, team, co-founders, jobs, skills |
| **customers** | users, growth, distribution, market, leads, sales |
| **knowledge** | advice, mentorship, expertise, learning |
| **community** | introductions, network, partnerships, belonging |
| **resources** | tools, space, infrastructure, operational |
| **creative** | design, content, brand, media, storytelling |

## What the design unlocks

**1. Context-aware focus suggestions (the headline).** Today the focus picker shows all 16 focuses no
matter what you picked, mostly irrelevant. In the designed system, the focuses that surface are only
those sharing a context with your selected needs/offers. Pick **Funding** (capital) + **Mentorship**
(knowledge), and the picker offers Pre-seed, Seed, Angel, Venture, Fundraising, Product strategy,
Scaling, not Web3 or Nonprofits. This is the real fix for the generic-chip problem: a specificity layer
people will actually use because it is short and relevant, which directly sharpens every match.

**2. Less free-typing, less noise.** Richer, well-organized menus mean fewer people fall back to
"Collaboration" or type a one-off, so the room data is sharper and the matches mean more. (Not a
matching-engine change: better INPUT, so the existing engine has better data to work with.)

**A note on matching (read the correction at the top).** The contexts do NOT feed the match decision.
The matching engine keeps its curated synonym map (Investment↔Funding, Hiring↔Looking-for-work), which
is narrower than a context on purpose. If we ever want more synonym pairs, we ADD to that curated map
deliberately — we do not derive it from the broad contexts, which would over-match (Advice vs Mentorship).

## The build (proposed)

**1. Rebuild the two missing files** (DONE, commit 22dd339):
- `types.ts` — `Context` (the seven-value union), `ChipEntry`, `CONTEXTS`, `toContexts`. Done.
- `suggestions.ts` — `getFocusSuggestions(selectedNeeds, selectedOffers)`: gather the contexts of the
  selected need/offer chips, return the focus chips whose context intersects that set, **most relevant
  first** (a focus spanning more of the active contexts ranks higher), with a safe fallback to the whole
  list when nothing recognizable is selected. Done, with 13 tests. `searchBank` lives in `bank.ts`.

**2. Reconcile the bank with real usage (a label pass).** (DONE) Merged the designed bank with the
pilot-surfaced labels, each context-tagged: **Leads** (customers, as need + offer), **Networking**
(community, need), **Marketing** (customers + creative, need + offer). Sales already exists as a focus.
Add more deliberately if later exports surface new recurring words.

**3. Make the bank the single source of truth.** Replace `catalog.ts`'s flat arrays with the bank
(or have `catalog.ts` derive its lists from the bank), so onboarding, the card editor, the room, and
host customization all read one place.

**4. Wire the chip inputs to context-awareness.** The offer/need pickers search the bank by category;
the focus picker calls `getFocusSuggestions`. Keep "add your own" for anything off-menu.

**5. Leave the matching engine as shipped.** Do NOT route matching through the contexts (see the
correction at the top — it would over-match). The curated `SYNONYM_GROUPS` + focus-alignment logic in
`apps/web/lib/matching/intent.ts` stay exactly as deployed 2026-06-29. If, after the richer menus are
live, the data shows a missing synonym pair, ADD it to the curated map deliberately. Optionally
co-locate that curated map near the bank as a separate, finer "match-equivalence" list, clearly distinct
from the broad seven contexts.

**6. Preserve host per-event customization.** `events.role_options/offer_options/need_options` still
override the defaults; a custom chip with no bank entry simply carries no context (matches on its word
only), exactly as today.

## What it touches

- DONE: `apps/web/lib/chips/types.ts`, `apps/web/lib/chips/bank.ts`, `apps/web/lib/chips/suggestions.ts`
  (+ their tests).
- TODO (touches live onboarding, build-and-hold): `apps/web/lib/catalog.ts` — derive its lists from the
  bank. The chip-input components (onboarding steps, `components/card-editor.tsx`, the focus picker
  `FocusModal`) — use `searchBank` + `getFocusSuggestions`. Host settings (`settings-control.tsx`) + the
  chip APIs (`/api/event/chips`, `/api/host/chips/*`) — keep custom menus working over the new source.
- UNCHANGED: `apps/web/lib/matching/intent.ts`. The matcher does NOT read the bank's contexts (see the
  correction at the top); its tests stand as-is.

## Matching and contexts stay separate (resolved)

An earlier draft worried about how multi-context chips (Collaboration = community + creative) would
behave if contexts drove matching. That worry is now moot: **contexts never drive matching.** The matcher
uses its curated synonym map; the contexts only filter focus suggestions, where broad-is-fine (showing a
few extra relevant focuses costs nothing, unlike inventing a false match). So no bridging rule is needed.

## Decisions for you (the forks)

1. **Single source of truth:** replace `catalog.ts` with the bank, or have `catalog.ts` derive from it?
   Recommended: derive, so nothing else needs to change its imports at once.
2. **Menu depth:** the bank has 20 needs / 22 offers vs the current 7 / 7. Ship the full richer menus, or
   a curated shorter subset (with search + "add your own" covering the rest)? Recommended: a sensible
   subset surfaced by default, full bank via search, so onboarding stays a quick tap, not a long scroll.
3. **Focus picker scope:** filter focuses by the SPECIFIC chip being focused (tightest — focusing
   "Funding" shows capital focuses), or by the whole card's selections? Recommended: per-chip.
4. **Migration:** none required for stored data (chips stay `{category, context}` strings; unknown words
   keep matching on the word). Confirm we are not re-tagging old attendance rows (we are not).

## Validation

Spot-check the focus picker on real selections: pick a need/offer and confirm only the relevant focuses
surface, most relevant first (the `suggestions.ts` tests already lock this; the manual check is the feel).
After the richer menus are live, re-pull an export and confirm free-typing drops (fewer people fall back
to "Collaboration" or type a one-off). The matching engine is unchanged, so its prior validation
(see [[SODA-Session-Work-Log]], 2026-06-29) still stands; no re-run is needed for v2.

## What we are NOT doing

Not adding AI/semantic matching (the contexts are a curated, deterministic taxonomy); not re-tagging or
migrating stored chip data; not removing "add your own"; not changing the focus-alignment logic just
shipped. Pure data + logic, so the bank, the suggestion engine, and the matcher all move to the shared
`@soda/core` package per [[SODA-Native-Ready-Architecture]].

## Relationship to the shipped work

- [[SODA-Focus-Aware-Matching-Plan]] — SHIPPED 2026-06-29. Unchanged by v2 (focus alignment stays).
- [[SODA-Category-Synonym-Matching-Plan]] — SHIPPED 2026-06-29 as a 2-group curated map. **NOT superseded
  by v2.** v2 improves the INPUT (richer menus, context-aware focus suggestions); the curated synonym map
  stays the source of match equivalence. v2 complements it, it does not replace it.

## References

`SODA Chips Bank/bank.ts` (the designed bank) · `apps/web/lib/catalog.ts` (what ships) ·
`apps/web/lib/matching/intent.ts` (the curated synonym map — stays, NOT changed by v2) · the Latinos export
(`DATA/Latinos N Tech attendees Email.csv`) · [[SODA-Pilot-Report-Coffee-Connect]] (the generic-chip
evidence) · [[SODA-Native-Ready-Architecture]] · [[SODA-Backlog]].
