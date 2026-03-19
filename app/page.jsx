"use client";
// ═══════════════════════════════════════════════════════════════════
// PUBLIC SITE — rentblackbear.com
// This file replaces app/page.jsx in your Next.js project.
// Admin pages at /admin are separate and untouched.
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Data ───────────────────────────────────────────────────────────
const S_INFO = { company:"Black Bear Rentals", legal:"Oak & Main Development LLC", phone:"(850) 696-8101", email:"info@rentblackbear.com", city:"Huntsville, Alabama" };

// Properties come 100% from Supabase (hq-props). No hardcoded fallback.
const PROPS=[];

// Unit-aware room helpers for public page — handles both old flat rooms[] and new units[] format
const allRoomsP=(prop)=>{
  if(!prop)return[];
  if(prop.units&&prop.units.length>0)return prop.units.flatMap(u=>u.rooms||[]);
  return prop.rooms||[]; // fallback for old flat format
};
const safeMin=(arr)=>arr.length>0?Math.min(...arr):0;
const validCoord=(lat,lng)=>typeof lat==="number"&&typeof lng==="number"&&isFinite(lat)&&isFinite(lng)&&lat!==0&&lng!==0&&lat>=-90&&lat<=90&&lng>=-180&&lng<=180;
const safeMax=(arr)=>arr.length>0?Math.max(...arr):0;
const POIS=[
  // Redstone Arsenal gates — verified coordinates
  {name:"Redstone Arsenal Gate 9",icon:"🪖",cat:"Redstone Arsenal",drive:"12 min",lat:34.6598,lng:-86.6423,desc:"Main contractor & visitor gate",url:"https://www.google.com/maps/place/Redstone+Arsenal+Gate+9"},
  {name:"Redstone Arsenal Gate 1",icon:"🪖",cat:"Redstone Arsenal",drive:"8 min",lat:34.6467,lng:-86.6108,desc:"Martin Rd — closest gate to our properties",url:"https://www.google.com/maps/place/Gate+1+Redstone+Arsenal"},
  // Entertainment
  {name:"Downtown Huntsville",icon:"🏙️",cat:"Entertainment",drive:"5 min",lat:34.7304,lng:-86.5861,desc:"Courthouse Square, restaurants, nightlife",url:"https://www.downtownhuntsville.org"},
  {name:"Von Braun Center",icon:"🎭",cat:"Entertainment",drive:"6 min",lat:34.7280,lng:-86.5935,desc:"Concerts, expos, conventions",url:"https://www.vonbrauncenter.com"},
  {name:"MidCity District",icon:"🎯",cat:"Entertainment",drive:"12 min",lat:34.7064,lng:-86.6801,desc:"Dave & Buster's, Top Golf, Camp",url:"https://www.midcityhuntsville.com"},
  // Food & Drink
  {name:"Stovehouse",icon:"🍽️",cat:"Food & Drink",drive:"8 min",lat:34.7172,lng:-86.5712,desc:"Food hall, live music, cocktail bars",url:"https://www.stovehouse.com"},
  // Shopping
  {name:"Bridge Street Town Centre",icon:"🛍️",cat:"Shopping",drive:"14 min",lat:34.7527,lng:-86.6850,desc:"Outdoor mall, movie theater, restaurants",url:"https://www.bridgestreethuntsville.com"},
  // Education
  {name:"UAH Campus",icon:"🎓",cat:"Education",drive:"10 min",lat:34.7254,lng:-86.6408,desc:"University of Alabama in Huntsville",url:"https://www.uah.edu"},
  // Healthcare
  {name:"Huntsville Hospital",icon:"🏥",cat:"Healthcare",drive:"6 min",lat:34.7243,lng:-86.5826,desc:"Level 1 trauma center, emergency",url:"https://www.huntsvillehospital.org"},
  // Grocery & Retail — University Dr corridor
  {name:"Walmart Supercenter",icon:"🛒",cat:"Grocery & Retail",drive:"7 min",lat:34.7329,lng:-86.6480,desc:"Full grocery, pharmacy, general merchandise",url:"https://www.walmart.com/store/1098-huntsville-al"},
  {name:"Target",icon:"🎯",cat:"Grocery & Retail",drive:"7 min",lat:34.7059,lng:-86.6226,desc:"Grocery, clothing, home goods",url:"https://www.target.com/sl/huntsville-south/2781"},
  {name:"Costco",icon:"🛒",cat:"Grocery & Retail",drive:"12 min",lat:34.7370,lng:-86.6784,desc:"Bulk grocery, gas station, pharmacy",url:"https://www.costco.com/warehouse-locations/huntsville-al-1198.html"},
  {name:"Kroger",icon:"🛒",cat:"Grocery & Retail",drive:"5 min",lat:34.7050,lng:-86.5870,desc:"Grocery, deli, pharmacy — Sparkman Dr",url:"https://www.kroger.com/stores"},
  {name:"ALDI",icon:"🛒",cat:"Grocery & Retail",drive:"6 min",lat:34.7293,lng:-86.6318,desc:"Budget-friendly grocery",url:"https://stores.aldi.us/al/huntsville"},
];

const SCREEN_QS=[
  {id:"smoke",q:"Are you a non-smoker? We have a strict no-smoking policy (including vapes).",pass:"Yes"},
  {id:"drugs",q:"Do you agree to our zero-tolerance drug policy?",pass:"Yes"},
  {id:"pets",q:"Are you comfortable with our no-pets policy?",pass:"Yes"},
  {id:"bg",q:"Can you pass a background check with no criminal record?",pass:"Yes"},
  {id:"credit",q:"Is your credit score 650 or above?",pass:"Yes"},
  {id:"income",q:"Is your gross monthly income at least 3x your expected rent?",pass:"Yes"},
  {id:"refs",q:"Can you provide professional references and verifiable landlord history?",pass:"Yes"},
];

// ─── Supabase (read-only for public site) ───────────────────────────
const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
async function supaGet(key){try{const r=await fetch(`${SUPA_URL}/rest/v1/app_data?key=eq.${key}&select=value`,{headers:{apikey:SUPA_KEY,Authorization:`Bearer ${SUPA_KEY}`}});const d=await r.json();return d?.[0]?.value||null;}catch{return null;}}
async function supaSet(key,value){try{await fetch(`${SUPA_URL}/rest/v1/app_data`,{method:"POST",headers:{apikey:SUPA_KEY,Authorization:`Bearer ${SUPA_KEY}`,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},body:JSON.stringify({key,value})});}catch{}}

const AMENITIES=[
  {icon:"📶",t:"Google Fiber WiFi",d:"High-speed internet in every property."},
  {icon:"🛋️",t:"Fully Furnished",d:"Bed, dresser, TV, and kitchen essentials."},
  {icon:"🧹",t:"Common Area Cleaning",d:"Weekly (5-bed) or biweekly (3-bed) professional cleaning."},
  {icon:"🅿️",t:"Off-Street Parking",d:"Dedicated parking at every property."},
  {icon:"💡",t:"Utilities Covered",d:"All included or first $100 covered depending on property."},
  {icon:"🔑",t:"Rent by the Room",d:"Pick your room and price. Private bath options available."},
];

const CHAT_CTX=`You are the AI assistant for Black Bear Rentals in Huntsville, AL. Rent by the bedroom. All rooms furnished with bed, dresser, TV. Google Fiber WiFi always included. Cleaning: 5-bed weekly, 3-bed biweekly. No pets, no smoking, no shoes. Quiet hours 10pm-7am weekdays, 11pm-10am weekends. SD = 1 month rent, secures room. First month rent due on/before move-in. No app fee, tenant pays for background check. 12-month standard lease, flexible for interns/contractors. Properties: Holmes House (SFH, 5bd, first $100 utils then split), Lee Drive East & West (Townhomes, 3bd, all utils included). Rooms $600-$850/mo. Be friendly and concise.`;

const TODAY=new Date();
const CLR={avBg:"#dff0e4",avTx:"#2d6a3f",occBg:"#fce4e1",occTx:"#a83a2e",soonBg:"#fef3da",soonTx:"#9a7422"};
function fmtD(d){if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;}
function getDIM(y,m){return new Date(y,m+1,0).getDate();}
function getFD(y,m){return new Date(y,m,1).getDay();}

