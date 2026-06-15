**What & when:** A short, skippable onboarding carousel. A green "N of M" progress cue and a Skip link sit at the top; one card shows in the center; progress dots and a full-width advance button ("Next" → "Got it") sit at the bottom. Use for the collaborator tutorial. Light, concrete, never a wall of text.

```jsx
<Carousel
  cards={steps.map((s, i) => <TutorialCard key={i} {...s} />)}
  onDone={finish}
  onSkip={finish}
  renderButton={({ next, label }) => (
    <Button block size="lg" onClick={next}>{label.toUpperCase()}</Button>
  )}
/>
```

- `cards`: one node per card (you build illustration + headline + body)
- `onDone` / `onSkip`: completion + skip callbacks
- `renderButton`: render-prop so the advance button can be the DS `Button`
