"use client";
import{useState,useEffect,useRef,Suspense}from"react";
import{useSearchParams}from"next/navigation";

const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";

const supa=(path,opts={})=>fetch(SUPA_URL+"/rest/v1/"+path,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});

async function loadApps(){try{const r=await supa("app_data?key=eq.hq-apps&select=value");const d=await r.json();return d&&d.length>0&&d[0].value?d[0].value:[];}catch{return[];}}
async function saveApps(apps){try{await supa("app_data",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify({key:"hq-apps",value:apps})});}catch(e){console.error(e);}}
async function uploadFile(file,appId,docType){
  const ext=file.name.split(".").pop()||"jpg";
  const path=`applicant-docs/${appId}/${Date.now()}-${docType.replace(/[^a-z0-9]/gi,"-")}.${ext}`;
  const r=await fetch(`${SUPA_URL}/storage/v1/object/applicant-docs/${path}`,{method:"POST",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":file.type,"x-upsert":"true"},body:file});
  if(!r.ok)throw new Error("Upload failed: "+r.status);
  return`${SUPA_URL}/storage/v1/object/public/applicant-docs/${path}`;
}

const S={page:{minHeight:"100vh",background:"#f4f3f0",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"},card:{background:"#fff",borderRadius:16,padding:"32px 28px",maxWidth:480,width:"100%",boxShadow:"0 2px 24px rgba(0,0,0,.07)"},logo:{display:"flex",alignItems:"center",gap:10,marginBottom:28},logoMark:{width:40,height:40,borderRadius:10,background:"#1a1714",display:"flex",alignItems:"center",justifyContent:"center"},logoText:{fontSize:15,fontWeight:800,color:"#1a1714"},tag:{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"rgba(212,168,83,.12)",color:"#9a7422",display:"inline-block",marginBottom:12},h1:{fontSize:20,fontWeight:800,color:"#1a1714",margin:"0 0 6px"},sub:{fontSize:13,color:"#6b5e52",margin:"0 0 24px",lineHeight:1.5},dropzone:{border:"2px dashed rgba(0,0,0,.12)",borderRadius:12,padding:"32px 20px",textAlign:"center",cursor:"pointer",transition:"border-color .15s,background .15s",marginBottom:16,background:"rgba(0,0,0,.01)"},dropzoneActive:{borderColor:"#d4a853",background:"rgba(212,168,83,.04)"},preview:{width:"100%",maxHeight:200,objectFit:"contain",borderRadius:8,marginBottom:12,border:"1px solid rgba(0,0,0,.08)"},fileName:{fontSize:12,fontWeight:600,color:"#1a1714",padding:"10px 12px",background:"rgba(74,124,89,.06)",borderRadius:8,border:"1px solid rgba(74,124,89,.15)",marginBottom:16,display:"flex",alignItems:"center",gap:8},btn:{width:"100%",padding:"14px",borderRadius:10,border:"none",background:"#d4a853",color:"#1a1714",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"},btnOff:{background:"rgba(0,0,0,.08)",color:"#aaa",cursor:"not-allowed"},err:{background:"rgba(196,92,74,.08)",border:"1px solid rgba(196,92,74,.2)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#c45c4a",marginTop:12}};

const Logo=()=><div style={S.logo}><div style={S.logoMark}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div><span style={S.logoText}>Black Bear Rentals</span></div>;

function Inner(){
  const sp=useSearchParams();
  const appId=sp.get("app")||"";
  const docType=sp.get("doc")||"";
  const rawLabel=sp.get("label")||"";
  const docLabel=rawLabel?decodeURIComponent(rawLabel):docType;

  const[app,setApp]=useState(null);
  const[phase,setPhase]=useState("loading");
  const[file,setFile]=useState(null);
  const[preview,setPreview]=useState(null);
  const[hover,setHover]=useState(false);
  const[errMsg,setErrMsg]=useState("");
  const ref=useRef(null);

  useEffect(()=>{
    if(!appId){setPhase("notfound");return;}
    loadApps().then(apps=>{const found=apps.find(a=>a.id===appId);if(!found){setPhase("notfound");return;}setApp(found);setPhase("ready");}).catch(()=>setPhase("error"));
  },[appId]);

  const pickFile=(f)=>{
    if(!f)return;
    setFile(f);
    if(f.type.startsWith("image/")){const r=new FileReader();r.onload=ev=>setPreview(ev.target.result);r.readAsDataURL(f);}else setPreview(null);
  };

  const submit=async()=>{
    if(!file||!app)return;
    setPhase("uploading");
    try{
      const url=await uploadFile(file,app.id,docType);
      const newDoc={id:Math.random().toString(36).slice(2,9),type:docType,label:docLabel,url,name:file.name,uploadedAt:new Date().toISOString(),verified:"unreviewed"};
      const apps=await loadApps();
      const updated=apps.map(a=>{if(a.id!==app.id)return a;const fd=(a.appDocs||[]).filter(d=>d.type!==docType);const ua={...a,appDocs:[...fd,newDoc]};if(a.applicationData?.appDocs)ua.applicationData={...a.applicationData,appDocs:[...a.applicationData.appDocs.filter(d=>d.type!==docType),newDoc]};return ua;});
      await saveApps(updated);
      setPhase("success");
    }catch(e){setErrMsg(e.message||"Something went wrong.");setPhase("error");}
  };

  if(phase==="loading")return<div style={S.page}><span style={{fontSize:13,color:"#6b5e52"}}>Loading…</span></div>;

  if(phase==="notfound")return<div style={S.page}><div style={S.card}><Logo/><h1 style={S.h1}>Link not found</h1><p style={S.sub}>This link may have expired. Please contact your property manager for a new one.</p></div></div>;

  if(phase==="success")return<div style={S.page}><div style={S.card}><Logo/><div style={{textAlign:"center"}}><div style={{width:56,height:56,borderRadius:"50%",background:"rgba(74,124,89,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><h1 style={{...S.h1,textAlign:"center",marginBottom:8}}>Document received</h1><p style={{...S.sub,textAlign:"center"}}>Your {docLabel} has been uploaded. Your property manager will review it shortly.</p></div></div></div>;

  return(
    <div style={S.page}><div style={S.card}>
      <Logo/>
      <span style={S.tag}>Document Re-Upload</span>
      <h1 style={S.h1}>Upload your {docLabel}</h1>
      <p style={S.sub}>Hi {app?.name?.split(" ")[0]}, we couldn't verify your <strong>{docLabel}</strong>. Please upload a clear photo below.</p>

      <input ref={ref} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e=>pickFile(e.target.files?.[0])}/>
      {preview&&<img src={preview} style={S.preview} alt="preview"/>}
      {file&&!preview&&<div style={S.fileName}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>{file.name}</div>}

      <div style={{...S.dropzone,...(hover?S.dropzoneActive:{})}} onClick={()=>ref.current?.click()} onDragOver={e=>{e.preventDefault();setHover(true);}} onDragLeave={()=>setHover(false)} onDrop={e=>{e.preventDefault();setHover(false);pickFile(e.dataTransfer.files?.[0]);}}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" style={{marginBottom:8}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <div style={{fontSize:13,fontWeight:600,color:"#5c4a3a",marginBottom:4}}>{file?"Change file":"Tap to choose a file"}</div>
        <div style={{fontSize:11,color:"#aaa"}}>JPG, PNG, or PDF · Max 10MB</div>
      </div>

      <button style={{...S.btn,...(!file||phase==="uploading"?S.btnOff:{})}} disabled={!file||phase==="uploading"} onClick={submit}>
        {phase==="uploading"?"Uploading…":"Submit Document"}
      </button>
      {phase==="error"&&<div style={S.err}>{errMsg}</div>}
      <div style={{marginTop:20,fontSize:11,color:"#aaa",textAlign:"center"}}>Questions? Email <a href="mailto:info@rentblackbear.com" style={{color:"#9a7422"}}>info@rentblackbear.com</a></div>
    </div></div>
  );
}

export default function ReuploadPage(){
  return(
    <Suspense fallback={<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",color:"#6b5e52",fontSize:13}}>Loading…</div>}>
      <Inner/>
    </Suspense>
  );
}
