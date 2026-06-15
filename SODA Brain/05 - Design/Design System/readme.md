# SODA — Design System

**SODA** is a QR-triggered, mobile-first web app that activates at live creative meetups. An attendee scans a QR at the door, signs in with email, builds a 90-second micro-profile, and enters a live digital room of everyone present. It is at once a check-in tool, a community directory, a connection-matching layer, and an event-intelligence system.

- **Product owner:** Equalpoint, Inc. (SODA is their proprietary product)
- **Pilot client / data owner:** Futureland Inc.
- **Tagline:** *A name tag knows you showed up. SODA knows who you became to the room.*
- **Brand-agnostic by default:** every event supplies its own host name (required) and logo (optional). SODA and Equalpoint stay quiet in the background; the **host identity** is what attendees see.

This project is the design system that lets agents build on-brand SODA interfaces and assets.

## The product has two sides

1. **The Attendee side** — what a guest holds in their hand. The spine: Entry QR → Welcome → Sign-In → Photo → Role/Offer/Need chips → Room View → the three live Acts (The Drop, The Chance, The Nudge) → Survey → Send-Off. Plus the between-events **Home** (Overview / Events / Contacts rolodex).
2. **The Host side** — two cockpits: the **Command Center** (live: run the night, fire the acts, watch intelligence) and the **Admin Panel** (back office: create the event, set host identity, moderate, export).

The **event lifecycle** (Draft → Live → Closed) is the spine that connects both sides.

### The three live Acts (the heart of the night)
- **The Drop** (Creative Sync) — one prompt lands on every phone at once; answers rise onto a shared wall.
- **The Chance** (Random Pairing) — SODA pairs people by chance with a reason to talk; an amber countdown runs.
- **The Nudge** (Quiet Nudge) — a **private** tap on the shoulder naming one person to meet. This is sacred: it goes only to its recipient, **never** to any shared view. Purple marks it everywhere.

---

## Sources this system was built from

All sources are in `uploads/` in this project (read them if you have access):

- `SODA-Component-Inventory.md` / `.html` — the canonical catalog of all 78 components, both sides. The `.html` carries the real implemented color tokens.
- `SODA-Profile-Simulation.html` — **the canonical phone implementation.** The refined, final token set and component CSS are lifted from here.
- `SODA-Design-Spec-Home-Screen.md` — the between-events Home (shell, Overview, Events, Contacts) + warmth/follow-up logic.
- `SODA-Attendee-Flow-Map.md` / `.html` — the guest journey across the lifecycle.
- `SODA-Host-Flow-Map.md` / `.html` — Admin → Command Center → Admin.
- `SODA-Event-Layer.md` — event definition, host identity, Draft/Live/Closed lifecycle, per-event QR.
- `SODA-Empty-Loading-Error-States.md` — every empty/loading/error state, with copy.
- `SODA-Privacy-Policy.md` — data handling.
- `SODA-Component-Inventory-Mobile.html`, `SODA-Profile-Flow-Map.html` — supporting layouts.

No Figma file or code repository was provided; the prototype HTML files above are the source of truth.

---

## CONTENT FUNDAMENTALS — how SODA writes

SODA's voice is **warm, terse, and confident**. It speaks like a good host working the room: short sentences, plain words, no hype, no jargon. It addresses the guest as **"you"** and rarely says "I". It never over-explains.

- **Cadence: short declaratives, often three in a row.** *"The room is filling. You are early. Good."* / *"You showed up. That is the first move. Here is who was in the room."* The rhythm does the emotional work.
- **Casing carries meaning.**
  - **Display headlines & greetings are UPPERCASE** (Archivo Black): `WELCOME BACK, MAYA`, `THE ROOM IS FILLING`, `YOU ARE UP NEXT ROUND`.
  - **System labels / eyebrows are UPPERCASE mono**, letter-spaced: `THE DROP`, `RECENTLY MET & FOLLOW-UPS`, `PEOPLE YOU SYNCED WITH`.
  - **Body copy is sentence case**, light weight: *"You came to find collaborators. Three people from your events fit."*
- **Empty states are never blank and never read as broken.** Frame zero as the night beginning: *"The night starts here." / "Waiting on the first answer." / "Not enough signal yet. Patterns appear as the room grows."*
- **Errors are honest and recoverable** — plain words for what happened, then the next step: *"That code did not match. Check your email or resend."* Red appears **only** in errors.
- **The Nudge voice is intimate**, addressed to one person: eyebrow *"A NUDGE, FOR YOU"*; never an announcement.
- **No emoji** in product copy. One brand mark — the four-pointed sparkle **✦** — sits beside the SODA wordmark in eyebrows (`SODA ✦ COMPONENT INVENTORY`). That is the only decorative glyph.
- **Numbers are bragging rights, shown big and green:** `12 met`, `3 HERE`, attendance counts. Mono for the unit/label, Archivo Black for the figure.
- **Recurring signature line:** *"A name tag knows you showed up. SODA knows who you became to the room."* Use it as a closer; keep it italic and quiet.

