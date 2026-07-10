# SODA Key Card — Concept

**Date logged:** July 10, 2026 (from Brent, mid design-lab session; no prior design existed —
first design lives in Lab 05 at `/design/keycard` on the `neumorphism-exploration` branch).
Companion to SODA-Card-Design-Ideas.md (June 23).

## The idea, in Brent's framing

People can scan a QR and it populates a vCard of their information. Cards can expand to carry:
name, email, phone number, business, website, business phone (optional), social media. So a
person has the card for the room — and then this KEY CARD, which once given to someone, opens
up their expanded profile.

## The model

Two layers, one object:

- **The room card** (June 23 system): who you are TONIGHT. Event-scoped. Front = identity +
  signature; back = offers/needs. Open to everyone in the room.
- **The key card**: who you are BEYOND the room. The full contact profile. **Given, not
  found** — it opens only when the owner deliberately hands it over, one person at a time.
  The name says it: a key that unlocks the expanded profile.

## The vCard QR (the magic that needs no app)

The key card's QR encodes a real vCard (the standard contact format). Any phone camera scan
offers "add to contacts" directly — no app install, no server call, the contact data rides
inside the QR itself. Verified working in Lab 05: the QR is generated live from the fields and
saves to a real phone's contacts.

**Privacy note for the real build:** a raw vCard QR is un-revocable once photographed — whoever
captures it has the data. Two modes to decide between (or offer both):

1. **Raw vCard QR** — works offline, instant, feels like magic; treat showing it like handing
   a physical card (full-screen deliberate moment).
2. **Link QR** — encodes a gated URL instead; opening it requires/creates the connection, is
   revocable, and can update after the fact. Slower (needs network) but consent-true.

The in-app "give" path (unlocking your key card for a specific connection) should ride the
same consent rails as stewarded connections either way.

## Fields (v1)

Name · email · phone · business · website · business phone (optional) · social media.
New data beyond today's profile: website, socials, business phone (and phone/email become
shareable-by-choice rather than account-internal). This is a profile-schema addition and a
deliberate PII decision — the key card is the FIRST place SODA ever shows a guest's email or
phone to another guest, and only by explicit gift.

## What Lab 05 demonstrates

- The key card design: identity head, contact rows, frosted QR bar (the signature-bar glass
  language carried through), aura.
- Live vCard: edit the fields, the QR rebuilds, a real camera saves it.
- The give model: another person's key card renders SEALED (blurred, "given, not found" copy)
  until they hand it over — springy unseal reveal.

## The key code (added same day, from Brent's follow-up)

Every key card also carries a short typeable **key code** (same unambiguous alphabet as event
codes, shown `XXX-XXX`). Two jobs:

1. **Camera-down fallback** — read it out; the other person types it at grabsoda.app and
   receives the key card. No scan needed.
2. **Verification** — the code resolves THROUGH SODA to the verified account, so what you
   receive is provably that person, not a hand-crafted vCard claiming to be them. The vCard
   itself embeds the verify link (grabsoda.app/k/CODE) in its NOTE field, so even a scanned
   contact can be checked later.

**Rotation = revocation:** generating a new key code takes back anything shared before —
extra protection on demand. (This also softens the raw-vCard permanence problem: the contact
details in an old photo remain, but the VERIFIED status dies with the old code.)

## Open questions

1. Raw vCard vs gated link QR (or both: in-person scan = raw; in-app give = gated)?
2. Where does the key card live in the UI — behind your own card's flip? A third face? An
   action on the person card after connecting?
3. Does giving the key card REQUIRE an existing connection, or is it itself a connection
   gesture (giving it implies "connect")?
4. Do key-card fields live on the profile (one per person) or can there be variants (work
   card vs personal card) — ties to the June 23 "shape and style variants (later)".
