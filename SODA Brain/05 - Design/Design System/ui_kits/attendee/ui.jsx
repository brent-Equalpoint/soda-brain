/* ============================================================
   SODA Attendee UI Kit — shared primitives, phone frame, seed data
   Self-contained (mirrors components/* using the same tokens) so the
   clickthrough renders standalone. Exports to window for sibling files.
   ============================================================ */

const PAL = ['var(--av-1)','var(--av-2)','var(--av-3)','var(--av-4)','var(--av-5)','var(--av-6)','var(--av-7)','var(--av-8)'];
function initials(n){return (n||'').trim().split(/\s+/).map(w=>w[0]||'').join('').slice(0,2).toUpperCase();}
function colorFor(n){let h=0;for(let i=0;i<(n||'').length;i++)h=(h*31+n.charCodeAt(i))>>>0;return PAL[h%PAL.length];}

/* ---- Avatar ---- */
function KAvatar({name,size=48,color,style}){
  return (
    <div style={{flex:'0 0 auto',width:size,height:size,borderRadius:'50%',display:'flex',
      alignItems:'center',justifyContent:'center',fontFamily:'var(--font-sans)',fontWeight:700,
      fontSize:Math.round(size*0.38),color:'#fff',background:color||colorFor(name),userSelect:'none',...(style||{})}}>
      {initials(name)}
    </div>
  );
}

/* ---- Eyebrow / labels ---- */
function Eyebrow({children,color='var(--accent)',style}){
  return <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'3px',textTransform:'uppercase',color,...(style||{})}}>{children}</div>;
}
function MonoLabel({children,style}){
  return <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',...(style||{})}}>{children}</div>;
}
function Display({children,size=26,style}){
  return <div style={{fontFamily:'var(--font-display)',textTransform:'uppercase',letterSpacing:'-.01em',lineHeight:1.02,color:'var(--text-primary)',fontSize:size,...(style||{})}}>{children}</div>;
}

/* ---- Button ---- */
function KButton({children,variant='primary',size='md',block,disabled,icon,onClick,style}){
  const sizes={sm:{padding:'9px 13px',fontSize:13},md:{padding:'14px 16px',fontSize:15},lg:{padding:'16px 18px',fontSize:16}};
  const variants={
    primary:{background:'var(--accent)',color:'var(--on-accent)',border:'1px solid var(--accent)'},
    ghost:{background:'var(--surface-1)',color:'var(--text-secondary)',border:'1px solid var(--border-strong)'},
    purple:{background:'var(--private-soft)',color:'var(--private)',border:'1px solid var(--private-border)'},
    danger:{background:'var(--danger-soft)',color:'var(--danger)',border:'1px solid var(--danger)'},
  };
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      style={{width:block?'100%':'auto',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
        fontFamily:'var(--font-sans)',fontWeight:600,borderRadius:'var(--r-md)',cursor:disabled?'default':'pointer',
        opacity:disabled?0.5:1,lineHeight:1.1,transition:'filter .15s',...sizes[size],...variants[variant],...(style||{})}}>
      {icon&&<span aria-hidden="true" style={{fontSize:'1.05em',lineHeight:1}}>{icon}</span>}{children}
    </button>
  );
}

/* ---- Chip ---- */
function KChip({children,selected,onClick,writeIn,style}){
  return (
    <button onClick={onClick} style={{fontFamily:'var(--font-sans)',fontSize:13,fontWeight:400,minHeight:44,padding:'10px 16px',
      borderRadius:'var(--r-pill)',cursor:'pointer',transition:'transform .12s var(--ease)',display:'inline-flex',alignItems:'center',gap:6,
      backgroundColor:selected?'var(--accent)':'var(--surface-1)',color:selected?'var(--on-accent)':'var(--text-secondary)',
      borderStyle:'solid',borderWidth:1,borderColor:selected?'var(--accent)':'var(--border-strong)',...(style||{})}}>
      {writeIn&&<span aria-hidden="true" style={{opacity:0.7}}>＋</span>}{children}
    </button>
  );
}

/* ---- Phone frame ----
   Fixed 380×780 device. The screen is a flex column: header / body / tabbar.
   `chrome` lets a screen suppress the status bar (full-bleed acts). */
