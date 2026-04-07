"use client";

export default function WebsiteSettings({ settings, setSettings, save }) {
  return (
    <>
      <div className="sec-hd"><div><h2>Website</h2><p>Public site content for rentblackbear.com</p></div></div>
      <div className="card"><div className="card-bd">
        <h3 style={{fontSize:13,fontWeight:800,marginBottom:12}}>Hero Section</h3>
        <div className="fld"><label>Tagline</label><input value={settings.tagline} onChange={e=>setSettings({...settings,tagline:e.target.value})}/></div>
        <div className="fr"><div className="fld"><label>Headline</label><input value={settings.heroHeadline} onChange={e=>setSettings({...settings,heroHeadline:e.target.value})}/></div><div className="fld"><label>Subline</label><input value={settings.heroSubline} onChange={e=>setSettings({...settings,heroSubline:e.target.value})}/></div></div>
        <div className="fld"><label>Description</label><textarea value={settings.heroDesc} onChange={e=>setSettings({...settings,heroDesc:e.target.value})}/></div>
        <button className="btn btn-gold" style={{width:"100%",marginTop:8}} onClick={()=>save("hq-settings",settings)}>Save & Publish</button>
      </div></div>
      <div style={{marginTop:12,padding:"12px 16px",background:"rgba(212,168,83,.06)",borderRadius:10,border:"1px solid rgba(212,168,83,.15)",fontSize:11,color:"#9a7422"}}>
        These settings control your public portfolio website. SaaS PMs will not see this section{"\u2014"}they manage their own tenant-facing portal through PM Settings.
      </div>
    </>
  );
}
