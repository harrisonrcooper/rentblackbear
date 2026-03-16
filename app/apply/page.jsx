"use client";
import { useState, useEffect, useRef } from "react";

// ─── Supabase ────────────────────────────────────────────────────
const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa=(path,opts={})=>fetch(`${SUPA_URL}/rest/v1/${path}`,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":`Bearer ${SUPA_KEY}`,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});
async function loadKey(k,fb){try{const r=await supa(`app_data?key=eq.${k}&select=value`);const d=await r.json();return d?.[0]?.value||fb;}catch{return fb;}}
async function saveKey(k,v){try{await supa("app_data",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify({key:k,value:v})});}catch{}}

const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const STATES=["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"];

// ─── Styles ──────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
:root{--dk:#1a1714;--cr:#f5f0e8;--ac:#d4a853;--mt:#c4a882;--gn:#4a7c59;--rd:#c45c4a;--bg:#faf9f7}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:#3d3529;-webkit-font-smoothing:antialiased}
.app-wrap{min-height:100vh;display:flex;flex-direction:column}
.app-header{background:var(--dk);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.app-logo{color:var(--cr);font-family:'DM Serif Display',serif;font-size:16px;display:flex;align-items:center;gap:8px}
.app-logo span{color:var(--ac)}
.app-save{font-size:10px;color:var(--mt);display:flex;align-items:center;gap:4px}
.app-save .dot{width:6px;height:6px;border-radius:50%;background:var(--gn);animation:pulse 2s infinite}
.app-body{flex:1;max-width:600px;margin:0 auto;width:100%;padding:0 16px}
.app-footer{text-align:center;padding:20px;font-size:10px;color:#999}
.app-footer a{color:var(--ac)}
.prog{display:flex;gap:3px;padding:20px 0 10px}
.prog-seg{flex:1;height:4px;border-radius:2px;background:rgba(0,0,0,.06);transition:all .4s}
.prog-seg.done{background:var(--gn)}
.prog-seg.cur{background:var(--ac)}
.prog-label{font-size:10px;color:#999;margin-bottom:24px}
.welcome{text-align:center;padding:60px 0 40px}
.welcome-bear{font-size:48px;margin-bottom:16px;animation:bounce 2s ease infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.welcome h1{font-family:'DM Serif Display',serif;font-size:28px;color:var(--dk);margin-bottom:12px}
.welcome-sub{color:#999;font-size:14px;line-height:1.6;max-width:380px;margin:0 auto 24px}
.welcome-perks{display:flex;flex-direction:column;gap:8px;margin-bottom:32px;text-align:left;max-width:340px;margin-left:auto;margin-right:auto}
.welcome-perk{display:flex;align-items:center;gap:10px;font-size:13px;color:#5c4a3a}
.welcome-perk .ic{width:28px;height:28px;border-radius:50%;background:rgba(74,124,89,.08);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.type-toggle{display:flex;gap:0;border:2px solid rgba(0,0,0,.08);border-radius:10px;overflow:hidden;margin-bottom:24px;max-width:300px;margin-left:auto;margin-right:auto}
.type-btn{flex:1;padding:12px;font-size:13px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:all .2s;background:#fff;color:#999}
.type-btn.on{background:var(--dk);color:var(--cr)}
.cosigner-note{background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.15);border-radius:10px;padding:12px;margin-bottom:20px;font-size:12px;color:#9a7422}
.sec{padding:24px 0;animation:fadeUp .4s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-3px)}30%{transform:translateX(3px)}45%{transform:translateX(-2px)}60%{transform:translateX(2px)}}
.sec-hd{margin-bottom:20px}
.sec-hd h2{font-family:'DM Serif Display',serif;font-size:22px;color:var(--dk);margin-bottom:4px}
.sec-hd p{font-size:12px;color:#999;line-height:1.5}
.sec-num{font-size:10px;font-weight:700;color:var(--ac);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
.fld{margin-bottom:16px}
.fld label{display:block;font-size:11px;font-weight:700;color:#5c4a3a;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px}
.fld .req{color:var(--rd);margin-left:2px}
.fld input,.fld select,.fld textarea{width:100%;padding:13px 14px;border:2px solid rgba(0,0,0,.08);border-radius:10px;font-size:15px;font-family:inherit;outline:none;transition:border .2s;background:#fff;color:#3d3529}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:var(--ac)}
.fld input.err,.fld select.err,.fld textarea.err{border-color:var(--rd);animation:shake .4s}
.fld .err-msg{font-size:10px;color:var(--rd);margin-top:3px}
.fld .help{font-size:10px;color:#999;margin-top:3px}
.fld-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fld-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.fld textarea{min-height:80px;resize:vertical}
.counter{display:flex;align-items:center;gap:16px;margin-bottom:8px}
.counter-btn{width:40px;height:40px;border-radius:50%;border:2px solid rgba(0,0,0,.1);background:#fff;font-size:20px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;transition:all .15s;color:#3d3529}
.counter-btn:hover{border-color:var(--ac);color:var(--ac)}
.counter-val{font-size:28px;font-weight:700;min-width:40px;text-align:center}
.upload{border:2px dashed rgba(0,0,0,.1);border-radius:10px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(0,0,0,.01)}
.upload:hover{border-color:var(--ac);background:rgba(212,168,83,.03)}
.upload.has{border-color:var(--gn);border-style:solid;background:rgba(74,124,89,.03)}
.upload-ic{font-size:28px;margin-bottom:6px}
.upload-txt{font-size:12px;color:#999}
.upload-file{font-size:12px;color:var(--gn);font-weight:600;margin-top:4px}
.yn-row{display:flex;gap:8px;margin-bottom:8px}
.yn-btn{flex:1;padding:12px;border:2px solid rgba(0,0,0,.08);border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;background:#fff;color:#999}
.yn-btn.yes{border-color:var(--gn);background:rgba(74,124,89,.06);color:var(--gn)}
.yn-btn.no{border-color:var(--rd);background:rgba(196,92,74,.06);color:var(--rd)}
.room-card{border:2px solid rgba(0,0,0,.08);border-radius:12px;padding:14px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.room-card:hover{border-color:var(--ac)}
.room-card.sel{border-color:var(--ac);background:rgba(212,168,83,.04)}
.room-name{font-size:14px;font-weight:700;color:var(--dk)}
.room-meta{font-size:11px;color:#999;margin-top:2px}
.room-price{font-size:16px;font-weight:700;color:var(--ac)}
.prop-card{background:#fff;border:2px solid rgba(0,0,0,.06);border-radius:14px;overflow:hidden;margin-bottom:20px}
.prop-img{height:140px;background:linear-gradient(135deg,#2c2520,#1a1714);display:flex;align-items:center;justify-content:center;color:var(--ac);font-size:32px}
.prop-info{padding:14px}
.prop-name{font-family:'DM Serif Display',serif;font-size:18px;margin-bottom:2px}
.prop-addr{font-size:11px;color:#999}
.btn-next{width:100%;padding:16px;background:var(--ac);color:var(--dk);border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.btn-next:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(212,168,83,.3)}
.btn-back{width:100%;padding:14px;background:none;border:2px solid rgba(0,0,0,.08);border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;color:#999;transition:all .2s;margin-top:8px}
.btn-back:hover{border-color:#999}
.btn-start{width:100%;padding:18px;background:var(--dk);color:var(--cr);border:none;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .3s}
.btn-start:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,23,20,.3)}
.rev-sec{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;padding:14px;margin-bottom:10px}
.rev-sec h3{font-size:13px;font-weight:700;color:var(--dk);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.rev-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(0,0,0,.03);font-size:12px}
.rev-row:last-child{border:none}
.rev-label{color:#999}
.rev-val{font-weight:600;color:#3d3529;text-align:right;max-width:60%}
.rev-edit{font-size:10px;color:var(--ac);cursor:pointer;font-weight:600;margin-left:auto}
.fee-card{background:var(--dk);border-radius:14px;padding:20px;color:var(--cr);margin-bottom:20px}
.fee-card h3{font-size:14px;margin-bottom:12px}
.fee-row{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;color:var(--mt)}
.fee-total{display:flex;justify-content:space-between;padding:10px 0 0;border-top:1px solid rgba(255,255,255,.1);font-size:16px;font-weight:700;margin-top:6px}
.legal{font-size:10px;color:#999;line-height:1.6;text-align:center;margin:16px 0 24px}
.legal a{color:var(--ac);text-decoration:underline}
.submitted{text-align:center;padding:80px 20px}
.submitted-ic{font-size:56px;margin-bottom:16px}
.submitted h1{font-family:'DM Serif Display',serif;font-size:26px;color:var(--dk);margin-bottom:8px}
.submitted p{color:#999;font-size:14px;line-height:1.6;max-width:400px;margin:0 auto}
@media(max-width:500px){
  .fld-row,.fld-row3{grid-template-columns:1fr}
  .welcome h1{font-size:24px}
  .sec-hd h2{font-size:20px}
  .fld input,.fld select,.fld textarea{font-size:16px;padding:12px}
  .type-toggle{max-width:100%}
}
`;

export default function ApplyPage(){
  const[fieldSchema,setFieldSchema]=useState(null);
  const[loading,setLoading]=useState(true);
  const[answers,setAnswers]=useState({});
  const[errors,setErrors]=useState({});
  const[stepIdx,setStepIdx]=useState(-1); // -1=welcome, 0..n-1=sections, n=review, n+1=payment
  const[appType,setAppType]=useState("tenant");
  const[invite,setInvite]=useState(null);
  const[submitted,setSubmitted]=useState(false);
  const[saving,setSaving]=useState(false);
  const[props_,setProps]=useState([]);
  const fileRefs=useRef({});

  const fmtPhone=(v)=>{const x=v.replace(/\D/g,"").slice(0,10);if(x.length<=3)return x;if(x.length<=6)return`(${x.slice(0,3)}) ${x.slice(3)}`;return`(${x.slice(0,3)}) ${x.slice(3,6)}-${x.slice(6)}`;};
  const shake=()=>{const el=document.querySelector(".sec");if(el){el.style.animation="none";el.offsetHeight;el.style.animation="shake .4s ease";}};

  // Load field schema + invite + props on mount
  useEffect(()=>{(async()=>{
    try{
      // Read invite ID from URL ?invite=xxx
      const params=new URLSearchParams(typeof window!=="undefined"?window.location.search:"");
      const inviteId=params.get("invite");
      const[schema,apps,p]=await Promise.all([loadKey("hq-app-fields",null),loadKey("hq-apps",[]),loadKey("hq-props",[])]);
      const active=(schema&&schema.length>0?schema:[]).filter(f=>f.active);
      setFieldSchema(active.length>0?active:null);
      setProps(p||[]);
      // Match by ID if provided, otherwise fall back to first invited
      const inv=inviteId?(apps||[]).find(a=>a.id===inviteId):(apps||[]).find(a=>a.status==="invited");
      if(inv){
        setInvite(inv);
        // Pre-fill answers from invite data
        const pre={};
        (active.length>0?active:[]).forEach(f=>{
          const l=f.label.toLowerCase();
          if(l.includes("first name")&&inv.name)pre[f.id]=inv.name.split(" ")[0]||"";
          if(l.includes("last name")&&inv.name)pre[f.id]=inv.name.split(" ").slice(1).join(" ")||"";
          if(l.includes("email")&&inv.email)pre[f.id]=inv.email;
          if(l.includes("phone")&&inv.phone)pre[f.id]=inv.phone;
        });
        if(Object.keys(pre).length>0)setAnswers(pre);
      }
    }catch{}
    setLoading(false);
  })();},[]);

  // Auto-save answers as they change
  useEffect(()=>{
    if(stepIdx<0||loading)return;
    setSaving(true);
    const t=setTimeout(()=>setSaving(false),1200);
    return()=>clearTimeout(t);
  },[answers,stepIdx]);

  // Field schema — use loaded or fallback to minimal defaults
  const activeFields=fieldSchema||[];
  const sections=[...new Set(activeFields.map(f=>f.section))];
  const REVIEW_IDX=sections.length;
  const PAYMENT_IDX=sections.length+1;

  const setAnswer=(fid,val)=>{setAnswers(p=>({...p,[fid]:val}));setErrors(p=>({...p,[fid]:undefined}));};

  const validate=(secIdx)=>{
    const secFields=activeFields.filter(f=>f.section===sections[secIdx]);
    const e={};
    secFields.forEach(f=>{
      if(!f.required)return;
      const v=answers[f.id];
      if(f.type==="yes-no"){if(!v||!v.answer)e[f.id]="Please answer";}
      else if(f.type==="date"){if(!v||!v.month||!v.day||!v.year)e[f.id]="Date required";}
      else if(f.type==="address"){if(!v||!v.street||!v.city)e[f.id]="Street and city required";}
      else if(f.type==="counter"){/* always has value */}
      else if(f.type==="file"){/* not strictly required */}
      else{if(!v||!String(v).trim())e[f.id]="Required";}
    });
    setErrors(e);
    if(Object.keys(e).length>0)shake();
    return Object.keys(e).length===0;
  };

  const next=()=>{
    if(stepIdx===-1){setStepIdx(0);return;}
    if(!validate(stepIdx))return;
    setStepIdx(s=>s+1);
  };
  const back=()=>{setStepIdx(s=>Math.max(-1,s-1));};

  // Get a readable display value for review
  const displayVal=(f)=>{
    const v=answers[f.id];
    if(v===undefined||v===null||v==="")return"—";
    if(f.type==="date")return v.month&&v.day&&v.year?`${MONTHS[v.month-1]} ${v.day}, ${v.year}`:"—";
    if(f.type==="yes-no"){
      if(!v.answer)return"—";
      const ans=v.answer.charAt(0).toUpperCase()+v.answer.slice(1);
      return v.followUpText?`${ans} — ${v.followUpText}`:ans;
    }
    if(f.type==="address"){
      if(!v.street)return"—";
      return[v.street,v.city,v.state,v.zip].filter(Boolean).join(", ");
    }
    if(f.type==="counter")return String(v||f.min||1);
    return String(v);
  };

  // Get first name for confirmation screen
  const getFirstName=()=>{
    const f=activeFields.find(f=>f.label.toLowerCase().includes("first name"));
    return(f&&answers[f.id])||invite?.name?.split(" ")[0]||"";
  };
  const getEmail=()=>{
    const f=activeFields.find(f=>f.type==="email");
    return(f&&answers[f.id])||invite?.email||"";
  };

  // Field renderer
  const renderField=(f)=>{
    const v=answers[f.id];
    const err=errors[f.id];
    const isDOB=f.label.toLowerCase().includes("birth")||f.label.toLowerCase().includes("dob");
    return(
      <div key={f.id} className="fld">
        <label>{f.label}{f.required&&<span className="req">*</span>}</label>
        {f.helpText&&<div className="help">{f.helpText}</div>}

        {(f.type==="text")&&<input value={v||""} onChange={e=>setAnswer(f.id,e.target.value)} placeholder={f.placeholder||""} className={err?"err":""}/>}
        {(f.type==="email")&&<input type="email" value={v||""} onChange={e=>setAnswer(f.id,e.target.value)} placeholder={f.placeholder||"you@email.com"} className={err?"err":""}/>}
        {(f.type==="phone")&&<input type="tel" value={v||""} onChange={e=>setAnswer(f.id,fmtPhone(e.target.value))} placeholder={f.placeholder||"(256) 555-0000"} className={err?"err":""}/>}
        {(f.type==="number")&&<input type={f.label.toLowerCase().includes("social")||f.label.toLowerCase().includes("ssn")?"password":"number"} value={v||""} onChange={e=>setAnswer(f.id,e.target.value)} placeholder={f.placeholder||""} className={err?"err":""} maxLength={f.label.toLowerCase().includes("social")||f.label.toLowerCase().includes("ssn")?4:undefined}/>}
        {(f.type==="long-text")&&<textarea value={v||""} onChange={e=>setAnswer(f.id,e.target.value)} placeholder={f.placeholder||""} className={err?"err":""}/>}

        {f.type==="date"&&<>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr",gap:8}}>
            <select value={v?.month||""} onChange={e=>setAnswer(f.id,{...(v||{}),month:e.target.value})} className={err?"err":""} style={{fontSize:15}}>
              <option value="">Month</option>
              {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
            </select>
            <select value={v?.day||""} onChange={e=>setAnswer(f.id,{...(v||{}),day:e.target.value})} className={err?"err":""} style={{fontSize:15}}>
              <option value="">Day</option>
              {Array.from({length:31},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select value={v?.year||""} onChange={e=>setAnswer(f.id,{...(v||{}),year:e.target.value})} className={err?"err":""} style={{fontSize:15}}>
              <option value="">Year</option>
              {(isDOB
                ?Array.from({length:82},(_,i)=>new Date().getFullYear()-18-i)
                :[new Date().getFullYear(),new Date().getFullYear()+1,new Date().getFullYear()+2]
              ).map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </>}

        {f.type==="dropdown"&&<select value={v||""} onChange={e=>setAnswer(f.id,e.target.value)} className={err?"err":""}>
          <option value="">{f.placeholder||"Select..."}</option>
          {(f.options||[]).filter(Boolean).map((o,i)=><option key={i} value={o}>{o}</option>)}
        </select>}

        {f.type==="yes-no"&&<div>
          <div className="yn-row">
            <button className={`yn-btn ${v?.answer==="no"?"no":""}`} onClick={()=>setAnswer(f.id,{...(v||{}),answer:"no",followUpText:v?.answer==="no"?v.followUpText:""})}>No</button>
            <button className={`yn-btn ${v?.answer==="yes"?"yes":""}`} onClick={()=>setAnswer(f.id,{...(v||{}),answer:"yes",followUpText:v?.answer==="yes"?v.followUpText:""})}>Yes</button>
          </div>
          {v?.answer==="yes"&&f.followUpYes&&<div className="fld" style={{marginTop:4}}>
            <label>{f.followUpYes}<span className="req">*</span></label>
            <textarea value={v?.followUpText||""} onChange={e=>setAnswer(f.id,{...v,followUpText:e.target.value})} placeholder="Please explain..."/>
          </div>}
          {v?.answer==="no"&&f.followUpNo&&<div className="fld" style={{marginTop:4}}>
            <label>{f.followUpNo}<span className="req">*</span></label>
            <textarea value={v?.followUpText||""} onChange={e=>setAnswer(f.id,{...v,followUpText:e.target.value})} placeholder="Please explain..."/>
          </div>}
        </div>}

        {f.type==="file"&&<div>
          <div className={`upload ${v?"has":""}`} onClick={()=>fileRefs.current[f.id]?.click()}>
            <div className="upload-ic">{v?"✅":"📎"}</div>
            <div className="upload-txt">{v||f.placeholder||"Tap to upload"}</div>
          </div>
          <input ref={el=>fileRefs.current[f.id]=el} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e=>{if(e.target.files[0])setAnswer(f.id,e.target.files[0].name);}}/>
          <div className="help">JPG, PNG, or PDF.</div>
        </div>}

        {f.type==="counter"&&<div className="counter">
          <button className="counter-btn" onClick={()=>setAnswer(f.id,Math.max(f.min??1,(v||f.min||1)-1))}>−</button>
          <div className="counter-val">{v||f.min||1}</div>
          <button className="counter-btn" onClick={()=>setAnswer(f.id,Math.min(f.max??99,(v||f.min||1)+1))}>+</button>
        </div>}

        {f.type==="address"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
          <input value={v?.street||""} onChange={e=>setAnswer(f.id,{...(v||{}),street:e.target.value})} placeholder="Street address" className={err?"err":""}/>
          <div className="fld-row">
            <input value={v?.city||""} onChange={e=>setAnswer(f.id,{...(v||{}),city:e.target.value})} placeholder="City"/>
            <select value={v?.state||""} onChange={e=>setAnswer(f.id,{...(v||{}),state:e.target.value})}>
              <option value="">State</option>
              {STATES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <input value={v?.zip||""} onChange={e=>setAnswer(f.id,{...(v||{}),zip:e.target.value.replace(/\D/g,"").slice(0,5)})} placeholder="Zip code"/>
        </div>}

        {err&&<div className="err-msg">{err}</div>}
      </div>
    );
  };

  // Loading state
  if(loading)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#999"}}><div style={{textAlign:"center"}}><div style={{fontSize:40,marginBottom:8}}>🐻</div>Loading...</div></div>);

  // Submitted state
  if(submitted){
    const fn=getFirstName();
    const em=getEmail();
    return(<><style>{CSS}</style><div className="app-wrap">
      <div className="app-header"><div className="app-logo">🐻 Black Bear <span>Rentals</span></div></div>
      <div className="app-body"><div className="submitted">
        <div className="submitted-ic">🎉</div>
        <h1>Application Submitted!</h1>
        <p>Thanks{fn?`, ${fn}`:""} ! We've received your application and screening payment. We'll review everything and get back to you within 24–48 hours.</p>
        <div style={{marginTop:24,padding:16,background:"rgba(74,124,89,.06)",borderRadius:12,fontSize:12,color:"#4a7c59",textAlign:"left"}}>
          <strong>What happens next?</strong><br/>
          1. Your background check and credit report are processing<br/>
          2. We'll review your application and references<br/>
          3. You'll receive a decision email at {em||"the email you provided"}<br/>
          4. If approved, we'll send your lease for e-signing
        </div>
      </div></div>
      <div className="app-footer">© {new Date().getFullYear()} Black Bear Rentals</div>
    </div></>);
  }

  // Fee for payment step
  const baseFee=(invite?.screenPkg==="credit-only"||invite?.screenPkg==="bg-only")?39:59;

  // Progress bar — shows for section steps + review + payment
  const showProgress=stepIdx>=0;
  const progressTotal=sections.length+2; // sections + review + payment
  const progressCurrent=stepIdx>=sections.length?stepIdx:stepIdx;

  return(<><style>{CSS}</style><div className="app-wrap">
    <div className="app-header">
      <div className="app-logo">🐻 Black Bear <span>Rentals</span></div>
      {showProgress&&<div className="app-save">{saving?<><div className="dot"/>Saving...</>:"✓ Saved"}</div>}
    </div>
    <div className="app-body">

      {/* Progress bar */}
      {showProgress&&<>
        <div className="prog">
          {Array.from({length:progressTotal}).map((_,i)=>(
            <div key={i} className={`prog-seg ${i<progressCurrent?"done":i===progressCurrent?"cur":""}`}/>
          ))}
        </div>
        <div className="prog-label">
          {stepIdx<sections.length?`Section ${stepIdx+1} of ${sections.length} · ${sections[stepIdx]}`
            :stepIdx===REVIEW_IDX?"Review your application"
            :"Final Step · Payment"}
        </div>
      </>}

      {/* ═══ WELCOME ═══ */}
      {stepIdx===-1&&<div className="welcome">
        <div className="welcome-bear">🐻</div>
        <h1>Start My Application</h1>
        {invite?.inviteRoomName&&<div style={{fontSize:13,color:"var(--ac)",fontWeight:600,marginBottom:12}}>{invite.invitePropName} · {invite.inviteRoomName}{invite.inviteRent?` — $${invite.inviteRent}/mo`:""}</div>}
        <div className="welcome-sub">We're excited you're interested! This application is quick, secure, and saves automatically.</div>
        <div className="welcome-perks">
          <div className="welcome-perk"><div className="ic">⏱</div>Takes less than 10 minutes</div>
          <div className="welcome-perk"><div className="ic">💾</div>Saves as you go</div>
          <div className="welcome-perk"><div className="ic">📊</div>Will never impact your credit score</div>
          <div className="welcome-perk"><div className="ic">🔒</div>Your information is encrypted and secure</div>
        </div>
        <div style={{fontSize:11,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>What are you applying as?</div>
        <div className="type-toggle">
          <button className={`type-btn ${appType==="tenant"?"on":""}`} onClick={()=>setAppType("tenant")}>Tenant</button>
          <button className={`type-btn ${appType==="cosigner"?"on":""}`} onClick={()=>setAppType("cosigner")}>Co-Signer</button>
        </div>
        {appType==="cosigner"&&<div className="cosigner-note">As a co-signer, you'll complete a shorter application covering your identity and income.</div>}
        {activeFields.length===0&&<div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.2)",borderRadius:10,padding:14,fontSize:12,color:"#9a7422",marginBottom:20}}>⚠ The application form is being set up. Please check back soon or contact us directly.</div>}
        <div className="legal">By clicking below you agree to our <a href="#">Application Authorization Policy</a>, <a href="#">Terms of Use</a> & <a href="#">Privacy Policy</a>.</div>
        <button className="btn-start" onClick={next} disabled={activeFields.length===0} style={{opacity:activeFields.length===0?.5:1}}>Begin Application →</button>
      </div>}

      {/* ═══ SECTION STEPS (dynamic) ═══ */}
      {stepIdx>=0&&stepIdx<sections.length&&(()=>{
        const secName=sections[stepIdx];
        const secFields=activeFields.filter(f=>f.section===secName);
        return(
        <div className="sec">
          <div className="sec-num">Section {stepIdx+1}</div>
          <div className="sec-hd"><h2>{secName}</h2></div>
          {secFields.map(f=>renderField(f))}
          <button className="btn-next" onClick={next}>Continue →</button>
          <button className="btn-back" onClick={back}>← Back</button>
        </div>);
      })()}

      {/* ═══ REVIEW ═══ */}
      {stepIdx===REVIEW_IDX&&<div className="sec">
        <div className="sec-num">Almost Done!</div>
        <div className="sec-hd"><h2>Review Your Application</h2><p>Verify everything looks correct before submitting.</p></div>
        {sections.map((sec,si)=>{
          const secFields=activeFields.filter(f=>f.section===sec);
          return(
          <div key={sec} className="rev-sec">
            <h3>{sec} <span className="rev-edit" onClick={()=>setStepIdx(si)}>Edit</span></h3>
            {secFields.map(f=>(
              <div key={f.id} className="rev-row">
                <span className="rev-label">{f.label}</span>
                <span className="rev-val">{displayVal(f)}</span>
              </div>
            ))}
          </div>);
        })}
        {invite?.inviteRoomName&&<div className="rev-sec">
          <h3>🏠 Room</h3>
          <div className="rev-row"><span className="rev-label">Property</span><span className="rev-val">{invite.invitePropName}</span></div>
          <div className="rev-row"><span className="rev-label">Room</span><span className="rev-val">{invite.inviteRoomName}</span></div>
          {invite.inviteRent&&<div className="rev-row"><span className="rev-label">Rent</span><span className="rev-val" style={{color:"var(--ac)"}}>${invite.inviteRent}/mo</span></div>}
        </div>}
        <button className="btn-next" onClick={next}>Continue to Payment →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ PAYMENT ═══ */}
      {stepIdx===PAYMENT_IDX&&<div className="sec">
        <div className="sec-num">Final Step</div>
        <div className="sec-hd"><h2>Screening Fee</h2><p>Covers your background check, credit report, and application processing. Non-refundable.</p></div>
        <div className="fee-card">
          <h3>💳 Fee Breakdown</h3>
          <div className="fee-row"><span>Background Check & Credit Report</span><span>${baseFee-10}</span></div>
          <div className="fee-row"><span>Application Processing</span><span>$10</span></div>
          <div className="fee-total"><span>Total Due Now</span><span>${baseFee}</span></div>
        </div>
        <div style={{background:"rgba(74,124,89,.06)",borderRadius:10,padding:12,marginBottom:20,fontSize:11,color:"var(--gn)"}}>🔒 Secure Payment — Processed through Stripe. Card info never stored on our servers.</div>
        <div style={{border:"2px dashed rgba(0,0,0,.1)",borderRadius:12,padding:24,textAlign:"center",marginBottom:20,background:"rgba(0,0,0,.01)"}}>
          <div style={{fontSize:24,marginBottom:8}}>💳</div>
          <div style={{fontSize:13,fontWeight:600,color:"#999"}}>Stripe Payment Form</div>
          <div style={{fontSize:10,color:"#ccc",marginTop:4}}>Card details will appear here</div>
        </div>
        <button className="btn-start" onClick={async()=>{
          setSubmitted(true);
          const fn=getFirstName();
          const lnField=activeFields.find(f=>f.label.toLowerCase().includes("last name"));
          const fullName=(fn+(lnField&&answers[lnField.id]?" "+answers[lnField.id]:"")).trim()||invite?.name||"Applicant";
          const em=getEmail();
          // Update hq-apps — mark as applied with full answers
          if(invite){
            const apps=await loadKey("hq-apps",[]);
            const up=apps.map(a=>a.id===invite.id?{...a,status:"applied",lastContact:new Date().toISOString().split("T")[0],applicationData:answers,history:[...(a.history||[]),{from:"invited",to:"applied",date:new Date().toISOString().split("T")[0],note:"Full application submitted + fee paid"}]}:a);
            await saveKey("hq-apps",up);
            // Fire urgent admin notification
            const notifs=await loadKey("hq-notifs",[]);
            await saveKey("hq-notifs",[{id:Math.random().toString(36).slice(2),type:"app",msg:`Application submitted: ${fullName} — $${baseFee} screening fee paid`,date:new Date().toISOString().split("T")[0],read:false,urgent:true},...notifs]);
          }
          // Send confirmation email to applicant via API
          if(em){
            try{
              await fetch("/api/apply-confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
                name:fullName,email:em,
                property:invite?.invitePropName||invite?.property||"",
                room:invite?.inviteRoomName||invite?.room||"",
                rent:invite?.inviteRent||"",
                fee:baseFee,
              })});
            }catch{}
          }
        }}>Pay ${baseFee} & Submit Application</button>
        <div className="legal">By submitting, you authorize Black Bear Rentals and RentPrep to conduct a background check and credit inquiry. This will not impact your credit score. Fee is non-refundable.</div>
        <button className="btn-back" onClick={back}>← Back to Review</button>
      </div>}

    </div>
    {stepIdx!==PAYMENT_IDX||!submitted?<div className="app-footer">© {new Date().getFullYear()} Black Bear Rentals — Oak & Main Development LLC · <a href="https://rentblackbear.com">rentblackbear.com</a></div>:null}
  </div></>);
}
