import React from 'react';

/**
 * SODA Toast — a small confirmation pill that rises from the bottom.
 * Green dot + message. Tone changes the accent edge (green confirm,
 * purple private, red error). Render with `show` to animate in.
 */
export function Toast({ message, show = true, tone = 'green', style = {} }) {
  const edge = { green: 'var(--accent)', purple: 'var(--private)', danger: 'var(--danger)' }[tone] || 'var(--accent)';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--surface-2)',
        border: `1px solid ${edge}`,
        color: 'var(--text-primary)',
        fontSize: 13,
        padding: '11px 18px',
        borderRadius: 'var(--r-pill)',
        boxShadow: 'var(--shadow-toast)',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity var(--dur-base) var(--ease), transform var(--dur-base) var(--ease)',
        ...style,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: edge }} />
      {message}
    </div>
  );
}
