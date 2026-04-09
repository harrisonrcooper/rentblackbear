"use client";
import{useState,useMemo,useCallback}from"react";

// ─── Icons (flat inline SVGs, no emojis) ─────────────────────────────
const IcoCheck=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoArrow=()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcoWarn=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoExpand=({open})=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{transform:open?"rotate(90deg)":"rotate(0)",transition:"transform .15s"}}><polyline points="9 18 15 12 9 6"/></svg>;
const IcoBuilding=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01"/></svg>;
const IcoUsers=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoHistory=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoDollar=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IcoRocket=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;

const allRooms=(prop)=>{if(!prop)return[];if(prop.units&&prop.units.length>0)return prop.units.flatMap(u=>u.rooms||[]);return prop.rooms||[];};
const fmtD=d=>{if(!d)return"\u2014";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;};
const fmtS=n=>"$"+Number(n||0).toLocaleString();

const PHASES=[
  {id:1,label:"Properties",icon:<IcoBuilding/>},
  {id:2,label:"Tenants",icon:<IcoUsers/>},
  {id:3,label:"History",icon:<IcoHistory/>},
  {id:4,label:"Charges",icon:<IcoDollar/>},
  {id:5,label:"Go Live",icon:<IcoRocket/>},
];

const UTIL_LABELS={allIncluded:"All Included",first100:"First $100",first150:"First $150",wifiOnly:"WiFi Only",waterWifi:"Water+WiFi",tenantPaysAll:"Tenant Pays All",fullSplit:"Full Split",metered:"Metered"};

