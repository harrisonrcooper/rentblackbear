"use client";
import { useState } from "react";
import Link from "next/link";

const uid=()=>Math.random().toString(36).slice(2,9);
const CATS=[
  {id:"public",label:"Public Site",emoji:"🌐",color:"#3b82f6"},
  {id:"admin",label:"Admin Dashboard",emoji:"📊",color:"#d4a853"},
  {id:"tenant",label:"Tenant Portal",emoji:"🏠",color:"#4a7c59"},
  {id:"automation",label:"Automation",emoji:"⚡",color:"#8b5cf6"},
  {id:"integration",label:"Integrations",emoji:"🔗",color:"#14b8a6"},
  {id:"content",label:"Content",emoji:"🎨",color:"#ec4899"},
  {id:"future",label:"Future",emoji:"🚀",color:"#f97316"},
];
const PRIS=[{id:"high",icon:"🔴"},{id:"medium",icon:"🟡"},{id:"low",icon:"🟢"}];
const STATS=[{id:"idea",label:"Idea",color:"#94a3b8"},{id:"planned",label:"Planned",color:"#3b82f6"},{id:"building",label:"Building",color:"#d4a853"},{id:"done",label:"Done",color:"#4a7c59"}];

const INIT=[
  {id:uid(),title:"Property listings with per-room pricing",category:"public",priority:"high",status:"done",notes:"Built"},
  {id:uid(),title:"Pre-screening wizard",category:"public",priority:"high",status:"done",notes:"7 yes/no questions + contact form"},
  {id:uid(),title:"AI chat widget",category:"public",priority:"high",status:"done",notes:"Powered by Claude"},
  {id:uid(),title:"Comparison table",category:"public",priority:"medium",status:"done",notes:"Side-by-side properties"},
  {id:uid(),title:"Insta360 3D tour embeds",category:"public",priority:"high",status:"planned",notes:"Need to capture tours"},
  {id:uid(),title:"Floor plans",category:"public",priority:"medium",status:"planned",notes:"Need diagrams"},
  {id:uid(),title:"Savings calculator",category:"public",priority:"low",status:"idea",notes:"Like LifeDoor"},
  {id:uid(),title:"Testimonials section",category:"public",priority:"medium",status:"idea",notes:""},
  {id:uid(),title:"Traction scorecard",category:"admin",priority:"high",status:"done",notes:"KPIs, rocks, issues, charts"},
  {id:uid(),title:"PM dashboard",category:"admin",priority:"high",status:"done",notes:"Finances, rent, leases"},
  {id:uid(),title:"No-code property editor",category:"admin",priority:"high",status:"done",notes:"Edit without code"},
  {id:uid(),title:"Theme editor",category:"admin",priority:"medium",status:"done",notes:"Color pickers, presets"},
  {id:uid(),title:"Password protection",category:"admin",priority:"high",status:"planned",notes:"Before adding real data"},
  {id:uid(),title:"Maintenance requests",category:"tenant",priority:"high",status:"idea",notes:"Submit with photos"},
  {id:uid(),title:"House info page",category:"tenant",priority:"medium",status:"idea",notes:"WiFi, rules, schedule"},
  {id:uid(),title:"Rent payment portal",category:"tenant",priority:"high",status:"idea",notes:"Stripe integration"},
  {id:uid(),title:"Automated move-in emails",category:"automation",priority:"medium",status:"idea",notes:""},
  {id:uid(),title:"Rent due reminders",category:"automation",priority:"medium",status:"idea",notes:""},
  {id:uid(),title:"Stripe for rent",category:"integration",priority:"high",status:"idea",notes:"ACH ~0.8%"},
  {id:uid(),title:"Background check API",category:"integration",priority:"medium",status:"idea",notes:"SmartMove/RentPrep"},
  {id:uid(),title:"E-signatures",category:"integration",priority:"medium",status:"idea",notes:"DocuSign/HelloSign"},
  {id:uid(),title:"Self-showing temp codes",category:"integration",priority:"medium",status:"idea",notes:""},
  {id:uid(),title:"Replace stock photos",category:"content",priority:"high",status:"planned",notes:"Real property shots"},
  {id:uid(),title:"Capture Insta360 tours",category:"content",priority:"high",status:"planned",notes:"All properties"},
  {id:uid(),title:"Full TurboTenant replacement",category:"future",priority:"low",status:"idea",notes:"All-in-one platform"},
  {id:uid(),title:"Referral program",category:"future",priority:"low",status:"idea",notes:"Rent credit for referrals"},
];

