# Equalpoint / SODA Engineering and Product Operations Manual

*Process Engineering, Agent Workflows, User Flows, Security Architecture, and State Management*

**v1.0, June 22, 2026**  
**Alysha Ellis Montgomery, CEO  ·  Brent Montgomery, CTO**  
**CONFIDENTIAL · INTERNAL USE ONLY**  

---

## Section 1: Process Engineering for Implementation and Documentation

Process engineering is the practice of deciding what to build, recording how it was built, verifying it was built correctly, and leaving the system in a state where the next person can continue without a briefing.

### 1.1 The Four Floors

All engineering work moves through four layers. No layer is skipped.

| Floor | Purpose |
| --- | --- |
| Floor 4: Continuity | SESSION.md, AGENTS.md, decision logs, handoff artifacts |
| Floor 3: Verification | Ghost's audits, pre-launch checklists, QA reports |
| Floor 2: Implementation | Tickets, PRs, migrations, code |
| Floor 1: Specification | Schema decisions, API contracts, non-negotiables |

### 1.2 The Five Phases

Every ticket, feature, or fix flows through exactly five phases in sequence. No phase is skipped. No ticket merges without a Ghost pass.

Phase 1: Intake

Intake converts raw signal into a scoped problem statement. Four sentences maximum.

PROBLEM STATEMENT TEMPLATE

1. What is broken or missing right now?

2. Who is affected and how?

3. What does a working version look like?

4. What must not break when we fix this?

Gate to Phase 2: Is this one problem or multiple? If multiple, split the ticket.

Phase 2: Specification

The specification is the blueprint. Written before a single line of code. Defines the exact shape, constraints, and verification criteria.

| Section | Contents |
| --- | --- |
| Context | Why does this exist? What pilot, constraint, or goal drives it? |
| Change | What exactly changes. Before/after schema, API contract, or component description. |
| Constraints | What must not change. Non-negotiables referenced by name. |
| Pipeline Impact | What downstream systems read or write to the thing being changed. |
| Acceptance Criteria | Numbered PASS IF statements. Ghost verifies without asking questions. |
| Decision Log Entry | If a new architectural rule is locked, write it here. |

Gate to Phase 3: Kennis can build without asking any architectural questions.

Phase 3: Implementation (Experience-First Protocol)

Locked protocol. Every feature follows this sequence.

Step 1  ANIYA    Prototype with mock data only. No real API calls.

Gate:    Future approves the visual.

Step 2  KENNIS   Derives API contract from the approved screen.

Gate:    Contract approved before any backend code starts.

Step 3  KENNIS   Builds migration, API routes, business logic to contract.

Step 4  BRIANNA  Verifies environment: Doppler secrets, no .env files,

clean staging deployment.

Step 5  GHOST    Verifies against acceptance criteria. PASS or FAIL.

Gate:    Nothing merges to main without Ghost PASS.

Phase 4: Verification

Ghost runs three modes in order. A failure in Mode 1 stops Mode 2.

| Mode | What It Checks |
| --- | --- |
| Unit | The changed thing in isolation. Does it work on its own? |
| Integration | The changed thing connected to everything else. Does the pipeline hold? |
| Regression | Everything that was working before the change still works. |

Gate to Phase 5: Ghost produces PASS on all three modes. No exceptions.

Phase 5: Continuity

Leave the system better than you found it. Four artifacts required on every shipped ticket.

| Artifact | Contents |
| --- | --- |
| SESSION.md | Current state, completed work, in-progress, blocked, next agent needs. |
| Decision Log Entry | Every locked architectural decision: what, when, why, owner, status. |
| Pipeline Contract | What SODA writes, what Equalpoint reads, who owns each end. |
| Updated Reference File | If a ticket changes how the system works, the reference file updates. |

### 1.3 Implementation Artifact Map

Every implementation step produces at least one artifact. These live in /docs/tickets/[TICKET-ID]/.

