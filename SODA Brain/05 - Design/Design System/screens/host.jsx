/* ============================================================
   New Screens · Host Access
   4 · EventModeControl       — Full / Simple toggle (host setup section)
   5 · HostSignIn             — known host logs in
   6 · HostAccountSetup       — new host / invite acceptance
   7 · CollaboratorManagement — Owner manages who can run the event
   ============================================================ */
const { Button: HButton, Input: HInput, CodeInput: HCode, SegmentedToggle, RolePill, Avatar: HAvatar,
  Display: HDisplay, MonoLabel: HMono, SodaMark: HSoda } = window;

/* centered column helper for tablet screens */
function TabletColumn({ children, max = 420 }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 40px', minHeight: 0 }}>
      <div style={{ width: '100%', maxWidth: max, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

/* 4 · Event Mode control */
const MODE_COPY = {
  full: 'Guests get the full night — they scan in, build a profile, and the live acts (the Drop, the Chance, the Nudge) fire in the room.',
  simple: 'Guests scan in, build a quick profile, and scan again for the survey. The live acts stay off.',
};
function EventModeControl() {
  const [mode, setMode] = React.useState('simple');
  return (
    <div style={{ maxWidth: 560 }}>
      <HMono style={{ marginBottom: 12 }}>Event Mode</HMono>
      <SegmentedToggle
        value={mode}
        onChange={setMode}
        options={[
          { value: 'full', label: 'Full', subtitle: 'The whole experience' },
          { value: 'simple', label: 'Simple', subtitle: 'Entry and survey only' },
        ]}
      />
      <p style={{ fontWeight: 300, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.55, margin: '18px 0 16px', maxWidth: 480 }}>
        {MODE_COPY[mode]}
      </p>
      <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)',
        fontSize: 13, color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
        Adjust individual acts
      </button>
    </div>
  );
}

/* 5 · Host Sign-In */
function HostSignIn({ onContinue }) {
  const [code, setCode] = React.useState('');
  return (
    <TabletColumn>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 30 }}>
        <HSoda />
        <div style={{ height: 18 }} />
        <HDisplay size={28}>Host sign-in</HDisplay>
        <p style={{ fontWeight: 300, fontSize: 15, color: 'var(--text-primary)', marginTop: 12 }}>Sign in to run your events.</p>
      </div>
      <HInput label="Email" type="email" defaultValue="nicole@futureland.com" />
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Code</div>
        <CodeRowCentered><HCode length={6} value={code} onChange={setCode} /></CodeRowCentered>
      </div>
      <div style={{ height: 22 }} />
      <HButton block size="lg" onClick={onContinue}>CONTINUE</HButton>
      <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 300, color: 'var(--text-muted)', marginTop: 18, lineHeight: 1.5 }}>
        Hosts are added by invite. Need access? Contact your event owner.
      </p>
    </TabletColumn>
  );
}
function CodeRowCentered({ children }) {
  return <div style={{ display: 'flex', justifyContent: 'flex-start' }}>{children}</div>;
}

/* 6 · Host Account & Invite Setup */
function HostAccountSetup({ onCreate }) {
  return (
    <TabletColumn>
      <HDisplay size={26}>Set up your<br />host account</HDisplay>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.5px', color: 'var(--text-muted)', margin: '12px 0 26px' }}>
        Added by Futureland as an Owner.
      </p>
      <HInput label="Name" defaultValue="Nicole Adams" />
      <HInput label="Email" type="email" defaultValue="nicole@futureland.com" />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Role</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RolePill tone="granted">Owner</RolePill>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 300 }}>Granted by invite</span>
        </div>
      </div>
      <HButton block size="lg" onClick={onCreate}>CREATE ACCOUNT</HButton>
    </TabletColumn>
  );
}

/* 7 · Collaborator Management */
const TEAM = [
  { name: 'Nicole Adams', role: 'owner', you: true },
  { name: 'Marcus Webb', role: 'collaborator' },
  { name: 'Simone Ford', role: 'collaborator' },
];
function CollaboratorManagement() {
  return (
    <div style={{ maxWidth: 560 }}>
      <HMono style={{ marginBottom: 14 }}>Who can run this event</HMono>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {TEAM.map((p) => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'var(--surface-1)',
            border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px 14px' }}>
            <HAvatar name={p.name} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                {p.name}{p.you && <span style={{ fontSize: 12, fontWeight: 300, color: 'var(--text-muted)', marginLeft: 8 }}>(you)</span>}
              </div>
            </div>
            <RolePill tone={p.role === 'owner' ? 'owner' : 'collaborator'}>{p.role === 'owner' ? 'Owner' : 'Collaborator'}</RolePill>
          </div>
        ))}
      </div>
      <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'var(--surface-1)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 'var(--r-md)',
        padding: '14px 16px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600 }}>
        <span style={{ fontSize: '1.1em', lineHeight: 1 }}>＋</span> Add a collaborator
      </button>
    </div>
  );
}

Object.assign(window, { TabletColumn, EventModeControl, HostSignIn, HostAccountSetup, CollaboratorManagement });