const S=`
*{margin:0;padding:0;box-sizing:border-box}
.page{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#f4f3f0;min-height:100vh;color:#1a1714}
.header{background:#1a1714;padding:24px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.header h1{font-size:20px;font-weight:800;color:#f5f0e8}.header-sub{font-size:11px;color:#c4a882;margin-top:2px}
.back{color:#c4a882;text-decoration:none;font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px;padding:8px 16px;border-radius:8px;background:rgba(255,255,255,.08)}
.cnt{max-width:1200px;margin:0 auto;padding:24px 40px 60px}
.btn{padding:8px 16px;border-radius:8px;border:none;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
.btn-gold{background:#d4a853;color:#1a1714}.btn-out{background:#fff;border:1px solid rgba(0,0,0,.1);color:#1a1714}
.btn-green{background:#4a7c59;color:#fff}.btn-red{background:rgba(196,92,74,.1);color:#c45c4a}
.btn-sm{padding:5px 10px;font-size:10px;border-radius:6px}
.toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:20px}
.vt{display:flex;border-radius:8px;overflow:hidden;border:1px solid rgba(0,0,0,.1)}
.vt-b{padding:7px 14px;font-size:11px;font-weight:600;cursor:pointer;border:none;background:#fff;color:#999;font-family:inherit}.vt-b.on{background:#1a1714;color:#f5f0e8}
.pills{display:flex;gap:4px;flex-wrap:wrap}
.pill{padding:5px 12px;border-radius:100px;font-size:10px;font-weight:600;cursor:pointer;border:1px solid rgba(0,0,0,.06);background:#fff;color:#999}
.pill.on{color:#fff;border-color:transparent}
.stats{display:flex;gap:20px;margin-bottom:20px;font-size:12px;color:#999;flex-wrap:wrap}.stats strong{color:#1a1714}
.cat-hd{display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid rgba(0,0,0,.05)}
.cat-nm{font-size:16px;font-weight:800}.cat-ct{font-size:11px;color:#999;background:rgba(0,0,0,.04);padding:2px 8px;border-radius:100px}
.igrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-bottom:28px}
.idea{background:#fff;border-radius:10px;padding:14px;border:1px solid rgba(0,0,0,.04);transition:all .15s;position:relative}
.idea:hover{border-color:rgba(212,168,83,.3);box-shadow:0 4px 12px rgba(0,0,0,.04)}
.idea-top{display:flex;justify-content:space-between;gap:6px;margin-bottom:6px}.idea-title{font-size:13px;font-weight:700;flex:1;line-height:1.4}
.idea-notes{font-size:11px;color:#5c4a3a;line-height:1.5;margin-bottom:10px}
.idea-ft{display:flex;justify-content:space-between;align-items:center}
.idea-st{font-size:9px;font-weight:700;padding:3px 8px;border-radius:100px;cursor:pointer;text-transform:uppercase;letter-spacing:.5px}
.idea-acts{display:flex;gap:3px;opacity:0;transition:opacity .15s}
.idea:hover .idea-acts{opacity:1}
.idea-act{width:26px;height:26px;border-radius:6px;border:1px solid rgba(0,0,0,.06);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px}.idea-act:hover{background:#f0f0f0}
.list-row{display:flex;align-items:center;padding:10px 14px;background:#fff;border-radius:8px;border:1px solid rgba(0,0,0,.04);margin-bottom:5px;gap:10px;font-size:13px}.list-row:hover{border-color:rgba(212,168,83,.2)}
.mbg{position:fixed;inset:0;background:rgba(26,23,20,.6);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.mbox{background:#fff;border-radius:16px;max-width:500px;width:100%;padding:24px}
.mbox h2{font-size:17px;font-weight:800;margin-bottom:16px}
.fld{margin-bottom:12px}.fld label{display:block;font-size:10px;font-weight:700;color:#999;margin-bottom:4px;text-transform:uppercase}
.fld input,.fld select,.fld textarea{width:100%;padding:9px 12px;border-radius:8px;border:1px solid rgba(0,0,0,.1);font-family:inherit;font-size:13px;outline:none;background:#faf9f7}.fld textarea{resize:vertical;min-height:60px}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:#d4a853}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mft{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(0,0,0,.05)}
@media(max-width:768px){.igrid{grid-template-columns:1fr}.cnt{padding:20px}}
`;

