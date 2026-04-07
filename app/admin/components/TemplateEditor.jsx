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
  DOOR_CODE:"4821",UTILITIES_CLAUSE:"PROPERTY MANAGER agrees to pay the first $100.00 of combined utilities per month. Any overage is split equally among all residents. Internet (WiFi) is included at no cost.",
  LANDLORD_NAME:"Carolina Cooper",PARKING_SPACE:"Space A1, right side of driveway",
};

// ── Policy variable definitions per section ──────────────────────────
const SECTION_VARS={
  s2:[
    {key:"mtmIncrease",label:"Month-to-month rent increase",type:"number",unit:"$",hint:"Added to rent when lease converts to month-to-month"},
    {key:"noticeDays",label:"Notice required to terminate",type:"number",unit:"days",hint:"Written notice required by either party"},
  ],
  s4:[
    {key:"depositReturnDays",label:"Days to return security deposit",type:"number",unit:"days",hint:"After move-out, how many days to return deposit"},
  ],
  s5:[
    {key:"lateFeeDay",label:"Late fee kicks in after day",type:"number",unit:"",hint:"If rent is not received by this day of the month"},
    {key:"lateFeeAmount",label:"One-time late fee",type:"number",unit:"$",hint:"Flat fee charged when rent is late"},
    {key:"lateDailyRate",label:"Daily late fee",type:"number",unit:"$/day",hint:"Charged each additional day rent remains unpaid"},
    {key:"nsfFee",label:"NSF / returned check fee",type:"number",unit:"$",hint:"Fee for returned checks or failed ACH payments"},
  ],
  s7:[
    {key:"guestConsecNights",label:"Max consecutive guest nights",type:"number",unit:"nights",hint:"Max nights a guest can stay in a row"},
    {key:"guestMonthlyNights",label:"Max guest nights per 30 days",type:"number",unit:"nights",hint:"Total guest nights allowed in any 30-day period"},
    {key:"guestViolationFee",label:"Unauthorized guest charge",type:"number",unit:"$",hint:"Per guest per violation"},
    {key:"gatheringLimit",label:"Large gathering threshold",type:"number",unit:"people",hint:"Number of non-residents that requires written consent"},
  ],
  s8:[
    {key:"petViolationFee",label:"Pet violation one-time charge",type:"number",unit:"$",hint:"Charged when unauthorized pet is discovered"},
    {key:"petDailyFee",label:"Pet daily charge",type:"number",unit:"$/day",hint:"Charged each day the unauthorized pet remains"},
  ],
  s9:[
    {key:"parkingReassignDays",label:"Notice to reassign parking space",type:"number",unit:"days",hint:"Days notice Owner gives before changing parking assignment"},
  ],
  s10:[
    {key:"quietWeekdayStart",label:"Quiet hours start (weekdays)",type:"time",unit:"",hint:""},
    {key:"quietWeekdayEnd",label:"Quiet hours end (weekdays)",type:"time",unit:"",hint:""},
    {key:"quietWeekendStart",label:"Quiet hours start (weekends)",type:"time",unit:"",hint:""},
    {key:"quietWeekendEnd",label:"Quiet hours end (weekends)",type:"time",unit:"",hint:""},
  ],
  s13:[
    {key:"batteryFee",label:"Battery replacement service fee",type:"number",unit:"$",hint:"Charged if Owner replaces batteries tenant was responsible for"},
  ],
  s14:[
    {key:"entryNoticeHours",label:"Entry notice required",type:"number",unit:"hours",hint:"Written notice Owner must give before entering"},
  ],
  s18:[
    {key:"terminationNoticeDays",label:"Notice required to terminate",type:"number",unit:"days",hint:"Written notice required by either party to end lease"},
  ],
};

