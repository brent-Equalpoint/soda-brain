import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   SODA — Proposed onboarding flow (sheets + multi-focus enrich)
   Entry (one chip) → Room (persistent) → Offer sheet →
   match moment → Detail sheet where each chip holds
   MULTIPLE focuses: type or tap a suggestion to auto-populate,
   live preview forms the phrase, one Save commits the set.
───────────────────────────────────────────── */

const ENTRY_CHIPS = [
  "Looking for work","Hiring","Raising money",
  "Finding collaborators","Offering help","Just exploring",
];
const OFFER_CHIPS = [
  "Introductions","Advice","Mentorship","Feedback",
  "Hiring","Investment","Partnerships",
];
/* suggestion banks that auto-populate per chip category */
const FOCUS_SUGGESTIONS = {
  Introductions:["investors","operators","press","designers","engineers"],
  Advice:["fundraising","go-to-market","hiring","pricing","brand"],
  Mentorship:["design","early-stage","fundraising","go-to-market","engineering"],
  Feedback:["product","pitch deck","brand","UX","landing page"],
  Hiring:["engineering","design","sales","ops","marketing"],
  Investment:["pre-seed","seed","climate","fintech","consumer"],
  Partnerships:["distribution","co-marketing","integrations","events"],
};
const ROOM_PEOPLE = [
  ["Maya Okafor","Founder","#3bd75c"],
  ["Devin Park","Fractional CFO","#a47bff"],
  ["Ife Adeyemi","Design lead","#f59e0b"],
  ["Tomás Rivera","Just sold his startup","#3bd75c"],
];

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
    @keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes pop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
  `}</style>
);

const C = {
  canvas:"#111111",card:"#1a1a1a",border:"#2a2a2a",
  green:"#3bd75c",ink:"#f5f5f5",muted:"#8a8a8a",hint:"#5a5a5a",purple:"#a47bff",
};
const mono = {fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.muted};
const heading = {fontFamily:"'Archivo Black',sans-serif",textTransform:"uppercase",letterSpacing:"-0.02em",lineHeight:1.05,color:C.ink};

const phone = {width:390,background:C.canvas,borderRadius:30,overflow:"hidden",position:"relative",
  boxShadow:"0 0 0 1px #222,0 40px 80px rgba(0,0,0,.7)",fontFamily:"'DM Sans',sans-serif",
  color:C.ink,height:760,display:"flex",flexDirection:"column",userSelect:"none"};
const scroll = {flex:1,overflowY:"auto",padding:"22px 20px 24px"};
const primaryBtn = {width:"100%",height:54,background:C.green,color:C.canvas,borderRadius:11,border:"none",
  fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:700,cursor:"pointer"};
const ghostBtn = {width:"100%",height:48,background:"transparent",color:C.muted,borderRadius:11,
  border:`1px solid ${C.border}`,fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:600,cursor:"pointer"};

function Sheet({open,onClose,children,maxHeight="86%"}){
  return(
    <>
      <div onClick={onClose} style={{position:"absolute",inset:0,zIndex:40,background:"rgba(0,0,0,0.6)",
        opacity:open?1:0,pointerEvents:open?"auto":"none",transition:"opacity 240ms"}}/>
      <div style={{position:"absolute",left:0,right:0,bottom:0,zIndex:50,background:C.card,
        borderTop:`1px solid ${C.border}`,borderRadius:"24px 24px 0 0",
        transform:open?"translateY(0)":"translateY(100%)",
        transition:"transform 320ms cubic-bezier(0.22,1,0.36,1)",maxHeight,
        display:"flex",flexDirection:"column",boxShadow:"0 -16px 40px rgba(0,0,0,.5)"}}>
        <div style={{width:38,height:5,borderRadius:3,background:C.border,margin:"10px auto 4px",flexShrink:0}}/>
        {children}
      </div>
    </>
  );
}

function TopStatus(){
  return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
    padding:"14px 20px 12px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
    <span style={{...mono,fontSize:10}}>FUTURELAND</span>
    <span style={{...mono,fontSize:10,color:C.green,display:"flex",alignItems:"center",gap:6}}>
      <span style={{width:7,height:7,borderRadius:"50%",background:C.green,display:"inline-block"}}/>19 here</span>
  </div>);
}

function Entry({onContinue}){
  const [picked,setPicked]=useState(null);
  return(
    <div style={phone}>
      <div style={scroll}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span style={mono}>Welcome</span><span style={{...mono,color:C.green}}>One step</span></div>
        <div style={{height:3,background:C.border,borderRadius:2,margin:"10px 0 28px"}}>
          <div style={{height:"100%",width:"100%",background:C.green,borderRadius:2}}/></div>
        <h1 style={{...heading,fontSize:30,marginBottom:10}}>Why are<br/>you here<br/>tonight?</h1>
        <p style={{color:C.muted,fontSize:14,marginBottom:26}}>Pick one. You are in the room the moment you do.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {ENTRY_CHIPS.map(c=>{const sel=picked===c;return(
            <button key={c} onClick={()=>setPicked(c)} style={{height:56,borderRadius:14,cursor:"pointer",
              textAlign:"left",padding:"0 18px",fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,
              transition:"all 150ms",background:sel?C.green:"transparent",color:sel?C.canvas:C.ink,
              border:`1px solid ${sel?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              {c}{sel&&<span style={{fontSize:18}}>✓</span>}</button>);})}
        </div>
      </div>
      <div style={{padding:"14px 20px 26px",background:`linear-gradient(transparent,${C.canvas} 30%)`}}>
        <button style={{...primaryBtn,opacity:picked?1:.4,pointerEvents:picked?"auto":"none"}}
          onClick={()=>onContinue(picked)}>{picked?"Enter the room":"Pick one to continue"}</button>
      </div>
    </div>
  );
}

