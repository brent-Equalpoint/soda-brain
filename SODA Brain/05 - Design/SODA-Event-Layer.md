# SODA: The Event Layer

*Event creation, brand-agnostic hosting, and lifecycle. Build now. A product of Equalpoint, Inc.*

This defines what an event is, how each one carries its own host name and optional logo, the three states an event moves through, and the per-event QR. It updates the attendee screens already specified.

## Why this exists

The first documentation treated the app as one fixed event for one host. This corrects that. SODA is a platform that runs many events, and each event carries its own identity. The original specs hardcoded a single host into the screens. In reality, you will run events under Equalpoint, under Futureland, and potentially under other names, and the app needs to wear the right identity for each one without being rebuilt each time.

The host accounts, logins, and collaborator permissions live in a separate document marked for a later build. For now, you control event creation directly. This document is only the event layer itself, which the current build needs.

## Part One: What an event is

Every time the app is used, it is used for a specific event. An event is the container that scopes everything: who attended, what they offered and needed, the connections made, the survey answers. Two events never share data. The event is also what carries the host identity that attendees see.

### The fields an event carries

Two fields are required, the rest are optional, and all start empty so each event is filled in fresh.

- **Event name. Required.** The name attendees see, for example Creative Meetup or Founder Mixer. Always present because it greets people and labels their experience.
- **Host name. Required.** A write-in field for who is hosting, the organization or person, for example Equalpoint or Futureland or any name typed in. Required so there is always an identity behind the event. A plain text field, typed fresh for each event.
- **Host logo. Optional.** An image the host can upload to appear on the attendee screens. If none is uploaded, the screens fall back gracefully to the host name in text.
- **Date and time. Required for scheduling.** Drives the lifecycle states and the recap.
- **Acts enabled. Optional toggles.** Which of the three acts are on, the Drop, the Chance, the Nudge. Defaults to all on.
- **Prompts and chips. Optional, pre-loaded.** The questions for the Drop and the chip vocabulary, set up ahead of time.

Two fields are required, the event name and the host name. Everything else, including the logo, is optional. This rule keeps the app brand-agnostic while guaranteeing every event has an identity.

### Why a required name and an optional logo

The required name guarantees the attendee always sees who is hosting, so the experience never feels anonymous. The optional logo respects reality, because plenty of events are run by a person or a small effort with no logo ready. A typed name alone produces a clean, complete screen. A logo, when present, makes it richer.

## Part Two: The brand-agnostic principle

This rule governs whose name shows where. The app serves many hosts, and it has to wear each host without confusing them about who built it.

### Three layers of identity

- **SODA is the product, kept quiet.** The app is SODA, but the attendee rarely needs to see that. SODA is the platform doing the work in the background. It does not brand the attendee screens.
- **Equalpoint owns it, kept quieter still.** Equalpoint is the company that owns SODA. Its presence is limited to a discreet, optional powered-by line. It never competes with the host for attention.
- **The event host is what attendees see.** The host name, required, and the logo, optional, are the identity that appears on the welcome, the room, and the send-off.

### The default when nothing is branded

Because the host name is required, there is always something to show. When a host provides only the required name and no logo, the attendee screens display the host name in clean type wherever the logo would have sat. The app is brand-agnostic in that it carries no permanent host identity of its own, and it fills with whatever identity each event supplies.

### What is always SODA, what becomes the host

A simple rule decides every case. Anything the attendee sees as part of the experience, the welcome greeting, the room, the send-off, wears the event host identity. Anything that is platform plumbing, a discreet credit, system messages, technical labels, stays neutral and quietly SODA or Equalpoint. When in doubt, ask whether the attendee would read it as part of the event they came to. If yes, it is the host. If no, it is the quiet platform.

## Part Three: The event lifecycle

An event moves through three states. This is the third setting that was missing.

### Draft

- **What it is.** The event exists but has not opened. The host is setting it up.
- **What attendees see.** Nothing. The QR is not yet live. Scanning a draft event shows a not-yet-open message.
- **What the host can do.** Everything in setup. Edit every field freely. The only state where the identity fields are fully open to change.

### Live

- **What it is.** The event is happening. Doors are open, the QR works, attendees are scanning in and the acts can fire.
- **What attendees see.** The full experience, wearing the host identity, from scan through the acts.
- **What the host can do.** Run the night. Identity fields are locked during live so the experience stays stable while people are in it.

### Closed

- **What it is.** The event has ended. The live experience is over, the data is complete.
- **What attendees see.** The survey, if not done, and then the send-off. New scans show an event-has-ended message.
- **What the host can do.** Review and export the data. The recap email goes out. Nothing live can fire. The event is now a record.

Draft is for setup, live is for the night, closed is for the record. Identity is editable in draft, locked in live, and final in closed.

## Part Four: Per-event QR

Each event generates its own QR code, distinct from every other event. When an event is created and moves toward live, the system generates a QR unique to that event. Scanning it carries the event identifier, so the attendee lands in the right event, sees the right host identity, and every record they create is scoped to that event. A different event has a different code and a separate space.

The attendee flow already anticipates more than one code per event, an entry code, a survey code, and optional table codes. All belong to the one event and carry its identifier. No multi-tenancy machinery is needed, because you control all events. The requirement is simply that each event has its own code and its own scoped data.

## Part Five: What this changes in the attendee screens

The event layer forces a few small updates to the attendee screens already specified, because those screens must now pull the host identity from the event rather than showing a fixed name. None of these change the layout or the foundation.

- **Entry QR, screen 1.** The eyebrow that names the event is now dynamic, pulled from the event record. The original spec hardcoded a Futureland line; that becomes a field.
- **Welcome, screen 2.** The wordmark area now shows the host identity. Logo if present, host name in clean type if not. The SODA wordmark steps back to the quiet platform role.
- **Send-Off and Recap.** The closing screen and the recap email wear the host identity the same way. The optional Equalpoint powered-by credit may sit discreetly in the recap footer.

The rule for the builder: anywhere a host name or logo appears on an attendee screen, it is read from the event record, never hardcoded. A typed name renders as clean type in the logo position. This single rule makes every attendee screen brand-agnostic.

### The one new attendee-facing behavior

There is one genuinely new attendee-facing state: the not-yet-open and event-ended messages tied to the lifecycle. When someone scans a draft or closed event, they see a simple, warm message in the host identity rather than the live experience. A single flexible screen with two text variations.

*A product of Equalpoint, Inc. Brand-agnostic by default. Each event supplies its own identity.*