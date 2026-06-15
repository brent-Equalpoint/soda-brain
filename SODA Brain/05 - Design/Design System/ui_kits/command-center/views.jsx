/* ============================================================
   Command Center — the act views. Each drives one part of the night.
   ============================================================ */
const { CCAvatar, Mono, CC_ROOM, Panel, CCButton, BarRow, GateNote } = window;

/* Room View (host) */
function RoomHost({empty=false}){
  if(empty) return (
    <Panel title="Room · 0 present" right={<Mono style={{fontSize:11,color:'var(--text-muted)'}}>monitoring</Mono>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10,opacity:.35}} aria-hidden="true">
        {Array.from({length:6}).map((_,i)=>(
          <div key={i} style={{background:'var(--surface-2)',border:'1px dashed var(--border-strong)',borderRadius:'var(--r-md)',padding:12,display:'flex',gap:10,alignItems:'center'}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'var(--surface-1)'}}/>
            <div style={{flex:1}}>
              <div style={{height:10,width:'70%',background:'var(--surface-1)',borderRadius:4}}/>
              <div style={{height:8,width:'44%',background:'var(--surface-1)',borderRadius:4,marginTop:6}}/>
            </div>
          </div>
        ))}
      </div>
      <p style={{textAlign:'center',fontSize:14,fontWeight:300,color:'var(--text-muted)',margin:'18px 0 6px'}}>
        No one has scanned in yet. The room fills here.
      </p>
    </Panel>
  );
  return (
    <Panel title={`Room · ${CC_ROOM.length} present`} right={<Mono style={{fontSize:11,color:'var(--text-muted)'}}>monitoring</Mono>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10}}>
        {CC_ROOM.map((p,i)=>(
          <div key={i} style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:12,display:'flex',gap:10,alignItems:'center'}}>
            <CCAvatar name={p.name} size={36}/>
            <div style={{minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
              <Mono style={{fontSize:10,color:'var(--text-muted)'}}>{p.role}</Mono>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* Sync Control — drives The Drop */
function SyncControl({onToast,phase='live',empty=false}){
  const live=phase==='live';
  const [prompt,setPrompt]=React.useState('What did you make this week?');
  const [fired,setFired]=React.useState(false);
  const [t,setT]=React.useState(0);
  const [count,setCount]=React.useState(0);
  const [revealed,setRevealed]=React.useState(false);
  React.useEffect(()=>{
    if(!fired)return;
    const id=setInterval(()=>{setT(x=>x+1);if(!empty)setCount(c=>c<11?c+1:c);},900);
    return ()=>clearInterval(id);
  },[fired,empty]);
  const answers=['Shipping before I was ready','A studio in an old bakery','Trust the room','The first hire changed everything','Less polish, more honesty'];
  return (
    <Panel title="Sync control · The Drop" right={fired&&<Mono style={{fontSize:11,color:'var(--accent)'}}>{count} responses</Mono>}>
      {!fired?(
        <>
          <Mono style={{fontSize:10,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:7}}>Prompt</Mono>
          <input value={prompt} onChange={e=>setPrompt(e.target.value)} style={{width:'100%',background:'var(--surface-2)',border:'1px solid var(--border-strong)',borderRadius:'var(--r-md)',padding:'12px 13px',color:'var(--text-primary)',fontFamily:'var(--font-sans)',fontSize:15,outline:'none',marginBottom:16}}/>
          <CCButton icon="◉" disabled={!live} onClick={()=>{setFired(true);onToast&&onToast('Drop fired to 12 phones');}}>Fire the Drop</CCButton>
          {!live&&<GateNote phase={phase}/>}
        </>
      ):(
        <>
          <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:16}}>
            <div><div style={{fontFamily:'var(--font-display)',fontSize:34,color:'var(--accent)'}}>{String(Math.floor(t/60)).padStart(1,'0')}:{String(t%60).padStart(2,'0')}</div><Mono style={{fontSize:10,color:'var(--text-muted)',textTransform:'uppercase'}}>elapsed</Mono></div>
            <div style={{flex:1,fontSize:15,color:'var(--text-primary)',fontWeight:300}}>“{prompt}”</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:200,overflowY:'auto'}} className="soda-scroll">
            {count===0?(
              <p style={{textAlign:'center',fontSize:13,fontWeight:300,color:'var(--text-muted)',padding:'14px 0'}}>Waiting on the first answer.</p>
            ):answers.slice(0,Math.max(1,count-6)).map((a,i)=>(
              <div key={i} style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',padding:'10px 12px',fontSize:13,color:'var(--text-secondary)'}}>
                {a} {revealed&&<Mono style={{fontSize:10,color:'var(--text-muted)'}}>· {CC_ROOM[i].name}</Mono>}
              </div>
            ))}
          </div>
          {count>0&&<div style={{marginTop:14}}><CCButton variant="ghost" size="sm" onClick={()=>{setRevealed(true);onToast&&onToast('Names revealed');}}>Reveal names</CCButton></div>}
        </>
      )}
    </Panel>
  );
}

