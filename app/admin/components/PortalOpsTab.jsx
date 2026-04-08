"use client";
import { useState } from "react";

export default function PortalOpsTab({
  settings, properties, uid, allTenants,
  utilityBills, setUtilityBills,
  docRequests, setDocRequests,
  amenities, setAmenities,
  amenityBookings, setAmenityBookings,
  surveys, setSurveys,
  surveyResults,
  packages, setPackages,
}) {

  const props = properties || [];
  const [portalOpsTab, setPortalOpsTab] = useState("utilities");
  const [utilBillForm, setUtilBillForm] = useState({propId:"",month:"",electric:"",gas:"",water:"",internet:"",coverage:"",residentCount:""});
  const [docReqForm, setDocReqForm] = useState({tenantId:"",docType:"",deadline:"",notes:""});
  const [amenityForm, setAmenityForm] = useState({propId:"",name:"",timeSlots:"",description:""});
  const [surveyForm, setSurveyForm] = useState({tenantId:"",type:"move-in-30",notes:""});
  const [pkgForm, setPkgForm] = useState({tenantId:"",carrier:"",tracking:"",description:"",locker:""});
  const _ac=settings?.adminAccent||"#4a7c59";
        const subTabs=[
          {id:"utilities",label:"Utility Bills",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>},
          {id:"doc-requests",label:"Document Requests",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>},
          {id:"amenities",label:"Amenities",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>},
          {id:"surveys",label:"Surveys",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>},
          {id:"packages",label:"Packages",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>},
        ];
        const fmtS=n=>"$"+Number(n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});

        return(<div style={{padding:"0 0 40px"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <h2 style={{margin:0,fontSize:18,fontWeight:700}}>Portal Operations</h2>
              <div style={{fontSize:11,color:"#6b5e52",marginTop:2}}>Manage utilities, documents, amenities, surveys, and packages for tenant portal</div>
            </div>
          </div>

          {/* Sub-tab bar */}
          <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:"1px solid rgba(0,0,0,.08)"}}>
            {subTabs.map(st=>{
              const active=portalOpsTab===st.id;
              return(
              <button key={st.id} onClick={()=>setPortalOpsTab(st.id)}
                style={{display:"flex",alignItems:"center",gap:6,padding:"10px 18px",border:"none",borderBottom:active?`2px solid ${_ac}`:"2px solid transparent",background:"transparent",color:active?"#1a1714":"#7a7067",fontWeight:active?700:400,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap"}}>
                {st.icon}{st.label}
              </button>);
            })}
          </div>

          {/* ═══ UTILITY BILLS SUB-TAB ═══ */}
          {portalOpsTab==="utilities"&&(<>
            <div className="card" style={{marginBottom:20}}><div className="card-bd" style={{padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Enter Monthly Utility Bill</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
                <div style={{gridColumn:"1/5"}}>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Property</label>
                  <select value={utilBillForm.propId} onChange={e=>setUtilBillForm(f=>({...f,propId:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
                    <option value="">Select property...</option>
                    {props.map(p=><option key={p.id} value={p.id}>{p.addr||p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Month</label>
                  <input type="month" value={utilBillForm.month} onChange={e=>setUtilBillForm(f=>({...f,month:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Electric ($)</label>
                  <input type="number" value={utilBillForm.electric} onChange={e=>setUtilBillForm(f=>({...f,electric:e.target.value}))} placeholder="0.00" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Gas ($)</label>
                  <input type="number" value={utilBillForm.gas} onChange={e=>setUtilBillForm(f=>({...f,gas:e.target.value}))} placeholder="0.00" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Water ($)</label>
                  <input type="number" value={utilBillForm.water} onChange={e=>setUtilBillForm(f=>({...f,water:e.target.value}))} placeholder="0.00" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Internet ($)</label>
                  <input type="number" value={utilBillForm.internet} onChange={e=>setUtilBillForm(f=>({...f,internet:e.target.value}))} placeholder="0.00" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Coverage Amount ($)</label>
                  <input type="number" value={utilBillForm.coverage} onChange={e=>setUtilBillForm(f=>({...f,coverage:e.target.value}))} placeholder="0.00" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Resident Count</label>
                  <input type="number" value={utilBillForm.residentCount} onChange={e=>setUtilBillForm(f=>({...f,residentCount:e.target.value}))} placeholder="0" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
              </div>
              <button className="btn btn-green btn-sm" onClick={()=>{
                if(!utilBillForm.propId||!utilBillForm.month)return;
                const p=props.find(x=>x.id===utilBillForm.propId);
                const total=parseFloat(utilBillForm.electric||0)+parseFloat(utilBillForm.gas||0)+parseFloat(utilBillForm.water||0)+parseFloat(utilBillForm.internet||0);
                setUtilityBills(prev=>[{id:uid(),propId:utilBillForm.propId,propName:p?.addr||p?.name||"",month:utilBillForm.month,electric:parseFloat(utilBillForm.electric||0),gas:parseFloat(utilBillForm.gas||0),water:parseFloat(utilBillForm.water||0),internet:parseFloat(utilBillForm.internet||0),total,coverage:parseFloat(utilBillForm.coverage||0),residentCount:parseInt(utilBillForm.residentCount||0),created:new Date().toISOString()},...prev]);
                setUtilBillForm({propId:"",month:"",electric:"",gas:"",water:"",internet:"",coverage:"",residentCount:""});
              }}>Save Bill</button>
            </div></div>

            {/* History */}
            <div className="card"><div className="card-bd" style={{padding:0}}>
              <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:13,fontWeight:700}}>Bill History</div>
              {utilityBills.length===0&&<div style={{padding:"30px 20px",textAlign:"center",color:"#7a7067",fontSize:12}}>No utility bills recorded yet.</div>}
              {utilityBills.length>0&&<div style={{fontSize:11}}>
                <div style={{display:"grid",gridTemplateColumns:"180px 80px 70px 70px 70px 70px 80px 70px 50px",padding:"8px 14px",borderBottom:"1px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.02)"}}>
                  {["Property","Month","Electric","Gas","Water","Internet","Total","Coverage","Res."].map(h=><div key={h} style={{fontSize:9,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.5}}>{h}</div>)}
                </div>
                {utilityBills.map(b=>(
                  <div key={b.id} style={{display:"grid",gridTemplateColumns:"180px 80px 70px 70px 70px 70px 80px 70px 50px",padding:"8px 14px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center"}}>
                    <div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.propName}</div>
                    <div>{b.month}</div>
                    <div>{fmtS(b.electric)}</div>
                    <div>{fmtS(b.gas)}</div>
                    <div>{fmtS(b.water)}</div>
                    <div>{fmtS(b.internet)}</div>
                    <div style={{fontWeight:700}}>{fmtS(b.total)}</div>
                    <div>{fmtS(b.coverage)}</div>
                    <div>{b.residentCount||"--"}</div>
                  </div>
                ))}
              </div>}
            </div></div>
          </>)}

          {/* ═══ DOCUMENT REQUESTS SUB-TAB ═══ */}
          {portalOpsTab==="doc-requests"&&(<>
            <div className="card" style={{marginBottom:20}}><div className="card-bd" style={{padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Send Document Request</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Tenant</label>
                  <select value={docReqForm.tenantId} onChange={e=>setDocReqForm(f=>({...f,tenantId:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
                    <option value="">Select tenant...</option>
                    {allTenants.map(t=><option key={t.id} value={t.id}>{t.tenant?.name||"Unknown"} -- {t.propName}, {t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Document Type</label>
                  <select value={docReqForm.docType} onChange={e=>setDocReqForm(f=>({...f,docType:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
                    <option value="">Select type...</option>
                    <option value="proof-of-income">Proof of Income</option>
                    <option value="renters-insurance">Renters Insurance</option>
                    <option value="photo-id">Photo ID</option>
                    <option value="pet-documentation">Pet Documentation</option>
                    <option value="vehicle-registration">Vehicle Registration</option>
                    <option value="employer-letter">Employer Verification Letter</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Deadline</label>
                  <input type="date" value={docReqForm.deadline} onChange={e=>setDocReqForm(f=>({...f,deadline:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div style={{gridColumn:"1/4"}}>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Notes (optional)</label>
                  <input value={docReqForm.notes} onChange={e=>setDocReqForm(f=>({...f,notes:e.target.value}))} placeholder="Additional instructions..." style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
              </div>
              <button className="btn btn-green btn-sm" onClick={()=>{
                if(!docReqForm.tenantId||!docReqForm.docType)return;
                const t=allTenants.find(x=>x.id===docReqForm.tenantId);
                setDocRequests(prev=>[{id:uid(),tenantId:docReqForm.tenantId,tenantName:t?.tenant?.name||"Unknown",tenantEmail:t?.tenant?.email||"",propName:t?.propName||"",roomName:t?.name||"",docType:docReqForm.docType,deadline:docReqForm.deadline,notes:docReqForm.notes,status:"pending",created:new Date().toISOString().split("T")[0]},...prev]);
                setDocReqForm({tenantId:"",docType:"",deadline:"",notes:""});
              }}>Send Request</button>
            </div></div>

            {/* Request list */}
            <div className="card"><div className="card-bd" style={{padding:0}}>
              <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:13,fontWeight:700}}>Active Requests</div>
              {docRequests.length===0&&<div style={{padding:"30px 20px",textAlign:"center",color:"#7a7067",fontSize:12}}>No document requests sent yet.</div>}
              {docRequests.length>0&&<div style={{fontSize:11}}>
                {docRequests.map(dr=>(
                  <div key={dr.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dr.status==="fulfilled"?"#4a7c59":"#6b5e52"} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                      <div>
                        <div style={{fontWeight:700,fontSize:12}}>{dr.tenantName} -- {dr.docType.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</div>
                        <div style={{fontSize:10,color:"#6b5e52"}}>{dr.propName}, {dr.roomName} -- Due: {dr.deadline||"No deadline"}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,textTransform:"uppercase",letterSpacing:.5,background:dr.status==="fulfilled"?"rgba(74,124,89,.1)":dr.status==="overdue"?"rgba(196,92,74,.1)":"rgba(212,168,83,.1)",color:dr.status==="fulfilled"?"#4a7c59":dr.status==="overdue"?"#c45c4a":"#9a7422"}}>{dr.status}</span>
                      {dr.status==="pending"&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setDocRequests(prev=>prev.map(x=>x.id===dr.id?{...x,status:"fulfilled",fulfilledAt:new Date().toISOString()}:x))}>Mark Fulfilled</button>}
                    </div>
                  </div>
                ))}
              </div>}
            </div></div>
          </>)}

          {/* ═══ AMENITIES SUB-TAB ═══ */}
          {portalOpsTab==="amenities"&&(<>
            <div className="card" style={{marginBottom:20}}><div className="card-bd" style={{padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Add Shared Amenity</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Property</label>
                  <select value={amenityForm.propId} onChange={e=>setAmenityForm(f=>({...f,propId:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
                    <option value="">Select property...</option>
                    {props.map(p=><option key={p.id} value={p.id}>{p.addr||p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Amenity Name</label>
                  <input value={amenityForm.name} onChange={e=>setAmenityForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Laundry Room, Study Room, BBQ Grill" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Time Slots</label>
                  <input value={amenityForm.timeSlots} onChange={e=>setAmenityForm(f=>({...f,timeSlots:e.target.value}))} placeholder="e.g. 8am-10am, 10am-12pm, 12pm-2pm" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Description (optional)</label>
                  <input value={amenityForm.description} onChange={e=>setAmenityForm(f=>({...f,description:e.target.value}))} placeholder="Rules or notes..." style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
              </div>
              <button className="btn btn-green btn-sm" onClick={()=>{
                if(!amenityForm.propId||!amenityForm.name)return;
                const p=props.find(x=>x.id===amenityForm.propId);
                setAmenities(prev=>[...prev,{id:uid(),propId:amenityForm.propId,propName:p?.addr||p?.name||"",name:amenityForm.name,timeSlots:amenityForm.timeSlots.split(",").map(s=>s.trim()).filter(Boolean),description:amenityForm.description,active:true,created:new Date().toISOString().split("T")[0]}]);
                setAmenityForm({propId:"",name:"",timeSlots:"",description:""});
              }}>Add Amenity</button>
            </div></div>

            {/* Amenity list */}
            {amenities.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#7a7067",fontSize:12}}>No amenities configured. Add shared amenities for your properties above.</div>}
            {amenities.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
              {amenities.map(am=>{
                const bks=amenityBookings.filter(b=>b.amenityId===am.id);
                return(
                <div key={am.id} className="card"><div className="card-bd" style={{padding:"16px 20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:700}}>{am.name}</div>
                      <div style={{fontSize:10,color:"#6b5e52"}}>{am.propName}</div>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setAmenities(prev=>prev.map(x=>x.id===am.id?{...x,active:!x.active}:x))}>{am.active?"Deactivate":"Activate"}</button>
                      <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#c45c4a"}} onClick={()=>setAmenities(prev=>prev.filter(x=>x.id!==am.id))}>Delete</button>
                    </div>
                  </div>
                  {am.description&&<div style={{fontSize:11,color:"#5c4a3a",marginBottom:8}}>{am.description}</div>}
                  {(am.timeSlots||[]).length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                    {am.timeSlots.map((s,i)=><span key={i} style={{fontSize:9,fontWeight:600,padding:"2px 8px",borderRadius:100,background:"rgba(0,0,0,.04)",color:"#5c4a3a"}}>{s}</span>)}
                  </div>}
                  <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",marginBottom:4}}>{bks.length} booking{bks.length!==1?"s":""}</div>
                  {bks.slice(0,3).map(b=>(
                    <div key={b.id} style={{display:"flex",justifyContent:"space-between",fontSize:10,padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.03)"}}>
                      <span>{b.tenantName} -- {b.slot}</span>
                      <span style={{color:"#6b5e52"}}>{b.date}</span>
                    </div>
                  ))}
                  {bks.length>3&&<div style={{fontSize:9,color:_ac,marginTop:4,cursor:"pointer"}}>+{bks.length-3} more</div>}
                </div></div>);
              })}
            </div>}
          </>)}

          {/* ═══ SURVEYS SUB-TAB ═══ */}
          {portalOpsTab==="surveys"&&(<>
            <div className="card" style={{marginBottom:20}}><div className="card-bd" style={{padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Trigger Survey</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Tenant</label>
                  <select value={surveyForm.tenantId} onChange={e=>setSurveyForm(f=>({...f,tenantId:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
                    <option value="">Select tenant...</option>
                    {allTenants.map(t=><option key={t.id} value={t.id}>{t.tenant?.name||"Unknown"} -- {t.propName}, {t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Survey Type</label>
                  <select value={surveyForm.type} onChange={e=>setSurveyForm(f=>({...f,type:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
                    <option value="move-in-30">Move-In 30-Day</option>
                    <option value="pre-renewal">Pre-Renewal</option>
                    <option value="general">General Satisfaction</option>
                    <option value="move-out">Move-Out</option>
                  </select>
                </div>
                <div style={{gridColumn:"1/3"}}>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Notes (optional)</label>
                  <input value={surveyForm.notes} onChange={e=>setSurveyForm(f=>({...f,notes:e.target.value}))} placeholder="Additional context or custom questions..." style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
              </div>
              <button className="btn btn-green btn-sm" onClick={()=>{
                if(!surveyForm.tenantId)return;
                const t=allTenants.find(x=>x.id===surveyForm.tenantId);
                setSurveys(prev=>[{id:uid(),tenantId:surveyForm.tenantId,tenantName:t?.tenant?.name||"Unknown",tenantEmail:t?.tenant?.email||"",propName:t?.propName||"",type:surveyForm.type,notes:surveyForm.notes,status:"sent",created:new Date().toISOString().split("T")[0]},...prev]);
                setSurveyForm({tenantId:"",type:"move-in-30",notes:""});
              }}>Send Survey</button>
            </div></div>

            {/* Sent surveys */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {/* Left: sent surveys */}
              <div className="card"><div className="card-bd" style={{padding:0}}>
                <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:13,fontWeight:700}}>Sent Surveys ({surveys.length})</div>
                {surveys.length===0&&<div style={{padding:"30px 20px",textAlign:"center",color:"#7a7067",fontSize:12}}>No surveys sent yet.</div>}
                {surveys.map(sv=>(
                  <div key={sv.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 20px",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600}}>{sv.tenantName}</div>
                      <div style={{fontSize:10,color:"#6b5e52"}}>{sv.type.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())} -- {sv.created}</div>
                    </div>
                    <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,textTransform:"uppercase",letterSpacing:.5,background:sv.status==="completed"?"rgba(74,124,89,.1)":"rgba(212,168,83,.1)",color:sv.status==="completed"?"#4a7c59":"#9a7422"}}>{sv.status}</span>
                  </div>
                ))}
              </div></div>

              {/* Right: results */}
              <div className="card"><div className="card-bd" style={{padding:0}}>
                <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:13,fontWeight:700}}>Survey Results ({surveyResults.length})</div>
                {surveyResults.length===0&&<div style={{padding:"30px 20px",textAlign:"center",color:"#7a7067",fontSize:12}}>No results yet. Results appear when tenants complete surveys.</div>}
                {surveyResults.map(sr=>(
                  <div key={sr.id} style={{padding:"12px 20px",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{fontSize:12,fontWeight:600}}>{sr.tenantName} -- {(sr.type||"").replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</div>
                      <div style={{fontSize:10,color:"#6b5e52"}}>{sr.completed||sr.created}</div>
                    </div>
                    {sr.rating!=null&&<div style={{display:"flex",gap:2,marginBottom:4}}>
                      {[1,2,3,4,5].map(star=>(
                        <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star<=sr.rating?"#d4a853":"none"} stroke="#d4a853" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ))}
                      <span style={{fontSize:11,fontWeight:700,color:"#5c4a3a",marginLeft:4}}>{sr.rating}/5</span>
                    </div>}
                    {sr.feedback&&<div style={{fontSize:11,color:"#5c4a3a",fontStyle:"italic"}}>&quot;{sr.feedback}&quot;</div>}
                  </div>
                ))}
              </div></div>
            </div>
          </>)}

          {/* ═══ PACKAGES SUB-TAB ═══ */}
          {portalOpsTab==="packages"&&(<>
            <div className="card" style={{marginBottom:20}}><div className="card-bd" style={{padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Log Incoming Package</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Tenant</label>
                  <select value={pkgForm.tenantId} onChange={e=>setPkgForm(f=>({...f,tenantId:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
                    <option value="">Select tenant...</option>
                    {allTenants.map(t=><option key={t.id} value={t.id}>{t.tenant?.name||"Unknown"} -- {t.propName}, {t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Carrier</label>
                  <select value={pkgForm.carrier} onChange={e=>setPkgForm(f=>({...f,carrier:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
                    <option value="">Select carrier...</option>
                    <option value="USPS">USPS</option>
                    <option value="UPS">UPS</option>
                    <option value="FedEx">FedEx</option>
                    <option value="Amazon">Amazon</option>
                    <option value="DHL">DHL</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Tracking Number</label>
                  <input value={pkgForm.tracking} onChange={e=>setPkgForm(f=>({...f,tracking:e.target.value}))} placeholder="Optional" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Description</label>
                  <input value={pkgForm.description} onChange={e=>setPkgForm(f=>({...f,description:e.target.value}))} placeholder="e.g. Small box, large envelope" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Locker / Location</label>
                  <input value={pkgForm.locker} onChange={e=>setPkgForm(f=>({...f,locker:e.target.value}))} placeholder="e.g. Locker 5, Front desk" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
              </div>
              <button className="btn btn-green btn-sm" onClick={()=>{
                if(!pkgForm.tenantId||!pkgForm.carrier)return;
                const t=allTenants.find(x=>x.id===pkgForm.tenantId);
                setPackages(prev=>[{id:uid(),tenantId:pkgForm.tenantId,tenantName:t?.tenant?.name||"Unknown",tenantEmail:t?.tenant?.email||"",propName:t?.propName||"",roomName:t?.name||"",carrier:pkgForm.carrier,tracking:pkgForm.tracking,description:pkgForm.description,locker:pkgForm.locker,status:"waiting",loggedAt:new Date().toISOString(),pickedUpAt:null},...prev]);
                setPkgForm({tenantId:"",carrier:"",tracking:"",description:"",locker:""});
              }}>Log Package</button>
            </div></div>

            {/* Package list */}
            <div className="card"><div className="card-bd" style={{padding:0}}>
              <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:13,fontWeight:700}}>Package Log ({packages.length})</div>
                <div style={{fontSize:10,color:"#6b5e52"}}>{packages.filter(p=>p.status==="waiting").length} awaiting pickup</div>
              </div>
              {packages.length===0&&<div style={{padding:"30px 20px",textAlign:"center",color:"#7a7067",fontSize:12}}>No packages logged yet.</div>}
              {packages.length>0&&<div style={{fontSize:11}}>
                <div style={{display:"grid",gridTemplateColumns:"160px 80px 120px 140px 100px 100px 80px",padding:"8px 14px",borderBottom:"1px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.02)"}}>
                  {["Tenant","Carrier","Tracking","Description","Locker","Logged","Status"].map(h=><div key={h} style={{fontSize:9,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.5}}>{h}</div>)}
                </div>
                {packages.map(pk=>(
                  <div key={pk.id} style={{display:"grid",gridTemplateColumns:"160px 80px 120px 140px 100px 100px 80px",padding:"8px 14px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center"}}>
                    <div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pk.tenantName}</div>
                    <div>{pk.carrier}</div>
                    <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:10}}>{pk.tracking||"--"}</div>
                    <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pk.description||"--"}</div>
                    <div>{pk.locker||"--"}</div>
                    <div style={{fontSize:10}}>{pk.loggedAt?new Date(pk.loggedAt).toLocaleDateString():""}</div>
                    <div>{pk.status==="waiting"
                      ?<button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={()=>setPackages(prev=>prev.map(x=>x.id===pk.id?{...x,status:"picked-up",pickedUpAt:new Date().toISOString()}:x))}>Pick Up</button>
                      :<span style={{fontSize:10,fontWeight:600,color:"#4a7c59"}}>Picked up</span>}
                    </div>
                  </div>
                ))}
              </div>}
            </div></div>
          </>)}

        </div>);
      
}
