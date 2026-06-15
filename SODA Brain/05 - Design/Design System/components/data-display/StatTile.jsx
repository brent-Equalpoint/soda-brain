import React from 'react';

/**
 * SODA StatTile — a single live vital sign. Big Archivo Black number
 * (green by default) over a mono uppercase label. The unit of the Live
 * Stat Bar and the dashboard counts.
 */
export function StatTile({ value, label, color = 'var(--accent)', style = {} }) {
  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '16px 18px',
        minWidth: 110,
        ...style,
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 1, color }}>{value}</div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'var(--text-muted)',
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}
