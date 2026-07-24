# SODA — Design Precision System (Plan)

*The implementation plan for the "Precision and Cohesion" craft standard in the attendee build brief
(its section 7). It turns the philosophy (eye-led, grid as default, named corrections, one source of
truth) into a concrete, ENFORCEABLE codebase setup that holds web and native together, so a hundred
universal components feel cut from one block. For later: this is the deep dive on the token + precision
foundation of [[SODA-Universal-Build-Master-Plan]] (its Phase 0 and Phase 2). Created 2026-06-29. No
code yet.*

---

## The goal in one line
Make drift structurally impossible, keep the eye as the final authority, and verify both ways (by machine
AND by eye), so precision and optics hold together without rigidity.

## 1. The token model: three tiers + an optical namespace
Today the tokens are a flat set. Tighten to tiers so a component can only reach the right layer:

- **Tier 1 — primitives** (raw values): the palette hexes, the spacing numbers, the radius ladder, the
  type scale. Ground truth. **Components never touch these directly.**
- **Tier 2 — semantic** (roles): `accent` (= green), `surface-1/2`, `text` / `muted` / `hint`,
  `space-stack`, `radius-card`, `border-hairline`, the warmth colors. **This is the only layer components
  read.** Re-skinning a brand color is a one-line change here, and every component follows.
- **Tier 3 — component** (only when truly needed): a component that genuinely needs its own token gets one
  here, built from Tier 2.
- **The optical namespace** (first-class, beside Tier 2): every named optical correction lives here, e.g.
  `optical.icon-nudge`, `optical.baseline-shift-display`, `optical.shape-comp-avatar`, `optical.inset-fix`.
  **This is the only sanctioned way to break the grid.** A nudge that is not in this namespace is a
  one-off, and a one-off is drift.

Rule: **components reference Tier 2 + optical tokens only.** Primitives sit one layer down, by design.

## 2. One source, compiled to both platforms (kill web/native drift structurally)
`soda.tokens.json` is the source of truth; its own header already promises "compiles to web CSS + native
TS." Build that compiler:

- A compile step (Style Dictionary, or a small bespoke script) reads `soda.tokens.json` and EMITS two
  outputs: web CSS custom properties (the `@theme` block in `apps/web/app/globals.css`) and the native
  theme (`packages/ui/tokens.ts`, the Expo import).
- Both outputs are **generated, never hand-edited** (a `GENERATED, do not edit` header on each).
- The type-scale math that differs by platform lives in the compiler/helpers, so the platforms stay
  identical by construction: web uses rem + unitless leading + em tracking; native uses
  `fontSize = rem*16`, `lineHeight = round(size*leading)`, `letterSpacing = size*tracking`.
- Result: exactly one place to change a value, and web + native can never disagree.

## 3. The spacing grammar: a layout-primitive library (the single biggest cohesion lever)
Build a tiny universal layout kit (React Native primitives + NativeWind), and forbid outer margins on
components:

- `Stack` (vertical, gap from the space scale), `Row` (horizontal, gap), `Inset` (padding), `Divider`,
  `Spacer`; optionally `Grid` for the roster.
- A component owns its content to its own edge; the **container** owns the space around it.
- Every gap is a named scale value, so everything breathes the same. **Build this first** — it prevents
  the most common drift before it can start.

## 4. Enforcement: drift becomes a build failure (not a matter of discipline)
- An **adherence lint rule** fails when a raw hex, px, or rem literal appears anywhere outside the token
  source and the generated outputs. The Design System already ships an `_adherence.oxlintrc.json` — reuse
  and extend it.
- Wire the lint into the existing **CI** gate (`.github/workflows/ci.yml`, shipped 2026-06-29) so a PR
  with a raw value goes red. You literally cannot merge drift.
- Ramp: start in WARN mode while the kit is being built, flip to FAIL once the atoms are clean.

## 5. Verification: the eye and the machine
- **The gallery:** one route (or a Storybook-lite) that renders every atom and composite in every variant
  and state, grouped by STRICT vs EYE-LED. The eye scans it; drift jumps out. (The Design System folder
  already has gallery HTML — the instinct is there.)
- **Visual regression:** screenshot-diff the gallery in CI (Playwright snapshots) so an accidental visual
  change surfaces on the PR. (Already noted on the backlog as an idea.)
- **The parity pass:** each component placed beside its `SODA-Live-Fire.html` render, at real size, on a
  device, before it is "done."

## 6. Optical-rule governance (keep "feel" from becoming chaos)
- All optical corrections live in the optical namespace (section 1). A nudge not named there does not ship.
- Review check: a new optical rule must be **justified** (what it corrects) and **reusable** (it names the
  situation, not the instance). Used once and instance-specific = drift wearing a token's clothes.
- Anti-bloat: keep the token set lean. Too many tokens is false precision; the 4px grid plus a small set
  of optical rules beats hundreds of micro-tokens.

## 7. Strict vs eye-led, as metadata
Each component carries a `zone: 'strict' | 'eye-led'` tag. The gallery groups by it; review applies the
right rigor (no eye-led exceptions inside a repeating strict set; harmony beats grid-purity in the eye-led
moments). This makes the brief's section 7.6 operational.

## 8. Phasing (plugs into the universal build)
- **Phase 0** (with the universal build's Phase 0): stand up `soda.tokens.json` to the compiler to web CSS
  + native `tokens.ts`; refactor to the three-tier + optical model; build the layout primitives; wire the
  adherence lint into CI in warn mode.
- **Phase 1:** build the atoms against Tier 2 + optical tokens; stand up the gallery; flip the lint to
  fail.
- **Phase 2:** build the composites; add visual-regression snapshots to CI; run parity passes against
  Live-Fire.
- **Ongoing:** optical-rule governance in PR review; keep the set lean.

## What it touches
`soda.tokens.json` (source) to a new compiler/script to `apps/web/app/globals.css` (`@theme`, generated)
+ `packages/ui/tokens.ts` (generated, the canonical native theme per [[SODA-Native-Ready-Architecture]]);
a new universal layout-primitive package; the adherence lint config + `.github/workflows/ci.yml`; a new
gallery route + Playwright snapshot tests.

## Decisions for you (the forks)
1. **Compiler:** Style Dictionary (battle-tested, more setup) vs a small bespoke script (less to learn,
   fits the stack). Recommended: a small script first; Style Dictionary if it grows.
2. **Lint engine:** extend the existing `_adherence.oxlintrc.json` (oxlint) vs a fresh eslint rule.
   Recommended: reuse the oxlint adherence config that already exists.
3. **Gallery:** a plain in-app route vs Storybook. Recommended: a plain route first (zero new infra),
   Storybook later if the kit gets large.
4. **Lint ramp:** how long in warn before fail. Recommended: warn until the atoms are clean, then fail.

## How it connects
This is the enforceable foundation under [[SODA-Universal-Build-Master-Plan]] (its Phase 0 + Phase 2) and
the implementation of the brief's section 7. It makes [[SODA-Native-Ready-Architecture]] rule 4 (tokens as
the source of truth) real and stays native-ready (one source, two compiled targets). Visual law reference:
the brief (`SODA-Attendee-Universal-Build-Brief.md`, sections 3 and 7) and `soda.tokens.json`.
