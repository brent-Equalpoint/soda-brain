# GMW Task Brief
## SODA Attendee Overhaul — Post-Pilot Sprint 01
## June 2026

---

## System Load

Read these files before doing anything else:

1. `.agent/AGENTS.md`
2. `system/orchestrator.md`
3. `docs/CONTEXT.md`
4. `docs/STACK.md`
5. `.agent/SESSION.md`
6. `docs/PIPELINE.md`

---

## Context

This brief follows the first pilot event (Coffee Connect). Entry issues blocked attendees. In-room issues frustrated users. The card screen needs a full rethink. This is Sprint 01 of the attendee overhaul. Ops/Admin/Host work is Phase 2 and does not begin until this sprint ships and passes Ghost review.

---

## Architecture Decision — Resolve First

Before any feature work begins, the Orchestrator must resolve and lock two architectural decisions. These decisions affect every ticket in this sprint. Building any ticket before these are locked risks rework.

### Decision A: Auth Layer — Move from Supabase Auth to Clerk

**What:** Replace Supabase Auth with Clerk as the primary authentication provider for SODA.

**Why:** Supabase Auth has caused repeated friction during the pilot and development. Clerk offers better session management, organization-level roles (critical for Ops/Host separation), and a cleaner OTP flow. This also directly enables the pre-authorization gate required by SODA-044 (Cipher FINDING-001 and FINDING-002).

**Impact to assess before locking:**
- All existing auth flows must be remapped to Clerk (attendee OTP, ops login, host login)
- Supabase RLS still applies — Clerk JWT must be passed to Supabase correctly
- Session tokens and session handling throughout the app change
- Cipher must review the new auth surface before any Clerk routes ship
- Nelson must confirm the pipeline contract is unaffected (loop_events attribution must not break)

**Who reviews:** Kennis (implementation), Cipher (security surface), Nelson (pipeline impact)
**Who locks:** Future (Alysha)
**Required output before any ticket starts:** DECISIONS.md entry with locked decision. Kennis produces a migration plan as SPEC-SODA-045.md. Future approves.

---

### Decision B: State Management — Add Zustand

**What:** Add Zustand as the client-side state management layer.

**Why:** The pilot exposed state bugs across multiple screens — notes modal appearing blank, Welcome Back triggering on in-app back gesture, profile state not persisting correctly. Without a centralized state layer, these are band-aid fixes. Zustand gives Kennis and Aniya a shared, typed state store to work against.

**Impact to assess before locking:**
- All existing local state patterns (useState, prop drilling, query refetching for state) need to be audited and migrated
- Zustand stores needed at minimum: auth/session store, attendee/profile store, event store, notes store, room store
- Load must check that Zustand stores do not cause unnecessary re-renders under concurrent room load

**Who reviews:** Kennis (architecture), Load (performance), Aniya (component integration)
**Who locks:** Future (Alysha)
**Required output:** DECISIONS.md entry. Kennis produces store design as part of SPEC-SODA-045.md.

---

**Orchestrator:** Do not activate any ticket below until Decisions A and B are locked and SPEC-SODA-045.md is approved by Future.

---

---

## TICKET — SODA-045
### Clerk Migration + Zustand State Layer

**Priority:** Critical — foundation for all other tickets in this sprint
**Type:** Backend/Infrastructure
**Prototype Required:** No (infrastructure only — no new user-facing screens)
**Triggers Cipher:** Yes — entire auth surface is being replaced
**Triggers Load:** Yes — new state layer under concurrent room load
**Triggers Nelson:** Yes — confirm pipeline contract and loop_events attribution survive the migration

**Scope:**

1. Replace Supabase Auth with Clerk
   - Attendee OTP flow on Clerk
   - Ops/Host login on Clerk with org-level role separation
   - Clerk JWT passed to Supabase for RLS enforcement
   - Session token handling across the app updated

2. Zustand store design and implementation
   - `authStore`: current user, session, role, clerk token
   - `eventStore`: event_id, event_status, start/end time, room data
   - `profileStore`: attendee profile, chip selections, per-room profile state
   - `roomStore`: attendee list, real-time subscription state
   - `notesStore`: sent notes, received notes, modal open/close state, scroll position
   - `onboardingStore`: current step, completion state, tutorial modal seen/skipped

