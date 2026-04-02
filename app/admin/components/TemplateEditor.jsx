"use client";
import { useState, useRef, useEffect } from "react";

// ── Supabase ─────────────────────────────────────────────────────────
const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa=(path,opts={})=>fetch(SUPA_URL+"/rest/v1/"+path,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});
const uid=()=>Math.random().toString(36).slice(2,9);

// ── Dummy preview data ───────────────────────────────────────────────
const PREVIEW_DATA={
  TENANT_NAME:"John Doe",MONTHLY_RENT:"850",RENT_WORDS:"EIGHT HUNDRED FIFTY",
  DAILY_RATE:"29",PRORATED_RENT:"435",SECURITY_DEPOSIT:"850",
  LEASE_START:"5/1/2026",LEASE_END:"4/30/2027",MOVE_IN_DATE:"5/1/2026",
  PROPERTY_ADDRESS:"2909 Wilson Dr NW, Huntsville AL 35816",ROOM_NAME:"Bedroom 2",
  DOOR_CODE:"4821",
  UTILITIES_CLAUSE:"PROPERTY MANAGER agrees to pay the first $100.00 of combined utilities per month. Any overage is split equally among all residents.",
  LANDLORD_NAME:"Carolina Cooper",PARKING_SPACE:"Space A1, right side of driveway",
};

// ── Variable library ─────────────────────────────────────────────────
const VARIABLES=[
  {key:"TENANT_NAME",label:"Tenant Name"},
  {key:"MONTHLY_RENT",label:"Monthly Rent"},
  {key:"RENT_WORDS",label:"Rent in Words"},
  {key:"SECURITY_DEPOSIT",label:"Security Deposit"},
  {key:"LEASE_START",label:"Lease Start Date"},
  {key:"LEASE_END",label:"Lease End Date"},
  {key:"MOVE_IN_DATE",label:"Move-In Date"},
  {key:"PROPERTY_ADDRESS",label:"Property Address"},
  {key:"ROOM_NAME",label:"Room / Unit"},
  {key:"DOOR_CODE",label:"Door Code"},
  {key:"UTILITIES_CLAUSE",label:"Utilities Clause"},
  {key:"LANDLORD_NAME",label:"Landlord Name"},
  {key:"PARKING_SPACE",label:"Parking Space"},
  {key:"DAILY_RATE",label:"Daily Rate"},
  {key:"PRORATED_RENT",label:"Prorated Rent"},
];

// ── Section plain-English descriptions ──────────────────────────────
const SEC_DESC={
  s1:"Sets the monthly rent amount, payment due date (1st of each month), and how long the lease lasts. This is the financial core of the agreement.",
  s2:"Explains how rent is collected and confirms receipt of the first month's rent and security deposit. Also establishes who the tenant pays.",
  s3:"Describes how the security deposit is held, what it can be used for (unpaid rent, damages beyond normal wear), and the 35-day return window after move-out.",
  s4:"The late fee policy — $50 after the 3rd, $5/day after that. Dishonored checks are treated as unpaid rent with a $35 NSF fee.",
  s5:"Clearly states which utilities the landlord covers and which the tenant pays. This clause auto-fills from the utility template selected during lease creation.",
  s6:"Limits how long guests can stay (4 days per 30-day period) without written approval. Protects against unofficial roommates and unauthorized occupants.",
  s7:"No pets of any kind without prior written consent. Violations result in a $300 fine plus $10/day, and potential eviction.",
  s8:"Assigns the tenant a specific parking space and sets rules: one vehicle, no repairs or washing on-site, violators towed at owner's expense.",
  s9:"Quiet hours are 10pm-7am weekdays and 11pm-10am weekends. Applies to all residents and guests.",
  s10:"No smoking of any kind anywhere on the property. Applies to residents, guests, and visitors.",
  s11:"Tenant is responsible for replacing batteries in door locks, smoke detectors, and TV remotes. Failure to replace door lock batteries may result in a $50 service fee.",
  s12:"Tenant acknowledges the unit is clean and in good condition at move-in. Any damage caused by the tenant is their financial responsibility.",
  s13:"You have the right to enter the unit with 24 hours written notice for inspections or repairs. Emergency entry is permitted without notice.",
  s14:"Either party can end the lease with 30 days written notice. After the lease term ends, it automatically converts to month-to-month with a $50 rent increase.",
  s15:"Discloses that this is a room rental, not the whole unit. Tenant acknowledges shared common areas and that other residents may change during the tenancy.",
  s16:"House rules enforceable under the lease: no shoes indoors, no pets, no smoking, clean common areas, quiet hours, trash duty.",
  s17:"Landlord insurance does not cover the tenant's personal belongings. Strongly recommends the tenant get renter's insurance.",
  s18:"This document is the complete agreement. No verbal promises apply. All changes must be in writing. Governed by Alabama law.",
};

