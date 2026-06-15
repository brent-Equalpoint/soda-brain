# SODA Component Inventory

**A complete, plain-English catalog of every component in the app, from the QR code at the door to the Command Center the host runs it all from.**

A product of Equalpoint, Inc. Deployed with Futureland Inc. as pilot client.

---

## How to read this

The app has two sides. The **attendee side** is what a guest holds in their hand on their phone. The **host side** is what the people running the event use to drive the night. This document walks through both, in the order a night actually unfolds.

Each component lists four things in plain English:

- **What it is.** The one-line description.
- **What the person sees.** What actually appears on screen.
- **What it connects to.** The components before and after it, or the data it reads and writes.
- **Status.** Whether it exists in the built screens today, or is specified and waiting to be built.

A note on status. The pieces below are grounded in the actual prototype screens that exist now: the survey, the survey flow, the creative sync screen, the room demo, the admin panel, and the command center. Where a component is designed but not yet wired into a built screen, it says so.

A note on the event layer. Five components carry the event layer added after the original prototypes: Event Creation, Host Identity and Branding, and Event Lifecycle Control on the Admin side, Lifecycle State Awareness on the Command Center side, and the Lifecycle Message Screen on the attendee side. These are marked Specified, because they are newly defined and not yet built into the prototype screens. They are what make the app run many events, each wearing its own host identity.

---

# Part One: The Attendee Side

This is the journey a guest takes, in order.

## 1. The Entry QR Code

**What it is.** The physical doorway into the whole app. A QR code printed on a card, a table tent, or shown on a screen at the event.

**What the person sees.** A QR code with a short instruction like "Scan to join the room." Nothing else. No app store, no download.

**What it connects to.** Scanning it opens the web app in the phone browser with the event ID already attached, so everything the guest does next is tied to this specific event. It leads directly to the Welcome screen.

**Status.** Built. Present in the survey flow and room demo as the entry point.

## 2. The Welcome Screen

**What it is.** The first screen the guest sees after scanning. The front door of the experience.

**What the person sees.** A warm welcome, the event name, and a single clear button to begin. For a returning guest, this is where recognition happens (see the Returning Guest Recognition component).

**What it connects to.** Comes after the Entry QR. Leads to Sign-In. Reads the event ID from the scan.

**Status.** Built. Present in the room demo as the welcome screen.

## 3. Sign-In with Email and Code

**What it is.** The lightweight way a guest proves who they are, with no password.

**What the person sees.** A field to enter their name and email. Then a screen to type a six-digit code that arrives in their inbox. Once verified, they are in.

**What it connects to.** Comes after Welcome. Sends a code through the email service, checks it, and creates the guest's record for this event. This is the only moment identity is established, and it counts once toward the monthly active user total. Leads to the Photo step.

**Status.** Built. Present in the survey flow and room demo as the email gate and code verification screens.

## 4. The Photo Step

**What it is.** An optional profile picture for the guest's card in the room.

**What the person sees.** A circle to add a photo, with a clearly offered skip option. If they skip, the app generates a colored circle with their initials.

**What it connects to.** Comes after Sign-In. Feeds the avatar shown on their card in the Room View and anywhere their identity appears. Leads to the Role step.

**Status.** Built. Present in the room demo as the photo screen with initials-avatar fallback.

## 5. The Role Chips

**What it is.** The first of three tapping steps that build a guest's micro-profile. This one captures who they are.

**What the person sees.** A set of tappable chips for roles like founder, designer, investor, or a write-in option for their own. They tap the one that fits.

**What it connects to.** Comes after Photo. Writes the guest's role to their profile. Feeds matching and the room directory. Leads to the Offer step.

**Status.** Built. Present in the survey flow and room demo as the role selection screen with custom write-in.

## 6. The Offer Chips

**What it is.** The second tapping step. What the guest can give to the room.

**What the person sees.** Tappable chips for things they can offer, an introduction, advice, hiring, investment, with a counter showing how many they have picked and a write-in option.

