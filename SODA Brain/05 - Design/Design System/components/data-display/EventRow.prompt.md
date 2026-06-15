**What & when:** A full-width event row for a host's list — host eyebrow, event name, and a status tag. A live event shows a green "Live now" dot-tag and a green edge; the rest read as muted labels. Use on the host welcome-back screen.

```jsx
<EventRow host="Futureland" name="Creative Meetup" live onClick={open} />
<EventRow host="Black Tech Week" name="BTW Activation" status="Sat, Jun 14" />
```

- `host` / `name`: identity eyebrow + event name
- `live`: green "Live now" tag and edge
- `status`: label shown when not live (e.g. a date or "Draft")
