# SODA — Motion and Screen Transitions Plan (Framer Motion)

*Make navigating the attendee app feel like a native app, not a website: coordinated ease in/out
between screens, no chrome flash, no loading-pop, plus two premium shared-element morphs. Decided
with Brent 2026-07-07: Framer Motion, morphs on (1) roster card into the expanded sheet and (2)
kept-warm row into the person sheet. Builds on the soda-attendee-rebuild branch. Web-specific
(Expo re-implements with Reanimated later); the timing/curve SPEC carries over.*

## Why it feels jumpy today (the diagnosis, grounded in the code)
1. **The chrome remounts on every tab tap.** No shared layout — each of the 7 tabbed screens
   renders its own `AppShell` (TopBar + TabBar). Tapping a tab tears the whole frame down and
   rebuilds it, and TopBar re-fetches notifications + the avatar each time. That flash is most of
   the jump.
2. **Screens hard-cut out, then fetch-and-pop in.** The new screen fades in; the old one vanishes
   instantly; a "Loading…" that snaps to content reads as a second jump.
3. Easing is short and not applied consistently.

## The build

### Phase 0 — Foundation: persistent chrome (removes ~70% of the jank on its own)
- New nested route group **`app/(attendee)/(app)/`** holding the 7 tabbed screens (home, rooms,
  rooms/[eventId], card, people, you, inbox). Route groups do not change URLs, so every path stays
  the same. The immersive room and the doors (join/signin/signup/connect/left/send-off/wrap/survey)
  stay OUTSIDE it, keeping their own full-screen chrome.
- New **`(app)/layout.tsx`** → a client `AppFrame`: `MotionConfig reducedMotion="user"` wrapping
  `ToastProvider` wrapping `TopBar` + `<PageTransition>{children}</PageTransition>` + `TabBar`.
  Mounted ONCE; the bars never remount again.
- **`components/kit/app-shell.tsx` slims** to just the `motion.main` content wrapper (per-page
  `testId` + padding). TopBar/TabBar move out to the layout. Every `*-screen` testid is preserved,
  so the E2E specs are untouched.

### Phase 1 — The motion system
- Add **`motion`** (Framer Motion's current package; `import ... from 'motion/react'`).
- Use **`LazyMotion` + `domMax`** (layout animations are required for the morphs) with `m.*`
  components, so only the used features ship — keeps the PWA bundle lean on venue wifi.
- New **`lib/motion.ts`**: the durations + easing from the design tokens as plain JS constants
  (fast 0.15 / base 0.26 / slow 0.5s; ease `[0.4, 0, 0.2, 1]`). One source both the web transitions
  and the future native spec read.
- `MotionConfig reducedMotion="user"` makes the WHOLE app honor the OS "Reduce Motion" setting for
  free (belt-and-suspenders with the existing `prefers-reduced-motion` CSS block).

### Phase 2 — Cross-route page transitions (tab to tab)
- **`PageTransition`** in the (app) layout: `AnimatePresence mode="wait"` keyed by `usePathname()`,
  wrapping an `m.div` with a calm fade + small vertical slide (enter from +8px, exit to -8px,
  ~260ms, ease-out). Content eases both IN and OUT; the bars stay still behind it.
- **The App Router gotcha + fix:** the outgoing page normally unmounts before its exit can play, so
  children are wrapped in a **`FrozenRouter`** that freezes `LayoutRouterContext` for the duration
  of the exit (the standard, well-documented Next-App-Router + Framer pattern). This is the one
  piece to validate in the spike.

### Phase 3 — Shared-element morphs (the two Brent picked) — IN-PAGE, not cross-route
- **Roster MicroCard → expanded sheet (room):** the card's avatar+name block gets
  `layoutId={person-${id}}`; the `PersonSheet` header gets the same `layoutId`. Opening the sheet
  (wrapped in `AnimatePresence`) morphs that block from the card's position into the sheet header;
  the rest of the sheet rises/fades. Closing reverses. Because the sheet portals to `<body>`, the
  page is wrapped in a **`LayoutGroup`** so the shared id crosses the portal boundary — the bit to
  prove out in the spike.
- **Kept-warm row → person sheet (people):** identical pattern — row avatar+name `layoutId={conn-${id}}`
  matched on the Person Actions sheet header.

### Phase 4 — Kill the loading-pop (skeletons + prefetch)
- New **`components/kit/skeleton.tsx`** (shimmer using the existing `soda-shimmer` motion). Each
  screen's "Loading…" becomes a skeleton shaped like its real content, so data arriving is a fade,
  not a pop.
- Tab `Link`s prefetch (Next default in prod), so the next screen's code is already in hand on tap.

## Reduced motion and accessibility
`MotionConfig reducedMotion="user"` + the CSS `prefers-reduced-motion` block collapse everything to
instant for motion-sensitive users. No parallax, no large translate — nothing that risks vestibular
discomfort.

## Native-ready note
This layer is web-specific (Framer/CSS). The SPEC (durations, curves, which screens morph) lives in
`lib/motion.ts` as plain numbers and carries to Expo, where Reanimated/Moti re-implements it. Logged
against [[SODA-Universal-Build-Master-Plan]].

## Order of work (spike first)
1. **SPIKE (go/no-go):** Phase 0 foundation + Phase 2 page transitions across the 7 screens + ONE
   morph (roster → sheet). Validates FrozenRouter and layoutId-across-a-portal before any rollout.
2. Second morph (people) + skeletons + prefetch.
3. Verify + push to the preview branch.

## Files
- NEW: `(attendee)/(app)/layout.tsx`, its `_components/app-frame.tsx` +
  `page-transition.tsx` + `frozen-router.tsx`; `lib/motion.ts`; `components/kit/skeleton.tsx`.
- MOVED into `(app)/` (URLs unchanged): home, rooms, card, people, you, inbox.
- EDIT: `components/kit/app-shell.tsx` (slim to `motion.main`); `roster-views.tsx` + `person-sheet.tsx`
  (layoutId + AnimatePresence); `people/page.tsx` + its person sheet (layoutId); each screen's
  Loading → Skeleton. TopBar/TabBar move to the layout unchanged.

## Verification
- Gates: prettier, typecheck, the 73 unit tests, production build; check the client-bundle delta
  (LazyMotion keeps it modest).
- Manual on localhost: tab through Home/Rooms/Card/People/Inbox — bars stay put, content eases in
  and out, no flash, no loading-pop. Tap a person in the room → their card grows into the sheet;
  close → it shrinks back. Same in People. Toggle the OS "Reduce Motion" → everything instant,
  nothing breaks. Then the real feel test on a phone via the preview URL.
