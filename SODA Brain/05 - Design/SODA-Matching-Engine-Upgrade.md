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
  + context_similarity_bonus(A, B)     [new, Tier 2, defaults to 0]
  - hub_penalty(A) - hub_penalty(B)    [new, Tier 1]
```

**Design property that matters more than any individual term: every new term must default to zero contribution if its data isn't available.** A room with no embeddings generated yet still gets correct rankings. A newly opened room with no gap stats yet still gets correct rankings. Nothing in this scoring model is allowed to be a hard dependency.

### 1.1 What the score actually controls, and why that split matters

This score feeds two different surfaces, and they should not be treated identically, because they carry different consequences.

**Intel tab ordering.** Every candidate pair gets shown, ranked by score, no threshold, no cutoff. Browsing a fully ranked list has no real downside even at the bottom of it, so the raw continuous score is exactly right here, unfiltered.

**Nudge selection.** A nudge is not passive browsing, it is a push, and it is already rate-limited to one per connection per seven days by locked decision. Firing an unprompted push for a marginal match spends that scarce, once-a-week slot on something the recipient did not ask to see. Nudge selection applies a separate minimum score threshold, `NUDGE_MIN_SCORE`, on top of the same ranking, so only pairings with real confidence behind them consume that interruption. A pairing can rank respectably in the Intel tab without ever clearing the bar to justify a push.

---

## 2. Tier 1, build first, no new infrastructure

All four terms below are computed from data the room already has. No new tables required for the first three; the fourth reuses existing surfaced-match history.

### 2.1 Reciprocity bonus

A match where both people offer something the other needs is structurally better than a one-directional handout. Score it that way.

```
function reciprocityBonus(A, B):
  aGivesBNeeds = hasCategoryMatch(A.offers, B.needs)
  bGivesANeeds = hasCategoryMatch(B.offers, A.needs)
  if aGivesBNeeds and bGivesANeeds:
    return RECIPROCITY_BONUS      # starting value: 1.5
  return 0
```

### 2.2 Scarcity bonus

This is the Most Wanted computation, already built and already proven useful, folded into the score itself instead of living only in a separate report. A match on a category the room is currently short on should outrank a match on a category everyone already offers.

```
function scarcityBonus(A, B, roomGapStats):
  bonus = 0
  for category in sharedMatchCategories(A, B):
    stats = roomGapStats[category]           # existing gap computation
    gapRatio = stats.needCount / max(stats.offerCount, 1)
    if gapRatio > SCARCITY_THRESHOLD:         # starting value: 2.0
      bonus += SCARCITY_BONUS * min(gapRatio / SCARCITY_THRESHOLD, MAX_SCARCITY_MULTIPLIER)
  return min(bonus, MAX_TOTAL_SCARCITY_BONUS)  # starting value: 4.0, caps the sum across
                                                 # every shared category, not just one
