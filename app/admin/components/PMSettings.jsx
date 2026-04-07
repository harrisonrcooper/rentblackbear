"use client";
import { useState } from "react";

export default function PMSettings({ settings, setSettings, save, expanded, setExpanded, DEF_SETTINGS, SigCanvas }) {
  return (
    <>
        <div className="sec-hd"><div><h2>PM Settings</h2><p>Company info, lease rules, email templates, and notifications</p></div></div>
        <div className="card"><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:12}}>Company Info</h3>
          <div className="fr"><div className="fld"><label>Company Name</label><input value={settings.companyName} onChange={e=>setSettings({...settings,companyName:e.target.value})}/></div><div className="fld"><label>Legal Entity</label><input value={settings.legalName} onChange={e=>setSettings({...settings,legalName:e.target.value})}/></div></div>
          <div className="fld"><label>Property Manager Name <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",letterSpacing:0}}>{"\u2014"} used in outgoing reference & applicant emails</span></label><input value={settings.pmName||""} onChange={e=>setSettings({...settings,pmName:e.target.value})} placeholder="Carolina Cooper"/></div>
          <div className="fr3"><div className="fld"><label>Phone</label><input value={settings.phone} onChange={e=>setSettings({...settings,phone:e.target.value})}/></div><div className="fld"><label>Public Email</label><input value={settings.email} onChange={e=>setSettings({...settings,email:e.target.value})} placeholder="info@rentblackbear.com"/></div><div className="fld"><label>City</label><input value={settings.city} onChange={e=>setSettings({...settings,city:e.target.value})}/></div></div><div className="fld"><label>PM Notification Email <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",letterSpacing:0}}>{"\u2014"} where you receive application, lease, and payment alerts</span></label><input type="email" value={settings.pmEmail||""} onChange={e=>setSettings({...settings,pmEmail:e.target.value})} placeholder="blackbearhousing@gmail.com"/></div>
        </div></div>
        {/* Email Templates */}
        {(()=>{
          const etOpen=expanded.emailTemplatesOpen;
          const tmpl=settings.emailTemplates||{};
          const def=DEF_SETTINGS.emailTemplates;
          const TEMPLATES=[
            {key:"refEmployer",label:"Employer Reference",subjectKey:"refEmployerSubject",bodyKey:"refEmployerBody",tokens:["{refName}","{applicantName}","{applicantFirstName}","{pmName}","{companyName}","{city}","{phone}","{email}"]},
            {key:"refPersonal",label:"Personal Reference",subjectKey:"refPersonalSubject",bodyKey:"refPersonalBody",tokens:["{refName}","{applicantName}","{applicantFirstName}","{pmName}","{companyName}","{city}","{phone}","{email}"]},
            {key:"refLandlord",label:"Previous Landlord",subjectKey:"refLandlordSubject",bodyKey:"refLandlordBody",tokens:["{refName}","{applicantName}","{applicantFirstName}","{address}","{pmName}","{companyName}","{city}","{phone}","{email}"]},
            {key:"reupload",label:"Re-Upload Request",subjectKey:"reuploadSubject",bodyKey:"reuploadBody",tokens:["{applicantFirstName}","{docLabel}","{portalLink}","{pmName}","{companyName}"]},
          ];
          const[etTab,setEtTab]=[expanded.emailTemplatesTab||"refEmployer",(v)=>setExpanded(p=>({...p,emailTemplatesTab:v}))];
          const curTpl=TEMPLATES.find(t=>t.key===etTab)||TEMPLATES[0];
          const setTmplField=(k,v)=>setSettings(p=>({...p,emailTemplates:{...(p.emailTemplates||{}),emailTemplates:{...(p.emailTemplates||{}),[k]:v},[k]:v}}));
          return(
          <div className="card" id="email-templates-section" style={{marginTop:12}} ref={el=>{if(el&&etOpen)setTimeout(()=>el.scrollIntoView({behavior:"smooth",block:"start"}),150)}}>            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",cursor:"pointer",borderBottom:etOpen?"1px solid rgba(0,0,0,.06)":"none"}} onClick={()=>setExpanded(p=>({...p,emailTemplatesOpen:!etOpen}))}>
              <div>
                <h3 style={{fontSize:13,fontWeight:800,margin:0}}>Email Templates</h3>
                <p style={{fontSize:11,color:"#5c4a3a",margin:"2px 0 0"}}>Edit the outgoing reference and re-upload email templates. Use tokens to insert dynamic values.</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" style={{transform:etOpen?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {etOpen&&<div style={{padding:"16px"}}>
              {/* Tab row */}
              <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
                {TEMPLATES.map(t=><button key={t.key} onClick={()=>setEtTab(t.key)} style={{fontSize:10,fontWeight:700,padding:"5px 12px",borderRadius:6,border:"1px solid "+(etTab===t.key?"#1a1714":"rgba(0,0,0,.1)"),background:etTab===t.key?"#1a1714":"#fff",color:etTab===t.key?"#f5f0e8":"#5c4a3a",cursor:"pointer",fontFamily:"inherit"}}>{t.label}</button>)}
              </div>
              {/* Subject */}
              <div className="fld">
                <label>Subject Line</label>
                <input value={tmpl[curTpl.subjectKey]||def[curTpl.subjectKey]||""} onChange={e=>setTmplField(curTpl.subjectKey,e.target.value)} style={{width:"100%",fontFamily:"inherit"}}/>
              </div>
              {/* Body */}
              <div className="fld">
                <label>Body</label>
                <textarea value={tmpl[curTpl.bodyKey]||def[curTpl.bodyKey]||""} onChange={e=>setTmplField(curTpl.bodyKey,e.target.value)} rows={12} style={{width:"100%",fontFamily:"inherit",fontSize:12,padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",resize:"vertical"}}/>
              </div>
              {/* Token legend */}
              <div style={{padding:"10px 12px",background:"rgba(0,0,0,.03)",borderRadius:7,border:"1px solid rgba(0,0,0,.06)",marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>Available Tokens</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {curTpl.tokens.map(t=><code key={t} style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"rgba(74,124,89,.08)",color:"#2d6a3f",fontFamily:"monospace"}}>{t}</code>)}
                </div>
              </div>
              {/* Reset + Save */}
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-out btn-sm" onClick={()=>{setTmplField(curTpl.subjectKey,def[curTpl.subjectKey]);setTmplField(curTpl.bodyKey,def[curTpl.bodyKey]);}}>Reset to Default</button>
                <button className="btn btn-gold btn-sm" onClick={()=>{}}>{"✓"} Saved Automatically</button>
              </div>
            </div>}
          </div>);
        })()}
        {/* Signature Settings */}
        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Property Manager Signature</h3>
          <p style={{fontSize:11,color:"#5c4a3a",marginBottom:12}}>Saved here and auto-offered when signing leases. Draw a new one anytime to replace it.</p>
          {settings.savedSignature
            ?<div>
              <div style={{padding:12,background:"#faf9f7",border:"1px solid rgba(0,0,0,.08)",borderRadius:8,display:"inline-block",marginBottom:10}}>
                <img src={settings.savedSignature} alt="Saved signature" style={{maxHeight:70,maxWidth:260,display:"block"}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-out btn-sm" onClick={()=>setExpanded(p=>({...p,redrawSig:!p.redrawSig}))}>
                  {expanded.redrawSig?"Cancel Redraw":"Redraw Signature"}
                </button>
                <button className="btn btn-red btn-sm" onClick={()=>{setSettings(p=>{const u={...p,savedSignature:null};save("hq-settings",u);return u;});}}>
                  Remove
                </button>
              </div>
              {expanded.redrawSig&&<div style={{marginTop:12}}>
                <SigCanvas onSave={(data)=>{setSettings(p=>{const u={...p,savedSignature:data};save("hq-settings",u);return u;});setExpanded(p=>({...p,redrawSig:false}));}} height={100}/>
              </div>}
            </div>
            :<div>
              <div style={{fontSize:11,color:"#6b5e52",marginBottom:10}}>No signature saved yet. Draw one below and it will be offered automatically when signing leases.</div>
              <SigCanvas onSave={(data)=>{setSettings(p=>{const u={...p,savedSignature:data};save("hq-settings",u);return u;});}} height={100}/>
            </div>
          }
        </div></div>

        {/* Email Notifications */}
        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Email Notifications</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>Choose which events trigger an email to you at <strong>{settings.email||"info@rentblackbear.com"}</strong>. Tenant-facing emails always send regardless.</p>
          {[
            {key:"notifPrescreen",label:"New pre-screen submitted",desc:"When someone passes the qualifying questions and submits their contact info"},
            {key:"notifAppReceived",label:"New full application received",desc:"When an invited applicant submits their full application"},
            {key:"notifLeaseSent",label:"Lease sent for signatures",desc:"When you send a lease to a tenant"},
            {key:"notifLeaseSigned",label:"Tenant signs lease",desc:"When a tenant completes their e-signature"},
            {key:"notifPaymentReceived",label:"Payment received",desc:"When a tenant makes a payment (SD, rent, prorated rent)"},
            {key:"notifMaintenanceRequest",label:"Maintenance request",desc:"When a tenant submits a maintenance request"},
          ].map(({key,label,desc})=>(
            <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>{label}</div>
                <div style={{fontSize:10,color:"#6b5e52",marginTop:1}}>{desc}</div>
              </div>
              <button onClick={()=>setSettings(p=>{const u={...p,[key]:!p[key]};save("hq-settings",u);return u;})} style={{
                flexShrink:0,marginLeft:12,width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",
                background:settings[key]!==false?"#4a7c59":"rgba(0,0,0,.1)",
                transition:"background .2s",position:"relative",
              }}>
                <div style={{
                  position:"absolute",top:3,left:settings[key]!==false?22:3,width:18,height:18,borderRadius:"50%",
                  background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"
                }}/>
              </button>
            </div>
          ))}
          <div style={{marginTop:12,padding:"8px 12px",background:"rgba(212,168,83,.06)",borderRadius:6,fontSize:11,color:"#9a7422"}}>
            Notification emails are sent to <strong>{settings.email||"info@rentblackbear.com"}</strong>. Update your email in Company Info above.
          </div>
        </div></div>

        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Email Templates</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>Customize the subject line and body of notification emails sent to you. Use <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"name{"+"}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"property{"+"}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"room{"+"}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"amount{"+"}"}</code> as placeholders.</p>
          {[
            {key:"prescreen",label:"Pre-Screen Alert (to you)",icon:"\ud83d\udccb",desc:"Sent to PM when someone completes the qualifying questions"},
            {key:"prescreenTenant",label:"Pre-Screen Confirmation (to applicant)",icon:"\u2709\ufe0f",desc:"Sent to the applicant after they pass the pre-screen \u2014 the '24 hours' email"},
            {key:"application",label:"Full Application Received",icon:"\ud83d\udcdd",desc:"Sent when an invited applicant submits their full application"},
            {key:"leaseSigned",label:"Lease Signed",icon:"\u270d\ufe0f",desc:"Sent when a tenant e-signs their lease"},
            {key:"payment",label:"Payment Received",icon:"\ud83d\udcb0",desc:"Sent when a payment is recorded"},
          ].map(({key,label,icon,desc})=>{
            const tpl=settings.emailTemplates||DEF_SETTINGS.emailTemplates;
            const subjKey=key+"Subject";const bodyKey=key+"Body";
            return(<div key={key} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <div style={{fontSize:11,fontWeight:800,color:"#1a1714",marginBottom:2}}>{icon} {label}</div>
              <div style={{fontSize:10,color:"#6b5e52",marginBottom:8}}>{desc}</div>
              <div className="fld" style={{marginBottom:6}}>
                <label>Subject Line</label>
                <input value={tpl[subjKey]||DEF_SETTINGS.emailTemplates[subjKey]||""} placeholder={DEF_SETTINGS.emailTemplates[subjKey]}
                  onChange={e=>setSettings(s=>({...s,emailTemplates:{...(s.emailTemplates||DEF_SETTINGS.emailTemplates),[subjKey]:e.target.value}}))}/>
              </div>
              <div className="fld" style={{marginBottom:0}}>
                <label style={{display:"flex",justifyContent:"space-between"}}>Body
                  <button className="btn btn-out btn-sm" style={{fontSize:8}} onClick={()=>setSettings(s=>({...s,emailTemplates:{...(s.emailTemplates||DEF_SETTINGS.emailTemplates),[subjKey]:DEF_SETTINGS.emailTemplates[subjKey],[bodyKey]:DEF_SETTINGS.emailTemplates[bodyKey]}}))}>{"↺"} Reset</button>
                </label>
                <textarea value={tpl[bodyKey]||DEF_SETTINGS.emailTemplates[bodyKey]||""} rows={2} placeholder={DEF_SETTINGS.emailTemplates[bodyKey]}
                  onChange={e=>setSettings(s=>({...s,emailTemplates:{...(s.emailTemplates||DEF_SETTINGS.emailTemplates),[bodyKey]:e.target.value}}))}
                  style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"vertical",lineHeight:1.5}}/>
              </div>
            </div>);
          })}
          <button className="btn btn-gold" style={{width:"100%",marginTop:4}} onClick={()=>save("hq-settings",settings)}>Save Email Templates</button>
        </div></div>

        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Utility Clause Templates</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>These clauses auto-populate into leases based on the utility setting of each unit. Edit the clause text here to change what appears in all future leases.</p>
          {(settings.utilTemplates||DEF_SETTINGS.utilTemplates).map((t,i)=>(
            <div key={t.id} style={{border:"0.5px solid rgba(0,0,0,.08)",borderRadius:8,padding:12,marginBottom:8,background:"rgba(0,0,0,.01)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>{t.name}</div>
                  <div style={{fontSize:10,color:"#6b5e52",marginTop:1}}>{t.desc}</div>
                </div>
                <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:8,background:"rgba(0,0,0,.05)",color:"#6b5e52",fontFamily:"monospace"}}>{t.key}</span>
              </div>
              <div className="fld" style={{marginBottom:0}}>
                <label>Lease clause text</label>
                <textarea rows={3} value={t.clause||""} onChange={e=>{const updated=(settings.utilTemplates||DEF_SETTINGS.utilTemplates).map((x,j)=>j===i?{...x,clause:e.target.value}:x);setSettings(p=>({...p,utilTemplates:updated}));}} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/>
              </div>
            </div>
          ))}
          <button className="btn btn-gold" style={{width:"100%",marginTop:4}} onClick={()=>save("hq-settings",settings)}>Save Utility Clauses</button>
        </div></div>

        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Lease & Month-to-Month Settings</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>Controls automatic month-to-month conversion and daily payment reminders.</p>
          <div className="fr" style={{marginBottom:12}}>
            <div className="fld" style={{marginBottom:0}}>
              <label>Month-to-Month Rent Increase <span style={{fontWeight:400,color:"#6b5e52"}}>($/mo added when lease converts)</span></label>
              <div style={{display:"flex",alignItems:"center",gap:0}}>
                <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
                <input type="number" min={0} value={settings.m2mIncrease||50} onChange={e=>{const u={...settings,m2mIncrease:Number(e.target.value)};setSettings(u);save("hq-settings",u);}} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",width:"100%"}}/>
              </div>
            </div>
            <div className="fld" style={{marginBottom:0}}>
              <label>Renewal Prompt <span style={{fontWeight:400,color:"#6b5e52"}}>(days before expiry to show renewal options)</span></label>
              <input type="number" min={7} max={180} value={settings.m2mNoticeDays||90} onChange={e=>{const u={...settings,m2mNoticeDays:Number(e.target.value)};setSettings(u);save("hq-settings",u);}} style={{width:"100%"}}/>
            </div>
          </div>
          <div className="fld" style={{marginBottom:12}}>
            <label>Renewal Term Options <span style={{fontWeight:400,color:"#6b5e52"}}>(comma-separated months, e.g. 6,12)</span></label>
            <input value={(settings.renewalTerms||[12]).join(",")} onChange={e=>{const u={...settings,renewalTerms:e.target.value.split(",").map(v=>Number(v.trim())).filter(v=>v>0)};setSettings(u);save("hq-settings",u);}} placeholder="6,12" style={{width:"100%"}}/>
          </div>
          <div className="fld" style={{marginBottom:12}}>
            <label>Tenant Portal Language <span style={{fontWeight:400,color:"#6b5e52"}}>(default language for all tenant portals)</span></label>
            <select value={settings.portalLanguage||"en"} onChange={e=>{const u={...settings,portalLanguage:e.target.value};setSettings(u);save("hq-settings",u);}} style={{width:"100%"}}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,cursor:"pointer"}}>
            <input type="checkbox" checked={settings.autoReminders!==false} onChange={e=>{const u={...settings,autoReminders:e.target.checked};setSettings(u);save("hq-settings",u);}}/>
            <span>Auto-send daily payment reminders for past-due charges (stops when paid)</span>
          </label>
        </div></div>

        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Door Lock & Access</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>Configure how tenants can change their door codes through the portal.</p>
          <div className="fr" style={{marginBottom:12}}>
            <div className="fld" style={{marginBottom:0}}>
              <label>Lock Type</label>
              <select value={settings.lockType||"dumb"} onChange={e=>{const u={...settings,lockType:e.target.value};setSettings(u);save("hq-settings",u);}} style={{width:"100%"}}>
                <option value="dumb">Standard Lock (manual code change)</option>
                <option value="smart_manual">Smart Lock (PM updates remotely)</option>
                <option value="smart_api">Smart Lock with API (auto-update)</option>
              </select>
            </div>
            <div className="fld" style={{marginBottom:0}}>
              <label>Allow Tenants to Change Code</label>
              <select value={settings.allowDoorCodeChange===false?"no":"yes"} onChange={e=>{const u={...settings,allowDoorCodeChange:e.target.value==="yes"};setSettings(u);save("hq-settings",u);}} style={{width:"100%"}}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div style={{fontSize:9,color:"#6b5e52"}}>
            {(settings.lockType||"dumb")==="smart_api"?"Codes update automatically via lock API.":
             (settings.lockType||"dumb")==="smart_manual"?"You will be notified to update the lock remotely.":
             "A maintenance request will be created for physical code changes."}
          </div>
        </div></div>

        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Occupancy Policy Default</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>Sets the default answer to {"\u201c"}Allow a couple in this bedroom?{"\u201d"} when reviewing new applicants. Can be overridden per-property or per-application.</p>
          <div style={{display:"flex",gap:8}}>
            {[{val:false,label:"No \u2014 1 adult per bedroom",sub:"Default for most co-living setups"},{val:true,label:"Yes \u2014 couples OK by default",sub:"Can still deny per-applicant"}].map(({val,label,sub})=>(
              <button key={String(val)} style={{flex:1,padding:"10px 12px",borderRadius:8,border:"2px solid "+((settings.couplesDefault||false)===val?(val?"rgba(74,124,89,.7)":"rgba(196,92,74,.5)"):"rgba(0,0,0,.08)"),background:(settings.couplesDefault||false)===val?(val?"rgba(74,124,89,.06)":"rgba(196,92,74,.04)"):"#fff",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
                onClick={()=>{const u={...settings,couplesDefault:val};setSettings(u);save("hq-settings",u);}}>
                <div style={{fontSize:12,fontWeight:700,color:(settings.couplesDefault||false)===val?(val?"#2d6a3f":"#c45c4a"):"#1a1714",marginBottom:2}}>{label}</div>
                <div style={{fontSize:10,color:"#6b5e52"}}>{sub}</div>
              </button>
            ))}
          </div>
          <div style={{fontSize:10,color:"#6b5e52",marginTop:8}}>Current portfolio default: <strong>{(settings.couplesDefault||false)?"Couples allowed":"1 adult per bedroom"}</strong></div>
        </div></div>

        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Payment Reminder Template</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>This is the default message pre-filled every time you send a payment reminder. Edit and save to update the default for all future reminders.</p>
          <div className="fld">
            <label style={{display:"flex",justifyContent:"space-between"}}>
              Message Template
              <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setSettings(s=>({...s,reminderTemplate:DEF_SETTINGS.reminderTemplate}))}>{"↺"} Restore original</button>
            </label>
            <textarea value={settings.reminderTemplate||DEF_SETTINGS.reminderTemplate} onChange={e=>setSettings({...settings,reminderTemplate:e.target.value})} rows={4} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"vertical",lineHeight:1.6}}/>
          </div>
          <div style={{fontSize:9,color:"#6b5e52",marginTop:4,lineHeight:1.6}}>
            Available variables: <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{firstName}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{fullName}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{amount}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{dueDate}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{category}"}</code>
          </div>
          <div style={{marginTop:8,background:"rgba(212,168,83,.06)",borderRadius:6,padding:10,fontSize:11,color:"#9a7422"}}>
            <strong>Preview:</strong> {(settings.reminderTemplate||DEF_SETTINGS.reminderTemplate).replace(/{firstName}/g,"Marcus").replace(/{fullName}/g,"Marcus Johnson").replace(/{amount}/g,"$850.00").replace(/{dueDate}/g,"Mar 1, 2026").replace(/{category}/g,"Rent")}
          </div>
        </div></div>

        {/* Referral Program */}
        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Tenant Referral Program</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>Set the credit amount tenants earn when they refer a friend who signs a lease. Set to 0 to disable the referral program.</p>
          <div className="fld" style={{marginBottom:0}}>
            <label>Referral Credit Amount</label>
            <div style={{display:"flex",alignItems:"center",gap:0}}>
              <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
              <input type="number" min={0} value={settings.referralCredit||0} onChange={e=>{const u={...settings,referralCredit:Number(e.target.value)};setSettings(u);save("hq-settings",u);}} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",width:"100%"}}/>
            </div>
          </div>
          <div style={{fontSize:9,color:"#6b5e52",marginTop:6}}>This amount shows in the tenant portal{"\u2019"}s referral card. Credit is applied manually after the referred tenant signs a lease.</div>
        </div></div>

        {/* House Rules — managed in Templates */}
        <div style={{marginTop:12,padding:"10px 14px",background:"rgba(0,0,0,.03)",borderRadius:8,border:"1px solid rgba(0,0,0,.05)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:12,fontWeight:700}}>House Rules</div>
            <div style={{fontSize:10,color:"#6b5e52",marginTop:1}}>{(settings.houseRules||[]).length} rules configured</div>
          </div>
          <div style={{fontSize:11,color:"#6b5e52"}}>Manage in Templates tab</div>
        </div>
    </>
  );
}