**What it connects to.** Comes after Role. Writes the guest's offers. These are matched against other people's needs by the matching engine. Leads to the Need step.

**Status.** Built. Present in the survey flow and room demo as the offer chips screen with a count badge.

## 7. The Need Chips

**What it is.** The third tapping step. What the guest is looking for.

**What the person sees.** Tappable chips for what they need, the mirror image of the offer chips, with a counter and write-in.

**What it connects to.** Comes after Offer. Writes the guest's needs. These are matched against other people's offers. Completing this step finishes the ninety-second profile and leads to the Room View.

**Status.** Built. Present in the survey flow and room demo as the need chips screen.

## 8. The Room View

**What it is.** The live directory of everyone present at the event. The heart of the attendee experience.

**What the person sees.** A view of all the people in the room, each as a card showing their photo, name, role, and what they offer and need. There are three ways to look at it: a grid, a list, and a flip-card stack to browse one at a time. A live count shows how many people are present.

**What it connects to.** Comes after the profile is built. Reads every present attendee's profile. It is the surface where the guest sees who else is here, and the canvas the three live acts play out on. Connects to the comment and the three acts.

**Status.** Built. Present in the room demo with grid, list, and flip views and a live counter.

## 9. The Comment

**What it is.** A small way for a guest to react to someone else in the room.

**What the person sees.** A way to leave a short note or reaction on another person's card.

**What it connects to.** Sits on top of the Room View, attached to another attendee's card.

**Status.** Built. Present in the room demo as a comment modal.

## 10. The Drop (Act 1)

**What it is.** The first live act. One question that lands on every phone in the room at the same instant. Technical name: Creative Sync.

**What the person sees.** A prompt appears all at once. The guest answers. Answers rise onto a shared wall, anonymous first, then names attach.

**What it connects to.** Triggered by the host from the Command Center. Broadcasts to every connected phone at once, the moment of peak live connections. Writes each answer and streams them to the shared wall. Feeds conversation starters into The Chance.

**Status.** Built. Present in the creative sync screen as the prompt, the wait state, the wall, and the reveal.

## 11. The Chance (Act 2)

**What it is.** The second live act. Soda pairs people up by chance with a reason to talk. Technical name: Random Pairing.

**What the person sees.** The guest is shown a partner, given a conversation starter pulled from the night, and a short countdown timer runs.

**What it connects to.** Triggered by the host. Shuffles the present attendees into pairs and pulls a seed from the Drop answers. Writes the pairings so people are not paired twice. Plays out on the Room View.

**Status.** Built. Present in the creative sync screen as the pairing overlay with the two avatars, names, roles, and timer.

## 12. The Nudge (Act 3)

**What it is.** The third live act and the emotional peak. A private tap on the shoulder telling one guest about one specific person they should meet. Technical name: Quiet Nudge.

**What the person sees.** A private message, seen only by them, naming one person and the reason they should connect. Nothing public, no announcement.

**What it connects to.** Triggered by the host or surfaced by the matching engine. Scores offers against needs and sends the top match to that one guest through a private channel meant only for them. This privacy boundary is the highest-stakes rule in the app: the signal goes only to the recipient, never to any shared view.

**Status.** Built. Present in the creative sync screen as the private nudge overlay with the matched person's card and the reason.

## 13. The Post-Event Survey

**What it is.** A short set of questions after the event to capture how the night felt and what the guest needs next.

**What the person sees.** A clean, one-question-at-a-time flow with a progress bar. Question types include star ratings, a sliding scale, tappable tag choices, and a free-text box with a character counter. Back and next buttons move between them.

**What it connects to.** Reached by its own Survey QR or a link in the recap email. Writes survey responses tied to the guest and the event. Feeds the host's survey panel and the intelligence views.

**Status.** Built. Present as a full standalone survey screen with star, scale, tag, and text question types, and in the survey flow as the survey path.

## 14. The Send-Off

**What it is.** The warm closing screen after the survey is done.

**What the person sees.** An affirming thank-you, branded for the event, with a soft prompt toward the next event or the membership waitlist.

