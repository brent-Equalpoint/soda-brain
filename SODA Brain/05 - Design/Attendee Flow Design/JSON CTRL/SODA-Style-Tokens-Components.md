# SODA Style Tokens, Component Inventory

A map of every component in the Live-Fire app and the style properties that currently live in CSS. The handoff already controls color, font family, and warmth. This list covers the presentation layer the JSON does not yet own: spacing, radius, type scale, dimensions, and motion. Tokenize the foundation sets first, then point each component at them.

Values shown are the real numbers in the current build. Where the build drifted off a clean step, the recommended scale snaps it back.

---

## 1. Foundation sets (define these first)

Every component references these. Lock them once and the app stops drifting between builds.

**Tag every value `fluid` or `fixed`.** Fluid values carry a min and max and flex with the screen. Fixed values hold their pixel size. The rule that protects the look: flex the outer gutter and the type, pin the inner detail. If everything flexes the design goes loose. Most tokens are fixed. Only a named few are fluid.

### {responsive} (fluid, new)
The four tokens that keep mobile from squeezing. Author the bounds once.
- {tap_min} 44px, `fixed`. The hit-area floor for every interactive atom (Apple HIG minimum).
- {grid_min} 150px, `fixed`. The narrowest a room card may get before the grid drops a column.
- {gutter} clamp(16px, 5vw, 24px), `fluid`. The screen side padding. Narrow phones reclaim space, large screens breathe.
- Grid rule: `repeat(auto-fill, minmax({grid_min}, 1fr))`. Two columns on a phone, one on the narrowest, more on a tablet, with no breakpoints to maintain.

### {space}
4px base grid. `fixed` (except {gutter}, which flexes between two grid values).
Ladder: `4 8 12 16 20 24 32 40 48`. Every gap is a multiple of 4, so nothing lands off its neighbor.
Screen side padding reads {gutter} clamp(16, 5vw, 24), both ends on the grid.

### {radius}
`fixed`, on the 4px grid.
- {radius.r1} 8 (gpill, toggle, avatar sm, match icon)
- {radius.r2} 12 (avatar, facetabs, toggle group)
- {radius.r3} 16 (chips, buttons, match strip, toast, draft)
- {radius.r4} 20 (mini-card, grid card, stat block)
- {radius.r5} 24 (sheet top)
- {radius.bezel} 36 (desktop phone frame)
- {radius.pill} 999 (warmth dot, switch, tags)

### {type}
Base 16, minor third ratio 1.2. Sizes in rem so iOS Dynamic Type scales the whole grid together. Leading is unitless and resolves to a multiple of 4 at base size, which locks every text block to the baseline. Tracking is em so it scales with the size. Type is `fixed` on the scale, not fluid; a true baseline grid needs fixed sizes, and responsiveness lives in {gutter} and the grid instead.

Format below: name, px, rem, leading to baseline px, tracking, font.
- {type.eyebrow} 11, 0.6875rem, lh 1.4545 to 16, tracking 0.1em, mono uppercase
- {type.caption} 13, 0.8125rem, lh 1.2308 to 16, tracking 0, ui
- {type.body} 16, 1rem, lh 1.5 to 24, tracking 0, ui
- {type.titleSm} 20, 1.25rem, lh 1.2 to 24, tracking -0.01em, display
- {type.title} 24, 1.5rem, lh 1.1667 to 28, tracking -0.01em, display
- {type.hero} 28, 1.75rem, lh 1.1429 to 32, tracking -0.01em, display
- {type.display} 33, 2.0625rem, lh 1.0909 to 36, tracking -0.01em, display
- {type.numeral} 72, 4.5rem, lh 1 solid, tracking -0.01em, display
- {type.signature} 26, Caveat, decorative, intentionally exempt from the baseline grid

Leading scale (unitless): per-size values above, plus {leading.solid} 1 for numerals.
Tracking scale (em): {tracking.tight} -0.01 display, {tracking.normal} 0 body, {tracking.wide} 0.02 short all-caps names, {tracking.eyebrow} 0.1 mono labels.


