import React from 'react';

/**
 * SODA BottomSheet — a dark sheet that rises over a dimmed near-black
 * screen at a calm moment. Rounded top, a small grabber handle, and an
 * optional title. Light and optional, never blocking: tapping the dim
 * backdrop closes it. Renders absolutely inside its nearest positioned
 * ancestor (e.g. the phone frame).
 */
export function BottomSheet({ open = true, onClose, title, children, style = {} }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'flex-end',
        background: 'rgba(0,0,0,0.6)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity var(--dur-base) var(--ease)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Sheet'}
        style={{
          width: '100%',
          background: 'var(--surface-1)',
          borderTop: '1px solid var(--border-strong)',
          borderRadius: 'var(--r-2xl) var(--r-2xl) 0 0',
          padding: '14px 18px 24px',
          boxShadow: 'var(--shadow-pop)',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform var(--dur-base) var(--ease)',
          ...style,
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 'var(--r-pill)',
            background: 'var(--border-strong)',
            margin: '0 auto 16px',
          }}
        />
        {title && (
          <div
            style={{
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--ls-display)',
              fontSize: 'var(--fs-display-s)',
              color: 'var(--text-primary)',
              marginBottom: 10,
            }}
          >
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
