# SODA Beta Disclosure and Support Reporting

**Build spec for Claude Code. Production, not prototype.**

*Companion prototype: `SODA-Beta-Support.html`. That file is a visual reference only. Read section 12 before copying anything out of it.*

**Version 1.0**

---

## 0. What this builds

Two things, one affordance.

1. **Beta disclosure.** A persistent Beta pill in the app header, and a modal shown once per person telling them SODA is in beta and things may break.
2. **Support reporting.** A one-tap report flow. The person picks a category, optionally writes one line, and SODA attaches the entire technical context automatically.

The pill does double duty: it discloses the beta state and it is the entry point to reporting. **There is no separate support button, and no floating help bubble.**

### The design problem this solves

Nobody standing in a loud room writes a bug report. They tap something, it fails, they shrug, they put the phone away. A blank text box gets you "it didn't work," which is worthless.

So: **the person supplies intent, the system supplies context.** One tap is a complete, valid report.

### The routing insight

A report filed at 7:40pm from inside a live room is not a support ticket. It is **a person who needs help standing forty feet from Nicole.**

Reports created while an event is live push to the ops dashboard in realtime. Reports created after the room closes go to the email digest and the backlog. Same form, different urgency, **decided by the server**, never by the person.

---

## 1. House rules (design law, non negotiable)

These are already locked across SODA. They apply here without exception.

| Rule | Detail |
| --- | --- |
| Typeface | **Public Sans only.** Weights 300 to 900. No second family anywhere. |
| No em dashes | In any copy, ever. |
| No skinny arrows | Never in button labels. |
| **No side outlines** | **Never a left-edge accent stripe.** A card is either clean, or it carries a full border in its state color. This applies to every callout, every severity row, every notice. |
| Green | Confirm and interactive only. Primary buttons, success toasts. |
| Purple | Nudge and needs-attention only. |
| Amber | Beta state, warnings, cooling. |
| Red | Reserved for alarm. Here: blocking severity only. |
| Numerals | `font-variant-numeric: tabular-nums` on any figure in a column. |
| Dark only | Canvas `#111`. There is no light mode. |
| No floating help bubble | It is visual debt, it covers the UI, and it reads as clutter in a room where attention is measured in seconds. |

Tokens: `--canvas:#111 --card:#1a1a1a --surface:#202220 --border:#2a2a2a --ink:#f5f5f5 --muted:#8a8a8a --hint:#5a5a5a --green:#3bd75c --amber:#f59e0b --purple:#a47bff --red:#ef4444`

---

## 2. Components

### 2.1 `<BetaPill />`

Persistent, in the app header, adjacent to the SODA mark.

- Amber pill, uppercase, letter-spaced, weight 700, with a small amber dot.
- Full border (`1px solid rgba(245,158,11,.35)`), tinted fill (`rgba(245,158,11,.1)`). **No stripe.**
- Tapping it opens `<BetaModal />`.
- Renders only when `NEXT_PUBLIC_APP_STAGE === 'beta'`. It must disappear on general release without a code change.

### 2.2 `<BetaModal />`

Shown automatically **once per person**, and on demand whenever the pill is tapped.

Copy, exact:

> **You are early.**
>
> SODA is in beta, so a few things are still being built and some may break. **If something goes sideways, tell us,** and it gets fixed before the next room.

Buttons, in order:
1. `Got it` (primary, green)
2. `Report something` (ghost, opens `<ReportSheet />`)

**Do not add a third sentence.** No data disclaimers, no "features may change." It dilutes the tone and starts reading like a terms of service popup.

**Acknowledgement is server-side**, not `localStorage`. Set `attendees.beta_ack_at` on dismiss. The person changes phones, the modal does not reappear. Auto-show fires only when `beta_ack_at IS NULL`.

### 2.3 `<ReportSheet />`

A bottom sheet. Four sections, in this order.

**a. Category, one tap, required.** A 2x2 grid. This is the only required field.