**What it connects to.** Comes after the survey. Closes the attendee loop.

**Status.** Built. Present in the survey flow and the standalone survey as the completion state.

## 15. Returning Guest Recognition

**What it is.** The moment a known guest scans in to a later event and the app remembers them. The single most important retention moment in the product.

**What the person sees.** Instead of a cold welcome, a message like "Welcome back. This is your third event. You have made seven connections," with their name and avatar already known.

**What it connects to.** Sits on the Welcome screen for returning guests. Reads the guest's history across past events, their attendance count and prior connections. This is the visible face of Community Memory.

**Status.** Built. Present in the survey flow as the recognition screen.

## 16. The Recap Email

**What it is.** The message that arrives after the event so the connection does not evaporate.

**What the person sees.** A branded email with their profile card, a recap link, their matches, and a soft call to action.

**What it connects to.** Sent automatically at event end. Reads the guest's profile and connections. Links back to the survey and the next step.

**Status.** Specified. Described in the build manuals and triggered at event end, not yet a built screen.

## 42. The Lifecycle Message Screen

**What it is.** What a guest sees when they scan an event that is not currently live, either before it opens or after it closes.

**What the person sees.** A simple, warm message in the host identity. Before doors open, a not-yet-open note. After the event ends, an event-ended note, with a path to the survey if they have not done it.

**What it connects to.** Reads the event lifecycle state. Appears when the event is in draft or closed rather than live. Wears the host name and logo like every other attendee screen.

**Status.** Specified. Newly surfaced by the Event Layer. A single flexible screen with two text variations, to be specified in the next attendee pass.

---

# Part Two: The Host Side

This is what the people running the event use. There are two related tools: the **Command Center**, the live cockpit for running the night in real time, and the **Admin Panel**, the fuller back-office for setup, data, and management.

## The Command Center

The live cockpit. One screen the host drives the whole night from, organized into views that match the acts.

### 17. The Live Stat Bar

**What it is.** The always-visible vital signs of the event.

**What the person sees.** Running counts: how many have scanned in, how many responses are in, how many pairs formed, how many nudges sent, how many surveys completed.

**What it connects to.** Reads live from every part of the event as it happens. Sits across the top of the Command Center.

**Status.** Built. Present in the command center as the live stat counters.

### 18. The Room View (Host)

**What it is.** The host's live picture of everyone present.

**What the person sees.** A grid of all attendees with their profiles, mirroring what guests see but for monitoring.

**What it connects to.** Reads every present attendee. The default view of the Command Center.

**Status.** Built. Present in the command center as the room view.

### 19. The Sync Control (Drives The Drop)

**What it is.** The panel that fires Act 1 and watches it land.

**What the person sees.** A field to set the prompt, a fire button, a big live timer, a running response count, and the responses feed coming in. A reveal control to attach names.

**What it connects to.** Fires the Drop to every phone. Reads responses as they arrive. Feeds the shared wall.

**Status.** Built. Present in the command center as the sync view with prompt display, timer, response count, and feed.

### 20. The Chance Control (Drives Act 2)

**What it is.** The panel that runs the random pairing.

**What the person sees.** A spin button to pair the room, a re-spin option, and a status line, plus a grid of the pairs that formed.

**What it connects to.** Triggers the pairing for all present attendees. Writes and displays the pairs.

**Status.** Built. Present in the command center as the roulette view with spin, re-spin, status, and pairs grid.

### 21. The Nudge Control (Drives Act 3)

**What it is.** The panel that sends private matches.

**What the person sees.** A queue of pending nudges, each showing who it goes to and why, ready to send.

**What it connects to.** Reads the matching engine's suggestions. Sends each nudge privately to one guest.

**Status.** Built. Present in the command center as the nudge view with the nudge queue.

### 22. The Survey Monitor (Host)

**What it is.** The host's live read on survey responses.

**What the person sees.** A running table of responses and summary counts as they come in.

**What it connects to.** Reads survey submissions. Feeds the intelligence view.

