# SODA Sprint Plan — Bug Fixes & UI Polish
**Date:** June 24, 2026  
**Scope:** 11 tickets from sprint board row 4  
**System:** Equalpoint / SODA room experience

---

## How to Read This Plan

Each ticket is written as a Claude Code prompt — paste it directly. They are ordered by dependency: fixes before polish, layout before interaction, core flow before auth UI.

---

## Ticket 1: Fix Pills Layout in Room

**Area:** Room UI — chip/pill rendering  
**Priority:** P0 (visual regression, affects every attendee)

**Prompt for Claude Code:**
```
In the SODA room view, the pills/chips that display when populating a room are visually off — misaligned, wrong sizing, or overflowing. 

1. Find the component responsible for rendering the pill list inside the room (likely in `components/room/` or `components/soda/`).
2. Audit the flex/grid layout. Look for missing `flex-wrap`, incorrect `gap` values, or hardcoded widths clashing with dynamic content.
3. The pills should be square (equal width and height, or consistent padding on all four sides), touch-target friendly, and evenly spaced.
4. Do not change chip data — only fix the layout CSS/Tailwind classes.
5. Reference design tokens in `references/design-tokens.md` for spacing and border values.

Show me the before/after diff.
```

---

## Ticket 2: Make Pills Square + Tap for Offers/Needs

**Area:** Room UI — chip interaction  
**Priority:** P1 (core SODA chip mechanic)  
**Depends on:** Ticket 1

**Prompt for Claude Code:**
```
The SODA room pills (which display Needs/Offers/Focus chips) need two changes:

1. SHAPE: Make each pill a square micro card — equal padding on all sides (16px suggested), border-radius 8px, no oval/capsule shape. This is a static design (no animation needed yet).

2. INTERACTION: Each pill should be tappable. On tap, open a bottom sheet or modal that displays the full Offers or Needs associated with that chip. 
   - If we already have an OfferModal or NeedsModal component, wire the tap to it.
   - If not, scaffold a simple sheet component: title (the chip label), list of items under it, close button.
   - Use the existing design tokens (`--dark-green`, `--light-green`) for the modal header.

3. Add `data-testid="chip-pill"` to each pill and `data-testid="chip-modal"` to the modal.

Reference `references/components.md` to see if a modal scaffold already exists before creating a new one.
```

---

## Ticket 3: Drop Timer — Attendees vs. Admin View

**Area:** Room — Drop/timer display logic  
**Priority:** P1 (breaks attendee experience during drops)

**Prompt for Claude Code:**
```
The Drop countdown timer currently only appears on the admin/ops view. Attendees see no timer at all.

1. Find where the Drop timer is rendered (likely a `DropTimer` or `CountdownBar` component).
2. Audit the conditional that gates the timer — it is likely checking `role === 'admin'` or `isOps`.
3. The fix: attendees should see a read-only version of the timer (no controls, just the countdown). Admins/ops keep the full timer with controls.
4. If the timer data comes from a real-time subscription (Supabase realtime or similar), confirm the attendee subscription includes the drop start/end timestamps.
5. Create two render paths in the same component:
   - `<DropTimerAdmin />` — full controls
   - `<DropTimerAttendee />` — display only, same countdown

No new API routes needed — this is a display bug.
```

---

## Ticket 4: SODA Loading Break + Splash Page Copy

**Area:** Room entry — loading/splash screen  
**Priority:** P0 (breaks room entry flow)

**Prompt for Claude Code:**
```
Two issues on room entry:

ISSUE A — Loading breaks: When navigating into the SODA room, the loading state sometimes crashes or gets stuck. 
1. Find the room entry component (likely `RoomScreen`, `SODARoom`, or similar).
2. Add proper error boundary wrapping around the room load sequence.
3. Add a loading skeleton (not a spinner — use SkeletonLoader per project standards) for the transition period.
4. Check if the issue is a race condition between auth state resolving and room data fetching. If so, gate the room render on both being ready.

ISSUE B — Splash page copy: The splash/loading page shown while the room loads needs to display:
"You're in the room."
Add this as a confirmed state message that appears after successful room entry is confirmed, before the full room UI renders.

Keep copy declarative — no exclamation marks, no "Welcome!".
```

---

## Ticket 5: Prevent Swipe to Reconnect Screen

**Area:** Navigation — swipe gesture guard  
**Priority:** P1 (confusing UX, users hitting wrong screen)

**Prompt for Claude Code:**
```
Users can currently swipe sideways and land on the Reconnect screen while still in an active room session. This screen should ONLY appear when the user has closed and re-opened the browser (i.e., a session restore scenario).

1. Find the screen stack/navigator config (likely in the Expo navigator or Next.js route config).
2. The Reconnect screen should only render when: session was closed AND user is returning to an existing room. Not navigable via swipe during an active session.
3. Add a session guard: check if `room_session_active === true` in local state or Zustand. If active, disable swipe navigation to Reconnect.
4. In the navigator, remove the Reconnect route from the swipeable stack during active sessions, or set `swipeEnabled: false` on that route when session is live.
5. This is a nav config fix — do not change any data logic.
```

---

## Ticket 6: Edit Profile — Nav Bar + Card Tap (Phase 1)

**Area:** Profile — edit flow  
**Priority:** P1 (missing core user feature)

