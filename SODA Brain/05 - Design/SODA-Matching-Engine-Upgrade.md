# SODA Matching Engine Upgrade

**Build spec for Claude Code. Extends the existing category-plus-synonym matching engine. Does not replace it.**

*The category match stays the deterministic backbone that already proved itself, 145 matches computed live on the first night, 62 mutual. Everything in this spec is a scoring layer on top of that gate, never a replacement for it.*

**Version 1.0**

---

## 0. The rule this whole document protects

**The category match is still the gate. Everything below is ranking, not filtering.**

Nothing in this spec should ever cause a real category match to disappear. What it changes is *order*: which matches get surfaced first, which nudge gets sent, which person gets a boost because the room needs them to. A low-scoring match is still a match, it just sits lower in the list. The moment this system starts hiding valid matches instead of ranking them, it has overstepped its job.

---

## 1. The scoring model

A single composite score replaces the current binary "matched or not" with a ranked score, computed per candidate pair, per room.

```
score(A, B) =
    base_category_score(A, B)          [existing engine, unchanged]
  + reciprocity_bonus(A, B)            [new, Tier 1]
  + scarcity_bonus(A, B)               [new, Tier 1]
  + room_state_bonus(A, B)             [new, Tier 1]
  + focus_bonus(A, B)                  [new, Tier 1, defaults to 0, see 2.6]
  + context_similarity_bonus(A, B)     [new, Tier 2, defaults to 0]
  - hub_penalty(A) - hub_penalty(B)    [new, Tier 1]
```

**Design property that matters more than any individual term: every new term must default to zero contribution if its data isn't available.** A room with no embeddings generated yet still gets correct rankings. A newly opened room with no gap stats yet still gets correct rankings. Nothing in this scoring model is allowed to be a hard dependency.

### 1.1 What the score actually controls, and why that split matters

This score feeds two different surfaces, and they should not be treated identically, because they carry different consequences.

**Intel tab ordering.** Every candidate pair gets shown, ranked by score, no threshold, no cutoff. Browsing a fully ranked list has no real downside even at the bottom of it, so the raw continuous score is exactly right here, unfiltered.

**Nudge selection.** A nudge is not passive browsing, it is a push, and it is already rate-limited to one per connection per seven days by locked decision. Firing an unprompted push for a marginal match spends that scarce, once-a-week slot on something the recipient did not ask to see. Nudge selection applies a separate minimum score threshold, `NUDGE_MIN_SCORE`, on top of the same ranking, so only pairings with real confidence behind them consume that interruption. A pairing can rank respectably in the Intel tab without ever clearing the bar to justify a push.

**A second nudge guard, spacing rather than a score threshold.** A pairing that is simultaneously reciprocal, scarce, and room-state boosted clears every bar at once, and several such pairings landing on the same person within minutes of each other stops feeling like the room noticing something and starts feeling like the app running a campaign, cutting directly against the room, not the app posture the rest of this product protects. `NUDGE_MIN_SPACING_MINUTES`, starting value 8, sets a minimum gap between two nudges the same recipient receives, regardless of how many matches clear `NUDGE_MIN_SCORE` at once. Extra qualifying matches queue and wait their turn rather than firing together.

**Scoped to the current event only, never a person's history across events.** Someone attending two same-day events, Coffee Connect and the Black Tech Week meetup both landing August 19th is a real case already on the calendar, should never have a nudge in the second room suppressed because the clock hadn't cleared eight minutes since a nudge in the first, unrelated room. The spacing check only ever looks at nudges logged for the event currently live.

**The score itself is never shown to an attendee, only what it produces.** Celebrations already lock this posture elsewhere in the product, signals in good fun, never scores, and this is the same rule applied here. What an attendee sees is the ordering the score produces, and the qualitative, first-name, color-coded match reasons the app manifest already describes, "you both offer what the other needs," not the 1.5 that produced that sentence. The hub penalty in particular must never surface as language of any kind, being told a version of "you have already been shown to ten people tonight" would read as a punishment, not a ranking detail, so it stays entirely invisible, a quiet effect on order, nothing a person is ever told about themselves.

