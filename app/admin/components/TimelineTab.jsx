"use client";

const fmtD=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;}

export default function TimelineTab({
  props, TODAY, allRooms, getPropDisplayName, goTab,
  ttPropFilter, setTtPropFilter,
  ttSort, setTtSort,
  ttView, setTtView,
  ttPref, setTtPref,
  ttMonthOffset, setTtMonthOffset,
  ttGanttGrouped, setTtGanttGrouped,
  setTenantProfileTab, setModal,
}){
        // Build flat list of all rooms with tenant/availability data
        const TODAY_STR=TODAY.toISOString().split("T")[0];
        const allRoomsFull=props.flatMap(p=>allRooms(p).filter(r=>!r.ownerOccupied).map(r=>({
          ...r,propName:getPropDisplayName(p),propId:p.id,
        })));
        const filtered=ttPropFilter==="all"?allRoomsFull:allRoomsFull.filter(r=>r.propId===ttPropFilter);

        const getReadyStr=(r)=>r.le||null;
        const daysUntil=(ds)=>{if(!ds)return null;return Math.ceil((new Date(ds+"T00:00:00")-TODAY)/(86400000));};

        // Sort helper
        const sortRooms=(rooms)=>{
          const cp=[...rooms];
          const noLe=r=>!r.le;
          const leMs=r=>r.le?new Date(r.le+"T00:00:00").getTime():Infinity;
          const rdMs=r=>{const s=getReadyStr(r);return s?new Date(s+"T00:00:00").getTime():r.le?leMs(r):Infinity;};
          if(ttSort==="lease-end-asc")return cp.sort((a,b)=>noLe(a)&&noLe(b)?0:noLe(a)?-1:noLe(b)?1:leMs(a)-leMs(b));
          if(ttSort==="lease-end-desc")return cp.sort((a,b)=>noLe(a)&&noLe(b)?0:noLe(a)?1:noLe(b)?-1:leMs(b)-leMs(a));
          if(ttSort==="avail-asc")return cp.sort((a,b)=>rdMs(a)-rdMs(b));
          if(ttSort==="avail-desc")return cp.sort((a,b)=>rdMs(b)-rdMs(a));
          return cp;
        };
        const sortedFiltered=sortRooms(filtered);

        // Month window for Gantt/Calendar
        const baseDate=new Date(TODAY.getFullYear(),TODAY.getMonth()+ttMonthOffset,1);
        const windowStart=new Date(baseDate);windowStart.setMonth(windowStart.getMonth()-1);
        const windowEnd=new Date(baseDate);windowEnd.setMonth(windowEnd.getMonth()+5);
        const windowStartStr=windowStart.toISOString().split("T")[0];
        const windowEndStr=windowEnd.toISOString().split("T")[0];
        const totalDays=Math.ceil((windowEnd-windowStart)/86400000);
        const dateToX=(ds)=>{if(!ds)return 0;const d=Math.ceil((new Date(ds+"T00:00:00")-windowStart)/86400000);return Math.max(0,Math.min(100,(d/totalDays)*100));};
        const months=[];for(let i=0;i<7;i++){const d=new Date(windowStart);d.setMonth(d.getMonth()+i);months.push({label:d.toLocaleString("default",{month:"short",year:"2-digit"}),x:dateToX(d.toISOString().split("T")[0])});}

        const views=[
          {id:"gantt",label:"Gantt"},
          {id:"countdown",label:"Countdown"},
          {id:"calendar",label:"Calendar"},
          {id:"kanban",label:"Kanban"},
        ];

        return(
        <div style={{padding:"0 0 40px"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8,position:"sticky",top:0,zIndex:10,background:"#f4f3f0",paddingTop:4,paddingBottom:8}}>
            <div>
              <h2 style={{margin:0,fontSize:18,fontWeight:700}}>Tenant Timeline</h2>
              <div style={{fontSize:11,color:"#6b5e52",marginTop:2}}>Lease end dates and availability across all properties</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
                <button onClick={()=>setTtPropFilter("all")}
                  onMouseEnter={e=>{if(ttPropFilter!=="all")e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                  onMouseLeave={e=>{if(ttPropFilter!=="all")e.currentTarget.style.background="transparent";}}
                  style={{padding:"4px 10px",fontSize:10,fontWeight:600,borderRadius:20,border:ttPropFilter==="all"?"1px solid #4a7c59":"1px solid rgba(0,0,0,.12)",cursor:"pointer",fontFamily:"inherit",transition:"all .12s",background:ttPropFilter==="all"?"#4a7c59":"transparent",color:ttPropFilter==="all"?"#fff":"#5c4a3a"}}>All</button>
                {props.filter(p=>!(p.units||[]).every(u=>u.ownerOccupied)).map(p=>(
                  <button key={p.id} onClick={()=>setTtPropFilter(ttPropFilter===p.id?"all":p.id)}
                    onMouseEnter={e=>{if(ttPropFilter!==p.id)e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{if(ttPropFilter!==p.id)e.currentTarget.style.background="transparent";}}
                    style={{padding:"4px 10px",fontSize:10,fontWeight:600,borderRadius:20,border:ttPropFilter===p.id?"1px solid #4a7c59":"1px solid rgba(0,0,0,.12)",cursor:"pointer",fontFamily:"inherit",transition:"all .12s",background:ttPropFilter===p.id?"#4a7c59":"transparent",color:ttPropFilter===p.id?"#fff":"#5c4a3a"}}>
                    {getPropDisplayName(p)}
                  </button>
                ))}
              </div>
              <select value={ttSort} onChange={e=>setTtSort(e.target.value)} style={{fontSize:11,padding:"4px 8px"}}>
                <option value="lease-end-asc">Lease end ↑ soonest</option>
                <option value="lease-end-desc">Lease end ↓ latest</option>
                <option value="avail-asc">Available date ↑ soonest</option>
                <option value="avail-desc">Available date ↓ latest</option>
              </select>
              {/* View toggle */}
              <div style={{display:"flex",border:"1px solid rgba(0,0,0,.12)",borderRadius:8,overflow:"hidden",background:"rgba(0,0,0,.02)"}}>
                {views.map(v=>(
                  <button key={v.id} onClick={()=>setTtView(v.id)}
                    onMouseEnter={e=>{if(ttView!==v.id)e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{if(ttView!==v.id)e.currentTarget.style.background="transparent";}}
                    style={{padding:"6px 14px",fontSize:11,fontWeight:600,border:"none",borderRight:"1px solid rgba(0,0,0,.08)",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",
                      background:ttView===v.id?"#4a7c59":"transparent",color:ttView===v.id?"#fff":"#5c4a3a"}}>
                    {v.label}
                    {v.id===ttPref&&<span style={{marginLeft:4,fontSize:9,opacity:.7}}>{"\u2713"}</span>}
                  </button>
                ))}
              </div>
              {ttPref!==ttView&&<button
                onClick={()=>setTtPref(ttView)}
                style={{fontSize:10,padding:"6px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.12)",background:"#fff",cursor:"pointer",fontFamily:"inherit",color:"#5c4a3a",fontWeight:600,transition:"all .15s"}}>
                Set as default
              </button>}
              {ttPref===ttView&&<span style={{fontSize:10,color:"#5c4a3a",fontWeight:600,padding:"6px 4px",opacity:.6}}>Default</span>}
            </div>
          </div>

          {/* ── GANTT ── */}
          {ttView==="gantt"&&<div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 260px)"}}>
            {/* Month nav */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:"1px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.015)"}}>
              <button className="btn btn-out btn-sm" onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"} onMouseLeave={e=>e.currentTarget.style.background=""} onClick={()=>setTtMonthOffset(o=>o-1)}>← Earlier</button>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:12,fontWeight:600,color:"#5c4a3a"}}>{baseDate.toLocaleString("default",{month:"long",year:"numeric"})} window</span>
                <div style={{display:"flex",border:"1px solid rgba(0,0,0,.12)",borderRadius:7,overflow:"hidden",background:"rgba(0,0,0,.02)"}}>
                  <button onClick={()=>setTtGanttGrouped(true)}
                    onMouseEnter={e=>{if(ttGanttGrouped)return;e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{if(ttGanttGrouped)return;e.currentTarget.style.background="transparent";}}
                    style={{padding:"4px 12px",fontSize:10,fontWeight:600,border:"none",borderRight:"1px solid rgba(0,0,0,.08)",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",background:ttGanttGrouped?"#4a7c59":"transparent",color:ttGanttGrouped?"#fff":"#5c4a3a"}}>By property</button>
                  <button onClick={()=>setTtGanttGrouped(false)}
                    onMouseEnter={e=>{if(!ttGanttGrouped)return;e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{if(!ttGanttGrouped)return;e.currentTarget.style.background="transparent";}}
                    style={{padding:"4px 12px",fontSize:10,fontWeight:600,border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",background:!ttGanttGrouped?"#4a7c59":"transparent",color:!ttGanttGrouped?"#fff":"#5c4a3a"}}>By date</button>
                </div>
              </div>
              <button className="btn btn-out btn-sm" onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"} onMouseLeave={e=>e.currentTarget.style.background=""} onClick={()=>setTtMonthOffset(o=>o+1)}>Later →</button>
            </div>
            {/* Scrollable chart area */}
            <div style={{flex:1,overflowX:"auto",overflowY:"auto",minHeight:0,WebkitOverflowScrolling:"touch"}}>
            {/* Month headers */}
            <div style={{display:"flex",borderBottom:"1px solid rgba(0,0,0,.06)",position:"sticky",top:0,zIndex:2,background:"#fff"}}>
              <div style={{width:140,flexShrink:0,padding:"4px 12px",fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:.5,position:"sticky",left:0,background:"#fff",zIndex:3}}>{ttGanttGrouped?"Room":"Room · Property"}</div>
              <div style={{flex:1,position:"relative",height:22,minWidth:900}}>
                {months.map((m,i)=><div key={i} style={{position:"absolute",left:m.x+"%",fontSize:9,color:"#999",transform:"translateX(-50%)",whiteSpace:"nowrap",top:5}}>{m.label}</div>)}
              </div>
            </div>
            {/* Gantt row renderer — shared between grouped + flat */}
            {(()=>{
              const renderRow=(r,showProp=false)=>{
                const readyStr=r.le||null;
                const isOcc=r.st==="occupied"&&r.tenant;
                const isVac=!isOcc;
                const leX=r.le?dateToX(r.le):null;
                const rdX=readyStr?dateToX(readyStr):null;
                const todayX=dateToX(TODAY_STR);
                const moveInX=r.tenant?.moveIn?dateToX(r.tenant.moveIn):null;
                return(
                <div key={r.id} style={{display:"flex",alignItems:"center",borderBottom:"1px solid rgba(0,0,0,.04)",minHeight:36,cursor:"pointer",transition:"background .1s"}}
                  onClick={()=>{if(r.tenant){setTenantProfileTab&&setTenantProfileTab("summary");setModal({type:"tenant",data:r});}}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.025)"}
                  onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <div style={{width:140,flexShrink:0,padding:"4px 12px",position:"sticky",left:0,background:"#fff",zIndex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#1a1714",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</div>
                    {showProp&&<div style={{fontSize:9,color:"#9a7422",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.propName}</div>}
                    {isOcc&&!showProp&&<div style={{fontSize:9,color:"#6b5e52",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.tenant.name}</div>}
                    {isOcc&&showProp&&<div style={{fontSize:9,color:"#6b5e52",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.tenant.name}</div>}
                    {isVac&&<div style={{fontSize:9,color:"#4a7c59",fontWeight:600}}>Vacant</div>}
                  </div>
                  <div style={{flex:1,position:"relative",height:36,display:"flex",alignItems:"center",minWidth:900}}>
                    <div style={{position:"absolute",left:todayX+"%",top:0,bottom:0,width:1.5,background:"#c45c4a",zIndex:3,opacity:.7}}/>
                    {isVac&&<div style={{position:"absolute",left:"0%",right:"0%",height:16,borderRadius:3,background:"rgba(74,124,89,.15)",border:"1px solid rgba(74,124,89,.3)",display:"flex",alignItems:"center",paddingLeft:6}}>
                      <span style={{fontSize:9,color:"#2d6a3f",fontWeight:600}}>Available now</span>
                    </div>}
                    {isOcc&&r.tenant?.moveIn&&moveInX!==null&&leX!==null&&<div style={{position:"absolute",left:Math.min(moveInX,leX)+"%",width:Math.abs(leX-Math.min(moveInX,leX))+"%",height:20,borderRadius:3,background:"#B5D4F4",top:8,display:"flex",alignItems:"center",paddingLeft:4,overflow:"hidden"}}>
                      <span style={{fontSize:9,color:"#0C447C",fontWeight:600,whiteSpace:"nowrap"}}>{r.tenant.name} · ends {fmtD(r.le)}</span>
                    </div>}
                    {/* M2M bar — no lease end date */}
                    {isOcc&&!r.le&&<div style={{position:"absolute",left:(moveInX||0)+"%",width:(100-(moveInX||0))+"%",height:20,borderRadius:3,background:"#C8B8E8",top:8,display:"flex",alignItems:"center",paddingLeft:4,overflow:"hidden"}}>
                      <span style={{fontSize:9,color:"#4C2882",fontWeight:600,whiteSpace:"nowrap"}}>{r.tenant.name} · M2M</span>
                    </div>}
                    {isOcc&&leX!==null&&rdX!==null&&<div style={{position:"absolute",left:rdX+"%",right:"0%",height:16,top:10,background:"rgba(74,124,89,.1)",border:"1px dashed rgba(74,124,89,.3)",borderRadius:"0 3px 3px 0",display:"flex",alignItems:"center",paddingLeft:4,overflow:"hidden"}}>
                      <span style={{fontSize:9,color:"#2d6a3f",whiteSpace:"nowrap"}}>Avail. {fmtD(readyStr)}</span>
                    </div>}
                  </div>
                </div>);
              };
              if(ttGanttGrouped){
                return props.filter(p=>ttPropFilter==="all"||p.id===ttPropFilter).map(p=>{
                  const pRooms=sortRooms(allRooms(p).filter(r=>!r.ownerOccupied).map(r=>({...r,propName:getPropDisplayName(p),propId:p.id})));
                  if(!pRooms.length)return null;
                  return(<div key={p.id}>
                    <div style={{padding:"5px 12px",fontSize:10,fontWeight:700,color:"#9a7422",background:"rgba(212,168,83,.04)",borderBottom:"1px solid rgba(0,0,0,.04)",textTransform:"uppercase",letterSpacing:.3}}>{getPropDisplayName(p)}</div>
                    {pRooms.map(r=>renderRow(r,false))}
                  </div>);
                });
              } else {
                return sortedFiltered.map(r=>renderRow(r,true));
              }
            })()}
            </div>{/* close scroll container */}
            <div style={{padding:"8px 16px",display:"flex",gap:16,borderTop:"1px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.01)",flexShrink:0,flexWrap:"wrap"}}>
              {[["#B5D4F4","Occupied"],["#C8B8E8","Month-to-month"],["rgba(74,124,89,.15)","Available"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#6b5e52"}}>
                  <div style={{width:10,height:10,borderRadius:2,background:c,border:c.includes("74,124")?`1px solid rgba(74,124,89,.3)`:undefined}}/>
                  {l}
                </div>
              ))}
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#6b5e52"}}>
                <div style={{width:1.5,height:10,background:"#c45c4a"}}/>Today
              </div>
            </div>
          </div>}

          {/* ── COUNTDOWN ── */}
          {ttView==="countdown"&&<div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
              {sortedFiltered.map(r=>{
                const readyStr=getReadyStr(r);
                const days=daysUntil(readyStr||(r.st==="vacant"?TODAY_STR:null));
                const isVac=r.st==="vacant"||!r.tenant;
                const dl=r.le?daysUntil(r.le):null;
                const badgeColor=isVac?"#2d6a3f":dl!=null&&dl<=30?"#A32D2D":dl!=null&&dl<=90?"#633806":"#0C447C";
                const badgeBg=isVac?"#EAF3DE":dl!=null&&dl<=30?"#FCEBEB":dl!=null&&dl<=90?"#FAEEDA":"#E6F1FB";
                return(
                <div key={r.id} style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",padding:"12px 14px"}}>
                  <div style={{fontSize:10,color:"#6b5e52",marginBottom:2}}>{r.propName}</div>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:2,color:"#1a1714"}}>{r.name}</div>
                  {r.tenant&&<div style={{fontSize:11,color:"#5c4a3a",marginBottom:8}}>{r.tenant.name}{r.tenant.occupationType?" · "+r.tenant.occupationType:""}</div>}
                  {!r.tenant&&<div style={{fontSize:11,color:"#4a7c59",fontWeight:600,marginBottom:8}}>Vacant — ready now</div>}
                  <div style={{fontSize:28,fontWeight:700,color:badgeColor,lineHeight:1}}>{isVac?"0":days!=null?days:"—"}</div>
                  <div style={{fontSize:10,color:"#6b5e52",marginBottom:8}}>days until available</div>
                  {r.le&&<div style={{fontSize:10,color:"#6b5e52",marginBottom:4}}>Lease ends {fmtD(r.le)}</div>}
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:badgeBg,color:badgeColor,fontWeight:600}}>
                    {isVac?"Available now":dl!=null&&dl<=30?"Expiring soon":dl!=null&&dl<=90?"Coming up":"Later"}
                  </span>
                </div>);
              })}
            </div>
          </div>}

          {/* ── CALENDAR ── */}
          {ttView==="calendar"&&(()=>{
            const calBase=new Date(TODAY.getFullYear(),TODAY.getMonth()+ttMonthOffset,1);
            const calYear=calBase.getFullYear(),calMonth=calBase.getMonth();
            const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
            const firstDow=new Date(calYear,calMonth,1).getDay();
            const chips={};
            filtered.forEach(r=>{
              if(r.le){const key=r.le;if(!chips[key])chips[key]=[];chips[key].push({type:"out",label:r.name+" out · "+r.propName});}
              const rs=getReadyStr(r);
              if(rs){const key=rs;if(!chips[key])chips[key]=[];chips[key].push({type:"avail",label:r.name+" avail · "+r.propName});}
            });
            const cells=[];
            for(let i=0;i<firstDow;i++)cells.push(null);
            for(let d=1;d<=daysInMonth;d++)cells.push(d);
            return(<div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",overflow:"hidden"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:"1px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.015)"}}>
                <button className="btn btn-out btn-sm" onClick={()=>setTtMonthOffset(o=>o-1)}>← Prev</button>
                <span style={{fontSize:13,fontWeight:700}}>{calBase.toLocaleString("default",{month:"long",year:"numeric"})}</span>
                <button className="btn btn-out btn-sm" onClick={()=>setTtMonthOffset(o=>o+1)}>Next →</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d} style={{padding:"5px",textAlign:"center",fontSize:10,fontWeight:600,color:"#6b5e52",background:"rgba(0,0,0,.02)"}}>{d}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
                {cells.map((d,i)=>{
                  if(!d)return<div key={"e"+i} style={{minHeight:64,borderRight:"1px solid rgba(0,0,0,.04)",borderBottom:"1px solid rgba(0,0,0,.04)"}}/>;
                  const ds=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                  const isToday=ds===TODAY_STR;
                  const dayChips=chips[ds]||[];
                  return(<div key={d} style={{minHeight:64,padding:"4px",borderRight:"1px solid rgba(0,0,0,.04)",borderBottom:"1px solid rgba(0,0,0,.04)",background:isToday?"rgba(212,168,83,.04)":"transparent"}}>
                    <div style={{fontSize:11,fontWeight:isToday?700:400,color:isToday?"#9a7422":"#5c4a3a",marginBottom:3}}>{d}</div>
                    {dayChips.map((c,ci)=><div key={ci} style={{fontSize:9,padding:"2px 4px",borderRadius:3,marginBottom:2,background:c.type==="out"?"#FCEBEB":"#EAF3DE",color:c.type==="out"?"#A32D2D":"#27500A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.label}</div>)}
                  </div>);
                })}
              </div>
              <div style={{padding:"8px 16px",display:"flex",gap:12,borderTop:"1px solid rgba(0,0,0,.06)"}}>
                {[["#FCEBEB","#A32D2D","Move-out date"],["#EAF3DE","#27500A","Available date"]].map(([bg,c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#6b5e52"}}>
                    <div style={{width:10,height:10,borderRadius:2,background:bg,border:`1px solid ${c}44`}}/>
                    {l}
                  </div>
                ))}
              </div>
            </div>);
          })()}

          {/* ── KANBAN ── */}
          {ttView==="kanban"&&<div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
              {[
                {id:"active",label:"Active",color:"#6b5e52",bg:"rgba(0,0,0,.02)",filter:r=>r.st==="occupied"&&r.le&&daysUntil(r.le)>90},
                {id:"exp90",label:"Expiring 90d",color:"#633806",bg:"rgba(212,168,83,.04)",border:"rgba(212,168,83,.25)",filter:r=>r.st==="occupied"&&r.le&&daysUntil(r.le)<=90&&daysUntil(r.le)>30},
                {id:"exp30",label:"Expiring 30d",color:"#791F1F",bg:"rgba(196,92,74,.04)",border:"rgba(196,92,74,.2)",filter:r=>r.st==="occupied"&&r.le&&daysUntil(r.le)<=30&&daysUntil(r.le)>0},
                {id:"avail",label:"Available",color:"#27500A",bg:"rgba(74,124,89,.04)",border:"rgba(74,124,89,.2)",filter:r=>r.st==="vacant"||!r.tenant||(r.le&&daysUntil(r.le)<=0)},
              ].map(col=>{
                const colRooms=sortedFiltered.filter(col.filter);
                return(
                <div key={col.id} style={{background:col.bg||"rgba(0,0,0,.02)",borderRadius:10,padding:10,border:col.border?`1px solid ${col.border}`:"0.5px solid rgba(0,0,0,.06)"}}>
                  <div style={{fontSize:10,fontWeight:700,color:col.color,textTransform:"uppercase",letterSpacing:.4,marginBottom:8,display:"flex",justifyContent:"space-between"}}>
                    <span>{col.label}</span>
                    <span style={{background:"rgba(255,255,255,.8)",borderRadius:10,padding:"0 6px",fontWeight:700,color:"#3d3529"}}>{colRooms.length}</span>
                  </div>
                  {colRooms.length===0&&<div style={{fontSize:10,color:"#aaa",padding:"4px 0"}}>None</div>}
                  {colRooms.map(r=>{
                    const dl=r.le?daysUntil(r.le):null;
                    const rs=getReadyStr(r);
                    const rdl=rs?daysUntil(rs):null;
                    return(
                    <div key={r.id} style={{background:"#fff",borderRadius:7,border:"0.5px solid rgba(0,0,0,.07)",padding:"8px 10px",marginBottom:6}}>
                      <div style={{fontSize:12,fontWeight:700,marginBottom:2,color:"#1a1714"}}>{r.name}</div>
                      <div style={{fontSize:10,color:"#6b5e52",marginBottom:5}}>{r.propName}</div>
                      {r.tenant&&<div style={{fontSize:10,color:"#5c4a3a",marginBottom:4}}>{r.tenant.name}{r.tenant.occupationType?" · "+r.tenant.occupationType:""}</div>}
                      {r.le&&<div style={{fontSize:10,fontWeight:600,color:col.color}}>Ends {fmtD(r.le)}{dl!==null?" · "+dl+"d":""}</div>}
                      {rs&&rdl!==null&&rdl>0&&<div style={{fontSize:10,color:"#9a7422"}}>Avail. {fmtD(rs)} · {rdl}d</div>}
                      {!r.le&&!r.tenant&&<div style={{fontSize:10,color:"#4a7c59",fontWeight:600}}>Ready now</div>}
                      <button className="btn btn-out btn-sm" style={{fontSize:9,marginTop:5,width:"100%"}} onClick={()=>{setTenantProfileTab("summary");if(r.tenant){const prop=props.find(p=>allRooms(p).some(x=>x.id===r.id));setModal({type:"tenant",data:r});}else{goTab("applications");}}}>
                        {r.tenant?"View tenant →":"Find tenant →"}
                      </button>
                    </div>);
                  })}
                </div>);
              })}
            </div>
          </div>}
        </div>);
}
