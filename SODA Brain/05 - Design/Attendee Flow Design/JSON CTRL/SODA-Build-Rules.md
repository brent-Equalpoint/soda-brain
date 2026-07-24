# SODA Build Rules

Paste this at the top of any chat or Claude Design session before building a SODA screen, component, or flow. It locks the identity, the tokens, and the mobile floor so any builder reproduces SODA the same way and the look never drifts.

This ruleset governs all three stages: the prototype, the PWA first version, and the native transfer. Full consistency is the requirement. Section 9 is the part that makes the PWA-to-native handoff seamless.

Pair it with three attachments when you can: `soda.tokens.json` (the single source of truth for every value), `SODA-Handoff.json` (data model and screen contracts), and `SODA-Style-Tokens-Components.md` (the full component and token inventory). This file is the rules. Those three are the spec.

These rules are built to change. Section 10 is how you amend them without breaking consistency, and it classifies every rule as locked or tunable so the boundary is explicit.

---

## How to use this

For a new chat: paste section 8a, then attach the handoff and the inventory. State the one screen or component you want. Let the builder render from the contract.

For Claude Design: paste section 8b as the brief, keep the token list from section 3 visible as the constraint, and iterate on the canvas one component at a time.

For an existing chat that is drifting: paste sections 2, 3, and 4 and ask the builder to re-check its output against section 7.

---

## 1. What you are building

SODA is the live room at an event. Equalpoint is the memory of every room. SODA is the wedge.

One liner: a name tag knows you showed up, SODA knows who you became to the room.

Form: dark only, mobile first, a PWA-feel app. Build prototypes as one self-contained HTML file. Production runs Next.js, Supabase, Vercel.

Principle: the server writes JSON, the client renders it. The server decides, the client reflects. Presentation is included in that contract through design tokens.

---

## 2. House rules (non-negotiable)

Writing:
- No em dashes. Use commas, colons, semicolons, or a restructured sentence.
- No "it is not X, it is Y" contrast framing.
- Declarative, active voice. No hedging.
- Name things by what the person controls, not by how the system is built. An action keeps the same word through the whole flow. The button that says Send produces a toast that says Sent.

Product:
- {me_face_has_no_chips}. The Me face is identity only: name, show-up line, signature. Chips live on Offers and Needs faces.
- {grid_uses_tabs_list_uses_clean}. Grid layout shows count pills. List layout shows clean rows with Matches you only. Layout drives density.
- {gated} on every AI or intro action. SODA drafts it, the person sends it, nothing goes out on its own. A draft step writes, an approve step sends.
- {equalpoint_not_named_yet}. Added connections live in the SODA People tab, kept warm. Destination field reads `people`. Swap to `equalpoint` later, one field.
- No arrow glyphs in any button label.

---

## 3. Design tokens (source of truth)

Tag every value `fluid` or `fixed`. Fluid carries a min and max and flexes with the screen. Fixed holds its size. The rule that protects the look: flex the outer gutter and the type, pin the inner detail. Most tokens are fixed.

Color (dark only):
- canvas #111111, card #1a1a1a, surface #202220, border #2a2a2a
- ink #f5f5f5, muted #8a8a8a, hint #5a5a5a
- green #3bd75c, green_deep #203229, amber #f59e0b, purple #a47bff, red #ef4444, gold #e8c468

Color usage (strict):
- green is interactive and confirm only
- amber is timers and cooling
- purple is nudge and match
- gold is achievement
- a person's avatar color is their own, separate from the cues above

Type, base 16 minor third 1.2 on a 4px baseline:
- display Archivo Black, ui DM Sans, mono DM Mono, signature Caveat
- sizes in rem so iOS Dynamic Type scales the whole grid together
- scale, size then leading to baseline: eyebrow 11 to 16, caption 13 to 16, body 16 to 24, titleSm 20 to 24, title 24 to 28, hero 28 to 32, display 33 to 36, numeral 72 solid
- leading is unitless and resolves to a multiple of 4, which locks text to the baseline
- tracking is em: tight -0.01 on display, 0 on body, wide 0.02 on short all-caps names, 0.1 on mono eyebrows
- signature Caveat 26 is decorative and exempt from the baseline grid
- type is fixed on the scale, not fluid. A true baseline needs fixed sizes. Responsiveness lives in {gutter} and the grid.