// ─── Main Component ──────────────────────────────────────────────────
export default function OnboardingWizard({
  props,setProps,charges,setCharges,sdLedger,setSdLedger,
  settings,setSettings,leases,setLeases,
  save,uid,createCharge,TODAY,
  allTenants,goTab,onComplete,
  supa,
}){
  const[phase,setPhase]=useState(1);
  const[sel,setSel]=useState([]); // selected IDs for bulk ops
  const[expandedId,setExpandedId]=useState(null);
  const[bulkField,setBulkField]=useState(null); // {field,value} for bulk apply
  const[saving,setSaving]=useState(false);
  const _acc=settings.adminAccent||"#4a7c59";

  // ─── Derived data ────────────────────────────────────────────────
  const utilTemplates=settings.utilTemplates||[];

  // All tenants with completeness info
  const tenantRows=useMemo(()=>{
    const rows=[];
    props.forEach(p=>{
      (p.units||[]).forEach(u=>{
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
          if(!t.phone)missing.push("phone");
          const isExpired=r.le&&new Date(r.le+"T00:00:00")<TODAY&&!r.m2m;
          rows.push({
            roomId:r.id,propId:p.id,unitId:u.id,
            propName:p.addr||p.name,unitName:u.name,roomName:r.name,
            tenant:t,rent:r.rent,le:r.le,m2m:!!r.m2m,
            utils:r.utils||u.utils||"",
            lateConfig:r.lateConfig||null,
            rentDueDay:r.rentDueDay||null,
            paymentPlan:r.paymentPlan||null,
            coSigner:t.coSigner||null,
            missing,isExpired,
            complete:missing.length===0&&!isExpired,
            doorCode:t.doorCode||"",
            sd:r.sd||t.sd||r.rent||0,
            balanceOwed:t.balanceOwed||0,
            depositPaid:!!t.depositPaid,
            depositAmount:t.depositAmount||t.sd||r.rent||0,
          });
        });
      });
    });
    return rows;
  },[props,TODAY]);

  const completeTenants=tenantRows.filter(r=>r.complete).length;
  const totalTenants=tenantRows.length;

  // Property rows for Phase 1
  const propRows=useMemo(()=>{
    return props.map(p=>{
      const units=(p.units||[]).filter(u=>!u.ownerOccupied);
      const roomCount=units.reduce((s,u)=>(s+(u.rooms||[]).length),0);
      return{...p,units,roomCount,displayName:p.addr||p.name};
    });
  },[props]);

  // Phase completion checks
  const phase1Done=useMemo(()=>propRows.every(p=>p.units.every(u=>u.utils)),[propRows]);
  const phase2Done=useMemo(()=>completeTenants===totalTenants&&totalTenants>0,[completeTenants,totalTenants]);
  const phase3Done=useMemo(()=>{
    const needsBalance=tenantRows.some(r=>r.balanceOwed>0);
    const hasBalanceCharges=charges.some(c=>c.category==="Balance Forward");
    if(needsBalance&&!hasBalanceCharges)return false;
    return true;
  },[tenantRows,charges]);
  const phase4Done=useMemo(()=>{
    // Check if current month charges exist for all tenants
    const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
    const roomsWithCharges=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate&&c.dueDate.startsWith(mk)).map(c=>c.roomId));
    return tenantRows.every(r=>roomsWithCharges.has(r.roomId));
  },[tenantRows,charges,TODAY]);

  const phaseStatus=(id)=>{
    if(id===1)return phase1Done?"done":"pending";
    if(id===2)return phase2Done?"done":"pending";
    if(id===3)return phase3Done?"done":"pending";
    if(id===4)return phase4Done?"done":"pending";
    if(id===5)return(phase1Done&&phase2Done&&phase4Done)?"ready":"pending";
    return"pending";
  };
  const completedPhases=PHASES.filter(p=>phaseStatus(p.id)==="done").length;

  // ─── Helpers ─────────────────────────────────────────────────────
  const updateRoom=(propId,unitId,roomId,updater)=>{
    const updated=props.map(p=>{
      if(p.id!==propId)return p;
      return{...p,units:(p.units||[]).map(u=>{
        if(u.id!==unitId)return u;
        return{...u,rooms:(u.rooms||[]).map(r=>{
          if(r.id!==roomId)return r;
          return typeof updater==="function"?updater(r):{...r,...updater};
        })};
      })};
    });
    setProps(updated);
    save("hq-props",updated);
  };

  const updateUnit=(propId,unitId,updater)=>{
    const updated=props.map(p=>{
      if(p.id!==propId)return p;
      return{...p,units:(p.units||[]).map(u=>{
        if(u.id!==unitId)return u;
        return typeof updater==="function"?updater(u):{...u,...updater};
      })};
    });
    setProps(updated);
    save("hq-props",updated);
  };

  const bulkApplyToSelected=(field,value)=>{
    let updated=[...props];
    sel.forEach(roomId=>{
      const row=tenantRows.find(r=>r.roomId===roomId);
      if(!row)return;
      updated=updated.map(p=>{
        if(p.id!==row.propId)return p;
        return{...p,units:(p.units||[]).map(u=>{
          if(u.id!==row.unitId)return u;
          return{...u,rooms:(u.rooms||[]).map(r=>{
            if(r.id!==roomId)return r;
            if(field==="rent")return{...r,rent:Number(value)};
            if(field==="moveIn")return{...r,tenant:{...r.tenant,moveIn:value}};
            if(field==="leaseEnd")return{...r,le:value};
            if(field==="m2m")return{...r,m2m:true,le:null};
            if(field==="rentDueDay")return{...r,rentDueDay:Number(value)};
            if(field==="lateFeeExempt")return{...r,lateConfig:{...(r.lateConfig||{}),enabled:false}};
            if(field==="occupation")return{...r,tenant:{...r.tenant,occupationType:value}};
            return r;
          })};
        })};
      });
    });
    setProps(updated);
    save("hq-props",updated);
    setSel([]);
    setBulkField(null);
  };

  const toggleSel=(id)=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=(ids)=>setSel(p=>p.length===ids.length?[]:ids.map(r=>r.roomId));

  // ─── Bulk lease import (Phase 3B) ─────────────────────────────────
  const markLeasesExecuted=async()=>{
    setSaving(true);
    try{
      // Find draft leases linked to imported tenants
      const draftLeases=leases.filter(l=>l.status==="draft");
      const updates=[];
      for(const lease of draftLeases){
        const row=tenantRows.find(r=>r.roomId===lease.roomId);
        if(!row)continue;
        // Update in Supabase
        await supa("lease_instances?id=eq."+lease.id,{
          method:"PATCH",
          body:JSON.stringify({status:"executed",variable_data:{...(lease.variable_data||{}),imported:true,LEASE_START:row.tenant.moveIn||"",LEASE_END:row.le||"",MONTHLY_RENT:row.rent||0,SECURITY_DEPOSIT:row.sd||0}}),
          prefer:"return=representation"
        });
        updates.push({...lease,status:"executed",imported:true});
      }
      if(updates.length>0){
        setLeases(prev=>prev.map(l=>{
          const u=updates.find(x=>x.id===l.id);
          return u?{...l,status:"executed",imported:true}:l;
        }));
      }
    }catch(e){console.error("Lease import error:",e);}
    setSaving(false);
  };

  // ─── Balance forward (Phase 3A) ──────────────────────────────────
  const createBalanceForwards=()=>{
    const needsBalance=tenantRows.filter(r=>r.balanceOwed>0);
    const existing=new Set(charges.filter(c=>c.category==="Balance Forward").map(c=>c.roomId));
    needsBalance.forEach(row=>{
      if(existing.has(row.roomId))return;
      createCharge({
        roomId:row.roomId,
        tenantName:row.tenant.name,
        propName:row.propName,
        roomName:row.roomName,
        category:"Balance Forward",
        desc:"Balance carried from previous system",
        amount:row.balanceOwed,
        dueDate:TODAY.toISOString().split("T")[0],
        sent:true,sentDate:TODAY.toISOString().split("T")[0],
        historical:true,
      });
    });
  };

  // ─── Record historical SDs (Phase 3A) ────────────────────────────
  const recordHistoricalDeposits=()=>{
    const existing=new Set((sdLedger||[]).map(s=>s.roomId));
    const newEntries=[];
    tenantRows.forEach(row=>{
      if(!row.depositPaid||existing.has(row.roomId))return;
      newEntries.push({
        id:uid(),roomId:row.roomId,
        tenantName:row.tenant.name,propName:row.propName,roomName:row.roomName,
        amountHeld:row.depositAmount||row.rent||0,
        deposits:[{amount:row.depositAmount||row.rent||0,date:row.tenant.moveIn||TODAY.toISOString().split("T")[0],desc:"Collected in prior system (imported)"}],
        deductions:[],returned:null,historical:true,
      });
    });
    if(newEntries.length>0){
      const updated=[...(sdLedger||[]),...newEntries];
      setSdLedger(updated);
      save("hq-sdledger",updated);
    }
  };

  // ─── Generate charges (Phase 4) ──────────────────────────────────
  const generateCharges=()=>{
    const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
    const moLabel=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
    const existing=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate&&c.dueDate.startsWith(mk)).map(c=>c.roomId));
    tenantRows.forEach(row=>{
      if(existing.has(row.roomId)||!row.rent)return;
      const dueDay=row.rentDueDay||1;
      const dueDate=`${mk}-${String(dueDay).padStart(2,"0")}`;
      // Check for proration
      let amount=row.rent;
      let desc=`${moLabel} Rent`;
      if(row.tenant.moveIn){
        const moveIn=new Date(row.tenant.moveIn+"T00:00:00");
        if(moveIn.getMonth()===TODAY.getMonth()&&moveIn.getFullYear()===TODAY.getFullYear()&&moveIn.getDate()>dueDay){
          const calDays=new Date(moveIn.getFullYear(),moveIn.getMonth()+1,0).getDate();
          const daysLeft=calDays-moveIn.getDate()+1;
          amount=Math.ceil((row.rent/30)*daysLeft);
          desc=`${moLabel} Rent (prorated ${daysLeft} days)`;
        }
      }
      createCharge({
        roomId:row.roomId,tenantName:row.tenant.name,
        propName:row.propName,roomName:row.roomName,
        category:"Rent",desc,amount,dueDate,
        sent:true,sentDate:TODAY.toISOString().split("T")[0],
      });
    });
  };

  // ─── Complete onboarding ─────────────────────────────────────────
  const completeOnboarding=()=>{
    const updated={...settings,onboardingActive:false,onboardingCompletedAt:TODAY.toISOString()};
    setSettings(updated);
    save("hq-settings",updated);
    if(onComplete)onComplete();
    goTab("dashboard");
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return(
  <div style={{maxWidth:1100,margin:"0 auto"}}>
    {/* ── Phase bar ── */}
    <div style={{display:"flex",alignItems:"center",gap:0,margin:"0 0 28px",padding:"16px 0 0"}}>
      {PHASES.map((p,i)=>{
        const st=phaseStatus(p.id);
        const active=phase===p.id;
        return(
        <div key={p.id} style={{display:"flex",alignItems:"center",flex:1}}>
          <button onClick={()=>setPhase(p.id)} style={{
            display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:10,border:"none",cursor:"pointer",
            background:active?`rgba(${hexToRgb(_acc)},.12)`:"transparent",
            color:active?_acc:st==="done"?_acc:"rgba(0,0,0,.45)",
            fontWeight:active?700:500,fontSize:13,fontFamily:"inherit",transition:"all .15s",
            position:"relative",
          }}>
            <span style={{
              width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
              background:st==="done"?_acc:active?`rgba(${hexToRgb(_acc)},.15)`:"rgba(0,0,0,.06)",
              color:st==="done"?"#fff":active?_acc:"rgba(0,0,0,.35)",
              fontSize:11,fontWeight:700,flexShrink:0,
            }}>
              {st==="done"?<IcoCheck/>:p.id}
            </span>
            <span style={{whiteSpace:"nowrap"}}>{p.label}</span>
          </button>
          {i<PHASES.length-1&&<div style={{flex:1,height:2,background:st==="done"?_acc:"rgba(0,0,0,.08)",margin:"0 4px",borderRadius:1}}/>}
        </div>);
      })}
    </div>

    {/* Progress summary */}
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(0,0,0,.02)",borderRadius:10,marginBottom:24,border:"1px solid rgba(0,0,0,.06)"}}>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:600,color:"rgba(0,0,0,.7)",marginBottom:4}}>
          Onboarding Progress
        </div>
        <div style={{height:6,background:"rgba(0,0,0,.06)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(completedPhases/5)*100}%`,background:_acc,borderRadius:3,transition:"width .3s"}}/>
        </div>
      </div>
      <div style={{fontSize:12,color:"rgba(0,0,0,.45)",fontWeight:500}}>{completedPhases} of 5 phases</div>
    </div>

    {/* ═══ PHASE 1: Properties ═══ */}
    {phase===1&&<Phase1Properties
      propRows={propRows} utilTemplates={utilTemplates} settings={settings}
      sel={sel} setSel={setSel} updateUnit={updateUnit}
      _acc={_acc} phase1Done={phase1Done} setPhase={setPhase}
    />}

    {/* ═══ PHASE 2: Tenants ═══ */}
    {phase===2&&<Phase2Tenants
      tenantRows={tenantRows} sel={sel} setSel={setSel} toggleSel={toggleSel} toggleAll={toggleAll}
      expandedId={expandedId} setExpandedId={setExpandedId}
      bulkField={bulkField} setBulkField={setBulkField} bulkApplyToSelected={bulkApplyToSelected}
      updateRoom={updateRoom} completeTenants={completeTenants} totalTenants={totalTenants}
      _acc={_acc} TODAY={TODAY} setPhase={setPhase}
    />}

    {/* ═══ PHASE 3: Historical Data ═══ */}
    {phase===3&&<Phase3History
      tenantRows={tenantRows} charges={charges} sdLedger={sdLedger} leases={leases}
      createBalanceForwards={createBalanceForwards} recordHistoricalDeposits={recordHistoricalDeposits}
      markLeasesExecuted={markLeasesExecuted} saving={saving}
      _acc={_acc} setPhase={setPhase} fmtS={fmtS}
    />}

    {/* ═══ PHASE 4: Charges ═══ */}
    {phase===4&&<Phase4Charges
      tenantRows={tenantRows} charges={charges} TODAY={TODAY}
      generateCharges={generateCharges} phase4Done={phase4Done}
      _acc={_acc} setPhase={setPhase} fmtS={fmtS}
    />}

    {/* ═══ PHASE 5: Go Live ═══ */}
    {phase===5&&<Phase5GoLive
      propRows={propRows} tenantRows={tenantRows} charges={charges} sdLedger={sdLedger} leases={leases}
      phase1Done={phase1Done} phase2Done={phase2Done} phase3Done={phase3Done} phase4Done={phase4Done}
      completeOnboarding={completeOnboarding} TODAY={TODAY}
      _acc={_acc} fmtS={fmtS} completeTenants={completeTenants} totalTenants={totalTenants}
    />}
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1 — Property Finalization
// ═══════════════════════════════════════════════════════════════════════
function Phase1Properties({propRows,utilTemplates,settings,sel,setSel,updateUnit,_acc,phase1Done,setPhase}){
  const[bulkUtil,setBulkUtil]=useState("");
  const[expanded,setExpanded]=useState(null);

  const unitIds=propRows.flatMap(p=>p.units.map(u=>({propId:p.id,unitId:u.id})));
  const selUnits=sel; // reuse sel for unit IDs in phase 1

  const toggleUnitSel=(unitId)=>setSel(p=>p.includes(unitId)?p.filter(x=>x!==unitId):[...p,unitId]);

  const bulkApplyUtil=()=>{
    if(!bulkUtil)return;
    selUnits.forEach(unitId=>{
      const pr=propRows.find(p=>p.units.some(u=>u.id===unitId));
      if(pr)updateUnit(pr.id,unitId,{utils:bulkUtil});
    });
    setSel([]);
    setBulkUtil("");
  };

  return(
  <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <div>
        <h2 style={{fontSize:18,fontWeight:700,margin:0,color:"rgba(0,0,0,.85)"}}>Property Configuration</h2>
        <p style={{fontSize:13,color:"rgba(0,0,0,.45)",margin:"4px 0 0"}}>Set utility templates and late fee defaults for each property/unit</p>
      </div>
      {phase1Done&&<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Complete</span>}
    </div>

    {/* Bulk toolbar */}
    {selUnits.length>0&&(
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:`rgba(${hexToRgb(_acc)},.06)`,border:`1px solid rgba(${hexToRgb(_acc)},.15)`,borderRadius:8,marginBottom:12}}>
      <span style={{fontSize:12,fontWeight:600,color:_acc}}>{selUnits.length} unit{selUnits.length>1?"s":""} selected</span>
      <select value={bulkUtil} onChange={e=>setBulkUtil(e.target.value)} style={{fontSize:12,padding:"4px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.12)",fontFamily:"inherit"}}>
        <option value="">Set utility template...</option>
        {utilTemplates.map(t=><option key={t.key} value={t.key}>{t.name}</option>)}
      </select>
      {bulkUtil&&<button onClick={bulkApplyUtil} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:11}}>Apply to {selUnits.length}</button>}
      <button onClick={()=>setSel([])} style={{fontSize:11,color:"rgba(0,0,0,.4)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Clear</button>
    </div>)}

    {/* Property table */}
    <div style={{border:"1px solid rgba(0,0,0,.08)",borderRadius:10,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead>
          <tr style={{background:"rgba(0,0,0,.02)"}}>
            <th style={{...TH,width:32}}><input type="checkbox" checked={selUnits.length===unitIds.length&&unitIds.length>0} onChange={()=>setSel(selUnits.length===unitIds.length?[]:unitIds.map(u=>u.unitId))}/></th>
            <th style={TH}>Property</th>
            <th style={TH}>Unit</th>
            <th style={TH}>Mode</th>
            <th style={TH}>Rooms</th>
            <th style={TH}>Utility Template</th>
            <th style={{...TH,width:40}}></th>
          </tr>
        </thead>
        <tbody>
          {propRows.map(p=>p.units.map(u=>{
            const isExp=expanded===u.id;
            const hasUtil=!!u.utils;
            return[
            <tr key={u.id} style={{borderTop:"1px solid rgba(0,0,0,.06)"}}>
              <td style={TD}><input type="checkbox" checked={selUnits.includes(u.id)} onChange={()=>toggleUnitSel(u.id)}/></td>
              <td style={{...TD,fontWeight:600}}>{p.displayName}</td>
              <td style={TD}>{u.name||"Main"}</td>
              <td style={TD}><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:"rgba(0,0,0,.04)"}}>{(u.rentalMode||"byRoom")==="wholeHouse"?"Whole Unit":"By Room"}</span></td>
              <td style={TD}>{(u.rooms||[]).length}</td>
              <td style={TD}>
                <select value={u.utils||""} onChange={e=>updateUnit(p.id,u.id,{utils:e.target.value})}
                  style={{fontSize:12,padding:"4px 8px",borderRadius:6,border:hasUtil?"1px solid rgba(0,0,0,.12)":"1.5px solid #c45c4a",fontFamily:"inherit",background:hasUtil?"":"rgba(196,92,74,.04)",minWidth:160}}>
                  <option value="">Select template...</option>
                  {utilTemplates.map(t=><option key={t.key} value={t.key}>{t.name}</option>)}
                </select>
              </td>
              <td style={TD}>
                <button onClick={()=>setExpanded(isExp?null:u.id)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
                  <IcoExpand open={isExp}/>
                </button>
              </td>
            </tr>,
            isExp&&(u.rooms||[]).map(r=>(
            <tr key={r.id} style={{background:"rgba(0,0,0,.015)"}}>
              <td style={TD}></td>
              <td style={{...TD,paddingLeft:32,color:"rgba(0,0,0,.5)",fontSize:12}}>{r.name}</td>
              <td style={{...TD,fontSize:12,color:"rgba(0,0,0,.5)"}}>{r.st==="occupied"?r.tenant?.name||"Occupied":"Vacant"}</td>
              <td style={TD}></td>
              <td style={{...TD,fontSize:12}}>{r.rent?fmtS(r.rent):"\u2014"}</td>
              <td style={{...TD,fontSize:12,color:"rgba(0,0,0,.5)"}}>{r.utils?UTIL_LABELS[r.utils]||r.utils:"Inherits unit"}</td>
              <td style={TD}></td>
            </tr>))];
          }))}
        </tbody>
      </table>
    </div>

    {/* Next */}
    <div style={{display:"flex",justifyContent:"flex-end",marginTop:20}}>
      <button onClick={()=>setPhase(2)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13}}>
        Tenants <IcoArrow/>
      </button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 2 — Tenant Finalization
// ═══════════════════════════════════════════════════════════════════════
function Phase2Tenants({tenantRows,sel,setSel,toggleSel,toggleAll,expandedId,setExpandedId,bulkField,setBulkField,bulkApplyToSelected,updateRoom,completeTenants,totalTenants,_acc,TODAY,setPhase}){
  const[filter,setFilter]=useState("all"); // all, incomplete, expired, missing-email, missing-rent
  const[bulkVal,setBulkVal]=useState("");
  const[bulkType,setBulkType]=useState("");

  const filtered=useMemo(()=>{
    if(filter==="incomplete")return tenantRows.filter(r=>!r.complete);
    if(filter==="expired")return tenantRows.filter(r=>r.isExpired);
    if(filter==="missing-email")return tenantRows.filter(r=>!r.tenant.email);
    if(filter==="missing-rent")return tenantRows.filter(r=>!r.rent);
    return tenantRows;
  },[tenantRows,filter]);

  const expiredCount=tenantRows.filter(r=>r.isExpired).length;

  return(
  <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
      <div>
        <h2 style={{fontSize:18,fontWeight:700,margin:0,color:"rgba(0,0,0,.85)"}}>Tenant Finalization</h2>
        <p style={{fontSize:13,color:"rgba(0,0,0,.45)",margin:"4px 0 0"}}>Review and complete tenant profiles. {completeTenants} of {totalTenants} ready.</p>
      </div>
      {/* Completion indicator */}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:80,height:6,background:"rgba(0,0,0,.06)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${totalTenants?(completeTenants/totalTenants)*100:0}%`,background:completeTenants===totalTenants?_acc:"#d4a853",borderRadius:3,transition:"width .3s"}}/>
        </div>
        <span style={{fontSize:12,fontWeight:600,color:completeTenants===totalTenants?_acc:"rgba(0,0,0,.5)"}}>{completeTenants}/{totalTenants}</span>
      </div>
    </div>

    {/* Expired lease alert */}
    {expiredCount>0&&(
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.15)",borderRadius:8,marginBottom:12}}>
      <IcoWarn/>
      <span style={{fontSize:12,color:"#c45c4a",fontWeight:500}}>{expiredCount} tenant{expiredCount>1?"s":""} with expired leases{"\u2014"}consider flagging as month-to-month</span>
      <button onClick={()=>setFilter("expired")} style={{fontSize:11,color:"#c45c4a",fontWeight:600,background:"none",border:"none",cursor:"pointer",marginLeft:"auto",fontFamily:"inherit"}}>Show</button>
    </div>)}

    {/* Filters */}
    <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
      {[["all","All ("+totalTenants+")"],["incomplete","Incomplete"],["expired","Expired Lease"],["missing-email","No Email"],["missing-rent","No Rent"]].map(([k,l])=>(
        <button key={k} onClick={()=>setFilter(k)} style={{
          fontSize:11,padding:"5px 12px",borderRadius:6,border:"1px solid",fontFamily:"inherit",cursor:"pointer",fontWeight:filter===k?600:400,
          borderColor:filter===k?_acc:"rgba(0,0,0,.1)",color:filter===k?_acc:"rgba(0,0,0,.5)",
          background:filter===k?`rgba(${hexToRgb(_acc)},.06)`:"transparent",
        }}>{l}</button>
      ))}
    </div>

    {/* Bulk toolbar */}
    {sel.length>0&&(
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:`rgba(${hexToRgb(_acc)},.06)`,border:`1px solid rgba(${hexToRgb(_acc)},.15)`,borderRadius:8,marginBottom:12,flexWrap:"wrap"}}>
      <span style={{fontSize:12,fontWeight:600,color:_acc}}>{sel.length} selected</span>
      <select value={bulkType} onChange={e=>{setBulkType(e.target.value);setBulkVal("");}} style={{fontSize:12,padding:"4px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.12)",fontFamily:"inherit"}}>
        <option value="">Bulk action...</option>
        <option value="rent">Set rent</option>
        <option value="moveIn">Set move-in date</option>
        <option value="leaseEnd">Set lease end</option>
        <option value="rentDueDay">Set due day</option>
        <option value="m2m">Flag as month-to-month</option>
        <option value="lateFeeExempt">Exempt from late fees</option>
        <option value="occupation">Set occupation</option>
      </select>
      {bulkType&&bulkType!=="m2m"&&bulkType!=="lateFeeExempt"&&(
        bulkType==="rentDueDay"
          ?<select value={bulkVal} onChange={e=>setBulkVal(e.target.value)} style={{fontSize:12,padding:"4px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.12)",fontFamily:"inherit"}}>
            <option value="">Day...</option>
            {Array.from({length:28},(_,i)=><option key={i+1} value={i+1}>{ordinal(i+1)}</option>)}
          </select>
          :bulkType==="occupation"
          ?<select value={bulkVal} onChange={e=>setBulkVal(e.target.value)} style={{fontSize:12,padding:"4px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.12)",fontFamily:"inherit"}}>
            <option value="">Type...</option>
            {["Intern","Military","Contractor","Student","Professional","Other"].map(o=><option key={o} value={o}>{o}</option>)}
          </select>
          :<input type={bulkType==="rent"?"number":"date"} value={bulkVal} onChange={e=>setBulkVal(e.target.value)} placeholder={bulkType==="rent"?"Amount":""}
            style={{fontSize:12,padding:"4px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.12)",fontFamily:"inherit",width:bulkType==="rent"?90:140}}/>
      )}
      {(bulkType==="m2m"||bulkType==="lateFeeExempt"||bulkVal)&&(
        <button onClick={()=>bulkApplyToSelected(bulkType,bulkVal)} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:11}}>
          Apply to {sel.length}
        </button>
      )}
      <button onClick={()=>{setSel([]);setBulkType("");setBulkVal("");}} style={{fontSize:11,color:"rgba(0,0,0,.4)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",marginLeft:"auto"}}>Clear</button>
    </div>)}

    {/* Tenant table */}
    <div style={{border:"1px solid rgba(0,0,0,.08)",borderRadius:10,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead>
          <tr style={{background:"rgba(0,0,0,.02)"}}>
            <th style={{...TH,width:32}}><input type="checkbox" checked={sel.length===filtered.length&&filtered.length>0} onChange={()=>toggleAll(filtered)}/></th>
            <th style={TH}>Tenant</th>
            <th style={TH}>Property</th>
            <th style={TH}>Room</th>
            <th style={TH}>Rent</th>
            <th style={TH}>Move-in</th>
            <th style={TH}>Lease End</th>
            <th style={TH}>Status</th>
            <th style={{...TH,width:32}}></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(row=>{
            const isExp=expandedId===row.roomId;
            return[
            <tr key={row.roomId} style={{borderTop:"1px solid rgba(0,0,0,.06)",cursor:"pointer",background:isExp?"rgba(0,0,0,.015)":"transparent"}} onClick={()=>setExpandedId(isExp?null:row.roomId)}>
              <td style={TD} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={sel.includes(row.roomId)} onChange={()=>toggleSel(row.roomId)}/></td>
              <td style={{...TD,fontWeight:600}}>{row.tenant.name||"\u2014"}</td>
              <td style={{...TD,fontSize:12}}>{row.propName}</td>
              <td style={{...TD,fontSize:12}}>{row.roomName}</td>
              <td style={TD}>{row.rent?fmtS(row.rent):"\u2014"}</td>
              <td style={{...TD,fontSize:12}}>{fmtD(row.tenant.moveIn)}</td>
              <td style={{...TD,fontSize:12}}>{row.m2m?<span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(212,168,83,.12)",color:"#b8860b",fontWeight:600}}>M2M</span>:fmtD(row.le)}</td>
              <td style={TD}>
                {row.complete
                  ?<span style={{fontSize:11,color:_acc,fontWeight:600,display:"flex",alignItems:"center",gap:3}}><IcoCheck/> Ready</span>
                  :row.isExpired
                    ?<span style={{fontSize:11,color:"#c45c4a",fontWeight:500}}>Expired</span>
                    :<span style={{fontSize:11,color:"rgba(0,0,0,.4)"}}>Missing: {row.missing.join(", ")}</span>}
              </td>
              <td style={TD}><IcoExpand open={isExp}/></td>
            </tr>,
            isExp&&<tr key={row.roomId+"-exp"}><td colSpan={9} style={{padding:0}}>
              <TenantDetail row={row} updateRoom={updateRoom} _acc={_acc} TODAY={TODAY}/>
            </td></tr>];
          })}
          {filtered.length===0&&<tr><td colSpan={9} style={{...TD,textAlign:"center",color:"rgba(0,0,0,.35)",padding:24}}>No tenants match this filter</td></tr>}
        </tbody>
      </table>
    </div>

    {/* Nav */}
    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>setPhase(1)} className="btn btn-out" style={{fontSize:13}}>Back</button>
      <button onClick={()=>setPhase(3)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13}}>
        Historical Data <IcoArrow/>
      </button>
    </div>
  </div>);
}

