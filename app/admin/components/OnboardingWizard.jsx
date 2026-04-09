"use client";
import{useState,useMemo,useCallback,useRef,useEffect}from"react";

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
const OCC_TYPES=["Intern","Military","Contractor","Student","Professional","Other"];
const ONETIMECHARGE_TYPES=["Move-In Fee","Admin Fee","Key Replacement","Lock Change","Cleaning Fee","Pet Deposit","Other"];

// ─── Shared style helpers (theme-aware) ──────────────────────────────
function mkStyles(acc,red,gold){
  const accRgb=hexToRgb(acc);
  return{
    TH:{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"currentColor",opacity:.4,textTransform:"uppercase",letterSpacing:".5px"},
    TD:{padding:"8px 12px",verticalAlign:"middle"},
    INPUT:{fontSize:13,padding:"6px 10px",borderRadius:6,border:"1px solid rgba(128,128,128,.25)",fontFamily:"inherit",width:"100%",boxSizing:"border-box"},
    accBg:`rgba(${accRgb},.06)`,
    accBorder:`rgba(${accRgb},.15)`,
    accBgStrong:`rgba(${accRgb},.12)`,
    redBg:"rgba(196,92,74,.06)",redBorder:"rgba(196,92,74,.15)",red,
    goldBg:"rgba(212,168,83,.12)",gold,
    rowHover:{cursor:"pointer",transition:"background .1s"},
    touch:{minHeight:44,minWidth:44,display:"flex",alignItems:"center",justifyContent:"center"},
  };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function OnboardingWizard({
  props,setProps,charges,setCharges,sdLedger,setSdLedger,
  settings,setSettings,leases,setLeases,
  save,uid,createCharge,TODAY,
  allTenants:_at,goTab,onComplete,
  supa,showConfirm,
}){
  const[phase,setPhase]=useState(1);
  const[sel,setSel]=useState([]); // selected IDs for bulk ops
  const[expandedId,setExpandedId]=useState(null);
  const[saving,setSaving]=useState(false);
  const[toast,setToast]=useState(null);
  const toastTimer=useRef(null);
  const _acc=settings.adminAccent||"#4a7c59";
  const _red="#c45c4a";
  const _gold="#b8860b";
  const S=useMemo(()=>mkStyles(_acc,_red,_gold),[_acc]);

  const flash=(msg)=>{setToast(msg);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(null),2500);};

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
          // phone is non-blocking — tracked separately
          const isExpired=r.le&&new Date(r.le+"T00:00:00")<TODAY&&!r.m2m;
          rows.push({
            roomId:r.id,propId:p.id,unitId:u.id,
            propName:p.addr||p.name,unitName:u.name,roomName:r.name,
            tenant:t,rent:r.rent,le:r.le,m2m:!!r.m2m,
            utils:r.utils||u.utils||"",
            lateConfig:r.lateConfig||null,
            // Use recurringDueDay to match cron field name
            recurringDueDay:r.recurringDueDay||null,
            paymentPlan:r.paymentPlan||null,
            coSigner:t.coSigner||null,
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
      });
    });
    return rows;
  },[props,TODAY]);

  const completeTenants=tenantRows.filter(r=>r.complete).length;
  const totalTenants=tenantRows.length;
  const isSmall=totalTenants<=5;

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
    const needsBal=tenantRows.some(r=>r.balanceOwed>0);
    const hasBal=charges.some(c=>c.category==="Balance Forward");
    if(needsBal&&!hasBal)return false;
    const needsDep=tenantRows.some(r=>r.depositPaid);
    const existingSdIds=new Set((sdLedger||[]).map(s=>s.roomId));
    if(needsDep&&!tenantRows.filter(r=>r.depositPaid).every(r=>existingSdIds.has(r.roomId)))return false;
    return true;
  },[tenantRows,charges,sdLedger]);
  const phase4Done=useMemo(()=>{
    const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
    const roomsWithCharges=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate&&c.dueDate.startsWith(mk)).map(c=>c.roomId));
    return tenantRows.length>0&&tenantRows.every(r=>roomsWithCharges.has(r.roomId));
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
  // Single atomic save for props — prevents race conditions
  const saveProps=(updater)=>{
    setProps(prev=>{
      const next=typeof updater==="function"?updater(prev):updater;
      save("hq-props",next);
      return next;
    });
  };

  const updateRoom=(propId,unitId,roomId,updater)=>{
    saveProps(prev=>prev.map(p=>{
      if(p.id!==propId)return p;
      return{...p,units:(p.units||[]).map(u=>{
        if(u.id!==unitId)return u;
        return{...u,rooms:(u.rooms||[]).map(r=>{
          if(r.id!==roomId)return r;
          return typeof updater==="function"?updater(r):{...r,...updater};
        })};
      })};
    }));
  };

  const updateUnit=(propId,unitId,patch)=>{
    saveProps(prev=>prev.map(p=>{
      if(p.id!==propId)return p;
      return{...p,units:(p.units||[]).map(u=>{
        if(u.id!==unitId)return u;
        return{...u,...patch};
      })};
    }));
  };

  // Bulk apply — single atomic save, no race condition (fixes P0-4)
  const bulkUpdateUnits=(unitPatches)=>{
    // unitPatches: [{propId, unitId, patch}]
    saveProps(prev=>{
      let next=[...prev];
      unitPatches.forEach(({propId,unitId,patch})=>{
        next=next.map(p=>{
          if(p.id!==propId)return p;
          return{...p,units:(p.units||[]).map(u=>{
            if(u.id!==unitId)return u;
            return{...u,...patch};
          })};
        });
      });
      return next;
    });
  };

  const bulkUpdateRooms=(roomPatches)=>{
    // roomPatches: [{propId, unitId, roomId, updater}]
    saveProps(prev=>{
      let next=[...prev];
      roomPatches.forEach(({propId,unitId,roomId,updater})=>{
        next=next.map(p=>{
          if(p.id!==propId)return p;
          return{...p,units:(p.units||[]).map(u=>{
            if(u.id!==unitId)return u;
            return{...u,rooms:(u.rooms||[]).map(r=>{
              if(r.id!==roomId)return r;
              return typeof updater==="function"?updater(r):{...r,...updater};
            })};
          })};
        });
      });
      return next;
    });
  };

  const bulkApplyToSelected=(field,value)=>{
    const patches=[];
    sel.forEach(roomId=>{
      const row=tenantRows.find(r=>r.roomId===roomId);
      if(!row)return;
      let updater;
      if(field==="rent")updater=r=>({...r,rent:Number(value)});
      else if(field==="moveIn")updater=r=>({...r,tenant:{...r.tenant,moveIn:value}});
      else if(field==="leaseEnd")updater=r=>({...r,le:value});
      else if(field==="m2m")updater=r=>({...r,m2m:true,le:null});
      else if(field==="recurringDueDay")updater=r=>({...r,recurringDueDay:Number(value)});
      else if(field==="lateFeeExempt")updater=r=>({...r,lateConfig:{...(r.lateConfig||{}),enabled:false}});
      else if(field==="occupation")updater=r=>({...r,tenant:{...r.tenant,occupationType:value}});
      else return;
      patches.push({propId:row.propId,unitId:row.unitId,roomId,updater});
    });
    if(patches.length>0){
      bulkUpdateRooms(patches);
      flash(`Updated ${patches.length} tenant${patches.length>1?"s":""}`);
    }
    setSel([]);
  };

  const toggleSel=(id)=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=(ids)=>setSel(p=>p.length===ids.length?[]:ids.map(r=>r.roomId));

  // ─── Confirm helper ──────────────────────────────────────────────
  const confirm=(title,body,onOk,danger=false)=>{
    if(showConfirm)showConfirm({title,body,onConfirm:onOk,confirmLabel:danger?"Yes, proceed":"Confirm",danger});
    else{if(window.confirm(title+"\n\n"+body))onOk();}
  };

  // ─── Bulk lease import (Phase 3C) ─────────────────────────────────
  const markLeasesExecuted=()=>{
    const draftLeases=leases.filter(l=>l.status==="draft");
    if(draftLeases.length===0)return;
    confirm("Mark Leases as Executed",
      `This will mark ${draftLeases.length} draft lease${draftLeases.length>1?"s":""} as executed (imported). This cannot be undone.`,
      async()=>{
        setSaving(true);
        try{
          const wsId=settings?.workspace_id||null;
          const updates=[];
          for(const lease of draftLeases){
            const row=tenantRows.find(r=>r.roomId===(lease.roomId||lease.room_id||(lease.variable_data?.roomId)));
            if(!row)continue;
            const patchBody={status:"executed",variable_data:{...(lease.variable_data||{}),imported:true,LEASE_START:row.tenant.moveIn||"",LEASE_END:row.le||"",MONTHLY_RENT:row.rent||0,SECURITY_DEPOSIT:row.sd||0}};
            if(wsId)patchBody.workspace_id=wsId;
            await supa("lease_instances?id=eq."+lease.id,{
              method:"PATCH",body:JSON.stringify(patchBody),prefer:"return=representation"
            });
            updates.push(lease.id);
          }
          if(updates.length>0){
            setLeases(prev=>prev.map(l=>updates.includes(l.id)?{...l,status:"executed",imported:true}:l));
            flash(`${updates.length} lease${updates.length>1?"s":""} marked as executed`);
          }
        }catch(e){console.error("Lease import error:",e);flash("Error updating leases");}
        setSaving(false);
      },true);
  };

  // ─── Balance forward (Phase 3B) ──────────────────────────────────
  const createBalanceForwards=()=>{
    const needsBalance=tenantRows.filter(r=>r.balanceOwed>0);
    const existing=new Set(charges.filter(c=>c.category==="Balance Forward").map(c=>c.roomId));
    const toCreate=needsBalance.filter(r=>!existing.has(r.roomId));
    if(toCreate.length===0)return;
    confirm("Create Balance Forwards",
      `Create ${toCreate.length} balance-forward charge${toCreate.length>1?"s":""}? These record amounts owed from your previous system.`,
      ()=>{
        toCreate.forEach(row=>{
          createCharge({
            roomId:row.roomId,tenantName:row.tenant.name,
            propName:row.propName,roomName:row.roomName,
            category:"Balance Forward",
            desc:"Balance carried from previous system",
            amount:row.balanceOwed,
            dueDate:TODAY.toISOString().split("T")[0],
            sent:true,sentDate:TODAY.toISOString().split("T")[0],
            historical:true,noLateFee:true,
          });
        });
        flash(`${toCreate.length} balance forward${toCreate.length>1?"s":""} created`);
      });
  };

  // ─── Record historical SDs (Phase 3A) ────────────────────────────
  const recordHistoricalDeposits=()=>{
    const existing=new Set((sdLedger||[]).map(s=>s.roomId));
    const toCreate=tenantRows.filter(r=>r.depositPaid&&!existing.has(r.roomId));
    if(toCreate.length===0)return;
    confirm("Record Security Deposits",
      `Record ${toCreate.length} security deposit${toCreate.length>1?"s":""} as already collected in your previous system?`,
      ()=>{
        const newEntries=toCreate.map(row=>({
          id:uid(),roomId:row.roomId,
          tenantName:row.tenant.name,propName:row.propName,roomName:row.roomName,
          amountHeld:row.depositAmount||row.rent||0,
          deposits:[{amount:row.depositAmount||row.rent||0,date:row.tenant.moveIn||TODAY.toISOString().split("T")[0],desc:"Collected in prior system (imported)"}],
          deductions:[],returned:null,historical:true,
        }));
        const updated=[...(sdLedger||[]),...newEntries];
        setSdLedger(updated);
        save("hq-sdledger",updated);
        flash(`${newEntries.length} deposit${newEntries.length>1?"s":""} recorded`);
      });
  };

  // ─── Record pre-existing payment (Phase 3D — was missing P4-1) ──
  const markChargesPaid=(chargeIds)=>{
    if(chargeIds.length===0)return;
    confirm("Mark as Already Paid",
      `Mark ${chargeIds.length} charge${chargeIds.length>1?"s":""} as paid in your previous system?`,
      ()=>{
        setCharges(prev=>{
          const updated=prev.map(c=>{
            if(!chargeIds.includes(c.id))return c;
            return{...c,amountPaid:c.amount,payments:[...(c.payments||[]),{id:uid(),amount:c.amount-c.amountPaid,method:"historical",date:TODAY.toISOString().split("T")[0],notes:"Paid in prior system (imported)"}]};
          });
          save("hq-charges",updated);
          return updated;
        });
        flash(`${chargeIds.length} charge${chargeIds.length>1?"s":""} marked as paid`);
      });
  };

  // ─── Generate charges (Phase 4) ──────────────────────────────────
  const generateCharges=()=>{
    const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
    const moLabel=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
    const existing=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate&&c.dueDate.startsWith(mk)).map(c=>c.roomId));
    const toGen=tenantRows.filter(r=>!existing.has(r.roomId)&&r.rent>0);
    if(toGen.length===0){flash("All charges already generated");return;}
    confirm("Generate Charges",
      `Generate ${moLabel} rent charges for ${toGen.length} tenant${toGen.length>1?"s":""}?`,
      ()=>{
        toGen.forEach(row=>{
          const dueDay=row.recurringDueDay||1;
          const dueDate=`${mk}-${String(dueDay).padStart(2,"0")}`;
          // Proration: daily rate = ceil(rent/30), prorated = ceil(dailyRate * days) — matches spec
          let amount=row.rent;
          let desc=`${moLabel} Rent`;
          if(row.tenant.moveIn){
            const moveIn=new Date(row.tenant.moveIn+"T00:00:00");
            if(moveIn.getMonth()===TODAY.getMonth()&&moveIn.getFullYear()===TODAY.getFullYear()&&moveIn.getDate()>dueDay){
              const calDays=new Date(moveIn.getFullYear(),moveIn.getMonth()+1,0).getDate();
              const daysLeft=calDays-moveIn.getDate()+1;
              const dailyRate=Math.ceil(row.rent/30);
              amount=Math.ceil(dailyRate*daysLeft);
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
        flash(`${toGen.length} charge${toGen.length>1?"s":""} generated`);
      });
  };

  // ─── Add one-time charge (Phase 4 — was missing P4-2) ────────────
  const[otcForm,setOtcForm]=useState({type:"",amount:"",roomIds:[]});
  const addOneTimeCharges=()=>{
    if(!otcForm.type||!otcForm.amount||otcForm.roomIds.length===0)return;
    const amt=Number(otcForm.amount);
    if(amt<=0)return;
    otcForm.roomIds.forEach(roomId=>{
      const row=tenantRows.find(r=>r.roomId===roomId);
      if(!row)return;
      createCharge({
        roomId,tenantName:row.tenant.name,
        propName:row.propName,roomName:row.roomName,
        category:otcForm.type,desc:otcForm.type,amount:amt,
        dueDate:TODAY.toISOString().split("T")[0],
        sent:true,sentDate:TODAY.toISOString().split("T")[0],
      });
    });
    flash(`${otcForm.roomIds.length} ${otcForm.type} charge${otcForm.roomIds.length>1?"s":""} created`);
    setOtcForm({type:"",amount:"",roomIds:[]});
  };

  // ─── Complete onboarding ─────────────────────────────────────────
  const completeOnboarding=()=>{
    confirm("Complete Onboarding",
      `Mark onboarding as complete for ${totalTenants} tenants across ${propRows.length} properties? The onboarding tab will be hidden.`,
      ()=>{
        const updated={...settings,onboardingActive:false,onboardingCompletedAt:TODAY.toISOString()};
        setSettings(updated);
        save("hq-settings",updated);
        if(onComplete)onComplete();
        goTab("dashboard");
      });
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return(
  <div style={{maxWidth:1100,margin:"0 auto",position:"relative"}}>
    {/* Toast */}
    {toast&&<div style={{position:"fixed",top:16,right:16,zIndex:9999,padding:"10px 18px",borderRadius:8,background:_acc,color:"#fff",fontSize:13,fontWeight:600,boxShadow:"0 4px 12px rgba(0,0,0,.15)",animation:"fadeIn .2s ease",fontFamily:"inherit"}}>{toast}</div>}

    {/* ── Phase bar ── */}
    <div style={{display:"flex",alignItems:"center",gap:0,margin:"0 0 28px",padding:"16px 0 0",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      {PHASES.map((p,i)=>{
        const st=phaseStatus(p.id);
        const active=phase===p.id;
        return(
        <div key={p.id} style={{display:"flex",alignItems:"center",flex:1,minWidth:0}}>
          <button onClick={()=>setPhase(p.id)} style={{
            display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",
            background:active?S.accBgStrong:"transparent",
            color:active?_acc:st==="done"?_acc:"inherit",opacity:active||st==="done"?1:.45,
            fontWeight:active?700:500,fontSize:13,fontFamily:"inherit",transition:"all .15s",
            minHeight:44,minWidth:44,whiteSpace:"nowrap",
          }}>
            <span style={{
              width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
              background:st==="done"?_acc:active?S.accBgStrong:"rgba(128,128,128,.12)",
              color:st==="done"?"#fff":active?_acc:"inherit",
              fontSize:11,fontWeight:700,flexShrink:0,
            }}>
              {st==="done"?<IcoCheck/>:p.id}
            </span>
            <span className="ob-phase-label">{p.label}</span>
          </button>
          {i<PHASES.length-1&&<div style={{flex:1,height:2,background:st==="done"?_acc:"rgba(128,128,128,.15)",margin:"0 4px",borderRadius:1,minWidth:8}}/>}
        </div>);
      })}
    </div>

    {/* Progress summary */}
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(128,128,128,.04)",borderRadius:10,marginBottom:24,border:"1px solid rgba(128,128,128,.1)"}}>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Onboarding Progress</div>
        <div style={{height:6,background:"rgba(128,128,128,.1)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(completedPhases/5)*100}%`,background:_acc,borderRadius:3,transition:"width .3s"}}/>
        </div>
      </div>
      <div style={{fontSize:12,opacity:.5,fontWeight:500}}>{completedPhases} of 5 phases</div>
    </div>

    {/* ═══ PHASE 1: Properties ═══ */}
    {phase===1&&<Phase1Properties
      propRows={propRows} utilTemplates={utilTemplates} settings={settings}
      sel={sel} setSel={setSel} updateUnit={updateUnit} bulkUpdateUnits={bulkUpdateUnits}
      S={S} _acc={_acc} phase1Done={phase1Done} setPhase={setPhase} flash={flash}
    />}

    {/* ═══ PHASE 2: Tenants ═══ */}
    {phase===2&&<Phase2Tenants
      tenantRows={tenantRows} sel={sel} setSel={setSel} toggleSel={toggleSel} toggleAll={toggleAll}
      expandedId={expandedId} setExpandedId={setExpandedId}
      bulkApplyToSelected={bulkApplyToSelected}
      updateRoom={updateRoom} completeTenants={completeTenants} totalTenants={totalTenants}
      S={S} _acc={_acc} TODAY={TODAY} setPhase={setPhase} flash={flash}
    />}

    {/* ═══ PHASE 3: Historical Data ═══ */}
    {phase===3&&<Phase3History
      tenantRows={tenantRows} charges={charges} sdLedger={sdLedger} leases={leases}
      createBalanceForwards={createBalanceForwards} recordHistoricalDeposits={recordHistoricalDeposits}
      markLeasesExecuted={markLeasesExecuted} markChargesPaid={markChargesPaid}
      saving={saving}
      S={S} _acc={_acc} setPhase={setPhase} fmtS={fmtS}
    />}

    {/* ═══ PHASE 4: Charges ═══ */}
    {phase===4&&<Phase4Charges
      tenantRows={tenantRows} charges={charges} TODAY={TODAY}
      generateCharges={generateCharges} phase4Done={phase4Done}
      otcForm={otcForm} setOtcForm={setOtcForm} addOneTimeCharges={addOneTimeCharges}
      S={S} _acc={_acc} setPhase={setPhase} fmtS={fmtS}
    />}

    {/* ═══ PHASE 5: Go Live ═══ */}
    {phase===5&&<Phase5GoLive
      propRows={propRows} tenantRows={tenantRows} charges={charges} sdLedger={sdLedger} leases={leases}
      phase1Done={phase1Done} phase2Done={phase2Done} phase3Done={phase3Done} phase4Done={phase4Done}
      completeOnboarding={completeOnboarding} TODAY={TODAY}
      S={S} _acc={_acc} fmtS={fmtS} completeTenants={completeTenants} totalTenants={totalTenants}
    />}
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1 — Property Finalization
// ═══════════════════════════════════════════════════════════════════════
function Phase1Properties({propRows,utilTemplates,settings,sel,setSel,updateUnit,bulkUpdateUnits,S,_acc,phase1Done,setPhase,flash}){
  const[bulkUtil,setBulkUtil]=useState("");
  const[bulkDueDay,setBulkDueDay]=useState("");
  const[expanded,setExpanded]=useState(null);

  const unitIds=propRows.flatMap(p=>p.units.map(u=>u.id));
  const selUnits=sel;

  const toggleUnitSel=(unitId)=>setSel(p=>p.includes(unitId)?p.filter(x=>x!==unitId):[...p,unitId]);

  // Atomic bulk apply — fixes P0-4
  const bulkApply=(field,value)=>{
    if(!value)return;
    const patches=[];
    selUnits.forEach(unitId=>{
      const pr=propRows.find(p=>p.units.some(u=>u.id===unitId));
      if(!pr)return;
      if(field==="utils")patches.push({propId:pr.id,unitId,patch:{utils:value}});
      else if(field==="dueDay"){
        // Set recurringDueDay on all rooms in this unit
        patches.push({propId:pr.id,unitId,patch:{}});// unit-level placeholder
      }
    });
    if(field==="utils"&&patches.length>0){
      bulkUpdateUnits(patches);
      flash(`Utility template applied to ${patches.length} unit${patches.length>1?"s":""}`);
    }
    setSel([]);setBulkUtil("");setBulkDueDay("");
  };

  return(
  <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
      <div>
        <h2 style={{fontSize:18,fontWeight:700,margin:0}}>Property Configuration</h2>
        <p style={{fontSize:13,opacity:.45,margin:"4px 0 0"}}>Set utility templates and defaults for each property/unit</p>
      </div>
      {phase1Done&&<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Complete</span>}
    </div>

    {/* Bulk toolbar */}
    {selUnits.length>0&&(
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:S.accBg,border:`1px solid ${S.accBorder}`,borderRadius:8,marginBottom:12,flexWrap:"wrap"}}>
      <span style={{fontSize:12,fontWeight:600,color:_acc}}>{selUnits.length} unit{selUnits.length>1?"s":""} selected</span>
      <select value={bulkUtil} onChange={e=>setBulkUtil(e.target.value)} style={{...S.INPUT,width:"auto",minWidth:160}}>
        <option value="">Set utility template...</option>
        {utilTemplates.map(t=><option key={t.key} value={t.key}>{t.name}</option>)}
      </select>
      {bulkUtil&&<button onClick={()=>bulkApply("utils",bulkUtil)} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:11,minHeight:44,padding:"0 16px"}}>Apply to {selUnits.length}</button>}
      <button onClick={()=>setSel([])} style={{fontSize:11,opacity:.4,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",minHeight:44}}>Clear</button>
    </div>)}

    {/* Property table — scrollable on mobile */}
    <div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,overflow:"hidden"}}>
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:600}}>
        <thead>
          <tr style={{background:"rgba(128,128,128,.04)"}}>
            <th style={{...S.TH,width:44}}><input type="checkbox" checked={selUnits.length===unitIds.length&&unitIds.length>0} onChange={()=>setSel(selUnits.length===unitIds.length?[]:unitIds)} style={{width:18,height:18}}/></th>
            <th style={S.TH}>Property</th>
            <th style={S.TH}>Unit</th>
            <th style={S.TH}>Mode</th>
            <th style={S.TH}>Rooms</th>
            <th style={S.TH}>Utility Template</th>
            <th style={{...S.TH,width:44}}></th>
          </tr>
        </thead>
        <tbody>
          {propRows.map(p=>p.units.map(u=>{
            const isExp=expanded===u.id;
            const hasUtil=!!u.utils;
            return[
            <tr key={u.id} style={{borderTop:"1px solid rgba(128,128,128,.08)"}}>
              <td style={S.TD}><input type="checkbox" checked={selUnits.includes(u.id)} onChange={()=>toggleUnitSel(u.id)} style={{width:18,height:18}}/></td>
              <td style={{...S.TD,fontWeight:600}}>{p.displayName}</td>
              <td style={S.TD}>{u.name||"Main"}</td>
              <td style={S.TD}><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:"rgba(128,128,128,.08)"}}>{(u.rentalMode||"byRoom")==="wholeHouse"?"Whole Unit":"By Room"}</span></td>
              <td style={S.TD}>{(u.rooms||[]).length}</td>
              <td style={S.TD}>
                <select value={u.utils||""} onChange={e=>updateUnit(p.id,u.id,{utils:e.target.value})}
                  style={{...S.INPUT,width:"auto",minWidth:160,border:hasUtil?"1px solid rgba(128,128,128,.25)":`1.5px solid ${S.red}`,background:hasUtil?"":"rgba(196,92,74,.04)"}}>
                  <option value="">Select template...</option>
                  {utilTemplates.map(t=><option key={t.key} value={t.key}>{t.name}</option>)}
                </select>
              </td>
              <td style={S.TD}>
                <button onClick={()=>setExpanded(isExp?null:u.id)} style={{background:"none",border:"none",cursor:"pointer",minHeight:44,minWidth:44,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <IcoExpand open={isExp}/>
                </button>
              </td>
            </tr>,
            isExp&&(u.rooms||[]).map(r=>(
            <tr key={r.id} style={{background:"rgba(128,128,128,.03)"}}>
              <td style={S.TD}></td>
              <td style={{...S.TD,paddingLeft:32,opacity:.6,fontSize:12}}>{r.name}</td>
              <td style={{...S.TD,fontSize:12,opacity:.6}}>{r.st==="occupied"?r.tenant?.name||"Occupied":"Vacant"}</td>
              <td style={S.TD}></td>
              <td style={{...S.TD,fontSize:12}}>{r.rent?fmtS(r.rent):"\u2014"}</td>
              <td style={{...S.TD,fontSize:12,opacity:.6}}>{r.utils?UTIL_LABELS[r.utils]||r.utils:"Inherits unit"}</td>
              <td style={S.TD}></td>
            </tr>))];
          }))}
        </tbody>
      </table>
      </div>
    </div>

    {/* Next */}
    <div style={{display:"flex",justifyContent:"flex-end",marginTop:20}}>
      <button onClick={()=>setPhase(2)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13,minHeight:44}}>
        Tenants <IcoArrow/>
      </button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 2 — Tenant Finalization
// ═══════════════════════════════════════════════════════════════════════
function Phase2Tenants({tenantRows,sel,setSel,toggleSel,toggleAll,expandedId,setExpandedId,bulkApplyToSelected,updateRoom,completeTenants,totalTenants,S,_acc,TODAY,setPhase,flash}){
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

  const counts={
    incomplete:tenantRows.filter(r=>!r.complete).length,
    expired:tenantRows.filter(r=>r.isExpired).length,
    noEmail:tenantRows.filter(r=>!r.tenant.email).length,
    noRent:tenantRows.filter(r=>!r.rent).length,
    noPhone:tenantRows.filter(r=>!r.hasPhone).length,
  };

  return(
  <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8}}>
      <div>
        <h2 style={{fontSize:18,fontWeight:700,margin:0}}>Tenant Finalization</h2>
        <p style={{fontSize:13,opacity:.45,margin:"4px 0 0"}}>Review and complete tenant profiles. {completeTenants} of {totalTenants} ready.</p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:80,height:6,background:"rgba(128,128,128,.1)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${totalTenants?(completeTenants/totalTenants)*100:0}%`,background:completeTenants===totalTenants?_acc:"#d4a853",borderRadius:3,transition:"width .3s"}}/>
        </div>
        <span style={{fontSize:12,fontWeight:600,color:completeTenants===totalTenants?_acc:"inherit",opacity:completeTenants===totalTenants?1:.5}}>{completeTenants}/{totalTenants}</span>
      </div>
    </div>

    {/* Expired lease alert */}
    {counts.expired>0&&(
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:S.redBg,border:`1px solid ${S.redBorder}`,borderRadius:8,marginBottom:12,flexWrap:"wrap"}}>
      <span style={{color:S.red}}><IcoWarn/></span>
      <span style={{fontSize:12,color:S.red,fontWeight:500}}>{counts.expired} tenant{counts.expired>1?"s":""} with expired leases{"\u2014"}consider flagging as month-to-month</span>
      <button onClick={()=>setFilter("expired")} style={{fontSize:11,color:S.red,fontWeight:600,background:"none",border:"none",cursor:"pointer",marginLeft:"auto",fontFamily:"inherit",minHeight:44}}>Show</button>
    </div>)}

    {/* Filters — with counts (P3-3) */}
    <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
      {[["all",`All (${totalTenants})`],["incomplete",`Incomplete (${counts.incomplete})`],["expired",`Expired (${counts.expired})`],["missing-email",`No Email (${counts.noEmail})`],["missing-rent",`No Rent (${counts.noRent})`],["missing-phone",`No Phone (${counts.noPhone})`]].map(([k,l])=>(
        <button key={k} onClick={()=>setFilter(k)} style={{
          fontSize:11,padding:"8px 14px",borderRadius:6,border:"1px solid",fontFamily:"inherit",cursor:"pointer",fontWeight:filter===k?600:400,
          borderColor:filter===k?_acc:"rgba(128,128,128,.15)",color:filter===k?_acc:"inherit",opacity:filter===k?1:.5,
          background:filter===k?S.accBg:"transparent",minHeight:36,
        }}>{l}</button>
      ))}
    </div>

    {/* Bulk toolbar */}
    {sel.length>0&&(
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:S.accBg,border:`1px solid ${S.accBorder}`,borderRadius:8,marginBottom:12,flexWrap:"wrap"}}>
      <span style={{fontSize:12,fontWeight:600,color:_acc}}>{sel.length} selected</span>
      <select value={bulkType} onChange={e=>{setBulkType(e.target.value);setBulkVal("");}} style={{...S.INPUT,width:"auto"}}>
        <option value="">Bulk action...</option>
        <option value="rent">Set rent</option>
        <option value="moveIn">Set move-in date</option>
        <option value="leaseEnd">Set lease end</option>
        <option value="recurringDueDay">Set due day</option>
        <option value="m2m">Flag as month-to-month</option>
        <option value="lateFeeExempt">Exempt from late fees</option>
        <option value="occupation">Set occupation</option>
      </select>
      {bulkType&&bulkType!=="m2m"&&bulkType!=="lateFeeExempt"&&(
        bulkType==="recurringDueDay"
          ?<select value={bulkVal} onChange={e=>setBulkVal(e.target.value)} style={{...S.INPUT,width:"auto"}}>
            <option value="">Day...</option>
            {Array.from({length:28},(_,i)=><option key={i+1} value={i+1}>{ordinal(i+1)}</option>)}
          </select>
          :bulkType==="occupation"
          ?<select value={bulkVal} onChange={e=>setBulkVal(e.target.value)} style={{...S.INPUT,width:"auto"}}>
            <option value="">Type...</option>
            {OCC_TYPES.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
          :<input type={bulkType==="rent"?"number":"date"} value={bulkVal} onChange={e=>setBulkVal(e.target.value)} placeholder={bulkType==="rent"?"Amount":""}
            style={{...S.INPUT,width:bulkType==="rent"?100:150}}/>
      )}
      {(bulkType==="m2m"||bulkType==="lateFeeExempt"||bulkVal)&&(
        <button onClick={()=>{bulkApplyToSelected(bulkType,bulkVal);setBulkType("");setBulkVal("");}} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:11,minHeight:44,padding:"0 16px"}}>
          Apply to {sel.length}
        </button>
      )}
      <button onClick={()=>{setSel([]);setBulkType("");setBulkVal("");}} style={{fontSize:11,opacity:.4,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",marginLeft:"auto",minHeight:44}}>Clear</button>
    </div>)}

    {/* Tenant table */}
    <div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,overflow:"hidden"}}>
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:700}}>
        <thead>
          <tr style={{background:"rgba(128,128,128,.04)"}}>
            <th style={{...S.TH,width:44}}><input type="checkbox" checked={sel.length===filtered.length&&filtered.length>0} onChange={()=>toggleAll(filtered)} style={{width:18,height:18}}/></th>
            <th style={S.TH}>Tenant</th>
            <th style={S.TH}>Property</th>
            <th style={S.TH}>Room</th>
            <th style={S.TH}>Rent</th>
            <th style={S.TH}>Move-in</th>
            <th style={S.TH}>Lease End</th>
            <th style={S.TH}>Status</th>
            <th style={{...S.TH,width:44}}></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(row=>{
            const isExp=expandedId===row.roomId;
            return[
            <tr key={row.roomId} style={{borderTop:"1px solid rgba(128,128,128,.08)",cursor:"pointer",background:isExp?"rgba(128,128,128,.03)":"transparent"}} onClick={()=>setExpandedId(isExp?null:row.roomId)}>
              <td style={S.TD} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={sel.includes(row.roomId)} onChange={()=>toggleSel(row.roomId)} style={{width:18,height:18}}/></td>
              <td style={{...S.TD,fontWeight:600}}>{row.tenant.name||"\u2014"}</td>
              <td style={{...S.TD,fontSize:12}}>{row.propName}</td>
              <td style={{...S.TD,fontSize:12}}>{row.roomName}</td>
              <td style={S.TD}>{row.rent?fmtS(row.rent):"\u2014"}</td>
              <td style={{...S.TD,fontSize:12}}>{fmtD(row.tenant.moveIn)}</td>
              <td style={{...S.TD,fontSize:12}}>{row.m2m?<span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:S.goldBg,color:S.gold,fontWeight:600}}>M2M</span>:fmtD(row.le)}</td>
              <td style={S.TD}>
                {row.complete
                  ?<span style={{fontSize:11,color:_acc,fontWeight:600,display:"flex",alignItems:"center",gap:3}}><IcoCheck/> Ready</span>
                  :row.isExpired
                    ?<span style={{fontSize:11,color:S.red,fontWeight:500}}>Expired</span>
                    :<span style={{fontSize:11,opacity:.4}}>Missing: {row.missing.join(", ")}</span>}
              </td>
              <td style={S.TD}><IcoExpand open={isExp}/></td>
            </tr>,
            isExp&&<tr key={row.roomId+"-exp"}><td colSpan={9} style={{padding:0}}>
              <TenantDetail row={row} updateRoom={updateRoom} S={S} _acc={_acc} TODAY={TODAY} flash={flash}/>
            </td></tr>];
          })}
          {filtered.length===0&&<tr><td colSpan={9} style={{...S.TD,textAlign:"center",opacity:.35,padding:24}}>No tenants match this filter</td></tr>}
        </tbody>
      </table>
      </div>
    </div>

    {/* Nav */}
    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>setPhase(1)} className="btn btn-out" style={{fontSize:13,minHeight:44}}>Back</button>
      <button onClick={()=>setPhase(3)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13,minHeight:44}}>
        Historical Data <IcoArrow/>
      </button>
    </div>
  </div>);
}

