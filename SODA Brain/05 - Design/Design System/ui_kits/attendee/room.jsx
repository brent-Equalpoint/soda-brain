/* ============================================================
   Attendee — The Room + the three live Acts.
   RoomView (grid / list / flip, live count) and the act overlays:
   The Drop (waiting wall → answers), The Chance (pairing + timer),
   The Nudge (private match, purple).
   ============================================================ */

/* ---- A person card (grid) ---- */
function PersonCard({p,onComment}){
  return (
    <button onClick={onComment} style={{background:'var(--surface-1)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',
      padding:13,cursor:'pointer',transition:'border-color .15s',display:'flex',flexDirection:'column',gap:10,
      width:'100%',textAlign:'left',fontFamily:'var(--font-sans)'}}
      onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
      <KAvatar name={p.name} size={42}/>
      <div>
        <div style={{fontSize:14,fontWeight:600,color:'var(--text-primary)',lineHeight:1.1}}>{p.name}</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-muted)',marginTop:3}}>{p.role}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:2}}>
        <span style={{fontSize:11,color:'var(--text-secondary)'}}><span style={{color:'var(--accent)'}}>Offers</span> {p.offer}</span>
        <span style={{fontSize:11,color:'var(--text-secondary)'}}><span style={{color:'var(--private)'}}>Needs</span> {p.need}</span>
      </div>
    </button>
  );
}

/* ---- A dimmed placeholder card: the early room's promise of people ---- */
function PlaceholderCard(){
  return (
    <div aria-hidden="true" style={{background:'var(--surface-1)',border:'1px dashed var(--border-strong)',borderRadius:'var(--r-lg)',
      padding:13,display:'flex',flexDirection:'column',gap:10,opacity:.4}}>
      <div style={{width:42,height:42,borderRadius:'50%',background:'var(--surface-2)'}}/>
      <div>
        <div style={{height:11,width:'62%',background:'var(--surface-2)',borderRadius:4}}/>
        <div style={{height:8,width:'40%',background:'var(--surface-2)',borderRadius:4,marginTop:7}}/>
      </div>
      <div style={{height:8,width:'78%',background:'var(--surface-2)',borderRadius:4,marginTop:2}}/>
    </div>
  );
}

/* ---- Room View ---- */
/* `early` renders the most important empty state in the app: a count
   that climbs, one warm line, the few real cards, dimmed placeholders. */