// ─── Tenant Detail (inline expand) ──────────────────────────────────
function TenantDetail({row,updateRoom,_acc,TODAY}){
  const[form,setForm]=useState({
    name:row.tenant.name||"",
    email:row.tenant.email||"",
    phone:row.tenant.phone||"",
    moveIn:row.tenant.moveIn||"",
    occupation:row.tenant.occupationType||"",
    doorCode:row.doorCode||"",
    rent:row.rent||"",
    le:row.le||"",
    m2m:row.m2m,
    rentDueDay:row.rentDueDay||"",
    lateFeeExempt:row.lateConfig?!row.lateConfig.enabled:false,
    coSignerName:row.coSigner?.name||"",
    coSignerPhone:row.coSigner?.phone||"",
    coSignerEmail:row.coSigner?.email||"",
    coSignerRelation:row.coSigner?.relation||"",
    paymentPlanActive:row.paymentPlan?.active||false,
    paymentPlanNotes:row.paymentPlan?.notes||"",
  });
  const[saved,setSaved]=useState(false);

  const saveDetail=()=>{
    updateRoom(row.propId,row.unitId,row.roomId,r=>({
      ...r,
      rent:Number(form.rent)||r.rent,
      le:form.m2m?null:form.le,
      m2m:form.m2m,
      rentDueDay:form.rentDueDay?Number(form.rentDueDay):null,
      lateConfig:{...(r.lateConfig||{}),enabled:!form.lateFeeExempt},
      paymentPlan:form.paymentPlanActive?{active:true,notes:form.paymentPlanNotes}:null,
      tenant:{
        ...r.tenant,
        name:form.name,email:form.email,phone:form.phone,
        moveIn:form.moveIn,occupationType:form.occupation,doorCode:form.doorCode,
        coSigner:(form.coSignerName?{name:form.coSignerName,phone:form.coSignerPhone,email:form.coSignerEmail,relation:form.coSignerRelation}:null),
      },
    }));
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  const fld=(label,key,type="text",opts={})=>(
    <div style={{flex:opts.flex||1,minWidth:opts.minWidth||120}}>
      <label style={{fontSize:11,fontWeight:500,color:"rgba(0,0,0,.45)",marginBottom:3,display:"block"}}>{label}</label>
      {type==="select"
        ?<select value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={INPUT_STYLE}>
          <option value="">{opts.placeholder||"Select..."}</option>
          {(opts.options||[]).map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        :<input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={opts.placeholder||""} style={INPUT_STYLE}/>}
    </div>
  );

  return(
  <div style={{padding:"16px 20px 20px",background:"rgba(0,0,0,.015)",borderTop:"1px solid rgba(0,0,0,.04)"}}>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:14}}>
      {fld("Name","name")}
      {fld("Email","email","email")}
      {fld("Phone","phone","tel")}
      {fld("Occupation","occupation","select",{options:["Intern","Military","Contractor","Student","Professional","Other"]})}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:14}}>
      {fld("Monthly Rent","rent","number",{minWidth:100})}
      {fld("Door Code (4-digit)","doorCode","text",{minWidth:100})}
      {fld("Move-in Date","moveIn","date")}
      {!form.m2m&&fld("Lease End","le","date")}
      <div style={{flex:1,minWidth:100,display:"flex",alignItems:"flex-end",gap:8}}>
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",paddingBottom:6}}>
          <input type="checkbox" checked={form.m2m} onChange={e=>setForm(f=>({...f,m2m:e.target.checked}))}/>
          Month-to-month
        </label>
      </div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:14}}>
      <div style={{flex:1,minWidth:120}}>
        <label style={{fontSize:11,fontWeight:500,color:"rgba(0,0,0,.45)",marginBottom:3,display:"block"}}>Rent Due Day</label>
        <select value={form.rentDueDay} onChange={e=>setForm(f=>({...f,rentDueDay:e.target.value}))} style={INPUT_STYLE}>
          <option value="">1st (default)</option>
          {Array.from({length:28},(_,i)=><option key={i+1} value={i+1}>{ordinal(i+1)}</option>)}
        </select>
      </div>
      <div style={{flex:1,minWidth:120,display:"flex",alignItems:"flex-end",gap:12,paddingBottom:2}}>
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
          <input type="checkbox" checked={form.lateFeeExempt} onChange={e=>setForm(f=>({...f,lateFeeExempt:e.target.checked}))}/>
          Late fee exempt
        </label>
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
          <input type="checkbox" checked={form.paymentPlanActive} onChange={e=>setForm(f=>({...f,paymentPlanActive:e.target.checked}))}/>
          Payment plan
        </label>
      </div>
    </div>
    {form.paymentPlanActive&&(
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:500,color:"rgba(0,0,0,.45)",marginBottom:3,display:"block"}}>Payment Plan Notes</label>
        <input type="text" value={form.paymentPlanNotes} onChange={e=>setForm(f=>({...f,paymentPlanNotes:e.target.value}))} placeholder="e.g. $200/mo extra until balance paid" style={{...INPUT_STYLE,width:"100%"}}/>
      </div>
    )}

    {/* Co-signer */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:12,fontWeight:600,color:"rgba(0,0,0,.6)",marginBottom:8}}>Co-Signer</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        {fld("Name","coSignerName","text",{placeholder:"Full name"})}
        {fld("Phone","coSignerPhone","tel")}
        {fld("Email","coSignerEmail","email")}
        {fld("Relation","coSignerRelation","select",{options:["Parent","Spouse","Sibling","Employer","Other"]})}
      </div>
    </div>

    {/* Save */}
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
      {saved&&<span style={{fontSize:12,color:_acc,fontWeight:500,alignSelf:"center"}}>Saved</span>}
      <button onClick={saveDetail} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12}}>Save Changes</button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 3 — Historical Data
