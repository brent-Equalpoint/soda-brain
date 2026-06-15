# SODA: Collaborator Onboarding and the Host Welcome-Back

*The warm front door for a new collaborator, a light tutorial, and the returning-host greeting. An addendum to the Host Access spec. A product of Equalpoint, Inc.*

The host side has a sign-in and a bare account-setup form, but never the warm front door, how a collaborator is first welcomed and oriented, and how a returning host is greeted. These are the host equivalent of the attendee Welcome and Returning-Guest Recognition.

Three principles hold throughout. The welcome is event-specific, because collaborators are added per event. The tutorial is scoped to the collaborator's actual powers, so it never teaches a capability their role does not have. And the tutorial is skippable and revisitable, because a tutorial no one can skip or return to becomes a wall people bounce off.

---

## Screen H1: The Collaborator Welcome

**The one job.** Welcome a new collaborator warmly to the specific event they were added to, and point them to a short tutorial before the night.

**Place in the app.** Host side, first-time entry. Shown right after a collaborator accepts an invite or is added by an Owner, just after account setup.

**State shown.** First-time, event-specific, for a Collaborator.

**Regions, top to bottom**

- **Top:** The host identity of the event, the logo or host name, so the collaborator sees whose event they are joining.
- **Center:** The dominant element: a warm headline welcoming them by name, for example WELCOME, NICOLE. Below it, a line naming who added them and the event, for example Future added you to help run Creative Meetup. A small plain statement of their role, Collaborator, and one line on what that lets them do.
- **Bottom:** A green primary button to start the short tutorial, with a quiet skip link beneath it.

**Primary action.** Tap to start the tutorial, or skip. Either way they land oriented. The welcome names the event and the role so the collaborator knows exactly what they walked into.

**Carried forward.** Mirrors the attendee Welcome and Returning-Guest Recognition in structure and warmth, swapped to the host context. Reuses the host identity treatment and the green primary button. Reads the role from the three-level access model.

**Paste-ready Claude Design prompt**

```
Design a mobile or tablet screen, dark mode, background near-black #111111. This is the SODA
collaborator welcome, shown when someone is added to help run a specific event. One job: welcome them
warmly to that event and point to a short tutorial.
Top center: the event host identity, a logo or host name in clean white type.
Center, dominant: a warm headline in bold condensed uppercase display type, white, "WELCOME, NICOLE".
Below it off-white #F5F5F5 body text, "Future added you to help run Creative Meetup." Then a small
role line, a "Collaborator" pill in Soda green #3BD75C, with one muted-grey line, "You can run the
night. The owner keeps the guest data."
Bottom: a full-width Soda green #3BD75C button, "SHOW ME AROUND", and a quiet "Skip" text link below.
Warm and orienting. Green only on the pill and button. 8px grid, 16px margins, one dominant element.
```

---

## Screen H2: The Collaborator Tutorial

**The one job.** Orient a collaborator in a few light, skippable cards scoped to what their role can actually do, so they do not freeze when the night starts.

**Place in the app.** Host side, follows the welcome. A short carousel of cards, skippable and revisitable later from a help affordance.

**State shown.** A few cards, one at a time, for a Collaborator.

**Regions, top to bottom**

- **Top:** A thin progress cue and a persistent skip link, so leaving is always one tap away.
- **Center:** The dominant element: one tutorial card at a time, each a simple illustration and one short line. The set is small and concrete: this is the room filling up, this is how the owner fires a moment like the Drop and what you will see, here is what you can do and what stays with the owner, and here is where to look when the event is live.
- **Bottom:** A green next button that advances and becomes a done button on the last card.

**Primary action.** Move through the cards, or skip at any point. The tutorial teaches only what a collaborator can do, never a capability their role lacks, like exporting the guest list, so it never sets a wrong expectation. It can be reopened later from a help affordance.

**Carried forward.** Reuses the one-at-a-time pattern and progress cue from the attendee Survey, and the green primary button. The card set is scoped by the three-level model, so an Owner would see owner capabilities instead.

**Paste-ready Claude Design prompt**

```
Design a mobile or tablet screen, dark mode, background near-black #111111. This is the SODA
collaborator tutorial, a short skippable carousel. One job: orient a collaborator in a few light cards.
Top: a thin progress cue in Soda green #3BD75C, for example "2 of 4", and a quiet "Skip" link, always visible.
Center, dominant: one card, a simple clean illustration above a short white headline and one line of
off-white #F5F5F5 text. Show the card "HOW A MOMENT FIRES", with a small illustration of a prompt
going to phones, and the line "The owner fires a moment like the Drop. You will see it land here."
Bottom: a full-width Soda green #3BD75C button, "NEXT", which becomes "GOT IT" on the last card.
Light, concrete, never a wall of text. Green only on the progress cue and button. 8px grid.
```

---

## Screen H3: The Host Welcome-Back

**The one job.** Greet any returning Owner or Collaborator by name, show what is waiting, and route them to the right place.

**Place in the app.** Host side, returning entry. Shown when a known host reopens the app, pairing with the welcome-back re-authentication from the auth spec.

**State shown.** Returning, for an Owner or a Collaborator, with one or more events.

**Regions, top to bottom**

- **Top:** The quiet SODA mark, or the host identity if a single event dominates.
- **Center:** The dominant element: a warm greeting by name, WELCOME BACK, NICOLE. Below it, what is waiting: the events they own or help run, with anything live now marked clearly, and anything that needs attention surfaced first.
- **Bottom:** Routing. A green primary action to the most relevant place, into the live event's Command Center if one is running, otherwise into the event they most likely want. Quiet links to the others.

**Primary action.** One tap to the right place. If an event is live, the primary action goes straight into its Command Center, honoring the never-drop-mid-event rule so a returning host runs the night rather than hunting for it.

**Carried forward.** The host equivalent of the attendee Returning-Guest Recognition, and the warm partner to the welcome-back re-authentication, which confirms it is them. This one greets them and points forward. Routing respects the three-level model, so each host sees only their own events.

**Paste-ready Claude Design prompt**

```
Design a mobile or tablet screen, dark mode, background near-black #111111. This is the SODA host
welcome-back, shown when a known Owner or Collaborator returns. One job: greet them and route them.
Top center: the quiet SODA mark.
Center, dominant: a warm headline in bold condensed uppercase display type, white, "WELCOME BACK,
NICOLE". Below it a short list of their events, each a row with the host identity, the event name,
and a status tag, a Soda green #3BD75C "Live now" on any running event, muted tags on the others.
Bottom: a full-width Soda green #3BD75C button to the most relevant place, "ENTER THE COMMAND CENTER"
if an event is live, otherwise "OPEN YOUR EVENT", with quiet links to the rest.
Warm and oriented, a greeting not a checkpoint. Green only on the live tag and button. 8px grid.
```

---

## How these fold in

These three sit alongside the host sign-in, account setup, and collaborator management already specified. The welcome and tutorial follow account setup on the first-time path. The welcome-back follows the welcome-back re-authentication on the returning path. The tutorial is reachable again from a help affordance in host settings, so it serves a collaborator the first time and any time after.

*A name tag knows you showed up. SODA knows who you became to the room, and a collaborator should feel oriented and welcome before they ever help run it.*