---

## 2. Tier 1, build first, no new infrastructure

All four terms below are computed from data the room already has. No new tables required for the first three; the fourth reuses existing surfaced-match history.

### 2.1 Reciprocity bonus

A match where both people offer something the other needs is structurally better than a one-directional handout. Score it that way.

```
function reciprocityBonus(A, B):
  aOffers = A.currentFocus ? [A.currentFocus] : A.offers   # narrow to focus if one is set
  bOffers = B.currentFocus ? [B.currentFocus] : B.offers
  aGivesBNeeds = hasCategoryMatch(aOffers, B.needs)
  bGivesANeeds = hasCategoryMatch(bOffers, A.needs)
  if aGivesBNeeds and bGivesANeeds:
    return RECIPROCITY_BONUS      # starting value: 1.5
  return 0
```

**The narrowing line is new, and it depends on a field this document does not own.** `currentFocus` is a placeholder, confirm the real name against whatever backs the app manifest's existing "focus-aware ranking" and "focus nudges" features before implementing this. If a person has flagged what they are focused on right now, reciprocity should check against that instead of diluting across every chip they have, otherwise a person actively focused on Funding could see their Mentorship chip quietly drag a genuinely strong Funding match down the list.

### 2.2 Scarcity bonus

This is the Most Wanted computation, already built and already proven useful, folded into the score itself instead of living only in a separate report. A match on a category the room is currently short on should outrank a match on a category everyone already offers.

```
function scarcityBonus(A, B, roomGapStats):
  bonus = 0
  categories = A.currentFocus ? [A.currentFocus] : sharedMatchCategories(A, B)
  for category in categories:
    stats = roomGapStats[category]           # existing gap computation
    gapRatio = stats.needCount / max(stats.offerCount, 1)
    if gapRatio > SCARCITY_THRESHOLD and not hasRealContext(A, category):
      continue                                # a bare category claim earns no scarcity boost
    if gapRatio > SCARCITY_THRESHOLD:         # starting value: 2.0
      bonus += SCARCITY_BONUS * min(gapRatio / SCARCITY_THRESHOLD, MAX_SCARCITY_MULTIPLIER)
  return min(bonus, MAX_TOTAL_SCARCITY_BONUS)  # starting value: 4.0, caps the sum across
                                                 # every shared category, not just one
```

**The moment scarcity affects who gets surfaced, claiming a scarce category becomes worth gaming, so claiming one should cost more than tapping a chip.** `hasRealContext` checks that the chip carries real context text, not just the bare category name, before that category's scarcity bonus applies at all. This is the identical lesson Coffee Connect already taught the hard way, a category alone is nearly meaningless, specificity is where the real signal lives, just applied defensively here instead of descriptively. "Funding" earns nothing extra. "Funding, mostly pre-seed SAFE notes" does.

Same narrowing as reciprocity, same open question about the real field name.

`MAX_SCARCITY_MULTIPLIER` bounds what a single category can contribute. `MAX_TOTAL_SCARCITY_BONUS` bounds what all of them can contribute together, a pair sharing several scarce categories at once should rank well, not dominate the whole score by accumulating an uncapped sum.

`roomGapStats` is the same data already powering the Most Wanted section. Nothing new to compute, only a new place it gets used.

### 2.3 Room-state bonus

Someone who has been in the room a while with zero connections should get a quiet boost as a match target for others. This is `connected_zero`, moved from a dashboard alarm into the ranking itself.

**One edge case worth guarding against explicitly: in the first few minutes of a room, everyone's connection count is near zero, so the room average is near zero too.** Comparing against an average that close to zero either fires the bonus for almost everybody or almost nobody, and either way it isn't measuring anything real yet. The function waits for a minimum warmup period before this term turns on.

