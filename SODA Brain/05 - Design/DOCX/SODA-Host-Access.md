# SODA: Host Access, Three Levels, Login, and the Master Key

*How hosts and operators get in, and what each is allowed to do. A product of Equalpoint, Inc.*

Attendee sign-in was settled. The host side was parked. This specifies it, with three levels of access, the login and session rules, lockout and recovery, and the operator master key written in now with its console reserved for later.

## Why this exists

Sign-in is fully worked out for attendees: email, a code, you are in. The host side, the people who log into the Admin and the Command Center, was parked and never specified.

Host login is not the attendee login wearing a different hat. The attendee login is featherweight on purpose, because the stakes are low and speed is everything. The host login is the opposite. A host can create events, see every attendee's data, fire the acts, and export the full guest list. That is real power over other people's information, so it needs more care.

One clarification first. The Admin and the Command Center are not two accounts. They are two tools the same host uses, the Admin to build and close an event, the Command Center to run it live. A host logs in once and moves between them. The access question is not Admin versus Command, it is who sits above the hosts.

# I. The three levels

## The Operator, the master key

You and Equalpoint. The level above every host and every event. An Operator can reach into any event's Admin or Command Center, step in when something breaks on the night, suspend a misbehaving host, and handle platform-wide and cross-event data and privacy requests. This is the platform owner. It exists because you are running the platform: when an outside host's event misfires at seven o'clock, someone on your side has to step in, and because oversight, suspension, and cross-event privacy requests are Equalpoint powers, not host powers.

## The Host Owner

The person who owns a given event. Full control of that event, including adding collaborators and exporting its data. An Owner's reach stops at their own events.

## The Collaborator

Someone who helps run a specific event. A Collaborator can operate the night, watch the room, and fire the acts, but cannot export the full guest list or delete the event. This is the role for a helper like a program manager running the floor while the Owner holds the data.

For the pilot the three levels collapse into one practical truth: you and Brent are Operators and also the hosts, so you can do everything. The full operator console is a later build. What matters now is that the Operator level exists in the model, so host accounts are built underneath it rather than as the top. Retrofitting an owner above existing accounts later is painful.

# II. How a host account comes to exist

Attendees self-serve with any email. Hosts cannot, because being a host is a permission, not a sign-up. Someone has to grant it.

- **For the pilot.** You, as Operator, create the host accounts directly. A tiny known group: you, Brent, and anyone like Nicole who needs to run the floor.
- **Later.** An existing Host Owner sends an invite link to add a collaborator, and an Operator can grant host or operator status. The invite flow is reserved, not built now.

# III. The login itself

The baseline is the email-and-code pattern you already have, which keeps the host login consistent with the attendee one and reuses what is built. Because hosts hold sensitive data, this is the one place where something sturdier is worth considering as the platform grows.

- **Email and code,** the baseline, acceptable for the pilot given the tiny known group.
- **Trusted-device sign-in,** keeping a host signed in only on a device they have confirmed.
- **Step-up verification,** an extra confirmation before the most sensitive action, exporting the guest list, even when already signed in.

The Operator login is held to the highest bar of these, because the master key is the most powerful credential in the system.

# IV. Sessions, lockout, and recovery

The session rules from the attendee work apply here, with one rule that matters even more.

- **Never drop a host mid-event.** A host bounced to a login screen while running the night is worse than a guest being bounced, because they are the one driving. Host sessions do not expire during a live event.
- **Explicit sign-out.** A clear way to sign out, and care on a device that doubles as the check-in station.
- **Recovery at the worst moment.** If a host cannot get in on the night, a resend gets them a fresh code, and the Operator can step in with the master key to keep the event running. The Operator is the human fallback for a host, the same way the host is the human fallback for an attendee.

# V. The master key, and its safeguards

A master key is a liability as much as a convenience, because it can see everyone's data. It is held with three safeguards.

- **Tightly held.** Operator access belongs to a very small group and is granted deliberately.
- **Logged when used.** When an Operator reaches into a host's event, that access is recorded, so there is an honest trail of who looked at what and when.
- **Disclosed.** The privacy policy should reflect that Equalpoint can access event data to operate and support the platform. The ownership split already implies this; this makes it explicit, because the platform being able to view an event is a trust statement, not only a feature.

