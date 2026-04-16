"use client";
import { useState, useEffect, useRef } from "react";

// ── Storage ──────────────────────────────────────────────────────────
const SUPA_URL=process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Upload a file to Supabase Storage, return public URL
async function uploadPhoto(file,propId){
  const ext=file.name.split(".").pop()||"jpg";
  const path=`properties/${propId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  try{
    const r=await fetch(`${SUPA_URL}/storage/v1/object/property-photos/${path}`,{
      method:"POST",
      headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":file.type,"x-upsert":"true"},
      body:file,
    });
    if(!r.ok){const e=await r.text();console.error("Upload failed:",r.status,e);return null;}
    return `${SUPA_URL}/storage/v1/object/public/property-photos/${path}`;
  }catch(e){console.error("Upload error:",e);return null;}
}

// ── Helpers ──────────────────────────────────────────────────────────
const uid=()=>Math.random().toString(36).slice(2,9);
const TODAY=new Date();
const fmtD=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;};
const allRooms=(prop)=>{if(!prop)return[];if(prop.units&&prop.units.length>0)return prop.units.flatMap(u=>u.rooms||[]);return prop.rooms||[];};

// Property type → default unit config
const PROP_TYPES={
  SFH:{label:"SFH",units:[{name:"Main",label:""}]},
  Townhome:{label:"Townhome",units:[{name:"Main",label:""}]},
  Duplex:{label:"Duplex",units:[{name:"Unit A",label:"A"},{name:"Unit B",label:"B"}]},
  Triplex:{label:"Triplex",units:[{name:"Unit A",label:"A"},{name:"Unit B",label:"B"},{name:"Unit C",label:"C"}]},
  Fourplex:{label:"Fourplex",units:[{name:"Unit A",label:"A"},{name:"Unit B",label:"B"},{name:"Unit C",label:"C"},{name:"Unit D",label:"D"}]},
  ADU:{label:"ADU (Main + ADU)",units:[{name:"Main House",label:"Main"},{name:"ADU",label:"ADU"}]},
  Apartment:{label:"Apartment",units:[{name:"Unit 1",label:"1"}]},
};

// Default utility templates — fallback when settings?.utilTemplates is missing
const DEF_UTIL_TEMPLATES=[
  {id:"ut1",name:"All Utilities Included",key:"allIncluded",desc:"Landlord pays all utilities — water, sewer, garbage, electric, gas, and WiFi.",clause:"PROPERTY MANAGER agrees to pay all utilities including water, sewer, garbage, electricity, gas, and internet (WiFi). RESIDENT is responsible for no utility costs beyond the monthly rent."},
  {id:"ut2",name:"First $100 Covered — Overage Split",key:"first100",desc:"PM covers first $100/mo of combined utilities. Any overage is split equally among all residents. WiFi always included.",clause:"PROPERTY MANAGER agrees to pay the first $100.00 of combined utilities (water, sewer, garbage, electricity, and gas) per month. Any usage exceeding $100.00 per month shall be split equally among all current residents and billed on the 1st of each month. Internet (WiFi) is provided by PROPERTY MANAGER at no additional cost to RESIDENT."},
  {id:"ut8",name:"First $150 Covered — Overage Split",key:"first150",desc:"PM covers first $150/mo of combined utilities. Any overage is split equally among all residents. WiFi always included.",clause:"PROPERTY MANAGER agrees to pay the first $150.00 of combined utilities (water, sewer, garbage, electricity, and gas) per month. Any usage exceeding $150.00 per month shall be split equally among all current residents and billed on the 1st of each month. Internet (WiFi) is provided by PROPERTY MANAGER at no additional cost to RESIDENT."},
  {id:"ut5",name:"WiFi Included — Tenant Pays All Other Utilities",key:"wifiOnly",desc:"PM provides WiFi. Tenant pays water, electric, gas, and other utilities.",clause:"PROPERTY MANAGER provides internet (WiFi) at no cost to RESIDENT. RESIDENT is responsible for paying all other utilities including water, sewer, garbage, electricity, and gas, either directly to the provider or as billed by PROPERTY MANAGER."},
  {id:"ut6",name:"Owner Pays Water & WiFi — Tenant Splits Electric",key:"waterWifi",desc:"PM pays water, sewer, garbage, and WiFi. Electric is split equally among residents.",clause:"PROPERTY MANAGER agrees to pay water, sewer, garbage, and internet (WiFi). Electric and gas costs shall be split equally among all current residents and billed on the 1st of each month based on actual usage."},
  {id:"ut7",name:"Whole Unit — Tenant Pays All Utilities",key:"tenantPaysAll",desc:"Tenant is responsible for all utilities, set up in their own name.",clause:"RESIDENT is responsible for all utilities including water, sewer, garbage, electricity, gas, and internet. RESIDENT shall establish accounts in their name with all applicable utility providers prior to or on the move-in date. PROPERTY MANAGER is not responsible for any utility costs."},
  {id:"ut3",name:"Tenant Pays — Full Split (No Cap)",key:"fullSplit",desc:"All utilities split equally among residents with no cap.",clause:"All utility costs including water, sewer, garbage, electricity, and gas shall be split equally among all current residents and billed on the 1st of each month based on actual usage. Internet (WiFi) is provided by PROPERTY MANAGER at no additional cost to RESIDENT."},
  {id:"ut4",name:"Tenant Pays — Individually Metered",key:"metered",desc:"Each tenant pays their own metered usage directly to the provider.",clause:"RESIDENT is responsible for paying their individually metered utility usage directly to the utility provider. PROPERTY MANAGER is not responsible for any utility costs. Internet (WiFi) is provided by PROPERTY MANAGER at no additional cost to RESIDENT."},
];

// Helper to get utilTemplates from settings with fallback
const getUtilTemplates=(settings)=>settings?.utilTemplates||DEF_UTIL_TEMPLATES;

// ─── Photo Editor Modal ─────────────────────────────────────────────
function PhotoEditor({src,onSave,onClose,aspectLock=null}){
  const[brightness,setBrightness]=useState(100);
  const[contrast,setContrast]=useState(100);
  const[saturation,setSaturation]=useState(100);
  const[rotation,setRotation]=useState(0);
  const[rotInput,setRotInput]=useState("0");
  const[flipH,setFlipH]=useState(false);
  const[flipV,setFlipV]=useState(false);
  const[cropX,setCropX]=useState(0);
  const[cropY,setCropY]=useState(0);
  const[cropW,setCropW]=useState(100);
  const[cropH,setCropH]=useState(100);
  const[showGrid,setShowGrid]=useState(false);
  const[saving,setSaving]=useState(false);
  const imgRef=useRef(null);
  const previewRef=useRef(null);
  const rafRef=useRef(null);
  const layoutRef=useRef({dx:0,dy:0,dw:0,dh:0,imgW:0,imgH:0});
  const dragRef=useRef(null);
  const cropRef=useRef({x:0,y:0,w:100,h:100});

  const doRotate=(deg)=>{const r=((rotation+deg)%360+360)%360;const d=r>180?r-360:r;setRotation(d);setRotInput(String(d));};

  const applyAdjustments=(tc,rW,rH)=>{
    if(brightness===100&&contrast===100&&saturation===100)return;
    const id=tc.getImageData(0,0,rW,rH);const d=id.data;
    const bf=brightness/100;const cf=contrast/100;const sf=saturation/100;
    for(let i=0;i<d.length;i+=4){
      let r=d[i],g=d[i+1],b=d[i+2];
      r*=bf;g*=bf;b*=bf;
      r=(r-128)*cf+128;g=(g-128)*cf+128;b=(b-128)*cf+128;
      const gray=0.299*r+0.587*g+0.114*b;
      r=gray+(r-gray)*sf;g=gray+(g-gray)*sf;b=gray+(b-gray)*sf;
      d[i]=Math.max(0,Math.min(255,r));d[i+1]=Math.max(0,Math.min(255,g));d[i+2]=Math.max(0,Math.min(255,b));
    }
    tc.putImageData(id,0,0);
  };

  const buildRotated=()=>{
    const img=imgRef.current;if(!img)return null;
    const rad=rotation*Math.PI/180;
    const sin=Math.abs(Math.sin(rad));const cos=Math.abs(Math.cos(rad));
    const rW=Math.round(img.width*cos+img.height*sin);
    const rH=Math.round(img.width*sin+img.height*cos);
    const tmp=document.createElement("canvas");tmp.width=rW;tmp.height=rH;
    const tc=tmp.getContext("2d");
    tc.translate(rW/2,rH/2);tc.scale(flipH?-1:1,flipV?-1:1);tc.rotate(rad);
    tc.drawImage(img,-img.width/2,-img.height/2);
    applyAdjustments(tc,rW,rH);
    return{canvas:tmp,rW,rH};
  };

  const drawPreview=()=>{
    const c=previewRef.current;if(!c)return;
    const built=buildRotated();if(!built)return;
    const{canvas:tmp,rW,rH}=built;
    const cx=cropRef.current.x,cy=cropRef.current.y,cw=cropRef.current.w,ch=cropRef.current.h;
    const sx=Math.round(rW*cx/100);const sy=Math.round(rH*cy/100);
    const sw=Math.max(1,Math.round(rW*cw/100));const sh=Math.max(1,Math.round(rH*ch/100));
    c.width=c.offsetWidth||700;c.height=c.offsetHeight||420;
    const ctx=c.getContext("2d");
    ctx.fillStyle="#111";ctx.fillRect(0,0,c.width,c.height);
    const scale=Math.min((c.width-20)/sw,(c.height-20)/sh);
    const dx=(c.width-sw*scale)/2;const dy=(c.height-sh*scale)/2;
    const dw=sw*scale;const dh=sh*scale;
    ctx.drawImage(tmp,sx,sy,sw,sh,dx,dy,dw,dh);
    layoutRef.current={dx,dy,dw,dh,imgW:rW,imgH:rH,sx,sy,sw,sh,scale};
    const fullScale=Math.min((c.width-20)/rW,(c.height-20)/rH);
    ctx.strokeStyle="#d4a853";ctx.lineWidth=2;ctx.setLineDash([]);
    ctx.strokeRect(dx,dy,dw,dh);
    const hs=8;
    [[dx,dy],[dx+dw,dy],[dx,dy+dh],[dx+dw,dy+dh],
     [dx+dw/2,dy],[dx+dw/2,dy+dh],[dx,dy+dh/2],[dx+dw,dy+dh/2]
    ].forEach(([hx,hy])=>{
      ctx.fillStyle="#d4a853";ctx.fillRect(hx-hs/2,hy-hs/2,hs,hs);
    });
    if(showGrid){
      ctx.strokeStyle="rgba(255,255,255,.85)";ctx.lineWidth=1.5;
      for(let g=1;g<3;g++){
        ctx.beginPath();ctx.moveTo(dx+dw*g/3,dy);ctx.lineTo(dx+dw*g/3,dy+dh);ctx.stroke();
        ctx.beginPath();ctx.moveTo(dx,dy+dh*g/3);ctx.lineTo(dx+dw,dy+dh*g/3);ctx.stroke();
      }
      ctx.strokeStyle="rgba(212,168,83,.8)";ctx.lineWidth=1;ctx.setLineDash([4,3]);
      ctx.beginPath();ctx.moveTo(dx+dw/2,dy);ctx.lineTo(dx+dw/2,dy+dh);ctx.stroke();
      ctx.beginPath();ctx.moveTo(dx,dy+dh/2);ctx.lineTo(dx+dw,dy+dh/2);ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const scheduleDraw=()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);rafRef.current=requestAnimationFrame(drawPreview);};

  useEffect(()=>{
    const img=new Image();img.crossOrigin="anonymous";
    img.onload=()=>{
      imgRef.current=img;
      if(aspectLock){
        const[aw,ah]=aspectLock.split(":").map(Number);
        const ratio=aw/ah;const imgRatio=img.width/img.height;
        let w=100,h=100;
        if(imgRatio>ratio){w=ratio/imgRatio*100;}else{h=imgRatio/ratio*100;}
        const x=(100-w)/2;const y=(100-h)/2;
        cropRef.current={x,y,w,h};setCropX(x);setCropY(y);setCropW(w);setCropH(h);
      }else{cropRef.current={x:0,y:0,w:100,h:100};setCropX(0);setCropY(0);setCropW(100);setCropH(100);}
      scheduleDraw();
    };
    img.onerror=()=>console.warn("PhotoEditor: CORS issue");
    img.src=src;
  },[src]);

  useEffect(()=>{cropRef.current={x:cropX,y:cropY,w:cropW,h:cropH};scheduleDraw();},[brightness,contrast,saturation,rotation,flipH,flipV,cropX,cropY,cropW,cropH,showGrid]);

  const getHandle=(mx,my,dx,dy,dw,dh)=>{
    const hs=12;
    const pts=[
      {id:"tl",x:dx,y:dy},{id:"tr",x:dx+dw,y:dy},{id:"bl",x:dx,y:dy+dh},{id:"br",x:dx+dw,y:dy+dh},
      {id:"tm",x:dx+dw/2,y:dy},{id:"bm",x:dx+dw/2,y:dy+dh},
      {id:"ml",x:dx,y:dy+dh/2},{id:"mr",x:dx+dw,y:dy+dh/2},
    ];
    for(const p of pts)if(Math.abs(mx-p.x)<hs&&Math.abs(my-p.y)<hs)return p.id;
    if(mx>dx&&mx<dx+dw&&my>dy&&my<dy+dh)return"move";
    return null;
  };

  const canvasToImgPct=(cx,cy)=>{
    const{dx,dy,dw,dh,imgW,imgH,sx,sy,sw,sh}=layoutRef.current;
    const px=(cx-dx)/dw*sw+sx;const py=(cy-dy)/dh*sh+sy;
    return{px:Math.max(0,Math.min(imgW,px)),py:Math.max(0,Math.min(imgH,py))};
  };

  const onMouseDown=e=>{
    const c=previewRef.current;if(!c)return;
    const rect=c.getBoundingClientRect();
    const scaleX=c.width/rect.width;const scaleY=c.height/rect.height;
    const mx=(e.clientX-rect.left)*scaleX;const my=(e.clientY-rect.top)*scaleY;
    const{dx,dy,dw,dh,imgW,imgH}=layoutRef.current;
    const handle=getHandle(mx,my,dx,dy,dw,dh);
    dragRef.current={mode:handle||"draw",startMx:mx,startMy:my,
      startCX:cropX,startCY:cropY,startCW:cropW,startCH:cropH,
      imgW,imgH,dx,dy,dw,dh};
    e.preventDefault();
  };

  const onMouseMove=e=>{
    const d=dragRef.current;if(!d||!d.mode)return;
    const c=previewRef.current;if(!c)return;
    const rect=c.getBoundingClientRect();
    const scaleX=c.width/rect.width;const scaleY=c.height/rect.height;
    const mx=(e.clientX-rect.left)*scaleX;const my=(e.clientY-rect.top)*scaleY;
    const{dx,dy,dw,dh,imgW,imgH}=layoutRef.current;
    const pxPerPct=imgW/100;const pyPerPct=imgH/100;
    const dPctX=(mx-d.startMx)/dw*cropW;const dPctY=(my-d.startMy)/dh*cropH;
    let nx=cropX,ny=cropY,nw=cropW,nh=cropH;
    if(d.mode==="draw"){
      const{px:x1}=canvasToImgPct(d.startMx,d.startMy);const{px:x2}=canvasToImgPct(mx,d.startMy);
      const{py:y1}=canvasToImgPct(d.startMx,d.startMy);const{py:y2}=canvasToImgPct(d.startMx,my);
      const rx=Math.min(x1,x2)/imgW*100;const ry=Math.min(y1,y2)/imgH*100;
      let rw=Math.abs(x2-x1)/imgW*100;let rh=Math.abs(y2-y1)/imgH*100;
      if(aspectLock){const[aw,ah]=aspectLock.split(":").map(Number);const ratio=aw/ah;const imgAR=imgW/imgH;rh=rw/ratio*imgAR;}
      nx=Math.max(0,rx);ny=Math.max(0,ry);nw=Math.min(100-nx,Math.max(5,rw));nh=Math.min(100-ny,Math.max(5,rh));
    }else if(d.mode==="move"){
      nx=Math.max(0,Math.min(100-d.startCW,d.startCX+dPctX));
      ny=Math.max(0,Math.min(100-d.startCH,d.startCY+dPctY));
      nw=d.startCW;nh=d.startCH;
    }else{
      const ddx=(mx-d.startMx)/dw*d.startCW;const ddy=(my-d.startMy)/dh*d.startCH;
      if(d.mode.includes("r"))nw=Math.max(5,Math.min(100-d.startCX,d.startCW+ddx));
      if(d.mode.includes("l")){nx=Math.max(0,Math.min(d.startCX+d.startCW-5,d.startCX+ddx));nw=d.startCW+(d.startCX-nx);}
      if(d.mode.includes("b"))nh=Math.max(5,Math.min(100-d.startCY,d.startCH+ddy));
      if(d.mode.includes("t")){ny=Math.max(0,Math.min(d.startCY+d.startCH-5,d.startCY+ddy));nh=d.startCH+(d.startCY-ny);}
    }
    cropRef.current={x:nx,y:ny,w:nw,h:nh};
    scheduleDraw();
  };

  const onMouseUp=()=>{
    if(!dragRef.current)return;
    const{x,y,w,h}=cropRef.current;
    setCropX(Math.round(x*10)/10);setCropY(Math.round(y*10)/10);
    setCropW(Math.round(w*10)/10);setCropH(Math.round(h*10)/10);
    dragRef.current=null;
  };

  const getCursor=e=>{
    const c=previewRef.current;if(!c)return;
    const rect=c.getBoundingClientRect();
    const scaleX=c.width/rect.width;const scaleY=c.height/rect.height;
    const mx=(e.clientX-rect.left)*scaleX;const my=(e.clientY-rect.top)*scaleY;
    const{dx,dy,dw,dh}=layoutRef.current;
    const h=getHandle(mx,my,dx,dy,dw,dh);
    const cursors={tl:"nwse-resize",br:"nwse-resize",tr:"nesw-resize",bl:"nesw-resize",
      tm:"ns-resize",bm:"ns-resize",ml:"ew-resize",mr:"ew-resize",move:"move"};
    c.style.cursor=cursors[h]||"crosshair";
  };

  const applyAndSave=async()=>{
    setSaving(true);
    const built=buildRotated();if(!built){setSaving(false);return;}
    const{canvas:tmp,rW,rH}=built;
    const sx=Math.round(rW*cropX/100);const sy=Math.round(rH*cropY/100);
    const sw=Math.max(1,Math.round(rW*cropW/100));const sh=Math.max(1,Math.round(rH*cropH/100));
    const out=document.createElement("canvas");out.width=sw;out.height=sh;
    out.getContext("2d").drawImage(tmp,sx,sy,sw,sh,0,0,sw,sh);
    out.toBlob(async blob=>{
      if(!blob){setSaving(false);return;}
      const file=new File([blob],"edited.jpg",{type:"image/jpeg"});
      const url=await uploadPhoto(file,"edited");
      if(url)onSave(url);else onSave(out.toDataURL("image/jpeg",.92));
      setSaving(false);
    },"image/jpeg",.92);
  };

  const SL=({label,val,set,min,max,step,unit,color})=>(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
        <label style={{fontSize:10,fontWeight:700,color:"#5c4a3a"}}>{label}</label>
        <span style={{fontSize:10,color:color||"#9a7422",fontWeight:700}}>{val}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e=>set(Number(e.target.value))}
        onInput={e=>set(Number(e.target.value))}
        style={{width:"100%",accentColor:"#d4a853",cursor:"pointer",height:18}}/>
    </div>
  );

  const iconBtn=(label,onClick,title,active)=>(
    <button title={title||label} onClick={onClick}
      style={{padding:"6px 0",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",
        background:active?"#d4a853":"#fff",color:active?"#1a1714":"#5c4a3a",
        fontSize:13,cursor:"pointer",fontFamily:"inherit",flex:1,fontWeight:600,transition:"all .1s"}}
      onMouseOver={e=>{if(!active){e.currentTarget.style.background="#f5e8c0";}}}
      onMouseOut={e=>{if(!active){e.currentTarget.style.background="#fff";}}}>{label}</button>
  );

  return(<div className="mbg" onClick={onClose}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:1000,padding:20}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div><h2 style={{marginBottom:2}}>✏️ Photo Editor</h2>
        <div style={{fontSize:10,color:"#6b5e52"}}>Drag on photo to crop · Drag handles to resize · Drag inside box to move{aspectLock&&<span style={{marginLeft:8,background:"rgba(212,168,83,.12)",color:"#9a7422",fontWeight:700,padding:"1px 7px",borderRadius:4,fontSize:9}}>🔒 {aspectLock} locked — card preview ratio</span>}</div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={()=>setShowGrid(g=>!g)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",background:showGrid?"#d4a853":"#fff",color:showGrid?"#1a1714":"#5c4a3a",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⊞ Grid {showGrid?"ON":"OFF"}</button>
        <button onClick={()=>{setBrightness(100);setContrast(100);setSaturation(100);setRotation(0);setRotInput("0");setFlipH(false);setFlipV(false);setCropX(0);setCropY(0);setCropW(100);setCropH(100);cropRef.current={x:0,y:0,w:100,h:100};scheduleDraw();}} style={{padding:"5px 12px",borderRadius:6,border:"1px solid rgba(196,92,74,.3)",background:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",color:"#c45c4a"}}>↺ Reset All</button>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 270px",gap:16}}>
      <div style={{background:"#111",borderRadius:12,overflow:"hidden",position:"relative"}}>
        <canvas ref={previewRef}
          style={{width:"100%",height:430,display:"block",cursor:"crosshair"}}
          onMouseDown={onMouseDown}
          onMouseMove={e=>{onMouseMove(e);getCursor(e);}}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}/>
        <div style={{position:"absolute",bottom:6,left:0,right:0,textAlign:"center",fontSize:9,color:"rgba(255,255,255,.4)",pointerEvents:"none"}}>
          Drag to crop · Handles to resize · Inside box to move
        </div>
      </div>

      <div style={{overflowY:"auto",maxHeight:440,paddingRight:2}}>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:800,color:"#9a7422",textTransform:"uppercase",letterSpacing:.5,marginBottom:7}}>Transform</div>
          <div style={{display:"flex",gap:4,marginBottom:5}}>
            {iconBtn("↺ 90°",()=>doRotate(-90),"Rotate 90° CCW")}
            {iconBtn("↻ 90°",()=>doRotate(90),"Rotate 90° CW")}
            {iconBtn("180°",()=>doRotate(180),"Rotate 180°")}
          </div>
          <div style={{display:"flex",gap:4,marginBottom:10}}>
            {iconBtn("⇔ Flip H",()=>setFlipH(f=>!f),"Flip Horizontal",flipH)}
            {iconBtn("⇕ Flip V",()=>setFlipV(f=>!f),"Flip Vertical",flipV)}
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <label style={{fontSize:10,fontWeight:700,color:"#5c4a3a"}}>Fine Rotation</label>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <input type="number" value={rotInput} min={-180} max={180} step={0.1}
                  onChange={e=>setRotInput(e.target.value)}
                  onBlur={e=>{const v=parseFloat(e.target.value);if(!isNaN(v)){const cl=Math.max(-180,Math.min(180,v));setRotation(cl);setRotInput(String(cl));}}}
                  onKeyDown={e=>{if(e.key==="Enter"){const v=parseFloat(rotInput);if(!isNaN(v)){const cl=Math.max(-180,Math.min(180,v));setRotation(cl);setRotInput(String(cl));}}}}
                  style={{width:52,padding:"2px 5px",borderRadius:5,border:"1px solid rgba(0,0,0,.1)",fontSize:10,fontFamily:"inherit",textAlign:"right"}}/>
                <span style={{fontSize:10,color:"#9a7422",fontWeight:700}}>°</span>
              </div>
            </div>
            <input type="range" min={-180} max={180} step={0.1} value={rotation}
              onChange={e=>{const v=Number(e.target.value);setRotation(v);setRotInput(v.toFixed(1));}}
              onInput={e=>{const v=Number(e.target.value);setRotation(v);setRotInput(v.toFixed(1));}}
              style={{width:"100%",accentColor:"#d4a853",cursor:"pointer",height:18}}/>
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:800,color:"#9a7422",textTransform:"uppercase",letterSpacing:.5,marginBottom:7}}>Adjustments</div>
          <SL label="Brightness" val={brightness} set={setBrightness} min={20} max={200} step={1} unit="%"/>
          <SL label="Contrast" val={contrast} set={setContrast} min={20} max={200} step={1} unit="%" color="#7c6a3a"/>
          <SL label="Saturation" val={saturation} set={setSaturation} min={0} max={200} step={1} unit="%" color="#7c3a5a"/>
        </div>

        <div style={{background:"#faf9f7",borderRadius:8,padding:10,border:"1px solid rgba(0,0,0,.06)"}}>
          <div style={{fontSize:9,fontWeight:800,color:"#9a7422",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Crop Area</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:10,color:"#5c4a3a"}}>
            <div>X: <strong>{cropX.toFixed(1)}%</strong></div>
            <div>Y: <strong>{cropY.toFixed(1)}%</strong></div>
            <div>W: <strong>{cropW.toFixed(1)}%</strong></div>
            <div>H: <strong>{cropH.toFixed(1)}%</strong></div>
          </div>
          <button className="btn btn-out btn-sm" style={{width:"100%",fontSize:9,marginTop:8}}
            onClick={()=>{setCropX(0);setCropY(0);setCropW(100);setCropH(100);cropRef.current={x:0,y:0,w:100,h:100};scheduleDraw();}}>
            Reset Crop
          </button>
        </div>
      </div>
    </div>

    <div className="mft" style={{marginTop:14}}>
      <button className="btn btn-out" onClick={onClose}>Cancel</button>
      <button className="btn btn-gold" onClick={applyAndSave} disabled={saving} style={{minWidth:140}}>{saving?"⏳ Saving...":"✓ Apply & Save"}</button>
    </div>
  </div></div>);
}

// ─── Photo Manager ──────────────────────────────────────────────────
function PhotoManager({photos=[],onChange,label="Photos",propId="",onFocalPoint=null}){
  const[dropOver,setDropOver]=useState(false);
  const[urlInput,setUrlInput]=useState("");
  const[dragIdx,setDragIdx]=useState(null);
  const[dragOverIdx,setDragOverIdx]=useState(null);
  const[thumbSize,setThumbSize]=useState(80);
  const[readingCount,setReadingCount]=useState(0);
  const[uploadError,setUploadError]=useState("");
  const[editingPhoto,setEditingPhoto]=useState(null);
  const[pickingFocal,setPickingFocal]=useState(false);
  const ph=photos||[];

  const readFiles=async files=>{
    const imageFiles=[...files].filter(f=>f.type.startsWith("image/"));
    if(!imageFiles.length)return;
    setReadingCount(imageFiles.length);
    setUploadError("");
    let successCount=0;
    const results=await Promise.all(imageFiles.map(async(file)=>{
      const url=await uploadPhoto(file,propId||"general");
      if(url){successCount++;return url;}
      if(file.size<500*1024){
        return await new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(file);});
      }
      return null;
    }));
    const valid=results.filter(Boolean);
    if(valid.length>0)onChange(prev=>[...(Array.isArray(prev)?prev:ph),...valid]);
    if(valid.length<imageFiles.length){
      setUploadError(`${imageFiles.length-valid.length} photo(s) failed to upload. Check that the 'property-photos' bucket exists in Supabase Storage and is set to Public.`);
    }
    setReadingCount(0);
  };
  const openPicker=()=>{
    const inp=document.createElement("input");
    inp.type="file";inp.accept="image/*";inp.multiple=true;
    inp.onchange=e=>readFiles(e.target.files);
    inp.click();
  };
  const handleDrop=e=>{
    e.preventDefault();setDropOver(false);
    if(e.dataTransfer.files.length)readFiles(e.dataTransfer.files);
  };
  const addUrl=()=>{if(urlInput.trim()){onChange([...ph,urlInput.trim()]);setUrlInput("");}};
  const remove=i=>onChange(ph.filter((_,j)=>j!==i));

  const onDragStart=(e,i)=>{setDragIdx(i);e.dataTransfer.effectAllowed="move";};
  const onDragEnterThumb=(i)=>setDragOverIdx(i);
  const onDragEndThumb=()=>{
    if(dragIdx!==null&&dragOverIdx!==null&&dragIdx!==dragOverIdx){
      const arr=[...ph];const[moved]=arr.splice(dragIdx,1);arr.splice(dragOverIdx,0,moved);onChange(arr);
    }
    setDragIdx(null);setDragOverIdx(null);
  };

  useEffect(()=>{
    const onKey=e=>{if(e.key==="Escape")setPickingFocal(false);};
    window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);
  },[]);
  return(<>{editingPhoto&&<PhotoEditor
    src={editingPhoto.src}
    aspectLock={editingPhoto.index===0?"16:9":null}
    onClose={()=>setEditingPhoto(null)}
    onSave={url=>{const next=[...ph];next[editingPhoto.index]=url;onChange(next);setEditingPhoto(null);}}
  />}
  <div style={{marginBottom:12}}
    onDragOver={e=>{e.preventDefault();if([...e.dataTransfer.types].includes("Files"))setDropOver(true);}}
    onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDropOver(false);}}
    onDrop={e=>{e.preventDefault();setDropOver(false);if(e.dataTransfer.files.length)readFiles(e.dataTransfer.files);}}>
    <div style={{outline:dropOver?"2px dashed #d4a853":"2px solid transparent",borderRadius:8,transition:"outline .15s",padding:2}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
      <label style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.3}}>{label} ({ph.length} photo{ph.length!==1?"s":""})</label>
      {ph.length>0&&<div style={{display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:9,color:"#7a7067"}}>🔍</span>
        <input type="range" min={60} max={200} step={10} value={thumbSize} onChange={e=>setThumbSize(Number(e.target.value))}
          style={{width:64,accentColor:"#d4a853",cursor:"pointer"}} title="Thumbnail size"/>
        <span style={{fontSize:9,color:"#7a7067"}}>drag to reorder</span>
      </div>}
    </div>
    {readingCount>0&&<div style={{marginBottom:6,padding:"5px 10px",background:"rgba(212,168,83,.08)",border:"1px solid rgba(212,168,83,.2)",borderRadius:6,fontSize:10,color:"#9a7422",display:"flex",alignItems:"center",gap:6}}>
      <div style={{width:10,height:10,borderRadius:"50%",border:"2px solid #d4a853",borderTopColor:"transparent",animation:"spin .6s linear infinite"}}/>
      Loading {readingCount} photo{readingCount!==1?"s":""}…
    </div>}
    {!readingCount&&ph.length>0&&<div style={{marginBottom:6,padding:"4px 10px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.15)",borderRadius:6,fontSize:10,color:"#4a7c59",fontWeight:600}}>
      ✓ {ph.length} photo{ph.length!==1?"s":""} ready — click Save to apply
    </div>}
    {uploadError&&<div style={{marginBottom:6,padding:"6px 10px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.2)",borderRadius:6,fontSize:10,color:"#c45c4a",fontWeight:600}}>
      ⚠ {uploadError}
    </div>}

    {ph.length>0&&<div style={{display:"grid",gridTemplateColumns:`repeat(auto-fill,minmax(${thumbSize}px,1fr))`,gap:6,marginBottom:8}}>
      {ph.map((src,i)=>(
        <div key={i}
          draggable
          onDragStart={e=>onDragStart(e,i)}
          onDragEnter={()=>onDragEnterThumb(i)}
          onDragEnd={onDragEndThumb}
          onDragOver={e=>e.preventDefault()}
          style={{
            position:"relative",borderRadius:7,overflow:"hidden",
            border:`2px solid ${dragOverIdx===i&&dragIdx!==i?"#d4a853":"rgba(0,0,0,.06)"}`,
            cursor:"grab",aspectRatio:"1",
            boxShadow:dragIdx===i?"0 4px 12px rgba(0,0,0,.2)":"none",
            opacity:dragIdx===i?.5:1,
            transition:"border-color .1s,opacity .1s",
          }}>
          {i===0&&<div style={{position:"absolute",top:3,left:3,background:"#d4a853",color:"#1a1714",fontSize:7,fontWeight:800,padding:"1px 5px",borderRadius:3,zIndex:3,pointerEvents:"none"}}>COVER</div>}
          <div style={{position:"absolute",bottom:3,left:3,background:"rgba(212,168,83,.95)",color:"#1a1714",fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,zIndex:3,cursor:"pointer"}} onClick={e=>{e.stopPropagation();e.preventDefault();setEditingPhoto({index:i,src});}}>✏ Edit</div>
          {i===0&&<div style={{position:"absolute",top:3,right:22,background:"rgba(0,0,0,.65)",color:"#fff",fontSize:7,fontWeight:800,padding:"2px 5px",borderRadius:3,zIndex:3,cursor:"crosshair",userSelect:"none"}} title="Click to set focal point — controls how photo is cropped in cards" onClick={e=>{e.stopPropagation();setPickingFocal(true);}} >🎯</div>}
          {i===0&&pickingFocal&&<div style={{position:"absolute",inset:0,zIndex:4,cursor:"crosshair",background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>{e.stopPropagation();const rect=e.currentTarget.getBoundingClientRect();const x=Math.round((e.clientX-rect.left)/rect.width*100);const y=Math.round((e.clientY-rect.top)/rect.height*100);onFocalPoint&&onFocalPoint(x,y);setPickingFocal(false);}}>
            <div style={{color:"#fff",fontSize:10,fontWeight:700,textAlign:"center",pointerEvents:"none",textShadow:"0 1px 3px rgba(0,0,0,.8)"}}>Click to set focal point<br/><span style={{fontSize:8,fontWeight:400,opacity:.8}}>Press ESC to cancel</span></div>
          </div>}
          <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",pointerEvents:"none"}} onError={e=>{e.target.style.display="none";}}/>
          <button onClick={e=>{e.stopPropagation();remove(i);}} style={{position:"absolute",top:3,right:3,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,.65)",color:"#fff",border:"none",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3,lineHeight:1}}>×</button>
        </div>
      ))}
      <div onClick={openPicker} style={{aspectRatio:"1",borderRadius:7,border:"2px dashed rgba(0,0,0,.1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#faf9f7",gap:3}} onMouseOver={e=>e.currentTarget.style.borderColor="#d4a853"} onMouseOut={e=>e.currentTarget.style.borderColor="rgba(0,0,0,.1)"}>
        <span style={{fontSize:18}}>+</span>
        <span style={{fontSize:8,color:"#6b5e52",fontWeight:600}}>Add</span>
      </div>
    </div>}

    {ph.length===0&&<div
      onDragOver={e=>{e.preventDefault();setDropOver(true);}}
      onDragLeave={()=>setDropOver(false)}
      onDrop={handleDrop}
      onClick={openPicker}
      style={{border:`2px dashed ${dropOver?"#d4a853":"rgba(0,0,0,.08)"}`,borderRadius:8,padding:18,textAlign:"center",cursor:"pointer",background:dropOver?"rgba(212,168,83,.04)":"transparent",marginBottom:6,transition:"all .15s"}}>
      <div style={{fontSize:22,marginBottom:4}}>📷</div>
      <div style={{fontSize:11,color:"#6b5e52",fontWeight:600}}>Drop photos here or click to browse</div>
      <div style={{fontSize:9,color:"#7a7067",marginTop:2}}>Select multiple files at once — no limit</div>
    </div>}



    </div>{/* end outline wrapper */}
    <div style={{display:"flex",gap:4}}>
      <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="Or paste image URL and press Enter..."
        onKeyDown={e=>e.key==="Enter"&&addUrl()}
        style={{flex:1,padding:"5px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit",outline:"none"}}/>
      <button className="btn btn-out btn-sm" onClick={addUrl} disabled={!urlInput.trim()}>Add URL</button>
    </div>
  </div>
  </>);
}

// ─── Utility Templates Modal ────────────────────────────────────────
function UtilTemplatesModal({settings,onUpdateSettings,onClose,showConfirm}){
  const templates=getUtilTemplates(settings);
  const[editingId,setEditingId]=useState(null);
  const[draftT,setDraftT]=useState(null);
  const saveTemplate=(t)=>{
    const existing=templates.find(x=>x.id===t.id);
    const updated=existing?templates.map(x=>x.id===t.id?t:x):[...templates,t];
    onUpdateSettings({...(settings||{}),utilTemplates:updated});
    setEditingId(null);setDraftT(null);
  };
  const deleteTemplate=(id)=>{
    showConfirm({title:"Delete Template?",body:"Any units currently using this template will keep their current value.",confirmLabel:"Delete",danger:true,onConfirm:()=>onUpdateSettings({...(settings||{}),utilTemplates:templates.filter(t=>t.id!==id)})});
  };
  const startNew=()=>{
    const t={id:uid(),name:"New Template",key:"custom_"+uid().slice(0,4),desc:"",clause:""};
    setDraftT(t);setEditingId(t.id);
  };
  return(<div className="mbg" onClick={onClose}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:760}}>
    <h2 style={{marginBottom:4}}>Utility Templates</h2>
    <p style={{fontSize:11,color:"#6b5e52",marginBottom:16}}>These templates appear in the Utilities dropdown when editing unit settings. Each template has a name, short description, and full lease clause.</p>
    {templates.map(t=>(
      <div key={t.id} style={{border:"1px solid rgba(0,0,0,.07)",borderRadius:8,padding:12,marginBottom:8,background:"#faf9f7"}}>
        {editingId===t.id&&draftT
          ?<div>
            <div className="fr">
              <div className="fld"><label>Template Name</label><input value={draftT.name} onChange={e=>setDraftT(x=>({...x,name:e.target.value}))}/></div>
              <div className="fld"><label>Key <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none"}}>(no spaces)</span></label><input value={draftT.key} onChange={e=>setDraftT(x=>({...x,key:e.target.value.replace(/[^a-z0-9_]/gi,"_")}))}/></div>
            </div>
            <div className="fld"><label>Short Description <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none"}}>(shown below dropdown)</span></label><input value={draftT.desc} onChange={e=>setDraftT(x=>({...x,desc:e.target.value}))} placeholder="e.g. PM covers first $100/mo, overage split equally"/></div>
            <div className="fld"><label>Lease Clause <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none"}}>(inserted into lease agreement)</span></label>
              <textarea value={draftT.clause} onChange={e=>setDraftT(x=>({...x,clause:e.target.value}))} rows={4} placeholder="Full clause text inserted into the lease document..." style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"vertical",lineHeight:1.5}}/>
            </div>
            <div style={{display:"flex",gap:6,marginTop:6}}>
              <button className="btn btn-green btn-sm" onClick={()=>saveTemplate(draftT)}>✓ Save Template</button>
              <button className="btn btn-out btn-sm" onClick={()=>{setEditingId(null);setDraftT(null);}}>Cancel</button>
            </div>
          </div>
          :<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                {t.name}
                <span style={{fontSize:9,color:"#7a7067",fontFamily:"monospace",fontWeight:400}}>{t.key}</span>
              </div>
              {t.desc&&<div style={{fontSize:11,color:"#5c4a3a",marginTop:2}}>{t.desc}</div>}
              {t.clause&&<div style={{fontSize:10,color:"#6b5e52",marginTop:3,fontStyle:"italic",lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>"{t.clause}"</div>}
            </div>
            <div style={{display:"flex",gap:4,flexShrink:0}}>
              <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>{setDraftT({...t});setEditingId(t.id);}}>Edit</button>
              <button className="btn btn-red btn-sm" style={{fontSize:9}} onClick={()=>deleteTemplate(t.id)}>✕</button>
            </div>
          </div>}
      </div>
    ))}
    <button className="btn btn-gold btn-sm" style={{marginTop:4,width:"100%"}} onClick={startNew}>+ Add New Template</button>
    <div className="mft" style={{marginTop:12}}><button className="btn btn-green" onClick={onClose}>Done</button></div>
  </div></div>);
}

// ─── Tour Scene Manager ─────────────────────────────────────────────
function TourSceneManager({tourFolder,scenes,onChange,showAlert}){
  const BASE_URL=SUPA_URL+"/storage/v1/object/public/property-photos/360/"+tourFolder+"/";
  const thumbURL=(file,w=200)=>SUPA_URL+"/storage/v1/render/image/public/property-photos/360/"+tourFolder+"/"+file+"?width="+w+"&quality=55&resize=cover";
  const[thumbSize,setThumbSize]=useState(80);
  const[dragIdx,setDragIdx]=useState(null);
  const[dragOverIdx,setDragOverIdx]=useState(null);
  const[editingScene,setEditingScene]=useState(null);
  const[tourFiles,setTourFiles]=useState([]);
  const[tourFilesLoading,setTourFilesLoading]=useState(false);
  const[showFileBrowser,setShowFileBrowser]=useState(false);
  const[showManual,setShowManual]=useState(false);
  const[selectedFiles,setSelectedFiles]=useState([]);
  const[manualFile,setManualFile]=useState("");
  const[manualLabel,setManualLabel]=useState("");
  const[manualFloor,setManualFloor]=useState(1);

  const loadBucketFiles=async()=>{
    setTourFilesLoading(true);
    try{
      const r=await fetch(SUPA_URL+"/storage/v1/object/list/property-photos",{
        method:"POST",
        headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json"},
        body:JSON.stringify({prefix:"360/"+tourFolder+"/",limit:200,offset:0})
      });
      const d=await r.json();
      setTourFiles(Array.isArray(d)?d.map(f=>f.name).filter(n=>n&&/\.(jpg|jpeg|png)$/i.test(n)):[]);
    }catch{setTourFiles([]);}
    setTourFilesLoading(false);
  };

  const addScene=(file,label,floor)=>{
    if(scenes.some(s=>s.file===file))return;
    onChange([...scenes,{id:uid(),file,label:label||file.replace(/\.[^.]+$/,"").replace(/-/g," "),floor:floor||1}]);
  };
  const removeScene=(id)=>onChange(scenes.filter(s=>s.id!==id));
  const updScene=(id,key,val)=>onChange(scenes.map(s=>s.id===id?{...s,[key]:val}:s));

  const onDragStart=(e,i)=>{setDragIdx(i);e.dataTransfer.effectAllowed="move";};
  const onDragEnter=(i)=>setDragOverIdx(i);
  const onDragEnd=()=>{
    if(dragIdx!==null&&dragOverIdx!==null&&dragIdx!==dragOverIdx){
      const arr=[...scenes];const[moved]=arr.splice(dragIdx,1);arr.splice(dragOverIdx,0,moved);onChange(arr);
    }
    setDragIdx(null);setDragOverIdx(null);
  };

  const editing=editingScene?scenes.find(s=>s.id===editingScene):null;

  return(
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <label style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.3}}>
          3D Tour Scenes ({scenes.length} scene{scenes.length!==1?"s":""})
        </label>
        {scenes.length>0&&<div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:"#7a7067"}}>🔍</span>
          <input type="range" min={60} max={200} step={10} value={thumbSize} onChange={e=>setThumbSize(Number(e.target.value))}
            style={{width:64,accentColor:"#d4a853",cursor:"pointer"}} title="Thumbnail size"/>
          <span style={{fontSize:9,color:"#7a7067"}}>drag to reorder</span>
        </div>}
      </div>

      {editing&&<div style={{marginBottom:8,padding:10,background:"rgba(212,168,83,.04)",border:"1px solid rgba(212,168,83,.2)",borderRadius:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#9a7422",marginBottom:8}}>Edit Scene</div>
        <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
          <img src={thumbURL(editing.file,300)} alt={editing.label}
            style={{width:72,height:50,objectFit:"cover",borderRadius:5,flexShrink:0,border:"1px solid rgba(0,0,0,.1)"}}
            onError={e=>{e.target.style.display="none";}}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
            <div className="fr" style={{gap:6}}>
              <div className="fld" style={{marginBottom:0,flex:2}}>
                <label>Scene Name</label>
                <input value={editing.label} onChange={e=>updScene(editing.id,"label",e.target.value)}
                  style={{width:"100%"}} placeholder="e.g. Living Room"/>
              </div>
              <div className="fld" style={{marginBottom:0,flex:1}}>
                <label>Floor</label>
                <select value={editing.floor||1} onChange={e=>updScene(editing.id,"floor",Number(e.target.value))} style={{width:"100%"}}>
                  <option value={1}>Floor 1</option>
                  <option value={2}>Floor 2</option>
                  <option value={3}>Floor 3</option>
                </select>
              </div>
            </div>
            <div style={{fontSize:9,color:"#6b5e52"}}>File: {editing.file}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <button className="btn btn-gold btn-sm" onClick={()=>setEditingScene(null)}>Done</button>
          <button className="btn btn-red btn-sm" onClick={()=>{removeScene(editing.id);setEditingScene(null);}}>Remove Scene</button>
        </div>
      </div>}

      {scenes.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax("+thumbSize+"px,1fr))",gap:6,marginBottom:8}}>
        {scenes.map((s,i)=>{
          const isActive=dragOverIdx===i&&dragIdx!==i;
          const isEditing=editingScene===s.id;
          const borderColor=isActive||isEditing?"#d4a853":"rgba(0,0,0,.06)";
          return(
          <div key={s.id} draggable
            onDragStart={e=>onDragStart(e,i)}
            onDragEnter={()=>onDragEnter(i)}
            onDragEnd={onDragEnd}
            onDragOver={e=>e.preventDefault()}
            style={{position:"relative",borderRadius:7,overflow:"hidden",
              border:"2px solid "+borderColor,
              cursor:"grab",aspectRatio:"16/9",
              boxShadow:dragIdx===i?"0 4px 12px rgba(0,0,0,.2)":"none",
              opacity:dragIdx===i?.5:1,transition:"border-color .1s,opacity .1s"}}>
            <div style={{position:"absolute",top:3,left:3,background:"rgba(0,0,0,.65)",color:"#fff",fontSize:7,fontWeight:800,padding:"1px 5px",borderRadius:3,zIndex:3,pointerEvents:"none"}}>
              F{s.floor||1}
            </div>
            <div style={{position:"absolute",bottom:3,left:3,background:"rgba(212,168,83,.95)",color:"#1a1714",fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,zIndex:3,cursor:"pointer"}}
              onClick={e=>{e.stopPropagation();setEditingScene(editingScene===s.id?null:s.id);}}>
              ✏ Edit
            </div>
            <img src={thumbURL(s.file)} alt={s.label}
              style={{width:"100%",height:"100%",objectFit:"cover",display:"block",pointerEvents:"none"}}
              onError={e=>{e.target.style.display="none";}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.55)",color:"#fff",fontSize:7,padding:"2px 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",pointerEvents:"none"}}>
              {s.label}
            </div>
            <button onClick={e=>{e.stopPropagation();if(editingScene===s.id)setEditingScene(null);removeScene(s.id);}}
              style={{position:"absolute",top:3,right:3,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,.65)",color:"#fff",border:"none",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3,lineHeight:1}}>
              ×
            </button>
          </div>
          );
        })}
        <div onClick={()=>{setShowFileBrowser(true);setShowManual(false);if(!tourFiles.length)loadBucketFiles();}}
          style={{aspectRatio:"16/9",borderRadius:7,border:"2px dashed rgba(0,0,0,.1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#faf9f7",gap:3}}
          onMouseOver={e=>e.currentTarget.style.borderColor="#d4a853"}
          onMouseOut={e=>e.currentTarget.style.borderColor="rgba(0,0,0,.1)"}>
          <span style={{fontSize:18}}>+</span>
          <span style={{fontSize:8,color:"#6b5e52",fontWeight:600}}>Add</span>
        </div>
      </div>}

      {scenes.length===0&&<div style={{border:"2px dashed rgba(0,0,0,.08)",borderRadius:8,padding:18,textAlign:"center",cursor:"pointer",marginBottom:6}}
        onClick={()=>{setShowFileBrowser(true);if(!tourFiles.length)loadBucketFiles();}}>
        <div style={{fontSize:22,marginBottom:4}}>🎥</div>
        <div style={{fontSize:11,color:"#6b5e52",fontWeight:600}}>No scenes yet — click to browse bucket files</div>
        <div style={{fontSize:9,color:"#7a7067",marginTop:2}}>Or add manually below</div>
      </div>}

      <div style={{display:"flex",gap:6,marginBottom:6}}>
        <button className="btn btn-out btn-sm" style={{flex:1}} onClick={()=>{setShowFileBrowser(v=>!v);setShowManual(false);if(!tourFiles.length)loadBucketFiles();}}>
          {showFileBrowser?"Hide File Browser":"Browse Bucket Files"}
        </button>
        <button className="btn btn-out btn-sm" style={{flex:1}} onClick={()=>{setShowManual(v=>!v);setShowFileBrowser(false);}}>
          {showManual?"Hide":"Add Manually"}
        </button>
      </div>

      {showFileBrowser&&<div style={{background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.06)",borderRadius:8,padding:10,marginBottom:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span>360/{tourFolder}/ ({tourFiles.length} files)</span>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            {tourFiles.filter(f=>!scenes.some(s=>s.file===f)).length>0&&<>
              <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>{
                const selectable=tourFiles.filter(f=>!scenes.some(s=>s.file===f));
                setSelectedFiles(s=>s.length===selectable.length?[]:selectable);
              }}>
                {selectedFiles.length===tourFiles.filter(f=>!scenes.some(s=>s.file===f)).length?"Deselect All":"Select All"}
              </button>
              {selectedFiles.length>0&&<button className="btn btn-gold btn-sm" style={{fontSize:9}} onClick={()=>{
                selectedFiles.forEach(f=>addScene(f,"",1));
                setSelectedFiles([]);
              }}>Add {selectedFiles.length} Selected</button>}
            </>}
            <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={loadBucketFiles}>{tourFilesLoading?"Loading...":"Refresh"}</button>
          </div>
        </div>
        {tourFilesLoading&&<div style={{fontSize:11,color:"#6b5e52",textAlign:"center",padding:8}}>Loading files...</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:6,maxHeight:220,overflowY:"auto"}}>
          {tourFiles.map(file=>{
            const already=scenes.some(s=>s.file===file);
            const sel=selectedFiles.includes(file);
            return(
              <div key={file} onClick={()=>{
                if(already)return;
                setSelectedFiles(s=>sel?s.filter(x=>x!==file):[...s,file]);
              }}
                style={{cursor:already?"default":"pointer",borderRadius:6,
                  border:"2px solid "+(already?"rgba(0,0,0,.06)":sel?"#d4a853":"rgba(0,0,0,.1)"),overflow:"hidden",
                  position:"relative",transition:"all .15s",opacity:already?.6:1,
                  background:sel?"rgba(212,168,83,.06)":"transparent"}}
                title={already?"Already added":sel?"Click to deselect":"Click to select"}>
                <img src={thumbURL(file)} alt={file} style={{width:"100%",aspectRatio:"16/9",objectFit:"cover",display:"block"}}/>
                <div style={{fontSize:7,padding:"2px 4px",background:"rgba(0,0,0,.65)",color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{file}</div>
                {already&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>Added</div>}
                {sel&&!already&&<div style={{position:"absolute",top:3,right:3,width:16,height:16,background:"#d4a853",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#1a1714",fontWeight:900}}>✓</div>}
              </div>
            );
          })}
        </div>
      </div>}

      {showManual&&<div style={{background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.06)",borderRadius:8,padding:10,marginBottom:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",marginBottom:8}}>Add Scene Manually</div>
        <div className="fr" style={{gap:6,marginBottom:6}}>
          <input value={manualFile} onChange={e=>setManualFile(e.target.value)} placeholder="filename.jpg"
            style={{flex:2,padding:"6px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/>
          <input value={manualLabel} onChange={e=>setManualLabel(e.target.value)} placeholder="Scene name"
            style={{flex:2,padding:"6px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/>
          <select value={manualFloor} onChange={e=>setManualFloor(Number(e.target.value))}
            style={{padding:"6px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",width:80}}>
            <option value={1}>Floor 1</option><option value={2}>Floor 2</option><option value={3}>Floor 3</option>
          </select>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button className="btn btn-green btn-sm" disabled={!manualFile.trim()} onClick={()=>{
            const f=manualFile.trim();if(!f)return;
            if(scenes.some(s=>s.file===f)){showAlert({title:"Already Added",body:"This file has already been added to the scene list."});return;}
            addScene(f,manualLabel,manualFloor);
            setManualFile("");setManualLabel("");setManualFloor(1);
          }}>Add Scene</button>
          <button className="btn btn-out btn-sm" onClick={()=>setShowManual(false)}>Cancel</button>
        </div>
      </div>}
    </div>
  );
}

// ─── Lease Pricing Modal ────────────────────────────────────────────
const DEFAULT_DURATIONS=[3,6,9,12,15,18];
const MARKUP_PCT={3:0.30,6:0.18,9:0.10,12:0,15:-0.03,18:-0.05};
function calcAutoPrice(baseRent,months){
  const markup=MARKUP_PCT[months]!==undefined?MARKUP_PCT[months]:(months<=6?0.20:months<=9?0.10:months<=12?0:months<=15?-0.03:-0.05);
  return Math.round((baseRent*(1+markup))/5)*5;
}
function LeasePricingModal({room,onSave,onClose}){
  const baseRent=Number(room.rent)||0;
  const initTiers=(room.leaseTiers&&room.leaseTiers.length>0)
    ?room.leaseTiers
    :DEFAULT_DURATIONS.map(m=>({id:String(m),months:m,price:calcAutoPrice(baseRent,m),override:false,enabled:m>=6}));
  const[tiers,setTiers]=useState(initTiers);
  const[newMonths,setNewMonths]=useState("");
  const updTier=(id,key,val)=>setTiers(t=>t.map(x=>x.id===id?{...x,[key]:val}:x));
  const removeTier=(id)=>setTiers(t=>t.filter(x=>x.id!==id));
  const addTier=()=>{
    const m=Number(newMonths);
    if(!m||m<1||m>60)return;
    if(tiers.some(t=>t.months===m))return;
    setTiers(t=>[...t,{id:String(m),months:m,price:calcAutoPrice(baseRent,m),override:false,enabled:true}].sort((a,b)=>a.months-b.months));
    setNewMonths("");
  };
  return(
    <div className="mbg" style={{zIndex:200}} onClick={onClose}>
      <div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:500}}>
        <h2>Edit Lease Pricing — {room.name}</h2>
        <div style={{fontSize:11,color:"#5c4a3a",marginBottom:14,padding:"8px 12px",background:"rgba(212,168,83,.06)",borderRadius:8,border:"1px solid rgba(212,168,83,.15)"}}>
          Base rent: <strong>${baseRent}/mo</strong> — Longer leases get a discount, shorter leases carry a premium. Prices auto-calculate but you can override each one.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"60px 1fr 90px 70px 28px",gap:8,alignItems:"center",marginBottom:6,padding:"0 2px"}}>
          <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase"}}>Show</div>
          <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase"}}>Term</div>
          <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase"}}>Price/mo</div>
          <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase"}}>Total</div>
          <div/>
        </div>
        {tiers.sort((a,b)=>a.months-b.months).map(t=>(
          <div key={t.id} style={{display:"grid",gridTemplateColumns:"60px 1fr 90px 70px 28px",gap:8,alignItems:"center",marginBottom:6,padding:"8px 10px",borderRadius:8,border:"1px solid rgba(0,0,0,.06)",background:t.enabled?"#faf9f7":"rgba(0,0,0,.02)",opacity:t.enabled?1:.6}}>
            <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:11}}>
              <input type="checkbox" checked={t.enabled} onChange={e=>updTier(t.id,"enabled",e.target.checked)} style={{accentColor:"#d4a853",width:13,height:13}}/>
              <span style={{fontSize:10,color:t.enabled?"#4a7c59":"#999"}}>{t.enabled?"On":"Off"}</span>
            </label>
            <div style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>
              {t.months} month{t.months!==1?"s":""}
              {t.months===12&&<span style={{fontSize:9,color:"#d4a853",marginLeft:5,fontWeight:700}}>Standard</span>}
              {t.months<9&&<span style={{fontSize:9,color:"#c45c4a",marginLeft:5}}>Premium</span>}
              {t.months>12&&<span style={{fontSize:9,color:"#4a7c59",marginLeft:5}}>Discount</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:11,color:"#6b5e52"}}>$</span>
              <input type="number" value={t.price} min={0} step={5}
                onChange={e=>updTier(t.id,"price",Number(e.target.value)||0)}
                onFocus={()=>updTier(t.id,"override",true)}
                style={{width:"100%",padding:"4px 6px",borderRadius:5,border:"1px solid "+(t.override?"rgba(212,168,83,.5)":"rgba(0,0,0,.08)"),fontSize:11,fontFamily:"inherit"}}/>
            </div>
            <div style={{fontSize:10,color:"#6b5e52",textAlign:"right"}}>${(t.price*t.months).toLocaleString()}</div>
            <button onClick={()=>removeTier(t.id)} style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:14,lineHeight:1,padding:0}}>x</button>
          </div>
        ))}
        <div style={{display:"flex",gap:6,marginTop:10,alignItems:"center"}}>
          <input type="number" value={newMonths} onChange={e=>setNewMonths(e.target.value)} placeholder="Months" min={1} max={60}
            style={{width:90,padding:"6px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:12,fontFamily:"inherit"}}
            onKeyDown={e=>{if(e.key==="Enter")addTier();}}/>
          <button className="btn btn-out btn-sm" onClick={addTier} disabled={!newMonths}>+ Add Term</button>
          <button className="btn btn-out btn-sm" style={{marginLeft:"auto"}} onClick={()=>{
            setTiers(DEFAULT_DURATIONS.map(m=>({id:String(m),months:m,price:calcAutoPrice(baseRent,m),override:false,enabled:m>=6})));
          }}>Reset to Defaults</button>
        </div>
        <div className="mft" style={{marginTop:16}}>
          <button className="btn btn-out" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={()=>{onSave(tiers);onClose();}}>Save Pricing</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Existing Tenant Modal ──────────────────────────────────────
function AddExistingTenantModal({room,propName,onSave,onClose}){
  const today=TODAY.toISOString().split("T")[0];
  const[form,setForm]=useState({
    name:"",email:"",phone:"",
    moveIn:today,leaseEnd:"",
    rent:room.rent||"",sd:room.rent||"",
    doorCode:"",notes:"",
    gender:"",occupationType:"",
  });
  const[errs,setErrs]=useState({});
  const[shake,setShake]=useState(false);
  const fmtPhone=v=>{const d=v.replace(/\D/g,"").slice(0,10);if(!d.length)return"";if(d.length<=3)return"("+d;if(d.length<=6)return"("+d.slice(0,3)+") "+d.slice(3);return"("+d.slice(0,3)+") "+d.slice(3,6)+"-"+d.slice(6);};
  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    if(!form.email.trim())e.email="Required";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))e.email="Invalid email";
    if(!form.phone.trim())e.phone="Required";
    if(!form.moveIn)e.moveIn="Required";
    if(!form.leaseEnd)e.leaseEnd="Required";
    if(!form.rent||Number(form.rent)<=0)e.rent="Required";
    return e;
  };
  const submit=()=>{
    const e=validate();
    if(Object.keys(e).length){setErrs(e);setShake(true);setTimeout(()=>setShake(false),500);return;}
    onSave({
      tenant:{
        name:form.name.trim(),email:form.email.trim(),phone:form.phone,
        moveIn:form.moveIn,gender:form.gender,occupationType:form.occupationType,
        doorCode:form.doorCode,notes:form.notes,
      },
      rent:Number(form.rent),
      sd:Number(form.sd)||Number(form.rent),
      le:form.leaseEnd,
      st:"occupied",
    });
  };
  const fld=(key,label,type="text",placeholder="")=>(
    <div className="fld" style={{marginBottom:8}}>
      <label style={{color:errs[key]?"#c45c4a":undefined}}>{label}{errs[key]&&<span style={{fontWeight:400,fontSize:9,marginLeft:6,color:"#c45c4a"}}>{errs[key]}</span>}</label>
      <input type={type} value={form[key]||""} placeholder={placeholder}
        style={{width:"100%",borderColor:errs[key]?"#c45c4a":undefined}}
        onChange={e=>{
          const v=key==="phone"?fmtPhone(e.target.value):e.target.value;
          setForm(p=>({...p,[key]:v}));
          if(errs[key])setErrs(p=>({...p,[key]:null}));
          if(key==="rent"&&!form.sdTouched)setForm(p=>({...p,rent:v,sd:v}));
        }}/>
    </div>
  );
  return(
  <div className="mbg" onClick={onClose}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:520,animation:shake?"shake .4s ease":undefined}}>
    <h2 style={{marginBottom:4}}>Add Existing Tenant</h2>
    <div style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>
      Adding tenant to <strong>{room.name}</strong> at <strong>{propName}</strong>. This will mark the room as occupied immediately.
    </div>
    {shake&&Object.keys(errs).length>0&&<div style={{marginBottom:12,padding:"8px 12px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.2)",borderRadius:8,color:"#c45c4a",fontSize:11,fontWeight:700}}>
      Please fill in all required fields.
    </div>}

    <div style={{background:"rgba(74,124,89,.03)",border:"1px solid rgba(74,124,89,.1)",borderRadius:10,padding:12,marginBottom:12}}>
      <div style={{fontSize:10,fontWeight:800,color:"#2d6a3f",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Tenant Info</div>
      {fld("name","Full Name *","text","Jane Smith")}
      <div className="fr">
        {fld("email","Email *","email","jane@email.com")}
        {fld("phone","Phone *","tel","(256) 555-0000")}
      </div>
      <div className="fr">
        <div className="fld" style={{marginBottom:8}}>
          <label>Occupation Type</label>
          <select value={form.occupationType} onChange={e=>setForm(p=>({...p,occupationType:e.target.value}))} style={{width:"100%"}}>
            <option value="">Select...</option>
            <option>Intern</option><option>DoD Contractor</option><option>Military</option>
            <option>Remote Worker</option><option>Student</option><option>Travel Nurse</option><option>Other</option>
          </select>
        </div>
        <div className="fld" style={{marginBottom:8}}>
          <label>Gender</label>
          <select value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))} style={{width:"100%"}}>
            <option value="">Prefer not to say</option>
            <option>Male</option><option>Female</option><option>Non-binary</option>
          </select>
        </div>
      </div>
    </div>

    <div style={{background:"rgba(59,130,246,.03)",border:"1px solid rgba(59,130,246,.1)",borderRadius:10,padding:12,marginBottom:12}}>
      <div style={{fontSize:10,fontWeight:800,color:"#1d4ed8",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Lease Terms</div>
      <div className="fr3">
        {fld("moveIn","Move-in Date *","date")}
        {fld("leaseEnd","Lease End Date *","date")}
        {fld("doorCode","Door Code","text","1234")}
      </div>
      <div className="fr">
        <div className="fld" style={{marginBottom:0}}>
          <label style={{color:errs.rent?"#c45c4a":undefined}}>Monthly Rent * {errs.rent&&<span style={{fontWeight:400,fontSize:9,color:"#c45c4a"}}>{errs.rent}</span>}</label>
          <div style={{display:"flex",alignItems:"center"}}>
            <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
            <input type="number" value={form.rent} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",borderColor:errs.rent?"#c45c4a":undefined,width:"100%"}}
              onChange={e=>{setForm(p=>({...p,rent:e.target.value,sd:p.sdTouched?p.sd:e.target.value}));if(errs.rent)setErrs(p=>({...p,rent:null}));}} placeholder="0"/>
          </div>
        </div>
        <div className="fld" style={{marginBottom:0}}>
          <label>Security Deposit</label>
          <div style={{display:"flex",alignItems:"center"}}>
            <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
            <input type="number" value={form.sd} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",width:"100%"}}
              onChange={e=>setForm(p=>({...p,sd:e.target.value,sdTouched:true}))} placeholder="0"/>
          </div>
          <div style={{fontSize:9,color:"#6b5e52",marginTop:3}}>Auto-fills from rent — edit if different</div>
        </div>
      </div>
    </div>

    <div className="fld" style={{marginBottom:14}}>
      <label>Internal Notes</label>
      <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
        placeholder="Any notes about this tenant or lease situation..."
        rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/>
    </div>

    <div className="mft">
      <button className="btn btn-out" onClick={onClose}>Cancel</button>
      <button className="btn btn-green" onClick={submit}>Add Tenant → Mark Occupied</button>
    </div>
  </div></div>
  );
}

// ─── PropEditor ─────────────────────────────────────────────────────
export default function PropEditor({prop,onSave,onClose,onDelete,isNew,onViewTenant,onRemoveTenant,settings,onUpdateSettings,showAlert,showConfirm}){
  const _acc=settings?.adminAccent||"#4a7c59";
  const _grn=settings?.themeGreen||"#4a7c59";
  const _red=settings?.themeRed||"#c45c4a";
  const _gold=settings?.themeGold||"#d4a853";
  const[p,setP]=useState(()=>{if(!prop)return{id:uid(),name:"",addr:"",type:"SFH",sqft:0,photos:[],units:[]};try{return JSON.parse(JSON.stringify(prop));}catch{return{...prop,photos:prop.photos||[],units:(prop.units||[]).map(u=>({...u,rooms:(u.rooms||[])}))};} });
  const[activeUnit,setActiveUnit]=useState(0);
  const[warning,setWarning]=useState(null);
  const[unsaved,setUnsaved]=useState(false);
  const[saveShake,setSaveShake]=useState(0);
  const[justSaved,setJustSaved]=useState(false);
  const[showUtilModal,setShowUtilModal]=useState(false);
  const[showCloseConfirm,setShowCloseConfirm]=useState(false);
  const[leasePricingRoom,setLeasePricingRoom]=useState(null);
  const[mirrorTarget,setMirrorTarget]=useState(null);
  const[addTenantRoom,setAddTenantRoom]=useState(null);

  const markUnsaved=()=>{setUnsaved(true);setJustSaved(false);};
  const updP=(val)=>{setP(val);markUnsaved();};
  const mirrorFromA=(targetIdx)=>{
    const src=p.units[0];
    if(!src)return;
    const units=(p.units||[]).map((u,i)=>{
      if(i!==targetIdx)return u;
      return{
        ...u,
        sqft:src.sqft,baths:src.baths,utils:src.utils,clean:src.clean,
        rentalMode:src.rentalMode,rent:src.rent,sd:src.sd,desc:src.desc,
        rooms:(src.rooms||[]).map(r=>({...r,id:uid(),st:"vacant",le:null,tenant:null})),
      };
    });
    updP({...p,units});
  };
  const curUnit=p.units&&p.units.length>0?p.units[Math.min(activeUnit,(p.units||[]).length-1)]:null;
  const addUnit=()=>{
    const label=String.fromCharCode(65+(p.units||[]).length);
    const newUnit={id:uid(),name:p.type==="Duplex"?`Unit ${label}`:"Unit A",label:p.type==="Duplex"?label:"A",sqft:0,baths:1,utils:"allIncluded",clean:"Biweekly",rentalMode:"byRoom",rent:0,desc:"",photos:[],rooms:[]};
    const units=[...(p.units||[]),newUnit];
    updP({...p,units});setActiveUnit(units.length-1);
  };
  const updUnit=(f,v)=>{const units=(p.units||[]).map((u,i)=>i===activeUnit?{...u,[f]:v}:u);updP({...p,units});};
  const removeUnit=(idx)=>{const units=(p.units||[]).filter((_,j)=>j!==idx);updP({...p,units});setActiveUnit(Math.max(0,activeUnit-1));};
  const addRoom=()=>{
    if(!curUnit)return;
    const newRoom={id:uid(),name:`Bedroom ${(curUnit.rooms||[]).length+1}`,rent:600,sqft:150,pb:false,bed:"Queen",tv:'55"',furnished:true,feat:[],st:"vacant",le:null,tenant:null,desc:"",photos:[]};
    const units=(p.units||[]).map((u,i)=>i===activeUnit?{...u,rooms:[...(u.rooms||[]),newRoom]}:u);
    updP({...p,units});
  };
  const updRoom=(i,f,v)=>{
    const units=(p.units||[]).map((u,ui)=>ui===activeUnit?{...u,rooms:(u.rooms||[]).map((r,ri)=>ri===i?{...r,[f]:f==="rent"||f==="sqft"?Number(v):f==="pb"?v==="true":v}:r)}:u);
    updP({...p,units});
  };
  const updRoomPhotos=(i,v)=>{
    const units=(p.units||[]).map((u,ui)=>{
      if(ui!==activeUnit)return u;
      const rooms=(u.rooms||[]).map((r,ri)=>{if(ri!==i)return r;const newPhotos=typeof v==="function"?v(r.photos||[]):v;return{...r,photos:newPhotos};});
      return{...u,rooms};
    });
    updP({...p,units});
  };
  const isOcc=r=>r.st==="occupied"&&r.tenant;
  const mode=curUnit?.rentalMode||"byRoom";
  const tryClose=()=>{if(unsaved&&!justSaved)setShowCloseConfirm(true);else onClose();};
  return(<div className="mbg" onClick={tryClose}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:760}}>
    <h2>{isNew?"Add Property":`Edit: ${p.addr||p.name}`}</h2>

    {/* Property-level info */}
    <div className="fr" style={{alignItems:"flex-end"}}>
      <div className="fld"><label>Property Address</label><input value={p.addr||""} onChange={e=>updP({...p,addr:e.target.value})} placeholder="123 Main St, Huntsville AL 35816"/></div>
    </div>
    <div style={{background:"rgba(0,0,0,.02)",border:"1px solid rgba(0,0,0,.06)",borderRadius:8,padding:10,marginBottom:10}}>
      <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Map Pin Location</div>
      <div className="fr3">
        <div className="fld" style={{marginBottom:0}}>
          <label>Latitude</label>
          <input type="number" step="0.00001" value={p.lat||""} placeholder="Auto-set on Save"
            onChange={e=>setP({...p,lat:e.target.value===""?0:Number(e.target.value)})}
            onBlur={e=>{const v=Number(e.target.value);updP({...p,lat:v||0});}}/>
        </div>
        <div className="fld" style={{marginBottom:0}}>
          <label>Longitude</label>
          <input type="number" step="0.00001" value={p.lng||""} placeholder="Auto-set on Save"
            onChange={e=>setP({...p,lng:e.target.value===""?0:Number(e.target.value)})}
            onBlur={e=>{const v=Number(e.target.value);updP({...p,lng:v||0});}}/>
        </div>
        <div className="fld" style={{marginBottom:0}}>
          <label style={{visibility:"hidden"}}>.</label>
          {p.lat&&p.lng
            ?<div style={{fontSize:9,color:_grn,padding:"8px 10px",background:"rgba(74,124,89,.06)",borderRadius:6,border:"1px solid rgba(74,124,89,.15)",height:"100%",display:"flex",alignItems:"center"}}>✓ Pin set · saves with property</div>
            :<div style={{fontSize:9,color:_red,padding:"8px 10px",background:"rgba(196,92,74,.04)",borderRadius:6,border:"1px solid rgba(196,92,74,.15)"}}>
              No pin yet — Save to auto-geocode, or paste coords from{" "}
              <a href={`https://www.google.com/maps/search/${encodeURIComponent((p.addr||"")+" Huntsville AL")}`} target="_blank" rel="noopener" style={{color:_acc}}>Google Maps</a>
              {" "}(right-click → What's here?)
            </div>}
        </div>
      </div>
    </div>
    <div className="fr3">
      <div className="fld"><label>Property Type</label>
        <select value={p.type||"SFH"} onChange={e=>{
          const t=e.target.value;const cfg=PROP_TYPES[t]||PROP_TYPES.SFH;
          const existing=p.units||[];
          const newUnits=cfg.units.map((def,i)=>{
            const ex=existing[i];
            return ex
              ?{...ex,name:def.name,label:def.label}
              :{id:uid(),name:def.name,label:def.label,sqft:0,baths:1,
                utils:existing[0]?.utils||"allIncluded",clean:existing[0]?.clean||"Biweekly",
                rentalMode:"byRoom",rent:0,sd:0,desc:"",photos:[],rooms:[]};
          });
          setActiveUnit(0);updP({...p,type:t,units:newUnits});
        }}>
          {Object.entries(PROP_TYPES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      <div className="fld"><label>Total Sq Ft</label><input type="number" value={p.sqft||""} onChange={e=>updP({...p,sqft:Number(e.target.value)})} placeholder="2400"/></div>
      <div className="fld"><label>Property Photos</label><span style={{fontSize:10,color:"#6b5e52"}}>{(p.photos||[]).length} photo{(p.photos||[]).length!==1?"s":""}</span></div>
    </div>
    <PhotoManager photos={p.photos||[]} onChange={v=>{const newPhotos=typeof v==="function"?v(p.photos||[]):v;updP({...p,photos:newPhotos});}} label="Property Photos" propId={p.id} onFocalPoint={(x,y)=>updP({...p,focalPoint:{x,y}})}/>
    <div className="fld">
      <label>360 Tour Folder <span style={{fontWeight:400,color:"#6b5e52",fontSize:9,textTransform:"none",letterSpacing:0}}>— subfolder inside Supabase 360/ bucket</span></label>
      <input value={p.tourFolder||""} onChange={e=>updP({...p,tourFolder:e.target.value,tourScenes:[]})} placeholder="e.g. 908-lee-drive" style={{width:"100%"}}/>
      {p.tourFolder&&<div style={{fontSize:9,color:_grn,marginTop:3}}>property-photos/360/{p.tourFolder}/</div>}
    </div>

    {/* 3D Tour Scene Editor */}
    {p.tourFolder&&<TourSceneManager tourFolder={p.tourFolder} scenes={p.tourScenes||[]} onChange={v=>updP({...p,tourScenes:v})} showAlert={showAlert}/>}
    <div className="fr">
      <div className="fld" style={{flex:2}}><label>Internal Notes</label><textarea value={p.desc||""} onChange={e=>updP({...p,desc:e.target.value})} placeholder="Internal notes about this property..." rows={2}/></div>
    </div>

    {/* Section 2: Rental Configuration */}
    <div style={{borderTop:"2px solid rgba(0,0,0,.06)",marginTop:14,paddingTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:800,color:"#5c4a3a",letterSpacing:.3}}>
          RENTAL CONFIGURATION
          {(p.units||[]).length>1&&<span style={{fontWeight:400,color:"#6b5e52",marginLeft:6,fontSize:10}}>— select unit to configure</span>}
        </div>
        {(p.units||[]).length>1&&<div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          {(p.units||[]).map((u,i)=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:3}}>
              <button onClick={()=>setActiveUnit(i)} style={{
                padding:"5px 12px",borderRadius:7,border:"2px solid",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                background:i===activeUnit?"#1a1714":"#fff",color:i===activeUnit?_gold:"#5c4a3a",
                borderColor:i===activeUnit?"#1a1714":"rgba(0,0,0,.1)",transition:"all .15s",
              }}>{u.name||`Unit ${i+1}`}
              <span style={{fontSize:9,fontWeight:400,opacity:.6,marginLeft:4}}>{u.rentalMode==="wholeHouse"?"whole":"by room"}</span>
              </button>
              {i>0&&<button className="btn btn-out btn-sm" style={{fontSize:9,color:"#9a7422",borderColor:"rgba(212,168,83,.3)",padding:"3px 7px"}}
                title={"Copy Unit A settings to "+u.name}
                onClick={()=>setMirrorTarget(i)}>
                ⧉
              </button>}
            </div>
          ))}
          <button className="btn btn-out btn-sm" onClick={addUnit} title="Add another unit to this property">+ Unit</button>
        </div>}
      </div>

      {curUnit&&<div style={{background:"rgba(212,168,83,.03)",border:"1px solid rgba(212,168,83,.15)",borderRadius:10,padding:14,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingBottom:12,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
          <div>
            <div style={{fontSize:12,fontWeight:800,color:"#1a1714",marginBottom:2}}>
              {(p.units||[]).length>1?curUnit.name:"Rental Mode"}
            </div>
            <div style={{fontSize:10,color:"#6b5e52"}}>
              {mode==="byRoom"?"Rented by individual bedroom — configure each room below":"Rented as a whole unit — single lease, one tenant or household"}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <select value={curUnit.rentalMode||"byRoom"} onChange={e=>updUnit("rentalMode",e.target.value)}
              style={{fontWeight:700,fontSize:12,minWidth:130}}>
              <option value="byRoom">By Bedroom</option>
              <option value="wholeHouse">Whole Unit</option>
            </select>
            {(p.units||[]).length>(PROP_TYPES[p.type]||PROP_TYPES.SFH).units.length&&
              <button className="btn btn-red btn-sm" style={{fontSize:9}} onClick={()=>{
                const hasOcc=allRooms({units:[curUnit]}).some(r=>r.st==="occupied");
                if(hasOcc){showAlert({title:"Cannot Remove Unit",body:curUnit.name+" has occupied rooms. Remove all tenants from this unit before deleting it."});}
                else{showConfirm({title:"Remove "+curUnit.name+"?",body:"This cannot be undone. All room data in this unit will be permanently deleted.",confirmLabel:"Remove Unit",danger:true,onConfirm:()=>removeUnit(activeUnit)});}
              }}>Remove Unit</button>}
          </div>
        </div>

        <div className="fr3">
          {(p.units||[]).length>1&&<div className="fld"><label>Unit Name <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",fontSize:9}}>— editable</span></label><input value={curUnit.name||""} onChange={e=>updUnit("name",e.target.value)}/></div>}
          {(p.units||[]).length>1&&<div className="fld"><label>Sq Ft</label><input type="number" value={curUnit.sqft||""} onChange={e=>updUnit("sqft",Number(e.target.value))} placeholder="1200"/></div>}
          <div className="fld"><label>Bathrooms</label><input type="number" step="0.5" min="0.5" value={curUnit.baths||1} onChange={e=>updUnit("baths",Number(e.target.value))}/></div>
          <div className="fld"><label>Cleaning</label><select value={curUnit.clean||"Biweekly"} onChange={e=>updUnit("clean",e.target.value)}><option>Weekly</option><option>Biweekly</option><option>Monthly</option><option>None</option></select></div>
        </div>

        {/* Utilities */}
        <div className="fld">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
            <label style={{marginBottom:0}}>Utilities</label>
            <button type="button" onClick={()=>setShowUtilModal(true)} style={{fontSize:9,color:_acc,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:0,fontWeight:600}}>✏ Draft Email Settings</button>
          </div>
          <select value={curUnit.utils||"allIncluded"} onChange={e=>updUnit("utils",e.target.value)}>
            {getUtilTemplates(settings).map(t=><option key={t.id} value={t.key}>{t.name}</option>)}
          </select>
          {(()=>{const t=getUtilTemplates(settings).find(t=>t.key===(curUnit.utils||"allIncluded"));return t?<div style={{fontSize:9,color:"#6b5e52",marginTop:3}}>{t.desc}</div>:null;})()}
        </div>

        {/* Whole unit pricing */}
        {mode==="wholeHouse"&&<div className="fr">
          <div className="fld"><label>Monthly Rent</label><input type="number" value={curUnit.rent||""} onChange={e=>updUnit("rent",Number(e.target.value))} placeholder="3200"/></div>
          <div className="fld"><label>Security Deposit</label><input type="number" value={curUnit.sd||curUnit.rent||""} onChange={e=>updUnit("sd",Number(e.target.value))} placeholder="Defaults to 1 month rent"/></div>
        </div>}

        <div className="fld" style={{marginBottom:4}}><label>Unit Notes <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",fontSize:9}}>— internal only</span></label><textarea value={curUnit.desc||""} onChange={e=>updUnit("desc",e.target.value)} placeholder="Finishes, features, notes for this unit..." rows={2}/></div>
      </div>}

      {/* Section 3: Rooms (only for byRoom mode) */}
      {curUnit&&mode==="byRoom"&&<div style={{marginTop:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:"#5c4a3a",letterSpacing:.3}}>BEDROOMS{(p.units||[]).length>1?` — ${curUnit.name}`:""}</div>
            <div style={{fontSize:10,color:"#6b5e52"}}>{(curUnit.rooms||[]).length} room{(curUnit.rooms||[]).length!==1?"s":""} · each gets its own lease</div>
          </div>
          <button className="btn btn-out btn-sm" onClick={addRoom}>+ Add Room</button>
        </div>
        {(curUnit.rooms||[]).length===0&&<div style={{padding:"12px",textAlign:"center",color:"#6b5e52",fontSize:12,border:"2px dashed rgba(0,0,0,.06)",borderRadius:8}}>No rooms yet — click Add Room</div>}
        {(curUnit.rooms||[]).map((r,i)=>{const locked=isOcc(r);return(
          <div key={r.id} style={{padding:12,border:`1px solid ${locked?"rgba(0,0,0,.06)":"rgba(0,0,0,.05)"}`,borderRadius:8,marginBottom:8,background:locked?"#f0efec":"#faf9f7",position:"relative"}}>
            {locked&&<div style={{position:"absolute",top:6,right:8}}><span className="badge b-green" style={{fontSize:8}}>🔗 {r.tenant.name}</span></div>}
            <div className="fr3">
              <div className="fld"><label>Name</label><input value={r.name} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"name",e.target.value)}/></div>
              <div className="fld">
                <label>Rent $/mo</label>
                <input type="number" value={r.rent} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"rent",e.target.value)}/>
                {!locked&&<button className="btn btn-out btn-sm" style={{fontSize:9,color:"#9a7422",borderColor:"rgba(212,168,83,.3)",marginTop:4,width:"100%"}}
                  onClick={()=>setLeasePricingRoom({room:r,idx:i})}>
                  💰 Lease Pricing {(r.leaseTiers&&r.leaseTiers.length>0)?"("+r.leaseTiers.filter(t=>t.enabled).length+" tiers)":"(set up)"}
                </button>}
              </div>
              <div className="fld"><label>Bath</label><select value={String(r.pb)} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"pb",e.target.value)}><option value="true">Private</option><option value="false">Shared</option></select></div>
            </div>
            <div className="fr3">
              <div className="fld"><label>Sq Ft</label><input type="number" value={r.sqft||""} placeholder="150" disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"sqft",e.target.value)}/></div>
              <div className="fld"><label>Bed Size</label><select value={r.bed||"Queen"} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"bed",e.target.value)}><option>King</option><option>Queen</option><option>Full</option><option>Twin XL</option><option>Twin</option></select></div>
              <div className="fld"><label>TV Size</label><select value={r.tv||'55"'} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"tv",e.target.value)}><option value='75"'>75"</option><option value='65"'>65"</option><option value='55"'>55"</option><option value='50"'>50"</option><option value='43"'>43"</option><option value='42"'>42"</option><option value='32"'>32"</option><option value="None">None</option></select></div>
            </div>
            <div className="fr3">
              <div className="fld"><label>Status</label><div style={{padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:12,background:r.ownerOccupied?"rgba(59,130,246,.06)":locked?"rgba(74,124,89,.06)":"rgba(196,92,74,.06)",color:r.ownerOccupied?_acc:locked?_grn:_red,fontWeight:600}}>{r.ownerOccupied?"Owner Occupied":locked?("Occupied — "+(r.tenant.name)):"Vacant"}</div></div>
              <div className="fld"><label>Lease End</label><div style={{padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:12,color:"#6b5e52"}}>{r.le?fmtD(r.le):"—"}</div></div>
              <div className="fld"><label>Furnished</label><select value={String(r.furnished!==false)} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"furnished",e.target.value==="true")}><option value="true">✓ Furnished</option><option value="false">Unfurnished</option></select></div>
            </div>
            <div style={{marginBottom:8}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none",fontSize:11,fontWeight:600,color:r.ownerOccupied?_acc:"#5c4a3a",padding:"7px 10px",borderRadius:7,border:"1px solid "+(r.ownerOccupied?"rgba(59,130,246,.3)":"rgba(0,0,0,.06)"),background:r.ownerOccupied?"rgba(59,130,246,.04)":"transparent"}}>
                <input type="checkbox" checked={!!r.ownerOccupied} onChange={e=>updRoom(i,"ownerOccupied",e.target.checked)} style={{accentColor:_acc,width:14,height:14}}/>
                Owner Occupied - exclude from rent, financials, and public listings
              </label>
            </div>

            <div className="fr" style={{alignItems:"flex-end",gap:8}}>
              <div className="fld" style={{flex:1}}>
                <label>Utilities <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",letterSpacing:0,fontSize:9}}>— overrides unit default for this room</span></label>
                <select value={r.utils||curUnit?.utils||"allIncluded"} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"utils",e.target.value)}>
                  <option value="">— Use unit default —</option>
                  {getUtilTemplates(settings).map(t=><option key={t.id} value={t.key}>{t.name}</option>)}
                </select>
                {(r.utils&&r.utils!=="")&&<div style={{fontSize:9,color:"#5c4a3a",marginTop:3}}>{getUtilTemplates(settings).find(t=>t.key===r.utils)?.desc||""}</div>}
                {(!r.utils||r.utils==="")&&curUnit?.utils&&<div style={{fontSize:9,color:"#6b5e52",marginTop:3}}>Using unit default: {getUtilTemplates(settings).find(t=>t.key===curUnit.utils)?.name||curUnit.utils}</div>}
              </div>
              {!locked&&(curUnit?.rooms||[]).length>1&&<button className="btn btn-out btn-sm" style={{fontSize:9,whiteSpace:"nowrap",marginBottom:1}} title="Apply this room's utility setting to all rooms in this unit"
                onClick={()=>{const utils=r.utils||curUnit?.utils||"allIncluded";const units=(p.units||[]).map((u,ui)=>ui===activeUnit?{...u,rooms:(u.rooms||[]).map(rm=>({...rm,utils}))}:u);updP({...p,units});}}>
                ⚡ Apply to all rooms in {curUnit?.name||"this unit"}
              </button>}
            </div>
            {!locked&&<div className="fld">
              <label>Features <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",letterSpacing:0,fontSize:9}}>— shown on public site (check all that apply)</span></label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
                {["Walk-in closet","En-suite bath","Closet organizer","Street view","Backyard view","USB outlets","Blackout curtains","Ceiling fan","Private entrance","Corner room","Lots of natural light","Extra storage"].map(feat=>{
                  const checked=(r.feat||[]).includes(feat);
                  return(<label key={feat} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,cursor:"pointer",padding:"3px 8px",borderRadius:5,border:`1px solid ${checked?"rgba(212,168,83,.4)":"rgba(0,0,0,.08)"}`,background:checked?"rgba(212,168,83,.06)":"#faf9f7",userSelect:"none"}}>
                    <input type="checkbox" checked={checked} style={{accentColor:_gold,width:11,height:11}} onChange={()=>{const cur=r.feat||[];const next=checked?cur.filter(f=>f!==feat):[...cur,feat];updRoom(i,"feat",next);}}/>
                    {feat}
                  </label>);
                })}
              </div>
            </div>}
            {!locked&&<div className="fld"><label>Description <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",letterSpacing:0,fontSize:9}}>— internal notes</span></label><input value={r.desc||""} onChange={e=>updRoom(i,"desc",e.target.value)} placeholder="Additional notes..."/></div>}
            {!locked&&<PhotoManager photos={r.photos||[]} onChange={v=>updRoomPhotos(i,v)} label={`${r.name} Photos`} propId={p.id}/>}
            <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center",flexWrap:"wrap"}}>
              {!locked&&!r.ownerOccupied&&<button className="btn btn-green btn-sm" style={{fontSize:10}}
                onClick={()=>setAddTenantRoom({roomIdx:i,unitIdx:activeUnit})}>
                + Add Existing Tenant
              </button>}
              {!locked&&<button className="btn btn-red btn-sm" onClick={()=>{const units=(p.units||[]).map((u,ui)=>ui===activeUnit?{...u,rooms:(u.rooms||[]).filter((_,j)=>j!==i)}:u);updP({...p,units});}}>Remove Room</button>}
              {locked&&<button className="btn btn-gold btn-sm" onClick={()=>{
                onSave(p);
                setTimeout(()=>{if(onViewTenant)onViewTenant(r,p.name,p.id);},150);
              }}>📄 Manage Lease / Terminate</button>}
              {locked&&<span style={{fontSize:10,color:"#6b5e52"}}>Save required to manage lease</span>}
            </div>
          </div>);})}
      </div>}

      {curUnit&&mode==="wholeHouse"&&<div style={{marginTop:8}}>
        {(()=>{
          const rooms=curUnit.rooms||[];
          const anyOcc=rooms.some(r=>r.st==="occupied"&&r.tenant);
          const occupant=rooms.find(r=>r.st==="occupied"&&r.tenant)?.tenant;
          const latestLe=rooms.filter(r=>r.le).sort((a,b)=>new Date(b.le)-new Date(a.le))[0]?.le;
          return(<>
            <div style={{padding:"10px 14px",borderRadius:8,border:"1px solid rgba(0,0,0,.06)",background:anyOcc?"rgba(74,124,89,.04)":"rgba(196,92,74,.04)",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:anyOcc?_grn:_red}}>{anyOcc?"Occupied":"Vacant"}</div>
                {anyOcc&&occupant&&<div style={{fontSize:10,color:"#5c4a3a",marginTop:2}}>{occupant.name}{latestLe?<span style={{color:"#6b5e52",marginLeft:6}}>· lease ends {fmtD(latestLe)}</span>:null}</div>}
                {!anyOcc&&<div style={{fontSize:10,color:"#6b5e52",marginTop:2}}>No active tenant — ready to lease</div>}
              </div>
              {anyOcc
                ?<button className="btn btn-gold btn-sm" style={{fontSize:10}} onClick={()=>{
                    onSave(p);
                    setTimeout(()=>{if(onViewTenant&&occupant){onViewTenant(rooms.find(r=>r.tenant),p.name,p.id);}},150);
                  }}>Manage Lease / Terminate</button>
                :(curUnit.ownerOccupied?null:<button className="btn btn-green btn-sm" style={{fontSize:10}} onClick={()=>setAddTenantRoom({unitIdx:activeUnit,isWholeUnit:true})}>+ Add Existing Tenant</button>)}
            </div>
            {rooms.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
              {rooms.map(r=><div key={r.id} style={{padding:"4px 9px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:9,background:"#faf9f7",color:r.ownerOccupied?_acc:r.st==="occupied"?_grn:"#999"}}>
                {r.name} — {r.ownerOccupied?"Owner Occupied":r.st==="occupied"?r.tenant?.name||"Occupied":"Vacant"}
              </div>)}
            </div>}
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none",fontSize:11,fontWeight:600,color:curUnit.ownerOccupied?_acc:"#5c4a3a",padding:"7px 10px",marginTop:8,borderRadius:7,border:"1px solid "+(curUnit.ownerOccupied?"rgba(59,130,246,.3)":"rgba(0,0,0,.06)"),background:curUnit.ownerOccupied?"rgba(59,130,246,.04)":"transparent"}}>
              <input type="checkbox" checked={!!curUnit.ownerOccupied} onChange={e=>updUnit("ownerOccupied",e.target.checked)} style={{accentColor:_acc,width:14,height:14}}/>
              Owner Occupied - exclude from rent, financials, and public listings
            </label>
          </>);
        })()}
      </div>}
    </div>{/* end unit tabs */}

    {warning&&<div style={{background:"rgba(212,168,83,.08)",borderRadius:8,padding:12,marginTop:8,fontSize:12,color:"#5c4a3a",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span><strong>Room occupied by {warning}.</strong> Terminate lease or move tenant first.</span><button className="btn btn-out btn-sm" onClick={()=>setWarning(null)}>Got it</button></div>}
    {showUtilModal&&<UtilTemplatesModal settings={settings} onUpdateSettings={onUpdateSettings} onClose={()=>setShowUtilModal(false)} showConfirm={showConfirm}/>}
    {leasePricingRoom&&<LeasePricingModal room={leasePricingRoom.room} onClose={()=>setLeasePricingRoom(null)} onSave={tiers=>{
      const units=(p.units||[]).map((u,ui)=>ui===activeUnit?{...u,rooms:(u.rooms||[]).map((r,ri)=>ri===leasePricingRoom.idx?{...r,leaseTiers:tiers}:r)}:u);
      updP({...p,units});
    }}/>}
    {addTenantRoom!==null&&(()=>{
      const u=(p.units||[])[addTenantRoom.unitIdx];
      const isWhole=addTenantRoom.isWholeUnit;
      const r=isWhole?{id:u?.id,name:u?.name||"Whole Unit",rent:u?.rent||0}:(u?.rooms||[])[addTenantRoom.roomIdx];
      if(!r)return null;
      return(<AddExistingTenantModal room={r} propName={p.addr||p.name} onClose={()=>setAddTenantRoom(null)} onSave={data=>{
        const units=(p.units||[]).map((u2,ui)=>{
          if(ui!==addTenantRoom.unitIdx)return u2;
          if(isWhole){
            return{...u2,rooms:(u2.rooms||[]).map(rm=>({...rm,st:"occupied",le:data.le,rent:data.rent,tenant:data.tenant}))};
          }
          return{...u2,rooms:(u2.rooms||[]).map((rm,ri)=>ri===addTenantRoom.roomIdx?{...rm,...data}:rm)};
        });
        updP({...p,units});
        setAddTenantRoom(null);
      }}/> );
    })()}
    {mirrorTarget!==null&&<div className="mbg" onClick={()=>setMirrorTarget(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400,textAlign:"center"}}>
      <div style={{fontSize:28,marginBottom:12}}>⧉</div>
      <h2 style={{marginBottom:8}}>Mirror Unit A</h2>
      <p style={{fontSize:13,color:"#5c4a3a",marginBottom:6,lineHeight:1.6}}>
        Copy all settings from <strong>{(p.units||[])[0]?.name||"Unit A"}</strong> to <strong>{(p.units||[])[mirrorTarget]?.name||"Unit B"}</strong>?
      </p>
      <p style={{fontSize:11,color:"#6b5e52",marginBottom:20,lineHeight:1.5}}>
        Rental mode, utilities, cleaning schedule, room layout, and features will be copied. All rooms will be set to vacant — existing tenant data will not be affected.
      </p>
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setMirrorTarget(null)}>Cancel</button>
        <button className="btn btn-gold" onClick={()=>{mirrorFromA(mirrorTarget);setMirrorTarget(null);}}>Yes, Mirror Unit A →</button>
      </div>
    </div></div>}


    {justSaved&&<div style={{marginBottom:8,padding:"8px 12px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,fontSize:11,fontWeight:700,color:_grn,textAlign:"center"}}>
      ✓ Saved
    </div>}
    <div className="mft" style={{justifyContent:"space-between"}}>
      <button className="btn btn-red btn-sm" style={{fontSize:11}} onClick={()=>{
        const occ=allRooms(p).filter(r=>r.st==="occupied").length;
        if(occ>0){showAlert({title:"Cannot Delete Property",body:(p.addr||p.name)+" has "+occ+" occupied room"+(occ!==1?"s":"")+" . Remove all tenants before deleting."});}
        else{showConfirm({title:"Delete "+(p.addr||p.name)+"?",body:"This is permanent and cannot be undone. All rooms, photos, and settings for this property will be removed.",confirmLabel:"Delete Property",danger:true,onConfirm:()=>onDelete(p.id)});}
      }}>🗑 Delete Property</button>
      <div style={{display:"flex",gap:6}}>
      <button className="btn btn-out" onClick={onClose}>Cancel</button>
      <button className={`btn ${justSaved?"btn-green":unsaved?"btn-gold":"btn-out"}`} onClick={()=>{
        if(!p.addr?.trim()){setWarning("Property address is required.");return;}
        setWarning(null);
        setUnsaved(false);setJustSaved(true);
        setTimeout(()=>setJustSaved(false),3000);
        onSave(p);
      }}>{isNew?"Add Property":justSaved?"✓ Saved":"Save Changes"}</button>
      </div>
    </div>
  {showCloseConfirm&&<div className="mbg" style={{zIndex:10001}} onClick={e=>e.stopPropagation()}>
    <div style={{background:"#fff",borderRadius:14,padding:28,maxWidth:360,width:"90%",margin:"auto",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,.18)"}}>
      <div style={{fontSize:32,marginBottom:12}}>⚠️</div>
      <div style={{fontSize:16,fontWeight:700,color:"#1a1714",marginBottom:8}}>Unsaved changes</div>
      <div style={{fontSize:13,color:"#5c4a3a",marginBottom:20,lineHeight:1.5}}>You have unsaved changes to <strong>{p.addr||p.name||"this property"}</strong>. What would you like to do?</div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button className="btn btn-red" style={{minWidth:110}} onClick={()=>{setShowCloseConfirm(false);onClose();}}>Discard & Close</button>
        <button className="btn btn-gold" style={{minWidth:110}} onClick={()=>{
          setShowCloseConfirm(false);
          if(!p.addr?.trim()){setWarning("Property address is required.");return;}
          setUnsaved(false);setJustSaved(true);setTimeout(()=>setJustSaved(false),3000);onSave(p);
        }}>Save & Close</button>
      </div>
      <button style={{marginTop:14,background:"none",border:"none",fontSize:12,color:"#6b5e52",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowCloseConfirm(false)}>Keep editing</button>
    </div>
  </div>}
  </div></div>);
}
