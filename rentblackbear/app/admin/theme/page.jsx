"use client";
// ═══════════════════════════════════════════════════════════════════
// THEME EDITOR — Change colors at rentblackbear.com/admin/theme
// After choosing colors, update the THEME object in lib/data.js
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import Link from "next/link";
import { THEME } from "../../../lib/data";

const LABELS={bg:{l:"Background",d:"Nav, hero, footer"},card:{l:"Card Dark",d:"Dark sections"},accent:{l:"Accent",d:"Buttons, highlights"},text:{l:"Light Text",d:"Text on dark"},muted:{l:"Muted",d:"Secondary text"},surface:{l:"Surface",d:"Light backgrounds"},surfaceAlt:{l:"Surface Alt",d:"Off-white sections"},green:{l:"Success",d:"Available tags"},dark:{l:"Dark Text",d:"Headings on light"},warm:{l:"Warm Gray",d:"Body text on light"}};
const PRESETS={"Warm Lodge":{bg:"#1a1714",card:"#2c2520",accent:"#d4a853",text:"#f5f0e8",muted:"#c4a882",surface:"#fefdfb",surfaceAlt:"#f5f0e8",green:"#4a7c59",dark:"#1a1714",warm:"#5c4a3a"},"Midnight":{bg:"#0f1729",card:"#1a2540",accent:"#3b82f6",text:"#e8ecf4",muted:"#8899b8",surface:"#fafbfe",surfaceAlt:"#eef2f9",green:"#22c55e",dark:"#0f1729",warm:"#64748b"},"Forest":{bg:"#1a2e1a",card:"#243524",accent:"#7cb342",text:"#e8f0e4",muted:"#a3b89a",surface:"#fafcf8",surfaceAlt:"#eef3ea",green:"#7cb342",dark:"#1a2e1a",warm:"#5a6b52"},"Charcoal":{bg:"#1c1c1e",card:"#2c2c2e",accent:"#d97756",text:"#f0edea",muted:"#a8a29e",surface:"#faf9f7",surfaceAlt:"#f0eeeb",green:"#5b9a6f",dark:"#1c1c1e",warm:"#78716c"},"Slate":{bg:"#1e293b",card:"#334155",accent:"#14b8a6",text:"#e2e8f0",muted:"#94a3b8",surface:"#f8fafc",surfaceAlt:"#f1f5f9",green:"#14b8a6",dark:"#1e293b",warm:"#64748b"},"Black Gold":{bg:"#0a0a0a",card:"#1a1a1a",accent:"#f0c040",text:"#f5f5f5",muted:"#999999",surface:"#fafafa",surfaceAlt:"#f0f0f0",green:"#4ade80",dark:"#0a0a0a",warm:"#737373"}};
function hslHex(h,s,l){s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h/30)%12;const c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,'0');};return`#${f(0)}${f(8)}${f(4)}`;}
function randPalette(){const h=Math.floor(Math.random()*360);const c=(h+150+Math.random()*60)%360;return{bg:hslHex(h,22+Math.random()*25,8+Math.random()*4),card:hslHex(h,18+Math.random()*20,14+Math.random()*4),accent:hslHex(c,65+Math.random()*25,55+Math.random()*15),text:hslHex(h,8+Math.random()*12,92+Math.random()*6),muted:hslHex(h,12+Math.random()*18,62+Math.random()*12),surface:hslHex(c,3+Math.random()*8,97+Math.random()*2),surfaceAlt:hslHex(c,5+Math.random()*10,93+Math.random()*3),green:hslHex(145+Math.random()*25,45+Math.random()*25,42+Math.random()*12),dark:hslHex(h,22+Math.random()*18,7+Math.random()*4),warm:hslHex(h,10+Math.random()*15,42+Math.random()*12)};}
function contrast(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return(r*299+g*587+b*114)/1000>128?"#1a1a1a":"#fff";}

