# Admin Panel UI Kit — the back office

A self-contained recreation of the **host's back office** — where an event is built before and closed after. Open `index.html`.

The **lifecycle control** sits top-right (Draft → Live → Closed). Flip it with the seam control at the bottom of each view: *Go live* activates the QR and unlocks the acts; *Close event* finalizes the record and sends the recap. Identity is open in draft, locked in live, final in closed.

## Panels (left nav)
- **Event & identity** — name, host name (required), date, optional logo (falls back to host name in type), acts enabled.
- **Check-in QR** — the per-event QR generator: edit host name + entry code, see the live join link and a scannable preview, then **Open display page**, **Print**, download **PNG**, or **Copy link**.
- **Check-in** — manual sign-in for a guest who needs help.
- **Chip moderation** — approve / reject write-in chips (with the caught-up empty state).
- **Matches** — every match, mutual flags, top connector.
- **Export** — pull attendees / connections / surveys (Futureland owns its data).

## The QR display page (`qr-display.html`)
A standalone, **per-event** scan-to-join page meant to be shown on a screen at the door or printed for the table. It reads the event details from URL params (`?host=…&event=…&code=…&url=…`), so "Open display page" from the QR panel generates that event's own page. It shows the host wordmark, the event, a large scannable QR (dark-on-white card), the "scan to join the room" instruction, and the manual-entry code. A **Print** button gives a clean white sheet (the dark chrome drops away via `@media print`).

> The QR is generated client-side with the `qrcode` library loaded from cdnjs (with `crossorigin`). The encoded link is `https://soda.live/e/{host-slug}-{code}` — swap for the real check-in URL in production.

## Lifecycle states
The seam at the foot of every view owns the event lifecycle, and the header pills mirror it:
- **Draft** (amber) → *Go live* activates the QR and unlocks the acts.
- **Live** (green) → *End or cancel…* opens a confirmation dialog with two distinct paths:
  - **End the night** (graceful) — pushes the final survey, sends recaps, room goes read-only → **Closed**.
  - **Cancel the event** (destructive, two-step *"Cancel for real?"* confirm) — attendees notified, no recap, night not counted → **Cancelled** (red).
- **Closed** / **Cancelled** are terminal records; both offer *Reopen as draft*.

## Files
- `index.html` — desktop shell + router (also a Starting Point).
- `mobile.html` — phone-framed version: compact header, scrollable tab strip, stacked panels (also a Starting Point).
- `qr-display.html` — the standalone per-event scan-to-join / print page.
- `admin.jsx` — shared primitives + seed data + the lifecycle system (`PhasePills`, `LifecycleSeam`, the end/cancel dialog).
- `panels.jsx` — the back-office panels (incl. `QRPanel`).

Mirrors `/components` tokens; standalone so it renders without the bundle.
