# SODA — Full Flow Test Plan

*A walk-every-path checklist to prove there are no dead ends, no loops, and that everything fires.
Created 2026-06-27. Grounded in the real app code (every control below was confirmed to exist) and in
the as-built inventory: [[SODA-Flows-As-Built]]. Born out of the pilot failures at
[[SODA-Report-Latinos-N-Tech]] (the front-door trap and the stuck pop-ups), so those are explicit
regression checks here.*

---

## How to read this

**The three things every test is checking (the lenses):**
- 🚪 **No dead end.** Every screen has at least one clearly labelled way OUT (Home / Back / Leave /
  Account / Cancel) and a clear way FORWARD. You can always get somewhere on purpose.
- 🔁 **No loop.** You are never bounced back to the start and forced to re-do sign-in or rebuild your
  card. Progress sticks.
- ⚡ **Everything fires.** Every button does what it says: it navigates, saves, sends, or opens, and
  the result actually appears (including live updates and pop-ups that center on screen).

**Symbols:** `[ ]` a check to run · ✅ pass · ❌ fail (write what happened) · ⚠️ watch / known
caveat · 🤖 already covered by the robot (Playwright) · 👆 manual-only for now.

**Two ways to run it:**
1. **Manual phone pass** — tap through on a real phone (or a narrow browser window). Tick the boxes.
   This is the truth test: the pilot bugs only showed on a scrolled phone.
2. **The robot** — the Playwright end-to-end suite runs the marked flows automatically. Today it
   covers one path (sign-up to room to leave); every 👆 below is a flow to grow it into. See the
   coverage map at the end.

**Have ready before you start:** a live test event + its code · a phone or a narrow browser window ·
an email inbox you can read the 6-digit code from (locally that is Mailpit) · for host flows, a host
login.

---

## Part 0 — Universal rules (run these on EVERY screen)

These apply everywhere. If any screen fails one, note the screen.

- [ ] 🚪 The screen has a **visible, worded** way out (not a logo you have to guess is tappable).
- [ ] 🚪 The screen has a clear way **forward** (or a clear "you're done" end state).
- [ ] 🔁 Pressing the phone/browser **Back** button does not strand you on a blank or broken screen.
- [ ] ⚡ Every **pop-up / modal / sheet centers on screen even when the page is scrolled down** (the
  pilot bug). Open it after scrolling to the bottom and confirm it appears in view, not below the fold.
- [ ] ⚡ Every pop-up has a way to **close** it (an X, a Cancel, or tapping the dark area outside).
- [ ] ⚡ **Errors recover.** A wrong code, a network blip, or an expired link shows a message AND a way
  to continue, never a frozen or blank screen.
- [ ] ⚡ **Refreshing the page** mid-flow does not lose your place or dump you somewhere broken.
- [ ] ⚡ **Double-tapping** a Send / Save / Next button does not create duplicates or jam the screen.

---

## Part 1 — Attendee flows (the heart)

### Flow 1 — First-time sign-up, into the room 🟢🤖 `QR or / → /join → /room`
*Setup: a fresh email (never used here), the event code or QR.*
- [ ] Scan the QR or type the code at the front door → lands on the **host-branded sign-in**. ⚡
- [ ] Email code: the 6-digit code arrives in **one** email; entering it advances. ⚠️ *(the double-email
  is a Supabase dashboard toggle — confirm only one arrives.)*
- [ ] Build your card: role → what you offer → what you need → continue. 🚪 *a Cancel/back exists at
  every step.*
- [ ] "You're in" splash → the **live room** appears (not a blank, not an error). ⚡
- [ ] 🔁 At no point are you thrown back to the front door and made to start sign-in over.
- [ ] 🚪 **The pilot trap must not reappear:** you are never left on a "enter a code or open your card"
  screen with no card and no way out.

### Flow 2 — Returning sign-in 🟢👆 `/signin → /home`
- [ ] Front door → "Have a SODA card? Sign in" → `/signin` (returning only, no new account here). ⚡
- [ ] Sign in (email code / Google / password) → lands on **/home**. ⚡
- [ ] 🚪 From `/signin` there is a way back to the front door (or Back works without stranding). ⚠️
  *watch: confirm `/signin` is not a one-way screen.*
