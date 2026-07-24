# SODA Build: Ops Manual Gap Analysis

**Date logged:** June 23, 2026

*What the Equalpoint / SODA Engineering and Product Operations Manual (v1.0, June 22 2026) adds to the build that is not already accounted for. This is a gap map, not a summary. It separates what is genuinely new work from what the build already covers, so nothing gets double-built and nothing urgent gets missed. A product of Equalpoint, Inc.*

---

## How to read this

The manual is mostly aligned with the build already in motion. The value of this document is isolating the delta: the new units, the one direct conflict, and the things already covered so they are not rebuilt. Everything is sequenced the way the manual sequences it, LNT first, then BTW, then September.

Three things to hold in mind. First, two new items are P0 security holes in the live system, they jump the queue ahead of everything else. Second, there is one decision in the manual that contradicts a decision already locked, and it has to be resolved deliberately. Third, most of the rest is real but not urgent, new architecture and new tables that sequence across the three events.

---

## The urgent two: new P0 security work before LNT

These are not future features. They are open holes in the system as it runs today, and the manual marks both P0, both due before LNT.

### Gap 1: Pre-authentication code issuance on the ops dashboard (SODA-042)

This is the most serious item in the manual. The ops login screen currently issues a working OTP to any email submitted, including emails not on the authorized list. Anyone with any valid email can receive a code and reach the ops dashboard. The system never checks whether the email is allowed to be there.

The fix is a server-side pre-authorization gate: before any code is generated, one service-role query checks whether the email is in an ops_authorized_emails table. If no, return a neutral response and send nothing and log the attempt. If yes, generate the code. The response is worded identically either way, so the screen never reveals whether an email is authorized.

> **New unit, P0, pre-LNT.** SODA-042, the ops login pre-authorization gate. This is effectively the eleventh risky unit and the most urgent of all of them, because it is live. Owner is Kennis on the backend with Brent reviewing.

### Gap 2: OTP enumeration on the attendee front door

The attendee login lets any email trigger an OTP send, which confirms whether that email exists in the system. An attacker can use the attendee door to discover valid ops and host emails. The fix is to separate the entry points by role so the attendee door and the ops door are different paths with different behavior.

> **New unit, P0, pre-LNT.** Separate the attendee and ops entry points, different subdomains or routes, with server-side role enforcement. This overlaps with the Clerk front-door work already planned, so do them together, but the security requirement is the part that cannot slip.

---

## The one conflict: secrets management

The manual and a locked decision disagree, and this needs a deliberate call rather than a quiet default.

The manual's Phase 3 protocol states that secrets live in Doppler with no .env files. The build's locked decision SODA-030 states that secrets live in Vercel environment variables. These contradict each other directly.

> **Decision to resolve.** Doppler (per the manual) versus Vercel environment variables (per SODA-030). One wins. Take it to Brent, decide deliberately, and log the outcome in the Decision Log so the record is consistent. Until resolved, this is a known open contradiction, not a settled choice.

---

## New architecture units (real, sequenced across the events)

These are genuinely new build units the current checklist does not contain. None are live holes, so they sequence across BTW and September rather than jumping to LNT, with one exception noted.

### resolveAttendeeScreen(), the server-side screen router

The manual makes one named function the single source of truth for what screen an attendee sees, computed server-side on every session load, never client-side, never cached. It resolves to one of ACTIVE_HOME, POST_EVENT_SURVEY, MATCHES_DELIVERED, or WINDOW_CLOSED based on event state and time. This is a new unit, and it is security-adjacent because the whole point is that the server decides routing, not the client. The manual wants it as a named, tested utility before BTW.

### Timed survey-window architecture

A specific discipline for any timed window: the timer is computed from server time and always visible, the window closes on the server by removing the form from the API response entirely (not hidden, not disabled, removed), and the close is a Realtime state change in place, not a redirect or reload. This pairs with the survey work already on the list but adds hard constraints. Due before BTW.

### The Zustand state layer

A new state-management layer the stack notes do not currently include. Four stores, one per domain: useEventStore, useAttendeeStore, useAuthStore, and a separate useOpsStore that attendee components can never reach. The manual is emphatic that Zustand is UI coordination only and never a trust boundary, the server stays the only authority. Full architecture due before September.

### New tables and infrastructure

Several pieces of new schema and infra the build does not have yet:

- ops_authorized_emails, the allowlist the SODA-042 gate checks against. Needed for LNT.
- ops_login_attempts, the audit log that records every ops login attempt. Due before BTW.
- An OTP token table with one-time-use flag, email binding, hash-only storage (plain OTP never stored), and server-enforced ten-minute expiry. Due before September.
- Rate limiting on all auth endpoints, Upstash or equivalent, six-plus attempts per IP per fifteen minutes triggers a limit. Due before September.
- loop_events ledger with an append-only constraint verified in CI. Due before BTW.

### Repo-level continuity artifacts

The manual formalizes process artifacts the repo does not yet hold:

- DECISIONS.md in the repo, every locked non-negotiable with date, reason, owner. Due before September.
- PIPELINE.md, the SODA-to-Equalpoint contract specifying what SODA writes and what Equalpoint reads. Due before September.
- /docs/tickets/ directory, seeded with SODA-039 as the pattern. Due before September.

---

## Already covered (do not double-build)

Equally important: several things in the manual are already in the build or already how the team works. Naming them prevents rebuilding what exists.

- **SODA-039, the chip migration.** Already in the build checklist and the risky ten. The manual just confirms it as a pre-LNT gate. Same work, not new.
- **The GMW agent roster and five-phase process.** Largely matches how the team already operates. The manual documents it rather than introducing it.
- **Separation of attendee and ops entry points.** Overlaps with the Clerk front-door work already planned. The security framing is the new part, not the work itself.
- **The server-decides posture.** The same principle the RLS-first approach already follows. The manual extends it to screen routing and state, which is the new surface, but the philosophy is already in place.
- **The two-call gate and human-in-the-loop.** Already the spine of the nudge architecture. Consistent with the manual, nothing to add.

---

## The net new work, in priority order

Stripping it to just the delta, sequenced the manual's way:

**Before LNT (imminent, includes live P0 holes):**

1. SODA-042, ops login pre-authorization gate (P0, live hole)
2. Attendee and ops entry points separated (P0, fixes OTP enumeration)
3. ops_authorized_emails table (supports SODA-042)
4. Neutral response pattern on ops login
5. Resolve the Doppler versus Vercel secrets conflict
6. SODA-039 chip migration (already in build, confirmed as a gate)

**Before BTW (July 14 to 16):**

7. resolveAttendeeScreen() as a named, tested utility
8. Survey-window architecture with Realtime close
9. ops_login_attempts audit table
10. loop_events append-only ledger with CI constraint
11. Ghost Mode 3 debt audit
12. Nelson's STUDY-001 research protocol locked

**Before September 14 launch:**

13. Full Zustand store architecture, four domain stores
14. OTP token table, one-time-use, email-bound, hash-only
15. Rate limiting on all auth endpoints (Upstash)
16. DECISIONS.md in repo
17. PIPELINE.md, the SODA-to-Equalpoint contract
18. /docs/tickets/ seeded with SODA-039
19. Ghost Mode 3 debt audit re-run

---

**Status:** Gap analysis captured June 23, 2026, against ops manual v1.0. The two P0 security items are live holes and lead the LNT work. The Doppler versus Vercel conflict is unresolved and needs a deliberate decision. Everything else sequences LNT then BTW then September as the manual specifies. Fold the new units into the build checklist and the risky ten next.
