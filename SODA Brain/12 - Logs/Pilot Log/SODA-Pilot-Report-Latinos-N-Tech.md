# SODA Pilot Report: Latinos N Tech

**Date:** June 24, 2026
**Location:** _[need]_
**Attendees:** 25
**URL:** grabsoda.app
**Status:** Second live run. The three issues it surfaced (front-door trap, stuck pop-ups, missing emails) were root-caused and shipped to production the same week. Metrics pending from Admin Recap and the CSV exports.

---

## What this report is

This is the post-pilot engineering and product brief for the Latinos N Tech live run, the second SODA
pilot after [[SODA-Pilot-Report-Coffee-Connect]]. The plain-English version for partners is the event
report: [[SODA-Report-Latinos-N-Tech]].

Unlike the first pilot report, this one is mostly a **retrospective, not a build set.** Every issue the
night surfaced was diagnosed and **fixed and shipped to grabsoda.app the same week** (2026-06-26). What
remains forward-looking is one thing: the onboarding flow itself, now the lead item in the
[[SODA-Attendee-UI-Overhaul]]. Each issue below still includes a root cause and the exact code location,
so it reads as a true companion to the Coffee Connect pilot report and lives in the corpus the same way.

---

## Pilot validation: what worked

_[need from your read of the night]_ — the candidates to confirm: check-in and room entry, live presence
and the attendee list, the Offers/Needs chips, the Intel/matching engine, and the survey. Coffee Connect
validated all of these with 19 people; this run is the test that they hold at Latinos N Tech's headcount.
A sentence or two from you here is what makes the report land.

---

## Issue 1 (Priority 0): Front-door / onboarding trap

### What happened

This was the worst issue of the night. After signing in, guests landed on a screen offering "enter a
code" or "your card", but the card did not exist yet. Tapping the card path dropped them on the account
page with **no clear way out**, so they had to back all the way out and restart the sign-in. Some got in
fine; some got trapped, largely because the card step sat too close to the entry point. Part user error,
fundamentally a UX / flow problem.

### Root cause

Two separate causes, stacked:
1. **No escape from the dead-end.** Signed-in screens (the card builder, the account page) had no
   labelled way back to a safe home, so a guest who took a wrong turn was stuck.
2. **The entry-to-card hand-off is too tight.** "Join an event" and "build your card" share the same
   doorway, so a guest can fall into the card flow by accident before any card exists, with nothing to
   orient them.

### Fix — the "no way out" half: shipped (2026-06-26)

- A **Cancel** escape in the card builder so the card step is never a one-way door.
- A clearly **labelled "Home"** control on every signed-in screen, including the account page, so it is
  no longer a dead end. (Deliberately a worded control, not a logo a guest has to guess is tappable.)
- The room now lands on the hub instead of an error, and exits through a labelled **Leave** control into
  a recap and back, so stepping out and back in is one tap each way.

### Code locations

- `apps/web/components/card-editor.tsx` — the single-screen editor with a labelled Cancel escape.
- `apps/web/app/(attendee)/room/_components/room-header.tsx` — the labelled Leave / way-out control.
- `apps/web/app/(attendee)/room/page.tsx` — "Leave the room?" confirm to the recap.
- `apps/web/app/(attendee)/left/page.tsx` — the leave recap (connections + time) with re-entry.
- `apps/web/app/(attendee)/home/page.tsx` — "Back to {host}'s room" re-entry banner + the code box.
- `apps/web/components/screen-header.tsx` — the labelled-header pattern reused across signed-in screens.

### Still open — the flow itself (the real headline)

The "no way out" bleeding is stopped. The deeper fix is structural: **separate "join an event" from
"build your card"** so a signed-in guest can never fall into the card flow by accident and dead-end.
That is now the **#1 driver of the Entry & onboarding phase** of the [[SODA-Attendee-UI-Overhaul]].

---

## Issue 2 (Priority 1): Stuck pop-ups on scroll — note send / receive

### What happened

With the room scrolled down, the "leave a note" and notes pop-ups opened **below the fold**, so guests
had to scroll to find them, or assumed nothing happened. It read as a broken button.

### Root cause

A subtle CSS bug. The screen's entry animation (the keyframes for `rise`, `fade-in`, and `slide-up`)
ended on `transform: translateY(0)` with `animation-fill-mode: both`. That leaves a lingering `transform`
on the element after the animation finishes, and any element with a `transform` becomes the **containing
block** for its `position: fixed` descendants. So the pop-ups, which are supposed to pin to the screen,
were instead trapped inside the tall scrollable room and rendered wherever that container happened to be.

### Fix — shipped (2026-06-26)

Change those keyframes to end on `transform: none` instead of `transform: translateY(0)`. With no
lingering transform, fixed-position pop-ups pin to the screen again. This fixes **every** in-room overlay
at once (note send and receive included), no matter how far the guest has scrolled.

### Code location

- `apps/web/app/globals.css` — `@keyframes rise`, `fade-in`, and `slide-up` now end on `transform: none`.

This is now a locked design-system rule: entry-animation keyframes end on `transform: none`, never on a
zero translate, so a re-skin can never silently reintroduce the trap.

---

## Issue 3 (Priority 1): Attendee emails missing from the CSV export

### What happened

When you downloaded the attendee list, there were no email addresses in it.

### Root cause

By design, an attendee's email lives only in the sign-in/auth layer (Supabase `auth.users`), never on
the attendance row or the public profile. The CSV export read from the attendance/profile data, so it had
no email to print.

### Fix — shipped (2026-06-26)

The export now joins the auth layer server-side: it looks up the signed-in email for each attendee and
adds an **Email column**. Walk-ins added by hand (no real sign-in) come out blank rather than showing a
placeholder address.

### Code location

- `apps/web/app/api/host/export/attendees/route.ts` — admin lookup of emails, blanks for walk-ins, new
  Email column.

### Privacy note

This makes attendee emails visible to the host. Confirm the sign-in consent copy covers "your email may
be shared with the event host", since the host can now export it.

---

## Metrics — _[need from your Admin Recap + CSV exports]_

| Metric | Value |
|---|---|
| Attendees | _[need]_ |
| Matches / mutual | _[need]_ |
| Top connector | _[need]_ |
| Connections made | _[need]_ |
| Survey responses | _[need]_ |
| Room open to close (duration) | _[need]_ |

---

## Direction updates from this pilot

### The onboarding flow rework is now the lead of the UI overhaul
The entry-to-card trap is the clearest signal that the onboarding flow needs structural rework, not just
patches. It is the lead item in the Entry & onboarding phase of [[SODA-Attendee-UI-Overhaul]]: separate
"join an event" from "build your card".

### Modal-centering is a locked design-system rule
Entry-animation keyframes end on `transform: none`. This prevents the containing-block trap that put
pop-ups below the fold. The rule carries into every screen rebuilt in the overhaul.

---

## What the second pilot proved

Coffee Connect proved the engine. Latinos N Tech tested the **door**, and the door is where the friction
was. The good news: every issue the night surfaced was diagnosed to a real root cause and shipped to
production the same week, with the deeper onboarding rework now scoped as the lead of the UI overhaul. The
fixes were not architecture changes. They were an escape hatch and labelled navigation, a one-line CSS
correction with an outsized effect, and an export that finally reaches the auth layer.

*A name tag knows you showed up. SODA knows who you became to the room. Coffee Connect proved the room.
Latinos N Tech proved we can find the friction and fix the door, same week.*