// ─── Tenant Detail (inline expand) ──────────────────────────────────
function TenantDetail({row,updateRoom,S,_acc,TODAY,flash}){
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
    recurringDueDay:row.recurringDueDay||"",
    lateFeeExempt:row.lateConfig?!row.lateConfig.enabled:false,
    coSignerName:row.coSigner?.name||"",
    coSignerPhone:row.coSigner?.phone||"",
    coSignerEmail:row.coSigner?.email||"",
    coSignerRelation:row.coSigner?.relation||"",
    paymentPlanActive:row.paymentPlan?.active||false,
    paymentPlanNotes:row.paymentPlan?.notes||"",
  });
  const[errors,setErrors]=useState({});
  const[dirty,setDirty]=useState(false);
  const formRef=useRef(form);
  formRef.current=form;

  // Track dirty state for unsaved changes warning (P1-1)
  const setField=(key,val)=>{setForm(f=>{const n={...f,[key]:val};return n;});setDirty(true);setErrors(e=>({...e,[key]:undefined}));};

  // Validation with wiggle + red text (P1-2)
  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Name is required";
    if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))e.email="Invalid email format";
    if(form.doorCode&&!/^\d{4}$/.test(form.doorCode))e.doorCode="Must be exactly 4 digits";
    if(form.rent&&Number(form.rent)<=0)e.rent="Rent must be greater than zero";
    setErrors(e);
    if(Object.keys(e).length>0){
      // Wiggle animation
      const el=document.querySelector(".ob-tenant-detail");
      if(el){el.style.animation="none";el.offsetHeight;el.style.animation="shake .4s ease";}
    }
    return Object.keys(e).length===0;
  };

  const saveDetail=()=>{
    if(!validate())return;
    updateRoom(row.propId,row.unitId,row.roomId,r=>({
      ...r,
      rent:Number(form.rent)||r.rent,
      le:form.m2m?null:form.le,
      m2m:form.m2m,
      recurringDueDay:form.recurringDueDay?Number(form.recurringDueDay):null,
      lateConfig:{...(r.lateConfig||{}),enabled:!form.lateFeeExempt},
      paymentPlan:form.paymentPlanActive?{active:true,notes:form.paymentPlanNotes}:null,
      tenant:{
        ...r.tenant,
        name:form.name,email:form.email,phone:form.phone,
        moveIn:form.moveIn,occupationType:form.occupation,doorCode:form.doorCode,
        coSigner:(form.coSignerName?{name:form.coSignerName,phone:form.coSignerPhone,email:form.coSignerEmail,relation:form.coSignerRelation}:null),
      },
    }));
    setDirty(false);
    flash("Saved");
  };

  const fld=(label,key,type="text",opts={})=>{
    const hasErr=!!errors[key];
    return(
    <div style={{flex:opts.flex||1,minWidth:opts.minWidth||120}}>
      <label style={{fontSize:11,fontWeight:500,opacity:.45,marginBottom:3,display:"block"}}>{label}</label>
      {type==="select"
        ?<select value={form[key]} onChange={e=>setField(key,e.target.value)} style={{...S.INPUT,border:hasErr?`1.5px solid ${S.red}`:S.INPUT.border}}>
          <option value="">{opts.placeholder||"Select..."}</option>
          {(opts.options||[]).map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        :<input type={type} value={form[key]} onChange={e=>setField(key,e.target.value)} placeholder={opts.placeholder||""} style={{...S.INPUT,border:hasErr?`1.5px solid ${S.red}`:S.INPUT.border}}/>}
      {hasErr&&<div style={{fontSize:11,color:S.red,marginTop:2,fontWeight:500}}>{errors[key]}</div>}
    </div>);
  };

  return(
  <div className="ob-tenant-detail" style={{padding:"16px 20px 20px",background:"rgba(128,128,128,.03)",borderTop:"1px solid rgba(128,128,128,.06)"}}>
    {dirty&&<div style={{fontSize:11,color:S.gold,fontWeight:500,marginBottom:8}}>Unsaved changes</div>}
    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:14}}>
      {fld("Name","name")}
      {fld("Email","email","email")}
      {fld("Phone","phone","tel")}
      {fld("Occupation","occupation","select",{options:OCC_TYPES})}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:14}}>
      {fld("Monthly Rent","rent","number",{minWidth:100})}
      {fld("Door Code (4-digit)","doorCode","text",{minWidth:100})}
      {fld("Move-in Date","moveIn","date")}
      {!form.m2m&&fld("Lease End","le","date")}
      <div style={{flex:1,minWidth:100,display:"flex",alignItems:"flex-end",gap:8}}>
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",paddingBottom:6,minHeight:44}}>
          <input type="checkbox" checked={form.m2m} onChange={e=>setField("m2m",e.target.checked)} style={{width:18,height:18}}/>
          Month-to-month
        </label>
      </div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:14}}>
      <div style={{flex:1,minWidth:120}}>
        <label style={{fontSize:11,fontWeight:500,opacity:.45,marginBottom:3,display:"block"}}>Rent Due Day</label>
        <select value={form.recurringDueDay} onChange={e=>setField("recurringDueDay",e.target.value)} style={S.INPUT}>
          <option value="">1st (default)</option>
          {Array.from({length:28},(_,i)=><option key={i+1} value={i+1}>{ordinal(i+1)}</option>)}
        </select>
      </div>
      <div style={{flex:1,minWidth:120,display:"flex",alignItems:"flex-end",gap:12,paddingBottom:2}}>
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",minHeight:44}}>
          <input type="checkbox" checked={form.lateFeeExempt} onChange={e=>setField("lateFeeExempt",e.target.checked)} style={{width:18,height:18}}/>
          Late fee exempt
        </label>
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",minHeight:44}}>
          <input type="checkbox" checked={form.paymentPlanActive} onChange={e=>setField("paymentPlanActive",e.target.checked)} style={{width:18,height:18}}/>
          Payment plan
        </label>
      </div>
    </div>
    {form.paymentPlanActive&&(
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:500,opacity:.45,marginBottom:3,display:"block"}}>Payment Plan Notes</label>
        <input type="text" value={form.paymentPlanNotes} onChange={e=>setField("paymentPlanNotes",e.target.value)} placeholder="e.g. $200/mo extra until balance paid" style={{...S.INPUT,width:"100%"}}/>
      </div>
    )}

    {/* Co-signer */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:12,fontWeight:600,opacity:.6,marginBottom:8}}>Co-Signer</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        {fld("Name","coSignerName","text",{placeholder:"Full name"})}
        {fld("Phone","coSignerPhone","tel")}
        {fld("Email","coSignerEmail","email")}
        {fld("Relation","coSignerRelation","select",{options:["Parent","Spouse","Sibling","Employer","Other"]})}
      </div>
    </div>

    {/* Save */}
    <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
      <button onClick={saveDetail} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44,padding:"0 20px"}}>Save Changes</button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 3 — Historical Data
