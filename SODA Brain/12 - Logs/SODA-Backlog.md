# SODA — Backlog

*The single running list of open work, decisions, and ideas, so nothing lives only in chat. Updated
2026-06-26. Companion to the as-built flows ([[SODA-Flows-As-Built]]) and the
[[SODA-Session-Work-Log]]. Reprioritize freely; tell me which line to pick up and I'll run it.*

**Owner tags:** `[me]` ready for me to build on your go · `[you]` needs your action or decision ·
`[blocked]` waiting on something · `[idea]` not committed yet

---

## 🧪 Testing & Quality

The regression safety net. We have: typecheck + production build + 33 unit tests + **1 end-to-end
browser flow** (sign-up → room → leave, Playwright, mobile-Chromium). Open:

- `[me]` **More E2E flows** — returning sign-in; leave → re-enter; host create → go-live. (Harness is
  built; each new flow is quick to add.)
- `[SHIPPED 2026-06-29 / partial]` **CI pipeline** — GitHub Actions runs format + typecheck + production
  build + the 43 unit tests on every push to main and every PR (`.github/workflows/ci.yml`). **Still to
  add:** a CI step that starts Supabase + seeds a live event so the **E2E** browser flow runs headless too.
- `[me]` **iPhone/Safari E2E** — add a WebKit project so we also test the real iOS engine, not just
  mobile-Chromium.
- `[SHIPPED earlier this session]` **Sentry** — production error monitoring + performance (RUM) + masked
  session replay, env-gated. Plus a structured **syslog** (`apps/web/lib/log.ts`) for the "what happened"
  layer alongside Sentry's "what broke." Pairs with E2E: E2E catches before deploy, Sentry after.
- `[idea]` **Load test (k6 / Artillery)** — simulate 50–100 phones joining a room at once, to prove
  the realtime room holds before a packed event.
- `[idea]` **Visual regression** — screenshot-diff screens to catch unintended visual changes; turn
  on for the UX pass.
- `[idea]` **Session replay / analytics (PostHog / Hotjar)** — watch real people move through the
  flows; directly serves the user-friendliness goal.
- `[me/minor]` Clean up throwaway E2E test users that accumulate in the local DB.

---

## 🎨 UX / flows polish (current focus)

