# Handoff: SODA Onboarding Flow

## Overview
The first-time attendee flow for SODA, a live-event networking app. Takes a new attendee from "verify email" through "build your card" (identity, offers, needs) to a first-session Room view, with a light first-timer walkthrough and a soft graduation path into the full app. Goal: get someone from cold open to a useful, personalized card in under two minutes, with no dead ends — every step has a skip path, and nothing is a hard gate except a name, an email, and a "how do you show up" role.

## About the Design Files
The bundled file (`SODA Onboarding.dc.html`) is a **design reference built in a proprietary HTML templating format** — it is not React, Vue, or plain HTML/JS and cannot be copied into a real codebase as-is. Treat it purely as a working prototype of layout, states, copy, and interaction timing. **Your task is to recreate this flow in the target codebase's actual stack** (React Native, SwiftUI, Vue, etc.) using that codebase's existing components, navigation, and design tokens — or, if no stack exists yet, choose the most appropriate one and implement fresh. Do not attempt to parse or port the template syntax itself.

## Fidelity
**High-fidelity.** Colors, type, spacing, copy, and interaction timing below are final — reproduce them pixel-for-pixel using your codebase's equivalent primitives (native text input, native button, etc.), swapping only what your platform requires (e.g. native date/OTP pickers instead of a styled `<input>`).

## Flow Map
```
Email + Name  →  Code (OTP)  →  Card (role + affiliation)  →  Offer  →  Need  →  Splash  →  Room (first session)
   ↑ back          ↑ back           ↑ back                    ↑ back                          ↓ (graduation)
                                                                                          Full App (SODA Attendee)
```
Every arrow is reversible via a "← Back" link except Splash→Room (auto-advances) and the final graduation (explicit tap only). Offer and Need steps can both be skipped without blocking progress.

## Global Layout
- Single column, mobile-first, capped at **460px** max-width, centered on a near-black (`#050605`) page background — this is the "phone frame" for the prototype; on a real device this cap doesn't apply, use the full viewport width.
- Fixed top bar (56px): left = small green dot + "SODA" wordmark + ✦ glyph; right = "↻ Restart" (dev-only affordance, drop in production — it resets all local state).
- Content area scrolls vertically under the top bar; hides its scrollbar.
- Bottom-sheet layer and toast layer float above content, both anchored to the frame, not the viewport.

## Design Tokens Used
Reference tokens are defined in the SODA design system's `tokens/*.css` (colors, typography, spacing, effects). Map these to your own system on handoff — do not invent new hex values.
- **Colors**: `--accent` (signature green, ~`#3bd75c`), `--on-accent` (dark text on green), `--bg-canvas` (page bg), `--surface-1`/`--surface-2` (card surfaces, dark), `--surface-purple` + `--private`/`--private-border` (used only for the "match"/"tip" purple accent), `--surface-green` (graduation card wash), `--border`/`--border-strong`, `--text-primary`/`--text-secondary`/`--text-muted`/`--text-faint`, `--accent-soft` (translucent green chip fill).
- **Radii**: `--r-md` (buttons/inputs, ~10px), `--r-lg`/`--r-xl` (cards, ~16–20px), `--r-pill` (chips/pills), `--r-2xl` (bottom sheet top corners).
- **Type**: Display font = **Be Vietnam Pro**, weight 900 for headlines (uppercase, tight tracking `-0.02em`), weight 600–700 for buttons/labels. Body = Be Vietnam Pro 300–400. Mono labels/eyebrows = **DM Mono**, 9–10px, uppercase, `1–2px` letter-spacing, usually in `--accent` green or `--text-muted` gray.
- **Motion**: 130–300ms `var(--ease)` (a standard ease-out cubic-bezier). Rise-in for sheets/banners (`translateY(10-12px)+opacity`), a soft pulse on the "live" status dot, a pop-in for "You're in." on the splash screen.

## Screens / Views

