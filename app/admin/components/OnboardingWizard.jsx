"use client";
import{useState,useMemo,useRef}from"react";

// ─── Icons (flat inline SVGs, no emojis) ─────────────────────────────
const IcoCheck=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoArrow=()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcoWarn=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoExpand=({open})=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{transform:open?"rotate(90deg)":"rotate(0)",transition:"transform .15s"}}><polyline points="9 18 15 12 9 6"/></svg>;
const IcoBuilding=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01"/></svg>;
const IcoUsers=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoHistory=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoDollar=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IcoRocket=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;

const fmtD=d=>{if(!d)return"\u2014";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;};
const fmtS=n=>"$"+Number(n||0).toLocaleString();
const hexRgb=h=>{const x=h||"#4a7c59";return`${parseInt(x.slice(1,3),16)},${parseInt(x.slice(3,5),16)},${parseInt(x.slice(5,7),16)}`;};
const ord=n=>{const s=["th","st","nd","rd"],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);};
// Contrast: white text on dark accents, dark text on light
const contrastText=(hex)=>{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return(r*.299+g*.587+b*.114)>150?"#1a1714":"#f5f0e8";};

const PHASES=[
  {id:1,label:"Properties",icon:<IcoBuilding/>},
  {id:2,label:"Tenants",icon:<IcoUsers/>},
  {id:3,label:"History",icon:<IcoHistory/>},
  {id:4,label:"Charges",icon:<IcoDollar/>},
  {id:5,label:"Go Live",icon:<IcoRocket/>},
];
const UTIL_LABELS={allIncluded:"All Included",first100:"First $100",first150:"First $150",wifiOnly:"WiFi Only",waterWifi:"Water+WiFi",tenantPaysAll:"Tenant Pays All",fullSplit:"Full Split",metered:"Metered"};
const OCC_TYPES=["Intern","Military","Contractor","Student","Professional","Other"];
const OTC_TYPES=["Move-In Fee","Admin Fee","Key Replacement","Lock Change","Cleaning Fee","Pet Deposit","Other"];

