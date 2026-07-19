# SODA External Content Chip Assist

**Build spec for Claude Code. Extends the existing card builder and chip suggestion flow. Does not replace it.**

*A person's real, public work becomes matchable instead of sitting behind whatever three generic words they had time to type at the door. Nothing here reads anyone who did not choose to be read.*

**Version 1.0**

---

## 0. The rule this whole document protects

**This only ever runs on something a person handed over themselves.** A channel they typed in, a bio they pasted. Never a profile looked up on their behalf, never anything pulled from a platform without them sitting in front of the card builder choosing to share it. Section 3 of the earlier alternatives discussion already ruled out scraping on both technical and legal grounds. This spec does not revisit that. It builds the version that was always the right one anyway.

**And nothing gets written to a real chip until the person approves it.** Same two-call gate as drafts, nudges, and every other AI-touched surface in this product. AI drafts, a person confirms, only then does it become real.

---

## 1. The mechanism, in one pass

```
Person connects a source (channel handle or pasted bio)
  -> stored as raw content, tied to their Passport, nothing else happens yet
  -> on request, sent to Claude with one job: suggest 2 to 3 chips
  -> suggestions returned to the client, not written anywhere
  -> person taps accept, edit, or dismiss on each one
  -> an accepted suggestion becomes an ordinary chip,
     through the exact same write path a hand-typed chip already uses
```

Nothing downstream of "accepted" is new. The matching engine, the reciprocity and scarcity scoring, the Intel tab, all of it already treats every chip identically regardless of where it came from. This spec only touches how a chip gets suggested, never how it behaves once it exists.

---

## 2. Two input paths, one schema

**YouTube**, because it is the one platform in this stack where public data is genuinely public. A channel handle is enough, no OAuth required just to read a channel's own description and recent video titles through the YouTube Data API.

**Pasted bio**, for everything else. LinkedIn and Instagram do not hand over structured third-party data, covered in the prior discussion, so the honest version here is a text box: the person pastes their own LinkedIn About section or Instagram bio, the same words already sitting on their public profile, into SODA directly. No API, no app review, no platform dependency to break later.

```sql
create table external_content_sources (
  id           uuid primary key default gen_random_uuid(),
  passport_id  uuid references passports(id),
  source_type  text not null,      -- 'youtube_channel' | 'pasted_bio'
  source_ref   text,               -- channel handle, null for pasted text
  raw_content  text not null,      -- channel description + recent titles, or the pasted bio
  added_at     timestamptz not null default now()
);
```

Both paths land in the same table, same shape, same downstream handling. The AI prompt in section 3 never needs to know which one it is looking at.

---

## 3. The suggestion call

**Check before building a new endpoint: `/api/chips/suggest` already exists** in the current API surface. Confirm what it currently does before this spec adds a sibling next to it, this may be the same job with a different input, in which case this is an extension, not a new route.

```
POST /api/chips/suggest-from-source
{ "source_id": "uuid" }

Server:
1. Load the external_content_sources row
2. Build the prompt: raw_content, plus the fixed chip category enum,
   plus an instruction to suggest 2 to 3 chips as {category, context}
3. Call Claude, structured output only
4. Return the suggestions to the client. Write nothing yet.
```

**The category is constrained, not free text.** Chips already live under a locked enum, professional, interest, location, goal, identity, adding a sixth requires its own spec change. The prompt must be built so the model can only select from that list, never invent a new one. `context` stays free text, same as every hand-typed chip today.

```
Prompt contract:

INPUT:
  raw_content: string, capped at a fixed length before it ever reaches the model
  allowed_categories: [professional, interest, location, goal, identity]

OUTPUT (structured, nothing else):
  [
    { category: one of allowed_categories, context: string, confidence: number }
  ]
  2 to 3 items. Never more. If the content is too thin to say anything
  specific, return fewer items rather than padding with generic ones.
```

