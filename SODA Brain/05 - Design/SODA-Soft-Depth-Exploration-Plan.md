# SODA Soft Depth — Neumorphism Exploration Plan

> **DIRECTION CHOSEN (2026-07-10), three rounds in:**
> **Glass Only + expressive CTAs.** Lab 01 (Soft Depth): "a little heavy." Lab 02 (Glass &
> Metal): "clean," but drop the metal. Lab 03 (Glass Only) + button round: **"C springy shine
> is a nice touch especially for big CTAs."**
>
> The locked recipe:
> - **Skin:** the shipped minimal base untouched; ONE material — frosted glass — only on
>   things that float over the room (headers, sheets, toasts, selected-state pills, the home
>   hero's code card), over restrained green ambient auras.
> - **Motion, tiered by size and frequency** (the hub's frequent-action rule): big hero CTAs
>   get **C** (instant press, springy overshoot release, shine sweep + green bloom on hover);
>   standard buttons get **B** (springy, no shine); high-frequency controls (chips during
>   onboarding, list rows) stay subtle — a thing pressed fifty times a night must never
>   perform.
>
> **Next: Phase 1 on real screens, behind the branch preview, pending Brent's go** — the
> attendee /home hero (glass code card + C-grade CTA) and the room header going frosted.
> Phase 2: room chrome (toasts, sheets, selected chips). Phase 3: the Admin question (crisp
> vs glass) stays open.

> **ROUND 2 (2026-07-10):** Brent's read on Lab 01: "a little heavy." New brief:
> "skeuomorphism minimal with glass/metal morphism infused in accents." Built as
> **Lab 02 — Glass & Metal** at `/design/glass` on the same branch (labs cross-link):
> the base stays EXACTLY the shipped flat system; GLASS only on floating chrome (frosted
> room header with content scrolling beneath, green-tinted selected chips, frosted toast,
> the home hero's glass code card); METAL only in machined accents (brushed 1px rims,
> watch-bezel avatar rings, steel-thumb toggle, a gloss on the green primary). Jewelry,
> not wallpaper. Note: glass panels need SOMETHING behind them to blur, so restrained
> green ambient auras enter the vocabulary — the one real token addition this direction
> asks for. If Lab 02 lands, the phased path in §6 applies the same way (Phase 0 becomes
> "where may auras live" instead of the canvas lift). Everything below is the Lab 01
> (Soft Depth) analysis, kept for the record.

**Status:** EXPLORATION. Nothing here is decided or shipped. A living demo exists on the
`neumorphism-exploration` branch at `/design/soft` (open the branch's Vercel preview and add
`/design/soft` to the address). Sources: classic neumorphism, adapted dark; the design ideas
in Emil Kowalski's skills hub (github.com/emilkowalski/skills — four skills: design
engineering craft, animation review rules, animation vocabulary, Apple design principles).

---

## 1. What neumorphism is, in one paragraph

Interfaces where controls look soft-molded out of the surface itself — a button looks like a
key gently pushed up out of the material, a text field looks like a well carved into it. It's
done with paired soft shadows (a light one and a dark one) instead of borders and flat fills.
It photographs beautifully and feels physical and calm. Its known weakness: taken literally,
everything goes low-contrast and mushy, and users can't tell what's pressable.

## 2. The honest tension with SODA's locked system

SODA's design system is deliberately FLAT: near-black, hairline borders, no gradients, no
shadows except floating layers, one green doing all the talking. Classic neumorphism
contradicts that on purpose. So this exploration is NOT "apply neumorphism" — it's a hybrid
we're calling **Soft Depth**:

- **Keep** every color token, the one-green rule, the type system, all copy and layout.
- **Change only the elevation language**: hairline borders on interactive things become soft
  extrusion; inputs and selected states become carved-in wells.
- **The tastefulness rule (from the Apple-design skill):** depth encodes function — material
  weight means something. Pressable = raised. Receiving = inset. Structural containers stay
  quiet. If a thing isn't interactive, it doesn't get depth. This single rule is what keeps
  Soft Depth from becoming the mushy embossed-everything look that killed neumorphism 1.0.

Dark neumorphism needs the canvas ONE step above near-black (the demo uses #1a1c1a instead of
#111) so both shadow directions read. That's the biggest real cost: a token change to the
ground color, which touches everything and needs its own contrast re-check.

## 3. What the skills hub contributes (already applied in the demo)

From **emil-design-eng** (motion craft):
- Press feedback: every pressable scales to 0.97 on press, 100–160ms — "the UI is truly
  listening."
- Easing: entries ease-out, never ease-in; nothing over 300ms; animate only transform/opacity.
- Entries never start from nothing: scale 0.98 + fade, staggered 40ms per card.
- Hover effects gated to devices that actually hover; reduced-motion respected (SODA already
  does this globally).

From **apple-design**:
- "Material weight encodes function" → our depth-equals-affordance rule.
- "Dim to focus, separate to keep flow" → modals keep their scrim; parallel panels don't.
- Springs for draggable things (sheets, the wall) — a Phase 2+ idea, pairs naturally with the
  soft look.

The other two skills (review-animations, animation-vocabulary) are process tools: a checklist
for judging any animation we add, and shared language for briefing design work. Worth
vendoring all four into the repo's `.claude/skills/` so every future design session uses them.

## 4. What's in the demo (see it first, then read on)

`/design/soft` on the branch preview:
- Side by side, same parts: buttons, event-code input, chips, stat card, person card — the
  shipped flat skin on the left, Soft Depth on the right.
- The Soft Depth recipes: raised key (button), carved well (input), selected chip pressed INTO
  the surface with a green ember glow, raised cards that lift on hover, an inset-track toggle
  with a raised thumb that fills green.
- A phone-frame mock of the home hero in the soft skin.
- All micro-interactions live — press things.

## 5. Accessibility guardrails (non-negotiable if this goes anywhere)

- Text colors and sizes unchanged — contrast ratios stay exactly as audited.
- State never rides on shadow alone: selected still turns GREEN, focus still draws the green
  ring, status still uses the color-per-job system. Shadows are texture, not information.
- Focus-visible rings on every soft control (the demo keeps the green ring on inputs).
- Press/hover effects are transform/opacity only, gated and reduced-motion-safe.

## 6. If we like it: the phased path

**Phase 0 — decide the ground.** The one real decision: lift the canvas token a step
(#111 → ~#1a1c1a) app-wide, or keep the canvas and run Soft Depth only inside cards/sheets
(smaller, safer, less dramatic). Everything else waits on this.

**Phase 1 — attendee touch surfaces (highest feel-per-effort).** Chips (the onboarding card
builder is SODA's most-touched surface), primary/ghost buttons, the event-code well, toggles.
One shipped screen behind a preview: the /home hero.

**Phase 2 — the room.** Roster cards, notes/chat sheets (spring-driven per the hub), act
overlays. This is where soft depth + springs could make the night feel physical.

**Phase 3 — decide about Admin.** The admin has its own signed-off spec (STYLE-SPEC.md,
"cards are flat" is written into it). Either Admin stays flat as the pro back-office
counterpart (a legitimate two-voice system: soft for guests, crisp for operators), or the
ADMIN spec gets a v2. Not a code decision — a design decision with the vault as source of
truth.

**Each phase gates on Brent looking at a preview.** No phase merges without it.

## 7. Effort, roughly

- Demo (done): a day's fraction — it exists now.
- Phase 1: a focused day — new elevation tokens + restyling ~6 components + one screen,
  verified at all breakpoints.
- Phase 2: two to three days, because sheets/springs involve motion work worth doing properly.
- Phase 3: zero to a design-cycle, depending on the Admin decision.

## 8. Open questions for Brent

1. Gut reaction to `/design/soft` — does the soft skin feel MORE like SODA's "name tag that
   knows you showed up," or less?
2. Canvas lift: full-app soft ground, or soft-inside-cards only?
3. Two-voice question: should Admin stay crisp/flat even if the attendee app goes soft?
4. Vendor the four skills into the repo so all future design work follows the hub's rules?
