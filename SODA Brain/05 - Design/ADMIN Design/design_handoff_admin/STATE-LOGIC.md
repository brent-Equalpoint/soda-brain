# SODA Admin Prototype — Complete State Logic

Contract-level documentation of every piece of state in `SODA Admin.dc.html`, written so a
front-end pass can re-house it mechanically. Each cluster is tagged with its **door** per the
migration brief: **[ADMIN]** = event back-office (`/admin`), **[HOST]** = live cockpit (`/host`),
**[SHELL]** = shared chrome. No backend contracts here; everything below is UI state that today
runs on mock data and maps onto the existing frozen `/api/host/*` endpoints.

House note: copy in the running prototype avoids urgency language; states are calm by design.

---

## 1. Shell & navigation [SHELL]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `view` | string | `'room'` | Active screen. One of `room, funnel, supply, queue, matches, moments, messages, activity, safety, checkin, recap, events, export`. |
| `doorMode` | bool | `false` | Door-staff role. When true, nav is filtered to `['room','checkin']`, identity label flips Host → Door staff, and `view` is forced to `checkin` on enable / `room` on exit. |
| `vw` | number | `window.innerWidth` | Viewport width, updated on `resize`. Breakpoints: `<760` mobile (sidebar → top header + scrolling nav pills, phone rail hidden), `<1100` narrow (phone rail hidden), else 3-column grid. |

Derived: `navSource = doorMode ? nav.filter(checkin|room) : nav`. Badges on nav are live derived
counts: room total, chip-queue length (amber), matches count, open safety reports (red), message
thread count.

Transitions: `setView(id)`; `toggleDoorMode()`; resize listener added in `componentDidMount`,
removed on unmount.

---

## 2. Roster & presence [HOST]

Data: `people[24]`, each `{ id, name, initials, color, role, status, firstTimer, offers[], needs[], chips }`.
`extraPeople[]` holds manual walk-up check-ins appended at runtime.

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `q` | string | `''` | Roster search, matches name or role, case-insensitive. |
| `roomLayout` | `'grid'\|'list'` | `'grid'` | Room view mode. Grid = square static cards; list = rows. |

Status is three-valued: `Open to intros` (green), `Heads down` (amber), `Left quietly` (muted).
Presence rules:
- `total` = people + extraPeople (checked in tonight).
- `inRoomNow` = total − count(`Left quietly`). Shown as its own stat next to "Checked in".
- `Left quietly` people are excluded from call-out selection (tap → toast "X has left the room"),
  from Spotlight's random pool, and noted as excluded from Chance pairings.

---

## 3. Person card & direct messages [HOST]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `personModal` | id \| null | `null` | Which person's card modal is open. Card shows square avatar, role, status pill, first-timer tag, offer chips (green), need chips (amber), and the DM thread. |
| `dmDraft` | string | `''` | Composer text. Send disabled (muted style) until non-empty. |
| `dms` | `{ [personId]: [{text, time}] }` | `{}` | Per-person host→attendee thread. Append-only in the prototype. |

Send flow (`sendDm`): trim → guard empty → append `{text, time}` to `dms[personId]` → clear draft →
phone preview flips to `dm` mode quoting the text → activity log entry → toast. Enter key sends.
Closing the modal clears the draft but keeps the thread.

**Messages inbox** (`view: 'messages'`): pure derivation of `dms` — one row per thread with last
message preview, time, count. Row tap re-opens `personModal` for that person. Empty state links to
The Room. (If two-way threads land later: unread markers would hang off this same map.)

---

## 4. Multi-select & call-out [HOST]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `selectMode` | bool | `false` | "Call out" selection mode; toggling clears `selectedIds`. |
| `selectedIds` | id[] | `[]` | Selected people. In select mode, person tap toggles membership instead of opening the card. Selected cards get green border + check badge. |

Floating action bar renders when `selectedIds.length > 0`: stacked overlapping avatar tiles,
"n selected", Call out, Cancel.

**Block guard (integrity rule):** `blockedPairs = [[idA, idB], ...]`. Derived
`selBlockedPair` = first blocked pair fully contained in the selection. When present:
warning text "A and B can't be grouped — safety block" appears in the bar, the Call out button is
disabled (style + handler guard both).

`callOut()`: guard empty + blocked → build `names` + avatar list → phone preview `callout` mode
(stacked avatars; multi copy "You, A, B — the host wants you together" vs solo "All eyes on you")
→ exit select mode, clear selection → log + toast.

---