**Status.** Built. Present in the command center as the survey view with a response table.

### 23. The Intelligence View

**What it is.** The live read on the shape of the room: what people offer, what they need, where the gaps and overlaps are.

**What the person sees.** Bar charts of the most common offers and needs, and signals about the room's dominant vibe and matchable gaps.

**What it connects to.** Reads all profiles and responses and summarizes them. The analytical layer of the Command Center.

**Status.** Built. Present in the command center as the intel view with offer and need bars.

### 24. The Activity Feed

**What it is.** The live ticker of everything happening in the room.

**What the person sees.** A running feed of events: scans, responses, matches, as they occur.

**What it connects to.** Reads live activity from across the event.

**Status.** Built. Present in the command center as the activity feed.

### 25. The Connection Status Badge

**What it is.** The small indicator that the live system is connected and healthy.

**What the person sees.** A badge showing the realtime link is active.

**What it connects to.** Monitors the live connection that powers the Drop and the Nudge.

**Status.** Built. Present in the command center as the sync badge.

### 38. Lifecycle State Awareness

**What it is.** The Command Center's awareness of whether the event is in draft, live, or closed, which governs what the host can fire.

**What the person sees.** A clear state indicator showing the event is live, and act controls that are active only when live. Before going live or after closing, the controls are visibly inert.

**What it connects to.** Reads the event lifecycle state set in the Admin. The acts can only fire when the event is live, so this is the gate that protects the night from misfires.

**Status.** Specified. Defined in the Event Layer. The Command Center reads the lifecycle rather than managing it.

## The Admin Panel

The back office. Setup, data management, and the fuller controls that sit behind the live night.

### 26. Event Setup and Active Event

**What it is.** Where the host defines and selects the event being run.

**What the person sees.** The active event name and its settings at the top of the panel.

**What it connects to.** Sets the event ID that scopes everything. Feeds every other component.

**Status.** Built. Present in the admin panel as the active event header.

### 39. Event Creation

**What it is.** The action of starting a brand-new event, the front of the event layer.

**What the person sees.** A way to create an event with a required name and a date, beginning it in the draft state.

**What it connects to.** Creates the event record that scopes all attendee activity and feeds the per-event QR. Defined in the Event Layer.

**Status.** Specified. Newly defined in the Event Layer. The admin has a partial active-event header today; full creation is the next build.

### 40. Host Identity and Branding

**What it is.** Where each event gets its own identity, the brand-agnostic core of the platform.

**What the person sees.** A required write-in field for the host or organization name, and an optional logo upload. Both start empty so each event is filled in fresh. A typed name alone produces a complete attendee experience.

**What it connects to.** Feeds the host name and logo to every attendee-facing screen, the Entry QR eyebrow, the Welcome, and the Send-Off, which read these fields rather than showing anything hardcoded.

**Status.** Specified. Newly defined in the Event Layer. This is the feature that makes the app brand-agnostic.

### 41. Event Lifecycle Control

**What it is.** Where the host moves an event through its three states: draft, live, and closed.

**What the person sees.** A clear control to take a draft event live, and later to close it. The identity fields are open in draft, locked in live, and final in closed.

**What it connects to.** Sets the state the Command Center reads to know when the acts can fire, and the state the attendee QR reads to show the live experience, a not-yet-open message, or an event-ended message.

**Status.** Specified. Newly defined in the Event Layer as the third setting that was missing.

### 27. The Check-In Panel

**What it is.** Manual check-in and on-the-spot profile entry, for when someone needs help getting in.

**What the person sees.** Fields to enter a guest's name, email, role, offers, and needs by hand.

**What it connects to.** Writes a guest profile directly, the same as if they had scanned in.

**Status.** Built. Present in the admin panel as the check-in panel with manual chip entry.

### 28. The Chip Queue and Moderation

**What it is.** The place to review and approve write-in chips guests created, keeping the shared vocabulary clean.

**What the person sees.** A queue of pending custom chips with a count, ready to approve or reject.

**What it connects to.** Reads guest write-ins. Feeds the seeded vocabulary used everywhere chips appear.

