**What & when:** The six-digit email code entry from Sign-In. A row of cells with a green active cell; pass `error` to turn it red after a failed code.

```jsx
const [code, setCode] = React.useState('');
<CodeInput length={6} value={code} onChange={setCode} error={failed} />
```
