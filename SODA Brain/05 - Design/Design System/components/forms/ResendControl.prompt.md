**What & when:** The calm "Resend code" control on the sign-in code screen. While the timer runs it reads "Resend in 0:20" in muted grey; at zero it becomes an active green text link and restarts itself on tap. Calm, never alarming.

```jsx
<ResendControl seconds={20} onResend={() => sendCode()} />
```

- `seconds`: countdown length before the link re-arms (default 20)
- `onResend`: fired when the re-armed link is tapped
- `label`: active-state label (default "Resend code")
- Green appears only once the link is active.
