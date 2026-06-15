/* ============================================================
   SODA Admin Panel — host back office. Shell, shared bits, seed.
   Self-contained; same styles.css tokens.
   ============================================================ */
const A_PAL=['var(--av-1)','var(--av-2)','var(--av-3)','var(--av-4)','var(--av-5)','var(--av-6)','var(--av-7)','var(--av-8)'];
function aInit(n){return (n||'').trim().split(/\s+/).map(w=>w[0]||'').join('').slice(0,2).toUpperCase();}
function aColor(n){let h=0;for(let i=0;i<(n||'').length;i++)h=(h*31+n.charCodeAt(i))>>>0;return A_PAL[h%A_PAL.length];}
function AAvatar({name,size=36,style}){return <div style={{flex:'0 0 auto',width:size,height:size,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-sans)',fontWeight:700,fontSize:Math.round(size*0.38),color:'#fff',background:aColor(name),...(style||{})}}>{aInit(name)}</div>;}
function AMono({children,style}){return <span style={{fontFamily:'var(--font-mono)',...(style||{})}}>{children}</span>;}

function APanel({title,right,children,style}){
  return (
    <div style={{background:'var(--surface-1)',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',padding:'20px 22px',...(style||{})}}>
      {(title||right)&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <AMono style={{fontSize:11,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)'}}>{title}</AMono>{right}</div>}
      {children}
    </div>
  );
}
function AButton({children,variant='primary',onClick,disabled,icon,size='md',style}){
  const v={primary:{background:'var(--accent)',color:'var(--on-accent)',border:'1px solid var(--accent)'},
    ghost:{background:'var(--surface-2)',color:'var(--text-secondary)',border:'1px solid var(--border-strong)'},
    danger:{background:'var(--danger-soft)',color:'var(--danger)',border:'1px solid var(--danger)'},
    purple:{background:'var(--private-soft)',color:'var(--private)',border:'1px solid var(--private-border)'}}[variant];
  const sz={sm:{padding:'7px 12px',fontSize:13},md:{padding:'11px 16px',fontSize:14,minWidth:170}}[size];
  // minWidth 170 on md: reconciled from the root-file edit that forced
  // width 170 on every button. Min, not fixed, so long labels still fit.
  return <button onClick={disabled?undefined:onClick} disabled={disabled} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:'var(--font-sans)',fontWeight:600,borderRadius:'var(--r-md)',cursor:disabled?'default':'pointer',opacity:disabled?.5:1,...sz,...v,...(style||{})}}>{icon&&<span aria-hidden="true">{icon}</span>}{children}</button>;
}
function AField({label,children}){
  return <div style={{marginBottom:15}}>
    <AMono style={{fontSize:10,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:6}}>{label}</AMono>
    {children}
  </div>;
}
const aInput={width:'100%',background:'var(--surface-2)',border:'1px solid var(--border-strong)',borderRadius:'var(--r-sm)',padding:'11px 13px',color:'var(--text-primary)',fontFamily:'var(--font-sans)',fontSize:14,outline:'none'};

const A_ROOM=[
  {name:'Jordan Blake',role:'Investor'},{name:'Priya Nair',role:'Designer'},{name:'Marcus Webb',role:'Engineer'},
  {name:'Tasha Boyd',role:'Founder'},{name:'Devon Carter',role:'Operator'},{name:'Ana Reyes',role:'Product'},
];
const A_CHIPS=[
  {text:'Ghostwriting',by:'Iris Chen'},{text:'Fractional CFO',by:'Drew Ellis'},
  {text:'Community building',by:'Simone Ford'},{text:'Hardware',by:'Leo Kim'},
];
const A_MATCHES=[
  {a:'Tasha Boyd',b:'Drew Ellis',mutual:true,why:'pre-seed × capital'},
  {a:'Marcus Webb',b:'Noah Pratt',mutual:false,why:'engineer × hiring'},
  {a:'Ana Reyes',b:'Leo Kim',mutual:true,why:'infra × mentorship'},
];

/* ============================================================
   Lifecycle: Draft → Live → Closed, with a Cancelled escape hatch.
   PHASE_META drives pill + banner color/copy. The seam exposes the
   Go-live, End, and Cancel actions; ending or cancelling a LIVE event
   routes through a confirmation dialog.
   ============================================================ */
const PHASE_META={
  draft:    {label:'Draft',     color:'var(--pending)',        soft:'rgba(255,210,63,.1)'},
  live:     {label:'Live',      color:'var(--accent)',         soft:'var(--accent-soft)'},
  closed:   {label:'Closed',    color:'var(--text-secondary)', soft:'var(--surface-2)'},
  cancelled:{label:'Cancelled', color:'var(--danger)',         soft:'var(--danger-soft)'},
};

/* Pill row — shows Draft · Live · (Closed|Cancelled). The third slot
   becomes a red "Cancelled" pill when the event was called off. */
function PhasePills({phase}){
  const third = phase==='cancelled' ? 'cancelled' : 'closed';
  const seq=['draft','live',third];
  return (
    <div style={{display:'flex',gap:6}}>
      {seq.map(k=>{
        const on=phase===k, m=PHASE_META[k];
        return (
          <span key={k} style={{display:'inline-flex',alignItems:'center',gap:7,padding:'7px 13px',borderRadius:'var(--r-pill)',
            fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'1.5px',textTransform:'uppercase',
            border:`1px solid ${on?m.color:'var(--border)'}`,color:on?m.color:'var(--text-faint)',background:on?m.soft:'transparent'}}>
            {on&&<span style={{width:6,height:6,borderRadius:'50%',background:'currentColor'}}/>}{m.label}
          </span>
        );
      })}
    </div>
  );
}

/* Confirmation dialog for ending or cancelling a live event. */
function EndEventDialog({open,onEnd,onCancel,onClose}){
  const [confirmCancel,setConfirmCancel]=React.useState(false);
  React.useEffect(()=>{ if(!open) setConfirmCancel(false); },[open]);
  if(!open) return null;
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.66)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:18}}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:440,background:'var(--surface-1)',border:'1px solid var(--border-strong)',
        borderRadius:'var(--r-2xl)',padding:'22px 22px 20px',boxShadow:'var(--shadow-pop)'}}>
        <AMono style={{fontSize:11,letterSpacing:'2px',textTransform:'uppercase',color:'var(--text-muted)'}}>Wrap the night</AMono>
        <div style={{fontFamily:'var(--font-display)',textTransform:'uppercase',letterSpacing:'-.01em',fontSize:22,color:'var(--text-primary)',marginTop:8}}>How do you want to end?</div>

        {/* End the night — graceful */}
        <div style={{background:'var(--surface-green)',borderRadius:'var(--r-lg)',padding:'15px 16px',marginTop:18}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'1px',textTransform:'uppercase',color:'var(--accent-bright)',marginBottom:7}}>End the night · standard</div>
          <p style={{fontSize:13.5,color:'var(--text-primary)',fontWeight:300,lineHeight:1.45,marginBottom:13}}>
            Push the final survey, send everyone their recap, and turn the room read-only. The connections stay in the record.
          </p>
          <AButton onClick={onEnd}>End the night</AButton>
        </div>

        {/* Cancel — destructive */}
        <div style={{background:'var(--danger-soft)',border:'1px solid var(--danger)',borderRadius:'var(--r-lg)',padding:'15px 16px',marginTop:12}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'1px',textTransform:'uppercase',color:'var(--danger)',marginBottom:7}}>Cancel the event · can't be undone</div>
          <p style={{fontSize:13.5,color:'var(--text-primary)',fontWeight:300,lineHeight:1.45,marginBottom:13}}>
            Call it off. Attendees are told it's cancelled, no recap goes out, and the night is not counted. Use only if the event didn't happen.
          </p>
          {!confirmCancel
            ? <AButton variant="danger" onClick={()=>setConfirmCancel(true)}>Cancel event</AButton>
            : <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                <span style={{fontSize:13,color:'var(--danger)',fontWeight:600}}>Cancel for real?</span>
                <AButton variant="danger" onClick={onCancel}>Yes, cancel it</AButton>
                <AButton variant="ghost" size="sm" onClick={()=>setConfirmCancel(false)}>No</AButton>
              </div>}
        </div>

        <div style={{marginTop:16,textAlign:'center'}}>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-muted)'}}>Keep it running</button>
        </div>
      </div>
    </div>
  );
}

