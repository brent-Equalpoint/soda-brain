# SODA Attendee Flow — Universal Component Build Brief

*A self-contained brief for designing and building SODA's attendee experience as a universal component
library (one codebase that renders on web today and iOS/Android later). Everything needed is inline: the
design system, the component list, every screen's data contract, sample data, and the rules. No external
files required. Hand this to a design/build agent as-is.*

---

## 0. The job, in one screen

**Build a universal component kit and the attendee screens that assemble from it**, faithful to the
design system and screen contracts below.

- **Deliver:** (1) a set of presentational React + TypeScript components (the atoms and composites listed
  in section 4), and (2) the attendee screens (section 5) assembled from them.
- **Platform target:** React Native primitives (`View`, `Text`, `Pressable`, `Image`, `ScrollView`,
  `Modal`) styled with **NativeWind**, so the same component renders on **web** (via Expo web /
  react-native-web) and **native** (Expo). If you prototype web-first, that is fine as long as components
  stay **presentational and token-driven** so they port without a rewrite.
- **The discipline that makes it universal:** components are **presentational** — they receive typed
  props (the contracts in section 5) and render. **They never fetch data and hold no business logic.**
  Data and state live outside them (in screens/hooks). This is the single most important rule.
- **Styling: no raw values.** Every color, size, space, and radius resolves to a **semantic token**
  (section 3) or a **named optical rule** (section 7). A value that traces to nothing is drift, the one
  styling bug that matters here. The eye is the final authority, the grid is its default, and the moment
  the eye overrules the grid you name the correction so it stays part of the system.

---

## 1. What SODA is (so the work has a soul)

SODA is a "room operating system" for live networking events. A guest scans a QR at an event, builds a
tiny identity card (who they are, what they offer, what they need), and walks into a live room that shows
who else is there and who they should meet. It is mobile-first, dark, and quiet.

- **One-liner:** "A name tag knows you showed up. SODA knows who you became to the room."
- **Feel:** calm, confident, dark-native. Near-monochrome with a single living green. No clutter, no
  glassmorphism, no spinner theater. It should feel like a well-made native app, not a busy web page.

---

## 2. The attendee flow (what you are building, end to end)

The guest journey, in order. Each is a screen or modal you will build (contracts in section 5):

1. **Home** — the guest's hub: a live-event hero ("the room is open, tap to enter"), their card deck
   (swipe to pick which card they show up as), their rooms, and their kept-warm connections.
2. **Room** — the live event: a roster of everyone present (grid or list), tap a person to expand their
   card, see who matches you.
3. **Card (expanded)** — a person's full card: three faces (Offers / Me / Needs), with a match reason and
   actions (Add connection, Start an intro).
4. **Chip detail** — tap a single offer/need chip to see its focus and start a targeted intro.
5. **Intro starter** — a drafted intro message (three tones), an "add to connections" toggle, and a gated
   Send (nothing sends on its own).
6. **Moment modals** — celebratory beats: you left the room (summary of connections made), a mutual
   match, a connection milestone, top connector.
7. **Nav** — the five-tab spine: Home, Rooms, Card, People, You.
8. **People / You** — your kept-warm connections (with warmth language), and your stats.
9. **Condition states** — error, loading, decision (confirm), locked, restricted, success toast.

---

## 3. The design system (the visual law — all values inline)

> Dark only. One green does the talking. Color is meaning, not decoration.

### 3.1 Color
| Token | Hex | Use |
|---|---|---|
| canvas | `#111111` | app background |
| card | `#1a1a1a` | cards, sheets |
| surface | `#202220` | raised surface |
| border | `#2a2a2a` | hairline borders (1px) |
| ink | `#f5f5f5` | primary text |
| muted | `#8a8a8a` | secondary text |
| hint | `#5a5a5a` | faint text, "been a while" warmth |
| green | `#3bd75c` | **the only loud color** — interactive, confirm, present, alive |
| greenDeep | `#203229` | green's deep tint (filled green surfaces) |
| amber | `#f59e0b` | live timers, warmth cooling — only |
| purple | `#a47bff` | private / for-you-only: the Nudge, matches — always |
| red | `#ef4444` | errors — only |
| gold | `#e8c468` | achievement (top connector, milestones) — only |

**Color discipline (do not break):** green = interactive/confirm; amber = timers/cooling; purple =
nudge/match; gold = achievement; red = error. Everything else is the neutral near-black scaffold. A
person's avatar color is per-person (assigned) and is separate from these meaning-cues.