| Artifact | Contains |
| --- | --- |
| SPEC-[ID].md | Full specification document |
| CONTRACT-[ID].md | Request/response shapes, Zod schemas, error states |
| MIGRATION-[ID].sql | Full SQL migration with RLS policy |
| DEPLOY-[ID].md | Environment checklist, secret verification, staging URL |
| QA-[ID].md | Acceptance criteria results, PASS/FAIL per item, findings |

### 1.4 Ticket Naming Convention

| Prefix | Domain |
| --- | --- |
| SODA-XXX | SODA room operating system |
| EQP-XXX | Equalpoint platform |
| FL-XXX | Futureland operational |
| INFRA-XXX | Infrastructure, DevOps, environment |
| DATA-XXX | Data pipeline, schema, migration |
| STUDY-XXX | Nelson's research protocol tickets |

### 1.5 Weekly Operating Rhythm

| Day | Focus |
| --- | --- |
| Monday | Read SESSION.md. Identify in-flight work. Write intake for new problems. |
| Tuesday / Thursday | Uninterrupted build windows 9am-3pm. Orchestrator routes. Agents build. |
| Friday | Continuity day. Decision log updated. Reference files updated. SESSION.md closed. |
| Wednesday | Off. Nothing ships Wednesday. |

## Section 2: Agent and Sub-Agent Workflow

The GMW (God Made Weapon) agentic dev team executes all five phases. Each agent has a defined inbox, a defined output, and a scope ceiling. Agents do not make product decisions. Scope ambiguity surfaces to the Orchestrator, which surfaces to Future.

### 2.1 Agent Roster and Responsibilities

| Agent | Role and Scope |
| --- | --- |
| Future (You) | Executive Chef. Writes intake. Sets priority. Approves gates. Locks decisions. |
| Orchestrator | Sous Chef. Routes work. Synthesizes specs. Writes SESSION.md. Never makes product decisions. |
| Aniya | Frontend. Prototypes with mock data. Owns visual approval. Cannot touch backend or DB. |
| Kennis | Backend. Builds migrations, API routes, business logic. Cannot change warmth formula without spec. |
| Brianna | DevOps. Verifies environment, secrets, staging. Cannot approve or reject builds. |
| Ghost | QA. Runs unit, integration, regression verification. Cannot fix what she finds. |
| Nelson | Research. Owns study protocols and outcome analysis. Cannot ship product features. |

### 2.2 The Routing Model

The full flow from intake to continuity, showing which agent owns each step.

FUTURE (You)

Phase 1: INTAKE

Write Problem Statement. Assign ticket ID and priority.

Gate: Is this one problem?

ORCHESTRATOR

Phase 2: SPECIFICATION

Receive intake. Route to Brent for technical constraints.

Route to Nelson if research protocol involved.

Synthesize spec. Return to Future for approval.

Gate: Future approves. Spec is LOCKED.

ORCHESTRATOR routes to IMPLEMENTATION team:

ANIYA   Step 1: UI prototype with mock data

Gate: Future approves visual

KENNIS  Step 2: API contract from approved UI

Gate: Contract approved before backend starts

KENNIS  Step 3: Migration, API routes, business logic

BRIANNA Step 4: Environment verification, staging deploy

GHOST

Phase 4: VERIFICATION

Receives: Spec + Build + Staging URL

Runs: Unit -> Integration -> Regression

FAIL -> back to Kennis with specific finding

PASS -> advance to Phase 5

ORCHESTRATOR + FUTURE

Phase 5: CONTINUITY

SESSION.md updated. Decision Log updated.

Pipeline Contract updated. Reference files updated.

Ticket closed.

### 2.3 Agent Boundaries (What Each Agent Cannot Do)

| Agent | Cannot Do |
| --- | --- |
| Orchestrator | Make product decisions. Override Future. |
| Aniya | Touch backend, DB, or API routes. Make architectural decisions. |
| Kennis | Change warmth formula without a spec change. Merge without Ghost PASS. |
| Brianna | Approve or reject builds. Make product or architecture decisions. |
| Ghost | Fix the issues she finds. Approve work before verification is complete. |
| Nelson | Ship product features. Make engineering decisions. |