### 1. Email + Name ("You made it!")
**Purpose:** Capture name + email to send a verification code. This is the only place name and email are captured.
**Layout:** Centered text, full-bleed padding `44px 26px 40px`, flex column, min-height 100%.
**Components:**
- Eyebrow: "Latinos-N-Tech · Tonight" — mono-ish, 20px (note: prototype uses Be Vietnam Pro at 20px here, not the mono token — a minor inconsistency, use your judgement or keep as a one-off), uppercase, `1.8px` tracking, `--accent`, centered.
- Headline: "You made it!" line break "**Welcome in ✦**" — 28-38px (responsive clamp), weight 900 uppercase for line 1; line 2 weight 600, not uppercase, in `--accent`.
- Input: **Your name** — full width, 15px vertical padding, `--surface-1` bg, `--border-strong` border, `--r-md` radius, 16px text. Margin-top 70px (large gap under headline).
- Input: **you@studio.com** — same styling; border color flips to `--accent` when focused/valid (see `emailBorder` — currently static, wire up focus state in your version).
- Button: **"Send my code"** — full width, 52px min-height, `--r-md`, disabled state (`--surface-2` bg / `--text-faint` text / not-allowed cursor) until BOTH name and a validly-shaped email (`x@y.z`) are present; active state = `--accent` bg / `--on-accent` text, pointer cursor.
- Footer microcopy (italic, `--text-faint`, 12px): "A name tag knows you showed up. SODA knows who you became to the room." — pinned to bottom via `margin-top:auto`.
**Validation:** `entryOk = name.trim() && /.+@.+\..+/.test(email)`. No error messages shown inline — button simply stays disabled.

### 2. Code (OTP)
**Purpose:** Verify email via 6-digit code. **In this prototype ANY 6 digits succeed** — no real code is sent. In production, wire real OTP delivery/verification; the UI/timing should stay the same.
**Layout:** Padding `44px 26px 40px`, "← Back" top-left (returns to Email step, preserving entered values).
**Components:**
- Headline: "Check your email" (900 weight, ~26-32px clamp, uppercase).
- Subcopy: "We sent a six-digit code to **{{email}}**. Enter any six digits to continue." — bold the email inline.
- 6-cell code display: 6 equal-width boxes, 58px tall, `--r-md`, `--surface-1` bg. Border is `--accent` on the currently-active cell, `--border-strong` otherwise. Digits shown centered, 24px DM Mono.
- Invisible full-bleed `<input type=tel>` overlays the 6 boxes (opacity 0, numeric keypad, `autocomplete="one-time-code"`) — this is the real input surface; the boxes are purely visual. On mobile, replace with your platform's native OTP input.
- "Resend code" link (mono, 10px, uppercase, `--accent`) — shows a toast "New code sent to {{email}}" in the prototype.
**Behavior:** As soon as 6 digits are entered, auto-advance to Card step after ~420ms (skips in prod if `prefers-reduced-motion`).

### 3. Card — Identity ("Build your card · 1 of 3")
**Purpose:** Capture role ("how you show up"), an affiliation type, and an optional business/context field. This becomes the header of the attendee's live card.
**Layout:** Padding `38px 26px 40px`, "← Back" to Code.
**Components:**
- Eyebrow: "Build your card · 1 of 3" (mono-style but rendered in Be Vietnam Pro 10px in this file — keep consistent with your mono token in production), `--accent`.
- Headline: "Hey {{greetName}}, how do you show in this room?" — 800 weight, sentence case, ~26-32px clamp. `{{greetName}}` = capitalized first token of the name field (falls back to the part of the email before `@`).
- Label: "Who do you show up as?" (9.5px uppercase mono-style, `--text-muted`).
- **Role chip grid** — pill buttons, wrapping flex, centered, fixed 200px height container (scrolls if overflow). Options: Founder, Designer, Engineer, Investor, Operator, Marketer, Creative, Content Creator, Coach, Consultant, Artist, Musician, Community Builder. Selected chip: `--accent` bg, `--bg-canvas` text. Unselected: `--surface-1` bg, `--border-strong` border, `--text-secondary` text. Selection is single-select (radio-like, not multi).
- "+ Custom" chip (dashed border, transparent bg) opens an inline text input + "Add" button; new custom role becomes selected and joins the chip list for the session.
- Label: "Affiliation" (same style).
- **Affiliation chip grid** — single-select, same visual treatment as roles. Options: Company, Agency, Entrepreneur, Studio, Independent, Student, Organization.
- **Adaptive business field** — label and placeholder change based on the selected affiliation (all optional, suffixed "· optional" in faint gray):
  - Company → "Where you work" / placeholder "Gilchrist"
  - Agency → "Your agency" / "Gilchrist Creative"
  - Entrepreneur → "Your business" / "What you're building"
  - Studio → "Your studio" / "Northbound Studio"
  - Independent → "What you do" / "Freelance designer"
  - Student → "School / program" / "CSU — Design"
  - Organization → "Org you're with" / "City of Cleveland"
- Button: **"Continue"** — disabled until a role is selected (affiliation defaults to "Company" and is never itself required).
**Validation:** Only `role` is required to advance.

