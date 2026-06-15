/* ============================================================
   New Screens · Access & Sessions
   1 · CodeHelp        — sign-in code, help state (code not arriving)
   2 · WelcomeBack     — returning person, expired session re-auth
   3 · AddToHome       — add-to-home-screen bottom sheet
   Each returns the inner screen content; a frame wraps it.
   ============================================================ */
const { Button, CodeInput, ResendControl, BottomSheet,
  CenterScreen, Display, Eyebrow, HostMark, SodaMark } = window;

function LinkBtn({ children, onClick, color = 'var(--accent)', size = 14, style }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      fontFamily: 'var(--font-sans)', fontSize: size, fontWeight: 600, color, ...(style || {}) }}>{children}</button>
  );
}

/* 1 · The code-not-arriving help state */
function CodeHelp() {
  const [code, setCode] = React.useState('');
  return (
    <CenterScreen pad="18px 16px 22px">
      {/* slim top line: email + edit */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>maya@futureland.com</span>
        <LinkBtn size={13}>Edit</LinkBtn>
      </div>

      {/* center: code + calm line + resend */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CodeInput length={6} value={code} onChange={setCode} />
        <p style={{ fontWeight: 300, fontSize: 15, color: 'var(--text-primary)', textAlign: 'center', margin: '20px 0 6px', maxWidth: 260, lineHeight: 1.5 }}>
          It can take a moment. Check your spam folder too.
        </p>
        <ResendControl seconds={20} />
      </div>

      {/* bottom quiet line */}
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', fontWeight: 300, maxWidth: 280, margin: '0 auto' }}>
        At the event? Ask the host to check you in.
      </p>
    </CenterScreen>
  );
}

/* 2 · The welcome-back re-authentication */
function WelcomeBack({ live = true, onContinue }) {
  const [code, setCode] = React.useState('');
  return (
    <CenterScreen>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
        {live ? <HostMark host="Futureland" sub="Creative Meetup" size={20} /> : <SodaMark />}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Display size={30} style={{ maxWidth: 300 }}>Welcome back,<br />Maya</Display>
        <p style={{ fontWeight: 300, fontSize: 15, color: 'var(--text-primary)', marginTop: 14, maxWidth: 270 }}>
          Confirm it is you to pick up where you left off.
        </p>
        <div style={{ height: 26 }} />
        <CodeInput length={6} value={code} onChange={setCode} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.5px', color: 'var(--text-muted)', marginTop: 16 }}>
          Code sent to maya@futureland.com
        </p>
      </div>
      <Button block size="lg" onClick={onContinue}>CONTINUE</Button>
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <LinkBtn color="var(--text-muted)">Use a different email</LinkBtn>
      </div>
    </CenterScreen>
  );
}

/* 3 · The add-to-home-screen prompt (bottom sheet over a dimmed screen) */
function AddToHome({ open = true, onClose }) {
  return (
    <React.Fragment>
      {/* dimmed home behind — a faint hint of the contacts list */}
      <div style={{ flex: 1, padding: '18px 16px', opacity: 0.5, filter: 'blur(0.5px)', pointerEvents: 'none' }}>
        <Eyebrow>Your contacts</Eyebrow>
        <div style={{ height: 16 }} />
        {['Jordan Blake', 'Priya Nair', 'Marcus Webb', 'Tasha Boyd', 'Devon Carter'].map((n) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-2)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 11, width: '46%', background: 'var(--surface-2)', borderRadius: 4 }} />
              <div style={{ height: 9, width: '30%', background: 'var(--surface-1)', borderRadius: 4, marginTop: 7 }} />
            </div>
          </div>
        ))}
      </div>

      <BottomSheet open={open} onClose={onClose} title="Keep SODA handy">
        <p style={{ fontWeight: 300, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.5, marginTop: 0, marginBottom: 18, maxWidth: 300 }}>
          Add it to your home screen so your contacts are one tap away.
        </p>
        <Button block size="lg" onClick={onClose}>ADD TO HOME SCREEN</Button>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <LinkBtn color="var(--text-muted)" onClick={onClose}>Maybe later</LinkBtn>
        </div>
      </BottomSheet>
    </React.Fragment>
  );
}

Object.assign(window, { LinkBtn, CodeHelp, WelcomeBack, AddToHome });