### 2.4 The Decision Log

Every locked architectural decision gets a Decision Log entry. This is how non-negotiables become institutional memory.

DECISION LOG ENTRY FORMAT

Decision: [What was decided]

Date: [When it was locked]

Reason: [Why this decision was made]

Owner: [Who owns it]

Status: DRAFT | APPROVED | LOCKED

LOCKED status means: a formal spec change is required to alter this decision.

Current Locked Decisions:

| Decision | Status |
| --- | --- |
| Warmth formula decay rate fixed at e^(-0.01 x days). Requires spec change to alter. | LOCKED |
| Two-call approval gate: /api/draft generates, /api/draft/approve writes. Never merged. | LOCKED |
| loop_events ledger is append-only. No deletes. No updates. | LOCKED |
| Only two warmth phrases: "in rhythm" and "it has been a while". Enforced in CI. | LOCKED |
| Secrets via Doppler only. No committed .env files. | LOCKED |
| Status is derived. Never persisted. Always recomputable from warmth_score + days. | LOCKED |
| Max 1 push notification per connection per 7 days. Enforced server-side. | LOCKED |
| ChipCategory enum: professional, interest, location, goal, identity. Adding sixth requires spec. | APPROVED |

## Section 3: User Flow Architecture

SODA and Equalpoint serve three distinct user types, three distinct entry contexts, and three distinct time states. Each requires its own entry gate. Sharing entry gates across user types is the root cause of the security and UX issues documented in this section.

### 3.1 The Three User Types

| User Type | Description and Auth Method |
| --- | --- |
| Attendee | Someone at a Futureland event. Auth: phone OTP or magic link, time-gated. Role ceiling: ATTENDEE only. Cannot reach host view. |
| Host / Ops | Event staff, Nicole, Nelson, Brent, Future. Auth: separate subdomain, Clerk org membership check server-side. Role ceiling: HOST only if Clerk org role is confirmed. |
| Returning Platform User | Someone with an Equalpoint account from a past event. Auth: Clerk session, persistent login, recognized device. |

### 3.2 Attendee State Machine

Every screen an attendee sees is computed server-side based on current event state and current time. The client never decides what screen to show. The server always decides.

| State | Trigger and Screen |
| --- | --- |
| Pre-Event | Before event date. Screen: "You are registered. See you [Date]." No login prompt. |
| Event Active | Event day, doors open. Screen: WelcomeScreen. First-time or returning branch. |
| Checked In | OTP verified. Screen: AttendeeHomeScreen. Session tied to event_id. |
| Match Delivered | Post-scan. Screen: MatchResultScreen. Warmth initialization occurs here. |
| Event Ends | Host closes event from ops dashboard. Realtime update fires on client. |
| Post-Event Window (0-48h) | Screen: ThatIsAWrap. Survey open. Timer visible. Countdown is real and server-computed. |
| Post-Window (48h+, no survey) | Screen: "Your matches are waiting." Survey is gone from DOM entirely. Soft Equalpoint prompt. |
| Equalpoint Onboarding | Handoff from SODA. Profile pre-filled from SODA data. Warmth dashboard loads with connections. |

### 3.3 Screen Decision Tree

This logic runs server-side on every session load. Never cached. Never client-computed.

function resolveAttendeeScreen(session, event):

now = Date.now()

surveyWindowClose = event.ended_at + 48h

if not event.ended_at:

return ACTIVE_HOME

if now < surveyWindowClose and not session.survey_completed:

return POST_EVENT_SURVEY

if now < surveyWindowClose and session.survey_completed:

return MATCHES_DELIVERED

if now > surveyWindowClose:

return WINDOW_CLOSED

return ACTIVE_HOME

This function is the single source of truth for screen routing. It is named, tested, and called on every session load.

