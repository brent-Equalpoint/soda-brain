# GMW Task Brief
## SODA Flow Fixes — Attendee Return Flow + Host/Ops Auth Gate

---

## System Load

Read these files before doing anything else:

1. `.agent/AGENTS.md`
2. `system/orchestrator.md`
3. `docs/CONTEXT.md`
4. `docs/STACK.md`
5. `.agent/SESSION.md`

---

## Overview

Two tickets. Both are urgent. One is UX/flow. One is security. They do not block each other and can be planned in parallel, but the security ticket (SODA-044) must ship before LNT.

---

## TICKET 1 — SODA-043
### Attendee Return-to-Event Flow + That's a Wrap Screen

**Priority:** High
**Prototype Required:** Yes
**Triggers Echo:** Yes — all screen copy must be reviewed
**Triggers Load:** No

---

### Problem

The Return-to-Event screen and That's a Wrap screen both have structural, copy, and time-logic issues. They show the wrong state at the wrong time and contain UI elements that do not belong.

---

### Screen 1: Return-to-Event (Welcome Back)

**Current behavior:**
- Shows "Welcome Back, You're in [X] Room — Tap to Step Back In"
- Displays the SODA wordmark twice: once as the logo, once as a large heading
- Shows a tagline: "A name tag knows you showed up. SODA knows who you became to the room"
- Shows a card below the welcome message (no clear purpose, context too generic)
- Shows an "In an event?" card for switching rooms

**Required changes:**

1. Remove the large SODA heading. Logo only. Alysha will supply the asset.
2. Remove the tagline entirely. Do not replace it.
3. Remove the generic card below the welcome message.
4. Remove the "In an event?" card. It is not relevant for returning to a single event. Multi-event conference room switching is a future scope item — log it, do not build it.
5. Replace all of the above with one of two simple re-entry options:
   - A timed gate that auto-enters the room (show countdown)
   - Enter Event Code / Scan QR to re-enter

**Time-gate rule (new logic required):**
- Welcome Back screen is ONLY active while the event is open OR within 5 hours of event start time
- If the event has closed and the 5-hour window has passed: do not show Welcome Back. Show the closed event screen instead with a warm redirect.
- This requires checking event_status and event start/end time on load.

---

### Screen 2: That's a Wrap

**Current behavior:**
- Appears as a transparent overlay when a returning attendee taps into a closed room
- Heading and CTA are not centered
- Shows after any amount of time post-close

**Required changes:**

1. That's a Wrap is its own full directive screen. Not an overlay. Not transparent.
2. Heading ("That's a Wrap") and CTA must be centered on the page.
3. Copy direction: "One last thing before you go" + CTA to survey. Echo reviews all copy on this screen.
4. Time gate: That's a Wrap screen only shows within 30 minutes of event close.
5. After 30 minutes: do not show That's a Wrap. Show closed event screen only.
6. If the attendee does not complete the survey: email the survey to them. This requires a timed follow-up trigger — if survey_completed = false at [X minutes post-event], send survey email. Kennis owns this logic. Nelson must confirm the survey completion field maps correctly to the loop_events ledger before Kennis builds.

---

### State Machine for Returning Attendee (new)

```
Returning attendee loads app
  └─ Event is OPEN and within active window
       └─ Show: Welcome Back screen (timed gate or QR/code re-entry)
  └─ Event is CLOSED and within 30 minutes of close
       └─ Show: That's a Wrap screen → CTA to survey
            └─ Survey completed? Log it.
            └─ Survey skipped? Queue email follow-up.
  └─ Event is CLOSED and 30+ minutes have passed
       └─ Show: Closed event screen (warm, no survey push)
```

---

### Acceptance Criteria — SODA-043

- [ ] Return-to-Event screen shows logo only (no wordmark heading, no tagline)
- [ ] Return-to-Event screen shows timed gate OR QR/code re-entry only
- [ ] Welcome Back screen does not render if event is closed and 5-hour window has passed
- [ ] That's a Wrap is a full directive screen, not an overlay
- [ ] That's a Wrap heading and CTA are centered
- [ ] That's a Wrap only renders within 30 minutes of event close
- [ ] Survey skip triggers email follow-up
- [ ] All screen copy reviewed and cleared by Echo before Kennis activates
- [ ] Ghost Mode 1 + Mode 2 on all new screens and state logic

