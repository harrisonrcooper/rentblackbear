"use client";
import { useState, useMemo } from "react";

// ── Local formatting helpers (mirrored from parent) ─────────────────
const fmtS=n=>"$"+Number(n).toLocaleString();
const fmtD=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;}

const TODAY=new Date();
const MO=TODAY.toLocaleString("default",{month:"long",year:"numeric"});

export default function DashboardTab({
  getChargesForPeriod, chargeStatus,
  expenses, mortgages, props, maint, apps, charges,
  settings, setSettings,
  widgetList, setWidgetList,
  dashEditMode, setDashEditMode,
  dashDragWidget, setDashDragWidget,
  dashDragOver, setDashDragOver,
  notifs, setNotifs,
  rocks,
  drill, setDrill,
  m, allTenants,
  goTab, setModal,
  openCreateCharge, openPayForm,
  setPaySubTab, payFilters, setPayFilters,
  getPropDisplayName, roomSubLine,
  save,
}) {
        const daysUntilNextRent=(()=>{const next=new Date(TODAY.getFullYear(),TODAY.getMonth()+1,1);return Math.ceil((next-TODAY)/(1e3*60*60*24));})();
        const mtdCharges=getChargesForPeriod("mtd");
        const ytdCharges=getChargesForPeriod("ytd");
        const mtdPastDue=mtdCharges.filter(c=>chargeStatus(c)==="pastdue");
        const mtdCollected=mtdCharges.reduce((s,c)=>s+c.amountPaid,0);
        const mtdExpected=mtdCharges.filter(c=>c.category==="Rent").reduce((s,c)=>s+c.amount,0);
        const ytdCollected=ytdCharges.reduce((s,c)=>s+c.amountPaid,0);
        const ytdExpenses=expenses.filter(e=>{const d=new Date(e.date+"T00:00:00");return d.getFullYear()===TODAY.getFullYear();}).reduce((s,e)=>s+e.amount,0);
        const ytdNOI=ytdCollected-ytdExpenses;
        const totalDebt=mortgages.reduce((s,mg)=>s+(mg.balance||0),0);
        const totalPropValue=props.reduce((s,p)=>s+(p.estimatedValue||0),0);
        const totalEquity=totalPropValue-totalDebt;
        const annualNOI=ytdNOI*(12/Math.max(TODAY.getMonth()+1,1));
        const roe=totalEquity>0?Math.round((annualNOI/totalEquity)*100):null;
        const openMaintItems=maint.filter(x=>x.status!=="resolved");
        const nextRentCharges=getChargesForPeriod("next");
        const nextRentTotal=nextRentCharges.filter(c=>c.category==="Rent").reduce((s,c)=>s+c.amount,0);
        const appsByStage={"new-lead":0,"applied":0,"approved":0,"onboarding":0};
        apps.filter(a=>a.status!=="denied").forEach(a=>{if(appsByStage[a.status]!==undefined)appsByStage[a.status]++;});
        const defWidgets=settings.dashWidgets||["pendingActions","pastDue","leaseExp","vacancy","maintenance","mtdCollection","recentActivity","appPipeline","upcomingRent"];
        const activeWidgets=widgetList||defWidgets;
        const editMode=dashEditMode;
        const dragWidget=dashDragWidget;
        const dragOver=dashDragOver;
        const saveWidgets=(list)=>{setWidgetList(list);const u={...settings,dashWidgets:list};setSettings(u);save("hq-settings",u);};
        const removeWidget=(id)=>saveWidgets(activeWidgets.filter(w=>w!==id));
        const addWidget=(id)=>{if(!activeWidgets.includes(id))saveWidgets([...activeWidgets,id]);};
        const onDragStart=(id)=>setDashDragWidget(id);
        const onDragOver=(e,id)=>{e.preventDefault();setDashDragOver(id);};
        const onDrop=(e,targetId)=>{e.preventDefault();if(!dragWidget||dragWidget===targetId)return;const list=[...activeWidgets];const from=list.indexOf(dragWidget);const to=list.indexOf(targetId);list.splice(from,1);list.splice(to,0,dragWidget);saveWidgets(list);setDashDragWidget(null);setDashDragOver(null);};
        const onDragEnd=()=>{setDashDragWidget(null);setDashDragOver(null);};
        const ALL_WIDGETS=[
          {id:"pastDue",label:"Past Due"},{id:"leaseExp",label:"Lease Expirations"},{id:"vacancy",label:"Vacant Rooms"},
          {id:"maintenance",label:"Open Maintenance"},{id:"mtdCollection",label:"MTD Collection"},{id:"recentActivity",label:"Recent Activity"},
          {id:"appPipeline",label:"Application Pipeline"},{id:"upcomingRent",label:"Upcoming Rent"},{id:"ytdRevenue",label:"YTD Revenue"},
          {id:"ytdExpenses",label:"YTD Expenses"},{id:"noi",label:"Net Operating Income"},{id:"vacancyCost",label:"Vacancy Cost"},
          {id:"leaseRenewals",label:"Lease Renewals"},{id:"doorCodes",label:"Door Codes"},{id:"cleaning",label:"Cleaning Schedule"},
          {id:"propBreakdown",label:"Revenue by Property"},{id:"roe",label:"Return on Equity"},{id:"profitability",label:"Profitability by Property"},
          {id:"dscr",label:"DSCR"},{id:"rocks",label:"Traction Rocks"},
          {id:"pendingActions",label:"Pending Actions"},
        ];
        const availableToAdd=ALL_WIDGETS.filter(w=>!activeWidgets.includes(w.id));
        const NeedsData=({label,goTo,field})=>(<div style={{padding:"10px 0"}}>
          <div style={{fontSize:11,color:"#6b5e52",marginBottom:6}}>Enter {field} to calculate {label}</div>
          <button className="btn btn-out btn-sm" style={{fontSize:10}} onClick={()=>goTab(goTo||"properties")}>Enter data</button>
        </div>);
        const renderWidget=(id)=>{switch(id){
          case "pastDue":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Past Due</div>
            {mtdPastDue.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>No past due charges</div>}
            {mtdPastDue.slice(0,5).map(c=><div key={c.id} className="row" style={{cursor:"pointer",padding:"6px 0"}} onClick={()=>{goTab("payments");setPaySubTab("charges");}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{c.tenantName}</div><div className="row-s">{c.propName} · Due {fmtD(c.dueDate)}</div></div><div className="row-v kb" style={{fontSize:13}}>{fmtS(c.amount-c.amountPaid)}</div></div>)}
            {mtdPastDue.length>5&&<div style={{fontSize:10,color:"#6b5e52",paddingTop:6,cursor:"pointer"}} onClick={()=>{goTab("payments");}}>+{mtdPastDue.length-5} more</div>}
          </>);
          case "leaseExp":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Lease Expirations</div>
            {m.expiring.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>No leases expiring within 90 days</div>}
            {m.expiring.sort((a,b)=>a.daysLeft-b.daysLeft).map(r=><div key={r.id} className="row" style={{cursor:"pointer",padding:"6px 0"}} onClick={()=>goTab("tenants")}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{r.tenant&&r.tenant.name}</div><div className="row-s">{r.propName} · {r.name} · Ends {fmtD(r.le)}</div></div><span className="badge" style={{background:r.daysLeft<=30?"rgba(196,92,74,.08)":"rgba(212,168,83,.1)",color:r.daysLeft<=30?"#c45c4a":"#9a7422",flexShrink:0}}>{r.daysLeft}d</span></div>)}
          </>);
          case "vacancy":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Vacant Rooms</div>
            {m.vacs.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>Fully occupied</div>}
            {m.vacs.map(r=><div key={r.id} className="row" style={{padding:"6px 0"}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{r.name}</div><div className="row-s">{r.propName} · {fmtS(r.rent)}/mo lost</div></div><button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("applications")}>Find Tenant</button></div>)}
          </>);
          case "maintenance":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Open Maintenance ({openMaintItems.length})</div>
            {openMaintItems.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>No open requests</div>}
            {openMaintItems.slice(0,5).map(x=><div key={x.id} className="row" style={{cursor:"pointer",padding:"6px 0"}} onClick={()=>goTab("maintenance")}><div className="row-dot" style={{background:x.priority==="high"?"#c45c4a":x.priority==="medium"?"#d4a853":"#999"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{x.title}</div><div className="row-s">{x.propName||""}{x.tenant?" · "+x.tenant:""}</div></div></div>)}
            {openMaintItems.length>5&&<div style={{fontSize:10,color:"#6b5e52",paddingTop:6,cursor:"pointer"}} onClick={()=>goTab("maintenance")}>+{openMaintItems.length-5} more</div>}
          </>);
          case "mtdCollection":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>MTD Collection</div>
            <div style={{fontSize:24,fontWeight:800,color:"#4a7c59",marginBottom:4}}>{fmtS(mtdCollected)}</div>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:10}}>{mtdExpected>0?Math.round(mtdCollected/mtdExpected*100):0}% of {fmtS(mtdExpected)} expected</div>
            <div style={{height:6,borderRadius:3,background:"rgba(0,0,0,.06)"}}><div style={{height:"100%",borderRadius:3,background:"#4a7c59",width:(mtdExpected>0?Math.min(Math.round(mtdCollected/mtdExpected*100),100):0)+"%",transition:"width .4s"}}/></div>
            {mtdExpected>mtdCollected&&<div style={{fontSize:10,color:"#c45c4a",marginTop:6}}>{fmtS(mtdExpected-mtdCollected)} outstanding</div>}
          </>);
          case "recentActivity":return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8}}>Recent Activity</div>
              {notifs.length>0&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>{setNotifs([]);save("hq-notifs",[]);}}>Clear All</button>}
            </div>
            {notifs.length===0&&<div style={{fontSize:12,color:"#6b5e52"}}>No recent activity</div>}
            {notifs.slice(0,8).map(n=><div key={n.id} className="row" style={{opacity:n.read?.7:1,cursor:"pointer",padding:"5px 0"}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>
              <div className="row-dot" style={{background:n.type==="payment"?"#4a7c59":n.type==="lease"?"#3b82f6":n.type==="maint"?"#d4a853":"#999",flexShrink:0}}/>
              <div className="row-i"><div className="row-t" style={{fontWeight:n.read?500:700,fontSize:11}}>{n.msg}</div><div className="row-s">{n.date}</div></div>
              {!n.read&&<div className="notif-dot"/>}
            </div>)}
          </>);
          case "appPipeline":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Application Pipeline</div>
            {[["new-lead","New Lead"],["applied","Applied"],["approved","Approved"],["onboarding","Onboarding"]].map(([k,l])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                <span style={{fontSize:11,color:"#5c4a3a"}}>{l}</span>
                <span style={{fontSize:12,fontWeight:700,color:appsByStage[k]>0?"#1a1714":"#ccc"}}>{appsByStage[k]}</span>
              </div>
            ))}
            <div style={{marginTop:8}}><button className="btn btn-out btn-sm" style={{fontSize:10,width:"100%"}} onClick={()=>goTab("applications")}>View All</button></div>
          </>);
          case "upcomingRent":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Upcoming Rent</div>
            <div style={{fontSize:24,fontWeight:800,color:"#1a1714",marginBottom:4}}>{fmtS(nextRentTotal)}</div>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:10}}>{daysUntilNextRent} day{daysUntilNextRent!==1?"s":""} · {nextRentCharges.filter(c=>c.category==="Rent").length} charges</div>
            {nextRentCharges.filter(c=>c.category==="Rent").slice(0,4).map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:11}}><span>{c.tenantName}</span><span style={{fontWeight:700}}>{fmtS(c.amount)}</span></div>)}
          </>);
          case "ytdRevenue":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>YTD Revenue</div>
            <div style={{fontSize:24,fontWeight:800,color:"#4a7c59",marginBottom:4}}>{fmtS(ytdCollected)}</div>
            <div style={{fontSize:11,color:"#6b5e52"}}>Collected Jan – {TODAY.toLocaleString("default",{month:"short"})} {TODAY.getFullYear()}</div>
          </>);
          case "ytdExpenses":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>YTD Expenses</div>
            <div style={{fontSize:24,fontWeight:800,color:"#c45c4a",marginBottom:4}}>{fmtS(ytdExpenses)}</div>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:6}}>Spent Jan – {TODAY.toLocaleString("default",{month:"short"})} {TODAY.getFullYear()}</div>
            {ytdExpenses===0&&<div style={{fontSize:10,color:"#6b5e52"}}>No expenses yet. <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("accounting")}>Add in Accounting</button></div>}
          </>);
          case "noi":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Net Operating Income</div>
            <div style={{fontSize:24,fontWeight:800,color:ytdNOI>=0?"#4a7c59":"#c45c4a",marginBottom:4}}>{fmtS(ytdNOI)}</div>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:6}}>YTD · {fmtS(ytdCollected)} revenue minus {fmtS(ytdExpenses)} expenses</div>
            {ytdExpenses===0&&<div style={{fontSize:10,color:"#6b5e52"}}>Add expenses in <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("accounting")}>Accounting</button> for accurate NOI</div>}
          </>);
          case "vacancyCost":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Vacancy Cost</div>
            {m.vacs.length===0?<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>Fully occupied — no vacancy loss</div>:<>
              <div style={{fontSize:24,fontWeight:800,color:"#c45c4a",marginBottom:4}}>{fmtS(m.lost)}/mo</div>
              <div style={{fontSize:11,color:"#6b5e52"}}>{fmtS(Math.round(m.lost/30))}/day · {m.vacs.length} empty room{m.vacs.length!==1?"s":""}</div>
            </>}
          </>);
          case "leaseRenewals":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Renewals Needed (60d)</div>
            {m.expiring.filter(r=>r.daysLeft<=60).length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>No renewals needed in next 60 days</div>}
            {m.expiring.filter(r=>r.daysLeft<=60).map(r=><div key={r.id} className="row" style={{padding:"6px 0"}}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{r.tenant&&r.tenant.name}</div><div className="row-s">Expires {fmtD(r.le)} · {r.propName}</div></div><button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("tenants")}>Renew</button></div>)}
          </>);
          case "doorCodes":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Door Codes</div>
            {allTenants.filter(r=>r.tenant&&r.tenant.doorCode).length===0&&<div style={{fontSize:12,color:"#6b5e52"}}>No door codes on file</div>}
            {allTenants.filter(r=>r.tenant&&r.tenant.doorCode).map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <div><div style={{fontSize:11,fontWeight:600}}>{r.tenant.name}</div><div style={{fontSize:9,color:"#6b5e52"}}>{roomSubLine(r.propName,r.name)}</div></div>
              <div style={{fontFamily:"monospace",fontSize:16,fontWeight:800,letterSpacing:4,color:"#1a1714"}}>{r.tenant.doorCode}</div>
            </div>)}
          </>);
          case "cleaning":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Cleaning Schedule</div>
            {props.map(p=>{const freq=(p.units&&p.units[0]&&p.units[0].clean)||p.clean||"Biweekly";return(<div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}><span style={{fontSize:11,fontWeight:600}}>{getPropDisplayName(p)||p.name}</span><span style={{fontSize:10,color:"#6b5e52"}}>{freq}</span></div>);})}
          </>);
          case "propBreakdown":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Revenue by Property</div>
            {m.propBreakdown.map(pr=><div key={pr.id} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,fontWeight:600}}>{getPropDisplayName(pr)}</span><span style={{fontSize:11,fontWeight:700,color:"#4a7c59"}}>{fmtS(pr.collected)}</span></div>
              <div style={{height:4,borderRadius:2,background:"rgba(0,0,0,.06)"}}><div style={{height:"100%",borderRadius:2,background:"#4a7c59",width:(pr.fullOcc>0?Math.min(Math.round(pr.collected/pr.fullOcc*100),100):0)+"%"}}/></div>
              <div style={{fontSize:9,color:"#6b5e52",marginTop:2}}>{pr.occCount} occupied · {fmtS(pr.fullOcc)}/mo at full</div>
            </div>)}
          </>);
          case "roe":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Return on Equity</div>
            {totalPropValue===0?<NeedsData label="ROE" goTo="properties" field="estimated property values in each property"/>:<>
              <div style={{fontSize:24,fontWeight:800,color:roe&&roe>=8?"#4a7c59":"#c45c4a",marginBottom:4}}>{roe!==null?roe+"%":"—"}</div>
              <div style={{fontSize:11,color:"#6b5e52",marginBottom:4}}>Annualized · Equity {fmtS(totalEquity)} · NOI {fmtS(Math.round(annualNOI))}/yr</div>
              <div style={{fontSize:10,color:"#6b5e52"}}>Prop value {fmtS(totalPropValue)} minus debt {fmtS(totalDebt)}</div>
            </>}
          </>);
          case "profitability":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Profitability by Property</div>
            {props.some(p=>!p.estimatedValue)?<NeedsData label="profitability" goTo="properties" field="estimated values in each property"/>:
              props.map(pr=>{
                const prInc=ytdCharges.filter(c=>c.propName===pr.name).reduce((s,c)=>s+c.amountPaid,0);
                const prExp=expenses.filter(e=>e.propId===pr.id&&new Date(e.date+"T00:00:00").getFullYear()===TODAY.getFullYear()).reduce((s,e)=>s+e.amount,0);
                const prNOI=prInc-prExp;const margin=prInc>0?Math.round(prNOI/prInc*100):0;
                return(<div key={pr.id} style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:600}}>{getPropDisplayName(pr)}</span><span style={{fontSize:11,fontWeight:700,color:prNOI>=0?"#4a7c59":"#c45c4a"}}>{fmtS(prNOI)} NOI</span></div>
                  <div style={{fontSize:9,color:"#6b5e52"}}>Income {fmtS(prInc)} · Expenses {fmtS(prExp)} · {margin}% margin</div>
                </div>);
              })
            }
          </>);
          case "dscr":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>DSCR</div>
            {mortgages.length===0?<NeedsData label="DSCR" goTo="accounting" field="mortgage data in Accounting"/>:
              mortgages.map(mg=>{
                const propInc=ytdCharges.filter(c=>c.propName===mg.propName).reduce((s,c)=>s+c.amountPaid,0)*(12/Math.max(TODAY.getMonth()+1,1));
                const annDebt=(mg.payment||0)*12;const dscr=annDebt>0?(propInc/annDebt).toFixed(2):null;
                return(<div key={mg.id} style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:600}}>{mg.propName}</span><span style={{fontSize:14,fontWeight:800,color:dscr&&dscr>=1.25?"#4a7c59":dscr&&dscr>=1?"#d4a853":"#c45c4a"}}>{dscr||"—"}x</span></div>
                  <div style={{fontSize:9,color:"#6b5e52"}}>NOI {fmtS(Math.round(propInc))}/yr vs debt {fmtS(annDebt)}/yr</div>
                </div>);
              })
            }
          </>);
          case "rocks":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Traction Rocks</div>
            {rocks.filter(r=>r.status!=="done").length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>All rocks complete</div>}
            {rocks.filter(r=>r.status!=="done").slice(0,5).map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <div><div style={{fontSize:11,fontWeight:600}}>{r.title}</div><div style={{fontSize:9,color:"#6b5e52"}}>Due {fmtD(r.due)} · {r.owner}</div></div>
              <span className={"badge "+(r.status==="on-track"?"b-green":r.status==="off-track"?"b-red":"b-gray")} style={{fontSize:8,flexShrink:0}}>{r.status}</span>
            </div>)}
          </>);
          case "pendingActions":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Pending Actions</div>
            <div style={{display:"flex",gap:8}}>
              <div onClick={()=>goTab("messages")} style={{flex:1,padding:"10px 12px",background:"rgba(0,0,0,.02)",borderRadius:8,border:"1px solid rgba(0,0,0,.06)",cursor:"pointer",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,0,0,.15)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,0,0,.06)"}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1714" strokeWidth="1.75"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                  <span style={{fontSize:11,fontWeight:700}}>Messages</span>
                </div>
                <div style={{fontSize:9,color:"#6b5e52"}}>Renewals, notices, questions</div>
              </div>
              <div onClick={()=>goTab("announcements")} style={{flex:1,padding:"10px 12px",background:"rgba(0,0,0,.02)",borderRadius:8,border:"1px solid rgba(0,0,0,.06)",cursor:"pointer",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,0,0,.15)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,0,0,.06)"}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1714" strokeWidth="1.75"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                  <span style={{fontSize:11,fontWeight:700}}>Announcements</span>
                </div>
                <div style={{fontSize:9,color:"#6b5e52"}}>{(settings.announcements||[]).filter(a=>!a.expiresAt||new Date(a.expiresAt)>new Date()).length} active</div>
              </div>
            </div>
          </>);
          default:return null;
        }};
        return(<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <h2 style={{fontSize:22,fontWeight:800,color:"#1a1714",marginBottom:2}}>{MO}</h2>
            <div style={{fontSize:12,color:"#6b5e52"}}>{daysUntilNextRent} day{daysUntilNextRent!==1?"s":""} until next rent cycle</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <button className="btn btn-out btn-sm" onClick={openCreateCharge}>+ Charge</button>
            <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"addCredit",roomId:"",amount:0,reason:""})}>+ Credit</button>
            <button className="btn btn-out btn-sm" onClick={()=>goTab("applications")}>+ Application</button>
            <button className="btn btn-out btn-sm" style={{borderColor:editMode?"#c45c4a":"rgba(0,0,0,.08)",color:editMode?"#c45c4a":"#5c4a3a",background:editMode?"rgba(196,92,74,.06)":"#fff"}} onClick={()=>setDashEditMode(e=>!e)}>{dashEditMode?"Done Editing":"Edit Widgets"}</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          <div className="card" style={{margin:0,cursor:"pointer"}} onClick={()=>setDrill(drill==="coll"?null:"coll")}><div className="card-bd" style={{textAlign:"center",padding:"14px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Collected</div>
            <div style={{fontSize:22,fontWeight:800,color:"#4a7c59",marginBottom:2}}>{fmtS(mtdCollected)}</div>
            <div style={{fontSize:10,color:"#6b5e52"}}>{mtdExpected>0?Math.round(mtdCollected/mtdExpected*100):0}% of {fmtS(mtdExpected)}</div>
          </div></div>
          <div className="card" style={{margin:0,cursor:"pointer",borderColor:mtdPastDue.length?"rgba(196,92,74,.3)":"rgba(0,0,0,.06)"}} onClick={()=>{goTab("payments");setPaySubTab("charges");setPayFilters({...payFilters,status:"pastdue"});}}><div className="card-bd" style={{textAlign:"center",padding:"14px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Past Due</div>
            <div style={{fontSize:22,fontWeight:800,color:mtdPastDue.length?"#c45c4a":"#4a7c59",marginBottom:2}}>{mtdPastDue.length?fmtS(mtdPastDue.reduce((s,c)=>s+(c.amount-c.amountPaid),0)):"None"}</div>
            <div style={{fontSize:10,color:"#6b5e52"}}>{mtdPastDue.length} charge{mtdPastDue.length!==1?"s":""} overdue</div>
          </div></div>
          <div className="card" style={{margin:0,cursor:"pointer"}} onClick={()=>setDrill(drill==="occ"?null:"occ")}><div className="card-bd" style={{textAlign:"center",padding:"14px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Occupancy</div>
            <div style={{fontSize:22,fontWeight:800,color:m.occRate>=90?"#4a7c59":"#c45c4a",marginBottom:2}}>{m.occRate}%</div>
            <div style={{fontSize:10,color:"#6b5e52"}}>{m.occ}/{m.total} rooms · {fmtS(m.lost)}/mo lost</div>
          </div></div>
          <div className="card" style={{margin:0,cursor:"pointer"}} onClick={()=>goTab("maintenance")}><div className="card-bd" style={{textAlign:"center",padding:"14px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Maintenance</div>
            <div style={{fontSize:22,fontWeight:800,color:m.openMaint?"#d4a853":"#4a7c59",marginBottom:2}}>{m.openMaint}</div>
            <div style={{fontSize:10,color:"#6b5e52"}}>open request{m.openMaint!==1?"s":""}</div>
          </div></div>
        </div>

        {drill==="occ"&&<div className="card" style={{marginBottom:16,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Occupancy — {m.occ}/{m.total} rooms</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>Close</button></div>
          {m.vacs.length===0&&<div style={{padding:20,textAlign:"center",color:"#4a7c59",fontWeight:700,fontSize:13}}>Fully occupied</div>}
          {m.vacs.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.name}</div><div className="row-s">{r.propName} · {r.pb?"Private":"Shared"} bath</div></div><div className="row-v kb">{fmtS(r.rent)}<div style={{fontSize:9,color:"#6b5e52"}}>lost/mo</div></div><button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("applications")}>Find Tenant</button></div>)}
        </div></div>}
        {drill==="coll"&&<div className="card" style={{marginBottom:16,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Collection — {fmtS(m.coll)} / {fmtS(m.due)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>Close</button></div>
          {m.unpaid.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#c45c4a",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Unpaid ({m.unpaid.length})</div>
            {m.unpaid.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.tenant&&r.tenant.name}</div><div className="row-s">{roomSubLine(r.propName,r.name)}</div></div><div className="row-v kb">{fmtS(r.rent)}</div><button className="btn btn-green btn-sm" onClick={()=>openPayForm(r.id)}>Record Payment</button></div>)}</>}
          {m.paid.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#4a7c59",marginTop:12,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Paid ({m.paid.length})</div>
            {m.paid.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#4a7c59"}}/><div className="row-i"><div className="row-t">{r.tenant&&r.tenant.name}</div><div className="row-s">{r.propName}</div></div><div className="row-v kg">{fmtS(r.paidAmt)}</div></div>)}</>}
        </div></div>}

        {dashEditMode&&availableToAdd.length>0&&<div className="card" style={{marginBottom:16,border:"1px solid rgba(74,124,89,.2)",background:"rgba(74,124,89,.02)"}}><div className="card-bd">
          <div style={{fontSize:10,fontWeight:700,color:"#4a7c59",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Add Widgets</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {availableToAdd.map(w=><button key={w.id} onClick={()=>addWidget(w.id)} style={{padding:"6px 14px",borderRadius:7,border:"1px solid rgba(74,124,89,.3)",background:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:"#4a7c59",fontFamily:"inherit"}}>+ {w.label}</button>)}
          </div>
        </div></div>}

        <style>{`@keyframes widgetWiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-0.8deg)}75%{transform:rotate(0.8deg)}}`}</style>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
          {activeWidgets.map(id=>(
            <div key={id} draggable={editMode} onDragStart={()=>onDragStart(id)} onDragOver={e=>onDragOver(e,id)} onDrop={e=>onDrop(e,id)} onDragEnd={onDragEnd}
              style={{animation:editMode?"widgetWiggle .5s ease-in-out infinite":"none",animationDelay:Math.random()*.2+"s",cursor:editMode?"grab":"default",opacity:dragWidget===id?.4:1,outline:dragOver===id&&dragWidget!==id?"2px dashed #4a7c59":"none",outlineOffset:2,borderRadius:10,transition:"opacity .15s"}}>
              <div className="card" style={{margin:0,position:"relative",height:"100%"}}>
                {editMode&&<button onClick={()=>removeWidget(id)} style={{position:"absolute",top:8,right:8,width:22,height:22,borderRadius:"50%",background:"#c45c4a",color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,padding:0,lineHeight:1}}>x</button>}
                <div className="card-bd" style={{paddingRight:editMode?36:undefined}}>{renderWidget(id)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Actions is now a dashboard widget — removable via Edit Widgets */}
      </>);
}
