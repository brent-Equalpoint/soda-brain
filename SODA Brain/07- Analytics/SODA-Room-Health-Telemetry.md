# SODA Room Health Telemetry

*How to know whether the room is working without ever reading a message. The privacy guarantee is architectural, not a promise.*

**Version 1.0**

---

## 0. The principle

You never needed message content. You needed to know whether the room is working.

**Measure the outcome you want. Investigate the mechanism only when the outcome is missing.**

Three tiers, with a hard line between them:

| Tier | Contents | Analytics access |
| --- | --- | --- |
| **Content** | message bodies | **never.** Not stored in a queryable form, not reachable by the analytics layer. |
| **Metadata** | counts, timestamps, thread lifecycle | yes, disclosed to attendees |
| **Outcomes** | connections, receipts, whys, convene attendance | yes, these are events people knowingly created |

The test for any metric: **would you be comfortable telling an attendee exactly what you measure?**
"We count how many messages you send, but we never read them" is sayable out loud.
"We analyze your conversations to understand engagement" is not. If the honest description makes someone flinch, do not collect it.

---

## 1. Schema, the wall is in the table design

Content and telemetry live in **separate tables**. The analytics layer is granted access to one and not the other. This is what makes the guarantee real: even a curious engineer running a query cannot join their way to a message body.

```sql
-- CONTENT. Locked down. Never touched by analytics.
create table messages (
  id            uuid primary key default gen_random_uuid(),
  thread_id     uuid not null references threads(id) on delete cascade,
  sender_id     uuid not null references attendees(id),
  body          text not null,          -- the only place content exists
  created_at    timestamptz not null default now()
);

-- RLS: only the two participants can read. No service-role analytics role.
alter table messages enable row level security;

create policy messages_participants_only on messages
  for select using (
    exists (
      select 1 from thread_participants tp
      where tp.thread_id = messages.thread_id
        and tp.attendee_id = auth.uid()
    )
  );

-- Analytics role is explicitly denied. This is the wall.
revoke all on messages from analytics_role;
```

```sql
-- METADATA. Derived, contentless, safe to query.
create table thread_stats (
  thread_id        uuid primary key references threads(id) on delete cascade,
  event_id         uuid not null references events(id),
  participant_a    uuid not null,
  participant_b    uuid not null,
  message_count    int  not null default 0,
  first_message_at timestamptz,
  last_message_at  timestamptz,
  -- outcome linkage, the part that actually matters
  produced_connection boolean not null default false,
  produced_receipt    boolean not null default false,
  connection_at       timestamptz
);

-- No body column. No text column. It is not possible to read content from here
-- because content was never written here.
grant select on thread_stats to analytics_role;
```

**Read that last comment again.** The reason analytics cannot see content is not a policy. It is that `thread_stats` has no column in which content could live.

---

## 2. Populating stats without reading bodies

A database trigger updates the counters on insert. It touches `NEW.body` never; it only increments and timestamps.

```sql
create or replace function bump_thread_stats()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into thread_stats (thread_id, event_id, participant_a, participant_b,
                            message_count, first_message_at, last_message_at)
  select NEW.thread_id, t.event_id, t.participant_a, t.participant_b,
         1, NEW.created_at, NEW.created_at
  from threads t where t.id = NEW.thread_id
  on conflict (thread_id) do update
    set message_count  = thread_stats.message_count + 1,
        last_message_at = NEW.created_at;
  return NEW;   -- NEW.body is never referenced. Not once.
end;
$$;

create trigger trg_bump_thread_stats
  after insert on messages
  for each row execute function bump_thread_stats();
```

When a connection forms, close the loop from the other side:

```sql
-- called by the connection-create path, not by the message path
update thread_stats
   set produced_connection = true,
       connection_at = now()
 where participant_a = $1 and participant_b = $2
   and event_id = $3;
```

---

## 3. The signatures (what the shape tells you)

Now the diagnostic. Both behaviors have distinct shapes, and both are visible in metadata alone.

| Pattern | Signature | Meaning |
| --- | --- | --- |
| **Coordination (healthy)** | short thread (3 to 6 messages), goes quiet fast, **followed by a connection** | They found each other and stopped typing because they are talking. The thread going quiet is the success signal. |
| **Hiding (unhealthy)** | long sustained thread, spans much of the event, **produces nothing** (no connection, no receipt, no why) | They are texting instead of walking over. |

The single most useful number: **messages per connection.**

