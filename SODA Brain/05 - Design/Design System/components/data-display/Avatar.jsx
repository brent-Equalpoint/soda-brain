import React from 'react';

const AV_PALETTE = ['--av-1', '--av-2', '--av-3', '--av-4', '--av-5', '--av-6', '--av-7', '--av-8'];

export function initialsOf(name = '') {
  return name.trim().split(/\s+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase();
}

function colorFor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return `var(${AV_PALETTE[h % AV_PALETTE.length]})`;
}

/**
 * SODA Avatar — a circular identity mark. If `src` is given it shows the
 * photo; otherwise it falls back to white initials on a deterministic
 * color from the 8-color identity palette (stable per name).
 */
export function Avatar({ name = '', src = null, size = 48, color, style = {} }) {
  const bg = color || colorFor(name);
  return (
    <div
      style={{
        flex: '0 0 auto',
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.38),
        color: '#fff',
        background: src ? `center/cover no-repeat url(${src})` : bg,
        overflow: 'hidden',
        userSelect: 'none',
        ...style,
      }}
      aria-label={name}
    >
      {!src && initialsOf(name)}
    </div>
  );
}
