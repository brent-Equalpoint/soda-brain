/* ============================================================
   SODA Command Center — host live cockpit. Shell, seed data, and
   shared bits (stat bar, activity feed, connection badge, toast).
   Self-contained; same styles.css tokens. Exports to window.
   ============================================================ */
const CC_PAL=['var(--av-1)','var(--av-2)','var(--av-3)','var(--av-4)','var(--av-5)','var(--av-6)','var(--av-7)','var(--av-8)'];
function ccInit(n){return (n||'').trim().split(/\s+/).map(w=>w[0]||'').join('').slice(0,2).toUpperCase();}
function ccColor(n){let h=0;for(let i=0;i<(n||'').length;i++)h=(h*31+n.charCodeAt(i))>>>0;return CC_PAL[h%CC_PAL.length];}
function CCAvatar({name,size=40,style}){
  return <div style={{flex:'0 0 auto',width:size,height:size,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
    fontFamily:'var(--font-sans)',fontWeight:700,fontSize:Math.round(size*0.38),color:'#fff',background:ccColor(name),...(style||{})}}>{ccInit(name)}</div>;
}
function Mono({children,style}){return <span style={{fontFamily:'var(--font-mono)',...(style||{})}}>{children}</span>;}

const CC_ROOM=[
  {name:'Jordan Blake',role:'Investor',offer:'Capital',need:'Dealflow'},
  {name:'Priya Nair',role:'Designer',offer:'Feedback',need:'Customers'},
  {name:'Marcus Webb',role:'Engineer',offer:'Hiring',need:'Co-founder'},
  {name:'Tasha Boyd',role:'Founder',offer:'Intros',need:'Pre-seed'},
  {name:'Devon Carter',role:'Operator',offer:'Advice',need:'Partners'},
  {name:'Ana Reyes',role:'Product',offer:'Collab',need:'Engineers'},
  {name:'Leo Kim',role:'Engineer',offer:'Mentorship',need:'Customers'},
  {name:'Simone Ford',role:'Marketer',offer:'Intros',need:'Designers'},
  {name:'Noah Pratt',role:'Founder',offer:'Hiring',need:'Capital'},
  {name:'Iris Chen',role:'Artist',offer:'Collab',need:'Partners'},
  {name:'Drew Ellis',role:'Investor',offer:'Capital',need:'Founders'},
  {name:'Kira Sol',role:'Designer',offer:'Feedback',need:'Pre-seed'},
];
const CC_FEED=[
  {t:'now',who:'Kira Sol',what:'scanned in'},
  {t:'1m',who:'Drew Ellis',what:'answered the Drop'},
  {t:'2m',who:'Marcus & Ana',what:'paired up'},
  {t:'3m',who:'Tasha Boyd',what:'got a nudge'},
  {t:'4m',who:'Iris Chen',what:'scanned in'},
  {t:'5m',who:'Leo Kim',what:'answered the Drop'},
];

/* Stat bar */
function StatBar({stats}){
  return (
    <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
      {stats.map((s,i)=>(
        <div key={i} style={{flex:1,minWidth:120,background:'var(--surface-1)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'14px 18px'}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:30,lineHeight:1,color:s.color||'var(--accent)'}}>{s.value}</div>
          <Mono style={{fontSize:11,textTransform:'uppercase',letterSpacing:'1px',color:'var(--text-muted)',marginTop:6,display:'block'}}>{s.label}</Mono>
        </div>
      ))}
    </div>
  );
}

/* Connection badge + lifecycle state badge */
function LiveBadge({phase='live'}){
  if(phase==='live') return (
    <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--accent-soft)',border:'1px solid var(--accent)',borderRadius:'var(--r-pill)',padding:'6px 13px'}}>
      <span style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)',boxShadow:'0 0 8px var(--accent)'}}/>
      <Mono style={{fontSize:11,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--accent)'}}>Live</Mono>
    </div>
  );
  const label=phase==='draft'?'Draft':phase==='cancelled'?'Cancelled':'Closed';
  const tone=phase==='cancelled'?'var(--danger)':'var(--text-muted)';
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--surface-2)',border:'1px solid var(--border-strong)',borderRadius:'var(--r-pill)',padding:'6px 13px'}}>
      <span style={{width:8,height:8,borderRadius:'50%',background:tone}}/>
      <Mono style={{fontSize:11,letterSpacing:'1.5px',textTransform:'uppercase',color:tone}}>{label}</Mono>
    </div>
  );
}

