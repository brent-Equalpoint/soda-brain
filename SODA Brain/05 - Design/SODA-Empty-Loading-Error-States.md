# SODA: Empty, Loading, and Error States

*A screen-by-screen pass across both flows. A product of Equalpoint, Inc.*

What every screen shows when it has nothing to show yet, when it is loading, and when something goes wrong. Folds into the design spec.

## Why this exists

The happy path is specified. This covers the moments around it: the room before anyone arrives, the prompt before answers land, the match that does not come, the code that fails. These are where an app feels broken if no one designed them. Several happen at every single event, so they are not edge cases.

## The three kinds of state

- **Empty.** The screen has nothing to show yet. It still says something intentional.
- **Loading.** The screen is fetching or connecting. A brief, quiet placeholder.
- **Error.** Something went wrong. Plain words for what happened, and the next step.

## Six principles

- **Never blank.** Every empty state says something on purpose.
- **Empty is usually early, not broken.** Frame zero as the night beginning and the room building.
- **One message, one feeling.** Keep an empty state to a line, in the host and brand voice.
- **Loading stays quiet.** A simple indicator and a calm word. No spinner theater.
- **Errors are honest and recoverable.** Plain language, then the way forward. Red appears only here.
- **The private nudge never fails silently.** If no match is found, it degrades into a softer message or a held nudge. It never just vanishes.

Already handled elsewhere: the lifecycle not-yet-open and event-ended states (Event Layer), and the skip-photo fallback to an initials avatar (spine).

## Part One: Attendee states

### Sign-In
- **Loading.** When: the code is being sent, and again while verified. Shows: the button locks to a calm working state, with a line confirming the code is on its way. Copy: “Sending your code.”
- **Error.** When: the code is wrong or expired, or the send failed. Shows: a plain message under the field in red, ready to retry, with a resend. Copy: “That code did not match. Check your email or resend.”

### Photo
- **Loading.** When: a photo is uploading. Shows: the circle shows a calm working state, the guest can still continue. Copy: “Adding your photo.”
- **Error.** When: the upload failed. Shows: a quiet fallback to the initials avatar, with the option to try again later. Copy: “We will use your initials for now. You can add a photo later.”

### The Chip Steps
- **Empty.** When: an event somehow has no chips configured. Shows: a small default set always appears as a floor, plus the write-in option, so the guest can proceed.

### The Room View
The most important empty state in the app, because someone always arrives first.
- **Empty (the early room).** When: the guest is among the first to arrive. Shows: a live count that climbs, a warm headline, one real card, and dimmed placeholders, so the room reads as building. Copy: “The room is filling. You are early. Good.”
- **Loading.** When: the room fetches present attendees on entry. Shows: a skeleton of card shapes where people will appear.
- **Error (reconnecting).** When: the live connection drops mid-event. Shows: a quiet reconnecting indicator that keeps the room on screen. Copy: “Reconnecting to the room.”

### The Drop
- **Empty (the waiting wall).** When: the prompt is live but no answers have landed. Shows: the question holds the screen with an inviting empty wall, framed so the guest feels first. Copy: “Answers are landing. Yours can be first.”
- **Loading.** When: the prompt arrives as the host fires it. Shows: a brief beat as the question animates in.

### The Chance
- **Empty (the unpaired guest).** When: an odd round leaves this guest without a partner, or the room is too small. Shows: a warm holding state that promises the next round. Copy: “You are up next round. Hang tight.”
- **Loading.** When: the host has fired pairing and matches are forming. Shows: a brief shuffling beat.

### The Nudge
- **Empty (no match).** When: no strong match is found at nudge time. Shows: a graceful fallback in the private purple treatment, a held nudge that may arrive later, or a soft message pointing back to the room. It never vanishes. Copy: “No single match stood out yet. The night is not over. Keep working the room.”
- **Loading.** When: matching runs as the host sends nudges. Shows: a brief private beat in the purple treatment.

### The Survey
- **Loading.** When: the survey is submitting. Shows: the button locks to a working state. Copy: “Sending your answers.”
- **Error.** When: the submission failed. Shows: a plain retry that preserves everything entered. Copy: “That did not send. Your answers are saved. Try again.”