## 5. Live Moments [HOST]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `fired` | `{drop, chance, nudge}` | all `false` | One-shot acts; firing flips true and the card swaps its Fire button for a live status line. |
| `delivery` | `{ [act]: {sent, fail, total} }` | `{}` | Delivery visibility. On fire: `total = inRoomNow`, `fail` mocked per act (drop 7, chance 5, nudge 2), `sent = total − fail`. Card live label reads "Live · sent of total phones · fail unreachable". |
| `dropHidden` | number[] | `[]` | Indices of Drop-wall answers hidden by moderation. |
| `spotlightName` | string \| null | `null` | The Spotlight is re-firable (button label flips to "Pick again"). Pool = in-room people only. |

Chance card carries a static integrity note: blocked pairs + departed guests are excluded from
pairings. Firing any act logs to activity and toasts with delivery numbers.

---

## 6. Safety queue [HOST]

`reports[]`: `{ id, tag: 'Block'|'Report'|'Resolved'|'Removed', by, against, reason, time, open }`.

- `resolveReport(id)`: sets `open:false, tag:'Resolved'` → log → **undo toast** (restores prior
  reports snapshot).
- `removeFromRoom(id)`: gated by the **confirm modal** ("Remove X from the room?" / danger
  styling). On confirm: `open:false, tag:'Removed'` → log ("logged in Activity" is part of the
  confirm copy) → undo toast with snapshot restore.

---

## 7. Chip queue [ADMIN]

`queue[]`: `{ id, label, kind: 'Offer'|'Need'|'Shows up as', by, time }`.

- `approveChip(id)`: remove from queue → phone preview `chipLive` mode showing the chip → log →
  toast.
- `rejectChip(id)`: remove from queue → log → **undo toast** (restores queue snapshot).
- Empty state when the queue is clear.

---

## 8. Funnel analytics [ADMIN]

Data: `funnel[7]` step counts (Landed → In the room). Derived per step:

