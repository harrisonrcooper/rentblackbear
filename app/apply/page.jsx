"use client";
import { useState, useEffect, useRef } from "react";

// ─── Supabase ────────────────────────────────────────────────────
const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa=(path,opts={})=>fetch(`${SUPA_URL}/rest/v1/${path}`,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":`Bearer ${SUPA_KEY}`,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});
async function loadKey(k,fb){try{const r=await supa(`app_data?key=eq.${k}&select=value`);const d=await r.json();return d?.[0]?.value||fb;}catch{return fb;}}
async function saveKey(k,v){try{await supa("app_data",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify({key:k,value:v})});}catch{}}

// Unit-aware room helper — handles both old flat rooms[] and new units[] format
const allRooms=(prop)=>{
  if(!prop)return[];
  if(prop.units&&prop.units.length>0)return prop.units.flatMap(u=>u.rooms||[]);
  return prop.rooms||[];
};
// Get rooms with unit label attached
const allRoomsWithUnit=(prop)=>{
  if(!prop)return[];
  if(prop.units&&prop.units.length>0)return prop.units.flatMap(u=>(u.rooms||[]).map(r=>({...r,unitLabel:u.label,unitName:u.name})));
  return(prop.rooms||[]).map(r=>({...r,unitLabel:"",unitName:""}));
};
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS=Array.from({length:50},(_,i)=>2026-i);
const STATES=["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"];

// Normalize any stored date string into YYYY-MM-DD for DateDrop.
// Returns "" if the value is blank, "Flexible", or unparseable.
function toISODate(str){
  if(!str||str.toLowerCase()==="flexible")return"";
  if(/^\d{4}-\d{2}-\d{2}$/.test(str)){
    const d=new Date(str+"T00:00:00");
    return isNaN(d)?"":str;
  }
  const d=new Date(str);
  if(isNaN(d))return"";
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const dy=String(d.getDate()).padStart(2,"0");
  return`${y}-${m}-${dy}`;
}

// Three-dropdown date picker — returns value as "YYYY-MM-DD"
// mode="dob": years 1924–2008 (must be 18+)
// mode="movein": current year + 2 future years
function DateDrop({value,onChange,hasErr,mode="movein"}){
  const parts=value?value.split("-"):["","",""];
  const yr=parts[0]||"",mo=parts[1]||"",dy=parts[2]||"";
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const curYear=now.getFullYear();
  const curMonth=now.getMonth()+1; // 1-12
  const curDay=now.getDate();
  const dobYears=Array.from({length:curYear-1900+1},(_,i)=>curYear-i);
  const moveInYears=[curYear,curYear+1,curYear+2];
  const years=mode==="dob"?dobYears:moveInYears;
  const daysInMonth=(m,y)=>{if(!m||!y)return 31;return new Date(Number(y),Number(m),0).getDate();};
  const allDays=Array.from({length:daysInMonth(mo,yr)},(_,i)=>String(i+1).padStart(2,"0"));
  // For movein: filter out past days if selected month+year is current month+year
  const days=mode==="movein"&&Number(yr)===curYear&&Number(mo)===curMonth
    ?allDays.filter(d=>Number(d)>=curDay)
    :allDays;
  // For movein: filter out past months if selected year is current year
  const MONTH_NUMS=Array.from({length:12},(_,i)=>String(i+1).padStart(2,"0"));
  const validMonths=mode==="movein"&&Number(yr)===curYear
    ?MONTH_NUMS.filter(m=>Number(m)>=curMonth)
    :MONTH_NUMS;
  const set=(newYr,newMo,newDy)=>{
    if(!newYr&&!newMo&&!newDy){onChange("");return;}
    // If movein and selected date is in the past, auto-correct day to today
    if(mode==="movein"&&newYr&&newMo&&newDy){
      const picked=new Date(Number(newYr),Number(newMo)-1,Number(newDy));
      if(picked<today){
        onChange(`${newYr}-${newMo}-${String(curDay).padStart(2,"0")}`);return;
      }
    }
    onChange(`${newYr||"    "}-${newMo||"  "}-${newDy||"  "}`.trim());
  };
  const selStyle={
    flex:1,padding:"13px 8px",border:`2px solid ${hasErr?"var(--rd)":"rgba(0,0,0,.08)"}`,
    borderRadius:10,fontSize:15,fontFamily:"inherit",outline:"none",
    background:"#fff",color:(!yr&&!mo&&!dy)?"#999":"#3d3529",appearance:"none",
    WebkitAppearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center",paddingRight:28,
  };
  return(
    <div style={{display:"flex",gap:8}}>
      <select value={mo} onChange={e=>{const v=e.target.value;set(yr,v,dy);}} style={selStyle}>
        <option value="">Month</option>
        {MONTHS.map((m,i)=>{const mNum=String(i+1).padStart(2,"0");if(mode==="movein"&&!validMonths.includes(mNum))return null;return<option key={m} value={mNum}>{m}</option>;})}
      </select>
      <select value={dy} onChange={e=>set(yr,mo,e.target.value)} style={{...selStyle,flex:"0 0 90px"}}>
        <option value="">Day</option>
        {days.map(d=><option key={d} value={d}>{parseInt(d)}</option>)}
      </select>
      <select value={yr} onChange={e=>set(e.target.value,mo,dy)} style={{...selStyle,flex:"0 0 100px"}}>
        <option value="">Year</option>
        {years.map(y=><option key={y} value={String(y)}>{y}</option>)}
      </select>
    </div>
  );
}

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