// ─── Mega Styles ────────────────────────────────────────────────────
const CSS=`
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#fefdfb;color:#1a1714;overflow-x:hidden}
:root{--fd:'DM Serif Display',Georgia,serif;--fb:'Plus Jakarta Sans',system-ui,sans-serif;--ac:#d4a853;--dk:#1a1714;--cd:#2c2520;--wm:#5c4a3a;--mt:#c4a882;--cr:#f5f0e8;--sf:#fefdfb;--gn:#2d6a3f;--rd:#a83a2e}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
@keyframes chatOpen{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
.fu{animation:fadeUp .7s ease-out both}.fu1{animation-delay:.1s}.fu2{animation-delay:.2s}.fu3{animation-delay:.3s}.fu4{animation-delay:.4s}

/* Nav */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 40px;height:68px;display:flex;align-items:center;justify-content:space-between;transition:all .35s}
.nav.sc{background:rgba(26,23,20,.95);backdrop-filter:blur(12px);box-shadow:0 2px 20px rgba(0,0,0,.12)}
.nlogo{font-family:var(--fd);font-size:20px;color:var(--cr);cursor:pointer;display:flex;align-items:center;gap:8px}.nlogo span{color:var(--ac)}
.nlinks{display:flex;gap:28px;align-items:center}
.nlinks a{color:var(--cr);text-decoration:none;font-size:13px;font-weight:500;opacity:.7;cursor:pointer;transition:opacity .2s}.nlinks a:hover{opacity:1}
.ncta{background:var(--ac)!important;color:var(--dk)!important;padding:9px 22px!important;border-radius:6px;font-weight:700!important;opacity:1!important;font-size:12px!important}

/* Hero */
.hero{min-height:100vh;background:linear-gradient(165deg,var(--dk),var(--cd));display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:80px 24px}
.hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23c4a882' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");opacity:.5}
.hc{text-align:center;position:relative;z-index:2;max-width:760px}
.hbadge{display:inline-flex;align-items:center;gap:8px;background:rgba(212,168,83,.15);border:1px solid rgba(212,168,83,.3);padding:7px 18px;border-radius:100px;font-size:12px;font-weight:600;color:var(--ac);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:28px}
.hero h1{font-family:var(--fd);font-size:clamp(38px,5.5vw,68px);color:var(--cr);line-height:1.08;margin-bottom:20px}
.hero h1 em{color:var(--ac);font-style:italic}
.hero>div>p{font-size:17px;color:rgba(196,168,130,.75);max-width:520px;margin:0 auto 36px;line-height:1.7;font-weight:300}
.hbtns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.bp{background:var(--ac);color:var(--dk);padding:14px 32px;border-radius:8px;border:none;font-family:var(--fb);font-size:14px;font-weight:700;cursor:pointer;transition:all .25s}
.bp:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(212,168,83,.35)}
.bs{background:transparent;color:var(--cr);padding:14px 32px;border-radius:8px;border:1px solid rgba(196,168,130,.3);font-family:var(--fb);font-size:14px;font-weight:500;cursor:pointer;transition:all .25s}
.bs:hover{border-color:var(--mt)}
.hstats{display:flex;gap:40px;justify-content:center;margin-top:56px;padding-top:36px;border-top:1px solid rgba(196,168,130,.15)}
.hst{text-align:center}.hst-n{font-family:var(--fd);font-size:32px;color:var(--ac)}.hst-l{font-size:11px;color:rgba(196,168,130,.5);text-transform:uppercase;letter-spacing:1.5px;margin-top:3px}

/* Proof strip */
.proof{padding:28px 40px;background:#fff}
.proof-in{max-width:960px;margin:0 auto;display:flex;justify-content:space-around;align-items:center;flex-wrap:wrap;gap:20px}
.proof-i{text-align:center;min-width:120px}.proof-n{font-family:var(--fd);font-size:30px;color:var(--dk)}.proof-l{font-size:11px;color:var(--wm);margin-top:3px}

/* Sections */
.sec{padding:100px 40px;position:relative}.sec-dk{background:var(--dk);padding:100px 40px;position:relative}.sec-cr{background:#faf8f4;padding:100px 40px;position:relative}
.sec-inner{max-width:1200px;margin:0 auto}
.sh{text-align:center;max-width:620px;margin:0 auto 56px}
.sl{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--ac);margin-bottom:12px}
.st{font-family:var(--fd);font-size:clamp(26px,3.5vw,40px);line-height:1.15;margin-bottom:14px}
.ss{font-size:14px;line-height:1.7;opacity:.55;font-weight:300}
.sec-dk .st{color:var(--cr)}.sec-dk .ss{color:var(--mt)}

/* Property cards */
.pgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:24px;max-width:1200px;margin:0 auto}
.pcard{background:#fff;border-radius:14px;overflow:hidden;border:1px solid rgba(0,0,0,.05);transition:all .3s;cursor:pointer}.pcard:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,.08)}
.pimg{height:200px;width:100%;object-fit:cover}
.pinfo{padding:20px}
.ptags{display:flex;gap:6px;margin-bottom:10px}
.tag{padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase}
.t-av{background:rgba(45,106,63,.1);color:var(--gn)}.t-cs{background:rgba(212,168,83,.15);color:var(--ac)}
.t-sfh{background:rgba(92,74,58,.08);color:var(--wm)}.t-th{background:rgba(0,0,0,.04);color:var(--dk)}
.pnm{font-family:var(--fd);font-size:22px;margin-bottom:3px}.pad{font-size:13px;color:var(--wm);margin-bottom:14px}
.phls{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.phl{font-size:11px;color:var(--wm);background:var(--cr);padding:4px 10px;border-radius:5px;font-weight:500}
.pftr{display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid rgba(0,0,0,.05)}
.ppr{font-family:var(--fd);font-size:18px}.ppr small{font-family:var(--fb);font-size:11px;opacity:.4}
.pbc{font-size:12px;color:var(--wm)}

/* Modal */
.mo{position:fixed;inset:0;z-index:200;background:rgba(26,23,20,.85);backdrop-filter:blur(8px);display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;animation:fadeIn .25s}
.modal{background:#fff;border-radius:18px;max-width:960px;width:100%;margin:36px auto;position:relative;animation:fadeUp .35s}
.mx{position:absolute;top:14px;right:14px;z-index:10;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.5);border:none;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.mgal{display:grid;grid-template-columns:2fr 1fr;gap:4px;border-radius:18px 18px 0 0;overflow:hidden;background:#1a1714;height:380px}
.mgal img{width:100%;height:100%;object-fit:contain;display:block;background:#1a1714}.mside{display:flex;flex-direction:column;gap:4px}
.mbody{padding:36px}
.mtp{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;gap:16px;flex-wrap:wrap}
.modal h2{font-family:var(--fd);font-size:28px;margin-bottom:3px}
.maddr{font-size:13px;color:var(--wm)}
.mib{background:var(--cr);border-radius:10px;padding:14px 18px;text-align:center;min-width:110px}
.mib .l{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--wm);font-weight:600;margin-bottom:3px}
.mib .v{font-family:var(--fd);font-size:18px}.mib .v small{font-family:var(--fb);font-size:11px;opacity:.4}
.mdesc{font-size:14px;line-height:1.8;color:var(--wm);margin:20px 0}
.istrip{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px}
.ii{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--dk);background:rgba(45,106,63,.08);padding:7px 14px;border-radius:7px}
.ii.pt{background:rgba(212,168,83,.1);color:var(--wm)}
.rh{font-family:var(--fd);font-size:22px;margin-bottom:16px}
.rgrid{display:flex;flex-direction:column;gap:10px;margin-bottom:32px}
.rc{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-radius:12px;border:1px solid rgba(0,0,0,.05);gap:12px;flex-wrap:wrap;transition:all .2s}.rc:hover{border-color:var(--ac)}
.rm-m{flex:1;min-width:180px}
.rn{font-weight:700;font-size:14px;margin-bottom:3px;display:flex;align-items:center;gap:8px}
.rd{font-size:12px;color:var(--wm);display:flex;gap:10px;flex-wrap:wrap}
.rbt{padding:2px 8px;border-radius:100px;font-size:9px;font-weight:700}
.rbt-p{background:rgba(45,106,63,.08);color:var(--gn)}.rbt-s{background:rgba(0,0,0,.04);color:var(--wm)}
.rfs{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}
.rf{font-size:10px;background:var(--cr);color:var(--wm);padding:3px 8px;border-radius:5px}
.rprice{font-family:var(--fd);font-size:24px;text-align:right}.rprice small{font-family:var(--fb);font-size:11px;opacity:.4}
.phbox{background:var(--cr);border-radius:10px;padding:36px;text-align:center;border:2px dashed rgba(196,168,130,.3);margin-bottom:28px}
.phbox h4{margin:6px 0 3px}.phbox p{color:var(--wm);font-size:13px}
.mst{font-family:var(--fd);font-size:18px;margin-bottom:14px}
.mcta{display:flex;gap:10px;margin-top:28px;padding-top:24px;border-top:1px solid rgba(0,0,0,.05)}.mcta .bp,.mcta .bo{flex:1;text-align:center}
.bo{background:transparent;border:2px solid var(--dk);padding:12px 20px;border-radius:8px;font-family:var(--fb);font-size:14px;font-weight:600;cursor:pointer;color:var(--dk);transition:all .25s}.bo:hover{background:var(--dk);color:var(--cr)}

/* Calendar */
.cal-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:16px;max-width:1200px;margin:0 auto}
.cal-card{background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,.05);overflow:hidden}
.cal-hd{padding:16px 20px;border-bottom:1px solid rgba(0,0,0,.04);display:flex;justify-content:space-between;align-items:center}
.cal-hd h3{font-size:15px;font-weight:800}.cal-hd span{font-size:11px;color:var(--wm)}
.cal-bd{padding:14px 20px}
.cal-rm{display:flex;align-items:center;padding:9px 10px;border-radius:8px;margin-bottom:3px;border:1px solid rgba(0,0,0,.03);gap:8px;transition:all .15s}
.cal-rm-l{flex:1;min-width:0}.cal-rm-n{font-size:12px;font-weight:700}.cal-rm-d{font-size:10px;color:var(--wm)}
.cal-rm-st{font-size:8px;font-weight:700;padding:3px 8px;border-radius:100px;white-space:nowrap;flex-shrink:0}
.cal-avail{padding:9px 10px;border-radius:8px;margin-bottom:3px;border:2px solid rgba(45,106,63,.2);background:#dff0e4;display:flex;align-items:center;gap:8px}
.cal-avail .cal-rm-n{color:var(--gn);font-size:13px;font-weight:800}
.cal-avail .cal-rm-d{color:#5a8a68}
.cal-avail-btn{padding:6px 16px;border-radius:6px;background:var(--gn);color:#fff;border:none;font-family:var(--fb);font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap}
.cal-soon{cursor:pointer}.cal-soon:hover{border-color:rgba(154,116,34,.3);background:rgba(254,243,218,.15)}
.cal-occ{opacity:.6}
.cal-days-hd{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:3px}
.cal-day-lb{font-size:8px;font-weight:700;color:#bbb;text-align:center;text-transform:uppercase;padding:3px 0}
.cal-days{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.cal-dy{aspect-ratio:1;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600}
.cal-legend{display:flex;gap:16px;justify-content:center;margin-top:20px;flex-wrap:wrap}
.cal-leg-i{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:500}
.cal-leg-d{width:12px;height:12px;border-radius:3px}

/* Tabs */
.tabs{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;margin-bottom:28px}
.tab{padding:8px 18px;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(0,0,0,.08);background:#fff;color:var(--wm);font-family:var(--fb);transition:all .15s}
.tab:hover{border-color:var(--ac)}.tab.on{background:var(--dk);color:var(--cr);border-color:var(--dk)}

/* Map POIs */
.map-c{border-radius:18px;overflow:hidden;border:1px solid rgba(0,0,0,.05)}.map-if{width:100%;height:420px;border:none}
.map-live{height:420px}
.poi-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;margin-top:20px}
.poi{display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(255,255,255,.07);border-radius:10px;border:1px solid rgba(255,255,255,.12);text-decoration:none;color:inherit;transition:all .2s}.poi:hover{border-color:var(--ac);transform:translateY(-2px);background:rgba(255,255,255,.12)}
.poi-ic{font-size:20px;width:40px;height:40px;border-radius:8px;background:rgba(212,168,83,.18);border:1px solid rgba(212,168,83,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.poi-inf{flex:1}.poi-nm{font-size:12px;font-weight:700;color:var(--cr)}.poi-ct{font-size:10px;color:rgba(255,255,255,.55)}
.poi-lk{font-size:8px;color:var(--ac);font-weight:600;margin-top:1px}
.poi-dr{font-size:12px;font-weight:800;color:var(--ac);white-space:nowrap}

/* Compare filters */
.flt-tog{display:flex;justify-content:center;margin-bottom:16px}
.flt-btn{padding:10px 24px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;border:2px solid rgba(0,0,0,.06);background:#fff;color:var(--dk);font-family:var(--fb);display:flex;align-items:center;gap:6px;transition:all .15s}
.flt-btn:hover{border-color:var(--ac)}.flt-btn.on{border-color:var(--ac);background:rgba(212,168,83,.04)}
.flt-cnt{background:var(--ac);color:var(--dk);font-size:9px;font-weight:800;padding:1px 7px;border-radius:100px}
.flt-pan{overflow:hidden;transition:all .3s;background:#fff;border-radius:14px;border:1px solid rgba(0,0,0,.05);margin-bottom:20px}
.flt-pan.open{padding:16px 20px}.flt-pan.closed{max-height:0;border:none;padding:0;margin:0}
.flt-row{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:8px}.flt-row:last-child{margin-bottom:0}
.flt-lb{font-size:9px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;min-width:80px}
.fp{padding:6px 14px;border-radius:100px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid rgba(0,0,0,.07);background:#fff;color:var(--wm);font-family:var(--fb);transition:all .12s}
.fp:hover{border-color:var(--ac)}.fp.on{background:var(--dk);color:var(--cr);border-color:var(--dk)}
.flt-clr{padding:6px 14px;border-radius:100px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid rgba(196,92,74,.15);background:rgba(196,92,74,.04);color:var(--rd);font-family:var(--fb)}

/* Compare table */
.cw{overflow-x:auto}.cmp{width:100%;border-collapse:separate;border-spacing:0}
.cmp th{background:var(--dk);color:var(--cr);padding:12px 12px;font-size:9px;font-weight:700;text-align:center;white-space:nowrap;letter-spacing:.5px;text-transform:uppercase}
.cmp th:first-child{text-align:left;position:sticky;left:0;z-index:2;border-radius:10px 0 0 0;min-width:140px}.cmp th:last-child{border-radius:0 10px 0 0}
.cmp-cat td{background:rgba(212,168,83,.05);font-weight:800;font-size:9px;color:var(--wm);letter-spacing:1px;text-transform:uppercase;padding:8px 12px;text-align:center}
.cmp-cat td:first-child{text-align:left;position:sticky;left:0;z-index:1;background:rgba(212,168,83,.05)}
.cmp td{padding:10px 12px;font-size:11px;border-bottom:1px solid rgba(0,0,0,.03);color:var(--dk);background:#fff;text-align:center;vertical-align:middle}
.cmp td:first-child{text-align:left;position:sticky;left:0;z-index:1;background:#fff;font-weight:600}
.cmp tr:hover td{background:rgba(212,168,83,.02)}.cmp tr:hover td:first-child{background:rgba(212,168,83,.02)}
.ck{color:var(--gn);font-weight:800;font-size:14px}.cx{color:#ddd;font-size:13px}
.cv{font-weight:700;font-size:11px}
.cprice{font-family:var(--fd);font-size:15px}.cprice small{font-family:var(--fb);font-size:9px;opacity:.4}
.cavail{font-size:8px;font-weight:700;padding:3px 8px;border-radius:100px;display:inline-block}

/* Savings calc */
.calc-grid{max-width:860px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}
.calc-card{background:#fff;border-radius:18px;padding:24px}
.calc-hd{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.calc-ic{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.calc-total{border-top:2px solid rgba(0,0,0,.05);padding-top:14px;margin-top:8px;display:flex;justify-content:space-between;align-items:center}
.calc-save{border-radius:18px;padding:24px;margin-top:14px;text-align:center;color:#fff}

/* Amenities */
.agrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;max-width:1060px;margin:0 auto}
.acard{background:rgba(255,255,255,.04);border:1px solid rgba(196,168,130,.08);border-radius:14px;padding:28px;transition:all .2s}
.acard:hover{background:rgba(196,168,130,.04);transform:translateY(-2px)}
.aic{font-size:24px;margin-bottom:12px}.at{font-family:var(--fd);font-size:18px;color:var(--cr);margin-bottom:6px}
.adsc{font-size:13px;color:var(--mt);line-height:1.6;font-weight:300}

/* Steps */
.steps-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px;max-width:1060px;margin:0 auto}
.step-c{background:#fff;border-radius:14px;padding:24px;border:1px solid rgba(0,0,0,.04)}
.step-top{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.step-ic{width:42px;height:42px;border-radius:10px;background:rgba(212,168,83,.08);display:flex;align-items:center;justify-content:center;font-size:20px}
.step-num{font-family:var(--fd);font-size:28px;color:rgba(212,168,83,.18)}
.step-c h3{font-size:15px;font-weight:800;margin-bottom:6px}.step-c p{font-size:12px;line-height:1.7;color:var(--wm)}

/* Personas */
.per-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;max-width:1060px;margin:0 auto}
.per-c{display:flex;gap:14px;padding:18px;background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.04)}
.per-ic{width:42px;height:42px;border-radius:10px;background:var(--cr);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.per-c h3{font-size:14px;font-weight:800;margin-bottom:3px}.per-c p{font-size:11px;line-height:1.6;color:var(--wm)}

/* House Standards */
.hs-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;max-width:1000px;margin:0 auto}
.hs-c{display:flex;gap:12px;padding:18px;background:rgba(255,255,255,.04);border:1px solid rgba(196,168,130,.08);border-radius:12px}
.hs-ic{width:40px;height:40px;border-radius:8px;background:rgba(212,168,83,.08);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.hs-c h4{font-size:13px;font-weight:700;color:var(--cr);margin-bottom:3px}.hs-c p{font-size:11px;color:var(--mt);line-height:1.5}

/* Reviews */
.rev-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;max-width:1060px;margin:0 auto}
.rev-c{background:var(--cd);border-radius:14px;padding:24px;border:1px solid rgba(196,168,130,.08);display:flex;flex-direction:column}
.rev-stars{color:var(--ac);font-size:14px;letter-spacing:2px;margin-bottom:12px}
.rev-txt{font-size:13px;line-height:1.8;color:var(--cr);flex:1;margin-bottom:16px}
.rev-ft{border-top:1px solid rgba(196,168,130,.08);padding-top:12px;display:flex;justify-content:space-between;align-items:center}
.rev-nm{font-size:13px;font-weight:700;color:var(--cr)}.rev-rl{font-size:10px;color:var(--mt)}
.rev-prop{font-size:9px;color:var(--mt);background:rgba(196,168,130,.08);padding:3px 8px;border-radius:100px}

/* FAQ */
.faq-list{max-width:740px;margin:0 auto}
.faq-item{background:#fff;border-radius:10px;margin-bottom:6px;border:1px solid rgba(0,0,0,.04);overflow:hidden;transition:border-color .2s}
.faq-item.open{border-color:rgba(212,168,83,.25)}
.faq-q{padding:16px 20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:14px}
.faq-q span{font-size:13px;font-weight:700}
.faq-q .faq-plus{font-size:16px;color:#ccc;transition:all .2s;flex-shrink:0}
.faq-item.open .faq-plus{color:var(--ac);transform:rotate(45deg)}
.faq-a{padding:0 20px 16px;font-size:12px;line-height:1.8;color:var(--wm);animation:fadeIn .2s}

/* Screening */
.scr-sec{background:#1a1714;padding:100px 40px}
.scr-wrap{max-width:600px;margin:0 auto}
.scr-card{background:#fff;border-radius:18px;padding:40px}
.scr-hd{text-align:center;margin-bottom:32px}.scr-hd h2{font-family:var(--fd);font-size:clamp(24px,3vw,36px);margin-bottom:10px}.scr-hd p{font-size:14px;color:var(--wm);line-height:1.6}
.scr-prog{display:flex;gap:5px;margin-bottom:28px}
.scr-dot{flex:1;height:3px;border-radius:3px;background:rgba(0,0,0,.06);transition:all .3s}.scr-dot.done{background:var(--gn)}.scr-dot.act{background:var(--ac)}
.scr-qn{font-size:11px;color:var(--wm);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
.scr-qt{font-size:16px;font-weight:700;line-height:1.5;margin-bottom:20px}
.scr-btns{display:flex;gap:10px}
.scr-btn{flex:1;padding:14px;border-radius:10px;border:2px solid rgba(0,0,0,.08);background:#fff;font-family:var(--fb);font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
.scr-btn.y:hover{border-color:var(--gn);background:rgba(45,106,63,.05)}
.scr-btn.n:hover{border-color:var(--rd);background:rgba(168,58,46,.04)}
.scr-pass{text-align:center}.scr-pass-ic{width:64px;height:64px;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px}
.scr-pass h3{font-family:var(--fd);font-size:24px;margin-bottom:6px}.scr-pass p{font-size:13px;color:var(--wm);line-height:1.7;margin-bottom:20px}
.sform{display:flex;flex-direction:column;gap:12px}
.sform-row{display:flex;gap:10px}
.sinp,.ssel,.stxt{width:100%;padding:12px 16px;border-radius:8px;border:1px solid rgba(0,0,0,.1);font-family:var(--fb);font-size:13px;outline:none;background:#faf9f7}
.sinp:focus,.ssel:focus,.stxt:focus{border-color:var(--ac)}.stxt{resize:vertical;min-height:70px}
.scr-sub{width:100%;padding:14px;border-radius:8px;background:var(--ac);color:var(--dk);border:none;font-family:var(--fb);font-size:14px;font-weight:700;cursor:pointer}

/* Chat */
.ctog{position:fixed;bottom:24px;right:24px;z-index:150;width:54px;height:54px;border-radius:50%;background:var(--ac);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(212,168,83,.4);font-size:22px;transition:all .2s;z-index:95}
.ctog:hover{transform:scale(1.06)}.ctog.op{background:var(--cd)}
.cwin{position:fixed;bottom:90px;right:24px;z-index:95;width:380px;max-height:520px;background:#fff;border-radius:18px;box-shadow:0 16px 48px rgba(0,0,0,.18);display:flex;flex-direction:column;animation:chatOpen .25s;overflow:hidden;border:1px solid rgba(0,0,0,.06)}
.chdr{background:var(--cd);padding:16px 20px;display:flex;align-items:center;gap:10px}
.cav{width:36px;height:36px;border-radius:50%;background:var(--ac);display:flex;align-items:center;justify-content:center;font-size:18px}
.chi h4{color:var(--cr);font-size:14px;font-weight:600}.chi p{color:var(--mt);font-size:11px;opacity:.7}
.cmsg{flex:1;overflow-y:auto;padding:16px;min-height:260px;max-height:320px;display:flex;flex-direction:column;gap:10px}
.cm{max-width:82%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;animation:slideIn .25s;white-space:pre-wrap}
.cm.bot{background:var(--cr);color:var(--dk);border-bottom-left-radius:3px;align-self:flex-start}
.cm.usr{background:var(--cd);color:var(--cr);border-bottom-right-radius:3px;align-self:flex-end}
.ctyp{display:flex;gap:3px;padding:10px 14px;background:var(--cr);border-radius:14px;border-bottom-left-radius:3px;align-self:flex-start;max-width:50px}
.cdot{width:5px;height:5px;border-radius:50%;background:var(--wm);opacity:.4;animation:dotBounce 1.4s infinite}.cdot:nth-child(2){animation-delay:.2s}.cdot:nth-child(3){animation-delay:.4s}
.cirow{padding:12px;border-top:1px solid rgba(0,0,0,.04);display:flex;gap:6px}
.cinp{flex:1;padding:10px 14px;border-radius:10px;border:1px solid rgba(0,0,0,.08);font-family:var(--fb);font-size:13px;outline:none;background:#faf9f7}.cinp:focus{border-color:var(--ac)}
.csend{width:40px;height:40px;border-radius:10px;background:var(--ac);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px}.csend:disabled{opacity:.4;cursor:not-allowed}
.csugs{display:flex;flex-wrap:wrap;gap:4px;padding:0 16px 12px}
.csug{padding:5px 12px;border-radius:100px;font-size:10px;background:rgba(212,168,83,.08);color:var(--wm);border:1px solid rgba(212,168,83,.2);cursor:pointer;font-family:var(--fb)}.csug:hover{background:rgba(212,168,83,.15)}

/* Sticky bar */
.stk{position:fixed;bottom:0;left:0;right:0;z-index:90;background:rgba(26,23,20,.97);backdrop-filter:blur(12px);border-top:1px solid rgba(212,168,83,.15);padding:10px 28px;display:flex;align-items:center;justify-content:center;gap:16px;transform:translateY(100%);transition:transform .3s;box-shadow:0 -4px 16px rgba(0,0,0,.12)}
.stk.vis{transform:translateY(0)}
.stk-txt{font-size:13px;color:var(--cr)}.stk-txt strong{color:var(--ac)}
.stk-btn{padding:8px 24px;border-radius:7px;background:var(--ac);color:var(--dk);border:none;font-family:var(--fb);font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}
.stk-x{background:none;border:none;color:rgba(245,240,232,.3);font-size:16px;cursor:pointer;padding:2px 6px}

/* Footer */
.ftr{background:var(--dk);padding:40px;text-align:center}
.ftr p{color:rgba(196,168,130,.3);font-size:12px}

/* Range inputs */
input[type=range]{width:100%;height:5px;border-radius:3px;-webkit-appearance:none;outline:none;cursor:pointer}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--ac);cursor:pointer;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.2)}

/* ─── Mobile Nav Toggle ─── */
.nav-tog{display:none;background:none;border:none;color:var(--cr);font-size:24px;cursor:pointer;padding:8px}
.mob-menu{display:none;position:fixed;top:68px;left:0;right:0;background:rgba(26,23,20,.98);backdrop-filter:blur(16px);padding:20px 24px;flex-direction:column;gap:16px;z-index:99;border-bottom:1px solid rgba(196,168,130,.1);animation:fadeIn .2s}
.mob-menu.open{display:flex}
.mob-menu a{color:var(--cr);text-decoration:none;font-size:16px;font-weight:500;padding:12px 0;border-bottom:1px solid rgba(196,168,130,.08);cursor:pointer}
.mob-menu a:last-child{border-bottom:none}

/* ─── Tablet (max 1024px) ─── */
@media(max-width:1024px){
.calc-grid{grid-template-columns:1fr}
.mgal{grid-template-columns:1fr;height:260px}.mside{display:none}
.cmp-w{max-width:100%}
}

/* ─── Mobile (max 768px) ─── */
@media(max-width:768px){
/* Nav */
.nav{padding:0 16px;height:60px}.nlinks{display:none}.nav-tog{display:block}
.nlogo{font-size:18px}

/* Hero */
.hero{padding:100px 16px 60px;min-height:auto}
.hbadge{font-size:10px;padding:6px 14px;margin-bottom:20px}
.hero h1{font-size:32px;margin-bottom:14px}
.hero>div>p{font-size:14px;margin-bottom:28px;line-height:1.6}
.hbtns{flex-direction:column;gap:10px;align-items:center}
.bp,.bs{width:100%;max-width:300px;text-align:center;padding:14px 24px}
.hstats{gap:24px;flex-wrap:wrap;margin-top:36px;padding-top:28px}
.hst-n{font-size:26px}.hst-l{font-size:9px}

/* Proof strip */
.proof{padding:20px 16px}.proof-in{gap:16px}.proof-n{font-size:22px}.proof-i{min-width:80px}

/* Sections */
.sec,.sec-dk,.sec-cr{padding:50px 16px}
.sh{margin-bottom:36px}.sl{font-size:10px}.st{font-size:26px}.ss{font-size:13px}
.sec-inner{max-width:100%}

/* Property cards */
.pgrid{grid-template-columns:1fr;gap:16px}.pimg{height:180px}
.pnm{font-size:17px}.pad{font-size:11px}
.pftr{flex-direction:column;gap:8px;align-items:flex-start}

/* Modal */
.mo{padding:0;align-items:flex-end}
.modal{margin:0;border-radius:18px 18px 0 0;max-height:92vh;overflow-y:auto}
.mx{top:12px;right:12px;width:36px;height:36px;font-size:16px}
.mgal{grid-template-columns:1fr;height:260px}.mside{display:none}
.mbody{padding:20px 16px}
.mtp{flex-direction:column;gap:16px}
.mib{min-width:80px;padding:10px 14px}.mib .v{font-size:22px}
.mdesc{font-size:13px}
.istrip{gap:6px}.ii{font-size:10px;padding:5px 10px}
.rgrid{grid-template-columns:1fr;gap:8px}
.rc{flex-direction:column;gap:10px;padding:14px}.rprice{text-align:left;font-size:20px}
.rn{font-size:13px}.rd{font-size:10px}

/* Compare / Filters */
.flt-bar{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:8px;gap:6px}
.fp{white-space:nowrap;padding:8px 14px;font-size:11px}
.flt-lb{display:none}
.cmp-w{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -16px;padding:0 16px}
.cmp{font-size:11px;min-width:600px}
.cmp th,.cmp td{padding:8px 10px;font-size:10px}
.cmp th:first-child{min-width:100px}

/* Amenities */
.agrid{grid-template-columns:1fr;gap:12px}
.ac{padding:20px}
.ac h3{font-size:14px}.ac p{font-size:12px}

/* Calendar */
.cal-grid{grid-template-columns:1fr;gap:12px}
.cal-hd{font-size:16px}.cal-nav{gap:8px}
.cal-dy{width:32px;height:32px;font-size:11px}

/* Map */
.map-c{border-radius:12px}
.map-live{height:280px}
.poi-g{grid-template-columns:1fr;gap:8px}
.poi{padding:10px 12px}
.poi-ic{width:34px;height:34px;font-size:17px}
.poi-nm{font-size:11px}.poi-ct{font-size:9px}.poi-dr{font-size:11px}
.tabs{flex-wrap:wrap;gap:4px}
.tab{padding:6px 12px;font-size:10px}

/* Savings */
.calc-grid{grid-template-columns:1fr;gap:16px}
.calc-card{padding:20px}
.calc-res{flex-direction:column;gap:16px}
.sav-n{font-size:36px}

/* Steps */
.steps-g{grid-template-columns:1fr;gap:14px}

/* Persuasion */
.per-g{grid-template-columns:1fr;gap:10px}

/* House Standards */
.hs-g{grid-template-columns:1fr 1fr;gap:8px}
.hs-c{padding:14px;font-size:11px}

/* Reviews */
.rev-g{grid-template-columns:1fr;gap:12px}
.rev-c{padding:16px}

/* FAQ */
.faq-list{max-width:100%}
.faq-q{font-size:13px;padding:14px 16px}
.faq-a{padding:0 16px 14px;font-size:12px}

/* Screening */
.scr-sec{padding:50px 16px}
.scr-card{padding:24px 18px;border-radius:16px}
.scr-qt{font-size:15px}
.scr-btns{flex-direction:column;gap:8px}
.scr-btn{padding:14px;font-size:14px;width:100%}
.sform-row{flex-direction:column;gap:0}
.sinp,.ssel,.stxt{font-size:14px;padding:12px 14px}
.scr-sub{font-size:14px;padding:14px}

/* Chat */
.cwin{right:10px;left:10px;width:auto;bottom:80px;max-height:70vh}
.ctog{width:52px;height:52px;font-size:20px;bottom:16px;right:16px}
.cinp{font-size:14px}

/* Sticky bar */
.stk{padding:10px 14px;gap:8px;flex-wrap:nowrap}
.stk-txt{font-size:11px;white-space:nowrap}
.stk-btn{font-size:11px;padding:8px 16px;white-space:nowrap}
.stk-x{width:28px;height:28px;font-size:12px}

/* Footer */
.ftr{padding:24px 16px}.ftr p{font-size:10px}
}

/* ─── Small phones (max 380px) ─── */
@media(max-width:380px){
.hero h1{font-size:26px}
.hst-n{font-size:22px}
.hs-g{grid-template-columns:1fr}
.scr-card{padding:20px 14px}
.proof-n{font-size:20px}
}
`;