**Status.** Built. Present in the admin panel as the chip queue panel.

### 29. The Matches Panel

**What it is.** The full view of every match the engine has surfaced.

**What the person sees.** A feed of matches with totals, mutual matches, and the top connector in the room.

**What it connects to.** Reads the matching engine. Feeds the nudge queue.

**Status.** Built. Present in the admin panel as the matches panel and feed.

### 30. The Room Panel (Admin)

**What it is.** The admin's view of the live room with management counts.

**What the person sees.** The room grid plus stats on who is scanned in, connections made, and surveys complete.

**What it connects to.** Reads all present attendees and their activity.

**Status.** Built. Present in the admin panel as the room panel.

### 31. The Survey Panel (Admin)

**What it is.** The admin's fuller view of survey data.

**What the person sees.** A table of survey responses with summary stats.

**What it connects to.** Reads all survey submissions.

**Status.** Built. Present in the admin panel as the survey panel and table.

### 32. The Prompt and Pairing Settings (Queue Panel)

**What it is.** Where the host pre-loads prompts and tunes how pairing behaves before going live.

**What the person sees.** A bank of saved questions, controls for how many pairing slots, how many anchors, and how rotation works, with a save button.

**What it connects to.** Feeds the Sync and Chance controls in the Command Center.

**Status.** Built. Present in the admin panel as the queue panel with the question bank and pairing settings.

### 33. The Question Creator

**What it is.** Where the host writes custom questions for the Drop or the survey.

**What the person sees.** A field to write a question and pick its type.

**What it connects to.** Adds to the question bank used by the Drop and the survey.

**Status.** Built. Present in the admin panel as the creator panel with custom question type.

### 34. The Open Mic Feed

**What it is.** A live feed of open responses for the host to read the room.

**What the person sees.** A running feed of what people are saying.

**What it connects to.** Reads live responses.

**Status.** Built. Present in the admin panel as the open mic feed.

### 35. The Broadcast and Announce

**What it is.** A way for the host to push a message to the whole room.

**What the person sees.** A box to write an announcement and send it to every phone.

**What it connects to.** Broadcasts to all connected guests, the same delivery path as the Drop.

**Status.** Built. Present in the admin panel as the announce modal and broadcast filters.

### 36. The Export Panel

**What it is.** Where the host pulls the data out after the event.

**What the person sees.** Controls to export the attendee, connection, and survey data.

**What it connects to.** Reads all event data. This is where Futureland's ownership of its own event data is exercised in practice.

**Status.** Built. Present in the admin panel as the export panel.

### 37. The Toast and Notifications

**What it is.** The small confirmations that tell the host an action worked.

**What the person sees.** Brief pop-up messages confirming actions, fired, sent, saved.

**What it connects to.** Sits across the admin and command center, responding to host actions.

**Status.** Built. Present in both the admin panel and command center as the toast.

---


---

# Part Three: States

These are the empty, loading, and error states from the states pass, represented as their own category. Each is a state of a screen above, not a separate screen. Empty means the screen has nothing to show yet, loading means it is fetching or connecting, and error means something went wrong and needs a recoverable next step.

## 43. Empty State: The Early Room

**What it is.** The first arrivals state of the Room View, the most important empty state in the app because someone always arrives first.

**What the person sees.** A live count climbing, a warm headline, one real card, and dimmed placeholders for arrivals, so the room reads as building. Suggested copy: “The room is filling. You are early. Good.”

**What it connects to.** A state of Room View. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

Paste-ready Claude Design prompt:

```
Design a mobile screen, dark mode, background near-black #111111. This is the EARLY state of the
SODA Room View, what the first few guests see before the room fills. One job: make arriving early
feel like momentum, not emptiness.
Top: slim header, event name in muted monospace left, a live count right in monospace with a small
Soda green #3BD75C dot showing a low number like "3 HERE".
Center, dominant: a warm headline in bold condensed uppercase display type, white, "THE ROOM IS
FILLING". Below it one line of off-white #F5F5F5 body text, "You are early. Good. Watch it build."
Below: one real attendee card plus a few dimmed placeholder card outlines suggesting arrivals.
Calm, confident, alive. 8px grid, 16px margins, one dominant element. Green only on the live dot.
```

