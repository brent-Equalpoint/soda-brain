**What & when:** A read-only badge for a host role that was *granted*, not chosen. `granted` (solid green) confirms a role assigned by invite on account setup; `owner` reads on the calm deep-green surface; `collaborator` is a quiet muted tag.

```jsx
<RolePill tone="granted">Owner</RolePill>
<RolePill tone="owner">Owner</RolePill>
<RolePill tone="collaborator">Collaborator</RolePill>
```

- `tone`: `granted | owner | collaborator`
- Roles are granted, never picked — this pill is display-only.