// ─── Components ─────────────────────────────────────────────────────
function PropertyModal({p,onClose,setLightbox,setLbIdx}){
  if(!p)return null;const minP=safeMin(allRoomsP(p).map(r=>r.rent));
  const goApply=()=>{onClose();setTimeout(()=>document.getElementById("apply")?.scrollIntoView({behavior:"smooth"}),100);};
  return(<div className="mo" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <button className="mx" onClick={onClose}>✕</button>
    <div className="mgal" style={{cursor:p.imgs&&p.imgs.length>0?"pointer":"default",position:"relative"}} onClick={()=>{if(p.imgs&&p.imgs.length>0){setLightbox(p.imgs);setLbIdx(0);}}}>
      {p.imgs&&p.imgs.length>0
        ?<img src={p.imgs[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"contain",display:"block",background:"#1a1714"}}/>
        :<div style={{width:"100%",height:"100%",background:"#1a1714",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}><span style={{fontSize:48}}>🐻</span><span style={{fontSize:12,color:"#c4a882"}}>Photos coming soon</span></div>
      }
      {p.imgs&&p.imgs.length>1&&<div className="mside">
        {p.imgs.slice(1,3).map((img,i)=><img key={i} src={img} alt="" style={{width:"100%",height:"100%",objectFit:"contain",cursor:"pointer",background:"#1a1714"}} onClick={e=>{e.stopPropagation();setLightbox(p.imgs);setLbIdx(i+1);}}/>)}
      </div>}
      {p.imgs&&p.imgs.length>3&&<div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:4,zIndex:2}}>+{p.imgs.length-3} more</div>}
    </div>
    <div className="mbody">
      <div className="mtp"><div><div className="ptags"><span className={`tag ${p.status==="Available"?"t-av":"t-cs"}`}>{p.status}</span><span className={`tag ${p.typeTag==="SFH"?"t-sfh":"t-th"}`}>{p.type}</span></div><h2 style={{marginTop:8}}>{p.name}</h2><p className="maddr">{p.address}</p></div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><div className="mib"><div className="l">Rooms</div><div className="v">{allRoomsP(p).length}</div></div><div className="mib"><div className="l">Baths</div><div className="v">{p.baths}</div></div><div className="mib"><div className="l">From</div><div className="v">${minP}<small>/mo</small></div></div></div></div>
      <p className="mdesc">{p.desc}</p>
      <div className="istrip"><div className="ii">📶 WiFi</div><div className="ii">🛋️ Furnished</div><div className="ii">🅿️ Parking</div><div className="ii">🧹 {p.clean} Cleaning</div>{p.utils==="allIncluded"?<div className="ii">💡 All Utilities</div>:<div className="ii pt">💡 First $100 Covered · Overage Split</div>}</div>
      <h3 className="rh">Rooms & Pricing</h3>
      {(p.units&&p.units.length>1)?p.units.map(u=>(
        <div key={u.id} style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:800,color:"var(--ac)",textTransform:"uppercase",letterSpacing:.8,marginBottom:8,padding:"4px 10px",background:"rgba(212,168,83,.08)",borderRadius:6,display:"inline-block"}}>{u.name}</div>
          <div className="rgrid">{(u.rooms||[]).map(r=>(
            <div key={r.id} className="rc"><div className="rm-m"><div className="rn">{r.name}<span className={`rbt ${r.pb?"rbt-p":"rbt-s"}`}>{r.pb?"Private Bath":"Shared Bath"}</span></div><div className="rd">{r.sqft?<span>{r.sqft} sqft</span>:null}<span>{r.bed} bed</span></div><div className="rfs">{(r.feat||[]).map((f,i)=><span key={i} className="rf">{f}</span>)}</div></div><div className="rprice">${r.rent}<small>/mo</small></div></div>
          ))}</div>
        </div>
      )):(
        <div className="rgrid">{p.rooms.map(r=>(
          <div key={r.id} className="rc"><div className="rm-m">
              <div className="rn">{r.name}<span className={`rbt ${r.pb?"rbt-p":"rbt-s"}`}>{r.pb?"Private Bath":"Shared Bath"}</span></div>
              <div className="rd">
                {r.sqft?<span>{r.sqft} sqft</span>:null}
                {r.bed&&<span>{r.bed} bed</span>}
                {r.tv&&r.tv!=="None"&&<span>{r.tv} TV</span>}
                {r.furnished!==false&&<span>✓ Furnished</span>}
              </div>
              {(r.feat||[]).length>0&&<div className="rfs">{(r.feat||[]).map((f,i)=><span key={i} className="rf">{f}</span>)}</div>}
            </div><div className="rprice">${r.rent}<small>/mo</small></div></div>
        ))}</div>
      )}
      <h4 className="mst">3D Tour</h4><div className="phbox"><div style={{fontSize:40}}>🏠</div><h4>Coming Soon</h4><p>Insta360 walkthrough will be embedded here</p></div>
      <div className="mcta"><button className="bp" onClick={goApply}>Apply for a Room</button><button className="bo" onClick={goApply}>Schedule a Tour</button></div>
    </div></div></div>);
}