# VI. The data-access reality

The host login is what stands between a casual collaborator and five hundred people's names and emails. It gates the export panel and the attendee data, so it is part of how the promises in the privacy policy are kept. An Owner can export their own event, a Collaborator cannot, and an Operator can across events but with that access logged. Access level and data access are the same decision.

# VII. The screens it needs

## Host Sign-In

The host's way in, the email-and-code pattern in a host frame rather than an event frame.

**Paste-ready Claude Design prompt**

```
Design a mobile or tablet screen, dark mode, background near-black #111111. This is the SODA host
sign-in, for someone logging into the Admin or Command Center. One job: get a known host in.
Center: the quiet SODA mark, a bold condensed uppercase headline in white, "HOST SIGN-IN", and one
line of off-white #F5F5F5 text, "Sign in to run your events."
An email field, then a six-digit code field, with a Soda green #3BD75C focus border.
A full-width Soda green #3BD75C button, "CONTINUE". A quiet muted-grey line below, "Hosts are added
by invite. Need access? Contact your event owner."
Sturdier and calmer in tone than the attendee sign-in. Green only on focus and the button. 8px grid.
```

## Host Account and Invite Setup

How a new host is created or accepts an invite. Pilot-simple now, the invite path reserved.

**Paste-ready Claude Design prompt**

```
Design a mobile or tablet screen, dark mode, background near-black #111111. This is the SODA host
account setup, shown when a new host is created or accepts an invite. One job: set up the host.
Top: a headline in bold condensed uppercase display type, white, "SET UP YOUR HOST ACCOUNT", and a
line naming who invited them, "Added by Futureland as an Owner."
Fields: name, email (prefilled if invited), and a clearly shown role, "Owner" or "Collaborator", as a
read-only pill in Soda green #3BD75C, since the role is granted, not chosen.
A full-width Soda green #3BD75C button, "CREATE ACCOUNT".
Clean and trustworthy. Green only on the role pill and the button. 8px grid, 16px margins.
```

## Collaborator Management

Where an Owner adds a helper to an event and sets their role. A panel inside the Admin.

**Paste-ready Claude Design prompt**

```
Design a panel inside the SODA Admin, dark mode, background near-black #111111. This is collaborator
management for one event. One job: let an Owner add and manage who can help run this event.
A label in muted grey monospace, "WHO CAN RUN THIS EVENT". A list of people, each a row with a
circular avatar, a name, and a role pill, "Owner" in deep green #203229 or "Collaborator" in a muted
tag. The Owner row is marked as you.
A full-width dark button with a Soda green #3BD75C border, "+ Add a collaborator", opening an email invite.
Calm and administrative. Green only on the add control. 8px grid, 16px margins.
```

## Sign-Out, and the Operator Console

Sign-out is a control in host settings, with the kiosk consideration for a check-in device. The Operator Console, the cross-event view that lists every event and lets an Operator drop into any one's Admin or Command Center, is reserved as a later build. It is not a button inside a single event's Command Center, because by definition it lives above all of them. Its place is reserved now so it has somewhere to land.

# VIII. Pilot-simple versus later

**Now, for the pilot:**

- Operators are you and Brent, who can do everything.
- You create host accounts directly.
- Email and code login, host-framed.
- Host sign-in and account-setup screens.
- Never-drop sessions and explicit sign-out.
- Operator access logged, even simply.

**Later, as outside hosts arrive:**

- The invite flow for adding hosts and collaborators.
- The full operator console for cross-event oversight.
- Sturdier auth: trusted-device, optional password, step-up before export.
- Collaborator management at scale.

# IX. Build note

The work is small but touches permission, security, and the promises in the privacy policy, so it is its own spec rather than a footnote. In the data model it is a permission level on the account, Operator, Owner, or Collaborator, plus a per-event role assignment, on top of the email-and-code login already built. The Operator level is created now even though its console is reserved, so every host account is built underneath it.

*A name tag knows you showed up. SODA knows who you became to the room, and the host access layer is what keeps the room, and everyone in it, in trusted hands.*
