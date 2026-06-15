# SODA: Sign-In, Sessions, and the Ways People Stumble

*Staying signed in, coming back, and every onboarding failure we can design for. A product of Equalpoint, Inc.*

Every screen so far assumed the person was already in. This fills the gap: what happens when they leave and come back, or when something goes wrong on the way in.

## Why this exists

The home area we just built quietly created a requirement we had not faced. The event night alone could almost run on a temporary session, because it lasts a few hours on one device. The home cannot, because a person returns days or weeks later and their profile, history, and contacts have to be there, tied to them. That means SODA now needs persistent identity, a way to recognize a returning person and load their data.

The good news is you already have the pieces. Sign-in by email and a six-digit code is your login. The returning-guest recognition screen is your welcome-back moment. What is missing is the layer underneath: the rules for staying signed in, for coming back, and for the many small ways a real person stumbles before they ever reach the room.

# I. The session rules

Five rules decide how long a person stays signed in and what they meet when they return. The aim is for SODA to feel like an app they are always logged into, never a kiosk they re-enter each time.

- **Stay signed in by default.** After a person verifies the code once, the device stays authenticated for a long stretch, on the order of weeks. Reopening just works, whether minutes later during the event or weeks later to check contacts.
- **Never expire during a live event.** While an event is live, the session does not expire. Getting bounced to a login screen while the host is firing the Drop would be the worst possible moment.
- **On expiry, re-authenticate and land where intended.** When a session ends, or the app opens on a new device, send the person to the same email-and-code sign-in. On success, drop them exactly where they were going, the room if an event is live, their home otherwise. The recognition screen greets them by name so it reads as a welcome.
- **A dropped connection is not a logout.** Losing the realtime link shows the reconnecting state, holding the screen and restoring quietly. Connection and identity are separate things.
- **Make signing out explicit.** A clear sign-out in settings, plus a kiosk mode on a door check-in device that returns to a clean entry after each guest.

# II. Identity, the thing underneath

One failure matters more than the rest, because it quietly breaks the entire promise of memory: a person becoming two people.

SODA remembers you across events, and that promise rests on a stable identity. Email is that key. Recognize a known email and the person is greeted by name with their history intact. The risk is when the same human signs in with a different email than last time, a personal address tonight after a work address last month. They become a second, empty person, and their rolodex and history split in two. Nothing looks broken; the value just quietly disappears.

**The design answer**

- **Treat email as the one identity.** Recognize a returning email and load the person. Dedupe on it.
- **Offer a path back when the email is new.** A gentle line, for example, been here before with a different email, lets a person find and merge a prior identity rather than being silently split.
- **Keep the pilot simple, design for merge.** For the first events, at minimum recognize and warn. Build the merge path as the network grows and the cost of fragmentation rises.

This connects to a lesson you already know from the grant work, where identity fragmentation across applications cost credibility. The same principle holds in the product: one person, one identity, or the memory that makes SODA valuable leaks away.

# III. Coming back, the two cases

## During a live event

Someone joins, builds their profile, then closes the app to answer a text, and reopens minutes later. If they have to scan again, re-enter email, and rebuild chips, the ninety-second magic is gone, and this happens constantly. The session keeps them signed in, so reopening drops them straight back to the Room View. No re-scan, no re-auth. The attendee flow already names this as re-entry by email; the session is the mechanism.

## Later, between events

Someone comes back days or weeks later to look at their contacts. This is the case that truly needs the persistent account, because the data has to outlive the device and the event. If the session is alive, they land in their home. If it expired, the welcome-back re-auth restores them with one code, and their home is exactly as they left it.

# IV. Onboarding and use failures

The full set of ways a real person stumbles, grouped by where it happens. Each names the slip and the design answer. Several happen at most events, so they are core, not edge.

## Sign-in, email and code

The single biggest source of onboarding failure, because it sits at the front door and depends on email arriving.