Responsive (the four that stop the squeeze):
- {tap_min} 44px, the hit-area floor for every interactive atom
- {grid_min} 150px, the narrowest a card may get before the grid drops a column
- {gutter} clamp(16px, 5vw, 24px), the screen side padding
- grid rule: repeat(auto-fill, minmax({grid_min}, 1fr))

Radius (fixed, 4px grid): r1 8, r2 12, r3 16, r4 20, r5 24, bezel 36, pill 999.

Motion (fixed, honor prefers-reduced-motion by dropping all to 0):
- press scale .985, .12s
- sheet translateY .32s cubic-bezier(.22, 1, .36, 1)
- scrim opacity .25s
- pulse 1.8s on the live dot
- toast dwell 2600ms

Warmth:
- formula: max(0, round(base * Math.exp(-0.01 * days)))
- surface warmth as language, never a number: in_rhythm green "In rhythm", cooling amber "Cooling", been_a_while hint "Been a while"

---

## 4. Mobile floor (never optional)

- Every interactive atom meets {tap_min} 44px. Keep a small control small by holding its visual size and growing an invisible hit area with a positioned transparent pseudo-element. The look holds, the target passes the standard.
- Screen side padding reads {gutter}, never a raw pixel.
- The card grid uses auto-fill with {grid_min} so it reflows by available width. No hard column counts, no breakpoints to maintain.
- Text containers in rows and cards carry min-width 0 so long names truncate with an ellipsis instead of pushing the layout wide.
- Large display type is fluid in rem so it scales and respects Dynamic Type.
- Respect safe areas: top inset on the status row, bottom inset on the nav.
- Honor prefers-reduced-motion.

---

## 5. Component contracts

Screens: home, room, card, people, you. Nav items: home, rooms, card, people, you. Leaving a live room through the nav fires the event-left moment, then routes to the chosen tab.

Surfaces: card expanded, chip detail, intro starter, event-left moment, toast. Sheets slide from the bottom and stack. The scrim and Escape close the top sheet.

The happy path, walkable end to end:
1. Home opens live. Green eyebrow, fluid headline, Tap to enter with no arrow, count equals people in the room.
2. Tap to enter goes to the room. Grid shows count pills, List shows clean rows.
3. Tap a card to open it. Three faces: Offers, Me, Needs. Me has no chips.
4. Tap a chip to open its detail sheet.
5. Start an intro opens the intro sheet: Warm, Simple, Direct tones, an editable draft, an add-to-connections toggle defaulted on, a gated Send.
6. Leave through the nav to fire the event-left moment, then land on the chosen tab.

State: one shared object. A connection added in the room flows to the wrap-up count, then People, then the Home stay-warm strip, then the You stat.

For exact paddings, radii, sizes, and per-component token references, read `SODA-Style-Tokens-Components.md`. Do not invent values that the inventory already sets.

---

## 6. Build conventions

- Prototype as one self-contained HTML file: HTML, CSS, and JS inline. Dark only.
- Render each screen and component from a contract object, the same way screens render from `screen_contracts`. Server decides, client reflects.
- Hold one shared state object. Persist a connection across the wrap-up, People, Home, and You in that one object.
- Never use browser storage in a Claude artifact. Keep state in memory for the session.
- Intro openers are templates in v1, written in Equalpoint voice. Live AI drafts come later behind the same gated step.

---

## 7. Done-right checklist (pass before shipping)

A build is correct only when every line is true. Re-check the output against this list.

