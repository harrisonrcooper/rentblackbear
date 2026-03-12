"use client";
import { useState } from "react";
import Link from "next/link";
import { PROPERTIES as DATA_PROPS, SETTINGS as DATA_SETTINGS } from "../../../lib/data";

const uid=()=>Math.random().toString(36).slice(2,9);
const fmtS=n=>"$"+Number(n).toLocaleString();

const S=`
*{margin:0;padding:0;box-sizing:border-box}
.page{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#f4f3f0;min-height:100vh;color:#1a1714}
.header{background:#1a1714;padding:24px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.header h1{font-size:20px;font-weight:800;color:#f5f0e8}.header-sub{font-size:11px;color:#c4a882;margin-top:2px}
.back{color:#c4a882;text-decoration:none;font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px;padding:8px 16px;border-radius:8px;background:rgba(255,255,255,.08)}
.cnt{max-width:900px;margin:0 auto;padding:28px 40px 60px}
.btn{padding:8px 16px;border-radius:8px;border:none;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .12s}
.btn:hover{transform:translateY(-1px)}
.btn-gold{background:#d4a853;color:#1a1714}.btn-out{background:#fff;border:1px solid rgba(0,0,0,.1);color:#1a1714}
.btn-green{background:#4a7c59;color:#fff}.btn-red{background:rgba(196,92,74,.1);color:#c45c4a}
.btn-sm{padding:5px 10px;font-size:10px;border-radius:6px}
.tabs{display:flex;gap:4px;margin-bottom:24px;border-bottom:2px solid rgba(0,0,0,.06)}
.tab{padding:10px 18px;font-size:13px;font-weight:600;color:#999;cursor:pointer;border:none;background:none;font-family:inherit;border-bottom:2px solid transparent;margin-bottom:-2px}.tab:hover{color:#1a1714}.tab.on{color:#1a1714;border-bottom-color:#d4a853;font-weight:800}
.card{background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,.04);margin-bottom:16px;overflow:hidden}
.card-hd{padding:18px 22px;border-bottom:1px solid rgba(0,0,0,.04);display:flex;justify-content:space-between;align-items:center}
.card-hd h3{font-size:15px;font-weight:800}
.card-bd{padding:22px}
.fld{margin-bottom:14px}.fld label{display:block;font-size:10px;font-weight:700;color:#999;margin-bottom:5px;text-transform:uppercase;letter-spacing:.3px}
.fld input,.fld select,.fld textarea{width:100%;padding:10px 14px;border-radius:8px;border:1px solid rgba(0,0,0,.1);font-family:inherit;font-size:13px;outline:none;background:#faf9f7}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:#d4a853}
.fld textarea{resize:vertical;min-height:70px}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.pc{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.04);padding:18px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:12px}
.pc:hover{border-color:rgba(212,168,83,.2)}
.pc-nm{font-size:15px;font-weight:800}.pc-addr{font-size:11px;color:#999}
.ptg{font-size:9px;font-weight:700;padding:2px 8px;border-radius:100px;display:inline-block;margin-right:4px}
.ptg-ok{background:rgba(74,124,89,.1);color:#4a7c59}.ptg-vc{background:rgba(196,92,74,.1);color:#c45c4a}.ptg-t{background:rgba(0,0,0,.04);color:#999}
.mbg{position:fixed;inset:0;background:rgba(26,23,20,.6);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto}
.mbox{background:#fff;border-radius:16px;max-width:680px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;margin:auto}
.mbox h2{font-size:17px;font-weight:800;margin-bottom:16px}
.mft{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(0,0,0,.05)}
.room-ed{padding:14px;border:1px solid rgba(0,0,0,.05);border-radius:10px;margin-bottom:10px;background:#faf9f7}
.sec-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.sec-hd h2{font-size:16px;font-weight:800}
.note{background:rgba(212,168,83,.08);border:1px solid rgba(212,168,83,.15);border-radius:10px;padding:16px;margin-bottom:24px;font-size:13px;color:#5c4a3a;line-height:1.6}
@media(max-width:768px){.fr{grid-template-columns:1fr}.fr3{grid-template-columns:1fr}.cnt{padding:20px}}
`;

