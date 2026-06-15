/* ============================================================
   Attendee — Onboarding spine: Welcome, Recognition, Sign-In,
   Code, Photo, and the three chip steps (Role / Offer / Need).
   ============================================================ */

const HOST = 'Futureland';
const EVENT = 'Creative Meetup';

/* 1 · Welcome (new guest) */
function Welcome({onBegin}){
  return (
    <CenterScreen>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:0,textAlign:'center'}}>
        <HostMark host={HOST} sub={EVENT} size={26}/>
        <div style={{height:34}}/>
        <Display size={34} style={{maxWidth:280}}>You made it in</Display>
        <p style={{fontWeight:300,fontSize:15,color:'var(--text-secondary)',marginTop:14,maxWidth:260}}>
          Ninety seconds to build your card, then you are in the room with everyone here tonight.
        </p>
      </div>
      <KButton block size="lg" onClick={onBegin}>Begin</KButton>
      <div style={{textAlign:'center',marginTop:14,fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'1.5px',color:'var(--text-faint)',textTransform:'uppercase'}}>
        SODA ✦ powered by Equalpoint
      </div>
    </CenterScreen>
  );
}

/* 1b · Returning Guest Recognition */
function Recognition({onEnter}){
  return (
    <CenterScreen>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
        <Eyebrow>Welcome back</Eyebrow>
        <div style={{height:20}}/>
        <KAvatar name="Maya Chen" size={88}/>
        <div style={{height:18}}/>
        <Display size={28}>Good to see you,<br/>Maya</Display>
        <p style={{fontWeight:300,fontSize:15,color:'var(--text-secondary)',marginTop:14,maxWidth:280}}>
          This is your <b style={{color:'#fff',fontWeight:600}}>third event</b>. You have made <b style={{color:'#fff',fontWeight:600}}>seven connections</b> so far.
        </p>
      </div>
      <KButton block size="lg" onClick={onEnter}>Enter the room</KButton>
    </CenterScreen>
  );
}

/* 2 · Sign-In — email code plus social, per SODA-025 and SODA-033.
   No phone field: SODA collects no phone number, ever. */
/* Neutral monograms for the social options, not official logo assets. */
function GoogleMark(){
  return (
    <span aria-hidden="true" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:18,height:18,borderRadius:'50%',
      background:'#fff',color:'#1a1a1a',fontFamily:'var(--font-display)',fontSize:11,lineHeight:1}}>G</span>
  );
}
function AppleMark(){
  return (
    <span aria-hidden="true" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:18,height:18,borderRadius:'50%',
      background:'#fff',color:'#1a1a1a',fontSize:12,lineHeight:1,paddingBottom:1}}></span>
  );
}
function LinkedInMark(){
  return (
    <span aria-hidden="true" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:18,height:18,borderRadius:4,
      background:'#fff',color:'#1a1a1a',fontFamily:'var(--font-sans)',fontWeight:700,fontSize:10,lineHeight:1}}>in</span>
  );
}

function SignIn({onVerified}){
  const [stage,setStage]=React.useState('entry'); // entry | code
  const [email,setEmail]=React.useState('');
  const [code,setCode]=React.useState('');
  const [err,setErr]=React.useState(false);
  const [sending,setSending]=React.useState(false);

  const target = email||'maya@futureland.com';
  const sendCode=()=>{setSending(true);setTimeout(()=>{setSending(false);setStage('code');},650);};
  const cells=Array.from({length:6});
  const onCode=(v)=>{const n=v.replace(/\D/g,'').slice(0,6);setCode(n);setErr(false);
    if(n.length===6){ if(n==='417203'){setTimeout(onVerified,300);} else {setTimeout(()=>setErr(true),200);} }};

  return (
    <CenterScreen>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <Eyebrow style={{textAlign:'center'}}>{stage==='entry'?'Sign in':'Check your email'}</Eyebrow>
        <div style={{height:18}}/>
        {stage==='entry'?(
          <>
            <Display size={24} style={{textAlign:'center'}}>Who's here?</Display>
            <p style={{textAlign:'center',fontWeight:300,fontSize:14,color:'var(--text-muted)',margin:'10px 0 22px'}}>
              No password. We email a six-digit code.
            </p>
            <label style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:6,display:'block'}}>Name</label>
            <input defaultValue="Maya Chen" style={inStyle}/>
            <div style={{height:16}}/>
            <label style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:6,display:'block'}}>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} inputMode="email" placeholder="you@email.com" style={inStyle}/>
            {/* divider */}
            <div style={{display:'flex',alignItems:'center',gap:12,margin:'20px 0'}}>
              <div style={{flex:1,height:1,background:'var(--border)'}}/>
              <span style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-faint)'}}>or</span>
              <div style={{flex:1,height:1,background:'var(--border)'}}/>
            </div>
            <div style={{display:'flex',gap:9}}>
              {[['Google',<GoogleMark key="g"/>],['Apple',<AppleMark key="a"/>],['LinkedIn',<LinkedInMark key="l"/>]].map(([lb,mark])=>(
                <KButton key={lb} variant="ghost" icon={mark} onClick={onVerified} style={{flex:1,paddingLeft:8,paddingRight:8}}>{lb}</KButton>
              ))}
            </div>
          </>
        ):(
          <>
            <Display size={24} style={{textAlign:'center'}}>Enter the code</Display>
            <p style={{textAlign:'center',fontWeight:300,fontSize:14,color:'var(--text-muted)',margin:'10px 0 24px'}}>
              Sent to {target}. <span style={{color:'var(--text-faint)'}}>(try 417203)</span>
            </p>
            <div style={{position:'relative'}}>
              <input value={code} onChange={e=>onCode(e.target.value)} inputMode="numeric" autoFocus aria-label="Six-digit code"
                style={{position:'absolute',opacity:0,inset:0,width:'100%',height:'100%'}}/>
              <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                {cells.map((_,i)=>{
                  const active=i===Math.min(code.length,5)&&code.length<6;
                  return <div key={i} style={{width:44,height:56,display:'flex',alignItems:'center',justifyContent:'center',
                    background:'var(--surface-1)',borderRadius:'var(--r-md)',fontFamily:'var(--font-mono)',fontSize:24,color:'var(--text-primary)',
                    border:`1px solid ${err?'var(--danger)':active?'var(--accent)':'var(--border-strong)'}`}}>{code[i]||''}</div>;
                })}
              </div>
            </div>
            {err&&<p style={{color:'var(--danger)',fontSize:13,textAlign:'center',marginTop:14}}>That code did not match. Check your email or resend.</p>}
          </>
        )}
      </div>
      {stage==='entry'
        ? <KButton block size="lg" disabled={sending||!email} onClick={sendCode}>{sending?'Sending your code…':'Email me a code'}</KButton>
        : <KButton block variant="ghost" onClick={()=>{setErr(false);setCode('');}}>Resend code</KButton>}
    </CenterScreen>
  );
}
const inStyle={width:'100%',background:'var(--surface-1)',border:'1px solid var(--border-strong)',borderRadius:'var(--r-sm)',
  padding:'12px 13px',color:'var(--text-primary)',fontFamily:'var(--font-sans)',fontSize:15,outline:'none'};

