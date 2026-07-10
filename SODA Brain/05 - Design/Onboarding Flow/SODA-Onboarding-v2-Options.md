# Onboarding v2 — Reconciliation and Choices

**Status:** DECISION DOC, written 2026-07-11 against Brent's `SODA-Onboarding-Flow-Spec.md`
(saved alongside). Nothing built yet. This reconciles the spec with what is live on
grabsoda.app, names the real blocker, and lays out three implementation paths with costs.

---

## 1. First, a correction that changes the picture

**Production Clerk is LIVE.** grabsoda.app/signin serves the Clerk door on
`clerk.grabsoda.app` with live keys (verified against the live site, 2026-07-11). The
2026-07-08 flip shipped: custom domain, Google OAuth, the bridge, phone-only bridge support.

So "the hang-up" is NOT a missing Clerk instance. The open item is narrower: **phone/SMS
sign-in enablement on the production instance** — the dashboard toggle was never confirmed,
and production SMS on Clerk generally requires a paid plan plus per-message costs and
toll-fraud settings. That's exactly the dependency the new spec's §8 runs into.

## 2. What the spec changes vs what's live

| | Live today | The spec |
| --- | --- | --- |
| Entry | QR/code → Clerk sign-in (verified email/Google) → 3-beat card builder → room | QR/code → **name + contact only, no code** → room immediately |
| Card | Built during onboarding (required) | Built later, in the room, at your pace (separate flow) |
| Verification | At the door (you can't enter unverified) | Optional, later; **gates only connecting** |
| Connections | Stewarded request → accept (all users verified by construction) | "Add connection" gated on verified badge |
| New primitives | — | `you_state` machine, verified badge, progress meter, gentle nudge, purple gate toast, server-side session resolve |

The spirit: **get people visible in the room in seconds** — one name, one contact, in. This
is the right instinct for a PWA at a live door, and it matches how the room actually fills.

**What we keep, unchanged:** the room, chips, matching, recap, surveys, stewarded
connections' request/accept semantics (the spec's "create the connection" simplification
should NOT replace consent — the verified gate applies to *sending a request*), the admin,
and the whole card-lab system (Labs 04–06), which slots in perfectly as the spec's §9
"separate card flow."

## 3. The core engineering question: who is a `starter`?

Everything in SODA hangs off a Supabase auth identity (~90 RLS rules key on `auth.uid()`).
Today that identity is minted by verified sign-in at the door. The spec's optimistic entry
means creating a *real, visible participant* **before** any verification — so the question
is what identity a starter gets. That's the fork in the road:

### Option A — Clerk end-to-end (most spec-literal, most invasive)
Configure Clerk to allow **unverified sign-ups** (enter email/phone, skip the code), verify
later via Clerk's prepare/attempt exactly as §8 describes.
- **Problem:** our bridge *fails closed on a VERIFIED email by design* — that rule is what
  prevents someone claiming `brent@futurelandcle.com` from landing in Brent's profile. Letting
  unverified identifiers through means reworking the bridge's identity model so unverified
  entries get an unlinked identity that only merges on verification. This is precision
  security surgery on our most-audited component.
- **SMS still needs** the Clerk paid plan + toggle for production.
- **Cost:** the biggest build (~2 weeks incl. re-audit of the bridge). **Risk: highest.**

### Option B — Anonymous-first on Supabase (recommended)
Starter = a **Supabase anonymous session** (a first-class Supabase feature; one dashboard
toggle + config line to enable). The Floor stores name + claimed contact (marked
unverified); the person is in the room with a real `auth.uid()`, so RLS, attendances,
matching, recap identity all just work.
- **Verify = attaching the contact to that same account** (Supabase sends the email OTP —
  works on prod TODAY, free) — the anonymous user *converts in place to a verified one with
  the same uuid*. **No account merging, ever.** Badge = contact confirmed.
- **Phone verify** arrives later by adding an SMS provider (Twilio via Supabase) — or via
  Clerk once its SMS is enabled — without changing the flow's shape.
- Clerk keeps its current jobs untouched: returning sign-in, Google, the bridge. The event
  door (/join) becomes the new Floor; /signin stays as-is.
- **Cost:** ~1.5–2 weeks total across four phases (below). **Risk: low** — no bridge changes,
  no RLS rewrites, one new auth mode to test.

