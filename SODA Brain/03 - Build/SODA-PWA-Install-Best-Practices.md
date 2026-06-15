# SODA PWA Install Best Practices

*The add-to-phone layer: how a guest goes from scanning the QR in a browser to having SODA on their home screen, what never to force at the door, and the in-app browser trap that breaks both sign-in and install. A product of Equalpoint, Inc.*

---

## The rule above all the others

Never gate the room behind installation. The QR opens SODA in the phone's browser, and the browser version is the full product: sign-in, the Room View, presence, the acts, everything. Install is an upgrade offered after the app has proven its worth, never a toll at the door. At a live event, every extra step before the room is drop-off, and an install demand at the entrance is the single most expensive step you could add. The web is the door; the home screen is the souvenir.

---

## 1. The foundation, what makes SODA installable at all

Installability is mostly a checklist, and failing any item silently removes the option.

- **A valid manifest** with name, short_name, start_url, display set to standalone, background_color, theme_color, and icons at 192 and 512 pixels, plus a maskable icon so Android can shape it. Any validation error silently prevents install.
- **A service worker with a real fetch handler,** not a placeholder, served over HTTPS. It caches the app shell only, never room data, per the standing rule.
- **The SODA-specific manifest call:** the installed app is SODA-branded, the four-point star on a dark icon, theme and background #111111, name and short_name SODA. Host branding lives inside event screens, not on the home-screen icon, which keeps the brand-agnostic rule intact: the host owns the night, Equalpoint owns the app on the phone.
- **Add description and screenshots to the manifest.** On Android they upgrade the install prompt from a thin info bar to a store-style dialog, which meaningfully helps conversion.

---

## 2. The two install worlds, and the sheet that bridges them

There is no single install flow, there are two, split by platform, and the install sheet component must know which world it is in.

- **Android and desktop Chromium (Chrome, Edge, Samsung Internet):** the browser fires a beforeinstallprompt event once criteria are met, including an engagement heuristic of roughly thirty seconds on the domain. Best practice is to call preventDefault, save the deferred event, and trigger the real native prompt later from your own button at a moment you choose. The prompt can only be shown on a user gesture, and a deferred event can be used once.
- **iOS:** there is no beforeinstallprompt, no automatic prompt of any kind, and Apple has shown no intent to add one. Install is manual: Share, then Add to Home Screen. The install sheet on iOS is therefore instructional, a short visual of those two taps. One sharp edge: Chrome and Edge on iOS cannot install PWAs at all, only Safari can, so if the sheet detects a non-Safari iOS browser it should say open this in Safari first. Verify this against current iOS behavior before the pilot, since Apple shifts this surface.
- **Detect the installed state** with the display-mode standalone media query and never show the install sheet inside the installed app.

---

## 3. When to offer install, the SODA moments

Timing is the whole game. The engagement heuristic means the prompt is not even available in the first seconds, and a guest at the door has one goal, the room, so the right moments are after value, not before:

- **After the first connection is made.** The guest has just experienced the point of the product. One quiet line: keep SODA on your phone for next time.
- **At the recap email.** The recap already arrives by email per the iOS decision, and a link back into the app is the natural second offer, on the guest's own time.
- **For the returning guest.** Someone scanning into their second event is the warmest install candidate in the system. Offer once, remember the dismissal, never nag.

A dismissed offer is an answer. Store the dismissal and do not re-prompt within the same event.

---

## 4. The in-app browser trap, the one that breaks the door

This is the finding that matters most for a live event, because it intersects with how invitations actually spread.

- **The QR path is safe.** A QR scanned with the phone's native camera opens the default browser, where everything works.
- **The link path is not.** An event link tapped inside Instagram, LinkedIn, Messenger, or most social apps opens in that app's embedded webview. Inside a webview, Google blocks OAuth sign-in outright with a 403 disallowed_useragent error, a policy in force since 2021, and PWA install is unavailable. So the two shiniest parts of the door, the Google button and the install sheet, both fail precisely when a guest arrives through the most common social path.
- **The mitigation is threefold.** Detect the webview from the user agent. Show a gentle banner: for the best experience, open in your browser, with the platform's escape hatch. And lean on the flow that still works everywhere: the email one-time code, which functions inside any webview. This is a quiet, decisive argument for the auth decision already made, the email code is not just the fallback for people who avoid social sign-in, it is the only sign-in that survives the social-app door.
- **Hide what cannot work.** In a detected webview, suppress the social sign-in buttons rather than letting a guest tap into a 403, and never show the install sheet there.

---

## 5. Tips

- **The QR should encode the canonical event URL, nothing clever.** Universal links and custom schemes belong to native apps; for a PWA the plain HTTPS URL is the deep link, and the per-event token in it does the routing.
- **Test install on real devices,** one Android and one iPhone, before the pilot. Installability failures are silent by design.
- **Keep the installed start_url at home, not at a specific event,** so a guest who installed at one event opens to their own home surface at the next.
- **The wake-lock and storage-eviction realities from the stack research still govern:** the server is the source of truth, the recap rides email, and nothing about install changes that.

---

## QA and confidence

- **High confidence,** from web.dev, current platform documentation, and corroborating 2026 sources: the manifest and service worker criteria, beforeinstallprompt being Chromium-only with the deferred-prompt pattern and engagement heuristic, iOS having no install prompt with manual Add to Home Screen, the richer Android dialog from description and screenshots, and Google's webview OAuth block.
- **Verify before the pilot:** the exact current behavior of third-party iOS browsers regarding Add to Home Screen, which Apple has changed before, and the precise Chrome engagement criteria, which evolve. Both are one-line checks against current docs.

---

## Pre-pilot install checklist

- Manifest valid with standalone display, 192 and 512 icons plus maskable, dark theme, SODA-branded, description and screenshots present.
- Service worker has a real fetch handler, caches the shell only, HTTPS everywhere.
- Room fully usable in the browser with no install requirement anywhere in the entry flow.
- Install sheet is platform-split: deferred native prompt on Android, two-tap instructions on iOS, Safari redirect note for iOS non-Safari browsers.
- Install offered only after value, dismissal remembered, never shown when already standalone.
- Webview detected: social buttons suppressed, email code front and center, open-in-browser banner shown, install sheet hidden.
- Install tested on one real Android and one real iPhone.

*A name tag knows you showed up. SODA knows who you became to the room, and the home screen is where that relationship lives between rooms. But the door is the browser, and the door stays open to everyone.*
