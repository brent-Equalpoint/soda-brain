**What & when:** A circular identity mark for any person. Shows a photo if `src` is set, else white initials on a color hashed deterministically from the name. Sizes scale type automatically.

```jsx
<Avatar name="Maya Chen" size={48} />
<Avatar name="Jordan Blake" src="/jordan.jpg" size={38} />
```

- `initialsOf(name)` is exported for use in your own markup.