**This call is asynchronous and occasional, never on the room's critical path.** Same discipline already locked for embeddings and chip extraction elsewhere in this build. It fires when a person connects a source or taps "suggest chips," not on any interval, not as a background job re-scanning anyone.

### 3.1 Grounding suggestions in real accepted chips

Everything above drafts from the raw content alone, the model's own judgment, nothing else. This section adds retrieval in front of generation, the same idea already half-built for a different purpose: the `context_embedding` column and cosine similarity lookup already specified in the matching engine upgrade. That infrastructure was wired up to feed a score. This wires the same infrastructure into a prompt instead. No new embedding system, the same one, a second job.

```
function retrieveGroundingExamples(sourceEmbedding, allowedCategories):
  candidates = query chips where
    status = 'accepted'                        # only real, person-confirmed chips
    and category in allowedCategories
    order by cosine_similarity(context_embedding, sourceEmbedding) desc
    limit RETRIEVAL_K                            # starting value: 5

  if candidates.length < MIN_GROUNDING_EXAMPLES:  # starting value: 3
    return []                                     # not enough real data yet

  return candidates.map(c => ({ category: c.category, context: c.context }))
  # category and context text only. Never a passport_id, never a name,
  # never anything that traces a grounding example back to who accepted it.
```

**Why anonymized text only, never identity:** chips are already semi-public by design, shown in the room, in the Intel tab, in matches. Using their wording as an anonymous style reference for the model is a reasonable extension of data that is already shared, not a new exposure. But the model should learn "here is what a well-formed chip in this category looks like," never "this specific person said this." The retrieval query strips that link before the text ever reaches the prompt.

**Why only accepted chips are eligible, and nothing pending or dismissed:** a dismissed AI draft was rejected for a reason, maybe it was generic, maybe it was wrong. Retrieving it as a grounding example for someone else would let one bad draft quietly compound into more bad drafts. Only a chip a real person actually confirmed counts as evidence of what good looks like.

**Why this gracefully falls back instead of blocking:** the first person from a new vertical, legal, health sciences, whatever comes next, has no prior accepted chips in that space to retrieve. `MIN_GROUNDING_EXAMPLES` catches that and returns nothing rather than forcing thin or irrelevant matches into the prompt. Same design property already locked in the matching engine spec, every new term defaults to zero contribution when its data is not available yet. This system gets better at a vertical the more real people from that vertical have used it, and does not need to be seeded by hand to work honestly on day one.

**This is the base case, before a seed pool or cohort weighting exist.** Section 3.2 replaces this function with a three-argument version that queries a broader pool and ranks by more than similarity alone. Once 3.2 and 3.3 are in place, that version is the one to implement, this one exists only to introduce the idea in isolation before the full picture arrives.

The prompt contract updates to carry this as optional context:

```
Prompt contract:

INPUT:
  raw_content: string, capped at a fixed length before it ever reaches the model
  allowed_categories: [professional, interest, location, goal, identity]
  grounding_examples: array of { category, context }, possibly empty
    # real, previously accepted chips, anonymized, shown as a style and
    # vocabulary reference only, never as content to copy verbatim

OUTPUT: unchanged, same structured {category, context, confidence} format
```

### 3.2 Seeding the pool before real data exists

**Every accepted chip is already tomorrow's seed, this section just gives that a running start instead of waiting on it.** The first person from a new vertical drafts ungrounded, since nothing exists yet to retrieve. Once they accept a suggestion, the second person from that vertical has one real example. The system already self-seeds, one person at a time, purely organically. What follows are two deliberate ways to shortcut that wait, plus the moderation step that keeps either one honest.

**A separate pool, not a disguised version of real data.** Seeded and contributed vocabulary never lives in the same table as real accepted chips, on purpose, the same architectural instinct already governing the rest of this build, keep a boundary structural rather than trust a flag to enforce it everywhere downstream.

