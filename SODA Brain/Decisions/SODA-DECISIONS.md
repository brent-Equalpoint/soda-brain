# SODA Decision Log

*The settled calls, one entry each, so neither you nor the agents relitigate them. If a decision changes, add a new entry that supersedes the old one by id. Never silently edit a past decision. Scope marks whether a call is SODA-specific or inherited from the Relational OS engine that SODA sits on.*

---

## SODA-001: Three-level host access

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Access has three levels. Operator is the platform master key. Host Owner controls their own events and can export. Collaborator can run a night but cannot export the list or delete the event. Operator is platform-level on the profile; Owner and Collaborator are per-event roles.
- **Why:** Oversight, suspension, and cross-event support are platform powers, not host powers. Building an owner level above existing accounts later is a painful retrofit, so the Operator exists in the model from day one.
- **Consequences:** event_roles table, profiles.is_operator flag, operator_access_log table. The export gate lives in RLS, not the UI.

## SODA-002: The Operator master key is logged

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Every time an Operator reaches into a host's event, that access is recorded.
- **Why:** A master key is a liability as much as a convenience. Logging makes its use accountable and is disclosed in the privacy policy.
- **Consequences:** operator_access_log row written on every operator read of another host's event.

## SODA-003: Admin and Command are two tools, one account

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** The Admin and the Command Center are two surfaces the same logged-in host moves between, not two separate accounts.
- **Why:** A host builds an event in the Admin and runs it in the Command Center. Splitting them into two accounts would double login and confuse roles.
- **Consequences:** One host session spans both surfaces.

## SODA-004: Chips are kept in Simple Mode

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Event Mode has Full and Simple. Simple quiets the Room View and the three acts but keeps sign-in, the offer and need chips, the survey, and the send-off.
- **Why:** The rolodex, the contacts, and the follow-up nudge all feed on the chips. Simple must switch off the spectacle, not the data.
- **Consequences:** events.mode = full | simple, read by both attendee and host surfaces. Simple still writes attendances and survey responses.

## SODA-005: Event is a container, brand-agnostic

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** An event is a container with a required name and host name, an optional logo, a lifecycle of draft, live, and closed, and its own QR. The host's identity rides on the attendee screens.
- **Why:** The host owns the event experience and its data. SODA is the platform underneath, quietly.
- **Consequences:** events table carries host_name, host_logo_url, status, qr_token.

## SODA-006: Experience-first build order

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Every slice is built front end first: UX flow, prototype against mock data, approve the feel, freeze the API contract, build the backend, wire, ship. No backend table is written before the screen that needs it is prototyped and approved.
- **Why:** The product is the feeling in the room. A backend built before the experience is built on guesses.
- **Consequences:** The seven-step loop in the technical build structure governs every phase. The contract is drawn from the approved screen.

## SODA-007: Dark mode only design system

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** SODA is dark mode only. Near-black canvas, green for interactive and confirming only, amber for timers only, purple always meaning a nudge, red for errors. 8 point grid, 44 pixel touch targets, one dominant element per screen.
- **Why:** The product lives in dim rooms on phones. A single consistent dark system keeps the color meanings unambiguous.
- **Consequences:** Tokens are the single source in styles. Color roles are reserved and not reused.

## SODA-008: Collaborator onboarding is event-specific and role-scoped

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** A collaborator is welcomed to a specific event by name, then given a short tutorial scoped to what their role can actually do. The tutorial is skippable and revisitable.
- **Why:** A collaborator is often helping for the first time. Dropping them into the cockpit cold is how a good helper freezes. Teaching a power their role lacks would mislead them.
- **Consequences:** Onboarding reads the role from the access model. A tutorial nobody can skip or return to becomes a wall.

## SODA-009: Auth is email and code

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Both attendees and hosts sign in with an email and a one-time code, via Supabase Auth. Sessions persist and never expire mid-event.
- **Why:** The room needs a featherweight sign-in. Email and code is fast, familiar, and consistent across attendee and host.
- **Consequences:** If the wider platform standardizes on Clerk, this is the one decision to reconcile before Phase 1.

## SODA-010: Identity is keyed to email, never fragmented

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** One person is one profile, matched on email. A returning person reuses their profile rather than creating a second.
- **Why:** The worst silent failure is one person becoming two profiles, which splits their connections and breaks the rolodex.
- **Consequences:** Exact email match tested before any write. A merge path exists for the rare collision.

## SODA-011: No auto-send

