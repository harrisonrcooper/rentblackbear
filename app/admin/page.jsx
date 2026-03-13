"use client";
// ADMIN HQ — rentblackbear.com/admin
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";

// ─── Storage ────────────────────────────────────────────────────────
// Supabase
const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa=(path,opts={})=>fetch(SUPA_URL+"/rest/v1/"+path,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});
async function load(k,fb){try{const r=await supa("app_data?key=eq."+k+"&select=value");const d=await r.json();return d&&d.length>0&&d[0].value!=null?d[0].value:fb;}catch{return fb;}}
async function save(k,d){try{await supa("app_data",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify({key:k,value:d})});}catch(e){console.error("Save error:",k,e);}}
const uid=()=>Math.random().toString(36).slice(2,9);
const fmt=n=>"$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtS=n=>"$"+Number(n).toLocaleString();
const fmtD=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;}
const TODAY=new Date();const MO=TODAY.toLocaleString("default",{month:"long",year:"numeric"});

// ─── Sample Data ────────────────────────────────────────────────────
const DEF_PROPS=[
  {id:"p1",name:"The Holmes House",addr:"Holmes & Lee, Huntsville",lat:34.7285,lng:-86.5920,type:"SFH",baths:3,utils:"first100",clean:"Weekly",
    rooms:[
      {id:"r1",name:"Primary Suite",rent:850,pb:true,st:"occupied",le:"2026-07-31",tenant:{name:"Marcus Johnson",email:"marcus@email.com",phone:"(256) 555-1001",moveIn:"2025-08-01"}},
      {id:"r2",name:"Bedroom 2",rent:750,pb:true,st:"occupied",le:"2026-08-31",tenant:{name:"Sarah Chen",email:"sarah@email.com",phone:"(256) 555-1002",moveIn:"2025-09-01"}},
      {id:"r3",name:"Bedroom 3",rent:650,pb:false,st:"occupied",le:"2026-03-31",tenant:{name:"David Park",email:"david@email.com",phone:"(256) 555-1003",moveIn:"2025-10-01"}},
      {id:"r4",name:"Bedroom 4",rent:650,pb:false,st:"vacant",le:null,tenant:null},
      {id:"r5",name:"Bedroom 5",rent:600,pb:false,st:"occupied",le:"2026-10-31",tenant:{name:"Amy Rodriguez",email:"amy@email.com",phone:"(256) 555-1005",moveIn:"2025-11-01"}},
    ]},
  {id:"p2",name:"Lee Drive East",addr:"Lee Drive, Huntsville",lat:34.7280,lng:-86.5935,type:"Townhome",baths:2,utils:"allIncluded",clean:"Biweekly",
    rooms:[
      {id:"r6",name:"Primary Suite",rent:750,pb:true,st:"occupied",le:"2026-06-30",tenant:{name:"James Williams",email:"james@email.com",phone:"(256) 555-2001",moveIn:"2025-07-01"}},
      {id:"r7",name:"Bedroom 2",rent:650,pb:false,st:"occupied",le:"2026-07-31",tenant:{name:"Lisa Thompson",email:"lisa@email.com",phone:"(256) 555-2002",moveIn:"2025-08-01"}},
      {id:"r8",name:"Bedroom 3",rent:600,pb:false,st:"vacant",le:null,tenant:null},
    ]},
  {id:"p3",name:"Lee Drive West",addr:"Lee Drive, Huntsville",lat:34.7280,lng:-86.5940,type:"Townhome",baths:2,utils:"allIncluded",clean:"Biweekly",
    rooms:[
      {id:"r9",name:"Primary Suite",rent:750,pb:true,st:"occupied",le:"2026-12-31",tenant:{name:"Kevin Brown",email:"kevin@email.com",phone:"(256) 555-3001",moveIn:"2026-01-01"}},
      {id:"r10",name:"Bedroom 2",rent:650,pb:false,st:"occupied",le:"2026-12-31",tenant:{name:"Michelle Davis",email:"michelle@email.com",phone:"(256) 555-3002",moveIn:"2026-01-01"}},
      {id:"r11",name:"Bedroom 3",rent:600,pb:false,st:"occupied",le:"2027-01-31",tenant:{name:"Carlos Gutierrez",email:"carlos@email.com",phone:"(256) 555-3003",moveIn:"2026-02-01"}},
    ]},
];

const DEF_PAYMENTS={};// {roomId: {month: amount}} - quick lookup (computed from charges)
const CHARGE_CATS=["Rent","Utility Overage","Late Fee","Security Deposit","Cleaning Fee","Damage Charge","Lock Change","Key Replacement","Move-In Fee","Move-Out Fee","Pet Violation","Smoking Violation","Guest Violation"];
const PAY_METHODS=["Zelle","Venmo","Cash","Check","CashApp","Bank Transfer","Stripe/ACH","Credit Card","Other"];
// Charges: source of truth for all money owed/paid
const DEF_CHARGES=[];// [{id,roomId,tenantName,propName,roomName,leaseId,category,desc,amount,amountPaid,dueDate,createdDate,payments:[{id,amount,method,date,notes,depositDate,depositStatus}],waived,waivedReason}]
const DEF_CREDITS=[];// [{id,roomId,tenantName,amount,reason,date,applied}]
const DEF_SD_LEDGER=[];// [{id,roomId,tenantName,propName,roomName,amountHeld,deposits:[],deductions:[],returned,returnDate}]
const DEF_MAINT=[ // maintenance requests
  {id:uid(),roomId:"r1",propId:"p1",tenant:"Marcus Johnson",title:"Dishwasher not draining",desc:"Water sits at the bottom after a cycle. Tried running it twice.",status:"open",priority:"medium",created:"2026-03-08",photos:0},
  {id:uid(),roomId:"r7",propId:"p2",tenant:"Lisa Thompson",title:"Bedroom door lock sticking",desc:"Have to jiggle the handle to get it to unlock. Getting worse.",status:"in-progress",priority:"low",created:"2026-03-05",photos:1},
];
const DEF_APPS=[ // applications in pipeline
  {id:uid(),name:"Taylor Morgan",email:"taylor@email.com",phone:"(256) 555-9001",property:"The Holmes House",room:"Bedroom 4",moveIn:"2026-04-01",income:"$4,200",status:"screening",submitted:"2026-03-09",bgCheck:"pending",creditScore:"—",refs:"pending"},
  {id:uid(),name:"Jordan Lee",email:"jordan@email.com",phone:"(256) 555-9002",property:"Lee Drive East",room:"Bedroom 3",moveIn:"2026-04-15",income:"$3,800",status:"pre-screened",submitted:"2026-03-10",bgCheck:"not-started",creditScore:"—",refs:"not-started"},
];
const DEF_DOCS=[
  {id:uid(),name:"Lease Template - Standard 12mo",type:"lease",property:"All",uploaded:"2026-01-15",size:"245 KB"},
  {id:uid(),name:"House Rules - Holmes House",type:"rules",property:"The Holmes House",uploaded:"2026-02-01",size:"18 KB"},
  {id:uid(),name:"Move-Out Cleaning Checklist",type:"checklist",property:"All",uploaded:"2026-02-01",size:"12 KB"},
  {id:uid(),name:"Move-In Inspection Form",type:"checklist",property:"All",uploaded:"2026-01-20",size:"8 KB"},
];
const DEF_TXNS=[
  {id:uid(),date:"2026-03-01",type:"income",desc:"Marcus Johnson - March Rent",amount:850,propId:"p1",cat:"Rent"},
  {id:uid(),date:"2026-03-01",type:"income",desc:"Sarah Chen - March Rent",amount:750,propId:"p1",cat:"Rent"},
  {id:uid(),date:"2026-03-01",type:"income",desc:"James Williams - March Rent",amount:750,propId:"p2",cat:"Rent"},
  {id:uid(),date:"2026-03-05",type:"expense",desc:"Huntsville Utilities - Electric/Water",amount:347.22,propId:"p1",cat:"Utilities"},
  {id:uid(),date:"2026-03-01",type:"expense",desc:"CleanPro - Weekly Clean",amount:175,propId:"p1",cat:"Cleaning"},
  {id:uid(),date:"2026-03-01",type:"expense",desc:"CleanPro - Biweekly Clean",amount:125,propId:"p2",cat:"Cleaning"},
];
const DEF_NOTIFS=[
  {id:uid(),type:"lease",msg:"David Park's lease expires in 20 days (3/31/2026)",date:"2026-03-11",read:false,urgent:true},
  {id:uid(),type:"payment",msg:"Amy Rodriguez hasn't paid March rent ($600)",date:"2026-03-11",read:false,urgent:true},
  {id:uid(),type:"maint",msg:"New maintenance request from Marcus Johnson",date:"2026-03-08",read:true,urgent:false},
  {id:uid(),type:"app",msg:"New application from Taylor Morgan for Holmes Bedroom 4",date:"2026-03-09",read:true,urgent:false},
];
const DEF_ARCHIVE=[];// past tenants: [{id,name,email,phone,roomName,propName,rent,moveIn,leaseEnd,terminatedDate,reason,payments:{}}]
const DEF_ROCKS=[{id:uid(),title:"Fill Holmes House Bedroom 4",owner:"Harrison",status:"on-track",due:"2026-06-30",notes:"Listed on site"},{id:uid(),title:"Capture Insta360 tours for all properties",owner:"Harrison",status:"off-track",due:"2026-06-30",notes:"Need to schedule"},{id:uid(),title:"Deploy rentblackbear.com live",owner:"Harrison",status:"on-track",due:"2026-04-15",notes:"Packaged, push to Vercel"},{id:uid(),title:"Set up Stripe rent collection",owner:"Harrison",status:"not-started",due:"2026-06-30",notes:""}];
const DEF_ISSUES=[{id:uid(),title:"David Park lease expiring March 31 — renew or find replacement",priority:"high",created:"2026-03-01"},{id:uid(),title:"Need real photos to replace stock images",priority:"medium",created:"2026-03-05"},{id:uid(),title:"Password protection for admin before adding real data",priority:"high",created:"2026-03-08"}];
// Scorecard: history of weekly snapshots. Current week is always calculated live.
function getWeekNum(d){const start=new Date(d.getFullYear(),0,1);return Math.ceil(((d-start)/864e5+start.getDay()+1)/7);}
function getWeekLabel(d){return`W${getWeekNum(d)} · ${d.getMonth()+1}/${d.getDate()}`;}
const CUR_WEEK=getWeekNum(TODAY);
const DEF_SC_HISTORY=[];// past weekly snapshots
const DEF_MONTHLY=[];// [{month:"2026-03",label:"March 2026",occ,collRate,vacancy,leads,collected,projected,full,totalRooms,occRooms,snappedOn}]
function getMonthKey(d){return`${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}`;}
function getMonthLabel(d){return d.toLocaleString("default",{month:"long",year:"numeric"});}
function isLastDayOfMonth(d){const next=new Date(d);next.setDate(next.getDate()+1);return next.getMonth()!==d.getMonth();}
const CUR_MONTH_KEY=getMonthKey(TODAY);
const PREV_MONTH_KEY=getMonthKey(new Date(TODAY.getFullYear(),TODAY.getMonth()-1,1));
const SC_GOALS={occ:100,coll:100,vacancy:0,leads:5};
const DEF_SETTINGS={companyName:"Black Bear Rentals",legalName:"Oak & Main Development LLC",phone:"(256) 555-0192",email:"info@rentblackbear.com",city:"Huntsville, Alabama",tagline:"Huntsville's Turnkey Co-Living",heroHeadline:"Your Room Is Ready.",heroSubline:"Everything's Included.",heroDesc:"Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities — all handled."};
const DEF_THEME={bg:"#1a1714",card:"#2c2520",accent:"#d4a853",text:"#f5f0e8",muted:"#c4a882",surface:"#fefdfb",surfaceAlt:"#f5f0e8",green:"#4a7c59",dark:"#1a1714",warm:"#5c4a3a"};
const THEME_LABELS={bg:"Background",card:"Card",accent:"Accent",text:"Light Text",muted:"Muted",surface:"Surface",surfaceAlt:"Alt Surface",green:"Green",dark:"Dark",warm:"Warm"};
const PRESETS={"Warm Lodge":DEF_THEME,"Midnight":{bg:"#0f1729",card:"#1a2540",accent:"#3b82f6",text:"#e8ecf4",muted:"#8899b8",surface:"#fafbfe",surfaceAlt:"#eef2f9",green:"#22c55e",dark:"#0f1729",warm:"#64748b"},"Forest":{bg:"#1a2e1a",card:"#243524",accent:"#7cb342",text:"#e8f0e4",muted:"#a3b89a",surface:"#fafcf8",surfaceAlt:"#eef3ea",green:"#7cb342",dark:"#1a2e1a",warm:"#5a6b52"}};
function contrast(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return(r*.299+g*.587+b*.114)>150?"#1a1714":"#f5f0e8";}

const DEF_IDEAS=[
  {id:uid(),title:"Insta360 3D tour embeds",cat:"Public Site",priority:"high",status:"Planned"},
  {id:uid(),title:"Floor plans",cat:"Public Site",priority:"medium",status:"Planned"},
  {id:uid(),title:"Savings calculator",cat:"Public Site",priority:"low",status:"Done"},
  {id:uid(),title:"Testimonials / review system",cat:"Public Site",priority:"medium",status:"Done"},
  {id:uid(),title:"Password protection for admin",cat:"Admin",priority:"high",status:"Planned"},
  {id:uid(),title:"Tenant portal (maintenance, house info)",cat:"Tenant Portal",priority:"high",status:"Idea"},
  {id:uid(),title:"Rent payment portal (Stripe)",cat:"Tenant Portal",priority:"high",status:"Idea"},
  {id:uid(),title:"Automated move-in emails",cat:"Automation",priority:"medium",status:"Idea"},
  {id:uid(),title:"Rent due reminders",cat:"Automation",priority:"medium",status:"Idea"},
  {id:uid(),title:"Stripe for rent (ACH)",cat:"Integrations",priority:"high",status:"Idea"},
  {id:uid(),title:"Background check API",cat:"Integrations",priority:"medium",status:"Idea"},
  {id:uid(),title:"E-signatures (DocuSign)",cat:"Integrations",priority:"medium",status:"Idea"},
  {id:uid(),title:"Replace stock photos",cat:"Content",priority:"high",status:"Planned"},
  {id:uid(),title:"Capture Insta360 tours",cat:"Content",priority:"high",status:"Planned"},
  {id:uid(),title:"Referral program",cat:"Future",priority:"low",status:"Idea"},
];
function randPalette(){const h=Math.floor(Math.random()*360);const c=(h+150+Math.random()*60)%360;const hl=(h2,s,l)=>{s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h2/30)%12;const cv=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*cv).toString(16).padStart(2,"0");};return`#${f(0)}${f(8)}${f(4)}`;};return{bg:hl(h,20,9),card:hl(h,18,15),accent:hl(c,70,60),text:hl(h,10,94),muted:hl(h,14,65),surface:hl(c,5,98),surfaceAlt:hl(c,7,94),green:hl(150,50,45),dark:hl(h,20,8),warm:hl(h,12,44)};}

// Photo manager - drag-and-drop + URL input
function PhotoManager({photos=[],onChange,label="Photos",max=6}){
  const[dragOver,setDragOver]=useState(false);const[urlInput,setUrlInput]=useState("");
  const addUrl=()=>{if(urlInput.trim()){onChange([...(photos||[]),urlInput.trim()]);setUrlInput("");}};
  const handleDrop=e=>{e.preventDefault();setDragOver(false);[...e.dataTransfer.files].filter(f=>f.type.startsWith("image/")).slice(0,max-(photos||[]).length).forEach(file=>{
    const reader=new FileReader();reader.onload=ev=>onChange(prev=>[...(Array.isArray(prev)?prev:(photos||[])),ev.target.result]);reader.readAsDataURL(file);});};
  const remove=i=>onChange((photos||[]).filter((_,j)=>j!==i));
  return(<div style={{marginBottom:10}}>
    <label style={{display:"block",fontSize:9,fontWeight:700,color:"#999",marginBottom:3,textTransform:"uppercase",letterSpacing:.3}}>{label} ({(photos||[]).length}/{max})</label>
    {(photos||[]).length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
      {(photos||[]).map((p,i)=><div key={i} style={{width:64,height:64,borderRadius:6,overflow:"hidden",position:"relative",border:"1px solid rgba(0,0,0,.06)"}}>
        <img src={p} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
        <button onClick={()=>remove(i)} style={{position:"absolute",top:2,right:2,width:16,height:16,borderRadius:"50%",background:"rgba(0,0,0,.6)",color:"#fff",border:"none",fontSize:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
      </div>)}
    </div>}
    {(photos||[]).length<max&&<>
      <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop}
        style={{border:`2px dashed ${dragOver?"#d4a853":"rgba(0,0,0,.08)"}`,borderRadius:8,padding:14,textAlign:"center",cursor:"pointer",background:dragOver?"rgba(212,168,83,.04)":"transparent",marginBottom:6}}
        onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.accept="image/*";inp.multiple=true;inp.onchange=e=>{[...e.target.files].slice(0,max-(photos||[]).length).forEach(file=>{const reader=new FileReader();reader.onload=ev=>onChange(prev=>[...(Array.isArray(prev)?prev:(photos||[])),ev.target.result]);reader.readAsDataURL(file);});};inp.click();}}>
        <div style={{fontSize:18,marginBottom:2}}>{"📷"}</div>
        <div style={{fontSize:10,color:"#999",fontWeight:600}}>Drag and drop or click to browse</div>
      </div>
      <div style={{display:"flex",gap:4}}>
        <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="Or paste image URL..." onKeyDown={e=>e.key==="Enter"&&addUrl()}
          style={{flex:1,padding:"5px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit",outline:"none"}}/>
        <button className="btn btn-out btn-sm" onClick={addUrl} disabled={!urlInput.trim()}>Add</button>
      </div>
    </>}
  </div>);
}

function PropEditor({prop,onSave,onClose,isNew,onViewTenant}){
  const[p,setP]=useState(prop?JSON.parse(JSON.stringify(prop)):{id:uid(),name:"",addr:"",type:"SFH",baths:1,utils:"allIncluded",clean:"Biweekly",rentalMode:"byRoom",desc:"",photos:[],rooms:[]});
  const[warning,setWarning]=useState(null);
  const addRoom=()=>setP({...p,rooms:[...p.rooms,{id:uid(),name:`Bedroom ${p.rooms.length+1}`,rent:600,sqft:150,pb:false,st:"vacant",le:null,tenant:null,desc:"",photos:[]}]});
  const updRoom=(i,f,v)=>{const rs=[...p.rooms];rs[i]={...rs[i],[f]:f==="rent"||f==="sqft"?Number(v):f==="pb"?v==="true":v};setP({...p,rooms:rs});};
  const updRoomPhotos=(i,v)=>{const rs=[...p.rooms];rs[i]={...rs[i],photos:typeof v==="function"?v(rs[i].photos||[]):v};setP({...p,rooms:rs});};
  const isOcc=r=>r.st==="occupied"&&r.tenant;
  return(<div className="mbg" onClick={onClose}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:720,maxHeight:"90vh",overflowY:"auto"}}>
    <h2>{isNew?"Add Property":`Edit: ${p.name}`}</h2>
    <div className="fr"><div className="fld"><label>Name</label><input value={p.name} onChange={e=>setP({...p,name:e.target.value})}/></div><div className="fld"><label>Address</label><input value={p.addr} onChange={e=>setP({...p,addr:e.target.value})}/></div></div>
    <div className="fr3"><div className="fld"><label>Latitude</label><input type="number" step="0.0001" value={p.lat||""} onChange={e=>setP({...p,lat:Number(e.target.value)})}/></div><div className="fld"><label>Longitude</label><input type="number" step="0.0001" value={p.lng||""} onChange={e=>setP({...p,lng:Number(e.target.value)})}/></div><div className="fld"><label style={{fontSize:8,color:"#999"}}>💡 Get from Google Maps</label><a href={`https://www.google.com/maps/search/${encodeURIComponent(p.addr||"")}`} target="_blank" rel="noopener" style={{fontSize:10,color:"#3b82f6",cursor:"pointer"}}>Look up →</a></div></div>
    <div className="fr3"><div className="fld"><label>Type</label><select value={p.type} onChange={e=>setP({...p,type:e.target.value})}><option>SFH</option><option>Townhome</option><option>Duplex</option></select></div><div className="fld"><label>Utilities</label><select value={p.utils} onChange={e=>setP({...p,utils:e.target.value})}><option value="allIncluded">All Included</option><option value="first100">First $100</option></select></div><div className="fld"><label>Cleaning</label><select value={p.clean} onChange={e=>setP({...p,clean:e.target.value})}><option>Weekly</option><option>Biweekly</option></select></div></div>
    <div className="fr"><div className="fld"><label>Baths</label><input type="number" value={p.baths} onChange={e=>setP({...p,baths:Number(e.target.value)})}/></div><div className="fld"><label>Rental Mode</label><select value={p.rentalMode||"byRoom"} onChange={e=>setP({...p,rentalMode:e.target.value})}><option value="byRoom">Rent by Bedroom</option><option value="wholeHouse">Whole House</option></select></div></div>
    <div className="fld"><label>Property Description</label><textarea value={p.desc||""} onChange={e=>setP({...p,desc:e.target.value})} placeholder="Describe the property - shows on the public site..." rows={3}/></div>
    <PhotoManager photos={p.photos||[]} onChange={v=>setP({...p,photos:typeof v==="function"?v(p.photos||[]):v})} label="Property Photos" max={8}/>

    <div style={{borderTop:"1px solid rgba(0,0,0,.05)",paddingTop:12,marginTop:4}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <h3 style={{fontSize:13,fontWeight:800}}>{(p.rentalMode||"byRoom")==="byRoom"?"Rooms":"Unit"} ({p.rooms.length})</h3>
        <button className="btn btn-out btn-sm" onClick={addRoom}>+ {(p.rentalMode||"byRoom")==="byRoom"?"Room":"Unit"}</button>
      </div>
      {p.rooms.map((r,i)=>{const locked=isOcc(r);return(
        <div key={r.id} style={{padding:12,border:`1px solid ${locked?"rgba(0,0,0,.06)":"rgba(0,0,0,.05)"}`,borderRadius:8,marginBottom:8,background:locked?"#f0efec":"#faf9f7",opacity:locked?0.7:1,position:"relative"}}>
          {locked&&<div style={{position:"absolute",top:6,right:8}}><span className="badge b-green" style={{fontSize:8}}>{"🔗"} {r.tenant.name}</span></div>}
          <div className="fr3">
            <div className="fld"><label>Name</label><input value={r.name} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"name",e.target.value)} onClick={()=>{if(locked)setWarning(r.tenant.name);}}/></div>
            <div className="fld"><label>Rent $/mo</label><input type="number" value={r.rent} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"rent",e.target.value)} onClick={()=>{if(locked)setWarning(r.tenant.name);}}/></div>
            <div className="fld"><label>Bath</label><select value={String(r.pb)} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"pb",e.target.value)} onClick={()=>{if(locked)setWarning(r.tenant.name);}}><option value="true">Private</option><option value="false">Shared</option></select></div>
          </div>
          <div className="fr3">
            <div className="fld"><label>Sq Ft</label><input type="number" value={r.sqft||""} placeholder="150" disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"sqft",e.target.value)}/></div>
            <div className="fld"><label>Status</label><div style={{padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:12,background:locked?"rgba(74,124,89,.06)":"rgba(196,92,74,.06)",color:locked?"#4a7c59":"#c45c4a",fontWeight:600}}>{locked?`Occupied - ${r.tenant.name}`:"Vacant"}</div></div>
            <div className="fld"><label>Lease End</label><div style={{padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:12,color:"#999"}}>{r.le?fmtD(r.le):"-"}</div></div>
          </div>
          {!locked&&<div className="fld"><label>Room Description</label><input value={r.desc||""} onChange={e=>updRoom(i,"desc",e.target.value)} placeholder="Features, view, notes..."/></div>}
          {!locked&&<PhotoManager photos={r.photos||[]} onChange={v=>updRoomPhotos(i,v)} label={`${r.name} Photos`} max={4}/>}
          {locked&&(r.photos||[]).length>0&&<div style={{marginTop:4}}><label style={{display:"block",fontSize:9,fontWeight:700,color:"#999",marginBottom:3,textTransform:"uppercase",letterSpacing:.3}}>Photos ({(r.photos||[]).length})</label><div style={{display:"flex",gap:4}}>{(r.photos||[]).map((ph,j)=><div key={j} style={{width:44,height:44,borderRadius:4,overflow:"hidden",border:"1px solid rgba(0,0,0,.06)"}}><img src={ph} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>)}</div></div>}
          {!locked&&<button className="btn btn-red btn-sm" style={{marginTop:4}} onClick={()=>setP({...p,rooms:p.rooms.filter((_,j)=>j!==i)})}>Remove Room</button>}
          {locked&&<div style={{display:"flex",gap:6,alignItems:"center",marginTop:6}}>
            <button className="btn btn-dk btn-sm" onClick={()=>{if(onViewTenant)onViewTenant(r,p.name);}}>View Lease & Tenant →</button>
            <span style={{fontSize:10,color:"#999"}}>To edit room, manage the lease first</span>
          </div>}
        </div>);})}
    </div>
    {warning&&<div style={{background:"rgba(212,168,83,.08)",borderRadius:8,padding:12,marginTop:8,fontSize:12,color:"#5c4a3a",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span><strong>Room occupied by {warning}.</strong> Terminate lease or move tenant first.</span><button className="btn btn-out btn-sm" onClick={()=>setWarning(null)}>Got it</button></div>}
    <div className="mft"><button className="btn btn-out" onClick={onClose}>Cancel</button><button className="btn btn-gold" onClick={()=>{if(p.name)onSave(p);}}>{isNew?"Add":"Save"}</button></div>
  </div></div>);
}

