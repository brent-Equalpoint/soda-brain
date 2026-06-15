/* ============================================================
   Admin — the back-office panels: Event setup & identity, lifecycle,
   check-in, chip moderation, matches, export.
   ============================================================ */
const { AAvatar, AMono, APanel, AButton, AField, aInput, A_ROOM, A_CHIPS, A_MATCHES } = window;

/* Event creation + host identity. Identity is editable in draft only:
   locked while live, final once closed. The Event Layer rule, enforced. */
function EventSetup({onToast, phase='draft', actionAlign='center', actionFill=false}){
  const [name,setName]=React.useState('Creative Meetup');
  const [host,setHost]=React.useState('Futureland');
  const [acts,setActs]=React.useState({drop:true,chance:true,nudge:true});
  const toggle=(k)=>setActs(a=>({...a,[k]:!a[k]}));
  const locked=phase!=='draft';
  const lockLine=phase==='live'?'Locked while the event is live.'
    :phase==='closed'?'Final. The event is a record.'
    :phase==='cancelled'?'Final. The event was cancelled.':null;
  const idInput=locked?{...aInput,color:'var(--text-muted)',background:'var(--surface-1)',cursor:'not-allowed'}:aInput;
  return (
    <APanel title="Event setup & host identity"
      right={locked&&<AMono style={{fontSize:10,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',display:'flex',alignItems:'center',gap:7}}>
        <span aria-hidden="true" style={{fontSize:11}}>⚿</span>{lockLine}</AMono>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'0 18px'}}>
        <AField label="Event name · required"><input value={name} disabled={locked} aria-disabled={locked} onChange={e=>setName(e.target.value)} style={idInput}/></AField>
        <AField label="Host name · required"><input value={host} disabled={locked} aria-disabled={locked} onChange={e=>setHost(e.target.value)} style={idInput}/></AField>
        <AField label="Date · required"><input defaultValue="Mar 14, 2026 · 7:00pm" disabled={locked} aria-disabled={locked} style={idInput}/></AField>
        <AField label="Host logo · optional">
          <div style={{display:'flex',alignItems:'center',gap:10,...{}}}>
            <div style={{flex:1,...idInput,display:'flex',alignItems:'center',color:'var(--text-faint)'}}>No logo · host name shown in type</div>
            <AButton variant="ghost" size="sm" icon="↑" disabled={locked}>Upload</AButton>
          </div>
        </AField>
      </div>
      <AField label="Acts enabled">
        <div style={{display:'flex',gap:10}}>
          {[['drop','The Drop'],['chance','The Chance'],['nudge','The Nudge']].map(([k,lb])=>(
            <button key={k} onClick={()=>toggle(k)} style={{flex:1,padding:'10px',borderRadius:'var(--r-md)',cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:13,fontWeight:600,
              background:acts[k]?'var(--accent-soft)':'var(--surface-2)',color:acts[k]?'var(--accent)':'var(--text-muted)',border:`1px solid ${acts[k]?'var(--accent)':'var(--border-strong)'}`}}>
              {acts[k]?'● ':'○ '}{lb}
            </button>
          ))}
        </div>
      </AField>
      <div style={{display:'flex',gap:10,marginTop:6,flexWrap:'wrap',justifyContent:actionAlign==='center'?'center':actionAlign==='right'?'flex-end':'flex-start'}}>
        <AButton style={actionFill?{flex:1}:undefined} disabled={locked} onClick={()=>onToast&&onToast('Event saved as draft')}>Save draft</AButton>
        <AButton variant="ghost" style={actionFill?{flex:1}:undefined} onClick={()=>onToast&&onToast('Preview opened')}>Preview attendee view</AButton>
      </div>
    </APanel>
  );
}

/* Check-in panel */
function CheckIn({onToast}){
  return (
    <APanel title="Manual check-in">
      <p style={{fontSize:13,color:'var(--text-muted)',fontWeight:300,marginBottom:16}}>For a guest who needs help getting in. Writes a profile, same as a scan.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'0 18px'}}>
        <AField label="Name"><input placeholder="Full name" style={aInput}/></AField>
        <AField label="Email"><input placeholder="email@…" style={aInput}/></AField>
      </div>
      <AField label="Role">
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {['Founder','Designer','Engineer','Investor'].map(r=><span key={r} style={{fontFamily:'var(--font-sans)',fontSize:13,padding:'7px 12px',borderRadius:'var(--r-pill)',border:'1px solid var(--border-strong)',background:'var(--surface-2)',color:'var(--text-secondary)',cursor:'pointer'}}>{r}</span>)}
        </div>
      </AField>
      <AButton onClick={()=>onToast&&onToast('Guest checked in')}>Check in guest</AButton>
    </APanel>
  );
}

