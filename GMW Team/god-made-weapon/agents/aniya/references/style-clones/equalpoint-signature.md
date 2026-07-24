# Equalpoint Signature Motion Language
## God Made Weapon | Aniya UX/UI Team
## Default motion language for all SODA screens.

---

## Character

Equalpoint motion is purposeful and quiet. Nothing calls attention to itself. Transitions tell the user where they are in the app — what opened, what closed, what changed — without performing. The motion is confident, not decorative.

---

## Core Properties

| Property | Value |
|----------|-------|
| Page transition easing | cubic-bezier(0.4, 0, 0.2, 1) — smooth ease-in-out |
| Element easing (within screen) | cubic-bezier(0.0, 0.0, 0.2, 1) — ease-out |
| Duration floor | 150ms |
| Duration ceiling | 400ms |
| Page transition duration | 320–400ms |
| Primary axis | X (horizontal page nav), Y (modal/sheet), opacity always |
| Scale use | Tap feedback only (0.97). Never for enter/exit. |
| Bounce | Never. |
| Feel | Relaxed. Enjoyable. The user notices the smoothness, not the motion. |

---

## Signature Patterns

### Screen Transitions

**Curve for all page navigation: cubic-bezier(0.4, 0, 0.2, 1) — smooth ease-in-out. Not bouncy. Relaxed.**

- Push forward: New screen slides in from right (24px offset), eases to rest. Old screen recedes left at 60% opacity. Both move simultaneously. 360ms.
- Back: Current screen eases out to right. Previous screen eases back from -16px to full position. 320–340ms.
- All page transitions use the same curve in both directions — the motion feels balanced whether going forward or back.

### Modal and Sheet Entry
- Enter: Drifts up from 16px below + opacity 0 → full. 340ms cubic-bezier(0.45, 0.05, 0.55, 0.95). Smooth ease-in-out. No snap, no bounce.
- Dismiss: Drifts down to 16px + opacity → 0. 280ms same curve.
- Backdrop: Opacity 0 → 0.5 on enter, 0.5 → 0 on dismiss. Same duration as sheet.

### Content Reveal
- SkeletonLoader → content: SKELETON_REVEAL. 150ms per element, 50ms stagger.
- Inline state change (warmth tier update): Opacity crossfade. 150ms.
- List item appearance: Fade in. 150ms. 30ms stagger per item.

### Feedback
- Tap: Scale 0.97 → 1.0, 80ms ease-out. On all interactive elements except destructive actions.
- Success confirmation: Opacity flash (full → 80% → full), 150ms. One cycle only.
- Error: No animation. Immediate. Static red.

---

## What Makes It Equalpoint

The app handles relationships. The motion reflects that: nothing is abrupt, nothing is frivolous. A transition that takes 200ms is a quiet breath, not a dramatic reveal. Motion says "this changed" and then gets out of the way so the person can focus on their connections.