3. All existing local state patterns migrated to appropriate Zustand store

**Acceptance Criteria:**
- [ ] Clerk handles all auth — Supabase Auth fully removed
- [ ] Clerk JWT passes to Supabase RLS correctly — all RLS policies verified by Cipher
- [ ] All Zustand stores typed (TypeScript strict)
- [ ] No useState managing state that belongs in a store
- [ ] Cipher PASS required before merge
- [ ] Load verifies stores do not cause performance regression in room
- [ ] Nelson confirms loop_events pipeline unaffected
- [ ] Ghost PASS required
- [ ] Scribe CLEAR TO CLOSE required

---

---

## TICKET — SODA-046
### Entry + Onboarding Flow Fix

**Priority:** Critical — blocked attendees at pilot
**Prototype Required:** Yes
**Triggers Echo:** Yes — all screen copy reviewed
**Depends on:** SODA-045 (Clerk must be in place)

---

### Problem 1: New User Sign-In Error → Wrong Screen

**What happened at pilot:**
New users hit a sign-in error that sent them to an "Enter Room" prompt or a card click. They clicked the card thinking it was the room entry. They got stuck inside the card. They were frustrated and exited to redo sign-in.

**Root cause to investigate (Kennis):**
- What error state is sending new users to Enter Room instead of the correct onboarding step?
- Is this a session check that fails and falls through to an incorrect default route?
- Is the card being shown as a tappable room entry incorrectly?

**Required fix:**
- Map every error state in the new user sign-in flow. Each error state must route to a specific, correct screen — never a fallback that looks like room entry.
- The card on the entry/transition screen must NOT be tappable in a way that looks like room entry. If it is tappable, it must be clearly labeled as a profile card — not a door.
- New user flow must be linear and gated: Sign In → Profile Creation → Room Entry. No lateral escape routes.
- If sign-in fails mid-flow, the user must be returned to the exact step that failed with a clear, specific error message. Not a generic "try again."

---

### Problem 2: Tutorial Modal (New — Skippable)

New users have no orientation when they enter. Build a skippable tutorial modal that plays on first entry only.

**Trigger:** `onboardingStore.tutorialSeen === false`
**Shows:** On first room entry, after profile creation is complete
**Content (Echo reviews all copy):**
- What the room is
- How to find and tap a person's card
- How to send a note
- How to view your profile / edit chip selections
- One screen per concept. Max 4 screens. Skip button always visible.
**State:** When skipped or completed, `onboardingStore.tutorialSeen = true`. Never shows again.

---

### Problem 3: Welcome Back Triggering on In-App Back Gesture

**What happened:**
Sliding back (browser back gesture / swipe) from inside the room lands on the Welcome Back screen. Welcome Back should only appear when a user exits the browser/app and returns after the session gap. It should never be triggered by a navigation back gesture inside the app.

**Required fix:**
- Welcome Back screen is gated by a session gap check: user left the app (tab close, browser exit, session expiry) and has returned.
- In-app navigation (swipe back, browser back button while app is open) must NOT trigger Welcome Back. It navigates to the previous app route only.
- Implement navigation history properly in the router so back gestures respect the app's intended stack.
- `eventStore.sessionExitedAt` timestamp: set when the app unloads (beforeunload / visibilitychange). Welcome Back checks this timestamp on load. If no exit was recorded, no Welcome Back.

---

### Acceptance Criteria — SODA-046

- [ ] Every new user sign-in error state routes to a correct, labeled screen
- [ ] Card on entry/transition screen is not mistakable for room entry
- [ ] New user flow is linear: Sign In → Profile Creation → Room Entry (no escape routes)
- [ ] Tutorial modal shows on first room entry only, is skippable, max 4 screens
- [ ] Tutorial state persisted in Zustand onboardingStore
- [ ] Welcome Back only triggers on genuine app exit + return, not in-app back gesture
- [ ] sessionExitedAt logic implemented and tested
- [ ] All copy reviewed and cleared by Echo
- [ ] Ghost Mode 1 + 2 on all new and modified screens

---

---

## TICKET — SODA-047
### Chip Selection + Profile Creation Hardening

**Priority:** High
**Prototype Required:** Yes (UI changes to chip selection screen)
**Triggers Echo:** Yes — helper copy, character guidance, error states
**Depends on:** SODA-045