```
function roomStateBonus(A, B, roomStats):
  if roomStats.elapsedMinutes < ROOM_WARMUP_MINUTES:      # starting value: 15
    return 0                                               # too early, the average is noise, not signal
  bonus = 0
  for person in [A, B]:
    if person.connectionCount == 0:
      bonus += ZERO_CONNECTION_BONUS         # starting value: 1.0
    elif person.connectionCount < roomStats.averageConnections * 0.5:
      bonus += LOW_CONNECTION_BONUS          # starting value: 0.5
  return bonus
```

### 2.4 Hub-spreading penalty

The failure mode worth naming plainly: a pure similarity ranking recommends the person with the most generically complete profile to everyone, and that person absorbs all the connection density in the room while someone with a sparser but genuinely well-matched profile never surfaces. Coffee Connect's top connector had 18 matches in a 19-person room. Worth watching before it becomes the pattern rather than the outlier.

**A precise definition, since this term decides everything downstream: a surface is any time a person appears in another person's displayed top-N list**, in the Intel tab or as an actual nudge, where N is `SURFACE_TOP_N`, starting value: 5. Computing a match does not count, every candidate pair gets computed for everyone regardless. Only being shown counts. Computation is free and universal; being shown is the actual mechanism that creates the hub effect in the first place, so the penalty has to track that, not the underlying computation.

```
function hubPenalty(person, event):
  surfaceCount = countPriorSurfaces(person, event)   # reuse existing nudge/surfaced-match history
  return HUB_PENALTY_RATE * min(surfaceCount, HUB_PENALTY_CAP)   # starting rate: 0.15, cap: 10
```

`countPriorSurfaces` should query however matches or nudges already get logged for an event, this is a lightweight approximation of stable matching, not a full implementation of it, and it is meant to be cheap enough to recompute on every ranking pass. **Reset per event. Never carry a person's hub-penalty into their next room.** A well-connected profile in one room is not a liability in the next one.

If no existing surfaced-match log is available to query, the fallback is a small counter table:

```sql
create table match_surface_counts (
  event_id     uuid references events(id),
  passport_id  uuid references passports(id),
  surfaced_at  timestamptz not null default now()
);
```

Prefer counting from whatever already logs a nudge or match surface. Add this table only if nothing else already does that job.

### 2.5 Backtest before going live

Four real events already produced chip, connection, and warmth data, Coffee Connect, Latinos N Tech, Chase, Creative Meetups. **Before Phase 1 scoring runs in a live room for the first time, run it against that historical data first.** Two checks specifically: would the hub-spreading penalty have actually pulled Lorena Medina's 18-match concentration at Coffee Connect toward a more even spread, and would the scarcity bonus have correctly ranked Looking for Work and Funding, the two real Most Wanted gaps that night, above the room's most common and most generic chip. If the backtest doesn't show both clearly, the starting constants are wrong before a single live room ever sees them, and that is a far cheaper place to find out than during an actual event.

---

### 2.6 Focus bonus, and the open dependency it has on the existing engine

Everything above treats a person's offers and needs as one flat set. That is wrong the moment someone has actively flagged what they are focused on right now, the app manifest already lists focus-aware ranking and focus nudges as live features, sitting next to open-to-talk status, which means focus is a real, in-the-moment signal this scoring model has been ignoring.

```
function focusBonus(viewer, candidate):
  if not viewer.currentFocus:
    return 0                                   # graceful default, nobody has to set one
  if candidateOffersTopic(candidate, viewer.currentFocus):
    return FOCUS_BONUS                          # starting value: 1.5, same weight class as reciprocity
  return 0
```

**This is written from one person's point of view on purpose.** A person's own focus should shape their own ranked list. Whether the candidate also happens to be focused on the same thing is a separate question, not folded into this term, keep it simple until there is a real reason not to.

**The honest unknown here, flagged rather than guessed past:** this document never speced the base category score, and the existing engine may already do some version of focus narrowing at that layer. Confirm what the current focus-aware ranking actually does before implementing `focusBonus` and the narrowing added to 2.1 and 2.2, it is entirely possible less new work is needed than this section assumes, or that the field name and matching logic already exist under a different shape than `currentFocus` and `candidateOffersTopic` as written here.