```

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

**This never auto-fires a convene.** Same two-call-gate posture as drafts and nudges everywhere else in the product: the system detects a cluster and surfaces it to the host as a suggestion, the host decides whether to fire it, exactly the same shape as the existing Moment Creator. A detected cluster that never becomes a convene is not a bug, it means the host judged the moment wasn't right.

**Why this is Tier 3 and not Tier 1:** the algorithm is the easy part. Whether an automatically surfaced "four people want this" suggestion feels helpful to a host mid-event, or feels like the product telling them how to run their own room, is a product question that needs a real event to answer, not something to resolve at a whiteboard. Build the detection function, but validate the host-facing surface with a small test before it becomes a standing feature.

---

## 5. Deferred: outcome-based learning

Worth naming explicitly rather than leaving it as a silent gap. SODA has something most matching systems never get: real signal on whether a match actually survived, the considered ratio, warmth at 7, 21, and 60 days. In principle, category pairings that reliably produce connections people write a real why for, and keep warm, could earn a small automatic weight increase over time. Pairings that produce a lot of collected-but-abandoned adds could quietly lose weight.

**This is explicitly out of scope for this build.** The honest risk: outcome-based learning on social data can encode bias that was never intended. If certain pairings show lower follow-through for reasons that have nothing to do with match quality, room composition, timing, who happened to be tired that night, an automated system should not learn to quietly suppress them. This needs real volume across many more events, and it needs a human actively watching what it learns, not a background job adjusting weights unsupervised.

**What to do instead, right now:** after each event, look at whether the new scoring system's top-ranked matches actually correlate with higher considered ratios and better warmth retention than the old flat ranking did. That's manual validation of the scoring constants, not automated learning, and it is the honest middle ground between shipping blind and shipping something that quietly teaches itself the wrong lesson.

---

## 6. Acceptance criteria

1. The existing category-plus-synonym match remains the sole gate for whether two people are considered candidates at all. Nothing in this spec removes or bypasses it.
2. Reciprocity, scarcity, and room-state bonuses are computed entirely from data already available in the room, existing gap stats, existing connection counts. No new external calls required for Tier 1.
3. The hub-spreading penalty counts only pairs actually shown to a person, in the Intel tab or as a nudge, never every computed candidate. It resets per event and never carries into a person's next room.
4. Intel tab ordering uses the full continuous score with no cutoff. Nudge selection applies a separate minimum score threshold on top of the same ranking, since a nudge is a rate-limited push, not passive browsing, and should not spend that limit on a marginal match.
5. The room-state bonus does not activate until the room has passed a minimum warmup period. In the first minutes of a room, the room-wide average connection count is too close to zero to be a meaningful comparison.
6. The scoring system always produces a ranking, never a hard cutoff. A low-scoring category match is still shown, only lower in the list, never hidden.
7. Context-similarity scoring defaults to zero contribution when an embedding is unavailable or not yet generated. The system produces correct rankings without it.
8. Embedding generation never blocks the live room. It runs asynchronously on chip save, with normalized-string caching to avoid generating the same context twice.
9. Cluster detection only ever surfaces a suggested convene to a host. It never fires a convene automatically.
10. All scoring constants, bonuses, thresholds, the penalty rate, the nudge minimum, the warmup period, are configurable values, not hardcoded numbers, and get reviewed against real considered-ratio and warmth-decay data after each event before being adjusted.
11. `SURFACE_TOP_N` defines exactly what counts as a surface for the hub-spreading penalty. Appearing in a computed candidate list never counts, only appearing within the top N of a person's displayed list does.
12. Scarcity bonus is bounded twice, once per category by `MAX_SCARCITY_MULTIPLIER`, and once in total by `MAX_TOTAL_SCARCITY_BONUS`. A pair sharing many scarce categories cannot accumulate an unbounded sum.
13. Before Phase 1 ships to a live room, the scoring constants are backtested against the four existing events' historical data, specifically checked against two known outcomes: whether the hub penalty would have spread density away from Coffee Connect's top connector, and whether the scarcity bonus would have correctly ranked the room's real Most Wanted gaps above its most generic, most common chip.
14. Outcome-based automatic weight learning is explicitly out of scope for this build and requires a separate proposal, real event volume, and active bias review before any future implementation.

---

## 7. Build order

**Phase 1.** Reciprocity, scarcity, room-state bonuses, hub-spreading penalty. Pure scoring math against data the room already computes. No new infrastructure. Ships fastest, and it's the change most directly aimed at the two problems already observed live, generic overlap crowding out real gaps, and one person absorbing all the connection density. **Backtest against the four existing events before this ever runs in a live room, see section 2.5.**

**Phase 2.** Embeddings and `pgvector` context similarity. New infrastructure, but it's the same initiative already sitting in the roadmap's Tier 2, this spec just gives it its first concrete job.

**Phase 3.** Cluster detection, surfaced to the host as a convene suggestion. Build the detection function once Phase 1 data (gap stats, connection counts) has been live long enough to trust. Validate the host-facing suggestion at one real event before treating it as a standing feature.

**Deferred, not scheduled.** Outcome-based automatic learning. Revisit only after enough events have run through Phase 1 and 2 to have real considered-ratio and warmth data to validate against, and only with a human actively reviewing what the system would learn before any weight gets adjusted automatically.

---

## 8. The one sentence version

**The category engine still decides who is a candidate. Everything in this spec only decides who gets shown first, and it does that with data the room already has, reciprocity, scarcity, who's been standing alone, and who's already been recommended to everyone else tonight.**
