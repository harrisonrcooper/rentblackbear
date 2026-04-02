"use client";
import { useState, useRef } from "react";

// ── Supabase (re-declared for standalone use) ────────────────────────
const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa=(path,opts={})=>fetch(SUPA_URL+"/rest/v1/"+path,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});
const LEASE_TEMPLATE_ID="2d9d0941-2802-468a-a6e8-b2cceacf78d1";
const leaseObjToRow=(lease)=>({id:lease.id,workspace_id:null,template_id:LEASE_TEMPLATE_ID,tenant_id:lease.tenantEmail||null,room_id:lease.roomId||null,property_id:lease.propertyId||null,variable_data:lease,status:lease.status||"draft",landlord_sig:lease.landlordSignature||lease.landlordSig||null,tenant_sig:lease.tenantSig||null,landlord_signed_at:lease.landlordSignedAt||null,tenant_signed_at:lease.tenantSignedAt||null,signing_token:lease.signingToken||null,signing_link:lease.signingLink||null,pdf_url:lease.pdfUrl||null,updated_at:new Date().toISOString()});
async function upsertLease(lease){try{await supa("lease_instances",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify(leaseObjToRow(lease))});}catch(e){console.error("Upsert lease error:",e);}}
async function patchLease(id,updates){try{await supa("lease_instances?id=eq."+id,{method:"PATCH",prefer:"resolution=merge-duplicates",body:JSON.stringify({...updates,updated_at:new Date().toISOString()})});}catch(e){console.error("Patch lease error:",e);}}
async function deleteLeaseInDB(id){try{await supa("lease_instances?id=eq."+id,{method:"DELETE"});}catch(e){console.error("Delete lease error:",e);}}

// ── Utilities (re-declared) ──────────────────────────────────────────
const TODAY=new Date();
const uid=()=>Math.random().toString(36).slice(2,9);
const fmtS=n=>"$"+Number(n).toLocaleString();
const fmtD=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;};
const fmtDLong=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return dt.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});};
const numberToWords=(n)=>{const ones=["","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE","TEN","ELEVEN","TWELVE","THIRTEEN","FOURTEEN","FIFTEEN","SIXTEEN","SEVENTEEN","EIGHTEEN","NINETEEN"];const tens=["","","TWENTY","THIRTY","FORTY","FIFTY","SIXTY","SEVENTY","EIGHTY","NINETY"];if(!n||n===0)return"ZERO";if(n<20)return ones[n];if(n<100)return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:"");if(n<1000)return ones[Math.floor(n/100)]+" HUNDRED"+(n%100?" "+numberToWords(n%100):"");return numberToWords(Math.floor(n/1000))+" THOUSAND"+(n%1000?" "+numberToWords(n%1000):"");};
const save=async(k,d)=>{try{await supa("app_data",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify({key:k,value:d})});}catch(e){console.error("Save error:",k,e);}};
const DEF_SETTINGS={companyName:"Black Bear Rentals",legalName:"Oak & Main Development LLC",pmName:"Carolina Cooper",phone:"(850) 696-8101",email:"info@rentblackbear.com",pmEmail:"blackbearhousing@gmail.com",city:"Huntsville, Alabama",adminAccent:"#4a7c59",adminAccentRgb:"74,124,89",siteUrl:"https://rentblackbear.com",utilTemplates:null,m2mIncrease:50,m2mNoticeDays:30};

// ── Property helpers (re-declared) ───────────────────────────────────
const allRooms=(prop)=>{if(!prop)return[];if(prop.units&&prop.units.length>0)return prop.units.flatMap(u=>u.rooms||[]);return prop.rooms||[];};
const leaseableItems=(prop,propName)=>{const pn=propName||prop.addr||prop.name||"";return(prop.units||[]).flatMap(u=>{if((u.rentalMode||"byRoom")==="wholeHouse"){const rooms=u.rooms||[];const anyOcc=rooms.some(r=>r.st==="occupied"||(r.tenant&&!r.st));const latestLe=rooms.filter(r=>r.le).sort((a,b)=>new Date(b.le)-new Date(a.le))[0]?.le||null;if(u.ownerOccupied)return[];return[{id:u.id,name:(prop.units||[]).length>1?u.name:"Whole Unit",rent:u.rent||0,st:anyOcc?"occupied":"vacant",le:latestLe,propName:pn,propId:prop.id,unitId:u.id,unitName:u.name,unitLabel:u.label,isWholeUnit:true,baths:u.baths,sqft:u.sqft,beds:rooms.length}];}return(u.rooms||[]).filter(r=>!r.ownerOccupied).map(r=>({...r,st:r.st||(r.tenant?"occupied":"vacant"),propName:pn,propId:prop.id,unitId:u.id,unitName:u.name,unitLabel:u.label,isWholeUnit:false}));});};
const getPropDisplayName=(prop)=>{if(!prop)return"";return prop.addr||prop.name||"";};

// ── Signature canvas ─────────────────────────────────────────────────
function SigCanvas({onSave,height=120}){
  const canvasRef=useRef(null);const drawing=useRef(false);const lastPos=useRef(null);
  const getPos=(e,canvas)=>{const r=canvas.getBoundingClientRect();if(e.touches){return{x:e.touches[0].clientX-r.left,y:e.touches[0].clientY-r.top};}return{x:e.clientX-r.left,y:e.clientY-r.top};};
  const start=(e)=>{e.preventDefault();drawing.current=true;const canvas=canvasRef.current;const ctx=canvas.getContext("2d");const pos=getPos(e,canvas);ctx.beginPath();ctx.moveTo(pos.x,pos.y);lastPos.current=pos;};
  const move=(e)=>{e.preventDefault();if(!drawing.current)return;const canvas=canvasRef.current;const ctx=canvas.getContext("2d");const pos=getPos(e,canvas);ctx.strokeStyle="#1a1714";ctx.lineWidth=2;ctx.lineCap="round";ctx.lineJoin="round";ctx.lineTo(pos.x,pos.y);ctx.stroke();lastPos.current=pos;};
  const end=(e)=>{e.preventDefault();drawing.current=false;};
  const clear=()=>{const canvas=canvasRef.current;const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);};
  const save2=()=>{const canvas=canvasRef.current;onSave(canvas.toDataURL());};
  return(<div style={{position:"relative"}}>
    <canvas ref={canvasRef} width={440} height={height} style={{border:"1px solid rgba(0,0,0,.1)",borderRadius:6,cursor:"crosshair",touchAction:"none",width:"100%",height:height,display:"block",background:"#fafaf8"}}
      onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
      onTouchStart={start} onTouchMove={move} onTouchEnd={end}/>
    <div style={{display:"flex",gap:6,marginTop:6}}>
      <button className="btn btn-out btn-sm" onClick={clear}>Clear</button>
      <button className="btn btn-green btn-sm" onClick={save2}>Save Signature</button>
    </div>
  </div>);
}