function PhoneFrame({children,statusHost}){
  return (
    <div style={{width:380,maxWidth:'100%',background:'#000',border:'9px solid #1c1d1c',borderRadius:'var(--r-device)',
      overflow:'hidden',boxShadow:'var(--shadow-device)',position:'relative'}}>
      <div style={{background:'var(--bg-canvas)',height:780,overflow:'hidden',position:'relative',display:'flex',flexDirection:'column'}}>
        {/* status bar */}
        <div style={{flex:'0 0 auto',height:34,display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'0 22px',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)'}}>
          <span>9:41</span>
          <span style={{fontSize:9,letterSpacing:'1px'}}>{statusHost||''}</span>
          <span>● ● ●</span>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---- Screen scaffold: scrolling body ---- */
function ScreenBody({children,style}){
  return <div className="soda-scroll" style={{flex:1,overflowY:'auto',padding:'18px',...(style||{})}}>{children}</div>;
}

/* ---- Centered screen (welcome/sendoff/acts) ---- */
function CenterScreen({children,bg='var(--bg-canvas)',style}){
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',padding:'24px 22px 28px',background:bg,...(style||{})}}>
      {children}
    </div>
  );
}

/* ---- Toast ---- */
function KToast({message,show,tone='green'}){
  const edge={green:'var(--accent)',purple:'var(--private)',danger:'var(--danger)'}[tone];
  return (
    <div style={{position:'absolute',left:'50%',bottom:90,transform:`translateX(-50%) translateY(${show?0:20}px)`,
      background:'var(--surface-2)',border:`1px solid ${edge}`,color:'var(--text-primary)',fontSize:13,padding:'11px 18px',
      borderRadius:'var(--r-pill)',boxShadow:'var(--shadow-toast)',opacity:show?1:0,transition:'all .3s',pointerEvents:'none',
      zIndex:40,display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>
      <span style={{width:7,height:7,borderRadius:'50%',background:edge}} />{message}
    </div>
  );
}

/* ---- Host identity block (wordmark / typed name) ---- */
function HostMark({host,sub,size=20}){
  return (
    <div style={{textAlign:'center'}}>
      <div style={{fontFamily:'var(--font-display)',textTransform:'uppercase',letterSpacing:'-.01em',fontSize:size,color:'var(--text-primary)'}}>{host}</div>
      {sub&&<div style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'2px',textTransform:'uppercase',color:'var(--text-muted)',marginTop:6}}>{sub}</div>}
    </div>
  );
}

/* ============================================================
   Seed data — one event ("Creative Meetup", hosted by Futureland)
   ============================================================ */
const ROLES = ['Founder','Designer','Engineer','Investor','Operator','Artist','Product','Marketer'];
const OFFERS = ['Intros','Advice','Hiring','Capital','Mentorship','Collab','Feedback'];
const NEEDS  = ['Engineers','Pre-seed','Designers','Customers','Partners','Co-founder','Advisors'];

const ROOM = [
  {name:'Jordan Blake', role:'Investor', offer:'Capital', need:'Dealflow'},
  {name:'Priya Nair', role:'Designer', offer:'Feedback', need:'Customers'},
  {name:'Marcus Webb', role:'Engineer', offer:'Hiring', need:'Co-founder'},
  {name:'Tasha Boyd', role:'Founder', offer:'Intros', need:'Pre-seed'},
  {name:'Devon Carter', role:'Operator', offer:'Advice', need:'Partners'},
  {name:'Ana Reyes', role:'Product', offer:'Collab', need:'Engineers'},
  {name:'Leo Kim', role:'Engineer', offer:'Mentorship', need:'Customers'},
  {name:'Simone Ford', role:'Marketer', offer:'Intros', need:'Designers'},
  {name:'Noah Pratt', role:'Founder', offer:'Hiring', need:'Capital'},
  {name:'Iris Chen', role:'Artist', offer:'Collab', need:'Partners'},
  {name:'Drew Ellis', role:'Investor', offer:'Capital', need:'Founders'},
  {name:'Kira Sol', role:'Designer', offer:'Feedback', need:'Pre-seed'},
];
const DROP_ANSWERS = [
  'The one idea I can\'t stop thinking about',
  'Shipping before I\'m ready',
  'A studio in an old bakery',
  'Trust the room',
  'Less polish, more honesty',
  'The first hire changed everything',
];

Object.assign(window, {
  PAL, initials, colorFor,
  KAvatar, Eyebrow, MonoLabel, Display, KButton, KChip,
  PhoneFrame, ScreenBody, CenterScreen, KToast, HostMark,
  ROLES, OFFERS, NEEDS, ROOM, DROP_ANSWERS,
});
