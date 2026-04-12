"use client";
import { useState, useMemo } from "react";

// ── Inline SVG icons (no emojis) ──────────────────────────────────
const I=({d,s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const IconFilter=()=><I d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>;
const IconChevDown=()=><I d="M6 9l6 6 6-6" s={12}/>;
const IconChevUp=()=><I d="M18 15l-6-6-6 6" s={12}/>;
const IconCheck=()=><I d="M20 6L9 17l-5-5"/>;
const IconX=()=><I d="M18 6L6 18M6 6l12 12" s={12}/>;
const IconPlus=()=><I d="M12 5v14M5 12h14" s={12}/>;
const IconCamera=()=><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconDollar=()=><I d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>;
const IconUser=()=><I d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>;
const IconWrench=()=><I d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>;

const STATUSES=["open","assigned","in-progress","completed"];
const STATUS_LABELS={open:"Open",assigned:"Assigned","in-progress":"In Progress",completed:"Completed"};
const STATUS_COLORS={open:"b-red",assigned:"b-gold","in-progress":"b-gold",completed:"b-green"};
const PRIORITY_COLORS={high:"b-red",medium:"b-gold",low:"b-green"};
const PRIORITY_LABELS={high:"High",medium:"Medium",low:"Low"};

export default function MaintenanceAdmin({ maint, setMaint, vendors=[], setVendors, props=[], settings={} }){
  const _acc=settings.adminAccent||"#4a7c59";

  // ── Filters ──
  const[filterStatus,setFilterStatus]=useState("all");
  const[filterPriority,setFilterPriority]=useState("all");
  const[filterProp,setFilterProp]=useState("all");
  const[sortBy,setSortBy]=useState("date"); // date | priority | status
  const[expandedId,setExpandedId]=useState(null);

  // ── Vendor assignment modal state ──
  const[assignModal,setAssignModal]=useState(null); // request id
  const[assignVendor,setAssignVendor]=useState("");
  const[assignNotes,setAssignNotes]=useState("");
  const[newVendorName,setNewVendorName]=useState("");
  const[showNewVendor,setShowNewVendor]=useState(false);

  // ── Complete modal state ──
  const[completeModal,setCompleteModal]=useState(null);
  const[completeCost,setCompleteCost]=useState("");
  const[completeNotes,setCompleteNotes]=useState("");

  // ── Derived data ──
  const propNames=useMemo(()=>{
    const s=new Set();
    maint.forEach(r=>{if(r.propName)s.add(r.propName);});
    props.forEach(p=>{const n=p.addr||p.name||"";if(n)s.add(n);});
    return[...s].sort();
  },[maint,props]);

  const filtered=useMemo(()=>{
    let list=[...maint];
    if(filterStatus!=="all")list=list.filter(r=>r.status===filterStatus);
    if(filterPriority!=="all")list=list.filter(r=>r.priority===filterPriority);
    if(filterProp!=="all")list=list.filter(r=>(r.propName||"")===filterProp);
    // sort
    list.sort((a,b)=>{
      if(sortBy==="priority"){const o={high:0,medium:1,low:2};return(o[a.priority]||1)-(o[b.priority]||1);}
      if(sortBy==="status"){const o={open:0,assigned:1,"in-progress":2,completed:3};return(o[a.status]||0)-(o[b.status]||0);}
      return new Date(b.createdAt||b.created||0)-new Date(a.createdAt||a.created||0);
    });
    return list;
  },[maint,filterStatus,filterPriority,filterProp,sortBy]);

  const totalCost=useMemo(()=>maint.reduce((s,r)=>s+(parseFloat(r.cost)||0),0),[maint]);
  const openCount=maint.filter(r=>r.status!=="completed").length;

  // ── Actions ──
  const updateRequest=(id,updates)=>{
    setMaint(prev=>prev.map(r=>r.id===id?{...r,...updates}:r));
  };

  const advanceStatus=(req)=>{
    const idx=STATUSES.indexOf(req.status);
    if(idx<0)return;
    const next=STATUSES[idx+1];
    if(!next)return;
    if(next==="assigned"){setAssignModal(req.id);setAssignVendor(req.assignedVendor||"");setAssignNotes("");return;}
    if(next==="completed"){setCompleteModal(req.id);setCompleteCost(req.cost||"");setCompleteNotes("");return;}
    updateRequest(req.id,{status:next});
  };

  const handleAssign=()=>{
    if(!assignVendor&&!newVendorName)return;
    let vendorName=assignVendor;
    if(showNewVendor&&newVendorName){
      vendorName=newVendorName;
      // Add new vendor to vendor list
      if(setVendors){
        const newV={id:Math.random().toString(36).slice(2,9),name:newVendorName,phone:"",email:"",category:"General"};
        setVendors(prev=>[...prev,newV]);
      }
    }
    updateRequest(assignModal,{status:"assigned",assignedVendor:vendorName,assignNotes:assignNotes||undefined});
    setAssignModal(null);setShowNewVendor(false);setNewVendorName("");
  };

  const handleComplete=()=>{
    updateRequest(completeModal,{
      status:"completed",
      cost:completeCost?parseFloat(completeCost):undefined,
      completedAt:new Date().toISOString().split("T")[0],
      completeNotes:completeNotes||undefined,
    });
    setCompleteModal(null);
  };

  const nextStatusLabel=(status)=>{
    const idx=STATUSES.indexOf(status);
    if(idx<0||idx>=STATUSES.length-1)return null;
    const labels={assigned:"Assign Vendor","in-progress":"Start Work",completed:"Complete"};
    return labels[STATUSES[idx+1]]||null;
  };

  // ── Render ──
  return(<div>
    {/* ── Summary bar ── */}
    <div className="sec-hd">
      <div><h2>Maintenance Requests</h2><p>{openCount} open{totalCost>0?` | $${totalCost.toLocaleString()} total cost`:""}</p></div>
    </div>

    {/* ── Stats row ── */}
    <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
      {STATUSES.map(s=>{
        const c=maint.filter(r=>r.status===s).length;
        return(<div key={s} className="card" style={{flex:1,minWidth:120,padding:"12px 16px",cursor:"pointer",border:filterStatus===s?`2px solid ${_acc}`:"2px solid transparent"}} onClick={()=>setFilterStatus(filterStatus===s?"all":s)}>
          <div style={{fontSize:22,fontWeight:700,color:_acc}}>{c}</div>
          <div style={{fontSize:11,color:"#6b5e52",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{STATUS_LABELS[s]}</div>
        </div>);
      })}
      {totalCost>0&&<div className="card" style={{flex:1,minWidth:120,padding:"12px 16px"}}>
        <div style={{fontSize:22,fontWeight:700,color:_acc}}>${totalCost.toLocaleString()}</div>
        <div style={{fontSize:11,color:"#6b5e52",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Total Cost</div>
      </div>}
    </div>

    {/* ── Filters ── */}
    <div className="card" style={{padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:"#6b5e52"}}><IconFilter/> Filters</span>
      <select className="fld" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{fontSize:11,padding:"4px 8px",minWidth:100}}>
        <option value="all">All Status</option>
        {STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </select>
      <select className="fld" value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} style={{fontSize:11,padding:"4px 8px",minWidth:100}}>
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select className="fld" value={filterProp} onChange={e=>setFilterProp(e.target.value)} style={{fontSize:11,padding:"4px 8px",minWidth:140}}>
        <option value="all">All Properties</option>
        {propNames.map(n=><option key={n} value={n}>{n}</option>)}
      </select>
      <select className="fld" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{fontSize:11,padding:"4px 8px",minWidth:100}}>
        <option value="date">Sort: Date</option>
        <option value="priority">Sort: Priority</option>
        <option value="status">Sort: Status</option>
      </select>
    </div>

    {/* ── Request list ── */}
    {filtered.length===0&&<div className="card" style={{padding:32,textAlign:"center",color:"#999"}}>No maintenance requests match the current filters.</div>}

    {filtered.map(req=>{
      const isExpanded=expandedId===req.id;
      const priColor=PRIORITY_COLORS[req.priority]||"b-gold";
      const statColor=STATUS_COLORS[req.status]||"b-gold";
      const nextLabel=nextStatusLabel(req.status);
      const tenant=req.tenantName||req.tenant||req.submitted_by||"";
      const propName=req.propName||"";
      const roomName=req.roomName||"";
      const dateStr=req.createdAt||req.created||"";
      const photos=req.photos||[];
      const hasPhotos=Array.isArray(photos)?photos.length>0:photos>0;

      return(<div key={req.id} className="card" style={{marginBottom:8,padding:0,overflow:"hidden"}}>
        {/* ── Row header ── */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer"}} onClick={()=>setExpandedId(isExpanded?null:req.id)}>
          <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:req.priority==="high"?"#c45c4a":req.priority==="medium"?"#d4a853":"#4a7c59"}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:13}}>{req.title}</div>
            <div style={{fontSize:11,color:"#888",marginTop:2}}>
              {tenant}{propName?` | ${propName}`:""}
              {roomName?` | ${roomName}`:""}
              {dateStr?` | ${dateStr}`:""}
              {hasPhotos&&<span style={{marginLeft:6,display:"inline-flex",alignItems:"center",gap:2}}><IconCamera/> {Array.isArray(photos)?photos.length:photos}</span>}
            </div>
          </div>
          <span className={`badge ${priColor}`} style={{fontSize:10}}>{PRIORITY_LABELS[req.priority]||req.priority}</span>
          <span className={`badge ${statColor}`} style={{fontSize:10}}>{STATUS_LABELS[req.status]||req.status}</span>
          {isExpanded?<IconChevUp/>:<IconChevDown/>}
        </div>

        {/* ── Expanded detail ── */}
        {isExpanded&&<div style={{borderTop:"1px solid rgba(0,0,0,.06)",padding:"14px 16px",background:"rgba(0,0,0,.015)"}}>
          {/* Description */}
          {(req.description||req.desc)&&<div style={{fontSize:12,color:"#444",marginBottom:12,lineHeight:1.5}}>{req.description||req.desc}</div>}

          {/* Photo thumbnails */}
          {Array.isArray(photos)&&photos.length>0&&<div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            {photos.map((url,i)=><img key={i} src={url} alt={`Photo ${i+1}`} style={{width:80,height:60,objectFit:"cover",borderRadius:6,border:"1px solid rgba(0,0,0,.1)"}}/>)}
          </div>}

          {/* Assigned vendor info */}
          {req.assignedVendor&&<div style={{fontSize:12,color:"#555",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
            <IconUser/> <strong>Vendor:</strong> {req.assignedVendor}
            {req.assignNotes&&<span style={{color:"#888"}}> -- {req.assignNotes}</span>}
          </div>}

          {/* Cost */}
          {req.cost!=null&&req.cost!==undefined&&<div style={{fontSize:12,color:"#555",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
            <IconDollar/> <strong>Cost:</strong> ${parseFloat(req.cost).toLocaleString()}
          </div>}

          {/* Completion notes */}
          {req.completeNotes&&<div style={{fontSize:12,color:"#555",marginBottom:8}}>
            <strong>Completion notes:</strong> {req.completeNotes}
          </div>}
          {req.completedAt&&<div style={{fontSize:11,color:"#888",marginBottom:8}}>Completed: {req.completedAt}</div>}

          {/* ── Status pipeline buttons ── */}
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
            {/* Pipeline stages */}
            <div style={{display:"flex",gap:2,alignItems:"center",marginRight:8}}>
              {STATUSES.map((s,i)=>{
                const isCurrent=req.status===s;
                const isPast=STATUSES.indexOf(req.status)>i;
                return(<span key={s} style={{display:"flex",alignItems:"center",gap:2}}>
                  <span style={{
                    display:"inline-flex",alignItems:"center",justifyContent:"center",
                    width:22,height:22,borderRadius:"50%",fontSize:9,fontWeight:700,
                    background:isCurrent?_acc:isPast?_acc+"33":"#eee",
                    color:isCurrent?"#fff":isPast?_acc:"#aaa",
                    border:isCurrent?`2px solid ${_acc}`:"2px solid transparent"
                  }}>{isPast?<IconCheck/>:i+1}</span>
                  {i<STATUSES.length-1&&<span style={{width:16,height:2,background:isPast?_acc+"66":"#ddd"}}/>}
                </span>);
              })}
            </div>

            {/* Advance button */}
            {nextLabel&&<button className="btn btn-sm" style={{background:_acc,color:"#fff",border:"none",fontSize:11}} onClick={()=>advanceStatus(req)}>
              {nextLabel}
            </button>}

            {/* Quick status select for any stage */}
            <select className="fld" value={req.status} onChange={e=>{
              const ns=e.target.value;
              if(ns==="assigned"&&req.status!=="assigned"){setAssignModal(req.id);setAssignVendor(req.assignedVendor||"");return;}
              if(ns==="completed"&&req.status!=="completed"){setCompleteModal(req.id);setCompleteCost(req.cost||"");setCompleteNotes("");return;}
              updateRequest(req.id,{status:ns});
            }} style={{fontSize:11,padding:"4px 8px"}}>
              {STATUSES.map(s=><option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>

            {/* Priority select */}
            <select className="fld" value={req.priority} onChange={e=>updateRequest(req.id,{priority:e.target.value})} style={{fontSize:11,padding:"4px 8px"}}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>}
      </div>);
    })}

    {/* ── Assign Vendor Modal ── */}
    {assignModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setAssignModal(null)}>
      <div className="card" style={{width:400,maxWidth:"90vw",padding:24}} onClick={e=>e.stopPropagation()}>
        <h3 style={{margin:"0 0 16px",fontSize:15}}>Assign Vendor</h3>

        {!showNewVendor?<>
          <label style={{fontSize:11,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Select Vendor</label>
          <select className="fld" value={assignVendor} onChange={e=>setAssignVendor(e.target.value)} style={{width:"100%",marginBottom:12}}>
            <option value="">-- Select --</option>
            {vendors.map(v=><option key={v.id||v.name} value={v.name}>{v.name}{v.category?` (${v.category})`:""}</option>)}
          </select>
          <button className="btn btn-sm btn-out" onClick={()=>setShowNewVendor(true)} style={{fontSize:11,marginBottom:12,display:"flex",alignItems:"center",gap:4}}>
            <IconPlus/> Add New Vendor
          </button>
        </>:<>
          <label style={{fontSize:11,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>New Vendor Name</label>
          <input className="fld" value={newVendorName} onChange={e=>setNewVendorName(e.target.value)} placeholder="Vendor name" style={{width:"100%",marginBottom:8}}/>
          <button className="btn btn-sm btn-out" onClick={()=>{setShowNewVendor(false);setNewVendorName("");}} style={{fontSize:11,marginBottom:12}}>Cancel</button>
        </>}

        <label style={{fontSize:11,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Notes (optional)</label>
        <textarea className="fld" value={assignNotes} onChange={e=>setAssignNotes(e.target.value)} rows={2} placeholder="Assignment notes..." style={{width:"100%",marginBottom:16,resize:"vertical"}}/>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button className="btn btn-out btn-sm" onClick={()=>setAssignModal(null)}>Cancel</button>
          <button className="btn btn-sm" style={{background:_acc,color:"#fff",border:"none"}} onClick={handleAssign} disabled={!assignVendor&&!newVendorName}>Assign</button>
        </div>
      </div>
    </div>}

    {/* ── Complete Modal ── */}
    {completeModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setCompleteModal(null)}>
      <div className="card" style={{width:400,maxWidth:"90vw",padding:24}} onClick={e=>e.stopPropagation()}>
        <h3 style={{margin:"0 0 16px",fontSize:15}}>Complete Request</h3>

        <label style={{fontSize:11,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Cost ($)</label>
        <input className="fld" type="number" step="0.01" min="0" value={completeCost} onChange={e=>setCompleteCost(e.target.value)} placeholder="0.00" style={{width:"100%",marginBottom:12}}/>

        <label style={{fontSize:11,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Completion Notes</label>
        <textarea className="fld" value={completeNotes} onChange={e=>setCompleteNotes(e.target.value)} rows={3} placeholder="What was done..." style={{width:"100%",marginBottom:16,resize:"vertical"}}/>

        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button className="btn btn-out btn-sm" onClick={()=>setCompleteModal(null)}>Cancel</button>
          <button className="btn btn-sm" style={{background:_acc,color:"#fff",border:"none"}} onClick={handleComplete}>Mark Completed</button>
        </div>
      </div>
    </div>}
  </div>);
}