- `lost = prev − count`, `dropPct = round(lost / prev × 100)`.
- **State thresholds (founder-set):** `dropPct ≤ 14` → green `Holding`; `≥ 15` → amber
  `Worth a look`; `≥ 30` → red `Alert` + a calm alert strip at the top of the view ("N% dropped
  off at 'Step' — something is happening on that screen."). Step 1 is neutral white `Source`.
- Card shows the count in the state color; the small delta (`−12 · 6%`) is always **amber**.

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `funnelModal` | index \| null | `null` | Explainer modal per step: state pill, plain-language description of the step, % from previous step, % of everyone who landed, people dropped here. Scrim/× closes. |

---

## 9. Offers vs Needs (supply/demand) [ADMIN]

Stateless view over `supply[]` `{chip, offers, needs}`. Derived per row: bars normalized to the
max count; `gap = needs − offers`; pill = `Covered` (green, ≤0), `+n` (amber), `Short n` (red,
gap ≥ 4).

---

## 10. Manual check-in [ADMIN — door-mode surface]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `manual` | `{name, email, role, offers[], needs[]}` | empty | The walk-up form. `role` is single-select; offers/needs multi-select. Submit disabled until `name` is non-empty. |
| `customInput` | `'role'\|'offers'\|'needs'\|null` | `null` | Which chip row's "+ Custom" inline input is open (one at a time). |
| `customText` | string | `''` | The write-in text. Enter commits, Esc cancels. |
| `customAdded` | `{role[], offers[], needs[]}` | empty | Session-scoped custom chips; they join the base chip rows and persist for subsequent walk-ups. |
| `recentManual` | array | `[]` | Tonight's manual check-ins, newest first, shown under the form. |

`commitCustom()`: dedupe into `customAdded[field]`, auto-select in `manual` (role replaces, lists
append), close input. `addManual()`: derive initials, compose sub line, prepend to `recentManual`,
append to `extraPeople` (so totals/targeting include them), reset form, log + toast.

---

## 11. Recap push [ADMIN]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `recapPushed` | bool | `false` | One-way flag; gated by confirm modal ("You can't unsend it."). On confirm: phone preview → `recap` mode, log, toast; button swaps to "Pushed ✓". |

---

## 12. Events & creation [ADMIN]

`events[]`: `{ id, name, date, time, venue, place, capacity, status: 'Live'|'Upcoming'|'Past',
survey[], code, link, qr }`.

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `eventModal` | bool | `false` | Two-step creation modal. |
| `eventStep` | `'details'\|'survey'` | `'details'` | Step 1 = name/date/start/end/venue/city/state/capacity (native date + time widgets, state dropdown). Step 2 = survey builder. Next gated on name; Back preserves everything. |
| `newEvent` | object | empty | Form fields. Date formatted to "Thu Aug 6"; times to "7 PM – 10 PM" (or "From 7 PM"); city+state joined "Cleveland, OH". |
| `newSurvey` | question[] | `[]` | Seeded on first entry to step 2 with 3 defaults (Stars "How was the night?", Yes/No follow-up, Text "do differently"). Removable; additions appended. |
| `nsText`, `nsType` | string | `''`, `'Text'` | New-question composer. Types (the five from the live product): `Stars, Scale, Tags, Text, Yes / No`, each with a one-line description shown under the picker. |
| `eventCodes` | eventId \| null | `null` | Per-event join-kit modal. |

`createEvent()`: compose entry → `Object.assign(entry, evExtras(name))` → append as Upcoming →
reset modal state → log ("with N survey questions · codes generated") + toast.

`evExtras(name)` (deterministic, FNV-hash seeded): `code` = word initials + 4 digits
(e.g. `LNT-4827`); `link` = `/join?t=<32-hex-token>`; `qr` = generated join QR path. Existing
events get extras applied at construction.

`makeEventLive(id)`: confirm modal → target becomes Live, previous Live becomes Past → sidebar
"Tonight" pill follows the live event → log + toast.

Codes modal: tap-to-copy event code card, copy-link row (copies full `grabsoda.app` URL),
join QR, Download PNG. Sub-copy is status-aware (Live vs pre-live).

---

## 13. QR system [ADMIN]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `qrModal` | `'entry'\|'survey'\|null` | `null` | Check-in view's two door codes, expandable to a large modal with Download PNG. |

QR paths are deterministic fake patterns (finder squares + timing lines + hash-seeded modules) —
**prototype-only**; swap for real encodings of the join links in production.
`downloadQrPng(path, name)`: SVG → canvas 1024² → PNG blob download.
`copyText(text, label)`: `navigator.clipboard.writeText().catch(fallback)` with a
textarea/execCommand fallback, then toast.

---

## 14. Exports [ADMIN]

Stateless actions building real downloads from live state: `exportAttendees` (CSV: name, role,
status, offers, needs), `exportMatches` (CSV), `exportNight` (JSON: attendees, matches, chains,
activity log). Each logs + toasts. CSV cells are quote-escaped.

---

## 15. Activity log [SHELL]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `audit` | `[{time, text}]` | 2 seed rows | Prepend-only. Written by: act fires (with delivery), call-outs, spotlight picks, chip approve/reject, report resolve/remove, recap push, DMs, manual check-ins, event creation, make-live, QR downloads, exports. Time = real clock `h:mm AM/PM`. |

---

## 16. Feedback primitives [SHELL]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `toast` | string \| null | `null` | Bottom-center pill. Auto-dismiss 2.6s, or 5.2s when undoable. |
| `toastUndo` | fn \| null | `null` | Optional Undo callback rendered as a green Undo button; invoking it clears the toast and restores the pre-action snapshot. Used by: chip reject, report resolve, room removal, person removal. |
| `confirm` | `{title, body, cta, danger, onYes}` \| null | `null` | Generic confirm modal for loud/irreversible actions: remove-from-room (danger/red), recap push, make-event-live. Scrim/Cancel closes without action. |

---

## 17. Attendee phone preview [SHELL — right rail]

| State | Type | Initial | Meaning |
| --- | --- | --- | --- |
| `phone` | `{mode, ...payload}` | `{mode:'idle'}` | What the attendee sees right now. Modes and payloads: |

- `idle` — "You're in the room." (default; Reset preview button hidden)
- `drop` / `chance` / `nudge` — the act screens, color-coded per act
- `callout` — `{names[], people[]}` → stacked avatar tiles + group/solo copy
- `spotlight` — `{name, people[1]}` → single avatar + "X is in the spotlight."
- `dm` — `{text}` → "From the host" quoting the message
- `chipLive` — `{chip}` → approved write-in announcement with the chip pill
- `recap` — "Your night" summary

Any non-idle mode shows "Reset preview". The rail also carries four live tallies (checked in,
matches, chips pending, open safety items) derived from the same state.

---

## 18. Class-level constants (not state)

`people`, `funnel`, `supply`, `matches`, `chains`, `blockedPairs`, chip pools
(`MROLES/MOFFERS/MNEEDS`), `QTYPES` (survey types + colors + descriptions), `STATES` (US state
codes), `qrPath()/evExtras()` generators. In production these become API-backed; every derived
rule above stays identical.