// ═══════════════════════════════════════════════════════════════════════
function Phase3History({tenantRows,charges,sdLedger,leases,createBalanceForwards,recordHistoricalDeposits,markLeasesExecuted,markChargesPaid,saving,S,_acc,setPhase,fmtS}){
  const needsBalance=tenantRows.filter(r=>r.balanceOwed>0);
  const hasBalanceCharges=charges.some(c=>c.category==="Balance Forward");
  const needsDeposit=tenantRows.filter(r=>r.depositPaid);
  const existingSdIds=new Set((sdLedger||[]).map(s=>s.roomId));
  const depositsRecorded=needsDeposit.length===0||needsDeposit.every(r=>existingSdIds.has(r.roomId));
  const draftLeases=leases.filter(l=>l.status==="draft");
  const executedImported=leases.filter(l=>l.status==="executed"&&l.imported);

  // Phase 3D: Find import-created charges that might already be paid in old system
  const importCharges=charges.filter(c=>(c.category==="Rent"||c.category==="Security Deposit")&&c.amountPaid<c.amount&&!c.historical);
  const[selCharges,setSelCharges]=useState([]);

  const noHistory=needsBalance.length===0&&needsDeposit.length===0&&draftLeases.length===0&&importCharges.length===0;

  return(
  <div>
    <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 4px"}}>Historical Data Import</h2>
    <p style={{fontSize:13,opacity:.45,margin:"0 0 20px"}}>Record pre-existing deposits, balances, and leases from your previous system</p>

    {noHistory&&(
    <div style={{padding:"32px 20px",textAlign:"center",background:"rgba(128,128,128,.04)",borderRadius:10,marginBottom:20}}>
      <div style={{fontSize:14,opacity:.5,marginBottom:4}}>No historical data to import</div>
      <div style={{fontSize:12,opacity:.35}}>All imported tenants appear to be new{"\u2014"}skip to charges</div>
    </div>)}

    {/* 3A: Security Deposits */}
    {needsDeposit.length>0&&(
    <div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,padding:16,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:14,fontWeight:600}}>Security Deposits</div>
          <div style={{fontSize:12,opacity:.4}}>{needsDeposit.length} tenant{needsDeposit.length>1?"s":""} with deposits from prior system</div>
        </div>
        {depositsRecorded
          ?<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Recorded</span>
          :<button onClick={recordHistoricalDeposits} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44}}>Record All Deposits</button>}
      </div>
      <div style={{fontSize:12,opacity:.5,background:"rgba(128,128,128,.04)",padding:"8px 12px",borderRadius:6}}>
        {needsDeposit.map(r=>(
          <div key={r.roomId} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(128,128,128,.06)"}}>
            <span>{r.tenant.name}</span>
            <span style={{fontWeight:500}}>{fmtS(r.depositAmount||r.rent)}</span>
          </div>
        ))}
      </div>
    </div>)}

    {/* 3B: Balance Forwards */}
    {needsBalance.length>0&&(
    <div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,padding:16,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:14,fontWeight:600}}>Outstanding Balances</div>
          <div style={{fontSize:12,opacity:.4}}>{needsBalance.length} tenant{needsBalance.length>1?"s":""} with balances from prior system</div>
        </div>
        {hasBalanceCharges
          ?<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Recorded</span>
          :<button onClick={createBalanceForwards} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44}}>Create Balance Forwards</button>}
      </div>
      <div style={{fontSize:12,opacity:.5,background:"rgba(128,128,128,.04)",padding:"8px 12px",borderRadius:6}}>
        {needsBalance.map(r=>(
          <div key={r.roomId} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(128,128,128,.06)"}}>
            <span>{r.tenant.name}</span>
            <span style={{fontWeight:500,color:S.red}}>{fmtS(r.balanceOwed)}</span>
          </div>
        ))}
      </div>
    </div>)}

    {/* 3C: Existing Leases */}
    {draftLeases.length>0&&(
    <div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,padding:16,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:14,fontWeight:600}}>Existing Leases</div>
          <div style={{fontSize:12,opacity:.4}}>{draftLeases.length} draft lease{draftLeases.length>1?"s":""} from import{"\u2014"}mark as already executed</div>
        </div>
        <button onClick={markLeasesExecuted} disabled={saving} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,opacity:saving?.6:1,minHeight:44}}>
          {saving?"Updating...":"Mark All as Executed"}
        </button>
      </div>
      <div style={{fontSize:11,opacity:.4,background:S.goldBg,padding:"8px 12px",borderRadius:6,border:`1px solid rgba(128,128,128,.08)`}}>
        These leases will be marked as &ldquo;Executed (Imported)&rdquo; without requiring signatures. They record the key terms from your previous system.
      </div>
    </div>)}

    {executedImported.length>0&&(
    <div style={{padding:"10px 14px",background:S.accBg,borderRadius:8,marginBottom:16,fontSize:12,color:_acc,fontWeight:500,display:"flex",alignItems:"center",gap:6}}>
      <IcoCheck/> {executedImported.length} lease{executedImported.length>1?"s":""} marked as imported
    </div>)}

    {/* 3D: Pre-existing payments (P4-1 — was missing) */}
    {importCharges.length>0&&(
    <div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,padding:16,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:14,fontWeight:600}}>Pre-Existing Payments</div>
          <div style={{fontSize:12,opacity:.4}}>Mark charges that were already paid in your old system</div>
        </div>
        {selCharges.length>0&&(
          <button onClick={()=>{markChargesPaid(selCharges);setSelCharges([]);}} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44}}>
            Mark {selCharges.length} as Paid
          </button>
        )}
      </div>
      <div style={{fontSize:12,background:"rgba(128,128,128,.04)",padding:"8px 12px",borderRadius:6,maxHeight:200,overflowY:"auto"}}>
        {importCharges.map(c=>(
          <label key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid rgba(128,128,128,.06)",cursor:"pointer",minHeight:36}}>
            <input type="checkbox" checked={selCharges.includes(c.id)} onChange={e=>setSelCharges(prev=>e.target.checked?[...prev,c.id]:prev.filter(x=>x!==c.id))} style={{width:18,height:18}}/>
            <span style={{flex:1}}>{c.tenantName} {"\u2014"} {c.category}</span>
            <span style={{fontWeight:500}}>{fmtS(c.amount)}</span>
            <span style={{fontSize:11,opacity:.4}}>{c.dueDate}</span>
          </label>
        ))}
      </div>
    </div>)}

    {/* Nav */}
    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>setPhase(2)} className="btn btn-out" style={{fontSize:13,minHeight:44}}>Back</button>
      <button onClick={()=>setPhase(4)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13,minHeight:44}}>
        Charges <IcoArrow/>
      </button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 4 — Charge Structure
