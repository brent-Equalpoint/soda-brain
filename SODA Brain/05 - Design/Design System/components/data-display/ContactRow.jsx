import React from 'react';
import { Avatar } from './Avatar.jsx';
import { Badge } from './Badge.jsx';

/**
 * SODA ContactRow — a person in a list: avatar, name, a mono met-at
 * line, an optional warmth dot, and a trailing signal badge. The unit
 * of the Room View, the rolodex, and "people you met".
 */
export function ContactRow({
  name,
  role,
  metAt,
  signal,
  warmthColor,
  src,
  onClick,
  boxed = true,
  style = {},
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: boxed ? '11px 13px' : '7px 0',
        background: boxed ? 'var(--surface-1)' : 'transparent',
        border: boxed ? '1px solid var(--border)' : 'none',
        borderRadius: boxed ? 'var(--r-md)' : 0,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color var(--dur-fast) var(--ease)',
        ...style,
      }}
    >
      <Avatar name={name} src={src} size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>{name}</div>
        {metAt && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              marginTop: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {role ? `${role} · ${metAt}` : metAt}
          </div>
        )}
      </div>
      {warmthColor && <span style={{ flex: '0 0 auto', width: 8, height: 8, borderRadius: '50%', background: warmthColor }} />}
      {signal && <Badge signal={signal}>{{ reached: 'Reached out', nudge: 'Reach out', saved: 'Saved', just: 'Just met' }[signal]}</Badge>}
    </div>
  );
}
