**What & when:** A labelled text field — dark fill, mono uppercase label, green focus border. Used in Sign-In, Check-In, profile editing, and Admin forms. Pass `error` for the recoverable red message (the only place red appears).

```jsx
<Input label="Email" type="email" placeholder="you@email.com" />
<Input label="Code" error="That code did not match. Check your email or resend." />
<Input label="Host name" hint="What every attendee screen will wear." />
```
