import React from 'react';

/**
 * SODA Chip — a tappable pill for the Role / Offer / Need steps and
 * profile editing. Selected state fills green. Optionally shows a
 * small leading "+" affordance for write-ins.
 */
export function Chip({ children, selected = false, onClick, writeIn = false, style = {}, ...rest }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 'var(--fw-regular)',
        minHeight: 44,
        padding: '10px 16px',
        borderRadius: 'var(--r-pill)',
        cursor: 'pointer',
        transition: 'transform var(--dur-fast) var(--ease)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: selected ? 'var(--accent)' : 'var(--surface-1)',
        color: selected ? 'var(--on-accent)' : 'var(--text-secondary)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: selected ? 'var(--accent)' : 'var(--border-strong)',
        ...style,
      }}
      {...rest}
    >
      {writeIn && <span aria-hidden="true" style={{ opacity: 0.7 }}>＋</span>}
      {children}
    </button>
  );
}