- **Status:** Accepted  ·  **Scope:** Inherited (Relational OS)
- **Decision:** SODA drafts a follow-up message. The person sends it themselves. Nothing leaves on its own.
- **Why:** Trust. A relationship tool that sends on your behalf is a liability the moment it gets one message wrong.
- **Consequences:** Inherited from the Relational OS engine. Enforced across every endpoint.

## SODA-012: The approval gate is two calls

- **Status:** Accepted  ·  **Scope:** Inherited (Relational OS)
- **Decision:** POST /api/draft generates text and writes nothing. POST /api/draft/approve writes history and resets warmth. They never merge.
- **Why:** Generating and committing must be separable so the person can review before anything is recorded.
- **Consequences:** Two endpoints, never collapsed into one.

## SODA-013: The warmth formula is fixed

- **Status:** Accepted  ·  **Scope:** Inherited (Relational OS)
- **Decision:** warmth_score = max(0, round(base_warmth * e^(-0.01 * days_since_contact))).
- **Why:** A stable, predictable decay is the backbone of the relationship signal. Changing the rate changes the product's behavior everywhere.
- **Consequences:** Changing the rate is a spec change, not a code change. Imported from one helper, never reimplemented inline.

## SODA-014: The private nudge is sacred

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** A nudge is readable only by its recipient, enforced in RLS, never visible to a host or another guest.
- **Why:** The quiet introduction only works if it is genuinely private. One leak destroys the trust the feature depends on.
- **Consequences:** nudges table RLS restricts reads to recipient_profile_id.

## SODA-015: Never drop a session mid-event

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Neither an attendee nor a host is bounced to a login while an event is live.
- **Why:** Being logged out mid-room is the worst possible moment, especially for a host driving the night.
- **Consequences:** Session persistence rules. The host is the fallback for a guest, the Operator is the fallback for a host.

## SODA-016: The discard signal is logged

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** When a person dismisses an AI draft, that discard is written to a feedback log.
- **Why:** The discard is the strongest signal the draft was wrong. Leaving it unlogged was a known gap, now closed.
- **Consequences:** draft_feedback table records approved, discarded, and edited signals.

## SODA-017: Supabase over Firebase

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Supabase is the backbone. Postgres for data with RLS, Realtime for presence, pg_cron for the warmth sweep. A FastAPI service handles BLE and proximity.
- **Why:** Postgres reduces lock-in risk and keeps the data layer portable. FastAPI handles the proximity work the browser cannot.
- **Consequences:** Concurrent realtime connections per event is the scaling metric to design against.

## SODA-018: Status and warmth are a derived cache

- **Status:** Accepted  ·  **Scope:** Inherited (Relational OS)
- **Decision:** The stored warmth_score and any status are caches. They must always be recomputable from base_warmth and last_contact_at.
- **Why:** A cache that cannot be rebuilt from source is a liability. The source of truth is the inputs, not the cached number.
- **Consequences:** The nightly sweep recomputes. The QA guide checks cache against a from-scratch recompute.

## SODA-019: Next.js 16, not 14

- **Status:** Accepted (supersedes the earlier Next.js 14 choice)  ·  **Scope:** SODA
- **Decision:** Build on Next.js 16, App Router, Turbopack native, React 19.2. Caching is opt-in through use cache and Partial Prerendering. Floor runtimes at Node 20.9 and TypeScript 5.1.
- **Why:** 16 is current and 14 is two majors behind. Turbopack default gives faster builds for free, and the caching model is now predictable.
- **Consequences:** Server Components by default, use cache only on cacheable reads, dynamic views in Suspense. Keep the build Turbopack-native, a custom webpack config makes the default build fail by design.

## SODA-020: The room is QR plus presence, browser BLE is out

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** For the pilot the room is defined by who scanned the event QR and is present in realtime through Supabase Realtime. Browser Bluetooth is not used. True micro-proximity is a later, native-only capability, out of the pilot.
- **Why:** Web Bluetooth does not run on Safari or any iOS browser and WebKit opposes it. A live event audience is heavily iPhone, so browser BLE would fail for most guests. The spine never needed it.
- **Consequences:** The FastAPI proximity service is deferred out of the pilot. Pilot runs on Next.js plus Supabase. Native proximity, if ever built, needs CoreBluetooth in a native or wrapped app.

## SODA-021: Auth uses @supabase/ssr and the new key model

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Server-side auth uses the @supabase/ssr package with browser, server, and middleware clients. Use the new publishable and secret API keys, not the legacy anon and service_role keys.
- **Why:** auth-helpers is deprecated, all fixes go to ssr. The legacy keys are slated for deprecation by end of 2026.
- **Consequences:** Three client patterns, the secret key server-side only, consistent with no direct Supabase from the client.

