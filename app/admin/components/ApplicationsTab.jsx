"use client";
import { useState } from "react";

export default function ApplicationsTab({
  apps, setApps, props: properties, settings, setSettings, charges, leases, archive,
  obStatuses, renewalRequests, dismissedFollowUps, setDismissedFollowUps,
  expanded, setExpanded, modal, setModal, bulkSel, setBulkSel,
  appSearch, setAppSearch, appView, setAppView, appKpiFilter, setAppKpiFilter,
  portalLinkToken, setPortalLinkToken, portalLinkLoading, setPortalLinkLoading,
  setPiState, goTab, setPaySubTab, payFilters, setPayFilters,
  save, fmtD, fmtS, allRooms, findRoom, getPropDisplayName, chargeStatus,
  TODAY, uid, showAlert, showConfirm,
}) {
  const props = properties;
  const STAGES=["new-lead","applied","approved","onboarding"];
  const SL={"new-lead":"New Lead","pre-screened":"New Lead","called":"New Lead","invited":"New Lead","applied":"Applied","reviewing":"Applied","approved":"Approved","onboarding":"Onboarding","denied":"Denied"};
  const SC2={"new-lead":"b-blue","pre-screened":"b-blue","called":"b-blue","invited":"b-blue","applied":"b-gold","reviewing":"b-gold","approved":"b-green","onboarding":"b-green","denied":"b-red"};
  const SI2={};
  const moveApp=(id,ns)=>{
    setApps(p=>p.map(a=>{if(a.id!==id)return a;return{...a,status:ns,lastContact:TODAY.toISOString().split("T")[0],prevStage:a.status,history:[...(a.history||[]),{from:a.status,to:ns,date:TODAY.toISOString().split("T")[0]}]};}));
    if(ns==="approved"){
      const app=apps.find(a=>a.id===id);
      if(app?.email){
        fetch("/api/portal-invite",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({tenantName:app.name,tenantEmail:app.email,propertyName:app.property,roomName:app.room,rent:app.negotiatedRent||app.rent,moveIn:app.termMoveIn||app.moveIn})
        }).then(r=>r.json()).then(d=>{if(d.ok)console.log("Portal invite auto-sent to",app.email);}).catch(console.error);
      }
    }
  };
  const daysSince=(d)=>{if(!d)return 999;return Math.floor((TODAY-new Date(d+"T00:00:00"))/(1e3*60*60*24));};
  const scoreApp=(a)=>{
    let s=50;
    const breakdown=[];
    // Income
    if(a.income){const n=parseInt(String(a.income).replace(/[^0-9]/g,""));
      if(n>=5000){s+=15;breakdown.push("+15 income ≥$5k");}
      else if(n>=4000){s+=10;breakdown.push("+10 income ≥$4k");}
      else if(n>=3000){s+=5;breakdown.push("+5 income ≥$3k");}
    }
    // Background check
    if(a.bgCheck==="passed"){s+=15;breakdown.push("+15 BG passed");}
    else if(a.bgCheck==="failed"){s-=30;breakdown.push("-30 BG failed");}
    // Credit score
    if(a.creditScore&&a.creditScore!=="—"){const c=parseInt(a.creditScore);
      if(c>=750){s+=15;breakdown.push("+15 credit ≥750");}
      else if(c>=700){s+=10;breakdown.push("+10 credit ≥700");}
      else if(c>=650){s+=5;breakdown.push("+5 credit ≥650");}
      else if(c>0){s-=10;breakdown.push("-10 credit <650");}
    }
    // References
    if(a.refs==="verified"){s+=10;breakdown.push("+10 refs verified");}
    // Rent negotiated higher than list price
    if(a.negotiatedRent&&a.room){const room=props.flatMap(p=>allRooms(p)).find(r=>r.name===a.room);if(room&&a.negotiatedRent>room.rent){s+=10;breakdown.push("+10 above-ask rent");}}
    // Source quality
    if(a.source==="NASA Intern Program"||a.source==="Military / Contractor Network"){s+=5;breakdown.push("+5 vetted source");}
    // Eviction / felony in application data
    if(a.applicationData){
      const vals=Object.values(a.applicationData);
      vals.forEach(v=>{if(v&&typeof v==="object"&&v.answer==="yes"&&(v.followUpText||"").length>0){s-=15;breakdown.push("-15 eviction/felony disclosed");}});
    }
    // Days stale — small penalty for going cold
    const d=daysSince(a.lastContact||a.submitted);
    if(d>=7){s-=10;breakdown.push("-10 stale 7d+");}
    else if(d>=5){s-=5;breakdown.push("-5 stale 5d+");}
    return{score:Math.max(0,Math.min(s,100)),breakdown};
  };
  const getScore=(a)=>scoreApp(a).score;
  const getBreakdown=(a)=>scoreApp(a).breakdown;

  // Onboarding progress — 4 steps
  const getOnboardingProgress=(a)=>{
    const appLease=leases.find(l=>l.applicationId===a.id);
    const leaseSigned=appLease?.status==="executed"||!!a.leaseSigned;
    const docsUploaded=(a.documents&&a.documents.length>0)||(a.docsFlag&&!a.docsFlag.idUploadLater&&!a.docsFlag.incomeUploadLater);
    const appCharges=charges.filter(c=>c.tenantName===a.name);
    const sdCharge=appCharges.find(c=>c.category==="Security Deposit");
    const rentCharge=appCharges.find(c=>c.category==="Rent");
    const sdPaid=sdCharge&&chargeStatus(sdCharge)==="paid";
    const firstMonthPaid=rentCharge&&chargeStatus(rentCharge)==="paid";
    const steps=[leaseSigned,docsUploaded,sdPaid,firstMonthPaid];
    const count=steps.filter(Boolean).length;
    const pct=count/4*100;
    const color=count===4?"#4a7c59":count>=3?"#e8903a":count>=1?"#d4a853":"#c45c4a";
    return{count,leaseSigned,docsUploaded,sdPaid,firstMonthPaid,pct,color,ready:count===4};
  };
  // All active (non-denied) apps — search only within pipeline
  const allActiveApps=apps.filter(a=>a.status!=="denied");
  const staleApps=allActiveApps.filter(a=>daysSince(a.lastContact||a.submitted)>=3&&!["approved","onboarding"].includes(a.status));
  const needsActionApps=allActiveApps.filter(a=>a.status==="applied");
  const deniedApps=apps.filter(a=>a.status==="denied");
  // Apply KPI filter + search
  const activeApps=(()=>{
    let base=appKpiFilter==="needsAction"?needsActionApps
      :appKpiFilter==="stale"?staleApps
      :appKpiFilter==="denied"?deniedApps
      :allActiveApps;
    if(appSearch)base=base.filter(a=>[a.name,a.email,a.phone,a.property,a.source].some(v=>(v||"").toLowerCase().includes(appSearch.toLowerCase())));
    return base;
  })();
  // Duplicate / returning detection
  const allTenantsList=props.flatMap(p=>allRooms(p).filter(r=>r.tenant).map(r=>({name:(r.tenant&&r.tenant.name)||"",email:(r.tenant&&r.tenant.email)||"",phone:(r.tenant&&r.tenant.phone)||"",propName:p.addr||p.name,roomName:r.name,type:"current"})));
  const archiveList=archive.map(a=>({name:a.name||"",email:a.email||"",phone:a.phone||"",propName:a.propName,roomName:a.roomName,reason:a.reason,type:"past"}));
  const getFlags=(a)=>{
    const flags=[];
    var nm=(a.name||"").toLowerCase(),em=(a.email||"").toLowerCase(),ph=a.phone||"";
    // Check current tenants
    allTenantsList.forEach(t=>{if((t.name&&nm&&t.name.toLowerCase()===nm)||(t.email&&em&&t.email.toLowerCase()===em)||(t.phone&&ph&&t.phone===ph))flags.push({type:"current",label:"Current tenant at "+t.propName,data:t});});
    // Check archive
    archiveList.forEach(t=>{if((t.name&&nm&&t.name.toLowerCase()===nm)||(t.email&&em&&t.email.toLowerCase()===em)||(t.phone&&ph&&t.phone===ph))flags.push({type:"past",label:"Past tenant — "+t.propName+(t.reason?" ("+t.reason+")":""),data:t});});
    // Check other apps
    apps.filter(x=>x.id!==a.id).forEach(x=>{if((x.name&&nm&&x.name.toLowerCase()===nm)||(x.email&&em&&x.email.toLowerCase()===em)||(x.phone&&ph&&x.phone===ph))flags.push({type:"dup",label:"Duplicate — also "+x.status,data:x});});
    return flags;
  };

  return(<>
  {/* Follow-up alerts */}
  {(()=>{const visible=staleApps.filter(a=>!dismissedFollowUps.includes(a.id));if(staleApps.length===0)return null;
    if(visible.length===0)return null;
    const dismissOne=(id)=>{const next=[...dismissedFollowUps,id];setDismissedFollowUps(next);save("hq-dismissed-followups",next);};
    const dismissAll=()=>{const next=[...dismissedFollowUps,...visible.map(a=>a.id)];setDismissedFollowUps(next);save("hq-dismissed-followups",next);};
    return(<div style={{background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:12,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:expanded.followUp!==false?6:0}}>
        <div style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>Follow Up ({visible.length})</div>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setExpanded(p=>({...p,followUp:p.followUp===false?true:false}))}>{expanded.followUp===false?"Show":"Minimize"}</button>
          <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={dismissAll}>Dismiss All</button>
        </div>
      </div>
      {expanded.followUp!==false&&visible.map(a=>(
        <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",fontSize:11,borderBottom:"1px solid rgba(0,0,0,.05)"}}>
          <span><strong>{a.name}</strong> — {SL[a.status]} · <span style={{color:daysSince(a.lastContact||a.submitted)>=5?"#c45c4a":"#5c4a3a",fontWeight:700}}>{daysSince(a.lastContact||a.submitted)}d</span></span>
          <div style={{display:"flex",gap:4}}>
            <button className="btn btn-out btn-sm" style={{fontSize:8}} onClick={()=>setModal({type:"app",data:a})}>Open</button>
            <button className="btn btn-out btn-sm" style={{fontSize:8,color:"#c45c4a",padding:"4px 7px",borderColor:"rgba(196,92,74,.2)"}} title="Permanently dismiss" onClick={()=>dismissOne(a.id)}>x</button>
          </div>
        </div>
      ))}
    </div>);
  })()}

  {/* KPIs — clickable filters */}
  <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,flex:1}}>
      {[
        {key:null,label:"Pipeline",value:allActiveApps.length,sub:"All active",color:null},
        {key:"needsAction",label:"Needs Action",value:needsActionApps.length,sub:"Applied — awaiting review",color:needsActionApps.length?"#c45c4a":"#4a7c59"},
        {key:"stale",label:"Follow Up",value:staleApps.length,sub:"No contact 3+ days",color:staleApps.length?"#d4a853":null},
        {key:"denied",label:"Denied",value:deniedApps.length,sub:"All time",color:null},
      ].map(({key,label,value,sub,color})=>{
        const active=appKpiFilter===key;
        return(
        <div key={label}
          onClick={()=>setAppKpiFilter(appKpiFilter===key?null:key)}
          onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(0,0,0,.04)";e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 3px 10px rgba(0,0,0,.08)";}}}
          onMouseLeave={e=>{if(!active){e.currentTarget.style.background="#fff";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}}
          style={{background:active?`rgba(${settings.adminAccentRgb||"74,124,89"},.08)`:"#fff",borderRadius:10,padding:"12px 14px",border:active?`2px solid ${settings.adminAccent||"#4a7c59"}`:"1px solid rgba(0,0,0,.07)",cursor:"pointer",transition:"all .15s",boxShadow:active?`0 3px 12px rgba(${settings.adminAccentRgb||"74,124,89"},.15)`:"none"}}>
          <div style={{fontSize:10,fontWeight:700,color:active?(settings.adminAccent||"#4a7c59"):"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>{label}</div>
          <div style={{fontSize:24,fontWeight:800,color:active?(settings.adminAccent||"#4a7c59"):(color||"#1a1714"),lineHeight:1,marginBottom:3}}>{value}</div>
          <div style={{fontSize:9,color:active?(settings.adminAccent||"#4a7c59"):"#7a7067"}}>{sub}</div>
        </div>);
      })}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",border:"1px solid rgba(0,0,0,.08)",borderRadius:6,background:"#fff",flexShrink:0}}>
      <span style={{fontSize:10,color:"#5c4a3a",fontWeight:600,whiteSpace:"nowrap"}}>Badge</span>
      <div onClick={()=>{const u={...settings,showAppBadge:settings.showAppBadge===false};setSettings(u);save("hq-settings",u);}}
        style={{width:32,height:18,borderRadius:9,background:settings.showAppBadge!==false?"#4a7c59":"rgba(0,0,0,.12)",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{position:"absolute",top:2,left:settings.showAppBadge!==false?14:2,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
      </div>
    </div>
  </div>
  {/* Search + Controls */}
  <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
    <input value={appSearch} onChange={e=>setAppSearch(e.target.value)} placeholder="Search pipeline..." style={{flex:1,minWidth:160,padding:"7px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/>
    {appKpiFilter&&<button className="btn btn-out btn-sm" style={{color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>setAppKpiFilter(null)}>✕ Clear filter</button>}
    {[{v:"pipeline",l:"Pipeline"},{v:"list",l:"List"}].map(b=><button key={b.v} className={`btn ${appView===b.v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setAppView(b.v)}>{b.l}</button>)}
    <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"addLead",name:"",phone:"",email:"",property:"",notes:"",source:"Phone / Direct Call"})}>+ Add Lead</button>
  </div>

  {/* ── Link bar ── */}
  <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"stretch"}}>

    {/* Apply Link */}
    {(()=>{
      const AB={padding:"8px 14px",border:"none",background:"transparent",fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background .15s",color:"#5c4a3a"};
      return(
      <div style={{display:"flex",flexDirection:"column",gap:2,flex:1,minWidth:240}}>
        <div style={{display:"flex",alignItems:"center",background:"#fff",border:"1px solid rgba(0,0,0,.1)",borderRadius:8,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRight:"1px solid rgba(0,0,0,.08)",flex:1,minWidth:0}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" style={{flexShrink:0}}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <span style={{fontSize:11,color:"#5c4a3a",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(settings.siteUrl||"https://rentblackbear.com")}/apply</span>
          </div>
          <button style={{...AB,borderRight:"1px solid rgba(0,0,0,.08)"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            onClick={()=>{navigator.clipboard.writeText(`${settings.siteUrl||"https://rentblackbear.com"}/apply`);setModal({type:"genericLinkCopied"});}}>Copy</button>
          <button style={AB}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            onClick={()=>setModal({type:"emailApplyLink",to:"",name:""})}>Email Link</button>
        </div>
        <div style={{fontSize:9,color:"#7a7067",paddingLeft:4}}>Application form — anyone can apply</div>
      </div>);
    })()}

    {/* Portal Invite */}
    <div style={{display:"flex",flexDirection:"column",gap:2,flex:1,minWidth:240}}>
      <div style={{display:"flex",alignItems:"center",background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRight:"1px solid rgba(74,124,89,.15)",flex:1,minWidth:0}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" style={{flexShrink:0}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span style={{fontSize:11,color:"#4a7c59",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {portalLinkToken?`${(settings.siteUrl||"https://rentblackbear.com")}/portal?token=${portalLinkToken.slice(0,12)}...`:"Portal invite — click Generate"}
          </span>
        </div>
        {!portalLinkToken&&<button style={{padding:"8px 16px",border:"none",background:"rgba(74,124,89,.1)",color:"#4a7c59",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background .15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(74,124,89,.2)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(74,124,89,.1)"}
          onClick={async()=>{
            if(portalLinkLoading)return;
            setPortalLinkLoading(true);
            try{
              const res=await fetch("/api/portal-invite-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});
              const d=await res.json();
              if(d.token){
                setPortalLinkToken(d.token);
                navigator.clipboard.writeText(`${settings.siteUrl||"https://rentblackbear.com"}/portal?token=${d.token}`);
              }
            }catch(e){console.error(e);}
            setPortalLinkLoading(false);
          }}>{portalLinkLoading?"Generating...":"Generate"}</button>}
        {portalLinkToken&&<>
          <button style={{padding:"8px 14px",border:"none",borderRight:"1px solid rgba(74,124,89,.15)",background:"transparent",color:"#4a7c59",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(74,124,89,.08)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            onClick={()=>{navigator.clipboard.writeText(`${settings.siteUrl||"https://rentblackbear.com"}/portal?token=${portalLinkToken}`);setModal({type:"genericLinkCopied"});}}>Copy</button>
          <button style={{padding:"8px 14px",border:"none",borderRight:"1px solid rgba(74,124,89,.15)",background:"transparent",color:"#4a7c59",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(74,124,89,.08)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            onClick={()=>setModal({type:"emailPortalLink",to:"",name:"",token:portalLinkToken})}>Email Link</button>
          <button style={{padding:"8px 10px",border:"none",background:"transparent",color:"#8a7d74",fontSize:10,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}
            title="Generate a new link"
            onClick={async()=>{
              setPortalLinkToken(null);setPortalLinkLoading(true);
              try{const res=await fetch("/api/portal-invite-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});const d=await res.json();if(d.token){setPortalLinkToken(d.token);navigator.clipboard.writeText(`${settings.siteUrl||"https://rentblackbear.com"}/portal?token=${d.token}`);}}catch(e){console.error(e);}
              setPortalLinkLoading(false);
            }}>↺</button>
        </>}
      </div>
      <div style={{fontSize:9,color:"#7a7067",paddingLeft:4}}>
        {portalLinkToken?"Copied to clipboard — expires in 48 hours":"Portal access — bypasses application"}
      </div>
    </div>
  </div>

  {/* Bulk invite bar */}
  {(appView==="pipeline"||appView==="list")&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:bulkSel.length?"rgba(212,168,83,.08)":"rgba(0,0,0,.02)",borderRadius:8,marginBottom:10,border:bulkSel.length?"1px solid rgba(212,168,83,.2)":"1px solid transparent",transition:"all .2s",flexWrap:"wrap"}}>
    <input type="checkbox" checked={bulkSel.length>0&&bulkSel.length===activeApps.length} onChange={e=>{setBulkSel(e.target.checked?activeApps.map(a=>a.id):[]);}} style={{width:14,height:14,cursor:"pointer"}}/>
    <span style={{fontSize:11,color:"#6b5e52",flex:1,minWidth:80}}>{bulkSel.length>0?`${bulkSel.length} selected`:"Select applicants"}</span>
    {bulkSel.length>0&&<>
      {(()=>{
        const invitable=activeApps.filter(a=>bulkSel.includes(a.id)&&a.status==="new-lead");
        const reinvitable=activeApps.filter(a=>bulkSel.includes(a.id)&&a.status==="invited");
        return(<>
          {invitable.length>0&&<button className="btn btn-gold btn-sm"
            onClick={()=>{
              if(invitable.length===1){setModal({type:"inviteApp",data:invitable[0]});}
              else{setModal({type:"bulkInvite",ids:bulkSel});}
            }}>
            Invite ({invitable.length})
          </button>}
          {reinvitable.length>0&&<button className="btn btn-out btn-sm" style={{color:"#3b82f6",borderColor:"rgba(59,130,246,.25)"}}
            onClick={()=>setModal({type:"confirmAction",title:`Reinvite ${reinvitable.length} Applicant${reinvitable.length>1?"s":""}`,
              body:`Resend the application link to ${reinvitable.length} invited applicant${reinvitable.length>1?"s":" ("+reinvitable[0].name+")"}?`,
              confirmLabel:"Reinvite",confirmStyle:"btn-gold",
              onConfirm:()=>{
                const now=TODAY.toISOString().split("T")[0];
                setApps(p=>p.map(a=>reinvitable.find(r=>r.id===a.id)?{...a,lastContact:now,history:[...(a.history||[]),{from:"invited",to:"invited",date:now,note:"Reinvited — resent application link"}]}:a));
                setBulkSel([]);setModal(null);
              }})}>
            Reinvite ({reinvitable.length})
          </button>}
        </>);
      })()}
      <button className="btn btn-out btn-sm" style={{color:"#9a7422",borderColor:"rgba(212,168,83,.3)"}}
        onClick={()=>setModal({type:"confirmAction",title:"Archive "+bulkSel.length+" Applicant"+(bulkSel.length>1?"s":""),
          body:"Move "+bulkSel.length+" applicant"+(bulkSel.length>1?"s":"")+" to Denied? They'll be hidden from the pipeline but stay in your records.",
          confirmLabel:"Archive "+bulkSel.length,confirmStyle:"btn-out",
          onConfirm:()=>{setApps(p=>p.map(a=>bulkSel.includes(a.id)?{...a,status:"denied",deniedReason:"Archived",deniedDate:TODAY.toISOString().split("T")[0],prevStage:a.status}:a));setBulkSel([]);setModal(null);}})}>
        Archive ({bulkSel.length})
      </button>
      <button className="btn btn-out btn-sm" style={{color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}}
        onClick={()=>setModal({type:"confirmAction",title:"Delete "+bulkSel.length+" Applicant"+(bulkSel.length>1?"s":""),
          body:"Permanently delete "+bulkSel.length+" applicant"+(bulkSel.length>1?"s":"")+"? This cannot be undone and all their data will be removed.",
          confirmLabel:"Delete "+bulkSel.length,confirmStyle:"btn-red",
          onConfirm:()=>{setApps(p=>p.filter(a=>!bulkSel.includes(a.id)));setBulkSel([]);setModal(null);}})}>
        Delete ({bulkSel.length})
      </button>
      <button className="btn btn-out btn-sm" onClick={()=>setBulkSel([])}>Clear</button>
    </>}
  </div>}

  {/* Pipeline */}
  {appView==="pipeline"&&<div className="pipeline">
    {STAGES.map(function(stage,si){
      // Onboarding column shows approved+onboarding; approved column shows approved only
      var sa=stage==="onboarding"
        ?activeApps.filter(function(a){return a.status==="onboarding";})
        :stage==="approved"
        ?activeApps.filter(function(a){return a.status==="approved";})
        :stage==="new-lead"
        ?activeApps.filter(function(a){return["new-lead","pre-screened","called","invited","applied","reviewing"].includes(a.status);})
        :stage==="applied"
        ?activeApps.filter(function(a){return["applied","reviewing"].includes(a.status);})
        :activeApps.filter(function(a){return a.status===stage;});
      return(
      <div key={stage} className="pipe-col">
        <div className="pipe-hd">
        <h4 style={{fontSize:10,display:"flex",alignItems:"center",gap:5}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity:.55,flexShrink:0}}>
            {stage==="new-lead"&&<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
            {stage==="applied"&&<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>}
            {stage==="approved"&&<><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></>}
            {stage==="onboarding"&&<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
          </svg>
          {SL[stage]}
        </h4>
        <span className="pipe-cnt">{sa.length}</span>
      </div>
        <div className="pipe-bd">
          {sa.sort(function(a,b){return getScore(b)-getScore(a);}).map(function(a){
            var sc=getScore(a);var bd=getBreakdown(a);var d=daysSince(a.lastContact||a.submitted);var flags=getFlags(a);var isChecked=bulkSel.includes(a.id);var canInvite=["new-lead","pre-screened","called"].includes(a.status);
            var isOnboarding=a.status==="onboarding";
            return(
            <div key={a.id} className="pipe-card" style={{
              border:isOnboarding?"2px solid #4a7c59":"1px solid rgba(0,0,0,.07)",
              borderLeft:isOnboarding?"2px solid #4a7c59":sc>=70?"3px solid #4a7c59":sc>=50?"3px solid #d4a853":"3px solid #c45c4a",
              cursor:"pointer",background:isChecked?"rgba(212,168,83,.06)":"#fff",
              padding:isOnboarding?"10px":"10px 10px 10px 30px",
            }} onClick={function(){setModal({type:"app",data:a});}}>

              {/* Checkbox — only on non-onboarding, positioned cleanly */}
              {!isOnboarding&&<div style={{position:"absolute",left:8,top:12}} onClick={e=>{e.stopPropagation();setBulkSel(p=>isChecked?p.filter(x=>x!==a.id):[...p,a.id]);}}><input type="checkbox" checked={isChecked} onChange={()=>{}} style={{width:13,height:13,cursor:"pointer"}}/></div>}

              {flags.length>0&&<div style={{fontSize:7,padding:"2px 5px",borderRadius:3,marginBottom:3,background:flags[0].type==="current"?"rgba(196,92,74,.08)":flags[0].type==="past"?"rgba(212,168,83,.08)":"rgba(59,130,246,.08)",color:flags[0].type==="current"?"#c45c4a":flags[0].type==="past"?"#9a7422":"#3b82f6",fontWeight:600,cursor:"pointer"}}
                onClick={e=>{e.stopPropagation();setModal({type:"app",data:a});}}>
                {flags[0].type==="current"?"Current Tenant":flags[0].type==="past"?"Returning":flags[0].type==="dup"?"Duplicate":""} →
              </div>}

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div className="pipe-nm">{a.name}</div>
                  {a._hasUnreadRefReply&&<span style={{fontSize:8,fontWeight:700,padding:"1px 6px",borderRadius:8,background:"rgba(59,130,246,.12)",color:"#1d4ed8",whiteSpace:"nowrap"}}>● Reply</span>}
                </div>
                {!isOnboarding&&<div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                  <span style={{fontSize:7,fontWeight:700,color:sc>=70?"#4a7c59":sc>=50?"#d4a853":"#c45c4a",background:sc>=70?"rgba(74,124,89,.08)":sc>=50?"rgba(212,168,83,.08)":"rgba(196,92,74,.08)",padding:"1px 5px",borderRadius:3,cursor:"pointer"}}
                    onMouseEnter={e=>{const t=e.currentTarget.nextSibling;if(t)t.style.display="block";}}
                    onMouseLeave={e=>{const t=e.currentTarget.nextSibling;if(t)t.style.display="none";}}
                  >{sc}</span>
                  <div style={{display:"none",position:"absolute",right:0,top:"100%",zIndex:20,background:"#1a1714",color:"#f5f0e8",borderRadius:6,padding:"6px 8px",fontSize:8,whiteSpace:"nowrap",boxShadow:"0 4px 12px rgba(0,0,0,.3)",marginTop:2}}>
                    {bd.length>0?bd.map((b,i)=><div key={i}>{b}</div>):<div>Base: 50pts</div>}
                  </div>
                </div>}
              </div>

              <div className="pipe-sub">{(()=>{const p=a.termPropId?props.find(x=>x.id===a.termPropId):props.find(x=>x.name===a.property);const addr=p?.addr||p?.address||"";const dispName=p?getPropDisplayName(p):(a.property||"—");return dispName+(addr&&!dispName.includes(addr)?" · "+addr:"")+(a.room&&!p?.units?.some(u=>(u.rentalMode||"byRoom")==="wholeHouse")?" · "+a.room:"");})()}</div>

              {/* Invited — "Awaiting Reply" badge + re-invite button */}
              {a.status==="invited"&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6,gap:6}}>
                <span style={{fontSize:8,fontWeight:700,color:"#3b82f6",background:"rgba(59,130,246,.1)",padding:"2px 7px",borderRadius:99,flexShrink:0}}>Awaiting Reply</span>
                <button style={{fontSize:9,padding:"3px 10px",background:"#d4a853",border:"none",borderRadius:5,color:"#1a1714",cursor:"pointer",fontWeight:800,fontFamily:"inherit",whiteSpace:"nowrap"}}
                  onClick={e=>{e.stopPropagation();setModal({type:"inviteApp",data:a});}}>Re-invite</button>
              </div>}

              {/* Onboarding progress bar */}


              {/* Onboarding status pills — shown for approved/onboarding cards, reads from Supabase */}
              {(isOnboarding||a.status==="approved")&&(()=>{
                const ob=obStatuses[a.email]||{};
                // Lease state: check local leases array for sent/signed status
                const appLease=leases.find(l=>l.applicationId===a.id);
                const leaseSent=appLease&&(appLease.status==="pending_tenant"||appLease.status==="executed");
                const leaseSignedLocal=appLease?.status==="executed"||!!a.leaseSigned;
                const leaseSignedSupa=ob.leaseSigned;
                const leaseDone=leaseSignedLocal||leaseSignedSupa;
                const leaseAmber=leaseSent&&!leaseDone; // sent but not yet signed
                // SD and Rent charges
                const sdCharge=charges.find(c=>c.tenantName===a.name&&c.category==="Security Deposit");
                const rentCharge=charges.find(c=>c.tenantName===a.name&&c.category==="Rent");
                const allDone=leaseDone&&ob.sdPaid&&ob.firstMonthPaid;
                // Pill config: state = "done" | "pending" | "idle"
                const pills=[
                  {
                    key:"lease",label:"Lease",
                    state:leaseDone?"done":leaseAmber?"pending":"idle",
                    pendingLabel:"Awaiting Signature",
                    onClick:(e)=>{e.stopPropagation();
                      if(leaseDone&&appLease){setModal({type:"app",data:a,startSection:"lease"});}
                      else if(leaseAmber&&appLease){setModal({type:"app",data:a,startSection:"lease"});}
                      else{setModal({type:"app",data:a});}
                    }
                  },
                  {
                    key:"sd",label:"SD",
                    state:ob.sdPaid?"done":sdCharge?"pending":"idle",
                    pendingLabel:"Awaiting Payment",
                    onClick:(e)=>{e.stopPropagation();
                      if(sdCharge){goTab("payments");setPaySubTab("charges");setPayFilters({...payFilters,tenant:a.name,category:"Security Deposit"});}
                      else{setModal({type:"app",data:a});}
                    }
                  },
                  {
                    key:"rent",label:"Rent",
                    state:ob.firstMonthPaid?"done":rentCharge?"pending":"idle",
                    pendingLabel:"Awaiting Payment",
                    onClick:(e)=>{e.stopPropagation();
                      if(rentCharge){goTab("payments");setPaySubTab("charges");setPayFilters({...payFilters,tenant:a.name,category:"Rent"});}
                      else{setModal({type:"app",data:a});}
                    }
                  },
                  {
                    key:"movein",label:"Move In",
                    state:allDone?"done":"idle",
                    pendingLabel:"",
                    onClick:(e)=>{e.stopPropagation();setModal({type:"app",data:a});}
                  },
                ];
                const doneCount=pills.filter(p=>p.state==="done").length;
                return(
                <div style={{marginTop:8}} onClick={e=>e.stopPropagation()}>
                  <div style={{display:"flex",gap:3,marginBottom:4}}>
                    {pills.map(p=>{
                      const bg=p.state==="done"?"rgba(74,124,89,.15)":p.state==="pending"?"rgba(212,168,83,.15)":"rgba(0,0,0,.05)";
                      const col=p.state==="done"?"#2d6a3f":p.state==="pending"?"#9a7422":"#aaa";
                      const bdr=p.state==="done"?"1px solid rgba(74,124,89,.25)":p.state==="pending"?"1px solid rgba(212,168,83,.3)":"1px solid transparent";
                      return(
                      <div key={p.key}
                        onClick={p.onClick}
                        title={p.state==="pending"?p.pendingLabel:p.state==="done"?"Completed — click to view":"Not started"}
                        style={{flex:1,textAlign:"center",fontSize:7,fontWeight:700,padding:"3px 2px",borderRadius:4,
                          background:bg,color:col,border:bdr,cursor:"pointer",transition:"all .15s",
                          position:"relative",
                        }}
                        onMouseEnter={e=>{
                          const el=e.currentTarget;
                          el.style.transform="scale(1.08)";
                          el.style.boxShadow="0 2px 8px rgba(0,0,0,.15)";
                          el.style.zIndex="10";
                          if(p.state==="done"){el.style.background="rgba(74,124,89,.35)";el.style.color="#1a5c30";}
                          else if(p.state==="pending"){el.style.background="rgba(212,168,83,.35)";el.style.color="#7a5a10";}
                          else{el.style.background="rgba(0,0,0,.14)";el.style.color="#333";}
                        }}
                        onMouseLeave={e=>{
                          const el=e.currentTarget;
                          el.style.transform="";el.style.boxShadow="";el.style.zIndex="";
                          el.style.background=p.state==="done"?"rgba(74,124,89,.15)":p.state==="pending"?"rgba(212,168,83,.15)":"rgba(0,0,0,.05)";
                          el.style.color=p.state==="done"?"#2d6a3f":p.state==="pending"?"#9a7422":"#aaa";
                        }}>
                        {p.state==="done"?"✓ ":p.state==="pending"?"⋯ ":""}{p.label}
                      </div>);
                    })}
                  </div>
                  {/* Lease waiting indicator */}
                  {leaseAmber&&<div style={{fontSize:7,color:"#9a7422",fontWeight:700,textAlign:"center",padding:"2px 0",background:"rgba(212,168,83,.08)",borderRadius:3,marginBottom:3}}>Awaiting tenant signature</div>}
                  {!allDone&&!leaseAmber&&<div style={{height:3,borderRadius:2,background:"rgba(0,0,0,.06)"}}>
                    <div style={{height:"100%",borderRadius:2,background:"#4a7c59",width:(doneCount/4*100)+"%",transition:"width .3s"}}/>
                  </div>}
                  {allDone&&<div style={{fontSize:7,color:"#2d6a3f",fontWeight:800,textAlign:"center",padding:"2px 0",background:"rgba(74,124,89,.08)",borderRadius:3}}>Ready to Move In</div>}
                </div>);
              })()}

              {/* Standard card footer */}
              {!isOnboarding&&a.status!=="invited"&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:8,color:"#5c4a3a",marginTop:5,overflow:"hidden"}}>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:80}}>{a.source||""}</span>
                <div style={{display:"flex",alignItems:"center",gap:4,minWidth:0,flexShrink:1}}>
                  {d>0&&<span style={{color:d>=5?"#c45c4a":d>=3?"#d4a853":"#888",fontWeight:700}}>{d}d</span>}
                  {canInvite&&<button
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,168,83,.3)";e.currentTarget.style.color="#7a5a10";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(212,168,83,.12)";e.currentTarget.style.color="#9a7422";}}
                    style={{fontSize:7,padding:"3px 7px",background:"rgba(212,168,83,.12)",color:"#9a7422",border:"1px solid rgba(212,168,83,.35)",borderRadius:4,cursor:"pointer",fontWeight:700,fontFamily:"inherit",transition:"all .15s",textAlign:"center",lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}
                    onClick={e=>{e.stopPropagation();setModal({type:"inviteApp",data:a});}}>Continue — Invite to Apply</button>}
                  <button
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(74,124,89,.25)";e.currentTarget.style.color="#2d6a3f";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(74,124,89,.1)";e.currentTarget.style.color="#4a7c59";}}
                    style={{fontSize:7,padding:"3px 7px",background:"rgba(74,124,89,.1)",color:"#4a7c59",border:"1px solid rgba(74,124,89,.3)",borderRadius:4,cursor:"pointer",fontWeight:700,fontFamily:"inherit",transition:"all .15s",textAlign:"center",lineHeight:1.3,whiteSpace:"nowrap"}}
                    title="Send portal invite — bypasses application requirement"
                    onClick={e=>{e.stopPropagation();setPiState("idle");setModal({type:"sendPortalInviteApp",data:a});}}>Portal Invite</button>
                </div>
              </div>}
            </div>);
          })}
          {sa.length===0&&<div style={{textAlign:"center",padding:12,color:"#8a7d74",fontSize:9}}>Empty</div>}
        </div>
      </div>);
    })}
  </div>}

  {/* List */}
  {appView==="list"&&<div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th style={{width:32}}></th><th>Name</th><th>Property</th><th>Score</th><th>Stage</th><th>Days</th><th>Source</th><th></th></tr></thead><tbody>
    {activeApps.sort((a,b)=>getScore(b)-getScore(a)).map(a=>{const sc=getScore(a);const d=daysSince(a.lastContact||a.submitted);const sel=bulkSel.includes(a.id);return(
      <tr key={a.id} style={{cursor:"pointer",background:sel?"rgba(212,168,83,.07)":"",transition:"background .1s"}}
        onClick={()=>setModal({type:"app",data:a})}>
        <td style={{width:32}} onClick={e=>e.stopPropagation()}>
          <input type="checkbox" checked={sel} onChange={e=>setBulkSel(p=>e.target.checked?[...p,a.id]:p.filter(x=>x!==a.id))} style={{width:14,height:14,cursor:"pointer"}}/>
        </td>
        <td style={{fontWeight:700}}>{a.name}</td><td>{a.property||"—"}</td>
        <td><span style={{fontWeight:700,color:sc>=70?"#4a7c59":sc>=50?"#d4a853":"#c45c4a"}}>{sc}</span></td>
        <td><span className={`badge ${SC2[a.status]||"b-gray"}`}>{SL[a.status]||a.status}</span></td>
        <td style={{color:d>=5?"#c45c4a":d>=3?"#d4a853":"#999",fontWeight:600}}>{d}d</td>
        <td style={{fontSize:10}}>{a.source||"—"}</td>
        <td onClick={e=>e.stopPropagation()}>
          {["pre-screened","called","new-lead"].includes(a.status)&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"inviteApp",data:a})}>Invite</button>}
        </td></tr>);})}
  </tbody></table></div></div>}

  {/* Denied — collapsible */}
  {deniedApps.length>0&&<div style={{marginTop:14}}>
    <button className="btn btn-out btn-sm" style={{width:"100%",color:"#6b5e52",marginBottom:4}} onClick={()=>setExpanded(p=>({...p,showDenied:!p.showDenied}))}>
      {expanded.showDenied?"▾ Hide":"▸ Show"} Denied ({deniedApps.length})
    </button>
    {expanded.showDenied&&deniedApps.map(a=><div key={a.id} className="row" style={{opacity:.7}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{a.name}</div><div className="row-s">{a.property} · {fmtD(a.deniedDate)}{a.deniedReason?" · "+a.deniedReason:""}</div></div><button className="btn btn-out btn-sm" onClick={()=>setModal({type:"app",data:a})}>View</button><button className="btn btn-out btn-sm" onClick={()=>setApps(p=>p.map(x=>x.id===a.id?{...x,status:x.prevStage||"pre-screened",deniedReason:null,deniedDate:null}:x))}>Restore</button></div>)}
  </div>}


  {/* ── Waitlist ── */}
  {(()=>{const totalVacant=props.reduce((s,p)=>s+allRooms(p).filter(r=>r.st==="vacant").length,0);const waitlistApps=activeApps.filter(a=>["new-lead"].includes(a.status));
    if(totalVacant===0&&waitlistApps.length>0)return(
      <div style={{marginTop:8,border:"2px solid rgba(212,168,83,.2)",borderRadius:12,padding:14,background:"rgba(212,168,83,.03)"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#9a7422",marginBottom:8}}>Waitlist — No Vacant Rooms</div>
        <div style={{fontSize:10,color:"#6b5e52",marginBottom:8}}>All rooms are occupied. These applicants are waiting for availability, ranked by score.</div>
        {waitlistApps.sort((a,b)=>getScore(b)-getScore(a)).map((a,i)=><div key={a.id} className="row" style={{padding:"8px 10px"}}><div style={{width:20,fontSize:12,fontWeight:800,color:"#d4a853"}}>{i+1}</div><div className="row-i"><div className="row-t">{a.name} <span style={{fontSize:9,color:"#6b5e52"}}>({getScore(a)}pt)</span></div><div className="row-s">{a.property||"No pref"} · {SL[a.status]} · {a.source||""}</div></div><button className="btn btn-out btn-sm" onClick={()=>setModal({type:"app",data:a})}>View</button></div>)}
      </div>);
    return null;})()}

  {/* ── Waitlist ── */}
  {(()=>{const totalVacant=props.reduce((s,p)=>s+allRooms(p).filter(r=>r.st==="vacant").length,0);
    if(totalVacant>0)return null;
    const waitlistApps=activeApps.filter(a=>["new-lead"].includes(a.status)).sort((a,b)=>getScore(b)-getScore(a));
    return waitlistApps.length>0?<div style={{marginTop:16,border:"2px solid rgba(212,168,83,.2)",borderRadius:12,padding:16,background:"rgba(212,168,83,.03)"}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Waitlist — No Vacancies</div>
      <div style={{fontSize:10,color:"#6b5e52",marginBottom:10}}>All rooms are full. These applicants are ranked by score and ready when a room opens.</div>
      {waitlistApps.map((a,i)=><div key={a.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"app",data:a})}>
        <div style={{width:20,fontSize:11,fontWeight:700,color:"#d4a853"}}>#{i+1}</div>
        <div className="row-i"><div className="row-t">{a.name} <span style={{fontSize:9,color:"#6b5e52"}}>Score: {getScore(a)}</span></div><div className="row-s">{a.property||"No pref"} · {SL[a.status]} · {a.source||""}</div></div>
      </div>)}
    </div>:null;
  })()}

  {/* ── Renewal Requests — only shows if any exist ── */}
  {renewalRequests.length>0&&(
    <div style={{marginTop:24}}>
      <div style={{fontSize:10,fontWeight:700,color:"#9a7422",textTransform:"uppercase",letterSpacing:1,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a7422" strokeWidth="1.75"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        Lease Renewal Requests ({renewalRequests.filter(r=>!r.read).length} pending)
      </div>
      {renewalRequests.map(req=>(
        <div key={req.id} className="card" style={{marginBottom:8,borderLeft:"3px solid #d4a853"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px"}}>
            <div>
              <div style={{fontSize:13,fontWeight:700}}>{req.tenant_name}</div>
              <div style={{fontSize:11,color:"#6b5e52"}}>{req.property_name}{req.room_name?" \u00b7 "+req.room_name:""} {req.subject?.replace("Lease Renewal: ","")}</div>
              <div style={{fontSize:10,color:"#999",marginTop:2}}>{new Date(req.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{display:"flex",gap:6}}>
              {!req.read&&<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:99,background:"rgba(212,168,83,.12)",color:"#9a7422"}}>PENDING</span>}
              <button className="btn btn-out btn-sm" onClick={()=>goTab("messages")}>View in Messages</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

</>);
}