/* Lifecycle gate note: the one-line reason an act control is inert */
function GateNote({phase}){
  const line=phase==='draft'
    ? 'The event is not live yet. Acts arm when the door opens.'
    : phase==='cancelled'
    ? 'This event was cancelled. Acts are off.'
    : 'The event has ended. Acts are final.';
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:12}}>
      <span style={{width:6,height:6,borderRadius:'50%',background:'var(--text-muted)',flex:'0 0 auto'}}/>
      <Mono style={{fontSize:11,letterSpacing:'0.5px',color:'var(--text-muted)'}}>{line}</Mono>
    </div>
  );
}

/* Shared event phase: the Admin writes it, the Command Center reads it. */
const PHASE_KEY='soda.eventPhase';
function usePhase(fallback='live'){
  const [phase,set]=React.useState(()=>{
    try{const v=localStorage.getItem(PHASE_KEY);return (v==='draft'||v==='live'||v==='closed'||v==='cancelled')?v:fallback;}catch(e){return fallback;}
  });
  const setPhase=(p)=>{set(p);try{localStorage.setItem(PHASE_KEY,p);}catch(e){}};
  React.useEffect(()=>{
    const on=(e)=>{if(e.key===PHASE_KEY&&e.newValue)set(e.newValue);};
    window.addEventListener('storage',on);return ()=>window.removeEventListener('storage',on);
  },[]);
  return [phase,setPhase];
}
function ConnBadge(){
  return (
    <div style={{display:'flex',alignItems:'center',gap:7,color:'var(--text-muted)'}}>
      <span style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)'}}/>
      <Mono style={{fontSize:10,letterSpacing:'1px',textTransform:'uppercase'}}>Synced</Mono>
    </div>
  );
}

/* Activity feed */
function ActivityFeed({feed}){
  return (
    <div style={{display:'flex',flexDirection:'column',gap:0}}>
      <Mono style={{fontSize:10,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:12,display:'block'}}>Activity</Mono>
      {feed.length===0&&(
        <p style={{fontSize:13,fontWeight:300,color:'var(--text-muted)',margin:'6px 0'}}>The night starts here.</p>
      )}
      {feed.map((f,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderTop:i?'1px solid var(--border)':'none'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:i===0?'var(--accent)':'var(--border-strong)',flex:'0 0 auto'}}/>
          <div style={{flex:1,minWidth:0,fontSize:13,color:'var(--text-secondary)'}}>
            <b style={{color:'var(--text-primary)',fontWeight:600}}>{f.who}</b> {f.what}
          </div>
          <Mono style={{fontSize:10,color:'var(--text-faint)'}}>{f.t}</Mono>
        </div>
      ))}
    </div>
  );
}

/* Panel wrapper */
function Panel({title,right,children,style}){
  return (
    <div style={{background:'var(--surface-1)',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',padding:'18px 20px',...(style||{})}}>
      {(title||right)&&(
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <Mono style={{fontSize:11,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)'}}>{title}</Mono>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

/* Button (cockpit) */
function CCButton({children,variant='primary',onClick,disabled,icon,size='md',style}){
  const v={primary:{background:'var(--accent)',color:'var(--on-accent)',border:'1px solid var(--accent)'},
    ghost:{background:'var(--surface-2)',color:'var(--text-secondary)',border:'1px solid var(--border-strong)'},
    purple:{background:'var(--private-soft)',color:'var(--private)',border:'1px solid var(--private-border)'}}[variant];
  const sz={sm:{padding:'8px 12px',fontSize:13},md:{padding:'11px 16px',fontSize:14}}[size];
  return <button onClick={disabled?undefined:onClick} disabled={disabled} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
    fontFamily:'var(--font-sans)',fontWeight:600,borderRadius:'var(--r-md)',cursor:disabled?'default':'pointer',opacity:disabled?.5:1,...sz,...v,...(style||{})}}>
    {icon&&<span aria-hidden="true">{icon}</span>}{children}</button>;
}

/* Bar chart row (intelligence) */
function BarRow({label,value,max,color='var(--accent)'}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:9}}>
      <span style={{width:84,fontSize:13,color:'var(--text-secondary)',textAlign:'right'}}>{label}</span>
      <div style={{flex:1,height:22,background:'var(--surface-2)',borderRadius:'var(--r-sm)',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${(value/max)*100}%`,background:color,borderRadius:'var(--r-sm)',transition:'width .4s'}}/>
      </div>
      <Mono style={{width:24,fontSize:12,color:'var(--text-muted)'}}>{value}</Mono>
    </div>
  );
}

Object.assign(window,{CC_PAL,ccInit,ccColor,CCAvatar,Mono,CC_ROOM,CC_FEED,StatBar,LiveBadge,GateNote,usePhase,PHASE_KEY,ConnBadge,ActivityFeed,Panel,CCButton,BarRow});