/* ── one chip's multi-focus editor row ── */
function FocusRow({chip,focuses,setFocuses}){
  const [draft,setDraft]=useState("");
  const inputRef=useRef(null);
  const list=focuses[chip]||[];

  const add=(val)=>{
    const v=val.trim();
    if(!v||list.includes(v)) {setDraft("");return;}
    setFocuses(p=>({...p,[chip]:[...(p[chip]||[]),v]}));
    setDraft("");
    setTimeout(()=>inputRef.current?.focus(),0);
  };
  const remove=(val)=>setFocuses(p=>({...p,[chip]:(p[chip]||[]).filter(f=>f!==val)}));

  const suggestions=(FOCUS_SUGGESTIONS[chip]||[]).filter(s=>!list.includes(s)).slice(0,5);

  return(
    <div style={{background:C.canvas,border:`1px solid ${list.length?C.green:C.border}`,
      borderRadius:14,padding:"12px 14px",transition:"border-color 150ms"}}>
      {/* live preview line */}
      <div style={{display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap",marginBottom:10}}>
        <span style={{color:C.green,fontWeight:700,fontSize:14}}>{chip}</span>
        {list.length>0&&<span style={{color:C.muted,fontSize:13}}>in</span>}
        <span style={{color:C.ink,fontSize:14,fontWeight:500}}>
          {list.length>0?list.join(", "):<span style={{color:C.hint,fontSize:13,fontWeight:400}}>add a focus or two</span>}
        </span>
      </div>

      {/* committed focus tags */}
      {list.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
          {list.map(f=>(
            <span key={f} style={{display:"inline-flex",alignItems:"center",gap:6,animation:"pop 160ms",
              background:"rgba(59,215,92,0.12)",border:"1px solid rgba(59,215,92,0.35)",
              borderRadius:9999,padding:"4px 6px 4px 11px",fontSize:12,color:C.green,fontWeight:600}}>
              {f}
              <button onClick={()=>remove(f)} style={{background:"none",border:"none",color:C.green,
                cursor:"pointer",fontSize:13,lineHeight:1,width:18,height:18,opacity:.7}}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* input: type + enter/comma to commit */}
      <input ref={inputRef} value={draft}
        onChange={e=>{
          const v=e.target.value;
          if(v.endsWith(",")) add(v.slice(0,-1)); else setDraft(v);
        }}
        onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add(draft);}
          if(e.key==="Backspace"&&!draft&&list.length){remove(list[list.length-1]);}}}
        placeholder={list.length?"add another, press enter":"type a focus, press enter"}
        style={{width:"100%",background:"transparent",border:"none",outline:"none",color:C.ink,
          fontSize:14,fontFamily:"'DM Sans',sans-serif",padding:"4px 0"}}/>

      {/* auto-populate suggestions */}
      {suggestions.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
          <span style={{...mono,fontSize:9,color:C.hint,width:"100%",marginBottom:2}}>Tap to add</span>
          {suggestions.map(sug=>(
            <button key={sug} onClick={()=>add(sug)} style={{borderRadius:9999,padding:"6px 12px",
              fontSize:12,fontWeight:500,cursor:"pointer",background:"transparent",
              border:`1px solid ${C.border}`,color:C.muted,transition:"all 120ms"}}
              onMouseDown={e=>e.preventDefault()}>+ {sug}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function RoomScene({entryChip,offers,setOffers,focuses,setFocuses}){
  const [sheet,setSheet]=useState(null);
  const [bannerGone,setBannerGone]=useState(false);
  const [momentReady,setMomentReady]=useState(false);
  const [toast,setToast]=useState(false);

  const hasOffers=offers.size>0;
  const hasFocus=Object.values(focuses).some(a=>a&&a.length);

  useEffect(()=>{
    if(hasOffers&&!hasFocus){const t=setTimeout(()=>setMomentReady(true),900);return()=>clearTimeout(t);}
  },[hasOffers,hasFocus]);

  const toggleOffer=c=>setOffers(p=>{const n=new Set(p);n.has(c)?n.delete(c):n.add(c);return n;});
  const label=o=>{const f=focuses[o];return f&&f.length?`${o} in ${f.join(", ")}`:o;};

  const saveFocus=()=>{setSheet(null);setToast(true);setTimeout(()=>setToast(false),2200);};

  return(
    <div style={{...phone,padding:0}}>
      <TopStatus/>
      <div style={scroll}>
        <span style={{...mono,color:C.green}}>In the room</span>
        <h1 style={{...heading,fontSize:34,margin:"6px 0 4px"}}>19 people</h1>
        <p style={{color:C.muted,fontSize:13,marginBottom:8}}>
          You are here for <span style={{color:C.ink,fontWeight:600}}>{entryChip}</span>.</p>

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16,margin:"14px 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:hasOffers?12:0}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:C.purple,display:"flex",
              alignItems:"center",justifyContent:"center",color:C.canvas,fontWeight:700,fontSize:14}}>AE</div>
            <div><div style={{fontWeight:700}}>You</div>
              <div style={{...mono,fontSize:10,marginTop:1}}>Here for {entryChip}</div></div>
          </div>
          {hasOffers&&(
            <div>
              <div style={{...mono,fontSize:10,color:C.green,marginBottom:8}}>You offer</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {[...offers].map(o=>(
                  <span key={o} style={{borderRadius:9999,padding:"5px 11px",fontSize:12,fontWeight:600,
                    background:"rgba(59,215,92,0.1)",border:"1px solid rgba(59,215,92,0.3)",color:C.green}}>{label(o)}</span>
                ))}
              </div>
              <button onClick={()=>setSheet("offer")} style={{background:"none",border:"none",color:C.muted,
                ...mono,fontSize:10,marginTop:12,cursor:"pointer",padding:0}}>+ edit offers</button>
            </div>
          )}
        </div>

        {ROOM_PEOPLE.map(([n,r,col])=>(
          <div key={n} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:"1px solid #1e1e1e"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:col,flexShrink:0,display:"flex",
              alignItems:"center",justifyContent:"center",color:C.canvas,fontWeight:700,fontSize:14}}>
              {n.split(" ").map(w=>w[0]).join("")}</div>
            <div><div style={{fontWeight:600}}>{n}</div><div style={{color:C.muted,fontSize:13}}>{r}</div></div>
          </div>
        ))}
      </div>

      {momentReady&&!hasFocus&&hasOffers&&!sheet&&(
        <div style={{position:"absolute",left:14,right:14,bottom:96,zIndex:30,background:C.card,
          border:`1px solid ${C.purple}`,borderRadius:16,padding:16,animation:"rise 280ms",boxShadow:"0 12px 32px rgba(0,0,0,.5)"}}>
          <div style={{...mono,fontSize:10,color:C.purple,marginBottom:8}}>✦ A match in the room</div>
          <p style={{fontSize:15,lineHeight:1.4,marginBottom:14}}>
            You and <b>Maya</b> both offer <b>Mentorship</b>. Add a focus or two so the room knows where.</p>
          <button style={{...primaryBtn,height:46,background:C.purple,color:C.canvas}}
            onClick={()=>setSheet("enrich")}>Sharpen my matches</button>
        </div>
      )}

      {!hasOffers&&!bannerGone&&!sheet&&(
        <div style={{position:"absolute",left:14,right:14,bottom:96,zIndex:25,background:C.card,
          border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 16px",display:"flex",
          alignItems:"center",gap:12,animation:"rise 280ms",boxShadow:"0 12px 32px rgba(0,0,0,.5)"}}>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,marginBottom:2}}>Tell the room what you offer</div>
            <div style={{color:C.muted,fontSize:12}}>About 20 seconds. Optional.</div></div>
          <button onClick={()=>setSheet("offer")} style={{...primaryBtn,width:"auto",height:42,padding:"0 16px",fontSize:14}}>Add</button>
          <button onClick={()=>setBannerGone(true)} style={{background:"none",border:"none",color:C.muted,
            fontSize:22,cursor:"pointer",width:32,height:42,flexShrink:0}}>×</button>
        </div>
      )}

      {/* save confirmation toast */}
      {toast&&(
        <div style={{position:"absolute",left:"50%",bottom:96,transform:"translateX(-50%)",zIndex:35,
          background:"#202220",border:`1px solid ${C.border}`,borderRadius:9999,padding:"11px 18px",
          fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:9,animation:"rise 220ms",
          boxShadow:"0 12px 32px rgba(0,0,0,.5)",whiteSpace:"nowrap"}}>
          <span style={{color:C.green}}>✓</span> Card updated. Your matches just got sharper.</div>
      )}

      <div style={{display:"flex",borderTop:`1px solid ${C.border}`,padding:"10px 8px 14px",background:C.canvas,flexShrink:0}}>
        {["Room","People","You"].map((t,i)=>(
          <div key={t} style={{flex:1,textAlign:"center",color:i===0?C.green:C.muted,fontSize:11,fontWeight:600}}>
            <div style={{fontSize:20,marginBottom:2}}>{["⌂","◎","◐"][i]}</div>{t}</div>))}
      </div>

      {/* OFFER SHEET */}
      <Sheet open={sheet==="offer"} onClose={()=>setSheet(null)}>
        <div style={{padding:"6px 20px 0",overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={mono}>Your card · optional</span>
            <button onClick={()=>setSheet(null)} style={{background:"none",border:"none",color:C.muted,...mono,cursor:"pointer"}}>Close</button></div>
          <h2 style={{...heading,fontSize:24,margin:"6px 0 8px"}}>What can you offer?</h2>
          <p style={{color:C.muted,fontSize:14,marginBottom:20}}>Tap a few. Sharpen them later when the room finds you a match.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
            {OFFER_CHIPS.map(c=>{const sel=offers.has(c);return(
              <button key={c} onClick={()=>toggleOffer(c)} style={{minHeight:46,borderRadius:9999,padding:"0 16px",
                fontSize:14,fontWeight:600,cursor:"pointer",transition:"all 150ms",border:`1px solid ${sel?C.green:C.border}`,
                background:sel?C.green:"transparent",color:sel?C.canvas:C.muted}}>{c}</button>);})}
          </div>
        </div>
        <div style={{padding:"14px 20px 26px",flexShrink:0}}>
          <button style={primaryBtn} onClick={()=>setSheet(null)}>{offers.size?`Add ${offers.size} to your card`:"Done"}</button>
        </div>
      </Sheet>

      {/* ENRICH SHEET, multi-focus */}
      <Sheet open={sheet==="enrich"} onClose={()=>setSheet(null)} maxHeight="84%">
        <div style={{padding:"6px 20px 0",overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{...mono,color:C.purple}}>✦ Sharpen your matches</span>
            <button onClick={()=>setSheet(null)} style={{background:"none",border:"none",color:C.muted,...mono,cursor:"pointer"}}>Close</button></div>
          <h2 style={{...heading,fontSize:23,margin:"6px 0 10px"}}>Add your focus</h2>
          <p style={{color:C.muted,fontSize:14,marginBottom:18,lineHeight:1.45}}>
            Add one focus or several per chip. Type and press enter, or tap a suggestion. The room matches on the specifics.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[...offers].map(o=>(
              <FocusRow key={o} chip={o} focuses={focuses} setFocuses={setFocuses}/>
            ))}
          </div>
        </div>
        <div style={{padding:"14px 20px 26px",display:"flex",flexDirection:"column",gap:10,flexShrink:0}}>
          <button style={{...primaryBtn,opacity:hasFocus?1:.5}} onClick={saveFocus}>
            {hasFocus?"Save to my card":"Save"}</button>
          <button style={ghostBtn} onClick={()=>setSheet(null)}>Skip for now</button>
        </div>
      </Sheet>
    </div>
  );
}

const NOTES = {
  entry:["1 · Entry","One question, one chip, full screen. The only gate. Pick and you are in."],
  room:["2 · The room + sheets","The room is permanent. Offers and focus slide up as sheets. In the focus sheet, each chip holds multiple focuses: type and press enter to commit a tag, or tap a suggestion to auto-populate. The preview forms live (Mentorship in design, early-stage), and one Save writes the whole set to your card."],
};

export default function App(){
  const [entered,setEntered]=useState(false);
  const [entryChip,setEntryChip]=useState(null);
  const [offers,setOffers]=useState(new Set());
  const [focuses,setFocuses]=useState({});   // { chip: [focus, focus] }
  const note=entered?NOTES.room:NOTES.entry;

  return(
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",
      alignItems:"center",padding:"26px 16px 44px",gap:22,fontFamily:"'DM Sans',sans-serif"}}>
      <Fonts/>
      <div style={{display:"flex",gap:6,width:"100%",maxWidth:390}}>
        {[0,1].map(i=>(<div key={i} style={{flex:1,height:4,borderRadius:2,background:(entered?1:0)>=i?C.green:"#2a2a2a"}}/>))}
      </div>
      <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:12,padding:"13px 16px",maxWidth:390,width:"100%"}}>
        <div style={{...mono,color:C.green,fontSize:10,marginBottom:5}}>{note[0]}</div>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{note[1]}</p>
      </div>
      <div style={{maxWidth:390,width:"100%"}}>
        {!entered
          ? <Entry onContinue={c=>{setEntryChip(c);setEntered(true);}}/>
          : <RoomScene entryChip={entryChip} offers={offers} setOffers={setOffers} focuses={focuses} setFocuses={setFocuses}/>}
      </div>
      <button onClick={()=>{setEntered(false);setEntryChip(null);setOffers(new Set());setFocuses({});}}
        style={{background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#8a8a8a",borderRadius:9,
        padding:"9px 16px",fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.06em",cursor:"pointer"}}>↻ Restart flow</button>
      <p style={{...mono,fontSize:10,color:"#3a3a3a",textAlign:"center",maxWidth:360,lineHeight:1.5}}>
        Enter → add offers → match surfaces → open focus sheet → type or tap suggestions to add several → Save
      </p>
    </div>
  );
}
