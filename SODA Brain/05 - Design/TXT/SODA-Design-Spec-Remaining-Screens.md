# SODA: The Remaining Six Attendee Screens

*Completing the attendee set, in the design-spec format. A product of Equalpoint, Inc.*

The ten-screen spine covered the core path. These six complete it: the photo step, the returning guest, the comment, the survey, the send-off, and the message a guest sees when the event is not live. They are numbered eleven through sixteen to continue the spine, so the two documents together give a clean set of all sixteen attendee screens.

They follow the same locked foundation: dark canvas, green for action, eight-point grid, forty-four pixel touch targets, one dominant element. Each carries forward the patterns established earlier so the set stays coherent. Where a screen has empty, loading, or error states, those are specified in the states pass and noted here so they can be generated alongside.

With these six specified, every attendee screen has a written spec and a paste-ready prompt. The only remaining design work is the motion layer, which stays last by plan.

---

## Screen 11: The Photo Step

**The one job.** Let the guest add a profile photo, with skipping offered as an equal choice.

**Place in the flow.** Setup phase. Sits at step four of the attendee flow, between Sign-In and the role chips.

**State shown.** Optional step, just after the code is verified.

**Regions, top to bottom**

- **Top:** A thin setup progress cue in monospace, and a short display headline, for example PUT A FACE TO IT.
- **Center:** The dominant element: a large circular photo target with a camera or plus icon, showing a colored initials-avatar preview behind it, so the guest sees their fallback even before adding anything. One supporting line explains a photo helps people find them in the room.
- **Bottom:** The green full-width primary button to continue, with a quiet skip link directly beneath it.

**Primary action.** Tap the circle to add a photo, or tap skip. Both advance to the role chips. Skipping is offered with equal weight, and it produces the initials avatar with no friction.

**Carried forward.** Reuses the green button position and style from Welcome and Sign-In. The circular avatar and initials fallback defined here are reused everywhere a person appears, on their Room View card and in the acts, so the guest recognizes their own face throughout.

**Its empty, loading, and error states.** Loading while a photo uploads, and an error fallback to the initials avatar if it fails, both specified in the states pass.

**Paste-ready Claude Design prompt**

```
Design a mobile screen, dark mode, background near-black #111111. This is the photo step in SODA,
between sign-in and the profile chips. One job: add a profile photo, with skip as an equal choice.
Top: a thin setup progress cue in monospace, and a bold condensed uppercase display headline in
white, "PUT A FACE TO IT".
Center, dominant: a large circular photo target, dark #1A1A1A with a 1px border #262826, with a
camera or plus icon, showing a colored initials-avatar preview behind it. Below it one line of
off-white #F5F5F5 body text, "A photo helps people find you in the room."
Bottom: one full-width Soda green #3BD75C button with near-black text, "CONTINUE", and directly
below it a quiet muted-grey text link, "Skip for now".
Green only on the button. 8px grid, 16px margins, one dominant element.
```

---

## Screen 12: Returning Guest Recognition

**The one job.** Greet a known guest by name with their history, and send them straight into the room.

**Place in the flow.** Setup phase, alternate entry. Branches off the Welcome for a guest the system already knows.

**State shown.** A returning guest, recognized at the Welcome step.

**Regions, top to bottom**

- **Top:** The host identity, the logo or the host name in clean type.
- **Center:** The dominant element: a warm headline greeting them by name, for example WELCOME BACK, MAYA. Below it, one line recalling their history, their event count and connections so far, which is Community Memory made visible. An optional small avatar with their known photo or initials.
- **Bottom:** The green full-width primary button to enter the room directly, since their profile already exists and setup is skipped.

**Primary action.** One tap to enter the room. Because the system knows them, the three chip steps are skipped and they go straight to the live room, which is the reward for returning.

**Carried forward.** Mirrors the Welcome screen structure exactly, swapping the first-time greeting for a warm, familiar one. Reuses the host identity placement and the green button. The history line is the first visible payoff of the memory that makes the platform compound over time.

**Its empty, loading, and error states.** A thin-history empty state, for a returning guest with little past to recall, is specified in the states pass so the greeting never feels hollow.

**Paste-ready Claude Design prompt**

