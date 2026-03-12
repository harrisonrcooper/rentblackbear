"use client";
import Link from "next/link";
import { PROPERTIES, SETTINGS } from "../../lib/data";

const fmtS=n=>"$"+Number(n).toLocaleString();
const TODAY=new Date();
const THIS_MONTH=TODAY.toLocaleString("default",{month:"long",year:"numeric"});

export default function AdminHub(){
  const totalRooms=PROPERTIES.reduce((s,p)=>s+p.rooms.length,0);
  const occupied=PROPERTIES.reduce((s,p)=>s+p.rooms.filter(r=>(r.status||r.roomStatus)==="occupied").length,0);
  const vacant=totalRooms-occupied;
  const fullRent=PROPERTIES.reduce((s,p)=>s+p.rooms.reduce((a,r)=>a+r.rent,0),0);
  const projRent=PROPERTIES.reduce((s,p)=>s+p.rooms.filter(r=>(r.status||r.roomStatus)==="occupied").reduce((a,r)=>a+r.rent,0),0);
  const occRate=totalRooms?Math.round(occupied/totalRooms*100):0;

  const pages=[
    {href:"/admin/traction",icon:"📊",title:"Traction Scorecard",desc:"Weekly KPIs, drill-down analytics, quarterly rocks, issues list, and visual charts.",color:"#d4a853",tag:"EOS"},
    {href:"/admin/pm",icon:"💰",title:"Property Management",desc:"Rent collection, vacancy tracking, projected income, expense splitting, and lease timelines.",color:"#4a7c59",tag:"Finances"},
    {href:"/admin/ideas",icon:"💡",title:"Idea Board",desc:"Organize and track every feature idea for the website. Board, list, and status views.",color:"#3b82f6",tag:"Planning"},
    {href:"/admin/settings",icon:"⚙️",title:"Site Settings & Properties",desc:"Edit properties, rooms, pricing, company info, and hero section copy. No code required.",color:"#8b5cf6",tag:"No-Code"},
    {href:"/admin/theme",icon:"🎨",title:"Theme Editor",desc:"Change the color scheme with pickers, hex values, presets, or random generation.",color:"#ec4899",tag:"Design"},
  ];

  return (<div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:"#f4f3f0",minHeight:"100vh"}}>
    {/* Header */}
    <div style={{background:"#1a1714",padding:"32px 40px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:"#d4a853",marginBottom:6}}>Admin Dashboard</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:28,color:"#f5f0e8"}}>🐻 Black Bear HQ</h1>
          <p style={{fontSize:13,color:"#c4a882",marginTop:4}}>{THIS_MONTH} · {SETTINGS.companyName}</p>
        </div>
        <Link href="/" style={{background:"rgba(255,255,255,.1)",color:"#f5f0e8",padding:"10px 20px",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>🌐 View Public Site</Link>
      </div>
    </div>

    <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 40px 60px"}}>
      {/* Quick Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:32}}>
        <div style={{background:"#fff",borderRadius:12,padding:18,border:"1px solid rgba(0,0,0,.04)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Occupancy</div>
          <div style={{fontSize:28,fontWeight:800,color:occRate>=90?"#4a7c59":"#c45c4a"}}>{occRate}%</div>
          <div style={{fontSize:11,color:"#5c4a3a",marginTop:4}}>{occupied}/{totalRooms} rooms filled</div>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:18,border:"1px solid rgba(0,0,0,.04)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Vacancies</div>
          <div style={{fontSize:28,fontWeight:800,color:vacant>0?"#c45c4a":"#4a7c59"}}>{vacant}</div>
          <div style={{fontSize:11,color:"#5c4a3a",marginTop:4}}>across {PROPERTIES.length} properties</div>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:18,border:"1px solid rgba(0,0,0,.04)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Projected Revenue</div>
          <div style={{fontSize:28,fontWeight:800}}>{fmtS(projRent)}</div>
          <div style={{fontSize:11,color:"#5c4a3a",marginTop:4}}>of {fmtS(fullRent)} at full</div>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:18,border:"1px solid rgba(0,0,0,.04)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Properties</div>
          <div style={{fontSize:28,fontWeight:800}}>{PROPERTIES.length}</div>
          <div style={{fontSize:11,color:"#5c4a3a",marginTop:4}}>{totalRooms} total rooms</div>
        </div>
      </div>

      {/* Navigation Cards */}
      <h2 style={{fontSize:18,fontWeight:800,marginBottom:16}}>Your Tools</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
        {pages.map(p=>(
          <Link key={p.href} href={p.href} style={{textDecoration:"none",color:"inherit"}}>
            <div style={{background:"#fff",borderRadius:14,padding:24,border:"1px solid rgba(0,0,0,.04)",transition:"all .2s",cursor:"pointer",borderLeft:`4px solid ${p.color}`,height:"100%"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color;e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,0,0,.04)";e.currentTarget.style.borderLeftColor=p.color;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <span style={{fontSize:32}}>{p.icon}</span>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,background:`${p.color}15`,color:p.color,letterSpacing:.5}}>{p.tag}</span>
              </div>
              <h3 style={{fontSize:16,fontWeight:800,marginBottom:6}}>{p.title}</h3>
              <p style={{fontSize:13,color:"#5c4a3a",lineHeight:1.6}}>{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Property Overview */}
      <h2 style={{fontSize:18,fontWeight:800,marginTop:36,marginBottom:16}}>Properties at a Glance</h2>
      {PROPERTIES.map(p=>{
        const occ=p.rooms.filter(r=>(r.status||r.roomStatus)==="occupied").length;
        const vac=p.rooms.length-occ;
        const rev=p.rooms.filter(r=>(r.status||r.roomStatus)==="occupied").reduce((s,r)=>s+r.rent,0);
        return (
          <div key={p.id} style={{background:"#fff",borderRadius:12,padding:18,border:"1px solid rgba(0,0,0,.04)",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontWeight:800,fontSize:15}}>{p.name}</div>
              <div style={{fontSize:12,color:"#999"}}>{p.address} · {p.typeTag||p.type}</div>
              <div style={{display:"flex",gap:6,marginTop:6}}>
                {vac===0?<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"rgba(74,124,89,.1)",color:"#4a7c59"}}>Fully Occupied</span>
                :<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"rgba(196,92,74,.1)",color:"#c45c4a"}}>{vac} Vacant</span>}
                <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"rgba(0,0,0,.04)",color:"#999"}}>{p.rooms.length} rooms</span>
                <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"rgba(0,0,0,.04)",color:"#999"}}>{p.utilities==="allIncluded"?"All Utils":"$100 Cap"}</span>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:20,fontWeight:800}}>{fmtS(rev)}<span style={{fontSize:11,fontWeight:500,color:"#999"}}>/mo</span></div>
              <div style={{fontSize:11,color:"#999"}}>{occ}/{p.rooms.length} occupied</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>);
}