// ═══════════════════════════════════════════════════════════════════════
function Phase3History({tenantRows,charges,sdLedger,leases,createBalanceForwards,recordHistoricalDeposits,markLeasesExecuted,saving,_acc,setPhase,fmtS}){
  const needsBalance=tenantRows.filter(r=>r.balanceOwed>0);
  const hasBalanceCharges=charges.some(c=>c.category==="Balance Forward");
  const needsDeposit=tenantRows.filter(r=>r.depositPaid);
  const existingSdIds=new Set((sdLedger||[]).map(s=>s.roomId));
  const depositsRecorded=needsDeposit.every(r=>existingSdIds.has(r.roomId));
  const draftLeases=leases.filter(l=>l.status==="draft");
  const executedImported=leases.filter(l=>l.status==="executed"&&l.imported);

  const noHistory=needsBalance.length===0&&needsDeposit.length===0&&draftLeases.length===0;

  return(
  <div>
    <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 4px",color:"rgba(0,0,0,.85)"}}>Historical Data Import</h2>
    <p style={{fontSize:13,color:"rgba(0,0,0,.45)",margin:"0 0 20px"}}>Record pre-existing deposits, balances, and leases from your previous system</p>

    {noHistory&&(
    <div style={{padding:"32px 20px",textAlign:"center",background:"rgba(0,0,0,.02)",borderRadius:10,marginBottom:20}}>
      <div style={{fontSize:14,color:"rgba(0,0,0,.5)",marginBottom:4}}>No historical data to import</div>
      <div style={{fontSize:12,color:"rgba(0,0,0,.35)"}}>All imported tenants appear to be new{"\u2014"}skip to charges</div>
    </div>)}

    {/* 3A: Security Deposits */}
    {needsDeposit.length>0&&(
    <div style={{border:"1px solid rgba(0,0,0,.08)",borderRadius:10,padding:16,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div>
          <div style={{fontSize:14,fontWeight:600,color:"rgba(0,0,0,.8)"}}>Security Deposits</div>
          <div style={{fontSize:12,color:"rgba(0,0,0,.4)"}}>{needsDeposit.length} tenant{needsDeposit.length>1?"s":""} with deposits from prior system</div>
        </div>
        {depositsRecorded
          ?<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Recorded</span>
          :<button onClick={recordHistoricalDeposits} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12}}>Record All Deposits</button>}
      </div>
      <div style={{fontSize:12,color:"rgba(0,0,0,.4)",background:"rgba(0,0,0,.02)",padding:"8px 12px",borderRadius:6}}>
        {needsDeposit.map(r=>(
          <div key={r.roomId} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
            <span>{r.tenant.name}</span>
            <span style={{fontWeight:500}}>{fmtS(r.depositAmount||r.rent)}</span>
          </div>
        ))}
      </div>
    </div>)}

    {/* 3B: Balance Forwards */}
    {needsBalance.length>0&&(
    <div style={{border:"1px solid rgba(0,0,0,.08)",borderRadius:10,padding:16,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div>
          <div style={{fontSize:14,fontWeight:600,color:"rgba(0,0,0,.8)"}}>Outstanding Balances</div>
          <div style={{fontSize:12,color:"rgba(0,0,0,.4)"}}>{needsBalance.length} tenant{needsBalance.length>1?"s":""} with balances from prior system</div>
        </div>
        {hasBalanceCharges
          ?<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Recorded</span>
          :<button onClick={createBalanceForwards} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12}}>Create Balance Forwards</button>}
      </div>
      <div style={{fontSize:12,color:"rgba(0,0,0,.4)",background:"rgba(0,0,0,.02)",padding:"8px 12px",borderRadius:6}}>
        {needsBalance.map(r=>(
          <div key={r.roomId} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
            <span>{r.tenant.name}</span>
            <span style={{fontWeight:500,color:"#c45c4a"}}>{fmtS(r.balanceOwed)}</span>
          </div>
        ))}
      </div>
    </div>)}

    {/* 3C: Existing Leases */}
    {draftLeases.length>0&&(
    <div style={{border:"1px solid rgba(0,0,0,.08)",borderRadius:10,padding:16,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div>
          <div style={{fontSize:14,fontWeight:600,color:"rgba(0,0,0,.8)"}}>Existing Leases</div>
          <div style={{fontSize:12,color:"rgba(0,0,0,.4)"}}>{draftLeases.length} draft lease{draftLeases.length>1?"s":""} from import{"\u2014"}mark as already executed</div>
        </div>
        <button onClick={markLeasesExecuted} disabled={saving} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,opacity:saving?.6:1}}>
          {saving?"Updating...":"Mark All as Executed"}
        </button>
      </div>
      <div style={{fontSize:11,color:"rgba(0,0,0,.35)",background:"rgba(212,168,83,.06)",padding:"8px 12px",borderRadius:6,border:"1px solid rgba(212,168,83,.1)"}}>
        These leases will be marked as "Executed (Imported)" without requiring signatures. They record the key terms from your previous system.
      </div>
    </div>)}

    {executedImported.length>0&&(
    <div style={{padding:"10px 14px",background:`rgba(${hexToRgb(_acc)},.06)`,borderRadius:8,marginBottom:16,fontSize:12,color:_acc,fontWeight:500,display:"flex",alignItems:"center",gap:6}}>
      <IcoCheck/> {executedImported.length} lease{executedImported.length>1?"s":""} marked as imported
    </div>)}

    {/* Nav */}
    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>setPhase(2)} className="btn btn-out" style={{fontSize:13}}>Back</button>
      <button onClick={()=>setPhase(4)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13}}>
        Charges <IcoArrow/>
      </button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 4 — Charge Structure