```
Design a mobile screen, dark mode, background near-black #111111. This is the returning-guest
welcome in SODA, shown when the app recognizes someone from a past event. One job: greet them by
name and send them into the room.
Top center: the host identity, a logo or the host name in clean white type.
Center, dominant: a warm headline in bold condensed uppercase display type, white, "WELCOME BACK,
MAYA". Below it one line of off-white #F5F5F5 body text recalling their history, "Your third event.
Seven connections so far." An optional small circular avatar with their photo or initials.
Bottom: one full-width Soda green #3BD75C button with near-black text, "ENTER THE ROOM", since
setup is skipped for a known guest.
Warm and familiar. Green only on the button. 8px grid, 16px margins, one dominant element.
```

---

## Screen 13: The Comment

**The one job.** Let a guest leave one short reaction for another person in the room.

**Place in the flow.** In the room. An overlay opened from a person's card in the Room View.

**State shown.** A light overlay on top of the Room View, attached to one person.

**Regions, top to bottom**

- **Behind:** The Room View, dimmed, so the guest keeps their place.
- **Center:** The dominant element: a card holding, at its top, the target person's mini-card, a small avatar, their name, their role. Below that, a short text input, and an optional row of quick reaction chips for common notes.
- **Bottom of the card:** The green send button.

**Primary action.** Write a short note or tap a quick reaction, then send. The interaction is meant to be fast and light, a small gesture toward someone, done in seconds without leaving the room.

**Carried forward.** Reuses the modal pattern and the person-card styling from the Room View, and the input pattern with the green focus border from Sign-In. The quick reaction chips reuse the chip styling from the profile steps.

**Paste-ready Claude Design prompt**

```
Design a mobile screen overlay, dark mode, background near-black #111111 dimmed behind. This is the
comment overlay in SODA, opened from a person's card in the room. One job: leave one short
reaction for that person.
The dimmed Room View shows behind. Center, dominant: a card, dark #1A1A1A with a 1px border
#262826, rounded. At its top, the target person's mini-card: a small circular avatar, their name
in white DM Sans, their role in muted grey.
Below: a short text input with a Soda green #3BD75C focus border, and an optional row of quick
reaction chips like "Great to meet you", "Let us connect", "Loved your work".
Bottom of the card: one full-width Soda green #3BD75C button, "SEND".
Green only on the focus border and send button. 8px grid, 16px margins. Light and quick.
```

---

## Screen 14: The Post-Event Survey

**The one job.** Capture how the night felt, one question at a time.

**Place in the flow.** After the event. Reached by the survey QR or the link in the recap email, during the closed state.

**State shown.** One question at a time, with a progress bar across the set.

**Regions, top to bottom**

- **Top:** A thin progress bar in green with a monospace count, for example 3 OF 6, so the guest sees how far they are.
- **Center:** The dominant element: one question in display type, with the answer control for its type beneath it, a star row, a sliding scale, tappable tag chips, or a free-text box. Only one question shows at a time.
- **Bottom:** A quiet back link on the left and the green next button, which advances through the set and becomes a submit on the last question.

**Primary action.** Answer the current question, then next. One question owning the screen keeps it effortless even for someone half out the door, and the progress bar promises it is short.

**Carried forward.** Reuses the progress indicator from the chip steps, the chip styling for tag questions, the input styling for free text, and the green primary button. Selected answers confirm in green, holding the rule that green means a choice is made.

**Its empty, loading, and error states.** A submitting loading state and a submit-failed error state that preserves the entered answers are specified in the states pass.

**Paste-ready Claude Design prompt**

```
Design a mobile screen, dark mode, background near-black #111111. This is the post-event survey in
SODA, one question at a time. One job: answer the current question.
Top: a thin progress bar in Soda green #3BD75C with a monospace count like "3 OF 6".
Center, dominant: one question in bold condensed uppercase display type, white. Below it the answer
control for this question type. Show a star rating row with three of five filled Soda green #3BD75C,
or a horizontal scale slider, or a wrap of tappable tag chips matching the chip style.
Bottom: a back text link in muted grey on the left, and a full-width Soda green #3BD75C button,
"NEXT".
One question owns the screen. Green on the progress bar, selected answers, and the next button.
8px grid, 16px margins, one dominant element.
```

---

## Screen 15: The Send-Off