## SODA-022: iOS PWA delivery shapes the loops

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** The recap is delivered by email. The follow-up nudge lives in the home area, with push as a bonus for installed users only. The add-to-home-screen prompt is a custom iOS-aware UI showing the manual Share to Home Screen steps. Use Screen Wake Lock in the Room View and Command Center.
- **Why:** On iOS, push works only for installed PWAs and there is no automatic install prompt, so push reaches only a fraction of guests. Storage can be evicted after about a week of inactivity.
- **Consequences:** Never depend on push for a core loop, never depend on client storage for anything that matters, the server is the source of truth.

## SODA-023: Realtime scaling is plan-aware per event

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Pilot on Supabase Pro. Treat about 500 concurrent connections as the line where a large room needs a Team plan or self-hosted Realtime, decided before that event. Re-track presence on a visibility change with a fresh timestamp.
- **Why:** Concurrent connections per event maps onto Realtime plan tiers, and a large Futureland-scale room exceeds Pro. Presence can go stale after a tab visibility change, creating ghost guests.
- **Consequences:** Capacity is an event-by-event decision for large rooms. Verify current caps on the pricing page, since they move.

## SODA-024: Supabase runtime best practices are adopted

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** The build follows the Supabase runtime best-practices guide. RLS policies wrap auth.uid() and auth.jwt() in a select, name TO authenticated, and index every column they touch. Reads select specific columns and paginate. Realtime is enabled only on presence, moments, and nudges. Serverless reaches the database through the Supabase client or the transaction pooler, never a direct per-invocation connection. pg_stat_statements is on and the Security and Performance advisors are cleared before any pilot.
- **Why:** RLS turned on naively can be a hundredfold slower, and the most common breaches and slowdowns come from a small set of beginner mistakes the built-in advisors name directly. These keep a secure database fast when a room is full.
- **Consequences:** A pre-pilot Supabase checklist must pass, mapping to the advisor findings. Foundational guards already held (RLS at creation, pg_cron sweep, no client-side database access, deliberate audit logs); this adds the performance and observability layer.

## SODA-025: Supabase Auth is the single identity system for the pilot, email code plus social login

- **Status:** Accepted  ·  **Scope:** SODA, reconciles and closes SODA-009 and SODA-021
- **Decision:** All SODA users, attendees and hosts and operators alike, authenticate through Supabase Auth. The methods are email one-time code plus social login (Google, Apple, and LinkedIn OIDC), with the email code as the fallback. RLS stays on the simple auth.uid() path for every table. Clerk is not used. Revisit Clerk only if the wider Equalpoint platform standardizes on it and one identity across Equalpoint products becomes a real requirement, in which case it would be added for the host and operator tier alone.
- **Why:** Supabase Auth covers the entire job, email codes, social login, MFA, and RLS, in one system already in the stack. Clerk's advantages for SODA are mostly prebuilt UI and built-in organizations, both of which are weakened here: the locked custom dark design would require restyling Clerk's components anyway, and the host and collaborator roles are already modeled in the event_roles schema. Running one auth system removes a second set of moving parts and the dual RLS-against-the-sub-claim complexity. Cost is not a deciding factor; Clerk is free below ten thousand monthly active users and the per-user pennies are modest even at conference scale, so the earlier cost rationale is withdrawn as overstated.
- **Consequences:** RLS is written once, against auth.uid(), with no Clerk sub-claim variant. Social login bypasses the email-rate-limit wall for any guest who uses it, since no email is sent, which eases the event-burst problem in SODA-027. Each social provider needs its own OAuth app credentials. OAuth redirect flows inside the installed iOS PWA must be verified on a real device during the build. If Clerk is adopted later for platform identity, it returns through the native Supabase Third-Party Auth integration, not the deprecated JWT template.

## SODA-026: Next.js 16 best practices are adopted

- **Status:** Accepted  ·  **Scope:** SODA  ·  Builds on SODA-019
- **Decision:** The build follows the Next.js 16 best-practices guide. Live surfaces stay dynamic by default and are never cached; use cache applies only to static chrome and closed-event recaps, never to live or private data, and the service worker caches the app shell only. use client sits on interactive leaves with server data passed in as props. Independent sections fetch their own data in parallel inside Suspense boundaries. All request APIs are awaited. Route protection and session refresh live in proxy.ts with webhook routes public. Writes are Server Actions with fine-grained tag revalidation, the two-call draft gate intact.
- **Why:** Next.js 16 flipped four defaults at once, and dynamic-by-default, streaming, and deep client boundaries line up precisely with a live, minimal-surface, real-time room. The breaking changes (async params, proxy.ts, deprecated revalidate config) touch many files and need a standing rule.
- **Consequences:** A pre-build checklist must pass. The React Compiler is a measure-then-decide call, not a default. Cache primitive stability and image config should be verified against current docs as the 16.x line settles.

