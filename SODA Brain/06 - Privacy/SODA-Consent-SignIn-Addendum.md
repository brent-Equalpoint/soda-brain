# SODA: Consent at Sign-In

*A design-spec addendum. The standard light consent pattern, folded into the existing Sign-In screen. No new screen.*

## The pattern

SODA uses the standard light consent pattern that most consumer apps use. The person presses the button to continue, and a visible line near the button states that continuing means they agree to the Privacy Policy, with the policy linked. The button press is the consent. There is no checkbox and no separate consent screen, which keeps the ninety-second setup fast.

## Where it goes

It attaches to Screen 3, Sign-In, the one moment identity is collected, which is the correct place for consent. It is a single line directly beneath the primary button. Nothing else about the screen changes.

## The exact copy

Consent line, beneath the Sign-In button:

> By continuing, you agree to our Privacy Policy.

The words “Privacy Policy” are a link that opens the policy. When Terms of Service exist later, this line becomes “you agree to our Terms and Privacy Policy.”

Photo reassurance line, on Screen 11, the Photo step, beneath the photo target:

> Only people at your event can see this.

This is a small trust cue at the one moment a guest shares something more personal than a name.

## What stays separate

The recap email is part of the service, so it is covered by this consent. Any future marketing email, news about other events or membership, is kept separate and gets its own optional opt-in when the time comes. It is never bundled into sign-in.

## The Sign-In prompt update

Add this one line to the Sign-In screen prompt in the design spec, so Claude Design renders it:

```
Beneath the primary button, add one small line of muted-grey DM Sans body text:
"By continuing, you agree to our Privacy Policy." The words "Privacy Policy" are
a Soda green #3BD75C text link. Keep it quiet and secondary, well below the button,
not competing with it.
```
