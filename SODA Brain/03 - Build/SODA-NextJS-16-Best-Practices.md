# SODA Next.js 16 Best Practices

*The tips and tricks that matter for SODA specifically, mapped to our screens, with a QA pass and confidence levels. A companion to the stack research, the Supabase runtime best practices, and the Clerk auth guide. A product of Equalpoint, Inc.*

Next.js 16 is the most structural release since the App Router. Four defaults changed at once, and each one happens to line up well with what SODA is: a live, dark-mode progressive web app where most of the screen is real-time and only a little is static. This guide names the shifts, the mistakes, and the best use of each in our product.

---

## The four shifts to internalize

1. **Caching is now opt-in.** Everything is dynamic by default, and you cache explicitly with a use cache directive. The old implicit caching is gone.
2. **Turbopack is the default bundler.** Builds are several times faster, Fast Refresh many times faster. Webpack still exists behind a flag.
3. **Middleware became proxy.ts.** The file is renamed and runs on the Node runtime, to make the network boundary explicit.
4. **React 19.2, and the request APIs are async.** params, searchParams, cookies, and headers are now promises you await. This is the change that touches the most files.

---

## 1. Caching, dynamic by default is exactly right for a live room

SODA's core surfaces, the Room View, presence, the moments a host fires, a guest's nudges, are real-time by nature. They should never be cached, and the new default leaves them dynamic without any effort. This is the rare case where the framework's new stance matches the product perfectly.

**Where to actually use cache.** Turn on cacheComponents in the config, then add the use cache directive only to the genuinely static or slow-changing parts: an event's branding, the host name and logo and theme, the design-system shell, a closed event's final recap. Give those a cacheLife window. Place the directive close to the data it wraps, at the component or function level, never up in the layout.

**Two hard rules for SODA.** Never cache anything private. The experimental private cache is not a personalization strategy, and a private nudge or a draft must always render fresh and scoped by access. And in the progressive web app, the service worker caches the app shell only, the icons, fonts, and frame, never the live room data, so a returning guest never sees a stale room.

---

## 2. Rendering, stream the shell and island the interactive bits

SODA's design philosophy is a minimal interactive surface over complete backend pipelines, and Next.js 16 rewards exactly that.

**Keep the tree on the server, push use client to the leaves.** Everything marked use client, and all its children, leaves the server. So mark only the truly interactive leaves: the live presence list that holds a realtime subscription, the QR scanner, the chip editor, the warmth bar animation, the draft approve toggle. Do not make a whole screen a client component because one button is interactive.

**Pass server data into the islands as props.** The presence component is necessarily a client island because it holds a websocket, so fetch its initial state on the server and hand it down, then let the subscription take over. The island stays small and the rest of the screen renders and streams on the server.

**In SODA terms.** The Room View streams its shell and the host chrome instantly while the presence socket connects underneath. The Home screen streams its frame, then each section, the warmth summary, recent events, the contacts rolodex, fills in independently.

---

## 3. Data fetching, no waterfalls

**The mistake: sequential awaits.** Three awaits in a row make the page wait for the sum of all three, and the slowest one holds the whole screen hostage. This is the most common performance bug in the App Router.

**The fixes:**

- **Fetch in parallel.** Use Promise.all when you need everything, or Promise.allSettled when partial data is acceptable and one failure should not blank the page.
- **Include the async params in the parallel batch.** Since params is now a promise, awaiting it separately adds an extra sequential step. Put it in the same Promise.all as the data.
- **Fetch at the component level.** Let each section fetch its own data inside its own Suspense boundary so they load at once, rather than fetching everything in the parent.
- **Deduplicate with React cache.** If two components need the same record, the current user, the event, wrap the fetch in cache() so it runs once.

**In SODA terms.** The Home Overview pulls the warmth summary, recent events, and contact count in parallel, not one after another. The event route awaits its QR token alongside the event fetch, in one batch.

---

## 4. Mutations, Server Actions with the gate intact

Next.js 16 lets you mutate data with a Server Action and no separate API route, then refresh the affected data. This fits most SODA writes: saving profile chips, a host firing a moment, approving a draft.

**Keep the two-call approval gate.** The no-auto-send rule stands. Generating a draft and writing an approved draft remain two distinct steps, whether expressed as two route handlers or two server actions. A Server Action makes the write convenient, it does not collapse the gate.

**Revalidate narrowly.** After a write, invalidate with fine-grained tags, a tag per event or per connection, rather than a broad path revalidation that busts unrelated caches. Since most of SODA is dynamic anyway, there is little to revalidate, which keeps this simple.

**Use optimistic UI for feel.** Let the client reflect the change immediately and let the server stream the confirmed state, so the room feels instant without breaking the server-authoritative model.

---

## 5. The breaking changes that will bite

The migration gotchas, in order of how many files they touch.

