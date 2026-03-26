"use client";
import { syncTenantToSupabase } from "@/lib/syncTenant";
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
const fmtDp=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${String(dt.getMonth()+1).padStart(2,"0")}/${String(dt.getDate()).padStart(2,"0")}/${dt.getFullYear()}`;}
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
      if(u.ownerOccupied)return[]; // skip owner-occupied whole units
      return[{
        id:u.id,name:(prop.units||[]).length>1?u.name:"Whole Unit",
        rent:u.rent||0,st:anyOcc?"occupied":"vacant",le:latestLe,
        propName:pn,propId:prop.id,unitId:u.id,unitName:u.name,unitLabel:u.label,
        isWholeUnit:true,baths:u.baths,sqft:u.sqft,beds:rooms.length,
      }];
    }
    return(u.rooms||[]).filter(r=>!r.ownerOccupied).map(r=>({...r,st:r.st||(r.tenant?"occupied":"vacant"),propName:pn,propId:prop.id,unitId:u.id,unitName:u.name,unitLabel:u.label,isWholeUnit:false}));
  });
};
// Update a room by ID inside its unit, preserving hierarchy
const updateRoomInProps=(props,roomId,updater)=>props.map(p=>({...p,units:(p.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(r=>r.id===roomId?updater(r):r)}))}));
// Update a specific prop's room by ID
const updateRoomInProp=(prop,roomId,updater)=>({...prop,units:(prop.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(r=>r.id===roomId?updater(r):r)}))});


const DEF_PAYMENTS={};// {roomId: {month: amount}} - quick lookup (computed from charges)
const CHARGE_CATS=["Rent","Utility Overage","Late Fee","Security Deposit","Cleaning Fee","Damage Charge","Lock Change","Key Replacement","Move-In Fee","Move-Out Fee","Pet Violation","Smoking Violation","Guest Violation"];
const PAY_METHODS=["Zelle","Venmo","Cash","Check","CashApp","Bank Transfer","Stripe/ACH","Credit Card","Other"];
const ACH_METHODS=["Bank Transfer","Stripe/ACH"]; // locked — no edit on paid charges
const SCHED_E_CATS=[
  {id:"advertising",label:"Advertising",line:5,hint:"Listing fees, signage, online ads"},
  {id:"auto_travel",label:"Auto & Travel",line:6,hint:"Mileage to properties, travel for repairs"},
  {id:"cleaning_maintenance",label:"Cleaning & Maintenance",line:7,hint:"Routine cleaning, landscaping, pest control"},
  {id:"commissions",label:"Commissions",line:8,hint:"Leasing agent fees, referral commissions"},
  {id:"insurance",label:"Insurance",line:9,hint:"Hazard, liability, umbrella policies"},
  {id:"legal_professional",label:"Legal & Professional Fees",line:10,hint:"CPA fees, attorney fees, bookkeeping"},
  {id:"management_fees",label:"Management Fees",line:11,hint:"PM software, property management services"},
  {id:"mortgage_interest",label:"Mortgage Interest",line:12,hint:"Interest from your 1098 — banks only"},
  {id:"other_interest",label:"Other Interest",line:13,hint:"Interest on non-bank loans, hard money"},
  {id:"repairs",label:"Repairs",line:14,hint:"Fixes that restore — NOT improvements that add value"},
  {id:"supplies",label:"Supplies",line:15,hint:"Cleaning supplies, small tools, hardware"},
  {id:"property_tax",label:"Taxes — Property",line:16,hint:"Annual property tax payments"},
  {id:"utilities",label:"Utilities",line:17,hint:"Electric, gas, water, trash, internet you pay"},
  {id:"depreciation",label:"Depreciation",line:18,hint:"Calculated by your CPA — enter CPA-provided amount"},
  {id:"other",label:"Other",line:19,hint:"Anything that truly doesn't fit above"},
];
const SCHED_E_CAT_LABELS=SCHED_E_CATS.map(c=>c.label);
const IMPROVEMENT_TYPES=["Addition","Appliance","Flooring","HVAC","Landscaping","Plumbing","Electrical","Roof","Windows","Other"];
const STARTER_SUBCATS_BY_CAT={
  "Advertising":[{id:"sc-ad1",label:"Listing Fees"},{id:"sc-ad2",label:"Signage"},{id:"sc-ad3",label:"Online Ads"},{id:"sc-ad4",label:"Photography"},{id:"sc-ad5",label:"Print / Flyers"}],
  "Auto & Travel":[{id:"sc-at1",label:"Mileage"},{id:"sc-at2",label:"Gas"},{id:"sc-at3",label:"Tolls / Parking"},{id:"sc-at4",label:"Flights"},{id:"sc-at5",label:"Hotel / Lodging"}],
  "Cleaning & Maintenance":[{id:"sc-cm1",label:"Routine Cleaning"},{id:"sc-cm2",label:"Landscaping"},{id:"sc-cm3",label:"Pest Control"},{id:"sc-cm4",label:"Snow Removal"},{id:"sc-cm5",label:"Trash Hauling"},{id:"sc-cm6",label:"Pressure Washing"}],
  "Commissions":[{id:"sc-co1",label:"Leasing Agent"},{id:"sc-co2",label:"Referral Fee"},{id:"sc-co3",label:"Broker Fee"}],
  "Insurance":[{id:"sc-in1",label:"Hazard / Dwelling"},{id:"sc-in2",label:"Liability"},{id:"sc-in3",label:"Umbrella"},{id:"sc-in4",label:"Flood"},{id:"sc-in5",label:"Renters (Landlord-paid)"}],
  "Legal & Professional Fees":[{id:"sc-lp1",label:"CPA / Tax Prep"},{id:"sc-lp2",label:"Attorney"},{id:"sc-lp3",label:"Bookkeeping"},{id:"sc-lp4",label:"Eviction Filing"},{id:"sc-lp5",label:"Entity Formation"}],
  "Management Fees":[{id:"sc-mf1",label:"PM Software"},{id:"sc-mf2",label:"PM Company Fee"},{id:"sc-mf3",label:"Leasing Fee"},{id:"sc-mf4",label:"Tenant Placement"}],
  "Mortgage Interest":[{id:"sc-mi1",label:"Bank Mortgage"},{id:"sc-mi2",label:"HELOC"},{id:"sc-mi3",label:"Refi Costs"}],
  "Other Interest":[{id:"sc-oi1",label:"Hard Money"},{id:"sc-oi2",label:"Seller Finance"},{id:"sc-oi3",label:"Private Lender"}],
  "Repairs":[{id:"sc-rp1",label:"Painting"},{id:"sc-rp2",label:"Plumbing"},{id:"sc-rp3",label:"Electrical"},{id:"sc-rp4",label:"HVAC"},{id:"sc-rp5",label:"Appliance Repair"},{id:"sc-rp6",label:"Flooring"},{id:"sc-rp7",label:"Lock & Security"},{id:"sc-rp8",label:"Roofing"},{id:"sc-rp9",label:"Structural"},{id:"sc-rp10",label:"Window & Door"},{id:"sc-rp11",label:"Other"}],
  "Supplies":[{id:"sc-su1",label:"Cleaning Supplies"},{id:"sc-su2",label:"Small Tools"},{id:"sc-su3",label:"Hardware"},{id:"sc-su4",label:"Light Bulbs / Filters"},{id:"sc-su5",label:"Paint / Caulk"}],
  "Taxes — Property":[{id:"sc-tx1",label:"Annual Property Tax"},{id:"sc-tx2",label:"Special Assessment"}],
  "Utilities":[{id:"sc-ut1",label:"Electric"},{id:"sc-ut2",label:"Gas"},{id:"sc-ut3",label:"Water / Sewer"},{id:"sc-ut4",label:"Trash"},{id:"sc-ut5",label:"Internet / WiFi"},{id:"sc-ut6",label:"Cable / TV"}],
  "Depreciation":[{id:"sc-dp1",label:"Building"},{id:"sc-dp2",label:"Appliances"},{id:"sc-dp3",label:"Cost Seg Study"}],
  "Other":[{id:"sc-ot1",label:"Bank Fees"},{id:"sc-ot2",label:"Permits / Licenses"},{id:"sc-ot3",label:"HOA Dues"},{id:"sc-ot4",label:"Miscellaneous"}],
};
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
  {id:"a1",name:"Jordan Lee",email:"jordan.lee@email.com",phone:"(256) 555-9001",property:"Lee Drive East",room:"",moveIn:"2026-04-15",income:"$3,800",status:"new-lead",submitted:"2026-03-13",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"Roomies.com",lastContact:"2026-03-13",notes:"Found us on Roomies.com. Interested in a 3BR."},
  {id:"a2",name:"Priya Sharma",email:"priya.s@email.com",phone:"(256) 555-9002",property:"The Holmes House",room:"",moveIn:"2026-05-01",income:"$4,500",status:"new-lead",submitted:"2026-03-12",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"Google Search",lastContact:"2026-03-12",notes:""},
  // ── Called (spoke on phone, deciding whether to invite) ──
  {id:"a3",name:"Rachel Kim",email:"rachel.k@email.com",phone:"(256) 555-9003",property:"The Holmes House",room:"Bedroom 4",moveIn:"2026-05-15",income:"$5,500",status:"new-lead",submitted:"2026-03-10",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"NASA Intern Program",lastContact:"2026-03-13",notes:"NASA summer intern rotating through Redstone. Has employer security clearance — skip BG check. Offer letter on file."},
  {id:"a4",name:"Derek Owens",email:"derek.o@email.com",phone:"(256) 555-9004",property:"Lee Drive East",room:"",moveIn:"2026-05-01",income:"$3,900",status:"new-lead",submitted:"2026-03-11",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"Drive-by / Sign",lastContact:"2026-03-12",notes:"Saw the sign on Lee Drive. Works at Boeing."},
  // ── Invited (sent application link, waiting for them to apply) ──
  {id:"a5",name:"Sam Patel",email:"sam.p@email.com",phone:"(256) 555-9005",property:"The Holmes House",room:"Bedroom 5",moveIn:"2026-06-01",income:"$6,200",status:"new-lead",submitted:"2026-03-08",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"NASA Intern Program",lastContact:"2026-03-11",screenPkg:"none",incomeAdd:"none",appFee:0,waiverReason:"Toyota intern — employer background check accepted. Offer letter on file.",inviteLink:"https://rentblackbear.com/apply?invite=a5",sentVia:"Email",notes:"Toyota intern, summer rotation",history:[{from:"pre-screened",to:"called",date:"2026-03-08"},{from:"called",to:"invited",date:"2026-03-11",note:"Invited via Email · No Screening (Waived) · Fee waived — Toyota intern — employer background check accepted."}]},
  {id:"a6",name:"Chris Walker",email:"chris.w@email.com",phone:"(256) 555-9006",property:"Lee Drive East",room:"Bedroom 3",moveIn:"2026-05-01",income:"$4,100",status:"new-lead",submitted:"2026-03-10",bgCheck:"not-started",creditScore:"—",refs:"not-started",source:"Facebook / Instagram",lastContact:"2026-03-12",screenPkg:"credit-bg",incomeAdd:"none",appFee:49,inviteLink:"https://rentblackbear.com/apply?invite=a6",sentVia:"Text",history:[{from:"pre-screened",to:"called",date:"2026-03-10"},{from:"called",to:"invited",date:"2026-03-12",note:"Invited via Text · Credit Report + Full Background Check · $49 fee"}]},
  // ── Applied (filled out application, payment submitted) ──
  {id:"a7",name:"Taylor Morgan",email:"taylor@email.com",phone:"(256) 555-9007",property:"The Holmes House",room:"Bedroom 4",moveIn:"2026-04-01",income:"$4,200",status:"applied",submitted:"2026-03-09",bgCheck:"pending",creditScore:"710",refs:"pending",source:"Google Search",lastContact:"2026-03-12",screenPkg:"credit-bg",incomeAdd:"income-only",appFee:59,notes:"Strong applicant. Income verification in progress.",history:[{from:"pre-screened",to:"called",date:"2026-03-09"},{from:"called",to:"invited",date:"2026-03-10"},{from:"invited",to:"applied",date:"2026-03-12",note:"Application submitted + $59 screening fee paid"}]},
  // ── Reviewing (BG check back, refs contacted, making decision) ──
  {id:"a8",name:"Marcus Johnson",email:"marcus.j@email.com",phone:"(256) 555-9008",property:"Lee Drive West",room:"Bedroom 2",moveIn:"2026-04-01",income:"$5,100",status:"applied",submitted:"2026-03-05",bgCheck:"passed",creditScore:"755",refs:"pending",source:"Military / Contractor Network",lastContact:"2026-03-13",screenPkg:"credit-bg",incomeAdd:"income-employment",appFee:64,notes:"Army contractor at Redstone. BG passed. Waiting on ref from previous landlord.",history:[{from:"pre-screened",to:"called",date:"2026-03-05"},{from:"called",to:"invited",date:"2026-03-06"},{from:"invited",to:"applied",date:"2026-03-08"},{from:"applied",to:"reviewing",date:"2026-03-10",note:"BG check passed. Credit 755. In review."}]},
  // ── Approved (approved, lease being generated) ──
  {id:"a9",name:"Alex Rivera",email:"alex.r@email.com",phone:"(256) 555-9009",property:"Lee Drive East",room:"Bedroom 3",moveIn:"2026-04-01",income:"$4,800",status:"approved",submitted:"2026-03-01",bgCheck:"passed",creditScore:"740",refs:"verified",source:"Zillow",lastContact:"2026-03-13",screenPkg:"credit-bg",incomeAdd:"none",appFee:49,notes:"Excellent applicant. All refs verified. Lease being prepared.",history:[{from:"pre-screened",to:"called",date:"2026-03-02"},{from:"called",to:"invited",date:"2026-03-03"},{from:"invited",to:"applied",date:"2026-03-05"},{from:"applied",to:"reviewing",date:"2026-03-06"},{from:"reviewing",to:"approved",date:"2026-03-13",note:"All checks clear. Approved. Preparing lease."}]},
  // ── Move-In (lease signed, SD paid, ready to move in) ──
  {id:"a10",name:"Jamie Chen",email:"jamie.c@email.com",phone:"(256) 555-9010",property:"The Holmes House",room:"Bedroom 2",moveIn:"2026-04-01",income:"$5,200",status:"onboarding",submitted:"2026-02-20",bgCheck:"passed",creditScore:"780",refs:"verified",source:"Friend / Referral",lastContact:"2026-03-13",screenPkg:"credit-bg",incomeAdd:"none",appFee:49,notes:"Lease signed 3/12. SD paid. Moving in April 1.",history:[{from:"pre-screened",to:"called",date:"2026-02-21"},{from:"called",to:"invited",date:"2026-02-22"},{from:"invited",to:"applied",date:"2026-02-24"},{from:"applied",to:"reviewing",date:"2026-02-26"},{from:"reviewing",to:"approved",date:"2026-03-05"},{from:"approved",to:"move-in",date:"2026-03-12",note:"Lease signed. SD received. Moving in 4/1."}]},
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
const DEF_SETTINGS={companyName:"Black Bear Rentals",legalName:"Oak & Main Development LLC",phone:"(850) 696-8101",email:"info@rentblackbear.com",pmEmail:"blackbearhousing@gmail.com",city:"Huntsville, Alabama",tagline:"Huntsville's Turnkey Co-Living",heroHeadline:"Your Room Is Ready.",heroSubline:"Everything's Included.",heroDesc:"Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities — all handled.",adminFee:10,reminderTemplate:"Hi {firstName}, this is a friendly reminder that your {category} of {amount} was due on {dueDate}. Please log in to your tenant portal to view your balance and pay: {portalLink}\n\nIf you have already sent payment, please disregard this message. Thank you! — Black Bear Rentals",notifAppReceived:true,notifLeaseSent:true,notifLeaseSigned:true,notifPaymentReceived:true,notifMaintenanceRequest:true,notifPrescreen:true,showPayBadge:true,showAppBadge:true,adminPresetId:"forest",adminAccent:"#4a7c59",adminAccentRgb:"74,124,89",adminFont:"'Plus Jakarta Sans',system-ui,sans-serif",adminZoom:1,m2mIncrease:50,m2mNoticeDays:30,autoReminders:true,
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
const ADMIN_PRESETS=[
  {id:"forest",name:"Forest Green",accent:"#4a7c59",accentRgb:"74,124,89",font:"'Plus Jakarta Sans',system-ui,sans-serif"},
  {id:"slate",name:"Slate Blue",accent:"#3b6ea5",accentRgb:"59,110,165",font:"'Plus Jakarta Sans',system-ui,sans-serif"},
  {id:"terracotta",name:"Terracotta",accent:"#b85c38",accentRgb:"184,92,56",font:"'Plus Jakarta Sans',system-ui,sans-serif"},
  {id:"teal",name:"Deep Teal",accent:"#2a7d7b",accentRgb:"42,125,123",font:"'Plus Jakarta Sans',system-ui,sans-serif"},
  {id:"charcoal",name:"Charcoal",accent:"#2c3e50",accentRgb:"44,62,80",font:"'Plus Jakarta Sans',system-ui,sans-serif"},
];
const ADMIN_FONTS=[
  {name:"Plus Jakarta Sans",stack:"'Plus Jakarta Sans',system-ui,sans-serif"},
  {name:"Inter",stack:"'Inter',system-ui,sans-serif"},
  {name:"DM Sans",stack:"'DM Sans',system-ui,sans-serif"},
  {name:"IBM Plex Sans",stack:"'IBM Plex Sans',monospace"},
  {name:"Georgia",stack:"Georgia,serif"},
];
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
        <div style={{fontSize:10,color:"#6b5e52"}}>Drag on photo to crop · Drag handles to resize · Drag inside box to move{aspectLock&&<span style={{marginLeft:8,background:"rgba(212,168,83,.12)",color:"#9a7422",fontWeight:700,padding:"1px 7px",borderRadius:4,fontSize:9}}>🔒 {aspectLock} locked — card preview ratio</span>}</div>
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
      {/* Add more tile */}
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
            <div style={{fontSize:9,color:"#6b5e52"}}>File: {editing.file}</div>
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
          <span style={{fontSize:8,color:"#6b5e52",fontWeight:600}}>Add</span>
        </div>
      </div>}

      {/* Empty state */}
      {scenes.length===0&&<div style={{border:"2px dashed rgba(0,0,0,.08)",borderRadius:8,padding:18,textAlign:"center",cursor:"pointer",marginBottom:6}}
        onClick={()=>{setShowFileBrowser(true);if(!tourFiles.length)loadBucketFiles();}}>
        <div style={{fontSize:22,marginBottom:4}}>🎥</div>
        <div style={{fontSize:11,color:"#6b5e52",fontWeight:600}}>No scenes yet — click to browse bucket files</div>
        <div style={{fontSize:9,color:"#7a7067",marginTop:2}}>Or add manually below</div>
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

      {/* Manual add */}
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

function PropEditor({prop,onSave,onClose,onDelete,isNew,onViewTenant,onRemoveTenant,settings,onUpdateSettings}){
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
      <div className="fld"><label>Property Photos</label><span style={{fontSize:10,color:"#6b5e52"}}>{(p.photos||[]).length} photo{(p.photos||[]).length!==1?"s":""}</span></div>
    </div>
    <PhotoManager photos={p.photos||[]} onChange={v=>{const newPhotos=typeof v==="function"?v(p.photos||[]):v;updP({...p,photos:newPhotos});}} label="Property Photos" propId={p.id} onFocalPoint={(x,y)=>updP({...p,focalPoint:{x,y}})}/>
    <div className="fld">
      <label>360 Tour Folder <span style={{fontWeight:400,color:"#6b5e52",fontSize:9,textTransform:"none",letterSpacing:0}}>— subfolder inside Supabase 360/ bucket</span></label>
      <input value={p.tourFolder||""} onChange={e=>updP({...p,tourFolder:e.target.value,tourScenes:[]})} placeholder="e.g. 908-lee-drive" style={{width:"100%"}}/>
      {p.tourFolder&&<div style={{fontSize:9,color:"#4a7c59",marginTop:3}}>property-photos/360/{p.tourFolder}/</div>}
    </div>

    {/* ── 3D Tour Scene Editor ── */}
    {p.tourFolder&&<TourSceneManager tourFolder={p.tourFolder} scenes={p.tourScenes||[]} onChange={v=>updP({...p,tourScenes:v})}/>}
    <div className="fr">
      <div className="fld" style={{flex:2}}><label>Internal Notes</label><textarea value={p.desc||""} onChange={e=>updP({...p,desc:e.target.value})} placeholder="Internal notes about this property..." rows={2}/></div>
      <div className="fld" style={{flex:1}}>
        <label>Turnover Buffer <span style={{fontWeight:400,color:"#6b5e52",fontSize:9,textTransform:"none",letterSpacing:0}}>— days between leases</span></label>
        <input type="number" min={0} max={60} value={p.turnoverDays||""} onChange={e=>updP({...p,turnoverDays:Number(e.target.value)||0})} placeholder="e.g. 7"/>
        {(p.turnoverDays||0)>0&&<div style={{fontSize:9,color:"#4a7c59",marginTop:3}}>{p.turnoverDays} days blocked after each lease ends</div>}
      </div>
    </div>

    {/* ── Section 2: Rental Configuration ── */}
    <div style={{borderTop:"2px solid rgba(0,0,0,.06)",marginTop:14,paddingTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:800,color:"#5c4a3a",letterSpacing:.3}}>
          RENTAL CONFIGURATION
          {(p.units||[]).length>1&&<span style={{fontWeight:400,color:"#6b5e52",marginLeft:6,fontSize:10}}>— select unit to configure</span>}
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

        {/* Unit basics */}
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
            <button type="button" onClick={()=>setShowUtilModal(true)} style={{fontSize:9,color:"#3b82f6",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:0,fontWeight:600}}>✏ Edit Templates</button>
          </div>
          <select value={curUnit.utils||"allIncluded"} onChange={e=>updUnit("utils",e.target.value)}>
            {(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).map(t=><option key={t.id} value={t.key}>{t.name}</option>)}
          </select>
          {(()=>{const t=(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===(curUnit.utils||"allIncluded"));return t?<div style={{fontSize:9,color:"#6b5e52",marginTop:3}}>{t.desc}</div>:null;})()}
        </div>

        {/* Whole unit pricing */}
        {mode==="wholeHouse"&&<div className="fr">
          <div className="fld"><label>Monthly Rent</label><input type="number" value={curUnit.rent||""} onChange={e=>updUnit("rent",Number(e.target.value))} placeholder="3200"/></div>
          <div className="fld"><label>Security Deposit</label><input type="number" value={curUnit.sd||curUnit.rent||""} onChange={e=>updUnit("sd",Number(e.target.value))} placeholder="Defaults to 1 month rent"/></div>
        </div>}

        <div className="fld" style={{marginBottom:4}}><label>Unit Notes <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",fontSize:9}}>— internal only</span></label><textarea value={curUnit.desc||""} onChange={e=>updUnit("desc",e.target.value)} placeholder="Finishes, features, notes for this unit..." rows={2}/></div>
      </div>}

      {/* ── Section 3: Rooms (only for byRoom mode) ── */}
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
              <div className="fld"><label>Status</label><div style={{padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:12,background:r.ownerOccupied?"rgba(59,130,246,.06)":locked?"rgba(74,124,89,.06)":"rgba(196,92,74,.06)",color:r.ownerOccupied?"#1d4ed8":locked?"#4a7c59":"#c45c4a",fontWeight:600}}>{r.ownerOccupied?"Owner Occupied":locked?("Occupied — "+(r.tenant.name)):"Vacant"}</div></div>
              <div className="fld"><label>Lease End</label><div style={{padding:"8px 12px",borderRadius:7,border:"1px solid rgba(0,0,0,.08)",fontSize:12,color:"#6b5e52"}}>{r.le?fmtD(r.le):"—"}</div></div>
              <div className="fld"><label>Furnished</label><select value={String(r.furnished!==false)} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"furnished",e.target.value==="true")}><option value="true">✓ Furnished</option><option value="false">Unfurnished</option></select></div>
            </div>
            <div style={{marginBottom:8}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none",fontSize:11,fontWeight:600,color:r.ownerOccupied?"#1d4ed8":"#5c4a3a",padding:"7px 10px",borderRadius:7,border:"1px solid "+(r.ownerOccupied?"rgba(59,130,246,.3)":"rgba(0,0,0,.06)"),background:r.ownerOccupied?"rgba(59,130,246,.04)":"transparent"}}>
                <input type="checkbox" checked={!!r.ownerOccupied} onChange={e=>updRoom(i,"ownerOccupied",e.target.checked)} style={{accentColor:"#3b82f6",width:14,height:14}}/>
                Owner Occupied - exclude from rent, financials, and public listings
              </label>
            </div>
            <div className="fr" style={{alignItems:"flex-end",gap:8}}>
              <div className="fld" style={{flex:1}}>
                <label>Utilities <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",letterSpacing:0,fontSize:9}}>— overrides unit default for this room</span></label>
                <select value={r.utils||curUnit?.utils||"allIncluded"} disabled={locked} style={{background:locked?"#e8e7e4":undefined,cursor:locked?"not-allowed":undefined}} onChange={e=>updRoom(i,"utils",e.target.value)}>
                  <option value="">— Use unit default —</option>
                  {(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).map(t=><option key={t.id} value={t.key}>{t.name}</option>)}
                </select>
                {(r.utils&&r.utils!=="")&&<div style={{fontSize:9,color:"#5c4a3a",marginTop:3}}>{(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===r.utils)?.desc||""}</div>}
                {(!r.utils||r.utils==="")&&curUnit?.utils&&<div style={{fontSize:9,color:"#6b5e52",marginTop:3}}>Using unit default: {(settings?.utilTemplates||DEF_SETTINGS.utilTemplates).find(t=>t.key===curUnit.utils)?.name||curUnit.utils}</div>}
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
                    <input type="checkbox" checked={checked} style={{accentColor:"#d4a853",width:11,height:11}} onChange={()=>{const cur=r.feat||[];const next=checked?cur.filter(f=>f!==feat):[...cur,feat];updRoom(i,"feat",next);}}/>
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
                // Save current PropEditor state to global props first so tenant modal can find the room
                onSave(p);
                setTimeout(()=>{if(onViewTenant)onViewTenant(r,p.name);},150);
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
                <div style={{fontSize:12,fontWeight:700,color:anyOcc?"#4a7c59":"#c45c4a"}}>{anyOcc?"Occupied":"Vacant"}</div>
                {anyOcc&&occupant&&<div style={{fontSize:10,color:"#5c4a3a",marginTop:2}}>{occupant.name}{latestLe?<span style={{color:"#6b5e52",marginLeft:6}}>· lease ends {fmtD(latestLe)}</span>:null}</div>}
                {!anyOcc&&<div style={{fontSize:10,color:"#6b5e52",marginTop:2}}>No active tenant — ready to lease</div>}
              </div>
              {anyOcc
                ?<button className="btn btn-gold btn-sm" style={{fontSize:10}} onClick={()=>{
                    onSave(p);
                    setTimeout(()=>{if(onViewTenant&&occupant){onViewTenant(rooms.find(r=>r.tenant),p.name);}},150);
                  }}>Manage Lease / Terminate</button>
                :(curUnit.ownerOccupied?null:<button className="btn btn-green btn-sm" style={{fontSize:10}} onClick={()=>setAddTenantRoom({unitIdx:activeUnit,isWholeUnit:true})}>+ Add Existing Tenant</button>)}
            </div>
            {rooms.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
              {rooms.map(r=><div key={r.id} style={{padding:"4px 9px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:9,background:"#faf9f7",color:r.ownerOccupied?"#1d4ed8":r.st==="occupied"?"#4a7c59":"#999"}}>
                {r.name} — {r.ownerOccupied?"Owner Occupied":r.st==="occupied"?r.tenant?.name||"Occupied":"Vacant"}
              </div>)}
            </div>}
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none",fontSize:11,fontWeight:600,color:curUnit.ownerOccupied?"#1d4ed8":"#5c4a3a",padding:"7px 10px",marginTop:8,borderRadius:7,border:"1px solid "+(curUnit.ownerOccupied?"rgba(59,130,246,.3)":"rgba(0,0,0,.06)"),background:curUnit.ownerOccupied?"rgba(59,130,246,.04)":"transparent"}}>
              <input type="checkbox" checked={!!curUnit.ownerOccupied} onChange={e=>updUnit("ownerOccupied",e.target.checked)} style={{accentColor:"#3b82f6",width:14,height:14}}/>
              Owner Occupied - exclude from rent, financials, and public listings
            </label>
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
      <p style={{fontSize:11,color:"#6b5e52",marginBottom:20,lineHeight:1.5}}>
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
      <button style={{marginTop:14,background:"none",border:"none",fontSize:12,color:"#6b5e52",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowCloseConfirm(false)}>Keep editing</button>
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
@keyframes spin{to{transform:rotate(360deg)}}@keyframes wiggle{0%,100%{transform:rotate(0deg) translate(0,0)}20%{transform:rotate(-1.5deg) translate(-0.5px,0.5px)}40%{transform:rotate(1deg) translate(0.5px,-0.5px)}60%{transform:rotate(-0.5deg) translate(-0.5px,0)}80%{transform:rotate(1.5deg) translate(0.5px,0.5px)}}
@keyframes wiggle2{0%,100%{transform:rotate(0deg) translate(0,0)}15%{transform:rotate(1deg) translate(0.5px,0.5px)}35%{transform:rotate(-1.5deg) translate(-0.5px,-0.5px)}55%{transform:rotate(0.5deg) translate(0.5px,0)}75%{transform:rotate(-1deg) translate(-0.5px,0.5px)}90%{transform:rotate(1.5deg) translate(0,0.5px)}}
@keyframes wiggle3{0%,100%{transform:rotate(0deg) translate(0,0)}10%{transform:rotate(1.5deg) translate(0.5px,-0.5px)}30%{transform:rotate(-1deg) translate(-0.5px,0.5px)}50%{transform:rotate(0.5deg) translate(0,0.5px)}70%{transform:rotate(-1.5deg) translate(0.5px,-0.5px)}85%{transform:rotate(1deg) translate(-0.5px,0)}}@keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-4px)}30%{transform:translateX(4px)}45%{transform:translateX(-3px)}60%{transform:translateX(3px)}75%{transform:translateX(-1px)}90%{transform:translateX(1px)}}
@keyframes redFlash{0%{box-shadow:none}40%{box-shadow:inset 0 0 0 2px rgba(196,92,74,.2)}100%{box-shadow:none}}
@keyframes fieldShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-3px)}40%{transform:translateX(3px)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}}
.field-err input,.field-err select,.field-err textarea{border-color:#c45c4a!important;background:rgba(196,92,74,.03)!important;animation:fieldShake .35s ease}
.field-err-label{color:#c45c4a!important}
.err-msg{font-size:10px;color:#c45c4a;margin-top:3px;font-weight:600}
.acct-row:hover{background:rgba(212,168,83,.06)!important}
.sort-hdr{cursor:pointer;user-select:none;transition:color .15s}.sort-hdr:hover{color:#3c3228!important}
.ms-drop{position:relative;display:inline-block}
.ms-btn{padding:4px 8px;border-radius:5px;border:1px solid rgba(0,0,0,.08);fontSize:11px;font-family:inherit;cursor:pointer;background:#fff;display:flex;align-items:center;gap:4px;white-space:nowrap;font-size:11px;color:#3c3228}
.ms-btn.has-sel{border-color:#d4a853;background:rgba(212,168,83,.06)}
.ms-panel{position:absolute;top:100%;left:0;margin-top:4px;background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);z-index:50;min-width:200px;max-height:280px;overflow-y:auto;padding:6px 0}
.ms-item{display:flex;align-items:center;gap:8px;padding:6px 12px;cursor:pointer;font-size:11px;color:#3c3228;transition:background .1s}
.ms-item:hover{background:rgba(212,168,83,.04)}
.ms-item input[type=checkbox]{width:14px;height:14px;accent-color:#3c3228;margin:0;flex-shrink:0}
.dot-menu{position:relative;display:inline-block}
.dot-btn{background:none;border:none;cursor:pointer;padding:4px;font-size:16px;color:#999;line-height:1;font-family:inherit}
.dot-btn:hover{color:#3c3228}
.dot-panel{position:absolute;right:0;top:100%;background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);z-index:50;min-width:120px;padding:4px 0;overflow:hidden}
.dot-opt{display:flex;align-items:center;gap:6px;padding:8px 14px;cursor:pointer;font-size:11px;color:#3c3228;border:none;background:none;width:100%;font-family:inherit;text-align:left}
.dot-opt:hover{background:rgba(0,0,0,.03)}
.dot-opt.danger{color:#c45c4a}
.dot-opt.danger:hover{background:rgba(196,92,74,.04)}
.qf-btn{font-size:10px;padding:4px 10px;border-radius:5px;border:1px solid rgba(0,0,0,.08);background:#fff;cursor:pointer;font-family:inherit;transition:all .15s;color:#5c4a3a}
.qf-btn:hover{border-color:rgba(0,0,0,.15)}
.qf-btn.active{background:#3c3228;color:#fff;border-color:#3c3228}
.gear-btn{background:none;border:none;cursor:pointer;font-size:14px;color:#999;padding:2px}
.gear-btn:hover{color:#3c3228}
.gear-panel{position:absolute;right:0;top:100%;background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);z-index:50;min-width:180px;padding:8px 0}
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
.pipe-card:hover{border-color:#4a7c59!important;box-shadow:0 4px 16px rgba(0,0,0,.12);background:#f7faf8;transform:translateY(-1px)}
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
  const[charges,setCharges]=useState([]);
  const[credits,setCredits]=useState(DEF_CREDITS);
  const[sdLedger,setSdLedger]=useState(DEF_SD_LEDGER);
  const[paySubTab,setPaySubTab]=useState("overview");
  const[acctSubTab,setAcctSubTab]=useState("overview");
  const[acctSort,setAcctSort]=useState({col:"date",dir:"desc"});
  const[acctDrop,setAcctDrop]=useState(null);
  const[acctHideCols,setAcctHideCols]=useState({});
  const[acctDotMenu,setAcctDotMenu]=useState(null);
  const[acctFilters,setAcctFilters]=useState({from:TODAY.getFullYear()+"-01-01",to:TODAY.toISOString().split("T")[0],propIds:[],tenants:[],categories:[],vendors:[]});
  const[reportPeriod,setReportPeriod]=useState({from:"",to:""});
  const[reportProp,setReportProp]=useState("all");
  const[activeReport,setActiveReport]=useState(null);
  const[expenses,setExpenses]=useState([]);
  const[mortgages,setMortgages]=useState([]);
  const[vendors,setVendors]=useState([]);
  const[improvements,setImprovements]=useState([]);
  const[subcats,setSubcats]=useState(STARTER_SUBCATS_BY_CAT);
  const[acctOverviewMode,setAcctOverviewMode]=useState("property"); // "property" | "unit"
  const[payPeriod,setPayPeriod]=useState("mtd");
  const[payFilters,setPayFilters]=useState({property:"",tenant:"",category:"",status:"",dateFrom:"",dateTo:""});
  const[depFilters,setDepFilters]=useState({property:"",tenant:"",lease:"",dateFrom:"",dateTo:"",view:""});
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
  const[maint,setMaint]=useState([]);
  const[apps,setApps]=useState([]);
  const[docs,setDocs]=useState([]);
  const[txns,setTxns]=useState([]);
  const[notifs,setNotifs]=useState([]);
  const[archive,setArchive]=useState([]);
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
  const[portalInviteState,setPortalInviteState]=useState("idle");
  const[portalLinkToken,setPortalLinkToken]=useState(null);
  const[portalLinkLoading,setPortalLinkLoading]=useState(false);
  const[piState,setPiState]=useState("idle");
  const[obStatuses,setObStatuses]=useState({}); // {email: {leaseSigned,sdPaid,firstMonthPaid}}
  const[appKpiFilter,setAppKpiFilter]=useState(null); // null | "needsAction" | "stale" | "denied"
  const[tenantSel,setTenantSel]=useState([]);
  const[tenantSearch,setTenantSearch]=useState("");
  const[tenantPropFilter,setTenantPropFilter]=useState("all");
  const[widgetList,setWidgetList]=useState(null);
  const[dashEditMode,setDashEditMode]=useState(false);
  const[dashDragWidget,setDashDragWidget]=useState(null);
  const[dashDragOver,setDashDragOver]=useState(null);
  const[ledgerTenant,setLedgerTenant]=useState("all");
  const[portalTenant,setPortalTenant]=useState(null);
  const[portalTab,setPortalTab]=useState("home");
  const[tenantProfileTab,setTenantProfileTab]=useState("summary");
  const[sidebarEditMode,setSidebarEditMode]=useState(false);
  const[sidebarDrag,setSidebarDrag]=useState(null); // {secIdx,itemIdx}
  const[sidebarDragOver,setSidebarDragOver]=useState(null);
  const[maintForm,setMaintForm]=useState({title:"",desc:"",priority:"medium",submitted:false});
  const[leases,setLeases]=useState([]);
  const[leaseTemplate,setLeaseTemplate]=useState(null);
  const[leaseSubTab,setLeaseSubTab]=useState("active");
  const[leaseForm,setLeaseForm]=useState(null);
  const[viewingLease,setViewingLease]=useState(null); // {lease, room}
  const[leaseSigErr,setLeaseSigErr]=useState(false);

  useEffect(()=>{(async()=>{
    const[p,pay,mt,a,d,t,n,rk,iss,sc,st,th,id,ar,ch,cr,sd,svt,mo,sq,af,ls,lt,ex,mg,vn,im,sbc,dfu]=await Promise.all([load("hq-props",DEF_PROPS),load("hq-pay",DEF_PAYMENTS),load("hq-maint",[]),load("hq-apps",[]),load("hq-docs",[]),load("hq-txns",[]),load("hq-notifs",[]),load("hq-rocks",DEF_ROCKS),load("hq-issues",DEF_ISSUES),load("hq-sc",DEF_SC_HISTORY),load("hq-settings",DEF_SETTINGS),load("hq-theme",DEF_THEME),load("hq-ideas",[]),load("hq-archive",[]),load("hq-charges",[]),load("hq-credits",[]),load("hq-sdledger",[]),load("hq-svthemes",[]),load("hq-monthly",DEF_MONTHLY),load("hq-screen-qs",[]),load("hq-app-fields",[]),load("hq-leases",[]),load("hq-lease-template",null),load("hq-expenses",[]),load("hq-mortgages",[]),load("hq-vendors",[]),load("hq-improvements",[]),load("hq-subcats",STARTER_SUBCATS_BY_CAT),load("hq-dismissed-followups",[])]);
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
    setProps(propsWithCoords);setPayments(pay);setMaint(mt);setApps(a);setDocs(d);setTxns(t);setNotifs(n);setRocks(rk);setIssues(iss);setScorecard(sc);setSettings(st);setTheme(th);setIdeas(id);setArchive(ar);setCharges(ch);setCredits(cr);setSdLedger(sd);setSavedThemes(svt);setMonthly(mo);setScreenQs(sq);setAppFields(af);setLeases(ls);setLeaseTemplate(lt);setExpenses(ex);setMortgages(mg);setVendors(vn);setImprovements(im);setSubcats(Array.isArray(sbc)?STARTER_SUBCATS_BY_CAT:sbc);setDismissedFollowUps(Array.isArray(dfu)?dfu:[]);setWidgetList(null);setLoaded(true);
  })();},[]);

  useEffect(()=>{if(loaded){const t=setTimeout(()=>{Promise.all([save("hq-props",props),save("hq-pay",payments),save("hq-maint",maint),save("hq-apps",apps),save("hq-docs",docs),save("hq-txns",txns),save("hq-notifs",notifs),save("hq-rocks",rocks),save("hq-issues",issues),save("hq-sc",scorecard),save("hq-settings",settings),save("hq-theme",theme),save("hq-ideas",ideas),save("hq-archive",archive),save("hq-charges",charges),save("hq-credits",credits),save("hq-sdledger",sdLedger),save("hq-svthemes",savedThemes),save("hq-monthly",monthly),save("hq-screen-qs",screenQs),save("hq-app-fields",appFields),save("hq-leases",leases),save("hq-lease-template",leaseTemplate),save("hq-expenses",expenses),save("hq-mortgages",mortgages),save("hq-vendors",vendors),save("hq-improvements",improvements),save("hq-subcats",subcats)]);},800);return()=>clearTimeout(t);}},[props,payments,maint,apps,docs,txns,notifs,rocks,issues,scorecard,settings,theme,ideas,archive,charges,credits,sdLedger,savedThemes,monthly,screenQs,appFields,leases,leaseTemplate,expenses,mortgages,vendors,improvements,subcats,loaded]);

  // ─── Metrics ──────────────────────────────────────────────────
  // ── Load onboarding statuses for approved/onboarding applicants ──────
  useEffect(()=>{
    if(!loaded)return;
    const approvedApps=apps.filter(a=>["approved","onboarding"].includes(a.status)&&a.email);
    if(!approvedApps.length)return;
    const SUPA_URL=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPA_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const headers={"apikey":SUPA_KEY,"Authorization":`Bearer ${SUPA_KEY}`};
    const loadStatuses=async()=>{
      try{
        const pms=await fetch(`${SUPA_URL}/rest/v1/pm_accounts?select=id&limit=1`,{headers}).then(r=>r.json());
        const pmId=pms?.[0]?.id;if(!pmId)return;
        const emails=approvedApps.map(a=>encodeURIComponent(a.email)).join(",");
        const tenants=await fetch(`${SUPA_URL}/rest/v1/tenants?email=in.(${emails})&pm_id=eq.${pmId}&select=id,email,lease_signed_at`,{headers}).then(r=>r.json());
        if(!tenants?.length)return;
        const tenantIds=tenants.map(t=>t.id).join(",");
        const chgs=await fetch(`${SUPA_URL}/rest/v1/charges?tenant_id=in.(${tenantIds})&select=tenant_id,category,amount,amount_paid`,{headers}).then(r=>r.json());
        const map={};
        tenants.forEach(t=>{
          const tc=(chgs||[]).filter(c=>c.tenant_id===t.id);
          const sd=tc.find(c=>c.category==="Security Deposit");
          const rent=tc.find(c=>c.category==="Rent");
          map[t.email]={
            leaseSigned:!!t.lease_signed_at,
            sdPaid:!!(sd&&sd.amount_paid>=sd.amount),
            firstMonthPaid:!!(rent&&rent.amount_paid>=rent.amount),
          };
        });
        setObStatuses(map);
      }catch(e){console.error("onboarding status load:",e);}
    };
    loadStatuses();
    // Poll every 30 seconds for real-time-ish updates
    const interval=setInterval(loadStatuses,30000);
    return()=>clearInterval(interval);
  },[loaded,apps]);

  const m=useMemo(()=>{
    let total=0,occ=0,full=0,proj=0,coll=0,due=0;const vacs=[];const expiring=[];const unpaid=[];const paid=[];
    props.forEach(pr=>(pr.units||[]).forEach(u=>{
      const uOwner=u.ownerOccupied;
      allRooms({units:[u]}).forEach(r=>{
        if(r.ownerOccupied||uOwner)return; // skip owner-occupied
        total++;full+=r.rent;
        if(r.st==="occupied"){occ++;proj+=r.rent;due+=r.rent;
          const pd=(payments[r.id]&&payments[r.id][MO])||0;coll+=pd;
          if(pd)paid.push({...r,propName:pr.name,paidAmt:pd});else unpaid.push({...r,propName:pr.name});
          if(r.le){const dl=Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24));if(dl<=90)expiring.push({...r,propName:pr.name,daysLeft:dl});}
        }else vacs.push({...r,propName:pr.name});
      });
    }));
    const openMaint=maint.filter(x=>x.status!=="resolved").length;
    const activeApps=apps.length;
    const unreadNotifs=notifs.filter(x=>!x.read).length;
    const propBreakdown=props.map(pr=>{const rooms=allRooms(pr);const occR=rooms.filter(r=>r.st==="occupied");const vacR=rooms.filter(r=>r.st!=="occupied");
      const prjR=occR.reduce((s,r)=>s+r.rent,0);const fullR=rooms.reduce((s,r)=>s+r.rent,0);
      const collR=occR.reduce((s,r)=>s+((payments[r.id]&&payments[r.id][MO])||0),0);
      return{...pr,occCount:occR.length,vacCount:vacR.length,projected:prjR,fullOcc:fullR,collected:collR,occRooms:occR,vacRooms:vacR};
    });
    const needsAttention=apps.filter(a=>["new-lead","applied"].includes(a.status)).length;return{total,occ,full,proj,coll,due,vacs,expiring,unpaid,paid,openMaint,activeApps,unreadNotifs,needsAttention,propBreakdown,
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
  const chargeStatus=(c)=>{if(c.voided)return"voided";if(c.waived)return"waived";if(c.amountPaid>=c.amount)return"paid";if(c.amountPaid>0)return"partial";const due=new Date(c.dueDate+"T00:00:00");if(TODAY>due)return"pastdue";return"unpaid";};
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
        const u=(pr.units||[]).find(u=>(u.rooms||[]).some(x=>x.id===r.id));
        if(r.ownerOccupied||u?.ownerOccupied)return; // skip owner-occupied
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
    // Seed ALL existing app IDs on load — so we never fire confetti for pre-existing apps
    apps.forEach(a=>knownAppliedIds.current.add(a.id));
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
        const newPrescreened=fresh.filter(a=>a.status==="new-lead"&&!knownIds.has(a.id));
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
          // Notification for pre-screens — confetti + toast same as full apps
          if(newPrescreened.length>0){
            const newest=newPrescreened[0];
            setNotifs(p=>[{id:uid(),type:"app",msg:`New pre-screen from ${newest.name}${newest.property?" · "+newest.property:""}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:true},...p]);
            setShowConfetti(true);setLeadToast(newest);setToastDismissing(false);
            setTimeout(()=>setShowConfetti(false),8000);
            setTimeout(()=>{setToastDismissing(true);setTimeout(()=>setLeadToast(null),300);},15000);
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

  const GRACE=3;
  const pastDueCount=charges.filter(c=>{if(c.waived||c.voided||c.amountPaid>=c.amount)return false;const due=new Date(c.dueDate+"T00:00:00");const days=Math.ceil((TODAY-due)/86400000);return days>GRACE;}).length;
  const pendingLeases=leases.filter(l=>l.status==="pending_tenant"||l.status==="pending_landlord").length;
  const tabs=[
    {id:"dashboard",i:<IconDashboard/>,l:"Dashboard"},
    {id:"scorecard",i:<IconTrending/>,l:"Scorecard"},
    {id:"rocks",i:<IconTarget/>,l:"Rocks"},
    {id:"issues",i:<IconAlert/>,l:"Issues"},
    {id:"tenants",i:<IconUsers/>,l:"Tenants"},
    {id:"portal",i:<IconHome/>,l:"Tenant Portal"},
    {id:"payments",i:<IconDollar/>,l:"Tenant Ledger",badge:settings.showPayBadge!==false&&pastDueCount>0?pastDueCount:null},
    {id:"applications",i:<IconClipboard/>,l:"Applications",badge:(settings.showAppBadge!==false&&m.needsAttention>0)?m.needsAttention:null},
    {id:"maintenance",i:<IconWrench/>,l:"Maintenance",badge:m.openMaint||null},
    {id:"leases",i:<IconFile/>,l:"Leases & Docs",badge:pendingLeases||null},
    {id:"documents",i:<IconFolder/>,l:"Documents"},
    {id:"accounting",i:<IconBook/>,l:"Accounting"},
    {id:"reports",i:<IconTrending/>,l:"Reports"},
    {id:"properties",i:<IconHome/>,l:"Properties"},
    {id:"site-settings",i:<IconGlobe/>,l:"Site Settings"},
    {id:"theme",i:<IconPalette/>,l:"Theme Editor"},
    {id:"ideas",i:<IconBrain/>,l:"Brain Dump"},
    {id:"notifications",i:<IconBell/>,l:"Alerts",badge:m.unreadNotifs||null},
    {id:"settings_dummy",i:<IconSettings/>,l:"Settings"},
    {id:"configuration",i:<IconClipboard/>,l:"Configuration"},
    {id:"add-expense",i:<span>＋</span>,l:"Add Expense"},
  ];

  // Default sidebar config — can be customized per PM
  const DEF_SIDEBAR=[
    {label:"Overview",ids:["dashboard"]},
    {label:"Traction",ids:["scorecard","rocks","issues"]},
    {label:"Tenants",ids:["tenants","portal","payments"]},
    {label:"Leasing",ids:["applications"]},
    {label:"Operations",ids:["maintenance","leases","documents"]},
    {label:"Financials",ids:["accounting","add-expense","reports"]},
    {label:"Portfolio",ids:["properties"]},
    {label:"System",ids:["site-settings","theme","ideas","notifications","settings_dummy"]},
    {label:"Configuration",ids:["configuration"]},
  ];
  const rawSidebarConfig=settings.sidebarConfig||DEF_SIDEBAR;
  const sidebarConfig=(()=>{
    const allIds=rawSidebarConfig.flatMap(s=>s.ids);
    if(allIds.includes("add-expense"))return rawSidebarConfig;
    // Migrate: inject add-expense between accounting and reports
    return rawSidebarConfig.map(s=>{
      if(!s.ids.includes("accounting"))return s;
      const ids=[...s.ids];
      const ai=ids.indexOf("accounting");
      if(!ids.includes("add-expense"))ids.splice(ai+1,0,"add-expense");
      return{...s,ids};
    });
  })();
  const setSidebarConfig=(cfg)=>{const u={...settings,sidebarConfig:cfg};setSettings(u);save("hq-settings",u);};

  const getPropAddr=(propName)=>{const p=props.find(x=>x.name===propName);return p?.addr||"";};
  const roomSubLine=(propName,roomName)=>{const a=getPropAddr(propName);return a?`${propName} · ${a} · ${roomName}`:`${propName} · ${roomName}`;};
  const goTab=(t)=>{setTab(t);setDrill(null);setSideOpen(false);setViewingLease(null);if(modal?.type==="tenant")setModal(null);};
  const confirmAction=(title,onConfirm,body="This cannot be undone.")=>{setModal({type:"confirmAction",title,body,confirmLabel:"Confirm",confirmStyle:"btn-red",onConfirm:()=>{onConfirm();setModal(null);}});};
  const shakeModal=()=>{const mb=document.querySelector(".mbox");if(mb){mb.style.animation="none";mb.offsetHeight;mb.style.animation="shake .4s ease, redFlash .5s ease";}};

  if(!loaded)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"inherit"}}>Loading...</div>);

  // ── Supabase realtime: watch charges + tenants for onboarding pill updates ──

  // All tenants flat list
  const allTenants=props.flatMap(p=>(p.units||[]).flatMap(u=>{
    if(u.ownerOccupied)return[];
    const isWhole=(u.rentalMode||"byRoom")==="wholeHouse";
    if(isWhole){
      const occupiedRoom=(u.rooms||[]).find(r=>r.tenant&&!r.ownerOccupied);
      if(!occupiedRoom)return[];
      return[{...occupiedRoom,name:u.name||(p.name+" Unit"),propName:p.name,propId:p.id,unitId:u.id,unitName:u.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,isWholeUnit:true}];
    }
    return(u.rooms||[]).filter(r=>r.tenant&&!r.ownerOccupied).map(r=>({...r,propName:p.name,propId:p.id,unitId:u.id,unitName:u.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,isWholeUnit:false}));
  }));
  const occLeases=props.flatMap(pr=>(pr.units||[]).flatMap(u=>{
    if(u.ownerOccupied)return[];
    const isWhole=(u.rentalMode||"byRoom")==="wholeHouse";
    if(isWhole){
      const rep=(u.rooms||[]).find(r=>r.st==="occupied"&&r.tenant&&!r.ownerOccupied);
      if(!rep)return[];
      return[{...rep,name:u.name||(pr.name+" Unit"),propName:pr.name,propId:pr.id,unitId:u.id,isWholeUnit:true}];
    }
    return(u.rooms||[]).filter(r=>r.st==="occupied"&&r.tenant&&!r.ownerOccupied).map(r=>({...r,propName:pr.name,propId:pr.id,unitId:u.id,isWholeUnit:false}));
  }));

  const adminDynCSS=(acc,rgb)=>`.btn-gold{background:${acc}!important;color:#fff!important}.btn-green{background:${acc}!important}.sn.on{background:rgba(${rgb},.22)!important}.sn-badge{background:${acc}!important}.badge.b-green{background:rgba(${rgb},.12)!important;color:${acc}!important}.tab.on{background:${acc}!important;color:#fff!important;border-color:${acc}!important}.acct-sub.on{background:${acc}!important;color:#fff!important}`;
  const _acc=settings.adminAccent||"#4a7c59";const _rgb=settings.adminAccentRgb||"74,124,89";const _font=settings.adminFont||"'Plus Jakarta Sans',system-ui,sans-serif";const _zoom=settings.adminZoom||1;
  return(<div style={{fontFamily:_font}}><style>{S}</style><style>{adminDynCSS(_acc,_rgb)}</style><div className="app" style={{zoom:_zoom}}>
    {/* Mobile header */}
    <div className="mob-header"><div style={{display:"flex",alignItems:"center",gap:8}}><div className="s-logo" style={{fontSize:16}}>🐻 BB <span>HQ</span></div><span style={{fontSize:11,color:"#c4a882"}}>· {(tabs.find(t=>t.id===tab)||{}).l}</span></div><button className="mob-toggle" onClick={()=>setSideOpen(!sideOpen)}>{sideOpen?"✕":"☰"}</button></div>
    <div className={`mob-overlay ${sideOpen?"show":""}`} onClick={()=>setSideOpen(false)}/>

    {/* Sidebar */}
    <div className={`side ${sideOpen?"open":""}`}>
      <div className="s-logo">🐻 Black Bear <span>HQ</span></div>

      {/* Data-driven sections */}
      {sidebarConfig.map((sec,si)=>(
        <div key={si}>
          {/* Section label */}
          {sidebarEditMode
            ?<input value={sec.label} onChange={e=>{const c=sidebarConfig.map((s,i)=>i===si?{...s,label:e.target.value}:s);setSidebarConfig(c);}}
              style={{background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,.2)",color:"rgba(212,168,83,.8)",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1,width:"calc(100% - 20px)",margin:"8px 10px 4px",padding:"2px 0",fontFamily:"inherit",outline:"none"}}/>
            :<div className="s-lbl">{sec.label}</div>}

          {/* Items */}
          {sec.ids.map((id,ii)=>{
            const t=tabs.find(x=>x.id===id);
            if(!t)return null;
            const isDragging=sidebarDrag&&sidebarDrag.si===si&&sidebarDrag.ii===ii;
            const isDragOver=sidebarDragOver&&sidebarDragOver.si===si&&sidebarDragOver.ii===ii;
            if(sidebarEditMode){
              return(
              <div key={id}
                draggable
                onDragStart={()=>setSidebarDrag({si,ii})}
                onDragOver={e=>{e.preventDefault();setSidebarDragOver({si,ii});}}
                onDragLeave={()=>setSidebarDragOver(null)}
                onDrop={e=>{
                  e.preventDefault();
                  if(!sidebarDrag)return;
                  const cfg=sidebarConfig.map(s=>({...s,ids:[...s.ids]}));
                  // Remove from source
                  const srcId=cfg[sidebarDrag.si].ids.splice(sidebarDrag.ii,1)[0];
                  // Insert at target
                  cfg[si].ids.splice(ii,0,srcId);
                  setSidebarConfig(cfg);
                  setSidebarDrag(null);setSidebarDragOver(null);
                }}
                style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",margin:"1px 4px",borderRadius:6,cursor:"grab",background:isDragOver?"rgba(212,168,83,.15)":isDragging?"rgba(0,0,0,.3)":"rgba(255,255,255,.04)",border:isDragOver?"1px solid rgba(212,168,83,.3)":"1px solid transparent",transition:"all .1s",opacity:isDragging?0.4:1}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" style={{flexShrink:0}}><circle cx="9" cy="5" r="1.5" fill="rgba(255,255,255,.4)"/><circle cx="15" cy="5" r="1.5" fill="rgba(255,255,255,.4)"/><circle cx="9" cy="12" r="1.5" fill="rgba(255,255,255,.4)"/><circle cx="15" cy="12" r="1.5" fill="rgba(255,255,255,.4)"/><circle cx="9" cy="19" r="1.5" fill="rgba(255,255,255,.4)"/><circle cx="15" cy="19" r="1.5" fill="rgba(255,255,255,.4)"/></svg>
                <span style={{fontSize:9,color:"rgba(255,255,255,.5)",flexShrink:0}}>{t.i}</span>
                <input value={t.l} onChange={e=>{
                    // Store custom label overrides in settings
                    const u={...settings,sidebarLabels:{...(settings.sidebarLabels||{}),[t.id]:e.target.value}};
                    setSettings(u);save("hq-settings",u);
                  }}
                  onClick={e=>e.stopPropagation()}
                  style={{background:"transparent",border:"none",color:"rgba(255,255,255,.8)",fontSize:11,fontFamily:"inherit",outline:"none",flex:1,minWidth:0}}/>
              </div>);
            }
            // Normal mode
            const label=(settings.sidebarLabels||{})[t.id]||t.l;
            if(t.id==="add-expense"){return(
            <button key={id} className="sn" onClick={()=>{goTab("accounting");setAcctSubTab("expenses");setTimeout(()=>setModal({type:"addExpense",form:{date:TODAY.toISOString().split("T")[0],propId:"",category:"",subcategory:"",description:"",vendor:"",amount:"",paymentMethod:"",notes:"",unitId:"",unitName:"",roomId:"",roomName:""},errs:{}}),100);}}>
              <span className="sn-i">＋</span>{label}
            </button>);}
            return(
            <button key={id} className={`sn ${tab===t.id?"on":""}`} onClick={()=>goTab(t.id)}>
              <span className="sn-i">{t.i}</span>{label}{t.badge&&<span className="sn-badge">{t.badge}</span>}
            </button>);
          })}
        </div>
      ))}

      {/* Edit / Done button — immediately after last item */}
      <div style={{padding:"8px 10px 4px"}}>
        {sidebarEditMode
          ?<div style={{display:"flex",flexDirection:"column",gap:6}}>
            <button onClick={()=>{setSidebarEditMode(false);setSidebarDrag(null);setSidebarDragOver(null);}}
              style={{width:"100%",padding:"8px",borderRadius:7,border:"none",background:"rgba(74,124,89,.8)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              Done
            </button>
            <button onClick={()=>{setSidebarConfig(DEF_SIDEBAR);setSettings(s=>{const u={...s,sidebarConfig:DEF_SIDEBAR,sidebarLabels:{}};save("hq-settings",u);return u;});setSidebarEditMode(false);}}
              style={{width:"100%",padding:"6px",borderRadius:7,border:"1px solid rgba(255,255,255,.15)",background:"transparent",color:"rgba(255,255,255,.5)",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>
              Reset to Default
            </button>
          </div>
          :<button onClick={()=>setSidebarEditMode(true)}
            style={{width:"100%",padding:"7px",borderRadius:7,border:"1px solid rgba(255,255,255,.12)",background:"transparent",color:"rgba(255,255,255,.4)",fontSize:10,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.color="rgba(255,255,255,.7)";e.currentTarget.style.borderColor="rgba(255,255,255,.25)";}}
            onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.4)";e.currentTarget.style.borderColor="rgba(255,255,255,.12)";}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Sidebar
          </button>}
      </div>

      <div className="s-ft">
        <a href="#">View Public Site</a>
      </div>
    </div>

    {/* Main */}
    <div className="mn">
      <div className="tbar"><div><h1><span style={{color:"#d4a853",display:"flex",alignItems:"center"}}>{(tabs.find(t=>t.id===tab)||{}).i}</span> {(tabs.find(t=>t.id===tab)||{}).l}</h1><div className="tbar-sub">{MO}</div></div></div>
      <div className="cnt">

      {/* ═══ DASHBOARD ═══ */}
      {tab==="dashboard"&&(()=>{
        const daysUntilNextRent=(()=>{const next=new Date(TODAY.getFullYear(),TODAY.getMonth()+1,1);return Math.ceil((next-TODAY)/(1e3*60*60*24));})();
        const mtdCharges=getChargesForPeriod("mtd");
        const ytdCharges=getChargesForPeriod("ytd");
        const mtdPastDue=mtdCharges.filter(c=>chargeStatus(c)==="pastdue");
        const mtdCollected=mtdCharges.reduce((s,c)=>s+c.amountPaid,0);
        const mtdExpected=mtdCharges.filter(c=>c.category==="Rent").reduce((s,c)=>s+c.amount,0);
        const ytdCollected=ytdCharges.reduce((s,c)=>s+c.amountPaid,0);
        const ytdExpenses=expenses.filter(e=>{const d=new Date(e.date+"T00:00:00");return d.getFullYear()===TODAY.getFullYear();}).reduce((s,e)=>s+e.amount,0);
        const ytdNOI=ytdCollected-ytdExpenses;
        const totalDebt=mortgages.reduce((s,mg)=>s+(mg.balance||0),0);
        const totalPropValue=props.reduce((s,p)=>s+(p.estimatedValue||0),0);
        const totalEquity=totalPropValue-totalDebt;
        const annualNOI=ytdNOI*(12/Math.max(TODAY.getMonth()+1,1));
        const roe=totalEquity>0?Math.round((annualNOI/totalEquity)*100):null;
        const openMaintItems=maint.filter(x=>x.status!=="resolved");
        const nextRentCharges=getChargesForPeriod("next");
        const nextRentTotal=nextRentCharges.filter(c=>c.category==="Rent").reduce((s,c)=>s+c.amount,0);
        const appsByStage={"new-lead":0,"applied":0,"approved":0,"onboarding":0};
        apps.filter(a=>a.status!=="denied").forEach(a=>{if(appsByStage[a.status]!==undefined)appsByStage[a.status]++;});
        const defWidgets=settings.dashWidgets||["pastDue","leaseExp","vacancy","maintenance","mtdCollection","recentActivity","appPipeline","upcomingRent"];
        const activeWidgets=widgetList||defWidgets;
        const editMode=dashEditMode;
        const dragWidget=dashDragWidget;
        const dragOver=dashDragOver;
        const saveWidgets=(list)=>{setWidgetList(list);const u={...settings,dashWidgets:list};setSettings(u);save("hq-settings",u);};
        const removeWidget=(id)=>saveWidgets(activeWidgets.filter(w=>w!==id));
        const addWidget=(id)=>{if(!activeWidgets.includes(id))saveWidgets([...activeWidgets,id]);};
        const onDragStart=(id)=>setDashDragWidget(id);
        const onDragOver=(e,id)=>{e.preventDefault();setDashDragOver(id);};
        const onDrop=(e,targetId)=>{e.preventDefault();if(!dragWidget||dragWidget===targetId)return;const list=[...activeWidgets];const from=list.indexOf(dragWidget);const to=list.indexOf(targetId);list.splice(from,1);list.splice(to,0,dragWidget);saveWidgets(list);setDashDragWidget(null);setDashDragOver(null);};
        const onDragEnd=()=>{setDashDragWidget(null);setDashDragOver(null);};
        const ALL_WIDGETS=[
          {id:"pastDue",label:"Past Due"},{id:"leaseExp",label:"Lease Expirations"},{id:"vacancy",label:"Vacant Rooms"},
          {id:"maintenance",label:"Open Maintenance"},{id:"mtdCollection",label:"MTD Collection"},{id:"recentActivity",label:"Recent Activity"},
          {id:"appPipeline",label:"Application Pipeline"},{id:"upcomingRent",label:"Upcoming Rent"},{id:"ytdRevenue",label:"YTD Revenue"},
          {id:"ytdExpenses",label:"YTD Expenses"},{id:"noi",label:"Net Operating Income"},{id:"vacancyCost",label:"Vacancy Cost"},
          {id:"leaseRenewals",label:"Lease Renewals"},{id:"doorCodes",label:"Door Codes"},{id:"cleaning",label:"Cleaning Schedule"},
          {id:"propBreakdown",label:"Revenue by Property"},{id:"roe",label:"Return on Equity"},{id:"profitability",label:"Profitability by Property"},
          {id:"dscr",label:"DSCR"},{id:"rocks",label:"Traction Rocks"},
        ];
        const availableToAdd=ALL_WIDGETS.filter(w=>!activeWidgets.includes(w.id));
        const NeedsData=({label,goTo,field})=>(<div style={{padding:"10px 0"}}>
          <div style={{fontSize:11,color:"#6b5e52",marginBottom:6}}>Enter {field} to calculate {label}</div>
          <button className="btn btn-out btn-sm" style={{fontSize:10}} onClick={()=>goTab(goTo||"properties")}>Enter data</button>
        </div>);
        const renderWidget=(id)=>{switch(id){
          case "pastDue":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Past Due</div>
            {mtdPastDue.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>No past due charges</div>}
            {mtdPastDue.slice(0,5).map(c=><div key={c.id} className="row" style={{cursor:"pointer",padding:"6px 0"}} onClick={()=>{goTab("payments");setPaySubTab("charges");}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{c.tenantName}</div><div className="row-s">{c.propName} · Due {fmtD(c.dueDate)}</div></div><div className="row-v kb" style={{fontSize:13}}>{fmtS(c.amount-c.amountPaid)}</div></div>)}
            {mtdPastDue.length>5&&<div style={{fontSize:10,color:"#6b5e52",paddingTop:6,cursor:"pointer"}} onClick={()=>{goTab("payments");}}>+{mtdPastDue.length-5} more</div>}
          </>);
          case "leaseExp":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Lease Expirations</div>
            {m.expiring.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>No leases expiring within 90 days</div>}
            {m.expiring.sort((a,b)=>a.daysLeft-b.daysLeft).map(r=><div key={r.id} className="row" style={{cursor:"pointer",padding:"6px 0"}} onClick={()=>goTab("tenants")}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{r.tenant&&r.tenant.name}</div><div className="row-s">{r.propName} · {r.name} · Ends {fmtD(r.le)}</div></div><span className="badge" style={{background:r.daysLeft<=30?"rgba(196,92,74,.08)":"rgba(212,168,83,.1)",color:r.daysLeft<=30?"#c45c4a":"#9a7422",flexShrink:0}}>{r.daysLeft}d</span></div>)}
          </>);
          case "vacancy":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Vacant Rooms</div>
            {m.vacs.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>Fully occupied</div>}
            {m.vacs.map(r=><div key={r.id} className="row" style={{padding:"6px 0"}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{r.name}</div><div className="row-s">{r.propName} · {fmtS(r.rent)}/mo lost</div></div><button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("applications")}>Find Tenant</button></div>)}
          </>);
          case "maintenance":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Open Maintenance ({openMaintItems.length})</div>
            {openMaintItems.length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>No open requests</div>}
            {openMaintItems.slice(0,5).map(x=><div key={x.id} className="row" style={{cursor:"pointer",padding:"6px 0"}} onClick={()=>goTab("maintenance")}><div className="row-dot" style={{background:x.priority==="high"?"#c45c4a":x.priority==="medium"?"#d4a853":"#999"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{x.title}</div><div className="row-s">{x.propName||""}{x.tenant?" · "+x.tenant:""}</div></div></div>)}
            {openMaintItems.length>5&&<div style={{fontSize:10,color:"#6b5e52",paddingTop:6,cursor:"pointer"}} onClick={()=>goTab("maintenance")}>+{openMaintItems.length-5} more</div>}
          </>);
          case "mtdCollection":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>MTD Collection</div>
            <div style={{fontSize:24,fontWeight:800,color:"#4a7c59",marginBottom:4}}>{fmtS(mtdCollected)}</div>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:10}}>{mtdExpected>0?Math.round(mtdCollected/mtdExpected*100):0}% of {fmtS(mtdExpected)} expected</div>
            <div style={{height:6,borderRadius:3,background:"rgba(0,0,0,.06)"}}><div style={{height:"100%",borderRadius:3,background:"#4a7c59",width:(mtdExpected>0?Math.min(Math.round(mtdCollected/mtdExpected*100),100):0)+"%",transition:"width .4s"}}/></div>
            {mtdExpected>mtdCollected&&<div style={{fontSize:10,color:"#c45c4a",marginTop:6}}>{fmtS(mtdExpected-mtdCollected)} outstanding</div>}
          </>);
          case "recentActivity":return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8}}>Recent Activity</div>
              {notifs.length>0&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>{setNotifs([]);save("hq-notifs",[]);}}>Clear All</button>}
            </div>
            {notifs.length===0&&<div style={{fontSize:12,color:"#6b5e52"}}>No recent activity</div>}
            {notifs.slice(0,8).map(n=><div key={n.id} className="row" style={{opacity:n.read?.7:1,cursor:"pointer",padding:"5px 0"}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>
              <div className="row-dot" style={{background:n.type==="payment"?"#4a7c59":n.type==="lease"?"#3b82f6":n.type==="maint"?"#d4a853":"#999",flexShrink:0}}/>
              <div className="row-i"><div className="row-t" style={{fontWeight:n.read?500:700,fontSize:11}}>{n.msg}</div><div className="row-s">{n.date}</div></div>
              {!n.read&&<div className="notif-dot"/>}
            </div>)}
          </>);
          case "appPipeline":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Application Pipeline</div>
            {[["new-lead","New Lead"],["applied","Applied"],["approved","Approved"],["onboarding","Onboarding"]].map(([k,l])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                <span style={{fontSize:11,color:"#5c4a3a"}}>{l}</span>
                <span style={{fontSize:12,fontWeight:700,color:appsByStage[k]>0?"#1a1714":"#ccc"}}>{appsByStage[k]}</span>
              </div>
            ))}
            <div style={{marginTop:8}}><button className="btn btn-out btn-sm" style={{fontSize:10,width:"100%"}} onClick={()=>goTab("applications")}>View All</button></div>
          </>);
          case "upcomingRent":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Upcoming Rent</div>
            <div style={{fontSize:24,fontWeight:800,color:"#1a1714",marginBottom:4}}>{fmtS(nextRentTotal)}</div>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:10}}>{daysUntilNextRent} day{daysUntilNextRent!==1?"s":""} · {nextRentCharges.filter(c=>c.category==="Rent").length} charges</div>
            {nextRentCharges.filter(c=>c.category==="Rent").slice(0,4).map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:11}}><span>{c.tenantName}</span><span style={{fontWeight:700}}>{fmtS(c.amount)}</span></div>)}
          </>);
          case "ytdRevenue":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>YTD Revenue</div>
            <div style={{fontSize:24,fontWeight:800,color:"#4a7c59",marginBottom:4}}>{fmtS(ytdCollected)}</div>
            <div style={{fontSize:11,color:"#6b5e52"}}>Collected Jan – {TODAY.toLocaleString("default",{month:"short"})} {TODAY.getFullYear()}</div>
          </>);
          case "ytdExpenses":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>YTD Expenses</div>
            <div style={{fontSize:24,fontWeight:800,color:"#c45c4a",marginBottom:4}}>{fmtS(ytdExpenses)}</div>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:6}}>Spent Jan – {TODAY.toLocaleString("default",{month:"short"})} {TODAY.getFullYear()}</div>
            {ytdExpenses===0&&<div style={{fontSize:10,color:"#6b5e52"}}>No expenses yet. <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("accounting")}>Add in Accounting</button></div>}
          </>);
          case "noi":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Net Operating Income</div>
            <div style={{fontSize:24,fontWeight:800,color:ytdNOI>=0?"#4a7c59":"#c45c4a",marginBottom:4}}>{fmtS(ytdNOI)}</div>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:6}}>YTD · {fmtS(ytdCollected)} revenue minus {fmtS(ytdExpenses)} expenses</div>
            {ytdExpenses===0&&<div style={{fontSize:10,color:"#6b5e52"}}>Add expenses in <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("accounting")}>Accounting</button> for accurate NOI</div>}
          </>);
          case "vacancyCost":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Vacancy Cost</div>
            {m.vacs.length===0?<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>Fully occupied — no vacancy loss</div>:<>
              <div style={{fontSize:24,fontWeight:800,color:"#c45c4a",marginBottom:4}}>{fmtS(m.lost)}/mo</div>
              <div style={{fontSize:11,color:"#6b5e52"}}>{fmtS(Math.round(m.lost/30))}/day · {m.vacs.length} empty room{m.vacs.length!==1?"s":""}</div>
            </>}
          </>);
          case "leaseRenewals":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Renewals Needed (60d)</div>
            {m.expiring.filter(r=>r.daysLeft<=60).length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>No renewals needed in next 60 days</div>}
            {m.expiring.filter(r=>r.daysLeft<=60).map(r=><div key={r.id} className="row" style={{padding:"6px 0"}}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t" style={{fontSize:12}}>{r.tenant&&r.tenant.name}</div><div className="row-s">Expires {fmtD(r.le)} · {r.propName}</div></div><button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("tenants")}>Renew</button></div>)}
          </>);
          case "doorCodes":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Door Codes</div>
            {allTenants.filter(r=>r.tenant&&r.tenant.doorCode).length===0&&<div style={{fontSize:12,color:"#6b5e52"}}>No door codes on file</div>}
            {allTenants.filter(r=>r.tenant&&r.tenant.doorCode).map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <div><div style={{fontSize:11,fontWeight:600}}>{r.tenant.name}</div><div style={{fontSize:9,color:"#6b5e52"}}>{roomSubLine(r.propName,r.name)}</div></div>
              <div style={{fontFamily:"monospace",fontSize:16,fontWeight:800,letterSpacing:4,color:"#1a1714"}}>{r.tenant.doorCode}</div>
            </div>)}
          </>);
          case "cleaning":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Cleaning Schedule</div>
            {props.map(p=>{const freq=(p.units&&p.units[0]&&p.units[0].clean)||p.clean||"Biweekly";return(<div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}><span style={{fontSize:11,fontWeight:600}}>{p.name}</span><span style={{fontSize:10,color:"#6b5e52"}}>{freq}</span></div>);})}
          </>);
          case "propBreakdown":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Revenue by Property</div>
            {m.propBreakdown.map(pr=><div key={pr.id} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,fontWeight:600}}>{pr.name}</span><span style={{fontSize:11,fontWeight:700,color:"#4a7c59"}}>{fmtS(pr.collected)}</span></div>
              <div style={{height:4,borderRadius:2,background:"rgba(0,0,0,.06)"}}><div style={{height:"100%",borderRadius:2,background:"#4a7c59",width:(pr.fullOcc>0?Math.min(Math.round(pr.collected/pr.fullOcc*100),100):0)+"%"}}/></div>
              <div style={{fontSize:9,color:"#6b5e52",marginTop:2}}>{pr.occCount} occupied · {fmtS(pr.fullOcc)}/mo at full</div>
            </div>)}
          </>);
          case "roe":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Return on Equity</div>
            {totalPropValue===0?<NeedsData label="ROE" goTo="properties" field="estimated property values in each property"/>:<>
              <div style={{fontSize:24,fontWeight:800,color:roe&&roe>=8?"#4a7c59":"#c45c4a",marginBottom:4}}>{roe!==null?roe+"%":"—"}</div>
              <div style={{fontSize:11,color:"#6b5e52",marginBottom:4}}>Annualized · Equity {fmtS(totalEquity)} · NOI {fmtS(Math.round(annualNOI))}/yr</div>
              <div style={{fontSize:10,color:"#6b5e52"}}>Prop value {fmtS(totalPropValue)} minus debt {fmtS(totalDebt)}</div>
            </>}
          </>);
          case "profitability":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Profitability by Property</div>
            {props.some(p=>!p.estimatedValue)?<NeedsData label="profitability" goTo="properties" field="estimated values in each property"/>:
              props.map(pr=>{
                const prInc=ytdCharges.filter(c=>c.propName===pr.name).reduce((s,c)=>s+c.amountPaid,0);
                const prExp=expenses.filter(e=>e.propId===pr.id&&new Date(e.date+"T00:00:00").getFullYear()===TODAY.getFullYear()).reduce((s,e)=>s+e.amount,0);
                const prNOI=prInc-prExp;const margin=prInc>0?Math.round(prNOI/prInc*100):0;
                return(<div key={pr.id} style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:600}}>{pr.name}</span><span style={{fontSize:11,fontWeight:700,color:prNOI>=0?"#4a7c59":"#c45c4a"}}>{fmtS(prNOI)} NOI</span></div>
                  <div style={{fontSize:9,color:"#6b5e52"}}>Income {fmtS(prInc)} · Expenses {fmtS(prExp)} · {margin}% margin</div>
                </div>);
              })
            }
          </>);
          case "dscr":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>DSCR</div>
            {mortgages.length===0?<NeedsData label="DSCR" goTo="accounting" field="mortgage data in Accounting"/>:
              mortgages.map(mg=>{
                const propInc=ytdCharges.filter(c=>c.propName===mg.propName).reduce((s,c)=>s+c.amountPaid,0)*(12/Math.max(TODAY.getMonth()+1,1));
                const annDebt=(mg.payment||0)*12;const dscr=annDebt>0?(propInc/annDebt).toFixed(2):null;
                return(<div key={mg.id} style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,fontWeight:600}}>{mg.propName}</span><span style={{fontSize:14,fontWeight:800,color:dscr&&dscr>=1.25?"#4a7c59":dscr&&dscr>=1?"#d4a853":"#c45c4a"}}>{dscr||"—"}x</span></div>
                  <div style={{fontSize:9,color:"#6b5e52"}}>NOI {fmtS(Math.round(propInc))}/yr vs debt {fmtS(annDebt)}/yr</div>
                </div>);
              })
            }
          </>);
          case "rocks":return(<>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Traction Rocks</div>
            {rocks.filter(r=>r.status!=="done").length===0&&<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>All rocks complete</div>}
            {rocks.filter(r=>r.status!=="done").slice(0,5).map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <div><div style={{fontSize:11,fontWeight:600}}>{r.title}</div><div style={{fontSize:9,color:"#6b5e52"}}>Due {fmtD(r.due)} · {r.owner}</div></div>
              <span className={"badge "+(r.status==="on-track"?"b-green":r.status==="off-track"?"b-red":"b-gray")} style={{fontSize:8,flexShrink:0}}>{r.status}</span>
            </div>)}
          </>);
          default:return null;
        }};
        return(<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <h2 style={{fontSize:22,fontWeight:800,color:"#1a1714",marginBottom:2}}>{MO}</h2>
            <div style={{fontSize:12,color:"#6b5e52"}}>{daysUntilNextRent} day{daysUntilNextRent!==1?"s":""} until next rent cycle</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <button className="btn btn-out btn-sm" onClick={openCreateCharge}>+ Charge</button>
            <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"addCredit",roomId:"",amount:0,reason:""})}>+ Credit</button>
            <button className="btn btn-out btn-sm" onClick={()=>goTab("applications")}>+ Application</button>
            <button className="btn btn-out btn-sm" style={{borderColor:editMode?"#c45c4a":"rgba(0,0,0,.08)",color:editMode?"#c45c4a":"#5c4a3a",background:editMode?"rgba(196,92,74,.06)":"#fff"}} onClick={()=>setDashEditMode(e=>!e)}>{dashEditMode?"Done Editing":"Edit Widgets"}</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          <div className="card" style={{margin:0,cursor:"pointer"}} onClick={()=>setDrill(drill==="coll"?null:"coll")}><div className="card-bd" style={{textAlign:"center",padding:"14px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Collected</div>
            <div style={{fontSize:22,fontWeight:800,color:"#4a7c59",marginBottom:2}}>{fmtS(mtdCollected)}</div>
            <div style={{fontSize:10,color:"#6b5e52"}}>{mtdExpected>0?Math.round(mtdCollected/mtdExpected*100):0}% of {fmtS(mtdExpected)}</div>
          </div></div>
          <div className="card" style={{margin:0,cursor:"pointer",borderColor:mtdPastDue.length?"rgba(196,92,74,.3)":"rgba(0,0,0,.06)"}} onClick={()=>{goTab("payments");setPaySubTab("charges");setPayFilters({...payFilters,status:"pastdue"});}}><div className="card-bd" style={{textAlign:"center",padding:"14px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Past Due</div>
            <div style={{fontSize:22,fontWeight:800,color:mtdPastDue.length?"#c45c4a":"#4a7c59",marginBottom:2}}>{mtdPastDue.length?fmtS(mtdPastDue.reduce((s,c)=>s+(c.amount-c.amountPaid),0)):"None"}</div>
            <div style={{fontSize:10,color:"#6b5e52"}}>{mtdPastDue.length} charge{mtdPastDue.length!==1?"s":""} overdue</div>
          </div></div>
          <div className="card" style={{margin:0,cursor:"pointer"}} onClick={()=>setDrill(drill==="occ"?null:"occ")}><div className="card-bd" style={{textAlign:"center",padding:"14px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Occupancy</div>
            <div style={{fontSize:22,fontWeight:800,color:m.occRate>=90?"#4a7c59":"#c45c4a",marginBottom:2}}>{m.occRate}%</div>
            <div style={{fontSize:10,color:"#6b5e52"}}>{m.occ}/{m.total} rooms · {fmtS(m.lost)}/mo lost</div>
          </div></div>
          <div className="card" style={{margin:0,cursor:"pointer"}} onClick={()=>goTab("maintenance")}><div className="card-bd" style={{textAlign:"center",padding:"14px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Maintenance</div>
            <div style={{fontSize:22,fontWeight:800,color:m.openMaint?"#d4a853":"#4a7c59",marginBottom:2}}>{m.openMaint}</div>
            <div style={{fontSize:10,color:"#6b5e52"}}>open request{m.openMaint!==1?"s":""}</div>
          </div></div>
        </div>

        {drill==="occ"&&<div className="card" style={{marginBottom:16,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Occupancy — {m.occ}/{m.total} rooms</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>Close</button></div>
          {m.vacs.length===0&&<div style={{padding:20,textAlign:"center",color:"#4a7c59",fontWeight:700,fontSize:13}}>Fully occupied</div>}
          {m.vacs.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.name}</div><div className="row-s">{r.propName} · {r.pb?"Private":"Shared"} bath</div></div><div className="row-v kb">{fmtS(r.rent)}<div style={{fontSize:9,color:"#6b5e52"}}>lost/mo</div></div><button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>goTab("applications")}>Find Tenant</button></div>)}
        </div></div>}
        {drill==="coll"&&<div className="card" style={{marginBottom:16,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Collection — {fmtS(m.coll)} / {fmtS(m.due)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>Close</button></div>
          {m.unpaid.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#c45c4a",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Unpaid ({m.unpaid.length})</div>
            {m.unpaid.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.tenant&&r.tenant.name}</div><div className="row-s">{roomSubLine(r.propName,r.name)}</div></div><div className="row-v kb">{fmtS(r.rent)}</div><button className="btn btn-green btn-sm" onClick={()=>openPayForm(r.id)}>Record Payment</button></div>)}</>}
          {m.paid.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#4a7c59",marginTop:12,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Paid ({m.paid.length})</div>
            {m.paid.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#4a7c59"}}/><div className="row-i"><div className="row-t">{r.tenant&&r.tenant.name}</div><div className="row-s">{r.propName}</div></div><div className="row-v kg">{fmtS(r.paidAmt)}</div></div>)}</>}
        </div></div>}

        {dashEditMode&&availableToAdd.length>0&&<div className="card" style={{marginBottom:16,border:"1px solid rgba(74,124,89,.2)",background:"rgba(74,124,89,.02)"}}><div className="card-bd">
          <div style={{fontSize:10,fontWeight:700,color:"#4a7c59",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Add Widgets</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {availableToAdd.map(w=><button key={w.id} onClick={()=>addWidget(w.id)} style={{padding:"6px 14px",borderRadius:7,border:"1px solid rgba(74,124,89,.3)",background:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:"#4a7c59",fontFamily:"inherit"}}>+ {w.label}</button>)}
          </div>
        </div></div>}

        <style>{`@keyframes widgetWiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-0.8deg)}75%{transform:rotate(0.8deg)}}`}</style>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
          {activeWidgets.map(id=>(
            <div key={id} draggable={editMode} onDragStart={()=>onDragStart(id)} onDragOver={e=>onDragOver(e,id)} onDrop={e=>onDrop(e,id)} onDragEnd={onDragEnd}
              style={{animation:editMode?"widgetWiggle .5s ease-in-out infinite":"none",animationDelay:Math.random()*.2+"s",cursor:editMode?"grab":"default",opacity:dragWidget===id?.4:1,outline:dragOver===id&&dragWidget!==id?"2px dashed #4a7c59":"none",outlineOffset:2,borderRadius:10,transition:"opacity .15s"}}>
              <div className="card" style={{margin:0,position:"relative",height:"100%"}}>
                {editMode&&<button onClick={()=>removeWidget(id)} style={{position:"absolute",top:8,right:8,width:22,height:22,borderRadius:"50%",background:"#c45c4a",color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,padding:0,lineHeight:1}}>x</button>}
                <div className="card-bd" style={{paddingRight:editMode?36:undefined}}>{renderWidget(id)}</div>
              </div>
            </div>
          ))}
        </div>
      </>);})()} 

      {/* ═══ TENANTS ═══ */}
      {tab==="tenants"&&(()=>{
        const tenantView=drill||"active";
        const filteredActive=allTenants.filter(r=>{
          if(tenantPropFilter!=="all"&&r.propId!==tenantPropFilter)return false;
          if(tenantSearch){const q=tenantSearch.toLowerCase();if(![r.tenant?.name,r.tenant?.email,r.tenant?.phone,r.propName,r.name].some(v=>(v||"").toLowerCase().includes(q)))return false;}
          return true;
        });
        const pastTenants=archive.filter(a=>!a.isArchived);
        const archivedTenants=archive.filter(a=>a.isArchived);
        const filterArchiveList=(list)=>list.filter(a=>{
          if(tenantPropFilter!=="all"&&props.find(p=>p.name===a.propName)?.id!==tenantPropFilter)return false;
          if(tenantSearch){const q=tenantSearch.toLowerCase();if(![a.name,a.email,a.propName,a.roomName].some(v=>(v||"").toLowerCase().includes(q)))return false;}
          return true;
        });
        const filteredPast=filterArchiveList(pastTenants);
        const filteredArchived=filterArchiveList(archivedTenants);
        const filteredArchive=tenantView==="archived"?filteredArchived:filteredPast;
        const allSelected=tenantView==="active"&&tenantSel.length===filteredActive.length&&filteredActive.length>0;
        const archiveTenant=(id)=>setArchive(p=>p.map(a=>a.id===id?{...a,isArchived:true}:a));
        const unarchiveTenant=(id)=>setArchive(p=>p.map(a=>a.id===id?{...a,isArchived:false}:a));
        const tz=settings.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone;
        const tzShort=new Intl.DateTimeFormat("en-US",{timeZoneName:"short",timeZone:tz}).format(new Date()).split(" ").pop();
        const fmtLastActive=(iso)=>{if(!iso)return null;try{return new Intl.DateTimeFormat("en-US",{month:"numeric",day:"numeric",year:"2-digit",hour:"numeric",minute:"2-digit",hour12:true,timeZone:tz}).format(new Date(iso));}catch{return iso;}};
        const COLS="40px 1fr 180px 150px 180px";
        const HDR={fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.7};
        return(<>

        {/* Browser-tab style header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:0,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:0}}>
            {[["active","Active",allTenants.length],["archive","Past",pastTenants.length],["archived","Archived",archivedTenants.length]].map(([v,l,c])=>{
              const active=tenantView===v;
              return(
              <button key={v} onClick={()=>{setDrill(v==="active"?null:v);setTenantSel([]);}}
                style={{padding:"10px 22px",border:"1px solid rgba(0,0,0,.1)",borderBottom:active?"none":"1px solid rgba(0,0,0,.1)",borderRadius:"8px 8px 0 0",marginRight:4,background:active?"#fff":"rgba(0,0,0,.04)",color:active?"#1a1714":"#7a7067",fontWeight:active?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",position:"relative",zIndex:active?2:1,boxShadow:active?"0 -2px 0 0 "+(settings.adminAccent||"#4a7c59")+" inset":"none"}}>
                {l} <span style={{fontSize:11,fontWeight:400,opacity:.7}}>({c})</span>
              </button>);
            })}
          </div>
          <button className="btn btn-green btn-sm" style={{marginBottom:2}} onClick={()=>setModal({type:"addExistingTenant",propId:"",unitId:"",roomId:"",form:{name:"",email:"",phone:"",moveIn:TODAY.toISOString().split("T")[0],leaseEnd:"",rent:"",sd:"",doorCode:"",notes:"",gender:"",occupationType:""}})}>+ Add Tenant</button>
        </div>

        {/* Table card — flush top to connect with tabs */}
        <div className="card" style={{borderRadius:"0 8px 8px 8px",marginBottom:14}}><div className="card-bd" style={{padding:0}}>

          {/* Search + filter bar */}
          <div style={{display:"flex",gap:6,padding:"10px 14px",borderBottom:"1px solid rgba(0,0,0,.06)",flexWrap:"wrap",alignItems:"center"}}>
            <div style={{position:"relative",flex:1,minWidth:180}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7a7067" strokeWidth="2" style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={tenantSearch} onChange={e=>setTenantSearch(e.target.value)} placeholder="Search name, email or phone..." style={{width:"100%",padding:"6px 10px 6px 28px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/>
            </div>
            <select value={tenantPropFilter} onChange={e=>setTenantPropFilter(e.target.value)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",background:"#fff"}}>
              <option value="all">All Properties</option>
              {props.map(p=><option key={p.id} value={p.id}>{p.name}{p.addr?" — "+p.addr:""}</option>)}
            </select>
            {tenantSel.length>0&&<>
              <span style={{fontSize:11,fontWeight:700,color:"#5c4a3a"}}>{tenantSel.length} selected</span>
              <button className="btn btn-green btn-sm" onClick={()=>{const emails=filteredActive.filter(r=>tenantSel.includes(r.id)&&r.tenant?.email).map(r=>r.tenant.email);if(emails.length)setModal({type:"bulkMessage",emails,count:tenantSel.length});}}>Send Message</button>
              <button className="btn btn-out btn-sm" onClick={()=>setTenantSel([])}>Clear</button>
            </>}
          </div>

          {/* Column headers */}
          <div style={{display:"grid",gridTemplateColumns:COLS,padding:"8px 16px",borderBottom:"1px solid rgba(0,0,0,.08)",background:"rgba(0,0,0,.02)"}}>
            <div style={{display:"flex",alignItems:"center"}}>
              {tenantView==="active"&&<input type="checkbox" checked={allSelected} onChange={e=>setTenantSel(e.target.checked?filteredActive.map(r=>r.id):[])} style={{width:14,height:14,cursor:"pointer"}}/>}
            </div>
            <div style={HDR}>Tenant</div>
            <div style={HDR}>Contact</div>
            <div style={HDR}>Rent</div>
            <div style={HDR}>{tenantView==="active"?<>Portal Access <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:9}}>({tzShort})</span></>:tenantView==="archived"?"Archived":"Actions"}</div>
          </div>

          {/* Active rows */}
          {tenantView==="active"&&<>{filteredActive.map(r=>{
            const pd=(payments[r.id]&&payments[r.id][MO])||0;
            const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;
            const sel=tenantSel.includes(r.id);
            const prop=props.find(p=>p.id===r.propId);
            const ob=obStatuses[(r.tenant?.email||"").toLowerCase()];
            const lastActive=ob?.lastActive||null;
            return(
            <div key={r.id} style={{display:"grid",gridTemplateColumns:COLS,padding:"14px 16px",borderBottom:"1px solid rgba(0,0,0,.05)",background:sel?"rgba(74,124,89,.06)":"#fff",cursor:"pointer",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=sel?"rgba(74,124,89,.08)":"rgba(0,0,0,.04)";e.currentTarget.style.boxShadow="inset 3px 0 0 "+(settings.adminAccent||"#4a7c59");}}
              onMouseLeave={e=>{e.currentTarget.style.background=sel?"rgba(74,124,89,.06)":"#fff";e.currentTarget.style.boxShadow="none";}}
              onClick={()=>{setTenantProfileTab("summary");setModal({type:"tenant",data:r});}}>
              {/* Checkbox */}
              <div style={{display:"flex",alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                <input type="checkbox" checked={sel} onChange={e=>setTenantSel(p=>e.target.checked?[...p,r.id]:p.filter(x=>x!==r.id))} style={{width:14,height:14,cursor:"pointer"}}/>
              </div>
              {/* Tenant col */}
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#1a1714",marginBottom:2}}>{r.tenant.name}</div>
                <div style={{fontSize:11,color:"#5c4a3a",marginBottom:5}}>{r.propName}{prop?.addr?" · "+prop.addr:""} · {r.name}</div>
                <button onClick={e=>{e.stopPropagation();setModal({type:"tenant",data:r});}}
                  onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${settings.adminAccentRgb||"74,124,89"},.2)`;e.currentTarget.style.transform="scale(1.02)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=`rgba(${settings.adminAccentRgb||"74,124,89"},.08)`;e.currentTarget.style.transform="";}}
                  style={{fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:5,border:`1px solid rgba(${settings.adminAccentRgb||"74,124,89"},.3)`,background:`rgba(${settings.adminAccentRgb||"74,124,89"},.08)`,color:(settings.adminAccent||"#4a7c59"),cursor:"pointer",fontFamily:"inherit",transition:"all .15s",display:"inline-flex",alignItems:"center",gap:4}}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {r.le?`Lease ends ${fmtD(r.le)}`:"View Lease"}
                </button>
                {dl!==null&&dl<=90&&<span style={{marginLeft:6,fontSize:9,color:dl<=30?"#c45c4a":"#d4a853",fontWeight:700}}>{dl<=30?"⚠ ":""}Expires {dl}d</span>}
              </div>
              {/* Contact */}
              <div style={{display:"flex",flexDirection:"column",gap:3,justifyContent:"center"}}>
                <div style={{fontSize:11,color:"#3b82f6"}}>{r.tenant.email||"—"}</div>
                <div style={{fontSize:11,color:"#5c4a3a"}}>{r.tenant.phone||"—"}</div>
              </div>
              {/* Rent + payment status merged */}
              <div style={{display:"flex",flexDirection:"column",gap:3,justifyContent:"center"}}>
                <div style={{fontSize:14,fontWeight:800,color:"#1a1714"}}>{fmtS(r.rent)}<span style={{fontSize:10,fontWeight:400,color:"#7a7067"}}>/mo</span></div>
                <span className={`badge ${pd?"b-green":"b-red"}`} style={{alignSelf:"flex-start"}}>{pd?"✓ Paid":"Unpaid"}</span>
                {r.tenant.moveIn&&<div style={{fontSize:9,color:"#7a7067"}}>Since {fmtD(r.tenant.moveIn)}</div>}
              </div>
              {/* Portal access */}
              <div style={{display:"flex",flexDirection:"column",gap:3,justifyContent:"center"}}>
                {ob?(
                  <>
                    <span className="badge b-green" style={{alignSelf:"flex-start"}}>Connected</span>
                    {lastActive?<div style={{fontSize:10,color:"#5c4a3a"}}>{fmtLastActive(lastActive)}</div>:<div style={{fontSize:10,color:"#7a7067"}}>Never logged in</div>}
                  </>
                ):(
                  <>
                    <span className="badge b-gray" style={{alignSelf:"flex-start"}}>Not invited</span>
                    {r.tenant?.email&&<button onClick={e=>{e.stopPropagation();setPiState("idle");setModal({type:"sendPortalInviteApp",data:{...r.tenant,id:r.id,name:r.tenant.name,email:r.tenant.email,property:r.propName,room:r.name}});}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(74,124,89,.15)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(74,124,89,.08)"}
                      style={{fontSize:9,fontWeight:600,padding:"2px 8px",borderRadius:4,border:"1px solid rgba(74,124,89,.25)",background:"rgba(74,124,89,.08)",color:"#4a7c59",cursor:"pointer",fontFamily:"inherit",transition:"background .12s"}}>
                      Send Invite
                    </button>}
                  </>
                )}
              </div>
            </div>);
          })}
          {filteredActive.length===0&&<div style={{textAlign:"center",padding:40,color:"#6b5e52"}}>{allTenants.length===0?"No active tenants yet.":"No tenants match your search."}</div>}
          </>}

          {/* Past + Archived rows */}
          {(tenantView==="archive"||tenantView==="archived")&&<>{filteredArchive.map(a=>{
            const prop=props.find(p=>p.name===a.propName);
            const isArch=a.isArchived;
            return(
            <div key={a.id} style={{display:"grid",gridTemplateColumns:COLS,padding:"14px 16px",borderBottom:"1px solid rgba(0,0,0,.05)",background:"#fff",cursor:"pointer",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,.04)";e.currentTarget.style.boxShadow="inset 3px 0 0 #8a7d74";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.boxShadow="none";}}
              onClick={()=>setModal({type:"archived",data:a})}>
              <div/>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#1a1714",marginBottom:2}}>{a.name}</div>
                <div style={{fontSize:11,color:"#5c4a3a",marginBottom:2}}>{a.propName}{prop?.addr?" · "+prop.addr:""} · {a.roomName}</div>
                {a.reason&&<div style={{fontSize:10,color:"#7a7067",fontStyle:"italic"}}>{a.reason}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:3,justifyContent:"center"}}>
                <div style={{fontSize:11,color:"#5c4a3a"}}>{a.email||"—"}</div>
                <div style={{fontSize:11,color:"#5c4a3a"}}>{a.phone||"—"}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:3,justifyContent:"center"}}>
                <div style={{fontSize:13,fontWeight:700}}>{fmtS(a.rent)}<span style={{fontSize:10,fontWeight:400,color:"#7a7067"}}>/mo</span></div>
                <div style={{fontSize:10,color:"#7a7067"}}>{fmtD(a.moveIn)} → {fmtD(a.leaseEnd)}</div>
                <div style={{fontSize:10,color:"#7a7067"}}>Terminated {fmtD(a.terminatedDate)}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4,justifyContent:"center"}} onClick={e=>e.stopPropagation()}>
                {isArch
                  ?<>
                    <span className="badge b-gray" style={{alignSelf:"flex-start",fontSize:9}}>Archived</span>
                    <button
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.08)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,.04)"}
                      onClick={()=>unarchiveTenant(a.id)}
                      style={{fontSize:9,fontWeight:600,padding:"3px 8px",borderRadius:4,border:"1px solid rgba(0,0,0,.1)",background:"rgba(0,0,0,.04)",color:"#5c4a3a",cursor:"pointer",fontFamily:"inherit",transition:"background .12s",alignSelf:"flex-start"}}>
                      Unarchive
                    </button>
                  </>
                  :<>
                    <span className="badge b-gray" style={{alignSelf:"flex-start",fontSize:9}}>Past</span>
                    <button
                      onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,.1)";e.currentTarget.style.borderColor="rgba(0,0,0,.2)";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,0,0,.04)";e.currentTarget.style.borderColor="rgba(0,0,0,.1)";}}
                      onClick={()=>archiveTenant(a.id)}
                      style={{fontSize:9,fontWeight:600,padding:"3px 8px",borderRadius:4,border:"1px solid rgba(0,0,0,.1)",background:"rgba(0,0,0,.04)",color:"#5c4a3a",cursor:"pointer",fontFamily:"inherit",transition:"all .12s",alignSelf:"flex-start"}}>
                      Archive →
                    </button>
                  </>
                }
              </div>
            </div>);
          })}
          {filteredArchive.length===0&&<div style={{textAlign:"center",padding:40,color:"#6b5e52"}}>
            {tenantView==="archived"
              ?<><div style={{fontSize:13,fontWeight:600,marginBottom:6}}>No archived tenants</div><div style={{fontSize:12}}>Move past tenants here when they're fully resolved — SD returned, no disputes.</div></>
              :"No past tenants yet."}
          </div>}
          </>}
        </div></div>
        </>);
      })()}

      {/* ═══ PORTAL MANAGEMENT ═══ */}
      {tab==="portal"&&(()=>{
        const SUPA_URL2=process.env.NEXT_PUBLIC_SUPABASE_URL;
        const SUPA_KEY2=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        // Derive portal status from obStatuses (already polled every 30s)
        const getPortalStatus=(t)=>{
          const email=(t.tenant?.email||"").toLowerCase();
          const ob=obStatuses[email]||null;
          return ob?"linked":"unknown";
        };
        // Tenants with invite info
        const withPortal=allTenants.filter(t=>t.tenant?.email);
        const linked=withPortal.filter(t=>obStatuses[(t.tenant?.email||"").toLowerCase()]);
        const unlinked=withPortal.filter(t=>!obStatuses[(t.tenant?.email||"").toLowerCase()]);

        // Send invite helper
        const sendInvite=async(t)=>{
          setPortalInviteState("sending");
          try{
            const res=await fetch("/api/portal-invite",{method:"POST",headers:{"Content-Type":"application/json"},
              body:JSON.stringify({tenantName:t.tenant.name,tenantEmail:t.tenant.email,propertyName:t.propName,roomName:t.name,rent:t.rent,moveIn:t.tenant.moveIn})
            });
            const d=await res.json();
            if(d.ok){setPortalInviteState("sent");setTimeout(()=>setPortalInviteState("idle"),3000);}
            else setPortalInviteState("idle");
          }catch(e){setPortalInviteState("idle");}
        };

        // If drilling into a specific tenant's portal preview
        if(portalTenant){
          const tRoom=portalTenant;
          const tProp=props.find(p=>allRooms(p).some(r=>r.id===tRoom.id));
          const tUnit=tProp?(tProp.units||[]).find(u=>(u.rooms||[]).some(r=>r.id===tRoom.id)):null;
          const tCharges=tRoom?charges.filter(c=>c.roomId===tRoom.id):[];
          const tMaint=tRoom?maint.filter(m=>m.roomId===tRoom.id):[];
          const submitMaint=()=>{
            if(!maintForm.title.trim()){shakeModal();return;}
            setMaint(p=>[...p,{id:uid(),roomId:tRoom.id,propId:tProp&&tProp.id,tenant:tRoom.tenant.name,title:maintForm.title,desc:maintForm.desc,status:"open",priority:maintForm.priority,created:TODAY.toISOString().split("T")[0],photos:0}]);
            setMaintForm({title:"",desc:"",priority:"medium",submitted:true,titleErr:false});
          };
          const tUtils=tUnit?.utils||tProp?.utils||"allIncluded";
          const tClean=tUnit?.clean||tProp?.clean||"Biweekly";
          const utilDesc=tUtils==="allIncluded"?"All utilities included (electric, water, gas, WiFi)":"Tenant pays utilities — split equally among roommates. WiFi always included.";
          const cleanDesc=tClean==="Weekly"?"Common areas cleaned weekly":"Common areas cleaned biweekly";
          const houseRules=[
            {rule:"No smoking or vaping anywhere on the property, including outdoors"},
            {rule:"No pets allowed"},
            {rule:"No shoes inside — please remove at the door"},
            {rule:"Quiet hours: 10pm to 7am weekdays, 11pm to 10am weekends"},
            {rule:"Clean up after yourself in shared common areas"},
            {rule:"Do not duplicate keys or grant property access to unauthorized guests"},
            {rule:"Parking in designated spots only"},
            {rule:"No open flames, candles, or grills inside"},
          ];
          const ob=obStatuses[(tRoom.tenant?.email||"").toLowerCase()]||{};
          return(<>
            {/* Preview header */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <button className="btn btn-out btn-sm" onClick={()=>{setPortalTenant(null);setPortalTab("home");}}>← Portal Management</button>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:800}}>{tRoom.tenant.name}</div>
                <div style={{fontSize:11,color:"#6b5e52"}}>{tRoom.propName} · {tRoom.name} · Portal Preview</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <div style={{fontSize:10,color:"#6b5e52",background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.07)",borderRadius:6,padding:"4px 10px"}}>
                  Admin preview — read only
                </div>
              </div>
            </div>

            {/* Onboarding status pills */}
            <div className="card" style={{marginBottom:14}}><div className="card-bd">
              <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Onboarding Status (live from portal)</div>
              <div style={{display:"flex",gap:8}}>
                {[["Lease Signed",ob.leaseSigned],["Security Deposit",ob.sdPaid],["First Month Rent",ob.firstMonthPaid],["Move In",ob.leaseSigned&&ob.sdPaid&&ob.firstMonthPaid]].map(([label,done])=>(
                  <div key={label} style={{flex:1,textAlign:"center",padding:"8px 6px",borderRadius:8,background:done?"rgba(74,124,89,.08)":"rgba(0,0,0,.04)",border:done?"1px solid rgba(74,124,89,.2)":"1px solid transparent"}}>
                    <div style={{fontSize:16,marginBottom:4}}>{done?"✓":""}</div>
                    <div style={{fontSize:10,fontWeight:700,color:done?"#4a7c59":"#aaa"}}>{label}</div>
                  </div>
                ))}
              </div>
            </div></div>

            {/* Portal preview */}
            <div style={{background:"#f9f8f5",borderRadius:14,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
              <div style={{background:"#1a1714",padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:800,color:"#f5f0e8"}}>Black Bear Rentals</div>
                  <div style={{fontSize:10,color:"#c4a882",marginTop:2}}>Welcome back, {tRoom.tenant.name.split(" ")[0]}!</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#d4a853"}}>{tRoom.propName}</div>
                  <div style={{fontSize:9,color:"#c4a882"}}>{tRoom.name}</div>
                </div>
              </div>
              <div style={{display:"flex",background:"#fff",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
                {[["home","Home"],["payments","Payments"],["maintenance","Maintenance"],["docs","Documents"],["rules","Rules"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setPortalTab(id)} style={{flex:1,padding:"11px 4px",border:"none",background:portalTab===id?"#faf9f7":"#fff",borderBottom:portalTab===id?"2px solid #d4a853":"2px solid transparent",cursor:"pointer",fontSize:10,fontWeight:portalTab===id?800:500,color:portalTab===id?"#1a1714":"#999",fontFamily:"inherit",transition:"all .15s"}}>
                    {label}
                  </button>
                ))}
              </div>

              {portalTab==="home"&&<div style={{padding:18}}>
                <div className="tp-card">
                  <h3>Your Lease</h3>
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
                {tRoom.tenant.doorCode&&<div className="tp-card" style={{marginTop:10,border:"2px solid rgba(74,124,89,.3)",background:"rgba(74,124,89,.04)"}}>
                  <h3 style={{color:"#4a7c59"}}>Door Access</h3>
                  <div style={{textAlign:"center",padding:"14px 0"}}>
                    <div style={{fontSize:11,color:"#6b5e52",marginBottom:6}}>Your 4-digit door code</div>
                    <div style={{fontSize:40,fontWeight:900,letterSpacing:12,color:"#4a7c59",fontFamily:"monospace"}}>{tRoom.tenant.doorCode}</div>
                    <div style={{fontSize:10,color:"#4a7c59",marginTop:6}}>Works on all exterior doors and your bedroom lock</div>
                  </div>
                </div>}
              </div>}

              {portalTab==="payments"&&<div style={{padding:18}}>
                {tCharges.length===0&&<div style={{textAlign:"center",padding:28,color:"#6b5e52",fontSize:13}}>No charges on file yet.</div>}
                {tCharges.map(c=>{const st=chargeStatus(c);const stColors={paid:"#4a7c59",unpaid:"#3b82f6",pastdue:"#c45c4a",partial:"#d4a853",waived:"#999"};return(
                  <div key={c.id} className="tp-card" style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div><div style={{fontSize:13,fontWeight:700}}>{c.desc||c.category}</div><div style={{fontSize:11,color:"#6b5e52"}}>Due {fmtD(c.dueDate)}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800}}>{fmtS(c.amount)}</div><span style={{fontSize:10,fontWeight:700,color:stColors[st]||"#999"}}>{st}</span></div>
                    </div>
                    {c.amountPaid>0&&c.amountPaid<c.amount&&<div style={{fontSize:11,color:"#6b5e52",marginTop:4}}>{fmtS(c.amountPaid)} paid — {fmtS(c.amount-c.amountPaid)} remaining</div>}
                  </div>
                );})}
                <div className="tp-card" style={{marginTop:10,background:"rgba(74,124,89,.03)",borderColor:"rgba(74,124,89,.12)"}}>
                  <h3 style={{color:"#4a7c59"}}>How to Pay</h3>
                  <div className="tp-row"><span className="tp-label">Zelle</span><span style={{fontWeight:600,fontSize:12}}>{settings.phone||"(850) 696-8101"}</span></div>
                  <div className="tp-row"><span className="tp-label">Venmo</span><span style={{fontWeight:600,fontSize:12}}>@BlackBearRentals</span></div>
                  <div className="tp-row"><span className="tp-label">Check</span><span style={{fontWeight:600,fontSize:12}}>{settings.legalName||"Oak & Main Development LLC"}</span></div>
                  <div style={{marginTop:10,fontSize:10,color:"#6b5e52"}}>Online payments via ACH/card coming soon in the portal.</div>
                </div>
              </div>}

              {portalTab==="maintenance"&&<div style={{padding:18}}>
                <div className="tp-card" style={{marginBottom:14}}>
                  <h3 style={{marginBottom:10}}>Submit a Request</h3>
                  <div className="fld" style={{marginBottom:8}}><label>What is the issue?</label><input value={maintForm.title||""} onChange={e=>setMaintForm(p=>({...p,title:e.target.value,titleErr:false}))} placeholder="e.g. Leaky faucet in bathroom" style={{width:"100%"}}/></div>
                  <div className="fld" style={{marginBottom:8}}><label>Details (optional)</label><textarea value={maintForm.desc||""} onChange={e=>setMaintForm(p=>({...p,desc:e.target.value}))} placeholder="Describe the issue..." rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/></div>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {["low","medium","high"].map(p=><button key={p} onClick={()=>setMaintForm(f=>({...f,priority:p}))} style={{flex:1,padding:"6px",borderRadius:6,border:`1px solid ${maintForm.priority===p?"#d4a853":"rgba(0,0,0,.08)"}`,background:maintForm.priority===p?"rgba(212,168,83,.08)":"#fff",cursor:"pointer",fontSize:10,fontWeight:maintForm.priority===p?700:400,fontFamily:"inherit"}}>{p}</button>)}
                  </div>
                  {maintForm.submitted?<div style={{textAlign:"center",padding:12,color:"#4a7c59",fontWeight:700,fontSize:13}}>Request submitted!</div>:<button className="btn btn-green" style={{width:"100%"}} onClick={submitMaint}>Submit Request</button>}
                </div>
                {tMaint.length>0&&<><div style={{fontSize:11,fontWeight:700,color:"#6b5e52",marginBottom:8}}>YOUR REQUESTS</div>
                  {tMaint.map(r=><div key={r.id} className="tp-card" style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:12,fontWeight:600}}>{r.title}</div><div style={{fontSize:10,color:"#6b5e52"}}>{r.created}</div></div><span className={`badge ${r.status==="resolved"?"b-green":r.status==="in-progress"?"b-gold":"b-red"}`}>{r.status}</span></div></div>)}
                </>}
              </div>}

              {portalTab==="docs"&&<div style={{padding:18}}>
                <div className="tp-card"><h3>Your Documents</h3>
                  {tRoom.tenant.documents&&tRoom.tenant.documents.length>0
                    ?tRoom.tenant.documents.map((d,i)=><div key={d.id||i} className="tp-row"><span className="tp-label">{d.label||d.name}</span><span style={{fontSize:11,color:"#6b5e52"}}>{d.uploaded}</span></div>)
                    :<div style={{color:"#6b5e52",fontSize:12,padding:"8px 0"}}>No documents uploaded yet.</div>}
                </div>
              </div>}

              {portalTab==="rules"&&<div style={{padding:18}}>
                <div className="tp-card"><h3>House Rules</h3>
                  {houseRules.map((r,i)=><div key={i} className="tp-row"><span style={{fontSize:12}}>{r.rule}</span></div>)}
                </div>
                <div className="tp-card" style={{marginTop:10}}><h3>Your Amenities</h3>
                  {[["Utilities",utilDesc],["Cleaning",cleanDesc],["WiFi","Google Fiber — always included"],["Parking","One spot per tenant — first come first served"]].map(([l,v])=><div key={l} className="tp-row"><span className="tp-label">{l}</span><span style={{fontSize:12,fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{v}</span></div>)}
                </div>
                <div className="tp-card" style={{marginTop:10}}><h3>Contact & Emergency</h3>
                  <div className="tp-row"><span className="tp-label">Phone</span><strong>{settings.phone||"(850) 696-8101"}</strong></div>
                  <div className="tp-row"><span className="tp-label">Email</span><strong>{settings.pmEmail||settings.email}</strong></div>
                  <div className="tp-row"><span className="tp-label">Emergency</span><strong>911 — then notify us immediately</strong></div>
                </div>
              </div>}
            </div>
          </>);
        }

        // ── PORTAL MANAGEMENT (default view) ─────────────────────────
        return(<>
          <div className="sec-hd"><div><h2>Portal Management</h2><p>{linked.length} connected · {unlinked.length} not yet linked</p></div></div>

          {/* Summary KPIs */}
          <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:16}}>
            <div className="kpi"><div className="kl">Portal Access</div><div className="kv" style={{color:"#4a7c59"}}>{linked.length}</div><div className="ks">tenants linked</div></div>
            <div className="kpi"><div className="kl">Not Invited</div><div className="kv" style={{color:unlinked.length?"#d4a853":"#4a7c59"}}>{unlinked.length}</div><div className="ks">tenants without access</div></div>
            <div className="kpi"><div className="kl">Total Tenants</div><div className="kv">{allTenants.length}</div><div className="ks">active</div></div>
          </div>

          {/* Not yet invited — action needed */}
          {unlinked.length>0&&<div className="card" style={{marginBottom:14,border:"1px solid rgba(212,168,83,.2)",background:"rgba(212,168,83,.02)"}}><div className="card-bd">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div><div style={{fontSize:13,fontWeight:800,color:"#9a7422"}}>Not Yet Invited ({unlinked.length})</div><div style={{fontSize:11,color:"#6b5e52",marginTop:2}}>These tenants don't have portal access yet.</div></div>
            </div>
            {unlinked.map(t=>(
              <div key={t.id} className="row">
                <div className="row-dot" style={{background:"#d4a853"}}/>
                <div className="row-i">
                  <div className="row-t">{t.tenant.name}</div>
                  <div className="row-s">{roomSubLine(t.propName,t.name)} · {t.tenant.email||"No email on file"}</div>
                </div>
                <button className="btn btn-out btn-sm" onClick={()=>setPortalTenant(t)}>Preview</button>
                {t.tenant.email&&<button className="btn btn-gold btn-sm" onClick={()=>sendInvite(t)} disabled={portalInviteState==="sending"}>
                  {portalInviteState==="sending"?"Sending...":portalInviteState==="sent"?"Sent!":"Send Invite"}
                </button>}
              </div>
            ))}
          </div></div>}

          {/* Linked tenants */}
          {linked.length>0&&<div className="card" style={{marginBottom:14}}><div className="card-bd">
            <div style={{fontSize:13,fontWeight:800,marginBottom:12}}>Portal Active ({linked.length})</div>
            {linked.map(t=>{
              const ob=obStatuses[(t.tenant?.email||"").toLowerCase()]||{};
              const steps=[ob.leaseSigned,ob.sdPaid,ob.firstMonthPaid];
              const doneCount=steps.filter(Boolean).length;
              return(
              <div key={t.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setPortalTenant(t);setPortalTab("home");}}>
                <div className="row-dot" style={{background:"#4a7c59"}}/>
                <div className="row-i">
                  <div className="row-t">{t.tenant.name}</div>
                  <div className="row-s">{roomSubLine(t.propName,t.name)} · {t.tenant.email}</div>
                </div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  {[["Lease",ob.leaseSigned],["SD",ob.sdPaid],["Rent",ob.firstMonthPaid]].map(([label,done])=>(
                    <span key={label} style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,background:done?"rgba(74,124,89,.12)":"rgba(0,0,0,.06)",color:done?"#4a7c59":"#aaa"}}>{done?"✓ ":""}{label}</span>
                  ))}
                </div>
                <span style={{fontSize:10,color:"#4a7c59",fontWeight:600,marginLeft:4}}>Preview →</span>
              </div>);
            })}
          </div></div>}

          {allTenants.length===0&&<div style={{textAlign:"center",padding:48,color:"#6b5e52"}}>
            <div style={{fontSize:40,marginBottom:8}}>🏠</div>
            <div style={{fontWeight:700,marginBottom:4}}>No active tenants</div>
            <div style={{fontSize:12}}>Add tenants from the Tenants tab to get started.</div>
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
        const stBadge={paid:"b-green",unpaid:"b-blue",pastdue:"b-red",partial:"b-gold",waived:"b-gray",voided:"b-gray"};

        return(<>
        {/* Header row — actions */}
        <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:6}}>
          <div style={{display:"flex",gap:3}}>
            {[["mtd","MTD"],["ytd","YTD"],["next","Next Mo"],["all","All"]].map(([k,l])=>(
              <button key={k} className={`btn ${payPeriod===k?"btn-dk":"btn-out"} btn-sm`} style={{fontSize:10}} onClick={()=>setPayPeriod(k)}>{l}</button>
            ))}
          </div>
          <button className="btn btn-gold btn-sm" onClick={openCreateCharge}>+ Charge</button>
          <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"addCredit",roomId:"",amount:0,reason:""})}>+ Credit</button>
          <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"returnSD",roomId:"",deductions:[],returnAmount:0})}>Return Security Deposit</button>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",border:"1px solid rgba(0,0,0,.08)",borderRadius:6,background:"#fff"}}>
            <span style={{fontSize:10,color:"#5c4a3a",fontWeight:600,whiteSpace:"nowrap"}}>Past-due badge</span>
            <div onClick={()=>{const u={...settings,showPayBadge:settings.showPayBadge===false};setSettings(u);save("hq-settings",u);}}
              style={{width:32,height:18,borderRadius:9,background:settings.showPayBadge!==false?"#4a7c59":"rgba(0,0,0,.12)",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:2,left:settings.showPayBadge!==false?14:2,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
            </div>
          </div>
        </div>

        {/* Sub-tabs — matches accounting tab style */}
        <div style={{display:"flex",gap:0,marginBottom:16,position:"relative"}}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"rgba(0,0,0,.08)",zIndex:0}}/>
          {[["overview","Overview"],["charges","Charges"],["deposits","Deposits"]].map(([k,l])=>(
            <button key={k} onClick={()=>{setPaySubTab(k);setExpCharge(null);}}
              onMouseEnter={e=>{if(paySubTab!==k){e.currentTarget.style.background="rgba(255,255,255,.6)";e.currentTarget.style.color="#3c3228";}}}
              onMouseLeave={e=>{if(paySubTab!==k){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#6b5e52";}}}
              style={{padding:"10px 22px",fontSize:13,fontWeight:paySubTab===k?700:500,color:paySubTab===k?"#3c3228":"#6b5e52",background:paySubTab===k?"#fff":"transparent",border:paySubTab===k?"1px solid rgba(0,0,0,.08)":"1px solid transparent",borderBottom:paySubTab===k?"2px solid #fff":"2px solid transparent",borderRadius:"10px 10px 0 0",cursor:"pointer",fontFamily:"inherit",marginBottom:-2,transition:"all .15s",whiteSpace:"nowrap",position:"relative",zIndex:paySubTab===k?3:1}}>
              {l}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {paySubTab==="overview"&&<>
          <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"pastdue"});}}><div className="kl">Past Due</div><div className="kv kb">{fmtS(pastDue.reduce((s,c)=>s+(c.amount-c.amountPaid),0))}</div><div className="ks">{pastDue.length} charge{pastDue.length!==1?"s":""} · {GRACE}d grace applied</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"unpaid"});}}><div className="kl">Unpaid</div><div className="kv" style={{color:"#3b82f6"}}>{fmtS(unpaidCh.reduce((s,c)=>s+c.amount,0))}</div><div className="ks">{unpaidCh.length} charge{unpaidCh.length!==1?"s":""}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:""});}}><div className="kl">All Charges</div><div className="kv">{fmtS(totalCharged)}</div><div className="ks">{pCharges.length} charge{pCharges.length!==1?"s":""}</div></div>
          </div>
          <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,status:"paid"});}}><div className="kl">Collected</div><div className="kv kg">{fmtS(totalPaid)}</div><div className="ks">{paidCh.length} charge{paidCh.length!==1?"s":""}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>setPaySubTab("deposits")}><div className="kl">In Transit</div><div className="kv kw">{fmtS(inTransit)}</div></div>
            <div className="kpi" style={{cursor:"pointer"}} onClick={()=>setPaySubTab("deposits")}><div className="kl">Deposited</div><div className="kv kg">{fmtS(deposited)}</div></div>
          </div>
          <div style={{fontSize:10,color:"#6b5e52",textAlign:"center",marginTop:4,marginBottom:14}}>Showing {periodLabel} · Click any card to drill down</div>

          {/* Quick property breakdown */}
          {m.propBreakdown.map(pr=>{const prCh=pCharges.filter(c=>c.propName===pr.name);const prPaid=prCh.reduce((s,c)=>s+c.amountPaid,0);const prDue=prCh.reduce((s,c)=>s+c.amount,0);return(
            <div key={pr.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setPaySubTab("charges");setPayFilters({...payFilters,property:pr.name});}}>
              <div className="row-i"><div className="row-t">{pr.name}</div><div className="row-s">{allRooms(pr).length} rooms · {pr.occCount} occupied</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800}}>{fmtS(prPaid)}<small style={{color:"#6b5e52"}}> / {fmtS(prDue)}</small></div>
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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:10,color:"#6b5e52"}}>{filteredCharges.length} charge{filteredCharges.length!==1?"s":""} · {periodLabel}</div>
            {payFilters.tenant&&<button className="btn btn-red btn-sm" style={{fontSize:10}} onClick={()=>setModal({type:"clearLedger",tenant:payFilters.tenant,confirm:""})}>Clear Ledger — {payFilters.tenant}</button>}
          </div>

          {(()=>{
            const sorted=filteredCharges.sort((a,b)=>new Date(b.dueDate)-new Date(a.dueDate));
            // Group by month
            const groups=[];const seenMonths=new Set();
            sorted.forEach(c=>{const mk=(c.dueDate||"").slice(0,7);if(!seenMonths.has(mk)){seenMonths.add(mk);const mo=mk?new Date(mk+"-02"):null;groups.push({mk,label:mo?mo.toLocaleString("default",{month:"long",year:"numeric"}):"",charges:[]});}groups.find(g=>g.mk===mk).charges.push(c);});
            return groups.map(({mk,label,charges:grpCharges})=>(
              <div key={mk} style={{marginBottom:8}}>
                {/* Month header */}
                <div style={{padding:"10px 14px 8px",fontSize:12,fontWeight:800,color:"#1a1714",borderBottom:"2px solid rgba(0,0,0,.08)"}}>{label}</div>
                {/* Column headers */}
                <div style={{display:"grid",gridTemplateColumns:"90px 110px 1fr 80px 110px 80px",gap:0,padding:"6px 14px",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,background:"rgba(0,0,0,.02)"}}>
                  <div>Due Date</div><div>Category</div><div>Tenant / Room</div><div>Status</div><div>Deposit</div><div style={{textAlign:"right"}}>Amount</div>
                </div>
                {grpCharges.map(c=>{const st=chargeStatus(c);const lastPay=c.payments.length?c.payments[c.payments.length-1]:null;const isExp=expCharge===c.id;const rem=c.amount-c.amountPaid;const confId=`BB-${c.id.slice(0,8).toUpperCase()}`;
                  // Find tenant room for click-through
                  const tRoom=allTenants.find(t=>t.id===c.roomId);
                  return(
                  <div key={c.id}>
                    <div style={{display:"grid",gridTemplateColumns:"90px 110px 1fr 80px 110px 80px",gap:0,padding:"10px 14px",borderBottom:"1px solid rgba(0,0,0,.04)",cursor:"pointer",background:isExp?"rgba(0,0,0,.02)":"transparent",transition:"background .1s"}} onClick={()=>setExpCharge(isExp?null:c.id)}>
                      <div style={{fontSize:11,fontWeight:600,color:"#3c3228"}}>{fmtD(c.dueDate)}</div>
                      <div style={{display:"flex",alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:"#3c3228"}}>{c.category}</span></div>
                      <div style={{display:"flex",flexDirection:"column",gap:1}}>
                        <button style={{background:"none",border:"none",padding:0,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
                          onClick={e=>{e.stopPropagation();if(tRoom)setModal({type:"tenant",data:tRoom});}}>
                          <div style={{fontSize:11,fontWeight:700,color:tRoom?"#3b82f6":"#3c3228",textDecoration:tRoom?"underline":"none"}}>{c.tenantName}</div>
                        </button>
                        <div style={{fontSize:9,color:"#6b5e52"}}>{roomSubLine(c.propName,c.roomName)}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center"}}><span className={`badge ${stBadge[st]}`} style={{fontSize:8}}>{st}</span></div>
                      <div style={{display:"flex",alignItems:"center"}}>{lastPay&&lastPay.depositDate?<div><div style={{fontSize:10,fontWeight:600}}>{fmtD(lastPay.depositDate)}</div><div style={{fontSize:8,color:"#6b5e52"}}>{lastPay.method||"—"}</div><div style={{fontSize:8,color:"#4a7c59"}}>Due: $0.00</div></div>:lastPay&&lastPay.depositStatus==="transit"?<span style={{fontSize:9,color:"#d4a853",fontWeight:600}}>In transit</span>:<span style={{fontSize:9,color:"#aaa"}}>—</span>}</div>
                      <div style={{textAlign:"right",fontWeight:800,fontSize:13,color:st==="paid"?"#4a7c59":st==="pastdue"?"#c45c4a":"#1a1714",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6}}>
                        <span>{fmtS(c.amount)}</span>
                        <span style={{fontSize:10,color:"#6b5e52",fontWeight:400}}>{isExp?"∧":"∨"}</span>
                      </div>
                    </div>
              {/* Expanded detail */}
              {isExp&&<div style={{padding:"16px 20px",background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.04)",animation:"fadeIn .15s"}}>
                {/* Description + reminder history */}
                <div style={{marginBottom:12,fontSize:12}}>
                  <span style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>Description: </span>
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
                      <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Payment #{pConfId.slice(-6)}</div>
                      <div style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>{c.tenantName}</div>
                      <div style={{fontSize:10,color:"#6b5e52",marginTop:2}}>Paid on {fmtD(p.date)}</div>
                      {p.method&&<div style={{fontSize:10,color:"#5c4a3a",marginTop:2}}>via {p.method}</div>}
                      {p.notes&&<div style={{fontSize:9,color:"#6b5e52",marginTop:2,fontStyle:"italic"}}>{p.notes}</div>}
                    </div>
                    {/* Middle: status timeline */}
                    <div style={{flex:1}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Status:</div>
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
                            {step.date&&<div style={{fontSize:9,color:"#6b5e52"}}>{step.date}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Right: amount + download */}
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:16,fontWeight:800,color:"#1a1714",marginBottom:6}}>{fmtS(p.amount)}</div>
                      <button className="btn btn-out btn-sm" style={{fontSize:10}} onClick={e=>{e.stopPropagation();printP();}}>PDF</button>
                    </div>
                  </div>);
                })}

                {/* Actions — full matrix based on status and payment method */}
                {(()=>{
                  const paidViaAch=st==="paid"&&c.payments.some(p=>ACH_METHODS.includes(p.method));
                  const paidViaManual=st==="paid"&&!paidViaAch;
                  return(
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                    {/* Record payment — unpaid/partial/pastdue only */}
                    {(st==="unpaid"||st==="partial"||st==="pastdue")&&<button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});}}>Record Payment</button>}
                    {/* Reminder — unpaid/partial/pastdue only */}
                    {(st==="unpaid"||st==="partial"||st==="pastdue")&&<button className="btn btn-dk btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"sendReminder",charge:c,tenantName:c.tenantName,rem,method:null});}}>Reminder</button>}
                    {/* Edit — not voided/waived/ACH-paid */}
                    {st!=="voided"&&st!=="waived"&&!paidViaAch&&<button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"editCharge",charge:{...c},isPaid:paidViaManual,editReason:"",editNote:""});}}>{paidViaManual?"Edit (reason req.)":"Edit"}</button>}
                    {/* Void — anything not already voided or waived */}
                    {st!=="voided"&&st!=="waived"&&<button className="btn btn-out btn-sm" style={{color:"#9a7422"}} onClick={e=>{e.stopPropagation();setModal({type:"voidCharge",chargeId:c.id,tenantName:c.tenantName,category:c.category,desc:c.desc,amount:c.amount,voidReason:""});}}>Void</button>}
                    {/* Delete — only unpaid charges (no payment ever recorded) */}
                    {(st==="unpaid"||st==="pastdue")&&c.payments.length===0&&<button className="btn btn-out btn-sm" style={{color:"#c45c4a"}} onClick={e=>{e.stopPropagation();setModal({type:"deleteCharge",chargeId:c.id,tenantName:c.tenantName,category:c.category,desc:c.desc});}}>Delete</button>}
                    {/* Waive late fees — pastdue only */}
                    {st==="pastdue"&&<button className="btn btn-out btn-sm" onClick={e=>{e.stopPropagation();setModal({type:"waiveCharge",chargeId:c.id,reason:""});}}>Waive</button>}
                  </div>);
                })()}

                {st==="waived"&&<div style={{background:"rgba(0,0,0,.03)",borderRadius:6,padding:8,fontSize:11,color:"#6b5e52",marginTop:8}}>Waived{c.waivedReason?`: ${c.waivedReason}`:""}</div>}
                {st==="voided"&&<div style={{background:"rgba(196,92,74,.04)",border:"1px solid rgba(196,92,74,.12)",borderRadius:6,padding:"10px 12px",fontSize:11,marginTop:8}}>
                  <div style={{fontWeight:700,color:"#c45c4a",marginBottom:4}}>Voided {c.voidedDate?`on ${fmtD(c.voidedDate)}`:""}</div>
                  <div style={{color:"#5c4a3a"}}>{c.voidedReason||"No reason recorded"}</div>
                </div>}
              </div>}
                  </div>);})}
              </div>
            ));
          })()}
          {filteredCharges.length===0&&<div style={{textAlign:"center",padding:24,color:"#6b5e52"}}>No charges match your filters</div>}
        </>}

        {/* ── Deposits ── */}
        {paySubTab==="deposits"&&(()=>{
          const allPays=charges.flatMap(c=>c.payments.map(p=>({...p,chargeId:c.id,tenantName:c.tenantName,propName:c.propName,roomName:c.roomName,category:c.category,chargeDueDate:c.dueDate,roomId:c.roomId})));
          const transit=allPays.filter(p=>p.depositStatus==="transit");
          const deposited=allPays.filter(p=>p.depositStatus==="deposited"||(!p.depositStatus&&p.depositDate));

          // Period date range from top buttons
          const now=TODAY;
          const periodFrom=payPeriod==="mtd"?new Date(now.getFullYear(),now.getMonth(),1).toISOString().split("T")[0]
            :payPeriod==="ytd"?`${now.getFullYear()}-01-01`
            :payPeriod==="next"?now.toISOString().split("T")[0]
            :null;
          const periodTo=payPeriod==="next"?new Date(now.getFullYear(),now.getMonth()+2,0).toISOString().split("T")[0]:null;

          let filtered=[...deposited].sort((a,b)=>new Date(b.depositDate||b.date)-new Date(a.depositDate||a.date));
          if(periodFrom)filtered=filtered.filter(p=>(p.depositDate||p.date)>=periodFrom);
          if(periodTo)filtered=filtered.filter(p=>(p.depositDate||p.date)<=periodTo);
          if(depFilters.property)filtered=filtered.filter(p=>p.propName===depFilters.property);
          if(depFilters.tenant)filtered=filtered.filter(p=>p.tenantName===depFilters.tenant);

          const months={};
          filtered.forEach(p=>{const d=new Date((p.depositDate||p.date)+"T00:00:00");const mk=`${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}`;const label=d.toLocaleString("default",{month:"long",year:"numeric"});if(!months[mk])months[mk]={label,key:mk,items:[],total:0};months[mk].items.push(p);months[mk].total+=p.amount;});
          const monthKeys=Object.keys(months).sort().reverse();

          const totalTransit=transit.reduce((s,p)=>s+p.amount,0);
          const totalDeposited=filtered.reduce((s,p)=>s+p.amount,0);
          const sdTenants=occLeases;
          const totalSD=sdTenants.reduce((s,r)=>{const sd=sdLedger.find(x=>x.roomId===r.id);return s+((sd&&sd.amountHeld)||r.rent);},0);

          const COL="120px 110px 1fr 160px 90px";

          return(<>
          {/* KPI cards — clickable filters */}
          <div style={{marginBottom:16}}>
            <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:6}}>
              {[
                {key:"transit",label:"In Transit",val:fmtS(totalTransit),sub:transit.length+" pending",color:"#d4a853"},
                {key:"deposited",label:"Deposited",val:fmtS(totalDeposited),sub:filtered.length+" deposits",color:"#4a7c59"},
                {key:"sd",label:"Security Deposit Held",val:fmtS(totalSD),sub:sdTenants.length+" tenants · Redstone FCU",color:"#4a7c59"},
              ].map(({key,label,val,sub,color})=>{
                const active=depFilters.view===key;
                return(
                <div key={key} className="kpi" onClick={()=>setDepFilters(f=>({...f,view:active?"":key}))}
                  style={{cursor:"pointer",outline:active?`2px solid ${color}`:"2px solid transparent",outlineOffset:2,transition:"outline .15s",userSelect:"none"}}>
                  <div className="kl">{label}</div>
                  <div className="kv" style={{color}}>{val}</div>
                  <div className="ks">{sub}</div>
                  {active&&<div style={{fontSize:9,fontWeight:700,color,marginTop:4,textTransform:"uppercase",letterSpacing:.5}}>Filtered — click to clear</div>}
                </div>);
              })}
            </div>
            {depFilters.view&&<div style={{display:"flex",justifyContent:"flex-end"}}>
              <button onClick={()=>setDepFilters(f=>({...f,view:""}))}
                style={{fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:4,border:"1px solid rgba(0,0,0,.1)",background:"rgba(0,0,0,.04)",color:"#5c4a3a",cursor:"pointer",fontFamily:"inherit"}}>
                Show All ✕
              </button>
            </div>}
          </div>

          {/* Filter bar */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
            <select value={depFilters.property||""} onChange={e=>setDepFilters(f=>({...f,property:e.target.value}))} style={{padding:"5px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",background:"#fff"}}>
              <option value="">All Properties</option>{props.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
            <select value={depFilters.tenant||""} onChange={e=>setDepFilters(f=>({...f,tenant:e.target.value}))} style={{padding:"5px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit",background:"#fff"}}>
              <option value="">All Tenants</option>{[...new Set(deposited.map(p=>p.tenantName))].sort().map(n=><option key={n} value={n}>{n}</option>)}
            </select>
            {(depFilters.property||depFilters.tenant)&&<button className="btn btn-out btn-sm" onClick={()=>setDepFilters(f=>({...f,property:"",tenant:""}))}>Reset</button>}
          </div>

          {/* ── In Transit section ── */}
          {((!depFilters.view||depFilters.view==="transit"))&&transit.length>0&&<>
            <div style={{fontSize:13,fontWeight:800,color:"#1a1714",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
              In Transit <span style={{fontSize:11,fontWeight:500,color:"#6b5e52"}}>({transit.length} payment{transit.length!==1?"s":""} waiting to clear)</span>
            </div>
            <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",marginBottom:20,overflow:"hidden"}}>
              {/* Col headers */}
              <div style={{display:"grid",gridTemplateColumns:COL,padding:"8px 16px",background:"rgba(0,0,0,.02)",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>
                <div>Deposit Date</div><div>Date Paid</div><div>Tenant / Room</div><div>Bank Account</div><div style={{textAlign:"right"}}>Amount</div>
              </div>
              {transit.map(p=>(
                <div key={p.id} style={{display:"grid",gridTemplateColumns:COL,padding:"12px 16px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center"}}>
                  <div><span style={{fontSize:11,fontWeight:700,color:"#d4a853"}}>In Transit</span><div style={{fontSize:9,color:"#6b5e52"}}>Est. {fmtD(p.date)}</div></div>
                  <div style={{fontSize:11}}>{fmtD(p.date)}</div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700}}>{p.tenantName}</div>
                    <div style={{fontSize:9,color:"#6b5e52"}}>{roomSubLine(p.propName,p.roomName)}</div>
                  </div>
                  <div><div style={{fontSize:11}}>Redstone FCU</div><div style={{fontSize:9,color:"#6b5e52"}}>{p.method}</div></div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8}}>
                    <span style={{fontSize:13,fontWeight:800,color:"#d4a853"}}>{fmtS(p.amount)}</span>
                    <button className="btn btn-green btn-sm" style={{fontSize:9,whiteSpace:"nowrap"}} onClick={()=>setCharges(prev=>prev.map(c=>({...c,payments:c.payments.map(pp=>pp.id===p.id?{...pp,depositStatus:"deposited",depositDate:TODAY.toISOString().split("T")[0]}:pp)})))}>Mark Deposited</button>
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* ── Deposit Ledger section ── */}
          {(!depFilters.view||depFilters.view==="deposited")&&<>
            <div style={{fontSize:13,fontWeight:800,color:"#1a1714",marginBottom:8}}>Deposit Ledger</div>
            <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",marginBottom:20,overflow:"hidden"}}>
              {monthKeys.length===0&&<div style={{textAlign:"center",padding:40,color:"#6b5e52",fontSize:12}}>No deposits in this period.</div>}
              {monthKeys.map(mk=>{const mo=months[mk];return(
                <div key={mk}>
                  <div style={{padding:"10px 16px",background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:2}}>
                    <div style={{fontSize:13,fontWeight:800}}>{mo.label}</div>
                    <div style={{fontSize:13,fontWeight:800,color:"#4a7c59"}}>{fmtS(mo.total)} <span style={{fontSize:10,fontWeight:500,color:"#6b5e52"}}>({mo.items.length})</span></div>
                  </div>
                  {/* Col headers */}
                  <div style={{display:"grid",gridTemplateColumns:COL,padding:"6px 16px",background:"rgba(0,0,0,.02)",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>
                    <div>Deposit Date</div><div>Date Paid</div><div>Tenant / Room</div><div>Bank Account</div><div style={{textAlign:"right"}}>Amount</div>
                  </div>
                  {mo.items.map(p=>{
                    const isExp=expCharge===("dep-"+p.id);
                    const tRoom=allTenants.find(t=>t.id===p.roomId);
                    const tLease=leases.find(l=>l.tenantEmail===tRoom?.tenant?.email||l.tenantName===tRoom?.tenant?.name);
                    const confId=p.confId||`BB-${(p.chargeId||"").slice(0,6).toUpperCase()}-${Date.now().toString(36).slice(-3).toUpperCase()}`;
                    return(
                    <div key={p.id}>
                      <div style={{display:"grid",gridTemplateColumns:COL,padding:"12px 16px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center",cursor:"pointer",background:isExp?"rgba(0,0,0,.02)":"#fff",transition:"background .1s"}}
                        onClick={()=>setExpCharge(isExp?null:"dep-"+p.id)}>
                        <div style={{fontSize:11,fontWeight:600}}>{fmtD(p.depositDate||p.date)}</div>
                        <div style={{fontSize:11}}>{fmtD(p.date)}</div>
                        <div>
                          <button style={{background:"none",border:"none",padding:0,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
                            onClick={e=>{e.stopPropagation();if(tRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:tRoom});}}}>
                            <div style={{fontSize:11,fontWeight:700,color:tRoom?"#3b82f6":"#3c3228",textDecoration:tRoom?"underline":"none"}}>{p.tenantName}</div>
                          </button>
                          <div style={{fontSize:9,color:"#6b5e52"}}>{roomSubLine(p.propName,p.roomName)}</div>
                        </div>
                        <div><div style={{fontSize:11,fontWeight:600}}>Redstone FCU</div><div style={{fontSize:9,color:"#6b5e52"}}>{p.method}</div></div>
                        <div style={{textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6}}>
                          <span style={{fontSize:13,fontWeight:800,color:"#4a7c59"}}>{fmtS(p.amount)}</span>
                          <span style={{fontSize:10,color:"#6b5e52"}}>{isExp?"∧":"∨"}</span>
                        </div>
                      </div>
                      {/* Expanded detail */}
                      {isExp&&<div style={{padding:"16px 20px",background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.04)"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                          <div style={{background:"#fff",borderRadius:8,padding:"10px 14px"}}>
                            <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Payment ID</div>
                            <div style={{fontSize:11,fontFamily:"monospace",fontWeight:700}}>{confId}</div>
                          </div>
                          <div style={{background:"#fff",borderRadius:8,padding:"10px 14px"}}>
                            <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Method</div>
                            <div style={{fontSize:12,fontWeight:600}}>{p.method}</div>
                          </div>
                          <div style={{background:"#fff",borderRadius:8,padding:"10px 14px"}}>
                            <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Status</div>
                            <div style={{fontSize:11,fontWeight:700,color:"#4a7c59"}}>Deposited {fmtD(p.depositDate||p.date)}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          {tLease&&<button className="btn btn-out btn-sm" onClick={()=>{setViewingLease({lease:tLease,room:tRoom||null});}}>View Lease →</button>}
                          {tRoom&&<button className="btn btn-out btn-sm" onClick={()=>{setTenantProfileTab("payments");setModal({type:"tenant",data:tRoom});}}>Tenant Payments →</button>}
                          <button className="btn btn-out btn-sm" onClick={()=>{
                            const w=window.open("","_blank");
                            w.document.write(`<!DOCTYPE html><html><head><title>Receipt ${confId}</title><style>body{font-family:Georgia,serif;max-width:560px;margin:40px auto;padding:0 24px;color:#1a1714;line-height:1.6}h1{font-size:20px;font-weight:700;border-bottom:2px solid #1a1714;padding-bottom:8px;margin-bottom:20px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}.label{color:#666}.value{font-weight:600}.total{display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:800;border-top:2px solid #1a1714;margin-top:4px}.conf{font-family:monospace;font-size:18px;font-weight:900;text-align:center;padding:12px;background:#f5f0e8;border-radius:6px;margin:16px 0}.footer{margin-top:32px;font-size:11px;color:#999;text-align:center}</style></head><body><h1>Payment Receipt</h1><div class="conf">${confId}</div><div class="row"><span class="label">Date Paid</span><span class="value">${p.date}</span></div><div class="row"><span class="label">Deposit Date</span><span class="value">${p.depositDate||p.date}</span></div><div class="row"><span class="label">Tenant</span><span class="value">${p.tenantName}</span></div><div class="row"><span class="label">Property</span><span class="value">${p.propName} · ${p.roomName}</span></div><div class="row"><span class="label">Method</span><span class="value">${p.method}</span></div><div class="total"><span>Amount</span><span>$${Number(p.amount).toLocaleString()}</span></div><div class="footer">Oak &amp; Main Development LLC · Black Bear Rentals · blackbearhousing@gmail.com</div></body></html>`);
                            w.document.close();w.print();
                          }}>PDF Receipt</button>
                        </div>
                      </div>}
                    </div>);
                  })}
                </div>
              );})}
            </div>
          </>}

          {/* ── Security Deposits section ── */}
          {(!depFilters.view||depFilters.view==="sd")&&<>
            <div style={{fontSize:13,fontWeight:800,color:"#1a1714",marginBottom:8}}>Security Deposits Held — Redstone FCU</div>
            <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",overflow:"hidden",marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 120px 140px 140px 100px",padding:"8px 16px",background:"rgba(0,0,0,.02)",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>
                <div>Tenant</div><div>Property</div><div>Room</div><div>Lease End</div><div style={{textAlign:"right"}}>Security Deposit</div>
              </div>
              {sdTenants.length===0&&<div style={{textAlign:"center",padding:24,color:"#6b5e52",fontSize:12}}>No security deposits on file.</div>}
              {sdTenants.map(r=>{const sd=sdLedger.find(x=>x.roomId===r.id);const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;return(
                <div key={r.id} style={{display:"grid",gridTemplateColumns:"1fr 120px 140px 140px 100px",padding:"11px 16px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center"}}>
                  <div style={{fontSize:12,fontWeight:700}}>{r.tenant.name}</div>
                  <div style={{fontSize:11,color:"#5c4a3a"}}>{r.propName}</div>
                  <div style={{fontSize:11,color:"#5c4a3a"}}>{r.name}</div>
                  <div style={{fontSize:11,color:dl&&dl<=30?"#c45c4a":dl&&dl<=90?"#d4a853":"#5c4a3a"}}>{r.le?`${fmtD(r.le)}${dl&&dl<=90?` (${dl}d)`:""}` :"—"}</div>
                  <div style={{fontSize:13,fontWeight:800,color:"#4a7c59",textAlign:"right"}}>{fmtS((sd&&sd.amountHeld)||r.rent)}</div>
                </div>
              );})}
              {sdTenants.length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 120px 140px 140px 100px",padding:"10px 16px",borderTop:"2px solid rgba(0,0,0,.07)",background:"rgba(0,0,0,.02)"}}>
                <div style={{fontSize:12,fontWeight:800,gridColumn:"1/5"}}>Total Held</div>
                <div style={{fontSize:14,fontWeight:800,color:"#4a7c59",textAlign:"right"}}>{fmtS(totalSD)}</div>
              </div>}
            </div>

            {/* SD Returns */}
            {sdLedger.filter(s=>s.returned).length>0&&<>
              <div style={{fontSize:13,fontWeight:800,color:"#1a1714",marginBottom:8}}>Security Deposit Returns</div>
              {sdLedger.map(s=>(
                <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",background:"#fff",borderRadius:8,marginBottom:6,border:"1px solid rgba(0,0,0,.06)"}}>
                  <div><div style={{fontSize:12,fontWeight:700}}>{s.tenantName}</div><div style={{fontSize:10,color:"#6b5e52"}}>{s.propName} · {s.roomName} · Held {fmtS(s.amountHeld)} · Deducted {fmtS(s.amountHeld-s.returned)} · Returned {fmtD(s.returnDate)}</div></div>
                  <div style={{fontSize:14,fontWeight:800,color:"#4a7c59"}}>{fmtS(s.returned)}</div>
                </div>
              ))}
            </>}
          </>}
          </>);
        })()}
        </>);
      })()}

      {/* ═══ APPLICATIONS ═══ */}
      {tab==="applications"&&(()=>{
        const STAGES=["new-lead","applied","approved","onboarding"];
        const SL={"new-lead":"New Lead","pre-screened":"New Lead","called":"New Lead","invited":"New Lead","applied":"Applied","reviewing":"Applied","approved":"Approved","onboarding":"Onboarding","denied":"Denied"};
        const SC2={"new-lead":"b-blue","pre-screened":"b-blue","called":"b-blue","invited":"b-blue","applied":"b-gold","reviewing":"b-gold","approved":"b-green","onboarding":"b-green","denied":"b-red"};
        const SI2={};
        const moveApp=(id,ns)=>{
          setApps(p=>p.map(a=>{if(a.id!==id)return a;return{...a,status:ns,lastContact:TODAY.toISOString().split("T")[0],prevStage:a.status,history:[...(a.history||[]),{from:a.status,to:ns,date:TODAY.toISOString().split("T")[0]}]};}));
          if(ns==="approved"){
            const app=apps.find(a=>a.id===id);
            if(app?.email){
              fetch("/api/portal-invite",{method:"POST",headers:{"Content-Type":"application/json"},
                body:JSON.stringify({tenantName:app.name,tenantEmail:app.email,propertyName:app.property,roomName:app.room,rent:app.negotiatedRent||app.rent,moveIn:app.termMoveIn||app.moveIn})
              }).then(r=>r.json()).then(d=>{if(d.ok)console.log("Portal invite auto-sent to",app.email);}).catch(console.error);
            }
          }
        };
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
        // All active (non-denied) apps — search only within pipeline
        const allActiveApps=apps.filter(a=>a.status!=="denied");
        const staleApps=allActiveApps.filter(a=>daysSince(a.lastContact||a.submitted)>=3&&!["approved","onboarding"].includes(a.status));
        const needsActionApps=allActiveApps.filter(a=>a.status==="applied");
        const deniedApps=apps.filter(a=>a.status==="denied");
        // Apply KPI filter + search
        const activeApps=(()=>{
          let base=appKpiFilter==="needsAction"?needsActionApps
            :appKpiFilter==="stale"?staleApps
            :appKpiFilter==="denied"?deniedApps
            :allActiveApps;
          if(appSearch)base=base.filter(a=>[a.name,a.email,a.phone,a.property,a.source].some(v=>(v||"").toLowerCase().includes(appSearch.toLowerCase())));
          return base;
        })();
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
          if(visible.length===0)return null;
          const dismissOne=(id)=>{const next=[...dismissedFollowUps,id];setDismissedFollowUps(next);save("hq-dismissed-followups",next);};
          const dismissAll=()=>{const next=[...dismissedFollowUps,...visible.map(a=>a.id)];setDismissedFollowUps(next);save("hq-dismissed-followups",next);};
          return(<div style={{background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:12,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:expanded.followUp!==false?6:0}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>Follow Up ({visible.length})</div>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setExpanded(p=>({...p,followUp:p.followUp===false?true:false}))}>{expanded.followUp===false?"Show":"Minimize"}</button>
                <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={dismissAll}>Dismiss All</button>
              </div>
            </div>
            {expanded.followUp!==false&&visible.map(a=>(
              <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",fontSize:11,borderBottom:"1px solid rgba(0,0,0,.05)"}}>
                <span><strong>{a.name}</strong> — {SL[a.status]} · <span style={{color:daysSince(a.lastContact||a.submitted)>=5?"#c45c4a":"#5c4a3a",fontWeight:700}}>{daysSince(a.lastContact||a.submitted)}d</span></span>
                <div style={{display:"flex",gap:4}}>
                  <button className="btn btn-out btn-sm" style={{fontSize:8}} onClick={()=>setModal({type:"app",data:a})}>Open</button>
                  <button className="btn btn-out btn-sm" style={{fontSize:8,color:"#c45c4a",padding:"4px 7px",borderColor:"rgba(196,92,74,.2)"}} title="Permanently dismiss" onClick={()=>dismissOne(a.id)}>x</button>
                </div>
              </div>
            ))}
          </div>);
        })()}

        {/* KPIs — clickable filters */}
        <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,flex:1}}>
            {[
              {key:null,label:"Pipeline",value:allActiveApps.length,sub:"All active",color:null},
              {key:"needsAction",label:"Needs Action",value:needsActionApps.length,sub:"Applied — awaiting review",color:needsActionApps.length?"#c45c4a":"#4a7c59"},
              {key:"stale",label:"Follow Up",value:staleApps.length,sub:"No contact 3+ days",color:staleApps.length?"#d4a853":null},
              {key:"denied",label:"Denied",value:deniedApps.length,sub:"All time",color:null},
            ].map(({key,label,value,sub,color})=>{
              const active=appKpiFilter===key;
              return(
              <div key={label}
                onClick={()=>setAppKpiFilter(appKpiFilter===key?null:key)}
                onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(0,0,0,.04)";e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 3px 10px rgba(0,0,0,.08)";}}}
                onMouseLeave={e=>{if(!active){e.currentTarget.style.background="#fff";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}}
                style={{background:active?`rgba(${settings.adminAccentRgb||"74,124,89"},.08)`:"#fff",borderRadius:10,padding:"12px 14px",border:active?`2px solid ${settings.adminAccent||"#4a7c59"}`:"1px solid rgba(0,0,0,.07)",cursor:"pointer",transition:"all .15s",boxShadow:active?`0 3px 12px rgba(${settings.adminAccentRgb||"74,124,89"},.15)`:"none"}}>
                <div style={{fontSize:10,fontWeight:700,color:active?(settings.adminAccent||"#4a7c59"):"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>{label}</div>
                <div style={{fontSize:24,fontWeight:800,color:active?(settings.adminAccent||"#4a7c59"):(color||"#1a1714"),lineHeight:1,marginBottom:3}}>{value}</div>
                <div style={{fontSize:9,color:active?(settings.adminAccent||"#4a7c59"):"#7a7067"}}>{sub}</div>
              </div>);
            })}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",border:"1px solid rgba(0,0,0,.08)",borderRadius:6,background:"#fff",flexShrink:0}}>
            <span style={{fontSize:10,color:"#5c4a3a",fontWeight:600,whiteSpace:"nowrap"}}>Badge</span>
            <div onClick={()=>{const u={...settings,showAppBadge:settings.showAppBadge===false};setSettings(u);save("hq-settings",u);}}
              style={{width:32,height:18,borderRadius:9,background:settings.showAppBadge!==false?"#4a7c59":"rgba(0,0,0,.12)",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:2,left:settings.showAppBadge!==false?14:2,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
            </div>
          </div>
        </div>
        {/* Search + Controls */}
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
          <input value={appSearch} onChange={e=>setAppSearch(e.target.value)} placeholder="Search pipeline..." style={{flex:1,minWidth:160,padding:"7px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}/>
          {appKpiFilter&&<button className="btn btn-out btn-sm" style={{color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>setAppKpiFilter(null)}>✕ Clear filter</button>}
          {[{v:"pipeline",l:"Pipeline"},{v:"list",l:"List"}].map(b=><button key={b.v} className={`btn ${appView===b.v?"btn-dk":"btn-out"} btn-sm`} onClick={()=>setAppView(b.v)}>{b.l}</button>)}
          <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"addLead",name:"",phone:"",email:"",property:"",notes:"",source:"Phone / Direct Call"})}>+ Add Lead</button>
        </div>

        {/* ── Link bar ── */}
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"stretch"}}>

          {/* Apply Link */}
          {(()=>{
            const AB={padding:"8px 14px",border:"none",background:"transparent",fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background .15s",color:"#5c4a3a"};
            return(
            <div style={{display:"flex",flexDirection:"column",gap:2,flex:1,minWidth:240}}>
              <div style={{display:"flex",alignItems:"center",background:"#fff",border:"1px solid rgba(0,0,0,.1)",borderRadius:8,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRight:"1px solid rgba(0,0,0,.08)",flex:1,minWidth:0}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" style={{flexShrink:0}}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  <span style={{fontSize:11,color:"#5c4a3a",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(settings.siteUrl||"https://rentblackbear.com")}/apply</span>
                </div>
                <button style={{...AB,borderRight:"1px solid rgba(0,0,0,.08)"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  onClick={()=>{navigator.clipboard.writeText(`${settings.siteUrl||"https://rentblackbear.com"}/apply`);setModal({type:"genericLinkCopied"});}}>Copy</button>
                <button style={AB}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  onClick={()=>setModal({type:"emailApplyLink",to:"",name:""})}>Email Link</button>
              </div>
              <div style={{fontSize:9,color:"#7a7067",paddingLeft:4}}>Application form — anyone can apply</div>
            </div>);
          })()}

          {/* Portal Invite */}
          <div style={{display:"flex",flexDirection:"column",gap:2,flex:1,minWidth:240}}>
            <div style={{display:"flex",alignItems:"center",background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRight:"1px solid rgba(74,124,89,.15)",flex:1,minWidth:0}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" style={{flexShrink:0}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span style={{fontSize:11,color:"#4a7c59",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {portalLinkToken?`${(settings.siteUrl||"https://rentblackbear.com")}/portal?token=${portalLinkToken.slice(0,12)}...`:"Portal invite — click Generate"}
                </span>
              </div>
              {!portalLinkToken&&<button style={{padding:"8px 16px",border:"none",background:"rgba(74,124,89,.1)",color:"#4a7c59",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(74,124,89,.2)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(74,124,89,.1)"}
                onClick={async()=>{
                  if(portalLinkLoading)return;
                  setPortalLinkLoading(true);
                  try{
                    const res=await fetch("/api/portal-invite-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});
                    const d=await res.json();
                    if(d.token){
                      setPortalLinkToken(d.token);
                      navigator.clipboard.writeText(`${settings.siteUrl||"https://rentblackbear.com"}/portal?token=${d.token}`);
                    }
                  }catch(e){console.error(e);}
                  setPortalLinkLoading(false);
                }}>{portalLinkLoading?"Generating...":"Generate"}</button>}
              {portalLinkToken&&<>
                <button style={{padding:"8px 14px",border:"none",borderRight:"1px solid rgba(74,124,89,.15)",background:"transparent",color:"#4a7c59",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(74,124,89,.08)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  onClick={()=>{navigator.clipboard.writeText(`${settings.siteUrl||"https://rentblackbear.com"}/portal?token=${portalLinkToken}`);setModal({type:"genericLinkCopied"});}}>Copy</button>
                <button style={{padding:"8px 14px",border:"none",borderRight:"1px solid rgba(74,124,89,.15)",background:"transparent",color:"#4a7c59",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"background .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(74,124,89,.08)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  onClick={()=>setModal({type:"emailPortalLink",to:"",name:"",token:portalLinkToken})}>Email Link</button>
                <button style={{padding:"8px 10px",border:"none",background:"transparent",color:"#8a7d74",fontSize:10,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}
                  title="Generate a new link"
                  onClick={async()=>{
                    setPortalLinkToken(null);setPortalLinkLoading(true);
                    try{const res=await fetch("/api/portal-invite-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});const d=await res.json();if(d.token){setPortalLinkToken(d.token);navigator.clipboard.writeText(`${settings.siteUrl||"https://rentblackbear.com"}/portal?token=${d.token}`);}}catch(e){console.error(e);}
                    setPortalLinkLoading(false);
                  }}>↺</button>
              </>}
            </div>
            <div style={{fontSize:9,color:"#7a7067",paddingLeft:4}}>
              {portalLinkToken?"Copied to clipboard — expires in 48 hours":"Portal access — bypasses application"}
            </div>
          </div>
        </div>

        {/* Bulk invite bar */}
        {(appView==="pipeline"||appView==="list")&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:bulkSel.length?"rgba(212,168,83,.08)":"rgba(0,0,0,.02)",borderRadius:8,marginBottom:10,border:bulkSel.length?"1px solid rgba(212,168,83,.2)":"1px solid transparent",transition:"all .2s",flexWrap:"wrap"}}>
          <input type="checkbox" checked={bulkSel.length>0&&bulkSel.length===activeApps.length} onChange={e=>{setBulkSel(e.target.checked?activeApps.map(a=>a.id):[]);}} style={{width:14,height:14,cursor:"pointer"}}/>
          <span style={{fontSize:11,color:"#6b5e52",flex:1,minWidth:80}}>{bulkSel.length>0?`${bulkSel.length} selected`:"Select applicants"}</span>
          {bulkSel.length>0&&<>
            {(()=>{
              const invitable=activeApps.filter(a=>bulkSel.includes(a.id)&&a.status==="new-lead");
              const reinvitable=activeApps.filter(a=>bulkSel.includes(a.id)&&a.status==="invited");
              return(<>
                {invitable.length>0&&<button className="btn btn-gold btn-sm"
                  onClick={()=>{
                    if(invitable.length===1){setModal({type:"inviteApp",data:invitable[0]});}
                    else{setModal({type:"bulkInvite",ids:bulkSel});}
                  }}>
                  Invite ({invitable.length})
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
                  Reinvite ({reinvitable.length})
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
            <button className="btn btn-out btn-sm" onClick={()=>setBulkSel([])}>Clear</button>
          </>}
        </div>}

        {/* Pipeline */}
        {appView==="pipeline"&&<div className="pipeline">
          {STAGES.map(function(stage,si){
            // Onboarding column shows approved+onboarding; approved column shows approved only
            var sa=stage==="onboarding"
              ?activeApps.filter(function(a){return a.status==="onboarding";})
              :stage==="approved"
              ?activeApps.filter(function(a){return a.status==="approved";})
              :stage==="new-lead"
              ?activeApps.filter(function(a){return["new-lead","pre-screened","called","invited"].includes(a.status);})
              :stage==="applied"
              ?activeApps.filter(function(a){return["applied","reviewing"].includes(a.status);})
              :activeApps.filter(function(a){return a.status===stage;});
            return(
            <div key={stage} className="pipe-col">
              <div className="pipe-hd">
              <h4 style={{fontSize:10,display:"flex",alignItems:"center",gap:5}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity:.55,flexShrink:0}}>
                  {stage==="new-lead"&&<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
                  {stage==="applied"&&<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>}
                  {stage==="approved"&&<><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></>}
                  {stage==="onboarding"&&<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
                </svg>
                {SL[stage]}
              </h4>
              <span className="pipe-cnt">{sa.length}</span>
            </div>
              <div className="pipe-bd">
                {sa.sort(function(a,b){return getScore(b)-getScore(a);}).map(function(a){
                  var sc=getScore(a);var bd=getBreakdown(a);var d=daysSince(a.lastContact||a.submitted);var flags=getFlags(a);var isChecked=bulkSel.includes(a.id);var canInvite=["new-lead","pre-screened","called"].includes(a.status);
                  var isOnboarding=a.status==="onboarding";
                  return(
                  <div key={a.id} className="pipe-card" style={{
                    border:isOnboarding?"2px solid #4a7c59":"1px solid rgba(0,0,0,.07)",
                    borderLeft:isOnboarding?"2px solid #4a7c59":sc>=70?"3px solid #4a7c59":sc>=50?"3px solid #d4a853":"3px solid #c45c4a",
                    cursor:"pointer",background:isChecked?"rgba(212,168,83,.06)":"#fff",
                    padding:isOnboarding?"10px":"10px 10px 10px 30px",
                  }} onClick={function(){setModal({type:"app",data:a});}}>

                    {/* Checkbox — only on non-onboarding, positioned cleanly */}
                    {!isOnboarding&&<div style={{position:"absolute",left:8,top:12}} onClick={e=>{e.stopPropagation();setBulkSel(p=>isChecked?p.filter(x=>x!==a.id):[...p,a.id]);}}><input type="checkbox" checked={isChecked} onChange={()=>{}} style={{width:13,height:13,cursor:"pointer"}}/></div>}

                    {flags.length>0&&<div style={{fontSize:7,padding:"2px 5px",borderRadius:3,marginBottom:3,background:flags[0].type==="current"?"rgba(196,92,74,.08)":flags[0].type==="past"?"rgba(212,168,83,.08)":"rgba(59,130,246,.08)",color:flags[0].type==="current"?"#c45c4a":flags[0].type==="past"?"#9a7422":"#3b82f6",fontWeight:600,cursor:"pointer"}}
                      onClick={e=>{e.stopPropagation();if(flags[0].type==="past"){setDrill("archive");setTab("tenants");}else if(flags[0].type==="dup"){setModal({type:"app",data:flags[0].data});}setModal(null);}}>
                      {flags[0].type==="current"?"Current Tenant":flags[0].type==="past"?"Returning":flags[0].type==="dup"?"Duplicate":""} →
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

                    <div className="pipe-sub">{(()=>{const p=props.find(x=>x.name===a.property);const addr=p?.addr||p?.address||"";return(a.property||"—")+(addr?" · "+addr:"")+(a.room?" · "+a.room:"");})()}</div>

                    {/* Invited — "Awaiting Reply" badge + reinvite button */}
                    {false&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
                      <span style={{fontSize:8,fontWeight:700,color:"#3b82f6",background:"rgba(59,130,246,.1)",padding:"2px 6px",borderRadius:99}}>Awaiting Reply</span>
                      <button style={{fontSize:8,padding:"2px 7px",background:"none",border:"1px solid rgba(59,130,246,.25)",borderRadius:4,color:"#3b82f6",cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}
                        onClick={e=>{e.stopPropagation();
                          const now=TODAY.toISOString().split("T")[0];
                          setApps(p=>p.map(x=>x.id===a.id?{...x,lastContact:now,history:[...(x.history||[]),{from:"invited",to:"invited",date:now,note:"Reinvited — resent application link"}]}:x));
                          if(a.inviteLink){navigator.clipboard.writeText(a.inviteLink);showAlert({title:"Link Copied",body:"Invite link copied to clipboard. Re-send to "+a.name+"."});}
                        }}>Reinvite</button>
                    </div>}

                    {/* Onboarding progress bar */}


                    {/* Onboarding status pills — shown for approved/onboarding cards, reads from Supabase */}
                    {(isOnboarding||a.status==="approved")&&(()=>{
                      const ob=obStatuses[a.email]||{};
                      // Lease state: check local leases array for sent/signed status
                      const appLease=leases.find(l=>l.applicationId===a.id);
                      const leaseSent=appLease&&(appLease.status==="pending_tenant"||appLease.status==="executed");
                      const leaseSignedLocal=appLease?.status==="executed"||!!a.leaseSigned;
                      const leaseSignedSupa=ob.leaseSigned;
                      const leaseDone=leaseSignedLocal||leaseSignedSupa;
                      const leaseAmber=leaseSent&&!leaseDone; // sent but not yet signed
                      // SD and Rent charges
                      const sdCharge=charges.find(c=>c.tenantName===a.name&&c.category==="Security Deposit");
                      const rentCharge=charges.find(c=>c.tenantName===a.name&&c.category==="Rent");
                      const allDone=leaseDone&&ob.sdPaid&&ob.firstMonthPaid;
                      // Pill config: state = "done" | "pending" | "idle"
                      const pills=[
                        {
                          key:"lease",label:"Lease",
                          state:leaseDone?"done":leaseAmber?"pending":"idle",
                          pendingLabel:"Awaiting Signature",
                          onClick:(e)=>{e.stopPropagation();
                            if(leaseDone&&appLease){setModal({type:"app",data:a,startSection:"lease"});}
                            else if(leaseAmber&&appLease){setModal({type:"app",data:a,startSection:"lease"});}
                            else{setModal({type:"app",data:a});}
                          }
                        },
                        {
                          key:"sd",label:"SD",
                          state:ob.sdPaid?"done":sdCharge?"pending":"idle",
                          pendingLabel:"Awaiting Payment",
                          onClick:(e)=>{e.stopPropagation();
                            if(sdCharge){goTab("payments");setPaySubTab("charges");setPayFilters({...payFilters,tenant:a.name,category:"Security Deposit"});}
                            else{setModal({type:"app",data:a});}
                          }
                        },
                        {
                          key:"rent",label:"Rent",
                          state:ob.firstMonthPaid?"done":rentCharge?"pending":"idle",
                          pendingLabel:"Awaiting Payment",
                          onClick:(e)=>{e.stopPropagation();
                            if(rentCharge){goTab("payments");setPaySubTab("charges");setPayFilters({...payFilters,tenant:a.name,category:"Rent"});}
                            else{setModal({type:"app",data:a});}
                          }
                        },
                        {
                          key:"movein",label:"Move In",
                          state:allDone?"done":"idle",
                          pendingLabel:"",
                          onClick:(e)=>{e.stopPropagation();setModal({type:"app",data:a});}
                        },
                      ];
                      const doneCount=pills.filter(p=>p.state==="done").length;
                      return(
                      <div style={{marginTop:8}} onClick={e=>e.stopPropagation()}>
                        <div style={{display:"flex",gap:3,marginBottom:4}}>
                          {pills.map(p=>{
                            const bg=p.state==="done"?"rgba(74,124,89,.15)":p.state==="pending"?"rgba(212,168,83,.15)":"rgba(0,0,0,.05)";
                            const col=p.state==="done"?"#2d6a3f":p.state==="pending"?"#9a7422":"#aaa";
                            const bdr=p.state==="done"?"1px solid rgba(74,124,89,.25)":p.state==="pending"?"1px solid rgba(212,168,83,.3)":"1px solid transparent";
                            return(
                            <div key={p.key}
                              onClick={p.onClick}
                              title={p.state==="pending"?p.pendingLabel:p.state==="done"?"Completed — click to view":"Not started"}
                              style={{flex:1,textAlign:"center",fontSize:7,fontWeight:700,padding:"3px 2px",borderRadius:4,
                                background:bg,color:col,border:bdr,cursor:"pointer",transition:"all .15s",
                                position:"relative",
                              }}
                              onMouseEnter={e=>{
                                const el=e.currentTarget;
                                el.style.transform="scale(1.08)";
                                el.style.boxShadow="0 2px 8px rgba(0,0,0,.15)";
                                el.style.zIndex="10";
                                if(p.state==="done"){el.style.background="rgba(74,124,89,.35)";el.style.color="#1a5c30";}
                                else if(p.state==="pending"){el.style.background="rgba(212,168,83,.35)";el.style.color="#7a5a10";}
                                else{el.style.background="rgba(0,0,0,.14)";el.style.color="#333";}
                              }}
                              onMouseLeave={e=>{
                                const el=e.currentTarget;
                                el.style.transform="";el.style.boxShadow="";el.style.zIndex="";
                                el.style.background=p.state==="done"?"rgba(74,124,89,.15)":p.state==="pending"?"rgba(212,168,83,.15)":"rgba(0,0,0,.05)";
                                el.style.color=p.state==="done"?"#2d6a3f":p.state==="pending"?"#9a7422":"#aaa";
                              }}>
                              {p.state==="done"?"✓ ":p.state==="pending"?"⋯ ":""}{p.label}
                            </div>);
                          })}
                        </div>
                        {/* Lease waiting indicator */}
                        {leaseAmber&&<div style={{fontSize:7,color:"#9a7422",fontWeight:700,textAlign:"center",padding:"2px 0",background:"rgba(212,168,83,.08)",borderRadius:3,marginBottom:3}}>Awaiting tenant signature</div>}
                        {!allDone&&!leaseAmber&&<div style={{height:3,borderRadius:2,background:"rgba(0,0,0,.06)"}}>
                          <div style={{height:"100%",borderRadius:2,background:"#4a7c59",width:(doneCount/4*100)+"%",transition:"width .3s"}}/>
                        </div>}
                        {allDone&&<div style={{fontSize:7,color:"#2d6a3f",fontWeight:800,textAlign:"center",padding:"2px 0",background:"rgba(74,124,89,.08)",borderRadius:3}}>Ready to Move In</div>}
                      </div>);
                    })()}

                    {/* Standard card footer */}
                    {!isOnboarding&&a.status!=="invited"&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:8,color:"#5c4a3a",marginTop:5}}>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:80}}>{a.source||""}</span>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        {d>0&&<span style={{color:d>=5?"#c45c4a":d>=3?"#d4a853":"#888",fontWeight:700}}>{d}d</span>}
                        {canInvite&&<button
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,168,83,.3)";e.currentTarget.style.color="#7a5a10";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="rgba(212,168,83,.12)";e.currentTarget.style.color="#9a7422";}}
                          style={{fontSize:7,padding:"3px 7px",background:"rgba(212,168,83,.12)",color:"#9a7422",border:"1px solid rgba(212,168,83,.35)",borderRadius:4,cursor:"pointer",fontWeight:700,fontFamily:"inherit",transition:"all .15s"}}
                          onClick={e=>{e.stopPropagation();setModal({type:"inviteApp",data:a});}}>Invite to Apply</button>}
                        <button
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(74,124,89,.25)";e.currentTarget.style.color="#2d6a3f";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="rgba(74,124,89,.1)";e.currentTarget.style.color="#4a7c59";}}
                          style={{fontSize:7,padding:"3px 7px",background:"rgba(74,124,89,.1)",color:"#4a7c59",border:"1px solid rgba(74,124,89,.3)",borderRadius:4,cursor:"pointer",fontWeight:700,fontFamily:"inherit",transition:"all .15s"}}
                          title="Send portal invite — bypasses application requirement"
                          onClick={e=>{e.stopPropagation();setPiState("idle");setModal({type:"sendPortalInviteApp",data:a});}}>Portal Invite</button>
                      </div>
                    </div>}
                  </div>);
                })}
                {sa.length===0&&<div style={{textAlign:"center",padding:12,color:"#8a7d74",fontSize:9}}>Empty</div>}
              </div>
            </div>);
          })}
        </div>}

        {/* List */}
        {appView==="list"&&<div className="card"><div className="card-bd" style={{padding:0}}><table className="tbl"><thead><tr><th style={{width:32}}></th><th>Name</th><th>Property</th><th>Score</th><th>Stage</th><th>Days</th><th>Source</th><th></th></tr></thead><tbody>
          {activeApps.sort((a,b)=>getScore(b)-getScore(a)).map(a=>{const sc=getScore(a);const d=daysSince(a.lastContact||a.submitted);const sel=bulkSel.includes(a.id);return(
            <tr key={a.id} style={{cursor:"pointer",background:sel?"rgba(212,168,83,.07)":"",transition:"background .1s"}}
              onClick={()=>setModal({type:"app",data:a})}>
              <td style={{width:32}} onClick={e=>e.stopPropagation()}>
                <input type="checkbox" checked={sel} onChange={e=>setBulkSel(p=>e.target.checked?[...p,a.id]:p.filter(x=>x!==a.id))} style={{width:14,height:14,cursor:"pointer"}}/>
              </td>
              <td style={{fontWeight:700}}>{a.name}</td><td>{a.property||"—"}</td>
              <td><span style={{fontWeight:700,color:sc>=70?"#4a7c59":sc>=50?"#d4a853":"#c45c4a"}}>{sc}</span></td>
              <td><span className={`badge ${SC2[a.status]||"b-gray"}`}>{SL[a.status]||a.status}</span></td>
              <td style={{color:d>=5?"#c45c4a":d>=3?"#d4a853":"#999",fontWeight:600}}>{d}d</td>
              <td style={{fontSize:10}}>{a.source||"—"}</td>
              <td onClick={e=>e.stopPropagation()}>
                {["pre-screened","called","new-lead"].includes(a.status)&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"inviteApp",data:a})}>Invite</button>}
              </td></tr>);})}
        </tbody></table></div></div>}

        {/* Denied — collapsible */}
        {deniedApps.length>0&&<div style={{marginTop:14}}>
          <button className="btn btn-out btn-sm" style={{width:"100%",color:"#6b5e52",marginBottom:4}} onClick={()=>setExpanded(p=>({...p,showDenied:!p.showDenied}))}>
            {expanded.showDenied?"▾ Hide":"▸ Show"} Denied ({deniedApps.length})
          </button>
          {expanded.showDenied&&deniedApps.map(a=><div key={a.id} className="row" style={{opacity:.7}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{a.name}</div><div className="row-s">{a.property} · {fmtD(a.deniedDate)}{a.deniedReason?" · "+a.deniedReason:""}</div></div><button className="btn btn-out btn-sm" onClick={()=>setModal({type:"app",data:a})}>View</button><button className="btn btn-out btn-sm" onClick={()=>setApps(p=>p.map(x=>x.id===a.id?{...x,status:x.prevStage||"pre-screened",deniedReason:null,deniedDate:null}:x))}>Restore</button></div>)}
        </div>}


        {/* ── Waitlist ── */}
        {(()=>{const totalVacant=props.reduce((s,p)=>s+allRooms(p).filter(r=>r.st==="vacant").length,0);const waitlistApps=activeApps.filter(a=>["new-lead"].includes(a.status));
          if(totalVacant===0&&waitlistApps.length>0)return(
            <div style={{marginTop:8,border:"2px solid rgba(212,168,83,.2)",borderRadius:12,padding:14,background:"rgba(212,168,83,.03)"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#9a7422",marginBottom:8}}>Waitlist — No Vacant Rooms</div>
              <div style={{fontSize:10,color:"#6b5e52",marginBottom:8}}>All rooms are occupied. These applicants are waiting for availability, ranked by score.</div>
              {waitlistApps.sort((a,b)=>getScore(b)-getScore(a)).map((a,i)=><div key={a.id} className="row" style={{padding:"8px 10px"}}><div style={{width:20,fontSize:12,fontWeight:800,color:"#d4a853"}}>{i+1}</div><div className="row-i"><div className="row-t">{a.name} <span style={{fontSize:9,color:"#6b5e52"}}>({getScore(a)}pt)</span></div><div className="row-s">{a.property||"No pref"} · {SL[a.status]} · {a.source||""}</div></div><button className="btn btn-out btn-sm" onClick={()=>setModal({type:"app",data:a})}>View</button></div>)}
            </div>);
          return null;})()}

        {/* ── Waitlist ── */}
        {(()=>{const totalVacant=props.reduce((s,p)=>s+allRooms(p).filter(r=>r.st==="vacant").length,0);
          if(totalVacant>0)return null;
          const waitlistApps=activeApps.filter(a=>["new-lead"].includes(a.status)).sort((a,b)=>getScore(b)-getScore(a));
          return waitlistApps.length>0?<div style={{marginTop:16,border:"2px solid rgba(212,168,83,.2)",borderRadius:12,padding:16,background:"rgba(212,168,83,.03)"}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Waitlist — No Vacancies</div>
            <div style={{fontSize:10,color:"#6b5e52",marginBottom:10}}>All rooms are full. These applicants are ranked by score and ready when a room opens.</div>
            {waitlistApps.map((a,i)=><div key={a.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"app",data:a})}>
              <div style={{width:20,fontSize:11,fontWeight:700,color:"#d4a853"}}>#{i+1}</div>
              <div className="row-i"><div className="row-t">{a.name} <span style={{fontSize:9,color:"#6b5e52"}}>Score: {getScore(a)}</span></div><div className="row-s">{a.property||"No pref"} · {SL[a.status]} · {a.source||""}</div></div>
            </div>)}
          </div>:null;
        })()}

      </>);})()}

      {/* ═══ CONFIGURATION ═══ */}
      {tab==="configuration"&&<>
        <div className="sec-hd"><div><h2>Configuration</h2><p>Pre-screen questions and application form</p></div></div>

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
                <div style={{fontSize:13,fontWeight:700}}>Pre-Screen Contact Form</div>
                <div style={{fontSize:9,color:"#6b5e52"}}>Heading, subtext, and "How did you hear about us?" options</div>
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
              <div style={{fontSize:9,color:"#6b5e52",marginBottom:6}}>⠿ drag to reorder · click to edit · ✕ to remove</div>
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
              <div style={{fontSize:9,color:"#6b5e52",marginTop:6}}>"Other" should stay last — it triggers a free-text field.</div>
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
                    <span style={{fontSize:9,color:"#6b5e52",whiteSpace:"nowrap"}}>{sFields.length} field{sFields.length!==1?"s":""}</span>
                    <button className="btn btn-gold btn-sm" style={{fontSize:9,padding:"2px 9px"}} onClick={()=>addFieldToSection(sec)}>+ Field</button>
                    <button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 9px",color:"#d4a853",borderColor:"rgba(212,168,83,.35)"}} title="Duplicate this entire section" onClick={()=>duplicateSection(sec)}>⧉ Duplicate</button>
                    {sections.length>1&&<button style={{background:"none",border:"none",color:"#c45c4a",cursor:"pointer",fontSize:12,padding:"0 2px"}} onClick={()=>deleteSection(sec)}>🗑</button>}
                  </div>
                  {/* Fields in this section */}
                  {sFields.length===0&&<div style={{padding:"10px 14px",fontSize:11,color:"#7a7067",fontStyle:"italic"}}>No fields — click + Field above</div>}
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
                          <div><div style={{fontSize:9,fontWeight:700,color:"#4a7c59",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Follow-up if "Yes"</div><input value={f.followUpYes||""} onChange={e=>updateField(gi,"followUpYes",e.target.value)} placeholder="e.g. Please explain..." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(74,124,89,.2)",fontSize:11,fontFamily:"inherit"}}/></div>
                          <div><div style={{fontSize:9,fontWeight:700,color:"#c45c4a",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Follow-up if "No"</div><input value={f.followUpNo||""} onChange={e=>updateField(gi,"followUpNo",e.target.value)} placeholder="e.g. Please explain..." style={{width:"100%",padding:"6px 9px",borderRadius:6,border:"1px solid rgba(196,92,74,.2)",fontSize:11,fontFamily:"inherit"}}/></div>
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
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{expanded.appPreview?"▼":"▶"}</span><div><div style={{fontSize:13,fontWeight:700}}>📱 Application Preview</div><div style={{fontSize:9,color:"#6b5e52"}}>Live preview — reflects your current fields exactly</div></div></div>
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
      </>}

      {tab==="maintenance"&&<>
        <div className="sec-hd"><div><h2>Maintenance Requests</h2><p>{m.openMaint} open</p></div>
          <button className="btn btn-gold" onClick={()=>setMaint(p=>[{id:uid(),roomId:"",propId:"",tenant:"",title:"New Request",desc:"",status:"open",priority:"medium",created:TODAY.toISOString().split("T")[0],photos:0},...p])}>+ New Request</button></div>
        {["open","in-progress","resolved"].map(status=>{
          const items=maint.filter(x=>x.status===status);if(items.length===0&&status==="resolved")return null;
          const labels={open:"Open","in-progress":"In Progress",resolved:"Resolved"};
          const colors={open:"b-red","in-progress":"b-gold",resolved:"b-green"};
          return(<div key={status} style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{labels[status]} ({items.length})</div>
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
            <button className="btn btn-out btn-sm" onClick={()=>{setLeaseSubTab("template");}}>Template</button>
            <button className="btn btn-gold" onClick={()=>openCreateLease(null)}>+ New Lease</button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div style={{display:"flex",gap:6,marginBottom:16,borderBottom:"1px solid rgba(0,0,0,.06)",paddingBottom:12}}>
          {[["active","Active Leases"],["template","Template Editor"]].map(([id,label])=>(
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
              <div style={{fontSize:12,fontWeight:700,color:"#9a7422",marginBottom:8}}>Ready to lease — approved applicants without a lease</div>
              {apps.filter(a=>["approved","onboarding"].includes(a.status)&&!leases.find(l=>l.applicationId===a.id)).map(a=>(
                <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(212,168,83,.1)"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:600}}>{a.name}</div>
                    <div style={{fontSize:10,color:"#6b5e52"}}>{a.property} · {a.room} · {a.termMoveIn||a.moveIn||"move-in TBD"}</div>
                  </div>
                  <button className="btn btn-gold btn-sm" onClick={()=>openCreateLease(a)}>Create Lease →</button>
                </div>
              ))}
            </div>
          )}

          {leases.length===0&&!leaseForm&&<div style={{textAlign:"center",padding:48,color:"#6b5e52"}}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth="1.25" style={{marginBottom:12}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
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
                  <div style={{fontSize:11,color:"#6b5e52"}}>{l.property} · {l.room} · {fmtS(l.rent||0)}/mo · Move-in {fmtD(l.moveIn)}</div>
                  {l.signingLink&&<div style={{fontSize:10,color:"#3b82f6",marginTop:4,wordBreak:"break-all",display:"flex",alignItems:"center",gap:4}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>{l.signingLink}</div>}
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:12,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"leaseSummary",lease:l})}>View Summary</button>
                  <button className="btn btn-out btn-sm" onClick={()=>setViewingLease({lease:l,room:null})}>View Full Lease</button>
                  {l.status==="draft"&&<button className="btn btn-out btn-sm" onClick={()=>setLeaseForm({...l})}>Edit</button>}
                  {l.status==="draft"&&<button className="btn btn-green btn-sm" onClick={()=>setModal({type:"signLease",leaseId:l.id,lease:l})}>Sign & Send</button>}
                  {l.status==="pending_tenant"&&<button className="btn btn-out btn-sm" onClick={()=>{navigator.clipboard.writeText(l.signingLink||"");showAlert({title:"Copied",body:"Signing link copied."});}}>Copy Link</button>}
                  <button className="btn btn-out btn-sm" style={{color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>confirmAction(`Delete lease for ${l.tenantName}?`,()=>deleteLease(l.id))}>Delete</button>
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
            <div style={{fontSize:10,color:"#6b5e52",marginTop:8}}>These defaults auto-fill every new lease. You can override per-lease in the lease editor.</div>
          </div>

          <div style={{fontSize:12,fontWeight:700,color:"#5c4a3a",marginBottom:10}}>Lease Sections — toggle active, require initials, edit content</div>
          {(template.sections||DEF_LEASE_SECTIONS).map((sec,si)=>(
            <div key={sec.id} className="card" style={{marginBottom:8,borderLeft:`3px solid ${sec.active!==false?"#d4a853":"rgba(0,0,0,.1)"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer"}} onClick={()=>setExpanded(p=>({...p,["lsec_"+sec.id]:!p["lsec_"+sec.id]}))}>
                <span style={{fontSize:11,color:expanded["lsec_"+sec.id]?"#d4a853":"#999"}}>{expanded["lsec_"+sec.id]?"▾":"▸"}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,opacity:sec.active===false?.45:1}}>{sec.title}</div>
                  <div style={{fontSize:9,color:"#6b5e52"}}>{sec.requiresInitials?"Initials required":"No initials"} · {sec.active===false?"Hidden":"Active"}</div>
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
                <div style={{fontSize:9,color:"#7a7067",marginTop:4}}>Variables: {"{{MONTHLY_RENT}} {{SECURITY_DEPOSIT}} {{LEASE_START}} {{LEASE_END}} {{PARKING_SPACE}} {{DOOR_CODE}} {{UTILITIES_CLAUSE}} {{LANDLORD_NAME}}"}</div>
              </div>}
            </div>
          ))}
          <button className="btn btn-gold" style={{marginTop:8}} onClick={()=>{save("hq-lease-template",template||{name:"Alabama Room Rental Agreement",landlordName:"Carolina Cooper",company:"Black Bear Properties",sections:DEF_LEASE_SECTIONS});showAlert({title:"Template Saved",body:"Lease template saved successfully."});}}>💾 Save Template</button>
        </>}

        {/* Lease Form Modal */}
        {leaseForm&&<div className="mbg" onClick={()=>setLeaseForm(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:660,maxHeight:"90vh",overflowY:"auto"}}>
          <h2>{leaseForm.id?"Edit Lease":"Create New Lease"}</h2>
          <div style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>All fields auto-populate from the application or property settings. Edit anything before saving.</div>

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
              <div style={{fontSize:11,fontWeight:800,color:"#9a7422",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>Move-In Package Preview</div>

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
                    <div style={{fontSize:12,fontWeight:700}}>Security Deposit</div>
                    <div style={{fontSize:10,color:"#6b5e52"}}>Due today — secures the room</div>
                  </div>
                  <div style={{fontSize:15,fontWeight:800,color:"#1a1714"}}>{fmtS(sd)}</div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"#fff",borderRadius:8,border:"1px solid rgba(0,0,0,.06)"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700}}>🏠 {isFirstDay?"First Month's Rent":`Prorated Rent (${daysLeft} days × ${fmtS(dailyRate)})`}</div>
                    <div style={{fontSize:10,color:"#6b5e52"}}>Due: {fmtD(mi)}</div>
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
            <button className="btn btn-gold" onClick={saveDraft}>Save Draft</button>
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
                    <div style={{fontSize:10,color:"#6b5e52"}}>Saved signature on file</div>
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
            <div style={{fontSize:9,fontWeight:700,color:"#6b5e52",marginBottom:4}}>TENANT SIGNING LINK</div>
            {modal.link}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button className="btn btn-out" onClick={()=>{navigator.clipboard.writeText(modal.link||"");showAlert({title:"Copied",body:"Link copied to clipboard."});}}>Copy Link</button>
            <button className="btn btn-gold" onClick={()=>setModal(null)}>Done</button>
          </div>
        </div></div>}

        {/* View executed lease */}
        {modal?.type==="viewLease"&&<div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:560,maxHeight:"90vh",overflowY:"auto"}}>
          <h2>Executed Lease</h2>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            <div style={{flex:1,padding:"10px 12px",background:"rgba(74,124,89,.06)",borderRadius:8,fontSize:11}}>
              <div style={{color:"#6b5e52",marginBottom:2}}>Tenant</div><strong>{modal.lease.tenantName}</strong>
            </div>
            <div style={{flex:1,padding:"10px 12px",background:"rgba(74,124,89,.06)",borderRadius:8,fontSize:11}}>
              <div style={{color:"#6b5e52",marginBottom:2}}>Property</div><strong>{modal.lease.property} · {modal.lease.room}</strong>
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
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",marginBottom:4}}>TENANT SIGNATURE</div>
            <img src={modal.lease.tenantSignature} alt="Tenant sig" style={{maxHeight:60,border:"1px solid rgba(0,0,0,.06)",borderRadius:6,padding:4,background:"#fff"}}/>
          </div>}
          {modal.lease.landlordSignature&&<div style={{marginTop:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",marginBottom:4}}>PM SIGNATURE</div>
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
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{labels[type]}</div>
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
      {tab==="accounting"&&(()=>{
        // ── Accounting-specific filter state (separate from Reports tab) ──
        const acctFrom=acctFilters.from||(TODAY.getFullYear()+"-01-01");
        const acctTo=acctFilters.to||TODAY.toISOString().split("T")[0];
        const acctPropIds=acctFilters.propIds||[];
        const acctTenants=acctFilters.tenants||[];
        const acctCats=acctFilters.categories||[];
        const acctVendors=acctFilters.vendors||[];
        const hasPropFilter=acctPropIds.length>0;
        const hasTenantFilter=acctTenants.length>0;
        const hasCatFilter=acctCats.length>0;
        const hasVendorFilter=acctVendors.length>0;

        // ── Collected payments (income) — fix propId to use prop lookup ──
        const allCollected=charges.flatMap(c=>{
          const pr=props.find(p=>allRooms(p).some(r=>r.id===c.roomId))||{};
          return c.payments.map(p=>({...p,propName:c.propName,propId:pr.id||"",category:c.category,tenantName:c.tenantName,chargeId:c.id,roomName:c.roomName}));
        });

        // ── Apply filters ──
        const filtIncome=allCollected.filter(p=>{
          if(p.date<acctFrom||p.date>acctTo)return false;
          if(hasPropFilter&&!acctPropIds.includes(p.propId))return false;
          if(hasTenantFilter&&!acctTenants.includes(p.tenantName))return false;
          if(hasCatFilter&&!acctCats.includes(p.category))return false;
          return true;
        });
        const propCount=props.length||1;
        const filtExpenses=(()=>{
          const result=[];
          for(const e of expenses){
            if(e.date<acctFrom||e.date>acctTo)continue;
            if(hasCatFilter&&!acctCats.includes(e.category))continue;
            if(hasVendorFilter&&!acctVendors.includes(e.vendor))continue;
            if(e.propId==="shared"){
              if(!hasPropFilter){result.push(e);}
              else{result.push({...e,_isShared:true,_fullAmount:e.amount,amount:Math.round(e.amount/propCount*100)/100});}
            } else {
              if(hasPropFilter&&!acctPropIds.includes(e.propId))continue;
              result.push(e);
            }
          }
          return result;
        })();

        const totalIncome=filtIncome.reduce((s,p)=>s+p.amount,0);
        const totalExp=filtExpenses.reduce((s,e)=>s+e.amount,0);
        const totalNOI=totalIncome-totalExp;
        const filtMortgages=!hasPropFilter?mortgages:mortgages.filter(mg=>acctPropIds.includes(mg.propId));
        const annualDebt=filtMortgages.reduce((s,mg)=>s+(mg.monthlyPI||0)*12,0);
        const dscr=annualDebt>0?(totalNOI/annualDebt):null;

        // ── Filter option lists ──
        const tenantOptions=[...new Set(allCollected.map(p=>p.tenantName))].sort();
        const incomeCatOptions=[...new Set(allCollected.map(p=>p.category))].sort();
        const expCatOptions=[...new Set(expenses.map(e=>e.category))].sort();
        const vendorOptions=[...new Set(expenses.filter(e=>e.vendor).map(e=>e.vendor))].sort();
        const expCats=SCHED_E_CAT_LABELS;

        const setF=(k,v)=>setAcctFilters(prev=>({...prev,[k]:v}));
        const resetFilters=()=>{setAcctFilters({from:TODAY.getFullYear()+"-01-01",to:TODAY.toISOString().split("T")[0],propIds:[],tenants:[],categories:[],vendors:[]});setAcctDrop(null);};
        const toggleArr=(arr,val)=>arr.includes(val)?arr.filter(x=>x!==val):[...arr,val];

        // Quick filter detection
        const thisMonthFrom=TODAY.getFullYear()+"-"+String(TODAY.getMonth()+1).padStart(2,"0")+"-01";
        const ytdFrom=TODAY.getFullYear()+"-01-01";
        const todayStr=TODAY.toISOString().split("T")[0];
        const lastYrFrom=(TODAY.getFullYear()-1)+"-01-01";
        const lastYrTo=(TODAY.getFullYear()-1)+"-12-31";
        const qfActive=acctFrom===thisMonthFrom&&acctTo===todayStr?"month":acctFrom===ytdFrom&&acctTo===todayStr?"ytd":acctFrom===lastYrFrom&&acctTo===lastYrTo?"lastyear":"";

        // Multi-select dropdown renderer
        const MsDrop=({id,label,options,selected,onToggle})=>{
          const isOpen=acctDrop===id;
          const count=selected.length;
          return(<div className="ms-drop">
            <button className={"ms-btn"+(count?" has-sel":"")} onClick={e=>{e.stopPropagation();setAcctDrop(isOpen?null:id);}}>
              {count?`${label} (${count})`:label} <span style={{fontSize:8,marginLeft:2}}>{isOpen?"▲":"▼"}</span>
            </button>
            {isOpen&&<div className="ms-panel" onClick={e=>e.stopPropagation()}>
              {options.length===0&&<div style={{padding:"8px 12px",fontSize:10,color:"#7a7067"}}>None available</div>}
              {options.map(opt=>{
                const val=typeof opt==="object"?opt.value:opt;
                const lbl=typeof opt==="object"?opt.label:opt;
                return(<label key={val} className="ms-item">
                  <input type="checkbox" checked={selected.includes(val)} onChange={()=>onToggle(val)}/>
                  <span>{lbl}</span>
                </label>);
              })}
              {count>0&&<div style={{borderTop:"1px solid rgba(0,0,0,.06)",padding:"6px 12px",marginTop:4}}>
                <button style={{fontSize:10,color:"#c45c4a",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}} onClick={()=>onToggle("__clear__")}>Clear all</button>
              </div>}
            </div>}
          </div>);
        };

        return(<>
        {/* ── Header ── */}
        <div className="sec-hd">
          <div>
            <h2 style={{margin:0}}>Accounting</h2>
            <div style={{fontSize:11,color:"#6b5e52",marginTop:2}}>
              {fmtDp(acctFrom)} — {fmtDp(acctTo)}{hasPropFilter?" · "+acctPropIds.length+" propert"+(acctPropIds.length===1?"y":"ies"):""}
            </div>
          </div>
          <span style={{fontSize:9,color:"#9a7422",background:"rgba(212,168,83,.1)",padding:"3px 8px",borderRadius:4,fontWeight:600}}>Schedule E</span>
        </div>

        {/* ── Global filter bar ── */}
        <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",padding:"12px 14px",marginBottom:14,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}} onClick={()=>setAcctDrop(null)}>
          <input type="date" value={acctFrom} onChange={e=>setF("from",e.target.value)} onClick={e=>e.stopPropagation()} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11}}/>
          <span style={{fontSize:11,color:"#7a7067",flexShrink:0}}>to</span>
          <input type="date" value={acctTo} onChange={e=>setF("to",e.target.value)} onClick={e=>e.stopPropagation()} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:11}}/>
          <div style={{width:1,height:20,background:"rgba(0,0,0,.08)",flexShrink:0}}/>
          <MsDrop id="prop" label="Property" options={props.map(p=>({value:p.id,label:p.name}))} selected={acctPropIds} onToggle={v=>v==="__clear__"?setF("propIds",[]):setF("propIds",toggleArr(acctPropIds,v))}/>
          {acctSubTab==="income"&&<>
            <MsDrop id="tenant" label="Tenant" options={tenantOptions} selected={acctTenants} onToggle={v=>v==="__clear__"?setF("tenants",[]):setF("tenants",toggleArr(acctTenants,v))}/>
            <MsDrop id="cat" label="Category" options={incomeCatOptions} selected={acctCats} onToggle={v=>v==="__clear__"?setF("categories",[]):setF("categories",toggleArr(acctCats,v))}/>
          </>}
          {acctSubTab==="expenses"&&<>
            <MsDrop id="cat" label="Category" options={expCatOptions} selected={acctCats} onToggle={v=>v==="__clear__"?setF("categories",[]):setF("categories",toggleArr(acctCats,v))}/>
            <MsDrop id="vendor" label="Vendor" options={vendorOptions} selected={acctVendors} onToggle={v=>v==="__clear__"?setF("vendors",[]):setF("vendors",toggleArr(acctVendors,v))}/>
          </>}
          <div style={{width:1,height:20,background:"rgba(0,0,0,.08)",flexShrink:0}}/>
          <button className={"qf-btn"+(qfActive==="month"?" active":"")} onClick={e=>{e.stopPropagation();setF("from",thisMonthFrom);setF("to",todayStr);}}>This Month</button>
          <button className={"qf-btn"+(qfActive==="ytd"?" active":"")} onClick={e=>{e.stopPropagation();setF("from",ytdFrom);setF("to",todayStr);}}>YTD</button>
          <button className={"qf-btn"+(qfActive==="lastyear"?" active":"")} onClick={e=>{e.stopPropagation();const y=TODAY.getFullYear()-1;setF("from",y+"-01-01");setF("to",y+"-12-31");}}>Last Year</button>
          <button className="qf-btn" onClick={e=>{e.stopPropagation();resetFilters();}}>Reset</button>
        </div>

        {/* ── KPI strip ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
          {[
            {label:"Gross Income",value:totalIncome,color:"#4a7c59",sub:filtIncome.length+" payments"},
            {label:"Total Expenses",value:totalExp,color:"#c45c4a",sub:filtExpenses.length+" line items"},
            {label:"Net Operating Income",value:totalNOI,color:totalNOI>=0?"#4a7c59":"#c45c4a",sub:totalIncome>0?Math.round(totalNOI/totalIncome*100)+"% margin":"—"},
            {label:"DSCR",value:dscr!=null?dscr.toFixed(2)+"x":"—",color:dscr==null?"#7a7067":dscr>=1.25?"#4a7c59":dscr>=1.0?"#d4a853":"#c45c4a",sub:dscr==null?"No mortgages":dscr>=1.25?"Strong coverage":dscr>=1.0?"Marginal":"At risk"},
          ].map(({label,value,color,sub})=>(
            <div key={label} style={{background:"#fff",borderRadius:10,padding:"14px 16px",border:"1px solid rgba(0,0,0,.06)"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{label}</div>
              <div style={{fontSize:22,fontWeight:800,color,lineHeight:1}}>{typeof value==="number"?fmtS(value):value}</div>
              <div style={{fontSize:10,color:"#7a7067",marginTop:4}}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Sub-tabs ── */}
        <div style={{display:"flex",gap:0,marginBottom:16,position:"relative",paddingBottom:0}}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"rgba(0,0,0,.08)",zIndex:0}}/>
          {[["overview","Overview"],["income","Income"],["expenses","Expenses"],["improvements","Capital Improvements"],["mortgages","Mortgages"],["vendors","Vendors"]].map(([k,l])=>(
            <button key={k} onClick={()=>{setAcctSubTab(k);setF("categories",[]);setF("tenants",[]);setF("vendors",[]);setAcctDrop(null);}}
              onMouseEnter={e=>{if(acctSubTab!==k){e.currentTarget.style.background="rgba(255,255,255,.6)";e.currentTarget.style.color="#3c3228";}}}
              onMouseLeave={e=>{if(acctSubTab!==k){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#6b5e52";}}}
              style={{padding:"10px 22px",fontSize:13,fontWeight:acctSubTab===k?700:500,color:acctSubTab===k?"#3c3228":"#6b5e52",background:acctSubTab===k?"#fff":"transparent",border:acctSubTab===k?"1px solid rgba(0,0,0,.08)":"1px solid transparent",borderBottom:acctSubTab===k?"2px solid #fff":"2px solid transparent",borderRadius:"10px 10px 0 0",cursor:"pointer",fontFamily:"inherit",marginBottom:-2,transition:"all .15s",whiteSpace:"nowrap",position:"relative",zIndex:acctSubTab===k?3:1}}>
              {l}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {acctSubTab==="overview"&&(()=>{
          const filtProps=!hasPropFilter?props:props.filter(p=>acctPropIds.includes(p.id));
          return(<>
            {/* Toggle */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{fontSize:11,color:"#6b5e52",fontWeight:500}}>View by:</span>
              <div style={{display:"flex",border:"1px solid rgba(0,0,0,.1)",borderRadius:6,overflow:"hidden"}}>
                {[["property","Property"],["unit","Unit / Room"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setAcctOverviewMode(k)}
                    style={{padding:"5px 14px",fontSize:11,fontWeight:acctOverviewMode===k?700:500,background:acctOverviewMode===k?"#3c3228":"transparent",color:acctOverviewMode===k?"#fff":"#6b5e52",border:"none",cursor:"pointer",fontFamily:"inherit",borderLeft:k==="unit"?"1px solid rgba(0,0,0,.1)":"none"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* By Property */}
            {acctOverviewMode==="property"&&<>
              <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden",marginBottom:14}}>
                <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:11,fontWeight:700,color:"#5c4a3a",background:"#faf9f7"}}>By Property — {acctFrom.slice(0,7)} to {acctTo.slice(0,7)}</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                    {["Property","Gross Income","Expenses","NOI","NOI Margin","Annual Debt Svc","DSCR"].map(h=><th key={h} style={{padding:"8px 14px",textAlign:h==="Property"?"left":"right",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filtProps.map((pr,i)=>{
                      const inc=allCollected.filter(p=>p.propName===pr.name&&p.date>=acctFrom&&p.date<=acctTo).reduce((s,p)=>s+p.amount,0);
                      const directExp=expenses.filter(e=>e.propId===pr.id&&e.date>=acctFrom&&e.date<=acctTo).reduce((s,e)=>s+e.amount,0);
                      const sharedExp=expenses.filter(e=>e.propId==="shared"&&e.date>=acctFrom&&e.date<=acctTo).reduce((s,e)=>s+Math.round(e.amount/propCount*100)/100,0);
                      const exp=directExp+sharedExp;
                      const noi=inc-exp;const margin=inc>0?Math.round(noi/inc*100):null;
                      const mg=mortgages.filter(m=>m.propId===pr.id);
                      const debt=mg.reduce((s,m)=>s+(m.monthlyPI||0)*12,0);
                      const prDSCR=debt>0?(noi/debt):null;
                      return(<tr key={pr.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                        <td style={{padding:"9px 14px",fontWeight:700,fontSize:12}}>{pr.name}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:"#4a7c59",fontWeight:700}}>{fmtS(inc)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:"#c45c4a",fontWeight:700}}>{fmtS(exp)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:800,color:noi>=0?"#4a7c59":"#c45c4a"}}>{fmtS(noi)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:margin===null?"#999":margin>=50?"#4a7c59":margin>=25?"#d4a853":"#c45c4a",fontWeight:600}}>{margin!==null?margin+"%":"—"}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:"#5c4a3a"}}>{debt>0?fmtS(debt):"—"}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:800,color:prDSCR===null?"#999":prDSCR>=1.25?"#4a7c59":prDSCR>=1.0?"#d4a853":"#c45c4a"}}>{prDSCR!==null?prDSCR.toFixed(2)+"x":"—"}</td>
                      </tr>);
                    })}
                  </tbody>
                  <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                    <td style={{padding:"10px 14px",fontWeight:800}}>Portfolio Total</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(totalIncome)}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(totalExp)}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:totalNOI>=0?"#4a7c59":"#c45c4a",fontSize:13}}>{fmtS(totalNOI)}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:700,color:"#6b5e52"}}>{totalIncome>0?Math.round(totalNOI/totalIncome*100)+"%":"—"}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:700}}>{annualDebt>0?fmtS(annualDebt):"—"}</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:dscr===null?"#999":dscr>=1.25?"#4a7c59":dscr>=1.0?"#d4a853":"#c45c4a"}}>{dscr!==null?dscr.toFixed(2)+"x":"—"}</td>
                  </tr></tfoot>
                </table>
              </div>

              {/* Expense by category breakdown */}
              {filtExpenses.length>0&&(()=>{
                const byCat={};filtExpenses.forEach(e=>{byCat[e.category]=(byCat[e.category]||0)+e.amount;});
                const sorted=Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
                const bySubcat={};filtExpenses.filter(e=>e.subcategory).forEach(e=>{bySubcat[e.subcategory]=(bySubcat[e.subcategory]||0)+e.amount;});
                const subcatSorted=Object.entries(bySubcat).sort((a,b)=>b[1]-a[1]);
                return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[["By Schedule E Category",sorted],["By Subcategory (internal)",subcatSorted]].map(([title,items])=>(
                    <div key={title} style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
                      <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:11,fontWeight:700,color:"#5c4a3a",background:"#faf9f7"}}>{title}</div>
                      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:6}}>
                        {items.length===0&&<div style={{fontSize:11,color:"#7a7067",padding:"8px 0"}}>None recorded</div>}
                        {items.map(([cat,amt])=>{
                          const pct=totalExp>0?Math.round(amt/totalExp*100):0;
                          return(<div key={cat}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                              <span style={{fontSize:10,fontWeight:600,color:"#5c4a3a"}}>{cat}</span>
                              <span style={{fontSize:11,fontWeight:800,color:"#c45c4a"}}>{fmtS(amt)} <span style={{fontSize:9,color:"#7a7067",fontWeight:400}}>{pct}%</span></span>
                            </div>
                            <div style={{height:3,borderRadius:2,background:"#e5e3df"}}>
                              <div style={{height:"100%",borderRadius:2,background:"#c45c4a",width:pct+"%"}}/>
                            </div>
                          </div>);
                        })}
                      </div>
                    </div>
                  ))}
                </div>);
              })()}
            </>}

            {/* By Unit */}
            {acctOverviewMode==="unit"&&filtProps.map(pr=>{
              const units=pr.units||[];
              const prExpenses=[...expenses.filter(e=>e.propId===pr.id&&e.date>=acctFrom&&e.date<=acctTo),...expenses.filter(e=>e.propId==="shared"&&e.date>=acctFrom&&e.date<=acctTo).map(e=>({...e,amount:Math.round(e.amount/propCount*100)/100,_isShared:true}))];
              const propWideExp=prExpenses.filter(e=>!e.unitId);
              const propWideAmt=propWideExp.reduce((s,e)=>s+e.amount,0);
              return(<div key={pr.id} style={{marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:800,color:"#3c3228",marginBottom:8,paddingBottom:6,borderBottom:"2px solid rgba(0,0,0,.06)"}}>{pr.name}</div>
                <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden",marginBottom:8}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                      {["Unit / Room","Income","Expenses","NOI"].map(h=><th key={h} style={{padding:"8px 14px",textAlign:h==="Unit / Room"?"left":"right",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4}}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {units.map((u,i)=>{
                        // Income: sum of payments from rooms in this unit
                        const uRoomIds=(u.rooms||[]).map(r=>r.id);
                        const uInc=allCollected.filter(p=>p.date>=acctFrom&&p.date<=acctTo&&charges.find(c=>c.id===p.chargeId&&uRoomIds.includes(c.roomId))).reduce((s,p)=>s+p.amount,0);
                        const uExp=prExpenses.filter(e=>e.unitId===u.id).reduce((s,e)=>s+e.amount,0);
                        const uNOI=uInc-uExp;
                        return(<tr key={u.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                          <td style={{padding:"8px 14px",fontWeight:600}}>{u.name||("Unit "+(i+1))}</td>
                          <td style={{padding:"8px 14px",textAlign:"right",color:"#4a7c59"}}>{uInc>0?fmtS(uInc):"—"}</td>
                          <td style={{padding:"8px 14px",textAlign:"right",color:"#c45c4a"}}>{uExp>0?fmtS(uExp):"—"}</td>
                          <td style={{padding:"8px 14px",textAlign:"right",fontWeight:700,color:uNOI>=0?"#4a7c59":"#c45c4a"}}>{(uInc>0||uExp>0)?fmtS(uNOI):"—"}</td>
                        </tr>);
                      })}
                      {propWideAmt>0&&<tr style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:"rgba(212,168,83,.02)"}}>
                        <td style={{padding:"8px 14px",color:"#9a7422",fontStyle:"italic",fontSize:10}}>Property-wide (no unit assigned)</td>
                        <td style={{padding:"8px 14px",textAlign:"right"}}>—</td>
                        <td style={{padding:"8px 14px",textAlign:"right",color:"#c45c4a"}}>{fmtS(propWideAmt)}</td>
                        <td style={{padding:"8px 14px",textAlign:"right",color:"#c45c4a"}}>({fmtS(propWideAmt)})</td>
                      </tr>}
                    </tbody>
                  </table>
                </div>
              </div>);
            })}
          </>);
        })()}

        {/* ── INCOME ── */}
        {acctSubTab==="income"&&(()=>{
          const incSortCol=acctSort.col||"date";const incSortDir=acctSort.dir||"desc";
          const sorted=filtIncome.slice().sort((a,b)=>{
            let va,vb;
            if(incSortCol==="date"){va=a.date||"";vb=b.date||"";}
            else if(incSortCol==="property"){va=a.propName||"";vb=b.propName||"";}
            else if(incSortCol==="room"){va=a.roomName||"";vb=b.roomName||"";}
            else if(incSortCol==="tenant"){va=a.tenantName||"";vb=b.tenantName||"";}
            else if(incSortCol==="category"){va=a.category||"";vb=b.category||"";}
            else if(incSortCol==="method"){va=a.method||"";vb=b.method||"";}
            else if(incSortCol==="amount"){va=a.amount||0;vb=b.amount||0;return incSortDir==="asc"?va-vb:vb-va;}
            else{va=a.date||"";vb=b.date||"";}
            const cmp=String(va).localeCompare(String(vb));
            return incSortDir==="asc"?cmp:-cmp;
          });
          const toggleSort=(col)=>setAcctSort(p=>p.col===col?{col,dir:p.dir==="asc"?"desc":"asc"}:{col,dir:"asc"});
          const sortIcon=(col)=>acctSort.col===col?(acctSort.dir==="asc"?" ▲":" ▼"):"";
          return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:11,color:"#6b5e52"}}>{sorted.length} payment{sorted.length!==1?"s":""} · {fmtS(totalIncome)} collected</div>
            </div>
            <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                  {[["date","Date"],["property","Property"],["room","Room"],["tenant","Tenant"],["category","Category"],["method","Method"],["amount","Amount"]].map(([k,h])=>(
                    <th key={h} className="sort-hdr" onClick={()=>toggleSort(k)} style={{padding:"9px 14px",textAlign:h==="Amount"?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}{sortIcon(k)}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {sorted.length===0&&<tr><td colSpan={7} style={{padding:32,textAlign:"center",color:"#7a7067",fontSize:11}}>No income in this period. Payments are recorded in the Payments tab.</td></tr>}
                  {sorted.map((p,i)=>(
                    <tr key={i} className="acct-row" style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                      <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a",fontFamily:"monospace",whiteSpace:"nowrap"}}>{fmtDp(p.date)}</td>
                      <td style={{padding:"8px 14px",fontSize:11}}>{p.propName}</td>
                      <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{p.roomName||"—"}</td>
                      <td style={{padding:"8px 14px",fontWeight:600}}>{p.tenantName}</td>
                      <td style={{padding:"8px 14px"}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:100,background:"rgba(59,130,246,.08)",color:"#3b82f6",fontWeight:700}}>{p.category}</span></td>
                      <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{p.method||"—"}</td>
                      <td style={{padding:"8px 14px",textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                {sorted.length>0&&<tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                  <td colSpan={6} style={{padding:"10px 14px",fontWeight:800,fontSize:12}}>Total Collected</td>
                  <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#4a7c59",fontSize:14}}>{fmtS(totalIncome)}</td>
                </tr></tfoot>}
              </table>
            </div>
          </>);
        })()}

        {/* ── EXPENSES ── */}
        {acctSubTab==="expenses"&&(()=>{
          const uploadReceipt=async(file,expId)=>{
            if(!file)return;
            const ext=file.name.split(".").pop()||"jpg";
            const path="receipts/"+expId+"-"+Date.now()+"."+ext;
            try{
              const r=await fetch(SUPA_URL+"/storage/v1/object/receipts/"+path,{method:"POST",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":file.type,"x-upsert":"true"},body:file});
              if(!r.ok){alert("Upload failed: "+r.status);return;}
              setExpenses(prev=>prev.map(e=>e.id===expId?{...e,receiptUrl:SUPA_URL+"/storage/v1/object/public/receipts/"+path}:e));
            }catch(e){alert("Upload error: "+e.message);}
          };
          const expSortCol=acctSort.col||"date";const expSortDir=acctSort.dir||"desc";
          const sorted=filtExpenses.slice().sort((a,b)=>{
            let va,vb;
            if(expSortCol==="date"){va=a.date||"";vb=b.date||"";}
            else if(expSortCol==="property"){va=(a.propId==="shared"?"Shared":a.propName||"");vb=(b.propId==="shared"?"Shared":b.propName||"");}
            else if(expSortCol==="category"){va=a.category||"";vb=b.category||"";}
            else if(expSortCol==="subcategory"){va=a.subcategory||"";vb=b.subcategory||"";}
            else if(expSortCol==="vendor"){va=a.vendor||"";vb=b.vendor||"";}
            else if(expSortCol==="description"){va=a.description||"";vb=b.description||"";}
            else if(expSortCol==="amount"){va=a.amount||0;vb=b.amount||0;return expSortDir==="asc"?va-vb:vb-va;}
            else{va=a.date||"";vb=b.date||"";}
            const cmp=String(va).localeCompare(String(vb));
            return expSortDir==="asc"?cmp:-cmp;
          });
          const attachedCount=sorted.filter(e=>e.receiptUrl).length;
          const toggleSort=(col)=>setAcctSort(p=>p.col===col?{col,dir:p.dir==="asc"?"desc":"asc"}:{col,dir:"asc"});
          const sortIcon=(col)=>acctSort.col===col?(acctSort.dir==="asc"?" ▲":" ▼"):"";
          return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:11,color:"#6b5e52"}}>{sorted.length} expense{sorted.length!==1?"s":""} · {fmtS(totalExp)} total{attachedCount>0?" · "+attachedCount+" receipt"+((attachedCount!==1)?"s":"")+" attached":""}</div>
              <div style={{display:"flex",gap:6}}>
                {sorted.length>0&&<button className="btn btn-out btn-sm" onClick={()=>setModal({type:"exportExpenses",expenses:sorted,attachedCount})}>↓ Export</button>}
                <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"addExpense",form:{date:TODAY.toISOString().split("T")[0],propId:acctPropIds.length===1?acctPropIds[0]:"",category:"",subcategory:"",description:"",vendor:"",amount:"",paymentMethod:"",notes:"",unitId:"",unitName:"",roomId:"",roomName:""},errs:{}})}>+ Add Expense</button>
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"visible"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                  {[["date","Date"],["property","Property"],["","Unit / Room"],["category","Category"],["subcategory","Subcategory"],["vendor","Vendor"],["description","Description"],["","Method"],["amount","Amount"],["","Receipt"],["","Action"]].filter(([k,h])=>{
                    if(h==="Action")return true;
                    const hideKey=h.toLowerCase().replace(/\s*\/\s*/g,"_").replace(/\s+/g,"_");
                    return!acctHideCols[hideKey];
                  }).map(([k,h])=>(
                    <th key={h} className={k?"sort-hdr":""} onClick={k?()=>toggleSort(k):undefined} style={{padding:"9px 14px",textAlign:h==="Amount"?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",position:h==="Action"?"relative":"static"}}>
                      {h==="Action"?<span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end"}}>
                        <span>Action</span>
                        <div style={{position:"relative"}}>
                          <button className="gear-btn" onClick={e=>{e.stopPropagation();setAcctDrop(acctDrop==="colvis"?null:"colvis");}}>⚙</button>
                          {acctDrop==="colvis"&&<div className="gear-panel" onClick={e=>e.stopPropagation()}>
                            <div style={{padding:"6px 12px",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>Show / hide columns</div>
                            {["Unit / Room","Category","Subcategory","Vendor","Description","Method","Receipt"].map(col=>{
                              const hideKey=col.toLowerCase().replace(/\s*\/\s*/g,"_").replace(/\s+/g,"_");
                              return(<label key={col} className="ms-item">
                                <input type="checkbox" checked={!acctHideCols[hideKey]} onChange={()=>setAcctHideCols(p=>({...p,[hideKey]:!p[hideKey]}))}/>
                                <span>{col}</span>
                              </label>);
                            })}
                          </div>}
                        </div>
                      </span>:h}{k?sortIcon(k):""}
                    </th>
                  ))}
                </tr></thead>
                <tbody>
                  {sorted.length===0&&<tr><td colSpan={11} style={{padding:32,textAlign:"center",color:"#7a7067",fontSize:11}}>No expenses match your filters. Click "+ Add Expense" to record one.</td></tr>}
                  {sorted.map((e,i)=>{
                    const visibleCells=[];
                    if(!acctHideCols.date)visibleCells.push(<td key="date" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a",fontFamily:"monospace",whiteSpace:"nowrap"}}>{fmtDp(e.date)}</td>);
                    if(!acctHideCols.property)visibleCells.push(<td key="prop" style={{padding:"8px 14px",fontSize:10}}>
                      {e.propId==="shared"||e._isShared
                        ?<span style={{display:"inline-flex",alignItems:"center",gap:4}}>{e._isShared?(acctPropIds.length===1?(props.find(p=>p.id===acctPropIds[0])||{}).name:"Filtered"):"All Properties"} <span style={{fontSize:8,padding:"1px 6px",borderRadius:100,background:"rgba(59,130,246,.1)",color:"#3b82f6",fontWeight:700,whiteSpace:"nowrap"}}>SHARED{e._isShared?" · "+fmtS(e._fullAmount)+" total":""}</span></span>
                        :(props.find(p=>p.id===e.propId)||{}).name||"—"}
                    </td>);
                    if(!acctHideCols.unit_room)visibleCells.push(<td key="unit" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{e.unitName?(e.roomName?e.unitName+" / "+e.roomName:e.unitName):e.roomName||"—"}</td>);
                    if(!acctHideCols.category)visibleCells.push(<td key="cat" style={{padding:"8px 14px"}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:100,background:"rgba(212,168,83,.1)",color:"#9a7422",fontWeight:700,whiteSpace:"nowrap"}}>{e.category}</span></td>);
                    if(!acctHideCols.subcategory)visibleCells.push(<td key="subcat" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{e.subcategory||<span style={{color:"#7a7067"}}>—</span>}</td>);
                    if(!acctHideCols.vendor)visibleCells.push(<td key="vendor" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{e.vendor||"—"}</td>);
                    if(!acctHideCols.description)visibleCells.push(<td key="desc" style={{padding:"8px 14px",fontWeight:600,maxWidth:180}}>{e.description}</td>);
                    if(!acctHideCols.method)visibleCells.push(<td key="method" style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{e.paymentMethod||"—"}</td>);
                    if(!acctHideCols.amount)visibleCells.push(<td key="amt" style={{padding:"8px 14px",textAlign:"right",fontWeight:800,color:"#c45c4a",whiteSpace:"nowrap"}}>{fmtS(e.amount)}</td>);
                    if(!acctHideCols.receipt)visibleCells.push(<td key="rcpt" style={{padding:"8px 14px"}}>
                      {e.receiptUrl
                        ?<a href={e.receiptUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:e._receiptPending?"#d4a853":"#4a7c59",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:3}}>{e._receiptPending?"📎 Local":"📎 Attached"}</a>
                        :<label style={{fontSize:10,color:"#d4a853",cursor:"pointer",fontWeight:600,display:"inline-flex",alignItems:"center",gap:3}}>+ Upload<input type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={ev=>uploadReceipt(ev.target.files[0],e.id)}/></label>}
                    </td>);
                    visibleCells.push(<td key="action" style={{padding:"8px 14px",whiteSpace:"nowrap"}}>
                      <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
                        <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"addExpense",editId:e.id,form:{...e},errs:{}})}>Edit</button>
                        <div className="dot-menu">
                          <button className="dot-btn" onClick={ev=>{ev.stopPropagation();setAcctDotMenu(acctDotMenu===e.id?null:e.id);}}>⋮</button>
                          {acctDotMenu===e.id&&<div className="dot-panel" onClick={ev=>ev.stopPropagation()}>
                            <button className="dot-opt danger" onClick={()=>{setAcctDotMenu(null);setModal({type:"confirmDeleteExpense",expId:e.id,description:e.description||e.category});}}>Delete</button>
                          </div>}
                        </div>
                      </div>
                    </td>);
                    return(<tr key={e.id} className="acct-row" onClick={()=>setAcctDotMenu(null)} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:e._isShared?"rgba(59,130,246,.02)":i%2===0?"#fff":"rgba(0,0,0,.01)"}}>{visibleCells}</tr>);
                  })}
                </tbody>
                {sorted.length>0&&<tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                  <td colSpan={8} style={{padding:"10px 14px",fontWeight:800,fontSize:12}}>Total Expenses</td>
                  <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#c45c4a",fontSize:14}}>{fmtS(totalExp)}</td>
                  <td colSpan={2}/>
                </tr></tfoot>}
              </table>
            </div>
          </>);
        })()}

        {/* ── MORTGAGES ── */}
        {acctSubTab==="mortgages"&&(()=>{
          const filtMg=!hasPropFilter?mortgages:mortgages.filter(mg=>acctPropIds.includes(mg.propId));
          return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#3c3228"}}>Mortgage Register</div>
                <div style={{fontSize:10,color:"#6b5e52",marginTop:1}}>One record per loan. Feeds DSCR and Schedule E Line 12.</div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"addMortgage",form:{propId:acctPropIds.length===1?acctPropIds[0]:(props[0]?.id||""),lender:"",originalBalance:"",currentBalance:"",interestRate:"",monthlyPI:"",startDate:"",maturityDate:"",accountLast4:"",notes:""},errs:{}})}>+ Add Mortgage</button>
            </div>

            {filtMg.length===0
              ?<div style={{textAlign:"center",padding:36,color:"#7a7067",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",fontSize:11}}>No mortgages on record. Add one to enable DSCR and Schedule E interest calculations.</div>
              :<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                    {["Property","Lender","Account","Orig. Balance","Current Balance","Rate","Monthly P&I","Maturity",""].map(h=>(
                      <th key={h} style={{padding:"9px 14px",textAlign:["Orig. Balance","Current Balance","Rate","Monthly P&I"].includes(h)?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtMg.map((mg,i)=>{
                      const pr=props.find(p=>p.id===mg.propId);
                      const annualInterest=(mg.currentBalance||0)*(mg.interestRate||0)/100;
                      return(
                      <tr key={mg.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                        <td style={{padding:"9px 14px",fontWeight:700}}>{pr?.name||"—"}</td>
                        <td style={{padding:"9px 14px"}}>{mg.lender||"—"}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#5c4a3a",fontFamily:"monospace"}}>{mg.accountLast4?"****"+mg.accountLast4:"—"}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",color:"#5c4a3a"}}>{fmtS(mg.originalBalance||0)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:700,color:"#c45c4a"}}>{fmtS(mg.currentBalance||0)}</td>
                        <td style={{padding:"9px 14px",textAlign:"right"}}>{(mg.interestRate||0)+"%"}</td>
                        <td style={{padding:"9px 14px",textAlign:"right",fontWeight:700}}>{fmtS(mg.monthlyPI||0)}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#5c4a3a"}}>{mg.maturityDate||"—"}</td>
                        <td style={{padding:"9px 14px"}}>
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"addMortgage",editId:mg.id,form:{...mg},errs:{}})}>Edit</button>
                            <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#c45c4a"}} onClick={()=>setModal({type:"deleteMortgage",mgId:mg.id,lender:mg.lender})}>Delete</button>
                          </div>
                        </td>
                      </tr>);
                    })}
                  </tbody>
                  <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                    <td colSpan={4} style={{padding:"10px 14px",fontWeight:800}}>Portfolio Total</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(filtMg.reduce((s,mg)=>s+(mg.currentBalance||0),0))}</td>
                    <td/>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800}}>{fmtS(filtMg.reduce((s,mg)=>s+(mg.monthlyPI||0),0))}/mo</td>
                    <td colSpan={2}/>
                  </tr></tfoot>
                </table>
              </div>}

            {/* Est. annual interest note for Schedule E */}
            {filtMg.length>0&&<div style={{marginTop:10,padding:"10px 14px",background:"rgba(212,168,83,.06)",borderRadius:8,border:"1px solid rgba(212,168,83,.15)",fontSize:11,color:"#9a7422"}}>
              <strong>Est. Annual Interest (Schedule E Line 12):</strong> {fmtS(filtMg.reduce((s,mg)=>s+(mg.currentBalance||0)*(mg.interestRate||0)/100,0))} — based on current balances and rates. Use your actual 1098 form for exact figures.
            </div>}
          </>);
        })()}
        {/* ── IMPROVEMENTS ── */}
        {acctSubTab==="improvements"&&(()=>{
          const filtImprove=improvements.filter(im=>!hasPropFilter||acctPropIds.includes(im.propId));
          const totalImprove=filtImprove.reduce((s,im)=>s+im.amount,0);
          return(<>
            <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:800,color:"#3c3228",marginBottom:8}}>Expense vs. Capital Improvement — What's the difference?</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:11}}>
                <div style={{padding:"10px 12px",borderRadius:8,background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.12)"}}>
                  <div style={{fontWeight:700,color:"#4a7c59",marginBottom:4}}>Expense (Schedule E)</div>
                  <div style={{color:"#5c4a3a",lineHeight:1.6}}>Deducted in full <strong>this year</strong>. Restores the property to its original condition — fixing what broke, not making it better. Examples: fixing a leaky faucet, repainting worn walls, replacing a broken appliance with a similar one, pest control, cleaning.</div>
                </div>
                <div style={{padding:"10px 12px",borderRadius:8,background:"rgba(59,130,246,.04)",border:"1px solid rgba(59,130,246,.12)"}}>
                  <div style={{fontWeight:700,color:"#3b82f6",marginBottom:4}}>Capital Improvement</div>
                  <div style={{color:"#5c4a3a",lineHeight:1.6}}>Added to your <strong>cost basis</strong>, depreciated over 27.5 years — NOT deducted this year. Adds value or extends the property's useful life. Examples: new roof, full HVAC replacement, addition, new flooring throughout, new appliances that upgrade the unit.</div>
                </div>
              </div>
              <div style={{marginTop:10,fontSize:10,color:"#9a7422",padding:"6px 10px",background:"rgba(212,168,83,.06)",borderRadius:6}}>When in doubt, ask your CPA. The IRS scrutinizes this distinction closely. If it improves, extends, or adapts — it's CapEx.</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:11,color:"#6b5e52"}}>{filtImprove.length} improvement{filtImprove.length!==1?"s":""} · {fmtS(totalImprove)} total cost basis additions</div>
              <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"addImprovement",form:{date:TODAY.toISOString().split("T")[0],propId:acctPropIds.length===1?acctPropIds[0]:(props[0]?.id||""),improvementType:"",description:"",contractor:"",amount:"",notes:""},errs:{}})}>+ Add Improvement</button>
            </div>
            {filtImprove.length===0
              ?<div style={{textAlign:"center",padding:36,color:"#7a7067",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",fontSize:11}}>No capital improvements recorded. New roof, HVAC, addition, appliances — log them here for your CPA.</div>
              :<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                    {["Date","Property","Type","Subcategory","Description","Contractor","Receipt","Amount",""].map(h=>(
                      <th key={h} style={{padding:"9px 14px",textAlign:h==="Amount"?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtImprove.slice().sort((a,b)=>b.date?.localeCompare(a.date||"")||0).map((im,i)=>(
                      <tr key={im.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                        <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a",fontFamily:"monospace",whiteSpace:"nowrap"}}>{im.date}</td>
                        <td style={{padding:"8px 14px",fontSize:10}}>{(props.find(p=>p.id===im.propId)||{}).name||"—"}</td>
                        <td style={{padding:"8px 14px"}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:100,background:"rgba(59,130,246,.08)",color:"#3b82f6",fontWeight:700}}>{im.improvementType||"—"}</span></td>
                        <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{im.subcategory||<span style={{color:"#7a7067"}}>—</span>}</td>
                        <td style={{padding:"8px 14px",fontWeight:600}}>{im.description}</td>
                        <td style={{padding:"8px 14px",fontSize:10,color:"#5c4a3a"}}>{im.contractor||"—"}</td>
                        <td style={{padding:"8px 14px"}}>
                          {im.receiptUrl
                            ?<a href={im.receiptUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"#3b82f6",fontWeight:600,textDecoration:"none"}}>View</a>
                            :<label style={{fontSize:10,color:"#d4a853",cursor:"pointer",fontWeight:600}}>Upload
                              <input type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={async ev=>{
                                const file=ev.target.files[0];if(!file)return;
                                const ext=file.name.split(".").pop()||"jpg";
                                const path="receipts/"+im.id+"-"+Date.now()+"."+ext;
                                const r=await fetch(SUPA_URL+"/storage/v1/object/receipts/"+path,{method:"POST",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":file.type,"x-upsert":"true"},body:file});
                                if(r.ok)setImprovements(prev=>prev.map(x=>x.id===im.id?{...x,receiptUrl:SUPA_URL+"/storage/v1/object/public/receipts/"+path}:x));
                              }}/>
                            </label>}
                        </td>
                        <td style={{padding:"8px 14px",textAlign:"right",fontWeight:800,color:"#3b82f6",whiteSpace:"nowrap"}}>{fmtS(im.amount)}</td>
                        <td style={{padding:"8px 14px"}}>
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"addImprovement",editId:im.id,form:{...im},errs:{}})}>Edit</button>
                            <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#c45c4a"}} onClick={()=>setModal({type:"deleteImprovement",imId:im.id,description:im.description})}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                    <td colSpan={7} style={{padding:"10px 14px",fontWeight:800,fontSize:12}}>Total Cost Basis Additions</td>
                    <td style={{padding:"10px 14px",textAlign:"right",fontWeight:800,color:"#3b82f6",fontSize:14}}>{fmtS(totalImprove)}</td>
                    <td/>
                  </tr></tfoot>
                </table>
              </div>}
          </>);
        })()}

        {/* ── VENDORS ── */}
        {acctSubTab==="vendors"&&(()=>{
          return(<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#3c3228"}}>Vendor / Payee List</div>
                <div style={{fontSize:10,color:"#6b5e52",marginTop:1}}>Saved vendors auto-populate when adding expenses.</div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={()=>setModal({type:"addVendor",form:{name:"",phone:"",email:"",notes:""},errs:{}})}>+ Add Vendor</button>
            </div>
            {vendors.length===0
              ?<div style={{textAlign:"center",padding:36,color:"#7a7067",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",fontSize:11}}>No vendors saved yet. You can save vendors while adding expenses, or add them here.</div>
              :<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                    {["Vendor / Payee","Phone","Email","Notes",""].map(h=>(
                      <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {vendors.slice().sort((a,b)=>a.name?.localeCompare(b.name||"")||0).map((v,i)=>(
                      <tr key={v.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                        <td style={{padding:"9px 14px",fontWeight:700}}>{v.name}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#5c4a3a"}}>{v.phone||"—"}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#5c4a3a"}}>{v.email||"—"}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:"#6b5e52",fontStyle:v.notes?"normal":"italic"}}>{v.notes||"—"}</td>
                        <td style={{padding:"9px 14px"}}>
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal({type:"addVendor",editId:v.id,form:{...v},errs:{}})}>Edit</button>
                            <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#c45c4a"}} onClick={()=>setModal({type:"deleteVendor",vendorId:v.id,name:v.name})}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>}
          </>);
        })()}
        </>);
      })()}
      {tab==="reports"&&(()=>{
        const rFrom=reportPeriod.from||(TODAY.getFullYear()+"-01-01");
        const rTo=reportPeriod.to||TODAY.toISOString().split("T")[0];
        const rProps=reportProp==="all"?props:props.filter(p=>p.id===reportProp);

        // Filtered data helpers
        const rCharges=charges.filter(c=>c.dueDate>=rFrom&&c.dueDate<=rTo&&(reportProp==="all"||rProps.some(p=>p.name===c.propName)));
        const rPayments=charges.flatMap(c=>c.payments.map(p=>({...p,propName:c.propName,tenantName:c.tenantName,category:c.category,chargeId:c.id}))).filter(p=>p.date>=rFrom&&p.date<=rTo&&(reportProp==="all"||rProps.some(x=>x.name===p.propName)));
        const rExpenses=expenses.filter(e=>e.date>=rFrom&&e.date<=rTo&&(reportProp==="all"||rProps.some(p=>p.id===e.propId)||e.propId==="shared"));
        const rMortgages=mortgages.filter(mg=>reportProp==="all"||rProps.some(p=>p.id===mg.propId));
        const totalIncome=rPayments.reduce((s,p)=>s+p.amount,0);
        const totalExp=rExpenses.reduce((s,e)=>s+e.amount,0);
        const totalNOI=totalIncome-totalExp;
        const annualDebt=rMortgages.reduce((s,mg)=>s+(mg.monthlyPI||0)*12,0);
        const rDSCR=annualDebt>0?(totalNOI/annualDebt):null;

        const printReport=()=>window.print();
        const exportCSV=(rows,headers,filename)=>{
          const csv=[headers.join(","),...rows.map(r=>headers.map(h=>JSON.stringify(r[h]||"")).join(","))].join("\n");
          const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download=filename+".csv";a.click();
        };

        const RIcon=({d,d2})=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d}/>{d2&&<path d={d2}/>}</svg>;
        const reports=[
          {id:"rentroll",icon:<RIcon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>,title:"Rent Roll",desc:"Live snapshot of all units — tenant, lease dates, rent, status"},
          {id:"pnl",icon:<RIcon d="M18 20V10M12 20V4M6 20v-6"/>,title:"P&L by Property",desc:"Income minus expenses per property — Net Operating Income"},
          {id:"schede",icon:<RIcon d="M9 11l3 3L22 4" d2="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>,title:"Schedule E Summary",desc:"All 19 Schedule E lines per property — ready for your CPA"},
          {id:"cashflow",icon:<RIcon d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>,title:"Cash Flow Statement",desc:"Collected rent minus expenses minus debt service"},
          {id:"aging",icon:<RIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,title:"AR Aging",desc:"Outstanding receivables bucketed: current, 30, 60, 90+ days"},
          {id:"sdledger",icon:<RIcon d="M19 11H5M19 11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2M19 11V9a7 7 0 1 0-14 0v2"/>,title:"SD Liability Ledger",desc:"Security deposits held — liability for your balance sheet"},
          {id:"occupancy",icon:<RIcon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10"/>,title:"Occupancy Report",desc:"Occupancy rate, vacancy days, and lost revenue per property"},
          {id:"trailing12",icon:<RIcon d="M23 6l-9.5 9.5-5-5L1 18"/>,title:"Trailing 12 Income",desc:"Month-by-month collected rent for the past 12 months"},
          {id:"dscr",icon:<RIcon d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" d2="M13 13l6 6"/>,title:"DSCR Report",desc:"Debt Service Coverage Ratio — required for refi/acquisition loans"},
          {id:"tenantledger",icon:<RIcon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" d2="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z"/>,title:"Tenant Ledger",desc:"Full charge and payment history per tenant — printable statement"},
          {id:"leadsource",icon:<RIcon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" d2="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>,title:"Lead Source Analytics",desc:"Which channels convert best — pipeline, approvals, denials by source"},
          {id:"tenantquality",icon:<RIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,title:"Tenant Quality by Source",desc:"Avg tenure, lease completion rate, and broke-lease % by acquisition channel"},
        ];

        return(<>
        <div className="sec-hd"><div><h2>Reports</h2></div></div>

        {/* Filters */}
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:16,padding:"12px 14px",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)"}}>
          <select value={reportProp} onChange={e=>setReportProp(e.target.value)} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}>
            <option value="all">All Properties</option>{props.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="date" value={reportPeriod.from} onChange={e=>setReportPeriod(p=>({...p,from:e.target.value}))} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11}}/>
          <span style={{fontSize:11,color:"#6b5e52"}}>to</span>
          <input type="date" value={reportPeriod.to} onChange={e=>setReportPeriod(p=>({...p,to:e.target.value}))} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11}}/>
          <button className="btn btn-out btn-sm" onClick={()=>{setReportPeriod({from:TODAY.getFullYear()+"-01-01",to:TODAY.toISOString().split("T")[0]});}}>YTD</button>
          <button className="btn btn-out btn-sm" onClick={()=>{const y=TODAY.getFullYear()-1;setReportPeriod({from:y+"-01-01",to:y+"-12-31"});}}>Last Year</button>
          <button className="btn btn-out btn-sm" onClick={()=>{const m=String(TODAY.getMonth()+1).padStart(2,"0");setReportPeriod({from:TODAY.getFullYear()+"-"+m+"-01",to:rTo});}}>MTD</button>
        </div>

        {/* Report cards grid (when none active) */}
        {!activeReport&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
          {reports.map(r=>(
            <div key={r.id} style={{background:"#fff",borderRadius:10,padding:"16px",border:"1px solid rgba(0,0,0,.06)",cursor:"pointer",transition:"all .15s"}}
              onClick={()=>setActiveReport(r.id)}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(212,168,83,.4)";e.currentTarget.style.background="rgba(212,168,83,.02)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,0,0,.06)";e.currentTarget.style.background="#fff";}}>
              <div style={{marginBottom:10,color:"#5c4a3a"}}>{r.icon}</div>
              <div style={{fontWeight:800,fontSize:13,marginBottom:4}}>{r.title}</div>
              <div style={{fontSize:11,color:"#6b5e52",lineHeight:1.5}}>{r.desc}</div>
              <div style={{marginTop:10,fontSize:10,color:"#d4a853",fontWeight:700}}>Open →</div>
            </div>
          ))}
        </div>}

        {/* Active report */}
        {activeReport&&(()=>{
          const rep=reports.find(r=>r.id===activeReport);
          return(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button className="btn btn-out btn-sm" onClick={()=>setActiveReport(null)}>← Back</button>
              <div style={{display:"flex",alignItems:"center",gap:8,color:"#5c4a3a"}}>{rep.icon}<h3 style={{margin:0,fontSize:15}}>{rep.title}</h3></div>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button className="btn btn-out btn-sm" onClick={printReport}>🖨 Print / PDF</button>
            </div>
          </div>

          {/* ── Rent Roll ── */}
          {activeReport==="rentroll"&&(()=>{
            const rows=rProps.flatMap(pr=>(pr.units||[]).flatMap(u=>{
              if(u.ownerOccupied)return[];
              const isWhole=(u.rentalMode||"byRoom")==="wholeHouse";
              if(isWhole){const rep=(u.rooms||[]).find(r=>r.tenant);return[{prop:pr.name,unit:u.name||pr.name,type:"Whole Unit",tenant:rep?.tenant?.name||"Vacant",rent:fmtS(u.rent||0),moveIn:rep?.tenant?.moveIn||"—",leaseEnd:rep?.le||"—",status:rep?"Occupied":"Vacant"}];}
              return(u.rooms||[]).filter(r=>!r.ownerOccupied).map(r=>({prop:pr.name,unit:r.name,type:"By Room",tenant:r.tenant?.name||"Vacant",rent:fmtS(r.rent),moveIn:r.tenant?.moveIn||"—",leaseEnd:r.le||"—",status:r.st==="occupied"?"Occupied":"Vacant"}));
            }));
            return(<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                  {["Property","Unit","Type","Tenant","Rent/Mo","Move-In","Lease End","Status"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,whiteSpace:"nowrap"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {rows.map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                    <td style={{padding:"8px 12px",fontWeight:600}}>{r.prop}</td><td style={{padding:"8px 12px"}}>{r.unit}</td><td style={{padding:"8px 12px",fontSize:10,color:"#6b5e52"}}>{r.type}</td>
                    <td style={{padding:"8px 12px",fontWeight:r.tenant!=="Vacant"?700:400,color:r.tenant==="Vacant"?"#c45c4a":"inherit"}}>{r.tenant}</td>
                    <td style={{padding:"8px 12px",fontWeight:700}}>{r.rent}</td>
                    <td style={{padding:"8px 12px",fontSize:10,color:"#6b5e52",fontFamily:"monospace"}}>{r.moveIn}</td>
                    <td style={{padding:"8px 12px",fontSize:10,color:"#6b5e52",fontFamily:"monospace"}}>{r.leaseEnd}</td>
                    <td style={{padding:"8px 12px"}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:100,fontWeight:700,background:r.status==="Occupied"?"rgba(74,124,89,.08)":"rgba(196,92,74,.08)",color:r.status==="Occupied"?"#4a7c59":"#c45c4a"}}>{r.status}</span></td>
                  </tr>)}
                </tbody>
                <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                  <td colSpan={4} style={{padding:"10px 12px",fontWeight:800}}>Totals: {rows.length} units · {rows.filter(r=>r.status==="Occupied").length} occupied · {rows.filter(r=>r.status==="Vacant").length} vacant</td>
                  <td style={{padding:"10px 12px",fontWeight:800,color:"#4a7c59"}}>{fmtS(rProps.flatMap(pr=>(pr.units||[]).flatMap(u=>(u.rentalMode||"byRoom")==="wholeHouse"?[u.rent||0]:(u.rooms||[]).map(r=>r.rent))).reduce((s,r)=>s+r,0))}/mo potential</td>
                  <td colSpan={3}/>
                </tr></tfoot>
              </table>
            </div>);
          })()}

          {/* ── P&L by Property ── */}
          {activeReport==="pnl"&&(()=>{
            return(<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                  {["Property","Gross Income","Total Expenses","NOI","Margin"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:h==="Property"?"left":"right",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {rProps.map((pr,i)=>{
                    const inc=rPayments.filter(p=>p.propName===pr.name).reduce((s,p)=>s+p.amount,0);
                    const directExp=rExpenses.filter(e=>e.propId===pr.id).reduce((s,e)=>s+e.amount,0);
                    const sharedAlloc=rExpenses.filter(e=>e.propId==="shared").reduce((s,e)=>s+Math.round(e.amount/(props.length||1)*100)/100,0);
                    const exp=directExp+sharedAlloc;
                    const noi=inc-exp;const margin=inc>0?Math.round(noi/inc*100):0;
                    return(<tr key={pr.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                      <td style={{padding:"8px 12px",fontWeight:700}}>{pr.name}</td>
                      <td style={{padding:"8px 12px",textAlign:"right",color:"#4a7c59",fontWeight:700}}>{fmtS(inc)}</td>
                      <td style={{padding:"8px 12px",textAlign:"right",color:"#c45c4a",fontWeight:700}}>{fmtS(exp)}</td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:800,color:noi>=0?"#4a7c59":"#c45c4a"}}>{fmtS(noi)}</td>
                      <td style={{padding:"8px 12px",textAlign:"right",color:margin>=0?"#4a7c59":"#c45c4a",fontWeight:700}}>{margin}%</td>
                    </tr>);
                  })}
                </tbody>
                <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                  <td style={{padding:"10px 12px",fontWeight:800}}>Portfolio Total</td>
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(totalIncome)}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(totalExp)}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:totalNOI>=0?"#4a7c59":"#c45c4a",fontSize:14}}>{fmtS(totalNOI)}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800}}>{totalIncome>0?Math.round(totalNOI/totalIncome*100):0}%</td>
                </tr></tfoot>
              </table>
            </div>);
          })()}

          {/* ── Schedule E ── */}
          {activeReport==="schede"&&(()=>{
            return(<>
              {rProps.map(pr=>{
                const prIncome=rPayments.filter(p=>p.propName===pr.name).reduce((s,p)=>s+p.amount,0);
                const prExp=[...rExpenses.filter(e=>e.propId===pr.id),...rExpenses.filter(e=>e.propId==="shared").map(e=>({...e,amount:Math.round(e.amount/(props.length||1)*100)/100}))];
                const expByLine={};prExp.forEach(e=>{expByLine[e.category]=(expByLine[e.category]||0)+e.amount;});
                const totalExp=prExp.reduce((s,e)=>s+e.amount,0);
                const mg=rMortgages.filter(m=>m.propId===pr.id);
                const mgInterest=mg.reduce((s,m)=>s+(m.currentBalance||0)*(m.interestRate||0)/100,0);
                if(expByLine["Mortgage Interest"])expByLine["Mortgage Interest"]+=mgInterest;
                else if(mg.length>0)expByLine["Mortgage Interest"]=mgInterest;
                return(
                <div key={pr.id} style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",marginBottom:12,overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",borderBottom:"2px solid rgba(0,0,0,.06)",fontWeight:800,fontSize:13,background:"#f8f7f4"}}>{pr.name} — Schedule E Summary ({rFrom.slice(0,4)})</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <tbody>
                      <tr style={{background:"rgba(74,124,89,.04)"}}><td style={{padding:"8px 16px",fontWeight:700,color:"#4a7c59"}}>Line 3 — Gross Rents Received</td><td style={{padding:"8px 16px",textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(prIncome)}</td></tr>
                      {SCHED_E_CATS.map(({label:cat,line})=>{const amt=expByLine[cat]||0;return amt>0?(
                        <tr key={cat} style={{borderTop:"1px solid rgba(0,0,0,.03)"}}><td style={{padding:"8px 16px",color:"#5c4a3a"}}>{cat}</td><td style={{padding:"8px 16px",textAlign:"right",fontWeight:700,color:"#c45c4a"}}>{fmtS(amt)}</td></tr>
                      ):null;})}
                      <tr style={{borderTop:"2px solid rgba(0,0,0,.08)",background:"rgba(59,130,246,.04)"}}><td style={{padding:"10px 16px",fontWeight:800,color:"#3b82f6"}}>Line 22 — Total Expenses</td><td style={{padding:"10px 16px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(totalExp)}</td></tr>
                      <tr style={{background:"rgba(74,124,89,.04)"}}><td style={{padding:"10px 16px",fontWeight:800,color:"#4a7c59"}}>Net Income / (Loss)</td><td style={{padding:"10px 16px",textAlign:"right",fontWeight:800,fontSize:14,color:(prIncome-totalExp)>=0?"#4a7c59":"#c45c4a"}}>{fmtS(prIncome-totalExp)}</td></tr>
                    </tbody>
                  </table>
                </div>);
              })}
            </>);
          })()}

          {/* ── Cash Flow ── */}
          {activeReport==="cashflow"&&(()=>{
            const debtService=rMortgages.reduce((s,mg)=>s+(mg.monthlyPI||0)*12,0);
            const fcf=totalNOI-debtService;
            return(<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <tbody>
                  {[["Gross Rent Collected",totalIncome,"#4a7c59",false],["Total Operating Expenses",-totalExp,"#c45c4a",false],["Net Operating Income (NOI)",totalNOI,totalNOI>=0?"#4a7c59":"#c45c4a",true],["Annual Debt Service (P&I)",-debtService,"#9a7422",false],["Free Cash Flow",fcf,fcf>=0?"#4a7c59":"#c45c4a",true]].map(([label,val,color,bold])=>(
                    <tr key={label} style={{borderBottom:"1px solid rgba(0,0,0,.04)",background:bold?"rgba(0,0,0,.02)":"#fff"}}>
                      <td style={{padding:"12px 16px",fontWeight:bold?800:500,color:bold?"#1a1714":"#5c4a3a"}}>{label}</td>
                      <td style={{padding:"12px 16px",textAlign:"right",fontWeight:bold?800:600,color,fontSize:bold?15:13}}>{val<0?"("+fmtS(Math.abs(val))+")":fmtS(val)}</td>
                    </tr>
                  ))}
                  <tr style={{background:"rgba(212,168,83,.06)",borderTop:"2px solid rgba(212,168,83,.2)"}}>
                    <td style={{padding:"12px 16px",fontWeight:800,color:"#9a7422"}}>DSCR</td>
                    <td style={{padding:"12px 16px",textAlign:"right",fontWeight:800,color:rDSCR==null?"#999":rDSCR>=1.25?"#4a7c59":"#c45c4a",fontSize:16}}>{rDSCR!=null?rDSCR.toFixed(2)+"x":"N/A — no mortgages"}</td>
                  </tr>
                </tbody>
              </table>
              {rDSCR!=null&&<div style={{padding:"10px 16px",fontSize:11,color:"#6b5e52",borderTop:"1px solid rgba(0,0,0,.04)"}}>Lenders typically require DSCR ≥ 1.25. {rDSCR>=1.25?"✅ You qualify.":"⚠️ Below typical lender threshold."}</div>}
            </div>);
          })()}

          {/* ── AR Aging ── */}
          {activeReport==="aging"&&(()=>{
            const unpaid=charges.filter(c=>!c.voided&&!c.waived&&c.amountPaid<c.amount&&(reportProp==="all"||rProps.some(p=>p.name===c.propName)));
            const buckets={"Current":[0,30],"31-60 Days":[31,60],"61-90 Days":[61,90],"90+ Days":[91,9999]};
            return(<>
              {Object.entries(buckets).map(([label,[min,max]])=>{
                const rows=unpaid.filter(c=>{const dl=Math.ceil((TODAY-new Date(c.dueDate+"T00:00:00"))/(1e3*60*60*24));return dl>=min&&dl<=max;});
                if(rows.length===0)return null;
                return(<div key={label} style={{marginBottom:12}}>
                  <div style={{fontWeight:700,fontSize:12,color:min>60?"#c45c4a":min>30?"#d4a853":"#5c4a3a",marginBottom:6}}>{label} ({rows.length} charges · {fmtS(rows.reduce((s,c)=>s+c.amount-c.amountPaid,0))} outstanding)</div>
                  <div style={{background:"#fff",borderRadius:8,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead><tr style={{background:"#f8f7f4"}}>{["Tenant","Property","Description","Due Date","Balance"].map(h=><th key={h} style={{padding:"7px 12px",textAlign:h==="Balance"?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                      <tbody>{rows.map((c,i)=><tr key={c.id} style={{borderTop:"1px solid rgba(0,0,0,.03)"}}><td style={{padding:"7px 12px",fontWeight:600}}>{c.tenantName}</td><td style={{padding:"7px 12px",fontSize:10,color:"#6b5e52"}}>{c.propName}</td><td style={{padding:"7px 12px"}}>{c.desc}</td><td style={{padding:"7px 12px",fontSize:10,fontFamily:"monospace",color:"#c45c4a"}}>{c.dueDate}</td><td style={{padding:"7px 12px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(c.amount-c.amountPaid)}</td></tr>)}</tbody>
                    </table>
                  </div>
                </div>);
              })}
              <div style={{background:"rgba(196,92,74,.06)",borderRadius:8,padding:"12px 16px",border:"1px solid rgba(196,92,74,.1)",marginTop:4}}>
                <span style={{fontWeight:800,color:"#c45c4a"}}>Total Outstanding AR: </span><span style={{fontWeight:800,fontSize:16,color:"#c45c4a"}}>{fmtS(unpaid.reduce((s,c)=>s+c.amount-c.amountPaid,0))}</span>
              </div>
            </>);
          })()}

          {/* ── SD Liability Ledger ── */}
          {activeReport==="sdledger"&&(()=>{
            const rows=sdLedger.filter(s=>reportProp==="all"||rProps.some(p=>p.name===s.propName));
            const totalHeld=rows.reduce((s,r)=>s+(r.amountHeld||0),0);
            const totalDed=rows.reduce((s,r)=>s+(r.deductions||[]).reduce((d,x)=>d+x.amount,0),0);
            return(<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>{["Tenant","Property","Room","SD Held","Deductions","Net Liability","Status"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:["SD Held","Deductions","Net Liability"].includes(h)?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}</tr></thead>
                <tbody>
                  {rows.length===0&&<tr><td colSpan={7} style={{padding:24,textAlign:"center",color:"#6b5e52"}}>No security deposit records found.</td></tr>}
                  {rows.map((r,i)=>{const ded=((r.deductions||[]).reduce((s,d)=>s+d.amount,0));const net=r.amountHeld-ded;return(
                    <tr key={r.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                      <td style={{padding:"8px 12px",fontWeight:600}}>{r.tenantName}</td><td style={{padding:"8px 12px",fontSize:10}}>{r.propName}</td><td style={{padding:"8px 12px",fontSize:10,color:"#6b5e52"}}>{r.roomName}</td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:700}}>{fmtS(r.amountHeld||0)}</td>
                      <td style={{padding:"8px 12px",textAlign:"right",color:"#c45c4a"}}>{ded>0?fmtS(ded):"—"}</td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:800,color:"#9a7422"}}>{fmtS(net)}</td>
                      <td style={{padding:"8px 12px"}}><span style={{fontSize:9,padding:"2px 7px",borderRadius:100,fontWeight:700,background:r.returned?"rgba(74,124,89,.08)":"rgba(212,168,83,.1)",color:r.returned?"#4a7c59":"#9a7422"}}>{r.returned?"Returned":"Held"}</span></td>
                    </tr>);})}
                </tbody>
                <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                  <td colSpan={3} style={{padding:"10px 12px",fontWeight:800}}>Total SD Liability</td>
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800}}>{fmtS(totalHeld)}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:"#c45c4a"}}>{fmtS(totalDed)}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:"#9a7422",fontSize:14}}>{fmtS(totalHeld-totalDed)}</td>
                  <td/>
                </tr></tfoot>
              </table>
            </div>);
          })()}

          {/* ── Occupancy Report ── */}
          {activeReport==="occupancy"&&(()=>{
            return(<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>{["Property","Total Units","Occupied","Vacant","Occ Rate","Potential Rent","Actual Rent","Vacancy Loss"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:["Potential Rent","Actual Rent","Vacancy Loss"].includes(h)?"right":"center",textAlign:h==="Property"?"left":"center",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.4}}>{h}</th>)}</tr></thead>
                <tbody>
                  {rProps.map((pr,i)=>{
                    const rooms=allRooms(pr).filter(r=>!r.ownerOccupied);
                    const occ=rooms.filter(r=>r.st==="occupied");
                    const vac=rooms.filter(r=>r.st!=="occupied");
                    const potRent=rooms.reduce((s,r)=>s+r.rent,0);
                    const actRent=occ.reduce((s,r)=>s+r.rent,0);
                    const occRate=rooms.length?Math.round(occ.length/rooms.length*100):0;
                    return(<tr key={pr.id} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                      <td style={{padding:"8px 12px",fontWeight:700}}>{pr.name}</td>
                      <td style={{padding:"8px 12px",textAlign:"center"}}>{rooms.length}</td>
                      <td style={{padding:"8px 12px",textAlign:"center",color:"#4a7c59",fontWeight:700}}>{occ.length}</td>
                      <td style={{padding:"8px 12px",textAlign:"center",color:vac.length>0?"#c45c4a":"#999",fontWeight:vac.length>0?700:400}}>{vac.length}</td>
                      <td style={{padding:"8px 12px",textAlign:"center"}}><span style={{fontWeight:800,color:occRate>=90?"#4a7c59":occRate>=70?"#d4a853":"#c45c4a"}}>{occRate}%</span></td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:600}}>{fmtS(potRent)}/mo</td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:700,color:"#4a7c59"}}>{fmtS(actRent)}/mo</td>
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:700,color:potRent-actRent>0?"#c45c4a":"#4a7c59"}}>{fmtS(potRent-actRent)}/mo</td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>);
          })()}

          {/* ── Trailing 12 ── */}
          {activeReport==="trailing12"&&(()=>{
            const months=Array.from({length:12},(_,i)=>{const d=new Date(TODAY);d.setMonth(d.getMonth()-11+i);return d.toISOString().slice(0,7);});
            return(<div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>
                  <th style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase"}}>Month</th>
                  {rProps.map(p=><th key={p.id} style={{padding:"9px 12px",textAlign:"right",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase"}}>{p.name}</th>)}
                  <th style={{padding:"9px 12px",textAlign:"right",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase"}}>Total</th>
                </tr></thead>
                <tbody>
                  {months.map((mo,i)=>{
                    const moPays=rPayments.filter(p=>p.date?.slice(0,7)===mo);
                    const total=moPays.reduce((s,p)=>s+p.amount,0);
                    return(<tr key={mo} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                      <td style={{padding:"8px 12px",fontFamily:"monospace",fontSize:11,color:"#5c4a3a"}}>{mo}</td>
                      {rProps.map(p=>{const amt=moPays.filter(x=>x.propName===p.name).reduce((s,x)=>s+x.amount,0);return<td key={p.id} style={{padding:"8px 12px",textAlign:"right",color:amt>0?"#4a7c59":"#ccc"}}>{amt>0?fmtS(amt):"—"}</td>;})}
                      <td style={{padding:"8px 12px",textAlign:"right",fontWeight:800,color:total>0?"#4a7c59":"#999"}}>{total>0?fmtS(total):"—"}</td>
                    </tr>);
                  })}
                </tbody>
                <tfoot><tr style={{background:"#f8f7f4",borderTop:"2px solid rgba(0,0,0,.08)"}}>
                  <td style={{padding:"10px 12px",fontWeight:800}}>12-Month Total</td>
                  {rProps.map(p=>{const amt=rPayments.filter(x=>x.propName===p.name).reduce((s,x)=>s+x.amount,0);return<td key={p.id} style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:"#4a7c59"}}>{fmtS(amt)}</td>;})}
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:800,color:"#4a7c59",fontSize:14}}>{fmtS(rPayments.reduce((s,p)=>s+p.amount,0))}</td>
                </tr></tfoot>
              </table>
            </div>);
          })()}

          {/* ── DSCR Report ── */}
          {activeReport==="dscr"&&(()=>{
            if(rMortgages.length===0)return<div style={{textAlign:"center",padding:36,color:"#6b5e52",background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)"}}>No mortgages on record. Add mortgages in the Accounting → Mortgages tab first.</div>;
            return(<>
              {rProps.map(pr=>{
                const prInc=rPayments.filter(p=>p.propName===pr.name).reduce((s,p)=>s+p.amount,0);
                const prExp=rExpenses.filter(e=>e.propId===pr.id).reduce((s,e)=>s+e.amount,0);
                const prNOI=prInc-prExp;
                const prMg=rMortgages.filter(mg=>mg.propId===pr.id);
                const prDebt=prMg.reduce((s,mg)=>s+(mg.monthlyPI||0)*12,0);
                const prDSCR=prDebt>0?(prNOI/prDebt):null;
                if(prMg.length===0)return null;
                return(
                <div key={pr.id} style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",padding:"16px",marginBottom:10}}>
                  <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>{pr.name}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                    {[["NOI",fmtS(prNOI),prNOI>=0?"#4a7c59":"#c45c4a"],["Debt Service",fmtS(prDebt),"#9a7422"],["DSCR",prDSCR!=null?prDSCR.toFixed(2)+"x":"—",prDSCR==null?"#999":prDSCR>=1.25?"#4a7c59":prDSCR>=1.0?"#d4a853":"#c45c4a"],["Status",prDSCR==null?"No debt":prDSCR>=1.25?"✅ Strong":prDSCR>=1.0?"⚠️ Marginal":"❌ At Risk",prDSCR==null?"#999":prDSCR>=1.25?"#4a7c59":prDSCR>=1.0?"#d4a853":"#c45c4a"]].map(([lbl,v,clr])=>(
                      <div key={lbl} style={{textAlign:"center",padding:"10px",background:"rgba(0,0,0,.02)",borderRadius:8}}>
                        <div style={{fontSize:9,color:"#6b5e52",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>{lbl}</div>
                        <div style={{fontSize:16,fontWeight:800,color:clr}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {prMg.map(mg=><div key={mg.id} style={{fontSize:11,color:"#6b5e52",padding:"6px 0",borderTop:"1px solid rgba(0,0,0,.04)"}}>{mg.lender} · Balance: {fmtS(mg.currentBalance||0)} · Rate: {mg.interestRate||0}% · P&I: {fmtS(mg.monthlyPI||0)}/mo</div>)}
                </div>);
              })}
            </>);
          })()}

          {/* ── Tenant Ledger (report version) ── */}
          {activeReport==="tenantledger"&&(()=>{
            const[selTenant,setSelTenantReport]=useState("all");
            const tenantNames=[...new Set(charges.map(c=>c.tenantName))].sort();
            const selCharges=selTenant==="all"?charges:charges.filter(c=>c.tenantName===selTenant);
            const entries=selCharges.flatMap(c=>[
              {date:c.createdDate||c.dueDate,desc:c.desc,category:c.category,type:"debit",amount:c.amount,tenant:c.tenantName,prop:c.propName,status:chargeStatus(c)},
              ...(c.payments||[]).map(p=>({date:p.date,desc:"Payment — "+p.method,category:"Payment",type:"credit",amount:p.amount,tenant:c.tenantName,prop:c.propName}))
            ]).sort((a,b)=>a.date?.localeCompare(b.date||"")||0);
            let bal=0;const withBal=entries.map(e=>{bal+=e.type==="debit"?e.amount:-e.amount;return{...e,balance:bal};});
            return(<>
              <div style={{marginBottom:12}}>
                <select value={selTenant} onChange={e=>setSelTenantReport(e.target.value)} style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",fontSize:11,fontFamily:"inherit"}}>
                  <option value="all">All Tenants</option>{tenantNames.map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.06)",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:"#f8f7f4",borderBottom:"2px solid rgba(0,0,0,.06)"}}>{["Date","Tenant","Description","Category","Debit","Credit","Balance"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:["Debit","Credit","Balance"].includes(h)?"right":"left",fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {withBal.map((e,i)=><tr key={i} style={{borderBottom:"1px solid rgba(0,0,0,.03)",background:i%2===0?"#fff":"rgba(0,0,0,.01)"}}>
                      <td style={{padding:"7px 12px",fontSize:10,fontFamily:"monospace",color:"#6b5e52",whiteSpace:"nowrap"}}>{e.date}</td>
                      <td style={{padding:"7px 12px",fontWeight:600,fontSize:10}}>{e.tenant}</td>
                      <td style={{padding:"7px 12px"}}>{e.desc}</td>
                      <td style={{padding:"7px 12px"}}><span style={{fontSize:9,padding:"2px 6px",borderRadius:100,background:e.category==="Payment"?"rgba(74,124,89,.08)":"rgba(59,130,246,.08)",color:e.category==="Payment"?"#4a7c59":"#3b82f6",fontWeight:700}}>{e.category}</span></td>
                      <td style={{padding:"7px 12px",textAlign:"right",color:e.type==="debit"?"#c45c4a":"#ccc",fontWeight:e.type==="debit"?700:400}}>{e.type==="debit"?fmtS(e.amount):"—"}</td>
                      <td style={{padding:"7px 12px",textAlign:"right",color:e.type==="credit"?"#4a7c59":"#ccc",fontWeight:e.type==="credit"?700:400}}>{e.type==="credit"?fmtS(e.amount):"—"}</td>
                      <td style={{padding:"7px 12px",textAlign:"right",fontWeight:800,color:e.balance>0?"#c45c4a":e.balance<0?"#3b82f6":"#4a7c59"}}>{e.balance===0?"$0":fmtS(e.balance)}</td>
                    </tr>)}
                    {withBal.length===0&&<tr><td colSpan={7} style={{padding:24,textAlign:"center",color:"#6b5e52"}}>No records found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </>);
          })()}


          {activeReport==="leadsource"&&(()=>{
            const sources=[...new Set(apps.map(a=>a.source||"Unknown"))];
            return(<>
            <table className="tbl"><thead><tr><th>Source</th><th>Leads</th><th>In Pipeline</th><th>Approved</th><th>Denied</th><th>Conv %</th></tr></thead><tbody>
            {sources.map(src=>{
              const sa=apps.filter(a=>(a.source||"Unknown")===src);
              const inPipe=sa.filter(a=>!["denied","approved","onboarding"].includes(a.status)).length;
              const approved=sa.filter(a=>["approved","onboarding"].includes(a.status)).length;
              const denied=sa.filter(a=>a.status==="denied").length;
              const rate=sa.length?Math.round(approved/sa.length*100):0;
              return(<tr key={src}><td style={{fontWeight:600}}>{src}</td><td>{sa.length}</td><td>{inPipe}</td><td style={{color:approved?"#4a7c59":"#999"}}>{approved}</td><td style={{color:denied?"#c45c4a":"#999"}}>{denied}</td><td><span style={{fontWeight:700,color:rate>=50?"#4a7c59":rate>=20?"#d4a853":"#999"}}>{rate}%</span></td></tr>);
            })}
            </tbody></table>
            </>);
          })()}

          {activeReport==="tenantquality"&&(()=>{
            const allSources=[...new Set(apps.map(a=>a.source||"Unknown"))];
            return(<>
            <div style={{fontSize:11,color:"#6b5e52",marginBottom:12,padding:"8px 12px",background:"rgba(0,0,0,.02)",borderRadius:8}}>
              Quality score is based on lease completion rate, broke-lease rate, and average tenure from past tenants linked to each source. More data = more accurate score.
            </div>
            <table className="tbl"><thead><tr>
              <th>Source</th><th>Leads</th><th>Approved</th><th>Past Tenants</th><th>Avg Tenure</th><th>Broke Lease</th><th>Completion %</th><th>Quality Score</th>
            </tr></thead><tbody>
            {allSources.map(src=>{
              const srcApps=apps.filter(a=>(a.source||"Unknown")===src);
              const approved=srcApps.filter(a=>["approved","onboarding"].includes(a.status)).length;
              const srcEmails=new Set(srcApps.map(a=>(a.email||"").toLowerCase()).filter(Boolean));
              const pastFromSrc=archive.filter(t=>srcEmails.has((t.email||"").toLowerCase()));
              const totalPast=pastFromSrc.length;
              const completed=pastFromSrc.filter(t=>{
                if(!t.terminatedDate||!t.leaseEnd)return false;
                return new Date(t.terminatedDate+"T00:00:00")>=new Date(t.leaseEnd+"T00:00:00");
              }).length;
              const broke=pastFromSrc.filter(t=>{
                if(!t.reason)return false;
                const r=t.reason.toLowerCase();
                return r.includes("broke")||r.includes("early")||r.includes("evict")||r.includes("noise")||r.includes("violat");
              }).length;
              const tenures=pastFromSrc.map(t=>{
                if(!t.moveIn||!t.terminatedDate)return null;
                return Math.round((new Date(t.terminatedDate+"T00:00:00")-new Date(t.moveIn+"T00:00:00"))/(1e3*60*60*24*30));
              }).filter(v=>v!==null&&v>0);
              const avgTenure=tenures.length?Math.round(tenures.reduce((s,v)=>s+v,0)/tenures.length):null;
              const completionRate=totalPast>0?Math.round(completed/totalPast*100):null;
              const brokeRate=totalPast>0?Math.round(broke/totalPast*100):0;
              let qs=50;
              if(completionRate!==null){if(completionRate>=80)qs+=25;else if(completionRate>=50)qs+=10;else qs-=10;}
              if(brokeRate>30)qs-=20;else if(brokeRate>10)qs-=10;
              if(avgTenure){if(avgTenure>=10)qs+=15;else if(avgTenure>=6)qs+=5;}
              if(approved>=3)qs+=10;
              qs=Math.max(0,Math.min(100,qs));
              const qsColor=qs>=70?"#4a7c59":qs>=50?"#d4a853":"#c45c4a";
              return(<tr key={src}>
                <td style={{fontWeight:600}}>{src}</td>
                <td>{srcApps.length}</td>
                <td style={{color:approved?"#4a7c59":"#999"}}>{approved}</td>
                <td>{totalPast||<span style={{color:"#8a7d74"}}>—</span>}</td>
                <td>{avgTenure?avgTenure+"mo":<span style={{color:"#8a7d74"}}>—</span>}</td>
                <td style={{color:brokeRate>20?"#c45c4a":"#999"}}>{totalPast?brokeRate+"%":"—"}</td>
                <td>{completionRate!==null?<span style={{fontWeight:700,color:completionRate>=70?"#4a7c59":completionRate>=40?"#d4a853":"#c45c4a"}}>{completionRate}%</span>:<span style={{color:"#8a7d74"}}>—</span>}</td>
                <td><div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{height:6,width:60,borderRadius:3,background:"rgba(0,0,0,.06)"}}><div style={{height:"100%",borderRadius:3,background:qsColor,width:qs+"%"}}/></div>
                  <span style={{fontWeight:800,color:qsColor,fontSize:12}}>{qs}</span>
                </div></td>
              </tr>);
            })}
            </tbody></table>
            <div style={{marginTop:12,fontSize:10,color:"#6b5e52"}}>Quality score uses email matching between apps and past tenants. Sources with no past tenants default to 50 — increase as data grows.</div>
            </>);
          })()}

          </>);
        })()}
        </>);
      })()}

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
          <div className={`kpi ${drill==="sc-coll"?"active":""}`} onClick={()=>setDrill(drill==="sc-coll"?null:"sc-coll")}><div className="kl">Collection</div><div className="kv" style={{color:m.collRate>=90?"#4a7c59":"#c45c4a"}}>{m.collRate}%</div><div className="ks">{fmtS(m.coll)} / {fmtS(m.due)}</div></div>
          <div className={`kpi ${drill==="sc-vac"?"active":""}`} onClick={()=>setDrill(drill==="sc-vac"?null:"sc-vac")}><div className="kl">💸 Vacancy</div><div className="kv" style={{color:m.lost>0?"#c45c4a":"#4a7c59"}}>{fmtS(m.lost)}</div><div className="ks">/month lost</div></div>
          <div className={`kpi ${drill==="sc-proj"?"active":""}`} onClick={()=>setDrill(drill==="sc-proj"?null:"sc-proj")}><div className="kl">📈 Projected</div><div className="kv">{fmtS(m.proj)}</div><div className="ks">of {fmtS(m.full)}</div></div>
        </div>

        {/* Drill: Occupancy */}
        {drill==="sc-occ"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Occupancy: {m.occ}/{m.total}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.propBreakdown.map(pr=>{const pct=pr.occCount/(pr.occCount+pr.vacCount)*100;return(<div key={pr.id} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontWeight:700,fontSize:13}}>{pr.name} <span style={{fontSize:11,color:"#6b5e52"}}>{pr.type}</span></div><span className={`badge ${pr.vacCount?"b-red":"b-green"}`}>{pr.occCount}/{allRooms(pr).length} · {Math.round(pct)}%</span></div>
            <div style={{height:5,borderRadius:3,background:"#e5e3df",marginBottom:6}}><div style={{height:"100%",borderRadius:3,background:pct>=100?"#4a7c59":pct>=75?"#d4a853":"#c45c4a",width:`${pct}%`}}/></div>
            {allRooms(pr).map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2,cursor:r.tenant?"pointer":"default"}} onClick={()=>{if(r.tenant)setModal({type:"tenant",data:{...r,propName:pr.name,propUtils:(pr.units||[])[0]?.utils||pr.utils,propClean:(pr.units||[])[0]?.clean||pr.clean}});}}><div className="row-dot" style={{background:r.st==="vacant"?"#c45c4a":"#4a7c59"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:r.tenant?"#999":"#c45c4a"}}>{(r.tenant&&r.tenant.name)||"Vacant"}{r.tenant&&<span style={{color:"#c4a882",marginLeft:4}}>→ view</span>}</div></div><div style={{fontSize:12,fontWeight:700}}>{fmtS(r.rent)}</div></div>)}
          </div>);})}
        </div></div>}

        {/* Drill: Collection */}
        {drill==="sc-coll"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Collection: {fmtS(m.coll)} / {fmtS(m.due)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.unpaid.length>0&&<><div style={{fontSize:9,fontWeight:700,color:"#c45c4a",marginBottom:6}}>UNPAID ({m.unpaid.length})</div>{m.unpaid.map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div className="row-s">{roomSubLine(r.propName,r.name)}</div></div><div className="row-v kb">{fmtS(r.rent)}</div><button className="btn btn-green btn-sm" onClick={e=>{e.stopPropagation();openPayForm(r.id);}}>Pay</button></div>)}</>}
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
            m.vacs.map(r=><div key={r.id} className="row"><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div className="row-t">{r.name}</div><div className="row-s">{r.propName} · {r.pb?"Private":"Shared"}</div></div><div className="row-v kb">{fmtS(r.rent)}<div style={{fontSize:8,color:"#6b5e52"}}>lost/mo</div></div></div>)}
          <div style={{marginTop:10,padding:12,background:"rgba(196,92,74,.03)",borderRadius:8,fontSize:12}}><strong>Annual loss:</strong> {fmtS(m.lost*12)}</div>
        </div></div>}

        {/* Drill: Projected */}
        {drill==="sc-proj"&&<div className="card" style={{marginBottom:14,animation:"fadeIn .2s"}}><div className="card-bd">
          <div className="sec-hd"><div><h2>Projected: {fmtS(m.proj)} / {fmtS(m.full)}</h2></div><button className="btn btn-sm btn-out" onClick={()=>setDrill(null)}>✕</button></div>
          {m.propBreakdown.map(pr=><div key={pr.id} className="row"><div className="row-i"><div className="row-t">{pr.name}</div><div className="row-s">{pr.occCount} occupied · {pr.vacCount} vacant</div></div><div style={{display:"flex",gap:12,alignItems:"baseline"}}><span style={{fontSize:11,color:"#6b5e52"}}>Full: {fmtS(pr.fullOcc)}</span><span style={{fontSize:16,fontWeight:800,color:pr.projected===pr.fullOcc?"#4a7c59":"inherit"}}>{fmtS(pr.projected)}</span>{pr.vacCount>0&&<span style={{fontSize:11,fontWeight:700,color:"#c45c4a"}}>-{fmtS(pr.fullOcc-pr.projected)}</span>}</div></div>)}
        </div></div>}

        {/* Charts */}
        <div className="card" style={{marginBottom:14}}>
          <div className="card-hd" onClick={()=>setShowCharts(!showCharts)}><h3>📈 Visual Trends</h3><span style={{fontSize:11,color:"#6b5e52"}}>{showCharts?"▾ Collapse":"▸ Expand"}</span></div>
          {showCharts&&<div className="card-bd">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div><div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Revenue by Property</div>
                <ResponsiveContainer width="100%" height={180}><BarChart data={m.propBreakdown.map(p=>({name:p.name.split(" ").slice(0,2).join(" "),Projected:p.projected,Lost:p.fullOcc-p.projected}))}>
                  <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`$${v/1000}k`}/><Tooltip formatter={v=>`$${v.toLocaleString()}`}/>
                  <Bar dataKey="Projected" fill="#4a7c59" radius={[3,3,0,0]}/><Bar dataKey="Lost" fill="#c45c4a" radius={[3,3,0,0]}/>
                </BarChart></ResponsiveContainer></div>
              <div><div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Occupancy</div>
                <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={[{name:"Occupied",value:m.occ},{name:"Vacant",value:m.total-m.occ}]} cx="50%" cy="50%" outerRadius={60} innerRadius={38} paddingAngle={3} dataKey="value"><Cell fill="#4a7c59"/><Cell fill="#c45c4a"/></Pie><Tooltip/></PieChart></ResponsiveContainer>
                <div style={{textAlign:"center",marginTop:-6}}><span style={{fontSize:10,color:"#4a7c59",fontWeight:700,marginRight:10}}>● {m.occ} Occupied</span><span style={{fontSize:10,color:"#c45c4a",fontWeight:700}}>● {m.total-m.occ} Vacant</span></div></div>
            </div>
            <div style={{marginTop:16}}><div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Weekly Trend</div>
              <ResponsiveContainer width="100%" height={160}><LineChart data={scRows.map(w=>({week:w.label,"Occupancy Rate":w.occ,"Collection Rate":w.coll,"New Leads":w.leads}))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="week" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Legend wrapperStyle={{fontSize:10}}/>
                <Line type="monotone" dataKey="Occupancy Rate" stroke="#4a7c59" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="Collection Rate" stroke="#3b82f6" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="New Leads" stroke="#d4a853" strokeWidth={2} dot={{r:3}}/>
              </LineChart></ResponsiveContainer></div>
          </div>}
        </div>

        {/* Monthly Comparison */}
        <div className="card" style={{marginBottom:14}}>
          <div className="card-hd"><h3>📅 Monthly Comparison</h3><span style={{fontSize:10,color:"#6b5e52"}}>{allMonths.length} month{allMonths.length!==1?"s":""} of data</span></div>
          <div className="card-bd">
            {/* Side-by-side cards: This Month vs Last Month vs 2 Months Ago */}
            <div style={{display:"grid",gridTemplateColumns:`repeat(${twoMonthsAgo?3:prevMonth?2:1},1fr)`,gap:12,marginBottom:16}}>
              {/* Current Month */}
              <div style={{background:"rgba(212,168,83,.04)",borderRadius:10,padding:14,border:"2px solid rgba(212,168,83,.15)"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#d4a853",marginBottom:8}}>{liveMonth.label} (Current)</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Occupancy</span><strong style={{color:liveMonth.occ>=90?"#4a7c59":"#c45c4a"}}>{liveMonth.occ}%</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Collection</span><strong style={{color:liveMonth.collRate>=90?"#4a7c59":"#c45c4a"}}>{liveMonth.collRate}%</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Vacancy Cost</span><strong style={{color:liveMonth.vacancy>0?"#c45c4a":"#4a7c59"}}>{fmtS(liveMonth.vacancy)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Collected</span><strong style={{color:"#4a7c59"}}>{fmtS(liveMonth.collected)}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>Projected</span><strong>{fmtS(liveMonth.projected)}</strong></div>
                </div>
              </div>
              {/* Previous Month */}
              {prevMonth&&<div style={{background:"rgba(0,0,0,.02)",borderRadius:10,padding:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",marginBottom:8}}>{prevMonth.label}</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  {[["Occupancy",prevMonth.occ,liveMonth.occ,"%"],["Collection",prevMonth.collRate,liveMonth.collRate,"%"],["Vacancy Cost",prevMonth.vacancy,liveMonth.vacancy,"$",true],["Collected",prevMonth.collected,liveMonth.collected,"$"],["Projected",prevMonth.projected,liveMonth.projected,"$"]].map(([label,prev,curr,unit,inverse])=>{
                    const diff=unit==="$"?curr-prev:curr-prev;const better=inverse?diff<=0:diff>=0;
                    return(<div key={label} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>{label}</span><div><strong>{unit==="$"?fmtS(prev):`${prev}${unit}`}</strong>{diff!==0&&<span style={{fontSize:9,marginLeft:4,color:better?"#4a7c59":"#c45c4a"}}>{diff>0?"+":""}{unit==="$"?fmtS(diff):`${diff}${unit}`}</span>}</div></div>);
                  })}
                </div>
              </div>}
              {/* 2 Months Ago */}
              {twoMonthsAgo&&<div style={{background:"rgba(0,0,0,.02)",borderRadius:10,padding:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",marginBottom:8}}>{twoMonthsAgo.label}</div>
                <div style={{fontSize:11,display:"flex",flexDirection:"column",gap:6}}>
                  {[["Occupancy",twoMonthsAgo.occ,"%"],["Collection",twoMonthsAgo.collRate,"%"],["Vacancy Cost",twoMonthsAgo.vacancy,"$"],["Collected",twoMonthsAgo.collected,"$"],["Projected",twoMonthsAgo.projected,"$"]].map(([label,val,unit])=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#6b5e52"}}>{label}</span><strong>{unit==="$"?fmtS(val):`${val}${unit}`}</strong></div>
                  ))}
                </div>
              </div>}
            </div>
            {!prevMonth&&<div style={{textAlign:"center",padding:12,color:"#6b5e52",fontSize:11}}>Monthly comparison will appear after your first month-end snapshot. Snapshots are taken automatically on the last day of each month.</div>}

            {/* Monthly trend chart */}
            {allMonths.length>1&&<>
              <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Monthly Trends</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <div style={{fontSize:9,color:"#6b5e52",marginBottom:4}}>Occupancy & Collection %</div>
                  <ResponsiveContainer width="100%" height={160}><LineChart data={allMonths.map(mo=>({month:((mo.label||"").split(" ")[0]||"").slice(0,3)||mo.month,Occupancy:mo.occ,Collection:mo.collRate}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="month" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}} domain={[0,100]}/><Tooltip formatter={v=>`${v}%`}/>
                    <Line type="monotone" dataKey="Occupancy" stroke="#4a7c59" strokeWidth={2} dot={{r:3}}/><Line type="monotone" dataKey="Collection" stroke="#3b82f6" strokeWidth={2} dot={{r:3}}/>
                  </LineChart></ResponsiveContainer>
                </div>
                <div>
                  <div style={{fontSize:9,color:"#6b5e52",marginBottom:4}}>Revenue</div>
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
              <td style={{color:"#6b5e52"}}>{s.unit==="$"?fmtS(s.goal):s.goal}{s.unit==="%"?"%":""}</td>
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
            {m.unpaid.length>0?<>{m.unpaid.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2,cursor:"pointer"}} onClick={()=>setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}})}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{(r.tenant&&r.tenant.name)} <span style={{fontSize:9,color:"#c4a882"}}>→ view</span></div><div style={{fontSize:9,color:"#c45c4a"}}>{roomSubLine(r.propName,r.name)} · {fmtS(r.rent)} unpaid</div></div></div>)}
              <div style={{fontSize:12,color:"#c45c4a",fontWeight:600,marginTop:8}}>Outstanding: {fmtS(m.due-m.coll)} from {m.unpaid.length} tenant{m.unpaid.length>1?"s":""}</div></>
            :<div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>✓ All rent collected for {MO}!</div>}
          </div>}

          {scDrill==="vacancy"&&<div>
            <p style={{fontSize:12,color:"#5c4a3a",marginBottom:10}}>Vacancy cost = total rent from empty rooms. Goal: $0. Currently <strong>{fmtS(m.lost)}</strong>/month across {m.vacs.length} room{m.vacs.length!==1?"s":""}.</p>
            {m.vacs.map(r=><div key={r.id} className="row" style={{padding:"6px 12px",marginBottom:2}}><div className="row-dot" style={{background:"#c45c4a"}}/><div className="row-i"><div style={{fontSize:11,fontWeight:600}}>{r.name}</div><div style={{fontSize:9,color:"#6b5e52"}}>{r.propName} · {r.pb?"Private":"Shared"} bath</div></div><div style={{fontSize:12,fontWeight:700,color:"#c45c4a"}}>{fmtS(r.rent)}</div></div>)}
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
          {m.expiring.sort((a,b)=>a.daysLeft-b.daysLeft).map(r=><div key={r.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setTab("tenants");setModal({type:"tenant",data:{...r,propUtils:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).utils,propClean:(props.find(p=>allRooms(p).some(x=>x.id===r.id))||{}).clean}});}}><div className="row-dot" style={{background:r.daysLeft<=30?"#c45c4a":"#d4a853"}}/><div className="row-i"><div className="row-t">{(r.tenant&&r.tenant.name)}</div><div className="row-s">{roomSubLine(r.propName,r.name)} · {r.daysLeft} days</div></div><span className="badge" style={{background:r.daysLeft<=30?"rgba(196,92,74,.08)":"rgba(212,168,83,.1)",color:r.daysLeft<=30?"#c45c4a":"#9a7422"}}>{r.daysLeft}d</span></div>)}</>}
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
                <h3><span style={{color:"#8a7d74",marginRight:4,cursor:"grab",fontSize:14}}>⠿</span>{isExp?"▾":"▸"} {p.name}</h3>
                <div style={{fontSize:10,color:"#6b5e52",marginTop:2}}>{p.addr} · {(PROP_TYPES[p.type]||PROP_TYPES.SFH).label} · {allWhole?"Whole Unit":anyWhole?"Mixed":allRooms(p).length+"br"} · {(p.units||[]).length>1?(p.units||[]).length+" units":"1 unit"} · {(p.units||[])[0]?.utils==="allIncluded"?"All Utils":"Tenant Pays"}</div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                {allWhole&&wholeUnitRent>0&&<span style={{fontWeight:800,color:"#d4a853",marginRight:4}}>{fmtS(wholeUnitRent)}/mo <span style={{fontSize:9,fontWeight:400,color:"#6b5e52"}}>whole unit</span></span>}
                {!allWhole&&pr.length>0&&<span style={{fontWeight:800,marginRight:4}}>{fmtS(Math.min(...pr))}–{fmtS(Math.max(...pr))} <span style={{fontSize:9,fontWeight:400,color:"#6b5e52"}}>per room</span></span>}
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
                {!allWhole&&<div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#6b5e52",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Rooms</div><div style={{fontSize:18,fontWeight:800}}>{allRooms(p).length}</div></div>}
                {!allWhole&&<div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#6b5e52",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Occupied</div><div style={{fontSize:18,fontWeight:800,color:"#4a7c59"}}>{occRooms.length}</div></div>}
                {allWhole&&<div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center",gridColumn:"span 2"}}><div style={{fontSize:9,color:"#6b5e52",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Monthly Rent</div><div style={{fontSize:18,fontWeight:800}}>{fmtS(wholeUnitRent)}<small style={{fontSize:9,color:"#6b5e52"}}>/mo</small></div></div>}
                <div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#6b5e52",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Projected</div><div style={{fontSize:18,fontWeight:800}}>{fmtS(projRent)}<small style={{fontSize:9,color:"#6b5e52"}}>/mo</small></div></div>
                <div style={{background:"#faf9f7",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:"#6b5e52",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>At Full</div><div style={{fontSize:18,fontWeight:800}}>{fmtS(totalRent)}<small style={{fontSize:9,color:"#6b5e52"}}>/mo</small></div></div>
              </div>
              {/* Whole unit info */}
              {allWhole&&<div style={{padding:"12px 14px",background:"#faf9f7",borderRadius:8,marginBottom:10}}>
                {(p.units||[]).map(u=><div key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700}}>{(p.units||[]).length>1?u.name:"Whole Unit"} · {u.utils==="allIncluded"?"All Utilities":u.utils==="first100"?"First $100 Utilities":"Tenant Pays"} · {u.clean||"Biweekly"} Clean</div>
                    <div style={{fontSize:10,color:"#6b5e52",marginTop:2}}>Single lease · {u.baths||1} bath{u.baths!==1?"s":""}</div>
                  </div>
                  <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59",borderColor:"rgba(74,124,89,.2)"}} onClick={()=>{setTab("applications");setBulkSel([])}}>+ Find Tenant</button>
                </div>)}
              </div>}
              {/* Unit list — per-unit mode aware */}
              <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>{anyWhole&&!allWhole?"Units & Rooms":"Rooms by Unit"}</div>
              {(p.units||[]).map(u=>{
                const uIsWhole=(u.rentalMode||"byRoom")==="wholeHouse";
                const uRooms=u.rooms||[];
                const uOcc=uRooms.some(r=>r.st==="occupied");
                const uLatestLe=uRooms.filter(r=>r.le).sort((a,b)=>new Date(b.le)-new Date(a.le))[0]?.le;
                return(<div key={u.id} style={{marginBottom:10}}>
                  {(p.units||[]).length>1&&<div style={{fontSize:10,fontWeight:800,color:"#d4a853",textTransform:"uppercase",letterSpacing:.5,marginBottom:4,padding:"3px 8px",background:"rgba(212,168,83,.06)",borderRadius:4,display:"inline-flex",alignItems:"center",gap:6}}>
                    {u.name}
                    <span style={{fontSize:8,fontWeight:500,color:"#6b5e52",textTransform:"none",letterSpacing:0}}>{uIsWhole?"Whole Unit":"By Room"}</span>
                  </div>}
                  {uIsWhole?(
                    <div className="row" style={{padding:"10px 12px",marginBottom:3,cursor:"default"}}>
                      <div className="row-dot" style={{background:uOcc?"#4a7c59":"#c45c4a",flexShrink:0}}/>
                      <div className="row-i">
                        <div style={{fontSize:12,fontWeight:600}}>{u.name} — Whole Unit</div>
                        {uOcc
                          ?<div style={{fontSize:10,color:"#6b5e52",marginTop:1}}>Occupied · ends {fmtD(uLatestLe)}</div>
                          :<div style={{fontSize:10,color:"#c45c4a",fontWeight:600,marginTop:1}}>Vacant — {fmtS(u.rent)}/mo</div>}
                      </div>
                      <div style={{textAlign:"right",minWidth:60,marginRight:8}}>
                        <div style={{fontSize:14,fontWeight:800}}>{fmtS(u.rent)}</div>
                      </div>
                      <button className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59",borderColor:"rgba(74,124,89,.2)"}} onClick={()=>{if(uOcc){const rep=(u.rooms||[]).find(r=>r.tenant);if(rep)setModal({type:"tenant",data:{...rep,propName:p.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,unitName:u.name,unitLabel:u.label}});}else if(!u.ownerOccupied){setTab("applications");setBulkSel([])}}}>{uOcc?"👤 View Tenant":u.ownerOccupied?"🏠 Owner":"+ Find Tenant"}</button>
                    </div>
                  ):(
                    <>
                    {uRooms.length===0&&<div style={{fontSize:11,color:"#7a7067",padding:"6px 0"}}>No rooms — edit property to add</div>}
                    {uRooms.map(r=>{const occ=r.st==="occupied"&&r.tenant;const pd=(payments[r.id]&&payments[r.id][MO])||0;const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;
                      const tenantData={...r,propName:p.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,unitName:u.name,unitLabel:u.label};
                      return(<div key={r.id} className="row" style={{padding:"10px 12px",marginBottom:3,cursor:"default",background:occ&&dl&&dl<=30?"rgba(196,92,74,.02)":occ&&dl&&dl<=90?"rgba(212,168,83,.02)":"#fff"}}>
                        <div className="row-dot" style={{background:occ?"#4a7c59":"#c45c4a",flexShrink:0}}/>
                        <div className="row-i">
                          <div style={{fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                            {r.name}
                            <span className={"badge "+(r.pb?"b-green":"b-gray")} style={{fontSize:7}}>{r.pb?"Private":"Shared"}</span>
                            {r.sqft&&<span style={{fontSize:9,color:"#6b5e52"}}>{r.sqft} sqft</span>}
                          </div>
                          {occ
                            ?<div style={{fontSize:10,color:"#6b5e52",marginTop:1}}>{r.tenant.name} · ends {fmtD(r.le)}{dl&&dl<=90?<span style={{color:dl<=30?"#c45c4a":"#d4a853",fontWeight:700,marginLeft:4}}>⚠ {dl}d</span>:null}</div>
                            :r.ownerOccupied?<div style={{fontSize:10,color:"#1d4ed8",fontWeight:600,marginTop:1}}>Owner Occupied</div>
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
                          :r.ownerOccupied?<span style={{fontSize:9,color:"#1d4ed8",fontWeight:600,padding:"4px 8px",background:"rgba(59,130,246,.06)",borderRadius:4}}>Owner</span>
                          :<button className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59",borderColor:"rgba(74,124,89,.2)"}} onClick={()=>{setTab("applications");setBulkSel([]);}}> + Find Tenant</button>}
                      </div>);})}
                    </>
                  )}
                </div>);
              })}
            </div>}
          </div>);})}
        {props.length===0&&<div style={{textAlign:"center",padding:40,color:"#6b5e52"}}><div style={{fontSize:40,marginBottom:8}}>🏠</div><h3 style={{fontSize:15}}>No Properties</h3><p style={{fontSize:12,marginTop:4}}>Add your first property above.</p></div>}
      </>}

      {/* ═══ SITE SETTINGS ═══ */}
      {tab==="site-settings"&&<>
        <div className="sec-hd"><div><h2>Site Settings</h2><p>Edit company info and hero copy</p></div></div>
        <div className="card"><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:12}}>Company Info</h3>
          <div className="fr"><div className="fld"><label>Company Name</label><input value={settings.companyName} onChange={e=>setSettings({...settings,companyName:e.target.value})}/></div><div className="fld"><label>Legal Entity</label><input value={settings.legalName} onChange={e=>setSettings({...settings,legalName:e.target.value})}/></div></div>
          <div className="fr3"><div className="fld"><label>Phone</label><input value={settings.phone} onChange={e=>setSettings({...settings,phone:e.target.value})}/></div><div className="fld"><label>Public Email</label><input value={settings.email} onChange={e=>setSettings({...settings,email:e.target.value})} placeholder="info@rentblackbear.com"/></div><div className="fld"><label>City</label><input value={settings.city} onChange={e=>setSettings({...settings,city:e.target.value})}/></div></div><div className="fld"><label>PM Notification Email <span style={{fontWeight:400,color:"#6b5e52",textTransform:"none",letterSpacing:0}}>— where you receive application, lease, and payment alerts</span></label><input type="email" value={settings.pmEmail||""} onChange={e=>setSettings({...settings,pmEmail:e.target.value})} placeholder="blackbearhousing@gmail.com"/></div>
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
            💡 Notification emails are sent to <strong>{settings.email||"info@rentblackbear.com"}</strong>. Update your email in Company Info above.
          </div>
        </div></div>

        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Email Templates</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>Customize the subject line and body of notification emails sent to you. Use <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"name{"+"}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"property{"+"}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"room{"+"}"}</code> <code style={{background:"rgba(0,0,0,.04)",padding:"1px 4px",borderRadius:3,fontSize:9}}>{"{"+"amount{"+"}"}</code> as placeholders.</p>
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
              <div style={{fontSize:10,color:"#6b5e52",marginBottom:8}}>{desc}</div>
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
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Lease & M2M Settings</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>Controls automatic month-to-month conversion and daily payment reminders.</p>
          <div className="fr" style={{marginBottom:12}}>
            <div className="fld" style={{marginBottom:0}}>
              <label>M2M Rent Increase <span style={{fontWeight:400,color:"#6b5e52"}}>($/mo added when lease converts to month-to-month)</span></label>
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
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,cursor:"pointer"}}>
            <input type="checkbox" checked={settings.autoReminders!==false} onChange={e=>{const u={...settings,autoReminders:e.target.checked};setSettings(u);save("hq-settings",u);}}/>
            <span>Auto-send daily payment reminders for past-due charges (stops when paid)</span>
          </label>
        </div></div>

        <div className="card" style={{marginTop:12}}><div className="card-bd">
          <h3 style={{fontSize:13,fontWeight:800,marginBottom:4}}>Payment Reminder Template</h3>
          <p style={{fontSize:11,color:"#6b5e52",marginBottom:12}}>This is the default message pre-filled every time you send a payment reminder. Edit and save to update the default for all future reminders.</p>
          <div className="fld">
            <label style={{display:"flex",justifyContent:"space-between"}}>
              Message Template
              <button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setSettings(s=>({...s,reminderTemplate:DEF_SETTINGS.reminderTemplate}))}>↺ Restore original</button>
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
      </>}
      {tab==="theme"&&(()=>{
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
                    <span style={{fontSize:11,fontWeight:700,color:isActive?p.accent:"#1a1714"}}>{p.name}</span>
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
                {i.notes&&<div style={{fontSize:10,color:"#6b5e52",lineHeight:1.4,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.notes}</div>}
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
                  {catIdeas.length===0&&<div style={{textAlign:"center",padding:20,color:"#8a7d74",fontSize:10,fontStyle:"italic"}}>No ideas yet — click + to add one</div>}
                </div>
              </div>);})}
          </div>}

          {/* List view */}
          {ideaView==="list"&&<>
            {filtered.map(i=><IdeaRow key={i.id} i={i}/>)}
            {filtered.length===0&&<div style={{textAlign:"center",padding:32,color:"#6b5e52",fontSize:12}}>No ideas match this filter</div>}
          </>}

          {/* Status view */}
          {ideaView==="status"&&<>{statuses.map(st=>{const stIdeas=filtered.filter(i=>i.status===st);return(
            <div key={st} style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:800,color:stTxt[st],textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:stBg[st],borderRadius:6}}>
                {st} <span style={{fontWeight:500,opacity:.7}}>({stIdeas.length})</span>
              </div>
              {stIdeas.map(i=><IdeaRow key={i.id} i={i}/>)}
              {stIdeas.length===0&&<div style={{padding:"8px 12px",fontSize:11,color:"#8a7d74",fontStyle:"italic"}}>Nothing here</div>}
            </div>);})}
          </>}

          {/* Archived toggle */}
          {archived.length>0&&<div style={{marginTop:20,borderTop:"1px solid rgba(0,0,0,.06)",paddingTop:14}}>
            <button className="btn btn-out btn-sm" style={{width:"100%",color:"#6b5e52"}} onClick={()=>setExpanded(p=>({...p,showArchived:!p.showArchived}))}>
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

  {/* Fixed pages + modals — own zoom wrapper so they scale correctly */}
  <div style={{zoom:_zoom,fontFamily:_font}}>
  {/* ═══ LEASE DETAIL PAGE ═══ */}
  {viewingLease&&(()=>{
    const l=viewingLease.lease;
    const r=viewingLease.room;
    const prop=props.find(p=>allRooms(p).some(x=>x.id===r?.id));
    const statusColors={draft:{bg:"rgba(0,0,0,.06)",tx:"#5c4a3a",label:"Draft"},pending_landlord:{bg:"rgba(212,168,83,.1)",tx:"#9a7422",label:"Awaiting Your Signature"},pending_tenant:{bg:"rgba(59,130,246,.1)",tx:"#1d4ed8",label:"Sent to Tenant"},executed:{bg:"rgba(74,124,89,.1)",tx:"#2d6a3f",label:"Executed"}};
    const sc=statusColors[l.status]||statusColors.draft;
    const isExec=l.status==="executed";
    const isPending=l.status==="pending_tenant";
    const isDraft=l.status==="draft";

    // Variable replacement for lease preview
    const fillVars=(text)=>{
      if(!text)return"";
      const v=l.variables||{};
      return text.replace(/\{\{(\w+)\}\}/g,(_,k)=>v[k]||`{{${k}}}`);
    };

    return(
    <div style={{position:"fixed",top:0,right:0,bottom:0,left:220,background:"#f5f4f1",zIndex:200,overflowY:"auto"}}>
      {/* Top bar */}
      <div style={{background:"#fff",borderBottom:"1px solid rgba(0,0,0,.08)",padding:"0 32px",display:"flex",alignItems:"center",gap:16,height:56,position:"sticky",top:0,zIndex:10}}>
        <button onClick={()=>setViewingLease(null)}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:"#5c4a3a",padding:"6px 10px",borderRadius:6,transition:"background .15s"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Tenant
        </button>
        <div style={{width:1,height:20,background:"rgba(0,0,0,.1)"}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:800,color:"#1a1714"}}>{l.tenantName} — Lease</div>
          <div style={{fontSize:11,color:"#6b5e52"}}>{l.property}{prop?.addr?" · "+prop.addr:""}{l.room?" · "+l.room:""}</div>
        </div>
        <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:100,background:sc.bg,color:sc.tx}}>{sc.label}</span>
        <div style={{display:"flex",gap:8}}>
          {isDraft&&<button className="btn btn-out btn-sm" onClick={()=>{setLeaseForm({...l});setViewingLease(null);goTab("leases");}}>Edit Lease</button>}
          {isDraft&&<button className="btn btn-green btn-sm" onClick={()=>{setModal({type:"signLease",leaseId:l.id,lease:l});setViewingLease(null);goTab("leases");}}>Sign & Send</button>}
          {isPending&&<button className="btn btn-out btn-sm" onClick={()=>{navigator.clipboard.writeText(l.signingLink||"");showAlert({title:"Copied",body:"Signing link copied."});}}>Copy Signing Link</button>}
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 32px 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:24,alignItems:"start"}}>

          {/* LEFT — lease document */}
          <div>
            {/* Pending tenant banner */}
            {isPending&&<div style={{background:"rgba(59,130,246,.06)",border:"1px solid rgba(59,130,246,.2)",borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#1d4ed8"}}>Awaiting tenant signature</div>
                <div style={{fontSize:11,color:"#3b82f6"}}>Sent to {l.tenantEmail} · Link: <span style={{fontFamily:"monospace",fontSize:10}}>{l.signingLink}</span></div>
              </div>
            </div>}

            {/* Executed banner */}
            {isExec&&<div style={{background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              <div style={{fontSize:13,fontWeight:700,color:"#2d6a3f"}}>Fully executed — signed by both parties</div>
            </div>}

            {/* Lease document preview */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",overflow:"hidden"}}>
              <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:15,fontWeight:800}}>Lease Agreement</div>
                {isDraft&&<button className="btn btn-out btn-sm" onClick={()=>{setLeaseForm({...l});setViewingLease(null);goTab("leases");}}>Edit Document</button>}
              </div>
              <div style={{padding:"32px 40px",lineHeight:1.8,fontSize:13}}>
                {/* Header */}
                <div style={{textAlign:"center",marginBottom:32}}>
                  <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>{l.company||settings.companyName||"Black Bear Properties"}</div>
                  <div style={{fontSize:13,color:"#5c4a3a",marginBottom:16}}>ROOM RENTAL AGREEMENT</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,textAlign:"left",background:"rgba(0,0,0,.02)",borderRadius:8,padding:"14px 18px",marginBottom:8}}>
                    {[["Tenant",l.tenantName],["Property",l.property+(prop?.addr?" — "+prop.addr:"")],["Room",l.room],["Move-in",fmtD(l.moveIn)],["Lease End",fmtD(l.leaseEnd)],["Monthly Rent","$"+(l.rent||0).toLocaleString()],["Security Deposit","$"+(l.sd||0).toLocaleString()],["Landlord",l.landlordName||"Carolina Cooper"]].map(([k,v])=>(
                      <div key={k}><span style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.6}}>{k}</span><div style={{fontWeight:600,fontSize:12,marginTop:2}}>{v||"—"}</div></div>
                    ))}
                  </div>
                </div>

                {/* Sections */}
                {(l.sections||[]).filter(s=>s.active!==false).map((sec,i)=>(
                  <div key={sec.id||i} style={{marginBottom:24}}>
                    <div style={{fontSize:13,fontWeight:800,marginBottom:6,paddingBottom:4,borderBottom:"1px solid rgba(0,0,0,.08)"}}>{i+1}. {sec.title}</div>
                    <div style={{fontSize:12,color:"#3c3228",lineHeight:1.8}} dangerouslySetInnerHTML={{__html:fillVars(sec.content||"")}}/>
                    {sec.requiresInitials&&<div style={{marginTop:8,fontSize:10,color:"#6b5e52",fontStyle:"italic"}}>Tenant initials required for this section.</div>}
                  </div>
                ))}

                {/* Signatures */}
                <div style={{marginTop:40,display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#6b5e52",marginBottom:8}}>LANDLORD / PROPERTY MANAGER</div>
                    {l.landlordSignedAt
                      ?<div><div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>Signed {new Date(l.landlordSignedAt).toLocaleDateString()}</div><div style={{fontSize:11,color:"#5c4a3a"}}>{l.landlordName||"Carolina Cooper"}</div></div>
                      :<div style={{borderBottom:"1px solid #333",paddingBottom:4,marginBottom:4,fontSize:11,color:"#aaa"}}>Signature</div>}
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#6b5e52",marginBottom:8}}>TENANT</div>
                    {l.tenantSignedAt
                      ?<div><div style={{fontSize:12,color:"#4a7c59",fontWeight:600}}>Signed {new Date(l.tenantSignedAt).toLocaleDateString()}</div><div style={{fontSize:11,color:"#5c4a3a"}}>{l.tenantName}</div></div>
                      :<div style={{borderBottom:"1px solid #333",paddingBottom:4,marginBottom:4,fontSize:11,color:"#aaa"}}>Signature</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Addenda */}
            {(l.addenda||[]).length>0&&<div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px",marginTop:16}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Addenda</div>
              {(l.addenda||[]).map((a,i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                  <div style={{fontSize:12,fontWeight:600}}>{a.title||"Addendum "+(i+1)}</div>
                  <div style={{fontSize:11,color:"#5c4a3a",marginTop:4}}>{a.text}</div>
                  <div style={{fontSize:10,color:"#7a7067",marginTop:2}}>{a.date}</div>
                </div>
              ))}
            </div>}
          </div>

          {/* RIGHT sidebar */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Lease details */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Lease Details</div>
              {[["Tenant",l.tenantName],["Email",l.tenantEmail],["Phone",l.tenantPhone],["Property",l.property],["Room",l.room],["Move-in",fmtD(l.moveIn)],["Lease End",fmtD(l.leaseEnd)],["Rent",fmtS(l.rent||0)+"/mo"],["Security Deposit",fmtS(l.sd||0)],["Prorated Rent",l.proratedRent>0?fmtS(l.proratedRent):"None"],["Status",sc.label]].filter(([,v])=>v).map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.03)",fontSize:12}}>
                  <span style={{color:"#6b5e52"}}>{k}</span>
                  <span style={{fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{v}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Actions</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {isDraft&&<button className="btn btn-green" onClick={()=>{setLeaseForm({...l});setViewingLease(null);goTab("leases");}}>Edit Lease</button>}
                {isDraft&&<button className="btn btn-gold" onClick={()=>{setModal({type:"signLease",leaseId:l.id,lease:l});setViewingLease(null);goTab("leases");}}>Sign & Send to Tenant</button>}
                {isPending&&<button className="btn btn-out" onClick={()=>{navigator.clipboard.writeText(l.signingLink||"");showAlert({title:"Copied",body:"Signing link copied to clipboard."});}}>Copy Signing Link</button>}
                <button className="btn btn-out" onClick={()=>{
                  const input=document.createElement("input");input.type="file";input.accept=".pdf,.docx,.doc";
                  input.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{setLeases(p=>p.map(x=>x.id===l.id?{...x,uploadedLease:{name:file.name,data:ev.target.result,uploadedAt:new Date().toISOString()}}:x));showAlert({title:"Uploaded",body:file.name+" attached to lease."});};reader.readAsDataURL(file);};
                  input.click();
                }}>Upload Signed PDF</button>
                {l.uploadedLease&&<a href={l.uploadedLease.data} download={l.uploadedLease.name} className="btn btn-out" style={{textDecoration:"none",textAlign:"center",fontSize:11}}>Download: {l.uploadedLease.name}</a>}
                <button className="btn btn-out" onClick={()=>setModal({type:"confirmAction",title:"Add Addendum",body:"Add a note or clause amendment to this executed lease.",confirmLabel:"Add",confirmStyle:"btn-green",onConfirm:()=>{setModal({type:"addAddendum",leaseId:l.id,text:"",title:""});}})}>Add Addendum</button>
                <div style={{borderTop:"1px solid rgba(0,0,0,.06)",paddingTop:10,marginTop:4}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#c45c4a",textTransform:"uppercase",letterSpacing:.6,marginBottom:8}}>Danger Zone</div>
                  <button className="btn btn-out" style={{width:"100%",color:"#c45c4a",borderColor:"rgba(196,92,74,.2)",marginBottom:6}} onClick={()=>setModal({type:"confirmAction",
                    title:"Remove from Lease",
                    body:`This will unlink ${l.tenantName} from this lease. The lease record will remain but will have no tenant attached. This does NOT terminate their tenancy. Are you sure?`,
                    confirmLabel:"Remove from Lease",confirmStyle:"btn-red",
                    onConfirm:()=>{setLeases(p=>p.map(x=>x.id===l.id?{...x,tenantName:"",tenantEmail:"",tenantPhone:""}:x));setViewingLease(null);showAlert({title:"Removed",body:"Tenant unlinked from lease."});}
                  })}>Remove from Lease</button>
                  {r&&<button className="btn btn-out" style={{width:"100%",color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>{setViewingLease(null);setModal({type:"tenant",data:r,termStep:1,termErrs:{}});}}>Terminate Tenancy</button>}
                </div>
              </div>
            </div>

          </div>{/* end right */}
        </div>{/* end grid */}
      </div>{/* end body */}
    </div>);
  })()}

  {/* ═══ MODALS ═══ */}
  {modal&&modal.type==="tenant"&&(()=>{
    const r=modal.data;
    const pd=(payments[r.id]&&payments[r.id][MO])||0;
    const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;
    const months=dl?Math.max(0,Math.ceil(dl/30)):null;
    const prop=props.find(p=>allRooms(p).some(x=>x.id===r.id));
    const tenantCharges=charges.filter(c=>c.roomId===r.id).sort((a,b)=>new Date(b.dueDate)-new Date(a.dueDate));
    const totalPaid=tenantCharges.reduce((s,c)=>s+c.amountPaid,0);
    const pastDueC=tenantCharges.filter(c=>chargeStatus(c)==="pastdue").length;
    const rentCharges=charges.filter(c=>c.roomId===r.id&&c.category==="Rent").sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
    const lateFeeCharges=charges.filter(c=>c.roomId===r.id&&c.category==="Late Fee");
    const totalLateFees=lateFeeCharges.reduce((s,c)=>s+c.amount,0);
    const moData=rentCharges.map(c=>{
      const st=chargeStatus(c);const paid=c.payments&&c.payments[0];
      const dueDate=new Date(c.dueDate+"T00:00:00");const paidDate=paid?new Date(paid.date+"T00:00:00"):null;
      const daysLate=paidDate?Math.max(0,Math.ceil((paidDate-dueDate)/(864e5))):null;
      const isLate=paidDate&&daysLate>3;const isPastDue=st==="pastdue";
      const mo=(c.dueDate||"").slice(0,7);
      const label=mo?new Date(mo+"-02").toLocaleString("default",{month:"short",year:"2-digit"}):"—";
      const matchedLateFee=lateFeeCharges.find(lf=>(lf.dueDate||"").slice(0,7)===mo);
      const lateFeeAmt=matchedLateFee?matchedLateFee.amount:0;
      return{c,st,daysLate,isLate,isPastDue,label,mo,lateFeeAmt};
    });
    const onTime=moData.filter(m=>!m.isLate&&!m.isPastDue&&(m.st==="paid"||m.st==="waived")).length;
    const pct=rentCharges.length?Math.round(onTime/rentCharges.length*100):100;
    const badgeLabel=pct>=90?"Great Payer":pct>=70?"Occasional Late":"Chronic Late";
    const badgeColor=pct>=90?"#4a7c59":pct>=70?"#9a7422":"#c45c4a";
    const badgeBg=pct>=90?"rgba(74,124,89,.1)":pct>=70?"rgba(212,168,83,.1)":"rgba(196,92,74,.1)";
    const sendInvite=async()=>{
      setPortalInviteState("sending");
      try{
        const res=await fetch("/api/portal-invite",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tenantName:r.tenant.name,tenantEmail:r.tenant.email,propertyName:r.propName,roomName:r.name,rent:r.rent,moveIn:r.tenant.moveIn})});
        const d=await res.json();if(d.ok)setPortalInviteState("sent");else setPortalInviteState("error");
      }catch(e){setPortalInviteState("error");}
    };
    const TI=({d,d2,size=16,stroke="#6b5e52"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d={d}/>{d2&&<path d={d2}/>}</svg>;
    const catIcons={"Rent":{d:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",d2:"M9 22V12h6v10",color:"#3b82f6"},"Late Fee":{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",d2:"M12 9v4M12 17h.01",color:"#c45c4a"},"Security Deposit":{d:"M19 11H5M19 11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2M19 11V9a7 7 0 1 0-14 0v2",color:"#7c3aed"},"Utility Overage":{d:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",color:"#9a7422"},"Damage Charge":{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",color:"#c45c4a"}};
    const isExpiring=dl!==null&&dl>=0&&dl<=(settings.m2mNoticeDays||90);
    const isExpired=dl!==null&&dl<0;
    const isM2M=r.m2m||(!r.le);
    const m2mIncrease=settings.m2mIncrease||50;
    const condReports=r.tenant?.conditionReports||[];
    const houseRules=[
      "No smoking or vaping anywhere on the property",
      "No pets allowed",
      "No shoes inside — remove at the door",
      "Quiet hours: 10pm–7am weekdays, 11pm–10am weekends",
      "Clean up after yourself in shared areas",
      "Do not duplicate keys or grant unauthorized access",
      "Parking in designated spots only",
      "No open flames, candles, or grills inside",
    ];
    const tUtils=r.propUtils||"allIncluded";
    const tClean=r.propClean||"Biweekly";
    const TABS=[
      {id:"summary",label:"Summary"},
      {id:"payments",label:"Payments"},
      {id:"condition",label:"Condition Report"},
      {id:"guide",label:"Home Guide"},
    ];
    return(
    <div style={{position:"fixed",top:0,right:0,bottom:0,left:220,background:"#f5f4f1",zIndex:200,overflowY:"auto"}}>

      {/* ── Sticky top bar ── */}
      <div style={{background:"#fff",borderBottom:"1px solid rgba(0,0,0,.08)",padding:"0 32px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:16,height:56}}>
          <button onClick={()=>{setModal(null);setPortalInviteState("idle");}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:"#5c4a3a",padding:"6px 10px",borderRadius:6,transition:"background .15s"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Tenants
          </button>
          <div style={{width:1,height:20,background:"rgba(0,0,0,.1)"}}/>
          <div style={{width:38,height:38,borderRadius:"50%",background:`rgba(${settings.adminAccentRgb||"74,124,89"},.15)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:settings.adminAccent||"#4a7c59",flexShrink:0}}>
            {(r.tenant.name||"?").split(" ").map(n=>n[0]).slice(0,2).join("")}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:800,color:"#1a1714"}}>{r.tenant.name}</div>
            <div style={{fontSize:11,color:"#6b5e52"}}>{r.propName}{prop?.addr?" · "+prop.addr:""} · {r.name}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {!pd&&<button className="btn btn-green btn-sm" onClick={()=>openPayForm(r.id)}>Record Payment</button>}
            <button className="btn btn-out btn-sm" style={{color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>setModal(prev=>({...prev,termStep:1,termErrs:{}}))}>Terminate</button>
          </div>
        </div>

        {/* ── Browser Tabs ── */}
        <div style={{display:"flex",gap:0,marginTop:0}}>
          {TABS.map(t=>{
            const active=tenantProfileTab===t.id;
            return(
            <button key={t.id} onClick={()=>setTenantProfileTab(t.id)}
              style={{padding:"10px 20px",border:"none",borderBottom:active?`2px solid ${settings.adminAccent||"#4a7c59"}`:"2px solid transparent",background:"transparent",color:active?"#1a1714":"#7a7067",fontWeight:active?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap"}}>
              {t.label}
            </button>);
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 32px 60px"}}>

        {/* ── SUMMARY TAB ── */}
        {tenantProfileTab==="summary"&&<div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:24,alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Lease expiry / M2M panel */}
            {(isM2M||isExpiring||isExpired)&&(()=>{
              const m2mRent=(r.rent||0)+m2mIncrease;
              return(
              <div style={{background:isM2M?"rgba(59,130,246,.05)":isExpired?"rgba(196,92,74,.05)":"rgba(212,168,83,.05)",border:`1px solid ${isM2M?"rgba(59,130,246,.2)":isExpired?"rgba(196,92,74,.2)":"rgba(212,168,83,.2)"}`,borderRadius:12,padding:"20px 24px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isM2M?"#3b82f6":isExpired?"#c45c4a":"#d4a853"} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:isM2M?"#1d4ed8":isExpired?"#c45c4a":"#9a7422"}}>{isM2M?"Month-to-Month":isExpired?"Lease Expired":"Lease Expiring Soon"}</div>
                    <div style={{fontSize:11,color:"#5c4a3a"}}>{isM2M?`${fmtS(r.rent)}/mo · No fixed end date`:isExpired?`Expired ${fmtD(r.le)}`:`${dl} days remaining — ${fmtD(r.le)}`}</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {!isM2M&&<button onMouseEnter={e=>e.currentTarget.style.background="rgba(74,124,89,.15)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(74,124,89,.06)"} style={{padding:"10px",borderRadius:8,border:"1px solid rgba(74,124,89,.25)",background:"rgba(74,124,89,.06)",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all .15s"}} onClick={()=>{const ne=new Date(TODAY);ne.setFullYear(ne.getFullYear()+1);setModal({type:"renewLease",room:r,prop,currentRent:r.rent,newRent:r.rent,newEnd:ne.toISOString().split("T")[0],mode:"renew",existingLease:null});}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#4a7c59"}}>Renew 12 Months</div>
                    <div style={{fontSize:10,color:"#6b5e52"}}>{fmtS(r.rent)}/mo</div>
                  </button>}
                  {!isM2M&&<button onMouseEnter={e=>e.currentTarget.style.background="rgba(59,130,246,.1)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(59,130,246,.04)"} style={{padding:"10px",borderRadius:8,border:"1px solid rgba(59,130,246,.2)",background:"rgba(59,130,246,.04)",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all .15s"}} onClick={()=>{const ne=new Date(TODAY);ne.setFullYear(ne.getFullYear()+1);setModal({type:"renewLease",room:r,prop,currentRent:r.rent,newRent:r.rent,newEnd:ne.toISOString().split("T")[0],mode:"renew_rate",existingLease:null});}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#3b82f6"}}>Renew at New Rate</div>
                    <div style={{fontSize:10,color:"#6b5e52"}}>Edit amount</div>
                  </button>}
                  <button onMouseEnter={e=>e.currentTarget.style.background="rgba(212,168,83,.15)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(212,168,83,.06)"} style={{padding:"10px",borderRadius:8,border:"1px solid rgba(212,168,83,.25)",background:"rgba(212,168,83,.06)",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all .15s"}} onClick={()=>setModal({type:"renewLease",room:r,prop,currentRent:r.rent,newRent:isM2M?r.rent:m2mRent,newEnd:null,mode:"m2m"})}>
                    <div style={{fontSize:11,fontWeight:700,color:"#9a7422"}}>{isM2M?"Stay M2M":"Go Month-to-Month"}</div>
                    <div style={{fontSize:10,color:"#6b5e52"}}>{isM2M?fmtS(r.rent)+"/mo":"+"+fmtS(m2mIncrease)+" · "+fmtS(m2mRent)+"/mo"}</div>
                  </button>
                  <button onMouseEnter={e=>e.currentTarget.style.background="rgba(196,92,74,.1)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(196,92,74,.04)"} style={{padding:"10px",borderRadius:8,border:"1px solid rgba(196,92,74,.2)",background:"rgba(196,92,74,.04)",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all .15s"}} onClick={()=>setModal(prev=>({...prev,termStep:1,termErrs:{}}))}>
                    <div style={{fontSize:11,fontWeight:700,color:"#c45c4a"}}>Do Not Renew</div>
                    <div style={{fontSize:10,color:"#6b5e52"}}>Start termination</div>
                  </button>
                </div>
              </div>);
            })()}

            {/* Lease section */}
            {(()=>{
              const tLease=leases.find(l=>apps.find(a=>a.name===r.tenant?.name&&a.id===l.applicationId))||leases.find(l=>l.tenantEmail===r.tenant?.email||l.tenantName===r.tenant?.name);
              const scColors={draft:"#6b5e52",pending_landlord:"#d4a853",pending_tenant:"#3b82f6",executed:"#4a7c59"};
              const scLabels={draft:"Draft",pending_landlord:"Awaiting Your Signature",pending_tenant:"Sent to Tenant",executed:"Current"};
              return(
              <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <TI d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6" size={16}/>
                    <span style={{fontSize:14,fontWeight:700}}>Lease</span>
                  </div>
                  {tLease&&<button onClick={()=>setViewingLease({lease:tLease,room:r})} onMouseEnter={e=>e.currentTarget.style.color="#1a1714"} onMouseLeave={e=>e.currentTarget.style.color=settings.adminAccent||"#4a7c59"} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,color:settings.adminAccent||"#4a7c59",fontFamily:"inherit",transition:"color .15s"}}>View Full Lease →</button>}
                </div>
                {tLease?(
                  <div style={{border:"1px solid rgba(0,0,0,.07)",borderRadius:8,padding:"12px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,background:tLease.status==="executed"?"rgba(74,124,89,.1)":tLease.status==="pending_tenant"?"rgba(59,130,246,.1)":"rgba(212,168,83,.1)",color:scColors[tLease.status]||"#6b5e52"}}>{scLabels[tLease.status]||tLease.status}</span>
                      {tLease.status==="pending_tenant"&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>{navigator.clipboard.writeText(tLease.signingLink||"");showAlert({title:"Copied",body:"Signing link copied."});}}>Copy Link</button>}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {[["Period",fmtD(tLease.moveIn)+" – "+fmtD(tLease.leaseEnd)],["Rent",fmtS(tLease.rent)+"/mo"],["SD",fmtS(tLease.sd)],["Property",tLease.property+(prop?.addr?" — "+prop.addr:"")]].map(([k,v])=>(
                        <div key={k}><div style={{fontSize:9,color:"#7a7067",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{k}</div><div style={{fontSize:12,fontWeight:600}}>{v}</div></div>
                      ))}
                    </div>
                    {tLease.status==="pending_tenant"&&<div style={{marginTop:10,padding:"6px 10px",background:"rgba(59,130,246,.06)",borderRadius:6,fontSize:10,color:"#3b82f6",fontWeight:600}}>Awaiting tenant signature</div>}
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:16}}>
                    <div style={{fontSize:12,color:"#6b5e52",marginBottom:10}}>No lease on file.</div>
                    <button className="btn btn-out btn-sm" style={{width:"100%"}} onClick={()=>{setModal(null);goTab("leases");}}>Create Lease →</button>
                  </div>
                )}
              </div>);
            })()}

            {/* Termination flow */}
            {modal.termStep===1&&<div style={{background:"#fff",borderRadius:12,border:"2px solid rgba(196,92,74,.25)",padding:"20px 24px"}}>
              <div style={{fontSize:15,fontWeight:800,color:"#c45c4a",marginBottom:14}}>Terminate Lease</div>
              <div className="fld"><label>Termination Date *</label><input type="date" value={modal.termDate||""} onChange={e=>setModal(p=>({...p,termDate:e.target.value,termErrs:{}}))} style={{width:"100%"}}/>{modal.termErrs?.date&&<div className="err-msg">{modal.termErrs.date}</div>}</div>
              <div className="fld"><label>Reason *</label><textarea value={modal.termNotes||""} onChange={e=>setModal(p=>({...p,termNotes:e.target.value,termErrs:{}}))} rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit"}}/>{modal.termErrs?.notes&&<div className="err-msg">{modal.termErrs.notes}</div>}</div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(p=>({...p,termStep:null}))}>Cancel</button>
                <button className="btn btn-red" style={{flex:1}} onClick={()=>{const e={};if(!modal.termDate)e.date="Required";if(!(modal.termNotes||"").trim())e.notes="Required";if(Object.keys(e).length){setModal(p=>({...p,termErrs:e}));shakeModal();return;}setModal(p=>({...p,termStep:2}));}}>Continue →</button>
              </div>
            </div>}
            {modal.termStep===2&&<div style={{background:"#fff",borderRadius:12,border:"2px solid rgba(196,92,74,.25)",padding:"20px 24px"}}>
              <div style={{fontSize:15,fontWeight:800,color:"#c45c4a",marginBottom:14}}>Confirm Termination</div>
              <div className="fld"><label>Security Deposit *</label><select value={modal.termSdStatus||""} onChange={e=>setModal(p=>({...p,termSdStatus:e.target.value}))} style={{width:"100%"}}><option value="">Select...</option><option value="returned">Returned in full</option><option value="partial">Partial return</option><option value="withheld">Withheld for damages</option></select>{modal.termErrs?.sd&&<div className="err-msg">{modal.termErrs.sd}</div>}</div>
              <div className="fld"><label>Type tenant name to confirm: <strong>{r.tenant.name}</strong></label><input value={modal.termConfirm||""} onChange={e=>setModal(p=>({...p,termConfirm:e.target.value}))} placeholder={r.tenant.name} style={{width:"100%"}}/>{modal.termErrs?.confirm&&<div className="err-msg">{modal.termErrs.confirm}</div>}</div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn btn-out" style={{flex:1}} onClick={()=>setModal(p=>({...p,termStep:1,termErrs:{}}))}>← Back</button>
                <button className="btn btn-red" style={{flex:1}} onClick={()=>{
                  const e={};if(!modal.termSdStatus)e.sd="Select SD status";if((modal.termConfirm||"").trim()!==r.tenant.name)e.confirm=`Must match: "${r.tenant.name}"`;
                  if(Object.keys(e).length){setModal(p=>({...p,termErrs:e}));shakeModal();return;}
                  setArchive(prev=>[{id:uid(),name:r.tenant.name,email:r.tenant.email,phone:r.tenant.phone,roomName:r.name,propName:r.propName,rent:r.rent,moveIn:r.tenant.moveIn,leaseEnd:r.le,terminatedDate:modal.termDate,reason:modal.termNotes,sdStatus:modal.termSdStatus,sdNote:modal.termSdNote||"",payments:payments[r.id]||{},archivedOn:TODAY.toISOString().split("T")[0]},...prev]);
                  const termUnit=r.unitId?props.flatMap(p=>p.units||[]).find(u=>u.id===r.unitId):null;
                  const termIsWhole=!!(termUnit&&(termUnit.rentalMode||"byRoom")==="wholeHouse");
                  if(termIsWhole&&r.unitId){setProps(prev=>prev.map(p=>({...p,units:(p.units||[]).map(u=>u.id===r.unitId?{...u,rooms:(u.rooms||[]).map(rm=>({...rm,st:"vacant",le:null,tenant:null}))}:u)})));}
                  else{setProps(prev=>updateRoomInProps(prev,r.id,rm=>({...rm,st:"vacant",le:null,tenant:null})));}
                  setNotifs(p=>[{id:uid(),type:"lease",msg:`Lease terminated: ${r.tenant.name} — ${r.name} at ${r.propName}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
                  setModal(null);
                }}>Confirm Termination</button>
              </div>
            </div>}
          </div>

          {/* Right sidebar */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Contact */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><TI d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" d2="M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><span style={{fontSize:14,fontWeight:700}}>Contact</span></div>
              <div style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}><TI d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.16 12a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 3.13 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" size={14}/><span style={{fontSize:12}}>{r.tenant.phone||"—"}</span></div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}><TI d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" d2="M22 6l-10 7L2 6" size={14}/><span style={{fontSize:12,color:"#3b82f6"}}>{r.tenant.email||"—"}</span></div>
            </div>
            {/* Room & Lease */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><TI d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10"/><span style={{fontSize:14,fontWeight:700}}>Room & Lease</span></div>
              {[["Property",r.propName+(prop?.addr?" · "+prop.addr:"")],["Room",r.name],["Bath",r.pb?"Private":"Shared"],["Rent",fmtS(r.rent)+"/mo"],["Utilities",tUtils==="allIncluded"?"All Included":"Tenant pays (split)"],["Move-in",fmtD(r.tenant.moveIn)],["Lease End",r.le?fmtD(r.le):isM2M?"Month-to-Month":"—"],["Annual Value",fmtS((r.rent||0)*12)+"/yr"]].filter(([,v])=>v).map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.03)",fontSize:12}}><span style={{color:"#6b5e52"}}>{k}</span><span style={{fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{v}</span></div>
              ))}
              {r.le&&dl!==null&&<div style={{marginTop:10}}>
                <div style={{height:5,borderRadius:3,background:"rgba(0,0,0,.06)"}}><div style={{height:"100%",borderRadius:3,width:`${Math.min(100,Math.max(0,(1-dl/365)*100))}%`,background:dl<=30?"#c45c4a":dl<=90?"#d4a853":"#4a7c59",transition:"width .3s"}}/></div>
                <div style={{fontSize:10,color:dl<=30?"#c45c4a":dl<=90?"#d4a853":"#6b5e52",marginTop:4}}>{dl} days remaining{months?` (${months} mo)`:""}</div>
              </div>}
            </div>
            {/* Portal Invite */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><TI d="M19 11H5M19 11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2M19 11V9a7 7 0 1 0-14 0v2"/><span style={{fontSize:14,fontWeight:700}}>Tenant Portal</span></div>
              <div style={{fontSize:11,color:"#6b5e52",marginBottom:10}}>{portalInviteState==="sent"?"Invite sent — tenant will receive an email.":portalInviteState==="error"?"Failed. Try again.":"Send the tenant a link to access their portal."}</div>
              {portalInviteState==="sent"
                ?<div style={{padding:"8px 12px",background:"rgba(74,124,89,.08)",borderRadius:7,fontSize:11,color:"#4a7c59",fontWeight:600}}>Sent to {r.tenant.email} · <button style={{background:"none",border:"none",cursor:"pointer",color:"#6b5e52",fontSize:11,fontFamily:"inherit",padding:0}} onClick={()=>setPortalInviteState("idle")}>Resend</button></div>
                :<button className="btn btn-green" style={{width:"100%"}} onClick={sendInvite} disabled={portalInviteState==="sending"}>{portalInviteState==="sending"?"Sending...":"Send Portal Invite"}</button>}
            </div>
          </div>
        </div>}

        {/* ── PAYMENTS TAB ── */}
        {tenantProfileTab==="payments"&&<div>
          {/* Unpaid amount hero */}
          {pastDueC>0&&<div style={{background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.2)",borderRadius:10,padding:"14px 20px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:12,color:"#c45c4a",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Unpaid charges</div><div style={{fontSize:28,fontWeight:800,color:"#c45c4a"}}>{fmtS(tenantCharges.filter(c=>chargeStatus(c)==="pastdue"||chargeStatus(c)==="unpaid").reduce((s,c)=>s+(c.amount-c.amountPaid),0))}</div></div>
            <button className="btn btn-green" onClick={()=>openPayForm(r.id)}>Record Payment</button>
          </div>}

          {/* Monthly recurring charges */}
          <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",marginBottom:20,overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,fontWeight:700}}>Monthly Charges</span>
              <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"addCharge",roomId:r.id,tenantName:r.tenant.name,propName:r.propName,roomName:r.name})}>+ Add Charge</button>
            </div>
            {/* Rent — recurring */}
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
              <div style={{width:32,height:32,borderRadius:8,background:"rgba(59,130,246,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>Rent <span style={{fontSize:9,background:"rgba(59,130,246,.08)",color:"#3b82f6",padding:"1px 6px",borderRadius:3,fontWeight:600,marginLeft:4}}>RECURRING</span></div>
                <div style={{fontSize:11,color:"#6b5e52"}}>Due on the 1st · Auto-generated monthly</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:16,fontWeight:800}}>{fmtS(r.rent)}/mo</div>
                <div style={{fontSize:10,color:"#6b5e52"}}>Move-in {fmtD(r.tenant.moveIn)} – {r.le?fmtD(r.le):"M2M"}</div>
              </div>
            </div>
          </div>

          {/* All charges ledger */}
          <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,fontWeight:700}}>Sent Charges</span>
              <div style={{display:"flex",gap:10,fontSize:12,color:"#6b5e52"}}>
                <span>Total Paid: <strong style={{color:"#4a7c59"}}>{fmtS(totalPaid)}</strong></span>
                {pastDueC>0&&<span style={{color:"#c45c4a",fontWeight:700}}>{pastDueC} overdue</span>}
              </div>
            </div>
            {/* Column headers */}
            <div style={{display:"grid",gridTemplateColumns:"100px 1fr 90px 90px 140px 80px",padding:"8px 20px",background:"rgba(0,0,0,.02)",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
              {["Due Date","Category / Description","Status","Amount","Deposit",""].map((h,i)=><div key={i} style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5}}>{h}</div>)}
            </div>
            {tenantCharges.length===0&&<div style={{textAlign:"center",padding:32,color:"#6b5e52",fontSize:13}}>No charges yet.</div>}
            {tenantCharges.map(c=>{
              const st=chargeStatus(c);const rem=c.amount-c.amountPaid;
              const ci=catIcons[c.category]||{d:"M9 11l3 3L22 4",color:"#6b5e52"};
              const stBg={paid:"rgba(74,124,89,.08)",pastdue:"rgba(196,92,74,.08)",unpaid:"rgba(212,168,83,.08)",partial:"rgba(212,168,83,.08)",waived:"rgba(0,0,0,.04)",voided:"rgba(0,0,0,.04)"};
              const stTx={paid:"#4a7c59",pastdue:"#c45c4a",unpaid:"#9a7422",partial:"#9a7422",waived:"#7a7067",voided:"#7a7067"};
              return(
              <div key={c.id} style={{display:"grid",gridTemplateColumns:"100px 1fr 90px 90px 140px 80px",padding:"12px 20px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center",background:st==="pastdue"?"rgba(196,92,74,.02)":"#fff"}}>
                <div style={{fontSize:12,color:"#5c4a3a"}}>{fmtD(c.dueDate)}</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:6,background:`rgba(${ci.color.replace(/[^0-9,]/g,"").slice(0,11)},.1)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ci.color} strokeWidth="1.75"><path d={ci.d}/>{ci.d2&&<path d={ci.d2}/>}</svg>
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600}}>{c.desc||c.category}</div>
                    {c.amountPaid>0&&c.amountPaid<c.amount&&<div style={{fontSize:10,color:"#6b5e52"}}>{fmtS(c.amountPaid)} paid · {fmtS(rem)} remaining</div>}
                    {c.reminderActive&&<div style={{fontSize:9,color:"#d4a853",fontWeight:700}}>Reminding daily</div>}
                  </div>
                </div>
                <div><span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,background:stBg[st]||"rgba(0,0,0,.04)",color:stTx[st]||"#6b5e52"}}>{st==="pastdue"?"Late":st}</span></div>
                <div style={{fontSize:13,fontWeight:800,color:st==="pastdue"?"#c45c4a":st==="unpaid"?"#9a7422":"#1a1714"}}>{fmtS(c.amount)}</div>
                {/* Deposit info */}
                <div style={{fontSize:10,color:"#5c4a3a"}}>
                  {(c.payments||[]).length>0?(
                    <div>
                      {(c.payments||[]).slice(0,1).map((p,i)=>(
                        <div key={i}>
                          <div style={{fontWeight:600}}>{p.date?fmtD(p.date):""}</div>
                          <div style={{color:"#7a7067"}}>{p.method||""}</div>
                          <div style={{color:"#4a7c59",fontSize:9}}>Due: $0.00</div>
                        </div>
                      ))}
                    </div>
                  ):<span style={{color:"#8a7d74"}}>—</span>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  {st!=="paid"&&st!=="waived"&&st!=="voided"&&<button className="btn btn-green btn-sm" style={{fontSize:9,padding:"3px 8px"}} onClick={()=>setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""})}>Pay</button>}
                  {st==="pastdue"&&!c.reminderActive&&<button style={{fontSize:9,padding:"2px 6px",borderRadius:3,border:"1px solid rgba(196,92,74,.2)",background:"transparent",color:"#c45c4a",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setModal({type:"sendReminder",charge:c,tenantName:c.tenantName,rem,method:null})}>Remind</button>}
                </div>
              </div>);
            })}
          </div>

          {/* View in Tenant Ledger link */}
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}>
            <button className="btn btn-out btn-sm" onClick={()=>{setModal(null);goTab("payments");setPayFilters({...payFilters,tenant:r.tenant.name});}}>
              View in Tenant Ledger →
            </button>
          </div>

          {/* Payment pattern */}
          {rentCharges.length>0&&<div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px",marginTop:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontSize:14,fontWeight:700}}>Payment Pattern</span>
              <span style={{fontSize:11,fontWeight:700,color:badgeColor,background:badgeBg,padding:"3px 10px",borderRadius:100}}>{badgeLabel}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
              <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#4a7c59"}}>{pct}%</div><div style={{fontSize:10,color:"#6b5e52"}}>On-time</div></div>
              <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:totalLateFees?"#c45c4a":"#4a7c59"}}>{fmtS(totalLateFees)}</div><div style={{fontSize:10,color:"#6b5e52"}}>Late Fees</div></div>
              <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:pastDueC?"#c45c4a":"#4a7c59"}}>{pastDueC}</div><div style={{fontSize:10,color:"#6b5e52"}}>Overdue</div></div>
            </div>
          </div>}
        </div>}

        {/* ── CONDITION REPORT TAB ── */}
        {tenantProfileTab==="condition"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontSize:15,fontWeight:800}}>Move-In Condition Report</div>
              <div style={{fontSize:12,color:"#6b5e52",marginTop:2}}>Document the condition of the property at move-in. This protects both you and the tenant at move-out.</div>
            </div>
            <button className="btn btn-green btn-sm" onClick={()=>setModal({type:"addConditionItem",roomId:r.id,tenantName:r.tenant.name,area:"",condition:"good",notes:"",photos:[]})}>+ Add Area</button>
          </div>
          {condReports.length===0&&<div style={{background:"#fff",borderRadius:12,border:"2px dashed rgba(0,0,0,.1)",padding:"48px 32px",textAlign:"center"}}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth="1.25" style={{marginBottom:12}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>No condition report yet</div>
            <div style={{fontSize:12,color:"#6b5e52",marginBottom:16}}>Document each area of the property — bedroom, bathroom, kitchen, common areas — with photos and condition notes before the tenant moves in.</div>
            <button className="btn btn-green" onClick={()=>setModal({type:"addConditionItem",roomId:r.id,tenantName:r.tenant.name,area:"",condition:"good",notes:"",photos:[]})}>Create Condition Report</button>
          </div>}
          {condReports.length>0&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
            {condReports.map((item,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"16px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontSize:14,fontWeight:700}}>{item.area}</div>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,background:item.condition==="good"?"rgba(74,124,89,.1)":item.condition==="fair"?"rgba(212,168,83,.1)":"rgba(196,92,74,.1)",color:item.condition==="good"?"#4a7c59":item.condition==="fair"?"#9a7422":"#c45c4a"}}>{item.condition}</span>
                </div>
                {item.notes&&<div style={{fontSize:12,color:"#5c4a3a",marginBottom:8}}>{item.notes}</div>}
                {(item.photos||[]).length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {item.photos.map((src,j)=><img key={j} src={src} alt="" style={{width:80,height:60,objectFit:"cover",borderRadius:6,border:"1px solid rgba(0,0,0,.08)"}}/>)}
                </div>}
              </div>
            ))}
          </div>}
        </div>}

        {/* ── HOME GUIDE TAB ── */}
        {tenantProfileTab==="guide"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>House Rules</div>
            {houseRules.map((rule,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:12,alignItems:"flex-start"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:settings.adminAccent||"#4a7c59",flexShrink:0,marginTop:5}}/>
                <span>{rule}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Amenities</div>
              {[["Utilities",tUtils==="allIncluded"?"All utilities included":"Tenant pays — split equally"],["WiFi","Google Fiber — always included"],["Cleaning",tClean==="Weekly"?"Common areas cleaned weekly":"Common areas cleaned biweekly"],["Parking","One spot per tenant"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.03)",fontSize:12}}><span style={{color:"#6b5e52"}}>{k}</span><span style={{fontWeight:600,textAlign:"right",maxWidth:"55%"}}>{v}</span></div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Contact & Emergency</div>
              {[["Phone",settings.phone||"—"],["Email",settings.pmEmail||settings.email||"—"],["Emergency","911 — then notify us immediately"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.03)",fontSize:12}}><span style={{color:"#6b5e52"}}>{k}</span><span style={{fontWeight:600}}>{v}</span></div>
              ))}
            </div>
          </div>
        </div>}

      </div>
    </div>);
  })()}

  {/* Record Payment Modal */}
  {/* Confirm Action Modal — generic destructive confirmation */}
  {modal&&modal.type==="leaseSummary"&&(()=>{
    const l=modal.lease;
    const statusColors={draft:{bg:"rgba(0,0,0,.06)",tx:"#5c4a3a",label:"Draft"},pending_landlord:{bg:"rgba(212,168,83,.1)",tx:"#9a7422",label:"Awaiting Your Signature"},pending_tenant:{bg:"rgba(59,130,246,.1)",tx:"#1d4ed8",label:"Sent to Tenant"},executed:{bg:"rgba(74,124,89,.1)",tx:"#2d6a3f",label:"Executed"}};
    const sc=statusColors[l.status]||statusColors.draft;
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:500}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{margin:0}}>Lease Summary</h2>
        <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,background:sc.bg,color:sc.tx}}>{sc.label}</span>
      </div>

      {/* Key details grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {[["Tenant",l.tenantName],["Property",l.property],["Room",l.room],["Monthly Rent",fmtS(l.rent||0)+"/mo"],["Security Deposit",fmtS(l.sd||0)],["Prorated Rent",l.proratedRent>0?fmtS(l.proratedRent):"None"],["Lease Start",fmtD(l.leaseStart||l.moveIn)],["Lease End",fmtD(l.leaseEnd)],["Landlord",l.landlordName],["Email",l.tenantEmail]].filter(([,v])=>v).map(([k,v])=>(
          <div key={k} style={{background:"rgba(0,0,0,.02)",borderRadius:7,padding:"8px 12px"}}>
            <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.6,marginBottom:3}}>{k}</div>
            <div style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Status-specific info */}
      {l.status==="pending_tenant"&&<div style={{padding:"10px 14px",background:"rgba(59,130,246,.06)",border:"1px solid rgba(59,130,246,.2)",borderRadius:8,marginBottom:14,fontSize:11,color:"#1d4ed8"}}>
        <div style={{fontWeight:700,marginBottom:4}}>Awaiting tenant signature</div>
        <div style={{wordBreak:"break-all",fontFamily:"monospace",fontSize:10}}>{l.signingLink}</div>
        <button className="btn btn-out btn-sm" style={{marginTop:8}} onClick={()=>{navigator.clipboard.writeText(l.signingLink||"");showAlert({title:"Copied",body:"Signing link copied."});}}>Copy Link</button>
      </div>}

      {l.status==="executed"&&<div style={{padding:"10px 14px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,marginBottom:14,fontSize:11,color:"#2d6a3f"}}>
        <div style={{fontWeight:700,marginBottom:4}}>Fully executed</div>
        {l.landlordSignedAt&&<div>Landlord signed: {new Date(l.landlordSignedAt).toLocaleDateString()}</div>}
        {l.tenantSignedAt&&<div>Tenant signed: {new Date(l.tenantSignedAt).toLocaleDateString()}</div>}
      </div>}

      {/* Sections list */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.6,marginBottom:8}}>Active Sections ({(l.sections||[]).filter(s=>s.active!==false).length})</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {(l.sections||[]).filter(s=>s.active!==false).map((s,i)=>(
            <span key={i} style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:"rgba(0,0,0,.04)",color:"#5c4a3a"}}>{s.title}</span>
          ))}
        </div>
      </div>

      {(l.addenda||[]).length>0&&<div style={{marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.6,marginBottom:8}}>Addenda ({l.addenda.length})</div>
        {l.addenda.map((a,i)=><div key={i} style={{fontSize:11,color:"#5c4a3a",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>{a.title}</div>)}
      </div>}

      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Close</button>
        <button className="btn btn-green" onClick={()=>{setModal(null);setViewingLease({lease:l,room:null});}}>View Full Lease →</button>
      </div>
    </div></div>);
  })()}

  {modal&&modal.type==="addAddendum"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
      <h2 style={{marginBottom:4}}>Add Addendum</h2>
      <p style={{fontSize:11,color:"#5c4a3a",marginBottom:14}}>This will be appended to the lease as a signed amendment. Make sure both parties are aware.</p>
      <div className="fld"><label>Addendum Title</label><input value={modal.title||""} onChange={e=>setModal(p=>({...p,title:e.target.value}))} placeholder="e.g. Pet Policy Amendment" autoFocus/></div>
      <div className="fld"><label>Content</label><textarea value={modal.text||""} onChange={e=>setModal(p=>({...p,text:e.target.value}))} placeholder="Describe the amendment in full..." rows={4} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/></div>
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-green" disabled={!(modal.text||"").trim()} onClick={()=>{
          const addendum={title:modal.title||"Addendum",text:modal.text,date:TODAY.toISOString().split("T")[0],addedBy:settings.companyName||"Property Manager"};
          setLeases(p=>p.map(x=>x.id===modal.leaseId?{...x,addenda:[...(x.addenda||[]),addendum]}:x));
          setModal(null);showAlert({title:"Addendum Added",body:"Amendment appended to the lease record."});
        }}>Add Addendum</button>
      </div>
    </div></div>
  )}

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
    const send=async(method,customMsg)=>{
      if(method==="email"&&email){
        try{
          await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
            to:email,
            subject:emailSubject,
            html:`<p>${customMsg.replace(/\n/g,"<br/>")}</p>`,
          })});
        }catch(e){console.error(e);}
      }
      if(method==="text"&&phone){window.open(`sms:${phone.replace(/\D/g,"")}?body=${encodeURIComponent(customMsg)}`);}
      // Set reminderActive so cron sends daily until paid
      setCharges(p=>p.map(x=>x.id===c.id?{...x,reminderActive:true,reminders:[...(x.reminders||[]),{method,date:TODAY.toISOString().split("T")[0]}]}:x));
      setNotifs(p=>[{id:uid(),type:"payment",msg:`Reminder sent to ${c.tenantName} via ${method}: ${c.category} ${fmtS(modal.rem)} due ${fmtD(c.dueDate)}`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
      setModal(null);
    };
    const reminderMsg=modal.reminderMsg!==undefined?modal.reminderMsg:defaultMsg;
    const isEdited=reminderMsg!==defaultMsg;
    const editingDefault=modal.editingDefault||false;
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
      <h2>Send Reminder</h2>
      <div style={{background:"rgba(196,92,74,.04)",border:"1px solid rgba(196,92,74,.1)",borderRadius:8,padding:12,marginBottom:14,fontSize:12}}>
        <div style={{fontWeight:700,marginBottom:2}}>{c.tenantName}</div>
        <div style={{color:"#6b5e52"}}>{c.category} — {fmtS(modal.rem)} overdue since {fmtD(c.dueDate)}</div>
      </div>

      <div className="fld" style={{marginBottom:6}}>
        <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>Message</span>
          <div style={{display:"flex",gap:4}}>
            {isEdited&&!editingDefault&&<button className="btn btn-out btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={()=>setModal(prev=>({...prev,reminderMsg:defaultMsg}))}>↺ Reset</button>}
            {!editingDefault&&<button className="btn btn-gold btn-sm" style={{fontSize:9,padding:"2px 8px"}} onClick={()=>setModal(prev=>({...prev,editingDefault:true,reminderMsg:template}))}>Edit Default</button>}
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
        <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Send via</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>send("email",reminderMsg)} disabled={!email}
            style={{flex:1,padding:"14px 8px",borderRadius:8,border:"2px solid #3b82f6",background:"rgba(59,130,246,.06)",cursor:email?"pointer":"not-allowed",opacity:email?1:.5,textAlign:"center",fontFamily:"inherit",transition:"all .15s"}}
            onMouseEnter={e=>{if(email)e.currentTarget.style.background="rgba(59,130,246,.12)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(59,130,246,.06)"}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75" style={{marginBottom:4}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <div style={{fontSize:12,fontWeight:700,color:"#3b82f6"}}>Email</div>
            <div style={{fontSize:9,color:"#3b82f6",opacity:.7,marginTop:2}}>{email||"No email on file"}</div>
          </button>
          <button onClick={()=>send("text",reminderMsg)} disabled={!phone}
            style={{flex:1,padding:"14px 8px",borderRadius:8,border:"2px solid #4a7c59",background:"rgba(74,124,89,.06)",cursor:phone?"pointer":"not-allowed",opacity:phone?1:.5,textAlign:"center",fontFamily:"inherit",transition:"all .15s"}}
            onMouseEnter={e=>{if(phone)e.currentTarget.style.background="rgba(74,124,89,.12)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(74,124,89,.06)"}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="1.75" style={{marginBottom:4}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <div style={{fontSize:12,fontWeight:700,color:"#4a7c59"}}>Text</div>
            <div style={{fontSize:9,color:"#4a7c59",opacity:.7,marginTop:2}}>{phone||"No phone on file"}</div>
          </button>
        </div>
        <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button></div>
      </>}
    </div></div>);
  })()}

  {/* ── Add / Edit Expense ── */}
  {modal&&modal.type==="addExpense"&&(()=>{
    const isEdit=!!modal.editId;
    const f=modal.form||{};const errs=modal.errs||{};
    const backdropMsg=modal._backdropMsg||"";
    const upd=(k,v)=>setModal(p=>({...p,form:{...p.form,[k]:v},errs:{...(p.errs||{}),[k]:null},_backdropMsg:""}));
    const selCat=SCHED_E_CATS.find(c=>c.label===f.category);
    const catSubcats=(subcats&&subcats[f.category])||[];
    const showSubcatMgr=modal._subcatMgr||false;
    const showVendorMgr=modal._vendorMgr||false;
    const subcatEditName=modal._subcatEdit||"";
    const vendorEditForm=modal._vendorEdit||null;
    // Property cascade
    const selPr=f.propId&&f.propId!=="shared"?props.find(p=>p.id===f.propId):null;
    const units=selPr?.units||[];
    const save=async()=>{
      const e={};
      if(!f.date)e.date="Date is required";
      if(!f.propId)e.propId="Property is required";
      if(!f.category)e.category="Category is required";
      if(!f.amount||Number(f.amount)<=0)e.amount="Amount must be greater than $0";
      if(Object.keys(e).length){setModal(p=>({...p,errs:e}));shakeModal();return;}
      const rec={...f,amount:Number(f.amount),propName:f.propId==="shared"?"Shared":(props.find(p=>p.id===f.propId)||{}).name||""};
      delete rec.receiptFile;
      const newId=isEdit?modal.editId:uid();
      if(f.receiptFile){
        const ext=f.receiptFile.name.split(".").pop()||"jpg";
        const path="receipts/"+newId+"-"+Date.now()+"."+ext;
        try{
          const r=await fetch(SUPA_URL+"/storage/v1/object/receipts/"+path,{method:"POST",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":f.receiptFile.type,"x-upsert":"true"},body:f.receiptFile});
          if(r.ok){rec.receiptUrl=SUPA_URL+"/storage/v1/object/public/receipts/"+path;}
          else{
            console.error("Receipt upload failed:",r.status,await r.text());
            rec.receiptUrl=URL.createObjectURL(f.receiptFile);
            rec._receiptPending=true;
          }
        }catch(e){
          console.error("Receipt upload error:",e);
          rec.receiptUrl=URL.createObjectURL(f.receiptFile);
          rec._receiptPending=true;
        }
      }
      if(isEdit){setExpenses(p=>p.map(x=>x.id===modal.editId?{...x,...rec}:x));}
      else{setExpenses(p=>[{id:newId,createdAt:TODAY.toISOString(),...rec},...p]);}
      setModal(null);
    };
    const handleBackdrop=(e)=>{
      if(e.target===e.currentTarget){
        setModal(p=>({...p,_backdropMsg:"Click Save or Cancel to close this window"}));
        shakeModal();
      }
    };
    return(
    <div className="mbg" onClick={handleBackdrop}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
      <h2 style={{marginBottom:16,fontSize:18}}>{isEdit?"Edit Expense":"Add Expense"}</h2>
      {backdropMsg&&<div style={{background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.2)",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:11,color:"#c45c4a",fontWeight:600,textAlign:"center"}}>{backdropMsg}</div>}

      {/* Date */}
      <div className="fld"><label style={{color:errs.date?"#c45c4a":undefined}}>Date *</label>
        <input type="date" value={f.date||""} onChange={e=>upd("date",e.target.value)} style={{borderColor:errs.date?"#c45c4a":undefined}}/>
        {errs.date&&<div className="err-msg">{errs.date}</div>}
      </div>

      {/* Amount */}
      <div className="fld"><label style={{color:errs.amount?"#c45c4a":undefined}}>Amount paid *</label>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#7a7067",fontWeight:700}}>$</span>
          <input type="number" min="0" step="0.01" value={f.amount||""} onChange={e=>upd("amount",e.target.value)} placeholder="0.00" style={{paddingLeft:28,borderColor:errs.amount?"#c45c4a":undefined}}/>
        </div>
        {errs.amount&&<div className="err-msg">{errs.amount}</div>}
      </div>

      {/* Property — with "Shared across all properties" */}
      <div className="fld"><label style={{color:errs.propId?"#c45c4a":undefined}}>Property *</label>
        <select value={f.propId||""} onChange={e=>{upd("propId",e.target.value);upd("unitId","");upd("unitName","");upd("roomId","");upd("roomName","");}} style={{borderColor:errs.propId?"#c45c4a":undefined}}>
          <option value="">— Select —</option>
          <option value="shared">Shared across all properties</option>
          {props.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {f.propId==="shared"&&<div style={{fontSize:10,color:"#3b82f6",marginTop:4,padding:"4px 8px",background:"rgba(59,130,246,.04)",borderRadius:4}}>Cost will be split equally across {props.length} propert{props.length===1?"y":"ies"} in reports and overview.</div>}
        {errs.propId&&<div className="err-msg">{errs.propId}</div>}
      </div>

      {/* Unit / Bedroom — smart cascade */}
      {(()=>{
        if(!selPr||units.length===0)return null;
        const isSingleUnit=units.length===1;
        const autoUnit=isSingleUnit?units[0]:null;
        const activeUnitId=isSingleUnit?autoUnit.id:f.unitId;
        const activeUnit=isSingleUnit?autoUnit:units.find(u=>u.id===f.unitId);
        const activeRooms=activeUnit?.rooms||[];
        const showBedrooms=activeRooms.length>0;
        return(<>
          {/* Multi-unit: show unit picker */}
          {!isSingleUnit&&<div className="fld"><label>Unit</label>
            <select value={f.unitId||""} onChange={e=>{const u=units.find(x=>x.id===e.target.value);upd("unitId",e.target.value);upd("unitName",u?.name||"");upd("roomId","");upd("roomName","");}}>
              <option value="">— Whole property —</option>
              {units.map(u=><option key={u.id} value={u.id}>{u.name||("Unit "+(units.indexOf(u)+1))}</option>)}
            </select>
          </div>}
          {/* Bedroom: show if single-unit (always) or multi-unit with unit selected */}
          {showBedrooms&&(isSingleUnit||f.unitId)&&<div className="fld"><label>Bedroom</label>
            <select value={f.roomId||""} onChange={e=>{const r=activeRooms.find(x=>x.id===e.target.value);upd("roomId",e.target.value);upd("roomName",r?.name||"");if(isSingleUnit){upd("unitId",autoUnit.id);upd("unitName",autoUnit.name||"");}}}>
              <option value="">— Whole {isSingleUnit?"property":"unit"} —</option>
              {activeRooms.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>}
        </>);
      })()}

      {/* Category */}
      <div className="fld">
        <label style={{color:errs.category?"#c45c4a":undefined}}>Expense category *</label>
        <select value={f.category||""} onChange={e=>{upd("category",e.target.value);upd("subcategory","");}} style={{borderColor:errs.category?"#c45c4a":undefined}}>
          <option value="">— Select a category —</option>
          {SCHED_E_CATS.map(c=><option key={c.id} value={c.label}>{c.label}</option>)}
        </select>
        {selCat&&<div style={{fontSize:10,color:"#9a7422",marginTop:4,padding:"4px 8px",background:"rgba(212,168,83,.06)",borderRadius:4}}>{selCat.hint}</div>}
        {errs.category&&<div className="err-msg">{errs.category}</div>}
      </div>

      {/* Subcategory — per-category dropdown with inline manager */}
      {f.category&&<div className="fld" style={{position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <label>Subcategory</label>
          <button type="button" style={{fontSize:9,color:"#9a7422",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:"2px 4px"}} onClick={()=>setModal(p=>({...p,_subcatMgr:!p._subcatMgr,_vendorMgr:false}))}>
            {showSubcatMgr?"Done":"Manage"}
          </button>
        </div>
        {!showSubcatMgr&&<>
          <select value={f.subcategory||""} onChange={e=>upd("subcategory",e.target.value)}>
            <option value="">— None —</option>
            {catSubcats.map(s=><option key={s.id} value={s.label}>{s.label}</option>)}
          </select>
        </>}
        {showSubcatMgr&&<div style={{border:"1px solid rgba(212,168,83,.2)",borderRadius:8,padding:10,background:"rgba(212,168,83,.03)",marginTop:4}}>
          <div style={{fontSize:10,fontWeight:700,color:"#9a7422",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Manage subcategories for {f.category}</div>
          {catSubcats.map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
            {modal._subcatRenameId===s.id
              ?<><input value={subcatEditName} onChange={e=>setModal(p=>({...p,_subcatEdit:e.target.value}))} style={{flex:1,fontSize:11,padding:"4px 8px"}} autoFocus/>
                <button type="button" className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59"}} onClick={()=>{
                  if(!subcatEditName.trim())return;
                  const cat=f.category;
                  setSubcats(p=>({...p,[cat]:(p[cat]||[]).map(x=>x.id===s.id?{...x,label:subcatEditName.trim()}:x)}));
                  if(f.subcategory===s.label)upd("subcategory",subcatEditName.trim());
                  setModal(p=>({...p,_subcatRenameId:null,_subcatEdit:""}));
                }}>Save</button>
                <button type="button" className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal(p=>({...p,_subcatRenameId:null,_subcatEdit:""}))}>Cancel</button>
              </>
              :<><span style={{flex:1,fontSize:11,color:"#5c4a3a"}}>{s.label}</span>
                <button type="button" style={{fontSize:9,color:"#3b82f6",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}} onClick={()=>setModal(p=>({...p,_subcatRenameId:s.id,_subcatEdit:s.label}))}>Rename</button>
                <button type="button" style={{fontSize:9,color:"#c45c4a",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}} onClick={()=>{
                  const cat=f.category;
                  setSubcats(p=>({...p,[cat]:(p[cat]||[]).filter(x=>x.id!==s.id)}));
                  if(f.subcategory===s.label)upd("subcategory","");
                }}>Delete</button>
              </>}
          </div>)}
          {catSubcats.length===0&&<div style={{fontSize:10,color:"#7a7067",padding:"6px 0"}}>No subcategories yet for {f.category}.</div>}
          <div style={{display:"flex",gap:4,marginTop:6}}>
            <input value={modal._newSubcat||""} onChange={e=>setModal(p=>({...p,_newSubcat:e.target.value}))} placeholder="New subcategory..." style={{flex:1,fontSize:11,padding:"4px 8px"}}
              onKeyDown={e=>{if(e.key==="Enter"&&(modal._newSubcat||"").trim()){const cat=f.category;setSubcats(p=>({...p,[cat]:[...(p[cat]||[]),{id:uid(),label:modal._newSubcat.trim()}]}));setModal(p=>({...p,_newSubcat:""}));}}}/>
            <button type="button" className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59"}} onClick={()=>{
              if(!(modal._newSubcat||"").trim())return;
              const cat=f.category;
              setSubcats(p=>({...p,[cat]:[...(p[cat]||[]),{id:uid(),label:modal._newSubcat.trim()}]}));
              setModal(p=>({...p,_newSubcat:""}));
            }}>+ Add</button>
          </div>
        </div>}
      </div>}

      {/* Vendor — dropdown with inline manager */}
      <div className="fld" style={{position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <label>Vendor / Payee</label>
          <button type="button" style={{fontSize:9,color:"#9a7422",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:"2px 4px"}} onClick={()=>setModal(p=>({...p,_vendorMgr:!p._vendorMgr,_subcatMgr:false}))}>
            {showVendorMgr?"Done":"Manage"}
          </button>
        </div>
        {!showVendorMgr&&<>
          <select value={f.vendor||""} onChange={e=>upd("vendor",e.target.value)}>
            <option value="">— None —</option>
            {vendors.slice().sort((a,b)=>a.name?.localeCompare(b.name||"")||0).map(v=><option key={v.id} value={v.name}>{v.name}</option>)}
          </select>
        </>}
        {showVendorMgr&&<div style={{border:"1px solid rgba(212,168,83,.2)",borderRadius:8,padding:10,background:"rgba(212,168,83,.03)",marginTop:4}}>
          <div style={{fontSize:10,fontWeight:700,color:"#9a7422",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Manage vendors</div>
          {vendors.slice().sort((a,b)=>a.name?.localeCompare(b.name||"")||0).map(v=><div key={v.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
            {modal._vendorRenameId===v.id
              ?<><input value={(vendorEditForm||{}).name||""} onChange={e=>setModal(p=>({...p,_vendorEdit:{...(p._vendorEdit||{}),name:e.target.value}}))} style={{flex:1,fontSize:11,padding:"4px 8px"}} placeholder="Vendor name" autoFocus/>
                <input value={(vendorEditForm||{}).phone||""} onChange={e=>setModal(p=>({...p,_vendorEdit:{...(p._vendorEdit||{}),phone:e.target.value}}))} style={{width:100,fontSize:11,padding:"4px 8px"}} placeholder="Phone"/>
                <button type="button" className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59"}} onClick={()=>{
                  if(!(vendorEditForm||{}).name?.trim())return;
                  const oldName=v.name;
                  setVendors(p=>p.map(x=>x.id===v.id?{...x,...vendorEditForm,name:vendorEditForm.name.trim()}:x));
                  if(f.vendor===oldName)upd("vendor",vendorEditForm.name.trim());
                  setModal(p=>({...p,_vendorRenameId:null,_vendorEdit:null}));
                }}>Save</button>
                <button type="button" className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>setModal(p=>({...p,_vendorRenameId:null,_vendorEdit:null}))}>Cancel</button>
              </>
              :<><span style={{flex:1,fontSize:11,color:"#5c4a3a"}}>{v.name}{v.phone?<span style={{color:"#7a7067",marginLeft:6,fontSize:9}}>{v.phone}</span>:""}</span>
                <button type="button" style={{fontSize:9,color:"#3b82f6",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}} onClick={()=>setModal(p=>({...p,_vendorRenameId:v.id,_vendorEdit:{name:v.name,phone:v.phone||"",email:v.email||""}}))}>Edit</button>
                <button type="button" style={{fontSize:9,color:"#c45c4a",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}} onClick={()=>{
                  setVendors(p=>p.filter(x=>x.id!==v.id));
                  if(f.vendor===v.name)upd("vendor","");
                }}>Delete</button>
              </>}
          </div>)}
          {vendors.length===0&&<div style={{fontSize:10,color:"#7a7067",padding:"6px 0"}}>No vendors saved yet.</div>}
          <div style={{display:"flex",gap:4,marginTop:6}}>
            <input value={modal._newVendor||""} onChange={e=>setModal(p=>({...p,_newVendor:e.target.value}))} placeholder="New vendor name..." style={{flex:1,fontSize:11,padding:"4px 8px"}}
              onKeyDown={e=>{if(e.key==="Enter"&&(modal._newVendor||"").trim()){setVendors(p=>[{id:uid(),name:modal._newVendor.trim(),phone:"",email:"",notes:""},...p]);setModal(p=>({...p,_newVendor:""}));}}}/>
            <button type="button" className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59"}} onClick={()=>{
              if(!(modal._newVendor||"").trim())return;
              setVendors(p=>[{id:uid(),name:modal._newVendor.trim(),phone:"",email:"",notes:""},...p]);
              setModal(p=>({...p,_newVendor:""}));
            }}>+ Add</button>
          </div>
        </div>}
      </div>

      {/* Description */}
      <div className="fld"><label>Description</label>
        <input value={f.description||""} onChange={e=>upd("description",e.target.value)} placeholder="e.g. Replaced water heater, quarterly pest control..."/>
      </div>

      {/* Payment Method */}
      <div className="fld"><label>Payment method</label>
        <select value={f.paymentMethod||""} onChange={e=>upd("paymentMethod",e.target.value)}>
          <option value="">— Select —</option>{PAY_METHODS.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Notes */}
      <div className="fld"><label>Notes</label>
        <input value={f.notes||""} onChange={e=>upd("notes",e.target.value)} placeholder="Optional notes"/>
      </div>

      {/* Receipt upload + AI scan */}
      <div className="fld">
        <label>Receipt</label>
        {f.receiptFile
          ?<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(74,124,89,.04)",border:"1px solid rgba(74,124,89,.15)",borderRadius:8}}>
            <span style={{fontSize:11,color:"#4a7c59",fontWeight:600,flex:1}}>{f.receiptFile.name}</span>
            <button type="button" style={{fontSize:9,color:"#c45c4a",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}} onClick={()=>upd("receiptFile",null)}>Remove</button>
          </div>
          :<div style={{border:"2px dashed rgba(0,0,0,.1)",borderRadius:8,padding:"16px",textAlign:"center",cursor:"pointer",position:"relative"}}
            onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#d4a853";}}
            onDragLeave={e=>{e.currentTarget.style.borderColor="rgba(0,0,0,.1)";}}
            onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor="rgba(0,0,0,.1)";const file=e.dataTransfer.files[0];if(file)upd("receiptFile",file);}}>
            <label style={{cursor:"pointer",display:"block"}}>
              <div style={{fontSize:12,color:"#7a7067",marginBottom:4}}>📎 Click or drag to attach receipt</div>
              <div style={{fontSize:10,color:"#7a7067"}}>Photo, screenshot, or PDF</div>
              <input type="file" accept="image/*,.pdf" capture="environment" style={{display:"none"}} onChange={e=>{const file=e.target.files[0];if(file)upd("receiptFile",file);}}/>
            </label>
          </div>}
        {f.receiptFile&&!modal._scanning&&!modal._scanned&&<button type="button" className="btn btn-out btn-sm" style={{marginTop:6,fontSize:10,color:"#9a7422",borderColor:"rgba(212,168,83,.3)"}} onClick={async()=>{
          setModal(p=>({...p,_scanning:true,_scanErr:null}));
          try{
            const reader=new FileReader();
            const base64=await new Promise((res,rej)=>{reader.onload=()=>res(reader.result.split(",")[1]);reader.onerror=rej;reader.readAsDataURL(f.receiptFile);});
            const mediaType=f.receiptFile.type||"image/jpeg";
            const r=await fetch("/api/receipt-scan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:base64,mediaType})});
            const data=await r.json();
            if(data.ok&&data.fields){
              const flds=data.fields;
              if(flds.date&&!f.date)upd("date",flds.date);
              if(flds.amount&&(!f.amount||f.amount===""))upd("amount",String(flds.amount));
              if(flds.vendor){upd("vendor",flds.vendor);
                if(!vendors.some(v=>v.name.toLowerCase()===flds.vendor.toLowerCase()))setVendors(p=>[{id:uid(),name:flds.vendor,phone:"",email:"",notes:"Auto-added from receipt scan"},...p]);
              }
              if(flds.description&&!f.description)upd("description",flds.description);
              if(flds.category){const match=SCHED_E_CATS.find(c=>c.label.toLowerCase()===flds.category.toLowerCase());if(match)upd("category",match.label);}
              setModal(p=>({...p,_scanning:false,_scanned:true}));
            } else {
              setModal(p=>({...p,_scanning:false,_scanErr:data.error||"Could not read receipt"}));
            }
          }catch(err){setModal(p=>({...p,_scanning:false,_scanErr:"Scan failed: "+err.message}));}
        }}>🔍 Scan receipt with AI — auto-fill fields</button>}
        {modal._scanning&&<div style={{marginTop:6,fontSize:11,color:"#9a7422",display:"flex",alignItems:"center",gap:6}}><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⏳</span> Reading receipt...</div>}
        {modal._scanned&&<div style={{marginTop:6,fontSize:11,color:"#4a7c59",fontWeight:600}}>✓ Fields auto-filled from receipt. Review and adjust if needed.</div>}
        {modal._scanErr&&<div className="err-msg" style={{marginTop:4}}>{modal._scanErr}</div>}
      </div>

      {/* Delete section — only when editing */}
      {isEdit&&!modal._confirmDelete&&<div style={{borderTop:"1px solid rgba(0,0,0,.06)",paddingTop:14,marginTop:14,marginBottom:14}}>
        <button type="button" style={{fontSize:11,color:"#c45c4a",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}} onClick={()=>setModal(p=>({...p,_confirmDelete:true}))}>Delete this expense</button>
      </div>}
      {isEdit&&modal._confirmDelete&&<div style={{borderTop:"1px solid rgba(0,0,0,.06)",paddingTop:14,marginTop:14,marginBottom:14,background:"rgba(196,92,74,.04)",border:"1px solid rgba(196,92,74,.15)",borderRadius:8,padding:14}}>
        <div style={{fontSize:12,fontWeight:700,color:"#c45c4a",marginBottom:6}}>Permanently delete this expense?</div>
        <div style={{fontSize:11,color:"#5c4a3a",marginBottom:12}}>This cannot be undone. The expense will be removed from all reports, overview, and Schedule E calculations.</div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-out btn-sm" onClick={()=>setModal(p=>({...p,_confirmDelete:false}))}>Keep it</button>
          <button className="btn btn-sm" style={{background:"#c45c4a",color:"#fff",border:"none",padding:"6px 16px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setExpenses(p=>p.filter(x=>x.id!==modal.editId));setModal(null);}}>Yes, delete permanently</button>
        </div>
      </div>}

      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-gold" onClick={save}>{isEdit?"Save Changes":"Add Expense"}</button></div>
    </div></div>);
  })()}

  {/* ── Delete Expense ── */}
  {/* ── Confirm Delete Expense (from 3-dot menu) ── */}
  {modal&&modal.type==="confirmDeleteExpense"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>Delete Expense?</h2>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:6}}><strong>{modal.description}</strong> will be permanently deleted.</p>
      <p style={{fontSize:11,color:"#7a7067",marginBottom:16}}>This cannot be undone. The expense will be removed from all reports, overview, and Schedule E calculations.</p>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-sm" style={{background:"#c45c4a",color:"#fff",border:"none",padding:"8px 20px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setExpenses(p=>p.filter(x=>x.id!==modal.expId));setModal(null);}}>Yes, delete permanently</button></div>
    </div></div>
  )}

  {/* ── Export Expenses ── */}
  {modal&&modal.type==="exportExpenses"&&(()=>{
    const exps=modal.expenses||[];
    const attached=modal.attachedCount||0;
    const includeReceipts=modal._includeReceipts||false;
    const exporting=modal._exporting||false;

    const doExport=async()=>{
      setModal(p=>({...p,_exporting:true}));
      // Build CSV
      const headers=["Date","Property","Unit","Room","Category","Subcategory","Vendor","Description","Payment Method","Amount","Notes"];
      if(includeReceipts)headers.push("Receipt URL");
      const rows=exps.map(e=>{
        const row=[e.date,(e.propId==="shared"?"Shared — All Properties":e.propName||""),e.unitName||"",e.roomName||"",e.category||"",e.subcategory||"",e.vendor||"",e.description||"",e.paymentMethod||"",e.amount||0,e.notes||""];
        if(includeReceipts)row.push(e.receiptUrl||"");
        return row;
      });
      const csv=[headers.join(","),...rows.map(r=>r.map(v=>JSON.stringify(String(v))).join(","))].join("\n");
      const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="expenses-"+new Date().toISOString().split("T")[0]+".csv";a.click();

      // Download receipts as individual files if requested
      if(includeReceipts&&attached>0){
        const receiptExps=exps.filter(e=>e.receiptUrl);
        for(const e of receiptExps){
          try{
            const link=document.createElement("a");link.href=e.receiptUrl;link.target="_blank";link.download=(e.date||"")+"_"+(e.vendor||e.category||"receipt").replace(/[^a-zA-Z0-9]/g,"_");link.click();
            await new Promise(r=>setTimeout(r,500));
          }catch(err){console.error("Failed to download receipt:",err);}
        }
      }
      setModal(null);
    };

    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
      <h2 style={{marginBottom:4}}>Export Expenses</h2>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:16}}>{exps.length} expense{exps.length!==1?"s":""} · {fmtS(exps.reduce((s,e)=>s+e.amount,0))} total</p>

      <div style={{background:"#f8f7f4",borderRadius:8,padding:"14px 16px",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"#3c3228",marginBottom:8}}>Export will include:</div>
        <div style={{fontSize:11,color:"#5c4a3a",lineHeight:1.8}}>
          CSV file with date, property, category, subcategory, vendor, description, payment method, amount, and notes.
        </div>
      </div>

      {attached>0&&<div style={{marginBottom:16}}>
        <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"12px 16px",border:"1px solid rgba(0,0,0,.08)",borderRadius:8,background:includeReceipts?"rgba(74,124,89,.04)":"#fff"}}>
          <input type="checkbox" checked={includeReceipts} onChange={e=>setModal(p=>({...p,_includeReceipts:e.target.checked}))} style={{width:16,height:16,accentColor:"#4a7c59"}}/>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#3c3228"}}>Include receipt attachments</div>
            <div style={{fontSize:10,color:"#6b5e52",marginTop:2}}>{attached} receipt{attached!==1?"s":""} will be downloaded alongside the CSV. Receipt URLs will be added as a column.</div>
          </div>
        </label>
      </div>}

      {attached===0&&<div style={{fontSize:11,color:"#7a7067",marginBottom:16,padding:"8px 12px",background:"#f8f7f4",borderRadius:6}}>No receipts attached to these expenses.</div>}

      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-gold" onClick={doExport} disabled={exporting}>
          {exporting?"Exporting...":"Export CSV"+(includeReceipts?" + Receipts":"")}
        </button>
      </div>
    </div></div>);
  })()}

  {/* ── Add / Edit Improvement ── */}
  {modal&&modal.type==="addImprovement"&&(()=>{
    const isEdit=!!modal.editId;
    const f=modal.form||{};const errs=modal.errs||{};
    const upd=(k,v)=>setModal(p=>({...p,form:{...p.form,[k]:v},errs:{...(p.errs||{}),[k]:null}}));
    const save=()=>{
      const e={};
      if(!f.date)e.date="Required";
      if(!f.propId)e.propId="Required";
      if(!f.improvementType)e.improvementType="Required";
      if(!f.description?.trim())e.description="Required";
      if(!f.amount||Number(f.amount)<=0)e.amount="Must be > 0";
      if(Object.keys(e).length){setModal(p=>({...p,errs:e}));shakeModal();return;}
      const rec={...f,amount:Number(f.amount),propName:(props.find(p=>p.id===f.propId)||{}).name||""};
      if(isEdit){setImprovements(p=>p.map(x=>x.id===modal.editId?{...x,...rec}:x));}
      else{setImprovements(p=>[{id:uid(),createdAt:TODAY.toISOString(),...rec},...p]);}
      setModal(null);
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:500}}>
      <h2 style={{marginBottom:4}}>{isEdit?"Edit Improvement":"Add Capital Improvement"}</h2>
      <div style={{fontSize:11,color:"#3b82f6",marginBottom:14,padding:"8px 10px",background:"rgba(59,130,246,.06)",borderRadius:6}}>This goes to your cost basis — NOT deducted this year. Give to your CPA for depreciation schedule.</div>
      <div className="fr3">
        <div className="fld"><label style={{color:errs.date?"#c45c4a":undefined}}>Date *</label><input type="date" value={f.date||""} onChange={e=>upd("date",e.target.value)} style={{borderColor:errs.date?"#c45c4a":undefined}}/>{errs.date&&<div className="err-msg">{errs.date}</div>}</div>
        <div className="fld"><label style={{color:errs.propId?"#c45c4a":undefined}}>Property *</label>
          <select value={f.propId||""} onChange={e=>upd("propId",e.target.value)} style={{borderColor:errs.propId?"#c45c4a":undefined}}>
            <option value="">— Select —</option>{props.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>{errs.propId&&<div className="err-msg">{errs.propId}</div>}</div>
        <div className="fld"><label style={{color:errs.amount?"#c45c4a":undefined}}>Amount ($) *</label><input type="number" min="0" step="0.01" value={f.amount||""} onChange={e=>upd("amount",e.target.value)} style={{borderColor:errs.amount?"#c45c4a":undefined}}/>{errs.amount&&<div className="err-msg">{errs.amount}</div>}</div>
      </div>
      <div className="fr3">
        <div className="fld"><label style={{color:errs.improvementType?"#c45c4a":undefined}}>Type *</label>
          <select value={f.improvementType||""} onChange={e=>upd("improvementType",e.target.value)} style={{borderColor:errs.improvementType?"#c45c4a":undefined}}>
            <option value="">— Select type —</option>{IMPROVEMENT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>{errs.improvementType&&<div className="err-msg">{errs.improvementType}</div>}</div>
        <div className="fld" style={{gridColumn:"span 2"}}><label>Contractor / Vendor</label><input value={f.contractor||""} onChange={e=>upd("contractor",e.target.value)} placeholder="e.g. Huntsville HVAC, ABC Roofing..."/></div>
      </div>
      <div className="fld"><label>Description *</label><input value={f.description||""} onChange={e=>upd("description",e.target.value)} placeholder="e.g. Full HVAC replacement — unit A, new 30yr architectural shingle roof..." style={{borderColor:errs.description?"#c45c4a":undefined}}/>{errs.description&&<div className="err-msg">{errs.description}</div>}</div>
      {/* Subcategory combobox */}
      {(()=>{
        const allSubcatList=Object.values(subcats||{}).flat();
        const subcatInput=f.subcategory||"";
        const subcatMatches=subcatInput.trim()?allSubcatList.filter(s=>s.label.toLowerCase().includes(subcatInput.toLowerCase())):allSubcatList;
        const exactSubcat=allSubcatList.some(s=>s.label.toLowerCase()===subcatInput.toLowerCase().trim());
        return(
        <div className="fld" style={{position:"relative"}}>
          <label>Subcategory <span style={{fontSize:9,fontWeight:400,color:"#6b5e52",textTransform:"none",letterSpacing:0}}>— internal tracking only</span></label>
          <input value={subcatInput} onChange={e=>upd("subcategory",e.target.value)} placeholder="e.g. HVAC, Roofing, Electrical..." autoComplete="off"/>
          {subcatInput.trim()&&subcatMatches.length>0&&!exactSubcat&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid rgba(0,0,0,.1)",borderRadius:"0 0 8px 8px",boxShadow:"0 4px 12px rgba(0,0,0,.1)",zIndex:100,maxHeight:140,overflowY:"auto"}}>
            {subcatMatches.map(s=><div key={s.id} style={{padding:"7px 12px",cursor:"pointer",fontSize:11,borderBottom:"1px solid rgba(0,0,0,.04)"}}
              onMouseDown={e=>{e.preventDefault();upd("subcategory",s.label);}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(212,168,83,.06)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {s.label}
            </div>)}
          </div>}
          {subcatInput.trim()&&!exactSubcat&&<div style={{marginTop:4}}>
            <button type="button" className="btn btn-out btn-sm" style={{fontSize:9,color:"#4a7c59",borderColor:"rgba(74,124,89,.2)"}}
              onClick={()=>{const cat="Other";setSubcats(p=>({...p,[cat]:[...(p[cat]||[]),{id:uid(),label:subcatInput.trim()}]}));upd("subcategory",subcatInput.trim());}}>
              Save "{subcatInput.trim()}" as subcategory
            </button>
          </div>}
        </div>);
      })()}
      <div className="fld"><label>Notes</label><input value={f.notes||""} onChange={e=>upd("notes",e.target.value)} placeholder="Warranty info, permit numbers, etc."/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-gold" onClick={save}>{isEdit?"Save Changes":"Add Improvement"}</button></div>
    </div></div>);
  })()}

  {/* ── Delete Improvement ── */}
  {modal&&modal.type==="deleteImprovement"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:380}}>
      <h2>Delete Improvement?</h2>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:16}}><strong>{modal.description}</strong> will be permanently deleted from your improvement log.</p>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-red" onClick={()=>{setImprovements(p=>p.filter(im=>im.id!==modal.imId));setModal(null);}}>Delete</button></div>
    </div></div>
  )}

  {/* ── Add / Edit Vendor ── */}
  {modal&&modal.type==="addVendor"&&(()=>{
    const isEdit=!!modal.editId;
    const f=modal.form||{};const errs=modal.errs||{};
    const upd=(k,v)=>setModal(p=>({...p,form:{...p.form,[k]:v},errs:{...(p.errs||{}),[k]:null}}));
    const save=()=>{
      if(!(f.name||"").trim()){setModal(p=>({...p,errs:{name:"Required"}}));shakeModal();return;}
      if(isEdit){setVendors(p=>p.map(x=>x.id===modal.editId?{...x,...f}:x));}
      else{setVendors(p=>[{id:uid(),...f},...p]);}
      setModal(null);
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
      <h2>{isEdit?"Edit Vendor":"Add Vendor"}</h2>
      <div className="fld"><label style={{color:errs.name?"#c45c4a":undefined}}>Vendor / Payee Name *</label><input value={f.name||""} onChange={e=>upd("name",e.target.value)} placeholder="e.g. Home Depot, State Farm, Huntsville Pest Control" autoFocus style={{borderColor:errs.name?"#c45c4a":undefined}}/>{errs.name&&<div className="err-msg">{errs.name}</div>}</div>
      <div className="fr3">
        <div className="fld"><label>Phone</label><input value={f.phone||""} onChange={e=>upd("phone",e.target.value)} placeholder="(256) 555-0100"/></div>
        <div className="fld" style={{gridColumn:"span 2"}}><label>Email</label><input value={f.email||""} onChange={e=>upd("email",e.target.value)} placeholder="vendor@example.com"/></div>
      </div>
      <div className="fld"><label>Notes</label><input value={f.notes||""} onChange={e=>upd("notes",e.target.value)} placeholder="e.g. 24hr emergency line, licensed and insured, preferred HVAC vendor"/></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-gold" onClick={save}>{isEdit?"Save Changes":"Add Vendor"}</button></div>
    </div></div>);
  })()}

  {/* ── Delete Vendor ── */}
  {modal&&modal.type==="deleteVendor"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:380}}>
      <h2>Remove Vendor?</h2>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:16}}>Remove <strong>{modal.name}</strong> from your vendor list? Existing expenses using this vendor are not affected.</p>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-red" onClick={()=>{setVendors(p=>p.filter(v=>v.id!==modal.vendorId));setModal(null);}}>Remove</button></div>
    </div></div>
  )}

  {/* ── Add / Edit Mortgage ── */}
  {modal&&modal.type==="addMortgage"&&(()=>{
    const isEdit=!!modal.editId;
    const f=modal.form||{};const errs=modal.errs||{};
    const upd=(k,v)=>setModal(p=>({...p,form:{...p.form,[k]:v},errs:{...(p.errs||{}),[k]:null}}));
    const save=()=>{
      const e={};
      if(!f.propId)e.propId="Required";
      if(!f.lender?.trim())e.lender="Required";
      if(!f.currentBalance||Number(f.currentBalance)<=0)e.currentBalance="Required";
      if(!f.monthlyPI||Number(f.monthlyPI)<=0)e.monthlyPI="Required";
      if(Object.keys(e).length){setModal(p=>({...p,errs:e}));shakeModal();return;}
      const rec={...f,originalBalance:Number(f.originalBalance||0),currentBalance:Number(f.currentBalance),interestRate:Number(f.interestRate||0),monthlyPI:Number(f.monthlyPI),propName:(props.find(p=>p.id===f.propId)||{}).name||""};
      if(isEdit){setMortgages(p=>p.map(x=>x.id===modal.editId?{...x,...rec}:x));}
      else{setMortgages(p=>[{id:uid(),...rec},...p]);}
      setModal(null);
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
      <h2>{isEdit?"✏️ Edit Mortgage":"🏦 Add Mortgage"}</h2>
      <div className="fr3">
        <div className="fld" style={{gridColumn:"span 2"}}><label style={{color:errs.propId?"#c45c4a":undefined}}>Property *</label>
          <select value={f.propId||""} onChange={e=>upd("propId",e.target.value)} style={{borderColor:errs.propId?"#c45c4a":undefined}}>
            <option value="">— Select —</option>{props.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>{errs.propId&&<div className="err-msg">{errs.propId}</div>}</div>
        <div className="fld"><label style={{color:errs.lender?"#c45c4a":undefined}}>Lender *</label><input value={f.lender||""} onChange={e=>upd("lender",e.target.value)} placeholder="e.g. Redstone FCU" style={{borderColor:errs.lender?"#c45c4a":undefined}}/>{errs.lender&&<div className="err-msg">{errs.lender}</div>}</div>
      </div>
      <div className="fr3">
        <div className="fld"><label>Original Loan Amount</label><input type="number" value={f.originalBalance||""} onChange={e=>upd("originalBalance",e.target.value)} placeholder="0"/></div>
        <div className="fld"><label style={{color:errs.currentBalance?"#c45c4a":undefined}}>Current Balance *</label><input type="number" value={f.currentBalance||""} onChange={e=>upd("currentBalance",e.target.value)} style={{borderColor:errs.currentBalance?"#c45c4a":undefined}}/>{errs.currentBalance&&<div className="err-msg">{errs.currentBalance}</div>}</div>
        <div className="fld"><label>Interest Rate (%)</label><input type="number" step="0.01" value={f.interestRate||""} onChange={e=>upd("interestRate",e.target.value)} placeholder="6.75"/></div>
      </div>
      <div className="fr3">
        <div className="fld"><label style={{color:errs.monthlyPI?"#c45c4a":undefined}}>Monthly P&I *</label><input type="number" value={f.monthlyPI||""} onChange={e=>upd("monthlyPI",e.target.value)} style={{borderColor:errs.monthlyPI?"#c45c4a":undefined}}/>{errs.monthlyPI&&<div className="err-msg">{errs.monthlyPI}</div>}</div>
        <div className="fld"><label>Loan Start Date</label><input type="date" value={f.startDate||""} onChange={e=>upd("startDate",e.target.value)}/></div>
        <div className="fld"><label>Maturity Date</label><input type="date" value={f.maturityDate||""} onChange={e=>upd("maturityDate",e.target.value)}/></div>
      </div>
      <div className="fr3">
        <div className="fld"><label>Account Last 4</label><input maxLength={4} value={f.accountLast4||""} onChange={e=>upd("accountLast4",e.target.value)} placeholder="1234"/></div>
        <div className="fld" style={{gridColumn:"span 2"}}><label>Notes</label><input value={f.notes||""} onChange={e=>upd("notes",e.target.value)} placeholder="e.g. 30-yr fixed, escrowed taxes and insurance"/></div>
      </div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-gold" onClick={save}>{isEdit?"Save Changes":"Add Mortgage"}</button></div>
    </div></div>);
  })()}

  {/* ── Delete Mortgage ── */}
  {modal&&modal.type==="deleteMortgage"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:380}}>
      <h2>🗑 Remove Mortgage?</h2>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:16}}>Remove <strong>{modal.lender}</strong> from the register? This affects DSCR calculations.</p>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-red" onClick={()=>{setMortgages(p=>p.filter(m=>m.id!==modal.mgId));setModal(null);}}>Remove</button></div>
    </div></div>
  )}

  {modal&&modal.type==="deleteCharge"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>🗑 Delete Charge?</h2>
      <div style={{background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.12)",borderRadius:8,padding:12,marginBottom:14,fontSize:12}}>
        <div style={{fontWeight:700,marginBottom:2}}>{modal.tenantName}</div>
        <div style={{color:"#6b5e52"}}>{modal.category} — {modal.desc}</div>
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
      <h2>Stop Late Fees</h2>
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

  {/* Edit Charge */}
  {modal&&modal.type==="editCharge"&&(()=>{
    const c=modal.charge;const isPaid=modal.isPaid;const shake=modal.shake||false;const errs=modal.errs||{};
    const upd=(k,v)=>setModal(p=>({...p,charge:{...p.charge,[k]:v},errs:{...(p.errs||{}),[k]:null}}));
    const save=()=>{
      const e={};
      if(!c.amount||Number(c.amount)<=0)e.amount="Required";
      if(!c.dueDate)e.dueDate="Required";
      if(!c.desc?.trim())e.desc="Required";
      if(isPaid&&!(modal.editReason||"").trim())e.editReason="Reason required for editing a paid charge";
      if(Object.keys(e).length){setModal(p=>({...p,errs:e,shake:true}));setTimeout(()=>setModal(p=>({...p,shake:false})),500);return;}
      const auditNote=isPaid?{editedAt:TODAY.toISOString().split("T")[0],editedReason:modal.editReason,editNote:modal.editNote||"",origAmount:modal.charge.amount}:null;
      setCharges(p=>p.map(x=>x.id===c.id?{...x,amount:Number(c.amount),dueDate:c.dueDate,desc:c.desc,category:c.category,editAudit:auditNote||x.editAudit}:x));
      setModal(null);
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:460,animation:shake?"shake .4s ease":undefined}}>
      <h2 style={{marginBottom:4}}>✏️ Edit Charge</h2>
      <div style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>{c.tenantName} · {c.propName}</div>
      {isPaid&&<div style={{background:"rgba(212,168,83,.08)",border:"1px solid rgba(212,168,83,.2)",borderRadius:8,padding:"10px 12px",marginBottom:14,fontSize:11,color:"#9a7422",fontWeight:600}}>⚠ This charge has been paid. A reason and audit note are required.</div>}
      <div className="fr3">
        <div className="fld"><label style={{color:errs.amount?"#c45c4a":undefined}}>Amount ($){errs.amount&&<span style={{fontWeight:400,fontSize:9,marginLeft:6,color:"#c45c4a"}}>{errs.amount}</span>}</label><input type="number" value={c.amount||""} onChange={e=>upd("amount",e.target.value)} style={{borderColor:errs.amount?"#c45c4a":undefined}}/></div>
        <div className="fld"><label style={{color:errs.dueDate?"#c45c4a":undefined}}>Due Date</label><input type="date" value={c.dueDate||""} onChange={e=>upd("dueDate",e.target.value)}/></div>
        <div className="fld"><label>Category</label><select value={c.category||""} onChange={e=>upd("category",e.target.value)}>{CHARGE_CATS.map(x=><option key={x}>{x}</option>)}</select></div>
      </div>
      <div className="fld"><label style={{color:errs.desc?"#c45c4a":undefined}}>Description</label><input value={c.desc||""} onChange={e=>upd("desc",e.target.value)} style={{borderColor:errs.desc?"#c45c4a":undefined}}/></div>
      {isPaid&&<>
        <div className="fld"><label style={{color:errs.editReason?"#c45c4a":undefined}}>Reason for Edit * {errs.editReason&&<span style={{fontWeight:400,fontSize:9,color:"#c45c4a"}}>{errs.editReason}</span>}</label><input value={modal.editReason||""} onChange={e=>setModal(p=>({...p,editReason:e.target.value,errs:{...(p.errs||{}),editReason:null}}))} placeholder="e.g. Billing error, wrong amount entered..." style={{borderColor:errs.editReason?"#c45c4a":undefined}}/></div>
        <div className="fld"><label>Additional Notes (optional)</label><input value={modal.editNote||""} onChange={e=>setModal(p=>({...p,editNote:e.target.value}))} placeholder="Any additional context..."/></div>
      </>}
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-gold" onClick={save}>Save Changes</button></div>
    </div></div>);
  })()}

  {/* Void Charge */}
  {modal&&modal.type==="voidCharge"&&(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420,animation:modal.shake?"shake .4s ease":undefined}}>
      <h2>Void Charge</h2>
      <div style={{background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.12)",borderRadius:8,padding:12,marginBottom:14,fontSize:12}}>
        <div style={{fontWeight:700}}>{modal.tenantName}</div>
        <div style={{color:"#6b5e52",marginTop:2}}>{modal.category} — {modal.desc} · {fmtS(modal.amount)}</div>
      </div>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:12,lineHeight:1.6}}>Voiding sets this charge to $0 and leaves an audit trail. Any recorded payments will be reversed. This cannot be undone.</p>
      <div className={`fld ${modal.voidReasonErr?"field-err":""}`}>
        <label className={modal.voidReasonErr?"field-err-label":""}>Reason * (required)</label>
        <textarea value={modal.voidReason||""} onChange={e=>setModal(p=>({...p,voidReason:e.target.value,voidReasonErr:false}))} placeholder="e.g. Charge created in error, tenant moved out before billing period..." rows={2} autoFocus/>
        {modal.voidReasonErr&&<div className="err-msg">Reason is required</div>}
      </div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
        <button className="btn btn-red" onClick={()=>{
          if(!(modal.voidReason||"").trim()){setModal(p=>({...p,voidReasonErr:true}));shakeModal();return;}
          setCharges(p=>p.map(c=>c.id===modal.chargeId?{...c,voided:true,voidedDate:TODAY.toISOString().split("T")[0],voidedReason:modal.voidReason,amountPaid:0,payments:[]}:c));
          setExpCharge(null);setModal(null);
        }}>Confirm Void</button>
      </div>
    </div></div>
  )}

  {/* Clear Tenant Ledger */}
  {modal&&modal.type==="clearLedger"&&(()=>{
    const tenantCharges=charges.filter(c=>c.tenantName===modal.tenant);
    const outstanding=tenantCharges.filter(c=>!c.voided&&!c.waived&&c.amountPaid<c.amount);
    const paid=tenantCharges.filter(c=>c.amountPaid>=c.amount&&!c.voided&&!c.waived);
    const alreadyVoided=tenantCharges.filter(c=>c.voided||c.waived);
    const confirmMatch=(modal.confirm||"").toUpperCase()==="DELETE";
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
      <h2>🗑 Clear Ledger — {modal.tenant}</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"14px 0"}}>
        <div style={{background:"rgba(196,92,74,.06)",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#c45c4a"}}>{outstanding.length}</div><div style={{fontSize:9,color:"#6b5e52",marginTop:2}}>Outstanding</div></div>
        <div style={{background:"rgba(74,124,89,.06)",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#4a7c59"}}>{paid.length}</div><div style={{fontSize:9,color:"#6b5e52",marginTop:2}}>Paid</div></div>
        <div style={{background:"rgba(0,0,0,.03)",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#6b5e52"}}>{alreadyVoided.length}</div><div style={{fontSize:9,color:"#6b5e52",marginTop:2}}>Voided/Waived</div></div>
      </div>

      <div style={{border:"1px solid rgba(212,168,83,.2)",borderRadius:10,padding:14,marginBottom:12,background:"rgba(212,168,83,.02)"}}>
        <div style={{fontSize:11,fontWeight:800,color:"#9a7422",marginBottom:6}}>OPTION A — Void All Outstanding</div>
        <div style={{fontSize:11,color:"#5c4a3a",marginBottom:10,lineHeight:1.5}}>Voids {outstanding.length} outstanding charge{outstanding.length!==1?"s":""}, leaving paid charges intact. Requires a reason. Leaves full audit trail.</div>
        <div className="fld" style={{marginBottom:8}}>
          <label>Reason for voiding outstanding charges *</label>
          <input value={modal.voidReason||""} onChange={e=>setModal(p=>({...p,voidReason:e.target.value}))} placeholder="e.g. Tenant never moved in, billing error..." />
        </div>
        <button className="btn btn-gold btn-sm" onClick={()=>{
          if(!(modal.voidReason||"").trim()){setModal(p=>({...p,voidReasonErr:true}));return;}
          setCharges(p=>p.map(c=>c.tenantName===modal.tenant&&!c.voided&&!c.waived&&c.amountPaid<c.amount?{...c,voided:true,voidedDate:TODAY.toISOString().split("T")[0],voidedReason:modal.voidReason,amountPaid:0,payments:[]}:c));
          setModal(null);
        }}>Void {outstanding.length} Outstanding Charge{outstanding.length!==1?"s":""}</button>
        {modal.voidReasonErr&&!(modal.voidReason||"").trim()&&<div style={{fontSize:10,color:"#c45c4a",marginTop:4}}>Reason is required</div>}
      </div>

      <div style={{border:"1px solid rgba(196,92,74,.2)",borderRadius:10,padding:14,background:"rgba(196,92,74,.02)"}}>
        <div style={{fontSize:11,fontWeight:800,color:"#c45c4a",marginBottom:6}}>OPTION B — Hard Delete All ({tenantCharges.length} charges)</div>
        <div style={{fontSize:11,color:"#5c4a3a",marginBottom:10,lineHeight:1.5}}>Permanently deletes ALL charges including paid ones. No audit trail. Use only if tenant never existed or data was entered in error.</div>
        <div className="fld" style={{marginBottom:8}}>
          <label>Type DELETE to confirm</label>
          <input value={modal.confirm||""} onChange={e=>setModal(p=>({...p,confirm:e.target.value}))} placeholder="DELETE" style={{borderColor:modal.confirm&&!confirmMatch?"#c45c4a":undefined}}/>
        </div>
        <button className="btn btn-red btn-sm" disabled={!confirmMatch} style={{opacity:confirmMatch?1:0.4}} onClick={()=>{
          setCharges(p=>p.filter(c=>c.tenantName!==modal.tenant));
          setModal(null);
        }}>Hard Delete All Charges for {modal.tenant}</button>
      </div>

      <div className="mft" style={{marginTop:14}}><button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button></div>
    </div></div>);
  })()}
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
            <div style={{fontSize:10,color:"#6b5e52"}}>Due {fmtD(c.dueDate)} - {fmtS(c.amount-c.amountPaid)} remaining</div>
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
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}><span style={{color:"#6b5e52"}}>{l}</span><strong>{v}</strong></div>
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
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><label style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase"}}>Deductions</label><button className="btn btn-out btn-sm" onClick={()=>setModal(prev=>({...prev,deductions:[...deductions,{desc:"",amount:0}]}))}>+ Add</button></div>
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
      const newLead={id:uid(),name:modal.name.trim(),phone:modal.phone||"",email:modal.email||"",property:modal.property||"",room:"",moveIn:"",income:"",status:"new-lead",submitted:TODAY.toISOString().split("T")[0],bgCheck:"not-started",creditScore:"—",refs:"not-started",source:modal.source||"Phone / Direct Call",lastContact:TODAY.toISOString().split("T")[0],notes:modal.notes||"Added manually — direct call",history:[{from:"new",to:"called",date:TODAY.toISOString().split("T")[0],note:"Added manually by admin"}]};
      setApps(p=>[newLead,...p]);
      setNotifs(p=>[{id:uid(),type:"app",msg:`New lead added: ${modal.name.trim()} (${modal.source||"Direct Call"})`,date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
      setModal({type:"addLeadDone",lead:newLead});
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
      <h2>📞 Add Lead Manually</h2>
      <p style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>Add someone who contacted you directly. They'll be placed in the <strong>Called / Follow Up</strong> stage and you can invite them to apply from there.</p>
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

  {/* ── Email Portal Link Modal ── */}
  {modal&&modal.type==="emailPortalLink"&&(()=>{
    const errs=modal.errs||{};
    const sending=modal.sending||false;
    const sent=modal.sent||false;
    const link=`${settings.siteUrl||"https://rentblackbear.com"}/portal?token=${modal.token}`;
    const send=async()=>{
      const e={};
      const email=(modal.to||"").trim();
      if(!email)e.to="Email address is required";
      else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))e.to="Enter a valid email address";
      if(Object.keys(e).length){setModal(p=>({...p,errs:e}));shakeModal();return;}
      setModal(p=>({...p,sending:true}));
      try{
        const res=await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            to:email,
            subject:`Your tenant portal is ready — ${settings.companyName||"Black Bear Rentals"}`,
            html:`<p>Hi ${firstName},</p><p>Your tenant portal is ready. Sign in to view your lease, pay your deposit, and access everything in one place.</p><p><a href="${link}" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px;">Access Your Portal →</a></p><p style="font-size:12px;color:#999;">This link expires in 48 hours. Sign in with Google or create an account using this email address.</p><p>${settings.companyName||"Black Bear Rentals"}<br/>${settings.phone||""}</p>`,
          })
        });
        const d=await res.json();
        if(d.ok){setModal(p=>({...p,sending:false,sent:true}));}
        else{setModal(p=>({...p,sending:false,errs:{to:d.error||"Failed to send — try again"}}));shakeModal();}
      }catch(err){setModal(p=>({...p,sending:false,errs:{to:"Network error — try again"}}));shakeModal();}
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
      {sent?(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(74,124,89,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style={{fontSize:16,fontWeight:800,color:"#1a1714",marginBottom:6}}>Invite sent!</div>
          <div style={{fontSize:12,color:"#5c4a3a",marginBottom:20}}>Portal invite emailed to <strong>{modal.to}</strong>. Link expires in 48 hours.</div>
          <button className="btn btn-out" onClick={()=>setModal(null)}>Done</button>
        </div>
      ):(
        <>
          <h2 style={{marginBottom:4}}>Send Portal Invite</h2>
          <p style={{fontSize:11,color:"#5c4a3a",marginBottom:14}}>Send the tenant a link to access their portal. They sign in with Google or create an account.</p>
          <div style={{padding:"8px 12px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.15)",borderRadius:7,marginBottom:14,fontSize:11,fontFamily:"monospace",color:"#2d6a3f",wordBreak:"break-all"}}>{link}</div>
          <div className={`fld ${errs.to?"field-err":""}`}>
            <label className={errs.to?"field-err-label":""}>Recipient Email *</label>
            <input type="email" value={modal.to||""} onChange={e=>setModal(p=>({...p,to:e.target.value,errs:{}}))} placeholder="tenant@email.com" autoFocus/>
            {errs.to&&<div className="err-msg">{errs.to}</div>}
          </div>
          <div className="fld">
            <label>Name <span style={{fontWeight:400,color:"#6b5e52"}}>(optional — personalizes the email)</span></label>
            <input value={modal.name||""} onChange={e=>setModal(p=>({...p,name:e.target.value}))} placeholder="Jane Smith"/>
          </div>
          <div className="mft">
            <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-green" disabled={sending} onClick={send}>{sending?"Sending...":"Send Invite"}</button>
          </div>
        </>
      )}
    </div></div>);
  })()}

  {/* ── Send Portal Invite from App Card ── */}
  {modal&&modal.type==="sendPortalInviteApp"&&(()=>{
    const a=modal.data;
    const send=async()=>{
      setPiState("sending");
      try{
        const endpoint=a.email?"/api/portal-invite":"/api/portal-invite-token";
        const body=a.email
          ?{tenantName:a.name,tenantEmail:a.email,propertyName:a.property,roomName:a.room,rent:a.negotiatedRent||a.rent,moveIn:a.termMoveIn||a.moveIn}
          :{};
        const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
        const d=await res.json();
        if(d.ok||d.token)setPiState("sent"); else setPiState("error");
      }catch(e){console.error(e);setPiState("error");}
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
      <h2 style={{marginBottom:6}}>Send Portal Invite</h2>
      <p style={{fontSize:11,color:"#6b5e52",marginBottom:16}}>Send <strong>{a.name}</strong> a link to create their tenant portal account. They can sign in with Google or email — no application required.</p>
      <div style={{padding:"12px 14px",background:"rgba(0,0,0,.03)",borderRadius:8,marginBottom:16,fontSize:12}}>
        <div className="tp-row"><span className="tp-label" style={{fontSize:10}}>Name</span><strong>{a.name}</strong></div>
        <div className="tp-row"><span className="tp-label" style={{fontSize:10}}>Email</span><strong>{a.email}</strong></div>
        {a.property&&<div className="tp-row"><span className="tp-label" style={{fontSize:10}}>Property</span><strong>{a.property}{a.room?" — "+a.room:""}</strong></div>}
      </div>
      {piState==="sent"&&<div style={{padding:"10px 14px",background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,fontSize:12,color:"#4a7c59",marginBottom:16}}>Portal invite sent to <strong>{a.email}</strong>. Link expires in 48 hours.</div>}
      {piState==="error"&&<div style={{padding:"10px 14px",background:"rgba(196,92,74,.08)",border:"1px solid rgba(196,92,74,.2)",borderRadius:8,fontSize:12,color:"#c45c4a",marginBottom:16}}>Failed to send. Check console and try again.</div>}
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>{piState==="sent"?"Close":"Cancel"}</button>
        {piState!=="sent"&&<button className="btn btn-green" style={{fontWeight:800}} onClick={send} disabled={piState==="sending"}>{piState==="sending"?"Sending...":"Send Portal Invite"}</button>}
      </div>
    </div></div>);
  })()}

  {/* ── Email Apply Link Modal ── */}
  {modal&&modal.type==="emailApplyLink"&&(()=>{
    const errs=modal.errs||{};
    const sending=modal.sending||false;
    const sent=modal.sent||false;
    const link=`${settings.siteUrl||"https://rentblackbear.com"}/apply`;
    const send=async()=>{
      const e={};
      const email=(modal.to||"").trim();
      if(!email)e.to="Email address is required";
      else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))e.to="Enter a valid email address";
      if(Object.keys(e).length){setModal(p=>({...p,errs:e}));shakeModal();return;}
      setModal(p=>({...p,sending:true}));
      try{
        const firstName=(modal.name||"").split(" ")[0]||"there";
        const res=await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            to:email,
            subject:`Apply for a room at ${settings.companyName||"Black Bear Rentals"}`,
            html:`<p>Hi ${firstName},</p><p>We have a room available at ${settings.companyName||"Black Bear Rentals"} in Huntsville, AL. Apply here:</p><p><a href="${link}" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px;">Apply Now →</a></p><p style="font-size:12px;color:#999;">Takes about 10–15 minutes.</p><p>${settings.companyName||"Black Bear Rentals"}<br/>${settings.phone||""}</p>`,
          })
        });
        const d=await res.json();
        if(d.ok){setModal(p=>({...p,sending:false,sent:true}));}
        else{setModal(p=>({...p,sending:false,errs:{to:d.error||"Failed to send — try again"}}));shakeModal();}
      }catch(err){setModal(p=>({...p,sending:false,errs:{to:"Network error — try again"}}));shakeModal();}
    };
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
      {sent?(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(74,124,89,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style={{fontSize:16,fontWeight:800,color:"#1a1714",marginBottom:6}}>Email sent!</div>
          <div style={{fontSize:12,color:"#5c4a3a",marginBottom:20}}>Application link emailed to <strong>{modal.to}</strong>.</div>
          <button className="btn btn-out" onClick={()=>setModal(null)}>Done</button>
        </div>
      ):(
        <>
          <h2 style={{marginBottom:4}}>Email Apply Link</h2>
          <p style={{fontSize:11,color:"#5c4a3a",marginBottom:14}}>Send the application link directly from the website.</p>
          <div style={{padding:"8px 12px",background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.07)",borderRadius:7,marginBottom:14,fontSize:11,fontFamily:"monospace",color:"#5c4a3a",wordBreak:"break-all"}}>{link}</div>
          <div className={`fld ${errs.to?"field-err":""}`}>
            <label className={errs.to?"field-err-label":""}>Recipient Email *</label>
            <input type="email" value={modal.to||""} onChange={e=>setModal(p=>({...p,to:e.target.value,errs:{}}))} placeholder="jane@email.com" autoFocus/>
            {errs.to&&<div className="err-msg">{errs.to}</div>}
          </div>
          <div className="fld">
            <label>Name <span style={{fontWeight:400,color:"#6b5e52"}}>(optional — personalizes the email)</span></label>
            <input value={modal.name||""} onChange={e=>setModal(p=>({...p,name:e.target.value}))} placeholder="Jane Smith"/>
          </div>
          <div className="mft">
            <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-green" disabled={sending} onClick={send}>{sending?"Sending...":"Send Email"}</button>
          </div>
        </>
      )}
    </div></div>);
  })()}

  {/* ── Add Lead Done — offer to invite immediately ── */}
  {modal&&modal.type==="addLeadDone"&&(()=>{const lead=modal.lead;return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420,textAlign:"center",padding:28}}>
      <div style={{fontSize:36,marginBottom:8}}>✅</div>
      <h2 style={{color:"#4a7c59",marginBottom:6}}>{lead.name} Added!</h2>
      <p style={{fontSize:12,color:"#6b5e52",marginBottom:20}}>They're now in the <strong>Called / Follow Up</strong> stage. Want to invite them to apply right now?</p>
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
        <div style={{fontSize:11,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Document Details</div>
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
      <div style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>Select a charge to pay. Both ACH bank transfer and credit/debit card accepted.</div>
      {upcoming.map(c=>{
        const rem=c.amount-c.amountPaid;
        return(
        <div key={c.id} style={{border:"1px solid rgba(0,0,0,.06)",borderRadius:10,padding:14,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div style={{fontSize:13,fontWeight:700}}>{c.category}</div>
              <div style={{fontSize:11,color:"#6b5e52"}}>{c.desc} · Due {fmtD(c.dueDate)}</div>
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
        return{...a,status:"new-lead",lastContact:TODAY.toISOString().split("T")[0],screenPkg:pkg,incomeAdd:inc,appFee:fee,waiverReason:perPerson[a.id]?.waiverReason||"",inviteLink:link,history:[...(a.history||[]),{from:a.status,to:"invited",date:TODAY.toISOString().split("T")[0],note:`Bulk invited · ${pkgLabel[pkg]} · ${fee===0?"Fee waived":"$"+fee}${perPerson[a.id]?.waiverReason?" — "+perPerson[a.id].waiverReason:""}`}]};
      }));
      setBulkSel([]);setModal(prev=>({...prev,bulkSent:true}));
    };

    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:580}}>
      {modal.bulkSent?<div style={{textAlign:"center",padding:20}}>
        <div style={{fontSize:36,marginBottom:8}}>✓</div>
        <h2 style={{color:"#4a7c59"}}>Invites Sent!</h2>
        <p style={{fontSize:12,color:"#6b5e52",marginTop:4}}>{targets.length} applicants moved to Invited.</p>
        <button className="btn btn-gold" style={{marginTop:16,width:"100%"}} onClick={()=>setModal(null)}>Done</button>
      </div>:<>
        <h2>Bulk Invite — {targets.length} Applicant{targets.length>1?"s":""}</h2>
        <p style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>Set the screening package for each person individually. The admin fee (${adminFee}) is included in each total.</p>

        {targets.map(a=>(
          <div key={a.id} style={{border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:12,marginBottom:10,background:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div>
                <div style={{fontSize:13,fontWeight:700}}>{a.name}</div>
                <div style={{fontSize:10,color:"#6b5e52"}}>{a.email} · {a.source||""}</div>
              </div>
              <div style={{fontSize:14,fontWeight:800,color:getFee(a.id)===0?"#4a7c59":"#d4a853"}}>{getFee(a.id)===0?"Free":"$"+getFee(a.id)}</div>
            </div>
            {/* Pkg selector — compact row */}
            <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap"}}>
              {[["credit-bg","Credit + Full BG","$49"],["credit-only","Credit Only","$29"],["none","Waived","$0"]].map(([v,l,p])=>(
                <button key={v} onClick={()=>setPersonPkg(a.id,v)} style={{fontSize:10,padding:"4px 9px",borderRadius:6,border:`1.5px solid ${getPkg(a.id)===v?"#d4a853":"rgba(0,0,0,.08)"}`,background:getPkg(a.id)===v?"rgba(212,168,83,.08)":"#fff",color:getPkg(a.id)===v?"#9a7422":"#999",cursor:"pointer",fontFamily:"inherit",fontWeight:getPkg(a.id)===v?700:400}}>
                  {l} <span style={{color:"#8a7d74"}}>{p}</span>
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
              <div style={{display:"flex",justifyContent:"space-between",color:"#6b5e52",marginBottom:2}}><span>RentPrep</span><span>${pkgFees[getPkg(a.id)]}</span></div>
              {getIncome(a.id)!=="none"&&<div style={{display:"flex",justifyContent:"space-between",color:"#6b5e52",marginBottom:2}}><span>Income verification</span><span>+${incomeAdds[getIncome(a.id)]}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",color:"#6b5e52",marginBottom:2}}>
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
          status:"new-lead",lastContact:TODAY.toISOString().split("T")[0],
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
              address:selProp?selProp.addr:"",
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
              <tr><td style={{padding:"5px 0",color:"#6b5e52",width:"38%",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Applicant</td><td style={{padding:"5px 0",fontWeight:700,borderBottom:"1px solid rgba(0,0,0,.04)"}}>{a.name}</td></tr>
              <tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Contact</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:11,color:"#5c4a3a"}}>{a.email} - {a.phone}</td></tr>
              <tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Property</td><td style={{padding:"5px 0",fontWeight:600,borderBottom:"1px solid rgba(0,0,0,.04)"}}>{selProp?selProp.name:"No preference"}</td></tr>
              <tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Room</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>{roomMode==="property"?"Entire property":roomMode==="choice"?"Tenant chooses":(selRoom?selRoom.name:"Not specified")}</td></tr>
              {inviteRent>0&&<tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Rent</td><td style={{padding:"5px 0",fontWeight:700,color:"#2d6a3f",borderBottom:"1px solid rgba(0,0,0,.04)"}}>${inviteRent+"/mo"}</td></tr>}
              {inviteMoveIn&&<tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Move-in</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>{fmtD(inviteMoveIn)}</td></tr>}
              <tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Screening</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>{pkgLabel[pkg]}{incomeAdd!=="none"?" + "+incomeLabel[incomeAdd]:""}</td></tr>
              <tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Fee (tenant)</td><td style={{padding:"5px 0",fontWeight:700,color:totalFee===0?"#4a7c59":"#d4a853",borderBottom:"1px solid rgba(0,0,0,.04)"}}>{totalFee===0?"Free":"$"+totalFee}</td></tr>
              {modal.sendNote&&<tr><td style={{padding:"5px 0",color:"#6b5e52"}}>Note</td><td style={{padding:"5px 0",fontStyle:"italic",color:"#5c4a3a",fontSize:11}}>{modal.sendNote}</td></tr>}
            </tbody>
          </table>
          <div style={{marginTop:10,padding:"6px 10px",background:"rgba(0,0,0,.03)",borderRadius:6,fontSize:10,color:"#6b5e52",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link}</div>
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
        <span style={{fontSize:10,color:"#6b5e52"}}>{a.source||""}</span>
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
                <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
                <input type="number" min={0} value={inviteRent||""} onChange={e=>{const v=Number(e.target.value)||0;setModal(prev=>({...prev,inviteRent:v,...(prev.inviteSD===undefined||prev.inviteSD===prev.inviteRent?{inviteSD:v}:{})}));}} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
              </div>
            </div>
            <div className="fld" style={{marginBottom:0}}>
              <label>Security Deposit</label>
              <div style={{display:"flex",alignItems:"center"}}>
                <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
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
                {lastLeaseEnd&&<div style={{marginTop:4,fontSize:10,color:"#6b5e52"}}>{"Last bedroom lease ends "+fmtD(lastLeaseEnd)+" - property will not be fully vacant until after that date."}</div>}
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
                  <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
                  <input type="number" min={0} value={inviteRent||""} onChange={e=>{const v=Number(e.target.value)||0;setModal(prev=>({...prev,inviteRent:v,...(prev.inviteSD===undefined||prev.inviteSD===prev.inviteRent?{inviteSD:v}:{})}));}} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
                </div>
              </div>
              <div className="fld" style={{marginBottom:0}}>
                <label>Security Deposit</label>
                <div style={{display:"flex",alignItems:"center"}}>
                  <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
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
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"#1a1714"}}>{l}</div><div style={{fontSize:10,color:"#6b5e52"}}>{sub}</div></div>
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
        {pkg==="none"&&<div style={{fontSize:10,color:"#6b5e52",fontStyle:"italic",padding:"6px 0"}}>Income verification not available when screening is waived.</div>}
        <div style={{marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:totalFee===0?"rgba(74,124,89,.06)":"rgba(212,168,83,.06)",borderRadius:8,border:"1px solid "+(totalFee===0?"rgba(74,124,89,.15)":"rgba(212,168,83,.15)")}}>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <span style={{fontSize:11,color:"#6b5e52"}}>{pkgLabel[pkg]}{incomeAdd!=="none"?" + "+incomeLabel[incomeAdd]:""}</span>
            {pkg!=="none"&&<div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:"#6b5e52"}}>
              Admin fee:
              <div style={{display:"flex",alignItems:"center",gap:0}}>
                <span style={{padding:"2px 5px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"4px 0 0 4px",fontSize:11,color:"#999",fontWeight:700}}>$</span>
                <input type="number" min={0} max={200} value={adminFee}
                  onChange={e=>{const u={...settings,adminFee:Number(e.target.value)||0};setSettings(u);save("hq-settings",u);}}
                  style={{width:52,borderRadius:"0 4px 4px 0",borderLeft:"none",padding:"2px 6px",fontSize:11,border:"1px solid rgba(0,0,0,.08)",fontFamily:"inherit"}}/>
              </div>
              <span style={{color:"#aaa",fontSize:9}}>saved to settings</span>
            </div>}
          </div>
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
          if(roomMode==="locked"&&!selRoomId){setModal(prev=>({...prev,inviteRoomErr:true}));shakeModal();return;}
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
                <div style={{fontSize:10,color:"#6b5e52",marginBottom:6}}>Property Manager</div>
                {modal.pmSig
                  ?<img src={modal.pmSig} alt="PM signature" style={{maxHeight:50,maxWidth:"100%",border:"1px solid rgba(0,0,0,.08)",borderRadius:4,padding:3,background:"#fff"}}/>
                  :<div style={{fontSize:12,fontFamily:"serif",color:"#1a1714"}}>{modal.previewVars?.LANDLORD_NAME}</div>
                }
                <div style={{fontSize:10,color:"#6b5e52",marginTop:4}}>{modal.previewVars?.LANDLORD_NAME} · Property Manager</div>
              </div>
              <div>
                <div style={{fontSize:10,color:"#6b5e52",marginBottom:6}}>Resident</div>
                <div style={{height:50,border:"2px dashed rgba(0,0,0,.1)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:11,color:"#7a7067"}}>Tenant signs here</span>
                </div>
                <div style={{fontSize:10,color:"#6b5e52",marginTop:4}}>{modal.data?.name} · Resident</div>
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
      // Sync to Supabase relational tables
      syncTenantToSupabase({
        name:tenantData.name,email:tenantData.email,phone:tenantData.phone,
        moveIn:mf.moveIn,leaseEnd:mf.leaseEnd,
        rent:Number(mf.rent),sd:Number(mf.sd)||0,
        propName:currentProp.name,roomName:currentItem.name,
        doorCode:tenantData.doorCode,
        appDataRoomId:currentItem.id,charges,
      }).catch(console.error);
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
      <div style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>Manually onboard a tenant who is already living in your property. This will mark the room as occupied immediately.</div>
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
              <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
              <input type="number" value={mf.rent||""} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",width:"100%",borderColor:errs.rent?"#c45c4a":undefined}}
                onChange={e=>{upd("rent",e.target.value);if(!mf.sdTouched)upd("sd",e.target.value);}} placeholder="0"/>
            </div>
          </div>
          <div className="fld" style={{marginBottom:0}}>
            <label>Security Deposit</label>
            <div style={{display:"flex",alignItems:"center"}}>
              <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
              <input type="number" value={mf.sd||""} style={{borderRadius:"0 6px 6px 0",borderLeft:"none",width:"100%"}}
                onChange={e=>{upd("sd",e.target.value);upd("sdTouched",true);}} placeholder="0"/>
            </div>
            <div style={{fontSize:9,color:"#6b5e52",marginTop:3}}>Auto-fills from rent</div>
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
    const STAGES=["new-lead","applied","approved","onboarding"];
    const SL2={"pre-screened":"Pre-Screened","called":"Called / Follow Up","invited":"Invited","applied":"Applied","reviewing":"Reviewing","lease-sent":"Lease Sent","approved":"Onboarding","onboarding":"Onboarding","move-in":"Onboarding"};
    const SI3={"new-lead":"Lead","applied":"Applied","approved":"Approved","onboarding":"Onboarding","denied":"Denied"};
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
          label:(isEviction?"Previously evicted":isEarly?"Broke lease early":"Returning tenant")+" — "+(t.propName||"unknown")+(t.reason?" ("+t.reason+")":"")
        });
      }
    });
    apps.filter(x=>x.id!==a.id&&x.status==="denied").forEach(x=>{
      const nameMatch=(x.name||"").toLowerCase()===nm3&&nm3.length>0;
      const emailMatch=(x.email||"").toLowerCase()===(a.email||"").toLowerCase()&&(a.email||"").length>0;
      if(emailMatch||(nameMatch&&emailMatch))mf.push({type:"denied",label:"Previously denied"+(x.deniedReason?" — "+x.deniedReason:"")});
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
      // Sync to Supabase relational tables
      const targetProp2=props.find(p=>allRooms(p).some(x=>x.id===roomId));
      const targetRoom2=targetProp2?allRooms(targetProp2).find(r=>r.id===roomId):null;
      syncTenantToSupabase({
        name:a.name,email:a.email,phone:a.phone,
        moveIn:mi,leaseEnd:le.toISOString().split("T")[0],
        rent:a.negotiatedRent||a.rent,sd:a.chargeConfig?.sd,
        propName:targetProp2?.name,roomName:targetRoom2?.name,
        doorCode:targetRoom2?.doorCode||"",
        appDataRoomId:roomId,charges,
      }).catch(console.error);
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
          <h3 style={{margin:0}}>Applicant Info</h3>
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
          <label>Reason for Leaving <span style={{fontWeight:400,color:"#6b5e52",fontSize:9,textTransform:"none",letterSpacing:0}}>— from applicant's pre-screen</span></label>
          <textarea value={a.notes||""} onChange={e=>{setApps(p=>p.map(x=>x.id===a.id?{...x,notes:e.target.value}:x));setModal(prev=>({...prev,data:{...prev.data,notes:e.target.value}}));}} placeholder="Why are they leaving their current place? (auto-filled from pre-screen form)" rows={2} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit",resize:"vertical"}}/>
        </div>
      </div>

      {/* ── Lease Preference (from Lease Now flow) ── */}
      {(a.leaseTerm||a.leasePrice||a.room)&&<div className="tp-card" style={{background:"rgba(74,124,89,.03)",border:"1px solid rgba(74,124,89,.12)"}}>
        <h3 style={{color:"#4a7c59"}}>Lease Preferences — Submitted by Applicant</h3>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>
          {a.property&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>{a.property}</div>}
          {a.room&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>{a.room}</div>}
          {a.moveIn&&a.moveIn!=="Flexible"&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>{fmtD(a.moveIn)}</div>}
          {a.leaseTerm&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>{a.leaseTerm}</div>}
          {a.leasePrice&&<div style={{padding:"6px 12px",borderRadius:7,background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.15)",fontSize:11,fontWeight:700,color:"#2d6a3f"}}>${a.leasePrice}/mo</div>}
        </div>
        <div style={{fontSize:9,color:"#6b5e52",marginTop:8}}>These are the terms the applicant agreed to when they clicked Lease Now. Use as reference when assigning room and setting rent.</div>
      </div>}


      {a.status==="reviewing"&&<div className="tp-card"><h3>Review Checklist</h3>
        {reqs.map(r=>{const isW=waived.includes(r.label);const val=a[r.key]||"not-started";return(
          <div key={r.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.03)",opacity:isW?0.4:1}}>
            <span style={{fontSize:12,textDecoration:isW?"line-through":"none"}}>{r.label}{isW&&<span style={{fontSize:9,color:"#6b5e52",marginLeft:6}}>Waived</span>}</span>
            {!isW&&<select value={val} onChange={e=>{setApps(p=>p.map(x=>x.id===a.id?{...x,[r.key]:e.target.value}:x));setModal(prev=>({...prev,data:{...prev.data,[r.key]:e.target.value}}));}} style={{padding:"3px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:10,fontFamily:"inherit"}}><option value="not-started">Not Started</option><option value="pending">In Progress</option><option value="passed">Passed</option><option value="failed">Failed</option></select>}
          </div>);})}
        {a.waiverReason&&<div style={{fontSize:10,color:"#6b5e52",marginTop:6,fontStyle:"italic"}}>Waiver: {a.waiverReason}</div>}
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
          <h3 style={{margin:"0 0 12px",color:"#9a7422"}}>Room / Unit Assignment</h3>
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
            <label>Assign Room / Unit <span style={{fontWeight:400,color:"#5c4a3a",fontSize:9,textTransform:"none",letterSpacing:0}}>Vacant now + units whose lease ends by move-in date</span></label>
            <select value={a.termRoomId||termItem?.id||""} onChange={e=>{const item=availableItems.find(x=>x.id===e.target.value);if(item){saveTerm("termRoomId",item.id);saveTerm("termPropId",item.propId);saveTerm("termRent",item.rent);saveTerm("termSD",item.rent);}}} style={{width:"100%"}}>
              <option value="">No assignment at this time</option>
              {availableItems.map(item=>{
                const isSelected=item.id===(a.termRoomId||termItem?.id);
                const rent=isSelected?termRent:item.rent;
                return<option key={item.id} value={item.id}>{itemLabel(item,rent)}</option>;
              })}
              {termItem&&!availableItems.find(i=>i.id===termItem.id)&&<option value={termItem.id}>{termItem.name} at {termProp?.name} (occupied) — occupied, lease not expired by move-in</option>}
            </select>
            {termItem&&!availableItems.find(i=>i.id===termItem.id)&&<div style={{fontSize:10,color:"#c45c4a",marginTop:4,fontWeight:600,animation:"shake .4s ease"}}>This unit is currently occupied and its lease does not end by the selected move-in date.</div>}
            {!termItem&&!a.termRoomId&&a.room&&<div style={{fontSize:10,color:"#c45c4a",marginTop:4,fontWeight:600,animation:"shake .4s ease"}}>"{a.room}" is not available — select an available room or unit.</div>}
          </div>
          {(a.termRoomId||termItem?.id)&&<>
            <div className="fr" style={{gap:8,marginBottom:0}}>
              <div className="fld" style={{marginBottom:0}}>
                <label>Monthly Rent <span style={{fontWeight:400,color:"#5c4a3a",fontSize:9,textTransform:"none",letterSpacing:0}}>Edit if rate differs from listing</span></label>
                <div style={{display:"flex",alignItems:"center",gap:0}}>
                  <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
                  <input type="number" min={0} value={termRent||""} onChange={e=>{const v=Number(e.target.value)||0;saveTerm("termRent",v);if(a.termSD===undefined||a.termSD===termRent)saveTerm("termSD",v);}} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
                </div>
              </div>
              <div className="fld" style={{marginBottom:0}}>
                <label>Security Deposit <span style={{fontWeight:400,color:"#5c4a3a",fontSize:9,textTransform:"none",letterSpacing:0}}>Auto-fills from rent — editable</span></label>
                <div style={{display:"flex",alignItems:"center",gap:0}}>
                  <span style={{padding:"8px 10px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"6px 0 0 6px",fontSize:13,color:"#6b5e52",fontWeight:700}}>$</span>
                  <input type="number" min={0} value={a.termSD!==undefined?a.termSD:(termRent||"")} onChange={e=>saveTerm("termSD",Number(e.target.value)||0)} style={{width:"100%",borderRadius:"0 6px 6px 0",borderLeft:"none"}} placeholder="0"/>
                </div>
              </div>
            </div>
            {selectedAvail?._willVacate&&<div style={{marginTop:8,fontSize:10,color:"#9a7422",background:"rgba(212,168,83,.06)",borderRadius:6,padding:"7px 10px"}}>
              Current lease ends {fmtD(selectedAvail.le)} — unit will be vacant by move-in date.
            </div>}
          </>}
        </div>);
      })()}
      {(a.status==="approved"||a.status==="move-in"||a.status==="onboarding")&&<div className="tp-card"><h3>Screening Summary</h3>
        {reqs.map(r=>{const isW=waived.includes(r.label);const val=a[r.key]||"—";const passed=val==="passed"||val==="verified";return(
          <div key={r.key} style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.03)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,opacity:isW?.45:1,textDecoration:isW?"line-through":"none"}}>{r.label}</span>
              <span style={{fontSize:11,fontWeight:700,color:isW?"#bbb":passed?"#4a7c59":val==="pending"?"#d4a853":"#c45c4a"}}>{isW?"Bypassed":passed?"Pass":val}</span>
            </div>
            {isW&&<div style={{fontSize:9,color:"#6b5e52",fontStyle:"italic",marginTop:1}}>{a.waiverReason?"Reason: "+a.waiverReason:"No waiver reason on file"}</div>}
          </div>);})}
        {a.approvedWithPending&&<div style={{marginTop:6,padding:"5px 8px",background:"rgba(212,168,83,.06)",borderRadius:5,fontSize:10,color:"#9a7422"}}>Approved with pending: {a.approvedWithPending}</div>}
      </div>}
      {/* Roommate Compatibility */}
      {a.property&&<div className="tp-card"><h3>Housemates at {a.property}</h3>
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
                      <div style={{fontSize:11,fontWeight:700,color:"#6b5e52"}}>{fmtS(item.rent)}/mo</div>
                      <div style={{fontSize:8,color:"#7a7067",marginTop:1}}>whole unit</div>
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
                      {(genderShort||age||item.tenant.occupationType)&&<span style={{color:"#6b5e52",marginLeft:6}}>
                        {[genderShort,age?"Age "+age:null,item.tenant.occupationType].filter(Boolean).join(" · ")}
                      </span>}
                    </div>}
                    {!occ&&<div style={{fontSize:10,color:"#4a7c59",fontWeight:600,marginTop:2}}>Vacant</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#6b5e52"}}>{fmtS(item.rent)}/mo</div>
                    <div style={{fontSize:8,color:"#7a7067",marginTop:1}}>12-mo lease</div>
                  </div>
                </div>
              );
            })}
          </>);
        })()}
      </div>}

      {/* Communication Log */}
      <div className="tp-card"><h3>Comm Log</h3>
        <div style={{display:"flex",gap:4,marginBottom:8}}>
          {["Call","Text","Email","Note"].map(function(tp){return(
            <button key={tp} className="btn btn-out btn-sm" style={{flex:1,fontSize:9}} onClick={function(){setModal(function(prev){return Object.assign({},prev,{showCommInput:tp,commText:""});});}}>{tp}</button>);})}
        </div>
        {modal.showCommInput&&<div style={{display:"flex",gap:4,marginBottom:8}}>
          <input value={modal.commText||""} onChange={function(e){setModal(function(prev){return Object.assign({},prev,{commText:e.target.value});});}} placeholder={"Log this "+modal.showCommInput+"..."} style={{flex:1,padding:"6px 10px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:11,fontFamily:"inherit"}} autoFocus/>
          <button className="btn btn-green btn-sm" disabled={!(modal.commText||"").trim()} onClick={function(){var log={type:modal.showCommInput,text:modal.commText,date:TODAY.toISOString().split("T")[0],time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};setApps(function(p){return p.map(function(x){return x.id===a.id?Object.assign({},x,{commLog:[log].concat(x.commLog||[]),lastContact:TODAY.toISOString().split("T")[0]}):x;});});setModal(function(prev){return Object.assign({},prev,{showCommInput:null,commText:"",data:Object.assign({},prev.data,{commLog:[log].concat(prev.data.commLog||[]),lastContact:TODAY.toISOString().split("T")[0]})});});}}>Save</button>
        </div>}
        {(a.commLog||[]).length>0?<div style={{maxHeight:120,overflowY:"auto"}}>{(a.commLog||[]).map(function(c,i){return(
          <div key={i} style={{display:"flex",gap:6,padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.02)",fontSize:10}}>
            <span style={{width:20,textAlign:"center",fontSize:9,color:"#6b5e52",fontWeight:700}}>{c.type[0]}</span>
            <div style={{flex:1}}><div style={{color:"#333"}}>{c.text}</div><div style={{color:"#6b5e52",fontSize:9}}>{c.date}{" "}{c.time}</div></div>
          </div>);})}</div>:<div style={{fontSize:10,color:"#8a7d74",textAlign:"center",padding:8}}>No communication logged</div>}
      </div>

      {/* Documents from application */}
      {((a.documents&&a.documents.length>0)||a.docsFlag)&&<div className="tp-card">
        <h3>Application Documents</h3>
        {a.docsFlag&&<>
          {!a.docsFlag.idUploaded&&<div style={{fontSize:10,padding:"4px 8px",borderRadius:5,background:a.docsFlag.idUploadLater?"rgba(212,168,83,.06)":"rgba(196,92,74,.06)",color:a.docsFlag.idUploadLater?"#9a7422":"#c45c4a",marginBottom:4}}>
            {a.docsFlag.idUploadLater?"Photo ID — will upload later":"Photo ID — not submitted"}
          </div>}
          {!a.docsFlag.incomeUploaded&&<div style={{fontSize:10,padding:"4px 8px",borderRadius:5,background:a.docsFlag.incomeUploadLater?"rgba(212,168,83,.06)":"rgba(74,124,89,.06)",color:a.docsFlag.incomeUploadLater?"#9a7422":"#4a7c59",marginBottom:4}}>
            {a.docsFlag.incomeUploadLater?"Proof of Income — will upload later":"Proof of Income — not submitted"}
          </div>}
        </>}
        {(a.documents||[]).map((doc,i)=>(
          <div key={doc.id||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
            <div>
              <div style={{fontSize:12,fontWeight:600}}>{doc.label||doc.name}</div>
              <div style={{fontSize:9,color:"#6b5e52"}}>{doc.name} · Uploaded {doc.uploaded}</div>
            </div>
            {doc.data&&<a href={doc.data} download={doc.name} className="btn btn-out btn-sm" style={{fontSize:9,textDecoration:"none"}}>Download</a>}
          </div>
        ))}
        {(!a.documents||a.documents.length===0)&&<div style={{fontSize:11,color:"#6b5e52",fontStyle:"italic"}}>No files uploaded yet.</div>}
      </div>}


      {/* Move-in charges — shown on approved applicants */}
      {(a.status==="approved"||a.status==="onboarding")&&(()=>{
        const lk=a.lockActivation;
        if(lk)return(
        <div className="tp-card" style={{marginTop:10,border:"1px solid rgba(212,168,83,.2)",background:"rgba(212,168,83,.02)"}}>
          <h3 style={{color:"#9a7422"}}>Door Passcode</h3>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:28,fontWeight:900,letterSpacing:8,fontFamily:"monospace",color:"#1a1714"}}>{lk.passcode||a.passcode}</div>
              <div style={{fontSize:10,color:"#6b5e52",marginTop:4}}>Activates 12:00am on {fmtD(a.termMoveIn||a.moveIn)} · All exterior doors + bedroom</div>
            </div>
            <div style={{textAlign:"right"}}>
              <span className={`badge ${lk.status==="active"?"b-green":"b-gold"}`}>{lk.status==="active"?"Active":"Pending"}</span>
              <div style={{fontSize:9,color:"#6b5e52",marginTop:4}}>Smart lock API: stub ready</div>
            </div>
          </div>
          {!lk.passcode&&!a.passcode&&<div style={{fontSize:10,color:"#c45c4a",marginTop:6}}>No passcode — tenant didn't set one in their application.</div>}
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
            <h3 style={{margin:0,color:"#4a7c59"}}>Move-In Charges</h3>
            <span style={{fontSize:11,fontWeight:700,color:remaining>0?"#c45c4a":"#4a7c59"}}>{remaining>0?`${fmtS(remaining)} remaining`:"✓ Fully paid"}</span>
          </div>
          {appCharges.map(c=>{
            const st=chargeStatus(c);const paid=c.amountPaid;const rem=c.amount-paid;
            return(
            <div key={c.id} style={{padding:"8px 0",borderBottom:"1px solid rgba(0,0,0,.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:12,fontWeight:600}}>{c.desc}</div>
                <div style={{fontSize:10,color:"#6b5e52"}}>Due {fmtD(c.dueDate)}</div>
                {paid>0&&paid<c.amount&&<div style={{fontSize:10,color:"#d4a853",fontWeight:600}}>{fmtS(paid)} paid · {fmtS(rem)} remaining</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <span style={{fontWeight:800,fontSize:13}}>{fmtS(c.amount)}</span>
                <span className={`badge ${st==="paid"?"b-green":st==="partial"?"b-gold":st==="pastdue"?"b-red":"b-gray"}`} style={{fontSize:7}}>{st}</span>
                {st!=="paid"&&<button className="btn btn-green btn-sm" style={{fontSize:9,padding:"3px 8px"}} onClick={()=>setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""})}>Record Payment</button>}
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
        {a.status==="new-lead"&&<button className="btn btn-gold" style={{flex:1}} onClick={()=>setModal({type:"inviteApp",data:a})}>Invite to Apply</button>}
        {a.status==="applied"&&<>
          {incompleteReqs.length>0&&<div style={{width:"100%",padding:"10px 12px",background:"rgba(212,168,83,.07)",border:"1px solid rgba(212,168,83,.25)",borderRadius:8,fontSize:11,color:"#9a7422",marginBottom:6}}>
            <div style={{fontWeight:700,marginBottom:4}}>Still pending — review before approving:</div>
            {incompleteReqs.map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"2px 0"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#d4a853",flexShrink:0,display:"inline-block"}}/>
              {r.label}
            </div>)}
            <div style={{marginTop:6,fontSize:10,color:"#9a7422",opacity:.8}}>You can still approve — you'll be asked to confirm again.</div>
          </div>}
          <button className="btn btn-green" style={{flex:1}} onClick={()=>setModal({type:"approveConfirm",data:a,incompleteReqs,step:1})}>
            Approve{incompleteReqs.length>0?" Anyway":""}
          </button>
        </>}

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
              ?<button className="btn btn-green" style={{flex:1,width:"100%"}} onClick={()=>{if(targetRoom)convertToTenant(targetRoom.id,targetProp.id);else showAlert({title:"Room Not Found",body:"Could not find the assigned room. Please check the room assignment and try again."});}}>All Paid — Convert to Tenant</button>
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

  {editProp!==null&&<PropEditor prop={isNewProp?null:editProp} onSave={saveProp} onClose={()=>setEditProp(null)} isNew={isNewProp}
    onViewTenant={(r,propName)=>{
      // PropEditor already called onSave(p) before this — props is up to date
      // Find the room in freshly saved props so tenant modal has correct data
      const freshProp=props.find(p=>p.name===propName)||(isNewProp?null:editProp);
      const freshRoom=freshProp?allRooms(freshProp).find(x=>x.id===r.id)||r:r;
      const freshUnit=freshProp?(freshProp.units||[]).find(u=>(u.rooms||[]).some(x=>x.id===r.id)):null;
      setModal({type:"tenant",data:{...freshRoom,propName,unitId:freshUnit?.id,isWholeUnit:!!(freshUnit&&(freshUnit.rentalMode||"byRoom")==="wholeHouse"),propUtils:freshUnit?.utils||freshProp?.utils||r.utils,propClean:freshUnit?.clean||freshProp?.clean||r.clean}});
    }}
    settings={settings} onUpdateSettings={s=>{setSettings(s);save("hq-settings",s);}} onDelete={id=>{setProps(prev=>prev.filter(x=>x.id!==id));setEditProp(null);}}/>}

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
    <div style={{textAlign:"center",marginBottom:12}}><div style={{fontSize:14,fontWeight:800,color:"#d4a853",letterSpacing:1.5}}>{leadToast.status==="applied"?"NEW APPLICATION!":"NEW LEAD!"}</div></div>
    <div style={{textAlign:"center",marginBottom:10}}><div style={{fontSize:22,fontWeight:800,color:"#f5f0e8"}}>{leadToast.name}</div></div>
    <div style={{display:"flex",justifyContent:"center",gap:16,fontSize:12,color:"#c4a882",marginBottom:14,flexWrap:"wrap"}}>
      {leadToast.phone&&<span>{leadToast.phone}</span>}
      {leadToast.property&&<span>{leadToast.property}</span>}
      {leadToast.room&&<span>{leadToast.room}</span>}
    </div>
    <button onClick={viewNewLead} style={{width:"100%",padding:"12px 20px",background:"#d4a853",color:"#1a1714",border:"none",borderRadius:8,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:6}}>{leadToast.status==="applied"?"Review Application →":"View New Lead →"}</button>
    <div style={{textAlign:"center"}}><button onClick={dismissToast} style={{background:"none",border:"none",color:"#5c4a3a",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Dismiss</button></div>
  </div>}

  </div>{/* end outside zoom wrapper */}
  </div>);
}
