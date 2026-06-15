import React from 'react';

/**
 * SODA Input — a labelled text field. Mono uppercase label sits above
 * a dark field; the border turns green on focus. Pass `error` to show
 * a red recoverable message beneath (the only place red appears).
 */
export function Input({ label, error, hint, style = {}, id, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  const fieldId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div style={{ marginBottom: 15 }}>
      {label && (
        <label
          htmlFor={fieldId}
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-micro)',
            letterSpacing: 'var(--ls-tag)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      <input
        id={fieldId}
        onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
        style={{
          width: '100%',
          background: 'var(--surface-1)',
          border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--r-sm)',
          padding: '12px 13px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans)',
          fontSize: 15,
          outline: 'none',
          transition: 'border-color var(--dur-fast) var(--ease)',
          ...style,
        }}
        {...rest}
      />
      {error && (
        <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 7 }}>{error}</div>
      )}
      {!error && hint && (
        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 7 }}>{hint}</div>
      )}
    </div>
  );
}
