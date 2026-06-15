/* ============================================================
   Attendee — Post-event Survey (star / scale / tag / text) with a
   one-question-at-a-time flow and progress bar, then the Send-Off.
   ============================================================ */

const QS=[
  {kind:'star', q:'How was the night?'},
  {kind:'scale', q:'Did you find what you came for?', lo:'Not really', hi:'Absolutely'},
  {kind:'tag', q:'What did you come for?', opts:['Collaborators','Capital','Customers','Hiring','Just curious','Inspiration']},
  {kind:'text', q:'Anything we should know?', placeholder:'One line is plenty.'},
];

function Stars({value,onChange}){
  return (
    <div role="group" aria-label="Rating, one to five stars" style={{display:'flex',gap:12,justifyContent:'center'}}>
      {[1,2,3,4,5].map(n=>(
        <button key={n} onClick={()=>onChange(n)} aria-label={`${n} star${n>1?'s':''}`} aria-pressed={n<=value}
          style={{background:'none',border:'none',cursor:'pointer',fontSize:40,lineHeight:1,minWidth:44,minHeight:44,
          color:n<=value?'var(--accent)':'var(--border-strong)',transition:'color .12s'}}>★</button>
      ))}
    </div>
  );
}
function Scale({value,onChange,lo,hi}){
  return (
    <div>
      <div role="group" aria-label={`Scale of 1 to 7, from ${lo} to ${hi}`} style={{display:'flex',gap:8,justifyContent:'center'}}>
        {[1,2,3,4,5,6,7].map(n=>(
          <button key={n} onClick={()=>onChange(n)} aria-pressed={n===value} style={{width:44,height:44,borderRadius:'var(--r-sm)',cursor:'pointer',
            fontFamily:'var(--font-mono)',fontSize:14,background:n===value?'var(--accent)':'var(--surface-1)',
            color:n===value?'var(--on-accent)':'var(--text-secondary)',border:`1px solid ${n===value?'var(--accent)':'var(--border-strong)'}`}}>{n}</button>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:10,fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.5px'}}>
        <span>{lo}</span><span>{hi}</span>
      </div>
    </div>
  );
}

function Survey({onDone}){
  const [i,setI]=React.useState(0);
  const [ans,setAns]=React.useState({});
  const q=QS[i];
  const set=(v)=>setAns(a=>({...a,[i]:v}));
  const v=ans[i];
  const can = q.kind==='text' ? true : v!=null && (q.kind!=='tag'||(v&&v.length));
  const next=()=>{ if(i<QS.length-1) setI(i+1); else onDone(); };
  return (
    <CenterScreen>
      {/* progress */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:30}}>
        <button onClick={()=>i>0&&setI(i-1)} aria-label="Previous question" disabled={i===0} style={{background:'none',border:'none',color:i>0?'var(--text-muted)':'var(--text-faint)',cursor:i>0?'pointer':'default',fontSize:18,width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>←</button>
        <div style={{flex:1,height:6,background:'var(--surface-2)',borderRadius:'var(--r-pill)',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${((i+1)/QS.length)*100}%`,background:'var(--accent)',borderRadius:'var(--r-pill)',transition:'width .3s'}}/>
        </div>
        <MonoLabel>{i+1}/{QS.length}</MonoLabel>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <Display size={24} style={{textAlign:'center',marginBottom:30}}>{q.q}</Display>
        {q.kind==='star'&&<Stars value={v||0} onChange={set}/>}
        {q.kind==='scale'&&<Scale value={v} onChange={set} lo={q.lo} hi={q.hi}/>}
        {q.kind==='tag'&&(
          <div style={{display:'flex',flexWrap:'wrap',gap:9,justifyContent:'center'}}>
            {q.opts.map(o=>{
              const sel=(v||[]).includes(o);
              return <KChip key={o} selected={sel} onClick={()=>set(sel?(v||[]).filter(x=>x!==o):[...(v||[]),o])}>{o}</KChip>;
            })}
          </div>
        )}
        {q.kind==='text'&&(
          <div>
            <textarea value={v||''} onChange={e=>set(e.target.value)} placeholder={q.placeholder} rows={3} maxLength={140}
              style={{...inStyle,resize:'none',fontSize:15,lineHeight:1.4}}/>
            <div style={{textAlign:'right',fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-faint)',marginTop:6}}>{(v||'').length}/140</div>
          </div>
        )}
      </div>
      <KButton block size="lg" disabled={!can} onClick={next}>{i<QS.length-1?'Next':'Finish'}</KButton>
    </CenterScreen>
  );
}

/* Send-Off */
function SendOff({onRestart}){
  return (
    <CenterScreen>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
        <HostMark host={HOST} sub={EVENT}/>
        <div style={{height:30}}/>
        <Display size={30} style={{maxWidth:300}}>Thanks for being in the room</Display>
        <p style={{fontWeight:300,fontSize:15,color:'var(--text-secondary)',marginTop:16,maxWidth:280}}>
          Your recap is on the way. The next Futureland night is closer than you think.
        </p>
        <div style={{height:26}}/>
        <KButton onClick={onRestart}>Join the membership waitlist</KButton>
      </div>
      <div style={{textAlign:'center',fontStyle:'italic',color:'var(--text-muted)',fontSize:13,maxWidth:300,margin:'0 auto'}}>
        A name tag knows you showed up. SODA knows who you became to the room.
      </div>
    </CenterScreen>
  );
}

Object.assign(window,{Survey,SendOff});