// ─── Shared styles ───────────────────────────────────────────────────
const TH={padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:600,opacity:.4,textTransform:"uppercase",letterSpacing:".5px"};
const TD={padding:"8px 12px",verticalAlign:"middle"};
const INP={fontSize:13,padding:"6px 10px",borderRadius:6,border:"1px solid rgba(128,128,128,.25)",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

// ─── Main Component ──────────────────────────────────────────────────
export default function OnboardingWizard({
  props,setProps,charges,setCharges,sdLedger,setSdLedger,
  settings,setSettings,leases,setLeases,
  save,uid,createCharge,TODAY,
  allTenants:_at,goTab,onComplete,
  supa,showConfirm,
}){
  const[phase,setPhase]=useState(1);
  const[sel,setSel]=useState([]);
  const[expandedId,setExpandedId]=useState(null);
  const[saving,setSaving]=useState(false);
  const[toast,setToast]=useState(null);
  const[dirtyTenant,setDirtyTenant]=useState(false);
  const toastTm=useRef(null);
  const _acc=settings.adminAccent||"#4a7c59";
  const _accRgb=hexRgb(_acc);
  const _accContrast=contrastText(_acc);
  // Read theme red/gold from settings if available, else defaults
  const _red=settings.red||"#c45c4a";
  const _gold=settings.gold||"#d4a853";

  const flash=(msg)=>{setToast(msg);clearTimeout(toastTm.current);toastTm.current=setTimeout(()=>setToast(null),2500);};

  const confirm=(title,body,onOk,danger=false)=>{
    if(showConfirm)showConfirm({title,body,onConfirm:onOk,confirmLabel:danger?"Yes, proceed":"Confirm",danger});
    else{if(window.confirm(title+"\n\n"+body))onOk();}
  };

  // Phase switch guard for dirty tenant edits (P1-1)
  const guardedSetPhase=(p)=>{
    if(dirtyTenant){
      confirm("Unsaved Changes","You have unsaved tenant edits. Switch phase anyway? Changes will be lost.",()=>{setDirtyTenant(false);setPhase(p);},true);
    }else setPhase(p);
  };

  // ─── Derived data ────────────────────────────────────────────────
  const utilTemplates=settings.utilTemplates||[];
  const lateFeeDefaults={amount:settings.lateFeeInitial??50,grace:settings.lateFeeGraceDays??3,daily:settings.lateFeeDaily??5};

  const tenantRows=useMemo(()=>{
    const rows=[];
    props.forEach(p=>{(p.units||[]).forEach(u=>{
      if(u.ownerOccupied)return;
      (u.rooms||[]).forEach(r=>{
        if(!r.tenant||r.ownerOccupied)return;
        const t=r.tenant;
        const missing=[];
        if(!t.name)missing.push("name");
        if(!t.email)missing.push("email");
        if(!r.rent&&r.rent!==0)missing.push("rent");
        if(!t.moveIn)missing.push("move-in");
        if(!r.le&&!r.m2m)missing.push("lease end");
        const isExpired=r.le&&new Date(r.le+"T00:00:00")<TODAY&&!r.m2m;
        rows.push({
          roomId:r.id,propId:p.id,unitId:u.id,
          propName:p.addr||p.name,unitName:u.name,roomName:r.name,
          tenant:t,rent:r.rent,le:r.le,m2m:!!r.m2m,
          utils:r.utils||u.utils||"",
          lateConfig:r.lateConfig||null,
          recurringDueDay:r.recurringDueDay||null,
          paymentPlan:r.paymentPlan||null,
          coSigner:t.coSigner||null,
          coTenants:r.coTenants||null,
          missing,isExpired,
          complete:missing.length===0&&!isExpired,
          hasPhone:!!t.phone,
          doorCode:t.doorCode||"",
          sd:r.sd||t.sd||r.rent||0,
          balanceOwed:t.balanceOwed||0,
          depositPaid:!!t.depositPaid,
          depositAmount:t.depositAmount||t.sd||r.rent||0,
        });
      });
    });});
    return rows;
  },[props,TODAY]);

  const completeTenants=tenantRows.filter(r=>r.complete).length;
  const totalTenants=tenantRows.length;

  const propRows=useMemo(()=>props.map(p=>{
    const units=(p.units||[]).filter(u=>!u.ownerOccupied);
    return{...p,units,roomCount:units.reduce((s,u)=>(s+(u.rooms||[]).length),0),displayName:p.addr||p.name};
  }),[props]);

  // Phase completion
  const phase1Done=useMemo(()=>propRows.every(p=>p.type&&p.units.every(u=>u.utils)),[propRows]);
  const phase2Done=useMemo(()=>completeTenants===totalTenants&&totalTenants>0,[completeTenants,totalTenants]);
  const phase3Done=useMemo(()=>{
    if(tenantRows.some(r=>r.balanceOwed>0)&&!charges.some(c=>c.category==="Balance Forward"))return false;
    const needsDep=tenantRows.filter(r=>r.depositPaid);
    if(needsDep.length>0){const sdIds=new Set((sdLedger||[]).map(s=>s.roomId));if(!needsDep.every(r=>sdIds.has(r.roomId)))return false;}
    return true;
  },[tenantRows,charges,sdLedger]);
  const phase4Done=useMemo(()=>{
    const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
    const has=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate?.startsWith(mk)).map(c=>c.roomId));
    return totalTenants>0&&tenantRows.every(r=>has.has(r.roomId));
  },[tenantRows,charges,TODAY]);

  const phaseStatus=id=>({1:phase1Done,2:phase2Done,3:phase3Done,4:phase4Done}[id]?"done":(id===5?(phase1Done&&phase2Done&&phase4Done?"ready":"pending"):"pending"));
  const doneCount=PHASES.filter(p=>phaseStatus(p.id)==="done").length;

  // ─── Atomic prop saves ───────────────────────────────────────────
  const saveProps=(fn)=>{setProps(prev=>{const next=fn(prev);save("hq-props",next);return next;});};

  const updateUnit=(propId,unitId,patch)=>saveProps(prev=>prev.map(p=>p.id!==propId?p:{...p,units:(p.units||[]).map(u=>u.id!==unitId?u:{...u,...patch})}));

  const updateRoom=(propId,unitId,roomId,fn)=>saveProps(prev=>prev.map(p=>p.id!==propId?p:{...p,units:(p.units||[]).map(u=>u.id!==unitId?u:{...u,rooms:(u.rooms||[]).map(r=>r.id!==roomId?r:fn(r))})}));

  const bulkUpdateUnits=(patches)=>saveProps(prev=>{let n=[...prev];patches.forEach(({propId,unitId,patch})=>{n=n.map(p=>p.id!==propId?p:{...p,units:(p.units||[]).map(u=>u.id!==unitId?u:{...u,...patch})});});return n;});

  const bulkUpdateRooms=(patches)=>saveProps(prev=>{let n=[...prev];patches.forEach(({propId,unitId,roomId,fn})=>{n=n.map(p=>p.id!==propId?p:{...p,units:(p.units||[]).map(u=>u.id!==unitId?u:{...u,rooms:(u.rooms||[]).map(r=>r.id!==roomId?r:fn(r))})});});return n;});

  const bulkApplyToSelected=(field,value)=>{
    const patches=[];
    sel.forEach(roomId=>{
      const row=tenantRows.find(r=>r.roomId===roomId);if(!row)return;
      let fn;
      if(field==="rent")fn=r=>({...r,rent:Number(value)});
      else if(field==="moveIn")fn=r=>({...r,tenant:{...r.tenant,moveIn:value}});
      else if(field==="leaseEnd")fn=r=>({...r,le:value});
      else if(field==="m2m")fn=r=>({...r,m2m:true,le:null});
      else if(field==="recurringDueDay")fn=r=>({...r,recurringDueDay:Number(value)});
      else if(field==="lateFeeExempt")fn=r=>({...r,lateConfig:{...(r.lateConfig||{}),enabled:false}});
      else if(field==="occupation")fn=r=>({...r,tenant:{...r.tenant,occupationType:value}});
      else return;
      patches.push({propId:row.propId,unitId:row.unitId,roomId,fn});
    });
    if(patches.length){bulkUpdateRooms(patches);flash(`Updated ${patches.length} tenant${patches.length>1?"s":""}`);}
    setSel([]);
  };

  const toggleSel=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=ids=>setSel(p=>p.length===ids.length?[]:ids.map(r=>r.roomId));

  // ─── Phase 3 actions ─────────────────────────────────────────────
  const markLeasesExecuted=()=>{
    const drafts=leases.filter(l=>l.status==="draft");if(!drafts.length)return;
    confirm("Mark Leases as Executed",`Mark ${drafts.length} draft lease${drafts.length>1?"s":""} as executed (imported)? This cannot be undone.`,async()=>{
      setSaving(true);
      try{const wsId=settings?.workspace_id||null;const ids=[];
        for(const l of drafts){
          const row=tenantRows.find(r=>r.roomId===(l.roomId||l.room_id||l.variable_data?.roomId));if(!row)continue;
          const body={status:"executed",variable_data:{...(l.variable_data||{}),imported:true,LEASE_START:row.tenant.moveIn||"",LEASE_END:row.le||"",MONTHLY_RENT:row.rent||0,SECURITY_DEPOSIT:row.sd||0}};
          if(wsId)body.workspace_id=wsId;
          await supa("lease_instances?id=eq."+l.id,{method:"PATCH",body:JSON.stringify(body),prefer:"return=representation"});
          ids.push(l.id);
        }
        if(ids.length){setLeases(p=>p.map(l=>ids.includes(l.id)?{...l,status:"executed",imported:true}:l));flash(`${ids.length} lease${ids.length>1?"s":""} marked as executed`);}
      }catch(e){console.error(e);flash("Error updating leases");}
      setSaving(false);
    },true);
  };

  const createBalanceForwards=()=>{
    const existing=new Set(charges.filter(c=>c.category==="Balance Forward").map(c=>c.roomId));
    const todo=tenantRows.filter(r=>r.balanceOwed>0&&!existing.has(r.roomId));if(!todo.length)return;
    confirm("Create Balance Forwards",`Create ${todo.length} balance-forward charge${todo.length>1?"s":""}?`,()=>{
      todo.forEach(row=>createCharge({roomId:row.roomId,tenantName:row.tenant.name,propName:row.propName,roomName:row.roomName,category:"Balance Forward",desc:"Balance carried from previous system",amount:row.balanceOwed,dueDate:TODAY.toISOString().split("T")[0],sent:true,sentDate:TODAY.toISOString().split("T")[0],historical:true,noLateFee:true}));
      flash(`${todo.length} balance forward${todo.length>1?"s":""} created`);
    });
  };

  const recordHistoricalDeposits=()=>{
    const sdIds=new Set((sdLedger||[]).map(s=>s.roomId));
    const todo=tenantRows.filter(r=>r.depositPaid&&!sdIds.has(r.roomId));if(!todo.length)return;
    confirm("Record Security Deposits",`Record ${todo.length} deposit${todo.length>1?"s":""} as already collected?`,()=>{
      const entries=todo.map(row=>({id:uid(),roomId:row.roomId,tenantName:row.tenant.name,propName:row.propName,roomName:row.roomName,amountHeld:row.depositAmount||row.rent||0,deposits:[{amount:row.depositAmount||row.rent||0,date:row.tenant.moveIn||TODAY.toISOString().split("T")[0],desc:"Collected in prior system (imported)"}],deductions:[],returned:null,historical:true}));
      const updated=[...(sdLedger||[]),...entries];setSdLedger(updated);save("hq-sdledger",updated);
      flash(`${entries.length} deposit${entries.length>1?"s":""} recorded`);
    });
  };

  const markChargesPaid=(ids)=>{if(!ids.length)return;
    confirm("Mark as Already Paid",`Mark ${ids.length} charge${ids.length>1?"s":""} as paid in your previous system?`,()=>{
      setCharges(prev=>{const u=prev.map(c=>ids.includes(c.id)?{...c,amountPaid:c.amount,payments:[...(c.payments||[]),{id:uid(),amount:c.amount-c.amountPaid,method:"historical",date:TODAY.toISOString().split("T")[0],notes:"Paid in prior system (imported)"}]}:c);save("hq-charges",u);return u;});
      flash(`${ids.length} charge${ids.length>1?"s":""} marked as paid`);
    });
  };

  // ─── Phase 4 actions ─────────────────────────────────────────────
  const generateCharges=()=>{
    const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
    const mo=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
    const has=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate?.startsWith(mk)).map(c=>c.roomId));
    const todo=tenantRows.filter(r=>!has.has(r.roomId)&&r.rent>0);
    if(!todo.length){flash("All charges already generated");return;}
    confirm("Generate Charges",`Generate ${mo} rent charges for ${todo.length} tenant${todo.length>1?"s":""}?`,()=>{
      todo.forEach(row=>{
        const dd=row.recurringDueDay||1;
        let amt=row.rent,desc=`${mo} Rent`;
        if(row.tenant.moveIn){const mi=new Date(row.tenant.moveIn+"T00:00:00");
          if(mi.getMonth()===TODAY.getMonth()&&mi.getFullYear()===TODAY.getFullYear()&&mi.getDate()>dd){
            const cd=new Date(mi.getFullYear(),mi.getMonth()+1,0).getDate();const dl=cd-mi.getDate()+1;
            const dr=Math.ceil(row.rent/30);amt=Math.ceil(dr*dl);desc=`${mo} Rent (prorated ${dl} days)`;
          }}
        createCharge({roomId:row.roomId,tenantName:row.tenant.name,propName:row.propName,roomName:row.roomName,category:"Rent",desc,amount:amt,dueDate:`${mk}-${String(dd).padStart(2,"0")}`,sent:true,sentDate:TODAY.toISOString().split("T")[0]});
      });
      flash(`${todo.length} charge${todo.length>1?"s":""} generated`);
    });
  };

  const[otcForm,setOtcForm]=useState({type:"",amount:"",roomIds:[]});
  const addOneTimeCharges=()=>{
    if(!otcForm.type||!otcForm.amount||!otcForm.roomIds.length)return;
    const amt=Number(otcForm.amount);if(amt<=0)return;
    confirm("Create One-Time Charges",`Create ${otcForm.roomIds.length} ${otcForm.type} charge${otcForm.roomIds.length>1?"s":""} for ${fmtS(amt)} each?`,()=>{
      otcForm.roomIds.forEach(rid=>{const row=tenantRows.find(r=>r.roomId===rid);if(!row)return;
        createCharge({roomId:rid,tenantName:row.tenant.name,propName:row.propName,roomName:row.roomName,category:otcForm.type,desc:otcForm.type,amount:amt,dueDate:TODAY.toISOString().split("T")[0],sent:true,sentDate:TODAY.toISOString().split("T")[0]});
      });
      flash(`${otcForm.roomIds.length} charge${otcForm.roomIds.length>1?"s":""} created`);
      setOtcForm({type:"",amount:"",roomIds:[]});
    });
  };

  // ─── Complete ────────────────────────────────────────────────────
  const completeOnboarding=()=>{
    confirm("Complete Onboarding",`Mark onboarding complete for ${totalTenants} tenants across ${propRows.length} properties?`,()=>{
      const u={...settings,onboardingActive:false,onboardingCompletedAt:TODAY.toISOString()};
      setSettings(u);save("hq-settings",u);
      if(onComplete)onComplete();goTab("dashboard");
    });
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  const accBg=`rgba(${_accRgb},.06)`,accBd=`rgba(${_accRgb},.15)`,accBgS=`rgba(${_accRgb},.12)`;

  const zoom=settings.adminZoom||1;
  const font=settings.adminFont||"inherit";
  return(
  <div style={{maxWidth:1100,margin:"0 auto",position:"relative",transform:zoom!==1?`scale(${zoom})`:"none",transformOrigin:"top left",width:zoom!==1?`${100/zoom}%`:"auto",fontFamily:font}}>
    {toast&&<div style={{position:"fixed",top:16,right:16,zIndex:9999,padding:"10px 18px",borderRadius:8,background:_acc,color:_accContrast,fontSize:13,fontWeight:600,boxShadow:"0 4px 12px rgba(0,0,0,.15)",fontFamily:"inherit"}}>{toast}</div>}

    {/* Phase bar */}
    <div style={{display:"flex",alignItems:"center",gap:0,margin:"0 0 28px",padding:"16px 0 0",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      {PHASES.map((p,i)=>{const st=phaseStatus(p.id),active=phase===p.id;return(
        <div key={p.id} style={{display:"flex",alignItems:"center",flex:1,minWidth:0}}>
          <button onClick={()=>guardedSetPhase(p.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",background:active?accBgS:"transparent",color:active?_acc:st==="done"?_acc:"inherit",opacity:active||st==="done"?1:.45,fontWeight:active?700:500,fontSize:13,fontFamily:"inherit",transition:"all .15s",minHeight:44,minWidth:44,whiteSpace:"nowrap"}}>
            <span style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:st==="done"?_acc:active?accBgS:"rgba(128,128,128,.12)",color:st==="done"?_accContrast:active?_acc:"inherit",fontSize:11,fontWeight:700,flexShrink:0}}>
              {st==="done"?<IcoCheck/>:p.id}
            </span>
            <span>{p.label}</span>
          </button>
          {i<4&&<div style={{flex:1,height:2,background:st==="done"?_acc:"rgba(128,128,128,.15)",margin:"0 4px",borderRadius:1,minWidth:8}}/>}
        </div>);})}
    </div>

    {/* Progress */}
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(128,128,128,.04)",borderRadius:10,marginBottom:24,border:"1px solid rgba(128,128,128,.1)"}}>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Onboarding Progress</div>
        <div style={{height:6,background:"rgba(128,128,128,.1)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(doneCount/5)*100}%`,background:_acc,borderRadius:3,transition:"width .3s"}}/>
        </div>
      </div>
      <div style={{fontSize:12,opacity:.5,fontWeight:500}}>{doneCount} of 5 phases</div>
    </div>

    {/* ═══ PHASE 1 ═══ */}
    {phase===1&&<P1 propRows={propRows} utilTemplates={utilTemplates} sel={sel} setSel={setSel} updateUnit={updateUnit} bulkUpdateUnits={bulkUpdateUnits} lateFeeDefaults={lateFeeDefaults} _acc={_acc} accBg={accBg} accBd={accBd} _red={_red} phase1Done={phase1Done} go={guardedSetPhase} flash={flash} saveProps={saveProps}/>}

    {/* ═══ PHASE 2 ═══ */}
    {phase===2&&<P2 tenantRows={tenantRows} sel={sel} setSel={setSel} toggleSel={toggleSel} toggleAll={toggleAll} expandedId={expandedId} setExpandedId={setExpandedId} bulkApplyToSelected={bulkApplyToSelected} updateRoom={updateRoom} completeTenants={completeTenants} totalTenants={totalTenants} _acc={_acc} _red={_red} _gold={_gold} accBg={accBg} accBd={accBd} TODAY={TODAY} go={guardedSetPhase} flash={flash} setDirtyTenant={setDirtyTenant} lateFeeDefaults={lateFeeDefaults}/>}

    {/* ═══ PHASE 3 ═══ */}
    {phase===3&&<P3 tenantRows={tenantRows} charges={charges} sdLedger={sdLedger} leases={leases} createBalanceForwards={createBalanceForwards} recordHistoricalDeposits={recordHistoricalDeposits} markLeasesExecuted={markLeasesExecuted} markChargesPaid={markChargesPaid} saving={saving} _acc={_acc} _red={_red} _gold={_gold} accBg={accBg} go={guardedSetPhase}/>}

    {/* ═══ PHASE 4 ═══ */}
    {phase===4&&<P4 tenantRows={tenantRows} charges={charges} TODAY={TODAY} generateCharges={generateCharges} phase4Done={phase4Done} otcForm={otcForm} setOtcForm={setOtcForm} addOneTimeCharges={addOneTimeCharges} _acc={_acc} _gold={_gold} go={guardedSetPhase} lateFeeDefaults={lateFeeDefaults} createCharge={createCharge} flash={flash} confirm={confirm}/>}

    {/* ═══ PHASE 5 ═══ */}
    {phase===5&&<P5 propRows={propRows} tenantRows={tenantRows} charges={charges} sdLedger={sdLedger} leases={leases} phase1Done={phase1Done} phase2Done={phase2Done} phase3Done={phase3Done} phase4Done={phase4Done} completeOnboarding={completeOnboarding} TODAY={TODAY} _acc={_acc} _accContrast={_accContrast} _red={_red} _gold={_gold} accBg={accBg} accBd={accBd} completeTenants={completeTenants} totalTenants={totalTenants} lateFeeDefaults={lateFeeDefaults}/>}
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1 — Property Finalization (P1-2, P1-3, P4-1, P4-2 fixes)
// ═══════════════════════════════════════════════════════════════════════
function P1({propRows,utilTemplates,sel,setSel,updateUnit,bulkUpdateUnits,lateFeeDefaults,_acc,accBg,accBd,_red,phase1Done,go,flash,saveProps}){
  const[bulkUtil,setBulkUtil]=useState("");
  const[bulkAction,setBulkAction]=useState("");
  const[bulkVal,setBulkVal]=useState("");
  const[expanded,setExpanded]=useState(null);
  const unitIds=propRows.flatMap(p=>p.units.map(u=>u.id));
  const PROP_TYPES=["SFH","Duplex","Triplex","Fourplex","Townhome","Apartment","ADU","Other"];

  const bulkApplyUtil=()=>{if(!bulkUtil)return;
    const patches=[];sel.forEach(uid=>{const pr=propRows.find(p=>p.units.some(u=>u.id===uid));if(pr)patches.push({propId:pr.id,unitId:uid,patch:{utils:bulkUtil}});});
    if(patches.length){bulkUpdateUnits(patches);flash(`Template applied to ${patches.length} unit${patches.length>1?"s":""}`);}
    setSel([]);setBulkUtil("");
  };

  const bulkApplyPropSetting=()=>{
    if(!bulkAction||!bulkVal)return;
    const propIds=new Set();
    sel.forEach(uid=>{const pr=propRows.find(p=>p.units.some(u=>u.id===uid));if(pr)propIds.add(pr.id);});
    const patch={};
    if(bulkAction==="lateFee")patch.lateFeeInitial=Number(bulkVal);
    else if(bulkAction==="grace")patch.lateFeeGraceDays=Number(bulkVal);
    else if(bulkAction==="daily")patch.lateFeeDaily=Number(bulkVal);
    else if(bulkAction==="dueDay")patch.defaultDueDay=Number(bulkVal);
    else return;
    saveProps(prev=>prev.map(p=>propIds.has(p.id)?{...p,...patch}:p));
    flash(`Applied to ${propIds.size} propert${propIds.size>1?"ies":"y"}`);
    setBulkAction("");setBulkVal("");setSel([]);
  };

  const updateProp=(propId,patch)=>saveProps(prev=>prev.map(p=>p.id!==propId?p:{...p,...patch}));

  return(<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
      <div><h2 style={{fontSize:18,fontWeight:700,margin:0}}>Property Configuration</h2>
        <p style={{fontSize:13,opacity:.45,margin:"4px 0 0"}}>Configure address, type, utilities, late fees, and due dates per property.</p>
      </div>
      {phase1Done&&<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Complete</span>}
    </div>

    {sel.length>0&&(<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:accBg,border:`1px solid ${accBd}`,borderRadius:8,marginBottom:12,flexWrap:"wrap"}}>
      <span style={{fontSize:12,fontWeight:600,color:_acc}}>{sel.length} unit{sel.length>1?"s":""} selected</span>
      <select value={bulkUtil} onChange={e=>setBulkUtil(e.target.value)} style={{...INP,width:"auto",minWidth:160}}><option value="">Set utility template...</option>{utilTemplates.map(t=><option key={t.key} value={t.key}>{t.name}</option>)}</select>
      {bulkUtil&&<button onClick={bulkApplyUtil} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:11,minHeight:44,padding:"0 16px"}}>Apply</button>}
      <select value={bulkAction} onChange={e=>{setBulkAction(e.target.value);setBulkVal("");}} style={{...INP,width:"auto",minWidth:140}}><option value="">More actions...</option><option value="lateFee">Set late fee ($)</option><option value="grace">Set grace days</option><option value="daily">Set daily fee ($)</option><option value="dueDay">Set due day</option></select>
      {bulkAction&&(bulkAction==="dueDay"?<select value={bulkVal} onChange={e=>setBulkVal(e.target.value)} style={{...INP,width:"auto",minWidth:80}}><option value="">Day...</option>{Array.from({length:28},(_,i)=><option key={i+1} value={i+1}>{ord(i+1)}</option>)}</select>:<input type="number" value={bulkVal} onChange={e=>setBulkVal(e.target.value)} placeholder={bulkAction==="grace"?"3":"50"} style={{...INP,width:70}}/>)}
      {bulkAction&&bulkVal&&<button onClick={bulkApplyPropSetting} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:11,minHeight:44,padding:"0 16px"}}>Apply</button>}
      <button onClick={()=>{setSel([]);setBulkUtil("");setBulkAction("");setBulkVal("");}} style={{fontSize:11,opacity:.4,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",minHeight:44}}>Clear</button>
    </div>)}

    {propRows.map(p=>(
    <div key={p.id} style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,overflow:"hidden",marginBottom:12}}>
      {/* Property header — editable address, type, late fee, due date */}
      <div style={{padding:"12px 16px",background:"rgba(128,128,128,.04)",display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
        <div style={{flex:2,minWidth:180}}>
          <label style={{fontSize:10,fontWeight:600,opacity:.4,display:"block",marginBottom:3}}>Address</label>
          <input value={p.addr||p.name||""} onChange={e=>updateProp(p.id,{addr:e.target.value})} style={{...INP,fontWeight:600}}/>
        </div>
        <div style={{minWidth:120}}>
          <label style={{fontSize:10,fontWeight:600,opacity:.4,display:"block",marginBottom:3}}>Type</label>
          <select value={p.type||""} onChange={e=>updateProp(p.id,{type:e.target.value})} style={{...INP,border:p.type?INP.border:`1.5px solid ${_red}`}}>
            <option value="">Select...</option>{PROP_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{minWidth:100}}>
          <label style={{fontSize:10,fontWeight:600,opacity:.4,display:"block",marginBottom:3}}>Default Due Day</label>
          <select value={p.defaultDueDay||""} onChange={e=>updateProp(p.id,{defaultDueDay:Number(e.target.value)||null})} style={INP}>
            <option value="">1st</option>{Array.from({length:28},(_,i)=><option key={i+1} value={i+1}>{ord(i+1)}</option>)}
          </select>
        </div>
        <div style={{minWidth:90}}>
          <label style={{fontSize:10,fontWeight:600,opacity:.4,display:"block",marginBottom:3}}>Late Fee ($)</label>
          <input type="number" value={p.lateFeeInitial??""} onChange={e=>updateProp(p.id,{lateFeeInitial:e.target.value?Number(e.target.value):null})} placeholder={String(lateFeeDefaults.amount)} style={INP}/>
        </div>
        <div style={{minWidth:80}}>
          <label style={{fontSize:10,fontWeight:600,opacity:.4,display:"block",marginBottom:3}}>Grace Days</label>
          <input type="number" value={p.lateFeeGraceDays??""} onChange={e=>updateProp(p.id,{lateFeeGraceDays:e.target.value?Number(e.target.value):null})} placeholder={String(lateFeeDefaults.grace)} style={INP}/>
        </div>
        <div style={{minWidth:80}}>
          <label style={{fontSize:10,fontWeight:600,opacity:.4,display:"block",marginBottom:3}}>Daily ($)</label>
          <input type="number" value={p.lateFeeDaily??""} onChange={e=>updateProp(p.id,{lateFeeDaily:e.target.value?Number(e.target.value):null})} placeholder={String(lateFeeDefaults.daily)} style={INP}/>
        </div>
      </div>

      {/* Unit table */}
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:600}}>
        <thead><tr style={{background:"rgba(128,128,128,.02)"}}>
          <th style={{...TH,width:44}}></th>
          <th style={TH}>Unit</th><th style={TH}>Mode</th><th style={TH}>Rooms</th><th style={TH}>Utility Template</th><th style={{...TH,width:44}}></th>
        </tr></thead>
        <tbody>{p.units.map(u=>{
          const isExp=expanded===u.id,hasUtil=!!u.utils;
          return[
          <tr key={u.id} style={{borderTop:"1px solid rgba(128,128,128,.08)"}}>
            <td style={TD}><input type="checkbox" checked={sel.includes(u.id)} onChange={()=>setSel(p2=>p2.includes(u.id)?p2.filter(x=>x!==u.id):[...p2,u.id])} style={{width:18,height:18}}/></td>
            <td style={{...TD,fontWeight:500}}>{u.name||"Main"}</td>
            <td style={TD}><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:"rgba(128,128,128,.08)"}}>{(u.rentalMode||"byRoom")==="wholeHouse"?"Whole Unit":"By Room"}</span></td>
            <td style={TD}>{(u.rooms||[]).length}</td>
            <td style={TD}>
              <select value={u.utils||""} onChange={e=>updateUnit(p.id,u.id,{utils:e.target.value})} style={{...INP,width:"auto",minWidth:160,border:hasUtil?INP.border:`1.5px solid ${_red}`,background:hasUtil?"":"rgba(196,92,74,.04)"}}>
                <option value="">Select template...</option>{utilTemplates.map(t=><option key={t.key} value={t.key}>{t.name}</option>)}
              </select>
            </td>
            <td style={TD}><button onClick={()=>setExpanded(isExp?null:u.id)} style={{background:"none",border:"none",cursor:"pointer",minHeight:44,minWidth:44,display:"flex",alignItems:"center",justifyContent:"center"}}><IcoExpand open={isExp}/></button></td>
          </tr>,
          isExp&&(u.rooms||[]).map(r=>(
            <tr key={r.id} style={{background:"rgba(128,128,128,.03)",borderTop:"1px solid rgba(128,128,128,.04)"}}>
              <td style={TD}></td>
              <td style={{...TD,paddingLeft:16,opacity:.6,fontSize:12}}>{r.name}</td>
              <td style={{...TD,fontSize:12,opacity:.6}}>{r.st==="occupied"?r.tenant?.name||"Occupied":"Vacant"}</td>
              <td style={{...TD,fontSize:12}}>{r.rent?fmtS(r.rent):"\u2014"}</td>
              <td style={{...TD,fontSize:12,opacity:.6}}>{r.utils?UTIL_LABELS[r.utils]||r.utils:"Inherits unit"}</td>
              <td style={TD}></td>
            </tr>))];
        })}</tbody>
      </table></div>
    </div>))}

    <div style={{display:"flex",justifyContent:"flex-end",marginTop:20}}>
      <button onClick={()=>go(2)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13,minHeight:44}}>Tenants <IcoArrow/></button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 2 — Tenant Finalization