### 2.7 Sole-source load, a welfare guard, not a fairness one

The hub penalty and this guard solve different problems, worth being precise about the difference. Hub-spreading corrects a *ranking* distortion, an accidentally generic profile absorbing attention that would have been better spread around. This guard protects a *person*, someone who is genuinely the only offer for something several people need at once, from being individually pushed at by every single one of them in the same night. Section 4 already establishes that hub-spreading cannot and should not fix a true sole source. This is the other half of that honesty, the model does not get to just let a sole source absorb unlimited simultaneous attention because the ranking was technically correct.

```
function soleSourceLoad(candidate, event):
  return count of distinct people who currently have candidate as their #1 ranked
         match and have not yet connected with them

function nudgeAllowed(candidate, event):
  if soleSourceLoad(candidate, event) >= SOLE_SOURCE_NUDGE_CAP:   # starting value: 3
    return false
  return true
```

**Hitting the cap does not mean the room's real gap disappears, it means the individual-nudge channel stops being the right tool for it.** Once `soleSourceLoad` crosses the cap, that person and their scarce category become a direct input to `detectConveneClusters` in section 4, the exact mechanism already built for "several people want the same thing, this is a group moment, not four separate one-to-one pushes." A host seeing that suggestion can run one session instead of the room continuing to individually target one person all night. The guard does not silently drop the remaining people's real need, it redirects it to the tool built for exactly this shape of problem.

**Resets per event, same as the hub penalty, for the same reason.** Being the room's only offer for something scarce at one event says nothing about the next one, a different room could have three people offering the same thing, or nobody who needs it at all. `soleSourceLoad` is computed fresh per event, never carried forward, and never accumulates into anything resembling a standing flag on a person.

## 3. Tier 2, embeddings, natural pairing with the existing roadmap

This is the same `pgvector` initiative already sitting in the backlog under Tier 2 scale. The matching upgrade gives it a concrete first job: widening what counts as similar within a category, so "UX design" and "product design" can be recognized as close even though a hand-curated synonym list will never scale to cover every real phrasing.

**The boundary that matters: embeddings widen the candidate pool. They never replace the category gate.** A high embedding similarity between two context strings is a reason to rank a pairing higher, never a reason to create a match where no category overlap exists at all.

```sql
alter table [attendance chips table] add column context_embedding vector(1536);
```

```
function contextSimilarityBonus(A, B):
  if not (A.contextEmbedding and B.contextEmbedding):
    return 0                                  # graceful default, no embedding yet
  similarity = cosineSimilarity(A.contextEmbedding, B.contextEmbedding)
  return similarity * CONTEXT_WEIGHT           # starting weight: 1.0
```

**Generation is asynchronous, never on the room's critical path.** Same discipline already locked for AI extraction: nothing about the live room waits on an API call. Generate the embedding when a context string is saved, not when a match is computed.

**Cache by normalized context string, not by person.** "Early-stage startups" will recur across many people's cards. Generate it once, reuse the vector, this is the same cost discipline already applied to chip extraction, embeddings are cheap and fast, but there is no reason to pay for the same string twice.

---

## 4. Tier 3, cluster detection, needs product validation before a full build

The Gap and Chip Bingo already encode this insight in game form: sometimes the right output for four people who all want a technical co-founder is not four separate one-to-one nudges, it is one convene. This tier is about detecting that cluster automatically instead of relying on a host to notice it.

```
function detectConveneClusters(event, roomGapStats):
  clusters = []
  for category in roomGapStats where gapRatio > CONVENE_GAP_THRESHOLD:
    peopleWithThisNeed = findPeopleNeeding(category, event)
    if peopleWithThisNeed.length >= MIN_CONVENE_SIZE:      # starting value: 3
      clusters.append({ category, people: peopleWithThisNeed })
  return clusters
```