### 3.4 First-Time vs. Returning Attendee Screens

These are two different components, not the same component with a substituted name.

| First-Time Attendee | Returning Attendee |
| --- | --- |
| Introduce yourself. Name and email. | Skip the introduction. They know how it works. |
| Pick your chips. Explain what SODA does. | One tap to check in. No explanation needed. |
| No assumptions about prior knowledge. | Show something new: connections from last event. |
| Full onboarding flow. | Abbreviated check-in flow. |

### 3.5 Timed Window Architecture (Survey, Feedback, Follow-Up)

Three rules for any timed action window in SODA or Equalpoint:

- Rule 1: The timer is always visible and always real. Computed from server time, not client time.
- Rule 2: The window closes on the server. When closed, the form is removed from the API response entirely. Not hidden. Not disabled. Removed.
- Rule 3: Closing the window is a state change, not a redirect. The screen transitions in place via Realtime subscription. No page reload.
SURVEY WINDOW TIMELINE

T=0 (event ends):   Survey opens. Timer visible. Form submittable.

T=24h:              Timer shows 24:00:00 remaining. No other change.

T=47:30:00:         Timer color shifts to amber. Under 30 minutes warning.

T=48h (deadline):   Server flips survey_open = false. Realtime fires.

Survey slides out. Closed message slides in.

One CTA: Join Equalpoint to see connections any time.

T=48h+ (return):    resolveAttendeeScreen() returns WINDOW_CLOSED.

Survey is not in the DOM. No confusion.

## Section 4: Security Architecture and Auth Gates

Two security vulnerabilities were identified and documented. Both are P0. Both must be resolved before LNT.

### 4.1 Vulnerability 1: OTP Enumeration (Attendee Front Door)

The attendee-facing login screen allowed any email to trigger an OTP send, confirming whether that email existed in the system. This is a known attack vector called OTP enumeration.

ATTACK PATH (PRE-FIX)

Attacker knows or guesses an ops/host email.

Goes to attendee-facing login screen.

Types the ops email.

System sends OTP to that email (pre-fix).

Even without reading the code, attacker now knows the email is valid.

If inbox is ever compromised, attacker is one code away from host-level access.

Fix: Separate Entry Points by Role

| Entry Point | Configuration |
| --- | --- |
| Attendee Entry URL | app.soda.live/join or scan QR. Role ceiling: ATTENDEE only. |
| Host/Ops Entry URL | ops.soda.live (separate subdomain). Role ceiling: HOST if Clerk org role confirmed. |
| Rate Limit | 3 OTP attempts per 10 minutes per device. 5 attempts per IP per 15 minutes. |
| Response Pattern | Neutral always: "If that address is registered, you will receive a code shortly." |

### 4.2 Vulnerability 2: Pre-Authentication Code Issuance (Ops Dashboard)

Critical finding: the ops login screen issued a valid OTP to any email submitted, including emails not in the authorized list. An attacker with any valid email address could receive a working code and access the ops dashboard.

VULNERABILITY: PRE-AUTHENTICATION CODE ISSUANCE

Anyone types any email on the ops login screen.

System sends a valid OTP to that email.

Person reads the code from their own inbox.

Person is now inside the ops dashboard.

The system never checked: is this email authorized to be here?

Fix: Pre-Issuance Authorization Check

One server-side query runs before the OTP is generated or sent. This is the gate that was missing.

User submits email on ops login screen

|

v SERVER ONLY (service role, never client-side)

Is this email in ops_authorized_emails table?

|

NO  -> Return neutral response. Send nothing. Log attempt.

YES -> Generate OTP. Send to that email. Start expiry timer.

|

v RESPONSE TO USER (identical in both cases)

"If that address is authorized, you will receive a code shortly."

Required Database Tables

| Table | Purpose |
| --- | --- |
| ops_authorized_emails | Allowlist of emails permitted to access ops. RLS: service role only. Never client-accessible. |
| ops_otp_tokens | OTP stored as hash, bound to issuing email, one-time use flag, expiry timestamp. |
| ops_login_attempts | Audit log: email, authorized (bool), IP, user agent, outcome, timestamp. Every attempt logged. |