- Every button, nav item, tab, pill, and toggle has a 44px or larger hit area.
- The card grid shows two columns at iPhone width and reflows to one on the narrowest screen.
- No horizontal scroll on any screen.
- Headlines, screen titles, and the moment numeral scale with width and with Dynamic Type.
- Long names truncate with an ellipsis. Nothing pushes the layout wide.
- No em dashes anywhere. No arrow glyphs in any button.
- The Me face shows no chips. Offers and Needs hold the chips.
- Grid shows count pills. List shows clean rows.
- Every intro and send is gated. Nothing sends on its own.
- Added connections route to `people`, not to Equalpoint.
- prefers-reduced-motion drops all animation.
- Color usage holds: green only for interactive and confirm, purple for match, amber for cooling, gold for achievement.

---

## 8. Copy-paste blocks

### 8a. Prompt preamble for a chat

```
You are building a SODA screen. SODA is the live room at an event, dark only, mobile first, a PWA-feel app. Build the prototype as one self-contained HTML file with inline CSS and JS. Render from the attached contract, do not invent values the inventory already sets.

Hard rules:
- No em dashes. Declarative, active voice. No arrow glyphs in buttons.
- Me face is identity only and has no chips. Offers and Needs hold chips.
- Grid layout shows count pills, List layout shows clean rows. Layout drives density.
- Every intro and send is gated: draft writes, approve sends, nothing sends on its own.
- Added connections route to the People tab, destination field "people".

Tokens: dark palette with canvas #111111, card #1a1a1a, surface #202220, border #2a2a2a, ink #f5f5f5, muted #8a8a8a, hint #5a5a5a, green #3bd75c, amber #f59e0b, purple #a47bff. Green is interactive and confirm only, purple is match, amber is cooling. Fonts: Archivo Black display, DM Sans ui, DM Mono eyebrows, Caveat signature.

Mobile floor, all required: every interactive atom has a 44px hit area; screen side padding is clamp(16px, 5vw, 24px); the card grid is repeat(auto-fill, minmax(150px, 1fr)); text containers carry min-width 0 so names truncate; large display type is fluid rem with clamp; honor prefers-reduced-motion and safe areas.

Before you show me the result, confirm it against this list: 44px targets, two-column grid that reflows to one, no horizontal scroll, fluid headings, no em dashes, no button arrows, Me face chip-free, gated sends, connections route to people.

I am attaching SODA-Handoff.json and SODA-Style-Tokens-Components.md. Build only the screen I name next.
```

### 8b. Design brief for Claude Design

```
Design a SODA screen on the canvas. SODA is the live room at an event. Dark only, mobile first, a phone-width frame.

Palette: canvas #111111, card #1a1a1a, surface #202220, border #2a2a2a, ink #f5f5f5, muted #8a8a8a, hint #5a5a5a. Accents: green #3bd75c for interactive and confirm only, purple #a47bff for match, amber #f59e0b for cooling. Avatar colors are per person.

Type, base 16 minor third 1.2 on a 4px baseline: Archivo Black for display, DM Sans for ui, DM Mono for small uppercase eyebrows with 0.1em tracking, Caveat for signatures. Sizes eyebrow 11, caption 13, body 16, titleSm 20, title 24, hero 28, display 33, numeral 72. Leading locks each line to a multiple of 4. Tracking is em, tight on display, wide on short all-caps names.

Spacing and shape on a 4px grid: spacing in multiples of 4, side gutter 16 to 24, card radius 20, sheet top radius 24, chip and button radius 16, pill radius 999. Generous padding inside cards. Two-column card grid that reflows to one on a narrow screen.

Rules to hold: the Me face is identity only with no chips. Offers and Needs hold chips. Buttons never use arrow glyphs. Match is shown with a purple corner dot on grid cards and a purple strip in the open card. Warmth shows as words, In rhythm, Cooling, Been a while, never a number.

Every tappable element reads at least 44px tall. Start with the screen I name, then iterate.
```

### 8c. One-line drift check

```
Re-check this against the SODA done-right list: 44px targets, auto-fill grid, no horizontal scroll, fluid headings, no em dashes, no button arrows, Me face chip-free, grid pills vs list clean, gated sends, connections route to people, reduced motion respected.
```

---

## 9. Production and platform parity

