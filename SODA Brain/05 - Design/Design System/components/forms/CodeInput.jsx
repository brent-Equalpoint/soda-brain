import React from 'react';

/**
 * SODA CodeInput — the six-digit email verification entry. Renders N
 * cells; the active cell shows a green border. Display-only by default
 * (pass `value` + `onChange` to drive it), built to match the Sign-In
 * code screen.
 */
export function CodeInput({ length = 6, value = '', onChange, error = false }) {
  const cells = Array.from({ length });
  const handle = (e) => {
    if (!onChange) return;
    const v = e.target.value.replace(/\D/g, '').slice(0, length);
    onChange(v);
  };
  const activeIndex = Math.min(value.length, length - 1);
  return (
    <div style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={handle}
        inputMode="numeric"
        autoComplete="one-time-code"
        style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'text' }}
        aria-label={`${length}-digit code`}
      />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {cells.map((_, i) => {
          const filled = i < value.length;
          const isActive = i === activeIndex && value.length < length;
          return (
            <div
              key={i}
              style={{
                width: 46,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--surface-1)',
                border: `1px solid ${error ? 'var(--danger)' : isActive ? 'var(--accent)' : 'var(--border-strong)'}`,
                borderRadius: 'var(--r-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: 24,
                fontWeight: 'var(--fw-medium)',
                color: 'var(--text-primary)',
              }}
            >
              {filled ? value[i] : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