- **A typo in the email.** The code goes nowhere and the person waits on a screen that looks stuck. **The answer:** a visible edit-your-email link on the code screen, and a resend that re-shows the address so they can fix it.
- **The code is slow or lands in spam.** The person assumes the app is broken and gives up. **The answer:** a short line that it can take a moment and to check spam, plus a resend with a countdown so they are not tempted to hammer the button.
- **The code expired.** They waited too long and the code is dead. **The answer:** a plain expired message with a one-tap resend, never a dead end.
- **The wrong code is typed.** A digit is off and the screen rejects them. **The answer:** a clear inline error that keeps the digits entered and lets them retry without retyping the email.
- **No email access in the moment.** A corporate address they cannot open on their phone leaves them locked out at the door. **The answer:** the host manual check-in is the rescue, the person gives their name at the desk and is added by hand. This already exists in the Admin Check-In Panel.
- **Two codes arrive after a resend.** They are unsure which to use. **The answer:** accept the most recent code and say so.

## The QR and getting in

- **The scan fails.** Low light, a cracked screen, or a denied camera permission stop the scan. **The answer:** a manual fallback, a short event code or link they can type, and a clear camera-permission prompt with instructions if it was blocked.
- **An old or wrong QR.** They scan a sticker left from a past event and land nowhere useful. **The answer:** the QR carries the event identifier, so a closed or unknown event shows the ended or not-found message, and where possible points them to the host's current event.
- **Scanning before live or after close.** The event is in draft or already closed. **The answer:** already handled by the lifecycle message, the warm not-yet-open and event-ended screens.
- **A shared screenshot of the QR.** Someone not in the room gets the code. **The answer:** for the pilot, the QR plus email sign-in is the gate and event scope contains the data. Tighter gating is noted as a later option.

## Building the profile

- **Racing through without picking chips.** An empty profile cannot be matched, so the acts fall flat for that person. **The answer:** require a minimum, at least a role, before entering the room, and keep a sensible default chip set so there is always something to pick.
- **Abandoning mid-setup.** They close the app during the chips. **The answer:** save each step as they go, so reopening resumes at the same step rather than restarting.
- **A blank or joke name.** The field is empty or garbage. **The answer:** a light validation on the name, and the initials avatar works for anything entered.
- **A photo upload that fails.** The image will not load. **The answer:** already handled, a graceful fallback to the initials avatar.

## Permissions, install, and the PWA reality

A web app carries a few quiet traps that can log a person out or lose them entirely. These are technical, and worth designing around now.

- **Running in a browser tab and losing it.** Many people never install the app and simply lose the tab. **The answer:** the recap email always contains a link back, so the tab is never the only way in, and an add-to-home-screen prompt is offered at a calm moment, after the event rather than during the rush.
- **Storage eviction on iOS.** A web app's local storage can be cleared after a stretch of inactivity, which would silently sign a person out. **The answer:** never rely on local storage alone for identity. The session is keyed to email on the server, so even after eviction a quick code re-auth restores everything. This is the safety net that makes the whole thing durable.
- **Private or incognito browsing.** Nothing persists, so they cannot stay signed in. **The answer:** detect it and gently suggest a normal window, since their session will not survive otherwise.
- **Notifications denied.** They will not get a push for a follow-up nudge. **The answer:** nudges live in the app and in the recap email too, so a push is a bonus and never the only channel.

## Interruptions during the event

- **Backgrounding during an act.** They miss the Drop or Chance timer while away. **The answer:** on return, show the current state of the act, not a frozen old one, and a caught-up message if they missed it rather than a broken screen.
- **A connection drop during an act.** The realtime link fails mid-moment. **The answer:** the reconnecting state holds the screen and restores, distinct from a logout.
- **The phone locks or the battery dies.** The session is interrupted. **The answer:** the saved state and the live session mean they pick up where they left off on reopening.

## Expectation mismatches

Some failures are not bugs but wrong assumptions about what the app does. Wording and design set the expectation.

- **Tapping reach out and expecting SODA to send it.** Because SODA never messages on a person's behalf, they tap and wonder why nothing happened. **The answer:** the action wording and the share slide-up make clear it opens their own text or email. SODA hands you the person and the reason; you send the message.
- **Expecting in-app chat.** There is no messaging inside SODA. **The answer:** set the expectation plainly, SODA gives you the connection and you reach out through your own channels, which the share feature supports.