// ═══════════════════════════════════════════════════════════════════════
function P2({tenantRows,sel,setSel,toggleSel,toggleAll,expandedId,setExpandedId,bulkApplyToSelected,updateRoom,completeTenants,totalTenants,_acc,_red,_gold,accBg,accBd,TODAY,go,flash,setDirtyTenant,lateFeeDefaults}){
  const[filter,setFilter]=useState("all");
  const[bulkVal,setBulkVal]=useState("");
  const[bulkType,setBulkType]=useState("");

  const filtered=useMemo(()=>{
    if(filter==="incomplete")return tenantRows.filter(r=>!r.complete);
    if(filter==="expired")return tenantRows.filter(r=>r.isExpired);
    if(filter==="missing-email")return tenantRows.filter(r=>!r.tenant.email);
    if(filter==="missing-rent")return tenantRows.filter(r=>!r.rent);
    if(filter==="missing-phone")return tenantRows.filter(r=>!r.hasPhone);
    return tenantRows;
  },[tenantRows,filter]);

  const ct={inc:tenantRows.filter(r=>!r.complete).length,exp:tenantRows.filter(r=>r.isExpired).length,noE:tenantRows.filter(r=>!r.tenant.email).length,noR:tenantRows.filter(r=>!r.rent).length,noP:tenantRows.filter(r=>!r.hasPhone).length};

  return(<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8}}>
      <div><h2 style={{fontSize:18,fontWeight:700,margin:0}}>Tenant Finalization</h2>
        <p style={{fontSize:13,opacity:.45,margin:"4px 0 0"}}>Review and complete tenant profiles. {completeTenants} of {totalTenants} ready.</p></div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:80,height:6,background:"rgba(128,128,128,.1)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${totalTenants?(completeTenants/totalTenants)*100:0}%`,background:completeTenants===totalTenants?_acc:_gold,borderRadius:3,transition:"width .3s"}}/>
        </div>
        <span style={{fontSize:12,fontWeight:600,color:completeTenants===totalTenants?_acc:"inherit",opacity:completeTenants===totalTenants?1:.5}}>{completeTenants}/{totalTenants}</span>
      </div>
    </div>

    {ct.exp>0&&(<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.15)",borderRadius:8,marginBottom:12,flexWrap:"wrap"}}>
      <span style={{color:_red}}><IcoWarn/></span>
      <span style={{fontSize:12,color:_red,fontWeight:500}}>{ct.exp} tenant{ct.exp>1?"s":""} with expired leases{"\u2014"}consider flagging as month-to-month</span>
      <button onClick={()=>setFilter("expired")} style={{fontSize:11,color:_red,fontWeight:600,background:"none",border:"none",cursor:"pointer",marginLeft:"auto",fontFamily:"inherit",minHeight:44}}>Show</button>
    </div>)}

    <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
      {[["all",`All (${totalTenants})`],["incomplete",`Incomplete (${ct.inc})`],["expired",`Expired (${ct.exp})`],["missing-email",`No Email (${ct.noE})`],["missing-rent",`No Rent (${ct.noR})`],["missing-phone",`No Phone (${ct.noP})`]].map(([k,l])=>(
        <button key={k} onClick={()=>setFilter(k)} style={{fontSize:11,padding:"8px 14px",borderRadius:6,border:"1px solid",fontFamily:"inherit",cursor:"pointer",fontWeight:filter===k?600:400,borderColor:filter===k?_acc:"rgba(128,128,128,.15)",color:filter===k?_acc:"inherit",opacity:filter===k?1:.5,background:filter===k?accBg:"transparent",minHeight:36}}>{l}</button>
      ))}
    </div>

    {sel.length>0&&(<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:accBg,border:`1px solid ${accBd}`,borderRadius:8,marginBottom:12,flexWrap:"wrap"}}>
      <span style={{fontSize:12,fontWeight:600,color:_acc}}>{sel.length} selected</span>
      <select value={bulkType} onChange={e=>{setBulkType(e.target.value);setBulkVal("");}} style={{...INP,width:"auto"}}><option value="">Bulk action...</option><option value="rent">Set rent</option><option value="moveIn">Set move-in date</option><option value="leaseEnd">Set lease end</option><option value="recurringDueDay">Set due day</option><option value="m2m">Flag as month-to-month</option><option value="lateFeeExempt">Exempt from late fees</option><option value="occupation">Set occupation</option></select>
      {bulkType&&bulkType!=="m2m"&&bulkType!=="lateFeeExempt"&&(
        bulkType==="recurringDueDay"?<select value={bulkVal} onChange={e=>setBulkVal(e.target.value)} style={{...INP,width:"auto"}}><option value="">Day...</option>{Array.from({length:28},(_,i)=><option key={i+1} value={i+1}>{ord(i+1)}</option>)}</select>
        :bulkType==="occupation"?<select value={bulkVal} onChange={e=>setBulkVal(e.target.value)} style={{...INP,width:"auto"}}><option value="">Type...</option>{OCC_TYPES.map(o=><option key={o} value={o}>{o}</option>)}</select>
        :<input type={bulkType==="rent"?"number":"date"} value={bulkVal} onChange={e=>setBulkVal(e.target.value)} placeholder={bulkType==="rent"?"Amount":""} style={{...INP,width:bulkType==="rent"?100:150}}/>
      )}
      {(bulkType==="m2m"||bulkType==="lateFeeExempt"||bulkVal)&&<button onClick={()=>{bulkApplyToSelected(bulkType,bulkVal);setBulkType("");setBulkVal("");}} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:11,minHeight:44,padding:"0 16px"}}>Apply to {sel.length}</button>}
      <button onClick={()=>{setSel([]);setBulkType("");setBulkVal("");}} style={{fontSize:11,opacity:.4,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",marginLeft:"auto",minHeight:44}}>Clear</button>
    </div>)}

    <div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,overflow:"hidden"}}>
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:700}}>
        <thead><tr style={{background:"rgba(128,128,128,.04)"}}>
          <th style={{...TH,width:44}}><input type="checkbox" checked={sel.length===filtered.length&&filtered.length>0} onChange={()=>toggleAll(filtered)} style={{width:18,height:18}}/></th>
          <th style={TH}>Tenant</th><th style={TH}>Property</th><th style={TH}>Room</th><th style={TH}>Rent</th><th style={TH}>Move-in</th><th style={TH}>Lease End</th><th style={TH}>Status</th><th style={{...TH,width:44}}></th>
        </tr></thead>
        <tbody>
          {filtered.map(row=>{const isExp=expandedId===row.roomId;return[
            <tr key={row.roomId} className="ob-row-hover" style={{borderTop:"1px solid rgba(128,128,128,.08)",cursor:"pointer",background:isExp?"rgba(128,128,128,.03)":"transparent"}} onClick={()=>setExpandedId(isExp?null:row.roomId)}>
              <td style={TD} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={sel.includes(row.roomId)} onChange={()=>toggleSel(row.roomId)} style={{width:18,height:18}}/></td>
              <td style={{...TD,fontWeight:600}}>{row.tenant.name||"\u2014"}{row.coTenants?.length?<span style={{fontSize:10,opacity:.4,marginLeft:4}}>+{row.coTenants.length}</span>:null}</td>
              <td style={{...TD,fontSize:12}}>{row.propName}</td>
              <td style={{...TD,fontSize:12}}>{row.roomName}</td>
              <td style={TD}>{row.rent?fmtS(row.rent):"\u2014"}</td>
              <td style={{...TD,fontSize:12}}>{fmtD(row.tenant.moveIn)}</td>
              <td style={{...TD,fontSize:12}}>{row.m2m?<span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:`rgba(${hexRgb(_gold)},.15)`,color:_gold,fontWeight:600}}>M2M</span>:fmtD(row.le)}</td>
              <td style={TD}>{row.complete?<span style={{fontSize:11,color:_acc,fontWeight:600,display:"flex",alignItems:"center",gap:3}}><IcoCheck/> Ready</span>:row.isExpired?<span style={{fontSize:11,color:_red,fontWeight:500}}>Expired</span>:<span style={{fontSize:11,opacity:.4}}>Missing: {row.missing.join(", ")}</span>}</td>
              <td style={TD}><IcoExpand open={isExp}/></td>
            </tr>,
            isExp&&<tr key={row.roomId+"-exp"}><td colSpan={9} style={{padding:0}}>
              <TenantDetail row={row} updateRoom={updateRoom} _acc={_acc} _red={_red} _gold={_gold} TODAY={TODAY} flash={flash} setDirtyTenant={setDirtyTenant} lateFeeDefaults={lateFeeDefaults}/>
            </td></tr>];
          })}
          {filtered.length===0&&<tr><td colSpan={9} style={{...TD,textAlign:"center",opacity:.35,padding:24}}>No tenants match this filter</td></tr>}
        </tbody>
      </table></div>
    </div>

    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>go(1)} className="btn btn-out" style={{fontSize:13,minHeight:44}}>Back</button>
      <button onClick={()=>go(3)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13,minHeight:44}}>Historical Data <IcoArrow/></button>
    </div>
  </div>);
}