### {border}
- {border.width} 1
- {border.color} references {colors.border} #2a2a2a

### {elevation}
- {shadow.sheet} 0 -20px 60px rgba(0,0,0,.5)
- {shadow.card} 0 14px 40px rgba(0,0,0,.4)
- {shadow.bezel} 0 40px 120px rgba(0,0,0,.55), inset 0 0 0 8px #050505
- {glow.match} 0 0 0 3px rgba(164,123,255,.18)
- {glow.active} 0 0 0 1px {colors.green_deep}

### {motion}
- {motion.press} scale .985, duration .12s
- {motion.sheet} translateY, .32s, cubic-bezier(.22,1,.36,1)
- {motion.scrim} opacity .25s
- {motion.toast} .25s in, dwell 2600ms
- {motion.pulse} 1.8s infinite (live dot)
- Rule: honor prefers-reduced-motion, drop all of the above to 0.

### {z}
- {z.roomhead} 5
- {z.nav} 15
- {z.scrim} 20
- {z.sheet} 30
- {z.toast} 60

---

## 2. Shell components

### app_frame
- max-width 440
- height 100dvh (fills container)
- bezel: shown only at min-width 520 and min-height 760
- bezel height min(880, 100dvh - 40), radius {radius.bezel}, {shadow.bezel}
- backdrop behind bezel #0a0a0a

### status_bar
- height 30
- padding top max(10, safe-area-top), sides 22
- font {type.eyebrow} size 11, color {colors.muted}
- signal dots: 5px, last one {colors.ink}

### brand_bar
- padding 14 20 6
- holds soda_mark + optional live_chip

### soda_mark
- four-dot grid, 2 by 2
- dot 7px, gap 3px
- three dots {colors.green}, one off #333
- wordmark gap 9, {type.wordmark}

### live_chip
- {type.eyebrow}, color {colors.green}, uppercase
- pulse dot 7px {colors.green}, {motion.pulse}

### bottom_nav
- position bottom, height auto, padding 9 8, plus safe-area-bottom
- background rgba(17,17,17,.92), blur 14
- top border {border}
- icon 22, stroke-width 1.7
- label 10
- inactive {colors.hint}, active icon {colors.ink}, active label {colors.green}
- items: home, rooms, card, people, you

---

## 3. Shared atoms

### eyebrow
- {type.eyebrow}
- variant default {colors.muted}, variant green {colors.green}

### avatar
- default 42, radius {radius.lg} 13, font 15, text #0c0c0c
- sm 34, radius {radius.sm} 11, font 13
- background = person.color

### tag
- {type.eyebrow} size 10, padding 5 9, radius {radius.pill}
- variant match: {colors.purple} on rgba(164,123,255,.12)
- variant open: {colors.green} on rgba(59,215,92,.12)
- variant past: {colors.hint}, no fill

### warmth_indicator
- dot 8px + label, {type.caption}
- enum (already in {warmth_enum}): in_rhythm green, cooling amber, been_a_while hint

### button
- padding 16, radius {radius.md} 15, weight 700, size 15.5
- press {motion.press}
- primary: {colors.green} on text #06210d
- secondary: transparent, {border}, {colors.ink}, weight 600
- secondary.added: {colors.green} text, {colors.green_deep} border, rgba(59,215,92,.07) fill, leading check

### chip (offer / need row)
- padding 14 15, radius {radius.md} 14, background {colors.surface}, {border}
- label {type.body_lg}, focus {type.caption} {colors.muted}
- trailing "Open" {type.eyebrow} size 10 {colors.hint}
- hover: border #3a3d3a, lift {shadow.card} reduced
- press {motion.press}

### section_header
- padding 22 20 4
- eyebrow left, meta right ({type.eyebrow} {colors.hint})
- margin-bottom 14

### list_row
- padding 14 20, gap 13
- top divider {border}, first row no divider
- avatar + (name {type.body_lg} weight 600, sub {type.caption} {colors.muted}) + trailing slot

