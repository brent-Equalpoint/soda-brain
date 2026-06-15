import React from 'react';

/**
 * SODA ResendControl — the calm "Resend code" control on the code screen.
 * While the timer runs it reads "Resend in 0:20" in muted grey; at zero it
 * becomes an active green text link. Calm, never alarming. Pass `seconds`
 * for the initial countdown and `onResend` for the tap; it restarts the
 * timer on its own.
 */
export function ResendControl({ seconds = 20, onResend, label = 'Resend code', style = {} }) {
  const [remaining, setRemaining] = React.useState(seconds);

  React.useEffect(() => {
    if (remaining <= 0) return undefined;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const ready = remaining <= 0;

  const handle = () => {
    if (!ready) return;
    if (onResend) onResend();
    setRemaining(seconds);
  };

  return (
    <button
      onClick={handle}
      disabled={!ready}
      style={{
        background: 'none',
        border: 'none',
        padding: '6px 4px',
        cursor: ready ? 'pointer' : 'default',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: ready ? 'var(--fw-semibold)' : 'var(--fw-regular)',
        color: ready ? 'var(--accent)' : 'var(--text-muted)',
        transition: 'color var(--dur-fast) var(--ease)',
        ...style,
      }}
    >
      {ready ? label : `Resend in ${fmt(remaining)}`}
    </button>
  );
}