// ─── Styles ─────────────────────────────────────────────────────────
const S=`
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#f4f3f0;color:#1a1714}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes confettiFall{0%{transform:translateY(-100vh) rotate(0deg);opacity:1}70%{opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes toastIn{from{opacity:0;transform:translateY(-30px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes toastOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}
.confetti-wrap{position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden}
.confetti-piece{position:absolute;width:10px;height:10px;border-radius:2px;animation:confettiFall linear forwards}
.lead-toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9998;background:#1a1714;border:2px solid #d4a853;border-radius:14px;padding:20px 28px;box-shadow:0 12px 40px rgba(0,0,0,.4);animation:toastIn .4s ease-out;max-width:420px;width:90%}
.lead-toast.out{animation:toastOut .3s ease-in forwards}

/* Layout */
.app{display:flex;height:100vh;overflow:hidden}
.side{width:220px;background:#1a1714;display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto}
.s-logo{padding:16px;font-size:15px;font-weight:800;color:#f5f0e8;border-bottom:1px solid rgba(255,255,255,.05);display:flex;align-items:center;gap:7px}
.s-logo span{color:#d4a853}
.s-lbl{font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(196,168,130,.25);padding:16px 14px 5px}
.sn{display:flex;align-items:center;gap:8px;padding:9px 12px;margin:1px 6px;border-radius:7px;font-size:12px;font-weight:500;color:rgba(245,240,232,.45);cursor:pointer;border:none;background:none;width:calc(100% - 12px);text-align:left;font-family:inherit;transition:all .1s;position:relative}
.sn:hover{background:rgba(255,255,255,.04);color:#f5f0e8}.sn.on{background:rgba(212,168,83,.12);color:#d4a853;font-weight:700}
.sn-i{font-size:14px;width:18px;text-align:center}
.sn-badge{position:absolute;right:10px;background:#c45c4a;color:#fff;font-size:8px;font-weight:800;padding:1px 5px;border-radius:100px;min-width:16px;text-align:center}
.s-ft{margin-top:auto;padding:12px 14px;border-top:1px solid rgba(255,255,255,.04)}
.s-ft a{display:flex;align-items:center;gap:7px;font-size:11px;color:rgba(245,240,232,.35);text-decoration:none;padding:6px 0;transition:color .15s}.s-ft a:hover{color:#d4a853}

/* Mobile sidebar */
.mob-header{display:none;background:#1a1714;padding:12px 16px;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.mob-header .s-logo{padding:0;border:none}
.mob-toggle{background:none;border:none;color:#f5f0e8;font-size:20px;cursor:pointer;padding:4px}
.mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99}
.mob-overlay.show{display:block}

/* Main */
.mn{flex:1;overflow-y:auto;background:#f4f3f0;display:flex;flex-direction:column}
.tbar{background:#fff;padding:14px 24px;border-bottom:1px solid rgba(0,0,0,.04);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
.tbar h1{font-size:17px;font-weight:800;display:flex;align-items:center;gap:8px}
.tbar-sub{font-size:10px;color:#999;margin-top:1px}
.cnt{padding:20px 24px;flex:1}

/* Buttons */
.btn{padding:7px 14px;border-radius:7px;border:none;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all .1s}
.btn:hover{transform:translateY(-1px)}
.btn-gold{background:#d4a853;color:#1a1714}.btn-dk{background:#1a1714;color:#f5f0e8}
.pay-tab{flex:1;padding:14px 16px;fontSize:14px;font-weight:500;background:#fff;color:#5c4a3a;border:none;cursor:pointer;font-family:inherit;transition:all .2s;border-right:1px solid rgba(0,0,0,.04)}
.pay-tab:hover{background:#f0eeeb;color:#1a1714}.pay-tab.active{background:#1a1714;color:#f5f0e8;font-weight:800}.pay-tab.active:hover{background:#2c2520}
.btn-out{background:#fff;border:1px solid rgba(0,0,0,.08);color:#1a1714}.btn-out:hover{border-color:#d4a853}
.btn-green{background:#4a7c59;color:#fff}.btn-red{background:rgba(196,92,74,.08);color:#c45c4a;border:1px solid rgba(196,92,74,.1)}
.btn-sm{padding:5px 10px;font-size:10px;border-radius:5px}

/* KPIs */
.kgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px}
.kpi{background:#fff;border-radius:12px;padding:16px;border:1px solid rgba(0,0,0,.03);cursor:pointer;transition:all .15s}
.kpi:hover{border-color:rgba(212,168,83,.2);box-shadow:0 2px 12px rgba(0,0,0,.03)}
.kpi.active{border-color:rgba(212,168,83,.3);box-shadow:0 2px 16px rgba(212,168,83,.08)}
.kl{font-size:9px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px}
.kv{font-size:24px;font-weight:800;line-height:1}.ks{font-size:10px;margin-top:3px}
.kg{color:#4a7c59}.kw{color:#d4a853}.kb{color:#c45c4a}

/* Cards/Rows */
.card{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.03);margin-bottom:12px;overflow:hidden}
.card-hd{padding:14px 18px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:background .1s}
.card-hd:hover{background:rgba(0,0,0,.01)}
.card-hd h3{font-size:14px;font-weight:800}
.card-bd{padding:16px 18px;border-top:1px solid rgba(0,0,0,.03)}
.row{display:flex;align-items:center;padding:10px 16px;background:#fff;border-radius:8px;border:1px solid rgba(0,0,0,.03);margin-bottom:6px;gap:10px;transition:all .12s}
.row:hover{border-color:rgba(212,168,83,.15)}
.row-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.row-i{flex:1;min-width:0}.row-t{font-size:12px;font-weight:700}.row-s{font-size:10px;color:#999;margin-top:1px}
.row-v{font-size:14px;font-weight:800;text-align:right;min-width:60px}
.badge{font-size:8px;font-weight:700;padding:2px 8px;border-radius:100px;text-transform:uppercase;letter-spacing:.3px}
.b-green{background:rgba(74,124,89,.08);color:#4a7c59}
.b-gold{background:rgba(212,168,83,.1);color:#9a7422}
.b-red{background:rgba(196,92,74,.08);color:#c45c4a}
.b-blue{background:rgba(59,130,246,.08);color:#3b82f6}
.b-gray{background:rgba(0,0,0,.04);color:#999}

/* Section headers */
.sec-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.sec-hd h2{font-size:15px;font-weight:800}.sec-hd p{font-size:10px;color:#999;margin-top:1px}

/* Tables */
.tbl{width:100%;border-collapse:separate;border-spacing:0}
.tbl th{text-align:left;padding:10px 14px;font-size:9px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.8px;border-bottom:2px solid rgba(0,0,0,.04)}
.tbl td{padding:10px 14px;font-size:12px;border-bottom:1px solid rgba(0,0,0,.03)}
.tbl tr:hover td{background:rgba(212,168,83,.02)}

/* Forms */
.fld{margin-bottom:10px}
.fld label{display:block;font-size:9px;font-weight:700;color:#999;margin-bottom:3px;text-transform:uppercase;letter-spacing:.3px}
.fld input,.fld select,.fld textarea{width:100%;padding:8px 12px;border-radius:7px;border:1px solid rgba(0,0,0,.08);font-family:inherit;font-size:12px;outline:none;background:#faf9f7}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:#d4a853}
.fld textarea{resize:vertical;min-height:60px}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}

/* Modal */
.mbg{position:fixed;inset:0;background:rgba(26,23,20,.5);backdrop-filter:blur(3px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
.mbox{background:#fff;border-radius:14px;max-width:580px;width:100%;max-height:85vh;overflow-y:auto;padding:22px;animation:fadeIn .2s}
.mbox h2{font-size:16px;font-weight:800;margin-bottom:14px}
.mft{display:flex;justify-content:flex-end;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,.04)}

/* Notification dot */
.notif-dot{width:8px;height:8px;border-radius:50%;background:#c45c4a;display:inline-block;margin-left:4px}

/* Pipeline columns */
.pipeline{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;overflow-x:auto}
.pipe-col{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.03);overflow:hidden}
.pipe-hd{padding:12px 16px;border-bottom:1px solid rgba(0,0,0,.03);display:flex;justify-content:space-between;align-items:center}
.pipe-hd h4{font-size:12px;font-weight:800}.pipe-cnt{font-size:10px;color:#999;background:rgba(0,0,0,.04);padding:1px 7px;border-radius:100px}
.pipe-bd{padding:10px;min-height:100px}
.pipe-card{padding:12px;border-radius:8px;border:1px solid rgba(0,0,0,.04);margin-bottom:8px;cursor:pointer;transition:all .12s}
.pipe-card:hover{border-color:rgba(212,168,83,.2);box-shadow:0 2px 8px rgba(0,0,0,.03)}
.pipe-nm{font-size:12px;font-weight:700;margin-bottom:2px}.pipe-sub{font-size:10px;color:#999}.pipe-meta{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}

/* Tenant portal preview */
.tp-card{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.03);padding:18px;margin-bottom:10px}
.tp-card h3{font-size:14px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:6px}
.tp-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(0,0,0,.03);font-size:12px}
.tp-row:last-child{border-bottom:none}
.tp-label{color:#999;font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.3px}

/* Accounting */
.acct-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
.acct-card{background:#fff;border-radius:12px;padding:18px;border:1px solid rgba(0,0,0,.03);text-align:center}
.acct-card .kv{font-size:28px}
.acct-card .kl{margin-bottom:8px}

/* Status pill */
.st-pill{font-size:9px;font-weight:700;padding:3px 10px;border-radius:100px;display:inline-flex;align-items:center;gap:4px}

/* Responsive */
/* Tablet */
@media(max-width:1024px){
  .side{width:200px}.cnt{margin-left:200px}
  .kgrid{grid-template-columns:1fr 1fr}
  .pipeline{grid-template-columns:repeat(auto-fit,minmax(140px,1fr));overflow-x:auto}
  .fr3{grid-template-columns:1fr 1fr}
}

/* Phone */
@media(max-width:768px){
  .side{position:fixed;left:-260px;top:0;bottom:0;z-index:100;transition:left .25s;width:260px;box-shadow:4px 0 24px rgba(0,0,0,.3)}
  .side.open{left:0}
  .mob-header{display:flex}
  .cnt{margin-left:0;padding:14px}
  .tbar{padding:10px 14px}
  .tbar h1{font-size:18px}
  .kgrid{grid-template-columns:1fr 1fr;gap:8px}
  .kpi{padding:12px 10px}
  .kv{font-size:22px}
  .pipeline{grid-template-columns:1fr;gap:8px}
  .pipe-col{min-width:unset}
  .acct-summary{grid-template-columns:1fr}
  .fr,.fr3{grid-template-columns:1fr}
  .sec-hd{flex-direction:column;gap:8px;align-items:flex-start}
  .row{padding:10px 12px;gap:8px}
  /* Tables scroll horizontally */
  .tbl{display:block;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch}
  .tbl thead,.tbl tbody,.tbl tr{display:table;width:100%;table-layout:auto}
  .tbl th,.tbl td{padding:8px 10px;font-size:10px}
  /* Modals slide up from bottom */
  .mbg{align-items:flex-end}
  .mbox{max-width:100%!important;width:100%;border-radius:16px 16px 0 0;max-height:90vh;overflow-y:auto;animation:slideUp .25s ease-out}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .mft{flex-wrap:wrap}.mft button{flex:1;min-width:100px}
  /* Forms */
  .fld input,.fld select,.fld textarea{font-size:14px!important;padding:10px 12px}
  .sform-row{grid-template-columns:1fr}
  /* Payments tabs */
  .pay-tab{padding:10px 12px;font-size:12px!important}
  /* Charges inline expand */
  .card-bd{overflow-x:auto;-webkit-overflow-scrolling:touch}
  /* Buttons */
  .btn{padding:8px 14px;font-size:11px}
  .btn-sm{padding:6px 10px;font-size:9px}
  /* Filter rows */
  select,input[type="date"]{font-size:12px!important;min-width:0}
}

/* Small phone */
@media(max-width:420px){
  .kgrid{grid-template-columns:1fr}
  .kpi{padding:10px 8px}
  .kv{font-size:20px}
  .tbar h1{font-size:16px}
  .cnt{padding:10px}
  .pay-tab{padding:8px 6px;font-size:11px!important}
  .btn{font-size:10px;padding:7px 10px}
}
`;