// ─── Interactive Map ────────────────────────────────────────────────
function MapSection({mapCat,setMapCat,mapCats,mapFiltered,nav,properties}){
  const PROPS=properties||[];
  const mapRef=useRef(null);const mapInst=useRef(null);const markersRef=useRef([]);
  const[highlight,setHighlight]=useState(null);
  const catColors={"Redstone Arsenal":"#b8956a",Entertainment:"#c4a882","Grocery & Retail":"#a8b882","Food & Drink":"#c4a070",Education:"#82a8a8",Healthcare:"#82a88c",property:"#d4a853"};

  // Build markers — takes current props and cat directly, no stale refs
  const buildMarkers=useCallback((curProps,curCat)=>{
    const L=window.L;const map=mapInst.current;if(!L||!map)return;
    markersRef.current.forEach(m=>m.remove());markersRef.current=[];
    curProps.filter(p=>validCoord(p.lat,p.lng)).forEach(p=>{
      const icon=L.divIcon({className:"",html:`<div style="width:34px;height:34px;background:#d4a853;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;font-size:17px;cursor:pointer">🐻</div>`,iconSize:[34,34],iconAnchor:[17,34],popupAnchor:[0,-34]});
      const vacRooms=allRoomsP(p).filter(r=>r.st==="vacant").length;const minR=safeMin(allRoomsP(p).map(r=>r.rent));
      const m=L.marker([p.lat,p.lng],{icon}).addTo(map).bindPopup(`<div style="font-family:sans-serif;min-width:180px;padding:4px 2px"><strong style="font-size:14px;color:#1a1714">${p.name}</strong><div style="color:#666;font-size:12px;margin:2px 0">${p.address}</div><div style="color:#d4a853;font-weight:700;font-size:13px;margin-top:4px">${vacRooms} room${vacRooms!==1?"s":""} available · From $${minR}/mo</div></div>`);
      markersRef.current.push(m);
    });
    const pins=curCat==="all"?POIS:POIS.filter(p=>p.cat===curCat);
    pins.forEach(p=>{
      const color=catColors[p.cat]||"#666";
      const icon=L.divIcon({className:"",html:`<div style="width:28px;height:28px;background:${color};border-radius:50%;border:2px solid #fff;box-shadow:0 2px 7px rgba(0,0,0,.22);display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer">${p.icon}</div>`,iconSize:[28,28],iconAnchor:[14,28],popupAnchor:[0,-28]});
      const m=L.marker([p.lat,p.lng],{icon}).addTo(map).bindPopup(`<div style="font-family:sans-serif;padding:4px 2px;min-width:160px"><strong style="font-size:13px">${p.name}</strong><div style="color:#666;font-size:11px;margin-top:2px">${p.desc}</div><div style="color:#d4a853;font-size:11px;font-weight:600;margin-top:3px">🚗 ${p.drive}</div></div>`);
      markersRef.current.push(m);
    });
  },[]);

  // Init map once
  useEffect(()=>{
    if(mapInst.current||!mapRef.current)return;
    const link=document.createElement("link");link.rel="stylesheet";link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(link);
    const script=document.createElement("script");script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload=()=>{
      const L=window.L;
      const map=L.map(mapRef.current,{scrollWheelZoom:false,zoomControl:true}).setView([34.723,-86.591],12);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",{
        attribution:'© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains:"abcd",maxZoom:20
      }).addTo(map);
      mapInst.current=map;
      buildMarkers(PROPS,mapCat);
    };
    document.head.appendChild(script);
    return()=>{if(mapInst.current){mapInst.current.remove();mapInst.current=null;}};
  },[]);

  // Rebuild whenever props or filter changes — pass current values directly
  useEffect(()=>{buildMarkers(PROPS,mapCat);},[PROPS,mapCat,buildMarkers]);

  const scrollToPin=(p)=>{
    // Guard: skip if no valid coords
    if(!validCoord(p.lat,p.lng))return;
    try{
      if(mapInst.current){
        mapInst.current.setView([p.lat,p.lng],14,{animate:true});
        const marker=markersRef.current.find(m=>{const ll=m.getLatLng();return Math.abs(ll.lat-p.lat)<0.001&&Math.abs(ll.lng-p.lng)<0.001;});
        if(marker)marker.openPopup();
      }
    }catch(e){console.warn("Map scroll error:",e);}
    setHighlight(p.name);setTimeout(()=>setHighlight(null),2000);
  };

  return(<>
    <div ref={mapRef} className="map-live" style={{borderRadius:18,overflow:"hidden",border:"1px solid rgba(255,255,255,.06)",marginBottom:20}}/>
    <div className="tabs" style={{marginTop:0,marginBottom:16}}><button className={`tab ${mapCat==="all"?"on":""}`} onClick={()=>setMapCat("all")}>All</button>{mapCats.map(c=><button key={c} className={`tab ${mapCat===c?"on":""}`} onClick={()=>setMapCat(c)}>{c}</button>)}</div>
    {/* Property pins */}
    <div className="poi-g">
      {PROPS.map(p=>{const vac=allRoomsP(p).filter(r=>r.st==="vacant").length;const minR=safeMin(allRoomsP(p).map(r=>r.rent));const hasPin=validCoord(p.lat,p.lng);return(
        <div key={p.id} className="poi" style={{borderColor:"rgba(212,168,83,.15)",background:highlight===p.name?"rgba(212,168,83,.18)":"rgba(212,168,83,.10)",border:"1px solid rgba(212,168,83,.3)",cursor:hasPin?"pointer":"default",transition:"all .2s",transform:highlight===p.name?"scale(1.02)":"none",opacity:hasPin?1:0.75}} onClick={hasPin?()=>scrollToPin(p):undefined} onMouseEnter={hasPin?()=>scrollToPin(p):undefined}><div className="poi-ic">🐻</div><div className="poi-inf"><div className="poi-nm" style={{color:"var(--ac)"}}>{p.name}</div><div className="poi-ct">{p.address} · {vac} vacant · From ${minR}/mo</div></div><div className="poi-dr" style={{color:"var(--ac)"}}>📍</div></div>);})}
      {/* POI list */}
      {mapFiltered.map((p,i)=><a key={i} className="poi" href={p.url} target="_blank" rel="noopener noreferrer" style={{cursor:"pointer",transition:"all .2s",transform:highlight===p.name?"scale(1.02)":"none",background:highlight===p.name?"rgba(255,255,255,.08)":"rgba(255,255,255,.05)"}} onMouseEnter={()=>scrollToPin(p)}><div className="poi-ic">{p.icon}</div><div className="poi-inf"><div className="poi-nm">{p.name}</div><div className="poi-ct">{p.desc}</div><div className="poi-lk">Visit website ↗</div></div><div className="poi-dr">🚗 {p.drive}</div></a>)}
    </div>
  </>);
}

