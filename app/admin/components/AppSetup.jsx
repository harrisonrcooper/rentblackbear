"use client";
import { useState } from "react";

export default function AppSetup({ screenQs, setScreenQs, appFields, setAppFields, settings, setSettings, expanded, setExpanded, prevStep, setPrevStep, prevResult, setPrevResult, save, uid, showAlert, showConfirm, setNotifs, setModal, DEF_SETTINGS, DEF_APP_FIELDS, TODAY }) {
  return (<>
        <div className="sec-hd"><div><h2>Application Setup</h2><p>Pre-screen questions, contact form, and application fields</p></div></div>

        {/* ── Screening Questions Editor ── */}
        <div style={{marginTop:16,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,screenEditor:!p.screenEditor}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.screenEditor?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>Pre-Screen Questions</div><div style={{fontSize:9,color:"#6b5e52"}}>{screenQs.length} questions · Edit what prospects answer before applying</div></div></div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <span style={{fontSize:10,color:screenQs.filter(q=>q.active).length===screenQs.length?"#4a7c59":"#d4a853",fontWeight:600}}>{screenQs.filter(q=>q.active).length}/{screenQs.length} active</span>
              {screenQs.length===0&&<button className="btn btn-gold btn-sm" onClick={e=>{e.stopPropagation();setScreenQs([
                {id:uid(),q:"Are you a non-smoker? We have a strict no-smoking policy (including vapes).",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Do you agree to our zero-tolerance drug policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Are you comfortable with our no-pets policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Can you pass a background check with no criminal record?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Is your credit score 650 or above?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Is your gross monthly income at least 3x your expected rent?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Can you provide professional references and verifiable landlord history?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              ]);}}>Load Default Questions</button>}
            </div>
          </div>
          {expanded.screenEditor&&<div style={{padding:16,background:"#fff"}}>
            {screenQs.length===0&&<div style={{textAlign:"center",padding:24,color:"#6b5e52"}}><p style={{fontSize:12,marginBottom:8}}>No screening questions configured.</p><button className="btn btn-gold" onClick={()=>setScreenQs([
              {id:uid(),q:"Are you a non-smoker? We have a strict no-smoking policy (including vapes).",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Do you agree to our zero-tolerance drug policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Are you comfortable with our no-pets policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Can you pass a background check with no criminal record?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Is your credit score 650 or above?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Is your gross monthly income at least 3x your expected rent?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              {id:uid(),q:"Can you provide professional references and verifiable landlord history?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
            ])}>Load 7 Default Questions</button></div>}
            {screenQs.map((q,i)=>(
              <div key={q.id} style={{padding:12,border:"1px solid rgba(0,0,0,.04)",borderRadius:8,marginBottom:8,background:q.active?"#fff":"#f8f7f4",opacity:q.active?1:0.6}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                  <div style={{display:"flex",flexDirection:"column",gap:2,marginTop:4}}>
                    {i>0&&<button style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#6b5e52"}} onClick={()=>{const n=[...screenQs];[n[i-1],n[i]]=[n[i],n[i-1]];setScreenQs(n);}}>▲</button>}
                    {i<screenQs.length-1&&<button style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#6b5e52"}} onClick={()=>{const n=[...screenQs];[n[i],n[i+1]]=[n[i+1],n[i]];setScreenQs(n);}}>▼</button>}
                  </div>
                  <div style={{flex:1}}>
                    <textarea value={q.q} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,q:e.target.value}:x))} rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:12,fontFamily:"inherit",resize:"vertical"}}/>
                  </div>
                  <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:14,marginTop:4}} onClick={()=>setScreenQs(p=>p.filter((_,j)=>j!==i))}>✕</button>
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",fontSize:11}}>
                  <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}><input type="checkbox" checked={q.required} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,required:e.target.checked}:x))}/> Required</label>
                  <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}><input type="checkbox" checked={q.active} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,active:e.target.checked}:x))}/> Active</label>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#6b5e52"}}>Type:</span><select value={q.type||"yes-no"} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,type:e.target.value}:x))} style={{padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="yes-no">Yes / No</option><option value="text">Text</option><option value="number">Number</option></select></div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#6b5e52"}}>Pass:</span><select value={q.pass||"Yes"} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,pass:e.target.value}:x))} style={{padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="Yes">Yes</option><option value="No">No</option><option value="">Any</option></select></div>
                  {(q.type==="text"||q.type==="number")&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#6b5e52"}}>Min chars:</span><input type="number" value={q.minChars||0} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,minChars:Number(e.target.value)}:x))} style={{width:50,padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:10}}/></div>}
                </div>
              </div>
            ))}
            {screenQs.length>0&&<button className="btn btn-out" style={{width:"100%",marginTop:8}} onClick={()=>setScreenQs(p=>[...p,{id:uid(),q:"New question...",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"}])}>+ Add Question</button>}
            {screenQs.length>0&&<div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="btn btn-green" style={{flex:1}} onClick={()=>{save("hq-screen-qs",screenQs);setNotifs(p=>[{id:uid(),type:"app",msg:"Pre-screen questions published ("+screenQs.filter(q=>q.active).length+" active)",date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);showAlert({title:"Published!",body:"Pre-screen questions saved and published. The public site will use these questions immediately."});}}> 🚀 Save &amp; Publish to Site</button>
              <button className="btn btn-out" onClick={()=>{showConfirm({title:"Reset to Defaults?",body:"This will replace your current questions with the 7 default Black Bear screening questions. Your current questions will be lost.",confirmLabel:"Reset",danger:true,onConfirm:()=>setScreenQs([
                {id:uid(),q:"Are you a non-smoker? We have a strict no-smoking policy (including vapes).",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Do you agree to our zero-tolerance drug policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Are you comfortable with our no-pets policy?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Can you pass a background check with no criminal record?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Is your credit score 650 or above?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Is your gross monthly income at least 3x your expected rent?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
                {id:uid(),q:"Can you provide professional references and verifiable landlord history?",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"},
              ])});}}>Reset to Defaults</button>
            </div>}
            <div style={{fontSize:9,color:"#6b5e52",marginTop:8,textAlign:"center"}}>Saves to Supabase · Click "Save & Publish" to push changes live</div>
          </div>}
        </div>

        {/* ── Pre-Screen Preview ── */}
        {screenQs.length>0&&<div style={{marginTop:8,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,screenPreview:!p.screenPreview}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.screenPreview?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>👁 Pre-Screen Preview</div><div style={{fontSize:9,color:"#6b5e52"}}>See what tenants see on the public site</div></div></div>
          </div>
          {expanded.screenPreview&&(()=>{
            const activeQs=screenQs.filter(q=>q.active);
            const answerPreview=(v)=>{
              const q=activeQs[prevStep];
              if(q.pass&&v!==q.pass){setPrevResult("fail");return;}
              if(prevStep<activeQs.length-1)setPrevStep(prevStep+1);
              else setPrevResult("pass");
            };
            const resetPreview=()=>{setPrevStep(0);setPrevResult(null);};
            return(
            <div style={{padding:20,background:"linear-gradient(165deg,#1a1714,#2c2520)",borderRadius:0}}>
              <div style={{maxWidth:480,margin:"0 auto"}}>
                <div style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:24,border:"1px solid rgba(255,255,255,.08)"}}>
                  {prevResult===null&&<>
                    <div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#d4a853",marginBottom:8}}>Quick Pre-Screen</div><div style={{fontSize:10,color:"rgba(196,168,130,.6)"}}>{activeQs.length} questions · Takes 30 seconds</div></div>
                    <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:16}}>{activeQs.map((_,i)=><div key={i} style={{width:i===prevStep?24:8,height:8,borderRadius:4,background:i<prevStep?"#4a7c59":i===prevStep?"#d4a853":"rgba(255,255,255,.1)",transition:"all .2s"}}/>)}</div>
                    <div style={{fontSize:10,color:"rgba(196,168,130,.5)",marginBottom:6}}>Question {prevStep+1} of {activeQs.length}</div>
                    <div style={{fontSize:15,color:"#f5f0e8",fontWeight:600,lineHeight:1.5,marginBottom:20}}>{activeQs[prevStep].q}</div>
                    <div style={{display:"flex",gap:10}}>
                      {activeQs[prevStep].type==="yes-no"?<>
                        <button onClick={()=>answerPreview("Yes")} style={{flex:1,padding:"12px 20px",borderRadius:8,border:"none",background:"#4a7c59",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Yes</button>
                        <button onClick={()=>answerPreview("No")} style={{flex:1,padding:"12px 20px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#f5f0e8",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>No</button>
                      </>:<div style={{width:"100%"}}><input placeholder="Type your answer..." style={{width:"100%",padding:"12px 14px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"rgba(255,255,255,.05)",color:"#f5f0e8",fontSize:13,fontFamily:"inherit"}}/><button onClick={()=>answerPreview("Yes")} style={{marginTop:8,width:"100%",padding:"10px",borderRadius:8,border:"none",background:"#d4a853",color:"#1a1714",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{"Next \u2192"}</button></div>}
                    </div>
                  </>}
                  {prevResult==="pass"&&<div style={{textAlign:"center"}}><div style={{width:56,height:56,borderRadius:"50%",background:"rgba(74,124,89,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26,color:"#4a7c59"}}>✓</div><div style={{fontSize:18,fontWeight:700,color:"#f5f0e8",marginBottom:6}}>You Pre-Qualify!</div><div style={{fontSize:12,color:"rgba(196,168,130,.6)",marginBottom:16}}>This is where they fill out the contact form.</div><button onClick={resetPreview} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#d4a853",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Preview Again</button></div>}
                  {prevResult==="fail"&&<div style={{textAlign:"center"}}><div style={{width:56,height:56,borderRadius:"50%",background:"rgba(196,92,74,.12)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26,color:"#c45c4a"}}>✕</div><div style={{fontSize:18,fontWeight:700,color:"#f5f0e8",marginBottom:6}}>{"Didn\u2019t Qualify"}</div><div style={{fontSize:12,color:"rgba(196,168,130,.6)",marginBottom:16}}>This is what they see when they fail a question.</div><button onClick={resetPreview} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#d4a853",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Preview Again</button></div>}
                </div>
                <div style={{textAlign:"center",marginTop:10,fontSize:9,color:"rgba(196,168,130,.3)"}}>{"Preview only \u2014 this is how it appears on rentblackbear.com"}</div>
              </div>
            </div>);
          })()}
        </div>}

        {/* ── Pre-Screen Contact Form ── */}
        <div style={{marginTop:8,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(x=>({...x,screenForm:!x.screenForm}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14}}>{expanded.screenForm?"▼":"▶"}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700}}>Pre-Screen Contact Form</div>
                <div style={{fontSize:9,color:"#6b5e52"}}>{"Heading, subtext, and \u201cHow did you hear about us?\u201d options"}</div>
              </div>
            </div>
          </div>
          {expanded.screenForm&&<div style={{padding:16,background:"#fff"}}>
            <div className="fr">
              <div className="fld"><label>Heading</label><input value={(settings.screenForm||DEF_SETTINGS.screenForm).heading} placeholder="Almost There" onChange={e=>setSettings(s=>({...s,screenForm:{...(s.screenForm||DEF_SETTINGS.screenForm),heading:e.target.value}}))}/></div>
              <div className="fld"><label>Subtext</label><input value={(settings.screenForm||DEF_SETTINGS.screenForm).subtext} placeholder="All fields are required." onChange={e=>setSettings(s=>({...s,screenForm:{...(s.screenForm||DEF_SETTINGS.screenForm),subtext:e.target.value}}))}/></div>
            </div>
            <div className="fld">
              <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                {"\u201cHow did you hear about us?\u201d Options"}
                <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setSettings(s=>({...s,screenForm:{...(s.screenForm||DEF_SETTINGS.screenForm),sources:[...(s.screenForm||DEF_SETTINGS.screenForm).sources,"New Option"]}}))}>+ Add</button>
              </label>
              <div style={{fontSize:9,color:"#6b5e52",marginBottom:6}}>{"⠿ drag to reorder · click to edit · ✕ to remove"}</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {((settings.screenForm||DEF_SETTINGS.screenForm).sources||[]).map((src,i)=>{
                  const sf=settings.screenForm||DEF_SETTINGS.screenForm;
                  return(
                  <div key={i} draggable
                    onDragStart={e=>{e.dataTransfer.setData("srcIdx",i);}}
                    onDragOver={e=>e.preventDefault()}
                    onDrop={e=>{
                      e.preventDefault();
                      const from=Number(e.dataTransfer.getData("srcIdx"));
                      if(from===i)return;
                      const sources=[...sf.sources];
                      const[moved]=sources.splice(from,1);
                      sources.splice(i,0,moved);
                      setSettings(s=>({...s,screenForm:{...sf,sources}}));
                    }}
                    style={{display:"flex",gap:6,alignItems:"center",background:"#faf9f7",borderRadius:6,padding:"4px 6px",border:"1px solid rgba(0,0,0,.06)",cursor:"grab"}}>
                    <span style={{color:"#8a7d74",fontSize:13,flexShrink:0,cursor:"grab"}}>⠿</span>
                    <input value={src} style={{flex:1,border:"none",background:"transparent",fontFamily:"inherit",fontSize:12,outline:"none",padding:0}}
                      onChange={e=>{const sources=[...sf.sources];sources[i]=e.target.value;setSettings(s=>({...s,screenForm:{...sf,sources}}));}}/>
                    <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:13,padding:"0 2px",lineHeight:1,flexShrink:0}} onClick={()=>{const sources=sf.sources.filter((_,j)=>j!==i);setSettings(s=>({...s,screenForm:{...sf,sources}}));}}>✕</button>
                  </div>);
                })}
              </div>
              <div style={{fontSize:9,color:"#6b5e52",marginTop:6}}>{"\u201cOther\u201d should stay last \u2014 it triggers a free-text field."}</div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="btn btn-green" style={{flex:1}} onClick={()=>{save("hq-settings",settings);save("hq-screen-form",settings.screenForm||DEF_SETTINGS.screenForm);setNotifs(p=>[{id:uid(),type:"app",msg:"Pre-screen form settings saved",date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);}}>🚀 Save & Publish</button>
            </div>
            <div style={{fontSize:9,color:"#6b5e52",marginTop:6,textAlign:"center"}}>Changes apply immediately on the public site</div>
          </div>}
        </div>


        {/* ── Application Fields Editor ── */}
        <div style={{marginTop:8,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,appFieldsEditor:!p.appFieldsEditor}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.appFieldsEditor?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>Application Fields</div><div style={{fontSize:9,color:"#6b5e52"}}>{appFields.length} fields across {[...new Set(appFields.map(f=>f.section))].length} sections · Drives the entire /apply form</div></div></div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <span style={{fontSize:10,color:appFields.filter(f=>f.active).length===appFields.length&&appFields.length>0?"#4a7c59":"#d4a853",fontWeight:600}}>{appFields.filter(f=>f.active).length}/{appFields.length} active</span>
              {appFields.length===0&&<button className="btn btn-gold btn-sm" onClick={e=>{e.stopPropagation();setAppFields(DEF_APP_FIELDS);}}>Load Defaults</button>}
            </div>
          </div>
          {expanded.appFieldsEditor&&(()=>{
            const sections=[...new Set(appFields.map(f=>f.section))];
            const updateField=(gi,key,val)=>{const n=[...appFields];n[gi]={...n[gi],[key]:val};setAppFields(n);};
            const moveField=(gi,dir)=>{const n=[...appFields];const ti=gi+dir;if(ti<0||ti>=n.length)return;[n[gi],n[ti]]=[n[ti],n[gi]];setAppFields(n);};
            const deleteField=(gi)=>setAppFields(p=>p.filter((_,j)=>j!==gi));
            const toggleFieldExpand=(id)=>setExpanded(p=>({...p,["af_"+id]:!p["af_"+id]}));
            const renameSection=(oldSec,newSec)=>{if(!newSec.trim()||newSec.trim()===oldSec)return;setAppFields(p=>p.map(f=>f.section===oldSec?{...f,section:newSec.trim()}:f));setExpanded(p=>{const next={...p};delete next["afSecEdit_"+oldSec];return next;});};
            const duplicateSection=(sec)=>{
              // Strip any existing " #N" suffix to get the base name
              const base=sec.replace(/ #\d+$/,"");
              // Find all sections that share this base name
              const siblings=sections.filter(s=>s===base||s.match(new RegExp("^"+base.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+" #\\d+$")));
              // If the original hasn't been numbered yet, rename it to #1 first
              const renameOriginal=siblings.length===1&&sec===base;
              const nextNum=siblings.length+(renameOriginal?1:0)+1;
              const newName=base+" #"+nextNum;
              // Rename original to #1 if this is the first duplication
              if(renameOriginal){
                setAppFields(p=>p.map(f=>f.section===sec?{...f,section:base+" #1"}:f));
                // Also update any pending edit key
                setExpanded(prev=>{const next={...prev};delete next["afSecEdit_"+sec];return next;});
              }
              const srcFields=appFields.filter(f=>f.section===sec);
              const duped=srcFields.map(f=>({...f,id:uid(),section:newName}));
              setAppFields(p=>[...p,...duped]);
            };
            const addFieldToSection=(sec)=>{
              const newId=uid();
              setAppFields(p=>[...p,{id:newId,label:"New Field",type:"text",section:sec,required:false,active:true,placeholder:"",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null}]);
              // Auto-expand the new field so user sees it right away
              setExpanded(p=>({...p,["af_"+newId]:true}));
              // Scroll to bottom of editor after a tick
              setTimeout(()=>{const el=document.querySelector(".app-fields-editor-bottom");if(el)el.scrollIntoView({behavior:"smooth",block:"nearest"});},80);
            };
            const deleteSection=(sec)=>{setModal({type:"confirmAction",title:"Delete Section",body:"Delete the \""+sec+"\" section and all its fields? This cannot be undone.",confirmLabel:"Delete Section",confirmStyle:"btn-red",onConfirm:()=>{setAppFields(p=>p.filter(f=>f.section!==sec));setModal(null);}});};
            const addSection=()=>{const newId=uid();const name="New Section "+(sections.length+1);setAppFields(p=>[...p,{id:newId,label:"New Field",type:"text",section:name,required:false,active:true,placeholder:"",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null}]);setExpanded(p=>({...p,["af_"+newId]:true}));setTimeout(()=>{const el=document.querySelector(".app-fields-editor-bottom");if(el)el.scrollIntoView({behavior:"smooth",block:"nearest"});},80);};
            const TYPES=[["text","Text"],["email","Email"],["phone","Phone"],["date","Date"],["number","Number"],["yes-no","Yes / No"],["file","File Upload"],["long-text","Long Text"],["dropdown","Dropdown"],["counter","Counter"],["address","Address Block"]];
            const TCOL={text:"#3b82f6",email:"#8b5cf6",phone:"#4a7c59",date:"#d4a853",number:"#f97316","yes-no":"#4a7c59",file:"#0ea5e9","long-text":"#6366f1",dropdown:"#d4a853",counter:"#f97316",address:"#8b5cf6"};
            return(
            <div style={{padding:16,background:"#fff"}}>
              {appFields.length===0&&<div style={{textAlign:"center",padding:28,color:"#6b5e52"}}>
                <div style={{fontSize:36,marginBottom:8}}>📝</div>
                <p style={{fontSize:12,marginBottom:12}}>{"No fields configured yet. Load the defaults to get started \u2014 you can customize everything."}</p>
                <button className="btn btn-gold" onClick={()=>setAppFields(DEF_APP_FIELDS)}>Load 26 Default Fields</button>
              </div>}
              {sections.map(sec=>{
                const sFields=appFields.filter(f=>f.section===sec);
                const secEditKey="afSecEdit_"+sec;
                const secEditVal=expanded[secEditKey]!==undefined?expanded[secEditKey]:sec;
                return(
                <div key={sec} style={{marginBottom:10,border:"1px solid rgba(0,0,0,.06)",borderRadius:10,overflow:"hidden"}}>
                  {/* Section header */}
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"rgba(212,168,83,.04)",borderBottom:"1px solid rgba(212,168,83,.12)"}}>
                    <span style={{fontSize:12,color:"#c4a882",flexShrink:0}}>☰</span>
                    <div style={{flex:1,display:"flex",alignItems:"center",gap:4,minWidth:0,border:"1px solid transparent",borderRadius:5,padding:"2px 4px",transition:"border .15s",cursor:"text"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(212,168,83,.3)"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}>
                      <input
                        value={secEditVal}
                        onChange={e=>setExpanded(p=>({...p,[secEditKey]:e.target.value}))}
                        onBlur={e=>renameSection(sec,e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter")e.target.blur();}}
                        style={{flex:1,fontSize:11,fontWeight:800,color:"#9a7422",background:"transparent",border:"none",outline:"none",padding:0,fontFamily:"inherit",textTransform:"uppercase",letterSpacing:.8,cursor:"text",minWidth:0}}
                      />
                      <span style={{fontSize:9,color:"#c4a882",flexShrink:0,opacity:.6}}>✏️</span>
                    </div>
                    <span style={{fontSize:9,color:"#6b5e52",whiteSpace:"nowrap"}}>{sFields.length} field{sFields.length!==1?"s":""}</span>
                    <button className="btn btn-gold btn-sm" style={{fontSize:9,padding:"2px 9px"}} onClick={()=>addFieldToSection(sec)}>+ Field</button>
                    <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 9px",color:"#d4a853",borderColor:"rgba(212,168,83,.35)"}} title="Duplicate this entire section" onClick={()=>duplicateSection(sec)}>⧉ Duplicate</button>
                    {sections.length>1&&<button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:12,padding:"0 2px"}} onClick={()=>deleteSection(sec)}>🗑</button>}
                  </div>
                  {/* Fields in this section */}
                  {sFields.length===0&&<div style={{padding:"10px 14px",fontSize:11,color:"#7a7067",fontStyle:"italic"}}>{"No fields \u2014 click + Field above"}</div>}
                  {sFields.map(f=>{
                    const gi=appFields.indexOf(f);
                    const isExp=!!expanded["af_"+f.id];
                    const tc=TCOL[f.type]||"#999";
                    return(
                    <div key={f.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)"}}>
                      {/* Field header row */}
                      <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:f.active?"#fff":"rgba(0,0,0,.01)",opacity:f.active?1:.6}}>
                        <div style={{display:"flex",flexDirection:"column",gap:1,flexShrink:0}}>
                          <button style={{background:"none",border:"none",cursor:gi>0?"pointer":"default",fontSize:9,color:gi>0?"#bbb":"#e8e5e0",lineHeight:1,padding:0}} onClick={()=>moveField(gi,-1)}>▲</button>
                          <button style={{background:"none",border:"none",cursor:gi<appFields.length-1?"pointer":"default",fontSize:9,color:gi<appFields.length-1?"#bbb":"#e8e5e0",lineHeight:1,padding:0}} onClick={()=>moveField(gi,1)}>▼</button>
                        </div>
                        <input value={f.label} onChange={e=>updateField(gi,"label",e.target.value)} style={{flex:1,padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:12,fontFamily:"inherit",background:"#faf9f7",minWidth:0}}/>
                        <select value={f.type} onChange={e=>updateField(gi,"type",e.target.value)} style={{padding:"4px 6px",borderRadius:6,border:"none",fontSize:9,fontFamily:"inherit",background:tc+"18",color:tc,fontWeight:700,cursor:"pointer",flexShrink:0}}>
                          {TYPES.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                        </select>
                        <button onClick={()=>updateField(gi,"required",!f.required)} style={{padding:"3px 7px",borderRadius:6,border:"none",fontSize:9,fontWeight:700,cursor:"pointer",background:f.required?"rgba(196,92,74,.1)":"rgba(0,0,0,.04)",color:f.required?"#c45c4a":"#999",whiteSpace:"nowrap",flexShrink:0}}>{f.required?"Req ✓":"Optional"}</button>
                        <button onClick={()=>updateField(gi,"active",!f.active)} style={{padding:"3px 8px",borderRadius:6,border:"none",fontSize:9,fontWeight:800,cursor:"pointer",background:f.active?"rgba(74,124,89,.1)":"rgba(0,0,0,.04)",color:f.active?"#4a7c59":"#bbb",minWidth:32,flexShrink:0}}>{f.active?"ON":"OFF"}</button>
                        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#7a7067",padding:"0 1px",flexShrink:0}} onClick={()=>toggleFieldExpand(f.id)}>{isExp?"▾":"▸"}</button>
                        <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:13,lineHeight:1,padding:"0 1px",flexShrink:0}} onClick={()=>deleteField(gi)}>✕</button>
                      </div>
                      {/* Expanded detail panel */}
                      {isExp&&<div style={{padding:"12px 14px 14px",background:"rgba(0,0,0,.012)",borderTop:"1px solid rgba(0,0,0,.04)"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Placeholder Text</div><input value={f.placeholder||""} onChange={e=>updateField(gi,"placeholder",e.target.value)} placeholder="e.g. Enter your name..." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/></div>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Help Text (shows below field)</div><input value={f.helpText||""} onChange={e=>updateField(gi,"helpText",e.target.value)} placeholder="e.g. We'll never share this." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/></div>
                        </div>
                        {f.type==="dropdown"&&<div style={{marginBottom:8}}><div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Dropdown Options (one per line)</div><textarea value={(f.options||[]).join(", ")} onChange={e=>updateField(gi,"options",e.target.value.split("\n"))} rows={3} placeholder={"Option 1\nOption 2\nOption 3"} style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/></div>}
                        {f.type==="yes-no"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#4a7c59",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{"Follow-up if \u201cYes\u201d"}</div><input value={f.followUpYes||""} onChange={e=>updateField(gi,"followUpYes",e.target.value)} placeholder="e.g. Please explain..." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(74,124,89,.2)",fontSize:11,fontFamily:"inherit"}}/></div>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#c45c4a",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{"Follow-up if \u201cNo\u201d"}</div><input value={f.followUpNo||""} onChange={e=>updateField(gi,"followUpNo",e.target.value)} placeholder="e.g. Please explain..." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(196,92,74,.2)",fontSize:11,fontFamily:"inherit"}}/></div>
                        </div>}
                        {(f.type==="number"||f.type==="counter")&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Min Value</div><input type="number" value={f.min||""} onChange={e=>updateField(gi,"min",e.target.value?Number(e.target.value):null)} placeholder="0" style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/></div>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Max Value</div><input type="number" value={f.max||""} onChange={e=>updateField(gi,"max",e.target.value?Number(e.target.value):null)} placeholder="99" style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/></div>
                        </div>}
                      </div>}
                    </div>);
                  })}
                </div>);
              })}
              {appFields.length>0&&<>
                <div className="app-fields-editor-bottom"/>
                <button className="btn btn-out" style={{width:"100%",marginTop:8,marginBottom:8}} onClick={addSection}>＋ Add New Section</button>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal({type:"confirmAction",title:"Reset to Defaults",body:"This will delete all your current fields and sections and reload the 26 default fields. This cannot be undone.",confirmLabel:"Yes, Reset",confirmStyle:"btn-red",onConfirm:()=>{setAppFields(DEF_APP_FIELDS);setModal(null);}})}>↺ Reset to Defaults</button>
                  <button className="btn btn-green" style={{flex:1}} onClick={()=>{
                    save("hq-app-fields",appFields);
                    setNotifs(p=>[{id:uid(),type:"app",msg:"Application form published \u2014 "+appFields.filter(f=>f.active).length+" fields across "+sections.length+" sections",date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
                    setExpanded(p=>({...p,appPubSuccess:true}));
                    setTimeout(()=>setExpanded(p=>({...p,appPubSuccess:false})),3500);
                  }}>🚀 Save &amp; Publish to Site</button>
                </div>
                {expanded.appPubSuccess&&<div style={{marginTop:8,padding:"9px 12px",background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,fontSize:11,color:"#4a7c59",fontWeight:700,textAlign:"center",animation:"fadeIn .3s"}}>✓ Live on rentblackbear.com/apply</div>}
              </>}
            </div>);
          })()}
        </div>

        {/* ── Application Preview ── */}
        {appFields.filter(f=>f.active).length>0&&<div style={{marginTop:8,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,appPreview:!p.appPreview,appPrevSec:p.appPreview?p.appPrevSec:0}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.appPreview?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>📱 Application Preview</div><div style={{fontSize:9,color:"#6b5e52"}}>{"Live preview \u2014 reflects your current fields exactly"}</div></div></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {expanded.appPreview&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={e=>{e.stopPropagation();setExpanded(p=>({...p,appPrevSec:0}));}}>↺ Restart</button>}
              <span style={{fontSize:10,color:"#6b5e52"}}>{[...new Set(appFields.filter(f=>f.active).map(f=>f.section))].length} sections · {appFields.filter(f=>f.active).length} fields</span>
            </div>
          </div>
          {expanded.appPreview&&(()=>{
            const activeSections=[...new Set(appFields.filter(f=>f.active).map(f=>f.section))];
            const curSecIdx=expanded.appPrevSec||0;
            const isDone=curSecIdx===-1;
            const secName=activeSections[curSecIdx]||"";
            const secFields=appFields.filter(f=>f.active&&f.section===secName);
            const isLast=curSecIdx===activeSections.length-1;
            const goNext=()=>setExpanded(p=>({...p,appPrevSec:isLast?-1:(p.appPrevSec||0)+1}));
            const reset=()=>setExpanded(p=>({...p,appPrevSec:0}));
            const inStyle={width:"100%",padding:"11px 13px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"rgba(255,255,255,.06)",color:"#f5f0e8",fontSize:13,fontFamily:"inherit",marginTop:4,display:"block"};
            const renderField=(f)=>(
              <div key={f.id} style={{marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"rgba(196,168,130,.8)",textTransform:"uppercase",letterSpacing:.3}}>{f.label}{f.required&&<span style={{color:"#c45c4a",marginLeft:2}}>*</span>}</div>
                {f.helpText&&<div style={{fontSize:9,color:"rgba(196,168,130,.4)",marginTop:1,marginBottom:2}}>{f.helpText}</div>}
                {(f.type==="text"||f.type==="email"||f.type==="phone"||f.type==="passcode")&&<div style={{...inStyle,color:"rgba(196,168,130,.35)",pointerEvents:"none"}}>{f.placeholder||"..."}</div>}
                {f.type==="number"&&<div style={{...inStyle,color:"rgba(196,168,130,.35)",pointerEvents:"none"}}>{f.placeholder||"0"}</div>}
                {f.type==="date"&&<div style={{...inStyle,color:"rgba(196,168,130,.35)",pointerEvents:"none"}}>{f.placeholder||"MM / DD / YYYY"}</div>}
                {f.type==="long-text"&&<div style={{...inStyle,minHeight:60,color:"rgba(196,168,130,.35)",pointerEvents:"none"}}>{f.placeholder||"..."}</div>}
                {f.type==="file"&&<div style={{...inStyle,textAlign:"center",padding:"16px",border:"1px dashed rgba(196,168,130,.25)",color:"rgba(196,168,130,.5)",pointerEvents:"none"}}>📎 {f.placeholder||"Tap to upload"}</div>}
                {f.type==="yes-no"&&<div style={{display:"flex",gap:8,marginTop:5}}>
                  <div style={{flex:1,padding:"11px",borderRadius:8,border:"1px solid rgba(74,124,89,.35)",background:"rgba(74,124,89,.08)",textAlign:"center",fontSize:13,fontWeight:700,color:"#4a7c59"}}>Yes</div>
                  <div style={{flex:1,padding:"11px",borderRadius:8,border:"1px solid rgba(196,168,130,.15)",textAlign:"center",fontSize:13,color:"rgba(196,168,130,.5)"}}>No</div>
                </div>}
                {f.type==="dropdown"&&<select disabled style={{...inStyle,cursor:"default",opacity:.7}}><option>{f.placeholder||"Select..."}</option>{(f.options||[]).map((o,i)=><option key={i}>{o}</option>)}</select>}
                {f.type==="counter"&&<div style={{display:"flex",alignItems:"center",gap:16,marginTop:6}}>
                  <div style={{width:36,height:36,borderRadius:"50%",border:"1px solid rgba(196,168,130,.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(196,168,130,.4)",fontSize:20}}>{"\u2212"}</div>
                  <div style={{fontSize:26,fontWeight:700,color:"#f5f0e8",minWidth:30,textAlign:"center"}}>{f.min||0}</div>
                  <div style={{width:36,height:36,borderRadius:"50%",border:"1px solid rgba(196,168,130,.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(196,168,130,.4)",fontSize:20}}>+</div>
                </div>}
                {f.type==="address"&&<div style={{display:"flex",flexDirection:"column",gap:5,marginTop:4}}>
                  <div style={{...inStyle,color:"rgba(196,168,130,.35)"}}>Street address</div>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:5}}>
                    <div style={{...inStyle,color:"rgba(196,168,130,.35)"}}>City</div>
                    <div style={{...inStyle,color:"rgba(196,168,130,.35)"}}>State</div>
                  </div>
                </div>}
              </div>
            );
            return(
            <div style={{padding:20,background:"linear-gradient(165deg,#1a1714,#2c2520)"}}>
              <div style={{maxWidth:400,margin:"0 auto"}}>
                {!isDone&&<>
                  <div style={{display:"flex",gap:3,marginBottom:5}}>
                    {activeSections.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<curSecIdx?"#4a7c59":i===curSecIdx?"#d4a853":"rgba(255,255,255,.1)",transition:"all .3s"}}/>)}
                  </div>
                  <div style={{fontSize:9,color:"rgba(196,168,130,.35)",marginBottom:14,textAlign:"right"}}>Section {curSecIdx+1} of {activeSections.length}</div>
                  <div style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:20,border:"1px solid rgba(255,255,255,.07)"}}>
                    <div style={{fontSize:11,fontWeight:800,color:"#d4a853",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{secName}</div>
                    <div style={{height:1,background:"rgba(212,168,83,.15)",marginBottom:16}}/>
                    {secFields.map(renderField)}
                    <button onClick={goNext} style={{width:"100%",padding:"14px",background:"#d4a853",color:"#1a1714",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:6}}>
                      {isLast?"Submit Application \u2192":"Continue \u2192"}
                    </button>
                    {curSecIdx>0&&<button onClick={()=>setExpanded(p=>({...p,appPrevSec:(p.appPrevSec||0)-1}))} style={{width:"100%",padding:"11px",background:"transparent",border:"none",fontSize:12,color:"rgba(196,168,130,.4)",cursor:"pointer",fontFamily:"inherit",marginTop:4}}>{"\u2190 Back"}</button>}
                  </div>
                </>}
                {isDone&&<div style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:28,border:"1px solid rgba(255,255,255,.07)",textAlign:"center"}}>
                  <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(74,124,89,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26,color:"#4a7c59"}}>✓</div>
                  <div style={{fontSize:18,fontWeight:700,color:"#f5f0e8",marginBottom:6}}>Application Submitted!</div>
                  <div style={{fontSize:12,color:"rgba(196,168,130,.55)",marginBottom:20}}>This is the final screen tenants see after completing all sections.</div>
                  <button onClick={reset} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#d4a853",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Preview Again</button>
                </div>}
                <div style={{textAlign:"center",marginTop:10,fontSize:9,color:"rgba(196,168,130,.25)"}}>{"Preview only \u2014 rentblackbear.com/apply"}</div>
              </div>
            </div>);
          })()}
        </div>}
      </>);
}