### 4. Offer ("Build your card · 2 of 3")
**Purpose:** Multi-select what the attendee can offer the room, then optionally sharpen each selection with 1–3 specific "focus" tags.
**Layout:** Padding `38px 26px 40px`, "← Back" to Card.
**Components:**
- Eyebrow "Build your card · 2 of 3", headline "What can you offer?" (900 weight, sentence case), subcopy: "What the room reaches out to you for. Tap any that fit, then personalize up to 3 each."
- **Offer chip grid** (multi-select) — 15 options: Introductions, Advice, Mentorship, Feedback, Hiring, Investment, Partnerships, Hosting, Collaboration, Production, Legal, Business Management, Coaching, Studio/Workspace, Content Creation. Each chip shows a `✓` mark when selected, `+` when not. Selected = `--accent` fill; unselected = `--surface-2`/`--border-strong`.
- "+ Custom" chip → inline text input + Add, same pattern as Role.
- **First-time coaching popover** (shows once, only after the FIRST offer chip is tapped, never again for the session): a purple card (`--surface-purple` bg, `--private-border` border, small caret triangle pointing up-left) anchored just below the chip grid. Content: "✦ One quick tip" eyebrow (in `--private`, a purple accent token) → bold title "Add a focus to your offers to sharpen the room" → body copy "A specific or two under a category helps the right people find you faster. You'll only see this once." → "Got it" button (purple ghost pill) to acknowledge, and a × in the top-right corner to dismiss without reading fully (still marks as seen). **Dismissing without acknowledging (×) sets a flag that triggers a gentle one-time toast reminder later**, after the attendee reaches the Room, IF they still have no focus tags at that point: "✦ Add a focus to your offers or needs anytime to sharpen the room."
- **Per-offer detail rows** — one card per selected offer (`--surface-2` bg, `--r-lg`), each showing:
  - The offer name (mono-style, `--accent`) + a live `n/3` counter.
  - Existing tags as removable pills (× to remove).
  - An inline text input (Enter or comma to commit a tag) — hidden once 3 tags are reached.
  - Up to 3 curated suggestion chips per offer category (dashed-border "+ {suggestion}" buttons) — e.g. Mentorship suggests "design", "early-stage", "career". Suggestions already added are filtered out; the row hides suggestions entirely once full.
- Button: **CTA label is dynamic** — "Continue" if ≥1 offer selected, "Skip for now" if none. Always enabled (never blocks progress). Advances to Need step.
**Cap rule:** Maximum 3 focus tags per offer (or per need, on the next screen) — enforced in both this step and the in-Room focus sheet (see below).

### 5. Need ("Build your card · 3 of 3")
**Purpose:** Same pattern as Offer, but for what the attendee is looking for. No coaching popover here (only shown once, on Offer).
**Layout:** Identical structure to Offer.
**Components:**
- Headline "What do you need?", subcopy "What you came to find tonight. Tap any that fit, then personalize up to 3 each."
- **Need chip grid** (multi-select) — 13 options: A job, Talent, Funding, Customers, Collaborators, Advice, Introductions, Audience Growth, Sponsorship, Grants, Content Creation, Studio/Workspace, Marketing. Same visual treatment and "+ Custom" affordance as Offer.
- Per-need detail rows, identical mechanics to Offer's detail rows (own suggestion map keyed by need label, e.g. "A job" suggests "product design", "engineering", "full-time").
- Button CTA: **"I'm in →"** if ≥1 need selected, **"Skip · I'm in →"** if none. Always enabled. Advances to Splash.

### 6. Splash ("You're in.")
**Purpose:** A brief, celebratory confirmation before dropping into the Room. Auto-advances — this is not a screen the user is meant to linger on or interact with beyond arriving.
**Layout:** Fully centered, `40px 26px` padding.
**Components:**
- Pulsing green status dot (16px, `--accent`, looping soft box-shadow pulse ~1.6s).
- Eyebrow: room name ("Latinos-N-Tech"), mono, `--accent`.
- Huge headline "You're in." — weight 900, `clamp(44px,14vw,64px)`, uppercase, tight, with a pop-in scale animation (`scale(.8)→1.06→1` over 500ms, `cubic-bezier(.22,1,.36,1)`).
- Subcopy: "Welcome, {{name}}. Your card's live and **{{roomCount}}** people are already in the room." (roomCount is a static "19" in the prototype — wire to a real live count in production).
- Button "Enter the room →" — also auto-fires after ~2000ms even without a tap (respect `prefers-reduced-motion`: skip the delay entirely if set).

