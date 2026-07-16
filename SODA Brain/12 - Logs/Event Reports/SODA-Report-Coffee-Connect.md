# SODA Event Report — Coffee Connect

**Date:** June 17, 2026 · **Host:** Futureland · **Where:** Coffee Connect, Cleveland ·
**Attendees:** 19 · **Status:** Soft pilot complete — engine validated with real people (acts not fired
live). *(Full engineering detail: [[SODA-Pilot-Report-Coffee-Connect]].)*

---

## TL;DR
SODA's **first live run**, and the matching engine proved itself: **145 matches computed live, 62
mutual**, a clear top connector, and a "Most Wanted" gap analysis the host found genuinely useful. The
room works. The pilot surfaced a confusing sign-in and chips too generic to match well — both since
addressed.

## What worked (validated with real people)
- **Check-in via QR + room entry.**
- **Live presence + attendee list** — 19 people captured in real time.
- **Offers / Needs chips** in the room.
- **The Intel / matching engine — the standout:** 145 matches, 62 mutual, top connector **Lorena
  Medina (18 matches)**, average overlap computed, and a **"Most Wanted" gap analysis** that flagged
  the room's real unmet needs: *Looking for Work (5 need / 0 offer)* and *Funding (4 need / 0 offer)*.
  That's intelligence no name tag could produce — from a 19-person room.
- **CSV export, nudges** (mechanically), **survey, room controls** (Announce / Ops / Admin), **End the
  Night.** Acts confirmed functional (just not fired live).

## What broke / what we learned
1. **Sign-in double-email loop (P1).** New users got *two* emails — a confirmation and the code — and
   the confirmation link restarted onboarding, which read as "start over." Root cause: Supabase
   "Confirm email" was on alongside the sign-in-code flow.
2. **Chips too vague to match well (P1).** 14 of 19 offered "Collaboration"; 10 of 19 needed
   "Introductions." When the most common chips are the most generic, the match list is long but
   low-signal. (The Most Wanted section worked *because* those chips were specific.)
3. **No room snapshot at close (P2).** "End the Night" made the analytics vanish (CSV only) — the host
   lost the visual summary at the exact moment they most want it.
4. **Nudge quality is downstream of chip quality (P2).** Vague chips → vague nudges; the mechanism is
   sound, the *input* was the problem.

## What we shipped in response
- ✅ **Specific chips — "[category] in [context]"** (e.g. *"Mentorship in design"*). Chips became
  `{category, context}`; matching still keys on category (the proven engine unchanged), and context
  enriches the room, the nudges, the drafts, and the CSV. *(shipped 2026-06-19)*
- ✅ **Closed-event Recap** — a frozen post-night summary (Intel + Most Wanted + top matches + a
  feed-history timeline), reachable from the Manage "Recap" tab and the Analytics page. *(shipped
  2026-06-19)*
- 🔧 **Sign-in double-email** — diagnosed to a **Supabase dashboard toggle** (turn off "Confirm
  email"; the OTP code *is* the confirmation). *(your dashboard action — pending)*
- ⏸️ **Clerk for the front door** — proposed, then **deferred**: it would rewrite ~40 security rules
  for a UX concern; revisit only as its own initiative.
- 📏 House rule set: **no em dashes** in copy or code.

## The takeaway
The engine is real — actionable, room-level intelligence on the very first live run. The fixes weren't
architecture changes; they were a config correction, a data-model improvement (specific chips), and a
post-event surface (the recap).

*A name tag knows you showed up. SODA knows who you became to the room. Coffee Connect proved the room.*
