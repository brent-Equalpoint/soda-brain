# SODA Card System: Design Ideas and Plan

**Date logged:** June 23, 2026

*A working plan for the next iteration of the SODA card, the room views, and the in-room focus flow. Captured from a live design session. Not a build spec yet, a direction to return to when the card work begins. A product of Equalpoint, Inc.*

---

## What this is

During the design session we built several working prototypes of the SODA card, the room, and the onboarding flow. This document captures the decisions and the open experiments that came out of that, so the direction is not lost between now and the build. Treat the locked items as settled and the experiments as things to feel out in prototype before committing.

---

## The card: front and back

The first iteration of the card is two faces, not three. A front and a back that flips, the way a real business card works.

**Front.** The Me face. Name, role, the agency lockup, and the signature. This is the identity side, the thing that says who you are. It is what shows by default.

**Back.** The Offers and Needs side. This is where the chips live, and they live here only. The back is reached by flipping the card, and the signature is part of this flip relationship, the card has a clear front-and-back physicality rather than three flat tabs.

> **Decision:** First iteration is a two-sided card. Front is Me (identity plus signature). Back holds Offers and Needs. The card flips between them.

### Keep the tab feature

Inside the card, the tab control that switches between views is worth keeping. The Offers, Me, Needs tabs read well and the toggle interaction feels right. The refinement is that the chips themselves do not belong on the outside of the card in the room. They belong on the back, revealed on flip or tap, with the tabs organizing what you see once you are looking at the card up close.

---

## Micro cards: keep them, strip them down

The micro cards in the room are the right pattern and they stay. The change is what they show.

A micro card in the room should not display the offer and need chips on its face. That detail belongs to the moment someone taps in, not to the room scan. The micro card shows the person (name, role, avatar, match signal) and nothing more. The chips appear only when you open the card and look at the back.

> **Decision:** Micro cards in the room show identity and match signal only. No offer or need chips on the outside. The chips live on the back of the full card, seen on tap.

This keeps the room clean to scan, makes the act of opening a card meaningful (there is something to reveal), and protects the front-and-back physicality of the card. The room is a wall of faces; tapping one turns it over to read what they offer and need.

---

## The card should be editable

The card is not a static print. The person should be able to edit their own card from inside the room: change their offers, their needs, their focuses, their role, their signature. The plus edit offers affordance already hinted at this. Make it real and make it cover the whole card, not just offers.

> **Decision:** The card is editable in place. The owner can update offers, needs, focuses, role, and signature after they are in the room, without leaving it.

This connects directly to the deferred-enrichment idea: someone enters with a light card and sharpens it over the night, and editing in place is how that happens.

---

## Shape and style variants (later)

The card may not be one fixed shape. There is room to explore different card shapes and style treatments, so a card can feel a little different from the next one, the way real business cards vary. This is explicitly a later addition, not first iteration, but worth noting now so the card component is built with the flexibility to support it rather than hard-coded to one shape.

> **Direction (later):** Explore shape and style variants for cards. Build the card component flexible enough to allow this even if the first iteration ships one shape.

---

## The in-room multi-focus flow (experiment to keep)

The version of the multi-focus flow worth carrying forward is the one from the MultiFocus JSX prototype: the one where, once you are in the room, a match surfaces and a modal lets you add focus chips to your offers and needs right there. Adding the focus through a modal in the room, triggered by a real match moment, is the interaction to keep experimenting with.

The flow in that prototype: you land in the room with light chips, the room finds you a match, a card surfaces saying you and this person both offer the same thing, and a Sharpen my matches button opens a modal where you add a focus or two per chip with type-or-tap suggestions. The focus is added in the moment it matters, not at the door.

> **Experiment to keep:** In-room focus enrichment through a modal, triggered by a match moment. Add focus chips to offers and needs after a match surfaces, not during onboarding. This is the deferred-specificity idea made concrete. Keep prototyping it.

The reference prototype is SODA-Onboarding-Flow-MultiFocus, the JSX version where the focus chips are added via the in-room modal.

---

## Tap a chip to start an intro (the intro starter)

When someone is looking at another person's card, on the Offers or Needs side, the chips should be more than display. Tapping a chip is a way to start a connection.

Tapping one of the other person's chips suggests a simple intro message, a short, low-pressure opener that references that chip. Something like "Tell me more, I'd like to connect" or an opener tied to the chip itself, "Saw you offer Mentorship in design, I'd love to hear more." The person can send it as is, edit it, or ignore it. The chip is the doorway and the suggested message is the first step through it.

> **Decision:** Chips on a viewed card are tappable intro starters. Tapping a chip suggests a simple, editable opener that references that chip. The viewer chooses to send, edit, or skip. SODA never sends on its own.

### Why this fits

This is the trust posture the product already runs on. SODA surfaces and suggests; the person decides and sends. The intro starter is that rule made tangible on the card: the room hands you an opening line tied to exactly what you share, and you choose whether to use it. It lowers the hardest part of a room, the first message, without ever taking the act of reaching out away from the person.

It also closes the loop on the whole card. The chips carry the focus, the focus makes the match specific, and now the specific match becomes a specific opener. "I'd like to connect" is fine, but "I'd love to hear about your Mentorship in design" is the kind of opener that only works because the focus layer exists. The intro starter is where the focus work pays off in a real human moment.

### How it behaves

- Tapping a chip on a viewed card opens a small suggested message, prefilled and editable.
- The default is simple and warm, a tell me more, I'd like to connect tone, not a hard pitch.
- The suggestion references the chip that was tapped, so the opener is specific to what you share.
- The viewer sends, edits, or dismisses. Nothing sends automatically.
- This connects to the existing draft and nudge logic: the same two-call gate (suggest, then the person confirms) applies here.

### Open questions

- Does the intro starter send through the same nudge channel, or is it a lighter, more immediate message since both people are in the room right now?
- Does tapping a chip on your own card do something different (edit it), versus tapping a chip on someone else's card (start an intro)? The same gesture may need two meanings depending on whose card it is.
- Should the suggested opener be AI-drafted per chip (richer, uses the focus) or a simple template (faster, predictable)? The AI draft is better but costs a call; the template is instant.

## How the pieces fit

The card system as it stands after this session:

- **In the room:** micro cards, identity and match signal only, no chips on the face.
- **Tap a micro card:** the full card opens. Front is Me with the signature. Flip to the back for Offers and Needs, organized by the tab control.
- **Your own card:** editable in place, so you can sharpen offers, needs, focuses, role, and signature without leaving the room.
- **Focus enrichment:** happens in the room through a modal, triggered by a match moment, not at the door.
- **Intro starter:** tapping a chip on someone else's card suggests a simple, editable opener referencing that chip. The viewer sends, edits, or skips.
- **Later:** card shape and style variants.

---

## Open questions to resolve before building

- Does the back of the card show Offers and Needs together, or does the tab control still split them into two separate back views? The front-and-back model and the three-tab model need to be reconciled into one clear interaction.
- When editing in place, does the card flip to an edit mode, or does a modal handle edits the way the focus modal does? Consistency between editing and focus-adding is worth deciding once.
- Does the match modal add focus to a single chip (the matched one) or open the whole card for sharpening? The prototype did the latter; the tighter version might lead with just the matched chip.
- For shape variants, what stays fixed as the SODA signature regardless of shape? The four-dot mark, the green, and the signature line are candidates for the constant.

---

**Status:** Direction captured June 23, 2026. Card build not yet started. Revisit this document when the card work begins, after the test suite and the pilot fixes are in.
