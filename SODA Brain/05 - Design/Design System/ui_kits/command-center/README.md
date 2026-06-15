# Command Center UI Kit — the live cockpit

A self-contained recreation of the **host's live cockpit** — the one screen a host drives the whole night from. Open `index.html`.

Always on, across every view: the **Live Stat Bar** (scanned in / responses / pairs / nudges / surveys), the **Activity Feed**, a **Connection** badge, and the **Live** lifecycle state.

## Views (left nav)
- **Room** — the host's live grid of everyone present.
- **The Drop** — set a prompt, *Fire the Drop*, watch the timer, response count, and answers land; *Reveal names*.
- **The Chance** — *Spin the room* into pairs, re-spin.
- **The Nudge** — the private match queue; *Send* delivers one nudge to one recipient (purple).
- **Survey** — live response monitor with ratings.
- **Intelligence** — top offers (green) vs top needs (purple) bars, and the room-reads summary.

## Structure
- `index.html` — cockpit shell + stat bar + nav + activity feed + router (also a Starting Point).
- `cc.jsx` — shared cockpit primitives (stat bar, feed, badges, panel, buttons) + seed data.
- `views.jsx` — the six act/monitor views.

Mirrors `/components` tokens; kept standalone so it renders without the bundle.