/* The lifecycle seam shown at the foot of every Admin view. Owns the
   dialog and the closed / cancelled state banners. layout: 'desktop'|'mobile'. */
function LifecycleSeam({phase,setPhase,flash,layout='desktop'}){
  const [dialog,setDialog]=React.useState(false);
  const m=PHASE_META[phase];
  const horiz = layout==='desktop';

  const COPY={
    draft:    'Identity is open. Go live to activate the QR and unlock the acts.',
    live:     'The night is running. End it to send recaps, or cancel if it never happened.',
    closed:   'The night is a record. Recaps were sent. Review matches and export the data.',
    cancelled:'This event was cancelled. Attendees were notified and no recap was sent.',
  };

  const action = (()=>{
    if(phase==='draft') return <AButton icon="◉" onClick={()=>{setPhase('live');flash('Event is live · QR active');}}>Go live</AButton>;
    if(phase==='live')  return <AButton variant="danger" icon="⏻" onClick={()=>setDialog(true)}>End or cancel…</AButton>;
    return <AButton variant="ghost" onClick={()=>{setPhase('draft');flash('Reopened as draft');}}>Reopen as draft</AButton>;
  })();

  return (
    <div style={{background:'var(--surface-1)',border:`1px ${phase==='closed'||phase==='cancelled'?'solid':'dashed'} ${phase==='cancelled'?'var(--danger)':'var(--border-strong)'}`,
      borderRadius:'var(--r-xl)',padding:'16px 20px',display:'flex',flexDirection:horiz?'row':'column',alignItems:horiz?'center':'stretch',gap:12}}>
      <div style={{flex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:5}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)'}}>Lifecycle</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'1.5px',textTransform:'uppercase',
            color:m.color,padding:'3px 9px',borderRadius:'var(--r-pill)',background:m.soft,border:`1px solid ${m.color}`}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'currentColor'}}/>{m.label}
          </span>
        </div>
        <div style={{fontSize:14,color:'var(--text-primary)',fontWeight:300,lineHeight:1.4}}>{COPY[phase]}</div>
        {phase==='cancelled'&&<div style={{fontSize:12,color:'var(--danger)',marginTop:6}}>Reopen as a draft to run it again.</div>}
      </div>
      {action}
      <EndEventDialog open={dialog}
        onEnd={()=>{setDialog(false);setPhase('closed');flash('Event ended · recaps sent');}}
        onCancel={()=>{setDialog(false);setPhase('cancelled');flash('Event cancelled · attendees notified');}}
        onClose={()=>setDialog(false)}/>
    </div>
  );
}

Object.assign(window,{A_PAL,aInit,aColor,AAvatar,AMono,APanel,AButton,AField,aInput,A_ROOM,A_CHIPS,A_MATCHES,PHASE_META,PhasePills,LifecycleSeam});