// ── Default policy values ────────────────────────────────────────────
const DEFAULT_POLICY={
  mtmIncrease:50,noticeDays:30,depositReturnDays:60,
  lateFeeDay:3,lateFeeAmount:50,lateDailyRate:5,nsfFee:50,
  guestConsecNights:4,guestMonthlyNights:5,guestViolationFee:200,gatheringLimit:10,
  petViolationFee:300,petDailyFee:10,parkingReassignDays:7,
  quietWeekdayStart:"22:00",quietWeekdayEnd:"07:00",
  quietWeekendStart:"23:00",quietWeekendEnd:"10:00",
  batteryFee:50,entryNoticeHours:48,terminationNoticeDays:30,
};

// ── Fill variables for preview ───────────────────────────────────────
const fillVars=(html,data)=>{
  if(!html)return"";
  let out=html;
  Object.entries(data).forEach(([k,v])=>{out=out.replaceAll("{{"+k+"}}",`<mark style="background:#fef9c3;border-radius:3px;padding:0 2px">${v}</mark>`);});
  out=out.replace(/\{\{([A-Z_]+)\}\}/g,'<mark style="background:#fee2e2;color:#c45c4a;border-radius:3px;padding:0 2px;font-weight:700">{{$1}}</mark>');
  return out;
};

