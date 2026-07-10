# SODA Onboarding Flow, Implementation Spec

*Scope: the onboarding journey only, from entering a room to earning a verified badge and connecting. Written for implementation.*

---

## 0. Scope

**In scope:** Door (room entry), Floor (name + contact), Room (visible participation and browsing), Verify (email or SMS code, earns the verified badge), and the connection gate.

**Out of scope:** building or editing a personal card. Card creation lives in a **separate card flow**. This spec references it only as a handoff (§9); do not implement card-building screens here.

---

## 1. Model and principles

**Visible first, grow at your pace.** A name and one valid way to reach you makes a person a real, visible participant. Everything after is optional and self-paced.

1. **The Floor is the only hard gate to enter.** After it, participation is never blocked.
2. **Verification gates exactly one action: connecting.** Entering, being visible, and reading anyone's card are all open while unverified. Adding a connection requires verification.
3. **The verified badge is both a trust signal and the key to connecting.** It never gates entry or browsing.

Architecture posture: **server decides, client renders.** Screen state and gates are resolved server-side; the client reflects them. The client is never the source of truth for whether someone is verified or may connect.

---

## 2. Screens and gates

### Door
- **Shows:** one room-code field (prefilled from the room link when possible) and a "scan a table QR" alternate.
- **Gate (hard, minimal):** room code non-empty and valid for an active event.
- **Rule:** one door for everyone regardless of partner. QR resolves to the same entry as the typed code. The typed code is the reliable fallback so a slow camera never stalls the line.

### Floor
- **Shows:** name field, an **Email / Text** channel toggle, and one contact field that adapts to the toggle.
- **Gate (hard, minimal, the real door):** name non-empty AND contact valid for the chosen channel.
  - email: contains `@` and passes standard email validation
  - phone: at least 10 digits after stripping non-digits; store E.164
- **On pass:** create the attendee as `you_state = starter`, mark them visible in the room, record `contact_method`. No verification here; entry is optimistic.

### Room (hub)
- **Shows:** the progress meter (Visible / Card / Badge), a single gentle nudge (see §5), and the room grid: the attendee's own tile first, then everyone else. Verified people show a check in the tile's top-right corner.
- **Gates:** none. Participation is never blocked here.
- **Interactions:**
  - Tap another person's tile → open their card sheet (read-only: name, role, verified pill if verified, match reason, offers, looking-for) with an **Add connection** button.
  - Tap own tile → hand off to the separate card flow (§9).
- **Add connection gate (the core rule):** on tap, check `you_state`.
  - `verified` → create the connection, button becomes "Connected," green success toast.
  - not verified → show the **purple gate toast** ("Verify your card to add connections") with a "Verify now" action routing to Verify. No connection is written.

### Verify
- **Shows:** a six-digit OTP input. Copy adapts to channel: "Verify your email" / "Verify your number," and "We sent a code by email/text to {value}."
- **Delivery:** the code is sent by the channel chosen on the Floor (`contact_method`).
- **Gate (earns the badge only):** correct OTP. On success, set `you_state = verified`, award the badge, and confirm with "Verified, you can add connections now."
- **Optional:** reachable but never forced. "Maybe later" returns to the room unchanged.

---

## 3. Logic states

### `contact_method` : `email | sms`
Chosen on the Floor. Drives (a) Floor validation and (b) the channel the OTP is delivered by. No second contact is collected.

### `you_state` : `starter | card | verified`
Monotonic; only moves forward.

| State | Reached by | Badge | Can connect? |
| --- | --- | --- | --- |
| `starter` | passing the Floor gate | none | no |
| `card` | completing the **separate card flow** (§9) | none | no |
| `verified` | completing OTP in Verify | earned | yes |

Note: reaching `card` is owned by the card flow, not this spec. Onboarding only reads the value.

### `connections` : `array of person ids`
Writable **only when `you_state = verified`**. Reading cards never requires it. An unverified attempt to write triggers the gate toast, not a write.

### `nudge_dismissed` : `boolean`
Whether the current gentle nudge was dismissed ("Later"). Resets to `false` when `you_state` advances so the next step surfaces once.

### Derived: progress meter
- **Visible** = entered (in the room)
- **Card** = `you_state ∈ {card, verified}`
- **Badge** = `you_state = verified`

---

## 4. Transitions

```
DOOR ─(code ok)─▶ FLOOR ─(name + valid contact)─▶ ROOM [you_state=starter, visible]

ROOM ─(tap person)─▶ card sheet ─(Close)─▶ ROOM
ROOM ─(tap own tile)─▶ [handoff to card flow]  ─(returns)─▶ ROOM [you_state may be card]

card sheet ─(Add connection, verified)────▶ connection written, "Connected"
card sheet ─(Add connection, NOT verified)─▶ gate toast ─(Verify now)─▶ VERIFY

ROOM ─(verify nudge / gate toast action)─▶ VERIFY
VERIFY ─(OTP ok)─▶ ROOM [you_state=verified, connecting unlocked]
VERIFY ─(Maybe later)─▶ ROOM [unchanged]
```

