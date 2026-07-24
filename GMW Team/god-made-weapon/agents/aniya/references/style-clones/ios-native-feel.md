# iOS Native Feel Motion Language
## God Made Weapon | Aniya UX/UI Team
## Use when replicating iOS-native navigation and interaction patterns.

---

## Character

iOS native feel prioritizes physical metaphor. Screens feel like they are in a stack that you move through. Gestures feel continuous and responsive. The system responds the instant you touch it — delay is invisible. This language is appropriate for navigation-heavy flows where the user expects physical continuity.

---

## Core Properties

| Property | Value |
|----------|-------|
| Navigation easing | cubic-bezier(0.25, 0.46, 0.45, 0.94) — iOS spring approximation |
| Duration | 350ms for navigation, 200ms for interaction |
| Primary axis | X (horizontal stack navigation) |
| Interruptible | Yes — navigation transitions respond to gesture velocity |
| Scale use | Minimal. Tab icon tap: scale 1.0 → 1.2 → 1.0, 120ms. |

---

## Patterns

### Push Navigation (tap to deeper screen)
- New screen: Slides in from right (translateX 100% → 0). 350ms iOS spring.
- Current screen: Translates left (-30%). Opacity 0.85. Simultaneous.
- Back button: Chevron left. Fade in with screen, fade out with exit.

### Pop Navigation (back gesture or back tap)
- Current screen: Slides right to exit (translateX 0 → 100%). 350ms iOS spring.
- Previous screen: Returns from -30% to 0. Opacity 0.85 → 1. Simultaneous.

### Swipe-to-dismiss
- Gesture tracks finger position 1:1. No easing during active gesture.
- Complete (> 50% or high velocity): Pop animation at gesture velocity + spring settle.
- Cancel (< 50%): Spring back to origin, 300ms.

### Sheet (modal)
- Present: Slide up from bottom. 400ms spring (slight overshoot: 2–4px, returns).
- Dismiss: Slide down. 300ms ease-in.
- Pull-to-dismiss: Tracks gesture 1:1. Same complete/cancel logic as swipe-to-dismiss.

### Tap Response
- Tap: Immediate background highlight (FL-Gray-100). No delay. 50ms.
- Release: Background fades out, 200ms.
- Long press: Scale 0.95 after 300ms hold. Spring back on release.

---

## When to Use

Use iOS native feel when:
- Building flows where the user expects iOS navigation conventions (back swipe, stacked screens).
- The flow has 3+ levels of navigation depth.
- The design references Maps, Contacts, or Settings as an inspiration.

Do not use when:
- The screen is a one-level dashboard (use Equalpoint Signature).
- The flow is primarily scrolling content with minimal navigation (use Equalpoint Signature).
