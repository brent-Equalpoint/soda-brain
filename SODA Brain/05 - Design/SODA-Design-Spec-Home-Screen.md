# SODA: The Home Screen

*Where a guest lives between events: profile, events, and contacts. A product of Equalpoint, Inc.*

SODA specified the event night end to end. This is the other half: the home a guest returns to between events, where their profile, their history, and the people they met all live. It is the screen that turns SODA from a one-night tool into something people come back to.

The structure is a tabbed home. A compact profile header sits at the top across every tab. Three tabs sit at the bottom: Overview, the personalized landing, Events, the history, and Contacts, the rolodex. The Contacts tab is the heart of the screen, because the people are the lasting value.

Built now: the home shell and its three tabs, plus the technicals for the timed follow-up nudge. Reserved for soon: scan-to-add for new contacts, a share slide-up to text or email a contact, and the location-based history of where you met. Each has a clear home in this design so it slots in cleanly later.

---

## Screen 17: The Home Shell

**The one job.** Frame the whole home: the profile header on top and the three tabs at the bottom.

**Place in the app.** The home base between events, reached after an event or by reopening the app. The container the three tabs live in.

**State shown.** The frame. The Overview tab is the default content.

**Dominant element.** Not applicable, this is the frame.

**Regions, top to bottom**

- **Top:** A compact profile header: a circular avatar, photo or initials, the guest name in white, their role in muted grey, and a small settings affordance on the right. Tapping the header opens the full profile to edit, a detail screen specified later.
- **Middle:** The active tab content fills the body. Specified in screens eighteen through twenty.
- **Bottom:** A tab bar with three tabs, each an icon and a label: Overview, Events, Contacts. The active tab is Soda green. The Contacts tab carries a small purple dot when follow-up nudges are waiting.

**Primary action.** Switch between the three tabs, or tap the profile header to view and edit the full profile. The tab bar is the spine of the home.

**Carried forward.** Reuses the circular avatar and initials fallback from the Photo step. Green marks the active tab, holding the rule that green means interactive. Purple marks a waiting nudge, consistent with the private Nudge act.

**Paste-ready Claude Design prompt**

```
Design a mobile screen, dark mode, background near-black #111111. This is the home shell for SODA,
the screen a guest returns to between events. One job: frame the profile header and three tabs.
Top: a compact profile header, a circular avatar (photo or colored initials), the name "MAYA CHEN"
in white DM Sans, a role "Founder" in muted grey #777777, and a small settings icon on the right.
Middle: a placeholder body area for the active tab content.
Bottom: a tab bar with three tabs, each an icon above a label, "Overview", "Events", "Contacts".
The active tab (Overview) is Soda green #3BD75C, the others muted grey. Put a small purple #A47BFF
dot on the Contacts tab to signal waiting follow-ups.
8px grid, 16px margins, 44px touch targets. Green only on the active tab, purple only on the dot.
```

---

## Screen 18: The Overview Tab

**The one job.** Give the guest a personalized landing: their recent events, the people they synced with, and an experience drawn from their survey feedback.

**Place in the app.** The default tab of the home. The first thing seen on opening the app between events.

**State shown.** Default tab, populated for a guest with history.

**Dominant element.** The people you synced with, the warm block of recent connections, with recent events as a compact strip above it.

**Regions, top to bottom**

- **Profile header:** From the shell, persistent.
- **Greeting:** A warm line, for example WELCOME BACK, MAYA, in display type.
- **Recent events:** A compact horizontal strip of the last events attended, each a small card with the host identity, event name, date, and a count of people met. A see-all affordance and tapping any card both open the Events tab.
- **People you synced with:** The dominant block: a warm row or grid of the freshest contacts, avatars with names, the most recent connections. Tapping a person opens their contact, tapping see-all opens the Contacts tab.
- **Your experience:** An insight card drawn from survey feedback, reflecting what the guest said they came for and surfacing a relevant takeaway or people who fit. This is the personalization layer.
- **Bottom:** The tab bar, Overview active.

**Primary action.** Scan the recent activity, then tap into an event or a person. The recent events strip leads to the Events tab, and the synced-people block leads to contacts. The screen is a dashboard that routes to the two tabs.

**Carried forward.** Reuses the person-card and event-card styling, the host identity treatment from the event layer, and the chip vocabulary in the experience insight. The greeting echoes the returning-guest recognition tone.

