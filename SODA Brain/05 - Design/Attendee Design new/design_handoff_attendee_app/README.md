# Handoff: SODA Attendee App (Room, Cards, People, Recap)

## Overview
The core "in-app" experience for SODA — a live-event networking product. Covers the attendee's Home dashboard, a live event Room (roster, search, host-fired "Live Moments", first-timer walkthrough), the attendee's own multi-card identity system, a People/Contacts+Convene manager, in-app messaging (1:1 and group), notifications, and a post-event Room Recap. This is the "graduated" experience a first-timer lands in after completing the companion Onboarding flow (see the separate Onboarding handoff package) — the two should read as one continuous product.

## About the Design Files
The bundled file (`SODA Attendee.dc.html`) is a **design reference built in a proprietary HTML templating format** — not React/Vue/plain HTML-JS, and not portable code. It also contains **three internal reference modes** (a component gallery, a condition-states catalog, and this doc itself is generated from reading it) that exist purely to document the design system to whoever builds it — **do not ship them as end-user screens.** Your job is to **recreate the App experience** (and the Recap screen, which IS a real end-user screen) in the target codebase's actual stack, using its existing components/navigation/tokens, or choosing an appropriate stack if none exists. Do not attempt to port the template syntax itself.

## Fidelity
**High-fidelity.** All colors, type, spacing, copy, and motion timing described are final. Reproduce pixel-for-pixel using your platform's native equivalents.

## What's in the prototype file (mode toggle, top of screen)
A pill switcher (dev-only, remove in production) with four modes:
1. **App** — the real product surface. This is what to build. Detailed below.
2. **Kit** — a component gallery (color tokens, type specimens, every atom/composite). Reference material for your component library, not a screen.
3. **States** — a catalog of "condition states" (loading, offline, error, decision-sheet, success-toast, action-failed) shown in a live device frame with a tab picker. Reference for how the app should render network/error states — implement these behaviors, don't build this catalog screen itself.
4. **Recap** — **this IS a real end-user screen** (a past-event summary), detailed in its own section below. It happens to be toggled from this same dev switcher in the prototype, but ships as part of the app (reached from Home → a past room, or an end-of-event notification).

