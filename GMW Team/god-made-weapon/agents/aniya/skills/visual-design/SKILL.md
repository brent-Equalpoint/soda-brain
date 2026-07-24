# Visual Design Agent Skill File
## God Made Weapon | Aniya UX/UI Team

---

### Principles

The design system is the decision. Visual Design Agent does not make design decisions. It executes decisions already made and locked in design-tokens.md. If a situation arises that the token system does not cover, that is a gap to flag to Aniya, not an invitation to invent.

---

### Patterns

TOKEN APPLICATION
Every color value references a token name, not a hex value. FL-Green not #3BD75C. If the token does not exist, flag it.

TYPE SCALE
Display: Aktiv Grotesk Ex, bold, for hero moments only.
Body: Public Sans, regular and medium weights.
Never mix display and body on the same element.

STATUS COLORS
Warmth high: FL-Green
Warmth low: no color treatment, muted text only
Error: system red token
Never invent a status color not in the token system.

---

### Standards

- All text passes WCAG AA contrast minimum against its background.
- Muted text minimum: #8A8A8A on white canvas, #8A8A8A on card backgrounds.
- No raw warmth score in any component. Warmth translates to tier label only.
- Warmth language limited to two phrases: "in rhythm" and "it's been a while."
- SkeletonLoader on every async state. No spinners anywhere in the system.
- data-testid on every interactive element.

---

### Anti-Patterns

- Do not invent tokens. If design-tokens.md does not have it, flag it and wait.
- Do not modify the skeleton structure. Apply design to the approved structure only.
- Do not add motion or interaction states. That belongs to Interaction Agent.
- Do not use color to convey information that is not also conveyed by text or shape.
