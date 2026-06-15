import React from 'react';

/**
 * SODA Badge — a small pill. Two roles:
 *  - status: 'built' | 'spec' (documentation status)
 *  - signal: 'reached' | 'nudge' | 'saved' | 'just' (contact follow-up state)
 * Pass either `status` or `signal`, or a freeform `tone`.
 */
export function Badge({ children, tone = 'neutral', status, signal, dot = false, style = {} }) {
  const TONES = {
    neutral: { color: 'var(--text-muted)', background: 'var(--surface-2)' },
    green:   { color: 'var(--accent)', background: 'var(--accent-soft)' },
    purple:  { color: 'var(--private)', background: 'var(--private-soft)' },
    amber:   { color: 'var(--warn)', background: 'var(--warn-soft)' },
    yellow:  { color: 'var(--pending)', background: 'rgba(255,210,63,0.12)' },
    danger:  { color: 'var(--danger)', background: 'var(--danger-soft)' },
  };
  const STATUS = { built: 'green', spec: 'yellow' };
  const SIGNAL = { reached: 'green', nudge: 'purple', saved: 'neutral', just: 'neutral' };
  const key = status ? STATUS[status] : signal ? SIGNAL[signal] : tone;
  const t = TONES[key] || TONES.neutral;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        padding: '4px 9px',
        borderRadius: 'var(--r-pill)',
        whiteSpace: 'nowrap',
        ...t,
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}
