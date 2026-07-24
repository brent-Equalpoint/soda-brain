# SODA Admin — Style Spec (match exactly)

Pin-level visual contract for the back-office surfaces. Reproduce these values verbatim when
re-housing `SODA Admin.dc.html`; do not restyle, approximate, or "improve". Values were lifted
from the prototype source. No em dashes in product copy.

---

## 1. Color tokens

```css
:root{
  --bg:#0c0e0c;        /* app canvas */
  --s1:#131613;        /* surface 1: cards, sidebar, rail */
  --s2:#191d19;        /* surface 2: inputs, inset fills, bar tracks */
  --s3:#212621;        /* surface 3: toast, neutral pill fill */
  --bd:#242a24;        /* hairline border, default */
  --bd2:#2f362f;       /* stronger border: modals, ghost buttons */
  --green:#3BD75C;     /* the signature accent */
  --dg:#203229;        /* dark green fill: active nav, event pill, avatar bg */
  --green-soft:rgba(59,215,92,.09);   /* soft green wash */
  --green-bd:rgba(59,215,92,.28);     /* green hairline / hover border */
  --t0:#f2f4f2;        /* primary text */
  --t1:#c6ccc6;        /* secondary text */
  --t2:#7c847c;        /* muted text, labels */
  --t3:#4a524a;        /* faint text, disabled */
  --amber:#F59E0B;  --amber-soft:rgba(245,158,11,.1);
  --red:#EF4444;    --red-soft:rgba(239,68,68,.1);
}
```

Fixed literals used alongside tokens:
- `#0D1F12` text on any green fill (never white, never pure black).
- Secondary accents (pills/acts only, never surfaces): blue `#60a5fa` + `rgba(96,165,250,.1)`,
  teal `#34d399` + `rgba(52,211,153,.1)`.
- Avatar identity colors (cycled): `#3bd75c #f59e0b #60a5fa #f472b6 #34d399 #fbbf24 #a78bfa #4ade80`.
- Phone preview screen bg `#050605`. QR card bg `#fff`, modules `#0c0e0c`.
- Scrims `rgba(0,0,0,.62)` (modals) to `.72` (QR/codes).

Hard rules: no gradients, no purple surfaces, no colored side/top accent borders on cards, ever.
Red appears only in the funnel Alert state (>=30% drop), safety actions, and the nav safety badge.

## 2. Type

```css
--fd:'Be Vietnam Pro', system-ui, sans-serif;   /* display + body + buttons */
--fm:'Public Sans', system-ui, sans-serif;      /* eyebrows, labels, pills, timestamps, code */
```

- Be Vietnam Pro self-hosted woff2, weights 400 / 500 / 600 / 700 / 900.
- Public Sans from Google Fonts, 400 / 500 / 600 / 700.
- Icons: Tabler Icons webfont (CDN `@tabler/icons-webfont@3`), sizes 14 to 17px, functional only,
  never inside colored circles.

Scale (px / weight / notes):
| Role | Spec |
| --- | --- |
| View title | 21 / 900 / letter-spacing -0.01em, t0 (17px on mobile) |
| View subtitle | 12.5 / 400 / t2 |
| Big stat number | 25 / 900 / -0.02em, green |
| Funnel card count | 24 / 900 / -0.02em, state color |
| Modal title | 17 to 18 / 900 / t0 |
| Card/row name | 14 to 14.5 / 600 to 700 / t0 |
| Body/meta line | 12 to 12.5 / 400 / t2, line-height 1.5 to 1.6 |
| Button label | 12.5 to 13.5 / 600 to 700 |
| Eyebrow/label | --fm, 9 to 10 / 500 to 600, uppercase, letter-spacing 1.5 to 2px, t2 (green when it is the section accent) |
| Status pill | --fm, 9 / uppercase, letter-spacing 1.2px |
| Timestamp | --fm, 10 / t2 or t3 |

Brand mark: "SODA ADMIN" 900, letter-spacing .04em, green, 17px (15 mobile).

## 3. Shape and elevation

| Element | Radius | Border | Fill |
| --- | --- | --- | --- |
| Cards, rows | 12px (14 for hero cards) | 1px var(--bd) | var(--s1) |
| Inputs, selects | 9 to 10px | 1px var(--bd), focus var(--green-bd) | var(--s2) |
| Buttons | 8 to 10px | see §5 | see §5 |
| Pills, badges, toast, chips | 100px | varies | soft washes |
| Modals | 16 to 18px | 1px var(--bd2) | var(--s1) |
| Avatars (SQUARE, never circles) | 28px→8, 38px→10, 52px→12, 60px→14 | 1.5px identity color | var(--dg), initials in identity color, 700 |
| Phone preview frame | 22px | 1px var(--bd2) | #050605 |