// ─── Tenant Detail ──────────────────────────────────────────────────
function TenantDetail({row,updateRoom,_acc,_red,_gold,TODAY,flash,setDirtyTenant,lateFeeDefaults}){
  const[f,setF]=useState({
    name:row.tenant.name||"",email:row.tenant.email||"",phone:row.tenant.phone||"",moveIn:row.tenant.moveIn||"",occupation:row.tenant.occupationType||"",doorCode:row.doorCode||"",
    rent:row.rent||"",le:row.le||"",m2m:row.m2m,recurringDueDay:row.recurringDueDay||"",
    lateFeeExempt:row.lateConfig?!row.lateConfig.enabled:false,
    coSignerName:row.coSigner?.name||"",coSignerPhone:row.coSigner?.phone||"",coSignerEmail:row.coSigner?.email||"",coSignerRelation:row.coSigner?.relation||"",
    paymentPlanActive:row.paymentPlan?.active||false,paymentPlanNotes:row.paymentPlan?.notes||"",paymentPlanAmount:row.paymentPlan?.amount||"",paymentPlanFreq:row.paymentPlan?.frequency||"monthly",paymentPlanCount:row.paymentPlan?.count||"",
  });
  const[errs,setErrs]=useState({});
  const[dirty,setDirty]=useState(false);

  const set=(k,v)=>{setF(p=>({...p,[k]:v}));setDirty(true);setDirtyTenant(true);setErrs(e=>({...e,[k]:undefined}));};

  const validate=()=>{
    const e={};
    if(!f.name.trim())e.name="Name is required";
    if(f.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))e.email="Invalid email format";
    if(f.doorCode&&!/^\d{4}$/.test(f.doorCode))e.doorCode="Must be exactly 4 digits";
    if(f.rent&&Number(f.rent)<=0)e.rent="Rent must be greater than zero";
    setErrs(e);
    if(Object.keys(e).length>0){const el=document.querySelector(".ob-tenant-detail");if(el){el.style.animation="none";el.offsetHeight;el.style.animation="shake .4s ease";}}
    return Object.keys(e).length===0;
  };

  const doSave=()=>{
    if(!validate())return;
    updateRoom(row.propId,row.unitId,row.roomId,r=>({...r,
      rent:Number(f.rent)||r.rent,le:f.m2m?null:f.le,m2m:f.m2m,
      recurringDueDay:f.recurringDueDay?Number(f.recurringDueDay):null,
      lateConfig:{...(r.lateConfig||{}),enabled:!f.lateFeeExempt},
      paymentPlan:f.paymentPlanActive?{active:true,notes:f.paymentPlanNotes,amount:Number(f.paymentPlanAmount)||null,frequency:f.paymentPlanFreq||"monthly",count:Number(f.paymentPlanCount)||null}:null,
      tenant:{...r.tenant,name:f.name,email:f.email,phone:f.phone,moveIn:f.moveIn,occupationType:f.occupation,doorCode:f.doorCode,
        coSigner:f.coSignerName?{name:f.coSignerName,phone:f.coSignerPhone,email:f.coSignerEmail,relation:f.coSignerRelation}:null},
    }));
    setDirty(false);setDirtyTenant(false);flash("Saved");
  };

  const fld=(label,key,type="text",opts={})=>{const hasErr=!!errs[key];return(
    <div style={{flex:opts.flex||1,minWidth:opts.minWidth||120}}>
      <label style={{fontSize:11,fontWeight:500,opacity:.45,marginBottom:3,display:"block"}}>{label}</label>
      {type==="select"
        ?<select value={f[key]} onChange={e=>set(key,e.target.value)} style={{...INP,border:hasErr?`1.5px solid ${_red}`:INP.border}}><option value="">{opts.placeholder||"Select..."}</option>{(opts.options||[]).map(o=><option key={o} value={o}>{o}</option>)}</select>
        :<input type={type} value={f[key]} onChange={e=>set(key,e.target.value)} placeholder={opts.placeholder||""} style={{...INP,border:hasErr?`1.5px solid ${_red}`:INP.border}}/>}
      {hasErr&&<div style={{fontSize:11,color:_red,marginTop:2,fontWeight:500}}>{errs[key]}</div>}
    </div>);};

  return(
  <div className="ob-tenant-detail" style={{padding:"16px 20px 20px",background:"rgba(128,128,128,.03)",borderTop:"1px solid rgba(128,128,128,.06)"}}>
    {dirty&&<div style={{fontSize:11,color:_gold,fontWeight:500,marginBottom:8}}>Unsaved changes</div>}
    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:14}}>
      {fld("Name","name")}{fld("Email","email","email")}{fld("Phone","phone","tel")}{fld("Occupation","occupation","select",{options:OCC_TYPES})}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:14}}>
      {fld("Monthly Rent","rent","number",{minWidth:100})}{fld("Door Code (4-digit)","doorCode","text",{minWidth:100})}{fld("Move-in Date","moveIn","date")}
      {!f.m2m&&fld("Lease End","le","date")}
      <div style={{flex:1,minWidth:100,display:"flex",alignItems:"flex-end",gap:8}}>
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",paddingBottom:6,minHeight:44}}>
          <input type="checkbox" checked={f.m2m} onChange={e=>set("m2m",e.target.checked)} style={{width:18,height:18}}/> Month-to-month
        </label>
      </div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:14}}>
      <div style={{flex:1,minWidth:120}}>
        <label style={{fontSize:11,fontWeight:500,opacity:.45,marginBottom:3,display:"block"}}>Rent Due Day</label>
        <select value={f.recurringDueDay} onChange={e=>set("recurringDueDay",e.target.value)} style={INP}><option value="">1st (default)</option>{Array.from({length:28},(_,i)=><option key={i+1} value={i+1}>{ord(i+1)}</option>)}</select>
      </div>
      <div style={{flex:1,minWidth:200,display:"flex",alignItems:"flex-end",gap:12,paddingBottom:2}}>
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",minHeight:44}}>
          <input type="checkbox" checked={f.lateFeeExempt} onChange={e=>set("lateFeeExempt",e.target.checked)} style={{width:18,height:18}}/> Late fee exempt
        </label>
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",minHeight:44}}>
          <input type="checkbox" checked={f.paymentPlanActive} onChange={e=>set("paymentPlanActive",e.target.checked)} style={{width:18,height:18}}/> Payment plan
        </label>
      </div>
    </div>
    {!f.lateFeeExempt&&<div style={{fontSize:11,opacity:.35,marginBottom:14}}>Late fee: {fmtS(lateFeeDefaults.amount)} after {ord(lateFeeDefaults.grace)} day, +{fmtS(lateFeeDefaults.daily)}/day (change in PM Settings)</div>}
    {f.paymentPlanActive&&<div style={{marginBottom:14,padding:12,background:"rgba(128,128,128,.04)",borderRadius:8,border:"1px solid rgba(128,128,128,.1)"}}>
      <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Payment Plan Details</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:10}}>
        <div style={{flex:1,minWidth:100}}><label style={{fontSize:10,opacity:.45,display:"block",marginBottom:3}}>Amount per Payment</label><input type="number" value={f.paymentPlanAmount} onChange={e=>set("paymentPlanAmount",e.target.value)} placeholder="e.g. 200" style={INP}/></div>
        <div style={{flex:1,minWidth:120}}><label style={{fontSize:10,opacity:.45,display:"block",marginBottom:3}}>Frequency</label><select value={f.paymentPlanFreq} onChange={e=>set("paymentPlanFreq",e.target.value)} style={INP}><option value="weekly">Weekly</option><option value="biweekly">Bi-weekly</option><option value="monthly">Monthly</option></select></div>
        <div style={{flex:1,minWidth:100}}><label style={{fontSize:10,opacity:.45,display:"block",marginBottom:3}}>Number of Payments</label><input type="number" value={f.paymentPlanCount} onChange={e=>set("paymentPlanCount",e.target.value)} placeholder="e.g. 6" style={INP}/></div>
      </div>
      <div><label style={{fontSize:10,opacity:.45,display:"block",marginBottom:3}}>Notes</label><input type="text" value={f.paymentPlanNotes} onChange={e=>set("paymentPlanNotes",e.target.value)} placeholder="e.g. Approved by PM on 4/1, no late fees during plan" style={{...INP,width:"100%"}}/></div>
      <div style={{fontSize:10,opacity:.35,marginTop:6}}>Late fees auto-disabled while payment plan is active</div>
    </div>}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:12,fontWeight:600,opacity:.6,marginBottom:8}}>Co-Signer</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        {fld("Name","coSignerName","text",{placeholder:"Full name"})}{fld("Phone","coSignerPhone","tel")}{fld("Email","coSignerEmail","email")}{fld("Relation","coSignerRelation","select",{options:["Parent","Spouse","Sibling","Employer","Other"]})}
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
      <button onClick={doSave} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44,padding:"0 20px"}}>Save Changes</button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 3 — Historical Data