// ── LeaseModal ───────────────────────────────────────────────────────
export default function LeaseModal({
  leaseForm,setLeaseForm,
  leases,setLeases,
  properties,setProperties,
  settings,setSettings,
  setCharges,setNotifs,
  modal,setModal,
  showAlert,
  setLeaseSubTab,
}){
  const[leaseSigErr,setLeaseSigErr]=useState(false);
  const _acc=(settings?.adminAccent)||"#4a7c59";

  const _triggerLeaseWiggle=(errs)=>{
    setLeaseForm(p=>p?({...p,_errors:errs}):p);
    const mb=document.querySelector(".lease-modal-box");
    if(mb){mb.style.animation="none";mb.offsetHeight;mb.style.animation="shake .4s ease";}
    setTimeout(()=>{
      const summary=document.querySelector(".lease-err-summary");
      if(summary){summary.scrollIntoView({behavior:"smooth",block:"nearest"});}
      else{const mbg=document.querySelector(".mbg");if(mbg)mbg.scrollTo({top:mbg.scrollHeight,behavior:"smooth"});}
    },80);
  };

  const saveDraft=()=>{
    if(!leaseForm)return;
    const now=TODAY.toISOString().split("T")[0];
    const rentWords=leaseForm.rent?numberToWords(leaseForm.rent):"";
    const vars={
      MONTHLY_RENT:leaseForm.rent?.toLocaleString()||"",
      RENT_WORDS:rentWords,
      DAILY_RATE:leaseForm.rent?Math.ceil(leaseForm.rent/30):"",
      SECURITY_DEPOSIT:leaseForm.sd?.toLocaleString()||"",
      PRORATED_RENT:leaseForm.proratedRent?.toLocaleString()||"0",
      LEASE_START:fmtD(leaseForm.leaseStart),
      LEASE_END:fmtD(leaseForm.leaseEnd),
      PROPERTY_ADDRESS:leaseForm.propertyAddress||leaseForm.property||"",
      PARKING_SPACE:leaseForm.parking||"See property map",
      DOOR_CODE:leaseForm.doorCode||"Assigned at move-in",
      UTILITIES_CLAUSE:leaseForm.utilitiesClause||"",
      LANDLORD_NAME:leaseForm.landlordName||"Carolina Cooper",
    };
    const newLease={
      ...leaseForm,
      id:leaseForm.id||uid(),
      variables:vars,
      updatedAt:now,
      createdAt:leaseForm.createdAt||now,
    };
    setLeases(p=>{const exists=p.find(l=>l.id===newLease.id);const updated=exists?p.map(l=>l.id===newLease.id?newLease:l):[...p,newLease];upsertLease(newLease);return updated;});
    if(!leaseForm.id&&leaseForm.roomId){
      const roomId=leaseForm.roomId;
      const tenantName=leaseForm.tenantName||"";
      const propName=leaseForm.propertyAddress||leaseForm.property||"";
      const today=TODAY.toISOString().split("T")[0];
      const mi=leaseForm.moveIn||today;
      const miD=new Date(mi+"T00:00:00");
      const dayBefore=new Date(miD);dayBefore.setDate(dayBefore.getDate()-1);
      const dueBefore=mi===today?today:dayBefore.toISOString().split("T")[0];
      const rent=leaseForm.rent||0;
      const sd=leaseForm.sd||0;
      const proMode=leaseForm.prorationMethod||"std";
      const day=miD.getDate();
      const daysLeft=new Date(miD.getFullYear(),miD.getMonth()+1,0).getDate()-day+1;
      const dailyRate=Math.ceil(rent/30);
      const isFirstDay=day===1;
      const proratedAmt=isFirstDay?0:Math.ceil(dailyRate*daysLeft);
      const firstRentAmt=proMode==="full"?rent:proratedAmt;
      const moveInMonthName=miD.toLocaleString("default",{month:"long"});
      const nextMonthD=new Date(miD.getFullYear(),miD.getMonth()+1,1);
      const nextMonthName=nextMonthD.toLocaleString("default",{month:"long"});
      const requireLast=leaseForm.requireLastMonth||false;
      const installs=leaseForm.lastMonthInstallments||3;
      const lastInstallAmt=requireLast?Math.ceil(rent/installs):0;
      const newCharges=[];
      if(sd>0)newCharges.push({id:uid(),createdDate:today,roomId,tenantName,propName,leaseId:newLease.id,category:"Security Deposit",desc:"Security Deposit — due at signing",amount:sd,dueDate:today,amountPaid:0,payments:[],waived:false,waivedReason:"",sent:true,sentDate:today,notes:"Collected at lease signing to secure the room."});
      if(firstRentAmt>0){
        const rentDesc=proMode==="full"?`First Month's Rent — covers ${nextMonthName}`:isFirstDay?`${moveInMonthName} Rent — First Month`:`Prorated ${moveInMonthName} Rent (${daysLeft} days)`;
        newCharges.push({id:uid(),createdDate:today,roomId,tenantName,propName,leaseId:newLease.id,category:"Rent",desc:rentDesc,amount:firstRentAmt,dueDate:dueBefore,amountPaid:0,payments:[],waived:false,waivedReason:"",sent:true,sentDate:today,notes:"Due before move-in."});
      }
      if(requireLast&&lastInstallAmt>0){
        const lmDesc=installs===1?`Last Month's Rent — due before move-in`:`Last Month's Rent — installment 1 of ${installs}`;
        newCharges.push({id:uid(),createdDate:today,roomId,tenantName,propName,leaseId:newLease.id,category:"Last Month Rent",desc:lmDesc,amount:lastInstallAmt,dueDate:dueBefore,amountPaid:0,payments:[],waived:false,waivedReason:"",sent:true,sentDate:today,notes:"First installment due before move-in."});
      }
      if(newCharges.length>0){setCharges(prev=>{const updated=[...newCharges,...prev];save("hq-charges",updated);return updated;});}
    }
    setLeaseForm(null);
    setLeaseSubTab("active");
  };

  const continueToSignAndSend=()=>{
    if(!leaseForm)return;
    const errs={};
    if(!(leaseForm.tenantName||"").trim()) errs.tenantName="Tenant name is required.";
    if(!(leaseForm.tenantEmail||"").trim()) errs.tenantEmail="Tenant email is required.";
    const _pid=leaseForm.propertyId||properties.find(p=>getPropDisplayName(p)===leaseForm.property)?.id||"";
    if(!_pid) errs.propertyId="Select a property.";
    if(!leaseForm.roomId&&!(leaseForm.room||"").trim()) errs.roomId="Select a room or unit.";
    if(!leaseForm.rent||leaseForm.rent<=0) errs.rent="Monthly rent amount is required.";
    if(!leaseForm.moveIn) errs.moveIn="Move-in date is required.";
    if(!errs.moveIn){const _ovRoom=leaseForm.roomId?properties.flatMap(p=>allRooms(p)).find(r=>r.id===leaseForm.roomId):null;const _ovCurLe=_ovRoom?.le||null;if(_ovCurLe&&leaseForm.moveIn&&leaseForm.moveIn<_ovCurLe)errs.moveIn="Move-in "+fmtD(leaseForm.moveIn)+" overlaps the current lease ending "+fmtD(_ovCurLe)+". Resolve the conflict or use the 'Use "+fmtD(_ovCurLe)+"' button in the timeline before signing.";}
    if(!errs.moveIn){const _ovRoom=leaseForm.roomId?properties.flatMap(p=>allRooms(p)).find(r=>r.id===leaseForm.roomId):null;const _ovCurLe=_ovRoom?.le||null;const bufD=leaseForm._bufferDays??7;if(_ovCurLe&&leaseForm.moveIn&&bufD>0){const be=new Date(_ovCurLe+"T00:00:00");be.setDate(be.getDate()+bufD);const beStr=be.toISOString().split("T")[0];if(leaseForm.moveIn>=_ovCurLe&&leaseForm.moveIn<=beStr){const nd=new Date(be);nd.setDate(nd.getDate()+1);errs.moveIn="Move-in "+fmtD(leaseForm.moveIn)+" falls within the "+bufD+"-day turnover buffer (ends "+fmtD(beStr)+"). Earliest available: "+fmtD(nd.toISOString().split("T")[0])+".";}}};
    if(!leaseForm.leaseEndTbd&&!leaseForm.leaseEnd) errs.leaseEnd="Lease end date is required, or toggle TBD.";
    if(!leaseForm.doorCode||leaseForm.doorCode.trim().length!==4) errs.doorCode="A 4-digit door code is required before signing.";
    if(leaseForm.parkingChoice===null||leaseForm.parkingChoice===undefined) errs.parkingChoice="Indicate whether this room has assigned parking.";
    if(leaseForm.parkingChoice==="yes"&&!(leaseForm.parking||"").trim()) errs.parking="Enter the parking space description.";
    if(!leaseForm.utilitiesMode||(leaseForm.utilitiesMode==="custom"&&!leaseForm.utilitiesClause?.trim())) errs.utilitiesMode="Select a utilities arrangement before signing.";
    setLeaseForm(p=>p?({...p,_submitAttempted:true}):p);
    if(Object.keys(errs).length>0){_triggerLeaseWiggle(errs);return;}
    saveDraft();
    setTimeout(()=>{
      setLeases(prev=>{
        const appId=leaseForm.applicationId;
        const saved=appId?prev.find(l=>l.applicationId===appId&&l.status==="draft"):prev[prev.length-1];
        if(saved)setModal({type:"signLease",leaseId:saved.id,lease:saved});
        return prev;
      });
    },150);
  };

  const signAndSend=async(leaseId)=>{
    const now=new Date().toISOString();
    const token=uid()+uid();
    const link=`${settings.siteUrl||"https://rentblackbear.com"}/lease?token=${token}`;
    setLeases(p=>{const updated=p.map(l=>l.id===leaseId?{...l,status:"pending_tenant",landlordSignedAt:now,signingToken:token,signingLink:link}:l);patchLease(leaseId,{status:"pending_tenant",landlord_signed_at:now,signing_token:token,signing_link:link});return updated;});
    setNotifs(p=>[{id:uid(),type:"lease",msg:`Lease sent to tenant for signing — ${link}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
    setModal({type:"leaseSent",link});
  };

  const deleteLease=id=>{setLeases(p=>{const updated=p.filter(l=>l.id!==id);deleteLeaseInDB(id);return updated;});};
  return(<>
  {leaseForm&&<div className="mbg" onClick={()=>setLeaseForm(null)}><div className="mbox lease-modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:660}}>
    <h2>{leaseForm.id?"Edit Lease":"Create New Lease"}</h2>
    <div style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>All fields auto-populate from the application or property settings. Edit anything before saving.</div>

    <div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.15)",borderRadius:10,padding:12,marginBottom:14}}>
      {(()=>{
        const locked=leaseForm._lockedFromApp&&!leaseForm._partiesEditing;
        const ro=(val)=><div style={{padding:"7px 10px",background:"rgba(0,0,0,.03)",borderRadius:6,border:"0.5px solid rgba(0,0,0,.06)",fontSize:12,color:"#6b5e52",minHeight:34,display:"flex",alignItems:"center"}}>{val||<span style={{color:"#aaa"}}>—</span>}</div>;
        return(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#9a7422"}}>PARTIES</div>
            {leaseForm._lockedFromApp&&(
              locked
                ?<button onClick={()=>setLeaseForm(p=>({...p,_partiesEditing:true}))} style={{fontSize:10,fontWeight:700,color:"#9a7422",background:"rgba(212,168,83,.1)",border:"0.5px solid rgba(212,168,83,.3)",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>Edit</button>
                :<button onClick={()=>setLeaseForm(p=>({...p,_partiesEditing:false}))} style={{fontSize:10,fontWeight:700,color:"#4a7c59",background:"rgba(74,124,89,.08)",border:"0.5px solid rgba(74,124,89,.2)",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>Lock</button>
            )}
          </div>
          <div className="fr">
            <div className="fld"><label>Tenant Name</label>
              {locked?ro(leaseForm.tenantName):<input value={leaseForm.tenantName||""} onChange={e=>setLeaseForm(p=>({...p,tenantName:e.target.value,_errors:{...(p._errors||{}),tenantName:null}}))} style={{borderColor:leaseForm._errors?.tenantName?"#c45c4a":undefined}}/>}
              {leaseForm._errors?.tenantName&&<div style={{color:"#c45c4a",fontSize:11,marginTop:4,animation:"shake .4s ease"}}>{leaseForm._errors.tenantName}</div>}
            </div>
            <div className="fld"><label>Tenant Email</label>
              {locked?ro(leaseForm.tenantEmail):<input type="email" value={leaseForm.tenantEmail||""} onChange={e=>setLeaseForm(p=>({...p,tenantEmail:e.target.value,_errors:{...(p._errors||{}),tenantEmail:null}}))} style={{borderColor:leaseForm._errors?.tenantEmail?"#c45c4a":undefined}}/>}
              {leaseForm._errors?.tenantEmail&&<div style={{color:"#c45c4a",fontSize:11,marginTop:4,animation:"shake .4s ease"}}>{leaseForm._errors.tenantEmail}</div>}
            </div>
          </div>
          <div className="fr">
            <div className="fld"><label>Tenant Phone</label>
              {locked?ro(leaseForm.tenantPhone):<input value={leaseForm.tenantPhone||""} onChange={e=>setLeaseForm(p=>({...p,tenantPhone:e.target.value}))}/>}
            </div>
            <div className="fld"><label>Property Manager (on lease)</label>
              {locked?ro(leaseForm.landlordName):<input value={leaseForm.landlordName||""} onChange={e=>setLeaseForm(p=>({...p,landlordName:e.target.value}))}/>}
            </div>
          </div>
        </>);
      })()}
    </div>

    <div style={{background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.12)",borderRadius:10,padding:12,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#2d6a3f"}}>PROPERTY</div>
        {leaseForm.applicationId&&!leaseForm._propEditing&&<button onClick={()=>setLeaseForm(p=>({...p,_propEditing:true}))} style={{fontSize:9,fontWeight:700,color:"#9a7422",background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"inherit"}}>Edit</button>}
      </div>
      {leaseForm.applicationId&&!leaseForm._propEditing
        ? <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:200,padding:"8px 10px",background:"rgba(74,124,89,.06)",borderRadius:7,border:"1px solid rgba(74,124,89,.12)"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#6b5e52",marginBottom:2}}>PROPERTY ADDRESS</div>
              <div style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>{leaseForm.propertyAddress||"—"}</div>
            </div>
            <div style={{flex:"0 0 auto",minWidth:140,padding:"8px 10px",background:"rgba(74,124,89,.06)",borderRadius:7,border:"1px solid rgba(74,124,89,.12)"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#6b5e52",marginBottom:2}}>ROOM / UNIT</div>
              <div style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>{leaseForm.room||"—"}</div>
            </div>
          </div>
        : (()=>{
            const _resolvedPropId=leaseForm.propertyId||properties.find(p=>p.id===leaseForm.propertyId)?.id||properties.find(p=>getPropDisplayName(p)===leaseForm.property)?.id||properties.find(p=>p.addr===leaseForm.propertyAddress)?.id||"";
            const _resolvedRoomVal=leaseForm.roomId||"";
            return(<>
            <div className="fr">
              <div className="fld"><label>Property</label>
                <select value={_resolvedPropId} onChange={e=>{const p2=properties.find(p=>p.id===e.target.value);setLeaseForm(p=>({...p,propertyId:p2?.id||"",property:p2?getPropDisplayName(p2):"",propertyAddress:p2?.addr||"",room:"",roomId:"",_errors:{...(p._errors||{}),propertyId:null,roomId:null}}));}} style={{borderColor:leaseForm._errors?.propertyId?"#c45c4a":undefined}}>
                  <option value="">Select...</option>
                  {properties.map(p=><option key={p.id} value={p.id}>{getPropDisplayName(p)}</option>)}
                </select>
                {leaseForm._errors?.propertyId&&<div style={{color:"#c45c4a",fontSize:11,marginTop:4,animation:"shake .4s ease"}}>{leaseForm._errors.propertyId}</div>}
              </div>
              <div className="fld"><label>Room / Unit</label>
                <select value={_resolvedRoomVal} onChange={e=>{
                  const lp=properties.find(p=>p.id===_resolvedPropId);
                  if(!lp)return;
                  const items=leaseableItems(lp);
                  const item=items.find(i=>i.id===e.target.value);
                  if(!item)return;
                  const unit=(lp.units||[]).find(u=>u.id===item.unitId);
                  const uKey=unit?.utils||"allIncluded";
                  const uClause=(settings.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===uKey)?.clause||"See lease for utility terms.";
                  setLeaseForm(p=>({...p,room:item.name,roomId:item.id,unitId:item.unitId||"",unitName:item.unitName||"",rent:item.rent||p.rent,sd:item.rent||p.sd,parkingChoice:item.parking?(item.parking==="none"?"no":"yes"):null,parking:item.parking&&item.parking!=="none"?item.parking:"",_errors:{...(p._errors||{}),roomId:null,parkingChoice:null}}));
                }} style={{width:"100%",borderColor:leaseForm._errors?.roomId?"#c45c4a":undefined}}>
                  <option value="">Select...</option>
                  {(()=>{const lp=properties.find(p=>p.id===_resolvedPropId);if(!lp)return null;
                    return leaseableItems(lp).map(item=>(
                      <option key={item.id} value={item.id}>
                        {item.unitLabel&&!item.isWholeUnit?"Unit "+item.unitLabel+" — ":""}{item.name}{item.isWholeUnit?" (Whole Unit)":""} — {fmtS(item.rent)}/mo
                      </option>
                    ));})()}
                </select>
                {leaseForm._errors?.roomId&&<div style={{color:"#c45c4a",fontSize:11,marginTop:4,animation:"shake .4s ease"}}>{leaseForm._errors.roomId}</div>}
              </div>
            </div>
          </>);})()}
    </div>

    {/* Utilities Clause */}
    <div className="fld" style={{marginBottom:14}}>
      <label>Utilities Clause <span style={{color:"#c45c4a",fontSize:11}}>*</span></label>
      {(()=>{
        const _locked=leaseForm._lockedFromApp&&!leaseForm._leaseEditing&&!!(leaseForm.utilitiesClause||"").trim();
        return _locked
          ?<div style={{padding:"7px 10px",background:"rgba(0,0,0,.03)",borderRadius:6,border:"0.5px solid rgba(0,0,0,.06)",fontSize:11,color:leaseForm.utilitiesClause?"#6b5e52":"#c45c4a",lineHeight:1.5}}>{leaseForm.utilitiesClause||"No utilities clause selected — click Edit to choose one"}</div>
          :<>
            <select value={leaseForm.utilitiesMode||""} onChange={e=>{const mode=e.target.value;const tmpl=(settings.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===mode);setLeaseForm(p=>({...p,utilitiesMode:mode,utilitiesClause:mode==="custom"?"":tmpl?.clause||"",_errors:{...(p._errors||{}),utilitiesMode:null},_utilPresetSaved:false}));}} style={{width:"100%",marginBottom:leaseForm.utilitiesMode==="custom"||!leaseForm.utilitiesMode?6:0,borderColor:leaseForm._errors?.utilitiesMode?"#c45c4a":undefined,animation:leaseForm._errors?.utilitiesMode?"shake .4s ease":undefined}}>
              <option value="">— Select a utilities clause —</option>
              {(settings.utilTemplates||DEF_SETTINGS.utilTemplates).map(t=><option key={t.id} value={t.key}>{t.name}</option>)}
              <option value="custom">Custom — write your own</option>
            </select>
            {leaseForm._errors?.utilitiesMode&&!leaseForm.utilitiesMode&&<div style={{color:"#c45c4a",fontSize:11,fontWeight:600,marginBottom:4}}>{leaseForm._errors.utilitiesMode}</div>}
            {leaseForm.utilitiesMode==="custom"&&<textarea value={leaseForm.utilitiesClause||""} onChange={e=>setLeaseForm(p=>({...p,utilitiesClause:e.target.value}))} rows={3} placeholder="Write your custom utilities clause..." style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/>}
            {leaseForm.utilitiesMode&&leaseForm.utilitiesMode!=="custom"&&<div style={{fontSize:10,color:"#6b5e52",padding:"6px 8px",background:"rgba(0,0,0,.02)",borderRadius:5,border:"0.5px solid rgba(0,0,0,.06)",lineHeight:1.5,marginBottom:4}}>{leaseForm.utilitiesClause}</div>}
            {leaseForm.utilitiesMode&&leaseForm.roomId&&(()=>{
              const saveUtilPreset=()=>{const lp=properties.find(p=>p.id===(leaseForm.propertyId||properties.find(pp=>getPropDisplayName(pp)===leaseForm.property)?.id));if(!lp||!leaseForm.roomId)return;const updatedUnits=(lp.units||[]).map(u=>({...u,utils:u.rooms&&u.rooms.some(r=>r.id===leaseForm.roomId)?leaseForm.utilitiesMode:u.utils,rooms:(u.rooms||[]).map(r=>r.id===leaseForm.roomId?{...r,utils:leaseForm.utilitiesMode}:r)}));const updatedProps=properties.map(p=>p.id===lp.id?{...p,units:updatedUnits}:p);setProperties(updatedProps);setLeaseForm(p=>({...p,_utilPresetSaved:true}));};
              return(<button onClick={saveUtilPreset} style={{marginLeft:"auto",padding:"5px 14px",fontSize:10,fontWeight:700,borderRadius:6,cursor:"pointer",fontFamily:"inherit",border:"0.5px solid rgba(74,124,89,.3)",background:leaseForm._utilPresetSaved?"#4a7c59":"rgba(74,124,89,.06)",color:leaseForm._utilPresetSaved?"#fff":"#2d6a3f",transition:"all .3s",display:"block"}}>{leaseForm._utilPresetSaved?"Preset saved":"Save as preset for this room"}</button>);
            })()}
          </>;
      })()}
    </div>
    {(()=>{
            const locked=leaseForm._lockedFromApp&&!leaseForm._leaseEditing;
            const ro=(val)=><div style={{padding:"7px 10px",background:"rgba(0,0,0,.03)",borderRadius:6,border:"0.5px solid rgba(0,0,0,.06)",fontSize:12,color:locked?"#6b5e52":"#1a1714",fontWeight:locked?400:500,minHeight:34,display:"flex",alignItems:"center"}}>{val||<span style={{color:"#aaa"}}>—</span>}</div>;
            const _tlRoom=leaseForm.roomId?properties.flatMap(p=>allRooms(p)).find(r=>r.id===leaseForm.roomId):null;
            const _tlCurLe=_tlRoom?.le||null;
            const _miMode=leaseForm._moveInMode||"specific";
            const _bufDays=leaseForm._bufferDays??7;
            // Returns YYYY-MM-DD for "day after buffer ends" (or today if vacant)
            const _computeAsapMi=(curLe,buf)=>{if(!curLe)return TODAY.toISOString().split("T")[0];const d=new Date(curLe+"T00:00:00");d.setDate(d.getDate()+(buf||0)+1);const todayStr=TODAY.toISOString().split("T")[0];return d.toISOString().split("T")[0]>=todayStr?d.toISOString().split("T")[0]:todayStr;};
            // Returns the leaseForm fields to update when move-in date is set
            const _applyAsapToForm=(mi,rent)=>{if(!mi)return{};const miD=new Date(mi+"T00:00:00");const day=miD.getDate();const daysLeft=new Date(miD.getFullYear(),miD.getMonth()+1,0).getDate()-day+1;const prorated=day===1?0:Math.ceil(((rent||0)/30)*daysLeft);const leD=new Date(mi+"T00:00:00");leD.setFullYear(leD.getFullYear()+1);return{moveIn:mi,leaseStart:mi,proratedRent:prorated,leaseEnd:leD.toISOString().split("T")[0]};};
            const _bufEnd=_tlCurLe&&_bufDays>0?(()=>{const d=new Date(_tlCurLe+"T00:00:00");d.setDate(d.getDate()+_bufDays);return d.toISOString().split("T")[0];})():null;
            const _isOverlapMi=!!(_tlCurLe&&leaseForm.moveIn&&leaseForm.moveIn<_tlCurLe);
            const _isBufferViolation=!_isOverlapMi&&!!(_tlCurLe&&_bufEnd&&leaseForm.moveIn&&leaseForm.moveIn>=_tlCurLe&&leaseForm.moveIn<=_bufEnd);
            return(
            <div style={{background:"rgba(59,130,246,.04)",border:"1px solid rgba(59,130,246,.12)",borderRadius:10,padding:12,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:10,fontWeight:700,color:"#1d4ed8"}}>LEASE TERMS · Pre-filled from application · Editable</div>
                {leaseForm._lockedFromApp&&(
                  locked
                    ?<button onClick={()=>setLeaseForm(p=>({...p,_leaseEditing:true}))} style={{fontSize:10,fontWeight:700,color:"#9a7422",background:"rgba(212,168,83,.1)",border:"0.5px solid rgba(212,168,83,.3)",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>Edit</button>
                    :<button onClick={()=>setLeaseForm(p=>({...p,_leaseEditing:false}))} style={{fontSize:10,fontWeight:700,color:"#4a7c59",background:"rgba(74,124,89,.08)",border:"0.5px solid rgba(74,124,89,.2)",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>Lock</button>
                )}
              </div>
              <div className="fr">
                <div className="fld"><label>Monthly Rent ($)</label>
                  {locked?ro(fmtS(leaseForm.rent||0)):<input type="number" value={leaseForm.rent||""} onChange={e=>{const rent=Number(e.target.value);const mi=leaseForm.moveIn;const day=mi?new Date(mi+"T00:00:00").getDate():1;const daysLeft=mi?new Date(new Date(mi+"T00:00:00").getFullYear(),new Date(mi+"T00:00:00").getMonth()+1,0).getDate()-day+1:0;const prorated=day===1?0:Math.ceil((rent/30)*daysLeft);setLeaseForm(p=>({...p,rent,sd:rent,proratedRent:prorated,_errors:{...(p._errors||{}),rent:null}}));}} style={{borderColor:leaseForm._errors?.rent?"#c45c4a":undefined}}/>}
                  {leaseForm._errors?.rent&&<div style={{color:"#c45c4a",fontSize:11,marginTop:4,animation:"shake .4s ease"}}>{leaseForm._errors.rent}</div>}
                </div>
                <div className="fld"><label>Security Deposit ($)</label>
                  {locked?ro(fmtS(leaseForm.sd||0)):<input type="number" value={leaseForm.sd||""} onChange={e=>setLeaseForm(p=>({...p,sd:Number(e.target.value)}))}/>}
                </div>
              </div>
              <div className="fr">
                <div className="fld">
                  <label>Move-in Date</label>
                  {locked
                    ? ro(fmtD(leaseForm.moveIn))
                    : <div style={{borderRadius:6,border:`1.5px solid ${_isOverlapMi||leaseForm._errors?.moveIn?"#c45c4a":_isBufferViolation?"#d4a853":"rgba(0,0,0,.12)"}`,overflow:"hidden",transition:"border-color .2s"}}>
                        {leaseForm.roomId&&<div style={{display:"flex",borderBottom:"0.5px solid rgba(0,0,0,.08)"}}>
                          {[["asap","ASAP"],["specific","Pick date"]].map(([v,l])=>(
                            <button key={v} onClick={()=>{
                              if(v==="asap"){const newMi=_computeAsapMi(_tlCurLe,_bufDays);setLeaseForm(p=>({...p,_moveInMode:"asap",..._applyAsapToForm(newMi,p.rent),_errors:{...(p._errors||{}),moveIn:null}}));}
                              else{setLeaseForm(p=>({...p,_moveInMode:"specific"}));}
                            }} style={{flex:1,padding:"6px 0",fontSize:10,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",borderRight:v==="asap"?"0.5px solid rgba(0,0,0,.08)":"none",background:_miMode===v?`rgba(${settings.adminAccentRgb||"74,124,89"},.1)`:"rgba(0,0,0,.02)",color:_miMode===v?_acc:"#9a8878"}}>{l}</button>
                          ))}
                        </div>}
                        <div style={{padding:"8px 12px",display:"flex",justifyContent:"center"}}>
                          {_miMode==="asap"
                            ?<div style={{background:`rgba(${settings.adminAccentRgb||"74,124,89"},.06)`,border:`1px solid rgba(${settings.adminAccentRgb||"74,124,89"},.2)`,borderRadius:20,padding:"5px 16px",display:"inline-flex",alignItems:"center",gap:8}}>
                               <span style={{fontSize:12,fontWeight:600,color:_acc}}>{fmtD(leaseForm.moveIn)||"—"}</span>
                               <span style={{fontSize:9,color:"#9a8878"}}>auto</span>
                             </div>
                            :<input type="date" value={leaseForm.moveIn||""} onChange={e=>{
                               const mi=e.target.value;
                               if(!mi||mi.length<10){setLeaseForm(p=>({...p,moveIn:mi,leaseStart:mi}));return;}
                               const rent=leaseForm.rent||0;const miD=new Date(mi+"T00:00:00");const day=miD.getDate();const daysLeft=new Date(miD.getFullYear(),miD.getMonth()+1,0).getDate()-day+1;const prorated=day===1?0:Math.ceil((rent/30)*daysLeft);const leaseEndD=new Date(mi+"T00:00:00");leaseEndD.setFullYear(leaseEndD.getFullYear()+1);setLeaseForm(p=>({...p,moveIn:mi,leaseStart:mi,proratedRent:prorated,leaseEnd:leaseEndD.toISOString().split("T")[0],_errors:{...(p._errors||{}),moveIn:null}}));
                             }} style={{border:`1px solid rgba(${settings.adminAccentRgb||"74,124,89"},.25)`,borderRadius:20,padding:"5px 14px",fontSize:12,fontFamily:"inherit",background:"transparent",outline:"none",width:160,textAlign:"center"}}/>
                          }
                        </div>
                      </div>
                  }
                  {leaseForm._errors?.moveIn&&<div style={{color:"#c45c4a",fontSize:11,marginTop:4,animation:"shake .4s ease"}}>{leaseForm._errors.moveIn}</div>}
                </div>
                <div className="fld">
                  <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>Lease End</span>
                    {!locked&&<label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontWeight:400}}>
                      <span style={{fontSize:10,color:"#6b5e52"}}>TBD</span>
                      <button onClick={()=>setLeaseForm(p=>({...p,leaseEndTbd:!p.leaseEndTbd,leaseEnd:p.leaseEndTbd?p.leaseEnd:"",_leaseEndTbdChanged:true}))} style={{width:30,height:16,borderRadius:8,border:"none",cursor:"pointer",background:leaseForm.leaseEndTbd?"#d4a853":"#ccc",position:"relative",padding:0,transition:"background .15s",flexShrink:0}}>
                        <div style={{position:"absolute",width:12,height:12,borderRadius:"50%",background:"#fff",top:2,left:leaseForm.leaseEndTbd?16:2,transition:"left .15s"}}/>
                      </button>
                    </label>}
                  </label>
                  {locked
                    ? leaseForm.leaseEndTbd
                      ? <div style={{padding:"7px 10px",background:"rgba(212,168,83,.08)",borderRadius:6,border:"0.5px solid rgba(212,168,83,.3)",fontSize:11,color:"#9a7422",fontWeight:600}}>
                          TBD — must be confirmed in writing before move-in
                        </div>
                      : ro(leaseForm.leaseEnd?fmtD(leaseForm.leaseEnd):"Not set")
                    : leaseForm.leaseEndTbd
                      ? <div style={{padding:"7px 10px",background:"rgba(212,168,83,.06)",borderRadius:6,border:"0.5px solid rgba(212,168,83,.25)",fontSize:11,color:"#9a7422"}}>
                          To be determined — a written confirmation is required before move-in
                        </div>
                      : <input type="date" value={leaseForm.leaseEnd||""} onChange={e=>setLeaseForm(p=>({...p,leaseEnd:e.target.value,_errors:{...(p._errors||{}),leaseEnd:null}}))} style={{borderColor:leaseForm._errors?.leaseEnd?"#c45c4a":undefined}}/>
                  }
                  {leaseForm._errors?.leaseEnd&&<div style={{color:"#c45c4a",fontSize:11,marginTop:4,animation:"shake .4s ease"}}>{leaseForm._errors.leaseEnd}</div>}
                </div>
              </div>
              {/* ── Tenant Timeline + Turnover Buffer ── always visible when room selected */}
              {leaseForm.roomId&&(()=>{
                const tlRoom=properties.flatMap(p=>allRooms(p)).find(r=>r.id===leaseForm.roomId);
                const tlCur=tlRoom?.tenant||null;
                const tlCurLe=tlRoom?.le||null;
                const tlMi=leaseForm.moveIn||null;
                const tlLe=leaseForm.leaseEnd||null;
                const isOcc=!!tlCur;
                const isOverlap=isOcc&&tlCurLe&&tlMi&&tlMi<tlCurLe;
                const bufDays=leaseForm._bufferDays??7;
                const bufEnd=tlCurLe?(()=>{const d=new Date(tlCurLe+"T00:00:00");d.setDate(d.getDate()+bufDays);return d.toISOString().split("T")[0];})():null;
                const isBufferViolation=!isOverlap&&isOcc&&tlCurLe&&tlMi&&bufDays>0&&bufEnd&&tlMi>=tlCurLe&&tlMi<=bufEnd;
                const anchor=tlMi||tlCurLe||TODAY.toISOString().split("T")[0];
                const anchorD=new Date(anchor+"T00:00:00");
                const win0=new Date(anchorD.getFullYear(),anchorD.getMonth()-1,1);
                const win1=new Date(anchorD.getFullYear(),anchorD.getMonth()+5,1);
                const totalDays=Math.ceil((win1-win0)/86400000);
                const toX=(ds)=>{if(!ds)return null;const d=Math.ceil((new Date(ds+"T00:00:00")-win0)/86400000);return Math.max(0,Math.min(100,(d/totalDays)*100));};
                const todayX=toX(TODAY.toISOString().split("T")[0]);
                const months=Array.from({length:6},(_,i)=>{const d=new Date(win0);d.setMonth(d.getMonth()+i);return{label:d.toLocaleString("default",{month:"short"}),x:toX(d.toISOString().split("T")[0])};});
                const twoRows=isOcc;
                const curBarBg=isOverlap?"rgba(196,92,74,.22)":isBufferViolation?"rgba(212,168,83,.28)":"rgba(212,168,83,.28)";
                const curBarBorder=isOverlap?"rgba(196,92,74,.5)":isBufferViolation?"rgba(212,168,83,.55)":"rgba(212,168,83,.55)";
                const curBarText=isOverlap?"#c45c4a":"#9a7422";
                const newBarBg=isOverlap?"rgba(196,92,74,.15)":isBufferViolation?"rgba(212,168,83,.15)":"rgba(59,130,246,.18)";
                const newBarBorder=isOverlap?"rgba(196,92,74,.4)":isBufferViolation?"rgba(212,168,83,.5)":"rgba(59,130,246,.42)";
                const newBarText=isOverlap?"#c45c4a":isBufferViolation?"#9a7422":"#1d4ed8";
                const outerBorder=isOverlap?"rgba(196,92,74,.35)":isBufferViolation?"rgba(212,168,83,.4)":"rgba(0,0,0,.08)";
                const headerBg=isOverlap?"rgba(196,92,74,.06)":isBufferViolation?"rgba(212,168,83,.06)":isOcc?"rgba(212,168,83,.05)":"rgba(74,124,89,.04)";
                const headerBorderColor=isOverlap?"rgba(196,92,74,.12)":isBufferViolation?"rgba(212,168,83,.15)":"rgba(0,0,0,.05)";
                // Earliest valid move-in = day after buffer ends
                const earliestMi=bufEnd?(()=>{const d=new Date(bufEnd+"T00:00:00");d.setDate(d.getDate()+1);return d.toISOString().split("T")[0];})():null;
                return(
                <div style={{marginTop:4,marginBottom:10,border:`0.5px solid ${outerBorder}`,borderRadius:8,overflow:"hidden"}}>
                  {/* Status header */}
                  <div style={{padding:"7px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",background:headerBg,borderBottom:`1px solid ${headerBorderColor}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,minWidth:0,flex:1}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:isOverlap?"#c45c4a":isOcc?"#d4a853":"#4a7c59",flexShrink:0}}/>
                      {isOcc
                        ?<span style={{fontSize:10,fontWeight:700,color:isOverlap?"#c45c4a":"#9a7422",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {isOverlap&&<svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:3,verticalAlign:"middle",flexShrink:0}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                          {isOverlap?"Overlap — ":""}<strong>{tlCur.name}</strong> in this room until <strong>{fmtD(tlCurLe)}</strong>
                        </span>
                        :<span style={{fontSize:10,fontWeight:700,color:"#4a7c59"}}>Vacant &mdash; available now</span>
                      }
                      {isOverlap&&<span style={{fontSize:9,fontWeight:700,color:"#c45c4a",background:"rgba(196,92,74,.1)",padding:"2px 7px",borderRadius:4,flexShrink:0,marginLeft:4}}>
                        {Math.ceil((new Date(tlCurLe+"T00:00:00")-new Date(tlMi+"T00:00:00"))/(86400000))}d conflict
                      </span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0,marginLeft:8}}>
                      {/* Buffer control */}
                      <div style={{display:"flex",alignItems:"center",gap:3,background:"rgba(255,255,255,.8)",border:"0.5px solid rgba(0,0,0,.1)",borderRadius:5,padding:"2px 5px"}}>
                        <span style={{fontSize:8,color:"#9a7067",fontWeight:600}}>Buffer</span>
                        <button onClick={()=>setLeaseForm(p=>({...p,_showBufTip:!p._showBufTip}))} title="What is this?" style={{width:13,height:13,borderRadius:"50%",border:"0.5px solid rgba(0,0,0,.2)",background:"rgba(0,0,0,.06)",cursor:"pointer",fontFamily:"inherit",fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:0,color:"#6b5e52",lineHeight:1}}>?</button>
                        <button onClick={()=>{
                          const newBuf=Math.max(0,(leaseForm._bufferDays??7)-1);
                          const newBufEnd=tlCurLe?(()=>{const d=new Date(tlCurLe+"T00:00:00");d.setDate(d.getDate()+newBuf);return d.toISOString().split("T")[0];})():null;
                          const isInvalid=tlCurLe&&leaseForm.moveIn&&(leaseForm.moveIn<tlCurLe||(newBuf>0&&newBufEnd&&leaseForm.moveIn<=newBufEnd));
                          const newMi=(leaseForm._moveInMode==="asap"||isInvalid)?_computeAsapMi(tlCurLe,newBuf):null;
                          setLeaseForm(p=>({...p,_bufferDays:newBuf,...(newMi?{..._applyAsapToForm(newMi,p.rent),_errors:{...(p._errors||{}),moveIn:null}}:{})}));
                        }} style={{width:15,height:15,borderRadius:3,border:"1px solid rgba(0,0,0,.12)",background:"#f5f5f5",cursor:"pointer",fontFamily:"inherit",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:0,color:"#1a1714"}}>&#8722;</button>
                        <span style={{fontSize:10,fontWeight:800,color:"#1a1714",minWidth:20,textAlign:"center"}}>{bufDays}d</span>
                        <button onClick={()=>{
                          const newBuf=(leaseForm._bufferDays??7)+1;
                          const newBufEnd=tlCurLe?(()=>{const d=new Date(tlCurLe+"T00:00:00");d.setDate(d.getDate()+newBuf);return d.toISOString().split("T")[0];})():null;
                          const isInvalid=tlCurLe&&leaseForm.moveIn&&(leaseForm.moveIn<tlCurLe||(newBuf>0&&newBufEnd&&leaseForm.moveIn<=newBufEnd));
                          const newMi=(leaseForm._moveInMode==="asap"||isInvalid)?_computeAsapMi(tlCurLe,newBuf):null;
                          setLeaseForm(p=>({...p,_bufferDays:newBuf,...(newMi?{..._applyAsapToForm(newMi,p.rent),_errors:{...(p._errors||{}),moveIn:null}}:{})}));
                        }} style={{width:15,height:15,borderRadius:3,border:"1px solid rgba(0,0,0,.12)",background:"#f5f5f5",cursor:"pointer",fontFamily:"inherit",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:0,color:"#1a1714"}}>&#43;</button>
                      </div>
                      {/* Full timeline button */}
                      <button onClick={()=>setModal(p=>({...p,_tlFloatOpen:true,_tlFloatPos:{x:Math.max(20,Math.floor(window.innerWidth/2)-340),y:40}}))} style={{fontSize:8,fontWeight:700,color:"#1d4ed8",background:"rgba(59,130,246,.07)",border:"0.5px solid rgba(59,130,246,.25)",borderRadius:5,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:3,lineHeight:1}}>
                        <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="6" height="4" rx="1"/><rect x="3" y="10" width="10" height="4" rx="1"/><rect x="3" y="16" width="7" height="4" rx="1"/><line x1="12" y1="6" x2="21" y2="6"/><line x1="16" y1="12" x2="21" y2="12"/><line x1="13" y1="18" x2="21" y2="18"/></svg>
                        Full Timeline
                      </button>
                    </div>
                  </div>
                  {/* Buffer tooltip strip */}
                  {leaseForm._showBufTip&&<div style={{padding:"7px 12px",background:"rgba(154,116,34,.06)",borderBottom:"0.5px solid rgba(154,116,34,.15)",display:"flex",alignItems:"flex-start",gap:8}}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#9a7422" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={{fontSize:10,color:"#9a7422",lineHeight:1.5}}>The <strong>turnover buffer</strong> is the number of days reserved between tenants for cleaning, repairs, and inspections. The new move-in date cannot fall within this window — the system will automatically push it to the first available day after the buffer ends.</span>
                  </div>}
                  {/* Gantt */}
                  <div style={{padding:"7px 10px 8px",background:"#fff"}}>
                    <div style={{position:"relative",height:12,marginBottom:2}}>
                      {months.map((m,i)=><div key={i} style={{position:"absolute",left:m.x+"%",fontSize:7.5,color:"#bbb",transform:"translateX(-50%)",whiteSpace:"nowrap",pointerEvents:"none"}}>{m.label}</div>)}
                    </div>
                    <div style={{position:"relative",height:twoRows?56:30,background:"rgba(0,0,0,.015)",borderRadius:5,overflow:"hidden",border:"0.5px solid rgba(0,0,0,.06)"}}>
                      {todayX!==null&&<div style={{position:"absolute",left:todayX+"%",top:0,bottom:0,width:1.5,background:"rgba(196,92,74,.5)",zIndex:5}}/>}
                      {/* Current tenant bar — top row */}
                      {tlCur&&tlCur.moveIn&&tlCurLe&&toX(tlCur.moveIn)!==null&&toX(tlCurLe)!==null&&(
                        <div style={{position:"absolute",left:Math.max(0,toX(tlCur.moveIn))+"%",width:Math.max(0,toX(tlCurLe)-Math.max(0,toX(tlCur.moveIn)))+"%",top:4,height:18,background:curBarBg,border:`1px solid ${curBarBorder}`,borderRadius:3,display:"flex",alignItems:"center",paddingLeft:4,overflow:"hidden",boxSizing:"border-box"}}>
                          <span style={{fontSize:8,fontWeight:700,color:curBarText,whiteSpace:"nowrap"}}>{tlCur.name}</span>
                        </div>
                      )}
                      {/* Turnover buffer bar */}
                      {tlCurLe&&bufDays>0&&toX(tlCurLe)!==null&&bufEnd&&toX(bufEnd)!==null&&(
                        <div style={{position:"absolute",left:toX(tlCurLe)+"%",width:Math.max(0,toX(bufEnd)-toX(tlCurLe))+"%",top:4,height:18,background:"repeating-linear-gradient(45deg,rgba(120,100,80,.07),rgba(120,100,80,.07) 3px,transparent 3px,transparent 7px)",border:"1px dashed rgba(150,130,110,.5)",borderLeft:"none",borderRadius:"0 3px 3px 0",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",boxSizing:"border-box"}}>
                          <span style={{fontSize:7,fontWeight:700,color:"#9a7067",whiteSpace:"nowrap"}}>{bufDays}d</span>
                        </div>
                      )}
                      {/* New tenant bar — bottom row if occupied, only row if vacant */}
                      {tlMi&&toX(tlMi)!==null&&(
                        <div style={{position:"absolute",left:Math.max(0,toX(tlMi))+"%",width:tlLe&&toX(tlLe)!==null?Math.max(2,toX(tlLe)-Math.max(0,toX(tlMi)))+"%":"20%",top:twoRows?34:4,height:18,background:newBarBg,border:`1px solid ${newBarBorder}`,borderRadius:3,display:"flex",alignItems:"center",paddingLeft:4,overflow:"hidden",boxSizing:"border-box"}}>
                          <span style={{fontSize:8,fontWeight:700,color:newBarText,whiteSpace:"nowrap"}}>{leaseForm.tenantName||"New tenant"}</span>
                        </div>
                      )}
                    </div>
                    {/* Legend */}
                    <div style={{display:"flex",gap:8,marginTop:5,flexWrap:"wrap",alignItems:"center"}}>
                      {tlCur&&<div style={{display:"flex",alignItems:"center",gap:3,fontSize:8,color:"#9a7067"}}><div style={{width:12,height:7,borderRadius:2,background:curBarBg,border:`1px solid ${curBarBorder}`}}/>{tlCur.name}</div>}
                      {tlCurLe&&bufDays>0&&<div style={{display:"flex",alignItems:"center",gap:3,fontSize:8,color:"#9a7067"}}><div style={{width:12,height:7,borderRadius:2,border:"1px dashed rgba(150,130,110,.5)"}}/>{bufDays}d turnover buffer</div>}
                      {tlMi&&<div style={{display:"flex",alignItems:"center",gap:3,fontSize:8,color:"#9a7067"}}><div style={{width:12,height:7,borderRadius:2,background:newBarBg,border:`1px solid ${newBarBorder}`}}/>{leaseForm.tenantName||"New tenant"}</div>}
                      <div style={{display:"flex",alignItems:"center",gap:3,fontSize:8,color:"#9a7067",marginLeft:"auto"}}><div style={{width:1.5,height:10,background:"rgba(196,92,74,.5)"}}/> Today</div>
                    </div>
                  </div>
                  {/* Overlap action footer */}
                  {isOverlap&&tlMi&&<div style={{padding:"7px 12px",borderTop:"1px solid rgba(196,92,74,.15)",background:"rgba(196,92,74,.03)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,color:"#c45c4a",lineHeight:1.4}}>New move-in {fmtD(tlMi)} overlaps existing lease ending {fmtD(tlCurLe)}. Adjust dates or coordinate early termination.</span>
                    <button className="btn btn-out btn-sm" style={{fontSize:10,color:"#9a7422",borderColor:"rgba(212,168,83,.4)",whiteSpace:"nowrap",flexShrink:0}}
                      onClick={()=>{const d=new Date(tlCurLe+"T00:00:00");const le=new Date(d);le.setFullYear(le.getFullYear()+1);setLeaseForm(p=>({...p,moveIn:tlCurLe,leaseStart:tlCurLe,leaseEnd:le.toISOString().split("T")[0],_errors:{...(p._errors||{}),moveIn:null}}));}}>
                      Use {fmtD(tlCurLe)}
                    </button>
                  </div>}
                  {/* Buffer violation footer */}
                  {isBufferViolation&&tlMi&&earliestMi&&<div style={{padding:"7px 12px",borderTop:"1px solid rgba(212,168,83,.2)",background:"rgba(212,168,83,.04)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,color:"#9a7422",lineHeight:1.4}}>Move-in {fmtD(tlMi)} falls within the {bufDays}-day turnover buffer (ends {fmtD(bufEnd)}). Earliest available: <strong>{fmtD(earliestMi)}</strong>.</span>
                    <button className="btn btn-out btn-sm" style={{fontSize:10,color:"#9a7422",borderColor:"rgba(212,168,83,.5)",whiteSpace:"nowrap",flexShrink:0}}
                      onClick={()=>{const le=new Date(earliestMi+"T00:00:00");le.setFullYear(le.getFullYear()+1);setLeaseForm(p=>({...p,..._applyAsapToForm(earliestMi,p.rent),_moveInMode:"specific",_errors:{...(p._errors||{}),moveIn:null}}));}}>
                      Use {fmtD(earliestMi)}
                    </button>
                  </div>}
                </div>);
              })()}
              <div className="fr">
                <div className="fld">
                  <label style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span>Door Code (4-digit PIN)<span style={{color:"#c45c4a",marginLeft:3,fontSize:11}}>*</span></span>
                      {leaseForm._lockedFromApp&&leaseForm.doorCode?.length===4&&!leaseForm._doorCodeEditing&&<span style={{fontSize:9,fontWeight:700,color:"#2d6a3f",background:"rgba(74,124,89,.09)",border:"0.5px solid rgba(74,124,89,.25)",padding:"1px 6px",borderRadius:3}}>from application</span>}
                    </div>
                    {leaseForm._doorCodeEditing
                      ?<button onClick={()=>setLeaseForm(p=>({...p,_doorCodeEditing:false}))} style={{fontSize:9,fontWeight:700,color:"#4a7c59",background:"rgba(74,124,89,.08)",border:"0.5px solid rgba(74,124,89,.2)",borderRadius:4,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Done</button>
                      :<button onClick={()=>setLeaseForm(p=>({...p,_doorCodeEditing:true}))} style={{fontSize:9,fontWeight:700,color:"#9a7422",background:"rgba(212,168,83,.08)",border:"0.5px solid rgba(212,168,83,.3)",borderRadius:4,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Edit</button>
                    }
                  </label>
                  {leaseForm._doorCodeEditing
                    ?<div style={{display:"flex",justifyContent:"center",marginTop:4}}>
                       <input value={leaseForm.doorCode||""} maxLength={4} autoFocus
                         onChange={e=>setLeaseForm(p=>({...p,doorCode:e.target.value.replace(/\D/g,"").slice(0,4),_errors:{...(p._errors||{}),doorCode:null}}))}
                         placeholder="––––"
                         style={{width:110,textAlign:"center",fontFamily:"monospace",fontSize:18,fontWeight:700,letterSpacing:8,animation:leaseForm._errors?.doorCode?"shake .4s ease":undefined,borderColor:leaseForm._errors?.doorCode?"#c45c4a":leaseForm.doorCode?.length===4?"rgba(74,124,89,.45)":undefined}}/>
                     </div>
                    :<div style={{display:"flex",justifyContent:"center",marginTop:4}}>
                       <div style={{width:110,textAlign:"center",fontFamily:"monospace",fontSize:18,fontWeight:700,letterSpacing:8,padding:"7px 10px",background:"rgba(0,0,0,.03)",borderRadius:6,border:`0.5px solid ${leaseForm._errors?.doorCode?"#c45c4a":leaseForm.doorCode?.length===4?"rgba(74,124,89,.3)":"rgba(0,0,0,.08)"}`,color:leaseForm.doorCode?"#6b5e52":"#bbb",animation:leaseForm._errors?.doorCode?"shake .4s ease":undefined}}>
                         {leaseForm.doorCode||"––––"}
                       </div>
                     </div>
                  }
                  {leaseForm._errors?.doorCode&&<div style={{color:"#c45c4a",fontSize:11,fontWeight:600,marginTop:4,animation:"shake .4s ease",textAlign:"center"}}>{leaseForm._errors.doorCode}</div>}
                </div>
                <div className="fld">
                  <label>Parking
                    <span style={{color:"#c45c4a",marginLeft:3,fontSize:11}}>*</span>
                  </label>
                  {(()=>{
                    const pc=leaseForm.parkingChoice;
                    const savePreset=()=>{
                      const lp=properties.find(p=>p.id===(leaseForm.propertyId||properties.find(pp=>getPropDisplayName(pp)===leaseForm.property)?.id));
                      if(!lp||!leaseForm.roomId)return;
                      const parkVal=pc==="yes"?(leaseForm.parking||"").trim():pc==="no"?"none":"";
                      if(!parkVal)return;
                      const updatedUnits=(lp.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(r=>r.id===leaseForm.roomId?{...r,parking:parkVal}:r)}));
                      const updatedProps=properties.map(p=>p.id===lp.id?{...p,units:updatedUnits}:p);
                      setProperties(updatedProps);
                      setLeaseForm(p=>({...p,_parkingPresetSaved:true}));
                    };
                    const btnBase={padding:"7px 14px",fontSize:11,fontWeight:700,borderRadius:6,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",border:"1px solid"};
                    return(<>
                      <div style={{display:"flex",gap:8,marginTop:4}}>
                        <button onClick={()=>setLeaseForm(p=>({...p,parkingChoice:"yes",_errors:{...(p._errors||{}),parkingChoice:null}}))} style={{...btnBase,flex:1,background:pc==="yes"?"#4a7c59":"transparent",color:pc==="yes"?"#fff":"#6b5e52",borderColor:pc==="yes"?"#4a7c59":leaseForm._errors?.parkingChoice?"#c45c4a":"rgba(0,0,0,.15)"}}>Yes — Assigned Parking</button>
                        <button onClick={()=>setLeaseForm(p=>({...p,parkingChoice:"no",parking:"",_errors:{...(p._errors||{}),parkingChoice:null,parking:null}}))} style={{...btnBase,flex:1,background:pc==="no"?"#6b5e52":"transparent",color:pc==="no"?"#fff":"#6b5e52",borderColor:pc==="no"?"#6b5e52":leaseForm._errors?.parkingChoice?"#c45c4a":"rgba(0,0,0,.15)"}}>No Assigned Parking</button>
                      </div>
                      {leaseForm._errors?.parkingChoice&&<div style={{color:"#c45c4a",fontSize:11,marginTop:4,animation:"shake .4s ease"}}>{leaseForm._errors.parkingChoice}</div>}
                      {pc==="yes"&&<>
                        <input value={leaseForm.parking||""} onChange={e=>setLeaseForm(p=>({...p,parking:e.target.value,_errors:{...(p._errors||{}),parking:null},_parkingPresetSaved:false}))} placeholder="e.g. Space A1, right side of driveway" style={{marginTop:8,animation:leaseForm._errors?.parking?"shake .4s ease":undefined,borderColor:leaseForm._errors?.parking?"#c45c4a":undefined}}/>
                        {leaseForm._errors?.parking&&<div style={{color:"#c45c4a",fontSize:11,marginTop:4,animation:"shake .4s ease"}}>{leaseForm._errors.parking}</div>}
                        {(leaseForm.parking||"").trim()&&leaseForm.roomId&&<button onClick={savePreset} style={{marginTop:6,marginLeft:"auto",padding:"5px 14px",fontSize:10,fontWeight:700,borderRadius:6,cursor:"pointer",fontFamily:"inherit",border:"0.5px solid rgba(74,124,89,.3)",background:leaseForm._parkingPresetSaved?"#4a7c59":"rgba(74,124,89,.06)",color:leaseForm._parkingPresetSaved?"#fff":"#2d6a3f",transition:"all .3s",display:"block"}}>
                          {leaseForm._parkingPresetSaved?"Preset saved":"Save as preset for this room"}
                        </button>}
                      </>}
                      {pc==="no"&&<div style={{marginTop:6,padding:"6px 10px",borderRadius:6,background:"rgba(0,0,0,.03)",border:"0.5px solid rgba(0,0,0,.08)",fontSize:11,color:"#6b5e52"}}>No parking assigned — lease will reflect this.</div>}
                    </>);
                  })()}
                </div>
              </div>
            </div>);
          })()}

          {/* Move-In Package Configuration */}
          {(()=>{
            const rent=leaseForm.rent||0;
            const sd=leaseForm.sd||0;
            const mi=leaseForm.moveIn;
            if(!rent||!mi)return null;
            const miD=new Date(mi+"T00:00:00");
            const day=miD.getDate();
            const calDays=new Date(miD.getFullYear(),miD.getMonth()+1,0).getDate();
            const daysLeft=calDays-day+1;
            const dailyRate=Math.ceil(rent/30);
            const isFirstDay=day===1;
            const proratedAmt=isFirstDay?0:Math.ceil(dailyRate*daysLeft);
            const proMode=leaseForm.prorationMethod||"std";
            const requireLast=leaseForm.requireLastMonth||false;
            const installs=leaseForm.lastMonthInstallments||3;
            const freq=leaseForm.lastMonthFrequency||"monthly";
            const lastInstallAmt=requireLast?Math.ceil(rent/installs):0;
            const lastRemaining=requireLast?rent-lastInstallAmt:0;
            const moveInMonthName=miD.toLocaleString("default",{month:"long"});
            const nextMonthD=new Date(miD.getFullYear(),miD.getMonth()+1,1);
            const nextMonthName=nextMonthD.toLocaleString("default",{month:"long"});
            const firstRentAmt=proMode==="full"?rent:proratedAmt;
            const totalBeforeMoveIn=firstRentAmt+(requireLast?lastInstallAmt:0);
            const grandTotal=sd+totalBeforeMoveIn;
            const miDateLabel=`${miD.toLocaleString("default",{month:"short"})} ${day}`;
            const phases=[
              {
                when:"At signing",sub:"Secures the room",
                color:"#9a7422",bg:"rgba(212,168,83,.07)",border:"rgba(212,168,83,.28)",
                subtotal:sd,
                lines:[{label:"Security deposit",sub:"Refundable · held in escrow",amt:sd}],
              },
              {
                when:`Before ${miDateLabel}`,sub:"Required to receive keys",
                color:"#1d4ed8",bg:"rgba(59,130,246,.055)",border:"rgba(59,130,246,.2)",
                subtotal:totalBeforeMoveIn,
                lines:[
                  {
                    label:proMode==="full"?`Full ${moveInMonthName} rent`:isFirstDay?`${moveInMonthName} rent (full month)`:`Prorated ${moveInMonthName} — ${daysLeft}d`,
                    sub:proMode==="full"?`Prorated ${moveInMonthName} billed ${nextMonthName} 1`:isFirstDay?"Move-in on the 1st":`${fmtS(rent)} / 30 = ${fmtS(dailyRate)}/day × ${daysLeft} days`,
                    amt:firstRentAmt,
                  },
                  ...(requireLast?[{
                    label:`Last month${installs>1?` — 1 of ${installs}`:""}`,
                    sub:installs===1?"Paid in full before move-in":`Remaining ${fmtS(lastRemaining)} over ${installs-1} more ${freq==="monthly"?"month"+(installs-1>1?"s":""):freq==="biweekly"?"bi-weekly periods":"weeks"}`,
                    amt:lastInstallAmt,
                  }]:[]),
                ],
              },
              {
                when:"Ongoing",sub:`Due 1st each month`,
                color:"#4a7c59",bg:"rgba(74,124,89,.055)",border:"rgba(74,124,89,.25)",
                subtotal:rent,perMo:true,
                lines:[{label:"Monthly rent",sub:"Late fee $50 after 3rd · $5/day thereafter",amt:rent}],
              },
            ];
            return(
            <div style={{border:"1px solid rgba(0,0,0,.09)",borderRadius:10,overflow:"hidden",marginBottom:14}}>
              {/* Config block */}
              <div style={{padding:"10px 14px",background:"rgba(0,0,0,.02)",borderBottom:"1px solid rgba(0,0,0,.07)"}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:1.1,color:"#6b5e52",textTransform:"uppercase",marginBottom:10}}>Move-In Package Configuration</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:"#1a1714"}}>Proration method</div>
                    <div style={{fontSize:10,color:"#9a8878",fontFamily:"monospace",marginTop:2}}>
                      {proMode==="std"
                        ?(isFirstDay?"Move-in on the 1st — full month, no proration":`${fmtS(rent)} / 30 = ${fmtS(dailyRate)}/day × ${daysLeft} days = ${fmtS(proratedAmt)}`)
                        :`Full ${fmtS(rent)} now — prorated ${fmtS(proratedAmt)} billed ${nextMonthName} 1`}
                    </div>
                  </div>
                  <div style={{display:"flex",border:"1px solid rgba(0,0,0,.1)",borderRadius:6,overflow:"hidden",flexShrink:0,marginLeft:12}}>
                    {[["std","Prorate move-in"],["full","First month upfront"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setLeaseForm(p=>({...p,prorationMethod:v}))} style={{padding:"5px 12px",fontSize:10,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",background:proMode===v?"#1a1714":"transparent",color:proMode===v?"#d4a853":"#9a8878",transition:"all .15s"}}>{l}</button>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:"1px solid rgba(0,0,0,.05)"}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:"#1a1714"}}>Require last month{"'"}s rent</div>
                    <div style={{fontSize:10,color:"#9a8878"}}>Optional &mdash; use for higher-risk move-ins</div>
                  </div>
                  <button onClick={()=>setLeaseForm(p=>({...p,requireLastMonth:!p.requireLastMonth}))} style={{width:36,height:20,borderRadius:10,border:"none",cursor:"pointer",background:requireLast?"#4a7c59":"#ccc",position:"relative",flexShrink:0,transition:"background .2s",padding:0}}>
                    <div style={{position:"absolute",width:16,height:16,borderRadius:"50%",background:"#fff",top:2,left:requireLast?18:2,transition:"left .2s"}}/>
                  </button>
                </div>
                {requireLast&&<div style={{marginTop:10,padding:"10px 12px",background:"rgba(74,124,89,.06)",borderRadius:8,border:"0.5px solid rgba(74,124,89,.2)"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#2d6a3f",letterSpacing:.8,marginBottom:8,textTransform:"uppercase"}}>Payment Plan — Last Month ({fmtS(rent)})</div>
                  <div style={{display:"flex",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"#6b5e52",marginBottom:4}}>Installments</div>
                      <select value={installs} onChange={e=>setLeaseForm(p=>({...p,lastMonthInstallments:parseInt(e.target.value)}))} style={{width:"100%",padding:"5px 8px",fontSize:11,borderRadius:6,border:"0.5px solid rgba(0,0,0,.1)",fontFamily:"inherit",background:"#fff"}}>
                        {[1,2,3,4,6].map(n=><option key={n} value={n}>{n===1?"Pay in full before move-in":n+" installments"}</option>)}
                      </select>
                    </div>
                    {installs>1&&<div style={{flex:1}}>
                      <div style={{fontSize:10,color:"#6b5e52",marginBottom:4}}>Frequency</div>
                      <select value={freq} onChange={e=>setLeaseForm(p=>({...p,lastMonthFrequency:e.target.value}))} style={{width:"100%",padding:"5px 8px",fontSize:11,borderRadius:6,border:"0.5px solid rgba(0,0,0,.1)",fontFamily:"inherit",background:"#fff"}}>
                        <option value="monthly">Monthly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>}
                  </div>
                  <div style={{fontSize:10,color:"#4a7c59",fontWeight:600,marginTop:6}}>
                    {installs===1?`${fmtS(rent)} due before move-in`:`${fmtS(lastInstallAmt)} first installment — remaining ${fmtS(lastRemaining)} over ${installs-1} more ${freq==="monthly"?"month"+(installs-1>1?"s":""):freq==="biweekly"?"bi-weekly periods":"weeks"}`}
                  </div>
                </div>}
              </div>

              {/* Grand total banner */}
              <div style={{padding:"11px 16px",background:"#1a1714",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.45)",letterSpacing:.8,textTransform:"uppercase",marginBottom:2}}>Total collected — signing + before keys</div>
                  <div style={{fontSize:9.5,color:"rgba(255,255,255,.3)"}}>Security deposit + all pre-move-in charges</div>
                </div>
                <div style={{fontSize:22,fontWeight:800,color:"#d4a853",fontFamily:"monospace",letterSpacing:-1}}>{fmtS(grandTotal)}</div>
              </div>

              {/* 3-column phase breakdown */}
              <div style={{display:"flex",gap:8,padding:"10px 10px 0"}}>
                {phases.map((ph,i)=>(
                  <div key={i} style={{flex:1,border:`1px solid ${ph.border}`,borderRadius:8,overflow:"hidden",background:ph.bg,display:"flex",flexDirection:"column"}}>
                    {/* Phase header */}
                    <div style={{padding:"7px 12px",borderBottom:`1px solid ${ph.border}`}}>
                      <div style={{fontSize:9,fontWeight:800,letterSpacing:.9,textTransform:"uppercase",color:ph.color}}>{ph.when}</div>
                      <div style={{fontSize:9.5,color:"#9a8878",marginTop:1}}>{ph.sub}</div>
                    </div>
                    {/* Line items */}
                    <div style={{flex:1}}>
                      {ph.lines.map((ln,j)=>(
                        <div key={j} style={{padding:"8px 12px",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:11,fontWeight:600,color:"#1a1714",lineHeight:1.3}}>{ln.label}</div>
                              <div style={{fontSize:9,color:"#9a8878",marginTop:2,lineHeight:1.4}}>{ln.sub}</div>
                            </div>
                            <div style={{fontSize:12,fontWeight:700,color:ph.color,fontFamily:"monospace",flexShrink:0,paddingTop:1}}>{fmtS(ln.amt)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Phase subtotal footer */}
                    <div style={{padding:"6px 12px",background:"rgba(255,255,255,.4)",borderTop:`1px solid ${ph.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:9,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.4}}>{ph.perMo?"Recurring":"Subtotal"}</span>
                      <span style={{fontSize:13,fontWeight:800,color:ph.color,fontFamily:"monospace"}}>
                        {fmtS(ph.subtotal)}{ph.perMo&&<span style={{fontSize:9,fontWeight:500,color:"#9a8878"}}>/mo</span>}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Late fee note */}
              <div style={{padding:"6px 14px",background:"rgba(0,0,0,.02)",borderTop:"1px solid rgba(0,0,0,.05)",fontSize:9.5,color:"#9a8878",lineHeight:1.6}}>
                Late fee <strong style={{color:"#c45c4a"}}>$50</strong> after the 3rd &nbsp;&middot;&nbsp; Additional <strong style={{color:"#c45c4a"}}>$5/day</strong> until paid &nbsp;&middot;&nbsp; NSF check <strong style={{color:"#c45c4a"}}>$35</strong>
              </div>
            </div>);
          })()}

          <div className="fld"><label>Internal Notes</label><textarea value={leaseForm.notes||""} onChange={e=>setLeaseForm(p=>({...p,notes:e.target.value}))} placeholder="Notes for your records only — not on the lease" rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/></div>

          {/* Error summary — only appears after clicking Continue, only shows real error messages */}
          {leaseForm._submitAttempted&&leaseForm._errors&&Object.values(leaseForm._errors).filter(v=>!!v).length>0&&(
            <div className="lease-err-summary" style={{background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.25)",borderRadius:8,padding:"10px 14px",marginBottom:4,animation:"shake .4s ease"}}>
              <div style={{fontSize:10,fontWeight:800,color:"#c45c4a",letterSpacing:.5,marginBottom:6,textTransform:"uppercase"}}>Fix these before signing</div>
              {Object.values(leaseForm._errors).filter(v=>!!v).map((msg,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:i<Object.values(leaseForm._errors).filter(v=>!!v).length-1?4:0}}>
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{fontSize:11,color:"#c45c4a",lineHeight:1.4}}>{msg}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mft">
            <button className="btn btn-out" onClick={()=>setLeaseForm(null)}>Cancel</button>
            <button className="btn btn-out" onClick={saveDraft}>Save Draft</button>
            <button className="btn btn-green" style={{flex:1}} onClick={()=>continueToSignAndSend()}>Continue to Sign &amp; Send</button>
          </div>
        </div></div>}

        {/* Sign & Send modal */}
        {modal?.type==="signLease"&&<div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:500}}>
            <h2>Sign & Send Lease</h2>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:16}}>You sign first as property manager, then the tenant receives a link to countersign.</p>

            {settings.savedSignature&&!modal.landlordSig&&(
              <div style={{background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:10,padding:12,marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#2d6a3f",marginBottom:8}}>USE SAVED SIGNATURE</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <img src={settings.savedSignature} alt="Saved sig" style={{maxHeight:50,border:"1px solid rgba(0,0,0,.08)",borderRadius:6,padding:4,background:"#fff"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600}}>Carolina Cooper</div>
                    <div style={{fontSize:10,color:"#6b5e52"}}>Saved signature on file</div>
                  </div>
                  <button className="btn btn-green btn-sm" onClick={()=>{setModal(p=>({...p,landlordSig:settings.savedSignature}));setLeaseSigErr(false);}}>Use This</button>
                </div>
              </div>
            )}

            <div style={{background:"rgba(74,124,89,.06)",borderRadius:10,padding:12,marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#2d6a3f",marginBottom:8}}>
                {modal.landlordSig?"✓ Signature Captured":"Draw Your Signature — "+(modal.lease?.landlordName||"Carolina Cooper")}
              </div>
              {modal.landlordSig
                ?<div>
                  <img src={modal.landlordSig} alt="Your sig" style={{maxHeight:60,maxWidth:"100%",display:"block",marginBottom:8}}/>
                  <button className="btn btn-out btn-sm" onClick={()=>setModal(p=>({...p,landlordSig:null}))}>Re-sign</button>
                </div>
                :<SigCanvas onSave={(data)=>{setModal(p=>({...p,landlordSig:data}));setLeaseSigErr(false);}} height={100}/>
              }
            </div>

            {modal.landlordSig&&<label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,cursor:"pointer",marginBottom:12,padding:"8px 12px",background:"rgba(212,168,83,.06)",borderRadius:8,border:"1px solid rgba(212,168,83,.15)"}}>
              <input type="checkbox" checked={!!modal.saveSignature} onChange={e=>setModal(p=>({...p,saveSignature:e.target.checked}))} style={{width:14,height:14}}/>
              Save this signature for future leases
            </label>}

            {leaseSigErr&&<div style={{color:"#c45c4a",fontSize:12,fontWeight:700,padding:"8px 12px",background:"rgba(196,92,74,.06)",borderRadius:8,marginBottom:12,animation:"shake .4s ease"}}>Please draw your signature before sending.</div>}

            <div className="mft">
              <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={async()=>{
                if(!modal.landlordSig){setLeaseSigErr(true);return;}
                if(modal.saveSignature){setSettings(p=>{const updated={...p,savedSignature:modal.landlordSig};save("hq-settings",updated);return updated;});}
                const now=new Date().toISOString();
                const token=uid()+uid();
                const link=`${settings.siteUrl||"https://rentblackbear.vercel.app"}/lease?token=${token}`;
                setLeases(p=>{const updated=p.map(l=>l.id===modal.leaseId?{...l,status:"pending_tenant",landlordSignature:modal.landlordSig,landlordSignedAt:now,signingToken:token,signingLink:link}:l);patchLease(modal.leaseId,{status:"pending_tenant",landlord_sig:modal.landlordSig,landlord_signed_at:now,signing_token:token,signing_link:link});return updated;});
                // Generate move-in charges now that lease is signed and sent
                const lease=modal.lease||{};
                const mi=lease.moveIn||"";
                const rent=lease.rent||0;
                const sd=lease.sd||0;
                const proMode=lease.prorationMethod||"std";
                const requireLast=lease.requireLastMonth||false;
                const lastInstalls=lease.lastMonthInstallments||1;
                const lastFreq=lease.lastMonthFrequency||"monthly";
                const miD=mi?new Date(mi+"T00:00:00"):null;
                const day=miD?miD.getDate():1;
                const daysLeft=miD?new Date(miD.getFullYear(),miD.getMonth()+1,0).getDate()-day+1:0;
                const proratedAmt=day===1?0:Math.ceil((rent/30)*daysLeft);
                const lastInstallAmt=requireLast?Math.ceil(rent/lastInstalls):0;
                const newCharges=[];
                // Security deposit — due today (day PM signs, to secure the room)
                if(sd>0)newCharges.push({id:uid(),tenantName:lease.tenantName,roomId:lease.roomId||"",category:"Security Deposit",desc:"Security deposit — secures the room",amount:sd,dueDate:now.split("T")[0],amountPaid:0,status:"unpaid",leaseId:modal.leaseId,createdAt:now});
                // First payment — generated now but due on move-in date (tenant must pay before keys)
                const nextMonthD=miD?new Date(miD.getFullYear(),miD.getMonth()+1,1):null;
                const nextMonthStr=nextMonthD?nextMonthD.toISOString().split("T")[0]:TODAY.toISOString().split("T")[0];
                if(proMode==="full"&&!day===1){
                  newCharges.push({id:uid(),tenantName:lease.tenantName,roomId:lease.roomId||"",category:"Rent",desc:`First month's rent (covers ${nextMonthD?nextMonthD.toLocaleString("default",{month:"long"}):"next month"})`,amount:rent,dueDate:mi,amountPaid:0,status:"unpaid",leaseId:modal.leaseId,createdAt:now});
                  if(proratedAmt>0)newCharges.push({id:uid(),tenantName:lease.tenantName,roomId:lease.roomId||"",category:"Rent",desc:`Prorated rent — ${daysLeft} days`,amount:proratedAmt,dueDate:nextMonthStr,amountPaid:0,status:"unpaid",leaseId:modal.leaseId,createdAt:now});
                } else {
                  const firstAmt=day===1?rent:proratedAmt;
                  if(firstAmt>0)newCharges.push({id:uid(),tenantName:lease.tenantName,roomId:lease.roomId||"",category:"Rent",desc:day===1?"First month's rent":`Prorated rent — ${daysLeft} days`,amount:firstAmt,dueDate:mi,amountPaid:0,status:"unpaid",leaseId:modal.leaseId,createdAt:now});
                }
                // Last month installments
                if(requireLast&&lastInstallAmt>0){
                  for(let i=0;i<lastInstalls;i++){
                    let dueD=miD?new Date(miD):new Date();
                    if(i>0){
                      if(lastFreq==="monthly"){dueD=new Date(miD.getFullYear(),miD.getMonth()+i,1);}
                      else if(lastFreq==="biweekly"){dueD=new Date(miD);dueD.setDate(dueD.getDate()+14*i);}
                      else{dueD=new Date(miD);dueD.setDate(dueD.getDate()+7*i);}
                    }
                    newCharges.push({id:uid(),tenantName:lease.tenantName,roomId:lease.roomId||"",category:"Rent",desc:`Last month's rent — installment ${i+1} of ${lastInstalls}`,amount:lastInstallAmt,dueDate:dueD.toISOString().split("T")[0],amountPaid:0,status:"unpaid",leaseId:modal.leaseId,createdAt:now});
                  }
                }
                if(newCharges.length>0){setCharges(p=>{const updated=[...p,...newCharges];save("hq-charges",updated);return updated;});}
                setNotifs(p=>[{id:uid(),type:"lease",msg:`Lease signed and sent to ${modal.lease.tenantEmail} — ${modal.lease.tenantName}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
                setModal({type:"leaseSent",lease:modal.lease,link});
              }}>{"Sign & Send to Tenant"}</button>
            </div>
          </div></div>}

        {/* Lease sent confirmation */}
        {modal?.type==="leaseSent"&&<div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480,textAlign:"center"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(74,124,89,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <h2>Lease Sent!</h2>
          <p style={{fontSize:13,color:"#5c4a3a",margin:"12px 0 20px",lineHeight:1.6}}>
            The lease has been signed by you and a unique signing link has been generated for {modal.lease?.tenantEmail||"the tenant"}.
          </p>
          <div style={{background:"rgba(0,0,0,.03)",borderRadius:8,padding:"10px 14px",fontSize:11,color:"#5c4a3a",wordBreak:"break-all",marginBottom:16,textAlign:"left"}}>
            <div style={{fontSize:9,fontWeight:700,color:"#6b5e52",marginBottom:4}}>TENANT SIGNING LINK</div>
            {modal.link}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button className="btn btn-out" onClick={()=>{navigator.clipboard.writeText(modal.link||"");showAlert({title:"Copied",body:"Link copied to clipboard."});}}>Copy Link</button>
            <button className="btn btn-gold" onClick={()=>setModal(null)}>Done</button>
          </div>
        </div></div>}
  </>);
}
