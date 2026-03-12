"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { PROPERTIES as DATA_PROPS, SETTINGS as DATA_SETTINGS, THEME as DATA_THEME } from "../../../lib/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";

const uid=()=>Math.random().toString(36).slice(2,9);
const fmt=n=>"$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtS=n=>"$"+Number(n).toLocaleString();
const TODAY=new Date();
const THIS_MONTH=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
const NEXT_MONTH=new Date(TODAY.getFullYear(),TODAY.getMonth()+1,1).toLocaleString("default",{month:"long",year:"numeric"});

const THEME_LABELS={bg:"Background",card:"Card Dark",accent:"Accent / Brand",text:"Light Text",muted:"Muted Text",surface:"Light Surface",surfaceAlt:"Surface Alt",green:"Success Green",dark:"Dark Text",warm:"Warm Gray"};
const PRESETS={"Warm Lodge":{...DATA_THEME},"Midnight":{bg:"#0f1729",card:"#1a2540",accent:"#3b82f6",text:"#e8ecf4",muted:"#8899b8",surface:"#fafbfe",surfaceAlt:"#eef2f9",green:"#22c55e",dark:"#0f1729",warm:"#64748b"},"Forest":{bg:"#1a2e1a",card:"#243524",accent:"#7cb342",text:"#e8f0e4",muted:"#a3b89a",surface:"#fafcf8",surfaceAlt:"#eef3ea",green:"#7cb342",dark:"#1a2e1a",warm:"#5a6b52"},"Charcoal":{bg:"#1c1c1e",card:"#2c2c2e",accent:"#d97756",text:"#f0edea",muted:"#a8a29e",surface:"#faf9f7",surfaceAlt:"#f0eeeb",green:"#5b9a6f",dark:"#1c1c1e",warm:"#78716c"}};
function hslHex(h,s,l){s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h/30)%12;const c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,'0');};return`#${f(0)}${f(8)}${f(4)}`;}
function randPalette(){const h=Math.floor(Math.random()*360);const c=(h+150+Math.random()*60)%360;return{bg:hslHex(h,22+Math.random()*25,8+Math.random()*4),card:hslHex(h,18+Math.random()*20,14+Math.random()*4),accent:hslHex(c,65+Math.random()*25,55+Math.random()*15),text:hslHex(h,8+Math.random()*12,92+Math.random()*6),muted:hslHex(h,12+Math.random()*18,62+Math.random()*12),surface:hslHex(c,3+Math.random()*8,97+Math.random()*2),surfaceAlt:hslHex(c,5+Math.random()*10,93+Math.random()*3),green:hslHex(145+Math.random()*25,45+Math.random()*25,42+Math.random()*12),dark:hslHex(h,22+Math.random()*18,7+Math.random()*4),warm:hslHex(h,10+Math.random()*15,42+Math.random()*12)};}
function contrast(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return(r*299+g*587+b*114)/1000>128?"#1a1a1a":"#fff";}

// Convert data.js format to admin format
function initProps(){return DATA_PROPS.map(p=>({...p,rooms:p.rooms.map(r=>({...r,rent:r.rent,roomStatus:r.status||r.roomStatus||"vacant"}))}));}
function initPayments(){const pay={};DATA_PROPS.forEach(pr=>pr.rooms.forEach(r=>{const st=r.status||r.roomStatus;if(st==="occupied")pay[r.id]={[THIS_MONTH]:Math.random()>0.2?r.rent:0};}));return pay;}

const DEF_ROCKS=[
  {id:uid(),title:"Fill Holmes House Bedroom 4",owner:"Harrison",status:"on-track",due:"2026-06-30"},
  {id:uid(),title:"Capture Insta360 tours for all properties",owner:"Harrison",status:"off-track",due:"2026-06-30"},
  {id:uid(),title:"Set up Stripe rent collection",owner:"Harrison",status:"not-started",due:"2026-06-30"},
];
const DEF_ISSUES=[
  {id:uid(),title:"David Park lease expiring soon — renew or find replacement",priority:"high"},
  {id:uid(),title:"Replace stock photos with real property images",priority:"medium"},
  {id:uid(),title:"Add password protection to admin pages",priority:"high"},
];
const DEF_SC=[
  {id:"occ",label:"Occupancy Rate",goal:100,unit:"%",weeks:{"W10":82,"W9":82,"W8":91}},
  {id:"coll",label:"Collection Rate",goal:100,unit:"%",weeks:{"W10":85,"W9":100,"W8":100}},
  {id:"vacancy",label:"Vacancy Cost",goal:0,unit:"$",weeks:{"W10":1250,"W9":1250,"W8":600}},
  {id:"leads",label:"New Leads",goal:5,unit:"",weeks:{"W10":3,"W9":2,"W8":4}},
];