// ═══════════════════════════════════════════════════════════════════════
function P3({tenantRows,charges,sdLedger,leases,createBalanceForwards,recordHistoricalDeposits,markLeasesExecuted,markChargesPaid,saving,_acc,_red,_gold,accBg,go}){
  const needsBal=tenantRows.filter(r=>r.balanceOwed>0);
  const hasBal=charges.some(c=>c.category==="Balance Forward");
  const needsDep=tenantRows.filter(r=>r.depositPaid);
  const sdIds=new Set((sdLedger||[]).map(s=>s.roomId));
  const depDone=needsDep.length===0||needsDep.every(r=>sdIds.has(r.roomId));
  const drafts=leases.filter(l=>l.status==="draft");
  const imported=leases.filter(l=>l.status==="executed"&&l.imported);
  const unpaid=charges.filter(c=>(c.category==="Rent"||c.category==="Security Deposit")&&c.amountPaid<c.amount&&!c.historical);
  const[selCh,setSelCh]=useState([]);
  const noHist=!needsBal.length&&!needsDep.length&&!drafts.length&&!unpaid.length;

  const section=(title,desc,content)=><div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,padding:16,marginBottom:16}}>{content}</div>;

  return(<div>
    <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 4px"}}>Historical Data Import</h2>
    <p style={{fontSize:13,opacity:.45,margin:"0 0 20px"}}>Record pre-existing deposits, balances, and leases from your previous system</p>

    {noHist&&<div style={{padding:"32px 20px",textAlign:"center",background:"rgba(128,128,128,.04)",borderRadius:10,marginBottom:20}}><div style={{fontSize:14,opacity:.5,marginBottom:4}}>No historical data to import</div><div style={{fontSize:12,opacity:.35}}>All imported tenants appear to be new{"\u2014"}skip to charges</div></div>}

    {needsDep.length>0&&section("Deposits","",<div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div><div style={{fontSize:14,fontWeight:600}}>Security Deposits</div><div style={{fontSize:12,opacity:.4}}>{needsDep.length} tenant{needsDep.length>1?"s":""} with deposits from prior system</div></div>
        {depDone?<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Recorded</span>:<button onClick={recordHistoricalDeposits} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44}}>Record All Deposits</button>}
      </div>
      <div style={{fontSize:12,opacity:.5,background:"rgba(128,128,128,.04)",padding:"8px 12px",borderRadius:6}}>{needsDep.map(r=><div key={r.roomId} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(128,128,128,.06)"}}><span>{r.tenant.name}</span><span style={{fontWeight:500}}>{fmtS(r.depositAmount||r.rent)}</span></div>)}</div>
    </div>)}

    {needsBal.length>0&&section("Balances","",<div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div><div style={{fontSize:14,fontWeight:600}}>Outstanding Balances</div><div style={{fontSize:12,opacity:.4}}>{needsBal.length} tenant{needsBal.length>1?"s":""} with balances from prior system</div></div>
        {hasBal?<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Recorded</span>:<button onClick={createBalanceForwards} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44}}>Create Balance Forwards</button>}
      </div>
      <div style={{fontSize:12,opacity:.5,background:"rgba(128,128,128,.04)",padding:"8px 12px",borderRadius:6}}>{needsBal.map(r=><div key={r.roomId} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(128,128,128,.06)"}}><span>{r.tenant.name}</span><span style={{fontWeight:500,color:_red}}>{fmtS(r.balanceOwed)}</span></div>)}</div>
    </div>)}

    {drafts.length>0&&section("Leases","",<div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div><div style={{fontSize:14,fontWeight:600}}>Existing Leases</div><div style={{fontSize:12,opacity:.4}}>{drafts.length} draft lease{drafts.length>1?"s":""} from import{"\u2014"}mark as already executed</div></div>
        <button onClick={markLeasesExecuted} disabled={saving} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,opacity:saving?.6:1,minHeight:44}}>{saving?"Updating...":"Mark All as Executed"}</button>
      </div>
      <div style={{fontSize:11,opacity:.4,background:`rgba(${hexRgb(_gold)},.1)`,padding:"8px 12px",borderRadius:6}}>These leases will be marked as &ldquo;Executed (Imported)&rdquo; without requiring signatures.</div>
    </div>)}

    {imported.length>0&&<div style={{padding:"10px 14px",background:accBg,borderRadius:8,marginBottom:16,fontSize:12,color:_acc,fontWeight:500,display:"flex",alignItems:"center",gap:6}}><IcoCheck/> {imported.length} lease{imported.length>1?"s":""} marked as imported</div>}

    {unpaid.length>0&&section("Payments","",<div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div><div style={{fontSize:14,fontWeight:600}}>Pre-Existing Payments</div><div style={{fontSize:12,opacity:.4}}>Mark charges that were already paid in your old system</div></div>
        {selCh.length>0&&<button onClick={()=>{markChargesPaid(selCh);setSelCh([]);}} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44}}>Mark {selCh.length} as Paid</button>}
      </div>
      <div style={{fontSize:12,background:"rgba(128,128,128,.04)",padding:"8px 12px",borderRadius:6,maxHeight:200,overflowY:"auto"}}>{unpaid.map(c=>(
        <label key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid rgba(128,128,128,.06)",cursor:"pointer",minHeight:36}}>
          <input type="checkbox" checked={selCh.includes(c.id)} onChange={e=>setSelCh(p=>e.target.checked?[...p,c.id]:p.filter(x=>x!==c.id))} style={{width:18,height:18}}/>
          <span style={{flex:1}}>{c.tenantName} {"\u2014"} {c.category}</span><span style={{fontWeight:500}}>{fmtS(c.amount)}</span><span style={{fontSize:11,opacity:.4}}>{c.dueDate}</span>
        </label>))}</div>
    </div>)}

    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>go(2)} className="btn btn-out" style={{fontSize:13,minHeight:44}}>Back</button>
      <button onClick={()=>go(4)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13,minHeight:44}}>Charges <IcoArrow/></button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 4 — Charges