---

### Problem

At pilot: "fail to create profile" errors occurred during chip selection. Cause is unknown but likely one of:
1. Timeout — user took too long and session expired during profile creation
2. Character limit — too many characters in a chip input triggered a validation error
3. Chip count — too many chips selected triggered a validation failure

None of these were communicated clearly to the user. They just saw a failure.

---

### Required Changes

**1. Character guidance on chip inputs**
- Show a character counter on any freeform chip input field
- Add a helper line with best practices: "Keep it short — 2 or 3 words works best"
- Limit: [Kennis confirms max character count from schema]. Enforce on client before submission.
- Echo reviews all helper copy.

**2. Chip count guidance**
- If there's a max chip count per category, show the limit clearly: "Pick up to 3"
- When the user hits the limit, disable additional selection and show a helper — do not silently fail.

**3. Session timeout during profile creation**
- If the user's session expires while they are in profile creation, do not lose their work.
- Persist in-progress chip selections to `profileStore` (Zustand). On session refresh, restore from store.
- If restoration is not possible, return user to the step they were on with a clear message: "You were away for a bit. Pick up where you left off."

**4. Validation error handling**
- Any profile creation failure must show a specific, actionable error state.
- Echo defines the error copy for each failure type. No generic errors.

**5. ChipCategory enum — no new values**
- Reminder: ChipCategory is locked at five values: professional, interest, location, goal, identity.
- Any chip UI addition must use only these five categories.
- Ghost checks this. Kennis must not introduce new values.

**Acceptance Criteria — SODA-047**
- [ ] Character counter visible on freeform chip inputs
- [ ] Best practice helper copy shown (Echo reviewed)
- [ ] Client-side character limit enforced before submission
- [ ] Chip count limit shown and enforced visibly (no silent failure)
- [ ] In-progress chip state persisted through session refresh
- [ ] All validation errors show specific, actionable copy (Echo reviewed)
- [ ] ChipCategory enum unchanged (Ghost verifies)

---

---

## TICKET — SODA-048
### Notes Modal — Sticky + Scroll Fix

**Priority:** High
**Prototype Required:** Yes
**Triggers Echo:** Yes — any copy on the notes modal
**Depends on:** SODA-045 (notesStore in Zustand)

---

### Problem

In the room, tapping a user to send a note:
- The screen blurs and the modal appears blank
- The modal is static to the top of the page — but the user tapped from the bottom
- The user must scroll all the way back up to interact with the modal
- Notes received are stuck at the bottom of the page, requiring scrolling up
- Notes send UI and receive UI are not anchored to the user's current viewport position

---

### Required Fix

**The note modal must float in the user's current viewport — not be anchored to the document top.**

This is a position: fixed implementation, not position: absolute.