**The one job.** End the night on warmth and point softly to what comes next.

**Place in the flow.** After the event. Follows the survey, the final screen of the attendee experience.

**State shown.** The closing screen, after the survey is complete.

**Regions, top to bottom**

- **Top:** The host identity, logo or host name in clean type.
- **Center:** The dominant element: a warm closing headline, with one affirming supporting line. The surface here may use the deep green to feel like a warm close rather than a cold end.
- **Bottom:** One soft call to action, a green button toward the next event or the waitlist, with a quiet done link beneath it for anyone who simply wants to leave.

**Primary action.** Read the close, then optionally tap toward what is next. The call to action is gentle, because the moment is about ending well, and the next step is offered rather than pushed.

**Carried forward.** Bookends the Welcome, reusing its centered structure and the host identity, closing the loop the Welcome opened. The green button returns one last time as the single action, consistent from the very first screen.

**Paste-ready Claude Design prompt**

```
Design a mobile screen, dark mode, background a warm deep green #203229 for this closing moment, or
near-black #111111. This is the send-off in SODA, the warm close after the survey. One job: end on
warmth and point softly to what is next.
Top center: the host identity, logo or host name in clean type.
Center, dominant: a warm closing headline in bold condensed uppercase display type, white, "THAT IS
A WRAP". Below it one line of off-white #F5F5F5 body text, "You showed up and met the room. That is
the work."
Bottom: one soft call to action, a Soda green #3BD75C button "SEE WHAT IS NEXT" pointing to the next
event or waitlist, with a quiet "Done" text link below it in muted grey.
Affirming and calm, a bookend to the welcome. Green only on the button. 8px grid, 16px margins.
```

---

## Screen 16: The Lifecycle Message

**The one job.** Tell a guest warmly what is happening when they scan an event that is not live.

**Place in the flow.** Edge entry. Shown when a scan lands on an event in the draft or closed state rather than live.

**State shown.** Two variations from one flexible screen: not-yet-open, and event-ended.

**Regions, top to bottom**

- **Top:** The host identity, logo or host name in clean type, so even this message wears the event brand.
- **Center:** The dominant element: a warm message. In the not-yet-open variation, a line that doors are not open yet. In the event-ended variation, a line that the event has closed, with thanks.
- **Bottom:** Contextual. In the not-yet-open variation, nothing pressing, just a calm note to return. In the event-ended variation, a green button to the survey if the guest has not done it.

**Primary action.** Mostly to inform, warmly. In the ended variation, the one action is the survey, offered to anyone who missed it. The screen reads as a calm pause in the host brand, holding the guest gently until the event is live or pointing them to the one thing left to do.

**Carried forward.** Reuses the Welcome and Send-Off structure and the host identity, so the guest feels held by the same brand even outside the live experience. It reads its state from the event lifecycle defined in the Event Layer.

**Its empty, loading, and error states.** This screen is itself the lifecycle empty state, so its two variations are the specification. The states pass references it as the not-yet-open and event-ended messages.

**Paste-ready Claude Design prompt**

```
Design a mobile screen, dark mode, background near-black #111111. This is the lifecycle message in
SODA, shown when a guest scans an event that is not live. One job: tell them warmly what is
happening, in the host identity. Show two variations as a set.
Top center for both: the host identity, logo or host name in clean type.
Variation A, not yet open: a headline in bold condensed uppercase display type, white, "ALMOST
TIME". Below it off-white #F5F5F5 body text, "Doors are not open yet. Come back when the event
starts." No pressing action.
Variation B, event ended: a headline "THAT IS A WRAP". Below it body text, "This event has closed.
Thanks for being in the room." Plus a full-width Soda green #3BD75C button "TAKE THE SURVEY" for a
guest who has not done it.
Calm and warm in tone. Green only on the survey button in variation B. 8px grid, 16px margins.
```

---

## The Attendee Set Is Complete

With these six, all sixteen attendee screens are specified with paste-ready prompts: the ten-screen spine and these six. Taken with the flow maps, the event layer, and the states pass, the attendee experience is fully described for a first build. The remaining design work is the motion layer, which stays last by plan, applied once the static screens are confirmed in Claude Design.

*A name tag knows you showed up. SODA knows who you became to the room.*