**Paste-ready Claude Design prompt**

```
Design a mobile screen, dark mode, background near-black #111111. This is the Overview tab of the
SODA home, a personalized landing. One job: show recent events, people you synced with, and a
survey-based experience insight.
Top: the compact profile header (avatar, name, role).
Greeting: a warm headline in bold condensed uppercase display type, white, "WELCOME BACK, MAYA".
Recent events: a horizontal strip of small cards, each with a host logo or name, an event title, a
date, and a small "12 met" count. Include a "See all" link to the Events tab.
People you synced with, the dominant block: a row of circular avatars with names beneath, the most
recent connections, with a "See all" link to Contacts.
Your experience: a calm insight card, deep green #203229 surface, with a line drawn from the survey,
for example "You came to find collaborators. Three people from your events fit."
Bottom: the three-tab bar with Overview active in Soda green #3BD75C.
8px grid, 16px margins. Green only on active and interactive elements. Warm and scannable.
```

---

## Screen 19: The Events Tab

**The one job.** Show the full history of events the guest has attended, with where and when.

**Place in the app.** The middle tab. The guest's event history.

**State shown.** A list of past events, newest first.

**Dominant element.** The event list.

**Regions, top to bottom**

- **Profile header:** From the shell.
- **Event list:** A list of events attended, newest first. Each row carries the host identity, logo or name, the event title, the date, the location where it was held, and a small count of people met. A recap or survey affordance appears where one is available.
- **Location:** The where-you-met line on each row is the start of the location history. It fills automatically from the event when known, in the auto-draft style, and can be added or edited by hand when it is not.
- **Row tap:** Tapping an event opens its detail, the people met there and the recap, a detail screen specified later.
- **Bottom:** The tab bar, Events active.

**Primary action.** Browse the history and tap an event to see who you met there. This tab is the spine of memory across events, and the place the location history is read.

**Carried forward.** Reuses the host identity treatment from the event layer and the card styling from the Room View. The location line is designed to carry the future history tracker, location-based or manual.

**Paste-ready Claude Design prompt**

```
Design a mobile screen, dark mode, background near-black #111111. This is the Events tab of the SODA
home. One job: list the events the guest has attended, newest first.
Top: the compact profile header.
Body, dominant: a vertical list of event rows. Each row: a host logo or host name in clean type, an
event title in white, a date and a location in muted grey monospace ("Mar 14 · Cleveland"), and a
small "12 met" count on the right. Show a subtle recap link on rows that have one.
Each row is tappable to open that event.
Bottom: the three-tab bar with Events active in Soda green #3BD75C.
8px grid, 16px margins, 44px touch targets. Calm and readable. Green only on interactive elements.
```

---

## Screen 20: The Contacts Tab, the Rolodex

**The one job.** Show every person the guest has met, and where they are in following up.

**Place in the app.** The third tab and the heart of the home. The rolodex of everyone met.

**State shown.** Two layers: a dismissible overview on top, the full rolodex beneath.

**Dominant element.** The full contact list, the rolodex. The overview sits on top of it and can be dismissed to reveal the whole list.

**Regions, top to bottom**

- **Profile header:** From the shell. A small add or scan affordance sits in the header, reserved for the future scan-to-add of new contacts.
- **The overview, dismissible:** A section at the top titled for recent activity and follow-ups. It shows recently met people with a clear signal on each: saved, meaning the guest saved their card, reached out, a green confirmation that contact was made, and a follow-up nudge, a purple signal for people the guest meant to reach out to but has not. A grouped People to reach out to set leads with the purple nudges. A close affordance collapses the overview.
- **The rolodex:** Beneath the overview, the full contact list: a search field, then a scrollable list of everyone met. Each row carries an avatar, the name, the role, a met-at line naming the event and where, and a quick action on the right, reserved for the future share and reach-out slide-up.
- **Bottom:** The tab bar, Contacts active.

**Primary action.** Glance at who needs follow-up, act on a nudge, or dismiss the overview to browse the whole rolodex and search for anyone. Tapping a contact opens their detail.

**Carried forward.** Reuses the person-card styling from the Room View. Purple marks a follow-up nudge, the same purple as the private Nudge act. Green marks a completed reach-out. The met-at line carries the location history, and the row action and header reserve the share and scan features.

**Paste-ready Claude Design prompt**

