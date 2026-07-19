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

---

## 8. Build order

**Phase 1.** The pasted-bio path. No external API dependency at all, the simplest version, and it already covers LinkedIn and Instagram honestly. Ship this first.

**Phase 2.** YouTube channel connect. Requires a server-side API key and a fetch step before the same suggestion prompt runs, otherwise identical to Phase 1 once the raw content is in hand.

**Phase 3.** The self-awareness surface mentioned as a later idea, occasionally showing a person a pattern across their own accepted chips, "you keep offering early-stage fundraising help," rather than only suggesting once at connect time. Product question first, whether this feels helpful or repetitive, before it becomes a standing feature.

---

## 9. The one sentence version

**Nothing here reads anyone who did not hand it over themselves, and nothing it drafts becomes real until they say so, the same rule that already governs every other AI-touched surface in this product.**