Tone test: would a warm, slightly cool host say it in one breath, looking you in the eye? If yes, it's SODA. If it sounds like marketing or a system dialog, rewrite it.

---

## VISUAL FOUNDATIONS

SODA is **dark-native, near-black, and almost monochrome — until one green does all the talking.** The restraint is the brand: a calm black room where the only color is the thing you can act on.

- **Color vibe.** Canvas is near-black `#111111` (deepest black `#0a0b0a` behind the device and in footers). Surfaces are barely-lifted warm-greys (`#1A1A1A`, `#222422`) separated by **hairline borders** (`#262826`), not shadows. Then three meaningful colors, each with one job:
  - **Green `#3BD75C` = interactive / present / alive.** The active tab, primary buttons, live dots, the "12 met" numbers, focus rings. If it's green, you can act on it or it's alive right now.
  - **Purple `#A47BFF` = private / for you only.** The Nudge act and the follow-up nudge. Never used decoratively.
  - **Amber `#F59E0B` = live time & decay.** The Chance countdown; contact warmth cooling.
  - **Red `#FF5470` = errors only.** Nothing else is ever red.
  - **Deep green `#203229`** is a calm filled surface for "your experience" insight cards; **purple-black `#1c1726`** for private/held containers.
- **Type.** Three families, strict roles. **Archivo Black**, UPPERCASE and tight (`-0.01em`), for greetings, headlines, and big stat numbers — never paragraphs. **DM Sans** for everything readable, with body paragraphs leaning **light (300)** and emphasis at 600/700. **DM Mono** for eyebrows, labels, meta, and counts — UPPERCASE, letter-spacing 1–3px. Mono is the "system voice"; display is the "emotional voice".
- **Spacing & layout.** An **8px grid**, **16px screen margins**, **44px minimum touch targets**. One dominant element per screen. Mobile screens are a fixed vertical stack: sticky header → scrolling body → fixed bottom tab bar.
- **Backgrounds.** Flat near-black. **No gradients, no photographic backgrounds, no textures, no patterns.** The one "image" treatment is the **initials avatar**: a solid-color circle (from the 8-color identity palette) with white initials when no photo is set. Depth comes from layering surfaces and borders, not from blur or imagery.
- **Cards.** Flat. A raised surface (`#1A1A1A`) + a **1px hairline border** (`#262826`), radius **13–15px**. No drop shadow. On press they don't lift — they **swap the border to green** (`:active`). Special cards: deep-green insight cards (no border) and purple private containers (purple-tinted border).
- **Corner radii.** Pills are fully round (`100px`) for chips, signal badges, and toasts. Cards 13–15px, buttons/inputs 10–11px, small logo tiles 8–10px, the phone bezel 42px, avatars/dots fully round.
- **Borders & accents.** Hairline `1px` everywhere. A **2px green underline** marks major section titles. A **3px left bar** flags a quoted prompt (green for system, purple for The Nudge / private).
- **Shadows.** Essentially none in the UI — the system is flat. The **only** real shadow is the device frame itself (`0 30px 80px rgba(0,0,0,.6)`). Modals/toasts get a soft pop shadow.
- **Transparency & blur.** Used sparingly: translucent **soft fills** for hover and soft badges (green at 6–12% opacity, purple at 14%). No glassmorphism / backdrop-blur as a motif.
- **Hover / press / states.** Hover = a faint green wash (`rgba(59,215,92,.06)`) and text shifting to green. **Press = border-to-green, not scale** (cards don't shrink); buttons may darken slightly. Focus = the input's border turns green. Disabled = `opacity: .5`, no pointer.
- **Animation.** Quick and calm: `~.15s` for hover/press/chip toggles, `~.3s` for toasts and view changes, `~.5s` for reveals (the wall filling, names attaching). Standard ease (`cubic-bezier(.4,0,.2,1)`). **No bounce, no spinner theater.** Loading is a quiet skeleton of the shape to come, or a calm working label. Reduced-motion shows the end state.
- **Imagery treatment.** There is essentially no stock imagery. Identity is carried by **colored initials avatars** and the **host logo** (when an event uploads one). Everything else is type and the green.

---

## ICONOGRAPHY

SODA has **no icon library and no SVG icon set.** Iconography is deliberately minimal and built from **Unicode geometric glyphs**, consistent with a system that wants type and one green to carry the interface.

- **Brand mark:** the four-pointed sparkle **✦** (`U+2726`) set beside the **SODA** wordmark (Archivo Black) in eyebrows, e.g. `SODA ✦`. There is no logo image file — the wordmark *is* the logo. Host events may upload their own logo, which sits where the wordmark would.
- **Tab bar & nav glyphs:** filled geometric Unicode marks — `■`/`▣`/`◎` (Overview / Events / Contacts), `⚙` gear (settings), `←` back, `×` close, `✓` check, `●` dot (live / signal), `⏱` stopwatch (timers/simulation).
- **Inventory field markers:** `◆` (what it is), `◑` (what the person sees), `⇄` (what it connects to), `●` (status) — used in documentation, in green.
- **Signals are color + word, not icons:** a contact's state is a pill that says `Saved` / `Reached out` / `Reach out` / `Just met`, colored (muted / green / purple / muted) — meaning is carried by the word and color, with at most a `●` dot.
- **Status dots:** a small `●` in green = live/present; in purple = a waiting private nudge; warmth dots shade green→amber→purple as a contact cools.
- **Emoji:** not used in product UI.

**If you need richer icons** for a new surface (e.g. an export sheet, a share slide-up), prefer staying with Unicode geometric glyphs to match the brand. If a true icon set is unavoidable, use a thin, single-weight line set (e.g. **Lucide**, 1.5px stroke) in `--text-muted`, switching to `--accent` only when interactive — and flag the addition. Never hand-draw decorative SVG illustrations; the brand is type + green, not illustration.

---

## INDEX — what's in this system

**Root**
- `styles.css` — the global entry point (consumers link this). `@import`s only.
- `readme.md` — this file.
- `SKILL.md` — Agent-Skill front matter for use in Claude Code.

**`tokens/`** — CSS custom properties (all reachable from `styles.css`)
- `fonts.css` — the three webfonts (Archivo Black / DM Sans / DM Mono).
- `colors.css` — base palette + semantic aliases + avatar palette.
- `typography.css` — families, weights, type scale, line-heights, tracking.
- `spacing.css` — 8px grid + semantic spacing.
- `effects.css` — radii, borders, shadows, motion.
- `base.css` — minimal resets + brand-voice helper classes.

**`guidelines/`** — foundation specimen cards (the Design System tab).

**`components/`** — reusable React primitives, grouped:
- `forms/` — Button, Input, Chip, CodeInput, **SegmentedToggle** (Full/Simple-style track), **ResendControl** (countdown → green link)
- `data-display/` — Avatar, Badge, StatTile, ContactRow, EventCard, **RolePill** (granted Owner/Collaborator badge), **EventRow** (host event list row with a live tag)
- `feedback/` — Toast, ProgressBar, **BottomSheet** (sheet rising over a dimmed screen)
- `navigation/` — TabBar, SectionHeader, **Carousel** (short skippable onboarding carousel)

**`screens/`** — the **new-screens** package (gallery + click-through of 10 added screens):
- `New Screens — Gallery.html` — all 10 side-by-side on a pan/zoom canvas (Access & Sessions, Event Mode, Host Access, Collaborator Onboarding).
- `New Screens — Flows.html` — the same 10 wired into three click-through flows with phone / tablet / admin framing.
- `frames.jsx` (phone, tablet, admin shell + display primitives), `kit.jsx` (self-contained mirrors of the product components), `access.jsx` / `host.jsx` / `collab.jsx` (the screens).

**`ui_kits/`** — full-screen click-through recreations (each `index.html` is also a **Starting Point**):
- `attendee/` — the mobile spine (Welcome → Sign-In → micro-profile → Room → the three Acts → Survey → Send-Off) + the between-events Home. Files: `index.html`, `ui.jsx`, `onboarding.jsx`, `room.jsx`, `survey.jsx`, `home.jsx`.
- `command-center/` — the host live cockpit (stat bar, room, Drop/Chance/Nudge controls, survey monitor, intelligence). Files: `index.html`, `cc.jsx`, `views.jsx`.
- `admin/` — the host back office (event & identity, check-in, chip moderation, matches, export, lifecycle control). Files: `index.html`, `admin.jsx`, `panels.jsx`.

> Kit screens are kept **self-contained** (mirroring `/components` with the same `styles.css` tokens) so they render standalone. In production, compose `window.SODADesignSystem_3bd687.*` instead of re-implementing.

*A name tag knows you showed up. SODA knows who you became to the room.*