```
Design a mobile screen, dark mode, background near-black #111111. This is the Contacts tab of the
SODA home, the rolodex. One job: show everyone the guest has met and where they are in following up.
Top: the compact profile header, with a small "+" or scan icon on the right reserved for adding
contacts.
A dismissible overview section titled "RECENTLY MET & FOLLOW-UPS": a few recent contact rows, each
with a signal, a muted "Saved" tag, a Soda green #3BD75C check meaning "Reached out", or a purple
#A47BFF dot meaning "Reach out". Lead with a small "People to reach out to" group carrying the
purple nudges. Include a small close control to collapse this section.
Beneath it, the dominant element: the full rolodex. A search field, then a scrollable list of contact
rows, each with a circular avatar, a name in white, a role in muted grey, a met-at line in monospace
("Met at Creative Meetup · Cleveland"), and a small action icon on the right.
Bottom: the three-tab bar with Contacts active in Soda green #3BD75C, a purple dot on the tab.
8px grid, 16px margins. Green confirms, purple nudges, nothing else colored.
```

---

# The Technicals: Contact Warmth and the Follow-Up Nudge

The follow-up nudge is the relationship intelligence of the platform applied to the guest's own contacts. This section defines how it works and how its timing is decided, so the build has the logic, not only the look.

## Warmth, and how it decays

Every contact carries a warmth value. Warmth is full at the moment two people meet and decays gradually over time unless the relationship is renewed, following the same decay the platform uses elsewhere, where warmth falls roughly on the curve e to the power of negative zero point zero one times the number of days since the last meaningful interaction. A fresh contact is warm. A contact untouched for weeks cools. Reaching out renews warmth to full.

## The four signals

- **Just met.** A fresh contact, recently added. Warm, no action prompted yet.
- **Saved.** The guest saved the card, a logged signal of intent. Warmth is held a little higher.
- **Reached out.** The guest connected. Shown as a green confirmation. Warmth refreshes to full and any nudge clears.
- **Follow-up nudge.** Shown in purple. Surfaces when a contact the guest has not reached out to cools past a threshold, especially one they saved or were matched with through the event Nudge.

## The timing

A follow-up nudge appears after a window of no contact, and the window depends on intent. A contact the guest saved or was matched with through the Nudge surfaces sooner, within a few days, because the guest signaled it matters. A casual contact surfaces later, or quietly cools without a nudge at all. As warmth keeps decaying, the nudge can grow gently more prominent, but it never nags. The frequency of nudges is capped, so the home never feels like a list of obligations.

## Control, consent, and learning

Two principles hold, both inherited from the platform. First, SODA suggests, it does not act. A follow-up nudge prompts the guest to reach out, and it never messages anyone on their behalf without the guest taking the action. Second, dismissal is a signal. When a guest dismisses a follow-up nudge, that discard is logged, so the system learns who the guest does and does not want to be reminded about. This closes a known gap, where discard signals were not captured, and it makes the nudges sharper over time.

## Personalization from the survey

What the guest said they came for tunes which contacts are prioritized for nudges. If the guest said they were looking for collaborators, the contacts who offered collaboration surface first. The survey feedback that personalizes the Overview tab is the same signal that orders the follow-up nudges.

## Wellbeing

The nudge encourages healthy follow-through, the small act of staying in touch that people mean to do and forget. It is designed to support that, with capped frequency, an easy way to turn it off, and language that invites rather than pressures. It should never make the guest feel behind or guilty.

---

# Where the soon features land

You named three features for soon rather than now. Each already has a reserved home in this design, so building them later is additive.

- **Scan to add a contact.** The add or scan affordance in the Contacts tab header is the entry point for the future intake flow.
- **Share a contact.** The quick action on each contact row, and on the contact detail, is the entry point for the share slide-up, a sheet that rises to text, email, or otherwise share that contact.
- **The location history.** The met-at line on each contact and each event row carries where you met. It fills automatically from the event when known, in the auto-draft style, and can be added or edited by hand when it is not.

## What comes next

Two pieces follow this home screen. First, the full profile detail screen, where the guest views and edits their own micro-profile, which the profile header taps into. Second, the flow maps: a flow map for this home area, then a master flow map across every screen, the event night and the home together.

*A name tag knows you showed up. SODA knows who you became to the room, and the home is where the room stays with you.*