function Chat(){
  const[open,setOpen]=useState(false);const[msgs,setMsgs]=useState([{r:"bot",t:"Hey! 👋 Ask me about rooms, pricing, policies, or anything!"}]);
  const[inp,setInp]=useState("");const[loading,setLoading]=useState(false);const[showS,setShowS]=useState(true);const ref=useRef(null);
  const sugs=["What's included?","Utility policy?","Private bath rooms?","Pet / smoking policy?"];
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs,loading]);
  const send=useCallback(async(txt)=>{if(!txt.trim()||loading)return;const m=txt.trim();setInp("");setShowS(false);setMsgs(p=>[...p,{r:"usr",t:m}]);setLoading(true);
    try{const h=msgs.slice(1).map(x=>({role:x.r==="bot"?"assistant":"user",content:x.t}));
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:m,history:h})});
      const d=await res.json();setMsgs(p=>[...p,{r:"bot",t:d.reply||d.content?.map(c=>c.text||"").join("")||d.message||"Sorry, try again!"}]);
    }catch{setMsgs(p=>[...p,{r:"bot",t:`Trouble connecting. Reach us at ${S_INFO.email}!`}]);}setLoading(false);},[msgs,loading]);
  return(<>
    <button className={`ctog ${open?"op":""}`} onClick={()=>setOpen(!open)}>{open?"✕":"💬"}</button>
    {open&&<div className="cwin"><div className="chdr"><div className="cav">🐻</div><div className="chi"><h4>Black Bear Assistant</h4><p>Ask me anything</p></div></div>
      <div className="cmsg" ref={ref}>{msgs.map((m,i)=><div key={i} className={`cm ${m.r==="bot"?"bot":"usr"}`}>{m.t}</div>)}{loading&&<div className="ctyp"><div className="cdot"/><div className="cdot"/><div className="cdot"/></div>}</div>
      {showS&&<div className="csugs">{sugs.map((s,i)=><button key={i} className="csug" onClick={()=>send(s)}>{s}</button>)}</div>}
      <div className="cirow"><input className="cinp" placeholder="Ask about rooms..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(inp)}/><button className="csend" onClick={()=>send(inp)} disabled={loading||!inp.trim()}>↑</button></div>
    </div>}</>);
}