// ── Fill variables for preview ───────────────────────────────────────
const fillVars=(html,data)=>{
  if(!html)return"";
  let out=html;
  Object.entries(data).forEach(([k,v])=>{
    out=out.replaceAll("{{"+k+"}}",`<mark style="background:#fef9c3;border-radius:3px;padding:0 2px">${v}</mark>`);
  });
  out=out.replace(/\{\{([A-Z_]+)\}\}/g,'<mark style="background:#fee2e2;color:#c45c4a;border-radius:3px;padding:0 2px;font-weight:700">{{$1}} — not filled</mark>');
  return out;
};

// ── Rich text editor ─────────────────────────────────────────────────
function RichEditor({value,onChange,insertRef}){
  const editorRef=useRef(null);
  const lastSel=useRef(null);

  useEffect(()=>{
    if(editorRef.current&&editorRef.current.innerHTML!==(value||"")){
      editorRef.current.innerHTML=value||"";
    }
  },[]);// eslint-disable-line

  const saveSelection=()=>{
    const sel=window.getSelection();
    if(sel&&sel.rangeCount>0)lastSel.current=sel.getRangeAt(0).cloneRange();
  };

  const restoreSelection=()=>{
    if(!lastSel.current)return;
    const sel=window.getSelection();
    if(sel){sel.removeAllRanges();sel.addRange(lastSel.current);}
  };

  const exec=(cmd)=>{
    editorRef.current?.focus();
    document.execCommand(cmd,false,null);
    onChange(editorRef.current?.innerHTML||"");
  };

  // Expose insert function to parent
  if(insertRef)insertRef.current=(varKey)=>{
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand("insertText",false,"{{"+varKey+"}}");
    onChange(editorRef.current?.innerHTML||"");
  };

  return(
    <div style={{border:"1px solid rgba(0,0,0,.1)",borderRadius:8,overflow:"hidden"}}>
      <div style={{display:"flex",gap:2,padding:"5px 8px",borderBottom:"1px solid rgba(0,0,0,.07)",background:"rgba(0,0,0,.02)"}}>
        {[["B","bold","font-weight:700"],["I","italic","font-style:italic"],["U","underline","text-decoration:underline"]].map(([label,cmd,style])=>(
          <button key={cmd} title={cmd} onMouseDown={e=>{e.preventDefault();exec(cmd);}}
            style={{width:26,height:26,borderRadius:4,border:"1px solid rgba(0,0,0,.1)",background:"#fff",cursor:"pointer",fontSize:11,fontFamily:"inherit",display:"inline-flex",alignItems:"center",justifyContent:"center",...Object.fromEntries(style.split(";").filter(Boolean).map(s=>{const[k,v]=s.split(":");return[k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v.trim()];}))}}>{label}</button>
        ))}
        <div style={{width:1,background:"rgba(0,0,0,.1)",margin:"2px 4px"}}/>
        <button onMouseDown={e=>{e.preventDefault();exec("removeFormat");}} title="Clear formatting"
          style={{width:26,height:26,borderRadius:4,border:"1px solid rgba(0,0,0,.1)",background:"#fff",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M3 21h9"/><path d="M6.5 4.5l10 10M9.5 2.5L20 13"/></svg>
        </button>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning
        onInput={e=>onChange(e.currentTarget.innerHTML)}
        onMouseUp={saveSelection} onKeyUp={saveSelection}
        style={{minHeight:90,padding:"10px 12px",fontSize:12,lineHeight:1.7,fontFamily:"inherit",outline:"none",color:"#1a1714"}}/>
    </div>
  );
}

// ── Main TemplateEditor component ────────────────────────────────────
export default function TemplateEditor({template,setTemplate,settings,showAlert,DEF_LEASE_SECTIONS}){
  const _acc=(settings?.adminAccent)||"#4a7c59";
  const [saving,setSaving]=useState(false);
  const [previewOpen,setPreviewOpen]=useState(false);
  const [expanded,setExpanded]=useState({});
  const [previewMode,setPreviewMode]=useState({});
  const [showDesc,setShowDesc]=useState({});
  const [varDropdown,setVarDropdown]=useState(null);
  const insertRefs=useRef({});

  const sections=template?.sections||DEF_LEASE_SECTIONS||[];

  const updateSec=(si,patch)=>{
    const secs=[...sections];secs[si]={...secs[si],...patch};
    setTemplate(p=>({...(p||{}),sections:secs}));
  };

  const moveSec=(si,dir)=>{
    if(si+dir<0||si+dir>=sections.length)return;
    const secs=[...sections];[secs[si],secs[si+dir]]=[secs[si+dir],secs[si]];
    setTemplate(p=>({...(p||{}),sections:secs}));
  };

  const dupSec=(si)=>{
    const secs=[...sections];
    secs.splice(si+1,0,{...secs[si],id:"s"+uid(),title:secs[si].title+" (Copy)"});
    setTemplate(p=>({...(p||{}),sections:secs}));
  };

  const delSec=(si)=>{
    if(!window.confirm("Delete section \""+sections[si].title+"\"? This cannot be undone."))return;
    setTemplate(p=>({...(p||{}),sections:sections.filter((_,i)=>i!==si)}));
  };

  const addSec=()=>{
    const secs=[...sections,{id:"s"+uid(),title:"New Section",content:"<p>Enter section content here. Click \"Insert Variable\" to add dynamic fields like tenant name or rent amount.</p>",active:true,requiresInitials:false}];
    setTemplate(p=>({...(p||{}),sections:secs}));
  };

  const save=async()=>{
    if(!template?.id){showAlert({title:"Error",body:"No template ID found. Please refresh and try again."});return;}
    setSaving(true);
    try{
      await supa("lease_templates?id=eq."+template.id,{method:"PATCH",prefer:"resolution=merge-duplicates",body:JSON.stringify({name:template.name||"Black Bear Rentals — Standard Lease",sections,updated_at:new Date().toISOString()})});
      showAlert({title:"Template Saved",body:"Your lease template has been saved."});
    }catch(e){showAlert({title:"Error",body:"Failed to save. Please try again."});}
    setSaving(false);
  };

  // Close var dropdown on outside click
  useEffect(()=>{
    if(!varDropdown)return;
    const handler=()=>setVarDropdown(null);
    document.addEventListener("mousedown",handler);
    return()=>document.removeEventListener("mousedown",handler);
  },[varDropdown]);

  return(<>
    {/* ── Header ── */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
      <div>
        <h2 style={{fontSize:15,fontWeight:700,color:"#1a1714",margin:0}}>Lease Template Editor</h2>
        <p style={{fontSize:11,color:"#6b5e52",margin:"3px 0 0"}}>Your master lease — auto-fills for every new tenant. Edit once, use forever.</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn btn-out btn-sm" onClick={()=>setPreviewOpen(true)} style={{display:"flex",alignItems:"center",gap:5}}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Preview Full Lease
        </button>
        <button className="btn btn-gold" onClick={save} disabled={saving}>{saving?"Saving...":"Save Template"}</button>
      </div>
    </div>

    {/* ── Template defaults ── */}
    <div className="card" style={{padding:16,marginBottom:14}}>
      <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Default Lease Info</div>
      <div className="fr">
        <div className="fld"><label>Property Manager Name</label>
          <input value={template?.landlordName||""} onChange={e=>setTemplate(p=>({...(p||{}),landlordName:e.target.value}))} placeholder="Carolina Cooper"/>
        </div>
        <div className="fld"><label>Company Name</label>
          <input value={template?.company||""} onChange={e=>setTemplate(p=>({...(p||{}),company:e.target.value}))} placeholder="Black Bear Properties"/>
        </div>
      </div>
      <div className="fld" style={{marginBottom:0}}><label>Landlord Email</label>
        <input type="email" value={template?.landlordEmail||""} onChange={e=>setTemplate(p=>({...(p||{}),landlordEmail:e.target.value}))} placeholder="info@rentblackbear.com"/>
      </div>
      <div style={{fontSize:10,color:"#4a7c59",marginTop:10,padding:"6px 10px",background:"rgba(74,124,89,.05)",borderRadius:6,border:"0.5px solid rgba(74,124,89,.15)"}}>
        These fields auto-fill into every new lease. You can override them per-lease in the lease editor.
      </div>
    </div>

    {/* ── Section list header ── */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <div style={{fontSize:12,fontWeight:700,color:"#5c4a3a"}}>
        {sections.filter(s=>s.active!==false).length} of {sections.length} sections active
      </div>
      <button className="btn btn-out btn-sm" onClick={addSec} style={{display:"flex",alignItems:"center",gap:4}}>
        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Section
      </button>
    </div>

    {/* ── Sections ── */}
    {sections.map((sec,si)=>{
      const isExpanded=expanded[sec.id];
      const isPreviewing=previewMode[sec.id];
      const isActive=sec.active!==false;
      if(!insertRefs.current[sec.id])insertRefs.current[sec.id]={current:null};
      const insertRef=insertRefs.current[sec.id];

      return(
        <div key={sec.id} style={{marginBottom:8,borderRadius:10,border:"1px solid "+(isActive?"rgba(0,0,0,.08)":"rgba(0,0,0,.04)"),borderLeft:"3px solid "+(isActive?_acc:"rgba(0,0,0,.12)"),background:isActive?"#fff":"rgba(0,0,0,.015)",transition:"all .2s"}}>

          {/* Header row */}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",cursor:"pointer",opacity:isActive?1:.65}} onClick={()=>setExpanded(p=>({...p,[sec.id]:!p[sec.id]}))}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={isExpanded?"#d4a853":"#ccc"} strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0,transform:isExpanded?"rotate(90deg)":"none",transition:"transform .15s"}}><polyline points="9 18 15 12 9 6"/></svg>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1a1714",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{si+1}. {sec.title}</div>
              <div style={{fontSize:9,color:"#9a8878",marginTop:1}}>{isActive?"Active":"Hidden"} · {sec.requiresInitials?"Requires initials":"No initials"}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}} onClick={e=>e.stopPropagation()}>
              <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",userSelect:"none",fontSize:10,color:"#6b5e52"}}>
                <button onClick={()=>updateSec(si,{active:!isActive})} style={{width:30,height:17,borderRadius:9,border:"none",cursor:"pointer",background:isActive?_acc:"#ccc",position:"relative",padding:0,transition:"background .15s",flexShrink:0}}>
                  <div style={{position:"absolute",width:13,height:13,borderRadius:"50%",background:"#fff",top:2,left:isActive?15:2,transition:"left .15s"}}/>
                </button>
                Active
              </label>
              <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",userSelect:"none",fontSize:10,color:"#6b5e52"}}>
                <input type="checkbox" checked={!!sec.requiresInitials} onChange={e=>updateSec(si,{requiresInitials:e.target.checked})} style={{width:13,height:13}}/>
                Initials
              </label>
            </div>
          </div>

          {/* Expanded body */}
          {isExpanded&&<div style={{padding:"0 14px 14px",borderTop:"1px solid rgba(0,0,0,.05)"}}>

            {/* Plain-English description */}
            {SEC_DESC[sec.id]&&<div style={{marginTop:10,marginBottom:10}}>
              <button onClick={()=>setShowDesc(p=>({...p,[sec.id]:!p[sec.id]}))}
                style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#6b5e52",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:0}}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={showDesc[sec.id]?_acc:"#9a8878"} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {showDesc[sec.id]?"Hide":"What does this section do?"}
              </button>
              {showDesc[sec.id]&&<div style={{marginTop:6,padding:"8px 12px",background:"rgba(59,130,246,.05)",border:"0.5px solid rgba(59,130,246,.18)",borderRadius:7,fontSize:11,color:"#374151",lineHeight:1.6}}>
                {SEC_DESC[sec.id]}
              </div>}
            </div>}

            {/* Title input */}
            <div className="fld" style={{marginTop:showDesc[sec.id]?0:10,marginBottom:10}}>
              <label>Section Title</label>
              <input value={sec.title} onChange={e=>updateSec(si,{title:e.target.value})}/>
            </div>

            {/* Content label + toolbar */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <label style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.5,margin:0}}>Content</label>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {/* Variable insert */}
                <div style={{position:"relative"}} onMouseDown={e=>e.stopPropagation()}>
                  <button onClick={()=>setVarDropdown(v=>v===sec.id?null:sec.id)}
                    style={{padding:"4px 10px",fontSize:10,fontWeight:700,borderRadius:6,border:"1px solid "+_acc,background:"transparent",color:_acc,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                    <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Insert Variable
                  </button>
                  {varDropdown===sec.id&&<div style={{position:"absolute",top:"calc(100% + 4px)",right:0,background:"#fff",border:"1px solid rgba(0,0,0,.1)",borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:60,minWidth:230,padding:"4px 0",maxHeight:260,overflowY:"auto"}}>
                    <div style={{padding:"6px 12px 4px",fontSize:9,fontWeight:700,color:"#9a8878",textTransform:"uppercase",letterSpacing:.8}}>Click to insert at cursor</div>
                    {VARIABLES.map(v=>(
                      <button key={v.key} onMouseDown={e=>{e.preventDefault();if(insertRef.current)insertRef.current(v.key);setVarDropdown(null);}}
                        style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"6px 12px",fontSize:11,border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left",gap:12}}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.04)"}
                        onMouseLeave={e=>e.currentTarget.style.background="none"}>
                        <span style={{color:"#1a1714",fontWeight:500}}>{v.label}</span>
                        <span style={{color:"#9a8878",fontSize:9,fontFamily:"monospace",flexShrink:0}}>{"{{"+v.key+"}}"}</span>
                      </button>
                    ))}
                  </div>}
                </div>
                {/* Edit/Preview toggle */}
                <div style={{display:"flex",border:"1px solid rgba(0,0,0,.1)",borderRadius:6,overflow:"hidden"}}>
                  {[["edit","Edit"],["preview","Preview"]].map(([mode,label])=>{
                    const active=(mode==="preview")===!!isPreviewing;
                    return(<button key={mode} onClick={()=>setPreviewMode(p=>({...p,[sec.id]:mode==="preview"}))}
                      style={{padding:"4px 12px",fontSize:10,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:active?"#1a1714":"transparent",color:active?"#f5f0e8":"#9a8878",transition:"all .15s"}}>
                      {label}
                    </button>);
                  })}
                </div>
              </div>
            </div>

            {/* Editor or Preview */}
            {isPreviewing
              ?<div style={{minHeight:80,padding:"10px 12px",border:"1px solid rgba(0,0,0,.08)",borderRadius:8,background:"#fafaf8",fontSize:12,lineHeight:1.7,color:"#1a1714"}}
                  dangerouslySetInnerHTML={{__html:fillVars(sec.content,PREVIEW_DATA)}}/>
              :<RichEditor value={sec.content||""} onChange={html=>updateSec(si,{content:html})} insertRef={insertRef}/>
            }

            {/* Actions */}
            <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
              <button onClick={()=>moveSec(si,-1)} disabled={si===0}
                style={{padding:"4px 10px",fontSize:10,borderRadius:6,border:"1px solid rgba(0,0,0,.1)",background:"#fff",cursor:si===0?"not-allowed":"pointer",opacity:si===0?.4:1,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>Move Up
              </button>
              <button onClick={()=>moveSec(si,1)} disabled={si===sections.length-1}
                style={{padding:"4px 10px",fontSize:10,borderRadius:6,border:"1px solid rgba(0,0,0,.1)",background:"#fff",cursor:si===sections.length-1?"not-allowed":"pointer",opacity:si===sections.length-1?.4:1,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>Move Down
              </button>
              <button onClick={()=>dupSec(si)}
                style={{padding:"4px 10px",fontSize:10,borderRadius:6,border:"1px solid rgba(0,0,0,.1)",background:"#fff",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Duplicate
              </button>
              <button onClick={()=>delSec(si)}
                style={{padding:"4px 10px",fontSize:10,borderRadius:6,border:"1px solid rgba(196,92,74,.25)",background:"rgba(196,92,74,.04)",color:"#c45c4a",cursor:"pointer",fontFamily:"inherit",marginLeft:"auto",display:"flex",alignItems:"center",gap:4}}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>Delete
              </button>
            </div>
          </div>}
        </div>
      );
    })}

    {/* ── Bottom add + save ── */}
    <button className="btn btn-out" style={{width:"100%",marginTop:4,marginBottom:10}} onClick={addSec}>+ Add Section</button>
    <button className="btn btn-gold" style={{width:"100%"}} onClick={save} disabled={saving}>{saving?"Saving...":"Save Template"}</button>

    {/* ── Full lease preview modal ── */}
    {previewOpen&&<div className="mbg" onClick={()=>setPreviewOpen(false)}>
      <div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:680}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,paddingBottom:16,borderBottom:"2px solid #1a1714"}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:"#1a1714",fontFamily:"Georgia,serif"}}>{template?.company||"Black Bear Properties"}</div>
            <div style={{fontSize:10,color:"#6b5e52",marginTop:2,letterSpacing:.5,textTransform:"uppercase"}}>Residential Lease Agreement — Preview</div>
            <div style={{marginTop:6,display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",background:"rgba(212,168,83,.1)",border:"0.5px solid rgba(212,168,83,.3)",borderRadius:4}}>
              <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="#9a7422" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span style={{fontSize:9,fontWeight:700,color:"#9a7422"}}>Sample data — not a real lease</span>
            </div>
          </div>
          <button onClick={()=>setPreviewOpen(false)} style={{background:"none",border:"none",cursor:"pointer",padding:4,flexShrink:0}}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Parties */}
        <div style={{display:"flex",gap:12,marginBottom:20,fontSize:11}}>
          <div style={{flex:1,padding:"10px 14px",background:"rgba(0,0,0,.03)",borderRadius:8,border:"0.5px solid rgba(0,0,0,.08)"}}>
            <div style={{fontWeight:700,fontSize:9,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Property Manager</div>
            <div style={{fontWeight:600,fontSize:12}}>{template?.landlordName||PREVIEW_DATA.LANDLORD_NAME}</div>
            <div style={{color:"#6b5e52",fontSize:10}}>{template?.company||"Black Bear Properties"}</div>
          </div>
          <div style={{flex:1,padding:"10px 14px",background:"rgba(0,0,0,.03)",borderRadius:8,border:"0.5px solid rgba(0,0,0,.08)"}}>
            <div style={{fontWeight:700,fontSize:9,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Tenant</div>
            <div style={{fontWeight:600,fontSize:12}}>{PREVIEW_DATA.TENANT_NAME}</div>
            <div style={{color:"#6b5e52",fontSize:10}}>{PREVIEW_DATA.PROPERTY_ADDRESS} · {PREVIEW_DATA.ROOM_NAME}</div>
          </div>
        </div>

        {/* Active sections */}
        {sections.filter(s=>s.active!==false).map((sec,i)=>(
          <div key={sec.id} style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:"#1a1714",marginBottom:8,display:"flex",alignItems:"center",gap:8,fontFamily:"Georgia,serif"}}>
              <span style={{width:20,height:20,borderRadius:"50%",background:"#1a1714",color:"#d4a853",fontSize:9,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span>
              {sec.title.toUpperCase()}
            </div>
            <div style={{fontSize:12,lineHeight:1.85,color:"#2c2420",paddingLeft:28,fontFamily:"Georgia,serif"}}
              dangerouslySetInnerHTML={{__html:fillVars(sec.content,PREVIEW_DATA)}}/>
            {sec.requiresInitials&&<div style={{marginTop:10,paddingLeft:28,display:"flex",alignItems:"center",gap:16,fontSize:10,color:"#6b5e52"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:70,borderBottom:"1px solid #1a1714"}}/> Tenant Initials</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:70,borderBottom:"1px solid #1a1714"}}/> PM Initials</div>
            </div>}
          </div>
        ))}

        {/* Signature block */}
        <div style={{marginTop:24,paddingTop:20,borderTop:"2px solid #1a1714"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#1a1714",marginBottom:20,textTransform:"uppercase",letterSpacing:.8}}>Signatures</div>
          <div style={{display:"flex",gap:32}}>
            <div style={{flex:1}}>
              <div style={{height:50,borderBottom:"1px solid #1a1714",marginBottom:6}}/>
              <div style={{fontSize:10,fontWeight:600,color:"#1a1714"}}>{template?.landlordName||PREVIEW_DATA.LANDLORD_NAME}</div>
              <div style={{fontSize:9,color:"#6b5e52"}}>Property Manager Signature</div>
              <div style={{marginTop:14,borderBottom:"1px solid #1a1714",width:100,marginBottom:4}}/>
              <div style={{fontSize:9,color:"#6b5e52"}}>Date</div>
            </div>
            <div style={{flex:1}}>
              <div style={{height:50,borderBottom:"1px solid #1a1714",marginBottom:6}}/>
              <div style={{fontSize:10,fontWeight:600,color:"#1a1714"}}>{PREVIEW_DATA.TENANT_NAME}</div>
              <div style={{fontSize:9,color:"#6b5e52"}}>Tenant Signature</div>
              <div style={{marginTop:14,borderBottom:"1px solid #1a1714",width:100,marginBottom:4}}/>
              <div style={{fontSize:9,color:"#6b5e52"}}>Date</div>
            </div>
          </div>
        </div>

        <div className="mft" style={{marginTop:20}}>
          <button className="btn btn-out" onClick={()=>setPreviewOpen(false)}>Close Preview</button>
        </div>
      </div>
    </div>}
  </>);
}