// ── Rich text editor ─────────────────────────────────────────────────
function RichEditor({value,onChange}){
  const editorRef=useRef(null);
  useEffect(()=>{
    if(editorRef.current&&editorRef.current.innerHTML!==(value||""))
      editorRef.current.innerHTML=value||"";
  },[]);// eslint-disable-line
  const exec=(cmd,val)=>{editorRef.current?.focus();document.execCommand(cmd,false,val||null);onChange(editorRef.current?.innerHTML||"");};
  const tbtn=(label,cmd,opts={})=>(
    <button key={cmd} onMouseDown={e=>{e.preventDefault();exec(cmd,opts.val);}} title={opts.title||cmd}
      style={{width:opts.w||26,height:26,borderRadius:4,border:"1px solid rgba(0,0,0,.1)",background:"#fff",cursor:"pointer",fontSize:opts.fs||11,fontFamily:"inherit",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:opts.bold?700:400,fontStyle:opts.italic?"italic":"normal",textDecoration:opts.underline?"underline":"none",padding:"0 4px"}}>{label}</button>
  );
  const tsep=()=>(<div style={{width:1,background:"rgba(0,0,0,.1)",margin:"2px 4px"}}/>);
  const tsvg=(d,cmd,title,val)=>(
    <button key={cmd+title} onMouseDown={e=>{e.preventDefault();exec(cmd,val);}} title={title}
      style={{width:26,height:26,borderRadius:4,border:"1px solid rgba(0,0,0,.1)",background:"#fff",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
    </button>
  );
  return(
    <div style={{border:"1px solid rgba(0,0,0,.1)",borderRadius:8,overflow:"hidden"}}>
      <div style={{display:"flex",gap:2,padding:"5px 8px",borderBottom:"1px solid rgba(0,0,0,.07)",background:"rgba(0,0,0,.02)",flexWrap:"wrap"}}>
        {tbtn("B","bold",{bold:true,title:"Bold"})}
        {tbtn("I","italic",{italic:true,title:"Italic"})}
        {tbtn("U","underline",{underline:true,title:"Underline"})}
        {tsep()}
        {tsvg(<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,"insertUnorderedList","Bullet list")}
        {tsvg(<><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v1H4zM4 12h1v1H4zM4 18h1v1H4z"/></>,"insertOrderedList","Numbered list")}
        {tsep()}
        {tsvg(<><polyline points="15 18 9 12 15 6"/></>,"outdent","Decrease indent")}
        {tsvg(<><polyline points="9 18 15 12 9 6"/></>,"indent","Increase indent")}
        {tsep()}
        {tsvg(<><path d="M18 6L6 18M3 21h9"/><path d="M6.5 4.5l10 10M9.5 2.5L20 13"/></>,"removeFormat","Clear formatting")}
      </div>
      <style>{`.rich-ed ul,.rich-ed ol{padding-left:24px;margin:4px 0}.rich-ed li{margin:2px 0}`}</style>
      <div ref={editorRef} className="rich-ed" contentEditable suppressContentEditableWarning
        onInput={e=>onChange(e.currentTarget.innerHTML)}
        style={{minHeight:90,padding:"10px 12px",fontSize:12,lineHeight:1.7,fontFamily:"inherit",outline:"none",color:"#1a1714"}}/>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────
export default function TemplateEditor({template,setTemplate,settings,showAlert,DEF_LEASE_SECTIONS,onDirtyChange}){
  const _acc=(settings?.adminAccent)||"#4a7c59";
  const [saving,setSaving]=useState(false);
  const [savingSec,setSavingSec]=useState({});// {[secId]:true}
  const [previewOpen,setPreviewOpen]=useState(false);
  const [expanded,setExpanded]=useState({});
  const [sectionMode,setSectionMode]=useState({});
  const [policy,setPolicy]=useState(DEFAULT_POLICY);
  const [legalWarned,setLegalWarned]=useState({});
  const [dirtySecs,setDirtySecs]=useState(new Set());// section IDs with unsaved changes
  const [nameDirty,setNameDirty]=useState(false);
  const originalSections=useRef(null);// snapshot of sections as loaded from Supabase
  const [revertConfirm,setRevertConfirm]=useState(null);// {si, title} when confirm modal is open

  // Notify parent of dirty state changes
  useEffect(()=>{
    if(onDirtyChange)onDirtyChange(dirtySecs.size>0||nameDirty);
  },[dirtySecs,nameDirty]);// eslint-disable-line

  // Capture original on first load
  useEffect(()=>{
    if(template?.sections&&!originalSections.current){
      originalSections.current=JSON.parse(JSON.stringify(template.sections));
    }
  },[template?.sections]);

  const sections=template?.sections||DEF_LEASE_SECTIONS||[];

  // ── Unsaved changes warning ──────────────────────────────────────
  useEffect(()=>{
    const handler=(e)=>{
      if(dirtySecs.size===0)return;
      e.preventDefault();
      e.returnValue="You have unsaved changes. Leave without saving?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload",handler);
    return()=>window.removeEventListener("beforeunload",handler);
  },[dirtySecs]);

  const updateSec=(si,patch)=>{
    const secs=[...sections];secs[si]={...secs[si],...patch};
    setTemplate(p=>({...(p||{}),sections:secs}));
    setDirtySecs(p=>{const n=new Set(p);n.add(sections[si].id);return n;});
  };
  const moveSec=(si,dir)=>{
    if(si+dir<0||si+dir>=sections.length)return;
    const secs=[...sections];[secs[si],secs[si+dir]]=[secs[si+dir],secs[si]];
    setTemplate(p=>({...(p||{}),sections:secs}));
    setDirtySecs(p=>{const n=new Set(p);n.add(sections[si].id);n.add(sections[si+dir].id);return n;});
  };
  const dupSec=(si)=>{
    const secs=[...sections];
    const copy={...secs[si],id:"s"+uid(),title:secs[si].title+" (Copy)"};
    secs.splice(si+1,0,copy);
    setTemplate(p=>({...(p||{}),sections:secs}));
    setDirtySecs(p=>{const n=new Set(p);n.add(copy.id);return n;});
  };
  const delSec=(si)=>{
    if(!window.confirm("Delete \""+sections[si].title+"\"? This cannot be undone."))return;
    setTemplate(p=>({...(p||{}),sections:sections.filter((_,i)=>i!==si)}));
    setDirtySecs(p=>{const n=new Set(p);n.delete(sections[si].id);return n;});
  };
  const addSec=()=>{
    const newSec={id:"s"+uid(),title:"New Section",content:"<p>Enter section content here.</p>",active:true,requiresInitials:false};
    setTemplate(p=>({...(p||{}),sections:[...sections,newSec]}));
    setDirtySecs(p=>{const n=new Set(p);n.add(newSec.id);return n;});
  };

  // ── Save all ─────────────────────────────────────────────────────
  const save=async()=>{
    if(!template?.id){showAlert({title:"Error",body:"No template ID found. Please refresh."});return;}
    setSaving(true);
    try{
      await supa("lease_templates?id=eq."+template.id,{method:"PATCH",prefer:"resolution=merge-duplicates",body:JSON.stringify({name:template.name||"Black Bear Rentals — Alabama Co-Living Lease",sections,updated_at:new Date().toISOString()})});
      setDirtySecs(new Set());
      setNameDirty(false);
      showAlert({title:"Template Saved",body:"All sections saved successfully."});
    }catch(e){showAlert({title:"Error",body:"Failed to save. Please try again."});}
    setSaving(false);
  };

  // ── Save single section ──────────────────────────────────────────
  const saveSection=async(secId)=>{
    if(!template?.id)return;
    setSavingSec(p=>({...p,[secId]:true}));
    try{
      const latestSecs=template?.sections||DEF_LEASE_SECTIONS||[];
      await supa("lease_templates?id=eq."+template.id,{method:"PATCH",prefer:"resolution=merge-duplicates",body:JSON.stringify({sections:latestSecs,updated_at:new Date().toISOString()})});
      setDirtySecs(p=>{const n=new Set(p);n.delete(secId);return n;});
      showAlert({title:"Section Saved",body:"Section saved successfully."});
    }catch(e){showAlert({title:"Error",body:"Failed to save section. Please try again."});}
    setSavingSec(p=>({...p,[secId]:false}));
  };

  // ── Revert section to default ────────────────────────────────────
  const revertSection=(si)=>{
    const sec=sections[si];
    const snap=originalSections.current||[];
    const defaultSec=snap.find(d=>d.id===sec.id);
    if(!defaultSec){showAlert({title:"No Default",body:"This is a custom section — there is no saved default to revert to."});return;}
    setRevertConfirm({secId:sec.id,title:sec.title,defaultSec});
  };

  const doRevert=(secId,defaultSec)=>{
    const idx=sections.findIndex(s=>s.id===secId);
    if(idx===-1)return;
    const secs=[...sections];
    secs[idx]={...secs[idx],content:defaultSec.content,title:defaultSec.title};
    setTemplate(p=>({...(p||{}),sections:secs}));
    setDirtySecs(p=>{const n=new Set(p);n.delete(secId);return n;});
  };

  const getMode=(secId,hasVars)=>sectionMode[secId]||(hasVars?"vars":"preview");

  return(<>
    {/* ── Header ── */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
      <div>
        <h2 style={{fontSize:15,fontWeight:700,color:"#1a1714",margin:0}}>Lease Template Editor</h2>
        <p style={{fontSize:11,color:"#6b5e52",margin:"3px 0 0"}}>Use <strong>Edit Variables</strong> to adjust your policy numbers. Only edit legal wording if advised by your attorney.</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn btn-out btn-sm" onClick={()=>setPreviewOpen(true)} style={{display:"flex",alignItems:"center",gap:5}}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Preview Full Lease
        </button>
        <button className="btn btn-gold" onClick={save} disabled={saving}>{saving?"Saving...":dirtySecs.size>0?"Save All ("+dirtySecs.size+" unsaved)":"Save Template"}</button>
      </div>
    </div>

    {/* ── Template name ── */}
    <div className="card" style={{padding:14,marginBottom:14}}>
      <div className="fld" style={{marginBottom:0}}>
        <label>Template Name</label>
        <input
          value={template?.name||""}
          onChange={e=>{setTemplate(p=>({...(p||{}),name:e.target.value}));setNameDirty(true);}}
          placeholder="e.g. Alabama Co-Living — By Room"
          style={{fontSize:13,fontWeight:600}}
        />
      </div>
    </div>

    {/* ── Section count + Add ── */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <div style={{fontSize:12,fontWeight:700,color:"#5c4a3a"}}>{sections.filter(s=>s.active!==false).length} of {sections.length} sections active</div>
      <button className="btn btn-out btn-sm" onClick={addSec} style={{display:"flex",alignItems:"center",gap:4}}>
        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Section
      </button>
    </div>

    {/* ── Sections ── */}
    {sections.map((sec,si)=>{
      const isExpanded=expanded[sec.id];
      const isActive=sec.active!==false;
      const hasVars=!!(SECTION_VARS[sec.id]?.length);
      const mode=getMode(sec.id,hasVars);

      return(
        <div key={sec.id} style={{marginBottom:8,borderRadius:10,border:"1px solid "+(isActive?"rgba(0,0,0,.08)":"rgba(0,0,0,.04)"),borderLeft:"3px solid "+(isActive?_acc:"rgba(0,0,0,.12)"),background:isActive?"#fff":"rgba(0,0,0,.015)",transition:"all .2s"}}>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",cursor:"pointer",opacity:isActive?1:.65}} onClick={()=>setExpanded(p=>({...p,[sec.id]:!p[sec.id]}))}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={isExpanded?"#d4a853":"#ccc"} strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0,transform:isExpanded?"rotate(90deg)":"none",transition:"transform .15s"}}><polyline points="9 18 15 12 9 6"/></svg>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1a1714",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{si+1}. {sec.title}</div>
              <div style={{fontSize:9,color:"#9a8878",marginTop:1,display:"flex",gap:6,flexWrap:"wrap"}}>
                <span>{isActive?"Active":"Hidden"}</span>
                <span>·</span>
                <span>{sec.requiresInitials?"Requires initials":"No initials"}</span>
                {hasVars&&<><span>·</span><span style={{color:_acc,fontWeight:600}}>Has policy variables</span></>}
                {dirtySecs.has(sec.id)&&<><span>·</span><span style={{color:"#c45c4a",fontWeight:700,animation:"shake .4s ease"}}>Unsaved changes</span></>}
              </div>
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

          {/* Body */}
          {isExpanded&&<div style={{padding:"0 14px 14px",borderTop:"1px solid rgba(0,0,0,.05)"}}>

            {/* Title */}
            <div className="fld" style={{marginTop:12,marginBottom:12}}>
              <label>Section Title</label>
              <input value={sec.title} onChange={e=>updateSec(si,{title:e.target.value})}/>
            </div>

            {/* Mode tabs */}
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
              <div style={{display:"flex",border:"1px solid rgba(0,0,0,.1)",borderRadius:6,overflow:"hidden"}}>
                {[
                  ...(hasVars?[{id:"vars",label:"Edit Variables"}]:[]),
                  {id:"legal",label:"Edit Legal Wording"},
                  {id:"preview",label:"Preview"},
                ].map(t=>{
                  const active=mode===t.id;
                  return(<button key={t.id} onClick={()=>setSectionMode(p=>({...p,[sec.id]:t.id}))}
                    style={{padding:"4px 12px",fontSize:10,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:active?"#1a1714":"transparent",color:active?"#f5f0e8":"#9a8878",transition:"all .15s",whiteSpace:"nowrap"}}>
                    {t.label}
                  </button>);
                })}
              </div>
            </div>

            {/* ── VARIABLES MODE ── */}
            {mode==="vars"&&hasVars&&(
              <div style={{background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.15)",borderRadius:8,padding:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"#2d6a3f",textTransform:"uppercase",letterSpacing:.8,marginBottom:12}}>Policy Variables</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {SECTION_VARS[sec.id].map(v=>(
                    <div key={v.key}>
                      <label style={{fontSize:10,fontWeight:700,color:"#5c4a3a",display:"block",marginBottom:4}}>
                        {v.label}{v.unit&&<span style={{fontWeight:400,color:"#9a8878",marginLeft:4}}>({v.unit})</span>}
                      </label>
                      {v.type==="time"
                        ?<input type="time" value={policy[v.key]||""} onChange={e=>{setPolicy(p=>({...p,[v.key]:e.target.value}));setDirtySecs(p=>{const n=new Set(p);n.add(sec.id);return n;});}}
                            style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                        :<input type="number" value={policy[v.key]??""} onChange={e=>{setPolicy(p=>({...p,[v.key]:Number(e.target.value)}));setDirtySecs(p=>{const n=new Set(p);n.add(sec.id);return n;});}}
                            style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                      }
                      {v.hint&&<div style={{fontSize:9,color:"#9a8878",marginTop:3}}>{v.hint}</div>}
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12,padding:"8px 12px",background:"rgba(74,124,89,.06)",borderRadius:6,fontSize:10,color:"#2d6a3f"}}>
                  Changes here update the policy numbers in the clause. The legal wording stays intact.
                </div>
              </div>
            )}

            {/* ── LEGAL WORDING MODE ── */}
            {mode==="legal"&&(
              <div>
                <div style={{marginBottom:10,padding:"10px 14px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.25)",borderRadius:8}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:"#c45c4a",marginBottom:3}}>You are editing legal language</div>
                      <div style={{fontSize:10,color:"#5c4a3a",lineHeight:1.5}}>Changes here override the PropOS-generated clause. Consult a licensed attorney before modifying legal wording. Incorrect changes may make provisions unenforceable.</div>
                    </div>
                  </div>
                </div>
                <RichEditor value={sec.content||""} onChange={html=>updateSec(si,{content:html})}/>
              </div>
            )}

            {/* ── PREVIEW MODE ── */}
            {mode==="preview"&&(
              <div style={{minHeight:80,padding:"12px 14px",border:"1px solid rgba(0,0,0,.08)",borderRadius:8,background:"#fafaf8",fontSize:12,lineHeight:1.8,color:"#1a1714"}}
                dangerouslySetInnerHTML={{__html:fillVars(sec.content,PREVIEW_DATA)}}/>
            )}

            {/* Actions */}
            <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap",alignItems:"center"}}>
              {/* Save section */}
              <button onClick={()=>saveSection(sec.id)} disabled={!dirtySecs.has(sec.id)||savingSec[sec.id]}
                style={{padding:"5px 14px",fontSize:10,fontWeight:700,borderRadius:6,border:"none",background:dirtySecs.has(sec.id)?_acc:"rgba(0,0,0,.08)",color:dirtySecs.has(sec.id)?"#fff":"#9a8878",cursor:dirtySecs.has(sec.id)?"pointer":"not-allowed",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,transition:"all .2s"}}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                {savingSec[sec.id]?"Saving...":"Save Section"}
              </button>
              {/* Revert to default */}
              <button onClick={()=>revertSection(si)}
                style={{padding:"5px 12px",fontSize:10,fontWeight:700,borderRadius:6,border:"1px solid rgba(0,0,0,.1)",background:"#fff",color:"#6b5e52",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
                Revert to Default
              </button>
              <div style={{width:1,background:"rgba(0,0,0,.1)",height:16,margin:"0 2px"}}/>
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

    <button className="btn btn-out" style={{width:"100%",marginTop:4,marginBottom:10}} onClick={addSec}>+ Add Section</button>
    <button className="btn btn-gold" style={{width:"100%"}} onClick={save} disabled={saving}>{saving?"Saving...":"Save Template"}</button>

    {/* ── Full lease preview modal ── */}
    {previewOpen&&<div className="mbg" onClick={()=>setPreviewOpen(false)}>
      <div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:680}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,paddingBottom:16,borderBottom:"2px solid #1a1714"}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:"#1a1714",fontFamily:"Georgia,serif"}}>{template?.company||"Black Bear Properties"}</div>
            <div style={{fontSize:10,color:"#6b5e52",marginTop:2,letterSpacing:.5,textTransform:"uppercase"}}>Residential Co-Living Lease — Preview</div>
            <div style={{marginTop:6,display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",background:"rgba(212,168,83,.1)",border:"0.5px solid rgba(212,168,83,.3)",borderRadius:4}}>
              <span style={{fontSize:9,fontWeight:700,color:"#9a7422"}}>Sample data — not a real lease</span>
            </div>
          </div>
          <button onClick={()=>setPreviewOpen(false)} style={{background:"none",border:"none",cursor:"pointer",padding:4,flexShrink:0}}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {/* ── Section outline ── */}
        <div style={{marginBottom:20,border:"1px solid rgba(0,0,0,.08)",borderRadius:8,overflow:"hidden"}}>
          <div style={{padding:"8px 14px",background:"rgba(0,0,0,.03)",borderBottom:"1px solid rgba(0,0,0,.08)"}}>
            <div style={{fontSize:9,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:1}}>Table of Contents</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"8px 0"}}>
            {sections.filter(s=>s.active!==false).map((sec,i)=>(
              <div key={sec.id} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 14px"}}>
                <span style={{fontSize:9,fontWeight:800,color:"#d4a853",minWidth:18,fontFamily:"Georgia,serif"}}>{i+1}.</span>
                <span style={{fontSize:10,color:"#1a1714",fontWeight:500}}>{sec.title}</span>
              </div>
            ))}
          </div>
        </div>

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
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,paddingTop:8,borderTop:"0.5px solid rgba(0,0,0,.08)"}}>
              <span style={{fontSize:8,color:"#bbb",fontFamily:"Georgia,serif"}}>{template?.company||"Black Bear Properties"} — Alabama Co-Living Lease Agreement</span>
              <span style={{fontSize:8,color:"#bbb",fontFamily:"Georgia,serif"}}>Page {i+2} of {sections.filter(s=>s.active!==false).length+2}</span>
            </div>
          </div>
        ))}
        <div style={{marginTop:24,paddingTop:20,borderTop:"2px solid #1a1714"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#1a1714",marginBottom:20,textTransform:"uppercase",letterSpacing:.8}}>Signatures</div>
          <div style={{display:"flex",gap:32}}>
            <div style={{flex:1}}>
              <div style={{height:50,borderBottom:"1px solid #1a1714",marginBottom:6}}/>
              <div style={{fontSize:10,fontWeight:600}}>{template?.landlordName||PREVIEW_DATA.LANDLORD_NAME}</div>
              <div style={{fontSize:9,color:"#6b5e52"}}>Property Manager</div>
              <div style={{marginTop:14,borderBottom:"1px solid #1a1714",width:100,marginBottom:4}}/>
              <div style={{fontSize:9,color:"#6b5e52"}}>Date</div>
            </div>
            <div style={{flex:1}}>
              <div style={{height:50,borderBottom:"1px solid #1a1714",marginBottom:6}}/>
              <div style={{fontSize:10,fontWeight:600}}>{PREVIEW_DATA.TENANT_NAME}</div>
              <div style={{fontSize:9,color:"#6b5e52"}}>Tenant</div>
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
  {/* ── Revert confirm modal ── */}

  {revertConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(26,23,20,.5)",backdropFilter:"blur(3px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px"}} onClick={()=>setRevertConfirm(null)}>
    <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:420,width:"100%",textAlign:"center",boxShadow:"0 24px 60px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>
      <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(196,92,74,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
      </div>
      <h2 style={{fontSize:16,fontWeight:700,color:"#1a1714",marginBottom:10}}>Revert Section?</h2>
      <p style={{fontSize:12,color:"#5c4a3a",lineHeight:1.6,marginBottom:6}}>
        This will reset <strong>"{revertConfirm.title}"</strong> to its last saved wording.
      </p>
      <p style={{fontSize:11,color:"#c45c4a",marginBottom:24,fontWeight:600}}>Any unsaved edits will be permanently lost.</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="btn btn-out" onClick={()=>setRevertConfirm(null)}>Cancel — Keep My Edits</button>
        <button className="btn" style={{background:"#c45c4a",color:"#fff",border:"none"}} onClick={()=>{
          doRevert(revertConfirm.secId,revertConfirm.defaultSec);
          setRevertConfirm(null);
        }}>Yes, Revert</button>
      </div>
    </div>
  </div>}
  </>);
}