### 7. Room — First Session
**Purpose:** The attendee's home base for their first session — their own card front-and-center, contextual nudges/banners, a lightweight anchored walkthrough for total first-timers, and the roster of who else is present. This is a **simplified subset** of the full Room screen in the main SODA Attendee app — see the note in "Design System" below on how this hands off.
**Layout:** Padding `22px 26px 130px` (extra bottom padding clears any tab bar in the full app).
**Components, top to bottom:**
1. **Live status line**: pulsing green dot + mono "You're in · Latinos-N-Tech".
2. **Headline**: "Welcome, {{name}}." (900 weight, uppercase).
3. **Subcopy**: "Your card's live. **{{roomCount}}** people are in the room."
4. **Own-card preview** (`--surface-1` card, `--r-xl`):
   - Avatar (46px circle, colored by name hash — in this prototype hardcoded to green `#3bd75c`) + name (700 weight, 15.5px) + subtitle line (role · business, or a placeholder "Your card · everyone in the room can see this" if role/business are empty).
   - "You offer" section: mono eyebrow label, then either a wrapped row of pill tags (green-tinted, showing "{{offer}} · {{tag1}}, {{tag2}}" when focus tags exist, else just the bare offer name) or "Nothing yet." in faint gray if no offers were selected.
   - "You need" section: identical pattern, gray-tinted pills instead of green.
   - Two side-by-side buttons: **"Add offers & needs" / "Edit offers & needs"** (label flips once any exist) — opens the Offer bottom sheet. **"Add focus" / "Edit offers & needs" — actually always reads "Add focus"** — opens the Focus bottom sheet (or, if there are no offers/needs at all yet, redirects to the Offer sheet first).
   - Conditional one-line nudge below the buttons (`--text-muted`, 12.5px): shown only when the attendee has offers/needs but zero focus tags on any of them — "Add a focus to your offers or needs and the room can act on it, not just see it."
