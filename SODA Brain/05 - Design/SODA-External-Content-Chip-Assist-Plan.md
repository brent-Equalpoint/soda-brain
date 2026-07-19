# External Content Chip Assist — Build Plan (reconciled to the real SODA)

**Status: Phase 1 SHIPPED 2026-07-19 (commit ca70f81, same day as the decisions).
Spec = [[SODA-External-Content-Chip-Assist]] (Brent, v1.0). Phase 2 (YouTube) not started.**

**As built:** contract in `packages/contracts/src/chip-assist.ts` (suggestion type =
`ChipAssistSuggestion` — NOT `ChipSuggestion`, which host.ts already owns for the menu
moderation queue); `lib/chips/assist.ts` (bank-constrained prompt + `sanitizeSuggestions`
server revalidation + keyless mock, 10 unit tests); `POST /api/me/chip-assist` (401 signed-out,
403 anonymous = the ephemeral posture enforced server-side, 6-per-5-min brake, writes nothing);
`components/chip-assist.tsx` disclosure rendered by CardEditor's new `assist` prop, which ONLY
`/card` turns on (the in-room quick editor and ephemeral rooms never see it). Edit = rewrite
the focus in your own words, category stays from the bank (spec §4).

**Brent's calls (2026-07-19):** 1) Phase 1 STATELESS (no table, paste discarded).
2) Entry point: card editor only. 3) Assist HIDDEN in ephemeral/classroom rooms.
4) Queue: **Chip Assist FIRST**, the Tier-1 load test slides one slot.

## What the spec asks, in one line

A person hands over their own words (pasted bio; later, their YouTube channel) → Claude drafts
2–3 chips → the person accepts/edits/dismisses each → accepted ones become ordinary chips
through the ordinary path. Nothing read without hand-over; nothing written without an accept.

## Reconciliation — the spec's vocabulary → SODA's actual schema

The spec is written in a sibling dialect (like the embeddings spec was). Mapped, not pasted:

| Spec says | SODA reality | Consequence |
|---|---|---|
| `passports(id)` | `profiles(id)` | Table FK → profiles, RLS self-only |
| category enum `professional/interest/location/goal/identity` | Chips are `{category, context}` under **offers/needs**, with the **Chip Bank** (24+24 categories) + per-event host menus | The model's constraint is BETTER here: it must pick `side: offer\|need` + a category **from the bank/menu list we pass it**; `context` (the focus) stays free text |
| `/api/chips/suggest` may be the same job | Verified NOT: that route is a guest proposing a menu word to the HOST's moderation queue | New sibling route: `POST /api/me/chip-assist` (self-scoped) |
| "same AI gate as drafts" | Confirmed: `lib/draft/provider.ts` = the existing Anthropic client (model + env override, haiku-class for short jobs) + the draft/approve/discard two-call pattern | Reuse the provider; no new AI infrastructure |
| accepted chip → "the existing chip write path" | The card editor / onboarding hold chips in FORM STATE and save via `upsert_my_profile_card` / `upsert_my_attendance` | Even cleaner than the spec hoped: an accept just adds the chip to the open editor's state — the person saves their card as always. **Zero new write paths, zero new chip storage.** |

## The recommended deviation (Brent to bless): Phase 1 goes STATELESS

The spec stores `raw_content` in `external_content_sources` at connect time. For the pasted-bio
phase we don't need to store anything: paste → one Claude call → suggestions → accept into the
open editor → the pasted text is **discarded**. No new table, no retention question, no wipe
integration, no PII at rest — data minimization is SODA's signature and this is the purest form
of the spec's own Rule 0. The table arrives in Phase 2, where YouTube genuinely needs it
(`source_ref` for re-suggest), created with: RLS self-only, service-role reads for the call,
FK on delete cascade (account deletion + the ephemeral wipe both clean it for free).

## Phase 1 — pasted bio (build first, ~a day)

1. **Contract** (`packages/contracts`): `ChipAssistRequestSchema { text: trim, min ~40, max 4000 }`
   + `ChipAssistResponseSchema { suggestions: [{ side: 'offer'|'need', category, context,
   confidence }] (max 3) }`.
2. **Route** `POST /api/me/chip-assist`: session gate → cap + sanitize text → prompt via the
   draft provider: the pasted words + the allowed category list (Chip Bank categories, both
   sides) + "2–3 chips max, fewer if thin, structured output only, category must be from the
   list". Returns suggestions. Writes nothing. Rate-limit like the other public-ish POSTs
   (person-scoped, a few per minute) — AI-backed endpoints always get one.
3. **UI — the card editor first** ("Let your work fill your card"): a small disclosure with a
   paste box + "Suggest chips". Suggestions render as tap targets in the app's chip language:
   accept (adds to offers/needs in the form, marked so the person sees it land), edit (opens
   the same add-your-own input prefilled), dismiss. Nothing pre-checked. Editor save = the
   normal save.
4. **Copy discipline**: no em dashes; colour restraint (side colour only); the disclosure
   explains in one line: "Paste your own bio. SODA suggests chips; nothing is added until you
   accept it."
5. **Tests**: prompt-contract unit tests (category always from the allowed list — reject/retry
   otherwise), thin-content returns fewer, response schema enforcement; route: gate, cap, rate
   limit. The provider call mocked, same as draft tests.

## Phase 2 — YouTube channel connect (separate, after P1 proves the UX)

Server-side YouTube Data API key (Brent creates; Vercel env + rotation runbook entry); fetch
channel description + recent titles by handle; NOW create `external_content_sources`
(profiles FK, RLS self-only, cascade) so re-suggest doesn't refetch; then the identical prompt.
Everything else unchanged.

## Phase 3 — the self-awareness surface: HOLD (product question, per spec §8)

## Guardrails carried from the spec (acceptance criteria, mapped)

- Only self-handed content; no scraping, no lookups, no LinkedIn/Instagram APIs (pasted text
  only) — criteria 1, 7.
- Category from the allowed list only (bank + event menu) — criterion 2, enforced in the
  structured-output schema AND revalidated server-side.
- Nothing written until accept; edit-then-accept counts — criterion 3; accepts flow through
  the existing card save — criterion 4.
- `/api/chips/suggest` checked: different job, sibling route built — criterion 5.
- Never on the room's critical path, never scheduled — criterion 6 (the call happens in the
  card editor, on tap, once per paste).
- Fully optional; a card completes with zero sources — criterion 8.
- **SODA-specific addition:** the assist is **hidden in ephemeral/classroom rooms** — minors
  plus paste-your-bio is exactly the data we promised not to collect there.

## Brent's four calls (blocking the build)

1. Stateless Phase 1 (recommended) vs store pasted bios per the spec's table?
2. Entry points: card editor only (recommended for P1) or also onboarding's card step?
3. Confirm: assist OFF in ephemeral rooms?
4. Where in the queue: after the Tier-1 load test (current next-up) or before it?