**Prompt for Claude Code:**
```
We need an Edit Profile entry point. Build Phase 1 only (Phase 2 — full card tap reveal — is future scope).

PHASE 1 (build now):
1. Add an "Edit Profile" option to the nav bar. This should be an icon button (pencil icon) or a labeled menu item depending on the nav bar's current layout.
2. Tapping it opens an Edit Profile screen/modal with editable fields: name, title, bio, and any other fields currently in the profile schema (check `references/schema.md`).
3. On save, call the existing profile update API route (check `references/api-routes.md`). If no update route exists, create `PATCH /api/profile` with Zod validation.
4. Show a success toast on save. No redirect.
5. Add `data-testid="edit-profile-trigger"` to the nav bar button.

PHASE 2 (do not build yet — just leave a TODO comment):
// TODO: Full profile card tap-to-reveal for self-profile view. Spec TBD.
```

---

## Ticket 7: Square Micro Card — Static Design

**Area:** UI component — profile/attendee micro card  
**Priority:** P2 (polish, no interaction changes)

**Prompt for Claude Code:**
```
The micro card component (used for displaying attendees, contacts, or self-profile previews) needs to be square and tight.

1. Find the micro card component (likely `MicroCard`, `AttendeeCard`, or `ConnectionChip`).
2. Make it square: set a fixed size (72x72 or 80x80px suggested — confirm with existing spacing scale in `references/design-tokens.md`).
3. Contents: avatar/initials centered, name below in small text (10–11px), truncated with ellipsis if long.
4. This is static — no tap behavior, no animation. Just locked geometry.
5. Border: 1px solid `--border` (#E2E8E4). Border-radius: 8px.
6. Do not change any data props — only the visual shell.
```

---

## Ticket 8: Animate Google Button + Sign In Button

**Area:** Auth — sign-in screen  
**Priority:** P2 (polish, trust signal)

**Prompt for Claude Code:**
```
The Google sign-in button and the email/password sign-in button on the auth screen need animation.

1. Find the sign-in screen component.
2. GOOGLE BUTTON: Add a subtle entrance animation (fade + slide up, 300ms, ease-out) on mount. On hover/press: scale to 0.97 with a 150ms transition. Keep the Google logo and text intact — do not restyle the button content.
3. SIGN IN BUTTON: Same entrance animation, staggered 100ms after the Google button. On press: brief scale pulse (0.95 → 1.0, 100ms).
4. Use CSS transitions or Framer Motion if already in the project. If neither, use Tailwind's `transition` and `active:scale-95` classes as the lightweight option.
5. Respect `prefers-reduced-motion` — wrap all animations in a motion-safe guard.
6. Do not change button logic, Clerk auth flow, or any data.
```

---

## Ticket 9: Design the Sign In Button

**Area:** Auth — sign-in screen visual  
**Priority:** P1 (currently unstyled or placeholder)  
**Depends on:** Ticket 8

**Prompt for Claude Code:**
```
The sign-in button on the auth screen needs a proper visual design (it is currently a placeholder or default browser/Tailwind style).

Design spec:
- Background: `--dark-green` (#203229)
- Text: `--light-green` (#B1FA63), 600 weight, 15px, Public Sans
- Height: 48px, full width of the form container
- Border-radius: 10px
- Icon: optional arrow-right icon on the right side (use Heroicons or Lucide, whichever is already imported)
- Hover state: background lightens slightly (use opacity-90 or a tinted variant)
- Disabled state: 40% opacity, cursor-not-allowed
- Loading state: replace text with a small spinner inline, keep button dimensions locked so it does not jump

Apply animation from Ticket 8 to this newly styled button.
Wire to existing Clerk sign-in logic — do not change auth behavior.
```

---

## Ticket 10: Delete Profile — Smaller + Discrete

**Area:** Profile settings — destructive action UI  
**Priority:** P2 (safety + polish)

**Prompt for Claude Code:**
```
The "Delete Profile" button/option in profile settings is too prominent. Make it smaller and more discrete without hiding it (it must remain accessible and meet accessibility standards).

1. Find the Delete Profile element in the profile settings screen.
2. Change it from a full-width or prominent button to a small text link style:
   - Text: "Delete account" (lowercase, sentence case)
   - Color: `#9CA3AF` (gray, not red — red draws attention; gray recedes)
   - Font size: 12px
   - Position: bottom of the settings screen, separated by a divider or significant margin from other actions
3. On tap: still trigger the confirmation modal/flow before any deletion occurs. Do not remove the confirmation step.
4. Add `data-testid="delete-account-trigger"` for testing.
5. This is a visual-only change — do not touch the deletion logic.
```

---

## Execution Order

Run these tickets in this sequence. Each one is independently pasteable but they build on each other:

```
1 → 2   (layout before interaction)
3       (independent timer fix)
4       (independent loading fix)
5       (independent nav guard)
6       (independent profile feature)
7       (independent component polish)
9 → 8   (design button, then animate it)
10      (independent settings polish)
```

---

## Rules to Include in Every Claude Code Session

Paste this block at the top of each session to lock in project constraints:

```
You are working inside the Equalpoint codebase. Non-negotiable rules:
- TypeScript strict mode. No `any`.
- Server Components by default. `use client` only when state or events require it.
- No direct Supabase calls from client components — go through API routes.
- Use SkeletonLoader for async states, not spinners.
- Add data-testid to all interactive elements.
- Never auto-send messages. Equal Point only drafts.
- Never touch lib/warmth/formula.ts unless the task explicitly requires it.
- Read references/components.md before creating a new component.
- Read references/design-tokens.md before hardcoding any color or spacing value.
```

---

*SODA Sprint Plan · Equal Point · June 24, 2026*