OTP Security Properties

- OTP bound to issuing email. Cannot be redeemed by a different email.
- One-time use. Used flag set immediately on successful redemption.
- Expires in 10 minutes. Server-enforced, not client-enforced.
- Plain OTP never stored. Token hash stored only.
- Response timing is identical for authorized and unauthorized paths.

### 4.3 The Four Security Principles

| Principle | What It Means |
| --- | --- |
| State lives on the server | Screens are projections of server state. The client cannot manipulate what screen it sees. |
| Every entry point has a role ceiling | An attendee session cannot be elevated to host access without a new auth flow at the host door. |
| Errors never confirm system information | Wrong email? Same message as right email. The system leaks nothing to an attacker. |
| Closed is closed, not hidden | When a feature closes, it is removed from the API response. Not toggled in CSS. Not disabled in HTML. |

### 4.4 SODA-042: P0 Security Ticket

TICKET SPECIFICATION

TICKET: SODA-042

Title: Ops Login Pre-Authorization Gate

Priority: P0 (blocking - security vulnerability in live system)

Owner: Kennis (backend) + Brent (technical review)

Problem: The ops login screen sends a valid OTP to any email submitted,

including emails not in the authorized list.

Acceptance Criteria:

PASS IF: Unauthorized email receives neutral response and no code

PASS IF: Authorized email receives code and can log in

PASS IF: Used OTP cannot be reused

PASS IF: Expired OTP is rejected

PASS IF: All attempts (authorized and not) are logged

PASS IF: 6+ attempts from same IP within 15 min are rate limited

PASS IF: Response time is identical for authorized and unauthorized paths

### 4.5 Full Error Redirect Map

| Error Type | What Happened | User Sees | System Does |
| --- | --- | --- | --- |
| Invalid OTP | Wrong code entered | "That code didn't match. Try again." | Decrement attempt count. Log failure. |
| Expired OTP | Code older than 10 minutes | "That code expired. We sent a new one." | Invalidate token in DB. Auto-resend. |
| Max Attempts | 3+ wrong codes entered | "Too many attempts. Try again in 15 min." | Lock session 15 min. Alert ops if repeated. |
| Event Not Started | Scan before doors open | "Doors open at [time]. See you soon." | No auth attempted. Show countdown. |
| Event Closed | Scan after event ended | "This event wrapped. Check email for matches." | Redirect to post-event screen. |
| Survey Window Closed | Returns after 48h for survey | "The survey window closed on [date]." | Survey removed from DOM entirely. |
| Duplicate Scan | Same person scans twice | "You are already checked in." | Idempotent. Return same session. |
| Wrong Role | Attendee URL with ops email | "If that address is authorized, you will hear from us." | Neutral response. Log attempt. |
| Session Expired | Returning user, stale token | "Your session expired. Let's get you back in." | Clear session. Start clean auth flow. |
| No Event Context | Direct URL, no event_id | "This link doesn't point to an active event." | Show holding page, not error screen. |

## Section 5: State Management with Zustand

Zustand solves UI coordination across components. It does not solve security or access control. Those are two different jobs requiring two different layers.

### 5.1 The Core Distinction

| Layer | What It Does |
| --- | --- |
| Zustand | Keeps the UI coordinated. Fast, reactive, in-memory. Every component reads from the same store. |
| Server | Enforces what is actually true. Role ceilings. Session validity. Event state. Window open/closed. |

The mental model: server decides, Zustand broadcasts, components react.

Zustand state lives in the browser. A determined user can modify it in DevTools. It is not a trust boundary. The server is the trust boundary.

### 5.2 What Zustand Solves in SODA and Equalpoint