```sql
create table chip_vocabulary_seeds (
  id                        uuid primary key default gen_random_uuid(),
  category                  text not null,
  context                   text not null,
  context_embedding         vector(1536),
  chip_source                text not null,       -- 'host_seed' | 'contributed'
  contributor_passport_id   uuid references passports(id),  -- set only for 'contributed'
  event_id                  uuid references events(id),      -- nullable, set when seeded for one event
  moderation_status         text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at                timestamptz not null default now()
);
```

**Host seeding, an extension of tooling that already exists.** Chip menu tailoring is already part of host setup. A host preparing a legal or health sciences event can add a small handful of exemplar chips, "Pro bono contract review," "IRB protocol design," the same place they already tailor the chip menu for that event. These insert as `chip_source = 'host_seed'`.

**Contribution, for someone who wants to help without it being their own card.** A separate, clearly labeled action, "help build [vertical] vocabulary," not part of building a personal card and never presented as one. This is exactly the shape of person from the Creative Meetups conversation, AI-forward, genuinely wants to be useful. These insert as `chip_source = 'contributed'`, with `contributor_passport_id` set for accountability, never for display.

**Both route through the moderation queue that already exists, not a new one.** Host chip moderation already resolves chip menu entries. Seeded and contributed rows enter as `moderation_status = 'pending'` and only become retrieval-eligible once approved through that same queue. Nothing enters the grounding pool unreviewed.

**Moderation catches what shouldn't be there. It was never built to catch what's merely useless, and that gap matters here specifically.** A contribution can be entirely appropriate and still be the Coffee Connect problem in miniature, "Networking," submitted in good faith, adds nothing a hundred other Networking chips don't already say. Worth a second, lighter check ahead of the human queue, specificity rather than appropriateness, the same kind of judgment already trusted to the chip suggestion prompt itself, does this context say something the category alone doesn't already say. A contribution that fails it is not rejected outright, it goes back to the contributor with a nudge toward specificity, same spirit as the card builder's own coaching on hand-typed chips, before it ever reaches a human moderator.

**Retrieval draws from both pools, real data preferred when there's a choice, and it needs to know which vertical the person asking is actually in. This function replaces the one in 3.1, not a sibling to it, the same name, the real version.**

```
function retrieveGroundingExamples(sourceEmbedding, allowedCategories, sourceEventId):
  pool = union of:
    - chips where status = 'accepted' and category in allowedCategories
    - chip_vocabulary_seeds where moderation_status = 'approved'
                            and category in allowedCategories

  candidates = pool, ranked by:
    1. cosine_similarity(context_embedding, sourceEmbedding) desc
    2. same or related vertical as sourceEventId ranked above unrelated ones
    3. cohortWeight(candidate) applied as a ranking multiplier, see 3.3
    4. real accepted chips ranked above seeded/contributed ones at near-equal similarity
  limit RETRIEVAL_K

  if candidates.length < MIN_GROUNDING_EXAMPLES:
    return []

  return candidates.map(c => ({ category: c.category, context: c.context }))
  # chip_source and contributor_passport_id never travel into the prompt,
  # real or seeded, same anonymity rule as before
```

**Without the event affinity term, a legal bio could retrieve grounding from an unrelated creator-economy event purely because two unrelated chips happened to use superficially similar words.** `sourceEventId` is what keeps retrieval from bleeding across verticals that shouldn't mix.

### 3.3 Weighting by cohort, not by calendar

The natural instinct is to reach for the decay already locked for warmth, older means less trusted. That is the wrong analogy for this job, worth being precise about why rather than quietly reusing it. Warmth decay measures a relationship going quiet, and quiet genuinely means something there, less contact really is less connection. A chip's vocabulary does not go stale just because SODA has not run another event in that vertical yet, it has simply not had a chance to be reinforced. Decaying it on a calendar would punish exactly the verticals with the least volume so far, the ones section 3.2 exists to help grow.

