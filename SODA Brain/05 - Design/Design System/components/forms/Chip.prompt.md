**What & when:** A tappable pill for the micro-profile steps (Role / Offer / Need) and profile editing. Fills green when selected; `writeIn` adds a leading ＋ for "add your own".

```jsx
<Chip selected={role === 'Founder'} onClick={() => setRole('Founder')}>Founder</Chip>
<Chip>Designer</Chip>
<Chip writeIn onClick={openWriteIn}>Add your own</Chip>
```

- `selected`: green fill
- `writeIn`: leading ＋ affordance