const S = `
*{margin:0;padding:0;box-sizing:border-box}
.app{display:flex;height:100vh;overflow:hidden;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#1a1714}
.side{width:240px;background:#1a1714;padding:18px 0;display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto}
.slogo{padding:0 18px 20px;font-size:16px;font-weight:800;color:#f5f0e8;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:8px}
.slogo span{color:#d4a853}
.slbl{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(196,168,130,.3);padding:18px 18px 6px}
.sn{display:flex;align-items:center;gap:9px;padding:10px 14px;margin:1px 8px;border-radius:8px;font-size:12.5px;font-weight:500;color:rgba(245,240,232,.5);cursor:pointer;border:none;background:none;width:calc(100% - 16px);text-align:left;font-family:inherit;transition:all .12s}
.sn:hover{background:rgba(255,255,255,.05);color:#f5f0e8}.sn.on{background:rgba(212,168,83,.15);color:#d4a853;font-weight:700}
.si{font-size:15px;width:20px;text-align:center}
.sn-link{display:flex;align-items:center;gap:9px;padding:10px 14px;margin:1px 8px;border-radius:8px;font-size:12.5px;font-weight:500;color:rgba(245,240,232,.5);text-decoration:none;transition:all .12s}
.sn-link:hover{background:rgba(255,255,255,.05);color:#f5f0e8}
.mn{flex:1;overflow-y:auto;background:#f4f3f0}
.tbar{background:#fff;padding:16px 28px;border-bottom:1px solid rgba(0,0,0,.05);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
.tbar h1{font-size:18px;font-weight:800}.tbar-sub{font-size:11px;color:#999;margin-top:2px}
.cnt{padding:24px 28px}
.btn{padding:8px 16px;border-radius:8px;border:none;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .12s}
.btn:hover{transform:translateY(-1px)}
.btn-gold{background:#d4a853;color:#1a1714}.btn-dark{background:#1a1714;color:#f5f0e8}
.btn-out{background:#fff;border:1px solid rgba(0,0,0,.1);color:#1a1714}.btn-out:hover{border-color:#d4a853}
.btn-green{background:#4a7c59;color:#fff}.btn-red{background:rgba(196,92,74,.1);color:#c45c4a}
.btn-sm{padding:5px 10px;font-size:10px;border-radius:6px}
.kgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.kpi{background:#fff;border-radius:12px;padding:18px;border:1px solid rgba(0,0,0,.04);cursor:pointer;transition:all .2s}
.kpi:hover{border-color:rgba(212,168,83,.3);box-shadow:0 4px 16px rgba(0,0,0,.06)}
.kpi.active{border-color:rgba(212,168,83,.4);box-shadow:0 4px 20px rgba(212,168,83,.15)}
.kl{font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
.kv{font-size:26px;font-weight:800;line-height:1}.ks{font-size:11px;margin-top:4px}
.kpi-click{font-size:9px;color:#c4a882;margin-top:6px;opacity:0;transition:opacity .2s}
.kpi:hover .kpi-click{opacity:1}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.drill{background:#fff;border-radius:14px;border:1px solid rgba(212,168,83,.2);padding:24px;margin-bottom:24px;animation:fadeIn .3s}
.drill-title{font-size:15px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between}
.drill-close{background:none;border:1px solid rgba(0,0,0,.1);border-radius:6px;padding:4px 12px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;color:#999}
.drill-close:hover{border-color:#c45c4a;color:#c45c4a}
.drill-row{display:flex;align-items:center;padding:12px 16px;border-radius:10px;margin-bottom:6px;gap:12px;transition:background .1s;border:1px solid rgba(0,0,0,.03);cursor:pointer}
.drill-row:hover{background:rgba(0,0,0,.015);border-color:rgba(0,0,0,.06)}
.drill-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.drill-info{flex:1;min-width:0}.drill-name{font-size:13px;font-weight:700}
.drill-sub{font-size:11px;color:#999;margin-top:1px}.drill-sub2{font-size:10px;color:#c4a882;margin-top:2px}
.drill-val{font-size:15px;font-weight:800;text-align:right;min-width:80px}
.drill-section{font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;padding:12px 0 8px;border-bottom:1px solid rgba(0,0,0,.05);margin-bottom:8px}
.drill-stat{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.03);font-size:13px}
.drill-stat:last-child{border-bottom:none}.drill-stat strong{font-weight:800}
.sc-table{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,.04);margin-bottom:16px}
.sc-table th{text-align:left;padding:12px 16px;font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid rgba(0,0,0,.05)}
.sc-table td{padding:10px 16px;font-size:13px;border-bottom:1px solid rgba(0,0,0,.03)}
.sc-table tr:hover td{background:rgba(212,168,83,.02)}
.sc-goal{font-size:11px;color:#999;font-weight:600}
.sc-val{font-weight:800;font-size:14px;text-align:center;min-width:56px}
.sc-good{color:#4a7c59;background:rgba(74,124,89,.06);border-radius:6px;padding:4px 8px}
.sc-bad{color:#c45c4a;background:rgba(196,92,74,.06);border-radius:6px;padding:4px 8px}
.sc-drill{background:rgba(212,168,83,.04);border-radius:10px;padding:16px;margin-bottom:16px;animation:fadeIn .3s}
.rock{display:flex;align-items:center;padding:14px 18px;background:#fff;border-radius:10px;border:1px solid rgba(0,0,0,.04);margin-bottom:8px;gap:14px}
.rock:hover{border-color:rgba(212,168,83,.2)}
.rock-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;cursor:pointer}
.rock-on{background:#4a7c59}.rock-off{background:#c45c4a}.rock-ns{background:#999}.rock-done{background:#4a7c59}
.rock-info{flex:1}.rock-title{font-size:13px;font-weight:700}.rock-meta{font-size:11px;color:#999;margin-top:2px}
.issue{display:flex;align-items:center;padding:12px 16px;background:#fff;border-radius:10px;border:1px solid rgba(0,0,0,.04);margin-bottom:6px;gap:12px}
.issue:hover{border-color:rgba(212,168,83,.2)}
.issue-pri{font-size:14px;flex-shrink:0;cursor:pointer}.issue-title{flex:1;font-size:13px;font-weight:600}
.pc{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.04);margin-bottom:12px;overflow:hidden}
.pc-head{padding:16px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}.pc-head:hover{background:rgba(0,0,0,.01)}
.pc-nm{font-size:15px;font-weight:800}.pc-addr{font-size:11px;color:#999}
.ptg{font-size:9px;font-weight:700;padding:2px 8px;border-radius:100px;display:inline-block;margin-right:4px}
.ptg-ok{background:rgba(74,124,89,.1);color:#4a7c59}.ptg-vc{background:rgba(196,92,74,.1);color:#c45c4a}.ptg-t{background:rgba(0,0,0,.04);color:#999}
.rm{display:flex;align-items:center;padding:12px 20px;border-top:1px solid rgba(0,0,0,.03);gap:10px}.rm:hover{background:rgba(0,0,0,.01)}
.rm-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}.rm-o{background:#4a7c59}.rm-v{background:#c45c4a}.rm-l{background:#d4a853}
.rm-i{flex:1}.rm-n{font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px}
.rm-t{font-size:11px;color:#999;margin-top:1px}
.rbdg{font-size:8px;padding:2px 6px;border-radius:100px;font-weight:700}
.rb-p{background:rgba(74,124,89,.08);color:#4a7c59}.rb-s{background:rgba(0,0,0,.04);color:#999}
.rm-r{font-size:14px;font-weight:800;min-width:70px;text-align:right}
.rm-pd{font-size:10px;font-weight:600;text-align:right;margin-top:1px}.rm-y{color:#4a7c59}.rm-nn{color:#c45c4a}
.chart-wrap{background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,.04);margin-bottom:16px;overflow:hidden}
.chart-header{padding:16px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer}.chart-header:hover{background:rgba(0,0,0,.01)}
.chart-header h3{font-size:14px;font-weight:800}.chart-toggle{font-size:11px;color:#999;font-weight:600}
.chart-body{padding:0 20px 20px}
.sec-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.sec-hd h2{font-size:16px;font-weight:800}.sec-hd p{font-size:11px;color:#999;margin-top:1px}
.fld{margin-bottom:12px}
.fld label{display:block;font-size:10px;font-weight:700;color:#999;margin-bottom:4px;text-transform:uppercase;letter-spacing:.3px}
.fld input,.fld select,.fld textarea{width:100%;padding:9px 12px;border-radius:8px;border:1px solid rgba(0,0,0,.1);font-family:inherit;font-size:13px;outline:none;background:#faf9f7}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:#d4a853}
.fld textarea{resize:vertical;min-height:70px}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.fr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.mbg{position:fixed;inset:0;background:rgba(26,23,20,.6);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.mbox{background:#fff;border-radius:16px;max-width:640px;width:100%;max-height:85vh;overflow-y:auto;padding:24px}
.mbox h2{font-size:17px;font-weight:800;margin-bottom:16px}
.mft{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(0,0,0,.05)}
.tenant-card{background:rgba(0,0,0,.02);border-radius:12px;padding:20px;margin-bottom:12px}
.tenant-card h4{font-size:14px;font-weight:800;margin-bottom:4px}
.tenant-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.04);font-size:13px}
.tenant-row:last-child{border-bottom:none}
.tenant-label{color:#999;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
.undo-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1a1714;color:#f5f0e8;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:200;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,.3);animation:fadeIn .3s}
.undo-btn{background:#d4a853;color:#1a1714;border:none;padding:6px 14px;border-radius:6px;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer}
.undo-dismiss{background:none;border:none;color:rgba(245,240,232,.5);cursor:pointer;font-size:16px;padding:0 4px}
.cr{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#fff;border-radius:10px;border:1px solid rgba(0,0,0,.04);margin-bottom:6px}
.csw{width:38px;height:38px;border-radius:8px;border:2px solid rgba(0,0,0,.08);cursor:pointer;position:relative;overflow:hidden;flex-shrink:0}
.csw input{position:absolute;inset:-8px;width:56px;height:56px;opacity:0;cursor:pointer}
.cinfo{flex:1}.cinfo span{font-size:12px;font-weight:700}
.chex{width:80px;padding:7px 8px;border-radius:6px;border:1px solid rgba(0,0,0,.1);font-family:monospace;font-size:11px;font-weight:600;text-align:center;outline:none;background:#f8f8f8}
.chex:focus{border-color:#d4a853}
@media(max-width:768px){.side{display:none}.kgrid{grid-template-columns:1fr 1fr}.cnt{padding:20px 16px}}
`;

