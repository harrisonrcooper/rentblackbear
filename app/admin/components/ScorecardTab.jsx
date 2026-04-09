"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";

export default function ScorecardTab({
  m, drill, setDrill, fmtS, allRooms, props, setModal, roomSubLine, openPayForm, getPropDisplayName,
  showCharts, setShowCharts, scRows, scMeasurables, scorecard, scDrill, setScDrill,
  allMonths, liveMonth, prevMonth, twoMonthsAgo, CUR_WEEK, MO, setTab,
}) {
  return (<>
        <div className="kgrid">
          <div className={`kpi ${drill==="sc-occ"?"active":""}`} onClick={()=>setDrill(drill==="sc-occ"?null:"sc-occ")}><div className="kl"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:"inline",verticalAlign:"middle",marginRight:4}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Occupancy</div><div className="kv" style={{color:m.occRate>=90?"#4a7c59":"#c45c4a"}}>{m.occRate}%</div><div className="ks">{m.occ}/{m.total} rooms</div></div>
          <div className={`kpi ${drill==="sc-coll"?"active":""}`} onClick={()=>setDrill(drill==="sc-coll"?null:"sc-coll")}><div className="kl">Collection</div><div className="kv" style={{color:m.collRate>=90?"#4a7c59":"#c45c4a"}}>{m.collRate}%</div><div className="ks">{fmtS(m.coll)} / {fmtS(m.due)}</div></div>
          <div className={`kpi ${drill==="sc-vac"?"active":""}`} onClick={()=>setDrill(drill==="sc-vac"?null:"sc-vac")}><div className="kl">Vacancy</div><div className="kv" style={{color:m.lost>0?"#c45c4a":"#4a7c59"}}>{fmtS(m.lost)}</div><div className="ks">/month lost</div></div>
          <div className={`kpi ${drill==="sc-gaps"?"active":""}`} onClick={()=>setDrill(drill==="sc-gaps"?null:"sc-gaps")}><div className="kl">Turnover Gaps</div><div className="kv" style={{color:(m.turnoverGapCost||0)>0?"#d4a853":"#4a7c59"}}>{fmtS(m.turnoverGapCost||0)}</div><div className="ks">{(m.turnoverGaps||[]).length} gap{(m.turnoverGaps||[]).length!==1?"s":""} &middot; {m.turnoverGapDays||0}d</div></div>
          <div className={`kpi ${drill==="sc-proj"?"active":""}`} onClick={()=>setDrill(drill==="sc-proj"?null:"sc-proj")}><div className="kl">Projected</div><div className="kv">{fmtS(m.proj)}</div><div className="ks">of {fmtS(m.full)}</div></div>
        </div>

        {/* Drill: Occupancy */}
        {drill==="sc-occ"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Occupancy: {m.occ}/{m.total}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>&#10005;</button></div>
          {m.propBreakdown.map(pr=>{const pct=pr.occCount/(pr.occCount+pr.vacCount)*100;return(<div key={pr.id} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontWeight:700,fontSize:13}}>{pr.name} <span style={{fontSize:11,color:"#6b5e52"}}>{pr.type}</span></div><span className={`badge ${pr.vacCount?"b-red":"b-green"}`}>{pr.occCount}/{allRooms(pr).length} · {Math.round(pct)}%</span></div>
            <div style={{height:5,borderRadius:3,background:"#e5e3df",marginBottom:6}}><div style={{height:"100%",borderRadius:3,background:pct>=100?"#4a7c59":pct>=75?"#d4a853":"#c45c4a",width:`${pct}%`}}/></div>
            {allRooms(pr).map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2,cursor:r.tenant?"pointer":"default"}} onClick={()=>{if(r.tenant)setModal({type:"tenant",data:{...r,propName:pr.name,propUtils:(pr.units||[])[0]?.utils||pr.utils,propClean:(pr.units||[])[0]?.clean||pr.clean}});}}><div className="row-dot" style={{background:r.st==="vacant"?"#c45c4a":"#4a7c59"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:r.tenant?"#999":"#c45c4a"}}>{(r.tenant&&r.tenant.name)||"Vacant"}{r.tenant&&<span style={{color:"#c4a882",marginLeft:4}}>→ view</span>}</div></div><div style={{fontSize:12,fontWeight:700}}>{fmtS(r.rent)}</div></div>)}
          </div>);})}
        </div></div>}

        {/* Drill: Collection */}
        {drill==="sc-coll"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Collection: {fmtS(m.coll)} / {fmtS(m.due)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>&#10005;</button></div>
          {m.unpaid.length>0&&<><div style={{fontSize:9,fontWeight:700,color:"#c45c4a",marginBottom:6}}>UNPAID ({m.unpaid.length})</div>{m.unpaid.map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div className="row-s">{roomSubLine(r.propName,r.name)}</div></div><div className="row-v kb">{fmtS(r.rent)}</div><button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();openPayForm(r.id);}}>Pay</button></div>)}</>}
          {m.paid.length>0&&<><div style={{fontSize:9,fontWeight:700,color:"#4a7c59",margin:"10px 0 6px"}}>PAID ({m.paid.length})</div>{m.paid.map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#4a7c59"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div className="row-s">{r.propName}</div></div><div className="row-v kg">{fmtS(r.paidAmt)}</div></div>)}</>}
          <div style={{marginTop:12,padding:14,background:"rgba(0,0,0,.02)",borderRadius:10}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:13}}><span>Total Due</span><strong>{fmtS(m.due)}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:13}}><span>Collected</span><strong style={{color:"#4a7c59"}}>{fmtS(m.coll)}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13}}><span>Outstanding</span><strong style={{color:m.due-m.coll>0?"#c45c4a":"#4a7c59"}}>{fmtS(m.due-m.coll)}</strong></div>
          </div>
        </div></div>}

        {/* Drill: Vacancy */}
        {drill==="sc-vac"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Vacancy: {fmtS(m.lost)}/mo lost</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>&#10005;</button></div>
          {m.vacs.length===0?<div style={{textAlign:"center",padding:20,color:"#4a7c59"}}>Fully occupied!</div>:
            m.vacs.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.name}</div><div className="row-s">{r.propName} · {r.pb?"Private":"Shared"}</div></div><div className="row-v kb">{fmtS(r.rent)}<div style={{fontSize:8,color:"#6b5e52"}}>lost/mo</div></div></div>)}
          <div style={{marginTop:10,padding:12,background:"rgba(196,92,74,.03)",borderRadius:8,fontSize:12}}><strong>Annual loss:</strong> {fmtS(m.lost*12)}</div>
        </div></div>}

        {/* Drill: Turnover Gaps */}
        {drill==="sc-gaps"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Turnover Gaps: {fmtS(m.turnoverGapCost||0)} lost</h2><p>{(m.turnoverGaps||[]).length} room{(m.turnoverGaps||[]).length!==1?"s":""} with gaps between tenants &middot; {m.turnoverGapDays||0} total gap days</p></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>&#10005;</button></div>
          {(m.turnoverGaps||[]).length===0?<div style={{textAlign:"center",padding:20,color:"#4a7c59"}}>No turnover gaps — all transitions are seamless!</div>:
            (m.turnoverGaps||[]).map(g=><div key={g.roomId} className="row" style={{padding:"10px 12px",marginBottom:4}}>
              <div className="row-dot" style={{background:"#d4a853"}}/>
              <div className="row-i">
                <div className="row-t" style={{fontSize:12}}>{g.roomName} <span style={{fontSize:10,fontWeight:400,color:"#5c4a3a"}}>{g.propName}</span></div>
                <div style={{fontSize:10,color:"#5c4a3a",marginTop:2}}>{g.currentTenant} ends {new Date(g.leaseEnd+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})} &rarr; {g.incomingTenant} moves in {new Date(g.moveIn+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
              </div>
              <div style={{textAlign:"right",minWidth:80}}>
                <div style={{fontSize:14,fontWeight:800,color:"#d4a853"}}>{g.gapDays}d</div>
                <div style={{fontSize:10,color:"#5c4a3a"}}>{fmtS(g.gapCost)} lost</div>
              </div>
            </div>)}
          {(m.turnoverGaps||[]).length>0&&<div style={{marginTop:10,padding:12,background:"rgba(212,168,83,.06)",borderRadius:8,border:"1px solid rgba(212,168,83,.15)"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{fontWeight:600}}>Total gap days</span><strong>{m.turnoverGapDays}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{fontWeight:600}}>Total lost revenue</span><strong style={{color:"#d4a853"}}>{fmtS(m.turnoverGapCost)}</strong></div>
            <div style={{fontSize:10,color:"#5c4a3a",marginTop:6}}>Calculated at each room{"'"}s daily rate (rent / 30 days). Move incoming tenants{"'"} dates earlier to reduce gap cost.</div>
          </div>}
        </div></div>}

        {/* Drill: Projected */}
        {drill==="sc-proj"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Projected: {fmtS(m.proj)} / {fmtS(m.full)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>&#10005;</button></div>
          {m.propBreakdown.map(pr=><div key={pr.id} className="row"><div className="row-i"><div className="row-t">{getPropDisplayName(pr)}</div><div className="row-s">{pr.occCount} occupied · {pr.vacCount} vacant</div></div><div style={{display:"flex",gap:12,alignItems:"baseline"}}><span style={{fontSize:11,color:"#6b5e52"}}>Full: {fmtS(pr.fullOcc)}</span><span style={{fontSize:16,fontWeight:800,color:pr.projected===pr.fullOcc?"#4a7c59":"inherit"}}>{fmtS(pr.projected)}</span>{pr.vacCount>0&&<span style={{fontSize:11,fontWeight:700,color:"#c45c4a"}}>-{fmtS(pr.fullOcc-pr.projected)}</span>}</div></div>)}
        </div></div>}

        {/* Charts */}
        <div className="card" style={{marginBottom:14}}>
          <div className="card-hd" onClick={()=>setShowCharts(!showCharts)}><h3>Visual Trends</h3><span style={{fontSize:11,color:"#6b5e52"}}>{showCharts?"▾ Collapse":"▸ Expand"}</span></div>
          {showCharts&&<div className="card-bd">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div><div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Revenue by Property</div>
                <ResponsiveContainer width="100%" height={180}><BarChart data={m.propBreakdown.map(p=>({name:p.name.split(" ").slice(0,2).join(" "),Projected:p.projected,Lost:p.fullOcc-p.projected}))}>
                  <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`$${v/1000}k`}/><Tooltip formatter={v=>`$${v.toLocaleString()}`}/>
                  <Bar dataKey="Projected" fill="#4a7c59" radius={[3,3,0,0]}/><Bar dataKey="Lost" fill="#c45c4a" radius={[3,3,0,0]}/>
                </BarChart></ResponsiveContainer></div>
              <div><div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Occupancy</div>
                <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={[{name:"Occupied",value:m.occ},{name:"Vacant",value:m.total-m.occ}]} cx="50%" cy="50%" outerRadius={60} innerRadius={38} paddingAngle={3} dataKey="value"><Cell fill="#4a7c59"/><Cell fill="#c45c4a"/></Pie><Tooltip/></PieChart></ResponsiveContainer>
                <div style={{textAlign:"center",marginTop:-6}}><span style={{fontSize:10,color:"#4a7c59",fontWeight:700,marginRight:10}}>● {m.occ} Occupied</span><span style={{fontSize:10,color:"#c45c4a",fontWeight:700}}>● {m.total-m.occ} Vacant</span></div></div>
            </div>
            <div style={{marginTop:16}}><div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Weekly Trend</div>
              <ResponsiveContainer width="100%" height={160}><LineChart data={scRows.map(w=>({week:w.label,"Occupancy Rate":w.occ,"Collection Rate":w.coll,"New Leads":w.leads}))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="week" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Legend wrapperStyle={{fontSize:10}}/>
                <Line type="monotone" dataKey="Occupancy Rate" stroke="#4a7c59" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="Collection Rate" stroke="#3b82f6" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="New Leads" stroke="#d4a853" strokeWidth={2} dot={{r:3}}/>
              </LineChart></ResponsiveContainer></div>
          </div>}
        </div>

        {/* Monthly Comparison */}
        <div className="card" style={{marginBottom:14}}>
          <div className="card-hd"><h3>Monthly Comparison</h3><span style={{fontSize:10,color:"#6b5e52"}}>{allMonths.length} month{allMonths.length!==1?"s":""} of data</span></div>
          <div className="card-bd">
            {/* Side-by-side cards: This Month vs Last Month vs 2 Months Ago */}
            <div style={{display:"grid",gridTemplateColumns:`repeat(${twoMonthsAgo?3:prevMonth?2:1},1fr)`,gap:12,marginBottom:16}}>
              {/* Current Month */}
              <div style={{background:"rgba(212,168,83,.04)",borderRadius:10,padding:14,border:"2px solid rgba(212,168,83,.15)"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#d4a853",marginBottom:8}}>{liveMonth.label} (Current)</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Occupancy</span><strong style={{color:liveMonth.occ>=90?"#4a7c59":"#c45c4a"}}>{liveMonth.occ}%</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Collection</span><strong style={{color:liveMonth.collRate>=90?"#4a7c59":"#c45c4a"}}>{liveMonth.collRate}%</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Vacancy Cost</span><strong style={{color:liveMonth.vacancy>0?"#c45c4a":"#4a7c59"}}>{fmtS(liveMonth.vacancy)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Collected</span><strong style={{color:"#4a7c59"}}>{fmtS(liveMonth.collected)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Projected</span><strong>{fmtS(liveMonth.projected)}</strong></div>
                </div>
              </div>
              {/* Previous Month */}
              {prevMonth&&<div style={{background:"rgba(0,0,0,.02)",borderRadius:10,padding:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",marginBottom:8}}>{prevMonth.label}</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  {[["Occupancy",prevMonth.occ,liveMonth.occ,"%"],["Collection",prevMonth.collRate,liveMonth.collRate,"%"],["Vacancy Cost",prevMonth.vacancy,liveMonth.vacancy,"$",true],["Collected",prevMonth.collected,liveMonth.collected,"$"],["Projected",prevMonth.projected,liveMonth.projected,"$"]].map(([label,prev,curr,unit,inverse])=>{
                    const diff=unit==="$"?curr-prev:curr-prev;const better=inverse?diff<=0:diff>=0;
                    return(<div key={label} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>{label}</span><div><strong>{unit==="$"?fmtS(prev):`${prev}${unit}`}</strong>{diff!==0&&<span style={{fontSize:9,marginLeft:4,color:better?"#4a7c59":"#c45c4a"}}>{diff>0?"+":""}{unit==="$"?fmtS(diff):`${diff}${unit}`}</span>}</div></div>);
                  })}
                </div>
              </div>}
              {/* 2 Months Ago */}
              {twoMonthsAgo&&<div style={{background:"rgba(0,0,0,.02)",borderRadius:10,padding:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",marginBottom:8}}>{twoMonthsAgo.label}</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  {[["Occupancy",twoMonthsAgo.occ,"%"],["Collection",twoMonthsAgo.collRate,"%"],["Vacancy Cost",twoMonthsAgo.vacancy,"$"],["Collected",twoMonthsAgo.collected,"$"],["Projected",twoMonthsAgo.projected,"$"]].map(([label,val,unit])=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>{label}</span><strong>{unit==="$"?fmtS(val):`${val}${unit}`}</strong></div>
                  ))}
                </div>
              </div>}
            </div>
            {!prevMonth&&<div style={{textAlign:"center",padding:12,color:"#6b5e52",fontSize:11}}>Monthly comparison will appear after your first month-end snapshot. Snapshots are taken automatically on the last day of each month.</div>}

            {/* Monthly trend chart */}
            {allMonths.length>1&&<>
              <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Monthly Trends</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <div style={{fontSize:9,color:"#6b5e52",marginBottom:4}}>Occupancy & Collection %</div>
                  <ResponsiveContainer width="100%" height={160}><LineChart data={allMonths.map(mo=>({month:((mo.label||"").split(" ")[0]||"").slice(0,3)||mo.month,Occupancy:mo.occ,Collection:mo.collRate}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="month" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}} domain={[0,100]}/><Tooltip formatter={v=>`${v}%`}/>
                    <Line type="monotone" dataKey="Occupancy" stroke="#4a7c59" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="Collection" stroke="#3b82f6" strokeWidth={2} dot={{r:3}}/>
                  </LineChart></ResponsiveContainer>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#6b5e52",marginBottom:4}}>Revenue</div>
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
              <td style={{color:"#6b5e52"}}>{s.unit==="$"?fmtS(s.goal):s.goal}{s.unit==="%"?"%":""}</td>
              {scRows.map((w,i)=>{const v=w[s.key]||0;const isGood=s.goodFn(v,s.goal);const isCurrent=w.weekNum===CUR_WEEK;return(
                <td key={i} style={{textAlign:"center"}}><span style={{display:"inline-block",padding:"3px 10px",borderRadius:100,fontWeight:700,fontSize:12,background:isGood?"rgba(74,124,89,.08)":"rgba(196,92,74,.08)",color:isGood?"#4a7c59":"#c45c4a",border:isCurrent?"2px solid rgba(212,168,83,.3)":"none"}}>{s.unit==="$"?fmtS(v):v}{s.unit==="%"?"%":""}</span></td>);})}
            </tr>))}
        </tbody></table></div></div>
        {scRows.length<=1&&<div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,marginTop:8,fontSize:12,color:"#5c4a3a"}}>Historical data will build up automatically each week. The current column is calculated live from your actual property and payment data.</div>}

        {/* Scorecard row drill-down */}
        {scDrill&&<div className="card" style={{animation:"fadeIn .2s",marginBottom:14}}><div className="card-bd">
          <div className="sec-hd"><div><h2>{(scorecard.find(s=>s.id===scDrill)||{}).label}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setScDrill(null)}>&#10005;</button></div>

          {scDrill==="occ"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Occupancy = occupied rooms / total rooms. Goal: 100%. Currently <strong>{m.occRate}%</strong> ({m.occ}/{m.total}).</p>
            {m.vacs.length>0?<>{m.vacs.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:"#c45c4a"}}>Vacant at {r.propName} — {fmtS(r.rent)}/mo lost</div></div></div>)}
              <div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>Action: Fill {m.vacs.length} vacant room{m.vacs.length>1?"s":""} to hit 100%</div></>
            :<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>At 100% — all rooms filled!</div>}
          </div>}

          {scDrill==="coll"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Collection = rent collected / rent due. Goal: 100%. Currently <strong>{m.collRate}%</strong>.</p>
            {m.unpaid.length>0?<>{m.unpaid.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2,cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div style={{fontSize:9,color:"#c45c4a"}}>{roomSubLine(r.propName,r.name)} · {fmtS(r.rent)} unpaid</div></div></div>)}
              <div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>Outstanding: {fmtS(m.due-m.coll)} from {m.unpaid.length} tenant{m.unpaid.length>1?"s":""}</div></>
            :<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>All rent collected for {MO}!</div>}
          </div>}

          {scDrill==="vacancy"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Vacancy cost = total rent from empty rooms. Goal: $0. Currently <strong>{fmtS(m.lost)}</strong>/month across {m.vacs.length} room{m.vacs.length!==1?"s":""}.</p>
            {m.vacs.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:"#6b5e52"}}>{r.propName} · {r.pb?"Private":"Shared"} bath</div></div><div style={{fontSize:12,fontWeight:700,color:"#c45c4a"}}>{fmtS(r.rent)}</div></div>)}
            {m.vacs.length>0&&<div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>That is {fmtS(m.lost*12)}/year in lost revenue.</div>}
            {m.vacs.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>No vacancies! $0 lost.</div>}
          </div>}

          {scDrill==="leads"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>New leads = prospective tenants who contacted you or started the pre-screen. Goal: 5+/week.</p>
            <div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:12,color:"#9a7422"}}><strong>Note:</strong> Leads are not automatically tracked yet. This will auto-populate once the pre-screen form and AI chat are connected to the admin system. For now, this shows 0.</div>
            <div style={{fontSize:12,color:"#5c4a3a",marginTop:10,fontWeight:600}}>Tip: If leads are low, post on Facebook Marketplace, Craigslist, or local college housing boards.</div>
          </div>}
        </div></div>}
        {m.expiring.length>0&&<><div className="sec-hd" style={{marginTop:16}}><div><h2>Leases Expiring</h2></div></div>
          {m.expiring.sort((a,b)=>a.daysLeft-b.daysLeft).map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setTab("tenants");setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}});}}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{roomSubLine(r.propName,r.name)} · {r.daysLeft} days</div></div><span className="badge" style={{background:r.daysLeft<=30?"rgba(196,92,74,.08)":"rgba(212,168,83,.1)",color:r.daysLeft<=30?"#c45c4a":"#9a7422"}}>{r.daysLeft}d</span></div>)}</>}
  </>);
}