| Value | Label | Sub |
| --- | --- | --- |
| `broke` | Something broke | it did not work |
| `stuck` | I am stuck | cannot get past this |
| `confusing` | Confusing | not sure what to do |
| `idea` | An idea | you should build this |

Selected state: green border, green-deep fill. **Full border, no stripe.**

**b. Message, optional.** Textarea, 280 char cap. Placeholder: *"One line is plenty. Or say nothing, the tap is enough."*

The description must be optional in the schema and in validation. **The tap alone is a complete report.**

**c. Attached automatically, visible.** A green-bordered panel listing exactly what is being sent, in plain words. Not a technical dump. Render the human-readable version of the context payload (§4), and then this line verbatim:

> **Never attached:** your messages, your notes, or anything you wrote about another person.

This is the same posture as the telemetry spec. The guarantee is shown, not buried.

**d. The human path.** A purple panel, only when an event is live:

> **Need help right now?** [Host name] is in the room. Reports sent during an event show up on their screen in seconds.

Host name comes from `events.ops_contact_name`. Do not hard-code "Nicole."

Submit: `Send report` (green primary). Cancel: ghost.

---

## 3. Schema

```sql
create type feedback_category as enum ('broke','stuck','confusing','idea');
create type feedback_severity as enum ('blocking','stuck','low','idea');

create table feedback_reports (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  attendee_id   uuid references attendees(id) on delete set null,
  event_id      uuid references events(id) on delete set null,

  category      feedback_category not null,
  message       text,                       -- nullable. the tap alone is valid.
  severity      feedback_severity not null, -- inferred server-side. never submitted by client.

  context       jsonb not null default '{}'::jsonb,  -- see section 4
  during_live_event boolean not null default false,

  status        text not null default 'open',   -- open | ack | resolved | wontfix
  resolved_at   timestamptz,
  resolved_by   uuid references attendees(id)
);

create index on feedback_reports (event_id, created_at desc);
create index on feedback_reports (status, severity);

alter table feedback_reports enable row level security;

-- a person can file a report and read only their own
create policy fr_insert_own on feedback_reports
  for insert with check (attendee_id = auth.uid());

create policy fr_select_own on feedback_reports
  for select using (attendee_id = auth.uid());

-- ops reads everything. HOST role ceiling, resolved server-side.
create policy fr_ops_all on feedback_reports
  for all using (auth.jwt() ->> 'role' = 'HOST');
```

Add to `attendees`:

```sql
alter table attendees add column beta_ack_at timestamptz;
```

---

## 4. The context payload

**Collected server-side and client-side, merged on the server. The client never decides what goes in.**

```ts
type FeedbackContext = {
  // where they were
  route: string;           // '/room/[id]/person/[pid]'
  screen: string;          // 'room.person_card'   (human label)

  // who they were, at that moment
  you_state: 'starter' | 'card' | 'verified';
  contact_method: 'email' | 'sms';
  verified: boolean;
  connections_count: number;
  chips_selected: number;

  // the room
  event_id: string;
  event_name: string;
  event_status: 'pre' | 'live' | 'closed';
  minutes_in_room: number | null;

  // the machine
  user_agent: string;
  viewport: { w: number; h: number };
  network: 'online' | 'offline' | 'slow';
  build_sha: string;       // process.env.NEXT_PUBLIC_BUILD_SHA

  // what already went wrong
  sentry_event_id: string | null;   // last Sentry event for this session
  last_error: string | null;        // message only, no stack, no PII
  failed_requests: Array<{ path: string; status: number; at: string }>;  // last 5
};
```

### Never collected, under any circumstance

- Message bodies or thread content.
- Recap notes, connection "why" text, or anything written about another person.
- Contents of any text input other than the report's own `message` field.
- Location beyond the event association.

This is enforceable and must be enforced: the context builder takes an allowlist of fields. **It never serializes arbitrary app state.**

---

## 5. Severity inference

**Severity is inferred, never asked.** Nobody should have to rate their own bug.