/* Chip queue moderation */
function ChipQueue({onToast}){
  const [queue,setQueue]=React.useState(window.A_CHIPS);
  const act=(i,ok)=>{setQueue(q=>q.filter((_,x)=>x!==i));onToast&&onToast(ok?'Chip approved':'Chip rejected');};
  return (
    <APanel title="Chip queue & moderation" right={<AMono style={{fontSize:11,color:queue.length?'var(--accent)':'var(--text-muted)'}}>{queue.length} pending</AMono>}>
      {queue.length===0?(
        <div style={{textAlign:'center',padding:'24px 0',color:'var(--text-muted)',fontSize:14}}>Nothing to review. You are caught up.</div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {queue.map((c,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'11px 14px'}}>
              <span style={{fontFamily:'var(--font-sans)',fontSize:14,padding:'6px 12px',borderRadius:'var(--r-pill)',background:'var(--surface-1)',border:'1px solid var(--border-strong)',color:'var(--text-primary)'}}>{c.text}</span>
              <AMono style={{flex:1,fontSize:11,color:'var(--text-muted)'}}>by {c.by}</AMono>
              <AButton size="sm" onClick={()=>act(i,true)}>Approve</AButton>
              <AButton size="sm" variant="ghost" onClick={()=>act(i,false)}>Reject</AButton>
            </div>
          ))}
        </div>
      )}
    </APanel>
  );
}

/* Matches panel */
function MatchesPanel({empty=false}){
  if(empty) return (
    <APanel title="Matches">
      <p style={{textAlign:'center',fontSize:14,fontWeight:300,color:'var(--text-muted)',padding:'20px 0'}}>
        Nothing here yet. It fills as the event runs.
      </p>
    </APanel>
  );
  return (
    <APanel title="Matches" right={<AMono style={{fontSize:11,color:'var(--text-muted)'}}>top connector · Tasha</AMono>}>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {A_MATCHES.map((m,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:12,background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'11px 14px'}}>
            <AAvatar name={m.a} size={32}/>
            <AMono style={{fontSize:12,color:m.mutual?'var(--accent)':'var(--text-muted)'}}>{m.mutual?'⇄':'→'}</AMono>
            <AAvatar name={m.b} size={32}/>
            <div style={{flex:1,fontSize:13,color:'var(--text-secondary)'}}><b style={{color:'var(--text-primary)'}}>{m.a.split(' ')[0]} × {m.b.split(' ')[0]}</b> · {m.why}</div>
            {m.mutual&&<span style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'.5px',textTransform:'uppercase',padding:'4px 9px',borderRadius:'var(--r-pill)',background:'var(--accent-soft)',color:'var(--accent)'}}>Mutual</span>}
          </div>
        ))}
      </div>
    </APanel>
  );
}

/* Export panel */
function ExportPanel({onToast,empty=false}){
  const [busy,setBusy]=React.useState(null);
  const exp=(k)=>{setBusy(k);onToast&&onToast('Preparing export…');setTimeout(()=>{setBusy(null);onToast&&onToast(k+' exported');},900);};
  if(empty) return (
    <APanel title="Export · Futureland owns its data">
      <p style={{textAlign:'center',fontSize:14,fontWeight:300,color:'var(--text-muted)',padding:'20px 0'}}>
        No data to export yet.
      </p>
    </APanel>
  );
  return (
    <APanel title="Export · Futureland owns its data">
      <p style={{fontSize:13,color:'var(--text-muted)',fontWeight:300,marginBottom:16}}>Pull the full record after the event. This is where Futureland's ownership of its event data is exercised.</p>
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
        {['Attendees','Connections','Surveys'].map(k=>(
          <AButton key={k} variant="ghost" icon="↓" disabled={busy} onClick={()=>exp(k)}>{busy===k?'Preparing…':k}</AButton>
        ))}
      </div>
    </APanel>
  );
}