export default function IdeaBoard(){
  const[ideas,setIdeas]=useState(INIT);
  const[view,setView]=useState("board");
  const[fStat,setFStat]=useState("all");
  const[fPri,setFPri]=useState("all");
  const[modal,setModal]=useState(null);
  const[isNew,setIsNew]=useState(false);

  const filtered=ideas.filter(i=>(fStat==="all"||i.status===fStat)&&(fPri==="all"||i.priority===fPri));
  const cycle=id=>setIdeas(p=>p.map(i=>{if(i.id!==id)return i;const o=["idea","planned","building","done"];return{...i,status:o[(o.indexOf(i.status)+1)%o.length]};}));
  const saveIdea=item=>{if(isNew)setIdeas(p=>[item,...p]);else setIdeas(p=>p.map(i=>i.id===item.id?item:i));setModal(null);};
  const counts={total:ideas.length,done:ideas.filter(i=>i.status==="done").length,building:ideas.filter(i=>i.status==="building").length,planned:ideas.filter(i=>i.status==="planned").length};

  return (<div className="page"><style>{S}</style>
    <div className="header"><div><h1>💡 Idea Board</h1><div className="header-sub">Plan every feature for rentblackbear.com</div></div>
      <div style={{display:"flex",gap:8}}><button className="btn btn-gold" onClick={()=>{setIsNew(true);setModal({});}}>+ New Idea</button><Link href="/admin" className="back">← HQ</Link></div></div>
    <div className="cnt">
      <div className="toolbar">
        <div className="vt"><button className={`vt-b ${view==="board"?"on":""}`} onClick={()=>setView("board")}>Board</button><button className={`vt-b ${view==="list"?"on":""}`} onClick={()=>setView("list")}>List</button><button className={`vt-b ${view==="status"?"on":""}`} onClick={()=>setView("status")}>Status</button></div>
        <div className="pills">{STATS.map(s=><button key={s.id} className={`pill ${fStat===s.id?"on":""}`} style={fStat===s.id?{background:s.color,color:"#fff"}:{}} onClick={()=>setFStat(fStat===s.id?"all":s.id)}>{s.label}</button>)}
          {PRIS.map(p=><button key={p.id} className={`pill ${fPri===p.id?"on":""}`} style={fPri===p.id?{background:"#1a1714",color:"#fff"}:{}} onClick={()=>setFPri(fPri===p.id?"all":p.id)}>{p.icon}</button>)}</div>
      </div>
      <div className="stats"><span><strong>{counts.total}</strong> total</span><span style={{color:"#4a7c59"}}>✓ <strong>{counts.done}</strong> done</span><span style={{color:"#d4a853"}}>⚡ <strong>{counts.building}</strong> building</span><span style={{color:"#3b82f6"}}>📋 <strong>{counts.planned}</strong> planned</span>
        <div style={{marginLeft:"auto",width:180,height:6,borderRadius:3,background:"#e5e3df",display:"flex",overflow:"hidden"}}><div style={{width:`${counts.done/counts.total*100}%`,background:"#4a7c59"}}/><div style={{width:`${counts.building/counts.total*100}%`,background:"#d4a853"}}/><div style={{width:`${counts.planned/counts.total*100}%`,background:"#3b82f6"}}/></div></div>

      {view==="board"&&CATS.map(cat=>{const ci=filtered.filter(i=>i.category===cat.id);if(ci.length===0&&fStat!=="all")return null;return (
        <div key={cat.id}><div className="cat-hd"><span style={{fontSize:22}}>{cat.emoji}</span><span className="cat-nm">{cat.label}</span><span className="cat-ct">{ci.length}</span></div>
          {ci.length===0?<div style={{padding:20,textAlign:"center",color:"#ccc",border:"2px dashed rgba(0,0,0,.05)",borderRadius:10,marginBottom:28,fontSize:13}}>No ideas yet</div>:
          <div className="igrid">{ci.map(i=>{const st=STATS.find(s=>s.id===i.status);const pr=PRIS.find(p=>p.id===i.priority);return (
            <div key={i.id} className="idea" style={{borderLeft:`3px solid ${cat.color}`}}>
              <div className="idea-top"><div className="idea-title">{i.title}</div><span style={{fontSize:12}}>{pr?.icon}</span></div>
              {i.notes&&<div className="idea-notes">{i.notes}</div>}
              <div className="idea-ft"><span className="idea-st" style={{background:`${st?.color}18`,color:st?.color}} onClick={()=>cycle(i.id)}>{st?.label}</span>
                <div className="idea-acts"><button className="idea-act" onClick={()=>{setIsNew(false);setModal(i);}}>✏️</button><button className="idea-act" onClick={()=>cycle(i.id)}>→</button><button className="idea-act" style={{color:"#c45c4a"}} onClick={()=>setIdeas(p=>p.filter(x=>x.id!==i.id))}>✕</button></div></div>
            </div>);})}</div>}</div>);})}

      {view==="list"&&filtered.map(i=>{const cat=CATS.find(c=>c.id===i.category);const st=STATS.find(s=>s.id===i.status);const pr=PRIS.find(p=>p.id===i.priority);return (
        <div key={i.id} className="list-row"><span style={{fontSize:16}}>{cat?.emoji}</span><div style={{flex:1}}><div style={{fontWeight:700}}>{i.title}</div>{i.notes&&<div style={{fontSize:11,color:"#999",marginTop:1}}>{i.notes}</div>}</div>
          <span style={{fontSize:12}}>{pr?.icon}</span><span className="idea-st" style={{background:`${st?.color}18`,color:st?.color,cursor:"pointer"}} onClick={()=>cycle(i.id)}>{st?.label}</span>
          <button className="btn btn-out btn-sm" onClick={()=>{setIsNew(false);setModal(i);}}>Edit</button></div>);})}

      {view==="status"&&STATS.map(status=>{const si=filtered.filter(i=>i.status===status.id);return (
        <div key={status.id}><div className="cat-hd"><div style={{width:12,height:12,borderRadius:"50%",background:status.color}}/><span className="cat-nm">{status.label}</span><span className="cat-ct">{si.length}</span></div>
          {si.length===0?<div style={{padding:20,textAlign:"center",color:"#ccc",border:"2px dashed rgba(0,0,0,.05)",borderRadius:10,marginBottom:28,fontSize:13}}>Nothing here</div>:
          <div className="igrid">{si.map(i=>{const cat=CATS.find(c=>c.id===i.category);const pr=PRIS.find(p=>p.id===i.priority);return (
            <div key={i.id} className="idea" style={{borderLeft:`3px solid ${cat?.color}`}}>
              <div className="idea-top"><div className="idea-title">{i.title}</div><span style={{fontSize:12}}>{pr?.icon}</span></div>
              <div style={{fontSize:11,color:"#999",marginBottom:6}}>{cat?.emoji} {cat?.label}</div>
              {i.notes&&<div className="idea-notes">{i.notes}</div>}
              <div className="idea-ft"><span className="idea-st" style={{background:`${status.color}18`,color:status.color,cursor:"pointer"}} onClick={()=>cycle(i.id)}>{status.label}</span>
                <div className="idea-acts"><button className="idea-act" onClick={()=>{setIsNew(false);setModal(i);}}>✏️</button><button className="idea-act" onClick={()=>cycle(i.id)}>→</button></div></div>
            </div>);})}</div>}</div>);})}
    </div>

    {modal!==null&&<div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()}>
      <h2>{isNew?"New Idea":"Edit Idea"}</h2>
      <IdeaForm idea={isNew?null:modal} onSave={saveIdea}/>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button></div>
    </div></div>}
  </div>);
}

function IdeaForm({idea,onSave}){
  const[i,setI]=useState(idea||{id:uid(),title:"",category:"public",priority:"medium",status:"idea",notes:""});
  return (<><div className="fld"><label>Title</label><input value={i.title} onChange={e=>setI({...i,title:e.target.value})} autoFocus/></div>
    <div className="fr"><div className="fld"><label>Category</label><select value={i.category} onChange={e=>setI({...i,category:e.target.value})}>{CATS.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}</select></div>
      <div className="fld"><label>Priority</label><select value={i.priority} onChange={e=>setI({...i,priority:e.target.value})}>{PRIS.map(p=><option key={p.id} value={p.id}>{p.icon} {p.id}</option>)}</select></div></div>
    <div className="fld"><label>Status</label><select value={i.status} onChange={e=>setI({...i,status:e.target.value})}>{STATS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
    <div className="fld"><label>Notes</label><textarea value={i.notes} onChange={e=>setI({...i,notes:e.target.value})}/></div>
    <button className="btn btn-gold" style={{width:"100%"}} onClick={()=>{if(i.title.trim())onSave(i);}}>{idea?"Save":"Add Idea"}</button></>);
}