**Spec:**
1. When the user taps a person's card anywhere on the screen, the note modal opens centered in the current viewport.
2. The background dims (not full blank white — a proper overlay blur, 40-60% opacity dark, behind the modal).
3. The modal is always in front of the user. It does not require scrolling to find.
4. Notes received notification / incoming note view also opens in the viewport center — not anchored to page bottom.
5. `notesStore` tracks: `modalOpen`, `modalType` (send/receive), `recipientId`, `noteContent`, `scrollPosition` (the user's scroll position when they opened the modal, so when closed they return to exactly where they were).
6. When the modal closes, the user returns to their scroll position. Not to the top of the page.

**Visual spec (Aniya owns):**
- Modal: centered, max-width 360px, rounded corners, Equalpoint design system
- Background: dark overlay, not white/blank
- Close: tap outside or X button
- Modal animation: EASE_IN_OUT_SMOOTH, 340ms (modal enters from center, not top)

**Echo reviews:** all note modal copy (placeholder text, send button label, empty received state, error states)

**Acceptance Criteria — SODA-048**
- [ ] Note modal opens in user's current viewport regardless of scroll position
- [ ] Background is a proper overlay (dark, semi-transparent) — not blank white
- [ ] Modal is position: fixed relative to viewport
- [ ] Closing modal returns user to their pre-modal scroll position
- [ ] Received note view also opens in viewport center
- [ ] notesStore tracks all modal state
- [ ] Modal animation uses EASE_IN_OUT_SMOOTH
- [ ] Echo clears all modal copy
- [ ] Ghost tests note send and receive from both top and bottom of attendee list

---

---

## TICKET — SODA-049
### Card / Home Screen Redesign

**Priority:** High
**Prototype Required:** Yes — full redesign, Aniya leads
**Triggers Echo:** Yes — helpers, analytics labels, section headers, empty states
**Depends on:** SODA-045, SODA-047 (profile data must be reliable)

---

### Problem

The current Card screen is a standalone profile card with no context, no helpers, and no sense of what the screen is for. At pilot, attendees didn't know what they were looking at or how to use it.

---

### New Vision: Card Screen as Home Screen

The Card screen becomes the attendee's home base. It is the screen they return to between interactions. It is their profile, their match activity, and their event context — all in one place.

**Layout redesign (Aniya prototypes):**

**Top zone — Event Context**
- "In an Event?" prompt lives here as a top-of-screen element (dropdown card or persistent tab).
- Shows current event context or allows entry/re-entry.
- Not buried. Not hidden. First thing they see.

**Middle zone — Profile Card (Editable)**
- Their profile card displayed as it appears to other attendees.
- Tap any section to edit inline (chip selections, display name, pronouns).
- This is NOT the same flow as the initial profile creation. It is a streamlined edit-in-place flow.
- Profile changes here can be room-specific: "Edit just for this room" vs "Update everywhere."
- Echo reviews all edit prompts and helper copy.

**Bottom zone — Activity Feed**
- People they matched with
- Notes sent and received (with status: delivered, opened)
- Connections made
- Light analytics: "3 people viewed your card" — keep it warm, not metric-heavy
- Each entry is tappable and expands into a Profile View Modal (built in SODA-050)

**Helpers (new)**
- First-time visitors: light contextual tips. "This is your card. Tap to edit your chips."
- Empty states: specific and actionable. Not "Nothing here yet."
- Echo reviews all helper and empty state copy.

**Profile Edit Flow (new, separate from creation)**
- Editing profile here does not re-run the onboarding creation flow.
- It is a direct edit of each field: tap chip category → add or remove chips → save.
- Per-room option: if editing in a room context, prompt "Update just for this room?" Yes/No.
- State managed in `profileStore` (Zustand).

**Acceptance Criteria — SODA-049**
- [ ] Card screen is redesigned as a home screen (3-zone layout)
- [ ] "In an Event?" card is at the top of the screen, always visible
- [ ] Profile card is editable inline — not routed through onboarding creation flow
- [ ] Per-room profile edit option present
- [ ] Activity feed shows matches, notes, connections with light analytics
- [ ] Empty states are specific and actionable (Echo reviewed)
- [ ] All helper copy Echo reviewed
- [ ] profileStore in Zustand manages all edit state
- [ ] Aniya prototypes and Future approves before Kennis derives contract

---

---

## TICKET — SODA-050
### Micro Card Fix + Profile View Modal + Expanded Profile Modal

**Priority:** High
**Prototype Required:** Yes
**Triggers Echo:** Yes — all modal copy, profile labels, connection state labels
**Depends on:** SODA-045, SODA-049

---

### Three Deliverables

**1. Micro Card View Fix**
The compact card shown in the attendee list inside the room. Fix layout issues (to be detailed by Aniya after seeing current state). The micro card must be legible, tappable, and clearly communicate who the person is at a glance. Primary info: display name, top 1-2 chips, warmth state indicator (human language only — "in rhythm" or "it's been a while"). Secondary: tap target for profile view or note.

**2. Tapped Profile View Modal**
When an attendee taps a micro card in the room, they get a Profile View Modal — a full but contained view of that person's profile.

Content:
- Full display name, pronouns
- All chip selections organized by category
- Current warmth state (human language)
- CTA: Send a Note | Connect

Behavior:
- Opens as a modal (position: fixed, centered in viewport)
- Dismisses on tap outside or X
- Does not navigate away from the room — stays on the room screen
- Modal animation: EASE_IN_OUT_SMOOTH
- `roomStore` tracks `viewingProfileId` — clears on modal close

**3. Expanded Profile Modal**
A deeper view of a user's profile (accessible from the activity feed on the Card/Home screen). More detail than the in-room modal. Shows:
- Full profile as it appeared in the room you connected in
- Note history between you and this person
- Connection date and event context
- CTA: Send another note | View your matched chips

Echo reviews all copy on both modals. Aniya prototypes both before Kennis builds.

**Acceptance Criteria — SODA-050**
- [ ] Micro card layout fixed — legible, tappable, correct chip display
- [ ] Profile View Modal opens in viewport, does not navigate away from room
- [ ] Profile View Modal shows full chips, warmth state (human language), CTAs
- [ ] Expanded Profile Modal shows full history and event context
- [ ] Both modals use EASE_IN_OUT_SMOOTH animation
- [ ] roomStore tracks viewingProfileId, clears on close
- [ ] No warmth score numbers visible to user anywhere (Echo verifies)
- [ ] Echo clears all modal copy
- [ ] Ghost tests both modals from multiple scroll positions and room states

---

---

## Ghost Full Flow Test — Required Before Sprint 01 Ships

After all five tickets above pass individual Ghost review, Ghost runs a consolidated full flow test. This is not tied to a single ticket. It is a sprint gate.

**Flows to walk end-to-end:**

```
FLOW 1: Welcome and Onboarding
  New user → Sign in → Profile creation (chips) → Tutorial modal → Room entry
  Edge cases: Sign-in error mid-flow, timeout during chip selection, tutorial skip

FLOW 2: Accidentally Backing Out
  User in room → swipe back → confirm stays in room (not Welcome Back)
  User closes browser tab → reopens → Welcome Back appears correctly
  User reopens after event closed → correct closed state

FLOW 3: Returning Guest (active event)
  Returning user → loads app → Welcome Back → re-enters room
  Edge cases: Event closed within 30 min → That's a Wrap
  Event closed 30+ min → Closed screen, no That's a Wrap

FLOW 4: Attendee Room Screen
  Full attendee list visible → scroll top to bottom → tap micro card → Profile View Modal
  Send note from bottom of list → modal opens in viewport (not top)
  Receive note → modal opens in viewport (not bottom)
  Close modal → scroll position restored

FLOW 5: Profile / Card Home Screen
  View profile card → edit a chip inline → per-room save vs global save
  Activity feed: view match → Expanded Profile Modal → send note

FLOW 6: Notes — Full Send and Receive
  Send note to user → confirmation → note visible in sent activity
  Receive note → notification → view in viewport → reply

FLOW 7: Chip Selection Edge Cases
  Hit character limit → client-side block + helper shown
  Hit chip count limit → visual feedback
  Session timeout during chip selection → state restored on return
```

**Ghost verdict required:** PASS or FAIL with findings list.
**No sprint ship until Ghost full flow PASS.**
**Load verifies room behavior under 80+ concurrent users (BTW scale) before sprint ships.**

---

---

## Orchestrator: Sequencing

Execute tickets in this order. Do not start a ticket until its dependency is shipped and Ghost-cleared.

```
1. Lock Decisions A + B → DECISIONS.md entries → Future approves
2. SODA-045: Clerk + Zustand — foundation layer
3. SODA-046: Entry + Onboarding fix (parallel start possible after 045 ships)
   SODA-047: Chip hardening (parallel with 046)
4. SODA-048: Notes modal fix (after 045)
5. SODA-049: Card/Home redesign (after 045, 047)
6. SODA-050: Modals (after 049)
7. Ghost full flow test (after all six tickets pass individual Ghost review)
8. Sprint ships
```

---

## Out of Scope for Sprint 01

The following are noted and logged. They do not begin until Sprint 01 is shipped and Ghost-cleared.

- Ops / Admin / Host page fixes and gate separation
- Multi-event conference room switching
- Calendar / event scheduling automation (from SODA-043 brief)
- SODA-043 and SODA-044 (Return-to-Event and Ops Auth) — hold until Clerk migration in SODA-045 is complete, then resume these on the Clerk foundation
- **Sentry error logging** — add after Sprint 01 fixes are stable. Do not implement during this sprint. Log as INFRA-001 when ready to plan.

---

## Scribe Note

Every ticket in this sprint gets its own folder under `docs/tickets/`. Scribe files artifacts after each ticket closes. SESSION.md must be current after every phase transition. Sprint does not ship without Scribe CLEAR TO CLOSE on all six tickets.
