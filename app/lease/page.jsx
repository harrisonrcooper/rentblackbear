"use client";
import { useState, useEffect, useRef } from "react";

// ── Supabase ─────────────────────────────────────────────────────────
const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa=(path,opts={})=>fetch(SUPA_URL+"/rest/v1/"+path,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});

// ── Helpers ───────────────────────────────────────────────────────────
const fmtD=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;};
const fmtS=n=>"$"+Number(n).toLocaleString();

const fillVars=(html,data)=>{
  if(!html)return"";
  let out=html;
  Object.entries(data).forEach(([k,v])=>{
    out=out.replaceAll("{{"+k+"}}",`<strong>${v||""}</strong>`);
  });
  // Highlight any unfilled variables
  out=out.replace(/\{\{([A-Z_]+)\}\}/g,'<span style="background:#fee2e2;color:#c45c4a;border-radius:3px;padding:0 3px;font-weight:700">{{$1}}</span>');
  return out;
};

// ── Signature canvas ──────────────────────────────────────────────────
function SigCanvas({onSave,height=140,label="Draw your signature"}){
  const canvasRef=useRef(null);
  const drawing=useRef(false);
  const getPos=(e,canvas)=>{const r=canvas.getBoundingClientRect();if(e.touches)return{x:e.touches[0].clientX-r.left,y:e.touches[0].clientY-r.top};return{x:e.clientX-r.left,y:e.clientY-r.top};};
  const start=(e)=>{e.preventDefault();drawing.current=true;const canvas=canvasRef.current;const ctx=canvas.getContext("2d");const pos=getPos(e,canvas);ctx.beginPath();ctx.moveTo(pos.x,pos.y);};
  const move=(e)=>{e.preventDefault();if(!drawing.current)return;const canvas=canvasRef.current;const ctx=canvas.getContext("2d");const pos=getPos(e,canvas);ctx.strokeStyle="#1a1714";ctx.lineWidth=2;ctx.lineCap="round";ctx.lineJoin="round";ctx.lineTo(pos.x,pos.y);ctx.stroke();};
  const end=(e)=>{e.preventDefault();drawing.current=false;if(onSave)onSave(canvasRef.current.toDataURL());};
  const clear=()=>{const canvas=canvasRef.current;const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);if(onSave)onSave(null);};
  return(
    <div>
      <div style={{fontSize:11,color:"#6b5e52",marginBottom:6,fontWeight:600}}>{label}</div>
      <canvas ref={canvasRef} width={600} height={height}
        style={{border:"1.5px solid rgba(0,0,0,.15)",borderRadius:8,cursor:"crosshair",touchAction:"none",width:"100%",height,display:"block",background:"#fafaf8"}}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}/>
      <button onClick={clear} style={{marginTop:6,fontSize:10,color:"#6b5e52",background:"none",border:"1px solid rgba(0,0,0,.1)",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>Clear</button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function LeasePage(){
  const [lease,setLease]=useState(null);
  const [template,setTemplate]=useState(null);
  const [status,setStatus]=useState("loading");// loading | ready | already_signed | not_found | error | submitted
  const [signature,setSignature]=useState(null);
  const [sigError,setSigError]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [scrolledToBottom,setScrolledToBottom]=useState(false);
  const docRef=useRef(null);

  // ── Load lease by token ─────────────────────────────────────────────
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const token=params.get("token");
    if(!token){setStatus("not_found");return;}
    (async()=>{
      try{
        const r=await supa("lease_instances?signing_token=eq."+token+"&select=*");
        const rows=await r.json();
        if(!rows||rows.length===0){setStatus("not_found");return;}
        const row=rows[0];
        if(row.status==="executed"){setStatus("already_signed");setLease(row.variable_data||{});return;}
        if(row.status!=="pending_tenant"){setStatus("not_found");return;}
        setLease({...row.variable_data,id:row.id,landlordSig:row.landlord_sig,landlordSignedAt:row.landlord_signed_at});
        // Load template
        const tr=await supa("lease_templates?id=eq."+row.template_id+"&select=sections,name,landlordName,company");
        const td=await tr.json();
        if(td&&td.length>0)setTemplate(td[0]);
        setStatus("ready");
      }catch(e){console.error(e);setStatus("error");}
    })();
  },[]);

  // ── Track scroll to bottom ──────────────────────────────────────────
  useEffect(()=>{
    const el=docRef.current;
    if(!el)return;
    const handler=()=>{
      if(el.scrollTop+el.clientHeight>=el.scrollHeight-40)setScrolledToBottom(true);
    };
    el.addEventListener("scroll",handler);
    return()=>el.removeEventListener("scroll",handler);
  },[status]);

  // ── Submit signing ──────────────────────────────────────────────────
  const submit=async()=>{
    if(!signature){setSigError(true);return;}
    setSigError(false);
    setSubmitting(true);
    try{
      const now=new Date().toISOString();
      const auditEntry={action:"tenant_signed",timestamp:now,ip:"client",userAgent:navigator.userAgent};
      await supa("lease_instances?id=eq."+lease.id,{
        method:"PATCH",
        prefer:"resolution=merge-duplicates",
        body:JSON.stringify({
          status:"executed",
          tenant_sig:signature,
          tenant_signed_at:now,
          audit_trail:[auditEntry],
          updated_at:now,
        })
      });
      setStatus("submitted");
    }catch(e){
      console.error(e);
      alert("Something went wrong. Please try again or contact your property manager.");
    }
    setSubmitting(false);
  };

  // ── Build variable data for filling ────────────────────────────────
  const varData=lease?{
    TENANT_NAME:lease.tenantName||"",
    MONTHLY_RENT:lease.rent?Number(lease.rent).toLocaleString():"",
    RENT_WORDS:lease.rentWords||"",
    SECURITY_DEPOSIT:lease.sd?Number(lease.sd).toLocaleString():"",
    LEASE_START:fmtD(lease.leaseStart||lease.moveIn),
    LEASE_END:fmtD(lease.leaseEnd),
    MOVE_IN_DATE:fmtD(lease.moveIn),
    PROPERTY_ADDRESS:lease.propertyAddress||lease.property||"",
    ROOM_NAME:lease.room||"",
    DOOR_CODE:lease.doorCode||"",
    UTILITIES_CLAUSE:lease.utilitiesClause||"",
    LANDLORD_NAME:lease.landlordName||"Carolina Cooper",
    PARKING_SPACE:lease.parking||"No assigned parking",
    DAILY_RATE:lease.rent?Math.ceil(Number(lease.rent)/30):"",
    PRORATED_RENT:lease.proratedRent?Number(lease.proratedRent).toLocaleString():"",
  }:{};

  const sections=template?.sections||[];
  const activeSections=sections.filter(s=>s.active!==false);

  // ── Render states ───────────────────────────────────────────────────
  if(status==="loading") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:"#f4f3f0"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:40,height:40,border:"3px solid #d4a853",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px"}}/>
        <div style={{fontSize:13,color:"#6b5e52"}}>Loading your lease...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if(status==="not_found") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:"#f4f3f0",padding:24}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:32,marginBottom:12}}>🔍</div>
        <h2 style={{fontSize:18,fontWeight:700,color:"#1a1714",marginBottom:8}}>Lease Not Found</h2>
        <p style={{fontSize:13,color:"#6b5e52",lineHeight:1.6}}>This signing link is invalid or has expired. Please contact your property manager for a new link.</p>
      </div>
    </div>
  );

  if(status==="already_signed") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:"#f4f3f0",padding:24}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(74,124,89,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{fontSize:18,fontWeight:700,color:"#1a1714",marginBottom:8}}>Already Signed</h2>
        <p style={{fontSize:13,color:"#6b5e52",lineHeight:1.6}}>This lease has already been signed. Your executed copy is available in your tenant portal.</p>
      </div>
    </div>
  );

  if(status==="submitted") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:"#f4f3f0",padding:24}}>
      <div style={{textAlign:"center",maxWidth:480}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(74,124,89,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
          <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 style={{fontSize:24,fontWeight:700,color:"#1a1714",marginBottom:12}}>Lease Signed!</h1>
        <p style={{fontSize:14,color:"#5c4a3a",lineHeight:1.7,marginBottom:8}}>
          Welcome to <strong>{template?.company||"Black Bear Rentals"}</strong>. Your lease has been fully executed and a copy has been sent to your email.
        </p>
        <p style={{fontSize:13,color:"#6b5e52",lineHeight:1.6}}>
          You can view your signed lease anytime in your tenant portal at <strong>rentblackbear.com</strong>.
        </p>
        <div style={{marginTop:24,padding:"14px 20px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:10,fontSize:12,color:"#2d6a3f",lineHeight:1.6}}>
          Your move-in date is <strong>{fmtD(lease?.moveIn)}</strong>. Your door code is <strong>{lease?.doorCode}</strong>.
        </div>
      </div>
    </div>
  );

  if(status==="error") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:"#f4f3f0",padding:24}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <h2 style={{fontSize:18,fontWeight:700,color:"#c45c4a",marginBottom:8}}>Something Went Wrong</h2>
        <p style={{fontSize:13,color:"#6b5e52"}}>Please try refreshing the page or contact your property manager.</p>
      </div>
    </div>
  );

  // ── Main signing view ───────────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:"#f4f3f0",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>

      {/* Header */}
      <div style={{background:"#1a1714",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#d4a853"}}>{template?.company||"Black Bear Rentals"}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:2}}>Residential Lease Agreement — Please review and sign</div>
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.4)",textAlign:"right"}}>
          <div>Secure signing</div>
          <div style={{marginTop:2,display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            SSL Encrypted
          </div>
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"24px 16px 60px"}}>

        {/* Summary block */}
        <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.08)",marginBottom:20,overflow:"hidden"}}>
          <div style={{padding:"12px 20px",background:"#1a1714",display:"flex",alignItems:"center",gap:10}}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span style={{fontSize:11,fontWeight:700,color:"#d4a853",textTransform:"uppercase",letterSpacing:.8}}>Your Lease Summary</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
            {[
              ["Tenant",lease?.tenantName||""],
              ["Property",lease?.propertyAddress||lease?.property||""],
              ["Room / Unit",lease?.room||""],
              ["Monthly Rent",lease?.rent?fmtS(lease.rent):""],
              ["Security Deposit",lease?.sd?fmtS(lease.sd):""],
              ["Move-In Date",fmtD(lease?.moveIn)],
              ["Lease End",fmtD(lease?.leaseEnd)],
              ["Door Code",lease?.doorCode||""],
            ].map(([label,value],i)=>(
              <div key={label} style={{padding:"10px 20px",borderBottom:i<6?"1px solid rgba(0,0,0,.05)":"none",borderRight:i%2===0?"1px solid rgba(0,0,0,.05)":"none",background:i%4<2?"#fff":"rgba(0,0,0,.01)"}}>
                <div style={{fontSize:9,fontWeight:700,color:"#9a8878",textTransform:"uppercase",letterSpacing:.6,marginBottom:3}}>{label}</div>
                <div style={{fontSize:13,fontWeight:600,color:"#1a1714"}}>{value||"—"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div style={{padding:"12px 16px",background:"rgba(212,168,83,.08)",border:"1px solid rgba(212,168,83,.25)",borderRadius:10,marginBottom:20,fontSize:12,color:"#9a7422",lineHeight:1.6}}>
          <strong>Please read your entire lease before signing.</strong> Your signature at the bottom will serve as your initials for all sections marked with an initials line. Make sure you understand and agree to all terms before proceeding.
        </div>

        {/* Lease document */}
        <div ref={docRef} style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.08)",padding:"32px 40px",marginBottom:20,maxHeight:"70vh",overflowY:"auto"}}>

          {/* Document header */}
          <div style={{textAlign:"center",marginBottom:32,paddingBottom:24,borderBottom:"2px solid #1a1714"}}>
            <div style={{fontSize:20,fontWeight:700,color:"#1a1714",fontFamily:"Georgia,serif",marginBottom:4}}>{template?.company||"Black Bear Rentals"}</div>
            <div style={{fontSize:12,color:"#6b5e52",textTransform:"uppercase",letterSpacing:1}}>Residential Co-Living Lease Agreement</div>
            <div style={{fontSize:11,color:"#9a8878",marginTop:4}}>Agreement Date: {fmtD(new Date().toISOString().split("T")[0])}</div>
          </div>

          {/* Parties */}
          <div style={{display:"flex",gap:16,marginBottom:28}}>
            <div style={{flex:1,padding:"12px 16px",background:"rgba(0,0,0,.02)",borderRadius:8,border:"0.5px solid rgba(0,0,0,.08)"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Property Manager</div>
              <div style={{fontSize:13,fontWeight:600,color:"#1a1714"}}>{template?.landlordName||lease?.landlordName||"Carolina Cooper"}</div>
              <div style={{fontSize:11,color:"#6b5e52"}}>{template?.company||"Black Bear Rentals"}</div>
            </div>
            <div style={{flex:1,padding:"12px 16px",background:"rgba(0,0,0,.02)",borderRadius:8,border:"0.5px solid rgba(0,0,0,.08)"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Resident</div>
              <div style={{fontSize:13,fontWeight:600,color:"#1a1714"}}>{lease?.tenantName||""}</div>
              <div style={{fontSize:11,color:"#6b5e52"}}>{lease?.propertyAddress||""} · {lease?.room||""}</div>
            </div>
          </div>

          {/* Sections */}
          {activeSections.map((sec,i)=>(
            <div key={sec.id} style={{marginBottom:28}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"#1a1714",color:"#d4a853",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"Georgia,serif"}}>{i+1}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#1a1714",fontFamily:"Georgia,serif",textTransform:"uppercase",letterSpacing:.3}}>{sec.title}</div>
              </div>
              <div style={{paddingLeft:34,fontSize:12,lineHeight:1.85,color:"#2c2420",fontFamily:"Georgia,serif"}}
                dangerouslySetInnerHTML={{__html:fillVars(sec.content,varData)}}/>
              {sec.requiresInitials&&(
                <div style={{paddingLeft:34,marginTop:14,display:"flex",alignItems:"center",gap:20}}>
                  {signature
                    ?<div style={{display:"flex",alignItems:"center",gap:10,padding:"6px 14px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8}}>
                       <img src={signature} alt="initials" style={{height:28,maxWidth:80,objectFit:"contain"}}/>
                       <span style={{fontSize:10,color:"#4a7c59",fontWeight:600}}>Initialed</span>
                     </div>
                    :<div style={{display:"flex",alignItems:"center",gap:8}}>
                       <div style={{width:80,borderBottom:"1px solid #1a1714",height:24,display:"flex",alignItems:"flex-end",paddingBottom:2}}>
                         <span style={{fontSize:9,color:"#bbb"}}>Resident</span>
                       </div>
                       <span style={{fontSize:10,color:"#9a8878"}}>— sign below to initial all sections</span>
                     </div>
                  }
                </div>
              )}
              {i<activeSections.length-1&&<div style={{marginTop:20,borderBottom:"0.5px solid rgba(0,0,0,.07)"}}/>}
            </div>
          ))}

          {/* Page footer */}
          <div style={{marginTop:32,paddingTop:16,borderTop:"1px solid rgba(0,0,0,.08)",textAlign:"center",fontSize:10,color:"#bbb",fontFamily:"Georgia,serif"}}>
            {template?.company||"Black Bear Rentals"} — Alabama Residential Co-Living Lease Agreement
          </div>
        </div>

        {/* Scroll prompt */}
        {!scrolledToBottom&&(
          <div style={{textAlign:"center",marginBottom:16,fontSize:11,color:"#9a8878",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            Scroll through the full lease above before signing
          </div>
        )}

        {/* Landlord signature block */}
        <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.08)",padding:20,marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:12}}>Property Manager Signature</div>
          {lease?.landlordSig
            ?<div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"rgba(74,124,89,.05)",border:"1px solid rgba(74,124,89,.15)",borderRadius:8}}>
               <img src={lease.landlordSig} alt="PM signature" style={{height:40,maxWidth:160,objectFit:"contain"}}/>
               <div>
                 <div style={{fontSize:11,fontWeight:600,color:"#2d6a3f"}}>{template?.landlordName||"Carolina Cooper"}</div>
                 <div style={{fontSize:10,color:"#6b5e52"}}>Signed {fmtD(lease?.landlordSignedAt?.split("T")[0])}</div>
               </div>
            </div>
            :<div style={{fontSize:11,color:"#9a8878",fontStyle:"italic"}}>Property manager signature pending</div>
          }
        </div>

        {/* Tenant signature block */}
        <div style={{background:"#fff",borderRadius:12,border:`2px solid ${sigError?"#c45c4a":"rgba(0,0,0,.08)"}`,padding:24,marginBottom:20,transition:"border-color .2s"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Your Signature</div>
          <div style={{fontSize:11,color:"#9a8878",marginBottom:16,lineHeight:1.5}}>
            By signing below, you confirm that you have read, understand, and agree to all terms of this lease agreement. Your signature will also serve as your initials on all sections above.
          </div>
          {signature
            ?<div>
               <div style={{padding:"10px 14px",background:"rgba(74,124,89,.05)",border:"1px solid rgba(74,124,89,.15)",borderRadius:8,display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                 <img src={signature} alt="Your signature" style={{height:50,maxWidth:200,objectFit:"contain"}}/>
                 <div>
                   <div style={{fontSize:11,fontWeight:600,color:"#2d6a3f"}}>{lease?.tenantName||"Resident"}</div>
                   <div style={{fontSize:10,color:"#6b5e52"}}>Signature captured</div>
                 </div>
               </div>
               <button onClick={()=>setSignature(null)} style={{fontSize:10,color:"#6b5e52",background:"none",border:"1px solid rgba(0,0,0,.1)",borderRadius:5,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>Re-draw Signature</button>
             </div>
            :<SigCanvas onSave={setSignature} height={140} label="Draw your full signature here"/>
          }
          {sigError&&<div style={{marginTop:10,fontSize:11,color:"#c45c4a",fontWeight:600,animation:"shake .4s ease"}}>Please draw your signature before submitting.</div>}
        </div>

        {/* Legal acknowledgment */}
        <div style={{fontSize:11,color:"#9a8878",lineHeight:1.6,marginBottom:20,padding:"12px 16px",background:"rgba(0,0,0,.02)",borderRadius:8,border:"0.5px solid rgba(0,0,0,.06)"}}>
          By clicking "Sign Lease Agreement" below, you acknowledge that your electronic signature is legally binding and has the same force and effect as a handwritten signature, in accordance with the Electronic Signatures in Global and National Commerce Act (E-SIGN Act).
        </div>

        {/* Submit button */}
        <button onClick={submit} disabled={submitting}
          style={{width:"100%",padding:"16px 24px",fontSize:15,fontWeight:700,background:submitting?"#ccc":"#1a1714",color:submitting?"#999":"#d4a853",border:"none",borderRadius:10,cursor:submitting?"not-allowed":"pointer",fontFamily:"inherit",letterSpacing:.3,transition:"all .2s"}}>
          {submitting?"Submitting...":"Sign Lease Agreement"}
        </button>

        <div style={{textAlign:"center",marginTop:12,fontSize:10,color:"#bbb"}}>
          Having trouble? Contact {lease?.landlordName||"your property manager"} at blackbearhousing@gmail.com
        </div>
      </div>

      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        *{box-sizing:border-box}
        body{margin:0}
      `}</style>
    </div>
  );
}