## 44. Loading State: Room Loading

**What it is.** The brief moment the Room View fetches present attendees on entry.

**What the person sees.** A skeleton of card shapes where people will appear, so the structure shows before content lands.

**What it connects to.** A state of Room View. Kind: loading.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 45. Error State: Reconnecting

**What it is.** The live connection drops mid-event.

**What the person sees.** A quiet reconnecting indicator that keeps the room on screen while the link is restored. Suggested copy: “Reconnecting to the room.”

**What it connects to.** A state of Room View. Kind: error.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 46. Loading State: Reading the Event

**What it is.** The Welcome reads the event name and host identity.

**What the person sees.** A placeholder where the host name or logo will sit, so branding does not flash empty.

**What it connects to.** A state of Welcome. Kind: loading.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 47. Loading State: Sending the Code

**What it is.** The code is being sent, and again while it is verified.

**What the person sees.** The button shows a calm working state and locks against double taps, with a line confirming the code is on its way. Suggested copy: “Sending your code.”

**What it connects to.** A state of Sign-In. Kind: loading.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 48. Error State: Code Did Not Match

**What it is.** The entered code is wrong or expired, or the send failed.

**What the person sees.** A plain message under the field in red, the field ready to retry, and a way to resend. No dead end. Suggested copy: “That code did not match. Check your email or resend.”

**What it connects to.** A state of Sign-In. Kind: error.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 49. Loading State: Uploading the Photo

**What it is.** A photo is uploading.

**What the person sees.** The circle shows a calm working state and the guest can still continue. Suggested copy: “Adding your photo.”

**What it connects to.** A state of Photo. Kind: loading.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 50. Error State: Upload Failed

**What it is.** The photo upload failed.

**What the person sees.** A quiet fallback to the initials avatar so the guest is never blocked, with the option to try again later. Suggested copy: “We will use your initials for now. You can add a photo later.”

**What it connects to.** A state of Photo. Kind: error.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 51. Empty State: No Chips Configured

**What it is.** The unlikely case of an event with no chips loaded for a step.

**What the person sees.** A small default set always appears as a floor, plus the write-in option, so the guest can always proceed.

**What it connects to.** A state of Chip Steps. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 52. Empty State: The Waiting Wall

**What it is.** The window after the host fires the prompt but before answers land.

**What the person sees.** The question holds the screen with an inviting empty wall beneath it, framed so the guest feels first. Suggested copy: “Answers are landing. Yours can be first.”

**What it connects to.** A state of The Drop. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

Paste-ready Claude Design prompt:

```
Design a mobile screen, dark mode, background near-black #111111. This is "The Drop" in its WAITING
state, after the host fires the prompt but before answers arrive. One job: invite the first answer.
Top: small uppercase monospace eyebrow in Soda green #3BD75C, "THE DROP".
Center, dominant: the question in large bold condensed uppercase display type, white. Below it a
single text input, dark #1A1A1A with a 1px border #262826, with a green focus border.
Below the input: an empty wall area with one soft line of muted grey body text, "Answers are
landing. Yours can be first."
Bottom: full-width Soda green button "SEND IT". Calm and inviting, not blank. 8px grid, 16px margins.
```

## 53. Loading State: Prompt Arriving

**What it is.** The prompt arriving on the guest phone as the host fires it.

**What the person sees.** A brief beat as the question animates in, with the input ready the instant it lands.

**What it connects to.** A state of The Drop. Kind: loading.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 54. Empty State: The Unpaired Guest

**What it is.** The guest left without a partner in an odd round, or a room too small to pair.

**What the person sees.** A warm holding state that promises the next round, so the guest feels queued rather than rejected. Suggested copy: “You are up next round. Hang tight.”

**What it connects to.** A state of The Chance. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

