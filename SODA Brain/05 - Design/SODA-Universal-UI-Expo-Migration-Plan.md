# SODA — Universal UI + Seamless Expo Migration (Deep Plan)

*A proposal, not a commitment. The deliberate plan for building a **universal UI** that runs as the web
PWA now and as native iOS/Android (Expo) later, from one codebase, migrated seamlessly, with the live
app never breaking. Created 2026-06-27 at Brent's direction ("plan deeply before any sudden moves; don't
kill anything; the Expo-formulated UI must still function as the PWA; seamless migration when the time
comes"). Sits on top of the foundation rules in [[SODA-Native-Ready-Architecture]]. Needs Brent + Alysha
sign-off before any building.*

---

## The goal, stated precisely

One UI codebase, written in React-Native-compatible primitives, that:
- **renders on the web today as the PWA** (via react-native-web), serving grabsoda.app, and
- **renders natively on iOS/Android later** (via Expo), from the *same* components, and
- **migrates seamlessly**, the native launch is "add a target," not "rewrite the app."

This is more ambitious than "share the logic, rebuild the views." Here the **views themselves are
shared**. That is the "Expo-formulated UI that still functions as the PWA" you described.

## The safety contract (locked, non-negotiable)

These guardrails exist so we never kill anything:
1. **The live PWA keeps serving the whole time.** The current Next.js app on grabsoda.app stays up and
   shipping until a proven replacement exists. Nothing in it is deleted or rewritten in place.
2. **One backend, never forked.** Supabase (DB, RLS, RPCs, Realtime, Auth) and `@soda/contracts` serve
   both the old and the new app at once. The backend is the stable spine through the whole move.
3. **Everything runs in parallel and is reversible.** The new universal app is built *alongside* the
   live one, never on top of it. Every step ships on its own and can be rolled back.
4. **Nothing replaces anything until it passes the [[SODA-Flow-Test-Plan]]** and matches the PWA
   (the "parity gate"). No screen goes live to guests until its universal version is proven equal.
5. **Spike before commitment.** We prove the universal path on one real flow before betting the quarter
   on it (see Phase 1).

## The one pivotal decision (the whole plan pivots here)

**How does the web keep working once the UI is "Expo-formulated"?** Two coherent end-states:

- **A · Expo Router becomes the universal web + native app (recommended).** One app in RN primitives +
  NativeWind renders to web (this *becomes* the new PWA) and to iOS/Android. Next.js is gradually
  retired from the frontend; its server/API logic moves to Expo Router API routes or Supabase. Cleanest
  "seamless" end-state, and the truest match to "the Expo UI *is* the PWA." Biggest change.
- **B · Keep Next.js as the web host, share a universal component kit.** UI is written in RN-compatible
  primitives in a shared package, rendered on web through react-native-web *embedded in Next*, and
  natively in Expo. Next stays as the web shell + API. Less migration, but RN-web-inside-Next is a
  fiddly, less-supported setup, and you maintain two hosts forever.

**Recommendation:** aim for **A**, but *prove it with the spike* (Phase 1) before committing. The spike,
not a guess, settles this fork with real evidence. Until then we build nothing that assumes either.

## Scope discipline (what goes universal, and what waits)

- **Attendee app goes universal first** (the guest-facing flows). Smaller, highest value, and the part
  that most wants to be native (push notifications, robust storage).
- **Host / Operator tooling (Admin, Command Center, Ops, Kiosk) can stay on Next.js** as long as it
  likes. It is desktop-leaning, lower-value-as-native, and keeping it on Next shrinks the risky surface.
  It can migrate later, or never. This keeps the move focused and safe.

## The phased path (each phase parallel to the live app, each reversible)

- **Phase 0 · Foundation (safe prep, breaks nothing).** The [[SODA-Native-Ready-Architecture]] rules:
  shared logic in `@soda/core`, tokens as the TS source, logic-in-hooks / thin-views. Helps *both* forks
  and the live app. The only work that can start before the architecture is signed off, and even this
  waits for your go.
- **Phase 1 · The Spike (decision-grade, ~1 to 2 weeks, zero production change).** Stand up an Expo
  Router app in the monorepo. Build ONE flow (sign-in to the room) in universal primitives, running on
  **web (as a PWA) and on iOS/Android**, against the **real Supabase**. Output: a go/no-go on the
  universal path, a real effort estimate, and the resolved A-vs-B fork. Nothing in production moves.
- **Phase 2 · The Universal Component Kit.** Rebuild the shared atoms (Avatar, Button, Chip, Card,
  Sheet/Modal, inputs, headers) in universal primitives + NativeWind, styled to the SODA tokens. The
  design system becomes universal. Validated on web + native. The live PWA is untouched. *(Started on
  web: a shared `<Input>`/`<Textarea>` atom that de-dups the field skeleton, branch `soda-input-atom`,
  commit e3749a5, 4 of ~20 fields converted. Finishing that input sweep + adding `Field` / `Button` /
  `Chip` atoms is the rest of the de-dup, and is exactly this phase.)*
- **Phase 3 · Build the overhaul IN the universal kit.** The planned [[SODA-Attendee-UI-Overhaul]] is
  built once, in the Expo Router app, screen by screen, against Supabase. Its **web target is the PWA**,
  so it "still functions as the PWA" exactly as you want. The current Next PWA stays live the whole time.
  Each screen must pass the parity gate before it is shown to real guests.
- **Phase 4 · Parity + Cutover (the seamless switch).** When the Expo web build reaches full parity with
  the current attendee PWA (all flows, tested, performance and PWA install/push verified), point
  grabsoda.app's attendee experience at the Expo web build. Next stays as the API backend (or its API
  moves to Expo Router / Supabase, a separate sub-decision). The old attendee frontend is retired only
  *after* cutover is proven. Reversible at the routing layer.
- **Phase 5 · Native launch.** Ship iOS/Android via Expo's EAS (developer accounts, app review, push
  notifications). The native apps are the *same code* already running the web PWA. The migration is
  "add a target," which is the seamless end you asked for.

## Decisions needed before we build (the gates)

1. **Architecture sign-off (Brent + Alysha):** approve the universal direction and target end-state A.
   This is foundation-level, so it pairs with the open Clerk/Zustand foundation question.
2. **Green-light the Phase 1 spike** as the first and only near-term move (it changes nothing in prod).
3. **Confirm scope:** attendee app universal first; host/ops stays on Next for now.

## What we are explicitly NOT doing

Not migrating, not rewriting the live app in place, not deleting anything, not starting any phase past 0
until the spike proves the path and the architecture is signed off. No sudden moves. The current PWA on
grabsoda.app is the source of truth until a tested replacement earns the switch.

## References

[[SODA-Native-Ready-Architecture]] (the foundation rules this sits on) ·
[[SODA-Attendee-UI-Overhaul]] (built in Phase 3, in the universal kit) · [[SODA-Flow-Test-Plan]] (the
parity gate) · [[SODA-Flows-As-Built]] · [[SODA-Backlog]]. Migration carries-over-vs-rebuild analysis +
the spike rationale: the 2026-06-27 conversation.
