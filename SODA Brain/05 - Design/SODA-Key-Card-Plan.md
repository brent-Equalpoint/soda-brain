# SODA Key Card - Build Plan

**Status:** Proposed (awaiting Brent's go + the 5 decisions at the bottom)
**Date:** 2026-07-13
**Design source:** Lab 05, `/design/keycard` on the `neumorphism-exploration` branch (built from Brent's key-card session). The lab is the visual and behavioral spec; this plan is how it becomes real product.

---

## 1. What it is, in plain English

SODA becomes a two-card system, with two different trust levels:

| | The Room Card (shipped) | The Key Card (this plan) |
|---|---|---|
| **What it says** | Who you are tonight: role, offers, needs | Who you are beyond the room: full contact profile |
| **Who sees it** | Everyone in the room can flip it | Nobody, until you hand it to someone |
| **How it moves** | Found (it's on the room wall) | **Given** (a deliberate act, one person at a time) |

The key card carries: **name, business, email, mobile phone, business phone, website, and socials** (Instagram, LinkedIn, X, TikTok, YouTube, Facebook, Threads). Every field except name is optional, and empty fields simply don't appear on the card.

Two special powers ride on it:

1. **A live QR that saves straight to contacts.** The QR does not link to a webpage. It carries the contact data itself (a "vCard", the universal contact-file format phones have understood for decades). Any phone camera scans it and offers "Add to Contacts" on the spot. No app, no account, no internet needed.
2. **A key code** (like `G3F-MSJ`). A short, typeable code with two jobs: the camera-down fallback (you read it out, they type it at grabsoda.app), and verification (the code resolves through SODA to your real, verified account, so a received card is provably yours, not a hand-crafted fake). Rotating your code takes back everything shared before.

---

## 2. How it lands in your phone's contacts

This is the part Brent asked about directly, so here is the full picture of every path from a key card into a phone's address book.

### Path A - the in-person scan (fastest, works today in the lab)

1. You open your key card on your phone and turn the screen to them.
2. They point their **native camera app** at your QR. No SODA app, no browser.
3. Their phone recognizes the vCard inside the QR and offers **"Add to Contacts"** (iPhone shows a contact preview card; Android offers to open it in Contacts).
4. One tap, and you are in their phone.

Showing them your screen IS the consent. Nothing touches SODA's servers; the data rides inside the QR itself. This works in airplane mode.

### Path B - saved from inside SODA (after a key card is given)

1. Someone hands you their key card in the app (see the Give flow, section 5).
2. On their card you tap **"Save to contacts."**
3. SODA downloads a real `.vcf` contact file built from their key card.
   - **iPhone:** Safari opens the file as a contact preview; tap "Create New Contact" (or "Add to Existing").
   - **Android:** the file downloads and opens with the Contacts app, prefilled.
   - **Desktop:** the file saves; opening it imports into Contacts/Outlook/etc.

Note: SODA already has a "Save contact" button on connections today, but it saves only a name and a note, because SODA deliberately shares no email or phone without consent. The key card is exactly that consent, so once one is given, the same button saves the real thing.

### Path C - the typed key code (camera down)

1. You read your code out: "G3F dash MSJ."
2. They type it at **grabsoda.app/k/G3F-MSJ** (or in a "Have a key code?" box on the home page).
3. The page shows your verified key card with the same **"Save to contacts"** button as Path B.

### What the saved contact actually contains

The vCard is built to the standard (vCard 3.0, the most widely supported version), so every field lands in the right slot of the phone's contact form:

| Contact field | Source |
|---|---|
| Name (first/last split correctly) | Key card name |
| Company | Business |
| Mobile phone | Phone |
| Work phone | Business phone |
| Email | Email |
| Website | Website |
| Social profiles | Each social, as both an `X-SOCIALPROFILE` entry (Apple's convention, shows as a proper social row on iPhone) AND a plain URL line (so readers that ignore the Apple convention still keep the link) |
| Note | "Verified SODA key card · grabsoda.app/k/CODE" - so even months later, the saved contact carries the link that proves it against the live SODA account |

---

## 3. The rules the build must honor (carried from the lab + our ADRs)

1. **Given, not found.** Nobody can browse, search, or stumble into a key card. It is only ever seen by someone it was explicitly handed to (or someone holding the typed code, which only exists off-screen if you read it to them).
2. **Sealed by default.** In the app, another person's key card shows as sealed (blurred, locked) until they hand it over. The seal is enforced in the database, not just blurred in the UI.
3. **Rotation revokes.** Regenerating your key code takes back everything: the old code stops resolving, and (decision 2 below) in-app grants can be swept too.
4. **Consent rails** (ADR-008): giving rides the same request/accept machinery as connections. No one can take.
5. **Enumeration-safe** (ADR-011): the public code door never reveals whether a code "almost" exists; wrong codes get one uniform answer, rate-limited.
6. **The scanner boundary holds** (ADR-012): SODA's own QR scanner only ever opens safe internal pages. A key-card QR contains contact DATA, not a link, so if SODA's scanner ever sees one it must ignore it gracefully rather than "open" it.
7. **Guarded writes** (ADR-002): every give, revoke, and rotation goes through a security-definer function, never a direct table write.
8. **Never required.** The key card is a power tool, not a gate. Onboarding never asks for it; an empty key card simply means the give button doesn't appear yet.

---

## 4. Data model (the migration, sketched)

### New columns on `profiles` (own-row only; RLS already keeps other people's profiles unreadable)

```sql
alter table public.profiles
  add column if not exists kc_phone      text not null default '',  -- CIPHERTEXT (see 8a)
  add column if not exists kc_biz_phone  text not null default '',  -- CIPHERTEXT
  add column if not exists kc_website    text not null default '',  -- CIPHERTEXT
  add column if not exists kc_email      text not null default '',  -- CIPHERTEXT; defaults from account email on first save
  add column if not exists kc_socials    text not null default '',  -- CIPHERTEXT of the [{platform, handle}] JSON
  add column if not exists key_code_hmac text unique,               -- keyed fingerprint, for /k/CODE lookups
  add column if not exists key_code_enc  text not null default '',  -- encrypted copy, to display the owner's own code
  add column if not exists key_code_rotated_at timestamptz;
```

- **Every contact value is stored encrypted** (application-level AES-256-GCM; the full design is in
  section 8a). The database, its backups, and the dashboard only ever hold ciphertext.
- `kc_` prefix keeps key-card PII visually distinct from room-card fields in every query that touches profiles.
- Key-code alphabet from the lab: `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (no 0/O/1/I/L). Six characters = ~887 million combinations, generated server-side. Stored only as the HMAC fingerprint + an encrypted copy, never plain.
- Name and business reuse the existing `display_name` / `business` columns (one source of truth; the key card shows the same identity as the room card - these two stay plain because they are already public room-card content).

### New table `key_card_grants`

```sql
create table public.key_card_grants (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles(id),
  recipient_id uuid not null references public.profiles(id),
  granted_at   timestamptz not null default now(),
  revoked_at   timestamptz,
  unique (owner_id, recipient_id)
);
-- RLS: owner sees own grants (to manage them); recipient sees grants naming them (to know they hold a card).
-- All writes via security-definer functions only.
```

### Security-definer functions (the only write/cross-read paths)

| Function | What it does |
|---|---|
| `upsert_my_key_card(...)` | Saves the caller's own key-card fields; mints `key_code` on first save |
| `rotate_my_key_code()` | New code; old one dead instantly; optionally sweeps grants (decision 2) |
| `give_key_card(p_connection_id)` | Verifies the caller and the recipient share an **accepted** connection, then inserts/reactivates the grant |
| `revoke_key_card(p_connection_id)` | Sets `revoked_at` on that one grant |
| `get_key_card(p_profile_id)` | Returns the full key card **only if** an unrevoked grant exists from that owner to the caller; otherwise returns nothing (the seal) |
| `resolve_key_code(p_code)` | The public door: exact-match lookup, returns the card or a uniform "no" - rate-limited at the API layer (fail-open per ADR-018) |

---

## 5. The product surfaces

### 5a. Your key card (edit + show) - lives on the `/card` screen

The `/card` screen becomes the home of both cards:

- **Top: the room card** (exactly as shipped - flip, style, edit).
- **Below: "Your key card."** First visit shows a quiet build prompt ("Your key card is who you are beyond the room. Build it once, hand it to the people who matter."). Once built, it renders the lab's key card: name/business header, the contact rows (only filled ones), and the QR bar with the live vCard QR + key code + "the camera-down line."
- **Edit** opens the lab's editor: the field grid + the socials composer (platform dropdown + handle + add/remove chips).
- **Rotate** sits under the card with the lab's caption: "Rotating the code takes back anything shared before."

The lab's `keycard.css` (kc-card, kc-rows, kc-qrbar, kc-sealed, kc-blur, kc-lock, kc-given) ports over the same way profile-card.css did: same classes, retargeted to the app tokens.

### 5b. Giving it - from the person actions sheet

We just rebuilt the People sheet to lead with a connection's full room card. The key card slots directly beneath the actions:

- If you have NOT given them yours: a **"Hand them your key card"** button (with a one-line explainer: "They'll be able to save your contact info to their phone").
- If you HAVE: a quiet "They hold your key card · Take it back" row.
- Giving fires `give_key_card`, and the recipient gets a notification ("Brent handed you their key card").

Give requires an accepted connection (decision 5 confirms or loosens this). In-room, the same button can appear on the person sheet AFTER a connection is accepted, so a great conversation can end with the handover on the spot.

### 5c. Receiving one - sealed until given

In that same person sheet, THEIR key card section:

- **Sealed state:** the lab's blurred card with the lock line ("Maya hasn't handed you her key card yet").
- **Given state:** the full key card + **"Save to contacts"** (the real .vcf, Path B above) + their QR if you want to re-share in person.

### 5d. The public code door - `/k/[CODE]` page + a "Have a key code?" box

- `grabsoda.app/k/G3F-MSJ` resolves the code and shows the key card + Save to contacts.
- Wrong/rotated codes all get the same calm "That code doesn't open anything" page (no "did you mean", no existence hints).
- Rate-limited per IP and per code-prefix; limits fail open per ADR-018 so a hiccup never bricks the door mid-event.

---

## 6. Contracts (the shared shapes)

```ts
// packages/contracts/src/key-card.ts
export const SOCIAL_PLATFORMS = ['Instagram','LinkedIn','X','TikTok','YouTube','Facebook','Threads'] as const;
export const SocialSchema = z.object({ platform: z.enum(SOCIAL_PLATFORMS), handle: z.string().trim().min(1).max(60) });
export const KeyCardSchema = z.object({
  name: z.string(), business: z.string().default(''),
  email: z.string().default(''), phone: z.string().default(''), bizPhone: z.string().default(''),
  website: z.string().default(''), socials: z.array(SocialSchema).max(7).default([]),
  keyCode: z.string().default(''),          // only present on YOUR OWN card + given/resolved cards
});
// MyKeyCardResponse { card: KeyCardSchema.nullable() }
// GiveKeyCardRequest { connectionId } / RevokeKeyCardRequest { connectionId }
// ResolveKeyCodeResponse { card: KeyCardSchema.nullable() }   // uniform null on any miss
```

### Endpoints

| Route | Job |
|---|---|
| `GET/POST /api/me/key-card` | Read/save your own |
| `POST /api/me/key-card/rotate` | Rotate the code |
| `POST /api/key-card/give` · `/revoke` | The handover, on consent rails |
| `GET /api/key-card/[connectionId]` | Their card, seal enforced by `get_key_card` |
| `GET /api/k/[code]` + page `/k/[code]` | The public door, rate-limited |

### The vCard builder - one shared module

`lib/vcard.ts` grows from today's name-only stub into the full builder (ported from the lab's `buildVcard`, kept to the RFC: CRLF line endings, proper escaping, N field split from the display name):

```
BEGIN:VCARD / VERSION:3.0
N + FN (name, split)          ORG (business)
TEL;TYPE=CELL / TEL;TYPE=WORK EMAIL / URL (website)
X-SOCIALPROFILE;TYPE=x + URL per social
NOTE: Verified SODA key card · grabsoda.app/k/CODE
END:VCARD
```

Same builder feeds all three paths: the QR contents (Path A), the .vcf download (Path B), and the /k page's save button (Path C). One rule, one place.

---

## 7. Build phases (each independently shippable)

### Phase 1 - "My key card exists" (the core value, no sharing system yet)
- Migration: profile columns + key code mint on first save.
- The crypto module (`lib/key-card-crypto.ts`, AES-256-GCM + the code HMAC) and the two keys in the
  Vercel environment (`KEY_CARD_ENC_KEY`, `KEY_CODE_HMAC_KEY`), with copies in Brent's password
  manager. Encryption ships in Phase 1 so no plaintext contact value ever touches the database, even
  during the first rollout.
- Contracts + `/api/me/key-card` (+ rotate).
- The `/card` screen section: build prompt, editor, rendered card with live QR + code.
- Full vCard builder in `lib/vcard.ts`.
- **Ships alone because Path A needs nothing else:** your QR on your screen already saves you into anyone's phone. This is the demo-magic moment and it works day one.
- Size: comparable to the card-personalization piece. Roughly a session.

### Phase 2 - "Given, not found" (the seal + the handover)
- `key_card_grants` + give/revoke/get functions.
- Person-sheet integration: hand over, take back, sealed/given states, real Save-to-contacts on given cards.
- Notification on receive.
- Size: a bit larger than Phase 1 (consent rails + RLS testing). A solid session.

### Phase 3 - "The typed code" (the public door)
- `resolve_key_code` + `/api/k/[code]` + the `/k/[code]` page + a "Have a key code?" entry on the home page.
- Rate limiting per ADR-018 posture.
- Size: small-medium. Half a session, most of it in the enumeration-safety testing.

Nothing in Phases 1-3 touches the room, the Drop/Chance/Nudge, or the shipped card system. All migrations are additive.

---

## 8. Privacy posture (the part to get exactly right)

The key card is the most personal data SODA will hold (a real phone number). The stance:

- **Own-row writes only**, via guarded functions (ADR-002).
- **No read path exists** to another person's key-card fields except `get_key_card` (grant-checked, ADR-007's recipient-only precedent) and `resolve_key_code` (capability-checked: holding the code IS the permission, because the code only leaves your card by you showing or reading it).
- **The QR never touches the server.** Path A is peer-to-peer by construction.
- **Blocks win.** A block between two people revokes any grant both directions (fold into the existing block function).
- **Exports never include key-card fields.** Host CSV exports and recaps stay room-card only.
- **The seal is database-enforced.** The blurred UI is theater; the RLS/function layer is the wall.
- **Key-card fields never reach logs or Sentry.** The `kc_` fields are added to the scrub list; error reports and the syslog carry ids, never contact values.

### 8a. Encryption (required posture, per Brent 2026-07-13)

Two layers exist for free: HTTPS in transit, and Supabase's disk-level encryption at rest. Those do
not protect against the database itself leaking (a stolen backup, a compromised service key, a SQL
bug that dumps a table, or a raw look at the table in the dashboard). So the key card adds a third
layer: **application-level encryption**. The database only ever stores ciphertext.

**The design:**

- **What gets encrypted:** all `kc_` contact fields (phone, business phone, email, website, socials),
  uniformly. Uniform is simpler than picking "sensitive enough" per field, and none of these are ever
  queried or indexed by value, so nothing is lost.
- **How:** AES-256-GCM, one random nonce per value, ciphertext stored as `v1.<nonce>.<ciphertext>`
  (the `v1` prefix makes future key rotation a clean migration). A small shared module
  (`lib/key-card-crypto.ts`) owns encrypt/decrypt; the API routes call it just before write and just
  after a grant-checked read. One rule, one place.
- **Where the key lives:** a 32-byte key in the Vercel environment (`KEY_CARD_ENC_KEY`), never in the
  repo, never in the database. Stealing the whole database yields gibberish without a second,
  separate breach of the key store. A copy of the key goes in Brent's password manager (if the key is
  lost, stored cards are unrecoverable; people would simply re-enter, an annoyance not a disaster).
- **Key codes get stronger treatment** (they are the door key, and 6-character codes are short enough
  to brute-force if hashed naively): stored as BOTH `key_code_hmac` (HMAC-SHA256 under a separate
  secret, unique-indexed, used for `/k/CODE` lookups — useless to an attacker without the HMAC key)
  AND `key_code_enc` (encrypted copy, so the owner's card can keep displaying their own code). A
  leaked database can neither read nor crack anyone's code.
- **Decryption is server-side only, after authorization.** The security-definer functions return
  ciphertext; the API route decrypts only once the grant/capability check has already passed.
  Authorization stays the database's job; encryption protects the storage. Independent layers.
- **Deliberately NOT end-to-end encrypted.** True E2EE (SODA's servers unable to read cards) would
  break Path C (the server must render a card for an anonymous visitor who typed a code) and drags in
  per-device key management. The card's purpose is being handed out; the two-breach design above
  covers the realistic threats. Revisit only if SODA ever holds genuinely secret content.
- **Out of scope by design:** the QR contents and the saved `.vcf` are plaintext on purpose — Path A
  IS handing your data to someone's camera. Encryption protects SODA's stored copy, not the copies a
  person deliberately gives away.

---

## 9. The five decisions that are Brent's

1. **The public code door: open or signed-in?** Recommendation: **open** (no sign-in to type a code). The code is a capability you only get in person, the space is ~887M with rate limits, and demanding sign-in kills the camera-down moment with a stranger. The trade: anyone who ever obtains a code (overheard, photographed) can view that card until rotation. Rotation is the remedy.
2. **What does rotating revoke?** The lab says rotation takes back "anything shared before." Recommendation: rotation kills the old CODE only, and in-app grants are revoked per person (you gave Maya your card deliberately; changing your code shouldn't silently unfriend your whole list). Alternative: a "rotate + revoke all" nuclear option in account settings.
3. **Where does the editor live?** Recommendation: the `/card` screen hosts both cards (one identity home). Alternative: its own `/keycard` screen if `/card` gets crowded.
4. **Email: account email or freely editable?** Recommendation: prefilled from the account email, freely editable (people often share a public-facing address, not their login).
5. **Who can be given a card?** Recommendation: accepted connections only (pure ADR-008 rails). Alternative: also allow in-room pre-connection handover; Path A (the QR scan) already covers the "we just met, take my card" moment without loosening the rails, which is why the recommendation stays strict.

---

## 10. What this replaces/upgrades

- The People sheet's "Save contact" today saves name + note only. After Phase 2 it saves the real card when one was given (and keeps the polite stub when not).
- The `/k/` namespace is new and collision-free (checked: no existing route).
- `qrcode.react` is already a production dependency (the lab uses it inside apps/web), so the QR costs nothing new.

*Design reference: `/design/keycard` (Lab 05). The GIVE model demo (sealed → handed → save) is fully interactive there today.*
