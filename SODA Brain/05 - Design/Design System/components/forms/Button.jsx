import React from 'react';

/**
 * SODA Button — the one interactive primary is green; ghost and
 * private (purple) are the supporting variants. Full-width by
 * default, as on the mobile spine.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  icon = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '9px 13px', fontSize: 13 },
    md: { padding: '14px 16px', fontSize: 15 },
    lg: { padding: '16px 18px', fontSize: 16 },
  };

  const variants = {
    primary: { background: 'var(--accent)', color: 'var(--on-accent)', border: '1px solid var(--accent)' },
    ghost:   { background: 'var(--surface-1)', color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' },
    purple:  { background: 'var(--private-soft)', color: 'var(--private)', border: '1px solid var(--private-border)' },
    danger:  { background: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid var(--danger)' },
  };

  return (
    <button
      disabled={disabled}
      style={{
        width: block ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-semibold)',
        borderRadius: 'var(--r-md)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        lineHeight: 1.1,
        transition: 'filter var(--dur-fast) var(--ease)',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.filter = 'brightness(0.92)'; }}
      onMouseUp={(e) => { e.currentTarget.style.filter = 'none'; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
      {...rest}
    >
      {icon && <span aria-hidden="true" style={{ fontSize: '1.05em', lineHeight: 1 }}>{icon}</span>}
      {children}
    </button>
  );
}