### 3.2 Type

> **FONTS ARE TBD. Do not pick or assume any family.** The previous families (Archivo Black, DM Sans,
> DM Mono, Caveat) have been retired and must NOT be used. Build the type system against the ROLES below
> and the scale; wire the actual families in ONE place (the token theme) once they are chosen, so the
> swap later touches nothing else. For review only, a neutral system sans is an acceptable stand-in.

Four roles, each with one job (the family is decided later and loaded via next/font on web, expo-font on
native, same family names).

| Role (token) | Job | Family |
|---|---|---|
| **display** | headlines, big numbers, titles. UPPERCASE. Never paragraphs. | TBD |
| **ui** | all readable body copy. | TBD |
| **mono** | eyebrows, labels, counts. UPPERCASE, letter-spaced. | TBD |
| **signature** | the optional decorative signature line (exempt from the grid; may be dropped). | TBD |

**Scale** (base 16, minor-third 1.2; sizes in rem; line-height unitless and resolves to a multiple of 4;
tracking in em). On native: `fontSize = rem*16`, `lineHeight = round(size*leading)`,
`letterSpacing = size*tracking`.

| Name | px | rem | leading | tracking (em) | font | case |
|---|---|---|---|---|---|---|
| eyebrow | 11 | 0.6875 | 1.4545 | 0.1 | mono | UPPER |
| caption | 13 | 0.8125 | 1.2308 | 0 | ui | — |
| body | 16 | 1.0 | 1.5 | 0 | ui | — |
| titleSm | 20 | 1.25 | 1.2 | -0.01 | display | — |
| title | 24 | 1.5 | 1.1667 | -0.01 | display | — |
| hero | 28 | 1.75 | 1.1429 | -0.01 | display | — |
| display | 33 | 2.0625 | 1.0909 | -0.01 | display | — |
| numeral | 72 | 4.5 | 1.0 | -0.01 | display | — |

### 3.3 Spacing, grid, radii
- **Grid base: 4.** Everything resolves to a multiple of 4.
- **Spacing scale (dp):** 1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40, 12=48.
- **Gutter (the one fluid value):** `clamp(16, 5vw, 24)` — same formula on native.
- **Radii (dp):** r1=8, r2=12, r3=16, r4=20, r5=24, bezel=36, pill=999. (tile=r1, control≈r2, card≈r3,
  panel=r3, full=pill.)
- **Border:** 1px, color `border`.

### 3.4 Motion (quick and calm; no bounce)
- **Press:** scale to 0.985 over 120ms (press = darken/shrink slightly, never grow).
- **Sheet:** translateY over 320ms, easing cubic-bezier(0.22, 1, 0.36, 1).
- **Scrim:** opacity over 250ms.
- **Pulse (live):** 1800ms loop (the "breathing" of a live indicator/loading).
- **Toast:** dwell 2600ms, 250ms in/out.
- **Reduced motion:** when the OS requests it, drop all durations to 0.
- **Hard rule:** entry-animation keyframes must end on **`transform: none`**, never `translateY(0)`. (A
  leftover transform silently traps any modal inside that element, pinning it below the fold. This bug
  has bitten SODA before.)

### 3.5 Layout, surfaces, targets
- Flat. No glassmorphism, no heavy shadows. Mobile-first.
- **Minimum tap target: 44dp.**
- Room grid: `gridMin` card width 150, `gridGap` 12; columns =
  `max(1, floor((width - 2*gutter + gridGap) / (gridMin + gridGap)))`.
- **Z-index order:** roomhead 5, nav 15, scrim 20, sheet 30, toast 60.

### 3.6 Copy rules
- **No em dashes** anywhere. Use "to" for ranges ("5 to 10"). Use commas or short sentences instead of a
  dash.
- No skinny arrows ("→") inside buttons. Buttons say the action in words.
- Avoid "it is not X, it is Y" contrast phrasing.
- Warmth is **language, never a number** (see 3.7).

### 3.7 Warmth (the connection-decay cue)
A connection's warmth is shown as a word + color, never a score.
| Value | Label | Color |
|---|---|---|
| in_rhythm | "In rhythm" | green |
| cooling | "Cooling" | amber |
| been_a_while | "Been a while" | hint |

---

## 4. The component library to build

All presentational (props in, view out), token-styled, RN-compatible.

### 4.1 Atoms
- **Button** — variants: primary (green fill), ghost (border), purple, gold; sizes; 44dp min; press =
  scale 0.985. No arrow glyphs.
