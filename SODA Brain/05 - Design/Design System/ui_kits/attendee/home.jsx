/* ============================================================
   Attendee — The between-events Home: profile header + three tabs
   (Overview / Events / Contacts rolodex). Warmth & follow-up nudges.
   ============================================================ */

const HOME_EVENTS=[
  {host:'Futureland', name:'Creative Meetup', date:'Mar 14', where:'Cleveland', met:12},
  {host:'Equalpoint', name:'Founder Mixer', date:'Feb 02', where:'Cleveland', met:8},
  {host:'Black Tech Week', name:'BTW Activation', date:'Jan 20', where:'Cincinnati', met:15},
];
const HOME_CONTACTS=[
  {name:'Jordan Blake', role:'Investor', ev:'Creative Meetup', where:'Cleveland', signal:'saved', warm:'var(--accent)'},
  {name:'Priya Nair', role:'Designer', ev:'Creative Meetup', where:'Cleveland', signal:'reached', warm:'var(--accent)'},
  {name:'Tasha Boyd', role:'Founder', ev:'Creative Meetup', where:'Cleveland', signal:'nudge', warm:'var(--private)'},
  {name:'Leo Kim', role:'Engineer', ev:'BTW Activation', where:'Cincinnati', signal:'nudge', warm:'var(--text-muted)'},
  {name:'Devon Carter', role:'Growth Lead', ev:'Founder Mixer', where:'Cleveland', signal:'just', warm:'var(--accent)'},
  {name:'Ana Reyes', role:'Operator', ev:'BTW Activation', where:'Cincinnati', signal:'just', warm:'var(--text-muted)'},
];
const SIG_LABEL={reached:'Reached out',nudge:'Reach out',saved:'Saved',just:'Just met'};
function sigStyle(s){return {
  reached:{color:'var(--accent)',background:'var(--accent-soft)'},
  nudge:{color:'var(--private)',background:'var(--private-soft)'},
  saved:{color:'var(--text-muted)',background:'var(--surface-2)'},
  just:{color:'var(--text-muted)',background:'var(--surface-2)'},
}[s];}

function Signal({s}){
  return <span style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'.5px',textTransform:'uppercase',padding:'4px 9px',borderRadius:'var(--r-pill)',whiteSpace:'nowrap',...sigStyle(s)}}>{SIG_LABEL[s]}</span>;
}
function CRow({c,onClick,warm,boxed}){
  return (
    <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:11,padding:boxed?'11px 13px':'9px 0',
      background:boxed?'var(--surface-1)':'transparent',border:boxed?'1px solid var(--border)':'none',
      borderRadius:boxed?'var(--r-md)':0,cursor:'pointer',width:'100%',textAlign:'left',fontFamily:'var(--font-sans)',minHeight:44}}>
      <KAvatar name={c.name} size={38}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600,color:'var(--text-primary)',lineHeight:1.1}}>{c.name}</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-muted)',marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.role} · {c.ev}, {c.where}</div>
      </div>
      {warm&&<span style={{flex:'0 0 auto',width:8,height:8,borderRadius:'50%',background:c.warm}}/>}
      <Signal s={c.signal}/>
    </button>
  );
}
function Sec({title,action,onAction}){
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'6px 0 11px'}}>
      <MonoLabel>{title}</MonoLabel>
      {action&&<button onClick={onAction} style={{background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:12,color:'var(--accent)'}}>{action}</button>}
    </div>
  );
}