---

## 5. The gentle nudge (self-paced, dismissible)

At most one nudge in the room, chosen by `you_state`:

| `you_state` | Nudge intent | Primary action | "Later" |
| --- | --- | --- | --- |
| `starter` | invite to create a card | hand off to card flow (§9) | collapse to a quiet, always-available link |
| `card` | invite to verify | route to Verify | collapse to a quiet link |
| `verified` | none | n/a | n/a |

The nudge never blocks. Dismissing shrinks it to a quiet line; it does not remove the path. Surface a fresh nudge once per state.

---

## 6. Toasts (copy and color)

Two colors, two jobs. **Green = confirm** (something good happened). **Purple = needs attention** (a gentle block or nudge). Guide toasts sit on the top edge; success and gate toasts on the bottom.

- **Guide (top, coaching):** short lines that point to the next step (entry, visibility, verify).
- **Success (bottom, GREEN):** "You are in the room," "Verified, you can add connections now," "{name} added to your connections."
- **Gate (bottom, PURPLE, with action):** "Verify your card to add connections. It keeps who you meet real." + a purple "Verify now" button routing to Verify. This is the only non-green toast, on purpose, so a required step never reads as a confirmation.

---

## 7. Data shapes (contracts)

```json
// join, written when the Floor gate passes
{
  "event": "join",
  "room_code": "MOSA",
  "name": "Brent Montgomery",
  "contact": { "method": "email | sms", "value": "..." },
  "you_state": "starter"
}

// session resolve (server decides, client renders)
{
  "screen_state": "door | floor | room | verify",
  "you_state": "starter | card | verified",
  "contact_method": "email | sms",
  "can_connect": false
}

// verify (Clerk-backed), unlocks connecting
{ "request": { "channel": "email | sms", "to": "..." } }
{ "submit":  { "code": "402198" } }  ->  { "verified": true, "badge": "verified" }

// add connection, server-enforced gate
{ "request": { "to_person_id": "maya" } }
//   server checks you_state === "verified"
//   false -> { "gated": "verify_required" }   (client shows purple gate toast)
//   true  -> { "connected": true }
```

`can_connect` in session resolve must be computed server-side from `you_state`, never trusted from the client.

---

## 8. Clerk integration (auth, email + SMS)

Clerk is the auth engine behind the Floor and Verify screens.

- The Floor contact becomes a Clerk identifier: `emailAddress` or `phoneNumber`.
- Verify maps to Clerk prepare + attempt verification with strategy `email_code` or `phone_code`, matching `contact_method`.
- The **badge is app state**, set when Clerk verification succeeds. Clerk confirms identity; SODA awards the badge and flips `can_connect`.
- Enable "Phone number + SMS code" in the Clerk dashboard alongside email.

Decisions to confirm before building:
- **Phone as primary sign-in vs. second factor.** Primary is fewer steps for a live room; Clerk supports both.
- **SMS cost and volume.** Email is ~free; SMS is a few cents each and scales with headcount.
- **International and toll-fraud settings.** Clerk manages these; review before a large event.
- Verify current Clerk config and pricing in Clerk's own docs; the capability is stable, the specifics move.

---

## 9. Handoff to the card flow (out of scope here)

Building or editing the personal card is a **separate flow**. Onboarding touches it only at two seams:

1. The `starter` nudge and tapping one's own tile **hand off** to the card flow.
2. On return, onboarding reads `you_state = card` if a card was created.

Do not implement card-building UI, chip selection, or card editing in this spec. Treat the card flow as an external module that sets `you_state` to `card` and returns to the room.

---

## 10. Behavior rules (acceptance criteria)

Build to these; each is independently testable.

1. Passing the Floor with a valid name and email OR valid phone lands the attendee in the room as `starter`, visible to others, with no verification.
2. An unverified attendee can open any person's card and read it in full.
3. Tapping "Add connection" while unverified writes nothing and shows the purple gate toast with a working "Verify now" route.
4. Tapping "Add connection" while verified writes the connection and reflects a "Connected" state.
5. The verification code is delivered by the channel chosen on the Floor (email or SMS), and verifying sets `you_state = verified` and `can_connect = true`.
6. `can_connect` is enforced server-side; a forged client request to connect while unverified is rejected with `gated: "verify_required"`.
7. The gentle nudge is dismissible and never blocks participation; dismissing leaves a quiet, always-available path.
8. Success toasts render green; the connection gate toast renders purple.
9. Card creation is never handled here; the `starter` nudge and own-tile tap hand off to the separate card flow.

---

## 11. What is intentionally NOT gated

- Being visible in the room: **not gated** (name + contact only).
- Browsing and opening other people's cards: **not gated.**
- Adding a connection: **gated behind verification** (the one gated action).
- Earning the badge: **optional**, but it is the key that unlocks connecting.

The only hard requirement to enter is the Floor. The only thing verification gates is connecting.