Shadows only on floating layers: modals `0 24px 60px rgba(0,0,0,.5)`, toast/action bar
`0 10-12px 30-36px rgba(0,0,0,.5)`. Cards are flat.

## 4. Spacing and layout

- Desktop grid: `224px sidebar | minmax(0,1fr) main | 300px rail`, height 100dvh, panels scroll
  internally. Narrow (<1100px): rail hidden, sidebar 210px. Mobile (<760px): single column,
  sidebar becomes a top header + horizontally scrolling nav pill row.
- Main header: padding 20px 26px 14px (14 16 11 mobile), 1px bottom hairline, date stamp right
  (hidden on mobile).
- Content padding: 20px 26px 40px (16 14 40 mobile).
- Gap rhythm: chips 7px, rows 8 to 10px, grids 10 to 12px, section margins 14 to 24px. Always
  flex/grid with gap, never margin-chained siblings.
- Room grid cards: `repeat(auto-fill, minmax(124px,1fr))`. Stats: `auto-fit minmax(140px,1fr)`.
  Moments: `auto-fit minmax(230px,1fr)`.

## 5. Interactive states

| Control | Rest | Hover | Disabled |
| --- | --- | --- | --- |
| Primary button | green fill, #0D1F12 text, 700 | `filter:brightness(1.1)` | var(--s2) fill, var(--t3) text |
| Ghost button | transparent, 1px var(--bd2), t2 text | text/border shift to green or t0 | n/a |
| Green outline button | transparent, 1px var(--green-bd), green text | var(--green-soft) fill | n/a |
| Danger outline | 1px var(--red), red text | var(--red-soft) fill | n/a |
| Card/row | 1px var(--bd) | border-color var(--green-bd) | n/a |
| Nav item | t2 text | var(--s2) bg, t0 text | active: var(--dg) bg + green text |
| Chip (selectable) | transparent, 1px var(--bd2), t1 | n/a | selected: solid accent fill + #0D1F12 text |
| Custom chip | dashed 1px var(--bd2), t2 | green text + green-bd border | input mode: pill input with green-bd border |

Selected roster card: 1.5px var(--green) border + var(--dg) fill + 18px green check disc
(check icon in #0D1F12), top-right on grid, leading on list rows.

## 6. Motion

- Transitions: `all .15s` on nav/chips/buttons, `border-color .15s` on cards. Ease default.
- Live dots: `adm-pulse` keyframe, `0%,100% opacity 1 / 50% opacity .35`, 1.4s infinite.
- Nothing else animates. No bounces, no springs, no entrance animations.

## 7. Component recipes (copy these, do not redesign)

- **Status pill:** `--fm 9px, ls 1.2, uppercase, padding 3px 9px, radius 100` with color + matching
  soft wash: green Open to intros / Live, amber Heads down / Upcoming / Watch, muted t3+s3 Left
  quietly / Past, red only for Block/Alert.
- **Nav badge:** `--fm 10px 700, radius 100, padding 1px 8px, min-width 20px`; green fill (#0D1F12
  text) default, amber for queue, red (white text) for safety.
- **Toast:** fixed bottom 26px center, s3 fill, green-bd border, radius 100, `10px 20px`,
  13px/600 t0; optional green Undo text button inside.
- **Confirm modal:** title 17/900, body 13 t2, right-aligned Cancel (ghost) + CTA (green, or red
  fill with white text when danger).
- **Floating action bar:** pill, s3 fill, green-bd border, stacked square avatars overlapping
  -9px with 2px s3 ring, count, green Call out, ghost Cancel.
- **Event "Tonight" pill (sidebar):** dg fill, green-bd border, radius 10, mono eyebrow + name +
  pulsing live line.
- **QR tile:** white 56px square, radius 8, 5px padding, inside an s1 card row; modal version white
  card radius 14, QR up to 240 to 280px, Download PNG primary button.
- **Bars (funnel/supply):** track var(--s2) radius 4 to 6, fill green (offers) / amber (needs),
  height 16 to 26px, numbers right-aligned in a fixed grid column so bars align.

## 8. Voice in UI copy

Short, calm, declarative. Sentence case everywhere except mono eyebrows (uppercase). No urgency
theater: states read "Holding / Worth a look / Alert", never warnings with exclamation marks.
No emoji. No em dashes. Middle dot `·` separates metadata ("Fri Jul 10 · 8:47 PM").