- **Await the request APIs.** params, searchParams, cookies, and headers are promises now. Every dynamic route and every place that reads cookies or headers must await them. SODA routes like the event-by-QR path and the contact detail path all change.
- **middleware.ts becomes proxy.ts.** Same logic, new filename, Node runtime. SODA's route protection and the Supabase session refresh live here. Remember to keep any webhook routes public, since they authenticate by signature and will fail silently if the proxy guards them.
- **Route-segment revalidate config is deprecated under the new model.** Replace it with cacheLife on a use cache scope, and replace tag revalidation with the current updateTag and cacheTag primitives, now stable without the experimental prefix.
- **Turbopack is the default.** New builds use it with no action needed. Only reach for the webpack flag if some old plugin has not been migrated. The React Compiler is opt-in and adds build time, so measure whether the re-render gains are worth it for SODA's animation-heavy surfaces before turning it on.

---

## 6. Tips and tricks

- **Use the DevTools MCP for debugging.** Next.js 16 ships a Model Context Protocol integration, which means an agent can inspect routes, builds, and render behavior directly. This pairs well with the agent build system.
- **Tame next/image.** Lock remotePatterns to only the Supabase storage domain so host logos and attendee photos cannot pull from anywhere, keep the qualities list short and intentional, and mark the single most important image, usually the host logo on entry, with a high fetch priority rather than scattering priority hints.
- **Dynamic-import the heavy client pieces.** Load the QR scanner and any chart or map with next/dynamic so they do not inflate the bundle on every screen.
- **Know the two loading tools.** A loading.tsx file handles the route shell automatically, and a Suspense boundary handles sibling sections inside a page. Use the file for the whole route, Suspense for the parts. The error.tsx that catches a segment's errors must be a client component.

---

## Best uses in SODA, screen by screen

The mapping, so the practices land on real surfaces.

- **Entry and QR sign-in.** proxy.ts protects routes and refreshes the session. The event-by-QR route awaits its async token. The host logo loads with high fetch priority as the one image that matters on arrival.
- **Room View.** Dynamic, never cached. The shell and host chrome stream on the server while the presence list, a small client island holding the realtime socket, hydrates from server-fetched initial state.
- **The acts, Drop, Chance, Nudge.** The host firing a moment is a Server Action. A nudge renders fresh and recipient-scoped, never cached, never private-cached.
- **Home, Overview and Events and Contacts.** The frame streams instantly, each section fetches its own data in parallel inside its own Suspense boundary. Static chrome can use cache with a short life, the rolodex paginates.
- **Contact detail.** Async route param awaited alongside the connection fetch. Mostly server-rendered, with only the follow-up draft control as a client leaf, and the approval kept as two steps.
- **Host and operator console.** Server-rendered tables of events and access, mutations as Server Actions with per-event tag revalidation.

---

## QA and confidence

What to trust, and how much.

- **High confidence,** from the official Next.js 16 release notes and current docs and corroborated across multiple 2026 sources: caching is opt-in via cacheComponents and use cache built on partial pre-rendering, Turbopack is the default, middleware is now proxy.ts on the Node runtime, the request APIs are async, React 19.2 ships with an opt-in compiler, and the streaming and parallel-fetch patterns are unchanged in spirit from the App Router and well documented.
- **Medium confidence, verify before relying:** the exact stable status of individual cache primitives across point releases, since use cache, cacheLife, cacheTag, and updateTag moved from experimental to stable around 16.2 and the surface is still settling, and the precise image-config behavior, which has shifted within the 16.x line.
- **A SODA-specific judgment, not a fact:** that the React Compiler is worth enabling. It adds build time and its runtime benefit depends on our render patterns, so it is a measure-then-decide call, not a default.

Verify anything version-specific against the current Next.js docs before building on it, since the 16.x line is moving quickly.

---

## Pre-build checklist

- cacheComponents enabled, use cache applied only to static chrome and closed-event recaps, never to live or private data.
- The service worker caches the app shell only, never room data.
- use client sits on interactive leaves, with server data passed in as props.
- Independent sections fetch their own data inside Suspense boundaries, in parallel.
- All params, searchParams, cookies, and headers are awaited.
- Route protection and session refresh live in proxy.ts, webhook routes are public.
- Writes are Server Actions with fine-grained tag revalidation, the two-call draft gate intact.
- next/image remotePatterns are locked to the storage domain, qualities are short, the entry logo has high fetch priority.
- Heavy client pieces, the scanner especially, are dynamically imported.

---

## Sources

- Next.js 16 release notes, nextjs.org/blog/next-16, cache components, proxy.ts, Turbopack, DevTools MCP
- Next.js data fetching, streaming, and Suspense docs, and Vercel Academy on parallel fetching and async params
- Multiple 2026 deep-dive guides on Next.js 16 and 16.2 caching, the use cache directive, cacheLife and updateTag, and the migration breaking changes
- Next.js 16 performance and server-components guides on streaming, the client boundary, and image configuration

*Verify version-specific behavior against the current Next.js documentation before relying on it. The 16.x line is moving.*
