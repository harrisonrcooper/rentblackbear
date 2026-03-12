"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { PROPERTIES, SETTINGS } from "../../../lib/data";

const fmtS=n=>"$"+Number(n).toLocaleString();
const fmt=n=>"$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const uid=()=>Math.random().toString(36).slice(2,9);
const TODAY=new Date();
const THIS_MONTH=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
const NEXT_MONTH=new Date(TODAY.getFullYear(),TODAY.getMonth()+1,1).toLocaleString("default",{month:"long",year:"numeric"});
function initPayments(){const p={};PROPERTIES.forEach(pr=>pr.rooms.forEach(r=>{if((r.status||r.roomStatus)==="occupied")p[r.id]={[THIS_MONTH]:Math.random()>0.2?r.rent:0};}));return p;}
const CAT_ICONS={Utilities:"💡",Cleaning:"🧹",Maintenance:"🔧",Insurance:"🛡️",Other:"📋"};

const S=`
*{margin:0;padding:0;box-sizing:border-box}
.page{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#f4f3f0;min-height:100vh;color:#1a1714}
.header{background:#1a1714;padding:24px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.header h1{font-size:20px;font-weight:800;color:#f5f0e8}.header-sub{font-size:11px;color:#c4a882;margin-top:2px}
.back{color:#c4a882;text-decoration:none;font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px;padding:8px 16px;border-radius:8px;background:rgba(255,255,255,.08)}
.back:hover{background:rgba(255,255,255,.12)}
.cnt{max-width:1100px;margin:0 auto;padding:28px 40px 60px}
.btn{padding:8px 16px;border-radius:8px;border:none;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .12s}
.btn:hover{transform:translateY(-1px)}
.btn-gold{background:#d4a853;color:#1a1714}.btn-green{background:#4a7c59;color:#fff}.btn-red{background:rgba(196,92,74,.1);color:#c45c4a}
.btn-out{background:#fff;border:1px solid rgba(0,0,0,.1);color:#1a1714}
.btn-sm{padding:5px 10px;font-size:10px;border-radius:6px}
.tabs{display:flex;gap:4px;margin-bottom:24px;border-bottom:2px solid rgba(0,0,0,.06);padding-bottom:0}
.tab{padding:10px 18px;font-size:13px;font-weight:600;color:#999;cursor:pointer;border:none;background:none;font-family:inherit;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s}
.tab:hover{color:#1a1714}.tab.on{color:#1a1714;border-bottom-color:#d4a853;font-weight:800}
.kgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.kpi{background:#fff;border-radius:12px;padding:18px;border:1px solid rgba(0,0,0,.04)}
.kl{font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
.kv{font-size:26px;font-weight:800;line-height:1}.ks{font-size:11px;margin-top:4px;color:#5c4a3a}
.pc{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.04);margin-bottom:12px;overflow:hidden}
.pc-head{padding:16px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}.pc-head:hover{background:rgba(0,0,0,.01)}
.pc-nm{font-size:15px;font-weight:800}.pc-addr{font-size:11px;color:#999}
.ptg{font-size:9px;font-weight:700;padding:2px 8px;border-radius:100px;display:inline-block;margin-right:4px}
.ptg-ok{background:rgba(74,124,89,.1);color:#4a7c59}.ptg-vc{background:rgba(196,92,74,.1);color:#c45c4a}.ptg-t{background:rgba(0,0,0,.04);color:#999}
.rm{display:flex;align-items:center;padding:12px 20px;border-top:1px solid rgba(0,0,0,.03);gap:10px}.rm:hover{background:rgba(0,0,0,.01)}
.rm-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}.rm-o{background:#4a7c59}.rm-v{background:#c45c4a}.rm-l{background:#d4a853}
.rm-i{flex:1}.rm-n{font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px}.rm-t{font-size:11px;color:#999;margin-top:1px}
.rbdg{font-size:8px;padding:2px 6px;border-radius:100px;font-weight:700}.rb-p{background:rgba(74,124,89,.08);color:#4a7c59}.rb-s{background:rgba(0,0,0,.04);color:#999}
.rm-r{font-size:14px;font-weight:800;min-width:70px;text-align:right}
.rm-pd{font-size:10px;font-weight:600;text-align:right;margin-top:1px}.rm-y{color:#4a7c59}.rm-nn{color:#c45c4a}
.ptbl{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,.04)}
.ptbl th{text-align:left;padding:10px 16px;font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid rgba(0,0,0,.05)}
.ptbl td{padding:12px 16px;font-size:13px;border-bottom:1px solid rgba(0,0,0,.03)}.ptbl tr:hover td{background:rgba(212,168,83,.02)}
.ptbl .tot td{font-weight:800;border-top:2px solid rgba(0,0,0,.08);background:rgba(212,168,83,.04)}
.vg{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-top:16px}
.vc{background:#fff;border-radius:12px;padding:16px;border:2px solid rgba(196,92,74,.15);text-align:center}
.er{display:flex;align-items:center;padding:14px 18px;background:#fff;border-radius:10px;border:1px solid rgba(0,0,0,.04);margin-bottom:8px;gap:12px}.er:hover{border-color:rgba(212,168,83,.2)}
.ec{font-size:18px;width:36px;height:36px;border-radius:8px;background:rgba(212,168,83,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lbar{height:8px;border-radius:4px;background:#e5e3df;position:relative;margin:8px 0}
.lfill{height:100%;border-radius:4px;position:absolute;left:0;top:0}
.sec-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.sec-hd h2{font-size:16px;font-weight:800}
.mbg{position:fixed;inset:0;background:rgba(26,23,20,.6);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.mbox{background:#fff;border-radius:16px;max-width:600px;width:100%;max-height:85vh;overflow-y:auto;padding:24px}
.mbox h2{font-size:17px;font-weight:800;margin-bottom:16px}
.fld{margin-bottom:12px}.fld label{display:block;font-size:10px;font-weight:700;color:#999;margin-bottom:4px;text-transform:uppercase;letter-spacing:.3px}
.fld input,.fld select{width:100%;padding:9px 12px;border-radius:8px;border:1px solid rgba(0,0,0,.1);font-family:inherit;font-size:13px;outline:none;background:#faf9f7}.fld input:focus,.fld select:focus{border-color:#d4a853}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mft{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(0,0,0,.05)}
.undo-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1a1714;color:#f5f0e8;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:200;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,.3)}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:768px){.kgrid{grid-template-columns:1fr 1fr}.vg{grid-template-columns:1fr}.cnt{padding:20px}}
`;