**The corrected rule: weight relative to competing evidence inside the same cohort, never relative to raw time.** A cohort is the same category, narrowed by the event affinity from the retrieval function above, category plus vertical, not category alone.

Two rules only.

**No competing evidence, no decay, regardless of age.** If a chip is still the newest, or one of very few, in its cohort, it keeps full weight indefinitely.

**Weight only fades once genuinely superseded by real newer volume in that same cohort**, not by the passage of time in isolation.

```
function cohortWeight(chip, cohort):
  if cohort.size < MIN_COHORT_FOR_WEIGHTING:   # starting value: 5
    return 1.0                                  # not enough volume yet to judge anything stale

  newerInCohort = count of chips in cohort accepted after this one
  if newerInCohort / cohort.size < SUPERSEDED_THRESHOLD:  # starting value: 0.5
    return 1.0                                   # still holds up against what has come since

  return a modest reduction, proportional to how far superseded, never a hard cutoff
```

**Concretely:** a legal chip from the one legal event run so far sits in a cohort of two or three. That is well under `MIN_COHORT_FOR_WEIGHTING`, so it never decays, stays exactly as trusted as day one, until SODA has run enough more legal events to build a cohort that could actually supersede it. Quiet is not evidence of anything. Only real new volume is.

**This composes with the event affinity term, it does not sit next to it as a separate system.** Cohort membership is what event affinity already defines. Weighting operates inside that same cohort.

**And the boundary that matters most: neither pool ever touches the live room.** Seeded and contributed chips never appear in the Intel tab, never factor into matching, never show up as anyone's offer or need. Their only job is grounding future AI drafts. They do not exist to any attendee at any point.

---

## 4. Approval, the two-call gate made concrete

Suggestions render as tap targets, accept, edit, or dismiss, one per suggested chip. Nothing is pre-checked or defaulted to accepted. An edited suggestion still counts as an accept, the person is allowed to keep the category and rewrite the context in their own words.

**An accepted suggestion writes through the existing chip path, not a new one.** Whatever function or endpoint already turns a hand-typed chip into a row in the attendance data, that is the same function this calls once accepted. The AI's role ends the moment the person taps accept. From that point on, this chip has no memory of where it came from, it is just a chip.

---

## 5. What this explicitly does not do

- Never runs on a platform without the person's own action, no scraping, no lookups on someone else's behalf.
- Never touches Instagram or LinkedIn through an API. Both stay pasted-text only, for the reasons already covered, Meta's Business or Creator account requirement and app review gate, and LinkedIn's contractual enforcement against third-party data access.
- Never writes a chip without an explicit accept.
- Never suggests a category outside the fixed five-value enum.
- Never runs repeatedly or automatically. One call per connect action, or one call when the person explicitly asks for more suggestions, never a poller re-reading anyone's channel on a schedule.
- Never blocks card creation. A person can finish their card with zero connected sources, this is additive, never a required step.
- Never retrieves a pending, edited, or dismissed suggestion as a grounding example. Only accepted chips and approved seed or contributed rows are eligible, everything else is excluded.
- Never exposes which person a grounding example came from, to the model or to anyone. Retrieval carries category and context text only.
- Never lets seeded or contributed vocabulary reach an attendee. It exists only to ground future AI drafts, never shown in the room, the Intel tab, or anywhere matching happens.
- Never adds seeded or contributed vocabulary to the retrieval pool without moderation approval first.

---

## 6. Cost, briefly, because it comes up every time AI touches this product

One short Claude call per person, per connect action, structured output, capped input length. Same shape as the chip extraction cost already accepted elsewhere in this build, genuinely small money, closer to the SMS bill than anything worth optimizing early. Do not build caching or batching for this until real volume says otherwise.

---

## 7. Acceptance criteria