// ─── Main App ───────────────────────────────────────────────────────
export default function Page(){
  const[tab,setTab]=useState("dashboard");
  const[props,setProps]=useState(DEF_PROPS);
  const[payments,setPayments]=useState(DEF_PAYMENTS);
  const[charges,setCharges]=useState(DEF_CHARGES);
  const[credits,setCredits]=useState(DEF_CREDITS);
  const[sdLedger,setSdLedger]=useState(DEF_SD_LEDGER);
  const[paySubTab,setPaySubTab]=useState("overview");
  const[payPeriod,setPayPeriod]=useState("mtd");
  const[payFilters,setPayFilters]=useState({property:"",tenant:"",category:"",status:"",dateFrom:"",dateTo:""});
  const[depFilters,setDepFilters]=useState({property:"",tenant:"",lease:"",dateFrom:"",dateTo:""});
  const[expCharge,setExpCharge]=useState(null);
  const[newCatInput,setNewCatInput]=useState("");
  const[showNewCat,setShowNewCat]=useState(false);
  const[savedThemes,setSavedThemes]=useState([]);
  const[appSearch,setAppSearch]=useState("");
  const[appView,setAppView]=useState("pipeline");
  const[bulkSel,setBulkSel]=useState([]);
  const[screenQs,setScreenQs]=useState([]);
  const[prevStep,setPrevStep]=useState(0);
  const[prevResult,setPrevResult]=useState(null);
  const[appFields,setAppFields]=useState([]);
  const[showConfetti,setShowConfetti]=useState(false);
  const[leadToast,setLeadToast]=useState(null);
  const[toastDismissing,setToastDismissing]=useState(false);
  const lastAppCountRef=useRef(0);
  const[maint,setMaint]=useState(DEF_MAINT);
  const[apps,setApps]=useState(DEF_APPS);
  const[docs,setDocs]=useState(DEF_DOCS);
  const[txns,setTxns]=useState(DEF_TXNS);
  const[notifs,setNotifs]=useState(DEF_NOTIFS);
  const[archive,setArchive]=useState(DEF_ARCHIVE);
  const[rocks,setRocks]=useState(DEF_ROCKS);
  const[issues,setIssues]=useState(DEF_ISSUES);
  const[scorecard,setScorecard]=useState(DEF_SC_HISTORY);
  const[monthly,setMonthly]=useState(DEF_MONTHLY);
  const[settings,setSettings]=useState(DEF_SETTINGS);
  const[theme,setTheme]=useState(DEF_THEME);
  const[editProp,setEditProp]=useState(null);
  const[isNewProp,setIsNewProp]=useState(false);
  const[ideas,setIdeas]=useState(DEF_IDEAS);
  const[loaded,setLoaded]=useState(false);
  const[modal,setModal]=useState(null);
  const[sideOpen,setSideOpen]=useState(false);
  const[drill,setDrill]=useState(null);
  const[showCharts,setShowCharts]=useState(true);
  const[expanded,setExpanded]=useState({});
  const[ideaView,setIdeaView]=useState("board");
  const[ideaFilter,setIdeaFilter]=useState("all");
  const[scDrill,setScDrill]=useState(null);

  useEffect(()=>{(async()=>{
    const[p,pay,mt,a,d,t,n,rk,iss,sc,st,th,id,ar,ch,cr,sd,svt,mo,sq,af]=await Promise.all([load("hq-props",DEF_PROPS),load("hq-pay",DEF_PAYMENTS),load("hq-maint",DEF_MAINT),load("hq-apps",DEF_APPS),load("hq-docs",DEF_DOCS),load("hq-txns",DEF_TXNS),load("hq-notifs",DEF_NOTIFS),load("hq-rocks",DEF_ROCKS),load("hq-issues",DEF_ISSUES),load("hq-sc",DEF_SC_HISTORY),load("hq-settings",DEF_SETTINGS),load("hq-theme",DEF_THEME),load("hq-ideas",DEF_IDEAS),load("hq-archive",DEF_ARCHIVE),load("hq-charges",DEF_CHARGES),load("hq-credits",DEF_CREDITS),load("hq-sdledger",DEF_SD_LEDGER),load("hq-svthemes",[]),load("hq-monthly",DEF_MONTHLY),load("hq-screen-qs",[]),load("hq-app-fields",[])]);
    setProps(p);setPayments(pay);setMaint(mt);setApps(a);setDocs(d);setTxns(t);setNotifs(n);setRocks(rk);setIssues(iss);setScorecard(sc);setSettings(st);setTheme(th);setIdeas(id);setArchive(ar);setCharges(ch);setCredits(cr);setSdLedger(sd);setSavedThemes(svt);setMonthly(mo);setScreenQs(sq);setAppFields(af);setLoaded(true);
  })();},[]);

  useEffect(()=>{if(loaded){const t=setTimeout(()=>{Promise.all([save("hq-props",props),save("hq-pay",payments),save("hq-maint",maint),save("hq-apps",apps),save("hq-docs",docs),save("hq-txns",txns),save("hq-notifs",notifs),save("hq-rocks",rocks),save("hq-issues",issues),save("hq-sc",scorecard),save("hq-settings",settings),save("hq-theme",theme),save("hq-ideas",ideas),save("hq-archive",archive),save("hq-charges",charges),save("hq-credits",credits),save("hq-sdledger",sdLedger),save("hq-svthemes",savedThemes),save("hq-monthly",monthly),save("hq-screen-qs",screenQs),save("hq-app-fields",appFields)]);},800);return()=>clearTimeout(t);}},[props,payments,maint,apps,docs,txns,notifs,rocks,issues,scorecard,settings,theme,ideas,archive,charges,credits,sdLedger,savedThemes,monthly,screenQs,appFields,loaded]);

  // ─── Metrics ──────────────────────────────────────────────────
  const m=useMemo(()=>{
    let total=0,occ=0,full=0,proj=0,coll=0,due=0;const vacs=[];const expiring=[];const unpaid=[];const paid=[];
    props.forEach(pr=>pr.rooms.forEach(r=>{
      total++;full+=r.rent;
      if(r.st==="occupied"){occ++;proj+=r.rent;due+=r.rent;
        const pd=(payments[r.id]&&payments[r.id][MO])||0;coll+=pd;
        if(pd)paid.push({...r,propName:pr.name,paidAmt:pd});else unpaid.push({...r,propName:pr.name});
        if(r.le){const dl=Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24));if(dl<=90)expiring.push({...r,propName:pr.name,daysLeft:dl});}
      }else vacs.push({...r,propName:pr.name});
    }));
    const openMaint=maint.filter(x=>x.status!=="resolved").length;
    const activeApps=apps.length;
    const unreadNotifs=notifs.filter(x=>!x.read).length;
    const propBreakdown=props.map(pr=>{const rooms=pr.rooms;const occR=rooms.filter(r=>r.st==="occupied");const vacR=rooms.filter(r=>r.st!=="occupied");
      const prjR=occR.reduce((s,r)=>s+r.rent,0);const fullR=rooms.reduce((s,r)=>s+r.rent,0);
      const collR=occR.reduce((s,r)=>s+((payments[r.id]&&payments[r.id][MO])||0),0);
      return{...pr,occCount:occR.length,vacCount:vacR.length,projected:prjR,fullOcc:fullR,collected:collR,occRooms:occR,vacRooms:vacR};
    });
    return{total,occ,full,proj,coll,due,vacs,expiring,unpaid,paid,openMaint,activeApps,unreadNotifs,propBreakdown,
      occRate:total?Math.round(occ/total*100):0,collRate:due?Math.round(coll/due*100):0,lost:full-proj};
  },[props,payments,maint,apps,notifs]);

  // Auto-snapshot: when a new week starts, save previous week's live data to history
  useEffect(()=>{
    if(!loaded||!m)return;
    const lastSnap=scorecard.length?scorecard[scorecard.length-1]:null;
    const lastWeek=(lastSnap&&lastSnap.weekNum)||0;
    if(CUR_WEEK>lastWeek){
      // Snapshot current metrics as the closing data for the current week
      setScorecard(p=>[...p,{weekNum:CUR_WEEK,label:getWeekLabel(TODAY),occ:m.occRate,coll:m.collRate,vacancy:m.lost,leads:0}].slice(-13));// keep 13 weeks (quarter)
    }
  },[loaded,m]);

  // Monthly auto-snapshot: on the last day of each month (or backfill if missed)
  useEffect(()=>{
    if(!loaded||!m)return;
    const lastMonthSnap=monthly.length?monthly[monthly.length-1]:null;
    const lastSnapMonth=(lastMonthSnap&&lastMonthSnap.month)||"";
    // If we don't have a snapshot for last month yet, create one with current data
    if(PREV_MONTH_KEY>lastSnapMonth){
      const prevDate=new Date(TODAY.getFullYear(),TODAY.getMonth()-1,1);
      setMonthly(p=>[...p,{month:PREV_MONTH_KEY,label:getMonthLabel(prevDate),occ:m.occRate,collRate:m.collRate,vacancy:m.lost,leads:0,collected:m.coll,projected:m.proj,full:m.full,totalRooms:m.total,occRooms:m.occ,snappedOn:TODAY.toISOString().split("T")[0]}].slice(-12));
    }
    // If today is the last day of the month and we haven't snapped this month
    if(isLastDayOfMonth(TODAY)&&CUR_MONTH_KEY>lastSnapMonth&&CUR_MONTH_KEY>PREV_MONTH_KEY){
      setMonthly(p=>[...p,{month:CUR_MONTH_KEY,label:getMonthLabel(TODAY),occ:m.occRate,collRate:m.collRate,vacancy:m.lost,leads:0,collected:m.coll,projected:m.proj,full:m.full,totalRooms:m.total,occRooms:m.occ,snappedOn:TODAY.toISOString().split("T")[0]}].slice(-12));
    }
  },[loaded,m]);

  // Live current month (always real-time)
  const liveMonth={month:CUR_MONTH_KEY,label:getMonthLabel(TODAY),occ:m.occRate,collRate:m.collRate,vacancy:m.lost,leads:0,collected:m.coll,projected:m.proj,full:m.full,totalRooms:m.total,occRooms:m.occ,live:true};
  // Previous month from snapshots
  const prevMonth=monthly.find(s=>s.month===PREV_MONTH_KEY);
  const twoMonthsAgo=monthly.find(s=>{const d=new Date(TODAY.getFullYear(),TODAY.getMonth()-2,1);return s.month===getMonthKey(d);});
  // All months for charts (historical + live)
  const allMonths=[...monthly.filter(s=>s.month<CUR_MONTH_KEY).slice(-11),liveMonth];

  // Current live week data (always real-time from actual data)
  const liveWeek={weekNum:CUR_WEEK,label:getWeekLabel(TODAY),occ:m.occRate,coll:m.collRate,vacancy:m.lost,leads:0};
  // Build display rows: last 2 historical + current live
  const scRows=[...scorecard.filter(s=>s.weekNum<CUR_WEEK).slice(-2),liveWeek];
  // Measurables config
  const scMeasurables=[
    {id:"occ",label:"Occupancy Rate",key:"occ",goal:SC_GOALS.occ,unit:"%",goodFn:(v,g)=>v>=g},
    {id:"coll",label:"Collection Rate",key:"coll",goal:SC_GOALS.coll,unit:"%",goodFn:(v,g)=>v>=g},
    {id:"vacancy",label:"Vacancy Cost",key:"vacancy",goal:SC_GOALS.vacancy,unit:"$",goodFn:(v,g)=>v<=g},
    {id:"leads",label:"New Leads",key:"leads",goal:SC_GOALS.leads,unit:"",goodFn:(v,g)=>v>=g},
  ];

  // ── Charge helpers ──
  const chargeStatus=(c)=>{if(c.waived)return"waived";if(c.amountPaid>=c.amount)return"paid";if(c.amountPaid>0)return"partial";const due=new Date(c.dueDate+"T00:00:00");if(TODAY>due)return"pastdue";return"unpaid";};
  const getChargesForPeriod=(period)=>{const y=TODAY.getFullYear(),mo=TODAY.getMonth();
    if(period==="mtd")return charges.filter(c=>{const d=new Date(c.dueDate+"T00:00:00");return d.getFullYear()===y&&d.getMonth()===mo;});
    if(period==="ytd")return charges.filter(c=>{const d=new Date(c.dueDate+"T00:00:00");return d.getFullYear()===y;});
    if(period==="next"){const nm=mo===11?0:mo+1,ny=mo===11?y+1:y;return charges.filter(c=>{const d=new Date(c.dueDate+"T00:00:00");return d.getFullYear()===ny&&d.getMonth()===nm;});}
    return charges;
  };
  const createCharge=(data)=>{const c={id:uid(),createdDate:TODAY.toISOString().split("T")[0],amountPaid:0,payments:[],waived:false,waivedReason:"",sent:false,sentDate:null,...data};setCharges(p=>[c,...p]);return c;};
  const recordPayment=(chargeId,payData)=>{
    setCharges(p=>p.map(c=>{if(c.id!==chargeId)return c;const newPaid=c.amountPaid+payData.amount;return{...c,amountPaid:Math.min(newPaid,c.amount),payments:[...c.payments,{id:uid(),...payData}]};}));
    // Update quick-lookup for backwards compat
    const ch=charges.find(c=>c.id===chargeId);if(ch){setPayments(p=>({...p,[ch.roomId]:{...p[ch.roomId],[MO]:((p[ch.roomId]&&p[ch.roomId][MO])||0)+payData.amount}}));}
    setTxns(p=>[{id:uid(),date:payData.date,type:"income",desc:`${(ch&&ch.tenantName)||""} - ${(ch&&ch.category)} (${payData.method})`,amount:payData.amount,propId:(props.find(pr=>pr.rooms.some(r=>r.id===(ch&&ch.roomId)))||{}).id,cat:(ch&&ch.category)||"Rent"},...p]);
  };
  const waiveCharge=(chargeId,reason)=>setCharges(p=>p.map(c=>c.id===chargeId?{...c,waived:true,waivedReason:reason}:c));
  // Auto-generate rent charges:
  // - Backfills current month + 2 months back for any missed charges
  // - On the 20th or later, generates NEXT month's charges (gives tenants ~10 days notice)
  // - Marks charges as "sent" so tenants see them in portal
  const autoGenRentCharges=useCallback(()=>{
    let n=0;const newChargeNames=[];
    const genForMonth=(targetDate)=>{
      const mk=`${targetDate.getFullYear()}-${(targetDate.getMonth()+1).toString().padStart(2,"0")}`;
      const moLabel=targetDate.toLocaleString("default",{month:"long",year:"numeric"});
      const existing=new Set(charges.filter(c=>c.category==="Rent"&&(c.dueDate&&c.dueDate.startsWith)(mk)).map(c=>c.roomId));
      props.forEach(pr=>pr.rooms.forEach(r=>{
        if(r.st==="occupied"&&r.tenant&&!existing.has(r.id)){
          const moveIn=r.tenant.moveIn?new Date(r.tenant.moveIn+"T00:00:00"):null;
          if(!moveIn||moveIn<=new Date(targetDate.getFullYear(),targetDate.getMonth()+1,0)){
            createCharge({roomId:r.id,tenantName:r.tenant.name,propName:pr.name,roomName:r.name,category:"Rent",desc:`${moLabel} Rent`,amount:r.rent,dueDate:`${mk}-01`,sent:true,sentDate:TODAY.toISOString().split("T")[0]});
            n++;newChargeNames.push(`${r.tenant.name} - ${moLabel}`);
          }
        }
      }));
    };
    // Backfill: current month + 2 months back
    for(let i=2;i>=0;i--){const d=new Date(TODAY.getFullYear(),TODAY.getMonth()-i,1);genForMonth(d);}
    // If today is the 20th or later, also generate next month
    if(TODAY.getDate()>=20){const next=new Date(TODAY.getFullYear(),TODAY.getMonth()+1,1);genForMonth(next);}
    // Auto-notify for new charges
    if(n>0){setNotifs(prev=>[{id:uid(),type:"payment",msg:`Auto-generated ${n} rent charge${n>1?"s":""}: ${newChargeNames.slice(0,3).join(", ")}${newChargeNames.length>3?` +${newChargeNames.length-3} more`:""}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...prev]);}
    return n;
  },[props,charges]);
  // Auto-run on load
  useEffect(()=>{if(loaded&&props.length>0){const t=setTimeout(()=>autoGenRentCharges(),500);return()=>clearTimeout(t);}},[loaded]);

  // New lead detection — poll apps and trigger confetti + toast
  useEffect(()=>{
    if(!loaded)return;
    if(lastAppCountRef.current===0){lastAppCountRef.current=apps.length;return;}
    if(apps.length>lastAppCountRef.current){
      const newest=apps[0];
      setShowConfetti(true);
      setLeadToast(newest);
      setToastDismissing(false);
      setTimeout(()=>setShowConfetti(false),8000);
      setTimeout(()=>{setToastDismissing(true);setTimeout(()=>setLeadToast(null),300);},15000);
    }
    lastAppCountRef.current=apps.length;
  },[apps.length,loaded]);

  const dismissToast=()=>{setToastDismissing(true);setTimeout(()=>setLeadToast(null),300);};
  const viewNewLead=()=>{setTab("applications");setLeadToast(null);setShowConfetti(false);};

  const openRecordPay=()=>setModal({type:"recordPay",step:1,selRoom:"",selCharge:"",payAmount:0,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});
  const openCreateCharge=()=>setModal({type:"createCharge",roomId:"",category:"Rent",desc:"",amount:0,dueDate:TODAY.toISOString().split("T")[0],notes:""});
  // Backwards compat: openPayForm still works from existing buttons
  const openPayForm=(rid)=>{const unpaidCh=charges.filter(c=>c.roomId===rid&&chargeStatus(c)!=="paid"&&chargeStatus(c)!=="waived");
    if(unpaidCh.length)setModal({type:"recordPay",step:2,selRoom:rid,selCharge:unpaidCh[0].id,payAmount:unpaidCh[0].amount-unpaidCh[0].amountPaid,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});
    else{const r=props.flatMap(p=>p.rooms).find(x=>x.id===rid);setModal({type:"createCharge",roomId:rid,category:"Rent",desc:`${MO} Rent`,amount:(r&&r.rent)||0,dueDate:TODAY.toISOString().split("T")[0],notes:"No existing charge — creating new"});}};

  const cycleRock=id=>setRocks(p=>p.map(r=>{if(r.id!==id)return r;const o=["on-track","off-track","not-started","done"];return{...r,status:o[(o.indexOf(r.status)+1)%o.length]};}));
  const saveProp=p=>{if(isNewProp)setProps(prev=>[...prev,p]);else setProps(prev=>prev.map(x=>x.id===p.id?p:x));setEditProp(null);};

  const pastDueCount=charges.filter(c=>chargeStatus(c)==="pastdue").length;
  const tabs=[
    {id:"dashboard",i:"📊",l:"Dashboard"},
    {id:"scorecard",i:"📈",l:"Scorecard"},
    {id:"rocks",i:"🪨",l:"Rocks"},
    {id:"issues",i:"⚠️",l:"Issues"},
    {id:"tenants",i:"👥",l:"Tenants"},
    {id:"payments",i:"💰",l:"Payments",badge:pastDueCount||m.unpaid.length||null},
    {id:"applications",i:"📋",l:"Applications",badge:m.activeApps||null},
    {id:"maintenance",i:"🔧",l:"Maintenance",badge:m.openMaint||null},
    {id:"documents",i:"📁",l:"Documents"},
    {id:"accounting",i:"📈",l:"Accounting"},
    {id:"properties",i:"🏠",l:"Properties"},
    {id:"site-settings",i:"⚙️",l:"Site Settings"},
    {id:"theme",i:"🎨",l:"Theme Editor"},
    {id:"ideas",i:"💡",l:"Idea Board"},
    {id:"notifications",i:"🔔",l:"Alerts",badge:m.unreadNotifs||null},
  ];

  const goTab=(t)=>{setTab(t);setDrill(null);setSideOpen(false);};

  if(!loaded)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"inherit"}}>Loading...</div>);

  // All tenants flat list
  const allTenants=props.flatMap(p=>p.rooms.filter(r=>r.tenant).map(r=>({...r,propName:p.name,propId:p.id,propUtils:p.utils,propClean:p.clean})));

  return(<><style>{S}</style><div className="app">
    {/* Mobile header */}
    <div className="mob-header"><div style={{display:"flex",alignItems:"center",gap:8}}><div className="s-logo" style={{fontSize:16}}>🐻 BB <span>HQ</span></div><span style={{fontSize:11,color:"#c4a882"}}>· {(tabs.find(t=>t.id===tab)||{}).l}</span></div><button className="mob-toggle" onClick={()=>setSideOpen(!sideOpen)}>{sideOpen?"✕":"☰"}</button></div>
    <div className={`mob-overlay ${sideOpen?"show":""}`} onClick={()=>setSideOpen(false)}/>

    {/* Sidebar */}
    <div className={`side ${sideOpen?"open":""}`}>
      <div className="s-logo">🐻 Black Bear <span>HQ</span></div>
      <div className="s-lbl">Overview</div>
      {tabs.slice(0,1).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Traction</div>
      {tabs.slice(1,4).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Tenants</div>
      {tabs.slice(4,6).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Leasing</div>
      {tabs.slice(6,7).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Operations</div>
      {tabs.slice(7,10).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Website</div>
      {tabs.slice(10,14).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">System</div>
      {tabs.slice(14).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-ft">
        <a href="#">🌐 View Public Site</a>
      </div>
    </div>

    {/* Main */}
    <div className="mn">
      <div className="tbar"><div><h1>{(tabs.find(t=>t.id===tab)||{}).i} {(tabs.find(t=>t.id===tab)||{}).l}</h1><div className="tbar-sub">{MO}</div></div></div>
      <div className="cnt">

      {/* ═══ DASHBOARD ═══ */}
      {tab==="dashboard"&&<>
        <div className="kgrid">
          <div className={`kpi ${drill==="occ"?"active":""}`} onClick={()=>setDrill(drill==="occ"?null:"occ")}><div className="kl">🏠 Occupancy</div><div className="kv" style={{color:m.occRate>=90?"#4a7c59":"#c45c4a"}}>{m.occRate}%</div><div className="ks">{m.occ}/{m.total} rooms</div></div>
          <div className={`kpi ${drill==="coll"?"active":""}`} onClick={()=>setDrill(drill==="coll"?null:"coll")}><div className="kl">💰 Collected</div><div className="kv">{fmtS(m.coll)}</div><div className={`ks ${m.collRate>=100?"kg":"kb"}`}>{m.collRate}% of {fmtS(m.due)}</div></div>
          <div className="kpi" onClick={()=>goTab("maintenance")}><div className="kl">🔧 Open Requests</div><div className="kv" style={{color:m.openMaint?"#d4a853":"#4a7c59"}}>{m.openMaint}</div><div className="ks">maintenance items</div></div>
          <div className="kpi" onClick={()=>goTab("applications")}><div className="kl">📋 Applications</div><div className="kv">{m.activeApps}</div><div className="ks">in pipeline</div></div>
          <div className="kpi"><div className="kl">📈 Projected</div><div className="kv">{fmtS(m.proj)}</div><div className="ks">of {fmtS(m.full)} at 100%</div></div>
          <div className="kpi"><div className="kl">💸 Vacancy Loss</div><div className="kv kb">{fmtS(m.lost)}</div><div className="ks">{m.vacs.length} empty room{m.vacs.length!==1?"s":""}</div></div>
        </div>

        {/* Drill panels */}
        {drill==="occ"&&<div className="card" style={{marginBottom:16,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Occupancy: {m.occ}/{m.total} rooms</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.vacs.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.name}</div><div className="row-s">{r.propName} · {r.pb?"Private":"Shared"} bath</div></div><div className="row-v kb">{fmtS(r.rent)}<div style={{fontSize:9,color:"#999"}}>lost/mo</div></div></div>)}
          {m.vacs.length===0&&<div style={{textAlign:"center",padding:20,color:"#4a7c59",fontWeight:700}}>🎉 Fully occupied!</div>}
        </div></div>}
        {drill==="coll"&&<div className="card" style={{marginBottom:16,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Collection: {fmtS(m.coll)} / {fmtS(m.due)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.unpaid.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#c45c4a",marginBottom:8}}>UNPAID ({m.unpaid.length})</div>
            {m.unpaid.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{r.propName} · {r.name}</div></div><div className="row-v kb">{fmtS(r.rent)}</div><button className="btn btn-green btn-sm" onClick={()=>openPayForm(r.id)}>Mark Paid</button></div>)}</>}
          {m.paid.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#4a7c59",marginTop:12,marginBottom:8}}>PAID ({m.paid.length})</div>
            {m.paid.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#4a7c59"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{r.propName}</div></div><div className="row-v kg">{fmtS(r.paidAmt)}</div></div>)}</>}
        </div></div>}

        {/* Expiring leases */}
        {m.expiring.length>0&&<div className="sec-hd"><div><h2>⚠️ Leases Expiring</h2></div></div>}
        {m.expiring.sort((a,b)=>a.daysLeft-b.daysLeft).map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setTab("tenants");setDrill(r.id);}}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{r.propName} · {r.name} · Ends {fmtD(r.le)}</div></div><span className="badge" style={{background:r.daysLeft<=30?"rgba(196,92,74,.08)":"rgba(212,168,83,.1)",color:r.daysLeft<=30?"#c45c4a":"#9a7422"}}>{r.daysLeft}d</span></div>)}

        {/* Recent activity */}
        <div className="sec-hd" style={{marginTop:16}}><div><h2>Recent Activity</h2></div></div>
        {notifs.slice(0,5).map(n=><div key={n.id} className="row" style={{opacity:n.read?0.7:1}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}><span style={{fontSize:14}}>{n.type==="lease"?"📋":n.type==="payment"?"💰":n.type==="maint"?"🔧":"📝"}</span><div className="row-i"><div className="row-t" style={{fontWeight:n.read?500:700}}>{n.msg}</div><div className="row-s">{n.date}</div></div>{!n.read&&<div className="notif-dot"/>}{n.urgent&&<span className="badge b-red">Urgent</span>}</div>)}
      </>}

      {/* ═══ TENANTS ═══ */}
      {tab==="tenants"&&<>
        <div className="sec-hd"><div><h2>Tenants</h2><p>{allTenants.length} current · {archive.length} past</p></div>
          <div style={{display:"flex",gap:4}}><button className={`btn ${!drill||drill!=="archive"?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setDrill(null)}>Current ({allTenants.length})</button><button className={`btn ${drill==="archive"?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setDrill("archive")}>Past Tenants ({archive.length})</button></div>
        </div>

        {/* Current tenants */}
        {drill!=="archive"&&<>{allTenants.map(r=>{
          const pd=(payments[r.id]&&payments[r.id][MO])||0;const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;
          return(
            <div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:r})}>
              <div className="row-dot" style={{background:pd?"#4a7c59":"#c45c4a"}}/>
              <div className="row-i">
                <div className="row-t">{r.tenant.name}</div>
                <div className="row-s">{r.propName} · {r.name} · {r.pb?"Private":"Shared"} bath · {fmtS(r.rent)}/mo</div>
                {dl!==null&&dl<=90&&<div style={{fontSize:9,color:dl<=30?"#c45c4a":"#d4a853",fontWeight:600,marginTop:2}}>⚠ Lease expires in {dl} days</div>}
              </div>
              <div style={{textAlign:"right"}}><div className="row-v">{fmtS(r.rent)}</div><div style={{fontSize:9,color:pd?"#4a7c59":"#c45c4a",fontWeight:600}}>{pd?"✓ Paid":"Unpaid"}</div></div>
            </div>);
        })}{allTenants.length===0&&<div style={{textAlign:"center",padding:32,color:"#999"}}><div style={{fontSize:32,marginBottom:8}}>👥</div>No current tenants</div>}</>}

        {/* Archived / past tenants */}
        {drill==="archive"&&<>
          {archive.length===0?<div style={{textAlign:"center",padding:32,color:"#999"}}><div style={{fontSize:32,marginBottom:8}}>📋</div>No past tenants yet. Terminated leases will appear here.</div>:
          archive.map(a=>(
            <div key={a.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"archived",data:a})}>
              <div className="row-dot" style={{background:"#999"}}/>
              <div className="row-i">
                <div className="row-t">{a.name} <span className="badge b-gray">Past</span></div>
                <div className="row-s">{a.propName} · {a.roomName} · {fmtS(a.rent)}/mo · {fmtD(a.moveIn)} → {fmtD(a.terminatedDate)}</div>
                <div style={{fontSize:9,color:"#999",marginTop:2}}>Terminated: {a.reason}</div>
              </div>
              <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#999"}}>{fmtD(a.terminatedDate)}</div></div>
            </div>
          ))}</>}
      </>}

      {/* ═══ PAYMENTS ═══ */}
      {tab==="payments"&&(()=>{
        const pCharges=getChargesForPeriod(payPeriod);
        const pastDue=pCharges.filter(c=>chargeStatus(c)==="pastdue");
        const unpaidCh=pCharges.filter(c=>chargeStatus(c)==="unpaid");
        const paidCh=pCharges.filter(c=>chargeStatus(c)==="paid");
        const partialCh=pCharges.filter(c=>chargeStatus(c)==="partial");
        const waivedCh=pCharges.filter(c=>chargeStatus(c)==="waived");
        const totalCharged=pCharges.reduce((s,c)=>s+c.amount,0);
        const totalPaid=pCharges.reduce((s,c)=>s+c.amountPaid,0);
        const totalDue=totalCharged-totalPaid-waivedCh.reduce((s,c)=>s+c.amount,0);
        const inTransit=pCharges.flatMap(c=>c.payments).filter(p=>p.depositStatus==="transit").reduce((s,p)=>s+p.amount,0);
        const deposited=pCharges.flatMap(c=>c.payments).filter(p=>p.depositStatus==="deposited"||!p.depositStatus).reduce((s,p)=>s+p.amount,0);
        const periodLabel=payPeriod==="mtd"?MO:payPeriod==="ytd"?`${TODAY.getFullYear()} YTD`:"Next Month";

        // Filters for charges tab
        const applyFilters=(list)=>{let f=list;
          if(payFilters.property)f=f.filter(c=>c.propName===payFilters.property);
          if(payFilters.tenant)f=f.filter(c=>c.tenantName===payFilters.tenant);
          if(payFilters.category)f=f.filter(c=>c.category===payFilters.category);
          if(payFilters.status)f=f.filter(c=>chargeStatus(c)===payFilters.status);
          if(payFilters.dateFrom)f=f.filter(c=>c.dueDate>=payFilters.dateFrom);
          if(payFilters.dateTo)f=f.filter(c=>c.dueDate<=payFilters.dateTo);
          return f;
        };
        const filteredCharges=applyFilters(payPeriod==="all"?charges:pCharges);
        const stColor={paid:"#4a7c59",unpaid:"#3b82f6",pastdue:"#c45c4a",partial:"#d4a853",waived:"#999"};
        const stBadge={paid:"b-green",unpaid:"b-blue",pastdue:"b-red",partial:"b-gold",waived:"b-gray"};

        return(<>
        {/* Main sub-tabs — big and prominent */}
        <div style={{display:"flex",gap:0,marginBottom:14,borderRadius:10,overflow:"hidden",border:"1px solid rgba(0,0,0,.06)"}}>
          {[["overview","📊 Overview"],["charges","🧾 Charges"],["deposits","🏦 Deposits"]].map(([k,l])=>(
            <button key={k} className={`pay-tab${paySubTab===k?" active":""}`} style={{fontSize:14}} onClick={()=>{setPaySubTab(k);setExpCharge(null);}}>{l}</button>
          ))}
        </div>

        {/* Period toggle + Actions row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:3}}>
            {[["mtd","MTD"],["ytd","YTD"],["next","Next Mo"],["all","All"]].map(([k,l])=>(
              <button key={k} className={`btn ${payPeriod===k?"btn-dk":"btn-out"} btn-sm`} style={{fontSize:10}} onClick={()=>setPayPeriod(k)}>{l}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button className="btn btn-green btn-sm" onClick={openRecordPay}>💰 Record Payment</button>
            <button className="btn btn-gold btn-sm" onClick={openCreateCharge}>+ Charge</button>
            <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"addCredit",roomId:"",amount:0,reason:""})}>💳 Credit</button>
            <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"returnSD",roomId:"",deductions:[],returnAmount:0})}>🔒 Return SD</button>
            <button className="btn btn-out btn-sm" onClick={()=>{const n=autoGenRentCharges();alert(n?`Generated ${n} charge${n>1?"s":""}. Next month auto-generates on the 20th.`:"All up to date.");}}>🔄 Sync</button>
          </div>
        </div>

        {/* ── Overview ── */}
        {paySubTab==="overview"&&<>
          <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"pastdue"});}}><div className="kl">🔴 Past Due</div><div className="kv kb">{fmtS(pastDue.reduce((s,c)=>s+(c.amount-c.amountPaid),0))}</div><div className="ks">{pastDue.length} charge{pastDue.length!==1?"s":""}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"unpaid"});}}><div className="kl">📋 Unpaid</div><div className="kv" style={{color:"#3b82f6"}}>{fmtS(unpaidCh.reduce((s,c)=>s+c.amount,0))}</div><div className="ks">{unpaidCh.length} charge{unpaidCh.length!==1?"s":""}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:""});}}><div className="kl">🧾 All Charges</div><div className="kv">{fmtS(totalCharged)}</div><div className="ks">{pCharges.length} charge{pCharges.length!==1?"s":""}</div></div>
          </div>
          <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"paid"});}}><div className="kl">✅ Paid</div><div className="kv kg">{fmtS(totalPaid)}</div><div className="ks">{paidCh.length} charge{paidCh.length!==1?"s":""}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>setPaySubTab("deposits")}><div className="kl">🏦 In Transit</div><div className="kv kw">{fmtS(inTransit)}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>setPaySubTab("deposits")}><div className="kl">💵 Deposited</div><div className="kv kg">{fmtS(deposited)}</div></div>
          </div>
          <div style={{fontSize:10,color:"#999",textAlign:"center",marginTop:4,marginBottom:14}}>Showing: {periodLabel} · Click any card to drill down</div>

          {/* Quick property breakdown */}
          {m.propBreakdown.map(pr=>{const prCh=pCharges.filter(c=>c.propName===pr.name);const prPaid=prCh.reduce((s,c)=>s+c.amountPaid,0);const prDue=prCh.reduce((s,c)=>s+c.amount,0);return(
            <div key={pr.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,property:pr.name});}}>
              <div className="row-i"><div className="row-t">{pr.name}</div><div className="row-s">{pr.rooms.length} rooms · {pr.occCount} occupied</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800}}>{fmtS(prPaid)}<small style={{color:"#999"}}> / {fmtS(prDue)}</small></div>
                <div style={{fontSize:9,color:prPaid>=prDue?"#4a7c59":"#c45c4a",fontWeight:600}}>{prDue?Math.round(prPaid/prDue*100):0}%</div></div>
            </div>
          );})}
        </>}

        {/* ── Charges ── */}
        {paySubTab==="charges"&&<>
          {/* Filters */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
            <select value={payFilters.property} onChange={e=>setPayFilters({...payFilters,property:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Properties</option>{props.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>
            <select value={payFilters.tenant} onChange={e=>setPayFilters({...payFilters,tenant:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Tenants</option>{[...new Set(charges.map(c=>c.tenantName))].map(n=><option key={n} value={n}>{n}</option>)}</select>
            <select value={payFilters.category} onChange={e=>setPayFilters({...payFilters,category:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Categories</option>{CHARGE_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select>
            <select value={payFilters.status} onChange={e=>setPayFilters({...payFilters,status:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Status</option><option value="paid">Paid</option><option value="unpaid">Unpaid</option><option value="pastdue">Past Due</option><option value="partial">Partial</option><option value="waived">Waived</option></select>
            <input type="date" value={payFilters.dateFrom} onChange={e=>setPayFilters({...payFilters,dateFrom:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}} placeholder="From"/>
            <input type="date" value={payFilters.dateTo} onChange={e=>setPayFilters({...payFilters,dateTo:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}} placeholder="To"/>
            <button className="btn btn-out btn-sm" onClick={()=>setPayFilters({property:"",tenant:"",category:"",status:"",dateFrom:"",dateTo:""})}>Reset</button>
          </div>
          <div style={{fontSize:10,color:"#999",marginBottom:8}}>{filteredCharges.length} charge{filteredCharges.length!==1?"s":""} · {periodLabel}</div>
          {/* Column headers */}
          <div style={{display:"grid",gridTemplateColumns:"90px 90px 1fr 70px 90px 80px",gap:4,padding:"8px 14px",fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,borderBottom:"2px solid rgba(0,0,0,.06)"}}>
            <div>Due Date</div><div>Category</div><div>Tenant / Room</div><div>Status</div><div>Deposit</div><div style={{textAlign:"right"}}>Amount</div>
          </div>
          {filteredCharges.sort((a,b)=>new Date(b.dueDate)-new Date(a.dueDate)).map(c=>{const st=chargeStatus(c);const lastPay=c.payments.length?c.payments[c.payments.length-1]:null;const isExp=expCharge===c.id;const rem=c.amount-c.amountPaid;const confId=`BB-${c.id.slice(0,8).toUpperCase()}`;return(
            <div key={c.id}>
              <div style={{display:"grid",gridTemplateColumns:"90px 90px 1fr 70px 90px 80px",gap:4,padding:"10px 14px",borderBottom:"1px solid rgba(0,0,0,.03)",cursor:"pointer",background:isExp?"rgba(0,0,0,.02)":"transparent",transition:"background .1s"}} onClick={()=>setExpCharge(isExp?null:c.id)}>
                <div style={{fontSize:11,fontWeight:600}}>{fmtD(c.dueDate)}</div>
                <div><span className="badge b-gray" style={{fontSize:8}}>{c.category}</span></div>
                <div><div style={{fontSize:11,fontWeight:600}}>{c.tenantName}</div><div style={{fontSize:9,color:"#999"}}>{c.propName} · {c.roomName}</div></div>
                <div><span className={`badge ${stBadge[st]}`} style={{fontSize:8}}>{st}</span></div>
                <div>{lastPay&&lastPay.depositDate?<div><div style={{fontSize:10}}>{fmtD(lastPay.depositDate)}</div><div style={{fontSize:8,color:"#999"}}>Redstone FCU</div></div>:lastPay&&lastPay.depositStatus==="transit"?<span style={{fontSize:9,color:"#d4a853"}}>In transit</span>:<span style={{fontSize:9,color:"#999"}}>—</span>}</div>
                <div style={{textAlign:"right",fontWeight:800,fontSize:13,color:st==="paid"?"#4a7c59":st==="pastdue"?"#c45c4a":"inherit"}}>{fmtS(c.amount)}</div>
              </div>
              {/* Expanded detail */}
              {isExp&&<div style={{padding:"14px 20px",background:"#faf9f7",borderBottom:"2px solid rgba(0,0,0,.04)",animation:"fadeIn .15s"}}>
                {/* Charge info */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12,fontSize:12}}>
                  <div><span style={{color:"#999",fontSize:10}}>Description</span><div style={{fontWeight:600}}>{c.desc}</div></div>
                  <div><span style={{color:"#999",fontSize:10}}>Created</span><div>{fmtD(c.createdDate)}</div></div>
                  {c.amountPaid>0&&<div><span style={{color:"#999",fontSize:10}}>Paid</span><div style={{color:"#4a7c59",fontWeight:700}}>{fmtS(c.amountPaid)}</div></div>}
                  {rem>0&&st!=="waived"&&<div><span style={{color:"#999",fontSize:10}}>Remaining</span><div style={{color:"#c45c4a",fontWeight:700}}>{fmtS(rem)}</div></div>}
                </div>

                {/* Payment history if any */}
                {c.payments.length>0&&<div style={{marginBottom:12}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",marginBottom:4}}>Payments</div>
                  {c.payments.map(p=>(
                    <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.03)",fontSize:11}}>
                      <div><strong>{fmtD(p.date)}</strong> · {p.method}{p.notes?` · ${p.notes}`:""}{p.depositDate?` · Deposited ${fmtD(p.depositDate)}`:""}</div>
                      <strong style={{color:"#4a7c59"}}>{fmtS(p.amount)}</strong>
                    </div>))}
                </div>}

                {/* Paid: receipt info */}
                {st==="paid"&&<div style={{background:"rgba(74,124,89,.04)",borderRadius:8,padding:12,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontSize:9,color:"#4a7c59",fontWeight:700,textTransform:"uppercase"}}>Payment Confirmed</div><div style={{fontSize:11,fontFamily:"monospace",marginTop:2}}>Confirmation: {confId}</div></div>
                    <button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();alert(`Receipt PDF for ${confId} — will generate real PDF on deployment.`);}}>📄 Download Receipt</button>
                  </div>
                </div>}

                {/* Unpaid/Late: action buttons */}
                {st!=="paid"&&st!=="waived"&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});}}>💰 Record Payment</button>
                  <button className="btn btn-dk btn-sm" onClick={e=>{e.stopPropagation();setNotifs(p=>[{id:uid(),type:"payment",msg:`Reminder sent to ${c.tenantName}: ${c.category} ${fmtS(rem)} due ${fmtD(c.dueDate)}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);alert(`Reminder sent to ${c.tenantName}`);}}>📧 Send Reminder</button>
                  <button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"createCharge",roomId:c.roomId,category:c.category,desc:c.desc,amount:c.amount,dueDate:c.dueDate,notes:"Editing #"+c.id.slice(0,6)});}}>✏️ Edit</button>
                  <button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"deleteCharge",chargeId:c.id,tenantName:c.tenantName,category:c.category});}}> 🗑 Delete</button>
                  {st==="pastdue"&&<button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"waiveCharge",chargeId:c.id,reason:""});}}> ⏹ Stop Late Fees</button>}
                </div>}

                {st==="waived"&&<div style={{background:"rgba(0,0,0,.03)",borderRadius:6,padding:8,fontSize:11,color:"#999"}}>Waived{c.waivedReason?`: ${c.waivedReason}`:""}</div>}
              </div>}
            </div>);})}
          {filteredCharges.length===0&&<div style={{textAlign:"center",padding:24,color:"#999"}}>No charges match your filters</div>}
        </>}

        {/* ── Deposits ── */}
        {paySubTab==="deposits"&&(()=>{
          // Collect all payments with full context from their parent charge
          const allPays=charges.flatMap(c=>c.payments.map(p=>({...p,chargeId:c.id,tenantName:c.tenantName,propName:c.propName,roomName:c.roomName,category:c.category,chargeDueDate:c.dueDate})));
          const transit=allPays.filter(p=>p.depositStatus==="transit");
          const deposited=allPays.filter(p=>p.depositStatus==="deposited");
          const allDeposited=[...deposited].sort((a,b)=>new Date(b.depositDate||b.date)-new Date(a.depositDate||a.date));

          // Apply filters
          let filtered=allDeposited;
          if(depFilters.property)filtered=filtered.filter(p=>p.propName===depFilters.property);
          if(depFilters.tenant)filtered=filtered.filter(p=>p.tenantName===depFilters.tenant);
          if(depFilters.lease)filtered=filtered.filter(p=>p.roomName===depFilters.lease);
          if(depFilters.dateFrom)filtered=filtered.filter(p=>(p.depositDate||p.date)>=depFilters.dateFrom);
          if(depFilters.dateTo)filtered=filtered.filter(p=>(p.depositDate||p.date)<=depFilters.dateTo);

          // Group by month for display
          const months={};
          filtered.forEach(p=>{const d=new Date((p.depositDate||p.date)+"T00:00:00");const mk=`${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}`;const label=d.toLocaleString("default",{month:"long",year:"numeric"});if(!months[mk])months[mk]={label,key:mk,items:[],total:0};months[mk].items.push(p);months[mk].total+=p.amount;});
          const monthKeys=Object.keys(months).sort().reverse();

          const totalTransit=transit.reduce((s,p)=>s+p.amount,0);
          const totalDeposited=filtered.reduce((s,p)=>s+p.amount,0);

          // SD section
          const sdTenants=props.flatMap(pr=>pr.rooms.filter(r=>r.st==="occupied"&&r.tenant).map(r=>({...r,propName:pr.name})));
          const totalSD=sdTenants.reduce((s,r)=>{const sd=sdLedger.find(x=>x.roomId===r.id);return s+((sd&&sd.amountHeld)||r.rent);},0);

          return(<>
          {/* KPIs */}
          <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <div className="kpi"><div className="kl">🔄 In Transit</div><div className="kv kw">{fmtS(totalTransit)}</div><div className="ks">{transit.length} pending</div></div>
            <div className="kpi"><div className="kl">🏦 Deposited</div><div className="kv kg">{fmtS(totalDeposited)}</div><div className="ks">{filtered.length} deposits</div></div>
            <div className="kpi"><div className="kl">🔒 SD Held</div><div className="kv">{fmtS(totalSD)}</div><div className="ks">{sdTenants.length} tenants · Redstone FCU</div></div>
          </div>

          {/* In Transit */}
          {transit.length>0&&<>
            <div className="sec-hd"><div><h2>In Transit ({transit.length})</h2><p>Payments waiting to clear</p></div></div>
            {transit.map(p=><div key={p.id} className="row">
              <div className="row-dot" style={{background:"#d4a853"}}/>
              <div className="row-i"><div className="row-t">{p.tenantName}</div><div className="row-s">{p.propName} · {p.roomName} · {p.method} · Paid {fmtD(p.date)}</div></div>
              <div className="row-v kw">{fmtS(p.amount)}</div>
              <button className="btn btn-green btn-sm" onClick={()=>{setCharges(prev=>prev.map(c=>({...c,payments:c.payments.map(pp=>pp.id===p.id?{...pp,depositStatus:"deposited",depositDate:TODAY.toISOString().split("T")[0]}:pp)})));}}>Mark Deposited</button>
            </div>)}
          </>}

          {/* Deposit Ledger */}
          <div className="sec-hd" style={{marginTop:16}}><div><h2>Deposit Ledger</h2></div></div>

          {/* Filters */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
            <select value={depFilters.property} onChange={e=>setDepFilters({...depFilters,property:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Properties</option>{props.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>
            <select value={depFilters.tenant} onChange={e=>setDepFilters({...depFilters,tenant:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Tenants</option>{[...new Set(allDeposited.map(p=>p.tenantName))].map(n=><option key={n} value={n}>{n}</option>)}</select>
            <select value={depFilters.lease} onChange={e=>setDepFilters({...depFilters,lease:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Rooms</option>{[...new Set(allDeposited.map(p=>p.roomName))].map(n=><option key={n} value={n}>{n}</option>)}</select>
            <input type="date" value={depFilters.dateFrom} onChange={e=>setDepFilters({...depFilters,dateFrom:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}}/>
            <input type="date" value={depFilters.dateTo} onChange={e=>setDepFilters({...depFilters,dateTo:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}}/>
            <button className="btn btn-out btn-sm" onClick={()=>setDepFilters({property:"",tenant:"",lease:"",dateFrom:"",dateTo:""})}>Reset</button>
          </div>

          {/* Monthly grouped table */}
          <div style={{maxHeight:500,overflowY:"auto",borderRadius:10,border:"1px solid rgba(0,0,0,.04)"}}>
            {monthKeys.length>0?monthKeys.map(mk=>{const mo=months[mk];return(
              <div key={mk}>
                <div style={{position:"sticky",top:0,zIndex:2,background:"#f4f3f0",padding:"10px 16px",borderBottom:"2px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:13,fontWeight:800}}>{mo.label}</div>
                  <div style={{fontSize:13,fontWeight:800,color:"#4a7c59"}}>{fmtS(mo.total)} <span style={{fontSize:10,fontWeight:500,color:"#999"}}>({mo.items.length})</span></div>
                </div>
                <table className="tbl" style={{marginBottom:0}}><thead><tr><th>Deposit Date</th><th>Date Paid</th><th>Tenant / Room</th><th>Bank Account</th><th style={{textAlign:"right"}}>Amount</th></tr></thead><tbody>
                  {mo.items.map(p=>(
                    <tr key={p.id}>
                      <td style={{fontWeight:600}}>{fmtD(p.depositDate)}</td>
                      <td>{fmtD(p.date)}</td>
                      <td><div style={{fontSize:11,fontWeight:600}}>{p.tenantName}</div><div style={{fontSize:9,color:"#999"}}>{p.propName} · {p.roomName}</div></td>
                      <td><div style={{fontSize:11}}>Redstone FCU</div><div style={{fontSize:9,color:"#999"}}>{p.method}</div></td>
                      <td style={{textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(p.amount)}</td>
                    </tr>
                  ))}
                </tbody></table>
              </div>
            );}):<div style={{textAlign:"center",padding:40,color:"#999"}}><div style={{fontSize:28,marginBottom:8}}>🏦</div>No deposits yet. When you record payments via ACH/Stripe and mark them deposited, they'll appear here grouped by month.</div>}
          </div>

          {/* Security Deposits */}
          <div className="sec-hd" style={{marginTop:20}}><div><h2>🔒 Security Deposits — Redstone FCU</h2></div></div>
          <div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th>Tenant</th><th>Property</th><th>Room</th><th>Lease End</th><th style={{textAlign:"right"}}>SD Held</th></tr></thead><tbody>
            {sdTenants.length>0?sdTenants.map(r=>{const sd=sdLedger.find(x=>x.roomId===r.id);const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;return(
              <tr key={r.id}>
                <td style={{fontWeight:600}}>{r.tenant.name}</td>
                <td>{r.propName}</td>
                <td>{r.name}</td>
                <td>{r.le?<span style={{color:dl&&dl<=90?dl<=30?"#c45c4a":"#d4a853":"inherit"}}>{fmtD(r.le)}{dl&&dl<=90?` (${dl}d)`:""}</span>:"—"}</td>
                <td style={{textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS((sd&&sd.amountHeld)||r.rent)}</td>
              </tr>);}):
            <tr><td colSpan={5} style={{textAlign:"center",padding:20,color:"#999"}}>No security deposits</td></tr>}
            {sdTenants.length>0&&<tr style={{borderTop:"2px solid rgba(0,0,0,.06)"}}><td colSpan={4} style={{fontWeight:800}}>Total Held</td><td style={{textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(totalSD)}</td></tr>}
          </tbody></table></div></div>

          {/* SD Returns History */}
          {sdLedger.length>0&&<>
            <div className="sec-hd" style={{marginTop:16}}><div><h2>SD Returns</h2></div></div>
            {sdLedger.map(s=>(
              <div key={s.id} className="row">
                <div className="row-dot" style={{background:"#999"}}/>
                <div className="row-i"><div className="row-t">{s.tenantName}</div><div className="row-s">{s.propName} · {s.roomName} · Held {fmtS(s.amountHeld)} · Deducted {fmtS(s.amountHeld-s.returned)} · Returned {fmtD(s.returnDate)}</div></div>
                <div className="row-v" style={{color:"#4a7c59"}}>{fmtS(s.returned)}</div>
              </div>
            ))}
          </>}
          </>);
        })()}
        </>);
      })()}

      {/* ═══ APPLICATIONS ═══ */}
      {tab==="applications"&&(()=>{
        const STAGES=["pre-screened","called","invited","applied","reviewing","approved","move-in"];
        const SL={"pre-screened":"Pre-Screened","called":"Called","invited":"Invited","applied":"Applied","reviewing":"Reviewing","approved":"Approved","move-in":"Move-In"};
        const SC2={"pre-screened":"b-blue","called":"b-gold","invited":"b-gold","applied":"b-blue","reviewing":"b-gold","approved":"b-green","move-in":"b-green","denied":"b-red"};
        const SI2={"pre-screened":"📋","called":"📞","invited":"✉️","applied":"📝","reviewing":"🔍","approved":"✅","move-in":"🏠"};
        const moveApp=(id,ns)=>{setApps(p=>p.map(a=>{if(a.id!==id)return a;return{...a,status:ns,lastContact:TODAY.toISOString().split("T")[0],prevStage:a.status,history:[...(a.history||[]),{from:a.status,to:ns,date:TODAY.toISOString().split("T")[0]}]};}));};
        const daysSince=(d)=>{if(!d)return 999;return Math.floor((TODAY-new Date(d+"T00:00:00"))/(1e3*60*60*24));};
        const scoreApp=(a)=>{let s=50;if(a.income){const n=parseInt(String(a.income).replace(/[^0-9]/g,""));if(n>=5000)s+=15;else if(n>=4000)s+=10;else if(n>=3000)s+=5;}if(a.bgCheck==="passed")s+=15;if(a.creditScore&&a.creditScore!=="—"){const c=parseInt(a.creditScore);if(c>=750)s+=15;else if(c>=700)s+=10;else if(c>=650)s+=5;}if(a.refs==="verified")s+=10;return Math.min(s,100);};
        const activeApps=apps.filter(a=>a.status!=="denied"&&(appSearch?[a.name,a.email,a.phone,a.property,a.source].some(v=>(v||"").toLowerCase().includes(appSearch.toLowerCase())):true));
        const deniedApps=apps.filter(a=>a.status==="denied");
        const staleApps=activeApps.filter(a=>daysSince(a.lastContact||a.submitted)>=3&&!["approved","move-in"].includes(a.status));
        const DEF_APP_FIELDS=[
          {id:uid(),label:"Full Legal Name",type:"text",section:"Personal",required:true,active:true},
          {id:uid(),label:"Date of Birth",type:"date",section:"Personal",required:true,active:true},
          {id:uid(),label:"Photo ID Upload",type:"file",section:"Verification",required:true,active:true},
          {id:uid(),label:"Current Employer",type:"text",section:"Employment",required:true,active:true},
          {id:uid(),label:"Monthly Income",type:"number",section:"Employment",required:true,active:true},
          {id:uid(),label:"Proof of Income Upload",type:"file",section:"Employment",required:true,active:true},
          {id:uid(),label:"Employer Reference (name + phone)",type:"text",section:"Employment",required:true,active:true},
          {id:uid(),label:"Previous Landlord Name + Phone",type:"text",section:"Rental History",required:true,active:true},
          {id:uid(),label:"Have you been evicted?",type:"yes-no",section:"Background",required:true,active:true},
          {id:uid(),label:"Do you have any felonies?",type:"yes-no",section:"Background",required:true,active:true},
          {id:uid(),label:"Emergency Contact (name + phone + relation)",type:"text",section:"Emergency",required:true,active:true},
          {id:uid(),label:"Desired Move-In Date",type:"date",section:"Move-In",required:true,active:true},
          {id:uid(),label:"How many occupants?",type:"number",section:"Move-In",required:true,active:true},
        ];

        return(<>
        {/* Follow-up alerts */}
        {staleApps.length>0&&<div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.15)",borderRadius:10,padding:12,marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"#9a7422",marginBottom:6}}>🔔 Follow Up ({staleApps.length})</div>
          {staleApps.map(a=><div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",fontSize:11,borderBottom:"1px solid rgba(0,0,0,.03)"}}><span><strong>{a.name}</strong> — {SL[a.status]} · <span style={{color:daysSince(a.lastContact||a.submitted)>=5?"#c45c4a":"#d4a853",fontWeight:700}}>{daysSince(a.lastContact||a.submitted)}d</span></span><button className="btn btn-out btn-sm" style={{fontSize:8}} onClick={()=>setModal({type:"app",data:a})}>Open</button></div>)}
        </div>}

        {/* KPIs + controls */}
        <div className="kgrid" style={{gridTemplateColumns:"repeat(4,1fr)",marginBottom:10}}>
          <div className="kpi"><div className="kl">Pipeline</div><div className="kv">{activeApps.length}</div></div>
          <div className="kpi"><div className="kl">Avg Score</div><div className="kv" style={{color:"#4a7c59"}}>{activeApps.length?Math.round(activeApps.reduce((s,a)=>s+scoreApp(a),0)/activeApps.length):0}</div></div>
          <div className="kpi"><div className="kl">Stale</div><div className="kv" style={{color:staleApps.length?"#c45c4a":"#4a7c59"}}>{staleApps.length}</div></div>
          <div className="kpi"><div className="kl">Denied</div><div className="kv">{deniedApps.length}</div></div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <input value={appSearch} onChange={e=>setAppSearch(e.target.value)} placeholder="Search applicants..." style={{flex:1,minWidth:160,padding:"8px 12px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/>
          {["pipeline","list"].map(v=><button key={v} className={`btn ${appView===v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setAppView(v)}>{v==="pipeline"?"📋 Pipeline":"📝 List"}</button>)}
        </div>

        {/* Pipeline */}
        {appView==="pipeline"&&<div className="pipeline" style={{gridTemplateColumns:"repeat(7,1fr)"}}>
          {STAGES.map((stage,si)=>{const sa=activeApps.filter(a=>a.status===stage);return(
            <div key={stage} className="pipe-col">
              <div className="pipe-hd"><h4 style={{fontSize:10}}>{SI2[stage]} {SL[stage]}</h4><span className="pipe-cnt">{sa.length}</span></div>
              <div className="pipe-bd">{sa.sort((a,b)=>scoreApp(b)-scoreApp(a)).map(a=>{const sc=scoreApp(a);const d=daysSince(a.lastContact||a.submitted);return(
                <div key={a.id} className="pipe-card" style={{borderLeft:"3px solid "+(sc>=70?"#4a7c59":sc>=50?"#d4a853":"#c45c4a")}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><div className="pipe-nm" style={{fontSize:10}}>{a.name}</div><span style={{fontSize:7,fontWeight:700,color:sc>=70?"#4a7c59":sc>=50?"#d4a853":"#c45c4a",background:sc>=70?"rgba(74,124,89,.08)":sc>=50?"rgba(212,168,83,.08)":"rgba(196,92,74,.08)",padding:"1px 4px",borderRadius:3}}>{sc}</span></div>
                  <div className="pipe-sub" style={{fontSize:8}}>{a.property||"No pref"}{d>0?<span style={{color:d>=5?"#c45c4a":d>=3?"#d4a853":"#999"}}> · {d}d</span>:""}</div>
                  <div style={{display:"flex",gap:2,marginTop:4}}>
                    {si>0&&<button className="btn btn-out btn-sm" style={{fontSize:7,flex:1,padding:"3px"}} onClick={e=>{e.stopPropagation();moveApp(a.id,STAGES[si-1]);}}>←</button>}
                    <button className="btn btn-green btn-sm" style={{fontSize:7,flex:2,padding:"3px"}} onClick={e=>{e.stopPropagation();if(si<6)moveApp(a.id,STAGES[si+1]);}}>{si<6?"→ "+SL[STAGES[si+1]].split(" ")[0]:"✓"}</button>
                  </div>
                  <div style={{display:"flex",gap:2,marginTop:2}}>
                    <button className="btn btn-out btn-sm" style={{fontSize:7,flex:1,padding:"3px"}} onClick={e=>{e.stopPropagation();setModal({type:"app",data:a});}}>Open</button>
                    {(stage==="pre-screened"||stage==="called")&&<button className="btn btn-dk btn-sm" style={{fontSize:7,flex:1,padding:"3px"}} onClick={e=>{e.stopPropagation();setModal({type:"inviteApp",data:a});}}>✉️</button>}
                    <button className="btn btn-out btn-sm" style={{fontSize:7,padding:"3px",color:"#c45c4a"}} onClick={e=>{e.stopPropagation();setModal({type:"denyApp",appId:a.id,reason:""});}}>✕</button>
                  </div>
                </div>);})}
              {sa.length===0&&<div style={{textAlign:"center",padding:12,color:"#ccc",fontSize:9}}>Empty</div>}
            </div>);})}
        </div>}

        {/* List */}
        {appView==="list"&&<div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th>Name</th><th>Property</th><th>Score</th><th>Stage</th><th>Days</th><th>Source</th></tr></thead><tbody>
          {activeApps.sort((a,b)=>scoreApp(b)-scoreApp(a)).map(a=>{const sc=scoreApp(a);const d=daysSince(a.lastContact||a.submitted);return(
            <tr key={a.id} style={{cursor:"pointer"}} onClick={()=>setModal({type:"app",data:a})}><td style={{fontWeight:700}}>{a.name}</td><td>{a.property||"—"}</td>
              <td><span style={{fontWeight:700,color:sc>=70?"#4a7c59":sc>=50?"#d4a853":"#c45c4a"}}>{sc}</span></td>
              <td><span className={"badge "+SC2[a.status]}>{SL[a.status]}</span></td>
              <td style={{color:d>=5?"#c45c4a":d>=3?"#d4a853":"#999",fontWeight:600}}>{d}d</td>
              <td style={{fontSize:10}}>{a.source||"—"}</td></tr>);})}
        </tbody></table></div></div>}

        {/* Denied */}
        {deniedApps.length>0&&<div style={{marginTop:14}}><div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:6}}>DENIED ({deniedApps.length})</div>
          {deniedApps.map(a=><div key={a.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{a.name}</div><div className="row-s">{a.property} · {fmtD(a.deniedDate)}{a.deniedReason?" · "+a.deniedReason:""}</div></div><button className="btn btn-out btn-sm" onClick={()=>setApps(p=>p.map(x=>x.id===a.id?{...x,status:x.prevStage||"pre-screened",deniedReason:null,deniedDate:null}:x))}>Restore</button></div>)}
        </div>}

        {/* ── Screening Questions Editor ── */}
        <div style={{marginTop:16,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,screenEditor:!p.screenEditor}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.screenEditor?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>📋 Pre-Screen Questions</div><div style={{fontSize:9,color:"#999"}}>{screenQs.length} questions · Edit what prospects answer before applying</div></div></div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <span style={{fontSize:10,color:screenQs.filter(q=>q.active).length===screenQs.length?"#4a7c59":"#d4a853",fontWeight:600}}>{screenQs.filter(q=>q.active).length}/{screenQs.length} active</span>
              {screenQs.length===0&&<button className="btn btn-gold btn-sm" onClick={e=>{e.stopPropagation();setScreenQs([
                {id:uid(),q:"Are you a non-smoker? We have a strict no-smoking policy (including vapes).",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Do you agree to our zero-tolerance drug policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Are you comfortable with our no-pets policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Can you pass a background check with no criminal record?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Is your credit score 650 or above?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Is your gross monthly income at least 3x your expected rent?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Can you provide professional references and verifiable landlord history?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              ]);}}>Load Default Questions</button>}
            </div>
          </div>
          {expanded.screenEditor&&<div style={{padding:16,background:"#fff"}}>
            {screenQs.length===0&&<div style={{textAlign:"center",padding:24,color:"#999"}}><p style={{fontSize:12,marginBottom:8}}>No screening questions configured.</p><button className="btn btn-gold" onClick={()=>setScreenQs([
              {id:uid(),q:"Are you a non-smoker? We have a strict no-smoking policy (including vapes).",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Do you agree to our zero-tolerance drug policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Are you comfortable with our no-pets policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Can you pass a background check with no criminal record?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Is your credit score 650 or above?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Is your gross monthly income at least 3x your expected rent?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Can you provide professional references and verifiable landlord history?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
            ])}>Load 7 Default Questions</button></div>}
            {screenQs.map((q,i)=>(
              <div key={q.id} style={{padding:12,border:"1px solid rgba(0,0,0,.04)",borderRadius:8,marginBottom:8,background:q.active?"#fff":"#f8f7f4",opacity:q.active?1:0.6}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                  <div style={{display:"flex",flexDirection:"column",gap:2,marginTop:4}}>
                    {i>0&&<button style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#999"}} onClick={()=>{const n=[...screenQs];[n[i-1],n[i]]=[n[i],n[i-1]];setScreenQs(n);}}>▲</button>}
                    {i<screenQs.length-1&&<button style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#999"}} onClick={()=>{const n=[...screenQs];[n[i],n[i+1]]=[n[i+1],n[i]];setScreenQs(n);}}>▼</button>}
                  </div>
                  <div style={{flex:1}}>
                    <textarea value={q.q} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,q:e.target.value}:x))} rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:12,fontFamily:"inherit",resize:"vertical"}}/>
                  </div>
                  <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:14,marginTop:4}} onClick={()=>setScreenQs(p=>p.filter((_,j)=>j!==i))}>✕</button>
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",fontSize:11}}>
                  <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}><input type="checkbox" checked={q.required} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,required:e.target.checked}:x))}/> Required</label>
                  <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}><input type="checkbox" checked={q.active} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,active:e.target.checked}:x))}/> Active</label>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#999"}}>Type:</span><select value={q.type||"yes-no"} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,type:e.target.value}:x))} style={{padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="yes-no">Yes / No</option><option value="text">Text</option><option value="number">Number</option></select></div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#999"}}>Pass:</span><select value={q.pass||"Yes"} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,pass:e.target.value}:x))} style={{padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="Yes">Yes</option><option value="No">No</option><option value="">Any</option></select></div>
                  {(q.type==="text"||q.type==="number")&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#999"}}>Min chars:</span><input type="number" value={q.minChars||0} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,minChars:Number(e.target.value)}:x))} style={{width:50,padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:10}}/></div>}
                </div>
              </div>
            ))}
            {screenQs.length>0&&<button className="btn btn-out" style={{width:"100%",marginTop:8}} onClick={()=>setScreenQs(p=>[...p,{id:uid(),q:"New question...",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"}])}>+ Add Question</button>}
            {screenQs.length>0&&<div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="btn btn-green" style={{flex:1}} onClick={()=>{save("hq-screen-qs",screenQs);setNotifs(p=>[{id:uid(),type:"app",msg:`Pre-screen questions published (${screenQs.filter(q=>q.active).length} active)`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);alert("Pre-screen questions saved and published! The public site will use these questions.");}}>🚀 Save & Publish to Site</button>
              <button className="btn btn-out" onClick={()=>{if(window.confirm&&typeof window.confirm==="function"){setScreenQs([
                {id:uid(),q:"Are you a non-smoker? We have a strict no-smoking policy (including vapes).",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Do you agree to our zero-tolerance drug policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Are you comfortable with our no-pets policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Can you pass a background check with no criminal record?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Is your credit score 650 or above?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Is your gross monthly income at least 3x your expected rent?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Can you provide professional references and verifiable landlord history?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              ]);}}}> Reset to Defaults</button>
            </div>}
            <div style={{fontSize:9,color:"#999",marginTop:8,textAlign:"center"}}>Saves to Supabase · Click "Save & Publish" to push changes live</div>
          </div>}
        </div>

        {/* ── Pre-Screen Preview ── */}
        {screenQs.length>0&&<div style={{marginTop:8,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,screenPreview:!p.screenPreview}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.screenPreview?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>👁 Pre-Screen Preview</div><div style={{fontSize:9,color:"#999"}}>See what tenants see on the public site</div></div></div>
          </div>
          {expanded.screenPreview&&(()=>{
            const activeQs=screenQs.filter(q=>q.active);
            const answerPreview=(v)=>{
              const q=activeQs[prevStep];
              if(q.pass&&v!==q.pass){setPrevResult("fail");return;}
              if(prevStep<activeQs.length-1)setPrevStep(prevStep+1);
              else setPrevResult("pass");
            };
            const resetPreview=()=>{setPrevStep(0);setPrevResult(null);};
            return(
            <div style={{padding:20,background:"linear-gradient(165deg,#1a1714,#2c2520)",borderRadius:0}}>
              <div style={{maxWidth:480,margin:"0 auto"}}>
                <div style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:24,border:"1px solid rgba(255,255,255,.08)"}}>
                  {prevResult===null&&<>
                    <div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#d4a853",marginBottom:8}}>Quick Pre-Screen</div><div style={{fontSize:10,color:"rgba(196,168,130,.6)"}}>{activeQs.length} questions · Takes 30 seconds</div></div>
                    <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:16}}>{activeQs.map((_,i)=><div key={i} style={{width:i===prevStep?24:8,height:8,borderRadius:4,background:i<prevStep?"#4a7c59":i===prevStep?"#d4a853":"rgba(255,255,255,.1)",transition:"all .2s"}}/>)}</div>
                    <div style={{fontSize:10,color:"rgba(196,168,130,.5)",marginBottom:6}}>Question {prevStep+1} of {activeQs.length}</div>
                    <div style={{fontSize:15,color:"#f5f0e8",fontWeight:600,lineHeight:1.5,marginBottom:20}}>{activeQs[prevStep].q}</div>
                    <div style={{display:"flex",gap:10}}>
                      {activeQs[prevStep].type==="yes-no"?<>
                        <button onClick={()=>answerPreview("Yes")} style={{flex:1,padding:"12px 20px",borderRadius:8,border:"none",background:"#4a7c59",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Yes</button>
                        <button onClick={()=>answerPreview("No")} style={{flex:1,padding:"12px 20px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#f5f0e8",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>No</button>
                      </>:<div style={{width:"100%"}}><input placeholder="Type your answer..." style={{width:"100%",padding:"12px 14px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"rgba(255,255,255,.05)",color:"#f5f0e8",fontSize:13,fontFamily:"inherit"}}/><button onClick={()=>answerPreview("Yes")} style={{marginTop:8,width:"100%",padding:"10px",borderRadius:8,border:"none",background:"#d4a853",color:"#1a1714",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Next →</button></div>}
                    </div>
                  </>}
                  {prevResult==="pass"&&<div style={{textAlign:"center"}}><div style={{width:56,height:56,borderRadius:"50%",background:"rgba(74,124,89,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26,color:"#4a7c59"}}>✓</div><div style={{fontSize:18,fontWeight:700,color:"#f5f0e8",marginBottom:6}}>You Pre-Qualify!</div><div style={{fontSize:12,color:"rgba(196,168,130,.6)",marginBottom:16}}>This is where they fill out the contact form.</div><button onClick={resetPreview} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#d4a853",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Preview Again</button></div>}
                  {prevResult==="fail"&&<div style={{textAlign:"center"}}><div style={{width:56,height:56,borderRadius:"50%",background:"rgba(196,92,74,.12)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26,color:"#c45c4a"}}>✕</div><div style={{fontSize:18,fontWeight:700,color:"#f5f0e8",marginBottom:6}}>Didn't Qualify</div><div style={{fontSize:12,color:"rgba(196,168,130,.6)",marginBottom:16}}>This is what they see when they fail a question.</div><button onClick={resetPreview} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#d4a853",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Preview Again</button></div>}
                </div>
                <div style={{textAlign:"center",marginTop:10,fontSize:9,color:"rgba(196,168,130,.3)"}}>Preview only — this is how it appears on rentblackbear.com</div>
              </div>
            </div>);
          })()}
        </div>}

        {/* ── Application Fields Editor ── */}
        <div style={{marginTop:8,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,appFieldsEditor:!p.appFieldsEditor}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.appFieldsEditor?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>📝 Application Fields</div><div style={{fontSize:9,color:"#999"}}>{appFields.length} fields · Customize what tenants fill out after being invited</div></div></div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <span style={{fontSize:10,color:appFields.filter(f=>f.active).length===appFields.length?"#4a7c59":"#d4a853",fontWeight:600}}>{appFields.filter(f=>f.active).length}/{appFields.length} active</span>
              {appFields.length===0&&<button className="btn btn-gold btn-sm" onClick={e=>{e.stopPropagation();setAppFields(DEF_APP_FIELDS);}}>Load Defaults</button>}
            </div>
          </div>
          {expanded.appFieldsEditor&&<div style={{padding:16,background:"#fff"}}>
            {appFields.length===0&&<div style={{textAlign:"center",padding:24,color:"#999"}}><p style={{fontSize:12,marginBottom:8}}>No application fields configured.</p><button className="btn btn-gold" onClick={()=>setAppFields(DEF_APP_FIELDS)}>Load 13 Default Fields</button></div>}
            {(()=>{const sections=[...new Set(appFields.map(f=>f.section))];return sections.map(sec=>(
              <div key={sec} style={{marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#d4a853",textTransform:"uppercase",letterSpacing:1,marginBottom:6,paddingBottom:4,borderBottom:"1px solid rgba(212,168,83,.15)"}}>{sec}</div>
                {appFields.filter(f=>f.section===sec).map((f,fi)=>{const gi=appFields.indexOf(f);return(
                  <div key={f.id} style={{display:"flex",gap:8,alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(0,0,0,.03)",opacity:f.active?1:0.5}}>
                    <div style={{display:"flex",flexDirection:"column",gap:1}}>
                      {gi>0&&<button style={{background:"none",border:"none",cursor:"pointer",fontSize:9,color:"#999"}} onClick={()=>{const n=[...appFields];[n[gi-1],n[gi]]=[n[gi],n[gi-1]];setAppFields(n);}}>▲</button>}
                      {gi<appFields.length-1&&<button style={{background:"none",border:"none",cursor:"pointer",fontSize:9,color:"#999"}} onClick={()=>{const n=[...appFields];[n[gi],n[gi+1]]=[n[gi+1],n[gi]];setAppFields(n);}}>▼</button>}
                    </div>
                    <input value={f.label} onChange={e=>{const n=[...appFields];n[gi]={...n[gi],label:e.target.value};setAppFields(n);}} style={{flex:1,padding:"6px 10px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit"}}/>
                    <select value={f.type} onChange={e=>{const n=[...appFields];n[gi]={...n[gi],type:e.target.value};setAppFields(n);}} style={{padding:"4px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:9,fontFamily:"inherit"}}><option value="text">Text</option><option value="email">Email</option><option value="phone">Phone</option><option value="date">Date</option><option value="number">Number</option><option value="yes-no">Yes/No</option><option value="file">File Upload</option><option value="long-text">Long Text</option><option value="dropdown">Dropdown</option></select>
                    <select value={f.section} onChange={e=>{const n=[...appFields];n[gi]={...n[gi],section:e.target.value};setAppFields(n);}} style={{padding:"4px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:9,fontFamily:"inherit",width:90}}>{sections.map(s=><option key={s}>{s}</option>)}<option value="Custom">Custom</option></select>
                    <label style={{display:"flex",alignItems:"center",gap:3,fontSize:9,whiteSpace:"nowrap"}}><input type="checkbox" checked={f.required} onChange={e=>{const n=[...appFields];n[gi]={...n[gi],required:e.target.checked};setAppFields(n);}}/> Req</label>
                    <label style={{display:"flex",alignItems:"center",gap:3,fontSize:9,whiteSpace:"nowrap"}}><input type="checkbox" checked={f.active} onChange={e=>{const n=[...appFields];n[gi]={...n[gi],active:e.target.checked};setAppFields(n);}}/> On</label>
                    <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:12}} onClick={()=>setAppFields(p=>p.filter((_,j)=>j!==gi))}>✕</button>
                  </div>);})}
              </div>));})()}
            {appFields.length>0&&<div style={{display:"flex",gap:6,marginTop:10}}>
              <button className="btn btn-out" style={{flex:1}} onClick={()=>setAppFields(p=>[...p,{id:uid(),label:"New Field",type:"text",section:"Custom",required:false,active:true}])}>+ Add Field</button>
              <button className="btn btn-green" onClick={()=>{save("hq-app-fields",appFields);alert("Application fields published! The /apply page will use these fields.");}}>🚀 Save & Publish</button>
            </div>}
          </div>}
        </div>
      </>);})()}
      {tab==="maintenance"&&<>
        <div className="sec-hd"><div><h2>Maintenance Requests</h2><p>{m.openMaint} open</p></div>
          <button className="btn btn-gold" onClick={()=>setMaint(p=>[{id:uid(),roomId:"",propId:"",tenant:"",title:"New Request",desc:"",status:"open",priority:"medium",created:TODAY.toISOString().split("T")[0],photos:0},...p])}>+ New Request</button></div>
        {["open","in-progress","resolved"].map(status=>{
          const items=maint.filter(x=>x.status===status);if(items.length===0&&status==="resolved")return null;
          const labels={open:"Open","in-progress":"In Progress",resolved:"Resolved"};
          const colors={open:"b-red","in-progress":"b-gold",resolved:"b-green"};
          return(<div key={status} style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{labels[status]} ({items.length})</div>
            {items.map(req=>(
              <div key={req.id} className="row">
                <div className="row-dot" style={{background:status==="open"?"#c45c4a":status==="in-progress"?"#d4a853":"#4a7c59"}}/>
                <div className="row-i">
                  <div className="row-t">{req.title}</div>
                  <div className="row-s">{req.tenant} · {req.created}{req.photos>0?` · ${req.photos} photo${req.photos>1?"s":""}`:""}</div>
                </div>
                <span className={`badge ${colors[status]}`}>{labels[status]}</span>
                <select value={req.status} onChange={e=>setMaint(p=>p.map(x=>x.id===req.id?{...x,status:e.target.value}:x))} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:10,fontFamily:"inherit"}}>
                  <option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option>
                </select>
              </div>
            ))}
          </div>);
        })}
      </>}

      {/* ═══ DOCUMENTS ═══ */}
      {tab==="documents"&&<>
        <div className="sec-hd"><div><h2>Documents</h2><p>Leases, checklists, and templates</p></div>
          <button className="btn btn-gold">+ Upload Document</button></div>
        {["lease","rules","checklist"].map(type=>{
          const items=docs.filter(d=>d.type===type);if(!items.length)return null;
          const labels={lease:"📄 Leases & Agreements",rules:"📋 House Rules",checklist:"✅ Checklists"};
          return(<div key={type} style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{labels[type]}</div>
            {items.map(d=><div key={d.id} className="row"><span style={{fontSize:16}}>📄</span><div className="row-i"><div className="row-t">{d.name}</div><div className="row-s">{d.property} · {d.uploaded} · {d.size}</div></div><button className="btn btn-out btn-sm">View</button></div>)}
          </div>);
        })}
      </>}

      {/* ═══ ACCOUNTING ═══ */}
      {tab==="accounting"&&<>
        {(()=>{const inc=txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);const exp=txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);return(
          <div className="acct-summary">
            <div className="acct-card"><div className="kl">💰 Income</div><div className="kv kg">{fmtS(inc)}</div></div>
            <div className="acct-card"><div className="kl">💸 Expenses</div><div className="kv kb">{fmtS(exp)}</div></div>
            <div className="acct-card"><div className="kl">📊 Net</div><div className="kv" style={{color:inc-exp>=0?"#4a7c59":"#c45c4a"}}>{fmtS(inc-exp)}</div></div>
          </div>);
        })()}
        <div className="sec-hd"><div><h2>All Transactions</h2></div>
          <button className="btn btn-gold" onClick={()=>setTxns(p=>[{id:uid(),date:TODAY.toISOString().split("T")[0],type:"expense",desc:"New Expense",amount:0,propId:"p1",cat:"Other"},...p])}>+ Add Transaction</button></div>
        <div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th>Date</th><th>Description</th><th>Property</th><th>Category</th><th style={{textAlign:"right"}}>Amount</th></tr></thead><tbody>
          {txns.map(t=>{const pr=props.find(p=>p.id===t.propId);return(
            <tr key={t.id}><td>{t.date}</td><td style={{fontWeight:600}}>{t.desc}</td><td>{(pr&&pr.name)||"—"}</td><td><span className={`badge ${t.type==="income"?"b-green":"b-red"}`}>{t.cat}</span></td>
              <td style={{textAlign:"right",fontWeight:800,color:t.type==="income"?"#4a7c59":"#c45c4a"}}>{t.type==="income"?"+":"-"}{fmtS(t.amount)}</td></tr>);})}
        </tbody></table></div></div>

        {/* P&L by property */}
        <div className="sec-hd" style={{marginTop:20}}><div><h2>P&L by Property</h2></div></div>
        {props.map(p=>{const inc=txns.filter(t=>t.propId===p.id&&t.type==="income").reduce((s,t)=>s+t.amount,0);const exp=txns.filter(t=>t.propId===p.id&&t.type==="expense").reduce((s,t)=>s+t.amount,0);return(
          <div key={p.id} className="row"><div className="row-i"><div className="row-t">{p.name}</div><div className="row-s">{p.type} · {p.rooms.length} rooms</div></div>
            <div style={{display:"flex",gap:16,alignItems:"center"}}><div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999"}}>Income</div><div style={{fontWeight:800,color:"#4a7c59",fontSize:13}}>{fmtS(inc)}</div></div><div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999"}}>Expense</div><div style={{fontWeight:800,color:"#c45c4a",fontSize:13}}>{fmtS(exp)}</div></div><div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999"}}>Net</div><div style={{fontWeight:800,color:inc-exp>=0?"#4a7c59":"#c45c4a",fontSize:13}}>{fmtS(inc-exp)}</div></div></div>
          </div>);})}
      </>}

      {/* ═══ NOTIFICATIONS ═══ */}
      {tab==="notifications"&&<>
        <div className="sec-hd"><div><h2>Notifications</h2><p>{m.unreadNotifs} unread</p></div>
          <button className="btn btn-out btn-sm" onClick={()=>setNotifs(p=>p.map(x=>({...x,read:true})))}>Mark All Read</button></div>
        {notifs.map(n=>(
          <div key={n.id} className="row" style={{opacity:n.read?0.6:1,cursor:"pointer"}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>
            <span style={{fontSize:16}}>{n.type==="lease"?"📋":n.type==="payment"?"💰":n.type==="maint"?"🔧":"📝"}</span>
            <div className="row-i"><div className="row-t" style={{fontWeight:n.read?500:700}}>{n.msg}</div><div className="row-s">{n.date}</div></div>
            {!n.read&&<div className="notif-dot"/>}{n.urgent&&<span className="badge b-red">Urgent</span>}
          </div>
        ))}
      </>}

      {/* ═══ SCORECARD ═══ */}
      {tab==="scorecard"&&<>
        <div className="kgrid">
          <div className={`kpi ${drill==="sc-occ"?"active":""}`} onClick={()=>setDrill(drill==="sc-occ"?null:"sc-occ")}><div className="kl">🏠 Occupancy</div><div className="kv" style={{color:m.occRate>=90?"#4a7c59":"#c45c4a"}}>{m.occRate}%</div><div className="ks">{m.occ}/{m.total} rooms</div></div>
          <div className={`kpi ${drill==="sc-coll"?"active":""}`} onClick={()=>setDrill(drill==="sc-coll"?null:"sc-coll")}><div className="kl">💰 Collection</div><div className="kv" style={{color:m.collRate>=90?"#4a7c59":"#c45c4a"}}>{m.collRate}%</div><div className="ks">{fmtS(m.coll)} / {fmtS(m.due)}</div></div>
          <div className={`kpi ${drill==="sc-vac"?"active":""}`} onClick={()=>setDrill(drill==="sc-vac"?null:"sc-vac")}><div className="kl">💸 Vacancy</div><div className="kv" style={{color:m.lost>0?"#c45c4a":"#4a7c59"}}>{fmtS(m.lost)}</div><div className="ks">/month lost</div></div>
          <div className={`kpi ${drill==="sc-proj"?"active":""}`} onClick={()=>setDrill(drill==="sc-proj"?null:"sc-proj")}><div className="kl">📈 Projected</div><div className="kv">{fmtS(m.proj)}</div><div className="ks">of {fmtS(m.full)}</div></div>
        </div>

        {/* Drill: Occupancy */}
        {drill==="sc-occ"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Occupancy: {m.occ}/{m.total}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.propBreakdown.map(pr=>{const pct=pr.occCount/(pr.occCount+pr.vacCount)*100;return(<div key={pr.id} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontWeight:700,fontSize:13}}>{pr.name} <span style={{fontSize:11,color:"#999"}}>{pr.type}</span></div><span className={`badge ${pr.vacCount?"b-red":"b-green"}`}>{pr.occCount}/{pr.rooms.length} · {Math.round(pct)}%</span></div>
            <div style={{height:5,borderRadius:3,background:"#e5e3df",marginBottom:6}}><div style={{height:"100%",borderRadius:3,background:pct>=100?"#4a7c59":pct>=75?"#d4a853":"#c45c4a",width:`${pct}%`}}/></div>
            {pr.rooms.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2,cursor:r.tenant?"pointer":"default"}} onClick={()=>{if(r.tenant)setModal({type:"tenant",data:{...r,propName:pr.name,propUtils:pr.utils,propClean:pr.clean}});}}><div className="row-dot" style={{background:r.st==="vacant"?"#c45c4a":"#4a7c59"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:r.tenant?"#999":"#c45c4a"}}>{(r.tenant&&r.tenant.name)||"Vacant"}{r.tenant&&<span style={{color:"#c4a882",marginLeft:4}}>→ view</span>}</div></div><div style={{fontSize:12,fontWeight:700}}>{fmtS(r.rent)}</div></div>)}
          </div>);})}
        </div></div>}

        {/* Drill: Collection */}
        {drill==="sc-coll"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Collection: {fmtS(m.coll)} / {fmtS(m.due)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.unpaid.length>0&&<><div style={{fontSize:9,fontWeight:700,color:"#c45c4a",marginBottom:6}}>UNPAID ({m.unpaid.length})</div>{m.unpaid.map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div className="row-s">{r.propName} · {r.name}</div></div><div className="row-v kb">{fmtS(r.rent)}</div><button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();openPayForm(r.id);}}>Pay</button></div>)}</>}
          {m.paid.length>0&&<><div style={{fontSize:9,fontWeight:700,color:"#4a7c59",margin:"10px 0 6px"}}>PAID ({m.paid.length})</div>{m.paid.map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#4a7c59"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div className="row-s">{r.propName}</div></div><div className="row-v kg">{fmtS(r.paidAmt)}</div></div>)}</>}
          <div style={{marginTop:12,padding:14,background:"rgba(0,0,0,.02)",borderRadius:10}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:13}}><span>Total Due</span><strong>{fmtS(m.due)}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:13}}><span>Collected</span><strong style={{color:"#4a7c59"}}>{fmtS(m.coll)}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13}}><span>Outstanding</span><strong style={{color:m.due-m.coll>0?"#c45c4a":"#4a7c59"}}>{fmtS(m.due-m.coll)}</strong></div>
          </div>
        </div></div>}

        {/* Drill: Vacancy */}
        {drill==="sc-vac"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Vacancy: {fmtS(m.lost)}/mo lost</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.vacs.length===0?<div style={{textAlign:"center",padding:20,color:"#4a7c59"}}>🎉 Fully occupied!</div>:
            m.vacs.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.name}</div><div className="row-s">{r.propName} · {r.pb?"Private":"Shared"}</div></div><div className="row-v kb">{fmtS(r.rent)}<div style={{fontSize:8,color:"#999"}}>lost/mo</div></div></div>)}
          <div style={{marginTop:10,padding:12,background:"rgba(196,92,74,.03)",borderRadius:8,fontSize:12}}><strong>Annual loss:</strong> {fmtS(m.lost*12)}</div>
        </div></div>}

        {/* Drill: Projected */}
        {drill==="sc-proj"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Projected: {fmtS(m.proj)} / {fmtS(m.full)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.propBreakdown.map(pr=><div key={pr.id} className="row"><div className="row-i"><div className="row-t">{pr.name}</div><div className="row-s">{pr.occCount} occupied · {pr.vacCount} vacant</div></div><div style={{display:"flex",gap:12,alignItems:"baseline"}}><span style={{fontSize:11,color:"#999"}}>Full: {fmtS(pr.fullOcc)}</span><span style={{fontSize:16,fontWeight:800,color:pr.projected===pr.fullOcc?"#4a7c59":"inherit"}}>{fmtS(pr.projected)}</span>{pr.vacCount>0&&<span style={{fontSize:11,fontWeight:700,color:"#c45c4a"}}>-{fmtS(pr.fullOcc-pr.projected)}</span>}</div></div>)}
        </div></div>}

        {/* Charts */}
        <div className="card" style={{marginBottom:14}}>
          <div className="card-hd" onClick={()=>setShowCharts(!showCharts)}><h3>📈 Visual Trends</h3><span style={{fontSize:11,color:"#999"}}>{showCharts?"▾ Collapse":"▸ Expand"}</span></div>
          {showCharts&&<div className="card-bd">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div><div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Revenue by Property</div>
                <ResponsiveContainer width="100%" height={180}><BarChart data={m.propBreakdown.map(p=>({name:p.name.split(" ").slice(0,2).join(" "),Projected:p.projected,Lost:p.fullOcc-p.projected}))}>
                  <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`$${v/1000}k`}/><Tooltip formatter={v=>`$${v.toLocaleString()}`}/>
                  <Bar dataKey="Projected" fill="#4a7c59" radius={[3,3,0,0]}/><Bar dataKey="Lost" fill="#c45c4a" radius={[3,3,0,0]}/>
                </BarChart></ResponsiveContainer></div>
              <div><div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Occupancy</div>
                <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={[{name:"Occupied",value:m.occ},{name:"Vacant",value:m.total-m.occ}]} cx="50%" cy="50%" outerRadius={60} innerRadius={38} paddingAngle={3} dataKey="value"><Cell fill="#4a7c59"/><Cell fill="#c45c4a"/></Pie><Tooltip/></PieChart></ResponsiveContainer>
                <div style={{textAlign:"center",marginTop:-6}}><span style={{fontSize:10,color:"#4a7c59",fontWeight:700,marginRight:10}}>● {m.occ} Occupied</span><span style={{fontSize:10,color:"#c45c4a",fontWeight:700}}>● {m.total-m.occ} Vacant</span></div></div>
            </div>
            <div style={{marginTop:16}}><div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Weekly Trend</div>
              <ResponsiveContainer width="100%" height={160}><LineChart data={scRows.map(w=>({week:w.label,"Occupancy Rate":w.occ,"Collection Rate":w.coll,"New Leads":w.leads}))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="week" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Legend wrapperStyle={{fontSize:10}}/>
                <Line type="monotone" dataKey="Occupancy Rate" stroke="#4a7c59" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="Collection Rate" stroke="#3b82f6" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="New Leads" stroke="#d4a853" strokeWidth={2} dot={{r:3}}/>
              </LineChart></ResponsiveContainer></div>
          </div>}
        </div>

        {/* Monthly Comparison */}
        <div className="card" style={{marginBottom:14}}>
          <div className="card-hd"><h3>📅 Monthly Comparison</h3><span style={{fontSize:10,color:"#999"}}>{allMonths.length} month{allMonths.length!==1?"s":""} of data</span></div>
          <div className="card-bd">
            {/* Side-by-side cards: This Month vs Last Month vs 2 Months Ago */}
            <div style={{display:"grid",gridTemplateColumns:`repeat(${twoMonthsAgo?3:prevMonth?2:1},1fr)`,gap:12,marginBottom:16}}>
              {/* Current Month */}
              <div style={{background:"rgba(212,168,83,.04)",borderRadius:10,padding:14,border:"2px solid rgba(212,168,83,.15)"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#d4a853",marginBottom:8}}>{liveMonth.label} (Current)</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Occupancy</span><strong style={{color:liveMonth.occ>=90?"#4a7c59":"#c45c4a"}}>{liveMonth.occ}%</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Collection</span><strong style={{color:liveMonth.collRate>=90?"#4a7c59":"#c45c4a"}}>{liveMonth.collRate}%</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Vacancy Cost</span><strong style={{color:liveMonth.vacancy>0?"#c45c4a":"#4a7c59"}}>{fmtS(liveMonth.vacancy)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Collected</span><strong style={{color:"#4a7c59"}}>{fmtS(liveMonth.collected)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Projected</span><strong>{fmtS(liveMonth.projected)}</strong></div>
                </div>
              </div>
              {/* Previous Month */}
              {prevMonth&&<div style={{background:"rgba(0,0,0,.02)",borderRadius:10,padding:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:8}}>{prevMonth.label}</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  {[["Occupancy",prevMonth.occ,liveMonth.occ,"%"],["Collection",prevMonth.collRate,liveMonth.collRate,"%"],["Vacancy Cost",prevMonth.vacancy,liveMonth.vacancy,"$",true],["Collected",prevMonth.collected,liveMonth.collected,"$"],["Projected",prevMonth.projected,liveMonth.projected,"$"]].map(([label,prev,curr,unit,inverse])=>{
                    const diff=unit==="$"?curr-prev:curr-prev;const better=inverse?diff<=0:diff>=0;
                    return(<div key={label} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>{label}</span><div><strong>{unit==="$"?fmtS(prev):`${prev}${unit}`}</strong>{diff!==0&&<span style={{fontSize:9,marginLeft:4,color:better?"#4a7c59":"#c45c4a"}}>{diff>0?"+":""}{unit==="$"?fmtS(diff):`${diff}${unit}`}</span>}</div></div>);
                  })}
                </div>
              </div>}
              {/* 2 Months Ago */}
              {twoMonthsAgo&&<div style={{background:"rgba(0,0,0,.02)",borderRadius:10,padding:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:8}}>{twoMonthsAgo.label}</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  {[["Occupancy",twoMonthsAgo.occ,"%"],["Collection",twoMonthsAgo.collRate,"%"],["Vacancy Cost",twoMonthsAgo.vacancy,"$"],["Collected",twoMonthsAgo.collected,"$"],["Projected",twoMonthsAgo.projected,"$"]].map(([label,val,unit])=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>{label}</span><strong>{unit==="$"?fmtS(val):`${val}${unit}`}</strong></div>
                  ))}
                </div>
              </div>}
            </div>
            {!prevMonth&&<div style={{textAlign:"center",padding:12,color:"#999",fontSize:11}}>Monthly comparison will appear after your first month-end snapshot. Snapshots are taken automatically on the last day of each month.</div>}

            {/* Monthly trend chart */}
            {allMonths.length>1&&<>
              <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Monthly Trends</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <div style={{fontSize:9,color:"#999",marginBottom:4}}>Occupancy & Collection %</div>
                  <ResponsiveContainer width="100%" height={160}><LineChart data={allMonths.map(mo=>({month:((mo.label||"").split(" ")[0]||"").slice(0,3)||mo.month,Occupancy:mo.occ,Collection:mo.collRate}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="month" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}} domain={[0,100]}/><Tooltip formatter={v=>`${v}%`}/>
                    <Line type="monotone" dataKey="Occupancy" stroke="#4a7c59" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="Collection" stroke="#3b82f6" strokeWidth={2} dot={{r:3}}/>
                  </LineChart></ResponsiveContainer>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#999",marginBottom:4}}>Revenue</div>
                  <ResponsiveContainer width="100%" height={160}><BarChart data={allMonths.map(mo=>({month:((mo.label||"").split(" ")[0]||"").slice(0,3)||mo.month,Collected:mo.collected,Vacancy:mo.vacancy}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="month" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/><Tooltip formatter={v=>fmtS(v)}/>
                    <Bar dataKey="Collected" fill="#4a7c59" radius={[3,3,0,0]}/><Bar dataKey="Vacancy" fill="#c45c4a" radius={[3,3,0,0]}/>
                  </BarChart></ResponsiveContainer>
                </div>
              </div>
            </>}
          </div>
        </div>

        {/* Weekly table */}
        <div className="sec-hd"><div><h2>Weekly Scorecard</h2><p>Auto-calculated from real data. Click any row for details.</p></div></div>
        <div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th>Measurable</th><th>Goal</th>{scRows.map((w,i)=><th key={i} style={{textAlign:"center"}}>{w.label}{w.weekNum===CUR_WEEK?" ●":""}</th>)}</tr></thead><tbody>
          {scMeasurables.map((s)=>(
            <tr key={s.id} style={{cursor:"pointer"}} onClick={()=>setScDrill(scDrill===s.id?null:s.id)}>
              <td style={{fontWeight:700}}>{s.label} <span style={{fontSize:9,color:"#c4a882"}}>{scDrill===s.id?"▾":"▸"}</span></td>
              <td style={{color:"#999"}}>{s.unit==="$"?fmtS(s.goal):s.goal}{s.unit==="%"?"%":""}</td>
              {scRows.map((w,i)=>{const v=w[s.key]||0;const isGood=s.goodFn(v,s.goal);const isCurrent=w.weekNum===CUR_WEEK;return(
                <td key={i} style={{textAlign:"center"}}><span style={{display:"inline-block",padding:"3px 10px",borderRadius:100,fontWeight:700,fontSize:12,background:isGood?"rgba(74,124,89,.08)":"rgba(196,92,74,.08)",color:isGood?"#4a7c59":"#c45c4a",border:isCurrent?"2px solid rgba(212,168,83,.3)":"none"}}>{s.unit==="$"?fmtS(v):v}{s.unit==="%"?"%":""}</span></td>);})}
            </tr>))}
        </tbody></table></div></div>
        {scRows.length<=1&&<div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,marginTop:8,fontSize:12,color:"#5c4a3a"}}>📊 Historical data will build up automatically each week. The current column (●) is calculated live from your actual property and payment data.</div>}

        {/* Scorecard row drill-down */}
        {scDrill&&<div className="card" style={{animation:"fadeIn .2s",marginBottom:14}}><div className="card-bd">
          <div className="sec-hd"><div><h2>{(scorecard.find(s=>s.id===scDrill)||{}).label}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setScDrill(null)}>✕</button></div>

          {scDrill==="occ"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Occupancy = occupied rooms / total rooms. Goal: 100%. Currently <strong>{m.occRate}%</strong> ({m.occ}/{m.total}).</p>
            {m.vacs.length>0?<>{m.vacs.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:"#c45c4a"}}>Vacant at {r.propName} — {fmtS(r.rent)}/mo lost</div></div></div>)}
              <div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>Action: Fill {m.vacs.length} vacant room{m.vacs.length>1?"s":""} to hit 100%</div></>
            :<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>🎉 At 100% — all rooms filled!</div>}
          </div>}

          {scDrill==="coll"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Collection = rent collected / rent due. Goal: 100%. Currently <strong>{m.collRate}%</strong>.</p>
            {m.unpaid.length>0?<>{m.unpaid.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2,cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div style={{fontSize:9,color:"#c45c4a"}}>{r.propName} · {r.name} · {fmtS(r.rent)} unpaid</div></div></div>)}
              <div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>Outstanding: {fmtS(m.due-m.coll)} from {m.unpaid.length} tenant{m.unpaid.length>1?"s":""}</div></>
            :<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>✓ All rent collected for {MO}!</div>}
          </div>}

          {scDrill==="vacancy"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Vacancy cost = total rent from empty rooms. Goal: $0. Currently <strong>{fmtS(m.lost)}</strong>/month across {m.vacs.length} room{m.vacs.length!==1?"s":""}.</p>
            {m.vacs.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:"#999"}}>{r.propName} · {r.pb?"Private":"Shared"} bath</div></div><div style={{fontSize:12,fontWeight:700,color:"#c45c4a"}}>{fmtS(r.rent)}</div></div>)}
            {m.vacs.length>0&&<div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>That's {fmtS(m.lost*12)}/year in lost revenue.</div>}
            {m.vacs.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>🎉 No vacancies! $0 lost.</div>}
          </div>}

          {scDrill==="leads"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>New leads = prospective tenants who contacted you or started the pre-screen. Goal: 5+/week.</p>
            <div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:12,color:"#9a7422"}}><strong>Note:</strong> Leads aren't automatically tracked yet. This will auto-populate once the pre-screen form and AI chat are connected to the admin system. For now, this shows 0.</div>
            <div style={{fontSize:12,color:"#5c4a3a",marginTop:10,fontWeight:600}}>Tip: If leads are low, post on Facebook Marketplace, Craigslist, or local college housing boards.</div>
          </div>}
        </div></div>}
        {m.expiring.length>0&&<><div className="sec-hd" style={{marginTop:16}}><div><h2>⚠️ Leases Expiring</h2></div></div>
          {m.expiring.sort((a,b)=>a.daysLeft-b.daysLeft).map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setTab("tenants");setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).clean}});}}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{r.propName} · {r.name} · {r.daysLeft} days</div></div><span className="badge" style={{background:r.daysLeft<=30?"rgba(196,92,74,.08)":"rgba(212,168,83,.1)",color:r.daysLeft<=30?"#c45c4a":"#9a7422"}}>{r.daysLeft}d</span></div>)}</>}
      </>}

      {/* ═══ ROCKS ═══ */}
      {tab==="rocks"&&<>
        <div className="sec-hd"><div><h2>Quarterly Rocks</h2><p>Click dot to cycle status</p></div>
          <button className="btn btn-gold" onClick={()=>setRocks(p=>[{id:uid(),title:"New Rock",owner:"Harrison",status:"not-started",due:"2026-06-30",notes:""},...p])}>+ Add</button></div>
        {rocks.map(r=>(
          <div key={r.id} className="row">
            <div style={{width:10,height:10,borderRadius:"50%",cursor:"pointer",flexShrink:0,background:r.status==="on-track"||r.status==="done"?"#4a7c59":r.status==="off-track"?"#c45c4a":"#ccc"}} onClick={()=>cycleRock(r.id)}/>
            <div className="row-i">
              <div className="row-t" contentEditable suppressContentEditableWarning onBlur={e=>setRocks(p=>p.map(x=>x.id===r.id?{...x,title:e.target.textContent}:x))}>{r.title}</div>
              <div className="row-s">{r.owner} · {r.status.replace("-"," ")} · Due {r.due}</div>
            </div>
            <span className={`badge ${r.status==="on-track"||r.status==="done"?"b-green":r.status==="off-track"?"b-red":"b-gray"}`}>{r.status.replace("-"," ")}</span>
            <button className="btn btn-red btn-sm" onClick={()=>setRocks(p=>p.filter(x=>x.id!==r.id))}>✕</button>
          </div>
        ))}
      </>}

      {/* ═══ ISSUES ═══ */}
      {tab==="issues"&&<>
        <div className="sec-hd"><div><h2>Issues List (IDS)</h2><p>Identify, Discuss, Solve. Click priority to cycle.</p></div>
          <button className="btn btn-gold" onClick={()=>setIssues(p=>[{id:uid(),title:"New issue",priority:"medium",created:TODAY.toISOString().split("T")[0]},...p])}>+ Add</button></div>
        {issues.map(i=>(
          <div key={i.id} className="row">
            <span style={{cursor:"pointer",fontSize:14}} onClick={()=>setIssues(p=>p.map(x=>x.id===i.id?{...x,priority:x.priority==="high"?"medium":x.priority==="medium"?"low":"high"}:x))}>{i.priority==="high"?"🔴":i.priority==="medium"?"🟡":"🟢"}</span>
            <div className="row-i"><div className="row-t" contentEditable suppressContentEditableWarning onBlur={e=>setIssues(p=>p.map(x=>x.id===i.id?{...x,title:e.target.textContent}:x))}>{i.title}</div><div className="row-s">{i.created}</div></div>
            <button className="btn btn-green btn-sm" onClick={()=>setIssues(p=>p.filter(x=>x.id!==i.id))}>✓ Solved</button>
          </div>
        ))}
      </>}

      {/* ═══ PROPERTIES EDITOR ═══ */}
      {tab==="properties"&&<>
        <div className="sec-hd"><div><h2>Manage Properties</h2><p>Click any property for details, or edit to manage rooms</p></div>
          <button className="btn btn-gold" onClick={()=>{setIsNewProp(true);setEditProp({});}}>+ Add Property</button></div>
        {props.map(p=>{const pr=p.rooms.map(r=>r.rent);const vac=p.rooms.filter(r=>r.st==="vacant").length;const occRooms=p.rooms.filter(r=>r.st==="occupied");const isExp=expanded["prop-"+p.id];
          const totalRent=p.rooms.reduce((s,r)=>s+r.rent,0);const projRent=occRooms.reduce((s,r)=>s+r.rent,0);
          return(
          <div key={p.id} className="card" style={{marginBottom:10}}>
            <div className="card-hd" onClick={()=>setExpanded(x=>({...x,["prop-"+p.id]:!x["prop-"+p.id]}))}>
              <div>
                <h3>{isExp?"▾":"▸"} {p.name}</h3>
                <div style={{fontSize:10,color:"#999",marginTop:2}}>{p.addr} · {p.type} · {p.rooms.length} rooms · {p.baths} bath · {p.utils==="allIncluded"?"All Utils":"$100 Cap"} · {p.clean} · {(p.rentalMode||"byRoom")==="byRoom"?"By Bedroom":"Whole House"}</div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {pr.length>0&&<span style={{fontWeight:800,marginRight:8}}>{fmtS(Math.min(...pr))}–{fmtS(Math.max(...pr))}</span>}
                {vac>0&&<span className="badge b-red">{vac} Vacant</span>}
                {vac===0&&<span className="badge b-green">Full</span>}
                <button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setIsNewProp(false);setEditProp(p);}}>✏️ Edit</button>
                <button className="btn btn-red btn-sm" onClick={e=>{e.stopPropagation();if(occRooms.length){alert("Cannot delete — property has occupied rooms. Remove all tenants first.");}else{setProps(prev=>prev.filter(x=>x.id!==p.id));}}}>✕</button>
              </div>
            </div>
            {isExp&&<div className="card-bd" style={{animation:"fadeIn .15s"}}>
              {/* Property summary */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                <div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Rooms</div><div style={{fontSize:18,fontWeight:800}}>{p.rooms.length}</div></div>
                <div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Occupied</div><div style={{fontSize:18,fontWeight:800,color:"#4a7c59"}}>{occRooms.length}</div></div>
                <div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Projected</div><div style={{fontSize:18,fontWeight:800}}>{fmtS(projRent)}<small style={{fontSize:9,color:"#999"}}>/mo</small></div></div>
                <div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>At Full</div><div style={{fontSize:18,fontWeight:800}}>{fmtS(totalRent)}<small style={{fontSize:9,color:"#999"}}>/mo</small></div></div>
              </div>
              {/* Room list */}
              <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Rooms</div>
              {p.rooms.map(r=>{const occ=r.st==="occupied"&&r.tenant;const pd=(payments[r.id]&&payments[r.id][MO])||0;const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;
                return(<div key={r.id} className="row" style={{cursor:occ?"pointer":"default",padding:"8px 12px",marginBottom:3}} onClick={()=>{if(occ)setModal({type:"tenant",data:{...r,propName:p.name,propUtils:p.utils,propClean:p.clean}});}}>
                  <div className="row-dot" style={{background:occ?"#4a7c59":"#c45c4a"}}/>
                  <div className="row-i">
                    <div style={{fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                      {r.name}
                      <span className={`badge ${r.pb?"b-green":"b-gray"}`} style={{fontSize:7}}>{r.pb?"Private":"Shared"}</span>
                      {r.sqft&&<span style={{fontSize:9,color:"#999"}}>{r.sqft} sqft</span>}
                    </div>
                    {occ?<div style={{fontSize:10,color:"#999"}}>{r.tenant.name} · Lease thru {fmtD(r.le)} <span style={{color:"#c4a882"}}>→ click for profile</span></div>
                      :<div style={{fontSize:10,color:"#c45c4a",fontWeight:600}}>Vacant — {fmtS(r.rent)}/mo lost</div>}
                    {dl!==null&&dl<=90&&<div style={{fontSize:9,color:dl<=30?"#c45c4a":"#d4a853",fontWeight:600}}>⚠ Lease expires in {dl} days</div>}
                  </div>
                  <div style={{textAlign:"right",minWidth:70}}>
                    <div style={{fontSize:14,fontWeight:800}}>{fmtS(r.rent)}</div>
                    {occ&&<div style={{fontSize:9,color:pd?"#4a7c59":"#c45c4a",fontWeight:600}}>{pd?"✓ Paid":"✕ Unpaid"}</div>}
                  </div>
                </div>);})}
            </div>}
          </div>);})}
        {props.length===0&&<div style={{textAlign:"center",padding:40,color:"#999"}}><div style={{fontSize:40,marginBottom:8}}>🏠</div><h3 style={{fontSize:15}}>No Properties</h3><p style={{fontSize:12,marginTop:4}}>Add your first property above.</p></div>}
      </>}

      {/* ═══ SITE SETTINGS ═══ */}
      {tab==="site-settings"&&<>
        <div className="sec-hd"><div><h2>Site Settings</h2><p>Edit company info and hero copy</p></div></div>
        <div className="card"><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:12}}>Company Info</h3>
          <div className="fr"><div className="fld"><label>Company Name</label><input value={settings.companyName} onChange={e=>setSettings({...settings,companyName:e.target.value})}/></div><div className="fld"><label>Legal Entity</label><input value={settings.legalName} onChange={e=>setSettings({...settings,legalName:e.target.value})}/></div></div>
          <div className="fr3"><div className="fld"><label>Phone</label><input value={settings.phone} onChange={e=>setSettings({...settings,phone:e.target.value})}/></div><div className="fld"><label>Email</label><input value={settings.email} onChange={e=>setSettings({...settings,email:e.target.value})}/></div><div className="fld"><label>City</label><input value={settings.city} onChange={e=>setSettings({...settings,city:e.target.value})}/></div></div>
        </div></div>
        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:12}}>Hero Section</h3>
          <div className="fld"><label>Tagline</label><input value={settings.tagline} onChange={e=>setSettings({...settings,tagline:e.target.value})}/></div>
          <div className="fr"><div className="fld"><label>Headline</label><input value={settings.heroHeadline} onChange={e=>setSettings({...settings,heroHeadline:e.target.value})}/></div><div className="fld"><label>Subline</label><input value={settings.heroSubline} onChange={e=>setSettings({...settings,heroSubline:e.target.value})}/></div></div>
          <div className="fld"><label>Description</label><textarea value={settings.heroDesc} onChange={e=>setSettings({...settings,heroDesc:e.target.value})}/></div>
        </div></div>
      </>}

      {/* ═══ THEME EDITOR ═══ */}
      {tab==="theme"&&(()=>{
        const saveCurrentTheme=()=>setModal({type:"saveTheme",themeName:""});
        const applyTheme=(t)=>setTheme({...t});
        const deleteTheme=(id)=>setSavedThemes(p=>p.filter(x=>x.id!==id));
        const pushToSite=()=>{alert("Theme pushed to live site! (In production this updates the public site CSS variables in real-time via Supabase.)");};
        const exportTheme=()=>{const css=Object.entries(theme).map(([k,v])=>`  --${k}: ${v};`).join("\n");const json=JSON.stringify(theme,null,2);const blob=new Blob([`:root {\n${css}\n}\n\n/* JSON */\n${json}`],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="blackbear-theme.css";a.click();URL.revokeObjectURL(url);};
        return(<>
        <div className="sec-hd"><div><h2>Theme Editor</h2><p>Edit, save, and push color schemes to your live site</p></div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn btn-green" onClick={pushToSite}>🚀 Push to Site</button>
            <button className="btn btn-gold" onClick={saveCurrentTheme}>💾 Save Theme</button>
            <button className="btn btn-out" onClick={exportTheme}>📥 Export CSS</button>
            <button className="btn btn-out" onClick={()=>setTheme(randPalette())}>🎲 Random</button>
          </div></div>

        {/* Presets + Saved Themes */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Presets</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {Object.entries(PRESETS).map(([n,c])=><button key={n} className="btn btn-out btn-sm" onClick={()=>applyTheme(c)}><span style={{width:10,height:10,borderRadius:"50%",background:c.accent,display:"inline-block"}}/> {n}</button>)}
          </div>
          {savedThemes.length>0&&<>
            <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Your Saved Themes</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {savedThemes.map(st=>(
                <div key={st.id} style={{display:"flex",alignItems:"center",gap:0,border:"1px solid rgba(0,0,0,.06)",borderRadius:6,overflow:"hidden"}}>
                  <button className="btn btn-out btn-sm" style={{borderRadius:0,border:"none"}} onClick={()=>applyTheme(st.colors)}>
                    <div style={{display:"flex",gap:2}}>{[st.colors.bg,st.colors.accent,st.colors.green,st.colors.text].map((c,i)=><span key={i} style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>)}</div>
                    <span style={{marginLeft:4}}>{st.name}</span>
                  </button>
                  <button style={{background:"none",border:"none",borderLeft:"1px solid rgba(0,0,0,.06)",padding:"4px 8px",cursor:"pointer",color:"#c45c4a",fontSize:10}} onClick={()=>deleteTheme(st.id)}>✕</button>
                </div>
              ))}
            </div>
          </>}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}}>
          <div style={{background:"#fff",borderRadius:12,padding:18,border:"1px solid rgba(0,0,0,.03)"}}>
            <h3 style={{fontSize:13,fontWeight:800,marginBottom:14}}>Colors</h3>
            {Object.entries(THEME_LABELS).map(([k,label])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:28,height:28,borderRadius:6,background:theme[k],border:"1px solid rgba(0,0,0,.1)",cursor:"pointer",position:"relative",overflow:"hidden",flexShrink:0}}><input type="color" value={theme[k]} onChange={e=>setTheme({...theme,[k]:e.target.value})} style={{position:"absolute",inset:-4,width:"calc(100% + 8px)",height:"calc(100% + 8px)",opacity:0,cursor:"pointer"}}/></div>
              <span style={{fontSize:11,fontWeight:600,flex:1}}>{label}</span>
              <input value={theme[k]} onChange={e=>{if(/^#[0-9a-fA-F]{6}$/.test(e.target.value))setTheme({...theme,[k]:e.target.value});}} style={{width:80,padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"monospace"}}/>
            </div>))}
          </div>
          <div style={{position:"sticky",top:80}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#999",marginBottom:8}}>Live Preview</div>
            <div style={{borderRadius:12,overflow:"hidden",border:"1px solid rgba(0,0,0,.06)",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
              <div style={{background:theme.bg,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:theme.text,fontWeight:700,fontSize:11}}>🐻 BB <span style={{color:theme.accent}}>Rentals</span></span><div style={{background:theme.accent,color:contrast(theme.accent),padding:"3px 8px",borderRadius:4,fontSize:8,fontWeight:700}}>Apply</div></div>
              <div style={{background:`linear-gradient(135deg,${theme.bg},${theme.card})`,padding:"18px 12px",textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",fontSize:16,color:theme.text}}>Your Room Is Ready.</div><div style={{fontFamily:"Georgia,serif",fontSize:16,color:theme.accent,fontStyle:"italic"}}>Everything's Included.</div><div style={{fontSize:9,color:theme.muted,marginTop:6}}>Furnished rooms from $600/mo</div></div>
              <div style={{background:theme.surface,padding:10}}>
                <div style={{background:"#fff",borderRadius:5,padding:6,border:"1px solid rgba(0,0,0,.04)",marginBottom:4}}>
                  <div style={{display:"flex",gap:3,marginBottom:3}}><span style={{background:`${theme.green}18`,color:theme.green,padding:"1px 5px",borderRadius:100,fontSize:6,fontWeight:700}}>Available</span></div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:10,color:theme.dark}}>The Holmes House</div>
                  <div style={{fontSize:7,color:theme.warm}}>$600–$850/mo</div>
                </div>
              </div>
              <div style={{background:theme.card,padding:"10px 12px",textAlign:"center"}}><div style={{background:theme.accent,color:contrast(theme.accent),padding:"5px 14px",borderRadius:5,fontSize:9,fontWeight:700,display:"inline-block"}}>Apply Now</div></div>
            </div>
            <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
              <div style={{background:theme.accent,color:contrast(theme.accent),padding:"5px 12px",borderRadius:5,fontSize:10,fontWeight:700}}>Button</div>
              <div style={{background:theme.green,color:"#fff",padding:"5px 12px",borderRadius:5,fontSize:10,fontWeight:700}}>Available</div>
              <div style={{background:theme.bg,color:theme.text,padding:"5px 12px",borderRadius:5,fontSize:10,fontWeight:700}}>Dark</div>
              <div style={{background:theme.surface,color:theme.dark,padding:"5px 12px",borderRadius:5,fontSize:10,fontWeight:700,border:"1px solid rgba(0,0,0,.06)"}}>Light</div>
            </div>
            <div style={{marginTop:16,background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:11,color:"#5c4a3a"}}>
              <strong>💡 Tip:</strong> Click "Push to Site" to update your live public site with the current colors. Save themes you like so you can switch between them later.
            </div>
          </div>
        </div>
      </>);})()}

      {/* ═══ IDEA BOARD ═══ */}
      {tab==="ideas"&&(()=>{
        const cats=[...new Set(ideas.map(i=>i.cat))];
        const statuses=["Idea","Planned","Building","Done"];
        const priColors={high:"🔴",medium:"🟡",low:"🟢"};
        const stColors={Idea:"b-gray",Planned:"b-blue",Building:"b-gold",Done:"b-green"};
        const addIdeaToCat=(cat)=>setModal({type:"newIdea",cat,title:"",priority:"medium",status:"Idea"});
        const updIdea=(id,f,v)=>setIdeas(p=>p.map(x=>x.id===id?{...x,[f]:v}:x));
        const delIdea=id=>setIdeas(p=>p.filter(x=>x.id!==id));
        const done=ideas.filter(i=>i.status==="Done").length;
        const building=ideas.filter(i=>i.status==="Building").length;
        const planned=ideas.filter(i=>i.status==="Planned").length;
        const filtered=ideaFilter==="all"?ideas:ideaFilter==="high"||ideaFilter==="medium"||ideaFilter==="low"?ideas.filter(i=>i.priority===ideaFilter):ideas.filter(i=>i.status===ideaFilter);

        const IdeaRow=({i})=>(<div key={i.id} className="row">
          <span style={{cursor:"pointer"}} onClick={()=>updIdea(i.id,"priority",i.priority==="high"?"medium":i.priority==="medium"?"low":"high")}>{priColors[i.priority]}</span>
          <div className="row-i"><div className="row-t" contentEditable suppressContentEditableWarning onBlur={e=>updIdea(i.id,"title",e.target.textContent)}>{i.title}</div><div className="row-s">{i.cat}</div></div>
          <select value={i.cat} onChange={e=>updIdea(i.id,"cat",e.target.value)} style={{padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:9,fontFamily:"inherit"}}>{cats.map(c=><option key={c}>{c}</option>)}</select>
          <select value={i.status} onChange={e=>updIdea(i.id,"status",e.target.value)} style={{padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:9,fontFamily:"inherit"}}>{statuses.map(s=><option key={s}>{s}</option>)}</select>
          <span className={`badge ${stColors[i.status]}`}>{i.status}</span>
          <button className="btn btn-red btn-sm" onClick={()=>delIdea(i.id)}>✕</button>
        </div>);

        return(<>
          <div className="kgrid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
            <div className="kpi"><div className="kl">Total</div><div className="kv">{ideas.length}</div></div>
            <div className="kpi"><div className="kl">✓ Done</div><div className="kv kg">{done}</div></div>
            <div className="kpi"><div className="kl">⚡ Building</div><div className="kv kw">{building}</div></div>
            <div className="kpi"><div className="kl">📋 Planned</div><div className="kv">{planned}</div></div>
          </div>

          <div className="sec-hd">
            <div style={{display:"flex",gap:4}}>
              {["board","list","status"].map(v=><button key={v} className={`btn ${ideaView===v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setIdeaView(v)}>{v==="board"?"📋 Board":v==="list"?"📝 List":"📊 Status"}</button>)}
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <select value={ideaFilter} onChange={e=>setIdeaFilter(e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}>
                <option value="all">All</option><optgroup label="Status">{statuses.map(s=><option key={s} value={s}>{s}</option>)}</optgroup><optgroup label="Priority"><option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option></optgroup>
              </select>
              <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"newIdea",cat:cats[0]||"General",title:"",priority:"medium",status:"Idea"})}>+ New Idea</button>
              {!showNewCat?<button className="btn btn-out btn-sm" onClick={()=>setShowNewCat(true)}>+ Category</button>
              :<div style={{display:"flex",gap:3}}><input value={newCatInput} onChange={e=>setNewCatInput(e.target.value)} placeholder="Category name..." onKeyDown={e=>{if(e.key==="Enter"&&newCatInput.trim()){setIdeas(p=>[{id:uid(),title:"New idea",cat:newCatInput.trim(),priority:"medium",status:"Idea"},...p]);setNewCatInput("");setShowNewCat(false);}}} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:10,fontFamily:"inherit",width:120}} autoFocus/><button className="btn btn-gold btn-sm" disabled={!newCatInput.trim()} onClick={()=>{setIdeas(p=>[{id:uid(),title:"New idea",cat:newCatInput.trim(),priority:"medium",status:"Idea"},...p]);setNewCatInput("");setShowNewCat(false);}}>Add</button><button className="btn btn-out btn-sm" onClick={()=>{setShowNewCat(false);setNewCatInput("");}}>x</button></div>}
            </div>
          </div>

          {/* Board view - by category */}
          {ideaView==="board"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
            {cats.map(cat=>{const catIdeas=filtered.filter(i=>i.cat===cat);return(
              <div key={cat} className="card">
                <div className="card-hd" style={{cursor:"default"}}>
                  <h3 style={{fontSize:12}}>{cat}</h3>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    <span style={{fontSize:10,color:"#999"}}>{catIdeas.length}</span>
                    <button className="btn btn-out btn-sm" style={{padding:"2px 6px",fontSize:9}} onClick={()=>addIdeaToCat(cat)}>+</button>
                  </div>
                </div>
                <div style={{padding:8,minHeight:60}}>{catIdeas.map(i=>(
                  <div key={i.id} style={{padding:8,border:"1px solid rgba(0,0,0,.04)",borderRadius:6,marginBottom:4,fontSize:11,cursor:"pointer",transition:"all .1s"}} onClick={()=>updIdea(i.id,"status",statuses[(statuses.indexOf(i.status)+1)%statuses.length])}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:4}}>
                      <span style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();updIdea(i.id,"priority",i.priority==="high"?"medium":i.priority==="medium"?"low":"high");}}>{priColors[i.priority]}</span>
                      <span style={{flex:1,fontWeight:600,fontSize:11}}>{i.title}</span>
                      <span className={`badge ${stColors[i.status]}`} style={{fontSize:7}}>{i.status}</span>
                    </div>
                  </div>
                ))}{catIdeas.length===0&&<div style={{textAlign:"center",padding:12,color:"#ddd",fontSize:10}}>No ideas</div>}</div>
              </div>);})}
          </div>}

          {/* List view - flat list */}
          {ideaView==="list"&&<>{filtered.map(i=><IdeaRow key={i.id} i={i}/>)}{filtered.length===0&&<div style={{textAlign:"center",padding:24,color:"#999"}}>No ideas match filter</div>}</>}

          {/* Status view - grouped by status */}
          {ideaView==="status"&&<>{statuses.map(st=>{const stIdeas=filtered.filter(i=>i.status===st);if(!stIdeas.length)return null;return(
            <div key={st} style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"flex",alignItems:"center",gap:6}}><span className={`badge ${stColors[st]}`}>{st}</span> ({stIdeas.length})</div>
              {stIdeas.map(i=><IdeaRow key={i.id} i={i}/>)}
            </div>);})}
          </>}
        </>);
      })()}

      </div>
    </div>
  </div>

  {/* ═══ MODALS ═══ */}
  {modal&&modal.type==="tenant"&&(()=>{const r=modal.data;const pd=(payments[r.id]&&payments[r.id][MO])||0;const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;const months=dl?Math.max(0,Math.ceil(dl/30)):null;
    const prop=props.find(p=>p.rooms.some(x=>x.id===r.id));
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:580}}>
      <h2>{r.tenant.name}</h2>
      <div className="tp-card"><h3>📞 Contact</h3><div className="tp-row"><span className="tp-label">Phone</span><strong>{r.tenant.phone}</strong></div><div className="tp-row"><span className="tp-label">Email</span><strong>{r.tenant.email}</strong></div></div>
      <div className="tp-card"><h3>🏠 Room</h3><div className="tp-row"><span className="tp-label">Property</span><strong>{r.propName}</strong></div><div className="tp-row"><span className="tp-label">Room</span><strong>{r.name}</strong></div><div className="tp-row"><span className="tp-label">Bath</span><strong>{r.pb?"Private":"Shared"}</strong></div><div className="tp-row"><span className="tp-label">Rent</span><strong style={{fontSize:16}}>{fmtS(r.rent)}/mo</strong></div><div className="tp-row"><span className="tp-label">Utilities</span><strong>{r.propUtils==="allIncluded"?"All Included":"First $100, overage split"}</strong></div><div className="tp-row"><span className="tp-label">Cleaning</span><strong>{r.propClean}</strong></div></div>
      <div className="tp-card"><h3>📋 Lease</h3><div className="tp-row"><span className="tp-label">Move-in</span><strong>{fmtD(r.tenant.moveIn)}</strong></div><div className="tp-row"><span className="tp-label">Lease End</span><strong style={{color:dl&&dl<=30?"#c45c4a":dl&&dl<=90?"#d4a853":"inherit"}}>{fmtD(r.le)}</strong></div>{dl&&<><div className="tp-row"><span className="tp-label">Days Left</span><strong style={{color:dl<=30?"#c45c4a":dl<=90?"#d4a853":"#4a7c59"}}>{dl} days ({months} mo)</strong></div><div style={{height:6,borderRadius:3,background:"#e5e3df",marginTop:8}}><div style={{height:"100%",borderRadius:3,width:`${Math.min(100,Math.max(0,(1-dl/365)*100))}%`,background:dl<=30?"#c45c4a":dl<=90?"#d4a853":"#4a7c59"}}/></div></>}
        <div className="tp-row"><span className="tp-label">Annual Value</span><strong>{fmtS(r.rent*12)}/yr</strong></div>
      </div>
      <div className="tp-card"><h3>💰 Payment — {MO}</h3><div className="tp-row"><span className="tp-label">Status</span><strong style={{color:pd?"#4a7c59":"#c45c4a"}}>{pd?`Paid ${fmtS(pd)}`:`Unpaid — ${fmtS(r.rent)} due`}</strong></div>{!pd&&<button className="btn btn-green" style={{width:"100%",marginTop:8}} onClick={()=>openPayForm(r.id)}>Record Payment →</button>}</div>


      {/* Payment Ledger */}
      {(()=>{const tenantCharges=charges.filter(c=>c.roomId===r.id).sort((a,b)=>new Date(b.dueDate)-new Date(a.dueDate));const pastDueC=tenantCharges.filter(c=>chargeStatus(c)==="pastdue").length;const totalPaid=tenantCharges.reduce((s,c)=>s+c.amountPaid,0);const totalCharged=tenantCharges.reduce((s,c)=>s+c.amount,0);return(
        <div className="tp-card"><h3>{"📒"} Payment Ledger</h3>
          <div style={{display:"flex",gap:12,marginBottom:10}}>
            <div style={{flex:1,background:"rgba(74,124,89,.04)",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Total Paid</div><div style={{fontSize:16,fontWeight:800,color:"#4a7c59"}}>{fmtS(totalPaid)}</div></div>
            <div style={{flex:1,background:"rgba(0,0,0,.02)",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Charges</div><div style={{fontSize:16,fontWeight:800}}>{tenantCharges.length}</div></div>
            <div style={{flex:1,background:pastDueC?"rgba(196,92,74,.04)":"rgba(74,124,89,.04)",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Past Due</div><div style={{fontSize:16,fontWeight:800,color:pastDueC?"#c45c4a":"#4a7c59"}}>{pastDueC}</div></div>
          </div>
          {tenantCharges.length>0?tenantCharges.map(c=>{const st=chargeStatus(c);const isExp=expCharge===c.id;const rem=c.amount-c.amountPaid;const confId=`BB-${c.id.slice(0,8).toUpperCase()}`;return(
            <div key={c.id}>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid rgba(0,0,0,.03)",fontSize:12,cursor:"pointer",background:isExp?"rgba(0,0,0,.02)":"transparent"}} onClick={()=>setExpCharge(isExp?null:c.id)}>
                <div className="row-dot" style={{background:st==="paid"?"#4a7c59":st==="pastdue"?"#c45c4a":st==="waived"?"#999":"#3b82f6"}}/>
                <div style={{flex:1}}><div style={{fontWeight:600}}>{c.category}: {c.desc}</div><div style={{fontSize:10,color:"#999"}}>Due {fmtD(c.dueDate)} {c.payments.length>0?`· ${c.payments.length} payment${c.payments.length>1?"s":""}`:""}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontWeight:800}}>{fmtS(c.amount)}</div><span className={`badge ${st==="paid"?"b-green":st==="pastdue"?"b-red":st==="waived"?"b-gray":"b-blue"}`} style={{fontSize:7}}>{st}</span></div>
              </div>
              {isExp&&<div style={{padding:"10px 12px",background:"#f8f7f4",borderBottom:"1px solid rgba(0,0,0,.04)",animation:"fadeIn .15s",fontSize:11}}>
                {c.payments.length>0&&c.payments.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.02)"}}>
                  <span>{fmtD(p.date)} · {p.method}{p.notes?` · ${p.notes}`:""}</span><strong style={{color:"#4a7c59"}}>{fmtS(p.amount)}</strong></div>)}
                {st==="paid"&&<div style={{fontSize:10,color:"#4a7c59",marginTop:4}}>Confirmed · {confId}</div>}
                {st!=="paid"&&st!=="waived"&&<div style={{display:"flex",gap:4,marginTop:6}}><button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});}}>Pay</button><button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setTab("payments");setPaySubTab("charges");setPayFilters({...payFilters,tenant:c.tenantName});setModal(null);}}>View in Charges →</button></div>}
              </div>}
            </div>);})
          :<div style={{textAlign:"center",padding:16,color:"#999",fontSize:11}}>No charges yet. Rent charges auto-generate on the 20th for next month and are sent to tenants automatically.</div>}
        </div>);})()}

      {/* Lease Actions */}
      <div className="tp-card"><h3>⚡ Lease Actions</h3>
        <div style={{fontSize:11,color:"#5c4a3a",marginBottom:10}}>Lease renewals happen when the tenant signs a new lease. Use the actions below to manage room assignments or end the lease.</div>
        {(()=>{const allVacant=props.flatMap(pr=>pr.rooms.filter(x=>x.st==="vacant").map(x=>({...x,propName:pr.name,propId:pr.id,propUtils:pr.utils})));return allVacant.length>0?(
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:6}}>MOVE TO DIFFERENT ROOM (ADDENDUM)</div>
            <button className="btn btn-out btn-sm" onClick={()=>setModal(prev=>({...prev,moveStep:1,moveTarget:null,moveDate:"immediately",moveCustomDate:TODAY.toISOString().split("T")[0],moveNewRent:null,moveNotes:"",moveAllVacant:allVacant}))}>Begin Room Move Process →</button>
          </div>
        ):null;})()}
        <div style={{fontSize:10,fontWeight:700,color:"#c45c4a",marginBottom:6,marginTop:8}}>TERMINATE LEASE</div>
        <button className="btn btn-red btn-sm" onClick={()=>setModal(prev=>({...prev,termStep:1,termDate:r.le||TODAY.toISOString().split("T")[0],termNotes:""}))}>Begin Termination Process</button>
      </div>

      {/* Room Move - Step 1: Select Room */}
      {modal.moveStep===1&&<div style={{background:"rgba(59,130,246,.04)",border:"2px solid rgba(59,130,246,.15)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
        <h3 style={{fontSize:14,fontWeight:800,color:"#3b82f6",marginBottom:10}}>Move Room — Step 1: Select New Room</h3>
        <p style={{fontSize:12,color:"#5c4a3a",marginBottom:12}}>Select the vacant room to move {r.tenant.name} into. This creates a lease addendum — the existing lease stays, only room/rent/utility details change.</p>
        {(modal.moveAllVacant||[]).map(vr=>{const isSelected=modal.moveTarget===vr.id;const rentDiff=vr.rent-r.rent;const sdDiff=vr.rent-r.rent;const utilChange=vr.propUtils!==r.propUtils;return(
          <div key={vr.id} style={{padding:10,border:`2px solid ${isSelected?"#3b82f6":"rgba(0,0,0,.06)"}`,borderRadius:8,marginBottom:6,cursor:"pointer",background:isSelected?"rgba(59,130,246,.04)":"#fff",transition:"all .15s"}} onClick={()=>setModal(prev=>({...prev,moveTarget:vr.id,moveNewRent:vr.rent}))}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:13,fontWeight:700}}>{vr.name}</div><div style={{fontSize:10,color:"#999"}}>{vr.propName} · {vr.pb?"Private":"Shared"} bath · {vr.sqft||"—"} sqft</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800}}>{fmtS(vr.rent)}/mo</div>
                {rentDiff!==0&&<div style={{fontSize:10,fontWeight:700,color:rentDiff>0?"#c45c4a":"#4a7c59"}}>{rentDiff>0?`+${fmtS(rentDiff)} upgrade`:`${fmtS(rentDiff)} downgrade`}</div>}
                {utilChange&&<div style={{fontSize:9,color:"#d4a853",fontWeight:600}}>⚠ Utility model changes</div>}
              </div>
            </div>
            {sdDiff!==0&&<div style={{fontSize:10,color:sdDiff>0?"#c45c4a":"#4a7c59",marginTop:4}}>SD adjustment: {sdDiff>0?`Tenant owes ${fmtS(sdDiff)} additional deposit`:`${fmtS(Math.abs(sdDiff))} credit applied from overage`}</div>}
          </div>);})}
        <div style={{display:"flex",gap:6,marginTop:10}}>
          <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,moveStep:undefined}))}>Cancel</button>
          <button className="btn btn-dk" style={{flex:1}} disabled={!modal.moveTarget} onClick={()=>setModal(prev=>({...prev,moveStep:2}))}>Continue →</button>
        </div>
      </div>}

      {/* Room Move - Step 2: Details */}
      {modal.moveStep===2&&(()=>{const target=(modal.moveAllVacant||[]).find(x=>x.id===modal.moveTarget);if(!target)return null;const sdDiff=target.rent-r.rent;const utilChange=target.propUtils!==(r.propUtils||r.utils);return(
        <div style={{background:"rgba(59,130,246,.04)",border:"2px solid rgba(59,130,246,.15)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#3b82f6",marginBottom:10}}>Move Room — Step 2: Details</h3>
          <div className="fld"><label>New Rent (defaults to room price, editable for negotiation)</label><input type="number" value={modal.moveNewRent||target.rent} onChange={e=>setModal(prev=>({...prev,moveNewRent:Number(e.target.value)}))}/></div>
          <div className="fld"><label>Effective Date</label>
            <div style={{display:"flex",gap:4,marginBottom:6}}>
              {[["immediately","Immediately"],["endOfMonth","End of This Month"],["custom","Custom Date"]].map(([v,l])=>(
                <button key={v} className={`btn ${modal.moveDate===v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setModal(prev=>({...prev,moveDate:v}))}>{l}</button>
              ))}
            </div>
            {modal.moveDate==="custom"&&<input type="date" value={modal.moveCustomDate} onChange={e=>setModal(prev=>({...prev,moveCustomDate:e.target.value}))}/>}
          </div>
          {utilChange&&<div style={{background:"rgba(212,168,83,.08)",borderRadius:6,padding:10,marginBottom:8,fontSize:11,color:"#9a7422"}}><strong>⚠ Utility model change:</strong> Moving from {r.propUtils==="allIncluded"?"All Included":"First $100 + split"} to {target.propUtils==="allIncluded"?"All Included":"First $100 + split"}. The addendum should reflect this.</div>}
          {sdDiff!==0&&<div style={{background:sdDiff>0?"rgba(196,92,74,.04)":"rgba(74,124,89,.04)",borderRadius:6,padding:10,marginBottom:8,fontSize:11,color:sdDiff>0?"#c45c4a":"#4a7c59"}}><strong>SD Adjustment:</strong> {sdDiff>0?`Tenant owes ${fmtS(sdDiff)} additional deposit (upgrade). An invoice will be generated.`:`${fmtS(Math.abs(sdDiff))} overage from current SD will be credited (downgrade).`}</div>}
          <div className="fld"><label>Reason for Move (required)</label><textarea value={modal.moveNotes||""} onChange={e=>setModal(prev=>({...prev,moveNotes:e.target.value}))} placeholder="e.g. Tenant requested upgrade to private bath, roommate conflict, etc." rows={2}/></div>
          <div style={{display:"flex",gap:6,marginTop:10}}>
            <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,moveStep:1}))}>← Back</button>
            <button className="btn btn-dk" style={{flex:1}} disabled={!(modal.moveNotes||"").trim()} onClick={()=>setModal(prev=>({...prev,moveStep:3}))}>Review →</button>
          </div>
        </div>);})()}

      {/* Room Move - Step 3: Review & Confirm */}
      {modal.moveStep===3&&(()=>{const target=(modal.moveAllVacant||[]).find(x=>x.id===modal.moveTarget);if(!target)return null;const newRent=modal.moveNewRent||target.rent;const sdDiff=newRent-r.rent;
        const effDate=modal.moveDate==="immediately"?TODAY.toISOString().split("T")[0]:modal.moveDate==="endOfMonth"?`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}-${new Date(TODAY.getFullYear(),TODAY.getMonth()+1,0).getDate()}`:modal.moveCustomDate;
        const executeMove=()=>{
          setProps(p=>p.map(pr=>({...pr,rooms:pr.rooms.map(rm=>{
            if(rm.id===r.id)return{...rm,st:"vacant",le:null,tenant:null};
            if(rm.id===target.id)return{...rm,st:"occupied",le:r.le,tenant:r.tenant,rent:newRent};
            return rm;
          })})));
          // Generate SD adjustment invoice if needed
          if(sdDiff>0){createCharge({roomId:target.id,tenantName:r.tenant.name,propName:target.propName,roomName:target.name,category:"Security Deposit",desc:`SD Adjustment — Upgrade from ${r.name} to ${target.name}`,amount:sdDiff,dueDate:effDate});}
          setNotifs(p=>[{id:uid(),type:"lease",msg:`Room move: ${r.tenant.name} moved from ${r.name} to ${target.name} at ${target.propName}. Reason: ${modal.moveNotes}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
          setModal(null);
        };
        return(
        <div style={{background:"rgba(59,130,246,.06)",border:"2px solid rgba(59,130,246,.25)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#3b82f6",marginBottom:10}}>Confirm Room Move — Lease Addendum</h3>
          <div style={{fontSize:12,color:"#5c4a3a",lineHeight:1.8}}>
            <strong>Tenant:</strong> {r.tenant.name}<br/>
            <strong>From:</strong> {r.name} at {r.propName} ({fmtS(r.rent)}/mo)<br/>
            <strong>To:</strong> {target.name} at {target.propName} ({fmtS(newRent)}/mo)<br/>
            <strong>Effective:</strong> {fmtD(effDate)}<br/>
            <strong>Rent Change:</strong> {newRent===r.rent?"No change":newRent>r.rent?`+${fmtS(newRent-r.rent)}/mo increase`:`${fmtS(newRent-r.rent)}/mo decrease`}<br/>
            {sdDiff>0&&<><strong>SD Invoice:</strong> {fmtS(sdDiff)} additional deposit due<br/></>}
            {sdDiff<0&&<><strong>SD Credit:</strong> {fmtS(Math.abs(sdDiff))} applied from overage<br/></>}
            <strong>Reason:</strong> {modal.moveNotes}
          </div>
          <div style={{display:"flex",gap:6,marginTop:12}}>
            <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,moveStep:2}))}>← Back</button>
            <button className="btn btn-green" style={{flex:1}} onClick={executeMove}>Confirm Move</button>
          </div>
        </div>);})()}

      {/* Termination flow - Step 1: Confirm */}
      {modal.termStep===1&&<div style={{background:"rgba(196,92,74,.04)",border:"2px solid rgba(196,92,74,.15)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
        <h3 style={{fontSize:14,fontWeight:800,color:"#c45c4a",marginBottom:10}}>⚠ Terminate Lease — {r.tenant.name}</h3>
        <p style={{fontSize:12,color:"#5c4a3a",marginBottom:12}}>This will end {r.tenant.name}'s lease, unlink them from {r.name}, and mark the room as vacant. This action cannot be undone.</p>
        <div className="fld"><label>Termination Date</label><input type="date" value={modal.termDate} onChange={e=>setModal(prev=>({...prev,termDate:e.target.value}))}/></div>
        <div className="fld"><label>Reason / Notes (required)</label><textarea value={modal.termNotes||""} onChange={e=>setModal(prev=>({...prev,termNotes:e.target.value}))} placeholder="e.g. Tenant gave 30-day notice, relocating for work..." rows={3}/></div>
        <div style={{display:"flex",gap:6,marginTop:10}}>
          <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,termStep:undefined}))}>Cancel</button>
          <button className="btn btn-red" style={{flex:1}} disabled={!(modal.termNotes||"").trim()} onClick={()=>setModal(prev=>({...prev,termStep:2}))}>Continue →</button>
        </div>
      </div>}

      {/* Termination flow - Step 2: Final confirm */}
      {modal.termStep===2&&<div style={{background:"rgba(196,92,74,.06)",border:"2px solid rgba(196,92,74,.25)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
        <h3 style={{fontSize:14,fontWeight:800,color:"#c45c4a",marginBottom:10}}>Confirm Termination</h3>
        <div style={{fontSize:12,color:"#5c4a3a",lineHeight:1.8}}>
          <strong>Tenant:</strong> {r.tenant.name}<br/>
          <strong>Room:</strong> {r.name} at {r.propName}<br/>
          <strong>Rent:</strong> {fmtS(r.rent)}/mo ({fmtS(r.rent*12)}/yr lost)<br/>
          <strong>Termination Date:</strong> {fmtD(modal.termDate)}<br/>
          <strong>Reason:</strong> {modal.termNotes}
        </div>
        <div style={{display:"flex",gap:6,marginTop:12}}>
          <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,termStep:1}))}>← Back</button>
          <button className="btn btn-red" style={{flex:1}} onClick={()=>{
            // Archive tenant record before removing
            setArchive(prev=>[{id:uid(),name:r.tenant.name,email:r.tenant.email,phone:r.tenant.phone,roomName:r.name,propName:r.propName,rent:r.rent,moveIn:r.tenant.moveIn,leaseEnd:r.le,terminatedDate:modal.termDate,reason:modal.termNotes,payments:payments[r.id]||{},archivedOn:TODAY.toISOString().split("T")[0]},...prev]);
            setProps(p=>p.map(pr=>({...pr,rooms:pr.rooms.map(rm=>rm.id===r.id?{...rm,st:"vacant",le:null,tenant:null}:rm)})));
            setNotifs(p=>[{id:uid(),type:"lease",msg:`Lease terminated: ${r.tenant.name} — ${r.name} at ${r.propName}. Reason: ${modal.termNotes}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
            setModal(null);
          }}>Confirm Termination</button>
        </div>
      </div>}

      {dl&&dl<=90&&!modal.termStep&&<div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:12,color:"#5c4a3a"}}><strong>Action needed:</strong> Lease expires in {dl} days. This room generates {fmtS(r.rent)}/mo ({fmtS(r.rent*12)}/yr). Reach out to {r.tenant.name.split(" ")[0]} about renewing, or start looking for a replacement.</div>}
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Close</button></div>
    </div></div>);})()}

  {/* Record Payment Modal */}
  {/* Save Theme Modal */}
  {modal&&modal.type==="saveTheme"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:380}}>
      <h2>Save Theme</h2>
      <div style={{display:"flex",gap:3,marginBottom:12}}>{[theme.bg,theme.card,theme.accent,theme.text,theme.green,theme.muted].map((c,i)=><div key={i} style={{width:24,height:24,borderRadius:4,background:c,border:"1px solid rgba(0,0,0,.1)"}}/>)}</div>
      <div className="fld"><label>Theme Name</label><input value={modal.themeName||""} onChange={e=>setModal(prev=>({...prev,themeName:e.target.value}))} placeholder="e.g. Spring 2026, Dark Mode, Client Pitch..." autoFocus onKeyDown={e=>{if(e.key==="Enter"&&(modal.themeName||"").trim()){setSavedThemes(p=>[...p,{id:uid(),name:modal.themeName.trim(),colors:{...theme},savedDate:TODAY.toISOString().split("T")[0]}]);setModal(null);}}}/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-gold" disabled={!(modal.themeName||"").trim()} onClick={()=>{setSavedThemes(p=>[...p,{id:uid(),name:modal.themeName.trim(),colors:{...theme},savedDate:TODAY.toISOString().split("T")[0]}]);setModal(null);}}>Save</button></div>
    </div></div>
  )}

  {/* Waive Charge Modal */}
  {modal&&modal.type==="waiveCharge"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>Waive Charge</h2>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:12}}>This will stop late fees and mark the charge as waived. This cannot be undone.</p>
      <div className="fld"><label>Reason (required)</label><textarea value={modal.reason||""} onChange={e=>setModal(prev=>({...prev,reason:e.target.value}))} placeholder="e.g. Tenant hardship, billing error, goodwill gesture..." rows={2} autoFocus/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-red" disabled={!(modal.reason||"").trim()} onClick={()=>{waiveCharge(modal.chargeId,modal.reason);setExpCharge(null);setModal(null);}}>Waive Charge</button></div>
    </div></div>
  )}

  {/* New Idea Modal */}
  {modal&&modal.type==="newIdea"&&(()=>{
    const cats=[...new Set(ideas.map(i=>i.cat))];
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
      <h2>New Idea</h2>
      <div className="fld"><label>Title</label><input value={modal.title||""} onChange={e=>setModal(prev=>({...prev,title:e.target.value}))} placeholder="What's the idea?" autoFocus/></div>
      <div className="fld"><label>Category</label>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
          {cats.map(c=><button key={c} className={`btn ${modal.cat===c?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setModal(prev=>({...prev,cat:c}))}>{c}</button>)}
          <button className="btn btn-out btn-sm" style={{borderStyle:"dashed"}} onClick={()=>setModal(prev=>({...prev,showCatInput:true}))}>+ New Category</button>
          {modal.showCatInput&&<div style={{display:"flex",gap:3,marginTop:4}}><input value={modal.newCatName||""} onChange={e=>setModal(prev=>({...prev,newCatName:e.target.value}))} placeholder="Category name..." onKeyDown={e=>{if(e.key==="Enter"&&(modal.newCatName||"").trim())setModal(prev=>({...prev,cat:prev.newCatName.trim(),showCatInput:false,newCatName:""}));}} style={{flex:1,padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:10,fontFamily:"inherit"}} autoFocus/><button className="btn btn-gold btn-sm" disabled={!(modal.newCatName||"").trim()} onClick={()=>setModal(prev=>({...prev,cat:prev.newCatName.trim(),showCatInput:false,newCatName:""}))}>Set</button></div>}
        </div>
        {modal.cat&&!cats.includes(modal.cat)&&<div style={{fontSize:10,color:"#d4a853",marginTop:2}}>New category: <strong>{modal.cat}</strong></div>}
      </div>
      <div className="fr">
        <div className="fld"><label>Priority</label>
          <div style={{display:"flex",gap:4}}>
            {[["high","🔴 High"],["medium","🟡 Medium"],["low","🟢 Low"]].map(([v,l])=>(
              <button key={v} className={`btn ${modal.priority===v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setModal(prev=>({...prev,priority:v}))}>{l}</button>
            ))}
          </div>
        </div>
        <div className="fld"><label>Status</label>
          <div style={{display:"flex",gap:4}}>
            {["Idea","Planned","Building","Done"].map(s=>(
              <button key={s} className={`btn ${modal.status===s?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setModal(prev=>({...prev,status:s}))}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-gold" disabled={!(modal.title||"").trim()||!modal.cat} onClick={()=>{setIdeas(p=>[{id:uid(),title:modal.title.trim(),cat:modal.cat,priority:modal.priority||"medium",status:modal.status||"Idea"},...p]);setModal(null);}}>Add Idea</button>
      </div>
    </div></div>);})()}

  {modal&&modal.type==="recordPay"&&(()=>{
    const occRooms=props.flatMap(pr=>pr.rooms.filter(r=>r.st==="occupied"&&r.tenant).map(r=>({...r,propName:pr.name})));
    const selRoom=occRooms.find(r=>r.id===modal.selRoom);
    const roomCharges=charges.filter(c=>c.roomId===modal.selRoom&&chargeStatus(c)!=="paid"&&chargeStatus(c)!=="waived");
    const selCh=charges.find(c=>c.id===modal.selCharge);
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
      <h2>Record Payment</h2>
      {modal.step===1&&<>
        <div className="fld"><label>Select Tenant</label><select value={modal.selRoom} onChange={e=>setModal(prev=>({...prev,selRoom:e.target.value,selCharge:""}))}><option value="">Choose...</option>{occRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} - {r.propName} {r.name}</option>)}</select></div>
        {modal.selRoom&&roomCharges.length>0&&<div className="fld"><label>Select Charge</label>{roomCharges.map(c=>{const st=chargeStatus(c);return(
          <div key={c.id} style={{padding:8,border:`2px solid ${modal.selCharge===c.id?"#3b82f6":"rgba(0,0,0,.05)"}`,borderRadius:6,marginBottom:4,cursor:"pointer",background:modal.selCharge===c.id?"rgba(59,130,246,.04)":"#fff"}} onClick={()=>setModal(prev=>({...prev,selCharge:c.id,payAmount:c.amount-c.amountPaid}))}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,fontWeight:600}}>{c.category}: {c.desc}</span><span className={`badge ${st==="pastdue"?"b-red":"b-blue"}`}>{st}</span></div>
            <div style={{fontSize:10,color:"#999"}}>Due {fmtD(c.dueDate)} - {fmtS(c.amount-c.amountPaid)} remaining</div>
          </div>);})}</div>}
        {modal.selRoom&&roomCharges.length===0&&<div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:12,color:"#9a7422",marginBottom:10}}>No unpaid charges. <button className="btn btn-gold btn-sm" style={{marginLeft:6}} onClick={()=>setModal({type:"createCharge",roomId:modal.selRoom,category:"Rent",desc:"",amount:(selRoom&&selRoom.rent)||0,dueDate:TODAY.toISOString().split("T")[0],notes:""})}>Create Charge</button></div>}
        <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-dk" disabled={!modal.selCharge} onClick={()=>setModal(prev=>({...prev,step:2}))}>Next</button></div>
      </>}
      {modal.step===2&&selCh&&<>
        <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:12,marginBottom:14,fontSize:12}}><strong>{selCh.tenantName}</strong> - {selCh.propName} {selCh.roomName}<br/><strong>{selCh.category}:</strong> {selCh.desc} - <strong>{fmtS(selCh.amount-selCh.amountPaid)}</strong> remaining</div>
        <div className="fld"><label>Amount</label><input type="number" step=".01" value={modal.payAmount} onChange={e=>setModal(prev=>({...prev,payAmount:Number(e.target.value)}))}/></div>
        <div className="fld"><label>Payment Method</label><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{PAY_METHODS.map(pm=>(<button key={pm} className={`btn ${modal.payMethod===pm?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setModal(prev=>({...prev,payMethod:pm}))}>{pm}</button>))}</div></div>
        <div className="fld"><label>Payment Date</label><input type="date" value={modal.payDate} onChange={e=>setModal(prev=>({...prev,payDate:e.target.value}))}/></div>
        <div className="fld"><label>Notes</label><input value={modal.payNotes||""} onChange={e=>setModal(prev=>({...prev,payNotes:e.target.value}))} placeholder="Optional notes..."/></div>
        <div className="mft"><button className="btn btn-out" onClick={()=>setModal(prev=>({...prev,step:1}))}>Back</button>
          <button className="btn btn-green" disabled={!modal.payMethod||!modal.payAmount} onClick={()=>{const isTransit=["Stripe/ACH","Credit Card","Bank Transfer"].includes(modal.payMethod);recordPayment(modal.selCharge,{amount:modal.payAmount,method:modal.payMethod,date:modal.payDate,notes:modal.payNotes,depositStatus:isTransit?"transit":"deposited",depositDate:isTransit?null:modal.payDate});setModal(null);}}>Submit Payment</button></div>
      </>}
    </div></div>);})()}

  {/* Create Charge Modal */}
  {modal&&modal.type==="createCharge"&&(()=>{
    const occRooms=props.flatMap(pr=>pr.rooms.filter(r=>r.st==="occupied"&&r.tenant).map(r=>({...r,propName:pr.name})));
    const selRoom=occRooms.find(r=>r.id===modal.roomId);
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
      <h2>Create Charge</h2>
      <div className="fld"><label>Tenant</label><select value={modal.roomId} onChange={e=>setModal(prev=>({...prev,roomId:e.target.value}))}><option value="">Select...</option>{occRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} - {r.propName} {r.name}</option>)}</select></div>
      <div className="fld"><label>Category</label><select value={modal.category} onChange={e=>setModal(prev=>({...prev,category:e.target.value}))}>{CHARGE_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
      <div className="fld"><label>Description</label><input value={modal.desc||""} onChange={e=>setModal(prev=>({...prev,desc:e.target.value}))} placeholder={`${modal.category} charge...`}/></div>
      <div className="fr"><div className="fld"><label>Amount</label><input type="number" step=".01" value={modal.amount} onChange={e=>setModal(prev=>({...prev,amount:Number(e.target.value)}))}/></div><div className="fld"><label>Due Date</label><input type="date" value={modal.dueDate} onChange={e=>setModal(prev=>({...prev,dueDate:e.target.value}))}/></div></div>
      <div className="fld"><label>Notes</label><input value={modal.notes||""} onChange={e=>setModal(prev=>({...prev,notes:e.target.value}))}/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-gold" disabled={!modal.roomId||!modal.amount} onClick={()=>{createCharge({roomId:modal.roomId,tenantName:(selRoom&&selRoom.tenant&&selRoom.tenant.name)||"",propName:(selRoom&&selRoom.propName)||"",roomName:(selRoom&&selRoom.name)||"",category:modal.category,desc:modal.desc||modal.category,amount:modal.amount,dueDate:modal.dueDate});setModal(null);}}>Create Charge</button></div>
    </div></div>);})()}


  {/* Add Credit */}
  {modal&&modal.type==="addCredit"&&(()=>{
    const occRooms=props.flatMap(pr=>pr.rooms.filter(r=>r.st==="occupied"&&r.tenant).map(r=>({...r,propName:pr.name})));
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
      <h2>Add Credit</h2>
      <p style={{fontSize:11,color:"#5c4a3a",marginBottom:12}}>Credits auto-apply to next month's rent.</p>
      <div className="fld"><label>Tenant</label><select value={modal.roomId} onChange={e=>setModal(prev=>({...prev,roomId:e.target.value}))}><option value="">Select...</option>{occRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} - {r.propName} {r.name}</option>)}</select></div>
      <div className="fld"><label>Amount</label><input type="number" step=".01" value={modal.amount} onChange={e=>setModal(prev=>({...prev,amount:Number(e.target.value)}))}/></div>
      <div className="fld"><label>Reason</label><input value={modal.reason||""} onChange={e=>setModal(prev=>({...prev,reason:e.target.value}))} placeholder="e.g. Overpayment, SD credit..."/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-green" disabled={!modal.roomId||!modal.amount} onClick={()=>{const rm=occRooms.find(r=>r.id===modal.roomId);setCredits(p=>[{id:uid(),roomId:modal.roomId,tenantName:(rm&&rm.tenant&&rm.tenant.name)||"",amount:modal.amount,reason:modal.reason,date:TODAY.toISOString().split("T")[0],applied:false},...p]);setModal(null);}}>Add Credit</button></div>
    </div></div>);})()}

  {/* Return SD */}
  {modal&&modal.type==="returnSD"&&(()=>{
    const tenantList=[...archive.map(a=>({id:a.id,name:a.name,roomName:a.roomName,propName:a.propName,rent:a.rent,type:"past"})),...props.flatMap(pr=>pr.rooms.filter(r=>r.st==="occupied"&&r.tenant).map(r=>({id:r.id,name:r.tenant.name,roomName:r.name,propName:pr.name,rent:r.rent,type:"current"})))];
    const sel=tenantList.find(t=>t.id===modal.roomId);
    const sdHeld=(sel&&sel.rent)||0;
    const deductions=modal.deductions||[];
    const totalDed=deductions.reduce((s,d)=>s+d.amount,0);
    const returnAmt=Math.max(0,sdHeld-totalDed);
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
      <h2>Return Security Deposit</h2>
      <div className="fld"><label>Tenant</label><select value={modal.roomId} onChange={e=>setModal(prev=>({...prev,roomId:e.target.value,deductions:[]}))}><option value="">Select...</option>{tenantList.map(t=><option key={t.id} value={t.id}>{t.name} - {t.propName} {t.roomName} ({t.type})</option>)}</select></div>
      {sel&&<>
        <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:12,marginBottom:10,fontSize:12}}><strong>SD Held:</strong> {fmtS(sdHeld)}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><label style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase"}}>Deductions</label><button className="btn btn-out btn-sm" onClick={()=>setModal(prev=>({...prev,deductions:[...deductions,{desc:"",amount:0}]}))}>+ Add</button></div>
        {deductions.map((d,i)=>(
          <div key={i} style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}>
            <select value={d.desc} onChange={e=>{const ds=[...deductions];ds[i]={...ds[i],desc:e.target.value};setModal(prev=>({...prev,deductions:ds}));}} style={{flex:1,padding:"5px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">Type...</option><option>Damages</option><option>Cleaning</option><option>Unpaid Rent</option><option>Lock Change</option><option>Key Replacement</option><option>Other</option></select>
            <input type="number" step=".01" value={d.amount} onChange={e=>{const ds=[...deductions];ds[i]={...ds[i],amount:Number(e.target.value)};setModal(prev=>({...prev,deductions:ds}));}} style={{width:80,padding:"5px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,textAlign:"right"}}/>
            <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer"}} onClick={()=>setModal(prev=>({...prev,deductions:deductions.filter((_,j)=>j!==i)}))}>x</button>
          </div>))}
        <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:12,marginTop:10,fontSize:13}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>SD Held</span><strong>{fmtS(sdHeld)}</strong></div>
          {deductions.filter(d=>d.amount>0).map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:2,color:"#c45c4a"}}><span>- {d.desc||"Deduction"}</span><span>{fmtS(d.amount)}</span></div>)}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"2px solid rgba(0,0,0,.06)",marginTop:6,fontWeight:800,fontSize:15}}><span>Return</span><span style={{color:"#4a7c59"}}>{fmtS(returnAmt)}</span></div>
        </div>
      </>}
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-green" disabled={!sel} onClick={()=>{setSdLedger(p=>[{id:uid(),roomId:modal.roomId,tenantName:sel.name,propName:sel.propName,roomName:sel.roomName,amountHeld:sdHeld,deductions,returned:returnAmt,returnDate:TODAY.toISOString().split("T")[0]},...p]);setModal(null);}}>Confirm Return {fmtS(returnAmt)}</button></div>
    </div></div>);})()}
  {/* Invite to Apply Modal */}
  {modal&&modal.type==="inviteApp"&&(()=>{const a=modal.data;
    const reqs=["Background Check","Credit Check","Income Verification","References","Photo ID","Proof of Income"];
    const waived=modal.waived||[];
    const toggleReq=r=>{const w=waived.includes(r)?waived.filter(x=>x!==r):[...waived,r];setModal(prev=>({...prev,waived:w}));};
    const selFields=(modal.selFields||appFields.filter(f=>f.active).map(f=>f.id));
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
      <h2>Invite {a.name} to Apply</h2>
      <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:12,marginBottom:14,fontSize:12}}><strong>{a.email}</strong> · {a.phone} · {a.property||"No preference"}</div>
      <div className="tp-card"><h3>Requirements</h3><p style={{fontSize:10,color:"#999",marginBottom:8}}>Uncheck any you want to waive for this applicant.</p>
        {reqs.map(r=><label key={r} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.03)",fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={!waived.includes(r)} onChange={()=>toggleReq(r)}/><span style={{textDecoration:waived.includes(r)?"line-through":"none",color:waived.includes(r)?"#999":"inherit"}}>{r}</span></label>)}
      </div>
      {waived.length>0&&<div className="fld"><label>Waiver Reason (required)</label><input value={modal.waiverReason||""} onChange={e=>setModal(prev=>({...prev,waiverReason:e.target.value}))} placeholder="e.g. NASA intern with security clearance..."/></div>}
      <div className="tp-card"><h3>Application Fields ({appFields.filter(f=>f.active).length} active)</h3>
        <div style={{fontSize:10,color:"#999",marginBottom:6}}>These fields will be on their application form. Edit in the fields editor below.</div>
        <div style={{maxHeight:120,overflowY:"auto"}}>{appFields.filter(f=>f.active).map(f=><div key={f.id} style={{fontSize:10,padding:"3px 0",borderBottom:"1px solid rgba(0,0,0,.02)"}}>✓ {f.label} <span style={{color:"#999"}}>({f.type})</span></div>)}</div>
      </div>
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-green" disabled={waived.length>0&&!(modal.waiverReason||"").trim()} onClick={()=>{
          setApps(p=>p.map(x=>x.id===a.id?{...x,status:"invited",lastContact:TODAY.toISOString().split("T")[0],waived,waiverReason:modal.waiverReason||"",history:[...(x.history||[]),{from:x.status,to:"invited",date:TODAY.toISOString().split("T")[0],note:waived.length?"Waived: "+waived.join(", ")+" — "+(modal.waiverReason||""):""}]}:x));
          setNotifs(p=>[{id:uid(),type:"app",msg:"Invite sent to "+a.name+" ("+a.email+")",date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
          setModal(null);
        }}>Send Invite</button>
      </div>
    </div></div>);})()}

  {/* Deny Modal */}
  {modal&&modal.type==="denyApp"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>Deny Application</h2>
      <div className="fld"><label>Reason (required)</label><textarea value={modal.reason||""} onChange={e=>setModal(prev=>({...prev,reason:e.target.value}))} placeholder="e.g. Failed background check, insufficient income..." rows={3} autoFocus/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-red" disabled={!(modal.reason||"").trim()} onClick={()=>{setApps(p=>p.map(a=>a.id===modal.appId?{...a,status:"denied",deniedReason:modal.reason,deniedDate:TODAY.toISOString().split("T")[0],prevStage:a.status,lastContact:TODAY.toISOString().split("T")[0],history:[...(a.history||[]),{from:a.status,to:"denied",date:TODAY.toISOString().split("T")[0],note:modal.reason}]}:a));setModal(null);}}>Deny</button></div>
    </div></div>
  )}

  {modal&&modal.type==="app"&&(()=>{const a=modal.data;
    const STAGES=["pre-screened","called","invited","applied","reviewing","approved","move-in"];
    const STAGE_LABELS={"pre-screened":"Pre-Screened","called":"Called","invited":"Invited","applied":"Applied","reviewing":"Reviewing","approved":"Approved","move-in":"Move-In"};
    const STAGE_ICONS={"pre-screened":"📋","called":"📞","invited":"✉️","applied":"📝","reviewing":"🔍","approved":"✅","move-in":"🏠"};
    const si=STAGES.indexOf(a.status);
    const scoreApp=(a)=>{let s=50;if(a.income){const n=parseInt((a.income+"").replace(/[^0-9]/g,""));if(n>=5000)s+=15;else if(n>=4000)s+=10;else if(n>=3000)s+=5;}if(a.bgCheck==="passed")s+=15;if(a.creditScore&&a.creditScore!=="—"){const c=parseInt(a.creditScore);if(c>=750)s+=15;else if(c>=700)s+=10;else if(c>=650)s+=5;}if(a.refs==="verified")s+=10;return Math.min(s,100);};
    const score=scoreApp(a);
    const daysSince=(d)=>{if(!d)return 0;return Math.floor((TODAY-new Date(d+"T00:00:00"))/(1e3*60*60*24));};
    const days=daysSince(a.lastContact||a.submitted);
    const allVacant=props.flatMap(p=>p.rooms.filter(r=>r.st==="vacant").map(r=>({...r,propName:p.name,propId:p.id})));
    const targetProp=props.find(p=>p.name===a.property);
    const targetRoom=(targetProp&&targetProp.rooms).find(r=>r.name===a.room&&r.st==="vacant");
    const convertToTenant=(roomId,propId)=>{
      const moveIn=a.moveIn||TODAY.toISOString().split("T")[0];
      const leaseEnd=new Date(moveIn+"T00:00:00");leaseEnd.setFullYear(leaseEnd.getFullYear()+1);
      setProps(p=>p.map(pr=>pr.id===propId?{...pr,rooms:pr.rooms.map(rm=>rm.id===roomId?{...rm,st:"occupied",le:leaseEnd.toISOString().split("T")[0],tenant:{name:a.name,email:a.email,phone:a.phone,moveIn}}:rm)}:pr));
      setApps(p=>p.filter(x=>x.id!==a.id));
      setNotifs(p=>[{id:uid(),type:"lease",msg:`${a.name} converted to tenant`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
      setModal(null);
    };
    const reqs=[
      {key:"bgCheck",label:"Background Check"},
      {key:"creditScore",label:"Credit Check"},
      {key:"incomeVerified",label:"Income Verification"},
      {key:"refs",label:"References"},
      {key:"idVerified",label:"ID Verified"},
    ];
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <h2>{a.name}</h2>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:700,color:score>=70?"#4a7c59":score>=50?"#d4a853":"#c45c4a",background:score>=70?"rgba(74,124,89,.08)":score>=50?"rgba(212,168,83,.08)":"rgba(196,92,74,.08)",padding:"3px 8px",borderRadius:5}}>Score: {score}</span>
          {days>0&&<span style={{fontSize:10,color:days>=5?"#c45c4a":days>=3?"#d4a853":"#999"}}>{days}d ago</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{display:"flex",gap:2,marginBottom:16}}>
        {STAGES.map((s,i)=><div key={s} style={{flex:1,textAlign:"center"}}>
          <div style={{height:4,borderRadius:2,background:i<=si?"#d4a853":"rgba(0,0,0,.06)",marginBottom:3,transition:"background .3s"}}/>
          <div style={{fontSize:7,color:i<=si?"#d4a853":"#999"}}>{STAGE_ICONS[s]}</div>
        </div>)}
      </div>

      {/* Info cards */}
      <div className="tp-card"><h3>👤 Applicant</h3>
        <div className="tp-row"><span className="tp-label">Email</span><strong>{a.email}</strong></div>
        <div className="tp-row"><span className="tp-label">Phone</span><strong>{a.phone}</strong></div>
        <div className="tp-row"><span className="tp-label">Income</span><strong>{a.income||"—"}</strong></div>
        {a.source&&<div className="tp-row"><span className="tp-label">Source</span><strong>{a.source}</strong></div>}
        {a.reason&&<div className="tp-row"><span className="tp-label">Why moving</span><strong>{a.reason}</strong></div>}
      </div>
      <div className="tp-card"><h3>🏠 Request</h3>
        <div className="tp-row"><span className="tp-label">Property</span><strong>{a.property||"No preference"}</strong></div>
        {a.room&&<div className="tp-row"><span className="tp-label">Room</span><strong>{a.room}</strong></div>}
        <div className="tp-row"><span className="tp-label">Move-in</span><strong>{fmtD(a.moveIn)||"Flexible"}</strong></div>
        <div className="tp-row"><span className="tp-label">Submitted</span><strong>{fmtD(a.submitted)}</strong></div>
      </div>

      {/* Requirements checklist */}
      <div className="tp-card"><h3>📋 Requirements</h3>
        {reqs.map(r=>{const val=a[r.key]||"not-started";const stColor=val==="passed"?"#4a7c59":val==="pending"?"#d4a853":val==="failed"?"#c45c4a":"#999";return(
          <div key={r.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.03)"}}>
            <span style={{fontSize:12}}>{r.label}</span>
            <select value={val} onChange={e=>{setApps(p=>p.map(x=>x.id===a.id?{...x,[r.key]:e.target.value}:x));setModal(prev=>({...prev,data:{...prev.data,[r.key]:e.target.value}}));}} style={{padding:"3px 8px",borderRadius:5,border:`1px solid ${stColor}33`,fontSize:10,fontFamily:"inherit",color:stColor,fontWeight:600}}>
              <option value="not-started">Not Started</option><option value="pending">Pending</option><option value="passed">Passed</option><option value="failed">Failed</option><option value="waived">Waived</option>
            </select>
          </div>);})}
      </div>

      {/* Notes */}
      <div className="tp-card"><h3>📝 Notes</h3>
        <textarea value={a.notes||""} onChange={e=>{setApps(p=>p.map(x=>x.id===a.id?{...x,notes:e.target.value}:x));setModal(prev=>({...prev,data:{...prev.data,notes:e.target.value}}));}} placeholder="Internal notes about this applicant..." rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/>
      </div>

      {/* History */}
      {(a.history||[]).length>0&&<div className="tp-card"><h3>📅 History</h3>
        {(a.history||[]).slice(-5).reverse().map((h,i)=><div key={i} style={{fontSize:10,padding:"3px 0",borderBottom:"1px solid rgba(0,0,0,.02)",color:"#999"}}>
          {fmtD(h.date)} — {h.from} → {h.to}{h.note?` · ${h.note}`:""}
        </div>)}
      </div>}

      {/* Stage controls */}
      <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
        <select value={a.status} onChange={e=>{const ns=e.target.value;setApps(p=>p.map(x=>x.id===a.id?{...x,status:ns,lastContact:TODAY.toISOString().split("T")[0],history:[...(x.history||[]),{from:x.status,to:ns,date:TODAY.toISOString().split("T")[0]}]}:x));setModal(prev=>({...prev,data:{...prev.data,status:ns}}));}} style={{flex:1,padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontFamily:"inherit",fontSize:12}}>
          {["pre-screened","called","invited","applied","reviewing","approved","move-in"].map(s=><option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
        </select>
        {a.status==="called"&&<button className="btn btn-dk" onClick={()=>{setApps(p=>p.map(x=>x.id===a.id?{...x,status:"invited",lastContact:TODAY.toISOString().split("T")[0],history:[...(x.history||[]),{from:"called",to:"invited",date:TODAY.toISOString().split("T")[0]}]}:x));setModal(prev=>({...prev,data:{...prev.data,status:"invited"}}));}}>✉️ Invite to Apply</button>}
        <button className="btn btn-out" style={{color:"#c45c4a"}} onClick={()=>setModal({type:"denyApp",appId:a.id,reason:""})}>Deny</button>
      </div>

      {/* Convert to Tenant */}
      {(a.status==="approved"||a.status==="move-in")&&<div className="tp-card" style={{marginTop:12,borderColor:"rgba(74,124,89,.2)",background:"rgba(74,124,89,.03)"}}><h3>🔑 Convert to Tenant</h3>
        <p style={{fontSize:11,color:"#5c4a3a",marginBottom:10}}>Assign a room and create the lease.</p>
        {targetRoom?<button className="btn btn-green" style={{width:"100%"}} onClick={()=>convertToTenant(targetRoom.id,targetProp.id)}>Assign to {a.room} at {a.property} →</button>
        :<>{allVacant.length>0?<div><div style={{fontSize:10,color:"#999",marginBottom:6}}>Choose a vacant room:</div>{allVacant.map(vr=><button key={vr.id} className="btn btn-out btn-sm" style={{marginRight:4,marginBottom:4}} onClick={()=>convertToTenant(vr.id,vr.propId)}>{vr.name} at {vr.propName} ({fmtS(vr.rent)})</button>)}</div>
        :<div style={{fontSize:11,color:"#c45c4a"}}>No vacant rooms available.</div>}</>}
      </div>}

      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Close</button></div>
    </div></div>);})()}

  {modal&&modal.type==="archived"&&(()=>{const a=modal.data;const payMonths=Object.keys(a.payments||{});const totalPaid=Object.values(a.payments||{}).reduce((s,v)=>s+(typeof v==="object"?Object.values(v).reduce((ss,vv)=>ss+vv,0):v),0);
    const moveIn=a.moveIn?new Date(a.moveIn+"T00:00:00"):null;const termDate=a.terminatedDate?new Date(a.terminatedDate+"T00:00:00"):null;
    const tenureDays=moveIn&&termDate?Math.ceil((termDate-moveIn)/(1e3*60*60*24)):null;const tenureMonths=tenureDays?Math.round(tenureDays/30):null;
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:540}}>
      <h2>{a.name} <span className="badge b-gray" style={{verticalAlign:"middle"}}>Past Tenant</span></h2>
      <div className="tp-card"><h3>📞 Contact</h3><div className="tp-row"><span className="tp-label">Phone</span><strong>{a.phone}</strong></div><div className="tp-row"><span className="tp-label">Email</span><strong>{a.email}</strong></div></div>
      <div className="tp-card"><h3>🏠 Room History</h3><div className="tp-row"><span className="tp-label">Property</span><strong>{a.propName}</strong></div><div className="tp-row"><span className="tp-label">Room</span><strong>{a.roomName}</strong></div><div className="tp-row"><span className="tp-label">Rent</span><strong>{fmtS(a.rent)}/mo</strong></div></div>
      <div className="tp-card"><h3>📋 Lease History</h3><div className="tp-row"><span className="tp-label">Move-in</span><strong>{fmtD(a.moveIn)}</strong></div><div className="tp-row"><span className="tp-label">Lease End</span><strong>{fmtD(a.leaseEnd)}</strong></div><div className="tp-row"><span className="tp-label">Terminated</span><strong>{fmtD(a.terminatedDate)}</strong></div>{tenureMonths&&<div className="tp-row"><span className="tp-label">Tenure</span><strong>{tenureMonths} months ({tenureDays} days)</strong></div>}<div className="tp-row"><span className="tp-label">Total Revenue</span><strong style={{color:"#4a7c59"}}>{fmtS(a.rent*(tenureMonths||0))}</strong></div></div>
      <div className="tp-card" style={{background:"rgba(196,92,74,.03)",borderColor:"rgba(196,92,74,.1)"}}><h3 style={{color:"#c45c4a"}}>⚠ Termination</h3><div className="tp-row"><span className="tp-label">Date</span><strong>{fmtD(a.terminatedDate)}</strong></div><div className="tp-row"><span className="tp-label">Reason</span><strong>{a.reason}</strong></div></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Close</button></div>
    </div></div>);})()}

  {editProp!==null&&<PropEditor prop={isNewProp?null:editProp} onSave={saveProp} onClose={()=>setEditProp(null)} isNew={isNewProp} onViewTenant={(r,propName)=>{setEditProp(null);setModal({type:"tenant",data:{...r,propName,propUtils:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).utils||r.utils,propClean:(props.find(p=>p.rooms.some(x=>x.id===r.id))||{}).clean||r.clean}});}}/>}

  {/* Confetti */}
  {showConfetti&&<div className="confetti-wrap">{Array.from({length:60}).map((_,i)=>{const colors=["#d4a853","#4a7c59","#f5f0e8","#c45c4a","#3b82f6"];return(
    <div key={i} className="confetti-piece" style={{left:`${Math.random()*100}%`,background:colors[i%colors.length],width:Math.random()*8+6,height:Math.random()*8+6,borderRadius:Math.random()>0.5?"50%":"2px",animationDuration:`${Math.random()*2+2}s`,animationDelay:`${Math.random()*1.5}s`}}/>
  );})}</div>}

  {/* New Lead Toast */}
  {leadToast&&<div className={`lead-toast ${toastDismissing?"out":""}`}>
    <div style={{textAlign:"center",marginBottom:12}}><div style={{fontSize:14,fontWeight:800,color:"#d4a853",letterSpacing:1.5}}>🎉 NEW LEAD!</div></div>
    <div style={{textAlign:"center",marginBottom:10}}><div style={{fontSize:22,fontWeight:800,color:"#f5f0e8"}}>{leadToast.name}</div></div>
    <div style={{display:"flex",justifyContent:"center",gap:16,fontSize:12,color:"#c4a882",marginBottom:14}}>
      {leadToast.phone&&<span>📞 {leadToast.phone}</span>}
      {leadToast.property&&<span>🏠 {leadToast.property}</span>}
      {leadToast.source&&<span>📍 {leadToast.source}</span>}
    </div>
    <button onClick={viewNewLead} style={{width:"100%",padding:"12px 20px",background:"#d4a853",color:"#1a1714",border:"none",borderRadius:8,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:6}}>View Application →</button>
    <div style={{textAlign:"center"}}><button onClick={dismissToast} style={{background:"none",border:"none",color:"#666",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Dismiss</button></div>
  </div>}

  </>);
}