export default function PMDashboard(){
  const[tab,setTab]=useState("collect");
  const[payments,setPayments]=useState(initPayments);
  const[expenses,setExpenses]=useState([
    {id:"e1",date:"2026-03-05",description:"Huntsville Utilities - Water/Electric",amount:347.22,propertyId:"p1",split:"allTenants",splitCount:4,category:"Utilities"},
    {id:"e2",date:"2026-03-01",description:"CleanPro - Weekly Clean",amount:175,propertyId:"p1",split:"property",category:"Cleaning"},
    {id:"e3",date:"2026-03-01",description:"CleanPro - Biweekly Clean",amount:125,propertyId:"p2",split:"property",category:"Cleaning"},
  ]);
  const[expanded,setExpanded]=useState({});
  const[showExp,setShowExp]=useState(false);
  const[undoStack,setUndoStack]=useState([]);
  const toggle=id=>setExpanded(p=>({...p,[id]:!p[id]}));

  const m=useMemo(()=>{
    let total=0,occ=0,full=0,proj=0,coll=0,due=0;const vacs=[],expiring=[];
    const pbd=PROPERTIES.map(pr=>{
      const occR=pr.rooms.filter(r=>(r.status||r.roomStatus)==="occupied"),vacR=pr.rooms.filter(r=>(r.status||r.roomStatus)!=="occupied");
      const prj=occR.reduce((s,r)=>s+r.rent,0),fl=pr.rooms.reduce((s,r)=>s+r.rent,0);
      const cl=occR.reduce((s,r)=>s+(payments[r.id]?.[THIS_MONTH]||0),0);
      pr.rooms.forEach(r=>{total++;full+=r.rent;if((r.status||r.roomStatus)==="occupied"){occ++;proj+=r.rent;due+=r.rent;coll+=payments[r.id]?.[THIS_MONTH]||0;
        if(r.tenant?.leaseEnd){const d=Math.ceil((new Date(r.tenant.leaseEnd)-TODAY)/(1e3*60*60*24));if(d<=90)expiring.push({...r,propName:pr.name,daysLeft:d});}
      }else vacs.push({...r,propName:pr.name});});
      return{...pr,occCount:occR.length,vacCount:vacR.length,projected:prj,fullOcc:fl,collected:cl};
    });
    return{total,occ,full,proj,coll,due,vacs,expiring,pbd,occRate:total?Math.round(occ/total*100):0,collRate:due?Math.round(coll/due*100):0,lost:full-proj};
  },[payments]);

  const recordPay=rid=>{const r=PROPERTIES.flatMap(p=>p.rooms).find(x=>x.id===rid);if(r){const prev=payments[rid]?.[THIS_MONTH]||0;setUndoStack(s=>[{roomId:rid,prev,name:r.tenant?.name||"?",amt:r.rent,ts:Date.now()},...s].slice(0,20));setPayments(p=>({...p,[rid]:{...p[rid],[THIS_MONTH]:r.rent}}));}};
  const undoPay=a=>{setPayments(p=>({...p,[a.roomId]:{...p[a.roomId],[THIS_MONTH]:a.prev}}));setUndoStack(s=>s.filter(x=>x.ts!==a.ts));};
  const addExp=e=>{setExpenses(p=>[{...e,id:uid()},...p]);setShowExp(false);};

  const tabs=[{id:"collect",label:"💰 Rent Collection"},{id:"vacancy",label:"🔑 Vacancies"},{id:"projected",label:"📈 Projections"},{id:"expenses",label:"💸 Expenses"},{id:"leases",label:"📋 Leases"}];

  return (<div className="page"><style>{S}</style>
    <div className="header"><div><h1>💰 Property Management</h1><div className="header-sub">{THIS_MONTH} · {SETTINGS.companyName}</div></div><Link href="/admin" className="back">← Back to HQ</Link></div>
    <div className="cnt">
      <div className="kgrid">
        <div className="kpi"><div className="kl">Collected</div><div className="kv">{fmtS(m.coll)}</div><div className="ks" style={{color:m.collRate>=100?"#4a7c59":"#c45c4a"}}>{m.collRate}% of {fmtS(m.due)}</div></div>
        <div className="kpi"><div className="kl">Projected</div><div className="kv">{fmtS(m.proj)}</div><div className="ks">of {fmtS(m.full)} at full</div></div>
        <div className="kpi"><div className="kl">Vacancies</div><div className="kv" style={{color:m.vacs.length?"#c45c4a":"#4a7c59"}}>{m.vacs.length}</div><div className="ks">{m.occ}/{m.total} rooms</div></div>
        <div className="kpi"><div className="kl">Lost/mo</div><div className="kv" style={{color:m.lost?"#c45c4a":"#4a7c59"}}>{fmtS(m.lost)}</div><div className="ks">vacancy cost</div></div>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={`tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {/* RENT COLLECTION */}
      {tab==="collect"&&PROPERTIES.map(pr=>{const occ=pr.rooms.filter(r=>(r.status||r.roomStatus)==="occupied");const c=occ.reduce((s,r)=>s+(payments[r.id]?.[THIS_MONTH]||0),0);const d=occ.reduce((s,r)=>s+r.rent,0);const vc=pr.rooms.length-occ.length;
        return (<div key={pr.id} className="pc"><div className="pc-head" onClick={()=>toggle(pr.id)}><div><div className="pc-nm">{expanded[pr.id]?"▾":"▸"} {pr.name}</div><div className="pc-addr">{pr.address}</div><div style={{marginTop:4}}>{vc===0?<span className="ptg ptg-ok">Full</span>:<span className="ptg ptg-vc">{vc} Vacant</span>}<span className="ptg ptg-t">{pr.typeTag||pr.type}</span></div></div><div style={{fontSize:18,fontWeight:800}}>{fmtS(c)}<small style={{fontSize:11,color:"#999"}}> / {fmtS(d)}</small></div></div>
          {expanded[pr.id]&&<div>{pr.rooms.map(r=>{const pd=payments[r.id]?.[THIS_MONTH]||0;const isV=(r.status||r.roomStatus)!=="occupied";return(
            <div key={r.id} className="rm"><div className={`rm-dot ${isV?"rm-v":pd?"rm-o":"rm-l"}`}/><div className="rm-i"><div className="rm-n">{r.name}<span className={`rbdg ${r.privateBath?"rb-p":"rb-s"}`}>{r.privateBath?"Priv":"Shared"}</span></div>{r.tenant?<div className="rm-t">{r.tenant.name} · {r.tenant.phone}</div>:<div className="rm-t" style={{color:"#c45c4a"}}>Vacant — {fmtS(r.rent)}/mo lost</div>}</div>
              <div style={{textAlign:"right"}}><div className="rm-r">{fmtS(r.rent)}</div>{!isV&&<div className={`rm-pd ${pd?"rm-y":"rm-nn"}`}>{pd?"✓ Paid":"✕ Unpaid"}</div>}</div>
              {!isV&&!pd&&<button className="btn btn-green btn-sm" onClick={()=>recordPay(r.id)}>Pay</button>}</div>);})}</div>}</div>);
      })}

      {/* VACANCIES */}
      {tab==="vacancy"&&<>{m.vacs.length===0?<div style={{textAlign:"center",padding:48,color:"#4a7c59"}}><div style={{fontSize:48}}>🎉</div><h3 style={{marginTop:8}}>Fully Occupied!</h3></div>:
        <><div className="sec-hd"><div><h2>Vacant Rooms — {fmtS(m.lost)}/mo lost</h2></div></div>
          <div className="vg">{m.vacs.map(r=>(<div key={r.id} className="vc"><div style={{fontSize:11,color:"#999",fontWeight:600}}>{r.propName}</div><div style={{fontSize:15,fontWeight:800,margin:"4px 0"}}>{r.name}</div><div style={{fontSize:11,color:"#999"}}>{r.privateBath?"Private":"Shared"} Bath</div><div style={{fontSize:20,fontWeight:800,color:"#c45c4a",marginTop:4}}>{fmtS(r.rent)}<small style={{fontSize:11,color:"#999"}}>/mo</small></div></div>))}</div>
          <div style={{marginTop:20,background:"#fff",borderRadius:12,padding:18,border:"1px solid rgba(0,0,0,.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.03)"}}><span>Monthly Lost</span><strong style={{color:"#c45c4a"}}>{fmtS(m.lost)}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0"}}><span>Annual Lost</span><strong style={{color:"#c45c4a"}}>{fmtS(m.lost*12)}</strong></div></div></>}</>}

      {/* PROJECTIONS */}
      {tab==="projected"&&<><table className="ptbl"><thead><tr><th>Property</th><th>Type</th><th>Occupied</th><th>Vacant</th><th>Projected</th><th>At Full</th><th>Diff</th></tr></thead><tbody>
        {m.pbd.map(p=>(<tr key={p.id}><td style={{fontWeight:700}}>{p.name}</td><td>{p.typeTag||p.type}</td><td style={{color:"#4a7c59",fontWeight:600}}>{p.occCount}</td><td style={{color:p.vacCount?"#c45c4a":"#999"}}>{p.vacCount||"—"}</td><td style={{fontWeight:800}}>{fmtS(p.projected)}</td><td style={{color:"#999"}}>{fmtS(p.fullOcc)}</td><td style={{color:p.fullOcc-p.projected?"#c45c4a":"#4a7c59",fontWeight:700}}>{p.fullOcc-p.projected?`-${fmtS(p.fullOcc-p.projected)}`:"—"}</td></tr>))}
        <tr className="tot"><td>Total</td><td></td><td style={{color:"#4a7c59"}}>{m.occ}</td><td style={{color:m.vacs.length?"#c45c4a":"#999"}}>{m.vacs.length||"—"}</td><td>{fmtS(m.proj)}</td><td>{fmtS(m.full)}</td><td style={{color:m.lost?"#c45c4a":"#4a7c59"}}>{m.lost?`-${fmtS(m.lost)}`:"—"}</td></tr>
      </tbody></table></>}

      {/* EXPENSES */}
      {tab==="expenses"&&<><div className="sec-hd"><div><h2>Expenses</h2></div><button className="btn btn-gold" onClick={()=>setShowExp(true)}>+ Add Expense</button></div>
        {expenses.map(e=>{const pr=PROPERTIES.find(p=>p.id===e.propertyId);return(
          <div key={e.id} className="er"><div className="ec">{CAT_ICONS[e.category]||"📋"}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{e.description}</div><div style={{fontSize:11,color:"#999",marginTop:2}}>{pr?.name} · {e.date} · {e.category}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800}}>{fmt(e.amount)}</div>{e.split==="allTenants"&&e.splitCount>0&&<div style={{fontSize:11,color:"#d4a853",fontWeight:600}}>{fmt(e.amount/e.splitCount)} × {e.splitCount}</div>}</div>
            <button className="btn btn-red btn-sm" onClick={()=>setExpenses(p=>p.filter(x=>x.id!==e.id))}>✕</button></div>)})}</>}

      {/* LEASES */}
      {tab==="leases"&&PROPERTIES.map(pr=>(<div key={pr.id} style={{marginBottom:24}}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:12}}>{pr.name}</div>
        {pr.rooms.filter(r=>r.tenant).map(r=>{const end=new Date(r.tenant.leaseEnd);const start=new Date(r.tenant.leaseStart);const dl=Math.ceil((end-TODAY)/(1e3*60*60*24));const pct=Math.min(100,Math.max(0,(TODAY-start)/(end-start)*100));
          return (<div key={r.id} style={{background:"#fff",borderRadius:12,padding:16,border:"1px solid rgba(0,0,0,.04)",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontWeight:700,fontSize:14}}>{r.tenant.name}</span><span style={{fontSize:12,color:"#999",marginLeft:10}}>{r.name} · {fmtS(r.rent)}/mo</span></div><span style={{fontSize:12,fontWeight:700,color:dl<=30?"#c45c4a":dl<=90?"#d4a853":"#4a7c59"}}>{dl} days left</span></div>
            <div className="lbar"><div className="lfill" style={{width:`${pct}%`,background:dl<=30?"#c45c4a":dl<=90?"#d4a853":"#4a7c59"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#999",marginTop:4}}><span>{r.tenant.leaseStart}</span><span>{r.tenant.leaseEnd}</span></div></div>);})}
        {pr.rooms.filter(r=>!r.tenant).map(r=><div key={r.id} style={{background:"#fff",borderRadius:12,padding:16,border:"2px dashed rgba(196,92,74,.2)",marginBottom:8,display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,color:"#c45c4a"}}>{r.name} — Vacant</span><span style={{color:"#999"}}>{fmtS(r.rent)}/mo</span></div>)}
      </div>))}

    </div>
    {/* Undo */}
    {undoStack.length>0&&undoStack[0].ts>Date.now()-15000&&(<div className="undo-toast"><span>Marked {undoStack[0].name} paid</span><button style={{background:"#d4a853",color:"#1a1714",border:"none",padding:"6px 14px",borderRadius:6,fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>undoPay(undoStack[0])}>↩ Undo</button></div>)}
    {/* Expense Modal */}
    {showExp&&<div className="mbg" onClick={()=>setShowExp(false)}><div className="mbox" onClick={e=>e.stopPropagation()}>
      <h2>Add Expense & Split</h2>
      <ExpForm props={PROPERTIES} payments={payments} onSave={addExp}/>
      <div className="mft"><button className="btn btn-out" onClick={()=>setShowExp(false)}>Cancel</button></div>
    </div></div>}
  </div>);
}

function ExpForm({props,payments,onSave}){
  const[e,setE]=useState({description:"",amount:"",propertyId:props[0]?.id||"",category:"Utilities",split:"allTenants",date:TODAY.toISOString().split("T")[0]});
  const pr=props.find(p=>p.id===e.propertyId);const oc=pr?pr.rooms.filter(r=>(r.status||r.roomStatus)==="occupied").length:0;const pp=e.amount&&oc?Number(e.amount)/oc:0;
  return (<><div className="fr"><div className="fld"><label>Date</label><input type="date" value={e.date} onChange={ev=>setE({...e,date:ev.target.value})}/></div><div className="fld"><label>Category</label><select value={e.category} onChange={ev=>setE({...e,category:ev.target.value})}>{Object.keys(CAT_ICONS).map(c=><option key={c}>{c}</option>)}</select></div></div>
    <div className="fld"><label>Description</label><input value={e.description} onChange={ev=>setE({...e,description:ev.target.value})} placeholder="e.g. March utility bill"/></div>
    <div className="fr"><div className="fld"><label>Amount</label><input type="number" step=".01" value={e.amount} onChange={ev=>setE({...e,amount:ev.target.value})}/></div><div className="fld"><label>Property</label><select value={e.propertyId} onChange={ev=>setE({...e,propertyId:ev.target.value})}>{props.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div></div>
    <div className="fld"><label>Split</label><select value={e.split} onChange={ev=>setE({...e,split:ev.target.value})}><option value="allTenants">Split among tenants</option><option value="property">Property expense</option></select></div>
    {e.split==="allTenants"&&e.amount&&oc>0&&<div style={{background:"rgba(212,168,83,.06)",borderRadius:10,padding:12,fontSize:13,marginTop:4}}><strong>{fmt(pp)}</strong> per tenant ({oc} in {pr?.name}){pr?.utilities==="first100"&&pp>100&&e.category==="Utilities"&&<div style={{color:"#c45c4a",fontWeight:600,marginTop:4,fontSize:12}}>⚠ Exceeds $100/person cap — overage {fmt(pp-100)}/person</div>}</div>}
    <button className="btn btn-gold" style={{width:"100%",marginTop:12}} onClick={()=>{if(!e.description||!e.amount)return;onSave({...e,amount:Number(e.amount),splitCount:oc});}}>Add Expense</button></>);
}