## SODA-027: Resend is the transactional email layer, with the event-burst rate limit treated as a capacity decision

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Resend sends SODA's transactional email: sign-in codes through Supabase custom SMTP, and the post-event recap. A verified sending domain on the app's own domain is configured with SPF, DKIM, and DMARC. The Supabase auth-email rate limit, which defaults low even with custom SMTP, is raised ahead of every event to cover the expected room size, confirmed against the Resend send limit. Emails send server-side only, always include plain text, and are idempotent. Delivery, bounce, and complaint webhooks are handled once each.
- **Why:** A room is an email spike by definition, hundreds or thousands of sign-in codes in minutes. Supabase's built-in email cannot serve production, and even custom SMTP carries a default auth-email rate limit that is a wall at the door if not raised. Deliverability is decided by DNS, and most failures are misconfigured SPF, DKIM, or DMARC.
- **Consequences:** Email capacity is a pre-event step alongside realtime connection limits. The domain is warmed before large events, with staggering or pre-registration considered for the largest rooms. Exact rate limits are verified against current Resend and Supabase docs before each event.

## SODA-028: Sentry is the error and performance monitor, configured for Next.js 16 and scrubbed of PII

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** Sentry monitors SODA across client, server, and edge. Setup uses the current Next.js pattern: instrumentation-client.ts, sentry.server and edge configs, and instrumentation.ts exporting onRequestError as captureRequestError, with withSentryConfig wrapping next.config and source maps uploaded. Errors are captured at full rate, traces sampled lower in production, Session Replay on error with masking confirmed. No email address, sign-in code, nudge content, or connection detail is ever sent; cookies, auth headers, and request bodies are stripped. Releases and environments are tagged, a tunnel route is used, and spans wrap the presence connect, draft generation, and check-in.
- **Why:** The product promises never to drop a session mid-event, and a live room is the highest-stakes, hardest-to-reproduce surface. Sentry gives client-through-edge capture with readable traces and on-error replay, which turns an event-night failure into a fixable report. An error payload is also the easiest place to leak protected data, so PII scrubbing is non-negotiable.
- **Consequences:** Sample rates are an event-size and quota decision, set then tuned across the first pilots. Config file names and required SDK version are verified against current Sentry docs, since the Next.js SDK setup has changed more than once.

## SODA-029: Vercel is the hosting platform

- **Status:** Accepted  ·  **Scope:** SODA
- **Decision:** SODA is hosted on Vercel. The earlier architecture also ran on Vercel; the rebuild stays on it. Cloudflare was considered and is not used. The app runs as a Next.js 16 deployment on Vercel, with Supabase as the data and realtime backbone and the host serving the app shell, auth, and routing.
- **Why:** Vercel builds Next.js, so on a framework version as new as 16 every feature works there first and without adapter friction, which matters most during a fresh build on a new version. The team has already run on Vercel, so setup is familiar rather than a new learning curve. The main drawback, cost at scale, is a later-stage concern that arrives at revenue scale, and it lands lighter on SODA than on a server-heavy app because most real-time load lives in Supabase, not the host.
- **Consequences:** Deployment, environment variables, and the Sentry and serverless setup target Vercel conventions. Serverless functions still reach Supabase through the transaction pooler per SODA-024, never a direct per-invocation connection. Cost is monitored as traffic grows, with the host kept light by keeping presence and the live room on Supabase Realtime.

## SODA-030: Secrets are managed as Vercel environment variables for the pilot

- **Status:** Accepted (recommended default, override if Doppler is preferred)  ·  **Scope:** SODA
- **Decision:** API keys and secrets for Supabase, Resend, Sentry, and Claude are managed as Vercel environment variables, scoped per environment (development, preview, production) and server-side only. Doppler, used elsewhere in the Equalpoint stack, is revisited only if the wider platform standardizes on it.
- **Why:** One platform for the pilot, matching the consolidation logic used for auth and hosting. Doppler adds a management layer the pilot does not need yet, and Vercel environment variables cover the requirement cleanly.
- **Consequences:** No secret ever reaches the client bundle or the repository; the Supabase publishable key is the only public value. Keys are rotated through Vercel. If Doppler is adopted later, it feeds the same environment variables.

