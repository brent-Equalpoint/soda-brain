# SODA Event Report — Chase Bank: Windows of Opportunity (Lunch & Learn)

**Date:** _[need — early July 2026]_ · **Host:** Chase Bank × Futureland ·
**Attendees:** _[need]_ · **Status:** Live event complete.

> ⚠️ **Working draft.** One finding from this night is fully documented below (with its fix now
> live). Everything marked **_[need]_** — the date, headcount, metrics from Admin → Recap, and
> any other field observations from the room — comes from Brent to complete the report.

---

## TL;DR

Windows of Opportunity ran SODA live with Chase Bank. The night's clearest finding was **friction
at the front door**: phone-number sign-up wasn't available, so every guest had to sign up by
email — which meant leaving the app to hunt for a code in their inbox, and some got stuck
re-requesting codes on a cooldown timer. That finding was traced to its root (a configuration
split between two environments of our sign-in provider) and is now **fully fixed in production**:
guests sign up with their phone number and a text code that autofills from the keyboard — no
inbox, no waiting, no leaving the app.

## The night in numbers *(from Admin → Recap)*

- Checked in: **_[need]_** · Connections made: **_[need]_** · Matches surfaced: **_[need]_**
- Survey responses: **_[need]_**

## What we heard → what changed

1. **"Signing up at the door was slow — where's the phone option?"** Phone sign-up existed in
   the product but wasn't enabled on the production sign-in configuration, so the door fell back
   to email codes: guests left the app for their inbox, the screen sometimes reset on return,
   and the resend timer stranded the unlucky ones. **✅ Fixed and verified live (July 15):**
   phone sign-up is now a first-class door — type your number, the code arrives by text and
   autofills, and email became optional instead of required. The whole leave-the-app failure
   mode is gone.
2. _[need — any other field notes from the night: room energy, host-side observations, guest
   quotes, anything that didn't work]_

## Since this event

The weeks following this run shipped the largest product push so far, all live at grabsoda.app:
a redesigned attendee card, celebration moments the host can fire to every phone, a 48-hour
post-event reconnect window, identified surveys with guest disclosure, a performance pass sizing
rooms for 150–200 guests, and ephemeral "showcase rooms" that run a full event while keeping
zero attendee data — built for schools and demos.

*Prepared by the SODA build team · Futureland / Equalpoint · grabsoda.app*