// ═══════════════════════════════════════════════════════════════════════
function Phase4Charges({tenantRows,charges,TODAY,generateCharges,phase4Done,_acc,setPhase,fmtS}){
  const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
  const moLabel=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
  const existingRoomIds=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate&&c.dueDate.startsWith(mk)).map(c=>c.roomId));

  // Preview what will be generated
  const preview=tenantRows.filter(r=>r.rent>0).map(row=>{
    const dueDay=row.rentDueDay||1;
    let amount=row.rent;
    let prorated=false;
    let days=0;
    if(row.tenant.moveIn){
      const moveIn=new Date(row.tenant.moveIn+"T00:00:00");
      if(moveIn.getMonth()===TODAY.getMonth()&&moveIn.getFullYear()===TODAY.getFullYear()&&moveIn.getDate()>dueDay){
        const calDays=new Date(moveIn.getFullYear(),moveIn.getMonth()+1,0).getDate();
        days=calDays-moveIn.getDate()+1;
        amount=Math.ceil((row.rent/30)*days);
        prorated=true;
      }
    }
    return{...row,dueDay,chargeAmount:amount,prorated,days,alreadyExists:existingRoomIds.has(row.roomId)};
  });

  return(
  <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
      <div>
        <h2 style={{fontSize:18,fontWeight:700,margin:0,color:"rgba(0,0,0,.85)"}}>Charge Generation</h2>
        <p style={{fontSize:13,color:"rgba(0,0,0,.45)",margin:"4px 0 0"}}>{moLabel} rent charges for all active tenants</p>
      </div>
      {phase4Done
        ?<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Generated</span>
        :<button onClick={generateCharges} className="btn" style={{background:_acc,color:"#fff",fontSize:13}}>Generate All Charges</button>}
    </div>

    {/* Preview table */}
    <div style={{border:"1px solid rgba(0,0,0,.08)",borderRadius:10,overflow:"hidden",marginTop:16}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead>
          <tr style={{background:"rgba(0,0,0,.02)"}}>
            <th style={TH}>Tenant</th>
            <th style={TH}>Property</th>
            <th style={TH}>Rent</th>
            <th style={TH}>Due Day</th>
            <th style={TH}>Amount</th>
            <th style={TH}>Prorated</th>
            <th style={TH}>Status</th>
          </tr>
        </thead>
        <tbody>
          {preview.map(row=>(
          <tr key={row.roomId} style={{borderTop:"1px solid rgba(0,0,0,.06)"}}>
            <td style={{...TD,fontWeight:500}}>{row.tenant.name}</td>
            <td style={{...TD,fontSize:12}}>{row.propName}</td>
            <td style={TD}>{fmtS(row.rent)}</td>
            <td style={TD}>{ordinal(row.dueDay)}</td>
            <td style={{...TD,fontWeight:600}}>{fmtS(row.chargeAmount)}</td>
            <td style={TD}>{row.prorated?<span style={{fontSize:11,color:"#b8860b"}}>{row.days} days</span>:"\u2014"}</td>
            <td style={TD}>{row.alreadyExists?<span style={{fontSize:11,color:_acc,fontWeight:500,display:"flex",alignItems:"center",gap:3}}><IcoCheck/> Created</span>:<span style={{fontSize:11,color:"rgba(0,0,0,.35)"}}>Pending</span>}</td>
          </tr>))}
          {preview.length===0&&<tr><td colSpan={7} style={{...TD,textAlign:"center",color:"rgba(0,0,0,.35)",padding:24}}>No tenants with rent amounts set</td></tr>}
        </tbody>
      </table>
    </div>

    {/* Late fee summary */}
    <div style={{marginTop:16,padding:16,background:"rgba(0,0,0,.02)",borderRadius:10,border:"1px solid rgba(0,0,0,.06)"}}>
      <div style={{fontSize:13,fontWeight:600,color:"rgba(0,0,0,.7)",marginBottom:8}}>Late Fee Configuration</div>
      {(()=>{
        const exempt=tenantRows.filter(r=>r.lateConfig&&!r.lateConfig.enabled);
        return(
        <div style={{fontSize:12,color:"rgba(0,0,0,.5)"}}>
          <div>Default: $50 after 3rd, +$5/day</div>
          {exempt.length>0&&<div style={{marginTop:4,color:"#b8860b"}}>Exempt: {exempt.map(r=>r.tenant.name).join(", ")}</div>}
        </div>);
      })()}
    </div>

    {/* Nav */}
    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>setPhase(3)} className="btn btn-out" style={{fontSize:13}}>Back</button>
      <button onClick={()=>setPhase(5)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13}}>
        Go Live <IcoArrow/>
      </button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 5 — Go Live Checklist
