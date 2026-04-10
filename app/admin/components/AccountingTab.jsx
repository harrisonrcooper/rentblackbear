"use client";
import { useState } from "react";

export default function AccountingTab({
  settings, properties, charges, expenses, setExpenses,
  mortgages, vendors, improvements, setImprovements,
  payments, save, setModal, uid, allRooms, getPropDisplayName,
  SCHED_E_CAT_LABELS,
}) {
  const props = properties || [];
  const TODAY = new Date();
  const fmtS = n => "$" + Number(n).toLocaleString();
  const [acctFilters, setAcctFilters] = useState({from: TODAY.getFullYear() + "-01-01", to: TODAY.toISOString().split("T")[0], propIds: [], tenants: [], categories: [], vendors: []});
  const [acctDotMenu, setAcctDotMenu] = useState(null);

        // ── Accounting-specific filter state (separate from Reports tab) ──
        const acctFrom=acctFilters.from||(TODAY.getFullYear()+"-01-01");
        const acctTo=acctFilters.to||TODAY.toISOString().split("T")[0];
        const acctPropIds=acctFilters.propIds||[];
        const acctTenants=acctFilters.tenants||[];
        const acctCats=acctFilters.categories||[];
        const acctVendors=acctFilters.vendors||[];
        const hasPropFilter=acctPropIds.length>0;
        const hasTenantFilter=acctTenants.length>0;
        const hasCatFilter=acctCats.length>0;
        const hasVendorFilter=acctVendors.length>0;

        // ── Collected payments (income) — fix propId to use prop lookup ──
        const allCollected=charges.flatMap(c=>{
          const pr=props.find(p=>allRooms(p).some(r=>r.id===c.roomId))||{};
          return c.payments.map(p=>({...p,propName:c.propName,propId:pr.id||"",category:c.category,tenantName:c.tenantName,chargeId:c.id,roomName:c.roomName}));
        });

        // ── Apply filters ──
        const filtIncome=allCollected.filter(p=>{
          if(p.date<acctFrom||p.date>acctTo)return false;
          if(hasPropFilter&&!acctPropIds.includes(p.propId))return false;
          if(hasTenantFilter&&!acctTenants.includes(p.tenantName))return false;
          if(hasCatFilter&&!acctCats.includes(p.category))return false;
          return true;
        });
        const propCount=props.length||1;
        const filtExpenses=(()=>{
          const result=[];
          for(const e of expenses){
            if(e.date<acctFrom||e.date>acctTo)continue;
            if(hasCatFilter&&!acctCats.includes(e.category))continue;
            if(hasVendorFilter&&!acctVendors.includes(e.vendor))continue;
            if(e.propId==="shared"){
              if(!hasPropFilter){result.push(e);}
              else{result.push({...e,_isShared:true,_fullAmount:e.amount,amount:Math.round(e.amount/propCount*100)/100});}
            } else {
              if(hasPropFilter&&!acctPropIds.includes(e.propId))continue;
              result.push(e);
            }
          }
          return result;
        })();

        const totalIncome=filtIncome.reduce((s,p)=>s+p.amount,0);
        const totalExp=filtExpenses.reduce((s,e)=>s+e.amount,0);
        const totalNOI=totalIncome-totalExp;
        const filtMortgages=!hasPropFilter?mortgages:mortgages.filter(mg=>acctPropIds.includes(mg.propId));
        const annualDebt=filtMortgages.reduce((s,mg)=>s+(mg.monthlyPI||0)*12,0);
        const dscr=annualDebt>0?(totalNOI/annualDebt):null;

        // ── Filter option lists ──
        const tenantOptions=[...new Set(allCollected.map(p=>p.tenantName))].sort();
        const incomeCatOptions=[...new Set(allCollected.map(p=>p.category))].sort();
        const expCatOptions=[...new Set(expenses.map(e=>e.category))].sort();
        const vendorOptions=[...new Set(expenses.filter(e=>e.vendor).map(e=>e.vendor))].sort();
        const expCats=SCHED_E_CAT_LABELS;

        const setF=(k,v)=>setAcctFilters(prev=>({...prev,[k]:v}));
        const resetFilters=()=>{setAcctFilters({from:TODAY.getFullYear()+"-01-01",to:TODAY.toISOString().split("T")[0],propIds:[],tenants:[],categories:[],vendors:[]});setAcctDrop(null);};
        const toggleArr=(arr,val)=>arr.includes(val)?arr.filter(x=>x!==val):[...arr,val];

        // Quick filter detection
        const thisMonthFrom=TODAY.getFullYear()+"-"+String(TODAY.getMonth()+1).padStart(2,"0")+"-01";
        const ytdFrom=TODAY.getFullYear()+"-01-01";
        const todayStr=TODAY.toISOString().split("T")[0];
        const lastYrFrom=(TODAY.getFullYear()-1)+"-01-01";
        const lastYrTo=(TODAY.getFullYear()-1)+"-12-31";
        const qfActive=acctFrom===thisMonthFrom&&acctTo===todayStr?"month":acctFrom===ytdFrom&&acctTo===todayStr?"ytd":acctFrom===lastYrFrom&&acctTo===lastYrTo?"lastyear":"";

        // Multi-select dropdown renderer
        const MsDrop=({id,label,options,selected,onToggle})=>{
          const isOpen=acctDrop===id;
          const count=selected.length;
          return(<div className="ms-drop">
            <button className={"ms-btn"+(count?" has-sel":"")} onClick={e=>{e.stopPropagation();setAcctDrop(isOpen?null:id);}}>
              {count?`${label} (${count})`:label} <span style={{fontSize:8,marginLeft:2}}>{isOpen?"▲":"▼"}</span>
            </button>
            {isOpen&&<div className="ms-panel" onClick={e=>e.stopPropagation()}>
              {options.length===0&&<div style={{padding:"8px 12px",fontSize:10,color:"#7a7067"}}>None available</div>}
              {options.map(opt=>{
                const val=typeof opt==="object"?opt.value:opt;
                const lbl=typeof opt==="object"?opt.label:opt;
                return(<label key={val} className="ms-item">
                  <input type="checkbox" checked={selected.includes(val)} onChange={()=>onToggle(val)}/>
                  <span>{lbl}</span>
                </label>);
              })}
              {count>0&&<div style={{borderTop:"1px solid rgba(0,0,0,.06)",padding:"6px 12px",marginTop:4}}>
                <button style={{fontSize:10,color:"#c45c4a",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}} onClick={()=>onToggle("__clear__")}>Clear all</button>
              </div>}
            </div>}
          </div>);
        };

        return(<>
        {/* ── Header ── */}
        <div className="sec-hd">
          <div>
            <h2 style={{margin:0}}>Accounting</h2>
            <div style={{fontSize:11,color:"#6b5e52",marginTop:2}}>
              {fmtDp(acctFrom)} — {fmtDp(acctTo)}{hasPropFilter?" · "+acctPropIds.length+" propert"+(acctPropIds.length===1?"y":"ies"):""}
            </div>
          </div>
          <span style={{fontSize:9,color:"#9a7422",background:"rgba(212,168,83,.1)",padding:"3px 8px",borderRadius:4,fontWeight:600}}>Schedule E</span>
        </div>

        {/* ── Global filter bar ── */}
        <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",padding:"12px 14px",marginBottom:14,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}} onClick={()=>setAcctDrop(null)}>
          <input type="date" value={acctFrom} onChange={e=>setF("from",e.target.value)} onClick={e=>e.stopPropagation()} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11}}/>
          <span style={{fontSize:11,color:"#7a7067",flexShrink:0}}>to</span>
          <input type="date" value={acctTo} onChange={e=>setF("to",e.target.value)} onClick={e=>e.stopPropagation()} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11}}/>
          <div style={{width:1,height:20,background:"rgba(0,0,0,.08)",flexShrink:0}}/>
          <MsDrop id="prop" label="Property" options={props.map(p=>({value:p.id,label:p.name}))} selected={acctPropIds} onToggle={v=>v==="__clear__"?setF("propIds",[]):setF("propIds",toggleArr(acctPropIds,v))}/>
          {acctSubTab==="income"&&<>
            <MsDrop id="tenant" label="Tenant" options={tenantOptions} selected={acctTenants} onToggle={v=>v==="__clear__"?setF("tenants",[]):setF("tenants",toggleArr(acctTenants,v))}/>
            <MsDrop id="cat" label="Category" options={incomeCatOptions} selected={acctCats} onToggle={v=>v==="__clear__"?setF("categories",[]):setF("categories",toggleArr(acctCats,v))}/>
          </>}
          {acctSubTab==="expenses"&&<>
            <MsDrop id="cat" label="Category" options={expCatOptions} selected={acctCats} onToggle={v=>v==="__clear__"?setF("categories",[]):setF("categories",toggleArr(acctCats,v))}/>
            <MsDrop id="vendor" label="Vendor" options={vendorOptions} selected={acctVendors} onToggle={v=>v==="__clear__"?setF("vendors",[]):setF("vendors",toggleArr(acctVendors,v))}/>
          </>}
          <div style={{width:1,height:20,background:"rgba(0,0,0,.08)",flexShrink:0}}/>
          <button className={"qf-btn"+(qfActive==="month"?" active":"")} onClick={e=>{e.stopPropagation();setF("from",thisMonthFrom);setF("to",todayStr);}}>This Month</button>
          <button className={"qf-btn"+(qfActive==="ytd"?" active":"")} onClick={e=>{e.stopPropagation();setF("from",ytdFrom);setF("to",todayStr);}}>YTD</button>
          <button className={"qf-btn"+(qfActive==="lastyear"?" active":"")} onClick={e=>{e.stopPropagation();const y=TODAY.getFullYear()-1;setF("from",y+"-01-01");setF("to",y+"-12-31");}}>Last Year</button>
          <button className="qf-btn" onClick={e=>{e.stopPropagation();resetFilters();}}>Reset</button>
        </div>

        {/* ── KPI strip ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:16}}>
          {[
            {label:"Gross Income",value:totalIncome,color:"#4a7c59",sub:filtIncome.length+" payments"},
            {label:"Total Expenses",value:totalExp,color:"#c45c4a",sub:filtExpenses.length+" line items"},
            {label:"Net Operating Income",value:totalNOI,color:totalNOI>=0?"#4a7c59":"#c45c4a",sub:totalIncome>0?Math.round(totalNOI/totalIncome*100)+"% margin":"—"},
            {label:"DSCR",value:dscr!=null?dscr.toFixed(2)+"x":"—",color:dscr==null?"#7a7067":dscr>=1.25?"#4a7c59":dscr>=1.0?"#d4a853":"#c45c4a",sub:dscr==null?"No mortgages":dscr>=1.25?"Strong coverage":dscr>=1.0?"Marginal":"At risk"},
          ].map(({label,value,color,sub})=>(
            <div key={label} style={{background:"#fff",borderRadius:10,padding:"14px 16px",border:"1px solid rgba(0,0,0,.06)"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{label}</div>
              <div style={{fontSize:22,fontWeight:800,color,lineHeight:1}}>{typeof value==="number"?fmtS(value):value}</div>
              <div style={{fontSize:10,color:"#7a7067",marginTop:4}}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Sub-tabs ── */}
        <div style={{display:"flex",gap:0,marginBottom:16,position:"relative",paddingBottom:0,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"rgba(0,0,0,.08)",zIndex:0}}/>
          {[["overview","Overview"],["income","Income"],["expenses","Expenses"],["improvements","Capital Improvements"],["mortgages","Mortgages"],["vendors","Vendors"]].map(([k,l])=>(
            <button key={k} onClick={()=>{setAcctSubTab(k);setF("categories",[]);setF("tenants",[]);setF("vendors",[]);setAcctDrop(null);}}
              onMouseEnter={e=>{if(acctSubTab!==k){e.currentTarget.style.background="rgba(255,255,255,.6)";e.currentTarget.style.color="#3c3228";}}}
              onMouseLeave={e=>{if(acctSubTab!==k){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#6b5e52";}}}
              style={{padding:"10px 22px",fontSize:13,fontWeight:acctSubTab===k?700:500,color:acctSubTab===k?"#3c3228":"#6b5e52",background:acctSubTab===k?"#fff":"transparent",border:acctSubTab===k?"1px solid rgba(0,0,0,.08)":"1px solid transparent",borderBottom:acctSubTab===k?"2px solid #fff":"2px solid transparent",borderRadius:"10px 10px 0 0",cursor:"pointer",fontFamily:"inherit",marginBottom:-2,transition:"all .15s",whiteSpace:"nowrap",flexShrink:0,position:"relative",zIndex:acctSubTab===k?3:1}}>
              {l}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {acctSubTab==="overview"&&(()=>{
          const filtProps=!hasPropFilter?props:props.filter(p=>acctPropIds.includes(p.id));
          return(<>
            {/* Toggle */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{fontSize:11,color:"#6b5e52",fontWeight:500}}>View by:</span>
              <div style={{display:"flex",border:"1px solid rgba(0,0,0,.1)",borderRadius:6,overflow:"hidden"}}>
                {[["property","Property"],["unit","Unit / Room"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setAcctOverviewMode(k)}
                    style={{padding:"5px 14px",fontSize:11,fontWeight:acctOverviewMode===k?700:500,background:acctOverviewMode===k?"#3c3228":"transparent",color:acctOverviewMode===k?"#fff":"#6b5e52",border:"none",cursor:"pointer",fontFamily:"inherit",borderLeft:k==="unit"?"1px solid rgba(0,0,0,.1)":"none"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* By Property */}
            {acctOverviewMode==="property"&&<>
              <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden",marginBottom:14}}>
                <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:11,fontWeight:700,color:"#5c4a3a",background:"#faf9f7"}}>By Property — {acctFrom.slice(0,7)} to {acctTo.slice(0,7)}</div>
                <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                    {["Property","Gross Income","Expenses","NOI","NOI Margin","Annual Debt Svc","DSCR"].map(h=><th key={h} style={{padding:"8px 14px",textAlign:h==="Property"?"left":"right",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filtProps.map((pr,i)=>{
                      const inc=allCollected.filter(p=>p.propName===pr.name&&p.date>=acctFrom&&p.date<=acctTo).reduce((s,p)=>s+p.amount,0);
                      const directExp=expenses.filter(e=>e.propId===pr.id&&e.date>=acctFrom&&e.date<=acctTo).reduce((s,e)=>s+e.amount,0);
                      const sharedExp=expenses.filter(e=>e.propId==="shared"&&e.date>=acctFrom&&e.date<=acctTo).reduce((s,e)=>s+Math.round(e.amount/propCount*100)/100,0);
                      const exp=directExp+sharedExp;
                      const noi=inc-exp;const margin=inc>0?Math.round(noi/inc*100):null;
                      const mg=mortgages.filter(m=>m.propId===pr.id);
                      const debt=mg.reduce((s,m)=>s+(m.monthlyPI||0)*12,0);
                      const prDSCR=debt>0?(noi/debt):null;
                      return(<tr key={pr.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                        <td style={{padding:"9px 14px",fontWeight:700,fontSize:12}}>{getPropDisplayName(pr)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:"#4a7c59",fontWeight:700}}>{fmtS(inc)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:"#c45c4a",fontWeight:700}}>{fmtS(exp)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:800,color:noi>=0?"#4a7c59":"#c45c4a"}}>{fmtS(noi)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:margin===null?"#999":margin>=50?"#4a7c59":margin>=25?"#d4a853":"#c45c4a",fontWeight:600}}>{margin!==null?margin+"%":"—"}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:"#5c4a3a"}}>{debt>0?fmtS(debt):"—"}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:800,color:prDSCR===null?"#999":prDSCR>=1.25?"#4a7c59":prDSCR>=1.0?"#d4a853":"#c45c4a"}}>{prDSCR!==null?prDSCR.toFixed(2)+"x":"—"}</td>
                      </tr>);
                    })}
                  </tbody>
                  <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                    <td style={{padding:"10px 14px",fontWeight:800}}>Portfolio Total</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(totalIncome)}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(totalExp)}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:totalNOI>=0?"#4a7c59":"#c45c4a",fontSize:13}}>{fmtS(totalNOI)}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:700,color:"#6b5e52"}}>{totalIncome>0?Math.round(totalNOI/totalIncome*100)+"%":"—"}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:700}}>{annualDebt>0?fmtS(annualDebt):"—"}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:dscr===null?"#999":dscr>=1.25?"#4a7c59":dscr>=1.0?"#d4a853":"#c45c4a"}}>{dscr!==null?dscr.toFixed(2)+"x":"—"}</td>
                  </tr></tfoot>
                </table></div>
              </div>

              {/* Expense by category breakdown */}
              {filtExpenses.length>0&&(()=>{
                const byCat={};filtExpenses.forEach(e=>{byCat[e.category]=(byCat[e.category]||0)+e.amount;});
                const sorted=Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
                const bySubcat={};filtExpenses.filter(e=>e.subcategory).forEach(e=>{bySubcat[e.subcategory]=(bySubcat[e.subcategory]||0)+e.amount;});
                const subcatSorted=Object.entries(bySubcat).sort((a,b)=>b[1]-a[1]);
                return(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:10}}>
                  {[["By Schedule E Category",sorted],["By Subcategory (internal)",subcatSorted]].map(([title,items])=>(
                    <div key={title} style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
                      <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:11,fontWeight:700,color:"#5c4a3a",background:"#faf9f7"}}>{title}</div>
                      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:6}}>
                        {items.length===0&&<div style={{fontSize:11,color:"#7a7067",padding:"8px 0"}}>None recorded</div>}
                        {items.map(([cat,amt])=>{
                          const pct=totalExp>0?Math.round(amt/totalExp*100):0;
                          return(<div key={cat}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                              <span style={{fontSize:10,fontWeight:600,color:"#5c4a3a"}}>{cat}</span>
                              <span style={{fontSize:11,fontWeight:800,color:"#c45c4a"}}>{fmtS(amt)} <span style={{fontSize:9,color:"#7a7067",fontWeight:400}}>{pct}%</span></span>
                            </div>
                            <div style={{height:3,borderRadius:2,background:"#e5e3df"}}>
                              <div style={{height:"100%",borderRadius:2,background:"#c45c4a",width:pct+"%"}}/>
                            </div>
                          </div>);
                        })}
                      </div>
                    </div>
                  ))}
                </div>);
              })()}
            </>}

            {/* By Unit */}
            {acctOverviewMode==="unit"&&filtProps.map(pr=>{
              const units=pr.units||[];
              const prExpenses=[...expenses.filter(e=>e.propId===pr.id&&e.date>=acctFrom&&e.date<=acctTo),...expenses.filter(e=>e.propId==="shared"&&e.date>=acctFrom&&e.date<=acctTo).map(e=>({...e,amount:Math.round(e.amount/propCount*100)/100,_isShared:true}))];
              const propWideExp=prExpenses.filter(e=>!e.unitId);
              const propWideAmt=propWideExp.reduce((s,e)=>s+e.amount,0);
              return(<div key={pr.id} style={{marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:800,color:"#3c3228",marginBottom:8,paddingBottom:6,borderBottom:"2px solid rgba(0,0,0,.06)"}}>{getPropDisplayName(pr)}</div>
                <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden",marginBottom:8}}>
                  <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                      {["Unit / Room","Income","Expenses","NOI"].map(h=><th key={h} style={{padding:"8px 14px",textAlign:h==="Unit / Room"?"left":"right",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4}}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {units.map((u,i)=>{
                        // Income: sum of payments from rooms in this unit
                        const uRoomIds=(u.rooms||[]).map(r=>r.id);
                        const uInc=allCollected.filter(p=>p.date>=acctFrom&&p.date<=acctTo&&charges.find(c=>c.id===p.chargeId&&uRoomIds.includes(c.roomId))).reduce((s,p)=>s+p.amount,0);
                        const uExp=prExpenses.filter(e=>e.unitId===u.id).reduce((s,e)=>s+e.amount,0);
                        const uNOI=uInc-uExp;
                        return(<tr key={u.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                          <td style={{padding:"8px 14px",fontWeight:600}}>{u.name||("Unit "+(i+1))}</td>
                          <td style={{padding:"8px 14px",textAlign:"right",color:"#4a7c59"}}>{uInc>0?fmtS(uInc):"—"}</td>
                          <td style={{padding:"8px 14px",textAlign:"right",color:"#c45c4a"}}>{uExp>0?fmtS(uExp):"—"}</td>
                          <td style={{padding:"8px 14px",textAlign:"right",fontWeight:700,color:uNOI>=0?"#4a7c59":"#c45c4a"}}>{(uInc>0||uExp>0)?fmtS(uNOI):"—"}</td>
                        </tr>);
                      })}
                      {propWideAmt>0&&<tr style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:"rgba(212,168,83,.02)"}}>
                        <td style={{padding:"8px 14px",color:"#9a7422",fontStyle:"italic",fontSize:10}}>Property-wide (no unit assigned)</td>
                        <td style={{padding:"8px 14px",textAlign:"right"}}>—</td>
                        <td style={{padding:"8px 14px",textAlign:"right",color:"#c45c4a"}}>{fmtS(propWideAmt)}</td>
                        <td style={{padding:"8px 14px",textAlign:"right",color:"#c45c4a"}}>({fmtS(propWideAmt)})</td>
                      </tr>}
                    </tbody>
                  </table></div>
                </div>
              </div>);
            })}
          </>);
        })()}

        {/* ── INCOME ── */}
        {acctSubTab==="income"&&(()=>{
          const incSortCol=acctSort.col||"date";const incSortDir=acctSort.dir||"desc";
          const sorted=filtIncome.slice().sort((a,b)=>{
            let va,vb;
            if(incSortCol==="date"){va=a.date||"";vb=b.date||"";}
            else if(incSortCol==="property"){va=a.propName||"";vb=b.propName||"";}
            else if(incSortCol==="room"){va=a.roomName||"";vb=b.roomName||"";}
            else if(incSortCol==="tenant"){va=a.tenantName||"";vb=b.tenantName||"";}
            else if(incSortCol==="category"){va=a.category||"";vb=b.category||"";}
            else if(incSortCol==="method"){va=a.method||"";vb=b.method||"";}
            else if(incSortCol==="amount"){va=a.amount||0;vb=b.amount||0;return incSortDir==="asc"?va-vb:vb-va;}
            else{va=a.date||"";vb=b.date||"";}
            const cmp=String(va).localeCompare(String(vb));
            return incSortDir==="asc"?cmp:-cmp;
          });
          const toggleSort=(col)=>setAcctSort(p=>p.col===col?{col,dir:p.dir==="asc"?"desc":"asc"}:{col,dir:"asc"});
          const sortIcon=(col)=>acctSort.col===col?(acctSort.dir==="asc"?" ▲":" ▼"):"";
          return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:11,color:"#6b5e52"}}>{sorted.length} payment{sorted.length!==1?"s":""} · {fmtS(totalIncome)} collected</div>
            </div>
            <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
              <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                  {[["date","Date"],["property","Property"],["room","Room"],["tenant","Tenant"],["category","Category"],["method","Method"],["amount","Amount"]].map(([k,h])=>(
                    <th key={h} className="sort-hdr" onClick={()=>toggleSort(k)} style={{padding:"9px 14px",textAlign:h==="Amount"?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}{sortIcon(k)}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {sorted.length===0&&<tr><td colSpan={7} style={{padding:32,textAlign:"center",color:"#7a7067",fontSize:11}}>No income in this period. Payments are recorded in the Payments tab.</td></tr>}
                  {sorted.map((p,i)=>(
                    <tr key={i} className="acct-row" style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                      <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a",fontFamily:"monospace",whiteSpace:"nowrap"}}>{fmtDp(p.date)}</td>
                      <td style={{padding:"8px 14px",fontSize:11}}>{p.propName}</td>
                      <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{p.roomName||"—"}</td>
                      <td style={{padding:"8px 14px",fontWeight:600}}>{p.tenantName}</td>
                      <td style={{padding:"8px 14px"}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:100,background:"rgba(59,130,246,.08)",color:"#3b82f6",fontWeight:700}}>{p.category}</span></td>
                      <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{p.method||"—"}</td>
                      <td style={{padding:"8px 14px",textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                {sorted.length>0&&<tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                  <td colSpan={6} style={{padding:"10px 14px",fontWeight:800,fontSize:12}}>Total Collected</td>
                  <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#4a7c59",fontSize:14}}>{fmtS(totalIncome)}</td>
                </tr></tfoot>}
              </table></div>
            </div>
          </>);
        })()}

        {/* ── EXPENSES ── */}
        {acctSubTab==="expenses"&&(()=>{
          const uploadReceipt=async(file,expId)=>{
            if(!file)return;
            const ext=file.name.split(".").pop()||"jpg";
            const path="receipts/"+expId+"-"+Date.now()+"."+ext;
            try{
              const r=await fetch(SUPA_URL+"/storage/v1/object/receipts/"+path,{method:"POST",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":file.type,"x-upsert":"true"},body:file});
              if(!r.ok){alert("Upload failed: "+r.status);return;}
              setExpenses(prev=>prev.map(e=>e.id===expId?{...e,receiptUrl:SUPA_URL+"/storage/v1/object/public/receipts/"+path}:e));
            }catch(e){alert("Upload error: "+e.message);}
          };
          const expSortCol=acctSort.col||"date";const expSortDir=acctSort.dir||"desc";
          const sorted=filtExpenses.slice().sort((a,b)=>{
            let va,vb;
            if(expSortCol==="date"){va=a.date||"";vb=b.date||"";}
            else if(expSortCol==="property"){va=(a.propId==="shared"?"Shared":a.propName||"");vb=(b.propId==="shared"?"Shared":b.propName||"");}
            else if(expSortCol==="category"){va=a.category||"";vb=b.category||"";}
            else if(expSortCol==="subcategory"){va=a.subcategory||"";vb=b.subcategory||"";}
            else if(expSortCol==="vendor"){va=a.vendor||"";vb=b.vendor||"";}
            else if(expSortCol==="description"){va=a.description||"";vb=b.description||"";}
            else if(expSortCol==="amount"){va=a.amount||0;vb=b.amount||0;return expSortDir==="asc"?va-vb:vb-va;}
            else{va=a.date||"";vb=b.date||"";}
            const cmp=String(va).localeCompare(String(vb));
            return expSortDir==="asc"?cmp:-cmp;
          });
          const attachedCount=sorted.filter(e=>e.receiptUrl).length;
          const toggleSort=(col)=>setAcctSort(p=>p.col===col?{col,dir:p.dir==="asc"?"desc":"asc"}:{col,dir:"asc"});
          const sortIcon=(col)=>acctSort.col===col?(acctSort.dir==="asc"?" ▲":" ▼"):"";
          return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:11,color:"#6b5e52"}}>{sorted.length} expense{sorted.length!==1?"s":""} · {fmtS(totalExp)} total{attachedCount>0?" · "+attachedCount+" receipt"+((attachedCount!==1)?"s":"")+" attached":""}</div>
              <div style={{display:"flex",gap:6}}>
                {sorted.length>0&&<button className="btn btn-out btn-sm" onClick={()=>setModal({type:"exportExpenses",expenses:sorted,attachedCount})}>↓ Export</button>}
                <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"addExpense",form:{date:TODAY.toISOString().split("T")[0],propId:acctPropIds.length===1?acctPropIds[0]:"",category:"",subcategory:"",description:"",vendor:"",amount:"",paymentMethod:"",notes:"",unitId:"",unitName:"",roomId:"",roomName:""},errs:{}})}>+ Add Expense</button>
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"visible"}}>
              <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                  {[["date","Date"],["property","Property"],["","Unit / Room"],["category","Category"],["subcategory","Subcategory"],["vendor","Vendor"],["description","Description"],["","Method"],["amount","Amount"],["","Receipt"],["","Action"]].filter(([k,h])=>{
                    if(h==="Action")return true;
                    const hideKey=h.toLowerCase().replace(/\s*\/\s*/g,"_").replace(/\s+/g,"_");
                    return!acctHideCols[hideKey];
                  }).map(([k,h])=>(
                    <th key={h} className={k?"sort-hdr":""} onClick={k?()=>toggleSort(k):undefined} style={{padding:"9px 14px",textAlign:h==="Amount"?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",position:h==="Action"?"relative":"static"}}>
                      {h==="Action"?<span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end"}}>
                        <span>Action</span>
                        <div style={{position:"relative"}}>
                          <button className="gear-btn" onClick={e=>{e.stopPropagation();setAcctDrop(acctDrop==="colvis"?null:"colvis");}}>⚙</button>
                          {acctDrop==="colvis"&&<div className="gear-panel" onClick={e=>e.stopPropagation()}>
                            <div style={{padding:"6px 12px",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>Show / hide columns</div>
                            {["Unit / Room","Category","Subcategory","Vendor","Description","Method","Receipt"].map(col=>{
                              const hideKey=col.toLowerCase().replace(/\s*\/\s*/g,"_").replace(/\s+/g,"_");
                              return(<label key={col} className="ms-item">
                                <input type="checkbox" checked={!acctHideCols[hideKey]} onChange={()=>setAcctHideCols(p=>({...p,[hideKey]:!p[hideKey]}))}/>
                                <span>{col}</span>
                              </label>);
                            })}
                          </div>}
                        </div>
                      </span>:h}{k?sortIcon(k):""}
                    </th>
                  ))}
                </tr></thead>
                <tbody>
                  {sorted.length===0&&<tr><td colSpan={11} style={{padding:32,textAlign:"center",color:"#7a7067",fontSize:11}}>No expenses match your filters. Click "+ Add Expense" to record one.</td></tr>}
                  {sorted.map((e,i)=>{
                    const visibleCells=[];
                    if(!acctHideCols.date)visibleCells.push(<td key="date" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a",fontFamily:"monospace",whiteSpace:"nowrap"}}>{fmtDp(e.date)}</td>);
                    if(!acctHideCols.property)visibleCells.push(<td key="prop" style={{padding:"8px 14px",fontSize:10}}>
                      {e.propId==="shared"||e._isShared
                        ?<span style={{display:"inline-flex",alignItems:"center",gap:4}}>{e._isShared?(acctPropIds.length===1?(props.find(p=>p.id===acctPropIds[0])||{}).name:"Filtered"):"All Properties"} <span style={{fontSize:8,padding:"1px 6px",borderRadius:100,background:"rgba(59,130,246,.1)",color:"#3b82f6",fontWeight:700,whiteSpace:"nowrap"}}>SHARED{e._isShared?" · "+fmtS(e._fullAmount)+" total":""}</span></span>
                        :(props.find(p=>p.id===e.propId)||{}).name||"—"}
                    </td>);
                    if(!acctHideCols.unit_room)visibleCells.push(<td key="unit" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{e.unitName?(e.roomName?e.unitName+" / "+e.roomName:e.unitName):e.roomName||"—"}</td>);
                    if(!acctHideCols.category)visibleCells.push(<td key="cat" style={{padding:"8px 14px"}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:100,background:"rgba(212,168,83,.1)",color:"#9a7422",fontWeight:700,whiteSpace:"nowrap"}}>{e.category}</span></td>);
                    if(!acctHideCols.subcategory)visibleCells.push(<td key="subcat" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{e.subcategory||<span style={{color:"#7a7067"}}>—</span>}</td>);
                    if(!acctHideCols.vendor)visibleCells.push(<td key="vendor" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{e.vendor||"—"}</td>);
                    if(!acctHideCols.description)visibleCells.push(<td key="desc" style={{padding:"8px 14px",fontWeight:600,maxWidth:180}}>{e.description}</td>);
                    if(!acctHideCols.method)visibleCells.push(<td key="method" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{e.paymentMethod||"—"}</td>);
                    if(!acctHideCols.amount)visibleCells.push(<td key="amt" style={{padding:"8px 14px",textAlign:"right",fontWeight:800,color:"#c45c4a",whiteSpace:"nowrap"}}>{fmtS(e.amount)}</td>);
                    if(!acctHideCols.receipt)visibleCells.push(<td key="rcpt" style={{padding:"8px 14px"}}>
                      {e.receiptUrl
                        ?<a href={e.receiptUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:e._receiptPending?"#d4a853":"#4a7c59",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:3}}>{e._receiptPending?"📎 Local":"📎 Attached"}</a>
                        :<label style={{fontSize:10,color:"#d4a853",cursor:"pointer",fontWeight:600,display:"inline-flex",alignItems:"center",gap:3}}>+ Upload<input type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={ev=>uploadReceipt(ev.target.files[0],e.id)}/></label>}
                    </td>);
                    visibleCells.push(<td key="action" style={{padding:"8px 14px",whiteSpace:"nowrap"}}>
                      <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
                        <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"addExpense",editId:e.id,form:{...e},errs:{}})}>Edit</button>
                        <div className="dot-menu">
                          <button className="dot-btn" onClick={ev=>{ev.stopPropagation();setAcctDotMenu(acctDotMenu===e.id?null:e.id);}}>⋮</button>
                          {acctDotMenu===e.id&&<div className="dot-panel" onClick={ev=>ev.stopPropagation()}>
                            <button className="dot-opt danger" onClick={()=>{setAcctDotMenu(null);setModal({type:"confirmDeleteExpense",expId:e.id,description:e.description||e.category});}}>Delete</button>
                          </div>}
                        </div>
                      </div>
                    </td>);
                    return(<tr key={e.id} className="acct-row" onClick={()=>setAcctDotMenu(null)} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:e._isShared?"rgba(59,130,246,.02)":i%2===0?"#fff":"rgba(0,0,0,.01)"}}>{visibleCells}</tr>);
                  })}
                </tbody>
                {sorted.length>0&&<tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                  <td colSpan={8} style={{padding:"10px 14px",fontWeight:800,fontSize:12}}>Total Expenses</td>
                  <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#c45c4a",fontSize:14}}>{fmtS(totalExp)}</td>
                  <td colSpan={2}/>
                </tr></tfoot>}
              </table></div>
            </div>
          </>);
        })()}

        {/* ── MORTGAGES ── */}
        {acctSubTab==="mortgages"&&(()=>{
          const filtMg=!hasPropFilter?mortgages:mortgages.filter(mg=>acctPropIds.includes(mg.propId));
          return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#3c3228"}}>Mortgage Register</div>
                <div style={{fontSize:10,color:"#6b5e52",marginTop:1}}>One record per loan. Feeds DSCR and Schedule E Line 12.</div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"addMortgage",form:{propId:acctPropIds.length===1?acctPropIds[0]:(props[0]?.id||""),lender:"",originalBalance:"",currentBalance:"",interestRate:"",monthlyPI:"",startDate:"",maturityDate:"",accountLast4:"",notes:""},errs:{}})}>+ Add Mortgage</button>
            </div>

            {filtMg.length===0
              ?<div style={{textAlign:"center",padding:36,color:"#7a7067",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",fontSize:11}}>No mortgages on record. Add one to enable DSCR and Schedule E interest calculations.</div>
              :<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
                <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                    {["Property","Lender","Account","Orig. Balance","Current Balance","Rate","Monthly P&I","Maturity",""].map(h=>(
                      <th key={h} style={{padding:"9px 14px",textAlign:["Orig. Balance","Current Balance","Rate","Monthly P&I"].includes(h)?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtMg.map((mg,i)=>{
                      const pr=props.find(p=>p.id===mg.propId);
                      const annualInterest=(mg.currentBalance||0)*(mg.interestRate||0)/100;
                      return(
                      <tr key={mg.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                        <td style={{padding:"9px 14px",fontWeight:700}}>{pr?.name||"—"}</td>
                        <td style={{padding:"9px 14px"}}>{mg.lender||"—"}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#5c4a3a",fontFamily:"monospace"}}>{mg.accountLast4?"****"+mg.accountLast4:"—"}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:"#5c4a3a"}}>{fmtS(mg.originalBalance||0)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:700,color:"#c45c4a"}}>{fmtS(mg.currentBalance||0)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right"}}>{(mg.interestRate||0)+"%"}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:700}}>{fmtS(mg.monthlyPI||0)}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#5c4a3a"}}>{mg.maturityDate||"—"}</td>
                        <td style={{padding:"9px 14px"}}>
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"addMortgage",editId:mg.id,form:{...mg},errs:{}})}>Edit</button>
                            <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#c45c4a"}} onClick={()=>setModal({type:"deleteMortgage",mgId:mg.id,lender:mg.lender})}>Delete</button>
                          </div>
                        </td>
                      </tr>);
                    })}
                  </tbody>
                  <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                    <td colSpan={4} style={{padding:"10px 14px",fontWeight:800}}>Portfolio Total</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(filtMg.reduce((s,mg)=>s+(mg.currentBalance||0),0))}</td>
                    <td/>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800}}>{fmtS(filtMg.reduce((s,mg)=>s+(mg.monthlyPI||0),0))}/mo</td>
                    <td colSpan={2}/>
                  </tr></tfoot>
                </table></div>
              </div>}

            {/* Est. annual interest note for Schedule E */}
            {filtMg.length>0&&<div style={{marginTop:10,padding:"10px 14px",background:"rgba(212,168,83,.06)",borderRadius:8,border:"1px solid rgba(212,168,83,.15)",fontSize:11,color:"#9a7422"}}>
              <strong>Est. Annual Interest (Schedule E Line 12):</strong> {fmtS(filtMg.reduce((s,mg)=>s+(mg.currentBalance||0)*(mg.interestRate||0)/100,0))} — based on current balances and rates. Use your actual 1098 form for exact figures.
            </div>}
          </>);
        })()}
        {/* ── IMPROVEMENTS ── */}
        {acctSubTab==="improvements"&&(()=>{
          const filtImprove=improvements.filter(im=>!hasPropFilter||acctPropIds.includes(im.propId));
          const totalImprove=filtImprove.reduce((s,im)=>s+im.amount,0);
          return(<>
            <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:800,color:"#3c3228",marginBottom:8}}>Expense vs. Capital Improvement — What's the difference?</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,fontSize:11}}>
                <div style={{padding:"10px 12px",borderRadius:8,background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.12)"}}>
                  <div style={{fontWeight:700,color:"#4a7c59",marginBottom:4}}>Expense (Schedule E)</div>
                  <div style={{color:"#5c4a3a",lineHeight:1.6}}>Deducted in full <strong>this year</strong>. Restores the property to its original condition — fixing what broke, not making it better. Examples: fixing a leaky faucet, repainting worn walls, replacing a broken appliance with a similar one, pest control, cleaning.</div>
                </div>
                <div style={{padding:"10px 12px",borderRadius:8,background:"rgba(59,130,246,.04)",border:"1px solid rgba(59,130,246,.12)"}}>
                  <div style={{fontWeight:700,color:"#3b82f6",marginBottom:4}}>Capital Improvement</div>
                  <div style={{color:"#5c4a3a",lineHeight:1.6}}>Added to your <strong>cost basis</strong>, depreciated over 27.5 years — NOT deducted this year. Adds value or extends the property's useful life. Examples: new roof, full HVAC replacement, addition, new flooring throughout, new appliances that upgrade the unit.</div>
                </div>
              </div>
              <div style={{marginTop:10,fontSize:10,color:"#9a7422",padding:"6px 10px",background:"rgba(212,168,83,.06)",borderRadius:6}}>When in doubt, ask your CPA. The IRS scrutinizes this distinction closely. If it improves, extends, or adapts — it's CapEx.</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:11,color:"#6b5e52"}}>{filtImprove.length} improvement{filtImprove.length!==1?"s":""} · {fmtS(totalImprove)} total cost basis additions</div>
              <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"addImprovement",form:{date:TODAY.toISOString().split("T")[0],propId:acctPropIds.length===1?acctPropIds[0]:(props[0]?.id||""),improvementType:"",description:"",contractor:"",amount:"",notes:""},errs:{}})}>+ Add Improvement</button>
            </div>
            {filtImprove.length===0
              ?<div style={{textAlign:"center",padding:36,color:"#7a7067",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",fontSize:11}}>No capital improvements recorded. New roof, HVAC, addition, appliances — log them here for your CPA.</div>
              :<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
                <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                    {["Date","Property","Type","Subcategory","Description","Contractor","Receipt","Amount",""].map(h=>(
                      <th key={h} style={{padding:"9px 14px",textAlign:h==="Amount"?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtImprove.slice().sort((a,b)=>b.date?.localeCompare(a.date||"")||0).map((im,i)=>(
                      <tr key={im.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                        <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a",fontFamily:"monospace",whiteSpace:"nowrap"}}>{im.date}</td>
                        <td style={{padding:"8px 14px",fontSize:10}}>{(props.find(p=>p.id===im.propId)||{}).name||"—"}</td>
                        <td style={{padding:"8px 14px"}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:100,background:"rgba(59,130,246,.08)",color:"#3b82f6",fontWeight:700}}>{im.improvementType||"—"}</span></td>
                        <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{im.subcategory||<span style={{color:"#7a7067"}}>—</span>}</td>
                        <td style={{padding:"8px 14px",fontWeight:600}}>{im.description}</td>
                        <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{im.contractor||"—"}</td>
                        <td style={{padding:"8px 14px"}}>
                          {im.receiptUrl
                            ?<a href={im.receiptUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"#3b82f6",fontWeight:600,textDecoration:"none"}}>View</a>
                            :<label style={{fontSize:10,color:"#d4a853",cursor:"pointer",fontWeight:600}}>Upload
                              <input type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={async ev=>{
                                const file=ev.target.files[0];if(!file)return;
                                const ext=file.name.split(".").pop()||"jpg";
                                const path="receipts/"+im.id+"-"+Date.now()+"."+ext;
                                const r=await fetch(SUPA_URL+"/storage/v1/object/receipts/"+path,{method:"POST",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":file.type,"x-upsert":"true"},body:file});
                                if(r.ok)setImprovements(prev=>prev.map(x=>x.id===im.id?{...x,receiptUrl:SUPA_URL+"/storage/v1/object/public/receipts/"+path}:x));
                              }}/>
                            </label>}
                        </td>
                        <td style={{padding:"8px 14px",textAlign:"right",fontWeight:800,color:"#3b82f6",whiteSpace:"nowrap"}}>{fmtS(im.amount)}</td>
                        <td style={{padding:"8px 14px"}}>
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"addImprovement",editId:im.id,form:{...im},errs:{}})}>Edit</button>
                            <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#c45c4a"}} onClick={()=>setModal({type:"deleteImprovement",imId:im.id,description:im.description})}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                    <td colSpan={7} style={{padding:"10px 14px",fontWeight:800,fontSize:12}}>Total Cost Basis Additions</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#3b82f6",fontSize:14}}>{fmtS(totalImprove)}</td>
                    <td/>
                  </tr></tfoot>
                </table></div>
              </div>}
          </>);
        })()}

        {/* ── VENDORS ── */}
        {acctSubTab==="vendors"&&(()=>{
          return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#3c3228"}}>Vendor / Payee List</div>
                <div style={{fontSize:10,color:"#6b5e52",marginTop:1}}>Saved vendors auto-populate when adding expenses.</div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"addVendor",form:{name:"",phone:"",email:"",notes:""},errs:{}})}>+ Add Vendor</button>
            </div>
            {vendors.length===0
              ?<div style={{textAlign:"center",padding:36,color:"#7a7067",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",fontSize:11}}>No vendors saved yet. You can save vendors while adding expenses, or add them here.</div>
              :<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}><div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                    {["Vendor / Payee","Phone","Email","Notes",""].map(h=>(
                      <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {vendors.slice().sort((a,b)=>a.name?.localeCompare(b.name||"")||0).map((v,i)=>(
                      <tr key={v.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                        <td style={{padding:"9px 14px",fontWeight:700}}>{v.name}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#5c4a3a"}}>{v.phone||"—"}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#5c4a3a"}}>{v.email||"—"}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#6b5e52",fontStyle:v.notes?"normal":"italic"}}>{v.notes||"—"}</td>
                        <td style={{padding:"9px 14px"}}>
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"addVendor",editId:v.id,form:{...v},errs:{}})}>Edit</button>
                            <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#c45c4a"}} onClick={()=>setModal({type:"deleteVendor",vendorId:v.id,name:v.name})}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div></div>}
          </>);
        })()}
        </>);
      
}
