"use client";
// ADMIN HQ — rentblackbear.com/admin
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";

// ── Inline SVG nav icons (no external dependency) ──────────────────
const I=({d,s=15})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const IconDashboard=()=><I d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"/>;
const IconTrending=()=><I d="M22 7l-8.5 8.5-5-5L2 17"/>;
const IconTarget=()=><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconAlert=()=><I d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01"/>;
const IconUsers=()=><I d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"/>;
const IconHome=()=><I d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>;
const IconDollar=()=><I d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>;
const IconClipboard=()=><I d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/>;
const IconWrench=()=><I d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>;
const IconFile=()=><I d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"/>;
const IconFolder=()=><I d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>;
const IconBook=()=><I d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>;
const IconGlobe=()=><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconPalette=()=><I d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>;
const IconBrain=()=><I d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14z M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14z"/>;
const IconBell=()=><I d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/>;
const IconSettings=()=><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;

// ─── Storage ────────────────────────────────────────────────────────
// Supabase
const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const supa=(path,opts={})=>fetch(SUPA_URL+"/rest/v1/"+path,{...opts,headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});
async function load(k,fb){try{const r=await supa("app_data?key=eq."+k+"&select=value");const d=await r.json();return d&&d.length>0&&d[0].value!=null?d[0].value:fb;}catch{return fb;}}
async function save(k,d){try{await supa("app_data",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify({key:k,value:d})});}catch(e){console.error("Save error:",k,e);}}

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
const uid=()=>Math.random().toString(36).slice(2,9);
const fmt=n=>"$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtS=n=>"$"+Number(n).toLocaleString();
const fmtD=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;}
const numberToWords=(n)=>{const ones=["","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE","TEN","ELEVEN","TWELVE","THIRTEEN","FOURTEEN","FIFTEEN","SIXTEEN","SEVENTEEN","EIGHTEEN","NINETEEN"];const tens=["","","TWENTY","THIRTY","FORTY","FIFTY","SIXTY","SEVENTY","EIGHTY","NINETY"];if(!n||n===0)return"ZERO";if(n<20)return ones[n];if(n<100)return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:"");if(n<1000)return ones[Math.floor(n/100)]+" HUNDRED"+(n%100?" "+numberToWords(n%100):"");return numberToWords(Math.floor(n/1000))+" THOUSAND"+(n%1000?" "+numberToWords(n%1000):"");};
const DEF_LEASE_SECTIONS=[
          {id:"s1",title:"Terms",requiresInitials:true,active:true,content:"<p>RESIDENT agrees to pay in advance <strong>{{RENT_WORDS}} (${{MONTHLY_RENT}})</strong> per month on the 1st day of each month. This agreement shall commence on <strong>{{LEASE_START}}</strong> and continue until <strong>{{LEASE_END}}</strong>.</p><p>Should RESIDENT move into Residence after the 1st of the month, rent will be prorated per day as follows: ${{MONTHLY_RENT}} ÷ 30 days = ${{DAILY_RATE}}/day. Prorated amount for partial first month: <strong>${{PRORATED_RENT}}</strong>.</p>"},
          {id:"s2",title:"Payments",requiresInitials:true,active:true,content:"<p>Rent and other charges are to be paid at such place or method designated by PROPERTY MANAGER. All payments are to be made via the resident portal at rentblackbear.com or any other method approved by PROPERTY MANAGER.</p><p>PROPERTY MANAGER acknowledges receipt of the First Month's Rent and a Security Deposit of <strong>${{SECURITY_DEPOSIT}}</strong>. All payments are to be made payable to <strong>{{LANDLORD_NAME}}</strong>.</p>"},
          {id:"s3",title:"Security Deposits",requiresInitials:true,active:true,content:"<p>The Security Deposit of <strong>${{SECURITY_DEPOSIT}}</strong> shall be held at Redstone Federal Credit Union in Huntsville, AL. The total security deposit shall not exceed one month's rent in accordance with Alabama Law and shall secure compliance with the terms of this agreement.</p><p>The deposit shall be refunded to RESIDENT within 35 days after the premises have been completely vacated, less any amount necessary to pay: a) any unpaid rent, b) cleaning costs, c) cost for repair of damages above ordinary wear and tear, and d) any other amount legally allowable. If RESIDENT should move from the premises prior to the expiration of the lease, they shall automatically forfeit their security deposit.</p>"},
          {id:"s4",title:"Late Charge",requiresInitials:true,active:true,content:"<p>A late fee of <strong>$50</strong> shall be added and due for any payment of rent made after the 3rd of the month. An additional <strong>$5 per day</strong> will be charged until rent is paid in full. Any dishonored check shall be treated as unpaid rent, and subject to an additional fee of $35.</p>"},
          {id:"s5",title:"Utilities",requiresInitials:true,active:true,content:"<p>{{UTILITIES_CLAUSE}}</p><p>Internet/WiFi is provided by PROPERTY MANAGER at no additional cost. All utilities are due on the 1st day of each month. RESIDENT agrees to pay previous month's utilities on the 1st of every month.</p>"},
          {id:"s6",title:"Occupants",requiresInitials:true,active:true,content:"<p>Guest(s) staying over <strong>four (4) days</strong> within any thirty (30) day period without the written consent of PROPERTY MANAGER shall be considered a breach of this agreement. A $200 additional fee shall be charged to RESIDENT for each guest that stays in excess of four (4) days per thirty (30) day period. Repeated violations (two or more) are grounds for eviction.</p>"},
          {id:"s7",title:"Pets",requiresInitials:true,active:true,content:"<p>No animal, fowl, fish, reptile, and/or pet of any kind shall be kept on or about the premises without obtaining prior written consent. If pet(s) are discovered, RESIDENT will be fined <strong>$300</strong> and <strong>$10 for each additional day</strong> the pet is on the property. PROPERTY MANAGER may also begin eviction proceedings.</p>"},
          {id:"s8",title:"Parking",requiresInitials:true,active:true,content:"<p>RESIDENT is assigned parking space: <strong>{{PARKING_SPACE}}</strong>. Said space shall be used exclusively for parking of passenger automobiles. No washing, painting, or repair of vehicles is permitted. Only 1 (one) vehicle is allowed per resident. Violators may be towed at vehicle owner's risk and expense.</p>"},
          {id:"s9",title:"Noise & Quiet Hours",requiresInitials:true,active:true,content:"<p>RESIDENT agrees not to cause or allow any noise or activity on the premises which might disturb the peace and quiet of another RESIDENT and/or neighbor. Quiet hours are in effect from <strong>10:00 PM to 7:00 AM on weekdays</strong> and <strong>11:00 PM to 10:00 AM on weekends</strong>.</p>"},
          {id:"s10",title:"Smoking",requiresInitials:true,active:true,content:"<p>Any RESIDENT, including members of their household, guests, or visitors will be considered in violation of the lease if found smoking in the residence or anywhere on the property. This includes cigarettes, e-cigarettes, vaping devices, pipes, cigars, and similar substances.</p>"},
          {id:"s11",title:"Property Maintenance",requiresInitials:true,active:true,content:"<p>RESIDENT is responsible for: maintaining cleanliness of the premises; replacing consumable items including batteries for TV remotes, keypad doorknobs (<strong>Door Code: {{DOOR_CODE}}</strong>), and smoke/CO detectors in their room; and clearing blockages in drains caused by their actions. Failure to replace batteries may result in a <strong>$50 service fee</strong>.</p>"},
          {id:"s12",title:"Condition of Premises",requiresInitials:true,active:true,content:"<p>RESIDENT acknowledges they have examined the premises and all items are clean and in good satisfactory condition. RESIDENT agrees to keep the premises in good order and to immediately pay for costs to repair and/or replace any portion damaged by RESIDENT, their guests and/or invitees.</p>"},
          {id:"s13",title:"Right of Entry and Inspection",requiresInitials:true,active:true,content:"<p>PROPERTY MANAGER retains the right to enter, inspect, or repair the premises with at least <strong>24 hours written notice</strong> before entering, except in cases of emergency or suspected abandonment. In emergencies, PROPERTY MANAGER may enter without prior notice to ensure safety.</p>"},
          {id:"s14",title:"Notice of Termination",requiresInitials:true,active:true,content:"<p>Either Party may terminate the lease with a <strong>30-day written notice</strong>. Failure by RESIDENT to provide proper notice will result in rent for the following 30-day period and forfeiture of the security deposit.</p><p>After expiration of the leasing period, this agreement is automatically renewed month-to-month with a <strong>$50 monthly rent increase</strong>. If RESIDENT chooses to renew the lease, the rent does not increase from the original price.</p>"},
          {id:"s15",title:"Room Rental / Co-Living Acknowledgment",requiresInitials:true,active:true,content:"<p>This Agreement is for the rental of <strong>one private bedroom only</strong>, not the entire dwelling unit. RESIDENT acknowledges that: other bedrooms may be occupied by other residents; PROPERTY MANAGER makes no representations regarding compatibility of other residents; and roommate composition may change during the tenancy.</p><p>RESIDENT is granted shared, non-exclusive use of common areas: kitchen, living room, dining areas, hallways, and laundry room. RESIDENT is strictly limited to their assigned bathroom only.</p>"},
          {id:"s16",title:"House Rules",requiresInitials:true,active:true,content:"<p>RESIDENT shall comply with all house rules, which are deemed part of this rental agreement. Any violation may constitute grounds for eviction.</p><ul><li>Respect each other's privacy and personal belongings</li><li>No shoes in the house</li><li>No pets, no smoking</li><li>Keep all common areas clean, organized and decluttered at all times</li><li>Quiet hours as stated in Section 9</li><li>All roommates are responsible for trash/recycling bins on pickup days</li><li>When washing machine not in use, keep door open to prevent mold</li><li>Mattress cover shall not be taken off unless authorized by PROPERTY MANAGER</li></ul>"},
          {id:"s17",title:"Insurance",requiresInitials:false,active:true,content:"<p>RESIDENT acknowledges that PROPERTY MANAGER's insurance does not cover personal property damage caused by fire, theft, rain, war, acts of God, or acts of others. RESIDENT is advised to obtain their own renter's insurance policy to cover personal losses.</p>"},
          {id:"s18",title:"Entire Agreement",requiresInitials:false,active:true,content:"<p>This Agreement constitutes the entire Agreement between PROPERTY MANAGER and RESIDENT. No oral agreements have been entered into, and all modifications or notices shall be in writing to be valid. This Agreement shall be governed by the laws of the State of Alabama.</p>"},
];

const TODAY=new Date();const MO=TODAY.toLocaleString("default",{month:"long",year:"numeric"});

// Signature canvas component — draw only, used in lease signing flow
function SigCanvas({onSave,height=120}){
  const canvasRef=useRef(null);const drawing=useRef(false);const lastPos=useRef(null);
  const getPos=(e,c)=>{const r=c.getBoundingClientRect();const s=e.touches?e.touches[0]:e;return{x:s.clientX-r.left,y:s.clientY-r.top};};
  const start=(e)=>{e.preventDefault();drawing.current=true;const c=canvasRef.current;const ctx=c.getContext("2d");const p=getPos(e,c);lastPos.current=p;ctx.beginPath();ctx.arc(p.x,p.y,1,0,Math.PI*2);ctx.fillStyle="#1a1714";ctx.fill();};
  const move=(e)=>{if(!drawing.current)return;e.preventDefault();const c=canvasRef.current;const ctx=c.getContext("2d");const p=getPos(e,c);ctx.beginPath();ctx.moveTo(lastPos.current.x,lastPos.current.y);ctx.lineTo(p.x,p.y);ctx.strokeStyle="#1a1714";ctx.lineWidth=2;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();lastPos.current=p;};
  const end=()=>{drawing.current=false;};
  const clear=()=>{const c=canvasRef.current;c.getContext("2d").clearRect(0,0,c.width,c.height);};
  const save=()=>{const c=canvasRef.current;const ctx=c.getContext("2d");const data=ctx.getImageData(0,0,c.width,c.height).data;if(!Array.from(data).some((v,i)=>i%4===3&&v>0))return;onSave(c.toDataURL("image/png"));};
  return(<div>
    <canvas ref={canvasRef} width={520} height={height} style={{border:"1.5px solid rgba(0,0,0,.1)",borderRadius:8,cursor:"crosshair",display:"block",background:"#fff",touchAction:"none",maxWidth:"100%"}}
      onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
      onTouchStart={start} onTouchMove={move} onTouchEnd={end}/>
    <div style={{display:"flex",gap:8,marginTop:6}}>
      <button className="btn btn-out btn-sm" onClick={clear}>Clear</button>
      <button className="btn btn-gold btn-sm" onClick={save}>Apply Signature</button>
    </div>
  </div>);
}

// ─── Sample Data ────────────────────────────────────────────────────
const DEF_PROPS=[
  {id:"p1",name:"The Holmes House",addr:"Holmes & Lee, Huntsville",lat:0,lng:0,type:"SFH",sqft:2400,photos:[],
    units:[{id:"p1_u1",name:"Unit A",label:"A",sqft:2400,baths:3,utils:"first100",clean:"Weekly",rentalMode:"byRoom",rent:0,desc:"",photos:[],
      rooms:[
        {id:"r1",name:"Primary Suite",rent:850,pb:true,sqft:280,st:"occupied",le:"2026-07-31",tenant:{name:"Marcus Johnson",email:"marcus@email.com",phone:"(256) 555-1001",moveIn:"2025-08-01"}},
        {id:"r2",name:"Bedroom 2",rent:750,pb:true,sqft:220,st:"occupied",le:"2026-08-31",tenant:{name:"Sarah Chen",email:"sarah@email.com",phone:"(256) 555-1002",moveIn:"2025-09-01"}},
        {id:"r3",name:"Bedroom 3",rent:650,pb:false,sqft:180,st:"occupied",le:"2026-03-31",tenant:{name:"David Park",email:"david@email.com",phone:"(256) 555-1003",moveIn:"2025-10-01"}},
        {id:"r4",name:"Bedroom 4",rent:650,pb:false,sqft:175,st:"vacant",le:null,tenant:null},
        {id:"r5",name:"Bedroom 5",rent:600,pb:false,sqft:160,st:"occupied",le:"2026-10-31",tenant:{name:"Amy Rodriguez",email:"amy@email.com",phone:"(256) 555-1005",moveIn:"2025-11-01"}},
      ]}]},
  {id:"p2",name:"Lee Drive East",addr:"Lee Drive, Huntsville",lat:0,lng:0,type:"Duplex",sqft:2400,photos:[],
    units:[
      {id:"p2_u1",name:"Unit A",label:"A",sqft:1200,baths:2,utils:"allIncluded",clean:"Biweekly",rentalMode:"byRoom",rent:0,desc:"",photos:[],
        rooms:[
          {id:"r6",name:"Primary Suite",rent:750,pb:true,sqft:200,st:"occupied",le:"2026-06-30",tenant:{name:"James Williams",email:"james@email.com",phone:"(256) 555-2001",moveIn:"2025-07-01"}},
          {id:"r7",name:"Bedroom 2",rent:650,pb:false,sqft:170,st:"occupied",le:"2026-07-31",tenant:{name:"Lisa Thompson",email:"lisa@email.com",phone:"(256) 555-2002",moveIn:"2025-08-01"}},
          {id:"r8",name:"Bedroom 3",rent:600,pb:false,sqft:155,st:"vacant",le:null,tenant:null},
        ]},
      {id:"p2_u2",name:"Unit B",label:"B",sqft:1200,baths:2,utils:"allIncluded",clean:"Biweekly",rentalMode:"byRoom",rent:0,desc:"",photos:[],
        rooms:[]},
    ]},
  {id:"p3",name:"Lee Drive West",addr:"Lee Drive, Huntsville",lat:0,lng:0,type:"Duplex",sqft:2400,photos:[],
    units:[
      {id:"p3_u1",name:"Unit A",label:"A",sqft:1200,baths:2,utils:"allIncluded",clean:"Biweekly",rentalMode:"byRoom",rent:0,desc:"",photos:[],
        rooms:[
          {id:"r9",name:"Primary Suite",rent:750,pb:true,sqft:200,st:"occupied",le:"2026-12-31",tenant:{name:"Kevin Brown",email:"kevin@email.com",phone:"(256) 555-3001",moveIn:"2026-01-01"}},
          {id:"r10",name:"Bedroom 2",rent:650,pb:false,sqft:170,st:"occupied",le:"2026-12-31",tenant:{name:"Michelle Davis",email:"michelle@email.com",phone:"(256) 555-3002",moveIn:"2026-01-01"}},
          {id:"r11",name:"Bedroom 3",rent:600,pb:false,sqft:155,st:"occupied",le:"2027-01-31",tenant:{name:"Carlos Gutierrez",email:"carlos@email.com",phone:"(256) 555-3003",moveIn:"2026-02-01"}},
        ]},
      {id:"p3_u2",name:"Unit B",label:"B",sqft:1200,baths:2,utils:"allIncluded",clean:"Biweekly",rentalMode:"byRoom",rent:0,desc:"",photos:[],
        rooms:[]},
    ]},
];

// ── Migration: convert old props (rooms[]) to new format (units[]) ──
function migrateProps(rawProps){
  if(!rawProps||!rawProps.length)return rawProps;
  return rawProps.map(p=>{
    if(p.units)return p; // already migrated
    // Wrap existing rooms in a single "Main" unit
    return{
      ...p,photos:p.photos||[],
      units:[{
        id:p.id+"_u1",name:"Unit A",label:"A",
        sqft:p.sqft||0,baths:p.baths||1,
        utils:p.utils||"allIncluded",clean:p.clean||"Biweekly",
        rentalMode:p.rentalMode||"byRoom",
        rent:p.wholeHouseRent||0,desc:p.desc||"",photos:[],
        rooms:(allRooms(p)||[]),
      }],
    };
  });
}

// ── Helpers: flatten units→rooms for backward compat ──
const allRooms=(prop)=>{if(!prop)return[];if(prop.units&&prop.units.length>0)return prop.units.flatMap(u=>u.rooms||[]);return prop.rooms||[];};
const allRoomsWithUnit=(prop)=>(prop.units||[]).flatMap(u=>(u.rooms||[]).map(r=>({...r,unitId:u.id,unitName:u.name,unitLabel:u.label,unitUtils:u.utils,unitClean:u.clean})));
const findRoom=(props,roomId)=>{for(const p of props){for(const u of(p.units||[])){const r=(u.rooms||[]).find(x=>x.id===roomId);if(r)return{room:r,unit:u,prop:p};}}return null;};
const findUnit=(props,unitId)=>{for(const p of props){const u=(p.units||[]).find(x=>x.id===unitId);if(u)return{unit:u,prop:p};}return null;};

// Returns flat list of things that can be leased from a prop, respecting rentalMode per unit.
// Each item: { id, name, rent, st, le, propName, propId, unitId, unitName, unitLabel, isWholeUnit }
const leaseableItems=(prop,propName)=>{
  const pn=propName||prop.name||"";
  return(prop.units||[]).flatMap(u=>{
    if((u.rentalMode||"byRoom")==="wholeHouse"){
      const rooms=u.rooms||[];
      const anyOcc=rooms.some(r=>r.st==="occupied"||(r.tenant&&!r.st));
      const latestLe=rooms.filter(r=>r.le).sort((a,b)=>new Date(b.le)-new Date(a.le))[0]?.le||null;
      return[{
        id:u.id,name:(prop.units||[]).length>1?u.name:"Whole Unit",
        rent:u.rent||0,st:anyOcc?"occupied":"vacant",le:latestLe,
        propName:pn,propId:prop.id,unitId:u.id,unitName:u.name,unitLabel:u.label,
        isWholeUnit:true,baths:u.baths,sqft:u.sqft,beds:rooms.length,
      }];
    }
    return(u.rooms||[]).map(r=>({...r,st:r.st||(r.tenant?"occupied":"vacant"),propName:pn,propId:prop.id,unitId:u.id,unitName:u.name,unitLabel:u.label,isWholeUnit:false}));
  });
};
// Update a room by ID inside its unit, preserving hierarchy
const updateRoomInProps=(props,roomId,updater)=>props.map(p=>({...p,units:(p.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(r=>r.id===roomId?updater(r):r)}))}));
// Update a specific prop's room by ID
const updateRoomInProp=(prop,roomId,updater)=>({...prop,units:(prop.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(r=>r.id===roomId?updater(r):r)}))});


const DEF_PAYMENTS={};// {roomId: {month: amount}} - quick lookup (computed from charges)
const CHARGE_CATS=["Rent","Utility Overage","Late Fee","Security Deposit","Cleaning Fee","Damage Charge","Lock Change","Key Replacement","Move-In Fee","Move-Out Fee","Pet Violation","Smoking Violation","Guest Violation"];
const PAY_METHODS=["Zelle","Venmo","Cash","Check","CashApp","Bank Transfer","Stripe/ACH","Credit Card","Other"];
// Charges: source of truth for all money owed/paid
const DEF_CHARGES=[
  // ─── Marcus Johnson (r1, Holmes House, $850/mo) — reliable payer ───
  {id:"ch-r1-oct",roomId:"r1",tenantName:"Marcus Johnson",propName:"The Holmes House",roomName:"Primary Suite",category:"Rent",desc:"October 2025 Rent",amount:850,amountPaid:850,dueDate:"2025-10-01",createdDate:"2025-09-20",payments:[{id:"py-r1-oct",amount:850,method:"Zelle",date:"2025-10-01",notes:"",depositDate:"2025-10-01",depositStatus:"deposited"}],waived:false},
  {id:"ch-r1-nov",roomId:"r1",tenantName:"Marcus Johnson",propName:"The Holmes House",roomName:"Primary Suite",category:"Rent",desc:"November 2025 Rent",amount:850,amountPaid:850,dueDate:"2025-11-01",createdDate:"2025-10-20",payments:[{id:"py-r1-nov",amount:850,method:"Zelle",date:"2025-11-01",notes:"",depositDate:"2025-11-01",depositStatus:"deposited"}],waived:false},
  {id:"ch-r1-dec",roomId:"r1",tenantName:"Marcus Johnson",propName:"The Holmes House",roomName:"Primary Suite",category:"Rent",desc:"December 2025 Rent",amount:850,amountPaid:850,dueDate:"2025-12-01",createdDate:"2025-11-20",payments:[{id:"py-r1-dec",amount:850,method:"Zelle",date:"2025-12-02",notes:"",depositDate:"2025-12-02",depositStatus:"deposited"}],waived:false},
  {id:"ch-r1-jan",roomId:"r1",tenantName:"Marcus Johnson",propName:"The Holmes House",roomName:"Primary Suite",category:"Rent",desc:"January 2026 Rent",amount:850,amountPaid:850,dueDate:"2026-01-01",createdDate:"2025-12-20",payments:[{id:"py-r1-jan",amount:850,method:"Zelle",date:"2026-01-01",notes:"",depositDate:"2026-01-01",depositStatus:"deposited"}],waived:false},
  {id:"ch-r1-feb",roomId:"r1",tenantName:"Marcus Johnson",propName:"The Holmes House",roomName:"Primary Suite",category:"Rent",desc:"February 2026 Rent",amount:850,amountPaid:850,dueDate:"2026-02-01",createdDate:"2026-01-20",payments:[{id:"py-r1-feb",amount:850,method:"Zelle",date:"2026-01-31",notes:"Paid early",depositDate:"2026-01-31",depositStatus:"deposited"}],waived:false},
  {id:"ch-r1-mar",roomId:"r1",tenantName:"Marcus Johnson",propName:"The Holmes House",roomName:"Primary Suite",category:"Rent",desc:"March 2026 Rent",amount:850,amountPaid:850,dueDate:"2026-03-01",createdDate:"2026-02-20",payments:[{id:"py-r1-mar",amount:850,method:"Zelle",date:"2026-03-01",notes:"",depositDate:"2026-03-01",depositStatus:"deposited"}],waived:false},

  // ─── David Park (r3, Holmes House, $650/mo) — mixed payer, lease expiring ───
  {id:"ch-r3-oct",roomId:"r3",tenantName:"David Park",propName:"The Holmes House",roomName:"Bedroom 3",category:"Rent",desc:"October 2025 Rent",amount:650,amountPaid:650,dueDate:"2025-10-01",createdDate:"2025-09-20",payments:[{id:"py-r3-oct",amount:650,method:"Venmo",date:"2025-10-02",notes:"",depositDate:"2025-10-02",depositStatus:"deposited"}],waived:false},
  {id:"ch-r3-nov",roomId:"r3",tenantName:"David Park",propName:"The Holmes House",roomName:"Bedroom 3",category:"Rent",desc:"November 2025 Rent",amount:650,amountPaid:650,dueDate:"2025-11-01",createdDate:"2025-10-20",payments:[{id:"py-r3-nov",amount:650,method:"Venmo",date:"2025-11-08",notes:"Said he forgot",depositDate:"2025-11-08",depositStatus:"deposited"}],waived:false},
  {id:"ch-r3-nov-lf",roomId:"r3",tenantName:"David Park",propName:"The Holmes House",roomName:"Bedroom 3",category:"Late Fee",desc:"November 2025 Late Fee",amount:85,amountPaid:85,dueDate:"2025-11-08",createdDate:"2025-11-04",payments:[{id:"py-r3-nov-lf",amount:85,method:"Venmo",date:"2025-11-08",notes:"$50 base + $35 (7d × $5)",depositDate:"2025-11-08",depositStatus:"deposited"}],waived:false},
  {id:"ch-r3-dec",roomId:"r3",tenantName:"David Park",propName:"The Holmes House",roomName:"Bedroom 3",category:"Rent",desc:"December 2025 Rent",amount:650,amountPaid:650,dueDate:"2025-12-01",createdDate:"2025-11-20",payments:[{id:"py-r3-dec",amount:650,method:"Cash",date:"2025-12-03",notes:"Paid in person",depositDate:"2025-12-03",depositStatus:"deposited"}],waived:false},
  {id:"ch-r3-jan",roomId:"r3",tenantName:"David Park",propName:"The Holmes House",roomName:"Bedroom 3",category:"Rent",desc:"January 2026 Rent",amount:650,amountPaid:650,dueDate:"2026-01-01",createdDate:"2025-12-20",payments:[{id:"py-r3-jan",amount:650,method:"Venmo",date:"2026-01-13",notes:"Ignored first 2 reminders",depositDate:"2026-01-13",depositStatus:"deposited"}],waived:false},
  {id:"ch-r3-jan-lf",roomId:"r3",tenantName:"David Park",propName:"The Holmes House",roomName:"Bedroom 3",category:"Late Fee",desc:"January 2026 Late Fee",amount:110,amountPaid:110,dueDate:"2026-01-13",createdDate:"2026-01-04",payments:[{id:"py-r3-jan-lf",amount:110,method:"Venmo",date:"2026-01-13",notes:"$50 base + $60 (12d × $5)",depositDate:"2026-01-13",depositStatus:"deposited"}],waived:false},
  {id:"ch-r3-feb",roomId:"r3",tenantName:"David Park",propName:"The Holmes House",roomName:"Bedroom 3",category:"Rent",desc:"February 2026 Rent",amount:650,amountPaid:650,dueDate:"2026-02-01",createdDate:"2026-01-20",payments:[{id:"py-r3-feb",amount:650,method:"Venmo",date:"2026-02-01",notes:"",depositDate:"2026-02-01",depositStatus:"deposited"}],waived:false},
  {id:"ch-r3-mar",roomId:"r3",tenantName:"David Park",propName:"The Holmes House",roomName:"Bedroom 3",category:"Rent",desc:"March 2026 Rent",amount:650,amountPaid:0,dueDate:"2026-03-01",createdDate:"2026-02-20",payments:[],waived:false},

  // ─── Amy Rodriguez (r5, Holmes House, $600/mo) — unpaid March, otherwise decent ───
  {id:"ch-r5-nov",roomId:"r5",tenantName:"Amy Rodriguez",propName:"The Holmes House",roomName:"Bedroom 5",category:"Rent",desc:"November 2025 Rent",amount:600,amountPaid:600,dueDate:"2025-11-01",createdDate:"2025-10-20",payments:[{id:"py-r5-nov",amount:600,method:"CashApp",date:"2025-11-02",notes:"",depositDate:"2025-11-02",depositStatus:"deposited"}],waived:false},
  {id:"ch-r5-dec",roomId:"r5",tenantName:"Amy Rodriguez",propName:"The Holmes House",roomName:"Bedroom 5",category:"Rent",desc:"December 2025 Rent",amount:600,amountPaid:600,dueDate:"2025-12-01",createdDate:"2025-11-20",payments:[{id:"py-r5-dec",amount:600,method:"CashApp",date:"2025-12-01",notes:"",depositDate:"2025-12-01",depositStatus:"deposited"}],waived:false},
  {id:"ch-r5-jan",roomId:"r5",tenantName:"Amy Rodriguez",propName:"The Holmes House",roomName:"Bedroom 5",category:"Rent",desc:"January 2026 Rent",amount:600,amountPaid:600,dueDate:"2026-01-01",createdDate:"2025-12-20",payments:[{id:"py-r5-jan",amount:600,method:"CashApp",date:"2026-01-03",notes:"",depositDate:"2026-01-03",depositStatus:"deposited"}],waived:false},
  {id:"ch-r5-feb",roomId:"r5",tenantName:"Amy Rodriguez",propName:"The Holmes House",roomName:"Bedroom 5",category:"Rent",desc:"February 2026 Rent",amount:600,amountPaid:600,dueDate:"2026-02-01",createdDate:"2026-01-20",payments:[{id:"py-r5-feb",amount:600,method:"CashApp",date:"2026-02-04",notes:"",depositDate:"2026-02-04",depositStatus:"deposited"}],waived:false},
  {id:"ch-r5-mar",roomId:"r5",tenantName:"Amy Rodriguez",propName:"The Holmes House",roomName:"Bedroom 5",category:"Rent",desc:"March 2026 Rent",amount:600,amountPaid:0,dueDate:"2026-03-01",createdDate:"2026-02-20",payments:[],waived:false},

  // ─── Sarah Chen (r2, Holmes House, $750/mo) — excellent payer ───
  {id:"ch-r2-jan",roomId:"r2",tenantName:"Sarah Chen",propName:"The Holmes House",roomName:"Bedroom 2",category:"Rent",desc:"January 2026 Rent",amount:750,amountPaid:750,dueDate:"2026-01-01",createdDate:"2025-12-20",payments:[{id:"py-r2-jan",amount:750,method:"Zelle",date:"2025-12-30",notes:"Paid early",depositDate:"2025-12-30",depositStatus:"deposited"}],waived:false},
  {id:"ch-r2-feb",roomId:"r2",tenantName:"Sarah Chen",propName:"The Holmes House",roomName:"Bedroom 2",category:"Rent",desc:"February 2026 Rent",amount:750,amountPaid:750,dueDate:"2026-02-01",createdDate:"2026-01-20",payments:[{id:"py-r2-feb",amount:750,method:"Zelle",date:"2026-01-31",notes:"Paid early",depositDate:"2026-01-31",depositStatus:"deposited"}],waived:false},
  {id:"ch-r2-mar",roomId:"r2",tenantName:"Sarah Chen",propName:"The Holmes House",roomName:"Bedroom 2",category:"Rent",desc:"March 2026 Rent",amount:750,amountPaid:750,dueDate:"2026-03-01",createdDate:"2026-02-20",payments:[{id:"py-r2-mar",amount:750,method:"Zelle",date:"2026-03-01",notes:"",depositDate:"2026-03-01",depositStatus:"deposited"}],waived:false},

  // ─── James Williams (r6, Lee Drive East, $750/mo) — good payer ───
  {id:"ch-r6-jan",roomId:"r6",tenantName:"James Williams",propName:"Lee Drive East",roomName:"Primary Suite",category:"Rent",desc:"January 2026 Rent",amount:750,amountPaid:750,dueDate:"2026-01-01",createdDate:"2025-12-20",payments:[{id:"py-r6-jan",amount:750,method:"Bank Transfer",date:"2026-01-01",notes:"",depositDate:"2026-01-03",depositStatus:"deposited"}],waived:false},
  {id:"ch-r6-feb",roomId:"r6",tenantName:"James Williams",propName:"Lee Drive East",roomName:"Primary Suite",category:"Rent",desc:"February 2026 Rent",amount:750,amountPaid:750,dueDate:"2026-02-01",createdDate:"2026-01-20",payments:[{id:"py-r6-feb",amount:750,method:"Bank Transfer",date:"2026-02-01",notes:"",depositDate:"2026-02-03",depositStatus:"deposited"}],waived:false},
  {id:"ch-r6-mar",roomId:"r6",tenantName:"James Williams",propName:"Lee Drive East",roomName:"Primary Suite",category:"Rent",desc:"March 2026 Rent",amount:750,amountPaid:750,dueDate:"2026-03-01",createdDate:"2026-02-20",payments:[{id:"py-r6-mar",amount:750,method:"Bank Transfer",date:"2026-03-01",notes:"",depositDate:"2026-03-03",depositStatus:"deposited"}],waived:false},

  // ─── Lisa Thompson (r7, Lee Drive East, $650/mo) — one damage charge ───
  {id:"ch-r7-jan",roomId:"r7",tenantName:"Lisa Thompson",propName:"Lee Drive East",roomName:"Bedroom 2",category:"Rent",desc:"January 2026 Rent",amount:650,amountPaid:650,dueDate:"2026-01-01",createdDate:"2025-12-20",payments:[{id:"py-r7-jan",amount:650,method:"Zelle",date:"2026-01-02",notes:"",depositDate:"2026-01-02",depositStatus:"deposited"}],waived:false},
  {id:"ch-r7-feb",roomId:"r7",tenantName:"Lisa Thompson",propName:"Lee Drive East",roomName:"Bedroom 2",category:"Rent",desc:"February 2026 Rent",amount:650,amountPaid:650,dueDate:"2026-02-01",createdDate:"2026-01-20",payments:[{id:"py-r7-feb",amount:650,method:"Zelle",date:"2026-02-01",notes:"",depositDate:"2026-02-01",depositStatus:"deposited"}],waived:false},
  {id:"ch-r7-mar",roomId:"r7",tenantName:"Lisa Thompson",propName:"Lee Drive East",roomName:"Bedroom 2",category:"Rent",desc:"March 2026 Rent",amount:650,amountPaid:650,dueDate:"2026-03-01",createdDate:"2026-02-20",payments:[{id:"py-r7-mar",amount:650,method:"Zelle",date:"2026-03-03",notes:"",depositDate:"2026-03-03",depositStatus:"deposited"}],waived:false},
  {id:"ch-r7-dmg",roomId:"r7",tenantName:"Lisa Thompson",propName:"Lee Drive East",roomName:"Bedroom 2",category:"Damage Charge",desc:"Broken closet door — repair",amount:175,amountPaid:175,dueDate:"2026-02-15",createdDate:"2026-02-10",payments:[{id:"py-r7-dmg",amount:175,method:"Zelle",date:"2026-02-15",notes:"Paid same day",depositDate:"2026-02-15",depositStatus:"deposited"}],waived:false},
];
const DEF_CREDITS=[];// [{id,roomId,tenantName,amount,reason,date,applied}]
const DEF_SD_LEDGER=[];// [{id,roomId,tenantName,propName,roomName,amountHeld,deposits:[],deductions:[],returned,returnDate}]
const DEF_MAINT=[ // maintenance requests
  {id:uid(),roomId:"r1",propId:"p1",tenant:"Marcus Johnson",title:"Dishwasher not draining",desc:"Water sits at the bottom after a cycle. Tried running it twice.",status:"open",priority:"medium",created:"2026-03-08",photos:0},
  {id:uid(),roomId:"r7",propId:"p2",tenant:"Lisa Thompson",title:"Bedroom door lock sticking",desc:"Have to jiggle the handle to get it to unlock. Getting worse.",status:"in-progress",priority:"low",created:"2026-03-05",photos:1},
];
const DEF_APPS=[
  // ── Pre-Screened (just submitted, not yet called) ──
  {id:"a1",name:"Jordan Lee",email:"jordan.lee@email.com",phone:"(256) 555-9001",property:"Lee Drive East",room:"",moveIn:"2026-04-15",income:"$3,800",status:"pre-screened",submitted:"2026-03-13",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"Roomies.com",lastContact:"2026-03-13",notes:"Found us on Roomies.com. Interested in a 3BR."},
  {id:"a2",name:"Priya Sharma",email:"priya.s@email.com",phone:"(256) 555-9002",property:"The Holmes House",room:"",moveIn:"2026-05-01",income:"$4,500",status:"pre-screened",submitted:"2026-03-12",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"Google Search",lastContact:"2026-03-12",notes:""},
  // ── Called (spoke on phone, deciding whether to invite) ──
  {id:"a3",name:"Rachel Kim",email:"rachel.k@email.com",phone:"(256) 555-9003",property:"The Holmes House",room:"Bedroom 4",moveIn:"2026-05-15",income:"$5,500",status:"called",submitted:"2026-03-10",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"NASA Intern Program",lastContact:"2026-03-13",notes:"NASA summer intern rotating through Redstone. Has employer security clearance — skip BG check. Offer letter on file."},
  {id:"a4",name:"Derek Owens",email:"derek.o@email.com",phone:"(256) 555-9004",property:"Lee Drive East",room:"",moveIn:"2026-05-01",income:"$3,900",status:"called",submitted:"2026-03-11",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"Drive-by / Sign",lastContact:"2026-03-12",notes:"Saw the sign on Lee Drive. Works at Boeing."},
  // ── Invited (sent application link, waiting for them to apply) ──
  {id:"a5",name:"Sam Patel",email:"sam.p@email.com",phone:"(256) 555-9005",property:"The Holmes House",room:"Bedroom 5",moveIn:"2026-06-01",income:"$6,200",status:"invited",submitted:"2026-03-08",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"NASA Intern Program",lastContact:"2026-03-11",screenPkg:"none",incomeAdd:"none",appFee:0,waiverReason:"Toyota intern — employer background check accepted. Offer letter on file.",inviteLink:"https://rentblackbear.com/apply?invite=a5",sentVia:"Email",notes:"Toyota intern, summer rotation",history:[{from:"pre-screened",to:"called",date:"2026-03-08"},{from:"called",to:"invited",date:"2026-03-11",note:"Invited via Email · No Screening (Waived) · Fee waived — Toyota intern — employer background check accepted."}]},
  {id:"a6",name:"Chris Walker",email:"chris.w@email.com",phone:"(256) 555-9006",property:"Lee Drive East",room:"Bedroom 3",moveIn:"2026-05-01",income:"$4,100",status:"invited",submitted:"2026-03-10",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"Facebook / Instagram",lastContact:"2026-03-12",screenPkg:"credit-bg",incomeAdd:"none",appFee:49,inviteLink:"https://rentblackbear.com/apply?invite=a6",sentVia:"Text",history:[{from:"pre-screened",to:"called",date:"2026-03-10"},{from:"called",to:"invited",date:"2026-03-12",note:"Invited via Text · Credit Report + Full Background Check · $49 fee"}]},
  // ── Applied (filled out application, payment submitted) ──
  {id:"a7",name:"Taylor Morgan",email:"taylor@email.com",phone:"(256) 555-9007",property:"The Holmes House",room:"Bedroom 4",moveIn:"2026-04-01",income:"$4,200",status:"applied",submitted:"2026-03-09",bgCheck:"pending",creditScore:"710",refs:"pending",source:"Google Search",lastContact:"2026-03-12",screenPkg:"credit-bg",incomeAdd:"income-only",appFee:59,notes:"Strong applicant. Income verification in progress.",history:[{from:"pre-screened",to:"called",date:"2026-03-09"},{from:"called",to:"invited",date:"2026-03-10"},{from:"invited",to:"applied",date:"2026-03-12",note:"Application submitted + $59 screening fee paid"}]},
  // ── Reviewing (BG check back, refs contacted, making decision) ──
  {id:"a8",name:"Marcus Johnson",email:"marcus.j@email.com",phone:"(256) 555-9008",property:"Lee Drive West",room:"Bedroom 2",moveIn:"2026-04-01",income:"$5,100",status:"reviewing",submitted:"2026-03-05",bgCheck:"passed",creditScore:"755",refs:"pending",source:"Military / Contractor Network",lastContact:"2026-03-13",screenPkg:"credit-bg",incomeAdd:"income-employment",appFee:64,notes:"Army contractor at Redstone. BG passed. Waiting on ref from previous landlord.",history:[{from:"pre-screened",to:"called",date:"2026-03-05"},{from:"called",to:"invited",date:"2026-03-06"},{from:"invited",to:"applied",date:"2026-03-08"},{from:"applied",to:"reviewing",date:"2026-03-10",note:"BG check passed. Credit 755. In review."}]},
  // ── Approved (approved, lease being generated) ──
  {id:"a9",name:"Alex Rivera",email:"alex.r@email.com",phone:"(256) 555-9009",property:"Lee Drive East",room:"Bedroom 3",moveIn:"2026-04-01",income:"$4,800",status:"approved",submitted:"2026-03-01",bgCheck:"passed",creditScore:"740",refs:"verified",source:"Zillow",lastContact:"2026-03-13",screenPkg:"credit-bg",incomeAdd:"none",appFee:49,notes:"Excellent applicant. All refs verified. Lease being prepared.",history:[{from:"pre-screened",to:"called",date:"2026-03-02"},{from:"called",to:"invited",date:"2026-03-03"},{from:"invited",to:"applied",date:"2026-03-05"},{from:"applied",to:"reviewing",date:"2026-03-06"},{from:"reviewing",to:"approved",date:"2026-03-13",note:"All checks clear. Approved. Preparing lease."}]},
  // ── Move-In (lease signed, SD paid, ready to move in) ──
  {id:"a10",name:"Jamie Chen",email:"jamie.c@email.com",phone:"(256) 555-9010",property:"The Holmes House",room:"Bedroom 2",moveIn:"2026-04-01",income:"$5,200",status:"move-in",submitted:"2026-02-20",bgCheck:"passed",creditScore:"780",refs:"verified",source:"Friend / Referral",lastContact:"2026-03-13",screenPkg:"credit-bg",incomeAdd:"none",appFee:49,notes:"Lease signed 3/12. SD paid. Moving in April 1.",history:[{from:"pre-screened",to:"called",date:"2026-02-21"},{from:"called",to:"invited",date:"2026-02-22"},{from:"invited",to:"applied",date:"2026-02-24"},{from:"applied",to:"reviewing",date:"2026-02-26"},{from:"reviewing",to:"approved",date:"2026-03-05"},{from:"approved",to:"move-in",date:"2026-03-12",note:"Lease signed. SD received. Moving in 4/1."}]},
  // ── Denied ──
  {id:"a11",name:"David Park",email:"david.p@email.com",phone:"(256) 555-9011",property:"Lee Drive West",room:"Bedroom 3",moveIn:"2026-04-01",income:"$3,200",status:"denied",submitted:"2026-03-05",bgCheck:"failed",creditScore:"520",refs:"not-started",source:"Craigslist",lastContact:"2026-03-08",deniedReason:"Failed background check — criminal record",deniedDate:"2026-03-08",prevStage:"reviewing"},
];
const DEF_DOCS=[
  {id:uid(),name:"Lease Template - Standard 12mo",type:"lease",property:"All",uploaded:"2026-01-15",size:"245 KB"},
  {id:uid(),name:"House Rules - Holmes House",type:"rules",property:"The Holmes House",uploaded:"2026-02-01",size:"18 KB"},
  {id:uid(),name:"Move-Out Cleaning Checklist",type:"checklist",property:"All",uploaded:"2026-02-01",size:"12 KB"},
  {id:uid(),name:"Move-In Inspection Form",type:"checklist",property:"All",uploaded:"2026-01-20",size:"8 KB"},
  {id:uid(),name:"Lease Addendum — Marcus Johnson (Primary Suite → Bedroom 2)",type:"addendum",property:"The Holmes House",tenant:"Marcus Johnson",tenantRoomId:"r1",uploaded:"2026-01-15",size:"4 KB",
    content:{tenant:"Marcus Johnson",email:"marcus@email.com",phone:"(256) 555-1001",originalRoom:"Primary Suite",originalProp:"The Holmes House",newRoom:"Bedroom 2",newProp:"The Holmes House",originalRent:850,newRent:750,effDate:"2026-01-15",reason:"Tenant requested downgrade — budget constraints",sdOrig:850,sdAdj:-100,sdNew:750,utilChange:false,utilFrom:"allIncluded",utilTo:"allIncluded",createdDate:"2026-01-15"}},
];
const DEF_TXNS=[
  {id:uid(),date:"2026-03-01",type:"income",desc:"Marcus Johnson - March Rent",amount:850,propId:"p1",cat:"Rent"},
  {id:uid(),date:"2026-03-01",type:"income",desc:"Sarah Chen - March Rent",amount:750,propId:"p1",cat:"Rent"},
  {id:uid(),date:"2026-03-01",type:"income",desc:"James Williams - March Rent",amount:750,propId:"p2",cat:"Rent"},
  {id:uid(),date:"2026-03-05",type:"expense",desc:"Huntsville Utilities - Electric/Water",amount:347.22,propId:"p1",cat:"Utilities"},
  {id:uid(),date:"2026-03-01",type:"expense",desc:"CleanPro - Weekly Clean",amount:175,propId:"p1",cat:"Cleaning"},
  {id:uid(),date:"2026-03-01",type:"expense",desc:"CleanPro - Biweekly Clean",amount:125,propId:"p2",cat:"Cleaning"},
];
const DEF_NOTIFS=[
  {id:uid(),type:"lease",msg:"David Park's lease expires in 20 days (3/31/2026)",date:"2026-03-11",read:false,urgent:true},
  {id:uid(),type:"payment",msg:"Amy Rodriguez hasn't paid March rent ($600)",date:"2026-03-11",read:false,urgent:true},
  {id:uid(),type:"maint",msg:"New maintenance request from Marcus Johnson",date:"2026-03-08",read:true,urgent:false},
  {id:uid(),type:"app",msg:"New application from Taylor Morgan for Holmes Bedroom 4",date:"2026-03-09",read:true,urgent:false},
];
const DEF_ARCHIVE=[
  {id:uid(),name:"Chris Walker",email:"chris.w@email.com",phone:"(256) 555-8001",roomName:"Bedroom 3",propName:"Lee Drive East",rent:600,moveIn:"2025-06-01",leaseEnd:"2026-03-01",terminatedDate:"2025-12-15",reason:"Broke lease early — noise complaints"},
  {id:uid(),name:"David Park",email:"david.p@email.com",phone:"(256) 555-9004",roomName:"Bedroom 2",propName:"Lee Drive West",rent:650,moveIn:"2025-01-01",leaseEnd:"2025-12-31",terminatedDate:"2025-11-30",reason:"Previously denied — failed BG check"},
];
const DEF_ROCKS=[{id:uid(),title:"Fill Holmes House Bedroom 4",owner:"Harrison",status:"on-track",due:"2026-06-30",notes:"Listed on site"},{id:uid(),title:"Capture Insta360 tours for all properties",owner:"Harrison",status:"off-track",due:"2026-06-30",notes:"Need to schedule"},{id:uid(),title:"Deploy rentblackbear.com live",owner:"Harrison",status:"on-track",due:"2026-04-15",notes:"Packaged, push to Vercel"},{id:uid(),title:"Set up Stripe rent collection",owner:"Harrison",status:"not-started",due:"2026-06-30",notes:""}];
const DEF_ISSUES=[{id:uid(),title:"David Park lease expiring March 31 — renew or find replacement",priority:"high",created:"2026-03-01"},{id:uid(),title:"Need real photos to replace stock images",priority:"medium",created:"2026-03-05"},{id:uid(),title:"Password protection for admin before adding real data",priority:"high",created:"2026-03-08"}];
// Scorecard: history of weekly snapshots. Current week is always calculated live.
function getWeekNum(d){const start=new Date(d.getFullYear(),0,1);return Math.ceil(((d-start)/864e5+start.getDay()+1)/7);}
function getWeekLabel(d){return`W${getWeekNum(d)} · ${d.getMonth()+1}/${d.getDate()}`;}
const CUR_WEEK=getWeekNum(TODAY);
const DEF_SC_HISTORY=[];// past weekly snapshots
const DEF_MONTHLY=[];// [{month:"2026-03",label:"March 2026",occ,collRate,vacancy,leads,collected,projected,full,totalRooms,occRooms,snappedOn}]
function getMonthKey(d){return`${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}`;}
function getMonthLabel(d){return d.toLocaleString("default",{month:"long",year:"numeric"});}
function isLastDayOfMonth(d){const next=new Date(d);next.setDate(next.getDate()+1);return next.getMonth()!==d.getMonth();}
const CUR_MONTH_KEY=getMonthKey(TODAY);
const PREV_MONTH_KEY=getMonthKey(new Date(TODAY.getFullYear(),TODAY.getMonth()-1,1));
const SC_GOALS={occ:100,coll:100,vacancy:0,leads:5};
const DEF_SETTINGS={companyName:"Black Bear Rentals",legalName:"Oak & Main Development LLC",phone:"(850) 696-8101",email:"info@rentblackbear.com",pmEmail:"blackbearhousing@gmail.com",city:"Huntsville, Alabama",tagline:"Huntsville's Turnkey Co-Living",heroHeadline:"Your Room Is Ready.",heroSubline:"Everything's Included.",heroDesc:"Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities — all handled.",adminFee:10,reminderTemplate:"Hi {firstName}, this is a friendly reminder that your {category} of {amount} was due on {dueDate}. Please log in to your tenant portal to view your balance and pay: {portalLink}\n\nIf you have already sent payment, please disregard this message. Thank you! — Black Bear Rentals",notifAppReceived:true,notifLeaseSent:true,notifLeaseSigned:true,notifPaymentReceived:true,notifMaintenanceRequest:true,notifPrescreen:true,
  emailTemplates:{
    prescreenSubject:"📋 New Pre-Screen — {name} · {property}",
    prescreenBody:"A new pre-screen was submitted by {name}. They passed all screening questions and left their contact info. Log in to admin to review and follow up.",
    prescreenTenantSubject:"You're on our radar, {firstName} 🐻 — Black Bear Rentals",
    prescreenTenantBody:"Thanks for reaching out, {firstName}! You passed our pre-screen — nice work. We've received your info and one of our team members will be in touch within 24 hours to discuss next steps.",
    applicationSubject:"📝 New Application — {name} · {property}",
    applicationBody:"A full application was submitted by {name} for {property}{room}. Review in admin.",
    leaseSignedSubject:"✍️ Lease Signed — {name}",
    leaseSignedBody:"{name} has signed their lease for {property}. Log in to admin to review.",
    paymentSubject:"💰 Payment Received — {name}",
    paymentBody:"{name} submitted a payment of {amount} for {property}.",
  },
  screenForm:{
    heading:"Almost There",
    subtext:"All fields are required.",
    sources:["Roomies.com","Google Search","Facebook / Instagram","Friend / Referral","Zillow / Apartments.com","Craigslist","Drive-by / Sign","Military / Contractor Network","NASA / Redstone Network","Other"],
  },
  utilTemplates:[
    {id:"ut1",name:"All Included",key:"allIncluded",desc:"Landlord pays all utilities — water, sewer, garbage, electric, gas.",clause:"PROPERTY MANAGER agrees to pay all utilities including water, sewer, garbage, electricity, and gas. RESIDENT is responsible for no utility costs beyond the monthly rent."},
    {id:"ut2",name:"Tenant Pays — Split (First $100)",key:"first100",desc:"PM covers first $100/mo. Overage split equally among all residents.",clause:"PROPERTY MANAGER agrees to pay the first $100 of combined utilities per month. Any usage exceeding $100 per month shall be split equally among all current residents and billed on the 1st of each month."},
    {id:"ut3",name:"Tenant Pays — Metered",key:"metered",desc:"Each tenant pays their own metered usage directly.",clause:"RESIDENT is responsible for paying their metered utility usage directly to the provider. PROPERTY MANAGER is not responsible for any utility costs."},
    {id:"ut4",name:"Tenant Pays — Full Split",key:"fullSplit",desc:"All utilities split equally among residents, no cap.",clause:"All utility costs including water, sewer, garbage, electricity, and gas shall be split equally among all current residents and billed on the 1st of each month."},
  ]
};
const DEF_THEME={bg:"#1a1714",card:"#2c2520",accent:"#d4a853",text:"#f5f0e8",muted:"#c4a882",surface:"#fefdfb",surfaceAlt:"#f5f0e8",green:"#4a7c59",dark:"#1a1714",warm:"#5c4a3a"};
const THEME_LABELS={bg:"Background",card:"Card",accent:"Accent",text:"Light Text",muted:"Muted",surface:"Surface",surfaceAlt:"Alt Surface",green:"Green",dark:"Dark",warm:"Warm"};
const PRESETS={"Warm Lodge":DEF_THEME,"Midnight":{bg:"#0f1729",card:"#1a2540",accent:"#3b82f6",text:"#e8ecf4",muted:"#8899b8",surface:"#fafbfe",surfaceAlt:"#eef2f9",green:"#22c55e",dark:"#0f1729",warm:"#64748b"},"Forest":{bg:"#1a2e1a",card:"#243524",accent:"#7cb342",text:"#e8f0e4",muted:"#a3b89a",surface:"#fafcf8",surfaceAlt:"#eef3ea",green:"#7cb342",dark:"#1a2e1a",warm:"#5a6b52"}};
function contrast(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return(r*.299+g*.587+b*.114)>150?"#1a1714":"#f5f0e8";}

const DEF_IDEAS=[
  {id:uid(),title:"Insta360 3D tour embeds",cat:"Public Site",priority:"high",status:"Planned",notes:"",link:"",archived:false},
  {id:uid(),title:"Floor plans",cat:"Public Site",priority:"medium",status:"Planned",notes:"",link:"",archived:false},
  {id:uid(),title:"Savings calculator",cat:"Public Site",priority:"low",status:"Done",notes:"",link:"",archived:false},
  {id:uid(),title:"Testimonials / review system",cat:"Public Site",priority:"medium",status:"Done",notes:"",link:"",archived:false},
  {id:uid(),title:"Password protection for admin",cat:"Admin",priority:"high",status:"Planned",notes:"",link:"",archived:false},
  {id:uid(),title:"Tenant portal (maintenance, house info)",cat:"Tenant Portal",priority:"high",status:"Idea",notes:"",link:"",archived:false},
  {id:uid(),title:"Rent payment portal (Stripe)",cat:"Tenant Portal",priority:"high",status:"Idea",notes:"",link:"",archived:false},
  {id:uid(),title:"Automated move-in emails",cat:"Automation",priority:"medium",status:"Idea",notes:"",link:"",archived:false},
  {id:uid(),title:"Rent due reminders",cat:"Automation",priority:"medium",status:"Idea",notes:"",link:"",archived:false},
  {id:uid(),title:"Stripe for rent (ACH)",cat:"Integrations",priority:"high",status:"Idea",notes:"",link:"",archived:false},
  {id:uid(),title:"Background check API",cat:"Integrations",priority:"medium",status:"Idea",notes:"",link:"",archived:false},
  {id:uid(),title:"E-signatures (DocuSign)",cat:"Integrations",priority:"medium",status:"Idea",notes:"",link:"",archived:false},
  {id:uid(),title:"Replace stock photos",cat:"Content",priority:"high",status:"Planned",notes:"",link:"",archived:false},
  {id:uid(),title:"Capture Insta360 tours",cat:"Content",priority:"high",status:"Planned",notes:"",link:"",archived:false},
  {id:uid(),title:"Referral program",cat:"Future",priority:"low",status:"Idea",notes:"",link:"",archived:false},
];
function randPalette(){const h=Math.floor(Math.random()*360);const c=(h+150+Math.random()*60)%360;const hl=(h2,s,l)=>{s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h2/30)%12;const cv=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*cv).toString(16).padStart(2,"0");};return`#${f(0)}${f(8)}${f(4)}`;};return{bg:hl(h,20,9),card:hl(h,18,15),accent:hl(c,70,60),text:hl(h,10,94),muted:hl(h,14,65),surface:hl(c,5,98),surfaceAlt:hl(c,7,94),green:hl(150,50,45),dark:hl(h,20,8),warm:hl(h,12,44)};}

// Photo manager — unlimited, multi-upload, drag-to-reorder

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
  // Canvas layout refs — updated on every draw so mouse handlers stay in sync
  const layoutRef=useRef({dx:0,dy:0,dw:0,dh:0,imgW:0,imgH:0});
  const dragRef=useRef(null); // {mode,startX,startY,startCropX,startCropY,startCropW,startCropH}
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
    // Store layout for mouse handlers
    layoutRef.current={dx,dy,dw,dh,imgW:rW,imgH:rH,sx,sy,sw,sh,scale};
    // Dark overlay outside crop on full image
    const fullScale=Math.min((c.width-20)/rW,(c.height-20)/rH);
    const fdx=(c.width-rW*fullScale)/2;const fdy=(c.height-rH*fullScale)/2;
    // Crop border
    ctx.strokeStyle="#d4a853";ctx.lineWidth=2;ctx.setLineDash([]);
    ctx.strokeRect(dx,dy,dw,dh);
    // Corner handles
    const hs=8;
    [[dx,dy],[dx+dw,dy],[dx,dy+dh],[dx+dw,dy+dh],
     [dx+dw/2,dy],[dx+dw/2,dy+dh],[dx,dy+dh/2],[dx+dw,dy+dh/2]
    ].forEach(([hx,hy])=>{
      ctx.fillStyle="#d4a853";ctx.fillRect(hx-hs/2,hy-hs/2,hs,hs);
    });
    // Grid
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
      // Init crop to aspect ratio if locked
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

  // Mouse handlers — drag to draw new crop, drag handles to resize
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
      // Handle resize
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

  return(<div className="mbg" onClick={onClose}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:1000,maxHeight:"95vh",overflowY:"auto",padding:20}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div><h2 style={{marginBottom:2}}>✏️ Photo Editor</h2>
        <div style={{fontSize:10,color:"#999"}}>Drag on photo to crop · Drag handles to resize · Drag inside box to move{aspectLock&&<span style={{marginLeft:8,background:"rgba(212,168,83,.12)",color:"#9a7422",fontWeight:700,padding:"1px 7px",borderRadius:4,fontSize:9}}>🔒 {aspectLock} locked — card preview ratio</span>}</div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={()=>setShowGrid(g=>!g)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",background:showGrid?"#d4a853":"#fff",color:showGrid?"#1a1714":"#5c4a3a",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⊞ Grid {showGrid?"ON":"OFF"}</button>
        <button onClick={()=>{setBrightness(100);setContrast(100);setSaturation(100);setRotation(0);setRotInput("0");setFlipH(false);setFlipV(false);setCropX(0);setCropY(0);setCropW(100);setCropH(100);cropRef.current={x:0,y:0,w:100,h:100};scheduleDraw();}} style={{padding:"5px 12px",borderRadius:6,border:"1px solid rgba(196,92,74,.3)",background:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",color:"#c45c4a"}}>↺ Reset All</button>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 270px",gap:16}}>
      {/* Canvas — drag to crop */}
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

      {/* Controls panel */}
      <div style={{overflowY:"auto",maxHeight:440,paddingRight:2}}>

        {/* Transform */}
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

        {/* Adjustments */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:800,color:"#9a7422",textTransform:"uppercase",letterSpacing:.5,marginBottom:7}}>Adjustments</div>
          <SL label="Brightness" val={brightness} set={setBrightness} min={20} max={200} step={1} unit="%"/>
          <SL label="Contrast" val={contrast} set={setContrast} min={20} max={200} step={1} unit="%" color="#7c6a3a"/>
          <SL label="Saturation" val={saturation} set={setSaturation} min={0} max={200} step={1} unit="%" color="#7c3a5a"/>
        </div>

        {/* Crop info */}
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
      <button className="btn btn-out" onClick={tryClose}>Cancel</button>
      <button className="btn btn-gold" onClick={applyAndSave} disabled={saving} style={{minWidth:140}}>{saving?"⏳ Saving...":"✓ Apply & Save"}</button>
    </div>
  </div></div>);
}

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
      // Try Supabase Storage first
      const url=await uploadPhoto(file,propId||"general");
      if(url){successCount++;return url;}
      // Fallback: base64 for small files only (<500KB)
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

  // drag-to-reorder
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
      <label style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.3}}>{label} ({ph.length} photo{ph.length!==1?"s":""})</label>
      {ph.length>0&&<div style={{display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:9,color:"#bbb"}}>🔍</span>
        <input type="range" min={60} max={200} step={10} value={thumbSize} onChange={e=>setThumbSize(Number(e.target.value))}
          style={{width:64,accentColor:"#d4a853",cursor:"pointer"}} title="Thumbnail size"/>
        <span style={{fontSize:9,color:"#bbb"}}>drag to reorder</span>
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
      {/* Add more tile */}
      <div onClick={openPicker} style={{aspectRatio:"1",borderRadius:7,border:"2px dashed rgba(0,0,0,.1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#faf9f7",gap:3}} onMouseOver={e=>e.currentTarget.style.borderColor="#d4a853"} onMouseOut={e=>e.currentTarget.style.borderColor="rgba(0,0,0,.1)"}>
        <span style={{fontSize:18}}>+</span>
        <span style={{fontSize:8,color:"#999",fontWeight:600}}>Add</span>
      </div>
    </div>}

    {ph.length===0&&<div
      onDragOver={e=>{e.preventDefault();setDropOver(true);}}
      onDragLeave={()=>setDropOver(false)}
      onDrop={handleDrop}
      onClick={openPicker}
      style={{border:`2px dashed ${dropOver?"#d4a853":"rgba(0,0,0,.08)"}`,borderRadius:8,padding:18,textAlign:"center",cursor:"pointer",background:dropOver?"rgba(212,168,83,.04)":"transparent",marginBottom:6,transition:"all .15s"}}>
      <div style={{fontSize:22,marginBottom:4}}>📷</div>
      <div style={{fontSize:11,color:"#999",fontWeight:600}}>Drop photos here or click to browse</div>
      <div style={{fontSize:9,color:"#bbb",marginTop:2}}>Select multiple files at once — no limit</div>
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

function UtilTemplatesModal({settings,onUpdateSettings,onClose}){
  const templates=settings?.utilTemplates||DEF_SETTINGS.utilTemplates;
  const[editingId,setEditingId]=useState(null);
  const[draftT,setDraftT]=useState(null);
  const saveTemplate=(t)=>{
    const existing=templates.find(x=>x.id===t.id);
    const updated=existing?templates.map(x=>x.id===t.id?t:x):[...templates,t];
    onUpdateSettings({...(settings||DEF_SETTINGS),utilTemplates:updated});
    setEditingId(null);setDraftT(null);
  };
  const deleteTemplate=(id)=>{
    showConfirm({title:"Delete Template?",body:"Any units currently using this template will keep their current value.",confirmLabel:"Delete",danger:true,onConfirm:()=>onUpdateSettings({...(settings||DEF_SETTINGS),utilTemplates:templates.filter(t=>t.id!==id)})});
  };
  const startNew=()=>{
    const t={id:uid(),name:"New Template",key:"custom_"+uid().slice(0,4),desc:"",clause:""};
    setDraftT(t);setEditingId(t.id);
  };
  return(<div className="mbg" onClick={onClose}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:600,maxHeight:"82vh",overflowY:"auto"}}>
    <h2 style={{marginBottom:4}}>Utility Templates</h2>
    <p style={{fontSize:11,color:"#999",marginBottom:16}}>These templates appear in the Utilities dropdown when editing unit settings. Each template has a name, short description, and full lease clause.</p>
    {templates.map(t=>(
      <div key={t.id} style={{border:"1px solid rgba(0,0,0,.07)",borderRadius:8,padding:12,marginBottom:8,background:"#faf9f7"}}>
        {editingId===t.id&&draftT
          ?<div>
            <div className="fr">
              <div className="fld"><label>Template Name</label><input value={draftT.name} onChange={e=>setDraftT(x=>({...x,name:e.target.value}))}/></div>
              <div className="fld"><label>Key <span style={{fontWeight:400,color:"#999",textTransform:"none"}}>(no spaces)</span></label><input value={draftT.key} onChange={e=>setDraftT(x=>({...x,key:e.target.value.replace(/[^a-z0-9_]/gi,"_")}))}/></div>
            </div>
            <div className="fld"><label>Short Description <span style={{fontWeight:400,color:"#999",textTransform:"none"}}>(shown below dropdown)</span></label><input value={draftT.desc} onChange={e=>setDraftT(x=>({...x,desc:e.target.value}))} placeholder="e.g. PM covers first $100/mo, overage split equally"/></div>
            <div className="fld"><label>Lease Clause <span style={{fontWeight:400,color:"#999",textTransform:"none"}}>(inserted into lease agreement)</span></label>
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
                <span style={{fontSize:9,color:"#bbb",fontFamily:"monospace",fontWeight:400}}>{t.key}</span>
              </div>
              {t.desc&&<div style={{fontSize:11,color:"#5c4a3a",marginTop:2}}>{t.desc}</div>}
              {t.clause&&<div style={{fontSize:10,color:"#999",marginTop:3,fontStyle:"italic",lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>"{t.clause}"</div>}
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
// ─── Tour Scene Manager ─────────────────────────────────────────────
function TourSceneManager({tourFolder,scenes,onChange}){
  const BASE_URL=SUPA_URL+"/storage/v1/object/public/property-photos/360/"+tourFolder+"/";
  // Use Supabase image transform for small thumbnails — avoids loading 72MP files in the editor
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

  // Inline edit panel for the active scene
  const editing=editingScene?scenes.find(s=>s.id===editingScene):null;

  return(
    <div style={{marginBottom:12}}>
      {/* Header row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <label style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.3}}>
          3D Tour Scenes ({scenes.length} scene{scenes.length!==1?"s":""})
        </label>
        {scenes.length>0&&<div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:"#bbb"}}>🔍</span>
          <input type="range" min={60} max={200} step={10} value={thumbSize} onChange={e=>setThumbSize(Number(e.target.value))}
            style={{width:64,accentColor:"#d4a853",cursor:"pointer"}} title="Thumbnail size"/>
          <span style={{fontSize:9,color:"#bbb"}}>drag to reorder</span>
        </div>}
      </div>

      {/* Inline scene edit panel */}
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
            <div style={{fontSize:9,color:"#999"}}>File: {editing.file}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <button className="btn btn-gold btn-sm" onClick={()=>setEditingScene(null)}>Done</button>
          <button className="btn btn-red btn-sm" onClick={()=>{removeScene(editing.id);setEditingScene(null);}}>Remove Scene</button>
        </div>
      </div>}

      {/* Thumbnail grid */}
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
            {/* Floor badge */}
            <div style={{position:"absolute",top:3,left:3,background:"rgba(0,0,0,.65)",color:"#fff",fontSize:7,fontWeight:800,padding:"1px 5px",borderRadius:3,zIndex:3,pointerEvents:"none"}}>
              F{s.floor||1}
            </div>
            {/* Edit button */}
            <div style={{position:"absolute",bottom:3,left:3,background:"rgba(212,168,83,.95)",color:"#1a1714",fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,zIndex:3,cursor:"pointer"}}
              onClick={e=>{e.stopPropagation();setEditingScene(editingScene===s.id?null:s.id);}}>
              ✏ Edit
            </div>
            <img src={thumbURL(s.file)} alt={s.label}
              style={{width:"100%",height:"100%",objectFit:"cover",display:"block",pointerEvents:"none"}}
              onError={e=>{e.target.style.display="none";}}/>
            {/* Scene label on hover overlay */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.55)",color:"#fff",fontSize:7,padding:"2px 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",pointerEvents:"none"}}>
              {s.label}
            </div>
            {/* Remove */}
            <button onClick={e=>{e.stopPropagation();if(editingScene===s.id)setEditingScene(null);removeScene(s.id);}}
              style={{position:"absolute",top:3,right:3,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,.65)",color:"#fff",border:"none",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3,lineHeight:1}}>
              ×
            </button>
          </div>
          );
        })}
        {/* Add tile */}
        <div onClick={()=>{setShowFileBrowser(true);setShowManual(false);if(!tourFiles.length)loadBucketFiles();}}
          style={{aspectRatio:"16/9",borderRadius:7,border:"2px dashed rgba(0,0,0,.1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#faf9f7",gap:3}}
          onMouseOver={e=>e.currentTarget.style.borderColor="#d4a853"}
          onMouseOut={e=>e.currentTarget.style.borderColor="rgba(0,0,0,.1)"}>
          <span style={{fontSize:18}}>+</span>
          <span style={{fontSize:8,color:"#999",fontWeight:600}}>Add</span>
        </div>
      </div>}

      {/* Empty state */}
      {scenes.length===0&&<div style={{border:"2px dashed rgba(0,0,0,.08)",borderRadius:8,padding:18,textAlign:"center",cursor:"pointer",marginBottom:6}}
        onClick={()=>{setShowFileBrowser(true);if(!tourFiles.length)loadBucketFiles();}}>
        <div style={{fontSize:22,marginBottom:4}}>🎥</div>
        <div style={{fontSize:11,color:"#999",fontWeight:600}}>No scenes yet — click to browse bucket files</div>
        <div style={{fontSize:9,color:"#bbb",marginTop:2}}>Or add manually below</div>
      </div>}

      {/* Add buttons */}
      <div style={{display:"flex",gap:6,marginBottom:6}}>
        <button className="btn btn-out btn-sm" style={{flex:1}} onClick={()=>{setShowFileBrowser(v=>!v);setShowManual(false);if(!tourFiles.length)loadBucketFiles();}}>
          {showFileBrowser?"Hide File Browser":"Browse Bucket Files"}
        </button>
        <button className="btn btn-out btn-sm" style={{flex:1}} onClick={()=>{setShowManual(v=>!v);setShowFileBrowser(false);}}>
          {showManual?"Hide":"Add Manually"}
        </button>
      </div>

      {/* File browser */}
      {showFileBrowser&&<div style={{background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.06)",borderRadius:8,padding:10,marginBottom:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:6,flexWrap:"wrap"}}>
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
        {tourFilesLoading&&<div style={{fontSize:11,color:"#999",textAlign:"center",padding:8}}>Loading files...</div>}
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

      {/* Manual add */}
      {showManual&&<div style={{background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.06)",borderRadius:8,padding:10,marginBottom:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:8}}>Add Scene Manually</div>
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

// ─── Lease Pricing Modal ─────────────────────────────────────────────
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
          <div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase"}}>Show</div>
          <div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase"}}>Term</div>
          <div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase"}}>Price/mo</div>
          <div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase"}}>Total</div>
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
              <span style={{fontSize:11,color:"#999"}}>$</span>
              <input type="number" value={t.price} min={0} step={5}
                onChange={e=>updTier(t.id,"price",Number(e.target.value)||0)}
                onFocus={()=>updTier(t.id,"override",true)}
                style={{width:"100%",padding:"4px 6px",borderRadius:5,border:"1px solid "+(t.override?"rgba(212,168,83,.5)":"rgba(0,0,0,.08)"),fontSize:11,fontFamily:"inherit"}}/>
            </div>
            <div style={{fontSize:10,color:"#999",textAlign:"right"}}>${(t.price*t.months).toLocaleString()}</div>
            <button onClick={()=>removeTier(t.id)} style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:14,lineHeight:1,padding:0}}>x</button>
          </div>
        ))}
        {/* Add custom duration */}
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
    <div style={{fontSize:11,color:"#999",marginBottom:14}}>
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
            <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
            <input type="number" value={form.rent} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",borderColor:errs.rent?"#c45c4a":undefined,width:"100%"}}
              onChange={e=>{setForm(p=>({...p,rent:e.target.value,sd:p.sdTouched?p.sd:e.target.value}));if(errs.rent)setErrs(p=>({...p,rent:null}));}} placeholder="0"/>
          </div>
        </div>
        <div className="fld" style={{marginBottom:0}}>
          <label>Security Deposit</label>
          <div style={{display:"flex",alignItems:"center"}}>
            <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
            <input type="number" value={form.sd} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",width:"100%"}}
              onChange={e=>setForm(p=>({...p,sd:e.target.value,sdTouched:true}))} placeholder="0"/>
          </div>
          <div style={{fontSize:9,color:"#999",marginTop:3}}>Auto-fills from rent — edit if different</div>
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

function PropEditor({prop,onSave,onClose,onDelete,isNew,onViewTenant,settings,onUpdateSettings}){
  const[p,setP]=useState(()=>{if(!prop)return{id:uid(),name:"",addr:"",type:"SFH",sqft:0,photos:[],units:[]};try{return JSON.parse(JSON.stringify(prop));}catch{return{...prop,photos:prop.photos||[],units:(prop.units||[]).map(u=>({...u,rooms:(u.rooms||[])}))};} });
  const[activeUnit,setActiveUnit]=useState(0);
  const[warning,setWarning]=useState(null);
  const[unsaved,setUnsaved]=useState(false);
  const[saveShake,setSaveShake]=useState(0);
  const[justSaved,setJustSaved]=useState(false);
  const[showUtilModal,setShowUtilModal]=useState(false);
  const[showCloseConfirm,setShowCloseConfirm]=useState(false);
  const[leasePricingRoom,setLeasePricingRoom]=useState(null);
  const[mirrorTarget,setMirrorTarget]=useState(null); // index of unit to mirror INTO
  const[addTenantRoom,setAddTenantRoom]=useState(null); // {roomIdx, unitIdx} — opens Add Existing Tenant panel

  const markUnsaved=()=>{setUnsaved(true);setJustSaved(false);};
  const updP=(val)=>{setP(val);markUnsaved();};
  // Mirror all settings + rooms from Unit A (index 0) to target unit
  const mirrorFromA=(targetIdx)=>{
    const src=p.units[0];
    if(!src)return;
    const units=(p.units||[]).map((u,i)=>{
      if(i!==targetIdx)return u;
      return{
        ...u,
        sqft:src.sqft,baths:src.baths,utils:src.utils,clean:src.clean,
        rentalMode:src.rentalMode,rent:src.rent,sd:src.sd,desc:src.desc,
        // Deep copy rooms with new IDs so they're fully independent
        rooms:(src.rooms||[]).map(r=>({...r,id:uid(),st:"vacant",le:null,tenant:null})),
      };
    });
    updP({...p,units});
  };
  // Unit helpers
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
  return(<div className="mbg" onClick={tryClose}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:760,maxHeight:"90vh",overflowY:"auto"}}>
    <h2>{isNew?"Add Property":`Edit: ${p.name}`}</h2>

    {/* Property-level info */}
    <div className="fr"><div className="fld"><label>Property Name</label><input value={p.name} onChange={e=>updP({...p,name:e.target.value})} placeholder="e.g. The Holmes House"/></div><div className="fld"><label>Address</label><input value={p.addr||""} onChange={e=>updP({...p,addr:e.target.value})} placeholder="123 Main St, Huntsville AL"/></div></div>
    <div style={{background:"rgba(0,0,0,.02)",border:"1px solid rgba(0,0,0,.06)",borderRadius:8,padding:10,marginBottom:10}}>
      <div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Map Pin Location</div>
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
            ?<div style={{fontSize:9,color:"#4a7c59",padding:"8px 10px",background:"rgba(74,124,89,.06)",borderRadius:6,border:"1px solid rgba(74,124,89,.15)",height:"100%",display:"flex",alignItems:"center"}}>✓ Pin set · saves with property</div>
            :<div style={{fontSize:9,color:"#c45c4a",padding:"8px 10px",background:"rgba(196,92,74,.04)",borderRadius:6,border:"1px solid rgba(196,92,74,.15)"}}>
              No pin yet — Save to auto-geocode, or paste coords from{" "}
              <a href={`https://www.google.com/maps/search/${encodeURIComponent((p.addr||"")+" Huntsville AL")}`} target="_blank" rel="noopener" style={{color:"#3b82f6"}}>Google Maps</a>
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
          // Build new units — preserve existing data where unit count matches, else scaffold
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
      <div className="fld"><label>Property Photos</label><span style={{fontSize:10,color:"#999"}}>{(p.photos||[]).length} photo{(p.photos||[]).length!==1?"s":""}</span></div>
    </div>
    <PhotoManager photos={p.photos||[]} onChange={v=>{const newPhotos=typeof v==="function"?v(p.photos||[]):v;updP({...p,photos:newPhotos});}} label="Property Photos" propId={p.id} onFocalPoint={(x,y)=>updP({...p,focalPoint:{x,y}})}/>
    <div className="fld">
      <label>360 Tour Folder <span style={{fontWeight:400,color:"#999",fontSize:9,textTransform:"none",letterSpacing:0}}>— subfolder inside Supabase 360/ bucket</span></label>
      <input value={p.tourFolder||""} onChange={e=>updP({...p,tourFolder:e.target.value,tourScenes:[]})} placeholder="e.g. 908-lee-drive" style={{width:"100%"}}/>
      {p.tourFolder&&<div style={{fontSize:9,color:"#4a7c59",marginTop:3}}>property-photos/360/{p.tourFolder}/</div>}
    </div>

    {/* ── 3D Tour Scene Editor ── */}
    {p.tourFolder&&<TourSceneManager tourFolder={p.tourFolder} scenes={p.tourScenes||[]} onChange={v=>updP({...p,tourScenes:v})}/>}
    <div className="fr">
      <div className="fld" style={{flex:2}}><label>Internal Notes</label><textarea value={p.desc||""} onChange={e=>updP({...p,desc:e.target.value})} placeholder="Internal notes about this property..." rows={2}/></div>
      <div className="fld" style={{flex:1}}>
        <label>Turnover Buffer <span style={{fontWeight:400,color:"#999",fontSize:9,textTransform:"none",letterSpacing:0}}>— days between leases</span></label>
        <input type="number" min={0} max={60} value={p.turnoverDays||""} onChange={e=>updP({...p,turnoverDays:Number(e.target.value)||0})} placeholder="e.g. 7"/>
        {(p.turnoverDays||0)>0&&<div style={{fontSize:9,color:"#4a7c59",marginTop:3}}>{p.turnoverDays} days blocked after each lease ends</div>}
      </div>
    </div>

    {/* ── Section 2: Rental Configuration ── */}
    <div style={{borderTop:"2px solid rgba(0,0,0,.06)",marginTop:14,paddingTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:800,color:"#5c4a3a",letterSpacing:.3}}>
          RENTAL CONFIGURATION
          {(p.units||[]).length>1&&<span style={{fontWeight:400,color:"#999",marginLeft:6,fontSize:10}}>— select unit to configure</span>}
        </div>
        {/* Unit tabs — show for multi-unit, always */}
        {(p.units||[]).length>1&&<div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          {(p.units||[]).map((u,i)=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:3}}>
              <button onClick={()=>setActiveUnit(i)} style={{
                padding:"5px 12px",borderRadius:7,border:"2px solid",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                background:i===activeUnit?"#1a1714":"#fff",color:i===activeUnit?"#d4a853":"#5c4a3a",
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
        {/* Rental Mode — first because it gates everything else */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingBottom:12,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
          <div>
            <div style={{fontSize:12,fontWeight:800,color:"#1a1714",marginBottom:2}}>
              {(p.units||[]).length>1?curUnit.name:"Rental Mode"}
            </div>
            <div style={{fontSize:10,color:"#999"}}>
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

        {/* Unit basics */}
        <div className="fr3">
          {(p.units||[]).length>1&&<div className="fld"><label>Unit Name <span style={{fontWeight:400,color:"#999",textTransform:"none",fontSize:9}}>— editable</span></label><input value={curUnit.name||""} onChange={e=>updUnit("name",e.target.value)}/></div>}
          {(p.units||[]).length>1&&<div className="fld"><label>Sq Ft</label><input type="number" value={curUnit.sqft||""} onChange={e=>updUnit("sqft",Number(e.target.value))} placeholder="1200"/></div>}
          <div className="fld"><label>Bathrooms</label><input type="number" step="0.5" min="0.5" value={curUnit.baths||1} onChange={e=>updUnit("baths",Number(e.target.value))}/></div>
          <div className="fld"><label>Cleaning</label><select value={curUnit.clean||"Biweekly"} onChange={e=>updUnit("clean",e.target.value)}><option>Weekly</option><option>Biweekly</option><option>Monthly</option><option>None</option></select></div>
        </div>

        {/* Utilities */}
        <div className="fld">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
            <label style={{marginBottom:0}}>Utilities</label>
            <button type="button" onClick={()=>setShowUtilModal(true)} style={{fontSize:9,color:"#3b82f6",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:0,fontWeight:600}}>✏ Edit Templates</button>
          </div>
          <select value={curUnit.utils||"allIncluded"} onChange={e=>updUnit("utils",e.target.value)}>
            {(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).map(t=><option key={t.id} value={t.key}>{t.name}</option>)}
          </select>
          {(()=>{const t=(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===(curUnit.utils||"allIncluded"));return t?<div style={{fontSize:9,color:"#999",marginTop:3}}>{t.desc}</div>:null;})()}
        </div>

        {/* Whole unit pricing */}
        {mode==="wholeHouse"&&<div className="fr">
          <div className="fld"><label>Monthly Rent</label><input type="number" value={curUnit.rent||""} onChange={e=>updUnit("rent",Number(e.target.value))} placeholder="3200"/></div>
          <div className="fld"><label>Security Deposit</label><input type="number" value={curUnit.sd||curUnit.rent||""} onChange={e=>updUnit("sd",Number(e.target.value))} placeholder="Defaults to 1 month rent"/></div>
        </div>}

        <div className="fld" style={{marginBottom:4}}><label>Unit Notes <span style={{fontWeight:400,color:"#999",textTransform:"none",fontSize:9}}>— internal only</span></label><textarea value={curUnit.desc||""} onChange={e=>updUnit("desc",e.target.value)} placeholder="Finishes, features, notes for this unit..." rows={2}/></div>
      </div>}

      {/* ── Section 3: Rooms (only for byRoom mode) ── */}
      {curUnit&&mode==="byRoom"&&<div style={{marginTop:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:"#5c4a3a",letterSpacing:.3}}>BEDROOMS{(p.units||[]).length>1?` — ${curUnit.name}`:""}</div>
            <div style={{fontSize:10,color:"#999"}}>{(curUnit.rooms||[]).length} room{(curUnit.rooms||[]).length!==1?"s":""} · each gets its own lease</div>
          </div>
          <button className="btn btn-out btn-sm" onClick={addRoom}>+ Add Room</button>
        </div>
        {(curUnit.rooms||[]).length===0&&<div style={{padding:"12px",textAlign:"center",color:"#999",fontSize:12,border:"2px dashed rgba(0,0,0,.06)",borderRadius:8}}>No rooms yet — click Add Room</div>}
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
              <div className="fld"><label>Status</label><div style={{padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:12,background:locked?"rgba(74,124,89,.06)":"rgba(196,92,74,.06)",color:locked?"#4a7c59":"#c45c4a",fontWeight:600}}>{locked?`Occupied — ${r.tenant.name}`:"Vacant"}</div></div>
              <div className="fld"><label>Lease End</label><div style={{padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:12,color:"#999"}}>{r.le?fmtD(r.le):"—"}</div></div>
              <div className="fld"><label>Furnished</label><select value={String(r.furnished!==false)} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"furnished",e.target.value==="true")}><option value="true">✓ Furnished</option><option value="false">Unfurnished</option></select></div>
            </div>
            <div className="fr" style={{alignItems:"flex-end",gap:8}}>
              <div className="fld" style={{flex:1}}>
                <label>Utilities <span style={{fontWeight:400,color:"#999",textTransform:"none",letterSpacing:0,fontSize:9}}>— overrides unit default for this room</span></label>
                <select value={r.utils||curUnit?.utils||"allIncluded"} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"utils",e.target.value)}>
                  <option value="">— Use unit default —</option>
                  {(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).map(t=><option key={t.id} value={t.key}>{t.name}</option>)}
                </select>
                {(r.utils&&r.utils!=="")&&<div style={{fontSize:9,color:"#5c4a3a",marginTop:3}}>{(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===r.utils)?.desc||""}</div>}
                {(!r.utils||r.utils==="")&&curUnit?.utils&&<div style={{fontSize:9,color:"#999",marginTop:3}}>Using unit default: {(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===curUnit.utils)?.name||curUnit.utils}</div>}
              </div>
              {!locked&&(curUnit?.rooms||[]).length>1&&<button className="btn btn-out btn-sm" style={{fontSize:9,whiteSpace:"nowrap",marginBottom:1}} title="Apply this room's utility setting to all rooms in this unit"
                onClick={()=>{const utils=r.utils||curUnit?.utils||"allIncluded";const units=(p.units||[]).map((u,ui)=>ui===activeUnit?{...u,rooms:(u.rooms||[]).map(rm=>({...rm,utils}))}:u);updP({...p,units});}}>
                ⚡ Apply to all rooms in {curUnit?.name||"this unit"}
              </button>}
            </div>
            {!locked&&<div className="fld">
              <label>Features <span style={{fontWeight:400,color:"#999",textTransform:"none",letterSpacing:0,fontSize:9}}>— shown on public site (check all that apply)</span></label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
                {["Walk-in closet","En-suite bath","Closet organizer","Street view","Backyard view","USB outlets","Blackout curtains","Ceiling fan","Private entrance","Corner room","Lots of natural light","Extra storage"].map(feat=>{
                  const checked=(r.feat||[]).includes(feat);
                  return(<label key={feat} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,cursor:"pointer",padding:"3px 8px",borderRadius:5,border:`1px solid ${checked?"rgba(212,168,83,.4)":"rgba(0,0,0,.08)"}`,background:checked?"rgba(212,168,83,.06)":"#faf9f7",userSelect:"none"}}>
                    <input type="checkbox" checked={checked} style={{accentColor:"#d4a853",width:11,height:11}} onChange={()=>{const cur=r.feat||[];const next=checked?cur.filter(f=>f!==feat):[...cur,feat];updRoom(i,"feat",next);}}/>
                    {feat}
                  </label>);
                })}
              </div>
            </div>}
            {!locked&&<div className="fld"><label>Description <span style={{fontWeight:400,color:"#999",textTransform:"none",letterSpacing:0,fontSize:9}}>— internal notes</span></label><input value={r.desc||""} onChange={e=>updRoom(i,"desc",e.target.value)} placeholder="Additional notes..."/></div>}
            {!locked&&<PhotoManager photos={r.photos||[]} onChange={v=>updRoomPhotos(i,v)} label={`${r.name} Photos`} propId={p.id}/>}
            <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center",flexWrap:"wrap"}}>
              {!locked&&<button className="btn btn-green btn-sm" style={{fontSize:10}}
                onClick={()=>setAddTenantRoom({roomIdx:i,unitIdx:activeUnit})}>
                + Add Existing Tenant
              </button>}
              {!locked&&<button className="btn btn-red btn-sm" onClick={()=>{const units=(p.units||[]).map((u,ui)=>ui===activeUnit?{...u,rooms:(u.rooms||[]).filter((_,j)=>j!==i)}:u);updP({...p,units});}}>Remove Room</button>}
              {locked&&<button className="btn btn-dk btn-sm" onClick={()=>{if(onViewTenant)onViewTenant(r,p.name);}}>View Lease and Tenant</button>}
              {locked&&<span style={{fontSize:10,color:"#999"}}>Manage lease to edit room</span>}
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
                <div style={{fontSize:12,fontWeight:700,color:anyOcc?"#4a7c59":"#c45c4a"}}>{anyOcc?"Occupied":"Vacant"}</div>
                {anyOcc&&occupant&&<div style={{fontSize:10,color:"#5c4a3a",marginTop:2}}>{occupant.name}{latestLe?<span style={{color:"#999",marginLeft:6}}>· lease ends {fmtD(latestLe)}</span>:null}</div>}
                {!anyOcc&&<div style={{fontSize:10,color:"#999",marginTop:2}}>No active tenant — ready to lease</div>}
              </div>
              {anyOcc
                ?<button className="btn btn-dk btn-sm" style={{fontSize:10}} onClick={()=>{if(onViewTenant&&occupant){onViewTenant(rooms.find(r=>r.tenant),p.name);}}}>View Tenant</button>
                :<button className="btn btn-green btn-sm" style={{fontSize:10}} onClick={()=>setAddTenantRoom({unitIdx:activeUnit,isWholeUnit:true})}>+ Add Existing Tenant</button>}
            </div>
            {rooms.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
              {rooms.map(r=><div key={r.id} style={{padding:"4px 9px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:9,background:"#faf9f7",color:r.st==="occupied"?"#4a7c59":"#999"}}>
                {r.name} — {r.st==="occupied"?r.tenant?.name||"Occupied":"Vacant"}
              </div>)}
            </div>}
          </>);
        })()}
      </div>}
    </div>{/* end unit tabs */}

    {warning&&<div style={{background:"rgba(212,168,83,.08)",borderRadius:8,padding:12,marginTop:8,fontSize:12,color:"#5c4a3a",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span><strong>Room occupied by {warning}.</strong> Terminate lease or move tenant first.</span><button className="btn btn-out btn-sm" onClick={()=>setWarning(null)}>Got it</button></div>}
    {showUtilModal&&<UtilTemplatesModal settings={settings} onUpdateSettings={onUpdateSettings} onClose={()=>setShowUtilModal(false)}/>}
    {leasePricingRoom&&<LeasePricingModal room={leasePricingRoom.room} onClose={()=>setLeasePricingRoom(null)} onSave={tiers=>{
      const units=(p.units||[]).map((u,ui)=>ui===activeUnit?{...u,rooms:(u.rooms||[]).map((r,ri)=>ri===leasePricingRoom.idx?{...r,leaseTiers:tiers}:r)}:u);
      updP({...p,units});
    }}/>}
    {addTenantRoom!==null&&(()=>{
      const u=(p.units||[])[addTenantRoom.unitIdx];
      const isWhole=addTenantRoom.isWholeUnit;
      const r=isWhole?{id:u?.id,name:u?.name||"Whole Unit",rent:u?.rent||0}:(u?.rooms||[])[addTenantRoom.roomIdx];
      if(!r)return null;
      return(<AddExistingTenantModal room={r} propName={p.name} onClose={()=>setAddTenantRoom(null)} onSave={data=>{
        const units=(p.units||[]).map((u2,ui)=>{
          if(ui!==addTenantRoom.unitIdx)return u2;
          if(isWhole){
            // Stamp tenant onto every room in the unit
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
      <p style={{fontSize:11,color:"#999",marginBottom:20,lineHeight:1.5}}>
        Rental mode, utilities, cleaning schedule, room layout, and features will be copied. All rooms will be set to vacant — existing tenant data will not be affected.
      </p>
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setMirrorTarget(null)}>Cancel</button>
        <button className="btn btn-gold" onClick={()=>{mirrorFromA(mirrorTarget);setMirrorTarget(null);}}>Yes, Mirror Unit A →</button>
      </div>
    </div></div>}


    {justSaved&&<div style={{marginBottom:8,padding:"8px 12px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,fontSize:11,fontWeight:700,color:"#4a7c59",textAlign:"center"}}>
      ✓ Saved
    </div>}
    <div className="mft" style={{justifyContent:"space-between"}}>
      <button className="btn btn-red btn-sm" style={{fontSize:11}} onClick={()=>{
        const occ=allRooms(p).filter(r=>r.st==="occupied").length;
        if(occ>0){showAlert({title:"Cannot Delete Property",body:p.name+" has "+occ+" occupied room"+(occ!==1?"s":"")+" . Remove all tenants before deleting."});}
        else{showConfirm({title:"Delete "+p.name+"?",body:"This is permanent and cannot be undone. All rooms, photos, and settings for this property will be removed.",confirmLabel:"Delete Property",danger:true,onConfirm:()=>onDelete(p.id)});}
      }}>🗑 Delete Property</button>
      <div style={{display:"flex",gap:6}}>
      <button className="btn btn-out" onClick={onClose}>Cancel</button>
      <button className={`btn ${justSaved?"btn-green":unsaved?"btn-gold":"btn-out"}`} onClick={()=>{
        if(!p.name.trim()){setWarning("Property name is required.");return;}
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
      <div style={{fontSize:13,color:"#5c4a3a",marginBottom:20,lineHeight:1.5}}>You have unsaved changes to <strong>{p.name||"this property"}</strong>. What would you like to do?</div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button className="btn btn-red" style={{minWidth:110}} onClick={()=>{setShowCloseConfirm(false);onClose();}}>Discard & Close</button>
        <button className="btn btn-gold" style={{minWidth:110}} onClick={()=>{
          setShowCloseConfirm(false);
          if(!p.name.trim()){setWarning("Property name is required.");return;}
          setUnsaved(false);setJustSaved(true);setTimeout(()=>setJustSaved(false),3000);onSave(p);
        }}>Save & Close</button>
      </div>
      <button style={{marginTop:14,background:"none",border:"none",fontSize:12,color:"#999",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowCloseConfirm(false)}>Keep editing</button>
    </div>
  </div>}
  </div></div>);
}

// ─── Styles ─────────────────────────────────────────────────────────
const S=`
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#f4f3f0;color:#1a1714}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes confettiFall{0%{transform:translateY(-100vh) rotate(0deg);opacity:1}70%{opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.55}}
@keyframes spin{to{transform:rotate(360deg)}}@keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-4px)}30%{transform:translateX(4px)}45%{transform:translateX(-3px)}60%{transform:translateX(3px)}75%{transform:translateX(-1px)}90%{transform:translateX(1px)}}
@keyframes redFlash{0%{box-shadow:none}40%{box-shadow:inset 0 0 0 2px rgba(196,92,74,.2)}100%{box-shadow:none}}
@keyframes fieldShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-3px)}40%{transform:translateX(3px)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}}
.field-err input,.field-err select,.field-err textarea{border-color:#c45c4a!important;background:rgba(196,92,74,.03)!important;animation:fieldShake .35s ease}
.field-err-label{color:#c45c4a!important}
.err-msg{font-size:10px;color:#c45c4a;margin-top:3px;font-weight:600}
@keyframes toastIn{from{opacity:0;transform:translateY(-30px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes toastOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}
.confetti-wrap{position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden}
.confetti-piece{position:absolute;width:10px;height:10px;border-radius:2px;animation:confettiFall linear forwards}
.lead-toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9998;background:#1a1714;border:2px solid #d4a853;border-radius:14px;padding:20px 28px;box-shadow:0 12px 40px rgba(0,0,0,.4);animation:toastIn .4s ease-out;max-width:420px;width:90%}
.lead-toast.out{animation:toastOut .3s ease-in forwards}

/* Layout */
.app{display:flex;height:100vh;overflow:hidden}
.side{width:220px;background:#1a1714;display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto}
.s-logo{padding:16px 18px;font-size:15px;font-weight:800;color:#f5f0e8;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:7px}
.s-logo span{color:#d4a853}
.s-lbl{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.72);padding:14px 16px 4px}
.sn{display:flex;align-items:center;gap:9px;padding:8px 12px;margin:1px 8px;border-radius:7px;font-size:13px;font-weight:500;color:rgba(255,255,255,.72);cursor:pointer;border:none;background:none;width:calc(100% - 16px);text-align:left;font-family:inherit;transition:all .12s;position:relative}
.sn:hover{background:rgba(255,255,255,.07);color:#fff}
.sn.on{background:rgba(212,168,83,.18);color:#f0c96a;font-weight:700}
.sn.on .sn-i{opacity:1}
.sn-i{width:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;opacity:.8;color:rgba(255,255,255,.9)}
.sn:hover .sn-i{opacity:1;color:#fff}
.sn.on .sn-i{opacity:1;color:#f0c96a}
.sn-badge{position:absolute;right:10px;background:#c45c4a;color:#fff;font-size:8px;font-weight:800;padding:1px 5px;border-radius:100px;min-width:16px;text-align:center}
.s-ft{margin-top:auto;padding:12px 14px;border-top:1px solid rgba(255,255,255,.06)}
.s-ft a{display:flex;align-items:center;gap:7px;font-size:11px;color:rgba(255,255,255,.45);text-decoration:none;padding:6px 0;transition:color .15s}.s-ft a:hover{color:#d4a853}

/* Mobile sidebar */
.mob-header{display:none;background:#1a1714;padding:12px 16px;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.mob-header .s-logo{padding:0;border:none}
.mob-toggle{background:none;border:none;color:#f5f0e8;font-size:20px;cursor:pointer;padding:4px}
.mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99}
.mob-overlay.show{display:block}

/* Main */
.mn{flex:1;overflow-y:auto;background:#f4f3f0;display:flex;flex-direction:column}
.tbar{background:#fff;padding:14px 24px;border-bottom:1px solid rgba(0,0,0,.04);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
.tbar h1{font-size:17px;font-weight:800;display:flex;align-items:center;gap:8px}
.tbar-sub{font-size:10px;color:#5c4a3a;margin-top:1px}
.cnt{padding:20px 24px;flex:1}

/* Buttons */
.btn{padding:7px 14px;border-radius:7px;border:none;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all .1s}
.btn:hover{transform:translateY(-1px)}
.btn-gold{background:#d4a853;color:#1a1714}.btn-gold:hover{background:#c99a3e}.btn-dk{background:#1a1714;color:#f5f0e8}.btn-dk:hover{background:#2c2520}
.pay-tab{flex:1;padding:14px 16px;fontSize:14px;font-weight:500;background:#fff;color:#5c4a3a;border:none;cursor:pointer;font-family:inherit;transition:all .2s;border-right:1px solid rgba(0,0,0,.04)}
.pay-tab:hover{background:#f0eeeb;color:#1a1714}.pay-tab.active{background:#1a1714;color:#f5f0e8;font-weight:800}.pay-tab.active:hover{background:#2c2520}
.btn-out{background:#fff;border:1px solid rgba(0,0,0,.08);color:#1a1714}.btn-out:hover{border-color:#d4a853}
.btn-green{background:#4a7c59;color:#fff}.btn-green:hover{background:#3a6448}.btn-red{background:rgba(196,92,74,.08);color:#c45c4a;border:1px solid rgba(196,92,74,.1)}.btn-red:hover{background:rgba(196,92,74,.15)}
.btn-sm{padding:5px 10px;font-size:10px;border-radius:5px}

/* KPIs */
.kgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px}
.kpi{background:#fff;border-radius:12px;padding:16px;border:1px solid rgba(0,0,0,.03);cursor:pointer;transition:all .15s}
.kpi:hover{border-color:rgba(212,168,83,.2);box-shadow:0 2px 12px rgba(0,0,0,.03)}
.kpi.active{border-color:rgba(212,168,83,.3);box-shadow:0 2px 16px rgba(212,168,83,.08)}
.kl{font-size:9px;font-weight:700;color:#5c4a3a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px}
.kv{font-size:24px;font-weight:800;line-height:1}.ks{font-size:10px;margin-top:3px}
.kg{color:#4a7c59}.kw{color:#d4a853}.kb{color:#c45c4a}

/* Cards/Rows */
.card{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.03);margin-bottom:12px;overflow:hidden}
.card-hd{padding:14px 18px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:background .1s}
.card-hd:hover{background:rgba(0,0,0,.01)}
.card-hd h3{font-size:14px;font-weight:800}
.card-bd{padding:16px 18px;border-top:1px solid rgba(0,0,0,.03)}
.row{display:flex;align-items:center;padding:10px 16px;background:#fff;border-radius:8px;border:1px solid rgba(0,0,0,.03);margin-bottom:6px;gap:10px;transition:all .12s}
.row:hover{border-color:rgba(212,168,83,.15)}
.row-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.row-i{flex:1;min-width:0}.row-t{font-size:12px;font-weight:700}.row-s{font-size:10px;color:#5c4a3a;margin-top:1px}
.row-v{font-size:14px;font-weight:800;text-align:right;min-width:60px}
.badge{font-size:8px;font-weight:700;padding:2px 8px;border-radius:100px;text-transform:uppercase;letter-spacing:.3px}
.b-green{background:rgba(74,124,89,.08);color:#4a7c59}
.b-gold{background:rgba(212,168,83,.1);color:#9a7422}
.b-red{background:rgba(196,92,74,.08);color:#c45c4a}
.b-blue{background:rgba(59,130,246,.08);color:#3b82f6}
.b-gray{background:rgba(0,0,0,.04);color:#999}

/* Section headers */
.sec-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.sec-hd h2{font-size:15px;font-weight:800}.sec-hd p{font-size:10px;color:#5c4a3a;margin-top:1px}

/* Tables */
.tbl{width:100%;border-collapse:separate;border-spacing:0}
.tbl th{text-align:left;padding:10px 14px;font-size:9px;font-weight:700;color:#5c4a3a;text-transform:uppercase;letter-spacing:.8px;border-bottom:2px solid rgba(0,0,0,.04)}
.tbl td{padding:10px 14px;font-size:12px;border-bottom:1px solid rgba(0,0,0,.03)}
.tbl tr:hover td{background:rgba(212,168,83,.02)}

/* Forms */
.fld{margin-bottom:10px}
.fld label{display:block;font-size:9px;font-weight:700;color:#5c4a3a;margin-bottom:3px;text-transform:uppercase;letter-spacing:.3px}
.fld input,.fld select,.fld textarea{width:100%;padding:8px 12px;border-radius:7px;border:1px solid rgba(0,0,0,.08);font-family:inherit;font-size:12px;outline:none;background:#faf9f7}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:#d4a853}
.fld textarea{resize:vertical;min-height:60px}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.fr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}

/* Modal */
.mbg{position:fixed;inset:0;background:rgba(26,23,20,.5);backdrop-filter:blur(3px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
.mbox{background:#fff;border-radius:14px;max-width:580px;width:100%;max-height:85vh;overflow-y:auto;overflow-x:hidden;padding:22px;animation:fadeIn .2s}
.mbox h2{font-size:16px;font-weight:800;margin-bottom:14px}
.mft{display:flex;justify-content:flex-end;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,.04)}

/* Notification dot */
.notif-dot{width:8px;height:8px;border-radius:50%;background:#c45c4a;display:inline-block;margin-left:4px}

/* Pipeline columns */
.pipeline{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;overflow-x:auto}
.pipe-col{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.03);overflow:hidden}
.pipe-hd{padding:12px 16px;border-bottom:1px solid rgba(0,0,0,.03);display:flex;justify-content:space-between;align-items:center}
.pipe-hd h4{font-size:12px;font-weight:800}.pipe-cnt{font-size:10px;color:#5c4a3a;background:rgba(0,0,0,.06);padding:1px 7px;border-radius:100px}
.pipe-bd{padding:10px;min-height:100px}
.pipe-card{padding:10px 10px 10px 30px;border-radius:8px;border:1px solid rgba(0,0,0,.07);margin-bottom:8px;cursor:pointer;transition:all .12s;position:relative}
.pipe-card:hover{border-color:rgba(212,168,83,.3);box-shadow:0 2px 8px rgba(0,0,0,.06)}
.pipe-nm{font-size:12px;font-weight:700;color:#1a1714;margin-bottom:2px}.pipe-sub{font-size:10px;color:#5c4a3a;font-weight:500}.pipe-meta{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}

/* Tenant portal preview */
.tp-card{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.03);padding:18px;margin-bottom:10px}
.tp-card h3{font-size:14px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:6px}
.tp-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(0,0,0,.03);font-size:12px}
.tp-row:last-child{border-bottom:none}
.tp-label{color:#3d3529;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.3px}

/* Accounting */
.acct-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
.acct-card{background:#fff;border-radius:12px;padding:18px;border:1px solid rgba(0,0,0,.03);text-align:center}
.acct-card .kv{font-size:28px}
.acct-card .kl{margin-bottom:8px}

/* Status pill */
.st-pill{font-size:9px;font-weight:700;padding:3px 10px;border-radius:100px;display:inline-flex;align-items:center;gap:4px}

/* Responsive */
/* Tablet */
@media(max-width:1024px){
  .side{width:200px}.cnt{margin-left:200px}
  .kgrid{grid-template-columns:1fr 1fr}
  .pipeline{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));overflow-x:auto}
  .fr3{grid-template-columns:1fr 1fr}
}

/* Phone */
@media(max-width:768px){
  .side{position:fixed;left:-260px;top:0;bottom:0;z-index:100;transition:left .25s;width:260px;box-shadow:4px 0 24px rgba(0,0,0,.3)}
  .side.open{left:0}
  .mob-header{display:flex}
  .cnt{margin-left:0;padding:14px}
  .tbar{padding:10px 14px}
  .tbar h1{font-size:18px}
  .kgrid{grid-template-columns:1fr 1fr;gap:8px}
  .kpi{padding:12px 10px}
  .kv{font-size:22px}
  .pipeline{grid-template-columns:1fr;gap:8px}
  .pipe-col{min-width:unset}
  .acct-summary{grid-template-columns:1fr}
  .fr,.fr3{grid-template-columns:1fr}
  .sec-hd{flex-direction:column;gap:8px;align-items:flex-start}
  .row{padding:10px 12px;gap:8px}
  /* Tables scroll horizontally */
  .tbl{display:block;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch}
  .tbl thead,.tbl tbody,.tbl tr{display:table;width:100%;table-layout:auto}
  .tbl th,.tbl td{padding:8px 10px;font-size:10px}
  /* Modals slide up from bottom */
  .mbg{align-items:flex-end}
  .mbox{max-width:100%!important;width:100%;border-radius:16px 16px 0 0;max-height:90vh;overflow-y:auto;animation:slideUp .25s ease-out}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .mft{flex-wrap:wrap}.mft button{flex:1;min-width:100px}
  /* Forms */
  .fld input,.fld select,.fld textarea{font-size:14px!important;padding:10px 12px}
  .sform-row{grid-template-columns:1fr}
  /* Payments tabs */
  .pay-tab{padding:10px 12px;font-size:12px!important}
  /* Charges inline expand */
  .card-bd{overflow-x:auto;-webkit-overflow-scrolling:touch}
  /* Buttons */
  .btn{padding:8px 14px;font-size:11px}
  .btn-sm{padding:6px 10px;font-size:9px}
  /* Filter rows */
  select,input[type="date"]{font-size:12px!important;min-width:0}
}

/* Small phone */
@media(max-width:420px){
  .kgrid{grid-template-columns:1fr}
  .kpi{padding:10px 8px}
  .kv{font-size:20px}
  .tbar h1{font-size:16px}
  .cnt{padding:10px}
  .pay-tab{padding:8px 6px;font-size:11px!important}
  .btn{font-size:10px;padding:7px 10px}
}
`;

// ─── Main App ───────────────────────────────────────────────────────
export default function Page(){
  const[tab,setTab]=useState("dashboard");
  const[props,setProps]=useState(DEF_PROPS);
  const[payments,setPayments]=useState(DEF_PAYMENTS);
  const[charges,setCharges]=useState(DEF_CHARGES);
  const[credits,setCredits]=useState(DEF_CREDITS);
  const[sdLedger,setSdLedger]=useState(DEF_SD_LEDGER);
  const[paySubTab,setPaySubTab]=useState("overview");
  const[payPeriod,setPayPeriod]=useState("mtd");
  const[payFilters,setPayFilters]=useState({property:"",tenant:"",category:"",status:"",dateFrom:"",dateTo:""});
  const[depFilters,setDepFilters]=useState({property:"",tenant:"",lease:"",dateFrom:"",dateTo:""});
  const[expCharge,setExpCharge]=useState(null);
  const[newCatInput,setNewCatInput]=useState("");
  const[showNewCat,setShowNewCat]=useState(false);
  const[savedThemes,setSavedThemes]=useState([]);
  const[appSearch,setAppSearch]=useState("");
  const[appView,setAppView]=useState("pipeline");
  const[bulkSel,setBulkSel]=useState([]);
  const[screenQs,setScreenQs]=useState([]);
  const[prevStep,setPrevStep]=useState(0);
  const[prevResult,setPrevResult]=useState(null);
  const[appFields,setAppFields]=useState([]);
  const[showConfetti,setShowConfetti]=useState(false);
  const[leadToast,setLeadToast]=useState(null);
  const[toastDismissing,setToastDismissing]=useState(false);
  const lastAppCountRef=useRef(0);
  const[maint,setMaint]=useState(DEF_MAINT);
  const[apps,setApps]=useState(DEF_APPS);
  const[docs,setDocs]=useState(DEF_DOCS);
  const[txns,setTxns]=useState(DEF_TXNS);
  const[notifs,setNotifs]=useState(DEF_NOTIFS);
  const[archive,setArchive]=useState(DEF_ARCHIVE);
  const[rocks,setRocks]=useState(DEF_ROCKS);
  const[issues,setIssues]=useState(DEF_ISSUES);
  const[scorecard,setScorecard]=useState(DEF_SC_HISTORY);
  const[monthly,setMonthly]=useState(DEF_MONTHLY);
  const[settings,setSettings]=useState(DEF_SETTINGS);
  const[theme,setTheme]=useState(DEF_THEME);
  const[editProp,setEditProp]=useState(null);
  const[dragPropIdx,setDragPropIdx]=useState(null);
  const[dragOverPropIdx,setDragOverPropIdx]=useState(null);
  const[isNewProp,setIsNewProp]=useState(false);
  const[ideas,setIdeas]=useState(DEF_IDEAS);
  const[loaded,setLoaded]=useState(false);
  const[modal,setModal]=useState(null);
  const[confirmDialog,setConfirmDialog]=useState(null);
  // Helper: show a centered confirm/alert modal instead of browser native dialogs
  const showConfirm=({title,body,onConfirm,confirmLabel="Confirm",danger=false})=>setConfirmDialog({title,body,onConfirm,confirmLabel,danger});
  const showAlert=({title,body})=>setConfirmDialog({title,body,onConfirm:null,confirmLabel:null,danger:false});
  const[sideOpen,setSideOpen]=useState(false);
  const[drill,setDrill]=useState(null);
  const[showCharts,setShowCharts]=useState(true);
  const[expanded,setExpanded]=useState({});
  const[ideaView,setIdeaView]=useState("board");
  const[ideaFilter,setIdeaFilter]=useState("all");
  const[scDrill,setScDrill]=useState(null);
  const[dismissedFollowUps,setDismissedFollowUps]=useState([]);
  const[ledgerTenant,setLedgerTenant]=useState("all");
  const[portalTenant,setPortalTenant]=useState(null);
  const[portalTab,setPortalTab]=useState("home");
  const[maintForm,setMaintForm]=useState({title:"",desc:"",priority:"medium",submitted:false});
  const[leases,setLeases]=useState([]);
  const[leaseTemplate,setLeaseTemplate]=useState(null);
  const[leaseSubTab,setLeaseSubTab]=useState("active");
  const[leaseForm,setLeaseForm]=useState(null);
  const[leaseSigErr,setLeaseSigErr]=useState(false);

  useEffect(()=>{(async()=>{
    const[p,pay,mt,a,d,t,n,rk,iss,sc,st,th,id,ar,ch,cr,sd,svt,mo,sq,af,ls,lt]=await Promise.all([load("hq-props",DEF_PROPS),load("hq-pay",DEF_PAYMENTS),load("hq-maint",DEF_MAINT),load("hq-apps",DEF_APPS),load("hq-docs",DEF_DOCS),load("hq-txns",DEF_TXNS),load("hq-notifs",DEF_NOTIFS),load("hq-rocks",DEF_ROCKS),load("hq-issues",DEF_ISSUES),load("hq-sc",DEF_SC_HISTORY),load("hq-settings",DEF_SETTINGS),load("hq-theme",DEF_THEME),load("hq-ideas",DEF_IDEAS),load("hq-archive",DEF_ARCHIVE),load("hq-charges",DEF_CHARGES),load("hq-credits",DEF_CREDITS),load("hq-sdledger",DEF_SD_LEDGER),load("hq-svthemes",[]),load("hq-monthly",DEF_MONTHLY),load("hq-screen-qs",[]),load("hq-app-fields",[]),load("hq-leases",[]),load("hq-lease-template",null)]);
    // Migrate old props format (rooms[]) to new (units[]) if needed
    const migratedProps=migrateProps(p);
    // Geocode any property missing valid coords — do this BEFORE setting state
    // so coords are in place when autosave fires
    const needsGeocode=migratedProps.filter(prop=>!(prop.lat&&prop.lng&&isFinite(prop.lat)&&isFinite(prop.lng)&&prop.lat!==0&&prop.lng!==0)&&prop.addr);
    let propsWithCoords=[...migratedProps];
    if(needsGeocode.length>0){
      for(const prop of needsGeocode){
        // Strip directional prefixes/suffixes Nominatim struggles with (e.g. "E Crestview DR NW" → "Crestview DR")
        const stripDir=s=>s.replace(/\b(NW|NE|SW|SE)\b/gi,"").replace(/\b[NSEW]\s+(?=[A-Za-z])/g,"").replace(/\s{2,}/g," ").trim();
        const clean=stripDir(prop.addr);
        const noQuad=prop.addr.replace(/\b(NW|NE|SW|SE)\b/gi,"").trim();
        const attempts=[
          prop.addr+", Huntsville, Alabama, USA",
          prop.addr+", Huntsville, AL, USA",
          noQuad+", Huntsville, AL, USA",
          clean+", Huntsville, AL, USA",
          clean+", Huntsville, Alabama, USA",
          prop.addr+", Alabama, USA",
        ];
        let found=false;
        for(const attempt of attempts){
          try{
            const res=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(attempt)}&format=json&limit=1&countrycodes=us`,{headers:{"User-Agent":"BlackBearRentals/1.0"}});
            const data=await res.json();
            if(data&&data.length>0){
              const lat=parseFloat(parseFloat(data[0].lat).toFixed(5));
              const lng=parseFloat(parseFloat(data[0].lon).toFixed(5));
              // Broad Alabama bounds check
              if(lat>30&&lat<36&&lng>-88&&lng<-84){
                propsWithCoords=propsWithCoords.map(x=>x.id===prop.id?{...x,lat,lng}:x);
                console.log("✓ Geocoded",prop.name,"→",lat,lng);
                found=true;
                break;
              }
            }
          }catch(e){console.warn("Geocode error:",e);}
          await new Promise(r=>setTimeout(r,700));
        }
        if(!found)console.warn("⚠ Could not geocode:",prop.name,prop.addr);
      }
    }
    setProps(propsWithCoords);setPayments(pay);setMaint(mt);setApps(a);setDocs(d);setTxns(t);setNotifs(n);setRocks(rk);setIssues(iss);setScorecard(sc);setSettings(st);setTheme(th);setIdeas(id);setArchive(ar);setCharges(ch);setCredits(cr);setSdLedger(sd);setSavedThemes(svt);setMonthly(mo);setScreenQs(sq);setAppFields(af);setLeases(ls);setLeaseTemplate(lt);setLoaded(true);
  })();},[]);

  useEffect(()=>{if(loaded){const t=setTimeout(()=>{Promise.all([save("hq-props",props),save("hq-pay",payments),save("hq-maint",maint),save("hq-apps",apps),save("hq-docs",docs),save("hq-txns",txns),save("hq-notifs",notifs),save("hq-rocks",rocks),save("hq-issues",issues),save("hq-sc",scorecard),save("hq-settings",settings),save("hq-theme",theme),save("hq-ideas",ideas),save("hq-archive",archive),save("hq-charges",charges),save("hq-credits",credits),save("hq-sdledger",sdLedger),save("hq-svthemes",savedThemes),save("hq-monthly",monthly),save("hq-screen-qs",screenQs),save("hq-app-fields",appFields),save("hq-leases",leases),save("hq-lease-template",leaseTemplate)]);},800);return()=>clearTimeout(t);}},[props,payments,maint,apps,docs,txns,notifs,rocks,issues,scorecard,settings,theme,ideas,archive,charges,credits,sdLedger,savedThemes,monthly,screenQs,appFields,leases,leaseTemplate,loaded]);

  // ─── Metrics ──────────────────────────────────────────────────
  const m=useMemo(()=>{
    let total=0,occ=0,full=0,proj=0,coll=0,due=0;const vacs=[];const expiring=[];const unpaid=[];const paid=[];
    props.forEach(pr=>allRooms(pr).forEach(r=>{
      total++;full+=r.rent;
      if(r.st==="occupied"){occ++;proj+=r.rent;due+=r.rent;
        const pd=(payments[r.id]&&payments[r.id][MO])||0;coll+=pd;
        if(pd)paid.push({...r,propName:pr.name,paidAmt:pd});else unpaid.push({...r,propName:pr.name});
        if(r.le){const dl=Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24));if(dl<=90)expiring.push({...r,propName:pr.name,daysLeft:dl});}
      }else vacs.push({...r,propName:pr.name});
    }));
    const openMaint=maint.filter(x=>x.status!=="resolved").length;
    const activeApps=apps.length;
    const unreadNotifs=notifs.filter(x=>!x.read).length;
    const propBreakdown=props.map(pr=>{const rooms=allRooms(pr);const occR=rooms.filter(r=>r.st==="occupied");const vacR=rooms.filter(r=>r.st!=="occupied");
      const prjR=occR.reduce((s,r)=>s+r.rent,0);const fullR=rooms.reduce((s,r)=>s+r.rent,0);
      const collR=occR.reduce((s,r)=>s+((payments[r.id]&&payments[r.id][MO])||0),0);
      return{...pr,occCount:occR.length,vacCount:vacR.length,projected:prjR,fullOcc:fullR,collected:collR,occRooms:occR,vacRooms:vacR};
    });
    return{total,occ,full,proj,coll,due,vacs,expiring,unpaid,paid,openMaint,activeApps,unreadNotifs,propBreakdown,
      occRate:total?Math.round(occ/total*100):0,collRate:due?Math.round(coll/due*100):0,lost:full-proj};
  },[props,payments,maint,apps,notifs]);

  // Auto-snapshot: when a new week starts, save previous week's live data to history
  useEffect(()=>{
    if(!loaded||!m)return;
    const lastSnap=scorecard.length?scorecard[scorecard.length-1]:null;
    const lastWeek=(lastSnap&&lastSnap.weekNum)||0;
    if(CUR_WEEK>lastWeek){
      // Snapshot current metrics as the closing data for the current week
      setScorecard(p=>[...p,{weekNum:CUR_WEEK,label:getWeekLabel(TODAY),occ:m.occRate,coll:m.collRate,vacancy:m.lost,leads:0}].slice(-13));// keep 13 weeks (quarter)
    }
  },[loaded,m]);

  // Monthly auto-snapshot: on the last day of each month (or backfill if missed)
  useEffect(()=>{
    if(!loaded||!m)return;
    const lastMonthSnap=monthly.length?monthly[monthly.length-1]:null;
    const lastSnapMonth=(lastMonthSnap&&lastMonthSnap.month)||"";
    // If we don't have a snapshot for last month yet, create one with current data
    if(PREV_MONTH_KEY>lastSnapMonth){
      const prevDate=new Date(TODAY.getFullYear(),TODAY.getMonth()-1,1);
      setMonthly(p=>[...p,{month:PREV_MONTH_KEY,label:getMonthLabel(prevDate),occ:m.occRate,collRate:m.collRate,vacancy:m.lost,leads:0,collected:m.coll,projected:m.proj,full:m.full,totalRooms:m.total,occRooms:m.occ,snappedOn:TODAY.toISOString().split("T")[0]}].slice(-12));
    }
    // If today is the last day of the month and we haven't snapped this month
    if(isLastDayOfMonth(TODAY)&&CUR_MONTH_KEY>lastSnapMonth&&CUR_MONTH_KEY>PREV_MONTH_KEY){
      setMonthly(p=>[...p,{month:CUR_MONTH_KEY,label:getMonthLabel(TODAY),occ:m.occRate,collRate:m.collRate,vacancy:m.lost,leads:0,collected:m.coll,projected:m.proj,full:m.full,totalRooms:m.total,occRooms:m.occ,snappedOn:TODAY.toISOString().split("T")[0]}].slice(-12));
    }
  },[loaded,m]);

  // Live current month (always real-time)
  const liveMonth={month:CUR_MONTH_KEY,label:getMonthLabel(TODAY),occ:m.occRate,collRate:m.collRate,vacancy:m.lost,leads:0,collected:m.coll,projected:m.proj,full:m.full,totalRooms:m.total,occRooms:m.occ,live:true};
  // Previous month from snapshots
  const prevMonth=monthly.find(s=>s.month===PREV_MONTH_KEY);
  const twoMonthsAgo=monthly.find(s=>{const d=new Date(TODAY.getFullYear(),TODAY.getMonth()-2,1);return s.month===getMonthKey(d);});
  // All months for charts (historical + live)
  const allMonths=[...monthly.filter(s=>s.month<CUR_MONTH_KEY).slice(-11),liveMonth];

  // Current live week data (always real-time from actual data)
  const liveWeek={weekNum:CUR_WEEK,label:getWeekLabel(TODAY),occ:m.occRate,coll:m.collRate,vacancy:m.lost,leads:0};
  // Build display rows: last 2 historical + current live
  const scRows=[...scorecard.filter(s=>s.weekNum<CUR_WEEK).slice(-2),liveWeek];
  // Measurables config
  const scMeasurables=[
    {id:"occ",label:"Occupancy Rate",key:"occ",goal:SC_GOALS.occ,unit:"%",goodFn:(v,g)=>v>=g},
    {id:"coll",label:"Collection Rate",key:"coll",goal:SC_GOALS.coll,unit:"%",goodFn:(v,g)=>v>=g},
    {id:"vacancy",label:"Vacancy Cost",key:"vacancy",goal:SC_GOALS.vacancy,unit:"$",goodFn:(v,g)=>v<=g},
    {id:"leads",label:"New Leads",key:"leads",goal:SC_GOALS.leads,unit:"",goodFn:(v,g)=>v>=g},
  ];

  // ── Charge helpers ──
  const chargeStatus=(c)=>{if(c.waived)return"waived";if(c.amountPaid>=c.amount)return"paid";if(c.amountPaid>0)return"partial";const due=new Date(c.dueDate+"T00:00:00");if(TODAY>due)return"pastdue";return"unpaid";};
  const getChargesForPeriod=(period)=>{const y=TODAY.getFullYear(),mo=TODAY.getMonth();
    if(period==="mtd")return charges.filter(c=>{const d=new Date(c.dueDate+"T00:00:00");return d.getFullYear()===y&&d.getMonth()===mo;});
    if(period==="ytd")return charges.filter(c=>{const d=new Date(c.dueDate+"T00:00:00");return d.getFullYear()===y;});
    if(period==="next"){const nm=mo===11?0:mo+1,ny=mo===11?y+1:y;return charges.filter(c=>{const d=new Date(c.dueDate+"T00:00:00");return d.getFullYear()===ny&&d.getMonth()===nm;});}
    return charges;
  };
  const createCharge=(data)=>{const c={id:uid(),createdDate:TODAY.toISOString().split("T")[0],amountPaid:0,payments:[],waived:false,waivedReason:"",sent:false,sentDate:null,...data};setCharges(p=>[c,...p]);return c;};
  const recordPayment=(chargeId,payData)=>{
    setCharges(p=>p.map(c=>{if(c.id!==chargeId)return c;const newPaid=c.amountPaid+payData.amount;return{...c,amountPaid:Math.min(newPaid,c.amount),payments:[...c.payments,{id:uid(),...payData}]};}));
    // Update quick-lookup for backwards compat
    const ch=charges.find(c=>c.id===chargeId);if(ch){setPayments(p=>({...p,[ch.roomId]:{...p[ch.roomId],[MO]:((p[ch.roomId]&&p[ch.roomId][MO])||0)+payData.amount}}));}
    setTxns(p=>[{id:uid(),date:payData.date,type:"income",desc:`${(ch&&ch.tenantName)||""} - ${(ch&&ch.category)} (${payData.method})`,amount:payData.amount,propId:(props.find(pr=>allRooms(pr).some(r=>r.id===(ch&&ch.roomId)))||{}).id,cat:(ch&&ch.category)||"Rent"},...p]);
  };
  const waiveCharge=(chargeId,reason)=>setCharges(p=>p.map(c=>c.id===chargeId?{...c,waived:true,waivedReason:reason}:c));
  // Auto-generate rent charges:
  // - Backfills current month + 2 months back for any missed charges
  // - On the 20th or later, generates NEXT month's charges (gives tenants ~10 days notice)
  // - Marks charges as "sent" so tenants see them in portal
  const autoGenRentCharges=useCallback(()=>{
    let n=0;const newChargeNames=[];
    const genForMonth=(targetDate)=>{
      const mk=`${targetDate.getFullYear()}-${(targetDate.getMonth()+1).toString().padStart(2,"0")}`;
      const moLabel=targetDate.toLocaleString("default",{month:"long",year:"numeric"});
      const existing=new Set(charges.filter(c=>c.category==="Rent"&&c.dueDate&&c.dueDate.startsWith(mk)).map(c=>c.roomId));
      props.forEach(pr=>allRooms(pr).forEach(r=>{
        if(r.st==="occupied"&&r.tenant&&!existing.has(r.id)){
          const moveIn=r.tenant.moveIn?new Date(r.tenant.moveIn+"T00:00:00"):null;
          if(!moveIn||moveIn<=new Date(targetDate.getFullYear(),targetDate.getMonth()+1,0)){
            createCharge({roomId:r.id,tenantName:r.tenant.name,propName:pr.name,roomName:r.name,category:"Rent",desc:`${moLabel} Rent`,amount:r.rent,dueDate:`${mk}-01`,sent:true,sentDate:TODAY.toISOString().split("T")[0]});
            n++;newChargeNames.push(`${r.tenant.name} - ${moLabel}`);
          }
        }
      }));
    };
    // Backfill: current month + 2 months back
    for(let i=2;i>=0;i--){const d=new Date(TODAY.getFullYear(),TODAY.getMonth()-i,1);genForMonth(d);}
    // If today is the 20th or later, also generate next month
    if(TODAY.getDate()>=20){const next=new Date(TODAY.getFullYear(),TODAY.getMonth()+1,1);genForMonth(next);}
    // Auto-notify for new charges
    if(n>0){setNotifs(prev=>[{id:uid(),type:"payment",msg:`Auto-generated ${n} rent charge${n>1?"s":""}: ${newChargeNames.slice(0,3).join(", ")}${newChargeNames.length>3?` +${newChargeNames.length-3} more`:""}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...prev]);}
    return n;
  },[props,charges]);
  // Auto-run on load
  // Auto-run on load as fallback only (cron job handles this server-side daily)
  useEffect(()=>{if(loaded&&props.length>0){const t=setTimeout(()=>autoGenRentCharges(),500);return()=>clearTimeout(t);}},[loaded]);

  // Real-time poll — check Supabase for new "applied" apps every 15 seconds
  const knownAppliedIds=useRef(new Set());
  useEffect(()=>{
    if(!loaded)return;
    // Seed only the IDs that are already "applied" on load — so we don't re-fire for them
    apps.filter(a=>a.status==="applied").forEach(a=>knownAppliedIds.current.add(a.id));
  },[loaded]);

  useEffect(()=>{
    if(!loaded)return;
    const poll=async()=>{
      try{
        const res=await supa("app_data?key=eq.hq-apps&select=value",{headers:{Accept:"application/json"}});
        if(!res.ok)return;
        const rows=await res.json();
        if(!rows||!rows[0])return;
        let fresh=rows[0].value;
        if(typeof fresh==="string")fresh=JSON.parse(fresh);
        if(!Array.isArray(fresh))return;
        // Find new apps of any status that weren't known before
        const knownIds=knownAppliedIds.current;
        const newApplied=fresh.filter(a=>a.status==="applied"&&!knownIds.has(a.id));
        const newPrescreened=fresh.filter(a=>a.status==="pre-screened"&&!knownIds.has(a.id));
        const hasNew=newApplied.length>0||newPrescreened.length>0;
        if(hasNew){
          setApps(fresh);
          fresh.forEach(a=>knownIds.add(a.id));
          // Notification for full applications
          if(newApplied.length>0){
            const newest=newApplied[0];
            setNotifs(p=>[{id:uid(),type:"app",msg:`🎉 ${newest.name} submitted their application${newest.property?" for "+newest.property:""}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:true},...p]);
            setShowConfetti(true);setLeadToast(newest);setToastDismissing(false);
            setTimeout(()=>setShowConfetti(false),8000);
            setTimeout(()=>{setToastDismissing(true);setTimeout(()=>setLeadToast(null),300);},15000);
          }
          // Notification for pre-screens
          if(newPrescreened.length>0){
            const newest=newPrescreened[0];
            setNotifs(p=>[{id:uid(),type:"app",msg:`📋 New pre-screen from ${newest.name}${newest.property?" · "+newest.property:""}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:true},...p]);
          }
        } else {
          // Silently sync known IDs
          fresh.forEach(a=>knownIds.add(a.id));
        }
      }catch(e){console.error("Poll error:",e);}
    };
    const interval=setInterval(poll,15000);
    return()=>clearInterval(interval);
  },[loaded]);

  const dismissToast=()=>{setToastDismissing(true);setTimeout(()=>setLeadToast(null),300);};
  const viewNewLead=()=>{setTab("applications");setLeadToast(null);setShowConfetti(false);};

  const openRecordPay=()=>setModal({type:"recordPay",step:1,selRoom:"",selCharge:"",payAmount:0,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});
  const openCreateCharge=()=>setModal({type:"createCharge",roomId:"",category:"Rent",desc:"",amount:0,dueDate:TODAY.toISOString().split("T")[0],notes:""});
  // Backwards compat: openPayForm still works from existing buttons
  const openPayForm=(rid)=>{const unpaidCh=charges.filter(c=>c.roomId===rid&&chargeStatus(c)!=="paid"&&chargeStatus(c)!=="waived");
    if(unpaidCh.length)setModal({type:"recordPay",step:2,selRoom:rid,selCharge:unpaidCh[0].id,payAmount:unpaidCh[0].amount-unpaidCh[0].amountPaid,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});
    else{const r=props.flatMap(p=>allRooms(p)).find(x=>x.id===rid);setModal({type:"createCharge",roomId:rid,category:"Rent",desc:`${MO} Rent`,amount:(r&&r.rent)||0,dueDate:TODAY.toISOString().split("T")[0],notes:"No existing charge — creating new"});}};

  const cycleRock=id=>setRocks(p=>p.map(r=>{if(r.id!==id)return r;const o=["on-track","off-track","not-started","done"];return{...r,status:o[(o.indexOf(r.status)+1)%o.length]};}));
  const saveProp=async(p)=>{
    // Always geocode from address on save — ensures pins are always accurate
    let finalProp=p;
    if(p.addr){
      const stripDir=s=>s.replace(/\b(NW|NE|SW|SE)\b/gi,"").replace(/\b[NSEW]\s+(?=[A-Za-z])/g,"").replace(/\s{2,}/g," ").trim();
      const clean=stripDir(p.addr);
      const noQuad=p.addr.replace(/\b(NW|NE|SW|SE)\b/gi,"").trim();
      const attempts=[
        p.addr+", Huntsville, Alabama, USA",
        p.addr+", Huntsville, AL, USA",
        noQuad+", Huntsville, AL, USA",
        clean+", Huntsville, AL, USA",
        p.addr+", Madison County, Alabama, USA",
        p.addr+", Alabama, USA",
      ];
      for(const attempt of attempts){
        try{
          const res=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(attempt)}&format=json&limit=3&countrycodes=us`,{headers:{"User-Agent":"BlackBearRentals/1.0 harrison@oakandmaindevelopment.com"}});
          const data=await res.json();
          console.log("Geocode attempt:",attempt,"→",data?.length,"results",data?.[0]);
          if(data&&data.length>0){
            const lat=parseFloat(parseFloat(data[0].lat).toFixed(5));
            const lng=parseFloat(parseFloat(data[0].lon).toFixed(5));
            // Sanity check: must be in Huntsville AL area (Madison County)
            if(lat>34.5&&lat<35.0&&lng>-87.0&&lng<-86.3){
              finalProp={...p,lat,lng};
              console.log("✓ Geocoded",p.name,"→",lat,lng);
              break;
            } else {
              console.warn("Geocode result outside Huntsville area, skipping:",lat,lng);
            }
          }
        }catch(e){console.error("Geocode error:",e);}
        await new Promise(r=>setTimeout(r,500));
      }
      if(!finalProp.lat||!finalProp.lng)console.warn("⚠ Geocoding failed for",p.name,"— please enter coords manually");
    }
    if(isNewProp)setProps(prev=>[...prev,finalProp]);else setProps(prev=>prev.map(x=>x.id===p.id?finalProp:x));
    setEditProp(null);
  };

  const pastDueCount=charges.filter(c=>chargeStatus(c)==="pastdue").length;
  const pendingLeases=leases.filter(l=>l.status==="pending_tenant"||l.status==="pending_landlord").length;
  const tabs=[
    {id:"dashboard",i:<IconDashboard/>,l:"Dashboard"},
    {id:"scorecard",i:<IconTrending/>,l:"Scorecard"},
    {id:"rocks",i:<IconTarget/>,l:"Rocks"},
    {id:"issues",i:<IconAlert/>,l:"Issues"},
    {id:"tenants",i:<IconUsers/>,l:"Tenants"},
    {id:"portal",i:<IconHome/>,l:"Tenant Portal"},
    {id:"payments",i:<IconDollar/>,l:"Payments",badge:pastDueCount||m.unpaid.length||null},
    {id:"applications",i:<IconClipboard/>,l:"Applications",badge:m.activeApps||null},
    {id:"maintenance",i:<IconWrench/>,l:"Maintenance",badge:m.openMaint||null},
    {id:"leases",i:<IconFile/>,l:"Leases & Docs",badge:pendingLeases||null},
    {id:"documents",i:<IconFolder/>,l:"Documents"},
    {id:"accounting",i:<IconBook/>,l:"Accounting"},
    {id:"properties",i:<IconHome/>,l:"Properties"},
    {id:"site-settings",i:<IconGlobe/>,l:"Site Settings"},
    {id:"theme",i:<IconPalette/>,l:"Theme Editor"},
    {id:"ideas",i:<IconBrain/>,l:"Brain Dump"},
    {id:"notifications",i:<IconBell/>,l:"Alerts",badge:m.unreadNotifs||null},
    {id:"settings_dummy",i:<IconSettings/>,l:"Settings"},
  ];

  const goTab=(t)=>{setTab(t);setDrill(null);setSideOpen(false);};
  const confirmAction=(title,onConfirm,body="This cannot be undone.")=>{setModal({type:"confirmAction",title,body,confirmLabel:"Confirm",confirmStyle:"btn-red",onConfirm:()=>{onConfirm();setModal(null);}});};
  const shakeModal=()=>{const mb=document.querySelector(".mbox");if(mb){mb.style.animation="none";mb.offsetHeight;mb.style.animation="shake .4s ease, redFlash .5s ease";}};

  if(!loaded)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"inherit"}}>Loading...</div>);

  // All tenants flat list
  const allTenants=props.flatMap(p=>(p.units||[]).flatMap(u=>{
    const isWhole=(u.rentalMode||"byRoom")==="wholeHouse";
    if(isWhole){
      // Whole unit — show one entry using the first occupied room's tenant data
      const occupiedRoom=(u.rooms||[]).find(r=>r.tenant);
      if(!occupiedRoom)return[];
      return[{...occupiedRoom,name:u.name||(p.name+" Unit"),propName:p.name,propId:p.id,unitId:u.id,unitName:u.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,isWholeUnit:true}];
    }
    // By-room — one entry per occupied room
    return(u.rooms||[]).filter(r=>r.tenant).map(r=>({...r,propName:p.name,propId:p.id,unitId:u.id,unitName:u.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,isWholeUnit:false}));
  }));
  // Same logic for financial operations — one row per lease, not per room
  const occLeases=props.flatMap(pr=>(pr.units||[]).flatMap(u=>{
    const isWhole=(u.rentalMode||"byRoom")==="wholeHouse";
    if(isWhole){
      const rep=(u.rooms||[]).find(r=>r.st==="occupied"&&r.tenant);
      if(!rep)return[];
      return[{...rep,name:u.name||(pr.name+" Unit"),propName:pr.name,propId:pr.id,unitId:u.id,isWholeUnit:true}];
    }
    return(u.rooms||[]).filter(r=>r.st==="occupied"&&r.tenant).map(r=>({...r,propName:pr.name,propId:pr.id,unitId:u.id,isWholeUnit:false}));
  }));

  return(<><style>{S}</style><div className="app">
    {/* Mobile header */}
    <div className="mob-header"><div style={{display:"flex",alignItems:"center",gap:8}}><div className="s-logo" style={{fontSize:16}}>🐻 BB <span>HQ</span></div><span style={{fontSize:11,color:"#c4a882"}}>· {(tabs.find(t=>t.id===tab)||{}).l}</span></div><button className="mob-toggle" onClick={()=>setSideOpen(!sideOpen)}>{sideOpen?"✕":"☰"}</button></div>
    <div className={`mob-overlay ${sideOpen?"show":""}`} onClick={()=>setSideOpen(false)}/>

    {/* Sidebar */}
    <div className={`side ${sideOpen?"open":""}`}>
      <div className="s-logo">🐻 Black Bear <span>HQ</span></div>
      <div className="s-lbl">Overview</div>
      {tabs.slice(0,1).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Traction</div>
      {tabs.slice(1,4).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Tenants</div>
      {tabs.slice(4,7).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Leasing</div>
      {tabs.slice(7,8).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Operations</div>
      {tabs.slice(8,11).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">Website</div>
      {tabs.slice(11,15).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-lbl">System</div>
      {tabs.slice(15).map(t=><button key={t.id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}><span className="sn-i">{t.i}</span>{t.l}{t.badge&&<span className="sn-badge">{t.badge}</span>}</button>)}
      <div className="s-ft">
        <a href="#">🌐 View Public Site</a>
      </div>
    </div>

    {/* Main */}
    <div className="mn">
      <div className="tbar"><div><h1><span style={{color:"#d4a853",display:"flex",alignItems:"center"}}>{(tabs.find(t=>t.id===tab)||{}).i}</span> {(tabs.find(t=>t.id===tab)||{}).l}</h1><div className="tbar-sub">{MO}</div></div></div>
      <div className="cnt">

      {/* ═══ DASHBOARD ═══ */}
      {tab==="dashboard"&&<>
        <div className="kgrid">
          <div className={`kpi ${drill==="occ"?"active":""}`} onClick={()=>setDrill(drill==="occ"?null:"occ")}><div className="kl">🏠 Occupancy</div><div className="kv" style={{color:m.occRate>=90?"#4a7c59":"#c45c4a"}}>{m.occRate}%</div><div className="ks">{m.occ}/{m.total} rooms</div></div>
          <div className={`kpi ${drill==="coll"?"active":""}`} onClick={()=>setDrill(drill==="coll"?null:"coll")}><div className="kl">💰 Collected</div><div className="kv">{fmtS(m.coll)}</div><div className={`ks ${m.collRate>=100?"kg":"kb"}`}>{m.collRate}% of {fmtS(m.due)}</div></div>
          <div className="kpi" onClick={()=>goTab("maintenance")}><div className="kl">🔧 Open Requests</div><div className="kv" style={{color:m.openMaint?"#d4a853":"#4a7c59"}}>{m.openMaint}</div><div className="ks">maintenance items</div></div>
          <div className="kpi" onClick={()=>goTab("applications")}><div className="kl">📋 Applications</div><div className="kv">{m.activeApps}</div><div className="ks">in pipeline</div></div>
          <div className="kpi"><div className="kl">📈 Projected</div><div className="kv">{fmtS(m.proj)}</div><div className="ks">of {fmtS(m.full)} at 100%</div></div>
          <div className="kpi"><div className="kl">💸 Vacancy Loss</div><div className="kv kb">{fmtS(m.lost)}</div><div className="ks">{m.vacs.length} empty room{m.vacs.length!==1?"s":""}</div></div>
        </div>

        {/* Drill panels */}
        {drill==="occ"&&<div className="card" style={{marginBottom:16,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Occupancy: {m.occ}/{m.total} rooms</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.vacs.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.name}</div><div className="row-s">{r.propName} · {r.pb?"Private":"Shared"} bath</div></div><div className="row-v kb">{fmtS(r.rent)}<div style={{fontSize:9,color:"#999"}}>lost/mo</div></div></div>)}
          {m.vacs.length===0&&<div style={{textAlign:"center",padding:20,color:"#4a7c59",fontWeight:700}}>🎉 Fully occupied!</div>}
        </div></div>}
        {drill==="coll"&&<div className="card" style={{marginBottom:16,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Collection: {fmtS(m.coll)} / {fmtS(m.due)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.unpaid.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#c45c4a",marginBottom:8}}>UNPAID ({m.unpaid.length})</div>
            {m.unpaid.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{r.propName} · {r.name}</div></div><div className="row-v kb">{fmtS(r.rent)}</div><button className="btn btn-green btn-sm" onClick={()=>openPayForm(r.id)}>Mark Paid</button></div>)}</>}
          {m.paid.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#4a7c59",marginTop:12,marginBottom:8}}>PAID ({m.paid.length})</div>
            {m.paid.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#4a7c59"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{r.propName}</div></div><div className="row-v kg">{fmtS(r.paidAmt)}</div></div>)}</>}
        </div></div>}

        {/* Expiring leases */}
        {m.expiring.length>0&&<div className="sec-hd"><div><h2>⚠️ Leases Expiring</h2></div></div>}
        {m.expiring.sort((a,b)=>a.daysLeft-b.daysLeft).map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setTab("tenants");setDrill(r.id);}}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{r.propName} · {r.name} · Ends {fmtD(r.le)}</div></div><span className="badge" style={{background:r.daysLeft<=30?"rgba(196,92,74,.08)":"rgba(212,168,83,.1)",color:r.daysLeft<=30?"#c45c4a":"#9a7422"}}>{r.daysLeft}d</span></div>)}

        {/* Recent activity */}
        <div className="sec-hd" style={{marginTop:16}}><div><h2>Recent Activity</h2></div></div>
        {notifs.slice(0,5).map(n=><div key={n.id} className="row" style={{opacity:n.read?0.7:1}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}><span style={{fontSize:14}}>{n.type==="lease"?"📋":n.type==="payment"?"💰":n.type==="maint"?"🔧":"📝"}</span><div className="row-i"><div className="row-t" style={{fontWeight:n.read?500:700}}>{n.msg}</div><div className="row-s">{n.date}</div></div>{!n.read&&<div className="notif-dot"/>}{n.urgent&&<span className="badge b-red">Urgent</span>}</div>)}
      </>}

      {/* ═══ TENANTS ═══ */}
      {tab==="tenants"&&<>
        <div className="sec-hd"><div><h2>Tenants</h2><p>{allTenants.length} current · {archive.length} past</p></div>
          <div style={{display:"flex",gap:4}}>
            <button className="btn btn-green btn-sm" onClick={()=>setModal({type:"addExistingTenant",propId:"",unitId:"",roomId:"",form:{name:"",email:"",phone:"",moveIn:TODAY.toISOString().split("T")[0],leaseEnd:"",rent:"",sd:"",doorCode:"",notes:"",gender:"",occupationType:""}})}>+ Add Existing Tenant</button>
            <button className={`btn ${!drill||drill!=="archive"?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setDrill(null)}>Current ({allTenants.length})</button>
            <button className={`btn ${drill==="archive"?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setDrill("archive")}>Past Tenants ({archive.length})</button>
          </div>
        </div>

        {/* Current tenants */}
        {drill!=="archive"&&<>{allTenants.map(r=>{
          const pd=(payments[r.id]&&payments[r.id][MO])||0;const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;
          return(
            <div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:r})}>
              <div className="row-dot" style={{background:pd?"#4a7c59":"#c45c4a"}}/>
              <div className="row-i">
                <div className="row-t">{r.tenant.name}</div>
                <div className="row-s">{r.propName} · {r.name} · {r.pb?"Private":"Shared"} bath · {fmtS(r.rent)}/mo</div>
                {dl!==null&&dl<=90&&<div style={{fontSize:9,color:dl<=30?"#c45c4a":"#d4a853",fontWeight:600,marginTop:2}}>⚠ Lease expires in {dl} days</div>}
              </div>
              <div style={{textAlign:"right"}}><div className="row-v">{fmtS(r.rent)}</div><div style={{fontSize:9,color:pd?"#4a7c59":"#c45c4a",fontWeight:600}}>{pd?"✓ Paid":"Unpaid"}</div></div>
            </div>);
        })}{allTenants.length===0&&<div style={{textAlign:"center",padding:32,color:"#999"}}><div style={{fontSize:32,marginBottom:8}}>👥</div>No current tenants</div>}</>}

        {/* Archived / past tenants */}
        {drill==="archive"&&<>
          {archive.length===0?<div style={{textAlign:"center",padding:32,color:"#999"}}><div style={{fontSize:32,marginBottom:8}}>📋</div>No past tenants yet. Terminated leases will appear here.</div>:
          archive.map(a=>(
            <div key={a.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"archived",data:a})}>
              <div className="row-dot" style={{background:"#999"}}/>
              <div className="row-i">
                <div className="row-t">{a.name} <span className="badge b-gray">Past</span></div>
                <div className="row-s">{a.propName} · {a.roomName} · {fmtS(a.rent)}/mo · {fmtD(a.moveIn)} → {fmtD(a.terminatedDate)}</div>
                <div style={{fontSize:9,color:"#999",marginTop:2}}>Terminated: {a.reason}</div>
              </div>
              <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#999"}}>{fmtD(a.terminatedDate)}</div></div>
            </div>
          ))}</>}
      </>}

      {/* ═══ TENANT PORTAL (Admin Preview) ═══ */}
      {tab==="portal"&&(()=>{
        const tRoom=portalTenant||(allTenants[0]||null);
        const tProp=tRoom?props.find(p=>allRooms(p).some(r=>r.id===tRoom.id)):null;
        const tUnit=tProp?(tProp.units||[]).find(u=>(u.rooms||[]).some(r=>r.id===tRoom.id)):null;
        const tCharges=tRoom?charges.filter(c=>c.roomId===tRoom.id):[];
        const tMaint=tRoom?maint.filter(m=>m.roomId===tRoom.id):[];
        const submitMaint=()=>{
          if(!maintForm.title.trim()){setMaintForm(p=>({...p,titleErr:true}));shakeModal();return;}
          setMaint(p=>[...p,{id:uid(),roomId:tRoom.id,propId:tProp&&tProp.id,tenant:tRoom.tenant.name,title:maintForm.title,desc:maintForm.desc,status:"open",priority:maintForm.priority,created:TODAY.toISOString().split("T")[0],photos:0}]);
          setMaintForm({title:"",desc:"",priority:"medium",submitted:true,titleErr:false});
        };
        const tUtils=tUnit?.utils||tProp?.utils||"allIncluded";
        const tClean=tUnit?.clean||tProp?.clean||"Biweekly";
        const utilDesc=tUtils==="allIncluded"?"All utilities included (electric, water, gas, WiFi)":"Tenant pays utilities — split equally among roommates. WiFi always included.";
        const cleanDesc=tClean==="Weekly"?"Common areas cleaned weekly":"Common areas cleaned biweekly";
        const houseRules=[{icon:"🚭",rule:"No smoking or vaping anywhere on the property, including outdoors"},
          {icon:"🐾",rule:"No pets allowed"},
          {icon:"👟",rule:"No shoes inside — please remove at the door"},
          {icon:"🔇",rule:"Quiet hours: 10pm–7am weekdays, 11pm–10am weekends"},
          {icon:"🧹",rule:"Clean up after yourself in shared common areas"},
          {icon:"🔑",rule:"Do not duplicate keys or grant property access to unauthorized guests"},
          {icon:"🚗",rule:"Parking in designated spots only"},
          {icon:"🔥",rule:"No open flames, candles, or grills inside"},
        ];
        return(<>
          <div style={{background:"rgba(212,168,83,.08)",border:"1px solid rgba(212,168,83,.2)",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:12,color:"#9a7422",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>👁️</span>
            <span><strong>Admin Preview Mode</strong> — This is what your tenants will see when the portal is live. Select a tenant to preview their view.</span>
          </div>

          {/* Tenant selector */}
          <div className="card" style={{marginBottom:14}}><div className="card-bd" style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#999",whiteSpace:"nowrap"}}>Previewing as:</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",flex:1}}>
              {allTenants.map(t=>(
                <button key={t.id} className={`btn btn-sm ${portalTenant&&portalTenant.id===t.id?"btn-dk":"btn-out"}`} onClick={()=>{setPortalTenant(t);setPortalTab("home");}}>
                  {t.tenant.name} <span style={{opacity:.6,fontSize:9}}>· {t.propName}</span>
                </button>
              ))}
              {allTenants.length===0&&<span style={{fontSize:12,color:"#999"}}>No active tenants.</span>}
            </div>
          </div></div>

          {!tRoom&&<div style={{textAlign:"center",padding:40,color:"#999"}}><div style={{fontSize:40,marginBottom:8}}>🏡</div><p>Select a tenant above to preview their portal.</p></div>}

          {tRoom&&<div style={{background:"#f9f8f5",borderRadius:14,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
            {/* Portal Header */}
            <div style={{background:"#1a1714",padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:"#f5f0e8"}}>🐻 Black Bear Rentals</div>
                <div style={{fontSize:10,color:"#c4a882",marginTop:2}}>Welcome back, {tRoom.tenant.name.split(" ")[0]}!</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#d4a853"}}>{tRoom.propName}</div>
                <div style={{fontSize:9,color:"#c4a882"}}>{tRoom.name}</div>
              </div>
            </div>

            {/* Portal Nav */}
            <div style={{display:"flex",background:"#fff",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
              {[["home","🏠","Home"],["payments","💳","Payments"],["maintenance","🔧","Maintenance"],["docs","📄","Documents"],["rules","📋","Rules"]].map(([id,icon,label])=>(
                <button key={id} onClick={()=>setPortalTab(id)} style={{flex:1,padding:"11px 4px",border:"none",background:portalTab===id?"#faf9f7":"#fff",borderBottom:portalTab===id?"2px solid #d4a853":"2px solid transparent",cursor:"pointer",fontSize:10,fontWeight:portalTab===id?800:500,color:portalTab===id?"#1a1714":"#999",fontFamily:"inherit",transition:"all .15s"}}>
                  <div style={{fontSize:16,marginBottom:2}}>{icon}</div>{label}
                </button>
              ))}
            </div>

            {/* ── HOME ── */}
            {portalTab==="home"&&<div style={{padding:18}}>
              <div className="tp-card">
                <h3>📄 Your Lease</h3>
                {[
                  ["Room",`${tUnit&&tUnit.label?"Unit "+tUnit.label+" — ":""}${tRoom.name} · ${tRoom.pb?"Private bathroom":"Shared bathroom"}`],
                  ["Property",`${tRoom.propName}${tUnit&&tUnit.label?" · Unit "+tUnit.label:""} — ${tProp&&tProp.addr}`],
                  ["Monthly Rent",`$${tRoom.rent.toLocaleString()}/mo`],
                  ["Move-In Date",fmtD(tRoom.tenant.moveIn)],
                  ["Lease Ends",tRoom.le?fmtD(tRoom.le):"Month-to-Month"],
                  ["Utilities",utilDesc],
                  ["Cleaning",cleanDesc],
                  ["WiFi","Google Fiber — always included"],
                ].map(([l,v])=><div key={l} className="tp-row"><span className="tp-label">{l}</span><span style={{fontWeight:600,fontSize:12,textAlign:"right",maxWidth:"60%"}}>{v}</span></div>)}
              </div>

              {/* Door Access Code — shown once rent portion is paid */}
              {(()=>{
                // Find this tenant's app record by matching room
                const tenantApp=apps.find(ap=>ap.lockActivation&&(ap.name===tRoom.tenant.name||ap.passcode));
                const liveApp=tenantApp||(tRoom.tenant.passcode?{passcode:tRoom.tenant.passcode,lockActivation:{activatesAt:`${tRoom.tenant.moveIn}T00:00:00`,status:"active"}}:null);
                // Check if rent portion (non-SD) charges are paid
                const rentChargesPaid=tCharges.filter(c=>c.category==="Rent").every(c=>chargeStatus(c)==="paid"||chargeStatus(c)==="waived");
                const passcode=liveApp?.passcode||tRoom.tenant.passcode;
                if(!passcode)return null;
                const moveInPassed=new Date(tRoom.tenant.moveIn+"T00:00:00")<=TODAY;
                const lockActive=rentChargesPaid&&moveInPassed;
                return(
                <div className="tp-card" style={{marginTop:10,border:`2px solid ${lockActive?"rgba(74,124,89,.3)":"rgba(212,168,83,.2)"}`,background:lockActive?"rgba(74,124,89,.04)":"rgba(212,168,83,.02)"}}>
                  <h3 style={{color:lockActive?"#4a7c59":"#9a7422"}}>{lockActive?"🔓 Door Access Active":"🔒 Door Access Pending"}</h3>
                  {lockActive
                    ?<>
                      <div style={{textAlign:"center",padding:"14px 0"}}>
                        <div style={{fontSize:11,color:"#999",marginBottom:6}}>Your 4-digit door code</div>
                        <div style={{fontSize:40,fontWeight:900,letterSpacing:12,color:"#4a7c59",fontFamily:"monospace"}}>{passcode}</div>
                        <div style={{fontSize:10,color:"#4a7c59",marginTop:6}}>Works on all exterior doors and your bedroom lock</div>
                      </div>
                      <div style={{fontSize:10,color:"#999",textAlign:"center"}}>Active since 12:00am on {fmtD(tRoom.tenant.moveIn)}</div>
                    </>
                    :<>
                      <div style={{fontSize:12,color:"#5c4a3a",marginBottom:8}}>Your passcode is ready but will not activate until:</div>
                      {!rentChargesPaid&&<div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#c45c4a",marginBottom:4}}>⬜ Rent portion received</div>}
                      {!moveInPassed&&<div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#d4a853",marginBottom:4}}>⬜ Move-in date reached ({fmtD(tRoom.tenant.moveIn)} at 12:00am)</div>}
                      <div style={{fontSize:10,color:"#999",marginTop:8}}>Once both conditions are met, your code will appear here automatically.</div>
                    </>}
                </div>);
              })()}
              <div className="tp-card" style={{marginTop:10}}>
                <h3>💳 Payment Summary</h3>
                {(()=>{
                  const recentPaid=tCharges.filter(c=>chargeStatus(c)==="paid").slice(-3);
                  const totalDue=upcoming.reduce((s,c)=>s+c.amount,0);
                  return(<>
                    <div style={{background:totalDue>0?"rgba(196,92,74,.04)":"rgba(74,124,89,.04)",borderRadius:8,padding:12,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div><div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5}}>Amount Due</div><div style={{fontSize:22,fontWeight:800,color:totalDue>0?"#c45c4a":"#4a7c59"}}>{totalDue>0?`$${totalDue.toLocaleString()}`:"All clear ✓"}</div></div>
                      {upcoming.length>0&&<button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"stripePayPortal",charges:upcoming,tRoom})}>Pay Now →</button>}
                    </div>
                    {upcoming.length>0&&upcoming.map(c=><div key={c.id} className="tp-row"><span style={{fontSize:11}}>{c.category} — {c.desc}<div style={{fontSize:9,color:"#999"}}>Due {fmtD(c.dueDate)}</div></span><span style={{fontWeight:800,color:chargeStatus(c)==="pastdue"?"#c45c4a":"#5c4a3a"}}>${c.amount.toLocaleString()}</span></div>)}
                    {recentPaid.length>0&&<><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginTop:8,marginBottom:4}}>Recent Payments</div>
                      {recentPaid.map(c=><div key={c.id} className="tp-row"><span style={{fontSize:11,color:"#4a7c59"}}>✓ {c.category}<div style={{fontSize:9,color:"#999"}}>{fmtD(c.dueDate)}</div></span><span style={{fontWeight:700,color:"#4a7c59"}}>${c.amount.toLocaleString()}</span></div>)}</>}
                    {tCharges.length===0&&<div style={{fontSize:12,color:"#999",textAlign:"center",padding:8}}>No charges on file yet. Rent invoices appear here on the 20th of each month.</div>}
                  </>);
                })()}
              </div>

              <div className="tp-card" style={{marginTop:10}}>
                <h3>🔧 Open Maintenance Requests</h3>
                {tMaint.filter(x=>x.status!=="resolved").length===0
                  ?<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>✓ No open requests</div>
                  :tMaint.filter(x=>x.status!=="resolved").map(r=><div key={r.id} className="tp-row">
                    <span style={{fontSize:11}}>{r.title}<div style={{fontSize:9,color:"#999"}}>Submitted {fmtD(r.created)}</div></span>
                    <span className={`badge ${r.status==="open"?"b-red":r.status==="in-progress"?"b-gold":"b-green"}`}>{r.status}</span>
                  </div>)}
                <button className="btn btn-out btn-sm" style={{marginTop:8,width:"100%"}} onClick={()=>setPortalTab("maintenance")}>Submit New Request →</button>
              </div>
            </div>}

            {/* ── PAYMENTS ── */}
            {portalTab==="payments"&&<div style={{padding:18}}>
              <div className="tp-card">
                <h3>💳 Payment History</h3>
                <div style={{background:"rgba(212,168,83,.08)",borderRadius:8,padding:12,marginBottom:12,fontSize:12,color:"#9a7422"}}>
                  💡 Rent is due on the <strong>1st of each month</strong>. A $50 late fee applies after the 3rd. You'll receive an invoice on the 20th of the prior month.
                </div>
                {tCharges.length===0&&<div style={{textAlign:"center",padding:16,color:"#999",fontSize:12}}>No charge history yet.</div>}
                {tCharges.map(c=>{
                  const st=chargeStatus(c);
                  const lastPay=c.payments&&c.payments[c.payments.length-1];
                  const confId=lastPay&&lastPay.confId?lastPay.confId:`BB-${c.id.slice(0,8).toUpperCase()}`;
                  const printReceipt=()=>{
                    if(!lastPay)return;
                    const w=window.open("","_blank");
                    w.document.write(`<!DOCTYPE html><html><head><title>Receipt ${confId}</title><style>
                      body{font-family:Georgia,serif;max-width:560px;margin:40px auto;padding:0 24px;color:#1a1714;line-height:1.6}
                      h1{font-size:20px;font-weight:700;border-bottom:2px solid #1a1714;padding-bottom:8px;margin-bottom:20px}
                      .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}
                      .label{color:#666}.value{font-weight:600}
                      .total{display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:800;border-top:2px solid #1a1714;margin-top:4px}
                      .conf{font-family:monospace;font-size:18px;font-weight:900;color:#1a1714;letter-spacing:2px;text-align:center;padding:12px;background:#f5f0e8;border-radius:6px;margin:16px 0}
                      .footer{margin-top:32px;font-size:11px;color:#999;text-align:center}
                    </style></head><body>
                      <h1>Payment Receipt</h1>
                      <div class="conf">${confId}</div>
                      <div class="row"><span class="label">Date</span><span class="value">${lastPay.date}</span></div>
                      <div class="row"><span class="label">Tenant</span><span class="value">${c.tenantName}</span></div>
                      <div class="row"><span class="label">Property</span><span class="value">${c.propName} · ${c.roomName}</span></div>
                      <div class="row"><span class="label">Charge</span><span class="value">${c.category} — ${c.desc}</span></div>
                      <div class="row"><span class="label">Payment Method</span><span class="value">${lastPay.method}</span></div>
                      <div class="total"><span>Amount Paid</span><span>$${Number(c.amountPaid).toLocaleString()}</span></div>
                      <div class="footer">Oak &amp; Main Development LLC · Black Bear Rentals · blackbearhousing@gmail.com</div>
                    </body></html>`);
                    w.document.close();w.print();
                  };
                  return(
                  <div key={c.id} style={{padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:600}}>{c.category} — {c.desc}</div>
                        <div style={{fontSize:9,color:"#999",marginTop:1}}>Due {fmtD(c.dueDate)}</div>
                        {lastPay&&<div style={{fontSize:9,color:"#4a7c59",marginTop:1}}>✓ {fmtS(lastPay.amount)} via {lastPay.method} on {fmtD(lastPay.date)}</div>}
                      </div>
                      <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                        <div style={{fontSize:14,fontWeight:800}}>${c.amount.toLocaleString()}</div>
                        <span className={`badge ${st==="paid"?"b-green":st==="pastdue"?"b-red":st==="partial"?"b-gold":"b-gray"}`}>{st}</span>
                        {(st==="paid"||st==="partial")&&lastPay&&
                          <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={printReceipt}>📄 Receipt PDF</button>}
                      </div>
                    </div>
                    {st==="partial"&&<div style={{fontSize:10,color:"#d4a853",marginTop:4}}>
                      {fmtS(c.amountPaid)} paid · {fmtS(c.amount-c.amountPaid)} remaining
                    </div>}
                  </div>);
                })}
                <div style={{marginTop:14,background:"rgba(74,124,89,.06)",borderRadius:8,padding:12,fontSize:11,color:"#5c4a3a"}}>
                  <strong>Payment Methods Accepted:</strong> Zelle, Venmo, CashApp, Check, or ACH (coming soon via Stripe).<br/>
                  Send to: <strong>blackbearhousing@gmail.com</strong>
                </div>
              </div>
            </div>}

            {/* ── MAINTENANCE ── */}
            {portalTab==="maintenance"&&<div style={{padding:18}}>
              <div className="tp-card" style={{marginBottom:10}}>
                <h3>🔧 Submit a Maintenance Request</h3>
                {maintForm.submitted
                  ?<div style={{background:"rgba(74,124,89,.08)",borderRadius:8,padding:14,textAlign:"center"}}>
                    <div style={{fontSize:24,marginBottom:4}}>✅</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#4a7c59"}}>Request Submitted!</div>
                    <div style={{fontSize:11,color:"#999",marginTop:4}}>We typically respond within 24–48 hours.</div>
                    <button className="btn btn-out btn-sm" style={{marginTop:10}} onClick={()=>setMaintForm({title:"",desc:"",priority:"medium",submitted:false})}>Submit Another</button>
                  </div>
                  :<div>
                    <div className={`fld ${maintForm.titleErr?"field-err":""}`}>
                      <label className={maintForm.titleErr?"field-err-label":""}>Issue Title *</label>
                      <input placeholder="e.g. Faucet dripping, Heater not working..." value={maintForm.title} onChange={e=>setMaintForm(p=>({...p,title:e.target.value,titleErr:false}))}/>
                      {maintForm.titleErr&&<div className="err-msg">Title is required</div>}
                    </div>
                    <div className="fld"><label>Description</label><textarea placeholder="Please describe the issue in detail. When did it start? How bad is it?" value={maintForm.desc} onChange={e=>setMaintForm(p=>({...p,desc:e.target.value}))} rows={3}/></div>
                    <div className="fld"><label>Priority</label>
                      <div style={{display:"flex",gap:6}}>
                        {[["low","🟢 Low — not urgent"],["medium","🟡 Medium — soon"],["high","🔴 High — urgent"]].map(([v,l])=>(
                          <button key={v} className={`btn btn-sm ${maintForm.priority===v?"btn-dk":"btn-out"}`} style={{fontSize:9,flex:1}} onClick={()=>setMaintForm(p=>({...p,priority:v}))}>{l}</button>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-gold" style={{width:"100%",marginTop:4}} onClick={submitMaint}>Submit Request</button>
                    <div style={{fontSize:9,color:"#999",textAlign:"center",marginTop:6}}>You'll receive a confirmation email when we acknowledge your request.</div>
                  </div>}
              </div>

              <div className="tp-card">
                <h3>📋 Your Request History</h3>
                {tMaint.length===0&&<div style={{fontSize:12,color:"#999",textAlign:"center",padding:8}}>No requests on file.</div>}
                {tMaint.map(r=>(
                  <div key={r.id} style={{padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,.04)",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600}}>{r.title}</div>
                      <div style={{fontSize:10,color:"#999"}}>{r.desc}</div>
                      <div style={{fontSize:9,color:"#999",marginTop:2}}>Submitted {fmtD(r.created)}</div>
                    </div>
                    <span className={`badge ${r.status==="resolved"?"b-green":r.status==="in-progress"?"b-gold":"b-red"}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>}

            {/* ── DOCUMENTS ── */}
            {portalTab==="docs"&&<div style={{padding:18}}>
              <div className="tp-card">
                <h3>📄 Your Documents</h3>
                <div style={{fontSize:11,color:"#999",marginBottom:12}}>All documents related to your tenancy — application files, lease agreements, and addendums.</div>
                {(()=>{
                  const tenantDocs=docs.filter(d=>d.tenantRoomId===tRoom.id||d.tenant===tRoom.tenant.name);
                  const appDocs=(tRoom.tenant.documents||[]);
                  const allDocs=[...appDocs,...tenantDocs];
                  if(allDocs.length===0)return<div style={{textAlign:"center",padding:16,color:"#999",fontSize:12}}>No documents on file yet.</div>;
                  return allDocs.map((d,i)=>(
                    <div key={d.id||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:700}}>{d.label||d.name}</div>
                        <div style={{fontSize:10,color:"#999"}}>{d.source==="application"?"Application document":d.type==="lease"?"Executed Lease Agreement":d.type==="addendum"?"Lease Addendum":"Document"} · {d.uploaded}</div>
                      </div>
                      <div style={{display:"flex",gap:4}}>
                        {d.data&&<a href={d.data} download={d.name} className="btn btn-out btn-sm" style={{fontSize:9,textDecoration:"none"}}>⬇ Download</a>}
                        {d.content&&<button className="btn btn-out btn-sm" onClick={()=>setModal({type:"viewAddendum",doc:d})}>📄 View</button>}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>}

            {/* ── HOUSE RULES ── */}
            {portalTab==="rules"&&<div style={{padding:18}}>
              <div className="tp-card" style={{marginBottom:10}}>
                <h3>📋 House Standards</h3>
                <div style={{fontSize:11,color:"#5c4a3a",marginBottom:10}}>By living here, you've agreed to these standards. They exist to keep everyone comfortable and the home in great shape.</div>
                {houseRules.map((r,i)=><div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,.03)",alignItems:"flex-start"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{r.icon}</span>
                  <span style={{fontSize:12,color:"#3c3228",lineHeight:1.5}}>{r.rule}</span>
                </div>)}
              </div>
              <div className="tp-card">
                <h3>📞 Contact & Emergency</h3>
                {[
                  ["Property Manager","Harrison Cooper"],
                  ["Email","blackbearhousing@gmail.com"],
                  ["Emergency Maintenance","(256) 555-0192"],
                  ["After Hours","Text first, call if urgent"],
                  ["Non-Emergency Tip","For non-urgent items, use the Maintenance tab above"],
                ].map(([l,v])=><div key={l} className="tp-row"><span className="tp-label">{l}</span><span style={{fontSize:12,fontWeight:600}}>{v}</span></div>)}
              </div>
            </div>}

          </div>}
        </>);
      })()}

      {/* ═══ PAYMENTS ═══ */}
      {tab==="payments"&&(()=>{
        const pCharges=getChargesForPeriod(payPeriod);
        const pastDue=pCharges.filter(c=>chargeStatus(c)==="pastdue");
        const unpaidCh=pCharges.filter(c=>chargeStatus(c)==="unpaid");
        const paidCh=pCharges.filter(c=>chargeStatus(c)==="paid");
        const partialCh=pCharges.filter(c=>chargeStatus(c)==="partial");
        const waivedCh=pCharges.filter(c=>chargeStatus(c)==="waived");
        const totalCharged=pCharges.reduce((s,c)=>s+c.amount,0);
        const totalPaid=pCharges.reduce((s,c)=>s+c.amountPaid,0);
        const totalDue=totalCharged-totalPaid-waivedCh.reduce((s,c)=>s+c.amount,0);
        const inTransit=pCharges.flatMap(c=>c.payments).filter(p=>p.depositStatus==="transit").reduce((s,p)=>s+p.amount,0);
        const deposited=pCharges.flatMap(c=>c.payments).filter(p=>p.depositStatus==="deposited"||!p.depositStatus).reduce((s,p)=>s+p.amount,0);
        const periodLabel=payPeriod==="mtd"?MO:payPeriod==="ytd"?`${TODAY.getFullYear()} YTD`:"Next Month";

        // Filters for charges tab
        const applyFilters=(list)=>{let f=list;
          if(payFilters.property)f=f.filter(c=>c.propName===payFilters.property);
          if(payFilters.tenant)f=f.filter(c=>c.tenantName===payFilters.tenant);
          if(payFilters.category)f=f.filter(c=>c.category===payFilters.category);
          if(payFilters.status)f=f.filter(c=>chargeStatus(c)===payFilters.status);
          if(payFilters.dateFrom)f=f.filter(c=>c.dueDate>=payFilters.dateFrom);
          if(payFilters.dateTo)f=f.filter(c=>c.dueDate<=payFilters.dateTo);
          return f;
        };
        const filteredCharges=applyFilters(payPeriod==="all"?charges:pCharges);
        const stColor={paid:"#4a7c59",unpaid:"#3b82f6",pastdue:"#c45c4a",partial:"#d4a853",waived:"#999"};
        const stBadge={paid:"b-green",unpaid:"b-blue",pastdue:"b-red",partial:"b-gold",waived:"b-gray"};

        return(<>
        {/* Main sub-tabs — big and prominent */}
        <div style={{display:"flex",gap:0,marginBottom:14,borderRadius:10,overflow:"hidden",border:"1px solid rgba(0,0,0,.06)"}}>
          {[["overview","📊 Overview"],["charges","🧾 Charges"],["deposits","🏦 Deposits"]].map(([k,l])=>(
            <button key={k} className={`pay-tab${paySubTab===k?" active":""}`} style={{fontSize:14}} onClick={()=>{setPaySubTab(k);setExpCharge(null);}}>{l}</button>
          ))}
        </div>

        {/* Period toggle + Actions row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:3}}>
            {[["mtd","MTD"],["ytd","YTD"],["next","Next Mo"],["all","All"]].map(([k,l])=>(
              <button key={k} className={`btn ${payPeriod===k?"btn-dk":"btn-out"} btn-sm`} style={{fontSize:10}} onClick={()=>setPayPeriod(k)}>{l}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button className="btn btn-gold btn-sm" onClick={openCreateCharge}>+ Charge</button>
            <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"addCredit",roomId:"",amount:0,reason:""})}>💳 Credit</button>
            <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"returnSD",roomId:"",deductions:[],returnAmount:0})}>🔒 Return SD</button>
          </div>
        </div>

        {/* ── Overview ── */}
        {paySubTab==="overview"&&<>
          <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"pastdue"});}}><div className="kl">🔴 Past Due</div><div className="kv kb">{fmtS(pastDue.reduce((s,c)=>s+(c.amount-c.amountPaid),0))}</div><div className="ks">{pastDue.length} charge{pastDue.length!==1?"s":""}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"unpaid"});}}><div className="kl">📋 Unpaid</div><div className="kv" style={{color:"#3b82f6"}}>{fmtS(unpaidCh.reduce((s,c)=>s+c.amount,0))}</div><div className="ks">{unpaidCh.length} charge{unpaidCh.length!==1?"s":""}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:""});}}><div className="kl">🧾 All Charges</div><div className="kv">{fmtS(totalCharged)}</div><div className="ks">{pCharges.length} charge{pCharges.length!==1?"s":""}</div></div>
          </div>
          <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"paid"});}}><div className="kl">✅ Paid</div><div className="kv kg">{fmtS(totalPaid)}</div><div className="ks">{paidCh.length} charge{paidCh.length!==1?"s":""}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>setPaySubTab("deposits")}><div className="kl">🏦 In Transit</div><div className="kv kw">{fmtS(inTransit)}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>setPaySubTab("deposits")}><div className="kl">💵 Deposited</div><div className="kv kg">{fmtS(deposited)}</div></div>
          </div>
          <div style={{fontSize:10,color:"#999",textAlign:"center",marginTop:4,marginBottom:14}}>Showing: {periodLabel} · Click any card to drill down</div>

          {/* Quick property breakdown */}
          {m.propBreakdown.map(pr=>{const prCh=pCharges.filter(c=>c.propName===pr.name);const prPaid=prCh.reduce((s,c)=>s+c.amountPaid,0);const prDue=prCh.reduce((s,c)=>s+c.amount,0);return(
            <div key={pr.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,property:pr.name});}}>
              <div className="row-i"><div className="row-t">{pr.name}</div><div className="row-s">{allRooms(pr).length} rooms · {pr.occCount} occupied</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800}}>{fmtS(prPaid)}<small style={{color:"#999"}}> / {fmtS(prDue)}</small></div>
                <div style={{fontSize:9,color:prPaid>=prDue?"#4a7c59":"#c45c4a",fontWeight:600}}>{prDue?Math.round(prPaid/prDue*100):0}%</div></div>
            </div>
          );})}
        </>}

        {/* ── Charges ── */}
        {paySubTab==="charges"&&<>
          {/* Filters */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
            <select value={payFilters.property} onChange={e=>setPayFilters({...payFilters,property:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Properties</option>{props.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>
            <select value={payFilters.tenant} onChange={e=>setPayFilters({...payFilters,tenant:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Tenants</option>{[...new Set(charges.map(c=>c.tenantName))].map(n=><option key={n} value={n}>{n}</option>)}</select>
            <select value={payFilters.category} onChange={e=>setPayFilters({...payFilters,category:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Categories</option>{CHARGE_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select>
            <select value={payFilters.status} onChange={e=>setPayFilters({...payFilters,status:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Status</option><option value="paid">Paid</option><option value="unpaid">Unpaid</option><option value="pastdue">Past Due</option><option value="partial">Partial</option><option value="waived">Waived</option></select>
            <input type="date" value={payFilters.dateFrom} onChange={e=>setPayFilters({...payFilters,dateFrom:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}} placeholder="From"/>
            <input type="date" value={payFilters.dateTo} onChange={e=>setPayFilters({...payFilters,dateTo:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}} placeholder="To"/>
            <button className="btn btn-out btn-sm" onClick={()=>setPayFilters({property:"",tenant:"",category:"",status:"",dateFrom:"",dateTo:""})}>Reset</button>
          </div>
          <div style={{fontSize:10,color:"#999",marginBottom:8}}>{filteredCharges.length} charge{filteredCharges.length!==1?"s":""} · {periodLabel}</div>
          {/* Column headers */}
          <div style={{display:"grid",gridTemplateColumns:"90px 100px 1fr 72px 90px 80px",gap:0,padding:"8px 14px",fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,borderBottom:"2px solid rgba(0,0,0,.06)"}}>
            <div>Due Date</div><div>Category</div><div>Tenant / Room</div><div>Status</div><div>Deposit</div><div style={{textAlign:"right"}}>Amount</div>
          </div>
          {filteredCharges.sort((a,b)=>new Date(b.dueDate)-new Date(a.dueDate)).map(c=>{const st=chargeStatus(c);const lastPay=c.payments.length?c.payments[c.payments.length-1]:null;const isExp=expCharge===c.id;const rem=c.amount-c.amountPaid;const confId=`BB-${c.id.slice(0,8).toUpperCase()}`;return(
            <div key={c.id}>
              <div style={{display:"grid",gridTemplateColumns:"90px 100px 1fr 72px 90px 80px",gap:0,padding:"10px 14px",borderBottom:"1px solid rgba(0,0,0,.03)",cursor:"pointer",background:isExp?"rgba(0,0,0,.02)":"transparent",transition:"background .1s"}} onClick={()=>setExpCharge(isExp?null:c.id)}>
                <div style={{fontSize:11,fontWeight:600}}>{fmtD(c.dueDate)}</div>
                <div><span className="badge b-gray" style={{fontSize:8}}>{c.category}</span></div>
                <div><div style={{fontSize:11,fontWeight:600}}>{c.tenantName}</div><div style={{fontSize:9,color:"#999"}}>{c.propName} · {c.roomName}</div></div>
                <div><span className={`badge ${stBadge[st]}`} style={{fontSize:8}}>{st}</span></div>
                <div>{lastPay&&lastPay.depositDate?<div><div style={{fontSize:10}}>{fmtD(lastPay.depositDate)}</div><div style={{fontSize:8,color:"#999"}}>Redstone FCU</div></div>:lastPay&&lastPay.depositStatus==="transit"?<span style={{fontSize:9,color:"#d4a853"}}>In transit</span>:<span style={{fontSize:9,color:"#999"}}>—</span>}</div>
                <div style={{textAlign:"right",fontWeight:800,fontSize:13,color:st==="paid"?"#4a7c59":st==="pastdue"?"#c45c4a":"inherit",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6}}>
                  <span>{fmtS(c.amount)}</span>
                  <span style={{fontSize:10,color:"#999",fontWeight:400}}>{isExp?"∧":"∨"}</span>
                </div>
              </div>
              {/* Expanded detail */}
              {isExp&&<div style={{padding:"16px 20px",background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.04)",animation:"fadeIn .15s"}}>
                {/* Description + reminder history */}
                <div style={{marginBottom:12,fontSize:12}}>
                  <span style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5}}>Description: </span>
                  <span style={{fontWeight:500,color:"#3c3228"}}>{c.desc}</span>
                </div>
                {/* Reminder log */}
                {(c.reminders||[]).map((r,i)=>(
                  <div key={i} style={{fontSize:12,color:"#3c3228",marginBottom:4}}>
                    A {r.method} reminder was sent to your tenant(s) on {fmtD(r.date)}
                  </div>
                ))}

                {/* Bank deposit note for unpaid charges */}
                {(st==="pastdue"||st==="unpaid"||st==="partial")&&<div style={{fontSize:12,color:"#3c3228",marginBottom:14}}>
                  The payment will be deposited into <strong>REDSTONE FEDERAL CU-HUNTSVILLE - Harrison Ray Cooper</strong> bank account.
                </div>}

                {/* Per-payment status timeline cards */}
                {c.payments.length>0&&c.payments.map((p,pi)=>{
                  const isTransit=p.depositStatus==="transit";
                  const isDeposited=p.depositStatus==="deposited"||(!p.depositStatus&&p.depositDate);
                  const pConfId=p.confId||`BB-${c.id.slice(0,6).toUpperCase()}-${pi+1}`;
                  const printP=()=>{
                    const w=window.open("","_blank");
                    w.document.write(`<!DOCTYPE html><html><head><title>Receipt ${pConfId}</title><style>body{font-family:Georgia,serif;max-width:560px;margin:40px auto;padding:0 24px;color:#1a1714;line-height:1.6}h1{font-size:20px;font-weight:700;border-bottom:2px solid #1a1714;padding-bottom:8px;margin-bottom:20px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}.label{color:#666}.value{font-weight:600}.total{display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:800;border-top:2px solid #1a1714;margin-top:4px}.conf{font-family:monospace;font-size:18px;font-weight:900;text-align:center;padding:12px;background:#f5f0e8;border-radius:6px;margin:16px 0}.footer{margin-top:32px;font-size:11px;color:#999;text-align:center}</style></head><body><h1>Payment Receipt</h1><div class="conf">${pConfId}</div><div class="row"><span class="label">Date</span><span class="value">${p.date}</span></div><div class="row"><span class="label">Tenant</span><span class="value">${c.tenantName}</span></div><div class="row"><span class="label">Property</span><span class="value">${c.propName} · ${c.roomName}</span></div><div class="row"><span class="label">Charge</span><span class="value">${c.category} — ${c.desc}</span></div><div class="row"><span class="label">Method</span><span class="value">${p.method}</span></div><div class="total"><span>Amount Paid</span><span>$${Number(p.amount).toLocaleString()}</span></div><div class="footer">Oak &amp; Main Development LLC · Black Bear Rentals · blackbearhousing@gmail.com</div></body></html>`);
                    w.document.close();w.print();
                  };
                  return(
                  <div key={pi} style={{background:"rgba(59,130,246,.04)",border:"1px solid rgba(59,130,246,.1)",borderRadius:10,padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                    {/* Left: payment identity */}
                    <div style={{minWidth:140}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Payment #{pConfId.slice(-6)}</div>
                      <div style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>{c.tenantName}</div>
                      <div style={{fontSize:10,color:"#999",marginTop:2}}>Paid on {fmtD(p.date)}</div>
                      {p.method&&<div style={{fontSize:10,color:"#5c4a3a",marginTop:2}}>via {p.method}</div>}
                      {p.notes&&<div style={{fontSize:9,color:"#999",marginTop:2,fontStyle:"italic"}}>{p.notes}</div>}
                    </div>
                    {/* Middle: status timeline */}
                    <div style={{flex:1}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Status:</div>
                      {[
                        {label:"PAYMENT MADE",done:true,date:fmtD(p.date)},
                        {label:"TRANSFER INITIATED",done:isTransit||isDeposited,date:isTransit||isDeposited?fmtD(p.date):null},
                        {label:isDeposited?`DEPOSITED ${fmtD(p.depositDate||p.date)}`:`DEPOSITED EST. ${p.depositEstDate||"—"}`,done:isDeposited,date:null},
                      ].map((step,si)=>(
                        <div key={si} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:si<2?6:0}}>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                            <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${step.done?"#3b82f6":"#ccc"}`,background:step.done?"#3b82f6":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                              {step.done&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                            </div>
                            {si<2&&<div style={{width:2,height:14,background:step.done?"#3b82f6":"#e5e3df",marginTop:2}}/>}
                          </div>
                          <div style={{paddingTop:1}}>
                            <div style={{fontSize:10,fontWeight:700,color:step.done?"#1a1714":"#999"}}>{step.label}</div>
                            {step.date&&<div style={{fontSize:9,color:"#999"}}>{step.date}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Right: amount + download */}
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:16,fontWeight:800,color:"#1a1714",marginBottom:6}}>{fmtS(p.amount)}</div>
                      <button className="btn btn-out btn-sm" style={{fontSize:10}} onClick={e=>{e.stopPropagation();printP();}}>⬇ PDF</button>
                    </div>
                  </div>);
                })}

                {/* Unpaid/Late: action buttons */}
                {st!=="paid"&&st!=="waived"&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:c.payments.length?8:0}}>
                  <button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});}}>💰 Record Payment</button>
                  <button className="btn btn-dk btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"sendReminder",charge:c,tenantName:c.tenantName,rem,method:null});}}>📣 Send Reminder</button>
                  <button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"createCharge",roomId:c.roomId,category:c.category,desc:c.desc,amount:c.amount,dueDate:c.dueDate,notes:"Editing #"+c.id.slice(0,6)});}}>✏️ Edit</button>
                  <button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"deleteCharge",chargeId:c.id,tenantName:c.tenantName,category:c.category,desc:c.desc});}}> 🗑 Delete</button>
                  {st==="pastdue"&&<button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"waiveCharge",chargeId:c.id,reason:""});}}> ⏹ Stop Late Fees</button>}
                </div>}

                {st==="waived"&&<div style={{background:"rgba(0,0,0,.03)",borderRadius:6,padding:8,fontSize:11,color:"#999",marginTop:8}}>Waived{c.waivedReason?`: ${c.waivedReason}`:""}</div>}
              </div>}
            </div>);})}
          {filteredCharges.length===0&&<div style={{textAlign:"center",padding:24,color:"#999"}}>No charges match your filters</div>}
        </>}

        {/* ── Deposits ── */}
        {paySubTab==="deposits"&&(()=>{
          // Collect all payments with full context from their parent charge
          const allPays=charges.flatMap(c=>c.payments.map(p=>({...p,chargeId:c.id,tenantName:c.tenantName,propName:c.propName,roomName:c.roomName,category:c.category,chargeDueDate:c.dueDate})));
          const transit=allPays.filter(p=>p.depositStatus==="transit");
          const deposited=allPays.filter(p=>p.depositStatus==="deposited");
          const allDeposited=[...deposited].sort((a,b)=>new Date(b.depositDate||b.date)-new Date(a.depositDate||a.date));

          // Apply filters
          let filtered=allDeposited;
          if(depFilters.property)filtered=filtered.filter(p=>p.propName===depFilters.property);
          if(depFilters.tenant)filtered=filtered.filter(p=>p.tenantName===depFilters.tenant);
          if(depFilters.lease)filtered=filtered.filter(p=>p.roomName===depFilters.lease);
          if(depFilters.dateFrom)filtered=filtered.filter(p=>(p.depositDate||p.date)>=depFilters.dateFrom);
          if(depFilters.dateTo)filtered=filtered.filter(p=>(p.depositDate||p.date)<=depFilters.dateTo);

          // Group by month for display
          const months={};
          filtered.forEach(p=>{const d=new Date((p.depositDate||p.date)+"T00:00:00");const mk=`${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}`;const label=d.toLocaleString("default",{month:"long",year:"numeric"});if(!months[mk])months[mk]={label,key:mk,items:[],total:0};months[mk].items.push(p);months[mk].total+=p.amount;});
          const monthKeys=Object.keys(months).sort().reverse();

          const totalTransit=transit.reduce((s,p)=>s+p.amount,0);
          const totalDeposited=filtered.reduce((s,p)=>s+p.amount,0);

          // SD section
          const sdTenants=occLeases;
          const totalSD=sdTenants.reduce((s,r)=>{const sd=sdLedger.find(x=>x.roomId===r.id);return s+((sd&&sd.amountHeld)||r.rent);},0);

          return(<>
          {/* KPIs */}
          <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <div className="kpi"><div className="kl">🔄 In Transit</div><div className="kv kw">{fmtS(totalTransit)}</div><div className="ks">{transit.length} pending</div></div>
            <div className="kpi"><div className="kl">🏦 Deposited</div><div className="kv kg">{fmtS(totalDeposited)}</div><div className="ks">{filtered.length} deposits</div></div>
            <div className="kpi"><div className="kl">🔒 SD Held</div><div className="kv">{fmtS(totalSD)}</div><div className="ks">{sdTenants.length} tenants · Redstone FCU</div></div>
          </div>

          {/* In Transit */}
          {transit.length>0&&<>
            <div className="sec-hd"><div><h2>In Transit ({transit.length})</h2><p>Payments waiting to clear</p></div></div>
            {transit.map(p=><div key={p.id} className="row">
              <div className="row-dot" style={{background:"#d4a853"}}/>
              <div className="row-i"><div className="row-t">{p.tenantName}</div><div className="row-s">{p.propName} · {p.roomName} · {p.method} · Paid {fmtD(p.date)}</div></div>
              <div className="row-v kw">{fmtS(p.amount)}</div>
              <button className="btn btn-green btn-sm" onClick={()=>{setCharges(prev=>prev.map(c=>({...c,payments:c.payments.map(pp=>pp.id===p.id?{...pp,depositStatus:"deposited",depositDate:TODAY.toISOString().split("T")[0]}:pp)})));}}>Mark Deposited</button>
            </div>)}
          </>}

          {/* Deposit Ledger */}
          <div className="sec-hd" style={{marginTop:16}}><div><h2>Deposit Ledger</h2></div></div>

          {/* Filters */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
            <select value={depFilters.property} onChange={e=>setDepFilters({...depFilters,property:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Properties</option>{props.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>
            <select value={depFilters.tenant} onChange={e=>setDepFilters({...depFilters,tenant:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Tenants</option>{[...new Set(allDeposited.map(p=>p.tenantName))].map(n=><option key={n} value={n}>{n}</option>)}</select>
            <select value={depFilters.lease} onChange={e=>setDepFilters({...depFilters,lease:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Rooms</option>{[...new Set(allDeposited.map(p=>p.roomName))].map(n=><option key={n} value={n}>{n}</option>)}</select>
            <input type="date" value={depFilters.dateFrom} onChange={e=>setDepFilters({...depFilters,dateFrom:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}}/>
            <input type="date" value={depFilters.dateTo} onChange={e=>setDepFilters({...depFilters,dateTo:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10}}/>
            <button className="btn btn-out btn-sm" onClick={()=>setDepFilters({property:"",tenant:"",lease:"",dateFrom:"",dateTo:""})}>Reset</button>
          </div>

          {/* Monthly grouped table */}
          <div style={{maxHeight:500,overflowY:"auto",borderRadius:10,border:"1px solid rgba(0,0,0,.04)"}}>
            {monthKeys.length>0?monthKeys.map(mk=>{const mo=months[mk];return(
              <div key={mk}>
                <div style={{position:"sticky",top:0,zIndex:2,background:"#f4f3f0",padding:"10px 16px",borderBottom:"2px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:13,fontWeight:800}}>{mo.label}</div>
                  <div style={{fontSize:13,fontWeight:800,color:"#4a7c59"}}>{fmtS(mo.total)} <span style={{fontSize:10,fontWeight:500,color:"#999"}}>({mo.items.length})</span></div>
                </div>
                <table className="tbl" style={{marginBottom:0}}><thead><tr><th>Deposit Date</th><th>Date Paid</th><th>Tenant / Room</th><th>Bank Account</th><th style={{textAlign:"right"}}>Amount</th></tr></thead><tbody>
                  {mo.items.map(p=>(
                    <tr key={p.id}>
                      <td style={{fontWeight:600}}>{fmtD(p.depositDate)}</td>
                      <td>{fmtD(p.date)}</td>
                      <td><div style={{fontSize:11,fontWeight:600}}>{p.tenantName}</div><div style={{fontSize:9,color:"#999"}}>{p.propName} · {p.roomName}</div></td>
                      <td><div style={{fontSize:11}}>Redstone FCU</div><div style={{fontSize:9,color:"#999"}}>{p.method}</div></td>
                      <td style={{textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(p.amount)}</td>
                    </tr>
                  ))}
                </tbody></table>
              </div>
            );}):<div style={{textAlign:"center",padding:40,color:"#999"}}><div style={{fontSize:28,marginBottom:8}}>🏦</div>No deposits yet. When you record payments via ACH/Stripe and mark them deposited, they'll appear here grouped by month.</div>}
          </div>

          {/* Security Deposits */}
          <div className="sec-hd" style={{marginTop:20}}><div><h2>🔒 Security Deposits — Redstone FCU</h2></div></div>
          <div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th>Tenant</th><th>Property</th><th>Room</th><th>Lease End</th><th style={{textAlign:"right"}}>SD Held</th></tr></thead><tbody>
            {sdTenants.length>0?sdTenants.map(r=>{const sd=sdLedger.find(x=>x.roomId===r.id);const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;return(
              <tr key={r.id}>
                <td style={{fontWeight:600}}>{r.tenant.name}</td>
                <td>{r.propName}</td>
                <td>{r.name}</td>
                <td>{r.le?<span style={{color:dl&&dl<=90?dl<=30?"#c45c4a":"#d4a853":"inherit"}}>{fmtD(r.le)}{dl&&dl<=90?` (${dl}d)`:""}</span>:"—"}</td>
                <td style={{textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS((sd&&sd.amountHeld)||r.rent)}</td>
              </tr>);}):
            <tr><td colSpan={5} style={{textAlign:"center",padding:20,color:"#999"}}>No security deposits</td></tr>}
            {sdTenants.length>0&&<tr style={{borderTop:"2px solid rgba(0,0,0,.06)"}}><td colSpan={4} style={{fontWeight:800}}>Total Held</td><td style={{textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(totalSD)}</td></tr>}
          </tbody></table></div></div>

          {/* SD Returns History */}
          {sdLedger.length>0&&<>
            <div className="sec-hd" style={{marginTop:16}}><div><h2>SD Returns</h2></div></div>
            {sdLedger.map(s=>(
              <div key={s.id} className="row">
                <div className="row-dot" style={{background:"#999"}}/>
                <div className="row-i"><div className="row-t">{s.tenantName}</div><div className="row-s">{s.propName} · {s.roomName} · Held {fmtS(s.amountHeld)} · Deducted {fmtS(s.amountHeld-s.returned)} · Returned {fmtD(s.returnDate)}</div></div>
                <div className="row-v" style={{color:"#4a7c59"}}>{fmtS(s.returned)}</div>
              </div>
            ))}
          </>}
          </>);
        })()}
        </>);
      })()}

      {/* ═══ APPLICATIONS ═══ */}
      {tab==="applications"&&(()=>{
        const STAGES=["pre-screened","called","invited","applied","reviewing","lease-sent","onboarding"];
        const SL={"pre-screened":"Pre-Screened","called":"Called / Follow Up","invited":"Invited","applied":"Applied","reviewing":"Reviewing","lease-sent":"Lease Sent","onboarding":"Onboarding","approved":"Onboarding","move-in":"Onboarding","denied":"Denied"};
        const SC2={"pre-screened":"b-blue","called":"b-gold","invited":"b-gold","applied":"b-blue","reviewing":"b-gold","lease-sent":"b-gold","onboarding":"b-green","approved":"b-green","move-in":"b-green","denied":"b-red"};
        const SI2={"pre-screened":"📋","called":"📞","invited":"✉️","applied":"📝","reviewing":"🔍","lease-sent":"📨","onboarding":"🏠"};
        const moveApp=(id,ns)=>{setApps(p=>p.map(a=>{if(a.id!==id)return a;return{...a,status:ns,lastContact:TODAY.toISOString().split("T")[0],prevStage:a.status,history:[...(a.history||[]),{from:a.status,to:ns,date:TODAY.toISOString().split("T")[0]}]};}));};
        const daysSince=(d)=>{if(!d)return 999;return Math.floor((TODAY-new Date(d+"T00:00:00"))/(1e3*60*60*24));};
        const scoreApp=(a)=>{
          let s=50;
          const breakdown=[];
          // Income
          if(a.income){const n=parseInt(String(a.income).replace(/[^0-9]/g,""));
            if(n>=5000){s+=15;breakdown.push("+15 income ≥$5k");}
            else if(n>=4000){s+=10;breakdown.push("+10 income ≥$4k");}
            else if(n>=3000){s+=5;breakdown.push("+5 income ≥$3k");}
          }
          // Background check
          if(a.bgCheck==="passed"){s+=15;breakdown.push("+15 BG passed");}
          else if(a.bgCheck==="failed"){s-=30;breakdown.push("-30 BG failed");}
          // Credit score
          if(a.creditScore&&a.creditScore!=="—"){const c=parseInt(a.creditScore);
            if(c>=750){s+=15;breakdown.push("+15 credit ≥750");}
            else if(c>=700){s+=10;breakdown.push("+10 credit ≥700");}
            else if(c>=650){s+=5;breakdown.push("+5 credit ≥650");}
            else if(c>0){s-=10;breakdown.push("-10 credit <650");}
          }
          // References
          if(a.refs==="verified"){s+=10;breakdown.push("+10 refs verified");}
          // Rent negotiated higher than list price
          if(a.negotiatedRent&&a.room){const room=props.flatMap(p=>allRooms(p)).find(r=>r.name===a.room);if(room&&a.negotiatedRent>room.rent){s+=10;breakdown.push("+10 above-ask rent");}}
          // Source quality
          if(a.source==="NASA Intern Program"||a.source==="Military / Contractor Network"){s+=5;breakdown.push("+5 vetted source");}
          // Eviction / felony in application data
          if(a.applicationData){
            const vals=Object.values(a.applicationData);
            vals.forEach(v=>{if(v&&typeof v==="object"&&v.answer==="yes"&&(v.followUpText||"").length>0){s-=15;breakdown.push("-15 eviction/felony disclosed");}});
          }
          // Days stale — small penalty for going cold
          const d=daysSince(a.lastContact||a.submitted);
          if(d>=7){s-=10;breakdown.push("-10 stale 7d+");}
          else if(d>=5){s-=5;breakdown.push("-5 stale 5d+");}
          return{score:Math.max(0,Math.min(s,100)),breakdown};
        };
        const getScore=(a)=>scoreApp(a).score;
        const getBreakdown=(a)=>scoreApp(a).breakdown;

        // Onboarding progress — 4 steps
        const getOnboardingProgress=(a)=>{
          const appLease=leases.find(l=>l.applicationId===a.id);
          const leaseSigned=appLease?.status==="executed"||!!a.leaseSigned;
          const docsUploaded=(a.documents&&a.documents.length>0)||(a.docsFlag&&!a.docsFlag.idUploadLater&&!a.docsFlag.incomeUploadLater);
          const appCharges=charges.filter(c=>c.tenantName===a.name);
          const sdCharge=appCharges.find(c=>c.category==="Security Deposit");
          const rentCharge=appCharges.find(c=>c.category==="Rent");
          const sdPaid=sdCharge&&chargeStatus(sdCharge)==="paid";
          const firstMonthPaid=rentCharge&&chargeStatus(rentCharge)==="paid";
          const steps=[leaseSigned,docsUploaded,sdPaid,firstMonthPaid];
          const count=steps.filter(Boolean).length;
          const pct=count/4*100;
          const color=count===4?"#4a7c59":count>=3?"#e8903a":count>=1?"#d4a853":"#c45c4a";
          return{count,leaseSigned,docsUploaded,sdPaid,firstMonthPaid,pct,color,ready:count===4};
        };
        const monthFilter=expanded.appMonthFilter||"all";
        const activeApps=apps.filter(a=>{
          if(a.status==="denied")return false;
          if(appSearch&&![a.name,a.email,a.phone,a.property,a.source].some(v=>(v||"").toLowerCase().includes(appSearch.toLowerCase())))return false;
          if(monthFilter!=="all"&&!(a.submitted||"").startsWith(monthFilter))return false;
          return true;
        });
        const deniedApps=apps.filter(a=>{
          if(a.status!=="denied")return false;
          if(monthFilter!=="all"&&!(a.submitted||"").startsWith(monthFilter))return false;
          return true;
        });
        const staleApps=activeApps.filter(a=>daysSince(a.lastContact||a.submitted)>=3&&!["approved","move-in","onboarding","lease-sent"].includes(a.status));
        // Duplicate / returning detection
        const allTenantsList=props.flatMap(p=>allRooms(p).filter(r=>r.tenant).map(r=>({name:(r.tenant&&r.tenant.name)||"",email:(r.tenant&&r.tenant.email)||"",phone:(r.tenant&&r.tenant.phone)||"",propName:p.name,roomName:r.name,type:"current"})));
        const archiveList=archive.map(a=>({name:a.name||"",email:a.email||"",phone:a.phone||"",propName:a.propName,roomName:a.roomName,reason:a.reason,type:"past"}));
        const getFlags=(a)=>{
          const flags=[];
          var nm=(a.name||"").toLowerCase(),em=(a.email||"").toLowerCase(),ph=a.phone||"";
          // Check current tenants
          allTenantsList.forEach(t=>{if((t.name&&nm&&t.name.toLowerCase()===nm)||(t.email&&em&&t.email.toLowerCase()===em)||(t.phone&&ph&&t.phone===ph))flags.push({type:"current",label:"Current tenant at "+t.propName,data:t});});
          // Check archive
          archiveList.forEach(t=>{if((t.name&&nm&&t.name.toLowerCase()===nm)||(t.email&&em&&t.email.toLowerCase()===em)||(t.phone&&ph&&t.phone===ph))flags.push({type:"past",label:"Past tenant — "+t.propName+(t.reason?" ("+t.reason+")":""),data:t});});
          // Check other apps
          apps.filter(x=>x.id!==a.id).forEach(x=>{if((x.name&&nm&&x.name.toLowerCase()===nm)||(x.email&&em&&x.email.toLowerCase()===em)||(x.phone&&ph&&x.phone===ph))flags.push({type:"dup",label:"Duplicate — also "+x.status,data:x});});
          return flags;
        };
        const DEF_APP_FIELDS=[
          // ── Section 1: Contact Info ──
          {id:uid(),label:"First Name",key:"firstName",type:"text",section:"Contact Info",required:true,active:true,placeholder:"First name",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Last Name",key:"lastName",type:"text",section:"Contact Info",required:true,active:true,placeholder:"Last name",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Email Address",key:"email",type:"email",section:"Contact Info",required:true,active:true,placeholder:"you@email.com",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Phone Number",key:"phone",type:"phone",section:"Contact Info",required:true,active:true,placeholder:"(256) 555-1234",helpText:"Pre-filled from invite if applicable.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Date of Birth",key:"dob",type:"date-dob",section:"Contact Info",required:true,active:true,placeholder:"",helpText:"Month / Day / Year dropdowns.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          // ── Section 2: Move-In & Property ──
          {id:uid(),label:"Desired Move-in Date",key:"moveIn",type:"date-movein",section:"Move-In & Property",required:true,active:true,placeholder:"",helpText:"Month / Day / Year dropdowns.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Property Interest",key:"preferredProperty",type:"property-select",section:"Move-In & Property",required:true,active:true,placeholder:"",helpText:"Required for walk-in applicants. Pre-filled from invite if applicable.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Preferred Room",key:"selectedRoom",type:"room-select",section:"Move-In & Property",required:false,active:true,placeholder:"",helpText:"Optional — shown based on selected property.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Door Code (4-digit PIN)",key:"doorCode",type:"passcode",section:"Move-In & Property",required:true,active:true,placeholder:"Choose a 4-digit code",helpText:"This code will be programmed into your smart lock and written into your lease. Activates at 12:00am on move-in day once payment is received.",options:[],followUpYes:"",followUpNo:"",min:4,max:4},
          {id:uid(),label:"Number of Occupants",key:"occupants",type:"counter",section:"Move-In & Property",required:true,active:true,placeholder:"",helpText:"Only 1 person per room. Each adult over 18 must apply separately.",options:[],followUpYes:"",followUpNo:"",min:1,max:10},
          // ── Section 3: Personal Information ──
          {id:uid(),label:"Photo ID Upload",key:"idFile",type:"file",section:"Personal Information",required:true,active:true,placeholder:"Upload driver's license, passport, or state ID",helpText:"JPG, PNG, or PDF. Can be uploaded later — application will be marked incomplete until received.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          // ── Section 4: Rental History ──
          {id:uid(),label:"Current / Previous Address",key:"addresses",type:"address-block",section:"Rental History",required:true,active:true,placeholder:"",helpText:"Include landlord name and contact info to strengthen your application.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Have you ever been evicted?",key:"evicted",type:"yes-no",section:"Rental History",required:true,active:true,placeholder:"",helpText:"",options:[],followUpYes:"Please briefly explain the circumstances.",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Do you have any felony convictions?",key:"felony",type:"yes-no",section:"Rental History",required:true,active:true,placeholder:"",helpText:"",options:[],followUpYes:"Please briefly explain.",followUpNo:"",min:null,max:null},
          // ── Section 5: Employment & Income ──
          {id:uid(),label:"Currently Employed",key:"unemployed",type:"employed-toggle",section:"Employment & Income",required:false,active:true,placeholder:"",helpText:"If unemployed, employer reference and employer fields are skipped. Previous work history is optional.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Current Employer",key:"employers",type:"employer-block",section:"Employment & Income",required:true,active:true,placeholder:"Company name",helpText:"Landlords like to see ~5 years of employment history.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Gross Monthly Income",key:"income",type:"number",section:"Employment & Income",required:true,active:true,placeholder:"4200",helpText:"Before taxes. We look for 3x the monthly rent.",options:[],followUpYes:"",followUpNo:"",min:0,max:null},
          {id:uid(),label:"Proof of Income",key:"payStubs",type:"file",section:"Employment & Income",required:false,active:true,placeholder:"Upload pay stubs, offer letter, or bank statement",helpText:"Last 2 pay stubs preferred. Can be uploaded later.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          // ── Section 6: References ──
          {id:uid(),label:"Employer Reference Name",key:"empRefName",type:"text",section:"References",required:true,active:true,placeholder:"Supervisor or HR contact",helpText:"Skipped if applicant is unemployed.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Employer Reference Phone",key:"empRefPhone",type:"phone",section:"References",required:true,active:true,placeholder:"(256) 555-0000",helpText:"Skipped if applicant is unemployed.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Employer Reference Relationship",key:"empRefRelation",type:"text",section:"References",required:false,active:true,placeholder:"e.g. Manager",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Personal Reference Name",key:"persRefName",type:"text",section:"References",required:true,active:true,placeholder:"Someone who knows you well",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Personal Reference Phone",key:"persRefPhone",type:"phone",section:"References",required:true,active:true,placeholder:"(256) 555-0000",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Personal Reference Relationship",key:"persRefRelation",type:"text",section:"References",required:false,active:true,placeholder:"e.g. Friend, Colleague",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          // ── Section 7: Emergency Contact ──
          {id:uid(),label:"Emergency Contact Name",key:"emergName",type:"text",section:"Emergency Contact",required:true,active:true,placeholder:"Full name",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Emergency Contact Phone",key:"emergPhone",type:"phone",section:"Emergency Contact",required:true,active:true,placeholder:"(256) 555-0000",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
          {id:uid(),label:"Relationship to Applicant",key:"emergRelation",type:"text",section:"Emergency Contact",required:true,active:true,placeholder:"e.g. Parent, Sibling, Friend",helpText:"",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
        ];

        return(<>
        {/* Follow-up alerts */}
        {(()=>{const visible=staleApps.filter(a=>!dismissedFollowUps.includes(a.id));if(staleApps.length===0)return null;
          const allDismissed=visible.length===0;
          return(<div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.15)",borderRadius:10,padding:12,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:visible.length&&expanded.followUp!==false?6:0}}>
              <div style={{fontSize:12,fontWeight:700,color:"#9a7422"}}>🔔 Follow Up ({visible.length})</div>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                {!allDismissed&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setExpanded(p=>({...p,followUp:p.followUp===false?true:false}))}>{expanded.followUp===false?"Show ▾":"Minimize ▴"}</button>}
                {!allDismissed&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setDismissedFollowUps(p=>[...p,...visible.map(a=>a.id)])}>Dismiss All</button>}
                {allDismissed&&<span style={{fontSize:10,color:"#c4a882"}}>All cleared · <button style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#d4a853",fontFamily:"inherit",padding:0}} onClick={()=>setDismissedFollowUps([])}>Restore</button></span>}
              </div>
            </div>
            {expanded.followUp!==false&&!allDismissed&&visible.map(a=>(
              <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",fontSize:11,borderBottom:"1px solid rgba(0,0,0,.03)"}}>
                <span><strong>{a.name}</strong> — {SL[a.status]} · <span style={{color:daysSince(a.lastContact||a.submitted)>=5?"#c45c4a":"#d4a853",fontWeight:700}}>{daysSince(a.lastContact||a.submitted)}d</span></span>
                <div style={{display:"flex",gap:4}}>
                  <button className="btn btn-out btn-sm" style={{fontSize:8}} onClick={()=>setModal({type:"app",data:a})}>Open</button>
                  <button className="btn btn-out btn-sm" style={{fontSize:8,color:"#bbb",padding:"4px 7px"}} title="Dismiss" onClick={()=>setDismissedFollowUps(p=>[...p,a.id])}>✕</button>
                </div>
              </div>
            ))}
          </div>);
        })()}

        {/* KPIs + controls */}
        <div className="kgrid" style={{gridTemplateColumns:"repeat(4,1fr)",marginBottom:10}}>
          <div className="kpi"><div className="kl">Pipeline</div><div className="kv">{activeApps.length}</div></div>
          <div className="kpi"><div className="kl">Avg Score</div><div className="kv" style={{color:"#4a7c59"}}>{activeApps.length?Math.round(activeApps.reduce((s,a)=>s+getScore(a),0)/activeApps.length):0}</div></div>
          <div className="kpi"><div className="kl">Stale</div><div className="kv" style={{color:staleApps.length?"#c45c4a":"#4a7c59"}}>{staleApps.length}</div></div>
          <div className="kpi"><div className="kl">Denied</div><div className="kv">{deniedApps.length}</div></div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <input value={appSearch} onChange={e=>setAppSearch(e.target.value)} placeholder="Search applicants..." style={{flex:1,minWidth:160,padding:"8px 12px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/>
          <select value={expanded.appMonthFilter||"all"} onChange={e=>setExpanded(p=>({...p,appMonthFilter:e.target.value}))} style={{padding:"7px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}>
            <option value="all">All Time</option>
            {[...new Set(apps.map(a=>(a.submitted||"").slice(0,7)).filter(Boolean).sort().reverse())].map(m=>{
              const d=new Date(m+"-02");return<option key={m} value={m}>{d.toLocaleString("default",{month:"long",year:"numeric"})}</option>;
            })}
          </select>
          {[{v:"pipeline",l:"📋 Pipeline"},{v:"list",l:"📝 List"}].map(b=><button key={b.v} className={`btn ${appView===b.v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setAppView(b.v)}>{b.l}</button>)}
        </div>

        {/* Bulk invite bar */}
        {(appView==="pipeline"||appView==="list")&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:bulkSel.length?"rgba(212,168,83,.08)":"rgba(0,0,0,.02)",borderRadius:8,marginBottom:10,border:bulkSel.length?"1px solid rgba(212,168,83,.2)":"1px solid transparent",transition:"all .2s",flexWrap:"wrap"}}>
          <input type="checkbox" checked={bulkSel.length>0&&bulkSel.length===activeApps.length} onChange={e=>{setBulkSel(e.target.checked?activeApps.map(a=>a.id):[]);}} style={{width:14,height:14,cursor:"pointer"}}/>
          <span style={{fontSize:11,color:"#999",flex:1,minWidth:80}}>{bulkSel.length>0?`${bulkSel.length} selected`:"Select applicants"}</span>
          {bulkSel.length>0&&<>
            {(()=>{
              const invitable=activeApps.filter(a=>bulkSel.includes(a.id)&&["pre-screened","called"].includes(a.status));
              const reinvitable=activeApps.filter(a=>bulkSel.includes(a.id)&&a.status==="invited");
              return(<>
                {invitable.length>0&&<button className="btn btn-gold btn-sm"
                  onClick={()=>{
                    if(invitable.length===1){setModal({type:"inviteApp",data:invitable[0]});}
                    else{setModal({type:"bulkInvite",ids:bulkSel});}
                  }}>
                  ✉️ Invite ({invitable.length})
                </button>}
                {reinvitable.length>0&&<button className="btn btn-out btn-sm" style={{color:"#3b82f6",borderColor:"rgba(59,130,246,.25)"}}
                  onClick={()=>setModal({type:"confirmAction",title:`Reinvite ${reinvitable.length} Applicant${reinvitable.length>1?"s":""}`,
                    body:`Resend the application link to ${reinvitable.length} invited applicant${reinvitable.length>1?"s":" ("+reinvitable[0].name+")"}?`,
                    confirmLabel:"Reinvite",confirmStyle:"btn-gold",
                    onConfirm:()=>{
                      const now=TODAY.toISOString().split("T")[0];
                      setApps(p=>p.map(a=>reinvitable.find(r=>r.id===a.id)?{...a,lastContact:now,history:[...(a.history||[]),{from:"invited",to:"invited",date:now,note:"Reinvited — resent application link"}]}:a));
                      setBulkSel([]);setModal(null);
                    }})}>
                  🔄 Reinvite ({reinvitable.length})
                </button>}
              </>);
            })()}
            <button className="btn btn-out btn-sm" style={{color:"#9a7422",borderColor:"rgba(212,168,83,.3)"}}
              onClick={()=>setModal({type:"confirmAction",title:"Archive "+bulkSel.length+" Applicant"+(bulkSel.length>1?"s":""),
                body:"Move "+bulkSel.length+" applicant"+(bulkSel.length>1?"s":"")+" to Denied? They'll be hidden from the pipeline but stay in your records.",
                confirmLabel:"Archive "+bulkSel.length,confirmStyle:"btn-out",
                onConfirm:()=>{setApps(p=>p.map(a=>bulkSel.includes(a.id)?{...a,status:"denied",deniedReason:"Archived",deniedDate:TODAY.toISOString().split("T")[0],prevStage:a.status}:a));setBulkSel([]);setModal(null);}})}>
              Archive ({bulkSel.length})
            </button>
            <button className="btn btn-out btn-sm" style={{color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}}
              onClick={()=>setModal({type:"confirmAction",title:"Delete "+bulkSel.length+" Applicant"+(bulkSel.length>1?"s":""),
                body:"Permanently delete "+bulkSel.length+" applicant"+(bulkSel.length>1?"s":"")+"? This cannot be undone and all their data will be removed.",
                confirmLabel:"Delete "+bulkSel.length,confirmStyle:"btn-red",
                onConfirm:()=>{setApps(p=>p.filter(a=>!bulkSel.includes(a.id)));setBulkSel([]);setModal(null);}})}>
              Delete ({bulkSel.length})
            </button>
            <button className="btn btn-out btn-sm" onClick={()=>setBulkSel([])}>✕ Clear</button>
          </>}
        </div>}

        {/* Pipeline */}
        {appView==="pipeline"&&<div className="pipeline">
          {STAGES.map(function(stage,si){
            // Onboarding column shows "onboarding" and "move-in"; lease-sent shows "lease-sent" only
            var sa=stage==="onboarding"
              ?activeApps.filter(function(a){return["approved","onboarding","move-in"].includes(a.status);})
              :stage==="lease-sent"
              ?activeApps.filter(function(a){return a.status==="lease-sent";})
              :activeApps.filter(function(a){return a.status===stage;});
            return(
            <div key={stage} className="pipe-col">
              <div className="pipe-hd"><h4 style={{fontSize:10}}>{SI2[stage]} {SL[stage]}</h4><span className="pipe-cnt">{sa.length}</span></div>
              <div className="pipe-bd">
                {sa.sort(function(a,b){return getScore(b)-getScore(a);}).map(function(a){
                  var sc=getScore(a);var bd=getBreakdown(a);var d=daysSince(a.lastContact||a.submitted);var flags=getFlags(a);var isChecked=bulkSel.includes(a.id);var canInvite=["pre-screened","called"].includes(a.status);
                  var isOnboarding=["approved","onboarding","move-in"].includes(a.status);var isLeaseSent=a.status==="lease-sent";
                  var prog=isOnboarding?getOnboardingProgress(a):null;
                  return(
                  <div key={a.id} className="pipe-card" style={{
                    border:isOnboarding?`2px solid ${prog.color}`:"1px solid rgba(0,0,0,.07)",
                    borderLeft:isOnboarding?`2px solid ${prog.color}`:sc>=70?"3px solid #4a7c59":sc>=50?"3px solid #d4a853":"3px solid #c45c4a",
                    cursor:"pointer",background:isChecked?"rgba(212,168,83,.06)":"#fff",
                    padding:isOnboarding?"10px":"10px 10px 10px 30px",
                  }} onClick={function(){setModal({type:"app",data:a});}}>

                    {/* Checkbox — only on non-onboarding, positioned cleanly */}
                    {!isOnboarding&&<div style={{position:"absolute",left:8,top:12}} onClick={e=>{e.stopPropagation();setBulkSel(p=>isChecked?p.filter(x=>x!==a.id):[...p,a.id]);}}><input type="checkbox" checked={isChecked} onChange={()=>{}} style={{width:13,height:13,cursor:"pointer"}}/></div>}

                    {flags.length>0&&<div style={{fontSize:7,padding:"2px 5px",borderRadius:3,marginBottom:3,background:flags[0].type==="current"?"rgba(196,92,74,.08)":flags[0].type==="past"?"rgba(212,168,83,.08)":"rgba(59,130,246,.08)",color:flags[0].type==="current"?"#c45c4a":flags[0].type==="past"?"#9a7422":"#3b82f6",fontWeight:600,cursor:"pointer"}}
                      onClick={e=>{e.stopPropagation();if(flags[0].type==="past"){setDrill("archive");setTab("tenants");}else if(flags[0].type==="dup"){setModal({type:"app",data:flags[0].data});}setModal(null);}}>
                      {flags[0].type==="current"?"⚠ Current Tenant":flags[0].type==="past"?"↩ Returning":flags[0].type==="dup"?"⚠ Duplicate":""} →
                    </div>}

                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div className="pipe-nm">{a.name}</div>
                      {!isOnboarding&&<div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                        <span style={{fontSize:7,fontWeight:700,color:sc>=70?"#4a7c59":sc>=50?"#d4a853":"#c45c4a",background:sc>=70?"rgba(74,124,89,.08)":sc>=50?"rgba(212,168,83,.08)":"rgba(196,92,74,.08)",padding:"1px 5px",borderRadius:3,cursor:"pointer"}}
                          onMouseEnter={e=>{const t=e.currentTarget.nextSibling;if(t)t.style.display="block";}}
                          onMouseLeave={e=>{const t=e.currentTarget.nextSibling;if(t)t.style.display="none";}}
                        >{sc}</span>
                        <div style={{display:"none",position:"absolute",right:0,top:"100%",zIndex:20,background:"#1a1714",color:"#f5f0e8",borderRadius:6,padding:"6px 8px",fontSize:8,whiteSpace:"nowrap",boxShadow:"0 4px 12px rgba(0,0,0,.3)",marginTop:2}}>
                          {bd.length>0?bd.map((b,i)=><div key={i}>{b}</div>):<div>Base: 50pts</div>}
                        </div>
                      </div>}
                    </div>

                    <div className="pipe-sub">{a.property||"—"}{a.room?" · "+a.room:""}</div>

                    {/* Invited — "Awaiting Reply" badge + reinvite button */}
                    {a.status==="invited"&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
                      <span style={{fontSize:8,fontWeight:700,color:"#3b82f6",background:"rgba(59,130,246,.1)",padding:"2px 6px",borderRadius:99}}>⏳ Awaiting Reply</span>
                      <button style={{fontSize:8,padding:"2px 7px",background:"none",border:"1px solid rgba(59,130,246,.25)",borderRadius:4,color:"#3b82f6",cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}
                        onClick={e=>{e.stopPropagation();
                          const now=TODAY.toISOString().split("T")[0];
                          setApps(p=>p.map(x=>x.id===a.id?{...x,lastContact:now,history:[...(x.history||[]),{from:"invited",to:"invited",date:now,note:"Reinvited — resent application link"}]}:x));
                          if(a.inviteLink){navigator.clipboard.writeText(a.inviteLink);showAlert({title:"Link Copied",body:"Invite link copied to clipboard. Re-send to "+a.name+"."});}
                        }}>🔄 Reinvite</button>
                    </div>}

                    {/* Onboarding progress bar */}
                    {isOnboarding&&prog&&<>
                      <div style={{marginTop:6,height:5,background:"rgba(0,0,0,.08)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${prog.pct}%`,background:prog.color,borderRadius:3,transition:"width .3s ease"}}/>
                      </div>
                      <div style={{display:"flex",gap:3,marginTop:5}}>
                        {[
                          {key:"leaseSigned",label:"Lease"},
                          {key:"docsUploaded",label:"Docs"},
                          {key:"sdPaid",label:"SD"},
                          {key:"firstMonthPaid",label:"Rent"},
                        ].map(({key,label})=>(
                          <div key={key} style={{flex:1,textAlign:"center",fontSize:7,fontWeight:800,padding:"2px 0",borderRadius:3,
                            background:prog[key]?"rgba(74,124,89,.15)":"rgba(0,0,0,.06)",
                            color:prog[key]?"#2d6a3f":"#666"}}>
                            {prog[key]?"✓ ":""}{label}
                          </div>
                        ))}
                      </div>
                      {prog.ready&&<div style={{marginTop:4,fontSize:8,fontWeight:800,color:"#2d6a3f",textAlign:"center",padding:"3px 0",background:"rgba(74,124,89,.1)",borderRadius:3}}>✅ Ready to Move In</div>}
                    </>}

                    {/* Standard card footer */}
                    {!isOnboarding&&a.status!=="invited"&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:8,color:"#777",marginTop:5}}>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:80}}>{a.source||""}</span>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        {d>0&&<span style={{color:d>=5?"#c45c4a":d>=3?"#d4a853":"#888",fontWeight:700}}>{d}d</span>}
                        {canInvite&&<button style={{fontSize:7,padding:"1px 5px",background:"#d4a853",color:"#1a1714",border:"none",borderRadius:3,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}
                          onClick={e=>{e.stopPropagation();setModal({type:"inviteApp",data:a});}}>Invite</button>}
                      </div>
                    </div>}
                  </div>);
                })}
                {sa.length===0&&<div style={{textAlign:"center",padding:12,color:"#ccc",fontSize:9}}>Empty</div>}
              </div>
            </div>);
          })}
        </div>}

        {/* List */}
        {appView==="list"&&<div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th>Name</th><th>Property</th><th>Score</th><th>Stage</th><th>Days</th><th>Source</th></tr></thead><tbody>
          {activeApps.sort((a,b)=>getScore(b)-getScore(a)).map(a=>{const sc=getScore(a);const d=daysSince(a.lastContact||a.submitted);return(
            <tr key={a.id} style={{cursor:"pointer"}} onClick={()=>setModal({type:"app",data:a})}><td style={{fontWeight:700}}>{a.name}</td><td>{a.property||"—"}</td>
              <td><span style={{fontWeight:700,color:sc>=70?"#4a7c59":sc>=50?"#d4a853":"#c45c4a"}}>{sc}</span></td>
              <td><span className={`badge ${SC2[a.status]}`}>{SL[a.status]}</span></td>
              <td style={{color:d>=5?"#c45c4a":d>=3?"#d4a853":"#999",fontWeight:600}}>{d}d</td>
              <td style={{fontSize:10}}>{a.source||"—"}</td></tr>);})}
        </tbody></table></div></div>}

        {/* Denied — collapsible */}
        {deniedApps.length>0&&<div style={{marginTop:14}}>
          <button className="btn btn-out btn-sm" style={{width:"100%",color:"#999",marginBottom:4}} onClick={()=>setExpanded(p=>({...p,showDenied:!p.showDenied}))}>
            {expanded.showDenied?"▾ Hide":"▸ Show"} Denied ({deniedApps.length})
          </button>
          {expanded.showDenied&&deniedApps.map(a=><div key={a.id} className="row" style={{opacity:.7}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{a.name}</div><div className="row-s">{a.property} · {fmtD(a.deniedDate)}{a.deniedReason?" · "+a.deniedReason:""}</div></div><button className="btn btn-out btn-sm" onClick={()=>setModal({type:"app",data:a})}>View</button><button className="btn btn-out btn-sm" onClick={()=>setApps(p=>p.map(x=>x.id===a.id?{...x,status:x.prevStage||"pre-screened",deniedReason:null,deniedDate:null}:x))}>Restore</button></div>)}
        </div>}

        {/* ── Quick Add / Generic Link ── */}
        <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {/* Card 1: Add Lead Manually */}
          <div style={{border:"1px solid rgba(0,0,0,.06)",borderRadius:12,padding:16,background:"#fff"}}>
            <div style={{fontSize:13,fontWeight:800,marginBottom:4}}>📞 Add Lead Manually</div>
            <div style={{fontSize:11,color:"#999",marginBottom:12}}>Someone called you directly — no pre-screen. Enter their info and add them to the pipeline, then invite them to apply.</div>
            <button className="btn btn-gold" style={{width:"100%"}} onClick={()=>setModal({type:"addLead",name:"",phone:"",email:"",property:"",notes:"",source:"Phone / Direct Call"})}>+ Add Lead</button>
          </div>
          {/* Card 2: Generic Application Link */}
          <div style={{border:"1px solid rgba(0,0,0,.06)",borderRadius:12,padding:16,background:"#fff"}}>
            <div style={{fontSize:13,fontWeight:800,marginBottom:4}}>🔗 Generic Application Link</div>
            <div style={{fontSize:11,color:"#999",marginBottom:10}}>Share this link anywhere — they'll enter their own info, pass the pre-screen questions, then go straight into the full application.</div>
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              <div style={{flex:1,padding:"8px 10px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:10,color:"#999",fontFamily:"monospace",background:"#faf9f7",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {(settings.siteUrl||"https://rentblackbear.com")}/apply
              </div>
              <button className="btn btn-out btn-sm" onClick={()=>{navigator.clipboard.writeText(`${settings.siteUrl||"https://rentblackbear.com"}/apply`);setModal({type:"genericLinkCopied"});}}>📋 Copy</button>
            </div>
            {expanded.genericNote
              ?<div style={{marginBottom:8}}>
                <textarea value={expanded.genericNoteText||""} onChange={e=>setExpanded(p=>({...p,genericNoteText:e.target.value}))} placeholder="Add an optional note to your message..." rows={2} style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"none"}}/>
              </div>
              :<button className="btn btn-out btn-sm" style={{width:"100%",marginBottom:8,fontSize:10}} onClick={()=>setExpanded(p=>({...p,genericNote:true,genericNoteText:""}))}>+ Add optional note to message</button>}
            <div style={{display:"flex",gap:6}}>
              {(()=>{
                const link=`${settings.siteUrl||"https://rentblackbear.com"}/apply`;
                const note=expanded.genericNoteText?(` ${expanded.genericNoteText}`):"";
                const smsBody=encodeURIComponent(`Hey! Black Bear Rentals has a room available in Huntsville. Apply here:${note}\n${link}`);
                const emailSubject=encodeURIComponent("Apply for a Room at Black Bear Rentals");
                const emailBody=encodeURIComponent(`Hi,\n\nWe'd love to have you apply for a room at Black Bear Rentals in Huntsville, AL.\n${note?`\n${expanded.genericNoteText}\n`:""}\nApply here: ${link}\n\nTakes about 10–15 minutes. Let me know if you have any questions!\n\nHarrison\nBlack Bear Rentals`);
                return(<>
                  <a href={`sms:?&body=${smsBody}`} className="btn btn-dk btn-sm" style={{flex:1,textDecoration:"none",justifyContent:"center"}}>💬 Text</a>
                  <a href={`mailto:?subject=${emailSubject}&body=${emailBody}`} className="btn btn-out btn-sm" style={{flex:1,textDecoration:"none",justifyContent:"center"}}>✉️ Email</a>
                </>);
              })()}
            </div>
            <div style={{fontSize:10,color:"#4a7c59",marginTop:8}}>✓ Applicant fills out name, DOB, contact info + pre-screen before the full app</div>
          </div>
        </div>

        {/* ── Waitlist ── */}
        {(()=>{const totalVacant=props.reduce((s,p)=>s+allRooms(p).filter(r=>r.st==="vacant").length,0);const waitlistApps=activeApps.filter(a=>["pre-screened","called","invited"].includes(a.status));
          if(totalVacant===0&&waitlistApps.length>0)return(
            <div style={{marginTop:8,border:"2px solid rgba(212,168,83,.2)",borderRadius:12,padding:14,background:"rgba(212,168,83,.03)"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#9a7422",marginBottom:8}}>📋 Waitlist — No Vacant Rooms</div>
              <div style={{fontSize:10,color:"#999",marginBottom:8}}>All rooms are occupied. These applicants are waiting for availability, ranked by score.</div>
              {waitlistApps.sort((a,b)=>getScore(b)-getScore(a)).map((a,i)=><div key={a.id} className="row" style={{padding:"8px 10px"}}><div style={{width:20,fontSize:12,fontWeight:800,color:"#d4a853"}}>{i+1}</div><div className="row-i"><div className="row-t">{a.name} <span style={{fontSize:9,color:"#999"}}>({getScore(a)}pt)</span></div><div className="row-s">{a.property||"No pref"} · {SL[a.status]} · {a.source||""}</div></div><button className="btn btn-out btn-sm" onClick={()=>setModal({type:"app",data:a})}>View</button></div>)}
            </div>);
          return null;})()}

        {/* ── Lead Source Analytics ── */}
        <div style={{marginTop:16,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,sourceAnalytics:!p.sourceAnalytics}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.sourceAnalytics?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>📊 Lead Source Analytics</div><div style={{fontSize:9,color:"#999"}}>Which channels are converting</div></div></div>
          </div>
          {expanded.sourceAnalytics&&<div style={{padding:0}}>
            <table className="tbl"><thead><tr><th>Source</th><th>Leads</th><th>In Pipeline</th><th>Approved</th><th>Denied</th><th>Conv %</th></tr></thead><tbody>
            {[...new Set(apps.map(a=>a.source||"Unknown"))].map(src=>{const sa=apps.filter(a=>(a.source||"Unknown")===src);const inPipe=sa.filter(a=>a.status!=="denied"&&a.status!=="approved"&&a.status!=="move-in").length;const approved=sa.filter(a=>a.status==="approved"||a.status==="move-in"||a.status==="onboarding").length;const denied=sa.filter(a=>a.status==="denied").length;const rate=sa.length?Math.round(approved/sa.length*100):0;return(
              <tr key={src}><td style={{fontWeight:600}}>{src}</td><td>{sa.length}</td><td>{inPipe}</td><td style={{color:approved?"#4a7c59":"#999"}}>{approved}</td><td style={{color:denied?"#c45c4a":"#999"}}>{denied}</td><td><span style={{fontWeight:700,color:rate>=50?"#4a7c59":rate>=20?"#d4a853":"#999"}}>{rate}%</span></td></tr>);})}
            </tbody></table>
          </div>}
        </div>

        {/* ── Waitlist ── */}
        {(()=>{const totalVacant=props.reduce((s,p)=>s+allRooms(p).filter(r=>r.st==="vacant").length,0);
          if(totalVacant>0)return null;
          const waitlistApps=activeApps.filter(a=>["pre-screened","called","invited"].includes(a.status)).sort((a,b)=>getScore(b)-getScore(a));
          return waitlistApps.length>0?<div style={{marginTop:16,border:"2px solid rgba(212,168,83,.2)",borderRadius:12,padding:16,background:"rgba(212,168,83,.03)"}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>📋 Waitlist — No Vacancies</div>
            <div style={{fontSize:10,color:"#999",marginBottom:10}}>All rooms are full. These applicants are ranked by score and ready when a room opens.</div>
            {waitlistApps.map((a,i)=><div key={a.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"app",data:a})}>
              <div style={{width:20,fontSize:11,fontWeight:700,color:"#d4a853"}}>#{i+1}</div>
              <div className="row-i"><div className="row-t">{a.name} <span style={{fontSize:9,color:"#999"}}>Score: {getScore(a)}</span></div><div className="row-s">{a.property||"No pref"} · {SL[a.status]} · {a.source||""}</div></div>
            </div>)}
          </div>:null;
        })()}

        {/* ── Screening Questions Editor ── */}
        <div style={{marginTop:16,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,screenEditor:!p.screenEditor}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.screenEditor?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>📋 Pre-Screen Questions</div><div style={{fontSize:9,color:"#999"}}>{screenQs.length} questions · Edit what prospects answer before applying</div></div></div>
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
            {screenQs.length===0&&<div style={{textAlign:"center",padding:24,color:"#999"}}><p style={{fontSize:12,marginBottom:8}}>No screening questions configured.</p><button className="btn btn-gold" onClick={()=>setScreenQs([
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
                    {i>0&&<button style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#999"}} onClick={()=>{const n=[...screenQs];[n[i-1],n[i]]=[n[i],n[i-1]];setScreenQs(n);}}>▲</button>}
                    {i<screenQs.length-1&&<button style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#999"}} onClick={()=>{const n=[...screenQs];[n[i],n[i+1]]=[n[i+1],n[i]];setScreenQs(n);}}>▼</button>}
                  </div>
                  <div style={{flex:1}}>
                    <textarea value={q.q} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,q:e.target.value}:x))} rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:12,fontFamily:"inherit",resize:"vertical"}}/>
                  </div>
                  <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:14,marginTop:4}} onClick={()=>setScreenQs(p=>p.filter((_,j)=>j!==i))}>✕</button>
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",fontSize:11}}>
                  <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}><input type="checkbox" checked={q.required} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,required:e.target.checked}:x))}/> Required</label>
                  <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}><input type="checkbox" checked={q.active} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,active:e.target.checked}:x))}/> Active</label>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#999"}}>Type:</span><select value={q.type||"yes-no"} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,type:e.target.value}:x))} style={{padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="yes-no">Yes / No</option><option value="text">Text</option><option value="number">Number</option></select></div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#999"}}>Pass:</span><select value={q.pass||"Yes"} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,pass:e.target.value}:x))} style={{padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="Yes">Yes</option><option value="No">No</option><option value="">Any</option></select></div>
                  {(q.type==="text"||q.type==="number")&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#999"}}>Min chars:</span><input type="number" value={q.minChars||0} onChange={e=>setScreenQs(p=>p.map((x,j)=>j===i?{...x,minChars:Number(e.target.value)}:x))} style={{width:50,padding:"3px 6px",borderRadius:4,border:"1px solid rgba(0,0,0,.06)",fontSize:10}}/></div>}
                </div>
              </div>
            ))}
            {screenQs.length>0&&<button className="btn btn-out" style={{width:"100%",marginTop:8}} onClick={()=>setScreenQs(p=>[...p,{id:uid(),q:"New question...",pass:"Yes",required:true,minChars:0,active:true,type:"yes-no"}])}>+ Add Question</button>}
            {screenQs.length>0&&<div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="btn btn-green" style={{flex:1}} onClick={()=>{save("hq-screen-qs",screenQs);setNotifs(p=>[{id:uid(),type:"app",msg:`Pre-screen questions published (${screenQs.filter(q=>q.active).length} active)`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);showAlert({title:"Published!",body:"Pre-screen questions saved and published. The public site will use these questions immediately."});}}> 🚀 Save &amp; Publish to Site</button>
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
            <div style={{fontSize:9,color:"#999",marginTop:8,textAlign:"center"}}>Saves to Supabase · Click "Save & Publish" to push changes live</div>
          </div>}
        </div>

        {/* ── Pre-Screen Preview ── */}
        {screenQs.length>0&&<div style={{marginTop:8,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,screenPreview:!p.screenPreview}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.screenPreview?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>👁 Pre-Screen Preview</div><div style={{fontSize:9,color:"#999"}}>See what tenants see on the public site</div></div></div>
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
                      </>:<div style={{width:"100%"}}><input placeholder="Type your answer..." style={{width:"100%",padding:"12px 14px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"rgba(255,255,255,.05)",color:"#f5f0e8",fontSize:13,fontFamily:"inherit"}}/><button onClick={()=>answerPreview("Yes")} style={{marginTop:8,width:"100%",padding:"10px",borderRadius:8,border:"none",background:"#d4a853",color:"#1a1714",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Next →</button></div>}
                    </div>
                  </>}
                  {prevResult==="pass"&&<div style={{textAlign:"center"}}><div style={{width:56,height:56,borderRadius:"50%",background:"rgba(74,124,89,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26,color:"#4a7c59"}}>✓</div><div style={{fontSize:18,fontWeight:700,color:"#f5f0e8",marginBottom:6}}>You Pre-Qualify!</div><div style={{fontSize:12,color:"rgba(196,168,130,.6)",marginBottom:16}}>This is where they fill out the contact form.</div><button onClick={resetPreview} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#d4a853",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Preview Again</button></div>}
                  {prevResult==="fail"&&<div style={{textAlign:"center"}}><div style={{width:56,height:56,borderRadius:"50%",background:"rgba(196,92,74,.12)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26,color:"#c45c4a"}}>✕</div><div style={{fontSize:18,fontWeight:700,color:"#f5f0e8",marginBottom:6}}>Didn't Qualify</div><div style={{fontSize:12,color:"rgba(196,168,130,.6)",marginBottom:16}}>This is what they see when they fail a question.</div><button onClick={resetPreview} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#d4a853",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Preview Again</button></div>}
                </div>
                <div style={{textAlign:"center",marginTop:10,fontSize:9,color:"rgba(196,168,130,.3)"}}>Preview only — this is how it appears on rentblackbear.com</div>
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
                <div style={{fontSize:13,fontWeight:700}}>📝 Pre-Screen Contact Form</div>
                <div style={{fontSize:9,color:"#999"}}>Heading, subtext, and "How did you hear about us?" options</div>
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
                "How did you hear about us?" Options
                <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setSettings(s=>({...s,screenForm:{...(s.screenForm||DEF_SETTINGS.screenForm),sources:[...(s.screenForm||DEF_SETTINGS.screenForm).sources,"New Option"]}}))}>+ Add</button>
              </label>
              <div style={{fontSize:9,color:"#999",marginBottom:6}}>⠿ drag to reorder · click to edit · ✕ to remove</div>
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
                    <span style={{color:"#ccc",fontSize:13,flexShrink:0,cursor:"grab"}}>⠿</span>
                    <input value={src} style={{flex:1,border:"none",background:"transparent",fontFamily:"inherit",fontSize:12,outline:"none",padding:0}}
                      onChange={e=>{const sources=[...sf.sources];sources[i]=e.target.value;setSettings(s=>({...s,screenForm:{...sf,sources}}));}}/>
                    <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:13,padding:"0 2px",lineHeight:1,flexShrink:0}} onClick={()=>{const sources=sf.sources.filter((_,j)=>j!==i);setSettings(s=>({...s,screenForm:{...sf,sources}}));}}>✕</button>
                  </div>);
                })}
              </div>
              <div style={{fontSize:9,color:"#999",marginTop:6}}>"Other" should stay last — it triggers a free-text field.</div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="btn btn-green" style={{flex:1}} onClick={()=>{save("hq-settings",settings);save("hq-screen-form",settings.screenForm||DEF_SETTINGS.screenForm);setNotifs(p=>[{id:uid(),type:"app",msg:"Pre-screen form settings saved",date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);}}>🚀 Save & Publish</button>
            </div>
            <div style={{fontSize:9,color:"#999",marginTop:6,textAlign:"center"}}>Changes apply immediately on the public site</div>
          </div>}
        </div>


        {/* ── Application Fields Editor ── */}
        <div style={{marginTop:8,border:"1px solid rgba(0,0,0,.06)",borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,.02)",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,appFieldsEditor:!p.appFieldsEditor}))}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.appFieldsEditor?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>📝 Application Fields</div><div style={{fontSize:9,color:"#999"}}>{appFields.length} fields across {[...new Set(appFields.map(f=>f.section))].length} sections · Drives the entire /apply form</div></div></div>
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
              {appFields.length===0&&<div style={{textAlign:"center",padding:28,color:"#999"}}>
                <div style={{fontSize:36,marginBottom:8}}>📝</div>
                <p style={{fontSize:12,marginBottom:12}}>No fields configured yet. Load the defaults to get started — you can customize everything.</p>
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
                    <span style={{fontSize:9,color:"#999",whiteSpace:"nowrap"}}>{sFields.length} field{sFields.length!==1?"s":""}</span>
                    <button className="btn btn-gold btn-sm" style={{fontSize:9,padding:"2px 9px"}} onClick={()=>addFieldToSection(sec)}>+ Field</button>
                    <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 9px",color:"#d4a853",borderColor:"rgba(212,168,83,.35)"}} title="Duplicate this entire section" onClick={()=>duplicateSection(sec)}>⧉ Duplicate</button>
                    {sections.length>1&&<button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:12,padding:"0 2px"}} onClick={()=>deleteSection(sec)}>🗑</button>}
                  </div>
                  {/* Fields in this section */}
                  {sFields.length===0&&<div style={{padding:"10px 14px",fontSize:11,color:"#bbb",fontStyle:"italic"}}>No fields — click + Field above</div>}
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
                        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#bbb",padding:"0 1px",flexShrink:0}} onClick={()=>toggleFieldExpand(f.id)}>{isExp?"▾":"▸"}</button>
                        <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:13,lineHeight:1,padding:"0 1px",flexShrink:0}} onClick={()=>deleteField(gi)}>✕</button>
                      </div>
                      {/* Expanded detail panel */}
                      {isExp&&<div style={{padding:"12px 14px 14px",background:"rgba(0,0,0,.012)",borderTop:"1px solid rgba(0,0,0,.04)"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Placeholder Text</div><input value={f.placeholder||""} onChange={e=>updateField(gi,"placeholder",e.target.value)} placeholder="e.g. Enter your name..." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/></div>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Help Text (shows below field)</div><input value={f.helpText||""} onChange={e=>updateField(gi,"helpText",e.target.value)} placeholder="e.g. We'll never share this." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/></div>
                        </div>
                        {f.type==="dropdown"&&<div style={{marginBottom:8}}><div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Dropdown Options (one per line)</div><textarea value={(f.options||[]).join(", ")} onChange={e=>updateField(gi,"options",e.target.value.split("\n"))} rows={3} placeholder={"Option 1\nOption 2\nOption 3"} style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/></div>}
                        {f.type==="yes-no"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#4a7c59",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Follow-up if "Yes"</div><input value={f.followUpYes||""} onChange={e=>updateField(gi,"followUpYes",e.target.value)} placeholder="e.g. Please explain..." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(74,124,89,.2)",fontSize:11,fontFamily:"inherit"}}/></div>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#c45c4a",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Follow-up if "No"</div><input value={f.followUpNo||""} onChange={e=>updateField(gi,"followUpNo",e.target.value)} placeholder="e.g. Please explain..." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(196,92,74,.2)",fontSize:11,fontFamily:"inherit"}}/></div>
                        </div>}
                        {(f.type==="number"||f.type==="counter")&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Min Value</div><input type="number" value={f.min||""} onChange={e=>updateField(gi,"min",e.target.value?Number(e.target.value):null)} placeholder="0" style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/></div>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Max Value</div><input type="number" value={f.max||""} onChange={e=>updateField(gi,"max",e.target.value?Number(e.target.value):null)} placeholder="99" style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/></div>
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
                    setNotifs(p=>[{id:uid(),type:"app",msg:"Application form published — "+appFields.filter(f=>f.active).length+" fields across "+sections.length+" sections",date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
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
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.appPreview?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>📱 Application Preview</div><div style={{fontSize:9,color:"#999"}}>Live preview — reflects your current fields exactly</div></div></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {expanded.appPreview&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={e=>{e.stopPropagation();setExpanded(p=>({...p,appPrevSec:0}));}}>↺ Restart</button>}
              <span style={{fontSize:10,color:"#999"}}>{[...new Set(appFields.filter(f=>f.active).map(f=>f.section))].length} sections · {appFields.filter(f=>f.active).length} fields</span>
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
                {(f.type==="text"||f.type==="email"||f.type==="phone")&&<div style={{...inStyle,color:"rgba(196,168,130,.35)",pointerEvents:"none"}}>{f.placeholder||"..."}</div>}
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
                  <div style={{width:36,height:36,borderRadius:"50%",border:"1px solid rgba(196,168,130,.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(196,168,130,.4)",fontSize:20}}>−</div>
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
                      {isLast?"Submit Application →":"Continue →"}
                    </button>
                    {curSecIdx>0&&<button onClick={()=>setExpanded(p=>({...p,appPrevSec:(p.appPrevSec||0)-1}))} style={{width:"100%",padding:"11px",background:"transparent",border:"none",fontSize:12,color:"rgba(196,168,130,.4)",cursor:"pointer",fontFamily:"inherit",marginTop:4}}>← Back</button>}
                  </div>
                </>}
                {isDone&&<div style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:28,border:"1px solid rgba(255,255,255,.07)",textAlign:"center"}}>
                  <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(74,124,89,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26,color:"#4a7c59"}}>✓</div>
                  <div style={{fontSize:18,fontWeight:700,color:"#f5f0e8",marginBottom:6}}>Application Submitted!</div>
                  <div style={{fontSize:12,color:"rgba(196,168,130,.55)",marginBottom:20}}>This is the final screen tenants see after completing all sections.</div>
                  <button onClick={reset} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(196,168,130,.2)",background:"transparent",color:"#d4a853",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Preview Again</button>
                </div>}
                <div style={{textAlign:"center",marginTop:10,fontSize:9,color:"rgba(196,168,130,.25)"}}>Preview only — rentblackbear.com/apply</div>
              </div>
            </div>);
          })()}
        </div>}
      </>);})()}
      {tab==="maintenance"&&<>
        <div className="sec-hd"><div><h2>Maintenance Requests</h2><p>{m.openMaint} open</p></div>
          <button className="btn btn-gold" onClick={()=>setMaint(p=>[{id:uid(),roomId:"",propId:"",tenant:"",title:"New Request",desc:"",status:"open",priority:"medium",created:TODAY.toISOString().split("T")[0],photos:0},...p])}>+ New Request</button></div>
        {["open","in-progress","resolved"].map(status=>{
          const items=maint.filter(x=>x.status===status);if(items.length===0&&status==="resolved")return null;
          const labels={open:"Open","in-progress":"In Progress",resolved:"Resolved"};
          const colors={open:"b-red","in-progress":"b-gold",resolved:"b-green"};
          return(<div key={status} style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{labels[status]} ({items.length})</div>
            {items.map(req=>(
              <div key={req.id} className="row">
                <div className="row-dot" style={{background:status==="open"?"#c45c4a":status==="in-progress"?"#d4a853":"#4a7c59"}}/>
                <div className="row-i">
                  <div className="row-t">{req.title}</div>
                  <div className="row-s">{req.tenant} · {req.created}{req.photos>0?` · ${req.photos} photo${req.photos>1?"s":""}`:""}</div>
                </div>
                <span className={`badge ${colors[status]}`}>{labels[status]}</span>
                <select value={req.status} onChange={e=>setMaint(p=>p.map(x=>x.id===req.id?{...x,status:e.target.value}:x))} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:10,fontFamily:"inherit"}}>
                  <option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option>
                </select>
              </div>
            ))}
          </div>);
        })}


      </>}

      {/* ═══ LEASES & DOCS ═══ */}
      {tab==="leases"&&(()=>{

        const template=leaseTemplate||{name:"Alabama Room Rental Agreement",landlordName:"Carolina Cooper",company:"Black Bear Properties",landlordEmail:"info@rentblackbear.com",sections:DEF_LEASE_SECTIONS};

        const statusColors={draft:{bg:"rgba(0,0,0,.06)",tx:"#666",label:"Draft"},pending_landlord:{bg:"rgba(212,168,83,.1)",tx:"#9a7422",label:"Awaiting Your Signature"},pending_tenant:{bg:"rgba(59,130,246,.1)",tx:"#1d4ed8",label:"Sent to Tenant"},executed:{bg:"rgba(74,124,89,.1)",tx:"#2d6a3f",label:"Executed"},};

        const openCreateLease=(app)=>{
          // Auto-fill from application if provided
          // Prefer termRoomId (ID-based) over room name match for reliability
          const prop=app?props.find(p=>p.id===app.termPropId||p.name===app.property):null;
          const room=prop?(app?.termRoomId?allRooms(prop).find(r=>r.id===app.termRoomId):allRooms(prop).find(r=>r.name===app.room)):null;
          // Find the unit this room belongs to for utils/clean
          const unit=prop?(prop.units||[]).find(u=>(u.rooms||[]).some(r=>r.id===room?.id)):null;
          const rent=app?.termRent||room?.rent||0;
          const mi=app?.termMoveIn||app?.moveIn||"";
          const miD=mi?new Date(mi+"T00:00:00"):null;
          const day=miD?miD.getDate():1;
          const daysLeft=miD?new Date(miD.getFullYear(),miD.getMonth()+1,0).getDate()-day+1:0;
          const proratedRent=day===1?0:Math.ceil((rent/30)*daysLeft);
          const leaseEndD=mi?new Date(mi+"T00:00:00"):new Date();
          leaseEndD.setFullYear(leaseEndD.getFullYear()+1);
          const utilitiesMode=unit?.utils||prop?.utils||"allIncluded";
          const utilTmpl=(settings.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===utilitiesMode);
          const utilitiesClause=utilTmpl?.clause||"See lease for utility terms.";
          setLeaseForm({
            id:null,
            applicationId:app?.id||null,
            status:"draft",
            tenantName:app?.name||"",tenantEmail:app?.email||"",tenantPhone:app?.phone||"",
            property:app?.property||"",room:app?.room||"",
            roomId:room?.id||app?.termRoomId||"",
            unitId:unit?.id||app?.termUnitId||"",
            unitName:unit?.name||app?.termUnitName||"",
            propertyAddress:prop?.addr||"",
            rent,sd:app?.termSD||rent,proratedRent,
            moveIn:mi,leaseStart:mi,
            leaseEnd:leaseEndD.toISOString().split("T")[0],
            leaseType:"fixed",
            utilitiesMode,utilitiesClause,
            parking:room?.parking||"",
            doorCode:app?.applicationData?.doorCode||app?.passcode||"",
            landlordName:template.landlordName||"Carolina Cooper",
            company:template.company||"Black Bear Properties",
            landlordEmail:template.landlordEmail||"info@rentblackbear.com",
            agreementDate:TODAY.toISOString().split("T")[0],
            sections:template.sections,
            addenda:[],
            notes:"",
          });
        };

        const saveDraft=()=>{
          if(!leaseForm)return;
          const now=TODAY.toISOString().split("T")[0];
          const rentWords=leaseForm.rent?numberToWords(leaseForm.rent):"";
          const vars={
            MONTHLY_RENT:leaseForm.rent?.toLocaleString()||"",
            RENT_WORDS:rentWords,
            DAILY_RATE:leaseForm.rent?Math.ceil(leaseForm.rent/30):"",
            SECURITY_DEPOSIT:leaseForm.sd?.toLocaleString()||"",
            PRORATED_RENT:leaseForm.proratedRent?.toLocaleString()||"0",
            LEASE_START:fmtD(leaseForm.leaseStart),
            LEASE_END:fmtD(leaseForm.leaseEnd),
            PROPERTY_ADDRESS:leaseForm.propertyAddress||leaseForm.property||"",
            PARKING_SPACE:leaseForm.parking||"See property map",
            DOOR_CODE:leaseForm.doorCode||"Assigned at move-in",
            UTILITIES_CLAUSE:leaseForm.utilitiesClause||"",
            LANDLORD_NAME:leaseForm.landlordName||"Carolina Cooper",
          };
          const newLease={
            ...leaseForm,
            id:leaseForm.id||uid(),
            variables:vars,
            updatedAt:now,
            createdAt:leaseForm.createdAt||now,
          };
          setLeases(p=>{const exists=p.find(l=>l.id===newLease.id);const updated=exists?p.map(l=>l.id===newLease.id?newLease:l):[...p,newLease];save("hq-leases",updated);return updated;});
          setLeaseForm(null);
          setLeaseSubTab("active");
        };

        const signAndSend=async(leaseId)=>{
          // You sign first, then send to tenant
          const now=new Date().toISOString();
          const token=uid()+uid();
          const link=`${settings.siteUrl||"https://rentblackbear.com"}/lease?token=${token}`;
          setLeases(p=>{const updated=p.map(l=>l.id===leaseId?{...l,status:"pending_tenant",landlordSignedAt:now,signingToken:token,signingLink:link}:l);save("hq-leases",updated);return updated;});
          setNotifs(p=>[{id:uid(),type:"lease",msg:`Lease sent to tenant for signing — ${link}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
          setModal({type:"leaseSent",link});
        };

        const deleteLease=id=>{setLeases(p=>{const updated=p.filter(l=>l.id!==id);save("hq-leases",updated);return updated;});};

        return(<>
        <div className="sec-hd" style={{marginBottom:16}}>
          <div>
            <h2>Leases & Docs</h2>
            <p>Create, send, and manage lease agreements · Drawn e-signatures · Auto-filled from applications</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-out btn-sm" onClick={()=>{setLeaseSubTab("template");}}>⚙ Template</button>
            <button className="btn btn-gold" onClick={()=>openCreateLease(null)}>+ New Lease</button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div style={{display:"flex",gap:6,marginBottom:16,borderBottom:"1px solid rgba(0,0,0,.06)",paddingBottom:12}}>
          {[["active","📄 Active Leases"],["template","⚙ Template Editor"]].map(([id,label])=>(
            <button key={id} onClick={()=>setLeaseSubTab(id)}
              style={{padding:"6px 14px",borderRadius:7,border:"none",background:leaseSubTab===id?"#1a1714":"transparent",color:leaseSubTab===id?"#f5f0e8":"#999",fontWeight:leaseSubTab===id?700:500,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
              {label}
            </button>
          ))}
        </div>

        {/* Active Leases list */}
        {leaseSubTab==="active"&&<>
          {/* Quick-create from approved apps */}
          {apps.filter(a=>["approved","onboarding"].includes(a.status)&&!leases.find(l=>l.applicationId===a.id)).length>0&&(
            <div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.2)",borderRadius:10,padding:12,marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#9a7422",marginBottom:8}}>⚡ Ready to lease — approved applicants without a lease</div>
              {apps.filter(a=>["approved","onboarding"].includes(a.status)&&!leases.find(l=>l.applicationId===a.id)).map(a=>(
                <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(212,168,83,.1)"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:600}}>{a.name}</div>
                    <div style={{fontSize:10,color:"#999"}}>{a.property} · {a.room} · {a.termMoveIn||a.moveIn||"move-in TBD"}</div>
                  </div>
                  <button className="btn btn-gold btn-sm" onClick={()=>openCreateLease(a)}>Create Lease →</button>
                </div>
              ))}
            </div>
          )}

          {leases.length===0&&!leaseForm&&<div style={{textAlign:"center",padding:48,color:"#999"}}>
            <div style={{fontSize:40,marginBottom:12}}>📝</div>
            <h3 style={{fontSize:15,marginBottom:6}}>No leases yet</h3>
            <p style={{fontSize:12,marginBottom:16}}>Create your first lease from an approved application or manually.</p>
            <button className="btn btn-gold" onClick={()=>openCreateLease(null)}>+ Create Lease</button>
          </div>}

          {leases.map(l=>{
            const sc=statusColors[l.status]||statusColors.draft;
            const isExec=l.status==="executed";
            return(
            <div key={l.id} className="card" style={{marginBottom:10,borderLeft:`3px solid ${isExec?"#4a7c59":"#d4a853"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"14px 16px"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{fontSize:14,fontWeight:700}}>{l.tenantName||"—"}</div>
                    <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:99,background:sc.bg,color:sc.tx,textTransform:"uppercase",letterSpacing:.5}}>{sc.label}</span>
                  </div>
                  <div style={{fontSize:11,color:"#999"}}>{l.property} · {l.room} · {fmtS(l.rent||0)}/mo · Move-in {fmtD(l.moveIn)}</div>
                  {l.signingLink&&<div style={{fontSize:10,color:"#3b82f6",marginTop:4,wordBreak:"break-all"}}>🔗 {l.signingLink}</div>}
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:12}}>
                  {l.status==="draft"&&<>
                    <button className="btn btn-out btn-sm" onClick={()=>setLeaseForm({...l})}>✏ Edit</button>
                    <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"signLease",leaseId:l.id,lease:l})}>✍ Sign & Send</button>
                  </>}
                  {l.status==="pending_tenant"&&<>
                    <button className="btn btn-out btn-sm" onClick={()=>{navigator.clipboard.writeText(l.signingLink||"");showAlert({title:"Copied",body:"Signing link copied to clipboard."});}}>📋 Copy Link</button>
                  </>}
                  {l.status==="executed"&&<>
                    <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"viewLease",lease:l})}>👁 View</button>
                  </>}
                  <button className="btn btn-out btn-sm" style={{color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>confirmAction(`Delete lease for ${l.tenantName}?`,()=>deleteLease(l.id))}>✕</button>
                </div>
              </div>
            </div>);
          })}
        </>}

        {/* Template Editor */}
        {leaseSubTab==="template"&&<>
          <div className="card" style={{padding:16,marginBottom:14}}>
            <h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Default Lease Template Settings</h3>
            <div className="fr">
              <div className="fld"><label>Property Manager Name (on lease)</label>
                <input value={template.landlordName||""} onChange={e=>setLeaseTemplate(p=>({...(p||template),landlordName:e.target.value}))} placeholder="Carolina Cooper"/>
              </div>
              <div className="fld"><label>Company Name</label>
                <input value={template.company||""} onChange={e=>setLeaseTemplate(p=>({...(p||template),company:e.target.value}))} placeholder="Black Bear Properties"/>
              </div>
            </div>
            <div className="fld"><label>Landlord Email</label>
              <input type="email" value={template.landlordEmail||""} onChange={e=>setLeaseTemplate(p=>({...(p||template),landlordEmail:e.target.value}))} placeholder="info@rentblackbear.com"/>
            </div>
            <div style={{fontSize:10,color:"#999",marginTop:8}}>These defaults auto-fill every new lease. You can override per-lease in the lease editor.</div>
          </div>

          <div style={{fontSize:12,fontWeight:700,color:"#5c4a3a",marginBottom:10}}>Lease Sections — toggle active, require initials, edit content</div>
          {(template.sections||DEF_LEASE_SECTIONS).map((sec,si)=>(
            <div key={sec.id} className="card" style={{marginBottom:8,borderLeft:`3px solid ${sec.active!==false?"#d4a853":"rgba(0,0,0,.1)"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,["lsec_"+sec.id]:!p["lsec_"+sec.id]}))}>
                <span style={{fontSize:11,color:expanded["lsec_"+sec.id]?"#d4a853":"#999"}}>{expanded["lsec_"+sec.id]?"▾":"▸"}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,opacity:sec.active===false?.45:1}}>{sec.title}</div>
                  <div style={{fontSize:9,color:"#999"}}>{sec.requiresInitials?"Initials required":"No initials"} · {sec.active===false?"Hidden":"Active"}</div>
                </div>
                <div style={{display:"flex",gap:6}} onClick={e=>e.stopPropagation()}>
                  <label style={{display:"flex",alignItems:"center",gap:4,fontSize:10,cursor:"pointer"}}>
                    <input type="checkbox" checked={sec.active!==false} onChange={e=>{const secs=[...(template.sections||DEF_LEASE_SECTIONS)];secs[si]={...secs[si],active:e.target.checked};setLeaseTemplate(p=>({...(p||template),sections:secs}));}}/>Active
                  </label>
                  <label style={{display:"flex",alignItems:"center",gap:4,fontSize:10,cursor:"pointer"}}>
                    <input type="checkbox" checked={!!sec.requiresInitials} onChange={e=>{const secs=[...(template.sections||DEF_LEASE_SECTIONS)];secs[si]={...secs[si],requiresInitials:e.target.checked};setLeaseTemplate(p=>({...(p||template),sections:secs}));}}/>Initials
                  </label>
                </div>
              </div>
              {expanded["lsec_"+sec.id]&&<div style={{padding:"0 14px 14px"}}>
                <div className="fld" style={{marginBottom:8}}><label>Section Title</label>
                  <input value={sec.title} onChange={e=>{const secs=[...(template.sections||DEF_LEASE_SECTIONS)];secs[si]={...secs[si],title:e.target.value};setLeaseTemplate(p=>({...(p||template),sections:secs}));}}/>
                </div>
                <div className="fld" style={{marginBottom:0}}><label>Content (HTML + {"{{VARIABLES}}"} supported)</label>
                  <textarea value={sec.content||""} rows={5} onChange={e=>{const secs=[...(template.sections||DEF_LEASE_SECTIONS)];secs[si]={...secs[si],content:e.target.value};setLeaseTemplate(p=>({...(p||template),sections:secs}));}} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"monospace",resize:"vertical"}}/>
                </div>
                <div style={{fontSize:9,color:"#bbb",marginTop:4}}>Variables: {"{{MONTHLY_RENT}} {{SECURITY_DEPOSIT}} {{LEASE_START}} {{LEASE_END}} {{PARKING_SPACE}} {{DOOR_CODE}} {{UTILITIES_CLAUSE}} {{LANDLORD_NAME}}"}</div>
              </div>}
            </div>
          ))}
          <button className="btn btn-gold" style={{marginTop:8}} onClick={()=>{save("hq-lease-template",template||{name:"Alabama Room Rental Agreement",landlordName:"Carolina Cooper",company:"Black Bear Properties",sections:DEF_LEASE_SECTIONS});showAlert({title:"Template Saved",body:"Lease template saved successfully."});}}>💾 Save Template</button>
        </>}

        {/* Lease Form Modal */}
        {leaseForm&&<div className="mbg" onClick={()=>setLeaseForm(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:660,maxHeight:"90vh",overflowY:"auto"}}>
          <h2>{leaseForm.id?"Edit Lease":"Create New Lease"}</h2>
          <div style={{fontSize:11,color:"#999",marginBottom:14}}>All fields auto-populate from the application or property settings. Edit anything before saving.</div>

          <div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.15)",borderRadius:10,padding:12,marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#9a7422",marginBottom:8}}>PARTIES</div>
            <div className="fr">
              <div className="fld"><label>Tenant Name</label><input value={leaseForm.tenantName||""} onChange={e=>setLeaseForm(p=>({...p,tenantName:e.target.value}))}/></div>
              <div className="fld"><label>Tenant Email</label><input type="email" value={leaseForm.tenantEmail||""} onChange={e=>setLeaseForm(p=>({...p,tenantEmail:e.target.value}))}/></div>
            </div>
            <div className="fr">
              <div className="fld"><label>Tenant Phone</label><input value={leaseForm.tenantPhone||""} onChange={e=>setLeaseForm(p=>({...p,tenantPhone:e.target.value}))}/></div>
              <div className="fld"><label>Property Manager (on lease)</label><input value={leaseForm.landlordName||"Carolina Cooper"} onChange={e=>setLeaseForm(p=>({...p,landlordName:e.target.value}))}/></div>
            </div>
          </div>

          <div style={{background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.12)",borderRadius:10,padding:12,marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#2d6a3f",marginBottom:8}}>PROPERTY</div>
            <div className="fr">
              <div className="fld"><label>Property</label>
                <select value={leaseForm.property||""} onChange={e=>{const p2=props.find(p=>p.name===e.target.value);const u0=p2?.units?.[0];const uKey=u0?.utils||"allIncluded";const uClause=(settings.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===uKey)?.clause||"See lease for utility terms.";setLeaseForm(p=>({...p,property:e.target.value,propertyAddress:p2?.addr||"",utilitiesMode:uKey,utilitiesClause:uClause}));}}>
                  <option value="">Select...</option>
                  {props.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="fld"><label>Room / Unit</label>
                <select value={leaseForm.room||""} onChange={e=>{
                  const lp=props.find(p=>p.name===leaseForm.property);
                  if(!lp)return;
                  const items=leaseableItems(lp);
                  const item=items.find(i=>i.name===e.target.value||i.id===e.target.value);
                  if(!item)return;
                  const unit=(lp.units||[]).find(u=>u.id===item.unitId);
                  const uKey=unit?.utils||"allIncluded";
                  const uClause=(settings.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===uKey)?.clause||"See lease for utility terms.";
                  setLeaseForm(p=>({...p,room:item.name,roomId:item.isWholeUnit?"":item.id,unitId:item.unitId||"",unitName:item.unitName||"",rent:item.rent||p.rent,sd:item.rent||p.sd,parking:item.parking||"",utilitiesMode:uKey,utilitiesClause:uClause}));
                }} style={{width:"100%"}}>
                  <option value="">Select...</option>
                  {(()=>{const lp=props.find(p=>p.name===leaseForm.property);if(!lp)return null;
                    return leaseableItems(lp).map(item=>(
                      <option key={item.id} value={item.isWholeUnit?item.id:item.name}>
                        {item.unitLabel&&!item.isWholeUnit?"Unit "+item.unitLabel+" — ":""}{item.name}{item.isWholeUnit?" (Whole Unit)":""} — {fmtS(item.rent)}/mo
                      </option>
                    ));})()}
                </select>
              </div>
            </div>
            <div className="fld"><label>Property Address</label><input value={leaseForm.propertyAddress||""} onChange={e=>setLeaseForm(p=>({...p,propertyAddress:e.target.value}))}/></div>
          </div>

          <div style={{background:"rgba(59,130,246,.04)",border:"1px solid rgba(59,130,246,.12)",borderRadius:10,padding:12,marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#1d4ed8",marginBottom:8}}>LEASE TERMS · Pre-filled from application · Editable</div>
            <div className="fr3">
              <div className="fld"><label>Monthly Rent ($)</label><input type="number" value={leaseForm.rent||""} onChange={e=>{const rent=Number(e.target.value);const mi=leaseForm.moveIn;const day=mi?new Date(mi+"T00:00:00").getDate():1;const daysLeft=mi?new Date(new Date(mi+"T00:00:00").getFullYear(),new Date(mi+"T00:00:00").getMonth()+1,0).getDate()-day+1:0;const prorated=day===1?0:Math.ceil((rent/30)*daysLeft);setLeaseForm(p=>({...p,rent,sd:rent,proratedRent:prorated}));}}/></div>
              <div className="fld"><label>Security Deposit ($)</label><input type="number" value={leaseForm.sd||""} onChange={e=>setLeaseForm(p=>({...p,sd:Number(e.target.value)}))}/></div>
              <div className="fld"><label>Prorated Rent ($)</label><input type="number" value={leaseForm.proratedRent||0} onChange={e=>setLeaseForm(p=>({...p,proratedRent:Number(e.target.value)}))}/></div>
            </div>
            <div className="fr3">
              <div className="fld"><label>Move-in Date</label><input type="date" value={leaseForm.moveIn||""} onChange={e=>{const mi=e.target.value;const rent=leaseForm.rent||0;const miD=new Date(mi+"T00:00:00");const day=miD.getDate();const daysLeft=new Date(miD.getFullYear(),miD.getMonth()+1,0).getDate()-day+1;const prorated=day===1?0:Math.ceil((rent/30)*daysLeft);const leaseEndD=new Date(mi+"T00:00:00");leaseEndD.setFullYear(leaseEndD.getFullYear()+1);setLeaseForm(p=>({...p,moveIn:mi,leaseStart:mi,proratedRent:prorated,leaseEnd:leaseEndD.toISOString().split("T")[0]}));}}/></div>
              <div className="fld"><label>Lease Start</label><input type="date" value={leaseForm.leaseStart||""} onChange={e=>setLeaseForm(p=>({...p,leaseStart:e.target.value}))}/></div>
              <div className="fld"><label>Lease End</label><input type="date" value={leaseForm.leaseEnd||""} onChange={e=>setLeaseForm(p=>({...p,leaseEnd:e.target.value}))}/></div>
            </div>
            <div className="fr">
              <div className="fld"><label>Door Code</label><input value={leaseForm.doorCode||""} onChange={e=>setLeaseForm(p=>({...p,doorCode:e.target.value}))} placeholder="4-digit PIN from application"/></div>
              <div className="fld"><label>Parking Space</label><input value={leaseForm.parking||""} onChange={e=>setLeaseForm(p=>({...p,parking:e.target.value}))} placeholder="e.g. Space A1, Street parking"/></div>
            </div>
            <div className="fld"><label>Utilities Clause</label>
              <textarea value={leaseForm.utilitiesClause||""} onChange={e=>setLeaseForm(p=>({...p,utilitiesClause:e.target.value}))} rows={3} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/>
            </div>
          </div>

          {/* Move-In Package Preview */}
          {(()=>{
            const rent=leaseForm.rent||0;
            const sd=leaseForm.sd||0;
            const mi=leaseForm.moveIn;
            if(!rent||!mi)return null;
            const miD=new Date(mi+"T00:00:00");
            const day=miD.getDate();
            const calDays=new Date(miD.getFullYear(),miD.getMonth()+1,0).getDate();
            const daysLeft=calDays-day+1;
            const dailyRate=Math.ceil(rent/30);
            const isFirstDay=day===1;
            const proratedAmt=isFirstDay?0:Math.ceil(dailyRate*daysLeft);
            const firstMonthAmt=isFirstDay?rent:proratedAmt;
            const total=sd+firstMonthAmt;
            return(
            <div style={{background:"#f9f8f5",border:"2px solid rgba(212,168,83,.25)",borderRadius:12,padding:16,marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:800,color:"#9a7422",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>📄 Move-In Package Preview</div>

              {/* Proration explainer */}
              {!isFirstDay&&<div style={{background:"rgba(212,168,83,.08)",borderRadius:8,padding:10,marginBottom:12,fontSize:11,color:"#5c4a3a",lineHeight:1.6}}>
                <strong>Proration:</strong> {daysLeft} days remaining in {miD.toLocaleString("default",{month:"long"})} · {fmtS(rent)} ÷ 30 = {fmtS(dailyRate)}/day · Prorated total: {fmtS(proratedAmt)}
              </div>}
              {isFirstDay&&<div style={{background:"rgba(74,124,89,.06)",borderRadius:8,padding:10,marginBottom:12,fontSize:11,color:"#2d6a3f"}}>
                ✓ Move-in on the 1st — full month's rent applies, no proration needed
              </div>}

              {/* Package line items */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"#fff",borderRadius:8,border:"1px solid rgba(0,0,0,.06)"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700}}>🔒 Security Deposit</div>
                    <div style={{fontSize:10,color:"#999"}}>Due today — secures the room</div>
                  </div>
                  <div style={{fontSize:15,fontWeight:800,color:"#1a1714"}}>{fmtS(sd)}</div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"#fff",borderRadius:8,border:"1px solid rgba(0,0,0,.06)"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700}}>🏠 {isFirstDay?"First Month's Rent":`Prorated Rent (${daysLeft} days × ${fmtS(dailyRate)})`}</div>
                    <div style={{fontSize:10,color:"#999"}}>Due: {fmtD(mi)}</div>
                  </div>
                  <div style={{fontSize:15,fontWeight:800,color:"#1a1714"}}>{fmtS(firstMonthAmt)}</div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px",background:"#1a1714",borderRadius:8}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#f5f0e8"}}>Total Due at Move-In</div>
                  <div style={{fontSize:18,fontWeight:800,color:"#d4a853"}}>{fmtS(total)}</div>
                </div>
              </div>
            </div>);
          })()}

          <div className="fld"><label>Internal Notes</label><textarea value={leaseForm.notes||""} onChange={e=>setLeaseForm(p=>({...p,notes:e.target.value}))} placeholder="Notes for your records only — not on the lease" rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/></div>

          <div className="mft">
            <button className="btn btn-out" onClick={()=>setLeaseForm(null)}>Cancel</button>
            <button className="btn btn-gold" onClick={saveDraft}>💾 Save Draft</button>
          </div>
        </div></div>}

        {/* Sign & Send modal */}
        {modal?.type==="signLease"&&<div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:500}}>
            <h2>Sign & Send Lease</h2>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:16}}>You sign first as property manager, then the tenant receives a link to countersign.</p>

            {settings.savedSignature&&!modal.landlordSig&&(
              <div style={{background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:10,padding:12,marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#2d6a3f",marginBottom:8}}>USE SAVED SIGNATURE</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <img src={settings.savedSignature} alt="Saved sig" style={{maxHeight:50,border:"1px solid rgba(0,0,0,.08)",borderRadius:6,padding:4,background:"#fff"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600}}>Carolina Cooper</div>
                    <div style={{fontSize:10,color:"#999"}}>Saved signature on file</div>
                  </div>
                  <button className="btn btn-green btn-sm" onClick={()=>{setModal(p=>({...p,landlordSig:settings.savedSignature}));setLeaseSigErr(false);}}>Use This</button>
                </div>
              </div>
            )}

            <div style={{background:"rgba(74,124,89,.06)",borderRadius:10,padding:12,marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#2d6a3f",marginBottom:8}}>
                {modal.landlordSig?"✓ Signature Captured":"Draw Your Signature — "+(modal.lease?.landlordName||"Carolina Cooper")}
              </div>
              {modal.landlordSig
                ?<div>
                  <img src={modal.landlordSig} alt="Your sig" style={{maxHeight:60,maxWidth:"100%",display:"block",marginBottom:8}}/>
                  <button className="btn btn-out btn-sm" onClick={()=>setModal(p=>({...p,landlordSig:null}))}>Re-sign</button>
                </div>
                :<SigCanvas onSave={(data)=>{setModal(p=>({...p,landlordSig:data}));setLeaseSigErr(false);}} height={100}/>
              }
            </div>

            {modal.landlordSig&&<label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,cursor:"pointer",marginBottom:12,padding:"8px 12px",background:"rgba(212,168,83,.06)",borderRadius:8,border:"1px solid rgba(212,168,83,.15)"}}>
              <input type="checkbox" checked={!!modal.saveSignature} onChange={e=>setModal(p=>({...p,saveSignature:e.target.checked}))} style={{width:14,height:14}}/>
              Save this signature for future leases
            </label>}

            {leaseSigErr&&<div style={{color:"#c45c4a",fontSize:12,fontWeight:700,padding:"8px 12px",background:"rgba(196,92,74,.06)",borderRadius:8,marginBottom:12,animation:"shake .4s ease"}}>⚠ Please draw your signature before sending</div>}

            <div className="mft">
              <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={async()=>{
                if(!modal.landlordSig){setLeaseSigErr(true);return;}
                if(modal.saveSignature){setSettings(p=>{const updated={...p,savedSignature:modal.landlordSig};save("hq-settings",updated);return updated;});}
                const now=new Date().toISOString();
                const token=uid()+uid();
                const link=`${settings.siteUrl||"https://rentblackbear.vercel.app"}/lease?token=${token}`;
                setLeases(p=>{const updated=p.map(l=>l.id===modal.leaseId?{...l,status:"pending_tenant",landlordSignature:modal.landlordSig,landlordSignedAt:now,signingToken:token,signingLink:link}:l);save("hq-leases",updated);return updated;});
                setNotifs(p=>[{id:uid(),type:"lease",msg:`✍ Lease signed and sent to ${modal.lease.tenantEmail} — ${modal.lease.tenantName}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
                setModal({type:"leaseSent",lease:modal.lease,link});
              }}>✉ Sign & Send to Tenant</button>
            </div>
          </div></div>}

        {/* Lease sent confirmation */}
        {modal?.type==="leaseSent"&&<div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480,textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>🎉</div>
          <h2>Lease Sent!</h2>
          <p style={{fontSize:13,color:"#5c4a3a",margin:"12px 0 20px",lineHeight:1.6}}>
            The lease has been signed by you and a unique signing link has been generated for {modal.lease?.tenantEmail||"the tenant"}.
          </p>
          <div style={{background:"rgba(0,0,0,.03)",borderRadius:8,padding:"10px 14px",fontSize:11,color:"#5c4a3a",wordBreak:"break-all",marginBottom:16,textAlign:"left"}}>
            <div style={{fontSize:9,fontWeight:700,color:"#999",marginBottom:4}}>TENANT SIGNING LINK</div>
            {modal.link}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button className="btn btn-out" onClick={()=>{navigator.clipboard.writeText(modal.link||"");showAlert({title:"Copied",body:"Link copied to clipboard."});}}>📋 Copy Link</button>
            <button className="btn btn-gold" onClick={()=>setModal(null)}>Done</button>
          </div>
        </div></div>}

        {/* View executed lease */}
        {modal?.type==="viewLease"&&<div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:560,maxHeight:"90vh",overflowY:"auto"}}>
          <h2>Executed Lease</h2>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            <div style={{flex:1,padding:"10px 12px",background:"rgba(74,124,89,.06)",borderRadius:8,fontSize:11}}>
              <div style={{color:"#999",marginBottom:2}}>Tenant</div><strong>{modal.lease.tenantName}</strong>
            </div>
            <div style={{flex:1,padding:"10px 12px",background:"rgba(74,124,89,.06)",borderRadius:8,fontSize:11}}>
              <div style={{color:"#999",marginBottom:2}}>Property</div><strong>{modal.lease.property} · {modal.lease.room}</strong>
            </div>
          </div>
          <div className="tp-card"><h3>📋 Lease Summary</h3>
            <div className="tp-row"><span className="tp-label">Rent</span><strong>{fmtS(modal.lease.rent||0)}/mo</strong></div>
            <div className="tp-row"><span className="tp-label">Security Deposit</span><strong>{fmtS(modal.lease.sd||0)}</strong></div>
            <div className="tp-row"><span className="tp-label">Move-in</span><strong>{fmtD(modal.lease.moveIn)}</strong></div>
            <div className="tp-row"><span className="tp-label">Lease End</span><strong>{fmtD(modal.lease.leaseEnd)}</strong></div>
            <div className="tp-row"><span className="tp-label">Door Code</span><strong>{modal.lease.doorCode||"—"}</strong></div>
            <div className="tp-row"><span className="tp-label">Parking</span><strong>{modal.lease.parking||"—"}</strong></div>
          </div>
          <div className="tp-card" style={{marginTop:10}}><h3>✍ Signatures</h3>
            <div className="tp-row"><span className="tp-label">PM Signed</span><strong style={{color:"#4a7c59"}}>✓ {modal.lease.landlordSignedAt?new Date(modal.lease.landlordSignedAt).toLocaleDateString():"—"}</strong></div>
            <div className="tp-row"><span className="tp-label">Tenant Signed</span><strong style={{color:"#4a7c59"}}>✓ {modal.lease.tenantSignedAt?new Date(modal.lease.tenantSignedAt).toLocaleDateString():"—"}</strong></div>
            <div className="tp-row"><span className="tp-label">Executed</span><strong style={{color:"#4a7c59"}}>{modal.lease.executedAt?new Date(modal.lease.executedAt).toLocaleDateString():"—"}</strong></div>
          </div>
          {modal.lease.tenantSignature&&<div style={{marginTop:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:4}}>TENANT SIGNATURE</div>
            <img src={modal.lease.tenantSignature} alt="Tenant sig" style={{maxHeight:60,border:"1px solid rgba(0,0,0,.06)",borderRadius:6,padding:4,background:"#fff"}}/>
          </div>}
          {modal.lease.landlordSignature&&<div style={{marginTop:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:4}}>PM SIGNATURE</div>
            <img src={modal.lease.landlordSignature} alt="PM sig" style={{maxHeight:60,border:"1px solid rgba(0,0,0,.06)",borderRadius:6,padding:4,background:"#fff"}}/>
          </div>}
          <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Close</button></div>
        </div></div>}

        </>);
      })()}

      {/* ═══ DOCUMENTS ═══ */}
      {tab==="documents"&&<>
        <div className="sec-hd"><div><h2>Documents</h2><p>Leases, addendums, checklists, and templates</p></div>
          <button className="btn btn-gold">+ Upload Document</button></div>
        {["addendum","lease","rules","checklist"].map(type=>{
          const items=docs.filter(d=>d.type===type);if(!items.length)return null;
          const labels={addendum:"📝 Lease Addendums",lease:"📄 Leases & Agreements",rules:"📋 House Rules",checklist:"✅ Checklists"};
          return(<div key={type} style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{labels[type]}</div>
            {items.map(d=><div key={d.id} className="row">
              <span style={{fontSize:16}}>{type==="addendum"?"📝":"📄"}</span>
              <div className="row-i">
                <div className="row-t">{d.name}</div>
                <div className="row-s">{d.property}{d.tenant?` · ${d.tenant}`:""} · {d.uploaded}</div>
              </div>
              {d.content
                ?<button className="btn btn-out btn-sm" onClick={()=>setModal({type:"viewAddendum",doc:d})}>View / Download</button>
                :<button className="btn btn-out btn-sm">View</button>}
            </div>)}
          </div>);
        })}
      </>}

      {/* ═══ ACCOUNTING ═══ */}
      {tab==="accounting"&&<>
        {(()=>{const inc=txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);const exp=txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);return(
          <div className="acct-summary">
            <div className="acct-card"><div className="kl">💰 Income</div><div className="kv kg">{fmtS(inc)}</div></div>
            <div className="acct-card"><div className="kl">💸 Expenses</div><div className="kv kb">{fmtS(exp)}</div></div>
            <div className="acct-card"><div className="kl">📊 Net</div><div className="kv" style={{color:inc-exp>=0?"#4a7c59":"#c45c4a"}}>{fmtS(inc-exp)}</div></div>
          </div>);
        })()}

        {/* ── Tenant Ledgers ── */}
        {(()=>{
          const tenantRooms=occLeases.map(r=>({...r,propName:r.propName,unitId:r.unitId,unitName:r.unitName,unitLabel:r.unitLabel,propUtils:r.propUtils}));
          const selRoom=ledgerTenant!=="all"?tenantRooms.find(r=>r.id===ledgerTenant):null;

          // Build ledger entries from charges: each charge = debit, each payment = credit
          const buildLedger=(roomId)=>{
            const roomCharges=charges.filter(c=>roomId==="all"||c.roomId===roomId)
              .sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
            const entries=[];
            roomCharges.forEach(c=>{
              // Debit: charge posted
              entries.push({id:c.id+"-d",date:c.createdDate||c.dueDate,desc:c.desc,category:c.category,type:"debit",amount:c.amount,tenant:c.tenantName,property:c.propName,room:c.roomName,chargeId:c.id,status:chargeStatus(c)});
              // Credits: payments received
              (c.payments||[]).forEach(p=>{
                entries.push({id:p.id,date:p.date,desc:`Payment — ${p.method}${p.notes?` (${p.notes})`:""}`,category:"Payment",type:"credit",amount:p.amount,tenant:c.tenantName,property:c.propName,room:c.roomName,chargeId:c.id});
              });
            });
            // Sort by date then debit before credit on same day
            entries.sort((a,b)=>{const d=new Date(a.date)-new Date(b.date);if(d!==0)return d;return a.type==="debit"?-1:1;});
            // Compute running balance
            let bal=0;
            return entries.map(e=>{bal+=e.type==="debit"?e.amount:-e.amount;return{...e,balance:bal};});
          };

          const entries=buildLedger(ledgerTenant);
          const totalDebits=entries.filter(e=>e.type==="debit").reduce((s,e)=>s+e.amount,0);
          const totalCredits=entries.filter(e=>e.type==="credit").reduce((s,e)=>s+e.amount,0);
          const runningBalance=totalDebits-totalCredits;

          return(<>
            <div className="sec-hd" style={{marginTop:20}}>
              <div><h2>📒 Tenant Ledger</h2><p style={{fontSize:10,color:"#999"}}>Charges (debits) and payments (credits) — professional double-entry view</p></div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <select value={ledgerTenant} onChange={e=>setLedgerTenant(e.target.value)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}>
                  <option value="all">All Tenants</option>
                  {tenantRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} — {r.propName}{r.unitLabel?" Unit "+r.unitLabel:""} {r.name}</option>)}
                </select>
                <button className="btn btn-out btn-sm" onClick={()=>window.print()}>🖨 Print</button>
              </div>
            </div>

            {/* Summary strip */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
              <div style={{background:"rgba(196,92,74,.04)",borderRadius:8,padding:10,textAlign:"center",border:"1px solid rgba(196,92,74,.08)"}}><div style={{fontSize:8,color:"#c45c4a",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Total Charged</div><div style={{fontSize:18,fontWeight:800,color:"#c45c4a"}}>{fmtS(totalDebits)}</div></div>
              <div style={{background:"rgba(74,124,89,.04)",borderRadius:8,padding:10,textAlign:"center",border:"1px solid rgba(74,124,89,.08)"}}><div style={{fontSize:8,color:"#4a7c59",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Total Paid</div><div style={{fontSize:18,fontWeight:800,color:"#4a7c59"}}>{fmtS(totalCredits)}</div></div>
              <div style={{background:runningBalance>0?"rgba(196,92,74,.04)":"rgba(74,124,89,.04)",borderRadius:8,padding:10,textAlign:"center",border:`1px solid ${runningBalance>0?"rgba(196,92,74,.08)":"rgba(74,124,89,.08)"}`}}><div style={{fontSize:8,color:runningBalance>0?"#c45c4a":"#4a7c59",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Balance Due</div><div style={{fontSize:18,fontWeight:800,color:runningBalance>0?"#c45c4a":"#4a7c59"}}>{fmtS(runningBalance)}</div></div>
              <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:10,textAlign:"center",border:"1px solid rgba(0,0,0,.04)"}}><div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Entries</div><div style={{fontSize:18,fontWeight:800}}>{entries.length}</div></div>
            </div>

            {/* Ledger table */}
            <div className="card"><div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                    <th style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,whiteSpace:"nowrap"}}>Date</th>
                    {ledgerTenant==="all"&&<th style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8}}>Tenant</th>}
                    <th style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8}}>Description</th>
                    <th style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8}}>Category</th>
                    <th style={{padding:"9px 12px",textAlign:"right",fontSize:9,fontWeight:700,color:"#c45c4a",textTransform:"uppercase",letterSpacing:.8}}>Debit (Charge)</th>
                    <th style={{padding:"9px 12px",textAlign:"right",fontSize:9,fontWeight:700,color:"#4a7c59",textTransform:"uppercase",letterSpacing:.8}}>Credit (Payment)</th>
                    <th style={{padding:"9px 12px",textAlign:"right",fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8}}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length===0&&<tr><td colSpan={7} style={{padding:24,textAlign:"center",color:"#999"}}>No ledger entries yet.</td></tr>}
                  {entries.map((e,i)=>{
                    const isDebit=e.type==="debit";
                    const isOverdue=isDebit&&e.status==="pastdue";
                    return(
                    <tr key={e.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:isOverdue?"rgba(196,92,74,.02)":i%2===0?"#fff":"rgba(0,0,0,.005)"}}>
                      <td style={{padding:"8px 12px",color:"#999",whiteSpace:"nowrap",fontFamily:"monospace",fontSize:10}}>{e.date}</td>
                      {ledgerTenant==="all"&&<td style={{padding:"8px 12px",fontWeight:600,fontSize:11,whiteSpace:"nowrap"}}>{e.tenant}</td>}
                      <td style={{padding:"8px 12px",color:"#3c3228"}}>{e.desc}{isOverdue&&<span style={{marginLeft:6,fontSize:9,color:"#c45c4a",fontWeight:700}}>⚠ OVERDUE</span>}</td>
                      <td style={{padding:"8px 12px"}}><span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:100,background:e.category==="Payment"?"rgba(74,124,89,.08)":e.category==="Rent"?"rgba(59,130,246,.08)":e.category==="Late Fee"?"rgba(196,92,74,.08)":"rgba(0,0,0,.04)",color:e.category==="Payment"?"#4a7c59":e.category==="Rent"?"#3b82f6":e.category==="Late Fee"?"#c45c4a":"#5c4a3a"}}>{e.category}</span></td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:isDebit?700:400,color:isDebit?"#c45c4a":"#ccc"}}>{isDebit?fmtS(e.amount):"—"}</td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:!isDebit?700:400,color:!isDebit?"#4a7c59":"#ccc"}}>{!isDebit?fmtS(e.amount):"—"}</td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:800,color:e.balance>0?"#c45c4a":e.balance<0?"#3b82f6":"#4a7c59",whiteSpace:"nowrap"}}>{e.balance===0?"—":fmtS(e.balance)}</td>
                    </tr>);
                  })}
                </tbody>
                {entries.length>0&&<tfoot>
                  <tr style={{borderTop:"2px solid rgba(0,0,0,.08)",background:"#f8f7f4"}}>
                    <td colSpan={ledgerTenant==="all"?3:2} style={{padding:"10px 12px",fontWeight:800,fontSize:12}}>Totals</td>
                    <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(totalDebits)}</td>
                    <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(totalCredits)}</td>
                    <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:runningBalance>0?"#c45c4a":"#4a7c59"}}>{fmtS(runningBalance)}</td>
                  </tr>
                </tfoot>}
              </table>
            </div></div>
          </>);
        })()}

        {/* ── P&L by Property ── */}
        <div className="sec-hd" style={{marginTop:24}}><div><h2>P&L by Property</h2></div>
          <button className="btn btn-gold" onClick={()=>setTxns(p=>[{id:uid(),date:TODAY.toISOString().split("T")[0],type:"expense",desc:"New Expense",amount:0,propId:"p1",cat:"Other"},...p])}>+ Add Transaction</button></div>
        <div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th>Date</th><th>Description</th><th>Property</th><th>Category</th><th style={{textAlign:"right"}}>Amount</th></tr></thead><tbody>
          {txns.map(t=>{const pr=props.find(p=>p.id===t.propId);return(
            <tr key={t.id}><td>{t.date}</td><td style={{fontWeight:600}}>{t.desc}</td><td>{(pr&&pr.name)||"—"}</td><td><span className={`badge ${t.type==="income"?"b-green":"b-red"}`}>{t.cat}</span></td>
              <td style={{textAlign:"right",fontWeight:800,color:t.type==="income"?"#4a7c59":"#c45c4a"}}>{t.type==="income"?"+":"-"}{fmtS(t.amount)}</td></tr>);})}
        </tbody></table></div></div>
        {props.map((p,idx)=>{const inc=txns.filter(t=>t.propId===p.id&&t.type==="income").reduce((s,t)=>s+t.amount,0);const exp=txns.filter(t=>t.propId===p.id&&t.type==="expense").reduce((s,t)=>s+t.amount,0);return(
          <div key={p.id} className="row"><div className="row-i"><div className="row-t">{p.name}</div><div className="row-s">{p.type} · {allRooms(p).length} rooms</div></div>
            <div style={{display:"flex",gap:16,alignItems:"center"}}><div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999"}}>Income</div><div style={{fontWeight:800,color:"#4a7c59",fontSize:13}}>{fmtS(inc)}</div></div><div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999"}}>Expense</div><div style={{fontWeight:800,color:"#c45c4a",fontSize:13}}>{fmtS(exp)}</div></div><div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999"}}>Net</div><div style={{fontWeight:800,color:inc-exp>=0?"#4a7c59":"#c45c4a",fontSize:13}}>{fmtS(inc-exp)}</div></div></div>
          </div>);})}
      </>}

      {/* ═══ NOTIFICATIONS ═══ */}
      {tab==="notifications"&&<>
        <div className="sec-hd"><div><h2>Notifications</h2><p>{m.unreadNotifs} unread</p></div>
          <button className="btn btn-out btn-sm" onClick={()=>setNotifs(p=>p.map(x=>({...x,read:true})))}>Mark All Read</button></div>
        {notifs.map(n=>(
          <div key={n.id} className="row" style={{opacity:n.read?0.6:1,cursor:"pointer"}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>
            <span style={{fontSize:16}}>{n.type==="lease"?"📋":n.type==="payment"?"💰":n.type==="maint"?"🔧":"📝"}</span>
            <div className="row-i"><div className="row-t" style={{fontWeight:n.read?500:700}}>{n.msg}</div><div className="row-s">{n.date}</div></div>
            {!n.read&&<div className="notif-dot"/>}{n.urgent&&<span className="badge b-red">Urgent</span>}
          </div>
        ))}
      </>}

      {/* ═══ SCORECARD ═══ */}
      {tab==="scorecard"&&<>
        <div className="kgrid">
          <div className={`kpi ${drill==="sc-occ"?"active":""}`} onClick={()=>setDrill(drill==="sc-occ"?null:"sc-occ")}><div className="kl">🏠 Occupancy</div><div className="kv" style={{color:m.occRate>=90?"#4a7c59":"#c45c4a"}}>{m.occRate}%</div><div className="ks">{m.occ}/{m.total} rooms</div></div>
          <div className={`kpi ${drill==="sc-coll"?"active":""}`} onClick={()=>setDrill(drill==="sc-coll"?null:"sc-coll")}><div className="kl">💰 Collection</div><div className="kv" style={{color:m.collRate>=90?"#4a7c59":"#c45c4a"}}>{m.collRate}%</div><div className="ks">{fmtS(m.coll)} / {fmtS(m.due)}</div></div>
          <div className={`kpi ${drill==="sc-vac"?"active":""}`} onClick={()=>setDrill(drill==="sc-vac"?null:"sc-vac")}><div className="kl">💸 Vacancy</div><div className="kv" style={{color:m.lost>0?"#c45c4a":"#4a7c59"}}>{fmtS(m.lost)}</div><div className="ks">/month lost</div></div>
          <div className={`kpi ${drill==="sc-proj"?"active":""}`} onClick={()=>setDrill(drill==="sc-proj"?null:"sc-proj")}><div className="kl">📈 Projected</div><div className="kv">{fmtS(m.proj)}</div><div className="ks">of {fmtS(m.full)}</div></div>
        </div>

        {/* Drill: Occupancy */}
        {drill==="sc-occ"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Occupancy: {m.occ}/{m.total}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.propBreakdown.map(pr=>{const pct=pr.occCount/(pr.occCount+pr.vacCount)*100;return(<div key={pr.id} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontWeight:700,fontSize:13}}>{pr.name} <span style={{fontSize:11,color:"#999"}}>{pr.type}</span></div><span className={`badge ${pr.vacCount?"b-red":"b-green"}`}>{pr.occCount}/{allRooms(pr).length} · {Math.round(pct)}%</span></div>
            <div style={{height:5,borderRadius:3,background:"#e5e3df",marginBottom:6}}><div style={{height:"100%",borderRadius:3,background:pct>=100?"#4a7c59":pct>=75?"#d4a853":"#c45c4a",width:`${pct}%`}}/></div>
            {allRooms(pr).map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2,cursor:r.tenant?"pointer":"default"}} onClick={()=>{if(r.tenant)setModal({type:"tenant",data:{...r,propName:pr.name,propUtils:(pr.units||[])[0]?.utils||pr.utils,propClean:(pr.units||[])[0]?.clean||pr.clean}});}}><div className="row-dot" style={{background:r.st==="vacant"?"#c45c4a":"#4a7c59"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:r.tenant?"#999":"#c45c4a"}}>{(r.tenant&&r.tenant.name)||"Vacant"}{r.tenant&&<span style={{color:"#c4a882",marginLeft:4}}>→ view</span>}</div></div><div style={{fontSize:12,fontWeight:700}}>{fmtS(r.rent)}</div></div>)}
          </div>);})}
        </div></div>}

        {/* Drill: Collection */}
        {drill==="sc-coll"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Collection: {fmtS(m.coll)} / {fmtS(m.due)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.unpaid.length>0&&<><div style={{fontSize:9,fontWeight:700,color:"#c45c4a",marginBottom:6}}>UNPAID ({m.unpaid.length})</div>{m.unpaid.map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div className="row-s">{r.propName} · {r.name}</div></div><div className="row-v kb">{fmtS(r.rent)}</div><button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();openPayForm(r.id);}}>Pay</button></div>)}</>}
          {m.paid.length>0&&<><div style={{fontSize:9,fontWeight:700,color:"#4a7c59",margin:"10px 0 6px"}}>PAID ({m.paid.length})</div>{m.paid.map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#4a7c59"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div className="row-s">{r.propName}</div></div><div className="row-v kg">{fmtS(r.paidAmt)}</div></div>)}</>}
          <div style={{marginTop:12,padding:14,background:"rgba(0,0,0,.02)",borderRadius:10}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:13}}><span>Total Due</span><strong>{fmtS(m.due)}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:13}}><span>Collected</span><strong style={{color:"#4a7c59"}}>{fmtS(m.coll)}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13}}><span>Outstanding</span><strong style={{color:m.due-m.coll>0?"#c45c4a":"#4a7c59"}}>{fmtS(m.due-m.coll)}</strong></div>
          </div>
        </div></div>}

        {/* Drill: Vacancy */}
        {drill==="sc-vac"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Vacancy: {fmtS(m.lost)}/mo lost</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.vacs.length===0?<div style={{textAlign:"center",padding:20,color:"#4a7c59"}}>🎉 Fully occupied!</div>:
            m.vacs.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.name}</div><div className="row-s">{r.propName} · {r.pb?"Private":"Shared"}</div></div><div className="row-v kb">{fmtS(r.rent)}<div style={{fontSize:8,color:"#999"}}>lost/mo</div></div></div>)}
          <div style={{marginTop:10,padding:12,background:"rgba(196,92,74,.03)",borderRadius:8,fontSize:12}}><strong>Annual loss:</strong> {fmtS(m.lost*12)}</div>
        </div></div>}

        {/* Drill: Projected */}
        {drill==="sc-proj"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Projected: {fmtS(m.proj)} / {fmtS(m.full)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.propBreakdown.map(pr=><div key={pr.id} className="row"><div className="row-i"><div className="row-t">{pr.name}</div><div className="row-s">{pr.occCount} occupied · {pr.vacCount} vacant</div></div><div style={{display:"flex",gap:12,alignItems:"baseline"}}><span style={{fontSize:11,color:"#999"}}>Full: {fmtS(pr.fullOcc)}</span><span style={{fontSize:16,fontWeight:800,color:pr.projected===pr.fullOcc?"#4a7c59":"inherit"}}>{fmtS(pr.projected)}</span>{pr.vacCount>0&&<span style={{fontSize:11,fontWeight:700,color:"#c45c4a"}}>-{fmtS(pr.fullOcc-pr.projected)}</span>}</div></div>)}
        </div></div>}

        {/* Charts */}
        <div className="card" style={{marginBottom:14}}>
          <div className="card-hd" onClick={()=>setShowCharts(!showCharts)}><h3>📈 Visual Trends</h3><span style={{fontSize:11,color:"#999"}}>{showCharts?"▾ Collapse":"▸ Expand"}</span></div>
          {showCharts&&<div className="card-bd">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div><div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Revenue by Property</div>
                <ResponsiveContainer width="100%" height={180}><BarChart data={m.propBreakdown.map(p=>({name:p.name.split(" ").slice(0,2).join(" "),Projected:p.projected,Lost:p.fullOcc-p.projected}))}>
                  <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`$${v/1000}k`}/><Tooltip formatter={v=>`$${v.toLocaleString()}`}/>
                  <Bar dataKey="Projected" fill="#4a7c59" radius={[3,3,0,0]}/><Bar dataKey="Lost" fill="#c45c4a" radius={[3,3,0,0]}/>
                </BarChart></ResponsiveContainer></div>
              <div><div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Occupancy</div>
                <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={[{name:"Occupied",value:m.occ},{name:"Vacant",value:m.total-m.occ}]} cx="50%" cy="50%" outerRadius={60} innerRadius={38} paddingAngle={3} dataKey="value"><Cell fill="#4a7c59"/><Cell fill="#c45c4a"/></Pie><Tooltip/></PieChart></ResponsiveContainer>
                <div style={{textAlign:"center",marginTop:-6}}><span style={{fontSize:10,color:"#4a7c59",fontWeight:700,marginRight:10}}>● {m.occ} Occupied</span><span style={{fontSize:10,color:"#c45c4a",fontWeight:700}}>● {m.total-m.occ} Vacant</span></div></div>
            </div>
            <div style={{marginTop:16}}><div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Weekly Trend</div>
              <ResponsiveContainer width="100%" height={160}><LineChart data={scRows.map(w=>({week:w.label,"Occupancy Rate":w.occ,"Collection Rate":w.coll,"New Leads":w.leads}))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="week" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Legend wrapperStyle={{fontSize:10}}/>
                <Line type="monotone" dataKey="Occupancy Rate" stroke="#4a7c59" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="Collection Rate" stroke="#3b82f6" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="New Leads" stroke="#d4a853" strokeWidth={2} dot={{r:3}}/>
              </LineChart></ResponsiveContainer></div>
          </div>}
        </div>

        {/* Monthly Comparison */}
        <div className="card" style={{marginBottom:14}}>
          <div className="card-hd"><h3>📅 Monthly Comparison</h3><span style={{fontSize:10,color:"#999"}}>{allMonths.length} month{allMonths.length!==1?"s":""} of data</span></div>
          <div className="card-bd">
            {/* Side-by-side cards: This Month vs Last Month vs 2 Months Ago */}
            <div style={{display:"grid",gridTemplateColumns:`repeat(${twoMonthsAgo?3:prevMonth?2:1},1fr)`,gap:12,marginBottom:16}}>
              {/* Current Month */}
              <div style={{background:"rgba(212,168,83,.04)",borderRadius:10,padding:14,border:"2px solid rgba(212,168,83,.15)"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#d4a853",marginBottom:8}}>{liveMonth.label} (Current)</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Occupancy</span><strong style={{color:liveMonth.occ>=90?"#4a7c59":"#c45c4a"}}>{liveMonth.occ}%</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Collection</span><strong style={{color:liveMonth.collRate>=90?"#4a7c59":"#c45c4a"}}>{liveMonth.collRate}%</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Vacancy Cost</span><strong style={{color:liveMonth.vacancy>0?"#c45c4a":"#4a7c59"}}>{fmtS(liveMonth.vacancy)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Collected</span><strong style={{color:"#4a7c59"}}>{fmtS(liveMonth.collected)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>Projected</span><strong>{fmtS(liveMonth.projected)}</strong></div>
                </div>
              </div>
              {/* Previous Month */}
              {prevMonth&&<div style={{background:"rgba(0,0,0,.02)",borderRadius:10,padding:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:8}}>{prevMonth.label}</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  {[["Occupancy",prevMonth.occ,liveMonth.occ,"%"],["Collection",prevMonth.collRate,liveMonth.collRate,"%"],["Vacancy Cost",prevMonth.vacancy,liveMonth.vacancy,"$",true],["Collected",prevMonth.collected,liveMonth.collected,"$"],["Projected",prevMonth.projected,liveMonth.projected,"$"]].map(([label,prev,curr,unit,inverse])=>{
                    const diff=unit==="$"?curr-prev:curr-prev;const better=inverse?diff<=0:diff>=0;
                    return(<div key={label} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>{label}</span><div><strong>{unit==="$"?fmtS(prev):`${prev}${unit}`}</strong>{diff!==0&&<span style={{fontSize:9,marginLeft:4,color:better?"#4a7c59":"#c45c4a"}}>{diff>0?"+":""}{unit==="$"?fmtS(diff):`${diff}${unit}`}</span>}</div></div>);
                  })}
                </div>
              </div>}
              {/* 2 Months Ago */}
              {twoMonthsAgo&&<div style={{background:"rgba(0,0,0,.02)",borderRadius:10,padding:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:8}}>{twoMonthsAgo.label}</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  {[["Occupancy",twoMonthsAgo.occ,"%"],["Collection",twoMonthsAgo.collRate,"%"],["Vacancy Cost",twoMonthsAgo.vacancy,"$"],["Collected",twoMonthsAgo.collected,"$"],["Projected",twoMonthsAgo.projected,"$"]].map(([label,val,unit])=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#999"}}>{label}</span><strong>{unit==="$"?fmtS(val):`${val}${unit}`}</strong></div>
                  ))}
                </div>
              </div>}
            </div>
            {!prevMonth&&<div style={{textAlign:"center",padding:12,color:"#999",fontSize:11}}>Monthly comparison will appear after your first month-end snapshot. Snapshots are taken automatically on the last day of each month.</div>}

            {/* Monthly trend chart */}
            {allMonths.length>1&&<>
              <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Monthly Trends</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <div style={{fontSize:9,color:"#999",marginBottom:4}}>Occupancy & Collection %</div>
                  <ResponsiveContainer width="100%" height={160}><LineChart data={allMonths.map(mo=>({month:((mo.label||"").split(" ")[0]||"").slice(0,3)||mo.month,Occupancy:mo.occ,Collection:mo.collRate}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="month" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}} domain={[0,100]}/><Tooltip formatter={v=>`${v}%`}/>
                    <Line type="monotone" dataKey="Occupancy" stroke="#4a7c59" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="Collection" stroke="#3b82f6" strokeWidth={2} dot={{r:3}}/>
                  </LineChart></ResponsiveContainer>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#999",marginBottom:4}}>Revenue</div>
                  <ResponsiveContainer width="100%" height={160}><BarChart data={allMonths.map(mo=>({month:((mo.label||"").split(" ")[0]||"").slice(0,3)||mo.month,Collected:mo.collected,Vacancy:mo.vacancy}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="month" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/><Tooltip formatter={v=>fmtS(v)}/>
                    <Bar dataKey="Collected" fill="#4a7c59" radius={[3,3,0,0]}/><Bar dataKey="Vacancy" fill="#c45c4a" radius={[3,3,0,0]}/>
                  </BarChart></ResponsiveContainer>
                </div>
              </div>
            </>}
          </div>
        </div>

        {/* Weekly table */}
        <div className="sec-hd"><div><h2>Weekly Scorecard</h2><p>Auto-calculated from real data. Click any row for details.</p></div></div>
        <div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th>Measurable</th><th>Goal</th>{scRows.map((w,i)=><th key={i} style={{textAlign:"center"}}>{w.label}{w.weekNum===CUR_WEEK?" ●":""}</th>)}</tr></thead><tbody>
          {scMeasurables.map((s)=>(
            <tr key={s.id} style={{cursor:"pointer"}} onClick={()=>setScDrill(scDrill===s.id?null:s.id)}>
              <td style={{fontWeight:700}}>{s.label} <span style={{fontSize:9,color:"#c4a882"}}>{scDrill===s.id?"▾":"▸"}</span></td>
              <td style={{color:"#999"}}>{s.unit==="$"?fmtS(s.goal):s.goal}{s.unit==="%"?"%":""}</td>
              {scRows.map((w,i)=>{const v=w[s.key]||0;const isGood=s.goodFn(v,s.goal);const isCurrent=w.weekNum===CUR_WEEK;return(
                <td key={i} style={{textAlign:"center"}}><span style={{display:"inline-block",padding:"3px 10px",borderRadius:100,fontWeight:700,fontSize:12,background:isGood?"rgba(74,124,89,.08)":"rgba(196,92,74,.08)",color:isGood?"#4a7c59":"#c45c4a",border:isCurrent?"2px solid rgba(212,168,83,.3)":"none"}}>{s.unit==="$"?fmtS(v):v}{s.unit==="%"?"%":""}</span></td>);})}
            </tr>))}
        </tbody></table></div></div>
        {scRows.length<=1&&<div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,marginTop:8,fontSize:12,color:"#5c4a3a"}}>📊 Historical data will build up automatically each week. The current column (●) is calculated live from your actual property and payment data.</div>}

        {/* Scorecard row drill-down */}
        {scDrill&&<div className="card" style={{animation:"fadeIn .2s",marginBottom:14}}><div className="card-bd">
          <div className="sec-hd"><div><h2>{(scorecard.find(s=>s.id===scDrill)||{}).label}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setScDrill(null)}>✕</button></div>

          {scDrill==="occ"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Occupancy = occupied rooms / total rooms. Goal: 100%. Currently <strong>{m.occRate}%</strong> ({m.occ}/{m.total}).</p>
            {m.vacs.length>0?<>{m.vacs.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:"#c45c4a"}}>Vacant at {r.propName} — {fmtS(r.rent)}/mo lost</div></div></div>)}
              <div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>Action: Fill {m.vacs.length} vacant room{m.vacs.length>1?"s":""} to hit 100%</div></>
            :<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>🎉 At 100% — all rooms filled!</div>}
          </div>}

          {scDrill==="coll"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Collection = rent collected / rent due. Goal: 100%. Currently <strong>{m.collRate}%</strong>.</p>
            {m.unpaid.length>0?<>{m.unpaid.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2,cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div style={{fontSize:9,color:"#c45c4a"}}>{r.propName} · {r.name} · {fmtS(r.rent)} unpaid</div></div></div>)}
              <div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>Outstanding: {fmtS(m.due-m.coll)} from {m.unpaid.length} tenant{m.unpaid.length>1?"s":""}</div></>
            :<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>✓ All rent collected for {MO}!</div>}
          </div>}

          {scDrill==="vacancy"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Vacancy cost = total rent from empty rooms. Goal: $0. Currently <strong>{fmtS(m.lost)}</strong>/month across {m.vacs.length} room{m.vacs.length!==1?"s":""}.</p>
            {m.vacs.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:"#999"}}>{r.propName} · {r.pb?"Private":"Shared"} bath</div></div><div style={{fontSize:12,fontWeight:700,color:"#c45c4a"}}>{fmtS(r.rent)}</div></div>)}
            {m.vacs.length>0&&<div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>That's {fmtS(m.lost*12)}/year in lost revenue.</div>}
            {m.vacs.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>🎉 No vacancies! $0 lost.</div>}
          </div>}

          {scDrill==="leads"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>New leads = prospective tenants who contacted you or started the pre-screen. Goal: 5+/week.</p>
            <div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:12,color:"#9a7422"}}><strong>Note:</strong> Leads aren't automatically tracked yet. This will auto-populate once the pre-screen form and AI chat are connected to the admin system. For now, this shows 0.</div>
            <div style={{fontSize:12,color:"#5c4a3a",marginTop:10,fontWeight:600}}>Tip: If leads are low, post on Facebook Marketplace, Craigslist, or local college housing boards.</div>
          </div>}
        </div></div>}
        {m.expiring.length>0&&<><div className="sec-hd" style={{marginTop:16}}><div><h2>⚠️ Leases Expiring</h2></div></div>
          {m.expiring.sort((a,b)=>a.daysLeft-b.daysLeft).map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setTab("tenants");setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}});}}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{r.propName} · {r.name} · {r.daysLeft} days</div></div><span className="badge" style={{background:r.daysLeft<=30?"rgba(196,92,74,.08)":"rgba(212,168,83,.1)",color:r.daysLeft<=30?"#c45c4a":"#9a7422"}}>{r.daysLeft}d</span></div>)}</>}
      </>}

      {/* ═══ ROCKS ═══ */}
      {tab==="rocks"&&<>
        <div className="sec-hd"><div><h2>Quarterly Rocks</h2><p>Click dot to cycle status</p></div>
          <button className="btn btn-gold" onClick={()=>setRocks(p=>[{id:uid(),title:"New Rock",owner:"Harrison",status:"not-started",due:"2026-06-30",notes:""},...p])}>+ Add</button></div>
        {rocks.map(r=>(
          <div key={r.id} className="row">
            <div style={{width:10,height:10,borderRadius:"50%",cursor:"pointer",flexShrink:0,background:r.status==="on-track"||r.status==="done"?"#4a7c59":r.status==="off-track"?"#c45c4a":"#ccc"}} onClick={()=>cycleRock(r.id)}/>
            <div className="row-i">
              <div className="row-t" contentEditable suppressContentEditableWarning onBlur={e=>setRocks(p=>p.map(x=>x.id===r.id?{...x,title:e.target.textContent}:x))}>{r.title}</div>
              <div className="row-s">{r.owner} · {r.status.replace("-"," ")} · Due {r.due}</div>
            </div>
            <span className={`badge ${r.status==="on-track"||r.status==="done"?"b-green":r.status==="off-track"?"b-red":"b-gray"}`}>{r.status.replace("-"," ")}</span>
            <button className="btn btn-red btn-sm" onClick={()=>setRocks(p=>p.filter(x=>x.id!==r.id))}>✕</button>
          </div>
        ))}
      </>}

      {/* ═══ ISSUES ═══ */}
      {tab==="issues"&&<>
        <div className="sec-hd"><div><h2>Issues List (IDS)</h2><p>Identify, Discuss, Solve. Click priority to cycle.</p></div>
          <button className="btn btn-gold" onClick={()=>setIssues(p=>[{id:uid(),title:"New issue",priority:"medium",created:TODAY.toISOString().split("T")[0]},...p])}>+ Add</button></div>
        {issues.map(i=>(
          <div key={i.id} className="row">
            <span style={{cursor:"pointer",fontSize:14}} onClick={()=>setIssues(p=>p.map(x=>x.id===i.id?{...x,priority:x.priority==="high"?"medium":x.priority==="medium"?"low":"high"}:x))}>{i.priority==="high"?"🔴":i.priority==="medium"?"🟡":"🟢"}</span>
            <div className="row-i"><div className="row-t" contentEditable suppressContentEditableWarning onBlur={e=>setIssues(p=>p.map(x=>x.id===i.id?{...x,title:e.target.textContent}:x))}>{i.title}</div><div className="row-s">{i.created}</div></div>
            <button className="btn btn-green btn-sm" onClick={()=>setIssues(p=>p.filter(x=>x.id!==i.id))}>✓ Solved</button>
          </div>
        ))}
      </>}

      {/* ═══ PROPERTIES EDITOR ═══ */}
      {tab==="properties"&&<>
        <div className="sec-hd"><div><h2>Manage Properties</h2><p>Click any property for details, or edit to manage rooms</p></div>
          <button className="btn btn-gold" onClick={()=>{setIsNewProp(true);setEditProp({});}}>+ Add Property</button></div>
        {props.map((p,idx)=>{
          const items=leaseableItems(p);
          const allWhole=(p.units||[]).every(u=>(u.rentalMode||"byRoom")==="wholeHouse");
          const anyWhole=(p.units||[]).some(u=>(u.rentalMode||"byRoom")==="wholeHouse");
          const wholeUnitRent=(p.units||[]).reduce((s,u)=>(u.rentalMode||"byRoom")==="wholeHouse"?s+(u.rent||0):s,0);
          const byRoomRooms=allRooms(p).filter(r=>{const u=(p.units||[]).find(u2=>(u2.rooms||[]).some(x=>x.id===r.id));return(u?.rentalMode||"byRoom")==="byRoom";});
          const pr=byRoomRooms.map(r=>r.rent);
          const vac=items.filter(i=>i.st==="vacant").length;
          const occItems=items.filter(i=>i.st==="occupied");
          const occRooms=byRoomRooms.filter(r=>r.st==="occupied");
          const isExp=expanded["prop-"+p.id];
          const totalRent=items.reduce((s,i)=>s+i.rent,0);
          const projRent=occItems.reduce((s,i)=>s+i.rent,0);
          const unpaidRooms=occRooms.filter(r=>!(payments[r.id]&&payments[r.id][MO]));
          const expiringRooms=occRooms.filter(r=>{if(!r.le)return false;const d=Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24));return d<=90;});
          return(
          <div key={p.id} className="card"
            draggable
            onDragStart={()=>setDragPropIdx(idx)}
            onDragEnter={()=>setDragOverPropIdx(idx)}
            onDragOver={e=>e.preventDefault()}
            onDragEnd={()=>{
              if(dragPropIdx!==null&&dragOverPropIdx!==null&&dragPropIdx!==dragOverPropIdx){
                const reordered=[...props];
                const[moved]=reordered.splice(dragPropIdx,1);
                reordered.splice(dragOverPropIdx,0,moved);
                setProps(reordered);
              }
              setDragPropIdx(null);setDragOverPropIdx(null);
            }}
            style={{marginBottom:10,opacity:dragPropIdx===idx?.5:1,
              border:dragOverPropIdx===idx&&dragPropIdx!==idx?"2px solid #d4a853":"2px solid transparent",
              borderRadius:12,transition:"opacity .15s,border-color .1s",cursor:"grab"}}>
            <div className="card-hd" onClick={()=>setExpanded(x=>({...x,["prop-"+p.id]:!x["prop-"+p.id]}))}>
              <div>
                <h3><span style={{color:"#ccc",marginRight:4,cursor:"grab",fontSize:14}}>⠿</span>{isExp?"▾":"▸"} {p.name}</h3>
                <div style={{fontSize:10,color:"#999",marginTop:2}}>{p.addr} · {(PROP_TYPES[p.type]||PROP_TYPES.SFH).label} · {allWhole?"Whole Unit":anyWhole?"Mixed":allRooms(p).length+"br"} · {(p.units||[]).length>1?(p.units||[]).length+" units":"1 unit"} · {(p.units||[])[0]?.utils==="allIncluded"?"All Utils":"Tenant Pays"}</div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                {allWhole&&wholeUnitRent>0&&<span style={{fontWeight:800,color:"#d4a853",marginRight:4}}>{fmtS(wholeUnitRent)}/mo <span style={{fontSize:9,fontWeight:400,color:"#999"}}>whole unit</span></span>}
                {!allWhole&&pr.length>0&&<span style={{fontWeight:800,marginRight:4}}>{fmtS(Math.min(...pr))}–{fmtS(Math.max(...pr))} <span style={{fontSize:9,fontWeight:400,color:"#999"}}>per room</span></span>}
                {vac>0&&<span className="badge b-red">{vac} Vacant</span>}
                {vac===0&&items.length>0&&<span className="badge b-green">{allWhole?"Whole Unit":"Full"}</span>}
                {unpaidRooms.length>0&&<span className="badge b-red" title={`${unpaidRooms.map(r=>r.tenant.name).join(", ")} unpaid`}>💳 {unpaidRooms.length} Unpaid</span>}
                {expiringRooms.length>0&&<span className="badge b-gold" title={expiringRooms.map(r=>`${r.tenant.name} (${Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24))}d)`).join(", ")}>⚠ {expiringRooms.length} Expiring</span>}
                <button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setIsNewProp(false);setEditProp(p);}}>✏️ Edit</button>
              </div>
            </div>
            {isExp&&<div className="card-bd" style={{animation:"fadeIn .15s"}}>
              {/* Property summary */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                {!allWhole&&<div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Rooms</div><div style={{fontSize:18,fontWeight:800}}>{allRooms(p).length}</div></div>}
                {!allWhole&&<div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Occupied</div><div style={{fontSize:18,fontWeight:800,color:"#4a7c59"}}>{occRooms.length}</div></div>}
                {allWhole&&<div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center",gridColumn:"span 2"}}><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Monthly Rent</div><div style={{fontSize:18,fontWeight:800}}>{fmtS(wholeUnitRent)}<small style={{fontSize:9,color:"#999"}}>/mo</small></div></div>}
                <div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Projected</div><div style={{fontSize:18,fontWeight:800}}>{fmtS(projRent)}<small style={{fontSize:9,color:"#999"}}>/mo</small></div></div>
                <div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>At Full</div><div style={{fontSize:18,fontWeight:800}}>{fmtS(totalRent)}<small style={{fontSize:9,color:"#999"}}>/mo</small></div></div>
              </div>
              {/* Whole unit info */}
              {allWhole&&<div style={{padding:"12px 14px",background:"#faf9f7",borderRadius:8,marginBottom:10}}>
                {(p.units||[]).map(u=><div key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700}}>{(p.units||[]).length>1?u.name:"Whole Unit"} · {u.utils==="allIncluded"?"All Utilities":u.utils==="first100"?"First $100 Utilities":"Tenant Pays"} · {u.clean||"Biweekly"} Clean</div>
                    <div style={{fontSize:10,color:"#999",marginTop:2}}>Single lease · {u.baths||1} bath{u.baths!==1?"s":""}</div>
                  </div>
                  <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59",borderColor:"rgba(74,124,89,.2)"}} onClick={()=>{setTab("applications");setBulkSel([])}}>+ Find Tenant</button>
                </div>)}
              </div>}
              {/* Unit list — per-unit mode aware */}
              <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>{anyWhole&&!allWhole?"Units & Rooms":"Rooms by Unit"}</div>
              {(p.units||[]).map(u=>{
                const uIsWhole=(u.rentalMode||"byRoom")==="wholeHouse";
                const uRooms=u.rooms||[];
                const uOcc=uRooms.some(r=>r.st==="occupied");
                const uLatestLe=uRooms.filter(r=>r.le).sort((a,b)=>new Date(b.le)-new Date(a.le))[0]?.le;
                return(<div key={u.id} style={{marginBottom:10}}>
                  {(p.units||[]).length>1&&<div style={{fontSize:10,fontWeight:800,color:"#d4a853",textTransform:"uppercase",letterSpacing:.5,marginBottom:4,padding:"3px 8px",background:"rgba(212,168,83,.06)",borderRadius:4,display:"inline-flex",alignItems:"center",gap:6}}>
                    {u.name}
                    <span style={{fontSize:8,fontWeight:500,color:"#999",textTransform:"none",letterSpacing:0}}>{uIsWhole?"Whole Unit":"By Room"}</span>
                  </div>}
                  {uIsWhole?(
                    <div className="row" style={{padding:"10px 12px",marginBottom:3,cursor:"default"}}>
                      <div className="row-dot" style={{background:uOcc?"#4a7c59":"#c45c4a",flexShrink:0}}/>
                      <div className="row-i">
                        <div style={{fontSize:12,fontWeight:600}}>{u.name} — Whole Unit</div>
                        {uOcc
                          ?<div style={{fontSize:10,color:"#999",marginTop:1}}>Occupied · ends {fmtD(uLatestLe)}</div>
                          :<div style={{fontSize:10,color:"#c45c4a",fontWeight:600,marginTop:1}}>Vacant — {fmtS(u.rent)}/mo</div>}
                      </div>
                      <div style={{textAlign:"right",minWidth:60,marginRight:8}}>
                        <div style={{fontSize:14,fontWeight:800}}>{fmtS(u.rent)}</div>
                      </div>
                      <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59",borderColor:"rgba(74,124,89,.2)"}} onClick={()=>{setTab("applications");setBulkSel([]);}}>{uOcc?"View Tenant":"+ Find Tenant"}</button>
                    </div>
                  ):(
                    <>
                    {uRooms.length===0&&<div style={{fontSize:11,color:"#bbb",padding:"6px 0"}}>No rooms — edit property to add</div>}
                    {uRooms.map(r=>{const occ=r.st==="occupied"&&r.tenant;const pd=(payments[r.id]&&payments[r.id][MO])||0;const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;
                      const tenantData={...r,propName:p.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,unitName:u.name,unitLabel:u.label};
                      return(<div key={r.id} className="row" style={{padding:"10px 12px",marginBottom:3,cursor:"default",background:occ&&dl&&dl<=30?"rgba(196,92,74,.02)":occ&&dl&&dl<=90?"rgba(212,168,83,.02)":"#fff"}}>
                        <div className="row-dot" style={{background:occ?"#4a7c59":"#c45c4a",flexShrink:0}}/>
                        <div className="row-i">
                          <div style={{fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                            {r.name}
                            <span className={"badge "+(r.pb?"b-green":"b-gray")} style={{fontSize:7}}>{r.pb?"Private":"Shared"}</span>
                            {r.sqft&&<span style={{fontSize:9,color:"#999"}}>{r.sqft} sqft</span>}
                          </div>
                          {occ
                            ?<div style={{fontSize:10,color:"#999",marginTop:1}}>{r.tenant.name} · ends {fmtD(r.le)}{dl&&dl<=90?<span style={{color:dl<=30?"#c45c4a":"#d4a853",fontWeight:700,marginLeft:4}}>⚠ {dl}d</span>:null}</div>
                            :<div style={{fontSize:10,color:"#c45c4a",fontWeight:600,marginTop:1}}>Vacant — {fmtS(r.rent)}/mo lost</div>}
                        </div>
                        <div style={{textAlign:"right",minWidth:60,marginRight:8}}>
                          <div style={{fontSize:14,fontWeight:800}}>{fmtS(r.rent)}</div>
                          {occ&&<div style={{fontSize:9,color:pd?"#4a7c59":"#c45c4a",fontWeight:600}}>{pd?"✓ Paid":"✕ Unpaid"}</div>}
                        </div>
                        {occ
                          ?<div style={{display:"flex",gap:4,flexShrink:0}}>
                            <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"tenant",data:tenantData})}>👤 Profile</button>
                            <button className="btn btn-gold btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"tenant",data:tenantData,startSection:"lease"})}>📄 Lease</button>
                          </div>
                          :<button className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59",borderColor:"rgba(74,124,89,.2)"}} onClick={()=>{setTab("applications");setBulkSel([]);}}> + Find Tenant</button>}
                      </div>);})}
                    </>
                  )}
                </div>);
              })}
            </div>}
          </div>);})}
        {props.length===0&&<div style={{textAlign:"center",padding:40,color:"#999"}}><div style={{fontSize:40,marginBottom:8}}>🏠</div><h3 style={{fontSize:15}}>No Properties</h3><p style={{fontSize:12,marginTop:4}}>Add your first property above.</p></div>}
      </>}

      {/* ═══ SITE SETTINGS ═══ */}
      {tab==="site-settings"&&<>
        <div className="sec-hd"><div><h2>Site Settings</h2><p>Edit company info and hero copy</p></div></div>
        <div className="card"><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:12}}>Company Info</h3>
          <div className="fr"><div className="fld"><label>Company Name</label><input value={settings.companyName} onChange={e=>setSettings({...settings,companyName:e.target.value})}/></div><div className="fld"><label>Legal Entity</label><input value={settings.legalName} onChange={e=>setSettings({...settings,legalName:e.target.value})}/></div></div>
          <div className="fr3"><div className="fld"><label>Phone</label><input value={settings.phone} onChange={e=>setSettings({...settings,phone:e.target.value})}/></div><div className="fld"><label>Public Email</label><input value={settings.email} onChange={e=>setSettings({...settings,email:e.target.value})} placeholder="info@rentblackbear.com"/></div><div className="fld"><label>City</label><input value={settings.city} onChange={e=>setSettings({...settings,city:e.target.value})}/></div></div><div className="fld"><label>PM Notification Email <span style={{fontWeight:400,color:"#999",textTransform:"none",letterSpacing:0}}>— where you receive application, lease, and payment alerts</span></label><input type="email" value={settings.pmEmail||""} onChange={e=>setSettings({...settings,pmEmail:e.target.value})} placeholder="blackbearhousing@gmail.com"/></div>
        </div></div>
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
                  {expanded.redrawSig?"Cancel Redraw":"✏️ Redraw Signature"}
                </button>
                <button className="btn btn-red btn-sm" onClick={()=>{setSettings(p=>{const u={...p,savedSignature:null};save("hq-settings",u);return u;});}}>
                  🗑 Remove
                </button>
              </div>
              {expanded.redrawSig&&<div style={{marginTop:12}}>
                <SigCanvas onSave={(data)=>{setSettings(p=>{const u={...p,savedSignature:data};save("hq-settings",u);return u;});setExpanded(p=>({...p,redrawSig:false}));}} height={100}/>
              </div>}
            </div>
            :<div>
              <div style={{fontSize:11,color:"#999",marginBottom:10}}>No signature saved yet. Draw one below and it will be offered automatically when signing leases.</div>
              <SigCanvas onSave={(data)=>{setSettings(p=>{const u={...p,savedSignature:data};save("hq-settings",u);return u;});}} height={100}/>
            </div>
          }
        </div></div>

        {/* Email Notifications */}
        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Email Notifications</h3>
          <p style={{fontSize:11,color:"#999",marginBottom:14}}>Choose which events trigger an email to you at <strong>{settings.email||"info@rentblackbear.com"}</strong>. Tenant-facing emails always send regardless.</p>
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
                <div style={{fontSize:10,color:"#999",marginTop:1}}>{desc}</div>
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
            💡 Notification emails are sent to <strong>{settings.email||"info@rentblackbear.com"}</strong>. Update your email in Company Info above.
          </div>
        </div></div>

        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Email Templates</h3>
          <p style={{fontSize:11,color:"#999",marginBottom:14}}>Customize the subject line and body of notification emails sent to you. Use <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"name{"+"}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"property{"+"}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"room{"+"}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"amount{"+"}"}</code> as placeholders.</p>
          {[
            {key:"prescreen",label:"Pre-Screen Alert (to you)",icon:"📋",desc:"Sent to PM when someone completes the qualifying questions"},
            {key:"prescreenTenant",label:"Pre-Screen Confirmation (to applicant)",icon:"✉️",desc:"Sent to the applicant after they pass the pre-screen — the '24 hours' email"},
            {key:"application",label:"Full Application Received",icon:"📝",desc:"Sent when an invited applicant submits their full application"},
            {key:"leaseSigned",label:"Lease Signed",icon:"✍️",desc:"Sent when a tenant e-signs their lease"},
            {key:"payment",label:"Payment Received",icon:"💰",desc:"Sent when a payment is recorded"},
          ].map(({key,label,icon,desc})=>{
            const tpl=settings.emailTemplates||DEF_SETTINGS.emailTemplates;
            const subjKey=key+"Subject";const bodyKey=key+"Body";
            return(<div key={key} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <div style={{fontSize:11,fontWeight:800,color:"#1a1714",marginBottom:2}}>{icon} {label}</div>
              <div style={{fontSize:10,color:"#999",marginBottom:8}}>{desc}</div>
              <div className="fld" style={{marginBottom:6}}>
                <label>Subject Line</label>
                <input value={tpl[subjKey]||DEF_SETTINGS.emailTemplates[subjKey]||""} placeholder={DEF_SETTINGS.emailTemplates[subjKey]}
                  onChange={e=>setSettings(s=>({...s,emailTemplates:{...(s.emailTemplates||DEF_SETTINGS.emailTemplates),[subjKey]:e.target.value}}))}/>
              </div>
              <div className="fld" style={{marginBottom:0}}>
                <label style={{display:"flex",justifyContent:"space-between"}}>Body
                  <button className="btn btn-out btn-sm" style={{fontSize:8}} onClick={()=>setSettings(s=>({...s,emailTemplates:{...(s.emailTemplates||DEF_SETTINGS.emailTemplates),[subjKey]:DEF_SETTINGS.emailTemplates[subjKey],[bodyKey]:DEF_SETTINGS.emailTemplates[bodyKey]}}))}>↺ Reset</button>
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
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:12}}>Hero Section</h3>
          <div className="fld"><label>Tagline</label><input value={settings.tagline} onChange={e=>setSettings({...settings,tagline:e.target.value})}/></div>
          <div className="fr"><div className="fld"><label>Headline</label><input value={settings.heroHeadline} onChange={e=>setSettings({...settings,heroHeadline:e.target.value})}/></div><div className="fld"><label>Subline</label><input value={settings.heroSubline} onChange={e=>setSettings({...settings,heroSubline:e.target.value})}/></div></div>
          <div className="fld"><label>Description</label><textarea value={settings.heroDesc} onChange={e=>setSettings({...settings,heroDesc:e.target.value})}/></div>
        </div></div>


        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Payment Reminder Template</h3>
          <p style={{fontSize:11,color:"#999",marginBottom:12}}>This is the default message pre-filled every time you send a payment reminder. Edit and save to update the default for all future reminders.</p>
          <div className="fld">
            <label style={{display:"flex",justifyContent:"space-between"}}>
              Message Template
              <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setSettings(s=>({...s,reminderTemplate:DEF_SETTINGS.reminderTemplate}))}>↺ Restore original</button>
            </label>
            <textarea value={settings.reminderTemplate||DEF_SETTINGS.reminderTemplate} onChange={e=>setSettings({...settings,reminderTemplate:e.target.value})} rows={4} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"vertical",lineHeight:1.6}}/>
          </div>
          <div style={{fontSize:9,color:"#999",marginTop:4,lineHeight:1.6}}>
            Available variables: <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{firstName}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{fullName}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{amount}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{dueDate}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3}}>{"{category}"}</code>
          </div>
          <div style={{marginTop:8,background:"rgba(212,168,83,.06)",borderRadius:6,padding:10,fontSize:11,color:"#9a7422"}}>
            <strong>Preview:</strong> {(settings.reminderTemplate||DEF_SETTINGS.reminderTemplate).replace(/{firstName}/g,"Marcus").replace(/{fullName}/g,"Marcus Johnson").replace(/{amount}/g,"$850.00").replace(/{dueDate}/g,"Mar 1, 2026").replace(/{category}/g,"Rent")}
          </div>
        </div></div>
      </>}
      {tab==="theme"&&(()=>{
        const saveCurrentTheme=()=>setModal({type:"saveTheme",themeName:""});
        const applyTheme=(t)=>setTheme({...t});
        const deleteTheme=(id)=>setSavedThemes(p=>p.filter(x=>x.id!==id));
        const pushToSite=()=>{
          save("hq-pub-theme",theme);
          setNotifs(p=>[{id:uid(),type:"app",msg:"Theme published to live site — rentblackbear.com now uses the current colors",date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
          setExpanded(pr=>({...pr,themePushSuccess:true}));
          setTimeout(()=>setExpanded(pr=>({...pr,themePushSuccess:false})),3500);
        };
        const exportTheme=()=>{const css=Object.entries(theme).map(([k,v])=>`  --${k}: ${v};`).join(", ");const json=JSON.stringify(theme,null,2);const blob=new Blob([`:root {\n${css}\n}\n\n/* JSON */\n${json}`],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="blackbear-theme.css";a.click();URL.revokeObjectURL(url);};
        return(<>
        <div className="sec-hd"><div><h2>Theme Editor</h2><p>Edit, save, and push color schemes to your live site</p></div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn btn-green" onClick={pushToSite}>🚀 Push to Site</button>
            <button className="btn btn-gold" onClick={saveCurrentTheme}>💾 Save Theme</button>
            <button className="btn btn-out" onClick={exportTheme}>📥 Export CSS</button>
            <button className="btn btn-out" onClick={()=>setTheme(randPalette())}>🎲 Random</button>
          </div></div>
          {expanded.themePushSuccess&&<div style={{marginBottom:10,padding:"9px 12px",background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,fontSize:11,color:"#4a7c59",fontWeight:700,animation:"fadeIn .3s"}}>✓ Theme is live on rentblackbear.com — public site reads from Supabase on load</div>}

        {/* Presets + Saved Themes */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Presets</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {Object.entries(PRESETS).map(([n,c])=><button key={n} className="btn btn-out btn-sm" onClick={()=>applyTheme(c)}><span style={{width:10,height:10,borderRadius:"50%",background:c.accent,display:"inline-block"}}/> {n}</button>)}
          </div>
          {savedThemes.length>0&&<>
            <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Your Saved Themes</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {savedThemes.map(st=>(
                <div key={st.id} style={{display:"flex",alignItems:"center",gap:0,border:"1px solid rgba(0,0,0,.06)",borderRadius:6,overflow:"hidden"}}>
                  <button className="btn btn-out btn-sm" style={{borderRadius:0,border:"none"}} onClick={()=>applyTheme(st.colors)}>
                    <div style={{display:"flex",gap:2}}>{[st.colors.bg,st.colors.accent,st.colors.green,st.colors.text].map((c,i)=><span key={i} style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>)}</div>
                    <span style={{marginLeft:4}}>{st.name}</span>
                  </button>
                  <button style={{background:"none",border:"none",borderLeft:"1px solid rgba(0,0,0,.06)",padding:"4px 8px",cursor:"pointer",color:"#c45c4a",fontSize:10}} onClick={()=>deleteTheme(st.id)}>✕</button>
                </div>
              ))}
            </div>
          </>}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}}>
          <div style={{background:"#fff",borderRadius:12,padding:18,border:"1px solid rgba(0,0,0,.03)"}}>
            <h3 style={{fontSize:13,fontWeight:800,marginBottom:14}}>Colors</h3>
            {Object.entries(THEME_LABELS).map(([k,label])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:28,height:28,borderRadius:6,background:theme[k],border:"1px solid rgba(0,0,0,.1)",cursor:"pointer",position:"relative",overflow:"hidden",flexShrink:0}}><input type="color" value={theme[k]} onChange={e=>setTheme({...theme,[k]:e.target.value})} style={{position:"absolute",inset:-4,width:"calc(100% + 8px)",height:"calc(100% + 8px)",opacity:0,cursor:"pointer"}}/></div>
              <span style={{fontSize:11,fontWeight:600,flex:1}}>{label}</span>
              <input value={theme[k]} onChange={e=>{if(/^#[0-9a-fA-F]{6}$/.test(e.target.value))setTheme({...theme,[k]:e.target.value});}} style={{width:80,padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"monospace"}}/>
            </div>))}
          </div>
          <div style={{position:"sticky",top:80}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#999",marginBottom:8}}>Live Preview</div>
            <div style={{borderRadius:12,overflow:"hidden",border:"1px solid rgba(0,0,0,.06)",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
              <div style={{background:theme.bg,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:theme.text,fontWeight:700,fontSize:11}}>🐻 BB <span style={{color:theme.accent}}>Rentals</span></span><div style={{background:theme.accent,color:contrast(theme.accent),padding:"3px 8px",borderRadius:4,fontSize:8,fontWeight:700}}>Apply</div></div>
              <div style={{background:`linear-gradient(135deg,${theme.bg},${theme.card})`,padding:"18px 12px",textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",fontSize:16,color:theme.text}}>Your Room Is Ready.</div><div style={{fontFamily:"Georgia,serif",fontSize:16,color:theme.accent,fontStyle:"italic"}}>Everything's Included.</div><div style={{fontSize:9,color:theme.muted,marginTop:6}}>Furnished rooms from $600/mo</div></div>
              <div style={{background:theme.surface,padding:10}}>
                <div style={{background:"#fff",borderRadius:5,padding:6,border:"1px solid rgba(0,0,0,.04)",marginBottom:4}}>
                  <div style={{display:"flex",gap:3,marginBottom:3}}><span style={{background:`${theme.green}18`,color:theme.green,padding:"1px 5px",borderRadius:100,fontSize:6,fontWeight:700}}>Available</span></div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:10,color:theme.dark}}>The Holmes House</div>
                  <div style={{fontSize:7,color:theme.warm}}>$600–$850/mo</div>
                </div>
              </div>
              <div style={{background:theme.card,padding:"10px 12px",textAlign:"center"}}><div style={{background:theme.accent,color:contrast(theme.accent),padding:"5px 14px",borderRadius:5,fontSize:9,fontWeight:700,display:"inline-block"}}>Apply Now</div></div>
            </div>
            <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
              <div style={{background:theme.accent,color:contrast(theme.accent),padding:"5px 12px",borderRadius:5,fontSize:10,fontWeight:700}}>Button</div>
              <div style={{background:theme.green,color:"#fff",padding:"5px 12px",borderRadius:5,fontSize:10,fontWeight:700}}>Available</div>
              <div style={{background:theme.bg,color:theme.text,padding:"5px 12px",borderRadius:5,fontSize:10,fontWeight:700}}>Dark</div>
              <div style={{background:theme.surface,color:theme.dark,padding:"5px 12px",borderRadius:5,fontSize:10,fontWeight:700,border:"1px solid rgba(0,0,0,.06)"}}>Light</div>
            </div>
            <div style={{marginTop:16,background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:11,color:"#5c4a3a"}}>
              <strong>💡 Tip:</strong> Click "Push to Site" to update your live public site with the current colors. Save themes you like so you can switch between them later.
            </div>
          </div>
        </div>
      </>);})()}

      {/* ═══ IDEA BOARD ═══ */}
      {tab==="ideas"&&(()=>{
        const cats=[...new Set(ideas.filter(i=>!i.archived).map(i=>i.cat))];
        const allCats=[...new Set(ideas.map(i=>i.cat))];
        const statuses=["Idea","Planned","Building","Done"];
        const priColors={high:"#c45c4a",medium:"#d4a853",low:"#4a7c59"};
        const priLabels={high:"High",medium:"Med",low:"Low"};
        const priBg={high:"rgba(196,92,74,.08)",medium:"rgba(212,168,83,.08)",low:"rgba(74,124,89,.08)"};
        const stBg={Idea:"rgba(0,0,0,.04)",Planned:"rgba(59,130,246,.08)",Building:"rgba(212,168,83,.1)",Done:"rgba(74,124,89,.08)"};
        const stTxt={Idea:"#999",Planned:"#3b82f6",Building:"#9a7422",Done:"#4a7c59"};
        const showArchived=expanded.showArchived||false;
        const active=ideas.filter(i=>!i.archived);
        const archived=ideas.filter(i=>i.archived);
        const filtered=ideaFilter==="all"?active:ideaFilter==="high"||ideaFilter==="medium"||ideaFilter==="low"?active.filter(i=>i.priority===ideaFilter):active.filter(i=>i.status===ideaFilter);
        const updIdea=(id,f,v)=>setIdeas(p=>p.map(x=>x.id===id?{...x,[f]:v}:x));
        const archiveIdea=(id)=>setIdeas(p=>p.map(x=>x.id===id?{...x,archived:true}:x));
        const unarchiveIdea=(id)=>setIdeas(p=>p.map(x=>x.id===id?{...x,archived:false}:x));
        const delIdea=(id)=>setModal({type:"confirmAction",title:"Delete Idea",body:"Permanently delete this idea? This cannot be undone.",confirmLabel:"Delete",confirmStyle:"btn-red",onConfirm:()=>{setIdeas(p=>p.filter(x=>x.id!==id));setModal(null);}});
        const openEdit=(idea)=>setModal({type:"editIdea",idea:{...idea}});

        const IdeaCard=({i})=>(
          <div style={{padding:10,border:"1px solid rgba(0,0,0,.06)",borderRadius:8,marginBottom:6,background:"#fff",transition:"all .12s"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:8}}>
              <span style={{flexShrink:0,fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,background:priBg[i.priority],color:priColors[i.priority],marginTop:2,textTransform:"uppercase",letterSpacing:.5}}>{priLabels[i.priority]}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:"#1a1714",lineHeight:1.4}}>{i.title}</div>
                {i.notes&&<div style={{fontSize:10,color:"#999",lineHeight:1.4,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.notes}</div>}
                {i.link&&<a href={i.link} target="_blank" rel="noreferrer" style={{fontSize:9,color:"#3b82f6",textDecoration:"none",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}} onClick={e=>e.stopPropagation()}>↗ {i.link}</a>}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid rgba(0,0,0,.04)",paddingTop:7}}>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:stBg[i.status],color:stTxt[i.status]}}>{i.status}</span>
              <div style={{display:"flex",gap:4}}>
                <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={e=>{e.stopPropagation();openEdit(i);}}>+ Edit</button>
                <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={e=>{e.stopPropagation();archiveIdea(i.id);}}>Archive</button>
                <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px",color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={e=>{e.stopPropagation();delIdea(i.id);}}>Delete</button>
              </div>
            </div>
          </div>
        );

        const IdeaRow=({i})=>(
          <div className="row" style={{cursor:"pointer"}} onClick={()=>openEdit(i)}>
            <span style={{fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,background:priBg[i.priority],color:priColors[i.priority],textTransform:"uppercase",letterSpacing:.5,whiteSpace:"nowrap"}}>{priLabels[i.priority]}</span>
            <div className="row-i">
              <div className="row-t">{i.title}</div>
              <div className="row-s">{i.cat}{i.notes&&" · "+i.notes.slice(0,60)+(i.notes.length>60?"...":"")}</div>
            </div>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,background:stBg[i.status],color:stTxt[i.status],whiteSpace:"nowrap"}}>{i.status}</span>
            <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
              <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={()=>archiveIdea(i.id)}>Archive</button>
              <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px",color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>delIdea(i.id)}>Delete</button>
            </div>
          </div>
        );

        return(<>
          {/* KPIs */}
          <div className="kgrid" style={{gridTemplateColumns:"repeat(5,1fr)"}}>
            <div className="kpi"><div className="kl">Total</div><div className="kv">{active.length}</div></div>
            <div className="kpi"><div className="kl">💡 Idea</div><div className="kv">{active.filter(i=>i.status==="Idea").length}</div></div>
            <div className="kpi"><div className="kl">📋 Planned</div><div className="kv">{active.filter(i=>i.status==="Planned").length}</div></div>
            <div className="kpi"><div className="kl">⚡ Building</div><div className="kv kw">{active.filter(i=>i.status==="Building").length}</div></div>
            <div className="kpi"><div className="kl">✓ Done</div><div className="kv kg">{active.filter(i=>i.status==="Done").length}</div></div>
          </div>

          {/* Toolbar */}
          <div className="sec-hd" style={{marginBottom:12}}>
            <div style={{display:"flex",gap:4}}>
              {[["board","📋 Board"],["list","📝 List"],["status","📊 Status"]].map(([v,l])=><button key={v} className={`btn ${ideaView===v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setIdeaView(v)}>{l}</button>)}
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
              <select value={ideaFilter} onChange={e=>setIdeaFilter(e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}>
                <option value="all">All</option>
                <optgroup label="Status">{statuses.map(s=><option key={s} value={s}>{s}</option>)}</optgroup>
                <optgroup label="Priority"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></optgroup>
              </select>
              <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"newIdea",cat:cats[0]||"General",title:"",priority:"medium",status:"Idea",notes:"",link:""})}>+ New</button>
              {!showNewCat
                ?<button className="btn btn-out btn-sm" onClick={()=>setShowNewCat(true)}>+ Category</button>
                :<div style={{display:"flex",gap:3}}>
                  <input value={newCatInput} onChange={e=>setNewCatInput(e.target.value)} placeholder="Category name..." autoFocus
                    onKeyDown={e=>{if(e.key==="Enter"&&newCatInput.trim()){setIdeas(p=>[{id:uid(),title:"New idea",cat:newCatInput.trim(),priority:"medium",status:"Idea",notes:"",link:"",archived:false},...p]);setNewCatInput("");setShowNewCat(false);}}}
                    style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:10,fontFamily:"inherit",width:120}}/>
                  <button className="btn btn-gold btn-sm" disabled={!newCatInput.trim()} onClick={()=>{setIdeas(p=>[{id:uid(),title:"New idea",cat:newCatInput.trim(),priority:"medium",status:"Idea",notes:"",link:"",archived:false},...p]);setNewCatInput("");setShowNewCat(false);}}>Add</button>
                  <button className="btn btn-out btn-sm" onClick={()=>{setShowNewCat(false);setNewCatInput("");}}>✕</button>
                </div>}
            </div>
          </div>

          {/* Board view */}
          {ideaView==="board"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
            {cats.map(cat=>{const catIdeas=filtered.filter(i=>i.cat===cat);return(
              <div key={cat} style={{background:"#fff",borderRadius:12,border:"2px solid rgba(0,0,0,.08)",boxShadow:"0 2px 8px rgba(0,0,0,.05)",overflow:"hidden"}}>
                {/* Category header — solid dark strip */}
                <div style={{padding:"11px 14px",background:"#1a1714",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:12,fontWeight:800,color:"#f5f0e8",letterSpacing:.3}}>{cat}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:10,fontWeight:700,color:"#d4a853",background:"rgba(212,168,83,.15)",padding:"1px 8px",borderRadius:100}}>{catIdeas.length}</span>
                    <button style={{background:"rgba(255,255,255,.1)",border:"none",color:"#d4a853",cursor:"pointer",fontSize:16,lineHeight:1,width:22,height:22,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}} onClick={()=>setModal({type:"newIdea",cat,title:"",priority:"medium",status:"Idea",notes:"",link:""})}>+</button>
                  </div>
                </div>
                {/* Cards area */}
                <div style={{padding:10,minHeight:80,background:"#faf9f7"}}>
                  {catIdeas.map(i=><IdeaCard key={i.id} i={i}/>)}
                  {catIdeas.length===0&&<div style={{textAlign:"center",padding:20,color:"#ccc",fontSize:10,fontStyle:"italic"}}>No ideas yet — click + to add one</div>}
                </div>
              </div>);})}
          </div>}

          {/* List view */}
          {ideaView==="list"&&<>
            {filtered.map(i=><IdeaRow key={i.id} i={i}/>)}
            {filtered.length===0&&<div style={{textAlign:"center",padding:32,color:"#999",fontSize:12}}>No ideas match this filter</div>}
          </>}

          {/* Status view */}
          {ideaView==="status"&&<>{statuses.map(st=>{const stIdeas=filtered.filter(i=>i.status===st);return(
            <div key={st} style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:800,color:stTxt[st],textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:stBg[st],borderRadius:6}}>
                {st} <span style={{fontWeight:500,opacity:.7}}>({stIdeas.length})</span>
              </div>
              {stIdeas.map(i=><IdeaRow key={i.id} i={i}/>)}
              {stIdeas.length===0&&<div style={{padding:"8px 12px",fontSize:11,color:"#ccc",fontStyle:"italic"}}>Nothing here</div>}
            </div>);})}
          </>}

          {/* Archived toggle */}
          {archived.length>0&&<div style={{marginTop:20,borderTop:"1px solid rgba(0,0,0,.06)",paddingTop:14}}>
            <button className="btn btn-out btn-sm" style={{width:"100%",color:"#999"}} onClick={()=>setExpanded(p=>({...p,showArchived:!p.showArchived}))}>
              {showArchived?"▾ Hide":"▸ Show"} Archived ({archived.length})
            </button>
            {showArchived&&<div style={{marginTop:10}}>
              {archived.map(i=>(
                <div key={i.id} className="row" style={{opacity:.55}}>
                  <span style={{fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,background:priBg[i.priority],color:priColors[i.priority],textTransform:"uppercase",letterSpacing:.5}}>{priLabels[i.priority]}</span>
                  <div className="row-i"><div className="row-t" style={{textDecoration:"line-through"}}>{i.title}</div><div className="row-s">{i.cat}</div></div>
                  <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>unarchiveIdea(i.id)}>Restore</button>
                  <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>delIdea(i.id)}>Delete</button>
                </div>
              ))}
            </div>}
          </div>}
        </>);
      })()}

      </div>
    </div>
  </div>

  {/* ═══ MODALS ═══ */}
  {modal&&modal.type==="tenant"&&(()=>{const r=modal.data;const pd=(payments[r.id]&&payments[r.id][MO])||0;const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;const months=dl?Math.max(0,Math.ceil(dl/30)):null;
    const prop=props.find(p=>allRooms(p).some(x=>x.id===r.id));
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:580}} ref={el=>{if(el&&modal.startSection==="lease"){setTimeout(()=>{const t=el.querySelector("#lease-actions-section");if(t)t.scrollIntoView({behavior:"smooth",block:"start"});},150);}}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h2 style={{margin:0}}>{r.tenant.name}</h2>
      </div>
      <div className="tp-card"><h3>📞 Contact</h3><div className="tp-row"><span className="tp-label">Phone</span><strong>{r.tenant.phone}</strong></div><div className="tp-row"><span className="tp-label">Email</span><strong>{r.tenant.email}</strong></div></div>
      <div className="tp-card"><h3>🏠 Room</h3><div className="tp-row"><span className="tp-label">Property</span><strong>{r.propName}</strong></div><div className="tp-row"><span className="tp-label">Room</span><strong>{r.name}</strong></div><div className="tp-row"><span className="tp-label">Bath</span><strong>{r.pb?"Private":"Shared"}</strong></div><div className="tp-row"><span className="tp-label">Rent</span><strong style={{fontSize:16}}>{fmtS(r.rent)}/mo</strong></div><div className="tp-row"><span className="tp-label">Utilities</span><strong>{r.propUtils==="allIncluded"?"All Included":"Tenant pays (split equally)"}</strong></div><div className="tp-row"><span className="tp-label">Cleaning</span><strong>{r.propClean}</strong></div></div>
      <div className="tp-card"><h3>📋 Lease</h3><div className="tp-row"><span className="tp-label">Move-in</span><strong>{fmtD(r.tenant.moveIn)}</strong></div><div className="tp-row"><span className="tp-label">Lease End</span><strong style={{color:dl&&dl<=30?"#c45c4a":dl&&dl<=90?"#d4a853":"inherit"}}>{fmtD(r.le)}</strong></div>{dl&&<><div className="tp-row"><span className="tp-label">Days Left</span><strong style={{color:dl<=30?"#c45c4a":dl<=90?"#d4a853":"#4a7c59"}}>{dl} days ({months} mo)</strong></div><div style={{height:6,borderRadius:3,background:"#e5e3df",marginTop:8}}><div style={{height:"100%",borderRadius:3,width:`${Math.min(100,Math.max(0,(1-dl/365)*100))}%`,background:dl<=30?"#c45c4a":dl<=90?"#d4a853":"#4a7c59"}}/></div></>}
        <div className="tp-row"><span className="tp-label">Annual Value</span><strong>{fmtS(r.rent*12)}/yr</strong></div>
      </div>
      <div className="tp-card"><h3>💰 Payment — {MO}</h3><div className="tp-row"><span className="tp-label">Status</span><strong style={{color:pd?"#4a7c59":"#c45c4a"}}>{pd?`Paid ${fmtS(pd)}`:`Unpaid — ${fmtS(r.rent)} due`}</strong></div>{!pd&&<button className="btn btn-green" style={{width:"100%",marginTop:8}} onClick={()=>openPayForm(r.id)}>Record Payment →</button>}</div>


      {/* Payment Pattern Badge */}
      {(()=>{
        const rentCharges=charges.filter(c=>c.roomId===r.id&&c.category==="Rent").sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
        if(rentCharges.length===0)return null;
        // Late fee charges for this tenant
        const lateFeeCharges=charges.filter(c=>c.roomId===r.id&&c.category==="Late Fee");
        const totalLateFees=lateFeeCharges.reduce((s,c)=>s+c.amount,0);
        const totalInitialFees=lateFeeCharges.length*50;
        const totalDailyFees=Math.max(0,totalLateFees-totalInitialFees);
        // Per-month data
        const moData=rentCharges.map(c=>{
          const st=chargeStatus(c);
          const paid=c.payments&&c.payments[0];
          const dueDate=new Date(c.dueDate+"T00:00:00");
          const paidDate=paid?new Date(paid.date+"T00:00:00"):null;
          const daysLate=paidDate?Math.max(0,Math.ceil((paidDate-dueDate)/(864e5))):null;
          const isLate=paidDate&&daysLate>3;
          const isPastDue=st==="pastdue";
          const mo=(c.dueDate||"").slice(0,7);
          const label=mo?new Date(mo+"-02").toLocaleString("default",{month:"short",year:"2-digit"}):"—";
          // Find matching late fee charge for this month
          const matchedLateFee=lateFeeCharges.find(lf=>(lf.dueDate||"").slice(0,7)===mo);
          const lateFeeAmt=matchedLateFee?matchedLateFee.amount:0;
          const initFee=lateFeeAmt>0?50:0;
          const dailyFee=Math.max(0,lateFeeAmt-50);
          return{c,st,daysLate,isLate,isPastDue,label,mo,lateFeeAmt,initFee,dailyFee};
        });
        const onTime=moData.filter(m=>!m.isLate&&!m.isPastDue&&(m.st==="paid"||m.st==="waived")).length;
        const lateMonths=moData.filter(m=>m.isLate);
        const pct=rentCharges.length?Math.round(onTime/rentCharges.length*100):0;
        const avgDaysLate=lateMonths.length?Math.round(lateMonths.reduce((s,m)=>s+(m.daysLate||0),0)/lateMonths.length):0;
        const pastDueNow=moData.filter(m=>m.isPastDue).length;
        const badge=pct>=90?"🟢 Great Payer":pct>=70?"🟡 Occasional Late":"🔴 Chronic Late";
        const badgeColor=pct>=90?"#4a7c59":pct>=70?"#9a7422":"#c45c4a";
        const badgeBg=pct>=90?"rgba(74,124,89,.08)":pct>=70?"rgba(212,168,83,.08)":"rgba(196,92,74,.08)";
        const isExp=expanded.payPattern===r.id;
        return(
        <div className="tp-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,payPattern:isExp?null:r.id}))}>
            <h3 style={{margin:0}}>💳 Payment Pattern</h3>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,fontWeight:700,color:badgeColor,background:badgeBg,padding:"3px 10px",borderRadius:100}}>{badge}</span>
              <span style={{fontSize:10,color:"#999"}}>{isExp?"▾":"▸"} Details</span>
            </div>
          </div>

          {isExp&&<div style={{marginTop:12,borderTop:"1px solid rgba(0,0,0,.04)",paddingTop:12}}>

            {/* Summary stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              <div style={{background:"rgba(74,124,89,.04)",borderRadius:6,padding:8,textAlign:"center"}}>
                <div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>On-Time</div>
                <div style={{fontSize:18,fontWeight:800,color:"#4a7c59"}}>{pct}%</div>
                <div style={{fontSize:9,color:"#999"}}>{onTime} of {rentCharges.length} months</div>
              </div>
              <div style={{background:lateMonths.length?"rgba(212,168,83,.04)":"rgba(74,124,89,.04)",borderRadius:6,padding:8,textAlign:"center"}}>
                <div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Avg Days Late</div>
                <div style={{fontSize:18,fontWeight:800,color:lateMonths.length?"#9a7422":"#4a7c59"}}>{lateMonths.length?avgDaysLate:0}</div>
                <div style={{fontSize:9,color:"#999"}}>{lateMonths.length} late month{lateMonths.length!==1?"s":""}</div>
              </div>
              <div style={{background:pastDueNow?"rgba(196,92,74,.04)":"rgba(74,124,89,.04)",borderRadius:6,padding:8,textAlign:"center"}}>
                <div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Past Due Now</div>
                <div style={{fontSize:18,fontWeight:800,color:pastDueNow?"#c45c4a":"#4a7c59"}}>{pastDueNow}</div>
                <div style={{fontSize:9,color:"#999"}}>charge{pastDueNow!==1?"s":""}</div>
              </div>
            </div>

            {/* Late fee summary */}
            {totalLateFees>0&&<div style={{background:"rgba(196,92,74,.04)",border:"1px solid rgba(196,92,74,.1)",borderRadius:8,padding:10,marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,color:"#c45c4a",marginBottom:6}}>💸 Total Late Fees Charged</div>
              <div style={{display:"flex",gap:12,fontSize:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}><span style={{color:"#999"}}>Initial fee ({lateFeeCharges.length}× $50)</span><strong>{fmtS(totalInitialFees)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}><span style={{color:"#999"}}>Daily charges ($5/day)</span><strong>{fmtS(totalDailyFees)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontWeight:800}}><span>Total late fees</span><span style={{color:"#c45c4a"}}>{fmtS(totalLateFees)}</span></div>
                </div>
              </div>
            </div>}

            {/* Month-by-month table */}
            <div style={{fontSize:9,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Month-by-Month</div>
            <div style={{border:"1px solid rgba(0,0,0,.05)",borderRadius:8,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr style={{background:"rgba(0,0,0,.02)"}}>
                    <th style={{padding:"6px 10px",textAlign:"left",fontSize:8,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5}}>Month</th>
                    <th style={{padding:"6px 10px",textAlign:"center",fontSize:8,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5}}>Status</th>
                    <th style={{padding:"6px 10px",textAlign:"center",fontSize:8,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5}}>Days Late</th>
                    <th style={{padding:"6px 10px",textAlign:"right",fontSize:8,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5}}>Late Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {moData.map(({c,st,daysLate,isLate,isPastDue,label,lateFeeAmt,initFee,dailyFee},i)=>{
                    const statusColor=st==="paid"&&!isLate?"#4a7c59":isLate?"#9a7422":isPastDue?"#c45c4a":"#3b82f6";
                    const daysOverdue=isPastDue?Math.ceil((TODAY-new Date(c.dueDate+"T00:00:00"))/(864e5)):0;
                    const statusLabel=st==="paid"&&!isLate?"✓ On-time":isLate?`⚠ ${daysLate}d late`:isPastDue?`${daysOverdue}d overdue`:st==="waived"?"— Waived":"○ Unpaid";
                    return(
                    <tr key={c.id} style={{borderTop:i>0?"1px solid rgba(0,0,0,.03)":"none",background:isPastDue?"rgba(196,92,74,.02)":isLate?"rgba(212,168,83,.02)":"transparent"}}>
                      <td style={{padding:"7px 10px",fontWeight:600}}>{label}</td>
                      <td style={{padding:"7px 10px",textAlign:"center"}}><span style={{fontSize:10,fontWeight:700,color:statusColor}}>{statusLabel}</span></td>
                      <td style={{padding:"7px 10px",textAlign:"center"}}>
                        {isLate&&daysLate!==null
                          ?<span style={{fontWeight:700,color:daysLate>=14?"#c45c4a":daysLate>=7?"#9a7422":"#d4a853"}}>{daysLate}d</span>
                          :isPastDue
                          ?<span style={{fontWeight:700,color:"#c45c4a"}}>{daysOverdue}d</span>
                          :<span style={{color:"#ccc"}}>—</span>}
                      </td>
                      <td style={{padding:"7px 10px",textAlign:"right"}}>
                        {lateFeeAmt>0
                          ?<div>
                            <div style={{fontWeight:700,color:"#c45c4a"}}>{fmtS(lateFeeAmt)}</div>
                            <div style={{fontSize:9,color:"#999"}}>${initFee} base{dailyFee>0?` + $${dailyFee} (${Math.round(dailyFee/5)}d × $5)`:""}</div>
                          </div>
                          :isPastDue
                          ?(()=>{
                            const graceDays=3;
                            const daysOverdue2=Math.ceil((TODAY-new Date(c.dueDate+"T00:00:00"))/(864e5));
                            const daysChargeable2=Math.max(0,daysOverdue2-graceDays);
                            if(daysChargeable2<=0)return<span style={{fontSize:10,color:"#999"}}>In grace period</span>;
                            const accruing=50+daysChargeable2*5;
                            return(<div>
                              <div style={{fontWeight:700,color:"#c45c4a",animation:"pulse 1.5s ease-in-out infinite"}}>{fmtS(accruing)}</div>
                              <div style={{fontSize:9,color:"#c45c4a",opacity:.7}}>$50 + {daysChargeable2*5} ({daysChargeable2}d × $5)</div>
                            </div>);
                          })()
                          :<span style={{color:"#ccc",fontSize:10}}>—</span>}
                      </td>
                    </tr>);
                  })}
                </tbody>
                {totalLateFees>0&&<tfoot>
                  <tr style={{borderTop:"2px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.01)"}}>
                    <td colSpan={3} style={{padding:"7px 10px",fontWeight:700,fontSize:11}}>Total Late Fees</td>
                    <td style={{padding:"7px 10px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(totalLateFees)}</td>
                  </tr>
                </tfoot>}
              </table>
            </div>
            <div style={{display:"flex",gap:12,marginTop:8,fontSize:9,color:"#999"}}>
              <span style={{color:"#4a7c59"}}>✓ On-time (within 3 days)</span>
              <span style={{color:"#9a7422"}}>⚠ Paid late</span>
              <span style={{color:"#c45c4a"}}>🔴 Still overdue</span>
            </div>
          </div>}
        </div>);
      })()}

      {/* Payment Ledger */}
      {(()=>{
        const tenantCharges=charges.filter(c=>c.roomId===r.id).sort((a,b)=>new Date(b.dueDate)-new Date(a.dueDate));
        const pastDueC=tenantCharges.filter(c=>chargeStatus(c)==="pastdue").length;
        const totalPaid=tenantCharges.reduce((s,c)=>s+c.amountPaid,0);

        // Category visual config
        const catStyle={
          "Rent":          {icon:"🏠",bg:"rgba(59,130,246,.06)",border:"rgba(59,130,246,.15)",color:"#3b82f6",label:"Rent"},
          "Late Fee":      {icon:"⚠️",bg:"rgba(196,92,74,.06)",border:"rgba(196,92,74,.2)",color:"#c45c4a",label:"Late Fee"},
          "Utility Overage":{icon:"⚡",bg:"rgba(212,168,83,.06)",border:"rgba(212,168,83,.2)",color:"#9a7422",label:"Utility"},
          "Security Deposit":{icon:"🔒",bg:"rgba(139,92,246,.06)",border:"rgba(139,92,246,.15)",color:"#7c3aed",label:"Security Deposit"},
          "Damage Charge": {icon:"🔨",bg:"rgba(196,92,74,.04)",border:"rgba(196,92,74,.1)",color:"#c45c4a",label:"Damage"},
          "Cleaning Fee":  {icon:"🧹",bg:"rgba(74,124,89,.04)",border:"rgba(74,124,89,.1)",color:"#4a7c59",label:"Cleaning"},
          "Move-In Fee":   {icon:"📦",bg:"rgba(59,130,246,.04)",border:"rgba(59,130,246,.1)",color:"#3b82f6",label:"Move-In"},
          "Move-Out Fee":  {icon:"📦",bg:"rgba(212,168,83,.04)",border:"rgba(212,168,83,.1)",color:"#9a7422",label:"Move-Out"},
          "Lock Change":   {icon:"🔑",bg:"rgba(0,0,0,.03)",border:"rgba(0,0,0,.08)",color:"#5c4a3a",label:"Lock"},
          "Key Replacement":{icon:"🗝️",bg:"rgba(0,0,0,.03)",border:"rgba(0,0,0,.08)",color:"#5c4a3a",label:"Key"},
          "Pet Violation": {icon:"🐾",bg:"rgba(196,92,74,.04)",border:"rgba(196,92,74,.1)",color:"#c45c4a",label:"Violation"},
          "Smoking Violation":{icon:"🚭",bg:"rgba(196,92,74,.04)",border:"rgba(196,92,74,.1)",color:"#c45c4a",label:"Violation"},
          "Guest Violation":{icon:"🚷",bg:"rgba(196,92,74,.04)",border:"rgba(196,92,74,.1)",color:"#c45c4a",label:"Violation"},
        };
        const cs=(cat)=>catStyle[cat]||{icon:"💳",bg:"rgba(0,0,0,.02)",border:"rgba(0,0,0,.06)",color:"#999",label:cat};

        // Compute rolling accrued late fee for a past-due charge
        const accruedLateFee=(c)=>{
          if(c.noLateFee)return null;// SD, move-in charges exempt
          if(chargeStatus(c)!=="pastdue"||c.category!=="Rent")return null;
          const dueDate=new Date(c.dueDate+"T00:00:00");
          const graceDays=3;
          const daysOverdue=Math.ceil((TODAY-dueDate)/(864e5));
          if(daysOverdue<=graceDays)return null;
          const daysChargeable=daysOverdue-graceDays;
          return{initial:50,daily:daysChargeable*5,total:50+daysChargeable*5,daysChargeable};
        };

        return(
        <div className="tp-card"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><h3 style={{margin:0}}>📒 Payment Ledger</h3><button className="btn btn-out btn-sm" onClick={()=>{setTab("accounting");setLedgerTenant(r.id);setModal(null);}}>View Full Ledger →</button></div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1,background:"rgba(74,124,89,.04)",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Total Paid</div><div style={{fontSize:16,fontWeight:800,color:"#4a7c59"}}>{fmtS(totalPaid)}</div></div>
            <div style={{flex:1,background:"rgba(0,0,0,.02)",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Charges</div><div style={{fontSize:16,fontWeight:800}}>{tenantCharges.length}</div></div>
            <div style={{flex:1,background:pastDueC?"rgba(196,92,74,.04)":"rgba(74,124,89,.04)",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:8,color:"#999",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Overdue</div><div style={{fontSize:16,fontWeight:800,color:pastDueC?"#c45c4a":"#4a7c59"}}>{pastDueC}</div></div>
          </div>

          {tenantCharges.length>0?tenantCharges.map(c=>{
            const st=chargeStatus(c);
            const isExp=expCharge===c.id;
            const rem=c.amount-c.amountPaid;
            const confId=`BB-${c.id.slice(0,8).toUpperCase()}`;
            const style=cs(c.category);
            const accrued=accruedLateFee(c);
            return(
            <div key={c.id} style={{marginBottom:6}}>
              {/* Main charge row */}
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:8,border:`1px solid ${st==="pastdue"?"rgba(196,92,74,.25)":style.border}`,background:st==="pastdue"?"rgba(196,92,74,.03)":isExp?style.bg:style.bg,cursor:"pointer",transition:"all .1s"}} onClick={()=>setExpCharge(isExp?null:c.id)}>
                <div style={{fontSize:16,flexShrink:0}}>{style.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:11,color:style.color}}>{style.label}</span>
                    <span style={{fontSize:11,color:"#5c4a3a",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.desc}</span>
                  </div>
                  <div style={{fontSize:10,color:"#999",marginTop:1}}>Due {fmtD(c.dueDate)}{c.payments.length>0?` · ${c.payments.length} payment${c.payments.length>1?"s":""}`:""}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontWeight:800,fontSize:13}}>{fmtS(c.amount)}</div>
                  <span className={`badge ${st==="paid"?"b-green":st==="pastdue"?"b-red":st==="partial"?"b-gold":st==="waived"?"b-gray":"b-blue"}`} style={{fontSize:7}}>{st}</span>
                </div>
              </div>

              {/* Rolling late fee accrual banner */}
              {accrued&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.2)",borderTop:"none",borderRadius:"0 0 8px 8px",fontSize:11}}>
                <div style={{color:"#c45c4a"}}>
                  <span style={{fontWeight:700}}>⚠️ Late fee accruing:</span> {accrued.initial} base + {accrued.daily} ({accrued.daysChargeable}d × $5)
                </div>
                <div style={{fontWeight:800,color:"#c45c4a",fontSize:13}}>{fmtS(accrued.total)}</div>
              </div>}

              {/* Expanded payment detail */}
              {isExp&&<div style={{padding:"10px 12px",background:"#f8f7f4",border:`1px solid ${style.border}`,borderTop:"none",borderRadius:"0 0 8px 8px",animation:"fadeIn .15s",fontSize:11}}>
                {c.payments.length>0&&c.payments.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.03)"}}>
                  <span>{fmtD(p.date)} · {p.method}{p.notes?` · ${p.notes}`:""}</span><strong style={{color:"#4a7c59"}}>{fmtS(p.amount)}</strong>
                </div>)}
                {st==="paid"&&<div style={{fontSize:10,color:"#4a7c59",marginTop:4}}>Confirmed · {confId}</div>}
                {st!=="paid"&&st!=="waived"&&<div style={{display:"flex",gap:4,marginTop:8}}>
                  <button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});}}>💰 Record Payment</button>
                  <button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setTab("payments");setPaySubTab("charges");setPayFilters({...payFilters,tenant:c.tenantName});setModal(null);}}>View in Charges →</button>
                </div>}
              </div>}
            </div>);}
          ):<div style={{textAlign:"center",padding:16,color:"#999",fontSize:11}}>No charges yet. Rent charges auto-generate on the 20th for next month.</div>}
        </div>);})()}

      {/* Lease Actions */}
      <div className="tp-card" id="lease-actions-section"><h3>⚡ Lease Actions</h3>
        <div style={{fontSize:11,color:"#5c4a3a",marginBottom:10}}>Lease renewals happen when the tenant signs a new lease. Use the actions below to manage room assignments or end the lease.</div>
        {(()=>{const allVacant=props.flatMap(pr=>(pr.units||[]).flatMap(u=>(u.rooms||[]).filter(x=>x.st==="vacant").map(x=>({...x,propName:pr.name,propId:pr.id,unitId:u.id,propUtils:u.utils||pr.utils}))));return allVacant.length>0?(
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#999",marginBottom:6}}>MOVE TO DIFFERENT ROOM (ADDENDUM)</div>
            <button className="btn btn-out btn-sm" onClick={()=>setModal(prev=>({...prev,moveStep:1,moveTarget:null,moveDate:"immediately",moveCustomDate:TODAY.toISOString().split("T")[0],moveNewRent:null,moveNotes:"",moveAllVacant:allVacant}))}>Begin Room Move Process →</button>
          </div>
        ):null;})()}
        <div style={{fontSize:10,fontWeight:700,color:"#c45c4a",marginBottom:6,marginTop:8}}>TERMINATE LEASE</div>
        <button className="btn btn-red btn-sm" onClick={()=>setModal(prev=>({...prev,termStep:1,termDate:r.le||TODAY.toISOString().split("T")[0],termNotes:""}))}>Begin Termination Process</button>
      </div>

      {/* Room Move - Step 1: Select Room */}
      {modal.moveStep===1&&<div style={{background:"rgba(59,130,246,.04)",border:"2px solid rgba(59,130,246,.15)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
        <h3 style={{fontSize:14,fontWeight:800,color:"#3b82f6",marginBottom:10}}>Move Room — Step 1: Select New Room</h3>
        <p style={{fontSize:12,color:"#5c4a3a",marginBottom:12}}>Select the vacant room to move {r.tenant.name} into. This creates a lease addendum — the existing lease stays, only room/rent/utility details change.</p>
        {(modal.moveAllVacant||[]).map(vr=>{const isSelected=modal.moveTarget===vr.id;const rentDiff=vr.rent-r.rent;const sdDiff=vr.rent-r.rent;const utilChange=vr.propUtils!==r.propUtils;return(
          <div key={vr.id} style={{padding:10,border:`2px solid ${isSelected?"#3b82f6":"rgba(0,0,0,.06)"}`,borderRadius:8,marginBottom:6,cursor:"pointer",background:isSelected?"rgba(59,130,246,.04)":"#fff",transition:"all .15s"}} onClick={()=>setModal(prev=>({...prev,moveTarget:vr.id,moveNewRent:vr.rent}))}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:13,fontWeight:700}}>{vr.name}</div><div style={{fontSize:10,color:"#999"}}>{vr.propName} · {vr.pb?"Private":"Shared"} bath · {vr.sqft||"—"} sqft</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800}}>{fmtS(vr.rent)}/mo</div>
                {rentDiff!==0&&<div style={{fontSize:10,fontWeight:700,color:rentDiff>0?"#c45c4a":"#4a7c59"}}>{rentDiff>0?`+${fmtS(rentDiff)} upgrade`:`${fmtS(rentDiff)} downgrade`}</div>}
                {utilChange&&<div style={{fontSize:9,color:"#d4a853",fontWeight:600}}>⚠ Utility model changes</div>}
              </div>
            </div>
            {sdDiff!==0&&<div style={{fontSize:10,color:sdDiff>0?"#c45c4a":"#4a7c59",marginTop:4}}>SD adjustment: {sdDiff>0?`Tenant owes ${fmtS(sdDiff)} additional deposit`:`${fmtS(Math.abs(sdDiff))} credit applied from overage`}</div>}
          </div>);})}
        <div style={{display:"flex",gap:6,marginTop:10}}>
          <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,moveStep:undefined}))}>Cancel</button>
          <button className="btn btn-dk" style={{flex:1}} onClick={()=>{
            if(!modal.moveTarget){shakeModal();return;}
            setModal(prev=>({...prev,moveStep:2}));
          }}>Continue →</button>
        </div>
      </div>}

      {/* Room Move - Step 2: Details */}
      {modal.moveStep===2&&(()=>{const target=(modal.moveAllVacant||[]).find(x=>x.id===modal.moveTarget);if(!target)return null;const sdDiff=target.rent-r.rent;const utilChange=target.propUtils!==(r.propUtils||r.utils);return(
        <div style={{background:"rgba(59,130,246,.04)",border:"2px solid rgba(59,130,246,.15)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#3b82f6",marginBottom:10}}>Move Room — Step 2: Details</h3>
          <div className="fld"><label>New Rent (defaults to room price, editable for negotiation)</label><input type="number" value={modal.moveNewRent||target.rent} onChange={e=>setModal(prev=>({...prev,moveNewRent:Number(e.target.value)}))}/></div>
          <div className="fld"><label>Effective Date</label>
            <div style={{display:"flex",gap:4,marginBottom:6}}>
              {[["immediately","Immediately"],["endOfMonth","End of This Month"],["custom","Custom Date"]].map(([v,l])=>(
                <button key={v} className={`btn ${modal.moveDate===v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setModal(prev=>({...prev,moveDate:v}))}>{l}</button>
              ))}
            </div>
            {modal.moveDate==="custom"&&<input type="date" value={modal.moveCustomDate} onChange={e=>setModal(prev=>({...prev,moveCustomDate:e.target.value}))}/>}
          </div>
          {utilChange&&<div style={{background:"rgba(212,168,83,.08)",borderRadius:6,padding:10,marginBottom:8,fontSize:11,color:"#9a7422"}}><strong>⚠ Utility model change:</strong> Moving from {r.propUtils==="allIncluded"?"All Included (landlord pays)":"Tenant Pays (split)"} to {target.propUtils==="allIncluded"?"All Included (landlord pays)":"Tenant Pays (split)"}. The addendum should reflect this.</div>}
          {sdDiff!==0&&<div style={{background:sdDiff>0?"rgba(196,92,74,.04)":"rgba(74,124,89,.04)",borderRadius:6,padding:10,marginBottom:8,fontSize:11,color:sdDiff>0?"#c45c4a":"#4a7c59"}}><strong>SD Adjustment:</strong> {sdDiff>0?`Tenant owes ${fmtS(sdDiff)} additional deposit (upgrade). An invoice will be generated.`:`${fmtS(Math.abs(sdDiff))} overage from current SD will be credited (downgrade).`}</div>}
          <div className={`fld ${modal.moveErrs&&modal.moveErrs.notes?"field-err":""}`}>
            <label className={modal.moveErrs&&modal.moveErrs.notes?"field-err-label":""}>Reason for Move (required)</label>
            <textarea value={modal.moveNotes||""} onChange={e=>setModal(prev=>({...prev,moveNotes:e.target.value,moveErrs:{...(prev.moveErrs||{}),notes:null}}))} placeholder="e.g. Tenant requested upgrade to private bath, roommate conflict, etc." rows={2}/>
            {modal.moveErrs&&modal.moveErrs.notes&&<div className="err-msg">{modal.moveErrs.notes}</div>}
          </div>
          <div style={{display:"flex",gap:6,marginTop:10}}>
            <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,moveStep:1}))}>← Back</button>
            <button className="btn btn-dk" style={{flex:1}} onClick={()=>{
              if(!(modal.moveNotes||"").trim()){setModal(prev=>({...prev,moveErrs:{notes:"Reason is required"}}));shakeModal();return;}
              setModal(prev=>({...prev,moveStep:3,moveErrs:{}}));
            }}>Review →</button>
          </div>
        </div>);})()}

      {/* Room Move - Step 3: Review & Confirm */}
      {modal.moveStep===3&&(()=>{const target=(modal.moveAllVacant||[]).find(x=>x.id===modal.moveTarget);if(!target)return null;const newRent=modal.moveNewRent||target.rent;const sdDiff=newRent-r.rent;
        const effDate=modal.moveDate==="immediately"?TODAY.toISOString().split("T")[0]:modal.moveDate==="endOfMonth"?`${TODAY.getFullYear()}-${(TODAY.getMonth()+1).toString().padStart(2,"0")}-${new Date(TODAY.getFullYear(),TODAY.getMonth()+1,0).getDate()}`:modal.moveCustomDate;
        const executeMove=()=>{
          setProps(p=>p.map(pr=>({...pr,units:(pr.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(rm=>{
            if(rm.id===r.id)return{...rm,st:"vacant",le:null,tenant:null};
            if(rm.id===target.id)return{...rm,st:"occupied",le:r.le,tenant:r.tenant,rent:newRent};
            return rm;
          })}))})));
          // Generate SD adjustment invoice if upgrade
          if(sdDiff>0){createCharge({roomId:target.id,tenantName:r.tenant.name,propName:target.propName,roomName:target.name,category:"Security Deposit",desc:`SD Adjustment — Upgrade from ${r.name} to ${target.name}`,amount:sdDiff,dueDate:effDate});}
          // Generate next month's rent invoice at new rate
          const nextMo=new Date(TODAY.getFullYear(),TODAY.getMonth()+1,1);
          const nextMoDue=`${nextMo.getFullYear()}-${(nextMo.getMonth()+1).toString().padStart(2,"0")}-01`;
          const nextMoLabel=nextMo.toLocaleString("default",{month:"long",year:"numeric"});
          createCharge({roomId:target.id,tenantName:r.tenant.name,propName:target.propName,roomName:target.name,category:"Rent",desc:`${nextMoLabel} Rent — ${target.name} (post-move)`,amount:newRent,dueDate:nextMoDue});
          // Generate utility placeholder only if moving from all-included to tenant-pays
          if(r.propUtils==="allIncluded"&&target.propUtils==="first100"){
            createCharge({roomId:target.id,tenantName:r.tenant.name,propName:target.propName,roomName:target.name,category:"Utility Overage",desc:`${nextMoLabel} Utilities — ${target.name} (enter actual amount)`,amount:0,dueDate:nextMoDue});
          }
          // Generate addendum document
          const addendumContent={tenant:r.tenant.name,email:r.tenant.email,phone:r.tenant.phone,originalRoom:r.name,originalProp:r.propName,newRoom:target.name,newProp:target.propName,originalRent:r.rent,newRent,effDate,reason:modal.moveNotes,sdOrig:r.rent,sdAdj:sdDiff,sdNew:newRent,utilChange,utilFrom:r.propUtils||r.utils,utilTo:target.propUtils,createdDate:TODAY.toISOString().split("T")[0]};
          const addendumDoc={id:uid(),name:`Lease Addendum — ${r.tenant.name} (${r.name} → ${target.name})`,type:"addendum",property:target.propName,tenant:r.tenant.name,tenantRoomId:target.id,uploaded:TODAY.toISOString().split("T")[0],size:"4 KB",content:addendumContent};
          setDocs(prev=>[addendumDoc,...prev]);
          setNotifs(p=>[{id:uid(),type:"lease",msg:`Room move: ${r.tenant.name} moved from ${r.name} to ${target.name} at ${target.propName}. Addendum generated. Next month rent invoice at ${fmtS(newRent)}.`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
          setModal(null);
        };
        return(
        <div style={{background:"rgba(59,130,246,.06)",border:"2px solid rgba(59,130,246,.25)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
          <h3 style={{fontSize:14,fontWeight:800,color:"#3b82f6",marginBottom:10}}>Confirm Room Move — Lease Addendum</h3>
          <div style={{fontSize:12,color:"#5c4a3a",lineHeight:1.8}}>
            <strong>Tenant:</strong> {r.tenant.name}<br/>
            <strong>From:</strong> {r.name} at {r.propName} ({fmtS(r.rent)}/mo)<br/>
            <strong>To:</strong> {target.name} at {target.propName} ({fmtS(newRent)}/mo)<br/>
            <strong>Effective:</strong> {fmtD(effDate)}<br/>
            <strong>Rent Change:</strong> {newRent===r.rent?"No change":newRent>r.rent?`+${fmtS(newRent-r.rent)}/mo increase`:`${fmtS(newRent-r.rent)}/mo decrease`}<br/>
            {sdDiff>0&&<><strong>SD Invoice:</strong> {fmtS(sdDiff)} additional deposit due<br/></>}
            {sdDiff<0&&<><strong>SD Credit:</strong> {fmtS(Math.abs(sdDiff))} applied from overage<br/></>}
            <strong>Reason:</strong> {modal.moveNotes}
          </div>
          <div style={{background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.15)",borderRadius:8,padding:10,marginTop:10,fontSize:11}}>
            <div style={{fontWeight:700,color:"#4a7c59",marginBottom:4}}>📄 Invoices that will be auto-generated:</div>
            {sdDiff>0&&<div style={{padding:"2px 0"}}>• SD Adjustment — {fmtS(sdDiff)}</div>}
            <div style={{padding:"2px 0"}}>• Next month rent at {fmtS(newRent)} (due 1st)</div>
            {r.propUtils==="allIncluded"&&target.propUtils==="first100"&&<div style={{padding:"2px 0",color:"#9a7422"}}>• Utility placeholder — $0 (update with actual amount)</div>}
          </div>
          <div style={{display:"flex",gap:6,marginTop:12}}>
            <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,moveStep:2}))}>← Back</button>
            <button className="btn btn-green" style={{flex:1}} onClick={executeMove}>Confirm Move</button>
          </div>
        </div>);})()}

      {/* Termination flow - Step 1: Confirm */}
      {modal.termStep===1&&<div style={{background:"rgba(196,92,74,.04)",border:"2px solid rgba(196,92,74,.15)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
        <h3 style={{fontSize:14,fontWeight:800,color:"#c45c4a",marginBottom:10}}>⚠ Terminate Lease — {r.tenant.name}</h3>
        <p style={{fontSize:12,color:"#5c4a3a",marginBottom:12}}>This will end {r.tenant.name}'s lease, unlink them from {r.name}, and mark the room as vacant. This action cannot be undone.</p>
        <div className={`fld ${modal.termErrs&&modal.termErrs.date?"field-err":""}`}>
          <label className={modal.termErrs&&modal.termErrs.date?"field-err-label":""}>Termination Date</label>
          <input type="date" value={modal.termDate} onChange={e=>setModal(prev=>({...prev,termDate:e.target.value,termErrs:{...(prev.termErrs||{}),date:null}}))}/>
          {modal.termErrs&&modal.termErrs.date&&<div className="err-msg">{modal.termErrs.date}</div>}
        </div>
        <div className={`fld ${modal.termErrs&&modal.termErrs.notes?"field-err":""}`}>
          <label className={modal.termErrs&&modal.termErrs.notes?"field-err-label":""}>Reason / Notes (required)</label>
          <textarea value={modal.termNotes||""} onChange={e=>setModal(prev=>({...prev,termNotes:e.target.value,termErrs:{...(prev.termErrs||{}),notes:null}}))} placeholder="e.g. Tenant gave 30-day notice, relocating for work..." rows={3}/>
          {modal.termErrs&&modal.termErrs.notes&&<div className="err-msg">{modal.termErrs.notes}</div>}
        </div>
        <div style={{display:"flex",gap:6,marginTop:10}}>
          <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,termStep:undefined}))}>Cancel</button>
          <button className="btn btn-red" style={{flex:1}} onClick={()=>{
            const e={};
            if(!(modal.termDate||"").trim())e.date="Termination date is required";
            if(!(modal.termNotes||"").trim())e.notes="Reason is required";
            if(Object.keys(e).length){setModal(prev=>({...prev,termErrs:e}));shakeModal();return;}
            setModal(prev=>({...prev,termStep:2,termErrs:{}}));
          }}>Continue →</button>
        </div>
      </div>}

      {/* Termination flow - Step 2: Final confirm */}
      {modal.termStep===2&&<div style={{background:"rgba(196,92,74,.06)",border:"2px solid rgba(196,92,74,.25)",borderRadius:10,padding:16,marginTop:10,animation:"fadeIn .2s"}}>
        <h3 style={{fontSize:14,fontWeight:800,color:"#c45c4a",marginBottom:10}}>Confirm Termination</h3>
        <div style={{fontSize:12,color:"#5c4a3a",lineHeight:1.8,background:"rgba(0,0,0,.03)",borderRadius:8,padding:12,marginBottom:14}}>
          <strong>Tenant:</strong> {r.tenant.name}<br/>
          <strong>Room:</strong> {r.name} at {r.propName}<br/>
          <strong>Rent:</strong> {fmtS(r.rent)}/mo ({fmtS(r.rent*12)}/yr lost)<br/>
          <strong>Termination Date:</strong> {fmtD(modal.termDate)}<br/>
          <strong>Reason:</strong> {modal.termNotes}
        </div>

        {/* SD Acknowledgment */}
        <div className={`fld ${modal.termErrs&&modal.termErrs.sd?"field-err":""}`}>
          <label className={modal.termErrs&&modal.termErrs.sd?"field-err-label":""}>Security Deposit Status (required)</label>
          <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
            {[["kept","🔒 Kept (tenant forfeits)"],["returned","✅ Returned to tenant"],["partial","⚖️ Partial return"],["other","📝 Other"]].map(([v,l])=>(
              <button key={v} className={`btn btn-sm ${modal.termSdStatus===v?"btn-dk":"btn-out"}`}
                style={{border:modal.termErrs&&modal.termErrs.sd&&!modal.termSdStatus?"1px solid #c45c4a":""}}
                onClick={()=>setModal(prev=>({...prev,termSdStatus:v,termErrs:{...(prev.termErrs||{}),sd:null}}))}>
                {l}
              </button>
            ))}
          </div>
          {(modal.termSdStatus==="partial"||modal.termSdStatus==="other")&&
            <input value={modal.termSdNote||""} onChange={e=>setModal(prev=>({...prev,termSdNote:e.target.value}))}
              placeholder={modal.termSdStatus==="partial"?"e.g. $200 returned, $450 kept for damages...":"Explain SD disposition..."}
              style={{marginTop:6,width:"100%",padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:12,fontFamily:"inherit"}}/>}
          {modal.termErrs&&modal.termErrs.sd&&<div className="err-msg">{modal.termErrs.sd}</div>}
        </div>

        {/* Type tenant name to confirm */}
        <div className={`fld ${modal.termErrs&&modal.termErrs.confirm?"field-err":""}`}>
          <label className={modal.termErrs&&modal.termErrs.confirm?"field-err-label":""}>
            Type <strong>{r.tenant.name}</strong> to confirm
          </label>
          <input value={modal.termConfirm||""} onChange={e=>setModal(prev=>({...prev,termConfirm:e.target.value,termErrs:{...(prev.termErrs||{}),confirm:null}}))}
            placeholder={r.tenant.name}/>
          {modal.termErrs&&modal.termErrs.confirm&&<div className="err-msg">{modal.termErrs.confirm}</div>}
        </div>

        <div style={{display:"flex",gap:6,marginTop:12}}>
          <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,termStep:1,termErrs:{}}))}>← Back</button>
          <button className="btn btn-red" style={{flex:1}} onClick={()=>{
            const e={};
            if(!modal.termSdStatus)e.sd="Select security deposit status";
            if((modal.termConfirm||"").trim()!==r.tenant.name)e.confirm=`Must match exactly: "${r.tenant.name}"`;
            if(Object.keys(e).length){setModal(prev=>({...prev,termErrs:e}));shakeModal();return;}
            setArchive(prev=>[{id:uid(),name:r.tenant.name,email:r.tenant.email,phone:r.tenant.phone,roomName:r.name,propName:r.propName,rent:r.rent,moveIn:r.tenant.moveIn,leaseEnd:r.le,terminatedDate:modal.termDate,reason:modal.termNotes,sdStatus:modal.termSdStatus,sdNote:modal.termSdNote||"",payments:payments[r.id]||{},archivedOn:TODAY.toISOString().split("T")[0]},...prev]);
            setProps(p=>updateRoomInProps(p,r.id,rm=>({...rm,st:"vacant",le:null,tenant:null})));
            setNotifs(p=>[{id:uid(),type:"lease",msg:`Lease terminated: ${r.tenant.name} — ${r.name} at ${r.propName}. SD: ${modal.termSdStatus}. Reason: ${modal.termNotes}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
            setModal(null);
          }}>Confirm Termination</button>
        </div>
      </div>}

      {dl&&dl<=90&&!modal.termStep&&<div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:12,color:"#5c4a3a"}}><strong>Action needed:</strong> Lease expires in {dl} days. This room generates {fmtS(r.rent)}/mo ({fmtS(r.rent*12)}/yr). Reach out to {r.tenant.name.split(" ")[0]} about renewing, or start looking for a replacement.</div>}
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Close</button></div>
    </div></div>);})()}

  {/* Record Payment Modal */}
  {/* Confirm Action Modal — generic destructive confirmation */}
  {modal&&modal.type==="confirmAction"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>{modal.title||"Are you sure?"}</h2>
      <p style={{fontSize:13,color:"#5c4a3a",marginBottom:20,lineHeight:1.6}}>{modal.body}</p>
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className={`btn ${modal.confirmStyle||"btn-red"}`} onClick={()=>{if(modal.onConfirm)modal.onConfirm();}}>{modal.confirmLabel||"Confirm"}</button>
      </div>
    </div></div>
  )}
  {/* Save Theme Modal */}
  {modal&&modal.type==="saveTheme"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:380}}>
      <h2>Save Theme</h2>
      <div style={{display:"flex",gap:3,marginBottom:12}}>{[theme.bg,theme.card,theme.accent,theme.text,theme.green,theme.muted].map((c,i)=><div key={i} style={{width:24,height:24,borderRadius:4,background:c,border:"1px solid rgba(0,0,0,.1)"}}/>)}</div>
      <div className="fld"><label>Theme Name</label><input value={modal.themeName||""} onChange={e=>setModal(prev=>({...prev,themeName:e.target.value}))} placeholder="e.g. Spring 2026, Dark Mode, Client Pitch..." autoFocus onKeyDown={e=>{if(e.key==="Enter"&&(modal.themeName||"").trim()){setSavedThemes(p=>[...p,{id:uid(),name:modal.themeName.trim(),colors:{...theme},savedDate:TODAY.toISOString().split("T")[0]}]);setModal(null);}}}/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-gold" disabled={!(modal.themeName||"").trim()} onClick={()=>{setSavedThemes(p=>[...p,{id:uid(),name:modal.themeName.trim(),colors:{...theme},savedDate:TODAY.toISOString().split("T")[0]}]);setModal(null);}}>Save</button></div>
    </div></div>
  )}

  {/* Waive Charge Modal */}
  {modal&&modal.type==="sendReminder"&&(()=>{
    const c=modal.charge;
    const tenantRoom=props.flatMap(p=>allRooms(p)).find(r=>r.id===c.roomId);
    const tenant=tenantRoom&&tenantRoom.tenant;
    const phone=tenant&&tenant.phone;
    const email=tenant&&tenant.email;
    const portalLink="https://rentblackbear.com/portal";
    const template=settings.reminderTemplate||DEF_SETTINGS.reminderTemplate;
    const buildMsg=(tmpl)=>tmpl
      .replace(/{firstName}/g,c.tenantName.split(" ")[0])
      .replace(/{fullName}/g,c.tenantName)
      .replace(/{category}/g,c.category)
      .replace(/{amount}/g,fmtS(modal.rem))
      .replace(/{dueDate}/g,fmtD(c.dueDate))
      .replace(/{portalLink}/g,portalLink);
    const defaultMsg=buildMsg(template);
    const emailSubject=`Payment Reminder — ${c.category} ${fmtS(modal.rem)} Due`;
    const send=(method,customMsg)=>{
      if(method==="email"&&email){window.open(`mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(customMsg)}`);}
      if(method==="text"&&phone){window.open(`sms:${phone.replace(/\D/g,"")}?body=${encodeURIComponent(customMsg)}`);}
      setCharges(p=>p.map(x=>x.id===c.id?{...x,reminders:[...(x.reminders||[]),{method,date:TODAY.toISOString().split("T")[0]}]}:x));
      setNotifs(p=>[{id:uid(),type:"payment",msg:`Reminder sent to ${c.tenantName} via ${method}: ${c.category} ${fmtS(modal.rem)} due ${fmtD(c.dueDate)}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
      setModal(null);
    };
    const reminderMsg=modal.reminderMsg!==undefined?modal.reminderMsg:defaultMsg;
    const isEdited=reminderMsg!==defaultMsg;
    const editingDefault=modal.editingDefault||false;
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
      <h2>📣 Send Reminder</h2>
      <div style={{background:"rgba(196,92,74,.04)",border:"1px solid rgba(196,92,74,.1)",borderRadius:8,padding:12,marginBottom:14,fontSize:12}}>
        <div style={{fontWeight:700,marginBottom:2}}>{c.tenantName}</div>
        <div style={{color:"#999"}}>{c.category} — {fmtS(modal.rem)} overdue since {fmtD(c.dueDate)}</div>
      </div>

      <div className="fld" style={{marginBottom:6}}>
        <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>Message</span>
          <div style={{display:"flex",gap:4}}>
            {isEdited&&!editingDefault&&<button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={()=>setModal(prev=>({...prev,reminderMsg:defaultMsg}))}>↺ Reset</button>}
            {!editingDefault&&<button className="btn btn-gold btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={()=>setModal(prev=>({...prev,editingDefault:true,reminderMsg:template}))}>✏️ Edit Default</button>}
            {editingDefault&&<span style={{fontSize:9,color:"#d4a853",fontWeight:700}}>Editing saved default</span>}
          </div>
        </label>

        {editingDefault
          ?<>
            <textarea value={reminderMsg} onChange={e=>setModal(prev=>({...prev,reminderMsg:e.target.value}))} rows={5} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"2px solid rgba(212,168,83,.4)",fontSize:11,fontFamily:"inherit",resize:"vertical",lineHeight:1.6,background:"rgba(212,168,83,.02)"}}/>
            <div style={{display:"flex",gap:6,marginTop:8}}>
              <button className="btn btn-out btn-sm" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,editingDefault:false,reminderMsg:defaultMsg}))}>Cancel</button>
              <button className="btn btn-gold" style={{flex:2}} onClick={()=>{
                setSettings(s=>({...s,reminderTemplate:reminderMsg}));
                setModal(prev=>({...prev,editingDefault:false,reminderMsg:undefined}));
              }}>💾 Save as Default</button>
            </div>
          </>
          :<textarea value={reminderMsg} onChange={e=>setModal(prev=>({...prev,reminderMsg:e.target.value}))} rows={5} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:`1px solid ${isEdited?"rgba(212,168,83,.3)":"rgba(0,0,0,.08)"}`,fontSize:11,fontFamily:"inherit",resize:"vertical",lineHeight:1.6}}/>
        }
      </div>

      {!editingDefault&&<>
        <div style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Send via</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>send("email",reminderMsg)} disabled={!email}
            style={{flex:1,padding:"14px 8px",borderRadius:8,border:"2px solid #3b82f6",background:"rgba(59,130,246,.06)",cursor:email?"pointer":"not-allowed",opacity:email?1:.5,textAlign:"center",fontFamily:"inherit",transition:"all .15s"}}
            onMouseEnter={e=>{if(email)e.currentTarget.style.background="rgba(59,130,246,.12)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(59,130,246,.06)"}}>
            <div style={{fontSize:20,marginBottom:4}}>✉️</div>
            <div style={{fontSize:12,fontWeight:700,color:"#3b82f6"}}>Email</div>
            <div style={{fontSize:9,color:"#3b82f6",opacity:.7,marginTop:2}}>{email||"No email on file"}</div>
          </button>
          <button onClick={()=>send("text",reminderMsg)} disabled={!phone}
            style={{flex:1,padding:"14px 8px",borderRadius:8,border:"2px solid #4a7c59",background:"rgba(74,124,89,.06)",cursor:phone?"pointer":"not-allowed",opacity:phone?1:.5,textAlign:"center",fontFamily:"inherit",transition:"all .15s"}}
            onMouseEnter={e=>{if(phone)e.currentTarget.style.background="rgba(74,124,89,.12)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(74,124,89,.06)"}}>
            <div style={{fontSize:20,marginBottom:4}}>💬</div>
            <div style={{fontSize:12,fontWeight:700,color:"#4a7c59"}}>Text</div>
            <div style={{fontSize:9,color:"#4a7c59",opacity:.7,marginTop:2}}>{phone||"No phone on file"}</div>
          </button>
        </div>
        <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button></div>
      </>}
    </div></div>);
  })()}

  {modal&&modal.type==="deleteCharge"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>🗑 Delete Charge?</h2>
      <div style={{background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.12)",borderRadius:8,padding:12,marginBottom:14,fontSize:12}}>
        <div style={{fontWeight:700,marginBottom:2}}>{modal.tenantName}</div>
        <div style={{color:"#999"}}>{modal.category} — {modal.desc}</div>
      </div>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:16}}>This will permanently delete the charge and all associated payment records. This cannot be undone.</p>
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-red" onClick={()=>{setCharges(p=>p.filter(c=>c.id!==modal.chargeId));setExpCharge(null);setModal(null);}}>Yes, Delete</button>
      </div>
    </div></div>
  )}

  {modal&&modal.type==="waiveCharge"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>⏹ Stop Late Fees</h2>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:12}}>This will stop late fees and mark the charge as waived. This cannot be undone.</p>
      <div className={`fld ${modal.reasonErr?"field-err":""}`}>
        <label className={modal.reasonErr?"field-err-label":""}>Reason (required)</label>
        <textarea value={modal.reason||""} onChange={e=>setModal(prev=>({...prev,reason:e.target.value,reasonErr:false}))} placeholder="e.g. Tenant hardship, billing error, goodwill gesture..." rows={2} autoFocus/>
        {modal.reasonErr&&<div className="err-msg">Please enter a reason</div>}
      </div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-red" onClick={()=>{
          if(!(modal.reason||"").trim()){setModal(prev=>({...prev,reasonErr:true}));shakeModal();return;}
          waiveCharge(modal.chargeId,modal.reason);setExpCharge(null);setModal(null);
        }}>Waive Charge</button></div>
    </div></div>
  )}

  {/* New Idea Modal */}
  {modal&&(modal.type==="newIdea"||modal.type==="editIdea")&&(()=>{
    const isEdit=modal.type==="editIdea";
    const idea=isEdit?modal.idea:modal;
    const allCats=[...new Set(ideas.map(i=>i.cat))];
    const statuses=["Idea","Planned","Building","Done"];
    const setIdea=(key,val)=>setModal(prev=>isEdit?{...prev,idea:{...prev.idea,[key]:val}}:{...prev,[key]:val});
    const save=()=>{
      if(!(idea.title||"").trim()||!idea.cat)return;
      if(isEdit){
        setIdeas(p=>p.map(x=>x.id===idea.id?{...x,...idea}:x));
      } else {
        setIdeas(p=>[{id:uid(),title:idea.title.trim(),cat:idea.cat,priority:idea.priority||"medium",status:idea.status||"Idea",notes:idea.notes||"",link:idea.link||"",archived:false},...p]);
      }
      setModal(null);
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
      <h2>{isEdit?"Edit Idea":"New Idea"}</h2>
      <div className="fld">
        <label>Title<span style={{color:"#c45c4a",marginLeft:2}}>*</span></label>
        <input value={idea.title||""} onChange={e=>setIdea("title",e.target.value)} placeholder="What's the idea?" autoFocus/>
      </div>
      <div className="fld">
        <label>Notes / Description</label>
        <textarea value={idea.notes||""} onChange={e=>setIdea("notes",e.target.value)} placeholder="Any context, details, or thoughts..." rows={3}/>
      </div>
      <div className="fld">
        <label>Link / URL</label>
        <input value={idea.link||""} onChange={e=>setIdea("link",e.target.value)} placeholder="https://..." type="url"/>
      </div>
      <div className="fld"><label>Category<span style={{color:"#c45c4a",marginLeft:2}}>*</span></label>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
          {allCats.map(c=><button key={c} className={`btn ${idea.cat===c?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setIdea("cat",c)}>{c}</button>)}
          <button className="btn btn-out btn-sm" style={{borderStyle:"dashed"}} onClick={()=>setModal(prev=>({...prev,showCatInput:true}))}>+ New</button>
          {modal.showCatInput&&<div style={{display:"flex",gap:3,marginTop:4,width:"100%"}}>
            <input value={modal.newCatName||""} onChange={e=>setModal(prev=>({...prev,newCatName:e.target.value}))} placeholder="Category name..." autoFocus
              onKeyDown={e=>{if(e.key==="Enter"&&(modal.newCatName||"").trim()){setIdea("cat",modal.newCatName.trim());setModal(prev=>({...prev,showCatInput:false,newCatName:""}));}}}
              style={{flex:1,padding:"5px 9px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/>
            <button className="btn btn-gold btn-sm" disabled={!(modal.newCatName||"").trim()} onClick={()=>{setIdea("cat",modal.newCatName.trim());setModal(prev=>({...prev,showCatInput:false,newCatName:""}));}}>Set</button>
          </div>}
        </div>
      </div>
      <div className="fr">
        <div className="fld"><label>Priority</label>
          <div style={{display:"flex",gap:4}}>
            {[["high","High"],["medium","Medium"],["low","Low"]].map(([v,l])=>(
              <button key={v} className={`btn ${idea.priority===v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setIdea("priority",v)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="fld"><label>Status</label>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {statuses.map(s=>(
              <button key={s} className={`btn ${idea.status===s?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setIdea("status",s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-gold" disabled={!(idea.title||"").trim()||!idea.cat} onClick={save}>{isEdit?"Save Changes":"Add Idea"}</button>
      </div>
    </div></div>);
  })()}

  {modal&&modal.type==="recordPay"&&(()=>{
    const occRooms=occLeases;
    const selRoom=occRooms.find(r=>r.id===modal.selRoom);
    const roomCharges=charges.filter(c=>c.roomId===modal.selRoom&&chargeStatus(c)!=="paid"&&chargeStatus(c)!=="waived");
    const selCh=charges.find(c=>c.id===modal.selCharge);
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
      <h2>Record Payment</h2>
      {modal.step===1&&<>
        <div className="fld"><label>Select Tenant</label><select value={modal.selRoom} onChange={e=>setModal(prev=>({...prev,selRoom:e.target.value,selCharge:""}))}><option value="">Choose...</option>{occRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} - {r.propName} {r.name}</option>)}</select></div>
        {modal.selRoom&&roomCharges.length>0&&<div className="fld"><label>Select Charge</label>{roomCharges.map(c=>{const st=chargeStatus(c);return(
          <div key={c.id} style={{padding:8,border:`2px solid ${modal.selCharge===c.id?"#3b82f6":"rgba(0,0,0,.05)"}`,borderRadius:6,marginBottom:4,cursor:"pointer",background:modal.selCharge===c.id?"rgba(59,130,246,.04)":"#fff"}} onClick={()=>setModal(prev=>({...prev,selCharge:c.id,payAmount:c.amount-c.amountPaid}))}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,fontWeight:600}}>{c.category}: {c.desc}</span><span className={`badge ${st==="pastdue"?"b-red":"b-blue"}`}>{st}</span></div>
            <div style={{fontSize:10,color:"#999"}}>Due {fmtD(c.dueDate)} - {fmtS(c.amount-c.amountPaid)} remaining</div>
          </div>);})}</div>}
        {modal.selRoom&&roomCharges.length===0&&<div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:12,color:"#9a7422",marginBottom:10}}>No unpaid charges. <button className="btn btn-gold btn-sm" style={{marginLeft:6}} onClick={()=>setModal({type:"createCharge",roomId:modal.selRoom,category:"Rent",desc:"",amount:(selRoom&&selRoom.rent)||0,dueDate:TODAY.toISOString().split("T")[0],notes:""})}>Create Charge</button></div>}
        <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
          <button className="btn btn-dk" onClick={()=>{
            if(!modal.selRoom){shakeModal();return;}
            if(!modal.selCharge){shakeModal();return;}
            setModal(prev=>({...prev,step:2}));
          }}>Next</button></div>
      </>}
      {modal.step===2&&selCh&&<>
        <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:12,marginBottom:14,fontSize:12}}><strong>{selCh.tenantName}</strong> - {selCh.propName} {selCh.roomName}<br/><strong>{selCh.category}:</strong> {selCh.desc} - <strong>{fmtS(selCh.amount-selCh.amountPaid)}</strong> remaining</div>
        <div className={`fld ${modal.payErrs&&modal.payErrs.amount?"field-err":""}`}><label className={modal.payErrs&&modal.payErrs.amount?"field-err-label":""}>Amount</label><input type="number" step=".01" value={modal.payAmount} onChange={e=>setModal(prev=>({...prev,payAmount:Number(e.target.value),payErrs:{...(prev.payErrs||{}),amount:null}}))}/>{modal.payErrs&&modal.payErrs.amount&&<div className="err-msg">{modal.payErrs.amount}</div>}</div>
        <div className={`fld ${modal.payErrs&&modal.payErrs.method?"field-err":""}`}><label className={modal.payErrs&&modal.payErrs.method?"field-err-label":""}>Payment Method</label><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{PAY_METHODS.map(pm=>(<button key={pm} className={`btn ${modal.payMethod===pm?"btn-dk":"btn-out"} btn-sm`} style={{border:modal.payErrs&&modal.payErrs.method&&!modal.payMethod?"1px solid #c45c4a":""}} onClick={()=>setModal(prev=>({...prev,payMethod:pm,payErrs:{...(prev.payErrs||{}),method:null}}))}>  {pm}</button>))}</div>{modal.payErrs&&modal.payErrs.method&&<div className="err-msg">{modal.payErrs.method}</div>}</div>
        <div className={`fld ${modal.payErrs&&modal.payErrs.date?"field-err":""}`}><label className={modal.payErrs&&modal.payErrs.date?"field-err-label":""}>Payment Date</label><input type="date" value={modal.payDate} onChange={e=>setModal(prev=>({...prev,payDate:e.target.value,payErrs:{...(prev.payErrs||{}),date:null}}))}/>{modal.payErrs&&modal.payErrs.date&&<div className="err-msg">{modal.payErrs.date}</div>}</div>
        <div className="fld"><label>Notes</label><input value={modal.payNotes||""} onChange={e=>setModal(prev=>({...prev,payNotes:e.target.value}))} placeholder="Optional notes..."/></div>
        <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-out" onClick={()=>setModal(prev=>({...prev,step:1}))}>Back</button>
          <button className="btn btn-green" onClick={()=>{
            const errs={};
            if(!modal.payAmount||modal.payAmount<=0)errs.amount="Enter a valid amount";
            if(!modal.payMethod)errs.method="Select a payment method";
            if(!modal.payDate)errs.date="Select a date";
            if(Object.keys(errs).length){setModal(prev=>({...prev,payErrs:errs}));shakeModal();return;}
            const isTransit=["Stripe/ACH","Credit Card","Bank Transfer"].includes(modal.payMethod);
            const confId=`BB-${uid().slice(0,8).toUpperCase()}`;
            recordPayment(modal.selCharge,{amount:modal.payAmount,method:modal.payMethod,date:modal.payDate,notes:modal.payNotes,depositStatus:isTransit?"transit":"deposited",depositDate:isTransit?null:modal.payDate,confId});
            // Auto-send email receipt stub
            const tenant=selRoom&&selRoom.tenant;
            if(tenant&&tenant.email){
              // TODO: wire to Resend — setNotifs logs it for now
              setNotifs(p=>[{id:uid(),type:"payment",msg:`Receipt emailed to ${tenant.name} (${tenant.email}) — ${fmtS(modal.payAmount)} via ${modal.payMethod} · ${confId}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
            }
            setModal(prev=>({...prev,step:3,confId,isTransit}));
          }}>Submit Payment</button></div>
      </>}
      {modal.step===3&&selCh&&(()=>{
        const tenant=selRoom&&selRoom.tenant;
        const printReceipt=()=>{
          const w=window.open("","_blank");
          w.document.write(`<!DOCTYPE html><html><head><title>Payment Receipt ${modal.confId}</title><style>
            body{font-family:Georgia,serif;max-width:560px;margin:40px auto;padding:0 24px;color:#1a1714;line-height:1.6}
            h1{font-size:20px;font-weight:700;border-bottom:2px solid #1a1714;padding-bottom:8px;margin-bottom:20px}
            .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}
            .label{color:#666}.value{font-weight:600}
            .total{display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:800;border-top:2px solid #1a1714;margin-top:4px}
            .badge{display:inline-block;padding:3px 10px;border-radius:100px;background:#e8f5e9;color:#2e7d32;font-size:11px;font-weight:700}
            .conf{font-family:monospace;font-size:18px;font-weight:900;color:#1a1714;letter-spacing:2px;text-align:center;padding:12px;background:#f5f0e8;border-radius:6px;margin:16px 0}
            .footer{margin-top:32px;font-size:11px;color:#999;text-align:center}
            @media print{body{margin:20px}}
          </style></head><body>
            <h1>Payment Receipt</h1>
            <div class="conf">${modal.confId}</div>
            <div class="row"><span class="label">Date</span><span class="value">${modal.payDate}</span></div>
            <div class="row"><span class="label">Tenant</span><span class="value">${selCh.tenantName}</span></div>
            <div class="row"><span class="label">Property</span><span class="value">${selCh.propName} · ${selCh.roomName}</span></div>
            <div class="row"><span class="label">Charge</span><span class="value">${selCh.category} — ${selCh.desc}</span></div>
            <div class="row"><span class="label">Payment Method</span><span class="value">${modal.payMethod}</span></div>
            ${modal.payNotes?`<div class="row"><span class="label">Notes</span><span class="value">${modal.payNotes}</span></div>`:""}
            <div class="row"><span class="label">Status</span><span class="value">${modal.isTransit?"In Transit — will confirm on deposit":"Received &amp; Deposited"}</span></div>
            <div class="total"><span>Amount Paid</span><span>$${Number(modal.payAmount).toLocaleString()}</span></div>
            <div class="footer">Oak &amp; Main Development LLC · Black Bear Rentals · blackbearhousing@gmail.com<br/>This receipt confirms payment was received. Please retain for your records.</div>
          </body></html>`);
          w.document.close();w.print();
        };
        return(<>
          <div style={{textAlign:"center",padding:"14px 0 8px"}}>
            <div style={{fontSize:32,marginBottom:8}}>✅</div>
            <div style={{fontSize:16,fontWeight:800,color:"#4a7c59",marginBottom:4}}>Payment Recorded</div>
            <div style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:"#5c4a3a",background:"rgba(0,0,0,.04)",padding:"6px 14px",borderRadius:6,display:"inline-block"}}>{modal.confId}</div>
          </div>
          <div style={{background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.12)",borderRadius:10,padding:14,marginBottom:14,fontSize:12}}>
            {[["Tenant",selCh.tenantName],["Charge",`${selCh.category} — ${selCh.desc}`],["Amount",fmtS(modal.payAmount)],["Method",modal.payMethod],["Date",fmtD(modal.payDate)],["Status",modal.isTransit?"🟡 In Transit":"✅ Deposited"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}><span style={{color:"#999"}}>{l}</span><strong>{v}</strong></div>
            ))}
          </div>
          <div style={{background:"rgba(59,130,246,.04)",border:"1px solid rgba(59,130,246,.1)",borderRadius:8,padding:10,marginBottom:14,fontSize:11,color:"#3b82f6"}}>
            📧 Receipt automatically emailed to {tenant?tenant.email:"tenant"} · Also visible in their tenant portal
          </div>
          <div className="mft">
            <button className="btn btn-out" onClick={()=>setModal(null)}>Done</button>
            <button className="btn btn-gold" onClick={printReceipt}>🖨 Print / Save PDF</button>
          </div>
        </>);
      })()}
    </div></div>);})()}

  {/* Create Charge Modal */}
  {modal&&modal.type==="createCharge"&&(()=>{
    const occRooms=occLeases;
    const selRoom=occRooms.find(r=>r.id===modal.roomId);
    const errs=modal.chErrs||{};
    const submit=()=>{
      const e={};
      if(!modal.roomId)e.roomId="Select a tenant";
      if(!modal.amount||modal.amount<=0)e.amount="Enter a valid amount";
      if(!modal.dueDate)e.dueDate="Select a due date";
      if(Object.keys(e).length){setModal(prev=>({...prev,chErrs:e}));shakeModal();return;}
      const tenantName=(selRoom&&selRoom.tenant&&selRoom.tenant.name)||"";
      const propName=(selRoom&&selRoom.propName)||"";
      const roomName=(selRoom&&selRoom.name)||"";
      createCharge({roomId:modal.roomId,tenantName,propName,roomName,category:modal.category,desc:modal.desc||modal.category,amount:modal.amount,dueDate:modal.dueDate});
      // If Security Deposit, also log to sdLedger
      if(modal.category==="Security Deposit"){
        const existing=sdLedger.find(s=>s.roomId===modal.roomId&&!s.returned);
        if(existing){
          // Add to existing held amount
          setSdLedger(p=>p.map(s=>s.id===existing.id?{...s,amountHeld:s.amountHeld+modal.amount,deposits:[...(s.deposits||[]),{id:uid(),amount:modal.amount,date:TODAY.toISOString().split("T")[0],desc:modal.desc||"Security Deposit",chargeId:uid()}]}:s));
        } else {
          // Create new sd ledger entry
          setSdLedger(p=>[...p,{id:uid(),roomId:modal.roomId,tenantName,propName,roomName,amountHeld:modal.amount,deposits:[{id:uid(),amount:modal.amount,date:TODAY.toISOString().split("T")[0],desc:modal.desc||"Security Deposit"}],deductions:[],returned:null,returnDate:null}]);
        }
      }
      setModal(null);
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
      <h2>Create Charge</h2>
      <div className={`fld ${errs.roomId?"field-err":""}`}><label className={errs.roomId?"field-err-label":""}>Tenant</label><select value={modal.roomId} onChange={e=>setModal(prev=>({...prev,roomId:e.target.value,chErrs:{...(prev.chErrs||{}),roomId:null}}))}><option value="">Select...</option>{occRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} - {r.propName} {r.name}</option>)}</select>{errs.roomId&&<div className="err-msg">{errs.roomId}</div>}</div>
      <div className="fld"><label>Category</label><select value={modal.category} onChange={e=>setModal(prev=>({...prev,category:e.target.value}))}>{CHARGE_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
      <div className="fld"><label>Description</label><input value={modal.desc||""} onChange={e=>setModal(prev=>({...prev,desc:e.target.value}))} placeholder={`${modal.category} charge...`}/></div>
      <div className="fr">
        <div className={`fld ${errs.amount?"field-err":""}`}><label className={errs.amount?"field-err-label":""}>Amount</label><input type="number" step=".01" value={modal.amount} onChange={e=>setModal(prev=>({...prev,amount:Number(e.target.value),chErrs:{...(prev.chErrs||{}),amount:null}}))}/>{errs.amount&&<div className="err-msg">{errs.amount}</div>}</div>
        <div className={`fld ${errs.dueDate?"field-err":""}`}><label className={errs.dueDate?"field-err-label":""}>Due Date</label><input type="date" value={modal.dueDate} onChange={e=>setModal(prev=>({...prev,dueDate:e.target.value,chErrs:{...(prev.chErrs||{}),dueDate:null}}))}/>{errs.dueDate&&<div className="err-msg">{errs.dueDate}</div>}</div>
      </div>
      <div className="fld"><label>Notes</label><input value={modal.notes||""} onChange={e=>setModal(prev=>({...prev,notes:e.target.value}))}/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-gold" onClick={submit}>Create Charge</button></div>
    </div></div>);})()}


  {/* Add Credit */}
  {modal&&modal.type==="addCredit"&&(()=>{
    const occRooms=occLeases;
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
      <h2>Add Credit</h2>
      <p style={{fontSize:11,color:"#5c4a3a",marginBottom:12}}>Credits auto-apply to next month's rent.</p>
      <div className="fld"><label>Tenant</label><select value={modal.roomId} onChange={e=>setModal(prev=>({...prev,roomId:e.target.value}))}><option value="">Select...</option>{occRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} - {r.propName} {r.name}</option>)}</select></div>
      <div className="fld"><label>Amount</label><input type="number" step=".01" value={modal.amount} onChange={e=>setModal(prev=>({...prev,amount:Number(e.target.value)}))}/></div>
      <div className="fld"><label>Reason</label><input value={modal.reason||""} onChange={e=>setModal(prev=>({...prev,reason:e.target.value}))} placeholder="e.g. Overpayment, SD credit..."/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-green" disabled={!modal.roomId||!modal.amount} onClick={()=>{const rm=occRooms.find(r=>r.id===modal.roomId);setCredits(p=>[{id:uid(),roomId:modal.roomId,tenantName:(rm&&rm.tenant&&rm.tenant.name)||"",amount:modal.amount,reason:modal.reason,date:TODAY.toISOString().split("T")[0],applied:false},...p]);setModal(null);}}>Add Credit</button></div>
    </div></div>);})()}

  {/* Return SD */}
  {modal&&modal.type==="returnSD"&&(()=>{
    const tenantList=[...archive.map(a=>({id:a.id,name:a.name,roomName:a.roomName,propName:a.propName,rent:a.rent,type:"past"})),...occLeases.map(r=>({id:r.id,name:r.tenant.name,roomName:r.name,propName:r.propName,rent:r.rent,type:"current"}))];
    const sel=tenantList.find(t=>t.id===modal.roomId);
    const sdHeld=(sel&&sel.rent)||0;
    const deductions=modal.deductions||[];
    const totalDed=deductions.reduce((s,d)=>s+d.amount,0);
    const returnAmt=Math.max(0,sdHeld-totalDed);
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
      <h2>Return Security Deposit</h2>
      <div className="fld"><label>Tenant</label><select value={modal.roomId} onChange={e=>setModal(prev=>({...prev,roomId:e.target.value,deductions:[]}))}><option value="">Select...</option>{tenantList.map(t=><option key={t.id} value={t.id}>{t.name} - {t.propName} {t.roomName} ({t.type})</option>)}</select></div>
      {sel&&<>
        <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:12,marginBottom:10,fontSize:12}}><strong>SD Held:</strong> {fmtS(sdHeld)}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><label style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase"}}>Deductions</label><button className="btn btn-out btn-sm" onClick={()=>setModal(prev=>({...prev,deductions:[...deductions,{desc:"",amount:0}]}))}>+ Add</button></div>
        {deductions.map((d,i)=>(
          <div key={i} style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}>
            <select value={d.desc} onChange={e=>{const ds=[...deductions];ds[i]={...ds[i],desc:e.target.value};setModal(prev=>({...prev,deductions:ds}));}} style={{flex:1,padding:"5px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">Type...</option><option>Damages</option><option>Cleaning</option><option>Unpaid Rent</option><option>Lock Change</option><option>Key Replacement</option><option>Other</option></select>
            <input type="number" step=".01" value={d.amount} onChange={e=>{const ds=[...deductions];ds[i]={...ds[i],amount:Number(e.target.value)};setModal(prev=>({...prev,deductions:ds}));}} style={{width:80,padding:"5px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,textAlign:"right"}}/>
            <button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer"}} onClick={()=>setModal(prev=>({...prev,deductions:deductions.filter((_,j)=>j!==i)}))}>x</button>
          </div>))}
        <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:12,marginTop:10,fontSize:13}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>SD Held</span><strong>{fmtS(sdHeld)}</strong></div>
          {deductions.filter(d=>d.amount>0).map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:2,color:"#c45c4a"}}><span>- {d.desc||"Deduction"}</span><span>{fmtS(d.amount)}</span></div>)}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"2px solid rgba(0,0,0,.06)",marginTop:6,fontWeight:800,fontSize:15}}><span>Return</span><span style={{color:"#4a7c59"}}>{fmtS(returnAmt)}</span></div>
        </div>
      </>}
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-green" disabled={!sel} onClick={()=>{setSdLedger(p=>[{id:uid(),roomId:modal.roomId,tenantName:sel.name,propName:sel.propName,roomName:sel.roomName,amountHeld:sdHeld,deductions,returned:returnAmt,returnDate:TODAY.toISOString().split("T")[0]},...p]);setModal(null);}}>Confirm Return {fmtS(returnAmt)}</button></div>
    </div></div>);})()}
  {/* Invite to Apply Modal */}
  {/* ── Add Lead Manually Modal ── */}
  {modal&&modal.type==="addLead"&&(()=>{
    const errs=modal.addErrs||{};
    const SOURCES=["Phone / Direct Call","Walk-in","Text Message","Facebook","Instagram","Craigslist","Zillow","Roomies.com","Furnished Finder","Friend / Referral","Google Search","NASA Intern Program","Drive-by / Sign","Other"];
    const submit=()=>{
      const e={};
      if(!(modal.name||"").trim())e.name="Name is required";
      if(!(modal.phone||"").trim()&&!(modal.email||"").trim())e.contact="Phone or email is required";
      if(Object.keys(e).length){setModal(prev=>({...prev,addErrs:e}));shakeModal();return;}
      const newLead={id:uid(),name:modal.name.trim(),phone:modal.phone||"",email:modal.email||"",property:modal.property||"",room:"",moveIn:"",income:"",status:"called",submitted:TODAY.toISOString().split("T")[0],bgCheck:"not-started",creditScore:"—",refs:"not-started",source:modal.source||"Phone / Direct Call",lastContact:TODAY.toISOString().split("T")[0],notes:modal.notes||"Added manually — direct call",history:[{from:"new",to:"called",date:TODAY.toISOString().split("T")[0],note:"Added manually by admin"}]};
      setApps(p=>[newLead,...p]);
      setNotifs(p=>[{id:uid(),type:"app",msg:`New lead added: ${modal.name.trim()} (${modal.source||"Direct Call"})`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
      setModal({type:"addLeadDone",lead:newLead});
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
      <h2>📞 Add Lead Manually</h2>
      <p style={{fontSize:11,color:"#999",marginBottom:14}}>Add someone who contacted you directly. They'll be placed in the <strong>Called / Follow Up</strong> stage and you can invite them to apply from there.</p>
      <div className={`fld ${errs.name?"field-err":""}`}>
        <label className={errs.name?"field-err-label":""}>Full Name *</label>
        <input value={modal.name||""} onChange={e=>setModal(prev=>({...prev,name:e.target.value,addErrs:{...(prev.addErrs||{}),name:null}}))} placeholder="Jane Smith" autoFocus/>
        {errs.name&&<div className="err-msg">{errs.name}</div>}
      </div>
      <div className={`fr ${errs.contact?"field-err":""}`}>
        <div className="fld"><label className={errs.contact?"field-err-label":""}>Phone</label><input value={modal.phone||""} onChange={e=>setModal(prev=>({...prev,phone:e.target.value,addErrs:{...(prev.addErrs||{}),contact:null}}))} placeholder="(256) 555-0000"/></div>
        <div className="fld"><label className={errs.contact?"field-err-label":""}>Email</label><input value={modal.email||""} onChange={e=>setModal(prev=>({...prev,email:e.target.value,addErrs:{...(prev.addErrs||{}),contact:null}}))} placeholder="jane@email.com"/></div>
      </div>
      {errs.contact&&<div className="err-msg" style={{marginTop:-8,marginBottom:8}}>{errs.contact}</div>}
      <div className="fld"><label>Interested In (optional)</label>
        <select value={modal.property||""} onChange={e=>setModal(prev=>({...prev,property:e.target.value}))}>
          <option value="">No preference / unknown</option>
          {props.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </div>
      <div className="fld"><label>How They Found You</label>
        <select value={modal.source||"Phone / Direct Call"} onChange={e=>setModal(prev=>({...prev,source:e.target.value}))}>
          {SOURCES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="fld"><label>Notes</label>
        <textarea value={modal.notes||""} onChange={e=>setModal(prev=>({...prev,notes:e.target.value}))} placeholder="Anything notable from the call — timing, budget, situation..." rows={2}/>
      </div>
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-gold" onClick={submit}>Add to Pipeline →</button>
      </div>
    </div></div>);
  })()}

  {/* ── Add Lead Done — offer to invite immediately ── */}
  {modal&&modal.type==="addLeadDone"&&(()=>{const lead=modal.lead;return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420,textAlign:"center",padding:28}}>
      <div style={{fontSize:36,marginBottom:8}}>✅</div>
      <h2 style={{color:"#4a7c59",marginBottom:6}}>{lead.name} Added!</h2>
      <p style={{fontSize:12,color:"#999",marginBottom:20}}>They're now in the <strong>Called / Follow Up</strong> stage. Want to invite them to apply right now?</p>
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        <button className="btn btn-out" onClick={()=>setModal(null)}>Not Yet</button>
        <button className="btn btn-gold" onClick={()=>setModal({type:"inviteApp",data:lead})}>✉️ Invite to Apply →</button>
      </div>
    </div></div>);
  })()}

  {/* ── Generic Link Copied Toast ── */}
  {modal&&modal.type==="genericLinkCopied"&&(()=>{
    setTimeout(()=>setModal(null),2500);
    return(
    <div className="mbg" style={{pointerEvents:"none",background:"transparent"}} onClick={()=>setModal(null)}>
      <div style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",background:"#1a1714",color:"#f5f0e8",padding:"12px 24px",borderRadius:100,fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 24px rgba(0,0,0,.2)",animation:"fadeIn .2s",pointerEvents:"none"}}>
        ✓ Link copied to clipboard
      </div>
    </div>);
  })()}

  {/* ── View Addendum Modal ── */}
  {modal&&modal.type==="viewAddendum"&&(()=>{
    const d=modal.doc;const c=d.content||{};
    const utilLabel=(u)=>u==="allIncluded"?"All Included (landlord pays)":"Tenant Pays (split equally)";
    const printDoc=()=>{
      const w=window.open("","_blank");
      w.document.write(`<!DOCTYPE html><html><head><title>${d.name}</title><style>
        body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;color:#1a1714;line-height:1.6}
        h1{font-size:22px;font-weight:700;border-bottom:2px solid #1a1714;padding-bottom:10px;margin-bottom:24px}
        h2{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;margin:24px 0 8px}
        .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}
        .label{color:#666}.value{font-weight:600;text-align:right}
        .sig{margin-top:40px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
        .sig-line{border-top:1px solid #1a1714;padding-top:6px;font-size:12px;color:#666}
        .notice{background:#f5f0e8;padding:14px;border-radius:6px;font-size:12px;margin-top:20px;border-left:3px solid #d4a853}
        @media print{body{margin:20px}}
      </style></head><body>
        <h1>Lease Addendum</h1>
        <div class="row"><span class="label">Document Date</span><span class="value">${c.createdDate||d.uploaded}</span></div>
        <div class="row"><span class="label">Property</span><span class="value">${c.newProp}</span></div>
        <div class="row"><span class="label">Tenant</span><span class="value">${c.tenant}</span></div>
        <div class="row"><span class="label">Email</span><span class="value">${c.email||"—"}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${c.phone||"—"}</span></div>
        <h2>Room Change</h2>
        <div class="row"><span class="label">From</span><span class="value">${c.originalRoom} at ${c.originalProp}</span></div>
        <div class="row"><span class="label">To</span><span class="value">${c.newRoom} at ${c.newProp}</span></div>
        <div class="row"><span class="label">Effective Date</span><span class="value">${c.effDate}</span></div>
        <div class="row"><span class="label">Reason</span><span class="value">${c.reason}</span></div>
        <h2>Financial Terms</h2>
        <div class="row"><span class="label">Previous Rent</span><span class="value">$${(c.originalRent||0).toLocaleString()}/mo</span></div>
        <div class="row"><span class="label">New Rent</span><span class="value">$${(c.newRent||0).toLocaleString()}/mo</span></div>
        <div class="row"><span class="label">Rent Change</span><span class="value">${c.newRent===c.originalRent?"No change":c.newRent>c.originalRent?`+$${(c.newRent-c.originalRent).toLocaleString()}/mo increase`:`-$${(c.originalRent-c.newRent).toLocaleString()}/mo decrease`}</span></div>
        ${c.sdAdj!==0?`<div class="row"><span class="label">Security Deposit Adjustment</span><span class="value">${c.sdAdj>0?`+$${c.sdAdj.toLocaleString()} (invoice generated)`:`$${Math.abs(c.sdAdj).toLocaleString()} credit applied`}</span></div>`:""}
        ${c.utilChange?`<div class="row"><span class="label">Utility Change</span><span class="value">${utilLabel(c.utilFrom)} → ${utilLabel(c.utilTo)}</span></div>`:""}
        <div class="notice">This addendum modifies the original lease agreement. All other terms of the original lease remain in full effect. This document becomes effective on the date listed above upon signature by both parties.</div>
        <div class="sig">
          <div><div class="sig-line">Tenant Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</div></div>
          <div><div class="sig-line">Landlord Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</div></div>
        </div>
        <p style="margin-top:40px;font-size:11px;color:#999">Oak & Main Development LLC · Black Bear Rentals · blackbearhousing@gmail.com</p>
      </body></html>`);
      w.document.close();w.print();
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{margin:0}}>📝 Lease Addendum</h2>
        <button className="btn btn-gold btn-sm" onClick={printDoc}>🖨️ Print / Download PDF</button>
      </div>

      <div style={{background:"#faf9f7",border:"1px solid rgba(0,0,0,.06)",borderRadius:10,padding:16,marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Document Details</div>
        {[["Date",c.createdDate||d.uploaded],["Property",c.newProp],["Tenant",c.tenant],["Email",c.email||"—"],["Phone",c.phone||"—"]].map(([l,v])=>(
          <div key={l} className="tp-row"><span className="tp-label">{l}</span><span style={{fontSize:12,fontWeight:600}}>{v}</span></div>
        ))}
      </div>

      <div style={{background:"rgba(59,130,246,.04)",border:"1px solid rgba(59,130,246,.12)",borderRadius:10,padding:16,marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:"#3b82f6",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Room Change</div>
        {[["From",`${c.originalRoom} at ${c.originalProp}`],["To",`${c.newRoom} at ${c.newProp}`],["Effective",c.effDate],["Reason",c.reason]].map(([l,v])=>(
          <div key={l} className="tp-row"><span className="tp-label">{l}</span><span style={{fontSize:12,fontWeight:600}}>{v}</span></div>
        ))}
      </div>

      <div style={{background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.12)",borderRadius:10,padding:16,marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:"#4a7c59",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Financial Terms</div>
        {[
          ["Previous Rent",`$${(c.originalRent||0).toLocaleString()}/mo`],
          ["New Rent",`$${(c.newRent||0).toLocaleString()}/mo`],
          ["Rent Change",c.newRent===c.originalRent?"No change":c.newRent>c.originalRent?`+$${(c.newRent-c.originalRent).toLocaleString()}/mo increase`:`-$${(c.originalRent-c.newRent).toLocaleString()}/mo decrease`],
          ...(c.sdAdj!==0?[["SD Adjustment",c.sdAdj>0?`+$${c.sdAdj.toLocaleString()} (invoice generated)`:`$${Math.abs(c.sdAdj).toLocaleString()} credit applied`]]:[] ),
          ...(c.utilChange?[["Utility Change",`${utilLabel(c.utilFrom)} → ${utilLabel(c.utilTo)}`]]:[] ),
        ].map(([l,v])=>(
          <div key={l} className="tp-row"><span className="tp-label">{l}</span><span style={{fontSize:12,fontWeight:600}}>{v}</span></div>
        ))}
      </div>

      <div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:11,color:"#5c4a3a",lineHeight:1.6}}>
        This addendum modifies the original lease. All other terms remain in full effect. Effective on the date listed above upon signature by both parties.
      </div>

      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Close</button><button className="btn btn-gold" onClick={printDoc}>🖨️ Print / Save as PDF</button></div>
    </div></div>);
  })()}

  {/* ── Stripe Pay Portal (tenant portal Pay Now) ── */}
  {modal&&modal.type==="stripePayPortal"&&(()=>{
    const upcoming=modal.charges||[];
    const tRoom=modal.tRoom;
    const tenant=tRoom&&tRoom.tenant;
    // STRIPE_PUBLISHABLE_KEY — set in Vercel env vars
    // When key is present, show real Stripe checkout link per charge
    // When not set yet, show setup message
    const stripeReady=typeof window!=="undefined"&&window.__STRIPE_KEY__;
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
      <h2>💳 Pay Online</h2>
      <div style={{fontSize:11,color:"#999",marginBottom:14}}>Select a charge to pay. Both ACH bank transfer and credit/debit card accepted.</div>
      {upcoming.map(c=>{
        const rem=c.amount-c.amountPaid;
        return(
        <div key={c.id} style={{border:"1px solid rgba(0,0,0,.06)",borderRadius:10,padding:14,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div style={{fontSize:13,fontWeight:700}}>{c.category}</div>
              <div style={{fontSize:11,color:"#999"}}>{c.desc} · Due {fmtD(c.dueDate)}</div>
              {c.amountPaid>0&&<div style={{fontSize:10,color:"#d4a853"}}>{fmtS(c.amountPaid)} already paid</div>}
            </div>
            <div style={{fontWeight:800,fontSize:16,color:chargeStatus(c)==="pastdue"?"#c45c4a":"#1a1714"}}>{fmtS(rem)}</div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn btn-dk btn-sm" style={{flex:1}} onClick={async()=>{
              try{
                // Create PaymentIntent via API
                const r=await fetch("/api/stripe/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chargeId:c.id,amount:rem,tenantName:tenant?.name||c.tenantName,tenantEmail:tenant?.email||"",method:"ach"})});
                const d=await r.json();
                if(d.clientSecret){
                  // Redirect to Stripe hosted payment page
                  window.open(`https://checkout.stripe.com/pay/${d.clientSecret}#ach`,"_blank");
                }else{showAlert({title:"Payment Setup Failed",body:"Please contact your property manager to complete payment setup."});}
              }catch(e){showAlert({title:"Payment Unavailable",body:"Online payment is not available right now. Please pay via Zelle or contact us directly."});}
            }}>🏦 ACH Bank Transfer</button>
            <button className="btn btn-gold btn-sm" style={{flex:1}} onClick={async()=>{
              try{
                const r=await fetch("/api/stripe/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chargeId:c.id,amount:rem,tenantName:tenant?.name||c.tenantName,tenantEmail:tenant?.email||"",method:"card"})});
                const d=await r.json();
                if(d.clientSecret){window.open(`https://checkout.stripe.com/pay/${d.clientSecret}`,"_blank");}
                else{showAlert({title:"Payment Setup Failed",body:"Please contact your property manager to complete payment setup."});}
              }catch(e){showAlert({title:"Payment Unavailable",body:"Online payment is not available right now. Please pay via Zelle or contact us directly."});}
            }}>💳 Credit / Debit Card</button>
          </div>
        </div>);
      })}
      <div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:10,marginTop:8,fontSize:10,color:"#9a7422"}}>
        ACH transfers are free. Card payments may include a processing fee. Both deposit directly to your landlord. Questions? Text or email us at blackbearhousing@gmail.com.
      </div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button></div>
    </div></div>);
  })()}

  {modal&&modal.type==="bulkInvite"&&(()=>{
    const targets=apps.filter(a=>modal.ids.includes(a.id));
    const adminFee=settings.adminFee??10;
    const pkgFees={"none":0,"credit-only":29,"credit-bg":49};
    const incomeAdds={"none":0,"income-only":10,"income-employment":15};
    const pkgLabel={"none":"No Screening (Waived)","credit-only":"Credit Only","credit-bg":"Credit + Full BG"};
    // Per-person settings stored in modal.perPerson: {[id]: {pkg, incomeAdd, waiverReason}}
    const perPerson=modal.perPerson||{};
    const getPkg=(id)=>(perPerson[id]?.pkg||"credit-bg");
    const getIncome=(id)=>(perPerson[id]?.incomeAdd||"none");
    const getFee=(id)=>{const p=getPkg(id);return p==="none"?0:pkgFees[p]+incomeAdds[getIncome(id)]+adminFee;};
    const setPersonPkg=(id,pkg)=>setModal(prev=>({...prev,perPerson:{...prev.perPerson,[id]:{...(prev.perPerson||{})[id],pkg}}}));
    const setPersonIncome=(id,inc)=>setModal(prev=>({...prev,perPerson:{...prev.perPerson,[id]:{...(prev.perPerson||{})[id],incomeAdd:inc}}}));
    const setPersonWaiver=(id,w)=>setModal(prev=>({...prev,perPerson:{...prev.perPerson,[id]:{...(prev.perPerson||{})[id],waiverReason:w}}}));
    const totalAll=targets.reduce((s,a)=>s+getFee(a.id),0);

    const sendAll=()=>{
      const missing=targets.filter(a=>getPkg(a.id)==="none"&&!(perPerson[a.id]?.waiverReason||"").trim());
      if(missing.length>0){setModal(prev=>({...prev,bulkError:`Provide a waiver reason for: ${missing.map(a=>a.name.split(" ")[0]).join(", ")}`}));return;}
      setApps(p=>p.map(a=>{
        if(!modal.ids.includes(a.id))return a;
        const pkg=getPkg(a.id);const inc=getIncome(a.id);const fee=getFee(a.id);
        const link=`${settings.siteUrl||"https://rentblackbear.com"}/apply?invite=${a.id}`;
        return{...a,status:"invited",lastContact:TODAY.toISOString().split("T")[0],screenPkg:pkg,incomeAdd:inc,appFee:fee,waiverReason:perPerson[a.id]?.waiverReason||"",inviteLink:link,history:[...(a.history||[]),{from:a.status,to:"invited",date:TODAY.toISOString().split("T")[0],note:`Bulk invited · ${pkgLabel[pkg]} · ${fee===0?"Fee waived":"$"+fee}${perPerson[a.id]?.waiverReason?" — "+perPerson[a.id].waiverReason:""}`}]};
      }));
      setBulkSel([]);setModal(prev=>({...prev,bulkSent:true}));
    };

    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:580}}>
      {modal.bulkSent?<div style={{textAlign:"center",padding:20}}>
        <div style={{fontSize:36,marginBottom:8}}>✓</div>
        <h2 style={{color:"#4a7c59"}}>Invites Sent!</h2>
        <p style={{fontSize:12,color:"#999",marginTop:4}}>{targets.length} applicants moved to Invited.</p>
        <button className="btn btn-gold" style={{marginTop:16,width:"100%"}} onClick={()=>setModal(null)}>Done</button>
      </div>:<>
        <h2>Bulk Invite — {targets.length} Applicant{targets.length>1?"s":""}</h2>
        <p style={{fontSize:11,color:"#999",marginBottom:14}}>Set the screening package for each person individually. The admin fee (${adminFee}) is included in each total.</p>

        {targets.map(a=>(
          <div key={a.id} style={{border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:12,marginBottom:10,background:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div>
                <div style={{fontSize:13,fontWeight:700}}>{a.name}</div>
                <div style={{fontSize:10,color:"#999"}}>{a.email} · {a.source||""}</div>
              </div>
              <div style={{fontSize:14,fontWeight:800,color:getFee(a.id)===0?"#4a7c59":"#d4a853"}}>{getFee(a.id)===0?"Free":"$"+getFee(a.id)}</div>
            </div>
            {/* Pkg selector — compact row */}
            <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap"}}>
              {[["credit-bg","Credit + Full BG","$49"],["credit-only","Credit Only","$29"],["none","Waived","$0"]].map(([v,l,p])=>(
                <button key={v} onClick={()=>setPersonPkg(a.id,v)} style={{fontSize:10,padding:"4px 9px",borderRadius:6,border:`1.5px solid ${getPkg(a.id)===v?"#d4a853":"rgba(0,0,0,.08)"}`,background:getPkg(a.id)===v?"rgba(212,168,83,.08)":"#fff",color:getPkg(a.id)===v?"#9a7422":"#999",cursor:"pointer",fontFamily:"inherit",fontWeight:getPkg(a.id)===v?700:400}}>
                  {l} <span style={{color:"#ccc"}}>{p}</span>
                </button>
              ))}
            </div>
            {/* Income add-on row */}
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {[["none","No income check"],["income-only","+Income $10"],["income-employment","+Income+Emp $15"]].map(([v,l])=>(
                <button key={v} onClick={()=>setPersonIncome(a.id,v)} style={{fontSize:9,padding:"3px 7px",borderRadius:5,border:`1px solid ${getIncome(a.id)===v?"#4a7c59":"rgba(0,0,0,.06)"}`,background:getIncome(a.id)===v?"rgba(74,124,89,.06)":"#fff",color:getIncome(a.id)===v?"#2d6a3f":"#999",cursor:"pointer",fontFamily:"inherit"}}>
                  {l}
                </button>
              ))}
            </div>
            {getPkg(a.id)==="none"&&<input value={perPerson[a.id]?.waiverReason||""} onChange={e=>setPersonWaiver(a.id,e.target.value)} placeholder="Waiver reason (required) — e.g. NASA intern" style={{width:"100%",marginTop:6,padding:"5px 8px",fontSize:10,borderRadius:5,border:"1px solid rgba(212,168,83,.3)",fontFamily:"inherit"}}/>}
            {getPkg(a.id)!=="none"&&<div style={{marginTop:6,padding:"6px 8px",background:"rgba(0,0,0,.02)",borderRadius:6,fontSize:10}}>
              <div style={{display:"flex",justifyContent:"space-between",color:"#999",marginBottom:2}}><span>RentPrep</span><span>${pkgFees[getPkg(a.id)]}</span></div>
              {getIncome(a.id)!=="none"&&<div style={{display:"flex",justifyContent:"space-between",color:"#999",marginBottom:2}}><span>Income verification</span><span>+${incomeAdds[getIncome(a.id)]}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",color:"#999",marginBottom:2}}>
                <span>Admin fee</span>
                <div style={{display:"flex",alignItems:"center",gap:3}}>
                  <span>+$</span>
                  <input type="number" min="0" max="200" value={adminFee} onChange={e=>setSettings(s=>({...s,adminFee:Number(e.target.value)||0}))}
                    style={{width:38,padding:"1px 3px",borderRadius:3,border:"1px solid rgba(0,0,0,.1)",fontSize:9,fontFamily:"inherit",textAlign:"right"}}/>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,color:"#9a7422",borderTop:"1px solid rgba(0,0,0,.06)",paddingTop:3,marginTop:2}}><span>Tenant pays</span><span>${getFee(a.id)}</span></div>
            </div>}
          </div>
        ))}

        <div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:10,marginBottom:12,display:"flex",justifyContent:"space-between",fontSize:12}}>
          <span style={{color:"#9a7422",fontWeight:700}}>Total fees across all applicants</span>
          <strong>${totalAll}</strong>
        </div>
        <div className="fld"><label>Note (sent to all)</label><textarea value={modal.bulkNote||""} onChange={e=>setModal(prev=>({...prev,bulkNote:e.target.value}))} placeholder="Optional personal note..." rows={2}/></div>
        {modal.bulkError&&<div style={{background:"rgba(196,92,74,.08)",border:"1px solid rgba(196,92,74,.2)",borderRadius:6,padding:8,fontSize:10,color:"#c45c4a",marginBottom:8}}>⚠ {modal.bulkError}</div>}
        <div className="mft">
          <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
          <button className="btn btn-gold" onClick={sendAll}>Send {targets.length} Invite{targets.length>1?"s":""}</button>
        </div>
      </>}
    </div></div>);
  })()}

  {modal&&modal.type==="inviteApp"&&(()=>{const a=modal.data;
    const adminFee=settings.adminFee||10;
    const pkg=modal.pkg||"credit-bg";
    const incomeAdd=pkg==="none"?"none":(modal.incomeAdd||"none");
    const pkgFees={"none":0,"credit-only":29,"credit-bg":49};
    const incomeAdds={"none":0,"income-only":10,"income-employment":15};
    const totalFee=pkg==="none"?0:pkgFees[pkg]+incomeAdds[incomeAdd]+adminFee;
    const pkgLabel={"none":"No screening (waived)","credit-only":"Credit Report Only","credit-bg":"Credit + Full BG Check"};
    const incomeLabel={"none":"None","income-only":"Income Verify (+$10)","income-employment":"Income + Employer (+$15)"};
    const roomMode=modal.roomMode||"locked";
    const inviteStep=modal.inviteStep||"configure";
    const inviteMoveIn=modal.inviteMoveIn||a.moveIn||"";
    const inviteMoveInMs=inviteMoveIn?new Date(inviteMoveIn+"T00:00:00").getTime():null;
    const allAvailForInvite=props.flatMap(p=>leaseableItems(p).filter(item=>{
      if(item.st==="vacant")return true;
      if(item.st==="occupied"&&item.le&&inviteMoveInMs)return new Date(item.le+"T00:00:00").getTime()<=inviteMoveInMs;
      return false;
    }).map(item=>({...item,willVacate:item.st==="occupied"&&!!item.le})));
    const selPropId=modal.selPropId||(()=>{const mp=props.find(p=>p.name===a.property);return mp?mp.id:"";})();
    const selProp=props.find(p=>p.id===selPropId);
    const selRoomId=modal.selRoomId||"";
    const selRoom=allAvailForInvite.find(r=>r.id===selRoomId);
    const inviteRent=modal.inviteRent!==undefined?modal.inviteRent:(selRoom?selRoom.rent:(selProp&&selProp.wholeHouseRent?selProp.wholeHouseRent:0));
    const isWholeProp=p=>(p.units||[]).some(u=>u.rentalMode==="wholeHouse");
    const byRoomOnly=selProp&&!isWholeProp(selProp);
    const overrideConfirmed=!!modal.whPropOverride;
    const lastLeaseEnd=selProp?allRooms(selProp).filter(r=>r.le).map(r=>r.le).sort().slice(-1)[0]:null;
    const link=(settings.siteUrl||"https://rentblackbear.com")+"/apply?invite="+a.id;
    const doShake=shakeModal;

    if(inviteStep==="preview"){
      const errors=[];
      if(roomMode==="locked"&&!selPropId)errors.push("Select a property");
      if(roomMode==="property"&&!selPropId)errors.push("Select a property");
      if(pkg==="none"&&!(modal.waiverReason||"").trim())errors.push("Waiver reason required when screening is skipped");
      const validate=()=>{if(errors.length>0){setModal(prev=>({...prev,sendErrors:errors}));doShake();return false;}return true;};
      const commit=(method)=>{
        setApps(p=>p.map(x=>x.id===a.id?{...x,
          status:"invited",lastContact:TODAY.toISOString().split("T")[0],
          screenPkg:pkg,incomeAdd,appFee:totalFee,
          waiverReason:modal.waiverReason||"",
          property:selProp?selProp.name:a.property,
          room:roomMode==="property"?"Entire Property":(selRoom?selRoom.name:a.room),
          inviteRent,inviteRoomId:selRoom?selRoom.id:null,
          inviteRoomMode:roomMode,inviteLink:link,
          sentVia:(x.sentVia?x.sentVia+", ":"")+method,
          history:[...(x.history||[]),{from:x.status,to:"invited",
            date:TODAY.toISOString().split("T")[0],
            note:"Invited via "+method+" - "+pkgLabel[pkg]+" - $"+totalFee+(modal.waiverReason?" - "+modal.waiverReason:"")
          }]
        }:x));
        setNotifs(p=>[{id:uid(),type:"app",
          msg:"Invite sent to "+a.name+" via "+method+" - "+(totalFee===0?"Fee waived":"$"+totalFee),
          date:TODAY.toISOString().split("T")[0],read:false,urgent:false
        },...p]);
      };
      const sendEmail=async()=>{
        if(!validate())return;
        setModal(prev=>({...prev,emailSending:true,sendErrors:[]}));
        try{
          const res=await fetch("/api/invite",{method:"POST",headers:{"Content-Type":"application/json"},
            body:JSON.stringify({to:a.email,name:a.name,link,
              property:selProp?selProp.name:a.property,
              room:roomMode==="property"?"Entire Property":(selRoom?selRoom.name:""),
              rent:inviteRent,fee:totalFee,screeningPkg:pkgLabel[pkg],
              note:modal.sendNote||"",waived:pkg==="none"?["Screening waived"]:[]
            })
          });
          const d=await res.json();
          if(d.ok){commit("Email");setModal(prev=>({...prev,emailSent:true,emailSending:false}));}
          else{setModal(prev=>({...prev,sendErrors:[d.error||"Email failed - check Resend config"],emailSending:false}));}
        }catch{setModal(prev=>({...prev,sendErrors:["Network error - check connection and try again"],emailSending:false}));}
      };
      const phoneNum=(a.phone||"").replace(/\D/g,"");
      const smsTxt="Hey "+a.name.split(" ")[0]+"! You are invited to apply at Black Bear Rentals"+(selProp?" - "+selProp.name:"")+(selRoom?" ("+selRoom.name+")":"")+(inviteRent?" at $"+inviteRent+"/mo":"")+". Apply: "+link+(totalFee===0?". No screening fee!":(". Fee: $"+totalFee))+" - Black Bear Rentals";
      const smsHref="sms:"+phoneNum+"?&body="+encodeURIComponent(smsTxt);
      const copyLink=()=>{navigator.clipboard.writeText(link).then(()=>{setModal(prev=>({...prev,linkCopied:true}));setTimeout(()=>setModal(prev=>({...prev,linkCopied:false})),2500);});};
      return(
      <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <button className="btn btn-out btn-sm" onClick={()=>setModal(prev=>({...prev,inviteStep:"configure",sendErrors:[],emailSent:false}))}>Back</button>
          <h2 style={{margin:0,flex:1}}>Review and Send Invite</h2>
        </div>
        <div style={{background:"rgba(212,168,83,.04)",border:"1px solid rgba(212,168,83,.2)",borderRadius:10,padding:16,marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,color:"#9a7422",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Invite Summary</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <tbody>
              <tr><td style={{padding:"5px 0",color:"#999",width:"38%",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Applicant</td><td style={{padding:"5px 0",fontWeight:700,borderBottom:"1px solid rgba(0,0,0,.04)"}}>{a.name}</td></tr>
              <tr><td style={{padding:"5px 0",color:"#999",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Contact</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:11,color:"#5c4a3a"}}>{a.email} - {a.phone}</td></tr>
              <tr><td style={{padding:"5px 0",color:"#999",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Property</td><td style={{padding:"5px 0",fontWeight:600,borderBottom:"1px solid rgba(0,0,0,.04)"}}>{selProp?selProp.name:"No preference"}</td></tr>
              <tr><td style={{padding:"5px 0",color:"#999",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Room</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>{roomMode==="property"?"Entire property":roomMode==="choice"?"Tenant chooses":(selRoom?selRoom.name:"Not specified")}</td></tr>
              {inviteRent>0&&<tr><td style={{padding:"5px 0",color:"#999",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Rent</td><td style={{padding:"5px 0",fontWeight:700,color:"#2d6a3f",borderBottom:"1px solid rgba(0,0,0,.04)"}}>${inviteRent+"/mo"}</td></tr>}
              {inviteMoveIn&&<tr><td style={{padding:"5px 0",color:"#999",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Move-in</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>{fmtD(inviteMoveIn)}</td></tr>}
              <tr><td style={{padding:"5px 0",color:"#999",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Screening</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>{pkgLabel[pkg]}{incomeAdd!=="none"?" + "+incomeLabel[incomeAdd]:""}</td></tr>
              <tr><td style={{padding:"5px 0",color:"#999",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Fee (tenant)</td><td style={{padding:"5px 0",fontWeight:700,color:totalFee===0?"#4a7c59":"#d4a853",borderBottom:"1px solid rgba(0,0,0,.04)"}}>{totalFee===0?"Free":"$"+totalFee}</td></tr>
              {modal.sendNote&&<tr><td style={{padding:"5px 0",color:"#999"}}>Note</td><td style={{padding:"5px 0",fontStyle:"italic",color:"#5c4a3a",fontSize:11}}>{modal.sendNote}</td></tr>}
            </tbody>
          </table>
          <div style={{marginTop:10,padding:"6px 10px",background:"rgba(0,0,0,.03)",borderRadius:6,fontSize:10,color:"#999",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link}</div>
        </div>
        {modal.sendErrors&&modal.sendErrors.length>0&&<div style={{background:"rgba(196,92,74,.08)",border:"1px solid rgba(196,92,74,.25)",borderRadius:8,padding:"10px 12px",marginBottom:10,animation:"shake .4s ease"}}>
          {modal.sendErrors.map((e,i)=><div key={i} style={{fontSize:11,color:"#c45c4a"}}>{e}</div>)}
        </div>}
        {modal.emailSent
          ?<div style={{background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,padding:"12px 14px",textAlign:"center",fontSize:13,fontWeight:700,color:"#2d6a3f"}}>Invite email sent to {a.email}</div>
          :<div style={{display:"flex",flexDirection:"column",gap:7}}>
            <div style={{display:"flex",gap:7}}>
              <button className="btn btn-green" style={{flex:1,opacity:modal.emailSending?0.6:1}} onClick={sendEmail} disabled={!!modal.emailSending}>{modal.emailSending?"Sending...":"Send Email Invite"}</button>
              <a href={smsHref} className="btn btn-dk btn-sm" style={{flex:1,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{if(!validate())return;commit("Text");}}>Send Text Invite</a>
            </div>
            <button className="btn btn-out btn-sm" style={{width:"100%",color:modal.linkCopied?"#4a7c59":"#5c4a3a"}} onClick={copyLink}>{modal.linkCopied?"Link Copied":"Copy Invite Link"}</button>
          </div>
        }
        <div className="mft" style={{marginTop:10}}>
          <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
          <button className="btn btn-out" onClick={()=>setModal(prev=>({...prev,inviteStep:"configure",sendErrors:[],emailSent:false}))}>Back</button>
        </div>
      </div></div>);
    }

    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:540}}>
      <h2 style={{marginBottom:4}}>Configure Invite</h2>
      <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:12,color:"#5c4a3a",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span><strong>{a.name}</strong> - {a.email} - {a.phone}</span>
        <span style={{fontSize:10,color:"#999"}}>{a.source||""}</span>
      </div>
      <div className="tp-card" style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <h3 style={{margin:0}}>Room Assignment</h3>
          <div style={{display:"flex",gap:4}}>
            {[["locked","Lock Room"],["property","Entire Prop"],["choice","Tenant Picks"]].map(([v,l])=>(
              <button key={v} className={"btn "+(roomMode===v?"btn-dk":"btn-out")+" btn-sm"} style={{fontSize:9,padding:"3px 7px"}} onClick={()=>setModal(prev=>({...prev,roomMode:v,selRoomId:"",inviteRent:undefined,inviteSD:undefined}))}>{l}</button>
            ))}
          </div>
        </div>
        {roomMode==="locked"&&<>
          <div className="fr" style={{marginBottom:8,gap:8}}>
            <div className="fld" style={{marginBottom:0}}>
              <label>Move-in Date</label>
              <input type="date" value={inviteMoveIn} onChange={e=>setModal(prev=>({...prev,inviteMoveIn:e.target.value,selRoomId:"",inviteRent:undefined,inviteSD:undefined}))} style={{width:"100%"}}/>
            </div>
            <div className="fld" style={{marginBottom:0}}>
              <label>Property</label>
              <select value={selPropId} onChange={e=>setModal(prev=>({...prev,selPropId:e.target.value,selRoomId:"",inviteRent:undefined,inviteSD:undefined}))} style={{width:"100%"}}>
                <option value="">Any</option>
                {props.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="fld" style={{marginBottom:selRoom?8:0}}>
            <label>Assign Room / Unit</label>
            <select value={selRoomId} onChange={e=>{const r=allAvailForInvite.find(x=>x.id===e.target.value);setModal(prev=>({...prev,selRoomId:e.target.value,selPropId:r?r.propId:prev.selPropId,inviteRent:r?r.rent:undefined,inviteSD:r?r.rent:undefined,inviteRoomErr:false}));}} style={{width:"100%",borderColor:modal.inviteRoomErr?"#c45c4a":undefined}}>
              <option value="">-- Select a room or unit --</option>
              <option value="__none__">No room decided yet</option>
              {allAvailForInvite.filter(r=>!selPropId||r.propId===selPropId).map(r=>(
                <option key={r.id} value={r.id}>{(r.unitLabel&&!r.isWholeUnit?"Unit "+r.unitLabel+" - ":"")+r.name+(r.isWholeUnit?" (Whole Unit)":"")+" at "+r.propName+" - $"+r.rent+"/mo"+(r.willVacate?" (lease ends "+fmtD(r.le)+")":"")}</option>
              ))}
            </select>
          </div>
          {modal.inviteRoomErr&&<div style={{color:"#c45c4a",fontSize:11,fontWeight:600,marginTop:4,animation:"shake .4s ease"}}>Please make a selection or choose "No room decided yet".</div>}
          {selRoom&&<div className="fr" style={{gap:8,marginBottom:0}}>
            <div className="fld" style={{marginBottom:0}}>
              <label>Monthly Rent</label>
              <div style={{display:"flex",alignItems:"center"}}>
                <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
                <input type="number" min={0} value={inviteRent||""} onChange={e=>{const v=Number(e.target.value)||0;setModal(prev=>({...prev,inviteRent:v,...(prev.inviteSD===undefined||prev.inviteSD===prev.inviteRent?{inviteSD:v}:{})}));}} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
              </div>
            </div>
            <div className="fld" style={{marginBottom:0}}>
              <label>Security Deposit</label>
              <div style={{display:"flex",alignItems:"center"}}>
                <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
                <input type="number" min={0} value={modal.inviteSD!==undefined?modal.inviteSD:(inviteRent||"")} onChange={e=>setModal(prev=>({...prev,inviteSD:Number(e.target.value)||0}))} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
              </div>
            </div>
          </div>}
          {selRoom&&selRoom.willVacate&&<div style={{marginTop:8,fontSize:10,color:"#9a7422",background:"rgba(212,168,83,.06)",borderRadius:6,padding:"6px 10px"}}>Lease ends {fmtD(selRoom.le)} - room will be vacant by move-in date.</div>}
        </>}
        {roomMode==="property"&&(()=>{
          const showProp=!selPropId||!byRoomOnly||overrideConfirmed;
          return(<>
            <div className="fld" style={{marginBottom:selPropId&&showProp?8:0}}>
              <label>Property</label>
              <select value={selPropId} onChange={e=>setModal(prev=>({...prev,selPropId:e.target.value,inviteRent:undefined,inviteSD:undefined,whPropOverride:false}))} style={{width:"100%"}}>
                <option value="">Select property...</option>
                {props.filter(p=>isWholeProp(p)).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                {props.filter(p=>!isWholeProp(p)).map(p=><option key={p.id} value={p.id}>{p.name+" (by-bedroom)"}</option>)}
              </select>
            </div>
            {selPropId&&byRoomOnly&&!overrideConfirmed&&<div style={{background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.25)",borderRadius:8,padding:"12px 14px",marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:700,color:"#c45c4a",marginBottom:4}}>Override Required</div>
              <div style={{fontSize:11,color:"#5c4a3a",lineHeight:1.6,marginBottom:8}}>
                <strong>{selProp?selProp.name:""}</strong> is set up for by-bedroom rental. Converting to whole-unit for this invite?
                {lastLeaseEnd&&<div style={{marginTop:4,fontSize:10,color:"#999"}}>{"Last bedroom lease ends "+fmtD(lastLeaseEnd)+" - property will not be fully vacant until after that date."}</div>}
              </div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn btn-red btn-sm" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,whPropOverride:true}))}>Yes, override to whole unit</button>
                <button className="btn btn-out btn-sm" style={{flex:1}} onClick={()=>setModal(prev=>({...prev,selPropId:"",whPropOverride:false}))}>Cancel</button>
              </div>
            </div>}
            {selPropId&&selProp&&showProp&&<div className="fr" style={{gap:8,marginBottom:0}}>
              <div className="fld" style={{marginBottom:0}}>
                <label>Whole-House Rent</label>
                <div style={{display:"flex",alignItems:"center"}}>
                  <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
                  <input type="number" min={0} value={inviteRent||""} onChange={e=>{const v=Number(e.target.value)||0;setModal(prev=>({...prev,inviteRent:v,...(prev.inviteSD===undefined||prev.inviteSD===prev.inviteRent?{inviteSD:v}:{})}));}} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
                </div>
              </div>
              <div className="fld" style={{marginBottom:0}}>
                <label>Security Deposit</label>
                <div style={{display:"flex",alignItems:"center"}}>
                  <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
                  <input type="number" min={0} value={modal.inviteSD!==undefined?modal.inviteSD:(inviteRent||"")} onChange={e=>setModal(prev=>({...prev,inviteSD:Number(e.target.value)||0}))} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
                </div>
              </div>
            </div>}
          </>);
        })()}
        {roomMode==="choice"&&<div className="fld" style={{marginBottom:0}}>
          <label>Property Preference</label>
          <select value={selPropId} onChange={e=>setModal(prev=>({...prev,selPropId:e.target.value}))} style={{width:"100%"}}>
            <option value="">No preference</option>
            {props.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>}
      </div>
      <div className="tp-card" style={{marginBottom:10}}>
        <h3>Screening Package</h3>
        {[["credit-bg","Credit + Full BG Check","FCRA-certified - RentPrep","$49"],["credit-only","Credit Report Only","Automated SmartMove","$29"],["none","No Screening (Waived)","e.g. intern with employer BG check","$0"]].map(([v,l,sub,price])=>(
          <div key={v} onClick={()=>setModal(prev=>({...prev,pkg:v,...(v==="none"?{incomeAdd:"none"}:{})}))} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:8,border:"2px solid "+(pkg===v?"#d4a853":"rgba(0,0,0,.06)"),background:pkg===v?"rgba(212,168,83,.04)":"#fff",cursor:"pointer",marginBottom:5}}>
            <div style={{width:13,height:13,borderRadius:"50%",border:"2px solid "+(pkg===v?"#d4a853":"rgba(0,0,0,.15)"),background:pkg===v?"#d4a853":"transparent",flexShrink:0}}/>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>{l}</div><div style={{fontSize:10,color:"#999"}}>{sub}</div></div>
            <div style={{fontSize:13,fontWeight:800,color:pkg===v?"#d4a853":"#999"}}>{price}</div>
          </div>
        ))}
        {pkg!=="none"&&<div style={{display:"flex",gap:6,flexWrap:"wrap",paddingTop:8,borderTop:"1px solid rgba(0,0,0,.05)",marginTop:4}}>
          {[["none","None"],["income-only","Income (+$10)"],["income-employment","Income + Employer (+$15)"]].map(([v,l])=>(
            <div key={v} onClick={()=>setModal(prev=>({...prev,incomeAdd:v}))} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:7,border:"2px solid "+(incomeAdd===v?"#4a7c59":"rgba(0,0,0,.06)"),background:incomeAdd===v?"rgba(74,124,89,.04)":"#fff",cursor:"pointer",fontSize:11,fontWeight:600}}>
              <div style={{width:11,height:11,borderRadius:"50%",border:"2px solid "+(incomeAdd===v?"#4a7c59":"rgba(0,0,0,.15)"),background:incomeAdd===v?"#4a7c59":"transparent",flexShrink:0}}/>
              {l}
            </div>
          ))}
        </div>}
        {pkg==="none"&&<div style={{fontSize:10,color:"#999",fontStyle:"italic",padding:"6px 0"}}>Income verification not available when screening is waived.</div>}
        <div style={{marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:totalFee===0?"rgba(74,124,89,.06)":"rgba(212,168,83,.06)",borderRadius:8,border:"1px solid "+(totalFee===0?"rgba(74,124,89,.15)":"rgba(212,168,83,.15)")}}>
          <span style={{fontSize:11,color:"#999"}}>{pkgLabel[pkg]}{incomeAdd!=="none"?" + "+incomeLabel[incomeAdd]:""}{pkg!=="none"?" + $"+adminFee+" admin":""}</span>
          <span style={{fontSize:16,fontWeight:800,color:totalFee===0?"#4a7c59":"#d4a853"}}>{totalFee===0?"Free":"$"+totalFee}</span>
        </div>
        {pkg==="none"&&<div style={{marginTop:8}}>
          <div style={{fontSize:10,fontWeight:700,color:"#9a7422",marginBottom:4}}>Waiver reason (required)</div>
          <textarea value={modal.waiverReason||""} onChange={e=>setModal(prev=>({...prev,waiverReason:e.target.value}))} placeholder="e.g. NASA intern - employer BG check accepted." rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/>
        </div>}
      </div>
      <div className="fld" style={{marginBottom:12}}>
        <label>Personal Note (optional)</label>
        <textarea value={modal.sendNote||""} onChange={e=>setModal(prev=>({...prev,sendNote:e.target.value}))} placeholder="e.g. Great speaking with you today!" rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid rgba(0,0,0,.08)",fontSize:12,fontFamily:"inherit",resize:"none"}}/>
      </div>
      <div className="mft" style={{marginTop:0}}>
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-gold" onClick={()=>{
          if(roomMode==="locked"&&!selRoomId){setModal(prev=>({...prev,inviteRoomErr:true}));shakeModal();setTimeout(()=>setModal(prev=>({...prev,inviteRoomErr:false})),1500);return;}
          setModal(prev=>({...prev,inviteStep:"preview",sendErrors:[],inviteRoomErr:false}));
        }}>Preview Summary</button>
      </div>
    </div></div>);
  })()}


  {/* ── Lease Preview Modal ── */}
  {modal&&modal.previewLeaseOpen&&(
    <div className="mbg" style={{zIndex:110}} onClick={()=>setModal(p=>({...p,previewLeaseOpen:false}))}>
      <div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:700,maxHeight:"90vh",overflowY:"auto",padding:0}}>

        {/* Sticky header */}
        <div style={{position:"sticky",top:0,background:"#1a1714",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10,borderRadius:"14px 14px 0 0"}}>
          <div>
            <div style={{fontFamily:"serif",fontSize:15,color:"#f5f0e8",fontWeight:700}}>Lease Preview</div>
            <div style={{fontSize:10,color:"#c4a882",marginTop:2}}>Read-only · Variables substituted · Go back to edit</div>
          </div>
          <button className="btn btn-out btn-sm" style={{color:"#f5f0e8",borderColor:"rgba(255,255,255,.2)"}} onClick={()=>setModal(p=>({...p,previewLeaseOpen:false}))}>✕ Close</button>
        </div>

        <div style={{padding:28}}>

          {/* Parties intro */}
          <div style={{marginBottom:28,paddingBottom:28,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
            <p style={{fontSize:13,color:"#3d3529",lineHeight:1.8,marginBottom:10}}>
              This Rental Agreement ("Agreement") is entered into as of <strong>{modal.previewVars?.LEASE_START}</strong>, between:
            </p>
            <p style={{fontSize:13,color:"#3d3529",lineHeight:1.8,marginBottom:10}}>
              <strong>Property Manager/Agent:</strong> {modal.previewVars?.LANDLORD_NAME}, {leaseTemplate?.company||"Black Bear Properties"} ("PROPERTY MANAGER"), and
            </p>
            <p style={{fontSize:13,color:"#3d3529",lineHeight:1.8,marginBottom:10}}>
              <strong>Resident(s)/Lessee:</strong> <strong>{modal.data?.name}</strong> ("RESIDENT").
            </p>
            <p style={{fontSize:13,color:"#3d3529",lineHeight:1.8}}>
              Premises located at <strong>{modal.previewVars?.PROPERTY_ADDRESS}</strong>, Huntsville, Alabama.
            </p>
          </div>

          {/* Sections */}
          {(modal.previewSections||[]).filter(s=>s.active!==false).map((sec,idx)=>(
            <div key={sec.id} style={{marginBottom:28,paddingBottom:28,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
              <div style={{fontSize:9,fontWeight:800,color:"#d4a853",textTransform:"uppercase",letterSpacing:1.5,marginBottom:4}}>Section {idx+1}</div>
              <div style={{fontFamily:"serif",fontSize:17,color:"#1a1714",marginBottom:10}}>{sec.title}</div>
              <div style={{fontSize:13,color:"#3d3529",lineHeight:1.8}} dangerouslySetInnerHTML={{__html:(sec.content||"").replace(/\{\{([^}]+)\}\}/g,(_,key)=>{const v=(modal.previewVars||{})[key.trim()];return v!==undefined?`<span style="color:#1a1714;font-weight:700;background:rgba(212,168,83,.1);padding:0 3px;border-radius:3px">${v}</span>`:`<span style="color:#c45c4a">{{${key}}}</span>`;})}}/>
              {sec.requiresInitials&&<div style={{marginTop:14,padding:"8px 12px",background:"rgba(212,168,83,.05)",border:"1px dashed rgba(212,168,83,.3)",borderRadius:8,fontSize:10,color:"#9a7422",fontWeight:600}}>⚠ Tenant initials required for this section</div>}
            </div>
          ))}

          {/* Signature preview */}
          <div style={{marginTop:8,padding:16,background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.15)",borderRadius:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4a7c59",marginBottom:12,textTransform:"uppercase",letterSpacing:.5}}>Signatures</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <div style={{fontSize:10,color:"#999",marginBottom:6}}>Property Manager</div>
                {modal.pmSig
                  ?<img src={modal.pmSig} alt="PM signature" style={{maxHeight:50,maxWidth:"100%",border:"1px solid rgba(0,0,0,.08)",borderRadius:4,padding:3,background:"#fff"}}/>
                  :<div style={{fontSize:12,fontFamily:"serif",color:"#1a1714"}}>{modal.previewVars?.LANDLORD_NAME}</div>
                }
                <div style={{fontSize:10,color:"#999",marginTop:4}}>{modal.previewVars?.LANDLORD_NAME} · Property Manager</div>
              </div>
              <div>
                <div style={{fontSize:10,color:"#999",marginBottom:6}}>Resident</div>
                <div style={{height:50,border:"2px dashed rgba(0,0,0,.1)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:11,color:"#bbb"}}>Tenant signs here</span>
                </div>
                <div style={{fontSize:10,color:"#999",marginTop:4}}>{modal.data?.name} · Resident</div>
              </div>
            </div>
          </div>

          <div style={{marginTop:16,textAlign:"center"}}>
            <button className="btn btn-out" style={{marginRight:8}} onClick={()=>setModal(p=>({...p,previewLeaseOpen:false}))}>← Back to Signing</button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Add Existing Tenant (from Tenants tab) */}
  {modal&&modal.type==="addExistingTenant"&&(()=>{
    const mf=modal.form||{};
    const selProp=modal.propId?props.find(p=>p.id===modal.propId):null;
    // Available items respect rentalMode
    const availItems=selProp?leaseableItems(selProp).filter(i=>(i.st||"vacant")!=="occupied"):[];
    const selItem=modal.roomId?availItems.find(i=>i.id===modal.roomId):null;
    const errs=modal.errs||{};
    const shake=modal.shake||false;
    const fmtPhone=v=>{const d=v.replace(/\D/g,"").slice(0,10);if(!d.length)return"";if(d.length<=3)return"("+d;if(d.length<=6)return"("+d.slice(0,3)+") "+d.slice(3);return"("+d.slice(0,3)+") "+d.slice(3,6)+"-"+d.slice(6);};
    const upd=(k,v)=>setModal(prev=>({...prev,form:{...(prev.form||{}),[k]:v},errs:{...(prev.errs||{}),[k]:null}}));
    const validate=()=>{
      const e={};
      if(!mf.name?.trim())e.name="Required";
      if(!mf.email?.trim())e.email="Required";
      else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mf.email))e.email="Invalid";
      if(!mf.phone?.trim())e.phone="Required";
      if(!modal.propId)e.prop="Required";
      if(!modal.roomId)e.room="Required";
      if(!mf.moveIn)e.moveIn="Required";
      if(!mf.leaseEnd)e.leaseEnd="Required";
      if(!mf.rent||Number(mf.rent)<=0)e.rent="Required";
      return e;
    };
    const save=()=>{
      const e=validate();
      if(Object.keys(e).length){setModal(p=>({...p,errs:e,shake:true}));setTimeout(()=>setModal(p=>({...p,shake:false})),500);return;}
      // Re-resolve prop and item fresh at call time — avoids stale closure
      const currentProp=props.find(p=>p.id===modal.propId);
      if(!currentProp){setModal(p=>({...p,errs:{...p.errs,prop:"Property not found"}}));return;}
      const currentItems=leaseableItems(currentProp);
      const currentItem=currentItems.find(i=>i.id===modal.roomId);
      if(!currentItem){setModal(p=>({...p,errs:{...p.errs,room:"Room not found — try re-selecting"}}));return;}
      const tenantData={name:mf.name.trim(),email:mf.email.trim(),phone:mf.phone,moveIn:mf.moveIn,gender:mf.gender||"",occupationType:mf.occupationType||"",doorCode:mf.doorCode||"",notes:mf.notes||""};
      // Write tenant into the room/unit in props
      setProps(prev=>prev.map(pr=>{
        if(pr.id!==modal.propId)return pr;
        return{...pr,units:(pr.units||[]).map(u=>{
          if(currentItem.isWholeUnit){
            if(u.id!==currentItem.unitId)return u;
            return{...u,rooms:(u.rooms||[]).map(r=>({...r,st:"occupied",le:mf.leaseEnd,rent:Number(mf.rent),tenant:tenantData}))};
          }
          return{...u,rooms:(u.rooms||[]).map(r=>{
            if(r.id!==modal.roomId)return r;
            return{...r,st:"occupied",le:mf.leaseEnd,rent:Number(mf.rent),tenant:tenantData};
          })};
        })};
      }));
      // Auto-generate a rent charge for the move-in month
      const mk=mf.moveIn.slice(0,7);
      createCharge({roomId:currentItem.isWholeUnit?currentItem.unitId:currentItem.id,tenantName:tenantData.name,propName:currentProp.name,roomName:currentItem.name,category:"Rent",desc:mk+" Rent",amount:Number(mf.rent),dueDate:mk+"-01",sent:false,sentDate:TODAY.toISOString().split("T")[0]});
      setNotifs(p=>[{id:uid(),type:"lease",msg:`Existing tenant added: ${tenantData.name} → ${currentItem.name} at ${currentProp.name}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
      setModal(null);
    };
    const efld=(key,label,type="text",placeholder="")=>(
      <div className="fld" style={{marginBottom:8}}>
        <label style={{color:errs[key]?"#c45c4a":undefined}}>{label}{errs[key]&&<span style={{fontWeight:400,fontSize:9,marginLeft:6,color:"#c45c4a"}}>{errs[key]}</span>}</label>
        <input type={type} value={mf[key]||""} placeholder={placeholder} style={{width:"100%",borderColor:errs[key]?"#c45c4a":undefined}}
          onChange={e=>upd(key,type==="tel"?fmtPhone(e.target.value):e.target.value)}/>
      </div>
    );
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:560,maxHeight:"92vh",overflowY:"auto",animation:shake?"shake .4s ease":undefined}}>
      <h2 style={{marginBottom:4}}>Add Existing Tenant</h2>
      <div style={{fontSize:11,color:"#999",marginBottom:14}}>Manually onboard a tenant who is already living in your property. This will mark the room as occupied immediately.</div>
      {shake&&Object.keys(errs).length>0&&<div style={{marginBottom:12,padding:"8px 12px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.2)",borderRadius:8,color:"#c45c4a",fontSize:11,fontWeight:700}}>Please fill in all required fields.</div>}

      <div style={{background:"rgba(74,124,89,.03)",border:"1px solid rgba(74,124,89,.1)",borderRadius:10,padding:12,marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:800,color:"#2d6a3f",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Tenant Info</div>
        {efld("name","Full Name *","text","Jane Smith")}
        <div className="fr">
          {efld("email","Email *","email","jane@email.com")}
          {efld("phone","Phone *","tel","(256) 555-0000")}
        </div>
        <div className="fr">
          <div className="fld" style={{marginBottom:0}}>
            <label>Occupation Type</label>
            <select value={mf.occupationType||""} onChange={e=>upd("occupationType",e.target.value)} style={{width:"100%"}}>
              <option value="">Select...</option>
              <option>Intern</option><option>DoD Contractor</option><option>Military</option>
              <option>Remote Worker</option><option>Student</option><option>Travel Nurse</option><option>Other</option>
            </select>
          </div>
          <div className="fld" style={{marginBottom:0}}>
            <label>Gender</label>
            <select value={mf.gender||""} onChange={e=>upd("gender",e.target.value)} style={{width:"100%"}}>
              <option value="">Prefer not to say</option>
              <option>Male</option><option>Female</option><option>Non-binary</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{background:"rgba(212,168,83,.03)",border:"1px solid rgba(212,168,83,.12)",borderRadius:10,padding:12,marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:800,color:"#9a7422",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Property &amp; Room</div>
        <div className="fr" style={{marginBottom:8,gap:8}}>
          <div className="fld" style={{marginBottom:0}}>
            <label style={{color:errs.prop?"#c45c4a":undefined}}>Property *{errs.prop&&<span style={{fontWeight:400,fontSize:9,marginLeft:6,color:"#c45c4a"}}>{errs.prop}</span>}</label>
            <select value={modal.propId||""} onChange={e=>setModal(p=>({...p,propId:e.target.value,roomId:"",errs:{...(p.errs||{}),prop:null,room:null}}))} style={{width:"100%",borderColor:errs.prop?"#c45c4a":undefined}}>
              <option value="">Select property...</option>
              {props.map(pr=><option key={pr.id} value={pr.id}>{pr.name}</option>)}
            </select>
          </div>
          <div className="fld" style={{marginBottom:0}}>
            <label style={{color:errs.room?"#c45c4a":undefined}}>Room / Unit *{errs.room&&<span style={{fontWeight:400,fontSize:9,marginLeft:6,color:"#c45c4a"}}>{errs.room}</span>}</label>
            <select value={modal.roomId||""} onChange={e=>setModal(p=>({...p,roomId:e.target.value,form:{...p.form,rent:availItems.find(i=>i.id===e.target.value)?.rent||p.form?.rent||"",sd:availItems.find(i=>i.id===e.target.value)?.rent||p.form?.sd||""},errs:{...(p.errs||{}),room:null}}))} style={{width:"100%",borderColor:errs.room?"#c45c4a":undefined}} disabled={!modal.propId}>
              <option value="">{modal.propId?"Select room...":"Select property first"}</option>
              {availItems.map(i=><option key={i.id} value={i.id}>{i.name}{i.isWholeUnit?" (Whole Unit)":""} — {fmtS(i.rent)}/mo</option>)}
              {selProp&&availItems.length===0&&<option disabled>No vacant rooms</option>}
            </select>
          </div>
        </div>
      </div>

      <div style={{background:"rgba(59,130,246,.03)",border:"1px solid rgba(59,130,246,.1)",borderRadius:10,padding:12,marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:800,color:"#1d4ed8",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Lease Terms</div>
        <div className="fr3">
          {efld("moveIn","Move-in Date *","date")}
          {efld("leaseEnd","Lease End Date *","date")}
          {efld("doorCode","Door Code","text","1234")}
        </div>
        <div className="fr">
          <div className="fld" style={{marginBottom:0}}>
            <label style={{color:errs.rent?"#c45c4a":undefined}}>Monthly Rent *{errs.rent&&<span style={{fontWeight:400,fontSize:9,marginLeft:6,color:"#c45c4a"}}>{errs.rent}</span>}</label>
            <div style={{display:"flex",alignItems:"center"}}>
              <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
              <input type="number" value={mf.rent||""} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",width:"100%",borderColor:errs.rent?"#c45c4a":undefined}}
                onChange={e=>{upd("rent",e.target.value);if(!mf.sdTouched)upd("sd",e.target.value);}} placeholder="0"/>
            </div>
          </div>
          <div className="fld" style={{marginBottom:0}}>
            <label>Security Deposit</label>
            <div style={{display:"flex",alignItems:"center"}}>
              <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
              <input type="number" value={mf.sd||""} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",width:"100%"}}
                onChange={e=>{upd("sd",e.target.value);upd("sdTouched",true);}} placeholder="0"/>
            </div>
            <div style={{fontSize:9,color:"#999",marginTop:3}}>Auto-fills from rent</div>
          </div>
        </div>
      </div>

      <div className="fld" style={{marginBottom:14}}>
        <label>Internal Notes</label>
        <textarea value={mf.notes||""} onChange={e=>upd("notes",e.target.value)}
          placeholder="How long have they lived here? Anything to note about the lease situation..."
          rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/>
      </div>

      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-green" onClick={save}>Add Tenant → Mark Occupied</button>
      </div>
    </div></div>);
  })()}

  {/* Deny Modal */}
  {modal&&modal.type==="denyApp"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>Deny Application</h2>
      <div className="fld"><label>Reason (required)</label><textarea value={modal.reason||""} onChange={e=>setModal(prev=>({...prev,reason:e.target.value}))} placeholder="e.g. Failed background check, insufficient income..." rows={3} autoFocus/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-red" disabled={!(modal.reason||"").trim()} onClick={()=>{setApps(p=>p.map(a=>a.id===modal.appId?{...a,status:"denied",deniedReason:modal.reason,deniedDate:TODAY.toISOString().split("T")[0],prevStage:a.status,lastContact:TODAY.toISOString().split("T")[0],history:[...(a.history||[]),{from:a.status,to:"denied",date:TODAY.toISOString().split("T")[0],note:modal.reason}]}:a));setModal(null);}}>Deny</button></div>
    </div></div>
  )}

  {modal&&modal.type==="app"&&(()=>{const a=modal.data;
    const STAGES=["pre-screened","called","invited","applied","reviewing","lease-sent","onboarding"];
    const SL2={"pre-screened":"Pre-Screened","called":"Called / Follow Up","invited":"Invited","applied":"Applied","reviewing":"Reviewing","lease-sent":"Lease Sent","approved":"Onboarding","onboarding":"Onboarding","move-in":"Onboarding"};
    const SI3={"pre-screened":"📋","called":"📞","invited":"✉️","applied":"📝","reviewing":"🔍","lease-sent":"📨","approved":"✅","onboarding":"🏠","move-in":"🏠"};
    const si=STAGES.indexOf(a.status);
    const sc2=(x)=>{let s=50;if(x.income){const n=parseInt((x.income+"").replace(/[^0-9]/g,""));if(n>=5000)s+=15;else if(n>=4000)s+=10;else if(n>=3000)s+=5;}if(x.bgCheck==="passed")s+=15;if(x.creditScore&&x.creditScore!=="—"){const c=parseInt(x.creditScore);if(c>=750)s+=15;else if(c>=700)s+=10;else if(c>=650)s+=5;}if(x.refs==="verified")s+=10;return Math.min(s,100);};
    const score=sc2(a);
    const ds2=(d)=>{if(!d)return 0;return Math.floor((TODAY-new Date(d+"T00:00:00"))/(1e3*60*60*24));};
    const saveApp=(id,key,val)=>{setApps(p=>p.map(x=>x.id===id?{...x,[key]:val}:x));setModal(prev=>({...prev,data:{...prev.data,[key]:val}}));};
    const days=ds2(a.lastContact||a.submitted);
    const allVacant=props.flatMap(p=>allRooms(p).filter(r=>r.st==="vacant").map(r=>({...r,propName:p.name,propId:p.id})));
    const targetProp=props.find(p=>p.name===a.property);
    const targetRoom=targetProp?allRooms(targetProp).find(r=>r.name===a.room&&r.st==="vacant"):null;
    const mf=[];var nm3=(a.name||"").toLowerCase();
    archive.forEach(t=>{
      if(((t.name||"").toLowerCase()===nm3)||((t.email||"").toLowerCase()===(a.email||"").toLowerCase())){
        const isEviction=t.reason&&(t.reason.toLowerCase().includes("evict")||t.reason.toLowerCase().includes("forcibly"));
        const isEarly=t.reason&&(t.reason.toLowerCase().includes("early")||t.reason.toLowerCase().includes("broke"));
        mf.push({
          type:isEviction?"evicted":isEarly?"early":"past",
          label:(isEviction?"⚠ Previously evicted":isEarly?"⚠ Broke lease early":"↩ Returning tenant")+" — "+(t.propName||"unknown")+(t.reason?" ("+t.reason+")":"")
        });
      }
    });
    apps.filter(x=>x.id!==a.id&&x.status==="denied").forEach(x=>{
      const nameMatch=(x.name||"").toLowerCase()===nm3&&nm3.length>0;
      const emailMatch=(x.email||"").toLowerCase()===(a.email||"").toLowerCase()&&(a.email||"").length>0;
      if(emailMatch||(nameMatch&&emailMatch))mf.push({type:"denied",label:"⚠ Previously denied"+(x.deniedReason?" — "+x.deniedReason:"")});
    });
    const reqs=[{key:"bgCheck",label:"Background Check"},{key:"creditScore",label:"Credit Check"},{key:"incomeVerified",label:"Income Verification"},{key:"refs",label:"References"},{key:"idVerified",label:"ID Verified"}];
    const waived=a.waived||[];
    const incompleteReqs=reqs.filter(r=>!waived.includes(r.label)&&a[r.key]!=="passed"&&a[r.key]!=="verified");
    const convertToTenant=(roomId,propId)=>{
      const mi=a.termMoveIn||a.moveIn||TODAY.toISOString().split("T")[0];
      const le=new Date(mi+"T00:00:00");le.setFullYear(le.getFullYear()+1);
      const appDocs=(a.documents||[]).map(doc=>({
        ...doc,
        tenantRoomId:roomId,
        tenant:a.name,
        source:"application",
        label:doc.label||doc.name,
      }));
      setProps(p=>p.map(pr=>pr.id!==propId?pr:updateRoomInProp(pr,roomId,rm=>({...rm,
        st:"occupied",
        le:le.toISOString().split("T")[0],
        tenant:{
          name:a.name,email:a.email,phone:a.phone,moveIn:mi,
          dob:a.dob||null,gender:a.gender||"",occupationType:a.occupationType||"",
          documents:appDocs,
          applicationData:a.applicationData||null,
          docsFlag:a.docsFlag||null,
        }
      }))));
      // Write application docs into hq-docs so tenant portal can see them
      if(appDocs.length>0){
        setDocs(prev=>{const updated=[...appDocs,...prev];save("hq-docs",updated);return updated;});
      }
      setApps(p=>p.filter(x=>x.id!==a.id));
      setNotifs(p=>[{id:uid(),type:"lease",msg:`${a.name} converted to tenant — ${appDocs.length} doc(s) transferred`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
      setModal(null);
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <h2>{a.name}</h2>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:700,color:score>=70?"#4a7c59":score>=50?"#d4a853":"#c45c4a",background:score>=70?"rgba(74,124,89,.08)":score>=50?"rgba(212,168,83,.08)":"rgba(196,92,74,.08)",padding:"3px 8px",borderRadius:5}}>Score: {score}</span>
          {days>0&&<span style={{fontSize:10,color:days>=5?"#c45c4a":days>=3?"#d4a853":"#999"}}>{days}d</span>}
        </div>
      </div>
      <div style={{display:"flex",gap:2,marginBottom:12}}>{STAGES.map((s,i)=><div key={s} style={{flex:1,textAlign:"center"}}><div style={{height:4,borderRadius:2,background:i<=si?"#d4a853":"rgba(0,0,0,.06)",marginBottom:2}}/><div style={{fontSize:7,color:i<=si?"#d4a853":"#999"}}>{SI3[s]}</div></div>)}</div>
      {mf.length>0&&<div style={{marginBottom:10}}>{mf.map((f,i)=><div key={i} style={{padding:"6px 10px",borderRadius:6,marginBottom:3,fontSize:11,fontWeight:600,
        background:f.type==="denied"||f.type==="evicted"?"rgba(196,92,74,.06)":f.type==="early"?"rgba(212,168,83,.06)":"rgba(74,124,89,.06)",
        color:f.type==="denied"||f.type==="evicted"?"#c45c4a":f.type==="early"?"#9a7422":"#2d6a3f"
      }}>{f.label}</div>)}</div>}
      {/* ── Editable Applicant Info ── */}
      <div className="tp-card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <h3 style={{margin:0}}>👤 Applicant Info</h3>
          <span style={{fontSize:9,color:"#d4a853",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Editable — syncs to lease</span>
        </div>
        <div className="fr" style={{marginBottom:6}}>
          <div className="fld" style={{marginBottom:0}}>
            <label>First Name</label>
            <input value={(a.name||"").split(" ")[0]} onChange={e=>{const full=e.target.value+" "+((a.name||"").split(" ").slice(1).join(" "));saveApp(a.id,"name",full.trim());}} style={{width:"100%"}}/>
          </div>
          <div className="fld" style={{marginBottom:0}}>
            <label>Last Name</label>
            <input value={(a.name||"").split(" ").slice(1).join(" ")} onChange={e=>{const full=((a.name||"").split(" ")[0]||"")+" "+e.target.value;saveApp(a.id,"name",full.trim());}} style={{width:"100%"}}/>
          </div>
        </div>
        <div className="fr" style={{marginBottom:6}}>
          <div className="fld" style={{marginBottom:0}}>
            <label>Email</label>
            <input type="email" value={a.email||""} onChange={e=>saveApp(a.id,"email",e.target.value)} style={{width:"100%"}}/>
          </div>
          <div className="fld" style={{marginBottom:0}}>
            <label>Phone</label>
            <input type="tel" value={a.phone||""} onChange={e=>saveApp(a.id,"phone",e.target.value)} style={{width:"100%"}}/>
          </div>
        </div>
        <div className="fld" style={{marginBottom:6}}>
          <label>Source</label>
          <input value={a.source||""} onChange={e=>saveApp(a.id,"source",e.target.value)} placeholder="e.g. Zillow, Roomies.com" style={{width:"100%"}}/>
        </div>
        <div className="fld" style={{marginBottom:0}}>
          <label>Reason for Leaving <span style={{fontWeight:400,color:"#999",fontSize:9,textTransform:"none",letterSpacing:0}}>— from applicant's pre-screen</span></label>
          <textarea value={a.notes||""} onChange={e=>{setApps(p=>p.map(x=>x.id===a.id?{...x,notes:e.target.value}:x));setModal(prev=>({...prev,data:{...prev.data,notes:e.target.value}}));}} placeholder="Why are they leaving their current place? (auto-filled from pre-screen form)" rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/>
        </div>
      </div>

      {/* ── Lease Preference (from Lease Now flow) ── */}
      {(a.leaseTerm||a.leasePrice||a.room)&&<div className="tp-card" style={{background:"rgba(74,124,89,.03)",border:"1px solid rgba(74,124,89,.12)"}}>
        <h3 style={{color:"#4a7c59"}}>✅ Lease Preferences — Submitted by Applicant</h3>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>
          {a.property&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>🏠 {a.property}</div>}
          {a.room&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>🛏 {a.room}</div>}
          {a.moveIn&&a.moveIn!=="Flexible"&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>📆 {fmtD(a.moveIn)}</div>}
          {a.leaseTerm&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>📅 {a.leaseTerm}</div>}
          {a.leasePrice&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>💰 ${a.leasePrice}/mo</div>}
        </div>
        <div style={{fontSize:9,color:"#999",marginTop:8}}>These are the terms the applicant agreed to when they clicked Lease Now. Use as reference when assigning room and setting rent.</div>
      </div>}


      {a.status==="reviewing"&&<div className="tp-card"><h3>📋 Review Checklist</h3>
        {reqs.map(r=>{const isW=waived.includes(r.label);const val=a[r.key]||"not-started";return(
          <div key={r.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.03)",opacity:isW?0.4:1}}>
            <span style={{fontSize:12,textDecoration:isW?"line-through":"none"}}>{r.label}{isW&&<span style={{fontSize:9,color:"#999",marginLeft:6}}>Waived</span>}</span>
            {!isW&&<select value={val} onChange={e=>{setApps(p=>p.map(x=>x.id===a.id?{...x,[r.key]:e.target.value}:x));setModal(prev=>({...prev,data:{...prev.data,[r.key]:e.target.value}}));}} style={{padding:"3px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:10,fontFamily:"inherit"}}><option value="not-started">Not Started</option><option value="pending">In Progress</option><option value="passed">Passed</option><option value="failed">Failed</option></select>}
          </div>);})}
        {a.waiverReason&&<div style={{fontSize:10,color:"#999",marginTop:6,fontStyle:"italic"}}>Waiver: {a.waiverReason}</div>}
      </div>}

      {/* ── Room Assignment (all stages) ── */}
      {(()=>{
        const moveInDate=a.termMoveIn||a.moveIn||"";
        const moveInMs=moveInDate?new Date(moveInDate+"T00:00:00").getTime():null;
        const availableItems=props.flatMap(p=>leaseableItems(p).filter(item=>{
          if(item.st==="vacant")return true;
          if(item.st==="occupied"&&item.le&&moveInMs)return new Date(item.le+"T00:00:00").getTime()<=moveInMs;
          return false;
        }).map(item=>({...item,_willVacate:item.st==="occupied"&&!!item.le})));
        const termProp=a.termPropId?props.find(p=>p.id===a.termPropId):props.find(p=>p.name===a.property);
        const allItems=termProp?leaseableItems(termProp):[];
        const termItem=a.termRoomId?allItems.find(i=>i.id===a.termRoomId):allItems.find(i=>i.name===a.room);
        const termRent=a.termRent!==undefined?a.termRent:(termItem?termItem.rent:0);
        const saveTerm=(key,val)=>{setApps(p=>p.map(x=>x.id===a.id?{...x,[key]:val}:x));setModal(prev=>({...prev,data:{...prev.data,[key]:val}}));};
        const selectedAvail=availableItems.find(i=>i.id===(a.termRoomId||termItem?.id));
        const itemLabel=(item,rent)=>{
          let label=(item.unitLabel&&!item.isWholeUnit?"Unit "+item.unitLabel+" — ":"")+item.name+" at "+(item.propName||"")+" — "+fmtS(rent)+"/mo";
          if(item._willVacate)label+=" · lease ends "+fmtD(item.le);
          if(item.isWholeUnit)label+=" (Whole Unit)";
          return label;
        };
        return(
        <div className="tp-card" style={{border:"2px solid rgba(212,168,83,.2)",background:"rgba(212,168,83,.02)"}}>
          <h3 style={{margin:"0 0 12px",color:"#9a7422"}}>🏠 Room / Unit Assignment</h3>
          <div className="fr" style={{marginBottom:8,gap:8}}>
            <div className="fld" style={{marginBottom:0}}>
              <label>Property</label>
              <select value={a.property||""} onChange={e=>{saveApp(a.id,"property",e.target.value);saveApp(a.id,"room","");saveApp(a.id,"termRoomId",null);saveApp(a.id,"termPropId",null);}} style={{width:"100%"}}>
                <option value="">No preference</option>
                {props.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div className="fld" style={{marginBottom:0}}>
              <label>Move-in Date</label>
              <input type="date" value={moveInDate} onChange={e=>{saveApp(a.id,"moveIn",e.target.value);saveApp(a.id,"termMoveIn",e.target.value);}} style={{width:"100%"}}/>
            </div>
          </div>
          <div className="fld" style={{marginBottom:8}}>
            <label>Assign Room / Unit <span style={{fontWeight:400,color:"#777",fontSize:9,textTransform:"none",letterSpacing:0}}>Vacant now + units whose lease ends by move-in date</span></label>
            <select value={a.termRoomId||termItem?.id||""} onChange={e=>{const item=availableItems.find(x=>x.id===e.target.value);if(item){saveTerm("termRoomId",item.id);saveTerm("termPropId",item.propId);saveTerm("termRent",item.rent);saveTerm("termSD",item.rent);}}} style={{width:"100%"}}>
              <option value="">No assignment at this time</option>
              {availableItems.map(item=>{
                const isSelected=item.id===(a.termRoomId||termItem?.id);
                const rent=isSelected?termRent:item.rent;
                return<option key={item.id} value={item.id}>{itemLabel(item,rent)}</option>;
              })}
              {termItem&&!availableItems.find(i=>i.id===termItem.id)&&<option value={termItem.id}>⚠ {termItem.name} at {termProp?.name} — occupied, lease not expired by move-in</option>}
            </select>
            {termItem&&!availableItems.find(i=>i.id===termItem.id)&&<div style={{fontSize:10,color:"#c45c4a",marginTop:4,fontWeight:600,animation:"shake .4s ease"}}>⚠ This unit is currently occupied and its lease does not end by the selected move-in date.</div>}
            {!termItem&&!a.termRoomId&&a.room&&<div style={{fontSize:10,color:"#c45c4a",marginTop:4,fontWeight:600,animation:"shake .4s ease"}}>⚠ "{a.room}" is not available — select an available room or unit.</div>}
          </div>
          {(a.termRoomId||termItem?.id)&&<>
            <div className="fr" style={{gap:8,marginBottom:0}}>
              <div className="fld" style={{marginBottom:0}}>
                <label>Monthly Rent <span style={{fontWeight:400,color:"#777",fontSize:9,textTransform:"none",letterSpacing:0}}>Edit if rate differs from listing</span></label>
                <div style={{display:"flex",alignItems:"center",gap:0}}>
                  <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
                  <input type="number" min={0} value={termRent||""} onChange={e=>{const v=Number(e.target.value)||0;saveTerm("termRent",v);if(a.termSD===undefined||a.termSD===termRent)saveTerm("termSD",v);}} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
                </div>
              </div>
              <div className="fld" style={{marginBottom:0}}>
                <label>Security Deposit <span style={{fontWeight:400,color:"#777",fontSize:9,textTransform:"none",letterSpacing:0}}>Auto-fills from rent — editable</span></label>
                <div style={{display:"flex",alignItems:"center",gap:0}}>
                  <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#999",fontWeight:700}}>$</span>
                  <input type="number" min={0} value={a.termSD!==undefined?a.termSD:(termRent||"")} onChange={e=>saveTerm("termSD",Number(e.target.value)||0)} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
                </div>
              </div>
            </div>
            {selectedAvail?._willVacate&&<div style={{marginTop:8,fontSize:10,color:"#9a7422",background:"rgba(212,168,83,.06)",borderRadius:6,padding:"7px 10px"}}>
              ⏳ Current lease ends {fmtD(selectedAvail.le)} — unit will be vacant by move-in date.
            </div>}
          </>}
        </div>);
      })()}
      {(a.status==="approved"||a.status==="move-in"||a.status==="onboarding")&&<div className="tp-card"><h3>📋 Screening Summary</h3>
        {reqs.map(r=>{const isW=waived.includes(r.label);const val=a[r.key]||"—";const passed=val==="passed"||val==="verified";return(
          <div key={r.key} style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.03)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,opacity:isW?.45:1,textDecoration:isW?"line-through":"none"}}>{r.label}</span>
              <span style={{fontSize:11,fontWeight:700,color:isW?"#bbb":passed?"#4a7c59":val==="pending"?"#d4a853":"#c45c4a"}}>{isW?"Bypassed":passed?"✓ "+val:val}</span>
            </div>
            {isW&&<div style={{fontSize:9,color:"#999",fontStyle:"italic",marginTop:1}}>{a.waiverReason?"Reason: "+a.waiverReason:"⚠ No waiver reason on file"}</div>}
          </div>);})}
        {a.approvedWithPending&&<div style={{marginTop:6,padding:"5px 8px",background:"rgba(212,168,83,.06)",borderRadius:5,fontSize:10,color:"#9a7422"}}>Approved with pending: {a.approvedWithPending}</div>}
      </div>}
      {/* Roommate Compatibility */}
      {a.property&&<div className="tp-card"><h3>🏠 Housemates at {a.property}</h3>
        {(function(){
          var pr=props.find(function(p){return p.name===a.property;});
          if(!pr)return null;
          const calcAge=(dob)=>{if(!dob)return null;const b=new Date(dob+"T00:00:00");if(isNaN(b))return null;const today=new Date();let age=today.getFullYear()-b.getFullYear();const m=today.getMonth()-b.getMonth();if(m<0||(m===0&&today.getDate()<b.getDate()))age--;return age>=10&&age<120?age:null;};
          // Find which unit the applicant is interested in — use termRoomId, then room name, then fall back to all units
          const allItems=leaseableItems(pr);
          const assignedItem=a.termRoomId?allItems.find(i=>i.id===a.termRoomId||i.unitId===a.termRoomId)
            :a.room?allItems.find(i=>i.name===a.room||i.unitId===(pr.units||[]).find(u=>(u.rooms||[]).some(r=>r.name===a.room))?.id)
            :null;
          const targetUnitId=assignedItem?.unitId||null;
          // If we know the unit, only show housemates from that unit; otherwise show all
          const items=targetUnitId?allItems.filter(i=>i.unitId===targetUnitId):allItems;
          const unitLabel=targetUnitId?(pr.units||[]).find(u=>u.id===targetUnitId)?.name:null;
          return(<>
            {unitLabel&&(pr.units||[]).length>1&&<div style={{fontSize:9,color:"#d4a853",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>{unitLabel}</div>}
            {items.map(function(item){
              if(item.isWholeUnit){
                const occ=item.st==="occupied";
                return(
                  <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600}}>{item.name} <span style={{fontSize:9,color:"#d4a853",fontWeight:500}}>Whole Unit</span></div>
                      {occ&&<div style={{fontSize:10,color:"#5c4a3a",marginTop:2}}>Occupied</div>}
                      {!occ&&<div style={{fontSize:10,color:"#4a7c59",fontWeight:600,marginTop:2}}>Vacant</div>}
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#999"}}>{fmtS(item.rent)}/mo</div>
                      <div style={{fontSize:8,color:"#bbb",marginTop:1}}>whole unit</div>
                    </div>
                  </div>
                );
              }
              const occ=item.st==="occupied"&&item.tenant;
              const age=occ?calcAge(item.tenant.dob):null;
              const genderShort=occ&&item.tenant.gender?item.tenant.gender==="Male"?"M":item.tenant.gender==="Female"?"F":item.tenant.gender==="Non-binary"?"NB":null:null;
              return(
                <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:600}}>{item.name}</div>
                    {occ&&<div style={{fontSize:10,color:"#5c4a3a",marginTop:2}}>
                      {item.tenant.name||"Occupied"}
                      {(genderShort||age||item.tenant.occupationType)&&<span style={{color:"#999",marginLeft:6}}>
                        {[genderShort,age?"Age "+age:null,item.tenant.occupationType].filter(Boolean).join(" · ")}
                      </span>}
                    </div>}
                    {!occ&&<div style={{fontSize:10,color:"#4a7c59",fontWeight:600,marginTop:2}}>Vacant</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#999"}}>{fmtS(item.rent)}/mo</div>
                    <div style={{fontSize:8,color:"#bbb",marginTop:1}}>12-mo lease</div>
                  </div>
                </div>
              );
            })}
          </>);
        })()}
      </div>}

      {/* Communication Log */}
      <div className="tp-card"><h3>📞 Comm Log</h3>
        <div style={{display:"flex",gap:4,marginBottom:8}}>
          {["Call","Text","Email","Note"].map(function(tp){return(
            <button key={tp} className="btn btn-out btn-sm" style={{flex:1,fontSize:9}} onClick={function(){setModal(function(prev){return Object.assign({},prev,{showCommInput:tp,commText:""});});}}>{tp==="Call"?"📞":tp==="Text"?"💬":tp==="Email"?"✉️":"📝"}{" "+tp}</button>);})}
        </div>
        {modal.showCommInput&&<div style={{display:"flex",gap:4,marginBottom:8}}>
          <input value={modal.commText||""} onChange={function(e){setModal(function(prev){return Object.assign({},prev,{commText:e.target.value});});}} placeholder={"Log this "+modal.showCommInput+"..."} style={{flex:1,padding:"6px 10px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit"}} autoFocus/>
          <button className="btn btn-green btn-sm" disabled={!(modal.commText||"").trim()} onClick={function(){var log={type:modal.showCommInput,text:modal.commText,date:TODAY.toISOString().split("T")[0],time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};setApps(function(p){return p.map(function(x){return x.id===a.id?Object.assign({},x,{commLog:[log].concat(x.commLog||[]),lastContact:TODAY.toISOString().split("T")[0]}):x;});});setModal(function(prev){return Object.assign({},prev,{showCommInput:null,commText:"",data:Object.assign({},prev.data,{commLog:[log].concat(prev.data.commLog||[]),lastContact:TODAY.toISOString().split("T")[0]})});});}}>Save</button>
        </div>}
        {(a.commLog||[]).length>0?<div style={{maxHeight:120,overflowY:"auto"}}>{(a.commLog||[]).map(function(c,i){return(
          <div key={i} style={{display:"flex",gap:6,padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.02)",fontSize:10}}>
            <span style={{width:20,textAlign:"center"}}>{c.type==="Call"?"📞":c.type==="Text"?"💬":c.type==="Email"?"✉️":"📝"}</span>
            <div style={{flex:1}}><div style={{color:"#333"}}>{c.text}</div><div style={{color:"#999",fontSize:9}}>{c.date}{" "}{c.time}</div></div>
          </div>);})}</div>:<div style={{fontSize:10,color:"#ccc",textAlign:"center",padding:8}}>No communication logged</div>}
      </div>

      {/* Documents from application */}
      {((a.documents&&a.documents.length>0)||a.docsFlag)&&<div className="tp-card">
        <h3>📎 Application Documents</h3>
        {a.docsFlag&&<>
          {!a.docsFlag.idUploaded&&<div style={{fontSize:10,padding:"4px 8px",borderRadius:5,background:a.docsFlag.idUploadLater?"rgba(212,168,83,.06)":"rgba(196,92,74,.06)",color:a.docsFlag.idUploadLater?"#9a7422":"#c45c4a",marginBottom:4}}>
            {a.docsFlag.idUploadLater?"⏳ Photo ID — will upload later":"⚠ Photo ID — not submitted"}
          </div>}
          {!a.docsFlag.incomeUploaded&&<div style={{fontSize:10,padding:"4px 8px",borderRadius:5,background:a.docsFlag.incomeUploadLater?"rgba(212,168,83,.06)":"rgba(74,124,89,.06)",color:a.docsFlag.incomeUploadLater?"#9a7422":"#4a7c59",marginBottom:4}}>
            {a.docsFlag.incomeUploadLater?"⏳ Proof of Income — will upload later":"ℹ Proof of Income — not submitted"}
          </div>}
        </>}
        {(a.documents||[]).map((doc,i)=>(
          <div key={doc.id||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
            <div>
              <div style={{fontSize:12,fontWeight:600}}>{doc.label||doc.name}</div>
              <div style={{fontSize:9,color:"#999"}}>{doc.name} · Uploaded {doc.uploaded}</div>
            </div>
            {doc.data&&<a href={doc.data} download={doc.name} className="btn btn-out btn-sm" style={{fontSize:9,textDecoration:"none"}}>⬇ Download</a>}
          </div>
        ))}
        {(!a.documents||a.documents.length===0)&&<div style={{fontSize:11,color:"#999",fontStyle:"italic"}}>No files uploaded yet.</div>}
      </div>}


      {/* Move-in charges — shown on approved applicants */}
      {(a.status==="approved"||a.status==="onboarding")&&(()=>{
        const lk=a.lockActivation;
        if(lk)return(
        <div className="tp-card" style={{marginTop:10,border:"1px solid rgba(212,168,83,.2)",background:"rgba(212,168,83,.02)"}}>
          <h3 style={{color:"#9a7422"}}>🔑 Door Passcode</h3>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:28,fontWeight:900,letterSpacing:8,fontFamily:"monospace",color:"#1a1714"}}>{lk.passcode||a.passcode}</div>
              <div style={{fontSize:10,color:"#999",marginTop:4}}>Activates 12:00am on {fmtD(termMoveIn||a.moveIn)} · All exterior doors + bedroom</div>
            </div>
            <div style={{textAlign:"right"}}>
              <span className={`badge ${lk.status==="active"?"b-green":"b-gold"}`}>{lk.status==="active"?"Active":"Pending"}</span>
              <div style={{fontSize:9,color:"#999",marginTop:4}}>Smart lock API: stub ready</div>
            </div>
          </div>
          {!lk.passcode&&!a.passcode&&<div style={{fontSize:10,color:"#c45c4a",marginTop:6}}>⚠ No passcode — tenant didn't set one in their application.</div>}
        </div>);
        return null;
      })()}
      {(a.status==="approved"||a.status==="onboarding")&&(()=>{
        const appCharges=charges.filter(c=>c.tenantName===a.name&&["Security Deposit","Rent","Move-In Fee"].includes(c.category));
        if(!appCharges.length)return null;
        const totalDue=appCharges.reduce((s,c)=>s+c.amount,0);
        const totalPaid=appCharges.reduce((s,c)=>s+c.amountPaid,0);
        const remaining=totalDue-totalPaid;
        return(
        <div className="tp-card" style={{marginTop:10,border:"1px solid rgba(74,124,89,.2)",background:"rgba(74,124,89,.02)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <h3 style={{margin:0,color:"#4a7c59"}}>💳 Move-In Charges</h3>
            <span style={{fontSize:11,fontWeight:700,color:remaining>0?"#c45c4a":"#4a7c59"}}>{remaining>0?`${fmtS(remaining)} remaining`:"✓ Fully paid"}</span>
          </div>
          {appCharges.map(c=>{
            const st=chargeStatus(c);const paid=c.amountPaid;const rem=c.amount-paid;
            return(
            <div key={c.id} style={{padding:"8px 0",borderBottom:"1px solid rgba(0,0,0,.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:12,fontWeight:600}}>{c.category==="Security Deposit"?"🔒":"🏠"} {c.desc}</div>
                <div style={{fontSize:10,color:"#999"}}>Due {fmtD(c.dueDate)}</div>
                {paid>0&&paid<c.amount&&<div style={{fontSize:10,color:"#d4a853",fontWeight:600}}>{fmtS(paid)} paid · {fmtS(rem)} remaining</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <span style={{fontWeight:800,fontSize:13}}>{fmtS(c.amount)}</span>
                <span className={`badge ${st==="paid"?"b-green":st==="partial"?"b-gold":st==="pastdue"?"b-red":"b-gray"}`} style={{fontSize:7}}>{st}</span>
                {st!=="paid"&&<button className="btn btn-green btn-sm" style={{fontSize:9,padding:"3px 8px"}} onClick={()=>setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""})}>💰 Pay</button>}
              </div>
            </div>);
          })}
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0",fontWeight:800,fontSize:12,borderTop:"1px solid rgba(0,0,0,.06)",marginTop:4}}>
            <span>Total Move-In</span>
            <span style={{color:remaining>0?"#c45c4a":"#4a7c59"}}>{fmtS(totalPaid)} / {fmtS(totalDue)}</span>
          </div>
        </div>);
      })()}

      <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
        {a.status==="pre-screened"&&<><button className="btn btn-green" style={{flex:1}} onClick={()=>{setApps(p=>p.map(x=>x.id===a.id?{...x,status:"called",lastContact:TODAY.toISOString().split("T")[0]}:x));setModal(null);}}>📞 Mark as Called</button><button className="btn btn-dk" style={{flex:1}} onClick={()=>setModal({type:"inviteApp",data:a})}>📋 Set Up Invite →</button></>}
        {a.status==="called"&&<button className="btn btn-dk" style={{flex:1}} onClick={()=>setModal({type:"inviteApp",data:a})}>📋 Set Up Invite →</button>}
        {a.status==="invited"&&<div style={{flex:1,textAlign:"center",padding:"10px",background:"rgba(212,168,83,.06)",borderRadius:8,fontSize:12,color:"#9a7422"}}>⏳ Waiting for {a.name} to submit their application...</div>}
        {a.status==="applied"&&<button className="btn btn-green" style={{flex:1}} onClick={()=>{setApps(p=>p.map(x=>x.id===a.id?{...x,status:"reviewing",lastContact:TODAY.toISOString().split("T")[0]}:x));setModal(prev=>({...prev,data:{...prev.data,status:"reviewing"}}));}}>🔍 Start Review</button>}
        {a.status==="reviewing"&&<>
          {incompleteReqs.length>0&&<div style={{width:"100%",padding:"10px 12px",background:"rgba(212,168,83,.07)",border:"1px solid rgba(212,168,83,.25)",borderRadius:8,fontSize:11,color:"#9a7422",marginBottom:6}}>
            <div style={{fontWeight:700,marginBottom:4}}>⚠ Still pending — review before approving:</div>
            {incompleteReqs.map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"2px 0"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#d4a853",flexShrink:0,display:"inline-block"}}/>
              {r.label}
            </div>)}
            <div style={{marginTop:6,fontSize:10,color:"#9a7422",opacity:.8}}>You can still approve — you'll be asked to confirm again.</div>
          </div>}
          <button className="btn btn-green" style={{flex:1}} onClick={()=>setModal({type:"approveConfirm",data:a,incompleteReqs,step:1})}>
            ⚙️ Configure Charges & Send Lease{incompleteReqs.length>0?" Anyway":""}
          </button>
        </>}
        {a.status==="lease-sent"&&<div style={{width:"100%"}}>
          <div style={{padding:"10px 12px",background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.2)",borderRadius:8,marginBottom:8,fontSize:11,color:"#9a7422",fontWeight:600,textAlign:"center"}}>
            📨 Lease sent — awaiting tenant signature
          </div>
          {a.chargeConfig&&<div style={{padding:"10px 12px",background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.12)",borderRadius:8,fontSize:11,color:"#2d6a3f",marginBottom:8}}>
            <div style={{fontWeight:700,marginBottom:4}}>Charges pending tenant signature:</div>
            {(()=>{const cfg=a.chargeConfig;const items=[];items.push({l:"Security Deposit",v:cfg.sd});if(cfg.structure==="prorated")items.push({l:"Prorated Rent ("+cfg.proratedDays+"d)",v:cfg.proratedAmt});else items.push({l:"First Month Rent",v:cfg.rent});if(cfg.structure==="first-last")items.push({l:"Last Month Rent",v:cfg.rent});return items.map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between"}}><span>{it.l}</span><strong>{fmtS(it.v)}</strong></div>);})()}
          </div>}
          <button className="btn btn-out btn-sm" style={{width:"100%"}} onClick={()=>setModal({type:"approveConfirm",data:a,incompleteReqs:[],step:1})}>
            ✏️ Reconfigure Charges
          </button>
        </div>}
        {(a.status==="approved"||a.status==="onboarding")&&(()=>{
          const appCharges2=charges.filter(c=>c.tenantName===a.name&&["Security Deposit","Rent","Move-In Fee"].includes(c.category));
          const totalDue2=appCharges2.reduce((s,c)=>s+c.amount,0);
          const totalPaid2=appCharges2.reduce((s,c)=>s+c.amountPaid,0);
          const fullyPaid=appCharges2.length>0&&totalPaid2>=totalDue2;
          const moveInDate=a.termMoveIn||a.moveIn;
          return(
          <div style={{width:"100%"}}>
            {moveInDate&&<div style={{padding:"8px 12px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.15)",borderRadius:8,marginBottom:6,fontSize:11,color:"#2d6a3f",fontWeight:600,textAlign:"center"}}>
              Pending move-in: {fmtD(moveInDate)}
            </div>}
            {fullyPaid
              ?<button className="btn btn-green" style={{flex:1,width:"100%"}} onClick={()=>{if(targetRoom)convertToTenant(targetRoom.id,targetProp.id);else showAlert({title:"Room Not Found",body:"Could not find the assigned room. Please check the room assignment and try again."});}}>🔑 All Paid — Convert to Tenant</button>
              :<div style={{padding:"8px 12px",background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.2)",borderRadius:8,fontSize:11,color:"#9a7422",textAlign:"center"}}>
                {appCharges2.length===0?"No move-in charges found — go to Payments to add them.":`Waiting for payment — ${fmtS(totalDue2-totalPaid2)} remaining`}
              </div>
            }
          </div>);
        })()}
        
        <button className="btn btn-out" style={{color:"#c45c4a"}} onClick={()=>setModal({type:"denyApp",appId:a.id,reason:""})}>Deny</button>
      </div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Close</button></div>
    </div></div>);})()}

  {modal&&modal.type==="archived"&&(()=>{const a=modal.data;const payMonths=Object.keys(a.payments||{});const totalPaid=Object.values(a.payments||{}).reduce((s,v)=>s+(typeof v==="object"?Object.values(v).reduce((ss,vv)=>ss+vv,0):v),0);
    const moveIn=a.moveIn?new Date(a.moveIn+"T00:00:00"):null;const termDate=a.terminatedDate?new Date(a.terminatedDate+"T00:00:00"):null;
    const tenureDays=moveIn&&termDate?Math.ceil((termDate-moveIn)/(1e3*60*60*24)):null;const tenureMonths=tenureDays?Math.round(tenureDays/30):null;
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:540}}>
      <h2>{a.name} <span className="badge b-gray" style={{verticalAlign:"middle"}}>Past Tenant</span></h2>
      <div className="tp-card"><h3>📞 Contact</h3><div className="tp-row"><span className="tp-label">Phone</span><strong>{a.phone}</strong></div><div className="tp-row"><span className="tp-label">Email</span><strong>{a.email}</strong></div></div>
      <div className="tp-card"><h3>🏠 Room History</h3><div className="tp-row"><span className="tp-label">Property</span><strong>{a.propName}</strong></div><div className="tp-row"><span className="tp-label">Room</span><strong>{a.roomName}</strong></div><div className="tp-row"><span className="tp-label">Rent</span><strong>{fmtS(a.rent)}/mo</strong></div></div>
      <div className="tp-card"><h3>📋 Lease History</h3><div className="tp-row"><span className="tp-label">Move-in</span><strong>{fmtD(a.moveIn)}</strong></div><div className="tp-row"><span className="tp-label">Lease End</span><strong>{fmtD(a.leaseEnd)}</strong></div><div className="tp-row"><span className="tp-label">Terminated</span><strong>{fmtD(a.terminatedDate)}</strong></div>{tenureMonths&&<div className="tp-row"><span className="tp-label">Tenure</span><strong>{tenureMonths} months ({tenureDays} days)</strong></div>}<div className="tp-row"><span className="tp-label">Total Revenue</span><strong style={{color:"#4a7c59"}}>{fmtS(a.rent*(tenureMonths||0))}</strong></div></div>
      <div className="tp-card" style={{background:"rgba(196,92,74,.03)",borderColor:"rgba(196,92,74,.1)"}}><h3 style={{color:"#c45c4a"}}>⚠ Termination</h3><div className="tp-row"><span className="tp-label">Date</span><strong>{fmtD(a.terminatedDate)}</strong></div><div className="tp-row"><span className="tp-label">Reason</span><strong>{a.reason}</strong></div></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Close</button></div>
    </div></div>);})()}

  {editProp!==null&&<PropEditor prop={isNewProp?null:editProp} onSave={saveProp} onClose={()=>setEditProp(null)} isNew={isNewProp} onViewTenant={(r,propName)=>{setEditProp(null);setModal({type:"tenant",data:{...r,propName,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils||r.utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean||r.clean}});}} settings={settings} onUpdateSettings={s=>{setSettings(s);save("hq-settings",s);}} onDelete={id=>{setProps(prev=>prev.filter(x=>x.id!==id));setEditProp(null);}}/>}

  {/* Centered Confirm / Alert Dialog — replaces all window.confirm and alert calls */}
  {confirmDialog&&<div className="mbg" onClick={()=>{if(!confirmDialog.onConfirm)setConfirmDialog(null);}} style={{zIndex:9999}}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420,textAlign:"center"}}>
    <div style={{fontSize:confirmDialog.danger?32:28,marginBottom:12}}>{confirmDialog.danger?"⚠️":"ℹ️"}</div>
    <h2 style={{marginBottom:8,color:confirmDialog.danger?"#c45c4a":"#1a1714"}}>{confirmDialog.title}</h2>
    <p style={{fontSize:13,color:"#5c4a3a",lineHeight:1.6,marginBottom:20}}>{confirmDialog.body}</p>
    <div className="mft">
      <button className="btn btn-out" onClick={()=>setConfirmDialog(null)}>{confirmDialog.onConfirm?"Cancel":"OK"}</button>
      {confirmDialog.onConfirm&&<button className={"btn "+(confirmDialog.danger?"btn-red":"btn-gold")} onClick={()=>{confirmDialog.onConfirm();setConfirmDialog(null);}}>{confirmDialog.confirmLabel||"Confirm"}</button>}
    </div>
  </div></div>}

  {/* Confetti */}
  {showConfetti&&<div className="confetti-wrap">{Array.from({length:60}).map((_,i)=>{const colors=["#d4a853","#4a7c59","#f5f0e8","#c45c4a","#3b82f6"];return(
    <div key={i} className="confetti-piece" style={{left:`${Math.random()*100}%`,background:colors[i%colors.length],width:Math.random()*8+6,height:Math.random()*8+6,borderRadius:Math.random()>0.5?"50%":"2px",animationDuration:`${Math.random()*2+2}s`,animationDelay:`${Math.random()*1.5}s`}}/>
  );})}</div>}

  {/* New Application Toast */}
  {leadToast&&<div className={`lead-toast ${toastDismissing?"out":""}`}>
    <div style={{textAlign:"center",marginBottom:12}}><div style={{fontSize:14,fontWeight:800,color:"#d4a853",letterSpacing:1.5}}>🎉 NEW APPLICATION!</div></div>
    <div style={{textAlign:"center",marginBottom:10}}><div style={{fontSize:22,fontWeight:800,color:"#f5f0e8"}}>{leadToast.name}</div></div>
    <div style={{display:"flex",justifyContent:"center",gap:16,fontSize:12,color:"#c4a882",marginBottom:14,flexWrap:"wrap"}}>
      {leadToast.phone&&<span>📞 {leadToast.phone}</span>}
      {leadToast.property&&<span>🏠 {leadToast.property}</span>}
      {leadToast.room&&<span>🚪 {leadToast.room}</span>}
    </div>
    <button onClick={viewNewLead} style={{width:"100%",padding:"12px 20px",background:"#d4a853",color:"#1a1714",border:"none",borderRadius:8,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:6}}>Review Application →</button>
    <div style={{textAlign:"center"}}><button onClick={dismissToast} style={{background:"none",border:"none",color:"#666",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Dismiss</button></div>
  </div>}

  </>);
}