- Screen state coordination: when event status changes, every component that cares updates instantly without prop drilling or duplicate fetch calls.
- Redundant API call prevention: fetch once on load, hydrate the store, every component reads from memory.
- Timed survey window: one source of truth for the deadline. Every countdown timer and conditional render reads from the same value.
- OTP flow state: multi-step auth flow (enter email, enter code, verified) lives in one store with attempt count and lockout tracking.

### 5.3 What Zustand Does NOT Solve

- Whether a user has a valid session. Server checks this.
- What role the user has. Server enforces this.
- Whether the event is still active. Server computes this.
- Whether the survey window is open. Server gates this.
- Whether the user is locked out of OTP attempts. Server enforces this.
All security checks run server-side and are enforced at the API level. Zustand reflects what the server confirms. It never overrides it.

### 5.4 Store Architecture

One store per domain. Not one giant store.

useEventStore

eventId: string | null

eventStatus: pre | active | closed

screenState: ScreenState        // server-computed, never client-modified

surveyWindowClose: number | null // epoch ms from server

surveyCompleted: boolean

useAttendeeStore

attendeeId: string | null

name: string

email: string

chips: Chip[]

matchCount: number

checkInStatus: pending | checked_in

useAuthStore  (ephemeral, auth flow only)

step: enter_email | enter_code | verified | locked

email: string

attemptsRemaining: number

lockedUntil: number | null

useOpsStore  (separate, ops-level sessions only)

eventList: Event[]

activeEventId: string | null

attendeeCount: number

matchCount: number

// Never accessible from attendee-facing components

### 5.5 The Correct Data Flow

User opens app

|

v

App calls GET /api/session (server)

Server runs resolveAttendeeScreen()

Server returns: { screenState, surveyWindowClose, ... }

|

v

App hydrates Zustand store with server response

useEventStore.setState({ screenState, surveyWindowClose })

|

v

Components read from Zustand and render

Countdown timer starts from store value

|

v

Supabase Realtime subscription fires on event_status change

App re-calls GET /api/session

Server returns new state

|

v

App updates Zustand store

All components re-render to new state instantly

### 5.6 The One-Sentence Architecture Rule

Server decides. Zustand broadcasts. Components react.

## Section 6: Pre-Launch Checklist

Three deployment gates before each major event. Work is sequenced: LNT first, then BTW, then September launch.

### 6.1 Before LNT (Imminent)

- SODA-039: Chip data migration from text[] to jsonb[] with category and context fields. Acceptance criteria verified by Ghost.
- SODA-042: Ops login pre-authorization gate. P0. Unauthorized email receives no code. Audit log active.
- Attendee and ops entry points separated. Different subdomains or routes with server-side role enforcement.
- Neutral response pattern active on ops login. Same message for authorized and unauthorized emails.
- Chip category alignment verified for LNT multi-ecosystem environment.

### 6.2 Before BTW Cincinnati (July 14-16)

- resolveAttendeeScreen() function exists as named, tested utility. Not inline logic.
- Ghost Mode 3 debt audit complete. All SODA surfaces verified.
- Survey window architecture with Realtime subscription update in place.
- loop_events ledger append-only constraint verified in CI.
- Nelson's Study One research protocol locked and documented as STUDY-001.
- ops_login_attempts audit table active. Logging every attempt.

### 6.3 Before September 14 Launch

- DECISIONS.md file in repo. All locked non-negotiables documented with date, reason, owner.
- PIPELINE.md document written. SODA-to-Equalpoint contract specifying what SODA writes, what Equalpoint reads.
- /docs/tickets/ directory seeded. SODA-039 spec, contract, and QA documents filed as the pattern.
- Full Zustand store architecture in place. One store per domain. No single giant store.
- OTP token table with one-time-use flag and email binding. Plain OTP never stored.
- Rate limiting active on all auth endpoints. Upstash or equivalent.
- Ghost Mode 3 debt audit run again pre-launch. All regressions cleared.
Equalpoint Engineering and Product Operations Manual

v1.0  ·  June 22, 2026  ·  Confidential
