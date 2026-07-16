# SODA Event Report — Latinos N Tech

**Date:** June 24, 2026 · **Host:** Latinos N Tech · **Attendees:** 25 ·
**Status:** Live event complete. *(Full engineering detail: [[SODA-Pilot-Report-Latinos-N-Tech]].)*

> ⚠️ **Working draft.** Core metrics are in (2026-07-15). Matches/top-connector detail remains
> fixes we shipped — but **not the metrics**: they live in your production **Admin → Recap** and the
> CSV exports for this event, which I can't pull from here. Everything marked **_[need]_** is yours to
> fill (or send me the exports and I'll complete it). One thing to confirm is flagged below.

---

## TL;DR
Latinos N Tech was a 25-person live run. It surfaced three issues — a **front-door /
onboarding trap** (people got stuck after sign-in, before their card existed), **stuck pop-ups on
scroll** (the note send/receive overlays), and **missing emails in the attendee export**. The
trap's "no way out" and the pop-up and email fixes all **shipped to production this week**; the entry
*flow* itself is the headline learning, now feeding the UI overhaul.

## What broke / what we learned
1. **Front-door / onboarding trap — the worst issue of the night, ~20–50 people (confirmed).** After
   signing in, guests landed on a screen offering "enter a code" *or* "your card" — but the card
   didn't exist yet. Tapping into the card path dropped them on the **account page with no clear way
   out**, so they had to back all the way out and **restart**. Some got in fine; some got trapped,
   largely because the card step sat **too close to the entry point**. Part user error, but
   fundamentally a **UX / flow problem**.
   - **✅ Fixed + shipped (the "no way out" part):** a **Cancel** escape in the card builder; a labelled
     **"Home"** on every signed-in screen (including the account page, so it's no longer a dead end);
     and the room landing on the hub instead of an error. *(2026-06-26)*
   - **⚠️ Still a learning (the flow itself):** the entry → card hand-off is too tight and confusing
     before a card exists. This is the **#1 driver of the upcoming [[SODA-Attendee-UI-Overhaul]]** —
     separate "join an event" from "build your card" so a guest can't fall into the card flow by
     accident.

2. **Stuck pop-ups on scroll — note send / receive.** With the room scrolled, the "leave a note" and
   notes overlays opened **below the fold**, so guests had to scroll to find them (or thought nothing
   happened). Root cause (found this week): the screen's entry animation left an invisible transform
   that trapped pop-ups inside the tall room instead of pinning them to the screen. **✅ Fixed +
   shipped:** the animations now end cleanly, so **every** in-room pop-up — note send/receive included —
   centers on screen no matter how far you've scrolled. *(2026-06-26)*

3. **Attendee emails missing from the CSV export.** When you downloaded the attendee list, there were
   no email addresses. Root cause: emails live in the sign-in/auth layer, not on the attendance row,
   and the export didn't pull them in. **✅ Fixed + shipped:** an **Email column** on the attendees
   export (walk-ins added by hand come out blank). *(2026-06-26)* *Note:* this makes attendee emails
   visible to the host — confirm your sign-in consent covers "your email may be shared with the host."

## What worked
_[need — your read: did check-in, the room/presence, the matching, and the survey hold up? Anything
guests reacted well to?]_

## Metrics *(from Admin → Recap; drop answers were 0 — no Drop fired)*
| Metric | Value |
|---|---|
| Attendees | 25 |
| Matches / mutual | _[need]_ |
| Top connector | _[need]_ |
| Connections made | 1 |
| Survey responses | 5 |
| Room open → close (duration) | _[need]_ |

## Still open / next
- **Headline takeaway → the UI overhaul.** The entry → card trap is the clearest signal that the
  onboarding flow needs rework; it's now the lead item in the **Entry & onboarding** phase of
  [[SODA-Attendee-UI-Overhaul]] (separate "join an event" from "build your card").
- _[need — any other issues, guest feedback, or host requests from the night?]_

---

*To finish this report, send me the six metrics above (or the event's CSV exports) plus the location
and your "what worked" read — I'll fill it in and match the Coffee Connect format.*