**A second, more targeted trigger feeds this same function.** Section 2.7's sole-source load cap is not just a nudge guard, once a sole source hits `SOLE_SOURCE_NUDGE_CAP`, that specific person and category should be passed into `detectConveneClusters` directly, not wait for the general room-wide gap scan to notice the same thing later. The two paths land in the same place, a host-facing suggestion, but the sole-source trigger is faster and more specific, it already knows exactly who is overloaded, not just that a category is thin.

**This never auto-fires a convene.** Same two-call-gate posture as drafts and nudges everywhere else in the product: the system detects a cluster and surfaces it to the host as a suggestion, the host decides whether to fire it, exactly the same shape as the existing Moment Creator. A detected cluster that never becomes a convene is not a bug, it means the host judged the moment wasn't right.

**Why this is Tier 3 and not Tier 1:** the algorithm is the easy part. Whether an automatically surfaced "four people want this" suggestion feels helpful to a host mid-event, or feels like the product telling them how to run their own room, is a product question that needs a real event to answer, not something to resolve at a whiteboard. Build the detection function, but validate the host-facing surface with a small test before it becomes a standing feature.

---

## 5. Deferred: outcome-based learning

Worth naming explicitly rather than leaving it as a silent gap. SODA has something most matching systems never get: real signal on whether a match actually survived, the considered ratio, warmth at 7, 21, and 60 days. In principle, category pairings that reliably produce connections people write a real why for, and keep warm, could earn a small automatic weight increase over time. Pairings that produce a lot of collected-but-abandoned adds could quietly lose weight.

**This is explicitly out of scope for this build.** The honest risk: outcome-based learning on social data can encode bias that was never intended. If certain pairings show lower follow-through for reasons that have nothing to do with match quality, room composition, timing, who happened to be tired that night, an automated system should not learn to quietly suppress them. This needs real volume across many more events, and it needs a human actively watching what it learns, not a background job adjusting weights unsupervised.

**A concrete version of that exact risk, worth naming now even though the learning itself is deferred:** if a sole source's night produces several shallow, distracted connections because they were the only offer for something six people needed at once, section 2.7's cap should keep that from happening going forward, but any future outcome analysis run on the events before it existed would see a category that "doesn't retain," not a person who was overloaded. Load has to be a control variable in any future outcome-based work, not just match category and considered-ratio, or the system would learn to quietly deprioritize a scarce, valuable category for a reason that was never really about the category at all.

**What to do instead, right now:** after each event, look at whether the new scoring system's top-ranked matches actually correlate with higher considered ratios and better warmth retention than the old flat ranking did. That's manual validation of the scoring constants, not automated learning, and it is the honest middle ground between shipping blind and shipping something that quietly teaches itself the wrong lesson.

---

## 6. Acceptance criteria

