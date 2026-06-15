---
name: soda-design
description: Use this skill to generate well-branded interfaces and assets for SODA (the QR-triggered live-event app by Equalpoint, piloted with Futureland), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

SODA is **dark-native** (near-black `#111111`), almost monochrome, with one vivid **green `#3BD75C`** that means *interactive / alive / present*, a sacred **purple `#A47BFF`** that means *private / for you only* (The Nudge), **amber** for live time, and **red only for errors**. Type is **Archivo Black** (UPPERCASE display), **DM Sans** (body, light 300), and **DM Mono** (eyebrows/labels). 8px grid, 16px margins, 44px touch targets. Voice is warm, terse, confident — short declaratives, "you" not "I", no emoji.

Key files:
- `readme.md` — full context, content fundamentals, visual foundations, iconography, index.
- `styles.css` — the global entry point; link it and use the CSS custom properties (`--accent`, `--private`, `--surface-1`, `--font-display`, …).
- `tokens/` — colors, typography, spacing, effects, fonts.
- `guidelines/` — foundation specimen cards.
- `components/` — reusable React primitives (Button, Chip, Avatar, Badge, StatTile, ContactRow, EventCard, Toast, ProgressBar, TabBar, SectionHeader, Input, CodeInput).
- `ui_kits/` — full click-through recreations: `attendee/` (the mobile spine + Home), `command-center/` (host live cockpit), `admin/` (host back office).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view, linking `styles.css` and reusing the kit screens as references. If working on production code, copy the components and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
