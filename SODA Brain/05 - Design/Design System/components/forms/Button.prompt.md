**What & when:** The SODA button — green `primary` is the single clear action on a screen; `ghost` for secondary, `purple` for private/Nudge actions, `danger` for destructive.

```jsx
<Button variant="primary" block onClick={enterRoom}>Enter the room</Button>
<Button variant="ghost" icon="←">Back</Button>
<Button variant="purple">Saved ✓</Button>
<Button variant="primary" disabled>Reached out</Button>
```

- `variant`: `primary | ghost | purple | danger`
- `size`: `sm | md | lg`
- `block`: full-width (the mobile default)
- `icon`: optional leading Unicode glyph
