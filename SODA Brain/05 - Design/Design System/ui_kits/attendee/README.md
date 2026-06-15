# Attendee UI Kit — the spine

A self-contained, click-through recreation of the **attendee side** of SODA: the full mobile spine a guest takes at a live event, plus the between-events Home.

Open `index.html`. A left rail lets you jump to any screen; within the spine, "Next screen →" walks the journey in order.

## Screens

**Onboarding**
- Welcome (new guest) · Returning Guest Recognition
- Sign-In (email → six-digit code, with the failed-code error state — try code `417203`)
- Photo (optional, with initials fallback)
- Role / Offer / Need chip steps (the 90-second micro-profile)

**The room & the three Acts**
- Room View — grid / list / flip, live count, tap a card to comment
- The Drop (Act 1) — waiting wall → answers → reveal names
- The Chance (Act 2) — pairing, conversation starter, amber countdown
- The Nudge (Act 3) — the private, purple match (seen only by you)

**After**
- Survey (star / scale / tag / text, one question at a time)
- Send-Off

**Between events**
- Home — Overview / Events / Contacts rolodex, with follow-up nudges

**Lifecycle**
- Not-yet-open message (draft / closed events)

## Structure

- `index.html` — the navigator + phone frame + router (also a Starting Point).
- `ui.jsx` — shared kit primitives (PhoneFrame, KAvatar, KButton, KChip, etc.) + seed data.
- `onboarding.jsx` — Welcome, Recognition, Sign-In, Photo, ChipStep.
- `room.jsx` — Room View and the three Acts.
- `survey.jsx` — Survey + Send-Off.
- `home.jsx` — the three-tab Home.

These kit primitives mirror the reusable React components in `/components` using the same `styles.css` tokens; the kit is kept self-contained so it renders standalone. In production, compose `window.SODADesignSystem_3bd687.*` (Button, Chip, Avatar, ContactRow, TabBar, …) instead.

*A name tag knows you showed up. SODA knows who you became to the room.*
