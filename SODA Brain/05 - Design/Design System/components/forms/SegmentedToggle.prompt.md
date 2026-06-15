**What & when:** A 2–3 option segmented control on a dark track. The selected option fills green with near-black text; options can carry a tiny subtitle. Use for the Event Mode (Full / Simple) control in host setup.

```jsx
const [mode, setMode] = React.useState('simple');
<SegmentedToggle
  value={mode}
  onChange={setMode}
  options={[
    { value: 'full',   label: 'Full',   subtitle: 'The whole experience' },
    { value: 'simple', label: 'Simple', subtitle: 'Entry and survey only' },
  ]}
/>
```

- `options`: array of `{ value, label, subtitle? }` (a bare string works too)
- `value` / `onChange`: controlled selection
- Green appears only on the selected option.