function Home(){
  const [tab,setTab]=React.useState('overview');
  const [ovOpen,setOvOpen]=React.useState(true);
  const [query,setQuery]=React.useState('');
  const nudges=HOME_CONTACTS.filter(c=>c.signal==='nudge');

  const tabs=[['overview','■','Overview'],['events','▦','Events'],['contacts','◎','Contacts']];

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      {/* profile header */}
      <div style={{flex:'0 0 auto',padding:'12px 16px 14px',borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <KAvatar name="Maya Chen" size={46}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:17,fontWeight:700,color:'var(--text-primary)',lineHeight:1.1}}>Maya Chen</div>
            <div style={{fontSize:13,color:'var(--text-muted)'}}>Founder</div>
          </div>
          <button aria-label="Settings" style={{width:44,height:44,borderRadius:'50%',border:'1px solid var(--border-strong)',background:'none',
            display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:16,cursor:'pointer',flex:'0 0 auto'}}>⚙</button>
        </div>
      </div>

      {/* body */}
      <div className="soda-scroll" style={{flex:1,overflowY:'auto',padding:'18px',minHeight:0}}>
        {tab==='overview'&&(
          <>
            <Display size={24} style={{marginBottom:18}}>Welcome back,<br/>Maya</Display>
            <Sec title="Recent events" action="See all" onAction={()=>setTab('events')}/>
            <div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:6,marginBottom:20}} className="soda-scroll">
              {HOME_EVENTS.map((e,i)=>(
                <div key={i} style={{flex:'0 0 auto',width:150,background:'var(--surface-1)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:13}}>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'1px',textTransform:'uppercase',color:'var(--accent)',marginBottom:6}}>{e.host}</div>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--text-primary)',lineHeight:1.15,marginBottom:8}}>{e.name}</div>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-muted)'}}>{e.date} · {e.met} met</div>
                </div>
              ))}
            </div>
            <Sec title="People you synced with" action="See all" onAction={()=>setTab('contacts')}/>
            <div style={{display:'flex',gap:14,overflowX:'auto',paddingBottom:6,marginBottom:22}} className="soda-scroll">
              {HOME_CONTACTS.slice(0,6).map((c,i)=>(
                <div key={i} style={{flex:'0 0 auto',width:62,textAlign:'center'}}>
                  <KAvatar name={c.name} size={54} style={{margin:'0 auto 6px'}}/>
                  <div style={{fontSize:11,color:'var(--text-secondary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name.split(' ')[0]}</div>
                </div>
              ))}
            </div>
            <div style={{background:'var(--surface-green)',borderRadius:'var(--r-xl)',padding:'16px 17px'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--accent-bright)',marginBottom:8}}>Your experience</div>
              <div style={{fontSize:14.5,color:'var(--text-primary)',fontWeight:300,lineHeight:1.4}}>
                You came to find <b style={{fontWeight:600,color:'#fff'}}>engineers</b> and <b style={{fontWeight:600,color:'#fff'}}>pre-seed</b>. Three people from your events fit. Tap Contacts to follow up.
              </div>
            </div>
          </>
        )}

        {tab==='events'&&(
          <>
            <Sec title="Events attended"/>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {HOME_EVENTS.map((e,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:13,background:'var(--surface-1)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'13px 14px'}}>
                  <div style={{flex:'0 0 auto',width:40,height:40,borderRadius:'var(--r-sm)',background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontSize:10,color:'var(--accent)'}}>{e.host.split(/\s+/).map(w=>w[0]).join('').slice(0,3)}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:600,color:'var(--text-primary)'}}>{e.name}</div>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)',marginTop:3}}>{e.date} · {e.where}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'var(--font-display)',fontSize:17,color:'var(--accent)'}}>{e.met}</div>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text-muted)',textTransform:'uppercase'}}>met</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab==='contacts'&&(
          <>
            {ovOpen&&(
              <div style={{background:'var(--surface-1)',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',padding:15,marginBottom:18,position:'relative'}}>
                <button onClick={()=>setOvOpen(false)} aria-label="Dismiss follow-ups overview" style={{position:'absolute',top:4,right:5,width:44,height:44,borderRadius:'50%',
                  border:'none',background:'none',color:'var(--text-muted)',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
                <MonoLabel style={{marginBottom:13,paddingRight:26}}>Recently met &amp; follow-ups</MonoLabel>
                <div style={{background:'var(--surface-purple)',border:'1px solid var(--private-border)',borderRadius:'var(--r-md)',padding:'11px 12px',marginBottom:12}}>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'1px',textTransform:'uppercase',color:'var(--private)',marginBottom:6,display:'flex',alignItems:'center',gap:6}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:'var(--private)'}}/> People to reach out to
                  </div>
                  {nudges.map((c,i)=><CRow key={i} c={c} warm boxed={false}/>)}
                </div>
                {HOME_CONTACTS.slice(0,3).map((c,i)=><CRow key={i} c={c} warm boxed={false} style={{borderTop:'1px solid var(--border)'}}/>)}
              </div>
            )}
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search contacts…"
              style={{...inStyle,borderColor:'var(--border-strong)',marginBottom:14}}/>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {HOME_CONTACTS.filter(c=>!query||c.name.toLowerCase().includes(query.toLowerCase())||c.role.toLowerCase().includes(query.toLowerCase()))
                .map((c,i)=><CRow key={i} c={c} warm boxed/>)}
            </div>
          </>
        )}
      </div>

      {/* tab bar */}
      <div style={{flex:'0 0 auto',display:'flex',borderTop:'1px solid var(--border)',background:'#0e0f0e'}}>
        {tabs.map(([id,ic,lb])=>{
          const on=tab===id;
          return (
            <button key={id} onClick={()=>setTab(id)} aria-current={on?'page':undefined} style={{flex:1,background:'none',border:'none',cursor:'pointer',padding:'11px 0 13px',
              display:'flex',flexDirection:'column',alignItems:'center',gap:4,color:on?'var(--accent)':'var(--text-muted)',position:'relative'}}>
              <span style={{fontSize:18,lineHeight:1}}>{ic}</span>
              <span style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'.5px',textTransform:'uppercase'}}>{lb}</span>
              {id==='contacts'&&nudges.length>0&&<span style={{position:'absolute',top:7,right:'50%',marginRight:-22,width:7,height:7,borderRadius:'50%',background:'var(--private)'}}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window,{Home});