1. `external_content_sources` is written to only when a person actively connects a channel or pastes text themselves. No row is ever created on someone's behalf.
2. The suggestion prompt can only select a category from the existing five-value enum. It cannot introduce a sixth.
3. No suggestion is written to the real chip data until the person explicitly accepts it. An edited-then-accepted suggestion counts as an accept.
4. Accepted suggestions flow through the same write path an ordinary hand-typed chip already uses. No parallel chip-storage mechanism is introduced.
5. The suggestion call is confirmed against the existing `/api/chips/suggest` endpoint before a new route is built, to avoid duplicating an existing job.
6. The call never runs on the live room's critical path and never runs on a recurring schedule.
7. Instagram and LinkedIn are supported only through pasted text. No API integration is built against either platform in this phase.
8. A card can be completed and used with zero connected sources. Nothing about this feature is required.
9. Grounding examples are drawn only from chips with `status = accepted`, or from `chip_vocabulary_seeds` rows with `moderation_status = approved`. A pending, edited-but-unaccepted, or dismissed suggestion is never eligible from either pool.
10. Grounding examples passed to the model contain only category and context text. No passport ID, name, or other identifying link travels with them.
11. When fewer than `MIN_GROUNDING_EXAMPLES` similar accepted chips exist, the system falls back to ungrounded drafting rather than blocking the suggestion or forcing in weak matches.
12. Retrieval reuses the `context_embedding` infrastructure already specified in the matching engine upgrade. No second, parallel embedding system is introduced for this purpose.
13. Host-seeded and contributed vocabulary lives only in `chip_vocabulary_seeds`, never in the same table as real accepted chips.
14. A seed or contributed row is retrieval-eligible only after `moderation_status = 'approved'`, set through the existing chip moderation queue, never on insert.
15. Seeded and contributed vocabulary is never surfaced to any attendee, in the room, the Intel tab, or matching. Its only function is grounding future AI drafts.
16. When both a real accepted chip and a seeded chip are near-equally similar to a retrieval query, the real accepted chip is preferred.
17. Retrieval considers the source event's vertical. A chip from an unrelated vertical is never preferred over one from the same or a related vertical at similar textual similarity.
18. A chip's weight in retrieval never decays purely from elapsed time. It only reduces when a cohort of the same category and vertical has accumulated enough newer accepted chips to genuinely supersede it, per `cohortWeight`.
19. Below `MIN_COHORT_FOR_WEIGHTING`, every chip in that cohort holds full weight regardless of age. Low volume in a vertical is never treated as evidence of staleness.
20. A contributed vocabulary submission is checked for specificity before it reaches the human moderation queue. A submission that is appropriate but too generic to add signal is returned to the contributor rather than silently entering the pool.

---

## 8. Build order

**Phase 1.** The pasted-bio path. No external API dependency at all, the simplest version, and it already covers LinkedIn and Instagram honestly. Ship this first.

**Phase 2.** YouTube channel connect. Requires a server-side API key and a fetch step before the same suggestion prompt runs, otherwise identical to Phase 1 once the raw content is in hand.

**Phase 3.** The self-awareness surface mentioned as a later idea, occasionally showing a person a pattern across their own accepted chips, "you keep offering early-stage fundraising help," rather than only suggesting once at connect time. Product question first, whether this feels helpful or repetitive, before it becomes a standing feature.

**Phase 4.** Retrieval-grounded suggestions, sections 3.1 through 3.3 together, the retrieval function, the seed pool, and cohort weighting. Not 3.1 and 3.2 alone, the retrieval function in 3.2 calls `cohortWeight` directly, so 3.3 is a dependency of Phase 4's own code, not a later refinement of it. Building these together rather than sequentially matters for a second reason too: a Phase 4 that only reads organic accepted chips would sit nearly empty through a new vertical's first several events, exactly the gap host seeding and contribution exist to close. Ship retrieval, its seed pool, and its weighting as one phase, not staggered.

---

## 9. The one sentence version

**Nothing here reads anyone who did not hand it over themselves, and nothing it drafts becomes real until they say so, the same rule that already governs every other AI-touched surface in this product.**