- **Chip** — an offer/need pill: `{ label, focus?: string[] }`. Renders "Label" or "Label · focus".
  Offer vs need styling (green-leaning vs muted). Tappable (opens chip detail).
- **Avatar** — colored circle with initials; color is per-person (passed in).
- **Input / CodeInput** — text field and a 6-cell one-time-code entry (numeric).
- **SegmentedToggle** — a 2 to 3 option switch (e.g. grid/list, tone select).
- **ResendControl** — "resend code" with a countdown.
- **Badge / RolePill** — small status/role tag.
- **StatTile** — a big number + small label (display numeral + mono caption).
- **ContactRow / EventRow / EventCard** — list rows for people, rooms, events.
- **ProgressBar**, **Toast**, **BottomSheet** (slides from bottom, scrim behind, the sheet motion above).
- **TabBar** — the 5-item bottom nav. **SectionHeader**, **Carousel** (the swipeable card deck).

### 4.2 Composites (assembled from atoms + the contracts in section 5)
- **Hero** — the live/idle event banner on Home (eyebrow + title + subtitle + enter CTA).
- **ProfileCard** — the identity card with three faces (Offers / Me / Needs). **Me face shows identity
  only (name, role, "show up" line, signature) and NO chips.** Offers/Needs faces show chips.
- **CardDeck** — a swipeable carousel of the guest's ProfileCards; the highlighted one is active/editable.
- **MicroCard** — the compact person tile in the room grid (avatar, name, role, optional offer/need
  counts, a corner dot if they match you).
- **RosterGrid / RosterList** — the room roster. Grid shows micro-cards with count pills; List shows clean
  rows with a "Matches you" mark. **Layout drives density** (see house rules).
- **CardExpand modal** — the full ProfileCard in a sheet with a match strip and action buttons.
- **ChipDetail sheet** — one chip's focus + "start an intro about this".
- **IntroSheet** — the intro drafter (tone toggle, editable draft, add-connection toggle, gated Send,
  trust line "SODA drafts it. You send it. Nothing goes out on its own.").
- **MomentModal** — a variant-driven celebration modal (left-summary, match, milestone, top-connector);
  big numeral, avatar strip with overflow, primary/secondary actions.
- **ConnectionRow** — a kept-warm person with their warmth word.
- **ConditionState** — the family of error/loading/decision/locked/restricted/success states.

---

## 5. The screens and their data contracts

> **The contract pattern:** every screen/modal is `{ screen|modal, state|variant, ...payload, primary,
> secondary }`. The server writes this JSON; the client renders it. Common fields you will see: `state`,
> `variant`, `face_rule`, `gated`, `destination`, `view.layout`, `view.density`. Build each component to
> consume exactly these shapes.

### 5.1 Home
```json
{
  "screen": "home", "event_state": "live", "user_state": "returning",
  "hero": { "state": "live", "eyebrow": "Event live",
            "title": "Latinos-N-Tech is live right now.",
            "subtitle": "The room is open and 19 people are already in. Walk in as your card.",
            "cta": "Tap to enter", "cta_has_arrow": false,
            "action": { "type": "enter_room", "event_id": "evt_lnt_live" } },
  "cards": { "active_card_id": "founder", "editable_card_id": "founder",
             "face_rule": "me_face_has_no_chips", "items": "[the guest's cards]" },
  "rooms": "[live room + past rooms]",
  "connections": "[kept-warm people, see 5.8]",
  "nav": { "active": "home", "items": ["home", "rooms", "card", "people", "you"] }
}
```
Notes: hero eyebrow is GREEN; headline white at hero/28; the enter button has NO arrow. The deck's
highlighted card is the editable/active one; swipe to switch.

### 5.2 Room
```json
{
  "screen": "room",
  "context": { "event_id": "evt_lnt_live", "event_name": "Latinos-N-Tech", "room_live": true, "room_count": 19 },
  "view": { "layout": "grid", "density": "tabs", "rule": "grid_uses_tabs_list_uses_clean", "default_landing": "grid" },
  "people": [ /* see 5.9 sample; each: id, name, role, agency, agency_type, color, you, offers[], needs[], match */ ],
  "tap_action": { "type": "open_card", "opens": "expand_payload" },
  "pill_action": { "type": "open_card_to_face", "faces": ["offers", "needs"] }
}
```
- **Grid layout** renders MicroCards with **Tabs density**: each shows `offers_count` + `needs_count`
  pills, and a corner dot if `match.is_match`.