- `[blocked]` **Micro-card edit (#2)** — tap a simpler micro card → expands to a full profile modal you
  edit; drop the EDIT button. *Waiting on your uploaded card designs.*
- `[me]` **In-event info card (#3)** — when you're in a live event, swap the "In an event?" code box
  (and an Account slot) for a current-event card (name + live headcount).
- `[me]` **Per-chip detail declutter** — collapse the per-chip "Add specifics" behind one disclosure.
- `[me]` **Matches in the leave recap** — recap shows connections + time today; add matches once
  attendees can see their matches.
- `[me]` **Rest of front-door polish** — first-run tutorial modal; map each sign-in error to its own
  labelled screen.
- `[me]` **De-dupe into shared component atoms.** A shared `<Input>` / `<Textarea>` is started (branch
  `soda-input-atom`, commit e3749a5; 4 of ~20 fields converted, verified green, not deployed). Finish
  the input sweep and add `Field` / `Button` / `Chip` atoms in the component-kit phase of the overhaul.
  Cuts the copy-pasted styling (the ~7-class field skeleton lived in 18 files) and is native-ready.

---

## 📨 Surveys & host tools

- `[SHIPPED 2026-06-26]` **Share / copy the survey link** — a "Copy survey link" button in the **Admin
  → Survey** tab (live + closed events) copies `/survey?event=<id>`. Live on grabsoda.app. (The
  Command Center could get the same button later if useful.)
- `[me]` **Survey results download — friendly version.** The raw, anonymised responses ALREADY export
  as **CSV** (Admin → Export → Survey, owner-only). Add a **printable / PDF results report**: each
  question with a summary (averages, counts, tag tallies, the free-text answers) — the shareable,
  grant-ready version. (Also consider surfacing the existing CSV in the Command Center, not just Admin.)
- `[me/you]` **Attendee emails in the CSV export** — the attendees CSV today has Name / Role / Offers /
  Needs / Joined but **no email column** (emails live in the sign-in/auth layer; the export simply
  doesn't pull them — true for every event). Adding an Email column is a small change (walk-ins added
  by hand have no real email, so those stay blank). **Decision first:** handing the host attendees'
  emails is a privacy/consent change — confirm the sign-in consent / privacy policy covers "your email
  may be shared with the event host" before shipping. (Raised from the Latinos N Tech export.)
- `[idea]` **Turnout / growth forecasting (host + ops intelligence).** Predict event turnout from the
  signup-pace curve + a host's past events ("tracking 20% behind your usual pace, expect ~40"), and
  platform growth at the ops level. **Build the simple version first** (a signup-pace tracker: the
  current curve vs the host's historical pace, no ML, fits the stack, sits behind an API per "thin
  client, fat server"). Reach for a real forecasting model (Google **TimesFM 2.5**, Apache-2.0, via
  BigQuery `AI.FORECAST` or a Vertex / Python service) only once there's a real event history and the
  simple tracker isn't enough. A new model type, separate from the Claude/LLM draft generation. (Raised
  2026-06-27 from the TimesFM repo.)
- *(related: the **Non-responder survey reminder** is under Deferred follow-ups.)*
- `[SHIPPED 2026-06-29]` **Focus-aware matching** — the engine now compares the focus on matched chips
  and tags each match Aligned / Broad / neutral, ranking mutual then aligned then overlap. Ranks + labels
  only, never gates, so no pair is lost. Live on grabsoda.app (commit 2b6706b).
  Plan: [[SODA-Focus-Aware-Matching-Plan]].
- `[SHIPPED 2026-06-29]` **Category-synonym matching** — a curated, conservative map bridges Investment to
  Funding and Hiring to Looking-for-work; synonym matches carry a "Related" tag; the Most Wanted gaps group
  by intent. **Validated on the real Latinos export before deploy:** 0 fake new pairs, +12 mutual (55 to
  67), and the pilot's phantom gaps (Funding 5/0, Looking-for-work 4/0) corrected to a real 2 and 1.
  Live (commit 2b6706b). Plan: [[SODA-Category-Synonym-Matching-Plan]].
- `[SHIPPED earlier this session]` **Ambient nudges (no-numbers posture)** — plain-English match reasons,
  Most Wanted as operator gap nudges, a connector nudge, no strength numbers. Spec:
  [[SODA-Ambient-Nudges-Adopt-Now-Spec]].
- `[me / NEXT INITIATIVE]` **Chip Bank v2** — adopt the designed seven-context chip bank (`SODA Chips
  Bank/bank.ts`) as the source of truth, rebuild its never-built suggestion engine (types.ts +
  suggestions.ts), merge in the pilot-surfaced labels (Leads, Networking, Marketing/Social), wire
  context-aware focus suggestions, and point the matcher at the bank's context tags (retiring the
  hand-rolled synonym map). Fixes match quality at the SOURCE (the input) and supersedes the two synonym/
  focus plans above. Plan: [[SODA-Chip-Bank-v2-Plan]].

---

## 🚧 Built, awaiting your go

- `[SHIPPED 2026-06-26]` **Attendee UX batch** — front-door dead-end fixes + single-screen editor +
  focus picker + labelled-Home navigation + Leave Room + the modal-centering fix + the E2E harness.
  Live on grabsoda.app (deployed code-only, no DB change).
- `[held for UI]` **Card templates (backend + swipe UI)** — the backend (`profile_cards` migration +
  API + contracts) is built and parked on the `soda-card-templates` branch; it ships *with* its swipe
  carousel UI **and** its DB migration once the UI rebuilds arrive. NOT on production yet.

---

## 🔐 Security & ops

- `[SHIPPED 2026-06-27]` **Attendee front-door email-probe gate (P0).** Merged to main (commit ec8e088)
  and **live + verified on grabsoda.app**: the returning door (`/signin`) routes its code request through
  a server endpoint (`/api/auth/request-code`, sibling of the ops gate) that emails a code only if the
  account exists and returns one neutral response either way, so it never reveals who has a SODA account.
  The event door (QR, new guests welcome) is unchanged.