// ═══════════════════════════════════════════════════════════════════════
function P4({tenantRows,charges,TODAY,generateCharges,phase4Done,otcForm,setOtcForm,addOneTimeCharges,_acc,_gold,go,lateFeeDefaults,createCharge,flash,confirm}){
  const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
  const mo=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
  const has=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate?.startsWith(mk)).map(c=>c.roomId));
  const preview=tenantRows.filter(r=>r.rent>0).map(row=>{
    const dd=row.recurringDueDay||1;let amt=row.rent,pro=false,days=0;
    if(row.tenant.moveIn){const mi=new Date(row.tenant.moveIn+"T00:00:00");
      if(mi.getMonth()===TODAY.getMonth()&&mi.getFullYear()===TODAY.getFullYear()&&mi.getDate()>dd){
        const cd=new Date(mi.getFullYear(),mi.getMonth()+1,0).getDate();days=cd-mi.getDate()+1;
        amt=Math.ceil(Math.ceil(row.rent/30)*days);pro=true;
      }}
    return{...row,dueDay:dd,chargeAmount:amt,prorated:pro,days,exists:has.has(row.roomId)};
  });
  const exempt=tenantRows.filter(r=>r.lateConfig&&!r.lateConfig.enabled);

  return(<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:8}}>
      <div><h2 style={{fontSize:18,fontWeight:700,margin:0}}>Charge Generation</h2><p style={{fontSize:13,opacity:.45,margin:"4px 0 0"}}>{mo} rent charges for all active tenants</p></div>
      {phase4Done?<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Generated</span>:<button onClick={generateCharges} className="btn" style={{background:_acc,color:"#fff",fontSize:13,minHeight:44}}>Generate All Charges</button>}
    </div>

    <div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,overflow:"hidden",marginTop:16}}><div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:600}}>
        <thead><tr style={{background:"rgba(128,128,128,.04)"}}><th style={TH}>Tenant</th><th style={TH}>Property</th><th style={TH}>Rent</th><th style={TH}>Due Day</th><th style={TH}>Amount</th><th style={TH}>Prorated</th><th style={TH}>Status</th></tr></thead>
        <tbody>{preview.map(r=><tr key={r.roomId} style={{borderTop:"1px solid rgba(128,128,128,.08)"}}>
          <td style={{...TD,fontWeight:500}}>{r.tenant.name}</td><td style={{...TD,fontSize:12}}>{r.propName}</td><td style={TD}>{fmtS(r.rent)}</td><td style={TD}>{ord(r.dueDay)}</td><td style={{...TD,fontWeight:600}}>{fmtS(r.chargeAmount)}</td>
          <td style={TD}>{r.prorated?<span style={{fontSize:11,color:_gold}}>{r.days} days</span>:"\u2014"}</td>
          <td style={TD}>{r.exists?<span style={{fontSize:11,color:_acc,fontWeight:500,display:"flex",alignItems:"center",gap:3}}><IcoCheck/> Created</span>:<span style={{fontSize:11,opacity:.35}}>Pending</span>}</td>
        </tr>)}{preview.length===0&&<tr><td colSpan={7} style={{...TD,textAlign:"center",opacity:.35,padding:24}}>No tenants with rent amounts set</td></tr>}</tbody>
      </table></div></div>

    <div style={{marginTop:16,padding:16,background:"rgba(128,128,128,.04)",borderRadius:10,border:"1px solid rgba(128,128,128,.08)"}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Late Fee Configuration</div>
      <div style={{fontSize:12,opacity:.6}}>
        <div>Default: {fmtS(lateFeeDefaults.amount)} after {ord(lateFeeDefaults.grace)} day, +{fmtS(lateFeeDefaults.daily)}/day</div>
        {exempt.length>0&&<div style={{marginTop:4,color:_gold}}>Exempt: {exempt.map(r=>r.tenant.name).join(", ")}</div>}
      </div>
    </div>

    <div style={{marginTop:16,padding:16,background:"rgba(128,128,128,.04)",borderRadius:10,border:"1px solid rgba(128,128,128,.08)"}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>One-Time Charges</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
        <div><label style={{fontSize:11,opacity:.45,display:"block",marginBottom:3}}>Type</label><select value={otcForm.type} onChange={e=>setOtcForm(f=>({...f,type:e.target.value}))} style={{...INP,width:"auto",minWidth:140}}><option value="">Select...</option>{OTC_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div><label style={{fontSize:11,opacity:.45,display:"block",marginBottom:3}}>Amount</label><input type="number" value={otcForm.amount} onChange={e=>setOtcForm(f=>({...f,amount:e.target.value}))} placeholder="$" style={{...INP,width:90}}/></div>
        <div><label style={{fontSize:11,opacity:.45,display:"block",marginBottom:3}}>Apply to</label><select value="" onChange={e=>{if(e.target.value)setOtcForm(f=>({...f,roomIds:[...new Set([...f.roomIds,e.target.value])]}));}} style={{...INP,width:"auto",minWidth:160}}><option value="">Add tenant...</option>{tenantRows.map(r=><option key={r.roomId} value={r.roomId}>{r.tenant.name}</option>)}</select></div>
        {otcForm.roomIds.length>0&&<button onClick={addOneTimeCharges} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44}}>Create {otcForm.roomIds.length} charge{otcForm.roomIds.length>1?"s":""}</button>}
      </div>
      {otcForm.roomIds.length>0&&<div style={{marginTop:8,fontSize:12,opacity:.5}}>{otcForm.roomIds.map(rid=>{const r=tenantRows.find(x=>x.roomId===rid);return r?r.tenant.name:"";}).filter(Boolean).join(", ")} <button onClick={()=>setOtcForm(f=>({...f,roomIds:[]}))} style={{marginLeft:8,fontSize:11,opacity:.4,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>clear</button></div>}
    </div>

    {/* Prior-month charge generation */}
    {(()=>{
      const tenantsWithHistory=tenantRows.filter(r=>{if(!r.tenant.moveIn||!r.rent)return false;const mi=new Date(r.tenant.moveIn+"T00:00:00");return mi<new Date(TODAY.getFullYear(),TODAY.getMonth(),1);});
      if(!tenantsWithHistory.length)return null;
      return(
      <div style={{marginTop:16,padding:16,background:"rgba(128,128,128,.04)",borderRadius:10,border:"1px solid rgba(128,128,128,.08)"}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Back-Rent Generation</div>
        <div style={{fontSize:12,opacity:.5,marginBottom:12}}>{tenantsWithHistory.length} tenant{tenantsWithHistory.length>1?"s":""} moved in before this month. Generate charges for missed months.</div>
        <button onClick={()=>{
          let count=0;
          tenantsWithHistory.forEach(row=>{
            const mi=new Date(row.tenant.moveIn+"T00:00:00");const dd=row.recurringDueDay||1;
            let cur=new Date(mi.getFullYear(),mi.getMonth(),1);
            const thisMonth=new Date(TODAY.getFullYear(),TODAY.getMonth(),1);
            while(cur<thisMonth){
              const mmk=`${cur.getFullYear()}-${(cur.getMonth()+1).toString().padStart(2,"0")}`;
              const moLabel=cur.toLocaleString("default",{month:"long",year:"numeric"});
              const exists=charges.some(c=>c.category==="Rent"&&c.roomId===row.roomId&&c.dueDate?.startsWith(mmk));
              if(!exists){createCharge({roomId:row.roomId,tenantName:row.tenant.name,propName:row.propName,roomName:row.roomName,category:"Rent",desc:`${moLabel} Rent`,amount:row.rent,dueDate:`${mmk}-${String(dd).padStart(2,"0")}`,sent:true,sentDate:TODAY.toISOString().split("T")[0],historical:true,noLateFee:true});count++;}
              cur=new Date(cur.getFullYear(),cur.getMonth()+1,1);
            }
          });
          if(count)flash(`${count} back-rent charge${count>1?"s":""} generated (marked as historical)`);
          else flash("All prior months already have charges");
        }} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44}}>Generate Prior-Month Charges</button>
        <div style={{fontSize:10,opacity:.35,marginTop:6}}>These are marked as historical and will not trigger late fees or reminders</div>
      </div>);
    })()}

    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>go(3)} className="btn btn-out" style={{fontSize:13,minHeight:44}}>Back</button>
      <button onClick={()=>go(5)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13,minHeight:44}}>Go Live <IcoArrow/></button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 5 — Go Live