5. **Match banner** (purple, dismissible with ×) — appears ~900ms after entering the room, **only if**: attendee has ≥1 offer, has zero focus tags anywhere, no sheet is open, and the banner hasn't been dismissed this session. Copy adapts: if a present attendee shares an offer category, "You and {{name}} both offer {{category}}. Add a focus or two so the room knows exactly where." Otherwise a generic prompt naming their own first offer. CTA: "Sharpen my matches" → opens the Focus sheet.
6. **"Tell the room what you offer" banner** (neutral gray, dismissible with ×) — shown instead of the match banner when the attendee has **zero** offers at all. Copy: "Right now the room only sees who you are. What you bring is what makes people reach out." CTA: "Add what I offer" → opens Offer sheet.
7. **Graduation card** (green wash, `--surface-green`, accent border) — appears once the attendee has ≥1 offer **and** ≥1 focus tag on any offer or need. Entire card is a tappable link (not just the button inside it) to the full app, deep-linked to land directly in the live Room (not the app's home screen) — in this prototype: `SODA Attendee.dc.html?enter=room`. Copy: "✓ Your card is ready" eyebrow → "Step into the full room" headline → "You told the room what you offer and where. Now see everyone, every match, and the live moments as the night unfolds." → pill-style CTA "Enter the full room →".
8. **"Here now" roster** — mono label, then a vertical list of present-attendee rows (avatar 42px, name, role, and a small pill showing their primary offer). Rows where the attendee shares an offer category get a small purple dot badge in the top-right corner signaling a potential match. **This is a static preview list of 4 people in the prototype** — in production this should be the live, real-time roster (same data source as the full Room screen).

**First-timer walkthrough (anchored coach cards):** On first Room entry only (flagged in session state, never repeats), a sequence of up to 4 purple anchored tip cards appear directly beneath the relevant UI element as the user acknowledges each one ("Got it" advances; × on any card skips the rest immediately):
   1. Anchored under the status/greeting area — "Flip your status anytime" / explains "Open to talk" toggle (note: this toggle isn't visible in the simplified first-session Room in this file — it exists in the full Attendee app; when this flow is fully wired to the full Room screen, anchor here for real).
   2. Anchored under the search bar — "Zero in fast" / explains searching by name, offer, or need.
   3. Anchored under Live Moments — "Drop into a moment" / explains hosted prompts.
   4. Anchored above the roster — "Tap anyone to connect" / explains viewing cards, messaging, adding people.
   *(These 4 tips reference elements from the full SODA Attendee Room screen — see the companion Attendee handoff for the canonical implementation. In this standalone onboarding file, only the simplified own-card + roster are present; treat the tour as documentation of intended behavior once the two flows are merged.)*

### Bottom Sheets (used across Card/Offer/Need/Room steps)
Both sheets share a common shell: dark scrim (64% black) + a sheet sliding up from the bottom, rounded top corners (`--r-2xl`), a small drag-handle bar, max-height 86% of the frame, tap-scrim-to-dismiss.

**Offer Sheet** (`activeSheet:'offer'`) — opened from the Room card's "Add/Edit offers & needs" button. Contains BOTH the full offer chip grid and the full need chip grid (with their own "+ Custom" affordances), stacked vertically with section headers "What can you offer?" / "What do you need?". Single "Done" button at the bottom closes the sheet and re-triggers the match-banner timer.

**Focus Sheet** (`activeSheet:'focus'`) — opened from "Add focus" (or "Sharpen my matches"/"Add what I offer" banner CTAs, which route through the Offer sheet first if there's nothing to sharpen yet). Shows a "What you offer" section (only if the attendee has offers) and a "What you need" section (only if they have needs), each rendering the same per-item detail-row component described in the Offer/Need steps above (tags, input, suggestions, 3-cap, live "Reads as: {{preview}}" text once ≥1 tag exists). Two buttons: "Skip for now" (ghost) and "Save to my card" (accent-filled, disabled/dim until at least one tag exists anywhere) — saving closes the sheet and fires a toast: "Card updated — your matches just got sharper".

### Toast
Bottom-anchored, pill-shaped, dark surface with green dot + message + optional "Undo" action (mono, uppercase, green). Auto-dismisses after 2.6s (no undo) or 4.2s (with undo action). Used for: resend-code confirmation, the delayed focus nudge, and the focus-save confirmation.

## Interactions & Behavior Summary
- **Every required gate is minimal**: name + valid email (Email step), any 6 digits (Code step), a role (Card step). Offers and Needs are never required.
- **Skip is always safe and always leads forward** — "Skip for now" / "Skip · I'm in →" advance exactly like a filled-in submission.
- **Focus tags are capped at 3 per offer/need**, enforced identically in the dedicated Offer/Need steps and the in-Room Focus sheet — same `detailRow` logic (add via Enter/comma or suggestion tap, remove via × on a tag or Backspace-on-empty-input).
- **The purple coaching popover is strictly once-per-session**: it appears after the first offer chip tap, and never resurfaces once acknowledged OR dismissed. If dismissed via × without ever adding a focus tag, a single gentle toast reminder fires once, ~700ms after first reaching the Room (not before).
- **Contextual banners (Match / No-offers) are mutually exclusive and both individually dismissible**; dismissal is remembered for the session and they never reappear once closed, regardless of state changes.
- **Graduation to the full app is gated on real signal**: at least one offer AND at least one focus tag (on either an offer or a need) — i.e., the attendee has told the room both *what* and *where*. Until then, the roster and own-card stay visible with no forced upsell.
- **Reduced motion**: all timers (auto-advance on OTP complete, splash auto-enter, match-banner delay, nudge-toast delay) collapse to effectively-instant (1ms) when `prefers-reduced-motion: reduce` is set, so nothing blocks a user relying on that preference.

## State Management
Represent as a single flow-scoped state object (or route params + a shared context/store):
- `step`: enum — `email | code | card | offer | need | splash | room`
- `email`, `code`, `name`, `business`, `role`, `affiliation` (defaults to `'company'`)
- `customRoles: string[]`, `offers: string[]`, `needs: string[]`, `customOffers: string[]`, `customNeeds: string[]`
- `focuses: { [ "offer:<label>" | "need:<label>" ]: string[] }` — the tag lists, keyed by kind+label
- `focusCoachSeen: bool`, `focusCoachSkipped: bool` — coaching popover state
- `activeSheet: null | 'offer' | 'focus'`
- `bannerDismissed: { noOffers: bool, match: bool }`, `matchReady: bool` (flips true after the ~900ms delay)
- `toast: string | null`, `toastUndo: fn | null`
- Session/local-only: `roomTourDone: bool` (has the first-timer walkthrough played)

No backend calls are modeled in the prototype (code verification always "succeeds", room roster is static). In production: wire real OTP send/verify, real room roster (likely a websocket/poll), and persist the built card (role, affiliation, business, offers, needs, focus tags) to the attendee's profile record.

## Assets
- **Font**: Be Vietnam Pro (self-hosted, weights 300/400/500/600/700/800/900) for both display and body text; DM Mono (Google Fonts) for eyebrows/labels/counters. Font files are bundled in this package's `fonts/` folder.
- **Icons/glyphs**: none — the ✦ and × are plain Unicode characters, not an icon font. Avatars are generated (initials/color), no image assets.
- No photography or illustration used anywhere in this flow.

## Files
- `SODA Onboarding.dc.html` — the full prototype (this is the design reference described above, not portable code).
- `fonts/` — Be Vietnam Pro woff2 files referenced by the prototype.