```ts
function inferSeverity(c: FeedbackContext, category: FeedbackCategory): Severity {
  if (category === 'idea') return 'idea';

  const live = c.event_status === 'live';

  // blocked at the door during a live room is the worst case in the product
  if (category === 'broke' && live && !c.verified) return 'blocking';
  if (category === 'broke' && live && c.failed_requests.length > 0) return 'blocking';
  if (category === 'broke' && live) return 'stuck';

  if (category === 'stuck' && live) return 'stuck';

  return 'low';
}
```

Rationale, and keep it in the code as a comment: a person who cannot verify during a live event cannot connect with anyone, and connection is the entire product. That is a red alarm. An idea is never urgent.

---

## 6. API contract

```
POST /api/feedback
```

**Request**

```json
{
  "category": "broke",
  "message": "the verify code never came",
  "client_context": {
    "route": "/verify",
    "user_agent": "...",
    "viewport": { "w": 390, "h": 844 },
    "network": "online",
    "sentry_event_id": "abc123",
    "last_error": "OTP request failed",
    "failed_requests": [{ "path": "/api/otp/send", "status": 500, "at": "2026-07-13T19:41:02Z" }]
  }
}
```

**Server responsibilities, in order**

1. Resolve `attendee_id` from the session. **Never trust a client-supplied id.**
2. Resolve `event_id` and `event_status` from the server, not the client.
3. Build the server half of the context (`you_state`, `verified`, `connections_count`, `minutes_in_room`, `build_sha`, `event_name`).
4. Merge with `client_context` through an **allowlist**. Drop anything not in the `FeedbackContext` type.
5. `inferSeverity()`.
6. Insert.
7. Route (§7).
8. Return `{ ok: true, id }`.

**Response**

```json
{ "ok": true, "id": "uuid" }
```

**Rate limit:** 5 reports per attendee per 15 minutes (Upstash). On limit, return `ok: true` anyway and silently drop. A person spamming the button in frustration should never see a rate limit error, that is adding insult to a bug.

**Validation:** `category` must be in the enum. `message` truncated to 280 chars. Empty `message` is valid and must not be rejected.

---

## 7. Routing

```ts
if (context.event_status === 'live') {
  // realtime to ops. the person is in the room right now.
  await supabase.channel(`ops:${event_id}`).send({
    type: 'broadcast',
    event: 'feedback_report',
    payload: { id, name, category, severity, message, context },
  });

  if (severity === 'blocking') {
    await resend.emails.send({ /* immediate page to ops on-call */ });
  }
} else {
  // no event running. it goes in the digest.
  await enqueueDigest(id);
}
```

**Digest:** one email per day via Resend, grouped by severity, to the team address. Not one email per report.

---

## 8. Ops dashboard integration

Reports appear in a panel on the live ops dashboard, subscribed to the `ops:{event_id}` Realtime channel.

Each row:

- **Full border in the severity color.** Red for `blocking`, amber for `stuck`, `var(--border)` for `low` and `idea`. **No left stripe.**
- Person's name, severity pill, the category and message, and a single line of the most relevant context.
- Newest first. Blocking sorts to the top regardless of time.

Context line examples (compose from the payload, do not dump the JSON):

```
Screen: verify · SMS · 2 attempts · unverified · 7:41pm
Screen: card build · chips 0 selected · 4 min idle
Screen: room · verified · 6 connections
```

Each row has one action: `Mark handled`, which sets `status = 'ack'` and `resolved_by`.

The panel sits **below** the `connected_zero` list. A person who cannot connect is still the loudest thing on that screen.

---

## 9. Copy, exact strings

Do not paraphrase these.

