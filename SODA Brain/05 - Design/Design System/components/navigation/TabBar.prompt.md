**What & when:** The fixed bottom tab bar of the between-events Home. Active tab is green; a purple dot flags waiting follow-ups.

```jsx
const tabs = [
  { id: 'overview', icon: '■', label: 'Overview' },
  { id: 'events',   icon: '▣', label: 'Events' },
  { id: 'contacts', icon: '◎', label: 'Contacts', dot: true },
];
<TabBar tabs={tabs} active={tab} onChange={setTab} />
```