---

## 4. Screen components

### hero
- padding 26 20 8
- eyebrow green
- h1 {type.display} 26, line-height 1.18, tracking -.3
- subtitle {type.body_lg} {colors.muted}, max-width 30ch
- cta = button.primary, full width, margin-top 22, no arrow

### card_deck
- horizontal scroll, snap center
- gap 12, padding 4 20 8

### mini_card
- basis 78% of deck
- padding 18 18 16, radius {radius.xl} 20, background {colors.card}, {border}
- active: border {colors.green}, {glow.active} plus {shadow.card}
- dim: editable label hidden
- role {type.eyebrow}
- name {type.title_sm} 22 display, tracking .5
- agency {type.caption}
- show_up {type.body}, min-height 38
- signature {type.sig} 22, {colors.green}
- editable label {type.eyebrow} size 10.5 {colors.green} with leading dot

### room_header
- padding 16 20 12, sticky top, {z.roomhead}
- title {type.title_sm} 20 display
- count {type.caption} {colors.muted}, leading green dot
- holds layout_toggle

### layout_toggle
- background {colors.card}, {border}, radius {radius.md} 12, padding 3
- button padding 7 11, radius {radius.xs} 9, size 12, weight 600
- inactive {colors.muted}, active {colors.surface} fill + {colors.ink}

### grid_card
- grid: repeat(auto-fill, minmax({grid_min}, 1fr)), gap 12, padding 6 {gutter} 20
- card padding 15 14, radius {radius.lg} 18, background {colors.card}, {border}
- press scale .98
- corner match dot: 9px {colors.purple}, {glow.match}, top 13 right 13
- name {type.body_lg} weight 600, margin-top 12
- sub {type.caption} {colors.muted}, min-height 16
- gpills row: gap 7, margin-top 13

### gpill (count pill)
- flex 1, {border}, radius {radius.sm} 10, padding 7 4, center
- count {type.title_sm} 15 display
- label {type.eyebrow} size 9 {colors.muted}
- press fill {colors.surface}

### screen_header (people, you, rooms)
- padding 18 20 6
- h2 {type.title} 24 display, tracking -.2
- subtitle {type.caption} 13.5 {colors.muted}

### stat_block (you screen)
- flex row, gap 12, padding 16 20 8
- block padding 18 14, radius {radius.lg} 18, background {colors.card}, {border}, center
- number {type.display_lg} 30 display
- label {type.eyebrow} size 10 {colors.muted}

---

## 5. Surfaces (sheets, modals, overlays)

### scrim
- inset 0, background rgba(0,0,0,.55)
- {motion.scrim}, {z.scrim}

### sheet_base
- bottom-anchored, radius {radius.2xl} 26 top only
- {shadow.sheet}, {z.sheet}
- max-height 92%, variant tall 88%
- slide {motion.sheet}
- grab handle 38 by 4, radius {radius.pill}, #3a3a3a, margin 11 auto 4
- body padding 8 22 26, scrolls

### face_tabs (expanded card)
- padding 10 22 4, gap 6
- tab padding 9, radius {radius.sm} 11, {type.eyebrow}
- inactive {colors.hint} on {colors.surface}
- active {colors.ink} on #2c2f2c, inset ring {border}
- faces order: offers, me, needs. Rule: me has no chips.

### me_face
- name {type.display_lg} 30 display, tracking .4
- role {type.eyebrow}
- agency {type.body} {colors.muted}
- show_up {type.body_lg} 16, line-height 1.5
- signature {type.sig} 26 {colors.green}
- here-line (others, when no show_up): {type.caption} {colors.green} with leading dot, copy "In the room now"

### offers_needs_face
- face eyebrow {type.eyebrow} {colors.muted}, margin 6 0 14
- offers copy "Offers to the room", needs copy "Looking for"
- chips stacked, gap 10
- focus fallback copy "Broadly"