1. The existing category-plus-synonym match remains the sole gate for whether two people are considered candidates at all. Nothing in this spec removes or bypasses it.
2. The composite score, and every individual term inside it, is never rendered to an attendee in any surface. Only its effects, ordering and qualitative match-reason language, are visible. The hub penalty specifically is never referenced in any copy shown to a person, about themselves or anyone else.
3. Reciprocity, scarcity, and room-state bonuses are computed entirely from data already available in the room, existing gap stats, existing connection counts. No new external calls required for Tier 1.
4. The hub-spreading penalty counts only pairs actually shown to a person, in the Intel tab or as a nudge, never every computed candidate. It resets per event and never carries into a person's next room.
5. Intel tab ordering uses the full continuous score with no cutoff. Nudge selection applies a separate minimum score threshold on top of the same ranking, since a nudge is a rate-limited push, not passive browsing, and should not spend that limit on a marginal match.
6. The room-state bonus does not activate until the room has passed a minimum warmup period. In the first minutes of a room, the room-wide average connection count is too close to zero to be a meaningful comparison.
7. The scoring system always produces a ranking, never a hard cutoff. A low-scoring category match is still shown, only lower in the list, never hidden.
8. Context-similarity scoring defaults to zero contribution when an embedding is unavailable or not yet generated. The system produces correct rankings without it.
9. Embedding generation never blocks the live room. It runs asynchronously on chip save, with normalized-string caching to avoid generating the same context twice.
10. Cluster detection only ever surfaces a suggested convene to a host. It never fires a convene automatically.
11. All scoring constants, bonuses, thresholds, the penalty rate, the nudge minimum, the warmup period, are configurable values, not hardcoded numbers, and get reviewed against real considered-ratio and warmth-decay data after each event before being adjusted.
12. `SURFACE_TOP_N` defines exactly what counts as a surface for the hub-spreading penalty. Appearing in a computed candidate list never counts, only appearing within the top N of a person's displayed list does.
13. Scarcity bonus is bounded twice, once per category by `MAX_SCARCITY_MULTIPLIER`, and once in total by `MAX_TOTAL_SCARCITY_BONUS`. A pair sharing many scarce categories cannot accumulate an unbounded sum.
14. Before Phase 1 ships to a live room, the scoring constants are backtested against the four existing events' historical data, specifically checked against two known outcomes: whether the hub penalty would have spread density away from Coffee Connect's top connector, and whether the scarcity bonus would have correctly ranked the room's real Most Wanted gaps above its most generic, most common chip.
15. Focus bonus defaults to zero contribution when no focus is set, and never blocks scoring for anyone who never touches the feature.
16. Before `focusBonus` and the narrowing in reciprocity and scarcity are implemented, the existing focus-aware ranking behavior already present in the base engine is confirmed, including the real field name behind `currentFocus`, so this addition does not duplicate logic that already exists at a different layer.
17. A scarce category earns no scarcity bonus unless the underlying chip carries real context text. A bare category claim never qualifies, regardless of how scarce that category currently is.
18. No recipient receives two nudges closer together than `NUDGE_MIN_SPACING_MINUTES`, even when multiple pairings clear `NUDGE_MIN_SCORE` at the same moment. Extra qualifying matches queue rather than fire together.
19. Once a sole source's `soleSourceLoad` reaches `SOLE_SOURCE_NUDGE_CAP`, no further individual nudge points at them for that category. That load and category are passed directly to `detectConveneClusters` instead of being silently dropped.
19a. `soleSourceLoad` resets per event and never carries forward. A person capped at one event starts the next event with no memory of it, the same discipline already locked for the hub penalty.
19b. `NUDGE_MIN_SPACING_MINUTES` only ever considers nudges logged for the currently live event. A nudge from a different event, including one earlier the same day, never counts toward another event's spacing check.
20. Any future outcome-based learning proposal must include sole-source load as a control variable alongside match category and considered-ratio, so a category is never blamed for a retention problem that was actually caused by one person being overloaded on one specific night.
21. Outcome-based automatic weight learning is explicitly out of scope for this build and requires a separate proposal, real event volume, and active bias review before any future implementation.

---

## 7. Build order

**Phase 1.** Reciprocity, scarcity, room-state bonuses, hub-spreading penalty. Pure scoring math against data the room already computes. No new infrastructure. Ships fastest, and it's the change most directly aimed at the two problems already observed live, generic overlap crowding out real gaps, and one person absorbing all the connection density. **Backtest against the four existing events before this ever runs in a live room, see section 2.5.**

**Phase 2.** Embeddings and `pgvector` context similarity. New infrastructure, but it's the same initiative already sitting in the roadmap's Tier 2, this spec just gives it its first concrete job.

**Phase 3.** Cluster detection, surfaced to the host as a convene suggestion. Build the detection function once Phase 1 data (gap stats, connection counts) has been live long enough to trust. Validate the host-facing suggestion at one real event before treating it as a standing feature.

**Deferred, not scheduled.** Outcome-based automatic learning. Revisit only after enough events have run through Phase 1 and 2 to have real considered-ratio and warmth data to validate against, and only with a human actively reviewing what the system would learn before any weight gets adjusted automatically.

---

## 8. The one sentence version

**The category engine still decides who is a candidate. Everything in this spec only decides who gets shown first, and it does that with data the room already has, reciprocity, scarcity, who's been standing alone, and who's already been recommended to everyone else tonight.**