function RoomView({onComment,headerSlot,early=false}){
  const [view,setView]=React.useState('grid'); // grid | list | flip
  const [flip,setFlip]=React.useState(0);
  const [count,setCount]=React.useState(early?2:ROOM.length);
  React.useEffect(()=>{
    if(!early)return undefined;
    const id=setInterval(()=>setCount(c=>c<5?c+1:c),2400);
    return ()=>clearInterval(id);
  },[early]);
  const people=early?ROOM.slice(0,count):ROOM;
  const views=[['grid','▦'],['list','≣'],['flip','❑']];
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      {/* header */}
      <div style={{flex:'0 0 auto',padding:'10px 16px 12px',borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)'}}>{EVENT}</div>
          <div style={{display:'flex',alignItems:'center',gap:7,fontFamily:'var(--font-mono)',fontSize:11,color:'var(--accent)'}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'var(--accent)',boxShadow:'0 0 8px var(--accent)'}}/>
            {people.length} HERE
          </div>
        </div>
        <div style={{display:'flex',gap:6,marginTop:12}}>
          {views.map(([id,ic])=>(
            <button key={id} onClick={()=>setView(id)} aria-pressed={view===id} style={{flex:1,minHeight:44,padding:'7px 0',borderRadius:'var(--r-sm)',cursor:'pointer',
              fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'1px',textTransform:'uppercase',
              background:view===id?'var(--accent-soft)':'transparent',color:view===id?'var(--accent)':'var(--text-muted)',
              border:`1px solid ${view===id?'var(--accent)':'var(--border)'}`}}>{ic} {id}</button>
          ))}
        </div>
      </div>
      {/* body */}
      <div className="soda-scroll" style={{flex:1,overflowY:'auto',padding:16,minHeight:0}}>
        {headerSlot}
        {early&&(
          <div style={{textAlign:'center',padding:'10px 0 18px'}}>
            <Display size={20}>The room is filling.<br/>You are early. Good.</Display>
          </div>
        )}
        {view==='grid'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {people.map((p,i)=><PersonCard key={i} p={p} onComment={()=>onComment(p)}/>)}
            {early&&Array.from({length:Math.max(0,8-people.length)}).map((_,i)=><PlaceholderCard key={'ph'+i}/>)}
          </div>
        )}
        {view==='list'&&(
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {people.map((p,i)=>(
              <button key={i} onClick={()=>onComment(p)} style={{display:'flex',alignItems:'center',gap:11,background:'var(--surface-1)',
                border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'11px 13px',cursor:'pointer',width:'100%',textAlign:'left',fontFamily:'var(--font-sans)'}}>
                <KAvatar name={p.name} size={38}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--text-primary)'}}>{p.name}</div>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-muted)',marginTop:2}}>{p.role} · offers {p.offer}</div>
                </div>
                <span style={{color:'var(--text-faint)',fontSize:18}} aria-hidden="true">›</span>
              </button>
            ))}
          </div>
        )}
        {view==='flip'&&(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16,paddingTop:8}}>
            <div style={{width:'100%',background:'var(--surface-1)',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',padding:'28px 22px',textAlign:'center'}}>
              <KAvatar name={ROOM[flip].name} size={84} style={{margin:'0 auto'}}/>
              <Display size={22} style={{marginTop:16}}>{ROOM[flip].name}</Display>
              <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)',marginTop:6}}>{ROOM[flip].role}</div>
              <div style={{display:'flex',justifyContent:'center',gap:18,marginTop:18}}>
                <div><div style={{fontSize:10,color:'var(--accent)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>Offers</div><div style={{fontSize:13,color:'var(--text-secondary)',marginTop:3}}>{ROOM[flip].offer}</div></div>
                <div><div style={{fontSize:10,color:'var(--private)',fontFamily:'var(--font-mono)',textTransform:'uppercase'}}>Needs</div><div style={{fontSize:13,color:'var(--text-secondary)',marginTop:3}}>{ROOM[flip].need}</div></div>
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <KButton variant="ghost" onClick={()=>setFlip((flip-1+ROOM.length)%ROOM.length)} icon="←">Prev</KButton>
              <KButton variant="ghost" onClick={()=>setFlip((flip+1)%ROOM.length)}>Next →</KButton>
            </div>
            <MonoLabel>{flip+1} / {ROOM.length}</MonoLabel>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Act 1 · The Drop ---- */
/* After you send, the wall starts empty and answers land one at a time.
   The first beat is the waiting wall: yours alone, framed as first. */
function TheDrop({onDone}){
  const PROMPT='What did you make this week?';
  const [answered,setAnswered]=React.useState(false);
  const [text,setText]=React.useState('');
  const [revealed,setRevealed]=React.useState(false);
  const [landed,setLanded]=React.useState(0);
  React.useEffect(()=>{
    if(!answered)return undefined;
    const id=setInterval(()=>setLanded(n=>n<DROP_ANSWERS.length?n+1:n),1800);
    return ()=>clearInterval(id);
  },[answered]);
  return (
    <CenterScreen>
      <Eyebrow style={{textAlign:'center'}}>The Drop</Eyebrow>
      <Display size={26} style={{textAlign:'center',marginTop:18}}>{PROMPT}</Display>
      {!answered?(
        <>
          <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Answers are landing. Yours can be first."
              rows={3} style={{...inStyle,resize:'none',fontSize:16,lineHeight:1.4}}/>
          </div>
          <KButton block size="lg" disabled={!text.trim()} onClick={()=>setAnswered(true)}>Send it</KButton>
        </>
      ):(
        <>
          <div className="soda-scroll" style={{flex:1,overflowY:'auto',marginTop:20,display:'flex',flexDirection:'column',gap:9}}>
            <MonoLabel style={{marginBottom:4}}>{revealed?'The wall':'On the wall · anonymous'}</MonoLabel>
            {[text,...DROP_ANSWERS.slice(0,landed)].map((a,i)=>(
              <div key={i} style={{background:i===0?'var(--surface-green)':'var(--surface-1)',border:i===0?'none':'1px solid var(--border)',
                borderRadius:'var(--r-md)',padding:'12px 13px'}}>
                <div style={{fontSize:14,color:'var(--text-primary)',fontWeight:300}}>{a||'…'}</div>
                {revealed&&<div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-muted)',marginTop:6}}>{i===0?'You':ROOM[i].name}</div>}
              </div>
            ))}
            {landed===0&&(
              <p style={{textAlign:'center',fontWeight:300,fontSize:13,color:'var(--text-muted)',padding:'14px 0'}}>
                Answers are landing. Yours is first.
              </p>
            )}
          </div>
          {landed>0&&!revealed
            ? <KButton block onClick={()=>setRevealed(true)}>Reveal names</KButton>
            : <KButton block variant="ghost" onClick={onDone}>Back to the room</KButton>}
        </>
      )}
    </CenterScreen>
  );
}

/* ---- Act 2 · The Chance ---- */
function TheChance({onDone}){
  const partner=ROOM[2];
  const [t,setT]=React.useState(120);
  React.useEffect(()=>{const id=setInterval(()=>setT(x=>x>0?x-1:0),1000);return ()=>clearInterval(id);},[]);
  const mm=String(Math.floor(t/60)).padStart(1,'0'), ss=String(t%60).padStart(2,'0');
  return (
    <CenterScreen bg="var(--bg-deep)">
      <Eyebrow style={{textAlign:'center',color:'var(--text-muted)'}}>The Chance</Eyebrow>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
        <Display size={22}>Go meet</Display>
        <KAvatar name={partner.name} size={96} style={{margin:'20px 0 14px'}}/>
        <Display size={26}>{partner.name}</Display>
        <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)',marginTop:6}}>{partner.role}</div>
        <div style={{background:'var(--surface-1)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'13px 15px',marginTop:22,maxWidth:280}}>
          <div style={{fontSize:9,fontFamily:'var(--font-mono)',letterSpacing:'1px',textTransform:'uppercase',color:'var(--accent)',marginBottom:6}}>Starter · from the Drop</div>
          <div style={{fontSize:14,color:'var(--text-primary)',fontWeight:300}}>Ask them about the studio in an old bakery.</div>
        </div>
        <div style={{fontFamily:'var(--font-display)',fontSize:44,color:'var(--warn)',marginTop:26,letterSpacing:'.02em'}}>{mm}:{ss}</div>
        <MonoLabel style={{color:'var(--warn)'}}>on the clock</MonoLabel>
      </div>
      <KButton block variant="ghost" onClick={onDone}>We talked</KButton>
    </CenterScreen>
  );
}

/* ---- Act 3 · The Nudge (private) ---- */
/* `noMatch` is the graceful fallback: same private purple treatment,
   a held nudge instead of a person. It never just vanishes. */
function TheNudge({onDone,noMatch=false}){
  const match=ROOM[0];
  if(noMatch) return (
    <CenterScreen bg="var(--bg-deep)">
      <Eyebrow style={{textAlign:'center',color:'var(--private)'}}>A nudge, for you</Eyebrow>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
        <div style={{width:'100%',maxWidth:300,background:'var(--surface-purple)',border:'1px dashed var(--private-border)',borderRadius:'var(--r-xl)',padding:'26px 22px'}}>
          <div style={{width:84,height:84,borderRadius:'50%',border:'2px dashed var(--private-border)',margin:'0 auto',
            display:'flex',alignItems:'center',justifyContent:'center',color:'var(--private)',fontSize:26}}>✦</div>
          <p style={{fontSize:14.5,color:'var(--text-primary)',fontWeight:300,lineHeight:1.5,marginTop:18}}>
            No single match stood out yet. The night is not over. Keep working the room.
          </p>
          <div style={{height:1,background:'var(--private-border)',margin:'16px 0'}}/>
          <p style={{fontSize:12,color:'var(--private)',fontWeight:300}}>If one appears, it lands right here.</p>
        </div>
        <p style={{fontSize:12,color:'var(--text-faint)',marginTop:16,maxWidth:260}}>Seen only by you. Nothing public, no announcement.</p>
      </div>
      <KButton block variant="ghost" onClick={onDone}>Back to the room</KButton>
    </CenterScreen>
  );
  return (
    <CenterScreen bg="var(--bg-deep)">
      <Eyebrow style={{textAlign:'center',color:'var(--private)'}}>A nudge, for you</Eyebrow>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
        <div style={{width:'100%',maxWidth:300,background:'var(--surface-purple)',border:'1px solid var(--private-border)',borderRadius:'var(--r-xl)',padding:'26px 22px'}}>
          <KAvatar name={match.name} size={84} style={{margin:'0 auto'}}/>
          <Display size={24} style={{marginTop:16}}>{match.name}</Display>
          <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)',marginTop:6}}>{match.role}</div>
          <div style={{height:1,background:'var(--private-border)',margin:'18px 0'}}/>
          <p style={{fontSize:14.5,color:'var(--text-primary)',fontWeight:300,lineHeight:1.45}}>
            They have <b style={{color:'var(--private)',fontWeight:600}}>the capital</b> you came for, and you have the <b style={{color:'var(--private)',fontWeight:600}}>intros</b> they need. Find them before you leave.
          </p>
        </div>
        <p style={{fontSize:12,color:'var(--text-faint)',marginTop:16,maxWidth:260}}>Seen only by you. Nothing public, no announcement.</p>
      </div>
      <KButton block onClick={onDone}>Find them</KButton>
    </CenterScreen>
  );
}

Object.assign(window,{RoomView,TheDrop,TheChance,TheNudge});
