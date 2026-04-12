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
  const end=(e)=>{e.preventDefault();drawing.current=false;};
  const clear=()=>{const canvas=canvasRef.current;const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);if(onSave)onSave(null);};
  const save=()=>{if(onSave)onSave(canvasRef.current.toDataURL());};
  // Sync canvas internal resolution with displayed CSS size
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const sync=()=>{canvas.width=canvas.clientWidth;canvas.height=canvas.clientHeight;};
    sync();
    const ro=new ResizeObserver(sync);ro.observe(canvas);
    return()=>ro.disconnect();
  },[]);
  return(
    <div>
      <div style={{fontSize:11,color:"#6b5e52",marginBottom:6,fontWeight:600}}>{label}</div>
      <canvas ref={canvasRef}
        style={{border:"1.5px solid rgba(0,0,0,.15)",borderRadius:8,cursor:"crosshair",touchAction:"none",width:"100%",height,display:"block",background:"#fafaf8"}}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}/>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button onClick={clear} style={{fontSize:11,color:"#6b5e52",background:"none",border:"1px solid rgba(0,0,0,.1)",borderRadius:6,padding:"10px 16px",minHeight:44,cursor:"pointer",fontFamily:"inherit"}}>Clear</button>
        <button onClick={save} style={{fontSize:11,fontWeight:700,color:"#fff",background:"#4a7c59",border:"none",borderRadius:6,padding:"10px 16px",minHeight:44,cursor:"pointer",fontFamily:"inherit"}}>Save Signature</button>
      </div>
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
  const [signingStarted,setSigningStarted]=useState(false);
  const [initialedSecs,setInitialedSecs]=useState(new Set());
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
        // Load template — only select columns that exist in the schema
        try{
          const tr=await supa("lease_templates?id=eq."+row.template_id+"&select=sections,name");
          const td=await tr.json();
          if(td&&td.length>0)setTemplate(td[0]);
        }catch(te){console.error("Template load error:",te);}
        setStatus("ready");
      }catch(e){console.error(e);setStatus("error");}
    })();
  },[]);

  // ── Track scroll to bottom ──────────────────────────────────────────
  useEffect(()=>{
    if(status!=="ready")return;
    const handler=()=>{
      const scrolled=window.scrollY+window.innerHeight;
      const docBottom=docRef.current?docRef.current.getBoundingClientRect().bottom+window.scrollY:0;
      if(scrolled>=docBottom-60)setScrolledToBottom(true);
    };
    window.addEventListener("scroll",handler);
    return()=>window.removeEventListener("scroll",handler);
  },[status]);

  // ── Submit signing ──────────────────────────────────────────────────
  const submit=async()=>{
    const requiredSecs=activeSections.filter(s=>s.requiresInitials);
    const allInitialed=requiredSecs.every(s=>initialedSecs.has(s.id));
    if(!signature||!allInitialed){setSigError(true);return;}
    setSigError(false);
    setSubmitting(true);
    try{
      const now=new Date().toISOString();
      const patchRes=await supa("lease_instances?id=eq."+lease.id,{
        method:"PATCH",
        prefer:"resolution=merge-duplicates",
        body:JSON.stringify({
          status:"executed",
          tenant_sig:signature,
          tenant_signed_at:now,
          updated_at:now,
        })
      });
      if(!patchRes.ok){
        const err=await patchRes.text();
        console.error("PATCH failed:",patchRes.status,err);
        throw new Error("Failed to save signature: "+err);
      }
      // Verify signature was saved — guard against silent data loss
      const verify=await supa("lease_instances?id=eq."+lease.id+"&select=tenant_sig");
      const vRows=await verify.json();
      if(!vRows?.[0]?.tenant_sig){
        console.error("Signature verification failed — tenant_sig is null after PATCH");
        throw new Error("Signature was not saved. Please try again.");
      }

      // Send confirmation emails
      const moveInFmt=lease.moveIn?new Date(lease.moveIn+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}):"";
      const rentFmt=lease.rent?"$"+Number(lease.rent).toLocaleString():"";
      const tenantHtml=`<div style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;background:#f4f3f0;padding:32px 16px">
        <div style="background:#1a1714;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center">
          <div style="font-size:20px;font-weight:700;color:#d4a853">${template?.company||"Property Manager"}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.5);margin-top:4px;text-transform:uppercase;letter-spacing:1px">Lease Fully Executed</div>
        </div>
        <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(0,0,0,.08);border-top:none">
          <p style="font-size:15px;font-weight:600;color:#1a1714;margin:0 0 16px">Welcome, ${lease.tenantName||"Resident"}!</p>
          <p style="font-size:13px;color:#5c4a3a;line-height:1.7;margin:0 0 20px">Your lease has been fully executed. Both parties have signed and your agreement is now in effect.</p>
          <div style="background:#f4f3f0;border-radius:8px;padding:16px 20px;margin-bottom:24px">
            <div style="font-size:11px;font-weight:700;color:#6b5e52;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Your Details</div>
            <div style="font-size:13px;color:#1a1714;line-height:2.2">
              <strong>Property:</strong> ${lease.propertyAddress||lease.property||""}<br/>
              <strong>Room:</strong> ${lease.room||""}<br/>
              <strong>Move-In:</strong> ${moveInFmt}<br/>
              <strong>Monthly Rent:</strong> ${rentFmt}<br/>
              <strong>Door Code:</strong> ${lease.doorCode||""}
            </div>
          </div>
          <div style="background:rgba(74,124,89,.06);border:1px solid rgba(74,124,89,.2);border-radius:8px;padding:14px 20px;font-size:12px;color:#2d6a3f;line-height:1.6">
            You can view your signed lease and manage payments anytime in your tenant portal.
          </div>
        </div>
        <p style="text-align:center;font-size:10px;color:#9a8878;margin-top:16px">${template?.company||""}</p>
      </div>`;

      // Email tenant
      if(lease.tenantEmail){
        await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({to:lease.tenantEmail,subject:`Your Lease is Fully Executed — ${template?.company||""}`,fromName:`${template?.landlordName||"Property Manager"} | ${template?.company||""}`,replyTo:template?.landlordEmail||"",html:tenantHtml})});
      }
      // Email PM
      await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({to:template?.landlordEmail||"",subject:`Lease Signed — ${lease.tenantName||"Tenant"} · ${lease.room||""}`,fromName:"PropOS Notifications",replyTo:lease.tenantEmail||"",
          html:`<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#1a1714;margin-bottom:8px">Lease Fully Executed</h2>
            <p style="color:#5c4a3a;font-size:13px;line-height:1.6"><strong>${lease.tenantName||"Tenant"}</strong> has signed their lease for <strong>${lease.room||""}</strong> at <strong>${lease.propertyAddress||lease.property||""}</strong>.</p>
            <p style="color:#5c4a3a;font-size:13px">Move-in: <strong>${moveInFmt}</strong> · Rent: <strong>${rentFmt}</strong></p>
            <p style="font-size:12px;color:#9a8878;margin-top:16px">View in PropOS admin at rentblackbear.com/admin</p>
          </div>`})});

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
    LANDLORD_NAME:lease.landlordName||template?.landlordName||"",
    PARKING_SPACE:lease.parking||"No assigned parking",
    DAILY_RATE:lease.rent?Math.ceil(Number(lease.rent)/30):"",
    PRORATED_RENT:lease.proratedRent?Number(lease.proratedRent).toLocaleString():"",
  }:{};

  // Executed leases use stored snapshot — template edits must never affect signed leases
  const sections=(lease?.status==="executed"&&lease?.sections?.length) ? lease.sections : (template?.sections||[]);
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
          Welcome to <strong>{template?.company||""}</strong>. Your lease has been fully executed and a copy has been sent to your email.
        </p>
        <p style={{fontSize:13,color:"#6b5e52",lineHeight:1.6}}>
          You can view your signed lease anytime in your tenant portal.
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
          <div style={{fontSize:14,fontWeight:700,color:"#d4a853"}}>{template?.company||""}</div>
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

        {/* Instructions banner */}
        <div style={{padding:"14px 20px",background:"rgba(212,168,83,.08)",border:"1px solid rgba(212,168,83,.25)",borderRadius:10,marginBottom:16,fontSize:14,color:"#9a7422",lineHeight:1.7}}>
          <strong>Please read your entire lease before signing.</strong> Your signature at the bottom will serve as your initials for all sections marked with an initials line. Make sure you understand and agree to all terms before proceeding.
        </div>

        {/* Lease document */}
        <div ref={docRef} style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.08)",padding:"32px clamp(16px, 4vw, 40px)",marginBottom:20}}>

          {/* Document header */}
          <div style={{textAlign:"center",marginBottom:32,paddingBottom:24,borderBottom:"2px solid #1a1714"}}>
            <div style={{fontSize:20,fontWeight:700,color:"#1a1714",fontFamily:"Georgia,serif",marginBottom:4}}>{template?.company||""}</div>
            <div style={{fontSize:12,color:"#6b5e52",textTransform:"uppercase",letterSpacing:1}}>Residential Co-Living Lease Agreement</div>
            <div style={{fontSize:11,color:"#9a8878",marginTop:4}}>Agreement Date: {fmtD(new Date().toISOString().split("T")[0])}</div>
          </div>

          {/* Parties */}
          <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:28}}>
            <div style={{flex:"1 1 250px",padding:"12px 16px",background:"rgba(0,0,0,.02)",borderRadius:8,border:"0.5px solid rgba(0,0,0,.08)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Property Manager</div>
              <div style={{fontSize:13,fontWeight:600,color:"#1a1714"}}>{template?.landlordName||lease?.landlordName||""}</div>
              <div style={{fontSize:11,color:"#6b5e52"}}>{template?.company||""}</div>
            </div>
            <div style={{flex:"1 1 250px",padding:"12px 16px",background:"rgba(0,0,0,.02)",borderRadius:8,border:"0.5px solid rgba(0,0,0,.08)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Resident</div>
              <div style={{fontSize:13,fontWeight:600,color:"#1a1714"}}>{lease?.tenantName||""}</div>
              <div style={{fontSize:11,color:"#6b5e52"}}>{lease?.propertyAddress||""} · {lease?.room||""}</div>
            </div>
          </div>

          {/* Sections */}
          {/* Summary of Key Terms — Page 1 */}
          <div style={{marginBottom:32,border:"1px solid rgba(0,0,0,.1)",borderRadius:8,overflow:"hidden"}}>
            <div style={{padding:"10px 16px",background:"#1a1714",display:"flex",alignItems:"center",gap:8}}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span style={{fontSize:10,fontWeight:700,color:"#d4a853",textTransform:"uppercase",letterSpacing:1}}>Your Lease Summary</span>
            </div>
            <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <tbody>
                {[
                  ["Tenant",lease?.tenantName||"—",""],
                  ["Property Address",lease?.propertyAddress||lease?.property||"—","Section 1"],
                  ["Room / Unit",lease?.room||"—","Section 1"],
                  ["Lease Start Date",varData.LEASE_START||"—","Section 2"],
                  ["Lease End Date",varData.LEASE_END||"—","Section 2"],
                  ["Monthly Rent",lease?.rent?"$"+Number(lease.rent).toLocaleString()+".00":"—","Section 3"],
                  ["Security Deposit",lease?.sd?"$"+Number(lease.sd).toLocaleString()+".00":"—","Section 4"],
                  ["Prorated First Month",lease?.proratedRent&&lease.proratedRent>0?"$"+Number(lease.proratedRent).toLocaleString()+".00":"N/A","Section 3"],
                  ["Late Fee","$50 after the 3rd · $5/day thereafter","Section 5"],
                  ["Door Code",lease?.doorCode||"—","Section 13"],
                  ["Parking",lease?.parking||"No assigned parking","Section 9"],
                  ["Utilities",lease?.utilitiesClause?"See Section 6":"—","Section 6"],
                ].map(([label,value,ref],i)=>(
                  <tr key={label} style={{borderBottom:i<11?"1px solid rgba(0,0,0,.05)":"none",background:i%2===0?"#fff":"rgba(0,0,0,.012)"}}>
                    <td style={{padding:"9px 16px",fontWeight:700,color:"#5c4a3a",width:"35%",fontSize:11,textTransform:"uppercase",letterSpacing:.4,verticalAlign:"top"}}>{label}</td>
                    <td style={{padding:"9px 8px",color:"#1a1714",fontWeight:500,verticalAlign:"top",fontSize:13}}>{value}</td>
                    <td style={{padding:"9px 16px 9px 8px",color:"#9a8878",fontSize:10,textAlign:"right",whiteSpace:"nowrap",verticalAlign:"top",width:"80px"}}>{ref}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
          <div style={{marginBottom:28,borderBottom:"0.5px solid rgba(0,0,0,.07)"}}/>

          {activeSections.length===0&&<div style={{textAlign:"center",padding:40,color:"#9a8878",fontSize:13}}>
            Loading lease sections...{template===null?" (template not found)":""}
          </div>}
          {activeSections.map((sec,i)=>(
            <div key={sec.id} style={{marginBottom:28}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"#1a1714",color:"#d4a853",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"Georgia,serif"}}>{i+1}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#1a1714",fontFamily:"Georgia,serif",textTransform:"uppercase",letterSpacing:.3}}>{sec.title}</div>
              </div>
              <div style={{paddingLeft:34,fontSize:14,lineHeight:1.85,color:"#2c2420",fontFamily:"Georgia,serif"}}
                dangerouslySetInnerHTML={{__html:fillVars(sec.content,varData)}}/>
              {sec.requiresInitials&&(
                <div style={{paddingLeft:34,marginTop:14}}>
                  {initialedSecs.has(sec.id)
                    ?<div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"6px 14px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8}}>
                       <img src={signature} alt="initials" style={{height:28,maxWidth:100,objectFit:"contain"}}/>
                       <span style={{fontSize:10,color:"#4a7c59",fontWeight:700}}>✓ Initialed</span>
                     </div>
                    :signingStarted&&signature
                      ?<button onClick={()=>setInitialedSecs(p=>{const n=new Set(p);n.add(sec.id);return n;})}
                          style={{display:"inline-flex",alignItems:"center",gap:6,padding:"12px 16px",minHeight:44,background:"#1a1714",color:"#d4a853",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>
                          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          Click to Initial This Section
                        </button>
                      :<div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
                         <div style={{width:80,borderBottom:"1px solid rgba(0,0,0,.2)",height:20}}/>
                         <span style={{fontSize:10,color:"#bbb"}}>Initials required</span>
                       </div>
                  }
                </div>
              )}
              {i<activeSections.length-1&&<div style={{marginTop:20,borderBottom:"0.5px solid rgba(0,0,0,.07)"}}/>}
            </div>
          ))}

          {/* Page footer */}
          <div style={{marginTop:32,paddingTop:16,borderTop:"1px solid rgba(0,0,0,.08)",textAlign:"center",fontSize:10,color:"#bbb",fontFamily:"Georgia,serif"}}>
            {template?.company||""} — Alabama Residential Co-Living Lease Agreement
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
                 <div style={{fontSize:11,fontWeight:600,color:"#2d6a3f"}}>{template?.landlordName||lease?.landlordName||""}</div>
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
            Draw your signature below. Once saved, you will click to initial each required section above, then submit.
          </div>
          {signature
            ?<div>
               <div style={{padding:"10px 14px",background:"rgba(74,124,89,.05)",border:"1px solid rgba(74,124,89,.15)",borderRadius:8,display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                 <img src={signature} alt="Your signature" style={{height:50,maxWidth:200,objectFit:"contain"}}/>
                 <div>
                   <div style={{fontSize:11,fontWeight:600,color:"#2d6a3f"}}>{lease?.tenantName||"Resident"}</div>
                   <div style={{fontSize:10,color:"#6b5e52"}}>Signature captured</div>
                 </div>
               </div>
               <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                 <button onClick={()=>{setSignature(null);setSigningStarted(false);setInitialedSecs(new Set());}} style={{fontSize:10,color:"#6b5e52",background:"none",border:"1px solid rgba(0,0,0,.1)",borderRadius:5,padding:"10px 16px",minHeight:44,cursor:"pointer",fontFamily:"inherit"}}>Re-draw Signature</button>
                 {!signingStarted&&<button onClick={()=>{setSigningStarted(true);window.scrollTo({top:0,behavior:"smooth"});}}
                   style={{fontSize:12,fontWeight:700,color:"#fff",background:"#1a1714",border:"none",borderRadius:8,padding:"10px 20px",minHeight:44,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                   <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                   Start Signing — Initial Each Section
                 </button>}
                 {signingStarted&&<div style={{fontSize:11,color:"#4a7c59",fontWeight:600}}>
                   {initialedSecs.size} of {activeSections.filter(s=>s.requiresInitials).length} sections initialed
                 </div>}
               </div>
             </div>
            :<SigCanvas onSave={setSignature} height={140} label="Draw your full signature here"/>
          }
          {sigError&&<div style={{marginTop:10,fontSize:11,color:"#c45c4a",fontWeight:600,animation:"shake .4s ease"}}>Please draw your signature and initial all required sections before submitting.</div>}
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
        ul,ol{padding-left:24px;margin:6px 0}
        li{margin:3px 0;line-height:1.85}
      `}</style>
    </div>
  );
}
