# SODA: Attendee Flow Map

*The attendee journey, across the event lifecycle. A product of Equalpoint, Inc. Current as of the Event Layer update.*

Every screen a guest can reach, and what moves them forward. Folds in the event lifecycle, so it shows the live path plus what a guest sees when they scan before doors open or after the event closes.

## The event lifecycle is the spine

The lifecycle state decides which path a scan leads to. The host flips it from the Admin.

- **Draft:** host is setting up, the QR is not yet live.
- **Live:** doors are open, the full attendee journey below runs.
- **Closed:** the event has ended, the survey and send-off remain.

## When the scan happens, the lifecycle decides

A guest scans the event QR. What they see next depends on the event state:

- Draft leads to the not-yet-open message.
- Live leads to the journey.
- Closed leads to the event-ended message.

**Branch, event not live: the Lifecycle Message.** Before doors open, a warm not-yet-open note in the host identity. After close, an event-ended note with a path to the survey. This is the screen the lifecycle adds.

## The live journey

1. **Entry QR.** Trigger: the guest scans while the event is live. The eyebrow shows the event name from the event record.
2. **Welcome.** Trigger: tap to begin. Wears the host logo, or the host name in type if no logo.
3. **Sign-In.** Trigger: the system verifies the six-digit code sent to email.
4. **Photo.** Trigger: add a photo or skip. Either advances.
5. **Role Chips.** Trigger: pick a role, then continue. Step 1 of 3.
6. **Offer Chips.** Trigger: pick what you offer, then continue. Step 2 of 3.
7. **Need Chips.** Trigger: pick what you need, then enter the room. Step 3 of 3.
8. **Room View.** The home base. The three acts are launched into this screen by the host. Re-entry by email returns here.
9. **The Drop (Act 1).** Trigger: the host fires the prompt to every phone at once. Answer, then watch the wall fill.
10. **The Chance (Act 2).** Trigger: the host pairs the room. A countdown runs in amber. Go talk to your match.
11. **The Nudge (Act 3).** Trigger: a private match arrives for one person only. One person, one reason.

## After the event closes

12. **Survey.** Trigger: reached by the survey QR or the recap email. Available in the closed state.
13. **Send-Off.** Trigger: survey complete. A warm close in the host identity, soft prompt to the next step.
14. **Recap Email.** Trigger: sent automatically at event end. Profile card, matches, recap link. Wears the host identity.

## The three branches, in short

- **Returning guest.** At Welcome, a known guest sees Recognition first, then enters the room directly because their profile exists.
- **Skip the photo.** At Photo, skipping makes an initials avatar and moves on with no friction.
- **Re-entry by email.** A guest who reopens the link mid-event returns straight to the Room View without repeating sign-in.

*A name tag knows you showed up. SODA knows who you became to the room.*