- **List layout** renders **Clean rows**: identity + a "Matches you" mark only, no counts.
- (The full chips live in the expanded card, not the roster.)

### 5.3 Card (expanded)
```json
{
  "modal": "card_expanded", "trigger": "open_card",
  "active_face": "me", "faces": ["offers", "me", "needs"], "face_rule": "me_face_has_no_chips",
  "person": { "name": "Maya Okafor", "role": "Founder", "agency": "NORTHBOUND", "agency_type": "Studio" },
  "offers": [ { "label": "Mentorship", "focus": ["design"] }, { "label": "Introductions", "focus": ["investors"] } ],
  "needs": [ { "label": "Collaboration", "focus": ["product design"] }, { "label": "Funding", "focus": ["pre-seed"] } ],
  "signature": "Maya Okafor",
  "match": { "is_match": true, "reason": "You both work in product design" },
  "actions": [
    { "label": "Add connection", "action": "add_connection", "destination": "people", "added_label": "Added" },
    { "label": "Start an intro", "action": "open_intro_starter", "gated": true }
  ]
}
```
Rule: the **Me** face shows identity only (name, role, show-up line, signature), never chips. The match
strip and the action buttons each have padding; nothing touches.

### 5.4 Chip detail (sheet from bottom)
```json
{
  "modal": "chip_detail", "kind": "offer", "label": "Mentorship", "focus": ["design"],
  "owner": "Maya", "owner_line": "Maya offers this to the room",
  "no_focus_copy": "No focus added. Just Mentorship, broadly.",
  "actions": [
    { "label": "Start an intro about this", "action": "open_intro_starter", "gated": true, "carries_chip_context": true },
    { "label": "Close", "action": "dismiss" }
  ]
}
```
`owner_line` is "{owner} offers this to the room" for an offer, "{owner} is looking for this" for a need.

### 5.5 Intro starter (sheet from bottom)
```json
{
  "modal": "intro_starter",
  "target": { "name": "Maya", "context": "Founder, in the room now" },
  "based_on": { "kind": "offer", "label": "Mentorship", "focus": "design" },
  "openers": { "Warm": "...", "Simple": "...", "Direct": "..." }, "selected_tone": "Warm", "editable": true,
  "add_connection": { "offered": true, "default_on": true, "label": "Add to your connections", "destination": "people" },
  "primary": { "label": "Send intro", "action": "send_intro", "gated": true },
  "secondary": { "label": "Cancel", "action": "dismiss" },
  "trust_line": "SODA drafts it. You send it. Nothing goes out on its own."
}
```
Three tones in a SegmentedToggle; the draft is editable; Send is **gated** (a confirm gate, never
auto-send). On send: toast "Intro sent, {name} added to connections" if the add toggle was on.

### 5.6 Moment: event left
```json
{
  "modal": "event_left", "variant": "summary", "trigger": "user_left_room",
  "headline": { "value": 7, "label": "connections made" },
  "people_strip": "first 4 avatars + overflow count",
  "body": "You walked in as Founder and left with 7 people worth knowing. They are warm now. Keep them that way.",
  "primary": { "label": "See my connections", "action": "open_people" },
  "secondary": { "label": "Back to home", "action": "go_tab" }
}
```
`variant: "quiet"` is the zero-state ("No connections this time. The room is still live, come back in").
Other built moment variants: match (mutual / complement), connection_count (milestone / pace),
top_connector (achieved = gold podium / missed = leaderboard with your gap). Achievement moments use gold.

### 5.7 Condition states (build the family)
error (offline banner, server 500, inline action-failed, not-found), loading (skeleton, processing),
decision (confirm-send, confirm-destructive, permission), locked (locked, closed/window-expired,
countdown), restricted (wrong-role that **reveals nothing**, rate-limited, at-capacity), success (toast).

### 5.8 People / You / Nav
- **People:** kept-warm connections. Each: `{ initials, color, name, role, warmth }` where warmth is the
  enum in 3.7 (word + color, never a number). Framing line: "Kept warm in SODA."
- **You:** stats (connections, cards, rooms) and "walking in as" = the active card.
- **Nav:** five tabs (home, rooms, card, people, you). Leaving the room via nav triggers the event-left
  moment, then routes to the chosen tab.