function PropEditor({prop,onSave,onClose,isNew}){
  const[p,setP]=useState(prop?JSON.parse(JSON.stringify(prop)):{id:uid(),name:"",address:"",type:"SFH",typeTag:"SFH",totalBaths:1,sqft:0,status:"Available",utilities:"allIncluded",utilityCap:0,cleaningFreq:"Biweekly",description:"",images:["","",""],rooms:[]});
  const updRoom=(i,f,v)=>{const rs=[...p.rooms];rs[i]={...rs[i],[f]:f==="rent"||f==="sqft"?Number(v):f==="privateBath"?v==="true":v};setP({...p,rooms:rs});};
  const addRoom=()=>setP({...p,rooms:[...p.rooms,{id:uid(),name:`Bedroom ${p.rooms.length+1}`,rent:600,sqft:150,privateBath:false,features:[],status:"vacant",roomStatus:"vacant",tenant:null}]});
  const delRoom=i=>setP({...p,rooms:p.rooms.filter((_,j)=>j!==i)});
  return (<div className="mbg" onClick={onClose}><div className="mbox" onClick={e=>e.stopPropagation()}>
    <h2>{isNew?"Add Property":`Edit: ${p.name||"Untitled"}`}</h2>
    <div className="fr"><div className="fld"><label>Property Name</label><input value={p.name} onChange={e=>setP({...p,name:e.target.value})} placeholder="e.g. The Holmes House"/></div><div className="fld"><label>Address</label><input value={p.address} onChange={e=>setP({...p,address:e.target.value})}/></div></div>
    <div className="fr3"><div className="fld"><label>Type</label><select value={p.type} onChange={e=>setP({...p,type:e.target.value,typeTag:e.target.value})}><option value="SFH">SFH</option><option value="Townhome">Townhome</option><option value="Duplex">Duplex</option></select></div><div className="fld"><label>Status</label><select value={p.status} onChange={e=>setP({...p,status:e.target.value})}><option>Available</option><option>Coming Soon</option><option>Fully Occupied</option></select></div><div className="fld"><label>Baths</label><input type="number" value={p.totalBaths} onChange={e=>setP({...p,totalBaths:Number(e.target.value)})}/></div></div>
    <div className="fr3"><div className="fld"><label>Sq Ft</label><input type="number" value={p.sqft} onChange={e=>setP({...p,sqft:Number(e.target.value)})}/></div><div className="fld"><label>Utilities</label><select value={p.utilities} onChange={e=>setP({...p,utilities:e.target.value})}><option value="allIncluded">All Included</option><option value="first100">First $100, split</option></select></div><div className="fld"><label>Cleaning</label><select value={p.cleaningFreq} onChange={e=>setP({...p,cleaningFreq:e.target.value})}><option>Weekly</option><option>Biweekly</option><option>Monthly</option></select></div></div>
    <div className="fld"><label>Description</label><textarea value={p.description} onChange={e=>setP({...p,description:e.target.value})} rows={3}/></div>
    <div className="fld"><label>Photo URLs</label>{p.images.map((img,i)=><input key={i} value={img} onChange={e=>{const imgs=[...p.images];imgs[i]=e.target.value;setP({...p,images:imgs});}} placeholder={`Photo ${i+1}`} style={{marginBottom:4}}/>)}</div>
    <div style={{borderTop:"1px solid rgba(0,0,0,.05)",paddingTop:16,marginTop:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{fontSize:14,fontWeight:800}}>Rooms ({p.rooms.length})</h3><button className="btn btn-out btn-sm" onClick={addRoom}>+ Room</button></div>
      {p.rooms.map((r,ri)=>(<div key={r.id||ri} className="room-ed">
        <div className="fr3"><div className="fld"><label>Name</label><input value={r.name} onChange={e=>updRoom(ri,"name",e.target.value)}/></div><div className="fld"><label>Rent $/mo</label><input type="number" value={r.rent} onChange={e=>updRoom(ri,"rent",e.target.value)}/></div><div className="fld"><label>Bath</label><select value={String(r.privateBath)} onChange={e=>updRoom(ri,"privateBath",e.target.value)}><option value="true">Private</option><option value="false">Shared</option></select></div></div>
        <div className="fr"><div className="fld"><label>Sq Ft</label><input type="number" value={r.sqft} onChange={e=>updRoom(ri,"sqft",e.target.value)}/></div><div className="fld"><label>Status</label><select value={r.roomStatus||r.status||"vacant"} onChange={e=>updRoom(ri,"roomStatus",e.target.value)}><option value="occupied">Occupied</option><option value="vacant">Vacant</option></select></div></div>
        <button className="btn btn-red btn-sm" onClick={()=>delRoom(ri)}>Remove Room</button>
      </div>))}
      {p.rooms.length===0&&<div style={{textAlign:"center",padding:24,color:"#999",fontSize:13}}>No rooms. Click + Room to add bedrooms.</div>}
    </div>
    <div className="mft"><button className="btn btn-out" onClick={onClose}>Cancel</button><button className="btn btn-gold" onClick={()=>{if(!p.name.trim())return;onSave(p);}}>{isNew?"Add Property":"Save Changes"}</button></div>
  </div></div>);
}

export default function SettingsPage(){
  const[tab,setTab]=useState("properties");
  const[props,setProps]=useState(DATA_PROPS.map(p=>({...p})));
  const[settings,setSettings]=useState({...DATA_SETTINGS});
  const[editProp,setEditProp]=useState(null);
  const[isNewProp,setIsNewProp]=useState(false);

  const saveProp=p=>{if(isNewProp)setProps(prev=>[...prev,p]);else setProps(prev=>prev.map(x=>x.id===p.id?p:x));setEditProp(null);};
  const delProp=id=>setProps(prev=>prev.filter(x=>x.id!==id));

  return (<div className="page"><style>{S}</style>
    <div className="header"><div><h1>⚙️ Site Settings & Properties</h1><div className="header-sub">Edit your site without touching code</div></div><Link href="/admin" className="back">← Back to HQ</Link></div>
    <div className="cnt">
      <div className="note">💡 <strong>How this works:</strong> Right now, changes here are stored in your browser session. Once we connect the database (Supabase), every change you make here will instantly update the live public site. No code, no redeploying.</div>

      <div className="tabs">
        <button className={`tab ${tab==="properties"?"on":""}`} onClick={()=>setTab("properties")}>🏠 Properties</button>
        <button className={`tab ${tab==="company"?"on":""}`} onClick={()=>setTab("company")}>🏢 Company Info</button>
        <button className={`tab ${tab==="hero"?"on":""}`} onClick={()=>setTab("hero")}>✨ Hero Section</button>
      </div>

      {tab==="properties"&&<>
        <div className="sec-hd"><div><h2>Manage Properties</h2><p style={{fontSize:11,color:"#999",marginTop:2}}>{props.length} properties · {props.reduce((s,p)=>s+p.rooms.length,0)} rooms</p></div>
          <button className="btn btn-gold" onClick={()=>{setIsNewProp(true);setEditProp({});}}>+ Add Property</button></div>
        {props.map(p=>{const vac=p.rooms.filter(r=>(r.roomStatus||r.status)==="vacant").length;const prices=p.rooms.map(r=>r.rent);return (
          <div key={p.id} className="pc">
            <div>
              <div className="pc-nm">{p.name||"Untitled"}</div>
              <div className="pc-addr">{p.address} · {p.typeTag||p.type} · {p.rooms.length} rooms</div>
              <div style={{marginTop:6}}>{vac===0?<span className="ptg ptg-ok">Full</span>:<span className="ptg ptg-vc">{vac} Vacant</span>}
                <span className="ptg ptg-t">{p.utilities==="allIncluded"?"All Utils":"$100 Cap"}</span>
                <span className="ptg ptg-t">{p.cleaningFreq}</span></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {prices.length>0&&<div style={{fontSize:16,fontWeight:800}}>{fmtS(Math.min(...prices))}–{fmtS(Math.max(...prices))}<span style={{fontSize:10,color:"#999"}}>/mo</span></div>}
              <button className="btn btn-out btn-sm" onClick={()=>{setIsNewProp(false);setEditProp(p);}}>✏️ Edit</button>
              <button className="btn btn-red btn-sm" onClick={()=>delProp(p.id)}>✕</button>
            </div>
          </div>);})}
        {props.length===0&&<div style={{textAlign:"center",padding:48,color:"#999"}}><div style={{fontSize:48,marginBottom:12}}>🏠</div><h3 style={{fontSize:16}}>No Properties</h3><p style={{fontSize:13,marginTop:4}}>Add your first property above.</p></div>}
      </>}

      {tab==="company"&&<div className="card"><div className="card-hd"><h3>Company Information</h3></div><div className="card-bd">
        <div className="fr"><div className="fld"><label>Company Name</label><input value={settings.companyName} onChange={e=>setSettings({...settings,companyName:e.target.value})}/></div><div className="fld"><label>Legal Entity</label><input value={settings.legalName} onChange={e=>setSettings({...settings,legalName:e.target.value})}/></div></div>
        <div className="fr3"><div className="fld"><label>Phone</label><input value={settings.phone} onChange={e=>setSettings({...settings,phone:e.target.value})}/></div><div className="fld"><label>Email</label><input value={settings.email} onChange={e=>setSettings({...settings,email:e.target.value})}/></div><div className="fld"><label>City</label><input value={settings.city} onChange={e=>setSettings({...settings,city:e.target.value})}/></div></div>
      </div></div>}

      {tab==="hero"&&<div className="card"><div className="card-hd"><h3>Hero Section Copy</h3></div><div className="card-bd">
        <div className="fld"><label>Badge / Tagline</label><input value={settings.tagline} onChange={e=>setSettings({...settings,tagline:e.target.value})}/></div>
        <div className="fr"><div className="fld"><label>Headline</label><input value={settings.heroHeadline} onChange={e=>setSettings({...settings,heroHeadline:e.target.value})}/></div><div className="fld"><label>Subline (italic)</label><input value={settings.heroSubline} onChange={e=>setSettings({...settings,heroSubline:e.target.value})}/></div></div>
        <div className="fld"><label>Description</label><textarea value={settings.heroDesc} onChange={e=>setSettings({...settings,heroDesc:e.target.value})}/></div>
      </div></div>}
    </div>

    {editProp!==null&&<PropEditor prop={isNewProp?null:editProp} onSave={saveProp} onClose={()=>setEditProp(null)} isNew={isNewProp}/>}
  </div>);
}
