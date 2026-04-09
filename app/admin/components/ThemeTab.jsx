"use client";
import { useState } from "react";

export default function ThemeTab({
  settings, setSettings, save, expanded, setExpanded, setModal,
  theme, setTheme, savedThemes, setSavedThemes, setNotifs, uid, TODAY,
  ADMIN_PRESETS, ADMIN_FONTS, PRESETS, THEME_LABELS,
  contrast, randPalette, getPropDisplayName,
}) {
  const tSub=expanded.themeSubTab||"admin";
  const setTSub=v=>setExpanded(p=>({...p,themeSubTab:v}));
  const applyAdminPreset=(p)=>{const u={...settings,adminPresetId:p.id,adminAccent:p.accent,adminAccentRgb:p.accentRgb,adminFont:p.font};setSettings(u);save("hq-settings",u);};
  const applyAdminFont=(f)=>{const u={...settings,adminFont:f.stack};setSettings(u);save("hq-settings",u);};
  const applyAdminZoom=(z)=>{const u={...settings,adminZoom:z};setSettings(u);save("hq-settings",u);};
  const applyAdminAccent=(hex)=>{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);const rgb=r+","+g+","+b;const u={...settings,adminAccent:hex,adminAccentRgb:rgb,adminPresetId:"custom"};setSettings(u);save("hq-settings",u);};
  const saveCurrentTheme=()=>setModal({type:"saveTheme",themeName:""});
  const applyTheme=(t)=>setTheme({...t});
  const deleteTheme=(id)=>setSavedThemes(p=>p.filter(x=>x.id!==id));
  const pushToSite=()=>{save("hq-pub-theme",theme);setNotifs(p=>[{id:uid(),type:"app",msg:"Theme published to live site",date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);setExpanded(pr=>({...pr,themePushSuccess:true}));setTimeout(()=>setExpanded(pr=>({...pr,themePushSuccess:false})),3500);};
  const exportTheme=()=>{const css=Object.entries(theme).map(([k,v])=>`  --${k}: ${v};`).join(", ");const json=JSON.stringify(theme,null,2);const blob=new Blob([`:root {\n${css}\n}\n\n/* JSON */\n${json}`],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="blackbear-theme.css";a.click();URL.revokeObjectURL(url);};
  const _acc=settings.adminAccent||"#4a7c59";
  const _zoom=settings.adminZoom||1;
  const _font=settings.adminFont||"'Plus Jakarta Sans',system-ui,sans-serif";
  const _pid=settings.adminPresetId||"forest";

  return(<>
    <div className="sec-hd"><div><h2>Theme Editor</h2><p>Customize your admin interface and public site colors</p></div></div>
    <div style={{display:"flex",gap:0,marginBottom:20,border:"1px solid rgba(0,0,0,.07)",borderRadius:9,overflow:"hidden",width:"fit-content"}}>
      {[["admin","Admin Interface"],["site","Public Site"]].map(([k,lb])=>(
        <button key={k} onClick={()=>setTSub(k)} style={{padding:"8px 22px",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",background:tSub===k?_acc:"#fff",color:tSub===k?"#fff":"#5c4a3a",borderRight:k==="admin"?"1px solid rgba(0,0,0,.07)":"none"}}>
          {lb}
        </button>
      ))}
    </div>

    {tSub==="admin"&&<>
      <div className="card" style={{marginBottom:12}}><div className="card-bd">
        <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Style Preset</h3>
        <p style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>Pick a preset to instantly change the admin accent color. Saves automatically.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
          {ADMIN_PRESETS.map(p=>{
            const isActive=_pid===p.id;
            return(<div key={p.id} onClick={()=>applyAdminPreset(p)} style={{cursor:"pointer",borderRadius:10,border:"2px solid "+(isActive?p.accent:"rgba(0,0,0,.07)"),overflow:"hidden",transition:"all .15s",boxShadow:isActive?"0 0 0 3px "+p.accent+"22":"none"}}>
              <div style={{display:"flex",height:72}}>
                <div style={{width:28,background:"#1a1714",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:8,gap:5}}>
                  <div style={{width:14,height:14,borderRadius:3,background:p.accent}}/>
                  <div style={{width:14,height:3,borderRadius:2,background:"rgba(255,255,255,.2)"}}/>
                  <div style={{width:14,height:3,borderRadius:2,background:"rgba(255,255,255,.2)"}}/>
                  <div style={{width:14,height:3,borderRadius:2,background:"rgba(255,255,255,.2)"}}/>
                </div>
                <div style={{flex:1,background:"#f4f3f0",padding:6,display:"flex",flexDirection:"column",gap:4}}>
                  <div style={{background:"#fff",borderRadius:4,padding:"3px 5px",fontSize:8,fontWeight:700,color:"#1a1714"}}>Dashboard</div>
                  <div style={{display:"flex",gap:3}}>
                    <div style={{background:p.accent,borderRadius:3,padding:"2px 6px",fontSize:7,color:"#fff",fontWeight:700}}>Button</div>
                    <div style={{background:p.accent+"22",borderRadius:3,padding:"2px 6px",fontSize:7,color:p.accent,fontWeight:700}}>Badge</div>
                  </div>
                </div>
              </div>
              <div style={{padding:"7px 10px",background:isActive?p.accent+"10":"#faf9f7",borderTop:"1px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,fontWeight:700,color:isActive?p.accent:"#1a1714"}}>{getPropDisplayName(p)||p.name}</span>
                {isActive&&<span style={{fontSize:9,fontWeight:700,color:p.accent}}>Active</span>}
              </div>
            </div>);})}
        </div>
      </div></div>

      <div className="card" style={{marginBottom:12}}><div className="card-bd">
        <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Accent Color</h3>
        <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>Fine-tune the accent color independently of the preset.</p>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{width:36,height:36,borderRadius:8,background:_acc,border:"1px solid rgba(0,0,0,.1)",cursor:"pointer",position:"relative",overflow:"hidden",flexShrink:0}}>
            <input type="color" value={_acc} onChange={e=>applyAdminAccent(e.target.value)} style={{position:"absolute",inset:-4,width:"calc(100% + 8px)",height:"calc(100% + 8px)",opacity:0,cursor:"pointer"}}/>
          </div>
          <div><div style={{fontSize:13,fontWeight:700,color:_acc}}>{_acc.toUpperCase()}</div><div style={{fontSize:10,color:"#6b5e52",marginTop:2}}>Click to pick a custom color</div></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginLeft:"auto"}}>
            {["#4a7c59","#3b6ea5","#b85c38","#2a7d7b","#2c3e50","#7c3aed","#b45309"].map(c=>(
              <div key={c} onClick={()=>applyAdminAccent(c)} style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",border:"2px solid "+(_acc===c?"#1a1714":"transparent"),transition:"border .15s"}}/>
            ))}
          </div>
        </div>
      </div></div>

      <div className="card" style={{marginBottom:12}}><div className="card-bd">
        <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Font</h3>
        <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>Changes the typeface across the entire admin interface.</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {ADMIN_FONTS.map(f=>{const isActive=_font===f.stack;return(
            <button key={f.name} onClick={()=>applyAdminFont(f)} style={{padding:"8px 16px",borderRadius:8,border:"1.5px solid "+(isActive?_acc:"rgba(0,0,0,.08)"),background:isActive?_acc+"12":"#fff",cursor:"pointer",fontFamily:f.stack,fontSize:13,fontWeight:isActive?700:400,color:isActive?_acc:"#1a1714",transition:"all .15s"}}>
              {f.name}
            </button>);})}
      </div></div></div>

      <div className="card"><div className="card-bd">
        <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Display Size</h3>
        <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>Scales the entire admin interface. Takes effect instantly.</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[[0.9,"90% — Compact"],[1,"100% — Default"],[1.15,"115% — Large"],[1.3,"130% — Largest"]].map(([z,lb])=>(
            <button key={z} onClick={()=>applyAdminZoom(z)} style={{padding:"9px 18px",borderRadius:8,border:"1.5px solid "+(_zoom===z?_acc:"rgba(0,0,0,.08)"),background:_zoom===z?_acc+"12":"#fff",cursor:"pointer",fontFamily:"inherit",fontWeight:_zoom===z?700:400,fontSize:13,color:_zoom===z?_acc:"#1a1714",transition:"all .15s"}}>
              {lb}
            </button>
          ))}
        </div>
      </div></div>

      {/* Mobile Tab Bar */}
      <div className="card" style={{marginBottom:12}}><div className="card-bd">
        <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Mobile Tab Bar</h3>
        <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>Pick up to 4 tabs for the bottom bar on mobile. "More" is always added automatically.</p>
        {(()=>{
          const ALL_MOB_TABS=[
            {id:"dashboard",label:"Dashboard"},{id:"tenants",label:"Tenants"},{id:"applications",label:"Applications"},
            {id:"accounting",label:"Accounting"},{id:"payments",label:"Tenant Ledger"},{id:"maintenance",label:"Maintenance"},
            {id:"timeline",label:"Tenant Timeline"},{id:"leases",label:"Templates"},{id:"properties",label:"Properties"},{id:"reports",label:"Reports"},
          ];
          const cur=settings.mobileTabs||["dashboard","tenants","applications","accounting"];
          const saveMobTabs=(tabs)=>{const u={...settings,mobileTabs:tabs};setSettings(u);save("hq-settings",u);};
          const toggle=(id)=>{
            if(cur.includes(id)){saveMobTabs(cur.filter(x=>x!==id));}
            else if(cur.length<4){saveMobTabs([...cur,id]);}
          };
          return(<>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {ALL_MOB_TABS.map((t,i)=>{
                const on=cur.includes(t.id);
                const pos=cur.indexOf(t.id);
                return(
                <button key={t.id} onClick={()=>toggle(t.id)}
                  style={{padding:"7px 14px",borderRadius:8,border:`1.5px solid ${on?_acc:"rgba(0,0,0,.08)"}`,background:on?_acc+"18":"#fff",cursor:!on&&cur.length>=4?"not-allowed":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:on?700:400,color:on?_acc:"#5c4a3a",opacity:!on&&cur.length>=4?.4:1,transition:"all .15s",display:"flex",alignItems:"center",gap:6}}>
                  {on&&<span style={{width:16,height:16,borderRadius:"50%",background:_acc,color:"#fff",fontSize:9,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{pos+1}</span>}
                  {t.label}
                </button>);
              })}
            </div>
            <div style={{marginTop:10,fontSize:11,color:"#6b5e52"}}>
              Selected ({cur.length}/4): <strong style={{color:_acc}}>{cur.map(id=>ALL_MOB_TABS.find(t=>t.id===id)?.label||id).join(" · ")}</strong>
              {cur.length>0&&<button onClick={()=>saveMobTabs(["dashboard","tenants","applications","accounting"])} style={{marginLeft:10,fontSize:10,background:"none",border:"none",cursor:"pointer",color:"#9a7422",fontFamily:"inherit",textDecoration:"underline",padding:0}}>Reset to default</button>}
            </div>
          </>);
        })()}
      </div></div>
    </>}

    {tSub==="site"&&<>
      <div style={{display:"flex",justifyContent:"flex-end",gap:6,marginBottom:14}}>
        <button className="btn btn-green" onClick={pushToSite}>Push to Site</button>
        <button className="btn btn-gold" onClick={saveCurrentTheme}>Save Theme</button>
        <button className="btn btn-out" onClick={exportTheme}>Export CSS</button>
        <button className="btn btn-out" onClick={()=>setTheme(randPalette())}>Random Palette</button>
      </div>
      {expanded.themePushSuccess&&<div style={{marginBottom:10,padding:"9px 12px",background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,fontSize:11,color:"#4a7c59",fontWeight:700,animation:"fadeIn .3s"}}>Theme is live on rentblackbear.com</div>}
      <div className="card" style={{marginBottom:12}}><div className="card-bd">
        <h3 style={{fontSize:13,fontWeight:800,marginBottom:10}}>Color Presets</h3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {Object.entries(PRESETS).map(([n,c])=><button key={n} className="btn btn-out btn-sm" onClick={()=>applyTheme(c)}><span style={{width:10,height:10,borderRadius:"50%",background:c.accent,display:"inline-block",marginRight:4}}/>{n}</button>)}
        </div>
        {savedThemes.length>0&&<>
          <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Your Saved Themes</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {savedThemes.map(st=>(
              <div key={st.id} style={{display:"flex",alignItems:"center",border:"1px solid rgba(0,0,0,.06)",borderRadius:6,overflow:"hidden"}}>
                <button className="btn btn-out btn-sm" style={{borderRadius:0,border:"none"}} onClick={()=>applyTheme(st.colors)}>
                  <div style={{display:"flex",gap:2,marginRight:4}}>{[st.colors.bg,st.colors.accent,st.colors.green,st.colors.text].map((c,i)=><span key={i} style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>)}</div>
                  {st.name}
                </button>
                <button style={{background:"none",border:"none",borderLeft:"1px solid rgba(0,0,0,.06)",padding:"4px 8px",cursor:"pointer",color:"#c45c4a",fontSize:10}} onClick={()=>deleteTheme(st.id)}>x</button>
              </div>
            ))}
          </div>
        </>}
      </div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignItems:"start"}}>
        <div className="card"><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:14}}>Color Tokens</h3>
          {Object.entries(THEME_LABELS).map(([k,label])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:28,height:28,borderRadius:6,background:theme[k],border:"1px solid rgba(0,0,0,.1)",cursor:"pointer",position:"relative",overflow:"hidden",flexShrink:0}}><input type="color" value={theme[k]} onChange={e=>setTheme({...theme,[k]:e.target.value})} style={{position:"absolute",inset:-4,width:"calc(100% + 8px)",height:"calc(100% + 8px)",opacity:0,cursor:"pointer"}}/></div>
            <span style={{fontSize:11,fontWeight:600,flex:1}}>{label}</span>
            <input value={theme[k]} onChange={e=>{if(/^#[0-9a-fA-F]{6}$/.test(e.target.value))setTheme({...theme,[k]:e.target.value});}} style={{width:80,padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"monospace"}}/>
          </div>))}
        </div></div>
        <div style={{position:"sticky",top:80}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#6b5e52",marginBottom:8}}>Live Preview</div>
          <div style={{borderRadius:12,overflow:"hidden",border:"1px solid rgba(0,0,0,.06)"}}>
            <div style={{background:theme.bg,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:theme.text,fontWeight:700,fontSize:11}}>BB <span style={{color:theme.accent}}>Rentals</span></span><div style={{background:theme.accent,color:contrast(theme.accent),padding:"3px 8px",borderRadius:4,fontSize:8,fontWeight:700}}>Apply</div></div>
            <div style={{background:theme.surface,padding:10}}><div style={{background:"#fff",borderRadius:5,padding:6,border:"1px solid rgba(0,0,0,.04)",marginBottom:4}}><div style={{display:"flex",gap:3,marginBottom:3}}><span style={{background:theme.green+"18",color:theme.green,padding:"1px 5px",borderRadius:100,fontSize:6,fontWeight:700}}>Available</span></div><div style={{fontFamily:"Georgia,serif",fontSize:10,color:theme.dark}}>The Holmes House</div><div style={{fontSize:7,color:theme.warm}}>$600-$850/mo</div></div></div>
            <div style={{background:theme.card,padding:"10px 12px",textAlign:"center"}}><div style={{background:theme.accent,color:contrast(theme.accent),padding:"5px 14px",borderRadius:5,fontSize:9,fontWeight:700,display:"inline-block"}}>Apply Now</div></div>
          </div>
          <div style={{marginTop:14,background:"rgba(74,124,89,.06)",borderRadius:8,padding:12,fontSize:11,color:"#4a7c59"}}>Click Push to Site to update rentblackbear.com.</div>
        </div>
      </div>
    </>}
  </>);
}
