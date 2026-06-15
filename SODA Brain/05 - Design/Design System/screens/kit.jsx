/* ============================================================
   SODA — New Screens · local component kit
   Self-contained mirrors of the SODA product components (same tokens
   as components/*), so the new-screen prototypes render standalone
   without depending on _ds_bundle.js build timing — exactly as the
   attendee kit mirrors its primitives. The canonical, typed versions
   live in components/ for consuming projects. Exports to window.
   ============================================================ */

/* ---- Avatar ---- */
const KIT_PAL = ['var(--av-1)', 'var(--av-2)', 'var(--av-3)', 'var(--av-4)', 'var(--av-5)', 'var(--av-6)', 'var(--av-7)', 'var(--av-8)'];
function kitInitials(n) { return (n || '').trim().split(/\s+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase(); }
function kitColor(n) { let h = 0; for (let i = 0; i < (n || '').length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0; return KIT_PAL[h % KIT_PAL.length]; }
function Avatar({ name = '', src = null, size = 48, color, style = {} }) {
  return (
    <div style={{ flex: '0 0 auto', width: size, height: size, borderRadius: '50%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: Math.round(size * 0.38), color: '#fff',
      background: src ? `center/cover no-repeat url(${src})` : (color || kitColor(name)), overflow: 'hidden', userSelect: 'none', ...style }}>
      {!src && kitInitials(name)}
    </div>
  );
}

/* ---- Button ---- */
function Button({ children, variant = 'primary', size = 'md', block = false, disabled = false, icon = null, style = {}, ...rest }) {
  const sizes = { sm: { padding: '9px 13px', fontSize: 13 }, md: { padding: '14px 16px', fontSize: 15 }, lg: { padding: '16px 18px', fontSize: 16 } };
  const variants = {
    primary: { background: 'var(--accent)', color: 'var(--on-accent)', border: '1px solid var(--accent)' },
    ghost: { background: 'var(--surface-1)', color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' },
    purple: { background: 'var(--private-soft)', color: 'var(--private)', border: '1px solid var(--private-border)' },
    danger: { background: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid var(--danger)' },
  };
  return (
    <button disabled={disabled} style={{ width: block ? '100%' : 'auto', display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontWeight: 600, borderRadius: 'var(--r-md)',
      cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, lineHeight: 1.1,
      transition: 'filter var(--dur-fast) var(--ease)', ...sizes[size], ...variants[variant], ...style }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.filter = 'brightness(0.92)'; }}
      onMouseUp={(e) => { e.currentTarget.style.filter = 'none'; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }} {...rest}>
      {icon && <span aria-hidden="true" style={{ fontSize: '1.05em', lineHeight: 1 }}>{icon}</span>}{children}
    </button>
  );
}

/* ---- Input ---- */
function Input({ label, error, hint, style = {}, id, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  const fieldId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div style={{ marginBottom: 15 }}>
      {label && (
        <label htmlFor={fieldId} style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-micro)',
          letterSpacing: 'var(--ls-tag)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</label>
      )}
      <input id={fieldId} onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
        style={{ width: '100%', background: 'var(--surface-1)', border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--r-sm)', padding: '12px 13px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 15,
          outline: 'none', transition: 'border-color var(--dur-fast) var(--ease)', ...style }} {...rest} />
      {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 7 }}>{error}</div>}
      {!error && hint && <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 7 }}>{hint}</div>}
    </div>
  );
}

