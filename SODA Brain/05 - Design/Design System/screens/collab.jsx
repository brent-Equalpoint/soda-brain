/* ============================================================
   New Screens · Collaborator Onboarding
   8  · CollaboratorWelcome  — welcomed to a specific event
   9  · CollaboratorTutorial — short skippable carousel
   10 · HostWelcomeBack      — returning Owner/Collaborator, routed
   ============================================================ */
const { Button: CButton, RolePill: CRole, EventRow, Carousel,
  CenterScreen: CCenter, Display: CDisplay, HostMark: CHostMark, SodaMark: CSoda, IllosTile } = window;

/* 8 · The Collaborator Welcome */
function CollaboratorWelcome({ onShow, onSkip }) {
  return (
    <CCenter>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
        <CHostMark host="Futureland" size={20} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <CDisplay size={32}>Welcome,<br />Nicole</CDisplay>
        <p style={{ fontWeight: 300, fontSize: 15, color: 'var(--text-primary)', marginTop: 16, maxWidth: 280 }}>
          Future added you to help run <b style={{ fontWeight: 600 }}>Creative Meetup</b>.
        </p>
        <div style={{ marginTop: 18 }}><CRole tone="granted">Collaborator</CRole></div>
        <p style={{ fontWeight: 300, fontSize: 13, color: 'var(--text-muted)', marginTop: 14, maxWidth: 260, lineHeight: 1.5 }}>
          You can run the night. The owner keeps the guest data.
        </p>
      </div>
      <CButton block size="lg" onClick={onShow}>SHOW ME AROUND</CButton>
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <button onClick={onSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', padding: 0 }}>Skip</button>
      </div>
    </CCenter>
  );
}

/* 9 · The Collaborator Tutorial (carousel) */
const TUT_CARDS = [
  { kind: 'fire', title: 'How a moment fires', body: 'The owner fires a moment like the Drop. You will see it land here.' },
  { kind: 'see', title: 'What you see live', body: 'Scans, responses, and pairs update in real time on the Command Center.' },
  { kind: 'data', title: 'The owner keeps the data', body: 'You run the night; the guest contacts stay with the event owner.' },
];
function TutorialCardBody({ card }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <IllosTile kind={card.kind} />
      <CDisplay size={22} style={{ marginBottom: 10 }}>{card.title}</CDisplay>
      <p style={{ fontWeight: 300, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>{card.body}</p>
    </div>
  );
}
function CollaboratorTutorial({ onDone, onSkip }) {
  return (
    <CCenter>
      <Carousel
        cards={TUT_CARDS.map((c, i) => <TutorialCardBody key={i} card={c} />)}
        onDone={onDone}
        onSkip={onSkip}
        renderButton={({ next, label }) => (
          <CButton block size="lg" onClick={next}>{label.toUpperCase()}</CButton>
        )}
      />
    </CCenter>
  );
}

/* 10 · The Host Welcome-Back */
const HOST_EVENTS = [
  { host: 'Futureland', name: 'Creative Meetup', live: true },
  { host: 'Black Tech Week', name: 'BTW Activation', status: 'Sat, Jun 14' },
  { host: 'Equalpoint', name: 'Founder Mixer', status: 'Draft' },
];
function HostWelcomeBack({ onEnter }) {
  const hasLive = HOST_EVENTS.some((e) => e.live);
  return (
    <CCenter>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}><CSoda /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <CDisplay size={30} style={{ textAlign: 'center', marginBottom: 22 }}>Welcome back,<br />Nicole</CDisplay>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HOST_EVENTS.map((e) => (
            <EventRow key={e.name} host={e.host} name={e.name} live={e.live} status={e.status} />
          ))}
        </div>
      </div>
      <CButton block size="lg" onClick={onEnter}>{hasLive ? 'ENTER THE COMMAND CENTER' : 'OPEN YOUR EVENT'}</CButton>
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          fontSize: 13, color: 'var(--text-muted)', padding: 0 }}>See all events</button>
      </div>
    </CCenter>
  );
}

Object.assign(window, { CollaboratorWelcome, CollaboratorTutorial, HostWelcomeBack });