Paste-ready Claude Design prompt:

```
Design a mobile screen, dark mode, background near-black #111111. This is "The Chance" in its
UNPAIRED state, for the one guest left without a partner in an odd-numbered round. One job: make
them feel queued for the next round, never rejected.
Top: small uppercase monospace eyebrow in muted grey, "THE CHANCE".
Center, dominant: a warm headline in bold condensed uppercase display type, white, "YOU ARE UP NEXT
ROUND". Below it one line of off-white #F5F5F5 body text, "Odd number this round. You pair first
next time. Keep working the room."
Reassuring, not a dead end. 8px grid, 16px margins, one dominant element. Green used sparingly.
```

## 55. Loading State: Shuffling

**What it is.** The host has fired pairing and matches are forming.

**What the person sees.** A brief shuffling beat before the pairing resolves and the partner appears.

**What it connects to.** A state of The Chance. Kind: loading.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 56. Empty State: No Match Found

**What it is.** No strong private match is found for this guest at nudge time.

**What the person sees.** A graceful fallback in the private purple treatment: a held nudge that may arrive later, or a soft message pointing back to the room. It never simply vanishes. Suggested copy: “No single match stood out yet. The night is not over. Keep working the room.”

**What it connects to.** A state of The Nudge. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

Paste-ready Claude Design prompt:

```
Design a mobile screen, dark mode, background near-black #111111. This is "The Nudge" in its
NO-MATCH state, the graceful fallback when no strong private match is found. One job: keep the
moment personal and encouraging, never a silent failure.
Top: small uppercase monospace eyebrow in purple #A47BFF, "A NUDGE, FOR YOU".
Center, dominant: a single warm card, deep green #203229 or dark with a subtle purple edge, holding
one line of off-white #F5F5F5 body text, "No single match stood out yet. The night is not over.
Keep working the room." No avatar, since there is no person.
Bottom: one full-width Soda green #3BD75C button, "BACK TO THE ROOM". Intimate and warm, not an error.
```

## 57. Loading State: Matching

**What it is.** Matching runs as the host sends nudges.

**What the person sees.** A brief private beat in the purple treatment before the match or the soft message appears.

**What it connects to.** A state of The Nudge. Kind: loading.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 58. Loading State: Submitting

**What it is.** The survey is being submitted.

**What the person sees.** The button shows a calm working state and locks against double submission. Suggested copy: “Sending your answers.”

**What it connects to.** A state of Survey. Kind: loading.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 59. Error State: Submission Failed

**What it is.** The survey submission failed.

**What the person sees.** A plain retry message that preserves everything the guest entered, so nothing is lost. Suggested copy: “That did not send. Your answers are saved. Try again.”

**What it connects to.** A state of Survey. Kind: error.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 60. Empty State: Thin History

**What it is.** A returning guest with little or no prior history to recall.

**What the person sees.** A graceful greeting that welcomes them back without inventing a history, so the recognition never feels hollow. Suggested copy: “Welcome back. Good to see you again.”

**What it connects to.** A state of Returning Recognition. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 61. Empty State: Zero Connections

**What it is.** A guest who finished the night having made no connections.

**What the person sees.** A recap that affirms showing up and points forward, still carrying who was in the room and the next event. Suggested copy: “You showed up. That is the first move. Here is who was in the room.”

**What it connects to.** A state of Recap Email. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 62. Empty State: No One Scanned In

**What it is.** The event has just gone live and no one has scanned in.

**What the person sees.** An empty room grid with a calm line and a stat bar reading zeros that are clearly a starting point. Suggested copy: “No one has scanned in yet. The room fills here.”

**What it connects to.** A state of Command Center Room. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 63. Empty State: The Feed at Start

**What it is.** Nothing has happened in the event yet.

**What the person sees.** A quiet placeholder line so the feed reads as ready rather than stalled. Suggested copy: “The night starts here.”

**What it connects to.** A state of Activity Feed. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 64. Empty State: Awaiting Responses

**What it is.** The host has fired the prompt and no responses are in yet.