| Key | String |
| --- | --- |
| `beta.pill` | Beta |
| `beta.modal.title` | You are early. |
| `beta.modal.body` | SODA is in beta, so a few things are still being built and some may break. If something goes sideways, tell us, and it gets fixed before the next room. |
| `beta.modal.primary` | Got it |
| `beta.modal.secondary` | Report something |
| `report.title` | What happened? |
| `report.sub` | One tap is enough. We already know where you were. |
| `report.category.label` | Pick one |
| `report.message.label` | Anything else, optional |
| `report.message.placeholder` | One line is plenty. Or say nothing, the tap is enough. |
| `report.attached.label` | Attached automatically |
| `report.attached.never` | Never attached: your messages, your notes, or anything you wrote about another person. |
| `report.human.title` | Need help right now? |
| `report.human.body` | {host_name} is in the room. Reports sent during an event show up on their screen in seconds. |
| `report.submit` | Send report |
| `report.cancel` | Cancel |
| `report.success` | Sent. {host_name} can see it now. |
| `report.success_offline` | Sent. It will reach us as soon as you are back online. |
| `report.no_category` | Pick one first |

---

## 10. Offline and failure behavior

The report flow must work when the network does not. A person reporting "the app is broken" is frequently the person whose network is broken.

- Queue the report in IndexedDB on network failure. Flush on reconnect.
- Show `report.success_offline`, never an error. From the person's point of view it is sent.
- If Sentry is unavailable, `sentry_event_id` is null. The report still submits.
- If the Realtime broadcast fails, the row is still inserted. **The database write is the source of truth; the push is a convenience.**

---

## 11. Acceptance criteria

1. The Beta pill renders in the header only when `APP_STAGE=beta`, and disappears without a code change when it is not.
2. The beta modal auto-shows exactly once per person, keyed on `attendees.beta_ack_at`, and never again on a different device.
3. Tapping the Beta pill reopens the modal at any time.
4. A report submits successfully with a category and **no message**. This is not an error state.
5. `severity` is never accepted from the client. Posting a severity in the request body has no effect.
6. `attendee_id` and `event_id` are resolved server-side from the session. A forged id in the request body is ignored.
7. The context builder is an allowlist. A field not in `FeedbackContext` cannot reach the database, verified by a test that posts junk keys.
8. No message body, recap note, or connection "why" ever appears in `feedback_reports.context`. Verified by a test.
9. A report filed while `event_status = 'live'` appears on the ops dashboard within two seconds.
10. A `blocking` report pages ops immediately. An `idea` never does.
11. Reports filed outside a live event do not push to Realtime and appear only in the daily digest.
12. Submitting with no network queues the report and shows the offline success copy, not an error.
13. Rate-limited submissions return success and are silently dropped. The person never sees a limit error.
14. **No component in this feature uses a left-edge accent stripe.** Every stateful card carries a full border or is clean.
15. Public Sans is the only font family loaded.
16. There is no floating help bubble anywhere in the app.

---

## 12. What is in the prototype and must NOT ship

`SODA-Beta-Support.html` is a visual reference. The following exist only to make the prototype demonstrable and are **not part of the product**:

- The demo control buttons (`Beta modal`, `Report sheet`, `Reset`) in the right column.
- The greyed placeholder rows in the app body.
- The right-hand explanation column entirely.
- All hard-coded names (Andre, Priya, Rosa, Nicole) and the sample context strings. **Every one of these comes from real data in production.**
- The `toast()` simulation. Production uses the real toast system.

The prototype also renders the ops rows and the phone frame side by side for explanation. **In production these are two different surfaces in two different applications.** The report sheet lives in the attendee app. The ops row lives on the ops dashboard.

---

## 13. Build order

1. Schema and RLS (§3).
2. `POST /api/feedback` with server-side context, allowlist, and severity inference (§4, §5, §6).
3. `<BetaPill />` and `<BetaModal />` with server-side acknowledgement (§2.1, §2.2).
4. `<ReportSheet />` (§2.3).
5. Offline queue (§10).
6. Ops dashboard panel and Realtime subscription (§8).
7. Resend digest and the blocking page (§7).

Steps 1 through 4 are shippable on their own. A report that lands in a table and gets read the next morning is already a large improvement over no channel at all.
