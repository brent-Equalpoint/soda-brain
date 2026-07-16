# SODA — Event & System Logging (Observability) Plan

*The best-practice plan for seeing everything that happens in the app: clicks, page moves, pop-ups,
errors, backend faults, and who did what. Created 2026-06-27. Clean slate (no telemetry installed yet);
builds on the one audit table you already have (`ops_login_attempts`, from the ops login gate). Plain
English first, because the whole point is that you, not just an engineer, can read what happened.*

---

## The one idea to get first: "log everything" is FOUR jobs, not one

The instinct is to dump every click, error, and message into one giant log. That is the classic
mistake. It gets expensive fast, it mixes private guest data with junk, and it becomes impossible to
actually read when you need it. Best practice is **four thin layers**, each answering a different
question, each with its own home:

| Layer | The question it answers | Plain-English name | Where it lives | Keep for |
|---|---|---|---|---|
| 1 · **Behavior** | "What did people *do*?" (clicks, taps, page moves, pop-ups) | The replay | PostHog | 30 to 90 days |
| 2 · **Faults** | "What *broke*?" (front-end crashes, API errors, faults) | The alarm | Sentry | 30 to 90 days |
| 3 · **The story** | "What did the *system* do step by step?" (every request in/out) | The flight recorder | Server logs (Vercel + a drain) | 7 to 30 days |
| 4 · **The record** | "*Who did what*, and when?" (sensitive + host/ops actions) | The ledger | Your own database table | 1 year+ |

