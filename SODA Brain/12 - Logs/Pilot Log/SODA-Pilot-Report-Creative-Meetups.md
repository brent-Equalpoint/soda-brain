# SODA Pilot Report: Creative Meetups — Power of Proximity

**Date:** July 13, 2026
**Host:** Futureland × S&P Labs
**Attendees:** ~48 *(confirm from Admin → Recap)*
**URL:** grabsoda.app
**Status:** Fourth live run, the largest yet. All ten field notes fixed and shipped to production
2026-07-14 (same-day batch). The partner-facing version is [[SODA-Report-Creative-Meetups]].

---

## What this report is

The post-event engineering brief for the fourth SODA live run. Unlike the first two pilot
reports, this one is a **pure retrospective**: every issue was diagnosed, fixed, gated, and
deployed within 24 hours of the field notes landing. The full engineering detail — root causes,
waves, migrations, and commits — lives in the repo at **`docs/worklog-2026-07-14.md`** (the
event-4 batch: five waves, three migrations, all verified). This file exists so the pilot log
stays complete, one file per live run.

## Pilot validation: what worked

The core at ~48 people, the largest room to date: check-in and entry, live presence, cards and
chips, the matching engine, consent-first connections and in-room chat, the Drop with a live
wall, the survey, and the host cockpit. No outages, no data loss, no security incidents.

## The ten field notes → fixes (all shipped 2026-07-14)

| # | Field note | Fix shipped |
|---|---|---|
| 1 | Modals lost off-screen when scrolled | App-wide ref-counted body scroll lock |
| 2 | A slide-up sheet got stuck | Four ways out + close-guarantee fallback timer |
| 3 | Toast pile-ups | Queued toasts, dedupe, cap; coach toast became inline |
| 4 | Ops board stale / Admin kept prior event | 25s visible-tab refresh; Admin keyed by event |
| 5 | Paragraph-length chips | Length coaching + counter; onboarding cap |
| 6 | Survey answers anonymous to hosts | Identified responses + guest disclosure line |
| 7 | Late joiners missed the live Drop | Server act lifecycle + catch-up banner; /display recovers |
| 8 | No help/report surface | App menu + /help + bug reporting |
| 9 | No way to reach the unmet after close | 48h reconnect window on the recap (People from the night) |
| 10 | Recap emails bounced on walk-ins | Deliverability screening everywhere (`lib/user-emails`) |

Plus, same batch: the Master Ops overhaul (hosts directory, reports dashboard, in-console
analytics), Beta-pill retirement, menu ordering, and the focus-nudge card modal.

## Follow-through (shipped 2026-07-15, same feedback lineage)

Card redesign (frosted swing panel), celebration moments + the Moment Creator, first-names +
coloured match reasons, recap glanceability pass, phone/SMS sign-up fixed on prod Clerk, the room
scale pass (coalesced fan-outs, compute-once recap, chat-poll fix), Showcase Rooms (ephemeral +
card templates), full audit `docs/audit-2026-07-15.md` (no critical/high).
