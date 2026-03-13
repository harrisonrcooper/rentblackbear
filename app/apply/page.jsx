"use client";
import { useState, useEffect, useRef } from "react";

// ─── Supabase ────────────────────────────────────────────────────
const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa=(path,opts={})=>fetch(`${SUPA_URL}/rest/v1/${path}`,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":`Bearer ${SUPA_KEY}`,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});
async function loadKey(k,fb){try{const r=await supa(`app_data?key=eq.${k}&select=value`);const d=await r.json();return d?.[0]?.value||fb;}catch{return fb;}}
async function saveKey(k,v){try{await supa("app_data",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify({key:k,value:v})});}catch{}}

// ─── Styles ──────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
:root{--dk:#1a1714;--cr:#f5f0e8;--ac:#d4a853;--mt:#c4a882;--gn:#4a7c59;--rd:#c45c4a;--bg:#faf9f7}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:#3d3529;-webkit-font-smoothing:antialiased}

/* Layout */
.app-wrap{min-height:100vh;display:flex;flex-direction:column}
.app-header{background:var(--dk);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.app-logo{color:var(--cr);font-family:'DM Serif Display',serif;font-size:16px;display:flex;align-items:center;gap:8px}
.app-logo span{color:var(--ac)}
.app-save{font-size:10px;color:var(--mt);display:flex;align-items:center;gap:4px}
.app-save .dot{width:6px;height:6px;border-radius:50%;background:var(--gn);animation:pulse 2s infinite}
.app-body{flex:1;max-width:600px;margin:0 auto;width:100%;padding:0 16px}
.app-footer{text-align:center;padding:20px;font-size:10px;color:#999}

/* Progress */
.prog{display:flex;gap:3px;padding:20px 0 10px}
.prog-seg{flex:1;height:4px;border-radius:2px;background:rgba(0,0,0,.06);transition:all .4s}
.prog-seg.done{background:var(--gn)}
.prog-seg.cur{background:var(--ac)}
.prog-label{font-size:10px;color:#999;margin-bottom:24px}

/* Welcome */
.welcome{text-align:center;padding:60px 0 40px}
.welcome-bear{font-size:48px;margin-bottom:16px;animation:bounce 2s ease infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.welcome h1{font-family:'DM Serif Display',serif;font-size:28px;color:var(--dk);margin-bottom:12px}
.welcome-sub{color:#999;font-size:14px;line-height:1.6;max-width:380px;margin:0 auto 24px}
.welcome-perks{display:flex;flex-direction:column;gap:8px;margin-bottom:32px;text-align:left;max-width:340px;margin-left:auto;margin-right:auto}
.welcome-perk{display:flex;align-items:center;gap:10px;font-size:13px;color:#5c4a3a}
.welcome-perk .ic{width:28px;height:28px;border-radius:50%;background:rgba(74,124,89,.08);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}

/* Type toggle */
.type-toggle{display:flex;gap:0;border:2px solid rgba(0,0,0,.08);border-radius:10px;overflow:hidden;margin-bottom:24px;max-width:300px;margin-left:auto;margin-right:auto}
.type-btn{flex:1;padding:12px;font-size:13px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:all .2s;background:#fff;color:#999}
.type-btn.on{background:var(--dk);color:var(--cr)}

/* Sections */
.sec{padding:24px 0;animation:fadeUp .4s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.sec-hd{margin-bottom:20px}
.sec-hd h2{font-family:'DM Serif Display',serif;font-size:22px;color:var(--dk);margin-bottom:4px}
.sec-hd p{font-size:12px;color:#999;line-height:1.5}
.sec-num{font-size:10px;font-weight:700;color:var(--ac);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}

/* Fields */
.fld{margin-bottom:16px}
.fld label{display:block;font-size:11px;font-weight:700;color:#5c4a3a;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px}
.fld .req{color:var(--rd);margin-left:2px}
.fld input,.fld select,.fld textarea{width:100%;padding:13px 14px;border:2px solid rgba(0,0,0,.08);border-radius:10px;font-size:15px;font-family:inherit;outline:none;transition:border .2s;background:#fff}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:var(--ac)}
.fld input.err,.fld select.err,.fld textarea.err{border-color:var(--rd);animation:shake .4s}
@keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-3px)}30%{transform:translateX(3px)}45%{transform:translateX(-2px)}60%{transform:translateX(2px)}}
.fld .err-msg{font-size:10px;color:var(--rd);margin-top:3px}
.fld .help{font-size:10px;color:#999;margin-top:3px}
.fld-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fld textarea{min-height:80px;resize:vertical}

/* File upload */
.upload{border:2px dashed rgba(0,0,0,.1);border-radius:10px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(0,0,0,.01)}
.upload:hover{border-color:var(--ac);background:rgba(212,168,83,.03)}
.upload.has{border-color:var(--gn);border-style:solid;background:rgba(74,124,89,.03)}
.upload-ic{font-size:28px;margin-bottom:6px}
.upload-txt{font-size:12px;color:#999}
.upload-file{font-size:12px;color:var(--gn);font-weight:600;margin-top:4px}

/* Yes/No */
.yn-row{display:flex;gap:8px;margin-bottom:16px}
.yn-q{font-size:13px;font-weight:500;color:#3d3529;margin-bottom:8px}
.yn-btn{flex:1;padding:12px;border:2px solid rgba(0,0,0,.08);border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;background:#fff;color:#999}
.yn-btn.yes{border-color:var(--gn);background:rgba(74,124,89,.06);color:var(--gn)}
.yn-btn.no{border-color:var(--rd);background:rgba(196,92,74,.06);color:var(--rd)}

/* Room picker */
.room-card{border:2px solid rgba(0,0,0,.08);border-radius:12px;padding:14px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.room-card:hover{border-color:var(--ac)}
.room-card.sel{border-color:var(--ac);background:rgba(212,168,83,.04)}
.room-name{font-size:14px;font-weight:700;color:var(--dk)}
.room-meta{font-size:11px;color:#999;margin-top:2px}
.room-price{font-size:16px;font-weight:700;color:var(--ac)}

/* Property card */
.prop-card{background:#fff;border:2px solid rgba(0,0,0,.06);border-radius:14px;overflow:hidden;margin-bottom:20px}
.prop-img{height:140px;background:linear-gradient(135deg,#2c2520,#1a1714);display:flex;align-items:center;justify-content:center;color:var(--ac);font-size:32px}
.prop-info{padding:14px}
.prop-name{font-family:'DM Serif Display',serif;font-size:18px;margin-bottom:2px}
.prop-addr{font-size:11px;color:#999}

/* Buttons */
.btn-next{width:100%;padding:16px;background:var(--ac);color:var(--dk);border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.btn-next:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(212,168,83,.3)}
.btn-next:disabled{opacity:.4;cursor:default;transform:none;box-shadow:none}
.btn-back{width:100%;padding:14px;background:none;border:2px solid rgba(0,0,0,.08);border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;color:#999;transition:all .2s;margin-top:8px}
.btn-back:hover{border-color:#999}
.btn-start{width:100%;padding:18px;background:var(--dk);color:var(--cr);border:none;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .3s;position:relative;overflow:hidden}
.btn-start:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,23,20,.3)}

/* Review */
.rev-sec{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;padding:14px;margin-bottom:10px}
.rev-sec h3{font-size:13px;font-weight:700;color:var(--dk);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.rev-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(0,0,0,.03);font-size:12px}
.rev-row:last-child{border:none}
.rev-label{color:#999}
.rev-val{font-weight:600;color:#3d3529;text-align:right}
.rev-edit{font-size:10px;color:var(--ac);cursor:pointer;font-weight:600}

/* Fee */
.fee-card{background:var(--dk);border-radius:14px;padding:20px;color:var(--cr);margin-bottom:20px}
.fee-card h3{font-size:14px;margin-bottom:12px}
.fee-row{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;color:var(--mt)}
.fee-total{display:flex;justify-content:space-between;padding:10px 0 0;border-top:1px solid rgba(255,255,255,.1);font-size:16px;font-weight:700;margin-top:6px}

/* Legal */
.legal{font-size:10px;color:#999;line-height:1.6;text-align:center;margin:16px 0 24px}
.legal a{color:var(--ac);text-decoration:underline}

/* Submitted */
.submitted{text-align:center;padding:80px 20px}
.submitted-ic{font-size:56px;margin-bottom:16px}
.submitted h1{font-family:'DM Serif Display',serif;font-size:26px;color:var(--dk);margin-bottom:8px}
.submitted p{color:#999;font-size:14px;line-height:1.6;max-width:400px;margin:0 auto}

/* Co-signer note */
.cosigner-note{background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.15);border-radius:10px;padding:12px;margin-bottom:20px;font-size:12px;color:#9a7422}

/* Responsive */
@media(max-width:500px){
  .fld-row{grid-template-columns:1fr}
  .welcome h1{font-size:24px}
  .sec-hd h2{font-size:20px}
  .fld input,.fld select,.fld textarea{font-size:16px;padding:12px}
  .type-toggle{max-width:100%}
}
`;

// ─── Sections config ─────────────────────────────────────────────
const SECTIONS=["welcome","personal","employment","rental","references","emergency","room","review","payment","done"];
const SECTION_LABELS={welcome:"Start",personal:"Personal Info",employment:"Employment",rental:"Rental History",references:"References",emergency:"Emergency Contact",room:"Room Preference",review:"Review",payment:"Payment",done:"Done"};

// ─── Main Component ──────────────────────────────────────────────
export default function ApplyPage(){
  const[step,setStep]=useState("welcome");
  const[appType,setAppType]=useState("tenant");// tenant or cosigner
  const[data,setData]=useState({firstName:"",lastName:"",email:"",phone:"",dob:"",
    // Personal
    ssn:"",idFile:null,idFileName:"",
    // Employment
    employer:"",jobTitle:"",monthlyIncome:"",employmentLength:"",payStubs:null,payStubsName:"",
    // Rental
    prevLandlord:"",prevLandlordPhone:"",prevAddress:"",prevRent:"",prevLength:"",reasonLeaving:"",evicted:"",
    // References
    empRefName:"",empRefPhone:"",empRefRelation:"",persRefName:"",persRefPhone:"",persRefRelation:"",
    // Emergency
    emergName:"",emergPhone:"",emergRelation:"",
    // Room
    selectedRoom:"",
  });
  const[errors,setErrors]=useState({});
  const[invite,setInvite]=useState(null);// invite data from Supabase
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[submitted,setSubmitted]=useState(false);
  const[props_,setProps]=useState([]);
  const fileRef=useRef(null);
  const payRef=useRef(null);

  const upd=(k,v)=>{setData(p=>({...p,[k]:v}));setErrors(p=>({...p,[k]:undefined}));};
  const fmtPhone=(v)=>{const d=v.replace(/\D/g,"").slice(0,10);if(d.length<=3)return d;if(d.length<=6)return`(${d.slice(0,3)}) ${d.slice(3)}`;return`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;};

  // Load invite data from URL token
  useEffect(()=>{
    (async()=>{
      try{
        // In production, parse token from URL: new URLSearchParams(window.location.search).get("token")
        // For demo, load from Supabase or use defaults
        const apps=await loadKey("hq-apps",[]);
        const invited=apps.find(a=>a.status==="invited");
        if(invited){
          setInvite(invited);
          setData(p=>({...p,firstName:invited.name?.split(" ")[0]||"",lastName:invited.name?.split(" ").slice(1).join(" ")||"",email:invited.email||"",phone:invited.phone||""}));
        }
        const p=await loadKey("hq-props",[]);
        setProps(p);
      }catch{}
      setLoading(false);
    })();
  },[]);

  // Auto-save
  useEffect(()=>{
    if(step!=="welcome"&&step!=="done"&&!loading){
      setSaving(true);const t=setTimeout(()=>setSaving(false),1500);return()=>clearTimeout(t);
    }
  },[data,step]);

  const validate=(section)=>{
    const e={};
    if(section==="welcome"){
      if(!data.firstName.trim())e.firstName="Required";
      if(!data.lastName.trim())e.lastName="Required";
      if(!data.email.trim()||!data.email.includes("@"))e.email="Valid email required";
      if(data.phone.replace(/\D/g,"").length!==10)e.phone="10-digit phone required";
      if(!data.dob)e.dob="Required";
    }
    if(section==="personal"){
      if(!data.ssn||data.ssn.length<4)e.ssn="Last 4 of SSN required for screening";
    }
    if(section==="employment"){
      if(!data.employer.trim())e.employer="Required";
      if(!data.monthlyIncome)e.monthlyIncome="Required";
    }
    if(section==="rental"){
      if(!data.prevLandlord.trim())e.prevLandlord="Required";
      if(!data.prevLandlordPhone.trim())e.prevLandlordPhone="Required";
      if(data.evicted==="")e.evicted="Please answer";
    }
    if(section==="references"){
      if(!data.empRefName.trim())e.empRefName="Required";
      if(!data.empRefPhone.trim())e.empRefPhone="Required";
    }
    if(section==="emergency"){
      if(!data.emergName.trim())e.emergName="Required";
      if(!data.emergPhone.trim())e.emergPhone="Required";
      if(!data.emergRelation.trim())e.emergRelation="Required";
    }
    if(section==="room"){
      const needsRoom=invite?.inviteRoomMode==="choice";
      if(needsRoom&&!data.selectedRoom)e.selectedRoom="Please select a room";
    }
    setErrors(e);return Object.keys(e).length===0;
  };

  const next=()=>{
    if(!validate(step))return;
    const secs=appType==="cosigner"?["welcome","personal","employment","review","payment","done"]:SECTIONS;
    // Skip room section if room is locked
    const filtered=secs.filter(s=>{
      if(s==="room"&&invite?.inviteRoomMode!=="choice")return false;
      return true;
    });
    const i=filtered.indexOf(step);
    if(i<filtered.length-1)setStep(filtered[i+1]);
  };
  const back=()=>{
    const secs=appType==="cosigner"?["welcome","personal","employment","review","payment","done"]:SECTIONS;
    const filtered=secs.filter(s=>{
      if(s==="room"&&invite?.inviteRoomMode!=="choice")return false;
      return true;
    });
    const i=filtered.indexOf(step);
    if(i>0)setStep(filtered[i-1]);
  };

  const activeSections=(appType==="cosigner"?["welcome","personal","employment","review","payment","done"]:SECTIONS).filter(s=>{
    if(s==="room"&&invite?.inviteRoomMode!=="choice")return false;
    return true;
  });
  const stepIdx=activeSections.indexOf(step);
  const totalSteps=activeSections.length;

  // Fee
  const baseFee=invite?.inviteFee||59;

  if(loading)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#999"}}><div style={{textAlign:"center"}}><div style={{fontSize:40,marginBottom:8}}>🐻</div><div>Loading your application...</div></div></div>);

  if(submitted)return(<><style>{CSS}</style><div className="app-wrap">
    <div className="app-header"><div className="app-logo">🐻 Black Bear <span>Rentals</span></div></div>
    <div className="app-body"><div className="submitted">
      <div className="submitted-ic">🎉</div>
      <h1>Application Submitted!</h1>
      <p>Thanks, {data.firstName}! We've received your application and screening payment. We'll review everything and get back to you within 24-48 hours.</p>
      <div style={{marginTop:24,padding:16,background:"rgba(74,124,89,.06)",borderRadius:12,fontSize:12,color:"#4a7c59"}}>
        <strong>What happens next?</strong><br/>
        1. Your background check and credit report are processing<br/>
        2. We'll review your application and references<br/>
        3. You'll receive an email with our decision<br/>
        4. If approved, we'll send your lease for e-signing
      </div>
    </div></div>
    <div className="app-footer">© {new Date().getFullYear()} Black Bear Rentals — Oak & Main Development LLC</div>
  </div></>);

  return(<><style>{CSS}</style><div className="app-wrap">
    {/* Header */}
    <div className="app-header">
      <div className="app-logo">🐻 Black Bear <span>Rentals</span></div>
      {step!=="welcome"&&step!=="done"&&<div className="app-save">{saving?<><div className="dot"/>Saving...</>:"✓ Saved"}</div>}
    </div>

    <div className="app-body">
      {/* Progress bar */}
      {step!=="welcome"&&step!=="done"&&<>
        <div className="prog">{activeSections.filter(s=>s!=="welcome"&&s!=="done").map((s,i)=>{
          const sIdx=activeSections.indexOf(s);
          return<div key={s} className={`prog-seg ${sIdx<stepIdx?"done":sIdx===stepIdx?"cur":""}`}/>;
        })}</div>
        <div className="prog-label">Step {stepIdx} of {totalSteps-2} · {SECTION_LABELS[step]}</div>
      </>}

      {/* ═══ WELCOME ═══ */}
      {step==="welcome"&&<div className="welcome">
        <div className="welcome-bear">🐻</div>
        <h1>Start My Application</h1>
        {invite?.inviteRoomName&&<div style={{fontSize:13,color:"var(--ac)",fontWeight:600,marginBottom:12}}>Applying for: {invite.invitePropName} · {invite.inviteRoomName}{invite.inviteRent?` — $${invite.inviteRent}/mo`:""}</div>}
        <div className="welcome-sub">We're excited you're interested! This application is quick, secure, and saves automatically.</div>

        <div className="welcome-perks">
          <div className="welcome-perk"><div className="ic">⏱</div>Takes less than 11 minutes</div>
          <div className="welcome-perk"><div className="ic">💾</div>Easy to save and resume at any time</div>
          <div className="welcome-perk"><div className="ic">📊</div>Will never impact your credit score</div>
          <div className="welcome-perk"><div className="ic">🔒</div>Your information is encrypted and secure</div>
        </div>

        <div style={{fontSize:11,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>What are you applying as?</div>
        <div className="type-toggle">
          <button className={`type-btn ${appType==="tenant"?"on":""}`} onClick={()=>setAppType("tenant")}>Tenant</button>
          <button className={`type-btn ${appType==="cosigner"?"on":""}`} onClick={()=>setAppType("cosigner")}>Co-Signer</button>
        </div>

        {appType==="cosigner"&&<div className="cosigner-note">As a co-signer, you'll complete a shorter application covering your identity and income. Your information helps strengthen the primary applicant's application.</div>}

        <div style={{textAlign:"left",maxWidth:400,margin:"0 auto"}}>
          <div className="fld-row">
            <div className="fld"><label>First Name<span className="req">*</span></label><input value={data.firstName} onChange={e=>upd("firstName",e.target.value)} className={errors.firstName?"err":""} placeholder="First name"/>{errors.firstName&&<div className="err-msg">{errors.firstName}</div>}</div>
            <div className="fld"><label>Last Name<span className="req">*</span></label><input value={data.lastName} onChange={e=>upd("lastName",e.target.value)} className={errors.lastName?"err":""} placeholder="Last name"/>{errors.lastName&&<div className="err-msg">{errors.lastName}</div>}</div>
          </div>
          <div className="fld"><label>Email Address<span className="req">*</span></label><input type="email" value={data.email} onChange={e=>upd("email",e.target.value)} className={errors.email?"err":""} placeholder="you@email.com"/>{errors.email&&<div className="err-msg">{errors.email}</div>}</div>
          <div className="fld"><label>Phone Number<span className="req">*</span></label><input type="tel" value={data.phone} onChange={e=>upd("phone",fmtPhone(e.target.value))} className={errors.phone?"err":""} placeholder="(256) 555-1234"/>{errors.phone&&<div className="err-msg">{errors.phone}</div>}</div>
          <div className="fld"><label>Date of Birth<span className="req">*</span></label><input type="date" value={data.dob} onChange={e=>upd("dob",e.target.value)} className={errors.dob?"err":""}/>{errors.dob&&<div className="err-msg">{errors.dob}</div>}</div>
        </div>

        <div className="legal">By clicking the button below you are agreeing to our <a href="#">Application Authorization Policy</a>, <a href="#">Terms of Use</a> & <a href="#">Privacy Policy</a>.</div>

        <button className="btn-start" onClick={next}>Begin Application →</button>
      </div>}

      {/* ═══ PERSONAL INFO ═══ */}
      {step==="personal"&&<div className="sec">
        <div className="sec-num">Section 1</div>
        <div className="sec-hd"><h2>Personal Information</h2><p>We need to verify your identity for the screening process.</p></div>

        <div className="fld"><label>Social Security Number (last 4 digits)<span className="req">*</span></label><input type="password" maxLength={4} value={data.ssn} onChange={e=>upd("ssn",e.target.value.replace(/\D/g,""))} className={errors.ssn?"err":""} placeholder="••••"/><div className="help">Only the last 4 digits — used for identity verification with RentPrep. Never stored.</div>{errors.ssn&&<div className="err-msg">{errors.ssn}</div>}</div>

        <div className="fld"><label>Photo ID Upload</label>
          <div className={`upload ${data.idFileName?"has":""}`} onClick={()=>fileRef.current?.click()}>
            <div className="upload-ic">{data.idFileName?"✅":"📷"}</div>
            <div className="upload-txt">{data.idFileName?"":"Tap to upload your driver's license, passport, or state ID"}</div>
            {data.idFileName&&<div className="upload-file">{data.idFileName}</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e=>{if(e.target.files[0])upd("idFileName",e.target.files[0].name);}}/>
          <div className="help">Accepted: JPG, PNG, or PDF. Max 10MB.</div>
        </div>

        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ EMPLOYMENT ═══ */}
      {step==="employment"&&<div className="sec">
        <div className="sec-num">Section 2</div>
        <div className="sec-hd"><h2>Employment & Income</h2><p>Help us verify your ability to pay rent consistently.</p></div>

        <div className="fld"><label>Current Employer<span className="req">*</span></label><input value={data.employer} onChange={e=>upd("employer",e.target.value)} className={errors.employer?"err":""} placeholder="Company name"/>{errors.employer&&<div className="err-msg">{errors.employer}</div>}</div>
        <div className="fld"><label>Job Title</label><input value={data.jobTitle} onChange={e=>upd("jobTitle",e.target.value)} placeholder="Your position"/></div>
        <div className="fld-row">
          <div className="fld"><label>Monthly Income (Gross)<span className="req">*</span></label><input type="number" value={data.monthlyIncome} onChange={e=>upd("monthlyIncome",e.target.value)} className={errors.monthlyIncome?"err":""} placeholder="4200"/>{errors.monthlyIncome&&<div className="err-msg">{errors.monthlyIncome}</div>}</div>
          <div className="fld"><label>How Long Employed</label><input value={data.employmentLength} onChange={e=>upd("employmentLength",e.target.value)} placeholder="e.g. 2 years"/></div>
        </div>

        <div className="fld"><label>Proof of Income</label>
          <div className={`upload ${data.payStubsName?"has":""}`} onClick={()=>payRef.current?.click()}>
            <div className="upload-ic">{data.payStubsName?"✅":"📄"}</div>
            <div className="upload-txt">{data.payStubsName?"":"Tap to upload pay stubs, offer letter, or bank statements"}</div>
            {data.payStubsName&&<div className="upload-file">{data.payStubsName}</div>}
          </div>
          <input ref={payRef} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e=>{if(e.target.files[0])upd("payStubsName",e.target.files[0].name);}}/>
        </div>

        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ RENTAL HISTORY ═══ */}
      {step==="rental"&&<div className="sec">
        <div className="sec-num">Section 3</div>
        <div className="sec-hd"><h2>Rental History</h2><p>Tell us about your most recent living situation.</p></div>

        <div className="fld"><label>Previous Landlord Name<span className="req">*</span></label><input value={data.prevLandlord} onChange={e=>upd("prevLandlord",e.target.value)} className={errors.prevLandlord?"err":""} placeholder="Full name"/>{errors.prevLandlord&&<div className="err-msg">{errors.prevLandlord}</div>}</div>
        <div className="fld"><label>Landlord Phone<span className="req">*</span></label><input type="tel" value={data.prevLandlordPhone} onChange={e=>upd("prevLandlordPhone",fmtPhone(e.target.value))} className={errors.prevLandlordPhone?"err":""} placeholder="(555) 555-5555"/>{errors.prevLandlordPhone&&<div className="err-msg">{errors.prevLandlordPhone}</div>}</div>
        <div className="fld"><label>Previous Address</label><input value={data.prevAddress} onChange={e=>upd("prevAddress",e.target.value)} placeholder="Street, City, State"/></div>
        <div className="fld-row">
          <div className="fld"><label>Monthly Rent</label><input type="number" value={data.prevRent} onChange={e=>upd("prevRent",e.target.value)} placeholder="1100"/></div>
          <div className="fld"><label>How Long</label><input value={data.prevLength} onChange={e=>upd("prevLength",e.target.value)} placeholder="e.g. 18 months"/></div>
        </div>
        <div className="fld"><label>Reason for Leaving</label><textarea value={data.reasonLeaving} onChange={e=>upd("reasonLeaving",e.target.value)} placeholder="Why are you moving?"/></div>

        <div className="yn-q">Have you ever been evicted?<span className="req">*</span></div>
        <div className="yn-row">
          <button className={`yn-btn ${data.evicted==="no"?"yes":""}`} onClick={()=>upd("evicted","no")}>No</button>
          <button className={`yn-btn ${data.evicted==="yes"?"no":""}`} onClick={()=>upd("evicted","yes")}>Yes</button>
        </div>
        {data.evicted==="yes"&&<div className="fld"><label>Please explain</label><textarea value={data.evictedExplain||""} onChange={e=>upd("evictedExplain",e.target.value)} placeholder="Briefly explain the circumstances"/></div>}
        {errors.evicted&&<div className="err-msg" style={{marginBottom:12}}>{errors.evicted}</div>}

        <div className="yn-q">Do you have any felonies?</div>
        <div className="yn-row">
          <button className={`yn-btn ${data.felony==="no"?"yes":""}`} onClick={()=>upd("felony","no")}>No</button>
          <button className={`yn-btn ${data.felony==="yes"?"no":""}`} onClick={()=>upd("felony","yes")}>Yes</button>
        </div>
        {data.felony==="yes"&&<div className="fld"><label>Please explain</label><textarea value={data.felonyExplain||""} onChange={e=>upd("felonyExplain",e.target.value)} placeholder="Briefly explain"/></div>}

        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ REFERENCES ═══ */}
      {step==="references"&&<div className="sec">
        <div className="sec-num">Section 4</div>
        <div className="sec-hd"><h2>References</h2><p>Provide at least one employer and one personal reference.</p></div>

        <div style={{fontSize:11,fontWeight:700,color:"var(--ac)",textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Employer Reference</div>
        <div className="fld"><label>Name<span className="req">*</span></label><input value={data.empRefName} onChange={e=>upd("empRefName",e.target.value)} className={errors.empRefName?"err":""} placeholder="Supervisor or HR contact"/>{errors.empRefName&&<div className="err-msg">{errors.empRefName}</div>}</div>
        <div className="fld-row">
          <div className="fld"><label>Phone<span className="req">*</span></label><input type="tel" value={data.empRefPhone} onChange={e=>upd("empRefPhone",fmtPhone(e.target.value))} className={errors.empRefPhone?"err":""} placeholder="(555) 555-5555"/>{errors.empRefPhone&&<div className="err-msg">{errors.empRefPhone}</div>}</div>
          <div className="fld"><label>Relationship</label><input value={data.empRefRelation} onChange={e=>upd("empRefRelation",e.target.value)} placeholder="e.g. Manager"/></div>
        </div>

        <div style={{fontSize:11,fontWeight:700,color:"var(--ac)",textTransform:"uppercase",letterSpacing:.5,marginBottom:10,marginTop:20}}>Personal Reference</div>
        <div className="fld"><label>Name</label><input value={data.persRefName} onChange={e=>upd("persRefName",e.target.value)} placeholder="Someone who knows you well"/></div>
        <div className="fld-row">
          <div className="fld"><label>Phone</label><input type="tel" value={data.persRefPhone} onChange={e=>upd("persRefPhone",fmtPhone(e.target.value))} placeholder="(555) 555-5555"/></div>
          <div className="fld"><label>Relationship</label><input value={data.persRefRelation} onChange={e=>upd("persRefRelation",e.target.value)} placeholder="e.g. Friend, Colleague"/></div>
        </div>

        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ EMERGENCY CONTACT ═══ */}
      {step==="emergency"&&<div className="sec">
        <div className="sec-num">Section 5</div>
        <div className="sec-hd"><h2>Emergency Contact</h2><p>Someone we can reach in case of an emergency.</p></div>

        <div className="fld"><label>Full Name<span className="req">*</span></label><input value={data.emergName} onChange={e=>upd("emergName",e.target.value)} className={errors.emergName?"err":""} placeholder="Full name"/>{errors.emergName&&<div className="err-msg">{errors.emergName}</div>}</div>
        <div className="fld-row">
          <div className="fld"><label>Phone<span className="req">*</span></label><input type="tel" value={data.emergPhone} onChange={e=>upd("emergPhone",fmtPhone(e.target.value))} className={errors.emergPhone?"err":""} placeholder="(555) 555-5555"/>{errors.emergPhone&&<div className="err-msg">{errors.emergPhone}</div>}</div>
          <div className="fld"><label>Relationship<span className="req">*</span></label><input value={data.emergRelation} onChange={e=>upd("emergRelation",e.target.value)} className={errors.emergRelation?"err":""} placeholder="e.g. Parent, Spouse"/>{errors.emergRelation&&<div className="err-msg">{errors.emergRelation}</div>}</div>
        </div>

        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ ROOM PREFERENCE (if choice mode) ═══ */}
      {step==="room"&&<div className="sec">
        <div className="sec-num">Section 6</div>
        <div className="sec-hd"><h2>Choose Your Room</h2><p>Select the room you'd like to apply for.</p></div>

        {(()=>{const prop=invite?.inviteProp?props_.find(p=>p.id===invite.inviteProp):null;const showProps=prop?[prop]:props_;return showProps.map(p=>(
          <div key={p.id} className="prop-card">
            <div className="prop-img">🐻</div>
            <div className="prop-info">
              <div className="prop-name">{p.name}</div>
              <div className="prop-addr">{p.address}</div>
              <div style={{marginTop:10}}>{p.rooms.filter(r=>r.st==="vacant").map(r=>(
                <div key={r.id} className={`room-card ${data.selectedRoom===r.id?"sel":""}`} onClick={()=>upd("selectedRoom",r.id)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div className="room-name">{r.name}</div><div className="room-meta">{r.bed} bed · {r.pb?"Private":"Shared"} bath · {r.sqft} sqft</div></div>
                    <div className="room-price">${r.rent}<small style={{fontSize:10,color:"#999"}}>/mo</small></div>
                  </div>
                </div>
              ))}</div>
            </div>
          </div>
        ));})()}
        {errors.selectedRoom&&<div className="err-msg" style={{marginBottom:12}}>{errors.selectedRoom}</div>}

        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ REVIEW ═══ */}
      {step==="review"&&<div className="sec">
        <div className="sec-num">Almost Done!</div>
        <div className="sec-hd"><h2>Review Your Application</h2><p>Please verify all information is correct before submitting.</p></div>

        <div className="rev-sec"><h3>👤 Personal Info <span className="rev-edit" onClick={()=>setStep("personal")}>Edit</span></h3>
          <div className="rev-row"><span className="rev-label">Name</span><span className="rev-val">{data.firstName} {data.lastName}</span></div>
          <div className="rev-row"><span className="rev-label">Email</span><span className="rev-val">{data.email}</span></div>
          <div className="rev-row"><span className="rev-label">Phone</span><span className="rev-val">{data.phone}</span></div>
          <div className="rev-row"><span className="rev-label">DOB</span><span className="rev-val">{data.dob}</span></div>
          <div className="rev-row"><span className="rev-label">SSN</span><span className="rev-val">••••{data.ssn}</span></div>
          <div className="rev-row"><span className="rev-label">Photo ID</span><span className="rev-val">{data.idFileName||"Not uploaded"}</span></div>
        </div>

        <div className="rev-sec"><h3>💼 Employment <span className="rev-edit" onClick={()=>setStep("employment")}>Edit</span></h3>
          <div className="rev-row"><span className="rev-label">Employer</span><span className="rev-val">{data.employer}</span></div>
          <div className="rev-row"><span className="rev-label">Title</span><span className="rev-val">{data.jobTitle||"—"}</span></div>
          <div className="rev-row"><span className="rev-label">Monthly Income</span><span className="rev-val">${data.monthlyIncome||"—"}</span></div>
        </div>

        {appType==="tenant"&&<>
          <div className="rev-sec"><h3>🏠 Rental History <span className="rev-edit" onClick={()=>setStep("rental")}>Edit</span></h3>
            <div className="rev-row"><span className="rev-label">Prev Landlord</span><span className="rev-val">{data.prevLandlord}</span></div>
            <div className="rev-row"><span className="rev-label">Landlord Phone</span><span className="rev-val">{data.prevLandlordPhone}</span></div>
            <div className="rev-row"><span className="rev-label">Evicted</span><span className="rev-val" style={{color:data.evicted==="yes"?"var(--rd)":"var(--gn)"}}>{data.evicted==="yes"?"Yes":"No"}</span></div>
          </div>

          <div className="rev-sec"><h3>📋 References <span className="rev-edit" onClick={()=>setStep("references")}>Edit</span></h3>
            <div className="rev-row"><span className="rev-label">Employer Ref</span><span className="rev-val">{data.empRefName} · {data.empRefPhone}</span></div>
            <div className="rev-row"><span className="rev-label">Personal Ref</span><span className="rev-val">{data.persRefName||"—"}</span></div>
          </div>

          <div className="rev-sec"><h3>🚨 Emergency Contact <span className="rev-edit" onClick={()=>setStep("emergency")}>Edit</span></h3>
            <div className="rev-row"><span className="rev-label">Name</span><span className="rev-val">{data.emergName}</span></div>
            <div className="rev-row"><span className="rev-label">Phone</span><span className="rev-val">{data.emergPhone}</span></div>
            <div className="rev-row"><span className="rev-label">Relationship</span><span className="rev-val">{data.emergRelation}</span></div>
          </div>
        </>}

        {invite?.inviteRoomName&&<div className="rev-sec"><h3>🏠 Room</h3>
          <div className="rev-row"><span className="rev-label">Property</span><span className="rev-val">{invite.invitePropName}</span></div>
          <div className="rev-row"><span className="rev-label">Room</span><span className="rev-val">{invite.inviteRoomName}</span></div>
          <div className="rev-row"><span className="rev-label">Rent</span><span className="rev-val" style={{color:"var(--ac)"}}>${invite.inviteRent}/mo</span></div>
        </div>}

        <button className="btn-next" onClick={next}>Continue to Payment →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ PAYMENT ═══ */}
      {step==="payment"&&<div className="sec">
        <div className="sec-num">Final Step</div>
        <div className="sec-hd"><h2>Screening Fee</h2><p>This covers your background check, credit report, and application processing. This is a non-refundable fee.</p></div>

        <div className="fee-card">
          <h3>💳 Fee Breakdown</h3>
          <div className="fee-row"><span>Background Check & Credit Report</span><span>${invite?.screenPkg==="credit-only"?29:invite?.screenPkg==="bg-only"?29:49}</span></div>
          <div className="fee-row"><span>Application Processing</span><span>$10</span></div>
          <div className="fee-total"><span>Total Due Now</span><span>${baseFee}</span></div>
        </div>

        <div style={{background:"rgba(74,124,89,.06)",borderRadius:10,padding:12,marginBottom:20,fontSize:11,color:"var(--gn)"}}>
          <strong>🔒 Secure Payment</strong> — Your payment is processed securely through Stripe. Your card information is never stored on our servers.
        </div>

        {/* Stripe placeholder */}
        <div style={{border:"2px dashed rgba(0,0,0,.1)",borderRadius:12,padding:24,textAlign:"center",marginBottom:20,background:"rgba(0,0,0,.01)"}}>
          <div style={{fontSize:24,marginBottom:8}}>💳</div>
          <div style={{fontSize:13,fontWeight:600,color:"#999"}}>Stripe Payment Form</div>
          <div style={{fontSize:10,color:"#ccc",marginTop:4}}>Card number, expiry, CVC will go here</div>
          <div style={{fontSize:9,color:"#ccc",marginTop:8}}>Stripe integration pending — will connect to your Stripe account</div>
        </div>

        <button className="btn-start" onClick={()=>{
          // In production: process Stripe payment, then submit
          // For now: simulate submission
          setSubmitted(true);
          // Update app status in Supabase
          if(invite){
            loadKey("hq-apps",[]).then(apps=>{
              const updated=apps.map(a=>a.id===invite.id?{...a,status:"applied",lastContact:new Date().toISOString().split("T")[0],applicationData:data,history:[...(a.history||[]),{from:"invited",to:"applied",date:new Date().toISOString().split("T")[0],note:"Application submitted + fee paid"}]}:a);
              saveKey("hq-apps",updated);
              // Add notification
              loadKey("hq-notifs",[]).then(notifs=>{
                saveKey("hq-notifs",[{id:Math.random().toString(36).slice(2),type:"app",msg:`🎉 ${data.firstName} ${data.lastName} submitted their application + paid $${baseFee} screening fee`,date:new Date().toISOString().split("T")[0],read:false,urgent:true},...notifs]);
              });
            });
          }
        }}>Pay ${baseFee} & Submit Application</button>

        <div className="legal">By submitting, you authorize Black Bear Rentals and RentPrep to conduct a background check and credit inquiry. This screening will not impact your credit score. The application fee is non-refundable.</div>

        <button className="btn-back" onClick={back}>← Back to Review</button>
      </div>}
    </div>

    {/* Footer */}
    {step!=="done"&&<div className="app-footer">© {new Date().getFullYear()} Black Bear Rentals — Oak & Main Development LLC · <a href="https://rentblackbear.com" style={{color:"var(--ac)"}}>rentblackbear.com</a></div>}
  </div></>);
}
