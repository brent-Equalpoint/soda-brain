# SODA Reporting Layer, Implementation Spec

*The operator-facing surfaces. Live ops during the room, and the post-room report that keeps writing itself. Companion to `SODA-Room-Health-Telemetry.md`.*

**Version 1.0**

---

## 0. The thesis

Two surfaces, two different questions.

| Surface | Question | Nature |
| --- | --- | --- |
| **Live ops** | Is the room working *right now*? | Glanceable, actionable, disposable |
| **Post-room report** | Was it *worth* anything? | Continuous, self-updating, honest about what it does not know |

The distinction that matters most: **activity is settled on the night. Value is not.** 412 connections is activity. How many of those 412 are still alive in three weeks is value, and nobody knows it on the night, including the attendees. That is precisely why SODA does not ask them to predict it. The warmth engine measures it instead.

Governing rule for every number on either screen: **it must be either reassuring or actionable. If it is neither, cut it.**

---

## 1. Live ops dashboard

### Purpose
You are standing in the room. You need to know in five seconds whether it is working, and if not, who to walk over to.

### The glance row (five numbers, no more)

| Metric | Source | Why it earns a slot |
| --- | --- | --- |
| In the room | presence | denominator for everything else |
| Cards built | `you_state >= card` | are people investing in being seen |
| Connections | `connections` count | raw output |
| Considered ratio | connections with a `why` / total | quality axis, not just volume |
| **Connected with nobody** | `connected_zero` | **the headline. Red. Loudest thing on screen.** |

### The actionable list (the point of the whole screen)

`connected_zero` is not a metric. It is a **to-do list of humans standing alone in your room.**

The panel renders each one with:
- name, role, minutes in room
- **their best available match, by name**
- the reason, in plain words ("both want a technical co-founder")

```json
{
  "panel": "go_talk_to_these_people",
  "rows": [
    {
      "attendee_id": "andre",
      "name": "Andre Willis",
      "role": "Engineer",
      "minutes_in_room": 52,
      "connections": 0,
      "suggested_intro": { "person_id": "nikki", "name": "Nikki Cho",
                           "reason": "both want a technical co-founder" }
    }
  ]
}
```

A dashboard that reports `24` is trivia. A dashboard that reports the 24, their matches, and the reason is an instrument.

### The messaging diagnostic, deliberately buried

Collapsed by default, behind a click, labeled *"open only when connections look low."*

**The placement is the privacy posture.** The surveillance-adjacent number is one you must deliberately go and get, never one that watches you ambiently. When opened, the first thing rendered is the guarantee: no content is stored in a queryable form, the analytics role has no read access to message bodies, and the stats table has no column that could hold them.

Contents (all contentless, per the telemetry spec):
- avg messages on threads that produced a connection (healthy: 3 to 6, short burst then quiet)
- avg messages on threads that produced nothing (the hiding signature)
- threads landed / threads that went nowhere / median minutes to quiet

### The honest instruction, printed on the screen

> Glance every twenty minutes. Read the red number. Open the list, walk over to two or three people, introduce them to their match. Then put the phone down and read the room with your eyes, which is a better instrument than any dashboard.

A live dashboard is seductive. If the operator is watching a screen at their own event, they are not reading the room. Design so that a **glance is sufficient**: large figures, one alarm state, no charts requiring interpretation. If it takes more than five seconds to read, it is too complicated for a live room.

---

## 2. Post-room report

The report is **not a snapshot.** It is a document that keeps writing itself, and it gets more honest as time passes.

### Two halves, visibly different

**"What happened", tagged `Settled`.** Activity on the night. Final, with one exception below.

**"What it became", tagged `Still moving`.** Warmth over time. The real verdict, and openly incomplete.

### The one number that is not settled on the night

The **considered ratio keeps climbing for about a week**, because the recap is still doing its work. People add their whys the next morning. A connection with no context on the night may acquire one on day two.

**Do not report the considered ratio on the night. It undersells the room.** Show it with a delta ("74%, up from 68% on the night") so the movement is legible.

---

## 3. The warmth timeline (the core component)

This is the part that must be built as a **data component, not a layout.**

### What it is NOT

Not a row of checkpoint boxes (day 7 / day 21 / day 60) with "pending" placeholders. That shape is a pilot artifact: it hard-codes, in advance, which moments matter, and it leaves empty boxes waiting to be filled. A product does not do that.

### What it IS

A **continuous series**, one point per day, plotting all connections by warmth state:

```
in_rhythm  (green)   the line you actually read
cooling    (amber)
been_a_while (grey)
```

Rendered as a stacked area with the `in_rhythm` line drawn bold on top.

**The chart plots only what exists.** If today is day 12, the series has 13 points and the line stops at day 12. Everything to the right is an **open horizon**: a soft band labeled *"not yet known."* No boxes. No milestones. No implied deadline.

