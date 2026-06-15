import React from 'react';

/**
 * SODA RolePill — a read-only badge for a host role that was *granted*,
 * not chosen. `owner` reads on the calm deep-green surface; `collaborator`
 * is a quiet muted tag; `granted` is the solid green pill used on the
 * account-setup screen to confirm the role assigned by invite.
 */
export function RolePill({ children, tone = 'collaborator', style = {} }) {
  const tones = {
    granted: { color: 'var(--on-accent)', background: 'var(--accent)', border: '1px solid var(--accent)' },
    owner: { color: 'var(--accent-bright)', background: 'var(--surface-green)', border: '1px solid transparent' },
    collaborator: { color: 'var(--text-secondary)', background: 'var(--surface-2)', border: '1px solid var(--border-strong)' },
  };
  const t = tones[tone] || tones.collaborator;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-micro)',
        fontWeight: 'var(--fw-medium)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        padding: '5px 11px',
        borderRadius: 'var(--r-pill)',
        whiteSpace: 'nowrap',
        ...t,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
