import React from 'react';

/**
 * SODA EventCard — an event in the Home. Two layouts:
 *  - 'strip' (default): a compact fixed-width card for the horizontal
 *    "recent events" strip — host eyebrow, name, date · N met.
 *  - 'row': a full-width list row with a logo tile and a green met count.
 */
export function EventCard({ host, name, date, where, met, recap, variant = 'strip', onClick }) {
  if (variant === 'row') {
    const logo = host.split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 13,
          background: 'var(--surface-1)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)', padding: '13px 14px',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <div style={{
          flex: '0 0 auto', width: 40, height: 40, borderRadius: 'var(--r-sm)',
          background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)',
        }}>{logo}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
            {date}{where ? ` · ${where}` : ''}{recap ? '  ·  recap' : ''}
          </div>
        </div>
        {met != null && (
          <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--accent)' }}>{met}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>met</div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      onClick={onClick}
      style={{
        flex: '0 0 auto', width: 150,
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', padding: 13,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>{host}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 8 }}>{name}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{date}{met != null ? ` · ${met} met` : ''}</div>
    </div>
  );
}