The system has to hold from the prototype to the PWA to native, with no drift. The transfer is seamless when values are platform neutral and behavior is platform specific. Your stack already supports this: Next.js for the PWA, Expo for native, one shared token layer between them.

### The one principle

- Token values are primitives: numbers and hex. They live in one file, `soda.tokens.json`, and never get retyped into a platform.
- Token behavior is applied per platform. Web uses CSS. Native uses React Native. Both implement the same named rule from the same numbers.

### The pipeline

```
soda.tokens.json   (single source of truth)
  -> web:    compile to CSS custom properties, the Next.js PWA reads them
  -> native: import as a TypeScript theme, Expo reads them
```

Use Style Dictionary, or a small script. Never hand-copy a value into either platform. If a number appears in CSS or in a React Native style and does not trace back to the token file, that is the drift, stop and route it through the source.

### What stays identical across platforms

No translation. The same value on both:
- every color hex, the full type scale, radius, spacing, {tap_min} 44, {grid_min} 150, motion durations in ms, the easing curve .22 1 .36 1, font family names, the warmth formula, and every screen contract.

### What each platform expresses its own way

Same intent, different mechanism:

| Rule | Web (PWA) | Native (Expo) |
| --- | --- | --- |
| Fluid type | clamp(min, vw, max) | clamp(min, width*vw/100, max) helper |
| Fluid gutter | clamp on {gutter} | same helper on width |
| Text scaling | rem, respects Dynamic Type | dp, allowFontScaling stays true |
| Card grid | auto-fill minmax({grid_min}, 1fr) | FlatList numColumns from width and {grid_min} |
| Tap floor 44 | min-height plus pseudo hit area | minHeight plus hitSlop |
| Reduced motion | prefers-reduced-motion | AccessibilityInfo.isReduceMotionEnabled |
| Safe areas | env(safe-area-inset-*) | useSafeAreaInsets |
| Sheets and scrim | CSS transform and opacity | bottom-sheet, same duration and easing |

### Two helpers, named the same on both platforms

```
// fluid type and spacing: same three inputs, same result at the same width
// web returns a CSS string
fluid(min, vw, max)        => `clamp(${min/16}rem, ${vw}vw, ${max/16}rem)`
// native returns a number for the current width
fluid(min, vw, max, width) => Math.min(max, Math.max(min, width * vw / 100))

// card columns: a card never renders below grid_min on either platform
cardColumns(width) => Math.max(1, Math.floor((width - 2*gutter + gridGap) / (gridMin + gridGap)))
```

### Naming

Source token keys are canonical and camelCase. The compiler emits kebab-case CSS custom properties and camelCase JS theme keys from those same keys. greenDeep becomes --green-deep in CSS and stays greenDeep in JS. The handoff and the inventory write the same tokens in snake_case for reading, for example green_deep. Three spellings, one token. Trace any of them back to `soda.tokens.json`.

### Why the contracts transfer for free

The deep reason this is seamless: the server writes JSON, the client renders it. A screen contract is platform neutral already. The web client and the native client render the same contract the same way. Build new screens as contracts, not as one-off layouts, and the native version is a rendering target rather than a rewrite.

### Parity checklist (ship gate for the real app)

- No value is typed twice. Every color, size, and duration traces to `soda.tokens.json`.
- A screen contract renders the same on web and native from the same JSON.
- The same component name means the same thing on both platforms.
- Fluid type and fluid gutter match at the same screen width on both.
- The grid drops to one column at the same width on both.
- Reduced motion and safe areas are handled on both.
- Fonts load from the same family names on both, through next/font on web and expo-font on native.

---

## 10. Amending the rules

Rules change. A design system that cannot change is broken. The job is to make a change flow from one place to everywhere, so it never becomes a drift. Amend the rules, do not abandon them. Treat this file like a constitution with amendments: the document is meant to be changed, and every change is dated, reasoned, and applied through the pipeline.

### Where a change enters