- [ ] 🔁 A wrong code or failed sign-in lets you retry in place; it does not loop you out and back.

### Flow 3 — Join an event by code 🟢👆 `/ and /home → /join`
- [ ] On the **front door**, type the event code → Enter → loads the join flow for that event. ⚡
- [ ] On **/home**, the "In an event?" code box does the same thing (you can join from your card
  screen, not only the front door). ⚡
- [ ] A **wrong / closed** code shows an error message, not a freeze. 🚪
- [ ] ⚠️ **Watch (known risk A):** open the join link with a **missing or bad token** → today the error
  screen has **no escape button** (only browser Back). Confirm whether a guest can get out. *(fix
  candidate — see Part 4.)*

### Flow 4 — Build your card / keep-or-change 🟢🤖(partial) `/join`
- [ ] First-timer: the card builder requires role + offers + needs before the room; each step has a
  **Cancel/back**. 🚪
- [ ] Returning guest: the **"Keep how you showed up, or change it"** choice appears. ⚡
- [ ] **Keep** → straight into the room with the old card. ⚡
- [ ] **Change** → the editor → save → into the room. ⚡
- [ ] 🔁 Choosing Change and then cancelling returns you to the keep/change choice, not back to sign-in.

### Flow 5 — Edit your card (two places) 🟢👆 `/home and /room`
- [ ] On **/home**, tap Edit on your card → the editor opens **as a pop-up that centers on screen**. ⚡
- [ ] Change a chip, add a focus ("Mentorship in [x]") via the focus pop-up → **Save** → the card shows
  the change. ⚡
- [ ] **Cancel** closes without saving. 🚪
- [ ] In the **room**, edit your card the same way → save → your roster card updates live. ⚡
- [ ] ⚡ The focus pop-up and the editor both center on screen even when scrolled.

### Flow 6 — The live room: roster + presence 🟢🤖(entry) `/room`
- [ ] The room loads after a one-time splash; you see people in **Grid / List / Cards**. ⚡
- [ ] Switching **Room / Wall** tabs works. ⚡
- [ ] The **live headcount** in the header reflects who is actually here. ⚡
- [ ] 🚪 The header shows a worded **← Leave** at all times (your way out is always visible).
- [ ] 🔁 The room does not silently kick you back to the front door while you have a live session.
  *(Deep-linking to `/room` with NO session SHOULD bounce you to `/` — that is correct, see Part 5.)*

### Flow 7 — The Acts: Drop / Chance / Nudge 🟢👆 `/room` overlays
- [ ] Host fires a **Drop** → the question overlay appears for everyone → type an answer → **Send** →
  your answer lands on the wall. ⚡
- [ ] Host fires a **Chance** (pairing) → the partner + starter shows → the timer counts down. ⚡
- [ ] Host fires a **Nudge** → it appears → **"Find them"** and **"Maybe later"** both close it. 🚪⚡
- [ ] An **Announcement** banner appears at the top and can be dismissed. 🚪
- [ ] ⚠️ **Watch (known risk B):** during a **Drop** or **Chance**, there is **no user close button** —
  the overlay only clears when the host ends it. Confirm a guest who wants out during an act can still
  reach **Leave** (or that the act always ends). *(fix candidate — see Part 4.)*

### Flow 8 — Notes: send + receive 🟢👆 `/room` *(pilot bug zone)*
- [ ] Tap a person's roster card → the **leave-a-note** pop-up opens → write → **Send** → confirmation,
  then it closes. ⚡
- [ ] Tap the **Notes** control in the header → your notes **inbox** sheet slides up → read → close. ⚡
- [ ] 🔁🚪 **Regression (the pilot failure):** scroll the room **all the way down first**, THEN open both
  the send pop-up and the notes inbox. Both must **appear centered on screen**, not below the fold.
  This is the exact bug that broke note send/receive at Latinos N Tech. ⚠️

