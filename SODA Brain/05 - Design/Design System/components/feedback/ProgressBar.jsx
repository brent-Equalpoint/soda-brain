import React from 'react';

/**
 * SODA ProgressBar — a thin green fill on a dark track. Used by the
 * one-question-at-a-time survey and any stepped flow. Pass `value`
 * and `max`, or a 0–1 `ratio`.
 */
export function ProgressBar({ value, max = 100, ratio, color = 'var(--accent)', height = 6, style = {} }) {
  const pct = ratio != null ? ratio * 100 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      style={{
        height,
        width: '100%',
        background: 'var(--surface-2)',
        borderRadius: 'var(--r-pill)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 'var(--r-pill)',
          transition: 'width var(--dur-base) var(--ease)',
        }}
      />
    </div>
  );
}
