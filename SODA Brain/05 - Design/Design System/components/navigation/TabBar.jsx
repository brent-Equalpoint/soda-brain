import React from 'react';

/**
 * SODA TabBar — the fixed bottom tab bar of the Home. Each tab is an
 * icon glyph over a mono label; the active tab is green. A purple dot
 * marks a tab with waiting nudges.
 */
export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', borderTop: '1px solid var(--border)', background: '#0e0f0e' }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange && onChange(t.id)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '11px 0 13px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: on ? 'var(--accent)' : 'var(--text-muted)',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }} aria-hidden="true">{t.icon}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t.label}</span>
            {t.dot && (
              <span style={{ position: 'absolute', top: 7, right: '50%', marginRight: -22, width: 7, height: 7, borderRadius: '50%', background: 'var(--private)' }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