### Range selector

`14d / 30d / 90d / All`. This is how the operator assesses whatever window currently matters, rather than the product deciding for them. Axis labels are generated from the selected range; no milestone is hard-coded anywhere in the component.

### The series

Derived from the locked warmth formula. Never re-derive it here.

```
warmth = max(0, round(base * exp(-0.01 * days_since_last_touch)))
```

State thresholds map to the locked enum: `in_rhythm`, `cooling`, `been_a_while`.

```json
// the only thing the component consumes
{
  "total": 412,
  "days_elapsed": 12,
  "series": [
    { "day": 0,  "in_rhythm": 412, "cooling": 0,  "been_a_while": 0 },
    { "day": 1,  "in_rhythm": 401, "cooling": 9,  "been_a_while": 2 },
    { "day": 12, "in_rhythm": 347, "cooling": 43, "been_a_while": 22 }
  ]
}
```

Wiring this to production data changes **only the array**, never the component. That is the test for app-readiness.

### Readout

Reflects the **latest real point**, never a checkpoint:

> `347` in rhythm, 84% of 412 · `43` cooling · `22` been a while · `day 12`, latest reading

Tomorrow this simply becomes day 13. Nothing gets ticked off.

### Copy

- Header: "Of 412 connections, how many are still alive?"
- Note: "Nobody knows on the night, including the attendees. So we do not ask them to predict it. The line below keeps drawing itself, and you read it whenever the shape changes."
- Status pill: **"Updating daily."** Not "final verdict at day 60."

---

## 4. Why those N struck out (the post-mortem panel)

On the live dashboard, `connected_zero` is a to-do list. In the report it becomes a **diagnosis of room composition**, and this is the panel that makes the next event better.

Break the zero-connection cohort down by cause:

| Cause | What it tells you |
| --- | --- |
| Never built a card | onboarding friction, or they never got past the door |
| Arrived in the last hour | room timing, late-arrival handling |
| No chip overlap with the room | **composition failure.** The room was wrong for them. |
| Had matches, never acted | the nudge failed, or they were too shy. UX problem. |
| Left within 20 minutes | something drove them out fast |

Five causes, five different fixes. **An exit survey structurally cannot produce this table, because these people did not fill out the survey.**

---

## 5. What the data cannot tell you

Print this on the report. It keeps the operator honest.

> Those 24 people are rows here, not stories. Behavior shows the *what*, never the *why*. Call three of them and three who connected well. Fifteen minutes each. That layer cannot be automated.

Instrumentation has real blind spots. The person who felt unwelcome and left early is indistinguishable from a low-engagement row. They are the person you most need to hear from, and they were never going to fill out a survey either.

---

## 6. Distribution

| Destination | Contents |
| --- | --- |
| **Partner** | the report, with the promise: *"here is what the room produced, and we will tell you in three weeks whether it lasted."* No other platform can make that second promise. |
| **Airtable** (ops layer, already in stack) | the numbers, one-way, so the team can sort and filter without an engineer |
| **Internal** | the six scheduled calls (§5) |

---

## 7. Design system

- **Typeface:** Public Sans only. Weights 300 to 900. Headings at 800/900 with tightened tracking; micro-labels at 600, uppercase, letter-spaced.
- **Numerals:** `font-variant-numeric: tabular-nums` on every figure that sits in a column, so values align without a monospace face.
- **Color:** locked SODA tokens. Green is confirm and in-rhythm. Amber is cooling. Purple is the "still moving" tag. Red is reserved for `connected_zero`, and is the only alarm state on either screen.
- No skeuomorphism on these surfaces. They are dense data views, not the one focused card. Flat for the many.

---

## 8. Acceptance criteria

1. The live dashboard renders five glance figures and no more.
2. `connected_zero` is the only red element on the live screen and is accompanied by the named list with suggested intros.
3. The messaging diagnostic is collapsed by default and states the privacy guarantee before showing any figure.
4. No reporting query touches the `messages` table. Verified by test.
5. The warmth timeline consumes a `series` array and contains **zero hard-coded day milestones**. Changing `days_elapsed` alone extends the line correctly.
6. Everything past `days_elapsed` renders as an unlabeled horizon band, never as placeholder checkpoint boxes.
7. The range selector regenerates axis labels from the selected window.
8. The considered ratio displays a delta against its night-of value.
9. The report renders correctly at day 1, day 12, and day 200 with no layout change.
10. Public Sans is the only typeface loaded on both surfaces.

---

## 9. The through-line

Every other event platform asks attendees to **predict** value at the moment of peak exhaustion, then reports the answers as if they were findings.

SODA **measures** it, with time as the judge, and shows the operator a line that is honest about where knowledge ends.
