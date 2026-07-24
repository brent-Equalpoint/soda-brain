# Linear Motion Language
## God Made Weapon | Aniya UX/UI Team
## Use for productivity UI, list management, and task-oriented flows.

---

## Character

Linear motion is fast, precise, and unemotional. The interface gets out of the way immediately. Every transition is shorter than you think it should be — because the tool is built for people who are working, not watching. Nothing overstays. Nothing decorates. Everything communicates status.

---

## Core Properties

| Property | Value |
|----------|-------|
| Default easing | cubic-bezier(0.16, 1, 0.3, 1) — fast start, smooth settle |
| Duration | 120ms for micro-interactions, 200ms max for state changes |
| Primary axis | Opacity + subtle Y (4px max offset) |
| Scale use | Never for enter/exit. Tap feedback only (0.98 — barely perceptible). |
| Bounce | Never. |
| Color transitions | Immediate. No cross-fade on status colors. |

---

## Patterns

### Item Status Change (e.g. task complete, draft approved)
- Color: Immediate. No transition. The change is the signal.
- Checkmark or icon: Opacity 0 → 1. 120ms ease-out.
- Text: Strikethrough draws in left to right. 150ms linear.
- Row: No scale, no movement.

### List Reorder
- Dragging item: Elevation shadow appears immediately on lift (no animation).
- Destination placeholder: Height animates open in 120ms ease-out.
- Drop: Shadow disappears immediately. Item settles with 120ms ease-out on Y position.

### Screen Entry
- Opacity 0 → 1. Y: 4px → 0. 180ms ease-out.
- List items stagger: 15ms per item (faster than Equalpoint Signature).

### Empty → Populated
- New items: Fade in. 120ms. 15ms stagger.
- Count update: Number cross-fades. 80ms.

### Panel / Sidebar Entry (desktop)
- Slides in from left. 200ms cubic-bezier(0.16, 1, 0.3, 1).
- Content inside fades in with 50ms delay after panel settles.

### Tooltip / Popover
- Opacity 0 → 1. 80ms. Scale 0.98 → 1 simultaneously.
- Dismiss: Opacity 1 → 0. 60ms. No scale change on exit.

---

## Status Indicator Behavior

Linear uses color state changes without transitions to signal status. This is intentional.

| Status change | Motion |
|--------------|--------|
| Open → In Progress | Dot color change: immediate |
| In Progress → Done | Dot color change: immediate. Checkmark fades in 120ms. |
| Any → Error | Red: immediate. No fade-in. Error cannot look gradual. |
| Priority change | Icon swap: 60ms opacity cross-fade |

---

## When to Use

Use Linear motion when:
- Building list management interfaces within SODA (if they arise).
- The task brief references Linear, Notion, or similar productivity tool aesthetics.
- The flow is task-oriented with clear state changes (e.g., draft approval queue, connection management batch actions).

Do not use for:
- Warmth and connection screens where the Equalpoint Signature language is required.
- Onboarding flows where a warmer feel is appropriate.