### Flow 9 — Leave the room → recap → re-enter 🟢🤖 `/room → /left`
- [ ] Tap **← Leave** → **"Leave the room?"** confirm pop-up appears (centered). ⚡
- [ ] **Cancel** → stays in the room. 🚪
- [ ] **Leave** → the **recap** (`/left`): your connections + time in the room. ⚡
- [ ] **Back to the room** → returns you to `/room`, session intact. 🔁 *(re-entry, not a restart.)*
- [ ] **Done** → goes to `/home`, where a **"Back to {host}'s room"** banner also offers re-entry. ⚡
- [ ] 🚪 **Regression (the pilot trap):** confirm you are NEVER stuck inside with only Account as an exit.

### Flow 10 — Home: your people + follow-up 🟢👆 `/home`
- [ ] **Your people** lists the connections from the night. ⚡
- [ ] Tap a connection → the **draft composer** pop-up opens with a suggested follow-up. ⚡
- [ ] **Send** delivers it and the pop-up closes; **Discard/Close** backs out. 🚪⚡
- [ ] 🚪 `/home` always shows **Account** and a way to the front door (logo + worded control).

### Flow 11 — Closing the night: wrap → survey → send-off 🟢👆 `/wrap → /survey → /send-off`
- [ ] Host ends the event → guests in the room land on **"That's a wrap"**. ⚡
- [ ] **Take the survey** → questions one at a time; **Back** works (except the first); **Next** advances;
  the last question **submits** and moves to send-off. ⚡🚪
- [ ] **Send-Off** shows the goodbye + your connection count + the host's next-step button. ⚡
- [ ] The next-step button: an external link opens in a new tab; a "get on the list" button confirms in
  place. ⚡
- [ ] **Done** → returns to the front door. 🚪
- [ ] 🔁 Re-opening the app after the night does not loop you back into a closed room; it lands you home.

### Flow 12 — Account 🟢👆 `/account`
- [ ] Edit **name** → save → it updates. ⚡
- [ ] Change **email** / **password** → sends the confirmation; Cancel backs out of each. 🚪⚡
- [ ] **Sign out** → returns to the front door cleanly. 🚪
- [ ] **Delete account** → confirm step → completes (no half-deleted limbo). ⚡
- [ ] 🚪 The header gives a labelled way home (this is the screen the pilot guests got trapped on — it
  must always have an exit).

---

## Part 2 — Host / Operator flows

### Flow 13 — Host sign-in → Admin 🟢👆 `/admin`
- [ ] Sign in once → reach **Admin**. ⚡
- [ ] **Create an event** → take it **live** → the **link + QR** display. ⚡
- [ ] **Manual check-in** adds a walk-in. ⚡
- [ ] **Close** the night. ⚡
- [ ] **Export CSVs** (attendees / matches / survey) download. ⚡ ⚠️ *Regression: the attendees CSV now
  has an **Email column** (walk-ins blank) — see Part 3.*
- [ ] 🚪 Every Admin sub-view has a way back to the event list / sign out.

### Flow 14 — Command Center (live cockpit) 🟢👆 `/host`
- [ ] **Acts** tab: fire Drop / Chance / Nudge / Announce → each lands in the room (pair with Flow 7). ⚡
- [ ] **Room** tab: the live roster matches who is in. ⚡
- [ ] **Survey** tab: author questions + watch answers arrive live; **Copy survey link** works. ⚡
- [ ] **Feed / Intel** tabs: the activity stream and the matching engine load. ⚡
- [ ] **Settings** tab: note limit, Send-Off copy, chip menus, chip-moderation all save. ⚡
- [ ] 🚪 Tabs switch freely; no tab is a dead end.

### Flow 15 — Door kiosk 🟢👆 `/kiosk`
- [ ] Big QR + code + **live headcount**; greeter one-tap check-in works. ⚡
- [ ] 🚪 The locked screen has its intended **Exit** (with confirm) and nothing else wanders.

