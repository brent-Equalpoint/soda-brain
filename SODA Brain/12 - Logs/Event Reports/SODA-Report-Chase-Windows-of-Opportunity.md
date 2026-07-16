# SODA Event Report — Chase Bank: Windows of Opportunity (Lunch & Learn)

**Date:** July 9, 2026 · **Host:** Chase Bank × Futureland ·
**Attendees:** _[need]_ · **Status:** Live event complete.

> ⚠️ **Working draft.** The findings are complete (Brent's field notes, 2026-07-15). The
> headcount and the Admin → Recap metrics fill the **_[need]_** slots.

---

## TL;DR

Windows of Opportunity ran SODA live with Chase Bank. The night's story was **the door**: the
event stack asked guests to scan **three separate QR codes** plus a separate Eventbrite check-in
before they ever reached the room, SODA's own sign-up leaned on email codes, and the combination
produced long onboarding times — with **older attendees giving up fastest**. One guest was
blocked outright by a Cloudflare challenge at login. And by the time SODA's closing survey
appeared, the crowd had already been asked to complete two other surveys that day. Every one of
these findings has a concrete answer — two are already live in production, and the door redesign
they pointed to has become the product's active direction.

## The night in numbers *(from Admin → Recap)*

- Checked in: **_[need]_** · Connections made: **_[need]_** · Matches surfaced: **_[need]_**
- Survey responses: **_[need]_**

## What we heard → what changed

1. **The door took too long — three QR codes plus a separate Eventbrite entry.** SODA was one
   stop in a stack of scans and sign-ins, and the cumulative time is what guests actually feel.
   **What's changed:** SODA's own step is now dramatically shorter (see #2), and the operational
   fix is consolidation — **one QR at the door** for SODA, with Eventbrite check-in handled by
   staff off the guest's phone. For future co-hosted events we treat "how many scans does a
   guest perform" as a number to design, not an accident.
2. **Sign-up was slow, and older guests gave up quickest.** The root cause: phone sign-up wasn't
   enabled on the production sign-in configuration, so everyone fell back to email codes —
   leaving the app to hunt an inbox, sometimes returning to a reset screen, waiting out a resend
   timer. **✅ Fixed and verified live (July 15):** phone-number sign-up is now a first-class
   door — the code arrives by text and autofills from the keyboard; email is optional. For the
   least-patient guest, sign-up is now: phone number → tap the code → in.
3. **One guest blocked by a Cloudflare issue at login (possible third-party QR scanner).** Our
   sign-in provider's bot protection runs on Cloudflare, and QR-scanner apps that open links in
   their own built-in browsers can fail that check. **What's changed:** bot protection has been
   re-tuned to its adaptive mode (challenges only suspicious traffic), and door guidance is to
   scan with the phone's native camera, not a scanner app. We watch for recurrence.
4. **Survey fatigue — SODA's survey landed after two others that day.** People detest surveys;
   the data still matters. **What's changed:** SODA's survey is host-editable per event, so
   co-hosted nights should run ONE short survey (2–3 questions) agreed between partners, inside
   SODA, replacing the pile. The 48-hour reconnect window (shipped July 14) also means the recap
   link can carry the survey *after* the room, when guests aren't burned.
5. **"We planned how to open the door for easier onboarding."** That plan is now the product's
   active direction, and the first piece already exists: SODA can now run **account-less entry**
   (built July 15 for showcase/education rooms — scan one QR, type a name, you're in, no
   account at all). Bringing that "express lane" posture to general events is the onboarding
   redesign currently in decision.

## Since this event

The weeks following this run shipped the largest product push so far, all live at grabsoda.app:
a redesigned attendee card, celebration moments the host can fire to every phone, a 48-hour
post-event reconnect window, identified surveys with guest disclosure, a performance pass sizing
rooms for 150–200 guests, and ephemeral "showcase rooms" that run a full event while keeping
zero attendee data — built for schools and demos.

*Prepared by the SODA build team · Futureland / Equalpoint · grabsoda.app*
