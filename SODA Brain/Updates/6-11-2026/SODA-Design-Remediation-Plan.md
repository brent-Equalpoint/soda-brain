# SODA Design Remediation Plan

*The reconciliation of the Claude Design QA audit with the SODA corpus: what the audit got right, which side owns each finding, and the re-planned design pipeline that closes it. A product of Equalpoint, Inc.*

---

## The verdict on the audit

The audit is good, and it is the system working as designed. The specs were written precisely so that a build could be checked against them, and the audit did exactly that: it read all six spec documents and held every built surface to them. What it found splits cleanly into three kinds of finding, and the split is the plan.

- **Build defects.** The spec is right, the Claude Design build deviates. These go back to Claude Design as fixes. Most findings are this kind, which is the healthy case: the paper was correct and the build drifted.
- **Corpus defects.** The build exposed something our documents got wrong or never covered. These are ours, and there are three: the muted-text contrast token, the absence of a formal accessibility baseline, and a status vocabulary that let Built mean two different things.
- **Decisions.** One finding is neither a bug nor a gap, it is a choice: what identity data sign-in collects. Decided below.

I verified the audit's one mathematical claim independently. Muted text at #777777 is 4.22 to 1 on the canvas and 3.89 to 1 on cards, both under the 4.5 AA threshold, so the finding is confirmed and slightly understated.

---

## Finding by finding

**P1-1. Identity fields never lock.** The Event Layer spec defines the draft, live, and closed editing rule; the Admin does not enforce it. Build defect. Fix in Claude Design: lock identity fields by event status exactly as the spec states.

**P1-2. The Command Center can fire acts in any state.** The lifecycle gating that prevents a misfire is specified and absent. Build defect, and the most dangerous one, because a Drop fired into a draft or closed room is a public mistake of the kind the product promises not to make. First fix in the queue.

**P1-3. The lifecycle message is missing its event-ended variation.** The survey-path variant exists in the spec and not in the build. Build defect.

**P1-4. Sign-in collects phone and Google identity beyond the privacy policy's stated full list.** A decision, now made, recorded as SODA-033. Phone collection is removed: no SODA spec ever asked for it, and the email-code plus social flow does not need it. Google identity stays, because decision SODA-025 adopted social sign-in, and the privacy policy is amended so the full list is true again: email, name, the role, offer, and need chips, an optional photo, and the basic profile a social provider shares at sign-in. The policy is still on the pre-pilot counsel path, so the amendment rides that existing task.

**The states debt.** Four of the five states that occur at every event are unbuilt, including the early room, which our own states spec names the most important empty state in the app. Build work, not new design: all of these are specified. The early room is first because every event begins there.

**The six phantom Built components.** The inventory and manifest let Built mean rendered in our simulations, while the audit read it as exists in the production kits. Corpus defect: the vocabulary was ambiguous, and an agent reading our manifest would believe more exists than does. Fixed by SODA-032's status rule: Built now means present in the production-bound kit, simulations are Prototyped, and the six components are restated accordingly in a truth-up pass.

**The accessibility cluster.** Contrast under AA on muted text, touch targets under 44 pixels on chips and dismissals, and keyboard and focus gaps. Mixed ownership. The 44-pixel rule is in our foundation, so the small targets are build defects. The contrast failure is our token, fixed by raising muted to #8A8A8A, which clears 5.47 on canvas and 5.04 on cards. The keyboard gaps reveal that we never wrote an accessibility baseline beyond touch targets, so SODA-032 adds one: AA contrast for all text tokens, visible focus states on every interactive element, full keyboard operability of attendee-critical flows, and reduced-motion respect when the motion layer arrives.

**The orphaned root files.** Two stray files in the Claude Design project carry a divergent button edit. Housekeeping: reconcile the edit into the kit and delete the strays, so the kit has one source of truth.

---

## The re-planned design pipeline

Four short passes in Claude Design, in this order, then a re-audit. Order follows risk: correctness before completeness, completeness before polish.

**Pass 1, correctness.** Lifecycle gating in the Command Center, identity-field locking in the Admin, the event-ended message variation, and removal of the phone field from sign-in. These are the P1 spec breaks, and the misfire gate leads.

**Pass 2, the states.** Build the four missing every-event states, the early room first. No new design needed, the states spec already defines each.

**Pass 3, accessibility.** Apply the new muted token #8A8A8A, raise every chip and dismissal to 44 pixels, add visible focus states and keyboard paths per the new baseline.

**Pass 4, truth-up.** Restate the six components under the new status vocabulary, reconcile and delete the two orphaned files, and update the manifest so the tracker matches the kits.

**Then re-audit.** Run the same specs-versus-build audit again. The plan is closed when it returns no P1s and the states and accessibility passes hold.

---

## What changed in the corpus

- **SODA-DECISIONS.md** gains SODA-032, the accessibility baseline and the muted-token change and the status vocabulary, and SODA-033, the sign-in data scope.
- **The design foundation token** for muted text moves from #777777 to #8A8A8A wherever the foundation is stated.
- **The privacy policy placeholder** gains the social-provider line and loses nothing else, riding the existing counsel task.
- **The manifest** gets the truth-up in Pass 4, with Built reserved for kit reality.

---

## The paste-ready prompt for Claude Design

Paste this into the SODA Design System project to execute the plan:

```
Execute the remediation plan from the QA audit, in four passes, in order.
Pass 1, correctness: gate the Command Center so no act can fire unless the
event is live; lock identity fields in the Admin per the Event Layer rule
(editable in draft, locked in live, locked in closed); add the event-ended
lifecycle message variation with the survey path; remove the phone field
from sign-in entirely (email code and social sign-in only).
Pass 2, states: build the four missing every-event states from the states
spec, starting with the early room.
Pass 3, accessibility: change --text-muted to #8A8A8A everywhere; bring
every chip and dismissal target to at least 44px; add visible focus states
and keyboard operability to all interactive elements in the attendee flow.
Pass 4, truth-up: mark the six components that exist only in simulations as
Prototyped, not Built; reconcile the divergent button edit from the two
orphaned root files into the kit, then delete admin.jsx and panels.jsx at
root. After all passes, re-run the specs-versus-build audit and report
remaining findings. Do not introduce em dashes anywhere.
```

*A name tag knows you showed up. SODA knows who you became to the room, and an audit that catches the room's mistakes on paper is the cheapest night the product will ever have.*