### 5.9 Sample data (build against this)
Guest's own cards (the deck; swipe to choose which you show up as):
```json
[
  { "id": "founder", "role": "Founder", "name": "BRENT", "agency": "GILCHRIST", "agency_type": "Creative Agency",
    "show_up": "Building the room you walk into",
    "offers": [ { "label": "Advice", "focus": ["fundraising"] }, { "label": "Mentorship", "focus": ["design"] } ],
    "needs": [ { "label": "Collaboration", "focus": ["product design"] }, { "label": "Work", "focus": [] } ],
    "signature": "Brent Montgomery" },
  { "id": "designer", "role": "Designer", "name": "BRENT", "agency": "GILCHRIST", "agency_type": "Creative Agency",
    "show_up": "I make the thing feel like something",
    "offers": [ { "label": "Design", "focus": ["product"] }, { "label": "Branding", "focus": ["identity"] } ],
    "needs": [ { "label": "Collaboration", "focus": ["founders"] }, { "label": "Clients", "focus": ["startups"] } ],
    "signature": "Brent Montgomery" }
]
```
A few room people (note `you`, `color`, and `match`):
```json
[
  { "id": "maya", "name": "Maya Okafor", "role": "Founder", "agency": "NORTHBOUND", "agency_type": "Studio", "color": "#3bd75c", "you": false,
    "offers": [ { "label": "Mentorship", "focus": ["design"] }, { "label": "Introductions", "focus": ["investors"] } ],
    "needs": [ { "label": "Collaboration", "focus": ["product design"] }, { "label": "Funding", "focus": ["pre-seed"] } ],
    "match": { "is_match": true, "reason": "You both work in product design" } },
  { "id": "devin", "name": "Devin Park", "role": "Fractional CFO", "agency": "LEDGERLINE", "agency_type": "Advisory", "color": "#f59e0b", "you": false,
    "offers": [ { "label": "Advice", "focus": ["fundraising"] }, { "label": "Investment", "focus": ["pre-seed"] } ],
    "needs": [ { "label": "Introductions", "focus": ["founders"] } ],
    "match": { "is_match": true, "reason": "He funds what you are raising for" } },
  { "id": "tomas", "name": "Tomas Rivera", "role": "Just exited", "agency": "", "agency_type": "", "color": "#a47bff", "you": false,
    "offers": [ { "label": "Investment", "focus": ["seed"] } ], "needs": [ { "label": "Introductions", "focus": ["operators"] } ],
    "match": { "is_match": false } }
]
```
Kept-warm connections:
```json
[
  { "id": "past_maya", "initials": "MO", "color": "#3bd75c", "name": "Maya Okafor", "role": "Founder, Coffee Connect", "warmth": "in_rhythm" },
  { "id": "past_devin", "initials": "DP", "color": "#a47bff", "name": "Devin Park", "role": "Fractional CFO, Founder Mixer", "warmth": "cooling" }
]
```

---

## 6. House rules and conventions (non-negotiable)

- **Me face has no chips.** Identity only on the Me face; chips on Offers/Needs.
- **Layout drives density.** Room grid → Tabs (count pills); room list → Clean (matches-you only).
- **Gated actions never auto-fire.** Anything that sends (an intro, a draft) shows a confirm gate first.
  The trust line is part of the UI: "SODA drafts it. You send it. Nothing goes out on its own."
- **Warmth is language, not a number.** Word + color only.
- **Add-connection destination is "people"** for now (a future platform may change this one field; do not
  hardcode any other destination).
- **No em dashes; no arrow glyphs in buttons; 44dp tap targets; reduced-motion respected; entry
  animations end on `transform: none`.**

---

## 7. Precision and cohesion (the craft standard — hold optics and system together)

> This is what makes a hundred components feel cut from one block. Read it before building anything. The
> short version: **the grid and tokens are your default tool; the trained eye is the final authority; and
> every time the eye overrules the grid, you capture that correction as a named, reusable rule, so it
> strengthens the system instead of drifting it.** Precise without being rigid; flexible without drifting.

### 7.1 The hierarchy (when in doubt, follow this order)
1. Does it look right, at real size, on a phone, in context? The eye decides.
2. Is the value a token? If yes, good.
3. If the right-looking value is NOT a token, do not force it onto the grid AND do not leave it as a raw
   one-off. Add a named token or optical rule for it. The exception becomes part of the system.

### 7.2 The drift rule, reworded so it serves the eye
Every value is intentional and named. A raw, un-named hex or pixel that lives in only one component is
**drift**, and drift is what breaks "fitting together." But a value that looks right and is **captured as
a named token or rule** is not drift, even if it sits off the 4px grid. Name it, reuse it, and it counts.