- A value (color, size, radius, duration): edit `soda.tokens.json` and recompile to web and native.
- A behavior or contract (a flow, a face rule, a gate, a screen): edit this rules file and the relevant screen contract.
- Never edit a built screen and stop there. If the source did not hear about it, it is drift.

### How to amend (four steps)

1. Make the change at the source.
2. Bump the version. Patch for a value tweak, minor for a new rule or token, major for a change that breaks an existing contract.
3. Write one line in the amendment log below: date, what moved, why.
4. Recompile and run the parity gate in Section 9.

### Locked or tunable (the register)

Two classes. Locked rules encode what SODA is, so changing one changes the product. Amend a locked rule with a real decision and a minor or major version. Tunable rules are preferences, so adjust them freely with a patch.

Locked:
- dark only
- server writes JSON, client renders
- one shared state object and the persistence chain
- the two-call gate, every intro and send is gated
- {me_face_has_no_chips}
- {grid_uses_tabs_list_uses_clean}
- added connections route to people until Equalpoint is named
- warmth shows as language, never a number
- color usage semantics: green interactive and confirm, purple match, amber cooling, gold achievement
- 44px tap floor, it may rise, it never falls
- the auto-fill grid mechanism, truncation min-width 0, reduced motion, safe areas
- single source of truth, no value typed twice
- writing voice: no em dashes, declarative, active, no arrow glyphs in buttons

Tunable:
- the exact palette hex values, as long as the usage roles hold
- the type scale sizes and each fluid min, vw, max
- the spacing scale and the gutter min, vw, max
- the radius ladder
- motion durations and easing
- grid_min and grid gap values
- the warmth decay constant
- the intro tones and opener templates
- the prototype build convention, which changes for production anyway

### Planned amendments (known, not yet made)

- Flip the add-connection destination from people to equalpoint when the platform ships. One field.
- Choose the production topology: Expo with React Native Web sharing components, or Next.js plus Expo sharing the token and contract layer.

### Amendment log

- 1.0.0, 2026-06-26. Baseline. Tokens, house rules, screen contracts, and the mobile floor established from the Live-Fire build. Responsive layer added: tapMin 44, gridMin 150, fluid gutter and fluid type.
- 1.1.0, 2026-06-26. Grid system. Spacing snapped to a 4px base grid. Type set to a base 16 minor third 1.2 scale in rem with leading locked to the baseline and tracking in em. Radius snapped to the 8 12 16 20 24 ladder. Fluid clamp type retired for fixed rem sizes so text sits on the baseline. Build refactored to read these as CSS variables. Fixed a chip bug where label and focus collided.

---

## 11. Checkpoints and rollback

Adaptation needs an undo. A checkpoint freezes the design-system source as a known-good state, and rollback restores it. Rollback is non-destructive: it snapshots the current state first, so you can always come forward again.

The command is `soda-checkpoint.sh`. It tracks the token source, this rules file, the inventory, the handoff, and the Live-Fire build.

```
./soda-checkpoint.sh checkpoint "<label>"   save the current state
./soda-checkpoint.sh list                   show all checkpoints
./soda-checkpoint.sh diff <id>              what changed since a checkpoint
./soda-checkpoint.sh rollback <id>          restore a checkpoint, current state snapshotted first
./soda-checkpoint.sh current                show token version and tracked files
```

Discipline:
- Checkpoint before any amendment to a locked rule, and before a token version bump.
- A rollback is itself an amendment. Log it in Section 10 with the reason.
- The version in `soda.tokens.json` and the checkpoint are two halves of one record. The version names the state, the checkpoint holds it.

In a git repo, the same idea is a tag:
```
git add -A && git commit -m "v1.1.0 reason" && git tag soda-v1.1.0
git checkout soda-v1.0.0 -- soda.tokens.json   restore one file from a tag
```
Use the script for a quick local snapshot or when you are not in a repo. Use tags for shared, permanent history.

Chat commands (for an agent or Claude Code, mobile friendly):
- "Checkpoint the design system as <label>."
- "Show design checkpoints."
- "What changed since <label>."
- "Roll back the design system to <label>, then log the reason."