function Screening({properties}){
  const PROPS=properties||[];
  const[step,setStep]=useState(0);const[form,setForm]=useState({name:"",email:"",phone:"",property:"",moveIn:"",moveInMonth:"",moveInDay:"",moveInYear:"",source:"",sourceOther:"",reason:""});
  const[submitting,setSubmitting]=useState(false);const[subError,setSubError]=useState("");const[touched,setTouched]=useState({});
  const[qs,setQs]=useState(SCREEN_QS);
  useEffect(()=>{supaGet("hq-screen-qs").then(d=>{if(d&&Array.isArray(d)&&d.length>0)setQs(d);});},[]);
  const PASS=qs.length,FAIL=qs.length+1,FORM=qs.length+2,DONE=qs.length+3;
  const answer=v=>{if(v!==qs[step].pass){setStep(FAIL);return;}if(step<qs.length-1)setStep(step+1);else setStep(PASS);};
  // Phone auto-format: (256) 555-1234
  const fmtPhone=v=>{const d=v.replace(/\D/g,"").slice(0,10);if(d.length===0)return"";if(d.length<=3)return`(${d}`;if(d.length<=6)return`(${d.slice(0,3)}) ${d.slice(3)}`;return`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;};
  const isValidEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValidPhone=p=>p.replace(/\D/g,"").length===10;
  const errs={};
  if(touched.name&&!form.name.trim())errs.name="Full name is required";
  if(touched.email&&!form.email)errs.email="Email is required";
  else if(touched.email&&!isValidEmail(form.email))errs.email="Enter a valid email address";
  if(touched.phone&&!form.phone)errs.phone="Phone is required";
  else if(touched.phone&&!isValidPhone(form.phone))errs.phone="Enter a valid 10-digit phone number";
  if(touched.property&&!form.property)errs.property="Select a property";
  if(touched.moveIn&&!form.moveIn)errs.moveIn="Select a preferred move-in date";
  if(touched.source&&!form.source)errs.source="Tell us how you heard about us";
  if(touched.sourceOther&&form.source==="Other"&&!form.sourceOther?.trim())errs.sourceOther="Please tell us how you heard about us";
  if(touched.reason&&!form.reason)errs.reason="This field is required";
  else if(touched.reason&&form.reason.length<10)errs.reason="Please provide at least 10 characters";
  const canSubmit=form.name.trim()&&isValidEmail(form.email)&&isValidPhone(form.phone)&&form.property&&form.moveIn&&form.source&&(form.source!=="Other"||form.sourceOther?.trim())&&form.reason.length>=10;
  const touchAll=()=>setTouched({name:true,email:true,phone:true,property:true,moveIn:true,source:true,sourceOther:true,reason:true});
  const submitApp=async()=>{
    touchAll();if(!canSubmit){setSubError("Please complete all required fields.");return;}
    setSubmitting(true);setSubError("");
    try{
      const submitData={...form,source:form.source==="Other"?`Other: ${form.sourceOther}`:form.source};
      const res=await fetch("/api/apply",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(submitData)});
      const d=await res.json();
      if(d.ok){
        setStep(DONE);
      } else setSubError(d.error||"Something went wrong. Try again.");
    }
    catch{setSubError("Connection error. Try again or email "+S_INFO.email);}
    setSubmitting(false);
  };
  const fldStyle=(f)=>({border:errs[f]?"1.5px solid #c45c4a":undefined});
  const errMsg=(f)=>errs[f]?<div style={{color:"#c45c4a",fontSize:11,marginTop:2,marginBottom:4}}>{errs[f]}</div>:null;
  return(
    <section className="scr-sec" id="apply"><div className="scr-wrap"><div className="scr-card">
      {step<qs.length&&<><div className="scr-hd"><h2>Quick Pre-Screen</h2><p>{qs.length} quick questions to see if you qualify. Takes 30 seconds.</p></div>
        <div className="scr-prog">{qs.map((_,i)=><div key={i} className={`scr-dot ${i<step?"done":i===step?"act":""}`}/>)}</div>
        <div key={step} style={{animation:"fadeUp .3s"}}><div className="scr-qn">Question {step+1} of {qs.length}</div><div className="scr-qt">{qs[step]?.q}</div>
        <div className="scr-btns"><button className="scr-btn y" onClick={()=>answer("Yes")}>Yes</button><button className="scr-btn n" onClick={()=>answer("No")}>No</button></div></div></>}
      {step===PASS&&<div className="scr-pass"><div className="scr-pass-ic" style={{background:"rgba(45,106,63,.1)",color:"var(--gn)"}}>✓</div><h3>You Pre-Qualify!</h3><p>Fill out your info and we'll be in touch within 24 hours.</p><button className="bp" style={{width:"100%"}} onClick={()=>setStep(FORM)}>Continue →</button></div>}
      {step===FAIL&&<div className="scr-pass"><div className="scr-pass-ic" style={{background:"rgba(168,58,46,.08)",color:"var(--rd)"}}>✕</div><h3>Thanks for Your Interest</h3><p>Based on your answers, our properties may not be the right fit at this time. Questions? Email <strong>{S_INFO.email}</strong></p><button className="bo" style={{width:"100%",marginTop:12}} onClick={()=>setStep(0)}>Start Over</button></div>}
      {step===FORM&&<div style={{animation:"fadeUp .3s"}}><div className="scr-hd" style={{marginBottom:20}}><h2>Almost There</h2><p>All fields are required.</p></div>
        <div className="sform">
          <div className="sform-row">
            <div style={{flex:1}}><input className="sinp" placeholder="Full Name *" style={fldStyle("name")} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onBlur={()=>setTouched({...touched,name:true})}/>{errMsg("name")}</div>
            <div style={{flex:1}}><input className="sinp" placeholder="Phone *" type="tel" style={fldStyle("phone")} value={form.phone} onChange={e=>setForm({...form,phone:fmtPhone(e.target.value)})} onBlur={()=>setTouched({...touched,phone:true})}/>{errMsg("phone")}</div>
          </div>
          <div><input className="sinp" placeholder="Email *" type="email" style={fldStyle("email")} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onBlur={()=>setTouched({...touched,email:true})}/>{errMsg("email")}</div>
          <div><select className="ssel" style={fldStyle("property")} value={form.property} onChange={e=>{setForm({...form,property:e.target.value});setTouched({...touched,property:true});}} onBlur={()=>setTouched({...touched,property:true})}><option value="">Property interested in? *</option>{PROPS.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>{errMsg("property")}</div>
          <div><label style={{fontSize:11,color:"#5c4a3a",fontWeight:600,marginBottom:4,display:"block"}}>Preferred Move-in Date *</label>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr",gap:8}}>
              <select className="ssel" style={fldStyle("moveIn")} value={form.moveInMonth||""} onChange={e=>{const mo=e.target.value;setForm(f=>{const d=f.moveInDay,y=f.moveInYear;return{...f,moveInMonth:mo,moveIn:mo&&d&&y?`${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`:""};});setTouched(t=>({...t,moveIn:true}));}} onBlur={()=>setTouched(t=>({...t,moveIn:true}))}>
                <option value="">Month</option>
                {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m,i)=><option key={i} value={i+1}>{m}</option>)}
              </select>
              <select className="ssel" style={fldStyle("moveIn")} value={form.moveInDay||""} onChange={e=>{const d=e.target.value;setForm(f=>{const mo=f.moveInMonth,y=f.moveInYear;return{...f,moveInDay:d,moveIn:mo&&d&&y?`${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`:""};});}}>
                <option value="">Day</option>
                {Array.from({length:31},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
              </select>
              <select className="ssel" style={fldStyle("moveIn")} value={form.moveInYear||""} onChange={e=>{const y=e.target.value;setForm(f=>{const mo=f.moveInMonth,d=f.moveInDay;return{...f,moveInYear:y,moveIn:mo&&d&&y?`${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`:""};});}}>
                <option value="">Year</option>
                {(()=>{const yr=new Date().getFullYear();return[yr,yr+1,yr+2].map(y=><option key={y} value={y}>{y}</option>);})()}
              </select>
            </div>
            {errMsg("moveIn")}</div>
          <div><select className="ssel" style={fldStyle("source")} value={form.source} onChange={e=>{setForm({...form,source:e.target.value,sourceOther:""});setTouched({...touched,source:true});}} onBlur={()=>setTouched({...touched,source:true})}><option value="">How did you hear about us? *</option><option>Roomies.com</option><option>Google Search</option><option>Facebook / Instagram</option><option>Friend / Referral</option><option>Zillow / Apartments.com</option><option>Craigslist</option><option>Drive-by / Sign</option><option>Military / Contractor Network</option><option>Other</option></select>{errMsg("source")}
          {form.source==="Other"&&<><input className="sinp" placeholder="Please specify *" style={{marginTop:6,...fldStyle("sourceOther")}} value={form.sourceOther||""} onChange={e=>setForm({...form,sourceOther:e.target.value})} onBlur={()=>setTouched({...touched,sourceOther:true})}/>{touched.sourceOther&&!form.sourceOther?.trim()&&<div style={{color:"#c45c4a",fontSize:11,marginTop:2}}>Please tell us how you heard about us</div>}</>}</div>
          <div><textarea className="stxt" placeholder="Why are you leaving your current residence? *" style={fldStyle("reason")} value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} onBlur={()=>setTouched({...touched,reason:true})}/>{errMsg("reason")}{touched.reason&&form.reason.length>0&&form.reason.length<10&&<div style={{fontSize:10,color:"#999"}}>{form.reason.length}/10 characters</div>}</div>
          {subError&&<div style={{background:"rgba(168,58,46,.08)",color:"#a83a2e",padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:8}}>{subError}</div>}
          <button className="scr-sub" disabled={submitting} onClick={submitApp}>{submitting?"Submitting...":"Submit Application →"}</button>
        </div></div>}
      {step===DONE&&<div className="scr-pass"><div className="scr-pass-ic" style={{background:"rgba(212,168,83,.1)",color:"var(--ac)"}}>🐻</div><h3>Application Received!</h3><p>Thanks{form.name?`, ${form.name.split(" ")[0]}`:""} ! We've sent a confirmation to <strong>{form.email}</strong>. We'll reach out within 24 hours.</p></div>}
    </div></div></section>
  );
}

function StickyBar({properties}){
  const[vis,setVis]=useState(false);const[dismissed,setDismissed]=useState(false);
  useEffect(()=>{const h=()=>{if(!dismissed)setVis(window.scrollY>500);};window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[dismissed]);
  if(dismissed)return null;
  const minRent=properties&&properties.length?safeMin(properties.flatMap(p=>allRoomsP(p).map(r=>r.rent)))||600:600;
  return(<div className={`stk ${vis?"vis":""}`}><div className="stk-txt">Rooms from <strong>${minRent}/mo</strong> · Everything included</div><button className="stk-btn" onClick={()=>document.getElementById("apply")?.scrollIntoView({behavior:"smooth"})}>Apply Now →</button><button className="stk-x" onClick={()=>setDismissed(true)}>✕</button></div>);
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function Page(){
  const[scrolled,setScrolled]=useState(false);const[sel,setSel]=useState(null);const[mobMenu,setMobMenu]=useState(false);const[lightbox,setLightbox]=useState(null);const[lbIdx,setLbIdx]=useState(0);
  const[calProp,setCalProp]=useState("all");const[calRoom,setCalRoom]=useState(null);const[mOff,setMOff]=useState(0);
  const[mapCat,setMapCat]=useState("all");
  const[showFlt,setShowFlt]=useState(false);
  const[flt,setFlt]=useState({available:false,openingSoon:false,privateBath:false,sharedBath:false,queen:false,full:false,twin:false,allUtils:false,first100:false,weekly:false,biweekly:false});
  const[selProp,setSelProp]=useState(null);
  const[calcV,setCalcV]=useState({rent:1100,electric:120,water:40,gas:30,trash:25,internet:60,furniture:200});
  const[faqOpen,setFaqOpen]=useState(null);

  // Dynamic data from Supabase (falls back to hardcoded)
  const[liveProps,setLiveProps]=useState(null);
  const[liveSettings,setLiveSettings]=useState(null);
  useEffect(()=>{
    const SUPA="https://vxysaclhucdjxzcknoar.supabase.co/rest/v1";
    const KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
    const hdr={"apikey":KEY,"Authorization":"Bearer "+KEY};
    const fetchData=()=>Promise.all([
      fetch(SUPA+"/app_data?key=eq.hq-props&select=value",{headers:hdr}).then(r=>r.json()),
      fetch(SUPA+"/app_data?key=eq.hq-settings&select=value",{headers:hdr}).then(r=>r.json()),
    ]).then(([p,s])=>{
      if(s&&s[0]&&s[0].value&&s[0].value.companyName)setLiveSettings(s[0].value);
      if(p&&p[0]&&p[0].value&&Array.isArray(p[0].value)&&p[0].value.length>0)setLiveProps(p[0].value);
    }).catch(()=>{});
    fetchData();
    // Refetch when tab becomes visible again (e.g. after editing in admin)
    const onVis=()=>{if(document.visibilityState==="visible")fetchData();};
    document.addEventListener("visibilitychange",onVis);
    return()=>document.removeEventListener("visibilitychange",onVis);
  },[]);

  // Use Supabase data if available, otherwise hardcoded
  const P=useMemo(()=>{
    // All data comes from Supabase — show nothing until loaded
    if(!liveProps||!liveProps.length)return[];
    return liveProps.map(p=>{
      const rooms=allRoomsP(p);
      const firstUnit=(p.units&&p.units.length>0)?p.units[0]:null;
      return{
        id:p.id,name:p.name,address:p.addr||p.address||"",type:p.type,
        typeTag:p.type==="SFH"?"SFH":p.type==="Duplex"?"Duplex":"Townhome",
        baths:firstUnit?.baths||p.baths||2,sqft:p.sqft||0,
        status:rooms.some(r=>r.st==="vacant")?"Available":p.status||"Coming Soon",
        utils:firstUnit?.utils||p.utils||"allIncluded",
        clean:firstUnit?.clean||p.clean||"Biweekly",
        desc:p.desc||"",lat:p.lat||0,lng:p.lng||0,
        imgs:(p.photos&&p.photos.length>0)?p.photos:[],
        units:p.units||[],
        rooms:rooms.map(r=>({id:r.id,name:r.name,rent:r.rent,bed:r.bed||"Queen",tv:r.tv||'55"',pb:r.pb,sqft:r.sqft||0,feat:r.feat||[],furnished:r.furnished!==false,desc:r.desc||"",st:r.st,le:r.le})),
      };
    });
  },[liveProps]);
  const SI=liveSettings||S_INFO;

  // Coords are stored in Supabase by admin on save — use P directly
  const mapProps=P;

  const allRents=P.flatMap(p=>allRoomsP(p).map(r=>r.rent));const globalMin=allRents.length?Math.min(...allRents):500;const globalMax=allRents.length?Math.max(...allRents):1200;const[bbRoom,setBbRoom]=useState(0);
  useEffect(()=>{if(allRents.length&&!bbRoom)setBbRoom(globalMin);},[allRents]);

  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const nav=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  // Calendar
  const vd=new Date(TODAY.getFullYear(),TODAY.getMonth()+mOff,1);const vY=vd.getFullYear();const vM=vd.getMonth();
  const dIM=getDIM(vY,vM);const fD=getFD(vY,vM);const mLbl=vd.toLocaleString("default",{month:"long",year:"numeric"});
  const calProps=calProp==="all"?P:P.filter(p=>p.id===calProp);

  // Map
  const mapCats=[...new Set(POIS.map(p=>p.cat))];
  const mapFiltered=mapCat==="all"?POIS:POIS.filter(p=>p.cat===mapCat);

  // Compare
  const allRooms=P.flatMap(p=>(p.rooms||[]).map(r=>({...r,propName:p.name,propType:p.type,utils:p.utils,cleaning:p.clean})));
  const togFlt=k=>setFlt(f=>({...f,[k]:!f[k]}));const hasAnyFlt=Object.values(flt).some(v=>v);const fltCount=Object.values(flt).filter(v=>v).length;
  const resetFlt=()=>{setFlt(Object.fromEntries(Object.keys(flt).map(k=>[k,false])));setSelProp(null);};
  const filtRooms=useMemo(()=>{if(!hasAnyFlt)return allRooms;return allRooms.filter(r=>{
    const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;
    if(flt.available&&r.st!=="vacant")return false;if(flt.openingSoon&&!(r.st==="occupied"&&dl&&dl<=90))return false;
    if(flt.privateBath&&!r.pb)return false;if(flt.sharedBath&&r.pb)return false;
    if(flt.queen&&r.bed!=="Queen")return false;if(flt.full&&r.bed!=="Full")return false;if(flt.twin&&r.bed!=="Twin XL")return false;
    if(flt.allUtils&&r.utils!=="allIncluded")return false;if(flt.first100&&r.utils!=="first100")return false;
    if(flt.weekly&&r.cleaning!=="Weekly")return false;if(flt.biweekly&&r.cleaning!=="Biweekly")return false;
    if(selProp&&r.propName!==selProp)return false;
    return true;});},[flt,hasAnyFlt,allRooms,selProp]);
  const Ck=()=><span className="ck">✓</span>;const Xx=()=><span className="cx">—</span>;
  const F=({id,lb})=><button className={`fp ${flt[id]?"on":""}`} onClick={()=>togFlt(id)}>{lb}</button>;

  // Savings
  const tradTot=Object.values(calcV).reduce((a,b)=>a+b,0);const sav=tradTot-bbRoom;const savYr=sav*12;const savPct=tradTot>0?Math.round(sav/tradTot*100):0;
  const Sl=({lb,id,val,mn,mx,step,note})=>(<div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:12,fontWeight:600}}>{lb}</span><div style={{display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:10,color:"#999"}}>$</span><input type="number" value={val} onChange={e=>id==="bb"?setBbRoom(Number(e.target.value)||0):setCalcV(p=>({...p,[id]:Number(e.target.value)||0}))} style={{width:64,padding:"4px 6px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontFamily:"inherit",fontSize:13,fontWeight:700,textAlign:"right",outline:"none"}}/></div></div><input type="range" min={mn} max={mx} step={step||10} value={val} onChange={e=>id==="bb"?setBbRoom(Number(e.target.value)):setCalcV(p=>({...p,[id]:Number(e.target.value)}))} style={{background:`linear-gradient(to right, #d4a853 ${((val-mn)/(mx-mn))*100}%, #e5e3df ${((val-mn)/(mx-mn))*100}%)`}}/>{note&&<div style={{fontSize:9,color:"#999",marginTop:3}}>{note}</div>}</div>);

  // FAQ
  const faqs=[
    {q:"How does renting by the bedroom work?",a:"You sign a lease for a private, lockable bedroom in a shared home. Your room comes with its own furniture and TV. You share common areas with your housemates. All residents are screened, and Black Bear handles management, cleaning, and maintenance."},
    {q:"What's included in the rent?",a:"Every room comes fully furnished with a bed, dresser, and TV. All rooms include Google Fiber internet, off-street parking, and professional cleaning of common areas. Depending on the property, utilities are either fully included or the first $100 is covered with overage split equally. WiFi is always included."},
    {q:"How does the utility split work?",a:"Some properties have all utilities included — you pay nothing extra. At others, the first $100 in utilities is covered. If the bill goes over $100, the overage is split equally among all tenants. WiFi is always included at every property."},
    {q:"What does it cost to move in?",a:"Your security deposit (equal to one month's rent) secures the room — it's not held without it. First month's rent is due on or before move-in day. No application fee, but you pay for a background and credit check."},
    {q:"What's the lease length?",a:"12 months standard, but we're flexible for interns, contractors, travel nurses, and military on assignment."},
    {q:"What happens after my lease expires?",a:"It auto-renews month-to-month. Either party can terminate with 30 days written notice."},
    {q:"What's the pet and smoking policy?",a:"Strict no-pets and no-smoking policy across all properties. Includes vapes. No exceptions."},
    {q:"What if a roommate moves out?",a:"That's our responsibility. We find and screen replacements. Your lease and rent don't change."},
    {q:"How do I apply?",a:"Start with the pre-screen below — 7 yes/no questions. If you qualify, fill out a contact form and we'll reach out within 24 hours.",cta:true},
  ];

  // Reviews
  const revs=[
    {nm:"Jordan M.",rl:"DoD Contractor",txt:"Moved in on a Sunday, started work Monday. Everything was ready. I've never had a move-in this smooth.",rt:5,pr:"The Holmes House"},
    {nm:"Priya S.",rl:"Travel Nurse",txt:"The cleaning service makes it worth it. Coming home to a clean kitchen after a 12-hour shift is amazing. Plus, one bill covers everything.",rt:5,pr:"Lee Drive East"},
    {nm:"Tyler R.",rl:"Engineering Intern",txt:"Way better than overpriced apartments. I'm paying $600/mo for a furnished room with Google Fiber and cleaning. My friends pay $1,200+ and still buying furniture.",rt:5,pr:"The Holmes House"},
    {nm:"Maria L.",rl:"Remote Dev",txt:"Everyone here is a working professional. It's quiet, respectful, and Harrison actually responds when you text about maintenance.",rt:5,pr:"Lee Drive West"},
  ];

  // House standards
  const stds=[
    {i:"🚭",t:"No Smoking",d:"100% smoke-free. Cigarettes, vapes, everything. Inside and outside."},
    {i:"🐾",t:"No Pets",d:"Keeps homes clean and allergen-free for everyone."},
    {i:"👟",t:"Shoes Off",d:"Remove shoes at the door. Keeps floors cleaner for everyone."},
    {i:"🤫",t:"Quiet Hours",d:"10pm–7am weekdays, 11pm–10am weekends."},
    {i:"🧹",t:"Tidy Common Areas",d:"Keep shared spaces clean and decluttered at all times."},
    {i:"🗑️",t:"Trash & Recycling",d:"All roommates share the responsibility on pickup day."},
    {i:"🏠",t:"Overnight Guests",d:"24 hours notice to housemates. Simple courtesy."},
    {i:"🌡️",t:"Thermostat",d:"Roommates agree on a temperature together."},
  ];

  // Personas
  const personas=[
    {i:"🎓",t:"Interns & New Grads",d:"Save money. Live with professionals, not random strangers."},
    {i:"💼",t:"Traveling Professionals",d:"Engineers and consultants on contract. Focus on the job, not logistics."},
    {i:"🏥",t:"Travel Nurses",d:"13-week assignments. Furnished, flexible, minutes from hospitals."},
    {i:"💻",t:"Remote Workers",d:"Google Fiber, dedicated workspace, professional community."},
    {i:"🔄",t:"People in Transition",d:"Between homes? A furnished room buys you time without the stress."},
    {i:"🪖",t:"Military & DoD",d:"Quick PCS moves or temp assignments at Redstone. Settled in a day."},
  ];

  return(<><style>{CSS}</style>
    {/* NAV */}
    <nav className={`nav ${scrolled?"sc":""}`}><div className="nlogo" onClick={()=>nav("hero")}>🐻 Black Bear <span>Rentals</span></div>
      <div className="nlinks"><a onClick={()=>nav("properties")}>Properties</a><a onClick={()=>nav("compare")}>Compare</a><a onClick={()=>nav("availability")}>Availability</a><a onClick={()=>nav("location")}>Location</a><a onClick={()=>nav("apply")} className="ncta">Apply Now</a></div>
      <button className="nav-tog" onClick={()=>setMobMenu(!mobMenu)}>{mobMenu?"✕":"☰"}</button></nav>
    <div className={`mob-menu ${mobMenu?"open":""}`}><a onClick={()=>{nav("properties");setMobMenu(false);}}>Properties</a><a onClick={()=>{nav("compare");setMobMenu(false);}}>Compare</a><a onClick={()=>{nav("availability");setMobMenu(false);}}>Availability</a><a onClick={()=>{nav("location");setMobMenu(false);}}>Location</a><a onClick={()=>{nav("apply");setMobMenu(false);}} style={{color:"var(--ac)",fontWeight:700}}>Apply Now</a></div>

    {/* HERO */}
    <section className="hero" id="hero"><div className="hc">
      <div className="hbadge fu">✦ Huntsville's Turnkey Co-Living</div>
      <h1 className="fu fu1">Your Room Is Ready.<br/><em>Everything's Included.</em></h1>
      <p className="fu fu2">Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities — all handled. Just move in.</p>
      <div className="hbtns fu fu3"><button className="bp" onClick={()=>nav("properties")}>Browse Rooms</button><button className="bs" onClick={()=>nav("apply")}>Check If You Qualify</button></div>
      <div className="hstats fu fu4"><div className="hst"><div className="hst-n">${safeMin(P.flatMap(p=>allRoomsP(p).map(r=>r.rent)))||"—"}</div><div className="hst-l">Rooms From</div></div><div className="hst"><div className="hst-n">0</div><div className="hst-l">Hidden Fees</div></div><div className="hst"><div className="hst-n">24/7</div><div className="hst-l">AI Support</div></div></div>
    </div></section>

    {/* SOCIAL PROOF */}
    <div className="proof"><div className="proof-in">
      <div className="proof-i"><div className="proof-n">120+</div><div className="proof-l">Tenants Housed</div></div>
      <div className="proof-i"><div className="proof-n">3</div><div className="proof-l">Properties</div></div>
      <div className="proof-i"><div className="proof-n">11</div><div className="proof-l">Rooms</div></div>
      <div className="proof-i"><div className="proof-n" style={{fontSize:24}}>&lt;24<span style={{fontSize:14,opacity:.4}}>hrs</span></div><div className="proof-l">Approval Time</div></div>
      <div className="proof-i"><div className="proof-n" style={{color:"#d4a853",fontSize:24}}>★ 5.0</div><div className="proof-l">Rating <span style={{opacity:.4,fontSize:9}}>(coming)</span></div></div>
    </div></div>

    {/* PROPERTIES */}
    <section className="sec" id="properties"><div className="sec-inner"><div className="sh"><div className="sl">Our Portfolio</div><h2 className="st">Find Your Room</h2><p className="ss">Browse by house, compare pricing, and pick the bedroom that fits you.</p></div>
      <div className="pgrid">{P.map(p=>{const pr=allRoomsP(p).map(r=>r.rent);return(
        <div key={p.id} className="pcard" onClick={()=>setSel(p)}>{p.imgs&&p.imgs.length>0?<img src={p.imgs[0]} alt={p.name} className="pimg"/>:<div className="pimg" style={{background:"#2c2520",display:"flex",alignItems:"center",justifyContent:"center",color:"#d4a853",fontSize:32}}>🐻</div>}<div className="pinfo"><div className="ptags"><span className={`tag ${p.status==="Available"?"t-av":"t-cs"}`}>{p.status}</span><span className={`tag ${p.typeTag==="SFH"?"t-sfh":"t-th"}`}>{p.typeTag}</span></div><h3 className="pnm">{p.name}</h3><p className="pad">{p.address}</p><div className="phls"><span className="phl">{p.utils==="allIncluded"?"✓ All Utilities":"✓ First $100 Utils"}</span><span className="phl">✓ {p.clean} Cleaning</span><span className="phl">✓ Furnished</span></div><div className="pftr"><span className="ppr">${safeMin(pr)||"—"}–${safeMax(pr)||"—"}<small>/mo per room</small></span><span className="pbc">{allRoomsP(p).length} rooms</span></div></div></div>);})}</div>
    </div></section>

    {/* COMPARE */}
    <section className="sec-cr" id="compare"><div className="sec-inner"><div className="sh"><div className="sl">Compare</div><h2 className="st">Room-by-Room Comparison</h2><p className="ss">Use filters to find exactly what you're looking for.</p></div>
      <div className="flt-tog"><button className={`flt-btn ${showFlt?"on":""}`} onClick={()=>setShowFlt(!showFlt)}>🔍 Filter Rooms <span style={{fontSize:9,transition:"transform .2s",transform:showFlt?"rotate(180deg)":"none"}}>▼</span>{fltCount>0&&<span className="flt-cnt">{fltCount}</span>}</button></div>
      <div className={`flt-pan ${showFlt?"open":"closed"}`}>{showFlt&&<>
        <div className="flt-row"><span className="flt-lb">Available</span><F id="available" lb="Now"/><F id="openingSoon" lb="Opening Soon"/></div>
        <div className="flt-row"><span className="flt-lb">Bathroom</span><F id="privateBath" lb="Private"/><F id="sharedBath" lb="Shared"/></div>
        <div className="flt-row"><span className="flt-lb">Bed</span><F id="queen" lb="Queen"/><F id="full" lb="Full"/><F id="twin" lb="Twin XL"/></div>
        <div className="flt-row"><span className="flt-lb">Utilities</span><F id="allUtils" lb="All Included"/><F id="first100" lb="First $100"/></div>
        <div className="flt-row"><span className="flt-lb">Cleaning</span><F id="weekly" lb="Weekly"/><F id="biweekly" lb="Biweekly"/></div>
        <div className="flt-row"><span className="flt-lb">Property</span>{P.map(p=><button key={p.id} className={`flt-btn ${selProp===p.name?"on":""}`} style={{marginRight:4}} onClick={()=>setSelProp(sp=>sp===p.name?null:p.name)}>{p.name}</button>)}{(hasAnyFlt||selProp)&&<button className="flt-clr" onClick={()=>{resetFlt();setSelProp(null);}}>✕ Clear</button>}</div>
      </>}</div>
      {hasAnyFlt&&<div style={{textAlign:"center",fontSize:12,color:"var(--ac)",fontWeight:700,marginBottom:14}}>Showing {filtRooms.length} of {allRooms.length} rooms</div>}
      {filtRooms.length===0?<div style={{textAlign:"center",padding:36,color:"#999",background:"#fff",borderRadius:12}}>{!P.length?"Loading rooms...":"No rooms match your filters."}{(hasAnyFlt||selProp)&&<><br/><button className="flt-clr" style={{marginTop:8}} onClick={()=>{resetFlt();setSelProp(null);}}>Clear filters</button></>}</div>:(
        <div className="cw"><table className="cmp"><thead><tr><th style={{textAlign:"left"}}>Feature</th>{filtRooms.map(r=><th key={r.id}>{r.name}<div style={{fontSize:7,fontWeight:400,opacity:.6,marginTop:1,textTransform:"none",letterSpacing:0}}>{r.propName}{r.unitLabel?" · Unit "+r.unitLabel:""}</div></th>)}</tr></thead><tbody>
          <tr className="cmp-cat"><td>Pricing</td>{filtRooms.map(r=><td key={r.id}/>)}</tr>
          <tr><td>Rent</td>{filtRooms.map(r=><td key={r.id}><span className="cprice">${r.rent}<small>/mo</small></span></td>)}</tr>
          <tr><td>Status</td>{filtRooms.map(r=>{const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;return(<td key={r.id}>{r.st==="vacant"?<span className="cavail" style={{background:CLR.avBg,color:CLR.avTx}}>Available</span>:dl&&dl<=90?<span className="cavail" style={{background:CLR.soonBg,color:CLR.soonTx}}>Opens {fmtD(r.le)}</span>:<span className="cavail" style={{background:CLR.occBg,color:CLR.occTx}}>Leased</span>}</td>);})}</tr>
          <tr><td>Sq Ft</td>{filtRooms.map(r=><td key={r.id}><span className="cv">{r.sqft}</span></td>)}</tr>
          <tr className="cmp-cat"><td>Room</td>{filtRooms.map(r=><td key={r.id}/>)}</tr>
          <tr><td>Bed</td>{filtRooms.map(r=><td key={r.id}><span className="cv">{r.bed}</span></td>)}</tr>
          <tr><td>TV</td>{filtRooms.map(r=><td key={r.id}><span className="cv">{r.tv}</span></td>)}</tr>
          <tr><td>Furnished</td>{filtRooms.map(r=><td key={r.id}><Ck/></td>)}</tr>
          <tr><td>Private Bath</td>{filtRooms.map(r=><td key={r.id}>{r.pb?<Ck/>:<Xx/>}</td>)}</tr>
          <tr className="cmp-cat"><td>Included</td>{filtRooms.map(r=><td key={r.id}/>)}</tr>
          <tr><td>All Utilities</td>{filtRooms.map(r=><td key={r.id}>{r.utils==="allIncluded"?<Ck/>:<Xx/>}</td>)}</tr>
          <tr><td>First $100 Utils</td>{filtRooms.map(r=><td key={r.id}>{r.utils==="first100"?<Ck/>:<Xx/>}</td>)}</tr>
          <tr><td>Google Fiber</td>{filtRooms.map(r=><td key={r.id}><Ck/></td>)}</tr>
          <tr><td>Parking</td>{filtRooms.map(r=><td key={r.id}><Ck/></td>)}</tr>
          <tr><td>Weekly Clean</td>{filtRooms.map(r=><td key={r.id}>{r.cleaning==="Weekly"?<Ck/>:<Xx/>}</td>)}</tr>
          <tr><td>Biweekly Clean</td>{filtRooms.map(r=><td key={r.id}>{r.cleaning==="Biweekly"?<Ck/>:<Xx/>}</td>)}</tr>
        </tbody></table></div>
      )}
    </div></section>

    {/* AVAILABILITY */}
    <section className="sec" id="availability"><div className="sec-inner"><div className="sh"><div className="sl">Availability</div><h2 className="st">Room Availability</h2><p className="ss">Rooms available now are ready for immediate move-in. Click upcoming openings to see the calendar.</p></div>
      <div className="tabs"><button className={`tab ${calProp==="all"?"on":""}`} onClick={()=>{setCalProp("all");setCalRoom(null);}}>All</button>{P.map(p=><button key={p.id} className={`tab ${calProp===p.id?"on":""}`} onClick={()=>{setCalProp(p.id);setCalRoom(null);}}>{p.name}</button>)}</div>
      <div className="cal-grid">{calProps.map(prop=>(
        <div key={prop.id} className="cal-card"><div className="cal-hd"><h3>{prop.name}</h3><span>{prop.type} · {allRoomsP(prop).length} rooms</span></div><div className="cal-bd">
          {allRoomsP(prop).map(r=>{const isV=r.st==="vacant";const le=r.le?new Date(r.le+"T00:00:00"):null;const dl=le?Math.ceil((le-TODAY)/(1e3*60*60*24)):null;const isSoon=!isV&&dl&&dl<=90;const isExp=calRoom===r.id;
            if(isV)return(<div key={r.id} className="cal-avail"><div className="cal-rm-l"><div className="cal-rm-n">{r.name} — ${r.rent}/mo</div><div className="cal-rm-d">{r.bed} · {r.pb?"Private bath":"Shared bath"} · {r.sqft} sqft · Ready now</div></div><button className="cal-avail-btn" onClick={()=>nav("apply")}>Apply Now →</button></div>);
            if(isSoon)return(<div key={r.id}><div className="cal-rm cal-soon" onClick={()=>setCalRoom(isExp?null:r.id)} style={{borderColor:isExp?"rgba(154,116,34,.3)":undefined,background:isExp?"rgba(254,243,218,.1)":undefined}}><div className="cal-rm-l"><div className="cal-rm-n">{r.name} — ${r.rent}/mo</div><div className="cal-rm-d">{r.bed} · {r.pb?"Private":"Shared"} bath · Opens <strong>{fmtD(r.le)}</strong></div></div><span className="cal-rm-st" style={{background:CLR.soonBg,color:CLR.soonTx}}>Opening {fmtD(r.le)} {isExp?"▾":"▸"}</span></div>
              {isExp&&<div style={{padding:"8px 0 12px",animation:"fadeIn .2s"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><button className="tab" style={{padding:"3px 8px",fontSize:9}} onClick={()=>setMOff(o=>o-1)}>←</button><div style={{fontSize:12,fontWeight:800}}>{mLbl}</div><button className="tab" style={{padding:"3px 8px",fontSize:9}} onClick={()=>setMOff(o=>o+1)}>→</button></div>
                <div className="cal-days-hd">{["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} className="cal-day-lb">{d}</div>)}</div>
                <div className="cal-days">{Array.from({length:fD}).map((_,i)=><div key={`e${i}`} className="cal-dy" style={{background:"transparent"}}/>)}{Array.from({length:dIM}).map((_,i)=>{const day=i+1;const dt=new Date(vY,vM,day);const occ=le?dt<=le:true;const isT=dt.toDateString()===TODAY.toDateString();return(<div key={day} className="cal-dy" style={{background:occ?CLR.occBg:CLR.avBg,color:occ?CLR.occTx:CLR.avTx,boxShadow:isT?`inset 0 0 0 2px #d4a853`:undefined,fontWeight:isT?800:600}}>{day}</div>);})}</div>
                <div style={{textAlign:"center",marginTop:10}}><button className="cal-avail-btn" style={{background:"#9a7422"}} onClick={()=>nav("apply")}>Get Notified →</button></div>
              </div>}</div>);
            return(<div key={r.id} className="cal-rm cal-occ"><div className="cal-rm-l"><div className="cal-rm-n">{r.name} — ${r.rent}/mo</div><div className="cal-rm-d">{r.bed} · {r.pb?"Private":"Shared"} bath</div></div><span className="cal-rm-st" style={{background:CLR.occBg,color:CLR.occTx}}>Thru {fmtD(r.le)}</span></div>);
          })}</div></div>))}</div>
      <div className="cal-legend"><div className="cal-leg-i"><div className="cal-leg-d" style={{background:CLR.avBg,border:`1px solid ${CLR.avTx}33`}}/><span style={{color:CLR.avTx}}>Available — Apply Now</span></div><div className="cal-leg-i"><div className="cal-leg-d" style={{background:CLR.soonBg,border:`1px solid ${CLR.soonTx}33`}}/><span style={{color:CLR.soonTx}}>Opening Soon</span></div><div className="cal-leg-i"><div className="cal-leg-d" style={{background:CLR.occBg,border:`1px solid ${CLR.occTx}33`}}/><span style={{color:CLR.occTx}}>Leased</span></div></div>
    </div></section>

    {/* MAP */}
    <section className="sec-dk" id="location"><div className="sec-inner"><div className="sh"><div className="sl">Location</div><h2 className="st" style={{color:"var(--cr)"}}>Minutes From Everything</h2><p className="ss" style={{color:"var(--mt)"}}>Our properties are centrally located in Huntsville. Click any pin for details.</p></div>
      <MapSection mapCat={mapCat} setMapCat={setMapCat} mapCats={mapCats} mapFiltered={mapFiltered} nav={nav} properties={mapProps}/>
    </div></section>

    {/* SAVINGS */}
    <section className="sec-dk" id="savings" style={{padding:"80px 40px"}}><div className="sec-inner"><div className="sh"><div className="sl">Save Money</div><h2 className="st" style={{color:"var(--cr)"}}>See How Much You'd Save</h2><p className="ss" style={{color:"var(--mt)"}}>Compare a traditional apartment vs. a Black Bear room.</p></div>
      <div className="calc-grid">
        <div className="calc-card"><div className="calc-hd"><div className="calc-ic" style={{background:"rgba(168,58,46,.08)"}}>🏢</div><div><div style={{fontWeight:800}}>Traditional Apartment</div><div style={{fontSize:10,color:"#999"}}>Everything separate</div></div></div>
          <Sl lb="Rent" id="rent" val={calcV.rent} mn={500} mx={2000} note="Avg 1BR Huntsville: ~$1,100"/>
          <Sl lb="Electric" id="electric" val={calcV.electric} mn={0} mx={300}/>
          <Sl lb="Water" id="water" val={calcV.water} mn={0} mx={100}/>
          <Sl lb="Gas" id="gas" val={calcV.gas} mn={0} mx={100}/>
          <Sl lb="Trash" id="trash" val={calcV.trash} mn={0} mx={60}/>
          <Sl lb="Internet" id="internet" val={calcV.internet} mn={0} mx={150}/>
          <Sl lb="Furniture" id="furniture" val={calcV.furniture} mn={0} mx={500} note="$2,400 ÷ 12 months"/>
          <div className="calc-total"><span style={{fontWeight:800}}>Total</span><span style={{fontSize:22,fontWeight:800,color:"var(--rd)"}}>${tradTot.toLocaleString()}</span></div>
        </div>
        <div>
          <div className="calc-card" style={{border:"2px solid #d4a853"}}><div className="calc-hd"><div className="calc-ic" style={{background:"rgba(212,168,83,.1)"}}>🐻</div><div><div style={{fontWeight:800}}>Black Bear Room</div><div style={{fontSize:10,color:"#999"}}>Everything included</div></div></div>
            <Sl lb="Your Room" id="bb" val={bbRoom} mn={globalMin} mx={globalMax} step={50} note={`Rooms $${globalMin}–$${globalMax}/mo`}/>
            {["WiFi (Google Fiber)","Utilities (varies)","Furnished bedroom","TV in room","Parking","Common area cleaning","Pro management"].map((x,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 0",borderBottom:i<6?"1px solid rgba(0,0,0,.03)":"none",fontSize:12,color:"var(--gn)",fontWeight:500}}><span style={{fontWeight:800}}>✓</span>{x}<span style={{marginLeft:"auto",color:"#999",fontSize:10}}>$0</span></div>)}
            <div className="calc-total" style={{borderColor:"rgba(212,168,83,.2)"}}><span style={{fontWeight:800}}>Total</span><span style={{fontSize:22,fontWeight:800,color:"var(--gn)"}}>${bbRoom.toLocaleString()}</span></div>
          </div>
          {sav>0&&<div className="calc-save" style={{background:"linear-gradient(135deg,#2d6a3f,#3d8a52)"}}><div style={{fontSize:12,fontWeight:600,opacity:.8,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>You'd Save</div><div style={{fontSize:42,fontWeight:800,fontFamily:"var(--fd)"}}>${sav.toLocaleString()}</div><div style={{fontSize:13,opacity:.8}}>per month · <strong>${savYr.toLocaleString()}</strong>/year · {savPct}% less</div></div>}
          <div style={{textAlign:"center",marginTop:14}}><button className="bp" onClick={()=>nav("apply")}>Start Saving — Apply Now →</button></div>
        </div>
      </div>
      <div style={{textAlign:"center",marginTop:24,fontSize:10,color:"rgba(196,168,130,.3)"}}>Pre-filled from Huntsville averages (RentCafe 2026). Adjust to match your situation.</div>
    </div></section>

    {/* AMENITIES */}
    <section className="sec-dk" id="amenities"><div className="sec-inner"><div className="sh"><div className="sl">What's Included</div><h2 className="st" style={{color:"var(--cr)"}}>Everything You Need</h2></div>
      <div className="agrid">{AMENITIES.map((a,i)=><div key={i} className="acard"><div className="aic">{a.icon}</div><h3 className="at">{a.t}</h3><p className="adsc">{a.d}</p></div>)}</div>
    </div></section>

    {/* HOW IT WORKS */}
    <section className="sec-cr"><div className="sec-inner"><div className="sh"><div className="sl">How It Works</div><h2 className="st">4 Steps to Move In</h2></div>
      <div className="steps-g">{[
        {n:"01",i:"🔍",t:"Browse Rooms",d:"Explore properties and compare rooms, amenities, and pricing."},
        {n:"02",i:"📋",t:"Pre-Screen",d:"7 quick yes/no questions. 30 seconds. No commitment."},
        {n:"03",i:"📝",t:"Apply",d:"Full application with references. No app fee — you pay for background check. Hear back within 24 hours."},
        {n:"04",i:"🔑",t:"Sign & Move In",d:"Sign lease, pay security deposit to lock your room. First month due on or before move-in. Everything's ready."},
      ].map((s,i)=><div key={i} className="step-c"><div className="step-top"><div className="step-ic">{s.i}</div><div className="step-num">{s.n}</div></div><h3>{s.t}</h3><p>{s.d}</p></div>)}</div>
    </div></section>

    {/* WHO LIVES HERE */}
    <section className="sec"><div className="sec-inner"><div className="sh"><div className="sl">Our Community</div><h2 className="st">Who Lives at Black Bear?</h2><p className="ss">Professionals who value their time and want a turnkey living experience.</p></div>
      <div className="per-g">{personas.map((p,i)=><div key={i} className="per-c"><div className="per-ic">{p.i}</div><div><h3>{p.t}</h3><p>{p.d}</p></div></div>)}</div>
    </div></section>

    {/* HOUSE STANDARDS */}
    <section className="sec-dk"><div className="sec-inner"><div className="sh"><div className="sl">Community Standards</div><h2 className="st" style={{color:"var(--cr)"}}>How We Keep Things Nice</h2><p className="ss" style={{color:"var(--mt)"}}>Simple standards so everyone enjoys a clean, quiet, professional home.</p></div>
      <div className="hs-g">{stds.map((s,i)=><div key={i} className="hs-c"><div className="hs-ic">{s.i}</div><div><h4>{s.t}</h4><p>{s.d}</p></div></div>)}</div>
    </div></section>

    {/* REVIEWS */}
    <section className="sec" style={{background:"var(--dk)"}}><div className="sec-inner"><div className="sh"><div className="sl">Reviews</div><h2 className="st" style={{color:"var(--cr)"}}>What Our Tenants Say</h2></div>
      <div className="rev-g">{revs.map((r,i)=><div key={i} className="rev-c"><div className="rev-stars">{"★".repeat(r.rt)}</div><div className="rev-txt">"{r.txt}"</div><div className="rev-ft"><div><div className="rev-nm">{r.nm}</div><div className="rev-rl">{r.rl}</div></div><span className="rev-prop">{r.pr}</span></div></div>)}</div>
      <div style={{textAlign:"center",marginTop:28}}><button className="bp">Leave a Review & Get $25 Off Rent →</button></div>
    </div></section>

    {/* FAQ */}
    <section className="sec-cr" id="faq"><div className="sec-inner"><div className="sh"><div className="sl">FAQ</div><h2 className="st">Frequently Asked Questions</h2></div>
      <div className="faq-list">{faqs.map((f,i)=>{const isO=faqOpen===i;return(
        <div key={i} className={`faq-item ${isO?"open":""}`}><div className="faq-q" onClick={()=>setFaqOpen(isO?null:i)}><span>{f.q}</span><span className="faq-plus">+</span></div>
          {isO&&<div className="faq-a">{f.a}{f.cta&&<div style={{marginTop:10}}><button className="bp" style={{fontSize:12,padding:"8px 20px"}} onClick={()=>nav("apply")}>Apply Now →</button></div>}</div>}
        </div>);})}
      </div>
    </div></section>

    {/* SCREENING */}
    <Screening properties={P}/>

    {/* FOOTER */}
    <footer className="ftr"><p>© {new Date().getFullYear()} {SI.company} — {SI.legal}. All rights reserved.</p></footer>

    {/* OVERLAYS */}
    {sel&&<PropertyModal p={sel} onClose={()=>setSel(null)} setLightbox={setLightbox} setLbIdx={setLbIdx}/>}
    {lightbox&&<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <button onClick={()=>setLightbox(null)} style={{position:"absolute",top:20,right:24,background:"none",border:"none",color:"#fff",fontSize:28,cursor:"pointer",lineHeight:1}}>✕</button>
      <button onClick={e=>{e.stopPropagation();setLbIdx(i=>Math.max(0,i-1));}} style={{position:"absolute",left:16,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:28,cursor:"pointer",padding:"8px 14px",borderRadius:6,lineHeight:1}}>‹</button>
      <img src={lightbox[lbIdx]} alt="" onClick={e=>e.stopPropagation()} style={{maxWidth:"90vw",maxHeight:"90vh",objectFit:"contain",borderRadius:8,boxShadow:"0 8px 40px rgba(0,0,0,.5)"}}/>
      <button onClick={e=>{e.stopPropagation();setLbIdx(i=>Math.min(lightbox.length-1,i+1));}} style={{position:"absolute",right:16,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:28,cursor:"pointer",padding:"8px 14px",borderRadius:6,lineHeight:1}}>›</button>
      <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
        {lightbox.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setLbIdx(i);}} style={{width:8,height:8,borderRadius:"50%",background:i===lbIdx?"#d4a853":"rgba(255,255,255,.4)",cursor:"pointer",transition:"background .2s"}}/>)}
      </div>
      <div style={{position:"absolute",bottom:20,right:24,color:"rgba(255,255,255,.5)",fontSize:12}}>{lbIdx+1} / {lightbox.length}</div>
    </div>}
    <Chat/>
    <StickyBar properties={P}/>
  </>);
}
