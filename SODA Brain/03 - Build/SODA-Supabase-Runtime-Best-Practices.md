# SODA Supabase Runtime Best Practices

*How the database should behave in action: taking in data, being queried, and being logged, with the mistakes most beginners get wrong and how SODA avoids them. A companion to the technical build structure and the data-flow QA guide. A product of Equalpoint, Inc.*

Supabase is Postgres, so the database does exactly what you tell it, including the slow and unsafe things. The defaults are tuned for getting started, not for a live room of five hundred phones. This guide is the operational layer: the patterns that keep reads fast, writes cheap, the room quiet, and the data sealed to the right people. Each section names the common mistake, the fix, and how SODA applies it.

---

## 1. RLS, secure and fast at the same time

This is the single area beginners get wrong most, in two directions at once. They either leave RLS off and leak data, or they turn it on naively and the room crawls.

**The mistake: leaving RLS off.** Supabase creates tables with Row Level Security off by default when you use SQL or the table editor. A table with RLS off is readable by anyone holding the public key. This is a real, repeated breach pattern, not a theoretical one.

**The fix.** Enable the project toggle that forces RLS on for every new table, and treat a table without a policy as a bug. SODA already holds this as a rule: RLS on every table at creation, the migration that makes a table includes its policy.

**The mistake: slow policies.** A policy runs on every row. Calling auth.uid() directly, or a subquery, per row, turns a fast query into a sequential scan. On large tables this is a hundredfold slowdown.

**The fixes, all of them:**

- **Wrap auth functions in a select.** Use `(select auth.uid())` instead of `auth.uid()`. This makes Postgres run an initPlan that caches the result once per statement rather than once per row. The same applies to auth.jwt() and to security definer functions that return a fixed value. Reported improvements exceed a hundredfold on large tables.
- **Index every column a policy touches.** Any column in a policy USING or WITH CHECK clause that is not already a primary key needs an index. For SODA that means indexing recipient_profile_id on nudges, profile_a and profile_b on connections, profile_id and event_id on attendances, and event_id plus profile_id on event_roles.
- **Add the role to the policy.** Use `TO authenticated` on policies. Never rely on auth.uid() alone to keep the anonymous role out, name the approved role explicitly, which also lets Postgres skip the policy for roles it does not apply to.
- **Restructure subqueries to filter from the user inward.** Prefer `event_id in (select event_id from event_roles where profile_id = (select auth.uid()))` over a policy that scans the outer table and runs a subquery per row. Move heavier join logic into a security definer function and call `(select my_function())`.
- **Hide security definer functions from the API.** Functions used in RLS can be called through the API. If a function's result would leak, put it in a private schema that is not exposed.

**The realtime tie-in.** Realtime subscriptions respect RLS. A guest only receives the row updates their SELECT policy allows. So the SELECT policies must cover exactly the rows a guest should see live in the room, no more, no less. The private nudge stays private precisely because its SELECT policy is recipient-only.

---

## 2. Reads, fetch less and fetch smart

**The mistake: select star and unbounded reads.** Beginners pull every column and every row, then filter in the app. It works with ten rows and dies with ten thousand.

**The fixes:**

- **Select only the columns you use.** Ask for `select('id, name, warmth_score')`, never the whole row, never the implicit star.
- **Always paginate.** Use a range or a keyset cursor. A contacts rolodex or an events history is never fetched all at once.
- **Kill N+1 patterns.** Do not loop a query per item. Use one embedded select that pulls the related rows in a single round trip, the relational join Postgres is built for.
- **Index what you filter and sort on.** Foreign keys especially. An unindexed foreign key is the most common performance finding in the advisor.
- **Check the plan.** Run EXPLAIN ANALYZE on anything that feels slow and confirm it uses an index rather than a sequential scan, before and after adding the index.

For SODA, the read-heavy surfaces are the Room View presence, the contacts rolodex, and the events history. Each one gets scoped columns, pagination, and indexed filters from the first build, not as a later fix.

---

## 3. Writes and functions, batch and keep light

**The mistake: row-by-row writes and heavy functions in the request path.** Inserting one row per call in a loop, or doing slow work inside a request, ties up connections and stalls the room.

**The fixes:**

- **Batch writes.** Use a single upsert with many rows rather than a loop of inserts.
- **Keep request-path functions under about a second.** Push heavy or long work to a background job or a scheduled task.
- **Use pg_cron for scheduled work.** The warmth decay sweep runs on a schedule inside Postgres, which SODA already does, so it never sits in a user's request.

---

## 4. Connections, pooling for a serverless world

**The mistake: direct database connections from serverless code.** Postgres has a hard connection ceiling, around a hundred by default, and each connection costs memory. A serverless function that opens a direct connection per invocation exhausts the database in a traffic spike, which a live event is by definition.

**The fixes:**

- **Go through the Supabase client for app queries.** SODA's rule that nothing touches the database directly from the client, everything through a route handler using the Supabase client, means the managed PostgREST layer handles pooling for the normal path. This is the main reason the rule exists, beyond security.
- **If you ever use a direct Postgres driver in serverless,** for a migration tool or a direct query layer, use the transaction-mode pooler, port 6543, not the direct port 5432. Keep the per-function connection limit low, often one. If the driver uses prepared statements, set the pooler-compatibility flag.
- **Use session mode, port 5432, only for long-lived connections,** a persistent worker or a migration run, not for serverless.
- **Avoid double pooling.** If a driver pools and the pooler pools, shrink the driver's pool and let the pooler do the work.

