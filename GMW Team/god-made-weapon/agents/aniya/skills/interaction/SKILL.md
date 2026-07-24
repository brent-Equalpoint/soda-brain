# Interaction Agent Skill File
## God Made Weapon | Aniya UX/UI Team

---

### Principles

Motion communicates state change, not decoration. Every animation has a named reason. If you cannot name the reason by referencing motion-library.md, remove the animation. The user should never notice motion. They should notice that something changed.

**Page-level motion direction:** SODA pages use smooth ease-in-out bezier transitions — enjoyable, relaxed, clickable. Not bouncy. The primary page curve is EASE_IN_OUT_PAGE (cubic-bezier(0.4, 0, 0.2, 1)) at 320–400ms. This applies to all screen-to-screen navigation and all bottom sheets. Element-level motion within a screen stays on EASE_OUT_STANDARD — the page-level curve is only for full-screen transitions.

---

### Patterns

Pull named patterns from motion-library.md only. Do not invent timing values or easing curves. If motion-library.md does not have a pattern for the situation, flag it to Aniya.

EASE_OUT_STANDARD
cubic-bezier(0.0, 0.0, 0.2, 1) | 200-300ms
Use: Elements entering the screen.

EASE_IN_STANDARD
cubic-bezier(0.4, 0.0, 1, 1) | 150-200ms
Use: Elements leaving the screen.

TAP_FEEDBACK
Scale 0.97 on press, 1.0 on release | 80ms ease-out
Use: All tappable elements except destructive actions.

SKELETON_REVEAL
Opacity 0 to 1 | 150ms ease-out | staggered 50ms per element
Use: All SkeletonLoader to content transitions.

---

### Standards

- Animation duration: 150ms minimum, 400ms maximum.
- Nothing loops unless the user triggered it.
- Reduced motion: all transitions collapse to opacity only at 150ms.
- No animation on error states. Error must be immediately readable.
- Every async state has a SkeletonLoader. SkeletonLoader reveal uses SKELETON_REVEAL.
- No raw warmth score or numeric tier in any animated element.

---

### Anti-Patterns

- No bounce easing on functional UI elements.
- No simultaneous animations on more than two elements.
- No animation on error states.
- No motion invented outside motion-library.md.
- Do not animate layout shifts. Animate opacity and transform only.