## Global Layout (App mode)
- Single column, mobile-first, capped at **780px** max-width (wider than the Onboarding's 460px — this is the "main app" frame, comfortable up to small-tablet width), centered on near-black (`#050605`) page background.
- Fixed top bar: SODA logo mark (3 small dots forming a loose triangle, in `--accent`) + wordmark; right side has a live "In the room" pulse indicator (only when in a room), a notification bell (badge with unread count) opening a right-side slide-in panel, and a circular account avatar (initials) opening the Account/You area.
- Bottom tab bar (5 items, icons + mono uppercase labels): **Home, Rooms/Room, People, Card, Inbox** (exact icon glyphs are plain Unicode/emoji-style characters in the prototype — replace with your icon set, keep the labels and order). Minimum 44px tap targets.
- Sheet layer (bottom-sheet, 90% max height, rounded top corners) hosts most contextual modals. A separate centered "Moment" modal and a separate full-bleed "Live Acts" takeover exist for the two distinctive interaction patterns described below.

## Design Tokens
Same source tokens as the Onboarding package (SODA design system `tokens/*.css`) plus a few used only here:
- `--gold` (`#e8c468`, decorative accent, minimal use), `--surface-3` (toggle-track gray), `--warn` (amber, used for "The Chance" act), `--danger`/`--danger-soft` (red, block/report/delete), `--private`/`--private-border`/`--private-soft`/`--surface-purple` (the purple "this is just for you" system — matches, nudges, Equalpoint cross-sell, tour tips).
- Type scale adds `--fs-hero`, `--fs-display-l/m/s`, `--fs-stat` — responsive `clamp()` display sizes for hero copy, room titles, card names, and big stat numbers respectively.
- Fonts: **Archivo** (display, 500–900) for headlines/numbers, **Hanken Grotesk** (body/UI, 300–700), **Space Mono** (labels/eyebrows/counters). *(Note: these differ from the Onboarding file's Be Vietnam Pro/DM Mono choice — reconcile to one font system before shipping; Onboarding was updated later in this project and is likely the intended direction. Flag this to design before implementation.)*
- Motion: same restrained 130–420ms `var(--ease)` family, plus `soda-shimmer` (skeleton loading sweep), `soda-rot` (spinner), `soda-blink` (offline-indicator blink), `soda-pulse` (live-status dot). All motion collapses under `prefers-reduced-motion`.

## Screens / Views (App mode)

### Home
**Purpose:** Dashboard/landing screen — entry point to everything.
**Layout:** top-to-bottom stack, `18px 24px 120px` padding (bottom padding clears the tab bar).
1. **Hero card** (tappable, enters the Room) — pulsing live dot + eyebrow (event status/name) + big display headline + subcopy + pill CTA. Two treatments exist (`live` vs `idle`) — border/background/CTA all shift tone based on whether an event is actually live right now.
2. **"Your card" deck** — horizontal snap-scrolling rail of the attendee's own card(s) (see multi-card system under "Card" below), each a mini preview (role eyebrow, name, italic "show up as" line, offer/need chip preview, footer stat row with an edit-state pill). Dot pagination beneath. "Manage" link jumps to the full Card screen.
3. **"Your rooms" rail** — horizontal cards for each room the attendee belongs to (past + upcoming), colored tint header, live attendee count, meta line (e.g. "starts in 2h" / "furthest room").
4. **"Kept warm" list** — vertical rows of saved connections (avatar, name, role, a colored warmth dot + label: "In rhythm" / "Cooling" / "Been a while"). "All people" link jumps to the People screen.

### Room
**Purpose:** The live event surface — search the roster, browse people, and participate in host-fired "Live Moments."
**Layout:** `18px 24px 120px` padding.
1. Live status eyebrow + room title (display, uppercase) + subcopy (room description/count).
2. **Self status row** — a tappable "Your status" toggle (Open to talk / not, with an inline switch) next to a small square "Connect" button (opens the in-person QR-exchange sheet — see below).
3. **Search bar** — pill-shaped, placeholder "Search by name, offer, or need" — filters the roster live.
4. **"Live moments" launcher** — a 3-up grid of host-fired micro-experiences, each a small card with a colored mono eyebrow ("Act one/two/three") and a bold title: **The Drop** (green), **The Chance** (amber), **The Nudge** (purple). Tapping opens the full-bleed Live Acts takeover (below).
5. **"People here" header + a density toggle** (SegmentedToggle: Grid vs List).
   - **Grid density**: `auto-fill` grid, `minmax(150px,1fr)`, cards show avatar, name, role, an offer-count pill, a need-count pill, and (if available) a small pulsing "Open" indicator. A private-purple dot badge in the top-right corner marks a computed match. **Hover state**: border turns `--accent`, plus an outer green glow (`box-shadow: 0 0 0 1px var(--accent), 0 0 22px rgba(59,215,92,.45)`) — implement hover glow as a simple CSS transition on `border-color`/`box-shadow` (avoid combining with an entrance `transform` animation on the same shorthand, which can visually conflict — box-shadow and the entrance animation should be separate properties).
   - **List density**: clean single-column rows (avatar, name, subline), with a "Matches you" pill badge (purple) instead of the grid's dot.
   - Cards stagger in on entry (`soda-card-in`, small per-item delay).
6. **First-timer anchored walkthrough** (session-once, only on first Room entry): up to 4 small purple "tip" cards, each anchored directly beneath the real UI element it explains (status row → search bar → Live Moments → People header), advanced one at a time via "Got it", skippable anytime via ×. See the Onboarding handoff's identical pattern — same visual language (`--surface-purple` card, corner caret, mono "✦ One quick tip" eyebrow).

### People
**Purpose:** Manage saved connections — split into **Convene** (people actively wanted in a room together) and **Contacts** (everyone else kept warm).
**Layout:** eyebrow + headline "Kept warm" + subcopy, a SegmentedToggle (Convene/Contacts tabs), a search bar, and (Convene tab only, when ≥2 people selected) a green **"✦ Bring these {{n}} together"** CTA that opens the Convene sheet.
- Each row: avatar, name (with a small ✦ if on the Convene list), role, a warmth dot+label, and — in a "select mode" — a tappable ✦ toggle circle for multi-select.
- Empty state (Convene tab, nothing selected yet): "No one here yet" + guidance to add people from Contacts.
- Tapping any row opens the **Person Actions** sheet (below) — not a direct navigation; all person-level actions (view card, message, convene toggle, remove, block/report) route through it.

### You / Account
**Purpose:** Account settings hub.
**Layout:** headline "You" + hairline rule, a 3-up stat tile row (rooms/connections/cards — use your platform's real numbers), a vertical list of settings rows (each: small green-tinted icon square + label + `›` chevron) — **Edit profile, Manage cards, Notifications, Privacy and data** — then a purple **"Powered by Equalpoint"** cross-sell card (headline + one line of body copy) at the bottom. *(This screen was later revised in-conversation to also add Sign out / Delete profile with an "are you sure" confirm state, and to move notifications/inbox to dedicated top-level icons — confirm the latest intended IA with design before building; this file reflects an earlier version of that decision.)*

### Card (your own card, multi-card system)
**Purpose:** the attendee's identity artifact — what the room sees. Supports **multiple cards** (e.g. "Founder" vs "Designer" persona) switchable via a SegmentedToggle, plus a "+ New card" affordance (opens the Create Card sheet).
**Layout:** headline "Your card" + "This is how the room sees you." subcopy, then one large card surface:
- Avatar (56px) + name (display, 900 weight) + "{{role}} · {{business/context}}" subline.
- **Business / Website row** — two-column, each independently switches between **display mode** (plain text / a real tappable `<a>` link for website) and **edit mode** (inline `<input>`) based on a shared "editing" toggle for the whole card.
- **Face flipper** (SegmentedToggle: Me / Offers / Needs) — swaps the lower ~150px region between three "faces":
  - **Me**: a bold "show-up statement" (one sentence, what they bring) + an italic signature line. Edit mode swaps these for a `<textarea>` + `<input>`.
  - **Offers** / **Needs**: wrapped pill chips (label, optionally "· focus tag"); edit mode turns each into an editable pill + a "×" remove button, plus a dashed "+ Add offer/need" affordator at the end.
- Footer stat row (offer count / need count).
- Below the card: a full-width **Edit/Done toggle button** (label and styling flip based on edit state) and the face-flipper SegmentedToggle repeated for convenience.
**Key behavior**: Business/Website/Statement/Signature/each offer-need pill are all **independently inline-editable in place** — there is no separate "edit modal"; toggling "Edit" puts the whole card surface into edit mode simultaneously, and every field swaps its own display↔input rendering.

### Inbox
**Purpose:** Messaging home — 1:1 and group threads.
**Layout:** eyebrow "Messages" + headline "Inbox" + hint "Swipe a message left to delete it." Empty state: "No messages yet" + explainer that intros land here.
- Each row is **swipeable left to reveal a red "Delete" action** underneath (implement via a horizontal drag/transform on the row, revealing an absolutely-positioned red delete button behind it — `touch-action: pan-y` so vertical scroll isn't blocked). Deleting should show an **undo toast** (see Toast pattern below) rather than being irreversible-on-tap.
- Row content: avatar, name (colored if special), a "✦ Group" pill badge for group threads, an unread dot, message preview (truncated), and a right-aligned relative timestamp.
- Tapping a row opens either the **Message Thread** sheet (1:1) or the **Group Thread** sheet (below).

### Lobby (pre-event)
**Purpose:** Shown for a room the attendee is registered for but that hasn't opened yet.
**Layout:** a "‹ Rooms" back link, a dark gradient card with "Doors not open yet" eyebrow, room name, a **big live countdown** ("until doors open") + a "when" line, then a "Who's coming" list (avatar rows, a "Likely match" pill on standout matches) with a registered-count label, and a full-width **"I'll be there"** RSVP CTA + a footer note about being nudged when it opens.

## Sheets & Modals (bottom-sheet shell, shared chrome: scrim + drag handle + rounded top + slide-up)

- **Card Expand** — tapping anyone in the Room/People roster opens their full card here: avatar+name+role, business/website (if present), the same Me/Offers/Needs face-flipper as your own card (read-only — chips are tappable and open **Chip Detail**), a purple "Why you match" reason strip if applicable, and **two primary actions pinned below the content, above the face-flipper**: "Add connection" (or "Added" state) and "Start an intro" (accent-filled). *(Important layout rule established in-conversation: these two CTAs must sit below the card content and above the Offers/Me/Needs toggle — never above it — so a tap on the card content never accidentally triggers a connection action.)*
- **Chip Detail** — drills into one specific offer/need: eyebrow (offer/need), the label, an owner line, its focus tag (or an italic "nothing specified" fallback), then "Start an intro about this" (accent) and "Close" (ghost).
- **Intro Starter** — compose an introduction: target name + context line, an optional "based on {{chip}}" pill, a Tone SegmentedToggle (e.g. Warm/Direct/Brief), a draft `<textarea>` (editable, pre-filled), a toggle row "add to your people" (with an inline switch), a trust/privacy footnote, and Cancel/Send actions.
- **Person Actions** — the hub sheet for any person: avatar+name+role, then **View their card** / **Message** (side by side), a full-width **Convene toggle** ("✦ Add to Convene" / remove, styled state-dependent), **Save contact** / **Grab coffee** utility actions, an explainer footnote (Convene vs Contacts), and destructive actions at the bottom: **Remove from people** (neutral) and **Block or report** (danger-tinted) — the latter opens the **Safety** sheet.
- **Message Thread** — 1:1 conversation: header (avatar+name+role), an empty-state prompt if no messages yet, a scrollable bubble list (left/right aligned, tinted by sender), and a pill composer (input + circular send button) pinned at the bottom, plus a "Close" button.
- **Group Thread** — same bubble/composer pattern, but headed by an **overlapping avatar stack** + a "✦ Group · {{n}}" pill, a title, an explainer ("You convened this group..."), and a **member list** (compact rows) above the message history.
- **Confirm ("Are you sure")** — generic destructive-confirmation pattern: mono "Are you sure" eyebrow, title, body, Cancel + a dynamically-styled Confirm button (color/label supplied per-context — e.g. red for delete, neutral for a softer action).
- **Convene** — two states: **Choose** (title "Bring {{n}} together", names line, overlapping avatar stack with a "+N" overflow bubble, then two primary paths — **"Start a room together"** (private room, two-line button with a description) and **"Send a group intro"** (one thread, two-line button) — plus a "Not now" dismiss) and **Done** (a celebratory confirmation screen — avatar stack, eyebrow, big headline, body, single "Done" button).
- **Connect in Person** — QR-code exchange: explainer copy, a generated QR block (a 9×9 cell grid in the prototype — use a real QR library in production) plus your mini card preview beneath it, and a "Scan their code instead" button.
- **Create Card** — new persona builder: Role input, "How you show up" statement textarea, side-by-side "You offer" / "You need" quick-entry inputs (comma-style free text in this prototype — consider reusing the richer chip+focus-tag pattern from Onboarding for consistency), Cancel/Create actions.
- **Safety (Block/Report)** — danger-toned eyebrow, name, explainer of what blocking vs reporting does, then **Report {{name}} to SODA** (neutral), **Block {{name}}** (solid red), Cancel.
- **Notification Preferences** — a title, then a vertical list of labeled toggle rows (each: label + sub-description + an inline switch) for granular notification categories (matches, intros, rooms, warmth reminders, etc.).

## Moment Modal (centered, not a bottom sheet)
A distinct, smaller **centered** modal (max-width 440px, pop-in scale animation) used for celebratory/summary moments distinct from the Room's Live Acts (e.g. a milestone hit, a top-connector reveal, a generic room summary). Structure: colored mono eyebrow, an optional huge stat number + label, an optional overlapping-avatar "strip" (with overflow bubble), a display headline, body copy, and a primary + secondary (ghost, text-only) action pair. The prototype exposes 4 copy variants (`summary`, `match`, `milestone`, `top_connector`) as a single configurable prop — implement as one flexible component with content driven by event type.

## Live Acts (full-bleed takeover, not a sheet — covers the whole Room screen)
Host-fired real-time "moments" that take over the full screen (not just a bottom sheet) with a close × pinned top-right. Three distinct experiences, each launched from the Room's "Live moments" 3-up grid:
- **The Drop** ("Everyone, at once") — a live prompt/question; if not yet answered, an inline pill input + "Drop it" submit button; once submitted, a confirmation pill ("✓ Dropped — your answer is on the wall") replaces the input, and the attendee's answer joins a live-updating "wall" of everyone else's answers (avatar + name + their answer, each row animating in).
- **The Chance** ("A pairing, by chance") — a live countdown timer (large display digits, ticking down) pairing the attendee with one specific other attendee ("You + Maya") to go find each other in person before time runs out, with context on why they were paired, and a "We found each other" completion button.
- **The Nudge** ("A nudge, for you") — a private, algorithmic suggestion to go talk to one specific person right now (avatar+name+role card, a reasoning line, an "Only you can see this" privacy footnote in purple), with "Not now" / "Message {{name}}" actions (message routes straight into a Message Thread seeded with that person).

## Notifications Panel
A **right-edge slide-in panel** (not bottom-sheet) — `min(92%,420px)` wide, full height, slides in via `transform: translateX(...)` over a fading scrim. Header: "Activity" eyebrow + "Notifications" title + a circular × close button. Body: a vertical list of notification rows, each a **full-width tappable button** (not just informational) — colored dot (unread indicator), eyebrow (category, colored), timestamp, bold title, body copy, and a colored "→ {{action label}}" affordance at the bottom. **Every notification is actionable and routes to what it's about** (e.g. "Devin replied to your intro" → opens that thread directly) — this was an explicit requirement; do not ship read-only notifications.

## Toast
Bottom-anchored pill (positioned above the tab bar in-app, `bottom:90px`), dark surface, green accent border, a green dot + message text + an optional **"Undo"** action (mono, uppercase, green, extends the toast's visible duration). Used throughout for: message sent, contact removed, card updated, convene changes, and (per an explicit requirement) **destructive actions on People/Inbox rows should always toast with Undo** rather than being silently permanent.

## Recap (real end-user screen — post-event summary)
**Purpose:** "What last night got you" — reachable from Home's "Your rooms" (a past room) or a post-event notification.
**Two states:**
- **List** — "Past rooms" headline, then a vertical list of past-room rows (a small tinted room-name tile, name + date, and a right-aligned big connection-count stat). Tapping opens Detail.
- **Detail** — a gradient header band (back link, room name, date/time), then: a **3-up stat band** (big numbers — e.g. connections made, intros sent, moments joined), a **"Your night" timeline** (icon-square + one-line narrative entries — "You showed up as...", "12 strong matches", "9 connections", etc. — the user specifically wants these **highlighted in white, not the usual muted eyebrow-gray treatment**, with the room's emphasis on **who they showed up as** foregrounded), a **"Who you met" list** (avatar-initial circles, name, a colored "why you matched" reason line, a warmth dot+label), a **"What the room wanted" gap-bar chart** (label + a horizontal bar + a numeric label — visualizing supply vs demand for each need category), a **"Top connector" purple spotlight card** (the most-connected person that night), and a final full-width **"Keep these connections warm"** CTA (an Equalpoint cross-sell, consistent with the You screen) with a footer count line.
**Emojis are acceptable here** per explicit product direction for this screen's "night recap" icons (an exception to the general no-emoji rule elsewhere in the product — confirm scope of exception with design before applying emoji elsewhere).

## Interactions & Behavior Summary
- **Person-level actions never live directly on a roster/list row** — every row (Room roster, People list, Inbox) opens a dedicated sheet (Person Actions, Card Expand, Message Thread) rather than exposing inline buttons, keeping list rows purely navigational.
- **Convene vs Contacts is a strict, explained distinction**: Convene = people you want gathered in a room together (multi-select, has a "bring together" flow); Contacts = everyone else kept warm. Every person stays visible in the master People list regardless of tab; tabs are a filter, not a bucket.
- **Card editing is single-toggle, multi-field**: one Edit/Done button puts the ENTIRE card into edit mode; do not build per-field edit affordances.
- **Swipe-to-delete (Inbox) always pairs with an Undo toast** — never delete silently/irreversibly on swipe.
- **Notifications are always actionable** — tapping one must navigate to the specific thing it references (never a dead-end read receipt).
- **The first-timer Room walkthrough is session-once and anchored** — tips appear directly under the real element they describe, advance on "Got it", and can be skipped entirely via any tip's ×. Reuses the exact visual language of the Onboarding flow's own coaching popover (see that handoff) — keep them visually identical if both flows ship in the same release, since they're meant to read as one continuous product voice.
- **Live Moments are real-time, host-driven** — treat The Drop's "wall," The Chance's pairing/countdown, and The Nudge's suggestion as live data from a moments/events service, not static content.
- **Hover states (desktop/pointer devices only)**: roster cards get a border-color shift to `--accent` plus a soft green glow; do not combine box-shadow transitions with the card's entrance animation on the same property to avoid rendering artifacts — keep entrance (`transform`) and hover (`border-color`/`box-shadow`) on separate transitions.
- **No colored side-accent borders anywhere** — an explicit standing rule for this product's whole visual system. Cards use plain 1px hairline borders; any "this section means X" signal is carried by an eyebrow label's text color, never a left/top border stripe.

## State Management
Represent as a single app-scoped store (or a set of route-level stores) holding at minimum:
- `screen`: `home | room | people | you | card | inbox | lobby | recap` (nav/tab state)
- `activeCardId`, `cards: Card[]` (multi-card identity system), `editingCard: bool`, `cardFace: 'me'|'offers'|'needs'`
- `people: Person[]`, `conveneIds: string[]`, `removedIds: string[]`, `peopleTab: 'convene'|'contacts'`
- `roomQuery`, `peopleQuery` (search), `layout: 'grid'|'list'` (Room density)
- `availOpen: bool` (self "open to talk" status)
- Modal/sheet state: `modal: string|null` + whatever context object it needs (`cardPerson`, `chip`, `introTarget`, `confirmCfg`, etc.) — model as a single "active sheet" slot with a payload, not one boolean per sheet type
- `act: 'drop'|'chance'|'nudge'|null` (Live Acts takeover), plus per-act state (`dropDraft`, `dropSent`, `chanceLeft` countdown, live wall/pairing data from your backend)
- Messaging: `threadId`/`groupThreadId`, `composerDraft`, per-thread message arrays, `readMsgIds`, `deletedMsgIds` (soft-delete, to support Undo)
- `notifPrefs: { matches, intros, rooms, warmth }`, notification list (server-driven, each item carrying enough context to route on tap)
- `toast`, `toastUndo` (a function/action to run if Undo is tapped)
- Onboarding handoff: `roomEntered`, `roomTourDone`, `tourIdx`, `tourActive` (first-timer walkthrough) — this app should recognize a `?enter=room` style deep link (or your platform's equivalent) so the Onboarding flow can drop a graduating user directly into the live Room rather than Home.

No backend is modeled in the prototype — all people/messages/rooms are static fixtures. In production wire: real roster/presence (websocket or poll), real messaging (send/receive/read-receipts), real Live Moments (host-triggered events broadcast to the room), real match computation (server-side, driven by offer/need/focus overlap), and real Recap analytics per room.

## Assets
- **Fonts**: Archivo (display), Hanken Grotesk (body/UI), Space Mono (labels) — all via Google Fonts in this file. *(Reconcile with Onboarding's Be Vietnam Pro/DM Mono choice before shipping — see note above.)*
- **Icons**: nav bar and action icons are inline SVG (simple 2px-stroke outline style, hand-drawn per-icon in this file) or plain Unicode glyphs (✦, ×, ‹, ›, ●). No icon font. Avatars are generated (initials + a per-person color), no image assets. The QR code in "Connect in Person" is a placeholder grid — swap for a real QR-generation library.
- No photography/illustration anywhere in this product.

## Files
- `SODA Attendee.dc.html` — the full prototype, including the App mode (build this) and the Kit/States reference modes (documentation only, do not ship) and Recap (build this).
- `screenshots/` — reference captures: `home.png`, `room-with-tour.png` (showing the first-timer anchored tip), `people.png`, `card.png`, `inbox.png`, `notifications-panel.png`.