// ═══════════════════════════════════════════════════════════════════════
function P5({propRows,tenantRows,charges,sdLedger,leases,phase1Done,phase2Done,phase3Done,phase4Done,completeOnboarding,TODAY,_acc,_accContrast,_red,_gold,accBg,accBd,completeTenants,totalTenants,lateFeeDefaults}){
  const allReady=phase1Done&&phase2Done&&phase4Done;
  const mo=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
  const noPhone=tenantRows.filter(r=>!r.hasPhone).length;
  const execLeases=leases.filter(l=>l.status==="executed").length;
  const balFwd=charges.filter(c=>c.category==="Balance Forward").length;

  const checks=[
    {section:"Properties",items:[
      {label:"All properties have addresses",ok:propRows.every(p=>p.addr)},
      {label:"All properties have type set",ok:propRows.every(p=>p.type)},
      {label:"All units have utility templates",ok:propRows.every(p=>p.units.every(u=>u.utils))},
      {label:`${propRows.length} propert${propRows.length===1?"y":"ies"} configured`,ok:true,info:true},
    ]},
    {section:"Tenants",items:[
      {label:"All tenants have name + email",ok:tenantRows.every(r=>r.tenant.name&&r.tenant.email)},
      {label:"All tenants assigned to property + room",ok:tenantRows.every(r=>r.propId&&r.roomId)},
      {label:"All tenants have rent amount",ok:tenantRows.every(r=>r.rent>0)},
      {label:"All tenants have lease dates or flagged M2M",ok:tenantRows.every(r=>(r.le||r.m2m))},
      ...(noPhone>0?[{label:`${noPhone} missing phone number (non-blocking)`,ok:false,warn:true}]:[]),
    ]},
    {section:"Financial Records",items:[
      {label:`${(sdLedger||[]).length} security deposit${(sdLedger||[]).length===1?"":"s"} recorded`,ok:(sdLedger||[]).length>0||!tenantRows.some(r=>r.depositPaid),info:true},
      ...(balFwd>0?[{label:`${balFwd} balance forward entr${balFwd===1?"y":"ies"}`,ok:true,info:true}]:[]),
      {label:`${execLeases} lease record${execLeases===1?"":"s"}`,ok:execLeases>0,info:true},
    ]},
    {section:"Charges",items:[
      {label:`${mo} charges generated`,ok:phase4Done},
      {label:"Late fee rules configured (global defaults or per-property)",ok:propRows.every(p=>p.lateFeeInitial!=null)||!!(lateFeeDefaults?.amount),info:true},
      ...(tenantRows.filter(r=>r.lateConfig&&!r.lateConfig.enabled).length>0?[{label:`${tenantRows.filter(r=>r.lateConfig&&!r.lateConfig.enabled).length} on payment plan (late fee exempt)`,ok:true,info:true}]:[]),
    ]},
  ];

  return(<div>
    <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 4px"}}>Go-Live Checklist</h2>
    <p style={{fontSize:13,opacity:.45,margin:"0 0 20px"}}>{allReady?"Everything looks good. You are ready to go live.":"Review items below before completing onboarding."}</p>

    {checks.map(s=><div key={s.section} style={{marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>{s.section}
        {s.items.filter(i=>!i.warn&&!i.info).every(i=>i.ok)&&<span style={{fontSize:11,color:_acc,fontWeight:500}}>({s.items.filter(i=>!i.warn&&!i.info).length}/{s.items.filter(i=>!i.warn&&!i.info).length})</span>}
      </div>
      {s.items.map((item,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:13,color:item.warn?_gold:item.ok?"inherit":_red,opacity:item.ok?1:.85}}>
        {item.warn?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        :item.ok?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={_acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        :<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={_red} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
        {item.label}
      </div>)}
    </div>)}

    <div style={{padding:20,background:allReady?accBg:"rgba(128,128,128,.04)",borderRadius:10,border:`1px solid ${allReady?accBd:"rgba(128,128,128,.08)"}`,marginTop:20,textAlign:"center"}}>
      <div style={{fontSize:15,fontWeight:700,color:allReady?_acc:"inherit",opacity:allReady?1:.6,marginBottom:4}}>{allReady?"Ready to go live":"Some items need attention"}</div>
      <div style={{fontSize:13,opacity:.45,marginBottom:16}}>{totalTenants} tenant{totalTenants===1?"":"s"}, {propRows.length} propert{propRows.length===1?"y":"ies"}{allReady?", all configured":""}</div>
      {allReady&&<button onClick={completeOnboarding} className="btn" style={{background:_acc,color:_accContrast,fontSize:14,padding:"10px 32px",minHeight:44}}>Complete Onboarding</button>}
    </div>
  </div>);
}