### Returning Guest Recognition
- **Empty (thin history).** When: a returning guest has little prior history. Shows: a graceful greeting that welcomes them back without inventing a history. Copy: “Welcome back. Good to see you again.”

### The Recap Email
- **Empty (zero connections).** When: a guest made no connections. Shows: a recap that affirms showing up and points forward, still carrying who was in the room. Copy: “You showed up. That is the first move. Here is who was in the room.”

## Part Two: Host states

### Command Center
- **Room View and Live Stat Bar, empty.** When: the event just went live and no one has scanned in. Shows: an empty room grid and zeros that are clearly a starting point. Copy: “No one has scanned in yet. The room fills here.”
- **Activity Feed, empty.** When: nothing has happened yet. Shows: a quiet placeholder so the feed reads as ready. Copy: “The night starts here.”
- **Sync Control, empty.** When: the prompt is fired and no responses are in. Shows: a response count at zero and an empty feed framed as waiting. Copy: “Waiting on the first answer.”
- **Chance Control, empty.** When: the room is too small or odd to pair cleanly. Shows: a clear note on why pairing is limited and how the unpaired guest is held. Copy: “Room is small. One guest will hold for the next round.”
- **Nudge Control, empty.** When: no matches are ready to send. Shows: a queue at zero with a calm line. Copy: “No matches ready to send yet.”
- **Survey Monitor, empty.** When: no responses have come in. Shows: a zero state framed as expected. Copy: “No responses yet.”
- **Intelligence View, empty.** When: too few profiles to show a pattern. Shows: a held state explaining patterns appear as people join. Copy: “Not enough signal yet. Patterns appear as the room grows.”
- **Connection Status Badge, error.** When: the realtime link drops. Shows: a clear disconnected or reconnecting state, so the host knows the acts may not fire until it recovers. Copy: “Reconnecting.”

### Admin Panel
- **Chip Queue, empty.** When: nothing is waiting for review. Shows: a clean zero state so it reads as caught up. Copy: “Nothing to review. You are caught up.”
- **Matches and Survey Panels, empty.** When: the event has not produced data yet. Shows: zero states framed as the night being early. Copy: “Nothing here yet. It fills as the event runs.”
- **Export Panel, loading.** When: an export is being prepared. Shows: a working state with the control locked. Copy: “Preparing your export.”
- **Export Panel, empty.** When: an event has no activity to export. Shows: a plain note rather than an empty file. Copy: “No data to export yet.”

## Part Three: Cross-cutting and priority

### Loading and connection, everywhere
Any screen that fetches data shows a brief, quiet placeholder, a skeleton of the shape to come, never a blank or a frozen tap. Because the live acts depend on a realtime link, a dropped connection anywhere shows a calm reconnecting state that preserves what is on screen and restores quietly. The host sees this through the connection badge; the guest sees a small, non-alarming indicator on the room.

### Which states happen at every event
Build first, these happen every time:

- The empty early room. The first guests always arrive to a near-empty room.
- The Drop waiting wall. There is always a gap before the first answer.
- The Nudge no-match fallback. Someone almost always lacks a clean match.
- The Command Center and Admin zero states. Every night starts at zero.
- Sign-in errors. Wrong or expired codes are common.

Handle, but lower priority:

- The Chance unpaired guest. Only on odd or very small rooms.
- Photo upload failure. Uncommon, and the initials fallback cushions it.
- The thin-history returning guest and the zero-connection recap. Real, but edge.
- Export with no data. Rare, since exports happen after real events.

The rule of thumb: the first guest and the no-match guest are not edge cases. Design their states with the same care as the happy path.

### How this folds in
Each state attaches to a screen already specified in the design spec or the event layer. When the remaining attendee screens are specified and the spine goes into Claude Design, these states are generated alongside their screens, using the same foundation. Four states carry paste-ready prompts: the empty early room, the waiting wall, the unpaired guest, and the no-match nudge.

*A name tag knows you showed up. SODA knows who you became to the room.*