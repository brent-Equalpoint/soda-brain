import React from 'react';

/**
 * SODA SectionHeader — a mono uppercase label with an optional green
 * "See all" action on the right. The quiet divider between blocks on
 * the Home and the cockpit panels.
 */
export function SectionHeader({ title, action, onAction, style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '6px 0 11px',
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {title}
      </span>
      {action && (
        <button
          onClick={onAction}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--accent)' }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
