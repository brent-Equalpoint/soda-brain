# SODA Stack Research and Best Practices, June 2026

*A deep pass across the whole SODA stack to bring the architecture current and surface anything that changes the build. Each finding carries what is true now, what it means for SODA, the recommendation, and a confidence level. Sources are listed at the end. A product of Equalpoint, Inc.*

## How this was checked

Every claim was cross-checked against at least two sources, with official documentation preferred over third-party write-ups. Where a number is plan-specific or likely to drift, it is flagged to verify at the source before you architect around it. Confidence is marked High when official docs and multiple sources agree, Medium when the direction is clear but exact figures come from secondary sources.

The headline: nothing in the SODA experience or data model has to change. Two things in the stack do. Next.js should move from 14 to 16, and the proximity layer cannot rely on browser Bluetooth, which reshapes how the room is defined for the pilot.

---

## 1. Next.js, move from 14 to 16

**Current state.** The latest stable is Next.js 16.2.x, released in 2026. Version 14 is two majors behind. In 16, Turbopack is stable and the default for both dev and build, so faster builds come for free. The caching model changed: fetch is no longer cached by default, and caching is now opt-in through the use cache directive and Partial Prerendering, which is the source of the old stale-data surprises being gone. The App Router runs on React 19.2, which brings View Transitions and useEffectEvent. Confidence: High.

**What it means for SODA.** Server Components by default, Client Components only where the room needs interactivity, which is exactly the pattern in our build doc. The caching change is a benefit, not a migration cost, for a fresh build. View Transitions are relevant later, for the motion layer.

**Recommendation.** Start on Next.js 16, current 16.2.x, Turbopack native. Build with Server Components as the default, reach for use cache only on genuinely cacheable reads, and wrap dynamic, per-person views in Suspense. One caution: if a custom webpack config is ever added, the default Turbopack build will fail rather than silently misconfigure, so keep the build Turbopack-native from the start. Floor your runtimes at Node 20.9 and TypeScript 5.1 or newer.

---

## 2. Supabase Realtime, the room is the scaling question

**Current state.** Supabase Realtime presence is a CRDT-backed in-memory store on Phoenix, the same lineage that runs large chat systems. Concurrent peak connections are plan-bound: roughly 200 on Free and around 500 on Pro at twenty-five dollars a month, with higher ceilings requiring a Team plan, self-hosting the open-source Realtime server, or a dedicated provider such as Ably or Pusher. The managed cluster supports millions of connections at scale, and all limits are configurable per project. Confidence: High on the structure, Medium on the exact 200 and 500 figures, which are plan-specific and should be confirmed on the pricing page.

**What it means for SODA.** Our scaling metric, concurrent realtime connections per event, maps directly onto these tiers. A small pilot room sits inside Free or Pro comfortably. A large Futureland-scale room, hundreds to thousands in one space, will exceed Pro and needs a deliberate choice before that event, not during it. There is also a known presence quirk: state can go stale after a tab visibility change, producing ghost guests in the room.

**Recommendation.** Pilot on Pro and treat 500 concurrent as the line where a large event needs the Team plan or self-hosted Realtime, decided ahead of time per event. Re-track presence on visibilitychange with a fresh timestamp so a guest who backgrounds and returns does not show as a ghost, which also reinforces the never-drop-mid-event rule. Keep presence scoped to the event channel. Confidence: High on the guidance.

---

## 3. Supabase Auth, two corrections to lock in now

**Current state.** The current server-side auth path is the @supabase/ssr package. The older @supabase/auth-helpers is in maintenance and deprecated, with all fixes going to ssr. Separately, Supabase moved to a new API key model, publishable and secret keys, and the legacy anon and service_role keys are slated for deprecation by the end of 2026. Confidence: High, both from official docs.

**What it means for SODA.** Our email-and-code sign-in for attendees and hosts is well supported. But the build must use @supabase/ssr from the start, with the three client patterns, browser client, server client for Server Components and route handlers, and a middleware client to refresh the session. And it should adopt the new key format rather than the legacy keys that are on a deprecation clock.

**Recommendation.** Use @supabase/ssr, not auth-helpers. Use the new publishable and secret keys. Keep the secret key server-side only, never in a client component, which aligns with our rule that nothing touches Supabase directly from the client. Confidence: High.

---

## 4. Proximity and BLE, the finding that reshapes the room

**Current state.** The Web Bluetooth API is not supported by Safari on iOS, iPadOS, or macOS, in any version, and the WebKit project, which every iOS browser is required to use, is on record opposing generic peripheral access APIs like it. Support is essentially Chromium on desktop and Android, around 76 percent globally as of April 2026. The iOS workarounds are niche browsers like Bluefy or a companion-app polyfill, neither of which a general event audience will install. Confidence: High, corroborated by the W3C working group and browser-support trackers.

**What it means for SODA.** This is the one finding that changes the architecture. A live event audience is heavily iPhone, and browser BLE simply does not run for those guests. So a PWA cannot do true device-to-device proximity on iOS. The good news is that the SODA spine never actually needed it: the room is already defined by who scanned the event QR and is present in realtime, not by who is physically within Bluetooth range. The BLE mesh was an enhancement, not the foundation.

