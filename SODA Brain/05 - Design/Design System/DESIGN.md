---
version: 0.1.0-proposal
name: SODA
description: >-
  Dark-native, near-monochrome identity for SODA, a live-events "room operating
  system." Near-black surfaces and almost no color, until one green does the
  talking. One color, one job.
colors:
  # Surfaces — dark, near-black, layered
  canvas: "#111111"
  deep-black: "#0a0b0a"
  card: "#1a1a1a"
  surface-2: "#222422"
  border: "#262826"
  border-strong: "#363936"
  # Green — interactive / present / alive (the only loud color)
  green: "#3bd75c"
  bright-green: "#5ff088"
  deep-green: "#203229"
  # Purple — private / for-you-only (the Nudge), always
  purple: "#a47bff"
  purple-surface: "#1c1726"
  # Status
  amber: "#f59e0b"
  pending: "#ffd23f"
  danger: "#ff5470"
  # Text
  off-white: "#f5f5f5"
  secondary: "#c8ccc8"
  muted: "#8a8a8a"
  faint: "#4a4d4a"
  # Identity — deterministic initials-avatar palette
  av-1: "#3bd75c"
  av-2: "#a47bff"
  av-3: "#f59e0b"
  av-4: "#5fb0f0"
  av-5: "#ff7ab0"
  av-6: "#5ff088"
  av-7: "#ffd23f"
  av-8: "#7c8cf0"
typography:
  display:
    fontFamily: Archivo Black
    fontSize: 1.75rem
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: -0.01em
  body:
    fontFamily: DM Sans
    fontSize: 1rem
    fontWeight: 300
    lineHeight: 1.5
  body-strong:
    fontFamily: DM Sans
    fontSize: 0.9375rem
    fontWeight: 600
    lineHeight: 1.4
  label-caps:
    fontFamily: DM Mono
    fontSize: 0.6875rem
    fontWeight: 500
    letterSpacing: 0.18em
rounded:
  tile: 8px
  control: 11px
  card: 14px
  panel: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  touch: 44px
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    height: 52px
  chip:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    height: 44px
  chip-selected:
    backgroundColor: "{colors.deep-green}"
    textColor: "{colors.green}"
    rounded: "{rounded.full}"
    height: 44px
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.control}"
    height: 48px
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
  nudge:
    backgroundColor: "{colors.purple-surface}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.card}"
---

# SODA — DESIGN.md

> **Proposal draft (not wired in).** This file codifies SODA's existing, shipped design system in the
> agent-readable `DESIGN.md` format, built directly from the real source of truth
> (`apps/web/app/globals.css`) and the locked brand rules. It is a proposal: **nothing in the live app,
> the repo, or any build tooling has been changed.** Activating it later means placing a copy at the repo
> root and optionally running the format's `lint` / `export`. Until then this is documentation.

## The idea in one line

Dark-native, near-monochrome. Almost everything is near-black until **one green does the talking.**
Restraint is the brand: color is rare, and when it appears it *means something*.

## Color discipline (one color, one job)

This is the most important rule for anyone (human or agent) building SODA UI:

- **Green** (`green` / `bright-green` / `deep-green`) = interactive, present, alive, confirming. The only
  loud color. If something is tappable or "on," it leans green.
- **Purple** (`purple` / `purple-surface`) = private, for-you-only. **Always** the Nudge and private
  follow-ups, never decoration.
- **Amber** (`amber`) = live timers and warmth decay, **only**.
- **Red** (`danger`) = errors, **only**. Nothing else is ever red.
- **Pending** (`pending`) = a "specified / pending" status.
- Everything else (`canvas`, `card`, `surface-2`, `border*`, `off-white`, `secondary`, `muted`, `faint`)
  is the neutral, near-black scaffold. Most of the screen lives here.

Soft translucent fills exist for gentle hovers and badges (`accent-soft`, `private-soft`,
`private-border`, `warn-soft`, `danger-soft`) and are used **sparingly**, no glassmorphism.

## Type system

- **display** = Archivo Black. UPPERCASE headlines and big stat numbers. **Never paragraphs.**
- **body** = DM Sans. All readable copy; body leans light (weight 300).
- **label-caps** = DM Mono. Eyebrows, labels, counts. **UPPERCASE and letter-spaced.**

## Shape

Semantic radii: `tile` (8px) small tags, `control` (11px) buttons/inputs, `card` (14px) standard card,
`panel` (16px) large container. Chips, pills, and avatars are **fully round** (`full`).

## Interaction & motion

- **Press = darken, never scale.** Buttons and tappable controls darken on press (about `brightness
  0.92`); they never grow or bounce. (Non-primary controls use the `tap-press` utility.)
- **Quick and calm.** Easing `cubic-bezier(0.4, 0, 0.2, 1)`; durations fast `0.15s`, base `0.3s`, slow
  `0.5s`. No bounce, no spinner theater, the branded loading mark "breathes" instead of spinning.
- **Reveals:** content fades + rises in; bottom sheets slide up; the wall fills as answers land.
- **Reduced motion is fully respected** (all motion collapses to near-instant under the OS setting).
- **Hard-won rule for agents:** entry-animation keyframes must **end on `transform: none`, never
  `translateY(0)`**. A lingering transform turns that element into the containing block for any
  `position: fixed` child, which traps modals/sheets below the fold instead of centering them on screen.

## Layout & surface

- **Flat system.** No glassmorphism. The only real shadow is the device frame, plus a soft shadow for
  modals/toasts.
- **Mobile-first PWA.** The app never scrolls sideways. Respect safe-area insets. Minimum tap target is
  **44px** (`spacing.touch`).

## Copy

**No em dashes** anywhere in UI copy. Use "to" for ranges and commas/periods otherwise.

## How an agent should use this file

Read it before building any SODA UI. Pull values by reference (`{colors.green}`, `{rounded.control}`,
`{typography.display}`). Obey the color-job discipline, the darken-not-scale press rule, and the
`transform: none` rule above. When in doubt, fewer colors and more near-black.

## Notes on fidelity

Colors, type families, radii, and motion are taken verbatim from `globals.css` (the source of truth).
The `components` block is codified from current usage and is the part most worth confirming or running
through the format's `lint` (it also checks WCAG contrast) before this is ever activated.