The trick that makes all four useful together is **one shared ID per person per visit** (the "golden
thread", below), so you can follow a single guest from their first tap, through every screen and pop-up,
into any error, all the way to what the backend did. That is what turns "everything happened somewhere"
into "here is exactly what happened to *this* person."

---

## Why now (the motivating example)

At Latinos N Tech, the front-door trap and the stuck pop-ups were only discovered **after** the night,
from people telling you. With Layer 1 (session replay) you could have **watched a recording** of a guest
hitting the dead end as it happened, and Layer 2 would have **paged you** the moment a screen faulted.
Today you are flying blind between "it works on my phone" and a guest reporting a problem hours later.
This plan closes that gap. It is the natural partner to the [[SODA-Flow-Test-Plan]]: the test plan
*prevents* dead ends before release; this *watches* for them in the wild after release.

---

## Layer 1 — Behavior: what people do (PostHog)

**Tool: PostHog.** The single highest-leverage add. One small snippet in the app and you get:
- **Autocapture** — every click, tap, and page move is recorded automatically, no per-button code.
- **Session replay** — a literal video-like replay of a guest's session (privacy-masked, see below).
  This is the feature that catches traps, stuck pop-ups, and rage-taps.
- **Named events** for the moments that matter (so you can count them): `signed_in`, `joined_event`,
  `card_built`, `entered_room`, `note_sent`, `act_answered`, `left_room`, `survey_submitted`, and
  `modal_opened` / `modal_closed` (those are the "windows that pop up" you asked about, tracked by name).
- **Funnels** — e.g. "of everyone who signed in, how many actually reached the room?" That single number
  would have quantified the front-door trap.

Free tier is generous; an EU-hosted option exists for privacy. Self-hostable later if you ever want to.

## Layer 2 — Faults: what breaks (Sentry)

**Tool: Sentry.** The industry standard, with a Next.js kit that captures **both** front-end (the
guest's phone) and back-end (your API routes) errors automatically:
- Every uncaught crash, failed pop-up, and broken button, with the exact line of code and a **breadcrumb
  trail** of what the user did just before.
- Every backend API/RPC error and fault, tied to the same user.
- **Alerts**: it emails (or Slacks) you when something spikes, so you hear it from the app, not a guest.

## Layer 3 — The story: what the system did (structured server logs)

Every backend request writes one tidy line: who called it, which action, what it returned, how long it
took, and a **request ID**. Start with Vercel's built-in logs (free, already on); add a searchable
**log drain** (Better Stack / Axiom) when you want to keep and search them longer. This is your
"backend messages / faults" layer, the play-by-play behind the scenes.

## Layer 4 — The record: who did what (an audit table you own)

Telemetry is rented and disposable. **Who-did-what is a business record, so it belongs in your own
database**, append-only, where you control it. You already have the seed: `ops_login_attempts`. Best
practice is to generalize that into one `audit_log` table that records the **sensitive and host/operator
actions** specifically:
- went live, closed the night, exported a CSV, checked a guest in, changed settings, deleted an account,
  invited a collaborator, ops sign-in.
- Each row: **who** (user id), **what** (action), **when**, **what they touched** (event/target id), and
  a few safe details. Protected by RLS, surfaced read-only in the Ops console.

This is the layer that answers "who did it" with certainty, and the one you would ever show in a dispute
or a security review.

---

## The golden thread (what ties the four layers together)

Every visit gets **one ID**, stamped on all four layers:
- the signed-in **user id** (from Supabase auth) = *who*,
- a **session id** = *this visit*,
- a **request id** on each backend call = *this exact action*.

Carry those across PostHog (`identify`), Sentry (user context), the server logs, and the audit rows.
Then one search pulls a person's entire journey: tap, screen, pop-up, error, backend call, audit entry,
in order. Without this thread you have four piles of data; with it you have a story.

---

## Privacy and PII (non-negotiable for SODA)

SODA is privacy-careful by design (email lives only in the sign-in layer; notes are private; consent
matters). "Log everything" must **not** mean "leak everything." Locked rules for this build:
- **Mask all input in session replay** (PostHog masks by default; keep it on). Never record what someone
  types into a note or a card field.
- **Never log note/message bodies or card free-text** in any layer. Log that a note was sent, not its
  contents.
- **Redact PII** (emails, names) from analytics and error payloads; reference people by user id.
- **Retention windows** as in the table above; auto-delete telemetry on schedule.
- **Disclose it.** Update the Privacy Policy to name analytics + session replay, and fold it into the
  existing sign-in consent. (Ties to the same consent work as host-visible emails.)
- **EU/again-off switch.** Pick EU hosting; keep a single flag that can turn replay off instantly.

---

## Build vs. buy (the honest recommendation)

- **Buy the telemetry** (PostHog + Sentry). Building your own click-tracker, replay, and crash-reporter
  is months of work that already exists and is free at your scale. Do not reinvent it.
- **Build the audit log** (Layer 4). That is *your* data and a business record; it must live in your DB.
- **Trade-off to accept:** two new vendors and two API keys (managed through the same secrets path you
  settle in the Doppler-vs-Vercel decision). For a solo founder this is the right trade: maximum
  visibility for minimal code and near-zero maintenance.

---

## What gets captured (the event catalog)

A starter list; grows over time. Each event carries the golden-thread IDs, never PII bodies.

- **Lifecycle:** `signed_in`, `joined_event`, `card_built`, `entered_room`, `left_room`,
  `survey_submitted`, `account_deleted`.
- **Interaction:** autocaptured clicks/taps + named `modal_opened` / `modal_closed`, `tab_switched`,
  `card_edited`, `note_sent`, `act_answered`, `connection_followed_up`.
- **Host / Operator (audit):** `event_went_live`, `event_closed`, `csv_exported`, `guest_checked_in`,
  `settings_changed`, `collaborator_invited`, `ops_signed_in`.
- **Faults:** `client_exception`, `api_error`, `rpc_failed`, `slow_request` (over a threshold).

---

## Phased rollout (experience-first, smallest useful slice first)

- [x] **Phase 1 — See it. SHIPPED + LIVE on grabsoda.app** (merged to main `fb26c30`, 2026-06-29; DSN set
  in Vercel Production; Sentry org `equal-point` / project `javascript-nextjs-g7`). `@sentry/nextjs` wired
  into the app: errors, performance (RUM), and masked
  session replay, all env-guarded so it stays inert until a DSN is set. **PostHog deferred** (its unique
  value is funnels / drop-off analytics; Sentry's RUM + replay cover the behavioral list for now). This
  alone would have caught both pilot bugs.
- [ ] **Phase 2 — Name it.** Add the named lifecycle + `modal_opened` events and `identify` the user
  (with PII masking). Build the "sign-in to room" funnel that measures the front-door trap.
- [ ] **Phase 3 — Record it.** Generalize `ops_login_attempts` into the `audit_log` table; write rows on
  the host/ops sensitive actions; show a read-only audit view in the Ops console.
- [ ] **Phase 4 — Trace it.** Structured server logs with a request ID + a log drain; turn on Sentry
  alerts to your email.
- [ ] **Phase 5 — Lock privacy.** Retention windows, masking audit, Privacy Policy + consent update, the
  replay off-switch.

---

## The decisions for you (the forks)

1. **Where to start** — Phase 1 (see it) is the recommended first move; or build the audit log first if
   "who did what" is your top worry.
2. **Session replay on or off** — it is the most powerful feature *and* the most privacy-sensitive.
   Recommended: **on, fully masked, disclosed**. Your call given SODA's privacy posture.
3. **Managed or self-hosted** — recommended **managed** (PostHog Cloud EU + Sentry) to start; both can be
   self-hosted later with no code change.
4. **How long to keep each layer** — defaults in the table; tighten if you prefer.

---

## Checklist

### Phase 1 — See it
- [x] **Decision: Sentry only** (PostHog deferred; see note above). Sentry's RUM + replay cover the
  behavioral list; PostHog's funnels can be added later as their own step.
- [x] Add Sentry (Next.js SDK: client + server + edge + a global-error boundary), env-guarded; masked
  session replay + performance tracing on. Built on branch `soda-observability` (commit abce6fc),
  verified (prettier + typecheck + Turbopack build + 33 unit tests all green). No DB change.
- [ ] **Brent:** create the Sentry account + project; put `NEXT_PUBLIC_SENTRY_DSN` in Vercel Production
  (optionally `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` for readable stack traces).
- [ ] Merge `soda-observability` to main to deploy; verify a test error + a masked replay appear in Sentry.
- [ ] Smoke-test on a phone: one full guest run shows up as a replay + events.

### Phase 2 — Name it
- [ ] `identify` the signed-in user (id only, no PII).
- [ ] Fire the lifecycle + `modal_opened`/`closed` named events.
- [ ] Build the sign-in to room funnel.

### Phase 3 — Record it
- [ ] `audit_log` migration (generalize `ops_login_attempts`), RLS, security-definer write RPC.
- [ ] Write audit rows on the host/ops sensitive actions.
- [ ] Read-only audit view in the Ops console.

### Phase 4 — Trace it
- [ ] Request-ID + structured server logging on API routes.
- [ ] Log drain (Better Stack / Axiom) wired.
- [ ] Sentry alert rules to email.

### Phase 5 — Lock privacy
- [ ] Retention windows set per layer.
- [ ] Masking + no-PII-bodies audited across all four layers.
- [ ] Privacy Policy + sign-in consent updated; replay off-switch in place.

---

*Pairs with [[SODA-Flow-Test-Plan]] (prevent dead ends before release; this watches for them after) and
[[SODA-Flows-As-Built]]. Feeds [[SODA-Backlog]] under Testing & Quality. The audit layer extends the
SODA-042 ops gate.*