export default function ThemeEditor(){
  const[colors,setColors]=useState({...THEME});
  const[copied,setCopied]=useState(false);
  const upd=(k,v)=>setColors(p=>({...p,[k]:v}));
  const doExport=()=>{const txt=`// Paste this into lib/data.js, replacing the existing THEME object:\nexport const THEME = ${JSON.stringify(colors,null,2)};`;navigator.clipboard?.writeText(txt);setCopied(true);setTimeout(()=>setCopied(false),2000);};

  return(<div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:"#f4f3f0",minHeight:"100vh"}}>
    <div style={{background:"#1a1714",padding:"28px 32px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div><div style={{fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:"#d4a853",marginBottom:4}}>rentblackbear.com/admin</div><h1 style={{fontFamily:"Georgia,serif",fontSize:24,color:"#f5f0e8"}}>Theme Editor</h1></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Link href="/admin" style={{padding:"9px 18px",borderRadius:8,background:"rgba(255,255,255,.1)",color:"#f5f0e8",fontSize:12,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:5}}>← Back to Dashboard</Link>
          <button onClick={()=>setColors(randPalette())} style={{padding:"9px 18px",borderRadius:8,background:"linear-gradient(135deg,#d4a853,#e8c060)",color:"#1a1714",border:"none",fontSize:12,fontWeight:700,cursor:"pointer"}}>🎲 Randomize</button>
          <button onClick={doExport} style={{padding:"9px 18px",borderRadius:8,background:"#fff",color:"#1a1714",border:"none",fontSize:12,fontWeight:700,cursor:"pointer"}}>{copied?"✓ Copied!":"📋 Export Theme"}</button>
        </div>
      </div>
    </div>

    <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 24px 64px"}}>
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {Object.entries(PRESETS).map(([name,c])=><button key={name} onClick={()=>setColors({...c})} style={{padding:"8px 16px",borderRadius:8,border:"1px solid rgba(0,0,0,.1)",background:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><span style={{width:12,height:12,borderRadius:"50%",background:c.accent,border:"1px solid rgba(0,0,0,.1)"}}/>{name}</button>)}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,alignItems:"start"}}>
        <div>{Object.entries(LABELS).map(([k,{l,d}])=><div key={k} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.06)",marginBottom:8}}>
          <div style={{width:44,height:44,borderRadius:10,background:colors[k],border:"2px solid rgba(0,0,0,.1)",cursor:"pointer",position:"relative",overflow:"hidden",flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.08)"}}>
            <input type="color" value={colors[k]} onChange={e=>upd(k,e.target.value)} style={{position:"absolute",inset:-8,width:60,height:60,opacity:0,cursor:"pointer"}}/>
          </div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{l}</div><div style={{fontSize:11,color:"#999"}}>{d}</div></div>
          <input value={colors[k]} onChange={e=>{if(/^#[0-9a-fA-F]{6}$/.test(e.target.value))upd(k,e.target.value);}} style={{width:86,padding:"8px 10px",borderRadius:8,border:"1px solid rgba(0,0,0,.12)",fontFamily:"monospace",fontSize:12,fontWeight:600,textAlign:"center",outline:"none",background:"#f8f8f8"}}/>
        </div>)}</div>

        <div style={{position:"sticky",top:24}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#5c4a3a",marginBottom:12}}>Preview</div>
          <div style={{borderRadius:16,overflow:"hidden",border:"1px solid rgba(0,0,0,.08)",boxShadow:"0 8px 32px rgba(0,0,0,.1)"}}>
            <div style={{background:colors.bg,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:colors.text,fontWeight:700,fontSize:13}}>🐻 Black Bear <span style={{color:colors.accent}}>Rentals</span></span><div style={{background:colors.accent,color:contrast(colors.accent),padding:"5px 12px",borderRadius:5,fontSize:10,fontWeight:700}}>Apply Now</div></div>
            <div style={{background:`linear-gradient(135deg,${colors.bg},${colors.card})`,padding:"30px 16px",textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",fontSize:22,color:colors.text}}>Your Room Is Ready.</div><div style={{fontFamily:"Georgia,serif",fontSize:22,color:colors.accent,fontStyle:"italic",marginBottom:10}}>Everything's Included.</div><div style={{display:"flex",gap:6,justifyContent:"center"}}><div style={{background:colors.accent,color:contrast(colors.accent),padding:"6px 16px",borderRadius:6,fontSize:10,fontWeight:700}}>Browse</div><div style={{border:`1px solid ${colors.muted}66`,color:colors.text,padding:"6px 16px",borderRadius:6,fontSize:10}}>Qualify</div></div></div>
            <div style={{background:colors.surface,padding:16}}><div style={{background:"#fff",borderRadius:8,padding:10,border:"1px solid rgba(0,0,0,.06)"}}><div style={{display:"flex",gap:4,marginBottom:6}}><span style={{background:`${colors.green}18`,color:colors.green,padding:"2px 6px",borderRadius:100,fontSize:7,fontWeight:700}}>Available</span><span style={{background:`${colors.warm}15`,color:colors.warm,padding:"2px 6px",borderRadius:100,fontSize:7,fontWeight:700}}>SFH</span></div><div style={{fontFamily:"Georgia,serif",fontSize:12,color:colors.dark}}>The Holmes House</div><div style={{fontSize:8,color:colors.warm,marginTop:2}}>$600–$850/mo per room</div></div></div>
            <div style={{background:colors.card,padding:"12px 16px",textAlign:"center"}}><div style={{background:colors.accent,color:contrast(colors.accent),padding:"6px 16px",borderRadius:6,fontSize:10,fontWeight:700,display:"inline-block"}}>Apply Now</div></div>
          </div>
          <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}><div style={{background:colors.accent,color:contrast(colors.accent),padding:"8px 18px",borderRadius:6,fontSize:12,fontWeight:700}}>Button</div><div style={{background:colors.green,color:"#fff",padding:"8px 18px",borderRadius:6,fontSize:12,fontWeight:700}}>Available</div><div style={{border:`2px solid ${colors.dark}`,color:colors.dark,padding:"8px 18px",borderRadius:6,fontSize:12,fontWeight:600}}>Secondary</div></div>
        </div>
      </div>
    </div>
  </div>);
}
