# SODA Resend Best Practices

*Resend is SODA's transactional email layer: the sign-in codes that get a guest into the room, and the recap that reaches them after. Two jobs, one provider, and one rate-limit trap that can break a room at the door. A product of Equalpoint, Inc.*

---

## 1. The deliverability foundation, which is mostly DNS

A sign-in code that lands in spam is a guest who never gets into the room. Deliverability is the whole game for SODA, and it is decided before you send a single email.

- **Verify a sending domain and configure SPF, DKIM, and DMARC.** Resend gives you the DNS records and verifies them before you can send. Since 2024 Gmail and Yahoo require a DMARC record, so this is not optional.
- **Most Resend deliverability problems are misconfigured DNS, not the provider.** If codes are landing in spam, audit the SPF, DKIM, and DMARC alignment first.
- **Send from your own domain, never the test domain.** Preferably the same domain the app is hosted on, so a guest sees a sign-in code from a sender they recognize and trust.

---

## 2. The event-burst problem, the one that matters most for SODA

This is the SODA-specific trap, and it is severe. A room is a spike by definition: five hundred people, or five thousand at a conference, all asking for a sign-in code in the same few minutes.

- **Supabase's built-in email cannot do this.** The default Supabase email service is capped at a tiny rate and is explicitly not for production. Configuring a custom SMTP provider like Resend for auth emails is mandatory, not optional.
- **Even with custom SMTP, Supabase imposes an auth-email rate limit, defaulting to thirty new users per hour, that you must raise.** For an event, this default is a wall the room hits at the door. Raise it in the Supabase rate-limit settings ahead of the event.
- **Email providers dislike sudden spikes, which can hurt sending reputation.** Warm the domain before a big event rather than going from zero to thousands cold. For the largest rooms, consider staggering entry, pre-registering attendees, or using Supabase's Send Email Auth Hook to route codes through Resend with full control over timing.

Ignoring this is the difference between a room that fills smoothly and a line of guests staring at a code that never arrives. Treat the email rate limit as a pre-event capacity decision, the same way we treat realtime connection limits.

---

## 3. Sending well

- **The API key is server-side only.** Email is sent from a route handler or server action, never from the client.
- **Always include a plain-text version.** Pass the text alongside the HTML so the message is accessible and deliverable to every client. React Email can generate the plain text for you.
- **Use idempotency so a retry never double-sends.** A network blip should not send a guest two sign-in codes or two recaps. Send with an idempotency key tied to the action.
- **Template with React Email.** Build the code email and the recap as React components, with clear preview text and one obvious action, matched to the SODA dark aesthetic.

---

## 4. Know what happened

- **Subscribe to delivery, bounce, and complaint webhooks.** They tell you whether the code actually arrived, and the payloads are signed so you can verify them.
- **Handle webhook events idempotently.** Process each event once even if it is delivered more than once.
- **Honor the suppression list.** Resend manages bounces and complaints automatically, so a hard-bouncing address stops being retried, which protects reputation.

---

## 5. Best uses in SODA

- **Sign-in codes.** Through Supabase custom SMTP on Resend, with the auth rate limit raised before any event. The highest-stakes email we send, because it gates entry.
- **The post-event recap.** The iOS progressive web app cannot rely on push for an uninstalled app, so the recap reaches guests by email. A natural Resend transactional send, fired after the host closes the event.
- **Optional follow-up reminders.** A gentle nudge to act on a connection, if and when we add it, also rides this layer.
- **Keep transactional separate from anything promotional.** Resend separates the two tracks, and SODA's sends are transactional. Do not mix a marketing list into the same sending reputation.

---

## QA and confidence

- **High confidence,** from Resend and Supabase official docs and corroborated across 2026 sources: domain authentication with SPF, DKIM, and DMARC, the Gmail and Yahoo DMARC requirement, the need for custom SMTP in production, the plain-text and idempotency and webhook practices, and that most deliverability issues are DNS.
- **Verify before the event:** the exact current Supabase auth-email rate-limit default and how high your plan and Resend tier allow you to raise it, and the current Resend per-second send limit, since both change and both decide whether a given room size is safe.

---

## Pre-event checklist

- Sending domain verified, SPF and DKIM and DMARC configured and passing.
- Emails send from the app's own domain, not the test domain.
- Custom SMTP on Resend configured for Supabase auth, the API key server-side only.
- The Supabase auth-email rate limit raised to cover the expected room size, confirmed against the Resend send limit.
- Domain warmed ahead of a large event, entry staggered or pre-registered if very large.
- Every email has a plain-text alternative, sends are idempotent.
- Delivery, bounce, and complaint webhooks subscribed and handled once each.

---

## Sources

- Resend deliverability and docs, resend.com/docs, SPF and DKIM and DMARC, plain text, webhooks, and the official email-best-practices repository
- Supabase custom SMTP and production checklist, supabase.com/docs/guides/auth/auth-smtp and the going-to-production guide, the auth-email rate limits and the Send Email Auth Hook
- Multiple 2026 reviews and Supabase custom-SMTP comparisons covering Resend's free tier, setup, and deliverability

*Verify rate limits and send tiers against the current Resend and Supabase docs before an event. They change, and they decide capacity.*