### match_strip
- padding 14 15, radius {radius.md} 14, margin 18 0
- fill rgba(164,123,255,.10), border rgba(164,123,255,.22)
- icon box 24, radius {radius.xs} 8, rgba(164,123,255,.18), {colors.purple}
- text {type.body}, lead bold {colors.purple}, copy "Matches you."

### card_actions
- stacked, gap 11, padding-top 6
- primary "Start an intro" (gated), secondary "Add connection" to "Added"

### chip_detail_sheet
- kind eyebrow {type.eyebrow}, copy "They offer" or "They need"
- label {type.display_lg} 30, margin 10 0 16
- focus tags: {type.caption}, padding 7 12, radius {radius.pill}, {colors.surface}, {border}
- no-focus copy "No focus added. Just {label}, broadly."
- owner line: top divider {border}, avatar sm + {type.body} {colors.muted}, owner bold {colors.ink}
- actions: "Start an intro about this" (gated, carries chip), "Close"

### intro_starter_sheet
- eyebrow "Start an intro"
- to-line {type.body_lg}, name bold
- basis line {type.caption} {colors.muted}
- tone_selector: 3 pills, gap 8, padding 10, radius {radius.md} 12, weight 600 size 13
  - inactive {colors.muted} on {colors.surface}, active {colors.green} on rgba(59,215,92,.07) with {colors.green_deep} border
  - tones: Warm, Simple, Direct. Default Warm.
- draft_field: textarea, min-height 120, padding 14, radius {radius.md} 14, {colors.surface}, {border}, {type.body} 14.5, focus border #3a3d3a
- add_switch: track 46 by 28, radius {radius.pill}, off #333 on {colors.green}, knob 22 white, locked opacity .7
  - default on, locks on when already connected
- trust line {type.caption} {colors.hint}, centered, copy "SODA drafts it. You send it. Nothing goes out on its own."
- actions: "Send intro" (gated), "Cancel"

### moment_event_left
- eyebrow "You left the room"
- numeral {type.numeral} 72 {colors.green} (muted at zero state)
- num label {type.body_lg} {colors.muted}
- people strip: avatars overlap -8, 2px {colors.card} ring, overflow "more" chip 42 radius {radius.lg} {colors.surface}
- body {type.body_lg}, max-width 30ch, role and count bold {colors.green}
- actions: "See my connections", "Back to {tab}"
- zero state swaps body and offers return to room

### toast
- left 20 right 20, bottom 96, {z.toast}
- background #06210d, border {colors.green_deep}, text {colors.green}
- padding 14 16, radius {radius.md} 14, {type.body} weight 600, centered
- {motion.toast}

---

## 6. Suggested JSON shape

Add two blocks beside the existing `design_tokens`.

```
design_tokens: { colors, fonts, space, radius, type, border, elevation, motion, z }   // extend
components: {
  app_frame: {...}, bottom_nav: {...}, button: { primary, secondary, added },
  chip: {...}, mini_card: {...}, grid_card: {...}, sheet_base: {...},
  intro_starter: { tone_selector, draft_field, add_switch }, ... 
}
```

Each component field references a foundation token by name rather than a raw value. A builder then renders from `components`, the same way screens render from `screen_contracts`. Server decides, client reflects, presentation included.

---

## 7. Rules to encode as flags

These live in house_rules or in good mobile practice. Mirror them as component flags so a builder cannot miss them.

Product rules:
- {me_face_has_no_chips} on face_tabs and card_expanded
- {grid_uses_tabs_list_uses_clean} on room view, driving gpills versus clean rows
- {gated} on every intro and send action
- no arrow glyphs in any button label

Mobile floor (applies to every build, not optional):
- Every interactive atom meets {tap_min} 44px. Small controls keep their visual size and grow an invisible hit area, so the look holds while the target passes the standard.
- Screen side padding reads {gutter}, never a raw pixel.
- The room grid uses auto-fill with {grid_min}, so it reflows by available width instead of a hard column count.
- Text containers in rows and cards carry min-width 0 so long names truncate instead of pushing the layout wide.
- Honor prefers-reduced-motion: drop all {motion} to 0.