### Flow 16 — Ops / Analytics 🟢👆 `/ops`, `/analytics`
- [ ] A non-operator is bounced (server-gated) — confirm the denial, not a broken page. 🚪
- [ ] An operator sees the master board + per-event analytics. ⚡

---

## Part 3 — Known failures: must NEVER come back (regression)

These three broke in the pilots and are fixed. Re-run them every release.

- [ ] **Front-door / onboarding trap.** Sign in fresh with no card yet → you are never stranded on a
  "code or card" screen, and the account page always has a labelled way home. *(Flows 1, 9, 12.)*
- [ ] **Stuck pop-ups on scroll.** Scroll any screen to the bottom, open any pop-up → it centers on
  screen. Test note send + note inbox specifically. *(Flow 8, Part 0.)*
- [ ] **Missing emails in the export.** Download the attendees CSV → the **Email column** is present and
  populated (walk-ins blank). *(Flow 13.)*

---

## Part 4 — Newly spotted risks (from the code map — verify, then likely fix)

The grounding sweep found these. Verify each by hand; each is a small fix candidate, not yet done.

- [ ] **A · `/join` error screen has no escape.** Open a join link with a bad/missing token → today the
  error has only browser Back. **Fix candidate:** add a "Go to the front door" button on that error.
- [ ] **B · Drop / Chance overlays have no user close.** A guest can only leave the act when the host
  ends it. **Fix candidate:** ensure **Leave** stays reachable during an act, or add a quiet "step out"
  so an act can never feel like a trap (this is the same "always a way out" principle the pilot taught).
- [ ] **C · `/signin` has no explicit Back.** Relies on the browser button. **Fix candidate:** add a
  worded "Back to front door" link for consistency with the labelled-controls rule.

---

## Part 5 — Deep-link / guard tests (stale-session protection)

Open these URLs directly with **no active session** (or a stale one). Each must **bounce you somewhere
sensible**, never show a broken or empty screen. (These guards are in the code; this confirms they hold.)

- [ ] `/room` with no session → bounces to `/`. ⚡
- [ ] `/left` with no session → bounces to `/`. ⚡
- [ ] `/wrap` with no session → bounces to `/`; with a still-live event → bounces to `/room`; closed
  over 30 min ago → bounces to `/` and clears the stale session. ⚡
- [ ] `/account` while signed out → shows a "not signed in" screen **with a link to `/`** (not a dead
  end). 🚪
- [ ] `/ops` as a non-operator → server-side bounce to `/`. 🚪

---

## Part 6 — Coverage map: robot vs. manual

| Flow | Robot (Playwright) today | Gap to automate |
|---|---|---|
| 1 · First-time sign-up → room | 🤖 covered (sign-up → room → leave) | — |
| 9 · Leave → recap → re-enter | 🤖 covered (leave half) | add the re-enter + home banner |
| 2 · Returning sign-in | 👆 manual | **next E2E to add** |
| 8 · Notes send/receive (scroll) | 👆 manual | **next E2E to add** (guards the pilot bug) |
| 3,4,5,6,7,10,11,12 · rest of attendee | 👆 manual | grow per UI rebuild |
| 13–16 · host / ops | 👆 manual | later (host go-live is the high-value one) |

*The robot covers one path today. This plan doubles as the to-do list for which flows to teach it next;
the priorities line up with the 3-day sprint (returning sign-in + a second flow) in
[[SODA-Backlog]].*

---

## Sign-off

- [ ] All of Part 0 passes on a real phone.
- [ ] All attendee flows (Part 1) pass.
- [ ] Host / ops flows (Part 2) pass.
- [ ] All three regressions (Part 3) pass.
- [ ] Part 4 risks triaged (fixed or consciously accepted).
- [ ] Part 5 guards hold.

**Run by:** _______ · **Date:** _______ · **Build / branch:** _______ · **Result:** ✅ / ❌ (notes
below).

*Pairs with [[SODA-Flows-As-Built]] (what each flow is) and feeds [[SODA-Attendee-UI-Overhaul]] (every
rebuilt screen re-runs this plan before it ships).*
