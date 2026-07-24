# Component States
## God Made Weapon | Aniya UX/UI Team
## Every interactive component must have every applicable state defined before handoff to Ghost.

---

## State Definitions

| State | Trigger | Visual Signal |
|-------|---------|---------------|
| Default | Component rendered, no interaction | Base token colors. No elevation change. |
| Hover | Cursor over (desktop only) | Subtle background tint. 100ms opacity transition. |
| Active / Pressed | Touch or click held down | Scale 0.97 (TAP_FEEDBACK). Color darkens 10%. |
| Focus | Tab or programmatic focus | 2px ring, FL-Green token. Visible for keyboard users. |
| Loading | Async operation in progress | SkeletonLoader replaces content. No spinner. |
| Empty | No data to display | Empty state illustration + action prompt. |
| Error | Operation failed | System red token. Inline error message. No animation. |
| Success | Operation completed | FL-Green token. Brief (150ms opacity reveal) confirmation. |
| Disabled | Action not available | Opacity 0.4. Pointer-events none. No hover or active state. |

---

## Component State Matrix

### Button (Primary)
- Default: FL-Green fill, white label, Body Strong
- Hover: FL-Green-700 fill (10% darker)
- Active: Scale 0.97, FL-Green-800 fill
- Focus: 2px FL-Green ring, 2px offset
- Loading: Spinner replaced by SkeletonLoader shimmer within button bounds
- Disabled: Opacity 0.4, cursor not-allowed
- Never: Destructive style. Red fill never appears on primary button.

### Button (Ghost / Secondary)
- Default: Transparent fill, FL-Green border 1.5px, FL-Green label
- Hover: FL-Green-50 fill (5% tint)
- Active: Scale 0.97, FL-Green-100 fill
- Focus: 2px FL-Green ring
- Disabled: Opacity 0.4

### Button (Destructive)
- Default: System red fill, white label
- Hover: System red-700 fill
- Active: Scale NOT applied — destructive actions do not get TAP_FEEDBACK
- Focus: 2px system red ring
- Disabled: Opacity 0.4
- Never: FL-Green anywhere on destructive button.

### Card (Connection Card)
- Default: Canvas white, 1px border FL-Gray-200, 8px border-radius
- Hover: Box shadow elevation-1 (desktop only)
- Active: Scale 0.99 on press
- Focus: 2px FL-Green ring on container
- Loading: SkeletonLoader. Three shimmer rows. Avatar placeholder.
- Empty: Not applicable — card only exists when connection exists.
- Error: Error state banner at top of card. Red token, inline text.
- Disabled: Not applicable.

### Input (Text)
- Default: 1px border FL-Gray-300, white fill, placeholder text FL-Gray-400
- Focus: 2px FL-Green border, shadow-sm
- Error: 2px system red border, error message below input, red icon
- Disabled: FL-Gray-100 fill, FL-Gray-300 text, cursor not-allowed
- Success: 2px FL-Green border, check icon. Transient — removes after 2s.
- Never: Red fill on input. Border color communicates error, not background.

### List Item (Connection List)
- Default: Canvas white, no border, 16px padding
- Hover: FL-Gray-50 background
- Active: Scale 0.99, FL-Gray-100 background
- Focus: 2px FL-Green left border
- Loading: SkeletonLoader row. Avatar shimmer + two text rows shimmer.
- Empty: Full list empty state (see Empty States below).
- Disabled: Not applicable.

### Navigation Tab
- Default: FL-Gray-400 icon + label
- Active (selected): FL-Green icon + label, 2px FL-Green underline
- Focus: 2px FL-Green ring
- Never: Animate tab switching with scale or slide. Opacity transition only, 150ms.

### Toggle / Switch
- Default off: FL-Gray-300 track, white thumb
- Default on: FL-Green track, white thumb
- Active: Scale 0.97 on thumb press, 80ms
- Focus: 2px FL-Green ring on container
- Disabled: Opacity 0.4

---

## Empty States

Every list and data surface has an empty state. It is designed alongside the populated state.

Empty state structure:
1. Illustration (if applicable — never required)
2. Primary message: what is empty, in plain language
3. Secondary message: why it might be empty or what to do
4. Optional CTA: only if there is a clear next action

Tone: SODA is a warmth tool. Empty states are encouraging, not system-speak.
Example: "No connections yet. Scan a QR code to add your first." Not "No records found."

---

## SkeletonLoader Patterns

SkeletonLoader is the only loading pattern permitted in SODA. No spinners.

| Surface | SkeletonLoader shape |
|---------|---------------------|
| Connection card | Avatar circle (40px) + 2 text rows |
| List item | Avatar circle (32px) + 2 text rows |
| Screen | Full-width rows matching approximate content layout |
| Draft text | Single full-width row, 70% width second row |
| Stats / counts | Circle or small rectangle matching the number display |

SkeletonLoader uses shimmer animation: background gradient sweeps left to right, 1.2s duration, loops while loading.
Reveal: SKELETON_REVEAL from motion-library.md. Staggered 50ms per element.