### Option C — Keep verified entry, restage it (least change)
Keep today's verify-at-door but reshape it to *feel* like the spec: Floor collects name +
contact, fires the code immediately, and lets the person browse a read-only room while the
code sits in their inbox; full participation on code entry.
- **Cost:** days. **Risk: lowest.** But it isn't optimistic entry — a dead phone or slow
  email still stalls the door, which is the exact thing the spec exists to kill. Honest
  fallback if A/B feel too big right now.

## 4. Things to think about (the honest list)

1. **iOS PWA storage eviction — the big one.** Safari can purge a PWA's local storage after
   ~7 days of inactivity. A *verified* person just signs back in. An *unverified starter who
   never verified* has no recovery key — if their session evaporates, their night's identity
   is orphaned. Mitigations: the verify nudge is not just trust theater, it's *account
   recovery*; consider a "verify to keep your connections & recap" framing at night's end.
2. **Impersonation surface.** Optimistic entry means anyone can enter any name and be
   visible. The badge is the counterweight, and hosts can remove people — but consider a
   subtle "unverified" read on tiles (absence of the check may be enough) and keep the
   host-side Remove handy.
3. **Junk contacts break the recap promise.** Today every attendee has a deliverable,
   verified email. Under the spec, a typo'd unverified email = recap and survey never arrive.
   Watch this metric; the end-of-night nudge ("verify to get your recap") is the fix.
4. **Stewarded connections must survive the spec's shorthand.** Gate = *sending a request*
   requires verified. Receiving/accepting — decide: can an unverified person ACCEPT? (My
   recommendation: yes — accepting is low-risk and pulls them toward verifying.)
5. **SMS economics.** Email verify: free. SMS: cents per message × headcount × retries, plus
   the Clerk-plan or Twilio setup, plus international/toll-fraud settings. Email-default with
   SMS as the alternate channel is the sane launch posture.
6. **Purple's job.** The design system reserves purple for "private/for-you-only." The spec
   uses purple for the gate toast. Close enough in spirit ("this concerns you") to keep, but
   it's a conscious widening of purple's job — flagging so it's a decision, not drift.
7. **The funnel view gets better.** `you_state` gives the admin funnel real steps (landed →
   floor → visible → card → verified → connected) — a free win for the analytics the ADMIN
   prototype designed.
8. **Timing.** BTW is July 14–16. Do not swap the front door days before an event. Build on
   the branch, preview it, ship after BTW — with LNT-style smaller events as the first live
   test.
9. **Two doors, one truth.** A returning verified user scanning a room QR must be recognized
   (session resolve → straight to room), not pushed through the Floor as a stranger. The
   spec's server-decides posture handles this; it just needs to be in the acceptance tests.
10. **Server-decides is already our religion.** The spec's §7 "can_connect computed
    server-side" matches how everything is built (RLS + owner-checked RPCs). No philosophical
    retrofit needed — just the new `you_state` column + a connect-gate check in the existing
    request endpoint.

## 5. Recommended path (Option B, phased)

- **Phase 0 — enablements (Brent + config, ~an hour):** enable Anonymous Sign-ins in the
  Supabase dashboard (prod) + config; separately, in the Clerk dashboard check the
  phone/SMS toggle + plan question (useful regardless of path).
- **Phase 1 — Door + Floor + state (~3–4 days):** the new /join Floor (name + channel toggle
  + contact), anonymous session mint, `you_state` migration, session-resolve endpoint,
  server-side connect gate in the existing request route.
- **Phase 2 — Room hub (~2 days):** progress meter, one gentle nudge, verified check on
  tiles (the micro-card check from the labs), purple gate toast, green confirms.
- **Phase 3 — Verify (~1–2 days):** email OTP now (Supabase, free, prod-ready); SMS behind a
  flag until the provider decision lands.
- **Phase 4 — the card flow:** this is the Labs 04–06 build (flip card, sheet, deal
  collapse, patterns) — already spec'd by this week's sessions; the spec's §9 handoff seam
  is exactly our "tap your own tile → card flow."

Everything behind the branch preview; nothing touches prod until after BTW and a green
walk-through.

## 6. Decisions Brent owns

1. **Path: A, B, or C?** (Recommendation: B.)
2. **SMS at launch or email-first?** (Recommendation: email-first, SMS fast-follow; check
   the Clerk plan/toggle either way since the hang-up is worth resolving on its own.)
3. Can unverified people **accept** requests? (Recommendation: yes.)
4. Purple as the gate color — bless the widened job? (Recommendation: yes.)
5. Timing: build now on the branch, ship after BTW? (Recommendation: yes.)