// ═══════════════════════════════════════════════════════════════════════
function Phase4Charges({tenantRows,charges,TODAY,generateCharges,phase4Done,otcForm,setOtcForm,addOneTimeCharges,S,_acc,setPhase,fmtS}){
  const mk=`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}`;
  const moLabel=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
  const existingRoomIds=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate&&c.dueDate.startsWith(mk)).map(c=>c.roomId));

  // Preview what will be generated — with correct proration (P2-6)
  const preview=tenantRows.filter(r=>r.rent>0).map(row=>{
    const dueDay=row.recurringDueDay||1;
    let amount=row.rent;
    let prorated=false;
    let days=0;
    if(row.tenant.moveIn){
      const moveIn=new Date(row.tenant.moveIn+"T00:00:00");
      if(moveIn.getMonth()===TODAY.getMonth()&&moveIn.getFullYear()===TODAY.getFullYear()&&moveIn.getDate()>dueDay){
        const calDays=new Date(moveIn.getFullYear(),moveIn.getMonth()+1,0).getDate();
        days=calDays-moveIn.getDate()+1;
        const dailyRate=Math.ceil(row.rent/30);
        amount=Math.ceil(dailyRate*days);
        prorated=true;
      }
    }
    return{...row,dueDay,chargeAmount:amount,prorated,days,alreadyExists:existingRoomIds.has(row.roomId)};
  });

  return(
  <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:8}}>
      <div>
        <h2 style={{fontSize:18,fontWeight:700,margin:0}}>Charge Generation</h2>
        <p style={{fontSize:13,opacity:.45,margin:"4px 0 0"}}>{moLabel} rent charges for all active tenants</p>
      </div>
      {phase4Done
        ?<span style={{fontSize:12,fontWeight:600,color:_acc,display:"flex",alignItems:"center",gap:4}}><IcoCheck/> Generated</span>
        :<button onClick={generateCharges} className="btn" style={{background:_acc,color:"#fff",fontSize:13,minHeight:44}}>Generate All Charges</button>}
    </div>

    {/* Preview table */}
    <div style={{border:"1px solid rgba(128,128,128,.12)",borderRadius:10,overflow:"hidden",marginTop:16}}>
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:600}}>
        <thead>
          <tr style={{background:"rgba(128,128,128,.04)"}}>
            <th style={S.TH}>Tenant</th>
            <th style={S.TH}>Property</th>
            <th style={S.TH}>Rent</th>
            <th style={S.TH}>Due Day</th>
            <th style={S.TH}>Amount</th>
            <th style={S.TH}>Prorated</th>
            <th style={S.TH}>Status</th>
          </tr>
        </thead>
        <tbody>
          {preview.map(row=>(
          <tr key={row.roomId} style={{borderTop:"1px solid rgba(128,128,128,.08)"}}>
            <td style={{...S.TD,fontWeight:500}}>{row.tenant.name}</td>
            <td style={{...S.TD,fontSize:12}}>{row.propName}</td>
            <td style={S.TD}>{fmtS(row.rent)}</td>
            <td style={S.TD}>{ordinal(row.dueDay)}</td>
            <td style={{...S.TD,fontWeight:600}}>{fmtS(row.chargeAmount)}</td>
            <td style={S.TD}>{row.prorated?<span style={{fontSize:11,color:S.gold}}>{row.days} days</span>:"\u2014"}</td>
            <td style={S.TD}>{row.alreadyExists?<span style={{fontSize:11,color:_acc,fontWeight:500,display:"flex",alignItems:"center",gap:3}}><IcoCheck/> Created</span>:<span style={{fontSize:11,opacity:.35}}>Pending</span>}</td>
          </tr>))}
          {preview.length===0&&<tr><td colSpan={7} style={{...S.TD,textAlign:"center",opacity:.35,padding:24}}>No tenants with rent amounts set</td></tr>}
        </tbody>
      </table>
      </div>
    </div>

    {/* Late fee summary */}
    <div style={{marginTop:16,padding:16,background:"rgba(128,128,128,.04)",borderRadius:10,border:"1px solid rgba(128,128,128,.08)"}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Late Fee Configuration</div>
      {(()=>{
        const exempt=tenantRows.filter(r=>r.lateConfig&&!r.lateConfig.enabled);
        return(
        <div style={{fontSize:12,opacity:.6}}>
          <div>Default: $50 after 3rd, +$5/day</div>
          {exempt.length>0&&<div style={{marginTop:4,color:S.gold}}>Exempt: {exempt.map(r=>r.tenant.name).join(", ")}</div>}
        </div>);
      })()}
    </div>

    {/* One-time charges (P4-2 — was missing) */}
    <div style={{marginTop:16,padding:16,background:"rgba(128,128,128,.04)",borderRadius:10,border:"1px solid rgba(128,128,128,.08)"}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>One-Time Charges</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
        <div>
          <label style={{fontSize:11,opacity:.45,display:"block",marginBottom:3}}>Type</label>
          <select value={otcForm.type} onChange={e=>setOtcForm(f=>({...f,type:e.target.value}))} style={{...S.INPUT,width:"auto",minWidth:140}}>
            <option value="">Select...</option>
            {ONETIMECHARGE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={{fontSize:11,opacity:.45,display:"block",marginBottom:3}}>Amount</label>
          <input type="number" value={otcForm.amount} onChange={e=>setOtcForm(f=>({...f,amount:e.target.value}))} placeholder="$" style={{...S.INPUT,width:90}}/>
        </div>
        <div>
          <label style={{fontSize:11,opacity:.45,display:"block",marginBottom:3}}>Apply to</label>
          <select value="" onChange={e=>{if(e.target.value)setOtcForm(f=>({...f,roomIds:[...new Set([...f.roomIds,e.target.value])]}));}} style={{...S.INPUT,width:"auto",minWidth:160}}>
            <option value="">Add tenant...</option>
            {tenantRows.map(r=><option key={r.roomId} value={r.roomId}>{r.tenant.name}</option>)}
          </select>
        </div>
        {otcForm.roomIds.length>0&&(
          <button onClick={addOneTimeCharges} className="btn btn-sm" style={{background:_acc,color:"#fff",fontSize:12,minHeight:44}}>
            Create {otcForm.roomIds.length} charge{otcForm.roomIds.length>1?"s":""}
          </button>
        )}
      </div>
      {otcForm.roomIds.length>0&&(
        <div style={{marginTop:8,fontSize:12,opacity:.5}}>
          {otcForm.roomIds.map(rid=>{const r=tenantRows.find(x=>x.roomId===rid);return r?r.tenant.name:"";}).filter(Boolean).join(", ")}
          <button onClick={()=>setOtcForm(f=>({...f,roomIds:[]}))} style={{marginLeft:8,fontSize:11,opacity:.4,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>clear</button>
        </div>
      )}
    </div>

    {/* Nav */}
    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>setPhase(3)} className="btn btn-out" style={{fontSize:13,minHeight:44}}>Back</button>
      <button onClick={()=>setPhase(5)} className="btn" style={{background:_acc,color:"#fff",display:"flex",alignItems:"center",gap:6,fontSize:13,minHeight:44}}>
        Go Live <IcoArrow/>
      </button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 5 — Go Live Checklist
// ═══════════════════════════════════════════════════════════════════════
function Phase5GoLive({propRows,tenantRows,charges,sdLedger,leases,phase1Done,phase2Done,phase3Done,phase4Done,completeOnboarding,TODAY,S,_acc,fmtS,completeTenants,totalTenants}){
  const allReady=phase1Done&&phase2Done&&phase4Done;
  const moLabel=TODAY.toLocaleString("default",{month:"long",year:"numeric"});

  const missingPhone=tenantRows.filter(r=>!r.hasPhone).length;

  const checks=[
    {section:"Properties",items:[
      {label:"All properties have addresses",ok:propRows.every(p=>p.addr)},
      {label:"All units have utility templates",ok:propRows.every(p=>p.units.every(u=>u.utils))},
      {label:`${propRows.length} propert${propRows.length===1?"y":"ies"} configured`,ok:true,info:true},
    ]},
    {section:"Tenants",items:[
      {label:"All tenants have name + email",ok:tenantRows.every(r=>r.tenant.name&&r.tenant.email)},
      {label:"All tenants assigned to property + room",ok:tenantRows.every(r=>r.propId&&r.roomId)},
      {label:"All tenants have rent amount",ok:tenantRows.every(r=>r.rent>0)},
      {label:"All tenants have lease dates or flagged M2M",ok:tenantRows.every(r=>(r.le||r.m2m))},
      ...(missingPhone>0?[{label:`${missingPhone} missing phone number (non-blocking)`,ok:false,warn:true}]:[]),
    ]},
    {section:"Financial Records",items:[
      {label:`${(sdLedger||[]).length} security deposit${(sdLedger||[]).length===1?"":"s"} recorded`,ok:(sdLedger||[]).length>0||!tenantRows.some(r=>r.depositPaid),info:true},
      ...(charges.some(c=>c.category==="Balance Forward")?[{label:`${charges.filter(c=>c.category==="Balance Forward").length} balance forward entr${charges.filter(c=>c.category==="Balance Forward").length===1?"y":"ies"}`,ok:true,info:true}]:[]),
      {label:`${leases.filter(l=>l.status==="executed").length} lease record${leases.filter(l=>l.status==="executed").length===1?"":"s"}`,ok:leases.filter(l=>l.status==="executed").length>0,info:true},
    ]},
    {section:"Charges",items:[
      {label:`${moLabel} charges generated`,ok:phase4Done},
      {label:"Late fee rules configured",ok:true,info:true},
      ...(tenantRows.filter(r=>r.lateConfig&&!r.lateConfig.enabled).length>0?[{label:`${tenantRows.filter(r=>r.lateConfig&&!r.lateConfig.enabled).length} on payment plan (late fee exempt)`,ok:true,info:true}]:[]),
    ]},
  ];

  return(
  <div>
    <h2 style={{fontSize:18,fontWeight:700,margin:"0 0 4px"}}>Go-Live Checklist</h2>
    <p style={{fontSize:13,opacity:.45,margin:"0 0 20px"}}>
      {allReady?"Everything looks good. You are ready to go live.":"Review items below before completing onboarding."}
    </p>

    {checks.map(section=>(
    <div key={section.section} style={{marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
        {section.section}
        {section.items.filter(i=>!i.warn&&!i.info).every(i=>i.ok)&&<span style={{fontSize:11,color:_acc,fontWeight:500}}>({section.items.filter(i=>!i.warn&&!i.info).length}/{section.items.filter(i=>!i.warn&&!i.info).length})</span>}
      </div>
      {section.items.map((item,i)=>(
      <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:13,color:item.warn?S.gold:item.ok?"inherit":S.red,opacity:item.ok?1:.85}}>
        {item.warn
          ?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          :item.ok
            ?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={_acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            :<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S.red} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
        {item.label}
      </div>))}
    </div>))}

    {/* Summary */}
    <div style={{padding:"20px",background:allReady?S.accBg:"rgba(128,128,128,.04)",borderRadius:10,border:`1px solid ${allReady?S.accBorder:"rgba(128,128,128,.08)"}`,marginTop:20,textAlign:"center"}}>
      <div style={{fontSize:15,fontWeight:700,color:allReady?_acc:"inherit",opacity:allReady?1:.6,marginBottom:4}}>
        {allReady?"Ready to go live":"Some items need attention"}
      </div>
      <div style={{fontSize:13,opacity:.45,marginBottom:16}}>
        {totalTenants} tenant{totalTenants===1?"":"s"}, {propRows.length} propert{propRows.length===1?"y":"ies"}{allReady?", all configured":""}
      </div>
      {allReady&&(
        <button onClick={completeOnboarding} className="btn" style={{background:_acc,color:"#fff",fontSize:14,padding:"10px 32px",minHeight:44}}>
          Complete Onboarding
        </button>
      )}
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════
// Shared utils
// ═══════════════════════════════════════════════════════════════════════
function hexToRgb(hex){
  const h=hex||"#4a7c59";
  const r=parseInt(h.slice(1,3),16);
  const g=parseInt(h.slice(3,5),16);
  const b=parseInt(h.slice(5,7),16);
  return`${r},${g},${b}`;
}

function ordinal(n){
  const s=["th","st","nd","rd"];
  const v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
}