// ═══════════════════════════════════════════════════════════════════════
function Phase5GoLive({propRows,tenantRows,charges,sdLedger,leases,phase1Done,phase2Done,phase3Done,phase4Done,completeOnboarding,TODAY,_acc,fmtS,completeTenants,totalTenants}){
  const allReady=phase1Done&&phase2Done&&phase4Done;
  const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
  const moLabel=TODAY.toLocaleString("default",{month:"long",year:"numeric"});

  const checks=[
    {section:"Properties",items:[
      {label:"All properties have addresses",ok:propRows.every(p=>p.addr)},
      {label:"All units have utility templates",ok:propRows.every(p=>p.units.every(u=>u.utils))},
      {label:`${propRows.length} properties configured`,ok:true,info:true},
    ]},
    {section:"Tenants",items:[
      {label:"All tenants have name + email",ok:tenantRows.every(r=>r.tenant.name&&r.tenant.email)},
      {label:"All tenants assigned to property + room",ok:tenantRows.every(r=>r.propId&&r.roomId)},
      {label:"All tenants have rent amount",ok:tenantRows.every(r=>r.rent>0)},
      {label:"All tenants have lease dates or flagged M2M",ok:tenantRows.every(r=>(r.le||r.m2m))},
      ...(tenantRows.some(r=>!r.tenant.phone)?[{label:`${tenantRows.filter(r=>!r.tenant.phone).length} missing phone (non-blocking)`,ok:false,warn:true}]:[]),
    ]},
    {section:"Financial Records",items:[
      {label:`${(sdLedger||[]).length} security deposits recorded`,ok:(sdLedger||[]).length>0||!tenantRows.some(r=>r.depositPaid),info:true},
      ...(charges.some(c=>c.category==="Balance Forward")?[{label:`${charges.filter(c=>c.category==="Balance Forward").length} balance forward entries`,ok:true,info:true}]:[]),
      {label:`${leases.filter(l=>l.status==="executed").length} lease records`,ok:leases.filter(l=>l.status==="executed").length>0,info:true},
    ]},
    {section:"Charges",items:[
      {label:`${moLabel} charges generated`,ok:phase4Done},
      {label:"Late fee rules configured",ok:true,info:true},
      ...(tenantRows.filter(r=>r.lateConfig&&!r.lateConfig.enabled).length>0?[{label:`${tenantRows.filter(r=>r.lateConfig&&!r.lateConfig.enabled).length} on payment plan (late fee exempt)`,ok:true,info:true}]:[]),
    ]},
  ];

  return(
  <div>
    <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 4px",color:"rgba(0,0,0,.85)"}}>Go-Live Checklist</h2>
    <p style={{fontSize:13,color:"rgba(0,0,0,.45)",margin:"0 0 20px"}}>
      {allReady?"Everything looks good. You're ready to go live.":"Review items below before completing onboarding."}
    </p>

    {checks.map(section=>(
    <div key={section.section} style={{marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,color:"rgba(0,0,0,.7)",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
        {section.section}
        {section.items.filter(i=>!i.warn&&!i.info).every(i=>i.ok)&&<span style={{fontSize:11,color:_acc,fontWeight:500}}>({section.items.filter(i=>!i.warn&&!i.info).length}/{section.items.filter(i=>!i.warn&&!i.info).length})</span>}
      </div>
      {section.items.map((item,i)=>(
      <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:13,color:item.warn?"#b8860b":item.ok?"rgba(0,0,0,.65)":"#c45c4a"}}>
        {item.warn
          ?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          :item.ok
            ?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={_acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            :<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
        {item.label}
      </div>))}
    </div>))}

    {/* Summary */}
    <div style={{padding:"20px",background:allReady?`rgba(${hexToRgb(_acc)},.04)`:"rgba(0,0,0,.02)",borderRadius:10,border:`1px solid ${allReady?`rgba(${hexToRgb(_acc)},.15)`:"rgba(0,0,0,.06)"}`,marginTop:20,textAlign:"center"}}>
      <div style={{fontSize:15,fontWeight:700,color:allReady?_acc:"rgba(0,0,0,.6)",marginBottom:4}}>
        {allReady?"Ready to go live":"Some items need attention"}
      </div>
      <div style={{fontSize:13,color:"rgba(0,0,0,.45)",marginBottom:16}}>
        {totalTenants} tenants, {propRows.length} properties{allReady?", all configured":""}
      </div>
      {allReady&&(
        <button onClick={completeOnboarding} className="btn" style={{background:_acc,color:"#fff",fontSize:14,padding:"10px 32px"}}>
          Complete Onboarding
        </button>
      )}
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// Shared styles & utils
// ═══════════════════════════════════════════════════════════════════════
const TH={padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"rgba(0,0,0,.4)",textTransform:"uppercase",letterSpacing:".5px"};
const TD={padding:"8px 12px",verticalAlign:"middle"};
const INPUT_STYLE={fontSize:13,padding:"6px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.12)",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

function hexToRgb(hex){
  const r=parseInt((hex||"#4a7c59").slice(1,3),16);
  const g=parseInt((hex||"#4a7c59").slice(3,5),16);
  const b=parseInt((hex||"#4a7c59").slice(5,7),16);
  return`${r},${g},${b}`;
}

function ordinal(n){
  const s=["th","st","nd","rd"];
  const v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
}