function TenantModal({room,propName,payments,onClose,thisMonth}){
  if(!room||!room.tenant)return null;
  const t=room.tenant;const paid=payments[room.id]?.[thisMonth]||0;
  const leaseEnd=new Date(t.leaseEnd);const daysLeft=Math.ceil((leaseEnd-TODAY)/(1e3*60*60*24));
  const leaseStart=new Date(t.leaseStart);const pct=Math.min(100,Math.max(0,(TODAY-leaseStart)/(leaseEnd-leaseStart)*100));
  return (<div className="mbg" onClick={onClose}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
    <h2>{t.name}</h2>
    <div className="tenant-card"><h4>Contact</h4>
      <div className="tenant-row"><span className="tenant-label">Phone</span><span style={{fontWeight:700}}>{t.phone}</span></div>
      <div className="tenant-row"><span className="tenant-label">Email</span><span style={{fontWeight:700}}>{t.email||"—"}</span></div></div>
    <div className="tenant-card"><h4>Room</h4>
      <div className="tenant-row"><span className="tenant-label">Property</span><span style={{fontWeight:700}}>{propName}</span></div>
      <div className="tenant-row"><span className="tenant-label">Room</span><span style={{fontWeight:700}}>{room.name}</span></div>
      <div className="tenant-row"><span className="tenant-label">Bath</span><span style={{fontWeight:700}}>{room.privateBath?"Private":"Shared"}</span></div>
      <div className="tenant-row"><span className="tenant-label">Rent</span><span style={{fontWeight:800,fontSize:16}}>{fmtS(room.rent)}/mo</span></div></div>
    <div className="tenant-card"><h4>Lease</h4>
      <div className="tenant-row"><span className="tenant-label">Start</span><span style={{fontWeight:700}}>{t.leaseStart}</span></div>
      <div className="tenant-row"><span className="tenant-label">End</span><span style={{fontWeight:700,color:daysLeft<=30?"#c45c4a":daysLeft<=90?"#d4a853":"#1a1714"}}>{t.leaseEnd}</span></div>
      <div className="tenant-row"><span className="tenant-label">Days Left</span><span style={{fontWeight:800,color:daysLeft<=30?"#c45c4a":daysLeft<=90?"#d4a853":"#4a7c59"}}>{daysLeft}</span></div>
      <div style={{height:8,borderRadius:4,background:"#e5e3df",marginTop:8}}><div style={{height:"100%",borderRadius:4,width:`${pct}%`,background:daysLeft<=30?"#c45c4a":daysLeft<=90?"#d4a853":"#4a7c59"}}/></div></div>
    <div className="tenant-card"><h4>Payment — {thisMonth}</h4>
      <div className="tenant-row"><span className="tenant-label">Status</span><span style={{fontWeight:700,color:paid?"#4a7c59":"#c45c4a"}}>{paid?`Paid ${fmtS(paid)}`:`Unpaid — ${fmtS(room.rent)} due`}</span></div></div>
    {daysLeft<=90&&<div style={{background:"rgba(212,168,83,.08)",borderRadius:10,padding:14,fontSize:13,color:"#5c4a3a"}}><strong>Action Needed:</strong> Lease expires in {daysLeft} days. Follow up with {t.name.split(" ")[0]} about renewal. Revenue at risk: {fmtS(room.rent)}/mo ({fmtS(room.rent*12)}/yr).</div>}
    <div className="mft"><button className="btn btn-out" onClick={onClose}>Close</button></div>
  </div></div>);
}