## SODA-031: The QR check-in token is per-event, server-validated, and host-rotatable

- **Status:** Accepted (recommended default)  ·  **Scope:** SODA
- **Decision:** Each event carries a single QR token scoped to that event, validated server-side when scanned, not a per-attendee token. Scanning resolves to the event and the check-in flow. The token is a pointer to an event, not a credential: it does not grant identity, the attendee still signs in through Supabase Auth. The host can regenerate the token to invalidate the previous one.
- **Why:** Keeps the front door simple and safe. Identity comes from auth, so a token only needs to name the event. Server-side validation and host rotation give a kill switch if a token leaks or is shared beyond the room.
- **Consequences:** A leaked token lets someone reach the event sign-in but not impersonate anyone or read data, since RLS still gates everything behind a real identity. The host can rotate before or after an event. The token lives on the events table per the data model.

## SODA-032: An accessibility baseline is adopted, the muted token is corrected, and Built means the kit

- **Status:** Accepted  ·  **Scope:** SODA, amends the design foundation
- **Decision:** Three amendments from the design QA audit. First, the muted text token moves from #777777 to #8A8A8A, which raises contrast from 4.22 to 5.47 on the canvas and from 3.89 to 5.04 on cards, clearing AA. Second, a formal accessibility baseline joins the foundation: AA contrast for all text tokens, touch targets of at least 44 pixels, visible focus states on every interactive element, keyboard operability of attendee-critical flows, and reduced-motion respect when the motion layer lands. Third, status vocabulary is fixed: Built means present in the production-bound kit, simulations are Prototyped, and the manifest and inventory are restated accordingly.
- **Why:** The audit confirmed the muted token fails AA, independently verified. The keyboard gaps showed the foundation never stated an accessibility baseline beyond touch targets. And six components read as Built existed only in simulations, an ambiguity that misleads any agent reading the tracker.
- **Consequences:** The token change propagates to the foundation, the kits, and the simulations. The truth-up pass restates component statuses. Future audits hold the build to the baseline.

## SODA-033: Sign-in collects no phone number, and the privacy policy lists social provider data

- **Status:** Accepted  ·  **Scope:** SODA, follows SODA-025
- **Decision:** The phone field is removed from sign-in entirely. SODA collects at sign-in: email, name, the role, offer, and need chips, an optional photo, and the basic profile a social provider shares when social sign-in is used. The privacy policy's full-list statement is amended to match exactly this set, riding the existing pre-pilot counsel review.
- **Why:** No SODA spec ever asked for a phone number and the email-code plus social flow does not need one, so collecting it violated the data-minimal posture and made the privacy policy's full-list claim false. Social provider data is newly real under SODA-025 and must be disclosed.
- **Consequences:** The Claude Design build drops the phone field in the remediation's first pass. The policy placeholder gains one line. The full-list claim is true again, and stays the test for any future field: if it is not in the policy, it is not collected.

## SODA-034: The install layer is browser-first, with install offered after value and webviews handled

- **Status:** Accepted  ·  **Scope:** SODA, extends SODA-022 and SODA-025
- **Decision:** The room is never gated behind installation; the QR opens the full product in the browser. The manifest is SODA-branded with standalone display, dark theme, 192 and 512 plus maskable icons, and description and screenshots for the richer Android dialog. The install sheet is platform-split: a deferred beforeinstallprompt native prompt on Android and Chromium, two-tap Add to Home Screen instructions on iOS, and a Safari note for non-Safari iOS browsers. Install is offered only after value (first connection, the recap email, or a returning guest), a dismissal is remembered, and the sheet never appears in standalone mode. In a detected in-app webview, social sign-in buttons are suppressed, the email one-time code leads, an open-in-browser banner is shown, and the install sheet is hidden.
- **Why:** At a live event every step before the room is drop-off, so the browser is the door and install is the souvenir. iOS offers no programmatic prompt, so the sheet must split by platform. And links opened inside social apps land in webviews where Google blocks OAuth (403 disallowed_useragent) and install is unavailable, which makes the email code the only sign-in that survives the most common social arrival path, a confirming argument for SODA-025.
- **Consequences:** The install sheet component gains platform and webview detection. The QR encodes the canonical event URL with its token; the installed start_url points at home. Third-party iOS browser behavior and current Chrome install criteria are verified against live docs before the pilot, and install is tested on one real Android and one real iPhone.
