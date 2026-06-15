import React from 'react';

/**
 * SODA SegmentedToggle — a 2–3 option segmented control on a dark track.
 * The selected option fills SODA green with near-black text; the rest
 * stay quiet. Each option may carry a tiny subtitle (e.g. Full / Simple
 * in Event Mode). Controlled: pass `value` + `onChange`.
 */
export function SegmentedToggle({ options = [], value, onChange, style = {} }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: 4,
        background: 'var(--surface-2)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--r-md)',
        padding: 4,
        ...style,
      }}
    >
      {options.map((opt) => {
        const o = typeof opt === 'string' ? { value: opt, label: opt } : opt;
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange && onChange(o.value)}
            style={{
              flex: 1,
              minHeight: o.subtitle ? 'auto' : 36,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: o.subtitle ? '10px 8px' : '9px 8px',
              borderRadius: 'var(--r-sm)',
              border: 'none',
              cursor: 'pointer',
              background: selected ? 'var(--accent)' : 'transparent',
              transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                fontWeight: 'var(--fw-semibold)',
                color: selected ? 'var(--on-accent)' : 'var(--text-secondary)',
              }}
            >
              {o.label}
            </span>
            {o.subtitle && (
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  fontWeight: 'var(--fw-light)',
                  lineHeight: 1.2,
                  color: selected ? 'rgba(17,17,17,0.7)' : 'var(--text-muted)',
                }}
              >
                {o.subtitle}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