---

---

## TICKET 2 — SODA-044
### Host / Ops Auth Gate + Rate Limiting

**Priority:** Critical — blocks LNT
**Prototype Required:** Yes (ops login screen changes are user-facing)
**Triggers Cipher:** Yes — automatically. This ticket is entirely auth surface.
**Triggers Load:** Yes — rate limiting behavior under concurrent requests

---

### Problem

The ops and host login screens have no gate on code issuance. Any email can be submitted and receive a valid OTP. There is no check that the submitting email is on the authorized list before the code is sent. This means an attacker can:
1. Enumerate whether an email is in the system via OTP send behavior
2. Receive a valid code if they somehow obtain an authorized email
3. Spam the endpoint with no rate limiting

These are Cipher FINDING-001 and FINDING-002 from the June 2026 security review. Both block LNT.

---

### Required Changes

**1. Pre-authorization gate (FINDING-001)**

Before any OTP is generated or sent, the server must:
- Check whether the submitted email exists in the authorized ops/host list
- Use the service role key for this check — never the anon key
- The authorized list must never be returned in any client response
- If the email is not authorized: do not generate a code. Return the neutral response.
- If the email is authorized: generate and send the code.

This check must be server-side in the API route. It must not be client-side.

**2. Neutral response pattern (FINDING-002)**

The login endpoint must return an identical response for authorized and unauthorized email paths. The response must not reveal:
- Whether the email exists in the system
- Whether the email is on the authorized list
- Whether a code was sent

Correct neutral response:
`"If that address is authorized, you'll receive a code shortly."`

This applies to the ops login screen copy AND to the API response. Echo reviews the copy. Cipher verifies the API response.

**3. Auth differentiation**

Host and Ops auth should be meaningfully separated from attendee auth. Evaluate whether the ops login endpoint should be on a different path and whether the Clerk org role check needs to be moved earlier in the flow. Do not change the attendee login flow as part of this ticket — scope is ops/host only.

**4. Rate limiting**

Implement server-side rate limiting on:
- Email submission endpoint: max 5 attempts per IP per 15 minutes
- OTP verification endpoint: max 3 attempts per session per 10 minutes
- Lockout response must be the same neutral response — do not reveal that rate limiting triggered
- Log all attempts (authorized and not) to ops_login_attempts table

Cipher will verify all four of the above. Ghost cannot issue PASS on this ticket without Cipher PASS.

---

### Acceptance Criteria — SODA-044

- [ ] Authorized list check runs server-side before OTP is generated
- [ ] Check uses service role key
- [ ] Unauthorized email: no code generated, neutral response returned
- [ ] Authorized email: code generated and sent
- [ ] API response is identical for both paths (text and timing)
- [ ] Ops login screen copy uses neutral response pattern ("If that address is authorized...")
- [ ] Rate limiting active on both email submission and OTP verification endpoints
- [ ] Lockout response is neutral
- [ ] All auth attempts logged to ops_login_attempts
- [ ] Cipher report attached to QA-SODA-044.md
- [ ] Echo clears all auth copy on ops login screen
- [ ] Ghost PASS required. No merge without Cipher PASS.

---

---

## Feature Note (Log for Future Ticket)

**Calendar / Event Scheduling Automation**
A Notion-style calendar that automates event time and schedule management. Log this as a future ticket. Do not spec or build it as part of SODA-043 or SODA-044. File it in the backlog when Orchestrator creates the plan.

---

---

## Instructions for Orchestrator

1. Assign SODA-043 and SODA-044 as two separate tickets.
2. Create `docs/tickets/SODA-043/` and `docs/tickets/SODA-044/` directories.
3. For SODA-043: activate Nelson first to confirm survey completion field maps correctly to loop_events before any implementation begins. Then proceed Experience-First — Aniya prototypes both screens, Echo reviews all copy, Future approves, Kennis derives contract.
4. For SODA-044: this is Cipher territory from the first line. Cipher runs alongside every phase. No PASS without Cipher PASS. Produce SPEC-SODA-044.md first and present to Future for approval before any code is written.
5. Log the calendar feature request as a future backlog item.
6. Update SESSION.md after each phase transition.
7. Scribe files artifacts. Ticket does not close without Scribe CLEAR TO CLOSE.