/* Chance Control — drives pairing */
function ChanceControl({onToast,phase='live',empty=false}){
  const live=phase==='live';
  const [spun,setSpun]=React.useState(false);
  const pairs=[[0,2],[1,5],[3,8],[4,6],[7,11],[9,10]];
  return (
    <Panel title="Chance control · pairing" right={spun&&!empty&&<Mono style={{fontSize:11,color:'var(--accent)'}}>{pairs.length} pairs</Mono>}>
      {empty?(
        <div style={{textAlign:'center',padding:'18px 0'}}>
          <p style={{fontSize:14,color:'var(--text-muted)',fontWeight:300,marginBottom:6}}>Room is small. One guest will hold for the next round.</p>
          <p style={{fontSize:12,color:'var(--text-faint)',fontWeight:300}}>Pairing opens up as more people scan in.</p>
        </div>
      ):!spun?(
        <div style={{textAlign:'center',padding:'18px 0'}}>
          <p style={{fontSize:14,color:'var(--text-muted)',fontWeight:300,marginBottom:18}}>Pair the room by chance. Each pair gets a starter pulled from the Drop.</p>
          <CCButton icon="⟳" disabled={!live} onClick={()=>{setSpun(true);onToast&&onToast('Room paired · 6 pairs');}}>Spin the room</CCButton>
          {!live&&<GateNote phase={phase}/>}
        </div>
      ):(
        <>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {pairs.map(([a,b],i)=>(
              <div key={i} style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'10px 12px',display:'flex',alignItems:'center',gap:8}}>
                <CCAvatar name={CC_ROOM[a].name} size={30}/>
                <Mono style={{fontSize:11,color:'var(--accent)'}}>×</Mono>
                <CCAvatar name={CC_ROOM[b].name} size={30}/>
                <div style={{marginLeft:6,minWidth:0,fontSize:12,color:'var(--text-secondary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{CC_ROOM[a].name.split(' ')[0]} & {CC_ROOM[b].name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:14}}><CCButton variant="ghost" size="sm" icon="⟳" onClick={()=>onToast&&onToast('Re-spun')}>Re-spin</CCButton></div>
        </>
      )}
    </Panel>
  );
}

/* Nudge Control — private matches */
function NudgeControl({onToast,phase='live',empty=false}){
  const live=phase==='live';
  const init=empty?[]:[
    {to:'Tasha Boyd',match:'Drew Ellis',why:'has the capital she needs'},
    {to:'Marcus Webb',match:'Noah Pratt',why:'is hiring engineers'},
    {to:'Ana Reyes',match:'Leo Kim',why:'can mentor on infra'},
    {to:'Priya Nair',match:'Simone Ford',why:'needs a designer'},
  ];
  const [queue,setQueue]=React.useState(init);
  const send=(i)=>{const n=queue[i];setQueue(q=>q.filter((_,x)=>x!==i));onToast&&onToast(`Nudge sent to ${n.to.split(' ')[0]}`);};
  return (
    <Panel title="Nudge control · private" right={<Mono style={{fontSize:11,color:'var(--private)'}}>{queue.length} pending</Mono>}>
      {queue.length===0?(
        <div style={{textAlign:'center',padding:'24px 0',color:'var(--text-muted)',fontSize:14}}>No matches ready to send yet.</div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {queue.map((n,i)=>(
            <div key={i} style={{background:'var(--surface-purple)',border:'1px solid var(--private-border)',borderRadius:'var(--r-md)',padding:'12px 14px',display:'flex',alignItems:'center',gap:12}}>
              <CCAvatar name={n.match} size={34}/>
              <div style={{flex:1,minWidth:0,fontSize:13,color:'var(--text-secondary)'}}>
                <b style={{color:'var(--text-primary)'}}>{n.to}</b> → meet <b style={{color:'var(--private)'}}>{n.match}</b>, who {n.why}.
              </div>
              <CCButton variant="purple" size="sm" disabled={!live} onClick={()=>send(i)}>Send</CCButton>
            </div>
          ))}
        </div>
      )}
      {!live&&<GateNote phase={phase}/>}
      <p style={{fontSize:11,color:'var(--text-faint)',marginTop:14}}>Each nudge goes to one recipient only, never to a shared view.</p>
    </Panel>
  );
}

/* Survey Monitor */
function SurveyMonitor({empty=false}){
  const rows=empty?[]:[
    {who:'Priya Nair',rating:5,came:'Collaborators'},
    {who:'Drew Ellis',rating:4,came:'Dealflow'},
    {who:'Tasha Boyd',rating:5,came:'Capital'},
    {who:'Leo Kim',rating:4,came:'Customers'},
  ];
  return (
    <Panel title="Survey monitor" right={<Mono style={{fontSize:11,color:'var(--text-muted)'}}>{rows.length} in</Mono>}>
      {rows.length===0?(
        <p style={{textAlign:'center',fontSize:14,fontWeight:300,color:'var(--text-muted)',padding:'20px 0'}}>No responses yet.</p>
      ):(
      <div style={{display:'flex',flexDirection:'column'}}>
        {rows.map((r,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderTop:i?'1px solid var(--border)':'none'}}>
            <CCAvatar name={r.who} size={30}/>
            <div style={{flex:1,fontSize:13,color:'var(--text-primary)',fontWeight:600}}>{r.who}</div>
            <div style={{color:'var(--accent)',fontSize:13}}>{'★'.repeat(r.rating)}<span style={{color:'var(--border-strong)'}}>{'★'.repeat(5-r.rating)}</span></div>
            <Mono style={{fontSize:11,color:'var(--text-muted)',width:90,textAlign:'right'}}>{r.came}</Mono>
          </div>
        ))}
      </div>
      )}
    </Panel>
  );
}

/* Intelligence View */
function IntelView({empty=false}){
  if(empty) return (
    <Panel title="The room reads">
      <p style={{textAlign:'center',fontSize:14,fontWeight:300,color:'var(--text-muted)',padding:'20px 0'}}>
        Not enough signal yet. Patterns appear as the room grows.
      </p>
    </Panel>
  );
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
      <Panel title="Top offers">
        <BarRow label="Intros" value={5} max={6}/>
        <BarRow label="Capital" value={3} max={6}/>
        <BarRow label="Hiring" value={3} max={6}/>
        <BarRow label="Feedback" value={2} max={6}/>
        <BarRow label="Collab" value={2} max={6}/>
      </Panel>
      <Panel title="Top needs">
        <BarRow label="Customers" value={4} max={6} color="var(--private)"/>
        <BarRow label="Engineers" value={3} max={6} color="var(--private)"/>
        <BarRow label="Pre-seed" value={3} max={6} color="var(--private)"/>
        <BarRow label="Partners" value={2} max={6} color="var(--private)"/>
        <BarRow label="Co-founder" value={1} max={6} color="var(--private)"/>
      </Panel>
      <div style={{gridColumn:'1 / -1'}}>
        <Panel title="The room reads">
          <p style={{fontSize:15,color:'var(--text-primary)',fontWeight:300,lineHeight:1.5}}>
            The room is <b style={{fontWeight:600,color:'var(--accent)'}}>intro-rich</b> and <b style={{fontWeight:600,color:'var(--private)'}}>customer-hungry</b>. The biggest matchable gap: three founders need pre-seed, and two investors are holding capital. Fire a nudge.
          </p>
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window,{RoomHost,SyncControl,ChanceControl,NudgeControl,SurveyMonitor,IntelView});