# V. The principles that fall out

Six rules summarize the whole document. If a future screen honors these, it will handle cases this pass did not name.

- **Never lose progress.** Save every step. Reopening resumes, it never restarts.
- **Email is the identity, and it must be one identity.** Recognize and dedupe on it. A person splitting into two is the worst silent failure.
- **Every dead end has a door.** A resend, a manual check-in, a link back. No screen leaves a person stuck.
- **Tell the truth about state.** Waiting, expired, broken, and reconnecting are four different messages, never one vague spinner.
- **Do not depend on the fragile layer.** Local storage and push notifications are bonuses. Email re-auth and the recap email are the durable spine.
- **Rescue belongs to the host.** The manual check-in is the human fallback when the technology fails in the room.

# VI. What this means for the build

The session and identity work is a small, well-understood layer, not a redesign. It adds one real thing and a handful of states.

**The one technical addition:** persistent accounts keyed to email, with server-side session tokens that live a long time, do not expire during a live event, and survive local storage being wiped.

**The new states and behaviors, mostly small:**

- The code-not-arriving help state on Sign-In, with edit-email, resend with countdown, and a check-spam line.
- The welcome-back re-authentication, which reuses the Sign-In and recognition screens for an expired session.
- A sign-out control in settings, and a kiosk mode for a check-in device.
- An add-to-home-screen prompt, offered after the event.
- A camera-permission help state on entry.
- The been-here-before merge path for a new email, simple for the pilot.
- Reuse of the existing Admin Check-In Panel as the manual rescue.

## Paste-ready prompts for the new states

### The code-not-arriving help state

```
Design a mobile screen, dark mode, background near-black #111111. This is the SODA sign-in code screen
in its help state, when the code has not arrived. One job: get the person unstuck.
Top: a slim line, the email the code was sent to in muted grey monospace, with a small "Edit" link in
Soda green #3BD75C beside it.
Center: the six-digit code input, empty, with a calm line of off-white #F5F5F5 text below, "It can take
a moment. Check your spam folder too."
Below: a "Resend code" button that shows a countdown like "Resend in 0:20" in muted grey while waiting,
then becomes an active green text link.
At the bottom, a quiet line in muted grey, "At the event? Ask the host to check you in."
Calm, never alarming. Green only on the links. 8px grid, 16px margins.
```

### The welcome-back re-authentication

```
Design a mobile screen, dark mode, background near-black #111111. This is the SODA welcome-back screen
for a returning person whose session expired. One job: confirm it is them and restore their home.
Top center: the host identity if an event is live, otherwise the quiet SODA mark.
Center, dominant: a warm headline in bold condensed uppercase display type, white, "WELCOME BACK, MAYA".
Below it one line of off-white #F5F5F5 body text, "Confirm it is you to pick up where you left off."
A single six-digit code input beneath, with a note that a code was sent to their email.
Bottom: a full-width Soda green #3BD75C button, "CONTINUE". A quiet "Use a different email" link below.
Feels like a greeting, not a checkpoint. Green only on the button. 8px grid, 16px margins.
```

### The add-to-home-screen prompt

```
Design a mobile bottom sheet, dark mode, rising over a dimmed near-black #111111 screen. This is the SODA
add-to-home-screen prompt, shown at a calm moment after the event. One job: invite installing the app.
The sheet, dark #1A1A1A with a rounded top and a small grabber handle, holds a short headline in white,
"KEEP SODA HANDY", and one line of off-white #F5F5F5 text, "Add it to your home screen so your contacts
are one tap away."
A full-width Soda green #3BD75C button, "ADD TO HOME SCREEN", and a quiet "Maybe later" text link below.
Light and optional, never blocking. Green only on the button. 8px grid, 16px margins.
```

*A name tag knows you showed up. SODA knows who you became to the room, and a person should never lose that to a typo, a dead tab, or a forgotten password.*
