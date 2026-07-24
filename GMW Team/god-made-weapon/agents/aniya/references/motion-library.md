# Motion Library
## God Made Weapon | Aniya UX/UI Team
## Living document — expand as new patterns are established.

---

## Named Easing Curves

| Name | Curve | Duration | Use |
|------|-------|----------|-----|
| EASE_IN_OUT_PAGE | cubic-bezier(0.4, 0, 0.2, 1) | 320–400ms | **Page and screen transitions. Primary curve.** |
| EASE_IN_OUT_SMOOTH | cubic-bezier(0.45, 0.05, 0.55, 0.95) | 260–320ms | Modals, drawers, panels entering or leaving |
| EASE_OUT_STANDARD | cubic-bezier(0.0, 0.0, 0.2, 1) | 200–280ms | Individual elements entering within a screen |
| EASE_IN_STANDARD | cubic-bezier(0.4, 0.0, 1, 1) | 150–200ms | Individual elements leaving within a screen |
| EASE_LINEAR | linear | 150–300ms | Continuous loaders only |

**Direction:** Page-level transitions use EASE_IN_OUT_PAGE — smooth acceleration in, smooth deceleration out. Relaxed and enjoyable. Not bouncy. The curve has equal ease-in and ease-out so the motion feels balanced in both directions. EASE_OUT_STANDARD is reserved for small elements populating inside an already-visible screen.

---

## Interaction Patterns

### TAP_FEEDBACK
```
transform: scale(0.97) on press
transform: scale(1.0) on release
duration: 80ms
easing: ease-out
use: All tappable elements except destructive actions.
never: Apply to destructive confirm buttons — they must not feel playful.
```

### SKELETON_REVEAL
```
opacity: 0 → 1
duration: 150ms
easing: EASE_OUT_STANDARD
stagger: 50ms per element (top to bottom)
use: Every SkeletonLoader → content transition.
never: Skip the stagger. It reads as loading, not as a flash.
```

### SCREEN_ENTER
```
opacity: 0 → 1, translateX: 24px → 0
duration: 360ms
easing: EASE_IN_OUT_PAGE — cubic-bezier(0.4, 0, 0.2, 1)
use: New screen entering on navigation push. Slides in from right.
feel: Relaxed. The screen arrives with a sense of weight — not instant, not bouncy.
```

### SCREEN_EXIT
```
opacity: 1 → 0.6, translateX: 0 → -16px
duration: 320ms
easing: EASE_IN_OUT_PAGE — cubic-bezier(0.4, 0, 0.2, 1)
use: Screen leaving on navigation push (recedes to left at reduced opacity).
```

### SCREEN_BACK_ENTER
```
opacity: 0.6 → 1, translateX: -16px → 0
duration: 340ms
easing: EASE_IN_OUT_PAGE — cubic-bezier(0.4, 0, 0.2, 1)
use: Previous screen returning on back navigation.
```

### SCREEN_BACK_EXIT
```
opacity: 1 → 0, translateX: 0 → 24px
duration: 300ms
easing: EASE_IN_OUT_PAGE — cubic-bezier(0.4, 0, 0.2, 1)
use: Current screen leaving on back navigation (slides out to right).
```

### MODAL_ENTER
```
opacity: 0 → 1, translateY: 16px → 0
duration: 340ms
easing: EASE_IN_OUT_SMOOTH — cubic-bezier(0.45, 0.05, 0.55, 0.95)
use: Bottom sheets and modal overlays appearing.
feel: Drifts up smoothly. No snap. No bounce.
```

### MODAL_EXIT
```
opacity: 1 → 0, translateY: 0 → 16px
duration: 280ms
easing: EASE_IN_OUT_SMOOTH — cubic-bezier(0.45, 0.05, 0.55, 0.95)
use: Bottom sheets and modal overlays dismissing.
```

### LIST_ITEM_ENTER
```
opacity: 0 → 1
duration: 150ms
easing: EASE_OUT_STANDARD
stagger: 30ms per item
use: List populating after skeleton reveal.
```

---

## Style Clone References

Each style clone defines a named motion language for use in specific contexts.

| File | Motion Language | Context |
|------|----------------|---------|
| style-clones/equalpoint-signature.md | Equalpoint default motion | All SODA screens by default |
| style-clones/ios-native-feel.md | iOS native transitions | When replicating iOS navigation feel |
| style-clones/linear-motion.md | Linear app precision | Productivity UI, list management |

---

## Global Rules

- Duration floor: 150ms. Duration ceiling: 400ms.
- Nothing loops unless the user explicitly triggered the loop.
- Reduced motion: all transitions collapse to opacity-only at 150ms. No transform under prefers-reduced-motion.
- No animation on error states. Error must be immediately, instantly readable.
- No simultaneous animations on more than two elements.
- No bounce easing on functional UI.
- Animate opacity and transform only. Never animate layout properties (width, height, margin, padding).