/* Progress */
.prog{display:flex;gap:3px;padding:20px 0 10px}
.prog-seg{flex:1;height:4px;border-radius:2px;background:rgba(0,0,0,.06);transition:all .4s}
.prog-seg.done{background:var(--gn)}
.prog-seg.cur{background:var(--ac)}
.prog-label{font-size:10px;color:#5c4a3a;margin-bottom:24px}

/* Welcome */
.welcome{text-align:center;padding:60px 0 40px}
.welcome-bear{font-size:48px;margin-bottom:16px;animation:bounce 2s ease infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.welcome h1{font-family:'DM Serif Display',serif;font-size:28px;color:var(--dk);margin-bottom:12px}
.welcome-sub{color:#4a3f35;font-size:14px;line-height:1.6;max-width:380px;margin:0 auto 24px}
.welcome-perks{display:flex;flex-direction:column;gap:8px;margin-bottom:32px;text-align:left;max-width:340px;margin-left:auto;margin-right:auto}
.welcome-perk{display:flex;align-items:center;gap:10px;font-size:13px;color:#5c4a3a}
.welcome-perk .ic{width:28px;height:28px;border-radius:50%;background:rgba(74,124,89,.08);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.type-toggle{display:flex;gap:0;border:2px solid rgba(0,0,0,.08);border-radius:10px;overflow:hidden;margin-bottom:24px;max-width:300px;margin-left:auto;margin-right:auto}
.type-btn{flex:1;padding:12px;font-size:13px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:all .2s;background:#fff;color:#555}
.type-btn:hover{background:rgba(0,0,0,.06);color:#1a1714}
.type-btn.on{background:var(--dk);color:var(--cr)}
.cosigner-note{background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.15);border-radius:10px;padding:12px;margin-bottom:20px;font-size:12px;color:#9a7422}

/* Sections */
.sec{padding:24px 0;animation:fadeUp .4s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-3px)}30%{transform:translateX(3px)}45%{transform:translateX(-2px)}60%{transform:translateX(2px)}}
.sec-hd{margin-bottom:20px}
.sec-hd h2{font-family:'DM Serif Display',serif;font-size:22px;color:var(--dk);margin-bottom:4px}
.sec-hd p{font-size:12px;color:#5c4a3a;line-height:1.5}
.sec-num{font-size:10px;font-weight:700;color:var(--ac);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}

/* Fields */
.fld{margin-bottom:16px}
.fld label{display:block;font-size:11px;font-weight:700;color:#5c4a3a;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px}
.fld .req{color:var(--rd);margin-left:2px}
.fld input,.fld select,.fld textarea{width:100%;padding:13px 14px;border:2px solid rgba(0,0,0,.08);border-radius:10px;font-size:15px;font-family:inherit;outline:none;transition:border .2s;background:#fff;color:#3d3529}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:var(--ac)}
.fld input.err,.fld select.err,.fld textarea.err{border-color:var(--rd);animation:shake .4s}
.fld .err-msg{font-size:10px;color:var(--rd);margin-top:3px}
.fld .help{font-size:10px;color:#5c4a3a;margin-top:3px}
.fld-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fld-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.fld textarea{min-height:80px;resize:vertical}

/* Counter */
.counter{display:flex;align-items:center;gap:16px;margin-bottom:16px}
.counter-btn{width:40px;height:40px;border-radius:50%;border:2px solid rgba(0,0,0,.1);background:#fff;font-size:20px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;transition:all .15s;color:#3d3529}
.counter-btn:hover{border-color:var(--ac);color:var(--ac)}
.counter-val{font-size:28px;font-weight:700;min-width:40px;text-align:center}

/* Add card */
.add-card{border:2px dashed rgba(0,0,0,.1);border-radius:12px;padding:16px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:16px}
.add-card:hover{border-color:var(--ac);background:rgba(212,168,83,.02)}
.add-card .plus{font-size:20px;color:var(--ac);margin-bottom:4px}
.add-card .lbl{font-size:12px;color:#5c4a3a;font-weight:500}

/* Added item card */
.item-card{border:2px solid rgba(74,124,89,.15);border-radius:12px;padding:14px;margin-bottom:10px;background:rgba(74,124,89,.02);position:relative}
.item-card .item-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.item-card .item-nm{font-size:13px;font-weight:700;color:var(--dk)}
.item-card .item-sub{font-size:10px;color:#5c4a3a}
.item-card .item-del{background:none;border:none;color:var(--rd);cursor:pointer;font-size:11px;font-weight:600}
.item-card .item-edit{background:none;border:none;color:var(--ac);cursor:pointer;font-size:11px;font-weight:600;margin-right:8px}

/* Expand form */
.expand-form{border:2px solid var(--ac);border-radius:14px;padding:18px;margin-bottom:16px;background:rgba(212,168,83,.02);animation:fadeUp .3s}
.expand-form h3{font-size:14px;font-weight:700;color:var(--dk);margin-bottom:14px}

/* Res type toggle */
.res-toggle{display:flex;gap:0;border:2px solid rgba(0,0,0,.08);border-radius:10px;overflow:hidden;margin-bottom:16px}
.res-btn{flex:1;padding:10px;font-size:12px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:all .2s;background:#fff;color:#5c4a3a}
.res-btn.on{background:var(--dk);color:var(--cr)}

/* Strength tip */
.strength-tip{background:rgba(212,168,83,.06);border-radius:8px;padding:10px;font-size:11px;color:#9a7422;margin:12px 0}

/* Unemployed */
.unemployed-btn{display:flex;align-items:center;gap:8px;padding:10px 14px;border:2px solid rgba(0,0,0,.08);border-radius:10px;cursor:pointer;font-size:12px;color:#5c4a3a;transition:all .2s;margin-bottom:16px;background:#fff}
.unemployed-btn.on{border-color:var(--rd);background:rgba(196,92,74,.04);color:var(--rd)}

/* File upload */
.upload{border:2px dashed rgba(0,0,0,.1);border-radius:10px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(0,0,0,.01)}
.upload:hover{border-color:var(--ac);background:rgba(212,168,83,.03)}
.upload.has{border-color:var(--gn);border-style:solid;background:rgba(74,124,89,.03)}
.upload-ic{font-size:28px;margin-bottom:6px}
.upload-txt{font-size:12px;color:#5c4a3a}
.upload-file{font-size:12px;color:var(--gn);font-weight:600;margin-top:4px}

/* Yes/No */
.yn-row{display:flex;gap:8px;margin-bottom:16px}
.yn-q{font-size:13px;font-weight:600;color:#3d3529;margin-bottom:8px}
.yn-btn{flex:1;padding:12px;border:2px solid rgba(0,0,0,.08);border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;background:#fff;color:#5c4a3a}
.yn-btn.yes{border-color:var(--gn);background:rgba(74,124,89,.06);color:var(--gn)}
.yn-btn.no{border-color:var(--rd);background:rgba(196,92,74,.06);color:var(--rd)}

/* Room picker */
.room-card{border:2px solid rgba(0,0,0,.08);border-radius:12px;padding:14px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.room-card:hover{border-color:var(--ac)}
.room-card.sel{border-color:var(--ac);background:rgba(212,168,83,.04)}
.room-name{font-size:14px;font-weight:700;color:var(--dk)}
.room-meta{font-size:11px;color:#5c4a3a;margin-top:2px}
.room-price{font-size:16px;font-weight:700;color:var(--ac)}
.prop-card{background:#fff;border:2px solid rgba(0,0,0,.06);border-radius:14px;overflow:hidden;margin-bottom:20px}
.prop-img{height:140px;background:linear-gradient(135deg,#2c2520,#1a1714);display:flex;align-items:center;justify-content:center;color:var(--ac);font-size:32px}
.prop-info{padding:14px}
.prop-name{font-family:'DM Serif Display',serif;font-size:18px;margin-bottom:2px}
.prop-addr{font-size:11px;color:#5c4a3a}

/* Buttons */
.btn-next{width:100%;padding:16px;background:var(--ac);color:var(--dk);border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.btn-next:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(212,168,83,.3)}
.btn-back{width:100%;padding:14px;background:none;border:2px solid rgba(0,0,0,.08);border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;color:#5c4a3a;transition:all .2s;margin-top:8px}
.btn-back:hover{border-color:#999}
.btn-start{width:100%;padding:18px;background:var(--dk);color:var(--cr);border:none;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .3s}
.btn-start:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,23,20,.3)}

/* Review */
.rev-sec{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;padding:14px;margin-bottom:10px}
.rev-sec h3{font-size:13px;font-weight:700;color:var(--dk);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.rev-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(0,0,0,.03);font-size:12px}
.rev-row:last-child{border:none}
.rev-label{color:#5c4a3a}
.rev-val{font-weight:600;color:#3d3529;text-align:right;max-width:60%}
.rev-edit{font-size:10px;color:var(--ac);cursor:pointer;font-weight:600;margin-left:auto}

/* Fee */
.fee-card{background:var(--dk);border-radius:14px;padding:20px;color:var(--cr);margin-bottom:20px}
.fee-card h3{font-size:14px;margin-bottom:12px}
.fee-row{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;color:var(--mt)}
.fee-total{display:flex;justify-content:space-between;padding:10px 0 0;border-top:1px solid rgba(255,255,255,.1);font-size:16px;font-weight:700;margin-top:6px}

/* Legal */
.legal{font-size:10px;color:#5c4a3a;line-height:1.6;text-align:center;margin:16px 0 24px}
.legal a{color:var(--ac);text-decoration:underline}

/* Submitted */
.submitted{text-align:center;padding:80px 20px}
.submitted-ic{font-size:56px;margin-bottom:16px}
.submitted h1{font-family:'DM Serif Display',serif;font-size:26px;color:var(--dk);margin-bottom:8px}
.submitted p{color:#5c4a3a;font-size:14px;line-height:1.6;max-width:400px;margin:0 auto}

@media(max-width:500px){
  .fld-row,.fld-row3{grid-template-columns:1fr}
  .welcome h1{font-size:24px}
  .sec-hd h2{font-size:20px}
  .fld input,.fld select,.fld textarea{font-size:16px;padding:12px}
  .type-toggle{max-width:100%}
  .res-toggle{flex-wrap:wrap}
  .res-btn{min-width:30%}
}
`;

export default function ApplyPage(){
  const[step,setStep]=useState("welcome");
  const[appType,setAppType]=useState("tenant");
  const[d,setD]=useState({
    firstName:"",lastName:"",email:"",phone:"",dob:"",gender:"",occupationType:"",occupationTypeOther:"",
    moveIn:"",occupants:1,occupancyAck:false,coApplicants:[],minorChildren:0,
    // Personal
    ssn:"",appDocs:[],
    // Rental
    addresses:[],curAddressForm:null,
    evicted:"",evictedExplain:"",felony:"",felonyExplain:"",
    // Employment
    employers:[],curEmployerForm:null,unemployed:false,
    // References
    empRefName:"",empRefPhone:"",empRefRelation:"",persRefName:"",persRefPhone:"",persRefRelation:"",
    // Partner (couples-allowed bedrooms)
    partnerName:"",partnerEmail:"",
    // Emergency
    emergName:"",emergPhone:"",emergRelation:"",
    // Room
    selectedRoom:"",preferredProperty:"",doorCode:"",
    // Docs
    idUploadLater:false,incomeUploadLater:false,payStubsName:"",
  });
  const[appFields,setAppFields]=useState([]);

  // Helper: get field config from hq-app-fields by key
  const getField=(key)=>appFields.find(f=>f.key===key)||null;
  const fieldActive=(key)=>{const f=getField(key);return !f||f.active!==false;};
  const fieldRequired=(key)=>{const f=getField(key);return f?f.required:true;};
  const fieldLabel=(key,fallback)=>{const f=getField(key);return (f&&f.label)||fallback;};
  const fieldPlaceholder=(key,fallback)=>{const f=getField(key);return (f&&f.placeholder)||fallback||"";};
  const fieldHelp=(key,fallback)=>{const f=getField(key);return (f&&f.helpText)||fallback||"";};
  const[invite,setInvite]=useState(null);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[submitted,setSubmitted]=useState(false);
  const[props_,setProps]=useState([]);
  const[errors,setErrors]=useState({});
  const idFrontRef=useRef(null);const idBackRef=useRef(null);const payRef=useRef(null);

  const upd=(k,v)=>{setD(p=>({...p,[k]:v}));setErrors(p=>({...p,[k]:undefined}));};
  const fmtFileName=(file,docType)=>{
    const date=new Date().toISOString().split("T")[0];
    const first=(d.firstName||"").trim().replace(/[^a-zA-Z]/g,"");
    const last=(d.lastName||"").trim().replace(/[^a-zA-Z]/g,"");
    const name=first&&last?first+last:first||last||"Applicant";
    const appId=invite?.id?"_APP-"+invite.id:"";
    const ext=(file.name.split(".").pop()||"pdf").toLowerCase();
    return date+"_"+name+"_"+docType+appId+"."+ext;
  };
  const deleteDoc=async(doc)=>{
    if(doc.url){
      const path=doc.url.split("/applicant-docs/")[1];
      if(path){
        await fetch(SUPA_URL+"/storage/v1/object/applicant-docs/"+path,{
          method:"DELETE",
          headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY},
        }).catch(()=>{});
      }
    }
    setD(p=>({...p,appDocs:p.appDocs.filter(x=>x.id!==doc.id)}));
  };
  const uploadDoc=async(file,type,label)=>{
    const tempId=Math.random().toString(36).slice(2);
    // Replace existing doc of same type for ID (only one front, one back), stack for PayStub
    const isReplace=type!=="PayStub";
    setD(p=>({...p,appDocs:[...(isReplace?p.appDocs.filter(x=>x.type!==type):p.appDocs),{id:tempId,type,label,url:null,name:file.name,uploading:true,error:null}]}));
    const date=new Date().toISOString().split("T")[0];
    const first=(d.firstName||"").trim().replace(/[^a-zA-Z]/g,"");
    const last=(d.lastName||"").trim().replace(/[^a-zA-Z]/g,"");
    const nameStr=first&&last?first+last:first||last||"Applicant";
    const appId=invite?.id||"tmp";
    const ext=(file.name.split(".").pop()||"jpg").toLowerCase();
    const fileName=date+"_"+nameStr+"_"+type+"_APP-"+appId+"."+ext;
    const path="applicants/"+appId+"/"+fileName;
    try{
      const r=await fetch(SUPA_URL+"/storage/v1/object/applicant-docs/"+path,{
        method:"POST",
        headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":file.type,"x-upsert":"true"},
        body:file,
      });
      if(!r.ok){setD(p=>({...p,appDocs:p.appDocs.map(x=>x.id===tempId?{...x,uploading:false,error:"Upload failed — check connection and try again"}:x)}));return;}
      const url=SUPA_URL+"/storage/v1/object/public/applicant-docs/"+path;
      setD(p=>({...p,appDocs:p.appDocs.map(x=>x.id===tempId?{...x,url,name:fileName,uploading:false,uploadedAt:date}:x)}));
    }catch{
      setD(p=>({...p,appDocs:p.appDocs.map(x=>x.id===tempId?{...x,uploading:false,error:"Network error — please try again"}:x)}));
    }
  };
  const fmtPhone=(v)=>{const x=v.replace(/\D/g,"").slice(0,10);if(x.length<=3)return x;if(x.length<=6)return`(${x.slice(0,3)}) ${x.slice(3)}`;return`(${x.slice(0,3)}) ${x.slice(3,6)}-${x.slice(6)}`;};
  const shake=()=>{const el=document.querySelector('.sec');if(el){el.style.animation="none";el.offsetHeight;el.style.animation="shake .4s ease";}};

  useEffect(()=>{(async()=>{try{
    // Read ?invite= from URL
    const inviteId=new URLSearchParams(window.location.search).get("invite");
    const apps=await loadKey("hq-apps",[]);
    // Match by ID first, fall back to matching by email if already submitted
    const inv=inviteId?apps.find(a=>a.id===inviteId&&a.status==="invited"):null;
    if(inv){
      setInvite(inv);
      const nameParts=(inv.name||"").trim().split(" ");
      const capWord=s=>s?s.charAt(0).toUpperCase()+s.slice(1).toLowerCase():"";
      const firstN=capWord(nameParts[0]||"");
      const lastN=nameParts.slice(1).map(capWord).join(" ");
      // Prefill everything available from the pre-screen / invite record
      setD(p=>({...p,
        firstName:firstN,
        lastName:lastN,
        email:inv.email||"",
        phone:inv.phone||"",
        moveIn:toISODate(inv.termMoveIn||inv.moveIn||""),
        preferredProperty:inv.invitePropName||inv.property||"",
        selectedRoom:inv.termRoomId||"",
        income:inv.income||"",
        source:inv.source||"",
      }));
    }
    const p=await loadKey("hq-props",[]);setProps(p);
    const af=await loadKey("hq-app-fields",[]);setAppFields(af);
  }catch{}setLoading(false);})();},[]);
  useEffect(()=>{if(step!=="welcome"&&step!=="done"&&!loading){setSaving(true);const t=setTimeout(()=>setSaving(false),1500);return()=>clearTimeout(t);}},[d,step]);

  const ageOk=(dob)=>{if(!dob||dob.includes(" "))return false;const b=new Date(dob+"T00:00:00");if(isNaN(b))return false;const today=new Date();let age=today.getFullYear()-b.getFullYear();const m=today.getMonth()-b.getMonth();if(m<0||(m===0&&today.getDate()<b.getDate()))age--;return age>=18;};

  const validate=(s)=>{
    const e={};
    const req=(key)=>fieldActive(key)&&fieldRequired(key);
    if(s==="welcome"){
      if(req("firstName")&&!d.firstName.trim())e.firstName=`${fieldLabel("firstName","First Name")} is required`;
      if(req("lastName")&&!d.lastName.trim())e.lastName=`${fieldLabel("lastName","Last Name")} is required`;
      if(req("email")&&(!d.email.trim()||!d.email.includes("@")))e.email="Valid email address is required";
      if(req("phone")&&d.phone.replace(/\D/g,"").length!==10)e.phone="A 10-digit phone number is required";
      if(req("dob")&&(!d.dob||d.dob.includes(" ")))e.dob="Date of birth is required";
      if(d.dob&&!d.dob.includes(" ")&&!ageOk(d.dob))e.dob="Applicant must be at least 18 years old to apply";
    }
    if(s==="appinfo"){

      if(req("moveIn")&&(!d.moveIn||d.moveIn.includes(" ")))e.moveIn="Please select your desired move-in date";
      if(d.moveIn&&!d.moveIn.includes(" ")){const mi=new Date(d.moveIn+"T00:00:00");const tod=new Date();tod.setHours(0,0,0,0);if(mi<tod)e.moveIn="Move-in date cannot be in the past — please select today or a future date";}
      if(!invite&&req("preferredProperty")&&!d.preferredProperty)e.preferredProperty="Please select which property you are interested in";
      if(!d.gender)e.gender="Please select a gender option";
      if(!d.occupationType)e.occupationType="Please select what best describes you";
      if(d.occupationType==="Other"&&!d.occupationTypeOther.trim())e.occupationTypeOther="Please describe what best describes you";
      // Occupancy validation — dynamic based on rental mode
      const appInfoProp=invite?.termPropId?props_.find(p=>p.id===invite.termPropId):(invite?.property||d.preferredProperty)?props_.find(p=>p.name===(invite?.property||d.preferredProperty)):null;
      const appInfoInvitedRoom=invite?.termRoomId?allRooms(appInfoProp||{}).find(r=>r.id===invite.termRoomId):null;
      const appInfoWholeUnit=appInfoInvitedRoom?.isWholeUnit||(appInfoProp?(appInfoProp.units||[]).some(u=>u.rentalMode==="wholeHouse")||appInfoProp.rentalMode==="wholeHouse":false);
      if(!appInfoWholeUnit&&!invite?.allowCouples&&!d.occupancyAck)e.occupancyAck="You must agree to continue — only one person per room";
      d.coApplicants.forEach((ca,i)=>{if(ca.email&&!ca.email.includes("@"))e["coApp_"+i+"_email"]="Valid email address required";});
    }
    if(s==="personal"){
      if(fieldActive("idFile")&&fieldRequired("idFile")&&!d.idUploadLater){const hasF=d.appDocs.some(x=>x.type==="PhotoID-Front"&&x.url);const hasB=d.appDocs.some(x=>x.type==="PhotoID-Back"&&x.url);if(!hasF||!hasB)e.idFile=!hasF?"Please upload the front of your photo ID":"Please upload the back of your photo ID";}
    }
    if(s==="rental"){
      if(req("addresses")&&d.addresses.length===0)e.addresses="Please add at least one address";
      if(req("addresses")&&d.addresses.length>0&&calcMonthsCovered(d.addresses)<24)e.addresses="Please add addresses covering at least 2 years of rental history";
      if(fieldActive("evicted")&&d.evicted==="")e.evicted="Please answer this question";
      if(fieldActive("felony")&&d.felony==="")e.felony="Please answer this question";
    }
    if(s==="employment"){
      if(!d.unemployed&&fieldActive("employers")&&fieldRequired("employers")&&d.employers.length===0&&!d.incomeUploadLater)e.employers="Please add at least one employer, or check the box to upload income proof later";
    }
    if(s==="references"){
      if(!d.unemployed&&fieldActive("empRefName")&&fieldRequired("empRefName")&&!d.empRefName.trim())e.empRefName=`${fieldLabel("empRefName","Employer reference name")} is required`;
      if(!d.unemployed&&fieldActive("empRefPhone")&&fieldRequired("empRefPhone")&&!d.empRefPhone.trim())e.empRefPhone=`${fieldLabel("empRefPhone","Employer reference phone")} is required`;
      if(fieldActive("persRefName")&&fieldRequired("persRefName")&&!d.persRefName.trim())e.persRefName=`${fieldLabel("persRefName","Personal reference name")} is required`;
      if(fieldActive("persRefPhone")&&fieldRequired("persRefPhone")&&!d.persRefPhone.trim())e.persRefPhone=`${fieldLabel("persRefPhone","Personal reference phone")} is required`;
    }
    if(s==="emergency"){
      if(fieldActive("emergName")&&fieldRequired("emergName")&&!d.emergName.trim())e.emergName=`${fieldLabel("emergName","Emergency contact name")} is required`;
      if(fieldActive("emergPhone")&&fieldRequired("emergPhone")&&!d.emergPhone.trim())e.emergPhone=`${fieldLabel("emergPhone","Emergency contact phone")} is required`;
      if(fieldActive("emergRelation")&&fieldRequired("emergRelation")&&!d.emergRelation.trim())e.emergRelation=`${fieldLabel("emergRelation","Relationship")} is required`;
    }
    if(s==="room"){
      if(invite?.inviteRoomMode==="choice"&&!d.selectedRoom)e.selectedRoom="Please select a room";
      if(fieldActive("doorCode")&&fieldRequired("doorCode")&&!/^\d{4}$/.test(d.doorCode))e.doorCode=`${fieldLabel("doorCode","Door Code")} must be exactly 4 digits — numbers only`;
    }
    setErrors(e);if(Object.keys(e).length>0)shake();return Object.keys(e).length===0;
  };

  const STEPS_TENANT=["welcome","appinfo","rental","personal","employment","references","emergency","room","review","payment","done"];
  const STEPS_COSIGNER=["welcome","appinfo","personal","employment","review","payment","done"];
  const getSteps=()=>{
    const s=appType==="cosigner"?STEPS_COSIGNER:STEPS_TENANT;
    return s.filter(x=>{if(x==="room"&&invite?.inviteRoomMode!=="choice")return false;return true;});
  };
  const steps=getSteps();
  const stepIdx=steps.indexOf(step);
  const next=()=>{if(!validate(step))return;if(stepIdx<steps.length-1)setStep(steps[stepIdx+1]);};
  const back=()=>{if(stepIdx>0)setStep(steps[stepIdx-1]);};
  const LABELS={welcome:"Start",appinfo:"App Info",rental:"Rental History",personal:"Personal Info",employment:"Employment",references:"References",emergency:"Emergency",room:"Room",review:"Review",payment:"Payment",done:"Done"};
  const baseFee=invite?.inviteFee||59;

  // Address form helpers
  const blankAddr={resType:"Rent",monthIn:"",yearIn:"",street:"",unit:"",city:"",state:"AL",zip:"",rent:"",reason:"",landlordFirstName:"",landlordLastName:"",landlordEmail:"",landlordPhone:""};
  const calcMonthsCovered=(addrs)=>{const MNAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];const now=new Date();return addrs.reduce((tot,a)=>{const mi=MNAMES.indexOf(a.monthIn);if(mi<0||!a.yearIn)return tot;const start=new Date(parseInt(a.yearIn),mi,1);return tot+Math.max(0,(now.getFullYear()-start.getFullYear())*12+(now.getMonth()-start.getMonth()));},0);};
  const saveAddr=()=>{const f=d.curAddressForm;if(!f)return;
    const missing=!f.street||!f.city||!f.zip||!f.monthIn||!f.yearIn||!f.reason||!f.landlordFirstName||!f.landlordLastName||!f.landlordEmail||!f.landlordPhone;
    const badEmail=f.landlordEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.landlordEmail);
    const badPhone=f.landlordPhone&&f.landlordPhone.replace(/\D/g,"").length!==10;
    if(missing||badEmail||badPhone){upd("curAddressForm",{...f,_saved:true,_badEmail:badEmail,_badPhone:badPhone});shake();return;}
    if(f._editIdx!==undefined){setD(p=>({...p,addresses:p.addresses.map((a,i)=>i===f._editIdx?f:a),curAddressForm:null}));}
    else{setD(p=>{const newAddrs=[...p.addresses,f];const months=calcMonthsCovered(newAddrs);const needMore=months<24;return{...p,addresses:newAddrs,curAddressForm:needMore?{...blankAddr,_needMore:true}:null};});}};
  const blankEmp={employer:"",position:"",monthStarted:"",yearStarted:"",monthlyIncome:"",refName:"",refPhone:""};
  const saveEmp=()=>{const f=d.curEmployerForm;if(!f)return;if(!f.employer||!f.monthlyIncome){shake();return;}
    if(f._editIdx!==undefined){setD(p=>({...p,employers:p.employers.map((e,i)=>i===f._editIdx?f:e),curEmployerForm:null}));}
    else{setD(p=>({...p,employers:[...p.employers,f],curEmployerForm:null}));}};

  if(loading)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#999"}}><div style={{textAlign:"center"}}><div style={{marginBottom:8}}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="13" r="7"/><circle cx="5" cy="7" r="3"/><circle cx="19" cy="7" r="3"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/><path d="M10 15.5s.8 1 2 1 2-1 2-1"/></svg></div>Loading your application...</div></div>);
  if(submitted)return(<><style>{CSS}</style><div className="app-wrap"><div className="app-header"><div className="app-logo">Black Bear <span>Rentals</span></div></div><div className="app-body"><div className="submitted"><div className="submitted-ic"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg></div><h1>Application Submitted!</h1><p>Thanks, {d.firstName}! We've received your application and screening payment. We'll review everything and get back to you within 24-48 hours.</p><div style={{marginTop:24,padding:16,background:"rgba(74,124,89,.06)",borderRadius:12,fontSize:12,color:"#4a7c59"}}><strong>What happens next?</strong><br/>1. Your background check and credit report are processing<br/>2. We'll review your application and references<br/>3. You'll receive an email with our decision<br/>4. If approved, we'll send your lease for e-signing</div></div></div><div className="app-footer">© {new Date().getFullYear()} Black Bear Rentals</div></div></>);

  return(<><style>{CSS}</style><div className="app-wrap">
    <div className="app-header"><div className="app-logo">Black Bear <span>Rentals</span></div>{step!=="welcome"&&step!=="done"&&<div className="app-save">{saving?<><div className="dot"/>Saving...</>:"✓ Saved"}</div>}</div>
    <div className="app-body">
      {step!=="welcome"&&step!=="done"&&<><div className="prog">{steps.filter(s=>s!=="welcome"&&s!=="done").map((s,i)=>{const si=steps.indexOf(s);return<div key={s} className={`prog-seg ${si<stepIdx?"done":si===stepIdx?"cur":""}`}/>;})}</div><div className="prog-label">Step {stepIdx} of {steps.length-2} · {LABELS[step]}</div></>}

      {/* ═══ WELCOME ═══ */}
      {step==="welcome"&&<div className="welcome">
        <div className="welcome-bear"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="13" r="7"/><circle cx="5" cy="7" r="3"/><circle cx="19" cy="7" r="3"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/><path d="M10 15.5s.8 1 2 1 2-1 2-1"/></svg></div>
        <h1>Start My Application</h1>
        {invite?.inviteRoomName&&<div style={{fontSize:13,color:"var(--ac)",fontWeight:600,marginBottom:12}}>{invite.invitePropName} · {invite.inviteRoomName}{invite.inviteRent?` — $${invite.inviteRent}/mo`:""}</div>}
        <div className="welcome-sub">We're excited you're interested! This application is quick, secure, and saves automatically.</div>
        <div className="welcome-perks">
          <div className="welcome-perk"><div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>Takes less than 11 minutes</div>
          <div className="welcome-perk"><div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></div>Easy to save and resume at any time</div>
          <div className="welcome-perk"><div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg></div>Will never impact your credit score</div>
          <div className="welcome-perk"><div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>Your information is encrypted and secure</div>
        </div>
        <div style={{fontSize:11,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>What are you applying as?</div>
        <div className="type-toggle"><button className={`type-btn ${appType==="tenant"?"on":""}`} onClick={()=>setAppType("tenant")}>Tenant</button><button className={`type-btn ${appType==="cosigner"?"on":""}`} onClick={()=>setAppType("cosigner")}>Co-Signer</button></div>
        {appType==="cosigner"&&<div className="cosigner-note">As a co-signer, you'll complete a shorter application covering your identity and income.</div>}
        <div style={{textAlign:"left",maxWidth:400,margin:"0 auto"}}>
          {invite&&<div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(74,124,89,.05)",border:"1px solid rgba(74,124,89,.15)",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:12,color:"var(--gn)"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gn)" strokeWidth="2" style={{flexShrink:0}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Info pre-filled from your pre-screen &mdash; <span style={{fontWeight:400,opacity:.75}}>incorrect? Edit the fields below.</span></span>
          </div>}
          <div className="fld-row">
            <div className="fld"><label>{fieldLabel("firstName","First Name")}{fieldRequired("firstName")&&<span className="req">*</span>}</label><input value={d.firstName} onChange={e=>upd("firstName",e.target.value)} className={errors.firstName?"err":""} placeholder={fieldPlaceholder("firstName","First name")}/>{errors.firstName&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.firstName}</div>}</div>
            <div className="fld"><label>{fieldLabel("lastName","Last Name")}{fieldRequired("lastName")&&<span className="req">*</span>}</label><input value={d.lastName} onChange={e=>upd("lastName",e.target.value)} className={errors.lastName?"err":""} placeholder={fieldPlaceholder("lastName","Last name")}/>{errors.lastName&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.lastName}</div>}</div>
          </div>
          {fieldActive("email")&&<div className="fld"><label>{fieldLabel("email","Email Address")}{fieldRequired("email")&&<span className="req">*</span>}</label><input type="email" value={d.email} onChange={e=>upd("email",e.target.value)} className={errors.email?"err":""} placeholder={fieldPlaceholder("email","you@email.com")}/>{errors.email&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.email}</div>}</div>}
          <div className="fld"><label>{fieldLabel("phone","Phone Number")}{fieldRequired("phone")&&<span className="req">*</span>}</label><input type="tel" value={d.phone} onChange={e=>upd("phone",fmtPhone(e.target.value))} className={errors.phone?"err":""} placeholder={fieldPlaceholder("phone","(256) 555-1234")}/>{errors.phone&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.phone}</div>}</div>
          {fieldActive("dob")&&<div className="fld"><label>{fieldLabel("dob","Date of Birth")}{fieldRequired("dob")&&<span className="req">*</span>}</label><DateDrop value={d.dob} onChange={v=>upd("dob",v)} hasErr={!!errors.dob} mode="dob"/>{fieldHelp("dob")&&<div className="help">{fieldHelp("dob")}</div>}{errors.dob&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.dob}</div>}</div>}
        </div>
        <div className="legal">By clicking the button below you are agreeing to our <a href="#">Application Authorization Policy</a>, <a href="#">Terms of Use</a> & <a href="#">Privacy Policy</a>.</div>
        <button className="btn-start" onClick={next}>Begin Application →</button>
      </div>}

      {/* ═══ APP INFO ═══ */}
      {step==="appinfo"&&<div className="sec">
        <div className="sec-num">Application Info</div>
        <div className="sec-hd"><h2>A Few Quick Details</h2><p>Help us prepare for your move-in.</p></div>
        <div className="fld"><label>Desired Move-in Date<span className="req">*</span></label><DateDrop value={d.moveIn} onChange={v=>upd("moveIn",v)} hasErr={!!errors.moveIn} mode="movein"/>{errors.moveIn&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.moveIn}</div>}</div>

        {/* Room/property selection — only for walk-ins without a locked room */}
        {(!invite||(invite&&!invite.inviteRoomName&&invite.inviteRoomMode!=="locked"))&&<>
          <div className="fld">
            <label>Which property are you interested in?</label>
            <select value={d.preferredProperty} onChange={e=>{upd("preferredProperty",e.target.value);upd("selectedRoom","");}}>
              <option value="">Select a property...</option>
              {props_.map(p=><option key={p.id} value={p.name}>{p.name}{p.addr?" — "+p.addr:""}</option>)}
              <option value="No preference">No preference — any available room</option>
            </select>
          </div>
          {d.preferredProperty&&d.preferredProperty!=="No preference"&&(()=>{
            const prop=props_.find(p=>p.name===d.preferredProperty);
            const vacant=allRooms(prop).filter(r=>r.st==="vacant")||[];
            if(!prop)return null;
            if(prop.rentalMode==="wholeHouse")return(
              <div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.15)",borderRadius:10,padding:12,marginBottom:16,fontSize:12,color:"#9a7422"}}>
                🏠 <strong>{prop.name}</strong> is available as an entire property rental{prop.wholeHouseRent?` — $${prop.wholeHouseRent.toLocaleString()}/mo`:""}. We'll reach out to discuss details.
              </div>
            );
            if(vacant.length===0)return(
              <div style={{background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.15)",borderRadius:10,padding:12,marginBottom:16,fontSize:12,color:"var(--rd)"}}>
                No rooms currently available at this property. Your application will be kept on file.
              </div>
            );
            return(<div className="fld">
              <label>Which room are you interested in?</label>
              <select value={d.selectedRoom} onChange={e=>upd("selectedRoom",e.target.value)}>
                <option value="">No preference — any available room</option>
                {vacant.map(r=><option key={r.id} value={r.id}>{r.name} — ${r.rent}/mo · {r.pb?"Private bath":"Shared bath"}{r.sqft?" · "+r.sqft+" sqft":""}{r.desc?" · "+r.desc:""}</option>)}
              </select>
            </div>);
          })()}
        </>}

        {errors.preferredProperty&&<div className="err-msg" style={{animation:"shake .4s ease",marginBottom:12,fontSize:12,padding:"10px 12px",background:"rgba(196,92,74,.04)",borderRadius:8,border:"1px solid rgba(196,92,74,.15)"}}>{errors.preferredProperty}</div>}
        {/* If locked room from invite — show confirmation */}
        {invite?.inviteRoomName&&<div style={{background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.15)",borderRadius:10,padding:12,marginBottom:16,fontSize:12,color:"var(--gn)"}}>
          🏠 Applying for <strong>{invite.inviteRoomName}</strong> at <strong>{invite.invitePropName}</strong>{invite.inviteRent?` — $${invite.inviteRent}/mo`:""}.
        </div>}

        {/* ── OCCUPANCY — dynamic per rental mode ── */}
        {(()=>{
          const aProp=invite?.termPropId?props_.find(p=>p.id===invite.termPropId):(invite?.property||d.preferredProperty)?props_.find(p=>p.name===(invite?.property||d.preferredProperty)):null;
          const aInvitedRoom=invite?.termRoomId?allRooms(aProp||{}).find(r=>r.id===invite.termRoomId):null;
          const isWhole=aInvitedRoom?.isWholeUnit===true;
          const allowCouples=!isWhole&&(invite?.allowCouples===true);
          // Whole-unit gets co-applicant list; per-bedroom always gets acknowledgment
          if(isWhole){
            // Whole-unit: list all adults who will be staying
            const soloConfirmed=d.coApplicants.length===0;
            return(<div style={{marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1a1714",marginBottom:4}}>Who else will be living here?</div>
              <div style={{fontSize:11,color:"#5c4a3a",marginBottom:12,lineHeight:1.5}}>List all adults (18 or older) who will live at this property. Each person must complete a separate application and screening. Minor children do not need to apply.</div>
              {soloConfirmed&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,marginBottom:12,fontSize:12,color:"#2d6a3f",fontWeight:600}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Only me — I’ll be the sole adult occupant
              </div>}
              {d.coApplicants.map((ca,i)=>(
                <div key={i} style={{border:"2px solid rgba(74,124,89,.15)",borderRadius:10,padding:12,marginBottom:8,background:"rgba(74,124,89,.02)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>Adult Occupant {i+2}</span>
                    <button onClick={()=>setD(p=>({...p,coApplicants:p.coApplicants.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:"var(--rd)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Remove</button>
                  </div>
                  <div className="fld-row" style={{marginBottom:0}}>
                    <div className="fld" style={{marginBottom:0}}><label>Full Name</label><input value={ca.name} onChange={e=>setD(p=>({...p,coApplicants:p.coApplicants.map((x,j)=>j===i?{...x,name:e.target.value}:x)}))} placeholder="Full name"/></div>
                    <div className="fld" style={{marginBottom:0}}><label>Email Address<span className="req">*</span></label><input type="email" value={ca.email} onChange={e=>setD(p=>({...p,coApplicants:p.coApplicants.map((x,j)=>j===i?{...x,email:e.target.value}:x)}))} className={errors["coApp_"+i+"_email"]?"err":""} placeholder="they@email.com"/>{errors["coApp_"+i+"_email"]&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors["coApp_"+i+"_email"]}</div>}</div>
                  </div>
                </div>
              ))}
              <div className="add-card" style={{marginBottom:0}} onClick={()=>setD(p=>({...p,coApplicants:[...p.coApplicants,{id:Math.random().toString(36).slice(2),name:"",email:""}]}))}>
                <div className="plus">+</div>
                <div className="lbl">Add Adult Occupant</div>
              </div>
              <div style={{marginTop:14,display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"rgba(212,168,83,.04)",border:"1px solid rgba(212,168,83,.15)",borderRadius:8}}>
                <span style={{fontSize:12,color:"#5c4a3a",flex:1}}>Minor children (under 18) living here?</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button onClick={()=>setD(p=>({...p,minorChildren:Math.max(0,(p.minorChildren||0)-1)}))} style={{width:26,height:26,borderRadius:"50%",border:"1px solid rgba(0,0,0,.12)",background:"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:"#1a1714",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{fontSize:16,fontWeight:800,minWidth:24,textAlign:"center",color:"#1a1714"}}>{d.minorChildren||0}</span>
                  <button onClick={()=>setD(p=>({...p,minorChildren:(p.minorChildren||0)+1}))} style={{width:26,height:26,borderRadius:"50%",border:"1px solid rgba(0,0,0,.12)",background:"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:"#1a1714",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
              </div>
            </div>);
          }
          // Couples allowed — show partner info section
          if(allowCouples){
            return(<div style={{marginBottom:20,background:"rgba(74,124,89,.03)",border:"2px solid rgba(74,124,89,.2)",borderRadius:12,padding:16}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1a1714",marginBottom:4}}>Couples Welcome</div>
              <div style={{fontSize:12,color:"#5c4a3a",lineHeight:1.6,marginBottom:14}}>
                This bedroom is approved for <strong>2 adults</strong>. Please provide your partner's info below so we can include them on the lease. Both adults will share the same lease &#8212; your partner does not need a separate application.
              </div>
              <div style={{background:"#fff",borderRadius:8,border:"1px solid rgba(0,0,0,.07)",padding:12,marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--ac)",textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Partner / Co-Occupant</div>
                <div className="fld-row">
                  <div className="fld"><label>First Name</label><input value={d.partnerName.split(" ")[0]||""} onChange={e=>upd("partnerName",e.target.value+" "+(d.partnerName.split(" ").slice(1).join(" ")||"").trim())} placeholder="First name"/></div>
                  <div className="fld"><label>Last Name</label><input value={d.partnerName.split(" ").slice(1).join(" ")||""} onChange={e=>upd("partnerName",(d.partnerName.split(" ")[0]||"")+" "+e.target.value)} placeholder="Last name"/></div>
                </div>
                <div className="fld" style={{marginBottom:0}}><label>Email Address</label><input type="email" value={d.partnerEmail} onChange={e=>upd("partnerEmail",e.target.value)} placeholder="partner@email.com"/></div>
              </div>
              <div style={{fontSize:11,color:"#5c4a3a",background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.15)",borderRadius:6,padding:"8px 10px"}}>
                Max 2 adults permitted in this bedroom under this lease.
              </div>
            </div>);
          }

          // Per-bedroom (default for all by-room rentals and walk-ins) — always show acknowledgment
          const hasErr=!!errors.occupancyAck;
          return(<div style={{marginBottom:20,background:hasErr?"rgba(196,92,74,.04)":"rgba(212,168,83,.03)",border:"2px solid "+(hasErr?"rgba(196,92,74,.35)":"rgba(212,168,83,.2)"),borderRadius:12,padding:16,animation:hasErr?"shake .4s ease":"none"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1a1714",marginBottom:6}}>Occupancy Policy</div>
            <div style={{fontSize:12,color:"#5c4a3a",lineHeight:1.6,marginBottom:14}}>This rental is <strong>by the bedroom</strong>. Only <strong>1 adult per lease per bedroom</strong> is permitted to occupy the room. Any additional adult intending to reside at the property must submit their own separate application and be approved under their own lease.</div>
            <div style={{fontSize:12,fontWeight:600,color:"#3d3529",marginBottom:10}}>Do you agree to the one-adult-per-bedroom occupancy policy?</div>
            <div style={{display:"flex",gap:8}}>
              <button className={"yn-btn "+(d.occupancyAck===true?"yes":"")} onClick={()=>{upd("occupancyAck",true);setErrors(p=>({...p,occupancyAck:undefined}));}}>Yes, I agree</button>
              <button className={"yn-btn "+(d.occupancyAck===false?"no":"")} onClick={()=>{upd("occupancyAck",false);setErrors(p=>({...p,occupancyAck:"You must agree to the occupancy policy to continue"}));shake();}}>No</button>
            </div>
            {hasErr&&<div className="err-msg" style={{marginTop:8,animation:"shake .4s ease"}}>{errors.occupancyAck}</div>}
          </div>);
        })()}

        {/* ── ABOUT YOU ── */}
        <div className="fld-row">
          <div className="fld">
            <label>Gender<span className="req">*</span></label>
            <select value={d.gender} onChange={e=>upd("gender",e.target.value)} className={errors.gender?"err":""}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <div className="help">Used for housemate matching only — does not affect your application.</div>
            {errors.gender&&<div className="err-msg" style={{animation:"shake .4s ease"}}>Please select a gender option</div>}
          </div>
          <div className="fld">
            <label>What best describes you?<span className="req">*</span></label>
            <select value={d.occupationType} onChange={e=>{upd("occupationType",e.target.value);if(e.target.value!=="Other")upd("occupationTypeOther","");}} className={errors.occupationType?"err":""}>
              <option value="">Select...</option>
              <option value="Intern">Intern</option>
              <option value="Military">Military</option>
              <option value="Contractor">Contractor</option>
              <option value="Remote Worker">Remote Worker</option>
              <option value="Student">Student</option>
              <option value="Professional">Professional</option>
              <option value="Other">Other</option>
            </select>
            {d.occupationType==="Other"&&<input value={d.occupationTypeOther} onChange={e=>upd("occupationTypeOther",e.target.value)} className={errors.occupationTypeOther?"err":""} placeholder="Please describe..." style={{marginTop:8}}/>}
            {errors.occupationType&&<div className="err-msg" style={{animation:"shake .4s ease"}}>Please select what best describes you</div>}
            {errors.occupationTypeOther&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.occupationTypeOther}</div>}
          </div>
        </div>


        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ RENTAL HISTORY ═══ */}
      {step==="rental"&&<div className="sec">
        <div className="sec-num">Section 1</div>
        <div className="sec-hd"><h2>Rental History</h2><p>Tell us about where you've lived. Add your current and previous addresses.</p></div>

        {/* Added addresses */}
        {d.addresses.map((a,i)=><div key={i} className="item-card">
          <div className="item-hd"><div><div className="item-nm">{a.street}, {a.city}, {a.state} {a.zip}</div><div className="item-sub">{a.resType} · Since {a.monthIn} {a.yearIn}{a.rent?` · $${a.rent}/mo`:""}</div></div><div><button className="item-edit" onClick={()=>upd("curAddressForm",{...a,_editIdx:i})}>Edit</button><button className="item-del" onClick={()=>setD(p=>({...p,addresses:p.addresses.filter((_,j)=>j!==i)}))}>Remove</button></div></div>
          {(a.landlordFirstName||a.landlordName)&&<div style={{fontSize:10,color:"#999"}}>Landlord: {a.landlordFirstName&&a.landlordLastName?`${a.landlordFirstName} ${a.landlordLastName}`:a.landlordName||""}{a.landlordPhone?` · ${a.landlordPhone}`:""}{a.landlordEmail?` · ${a.landlordEmail}`:""}</div>}
        </div>)}

        {/* Add address form */}
        {d.curAddressForm?<div className="expand-form">
          <h3>{d.curAddressForm._editIdx!==undefined?"Edit Address":"Add Current Address"}</h3>
          <div className="fld"><label>Residence Type<span className="req">*</span></label>
            <div className="res-toggle">{["Rent","Own","Other"].map(t=><button key={t} className={`res-btn ${d.curAddressForm.resType===t?"on":""}`} onClick={()=>upd("curAddressForm",{...d.curAddressForm,resType:t})}>{t}</button>)}</div>
          </div>
          <div className="fld-row">
            <div className="fld"><label>Month Moved In<span className="req">*</span></label><select value={d.curAddressForm.monthIn} onChange={e=>upd("curAddressForm",{...d.curAddressForm,monthIn:e.target.value})}><option value="">Select...</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
            <div className="fld"><label>Year Moved In<span className="req">*</span></label><select value={d.curAddressForm.yearIn} onChange={e=>upd("curAddressForm",{...d.curAddressForm,yearIn:e.target.value})}><option value="">Select...</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
          </div>
          <div className="fld"><label>Street Address<span className="req">*</span></label><input value={d.curAddressForm.street} onChange={e=>upd("curAddressForm",{...d.curAddressForm,street:e.target.value})} placeholder="123 Main Street"/></div>
          <div className="fld-row">
            <div className="fld"><label>Unit</label><input value={d.curAddressForm.unit} onChange={e=>upd("curAddressForm",{...d.curAddressForm,unit:e.target.value})} placeholder="Apt, Suite, etc."/></div>
            <div className="fld"><label>City<span className="req">*</span></label><input value={d.curAddressForm.city} onChange={e=>upd("curAddressForm",{...d.curAddressForm,city:e.target.value})} placeholder="City"/></div>
          </div>
          <div className="fld-row3">
            <div className="fld"><label>State<span className="req">*</span></label><select value={d.curAddressForm.state} onChange={e=>upd("curAddressForm",{...d.curAddressForm,state:e.target.value})}>{STATES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            <div className="fld"><label>Zip Code<span className="req">*</span></label><input value={d.curAddressForm.zip} onChange={e=>upd("curAddressForm",{...d.curAddressForm,zip:e.target.value.replace(/\D/g,"").slice(0,5)})} placeholder="35801"/></div>
            <div className="fld"><label>Monthly Rent</label><input type="number" value={d.curAddressForm.rent} onChange={e=>upd("curAddressForm",{...d.curAddressForm,rent:e.target.value})} placeholder="1100"/></div>
          </div>
          <div className="fld"><label>Why are you moving?<span className="req">*</span></label><textarea value={d.curAddressForm.reason} onChange={e=>upd("curAddressForm",{...d.curAddressForm,reason:e.target.value})} className={!d.curAddressForm.reason&&d.curAddressForm._saved?"err":""} placeholder="e.g. Moving for work, end of lease, upgrading, etc."/></div>
          <div style={{fontSize:12,fontWeight:700,color:"var(--dk)",marginBottom:10,marginTop:16}}>Landlord Contact <span style={{color:"#c45c4a",fontWeight:400,fontSize:11}}>* All fields required</span></div>
          <div className="fld-row">
            <div className="fld"><label>First Name<span className="req">*</span></label><input value={d.curAddressForm.landlordFirstName||""} onChange={e=>{const v=e.target.value;const cap=v.charAt(0).toUpperCase()+v.slice(1);upd("curAddressForm",{...d.curAddressForm,landlordFirstName:cap});}} className={!d.curAddressForm.landlordFirstName&&d.curAddressForm._saved?"err":""} placeholder="First name"/></div>
            <div className="fld"><label>Last Name<span className="req">*</span></label><input value={d.curAddressForm.landlordLastName||""} onChange={e=>{const v=e.target.value;const cap=v.charAt(0).toUpperCase()+v.slice(1);upd("curAddressForm",{...d.curAddressForm,landlordLastName:cap});}} className={!d.curAddressForm.landlordLastName&&d.curAddressForm._saved?"err":""} placeholder="Last name"/></div>
          </div>
          <div className="fld-row">
            <div className="fld"><label>Email<span className="req">*</span></label><input type="email" value={d.curAddressForm.landlordEmail||""} onChange={e=>upd("curAddressForm",{...d.curAddressForm,landlordEmail:e.target.value,_badEmail:false})} className={((!d.curAddressForm.landlordEmail||d.curAddressForm._badEmail)&&d.curAddressForm._saved)?"err":""} placeholder="landlord@email.com"/>{d.curAddressForm._badEmail&&d.curAddressForm._saved&&<div className="err-msg">Please enter a valid email address</div>}</div>
            <div className="fld"><label>Phone<span className="req">*</span></label><input type="tel" value={d.curAddressForm.landlordPhone||""} onChange={e=>upd("curAddressForm",{...d.curAddressForm,landlordPhone:fmtPhone(e.target.value),_badPhone:false})} className={((!d.curAddressForm.landlordPhone||d.curAddressForm._badPhone)&&d.curAddressForm._saved)?"err":""} placeholder="(555) 555-5555"/>{d.curAddressForm._badPhone&&d.curAddressForm._saved&&<div className="err-msg">Please enter a valid 10-digit phone number</div>}</div>
          </div>
          {d.curAddressForm?._needMore&&<div style={{padding:"10px 12px",background:"rgba(212,168,83,.08)",border:"1px solid rgba(212,168,83,.3)",borderRadius:8,marginBottom:12,fontSize:12,color:"#7a5a10",fontWeight:600}}>📋 We need at least <strong>2 years</strong> of rental history — please add another address.</div>}
          <div style={{display:"flex",gap:8}}><button className="btn-next" style={{flex:1}} onClick={saveAddr}>Save Address</button><button className="btn-back" style={{flex:0,marginTop:0,padding:"12px 20px"}} onClick={()=>upd("curAddressForm",null)}>Cancel</button></div>
        </div>
        :<div className="add-card" onClick={()=>upd("curAddressForm",{...blankAddr})}><div className="plus">+</div><div className="lbl">Add {d.addresses.length===0?"Current":"Another"} Address</div></div>}
        {d.addresses.length>0&&(()=>{const months=calcMonthsCovered(d.addresses);const pct=Math.min(100,Math.round(months/24*100));const ok=months>=24;return(<div style={{marginBottom:10,padding:"8px 12px",borderRadius:8,background:ok?"rgba(74,124,89,.06)":"rgba(212,168,83,.06)",border:`1px solid ${ok?"rgba(74,124,89,.2)":"rgba(212,168,83,.25)"}`,fontSize:11,color:ok?"#2d6a3f":"#7a5a10",display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1}}>{ok?"✓ 2-year history requirement met":`${months} of 24 months covered — please add more addresses`}</div>
          <div style={{width:80,height:6,borderRadius:3,background:"rgba(0,0,0,.08)",overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:ok?"#4a7c59":"#d4a853",borderRadius:3,transition:"width .3s"}}/></div>
        </div>);})()}
        {errors.addresses&&<div className="err-msg" style={{marginBottom:12,fontSize:13,fontWeight:700,padding:"10px 12px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.2)",borderRadius:8,animation:"shake .4s ease"}}>⚠ {errors.addresses}</div>}

        {/* Eviction / Felony */}
        <div style={{marginTop:20}}><div className="yn-q">Have you ever been evicted?<span className="req" style={{color:"var(--rd)"}}>*</span></div>
          <div className="yn-row"><button className={`yn-btn ${d.evicted==="no"?"yes":""}`} onClick={()=>upd("evicted","no")}>No</button><button className={`yn-btn ${d.evicted==="yes"?"no":""}`} onClick={()=>upd("evicted","yes")}>Yes</button></div>
          {d.evicted==="yes"&&<div className="fld"><label>Please explain<span className="req">*</span></label><textarea value={d.evictedExplain} onChange={e=>upd("evictedExplain",e.target.value)} placeholder="Briefly explain the circumstances"/></div>}
          {errors.evicted&&<div className="err-msg" style={{animation:"shake .4s ease",marginBottom:12}}>{errors.evicted}</div>}
        </div>
        <div><div className="yn-q">Do you have any felonies?<span className="req" style={{color:"var(--rd)"}}>*</span></div>
          <div className="yn-row"><button className={`yn-btn ${d.felony==="no"?"yes":""}`} onClick={()=>upd("felony","no")}>No</button><button className={`yn-btn ${d.felony==="yes"?"no":""}`} onClick={()=>upd("felony","yes")}>Yes</button></div>
          {d.felony==="yes"&&<div className="fld"><label>Please explain<span className="req">*</span></label><textarea value={d.felonyExplain} onChange={e=>upd("felonyExplain",e.target.value)} placeholder="Briefly explain"/></div>}
          {errors.felony&&<div className="err-msg" style={{animation:"shake .4s ease",marginBottom:12}}>{errors.felony}</div>}
        </div>
        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ PERSONAL INFO ═══ */}
      {step==="personal"&&<div className="sec">
        <div className="sec-num">Section 2</div>
        <div className="sec-hd"><h2>Personal Information</h2><p>We need to verify your identity for the screening process.</p></div>
        <div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.15)",borderRadius:10,padding:12,marginBottom:16,fontSize:12,color:"#9a7422"}}>
          ⚠ Your application will be considered <strong>incomplete</strong> without all documents uploaded. You may upload them later, but your application may be delayed.
        </div>
        {fieldActive("idFile")&&(()=>{
          const front=d.appDocs.find(x=>x.type==="PhotoID-Front");
          const back=d.appDocs.find(x=>x.type==="PhotoID-Back");
          const DocZone=({doc,label,type,ref_})=>{
            const isPdf=doc?.name?.toLowerCase().endsWith(".pdf");
            return(<div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"#3d3529",marginBottom:6}}>{label}<span style={{color:"var(--rd)",marginLeft:2}}>*</span></div>
              {!d.idUploadLater&&(<>
                {doc?.uploading&&<div style={{padding:"16px",background:"rgba(212,168,83,.06)",border:"1px dashed rgba(212,168,83,.4)",borderRadius:10,textAlign:"center",fontSize:12,color:"#9a7422"}}>Uploading...</div>}
                {doc?.error&&<div style={{padding:"10px 12px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.2)",borderRadius:8,fontSize:11,color:"#c45c4a",marginBottom:8}}>{doc.error} <button style={{background:"none",border:"none",color:"#c45c4a",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:11,textDecoration:"underline"}} onClick={()=>ref_?.current?.click()}>Retry</button></div>}
                {!doc?.uploading&&!doc?.error&&doc?.url&&<div style={{position:"relative",marginBottom:8}}>
                  {isPdf
                    ?<div style={{padding:"12px 14px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:10,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:20}}>📄</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:600,color:"#1a1714",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.name}</div>
                        <a href={doc.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"var(--ac)",fontWeight:600}}>View PDF</a>
                      </div>
                    </div>
                    :<div style={{borderRadius:10,overflow:"hidden",border:"2px solid rgba(74,124,89,.3)",position:"relative"}}>
                      <img src={doc.url} alt={label} style={{width:"100%",maxHeight:160,objectFit:"cover",display:"block"}}/>
                      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.5)",padding:"4px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:9,color:"#fff",fontWeight:600}}>{doc.name}</span>
                        <span style={{fontSize:9,color:"rgba(74,124,89,.9)",fontWeight:700}}>Uploaded</span>
                      </div>
                    </div>}
                  <button style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"#c45c4a",border:"none",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",fontWeight:700,lineHeight:1}} onClick={()=>deleteDoc(doc)}>x</button>
                </div>}
                {!doc?.uploading&&!doc?.url&&<div className="upload" onClick={()=>ref_?.current?.click()} style={{marginBottom:6}}>
                  <div className="upload-ic">📷</div>
                  <div className="upload-txt">Tap to upload {label.toLowerCase()}</div>
                </div>}
                {doc?.url&&<button style={{fontSize:10,color:"#5c4a3a",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textDecoration:"underline",padding:0}} onClick={()=>ref_?.current?.click()}>Replace photo</button>}
                <input ref={ref_} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e=>{if(e.target.files[0])uploadDoc(e.target.files[0],type,label);}}/>
              </>)}
            </div>);
          };
          return(<div className="fld">
            <label>{fieldLabel("idFile","Photo ID")}{fieldRequired("idFile")&&<span className="req">*</span>}</label>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:12,lineHeight:1.5}}>We require both the <strong>front</strong> and <strong>back</strong> of your government-issued ID (driver's license, passport, or state ID).</div>
            {!d.idUploadLater&&<>
              <DocZone doc={front} label="Front of ID" type="PhotoID-Front" ref_={idFrontRef}/>
              <DocZone doc={back} label="Back of ID" type="PhotoID-Back" ref_={idBackRef}/>
            </>}
            <label style={{display:"flex",alignItems:"center",gap:8,marginTop:4,cursor:"pointer",fontSize:13,fontWeight:400,color:"#5c4a3a",textTransform:"none",letterSpacing:0}}>
              <input type="checkbox" checked={d.idUploadLater} onChange={e=>upd("idUploadLater",e.target.checked)} style={{width:16,height:16,cursor:"pointer"}}/>
              I'll upload my photo ID later (your application will be marked incomplete)
            </label>
            {errors.idFile&&<div className="err-msg" style={{animation:"shake .4s ease",marginTop:8}}>{errors.idFile}</div>}
          </div>);
        })()}
        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ EMPLOYMENT ═══ */}
      {step==="employment"&&<div className="sec">
        <div className="sec-num">Section 3</div>
        <div className="sec-hd"><h2>Employment & Income</h2><p>Show the landlord that you can afford this rental.</p></div>

        <button className={`unemployed-btn ${d.unemployed?"on":""}`} onClick={()=>upd("unemployed",!d.unemployed)}><span style={{fontSize:16}}>{d.unemployed?"☑":"☐"}</span> I'm currently unemployed</button>

        {!d.unemployed&&<>
          {d.employers.map((emp,i)=><div key={i} className="item-card">
            <div className="item-hd"><div><div className="item-nm">{emp.employer}</div><div className="item-sub">{emp.position||"—"} · Since {emp.monthStarted} {emp.yearStarted} · ${emp.monthlyIncome}/mo</div></div><div><button className="item-edit" onClick={()=>upd("curEmployerForm",{...emp,_editIdx:i})}>Edit</button><button className="item-del" onClick={()=>setD(p=>({...p,employers:p.employers.filter((_,j)=>j!==i)}))}>Remove</button></div></div>
          </div>)}

          {d.curEmployerForm?<div className="expand-form">
            <h3>{d.curEmployerForm._editIdx!==undefined?"Edit Employer":"Add Current Employer"}</h3>
            <div className="fld"><label>Employer<span className="req">*</span></label><input value={d.curEmployerForm.employer} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,employer:e.target.value})} placeholder="Company name"/></div>
            <div className="fld"><label>Position / Title / Occupation</label><input value={d.curEmployerForm.position} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,position:e.target.value})} placeholder="Your role"/></div>
            <div className="fld-row">
              <div className="fld"><label>Month Started</label><select value={d.curEmployerForm.monthStarted} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,monthStarted:e.target.value})}><option value="">Select...</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
              <div className="fld"><label>Year Started</label><select value={d.curEmployerForm.yearStarted} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,yearStarted:e.target.value})}><option value="">Select...</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
            </div>
            <div className="fld"><label>Monthly Income (Gross)<span className="req">*</span></label><input type="number" value={d.curEmployerForm.monthlyIncome} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,monthlyIncome:e.target.value})} placeholder="4200"/></div>
            <div style={{fontSize:12,fontWeight:700,color:"var(--dk)",marginBottom:10,marginTop:16}}>Employment Reference</div>
            <div className="fld-row"><div className="fld"><label>Full Name</label><input value={d.curEmployerForm.refName} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,refName:e.target.value})} placeholder="Supervisor name"/></div><div className="fld"><label>Phone Number</label><input type="tel" value={d.curEmployerForm.refPhone} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,refPhone:fmtPhone(e.target.value)})} placeholder="(555) 555-5555"/></div></div>
            <div style={{display:"flex",gap:8}}><button className="btn-next" style={{flex:1}} onClick={saveEmp}>Save Employer</button><button className="btn-back" style={{flex:0,marginTop:0,padding:"12px 20px"}} onClick={()=>upd("curEmployerForm",null)}>Cancel</button></div>
          </div>
          :<div className="add-card" onClick={()=>upd("curEmployerForm",{...blankEmp})}><div className="plus">+</div><div className="lbl">Add {d.employers.length===0?"Current":"Past"} Employer</div></div>}

          {d.employers.length>0&&<div className="strength-tip">💡 Landlords like to see around 5 years of employment history on your application, if applicable.</div>}
        </>}
        {errors.employers&&<div className="err-msg" style={{animation:"shake .4s ease",marginBottom:12}}>{errors.employers}</div>}

        {/* Unemployed — optional previous work history */}
        {d.unemployed&&<div style={{marginTop:12}}>
          <div style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>You may optionally provide previous work history to strengthen your application.</div>
          {d.employers.map((emp,i)=><div key={i} className="item-card">
            <div className="item-hd"><div><div className="item-nm">{emp.employer}</div><div className="item-sub">{emp.position||"—"} · Since {emp.monthStarted} {emp.yearStarted}</div></div><div><button className="item-edit" onClick={()=>upd("curEmployerForm",{...emp,_editIdx:i})}>Edit</button><button className="item-del" onClick={()=>setD(p=>({...p,employers:p.employers.filter((_,j)=>j!==i)}))}>Remove</button></div></div>
          </div>)}
          {d.curEmployerForm?<div className="expand-form">
            <h3>Previous Employer</h3>
            <div className="fld"><label>Employer</label><input value={d.curEmployerForm.employer} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,employer:e.target.value})} placeholder="Company name"/></div>
            <div className="fld"><label>Position / Title</label><input value={d.curEmployerForm.position} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,position:e.target.value})} placeholder="Your role"/></div>
            <div className="fld-row">
              <div className="fld"><label>Month Started</label><select value={d.curEmployerForm.monthStarted} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,monthStarted:e.target.value})}><option value="">Select...</option>{MONTHS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
              <div className="fld"><label>Year Started</label><select value={d.curEmployerForm.yearStarted} onChange={e=>upd("curEmployerForm",{...d.curEmployerForm,yearStarted:e.target.value})}><option value="">Select...</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
            </div>
            <div style={{display:"flex",gap:8}}><button className="btn-next" style={{flex:1}} onClick={saveEmp}>Save</button><button className="btn-back" style={{flex:0,marginTop:0,padding:"12px 20px"}} onClick={()=>upd("curEmployerForm",null)}>Cancel</button></div>
          </div>
          :<div className="add-card" onClick={()=>upd("curEmployerForm",{...blankEmp})}><div className="plus">+</div><div className="lbl">Add Previous Employer (optional)</div></div>}
        </div>}

        <div className="fld" style={{marginTop:12}}>
          <label>Proof of Income</label>
          {!d.incomeUploadLater&&<>
            {d.appDocs.filter(x=>x.type==="PayStub").map((doc,i)=>{
              const isPdf=doc?.name?.toLowerCase().endsWith(".pdf");
              return(<div key={doc.id} style={{marginBottom:8,padding:"10px 12px",background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.15)",borderRadius:10,display:"flex",alignItems:"center",gap:10,position:"relative"}}>
                {doc.uploading&&<><span style={{fontSize:14}}>⏳</span><span style={{fontSize:11,color:"#9a7422"}}>Uploading...</span></>}
                {doc.error&&<><span style={{fontSize:14}}>❌</span><span style={{fontSize:11,color:"#c45c4a"}}>{doc.error}</span></>}
                {!doc.uploading&&!doc.error&&<>
                  <span style={{fontSize:16}}>{isPdf?"📄":"🖼"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.name}</div>
                    {doc.url&&<a href={doc.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"var(--ac)",fontWeight:600}}>View</a>}
                  </div>
                </>}
                <button style={{background:"none",border:"none",color:"#c45c4a",fontSize:16,cursor:"pointer",fontFamily:"inherit",padding:"0 4px",lineHeight:1}} onClick={()=>deleteDoc(doc)}>x</button>
              </div>);
            })}
            <div className="upload" onClick={()=>payRef.current?.click()}>
              <div className="upload-ic">📄</div>
              <div className="upload-txt">{d.appDocs.filter(x=>x.type==="PayStub").length===0?"Tap to upload pay stubs, offer letter, or bank statements":"+ Add another pay stub or document"}</div>
            </div>
            <input ref={payRef} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e=>{if(e.target.files[0])uploadDoc(e.target.files[0],"PayStub","Pay Stub");}}/>
            <div style={{fontSize:10,color:"#6b5e52",marginTop:6}}>Last 2 pay stubs preferred. You can add multiple files.</div>
          </>}
          <label style={{display:"flex",alignItems:"center",gap:8,marginTop:10,cursor:"pointer",fontSize:13,fontWeight:400,color:"#5c4a3a",textTransform:"none",letterSpacing:0}}>
            <input type="checkbox" checked={d.incomeUploadLater} onChange={e=>upd("incomeUploadLater",e.target.checked)} style={{width:16,height:16,cursor:"pointer"}}/>
            I'll upload proof of income later
          </label>
        </div>

        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ REFERENCES ═══ */}
      {step==="references"&&<div className="sec">
        <div className="sec-num">Section 4</div>
        <div className="sec-hd"><h2>References</h2><p>Provide {d.unemployed?"a personal reference":"one employer and one personal reference"}.</p></div>
        {!d.unemployed&&<>
          <div style={{fontSize:11,fontWeight:700,color:"var(--ac)",textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Employer Reference</div>
          <div className="fld"><label>Full Name<span className="req">*</span></label><input value={d.empRefName} onChange={e=>upd("empRefName",e.target.value)} className={errors.empRefName?"err":""} placeholder="Supervisor or HR"/>{errors.empRefName&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.empRefName}</div>}</div>
          <div className="fld-row"><div className="fld"><label>Phone<span className="req">*</span></label><input type="tel" value={d.empRefPhone} onChange={e=>upd("empRefPhone",fmtPhone(e.target.value))} className={errors.empRefPhone?"err":""} placeholder="(555) 555-5555"/>{errors.empRefPhone&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.empRefPhone}</div>}</div><div className="fld"><label>Relationship</label><input value={d.empRefRelation} onChange={e=>upd("empRefRelation",e.target.value)} placeholder="e.g. Manager"/></div></div>
          <div style={{fontSize:11,fontWeight:700,color:"var(--ac)",textTransform:"uppercase",letterSpacing:.5,marginBottom:10,marginTop:20}}>Personal Reference</div>
        </>}
        {d.unemployed&&<div style={{fontSize:11,fontWeight:700,color:"var(--ac)",textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Personal Reference</div>}
        <div className="fld"><label>Full Name<span className="req">*</span></label><input value={d.persRefName} onChange={e=>upd("persRefName",e.target.value)} className={errors.persRefName?"err":""} placeholder="Someone who knows you well"/>{errors.persRefName&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.persRefName}</div>}</div>
        <div className="fld-row"><div className="fld"><label>Phone<span className="req">*</span></label><input type="tel" value={d.persRefPhone} onChange={e=>upd("persRefPhone",fmtPhone(e.target.value))} className={errors.persRefPhone?"err":""} placeholder="(555) 555-5555"/>{errors.persRefPhone&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.persRefPhone}</div>}</div><div className="fld"><label>Relationship</label><input value={d.persRefRelation} onChange={e=>upd("persRefRelation",e.target.value)} placeholder="e.g. Friend"/></div></div>
        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ EMERGENCY ═══ */}
      {step==="emergency"&&<div className="sec">
        <div className="sec-num">Section 5</div>
        <div className="sec-hd"><h2>Emergency Contact</h2><p>Someone we can reach in case of an emergency.</p></div>
        {fieldActive("emergName")&&<div className="fld"><label>{fieldLabel("emergName","Full Name")}{fieldRequired("emergName")&&<span className="req">*</span>}</label><input value={d.emergName} onChange={e=>upd("emergName",e.target.value)} className={errors.emergName?"err":""} placeholder={fieldPlaceholder("emergName","Full name")}/>{errors.emergName&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.emergName}</div>}</div>}
        <div className="fld-row">
          {fieldActive("emergPhone")&&<div className="fld"><label>{fieldLabel("emergPhone","Phone")}{fieldRequired("emergPhone")&&<span className="req">*</span>}</label><input type="tel" value={d.emergPhone} onChange={e=>upd("emergPhone",fmtPhone(e.target.value))} className={errors.emergPhone?"err":""} placeholder={fieldPlaceholder("emergPhone","(555) 555-5555")}/>{errors.emergPhone&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.emergPhone}</div>}</div>}
          {fieldActive("emergRelation")&&<div className="fld"><label>{fieldLabel("emergRelation","Relationship")}{fieldRequired("emergRelation")&&<span className="req">*</span>}</label><input value={d.emergRelation} onChange={e=>upd("emergRelation",e.target.value)} className={errors.emergRelation?"err":""} placeholder={fieldPlaceholder("emergRelation","e.g. Parent")}/>{errors.emergRelation&&<div className="err-msg" style={{animation:"shake .4s ease"}}>{errors.emergRelation}</div>}</div>}
        </div>
        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ ROOM ═══ */}
      {step==="room"&&<div className="sec">
        <div className="sec-num">Section 6</div>
        <div className="sec-hd"><h2>Choose Your Room</h2><p>Select the room you'd like to apply for.</p></div>
        {(()=>{const prop=invite?.inviteProp?props_.find(p=>p.id===invite.inviteProp):null;return(prop?[prop]:props_).map(p=>{
            const units=p.units&&p.units.length>0?p.units:[{id:"main",name:"Unit A",label:"A",rooms:p.rooms||[]}];
            const hasMultipleUnits=units.length>1;
            return(<div key={p.id} className="prop-card"><div className="prop-img">🐻</div><div className="prop-info">
              <div className="prop-name">{p.name}</div><div className="prop-addr">{p.address}</div>
              <div style={{marginTop:10}}>
                {units.map(u=>{const vacantRooms=(u.rooms||[]).filter(r=>r.st==="vacant");if(!vacantRooms.length)return null;return(
                  <div key={u.id}>
                    {hasMultipleUnits&&<div style={{fontSize:10,fontWeight:800,color:"var(--ac)",textTransform:"uppercase",letterSpacing:.5,marginBottom:4,marginTop:8}}>Unit {u.label||u.name}</div>}
                    {vacantRooms.map(r=><div key={r.id} className={`room-card ${d.selectedRoom===r.id?"sel":""}`} onClick={()=>upd("selectedRoom",r.id)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div className="room-name">{r.name}</div>
                          <div className="room-meta">{r.pb?"Private":"Shared"} bath{r.sqft?" · "+r.sqft+" sqft":""}</div>
                        </div>
                        <div className="room-price">${r.rent}<small style={{fontSize:10,color:"#999"}}>/mo</small></div>
                      </div>
                    </div>)}
                  </div>
                );})}
              </div>
            </div></div>);
          });})()}
        {errors.selectedRoom&&<div className="err-msg" style={{animation:"shake .4s ease",marginBottom:12}}>{errors.selectedRoom}</div>}

        {/* ── DOOR CODE — shown in room step for all rental types ── */}
        {fieldActive("doorCode")&&<div style={{marginTop:20,marginBottom:20,background:"rgba(212,168,83,.05)",border:`1px solid ${errors.doorCode?"#c45c4a":"rgba(212,168,83,.15)"}`,borderRadius:12,padding:20,animation:errors.doorCode?"shake .4s ease":"none"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1a1714",marginBottom:4}}>{fieldLabel("doorCode","Choose Your 4-Digit Door Code")}{fieldRequired("doorCode")&&<span style={{color:"#c45c4a",marginLeft:2}}>*</span>}</div>
          <div style={{fontSize:12,color:"#999",marginBottom:16,lineHeight:1.5}}>{fieldHelp("doorCode","This code will be programmed into your smart lock. It activates at 12:00am on your move-in day once payment is received.")}</div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <input type="text" inputMode="numeric" maxLength={4} value={d.doorCode}
              onChange={e=>{const val=e.target.value.replace(/\D/g,"").slice(0,4);upd("doorCode",val);if(/^\d{4}$/.test(val))setErrors(p=>({...p,doorCode:undefined}));}}
              placeholder="_ _ _ _"
              style={{width:130,textAlign:"center",fontSize:22,fontWeight:900,letterSpacing:10,fontFamily:"monospace",border:`2px solid ${errors.doorCode?"#c45c4a":/^\d{4}$/.test(d.doorCode)?"rgba(74,124,89,.5)":"rgba(212,168,83,.4)"}`,borderRadius:10,padding:"10px 8px",outline:"none",background:"#fff",color:"#1a1714"}}
            />
            {/^\d{4}$/.test(d.doorCode)&&<div style={{fontSize:11,color:"#4a7c59",fontWeight:600}}>✓ Code set</div>}
            {errors.doorCode&&<div className="err-msg" style={{textAlign:"center",animation:"shake .4s ease"}}>{errors.doorCode}</div>}
          </div>
        </div>}

        <button className="btn-next" onClick={next}>Continue →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ REVIEW ═══ */}
      {step==="review"&&<div className="sec">
        <div className="sec-num">Almost Done!</div>
        <div className="sec-hd"><h2>Review Your Application</h2><p>Verify everything is correct before submitting.</p></div>
        <div className="rev-sec"><h3>👤 About You <span className="rev-edit" onClick={()=>setStep("welcome")}>Edit</span></h3>
          <div className="rev-row"><span className="rev-label">Name</span><span className="rev-val">{d.firstName} {d.lastName}</span></div>
          <div className="rev-row"><span className="rev-label">Email</span><span className="rev-val">{d.email}</span></div>
          <div className="rev-row"><span className="rev-label">Phone</span><span className="rev-val">{d.phone}</span></div>
          <div className="rev-row"><span className="rev-label">DOB</span><span className="rev-val">{d.dob}</span></div>
          <div className="rev-row"><span className="rev-label">Move-in</span><span className="rev-val">{d.moveIn||"—"}</span></div>
          {invite?.allowCouples&&d.partnerName.trim()&&<div className="rev-row"><span className="rev-label">Partner</span><span className="rev-val">{d.partnerName}{d.partnerEmail?" · "+d.partnerEmail:""}</span></div>}
          {d.appDocs.filter(x=>x.url).length>0&&<div className="rev-row"><span className="rev-label">Documents</span><span className="rev-val" style={{color:"#2d6a3f"}}>&#10003; {d.appDocs.filter(x=>x.url).length} file{d.appDocs.filter(x=>x.url).length!==1?"s":""} uploaded</span></div>}
          {d.idUploadLater&&<div className="rev-row"><span className="rev-label">Photo ID</span><span className="rev-val" style={{color:"#9a7422"}}>Will upload later</span></div>}
          {d.incomeUploadLater&&<div className="rev-row"><span className="rev-label">Pay Stubs</span><span className="rev-val" style={{color:"#9a7422"}}>Will upload later</span></div>}
        </div>
        {appType==="tenant"&&<>
          <div className="rev-sec"><h3>🏠 Rental History <span className="rev-edit" onClick={()=>setStep("rental")}>Edit</span></h3>
            {d.addresses.map((a,i)=><div key={i} className="rev-row"><span className="rev-label">{a.resType}</span><span className="rev-val">{a.street}, {a.city} {a.state}</span></div>)}
            <div className="rev-row"><span className="rev-label">Evicted</span><span className="rev-val" style={{color:d.evicted==="yes"?"var(--rd)":"var(--gn)"}}>{d.evicted==="yes"?"Yes":"No"}</span></div>
            <div className="rev-row"><span className="rev-label">Felonies</span><span className="rev-val" style={{color:d.felony==="yes"?"var(--rd)":"var(--gn)"}}>{d.felony==="yes"?"Yes":"No"}</span></div>
          </div>
        </>}
        <div className="rev-sec"><h3>💼 Employment <span className="rev-edit" onClick={()=>setStep("employment")}>Edit</span></h3>
          {d.unemployed?<div className="rev-row"><span className="rev-label">Status</span><span className="rev-val">Unemployed</span></div>
          :d.employers.map((e,i)=><div key={i}><div className="rev-row"><span className="rev-label">{e.employer}</span><span className="rev-val">{e.position||"—"} · ${e.monthlyIncome}/mo</span></div></div>)}
        </div>
        {appType==="tenant"&&<>
          <div className="rev-sec"><h3>📋 References <span className="rev-edit" onClick={()=>setStep("references")}>Edit</span></h3>
            <div className="rev-row"><span className="rev-label">Employer</span><span className="rev-val">{d.empRefName} · {d.empRefPhone}</span></div>
            <div className="rev-row"><span className="rev-label">Personal</span><span className="rev-val">{d.persRefName} · {d.persRefPhone}</span></div>
          </div>
          <div className="rev-sec"><h3>🚨 Emergency <span className="rev-edit" onClick={()=>setStep("emergency")}>Edit</span></h3>
            <div className="rev-row"><span className="rev-label">Contact</span><span className="rev-val">{d.emergName} · {d.emergPhone} · {d.emergRelation}</span></div>
          </div>
        </>}
        {invite?.inviteRoomName&&<div className="rev-sec"><h3>🏠 Room</h3>
          <div className="rev-row"><span className="rev-label">Property</span><span className="rev-val">{invite.invitePropName}</span></div>
          <div className="rev-row"><span className="rev-label">Room</span><span className="rev-val">{invite.inviteRoomName}</span></div>
          <div className="rev-row"><span className="rev-label">Rent</span><span className="rev-val" style={{color:"var(--ac)"}}>${invite.inviteRent}/mo</span></div>
          {d.doorCode&&<div className="rev-row"><span className="rev-label">Door Code</span><span className="rev-val" style={{fontFamily:"monospace",fontWeight:900,letterSpacing:4}}>{d.doorCode}</span></div>}
        </div>}
        {/* Lease Terms Preview */}
        {(()=>{
          const roomName=invite?.inviteRoomName||(d.selectedRoom&&props_.flatMap(p=>allRooms(p)).find(r=>r.id===d.selectedRoom)?.name)||null;
          const propName=invite?.invitePropName||(d.selectedRoom&&props_.find(p=>allRooms(p).some(r=>r.id===d.selectedRoom))?.name)||d.preferredProperty||null;
          const rent=invite?.inviteRent||(d.selectedRoom&&props_.flatMap(p=>allRooms(p)).find(r=>r.id===d.selectedRoom)?.rent)||null;
          const moveIn=d.moveIn;
          if(!rent||!moveIn)return null;
          const moveInD=new Date(moveIn+"T00:00:00");
          const day=moveInD.getDate();
          const calDays=new Date(moveInD.getFullYear(),moveInD.getMonth()+1,0).getDate();
          const daysLeft=calDays-day+1;
          const dailyRate=Math.ceil(rent/30);
          const proratedAmt=Math.ceil(dailyRate*daysLeft);
          const isFirstDay=day===1;
          const firstMonthAmt=isFirstDay?rent:proratedAmt;
          const sd=rent;
          const total=sd+firstMonthAmt;
          const fmtS=n=>"$"+n.toLocaleString();
          return(<div className="rev-sec" style={{borderTop:"2px solid rgba(212,168,83,.2)",paddingTop:16,marginTop:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <h3 style={{flex:1}}>💼 Estimated Lease Terms</h3>
            </div>
            <div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.15)",borderRadius:8,padding:10,marginBottom:12,fontSize:11,color:"#9a7422",lineHeight:1.5}}>
              ⚠ This is an <strong>estimate only</strong> — not a lease. No room is reserved and no charges apply until you are approved and sign your lease.
            </div>
            {propName&&<div className="rev-row"><span className="rev-label">Property</span><span className="rev-val">{propName}</span></div>}
            {roomName&&<div className="rev-row"><span className="rev-label">Room</span><span className="rev-val">{roomName}</span></div>}
            <div className="rev-row"><span className="rev-label">Monthly Rent</span><span className="rev-val" style={{color:"var(--ac)",fontWeight:700}}>{fmtS(rent)}/mo</span></div>
            <div className="rev-row"><span className="rev-label">Security Deposit</span><span className="rev-val">{fmtS(sd)}</span></div>
            <div className="rev-row"><span className="rev-label">Move-in Date</span><span className="rev-val">{moveIn}</span></div>
            {!isFirstDay&&<div className="rev-row"><span className="rev-label">Proration</span><span className="rev-val" style={{fontSize:11}}>{daysLeft} days × {fmtS(dailyRate)}/day = {fmtS(proratedAmt)}</span></div>}
            <div style={{marginTop:12,background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.12)",borderRadius:8,padding:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"#4a7c59",marginBottom:8}}>📄 Estimated Move-In Package</div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:12}}>
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Security Deposit</span><strong>{fmtS(sd)}</strong>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:12}}>
                <span>🏠 {isFirstDay?`First Month's Rent`:`Prorated Rent (${daysLeft} days)`}</span><strong>{fmtS(firstMonthAmt)}</strong>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0",fontSize:13,fontWeight:800,borderTop:"2px solid rgba(74,124,89,.15)",marginTop:4}}>
                <span>Estimated Total at Move-In</span><span style={{color:"#4a7c59"}}>{fmtS(total)}</span>
              </div>
            </div>
          </div>);
        })()}

        <button className="btn-next" onClick={next}>Continue to Background Check Payment →</button>
        <button className="btn-back" onClick={back}>← Back</button>
      </div>}

      {/* ═══ PAYMENT ═══ */}
      {step==="payment"&&<div className="sec">
        <div className="sec-num">Final Step</div>
        <div className="sec-hd"><h2>Screening Fee</h2><p>Covers your background check, credit report, and application processing. Non-refundable.</p></div>
        <div className="fee-card"><h3>💳 Fee Breakdown</h3>
          <div className="fee-row"><span>Background Check & Credit Report</span><span>${(invite?.screenPkg==="credit-only"||invite?.screenPkg==="bg-only")?29:49}</span></div>
          <div className="fee-row"><span>Application Processing</span><span>$10</span></div>
          <div className="fee-total"><span>Total Due Now</span><span>${baseFee}</span></div>
        </div>
        <div style={{background:"rgba(74,124,89,.06)",borderRadius:10,padding:12,marginBottom:20,fontSize:11,color:"var(--gn)"}}><strong><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Secure Payment</strong> — Processed securely through Stripe. Card info never stored on our servers.</div>
        <div style={{border:"2px dashed rgba(0,0,0,.1)",borderRadius:12,padding:24,textAlign:"center",marginBottom:20,background:"rgba(0,0,0,.01)"}}><div style={{fontSize:24,marginBottom:8}}>💳</div><div style={{fontSize:13,fontWeight:600,color:"#999"}}>Stripe Payment Form</div><div style={{fontSize:10,color:"#ccc",marginTop:4}}>Card details will appear here</div></div>
        <button className="btn-start" onClick={async()=>{
          setSubmitted(true);
          const now=new Date().toISOString().split("T")[0];
          const fullName=`${d.firstName} ${d.lastName}`.trim();

          if(invite){
            // Invited applicant — update existing record
            const apps=await loadKey("hq-apps",[]);
            // Resolve room from selectedRoom ID if tenant picked one
            const allProps2=await loadKey("hq-props",[]);
            const pickedRoom2=d.selectedRoom?allProps2.flatMap(p=>(p.units||[]).flatMap(u=>(u.rooms||[]).map(r=>({...r,propName:p.name,propId:p.id,unitId:u.id,unitName:u.name,unitLabel:u.label})))).find(r=>r.id===d.selectedRoom):null;
            // If tenant had a locked/pre-assigned room, resolve termRoomId from the room name
            const invitedApp=apps.find(a=>a.id===invite.id);
            // Prefer termRoomId (ID-based, set at invite time) over name-based fallback
            const lockedRoomObj=!pickedRoom2&&invitedApp?.termRoomId
              ?allProps2.flatMap(p=>(p.units||[]).flatMap(u=>(u.rooms||[]).map(r=>({...r,propName:p.name,propId:p.id,unitId:u.id,unitName:u.name,unitLabel:u.label})))).find(r=>r.id===invitedApp.termRoomId)
              :(!pickedRoom2&&(invitedApp?.room||"")
                ?allProps2.flatMap(p=>(p.units||[]).flatMap(u=>(u.rooms||[]).map(r=>({...r,propName:p.name,propId:p.id,unitId:u.id,unitName:u.name,unitLabel:u.label})))).find(r=>r.name===(invitedApp?.room||""))
                :null);
            const resolvedRoomData=pickedRoom2||lockedRoomObj;
            const updated=apps.map(a=>a.id===invite.id?{...a,
              status:"applied",lastContact:now,
              minorChildren:d.minorChildren||0,
              applicationData:d,
              passcode:d.doorCode||null,
              name:fullName,email:d.email,phone:d.phone,
              dob:d.dob||null,gender:d.gender||"",occupationType:d.occupationType||"",
              termMoveIn:d.moveIn||a.moveIn||"",
              // Always ensure termRoomId, termRent, termSD are set from resolved room
              ...(resolvedRoomData?{
                room:resolvedRoomData.name,
                property:resolvedRoomData.propName,
                termRoomId:resolvedRoomData.id,
                termPropId:resolvedRoomData.propId,
                termUnitId:resolvedRoomData.unitId||null,
                termUnitName:resolvedRoomData.unitName||"",
                termRent:resolvedRoomData.rent,
                termSD:resolvedRoomData.rent,
                isWholeUnit:resolvedRoomData.isWholeUnit||invitedApp?.isWholeUnit||false,
              }:{
                // Fall back to inviteRent if no room object found
                termRent:invitedApp?.inviteRent||invitedApp?.termRent||undefined,
                termSD:invitedApp?.inviteRent||invitedApp?.termSD||undefined,
              }),
              history:[...(a.history||[]),{from:"invited",to:"applied",date:now,note:`Application submitted + $${baseFee} paid`}]
            }:a);
            await saveKey("hq-apps",updated);
          } else {
            // Walk-in / no invite — create new applicant record
            const apps=await loadKey("hq-apps",[]);
            // Resolve room name + IDs from selectedRoom (which stores room ID)
            const allProps=await loadKey("hq-props",[]);
            const pickedRoomObj=d.selectedRoom?allProps.flatMap(p=>(p.units||[]).flatMap(u=>(u.rooms||[]).map(r=>({...r,propName:p.name,propId:p.id,unitId:u.id,unitName:u.name,unitLabel:u.label})))).find(r=>r.id===d.selectedRoom):null;
            const roomName=pickedRoomObj?.name||"";
            const roomId=pickedRoomObj?.id||null;
            const propId=pickedRoomObj?.propId||null;
            const unitId=pickedRoomObj?.unitId||null;
            const unitName=pickedRoomObj?.unitName||"";
            const propName=pickedRoomObj?.propName||d.preferredProperty||"";
            const newApp={
              id:Math.random().toString(36).slice(2),
              name:fullName,email:d.email,phone:d.phone,
              property:propName,room:roomName,
              termRoomId:roomId,termPropId:propId,
              termUnitId:unitId,termUnitName:unitName,
              termRent:pickedRoomObj?.rent||undefined,
              termSD:pickedRoomObj?.rent||undefined,
              moveIn:d.moveIn||"",termMoveIn:d.moveIn||"",
              income:d.income||"",dob:d.dob||null,gender:d.gender||"",occupationType:d.occupationType||"",
              passcode:d.doorCode||null,
              status:"applied",submitted:now,lastContact:now,
              bgCheck:"not-started",creditScore:"—",refs:"not-started",
              partner:d.partnerName.trim()?{name:d.partnerName.trim(),email:d.partnerEmail.trim()}:null,
              source:"Online Application",applicationData:d,
              appDocs:d.appDocs,
              docsFlag:{idUploadLater:d.idUploadLater,incomeUploadLater:d.incomeUploadLater},
              screenPkg:"credit-bg",appFee:baseFee,
              history:[{from:"new",to:"applied",date:now,note:"Walk-in application via apply page"}]
            };
            await saveKey("hq-apps",[...apps,newApp]);
          }

          // Admin notification in hq-notifs
          const notifs=await loadKey("hq-notifs",[]);
          await saveKey("hq-notifs",[{
            id:Math.random().toString(36).slice(2),type:"app",
            msg:`🎉 ${fullName} submitted their application${invite?.invitePropName?" for "+invite.invitePropName:""}`,
            date:now,read:false,urgent:true
          },...notifs]);

          // Co-applicant auto-invites (whole-unit only)
          if(d.coApplicants&&d.coApplicants.length>0){
            const propName=invite?.property||d.preferredProperty||"";
            for(const ca of d.coApplicants){
              if(ca.email&&ca.email.includes("@")){
                try{
                  const coAppId=Math.random().toString(36).slice(2);
                  const coAppRecord={
                    id:coAppId,name:ca.name||ca.email.split("@")[0],email:ca.email,phone:"",
                    property:propName,room:"",moveIn:d.moveIn||"",income:"",
                    status:"invited",submitted:now,lastContact:now,
                    bgCheck:"not-started",creditScore:"—",refs:"not-started",
                    source:"Co-applicant invite",
                    inviteLink:(window.location.origin)+"/apply?invite="+coAppId,
                    inviteRoomMode:"none",
                    coApplicantOf:fullName,
                    history:[{from:"new",to:"invited",date:now,note:"Auto-invited as co-applicant of "+fullName}]
                  };
                  const curApps=await loadKey("hq-apps",[]);
                  await saveKey("hq-apps",[...curApps,coAppRecord]);
                  await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
                    to:ca.email,
                    subject:"You're invited to apply — "+propName,
                    html:`<p>Hi${ca.name?" "+ca.name:""},</p><p>${fullName} listed you as a co-applicant for <strong>${propName||"a rental property"}</strong>.</p><p>Please complete your own application here:</p><p><a href="${coAppRecord.inviteLink}" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 24px;border-radius:8px;font-weight:700;text-decoration:none;">Start My Application →</a></p><p>Questions? Reply to this email.</p>`
                  })});
                }catch(e){console.error("Co-applicant invite failed",e);}
              }
            }
          }

          // Admin notification email
          try{await fetch("/api/apply-notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
            to:"info@rentblackbear.com",
            applicantName:fullName,
            applicantEmail:d.email,
            applicantPhone:d.phone,
            property:invite?.invitePropName||d.preferredProperty||"Not specified",
            room:invite?.inviteRoomName||"Not specified",
            moveIn:d.moveIn||"Flexible",
            income:d.income||"Not provided",
            fee:baseFee,
            isInvited:!!invite,
            doorCode:d.doorCode||null,
          })});}catch(e){console.error("PM notify failed",e);}

          // Tenant confirmation email
          try{await fetch("/api/apply-confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
            name:fullName,email:d.email,
            property:invite?.invitePropName||"",
            room:invite?.inviteRoomName||"",
            rent:invite?.inviteRent||null,
            fee:baseFee,
          })});}catch{}
        }}>Pay ${baseFee} & Submit Application</button>
        <div className="legal">By submitting, you authorize Black Bear Rentals and RentPrep to conduct a background check and credit inquiry. This will not impact your credit score. Fee is non-refundable.</div>
        <button className="btn-back" onClick={back}>← Back to Review</button>
      </div>}
    </div>
    {step!=="done"&&<div className="app-footer">© {new Date().getFullYear()} Black Bear Rentals — Oak & Main Development LLC · <a href="https://rentblackbear.com">rentblackbear.com</a></div>}
  </div></>);
}
