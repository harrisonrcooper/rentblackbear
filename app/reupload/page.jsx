"use client";
import{useState,useEffect,useRef}from"react";

const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";

const supa=(path,opts={})=>fetch(SUPA_URL+"/rest/v1/"+path,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});

async function loadApps(){
  try{
    const r=await supa("app_data?key=eq.hq-apps&select=value");
    const d=await r.json();
    return d&&d.length>0&&d[0].value?d[0].value:[];
  }catch{return[];}
}

async function saveApps(apps){
  try{
    await supa("app_data",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify({key:"hq-apps",value:apps})});
  }catch(e){console.error("Save error",e);}
}

async function uploadFile(file,appId,docType){
  const ext=file.name.split(".").pop()||"jpg";
  const path=`applicant-docs/${appId}/${Date.now()}-${docType.replace(/[^a-z0-9]/gi,"-")}.${ext}`;
  const r=await fetch(`${SUPA_URL}/storage/v1/object/applicant-docs/${path}`,{
    method:"POST",
    headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":file.type,"x-upsert":"true"},
    body:file,
  });
  if(!r.ok)throw new Error("Upload failed: "+r.status);
  return`${SUPA_URL}/storage/v1/object/public/applicant-docs/${path}`;
}

export default function ReuploadPage(){
  const[params,setParams]=useState(null);
  const[app,setApp]=useState(null);
  const[status,setStatus]=useState("loading"); // loading | ready | uploading | success | error | notfound
  const[file,setFile]=useState(null);
  const[preview,setPreview]=useState(null);
  const[errMsg,setErrMsg]=useState("");
  const inputRef=useRef(null);

  useEffect(()=>{
    if(typeof window==="undefined")return;
    const p=new URLSearchParams(window.location.search);
    const appId=p.get("app");
    const docType=p.get("doc")||"";
    const docLabel=p.get("label")||decodeURIComponent(docType);
    setParams({appId,docType,docLabel});
    if(!appId){setStatus("notfound");return;}
    loadApps().then(apps=>{
      const found=apps.find(a=>a.id===appId);
      if(!found){setStatus("notfound");return;}
      setApp(found);
      setStatus("ready");
    }).catch(()=>setStatus("error"));
  },[]);

  const onFile=(e)=>{
    const f=e.target.files?.[0];
    if(!f)return;
    setFile(f);
    if(f.type.startsWith("image/")){
      const reader=new FileReader();
      reader.onload=ev=>setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const onSubmit=async()=>{
    if(!file||!app||!params)return;
    setStatus("uploading");
    try{
      const url=await uploadFile(file,app.id,params.docType);
      const newDoc={id:Math.random().toString(36).slice(2,9),type:params.docType,label:params.docLabel,url,name:file.name,uploadedAt:new Date().toISOString(),verified:"unreviewed"};
      const apps=await loadApps();
      const updatedApps=apps.map(a=>{
        if(a.id!==app.id)return a;
        const existingDocs=(a.appDocs||[]).filter(d=>d.type!==params.docType);
        const updatedApp={...a,appDocs:[...existingDocs,newDoc]};
        // Also update applicationData.appDocs if present
        if(a.applicationData?.appDocs){
          updatedApp.applicationData={...a.applicationData,appDocs:[...a.applicationData.appDocs.filter(d=>d.type!==params.docType),newDoc]};
        }
        return updatedApp;
      });
      await saveApps(updatedApps);
      setStatus("success");
    }catch(e){
      setErrMsg(e.message||"Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const styles={
    page:{minHeight:"100vh",background:"#f4f3f0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"},
    card:{background:"#fff",borderRadius:16,padding:"32px 28px",maxWidth:480,width:"100%",boxShadow:"0 2px 24px rgba(0,0,0,.07)"},
    logo:{display:"flex",alignItems:"center",gap:10,marginBottom:28},
    logoMark:{width:40,height:40,borderRadius:10,background:"#1a1714",display:"flex",alignItems:"center",justifyContent:"center"},
    logoText:{fontSize:15,fontWeight:800,color:"#1a1714"},
    tag:{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"rgba(212,168,83,.12)",color:"#9a7422",display:"inline-block",marginBottom:12},
    h1:{fontSize:20,fontWeight:800,color:"#1a1714",marginBottom:6,margin:"0 0 6px"},
    sub:{fontSize:13,color:"#6b5e52",marginBottom:24,lineHeight:1.5,margin:"0 0 24px"},
    dropzone:{border:"2px dashed rgba(0,0,0,.12)",borderRadius:12,padding:"32px 20px",textAlign:"center",cursor:"pointer",transition:"border-color .15s,background .15s",marginBottom:16,background:"rgba(0,0,0,.01)"},
    dropzoneHover:{borderColor:"#d4a853",background:"rgba(212,168,83,.04)"},
    preview:{width:"100%",maxHeight:200,objectFit:"contain",borderRadius:8,marginBottom:12,border:"1px solid rgba(0,0,0,.08)"},
    fileName:{fontSize:12,fontWeight:600,color:"#1a1714",padding:"10px 12px",background:"rgba(74,124,89,.06)",borderRadius:8,border:"1px solid rgba(74,124,89,.15)",marginBottom:16,display:"flex",alignItems:"center",gap:8},
    btn:{width:"100%",padding:"14px",borderRadius:10,border:"none",background:"#d4a853",color:"#1a1714",fontSize:14,fontWeight:800,cursor:"pointer",transition:"all .15s",fontFamily:"inherit"},
    btnDisabled:{background:"rgba(0,0,0,.08)",color:"#aaa",cursor:"not-allowed"},
    success:{textAlign:"center",padding:"12px 0"},
    err:{background:"rgba(196,92,74,.08)",border:"1px solid rgba(196,92,74,.2)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#c45c4a",marginTop:12},
  };

  if(status==="loading")return(
    <div style={styles.page}>
      <div style={{fontSize:13,color:"#6b5e52",animation:"pulse 1.5s infinite"}}>Loading…</div>
    </div>
  );

  if(status==="notfound")return(
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}><div style={styles.logoMark}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div><span style={styles.logoText}>Black Bear Rentals</span></div>
        <h1 style={styles.h1}>Link not found</h1>
        <p style={styles.sub}>This link may have expired or the application could not be found. Please contact your property manager for a new link.</p>
      </div>
    </div>
  );

  if(status==="success")return(
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}><div style={styles.logoMark}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div><span style={styles.logoText}>Black Bear Rentals</span></div>
        <div style={styles.success}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(74,124,89,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 style={{...styles.h1,textAlign:"center",marginBottom:8}}>Document received</h1>
          <p style={{...styles.sub,textAlign:"center"}}>Your {params?.docLabel} has been uploaded. Your property manager will review it shortly — no further action needed.</p>
        </div>
      </div>
    </div>
  );

  const[hovering,setHovering]=useState(false);

  return(
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoMark}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
          <span style={styles.logoText}>Black Bear Rentals</span>
        </div>

        <span style={styles.tag}>Document Re-Upload</span>
        <h1 style={styles.h1}>Upload your {params?.docLabel}</h1>
        <p style={styles.sub}>
          Hi {app?.name?.split(" ")[0]}, we were unable to verify your <strong>{params?.docLabel}</strong>. Please upload a clear, unobstructed photo below.
        </p>

        <input ref={inputRef} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={onFile}/>

        {preview&&<img src={preview} style={styles.preview} alt="Preview"/>}
        {file&&!preview&&(
          <div style={styles.fileName}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {file.name}
          </div>
        )}

        <div
          style={{...styles.dropzone,...(hovering?styles.dropzoneHover:{})}}
          onClick={()=>inputRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setHovering(true);}}
          onDragLeave={()=>setHovering(false)}
          onDrop={e=>{e.preventDefault();setHovering(false);const f=e.dataTransfer.files?.[0];if(f){setFile(f);if(f.type.startsWith("image/")){const r=new FileReader();r.onload=ev=>setPreview(ev.target.result);r.readAsDataURL(f);}else setPreview(null);}}}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" style={{marginBottom:8}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div style={{fontSize:13,fontWeight:600,color:"#5c4a3a",marginBottom:4}}>{file?"Change file":"Tap to choose a file"}</div>
          <div style={{fontSize:11,color:"#aaa"}}>JPG, PNG, or PDF · Max 10MB</div>
        </div>

        <button
          style={{...styles.btn,...(!file||status==="uploading"?styles.btnDisabled:{})}}
          disabled={!file||status==="uploading"}
          onClick={onSubmit}
        >
          {status==="uploading"?"Uploading…":"Submit Document"}
        </button>

        {status==="error"&&<div style={styles.err}>{errMsg||"Something went wrong. Please try again or contact your property manager."}</div>}

        <div style={{marginTop:20,fontSize:11,color:"#aaa",textAlign:"center",lineHeight:1.5}}>
          Questions? Contact us at <a href={"mailto:"+(app?.pmEmail||"info@rentblackbear.com")} style={{color:"#9a7422"}}>{app?.pmEmail||"info@rentblackbear.com"}</a>
        </div>
      </div>
    </div>
  );
}
