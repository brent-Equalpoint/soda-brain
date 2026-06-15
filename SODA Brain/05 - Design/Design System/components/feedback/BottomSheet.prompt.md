**What & when:** A dark sheet that rises over a dimmed near-black screen at a calm moment (e.g. the add-to-home prompt after an event). Rounded top, grabber handle, optional title. Light and optional — tapping the backdrop closes it. Renders absolutely inside its nearest positioned ancestor (the phone frame).

```jsx
<BottomSheet open={show} onClose={dismiss} title="Keep SODA handy">
  <p>Add it to your home screen so your contacts are one tap away.</p>
  <Button block>Add to home screen</Button>
</BottomSheet>
```

- `open`: animates in/out
- `onClose`: fired when the dim backdrop is tapped
- `title`: optional display-type heading
