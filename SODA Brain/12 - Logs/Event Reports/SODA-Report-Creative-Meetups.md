# SODA Event Report — Creative Meetups: Power of Proximity

**Date:** July 13, 2026 · **Host:** Futureland × S&P Labs · **Attendees:** 48 · **Status:** Live event complete. *(Engineering detail:
[[SODA-Pilot-Report-Creative-Meetups]] and the repo worklog `docs/worklog-2026-07-14.md`.)*

*(Findings: Brent's ten field notes. Metrics: Admin → Recap, filled 2026-07-15. Engineering
detail lives in the pilot brief and the repo worklog.)*

---

## TL;DR

Power of Proximity was SODA's fourth and largest live run (48 people). The core held: check-in,
the live room, cards, matching, connections, and the survey all ran on real people all night. The
night surfaced **ten field notes** — none of them failures of the core, all of them friction —
and **every single one was fixed and deployed to production within 24 hours**. The biggest
product learnings (guests want to reconnect *after* the night, and hosts need the room's pulse at
a glance) each became full features, not patches.

## The night in numbers *(from Admin → Recap)*

- Checked in: **48** · Connections made: **24** · Drop answers: **24** · Survey responses: **10**

## What we heard → what changed (all live since July 14)

1. **"Pop-ups get lost when the page is scrolled."** The page behind any open modal now locks in
   place, app-wide — a pop-up can never open below the fold again.
2. **"A slide-up panel got stuck."** Every panel now closes four ways (tap outside, ✕, drag down,
   Escape) and carries a failsafe so a missed animation can never wedge one half-open.
3. **"Too many toasts at once."** Notifications now queue politely — one at a time, duplicates
   dropped, a beat between them.
4. **"The ops board went stale during the night."** The console now refreshes itself every 25
   seconds while visible and re-syncs the moment you return to the tab.
5. **"People typed paragraphs into chips."** The card builder now coaches "one or two words works
   best" with a live counter — chips stay chip-sized.
6. **"Whose survey answer is whose?"** Hosts now see identified survey responses (name + answers)
   with a matching disclosure to guests on every survey step — informed on both sides.
7. **"Someone walked in mid-question and missed it."** Late arrivals now get a quiet banner —
   "A question is live. Answer it" — that stays until they answer or the host ends it. The
   projector recovers mid-question the same way.
8. **"Where do I get help / report something?"** The app gained a proper menu (Account, Messages,
   Settings, Report a bug, Help center, What's new) and a real Help page.
9. **"I wanted to reach someone I didn't get to meet."** The recap now carries **People from the
   night** — everyone you didn't connect with stays reachable for **48 hours after close**, with
   consent-first reach-outs, then the roster disappears on schedule.
10. **"Did the recap emails all land?"** Bounce-guaranteed addresses (hand-added walk-ins) are now
    screened out of every send, and the attendee export marks them honestly.

## Since this event (the same feedback, compounding)

The two weeks after Power of Proximity turned its lessons into the biggest product push so far,
all live today: the **card redesign** (tap a card and offers/needs swing up in front of it — no
more flip), **celebration moments** (milestones, "your night so far," the top-connectors board —
in good fun, never gamified), the **Moment Creator** (hosts fire a celebration to every phone in
the room from Admin), **phone sign-up** (a text code that autofills — no more email hunting at
the door), and a **performance pass** that readies rooms for 150–200 guests.

## The honest gaps

- Entry still requires an account at the door; the account-less "optimistic entry" flow is
  designed and pending a decision.
- The reconnect window is 48 hours flat; no reminder email yet for people who miss it.

*Prepared by the SODA build team · Futureland / Equalpoint · grabsoda.app*