/* ---- CodeInput ---- */
function CodeInput({ length = 6, value = '', onChange, error = false }) {
  const cells = Array.from({ length });
  const handle = (e) => { if (!onChange) return; onChange(e.target.value.replace(/\D/g, '').slice(0, length)); };
  const activeIndex = Math.min(value.length, length - 1);
  return (
    <div style={{ position: 'relative' }}>
      <input value={value} onChange={handle} inputMode="numeric" autoComplete="one-time-code"
        style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'text' }} aria-label={`${length}-digit code`} />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {cells.map((_, i) => {
          const filled = i < value.length;
          const isActive = i === activeIndex && value.length < length;
          return (
            <div key={i} style={{ width: 46, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-1)', border: `1px solid ${error ? 'var(--danger)' : isActive ? 'var(--accent)' : 'var(--border-strong)'}`,
              borderRadius: 'var(--r-md)', fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
              {filled ? value[i] : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- SegmentedToggle ---- */
function SegmentedToggle({ options = [], value, onChange, style = {} }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-md)', padding: 4, ...style }}>
      {options.map((opt) => {
        const o = typeof opt === 'string' ? { value: opt, label: opt } : opt;
        const selected = value === o.value;
        return (
          <button key={o.value} role="tab" aria-selected={selected} onClick={() => onChange && onChange(o.value)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              padding: o.subtitle ? '10px 8px' : '9px 8px', borderRadius: 'var(--r-sm)', border: 'none', cursor: 'pointer',
              background: selected ? 'var(--accent)' : 'transparent', transition: 'background var(--dur-fast) var(--ease)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: selected ? 'var(--on-accent)' : 'var(--text-secondary)' }}>{o.label}</span>
            {o.subtitle && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 300, lineHeight: 1.2, color: selected ? 'rgba(17,17,17,0.7)' : 'var(--text-muted)' }}>{o.subtitle}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---- ResendControl ---- */
function ResendControl({ seconds = 20, onResend, label = 'Resend code', style = {} }) {
  const [remaining, setRemaining] = React.useState(seconds);
  React.useEffect(() => {
    if (remaining <= 0) return undefined;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const ready = remaining <= 0;
  const handle = () => { if (!ready) return; if (onResend) onResend(); setRemaining(seconds); };
  return (
    <button onClick={handle} disabled={!ready} style={{ background: 'none', border: 'none', padding: '6px 4px', cursor: ready ? 'pointer' : 'default',
      fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: ready ? 600 : 400, color: ready ? 'var(--accent)' : 'var(--text-muted)',
      transition: 'color var(--dur-fast) var(--ease)', ...style }}>
      {ready ? label : `Resend in ${fmt(remaining)}`}
    </button>
  );
}

/* ---- RolePill ---- */
function RolePill({ children, tone = 'collaborator', style = {} }) {
  const tones = {
    granted: { color: 'var(--on-accent)', background: 'var(--accent)', border: '1px solid var(--accent)' },
    owner: { color: 'var(--accent-bright)', background: 'var(--surface-green)', border: '1px solid transparent' },
    collaborator: { color: 'var(--text-secondary)', background: 'var(--surface-2)', border: '1px solid var(--border-strong)' },
  };
  const t = tones[tone] || tones.collaborator;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-micro)',
      fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 11px', borderRadius: 'var(--r-pill)', whiteSpace: 'nowrap', ...t, ...style }}>
      {children}
    </span>
  );
}

/* ---- EventRow ---- */
function EventRow({ host, name, status = 'Upcoming', live = false, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left',
      background: 'var(--surface-1)', border: `1px solid ${live ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--r-md)',
      padding: '13px 14px', cursor: onClick ? 'pointer' : 'default', transition: 'border-color var(--dur-fast) var(--ease)', ...style }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-nano)', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 5 }}>{host}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
      </div>
      <span style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-micro)',
        letterSpacing: '0.5px', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 'var(--r-pill)',
        color: live ? 'var(--accent)' : 'var(--text-muted)', background: live ? 'var(--accent-soft)' : 'var(--surface-2)' }}>
        {live && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}{live ? 'Live now' : status}
      </span>
    </button>
  );
}

/* ---- BottomSheet ---- */
function BottomSheet({ open = true, onClose, title, children, style = {} }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end',
      background: 'rgba(0,0,0,0.6)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity var(--dur-base) var(--ease)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: 'var(--surface-1)', borderTop: '1px solid var(--border-strong)',
        borderRadius: 'var(--r-2xl) var(--r-2xl) 0 0', padding: '14px 18px 24px', boxShadow: 'var(--shadow-pop)',
        transform: open ? 'translateY(0)' : 'translateY(100%)', transition: 'transform var(--dur-base) var(--ease)', ...style }}>
        <div style={{ width: 40, height: 4, borderRadius: 'var(--r-pill)', background: 'var(--border-strong)', margin: '0 auto 16px' }} />
        {title && <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 'var(--ls-display)',
          fontSize: 'var(--fs-display-s)', color: 'var(--text-primary)', marginBottom: 10 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

/* ---- Carousel ---- */
function Carousel({ cards = [], onDone, onSkip, nextLabel = 'Next', doneLabel = 'Got it', renderButton }) {
  const [i, setI] = React.useState(0);
  const last = i >= cards.length - 1;
  const next = () => (last ? onDone && onDone() : setI((n) => n + 1));
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-label)', letterSpacing: 'var(--ls-tag-wide)', textTransform: 'uppercase', color: 'var(--accent)' }}>{i + 1} of {cards.length}</span>
        <button onClick={onSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', padding: 4 }}>Skip</button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>{cards[i]}</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
        {cards.map((_, n) => (
          <span key={n} style={{ width: n === i ? 18 : 6, height: 6, borderRadius: 'var(--r-pill)', background: n === i ? 'var(--accent)' : 'var(--border-strong)', transition: 'width var(--dur-fast) var(--ease)' }} />
        ))}
      </div>
      {renderButton ? renderButton({ last, next, label: last ? doneLabel : nextLabel }) : null}
    </div>
  );
}

Object.assign(window, {
  Avatar, Button, Input, CodeInput, SegmentedToggle, ResendControl, RolePill, EventRow, BottomSheet, Carousel,
});
