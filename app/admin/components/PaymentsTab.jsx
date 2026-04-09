"use client";
import { saveAppData as save } from "@/lib/supabase-client";

const TODAY=new Date();const MO=TODAY.toLocaleString("default",{month:"long",year:"numeric"});
const CHARGE_CATS=["Rent","Last Month Rent","Utility Overage","Late Fee","Security Deposit","Cleaning Fee","Damage Charge","Lock Change","Key Replacement","Move-In Fee","Move-Out Fee","Pet Violation","Smoking Violation","Guest Violation"];
const ACH_METHODS=["Bank Transfer","Stripe/ACH"];

export default function PaymentsTab({
  payPeriod,setPayPeriod,paySubTab,setPaySubTab,payFilters,setPayFilters,
  expCharge,setExpCharge,depFilters,setDepFilters,setModal,setCharges,
  setViewingLease,setTenantProfileTab,settings,setSettings,
  charges,props,leases,sdLedger,m,allTenants,occLeases,
  getChargesForPeriod,chargeStatus,fmtD,fmtS,
  getPropDisplayName,propDisplay,roomSubLine,allRooms,
  openCreateCharge,GRACE,
}){
  const pCharges=getChargesForPeriod(payPeriod);
  const pastDue=pCharges.filter(c=>chargeStatus(c)==="pastdue");
  const unpaidCh=pCharges.filter(c=>chargeStatus(c)==="unpaid");
  const paidCh=pCharges.filter(c=>chargeStatus(c)==="paid");
  const partialCh=pCharges.filter(c=>chargeStatus(c)==="partial");
  const waivedCh=pCharges.filter(c=>chargeStatus(c)==="waived");
  const totalCharged=pCharges.reduce((s,c)=>s+c.amount,0);
  const totalPaid=pCharges.reduce((s,c)=>s+c.amountPaid,0);
  const totalDue=totalCharged-totalPaid-waivedCh.reduce((s,c)=>s+c.amount,0);
  const inTransit=pCharges.flatMap(c=>c.payments||[]).filter(p=>p&&p.depositStatus==="transit").reduce((s,p)=>s+(p.amount||0),0);
  const deposited=pCharges.flatMap(c=>c.payments||[]).filter(p=>p&&(p.depositStatus==="deposited"||!p.depositStatus)).reduce((s,p)=>s+(p.amount||0),0);
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
  const stBadge={paid:"b-green",unpaid:"b-blue",pastdue:"b-red",partial:"b-gold",waived:"b-gray",voided:"b-gray"};

  return(<>
  {/* Header row — actions */}
  <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:6}}>
    <div style={{display:"flex",gap:3}}>
      {[["mtd","MTD"],["ytd","YTD"],["next","Next Mo"],["all","All"]].map(([k,l])=>(
        <button key={k} className={`btn ${payPeriod===k?"btn-dk":"btn-out"} btn-sm`} style={{fontSize:10}} onClick={()=>setPayPeriod(k)}>{l}</button>
      ))}
    </div>
    <button className="btn btn-gold btn-sm" onClick={openCreateCharge}>+ Charge</button>
    <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"addCredit",roomId:"",amount:0,reason:""})}>+ Credit</button>
    <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"returnSD",roomId:"",deductions:[],returnAmount:0})}>Return Security Deposit</button>
    <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",border:"1px solid rgba(0,0,0,.08)",borderRadius:6,background:"#fff"}}>
      <span style={{fontSize:10,color:"#5c4a3a",fontWeight:600,whiteSpace:"nowrap"}}>Past-due badge</span>
      <div onClick={()=>{const u={...settings,showPayBadge:settings.showPayBadge===false};setSettings(u);save("hq-settings",u);}}
        style={{width:32,height:18,borderRadius:9,background:settings.showPayBadge!==false?"#4a7c59":"rgba(0,0,0,.12)",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{position:"absolute",top:2,left:settings.showPayBadge!==false?14:2,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
      </div>
    </div>
  </div>

  {/* Sub-tabs — matches accounting tab style */}
  <div style={{display:"flex",gap:0,marginBottom:16,position:"relative"}}>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"rgba(0,0,0,.08)",zIndex:0}}/>
    {[["overview","Overview"],["charges","Charges"],["deposits","Deposits"]].map(([k,l])=>(
      <button key={k} onClick={()=>{setPaySubTab(k);setExpCharge(null);}}
        onMouseEnter={e=>{if(paySubTab!==k){e.currentTarget.style.background="rgba(255,255,255,.6)";e.currentTarget.style.color="#3c3228";}}}
        onMouseLeave={e=>{if(paySubTab!==k){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#6b5e52";}}}
        style={{padding:"10px 22px",fontSize:13,fontWeight:paySubTab===k?700:500,color:paySubTab===k?"#3c3228":"#6b5e52",background:paySubTab===k?"#fff":"transparent",border:paySubTab===k?"1px solid rgba(0,0,0,.08)":"1px solid transparent",borderBottom:paySubTab===k?"2px solid #fff":"2px solid transparent",borderRadius:"10px 10px 0 0",cursor:"pointer",fontFamily:"inherit",marginBottom:-2,transition:"all .15s",whiteSpace:"nowrap",position:"relative",zIndex:paySubTab===k?3:1}}>
        {l}
      </button>
    ))}
  </div>

  {/* ── Overview ── */}
  {paySubTab==="overview"&&<>
    <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
      <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"pastdue"});}}><div className="kl">Past Due</div><div className="kv kb">{fmtS(pastDue.reduce((s,c)=>s+(c.amount-c.amountPaid),0))}</div><div className="ks">{pastDue.length} charge{pastDue.length!==1?"s":""} · {GRACE}d grace applied</div></div>
      <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"unpaid"});}}><div className="kl">Unpaid</div><div className="kv" style={{color:"#3b82f6"}}>{fmtS(unpaidCh.reduce((s,c)=>s+c.amount,0))}</div><div className="ks">{unpaidCh.length} charge{unpaidCh.length!==1?"s":""}</div></div>
      <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:""});}}><div className="kl">All Charges</div><div className="kv">{fmtS(totalCharged)}</div><div className="ks">{pCharges.length} charge{pCharges.length!==1?"s":""}</div></div>
    </div>
    <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
      <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"paid"});}}><div className="kl">Collected</div><div className="kv kg">{fmtS(totalPaid)}</div><div className="ks">{paidCh.length} charge{paidCh.length!==1?"s":""}</div></div>
      <div className="kpi" style={{cursor:"pointer"}} onClick={()=>setPaySubTab("deposits")}><div className="kl">In Transit</div><div className="kv kw">{fmtS(inTransit)}</div></div>
      <div className="kpi" style={{cursor:"pointer"}} onClick={()=>setPaySubTab("deposits")}><div className="kl">Deposited</div><div className="kv kg">{fmtS(deposited)}</div></div>
    </div>
    <div style={{fontSize:10,color:"#6b5e52",textAlign:"center",marginTop:4,marginBottom:14}}>Showing {periodLabel} · Click any card to drill down</div>

    {/* Quick property breakdown */}
    {m.propBreakdown.map(pr=>{const prCh=pCharges.filter(c=>c.propName===pr.name);const prPaid=prCh.reduce((s,c)=>s+c.amountPaid,0);const prDue=prCh.reduce((s,c)=>s+c.amount,0);return(
      <div key={pr.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,property:pr.name});}}>
        <div className="row-i"><div className="row-t">{getPropDisplayName(pr)}</div><div className="row-s">{allRooms(pr).length} rooms · {pr.occCount} occupied</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800}}>{fmtS(prPaid)}<small style={{color:"#6b5e52"}}> / {fmtS(prDue)}</small></div>
          <div style={{fontSize:9,color:prPaid>=prDue?"#4a7c59":"#c45c4a",fontWeight:600}}>{prDue?Math.round(prPaid/prDue*100):0}%</div></div>
      </div>
    );})}
  </>}

  {/* ── Charges ── */}
  {paySubTab==="charges"&&<>
    {/* Filters */}
    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
      <select value={payFilters.property} onChange={e=>setPayFilters({...payFilters,property:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Properties</option>{props.map(p=><option key={p.id} value={p.name}>{getPropDisplayName(p)}</option>)}</select>
      <select value={payFilters.tenant} onChange={e=>setPayFilters({...payFilters,tenant:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Tenants</option>{[...new Set(charges.map(c=>c.tenantName))].map(n=><option key={n} value={n}>{n}</option>)}</select>
      <select value={payFilters.category} onChange={e=>setPayFilters({...payFilters,category:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Categories</option>{CHARGE_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select>
      <select value={payFilters.status} onChange={e=>setPayFilters({...payFilters,status:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Status</option><option value="paid">Paid</option><option value="unpaid">Unpaid</option><option value="pastdue">Past Due</option><option value="partial">Partial</option><option value="waived">Waived</option></select>
      <input type="date" value={payFilters.dateFrom} onChange={e=>setPayFilters({...payFilters,dateFrom:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}} placeholder="From"/>
      <input type="date" value={payFilters.dateTo} onChange={e=>setPayFilters({...payFilters,dateTo:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}} placeholder="To"/>
      <button className="btn btn-out btn-sm" onClick={()=>setPayFilters({property:"",tenant:"",category:"",status:"",dateFrom:"",dateTo:""})}>Reset</button>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <div style={{fontSize:10,color:"#6b5e52"}}>{filteredCharges.length} charge{filteredCharges.length!==1?"s":""} · {periodLabel}</div>
      {payFilters.tenant&&<button className="btn btn-red btn-sm" style={{fontSize:10}} onClick={()=>setModal({type:"clearLedger",tenant:payFilters.tenant,confirm:""})}>Clear Ledger — {payFilters.tenant}</button>}
    </div>

    {(()=>{
      const sorted=filteredCharges.sort((a,b)=>new Date(b.dueDate)-new Date(a.dueDate));
      // Group by month
      const groups=[];const seenMonths=new Set();
      sorted.forEach(c=>{const mk=(c.dueDate||"").slice(0,7);if(!seenMonths.has(mk)){seenMonths.add(mk);const mo=mk?new Date(mk+"-02"):null;groups.push({mk,label:mo?mo.toLocaleString("default",{month:"long",year:"numeric"}):"",charges:[]});}groups.find(g=>g.mk===mk).charges.push(c);});
      return groups.map(({mk,label,charges:grpCharges})=>(
        <div key={mk} style={{marginBottom:8}}>
          {/* Month header */}
          <div style={{padding:"10px 14px 8px",fontSize:12,fontWeight:800,color:"#1a1714",borderBottom:"2px solid rgba(0,0,0,.08)"}}>{label}</div>
          {/* Column headers */}
          <div style={{display:"grid",gridTemplateColumns:"90px 110px 1fr 80px 110px 80px",gap:0,padding:"6px 14px",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,background:"rgba(0,0,0,.02)"}}>
            <div>Due Date</div><div>Category</div><div>Tenant / Room</div><div>Status</div><div>Deposit</div><div style={{textAlign:"right"}}>Amount</div>
          </div>
          {grpCharges.map(c=>{const st=chargeStatus(c);const lastPay=c.payments.length?c.payments[c.payments.length-1]:null;const isExp=expCharge===c.id;const rem=c.amount-c.amountPaid;const confId=`BB-${c.id.slice(0,8).toUpperCase()}`;
            // Find tenant room for click-through
            const tRoom=allTenants.find(t=>t.id===c.roomId);
            return(
            <div key={c.id}>
              <div style={{display:"grid",gridTemplateColumns:"90px 110px 1fr 80px 110px 80px",gap:0,padding:"10px 14px",borderBottom:"1px solid rgba(0,0,0,.04)",cursor:"pointer",background:isExp?"rgba(0,0,0,.02)":"transparent",transition:"background .1s"}} onClick={()=>setExpCharge(isExp?null:c.id)}>
                <div style={{fontSize:11,fontWeight:600,color:"#3c3228"}}>{fmtD(c.dueDate)}</div>
                <div style={{display:"flex",alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:"#3c3228"}}>{c.category}</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:1}}>
                  <button style={{background:"none",border:"none",padding:0,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
                    onClick={e=>{e.stopPropagation();if(tRoom)setModal({type:"tenant",data:tRoom});}}>
                    <div style={{fontSize:11,fontWeight:700,color:tRoom?"#3b82f6":"#3c3228",textDecoration:tRoom?"underline":"none"}}>{c.tenantName}</div>
                  </button>
                  <div style={{fontSize:9,color:"#6b5e52"}}>{roomSubLine(c.propName,c.roomName)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center"}}><span className={`badge ${stBadge[st]}`} style={{fontSize:8}}>{st}</span></div>
                <div style={{display:"flex",alignItems:"center"}}>{lastPay&&lastPay.depositDate?<div><div style={{fontSize:10,fontWeight:600}}>{fmtD(lastPay.depositDate)}</div><div style={{fontSize:8,color:"#6b5e52"}}>{lastPay.method||"—"}</div><div style={{fontSize:8,color:"#4a7c59"}}>Due: $0.00</div></div>:lastPay&&lastPay.depositStatus==="transit"?<span style={{fontSize:9,color:"#d4a853",fontWeight:600}}>In transit</span>:<span style={{fontSize:9,color:"#aaa"}}>—</span>}</div>
                <div style={{textAlign:"right",fontWeight:800,fontSize:13,color:st==="paid"?"#4a7c59":st==="pastdue"?"#c45c4a":"#1a1714",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6}}>
                  <span>{fmtS(c.amount)}</span>
                  <span style={{fontSize:10,color:"#6b5e52",fontWeight:400}}>{isExp?"∧":"∨"}</span>
                </div>
              </div>
        {/* Expanded detail */}
        {isExp&&<div style={{padding:"16px 20px",background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.04)",animation:"fadeIn .15s"}}>
          {/* Description + reminder history */}
          <div style={{marginBottom:12,fontSize:12}}>
            <span style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>Description: </span>
            <span style={{fontWeight:500,color:"#3c3228"}}>{c.desc}</span>
          </div>
          {/* Reminder log */}
          {(c.reminders||[]).map((r,i)=>(
            <div key={i} style={{fontSize:12,color:"#3c3228",marginBottom:4}}>
              A {r.method} reminder was sent to your tenant(s) on {fmtD(r.date)}
            </div>
          ))}

          {/* Bank deposit note for unpaid charges */}
          {(st==="pastdue"||st==="unpaid"||st==="partial")&&<div style={{fontSize:12,color:"#3c3228",marginBottom:14}}>
            The payment will be deposited into <strong>REDSTONE FEDERAL CU-HUNTSVILLE - Harrison Ray Cooper</strong> bank account.
          </div>}

          {/* Per-payment status timeline cards */}
          {c.payments.length>0&&c.payments.map((p,pi)=>{
            const isTransit=p.depositStatus==="transit";
            const isDeposited=p.depositStatus==="deposited"||(!p.depositStatus&&p.depositDate);
            const pConfId=p.confId||`BB-${c.id.slice(0,6).toUpperCase()}-${pi+1}`;
            const printP=()=>{
              const w=window.open("","_blank");
              w.document.write(`<!DOCTYPE html><html><head><title>Receipt ${pConfId}</title><style>body{font-family:Georgia,serif;max-width:560px;margin:40px auto;padding:0 24px;color:#1a1714;line-height:1.6}h1{font-size:20px;font-weight:700;border-bottom:2px solid #1a1714;padding-bottom:8px;margin-bottom:20px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}.label{color:#666}.value{font-weight:600}.total{display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:800;border-top:2px solid #1a1714;margin-top:4px}.conf{font-family:monospace;font-size:18px;font-weight:900;text-align:center;padding:12px;background:#f5f0e8;border-radius:6px;margin:16px 0}.footer{margin-top:32px;font-size:11px;color:#999;text-align:center}</style></head><body><h1>Payment Receipt</h1><div class="conf">${pConfId}</div><div class="row"><span class="label">Date</span><span class="value">${p.date}</span></div><div class="row"><span class="label">Tenant</span><span class="value">${c.tenantName}</span></div><div class="row"><span class="label">Property</span><span class="value">${c.propName} · ${c.roomName}</span></div><div class="row"><span class="label">Charge</span><span class="value">${c.category} — ${c.desc}</span></div><div class="row"><span class="label">Method</span><span class="value">${p.method}</span></div><div class="total"><span>Amount Paid</span><span>$${Number(p.amount).toLocaleString()}</span></div><div class="footer">Oak &amp; Main Development LLC · Black Bear Rentals · blackbearhousing@gmail.com</div></body></html>`);
              w.document.close();w.print();
            };
            return(
            <div key={pi} style={{background:"rgba(59,130,246,.04)",border:"1px solid rgba(59,130,246,.1)",borderRadius:10,padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
              {/* Left: payment identity */}
              <div style={{minWidth:140}}>
                <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Payment #{pConfId.slice(-6)}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>{c.tenantName}</div>
                <div style={{fontSize:10,color:"#6b5e52",marginTop:2}}>Paid on {fmtD(p.date)}</div>
                {p.method&&<div style={{fontSize:10,color:"#5c4a3a",marginTop:2}}>via {p.method}</div>}
                {p.notes&&<div style={{fontSize:9,color:"#6b5e52",marginTop:2,fontStyle:"italic"}}>{p.notes}</div>}
              </div>
              {/* Middle: status timeline */}
              <div style={{flex:1}}>
                <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Status:</div>
                {[
                  {label:"PAYMENT MADE",done:true,date:fmtD(p.date)},
                  {label:"TRANSFER INITIATED",done:isTransit||isDeposited,date:isTransit||isDeposited?fmtD(p.date):null},
                  {label:isDeposited?`DEPOSITED ${fmtD(p.depositDate||p.date)}`:`DEPOSITED EST. ${p.depositEstDate||"—"}`,done:isDeposited,date:null},
                ].map((step,si)=>(
                  <div key={si} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:si<2?6:0}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                      <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${step.done?"#3b82f6":"#ccc"}`,background:step.done?"#3b82f6":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {step.done&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                      </div>
                      {si<2&&<div style={{width:2,height:14,background:step.done?"#3b82f6":"#e5e3df",marginTop:2}}/>}
                    </div>
                    <div style={{paddingTop:1}}>
                      <div style={{fontSize:10,fontWeight:700,color:step.done?"#1a1714":"#999"}}>{step.label}</div>
                      {step.date&&<div style={{fontSize:9,color:"#6b5e52"}}>{step.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
              {/* Right: amount + download */}
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:16,fontWeight:800,color:"#1a1714",marginBottom:6}}>{fmtS(p.amount)}</div>
                <button className="btn btn-out btn-sm" style={{fontSize:10}} onClick={e=>{e.stopPropagation();printP();}}>PDF</button>
              </div>
            </div>);
          })}

          {/* Actions — full matrix based on status and payment method */}
          {(()=>{
            const paidViaAch=st==="paid"&&c.payments.some(p=>ACH_METHODS.includes(p.method));
            const paidViaManual=st==="paid"&&!paidViaAch;
            return(
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
              {/* Record payment — unpaid/partial/pastdue only */}
              {(st==="unpaid"||st==="partial"||st==="pastdue")&&<button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});}}>Record Payment</button>}
              {/* Reminder — unpaid/partial/pastdue only */}
              {(st==="unpaid"||st==="partial"||st==="pastdue")&&<button className="btn btn-dk btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"sendReminder",charge:c,tenantName:c.tenantName,rem,method:null});}}>Reminder</button>}
              {/* Edit — not voided/waived/ACH-paid */}
              {st!=="voided"&&st!=="waived"&&!paidViaAch&&<button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"editCharge",charge:{...c},isPaid:paidViaManual,editReason:"",editNote:""});}}>{paidViaManual?"Edit (reason req.)":"Edit"}</button>}
              {/* Void — anything not already voided or waived */}
              {st!=="voided"&&st!=="waived"&&<button className="btn btn-out btn-sm" style={{color:"#9a7422"}} onClick={e=>{e.stopPropagation();setModal({type:"voidCharge",chargeId:c.id,tenantName:c.tenantName,category:c.category,desc:c.desc,amount:c.amount,voidReason:""});}}>Void</button>}
              {/* Delete — only unpaid charges (no payment ever recorded) */}
              {(st==="unpaid"||st==="pastdue")&&c.payments.length===0&&<button className="btn btn-out btn-sm" style={{color:"#c45c4a"}} onClick={e=>{e.stopPropagation();setModal({type:"deleteCharge",chargeId:c.id,tenantName:c.tenantName,category:c.category,desc:c.desc});}}>Delete</button>}
              {/* Waive late fees — pastdue only */}
              {st==="pastdue"&&<button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"waiveCharge",chargeId:c.id,reason:""});}}>Waive</button>}
            </div>);
          })()}

          {st==="waived"&&<div style={{background:"rgba(0,0,0,.03)",borderRadius:6,padding:8,fontSize:11,color:"#6b5e52",marginTop:8}}>Waived{c.waivedReason?`: ${c.waivedReason}`:""}</div>}
          {st==="voided"&&<div style={{background:"rgba(196,92,74,.04)",border:"1px solid rgba(196,92,74,.12)",borderRadius:6,padding:"10px 12px",fontSize:11,marginTop:8}}>
            <div style={{fontWeight:700,color:"#c45c4a",marginBottom:4}}>Voided {c.voidedDate?`on ${fmtD(c.voidedDate)}`:""}</div>
            <div style={{color:"#5c4a3a"}}>{c.voidedReason||"No reason recorded"}</div>
          </div>}
        </div>}
            </div>);})}
        </div>
      ));
    })()}
    {filteredCharges.length===0&&<div style={{textAlign:"center",padding:24,color:"#6b5e52"}}>No charges match your filters</div>}
  </>}

  {/* ── Deposits ── */}
  {paySubTab==="deposits"&&(()=>{
    const allPays=charges.flatMap(c=>c.payments.map(p=>({...p,chargeId:c.id,tenantName:c.tenantName,propName:c.propName,roomName:c.roomName,category:c.category,chargeDueDate:c.dueDate,roomId:c.roomId})));
    const transit=allPays.filter(p=>p.depositStatus==="transit");
    const deposited=allPays.filter(p=>p.depositStatus==="deposited"||(!p.depositStatus&&p.depositDate));

    // Period date range from top buttons
    const now=TODAY;
    const periodFrom=payPeriod==="mtd"?new Date(now.getFullYear(),now.getMonth(),1).toISOString().split("T")[0]
      :payPeriod==="ytd"?`${now.getFullYear()}-01-01`
      :payPeriod==="next"?now.toISOString().split("T")[0]
      :null;
    const periodTo=payPeriod==="next"?new Date(now.getFullYear(),now.getMonth()+2,0).toISOString().split("T")[0]:null;

    let filtered=[...deposited].sort((a,b)=>new Date(b.depositDate||b.date)-new Date(a.depositDate||a.date));
    if(periodFrom)filtered=filtered.filter(p=>(p.depositDate||p.date)>=periodFrom);
    if(periodTo)filtered=filtered.filter(p=>(p.depositDate||p.date)<=periodTo);
    if(depFilters.property)filtered=filtered.filter(p=>p.propName===depFilters.property);
    if(depFilters.tenant)filtered=filtered.filter(p=>p.tenantName===depFilters.tenant);

    const months={};
    filtered.forEach(p=>{const d=new Date((p.depositDate||p.date)+"T00:00:00");const mk=`${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}`;const label=d.toLocaleString("default",{month:"long",year:"numeric"});if(!months[mk])months[mk]={label,key:mk,items:[],total:0};months[mk].items.push(p);months[mk].total+=p.amount;});
    const monthKeys=Object.keys(months).sort().reverse();

    const totalTransit=transit.reduce((s,p)=>s+p.amount,0);
    const totalDeposited=filtered.reduce((s,p)=>s+p.amount,0);
    const sdTenants=occLeases;
    /* [P0-5] Sum ALL SD entries per room, not just first */
    const sdHeld=(roomId,fallbackRent)=>{const entries=sdLedger.filter(x=>x.roomId===roomId&&!x.returned);if(entries.length)return entries.reduce((s,x)=>s+(x.amountHeld||0),0);return fallbackRent;};
    const totalSD=sdTenants.reduce((s,r)=>s+sdHeld(r.id,r.rent),0);

    const COL="120px 110px 1fr 160px 90px";

    return(<>
    {/* KPI cards — clickable filters */}
    <div style={{marginBottom:16}}>
      <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:6}}>
        {[
          {key:"transit",label:"In Transit",val:fmtS(totalTransit),sub:transit.length+" pending",color:"#d4a853"},
          {key:"deposited",label:"Deposited",val:fmtS(totalDeposited),sub:filtered.length+" deposits",color:"#4a7c59"},
          {key:"sd",label:"Security Deposit Held",val:fmtS(totalSD),sub:sdTenants.length+" tenants"+(settings.bankName?" · "+settings.bankName:""),color:"#4a7c59"},
        ].map(({key,label,val,sub,color})=>{
          const active=depFilters.view===key;
          return(
          <div key={key} className="kpi" onClick={()=>setDepFilters(f=>({...f,view:active?"":key}))}
            style={{cursor:"pointer",outline:active?`2px solid ${color}`:"2px solid transparent",outlineOffset:2,transition:"outline .15s",userSelect:"none"}}>
            <div className="kl">{label}</div>
            <div className="kv" style={{color}}>{val}</div>
            <div className="ks">{sub}</div>
            {active&&<div style={{fontSize:9,fontWeight:700,color,marginTop:4,textTransform:"uppercase",letterSpacing:.5}}>Filtered — click to clear</div>}
          </div>);
        })}
      </div>
      {depFilters.view&&<div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>setDepFilters(f=>({...f,view:""}))}
          style={{fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:4,border:"1px solid rgba(0,0,0,.1)",background:"rgba(0,0,0,.04)",color:"#5c4a3a",cursor:"pointer",fontFamily:"inherit"}}>
          Show All ✕
        </button>
      </div>}
    </div>

    {/* Filter bar */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
      <select value={depFilters.property||""} onChange={e=>setDepFilters(f=>({...f,property:e.target.value}))} style={{padding:"5px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",background:"#fff"}}>
        <option value="">All Properties</option>{props.map(p=><option key={p.id} value={p.name}>{getPropDisplayName(p)}</option>)}
      </select>
      <select value={depFilters.tenant||""} onChange={e=>setDepFilters(f=>({...f,tenant:e.target.value}))} style={{padding:"5px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",background:"#fff"}}>
        <option value="">All Tenants</option>{[...new Set(deposited.map(p=>p.tenantName))].sort().map(n=><option key={n} value={n}>{n}</option>)}
      </select>
      {(depFilters.property||depFilters.tenant)&&<button className="btn btn-out btn-sm" onClick={()=>setDepFilters(f=>({...f,property:"",tenant:""}))}>Reset</button>}
    </div>

    {/* ── In Transit section ── */}
    {((!depFilters.view||depFilters.view==="transit"))&&transit.length>0&&<>
      <div style={{fontSize:13,fontWeight:800,color:"#1a1714",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
        In Transit <span style={{fontSize:11,fontWeight:500,color:"#6b5e52"}}>({transit.length} payment{transit.length!==1?"s":""} waiting to clear)</span>
      </div>
      <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",marginBottom:20,overflow:"hidden"}}>
        {/* Col headers */}
        <div style={{display:"grid",gridTemplateColumns:COL,padding:"8px 16px",background:"rgba(0,0,0,.02)",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>
          <div>Deposit Date</div><div>Date Paid</div><div>Tenant / Room</div><div>Bank Account</div><div style={{textAlign:"right"}}>Amount</div>
        </div>
        {transit.map(p=>(
          <div key={p.id} style={{display:"grid",gridTemplateColumns:COL,padding:"12px 16px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center"}}>
            <div><span style={{fontSize:11,fontWeight:700,color:"#d4a853"}}>In Transit</span><div style={{fontSize:9,color:"#6b5e52"}}>Est. {fmtD(p.date)}</div></div>
            <div style={{fontSize:11}}>{fmtD(p.date)}</div>
            <div>
              <div style={{fontSize:11,fontWeight:700}}>{p.tenantName}</div>
              <div style={{fontSize:9,color:"#6b5e52"}}>{roomSubLine(p.propName,p.roomName)}</div>
            </div>
            <div><div style={{fontSize:11}}>Redstone FCU</div><div style={{fontSize:9,color:"#6b5e52"}}>{p.method}</div></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8}}>
              <span style={{fontSize:13,fontWeight:800,color:"#d4a853"}}>{fmtS(p.amount)}</span>
              <button className="btn btn-green btn-sm" style={{fontSize:9,whiteSpace:"nowrap"}} onClick={()=>setCharges(prev=>prev.map(c=>({...c,payments:c.payments.map(pp=>pp.id===p.id?{...pp,depositStatus:"deposited",depositDate:TODAY.toISOString().split("T")[0]}:pp)})))}>Mark Deposited</button>
            </div>
          </div>
        ))}
      </div>
    </>}

    {/* ── Deposit Ledger section ── */}
    {(!depFilters.view||depFilters.view==="deposited")&&<>
      <div style={{fontSize:13,fontWeight:800,color:"#1a1714",marginBottom:8}}>Deposit Ledger</div>
      <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",marginBottom:20,overflow:"hidden"}}>
        {monthKeys.length===0&&<div style={{textAlign:"center",padding:40,color:"#6b5e52",fontSize:12}}>No deposits in this period.</div>}
        {monthKeys.map(mk=>{const mo=months[mk];return(
          <div key={mk}>
            <div style={{padding:"10px 16px",background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:2}}>
              <div style={{fontSize:13,fontWeight:800}}>{mo.label}</div>
              <div style={{fontSize:13,fontWeight:800,color:"#4a7c59"}}>{fmtS(mo.total)} <span style={{fontSize:10,fontWeight:500,color:"#6b5e52"}}>({mo.items.length})</span></div>
            </div>
            {/* Col headers */}
            <div style={{display:"grid",gridTemplateColumns:COL,padding:"6px 16px",background:"rgba(0,0,0,.02)",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>
              <div>Deposit Date</div><div>Date Paid</div><div>Tenant / Room</div><div>Bank Account</div><div style={{textAlign:"right"}}>Amount</div>
            </div>
            {mo.items.map(p=>{
              const isExp=expCharge===("dep-"+p.id);
              const tRoom=allTenants.find(t=>t.id===p.roomId);
              const tLease=leases.find(l=>l.tenantEmail===tRoom?.tenant?.email||l.tenantName===tRoom?.tenant?.name);
              const confId=p.confId||`BB-${(p.chargeId||"").slice(0,6).toUpperCase()}-${Date.now().toString(36).slice(-3).toUpperCase()}`;
              return(
              <div key={p.id}>
                <div style={{display:"grid",gridTemplateColumns:COL,padding:"12px 16px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center",cursor:"pointer",background:isExp?"rgba(0,0,0,.02)":"#fff",transition:"background .1s"}}
                  onClick={()=>setExpCharge(isExp?null:"dep-"+p.id)}>
                  <div style={{fontSize:11,fontWeight:600}}>{fmtD(p.depositDate||p.date)}</div>
                  <div style={{fontSize:11}}>{fmtD(p.date)}</div>
                  <div>
                    <button style={{background:"none",border:"none",padding:0,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
                      onClick={e=>{e.stopPropagation();if(tRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:tRoom});}}}>
                      <div style={{fontSize:11,fontWeight:700,color:tRoom?"#3b82f6":"#3c3228",textDecoration:tRoom?"underline":"none"}}>{p.tenantName}</div>
                    </button>
                    <div style={{fontSize:9,color:"#6b5e52"}}>{roomSubLine(p.propName,p.roomName)}</div>
                  </div>
                  <div><div style={{fontSize:11,fontWeight:600}}>Redstone FCU</div><div style={{fontSize:9,color:"#6b5e52"}}>{p.method}</div></div>
                  <div style={{textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6}}>
                    <span style={{fontSize:13,fontWeight:800,color:"#4a7c59"}}>{fmtS(p.amount)}</span>
                    <span style={{fontSize:10,color:"#6b5e52"}}>{isExp?"∧":"∨"}</span>
                  </div>
                </div>
                {/* Expanded detail */}
                {isExp&&<div style={{padding:"16px 20px",background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.04)"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                    <div style={{background:"#fff",borderRadius:8,padding:"10px 14px"}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Payment ID</div>
                      <div style={{fontSize:11,fontFamily:"monospace",fontWeight:700}}>{confId}</div>
                    </div>
                    <div style={{background:"#fff",borderRadius:8,padding:"10px 14px"}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Method</div>
                      <div style={{fontSize:12,fontWeight:600}}>{p.method}</div>
                    </div>
                    <div style={{background:"#fff",borderRadius:8,padding:"10px 14px"}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Status</div>
                      <div style={{fontSize:11,fontWeight:700,color:"#4a7c59"}}>Deposited {fmtD(p.depositDate||p.date)}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    {tLease&&<button className="btn btn-out btn-sm" onClick={()=>{setViewingLease({lease:tLease,room:tRoom||null});}}>View Lease →</button>}
                    {tRoom&&<button className="btn btn-out btn-sm" onClick={()=>{setTenantProfileTab("payments");setModal({type:"tenant",data:tRoom});}}>Tenant Payments →</button>}
                    <button className="btn btn-out btn-sm" onClick={()=>{
                      const w=window.open("","_blank");
                      w.document.write(`<!DOCTYPE html><html><head><title>Receipt ${confId}</title><style>body{font-family:Georgia,serif;max-width:560px;margin:40px auto;padding:0 24px;color:#1a1714;line-height:1.6}h1{font-size:20px;font-weight:700;border-bottom:2px solid #1a1714;padding-bottom:8px;margin-bottom:20px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}.label{color:#666}.value{font-weight:600}.total{display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:800;border-top:2px solid #1a1714;margin-top:4px}.conf{font-family:monospace;font-size:18px;font-weight:900;text-align:center;padding:12px;background:#f5f0e8;border-radius:6px;margin:16px 0}.footer{margin-top:32px;font-size:11px;color:#999;text-align:center}</style></head><body><h1>Payment Receipt</h1><div class="conf">${confId}</div><div class="row"><span class="label">Date Paid</span><span class="value">${p.date}</span></div><div class="row"><span class="label">Deposit Date</span><span class="value">${p.depositDate||p.date}</span></div><div class="row"><span class="label">Tenant</span><span class="value">${p.tenantName}</span></div><div class="row"><span class="label">Property</span><span class="value">${p.propName} · ${p.roomName}</span></div><div class="row"><span class="label">Method</span><span class="value">${p.method}</span></div><div class="total"><span>Amount</span><span>$${Number(p.amount).toLocaleString()}</span></div><div class="footer">Oak &amp; Main Development LLC · Black Bear Rentals · blackbearhousing@gmail.com</div></body></html>`);
                      w.document.close();w.print();
                    }}>PDF Receipt</button>
                  </div>
                </div>}
              </div>);
            })}
          </div>
        );})}
      </div>
    </>}

    {/* ── Security Deposits section ── */}
    {(!depFilters.view||depFilters.view==="sd")&&<>
      <div style={{fontSize:13,fontWeight:800,color:"#1a1714",marginBottom:8}}>Security Deposits Held — Redstone FCU</div>
      <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",overflow:"hidden",marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 120px 140px 140px 100px",padding:"8px 16px",background:"rgba(0,0,0,.02)",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>
          <div>Tenant</div><div>Property</div><div>Room</div><div>Lease End</div><div style={{textAlign:"right"}}>Security Deposit</div>
        </div>
        {sdTenants.length===0&&<div style={{textAlign:"center",padding:24,color:"#6b5e52",fontSize:12}}>No security deposits on file.</div>}
        {sdTenants.map(r=>{const sdAmt=sdHeld(r.id,r.rent);const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;return(
          <div key={r.id} style={{display:"grid",gridTemplateColumns:"1fr 120px 140px 140px 100px",padding:"11px 16px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center"}}>
            <div style={{fontSize:12,fontWeight:700}}>{r.tenant.name}</div>
            <div style={{fontSize:11,color:"#5c4a3a"}}>{propDisplay(r.propName)}</div>
            <div style={{fontSize:11,color:"#5c4a3a"}}>{r.name}</div>
            <div style={{fontSize:11,color:dl&&dl<=30?"#c45c4a":dl&&dl<=90?"#d4a853":"#5c4a3a"}}>{r.le?`${fmtD(r.le)}${dl&&dl<=90?` (${dl}d)`:""}` :"—"}</div>
            <div style={{fontSize:13,fontWeight:800,color:settings.adminAccent||"#4a7c59",textAlign:"right"}}>{fmtS(sdAmt)}</div>
          </div>
        );})}
        {sdTenants.length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 120px 140px 140px 100px",padding:"10px 16px",borderTop:"2px solid rgba(0,0,0,.07)",background:"rgba(0,0,0,.02)"}}>
          <div style={{fontSize:12,fontWeight:800,gridColumn:"1/5"}}>Total Held</div>
          <div style={{fontSize:14,fontWeight:800,color:settings.adminAccent||"#4a7c59",textAlign:"right"}}>{fmtS(totalSD)}</div>
        </div>}
      </div>

      {/* SD Returns */}
      {sdLedger.filter(s=>s.returned).length>0&&<>
        <div style={{fontSize:13,fontWeight:800,color:"#1a1714",marginBottom:8}}>Security Deposit Returns</div>
        {sdLedger.map(s=>(
          <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",background:"#fff",borderRadius:8,marginBottom:6,border:"1px solid rgba(0,0,0,.06)"}}>
            <div><div style={{fontSize:12,fontWeight:700}}>{s.tenantName}</div><div style={{fontSize:10,color:"#6b5e52"}}>{s.propName} · {s.roomName} · Held {fmtS(s.amountHeld)} · Deducted {fmtS(s.amountHeld-s.returned)} · Returned {fmtD(s.returnDate)}</div></div>
            <div style={{fontSize:14,fontWeight:800,color:"#4a7c59"}}>{fmtS(s.returned)}</div>
          </div>
        ))}
      </>}
    </>}
    </>);
  })()}
  </>);
}