**Recommendation.** For the pilot, define the room by event check-in and server presence through Supabase Realtime, and drop browser BLE entirely. Treat true micro-proximity, sensing who is near you within a room, as a later, native-only capability, since on iOS it requires CoreBluetooth in a native or wrapped app, not a PWA. This also means the FastAPI proximity service is not needed for the pilot. The pilot can run on Next.js and Supabase alone, and FastAPI returns only if and when a native proximity layer is built. Confidence: High.

---

## 5. PWA on iOS, design the delivery around the limits

**Current state.** Push notifications work on iOS only for a PWA the user has installed to the home screen, never from a Safari tab, and the permission prompt must follow a tap. There is no automatic install prompt on iOS, the user must use Share, then Add to Home Screen, by hand. As of iOS 26, home-screen sites open as web apps by default, which helps slightly, but the manual install step remains. Storage can be evicted after roughly seven days of inactivity, and there is no background sync. Safari 18.4 added Screen Wake Lock and Declarative Web Push. Confidence: High.

**What it means for SODA.** Three concrete consequences. The recap belongs on email, which is already the design, because push would reach only the fraction of guests who installed. The follow-up nudge cannot depend on push either, so it lives in the home area first, with push as a bonus for installed users. And the install prompt we specified is doing real work on iOS and must be a custom, iOS-aware UI that shows the manual Share to Home Screen steps, since the browser will never prompt on its own.

**Recommendation.** Keep recap on email. Surface nudges in the home area, treat push as additive. Make the add-to-home-screen prompt detect a non-installed iOS visitor and show the manual steps. Use Screen Wake Lock in the Room View and the Command Center so a phone does not sleep mid-event. And because storage can be evicted, keep the server as the single source of truth and never depend on client storage for anything that matters, which is already our rule. Confidence: High.

---

## 6. The Claude draft layer, current models

**Current state.** The current API tiers are Haiku 4.5 at one and five dollars per million tokens, Sonnet 4.6 at three and fifteen, and the Opus line at five and twenty-five. Model strings are claude-haiku-4-5-20251001, claude-sonnet-4-6, and claude-opus-4-8. Prompt caching cuts cached input by about ninety percent, and the batch API is about half price. Confidence: High.

**What it means for SODA.** The follow-up draft is a short, quality-sensitive generation behind the two-call gate. The draft quality is the product, since a clumsy draft is worse than none, so the small step up from Haiku to Sonnet is usually worth it. The placeholder model string in earlier docs is out of date.

**Recommendation.** Default the draft layer to Sonnet 4.6, claude-sonnet-4-6, for message quality, and consider Haiku 4.5, claude-haiku-4-5-20251001, if cost or latency dominates at scale. Cache the system prompt to cut repeated input cost. Keep the two-call gate and no-auto-send rules unchanged. Confidence: High.

---

## 7. Smaller notes

**React 19.2 and motion.** View Transitions ship with the App Router in 16, which is the natural tool for the motion layer when you reach it. No action now, just the right door for later. Confidence: High.

**FastAPI.** With browser BLE off the table for the pilot, the FastAPI proximity service loses its main job. Next.js route handlers plus Supabase Realtime cover the pilot. Keep FastAPI in mind only for a future native proximity layer or heavy custom realtime, not for the first build. Confidence: High.

---

## The architecture changes that follow

In short, the edits to make across the brain:

1. Next.js 14 becomes Next.js 16, App Router, Turbopack native, React 19.2, caching opt-in through use cache and Partial Prerendering.
2. Auth uses @supabase/ssr, not auth-helpers, and the new publishable and secret API keys.
3. The room is defined by QR check-in and Supabase Realtime presence. Browser BLE is removed from the pilot. Native micro-proximity is a later, native-only enhancement.
4. The FastAPI proximity service is deferred out of the pilot. Pilot runs on Next.js plus Supabase.
5. Realtime scaling is plan-aware: Pro for the pilot, a deliberate Team or self-hosted choice before any large room, and re-track presence on visibilitychange.
6. iOS PWA reality: recap stays on email, nudges live in the home area with push as a bonus, the install prompt is a custom iOS-aware UI, and Screen Wake Lock holds the screen during an event.
7. The draft layer defaults to Sonnet 4.6, with prompt caching, and the model string is corrected.

None of these touch the experience, the data model, or the non-negotiable rules. They make the stack current and the proximity story honest.

---

## Sources

Primary documentation and corroborating references consulted for this pass:

- Next.js 16 release and upgrade guides, nextjs.org/blog/next-16 and nextjs.org/docs (caching, Server Components, version 16 upgrade)
- Next.js 16.2 release notes, nextjs.org and InfoQ coverage
- Web Bluetooth browser support, testmuai.com learning hub and the W3C public-web-bluetooth working group archive
- Supabase Realtime limits and presence, supabase.com/docs/guides/realtime/limits and production write-ups
- Supabase Auth server-side, supabase.com/docs/guides/auth/server-side and the @supabase/ssr guidance
- PWA on iOS, magicbell.com and mobiloud.com 2026 guides, plus Safari 18.4 and iOS 26 notes
- Claude API models and pricing, Anthropic docs at docs.claude.com and current model and pricing references

*Verify any plan-specific number, especially Supabase connection caps and current pricing, at the source before architecting around it. Versions and limits move.*
