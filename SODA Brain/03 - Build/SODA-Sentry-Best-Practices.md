# SODA Sentry Best Practices

*Sentry is the safety net behind the never-drop-a-session promise. It catches what breaks across the client, the server, and the edge during a live event, and hands you the trace to fix it, without ever leaking who was in the room. A product of Equalpoint, Inc.*

---

## 1. Setup the current way for Next.js 16

The configuration moved recently, and stale guides will set it up wrong.

- **Run the wizard.** It logs in, creates the config files, wraps next.config with withSentryConfig, sets up source-map upload, and adds a verification page. Start there rather than hand-assembling.
- **The current client file is instrumentation-client.ts,** not the older sentry.client.config.ts. The wizard also creates sentry.server.config.ts and sentry.edge.config.ts and an instrumentation.ts.
- **Wire the server-error hook.** In instrumentation.ts, the register function loads the server and edge configs by runtime, and you export onRequestError set to Sentry.captureRequestError. This is what captures errors thrown from server components, route handlers, server actions, and the proxy.ts layer. The register function runs once, the hook runs per error, and you need both.
- **Add app/global-error.tsx** to catch errors anywhere in the App Router, and wire onRouterTransitionStart for navigation instrumentation.

---

## 2. Upload source maps, or the traces are useless

Without source maps, every production stack trace is minified gibberish and you cannot tell which line failed during the event. The wizard configures source-map upload through withSentryConfig with an auth token. Confirm a test error shows readable file and line names before you rely on it.

---

## 3. Sample deliberately, because a room is bursty

- **Capture one hundred percent of errors, always.** Errors are the point, never sample them down.
- **Sample traces lower in production than in development.** A common split is everything in development and around a tenth in production, tuned to traffic. During the pilot, turn the trace sample up to learn the room's behavior, then bring it down once it is understood.
- **Use Session Replay on error.** Set replay on error to full and the ambient session sample low. When the room breaks for a guest, replay shows exactly what they saw. If the client instrumentation costs too much on a packed phone, lazy-load replay.

---

## 4. Protect PII, the rule SODA cannot get wrong

An error report is the easiest place to accidentally leak the very things SODA is trusted to protect.

- **Never send identifying or private content.** No email addresses, no sign-in codes, no nudge contents, no connection details. Strip cookies, auth headers, and request bodies before any error leaves the app.
- **Keep the default-PII setting off** and scrub deliberately, rather than trusting that nothing sensitive rode along.
- **Session Replay must mask all text and inputs.** Masking is on by default, but confirm it, so a replay of a broken room never exposes a guest's name, chips, or a private nudge.

This is the same discipline as the deliberate, small logs in the Supabase guide: capture the failure, never the person.

---

## 5. Tips and tricks

- **Tag every release and environment.** Then an error on event night maps to the exact deploy that caused it, which turns debugging from guesswork into a diff.
- **Use a tunnel route.** A consumer progressive web app means some attendees run ad blockers that eat analytics and error events. Routing Sentry through a same-origin tunnel keeps the reports flowing.
- **Filter the noise.** Use the ignore list for benign network and connection-closed errors so the real signal during an event is not buried.
- **Add spans around the risky operations.** Wrap the presence-socket connect, the draft generation call, and the QR check-in in custom spans so you can see their timing and failures distinctly.
- **Alert to a channel for the live window.** During an event, a spike of errors should page someone immediately, not wait for a morning dashboard check.

---

## 6. Best uses in SODA

- **The Room View and presence socket.** The highest-stakes surface. Wrap the connect in a span, replay on error, and watch it closely during the pilot, because a dropped session here is the one failure the product promises to avoid.
- **The two-call draft gate.** Capture failures in generation or approval, never the draft contents, so a broken suggestion is debuggable without exposing what it said.
- **The sign-in and code flow.** Capture failures in the code path, never the code or the email address, so a guest who cannot get in becomes a fixable report rather than a silent drop-off.
- **The pilot generally.** Turn sampling up, alert aggressively, and treat the first few real rooms as the instrumented shakedown they are.

---

## QA and confidence

- **High confidence,** from the Sentry Next.js docs and corroborated across 2026 sources: the instrumentation.ts and onRequestError setup, the move to instrumentation-client.ts, withSentryConfig and source-map upload, the sampling and replay options, and the PII-scrubbing guidance.
- **Verify against current docs:** the exact SDK version required for the hooks and the precise config file names, since the Sentry Next.js SDK has changed its setup more than once and a warning about a missing onRequestError hook is a common symptom of a stale config.
- **A SODA judgment, not a fact:** the specific sample rates. They depend on event size and Sentry quota, so set them, watch the first events, and adjust.

---

## Pre-event checklist

- Wizard-generated config present, instrumentation-client.ts and instrumentation.ts in place.
- onRequestError exported as captureRequestError, app/global-error.tsx present.
- Source maps uploading, a test error shows readable file and line names.
- Errors captured at full rate, traces sampled, replay on error enabled.
- No email, code, nudge, or connection content ever sent, bodies and auth headers stripped, replay masking confirmed.
- Releases and environments tagged, a tunnel route configured, noise filtered.
- Spans around presence connect, draft generation, and check-in, alerts wired for the live window.

---

## Sources

- Sentry for Next.js docs, docs.sentry.io/platforms/javascript/guides/nextjs, manual setup, instrumentation, source maps, tracing, and troubleshooting
- The Sentry Next.js SDK setup wizard and agent-skill reference on instrumentation-client.ts and onRequestError
- Multiple 2026 guides on Next.js instrumentation.ts monitoring, sampling, session replay, and stripping PII from error payloads

*Verify the required SDK version and config file names against the current Sentry docs. The Next.js SDK setup has changed more than once.*
