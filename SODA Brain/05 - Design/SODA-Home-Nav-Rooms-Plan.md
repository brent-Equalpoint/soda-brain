# SODA: Home, the Nav, and the Life of Rooms

**Status: PLANNED. Nothing built. Waiting on Brent's answers to the decisions at the bottom.**
Written 2026-07-23 from live user feedback Brent collected.

---

## The feedback that started this

1. "Rooms should maybe be in the middle of the nav bar."
2. "The Card tab is redundant. You manage the card from Home anyway."
3. Suggestions for the Rooms screen: **future rooms** and **missed rooms**.

The two nav complaints solve each other: if the Card tab goes away, Rooms can take the
center. And the Card tab CAN go away, because two already-agreed plans (the Home micro
card, the in-event info card) give Home everything the Card screen does.

---

## The three moves at a glance

| Move | What it is | Size |
| --- | --- | --- |
| 1. The door takes the center | Card tab retired, Rooms becomes the centerpiece of the tab bar | Small |
| 2. Home becomes the front room | The card lives ON Home (tap to expand and edit), key card gets a berth, live-event card, "since last night" strip | Medium |
| 3. Rooms grows a future and a past | RSVP front door, future rooms with countdowns, missed rooms kept respectful | Large (new system) |

Moves 1 and 2 ship together (removing a tab forces the bar to change anyway).
Move 3 is its own build with its own decisions.

---

## Move 1: The door takes the center

Today's bar: Home / Rooms / Card / People / Inbox (the floating pill, active tab expands).

**Proposed:** Home / People / **ROOMS** / Inbox with Rooms as a slightly raised round
door button in the middle of the pill. The door in the center reads as "this is what
SODA is." Alternative if the raised button feels too loud: a plain four-tab bar
Home / Rooms / People / Inbox with no center emphasis.

**Evolved 2026-07-23 (Brent, after walking the lab):** the center button is not the Rooms
list first, it is **THE LIVE ROOM**. Whenever a room is open, one tap from anywhere puts
you back in it (the real app routes to /room; with no live room it opens Rooms). The door
stays the one symbol; what changes is how it ANNOUNCES a live room. Four icon treatments
are built as a dial in the lab (/design/home-nav-lab): glow halo (recommended, a soft slow
breathing ring per the ambient-motion law), pulse dot (the "live now" dot riding the door),
headcount badge (the live number on the button), and on-air waves (the icon itself swaps).

Notes:
- The door icon already exists in the tab bar (hand-drawn, iOS grammar). The center
  treatment reuses it larger, filled when active.
- `/card` the ROUTE stays alive (deep links, old habits, the key card editor). Only the
  TAB retires. Anything that linked to /card keeps working.
- The live room still lights the Rooms tab (prefix match on /room), unchanged.

## Move 2: Home becomes the front room

Home today: hero (live event or idle), "Your card" rail that links out to /card, the
event code box, Kept warm. The move folds the card in and makes Home the "right now"
screen.

**In this move (ships with Move 1):**
- **The micro card** (the plan already on the books): your real card renders on Home,
  tap to expand into the full card with flip, edit from right there via the accordion
  editor. The separate Card screen stops being the card's home.
- **The key card berth:** the Key Card (QR contact card) currently lives on /card, so it
  needs a new seat. Proposed: a small "Your key card" row on Home under the micro card,
  opening the same viewer/editor it has today.
- **The in-event card** (already ticketed): while you're in a live event, the "In an
  event?" code box swaps for a current-event card showing the event name and live
  headcount, tap to enter. The hero already covers "live"; this replaces the then-useless
  code box specifically.

**Next up after that (same screen, separate small builds):**
- **"Since last night" strip:** what happened while the app was closed. New reach-outs,
  a note that landed, a survey waiting. Feeds from data we already have (inbox,
  connections, survey done-flags). No new tables expected.
- **Sharpen nudges:** when the card is missing a piece (no line, no focus), a quiet
  prompt that opens the editor AT that row. The editor's deepLink prop already exists;
  this is the wiring it was built for.
- **"Next room" slot:** placeholder until Move 3 exists, then it shows your nearest
  future room with a calm countdown ("Doors in 3 days").

## Move 3: Rooms grows a future and a past

**The honest scoping note:** today SODA only learns you belong to a room the moment you
walk in with a code. "Future rooms" means an RSVP front door: joining a room BEFORE it
opens. That is a real new system (new table, new join path, host-side visibility), not a
display change. Which is why this move is planned separately and last.

**Future rooms:**
- A room you've RSVP'd to appears under a "Coming up" section: event name, date and time
  (events already carry scheduled start/end + timezone), a countdown, and "Doors open"
  flipping it live the moment the host opens.
- RSVP entry points: the same QR/code shared ahead of the night. The door page notices
  the event hasn't started and offers "Save your spot" instead of a dead end.
- Extras that ride along cheaply once RSVP exists: a "remind me when doors open"
  notification toggle; "share the door" (pass the code/QR along); host sees an RSVP
  count in the Command Center.

**Missed rooms:**
- An event you RSVP'd to but never entered shows up as missed, kept respectful: you were
  not in the room, so no peeking at what happened. Only the shape of the night ("42
  people were in this one") plus the next date if the host runs it again.

**Other suggestions surfaced in this session (parked until asked for):**
- Series memory: rooms from the same host fold together ("Your 3rd Futureland night").
- Invites: a host or friend sends you a room, it lands under Coming up with an accept.
- Year-end "your rooms" recap, same spirit as the wrap.
- Crew tie-in (September): "came with" gets marked at RSVP time instead of at the door.
- Search/filter by host or month once the list gets long.

## What does not change

- The room itself, the wrap, surveys, recaps, People, Inbox: untouched.
- The accordion card editor stays exactly as shipped; Move 2 just gives it a new front
  door from Home.
- Ops/host surfaces: untouched except the RSVP count in Move 3.
- Everything stays native-ready (no web-only tricks in the new nav treatment).

## Build order

1. **Phase A (one session):** micro card on Home + key card berth + Card tab retired +
   Rooms centered. Ships together, robot-walked on a phone viewport before push.
2. **Phase B (small, separate):** in-event card, sharpen nudges (needs Brent's word, it
   changes live room behavior), "since last night" strip.
3. **Phase C (its own plan session before build):** the RSVP front door, future rooms,
   missed rooms. Migration(s) involved; Brent pushes prod migrations himself as always.

## Decisions Brent needs to make before Phase A

1. **Nav shape:** raised center door button, or plain four-tab bar? (Recommend: raised
   door. If it feels loud on the phone we flatten it, five-minute change.)
   **PARTLY ANSWERED 2026-07-23:** Brent wants the center button, as the live-room door
   (one tap back in, any time). Remaining: pick the live icon treatment from the lab dial
   (glow halo / pulse dot / headcount / on-air).
2. **Key card berth:** a row on Home under the micro card, or tucked inside the expanded
   card view? (Recommend: row on Home. The key card is a different object, deserves its
   own line.)
3. **Missed rooms:** show them at all? Only when the host reruns the event? (Phase C
   decision, but it shapes the RSVP table.)
4. **RSVP and accounts:** can someone save a spot without signing in (anonymous-first,
   the Option B spirit), or does RSVP require the Clerk door? (Phase C decision.)
5. **Sharpen nudges:** green light to wire the room's nudge to the editor deepLink when
   Phase B lands?