### 7.3 Name your optical corrections (mathematical alignment is not visual alignment)
Capture these as named rules and apply them everywhere the situation occurs, never as a silent one-off
nudge:
- **Optical centering** for icons and glyphs (the geometric center reads low or left; correct by eye).
- **Baseline nudges between font families** (the display and text families will sit on different
  baselines; a display title next to body text wants a small, named offset).
- **Shape compensation** (a circle next to a same-box square looks smaller; an avatar may want a hair
  more size than its grid cell).
- **Inset compensation** (equal padding around a glyph vs around text looks unequal; correct and name it).
The test: if you catch yourself eyeballing the same kind of fix twice, it is a named rule, not two nudges.

### 7.4 Spacing is a grammar, not per-component margins (the single biggest cohesion lever)
Components never set their own outer margins. The space between things is owned by layout primitives:
- `Stack` (vertical, gap from the space scale), `Row` (horizontal), `Inset` (padding), `Divider`.
- A component's job ends at its own edge; the container decides the space around it.
- Result: every gap is a named scale value, so everything breathes the same and nothing drifts.

### 7.5 One place per primitive
A Chip, a Button, an Avatar is styled in exactly one file. Composites assemble from atoms and layout
primitives only; they never restyle an atom or draw their own version. Change the atom, it updates
everywhere. Duplication is where drift is born; this is how you kill it.

### 7.6 Strict zones vs eye-led zones (tag every component)
- **STRICT**, where things repeat or align: the room roster, lists, chip rows, the nav. Here consistency
  IS the quality and the grid rules. No eye-led exceptions inside a repeating set.
- **EYE-LED**, where a moment should move someone: the hero, the match celebration, the send-off, the
  leave moment. Here harmony beats grid-purity; let the eye lead and capture what it lands on as a token.
Tag each component STRICT or EYE-LED so the builder knows which mode they are in.

### 7.7 Judge in context, at real size, on a real phone, in the dark
A component looks right alone and wrong in a dense room. Never sign off a component in isolation or zoomed
in. The final eye-check is the real thing, at arm's length, on the actual dark screen it will live on.

### 7.8 When the grid and the eye disagree, the reference wins
The Live-Fire render is the visual truth. Build to match how it looks, then record the value as a token.
"It looks right here" beats "the spec says 16."

### 7.9 Keep the token set lean
Too many tokens is as brittle as too few (false precision, decision paralysis). A small, meaningful set
plus a handful of named optical rules beats hundreds of micro-tokens.

### 7.10 Per-component definition of done (the gate; nothing enters the kit until all pass)
1. Every value traces to a token or a named optical rule (no raw one-offs).
2. Sits on the 4px grid, except where a named optical rule says otherwise.
3. Spacing comes from layout primitives; the component sets no outer margins.
4. Built only from atoms and layout primitives (nothing re-styled or re-drawn).
5. All states present (default, pressed, disabled, loading, empty, error).
6. Matches the Live-Fire reference at real size, on a phone.
7. Tagged STRICT or EYE-LED, and typed against its contract.

### 7.11 Two required cohesion deliverables
- A **gallery**: one screen rendering every atom and composite, in every variant and state, so drift is
  visible at a glance. This is also where the visual-diff check runs later.
- A **parity pass**: each component placed next to its Live-Fire source; they must match before it is done.

---

## 8. What to deliver and how to check it

**Deliver:**
1. The atoms (4.1) and composites (4.2) as presentational, typed, token-styled components.
2. The screens (section 5) assembled from them, each rendering correctly from its sample contract.
3. A token theme file (the values in section 3) as the single source both web and native read.

**Acceptance checks:**
- Every component is presentational (no data fetching, no business logic inside).
- Every value traces to a token (no stray hex, sizes, or radii).
- Each screen renders faithfully from the contract JSON in section 5 (state/variant/face_rule honored).
- Color discipline holds (green interactive, purple private/match, amber timer/cooling, gold achievement,
  red error, neutral everything else).
- Me face shows no chips; grid/list density rule holds; gated actions gate; warmth shows as a word.
- 44dp targets; reduced-motion drops durations to 0; no em dashes; buttons have no arrow glyphs.
- The same component renders on web and (at least in a simulator) native, or is written so it can without
  a rewrite (presentational + token-driven + RN primitives).

**Then:** assemble the happy path to verify it flows — Home (live hero) → tap to enter → Room (grid Tabs)
→ tap a person → expanded card → flip faces (Me has no chips) → tap a chip → chip detail → Start an intro
(tones + add toggle, gated Send) → leave via nav → the event-left moment → See my connections → People.