---

## 5. Realtime, keep the room quiet

**The mistake: subscribing to everything and updating constantly.** Realtime is a websocket firehose if you let it be. Every enabled table and every noisy update is traffic each connected phone has to process.

**The fixes:**

- **Only enable realtime on the tables that need it.** For SODA that is presence, the moments the host fires, and a guest's own nudges. Static data is read normally, not subscribed.
- **Minimize updates on realtime tables.** Each update is a message to every subscriber. Write deliberately, not chattily.
- **Throttle client events.** Cap events per second on the client so a burst does not overwhelm the UI.
- **Re-track presence on a visibility change** with a fresh timestamp, so a guest who backgrounds the tab and returns does not linger as a ghost in the room.
- **Scope channels to the event,** and remember the plan tiers, roughly two hundred concurrent on Free, around five hundred on Pro, higher on Team or self-hosted, so a large room is a capacity decision made before the night. See the stack research for the full note.

---

## 6. Logging and observability, see it before users feel it

**The mistake: flying blind, then over-logging.** Beginners ship with no visibility into slow queries, then panic-log everything including sensitive data, turning the log into an unmanaged second copy of the database.

**The fixes:**

- **Enable pg_stat_statements** and review the slowest and most frequent queries regularly. Reset the stats after you optimize so the next read is clean. It keeps the latest several thousand statements, not forever.
- **Run the Security and Performance advisors.** Supabase ships built-in advisors that flag the exact beginner mistakes as named findings: unindexed foreign keys, RLS disabled in public, a policy that re-evaluates auth per row, missing primary keys, unused or duplicate indexes, exposed security definer views, functions with a mutable search path, anonymous sign-ins allowed, sensitive columns exposed. Clear them before the pilot.
- **Use EXPLAIN ANALYZE** to confirm an index is actually used.
- **Log meaning, not noise.** SODA's audit logs are deliberate and small: operator_access_log for every master-key reach, and draft_feedback for the discard signal. Do not log message bodies or personal data beyond what those purposes need. The log is a record, not a data store.

---

## 7. The security mistakes that quietly leak data

A short list of the breaches that happen by default, each with the guard.

- **RLS off in public.** Enable the force-RLS toggle, and verify a table is not readable with only the public key. Test from outside.
- **The secret key in the browser.** The service or secret key bypasses RLS. It lives server-side only, never in a client component. SODA's no-direct-client-database rule enforces this.
- **auth.uid() as the only anon guard.** It is not enough. Add TO authenticated to the policy.
- **Exposed security definer views and functions.** They run with elevated rights and can be called from the API. Keep sensitive ones in a private schema.
- **Sensitive columns exposed.** Do not return columns a role should not see, and let the advisor flag them.
- **Every policy tested with a second account.** A policy you have not tried to break with another user is a policy you have not tested. This is already in the data-flow QA guide.

---

## The pre-pilot Supabase checklist

Run this once before any real room. Most items map directly to a built-in advisor finding.

- Force-RLS toggle on, every table has a policy, none readable with the public key alone.
- Every RLS policy wraps auth.uid() and auth.jwt() in a select.
- Every column used in a policy is indexed.
- Every policy names TO authenticated rather than relying on auth.uid() to exclude anon.
- Every foreign key is indexed, no unindexed-foreign-key findings.
- No missing primary keys, no unused or duplicate indexes.
- Security definer functions used in RLS live in a private schema.
- App queries select specific columns and paginate, no select star, no unbounded reads.
- Realtime is enabled only on presence, moments, and nudges, and presence re-tracks on visibility change.
- Serverless reaches the database through the Supabase client or the transaction pooler, never a direct connection per invocation.
- pg_stat_statements is on, the Security and Performance advisors are clear, slow queries checked with EXPLAIN ANALYZE.
- Audit logs are limited to operator_access_log and draft_feedback, no message bodies or extra personal data in logs.
- The secret key is server-side only, confirmed absent from any client bundle.

---

## What we already had, and what this adds

To be honest about the gap this closes. The infrastructure already held the foundational guards: RLS on every table at creation, which prevents the most common breach, the warmth sweep on pg_cron rather than in the request path, the rule that nothing touches the database from the client, which also gives us managed pooling, the two-call draft gate, and the deliberate audit logs.

What it did not yet hold, and what this guide adds, is the runtime performance and observability layer: the RLS select-wrap and policy indexing that keep secure queries fast, the read hygiene of scoped columns and pagination, the realtime discipline that keeps a full room quiet, the connection pooling rule for any direct driver, and the habit of running the built-in advisors and pg_stat_statements before a pilot. These are the patterns that separate a demo that works for ten people from a room that holds five hundred.

---

## Sources

- Supabase RLS performance and best practices, supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices, and the RLS performance discussion and test repo by Gary Austin
- Supabase database advisors, supabase.com/docs/guides/database/database-advisors, the full list of security and performance findings
- Connection pooling and Supavisor, supabase.com/docs/guides/database/connecting-to-postgres and the Supavisor FAQ
- pg_stat_statements and query performance, supabase.com/docs/guides/database/extensions/pg_stat_statements and the inspect and debugging guide
- General Supabase production best practices, makerkit.dev and leanware.co 2026 guides; CVE-2025-48757 on RLS misconfiguration as reported by security researchers

*Verify any specific behavior against the current Supabase docs before relying on it. Defaults and tooling change.*