- `[idea]` **CAPTCHA on sign-in** — deferred (needs the widget wired into sign-in first).
- `[me]` **Eviction-proof "my live event" lookup** — a server fallback so /home can still offer your
  room even if the phone wiped local storage (the deeper iOS fix). → Now planned structurally via
  **URL-addressable event rooms** (`/room/[eventId]` + a shareable `/e/[code]` join link):
  [[SODA-Event-Room-URLs-Plan]]. Best folded into the overhaul.

---

## ⚙️ Decisions / dashboard toggles (your side)

- `[you]` **Doppler vs Vercel** for managing secrets.
- `[you]` **Clerk / Zustand foundation** — the bigger architecture question (Alysha's call).
- `[you]` **DESIGN.md proposal** — adopt the agent-readable design-system file as the single design-token
  source of truth? Drafted at `05 - Design/Design System/DESIGN.md`; review during the 2026-06-28 sprint,
  then decide. Pairs with the universal-UI / native direction ([[SODA-Universal-UI-Expo-Migration-Plan]]).
- `[you]` **Embeddings-based ambient matching (SODA-EMBED-002)** — adopt the vector/pgvector matching spec
  into core architecture? Foundation-level (Brent + Alysha): supersedes the rule-based matching plans,
  needs pgvector + an embedding model, and effectively decides Doppler. **The spec is written against a
  different schema/team (`soda_*` / worlds / bridges) and must be mapped onto your real schema, not
  pasted.** Reconciled proposal: [[SODA-Embeddings-Ambient-Matching-Architecture]].
- `[you]` **Supabase toggles** — email rate-limit (keep ABOVE headcount), the double-email confirm
  toggle, email-template styling.

---

## 📅 Deferred follow-ups

- `[SHIPPED 2026-07-13]` **Ops console rebuild (clone the Admin shell)** — the shared door kit
  (`components/door/`) now houses both back-offices; /ops wears the Admin look (The Board / Hosts /
  Updates + Analytics link, rail, toast/confirm grammar). LIVE. Plan: [[SODA-Ops-Console-Rebuild-Plan]].
  **Still open:** Phase 3 — fold /analytics in as a view; the /host cockpit can adopt DoorShell next.

- `[you→me]` **The Key Card (Lab 05 → product)** — the full contact card (email, phone, website,
  socials) with the save-to-contacts QR, the typed key code, and the given-not-found seal. Full
  build plan at [[SODA-Key-Card-Plan]] (3 shippable phases; 5 decisions are yours, listed at the
  bottom of the plan). Lab demo: `/design/keycard`.

- `[me]` **Non-responder survey reminder** — email only the people who skipped the survey (needs a
  scheduled job).
- `[me]` **Event-times follow-ups** — show scheduled times on the ops board, auto-open at start,
  reminder emails.
- `[me]` **QR-scan splash consolidation** — tidy the entry splash beats.

## 🔧 Production-hardening plans (2026-07-15 audit follow-ups, planned with Brent)

- `[me]` **Structured logging (planned, not urgent)** — today: Vercel captures route logs; Sentry
  captures errors. The plan: a tiny `lib/log.ts` that emits one JSON line per noteworthy server
  event (level, route, requestId from `x-vercel-id`, error code — NEVER PII/content), adopted
  first in every API route's catch path, then at key lifecycle moments (event close, wipe runs,
  bridge failures). Vercel picks JSON lines up automatically → searchable. ~Half a day; do it
  alongside the room scale pass so the new coalesced endpoints are born instrumented.
- `[you+me]` **Secret rotation runbook (planned)** — inventory: Supabase service-role + anon keys,
  Clerk `sk_live`, key-card HMAC + AES keys, Sentry DSN. Simple ones rotate clean (regenerate →
  swap in Vercel env → no-cache redeploy → verify). The HARD one: key-card crypto keys need a
  designed dual-key window (accept old+new while a re-encryption pass walks existing cards) —
  design before first rotation, never rotate those naively. Cadence: ~90 days (Brent's calendar)
  + immediately on any suspected exposure or key-holder change. Decide Doppler-vs-Vercel (the
  open P0) first — the runbook is written against whichever wins. Deliverable: an Ops Manual
  page + first rotation done together.
- `[SHIPPED 2026-07-15]` **Health check deepened** — `/api/health` now probes the database
  (timeout-raced) and returns 503 when it's down; `[you]` point an uptime monitor (UptimeRobot
  or similar, 1-min interval) at `https://grabsoda.app/api/health`.