/* QR code generator panel — builds the per-event check-in QR + the
   standalone display page (open / print / download PNG / copy link). */
function QRPanel({onToast}){
  const [host,setHost]=React.useState('Futureland');
  const [event,setEvent]=React.useState('Creative Meetup');
  const [code,setCode]=React.useState('SODA-7F3K');
  const slug=(host.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'event')+'-'+code.toLowerCase();
  const url='https://soda.live/e/'+slug;
  const canvasRef=React.useRef(null);

  React.useEffect(()=>{
    let alive=true;
    const draw=()=>{
      if(!alive)return;
      if(!window.QRCode||!canvasRef.current){ setTimeout(draw,150); return; }
      window.QRCode.toCanvas(canvasRef.current,url,{width:288,margin:1,errorCorrectionLevel:'M',color:{dark:'#111111',light:'#ffffff'}},()=>{
        if(canvasRef.current){ canvasRef.current.style.width='144px'; canvasRef.current.style.height='144px'; }
      });
    };
    draw();
    return ()=>{alive=false;};
  },[url]);

  const displayHref=()=>'qr-display.html?'+new URLSearchParams({host,event,code,url}).toString();
  const openPage=()=>window.open(displayHref(),'_blank');
  const printPage=()=>{const w=window.open(displayHref(),'_blank'); if(w){const t=setInterval(()=>{try{if(w.document.readyState==='complete'){clearInterval(t);setTimeout(()=>w.print(),400);}}catch(e){clearInterval(t);}},200);} onToast&&onToast('Opening print view…');};
  const download=()=>{const c=canvasRef.current; if(!c)return; const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='soda-qr-'+slug+'.png'; a.click(); onToast&&onToast('QR downloaded');};
  const copy=()=>{navigator.clipboard&&navigator.clipboard.writeText(url); onToast&&onToast('Join link copied');};

  const fld={width:'100%',background:'var(--surface-2)',border:'1px solid var(--border-strong)',borderRadius:'var(--r-sm)',padding:'10px 12px',color:'var(--text-primary)',fontFamily:'var(--font-sans)',fontSize:14,outline:'none'};

  return (
    <APanel title="Check-in QR · per event">
      <p style={{fontSize:13,color:'var(--text-muted)',fontWeight:300,marginBottom:18}}>
        Every event gets its own QR. Attendees scan it at the door to check in and build their card. Open the display page on a screen at the entrance, or print it for the table.
      </p>
      <div style={{display:'flex',gap:22,flexWrap:'wrap',alignItems:'flex-start'}}>
        {/* QR preview */}
        <div style={{flex:'0 0 auto'}}>
          <div style={{background:'#fff',borderRadius:'var(--r-lg)',padding:14,width:172,height:172,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <canvas ref={canvasRef} style={{width:144,height:144,imageRendering:'pixelated'}}></canvas>
          </div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-faint)',marginTop:10,textAlign:'center',width:172}}>Scannable preview</div>
        </div>
        {/* config + actions */}
        <div style={{flex:1,minWidth:240}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'0 14px'}}>
            <AField label="Host name"><input value={host} onChange={e=>setHost(e.target.value)} style={fld}/></AField>
            <AField label="Entry code"><input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} style={fld}/></AField>
          </div>
          <AField label="Join link · encoded in the QR">
            <div style={{...fld,display:'flex',alignItems:'center',color:'var(--accent)',fontFamily:'var(--font-mono)',fontSize:12,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{url}</div>
          </AField>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:4}}>
            <AButton icon="⤢" onClick={openPage}>Open display page</AButton>
            <AButton variant="ghost" icon="⎙" onClick={printPage}>Print</AButton>
            <AButton variant="ghost" icon="↓" onClick={download}>PNG</AButton>
            <AButton variant="ghost" icon="⧉" onClick={copy}>Copy link</AButton>
          </div>
        </div>
      </div>
    </APanel>
  );
}

Object.assign(window,{EventSetup,CheckIn,ChipQueue,MatchesPanel,ExportPanel,QRPanel});