/* 3 · Photo */
function Photo({onNext}){
  const [uploaded,setUploaded]=React.useState(false);
  return (
    <CenterScreen>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
        <Eyebrow>Your card</Eyebrow>
        <div style={{height:24}}/>
        <button onClick={()=>setUploaded(true)} aria-label={uploaded?'Change photo':'Add a photo'}
          style={{cursor:'pointer',position:'relative',background:'none',border:'none',padding:0,borderRadius:'50%'}}>
          {uploaded
            ? <KAvatar name="Maya Chen" size={120}/>
            : <div style={{width:120,height:120,borderRadius:'50%',border:'2px dashed var(--border-strong)',display:'flex',
                alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:30}}>＋</div>}
        </button>
        <Display size={22} style={{marginTop:24}}>Add a photo</Display>
        <p style={{fontWeight:300,fontSize:14,color:'var(--text-muted)',marginTop:10,maxWidth:260}}>
          {uploaded?'Looking good. Or skip — your initials work too.':'Optional. Skip and we use your initials.'}
        </p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <KButton block size="lg" onClick={onNext}>{uploaded?'Use this photo':'Add a photo'}</KButton>
        <KButton block variant="ghost" onClick={onNext}>Skip for now</KButton>
      </div>
    </CenterScreen>
  );
}

/* 4 · Chip step (reused for Role / Offer / Need) */
function ChipStep({step,title,sub,options,multi,value,setValue,onNext,max=3}){
  const atCap = multi && value.length>=max;
  const toggle=(o)=>{
    if(multi){
      if(value.includes(o)) setValue(value.filter(x=>x!==o));
      else if(value.length<max) setValue([...value,o]);
    } else { setValue([o]); }
  };
  const count=value.length;
  return (
    <ScreenBody style={{display:'flex',flexDirection:'column',padding:'24px 20px 20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
        <Eyebrow>{`Step ${step} of 3`}</Eyebrow>
        {multi&&<MonoLabel style={{color:count>0?'var(--accent)':'var(--text-muted)'}}>{count} of {max}</MonoLabel>}
      </div>
      <Display size={24} style={{marginBottom:8}}>{title}</Display>
      <p style={{fontWeight:300,fontSize:14,color:'var(--text-muted)',marginBottom:20}}>
        {sub}{multi?` Pick up to ${max}.`:''}
      </p>
      <div style={{display:'flex',flexWrap:'wrap',gap:9,flex:1,alignContent:'flex-start'}}>
        {options.map(o=>{
          const sel=value.includes(o);
          const locked=atCap&&!sel;
          return (
            <KChip key={o} selected={sel} onClick={()=>toggle(o)}
              style={locked?{opacity:.4,cursor:'default'}:undefined}>{o}</KChip>
          );
        })}
        <KChip writeIn style={atCap?{opacity:.4,cursor:'default'}:undefined}>Add your own</KChip>
      </div>
      <KButton block size="lg" disabled={count===0} onClick={onNext} style={{marginTop:18}}>
        {step<3?'Continue':'Enter the room'}
      </KButton>
    </ScreenBody>
  );
}

Object.assign(window,{HOST,EVENT,Welcome,Recognition,SignIn,Photo,ChipStep});