```sql
-- Room health, one query, zero content
select
  e.id as event_id,
  count(*) filter (where ts.produced_connection)                      as threads_that_landed,
  count(*) filter (where not ts.produced_connection)                  as threads_that_went_nowhere,
  avg(ts.message_count) filter (where ts.produced_connection)         as msgs_per_landed_thread,
  avg(ts.message_count) filter (where not ts.produced_connection)     as msgs_per_dead_thread,
  avg(extract(epoch from (ts.last_message_at - ts.first_message_at))/60)
    filter (where ts.produced_connection)                             as mins_to_quiet
from events e
join thread_stats ts on ts.event_id = e.id
group by e.id;
```

Reading it:
- `msgs_per_landed_thread` low (3 to 6) and `mins_to_quiet` low → the feature is doing its job.
- `msgs_per_dead_thread` high and `threads_that_went_nowhere` climbing → people are hiding in their phones.

---

## 4. The stronger move: do not instrument messaging first

Honestly, **do not start here.** Instrument the outcome you actually want.

```sql
-- Room health that never mentions messaging at all
select
  count(*)                                                as attendees,
  count(*) filter (where c.n = 0)                         as connected_zero,      -- the headline
  avg(c.n)                                                as avg_connections,
  avg(case when c.with_why > 0 then 1 else 0 end)         as considered_ratio
from attendees a
left join lateral (
  select count(*) as n,
         count(*) filter (where why is not null) as with_why
  from connections where owner_id = a.id and event_id = a.event_id
) c on true
where a.event_id = $1;
```

`connected_zero` is the number that matters: people who walked in and connected with nobody. A survey never catches them; they do not fill out surveys. You can simply count them.

**Messaging telemetry is a diagnostic you reach for when this looks wrong**, not a surveillance layer you run by default. If connections are healthy, you never think about messages at all.

---

## 5. The intervention (help without watching)

If someone has been in the room a while with zero connections, you do not need to read anything to help them. Use only what SODA legitimately knows: chips, matches, presence.

```json
{
  "trigger": "in_room_minutes > 40 AND connections == 0",
  "nudge": {
    "type": "proximity_match",
    "copy": "Rosa is in the room and looking for exactly what you offer.",
    "action": "open_card",
    "person_id": "rosa"
  }
}
```

This is SODA doing its actual job: pushing someone into the room, using match data, not message data.

---

## 6. Convene: bounded by design

The convene (multiple people, shared chip) is scaffolding, not a product.

| Property | Rule |
| --- | --- |
| **Specific** | forms around one concrete chip ("four of you want a technical co-founder"), never a vibe |
| **Purposeful** | carries a where and a when ("by the window, 10 minutes") |
| **Expiring** | **dies when the event ends.** No zombie group chats. |
| **Outcome-bearing** | what survives is the connections made inside it, not the thread |

```sql
create table convenes (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events(id) on delete cascade,
  chip_label text not null,          -- the one thing it formed around
  place      text,
  meet_at    timestamptz,
  expires_at timestamptz not null,   -- always set. always enforced.
  created_at timestamptz not null default now()
);

-- hard expiry, enforced server-side, not hidden in the UI
-- a convene past expires_at is removed from the API response entirely
```

The expiry is the most important line in the feature. **A temporary structure for a temporary moment.**

---

## 7. Retention

| Data | Retention |
| --- | --- |
| Message bodies | delete at event end + N days. They were coordination, not correspondence. |
| `thread_stats` | keep. Contentless, small, useful. |
| Connections, whys, receipts | keep. This is the ledger. |
| Convene threads | delete at expiry. |

Deleting bodies is not a cost, it is the product's position. SODA is the **record**, not the **channel**.

---

## 8. Acceptance criteria

1. The analytics role has zero read access to `messages`. Verified by a test that attempts the read and expects failure.
2. `thread_stats` contains no column capable of holding message content.
3. The stats trigger never references `NEW.body`. Verified by code review and grep in CI.
4. Room health can be reported end to end without a single query touching `messages`.
5. `connected_zero` is computed and surfaced without reference to messaging.
6. Every convene has a non-null `expires_at` and is removed from API responses after it, not merely hidden client-side.
7. Message bodies are purged on the retention schedule; a test asserts they are gone.
8. Any attendee-facing description of what is measured is accurate and complete. Nothing collected that would not be stated plainly.

---

## 9. The line, plainly

- **Content:** off limits. Never read, never analyzed, never reachable by the analytics layer.
- **Metadata:** fair game, if disclosed. Counts and timing, never bodies.
- **Outcomes:** yours to measure. People knowingly created these events.

The privacy guarantee is not a promise in a policy document. It is a schema in which the query you would not want to run **cannot be written.**