export default function AdminDashboard(){
  const[tab,setTab]=useState("scorecard");
  const[props]=useState(initProps);
  const[settings,setSettings]=useState({...DATA_SETTINGS});
  const[theme,setTheme]=useState({...DATA_THEME});
  const[rocks,setRocks]=useState(DEF_ROCKS);
  const[issues,setIssues]=useState(DEF_ISSUES);
  const[scorecard,setScorecard]=useState(DEF_SC);
  const[payments,setPayments]=useState(initPayments);
  const[expanded,setExpanded]=useState({});
  const[drillKpi,setDrillKpi]=useState(null);
  const[showCharts,setShowCharts]=useState(true);
  const[scDrill,setScDrill]=useState(null);
  const[tenantModal,setTenantModal]=useState(null);
  const[undoStack,setUndoStack]=useState([]);
  const[expenses,setExpenses]=useState([]);
  const[showExpense,setShowExpense]=useState(false);

  const toggle=id=>setExpanded(p=>({...p,[id]:!p[id]}));

  const metrics=useMemo(()=>{
    let total=0,occ=0,full=0,proj=0,coll=0,due=0;const vacs=[],expiring=[],paid=[],unpaid=[];
    const propBreakdown=props.map(pr=>{
      const occR=pr.rooms.filter(r=>r.roomStatus==="occupied"),vacR=pr.rooms.filter(r=>r.roomStatus!=="occupied");
      const prj=occR.reduce((s,r)=>s+r.rent,0),fl=pr.rooms.reduce((s,r)=>s+r.rent,0);
      const cl=occR.reduce((s,r)=>s+(payments[r.id]?.[THIS_MONTH]||0),0);
      pr.rooms.forEach(r=>{total++;full+=r.rent;const info={...r,propName:pr.name,propId:pr.id,propType:pr.type};
        if(r.roomStatus==="occupied"){occ++;proj+=r.rent;due+=r.rent;const pd=payments[r.id]?.[THIS_MONTH]||0;coll+=pd;
          if(pd)paid.push({...info,paidAmt:pd});else unpaid.push(info);
          if(r.tenant?.leaseEnd){const d=Math.ceil((new Date(r.tenant.leaseEnd)-TODAY)/(1e3*60*60*24));if(d<=90)expiring.push({...info,daysLeft:d});}
        }else vacs.push(info);});
      return{...pr,occCount:occR.length,vacCount:vacR.length,projected:prj,fullOcc:fl,collected:cl};
    });
    return{total,occ,full,proj,coll,due,vacs,expiring,paid,unpaid,propBreakdown,occRate:total?Math.round(occ/total*100):0,collRate:due?Math.round(coll/due*100):0,lost:full-proj};
  },[props,payments]);

  const recordPay=(rid)=>{
    const r=props.flatMap(p=>p.rooms).find(x=>x.id===rid);
    if(r){const prev=payments[rid]?.[THIS_MONTH]||0;
      setUndoStack(s=>[{type:"payment",roomId:rid,month:THIS_MONTH,prevAmount:prev,newAmount:r.rent,tenantName:r.tenant?.name||"Unknown",ts:Date.now()},...s].slice(0,20));
      setPayments(p=>({...p,[rid]:{...p[rid],[THIS_MONTH]:r.rent}}));}
  };
  const undoPayment=(a)=>{setPayments(p=>({...p,[a.roomId]:{...p[a.roomId],[a.month]:a.prevAmount}}));setUndoStack(s=>s.filter(x=>x.ts!==a.ts));};
  const cycleRock=id=>setRocks(p=>p.map(r=>{if(r.id!==id)return r;const o=["on-track","off-track","not-started","done"];return{...r,status:o[(o.indexOf(r.status)+1)%o.length]};}));

  const tabs=[{id:"scorecard",icon:"📊",label:"Scorecard"},{id:"rocks",icon:"🪨",label:"Rocks"},{id:"issues",icon:"⚠️",label:"Issues"},{id:"finance",icon:"💰",label:"Finances"},{id:"site-settings",icon:"⚙️",label:"Site Settings"},{id:"theme",icon:"🎨",label:"Theme"}];

  return (<><style>{S}</style><div className="app">
    <div className="side">
      <div className="slogo">🐻 Black Bear <span>HQ</span></div>
      <div className="slbl">Traction</div>
      {tabs.slice(0,3).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}><span className="si">{t.icon}</span>{t.label}</button>)}
      <div className="slbl">Property Mgmt</div>
      <button className={`sn ${tab==="finance"?"on":""}`} onClick={()=>setTab("finance")}><span className="si">💰</span>Finances</button>
      <div className="slbl">Website</div>
      {tabs.slice(4).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}><span className="si">{t.icon}</span>{t.label}</button>)}
      <div style={{marginTop:"auto",padding:"14px 18px",borderTop:"1px solid rgba(255,255,255,.06)"}}>
        <Link href="/" className="sn-link"><span className="si">🌐</span>View Public Site</Link>
        <p style={{fontSize:9,color:"rgba(196,168,130,.25)",padding:"8px 6px 0"}}>Black Bear HQ</p>
      </div>
    </div>

    <div className="mn">
      <div className="tbar"><div><h1>{tabs.find(t=>t.id===tab)?.icon||"💰"} {tabs.find(t=>t.id===tab)?.label||"Finances"}</h1><div className="tbar-sub">{THIS_MONTH}</div></div></div>
      <div className="cnt">

      {/* SCORECARD */}
      {tab==="scorecard"&&<>
        <div className="kgrid">
          <div className={`kpi ${drillKpi==="occ"?"active":""}`} onClick={()=>setDrillKpi(drillKpi==="occ"?null:"occ")}><div className="kl">🏠 Occupancy</div><div className="kv" style={{color:metrics.occRate>=90?"#4a7c59":"#c45c4a"}}>{metrics.occRate}%</div><div className="ks">{metrics.occ}/{metrics.total} rooms</div><div className="kpi-click">Click to investigate →</div></div>
          <div className={`kpi ${drillKpi==="coll"?"active":""}`} onClick={()=>setDrillKpi(drillKpi==="coll"?null:"coll")}><div className="kl">💰 Collection</div><div className="kv" style={{color:metrics.collRate>=90?"#4a7c59":"#c45c4a"}}>{metrics.collRate}%</div><div className="ks">{fmtS(metrics.coll)} of {fmtS(metrics.due)}</div><div className="kpi-click">Click to see who paid →</div></div>
          <div className={`kpi ${drillKpi==="vac"?"active":""}`} onClick={()=>setDrillKpi(drillKpi==="vac"?null:"vac")}><div className="kl">💸 Vacancy Cost</div><div className="kv" style={{color:metrics.lost>0?"#c45c4a":"#4a7c59"}}>{fmtS(metrics.lost)}</div><div className="ks">/month lost</div><div className="kpi-click">Click for details →</div></div>
          <div className={`kpi ${drillKpi==="proj"?"active":""}`} onClick={()=>setDrillKpi(drillKpi==="proj"?null:"proj")}><div className="kl">📈 Projected</div><div className="kv">{fmtS(metrics.proj)}</div><div className="ks">of {fmtS(metrics.full)} at 100%</div><div className="kpi-click">Click for breakdown →</div></div>
        </div>

        {/* Drill: Occupancy */}
        {drillKpi==="occ"&&<div className="drill"><div className="drill-title"><span>🏠 Occupancy — {metrics.occ}/{metrics.total} Rooms</span><button className="drill-close" onClick={()=>setDrillKpi(null)}>✕</button></div>
          {metrics.propBreakdown.map(pr=>{const pct=pr.rooms.length?pr.occCount/pr.rooms.length*100:0;return (<div key={pr.id} style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:800}}>{pr.name}</span><span className="rbdg" style={{background:pr.vacCount?"rgba(196,92,74,.1)":"rgba(74,124,89,.1)",color:pr.vacCount?"#c45c4a":"#4a7c59"}}>{pr.occCount}/{pr.rooms.length} — {Math.round(pct)}%</span></div>
            <div style={{height:6,borderRadius:3,background:"#e5e3df",marginBottom:10}}><div style={{height:"100%",borderRadius:3,background:pct>=100?"#4a7c59":"#c45c4a",width:`${pct}%`}}/></div>
            {pr.rooms.map(r=>{const isV=r.roomStatus!=="occupied";const dl=r.tenant?.leaseEnd?Math.ceil((new Date(r.tenant.leaseEnd)-TODAY)/(1e3*60*60*24)):null;return (
              <div key={r.id} className="drill-row" onClick={()=>{if(r.tenant)setTenantModal({room:r,propName:pr.name});}}>
                <div className="drill-dot" style={{background:isV?"#c45c4a":"#4a7c59"}}/>
                <div className="drill-info"><div className="drill-name">{r.name} <span className={`rbdg ${r.privateBath?"rb-p":"rb-s"}`}>{r.privateBath?"Priv":"Shared"}</span></div>
                  {r.tenant?<div className="drill-sub">{r.tenant.name} · {r.tenant.phone} <span style={{color:"#c4a882",fontSize:10}}>→ profile</span></div>:<div className="drill-sub" style={{color:"#c45c4a",fontWeight:600}}>Vacant — losing {fmtS(r.rent)}/mo</div>}
                  {dl!==null&&dl<=90&&<div className="drill-sub2" style={{color:dl<=30?"#c45c4a":"#d4a853"}}>⚠ Lease expires in {dl} days</div>}</div>
                <div className="drill-val">{fmtS(r.rent)}<small style={{fontSize:10,color:"#999"}}>/mo</small></div>
              </div>);})}
          </div>);})}</div>}

        {/* Drill: Collection */}
        {drillKpi==="coll"&&<div className="drill"><div className="drill-title"><span>💰 Collection — {THIS_MONTH}</span><button className="drill-close" onClick={()=>setDrillKpi(null)}>✕</button></div>
          {metrics.unpaid.length>0&&<><div className="drill-section">🔴 Unpaid ({metrics.unpaid.length})</div>
            {metrics.unpaid.map(r=>(<div key={r.id} className="drill-row" style={{borderColor:"rgba(196,92,74,.1)"}} onClick={()=>setTenantModal({room:r,propName:r.propName})}>
              <div className="drill-dot" style={{background:"#c45c4a"}}/><div className="drill-info"><div className="drill-name">{r.tenant?.name} <span style={{color:"#c4a882",fontSize:10}}>→ profile</span></div><div className="drill-sub">{r.propName} · {r.name} · {r.tenant?.phone}</div></div>
              <div style={{textAlign:"right"}}><div className="drill-val" style={{color:"#c45c4a"}}>{fmtS(r.rent)}</div><button className="btn btn-green btn-sm" style={{marginTop:4}} onClick={e=>{e.stopPropagation();recordPay(r.id);}}>✓ Paid</button></div></div>))}</>}
          {metrics.paid.length>0&&<><div className="drill-section">✅ Paid ({metrics.paid.length})</div>
            {metrics.paid.map(r=>(<div key={r.id} className="drill-row" onClick={()=>setTenantModal({room:r,propName:r.propName})}>
              <div className="drill-dot" style={{background:"#4a7c59"}}/><div className="drill-info"><div className="drill-name">{r.tenant?.name}</div><div className="drill-sub">{r.propName} · {r.name}</div></div>
              <div className="drill-val" style={{color:"#4a7c59"}}>{fmtS(r.paidAmt)}</div></div>))}</>}
          <div style={{marginTop:16,padding:16,background:"rgba(0,0,0,.02)",borderRadius:10}}>
            <div className="drill-stat"><span>Total Due</span><strong>{fmtS(metrics.due)}</strong></div>
            <div className="drill-stat"><span>Collected</span><strong style={{color:"#4a7c59"}}>{fmtS(metrics.coll)}</strong></div>
            <div className="drill-stat"><span>Outstanding</span><strong style={{color:metrics.due-metrics.coll>0?"#c45c4a":"#4a7c59"}}>{fmtS(metrics.due-metrics.coll)}</strong></div></div></div>}

        {/* Drill: Vacancy */}
        {drillKpi==="vac"&&<div className="drill"><div className="drill-title"><span>💸 Vacancy — {fmtS(metrics.lost)}/mo Lost</span><button className="drill-close" onClick={()=>setDrillKpi(null)}>✕</button></div>
          {metrics.vacs.length===0?<div style={{textAlign:"center",padding:32,color:"#4a7c59",fontSize:40}}>🎉 Fully Occupied!</div>:
          <>{metrics.vacs.map(r=>(<div key={r.id} className="drill-row" style={{borderColor:"rgba(196,92,74,.12)"}}>
            <div className="drill-dot" style={{background:"#c45c4a"}}/><div className="drill-info"><div className="drill-name">{r.name} at {r.propName}</div><div className="drill-sub">{r.privateBath?"Private":"Shared"} Bath · {r.propType}</div></div>
            <div className="drill-val" style={{color:"#c45c4a"}}>{fmtS(r.rent)}<small style={{fontSize:10,color:"#999"}}>/mo</small></div></div>))}
            <div style={{marginTop:16,padding:16,background:"rgba(196,92,74,.04)",borderRadius:10}}>
              <div className="drill-stat"><span>Monthly Lost</span><strong style={{color:"#c45c4a"}}>{fmtS(metrics.lost)}</strong></div>
              <div className="drill-stat"><span>Annual Lost</span><strong style={{color:"#c45c4a"}}>{fmtS(metrics.lost*12)}</strong></div></div></>}</div>}

        {/* Drill: Projected */}
        {drillKpi==="proj"&&<div className="drill"><div className="drill-title"><span>📈 Projected — {NEXT_MONTH}</span><button className="drill-close" onClick={()=>setDrillKpi(null)}>✕</button></div>
          {metrics.propBreakdown.map(pr=>(<div key={pr.id} style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:800}}>{pr.name}</span><div><span style={{fontSize:12,color:"#999",marginRight:12}}>Full: {fmtS(pr.fullOcc)}</span><span style={{fontWeight:800}}>{fmtS(pr.projected)}</span>{pr.vacCount>0&&<span style={{color:"#c45c4a",fontWeight:700,marginLeft:8}}>-{fmtS(pr.fullOcc-pr.projected)}</span>}</div></div>
            {pr.rooms.map(r=>{const isV=r.roomStatus!=="occupied";return (<div key={r.id} className="drill-row"><div className="drill-dot" style={{background:isV?"#c45c4a":"#4a7c59"}}/><div className="drill-info"><div className="drill-name">{r.name}</div><div className="drill-sub">{isV?"Vacant":r.tenant?.name||"Occupied"}</div></div><div className="drill-val" style={{color:isV?"#c45c4a":"#1a1714"}}>{isV?<s style={{opacity:.4}}>{fmtS(r.rent)}</s>:fmtS(r.rent)}</div></div>);})}
          </div>))}</div>}

        {/* Charts */}
        <div className="chart-wrap"><div className="chart-header" onClick={()=>setShowCharts(!showCharts)}><h3>📈 Visual Trends</h3><span className="chart-toggle">{showCharts?"▾ Collapse":"▸ Expand"}</span></div>
          {showCharts&&<div className="chart-body"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div><div style={{fontSize:12,fontWeight:700,color:"#999",marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Revenue by Property</div>
              <ResponsiveContainer width="100%" height={200}><BarChart data={metrics.propBreakdown.map(p=>({name:p.name.split(" ").slice(0,2).join(" "),Projected:p.projected,Lost:p.fullOcc-p.projected}))}>
                <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`$${v/1000}k`}/><Tooltip formatter={v=>`$${v.toLocaleString()}`}/>
                <Bar dataKey="Projected" fill="#4a7c59" radius={[4,4,0,0]}/><Bar dataKey="Lost" fill="#c45c4a" radius={[4,4,0,0]}/>
              </BarChart></ResponsiveContainer></div>
            <div><div style={{fontSize:12,fontWeight:700,color:"#999",marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Occupancy</div>
              <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={[{name:"Occupied",value:metrics.occ},{name:"Vacant",value:metrics.total-metrics.occ}]} cx="50%" cy="50%" outerRadius={70} innerRadius={45} paddingAngle={3} dataKey="value"><Cell fill="#4a7c59"/><Cell fill="#c45c4a"/></Pie><Tooltip/></PieChart></ResponsiveContainer>
              <div style={{textAlign:"center"}}><span style={{fontSize:11,color:"#4a7c59",fontWeight:700,marginRight:12}}>● {metrics.occ} Occupied</span><span style={{fontSize:11,color:"#c45c4a",fontWeight:700}}>● {metrics.total-metrics.occ} Vacant</span></div></div>
          </div>
          <div style={{marginTop:20}}><div style={{fontSize:12,fontWeight:700,color:"#999",marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Weekly Trends</div>
            <ResponsiveContainer width="100%" height={180}><LineChart data={["W8","W9","W10"].map(w=>({week:w,...Object.fromEntries(scorecard.map(s=>[s.label,s.weeks[w]||0]))}))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="week" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Legend wrapperStyle={{fontSize:11}}/>
              <Line type="monotone" dataKey="Occupancy Rate" stroke="#4a7c59" strokeWidth={2} dot={{r:4}}/><Line type="monotone" dataKey="Collection Rate" stroke="#3b82f6" strokeWidth={2} dot={{r:4}}/><Line type="monotone" dataKey="New Leads" stroke="#d4a853" strokeWidth={2} dot={{r:4}}/>
            </LineChart></ResponsiveContainer></div>
          </div>}</div>

        {/* Weekly Scorecard */}
        <div className="sec-hd"><div><h2>Weekly Scorecard</h2><p>Click row labels to drill in, click numbers to edit</p></div></div>
        <table className="sc-table"><thead><tr><th>Measurable</th><th>Goal</th><th>W10</th><th>W9</th><th>W8</th></tr></thead><tbody>
          {scorecard.map((s,si)=>(<tr key={s.id}><td style={{fontWeight:700,cursor:"pointer"}} onClick={()=>setScDrill(scDrill===s.id?null:s.id)}>{s.label} <span style={{fontSize:10,color:"#c4a882"}}>{scDrill===s.id?"▾":"▸"}</span></td><td className="sc-goal">{s.unit==="$"?fmtS(s.goal):s.goal}{s.unit==="%"?"%":""}</td>
            {["W10","W9","W8"].map(w=>{const v=s.weeks[w]||0;const isGood=s.id==="vacancy"?(v<=s.goal):(v>=s.goal);return (
              <td key={w} style={{textAlign:"center"}}><span className={`sc-val ${isGood?"sc-good":"sc-bad"}`} contentEditable suppressContentEditableWarning
                onBlur={e=>{const nv=Number(e.target.textContent.replace(/[^0-9.]/g,""));if(!isNaN(nv)){const ns=[...scorecard];ns[si]={...ns[si],weeks:{...ns[si].weeks,[w]:nv}};setScorecard(ns);}}}>{s.unit==="$"?fmtS(v):v}{s.unit==="%"?"%":""}</span></td>);})}</tr>))}
        </tbody></table>
        {scDrill&&<div className="sc-drill"><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:800,fontSize:13}}>{scorecard.find(s=>s.id===scDrill)?.label}</span><button className="drill-close" onClick={()=>setScDrill(null)}>✕</button></div>
          {scDrill==="occ"&&<p style={{fontSize:13,color:"#5c4a3a"}}>Currently <strong>{metrics.occRate}%</strong> ({metrics.occ}/{metrics.total}). {metrics.vacs.length>0?`Fill: ${metrics.vacs.map(v=>v.name+" at "+v.propName).join(", ")}`:"All rooms filled!"}</p>}
          {scDrill==="coll"&&<p style={{fontSize:13,color:"#5c4a3a"}}><strong>{metrics.collRate}%</strong> collected. {metrics.unpaid.length>0?`Outstanding: ${metrics.unpaid.map(r=>r.tenant?.name).join(", ")} — ${fmtS(metrics.due-metrics.coll)}`:"All collected!"}</p>}
          {scDrill==="vacancy"&&<p style={{fontSize:13,color:"#5c4a3a"}}><strong>{fmtS(metrics.lost)}</strong>/mo lost. {metrics.vacs.length} empty room{metrics.vacs.length!==1?"s":""}. Annual impact: <strong style={{color:"#c45c4a"}}>{fmtS(metrics.lost*12)}</strong></p>}
          {scDrill==="leads"&&<p style={{fontSize:13,color:"#5c4a3a"}}>Track inquiries from website, calls, and walk-ins. If low, post on Facebook Marketplace, Craigslist, or local housing boards.</p>}
        </div>}

        {/* Expiring Leases */}
        {metrics.expiring.length>0&&<><div className="sec-hd"><div><h2>⚠️ Leases Expiring Soon</h2><p>Click for tenant details</p></div></div>
          {metrics.expiring.sort((a,b)=>a.daysLeft-b.daysLeft).map(r=><div key={r.id} className="issue" style={{cursor:"pointer"}} onClick={()=>setTenantModal({room:r,propName:r.propName})}>
            <span className="issue-pri">{r.daysLeft<=30?"🔴":"🟡"}</span><div style={{flex:1}}><div className="issue-title">{r.tenant?.name} — {r.propName} · {r.name}</div><div style={{fontSize:10,color:"#c4a882"}}>{fmtS(r.rent)}/mo · ends {r.tenant?.leaseEnd}</div></div>
            <span style={{fontSize:12,fontWeight:700,color:r.daysLeft<=30?"#c45c4a":"#d4a853"}}>{r.daysLeft}d</span></div>)}</>}
      </>}

      {/* ROCKS */}
      {tab==="rocks"&&<><div className="sec-hd"><div><h2>Quarterly Rocks</h2><p>Click dot to change status</p></div>
        <button className="btn btn-gold" onClick={()=>setRocks(p=>[{id:uid(),title:"New Rock",owner:"Harrison",status:"not-started",due:"2026-06-30"},...p])}>+ Rock</button></div>
        {rocks.map(r=>(<div key={r.id} className="rock">
          <div className={`rock-dot ${r.status==="on-track"||r.status==="done"?"rock-on":r.status==="off-track"?"rock-off":"rock-ns"}`} onClick={()=>cycleRock(r.id)}/>
          <div className="rock-info"><div className="rock-title" contentEditable suppressContentEditableWarning onBlur={e=>setRocks(p=>p.map(x=>x.id===r.id?{...x,title:e.target.textContent}:x))}>{r.title}</div><div className="rock-meta">{r.owner} · {r.status.replace(/-/g," ")} · Due {r.due}</div></div>
          <button className="btn btn-red btn-sm" onClick={()=>setRocks(p=>p.filter(x=>x.id!==r.id))}>✕</button></div>))}</>}

      {/* ISSUES */}
      {tab==="issues"&&<><div className="sec-hd"><div><h2>Issues List</h2><p>IDS: Identify, Discuss, Solve</p></div>
        <button className="btn btn-gold" onClick={()=>setIssues(p=>[{id:uid(),title:"New issue",priority:"medium"},...p])}>+ Issue</button></div>
        {issues.map(i=>(<div key={i.id} className="issue">
          <span className="issue-pri" onClick={()=>setIssues(p=>p.map(x=>x.id===i.id?{...x,priority:x.priority==="high"?"medium":x.priority==="medium"?"low":"high"}:x))}>{i.priority==="high"?"🔴":i.priority==="medium"?"🟡":"🟢"}</span>
          <span className="issue-title" contentEditable suppressContentEditableWarning onBlur={e=>setIssues(p=>p.map(x=>x.id===i.id?{...x,title:e.target.textContent}:x))}>{i.title}</span>
          <button className="btn btn-green btn-sm" onClick={()=>setIssues(p=>p.filter(x=>x.id!==i.id))}>✓ Solved</button></div>))}</>}

      {/* FINANCES */}
      {tab==="finance"&&<>
        <div className="kgrid">
          <div className="kpi" style={{cursor:"default"}}><div className="kl">Collected</div><div className="kv">{fmtS(metrics.coll)}</div><div className="ks" style={{color:metrics.collRate>=100?"#4a7c59":"#c45c4a"}}>{metrics.collRate}% of {fmtS(metrics.due)}</div></div>
          <div className="kpi" style={{cursor:"default"}}><div className="kl">Projected</div><div className="kv">{fmtS(metrics.proj)}</div><div className="ks">of {fmtS(metrics.full)}</div></div>
          <div className="kpi" style={{cursor:"default"}}><div className="kl">Vacancies</div><div className="kv" style={{color:metrics.vacs.length?"#c45c4a":"#4a7c59"}}>{metrics.vacs.length}</div></div>
          <div className="kpi" style={{cursor:"default"}}><div className="kl">Lost/mo</div><div className="kv" style={{color:"#c45c4a"}}>{fmtS(metrics.lost)}</div></div>
        </div>
        {props.map(pr=>{const occ=pr.rooms.filter(r=>r.roomStatus==="occupied");const c=occ.reduce((s,r)=>s+(payments[r.id]?.[THIS_MONTH]||0),0);const d=occ.reduce((s,r)=>s+r.rent,0);const vc=pr.rooms.length-occ.length;
          return (<div key={pr.id} className="pc"><div className="pc-head" onClick={()=>toggle(pr.id)}><div><div className="pc-nm">{expanded[pr.id]?"▾":"▸"} {pr.name}</div><div className="pc-addr">{pr.address}</div><div style={{marginTop:4}}>{vc===0?<span className="ptg ptg-ok">Full</span>:<span className="ptg ptg-vc">{vc} Vacant</span>}<span className="ptg ptg-t">{pr.type}</span></div></div><div style={{fontSize:18,fontWeight:800}}>{fmtS(c)}<small style={{fontSize:11,color:"#999"}}> / {fmtS(d)}</small></div></div>
            {expanded[pr.id]&&<div>{pr.rooms.map(r=>{const pd=payments[r.id]?.[THIS_MONTH]||0;const isV=r.roomStatus!=="occupied";return (
              <div key={r.id} className="rm"><div className={`rm-dot ${isV?"rm-v":pd?"rm-o":"rm-l"}`}/><div className="rm-i"><div className="rm-n">{r.name}<span className={`rbdg ${r.privateBath?"rb-p":"rb-s"}`}>{r.privateBath?"Priv":"Shared"}</span></div>{r.tenant?<div className="rm-t">{r.tenant.name}</div>:<div className="rm-t" style={{color:"#c45c4a"}}>Vacant</div>}</div>
                <div style={{textAlign:"right"}}><div className="rm-r">{fmtS(r.rent)}</div>{!isV&&<div className={`rm-pd ${pd?"rm-y":"rm-nn"}`}>{pd?"✓ Paid":"✕ Unpaid"}</div>}</div>
                {!isV&&!pd&&<button className="btn btn-green btn-sm" onClick={()=>recordPay(r.id)}>Pay</button>}
              </div>);})}</div>}</div>);
        })}</>}

      {/* SITE SETTINGS */}
      {tab==="site-settings"&&<>
        <div className="sec-hd"><div><h2>Site Settings</h2><p>Edit company info and hero copy. In production this updates the live site.</p></div></div>
        <div style={{background:"#fff",borderRadius:12,padding:24,border:"1px solid rgba(0,0,0,.04)",marginBottom:20}}>
          <h3 style={{fontSize:14,fontWeight:800,marginBottom:14}}>Company Info</h3>
          <div className="fr"><div className="fld"><label>Name</label><input value={settings.companyName} onChange={e=>setSettings({...settings,companyName:e.target.value})}/></div><div className="fld"><label>Legal Entity</label><input value={settings.legalName} onChange={e=>setSettings({...settings,legalName:e.target.value})}/></div></div>
          <div className="fr3"><div className="fld"><label>Phone</label><input value={settings.phone} onChange={e=>setSettings({...settings,phone:e.target.value})}/></div><div className="fld"><label>Email</label><input value={settings.email} onChange={e=>setSettings({...settings,email:e.target.value})}/></div><div className="fld"><label>City</label><input value={settings.city} onChange={e=>setSettings({...settings,city:e.target.value})}/></div></div></div>
        <div style={{background:"#fff",borderRadius:12,padding:24,border:"1px solid rgba(0,0,0,.04)"}}>
          <h3 style={{fontSize:14,fontWeight:800,marginBottom:14}}>Hero Section</h3>
          <div className="fld"><label>Tagline</label><input value={settings.tagline} onChange={e=>setSettings({...settings,tagline:e.target.value})}/></div>
          <div className="fr"><div className="fld"><label>Headline</label><input value={settings.heroHeadline} onChange={e=>setSettings({...settings,heroHeadline:e.target.value})}/></div><div className="fld"><label>Subline</label><input value={settings.heroSubline} onChange={e=>setSettings({...settings,heroSubline:e.target.value})}/></div></div>
          <div className="fld"><label>Description</label><textarea value={settings.heroDesc} onChange={e=>setSettings({...settings,heroDesc:e.target.value})}/></div></div>
      </>}

      {/* THEME */}
      {tab==="theme"&&<>
        <div className="sec-hd"><div><h2>Color Scheme</h2><p>Click swatches or type hex values</p></div><button className="btn btn-gold" onClick={()=>setTheme(randPalette())}>🎲 Random</button></div>
        <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          {Object.entries(PRESETS).map(([n,c])=><button key={n} className="btn btn-out btn-sm" onClick={()=>setTheme({...c})}><span style={{width:10,height:10,borderRadius:"50%",background:c.accent,display:"inline-block"}}/>{n}</button>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,alignItems:"start"}}>
          <div>{Object.entries(THEME_LABELS).map(([k,label])=>(<div key={k} className="cr"><div className="csw" style={{background:theme[k]}}><input type="color" value={theme[k]} onChange={e=>setTheme({...theme,[k]:e.target.value})}/></div><div className="cinfo"><span>{label}</span></div><input className="chex" value={theme[k]} onChange={e=>{if(/^#[0-9a-fA-F]{6}$/.test(e.target.value))setTheme({...theme,[k]:e.target.value});}}/></div>))}</div>
          <div style={{position:"sticky",top:80}}>
            <div style={{fontSize:11,fontWeight:700,color:"#999",marginBottom:10,textTransform:"uppercase",letterSpacing:1.5}}>Preview</div>
            <div style={{borderRadius:14,overflow:"hidden",border:"1px solid rgba(0,0,0,.06)",boxShadow:"0 8px 28px rgba(0,0,0,.08)"}}>
              <div style={{background:theme.bg,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:theme.text,fontWeight:700,fontSize:12}}>🐻 Black Bear <span style={{color:theme.accent}}>Rentals</span></span><div style={{background:theme.accent,color:contrast(theme.accent),padding:"4px 10px",borderRadius:4,fontSize:9,fontWeight:700}}>Apply</div></div>
              <div style={{background:`linear-gradient(135deg,${theme.bg},${theme.card})`,padding:"24px 14px",textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",fontSize:20,color:theme.text}}>Your Room Is Ready.</div><div style={{fontFamily:"Georgia,serif",fontSize:20,color:theme.accent,fontStyle:"italic"}}>Everything Included.</div></div>
              <div style={{background:theme.surface,padding:12}}><div style={{background:"#fff",borderRadius:6,padding:8,border:"1px solid rgba(0,0,0,.04)"}}><span style={{background:`${theme.green}18`,color:theme.green,padding:"1px 5px",borderRadius:100,fontSize:6,fontWeight:700}}>Available</span><div style={{fontFamily:"Georgia,serif",fontSize:11,color:theme.dark,marginTop:4}}>The Holmes House</div></div></div>
              <div style={{background:theme.card,padding:"10px 14px",textAlign:"center"}}><div style={{background:theme.accent,color:contrast(theme.accent),padding:"5px 14px",borderRadius:5,fontSize:9,fontWeight:700,display:"inline-block"}}>Apply Now</div></div></div>
          </div></div>
      </>}

      </div></div></div>

    {/* Undo toast */}
    {undoStack.length>0&&undoStack[0].ts>Date.now()-15000&&(
      <div className="undo-toast"><span>Marked {undoStack[0].tenantName} as paid</span><button className="undo-btn" onClick={()=>undoPayment(undoStack[0])}>↩ Undo</button><button className="undo-dismiss" onClick={()=>setUndoStack(s=>s.slice(1))}>✕</button></div>)}

    {tenantModal&&<TenantModal room={tenantModal.room} propName={tenantModal.propName} payments={payments} onClose={()=>setTenantModal(null)} thisMonth={THIS_MONTH}/>}
  </>);
}