**What the person sees.** A response count at zero and an empty feed framed as waiting, mirroring what guests see. Suggested copy: “Waiting on the first answer.”

**What it connects to.** A state of Sync Control. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 65. Empty State: Too Few to Pair

**What it is.** The host tries to pair a room too small or odd to pair cleanly.

**What the person sees.** A clear note on why pairing is limited and how the unpaired guest is held, so the host understands the room. Suggested copy: “Room is small. One guest will hold for the next round.”

**What it connects to.** A state of Chance Control. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 66. Empty State: Empty Queue

**What it is.** No matches are ready to send yet.

**What the person sees.** A queue at zero with a calm line, so the host knows matches surface as profiles fill in. Suggested copy: “No matches ready to send yet.”

**What it connects to.** A state of Nudge Control. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 67. Empty State: Zero Responses

**What it is.** No survey responses have come in.

**What the person sees.** A zero state framed as expected at this point in the night. Suggested copy: “No responses yet.”

**What it connects to.** A state of Survey Monitor. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 68. Empty State: Not Enough Signal

**What it is.** Too few profiles exist to show a meaningful pattern.

**What the person sees.** A held state explaining patterns appear as people join, rather than charts built on almost nothing. Suggested copy: “Not enough signal yet. Patterns appear as the room grows.”

**What it connects to.** A state of Intelligence View. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 69. Error State: Connection Lost

**What it is.** The realtime link drops on the host side.

**What the person sees.** The badge shifts to a clear disconnected or reconnecting state, so the host knows the acts may not fire until it recovers. Suggested copy: “Reconnecting.”

**What it connects to.** A state of Connection Badge. Kind: error.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 70. Empty State: Nothing to Review

**What it is.** No write-in chips are waiting for review.

**What the person sees.** A clean zero state so an empty queue reads as caught up. Suggested copy: “Nothing to review. You are caught up.”

**What it connects to.** A state of Chip Queue. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 71. Empty State: Before Data

**What it is.** The event has not produced matches or survey responses yet.

**What the person sees.** Zero states that match the Command Center, framed as the night being early. Suggested copy: “Nothing here yet. It fills as the event runs.”

**What it connects to.** A state of Matches and Survey Panels. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 72. Loading State: Preparing Export

**What it is.** An export is being prepared.

**What the person sees.** A calm working state with the control locked until the file is ready. Suggested copy: “Preparing your export.”

**What it connects to.** A state of Export Panel. Kind: loading.

**Status.** Specified. Defined in the empty, loading, and error states pass.

## 73. Empty State: Nothing to Export

**What it is.** An event with no activity has nothing to export.

**What the person sees.** A plain note rather than an empty file, so the host knows the event has no data. Suggested copy: “No data to export yet.”

**What it connects to.** A state of Export Panel. Kind: empty.

**Status.** Specified. Defined in the empty, loading, and error states pass.

# The Data Underneath

Every component above reads from or writes to a small set of shared records. In plain English:

- **The event.** The container for everything: its name, its required host name and optional logo, its date, its lifecycle state, and which acts are on. Every other record is scoped to one event.
- **People.** Who someone is, established once at sign-in.
- **Attendance.** The link between a person and a specific event, written each time they show up. This is what powers returning-guest recognition.
- **Chips.** The role, offers, and needs a person taps in. The raw material of matching.
- **Drop answers.** What people typed in response to the live prompt.
- **Pairings.** Who got paired with whom in The Chance.
- **Connections.** The matches made, surfaced privately through The Nudge and remembered afterward.
- **Survey responses.** How the night felt and what people need next.

Two rules govern all of it. First, every record is scoped to its event, so nothing leaks between events. Second, the private nudge is sacred: a match suggestion goes only to the one person it is meant for, never to any shared screen.

---

# Ownership

SODA is a proprietary product of Equalpoint, Inc. The data collected at Futureland events is owned by Futureland Inc. as the client. Futureland owns its data; Equalpoint owns the product.

---

*A name tag knows you showed up. SODA knows who you became to the room.*
