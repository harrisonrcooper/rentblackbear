"use client";
import { useState } from "react";

export default function IdeasTab({
  ideas, setIdeas, ideaView, setIdeaView, ideaFilter, setIdeaFilter,
  showNewCat, setShowNewCat, newCatInput, setNewCatInput,
  expanded, setExpanded, setModal, uid,
}) {
  const cats=[...new Set(ideas.filter(i=>!i.archived).map(i=>i.cat))];
  const allCats=[...new Set(ideas.map(i=>i.cat))];
  const statuses=["Idea","Planned","Building","Done"];
  const priColors={high:"#c45c4a",medium:"#d4a853",low:"#4a7c59"};
  const priLabels={high:"High",medium:"Med",low:"Low"};
  const priBg={high:"rgba(196,92,74,.08)",medium:"rgba(212,168,83,.08)",low:"rgba(74,124,89,.08)"};
  const stBg={Idea:"rgba(0,0,0,.04)",Planned:"rgba(59,130,246,.08)",Building:"rgba(212,168,83,.1)",Done:"rgba(74,124,89,.08)"};
  const stTxt={Idea:"#999",Planned:"#3b82f6",Building:"#9a7422",Done:"#4a7c59"};
  const showArchived=expanded.showArchived||false;
  const active=ideas.filter(i=>!i.archived);
  const archived=ideas.filter(i=>i.archived);
  const filtered=ideaFilter==="all"?active:ideaFilter==="high"||ideaFilter==="medium"||ideaFilter==="low"?active.filter(i=>i.priority===ideaFilter):active.filter(i=>i.status===ideaFilter);
  const updIdea=(id,f,v)=>setIdeas(p=>p.map(x=>x.id===id?{...x,[f]:v}:x));
  const archiveIdea=(id)=>setIdeas(p=>p.map(x=>x.id===id?{...x,archived:true}:x));
  const unarchiveIdea=(id)=>setIdeas(p=>p.map(x=>x.id===id?{...x,archived:false}:x));
  const delIdea=(id)=>setModal({type:"confirmAction",title:"Delete Idea",body:"Permanently delete this idea? This cannot be undone.",confirmLabel:"Delete",confirmStyle:"btn-red",onConfirm:()=>{setIdeas(p=>p.filter(x=>x.id!==id));setModal(null);}});
  const openEdit=(idea)=>setModal({type:"editIdea",idea:{...idea}});

  const IdeaCard=({i})=>(
    <div style={{padding:10,border:"1px solid rgba(0,0,0,.06)",borderRadius:8,marginBottom:6,background:"#fff",transition:"all .12s"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      <div style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:8}}>
        <span style={{flexShrink:0,fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,background:priBg[i.priority],color:priColors[i.priority],marginTop:2,textTransform:"uppercase",letterSpacing:.5}}>{priLabels[i.priority]}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:700,color:"#1a1714",lineHeight:1.4}}>{i.title}</div>
          {i.notes&&<div style={{fontSize:10,color:"#6b5e52",lineHeight:1.4,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.notes}</div>}
          {i.link&&<a href={i.link} target="_blank" rel="noreferrer" style={{fontSize:9,color:"#3b82f6",textDecoration:"none",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}} onClick={e=>e.stopPropagation()}>↗ {i.link}</a>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid rgba(0,0,0,.04)",paddingTop:7}}>
        <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:stBg[i.status],color:stTxt[i.status]}}>{i.status}</span>
        <div style={{display:"flex",gap:4}}>
          <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={e=>{e.stopPropagation();openEdit(i);}}>+ Edit</button>
          <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={e=>{e.stopPropagation();archiveIdea(i.id);}}>Archive</button>
          <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px",color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={e=>{e.stopPropagation();delIdea(i.id);}}>Delete</button>
        </div>
      </div>
    </div>
  );

  const IdeaRow=({i})=>(
    <div className="row" style={{cursor:"pointer"}} onClick={()=>openEdit(i)}>
      <span style={{fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,background:priBg[i.priority],color:priColors[i.priority],textTransform:"uppercase",letterSpacing:.5,whiteSpace:"nowrap"}}>{priLabels[i.priority]}</span>
      <div className="row-i">
        <div className="row-t">{i.title}</div>
        <div className="row-s">{i.cat}{i.notes&&" · "+i.notes.slice(0,60)+(i.notes.length>60?"...":"")}</div>
      </div>
      <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,background:stBg[i.status],color:stTxt[i.status],whiteSpace:"nowrap"}}>{i.status}</span>
      <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
        <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={()=>archiveIdea(i.id)}>Archive</button>
        <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px",color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>delIdea(i.id)}>Delete</button>
      </div>
    </div>
  );

  return(<>
    {/* KPIs */}
    <div className="kgrid" style={{gridTemplateColumns:"repeat(5,1fr)"}}>
      <div className="kpi"><div className="kl">Total</div><div className="kv">{active.length}</div></div>
      <div className="kpi"><div className="kl">Idea</div><div className="kv">{active.filter(i=>i.status==="Idea").length}</div></div>
      <div className="kpi"><div className="kl">Planned</div><div className="kv">{active.filter(i=>i.status==="Planned").length}</div></div>
      <div className="kpi"><div className="kl">Building</div><div className="kv kw">{active.filter(i=>i.status==="Building").length}</div></div>
      <div className="kpi"><div className="kl">Done</div><div className="kv kg">{active.filter(i=>i.status==="Done").length}</div></div>
    </div>

    {/* Toolbar */}
    <div className="sec-hd" style={{marginBottom:12}}>
      <div style={{display:"flex",gap:4}}>
        {[["board","Board"],["list","List"],["status","Status"]].map(([v,l])=><button key={v} className={`btn ${ideaView===v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setIdeaView(v)}>{l}</button>)}
      </div>
      <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
        <select value={ideaFilter} onChange={e=>setIdeaFilter(e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}>
          <option value="all">All</option>
          <optgroup label="Status">{statuses.map(s=><option key={s} value={s}>{s}</option>)}</optgroup>
          <optgroup label="Priority"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></optgroup>
        </select>
        <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"newIdea",cat:cats[0]||"General",title:"",priority:"medium",status:"Idea",notes:"",link:""})}>+ New</button>
        {!showNewCat
          ?<button className="btn btn-out btn-sm" onClick={()=>setShowNewCat(true)}>+ Category</button>
          :<div style={{display:"flex",gap:3}}>
            <input value={newCatInput} onChange={e=>setNewCatInput(e.target.value)} placeholder="Category name..." autoFocus
              onKeyDown={e=>{if(e.key==="Enter"&&newCatInput.trim()){setIdeas(p=>[{id:uid(),title:"New idea",cat:newCatInput.trim(),priority:"medium",status:"Idea",notes:"",link:"",archived:false},...p]);setNewCatInput("");setShowNewCat(false);}}}
              style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:10,fontFamily:"inherit",width:120}}/>
            <button className="btn btn-gold btn-sm" disabled={!newCatInput.trim()} onClick={()=>{setIdeas(p=>[{id:uid(),title:"New idea",cat:newCatInput.trim(),priority:"medium",status:"Idea",notes:"",link:"",archived:false},...p]);setNewCatInput("");setShowNewCat(false);}}>Add</button>
            <button className="btn btn-out btn-sm" onClick={()=>{setShowNewCat(false);setNewCatInput("");}}>&#10005;</button>
          </div>}
      </div>
    </div>

    {/* Board view */}
    {ideaView==="board"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
      {cats.map(cat=>{const catIdeas=filtered.filter(i=>i.cat===cat);return(
        <div key={cat} style={{background:"#fff",borderRadius:12,border:"2px solid rgba(0,0,0,.08)",boxShadow:"0 2px 8px rgba(0,0,0,.05)",overflow:"hidden"}}>
          {/* Category header */}
          <div style={{padding:"11px 14px",background:"#1a1714",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:12,fontWeight:800,color:"#f5f0e8",letterSpacing:.3}}>{cat}</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{fontSize:10,fontWeight:700,color:"#d4a853",background:"rgba(212,168,83,.15)",padding:"1px 8px",borderRadius:100}}>{catIdeas.length}</span>
              <button style={{background:"rgba(255,255,255,.1)",border:"none",color:"#d4a853",cursor:"pointer",fontSize:16,lineHeight:1,width:22,height:22,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}} onClick={()=>setModal({type:"newIdea",cat,title:"",priority:"medium",status:"Idea",notes:"",link:""})}>+</button>
            </div>
          </div>
          {/* Cards area */}
          <div style={{padding:10,minHeight:80,background:"#faf9f7"}}>
            {catIdeas.map(i=><IdeaCard key={i.id} i={i}/>)}
            {catIdeas.length===0&&<div style={{textAlign:"center",padding:20,color:"#8a7d74",fontSize:10,fontStyle:"italic"}}>No ideas yet — click + to add one</div>}
          </div>
        </div>);})}
    </div>}

    {/* List view */}
    {ideaView==="list"&&<>
      {filtered.map(i=><IdeaRow key={i.id} i={i}/>)}
      {filtered.length===0&&<div style={{textAlign:"center",padding:32,color:"#6b5e52",fontSize:12}}>No ideas match this filter</div>}
    </>}

    {/* Status view */}
    {ideaView==="status"&&<>{statuses.map(st=>{const stIdeas=filtered.filter(i=>i.status===st);return(
      <div key={st} style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:800,color:stTxt[st],textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:stBg[st],borderRadius:6}}>
          {st} <span style={{fontWeight:500,opacity:.7}}>({stIdeas.length})</span>
        </div>
        {stIdeas.map(i=><IdeaRow key={i.id} i={i}/>)}
        {stIdeas.length===0&&<div style={{padding:"8px 12px",fontSize:11,color:"#8a7d74",fontStyle:"italic"}}>Nothing here</div>}
      </div>);})}
    </>}

    {/* Archived toggle */}
    {archived.length>0&&<div style={{marginTop:20,borderTop:"1px solid rgba(0,0,0,.06)",paddingTop:14}}>
      <button className="btn btn-out btn-sm" style={{width:"100%",color:"#6b5e52"}} onClick={()=>setExpanded(p=>({...p,showArchived:!p.showArchived}))}>
        {showArchived?"▾ Hide":"▸ Show"} Archived ({archived.length})
      </button>
      {showArchived&&<div style={{marginTop:10}}>
        {archived.map(i=>(
          <div key={i.id} className="row" style={{opacity:.55}}>
            <span style={{fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,background:priBg[i.priority],color:priColors[i.priority],textTransform:"uppercase",letterSpacing:.5}}>{priLabels[i.priority]}</span>
            <div className="row-i"><div className="row-t" style={{textDecoration:"line-through"}}>{i.title}</div><div className="row-s">{i.cat}</div></div>
            <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>unarchiveIdea(i.id)}>Restore</button>
            <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>delIdea(i.id)}>Delete</button>
          </div>
        ))}
      </div>}
    </div>}
  </>);
}
