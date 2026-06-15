/* ============================================================
   SODA — New Screens · shared frames & primitives
   Local scaffolding for the 10 new screens. Device frames (phone,
   tablet, admin shell) and display-type primitives mirror the SODA
   attendee/admin kits so the screens render standalone. Product
   patterns (Button, CodeInput, SegmentedToggle, RolePill, EventRow,
   BottomSheet, Carousel, …) come from the compiled DS bundle.
   Exports to window for sibling babel files.
   ============================================================ */

/* ---- Display-type primitives ---- */
function Display({ children, size = 26, style }) {
  return (
    <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 'var(--ls-display)',
      lineHeight: 1.02, color: 'var(--text-primary)', fontSize: size, ...(style || {}) }}>{children}</div>
  );
}
function Eyebrow({ children, color = 'var(--accent)', style }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
      color, ...(style || {}) }}>{children}</div>
  );
}
function MonoLabel({ children, color = 'var(--text-muted)', style }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
      color, ...(style || {}) }}>{children}</div>
  );
}

/* ---- The quiet SODA mark ---- */
function SodaMark({ size = 18 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-display)',
      textTransform: 'uppercase', letterSpacing: 'var(--ls-display)', fontSize: size, color: 'var(--text-secondary)' }}>
      SODA <span style={{ color: 'var(--accent)' }}>✦</span>
    </div>
  );
}

/* ---- Host identity block (typed name / wordmark) ---- */
function HostMark({ host, sub, size = 22 }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 'var(--ls-display)',
        fontSize: size, color: 'var(--text-primary)' }}>{host}</div>
      {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
        color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

/* ---- Footer wordmark line ---- */
function Footer() {
  return (
    <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '1.5px',
      color: 'var(--text-faint)', textTransform: 'uppercase' }}>SODA ✦ powered by Equalpoint</div>
  );
}

/* ---- Phone frame: 380×780 device, flex column ---- */
function PhoneFrame({ children, statusHost }) {
  return (
    <div style={{ width: 380, maxWidth: '100%', background: '#000', border: '9px solid #1c1d1c', borderRadius: 'var(--r-device)',
      overflow: 'hidden', boxShadow: 'var(--shadow-device)', position: 'relative' }}>
      <div style={{ background: 'var(--bg-canvas)', height: 780, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: '0 0 auto', height: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          <span>9:41</span>
          <span style={{ fontSize: 9, letterSpacing: '1px' }}>{statusHost || ''}</span>
          <span>● ● ●</span>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---- Tablet frame: portrait device for sturdier host screens ---- */
function TabletFrame({ children, statusHost, height = 840 }) {
  return (
    <div style={{ width: 620, maxWidth: '100%', background: '#000', border: '12px solid #1c1d1c', borderRadius: 28,
      overflow: 'hidden', boxShadow: 'var(--shadow-device)', position: 'relative' }}>
      <div style={{ background: 'var(--bg-canvas)', height, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: '0 0 auto', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 26px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          <span>9:41</span>
          <span style={{ fontSize: 9, letterSpacing: '1px' }}>{statusHost || ''}</span>
          <span>● ● ●</span>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---- Admin shell: desktop back-office surface (no bezel) ---- */
function AdminShell({ children, event = 'Futureland · Creative Meetup', width = 880, height = 620 }) {
  return (
    <div style={{ width, height, background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
      overflow: 'hidden', boxShadow: 'var(--shadow-pop)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', textTransform: 'uppercase',
          fontSize: 18, color: 'var(--text-primary)', letterSpacing: 'var(--ls-display)' }}>SODA <span style={{ color: 'var(--accent)' }}>✦</span></div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Admin · {event}</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '26px 28px' }}>{children}</div>
    </div>
  );
}

/* ---- Centered mobile screen body ---- */
function CenterScreen({ children, bg = 'var(--bg-canvas)', pad = '24px 22px 28px', style }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: pad, background: bg, minHeight: 0, ...(style || {}) }}>
      {children}
    </div>
  );
}

/* ---- Scrolling screen body ---- */
function ScreenBody({ children, pad = '20px', style }) {
  return <div className="soda-scroll" style={{ flex: 1, overflowY: 'auto', padding: pad, minHeight: 0, ...(style || {}) }}>{children}</div>;
}

/* ---- Simple line illustration tile (for tutorial cards) ---- */
function IllosTile({ kind = 'fire' }) {
  const stroke = 'var(--accent)';
  const dim = 'var(--text-faint)';
  return (
    <div style={{ width: '100%', height: 150, borderRadius: 'var(--r-lg)', background: 'var(--surface-1)',
      border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
      <svg width="160" height="96" viewBox="0 0 160 96" fill="none">
        {kind === 'fire' && (
          <g>
            <circle cx="30" cy="48" r="13" stroke={stroke} strokeWidth="2" />
            <path d="M30 48 L70 30 M30 48 L70 48 M30 48 L70 66" stroke={dim} strokeWidth="1.5" />
            {[30, 48, 66].map((y, n) => (
              <rect key={n} x="72" y={y - 11} width="16" height="22" rx="3" stroke={stroke} strokeWidth="2" />
            ))}
            <path d="M118 30 L118 66" stroke={dim} strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        )}
        {kind === 'see' && (
          <g>
            <rect x="40" y="22" width="80" height="52" rx="6" stroke={stroke} strokeWidth="2" />
            <circle cx="80" cy="48" r="9" stroke={dim} strokeWidth="2" />
            <path d="M62 62 H98" stroke={dim} strokeWidth="1.5" />
          </g>
        )}
        {kind === 'data' && (
          <g>
            <rect x="44" y="20" width="72" height="56" rx="6" stroke={stroke} strokeWidth="2" />
            <path d="M44 38 H116 M70 20 V76" stroke={dim} strokeWidth="1.5" />
            <circle cx="92" cy="56" r="3" fill={stroke} />
          </g>
        )}
      </svg>
    </div>
  );
}

Object.assign(window, {
  Display, Eyebrow, MonoLabel, SodaMark, HostMark, Footer,
  PhoneFrame, TabletFrame, AdminShell, CenterScreen, ScreenBody, IllosTile,
});
