import React from 'react';

/**
 * SODA EventRow — a full-width row for an event in a host's list: host
 * identity eyebrow, event name, and a status tag. A live event shows a
 * green "Live now" dot-tag; the rest read as muted labels. Used on the
 * host welcome-back screen.
 */
export function EventRow({ host, name, status = 'Upcoming', live = false, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        width: '100%',
        textAlign: 'left',
        background: 'var(--surface-1)',
        border: `1px solid ${live ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--r-md)',
        padding: '13px 14px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color var(--dur-fast) var(--ease)',
        ...style,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-nano)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 5,
          }}
        >
          {host}
        </div>
        <div style={{ fontSize: 15, fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
          {name}
        </div>
      </div>
      <span
        style={{
          flex: '0 0 auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-micro)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: 'var(--r-pill)',
          color: live ? 'var(--accent)' : 'var(--text-muted)',
          background: live ? 'var(--accent-soft)' : 'var(--surface-2)',
        }}
      >
        {live && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}
        {live ? 'Live now' : status}
      </span>
    </button>
  );
}
