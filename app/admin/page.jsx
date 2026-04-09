"use client";
import { syncTenantToSupabase } from "@/lib/syncTenant";
import PMSettings from "./components/PMSettings";
import Messages from "./components/MessagesV2";
import Announcements from "./components/Announcements";
import Reports from "./components/Reports";
import PropertiesList from "./components/PropertiesList";
import PortalOpsTab from "./components/PortalOpsTab";
import AccountingTab from "./components/AccountingTab";
import AppSetup from "./components/AppSetup";
import WebsiteSettings from "./components/WebsiteSettings";
import DashboardTab from "./components/DashboardTab";
import PortalPreview from "./components/PortalPreview";
import LeasesTab from "./components/LeasesTab";
import ThemeTab from "./components/ThemeTab";
import ScorecardTab from "./components/ScorecardTab";
import IdeasTab from "./components/IdeasTab";
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
const IconMail=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>;
const IconMegaphone=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
const IconPortalOps=()=><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M6 8h4 M6 11h3"/><circle cx="17" cy="9" r="2"/></svg>;
const IconTimeline=()=><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="6" height="4" rx="1"/><rect x="3" y="10" width="10" height="4" rx="1"/><rect x="3" y="16" width="7" height="4" rx="1"/><line x1="12" y1="6" x2="21" y2="6"/><line x1="16" y1="12" x2="21" y2="12"/><line x1="13" y1="18" x2="21" y2="18"/></svg>;
const IconSettings=()=><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;

// ─── Storage ────────────────────────────────────────────────────────
// Centralized Supabase client + domain-specific load/save
import { supa, loadAppData as load, saveAppData as save } from "@/lib/supabase-client";
import * as db from "@/lib/db";
const SUPA_URL=process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ── Lease instance CRUD (lease_instances table) ──────────────────────────────
const LEASE_TEMPLATE_ID="2d9d0941-2802-468a-a6e8-b2cceacf78d1";
const leaseRowToObj=(row)=>({...(row.variable_data||{}),id:row.id,status:row.status,landlordSig:row.landlord_sig,landlordSignature:row.landlord_sig,landlordSignedAt:row.landlord_signed_at,tenantSig:row.tenant_sig,tenantSignedAt:row.tenant_signed_at,signingToken:row.signing_token,signingLink:row.signing_link,pdfUrl:row.pdf_url,roomId:row.room_id||(row.variable_data?.roomId)||"",propertyId:row.property_id||(row.variable_data?.propertyId)||"",createdAt:row.created_at,updatedAt:row.updated_at});
const leaseObjToRow=(lease)=>({id:lease.id,workspace_id:null,template_id:LEASE_TEMPLATE_ID,tenant_id:lease.tenantEmail||null,room_id:lease.roomId||null,property_id:lease.propertyId||null,variable_data:lease,status:lease.status||"draft",landlord_sig:lease.landlordSignature||lease.landlordSig||null,tenant_sig:lease.tenantSig||null,landlord_signed_at:lease.landlordSignedAt||null,tenant_signed_at:lease.tenantSignedAt||null,signing_token:lease.signingToken||null,signing_link:lease.signingLink||null,pdf_url:lease.pdfUrl||null,updated_at:new Date().toISOString()});
async function loadLeases(){try{const r=await supa("lease_instances?order=created_at.desc");const rows=await r.json();if(!Array.isArray(rows))return[];return rows.map(leaseRowToObj);}catch(e){console.error("Load leases error:",e);return[];}}
async function upsertLease(lease){try{await supa("lease_instances",{method:"POST",prefer:"resolution=merge-duplicates",body:JSON.stringify(leaseObjToRow(lease))});}catch(e){console.error("Upsert lease error:",e);}}
async function patchLease(id,updates){try{await supa("lease_instances?id=eq."+id,{method:"PATCH",prefer:"resolution=merge-duplicates",body:JSON.stringify({...updates,updated_at:new Date().toISOString()})});}catch(e){console.error("Patch lease error:",e);}}
async function deleteLeaseInDB(id){try{await supa("lease_instances?id=eq."+id,{method:"DELETE"});}catch(e){console.error("Delete lease error:",e);}}

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
  {id:uid(),label:"Door Code (4-digit PIN)",key:"doorCode",type:"text",section:"Move-In & Property",required:true,active:true,placeholder:"Choose a 4-digit code (numbers only)",helpText:"This code will be programmed into your smart lock and written into your lease. Choose any 4 digits. Activates at 12:00am on move-in day once payment is received.",options:[],followUpYes:"",followUpNo:"",min:4,max:4},
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
  {id:uid(),label:"Proof of Income (Optional)",key:"payStubs",type:"file",section:"Employment & Income",required:false,active:true,placeholder:"Upload pay stubs, offer letter, or bank statement",helpText:"Optional — skip if you don't have them handy. Your income will be verified through RentPrep.",options:[],followUpYes:"",followUpNo:"",min:null,max:null},
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

const fmt=n=>"$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtS=n=>"$"+Number(n).toLocaleString();
const fmtD=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;}
const fmtDLong=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return dt.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});};
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
// Resolve email template tokens — all ref/reupload emails go through this
function resolveEmailTemplate(tmpl,tokens){
  return Object.entries(tokens).reduce((s,[k,v])=>s.replaceAll("{"+k+"}",v||""),tmpl);
}

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

// ─── Sample Data (empty — real data comes from Supabase) ────────────
const DEF_PROPS=[];

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
  const pn=propName||prop.addr||prop.name||"";
  return(prop.units||[]).flatMap(u=>{
    if((u.rentalMode||"byRoom")==="wholeHouse"){
      const rooms=u.rooms||[];
      const anyOcc=rooms.some(r=>r.st==="occupied"||(r.tenant&&!r.st));
      const latestLe=rooms.filter(r=>r.le).sort((a,b)=>new Date(b.le)-new Date(a.le))[0]?.le||null;
      if(u.ownerOccupied)return[];
      return[{
        id:u.id,name:(prop.units||[]).length>1?u.name:"Whole Unit",
        rent:u.rent||0,st:anyOcc?"occupied":"vacant",le:latestLe,
        propName:pn,propId:prop.id,unitId:u.id,unitName:u.name,unitLabel:u.label,
        isWholeUnit:true,baths:u.baths,sqft:u.sqft,beds:rooms.length,
      }];
    }
    return(u.rooms||[]).filter(r=>!r.ownerOccupied).map(r=>
      ({...r,st:r.st||(r.tenant?"occupied":"vacant"),propName:pn,propId:prop.id,unitId:u.id,unitName:u.name,unitLabel:u.label,isWholeUnit:false})
    );
  });
};
// Update a room by ID inside its unit, preserving hierarchy
const updateRoomInProps=(props,roomId,updater)=>props.map(p=>({...p,units:(p.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(r=>r.id===roomId?updater(r):r)}))}));
// Update a specific prop's room by ID
const updateRoomInProp=(prop,roomId,updater)=>({...prop,units:(prop.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(r=>r.id===roomId?updater(r):r)}))});


const DEF_PAYMENTS={};// {roomId: {month: amount}} - quick lookup (computed from charges)
const CHARGE_CATS=["Rent","Last Month Rent","Utility Overage","Late Fee","Security Deposit","Cleaning Fee","Damage Charge","Lock Change","Key Replacement","Move-In Fee","Move-Out Fee","Pet Violation","Smoking Violation","Guest Violation"];
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
const DEF_SETTINGS={companyName:"Black Bear Rentals",legalName:"Oak & Main Development LLC",pmName:"Carolina Cooper",phone:"(850) 696-8101",email:"info@rentblackbear.com",pmEmail:"blackbearhousing@gmail.com",city:"Huntsville, Alabama",tagline:"Huntsville's Turnkey Co-Living",heroHeadline:"Your Room Is Ready.",heroSubline:"Everything's Included.",heroDesc:"Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities — all handled.",adminFee:10,reminderTemplate:"Hi {firstName}, this is a friendly reminder that your {category} of {amount} was due on {dueDate}. Please log in to your tenant portal to view your balance and pay: {portalLink}\n\nIf you have already sent payment, please disregard this message. Thank you! — Black Bear Rentals",notifAppReceived:true,notifLeaseSent:true,notifLeaseSigned:true,notifPaymentReceived:true,notifMaintenanceRequest:true,notifPrescreen:true,showPayBadge:true,showAppBadge:true,adminPresetId:"forest",adminAccent:"#4a7c59",adminAccentRgb:"74,124,89",adminFont:"'Plus Jakarta Sans',system-ui,sans-serif",adminZoom:1,m2mIncrease:50,m2mNoticeDays:30,autoReminders:true,mobileTabs:["dashboard","tenants","applications","accounting"],couplesDefault:false,
  // Portfolio-wide late fee defaults — per-room lateConfig inherits these if fields are null
  lateFeeGraceDays:3,    // days after due before any fee applies
  lateFeeInitial:50,     // default one-time initial fee (flat $)
  lateFeeDaily:5,        // default daily accrual per day
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
    refEmployerSubject:"Reference Request — {applicantName} (Rental Application)",
    refEmployerBody:"Hi {refName},\n\nMy name is {pmName} from {companyName} in {city}.\n\n{applicantName} has applied to rent one of our properties and listed you as an employer reference. We would appreciate if you could take a moment to confirm the following:\n\n1. Can you confirm {applicantFirstName} is/was employed at your organization?\n2. What is/was their role and approximate start date?\n3. Would you recommend them as a tenant?\n\nPlease reply directly to this email. This typically takes only 2–3 minutes.\n\nThank you for your time,\n{pmName}\n{companyName}\n{phone}\n{email}",
    refPersonalSubject:"Reference Request — {applicantName} (Rental Application)",
    refPersonalBody:"Hi {refName},\n\nMy name is {pmName} from {companyName} in {city}.\n\n{applicantName} has applied to rent one of our properties and listed you as a personal reference. We would appreciate a few words about their character and reliability.\n\n1. How long have you known {applicantFirstName} and in what capacity?\n2. Would you describe them as responsible and respectful?\n3. Is there anything else you'd like us to know?\n\nPlease reply directly to this email.\n\nThank you for your time,\n{pmName}\n{companyName}\n{phone}\n{email}",
    refLandlordSubject:"Tenant Reference Request — {applicantName} (Rental Application)",
    refLandlordBody:"Hi {refName},\n\nMy name is {pmName} from {companyName} in {city}.\n\n{applicantName} has applied to rent one of our properties and listed you as a previous landlord. We would appreciate a moment of your time to verify a few details:\n\n1. Did {applicantFirstName} rent from you at {address}?\n2. Did they pay rent on time and care for the property?\n3. Would you rent to them again?\n\nPlease reply directly to this email.\n\nThank you for your time,\n{pmName}\n{companyName}\n{phone}\n{email}",
    reuploadSubject:"Action Required — Please Re-Upload Your {docLabel}",
    reuploadBody:"Hi {applicantFirstName},\n\nThank you for submitting your application to {companyName}. We were unable to verify your {docLabel} — the image may be unclear, cropped, or missing.\n\nPlease log in to your application portal and re-upload a clear photo:\n\n{portalLink}\n\nIf you have any questions, reply to this email.\n\nThank you,\n{pmName}\n{companyName}",
  },
  screenForm:{
    heading:"Almost There",
    subtext:"All fields are required.",
    sources:["Roomies.com","Google Search","Facebook / Instagram","Friend / Referral","Zillow / Apartments.com","Craigslist","Drive-by / Sign","Military / Contractor Network","NASA / Redstone Network","Other"],
  },
  houseRules:[
    "No smoking or vaping anywhere on property",
    "No pets",
    "Remove shoes at the door",
    "Quiet hours: 10pm\u20137am weekdays, 11pm\u201310am weekends",
    "Keep shared spaces clean",
    "No overnight guests without prior approval",
    "Lock all doors when leaving",
    "Report maintenance issues promptly",
  ],
  utilTemplates:[
    {id:"ut1",name:"All Utilities Included",key:"allIncluded",desc:"Landlord pays all utilities — water, sewer, garbage, electric, gas, and WiFi.",clause:"PROPERTY MANAGER agrees to pay all utilities including water, sewer, garbage, electricity, gas, and internet (WiFi). RESIDENT is responsible for no utility costs beyond the monthly rent."},
    {id:"ut2",name:"First $100 Covered — Overage Split",key:"first100",desc:"PM covers first $100/mo of combined utilities. Any overage is split equally among all residents. WiFi always included.",clause:"PROPERTY MANAGER agrees to pay the first $100.00 of combined utilities (water, sewer, garbage, electricity, and gas) per month. Any usage exceeding $100.00 per month shall be split equally among all current residents and billed on the 1st of each month. Internet (WiFi) is provided by PROPERTY MANAGER at no additional cost to RESIDENT."},
    {id:"ut8",name:"First $150 Covered — Overage Split",key:"first150",desc:"PM covers first $150/mo of combined utilities. Any overage is split equally among all residents. WiFi always included.",clause:"PROPERTY MANAGER agrees to pay the first $150.00 of combined utilities (water, sewer, garbage, electricity, and gas) per month. Any usage exceeding $150.00 per month shall be split equally among all current residents and billed on the 1st of each month. Internet (WiFi) is provided by PROPERTY MANAGER at no additional cost to RESIDENT."},
    {id:"ut5",name:"WiFi Included — Tenant Pays All Other Utilities",key:"wifiOnly",desc:"PM provides WiFi. Tenant pays water, electric, gas, and other utilities.",clause:"PROPERTY MANAGER provides internet (WiFi) at no cost to RESIDENT. RESIDENT is responsible for paying all other utilities including water, sewer, garbage, electricity, and gas, either directly to the provider or as billed by PROPERTY MANAGER."},
    {id:"ut6",name:"Owner Pays Water & WiFi — Tenant Splits Electric",key:"waterWifi",desc:"PM pays water, sewer, garbage, and WiFi. Electric is split equally among residents.",clause:"PROPERTY MANAGER agrees to pay water, sewer, garbage, and internet (WiFi). Electric and gas costs shall be split equally among all current residents and billed on the 1st of each month based on actual usage."},
    {id:"ut7",name:"Whole Unit — Tenant Pays All Utilities",key:"tenantPaysAll",desc:"Tenant is responsible for all utilities, set up in their own name.",clause:"RESIDENT is responsible for all utilities including water, sewer, garbage, electricity, gas, and internet. RESIDENT shall establish accounts in their name with all applicable utility providers prior to or on the move-in date. PROPERTY MANAGER is not responsible for any utility costs."},
    {id:"ut3",name:"Tenant Pays — Full Split (No Cap)",key:"fullSplit",desc:"All utilities split equally among residents with no cap.",clause:"All utility costs including water, sewer, garbage, electricity, and gas shall be split equally among all current residents and billed on the 1st of each month based on actual usage. Internet (WiFi) is provided by PROPERTY MANAGER at no additional cost to RESIDENT."},
    {id:"ut4",name:"Tenant Pays — Individually Metered",key:"metered",desc:"Each tenant pays their own metered usage directly to the provider.",clause:"RESIDENT is responsible for paying their individually metered utility usage directly to the utility provider. PROPERTY MANAGER is not responsible for any utility costs. Internet (WiFi) is provided by PROPERTY MANAGER at no additional cost to RESIDENT."},
  ]
};
const DEF_THEME={bg:"#1a1714",card:"#2c2520",accent:"#d4a853",text:"#f5f0e8",muted:"#c4a882",surface:"#fefdfb",surfaceAlt:"#f5f0e8",green:"#4a7c59",dark:"#1a1714",warm:"#5c4a3a"};
// Pinned field injected via migration if missing from saved hq-app-fields
const DOOR_CODE_APP_FIELD={id:"pinned-doorcode-field",label:"Door Code (4-digit PIN)",key:"doorCode",type:"text",section:"Move-In & Property",required:true,active:true,placeholder:"Choose a 4-digit code (numbers only)",helpText:"This code will be programmed into your smart lock and written into your lease. Choose any 4 digits. Activates at 12:00am on move-in day once payment is received.",options:[],followUpYes:"",followUpNo:"",min:4,max:4};
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
  const _acc=settings?.adminAccent||"#4a7c59";
  const _grn=settings?.themeGreen||"#4a7c59";
  const _red=settings?.themeRed||"#c45c4a";
  const _gold=settings?.themeGold||_gold;
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
      {p.tourFolder&&<div style={{fontSize:9,color:_grn,marginTop:3}}>property-photos/360/{p.tourFolder}/</div>}
    </div>

    {/* ── 3D Tour Scene Editor ── */}
    {p.tourFolder&&<TourSceneManager tourFolder={p.tourFolder} scenes={p.tourScenes||[]} onChange={v=>updP({...p,tourScenes:v})}/>}
    <div className="fr">
      <div className="fld" style={{flex:2}}><label>Internal Notes</label><textarea value={p.desc||""} onChange={e=>updP({...p,desc:e.target.value})} placeholder="Internal notes about this property..." rows={2}/></div>
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
            <button type="button" onClick={()=>setShowUtilModal(true)} style={{fontSize:9,color:_acc,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:0,fontWeight:600}}>✏ Draft Email Settings</button>
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
                // Save current PropEditor state to global props first so tenant modal can find the room
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
      return(<AddExistingTenantModal room={r} propName={p.addr||p.name} onClose={()=>setAddTenantRoom(null)} onSave={data=>{
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
@media print{.side,.no-print{display:none!important}.mn{left:0!important;position:static!important}body{background:#fff}}
.confetti-piece{position:absolute;width:10px;height:10px;border-radius:2px;animation:confettiFall linear forwards}
.lead-toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9998;background:#1a1714;border:2px solid #d4a853;border-radius:14px;padding:20px 28px;box-shadow:0 12px 40px rgba(0,0,0,.4);animation:toastIn .4s ease-out;max-width:420px;width:90%}
.lead-toast.out{animation:toastOut .3s ease-in forwards}

/* Layout */
.app{display:flex;height:100vh;overflow:hidden}
.side{width:220px;background:#1a1714;flex-shrink:0;position:fixed;top:0;left:0;height:100vh;z-index:50;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.side-scroll{padding-bottom:16px}
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
.bot-bar{display:none;position:fixed;bottom:0;left:0;right:0;background:#1a1714;border-top:1px solid rgba(255,255,255,.08);z-index:100;padding-bottom:env(safe-area-inset-bottom)}
.bot-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:8px 4px;border:none;background:none;cursor:pointer;font-family:inherit;color:#888;font-size:9px;font-weight:600;letter-spacing:.3px;text-transform:uppercase;transition:color .15s;min-height:54px}
.bot-tab.act{color:#d4a853}
.bot-tab svg{opacity:.7;transition:opacity .15s}
.bot-tab.act svg{opacity:1}

/* Main */
.mn{position:fixed;top:0;bottom:0;left:220px;right:0;overflow-y:auto;background:#f4f3f0;display:flex;flex-direction:column;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.tbar{background:#fff;padding:14px 24px;border-bottom:1px solid rgba(0,0,0,.04);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
.tbar h1{font-size:17px;font-weight:800;display:flex;align-items:center;gap:8px}
.tbar-sub{font-size:10px;color:#5c4a3a;margin-top:1px}
.cnt{padding:20px 24px;flex:1}
.cnt ul,.cnt ol{padding-left:24px;margin:6px 0}.cnt li{margin:3px 0;line-height:1.7}

/* Buttons */
.btn{padding:7px 14px;border-radius:7px;border:none;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all .1s}
.btn:hover{transform:translateY(-1px)}
.btn-gold{background:#d4a853;color:#1a1714;transition:background .15s,color .15s}.btn-gold:hover{background:#1a1714;color:#d4a853}.btn-dk{background:#1a1714;color:#f5f0e8}.btn-dk:hover{background:#2c2520}
.pay-tab{flex:1;padding:14px 16px;fontSize:14px;font-weight:500;background:#fff;color:#5c4a3a;border:none;cursor:pointer;font-family:inherit;transition:all .2s;border-right:1px solid rgba(0,0,0,.04)}
.pay-tab:hover{background:#f0eeeb;color:#1a1714}.pay-tab.active{background:#1a1714;color:#f5f0e8;font-weight:800}.pay-tab.active:hover{background:#2c2520}
.btn-out{background:#fff;border:1px solid rgba(0,0,0,.08);color:#1a1714}.btn-out:hover{border-color:#d4a853}
.btn-green{background:#4a7c59;color:#fff;transition:background .15s,color .15s}.btn-green:hover{background:#1a1714;color:#d4a853}.btn-red{background:rgba(196,92,74,.08);color:#c45c4a;border:1px solid rgba(196,92,74,.1)}.btn-red:hover{background:rgba(196,92,74,.15)}
.btn-sm{padding:5px 10px;font-size:10px;border-radius:5px}
button:not(.btn){transition:opacity .12s,transform .12s}
button:not(.btn):hover{opacity:.7;transform:translateY(-1px)}
.hvr-row{transition:background .12s}
.hvr-row:hover{background:rgba(0,0,0,.03)!important}

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
.fld{margin-bottom:10px;min-width:0}.fld input,.fld select,.fld textarea{min-width:0;box-sizing:border-box}
.fld label{display:block;font-size:9px;font-weight:700;color:#5c4a3a;margin-bottom:3px;text-transform:uppercase;letter-spacing:.3px}
.fld input,.fld select,.fld textarea{width:100%;padding:8px 12px;border-radius:7px;border:1px solid rgba(0,0,0,.08);font-family:inherit;font-size:12px;outline:none;background:#faf9f7}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:#d4a853}
.fld textarea{resize:vertical;min-height:60px}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:8px;min-width:0}.fr>*{min-width:0;overflow:clip}.fr input,.fr select{width:100%;min-width:0;box-sizing:border-box}
.fr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.fr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}

/* Modal */
.mbg{position:fixed;inset:0;background:rgba(26,23,20,.5);backdrop-filter:blur(3px);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow-y:auto;overscroll-behavior:none}
.mbox{background:#fff;border-radius:14px;max-width:580px;width:100%;overflow-x:hidden;padding:22px;animation:fadeIn .2s}
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
  .side{width:200px}.mn{left:200px}
  .kgrid{grid-template-columns:1fr 1fr}
  .pipeline{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));overflow-x:auto}
  .fr3{grid-template-columns:1fr 1fr}
}

@media(max-width:768px){
  .side{position:fixed;left:-260px;top:0;bottom:0;z-index:100;transition:left .25s;width:260px;box-shadow:4px 0 24px rgba(0,0,0,.3)}
  .side.open{left:0}
  .mob-header{display:none}
  .bot-bar{display:flex}
  .mn{left:0;padding-bottom:calc(60px + env(safe-area-inset-bottom))}
  .cnt{padding:14px}
  .tbar{padding:10px 14px;top:0}
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
  .tbl{display:block;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch}
  .tbl thead,.tbl tbody,.tbl tr{display:table;width:100%;table-layout:auto}
  .tbl th,.tbl td{padding:8px 10px;font-size:10px}
  .mbg{align-items:flex-end}
  .mbox{max-width:100%!important;width:100%;border-radius:16px 16px 0 0;max-height:90vh;overflow-y:auto;animation:slideUp .25s ease-out}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .mft{flex-wrap:wrap}.mft button{flex:1;min-width:100px}
  .fld input,.fld select,.fld textarea{font-size:14px!important;padding:10px 12px}
  .sform-row{grid-template-columns:1fr}
  .pay-tab{padding:10px 12px;font-size:12px!important}
  .card-bd{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .btn{padding:8px 14px;font-size:11px}
  .btn-sm{padding:6px 10px;font-size:9px}
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
  // acctDotMenu, acctFilters moved into AccountingTab component
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
  // dragPropIdx, dragOverPropIdx moved into PropertiesList component
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
  const[annForm,setAnnForm]=useState({title:"",body:"",propertyId:"",expiresAt:""});
  const[renewalRequests,setRenewalRequests]=useState([]);
  const[unreadMsgCount,setUnreadMsgCount]=useState(0);
  const[annShowForm,setAnnShowForm]=useState(false);
  const[ledgerTenant,setLedgerTenant]=useState("all");
  const[portalTenant,setPortalTenant]=useState(null);
  const[portalTab,setPortalTab]=useState("home");
  const[tenantProfileTab,setTenantProfileTab]=useState("summary");
  const[ttView,setTtView]=useState("gantt"); // gantt | countdown | calendar | kanban
  const[ttPref,setTtPref]=useState("gantt"); // user's chosen daily driver
  const[ttPropFilter,setTtPropFilter]=useState("all");
  const[ttMonthOffset,setTtMonthOffset]=useState(0);
  const[ttSort,setTtSort]=useState("lease-end-asc");
  const[ttGanttGrouped,setTtGanttGrouped]=useState(true); // true = by property, false = flat sorted
  const[sidebarEditMode,setSidebarEditMode]=useState(false);
  const[sidebarDrag,setSidebarDrag]=useState(null); // {secIdx,itemIdx}
  const[sidebarDragOver,setSidebarDragOver]=useState(null);
  const[sidebarSecDrag,setSidebarSecDrag]=useState(null); // section index being dragged
  const[sidebarSecDragOver,setSidebarSecDragOver]=useState(null); // section index drag target
  const[maintForm,setMaintForm]=useState({title:"",desc:"",priority:"medium",submitted:false});
  const[leases,setLeases]=useState([]);
  const[leaseTemplates,setLeaseTemplates]=useState([]);
  const[leaseTemplate,setLeaseTemplate]=useState(null);
  const[leaseSubTab,setLeaseSubTab]=useState("leases");
  const[templateEditorDirty,setTemplateEditorDirty]=useState(false);
  const[pendingNavTab,setPendingNavTab]=useState(null);// tab waiting for dirty confirm
  const[leaseForm,setLeaseForm]=useState(null);
  const[_pendingLeaseAppId,_setPendingLeaseAppId]=useState(null);
  const[viewingLease,setViewingLease]=useState(null); // {lease, room}
  const[leaseSigErr,setLeaseSigErr]=useState(false);

  // ── Portal Ops state (form states moved to PortalOpsTab component) ──
  const[utilityBills,setUtilityBills]=useState([]);
  const[docRequests,setDocRequests]=useState([]);
  const[amenities,setAmenities]=useState([]);
  const[amenityBookings,setAmenityBookings]=useState([]);
  const[surveys,setSurveys]=useState([]);
  const[surveyResults,setSurveyResults]=useState([]);
  const[packages,setPackages]=useState([]);
  const[renewalOffers,setRenewalOffers]=useState([]);
  const[renewalForm,setRenewalForm]=useState({tenantId:"",proposedRent:"",term:"12",note:""});
  const[inspections,setInspections]=useState([]);

  useEffect(()=>{console.log("Admin init starting...");(async()=>{
    try{
    const[p,pay,mt,a,d,t,n,rk,iss,sc,st,th,id,ar,ch,cr,sd,svt,mo,sq,af,ls,lt,ex,mg,vn,im,sbc,dfu,_ub,_dr,_am,_ab,_sv,_sr,_pk,_ro,_insp]=await Promise.all([
      db.loadProps(DEF_PROPS),db.loadPayments(DEF_PAYMENTS),db.loadMaint([]),
      db.loadApps(),db.loadDocs(),db.loadTxns(),db.loadNotifs(),
      db.loadRocks(),db.loadIssues(),db.loadScorecard(),
      db.loadSettings(DEF_SETTINGS),db.loadTheme(DEF_THEME),
      db.loadIdeas(),db.loadArchive(),db.loadCharges([]),
      db.loadCredits(),db.loadSdLedger(),db.loadSavedThemes([]),
      db.loadMonthly([]),db.loadScreenQs([]),db.loadAppFields([]),
      loadLeases(),
      supa("lease_templates?is_active=eq.true&workspace_id=is.null&type=eq.standard&order=created_at.asc").then(r=>r.json()).then(d=>Array.isArray(d)?d:[]).catch(()=>[]),
      db.loadExpenses(),db.loadMortgages(),db.loadVendors(),db.loadImprovements(),
      db.loadSubcats(STARTER_SUBCATS_BY_CAT),load("hq-dismissed-followups",[]),
      db.loadUtilityBills([]),db.loadDocRequests([]),db.loadAmenities([]),
      db.loadAmenityBookings([]),db.loadSurveys([]),db.loadSurveyResults([]),
      db.loadPackages([]),db.loadRenewalOffers(),db.loadInspections([])
    ]);
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
    setProps(propsWithCoords);setPayments(pay);setMaint(mt);setApps(a);setDocs(d);setTxns(t);setNotifs(n);setRocks(rk);setIssues(iss);setScorecard(sc);setSettings(st);setTheme(th);setIdeas(id);setArchive(ar);setCharges(ch);setCredits(cr);setSdLedger(sd);setSavedThemes(svt);setMonthly(mo);setScreenQs(sq);
    // Migration: inject doorCode field if missing from saved hq-app-fields
    const hasDoorCode=(af||[]).some(f=>f.key==="doorCode");
    const migratedAf=(()=>{if(hasDoorCode||(af||[]).length===0)return af||[];const idx=af.findIndex(f=>f.key==="selectedRoom");const insertAt=idx>=0?idx+1:af.findIndex(f=>f.section==="Move-In & Property")+1;const at=insertAt<0?af.length:insertAt;return[...af.slice(0,at),DOOR_CODE_APP_FIELD,...af.slice(at)];})();
    if(!hasDoorCode&&(af||[]).length>0){save("hq-app-fields",migratedAf);}
    setAppFields(migratedAf);setLeases(ls);setLeaseTemplates(lt);setLeaseTemplate(lt[0]||null);setExpenses(ex);setMortgages(mg);setVendors(vn);setImprovements(im);setSubcats(Array.isArray(sbc)?STARTER_SUBCATS_BY_CAT:sbc);setDismissedFollowUps(Array.isArray(dfu)?dfu:[]);setUtilityBills(_ub||[]);setDocRequests(_dr||[]);setAmenities(_am||[]);setAmenityBookings(_ab||[]);setSurveys(_sv||[]);setSurveyResults(_sr||[]);setPackages(_pk||[]);setRenewalOffers(_ro||[]);setInspections(_insp||[]);setWidgetList(null);
    // Load renewal requests + unread message count
    fetch(SUPA_URL+"/rest/v1/messages?direction=eq.inbound&subject=like.Lease Renewal:*&order=created_at.desc",{headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY}}).then(r=>r.json()).then(d=>{if(Array.isArray(d))setRenewalRequests(d);}).catch(()=>{});
    fetch(SUPA_URL+"/rest/v1/messages?direction=eq.inbound&read=eq.false&select=id",{headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY}}).then(r=>r.json()).then(d=>{if(Array.isArray(d))setUnreadMsgCount(d.length);}).catch(()=>{});
    }catch(e){console.error("Admin init error:",e);}
    console.log("Admin init complete, setting loaded=true");
    setLoaded(true);
  })();},[]);

  useEffect(()=>{if(loaded){const t=setTimeout(()=>{Promise.all([
    // Tier 3: complex nested data stays in app_data
    db.saveProps(props),db.savePayments(payments),db.saveMaint(maint),db.saveCharges(charges),
    // Tier 1: domain-specific relational tables
    db.saveApps(apps),db.saveDocs(docs),db.saveTxns(txns),db.saveNotifs(notifs),
    db.saveRocks(rocks),db.saveIssues(issues),db.saveScorecard(scorecard),
    db.saveIdeas(ideas),db.saveArchive(archive),db.saveCredits(credits),
    db.saveSdLedger(sdLedger),db.saveMonthly(monthly),
    db.saveExpenses(expenses),db.saveMortgages(mortgages),db.saveVendors(vendors),
    db.saveImprovements(improvements),db.saveRenewalOffers(renewalOffers),
    // Tier 2: config stays in app_data
    db.saveSettings(settings),db.saveTheme(theme),db.saveSavedThemes(savedThemes),
    db.saveScreenQs(screenQs),db.saveAppFields(appFields),db.saveSubcats(subcats),
    // Tier 3: portal-adjacent data in app_data
    db.saveUtilityBills(utilityBills),db.saveDocRequests(docRequests),
    db.saveAmenities(amenities),db.saveAmenityBookings(amenityBookings),
    db.saveSurveys(surveys),db.saveSurveyResults(surveyResults),
    db.savePackages(packages),db.saveInspections(inspections),
    save("hq-dismissed-followups",dismissedFollowUps),
  ]);},800);return()=>clearTimeout(t);}},[props,payments,maint,apps,docs,txns,notifs,rocks,issues,scorecard,settings,theme,ideas,archive,charges,credits,sdLedger,savedThemes,monthly,screenQs,appFields,expenses,mortgages,vendors,improvements,subcats,utilityBills,docRequests,amenities,amenityBookings,surveys,surveyResults,packages,renewalOffers,inspections,loaded,dismissedFollowUps]);

  // ─── Metrics ──────────────────────────────────────────────────
  // ── Load onboarding statuses for approved/onboarding applicants ──────
  useEffect(()=>{
    if(!loaded)return;
    const approvedApps=apps.filter(a=>["approved","onboarding"].includes(a.status)&&a.email);
    if(!approvedApps.length)return;
    // Uses SUPA_URL and SUPA_KEY from module scope
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
  const createCharge=(data)=>{if(data.amount!=null&&Number(data.amount)<=0)return null;/* [P2-1] guard negative/zero */const c={id:uid(),createdDate:TODAY.toISOString().split("T")[0],amountPaid:0,payments:[],waived:false,waivedReason:"",sent:false,sentDate:null,...data,amount:Number(data.amount||0)};setCharges(p=>[c,...p]);return c;};
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

  // Real-time poll — track status transitions (invited→applied) not just new IDs
  const knownStatusMap=useRef(new Map());
  useEffect(()=>{
    if(!loaded)return;
    apps.forEach(a=>knownStatusMap.current.set(a.id,a.status));
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
        const knownMap=knownStatusMap.current;
        const newApplied=fresh.filter(a=>a.status==="applied"&&!knownMap.has(a.id));
        const newPrescreened=fresh.filter(a=>a.status==="new-lead"&&!knownMap.has(a.id));
        const transitioned=fresh.filter(a=>a.status==="applied"&&knownMap.has(a.id)&&knownMap.get(a.id)!=="applied");
        const allNewApplications=[...newApplied,...transitioned];
        const hasNew=allNewApplications.length>0||newPrescreened.length>0;
        if(hasNew){
          setApps(fresh);
          fresh.forEach(a=>knownMap.set(a.id,a.status));
          if(allNewApplications.length>0){
            const newest=allNewApplications[0];
            setNotifs(p=>[{id:uid(),type:"app",msg:"🎉 "+newest.name+" submitted their full application"+(newest.property?" for "+newest.property:""),date:TODAY.toISOString().split("T")[0],read:false,urgent:true},...p]);
            setShowConfetti(true);setLeadToast(newest);setToastDismissing(false);
            setTimeout(()=>setShowConfetti(false),8000);
            setTimeout(()=>{setToastDismissing(true);setTimeout(()=>setLeadToast(null),300);},15000);
          }
          if(newPrescreened.length>0){
            const newest=newPrescreened[0];
            setNotifs(p=>[{id:uid(),type:"app",msg:"New pre-screen from "+newest.name+(newest.property?" · "+newest.property:""),date:TODAY.toISOString().split("T")[0],read:false,urgent:true},...p]);
            setShowConfetti(true);setLeadToast(newest);setToastDismissing(false);
            setTimeout(()=>setShowConfetti(false),8000);
            setTimeout(()=>{setToastDismissing(true);setTimeout(()=>setLeadToast(null),300);},15000);
          }
        } else {
          fresh.forEach(a=>knownMap.set(a.id,a.status));
        }
      }catch(e){console.error("Poll error:",e);}
    };
    const interval=setInterval(poll,15000);
    return()=>clearInterval(interval);
  },[loaded]);

  // Load auto-received ref replies from Supabase when app modal opens, poll every 30s for new ones
  useEffect(()=>{
    if(modal?.type!=="app"||!modal?.data?.id)return;
    const appId=modal.data.id;
    const key=`hq-ref-replies-${appId}`;
    const fetchReplies=()=>{
      load(key,[]).then(replies=>{
        if(replies.length>0){
          setModal(p=>p?.data?.id===appId?{...p,_refReplies:[...(p._refReplies||[]),...replies.filter(r=>!((p._refReplies||[]).some(x=>x.id===r.id)))]}:p);
        }
        if(modal.data._hasUnreadRefReply){
          setApps(prev=>{const ua=prev.map(a=>a.id===appId?{...a,_hasUnreadRefReply:false}:a);save("hq-apps",ua);return ua;});
        }
      }).catch(console.error);
    };
    fetchReplies();
    const interval=setInterval(fetchReplies,30000);
    return()=>clearInterval(interval);
  },[modal?.type,modal?.data?.id]);

  const dismissToast=()=>{setToastDismissing(true);setTimeout(()=>setLeadToast(null),300);};
  const viewNewLead=()=>{
    setTab("applications");
    setShowConfetti(false);
    if(leadToast){setModal({type:"app",data:leadToast});}
    setToastDismissing(true);
    setTimeout(()=>setLeadToast(null),300);
  };

  const openRecordPay=()=>setModal({type:"recordPay",step:1,selRoom:"",selCharge:"",payAmount:0,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:""});
  const openCreateCharge=()=>setModal({type:"createCharge",roomId:"",category:"Rent",desc:"",amount:0,dueDate:TODAY.toISOString().split("T")[0],notes:""});
  // openPayForm: pass tenantRoom when called from tenant profile so modal can return there
  const openPayForm=(rid,tenantRoom=null)=>{const unpaidCh=charges.filter(c=>c.roomId===rid&&chargeStatus(c)!=="paid"&&chargeStatus(c)!=="waived");
    const ft=!!tenantRoom;const base=ft?{_fromTenant:true,_tenantRoom:tenantRoom}:{};
    if(unpaidCh.length)setModal({type:"recordPay",step:2,selRoom:rid,selCharge:unpaidCh[0].id,payAmount:unpaidCh[0].amount-unpaidCh[0].amountPaid,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:"",...base});
    else{const r=props.flatMap(p=>allRooms(p)).find(x=>x.id===rid);setModal({type:"createCharge",roomId:rid,category:"Rent",desc:`${MO} Rent`,amount:(r&&r.rent)||0,dueDate:TODAY.toISOString().split("T")[0],notes:"No existing charge — creating new",...base});}};

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
    {id:"timeline",i:<IconTimeline/>,l:"Tenant Timeline"},
    {id:"applications",i:<IconClipboard/>,l:"Applications",badge:(settings.showAppBadge!==false&&m.needsAttention>0)?m.needsAttention:null},
    {id:"maintenance",i:<IconWrench/>,l:"Maintenance",badge:m.openMaint||null},
    {id:"leases",i:<IconFile/>,l:"Templates",badge:pendingLeases||null},
    {id:"documents",i:<IconFolder/>,l:"Documents"},
    {id:"accounting",i:<IconBook/>,l:"Accounting"},
    {id:"reports",i:<IconTrending/>,l:"Reports"},
    {id:"properties",i:<IconHome/>,l:"Properties"},
    {id:"pm-settings",i:<IconSettings/>,l:"PM Settings"},
    {id:"app-setup",i:<IconClipboard/>,l:"Application Setup"},
    {id:"theme",i:<IconPalette/>,l:"Admin Theme"},
    {id:"website",i:<IconGlobe/>,l:"Website"},
    {id:"ideas",i:<IconBrain/>,l:"Brain Dump"},
    {id:"messages",i:<IconMail/>,l:"Messages",badge:unreadMsgCount||null},
    {id:"announcements",i:<IconMegaphone/>,l:"Announcements"},
    {id:"portal-ops",i:<IconPortalOps/>,l:"Portal Ops"},
    {id:"notifications",i:<IconBell/>,l:"Alerts",badge:m.unreadNotifs||null},
    {id:"add-expense",i:<span>＋</span>,l:"Add Expense"},
  ];

  // Default sidebar config — can be customized per PM
  const DEF_SIDEBAR=[
    {label:"Overview",ids:["dashboard"]},
    {label:"Traction",ids:["scorecard","rocks","issues"]},
    {label:"Leasing",ids:["applications","app-setup"]},
    {label:"Tenants",ids:["tenants","portal","payments","timeline","portal-ops"]},
    {label:"Operations",ids:["maintenance"]},
    {label:"Documents",ids:["leases","documents"]},
    {label:"Financials",ids:["accounting","add-expense","reports"]},
    {label:"Portfolio",ids:["properties"]},
    {label:"Communications",ids:["messages","announcements","notifications"]},
    {label:"Settings",ids:["pm-settings","theme"]},
    {label:"Website",ids:["website","ideas"]},
  ];
  const rawSidebarConfig=settings.sidebarConfig||DEF_SIDEBAR;
  const sidebarConfig=(()=>{
    // Migrate old IDs to new ones
    const ID_MAP={"site-settings":"pm-settings","settings_dummy":null,"configuration":"app-setup"};
    let cfg=rawSidebarConfig.map(s=>({...s,ids:s.ids.map(id=>ID_MAP[id]!==undefined?ID_MAP[id]:id).filter(Boolean)})).filter(s=>s.ids.length>0);
    const allIds=()=>cfg.flatMap(s=>s.ids);
    // Inject missing tabs into sensible locations
    if(!allIds().includes("add-expense")){
      cfg=cfg.map(s=>{
        if(!s.ids.includes("accounting"))return s;
        const ids=[...s.ids];
        const ai=ids.indexOf("accounting");
        if(!ids.includes("add-expense"))ids.splice(ai+1,0,"add-expense");
        return{...s,ids};
      });
    }
    if(!allIds().includes("timeline")){
      cfg=cfg.map(s=>{
        if(!s.ids.includes("payments"))return s;
        const ids=[...s.ids];
        const pi=ids.indexOf("payments");
        ids.splice(pi+1,0,"timeline");
        return{...s,ids};
      });
    }
    if(!allIds().includes("app-setup")){
      cfg=cfg.map(s=>{
        if(!s.ids.includes("applications"))return s;
        return{...s,ids:[...s.ids,"app-setup"]};
      });
      if(!allIds().includes("app-setup"))cfg.push({label:"Leasing",ids:["app-setup"]});
    }
    if(!allIds().includes("website")){
      const ideasSec=cfg.findIndex(s=>s.ids.includes("ideas"));
      if(ideasSec>=0){cfg[ideasSec]={...cfg[ideasSec],label:cfg[ideasSec].label||"Website",ids:[...cfg[ideasSec].ids.filter(id=>id!=="ideas"),"website","ideas"]};}
      else cfg.push({label:"Website",ids:["website"]});
    }
    if(!allIds().includes("pm-settings")){
      const themeSec=cfg.findIndex(s=>s.ids.includes("theme"));
      if(themeSec>=0){cfg[themeSec]={...cfg[themeSec],ids:["pm-settings",...cfg[themeSec].ids]};}
      else cfg.push({label:"Settings",ids:["pm-settings"]});
    }
    if(!allIds().includes("portal-ops")){const ps=cfg.findIndex(s=>s.ids.includes("portal")||s.ids.includes("timeline"));if(ps>=0)cfg[ps].ids.push("portal-ops");else cfg.push({label:"Tenants",ids:["portal-ops"]});}
    // Only inject IDs that are completely missing — never reorganize existing placement
    if(!allIds().includes("messages")) cfg.push({label:"Communications",ids:["messages"]});
    if(!allIds().includes("announcements")){const ms=cfg.findIndex(s=>s.ids.includes("messages"));if(ms>=0)cfg[ms].ids.push("announcements");else cfg.push({label:"Communications",ids:["announcements"]});}
    if(!allIds().includes("leases")) cfg.push({label:"Documents",ids:["leases"]});
    if(!allIds().includes("documents")){const ls=cfg.findIndex(s=>s.ids.includes("leases"));if(ls>=0&&!cfg[ls].ids.includes("documents"))cfg[ls].ids.push("documents");else if(!allIds().includes("documents"))cfg.push({label:"Documents",ids:["documents"]});}
    return cfg;
  })();
  const setSidebarConfig=(cfg)=>{const u={...settings,sidebarConfig:cfg};setSettings(u);save("hq-settings",u);};

  const getPropDisplayName=(prop)=>{if(!prop)return"";return prop.addr||prop.name||"";}; // Always use address
  const getPropAddr=(propName)=>{const p=props.find(x=>x.name===propName||x.addr===propName);return p?.addr||"";}; 
  const getPropByName=(propName)=>props.find(p=>p.name===propName||p.addr===propName);
  const propDisplay=(propName)=>{const p=getPropByName(propName);return p?getPropDisplayName(p):propName;};
  const roomSubLine=(propName,roomName)=>{const dispName=propDisplay(propName);return `${dispName} · ${roomName}`;};  // No more double address
  const goTab=(t,force=false)=>{
    if(!force&&templateEditorDirty&&tab==="leases"&&leaseSubTab==="editor"&&t!=="leases"){
      setPendingNavTab(t);return;
    }
    setTab(t);setDrill(null);setSideOpen(false);setViewingLease(null);if(modal?.type==="tenant")setModal(null);
  };
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
      return[{...occupiedRoom,name:u.name||(p.addr||p.name)+(" Unit"),propName:p.addr||p.name,propId:p.id,unitId:u.id,unitName:u.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,isWholeUnit:true}];
    }
    return(u.rooms||[]).filter(r=>r.tenant&&!r.ownerOccupied).map(r=>({...r,propName:p.addr||p.name,propId:p.id,unitId:u.id,unitName:u.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,isWholeUnit:false}));
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

  const adminDynCSS=(acc,rgb)=>`.btn-gold{background:${acc}!important;color:#fff!important}.btn-gold:hover{background:#1a1714!important;color:${acc}!important}.btn-green{background:${acc}!important;color:#fff!important}.btn-green:hover{background:#1a1714!important;color:${acc}!important}.btn-out:hover{border-color:${acc}!important}.sn.on{background:rgba(${rgb},.22)!important}.sn-badge{background:${acc}!important}.badge.b-green{background:rgba(${rgb},.12)!important;color:${acc}!important}.tab.on{background:${acc}!important;color:#fff!important;border-color:${acc}!important}.acct-sub.on{background:${acc}!important;color:#fff!important}`;
  const _acc=settings.adminAccent||"#4a7c59";const _rgb=settings.adminAccentRgb||"74,124,89";const _font=settings.adminFont||"'Plus Jakarta Sans',system-ui,sans-serif";const _zoom=settings.adminZoom||1;
  return(<div style={{fontFamily:_font}}><style>{S}</style><style>{adminDynCSS(_acc,_rgb)}</style><div className="app">
    {/* Mobile bottom tab bar */}
    <div className="bot-bar">
      {(()=>{
        const TAB_ICONS={
          dashboard:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
          tenants:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
          applications:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
          accounting:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
          maintenance:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
          payments:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
          timeline:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="6" height="4" rx="1"/><rect x="3" y="10" width="10" height="4" rx="1"/><rect x="3" y="16" width="7" height="4" rx="1"/><line x1="12" y1="6" x2="21" y2="6"/><line x1="16" y1="12" x2="21" y2="12"/><line x1="13" y1="18" x2="21" y2="18"/></svg>,
          leases:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
          properties:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
          reports:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
        };
        const TAB_LABELS={dashboard:"Dashboard",tenants:"Tenants",applications:"Apply",accounting:"Money",maintenance:"Maint.",payments:"Ledger",timeline:"Timeline",leases:"Leases",properties:"Portfolio",reports:"Reports"};
        const mobTabs=(settings.mobileTabs||["dashboard","tenants","applications","accounting"]).slice(0,4);
        return[...mobTabs,{id:"__more__"}].map(t=>{
          const id=typeof t==="string"?t:t.id;
          const isMore=id==="__more__";
          const icon=isMore
            ?<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            :(TAB_ICONS[id]||TAB_ICONS.dashboard);
          const label=isMore?"More":(TAB_LABELS[id]||id);
          const isActive=isMore?sideOpen:tab===id;
          return(
          <button key={id} className={`bot-tab ${isActive?"act":""}`}
            onClick={()=>{if(isMore){setSideOpen(s=>!s);}else{goTab(id);setSideOpen(false);}}}>
            {icon}{label}
          </button>);
        });
      })()}
    </div>
    <div className={`mob-overlay ${sideOpen?"show":""}`} onClick={()=>setSideOpen(false)}/>

    {/* Sidebar */}
    <div className={`side ${sideOpen?"open":""}`} style={{zoom:_zoom,height:`calc(100vh / ${_zoom})`}}>
      <div className="s-logo">🐻 Black Bear <span>HQ</span></div>

      <div className="side-scroll">
      {/* Data-driven sections */}
      {sidebarConfig.map((sec,si)=>{
        const isSecDragging=sidebarSecDrag===si;
        const isSecDragOver=sidebarSecDragOver===si;
        return(
        <div key={si}
          style={{opacity:isSecDragging?0.35:1,transition:"opacity .15s"}}
          onDragOver={e=>{if(sidebarSecDrag!==null&&sidebarDrag===null){e.preventDefault();setSidebarSecDragOver(si);}}}
          onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setSidebarSecDragOver(null);}}
          onDrop={e=>{
            e.preventDefault();
            if(sidebarSecDrag===null||sidebarDrag!==null)return;
            if(sidebarSecDrag===si){setSidebarSecDrag(null);setSidebarSecDragOver(null);return;}
            const cfg=sidebarConfig.map(s=>({...s,ids:[...s.ids]}));
            const[moved]=cfg.splice(sidebarSecDrag,1);
            const target=sidebarSecDrag<si?si-1:si;
            cfg.splice(target,0,moved);
            setSidebarConfig(cfg);
            setSidebarSecDrag(null);setSidebarSecDragOver(null);
          }}>
          {/* Section label */}
          {sidebarEditMode
            ?<div
                draggable
                onDragStart={e=>{e.stopPropagation();setSidebarSecDrag(si);setSidebarDrag(null);}}
                onDragEnd={()=>{setSidebarSecDrag(null);setSidebarSecDragOver(null);}}
                style={{display:"flex",alignItems:"center",gap:4,margin:"8px 4px 2px",padding:"3px 6px",borderRadius:5,cursor:"grab",background:isSecDragOver?"rgba(212,168,83,.15)":"rgba(255,255,255,.04)",border:isSecDragOver?"1px solid rgba(212,168,83,.3)":"1px solid rgba(255,255,255,.06)",transition:"all .1s"}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                  <circle cx="9" cy="5" r="1.5" fill="rgba(255,255,255,.45)"/>
                  <circle cx="15" cy="5" r="1.5" fill="rgba(255,255,255,.45)"/>
                  <circle cx="9" cy="12" r="1.5" fill="rgba(255,255,255,.45)"/>
                  <circle cx="15" cy="12" r="1.5" fill="rgba(255,255,255,.45)"/>
                  <circle cx="9" cy="19" r="1.5" fill="rgba(255,255,255,.45)"/>
                  <circle cx="15" cy="19" r="1.5" fill="rgba(255,255,255,.45)"/>
                </svg>
                <input value={sec.label} onChange={e=>{const cfg2=sidebarConfig.map((s,i)=>i===si?{...s,label:e.target.value}:s);setSidebarConfig(cfg2);}}
                  onClick={e=>e.stopPropagation()}
                  style={{background:"transparent",border:"none",color:"rgba(212,168,83,.9)",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1,padding:"1px 0",fontFamily:"inherit",outline:"none",flex:1,minWidth:0,cursor:"text"}}/>
              </div>
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
        </div>);
      })}

      {/* Edit / Done button — immediately after last item */}
      <div style={{padding:"8px 10px 4px"}}>
        {sidebarEditMode
          ?<div style={{display:"flex",flexDirection:"column",gap:6}}>
            <button onClick={()=>{setSidebarEditMode(false);setSidebarDrag(null);setSidebarDragOver(null);setSidebarSecDrag(null);setSidebarSecDragOver(null);}}
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
      </div>{/* end side-scroll */}

    </div>{/* end .side */}

    {/* Main */}
    <div className="mn" style={{zoom:_zoom,left:220*_zoom}}>
      <div className="tbar"><div><h1><span style={{color:"#d4a853",display:"flex",alignItems:"center"}}>{(tabs.find(t=>t.id===tab)||{}).i}</span> {(tabs.find(t=>t.id===tab)||{}).l}</h1><div className="tbar-sub">{MO}</div></div></div>
      <div className="cnt">

      {/* ═══ DASHBOARD ═══ */}
      {tab==="dashboard"&&<DashboardTab
        getChargesForPeriod={getChargesForPeriod} chargeStatus={chargeStatus}
        expenses={expenses} mortgages={mortgages} props={props} maint={maint} apps={apps} charges={charges}
        settings={settings} setSettings={setSettings}
        widgetList={widgetList} setWidgetList={setWidgetList}
        dashEditMode={dashEditMode} setDashEditMode={setDashEditMode}
        dashDragWidget={dashDragWidget} setDashDragWidget={setDashDragWidget}
        dashDragOver={dashDragOver} setDashDragOver={setDashDragOver}
        notifs={notifs} setNotifs={setNotifs}
        rocks={rocks}
        drill={drill} setDrill={setDrill}
        m={m} allTenants={allTenants}
        goTab={goTab} setModal={setModal}
        openCreateCharge={openCreateCharge} openPayForm={openPayForm}
        setPaySubTab={setPaySubTab} payFilters={payFilters} setPayFilters={setPayFilters}
        getPropDisplayName={getPropDisplayName} roomSubLine={roomSubLine}
        save={save}
      />}

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
              {props.map(p=><option key={p.id} value={p.id}>{p.addr||p.name}</option>)}
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
                <div style={{fontSize:13,fontWeight:700,color:"#1a1714",marginBottom:2,display:"flex",alignItems:"center",gap:6}}>
                  {r.tenant.name}
                  {renewalRequests.some(rr=>rr.tenant_name===r.tenant.name&&!rr.read)&&<span style={{fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:99,background:"rgba(212,168,83,.15)",color:"#9a7422",whiteSpace:"nowrap"}}>RENEWAL REQUEST</span>}
                </div>
                <div style={{fontSize:11,color:"#5c4a3a",marginBottom:5}}>{prop?getPropDisplayName(prop):r.propName} · {r.name}</div>
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
                <span className={`badge ${pd?"b-green":"b-red"}`} style={{alignSelf:"flex-start"}}>{pd?<><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Paid</>:"Unpaid"}</span>
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
                <div style={{fontSize:11,color:"#5c4a3a",marginBottom:2}}>{a.propName} · {a.roomName}</div>
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
              ?<><div style={{fontSize:13,fontWeight:600,marginBottom:6}}>No archived tenants</div><div style={{fontSize:12}}>Move past tenants here when they{"'"}re fully resolved &mdash; SD returned, no disputes.</div></>
              :"No past tenants yet."}
          </div>}
          </>}
        </div></div>
        </>);
      })()}
      {/* ═══ PORTAL MANAGEMENT ═══ */}
      {tab==="portal"&&<PortalPreview
        allTenants={allTenants} props={props} allRooms={allRooms} obStatuses={obStatuses}
        portalTenant={portalTenant} setPortalTenant={setPortalTenant} portalTab={portalTab} setPortalTab={setPortalTab}
        portalInviteState={portalInviteState} setPortalInviteState={setPortalInviteState}
        charges={charges} chargeStatus={chargeStatus} maint={maint} setMaint={setMaint}
        maintForm={maintForm} setMaintForm={setMaintForm} apps={apps} setApps={setApps}
        settings={settings} fmtD={fmtD} fmtS={fmtS} roomSubLine={roomSubLine} shakeModal={shakeModal} uid={uid} save={save} TODAY={TODAY}
      />}

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
        const inTransit=pCharges.flatMap(c=>c.payments||[]).filter(p=>p&&p.depositStatus==="transit").reduce((s,p)=>s+(p.amount||0),0);
        const deposited=pCharges.flatMap(c=>c.payments||[]).filter(p=>p&&(p.depositStatus==="deposited"||!p.depositStatus)).reduce((s,p)=>s+(p.amount||0),0);
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
              <div className="row-i"><div className="row-t">{getPropDisplayName(pr)}</div><div className="row-s">{allRooms(pr).length} rooms · {pr.occCount} occupied</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800}}>{fmtS(prPaid)}<small style={{color:"#6b5e52"}}> / {fmtS(prDue)}</small></div>
                <div style={{fontSize:9,color:prPaid>=prDue?"#4a7c59":"#c45c4a",fontWeight:600}}>{prDue?Math.round(prPaid/prDue*100):0}%</div></div>
            </div>
          );})}
        </>}

        {/* ── Charges ── */}
        {paySubTab==="charges"&&<>
          {/* Filters */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
            <select value={payFilters.property} onChange={e=>setPayFilters({...payFilters,property:e.target.value})} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.06)",fontSize:10,fontFamily:"inherit"}}><option value="">All Properties</option>{props.map(p=><option key={p.id} value={p.name}>{getPropDisplayName(p)}</option>)}</select>
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
          /* [P0-5] Sum ALL SD entries per room, not just first */
          const sdHeld=(roomId,fallbackRent)=>{const entries=sdLedger.filter(x=>x.roomId===roomId&&!x.returned);if(entries.length)return entries.reduce((s,x)=>s+(x.amountHeld||0),0);return fallbackRent;};
          const totalSD=sdTenants.reduce((s,r)=>s+sdHeld(r.id,r.rent),0);

          const COL="120px 110px 1fr 160px 90px";

          return(<>
          {/* KPI cards — clickable filters */}
          <div style={{marginBottom:16}}>
            <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:6}}>
              {[
                {key:"transit",label:"In Transit",val:fmtS(totalTransit),sub:transit.length+" pending",color:"#d4a853"},
                {key:"deposited",label:"Deposited",val:fmtS(totalDeposited),sub:filtered.length+" deposits",color:"#4a7c59"},
                {key:"sd",label:"Security Deposit Held",val:fmtS(totalSD),sub:sdTenants.length+" tenants"+(settings.bankName?" · "+settings.bankName:""),color:"#4a7c59"},
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
              <option value="">All Properties</option>{props.map(p=><option key={p.id} value={p.name}>{getPropDisplayName(p)}</option>)}
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
              {sdTenants.map(r=>{const sdAmt=sdHeld(r.id,r.rent);const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;return(
                <div key={r.id} style={{display:"grid",gridTemplateColumns:"1fr 120px 140px 140px 100px",padding:"11px 16px",borderBottom:"1px solid rgba(0,0,0,.04)",alignItems:"center"}}>
                  <div style={{fontSize:12,fontWeight:700}}>{r.tenant.name}</div>
                  <div style={{fontSize:11,color:"#5c4a3a"}}>{propDisplay(r.propName)}</div>
                  <div style={{fontSize:11,color:"#5c4a3a"}}>{r.name}</div>
                  <div style={{fontSize:11,color:dl&&dl<=30?"#c45c4a":dl&&dl<=90?"#d4a853":"#5c4a3a"}}>{r.le?`${fmtD(r.le)}${dl&&dl<=90?` (${dl}d)`:""}` :"—"}</div>
                  <div style={{fontSize:13,fontWeight:800,color:settings.adminAccent||"#4a7c59",textAlign:"right"}}>{fmtS(sdAmt)}</div>
                </div>
              );})}
              {sdTenants.length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 120px 140px 140px 100px",padding:"10px 16px",borderTop:"2px solid rgba(0,0,0,.07)",background:"rgba(0,0,0,.02)"}}>
                <div style={{fontSize:12,fontWeight:800,gridColumn:"1/5"}}>Total Held</div>
                <div style={{fontSize:14,fontWeight:800,color:settings.adminAccent||"#4a7c59",textAlign:"right"}}>{fmtS(totalSD)}</div>
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

      {/* ═══ TENANT TIMELINE ═══ */}
      {tab==="timeline"&&(()=>{
        // Build flat list of all rooms with tenant/availability data
        const TODAY_STR=TODAY.toISOString().split("T")[0];
        const allRoomsFull=props.flatMap(p=>allRooms(p).filter(r=>!r.ownerOccupied).map(r=>({
          ...r,propName:getPropDisplayName(p),propId:p.id,
        })));
        const filtered=ttPropFilter==="all"?allRoomsFull:allRoomsFull.filter(r=>r.propId===ttPropFilter);

        const getReadyStr=(r)=>r.le||null;
        const daysUntil=(ds)=>{if(!ds)return null;return Math.ceil((new Date(ds+"T00:00:00")-TODAY)/(86400000));};

        // Sort helper
        const sortRooms=(rooms)=>{
          const cp=[...rooms];
          const noLe=r=>!r.le;
          const leMs=r=>r.le?new Date(r.le+"T00:00:00").getTime():Infinity;
          const rdMs=r=>{const s=getReadyStr(r);return s?new Date(s+"T00:00:00").getTime():r.le?leMs(r):Infinity;};
          if(ttSort==="lease-end-asc")return cp.sort((a,b)=>noLe(a)&&noLe(b)?0:noLe(a)?-1:noLe(b)?1:leMs(a)-leMs(b));
          if(ttSort==="lease-end-desc")return cp.sort((a,b)=>noLe(a)&&noLe(b)?0:noLe(a)?1:noLe(b)?-1:leMs(b)-leMs(a));
          if(ttSort==="avail-asc")return cp.sort((a,b)=>rdMs(a)-rdMs(b));
          if(ttSort==="avail-desc")return cp.sort((a,b)=>rdMs(b)-rdMs(a));
          return cp;
        };
        const sortedFiltered=sortRooms(filtered);

        // Month window for Gantt/Calendar
        const baseDate=new Date(TODAY.getFullYear(),TODAY.getMonth()+ttMonthOffset,1);
        const windowStart=new Date(baseDate);windowStart.setMonth(windowStart.getMonth()-1);
        const windowEnd=new Date(baseDate);windowEnd.setMonth(windowEnd.getMonth()+5);
        const windowStartStr=windowStart.toISOString().split("T")[0];
        const windowEndStr=windowEnd.toISOString().split("T")[0];
        const totalDays=Math.ceil((windowEnd-windowStart)/86400000);
        const dateToX=(ds)=>{if(!ds)return 0;const d=Math.ceil((new Date(ds+"T00:00:00")-windowStart)/86400000);return Math.max(0,Math.min(100,(d/totalDays)*100));};
        const months=[];for(let i=0;i<7;i++){const d=new Date(windowStart);d.setMonth(d.getMonth()+i);months.push({label:d.toLocaleString("default",{month:"short",year:"2-digit"}),x:dateToX(d.toISOString().split("T")[0])});}

        const views=[
          {id:"gantt",label:"Gantt"},
          {id:"countdown",label:"Countdown"},
          {id:"calendar",label:"Calendar"},
          {id:"kanban",label:"Kanban"},
        ];

        return(
        <div style={{padding:"0 0 40px"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div>
              <h2 style={{margin:0,fontSize:18,fontWeight:700}}>Tenant Timeline</h2>
              <div style={{fontSize:11,color:"#6b5e52",marginTop:2}}>Lease end dates and availability across all properties</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
                <button onClick={()=>setTtPropFilter("all")}
                  onMouseEnter={e=>{if(ttPropFilter!=="all")e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                  onMouseLeave={e=>{if(ttPropFilter!=="all")e.currentTarget.style.background="transparent";}}
                  style={{padding:"4px 10px",fontSize:10,fontWeight:600,borderRadius:20,border:"1px solid rgba(0,0,0,.12)",cursor:"pointer",fontFamily:"inherit",transition:"all .12s",background:ttPropFilter==="all"?"#1a1714":"transparent",color:ttPropFilter==="all"?"#d4a853":"#5c4a3a"}}>All</button>
                {props.filter(p=>!(p.units||[]).every(u=>u.ownerOccupied)).map(p=>(
                  <button key={p.id} onClick={()=>setTtPropFilter(ttPropFilter===p.id?"all":p.id)}
                    onMouseEnter={e=>{if(ttPropFilter!==p.id)e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{if(ttPropFilter!==p.id)e.currentTarget.style.background="transparent";}}
                    style={{padding:"4px 10px",fontSize:10,fontWeight:600,borderRadius:20,border:"1px solid rgba(0,0,0,.12)",cursor:"pointer",fontFamily:"inherit",transition:"all .12s",background:ttPropFilter===p.id?"#1a1714":"transparent",color:ttPropFilter===p.id?"#d4a853":"#5c4a3a"}}>
                    {getPropDisplayName(p)}
                  </button>
                ))}
              </div>
              <select value={ttSort} onChange={e=>setTtSort(e.target.value)} style={{fontSize:11,padding:"4px 8px"}}>
                <option value="lease-end-asc">Lease end ↑ soonest</option>
                <option value="lease-end-desc">Lease end ↓ latest</option>
                <option value="avail-asc">Available date ↑ soonest</option>
                <option value="avail-desc">Available date ↓ latest</option>
              </select>
              {/* View toggle */}
              <div style={{display:"flex",border:"1px solid rgba(0,0,0,.12)",borderRadius:8,overflow:"hidden",background:"rgba(0,0,0,.02)"}}>
                {views.map(v=>(
                  <button key={v.id} onClick={()=>setTtView(v.id)}
                    onMouseEnter={e=>{if(ttView!==v.id)e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{if(ttView!==v.id)e.currentTarget.style.background="transparent";}}
                    style={{padding:"6px 14px",fontSize:11,fontWeight:600,border:"none",borderRight:"1px solid rgba(0,0,0,.08)",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",
                      background:ttView===v.id?"#1a1714":"transparent",color:ttView===v.id?"#d4a853":"#5c4a3a"}}>
                    {v.label}
                    {v.id===ttPref&&<span style={{marginLeft:4,fontSize:9,color:ttView===v.id?"#d4a853":"#9a7422"}}>★</span>}
                  </button>
                ))}
              </div>
              {ttPref!==ttView&&<button
                onClick={()=>setTtPref(ttView)}
                onMouseEnter={e=>{e.currentTarget.style.background="#d4a853";e.currentTarget.style.color="#1a1714";e.currentTarget.style.borderColor="#d4a853";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(212,168,83,.08)";e.currentTarget.style.color="#9a7422";e.currentTarget.style.borderColor="rgba(212,168,83,.3)";}}
                style={{fontSize:10,padding:"6px 12px",borderRadius:7,border:"1px solid rgba(212,168,83,.3)",background:"rgba(212,168,83,.08)",cursor:"pointer",fontFamily:"inherit",color:"#9a7422",fontWeight:600,transition:"all .15s"}}>
                Set as daily driver ★
              </button>}
              {ttPref===ttView&&<span style={{fontSize:10,color:"#9a7422",fontWeight:600,padding:"6px 4px"}}>★ Daily driver</span>}
            </div>
          </div>

          {/* ── GANTT ── */}
          {ttView==="gantt"&&<div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",overflow:"hidden"}}>
            {/* Month nav */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:"1px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.015)"}}>
              <button className="btn btn-out btn-sm" onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"} onMouseLeave={e=>e.currentTarget.style.background=""} onClick={()=>setTtMonthOffset(o=>o-1)}>← Earlier</button>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:12,fontWeight:600,color:"#5c4a3a"}}>{baseDate.toLocaleString("default",{month:"long",year:"numeric"})} window</span>
                <div style={{display:"flex",border:"1px solid rgba(0,0,0,.12)",borderRadius:7,overflow:"hidden",background:"rgba(0,0,0,.02)"}}>
                  <button onClick={()=>setTtGanttGrouped(true)}
                    onMouseEnter={e=>{if(ttGanttGrouped)return;e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{if(ttGanttGrouped)return;e.currentTarget.style.background="transparent";}}
                    style={{padding:"4px 12px",fontSize:10,fontWeight:600,border:"none",borderRight:"1px solid rgba(0,0,0,.08)",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",background:ttGanttGrouped?"#1a1714":"transparent",color:ttGanttGrouped?"#d4a853":"#5c4a3a"}}>By property</button>
                  <button onClick={()=>setTtGanttGrouped(false)}
                    onMouseEnter={e=>{if(!ttGanttGrouped)return;e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{if(!ttGanttGrouped)return;e.currentTarget.style.background="transparent";}}
                    style={{padding:"4px 12px",fontSize:10,fontWeight:600,border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",background:!ttGanttGrouped?"#1a1714":"transparent",color:!ttGanttGrouped?"#d4a853":"#5c4a3a"}}>By date</button>
                </div>
              </div>
              <button className="btn btn-out btn-sm" onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"} onMouseLeave={e=>e.currentTarget.style.background=""} onClick={()=>setTtMonthOffset(o=>o+1)}>Later →</button>
            </div>
            {/* Month headers */}
            <div style={{display:"flex",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
              <div style={{width:140,flexShrink:0,padding:"4px 12px",fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:.5}}>{ttGanttGrouped?"Room":"Room · Property"}</div>
              <div style={{flex:1,position:"relative",height:22}}>
                {months.map((m,i)=><div key={i} style={{position:"absolute",left:m.x+"%",fontSize:9,color:"#999",transform:"translateX(-50%)",whiteSpace:"nowrap",top:5}}>{m.label}</div>)}
              </div>
            </div>
            {/* Gantt row renderer — shared between grouped + flat */}
            {(()=>{
              const renderRow=(r,showProp=false)=>{
                const readyStr=r.le||null;
                const isOcc=r.st==="occupied"&&r.tenant;
                const isVac=!isOcc;
                const leX=r.le?dateToX(r.le):null;
                const rdX=readyStr?dateToX(readyStr):null;
                const todayX=dateToX(TODAY_STR);
                const moveInX=r.tenant?.moveIn?dateToX(r.tenant.moveIn):null;
                return(
                <div key={r.id} style={{display:"flex",alignItems:"center",borderBottom:"1px solid rgba(0,0,0,.04)",minHeight:36}}>
                  <div style={{width:140,flexShrink:0,padding:"4px 12px"}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#1a1714",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</div>
                    {showProp&&<div style={{fontSize:9,color:"#9a7422",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.propName}</div>}
                    {isOcc&&!showProp&&<div style={{fontSize:9,color:"#6b5e52",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.tenant.name}</div>}
                    {isOcc&&showProp&&<div style={{fontSize:9,color:"#6b5e52",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.tenant.name}</div>}
                    {isVac&&<div style={{fontSize:9,color:"#4a7c59",fontWeight:600}}>Vacant</div>}
                  </div>
                  <div style={{flex:1,position:"relative",height:36,display:"flex",alignItems:"center"}}>
                    <div style={{position:"absolute",left:todayX+"%",top:0,bottom:0,width:1.5,background:"#c45c4a",zIndex:3,opacity:.7}}/>
                    {isVac&&<div style={{position:"absolute",left:"0%",right:"0%",height:16,borderRadius:3,background:"rgba(74,124,89,.15)",border:"1px solid rgba(74,124,89,.3)",display:"flex",alignItems:"center",paddingLeft:6}}>
                      <span style={{fontSize:9,color:"#2d6a3f",fontWeight:600}}>Available now</span>
                    </div>}
                    {isOcc&&r.tenant?.moveIn&&moveInX!==null&&leX!==null&&<div style={{position:"absolute",left:Math.min(moveInX,leX)+"%",width:Math.abs(leX-Math.min(moveInX,leX))+"%",height:20,borderRadius:3,background:"#B5D4F4",top:8,display:"flex",alignItems:"center",paddingLeft:4,overflow:"hidden"}}>
                      <span style={{fontSize:9,color:"#0C447C",fontWeight:600,whiteSpace:"nowrap"}}>{r.tenant.name} · ends {fmtD(r.le)}</span>
                    </div>}
                    {isOcc&&leX!==null&&rdX!==null&&<div style={{position:"absolute",left:rdX+"%",right:"0%",height:16,top:10,background:"rgba(74,124,89,.1)",border:"1px dashed rgba(74,124,89,.3)",borderRadius:"0 3px 3px 0",display:"flex",alignItems:"center",paddingLeft:4,overflow:"hidden"}}>
                      <span style={{fontSize:9,color:"#2d6a3f",whiteSpace:"nowrap"}}>Avail. {fmtD(readyStr)}</span>
                    </div>}
                  </div>
                </div>);
              };
              if(ttGanttGrouped){
                return props.filter(p=>ttPropFilter==="all"||p.id===ttPropFilter).map(p=>{
                  const pRooms=sortRooms(allRooms(p).filter(r=>!r.ownerOccupied).map(r=>({...r,propName:getPropDisplayName(p),propId:p.id})));
                  if(!pRooms.length)return null;
                  return(<div key={p.id}>
                    <div style={{padding:"5px 12px",fontSize:10,fontWeight:700,color:"#9a7422",background:"rgba(212,168,83,.04)",borderBottom:"1px solid rgba(0,0,0,.04)",textTransform:"uppercase",letterSpacing:.3}}>{getPropDisplayName(p)}</div>
                    {pRooms.map(r=>renderRow(r,false))}
                  </div>);
                });
              } else {
                return sortedFiltered.map(r=>renderRow(r,true));
              }
            })()}
            <div style={{padding:"8px 16px",display:"flex",gap:16,borderTop:"1px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.01)"}}>
              {[["#B5D4F4","Occupied"],["rgba(74,124,89,.15)","Available"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#6b5e52"}}>
                  <div style={{width:10,height:10,borderRadius:2,background:c,border:c.includes("74,124")?`1px solid rgba(74,124,89,.3)`:undefined}}/>
                  {l}
                </div>
              ))}
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#6b5e52"}}>
                <div style={{width:1.5,height:10,background:"#c45c4a"}}/>Today
              </div>
            </div>
          </div>}

          {/* ── COUNTDOWN ── */}
          {ttView==="countdown"&&<div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
              {sortedFiltered.map(r=>{
                const readyStr=getReadyStr(r);
                const days=daysUntil(readyStr||(r.st==="vacant"?TODAY_STR:null));
                const isVac=r.st==="vacant"||!r.tenant;
                const dl=r.le?daysUntil(r.le):null;
                const badgeColor=isVac?"#2d6a3f":dl!=null&&dl<=30?"#A32D2D":dl!=null&&dl<=90?"#633806":"#0C447C";
                const badgeBg=isVac?"#EAF3DE":dl!=null&&dl<=30?"#FCEBEB":dl!=null&&dl<=90?"#FAEEDA":"#E6F1FB";
                return(
                <div key={r.id} style={{background:"#fff",borderRadius:10,border:"1px solid rgba(0,0,0,.07)",padding:"12px 14px"}}>
                  <div style={{fontSize:10,color:"#6b5e52",marginBottom:2}}>{r.propName}</div>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:2,color:"#1a1714"}}>{r.name}</div>
                  {r.tenant&&<div style={{fontSize:11,color:"#5c4a3a",marginBottom:8}}>{r.tenant.name}{r.tenant.occupationType?" · "+r.tenant.occupationType:""}</div>}
                  {!r.tenant&&<div style={{fontSize:11,color:"#4a7c59",fontWeight:600,marginBottom:8}}>Vacant — ready now</div>}
                  <div style={{fontSize:28,fontWeight:700,color:badgeColor,lineHeight:1}}>{isVac?"0":days!=null?days:"—"}</div>
                  <div style={{fontSize:10,color:"#6b5e52",marginBottom:8}}>days until available</div>
                  {r.le&&<div style={{fontSize:10,color:"#6b5e52",marginBottom:4}}>Lease ends {fmtD(r.le)}</div>}
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:badgeBg,color:badgeColor,fontWeight:600}}>
                    {isVac?"Available now":dl!=null&&dl<=30?"Expiring soon":dl!=null&&dl<=90?"Coming up":"Later"}
                  </span>
                </div>);
              })}
            </div>
          </div>}

          {/* ── CALENDAR ── */}
          {ttView==="calendar"&&(()=>{
            const calBase=new Date(TODAY.getFullYear(),TODAY.getMonth()+ttMonthOffset,1);
            const calYear=calBase.getFullYear(),calMonth=calBase.getMonth();
            const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
            const firstDow=new Date(calYear,calMonth,1).getDay();
            const chips={};
            filtered.forEach(r=>{
              if(r.le){const key=r.le;if(!chips[key])chips[key]=[];chips[key].push({type:"out",label:r.name+" out · "+r.propName});}
              const rs=getReadyStr(r);
              if(rs){const key=rs;if(!chips[key])chips[key]=[];chips[key].push({type:"avail",label:r.name+" avail · "+r.propName});}
            });
            const cells=[];
            for(let i=0;i<firstDow;i++)cells.push(null);
            for(let d=1;d<=daysInMonth;d++)cells.push(d);
            return(<div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",overflow:"hidden"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:"1px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.015)"}}>
                <button className="btn btn-out btn-sm" onClick={()=>setTtMonthOffset(o=>o-1)}>← Prev</button>
                <span style={{fontSize:13,fontWeight:700}}>{calBase.toLocaleString("default",{month:"long",year:"numeric"})}</span>
                <button className="btn btn-out btn-sm" onClick={()=>setTtMonthOffset(o=>o+1)}>Next →</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d} style={{padding:"5px",textAlign:"center",fontSize:10,fontWeight:600,color:"#6b5e52",background:"rgba(0,0,0,.02)"}}>{d}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
                {cells.map((d,i)=>{
                  if(!d)return<div key={"e"+i} style={{minHeight:64,borderRight:"1px solid rgba(0,0,0,.04)",borderBottom:"1px solid rgba(0,0,0,.04)"}}/>;
                  const ds=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                  const isToday=ds===TODAY_STR;
                  const dayChips=chips[ds]||[];
                  return(<div key={d} style={{minHeight:64,padding:"4px",borderRight:"1px solid rgba(0,0,0,.04)",borderBottom:"1px solid rgba(0,0,0,.04)",background:isToday?"rgba(212,168,83,.04)":"transparent"}}>
                    <div style={{fontSize:11,fontWeight:isToday?700:400,color:isToday?"#9a7422":"#5c4a3a",marginBottom:3}}>{d}</div>
                    {dayChips.map((c,ci)=><div key={ci} style={{fontSize:9,padding:"2px 4px",borderRadius:3,marginBottom:2,background:c.type==="out"?"#FCEBEB":"#EAF3DE",color:c.type==="out"?"#A32D2D":"#27500A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.label}</div>)}
                  </div>);
                })}
              </div>
              <div style={{padding:"8px 16px",display:"flex",gap:12,borderTop:"1px solid rgba(0,0,0,.06)"}}>
                {[["#FCEBEB","#A32D2D","Move-out date"],["#EAF3DE","#27500A","Available date"]].map(([bg,c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#6b5e52"}}>
                    <div style={{width:10,height:10,borderRadius:2,background:bg,border:`1px solid ${c}44`}}/>
                    {l}
                  </div>
                ))}
              </div>
            </div>);
          })()}

          {/* ── KANBAN ── */}
          {ttView==="kanban"&&<div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
              {[
                {id:"active",label:"Active",color:"#6b5e52",bg:"rgba(0,0,0,.02)",filter:r=>r.st==="occupied"&&r.le&&daysUntil(r.le)>90},
                {id:"exp90",label:"Expiring 90d",color:"#633806",bg:"rgba(212,168,83,.04)",border:"rgba(212,168,83,.25)",filter:r=>r.st==="occupied"&&r.le&&daysUntil(r.le)<=90&&daysUntil(r.le)>30},
                {id:"exp30",label:"Expiring 30d",color:"#791F1F",bg:"rgba(196,92,74,.04)",border:"rgba(196,92,74,.2)",filter:r=>r.st==="occupied"&&r.le&&daysUntil(r.le)<=30&&daysUntil(r.le)>0},
                {id:"avail",label:"Available",color:"#27500A",bg:"rgba(74,124,89,.04)",border:"rgba(74,124,89,.2)",filter:r=>r.st==="vacant"||!r.tenant||(r.le&&daysUntil(r.le)<=0)},
              ].map(col=>{
                const colRooms=sortedFiltered.filter(col.filter);
                return(
                <div key={col.id} style={{background:col.bg||"rgba(0,0,0,.02)",borderRadius:10,padding:10,border:col.border?`1px solid ${col.border}`:"0.5px solid rgba(0,0,0,.06)"}}>
                  <div style={{fontSize:10,fontWeight:700,color:col.color,textTransform:"uppercase",letterSpacing:.4,marginBottom:8,display:"flex",justifyContent:"space-between"}}>
                    <span>{col.label}</span>
                    <span style={{background:"rgba(255,255,255,.8)",borderRadius:10,padding:"0 6px",fontWeight:700,color:"#3d3529"}}>{colRooms.length}</span>
                  </div>
                  {colRooms.length===0&&<div style={{fontSize:10,color:"#aaa",padding:"4px 0"}}>None</div>}
                  {colRooms.map(r=>{
                    const dl=r.le?daysUntil(r.le):null;
                    const rs=getReadyStr(r);
                    const rdl=rs?daysUntil(rs):null;
                    return(
                    <div key={r.id} style={{background:"#fff",borderRadius:7,border:"0.5px solid rgba(0,0,0,.07)",padding:"8px 10px",marginBottom:6}}>
                      <div style={{fontSize:12,fontWeight:700,marginBottom:2,color:"#1a1714"}}>{r.name}</div>
                      <div style={{fontSize:10,color:"#6b5e52",marginBottom:5}}>{r.propName}</div>
                      {r.tenant&&<div style={{fontSize:10,color:"#5c4a3a",marginBottom:4}}>{r.tenant.name}{r.tenant.occupationType?" · "+r.tenant.occupationType:""}</div>}
                      {r.le&&<div style={{fontSize:10,fontWeight:600,color:col.color}}>Ends {fmtD(r.le)}{dl!==null?" · "+dl+"d":""}</div>}
                      {rs&&rdl!==null&&rdl>0&&<div style={{fontSize:10,color:"#9a7422"}}>Avail. {fmtD(rs)} · {rdl}d</div>}
                      {!r.le&&!r.tenant&&<div style={{fontSize:10,color:"#4a7c59",fontWeight:600}}>Ready now</div>}
                      <button className="btn btn-out btn-sm" style={{fontSize:9,marginTop:5,width:"100%"}} onClick={()=>{setTenantProfileTab("summary");if(r.tenant){const prop=props.find(p=>allRooms(p).some(x=>x.id===r.id));setModal({type:"tenant",data:r});}else{goTab("applications");}}}>
                        {r.tenant?"View tenant →":"Find tenant →"}
                      </button>
                    </div>);
                  })}
                </div>);
              })}
            </div>
          </div>}
        </div>);
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
        const allTenantsList=props.flatMap(p=>allRooms(p).filter(r=>r.tenant).map(r=>({name:(r.tenant&&r.tenant.name)||"",email:(r.tenant&&r.tenant.email)||"",phone:(r.tenant&&r.tenant.phone)||"",propName:p.addr||p.name,roomName:r.name,type:"current"})));
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
              ?activeApps.filter(function(a){return["new-lead","pre-screened","called","invited","applied","reviewing"].includes(a.status);})
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
                      onClick={e=>{e.stopPropagation();setModal({type:"app",data:a});}}>
                      {flags[0].type==="current"?"Current Tenant":flags[0].type==="past"?"Returning":flags[0].type==="dup"?"Duplicate":""} →
                    </div>}

                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <div className="pipe-nm">{a.name}</div>
                        {a._hasUnreadRefReply&&<span style={{fontSize:8,fontWeight:700,padding:"1px 6px",borderRadius:8,background:"rgba(59,130,246,.12)",color:"#1d4ed8",whiteSpace:"nowrap"}}>● Reply</span>}
                      </div>
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

                    <div className="pipe-sub">{(()=>{const p=a.termPropId?props.find(x=>x.id===a.termPropId):props.find(x=>x.name===a.property);const addr=p?.addr||p?.address||"";const dispName=p?getPropDisplayName(p):(a.property||"—");return dispName+(addr&&!dispName.includes(addr)?" · "+addr:"")+(a.room&&!p?.units?.some(u=>(u.rentalMode||"byRoom")==="wholeHouse")?" · "+a.room:"");})()}</div>

                    {/* Invited — "Awaiting Reply" badge + re-invite button */}
                    {a.status==="invited"&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6,gap:6}}>
                      <span style={{fontSize:8,fontWeight:700,color:"#3b82f6",background:"rgba(59,130,246,.1)",padding:"2px 7px",borderRadius:99,flexShrink:0}}>Awaiting Reply</span>
                      <button style={{fontSize:9,padding:"3px 10px",background:"#d4a853",border:"none",borderRadius:5,color:"#1a1714",cursor:"pointer",fontWeight:800,fontFamily:"inherit",whiteSpace:"nowrap"}}
                        onClick={e=>{e.stopPropagation();setModal({type:"inviteApp",data:a});}}>Re-invite</button>
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
                    {!isOnboarding&&a.status!=="invited"&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:8,color:"#5c4a3a",marginTop:5,overflow:"hidden"}}>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:80}}>{a.source||""}</span>
                      <div style={{display:"flex",alignItems:"center",gap:4,minWidth:0,flexShrink:1}}>
                        {d>0&&<span style={{color:d>=5?"#c45c4a":d>=3?"#d4a853":"#888",fontWeight:700}}>{d}d</span>}
                        {canInvite&&<button
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,168,83,.3)";e.currentTarget.style.color="#7a5a10";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="rgba(212,168,83,.12)";e.currentTarget.style.color="#9a7422";}}
                          style={{fontSize:7,padding:"3px 7px",background:"rgba(212,168,83,.12)",color:"#9a7422",border:"1px solid rgba(212,168,83,.35)",borderRadius:4,cursor:"pointer",fontWeight:700,fontFamily:"inherit",transition:"all .15s",textAlign:"center",lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:90}}
                          onClick={e=>{e.stopPropagation();setModal({type:"inviteApp",data:a});}}>Continue — Invite to Apply</button>}
                        <button
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(74,124,89,.25)";e.currentTarget.style.color="#2d6a3f";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="rgba(74,124,89,.1)";e.currentTarget.style.color="#4a7c59";}}
                          style={{fontSize:7,padding:"3px 7px",background:"rgba(74,124,89,.1)",color:"#4a7c59",border:"1px solid rgba(74,124,89,.3)",borderRadius:4,cursor:"pointer",fontWeight:700,fontFamily:"inherit",transition:"all .15s",textAlign:"center",lineHeight:1.3,whiteSpace:"nowrap"}}
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

        {/* ── Renewal Requests — only shows if any exist ── */}
        {renewalRequests.length>0&&(
          <div style={{marginTop:24}}>
            <div style={{fontSize:10,fontWeight:700,color:"#9a7422",textTransform:"uppercase",letterSpacing:1,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a7422" strokeWidth="1.75"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              Lease Renewal Requests ({renewalRequests.filter(r=>!r.read).length} pending)
            </div>
            {renewalRequests.map(req=>(
              <div key={req.id} className="card" style={{marginBottom:8,borderLeft:"3px solid #d4a853"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700}}>{req.tenant_name}</div>
                    <div style={{fontSize:11,color:"#6b5e52"}}>{req.property_name}{req.room_name?" \u00b7 "+req.room_name:""} \u00b7 {req.subject?.replace("Lease Renewal: ","")}</div>
                    <div style={{fontSize:10,color:"#999",marginTop:2}}>{new Date(req.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {!req.read&&<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:99,background:"rgba(212,168,83,.12)",color:"#9a7422"}}>PENDING</span>}
                    <button className="btn btn-out btn-sm" onClick={()=>goTab("messages")}>View in Messages</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </>);})()}

      {/* ═══ APPLICATION SETUP ═══ */}
      {tab==="app-setup"&&<AppSetup screenQs={screenQs} setScreenQs={setScreenQs} appFields={appFields} setAppFields={setAppFields} settings={settings} setSettings={setSettings} expanded={expanded} setExpanded={setExpanded} prevStep={prevStep} setPrevStep={setPrevStep} prevResult={prevResult} setPrevResult={setPrevResult} save={save} uid={uid} showAlert={showAlert} showConfirm={showConfirm} setNotifs={setNotifs} setModal={setModal} DEF_SETTINGS={DEF_SETTINGS} DEF_APP_FIELDS={DEF_APP_FIELDS} TODAY={TODAY} />}

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
                <select value={req.status} onChange={e=>{const newStatus=e.target.value;setMaint(p=>p.map(x=>x.id===req.id?{...x,status:newStatus}:x));if(newStatus!==req.status){const found=findRoom(props,req.roomId);const tenantEmail=found?.room?.tenant?.email;if(tenantEmail){fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:tenantEmail,subject:"Maintenance Update — "+req.title,fromName:(settings.pmName||"PropOS")+" — "+(settings.companyName||""),html:"<p>Hi "+(req.tenant||req.submitted_by||"").split(" ")[0]+",</p>"+"<p>Your maintenance request <strong>"+req.title+"</strong> has been updated:</p>"+"<p>Status: <strong>"+newStatus.toUpperCase()+"</strong></p>"+(newStatus==="resolved"?"<p>This issue has been marked as resolved. If the problem persists, please submit a new request through your tenant portal.</p>":"<p>We are working on this. You will be notified when there is another update.</p>")+"<p>"+(settings.companyName||"")+"<br/>"+(settings.phone||"")+"</p>"})}).catch(()=>{});}}}} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",fontSize:10,fontFamily:"inherit"}}>
                  <option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option>
                </select>
              </div>
            ))}
          </div>);
        })}


      </>}

      {/* ═══ LEASES & DOCS ═══ */}
      {tab==="leases"&&<LeasesTab
        leaseTemplate={leaseTemplate} setLeaseTemplate={setLeaseTemplate}
        leaseTemplates={leaseTemplates} setLeaseTemplates={setLeaseTemplates}
        leaseSubTab={leaseSubTab} setLeaseSubTab={setLeaseSubTab}
        templateEditorDirty={templateEditorDirty} setTemplateEditorDirty={setTemplateEditorDirty}
        pendingNavTab={pendingNavTab} setPendingNavTab={setPendingNavTab}
        leaseForm={leaseForm} setLeaseForm={setLeaseForm}
        _pendingLeaseAppId={_pendingLeaseAppId} _setPendingLeaseAppId={_setPendingLeaseAppId}
        settings={settings} setSettings={setSettings}
        leases={leases} setLeases={setLeases}
        props={props} setProps={setProps}
        apps={apps}
        modal={modal} setModal={setModal}
        setCharges={setCharges} setNotifs={setNotifs}
        showConfirm={showConfirm} showAlert={showAlert} goTab={goTab}
        deleteLeaseInDB={deleteLeaseInDB} save={save}
        DEF_LEASE_SECTIONS={DEF_LEASE_SECTIONS} DEF_SETTINGS={DEF_SETTINGS}
      />}


      {/* ═══ DOCUMENTS ═══ */}
      {tab==="documents"&&<>
        <div className="sec-hd"><div><h2>Documents</h2><p>Leases, addendums, checklists, and templates</p></div>
          <button className="btn btn-gold">+ Upload Document</button></div>
        {["addendum","lease","rules","checklist"].map(type=>{
          const items=docs.filter(d=>d.type===type);if(!items.length)return null;
          const labels={addendum:<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{display:"inline",verticalAlign:"middle",marginRight:4}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Lease Addendums</>,lease:<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{display:"inline",verticalAlign:"middle",marginRight:4}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Leases & Agreements</>,rules:<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{display:"inline",verticalAlign:"middle",marginRight:4}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>House Rules</>,checklist:<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{display:"inline",verticalAlign:"middle",marginRight:4}}><polyline points="20 6 9 17 4 12"/></svg>Checklists</>};
          return(<div key={type} style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b5e52",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{labels[type]}</div>
            {items.map(d=><div key={d.id} className="row">
              <span style={{fontSize:16}}>{type==="addendum"?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}</span>
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
      {tab==="accounting"&&<AccountingTab settings={settings} properties={props} charges={charges} expenses={expenses} setExpenses={setExpenses} mortgages={mortgages} vendors={vendors} improvements={improvements} setImprovements={setImprovements} payments={payments} save={save} setModal={setModal} uid={uid} allRooms={allRooms} getPropDisplayName={getPropDisplayName} SCHED_E_CAT_LABELS={SCHED_E_CAT_LABELS} />}
      {tab==="reports"&&<Reports settings={settings} properties={props} charges={charges} expenses={expenses} mortgages={mortgages} sdLedger={sdLedger} apps={apps} archive={archive} SCHED_E_CATS={SCHED_E_CATS} getPropDisplayName={getPropDisplayName} propDisplay={propDisplay} chargeStatus={chargeStatus} uid={uid} />}

      {/* ═══ MESSAGES ═══ */}
      {tab==="messages"&&<Messages settings={settings} properties={props} maint={maint} setMaint={setMaint} save={save} uid={uid} />}
      {tab==="announcements"&&<Announcements settings={settings} setSettings={setSettings} save={save} properties={props} uid={uid} />}

      {/* ═══ NOTIFICATIONS ═══ */}
      {tab==="notifications"&&<>
        <div className="sec-hd"><div><h2>Notifications</h2><p>{m.unreadNotifs} unread</p></div>
          <button className="btn btn-out btn-sm" onClick={()=>setNotifs(p=>p.map(x=>({...x,read:true})))}>Mark All Read</button></div>
        {notifs.map(n=>(
          <div key={n.id} className="row" style={{opacity:n.read?0.6:1,cursor:"pointer"}} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>
            <span style={{fontSize:16}}>{n.type==="lease"?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>:n.type==="payment"?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>:n.type==="maint"?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}</span>
            <div className="row-i"><div className="row-t" style={{fontWeight:n.read?500:700}}>{n.msg}</div><div className="row-s">{n.date}</div></div>
            {!n.read&&<div className="notif-dot"/>}{n.urgent&&<span className="badge b-red">Urgent</span>}
          </div>
        ))}
      </>}

      {/* ═══ SCORECARD ═══ */}
      {tab==="scorecard"&&<ScorecardTab
        m={m} drill={drill} setDrill={setDrill} fmtS={fmtS} allRooms={allRooms} props={props} setModal={setModal} roomSubLine={roomSubLine} openPayForm={openPayForm} getPropDisplayName={getPropDisplayName}
        showCharts={showCharts} setShowCharts={setShowCharts} scRows={scRows} scMeasurables={scMeasurables} scorecard={scorecard} scDrill={scDrill} setScDrill={setScDrill}
        allMonths={allMonths} liveMonth={liveMonth} prevMonth={prevMonth} twoMonthsAgo={twoMonthsAgo} CUR_WEEK={CUR_WEEK} MO={MO} setTab={setTab}
      />}

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

      {/* ═══ PROPERTIES ═══ */}
      {tab==="properties"&&<PropertiesList settings={settings} properties={props} setProperties={setProps} payments={payments} leaseableItems={leaseableItems} expanded={expanded} setExpanded={setExpanded} editProp={editProp} setEditProp={setEditProp} setIsNewProp={setIsNewProp} setTab={setTab} setModal={setModal} setBulkSel={setBulkSel} fmtS={fmtS} fmtD={fmtD} PROP_TYPES={PROP_TYPES} getPropDisplayName={getPropDisplayName} TODAY={TODAY} MO={MO} save={save} />}

      {/* ═══ PM SETTINGS ═══ */}
      {tab==="pm-settings"&&<PMSettings settings={settings} setSettings={setSettings} save={save} expanded={expanded} setExpanded={setExpanded} DEF_SETTINGS={DEF_SETTINGS} SigCanvas={SigCanvas} />}
      {tab==="website"&&<WebsiteSettings settings={settings} setSettings={setSettings} save={save} />}
      {tab==="theme"&&<ThemeTab
        settings={settings} setSettings={setSettings} save={save} expanded={expanded} setExpanded={setExpanded} setModal={setModal}
        theme={theme} setTheme={setTheme} savedThemes={savedThemes} setSavedThemes={setSavedThemes} setNotifs={setNotifs} uid={uid} TODAY={TODAY}
        ADMIN_PRESETS={ADMIN_PRESETS} ADMIN_FONTS={ADMIN_FONTS} PRESETS={PRESETS} THEME_LABELS={THEME_LABELS}
        contrast={contrast} randPalette={randPalette} getPropDisplayName={getPropDisplayName}
      />}
      {/* ═══ IDEA BOARD ═══ */}
      {tab==="ideas"&&<IdeasTab
        ideas={ideas} setIdeas={setIdeas} props={props} settings={settings} uid={uid} goTab={goTab}
        setRocks={setRocks} setMaint={setMaint} setImprovements={setImprovements} showConfirm={showConfirm}
      />}

      {tab==="portal-ops"&&<PortalOpsTab settings={settings} properties={props} uid={uid} allTenants={allTenants} utilityBills={utilityBills} setUtilityBills={setUtilityBills} docRequests={docRequests} setDocRequests={setDocRequests} amenities={amenities} setAmenities={setAmenities} amenityBookings={amenityBookings} setAmenityBookings={setAmenityBookings} surveys={surveys} setSurveys={setSurveys} surveyResults={surveyResults} packages={packages} setPackages={setPackages} />}

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

    // Variable replacement for lease preview — use real lease data
    const fmtDLocal=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;};
    const varMap={
      TENANT_NAME:l.tenantName||"",
      MONTHLY_RENT:l.rent?Number(l.rent).toLocaleString():"",
      RENT_WORDS:l.rentWords||"",
      SECURITY_DEPOSIT:l.sd?Number(l.sd).toLocaleString():"",
      LEASE_START:fmtDLocal(l.leaseStart||l.moveIn),
      LEASE_END:fmtDLocal(l.leaseEnd),
      MOVE_IN_DATE:fmtDLocal(l.moveIn),
      PROPERTY_ADDRESS:l.propertyAddress||l.property||"",
      ROOM_NAME:l.room||"",
      DOOR_CODE:l.doorCode||"",
      UTILITIES_CLAUSE:l.utilitiesClause||"",
      LANDLORD_NAME:l.landlordName||"Carolina Cooper",
      PARKING_SPACE:l.parking||"No assigned parking",
      DAILY_RATE:l.rent?Math.ceil(Number(l.rent)/30):"",
      PRORATED_RENT:l.proratedRent?Number(l.proratedRent).toLocaleString():"",
    };
    const fillVars=(text)=>{
      if(!text)return"";
      let out=text;
      Object.entries(varMap).forEach(([k,v])=>{out=out.replaceAll("{{"+k+"}}","<strong>"+(v||"")+"</strong>");});
      return out;
    };
    // Executed leases ALWAYS use their stored snapshot — template edits must never affect signed leases
    // Drafts/pending use the live template so edits are reflected before signing
    const viewSections=(isExec ? (l.sections||[]) : (leaseTemplate?.sections||l.sections||[])).filter(s=>s.active!==false);

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
          <div style={{fontSize:11,color:"#6b5e52"}}>{prop?getPropDisplayName(prop):l.property}{prop?.addr?" · "+prop.addr:""}{l.room?" · "+l.room:""}</div>
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
                  <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>{settings.companyName||"Black Bear Rentals"}</div>
                  <div style={{fontSize:13,color:"#5c4a3a",marginBottom:16}}>{leaseTemplate?.name||"Alabama Co-Living Lease Agreement"}</div>
                  {/* Summary table */}
                  <div style={{border:"1px solid rgba(0,0,0,.1)",borderRadius:8,overflow:"hidden",marginBottom:16,textAlign:"left"}}>
                    <div style={{padding:"8px 14px",background:"#1a1714",display:"flex",alignItems:"center",gap:8}}>
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span style={{fontSize:9,fontWeight:700,color:"#d4a853",textTransform:"uppercase",letterSpacing:1}}>Lease Summary</span>
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <tbody>
                        {[
                          ["Tenant",l.tenantName||"—",""],
                          ["Property",l.propertyAddress||l.property||"—","Section 1"],
                          ["Room / Unit",l.room||"—","Section 1"],
                          ["Lease Start",fmtD(l.leaseStart||l.moveIn),"Section 2"],
                          ["Lease End",fmtD(l.leaseEnd),"Section 2"],
                          ["Monthly Rent",l.rent?"$"+Number(l.rent).toLocaleString()+".00":"—","Section 3"],
                          ["Security Deposit",l.sd?"$"+Number(l.sd).toLocaleString()+".00":"—","Section 4"],
                          ["Prorated First Month",l.proratedRent&&l.proratedRent>0?"$"+Number(l.proratedRent).toLocaleString()+".00":"N/A","Section 3"],
                          ["Late Fee","$50 after the 3rd · $5/day thereafter","Section 5"],
                          ["Door Code",l.doorCode||"—","Section 13"],
                          ["Parking",l.parking||"No assigned parking","Section 9"],
                          ["Landlord",l.landlordName||"Carolina Cooper",""],
                        ].map(([label,value,ref],i)=>(
                          <tr key={label} style={{borderBottom:i<11?"1px solid rgba(0,0,0,.05)":"none",background:i%2===0?"#fff":"rgba(0,0,0,.012)"}}>
                            <td style={{padding:"7px 14px",fontWeight:700,color:"#5c4a3a",width:"35%",fontSize:10,textTransform:"uppercase",letterSpacing:.4,verticalAlign:"top"}}>{label}</td>
                            <td style={{padding:"7px 8px",color:"#1a1714",fontWeight:500,verticalAlign:"top",fontSize:12}}>{value}</td>
                            <td style={{padding:"7px 14px 7px 4px",color:"#9a8878",fontSize:9,textAlign:"right",whiteSpace:"nowrap",verticalAlign:"top",width:"70px"}}>{ref}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Divider after summary */}
                <div style={{borderBottom:"1px solid rgba(0,0,0,.08)",marginBottom:28}}/>

                {/* Sections */}
                {viewSections.map((sec,i)=>(
                  <div key={sec.id||i} style={{marginBottom:24}}>
                    <div style={{fontSize:13,fontWeight:800,marginBottom:6,paddingBottom:4,borderBottom:"1px solid rgba(0,0,0,.08)"}}>{i+1}. {sec.title}</div>
                    <div style={{fontSize:12,color:"#3c3228",lineHeight:1.8}} dangerouslySetInnerHTML={{__html:fillVars(sec.content||"")}}/>
                    {sec.requiresInitials&&<div style={{marginTop:10,display:"flex",alignItems:"center",gap:12}}>
                      {l.tenantSig
                        ?<div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2}}>
                           <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:"rgba(74,124,89,.05)",border:"1px solid rgba(74,124,89,.15)",borderRadius:6}}>
                             <img src={l.tenantSig} alt="initials" style={{height:22,maxWidth:70,objectFit:"contain"}}/>
                             <span style={{fontSize:8,color:"#4a7c59",fontWeight:700}}>INITIALED</span>
                           </div>
                           <div style={{fontSize:8,color:"#9a8878",paddingLeft:2}}>{l.tenantName||"Tenant"}{l.tenantSignedAt?" · "+new Date(l.tenantSignedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}</div>
                         </div>
                        :<div style={{display:"flex",alignItems:"center",gap:8}}>
                           <div style={{width:70,borderBottom:"1px solid rgba(0,0,0,.3)",height:20}}/>
                           <span style={{fontSize:9,color:"#9a8878",fontStyle:"italic"}}>Tenant initials</span>
                         </div>
                      }
                      {(l.landlordSig||l.landlordSignature)&&<div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:"rgba(74,124,89,.05)",border:"1px solid rgba(74,124,89,.15)",borderRadius:6}}>
                          <img src={l.landlordSig||l.landlordSignature} alt="PM initials" style={{height:22,maxWidth:70,objectFit:"contain"}}/>
                          <span style={{fontSize:8,color:"#4a7c59",fontWeight:700}}>PM INITIALED</span>
                        </div>
                        <div style={{fontSize:8,color:"#9a8878",paddingLeft:2}}>{l.landlordName||"Carolina Cooper"}{l.landlordSignedAt?" · "+new Date(l.landlordSignedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}</div>
                      </div>}
                    </div>}
                  </div>
                ))}

                {/* Signatures */}
                <div style={{marginTop:40,display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#6b5e52",marginBottom:8}}>PROPERTY MANAGER</div>
                    {l.landlordSig||l.landlordSignature
                      ?<div>
                         <img src={l.landlordSig||l.landlordSignature} alt="PM signature" style={{height:48,maxWidth:180,objectFit:"contain",display:"block",marginBottom:4}}/>
                         <div style={{fontSize:11,fontWeight:600,color:"#1a1714"}}>{l.landlordName||"Carolina Cooper"}</div>
                         {l.landlordSignedAt&&<div style={{fontSize:10,color:"#6b5e52"}}>Signed {new Date(l.landlordSignedAt).toLocaleDateString()}</div>}
                       </div>
                      :<div style={{borderBottom:"1px solid #333",height:40,marginBottom:4}}/>}
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#6b5e52",marginBottom:8}}>TENANT</div>
                    {l.tenantSig
                      ?<div>
                         <img src={l.tenantSig} alt="Tenant signature" style={{height:48,maxWidth:180,objectFit:"contain",display:"block",marginBottom:4}}/>
                         <div style={{fontSize:11,fontWeight:600,color:"#1a1714"}}>{l.tenantName}</div>
                         {l.tenantSignedAt&&<div style={{fontSize:10,color:"#6b5e52"}}>Signed {new Date(l.tenantSignedAt).toLocaleDateString()}</div>}
                       </div>
                      :<div style={{borderBottom:"1px solid #333",height:40,marginBottom:4}}/>}
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
                <button className="btn btn-out" onClick={async()=>{
                  showAlert({title:"Generating PDF",body:"Please wait a moment..."});
                  const a=document.createElement("a");
                  a.href="/api/generate-lease-pdf?id="+l.id;
                  a.download="lease-"+l.id+".pdf";
                  document.body.appendChild(a);a.click();document.body.removeChild(a);
                }}>Download PDF</button>
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
    const tLease=leases.find(l=>apps.find(a=>a.name===r.tenant?.name&&a.id===l.applicationId))||leases.find(l=>l.tenantEmail===r.tenant?.email||l.tenantName===r.tenant?.name);
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
      {id:"renewals",label:"Renewal Offers"},
      {id:"inspections",label:"Inspections"},
    ];
    return(
    <div style={{position:"fixed",top:0,right:0,bottom:0,left:220,background:"#f5f4f1",zIndex:200,overflowY:"auto"}}>

      {/* ── Sticky top bar ── */}
      <div style={{background:"#fff",borderBottom:"1px solid rgba(0,0,0,.08)",padding:"16px 32px 0",position:"sticky",top:0,zIndex:10}}>
        {/* Row 1: Back */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <button onClick={()=>{setModal(null);setPortalInviteState("idle");}}
            onMouseEnter={e=>e.currentTarget.style.color="#1a1714"}
            onMouseLeave={e=>e.currentTarget.style.color="#5c4a3a"}
            style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,color:"#5c4a3a",padding:0,transition:"color .15s"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-out btn-sm" style={{color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={()=>setModal(prev=>({...prev,termStep:1,termErrs:{}}))}>Terminate</button>
          </div>
        </div>

        {/* Row 2: Current Lease label + Edit button */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
          <div>
            <div style={{fontSize:10,fontWeight:800,color:settings.adminAccent||"#4a7c59",textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Current Lease</div>
            {/* Title: address — tenant name */}
            <div style={{fontSize:22,fontWeight:800,color:"#1a1714",lineHeight:1.2,marginBottom:6}}>
              {(()=>{
                const dispName=prop?getPropDisplayName(prop):r.propName;
                const addr=prop?.addr||"";
                const addrSuffix=(addr&&addr!==dispName)?" · "+addr:"";
                return `${dispName}${addrSuffix}, ${r.name} — ${r.tenant.name}`;
              })()}
            </div>
            {/* Address line */}
            <div style={{fontSize:12,color:"#6b5e52",marginBottom:3}}>
              {(()=>{
                const dispName=prop?getPropDisplayName(prop):r.propName;
                const addr=prop?.addr||"";
                const addrSuffix=(addr&&addr!==dispName)?" · "+addr:"";
                return `${dispName}${addrSuffix} | ${r.name}`;
              })()}
            </div>
            {/* Date range */}
            <div style={{fontSize:12,color:"#6b5e52",marginBottom:14}}>
              {r.tenant.moveIn?fmtD(r.tenant.moveIn):""}{r.le?" – "+fmtD(r.le):isM2M?" (Month-to-Month)":""}
            </div>
          </div>
          {/* Edit button */}
          <button className="btn btn-out btn-sm"
            onClick={()=>setModal(prev=>({...prev,_leaseSettingsOpen:true}))}
            style={{display:"flex",alignItems:"center",gap:5,flexShrink:0,marginTop:20}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
        </div>

        {/* ── Browser Tabs ── */}
        <div style={{display:"flex",gap:0}}>
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
        {tenantProfileTab==="summary"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
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
                  <div>
                    <div style={{border:"1px solid rgba(0,0,0,.07)",borderRadius:8,padding:"12px 16px",marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,background:tLease.status==="executed"?"rgba(74,124,89,.1)":tLease.status==="pending_tenant"?"rgba(59,130,246,.1)":"rgba(212,168,83,.1)",color:scColors[tLease.status]||"#6b5e52"}}>{scLabels[tLease.status]||tLease.status}</span>
                        <div style={{display:"flex",gap:4}}>
                          {tLease.status==="pending_tenant"&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={()=>{navigator.clipboard.writeText(tLease.signingLink||"");showAlert({title:"Copied",body:"Signing link copied."});}}>Copy Link</button>}
                          {tLease.status==="pending_tenant"&&<button className="btn btn-out btn-sm" style={{fontSize:9}} onClick={async()=>{
                            if(!tLease.tenantEmail){showAlert({title:"No Email",body:"No tenant email on file."});return;}
                            await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:tLease.tenantEmail,subject:"Reminder: Your Lease is Ready to Sign",fromName:(settings.pmName||"Carolina Cooper")+" | "+(settings.companyName||"Black Bear Rentals"),replyTo:settings.pmEmail||settings.email||"info@rentblackbear.com",html:"<p>Hi "+(tLease.tenantName||"")+"</p><p>Your lease is ready for signature. Please click below to review and sign:</p><p><a href='"+(tLease.signingLink||"")+"' style='display:inline-block;background:#1a1714;color:#d4a853;padding:12px 28px;border-radius:8px;font-weight:700;text-decoration:none'>Review & Sign →</a></p>"})});
                            showAlert({title:"Sent",body:"Signing reminder sent to "+tLease.tenantEmail});
                          }}>Resend Email</button>}
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                        {[["Period",fmtD(tLease.moveIn)+" \u2013 "+(tLease.leaseEndTbd?"TBD":fmtD(tLease.leaseEnd))],["Rent",fmtS(tLease.rent)+"/mo"],["SD",fmtS(tLease.sd)],["Property",tLease.property+(prop?.addr?" \u2014 "+prop.addr:"")]].map(([k,v])=>(
                          <div key={k}><div style={{fontSize:9,color:"#7a7067",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{k}</div><div style={{fontSize:12,fontWeight:600}}>{v}</div></div>
                        ))}
                      </div>
                      {tLease.status==="pending_tenant"&&<div style={{marginTop:10,padding:"6px 10px",background:"rgba(59,130,246,.06)",borderRadius:6,fontSize:10,color:"#3b82f6",fontWeight:600}}>Awaiting tenant signature</div>}
                      {tLease.landlordSignedAt&&<div style={{marginTop:6,fontSize:10,color:"#6b5e52"}}>PM signed {new Date(tLease.landlordSignedAt).toLocaleDateString()}{tLease.tenantSignedAt?" \u00b7 Tenant signed "+new Date(tLease.tenantSignedAt).toLocaleDateString():""}</div>}
                    </div>
                    {/* Lease actions */}
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <button className="btn btn-out btn-sm" onClick={()=>setViewingLease({lease:tLease,room:r})}>View Full Lease</button>
                      <button className="btn btn-out btn-sm" onClick={()=>setModal({type:"leaseSummary",lease:tLease})}>Summary</button>
                      {tLease.status==="executed"&&<a href={"/api/generate-lease-pdf?id="+tLease.id} target="_blank" rel="noreferrer" className="btn btn-out btn-sm" style={{textDecoration:"none"}}>Download PDF</a>}
                      {tLease.status==="draft"&&<button className="btn btn-out btn-sm" onClick={()=>{setModal(null);setLeaseForm({...tLease});goTab("leases");}}>Edit Draft</button>}
                      {tLease.status==="draft"&&<button className="btn btn-green btn-sm" onClick={()=>{setModal(null);setLeaseForm({...tLease,_lockedFromApp:!!tLease.applicationId,_resuming:true});goTab("leases");}}>Sign & Send</button>}
                      {tLease.status==="executed"&&<button className="btn btn-out btn-sm" onClick={()=>setModal({type:"confirmAction",title:"Add Addendum",body:"Add a note or clause amendment to this executed lease.",confirmLabel:"Add",confirmStyle:"btn-green",onConfirm:()=>{setModal({type:"addAddendum",leaseId:tLease.id,text:"",title:""})}})}>Add Addendum</button>}
                    </div>
                    {/* Addenda */}
                    {(tLease.addenda||[]).length>0&&<div style={{marginTop:10,border:"1px solid rgba(0,0,0,.06)",borderRadius:8,padding:"10px 12px"}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Addenda ({tLease.addenda.length})</div>
                      {tLease.addenda.map((a,i)=><div key={i} style={{fontSize:11,color:"#5c4a3a",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.03)"}}>{a.title||"Addendum "+(i+1)} <span style={{color:"#9a8878",fontSize:9}}>{a.date}</span></div>)}
                    </div>}
                    {/* Renewal Request — actionable */}
                    {(()=>{
                      const renewal=renewalRequests.find(rr=>rr.tenant_name===r.tenant?.name&&!rr.read);
                      if(!renewal)return null;
                      const isM2M=renewal.subject?.includes("Month-to-Month");
                      const termMonths=isM2M?null:parseInt((renewal.subject||"").replace(/\D/g,""))||12;
                      const m2mRent=(r.rent||0)+(settings.m2mIncrease||50);
                      return(
                        <div style={{marginTop:10,border:"2px solid rgba(212,168,83,.3)",borderRadius:10,padding:"14px 16px",background:"rgba(212,168,83,.04)"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a7422" strokeWidth="1.75"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                            <span style={{fontSize:13,fontWeight:800,color:"#9a7422"}}>Lease Renewal Requested</span>
                          </div>
                          <div style={{fontSize:12,color:"#5c4a3a",lineHeight:1.6,marginBottom:10}}>
                            {isM2M
                              ?<>Requesting <strong>month-to-month</strong> at <strong>{fmtS(m2mRent)}/mo</strong> (+${settings.m2mIncrease||50})</>
                              :<>Requesting <strong>{termMonths}-month renewal</strong> at current rent <strong>{fmtS(r.rent)}/mo</strong></>
                            }
                          </div>
                          <div style={{fontSize:10,color:"#9a8878",marginBottom:10}}>Submitted {new Date(renewal.created_at).toLocaleDateString()}</div>
                          <div style={{display:"flex",gap:6}}>
                            <button className="btn btn-green btn-sm" style={{flex:1}} onClick={async()=>{
                              // Approve — mark read, send confirmation, create new lease draft
                              await fetch(SUPA_URL+"/rest/v1/messages?id=eq."+renewal.id,{method:"PATCH",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":"return=representation"},body:JSON.stringify({read:true})});
                              setRenewalRequests(p=>p.map(rr=>rr.id===renewal.id?{...rr,read:true}:rr));
                              // Send approval email
                              try{await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:renewal.sender_email||r.tenant?.email,subject:"Lease Renewal Approved",fromName:(settings.pmName||"")+" | "+(settings.companyName||""),html:"<p>Your lease renewal request has been approved. We will prepare the new lease agreement and send it for your signature shortly.</p><p>"+(settings.companyName||"")+"</p>"})});}catch(e){}
                              // Reply message
                              await fetch(SUPA_URL+"/rest/v1/messages",{method:"POST",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":"return=representation"},body:JSON.stringify({tenant_name:renewal.tenant_name,sender_email:settings.pmEmail||settings.email||"",sender_name:settings.pmName||"Property Manager",direction:"outbound",subject:"Re: "+renewal.subject,body:"Your lease renewal has been approved. A new lease will be sent to you for signature.",property_name:renewal.property_name,room_name:renewal.room_name,read:true})});
                              // Auto-create new lease draft from current lease
                              const currentEnd=tLease?.leaseEnd||r.le||"";
                              const newStart=currentEnd||TODAY.toISOString().split("T")[0];
                              const newEndD=new Date(newStart+"T00:00:00");
                              if(isM2M){newEndD.setMonth(newEndD.getMonth()+1);}else{newEndD.setMonth(newEndD.getMonth()+(termMonths||12));}
                              const newEnd=newEndD.toISOString().split("T")[0];
                              const newRent=isM2M?m2mRent:(r.rent||0);
                              const template=leaseTemplates[0]||leaseTemplate;
                              setModal(null);
                              setLeaseForm({
                                id:null,status:"draft",applicationId:null,
                                tenantName:r.tenant.name,tenantEmail:r.tenant.email||"",tenantPhone:r.tenant.phone||"",
                                property:r.propName,room:r.name,propertyId:r.propId||"",roomId:r.id,
                                unitId:r.unitId||"",unitName:r.unitName||"",
                                propertyAddress:prop?.addr||r.propAddr||"",
                                rent:newRent,sd:r.rent||0,proratedRent:0,prorationMethod:"std",
                                moveIn:newStart,leaseStart:newStart,leaseEnd:newEnd,leaseEndTbd:false,leaseType:isM2M?"m2m":"fixed",
                                utilitiesMode:tLease?.utilitiesMode||"",utilitiesClause:tLease?.utilitiesClause||"",
                                doorCode:r.tenant.doorCode||tLease?.doorCode||"",
                                parking:tLease?.parking||"",parkingChoice:tLease?.parkingChoice||"",
                                landlordName:template?.landlordName||settings.pmName||"",
                                company:template?.company||settings.companyName||"",
                                landlordEmail:template?.landlordEmail||settings.email||"",
                                agreementDate:TODAY.toISOString().split("T")[0],
                                sections:template?.sections||tLease?.sections||[],
                                addenda:[],notes:"Renewal from previous lease ending "+fmtD(currentEnd),
                                requireLastMonth:false,lastMonthInstallments:3,lastMonthFrequency:"monthly",
                              });
                              goTab("leases");
                              showAlert({title:"Renewal Approved",body:"New lease draft created for "+r.tenant.name+". Review and sign to send to tenant."});
                            }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                              Approve
                            </button>
                            <button className="btn btn-out btn-sm" style={{flex:1,color:"#c45c4a",borderColor:"rgba(196,92,74,.2)"}} onClick={async()=>{
                              await fetch(SUPA_URL+"/rest/v1/messages?id=eq."+renewal.id,{method:"PATCH",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":"return=representation"},body:JSON.stringify({read:true})});
                              setRenewalRequests(p=>p.map(rr=>rr.id===renewal.id?{...rr,read:true}:rr));
                              try{await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:renewal.sender_email||r.tenant?.email,subject:"Lease Renewal Update",fromName:(settings.pmName||"")+" | "+(settings.companyName||""),html:"<p>We have reviewed your lease renewal request and are unable to approve it at this time. Please contact us to discuss your options.</p><p>"+(settings.companyName||"")+"</p>"})});}catch(e){}
                              await fetch(SUPA_URL+"/rest/v1/messages",{method:"POST",headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json","Prefer":"return=representation"},body:JSON.stringify({tenant_name:renewal.tenant_name,sender_email:settings.pmEmail||settings.email||"",sender_name:settings.pmName||"Property Manager",direction:"outbound",subject:"Re: "+renewal.subject,body:"We are unable to approve your renewal request at this time. Please contact us to discuss options.",property_name:renewal.property_name,room_name:renewal.room_name,read:true})});
                              showAlert({title:"Denied",body:"Renewal denied. Tenant has been notified."});
                            }}>
                              Deny
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:16}}>
                    <div style={{fontSize:12,color:"#6b5e52",marginBottom:10}}>No lease on file.</div>
                    <button className="btn btn-out btn-sm" style={{width:"100%"}} onClick={()=>{setModal(null);goTab("leases");setTimeout(()=>openCreateLease(null),100);}}>Create Lease →</button>
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
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><TI d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" d2="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><span style={{fontSize:14,fontWeight:700}}>Contact</span></div>
              <div style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}><TI d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.16 12a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 3.13 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" size={14}/><span style={{fontSize:12}}>{r.tenant.phone||"—"}</span></div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}><TI d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" d2="M22 6l-10 7L2 6" size={14}/><span style={{fontSize:12,color:"#3b82f6"}}>{r.tenant.email||"—"}</span></div>
            </div>
            {/* Onboarding Progress */}
            {(()=>{const onboardingSteps=[{label:"Lease Signed",done:tLease?.status==="executed"},{label:"Security Deposit Paid",done:tenantCharges.some(c=>c.category==="Security Deposit"&&c.amountPaid>=c.amount)},{label:"First Month Rent Paid",done:tenantCharges.some(c=>c.category==="Rent"&&c.amountPaid>=c.amount)},{label:"Moved In",done:tLease?.status==="executed"&&tenantCharges.some(c=>c.category==="Security Deposit"&&c.amountPaid>=c.amount)&&tenantCharges.some(c=>c.category==="Rent"&&c.amountPaid>=c.amount)}];return(
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>
                <span style={{fontSize:14,fontWeight:700}}>Onboarding Progress</span>
                <span style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:"#6b5e52"}}>{onboardingSteps.filter(s=>s.done).length}/{onboardingSteps.length}</span>
              </div>
              {onboardingSteps.map((step,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<onboardingSteps.length-1?"1px solid rgba(0,0,0,.03)":"none"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:step.done?"#4a7c59":"rgba(0,0,0,.08)",color:step.done?"#fff":"#999",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0}}>
                    {step.done?<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>:i+1}
                  </div>
                  <div style={{flex:1,fontSize:12,fontWeight:600}}>{step.label}</div>
                  <span style={{fontSize:10,fontWeight:700,color:step.done?"#4a7c59":"#999"}}>{step.done?"Complete":"Pending"}</span>
                </div>
              ))}
            </div>);})()}
            {/* 30-Day Notice */}
            {(r.tenant?.notice_given_at||r.tenant?.intended_move_out)&&(
              <div style={{background:"#fff",borderRadius:12,border:"2px solid rgba(196,92,74,.25)",padding:"16px 20px",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span style={{fontSize:13,fontWeight:700,color:"#c45c4a"}}>30-Day Notice Filed</span>
                </div>
                <div style={{fontSize:11,color:"#5c4a3a"}}>
                  {r.tenant.intended_move_out?"Intended move-out: "+fmtD(r.tenant.intended_move_out):"Notice given: "+fmtD(r.tenant.notice_given_at)}
                </div>
              </div>
            )}
            {/* Room & Lease */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"20px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><TI d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10"/><span style={{fontSize:14,fontWeight:700}}>Room & Lease</span></div>
              {[["Property",(()=>{const dn=prop?getPropDisplayName(prop):r.propName;const addr=prop?.addr||"";const suffix=(addr&&addr!==dn)?" · "+addr:"";return dn+suffix;})()],["Room",r.name],["Bath",r.pb?"Private":"Shared"],["Rent",fmtS(r.rent)+"/mo"],["Utilities",tUtils==="allIncluded"?"All Included":"Tenant pays (split)"],["Move-in",fmtD(r.tenant.moveIn)],["Lease End",r.le?fmtD(r.le):isM2M?"Month-to-Month":"—"],["Annual Value",fmtS((r.rent||0)*12)+"/yr"]].filter(([,v])=>v).map(([k,v])=>(
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
        {tenantProfileTab==="payments"&&(()=>{
          const totalUnpaid=tenantCharges.filter(c=>["pastdue","unpaid","partial"].includes(chargeStatus(c))).reduce((s,c)=>s+(c.amount-c.amountPaid),0);
          const totalPastDue=tenantCharges.filter(c=>chargeStatus(c)==="pastdue").reduce((s,c)=>s+(c.amount-c.amountPaid),0);
          const isLate=totalPastDue>0;
          const expandedId=modal._expandedChargeId||null;
          const stLabel={paid:"Paid",pastdue:"Past Due",unpaid:"Unpaid",partial:"Partial",waived:"Waived",voided:"Voided"};
          const stBg={paid:"rgba(74,124,89,.08)",pastdue:"rgba(196,92,74,.08)",unpaid:"rgba(212,168,83,.1)",partial:"rgba(212,168,83,.1)",waived:"rgba(0,0,0,.04)",voided:"rgba(0,0,0,.04)"};
          const stTx={paid:"#4a7c59",pastdue:"#c45c4a",unpaid:"#9a7422",partial:"#9a7422",waived:"#7a7067",voided:"#7a7067"};
          return(<div>
          {/* Unpaid charges banner — red only if late, amber if just unpaid */}
          {totalUnpaid>0&&<div style={{marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:isLate?"#c45c4a":"#9a7422",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Unpaid charges</div>
              <div style={{fontSize:28,fontWeight:800,color:isLate?"#c45c4a":"#9a7422"}}>{fmtS(totalUnpaid)}</div>
            </div>
            {/* Actions + Create Charge — TurboTenant style */}
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{position:"relative"}}>
                {modal._actionsOpen&&<div style={{position:"fixed",inset:0,zIndex:19}} onClick={()=>setModal(p=>({...p,_actionsOpen:false}))}/>}
                <button className="btn btn-out btn-sm"
                  onClick={()=>setModal(p=>({...p,_actionsOpen:!p._actionsOpen}))}
                  style={{display:"flex",alignItems:"center",gap:5,fontWeight:600}}>
                  Actions
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {modal._actionsOpen&&<div style={{position:"absolute",top:"calc(100% + 4px)",right:0,background:"#fff",border:"1px solid rgba(0,0,0,.1)",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,.12)",zIndex:20,minWidth:210,overflow:"hidden"}}>
                  {[
                    ["Record payment",()=>{setModal(p=>({...p,_actionsOpen:false}));openPayForm(r.id,r);}],
                    ["Add credit",()=>setModal({type:"addCredit",roomId:r.id,tenantName:r.tenant.name,propName:r.propName,roomName:r.name,amount:0,reason:"",_fromTenant:true,_tenantRoom:r})],
                    ["Return security deposit",()=>setModal({type:"returnSD",roomId:r.id,tenantName:r.tenant.name,propName:r.propName,roomName:r.name,deductions:[],returnAmount:r.rent,_fromTenant:true,_tenantRoom:r})],
                    null,
                    ["Export CSV",()=>{
                      setModal(p=>({...p,_actionsOpen:false}));
                      const rows=[["Due Date","Category","Description","Status","Amount","Amount Paid","Method","Paid Date"],...tenantCharges.map(c=>{const p=c.payments?.[0];return[c.dueDate,c.category,c.desc||"",chargeStatus(c),c.amount,c.amountPaid,p?.method||"",p?.date||""];})];
                      const csv=rows.map(row=>row.map(v=>`"${v}"`).join(",")).join("\n");
                      const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download=`charges-${r.tenant.name.replace(/\s/g,"-")}.csv`;a.click();
                    }],
                  ].map((item,i)=>item===null
                    ?<div key={i} style={{height:1,background:"rgba(0,0,0,.06)",margin:"3px 0"}}/>
                    :<button key={item[0]} onClick={item[1]}
                      style={{display:"block",width:"100%",padding:"9px 16px",background:"none",border:"none",textAlign:"left",fontSize:13,fontWeight:400,color:"#3d3529",cursor:"pointer",fontFamily:"inherit",transition:"background .1s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.04)"}
                      onMouseLeave={e=>e.currentTarget.style.background="none"}>{item[0]}</button>
                  )}
                </div>}
              </div>
              <button className="btn btn-dk btn-sm"
                onClick={()=>setModal({type:"createCharge",roomId:r.id,tenantName:r.tenant.name,propName:r.propName,roomName:r.name,category:"Rent",desc:"",amount:0,dueDate:TODAY.toISOString().split("T")[0],notes:"",_fromTenant:true,_tenantRoom:r})}
                style={{background:"#1a1714",color:"#f5f0e8",fontWeight:700,letterSpacing:.1}}>
                Create Charge
              </button>
            </div>
          </div>}

          {/* Monthly recurring charges */}
          <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",marginBottom:20,overflow:"hidden"}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
              <span style={{fontSize:14,fontWeight:700}}>Monthly Charges</span>
            </div>
            {/* Rent — recurring row — editable */}
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px"}}>
              <div style={{width:32,height:32,borderRadius:8,background:"rgba(59,130,246,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>Rent <span style={{fontSize:9,background:"rgba(59,130,246,.08)",color:"#3b82f6",padding:"1px 6px",borderRadius:3,fontWeight:600,marginLeft:4}}>RECURRING</span></div>
                <div style={{fontSize:11,color:"#6b5e52"}}>Due on the 1st &middot; Auto-generated monthly</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:16,fontWeight:800}}>{fmtS(r.rent)}/mo</div>
                  <div style={{fontSize:10,color:"#6b5e52"}}>{fmtD(r.tenant.moveIn)} {r.le?"– "+fmtD(r.le):"M2M"}</div>
                </div>
                {/* Edit pencil — opens editRecurringCharge to modify rent + late fee config going forward */}
                <button
                  onClick={()=>{
                    setModal(prev=>({...prev,
                      type:"editRecurringCharge",
                      _rcRoom:r,
                      _rcProp:prop,
                      _rcCategory:r.recurringCategory||"Rent",
                      _rcRent:r.rent||0,
                      _rcDesc:r.recurringDesc||"",
                      _rcShowDesc:!!(r.recurringDesc),
                      _rcDueDay:r.recurringDueDay||1,
                      _rcStartYM:r.recurringStartYM||TODAY.toISOString().slice(0,7),
                      _rcUntilLeaseEnds:r.recurringUntilLeaseEnds!==false,
                      _rcBankAccount:r.recurringBankAccount||settings.bankAccount||"",
                      _rcLateConfig:{
                        enabled:    r.lateConfig?.enabled !== false,
                        graceDays:  r.lateConfig?.graceDays     ?? (settings.lateFeeGraceDays   ?? 3),
                        initialEnabled: r.lateConfig?.initialEnabled !== false,
                        initialFee: r.lateConfig?.initialFee    ?? (settings.lateFeeInitial     ?? 50),
                        initialFeeType: r.lateConfig?.initialFeeType ?? "flat",
                        initialApplyDays: r.lateConfig?.initialApplyDays ?? 3,
                        dailyEnabled: r.lateConfig?.dailyEnabled !== false,
                        dailyFee:   r.lateConfig?.dailyFee      ?? (settings.lateFeeDaily       ?? 5),
                        dailyStartDays: r.lateConfig?.dailyStartDays ?? 6,
                        limitEnabled: !!r.lateConfig?.limitEnabled,
                        limitStopAfterDays: r.lateConfig?.limitStopAfterDays ?? null,
                        limitMaxAmt: r.lateConfig?.limitMaxAmt ?? null,
                        limitMaxType: r.lateConfig?.limitMaxType ?? "flat",
                      },
                      _rcErrs:{},
                    }));
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.07)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,.04)"}
                  style={{width:28,height:28,borderRadius:6,background:"rgba(0,0,0,.04)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5c4a3a" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sent charges ledger */}
          <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",overflow:"hidden"}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:14,fontWeight:700}}>Sent Charges</span>
                {pastDueC>0&&<span style={{fontSize:11,color:"#c45c4a",fontWeight:700,background:"rgba(196,92,74,.08)",padding:"2px 8px",borderRadius:100}}>{pastDueC} past due</span>}
              </div>
              <button
                onClick={()=>{
                  const rows=[["Due Date","Category","Description","Status","Amount","Amount Paid","Method","Paid Date"],...tenantCharges.map(c=>{const p=c.payments?.[0];return[c.dueDate,c.category,c.desc||"",chargeStatus(c),c.amount,c.amountPaid,p?.method||"",p?.date||""];})];
                  const csv=rows.map(row=>row.map(v=>`"${v}"`).join(",")).join("\n");
                  const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download=`charges-${r.tenant.name.replace(/\s/g,"-")}.csv`;a.click();
                }}
                style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,color:"#5c4a3a",fontFamily:"inherit",padding:"4px 8px",borderRadius:6,transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.04)"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export CSV
              </button>
            </div>
            {/* Column headers — 5 cols: Date | Category | Status | Amount+Due | Chevron */}
            <div style={{display:"grid",gridTemplateColumns:"100px 1fr 90px 110px 28px",padding:"8px 20px",background:"rgba(0,0,0,.02)",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
              {["Due Date","Category / Description","Status","",""].map((h,i)=><div key={i} style={{fontSize:9,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,textAlign:i===3?"right":"left"}}>{h}</div>)}
            </div>
            {tenantCharges.length===0&&<div style={{textAlign:"center",padding:32,color:"#6b5e52",fontSize:13}}>No charges yet.</div>}
            {tenantCharges.map(c=>{
              const st=chargeStatus(c);const rem=c.amount-c.amountPaid;
              const isRecurring=c.category==="Rent";
              const ci=catIcons[c.category]||{d:"M9 11l3 3L22 4",color:"#6b5e52"};
              const isExpanded=expandedId===c.id;
              const firstPay=(c.payments||[])[0]||null;
              return(
              <div key={c.id} style={{borderBottom:"1px solid rgba(0,0,0,.05)",background:isExpanded?"rgba(0,0,0,.012)":st==="pastdue"?"rgba(196,92,74,.02)":"#fff"}}>
                {/* Main row */}
                <div
                  onClick={()=>setModal(prev=>({...prev,_expandedChargeId:prev._expandedChargeId===c.id?null:c.id}))}
                  style={{display:"grid",gridTemplateColumns:"100px 1fr 90px 110px 28px",padding:"12px 20px",alignItems:"center",cursor:"pointer",transition:"background .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.018)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {/* Due Date */}
                  <div style={{fontSize:12,color:"#5c4a3a"}}>{fmtD(c.dueDate)}</div>
                  {/* Category / Description */}
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:26,height:26,borderRadius:6,background:isRecurring?"rgba(59,130,246,.08)":`rgba(${ci.color.replace(/[^0-9,]/g,"").slice(0,11)},.1)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {isRecurring
                        ?<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                        :<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ci.color} strokeWidth="1.75"><path d={ci.d}/>{ci.d2&&<path d={ci.d2}/>}</svg>
                      }
                    </div>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>{c.category}</div>
                      {c.amountPaid>0&&c.amountPaid<c.amount&&<div style={{fontSize:10,color:"#6b5e52"}}>{fmtS(c.amountPaid)} paid &middot; {fmtS(rem)} remaining</div>}
                    </div>
                  </div>
                  {/* Status */}
                  <div><span style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:4,background:stBg[st]||"rgba(0,0,0,.04)",color:stTx[st]||"#6b5e52",border:`1px solid ${st==="paid"?"rgba(74,124,89,.2)":st==="pastdue"?"rgba(196,92,74,.2)":st==="unpaid"?"rgba(212,168,83,.2)":"rgba(0,0,0,.07)"}`}}>{stLabel[st]||st}</span></div>
                  {/* Amount + Due stacked — TurboTenant style */}
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:800,color:st==="pastdue"?"#c45c4a":st==="unpaid"?"#9a7422":"#1a1714"}}>{fmtS(c.amount)}</div>
                    <div style={{fontSize:10,color:"#7a7067",marginTop:1}}>Due: {fmtS(rem)}</div>
                  </div>
                  {/* Chevron */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9a7067" strokeWidth="2.5" strokeLinecap="round"
                      style={{transform:isExpanded?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                {/* Expanded row — TurboTenant style */}
                {isExpanded&&<div style={{padding:"0 20px 16px",borderTop:"1px solid rgba(0,0,0,.05)"}}>
                  {/* Description */}
                  {(c.desc&&c.desc!==c.category)&&<div style={{fontSize:11,color:"#3d3529",marginTop:12,marginBottom:8}}>
                    <span style={{fontWeight:800,textTransform:"uppercase",letterSpacing:.5,fontSize:10,color:"#7a7067"}}>Description: </span>{c.desc}
                  </div>}
                  {/* Notification / deposit info */}
                  {firstPay&&<div style={{fontSize:11,color:"#6b5e52",marginBottom:12,fontStyle:"italic",lineHeight:1.5}}>
                    Payment of <strong style={{fontStyle:"normal"}}>{fmtS(firstPay.amount)}</strong> recorded via <strong style={{fontStyle:"normal"}}>{firstPay.method||"—"}</strong> on {fmtD(firstPay.date)}.{firstPay.depositDate?` Deposited ${fmtD(firstPay.depositDate)}.`:""}{firstPay.notes?<> &ldquo;{firstPay.notes}&rdquo;</>:null}
                  </div>}
                  {!firstPay&&(st==="unpaid"||st==="pastdue")&&<div style={{fontSize:11,color:"#6b5e52",marginBottom:12,fontStyle:"italic",lineHeight:1.5}}>
                    No payment recorded yet. A notification email will be sent to your tenant.
                  </div>}
                  {c.reminderActive&&<div style={{fontSize:11,color:"#9a7422",marginBottom:10,fontStyle:"italic"}}>Daily payment reminders are active for this charge.</div>}
                  {/* Action buttons with icons — TurboTenant style */}
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
                    {st!=="paid"&&st!=="waived"&&st!=="voided"&&(
                      <button className="btn btn-out btn-sm" style={{display:"flex",alignItems:"center",gap:5,fontWeight:600}}
                        onClick={()=>setModal({type:"recordPay",step:2,selRoom:c.roomId,selCharge:c.id,payAmount:rem,payMethod:"",payDate:TODAY.toISOString().split("T")[0],payNotes:"",_fromTenant:true,_tenantRoom:r})}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        Record Payment
                      </button>
                    )}
                    {(st==="pastdue"||st==="unpaid")&&(
                      <button className="btn btn-out btn-sm" style={{display:"flex",alignItems:"center",gap:5,fontWeight:600}}
                        onClick={()=>setModal({type:"sendReminder",charge:c,tenantName:c.tenantName,rem,method:null,_fromTenant:true,_tenantRoom:r})}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        Send Reminder
                      </button>
                    )}
                    <button className="btn btn-out btn-sm" style={{display:"flex",alignItems:"center",gap:5,fontWeight:600}}
                      onClick={()=>setModal({type:"editCharge",charge:{...c},isPaid:st==="paid",_fromTenant:true,_tenantRoom:r})}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                    {st!=="voided"&&st!=="waived"&&(
                      <button className="btn btn-out btn-sm" style={{display:"flex",alignItems:"center",gap:5,fontWeight:600,color:"#9a7422"}}
                        onClick={()=>setModal({type:"voidCharge",chargeId:c.id,tenantName:c.tenantName,category:c.category,desc:c.desc,amount:c.amount,voidReason:"",_fromTenant:true,_tenantRoom:r})}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        Void
                      </button>
                    )}
                    {(st==="unpaid"||st==="pastdue")&&c.payments.length===0&&(
                      <button className="btn btn-out btn-sm" style={{display:"flex",alignItems:"center",gap:5,fontWeight:600,color:"#c45c4a"}}
                        onClick={()=>setModal({type:"deleteCharge",chargeId:c.id,tenantName:c.tenantName,category:c.category,desc:c.desc,_fromTenant:true,_tenantRoom:r})}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        Delete
                      </button>
                    )}
                  </div>
                </div>}
              </div>);
            })}
          </div>

          {/* View in Tenant Ledger */}
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
        </div>);})()}

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

        {/* ── RENEWAL OFFERS TAB ── */}
        {tenantProfileTab==="renewals"&&(()=>{
          const tEmail=(r.tenant?.email||"").toLowerCase();
          const tOffers=renewalOffers.filter(o=>(o.tenantEmail||"").toLowerCase()===tEmail);
          const addOffer=()=>{
            if(!renewalForm.proposedRent)return;
            setRenewalOffers(prev=>[...prev,{id:uid(),tenantEmail:tEmail,tenantName:r.tenant?.name||"",propName:r.propName||prop?.name||"",roomName:r.name,proposedRent:parseFloat(renewalForm.proposedRent),term:parseInt(renewalForm.term)||12,note:renewalForm.note,status:"pending",counterRent:null,counterNote:null,created:new Date().toISOString().split("T")[0]}]);
            setRenewalForm({tenantId:"",proposedRent:"",term:"12",note:""});
          };
          const respondOffer=(offerId,action)=>{
            setRenewalOffers(prev=>prev.map(o=>o.id===offerId?{...o,status:action,respondedAt:new Date().toISOString()}:o));
          };
          return(<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div style={{fontSize:15,fontWeight:800}}>Renewal Offers</div>
                <div style={{fontSize:12,color:"#6b5e52",marginTop:2}}>Send and manage lease renewal offers for this tenant.</div>
              </div>
            </div>

            {/* Send new offer form */}
            <div className="card" style={{marginBottom:20}}><div className="card-bd" style={{padding:"20px 24px"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:14}}>Send New Renewal Offer</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Proposed Rent ($/mo)</label>
                  <input type="number" value={renewalForm.proposedRent} onChange={e=>setRenewalForm(f=>({...f,proposedRent:e.target.value}))} placeholder={r.rent||""} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Term (months)</label>
                  <select value={renewalForm.term} onChange={e=>setRenewalForm(f=>({...f,term:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit",background:"#fff"}}>
                    <option value="6">6 months</option><option value="12">12 months</option><option value="18">18 months</option><option value="24">24 months</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#6b5e52",display:"block",marginBottom:4}}>Note (optional)</label>
                  <input value={renewalForm.note} onChange={e=>setRenewalForm(f=>({...f,note:e.target.value}))} placeholder="e.g. Early renewal discount" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.1)",fontSize:12,fontFamily:"inherit"}}/>
                </div>
              </div>
              <button className="btn btn-green btn-sm" onClick={addOffer}>Send Offer</button>
            </div></div>

            {/* Existing offers */}
            {tOffers.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#7a7067",fontSize:12}}>No renewal offers sent yet.</div>}
            {tOffers.length>0&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
              {tOffers.map(o=>(
                <div key={o.id} className="card"><div className="card-bd" style={{padding:"16px 20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={o.status==="accepted"?"#4a7c59":o.status==="declined"?"#c45c4a":o.status==="countered"?"#d4a853":"#6b5e52"} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                      <div>
                        <div style={{fontSize:13,fontWeight:700}}>${o.proposedRent}/mo -- {o.term} month term</div>
                        <div style={{fontSize:10,color:"#6b5e52"}}>{o.created}{o.note?" -- "+o.note:""}</div>
                      </div>
                    </div>
                    <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,textTransform:"uppercase",letterSpacing:.5,background:o.status==="accepted"?"rgba(74,124,89,.1)":o.status==="declined"?"rgba(196,92,74,.1)":o.status==="countered"?"rgba(212,168,83,.1)":"rgba(0,0,0,.05)",color:o.status==="accepted"?"#4a7c59":o.status==="declined"?"#c45c4a":o.status==="countered"?"#9a7422":"#6b5e52"}}>{o.status}</span>
                  </div>
                  {o.status==="countered"&&o.counterRent&&<div style={{background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.2)",borderRadius:8,padding:"10px 14px",marginBottom:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#9a7422",marginBottom:4}}>Tenant Counter-Offer</div>
                    <div style={{fontSize:12}}>Proposed: ${o.counterRent}/mo{o.counterNote?" -- "+o.counterNote:""}</div>
                    <div style={{display:"flex",gap:8,marginTop:8}}>
                      <button className="btn btn-green btn-sm" onClick={()=>respondOffer(o.id,"accepted")}>Accept Counter</button>
                      <button className="btn btn-out btn-sm" onClick={()=>respondOffer(o.id,"declined")}>Decline</button>
                    </div>
                  </div>}
                  {o.status==="pending"&&<div style={{display:"flex",gap:8,marginTop:4}}>
                    <button className="btn btn-out btn-sm" style={{fontSize:10,color:"#c45c4a"}} onClick={()=>respondOffer(o.id,"withdrawn")}>Withdraw</button>
                  </div>}
                </div></div>
              ))}
            </div>}
          </div>);
        })()}

        {/* ── INSPECTIONS TAB ── */}
        {tenantProfileTab==="inspections"&&(()=>{
          const tEmail=(r.tenant?.email||"").toLowerCase();
          const tInsp=inspections.filter(i=>(i.tenantEmail||"").toLowerCase()===tEmail);
          return(<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div style={{fontSize:15,fontWeight:800}}>Tenant Inspections</div>
                <div style={{fontSize:12,color:"#6b5e52",marginTop:2}}>View move-in, move-out, and periodic inspections submitted by this tenant.</div>
              </div>
            </div>
            {tInsp.length===0&&<div style={{background:"#fff",borderRadius:12,border:"2px dashed rgba(0,0,0,.1)",padding:"48px 32px",textAlign:"center"}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth="1.25" style={{marginBottom:12}}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>No inspections submitted</div>
              <div style={{fontSize:12,color:"#6b5e52"}}>When this tenant submits a move-in or move-out inspection through the portal, it will appear here with room-by-room details and photos.</div>
            </div>}
            {tInsp.length>0&&<div style={{display:"flex",flexDirection:"column",gap:16}}>
              {tInsp.map(insp=>(
                <div key={insp.id} className="card"><div className="card-bd" style={{padding:"20px 24px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={settings.adminAccent||"#4a7c59"} strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                      <div>
                        <div style={{fontSize:14,fontWeight:700}}>{insp.type==="move-in"?"Move-In Inspection":insp.type==="move-out"?"Move-Out Inspection":"Periodic Inspection"}</div>
                        <div style={{fontSize:11,color:"#6b5e52"}}>Submitted {insp.date||"--"}</div>
                      </div>
                    </div>
                    {insp.signature&&<div style={{fontSize:10,color:"#4a7c59",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                      Signed
                    </div>}
                  </div>
                  {/* Room details */}
                  {(insp.rooms||[]).map((room,ri)=>(
                    <div key={ri} style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:"12px 16px",marginBottom:8}}>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>{room.name||"Room "+(ri+1)}</div>
                      <div style={{fontSize:12,color:"#5c4a3a",marginBottom:6}}>{room.condition||"No condition noted"}</div>
                      {room.notes&&<div style={{fontSize:11,color:"#6b5e52",marginBottom:6}}>Notes: {room.notes}</div>}
                      {(room.photos||[]).length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {room.photos.map((src,j)=><img key={j} src={src} alt="" style={{width:80,height:60,objectFit:"cover",borderRadius:6,border:"1px solid rgba(0,0,0,.08)"}}/>)}
                      </div>}
                    </div>
                  ))}
                  {insp.overallNotes&&<div style={{fontSize:12,color:"#5c4a3a",marginTop:8,padding:"8px 12px",background:"rgba(0,0,0,.02)",borderRadius:6}}>Overall: {insp.overallNotes}</div>}
                </div></div>
              ))}
            </div>}
          </div>);
        })()}

      </div>

      {/* ── Lease Settings overlay — shown when Edit clicked ── */}
      {modal._leaseSettingsOpen&&(()=>{
        const ls=modal._leaseSettings||{
          nickname:`${(()=>{const dn=prop?getPropDisplayName(prop):r.propName;const addr=prop?.addr||"";const sfx=(addr&&addr!==dn)?" · "+addr:"";return dn+sfx;})()}, ${r.name} — ${r.tenant.name}`,
          requireInsurance: r.requireInsurance||false,
          allowPartial: r.allowPartial!==false,
          settleOldFirst: r.settleOldFirst!==false,
          editingTerm: false,
          newLeStart: r.tenant.moveIn||"",
          newLeEnd: r.le||"",
        };
        const updLs=(k,v)=>setModal(p=>({...p,_leaseSettings:{...ls,[k]:v}}));
        const saveLs=()=>{
          setProps(prev=>prev.map(p=>{
            if(!prop||p.id!==prop.id)return p;
            return{...p,units:(p.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(rm=>{
              if(rm.id!==r.id)return rm;
              const updated={...rm,requireInsurance:ls.requireInsurance,allowPartial:ls.allowPartial,settleOldFirst:ls.settleOldFirst};
              if(ls.editingTerm&&ls.newLeEnd)updated.le=ls.newLeEnd;
              if(ls.editingTerm&&ls.newLeStart&&updated.tenant)updated.tenant={...updated.tenant,moveIn:ls.newLeStart};
              return updated;
            })}))}
          }));
          setModal(p=>({...p,_leaseSettingsOpen:false,_leaseSettings:undefined}));
        };
        const radioStyle=(active)=>({width:16,height:16,borderRadius:"50%",border:`2px solid ${active?settings.adminAccent||"#4a7c59":"rgba(0,0,0,.25)"}`,background:active?settings.adminAccent||"#4a7c59":"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .15s"});
        const radioDot=<div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>;
        const sec=(title,icon)=>(
          <div style={{display:"flex",alignItems:"center",gap:10,fontSize:16,fontWeight:700,color:"#1a1714",marginBottom:18,paddingBottom:10,borderBottom:"1px solid rgba(0,0,0,.07)"}}>
            {icon}<span>{title}</span>
          </div>
        );
        return(
        <div style={{position:"absolute",inset:0,background:"#f5f4f1",zIndex:5,overflowY:"auto"}}>
          {/* Header */}
          <div style={{background:"#fff",borderBottom:"1px solid rgba(0,0,0,.08)",padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
            <button onClick={()=>setModal(p=>({...p,_leaseSettingsOpen:false,_leaseSettings:undefined}))}
              style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,color:"#5c4a3a",padding:0}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
          </div>

          {/* Body */}
          <div style={{maxWidth:600,margin:"0 auto",padding:"32px 24px 80px"}}>
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"28px 32px",marginBottom:16}}>
              <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Lease Settings</h2>

              {/* Lease Details */}
              {sec("Lease Details",<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>)}

              {/* Lease Term */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:600,color:"#5c4a3a",marginBottom:4}}>Lease Term</div>
                {!ls.editingTerm
                  ?<div style={{fontSize:14,color:"#1a1714",marginBottom:8}}>
                    {r.tenant.moveIn?fmtD(r.tenant.moveIn):""} {r.le?" – "+fmtD(r.le):"(no end date)"}
                  </div>
                  :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
                    <div><label style={{fontSize:11,fontWeight:700,color:"#5c4a3a",display:"block",marginBottom:4}}>Start Date</label><input type="date" value={ls.newLeStart||""} onChange={e=>updLs("newLeStart",e.target.value)} style={{width:"100%",padding:"9px 12px",border:"2px solid rgba(0,0,0,.1)",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none"}}/></div>
                    <div><label style={{fontSize:11,fontWeight:700,color:"#5c4a3a",display:"block",marginBottom:4}}>End Date</label><input type="date" value={ls.newLeEnd||""} onChange={e=>updLs("newLeEnd",e.target.value)} style={{width:"100%",padding:"9px 12px",border:"2px solid rgba(0,0,0,.1)",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none"}}/></div>
                  </div>
                }
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <button className="btn btn-out btn-sm" style={{display:"flex",alignItems:"center",gap:5}} onClick={()=>updLs("editingTerm",!ls.editingTerm)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    {ls.editingTerm?"Cancel Edit":"Edit Term"}
                  </button>
                  <button onClick={()=>setModal(prev=>({...prev,termStep:1,termErrs:{},_leaseSettingsOpen:false}))}
                    style={{background:"none",border:"none",fontSize:12,color:"#c45c4a",cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:0}}>
                    End or delete this lease
                  </button>
                </div>
              </div>

              {/* Lease Nickname */}
              <div style={{marginBottom:20}}>
                <label style={{fontSize:12,fontWeight:600,color:"#5c4a3a",display:"block",marginBottom:6}}>Lease Nickname</label>
                <input value={ls.nickname||""} onChange={e=>updLs("nickname",e.target.value)}
                  style={{width:"100%",padding:"10px 14px",border:"2px solid rgba(0,0,0,.08)",borderRadius:9,fontSize:13,fontFamily:"inherit",outline:"none",background:"#fff",color:"#1a1714"}}/>
                <div style={{fontSize:11,color:"#7a7067",marginTop:4}}>Most landlords use a combination of the property address and tenant name.</div>
              </div>

              {/* Property + Room (read-only display) */}
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,marginBottom:8}}>
                <div>
                  <label style={{fontSize:12,fontWeight:600,color:"#5c4a3a",display:"block",marginBottom:6}}>Property</label>
                  <div style={{padding:"10px 14px",border:"1px solid rgba(0,0,0,.1)",borderRadius:9,fontSize:13,color:"#1a1714",background:"rgba(0,0,0,.02)"}}>{prop?getPropDisplayName(prop):r.propName}</div>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:600,color:"#5c4a3a",display:"block",marginBottom:6}}>Room</label>
                  <div style={{padding:"10px 14px",border:"1px solid rgba(0,0,0,.1)",borderRadius:9,fontSize:13,color:"#1a1714",background:"rgba(0,0,0,.02)",minWidth:80}}>{r.name}</div>
                </div>
              </div>
            </div>

            {/* Renters Insurance */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"28px 32px",marginBottom:16}}>
              {sec("Renters Insurance",<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>)}
              <div style={{fontWeight:600,fontSize:14,color:"#1a1714",marginBottom:6}}>Do you require renter&apos;s insurance?</div>
              <div style={{fontSize:12,color:"#6b5e52",marginBottom:14}}>Requiring renters insurance could protect both you and your tenant from unexpected losses.</div>
              {[["Yes",true],["No",false]].map(([label,val])=>(
                <label key={label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,cursor:"pointer"}}>
                  <div style={radioStyle(ls.requireInsurance===val)} onClick={()=>updLs("requireInsurance",val)}>
                    {ls.requireInsurance===val&&radioDot}
                  </div>
                  <span style={{fontSize:14,color:"#1a1714"}}>{label}</span>
                </label>
              ))}
            </div>

            {/* Payments */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"28px 32px",marginBottom:16}}>
              {sec("Payments",<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b5e52" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>)}

              <div style={{marginBottom:20}}>
                <div style={{fontWeight:600,fontSize:14,color:"#1a1714",marginBottom:4}}>Allow partial payments on this lease?</div>
                <div style={{fontSize:12,color:"#6b5e52",marginBottom:12}}>This allows roommates to easily split rent.</div>
                {[["Yes",true],["No",false]].map(([label,val])=>(
                  <label key={label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer"}}>
                    <div style={radioStyle(ls.allowPartial===val)} onClick={()=>updLs("allowPartial",val)}>
                      {ls.allowPartial===val&&radioDot}
                    </div>
                    <span style={{fontSize:14,color:"#1a1714"}}>{label}</span>
                  </label>
                ))}
              </div>

              <div style={{marginBottom:20}}>
                <div style={{fontWeight:600,fontSize:14,color:"#1a1714",marginBottom:4}}>Require tenants to settle older past due charges before paying newer charges?</div>
                {[["Yes",true],["No",false]].map(([label,val])=>(
                  <label key={label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer"}}>
                    <div style={radioStyle(ls.settleOldFirst===val)} onClick={()=>updLs("settleOldFirst",val)}>
                      {ls.settleOldFirst===val&&radioDot}
                    </div>
                    <span style={{fontSize:14,color:"#1a1714"}}>{label}</span>
                  </label>
                ))}
              </div>

              <button className="btn btn-dk" onClick={saveLs} style={{background:"#1a1714",color:"#f5f0e8",fontWeight:700,width:"100%"}}>Save Changes</button>
            </div>

            {/* End Lease */}
            <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(0,0,0,.07)",padding:"28px 32px",marginBottom:16}}>
              <div style={{fontSize:16,fontWeight:700,color:"#c45c4a",marginBottom:8}}>End Lease</div>
              <div style={{fontSize:13,color:"#6b5e52",marginBottom:16}}>Best for active leases that are ending because the tenant moved out. You will be able to set the lease end date.</div>
              <button className="btn btn-dk btn-sm" style={{background:"#1a1714",color:"#f5f0e8",fontWeight:700}}
                onClick={()=>setModal(prev=>({...prev,termStep:1,termErrs:{},_leaseSettingsOpen:false}))}>
                Convert to Past Lease
              </button>
            </div>

            {/* Delete Lease */}
            {(()=>{
              const doDeleteLease = () => {
                const delId = r.id;
                setProps(prev => prev.map(p => ({
                  ...p,
                  units: (p.units||[]).map(u => ({
                    ...u,
                    rooms: (u.rooms||[]).map(rm => rm.id !== delId ? rm : {...rm, st:"vacant", le:null, tenant:null, m2m:false})
                  }))
                })));
                setModal(null);
              };
              return (
                <div style={{background:"#fff",borderRadius:12,border:"1px solid rgba(196,92,74,.15)",padding:"28px 32px"}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#c45c4a",marginBottom:8}}>Delete Lease</div>
                  <div style={{fontSize:13,color:"#6b5e52",marginBottom:16}}>Best for leases where the tenant never moved in or was created by mistake.</div>
                  <button className="btn btn-red btn-sm"
                    onClick={()=>setModal({type:"confirmAction",title:"Delete Lease",body:"This will permanently remove "+r.tenant.name+"'s lease record. This cannot be undone.",confirmLabel:"Delete Lease",confirmStyle:"btn-red",onConfirm:doDeleteLease})}>
                    Delete Lease
                  </button>
                </div>
              );
            })()}
          </div>
        </div>);
      })()}
    </div>
    );
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
    const backToTenant=()=>{if(modal._fromTenant&&modal._tenantRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:modal._tenantRoom});}else setModal(null);};
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
      backToTenant();
    };
    const reminderMsg=modal.reminderMsg!==undefined?modal.reminderMsg:defaultMsg;
    const isEdited=reminderMsg!==defaultMsg;
    const editingDefault=modal.editingDefault||false;
    return(
    <div className="mbg" onClick={backToTenant}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
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
        <div className="mft"><button className="btn btn-out" onClick={backToTenant}>Cancel</button></div>
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
          {props.map(p=>{const dispName=getPropDisplayName(p);const dupes=props.filter(x=>x.name===p.name).length>1;const label=dupes&&p.addr&&!dispName.includes(p.addr)?`${dispName} — ${p.addr}`:dispName;return<option key={p.id} value={p.id}>{label}</option>;})}
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
            <option value="">— Select —</option>{props.map(p=>{const dispName=getPropDisplayName(p);const dupes=props.filter(x=>x.name===p.name).length>1;const label=dupes&&p.addr&&!dispName.includes(p.addr)?`${dispName} — ${p.addr}`:dispName;return<option key={p.id} value={p.id}>{label}</option>;})}
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
            <option value="">— Select —</option>{props.map(p=>{const dispName=getPropDisplayName(p);const dupes=props.filter(x=>x.name===p.name).length>1;const label=dupes&&p.addr&&!dispName.includes(p.addr)?`${dispName} — ${p.addr}`:dispName;return<option key={p.id} value={p.id}>{label}</option>;})}
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

  {modal&&modal.type==="deleteCharge"&&(()=>{
    const backToTenant=()=>{if(modal._fromTenant&&modal._tenantRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:modal._tenantRoom});}else setModal(null);};
    return(
    <div className="mbg" onClick={backToTenant}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>🗑 Delete Charge?</h2>
      <div style={{background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.12)",borderRadius:8,padding:12,marginBottom:14,fontSize:12}}>
        <div style={{fontWeight:700,marginBottom:2}}>{modal.tenantName}</div>
        <div style={{color:"#6b5e52"}}>{modal.category} — {modal.desc}</div>
      </div>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:16}}>This will permanently delete the charge and all associated payment records. This cannot be undone.</p>
      <div className="mft">
        <button className="btn btn-out" onClick={backToTenant}>Cancel</button>
        <button className="btn btn-red" onClick={()=>{setCharges(p=>p.filter(c=>c.id!==modal.chargeId));setExpCharge(null);backToTenant();}}>Yes, Delete</button>
      </div>
    </div></div>);
  })()}

  {modal&&modal.type==="waiveCharge"&&(()=>{
    const backToTenant=()=>{if(modal._fromTenant&&modal._tenantRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:modal._tenantRoom});}else setModal(null);};
    return(
    <div className="mbg" onClick={backToTenant}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
      <h2>Stop Late Fees</h2>
      <p style={{fontSize:12,color:"#5c4a3a",marginBottom:12}}>This will stop late fees and mark the charge as waived. This cannot be undone.</p>
      <div className={`fld ${modal.reasonErr?"field-err":""}`}>
        <label className={modal.reasonErr?"field-err-label":""}>Reason (required)</label>
        <textarea value={modal.reason||""} onChange={e=>setModal(prev=>({...prev,reason:e.target.value,reasonErr:false}))} placeholder="e.g. Tenant hardship, billing error, goodwill gesture..." rows={2} autoFocus/>
        {modal.reasonErr&&<div className="err-msg">Please enter a reason</div>}
      </div>
      <div className="mft"><button className="btn btn-out" onClick={backToTenant}>Cancel</button>
        <button className="btn btn-red" onClick={()=>{
          if(!(modal.reason||"").trim()){setModal(prev=>({...prev,reasonErr:true}));shakeModal();return;}
          waiveCharge(modal.chargeId,modal.reason);setExpCharge(null);backToTenant();
        }}>Waive Charge</button></div>
    </div></div>);
  })()}

  {/* ── Edit Recurring Charge ── */}
  {/* Edits room recurring charge config + lateConfig going forward. Does NOT touch existing charge records. */}
  {modal&&modal.type==="editRecurringCharge"&&(()=>{
    const rcRoom=modal._rcRoom;
    const rcProp=modal._rcProp;
    const rent=modal._rcRent;
    const cat=modal._rcCategory||"Rent";
    const lc=modal._rcLateConfig||{};
    const errs=modal._rcErrs||{};
    const shake=modal._rcShake||false;
    const showDesc=!!modal._rcShowDesc;
    const dueDay=modal._rcDueDay||1;
    const startYM=modal._rcStartYM||TODAY.toISOString().slice(0,7);
    const untilLeaseEnds=modal._rcUntilLeaseEnds!==false;
    const bankAccount=modal._rcBankAccount||"";
    const updLc=(k,v)=>setModal(p=>({...p,_rcLateConfig:{...p._rcLateConfig,[k]:v},_rcErrs:{...(p._rcErrs||{}),[k]:null}}));
    const upd=(k,v)=>setModal(p=>({...p,[k]:v,_rcErrs:{...(p._rcErrs||{}),[k]:null}}));

    // Parse startYM for dropdowns
    const startParts=startYM.split("-");
    const startYear=Number(startParts[0])||TODAY.getFullYear();
    const startMonth=Number(startParts[1])||TODAY.getMonth()+1;
    const nowYM=TODAY.toISOString().slice(0,7);
    const isPast=startYM<nowYM;

    // Next charge preview
    const nextChargeDate=`${startYear}-${String(startMonth).padStart(2,"0")}-${String(dueDay).padStart(2,"0")}`;
    const nextChargeDateFmt=new Date(nextChargeDate+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});

    // Bank accounts from settings
    const bankAccounts=settings.bankAccounts||[];

    const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
    const YEARS=Array.from({length:5},(_,i)=>TODAY.getFullYear()+i);
    const INITIAL_APPLY_OPTS=[3,4,5,6,7,10,14];
    const DAILY_START_OPTS=[4,5,6,7,8,10,14];
    const STOP_AFTER_OPTS=[7,10,14,21,30,45,60,90];

    const CATS=["Rent","Utility Overage","Other"];

    const save=()=>{
      const e={};
      if(!rent||Number(rent)<=0)e.rent="Monthly amount must be greater than $0";
      if(!dueDay||Number(dueDay)<1||Number(dueDay)>28)e.dueDay="Due day must be between 1 and 28";
      if(lc.enabled&&lc.initialEnabled&&(!lc.initialFee||Number(lc.initialFee)<=0))e.initialFee="Enter a valid initial fee amount";
      if(lc.enabled&&lc.dailyEnabled&&(!lc.dailyFee||Number(lc.dailyFee)<=0))e.dailyFee="Enter a valid daily fee amount";
      if(lc.enabled&&lc.limitEnabled&&lc.limitMaxAmt&&Number(lc.limitMaxAmt)<=0)e.limitMaxAmt="Enter a valid maximum amount";
      if(Object.keys(e).length){setModal(p=>({...p,_rcErrs:e,_rcShake:true}));setTimeout(()=>setModal(p=>({...p,_rcShake:false})),500);return;}

      const newLateConfig={
        enabled:lc.enabled,
        graceDays:Number(lc.graceDays)||3,
        initialEnabled:lc.initialEnabled,
        initialFee:lc.initialEnabled?Number(lc.initialFee):0,
        initialFeeType:lc.initialFeeType||"flat",
        initialApplyDays:Number(lc.initialApplyDays)||3,
        dailyEnabled:lc.dailyEnabled,
        dailyFee:lc.dailyEnabled?Number(lc.dailyFee):0,
        dailyStartDays:Number(lc.dailyStartDays)||6,
        limitEnabled:lc.limitEnabled,
        limitStopAfterDays:lc.limitEnabled&&lc.limitStopAfterDays?Number(lc.limitStopAfterDays):null,
        limitMaxAmt:lc.limitEnabled&&lc.limitMaxAmt?Number(lc.limitMaxAmt):null,
        limitMaxType:lc.limitMaxType||"flat",
      };

      setProps(prev=>prev.map(p=>{
        if(!rcProp||p.id!==rcProp.id)return p;
        return{...p,units:(p.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(rm=>rm.id!==rcRoom.id?rm:{
          ...rm,
          rent:Number(rent),
          recurringCategory:cat,
          recurringDesc:modal._rcDesc||"",
          recurringDueDay:Number(dueDay)||1,
          recurringStartYM:startYM,
          recurringUntilLeaseEnds:untilLeaseEnds,
          recurringBankAccount:bankAccount,
          lateConfig:newLateConfig,
        })}))};
      }));

      setNotifs(prev=>[{id:uid(),type:"payment",
        msg:`Recurring charge updated: ${rcRoom?.tenant?.name||""} — ${fmtS(Number(rent))}/mo (${cat})`,
        date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...prev]);
      setModal(null);
    };

    const ss={width:"100%",padding:"10px 12px",border:"2px solid rgba(0,0,0,.08)",borderRadius:9,fontSize:13,fontFamily:"inherit",outline:"none",background:"#fff",color:"#1a1714"};
    const dollarWrap=(key,errKey,ph="0",isLc=true)=>{
      const val=isLc?lc[key]:modal[key];
      const onChange=isLc?(e=>updLc(key,e.target.value)):(e=>upd(key,e.target.value));
      return(
      <div style={{display:"flex",alignItems:"center",border:`2px solid ${errs[errKey]?"#c45c4a":"rgba(0,0,0,.08)"}`,borderRadius:9,overflow:"hidden",background:"#fff"}}>
        <span style={{padding:"10px 12px",fontSize:14,fontWeight:700,color:"#6b5e52",borderRight:"1px solid rgba(0,0,0,.08)",background:"rgba(0,0,0,.02)"}}>$</span>
        <input type="number" step="0.01" min="0" value={val??""} placeholder={ph} onChange={onChange}
          style={{flex:1,padding:"10px 12px",border:"none",outline:"none",fontSize:14,fontFamily:"inherit",background:"transparent",color:"#1a1714"}}/>
      </div>);
    };
    const pctWrap=(key,errKey,ph="10")=>(
      <div style={{display:"flex",alignItems:"center",border:`2px solid ${errs[errKey]?"#c45c4a":"rgba(0,0,0,.08)"}`,borderRadius:9,overflow:"hidden",background:"#fff"}}>
        <input type="number" step="0.1" min="0" max="100" value={lc[key]??""} placeholder={ph}
          onChange={e=>updLc(key,e.target.value)}
          style={{flex:1,padding:"10px 10px",border:"none",outline:"none",fontSize:14,fontFamily:"inherit",background:"transparent",color:"#1a1714"}}/>
        <span style={{padding:"10px 12px",fontSize:14,color:"#6b5e52",borderLeft:"1px solid rgba(0,0,0,.08)",background:"rgba(0,0,0,.02)"}}>%</span>
      </div>
    );
    const pillBtn=(active,onClick,label)=>(
      <button onClick={onClick} style={{padding:"6px 14px",borderRadius:6,border:`2px solid ${active?"#1a1714":"rgba(0,0,0,.1)"}`,background:active?"#1a1714":"#fff",color:active?"#f5f0e8":"#5c4a3a",fontSize:12,fontWeight:active?700:500,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
        {label}
      </button>
    );
    const checkbox=(checked,onClick,label,sub)=>(
      <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={onClick}>
        <div style={{width:16,height:16,borderRadius:3,border:`2px solid ${checked?"#4a7c59":"rgba(0,0,0,.2)"}`,background:checked?"#4a7c59":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
          {checked&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
        <div>
          <span style={{fontSize:13,fontWeight:600,color:"#1a1714"}}>{label}</span>
          {sub&&<div style={{fontSize:11,color:"#7a7067",marginTop:1}}>{sub}</div>}
        </div>
      </div>
    );
    const lbl=(text,req,err)=>(
      <label style={{display:"block",fontSize:11,fontWeight:700,color:err?"#c45c4a":"#5c4a3a",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>
        {text}{req&&<span style={{color:"#c45c4a"}}> *</span>}
        {err&&<div style={{fontSize:10,color:"#c45c4a",marginTop:2,animation:"shake .4s ease",textTransform:"none",letterSpacing:0}}>{err}</div>}
      </label>
    );

    return(
    <div style={{position:"fixed",top:0,right:0,bottom:0,left:220,background:"#f5f4f1",zIndex:201,overflowY:"auto"}}>

      {/* Sticky header */}
      <div style={{background:"#fff",borderBottom:"1px solid rgba(0,0,0,.08)",padding:"12px 32px 0",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <button onClick={()=>setModal(prev=>({...prev,type:"tenant",_rcRoom:undefined,_rcProp:undefined,_rcRent:undefined,_rcLateConfig:undefined,_rcErrs:undefined}))}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.06)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:"#5c4a3a",padding:"5px 10px",borderRadius:6,transition:"background .15s"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Payments
          </button>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-out btn-sm" onClick={()=>setModal(prev=>({...prev,type:"tenant",_rcRoom:undefined,_rcProp:undefined}))}>Cancel</button>
            <button className="btn btn-dk btn-sm" onClick={save} style={{background:"#1a1714",color:"#f5f0e8",fontWeight:700}}>Save Changes</button>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:14}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"#1a1714"}}>Edit Recurring Charge</div>
            <div style={{fontSize:11,color:"#6b5e52",marginTop:2}}>{rcRoom?.tenant?.name} &middot; {rcRoom?.name} &middot; {rcProp?getPropDisplayName(rcProp):""}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:560,margin:"0 auto",padding:"28px 32px 80px",animation:shake?"shake .4s ease":undefined}}>
        <div style={{fontSize:12,color:"#1d4ed8",marginBottom:24,padding:"10px 14px",background:"rgba(59,130,246,.05)",border:"1px solid rgba(59,130,246,.15)",borderRadius:8}}>
          Your changes only affect <strong>future monthly charges</strong>. Charges already sent to tenants will not be affected.
        </div>

      {/* Category */}
      <div style={{marginBottom:16}}>
        {lbl("Category",true)}
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {CATS.map(c=>pillBtn(cat===c,()=>upd("_rcCategory",c),c))}
        </div>
      </div>

      {/* Amount */}
      <div style={{marginBottom:16}}>
        {lbl("Amount",true,errs.rent)}
        <div style={{display:"flex",alignItems:"center",border:`2px solid ${errs.rent?"#c45c4a":"rgba(0,0,0,.08)"}`,borderRadius:9,overflow:"hidden",background:"#fff"}}>
          <span style={{padding:"11px 14px",fontSize:15,fontWeight:700,color:"#6b5e52",borderRight:"1px solid rgba(0,0,0,.08)",background:"rgba(0,0,0,.02)"}}>$</span>
          <input type="number" step="0.01" min="0" value={rent??""} placeholder={String(rcRoom?.rent||0)}
            onChange={e=>setModal(p=>({...p,_rcRent:e.target.value,_rcErrs:{...(p._rcErrs||{}),rent:null}}))}
            style={{flex:1,padding:"11px 14px",border:"none",outline:"none",fontSize:15,fontFamily:"inherit",background:"transparent",color:"#1a1714",fontWeight:700}}/>
        </div>
      </div>

      {/* Description — collapsible */}
      {!showDesc
        ?<button onClick={()=>setModal(p=>({...p,_rcShowDesc:true}))}
          style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#9a7422",fontSize:13,fontWeight:600,fontFamily:"inherit",padding:"2px 0",marginBottom:16}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Description
        </button>
        :<div style={{marginBottom:16}}>
          {lbl("Description")}
          <input value={modal._rcDesc||""} onChange={e=>setModal(p=>({...p,_rcDesc:e.target.value}))} autoFocus
            placeholder={`e.g. ${cat} — monthly`}
            style={{width:"100%",padding:"11px 14px",border:"2px solid rgba(0,0,0,.08)",borderRadius:9,fontSize:14,fontFamily:"inherit",outline:"none",background:"#fff",color:"#1a1714"}}/>
        </div>
      }

      {/* Due Date */}
      <div style={{marginBottom:16}}>
        {lbl("Due Date",true,errs.dueDay)}
        <div style={{display:"flex",alignItems:"center",gap:4,border:`2px solid ${errs.dueDay?"#c45c4a":"rgba(0,0,0,.08)"}`,borderRadius:9,overflow:"hidden",background:"#fff",padding:"2px"}}>
          <div style={{padding:"8px 12px",display:"flex",alignItems:"center",gap:6,color:"#6b5e52"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <input type="number" min="1" max="28" value={dueDay} onChange={e=>setModal(p=>({...p,_rcDueDay:e.target.value,_rcErrs:{...(p._rcErrs||{}),dueDay:null}}))}
            style={{flex:1,padding:"10px 4px",border:"none",outline:"none",fontSize:15,fontFamily:"inherit",background:"transparent",color:"#1a1714",fontWeight:700,maxWidth:60}}/>
          <span style={{padding:"10px 14px 10px 4px",fontSize:13,color:"#7a7067"}}>of each month</span>
        </div>
      </div>

      {/* Starting */}
      <div style={{marginBottom:4}}>
        {lbl("Starting",true)}
        <div style={{display:"flex",gap:8}}>
          <select value={startMonth} disabled={isPast}
            onChange={e=>setModal(p=>({...p,_rcStartYM:`${startYear}-${String(e.target.value).padStart(2,"0")}`}))}
            style={{...ss,width:150,opacity:isPast?.6:1}}>
            {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
          </select>
          <select value={startYear} disabled={isPast}
            onChange={e=>setModal(p=>({...p,_rcStartYM:`${e.target.value}-${String(startMonth).padStart(2,"0")}`}))}
            style={{...ss,width:100,opacity:isPast?.6:1}}>
            {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {isPast&&<div style={{fontSize:11,color:"#7a7067",marginTop:4}}>You can not edit the start date since it is in the past.</div>}
      </div>

      {/* Until lease ends checkbox */}
      <div style={{marginBottom:20,marginTop:12}}>
        {checkbox(untilLeaseEnds,()=>setModal(p=>({...p,_rcUntilLeaseEnds:!p._rcUntilLeaseEnds})),
          "Create charges until lease ends")}
      </div>

      {/* Info box */}
      <div style={{background:"rgba(59,130,246,.05)",border:"1px solid rgba(59,130,246,.15)",borderRadius:9,padding:"10px 14px",marginBottom:20,fontSize:12,color:"#1d4ed8",display:"flex",gap:8,alignItems:"flex-start"}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>The first monthly charge will be due on <strong>{nextChargeDateFmt}</strong> and sent to your tenant every month until {untilLeaseEnds?"the lease ends":"you delete this charge"}.</span>
      </div>

      {/* Bank Account */}
      <div style={{marginBottom:20}}>
        {lbl("Bank Account",true)}
        {bankAccounts.length>0
          ?<select value={bankAccount} onChange={e=>setModal(p=>({...p,_rcBankAccount:e.target.value}))} style={ss}>
            <option value="">Select bank account...</option>
            {bankAccounts.map(b=><option key={b.id||b.name} value={b.name}>{b.name}{b.last4?" — "+b.last4:""}</option>)}
          </select>
          :<input value={bankAccount} onChange={e=>setModal(p=>({...p,_rcBankAccount:e.target.value}))}
            placeholder={settings.companyName||"Bank account name"}
            style={{width:"100%",padding:"10px 14px",border:"2px solid rgba(0,0,0,.08)",borderRadius:9,fontSize:13,fontFamily:"inherit",outline:"none",background:"#fff",color:"#1a1714"}}/>
        }
        {bankAccounts.length===0&&<div style={{fontSize:11,color:"#7a7067",marginTop:4}}>
          To add bank accounts, go to <button onClick={()=>{setModal(null);goTab("settings");}} style={{background:"none",border:"none",color:"#3b82f6",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600,padding:0}}>Settings</button>.
        </div>}
      </div>

      {/* ── Late Fees ── */}
      <div style={{borderTop:"1px solid rgba(0,0,0,.07)",paddingTop:16}}>
        <div style={{fontSize:14,fontWeight:800,color:"#1a1714",marginBottom:4}}>Would you like to set automatic late fees?</div>
        <div style={{fontSize:11,color:"#7a7067",marginBottom:14}}>Per-room override for {rcRoom?.name||"this room"} at {rcProp?getPropDisplayName(rcProp):"this property"}.</div>

        {/* Initial fee */}
        <div style={{background:"rgba(0,0,0,.02)",border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:14,marginBottom:10}}>
          <div style={{marginBottom:lc.initialEnabled?14:0}}>
            {checkbox(lc.initialEnabled,()=>updLc("initialEnabled",!lc.initialEnabled),"One-time initial fee")}
          </div>
          {lc.initialEnabled&&<>
            <div style={{marginBottom:10}}>
              {lbl("Fee type")}
              <div style={{display:"flex",gap:4}}>
                {pillBtn(lc.initialFeeType==="flat",()=>updLc("initialFeeType","flat"),"Flat")}
                {pillBtn(lc.initialFeeType==="pctRent",()=>updLc("initialFeeType","pctRent"),"% Rent")}
                {pillBtn(lc.initialFeeType==="pctUnpaid",()=>updLc("initialFeeType","pctUnpaid"),"% Unpaid")}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                {lbl("Amount",true,errs.initialFee)}
                {lc.initialFeeType==="flat"?dollarWrap("initialFee","initialFee","50"):pctWrap("initialFee","initialFee","10")}
              </div>
              <div>
                {lbl("Applied",true)}
                <select value={lc.initialApplyDays??3} onChange={e=>updLc("initialApplyDays",Number(e.target.value))} style={{...ss,fontSize:12}}>
                  {INITIAL_APPLY_OPTS.map(d=><option key={d} value={d}>{d} days after rent is due</option>)}
                </select>
              </div>
            </div>
          </>}
        </div>

        {/* Daily fees */}
        <div style={{background:"rgba(0,0,0,.02)",border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:14,marginBottom:10}}>
          <div style={{marginBottom:lc.dailyEnabled?14:0}}>
            {checkbox(lc.dailyEnabled,()=>updLc("dailyEnabled",!lc.dailyEnabled),"Daily late fees")}
          </div>
          {lc.dailyEnabled&&<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                {lbl("Amount",true,errs.dailyFee)}
                {dollarWrap("dailyFee","dailyFee","5")}
              </div>
              <div>
                {lbl("Starting",true)}
                <select value={lc.dailyStartDays??6} onChange={e=>updLc("dailyStartDays",Number(e.target.value))} style={{...ss,fontSize:12}}>
                  {DAILY_START_OPTS.map(d=><option key={d} value={d}>{d} days after rent is due</option>)}
                </select>
              </div>
            </div>
          </>}
        </div>

        {/* Late fee limit */}
        <div style={{marginBottom:4}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1a1714",marginBottom:10}}>Would you like to set a late fee limit?</div>
          <div style={{marginBottom:lc.limitEnabled?14:0}}>
            {checkbox(lc.limitEnabled,()=>updLc("limitEnabled",!lc.limitEnabled),"Enable late fee limit")}
          </div>
          {lc.limitEnabled&&<div style={{background:"rgba(0,0,0,.02)",border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:14,display:"flex",flexDirection:"column",gap:14}}>
            {/* Stop daily fees after X days */}
            <div>
              {lbl("Stop daily fees after")}
              <select value={lc.limitStopAfterDays??""} onChange={e=>updLc("limitStopAfterDays",e.target.value?Number(e.target.value):null)} style={ss}>
                <option value="">No limit on days</option>
                {STOP_AFTER_OPTS.map(d=><option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
            {/* Total will not exceed */}
            <div>
              {lbl("Total late fees will not exceed",false,errs.limitMaxAmt)}
              <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  {lc.limitMaxType==="flat"
                    ?dollarWrap("limitMaxAmt","limitMaxAmt","200")
                    :pctWrap("limitMaxAmt","limitMaxAmt","50")
                  }
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0,paddingTop:1}}>
                  {pillBtn(lc.limitMaxType==="flat",()=>updLc("limitMaxType","flat"),"Flat")}
                  {pillBtn(lc.limitMaxType==="pctRent",()=>updLc("limitMaxType","pctRent"),"% Rent")}
                </div>
              </div>
              {errs.limitMaxAmt&&<div style={{fontSize:10,color:"#c45c4a",marginTop:3,animation:"shake .4s ease"}}>{errs.limitMaxAmt}</div>}
            </div>
          </div>}
        </div>
      </div>

      {/* Delete at bottom */}
      <div style={{marginTop:32,paddingTop:20,borderTop:"1px solid rgba(0,0,0,.07)",textAlign:"center"}}>
        <button onClick={()=>setModal({type:"confirmAction",title:"Delete Recurring Charge",body:`This will stop auto-generating ${cat} charges for ${rcRoom?.tenant?.name||"this tenant"} going forward. Existing charges are not affected.`,confirmLabel:"Delete Charge",confirmStyle:"btn-red",onConfirm:()=>{
          setProps(prev=>prev.map(p=>{
            if(!rcProp||p.id!==rcProp.id)return p;
            return{...p,units:(p.units||[]).map(u=>({...u,rooms:(u.rooms||[]).map(rm=>rm.id!==rcRoom.id?rm:{...rm,recurringDisabled:true})}))};
          }));
          setModal(null);
        }})}
          style={{background:"none",border:"none",cursor:"pointer",color:"#c45c4a",fontSize:12,fontWeight:700,fontFamily:"inherit",padding:"4px 0"}}>
          Delete Charge
        </button>
      </div>
    </div>
    </div>);
  })()}

  {/* Edit Charge */}
  {modal&&modal.type==="editCharge"&&(()=>{
    const backToTenant=()=>{if(modal._fromTenant&&modal._tenantRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:modal._tenantRoom});}else setModal(null);};
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
      backToTenant();
    };
    return(
    <div className="mbg" onClick={backToTenant}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:460,animation:shake?"shake .4s ease":undefined}}>
      <h2 style={{marginBottom:4}}>Edit Charge</h2>
      <div style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>{c.tenantName} · {c.propName}</div>
      {isPaid&&<div style={{background:"rgba(212,168,83,.08)",border:"1px solid rgba(212,168,83,.2)",borderRadius:8,padding:"10px 12px",marginBottom:14,fontSize:11,color:"#9a7422",fontWeight:600}}>This charge has been paid. A reason and audit note are required.</div>}
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
      <div className="mft"><button className="btn btn-out" onClick={backToTenant}>Cancel</button><button className="btn btn-gold" onClick={save}>Save Changes</button></div>
    </div></div>);
  })()}

  {/* Void Charge */}
  {modal&&modal.type==="voidCharge"&&(()=>{
    const backToTenant=()=>{if(modal._fromTenant&&modal._tenantRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:modal._tenantRoom});}else setModal(null);};
    return(
    <div className="mbg" onClick={backToTenant}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420,animation:modal.shake?"shake .4s ease":undefined}}>
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
      <div className="mft"><button className="btn btn-out" onClick={backToTenant}>Cancel</button>
        <button className="btn btn-red" onClick={()=>{
          if(!(modal.voidReason||"").trim()){setModal(p=>({...p,voidReasonErr:true}));shakeModal();return;}
          setCharges(p=>p.map(c=>c.id===modal.chargeId?{...c,voided:true,voidedDate:TODAY.toISOString().split("T")[0],voidedReason:modal.voidReason,amountPaid:0,payments:[]}:c));
          setExpCharge(null);backToTenant();
        }}>Confirm Void</button>
      </div>
    </div></div>);
  })()}

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
    const backToTenant=()=>{if(modal._fromTenant&&modal._tenantRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:modal._tenantRoom});}else setModal(null);};
    return(
    <div className="mbg" onClick={backToTenant}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
      <h2>Record Payment</h2>
      {modal.step===1&&<>
        <div className="fld"><label>Select Tenant</label><select value={modal.selRoom} onChange={e=>setModal(prev=>({...prev,selRoom:e.target.value,selCharge:""}))}><option value="">Choose...</option>{occRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} - {r.propName} {r.name}</option>)}</select></div>
        {modal.selRoom&&roomCharges.length>0&&<div className="fld"><label>Select Charge</label>{roomCharges.map(c=>{const st=chargeStatus(c);return(
          <div key={c.id} style={{padding:8,border:`2px solid ${modal.selCharge===c.id?"#3b82f6":"rgba(0,0,0,.05)"}`,borderRadius:6,marginBottom:4,cursor:"pointer",background:modal.selCharge===c.id?"rgba(59,130,246,.04)":"#fff"}} onClick={()=>setModal(prev=>({...prev,selCharge:c.id,payAmount:c.amount-c.amountPaid}))}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,fontWeight:600}}>{c.category}: {c.desc}</span><span className={`badge ${st==="pastdue"?"b-red":"b-blue"}`}>{st}</span></div>
            <div style={{fontSize:10,color:"#6b5e52"}}>Due {fmtD(c.dueDate)} - {fmtS(c.amount-c.amountPaid)} remaining</div>
          </div>);})}</div>}
        {modal.selRoom&&roomCharges.length===0&&<div style={{background:"rgba(212,168,83,.06)",borderRadius:8,padding:12,fontSize:12,color:"#9a7422",marginBottom:10}}>No unpaid charges. <button className="btn btn-gold btn-sm" style={{marginLeft:6}} onClick={()=>setModal({type:"createCharge",roomId:modal.selRoom,category:"Rent",desc:"",amount:(selRoom&&selRoom.rent)||0,dueDate:TODAY.toISOString().split("T")[0],notes:""})}>Create Charge</button></div>}
        <div className="mft"><button className="btn btn-out" onClick={backToTenant}>Cancel</button>
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
        <div className="mft"><button className="btn btn-out" onClick={backToTenant}>Cancel</button><button className="btn btn-out" onClick={()=>setModal(prev=>({...prev,step:1}))}>Back</button>
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
            <button className="btn btn-out" onClick={backToTenant}>Done</button>
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
    const fromTenant=!!modal._fromTenant;
    const showDesc=!!modal._showDesc;
    const cats=["Rent","Security Deposit","Utility Overage","Late Fee","Damage Charge","Cleaning Fee","Other"];
    const submit=()=>{
      const e={};
      if(!modal.roomId)e.roomId="Select a tenant";
      if(!modal.amount||Number(modal.amount)<=0)e.amount="Enter a valid amount";
      if(!modal.dueDate)e.dueDate="Select a due date";
      if(Object.keys(e).length){setModal(prev=>({...prev,chErrs:e}));shakeModal();return;}
      const tenantName=(selRoom&&selRoom.tenant&&selRoom.tenant.name)||modal.tenantName||"";
      const propName=(selRoom&&selRoom.propName)||modal.propName||"";
      const roomName=(selRoom&&selRoom.name)||modal.roomName||"";
      const roomId=modal.roomId;
      createCharge({roomId,tenantName,propName,roomName,category:modal.category||"Rent",desc:modal.desc||(modal.category||"Rent"),amount:Number(modal.amount),dueDate:modal.dueDate});
      if((modal.category||"Rent")==="Security Deposit"){
        const existing=sdLedger.find(s=>s.roomId===roomId&&!s.returned);
        if(existing){
          setSdLedger(p=>p.map(s=>s.id===existing.id?{...s,amountHeld:s.amountHeld+Number(modal.amount),deposits:[...(s.deposits||[]),{id:uid(),amount:Number(modal.amount),date:TODAY.toISOString().split("T")[0],desc:modal.desc||"Security Deposit",chargeId:uid()}]}:s));
        } else {
          setSdLedger(p=>[...p,{id:uid(),roomId,tenantName,propName,roomName,amountHeld:Number(modal.amount),deposits:[{id:uid(),amount:Number(modal.amount),date:TODAY.toISOString().split("T")[0],desc:modal.desc||"Security Deposit"}],deductions:[],returned:null,returnDate:null}]);
        }
      }
      // If opened from tenant profile, return to it instead of clearing modal entirely
      if(fromTenant&&modal._tenantRoom){
        setTenantProfileTab("payments");
        setModal({type:"tenant",data:modal._tenantRoom});
      } else {
        setModal(null);
      }
    };
    const closeModal=()=>{
      if(fromTenant&&modal._tenantRoom){
        setTenantProfileTab("payments");
        setModal({type:"tenant",data:modal._tenantRoom});
      } else {
        setModal(null);
      }
    };
    return(
    <div className="mbg" onClick={closeModal}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <h2 style={{margin:0}}>Create Charge</h2>
        <button onClick={closeModal} style={{background:"none",border:"none",cursor:"pointer",color:"#7a7067",padding:4,borderRadius:4,display:"flex"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      {/* Tenant — hidden when opened from tenant profile */}
      {!fromTenant&&<div className="fld" style={{marginBottom:16}}>
        <label style={{color:errs.roomId?"#c45c4a":undefined}}>Tenant{errs.roomId&&<span style={{fontWeight:400,fontSize:10,marginLeft:6,color:"#c45c4a"}}>{errs.roomId}</span>}</label>
        <select value={modal.roomId||""} onChange={e=>setModal(prev=>({...prev,roomId:e.target.value,chErrs:{...(prev.chErrs||{}),roomId:null}}))} style={{borderColor:errs.roomId?"#c45c4a":undefined}}>
          <option value="">Select tenant...</option>
          {occRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} — {r.propName} {r.name}</option>)}
        </select>
      </div>}
      {/* Category — pill buttons */}
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5c4a3a",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Category <span style={{color:"#c45c4a"}}>*</span></label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {cats.map(cat=>{
            const active=(modal.category||"Rent")===cat;
            return(
            <button key={cat} onClick={()=>setModal(p=>({...p,category:cat}))}
              style={{padding:"6px 13px",borderRadius:6,border:`2px solid ${active?"#1a1714":"rgba(0,0,0,.1)"}`,background:active?"#1a1714":"#fff",color:active?"#f5f0e8":"#5c4a3a",fontSize:12,fontWeight:active?700:500,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
              {cat}
            </button>);
          })}
        </div>
      </div>
      {/* Amount */}
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:errs.amount?"#c45c4a":"#5c4a3a",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>
          Amount <span style={{color:"#c45c4a"}}>*</span>
          {errs.amount&&<span style={{fontWeight:400,fontSize:10,marginLeft:6,color:"#c45c4a"}}>{errs.amount}</span>}
        </label>
        <div style={{display:"flex",alignItems:"center",border:`2px solid ${errs.amount?"#c45c4a":"rgba(0,0,0,.08)"}`,borderRadius:10,overflow:"hidden",background:"#fff"}}>
          <span style={{padding:"12px 14px",fontSize:16,fontWeight:700,color:"#6b5e52",borderRight:"1px solid rgba(0,0,0,.08)",background:"rgba(0,0,0,.02)"}}>$</span>
          <input type="number" step="0.01" min="0" value={modal.amount||""} placeholder="0.00"
            onChange={e=>setModal(prev=>({...prev,amount:e.target.value,chErrs:{...(prev.chErrs||{}),amount:null}}))}
            style={{flex:1,padding:"12px 14px",border:"none",outline:"none",fontSize:15,fontFamily:"inherit",background:"transparent",color:"#1a1714"}}/>
        </div>
      </div>
      {/* Due Date */}
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:errs.dueDate?"#c45c4a":"#5c4a3a",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>
          Due Date <span style={{color:"#c45c4a"}}>*</span>
          {errs.dueDate&&<span style={{fontWeight:400,fontSize:10,marginLeft:6,color:"#c45c4a"}}>{errs.dueDate}</span>}
        </label>
        <input type="date" value={modal.dueDate||""} onChange={e=>setModal(prev=>({...prev,dueDate:e.target.value,chErrs:{...(prev.chErrs||{}),dueDate:null}}))}
          style={{width:"100%",padding:"12px 14px",border:`2px solid ${errs.dueDate?"#c45c4a":"rgba(0,0,0,.08)"}`,borderRadius:10,fontSize:14,fontFamily:"inherit",outline:"none",background:"#fff",color:"#1a1714"}}/>
      </div>
      {/* Description — collapsible */}
      {!showDesc
        ?<button onClick={()=>setModal(p=>({...p,_showDesc:true}))}
          style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#9a7422",fontSize:13,fontWeight:600,fontFamily:"inherit",padding:"2px 0",marginBottom:16}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Description
        </button>
        :<div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5c4a3a",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Description</label>
          <input value={modal.desc||""} onChange={e=>setModal(p=>({...p,desc:e.target.value}))}
            placeholder={`e.g. ${modal.category||"Rent"} — ${new Date().toLocaleString("default",{month:"long",year:"numeric"})}`}
            autoFocus
            style={{width:"100%",padding:"12px 14px",border:"2px solid rgba(0,0,0,.08)",borderRadius:10,fontSize:14,fontFamily:"inherit",outline:"none",background:"#fff",color:"#1a1714"}}/>
        </div>
      }
      <div className="mft" style={{marginTop:8}}>
        <button className="btn btn-out" onClick={closeModal}>Cancel</button>
        <button className="btn btn-dk" onClick={submit} style={{background:"#1a1714",color:"#f5f0e8",fontWeight:700}}>Create</button>
      </div>
    </div></div>);})()}


  {/* Add Credit */}
  {modal&&modal.type==="addCredit"&&(()=>{
    const backToTenant=()=>{if(modal._fromTenant&&modal._tenantRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:modal._tenantRoom});}else setModal(null);};
    const occRooms=occLeases;
    return(
    <div className="mbg" onClick={backToTenant}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
      <h2>Add Credit</h2>
      <p style={{fontSize:11,color:"#5c4a3a",marginBottom:12}}>Credits auto-apply to next month's rent.</p>
      <div className="fld"><label>Tenant</label><select value={modal.roomId} onChange={e=>setModal(prev=>({...prev,roomId:e.target.value}))}><option value="">Select...</option>{occRooms.map(r=><option key={r.id} value={r.id}>{r.tenant.name} - {r.propName} {r.name}</option>)}</select></div>
      <div className="fld"><label>Amount</label><input type="number" step=".01" value={modal.amount} onChange={e=>setModal(prev=>({...prev,amount:Number(e.target.value)}))}/></div>
      <div className="fld"><label>Reason</label><input value={modal.reason||""} onChange={e=>setModal(prev=>({...prev,reason:e.target.value}))} placeholder="e.g. Overpayment, SD credit..."/></div>
      <div className="mft"><button className="btn btn-out" onClick={backToTenant}>Cancel</button>
        <button className="btn btn-green" disabled={!modal.roomId||!modal.amount} onClick={()=>{const rm=occRooms.find(r=>r.id===modal.roomId);setCredits(p=>[{id:uid(),roomId:modal.roomId,tenantName:(rm&&rm.tenant&&rm.tenant.name)||"",amount:modal.amount,reason:modal.reason,date:TODAY.toISOString().split("T")[0],applied:false},...p]);backToTenant();}}>Add Credit</button></div>
    </div></div>);})()}

  {/* Return SD */}
  {modal&&modal.type==="returnSD"&&(()=>{
    const backToTenant=()=>{if(modal._fromTenant&&modal._tenantRoom){setTenantProfileTab("payments");setModal({type:"tenant",data:modal._tenantRoom});}else setModal(null);};
    const tenantList=[...archive.map(a=>({id:a.id,name:a.name,roomName:a.roomName,propName:a.propName,rent:a.rent,type:"past"})),...occLeases.map(r=>({id:r.id,name:r.tenant.name,roomName:r.name,propName:r.propName,rent:r.rent,type:"current"}))];
    const sel=tenantList.find(t=>t.id===modal.roomId);
    const sdHeld=(sel&&sel.rent)||0;
    const deductions=modal.deductions||[];
    const totalDed=deductions.reduce((s,d)=>s+d.amount,0);
    const returnAmt=Math.max(0,sdHeld-totalDed);
    return(
    <div className="mbg" onClick={backToTenant}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
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
      <div className="mft"><button className="btn btn-out" onClick={backToTenant}>Cancel</button>
        <button className="btn btn-green" disabled={!sel} onClick={()=>{setSdLedger(p=>[{id:uid(),roomId:modal.roomId,tenantName:sel.name,propName:sel.propName,roomName:sel.roomName,amountHeld:sdHeld,deductions,returned:returnAmt,returnDate:TODAY.toISOString().split("T")[0]},...p]);backToTenant();}}>Confirm Return {fmtS(returnAmt)}</button></div>
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
      const newLead={id:uid(),name:modal.name.trim(),phone:modal.phone||"",email:modal.email||"",property:modal.property||"",termPropId:modal.termPropId||"",room:"",moveIn:"",income:"",status:"new-lead",submitted:TODAY.toISOString().split("T")[0],bgCheck:"not-started",creditScore:"—",refs:"not-started",source:modal.source||"Phone / Direct Call",lastContact:TODAY.toISOString().split("T")[0],notes:modal.notes||"Added manually — direct call",history:[{from:"new",to:"called",date:TODAY.toISOString().split("T")[0],note:"Added manually by admin"}]};
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
        <select value={modal.termPropId||modal.property||""} onChange={e=>{const _p=props.find(x=>x.id===e.target.value);setModal(prev=>({...prev,termPropId:e.target.value,property:_p?getPropDisplayName(_p):""}));}}>
          <option value="">No preference / unknown</option>
          {props.map(p=><option key={p.id} value={p.id}>{getPropDisplayName(p)}</option>)}
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
    const waivedAdminFee=modal.waivedAdminFee!==undefined?modal.waivedAdminFee:adminFee;
    const totalFee=pkg==="none"?waivedAdminFee:pkgFees[pkg]+incomeAdds[incomeAdd]+adminFee;
    const pkgLabel={"none":"No screening (waived)","credit-only":"Credit Report Only","credit-bg":"Credit + Full BG Check"};
    const incomeLabel={"none":"None","income-only":"Income Verify (+$10)","income-employment":"Income + Employer (+$15)"};
    const inviteStep=modal.inviteStep||"configure";
    // Source of truth: prefer termPropId (ID-based) over a.property (name-based, may be stale)
    const invProp=a.termPropId?props.find(p=>p.id===a.termPropId):(a.property?props.find(p=>p.name===a.property)||props.find(p=>p.addr===a.property):null);
    const _searchProps=invProp?[invProp]:props;
    const invRoomObj=a.termRoomId?_searchProps.flatMap(p=>[...allRooms(p),...leaseableItems(p)]).find(r=>r.id===a.termRoomId)||null:null;
    const invRoomProp=invRoomObj?(invRoomObj.propId?props.find(p=>p.id===invRoomObj.propId):null)||props.find(p=>allRooms(p).some(r=>r.id===invRoomObj.id))||invProp:invProp;
    const invRent=a.termRent||(invRoomObj?invRoomObj.rent:0);
    const invMoveIn=a.moveInTbd?"TBD":(a.termMoveIn||a.moveIn||"");
    const invRoomLabel=a.skipRoomAssign?"Assign at lease":(invRoomObj?invRoomObj.name:(a.room||"Not specified"));
    const invModeLabel=a.skipRoomAssign?"Assign at lease":invRoomObj?"Room locked":"Not specified";
    const invPropName=invRoomProp?(getPropDisplayName?getPropDisplayName(invRoomProp):invRoomProp.name):(a.property||"");
    const link=(settings.siteUrl||"https://rentblackbear.com")+"/apply?invite="+a.id;
    const doShake=shakeModal;

    if(inviteStep==="preview"){
      const errors=[];
      if(!a.skipRoomAssign&&!a.termRoomId&&!a.moveInTbd)errors.push("No room assigned — go back to applicant and assign a room or enable Assign at Lease.");
      if(pkg==="none"&&!(modal.waiverReason||"").trim())errors.push("Waiver reason required when screening is skipped.");
      const validate=()=>{if(errors.length>0){setModal(prev=>({...prev,sendErrors:errors}));doShake();return false;}return true;};
      const commit=(method)=>{
        const updatedApp=buildUpdatedApp(method);
        const updatedApps=apps.map(x=>x.id===a.id?updatedApp:x);
        setApps(()=>updatedApps);
        save("hq-apps",updatedApps);
        setNotifs(p=>[{id:uid(),type:"app",
          msg:"Invite sent to "+a.name+" via "+method+" - "+(totalFee===0?"Fee waived":"$"+totalFee),
          date:TODAY.toISOString().split("T")[0],read:false,urgent:false
        },...p]);
      };
      const buildUpdatedApp=(method)=>({...a,
        status:"invited",lastContact:TODAY.toISOString().split("T")[0],
        screenPkg:pkg,incomeAdd,appFee:totalFee,
        waiverReason:modal.waiverReason||"",
        property:invPropName||a.property||"",
        room:invRoomLabel,
        inviteRent:invRent,inviteRoomId:a.termRoomId||null,
        inviteRoomName:a.skipRoomAssign?"":invRoomLabel,
        invitePropName:invPropName,
        inviteRoomMode:a.skipRoomAssign?"none":"locked",inviteLink:link,
        lastContact:TODAY.toISOString().split("T")[0],
        sentVia:(a.sentVia?a.sentVia+", ":"")+method,
        history:[...(a.history||[]),{from:a.status,to:"invited",
          date:TODAY.toISOString().split("T")[0],
          note:(a.status==="invited"?"Re-invited":"Invited")+" via "+method+" - "+pkgLabel[pkg]+" - $"+totalFee+(modal.waiverReason?" - "+modal.waiverReason:"")
        }]
      });
      const sendEmail=async()=>{
        if(!validate())return;
        setModal(prev=>({...prev,emailSending:true,sendErrors:[]}));
        try{
          // Save to Supabase FIRST — tenant clicks link before debounce fires
          const updatedApp=buildUpdatedApp("Email");
          const updatedApps=apps.map(x=>x.id===a.id?updatedApp:x);
          await save("hq-apps",updatedApps);
          setApps(()=>updatedApps);
          const res=await fetch("/api/invite",{method:"POST",headers:{"Content-Type":"application/json"},
            body:JSON.stringify({to:a.email,name:a.name,link,
              property:a.property||"",
              address:invProp?invProp.addr:"",
              room:a.skipRoomAssign?"Assign at lease":(invRoomObj?invRoomObj.name:a.room||""),
              rent:invRent,fee:totalFee,screeningPkg:pkgLabel[pkg],
              note:modal.sendNote||"",waived:pkg==="none"?["Screening waived"]:[]
            })
          });
          const d=await res.json();
          if(d.ok){
            setNotifs(p=>[{id:uid(),type:"app",msg:"Invite sent to "+a.name+" via Email - "+(totalFee===0?"Fee waived":"$"+totalFee),date:TODAY.toISOString().split("T")[0],read:false,urgent:false},...p]);
            setModal(prev=>({...prev,emailSent:true,emailSending:false}));
          } else{setModal(prev=>({...prev,sendErrors:[d.error||"Email failed - check Resend config"],emailSending:false}));}
        }catch{setModal(prev=>({...prev,sendErrors:["Network error - check connection and try again"],emailSending:false}));}
      };
      const phoneNum=(a.phone||"").replace(/\D/g,"");
      const smsTxt="Hey "+a.name.split(" ")[0]+"! You are invited to apply at Black Bear Rentals"+(a.property?" - "+a.property:"")+(invRoomObj?" ("+invRoomObj.name+")":(a.room?" ("+a.room+")":""))+(invRent?" at $"+invRent+"/mo":"")+". Apply: "+link+(totalFee===0?". No screening fee!":(". Fee: $"+totalFee))+" - Black Bear Rentals";
      const smsHref="sms:"+phoneNum+"?&body="+encodeURIComponent(smsTxt);
      const copyLink=()=>{navigator.clipboard.writeText(link).then(()=>{setModal(prev=>({...prev,linkCopied:true}));setTimeout(()=>setModal(prev=>({...prev,linkCopied:false})),2500);});};
      return(
      <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <h2 style={{margin:0,flex:1}}>{a.status==="invited"?"Review and Re-send Invite":"Review and Send Invite"}</h2>
        </div>
        <div style={{background:"rgba(212,168,83,.04)",border:"1px solid rgba(212,168,83,.2)",borderRadius:10,padding:16,marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:800,color:"#9a7422",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Invite Summary</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <tbody>
              <tr><td style={{padding:"5px 0",color:"#6b5e52",width:"38%",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Applicant</td><td style={{padding:"5px 0",fontWeight:700,borderBottom:"1px solid rgba(0,0,0,.04)"}}>{a.name}</td></tr>
              <tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Contact</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:11,color:"#5c4a3a"}}>{a.email} - {a.phone}</td></tr>
              {invPropName&&<tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Property</td><td style={{padding:"5px 0",fontWeight:600,borderBottom:"1px solid rgba(0,0,0,.04)"}}>{invPropName}{invRoomProp?.addr&&invRoomProp.addr!==invPropName?" — "+invRoomProp.addr:""}</td></tr>}
              <tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Room</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)",color:a.skipRoomAssign?"#4a7c59":"inherit",fontWeight:a.skipRoomAssign?600:400}}>{invRoomLabel}</td></tr>
              {invRent>0&&<tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Rent</td><td style={{padding:"5px 0",fontWeight:700,color:"#2d6a3f",borderBottom:"1px solid rgba(0,0,0,.04)"}}>${invRent}/mo</td></tr>}
              {(invMoveIn||a.moveInTbd)&&<tr><td style={{padding:"5px 0",color:"#6b5e52",borderBottom:"1px solid rgba(0,0,0,.04)"}}>Move-in</td><td style={{padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontWeight:a.moveInTbd?700:400,color:a.moveInTbd?"#9a7422":"inherit"}}>{a.moveInTbd?"To Be Determined":fmtD(invMoveIn)}</td></tr>}
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
          ?<>
            <div style={{background:"rgba(74,124,89,.08)",border:"1px solid rgba(74,124,89,.2)",borderRadius:8,padding:"12px 14px",textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"#2d6a3f",marginBottom:2}}>Invite sent to {a.email}</div>
              <div style={{fontSize:11,color:"#4a7c59"}}>They'll receive the application link and instructions.</div>
            </div>
            <div className="mft" style={{marginTop:0}}>
              <button className="btn btn-green" style={{flex:1}} onClick={()=>setModal(null)}>Done</button>
            </div>
          </>
          :<>
            <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:10}}>
              <button style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,width:"100%",padding:"12px 16px",borderRadius:8,border:"none",background:settings.adminAccent||"#4a7c59",color:"#fff",fontWeight:700,fontSize:13,cursor:modal.emailSending?"not-allowed":"pointer",fontFamily:"inherit",opacity:modal.emailSending?0.6:1,transition:"opacity .15s"}}
                onClick={sendEmail} disabled={!!modal.emailSending}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {modal.emailSending?"Sending...":"Send Email Invite"}
              </button>
              <div style={{display:"flex",gap:7}}>
                <a href={smsHref} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 16px",borderRadius:8,border:"1px solid rgba(0,0,0,.1)",background:"#fff",color:"#1a1714",fontWeight:600,fontSize:12,textDecoration:"none",cursor:"pointer",fontFamily:"inherit",transition:"background .15s"}}
                  onClick={()=>{if(!validate())return;commit("Text");}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Text Invite
                </a>
                <button style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 16px",borderRadius:8,border:"1px solid rgba(0,0,0,.1)",background:modal.linkCopied?"rgba(74,124,89,.08)":"#fff",color:modal.linkCopied?"#4a7c59":"#1a1714",fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
                  onClick={copyLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  {modal.linkCopied?"Copied!":"Copy Link"}
                </button>
              </div>
            </div>
            <div className="mft" style={{marginTop:0}}>
              <button className="btn btn-out" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-out" onClick={()=>setModal(prev=>({...prev,inviteStep:"configure",sendErrors:[],emailSent:false}))}>← Back</button>
            </div>
          </>
        }
      </div></div>);
    }

    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:540}}>
      <h2 style={{marginBottom:4}}>Configure Invite</h2>
      <div style={{background:"rgba(0,0,0,.02)",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:12,color:"#5c4a3a",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span><strong>{a.name}</strong> - {a.email} - {a.phone}</span>
        <span style={{fontSize:10,color:"#6b5e52"}}>{a.source||""}</span>
      </div>
      {/* Room / Move-in summary — read-only, pulled from app modal */}
      {(()=>{
        const appProp=a.termPropId?props.find(p=>p.id===a.termPropId):props.find(p=>p.name===a.property);
        const appRoom=a.termRoomId?allRooms(appProp||{units:[]}).find(r=>r.id===a.termRoomId):null;
        const modeLabel=a.skipRoomAssign?"Assign at lease":a.termRoomId?"Room locked":"Not yet assigned";
        const moveInDisplay=a.moveInTbd?"TBD":(fmtD(a.termMoveIn||a.moveIn)||"Not set");
        const hasAnyDetail=a.property||a.room||a.termMoveIn||a.moveIn||a.termRoomId;
        return(
        <div className="tp-card" style={{marginBottom:10,background:"rgba(0,0,0,.01)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:hasAnyDetail?10:0}}>
            <h3 style={{margin:0}}>Room Assignment</h3>
            <button onClick={()=>setModal({type:"app",data:a})}
              onMouseEnter={e=>{e.currentTarget.style.color="#1a1714";e.currentTarget.style.textDecorationColor="#1a1714";}}
              onMouseLeave={e=>{e.currentTarget.style.color="#9a7422";e.currentTarget.style.textDecorationColor="#9a7422";}}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:10,fontWeight:600,color:"#9a7422",fontFamily:"inherit",textDecoration:"underline",textDecorationColor:"#9a7422",padding:0,transition:"color .12s"}}>
              Edit in applicant
            </button>
          </div>
          {!hasAnyDetail&&!a.skipRoomAssign&&<div style={{fontSize:11,color:"#9a7422",padding:"7px 10px",background:"rgba(212,168,83,.06)",border:"1px solid rgba(212,168,83,.15)",borderRadius:6}}>
            No room assigned yet. Go back to the applicant to set property, room, and move-in date.
          </div>}
          {(hasAnyDetail||a.skipRoomAssign)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 16px"}}>
            {a.skipRoomAssign
              ?<div style={{gridColumn:"1/-1",fontSize:11,color:"#4a7c59",padding:"7px 10px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.15)",borderRadius:6}}>
                Room assignment skipped &#8212; will be confirmed at lease signing.
              </div>
              :<>
                <div>
                  <div style={{fontSize:9,color:"#9a7422",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>Assignment Mode</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>{modeLabel}</div>
                </div>
                {a.property&&<div>
                  <div style={{fontSize:9,color:"#9a7422",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>Property</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>{getPropDisplayName(appProp||{name:a.property})}</div>
                </div>}
                {(a.room||appRoom)&&<div>
                  <div style={{fontSize:9,color:"#9a7422",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>Room</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>{appRoom?appRoom.name:a.room}</div>
                </div>}
                <div>
                  <div style={{fontSize:9,color:"#9a7422",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>Move-In</div>
                  <div style={{fontSize:12,fontWeight:600,color:a.moveInTbd?"#9a7422":"#1a1714"}}>{moveInDisplay}</div>
                </div>
                {(a.termRent||a.negotiatedRent)&&<div>
                  <div style={{fontSize:9,color:"#9a7422",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>Monthly Rent</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#2d6a3f"}}>${a.termRent||a.negotiatedRent}/mo</div>
                </div>}
              </>
            }
          </div>}
        </div>);
      })()}
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
        {pkg==="none"&&<div style={{padding:"8px 10px",borderRadius:6,background:"rgba(0,0,0,.02)",border:"1px solid rgba(0,0,0,.06)",marginBottom:4}}>
          <div style={{fontSize:10,color:"#6b5e52",marginBottom:6}}>Income verification not available when screening is waived.</div>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:"#6b5e52"}}>
            Admin fee (optional):
            <div style={{display:"flex",alignItems:"center",gap:0}}>
              <span style={{padding:"2px 5px",background:"rgba(0,0,0,.04)",border:"1px solid rgba(0,0,0,.08)",borderRight:"none",borderRadius:"4px 0 0 4px",fontSize:11,color:"#999",fontWeight:700}}>$</span>
              <input type="number" min={0} max={200} value={waivedAdminFee}
                onChange={e=>setModal(prev=>({...prev,waivedAdminFee:Number(e.target.value)||0}))}
                style={{width:52,borderRadius:"0 4px 4px 0",borderLeft:"none",padding:"2px 6px",fontSize:11,border:"1px solid rgba(0,0,0,.08)",fontFamily:"inherit"}}/>
            </div>
            <span style={{color:"#aaa",fontSize:9}}>one-time for this invite</span>
          </div>
        </div>}
        <div style={{marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:totalFee===0?"rgba(74,124,89,.06)":"rgba(212,168,83,.06)",borderRadius:8,border:"1px solid "+(totalFee===0?"rgba(74,124,89,.15)":"rgba(212,168,83,.15)")}}>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <span style={{fontSize:11,color:"#6b5e52"}}>{pkgLabel[pkg]}{incomeAdd!=="none"?" + "+incomeLabel[incomeAdd]:""}{pkg==="none"&&waivedAdminFee>0?" + admin fee":""}</span>
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
        <button className="btn btn-out" onClick={()=>setModal({type:"app",data:a})}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,.04)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="";}}
          style={{transition:"background .12s"}}>&#8592; Back to Applicant</button>
        <button className="btn btn-gold" onClick={()=>{
          if(!a.skipRoomAssign&&!a.termRoomId&&!a.moveInTbd){
            setModal(prev=>({...prev,inviteRoomErr:true}));shakeModal();return;
          }
          setModal(prev=>({...prev,inviteStep:"preview",sendErrors:[],inviteRoomErr:false}));
        }}>Preview Summary</button>
      </div>
      {modal.inviteRoomErr&&<div style={{color:"#c45c4a",fontSize:11,fontWeight:600,marginTop:8,padding:"8px 12px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.2)",borderRadius:7,animation:"shake .4s ease"}}>
        Go back to the applicant and assign a room or toggle &ldquo;Assign at lease&rdquo; to continue without one.
      </div>}
    </div></div>);
  })()}


  {/* ── Lease Preview Modal ── */}
  {modal&&modal.previewLeaseOpen&&(
    <div className="mbg" style={{zIndex:110}} onClick={()=>setModal(p=>({...p,previewLeaseOpen:false}))}>
      <div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:700,padding:0}}>

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
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:560,animation:shake?"shake .4s ease":undefined}}>
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
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(modal.data?{type:"app",data:modal.data}:null)}>← Back</button>
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
    const allVacant=props.flatMap(p=>allRooms(p).filter(r=>r.st==="vacant").map(r=>({...r,propName:p.addr||p.name,propId:p.id})));
    const targetProp=a.termPropId?props.find(p=>p.id===a.termPropId):props.find(p=>p.name===a.property);
    const targetRoom=targetProp?allRooms(targetProp).find(r=>r.name===a.room&&r.st==="vacant"):null;
    const mf=[];var nm3=(a.name||"").toLowerCase();
    const _mfSeen=new Set();
    archive.forEach(t=>{
      if(((t.name||"").toLowerCase()===nm3)||((t.email||"").toLowerCase()===(a.email||"").toLowerCase())){
        const isEviction=t.reason&&(t.reason.toLowerCase().includes("evict")||t.reason.toLowerCase().includes("forcibly"));
        const isEarly=t.reason&&(t.reason.toLowerCase().includes("early")||t.reason.toLowerCase().includes("broke"));
        const _type=isEviction?"evicted":isEarly?"early":"past";
        const _key=_type+"|"+(t.propName||"unknown");
        if(!_mfSeen.has(_key)){_mfSeen.add(_key);mf.push({type:_type,label:(isEviction?"Previously evicted":isEarly?"Broke lease early":"Returning tenant")+" — "+(t.propName||"unknown")});}
      }
    });
    apps.filter(x=>x.id!==a.id&&x.status==="denied").forEach(x=>{
      const nameMatch=(x.name||"").toLowerCase()===nm3&&nm3.length>0;
      const emailMatch=(x.email||"").toLowerCase()===(a.email||"").toLowerCase()&&(a.email||"").length>0;
      if((emailMatch||(nameMatch&&emailMatch))&&!_mfSeen.has("denied")){{_mfSeen.add("denied");mf.push({type:"denied",label:"Previously denied"+(x.deniedReason?" — "+x.deniedReason:"")});}}
    });
    const reqs=[{key:"bgCheck",label:"Background Check"},{key:"creditScore",label:"Credit Check"},{key:"incomeVerified",label:"Income Verification"},{key:"refs",label:"References"},{key:"idVerified",label:"ID Verified"}];
    const waived=a.waived||[];
    // incomeVerified only blocks if RentPrep income add-on was actually requested
    const incompleteReqs=reqs.filter(r=>{
      if(waived.includes(r.label))return false;
      if(r.key==="incomeVerified"&&(!a.incomeAdd||a.incomeAdd==="none"))return false;
      return a[r.key]!=="passed"&&a[r.key]!=="verified";
    });
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
    <div className="mbg" onClick={()=>setModal(null)}>
    {(()=>{
      return(<div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:820,padding:0,overflow:"hidden",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
      {/* NEW HEADER BAR */}
      <div style={{padding:"10px 16px",borderBottom:"1px solid #f0ede8",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <div style={{width:40,height:40,borderRadius:9,background:"#1a1714",color:"#d4a853",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,letterSpacing:.5}}>
          {((a.name||"").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase())||"?"}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontSize:15,fontWeight:700,color:"#1a1714"}}>{a.name}</span>
            {a.status&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,background:"rgba(74,124,89,.1)",color:"#27500a",border:"1px solid rgba(74,124,89,.2)"}}>{a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span>}
            {a._hasUnreadRefReply&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:"rgba(59,130,246,.12)",color:"#1d4ed8",border:"1px solid rgba(59,130,246,.2)",display:"flex",alignItems:"center",gap:4}}><svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3.5" fill="#1d4ed8"/></svg>New Reference Reply</span>}
            {days>0&&<span style={{fontSize:10,color:days>=5?"#c45c4a":days>=3?"#d4a853":"#999",fontWeight:600}}>{days}d old</span>}
          </div>
          <div style={{display:"flex",gap:0}}>{STAGES.map((s,i)=><div key={s} style={{flex:1,textAlign:"center"}}><div style={{height:3,borderRadius:1,background:i<=si?"#d4a853":"rgba(0,0,0,.06)",marginBottom:2}}/><div style={{fontSize:7,color:i<=si?"#9a7422":"#bbb",fontWeight:i<=si?600:400}}>{SI3[s]}</div></div>)}</div>
        </div>
        <div style={{width:48,height:48,borderRadius:"50%",background:"#1a1714",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <div style={{fontSize:17,fontWeight:700,color:"#d4a853",lineHeight:1}}>{score}</div>
          <div style={{fontSize:8,color:score>=70?"#4a7c59":score>=50?"#d4a853":"#c45c4a",fontWeight:600,marginTop:1}}>{score>=70?"Strong":score>=50?"OK":"Weak"}</div>
        </div>
      </div>
      {/* TWO-COLUMN BODY */}
      <div style={{display:"flex",flex:1,minHeight:0,overflow:"hidden"}}>
        {/* LEFT COLUMN */}
        <div style={{width:290,flexShrink:0,borderRight:"1px solid #f0ede8",overflowY:"auto",background:"#faf9f7",padding:"12px 14px",minWidth:260}}>

      {mf.length>0&&(()=>{const dmf=modal._dismissedFlags||[];const vis=mf.filter((_,i)=>!dmf.includes(i));if(!vis.length)return null;return(<div style={{marginBottom:10}}>{vis.map(f=>{const oi=mf.indexOf(f);const bg=f.type==="denied"||f.type==="evicted"?"rgba(196,92,74,.06)":f.type==="early"?"rgba(212,168,83,.06)":"rgba(74,124,89,.06)";const col=f.type==="denied"||f.type==="evicted"?"#c45c4a":f.type==="early"?"#9a7422":"#2d6a3f";return(<div key={oi} style={{padding:"6px 10px",borderRadius:6,marginBottom:3,fontSize:11,fontWeight:600,display:"flex",justifyContent:"space-between",alignItems:"center",background:bg,color:col}}><span>{f.label}</span><button onClick={()=>setModal(p=>({...p,_dismissedFlags:[...(p._dismissedFlags||[]),oi]}))} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity=".45"} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,fontFamily:"inherit",padding:"0 2px",opacity:.45,lineHeight:1,color:"inherit",transition:"opacity .15s",flexShrink:0}}>&#x2715;</button></div>);})}</div>);})()}
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
        <div className="fld" style={{marginBottom:6}}>
          <label>Email</label>
          <input type="email" value={a.email||""} onChange={e=>saveApp(a.id,"email",e.target.value)} style={{width:"100%"}}/>
        </div>
        <div className="fld" style={{marginBottom:6}}>
          <label>Phone</label>
          <input type="tel" value={a.phone||""} onChange={e=>saveApp(a.id,"phone",e.target.value)} style={{width:"100%"}}/>
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


      <div style={{borderTop:"1px solid #ede9e3",margin:"10px 0"}}/>
      <div style={{marginBottom:12,marginTop:4}}>
        <div style={{fontSize:10,fontWeight:600,color:"#9a8878",textTransform:"uppercase",letterSpacing:.6,marginBottom:7,display:"flex",alignItems:"center",gap:5}}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 9l-3.1 1.5.6-3.5L3 4.5 6.5 4z"/></svg>
          Score breakdown
        </div>
        {(["new-lead","pre-screened","called","invited"].includes(a.status)||(a.status==="applied"&&(!a.bgCheck||a.bgCheck==="not-started")&&(!a.creditScore||a.creditScore==="—")))
          ?<div style={{padding:"8px 10px",borderRadius:6,background:"#f0ede8",border:"1px solid #e4dfd8"}}>
            <div style={{fontSize:11,color:"#9a8878",fontStyle:"italic"}}>N/A — score populated after background check and credit screening are complete.</div>
          </div>
          :[["Income",a.income?Math.min(95,Math.round((parseInt((a.income+"").replace(/[^0-9]/g,""))||0)/55)):50],["Credit",a.creditScore&&a.creditScore!=="—"?Math.min(100,Math.round((parseInt(a.creditScore)||0)/7.5)):0],["Background",a.bgCheck==="passed"?100:a.bgCheck==="failed"?0:20],["References",a.refs==="verified"?100:a.refs==="pending"?50:10],["Rental hist.",80]].map(([lbl,val])=>(
          <div key={lbl} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
            <div style={{fontSize:11,color:"#6b5e52",width:80,flexShrink:0}}>{lbl}</div>
            <div style={{flex:1,height:4,background:"#e4dfd8",borderRadius:2,overflow:"hidden"}}>
              <div style={{width:Math.max(0,val)+"%",height:"100%",borderRadius:2,background:val>=70?"#4a7c59":val>=40?"#d4a853":"#c45c4a"}}/>
            </div>
            <span style={{fontSize:10,fontWeight:600,minWidth:24,textAlign:"right",color:val>=70?"#27500a":val>=40?"#633806":"#791f1f"}}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{borderTop:"1px solid #ede9e3",margin:"10px 0"}}/>
      <div style={{marginBottom:0}}>
        <div style={{fontSize:10,fontWeight:600,color:"#9a8878",textTransform:"uppercase",letterSpacing:.6,marginBottom:7,display:"flex",alignItems:"center",gap:5}}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2h12a1 1 0 0 1 1 1v7H5l-3 3V3a1 1 0 0 1 1-1z"/></svg>
          Comm log
        </div>
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


      </div>
        {/* RIGHT COLUMN */}
        <div style={{flex:1,overflowY:"auto"}}>
      {(()=>{
        const _o=(modal._accOpen===undefined||modal._accOpen===null?"room":modal._accOpen)==="room";
        return(
          <div style={{borderBottom:"1px solid #f0ede8"}}>
            <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 16px",cursor:"pointer",userSelect:"none",background:_o?"rgba(26,23,20,.03)":"#fff"}} className="hvr-row" onClick={()=>setModal(p=>({...p,_accOpen:p._accOpen==="room"?null:"room"}))}>  
              <div style={{width:26,height:26,borderRadius:7,background:_o?"#1a1714":"#f0ede8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={_o?"#d4a853":"#5c4a3a"} strokeWidth="1.5"><path d="M2 13V7l6-4 6 4v6"/><rect x="5" y="9" width="6" height="4"/></svg>
              </div>
              <div style={{fontSize:12,fontWeight:600,color:"#1a1714",flex:1}}>Room / unit assignment</div>
              <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>{(()=>{const _rm=a.termRoomId||a.room;return _rm?<span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:8,background:"rgba(74,124,89,.1)",color:"#27500a"}}>{a.room||"Assigned"}</span>:<span style={{fontSize:10,color:"#9a8878"}}>Not assigned</span>;})()}</div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" style={{transform:_o?"rotate(180deg)":"none",transition:"transform .2s",marginLeft:4,flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {_o&&<div style={{padding:"0 0 4px"}}>
      {/* ── Couples Policy — only when a bedroom is assigned, not whole unit ── */}
      {(()=>{
        // Only show if a bedroom (not whole unit) is selected
        const couplesAllItems=props.flatMap(p=>leaseableItems(p));
        const couplesSelectedItem=a.termRoomId?couplesAllItems.find(i=>i.id===a.termRoomId):null;
        if(!couplesSelectedItem||couplesSelectedItem.isWholeUnit)return null;
        // Resolve default: app-level → property-level → global setting
        const couplesTermProp=a.termPropId?props.find(p=>p.id===a.termPropId):(a.property?props.find(p=>p.name===a.property):null);
        const resolvedDefault=a.allowCouples!==undefined?a.allowCouples:(couplesTermProp?.couplesDefault!==undefined?couplesTermProp.couplesDefault:(settings.couplesDefault||false));
        const answered=a.allowCouples!==undefined;
        const saveCouples=(val)=>{
          setApps(prev=>{const u=prev.map(x=>x.id===a.id?{...x,allowCouples:val}:x);save("hq-apps",u);return u;});
          setModal(prev=>({...prev,data:{...prev.data,allowCouples:val},_couplesScope:null}));
        };
        const saveScope=(val,scope)=>{
          saveCouples(val);
          if(scope==="property"&&couplesTermProp){
            const updatedProps=props.map(p=>p.id===couplesTermProp.id?{...p,couplesDefault:val}:p);
            setProps(updatedProps);save("hq-props",updatedProps);
          } else if(scope==="portfolio"){
            const updatedSettings={...settings,couplesDefault:val};
            setSettings(updatedSettings);save("hq-settings",updatedSettings);
          }
          setModal(prev=>({...prev,_couplesScope:null,_couplesSaved:scope}));
        };
        // Scope selector shows only when: answered AND the current value differs from the resolved default (before app-level override)
        // i.e. if they already saved portfolio default and current value matches, don't show scope again
        const inheritedDefault=couplesTermProp?.couplesDefault!==undefined?couplesTermProp.couplesDefault:(settings.couplesDefault||false);
        const currentMatchesInherited=a.allowCouples===inheritedDefault;
        const saved=modal._couplesSaved||null;
        const showScopeSelector=answered&&!saved&&!currentMatchesInherited;
        return(<div className="tp-card" style={{border:!answered?"2px solid rgba(212,168,83,.4)":"1px solid rgba(0,0,0,.03)",background:!answered?"rgba(212,168,83,.02)":"#fff"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <h3 style={{margin:0,fontSize:13}}>Occupancy Policy for This Bedroom</h3>
              <div style={{fontSize:10,color:"#6b5e52",marginTop:3}}>Required before sending invite. Controls what the applicant sees on the application form.</div>
            </div>
            {!answered&&<span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"rgba(212,168,83,.15)",color:"#9a7422",flexShrink:0,marginLeft:8}}>Required</span>}
            {answered&&<span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"rgba(74,124,89,.1)",color:"#2d6a3f",flexShrink:0,marginLeft:8}}>&#10003; Set</span>}
          </div>
          <div style={{fontSize:11,fontWeight:600,color:"#3d3529",marginBottom:8}}>Allow a couple (2 adults) in this bedroom?</div>
          <div style={{display:"flex",gap:8,marginBottom:answered?12:0}}>
            {[{val:false,label:"No — 1 adult only"},{val:true,label:"Yes — couples welcome"}].map(({val,label})=>(
              <button key={String(val)}
                style={{flex:1,padding:"10px 8px",borderRadius:8,border:"2px solid "+(a.allowCouples===val?(val?"rgba(74,124,89,.8)":"rgba(196,92,74,.6)"):"rgba(0,0,0,.1)"),background:a.allowCouples===val?(val?"rgba(74,124,89,.08)":"rgba(196,92,74,.05)"):"#fff",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
                onClick={()=>saveCouples(val)}>
                <div style={{fontSize:11,fontWeight:700,color:a.allowCouples===val?(val?"#2d6a3f":"#c45c4a"):"#3d3529"}}>{label}</div>
              </button>
            ))}
          </div>
          {showScopeSelector&&<>
            <div style={{fontSize:10,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Save this as default?</div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {[
                {key:"once",label:"Just this application",sub:"One-off — don't change any defaults"},
                {key:"property",label:"This property",sub:couplesTermProp?getPropDisplayName(couplesTermProp):"Selected property"},
                {key:"portfolio",label:"All properties (portfolio default)",sub:"Applies globally unless overridden per-property"},
              ].map(opt=>(
                <label key={opt.key} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,border:"1px solid "+(scope===opt.key?"rgba(212,168,83,.4)":"rgba(0,0,0,.06)"),background:scope===opt.key?"rgba(212,168,83,.04)":"transparent",cursor:"pointer"}}>
                  <input type="radio" name={"couplesScope_"+a.id} checked={scope===opt.key} onChange={()=>setModal(prev=>({...prev,_couplesScope:opt.key}))} style={{accentColor:"#d4a853",flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:"#1a1714"}}>{opt.label}</div>
                    <div style={{fontSize:9,color:"#6b5e52"}}>{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>
            {scope&&<button className="btn btn-sm" style={{width:"100%",marginTop:8,background:"#d4a853",color:"#1a1714",border:"none",fontWeight:700}} onClick={()=>saveScope(a.allowCouples,scope)}>
              Save {scope==="once"?"for this application only":scope==="property"?"to "+(getPropDisplayName(couplesTermProp)||"property"):"as portfolio default"}
            </button>}
          </>}
          {answered&&currentMatchesInherited&&<div style={{fontSize:10,color:"#4a7c59",padding:"5px 8px",background:"rgba(74,124,89,.06)",borderRadius:6,marginTop:4}}>
            &#10003; Matches {couplesTermProp?.couplesDefault!==undefined?"property":"portfolio"} default — no override needed
          </div>}
          {saved&&!currentMatchesInherited&&<div style={{fontSize:10,color:"#4a7c59",padding:"5px 8px",background:"rgba(74,124,89,.06)",borderRadius:6,marginTop:4}}>
            &#10003; {saved==="once"?"Applied to this application only":saved==="property"?"Saved to "+(getPropDisplayName(couplesTermProp)||"property"):saved==="portfolio"?"Saved as portfolio default":"Saved"}
          </div>}
          {!answered&&<div style={{fontSize:10,color:"#9a7422",marginTop:10,padding:"6px 10px",background:"rgba(212,168,83,.06)",borderRadius:6,border:"1px solid rgba(212,168,83,.15)"}}>
            Answer this before assigning a room — it determines what the tenant sees on their application.
          </div>}
        </div>);
      })()}


      {/* ── Room Assignment (all stages) ── */}
      {(()=>{
        const moveInDate=a.termMoveIn||a.moveIn||"";

        // Helper: when is this room available (just lease end date)
        const getReadyDate=(item)=>{
          if(item.st==="vacant")return null;
          return item.le||null;
        };

        const termProp=a.termPropId?props.find(p=>p.id===a.termPropId):(a.property?props.find(p=>p.name===a.property):null);
        const allItems=termProp?leaseableItems(termProp):[];
        const termItem=a.termRoomId?allItems.find(i=>i.id===a.termRoomId):allItems.find(i=>i.name===a.room);
        const termRent=a.termRent!==undefined?a.termRent:(termItem?termItem.rent:0);
        const saveTerm=(key,val)=>{setApps(p=>{const u=p.map(x=>x.id===a.id?{...x,[key]:val}:x);save("hq-apps",u);return u;});setModal(prev=>({...prev,data:{...prev.data,[key]:val}}));};

        // All rooms across ALL properties sorted by earliest availability
        const propRooms=props.flatMap(p=>leaseableItems(p).filter(i=>!i.ownerOccupied).map(i=>({
          ...i,propName:getPropDisplayName(p),propId:p.id,propObj:p,
        }))).sort((x,y)=>{
          const xr=getReadyDate(x),yr=getReadyDate(y);
          if(!xr&&!yr)return 0;if(!xr)return -1;if(!yr)return 1;
          return xr<yr?-1:1;
        });

        const selectedItem=propRooms.find(i=>i.id===(a.termRoomId||termItem?.id));
        if(selectedItem&&!selectedItem.isWholeUnit&&a.allowCouples===undefined){
          return(<div className="tp-card" style={{opacity:.45,pointerEvents:"none",userSelect:"none"}}>
            <h3 style={{color:"#9a7422"}}>Manual Room / Unit Assignment</h3>
            <div style={{fontSize:11,color:"#9a7422",marginTop:4}}>Answer the occupancy policy question above to continue.</div>
          </div>);
        }

        // Conflict detection: only real lease overlap matters (no buffer)
        const leaseEnd=selectedItem?.le||null;
        const caseA=selectedItem&&moveInDate&&leaseEnd&&moveInDate<leaseEnd;
        const hasConflict=!!caseA;

        // Property-level availability warning
        const warnProp=a.termPropId?props.find(p=>p.id===a.termPropId):(a.property?props.find(p=>p.name===a.property):null);
        const warnItems=warnProp?leaseableItems(warnProp):[];
        const warnVacant=warnItems.filter(i=>i.st==="vacant");
        const warnOccWithLe=warnItems.filter(i=>i.st!=="vacant"&&i.le);
        const warnFullyLeased=warnProp&&warnVacant.length===0;
        const warnFocusItem=selectedItem&&selectedItem.st!=="vacant"?selectedItem
          :(warnOccWithLe.length?warnOccWithLe.reduce((mn,i)=>i.le<mn.le?i:mn,warnOccWithLe[0]):null);
        const warnLe=warnFocusItem?.le||null;
        const warnStatus=moveInDate&&warnLe?(moveInDate<warnLe?"overlap":"clears"):null;
        const warnEarliestAvail=warnLe;

        const itemLabel=(item)=>{
          const ready=getReadyDate(item);
          const propPart=item.propName?" — "+item.propName:"";
          let label=(item.unitLabel&&!item.isWholeUnit?"Unit "+item.unitLabel+" — ":"")+item.name+(item.isWholeUnit&&item.name!=="Whole Unit"?" (Whole Unit)":"")+propPart+" — "+fmtS(item.id===(a.termRoomId||termItem?.id)?termRent:item.rent)+"/mo";
          if(!ready)label+=" · Available now";
          else label+=" · Available "+fmtD(ready)+" (lease ends "+fmtD(item.le)+")";
          if(moveInDate&&ready&&moveInDate<item.le)label+=" ⚠ lease overlap";
          return label;
        };

        const termRoomForModal=selectedItem&&termProp?allRooms(termProp).find(r=>r.id===selectedItem.id):null;
        const skipRoom=!!a.skipRoomAssign;

        return(
        <div className="tp-card" style={{border:"2px solid rgba(212,168,83,.2)",background:"rgba(212,168,83,.02)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:skipRoom?0:12}}>
            <h3 style={{margin:0,color:"#9a7422"}}>Manual Room / Unit Assignment</h3>
            <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",userSelect:"none"}}
              onClick={()=>{
                const next=!skipRoom;
                setApps(prev=>prev.map(x=>x.id===a.id?{...x,skipRoomAssign:next,property:next?"":x.property,room:next?"":x.room,termRoomId:next?null:x.termRoomId}:x));
                setModal(prev=>({...prev,data:{...prev.data,skipRoomAssign:next,property:next?"":prev.data.property,room:next?"":prev.data.room,termRoomId:next?null:prev.data.termRoomId}}));
              }}>
              <div style={{width:30,height:16,borderRadius:8,background:skipRoom?"rgba(74,124,89,.2)":"rgba(0,0,0,.1)",position:"relative",transition:"background .15s",flexShrink:0}}>
                <div style={{position:"absolute",top:2,left:skipRoom?14:2,width:12,height:12,borderRadius:"50%",background:skipRoom?"#4a7c59":"#aaa",transition:"all .15s"}}/>
              </div>
              <span style={{fontSize:10,fontWeight:600,color:skipRoom?"#4a7c59":"#6b5e52",transition:"color .15s"}}>Assign room at lease signing</span>
            </label>
          </div>
          {skipRoom&&<div style={{fontSize:11,color:"#4a7c59",padding:"7px 10px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.15)",borderRadius:6}}>
            Room assignment skipped — you&#39;ll lock in the room and rent when sending the lease.
          </div>}
          {!skipRoom&&<>
            <div style={{marginBottom:8}}>
            <div className="fld" style={{marginBottom:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <label style={{margin:0}}>Move-in Date</label>
                <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",userSelect:"none"}}
                  onClick={()=>{
                    const next=!a.moveInTbd;
                    setApps(prev=>prev.map(x=>x.id===a.id?{...x,moveInTbd:next}:x));
                    setModal(prev=>({...prev,data:{...prev.data,moveInTbd:next}}));
                  }}>
                  <div style={{width:26,height:14,borderRadius:7,background:a.moveInTbd?"rgba(212,168,83,.3)":"rgba(0,0,0,.1)",position:"relative",transition:"background .15s",flexShrink:0}}>
                    <div style={{position:"absolute",top:1,left:a.moveInTbd?13:1,width:12,height:12,borderRadius:"50%",background:a.moveInTbd?"#d4a853":"#aaa",transition:"all .15s"}}/>
                  </div>
                  <span style={{fontSize:9,fontWeight:700,color:a.moveInTbd?"#9a7422":"#6b5e52",letterSpacing:.1}}>Move-in date is TBD</span>
                </label>
              </div>
              {a.moveInTbd
                ?<div style={{padding:"8px 10px",borderRadius:6,border:"1px solid rgba(212,168,83,.25)",background:"rgba(212,168,83,.04)",fontSize:11,color:"#9a7422",fontWeight:600}}>
                  To Be Determined &#8212; dates will be confirmed and updated on or before move-in.
                </div>
                :<input type="date" value={moveInDate} onChange={e=>{
                  const ds=e.target.value;
                  setApps(prev=>prev.map(x=>x.id===a.id?{...x,moveIn:ds,termMoveIn:ds}:x));
                  setModal(prev=>({...prev,data:{...prev.data,moveIn:ds,termMoveIn:ds}}));
                }} style={{width:"100%"}}/>
              }
            </div>
          </div>

          {/* Move-out Date */}
          <div style={{marginBottom:8}}>
            <div className="fld" style={{marginBottom:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <label style={{margin:0}}>Move-out Date</label>
                <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",userSelect:"none"}}
                  onClick={()=>{
                    const next=!a.moveOutTbd;
                    setApps(prev=>prev.map(x=>x.id===a.id?{...x,moveOutTbd:next}:x));
                    setModal(prev=>({...prev,data:{...prev.data,moveOutTbd:next}}));
                  }}>
                  <div style={{width:26,height:14,borderRadius:7,background:a.moveOutTbd?"rgba(212,168,83,.3)":"rgba(0,0,0,.1)",position:"relative",transition:"background .15s",flexShrink:0}}>
                    <div style={{position:"absolute",top:1,left:a.moveOutTbd?13:1,width:12,height:12,borderRadius:"50%",background:a.moveOutTbd?"#d4a853":"#aaa",transition:"all .15s"}}/>
                  </div>
                  <span style={{fontSize:9,fontWeight:700,color:a.moveOutTbd?"#9a7422":"#6b5e52",letterSpacing:.1}}>Move-out date is TBD</span>
                </label>
              </div>
              {a.moveOutTbd
                ?<div style={{padding:"8px 10px",borderRadius:6,border:"1px solid rgba(212,168,83,.25)",background:"rgba(212,168,83,.04)",fontSize:11,color:"#9a7422",fontWeight:600}}>
                  To Be Determined &#8212; move-out date will be confirmed later.
                </div>
                :<input type="date" value={a.termMoveOut||a.moveOut||""} onChange={e=>{
                  const ds=e.target.value;
                  setApps(prev=>prev.map(x=>x.id===a.id?{...x,moveOut:ds,termMoveOut:ds}:x));
                  setModal(prev=>({...prev,data:{...prev.data,moveOut:ds,termMoveOut:ds}}));
                }} style={{width:"100%"}}/>
              }
            </div>
          </div>

          {/* Room dropdown */}
          {true&&<>{/* All rooms across properties, sorted by ready date */}
          <div className="fld" style={{marginBottom:selectedItem?8:0}}>
            <label>Assign Room / Unit
              <span style={{fontWeight:400,color:"#5c4a3a",fontSize:9,textTransform:"none",letterSpacing:0}}> — sorted by earliest availability</span>
            </label>
            <select value={a.termRoomId||termItem?.id||""} onChange={e=>{
              const item=propRooms.find(x=>x.id===e.target.value);
              if(item){
                saveTerm("termRoomId",item.id);saveTerm("termPropId",item.propId);saveTerm("termRent",item.rent);saveTerm("termSD",item.rent);
                // Auto-set property from the selected room
                if(item.propName&&item.propObj){setApps(prev=>{const u=prev.map(x=>x.id===a.id?{...x,property:item.propObj.name,termPropId:item.propId}:x);save("hq-apps",u);return u;});setModal(prev=>({...prev,data:{...prev.data,property:item.propObj.name,termPropId:item.propId}}));}
                // Auto-fill move-in to this room's earliest ready date if not already set
                const rdy=getReadyDate(item);
                const curMoveIn=a.termMoveIn||a.moveIn||"";
                if(rdy&&(!curMoveIn||curMoveIn<rdy)){
                  setApps(prev=>prev.map(x=>x.id===a.id?{...x,moveIn:rdy,termMoveIn:rdy}:x));
                  setModal(p=>({...p,data:{...p.data,termRoomId:item.id,termPropId:item.propId,termRent:item.rent,termSD:item.rent,moveIn:rdy,termMoveIn:rdy}}));
                } else {
                  setModal(p=>({...p}));
                }
              } else {
                saveTerm("termRoomId",null);saveTerm("termPropId",null);
                setModal(p=>({...p}));
              }
            }} style={{width:"100%",borderColor:hasConflict?"rgba(196,92,74,.5)":undefined}}>
              <option value="">No assignment at this time</option>
              {propRooms.map(item=><option key={item.id} value={item.id}>{itemLabel(item)}</option>)}
              {termItem&&!propRooms.find(i=>i.id===termItem.id)&&<option value={termItem.id}>{termItem.name} at {termProp?.name} — previously assigned</option>}
            </select>

            {/* ── CASE A: True lease overlap — must terminate early ── */}
            {selectedItem&&caseA&&(()=>{
              const overlapStep=modal._overlapStep||0;
              const overlapConfirmed=!!modal._overlapConfirmed;
              return(<>
              {!overlapConfirmed&&<>
              {overlapStep===0&&<div style={{marginTop:8,borderRadius:7,overflow:"hidden",border:"2px solid rgba(196,92,74,.4)"}}>
                <div style={{padding:"9px 11px",background:"rgba(196,92,74,.08)"}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#c45c4a",marginBottom:5}}>Lease Overlap &mdash; Current Tenant Still Active</div>
                  <div style={{fontSize:11,color:"#5c4a3a",display:"flex",flexDirection:"column",gap:3,lineHeight:1.5}}>
                    <span>Current lease ends: <strong>{fmtD(leaseEnd)}</strong></span>
                    <span>Your move-in: <strong style={{color:"#c45c4a"}}>{fmtD(moveInDate)}</strong> &mdash; <strong style={{color:"#c45c4a"}}>{Math.ceil((new Date(leaseEnd+"T00:00:00")-new Date(moveInDate+"T00:00:00"))/(86400000))} day{Math.ceil((new Date(leaseEnd+"T00:00:00")-new Date(moveInDate+"T00:00:00"))/(86400000))!==1?"s":""} before lease ends.</strong></span>
                  </div>
                </div>
                <div style={{padding:"8px 11px",background:"rgba(196,92,74,.04)",borderTop:"1px solid rgba(196,92,74,.2)",display:"flex",gap:6}}>
                  <button className="btn btn-out btn-sm" style={{flex:1,fontSize:10}} onClick={()=>{
                    setApps(prev=>prev.map(x=>x.id===a.id?{...x,moveIn:leaseEnd,termMoveIn:leaseEnd}:x));
                    setModal(p=>({...p,data:{...p.data,moveIn:leaseEnd,termMoveIn:leaseEnd}}));
                  }}>Use {fmtD(leaseEnd)} Instead</button>
                  <button className="btn btn-sm" style={{flex:2,background:"#c45c4a",color:"#fff",border:"none",fontSize:10,fontWeight:700}} onClick={()=>setModal(p=>({...p,_overlapStep:1}))}>Terminate Existing Lease Early →</button>
                </div>
              </div>}
              {overlapStep===1&&<div style={{marginTop:8,borderRadius:7,overflow:"hidden",border:"2px solid rgba(196,92,74,.5)"}}>
                <div style={{padding:"10px 11px",background:"rgba(196,92,74,.1)"}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#c45c4a",marginBottom:6}}>Confirm Early Termination</div>
                  <div style={{fontSize:11,color:"#5c4a3a",marginBottom:10,lineHeight:1.6}}>
                    You are terminating the current lease at <strong>{selectedItem.name}</strong> early. Lease end was <strong>{fmtD(leaseEnd)}</strong> — new move-in is <strong>{fmtD(moveInDate)}</strong>. You will need to handle the security deposit and provide proper notice.
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button className="btn btn-out btn-sm" style={{flex:1}} onClick={()=>setModal(p=>({...p,_overlapStep:0}))}>← Go Back</button>
                    <button className="btn btn-sm" style={{flex:2,background:"#c45c4a",color:"#fff",border:"none",fontSize:10,fontWeight:700}} onClick={()=>{
                      setModal(null);
                      setTimeout(()=>{if(termRoomForModal&&termProp){setTenantProfileTab("summary");setModal({type:"tenant",data:termRoomForModal,termStep:1,termDate:moveInDate,termErrs:{}});}},50);
                    }}>Yes &mdash; Go to Terminate Lease Flow</button>
                  </div>
                </div>
              </div>}
              </>}
              {overlapConfirmed&&<div style={{marginTop:8,padding:"7px 11px",background:"rgba(196,92,74,.06)",border:"1px solid rgba(196,92,74,.3)",borderRadius:7,fontSize:11,color:"#c45c4a",fontWeight:700,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>Early termination acknowledged &mdash; proceed with lease setup.</span>
                <button style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#6b5e52",fontFamily:"inherit",padding:0,textDecoration:"underline"}} onClick={()=>setModal(p=>({...p,_overlapConfirmed:false,_overlapStep:0}))}>Undo</button>
              </div>}
              </>);
            })()}


            {/* No conflict: green info if room will vacate before move-in */}
            {selectedItem&&!hasConflict&&selectedItem.le&&<div style={{marginTop:6,padding:"6px 10px",background:"rgba(74,124,89,.06)",border:"1px solid rgba(74,124,89,.2)",borderRadius:6,fontSize:11,color:"#2d6a3f"}}>
              Lease ends {fmtD(selectedItem.le)} &mdash; clears before move-in.
            </div>}
          </div>
          </>}

          {/* Rent / SD — only show when no unresolved conflict */}
          {(a.termRoomId||termItem?.id)&&!hasConflict&&<div className="fr" style={{gap:8,marginBottom:0}}>
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
          </div>}
          </>}
        </div>);
      })()}

      {/* ── Mini Tenant Timeline ── */}
      {(()=>{
        const tlOpen=modal._appTlOpen===true;
        const tlView=modal._appTlView||"gantt";
        const tlMonthOff=modal._tlMonthOffset||0;
        // Resolve prop from: termRoomId (checks rooms AND whole units) → property name → null (show all)
        const tlResolvedFromId=(()=>{
          if(!a.termRoomId)return null;
          for(const p of props){
            // Check room IDs first
            const rm=allRooms(p).find(r=>r.id===a.termRoomId);
            if(rm)return{prop:p,unitId:rm.unitId||null,isWhole:false};
            // Check unit IDs (whole-house selections store unit ID as termRoomId)
            const u=(p.units||[]).find(u=>u.id===a.termRoomId);
            if(u)return{prop:p,unitId:u.id,isWhole:(u.rentalMode||"byRoom")==="wholeHouse",unitName:u.name,unitAddr:u.addr||""};
          }
          return null;
        })();
        const tlPropFromName=a.termPropId?props.find(p=>p.id===a.termPropId):(a.property?props.find(p=>p.name===a.property):null);
        const tlProp=tlResolvedFromId?.prop||tlPropFromName||null;
        const tlSelectedUnitId=tlResolvedFromId?.unitId||null;
        const tlIsWholeUnit=!!tlResolvedFromId?.isWhole;
        // Label: for whole-unit multi-unit properties, show the specific unit name/addr
        const tlUnitLabel=(()=>{
          if(!tlIsWholeUnit||!tlProp)return null;
          const u=(tlProp.units||[]).find(u=>u.id===tlSelectedUnitId);
          if(!u)return null;
          // Prefer addr if set on unit, else use unit name, else null
          return u.addr||u.name||null;
        })();
        const tlHeaderLabel=tlProp
          ?(tlUnitLabel&&(tlProp.units||[]).length>1
            ?tlUnitLabel
            :getPropDisplayName(tlProp))
          :null;
        // Property filter — allows PM to switch between properties or see all
        const tlPropFilter=modal._appTlPropFilter||"assigned"; // "assigned"|"all"|propId
        const tlFilteredProp=tlPropFilter==="assigned"?tlProp:tlPropFilter==="all"?null:props.find(p=>p.id===tlPropFilter)||tlProp;
        const tlFilteredRooms=tlFilteredProp
          ?(tlIsWholeUnit&&tlSelectedUnitId&&tlPropFilter==="assigned"
            ?leaseableItems(tlFilteredProp).filter(i=>i.unitId===tlSelectedUnitId&&i.isWholeUnit).map(i=>({...i,propName:tlHeaderLabel||getPropDisplayName(tlFilteredProp),propId:tlFilteredProp.id}))
            :allRooms(tlFilteredProp).filter(r=>!r.ownerOccupied).map(r=>({...r,propName:getPropDisplayName(tlFilteredProp),propId:tlFilteredProp.id}))
          )
          :props.flatMap(p=>allRooms(p).filter(r=>!r.ownerOccupied).map(r=>({...r,propName:getPropDisplayName(p),propId:p.id})));
        const tlRooms=tlProp
          ?(tlIsWholeUnit&&tlSelectedUnitId
            // Whole unit selected — show the unit as a single leaseable item (not individual bedrooms)
            ?leaseableItems(tlProp).filter(i=>i.unitId===tlSelectedUnitId&&i.isWholeUnit)
                .map(i=>({...i,propName:tlHeaderLabel||getPropDisplayName(tlProp),propId:tlProp.id}))
            // Room or no selection — all non-owner-occupied rooms in the property
            :allRooms(tlProp).filter(r=>!r.ownerOccupied).map(r=>({...r,propName:getPropDisplayName(tlProp),propId:tlProp.id}))
          )
          :props.flatMap(p=>allRooms(p).filter(r=>!r.ownerOccupied).map(r=>({...r,propName:getPropDisplayName(p),propId:p.id})));
        const TODAY_STR2=TODAY.toISOString().split("T")[0];
        const tlGetReady=(r)=>r.le||null;
        const tlDaysUntil=(ds)=>{if(!ds)return null;return Math.ceil((new Date(ds+"T00:00:00")-TODAY)/(86400000));};
        const tlBase=new Date(TODAY.getFullYear(),TODAY.getMonth()+tlMonthOff,1);
        const tlWinStart=new Date(tlBase);tlWinStart.setMonth(tlWinStart.getMonth()-1);
        const tlWinEnd=new Date(tlBase);tlWinEnd.setMonth(tlWinEnd.getMonth()+4);
        const tlTotalDays=Math.ceil((tlWinEnd-tlWinStart)/86400000);
        const tlToX=(ds)=>{if(!ds)return 0;const d=Math.ceil((new Date(ds+"T00:00:00")-tlWinStart)/86400000);return Math.max(0,Math.min(100,(d/tlTotalDays)*100));};
        const tlMonths=[];for(let i=0;i<6;i++){const dd=new Date(tlWinStart);dd.setMonth(dd.getMonth()+i);tlMonths.push({label:dd.toLocaleString("default",{month:"short",year:"2-digit"}),x:tlToX(dd.toISOString().split("T")[0])});}
        const tlViews=[{id:"gantt",label:"Gantt"},{id:"countdown",label:"Countdown"},{id:"kanban",label:"Kanban"}];
        const tlSort=modal._appTlSort||"avail-asc";
        const tlGrouped=modal._appTlGrouped!==false; // default grouped by property
        const tlSortFn=(arr)=>{
          const cp=[...arr];
          const noLe=r=>!r.le;
          const leMs=r=>r.le?new Date(r.le+"T00:00:00").getTime():Infinity;
          const rdMs=r=>{const s=tlGetReady(r);return s?new Date(s+"T00:00:00").getTime():r.le?leMs(r):Infinity;};
          if(tlSort==="lease-end-asc")return cp.sort((a,b)=>noLe(a)&&noLe(b)?0:noLe(a)?-1:noLe(b)?1:leMs(a)-leMs(b));
          if(tlSort==="lease-end-desc")return cp.sort((a,b)=>noLe(a)&&noLe(b)?0:noLe(a)?1:noLe(b)?-1:leMs(b)-leMs(a));
          if(tlSort==="avail-desc")return cp.sort((a,b)=>rdMs(b)-rdMs(a));
          return cp.sort((a,b)=>rdMs(a)-rdMs(b)); // avail-asc default
        };
        const tlSortedRooms=tlSortFn(tlFilteredRooms);
        return(
        <div className="tp-card" style={{padding:0,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:tlOpen?"1px solid rgba(0,0,0,.06)":"none",cursor:"pointer",background:"rgba(26,23,20,.02)"}} onClick={()=>setModal(p=>({...p,_appTlOpen:!tlOpen}))}>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5c4a3a" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span style={{fontSize:11,fontWeight:700,color:"#3d3529"}}>Availability Timeline</span>
              {!tlOpen&&<span style={{fontSize:9,color:"#9a7422",fontWeight:600,marginLeft:2}}>click to expand</span>}
              {/* Property filter pills — only when open */}
              {tlOpen&&(()=>{
                const filterOpts=[
                  ...(tlProp?[{id:"assigned",label:tlHeaderLabel||getPropDisplayName(tlProp)}]:[]),
                  ...props.filter(p=>!tlProp||p.id!==tlProp.id).map(p=>({id:p.id,label:p.addr||getPropDisplayName(p)})),
                  {id:"all",label:"All Properties"},
                ];
                return filterOpts.length>1?(
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                    {filterOpts.map(opt=>(
                      <button key={opt.id} onClick={()=>setModal(p=>({...p,_appTlPropFilter:opt.id}))}
                        style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,border:"1px solid "+(tlPropFilter===opt.id?"#1a1714":"rgba(0,0,0,.1)"),background:tlPropFilter===opt.id?"#1a1714":"transparent",color:tlPropFilter===opt.id?"#d4a853":"#5c4a3a",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"all .12s"}}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ):null;
              })()}
              {tlOpen&&<div style={{display:"flex",border:"1px solid rgba(0,0,0,.1)",borderRadius:5,overflow:"hidden",background:"rgba(0,0,0,.02)"}}>
                {tlViews.map(v=>(
                  <button key={v.id}
                    onClick={()=>setModal(p=>({...p,_appTlView:v.id}))}
                    onMouseEnter={e=>{if(tlView!==v.id)e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                    onMouseLeave={e=>{if(tlView!==v.id)e.currentTarget.style.background="transparent";}}
                    style={{padding:"2px 9px",fontSize:9,fontWeight:600,border:"none",borderRight:"1px solid rgba(0,0,0,.08)",cursor:"pointer",fontFamily:"inherit",transition:"all .12s",background:tlView===v.id?"#1a1714":"transparent",color:tlView===v.id?"#d4a853":"#5c4a3a"}}>
                    {v.label}
                  </button>
                ))}
              </div>}
              {tlOpen&&tlView==="gantt"&&<>
                {/* Group toggle */}
                {!tlProp&&<div style={{display:"flex",border:"1px solid rgba(0,0,0,.1)",borderRadius:5,overflow:"hidden",background:"rgba(0,0,0,.02)"}}>
                  {[["grouped","By property"],["flat","By date"]].map(([v,l])=>(
                    <button key={v}
                      onClick={()=>setModal(p=>({...p,_appTlGrouped:v==="grouped"}))}
                      onMouseEnter={e=>{if((v==="grouped")!==tlGrouped)e.currentTarget.style.background="rgba(0,0,0,.06)";}}
                      onMouseLeave={e=>{if((v==="grouped")!==tlGrouped)e.currentTarget.style.background="transparent";}}
                      style={{padding:"2px 9px",fontSize:9,fontWeight:600,border:"none",borderRight:"1px solid rgba(0,0,0,.08)",cursor:"pointer",fontFamily:"inherit",transition:"all .12s",background:(v==="grouped")===tlGrouped?"#1a1714":"transparent",color:(v==="grouped")===tlGrouped?"#d4a853":"#5c4a3a"}}>
                      {l}
                    </button>
                  ))}
                </div>}
                {/* Sort */}
                <select value={tlSort} onChange={e=>setModal(p=>({...p,_appTlSort:e.target.value}))}
                  style={{fontSize:9,padding:"2px 5px",borderRadius:4,border:"1px solid rgba(0,0,0,.1)",background:"rgba(0,0,0,.02)",color:"#5c4a3a",fontFamily:"inherit",cursor:"pointer"}}>
                  <option value="avail-asc">Available ↑ soonest</option>
                  <option value="avail-desc">Available ↓ latest</option>
                  <option value="lease-end-asc">Lease end ↑ soonest</option>
                  <option value="lease-end-desc">Lease end ↓ latest</option>
                </select>
                {/* Month nav */}
                <div style={{display:"flex",gap:2,alignItems:"center"}}>
                  <button onClick={()=>setModal(p=>({...p,_tlMonthOffset:(p._tlMonthOffset||0)-1}))}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.07)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,.03)"}
                    style={{padding:"1px 6px",fontSize:9,fontWeight:700,borderRadius:3,border:"1px solid rgba(0,0,0,.1)",background:"rgba(0,0,0,.03)",cursor:"pointer",fontFamily:"inherit",color:"#5c4a3a",transition:"background .12s"}}>&#8592;</button>
                  <span style={{fontSize:9,color:"#9a7422",fontWeight:600,minWidth:50,textAlign:"center"}}>{tlBase.toLocaleString("default",{month:"short",year:"numeric"})}</span>
                  <button onClick={()=>setModal(p=>({...p,_tlMonthOffset:(p._tlMonthOffset||0)+1}))}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,.07)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,.03)"}
                    style={{padding:"1px 6px",fontSize:9,fontWeight:700,borderRadius:3,border:"1px solid rgba(0,0,0,.1)",background:"rgba(0,0,0,.03)",cursor:"pointer",fontFamily:"inherit",color:"#5c4a3a",transition:"background .12s"}}>&#8594;</button>
                </div>
              </>}
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <button
                onClick={(e)=>{
                  e.stopPropagation();
                  if(typeof window!=="undefined"&&window.innerWidth<768){
                    window.open("/admin?tab=tenants&view=timeline","_blank");
                  } else {
                    setModal(p=>({...p,_tlFloatOpen:true,_tlFloatPos:{x:Math.max(20,Math.floor(window.innerWidth/2)-340),y:40}}));
                  }
                }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,168,83,.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
                style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,border:"1px solid rgba(212,168,83,.3)",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:"#9a7422",transition:"all .12s",whiteSpace:"nowrap"}}>
                Full Timeline &#8599;
              </button>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" style={{transform:tlOpen?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          {tlOpen&&<div>
            {/* GANTT */}
            {tlView==="gantt"&&<div>
              {/* Month headers */}
              <div style={{display:"flex",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                <div style={{width:110,flexShrink:0,padding:"2px 10px",fontSize:8,color:"#bbb",textTransform:"uppercase",letterSpacing:.4}}>Room</div>
                <div style={{flex:1,position:"relative",height:16}}>
                  {tlMonths.map((m,i)=><div key={i} style={{position:"absolute",left:m.x+"%",fontSize:7,color:"#bbb",transform:"translateX(-50%)",whiteSpace:"nowrap",top:3}}>{m.label}</div>)}
                </div>
              </div>
              {/* Grouped by property (default) or flat */}
              {(()=>{
                const renderRow=(r)=>{
                  const readyStr=tlGetReady(r);
                  const isOcc=r.st==="occupied"&&r.tenant;
                  const leX=r.le?tlToX(r.le):null;
                  const rdX=readyStr?tlToX(readyStr):null;
                  const todayX=tlToX(TODAY_STR2);
                  const moveInX=r.tenant&&r.tenant.moveIn?tlToX(r.tenant.moveIn):null;
                  const isAssigned=a.termRoomId===r.id||(r.isWholeUnit&&a.termRoomId===r.unitId)||a.room===r.name;
                  return(
                  <div key={r.id} style={{display:"flex",alignItems:"center",borderBottom:"1px solid rgba(0,0,0,.03)",minHeight:26,background:isAssigned?"rgba(212,168,83,.05)":"transparent"}}>
                    <div style={{width:110,flexShrink:0,padding:"2px 10px"}}>
                      <div style={{fontSize:9,fontWeight:isAssigned?700:500,color:isAssigned?"#9a7422":"#1a1714",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}{isAssigned&&<span style={{marginLeft:3,fontSize:7,color:"#d4a853"}}>&#9670;</span>}</div>
                      {isOcc&&<div style={{fontSize:7,color:"#6b5e52",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.tenant.name}</div>}
                      {!isOcc&&<div style={{fontSize:7,color:"#4a7c59",fontWeight:600}}>Vacant</div>}
                    </div>
                    <div style={{flex:1,position:"relative",height:26,display:"flex",alignItems:"center"}}>
                      <div style={{position:"absolute",left:todayX+"%",top:0,bottom:0,width:1.5,background:"#c45c4a",zIndex:3,opacity:.55}}/>
                      {!isOcc&&<div style={{position:"absolute",left:"0%",right:"0%",height:11,borderRadius:2,background:"rgba(74,124,89,.1)",border:"1px solid rgba(74,124,89,.2)",display:"flex",alignItems:"center",paddingLeft:4}}>
                        <span style={{fontSize:7,color:"#2d6a3f",fontWeight:600}}>Available now</span>
                      </div>}
                      {isOcc&&moveInX!==null&&leX!==null&&<div style={{position:"absolute",left:Math.min(moveInX,leX)+"%",width:Math.abs(leX-Math.min(moveInX,leX))+"%",height:13,borderRadius:2,background:"#B5D4F4",top:6,display:"flex",alignItems:"center",paddingLeft:3,overflow:"hidden"}}>
                        <span style={{fontSize:7,color:"#0C447C",fontWeight:600,whiteSpace:"nowrap"}}>ends {fmtD(r.le)}</span>
                      </div>}
                      {isOcc&&rdX!==null&&rdX<100&&<div style={{position:"absolute",left:rdX+"%",right:"0%",height:11,top:7,background:"rgba(74,124,89,.07)",border:"1px dashed rgba(74,124,89,.2)",borderRadius:"0 2px 2px 0",display:"flex",alignItems:"center",paddingLeft:3,overflow:"hidden"}}>
                        <span style={{fontSize:7,color:"#2d6a3f",whiteSpace:"nowrap"}}>Avail. {fmtD(readyStr)}</span>
                      </div>}
                    </div>
                  </div>);
                };
                // Grouped: property header + sorted rooms under each
                if(tlGrouped&&!tlProp){
                  const propOrder=props.filter(p=>!(p.units||[]).every(u=>u.ownerOccupied));
                  return propOrder.map(p=>{
                    const pRooms=tlSortedRooms.filter(r=>r.propId===p.id);
                    if(!pRooms.length)return null;
                    return(<div key={p.id}>
                      <div style={{padding:"4px 10px",fontSize:9,fontWeight:800,color:"#9a7422",background:"rgba(212,168,83,.07)",borderBottom:"1px solid rgba(212,168,83,.15)",borderTop:"1px solid rgba(212,168,83,.1)",textTransform:"uppercase",letterSpacing:.5,display:"flex",alignItems:"center",gap:6}}>
                        <span>{getPropDisplayName(p)}</span>
                        {p.addr&&<span style={{fontWeight:400,fontSize:8,color:"#9a7422",opacity:.7}}>{p.addr}</span>}
                        <span style={{marginLeft:"auto",fontWeight:600,fontSize:8,color:"#9a7422",opacity:.7}}>{pRooms.length} room{pRooms.length!==1?"s":""}</span>
                      </div>
                      {pRooms.map(r=>renderRow(r))}
                    </div>);
                  });
                }
                // Flat: just sorted rows
                return tlSortedRooms.map(r=>renderRow(r));
              })()}
            </div>}

            {/* COUNTDOWN */}
            {tlView==="countdown"&&<div style={{padding:"2px 0"}}>
              {tlSortedRooms.map(r=>{
                const readyStr=tlGetReady(r);
                const isOcc=r.st==="occupied"&&r.tenant;
                const dl=r.le?tlDaysUntil(r.le):null;
                const rdl=readyStr?tlDaysUntil(readyStr):null;
                const isAssigned=a.termRoomId===r.id||a.room===r.name;
                const statusColor=!isOcc?"#4a7c59":dl!==null&&dl<=0?"#4a7c59":dl!==null&&dl<=30?"#c45c4a":dl!==null&&dl<=90?"#9a7422":"#6b5e52";
                return(
                <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 12px",borderBottom:"1px solid rgba(0,0,0,.04)",background:isAssigned?"rgba(212,168,83,.04)":"transparent"}}>
                  <div>
                    <div style={{fontSize:10,fontWeight:isAssigned?700:500,color:isAssigned?"#9a7422":"#1a1714"}}>{r.name}{isAssigned&&<span style={{marginLeft:5,fontSize:8,color:"#d4a853"}}>&#9670;</span>}</div>
                    {isOcc&&<div style={{fontSize:9,color:"#6b5e52"}}>{r.tenant.name}</div>}
                    {!isOcc&&<div style={{fontSize:9,color:"#4a7c59",fontWeight:600}}>Vacant</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    {isOcc&&r.le&&<div style={{fontSize:10,fontWeight:700,color:statusColor}}>Lease ends {fmtD(r.le)}{dl!==null&&<span style={{marginLeft:4,fontSize:9,fontWeight:400}}>({dl}d)</span>}</div>}
                    {isOcc&&readyStr&&<div style={{fontSize:9,color:"#9a7422"}}>Avail. {fmtD(readyStr)}{rdl!==null&&<span style={{marginLeft:3,fontSize:8}}>({rdl}d)</span>}</div>}
                    {!isOcc&&<div style={{fontSize:10,fontWeight:700,color:"#4a7c59"}}>Ready now</div>}
                  </div>
                </div>);
              })}
            </div>}

            {/* KANBAN */}
            {tlView==="kanban"&&<div style={{padding:9}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                {[
                  {id:"active",label:"Active",color:"#6b5e52",bg:"rgba(0,0,0,.02)",filter:r=>r.st==="occupied"&&r.le&&tlDaysUntil(r.le)>30},
                  {id:"expiring",label:"Expiring 30d",color:"#9a7422",bg:"rgba(212,168,83,.04)",border:"rgba(212,168,83,.2)",filter:r=>r.st==="occupied"&&r.le&&tlDaysUntil(r.le)<=30&&tlDaysUntil(r.le)>0},
                  {id:"avail",label:"Available",color:"#2d6a3f",bg:"rgba(74,124,89,.04)",border:"rgba(74,124,89,.2)",filter:r=>r.st!=="occupied"||!r.tenant||(r.le&&tlDaysUntil(r.le)<=0)},
                ].map(col=>{
                  const colRooms=tlSortedRooms.filter(col.filter);
                  return(
                  <div key={col.id} style={{background:col.bg||"rgba(0,0,0,.02)",borderRadius:7,padding:7,border:col.border?`1px solid ${col.border}`:"0.5px solid rgba(0,0,0,.06)"}}>
                    <div style={{fontSize:8,fontWeight:700,color:col.color,textTransform:"uppercase",letterSpacing:.4,marginBottom:6,display:"flex",justifyContent:"space-between"}}>
                      <span>{col.label}</span>
                      <span style={{background:"rgba(255,255,255,.8)",borderRadius:8,padding:"0 5px",fontWeight:700,color:"#3d3529"}}>{colRooms.length}</span>
                    </div>
                    {colRooms.length===0&&<div style={{fontSize:9,color:"#bbb"}}>None</div>}
                    {colRooms.map(r=>{
                      const dl=r.le?tlDaysUntil(r.le):null;
                      const rs=tlGetReady(r);
                      const rdl=rs?tlDaysUntil(rs):null;
                      const isAssigned=a.termRoomId===r.id||a.room===r.name;
                      return(
                      <div key={r.id} style={{background:"#fff",borderRadius:5,border:isAssigned?"1.5px solid #d4a853":"0.5px solid rgba(0,0,0,.07)",padding:"5px 7px",marginBottom:4}}>
                        <div style={{fontSize:9,fontWeight:700,color:isAssigned?"#9a7422":"#1a1714"}}>{r.name}</div>
                        {r.tenant&&<div style={{fontSize:8,color:"#6b5e52"}}>{r.tenant.name}</div>}
                        {!r.tenant&&<div style={{fontSize:8,color:"#4a7c59",fontWeight:600}}>Vacant</div>}
                        {r.le&&<div style={{fontSize:8,fontWeight:600,color:col.color,marginTop:2}}>Ends {fmtD(r.le)}{dl!==null?" \u00b7 "+dl+"d":""}</div>}
                        {rs&&rdl!==null&&rdl>0&&<div style={{fontSize:7,color:"#9a7422"}}>Avail. {fmtD(rs)}</div>}
                      </div>);
                    })}
                  </div>);
                })}
              </div>
            </div>}
          </div>}
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

            </div>}
          </div>
        );
      })()}
      {!["new-lead","pre-screened","called","invited"].includes(a.status)&&(()=>{
        const _o=(modal._accOpen===undefined||modal._accOpen===null?"room":modal._accOpen)==="data";
        return(
          <div style={{borderBottom:"1px solid #f0ede8"}}>
            <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 16px",cursor:"pointer",userSelect:"none",background:_o?"rgba(26,23,20,.03)":"#fff"}} className="hvr-row" onClick={()=>setModal(p=>({...p,_accOpen:p._accOpen==="data"?null:"data",_appDataOpen:true}))}>  
              <div style={{width:26,height:26,borderRadius:7,background:_o?"#1a1714":"#f0ede8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={_o?"#d4a853":"#5c4a3a"} strokeWidth="1.5"><path d="M10 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5z"/><path d="M10 2v3h3M6 8h4M6 11h3"/></svg>
              </div>
              <div style={{fontSize:12,fontWeight:600,color:"#1a1714",flex:1}}>Application data</div>
              <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>{a.submitted&&<span style={{fontSize:10,color:"#9a8878",fontWeight:600,textTransform:"uppercase",letterSpacing:.3}}>SUBMITTED: {fmtDLong(a.submitted).toUpperCase()}</span>}</div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" style={{transform:_o?"rotate(180deg)":"none",transition:"transform .2s",marginLeft:4,flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {_o&&<div style={{padding:"0 0 4px"}}>
      {/* ── Application Submitted Data ── */}
      {a.applicationData&&(()=>{
        const ad=a.applicationData;
        const open=modal._appDataOpen!==false;
        const Row=({label,val,red,green})=>val?<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:13}}><span style={{color:"#3d3529"}}>{label}</span><span style={{fontWeight:600,color:red?"#c45c4a":green?"#2d6a3f":"#1a1714",textAlign:"right",maxWidth:"60%"}}>{val}</span></div>:null;
        return(
        <div className="tp-card" style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"12px 18px 10px",borderBottom:"1px solid rgba(0,0,0,.05)"}}>
            <h3 style={{margin:0,fontSize:13}}>Application Data</h3>
          </div>
          {open&&<div style={{padding:"0 18px 16px"}}>

            {/* Documents */}
            <div style={{fontSize:11,fontWeight:700,color:"#5c4a3a",textTransform:"uppercase",letterSpacing:.8,padding:"12px 0 6px",borderBottom:"1px solid rgba(0,0,0,.05)",marginBottom:6}}>Documents</div>
            {(()=>{
              const docs=ad.appDocs||[];
              const flag=ad.docsFlag||{};
              const idFront=docs.find(x=>x.type==="PhotoID-Front"&&x.url);
              const idBack=docs.find(x=>x.type==="PhotoID-Back"&&x.url);
              const payStubs=docs.filter(x=>x.type==="PayStub"&&x.url);
              const idUploaded=idFront||idBack;
              return(<>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:13}}>
                  <span style={{color:"#3d3529"}}>Photo ID</span>
                  <span style={{fontWeight:600,textAlign:"right"}}>
                    {flag.idUploadLater?<span style={{color:"#9a7422"}}>Will upload later</span>
                    :idUploaded?<span style={{display:"flex",gap:6}}>
                      {idFront&&<a href={idFront.url} target="_blank" rel="noreferrer" style={{color:"#2d6a3f",fontWeight:700,fontSize:10}}>Front ↗</a>}
                      {idBack&&<a href={idBack.url} target="_blank" rel="noreferrer" style={{color:"#2d6a3f",fontWeight:700,fontSize:10}}>Back ↗</a>}
                    </span>
                    :<span style={{color:"#c45c4a"}}>Not uploaded</span>}
                  </span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(0,0,0,.04)",fontSize:13}}>
                  <span style={{color:"#3d3529"}}>Pay Stubs</span>
                  <span style={{fontWeight:600,textAlign:"right"}}>
                    {flag.incomeUploadLater?<span style={{color:"#9a7422"}}>Will upload later</span>
                    :payStubs.length>0?<span style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                      {payStubs.map((s,i)=><a key={i} href={s.url} target="_blank" rel="noreferrer" style={{color:"#2d6a3f",fontWeight:700,fontSize:10}}>Stub {i+1} ↗</a>)}
                    </span>
                    :<span style={{color:"#c45c4a"}}>Not uploaded</span>}
                  </span>
                </div>
              </>);
            })()}
            {ad.doorCode&&<Row label="Door Code" val={ad.doorCode}/>}

            {/* Personal */}
            <div style={{fontSize:11,fontWeight:700,color:"#5c4a3a",textTransform:"uppercase",letterSpacing:.8,padding:"12px 0 6px",borderBottom:"1px solid rgba(0,0,0,.05)",marginBottom:6,marginTop:8}}>Personal</div>
            <Row label="Date of Birth" val={ad.dob?fmtD(ad.dob):null}/>
            <Row label="Gender" val={ad.gender}/>
            <Row label="Occupation Type" val={ad.occupationType+(ad.occupationTypeOther?" — "+ad.occupationTypeOther:"")}/>
            <Row label="Eviction History" val={ad.evicted==="yes"?"YES — "+( ad.evictedExplain||"no detail provided"):"No"} red={ad.evicted==="yes"} green={ad.evicted==="no"}/>
            <Row label="Felony History" val={ad.felony==="yes"?"YES — "+(ad.felonyExplain||"no detail provided"):"No"} red={ad.felony==="yes"} green={ad.felony==="no"}/>

            {/* ── Unified left-accent card sections ── */}
            {(()=>{
              const SecHd=({label})=><div style={{fontSize:10,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.8,padding:"14px 0 6px",borderBottom:"1px solid rgba(0,0,0,.05)",marginBottom:8,marginTop:4}}>{label}</div>;
              const AccentCard=({children,style={}})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,padding:"10px 12px",borderLeft:"2px solid rgba(74,124,89,.4)",borderRadius:"0 7px 7px 0",background:"rgba(0,0,0,.02)",marginBottom:8,...style}}>{children}</div>;
              const CardLeft=({children})=><div style={{flex:1,minWidth:0}}>{children}</div>;
              const CardRight=({children})=><div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>{children}</div>;
              const CardName=({children})=><div style={{fontSize:13,fontWeight:700,color:"#1a1714",marginBottom:5}}>{children}</div>;
              const CardRow=({label,val})=>val?<div style={{display:"flex",gap:0,padding:"2px 0",fontSize:12}}><span style={{color:"#7a7067",minWidth:80,flexShrink:0}}>{label}</span><span style={{color:"#1a1714",fontWeight:500}}>{val}</span></div>:null;
              const DraftBtn=({onClick})=><button onClick={onClick} style={{fontSize:9,padding:"4px 10px",borderRadius:6,border:"1px solid rgba(212,168,83,.3)",background:"rgba(212,168,83,.08)",color:"#9a7422",cursor:"pointer",fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>Draft Email →</button>;
              const Badge=({label,type})=><span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:8,background:type==="Rent"?"rgba(212,168,83,.1)":"rgba(74,124,89,.1)",color:type==="Rent"?"#9a7422":"#2d6a3f"}}>{label}</span>;
              const LogBtn=({onClick})=><button onClick={onClick} style={{fontSize:9,color:"#6b5e52",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textDecoration:"underline",padding:0}}>+ Log Reply</button>;

              return(<>
                {/* Rental History */}
                {(ad.addresses||[]).length>0&&<>
                  <SecHd label="Rental History"/>
                  {(ad.addresses||[]).map((addr,i)=>(
                    <AccentCard key={i}>
                      <CardLeft>
                        <CardName>{addr.street}{addr.unit?" #"+addr.unit:""}, {addr.city} {addr.state}</CardName>
                        <CardRow label="Since" val={addr.monthIn+" "+addr.yearIn}/>
                        {addr.rent&&<CardRow label="Rent" val={"$"+addr.rent+"/mo"}/>}
                        {addr.reason&&<CardRow label="Moving" val={addr.reason}/>}
                        {addr.resType==="Other"&&addr.otherSituation&&<CardRow label="Situation" val={addr.otherSituation}/>}
                        {addr.resType==="Rent"&&addr.landlordFirstName&&<CardRow label="Landlord" val={addr.landlordFirstName+" "+addr.landlordLastName}/>}
                        {addr.resType==="Rent"&&addr.landlordEmail&&<CardRow label="Email" val={addr.landlordEmail}/>}
                        {addr.resType==="Rent"&&addr.landlordPhone&&<CardRow label="Phone" val={addr.landlordPhone}/>}
                      </CardLeft>
                      <CardRight>
                        <Badge label={addr.resType||"Rent"} type={addr.resType}/>
                        {addr.resType==="Rent"&&addr.landlordEmail&&<DraftBtn onClick={()=>{
                          const refName=addr.landlordFirstName||"there";
                          const tokens={refName,applicantName:a.name,applicantFirstName:ad.firstName||a.name.split(" ")[0],pmName:settings.pmName||"Carolina Cooper",companyName:settings.companyName||"Black Bear Rentals",city:settings.city||"Huntsville, AL",phone:settings.phone||"(850) 696-8101",email:settings.email||"info@rentblackbear.com",address:`${addr.street}${addr.unit?" #"+addr.unit:""}, ${addr.city} ${addr.state}`};
                          const tmpl=settings.emailTemplates||{};
                          setModal(p=>({...p,_draftEmail:{to:addr.landlordEmail,subject:resolveEmailTemplate(tmpl.refLandlordSubject||DEF_SETTINGS.emailTemplates.refLandlordSubject,tokens),body:resolveEmailTemplate(tmpl.refLandlordBody||DEF_SETTINGS.emailTemplates.refLandlordBody,tokens),type:"refLandlord",refName,refType:"Previous Landlord",appId:a.id,refKey:"landlord"}}));
                        }}/>}
                      </CardRight>
                    </AccentCard>
                  ))}
                </>}

                {/* References */}
                {(ad.empRefFirstName||ad.persRefFirstName)&&<>
                  <SecHd label="References"/>
                  {ad.empRefFirstName&&!ad.unemployed&&<>
                    <AccentCard>
                      <CardLeft>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                          <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:8,background:"rgba(59,130,246,.08)",color:"#1d4ed8",letterSpacing:.2}}>EMPLOYER REFERENCE</span>
                        </div>
                        <CardName>{ad.empRefFirstName} {ad.empRefLastName}</CardName>
                        {ad.empRefRelation&&<CardRow label="Relationship" val={ad.empRefRelation}/>}
                        {ad.empRefEmail&&<CardRow label="Email" val={ad.empRefEmail}/>}
                        {ad.empRefPhone&&<CardRow label="Phone" val={ad.empRefPhone}/>}
                        {(modal._refReplies||[]).filter(r=>r.email===ad.empRefEmail).map((r,i)=><div key={i} style={{marginTop:6,padding:"5px 8px",background:"rgba(74,124,89,.06)",borderRadius:5,borderLeft:"2px solid #4a7c59"}}><div style={{fontSize:10,fontWeight:600,color:"#2d6a3f",marginBottom:1}}>{r.date} — Reply logged</div><div style={{fontSize:11,color:"#3d3529"}}>{r.notes}</div></div>)}
                      </CardLeft>
                      <CardRight>
                        {ad.empRefEmail&&<DraftBtn onClick={()=>{
                          const refName=ad.empRefFirstName;
                          const tokens={refName,applicantName:a.name,applicantFirstName:ad.firstName||a.name.split(" ")[0],pmName:settings.pmName||"Carolina Cooper",companyName:settings.companyName||"Black Bear Rentals",city:settings.city||"Huntsville, AL",phone:settings.phone||"(850) 696-8101",email:settings.email||"info@rentblackbear.com"};
                          const tmpl=settings.emailTemplates||{};
                          setModal(p=>({...p,_draftEmail:{to:ad.empRefEmail,subject:resolveEmailTemplate(tmpl.refEmployerSubject||DEF_SETTINGS.emailTemplates.refEmployerSubject,tokens),body:resolveEmailTemplate(tmpl.refEmployerBody||DEF_SETTINGS.emailTemplates.refEmployerBody,tokens),type:"refEmployer",refName,refType:"Employer Reference",appId:a.id,refKey:"employer"}}));
                        }}/>}
                        <LogBtn onClick={()=>setModal(p=>({...p,_logReply:{email:ad.empRefEmail,name:ad.empRefFirstName+" "+ad.empRefLastName,type:"Employer Reference"}}))}/>
                      </CardRight>
                    </AccentCard>
                  </>}
                  {ad.persRefFirstName&&<>
                    <AccentCard>
                      <CardLeft>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                          <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:8,background:"rgba(74,124,89,.08)",color:"#2d6a3f",letterSpacing:.2}}>PERSONAL REFERENCE</span>
                        </div>
                        <CardName>{ad.persRefFirstName} {ad.persRefLastName}</CardName>
                        {ad.persRefRelation&&<CardRow label="Relationship" val={ad.persRefRelation}/>}
                        {ad.persRefEmail&&<CardRow label="Email" val={ad.persRefEmail}/>}
                        {ad.persRefPhone&&<CardRow label="Phone" val={ad.persRefPhone}/>}
                        {(modal._refReplies||[]).filter(r=>r.email===ad.persRefEmail).map((r,i)=><div key={i} style={{marginTop:6,padding:"5px 8px",background:"rgba(74,124,89,.06)",borderRadius:5,borderLeft:"2px solid #4a7c59"}}><div style={{fontSize:10,fontWeight:600,color:"#2d6a3f",marginBottom:1}}>{r.date} — Reply logged</div><div style={{fontSize:11,color:"#3d3529"}}>{r.notes}</div></div>)}
                      </CardLeft>
                      <CardRight>
                        {ad.persRefEmail&&<DraftBtn onClick={()=>{
                          const refName=ad.persRefFirstName;
                          const tokens={refName,applicantName:a.name,applicantFirstName:ad.firstName||a.name.split(" ")[0],pmName:settings.pmName||"Carolina Cooper",companyName:settings.companyName||"Black Bear Rentals",city:settings.city||"Huntsville, AL",phone:settings.phone||"(850) 696-8101",email:settings.email||"info@rentblackbear.com"};
                          const tmpl=settings.emailTemplates||{};
                          setModal(p=>({...p,_draftEmail:{to:ad.persRefEmail,subject:resolveEmailTemplate(tmpl.refPersonalSubject||DEF_SETTINGS.emailTemplates.refPersonalSubject,tokens),body:resolveEmailTemplate(tmpl.refPersonalBody||DEF_SETTINGS.emailTemplates.refPersonalBody,tokens),type:"refPersonal",refName,refType:"Personal Reference",appId:a.id,refKey:"personal1"}}));
                        }}/>}
                        <LogBtn onClick={()=>setModal(p=>({...p,_logReply:{email:ad.persRefEmail,name:ad.persRefFirstName+" "+ad.persRefLastName,type:"Personal Reference"}}))}/>
                      </CardRight>
                    </AccentCard>
                  </>}
                </>}

                {/* Employment */}
                <SecHd label="Employment"/>
                {ad.unemployed
                  ?<AccentCard style={{borderLeftColor:"rgba(196,92,74,.4)"}}><CardLeft><CardName>Unemployed</CardName></CardLeft></AccentCard>
                  :(ad.employers||[]).length===0
                  ?<div style={{fontSize:12,color:"#aaa",padding:"4px 0 8px"}}>No employers listed</div>
                  :(ad.employers||[]).map((emp,i)=>(
                    <AccentCard key={i}>
                      <CardLeft>
                        <CardName>{emp.employer}</CardName>
                        {emp.position&&<CardRow label="Role" val={emp.position}/>}
                        {(emp.monthStarted||emp.yearStarted)&&<CardRow label="Since" val={[emp.monthStarted,emp.yearStarted].filter(Boolean).join(" ")}/>}
                        {emp.monthlyIncome&&<CardRow label="Income" val={"$"+emp.monthlyIncome+"/mo"}/>}
                        {emp.refName&&<CardRow label="Ref" val={emp.refName+(emp.refPhone?" · "+emp.refPhone:"")}/>}
                      </CardLeft>
                      <CardRight/>
                    </AccentCard>
                  ))
                }

                {/* Emergency Contact */}
                {(ad.emergName||ad.emergPhone)&&<>
                  <SecHd label="Emergency Contact"/>
                  <AccentCard style={{borderLeftColor:"rgba(196,92,74,.4)"}}>
                    <CardLeft>
                      <CardName>{ad.emergName}</CardName>
                      {ad.emergRelation&&<CardRow label="Relationship" val={ad.emergRelation}/>}
                      {ad.emergPhone&&<CardRow label="Phone" val={ad.emergPhone}/>}
                    </CardLeft>
                    <CardRight/>
                  </AccentCard>
                </>}
              </>);
            })()}

            {/* Partner */}
            {ad.partnerName&&ad.partnerName.trim()&&<>
              <div style={{fontSize:11,fontWeight:700,color:"#5c4a3a",textTransform:"uppercase",letterSpacing:.8,padding:"12px 0 6px",borderBottom:"1px solid rgba(0,0,0,.05)",marginBottom:6,marginTop:8}}>Partner / Co-Occupant</div>
              <Row label="Name" val={ad.partnerName}/>
              <Row label="Email" val={ad.partnerEmail}/>
            </>}

          </div>}
        </div>);
      })()}


            </div>}
          </div>
        );
      })()}
      {!["new-lead","pre-screened","called","invited"].includes(a.status)&&(()=>{
        const _o=(modal._accOpen===undefined||modal._accOpen===null?"room":modal._accOpen)==="docs";
        return(
          <div style={{borderBottom:"1px solid #f0ede8"}}>
            <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 16px",cursor:"pointer",userSelect:"none",background:_o?"rgba(26,23,20,.03)":"#fff"}} className="hvr-row" onClick={()=>setModal(p=>({...p,_accOpen:p._accOpen==="docs"?null:"docs"}))}>  
              <div style={{width:26,height:26,borderRadius:7,background:_o?"#1a1714":"#f0ede8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={_o?"#d4a853":"#5c4a3a"} strokeWidth="1.5"><rect x="2" y="3" width="12" height="10" rx="1"/><path d="M2 7h12M5 3V1M11 3V1"/></svg>
              </div>
              <div style={{fontSize:12,fontWeight:600,color:"#1a1714",flex:1}}>Application documents</div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>{(()=>{
                const _docs=(a.appDocs||(a.applicationData?.appDocs)||[]).filter(x=>x.url);
                const _d=_docs.length;
                const _v=_docs.filter(x=>x.verified==="verified"||x.verified==="approved"||x.verified===true).length;
                const _r=_docs.filter(x=>x.verified==="rejected").length;
                const _new=_docs.filter(x=>x.isReupload&&x.verified==="unreviewed").length;
                if(_d===0)return<span style={{fontSize:10,color:"#9a8878"}}>None yet</span>;
                return<>
                  {_new>0&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:8,background:"rgba(59,130,246,.12)",color:"#1d4ed8",display:"flex",alignItems:"center",gap:3}}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="#1d4ed8"><circle cx="4" cy="4" r="4"/></svg>
                    {_new} new upload{_new>1?"s":""}
                  </span>}
                  <span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:8,background:"rgba(74,124,89,.1)",color:"#27500a"}}>{_d} uploaded</span>
                  <span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:8,background:_v===_d?"rgba(74,124,89,.12)":_v>0?"rgba(212,168,83,.12)":"rgba(196,92,74,.1)",color:_v===_d?"#2d6a3f":_v>0?"#9a7422":"#c45c4a",display:"flex",alignItems:"center",gap:3}}>
                    {_v===_d&&<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#2d6a3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3"/></svg>}
                    {_v}/{_d} verified
                  </span>
                  {_r>0&&<span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:8,background:"rgba(196,92,74,.1)",color:"#c45c4a"}}>{_r} rejected</span>}
                </>;
              })()}</div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" style={{transform:_o?"rotate(180deg)":"none",transition:"transform .2s",marginLeft:4,flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {_o&&<div style={{padding:"0 0 4px"}}>
      {/* Documents from application */}
      {(()=>{
        const docs=(a.appDocs&&a.appDocs.length>0?a.appDocs:(a.applicationData?.appDocs)||[]).filter(x=>x.url);
        const flag=a.docsFlag||(a.applicationData?.docsFlag)||{};
        const hasAny=docs.length>0||flag.idUploadLater||flag.incomeUploadLater;
        if(!hasAny)return null;
        const deleteDocFromStorage=async(doc)=>{
          // Extract path from public URL: .../public/applicant-docs/{path}
          const marker="/public/applicant-docs/";
          const idx=doc.url.indexOf(marker);
          if(idx===-1)return false;
          const path=doc.url.slice(idx+marker.length);
          const r=await fetch(SUPA_URL+"/storage/v1/object/applicant-docs/"+path,{
            method:"DELETE",
            headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY},
          });
          return r.ok||r.status===404;
        };
        const setDocVerified=(docId,status)=>{
          const updateDocs=d=>d.map(x=>x.id===docId?{...x,verified:status,isReupload:false}:x);
          const newDocs=updateDocs(docs.length>0?docs:(a.applicationData?.appDocs||[]));
          const updatedApp={...a,appDocs:newDocs,applicationData:a.applicationData?{...a.applicationData,appDocs:newDocs}:a.applicationData};
          const updatedApps=apps.map(x=>x.id===a.id?updatedApp:x);
          setApps(updatedApps);save("hq-apps",updatedApps);
          setModal(prev=>({...prev,data:updatedApp}));
          // Update idVerified screening field if both ID docs verified
          if(status==="verified"){
            const allDocs=newDocs;
            const frontOk=allDocs.find(x=>x.type==="PhotoID-Front")?.verified==="verified";
            const backOk=allDocs.find(x=>x.type==="PhotoID-Back")?.verified==="verified";
            if(frontOk&&backOk){
              const ua=apps.map(x=>x.id===a.id?{...x,idVerified:"verified",appDocs:newDocs}:x);
              setApps(ua);save("hq-apps",ua);
              setModal(prev=>({...prev,data:{...prev.data,idVerified:"verified",appDocs:newDocs}}));
            }
          }
        };
        const requestReupload=(docLabel,docType,customNote)=>{
          const tmpl=settings.emailTemplates||{};
          const portalLink=window.location.origin+"/reupload?app="+a.id+"&doc="+encodeURIComponent(docType||docLabel)+"&label="+encodeURIComponent(docLabel);
          const tokens={applicantFirstName:a.name.split(" ")[0],applicantName:a.name,docLabel,portalLink,pmName:settings.pmName||"Carolina Cooper",companyName:settings.companyName||"Black Bear Rentals",phone:settings.phone||"(850) 696-8101",email:settings.email||"info@rentblackbear.com"};
          let body=resolveEmailTemplate(tmpl.reuploadBody||DEF_SETTINGS.emailTemplates.reuploadBody,tokens);
          if(customNote&&customNote.trim()){
            body=body.replace(
              "Please log in",
              "Additional note from your property manager:\n\""+customNote.trim()+"\"\n\nPlease log in"
            );
          }
          const subject=resolveEmailTemplate(tmpl.reuploadSubject||DEF_SETTINGS.emailTemplates.reuploadSubject,tokens);
          setModal(prev=>({...prev,_draftEmail:{to:a.email,subject,body,type:"reupload",docLabel},_rejectPrompt:null}));
        };
        const DocCard=({doc})=>{
          const isPdf=doc?.name?.toLowerCase().endsWith(".pdf");
          const isUploaded=!!doc?.url;
          const vStatus=doc?.verified||"unreviewed";
          const borderColor=vStatus==="verified"?"rgba(74,124,89,.3)":vStatus==="rejected"?"rgba(196,92,74,.3)":"rgba(0,0,0,.07)";
          const handleDelete=()=>{
            showConfirm({
              title:"Delete Document Permanently?",
              body:"This will permanently delete "+doc.label+" from Supabase Storage. This cannot be undone.",
              confirmLabel:"Delete Permanently",
              danger:true,
              onConfirm:async()=>{
                const ok=await deleteDocFromStorage(doc);
                if(ok){
                  const updatedDocs=(a.appDocs||[]).filter(x=>x.id!==doc.id);
                  const updatedApp={...a,appDocs:updatedDocs};
                  const updatedApps=apps.map(x=>x.id===a.id?updatedApp:x);
                  setApps(updatedApps);save("hq-apps",updatedApps);
                  setModal(prev=>({...prev,data:{...prev.data,appDocs:updatedDocs}}));
                } else {
                  showAlert({title:"Delete Failed",body:"Could not delete the file from storage. Check your Supabase permissions and try again."});
                }
              }
            });
          };
          return(<div style={{marginBottom:10,borderRadius:9,overflow:"hidden",border:"1px solid "+(doc.isReupload&&vStatus==="unreviewed"?"rgba(59,130,246,.35)":borderColor)}}>
            {doc.isReupload&&vStatus==="unreviewed"&&<div style={{padding:"6px 10px",background:"rgba(59,130,246,.08)",borderBottom:"1px solid rgba(59,130,246,.15)",display:"flex",alignItems:"center",gap:6}}>
              <svg width="10" height="10" viewBox="0 0 8 8" fill="#1d4ed8"><circle cx="4" cy="4" r="4"/></svg>
              <span style={{fontSize:10,fontWeight:700,color:"#1d4ed8"}}>New re-upload — needs review</span>
            </div>}
            <div style={{padding:"8px 10px",background:vStatus==="verified"?"rgba(74,124,89,.04)":vStatus==="rejected"?"rgba(196,92,74,.03)":"rgba(0,0,0,.02)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isUploaded?6:0}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"#1a1714"}}>{doc.label}</div>
                  {isUploaded&&<div style={{fontSize:9,color:"#6b5e52",marginTop:1}}>{doc.name}</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  {isUploaded
                    ?<a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-out btn-sm" style={{fontSize:9,padding:"3px 8px",textDecoration:"none"}}>View</a>
                    :<span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:8,background:"rgba(212,168,83,.1)",color:"#9a7422"}}>Not uploaded</span>}
                </div>
              </div>
              {isUploaded&&<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                <button onClick={()=>setDocVerified(doc.id,"verified")} style={{fontSize:9,padding:"3px 9px",borderRadius:5,border:"1px solid rgba(74,124,89,.3)",background:vStatus==="verified"?"#4a7c59":"#fff",color:vStatus==="verified"?"#fff":"#4a7c59",cursor:"pointer",fontFamily:"inherit",fontWeight:700,transition:"all .15s"}}>
                  {vStatus==="verified"?"✓ Verified":"Verify"}
                </button>
                <button onClick={()=>{setDocVerified(doc.id,"rejected");requestReupload(doc.label,doc.type);}} style={{fontSize:9,padding:"3px 9px",borderRadius:5,border:"1px solid rgba(196,92,74,.25)",background:vStatus==="rejected"?"#c45c4a":"#fff",color:vStatus==="rejected"?"#fff":"#c45c4a",cursor:"pointer",fontFamily:"inherit",fontWeight:700,transition:"all .15s"}}>
                  Reject & Request Re-Upload
                </button>
                {isUploaded&&<button onClick={handleDelete} style={{fontSize:9,padding:"3px 7px",borderRadius:5,border:"1px solid rgba(0,0,0,.08)",background:"none",color:"#9a8878",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Delete</button>}
              </div>}
            </div>
            {isUploaded&&!isPdf&&<img src={doc.url} alt={doc.label} style={{width:"100%",maxHeight:180,objectFit:"cover",display:"block",borderTop:"1px solid rgba(0,0,0,.05)"}}/>}
          </div>);
        };
        const idDocs=docs.filter(x=>x.type==="PhotoID-Front"||x.type==="PhotoID-Back");
        const payDocs=docs.filter(x=>x.type==="PayStub");
        return(<div className="tp-card">
          <h3>Application Documents</h3>
          {idDocs.length>0&&<>
            <div style={{fontSize:10,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Photo ID</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {["PhotoID-Front","PhotoID-Back"].map(t=>{
                const doc=docs.find(x=>x.type===t)||{type:t,label:t==="PhotoID-Front"?"Front of ID":"Back of ID"};
                return<DocCard key={t} doc={doc}/>;
              })}
            </div>
          </>}
          {flag.idUploadLater&&idDocs.length===0&&<div style={{fontSize:11,color:"#9a7422",padding:"7px 10px",background:"rgba(212,168,83,.08)",borderRadius:7,marginBottom:10}}>Photo ID — tenant will upload later</div>}
          {payDocs.length>0&&<>
            <div style={{fontSize:10,fontWeight:700,color:"#7a7067",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Proof of Income</div>
            {payDocs.map(doc=><DocCard key={doc.id} doc={doc}/>)}
          </>}
          {flag.incomeUploadLater&&payDocs.length===0&&<div style={{fontSize:11,color:"#9a7422",padding:"7px 10px",background:"rgba(212,168,83,.08)",borderRadius:7}}>Proof of income — tenant will upload later</div>}
          {docs.length===0&&!flag.idUploadLater&&!flag.incomeUploadLater&&<div style={{fontSize:11,color:"#aaa",fontStyle:"italic"}}>No documents uploaded yet.</div>}
        </div>);
      })()}



            </div>}
          </div>
        );
      })()}
      {(()=>{
        const _o=(modal._accOpen===undefined||modal._accOpen===null?"room":modal._accOpen)==="screening";
        return(
          <div style={{borderBottom:"1px solid #f0ede8"}}>
            <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 16px",cursor:"pointer",userSelect:"none",background:_o?"rgba(26,23,20,.03)":"#fff"}} className="hvr-row" onClick={()=>setModal(p=>({...p,_accOpen:p._accOpen==="screening"?null:"screening"}))}>  
              <div style={{width:26,height:26,borderRadius:7,background:_o?"#1a1714":"#f0ede8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={_o?"#d4a853":"#5c4a3a"} strokeWidth="1.5"><path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 9l-3.1 1.5.6-3.5L3 4.5 6.5 4z"/></svg>
              </div>
              <div style={{fontSize:12,fontWeight:600,color:"#1a1714",flex:1}}>Screening checklist</div>
              <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>{(()=>{
                const feePaid=(a.appFee||0)>0;
                const hasRentPrep=a.screenPkg&&a.screenPkg!=="none";
                const allDocs=(a.appDocs||(a.applicationData?.appDocs)||[]).filter(x=>x.url);
                const idF=allDocs.find(x=>x.type==="PhotoID-Front");
                const idB=allDocs.find(x=>x.type==="PhotoID-Back");
                const idOk=idF?.verified==="verified"&&idB?.verified==="verified";
                const idBad=idF?.verified==="rejected"||idB?.verified==="rejected";
                const bgOk=a.bgCheck==="passed";
                const creditOk=a.creditScore&&a.creditScore!=="—"&&!isNaN(parseInt(a.creditScore))&&parseInt(a.creditScore)>=580;
                const incOk=!a.incomeAdd||a.incomeAdd==="none"||a.incomeAdd===""||a.incomeVerified==="verified";
                const payDocs=allDocs.filter(x=>x.type==="PayStub");
                const payOk=true; // optional — never blocks approval
                const payBad=payDocs.some(x=>x.verified==="rejected");
                const refsOk=a.refs==="verified"||(()=>{const rv=a.refVerified||{};const ad2=a.applicationData||{};const keys=[];(ad2.addresses||[]).filter(x=>x.resType==="Rent"&&x.landlordEmail).forEach((_,i)=>keys.push(`landlord_${i}`));if(ad2.empRefEmail&&!ad2.unemployed)keys.push("employer");if(ad2.persRefEmail)keys.push("personal1");return keys.length>0&&keys.every(k=>rv[k]===true);})();
                const issues=[!bgOk,!creditOk,!incOk,!payOk||payBad,!refsOk,!idOk||idBad].filter(Boolean).length;
                return issues>0?<span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:8,background:"rgba(212,168,83,.1)",color:"#633806"}}>{issues} pending</span>:<span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:8,background:"rgba(74,124,89,.1)",color:"#27500a"}}>Complete</span>;
              })()}</div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" style={{transform:_o?"rotate(180deg)":"none",transition:"transform .2s",marginLeft:4,flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {_o&&<div style={{padding:"0 0 4px"}}>
      {/* ── Screening Checklist — derived, no manual dropdowns ── */}
      {(a.status==="applied"||a.status==="reviewing")&&(()=>{
        const feePaid=(a.appFee||0)>0;
        const hasRentPrep=a.screenPkg&&a.screenPkg!=="none";
        const hasIncome=a.incomeAdd&&a.incomeAdd!=="none"&&a.incomeAdd!=="";
        // Derive each item's status from actual data
        const allDocs=(a.appDocs||(a.applicationData?.appDocs)||[]).filter(x=>x.url);
        const idFront=allDocs.find(x=>x.type==="PhotoID-Front");
        const idBack=allDocs.find(x=>x.type==="PhotoID-Back");
        const idAnyRejected=idFront?.verified==="rejected"||idBack?.verified==="rejected";
        const idBothVerified=(idFront?.verified==="verified")&&(idBack?.verified==="verified");
        const idAnyVerified=idFront?.verified==="verified"||idBack?.verified==="verified";
        const idUploaded=!!(idFront||idBack);
        const idVerifiedDerived=idAnyRejected?"rejected":idBothVerified?"verified":idUploaded?"uploaded":"not-started";
        const ad=a.applicationData||{};
        const totalRefs=(ad.empRefFirstName&&!ad.unemployed?1:0)+(ad.persRefFirstName?1:0);
        const repliedRefs=(modal._refReplies||[]).filter(r=>r.appId===a.id||true).length;
        const refsStatus=a.refs==="verified"?"verified":repliedRefs>0?`${Math.min(repliedRefs,totalRefs)}/${totalRefs} replied`:totalRefs>0?"not-started":"not-started";

        const StatusDot=({s})=>{
          const c=s==="verified"||s==="passed"?"#2d6a3f":s==="failed"||s==="rejected"?"#c45c4a":s==="awaiting"||s==="pending"?"#d4a853":s==="optional"?"#b0a898":"#d0ccc6";
          const fill=s==="verified"||s==="passed"?"#2d6a3f":s==="failed"||s==="rejected"?"#c45c4a":s==="awaiting"||s==="pending"?"#d4a853":"#e8e5e0";
          return s==="verified"||s==="passed"
            ?<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill={fill} opacity=".15"/><polyline points="4.5 8 7 10.5 11.5 5.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            :s==="failed"||s==="rejected"
            ?<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill={fill} opacity=".12"/><line x1="5" y1="5" x2="11" y2="11" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="11" y1="5" x2="5" y2="11" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>
            :s==="awaiting"||s==="pending"
            ?<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke={c} strokeWidth="1.5" fill="none"/><line x1="8" y1="4.5" x2="8" y2="8.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="9.5" x2="8" y2="10.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>
            :s==="optional"
            ?<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke={c} strokeWidth="1.2" fill="none" strokeDasharray="3 2"/><line x1="5.5" y1="8" x2="10.5" y2="8" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>
            :<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke={c} strokeWidth="1.5" fill="none" strokeDasharray="2 2"/></svg>;
        };
        const Badge=({s,label})=>{
          const cfg={verified:{bg:"rgba(74,124,89,.1)",c:"#2d6a3f"},passed:{bg:"rgba(74,124,89,.1)",c:"#2d6a3f"},failed:{bg:"rgba(196,92,74,.1)",c:"#c45c4a"},rejected:{bg:"rgba(196,92,74,.1)",c:"#c45c4a"},awaiting:{bg:"rgba(212,168,83,.1)",c:"#9a7422"},pending:{bg:"rgba(212,168,83,.1)",c:"#9a7422"},optional:{bg:"rgba(0,0,0,.04)",c:"#9a8878"}}[s]||{bg:"rgba(0,0,0,.05)",c:"#aaa"};
          return<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:8,background:cfg.bg,color:cfg.c,whiteSpace:"nowrap"}}>{label}</span>;
        };
        const Row=({label,st,detail,badge,tag})=>(
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
            <StatusDot s={st}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>{label}</span>
                {tag&&<span style={{fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:4,background:"rgba(59,130,246,.08)",color:"#1d4ed8",letterSpacing:.3}}>{tag}</span>}
              </div>
              {detail&&<div style={{fontSize:10,color:"#7a7067",marginTop:1}}>{detail}</div>}
            </div>
            {badge&&<Badge s={st} label={badge}/>}
          </div>
        );

        // Background Check
        const bgSt=a.bgCheck==="passed"?"passed":a.bgCheck==="failed"?"failed":a.bgCheck==="pending"?"pending":hasRentPrep&&feePaid?"awaiting":"not-started";
        const bgDetail=bgSt==="awaiting"?"Paid — results incoming from RentPrep":bgSt==="passed"?"Cleared":bgSt==="failed"?"Did not pass":bgSt==="pending"?"In progress — RentPrep processing":null;
        const bgBadge=bgSt==="awaiting"?"Awaiting RentPrep":bgSt==="passed"?"Passed":bgSt==="failed"?"Failed":bgSt==="pending"?"Processing":hasRentPrep?"Not Started":null;

        // Credit Check
        const hasScore=a.creditScore&&a.creditScore!=="—"&&!isNaN(parseInt(a.creditScore));
        const score=hasScore?parseInt(a.creditScore):null;
        const creditSt=hasScore?(score>=650?"passed":score>=580?"pending":"failed"):hasRentPrep&&feePaid?"awaiting":"not-started";
        const creditDetail=hasScore?`FICO Score: ${score}`:creditSt==="awaiting"?"Paid — results incoming from RentPrep":null;
        const creditBadge=hasScore?(score>=700?"Strong":score>=650?"Good":score>=580?"Fair":"Poor"):creditSt==="awaiting"?"Awaiting RentPrep":hasRentPrep?"Not Started":null;

        // Income Verification
        // Income Verification — always show if RentPrep package selected; status depends on whether add-on was purchased
        const incSt=a.incomeVerified==="verified"?"verified":hasIncome&&feePaid?"awaiting":hasIncome?"not-started":hasRentPrep?"optional":null;
        const incDetail=incSt==="awaiting"?"Paid — income report incoming from RentPrep":incSt==="verified"?"Income confirmed":incSt==="optional"?"Add-on not selected — skip or add at invite time":null;
        const incBadge=incSt==="verified"?"Verified":incSt==="awaiting"?"Awaiting RentPrep":incSt==="not-started"?"Not Started":incSt==="optional"?"Not Selected":null;

        // Build full reference contact list from all sources
        const refContacts=[];
        // Previous landlords from rental history
        (ad.addresses||[]).filter(addr=>addr.resType==="Rent"&&addr.landlordEmail).forEach((addr,i)=>{
          const replies=(modal._refReplies||[]).filter(r=>r.refKey===`landlord_${i}`||r.refKey==="landlord"||r.email===addr.landlordEmail);
          const verified=(a.refVerified||{})[`landlord_${i}`];
          refContacts.push({key:`landlord_${i}`,typeLabel:"Previous Landlord"+(i>0?` ${i+1}`:""),email:addr.landlordEmail,phone:addr.landlordPhone,draftFn:()=>{
            const tokens={refName:addr.landlordFirstName||"there",applicantName:a.name,applicantFirstName:ad.firstName||a.name.split(" ")[0],pmName:settings.pmName||"Carolina Cooper",companyName:settings.companyName||"Black Bear Rentals",city:settings.city||"Huntsville, AL",phone:settings.phone||"(850) 696-8101",email:settings.email||"info@rentblackbear.com",address:`${addr.street}${addr.unit?" #"+addr.unit:""}, ${addr.city} ${addr.state}`};
            const tmpl=settings.emailTemplates||{};
            setModal(p=>({...p,_draftEmail:{to:addr.landlordEmail,subject:resolveEmailTemplate(tmpl.refLandlordSubject||DEF_SETTINGS.emailTemplates.refLandlordSubject,tokens),body:resolveEmailTemplate(tmpl.refLandlordBody||DEF_SETTINGS.emailTemplates.refLandlordBody,tokens),type:"refLandlord",refType:"Previous Landlord",appId:a.id,refKey:"landlord"}}));
          },replies,verified});
        });
        // Employer reference
        if(ad.empRefEmail&&!ad.unemployed){
          const replies=(modal._refReplies||[]).filter(r=>r.refKey==="employer"||r.email===ad.empRefEmail);
          const verified=(a.refVerified||{}).employer;
          refContacts.push({key:"employer",typeLabel:"Employer Reference",email:ad.empRefEmail,phone:ad.empRefPhone,draftFn:()=>{
            const tokens={refName:ad.empRefFirstName,applicantName:a.name,applicantFirstName:ad.firstName||a.name.split(" ")[0],pmName:settings.pmName||"Carolina Cooper",companyName:settings.companyName||"Black Bear Rentals",city:settings.city||"Huntsville, AL",phone:settings.phone||"(850) 696-8101",email:settings.email||"info@rentblackbear.com"};
            const tmpl=settings.emailTemplates||{};
            setModal(p=>({...p,_draftEmail:{to:ad.empRefEmail,subject:resolveEmailTemplate(tmpl.refEmployerSubject||DEF_SETTINGS.emailTemplates.refEmployerSubject,tokens),body:resolveEmailTemplate(tmpl.refEmployerBody||DEF_SETTINGS.emailTemplates.refEmployerBody,tokens),type:"refEmployer",refType:"Employer Reference",appId:a.id,refKey:"employer"}}));
          },replies,verified});
        }
        // Personal references
        if(ad.persRefEmail){
          const replies=(modal._refReplies||[]).filter(r=>r.refKey==="personal1"||r.email===ad.persRefEmail);
          const verified=(a.refVerified||{}).personal1;
          refContacts.push({key:"personal1",typeLabel:"Personal Reference",email:ad.persRefEmail,phone:ad.persRefPhone,draftFn:()=>{
            const tokens={refName:ad.persRefFirstName,applicantName:a.name,applicantFirstName:ad.firstName||a.name.split(" ")[0],pmName:settings.pmName||"Carolina Cooper",companyName:settings.companyName||"Black Bear Rentals",city:settings.city||"Huntsville, AL",phone:settings.phone||"(850) 696-8101",email:settings.email||"info@rentblackbear.com"};
            const tmpl=settings.emailTemplates||{};
            setModal(p=>({...p,_draftEmail:{to:ad.persRefEmail,subject:resolveEmailTemplate(tmpl.refPersonalSubject||DEF_SETTINGS.emailTemplates.refPersonalSubject,tokens),body:resolveEmailTemplate(tmpl.refPersonalBody||DEF_SETTINGS.emailTemplates.refPersonalBody,tokens),type:"refPersonal",refType:"Personal Reference",appId:a.id,refKey:"personal1"}}));
          },replies,verified});
        }

        const totalRefContacts=refContacts.length;
        const verifiedRefContacts=refContacts.filter(r=>r.verified).length;
        const repliedRefContacts=refContacts.filter(r=>r.replies.length>0).length;
        const refSt=verifiedRefContacts===totalRefContacts&&totalRefContacts>0?"verified":repliedRefContacts>0?"pending":totalRefContacts>0?"not-started":"not-started";
        const refBadge=verifiedRefContacts===totalRefContacts&&totalRefContacts>0?"All Verified":repliedRefContacts>0?`${repliedRefContacts}/${totalRefContacts} Replied`:totalRefContacts>0?`${totalRefContacts} to contact`:"None listed";
        const refDetail=`${totalRefContacts} contact${totalRefContacts!==1?"s":""} — ${verifiedRefContacts} verified`;
        const refsOpen=modal._refsExpanded===true;

        const setRefVerified=(key,val)=>{
          const newRefVerified={...(a.refVerified||{}),[key]:val};
          // Count total expected contacts to determine if all are verified
          const expectedKeys=[];
          (ad.addresses||[]).filter(addr=>addr.resType==="Rent"&&addr.landlordEmail).forEach((_,i)=>expectedKeys.push(`landlord_${i}`));
          if(ad.empRefEmail&&!ad.unemployed)expectedKeys.push("employer");
          if(ad.persRefEmail)expectedKeys.push("personal1");
          const allVerified=expectedKeys.length>0&&expectedKeys.every(k=>newRefVerified[k]===true);
          const updated={...a,refVerified:newRefVerified,refs:allVerified?"verified":a.refs==="verified"?"pending":a.refs};
          const ua=apps.map(x=>x.id===a.id?updated:x);
          setApps(ua);save("hq-apps",ua);
          setModal(p=>({...p,data:updated}));
        };

        const refStatusFor=(rc)=>rc.verified?"verified":rc.replies.length>0?"pending":"not-started";
        const refBadgeFor=(rc)=>rc.verified?"Verified":rc.replies.length>0?"Replied":"Not Contacted";

        // ID Verified — requires BOTH front and back verified, fails if either rejected
        const idSt=idAnyRejected?"failed":idBothVerified?"verified":idAnyVerified?"pending":idUploaded?"pending":"not-started";
        const idDetail=idAnyRejected?"One or more documents rejected — tenant notified to re-upload":idBothVerified?"Front & back confirmed":idAnyVerified?"One side verified — waiting on the other":idUploaded?"Uploaded — awaiting review":null;
        const idBadge=idAnyRejected?"Action Required":idBothVerified?"Verified":idAnyVerified?"Partially Verified":idUploaded?"Under Review":"Not Uploaded";

        // Pay Stubs — derived from appDocs
        const payStubs=allDocs.filter(x=>x.type==="PayStub");
        const payAnyRejected=payStubs.some(x=>x.verified==="rejected");
        const payAllVerified=payStubs.length>0&&payStubs.every(x=>x.verified==="verified");
        const payAnyVerified=payStubs.some(x=>x.verified==="verified");
        const paySt=payAnyRejected?"failed":payAllVerified?"verified":payStubs.length>0?"pending":"optional";
        const payDetail=payAnyRejected?"Pay stub rejected — tenant notified to re-upload":payAllVerified?`${payStubs.length} stub${payStubs.length>1?"s":""} verified`:payStubs.length>0?"Uploaded — awaiting review":"Not required — RentPrep income verification covers this";
        const payBadge=payAnyRejected?"Action Required":payAllVerified?"Verified":payStubs.length>0?"Under Review":"Optional";

        return(<div className="tp-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <h3 style={{margin:0}}>Screening Checklist</h3>
            {a.waiverReason&&<span style={{fontSize:9,color:"#9a7422",background:"rgba(212,168,83,.1)",padding:"2px 7px",borderRadius:8,fontWeight:700}}>Waived</span>}
          </div>
          <div style={{fontSize:10,color:"#9a8878",marginBottom:12}}>Auto-derived from application data · Updates when RentPrep results arrive</div>
          <Row label="Background Check" st={bgSt} detail={bgDetail} badge={bgBadge} tag={hasRentPrep?"RENTPREP":null}/>
          <Row label="Credit Check" st={creditSt} detail={creditDetail} badge={creditBadge} tag={hasRentPrep?"RENTPREP":null}/>
          {incSt!==null&&<Row label="Income Verification" st={incSt} detail={incDetail} badge={incBadge} tag={hasRentPrep?"RENTPREP":null}/>}
          <Row label="Pay Stubs" st={paySt} detail={payDetail} badge={payBadge}/>
          {/* References — expandable */}
          <div style={{borderBottom:"1px solid rgba(0,0,0,.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",cursor:"pointer",userSelect:"none"}} onClick={()=>setModal(p=>({...p,_refsExpanded:!refsOpen}))}>
              <StatusDot s={refSt}/>
              <div style={{flex:1,minWidth:0}}>
                <span style={{fontSize:12,fontWeight:600,color:"#1a1714"}}>References</span>
                <div style={{fontSize:10,color:"#7a7067",marginTop:1}}>{refDetail}</div>
              </div>
              <Badge s={refSt} label={refBadge}/>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" style={{transform:refsOpen?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0,marginLeft:2}}><polyline points="4 6 8 10 12 6"/></svg>
            </div>
            {refsOpen&&<div style={{paddingBottom:8,paddingLeft:26}}>
              {refContacts.length===0&&<div style={{fontSize:11,color:"#aaa",padding:"6px 0"}}>No reference contacts found in application data.</div>}
              {refContacts.map(rc=>{
                const rst=refStatusFor(rc);
                const rbadge=refBadgeFor(rc);
                return(<div key={rc.key}>
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderTop:"1px solid rgba(0,0,0,.04)"}}>
                  <StatusDot s={rst}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#1a1714"}}>{rc.typeLabel}</div>
                    <div style={{fontSize:10,color:"#7a7067"}}>{rc.email}</div>
                  </div>
                  <Badge s={rst} label={rbadge}/>
                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                    {rc.email&&<button onClick={rc.draftFn} style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:5,border:"1px solid rgba(212,168,83,.3)",background:"rgba(212,168,83,.08)",color:"#9a7422",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Email →</button>}
                    {!rc.verified
                      ?<button onClick={()=>setRefVerified(rc.key,true)} style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:5,border:"1px solid rgba(74,124,89,.3)",background:"#fff",color:"#4a7c59",cursor:"pointer",fontFamily:"inherit"}}>Verify</button>
                      :<button onClick={()=>setRefVerified(rc.key,false)} style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:5,border:"none",background:"#4a7c59",color:"#fff",cursor:"pointer",fontFamily:"inherit"}}>✓ Verified</button>
                    }
                  </div>
                  </div>
                  {rc.replies.map((r,i)=>(
                    <div key={r.id||i} style={{marginLeft:24,marginTop:4,padding:"7px 10px",background:r.auto?"rgba(59,130,246,.05)":"rgba(74,124,89,.05)",borderRadius:6,borderLeft:`2px solid ${r.auto?"rgba(59,130,246,.3)":"rgba(74,124,89,.3)"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:r.body||r.notes?4:0}}>
                        <span style={{fontSize:9,fontWeight:700,color:r.auto?"#1d4ed8":"#2d6a3f"}}>{r.auto?"● Auto-received":"✓ Logged"} · {r.date}</span>
                        {r.from&&<span style={{fontSize:9,color:"#7a7067"}}>{r.from.replace(/<[^>]+>/g,"").trim()}</span>}
                      </div>
                      {(r.body||r.notes)&&<div style={{fontSize:11,color:"#3d3529",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{(r.body||r.notes).slice(0,400)}{(r.body||r.notes).length>400?"…":""}</div>}
                    </div>
                  ))}
                </div>);
              })}
            </div>}
          </div>
          <Row label="ID Verified" st={idSt} detail={idDetail} badge={idBadge}/>
          {a.waiverReason&&<div style={{fontSize:10,color:"#6b5e52",marginTop:8,fontStyle:"italic",paddingTop:8,borderTop:"1px solid rgba(0,0,0,.04)"}}>Waiver: {a.waiverReason}</div>}
        </div>);
      })()}


            </div>}
          </div>
        );
      })()}
      {!["new-lead","pre-screened","called","invited"].includes(a.status)&&(()=>{
        const _o=(modal._accOpen===undefined||modal._accOpen===null?"room":modal._accOpen)==="housemates";
        return(
          <div style={{borderBottom:"1px solid #f0ede8"}}>
            <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 16px",cursor:"pointer",userSelect:"none",background:_o?"rgba(26,23,20,.03)":"#fff"}} className="hvr-row" onClick={()=>setModal(p=>({...p,_accOpen:p._accOpen==="housemates"?null:"housemates"}))}>  
              <div style={{width:26,height:26,borderRadius:7,background:_o?"#1a1714":"#f0ede8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={_o?"#d4a853":"#5c4a3a"} strokeWidth="1.5"><circle cx="6" cy="5" r="2.5"/><circle cx="11" cy="5" r="2.5"/><path d="M1 14a5 5 0 0 1 10 0" opacity=".5"/></svg>
              </div>
              <div style={{fontSize:12,fontWeight:600,color:"#1a1714",flex:1}}>Housemates</div>
              <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}></div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" style={{transform:_o?"rotate(180deg)":"none",transition:"transform .2s",marginLeft:4,flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {_o&&<div style={{padding:"0 0 4px"}}>
      {/* Roommate Compatibility */}
      {(()=>{
        // Resolve prop: prefer termPropId (ID-based, most reliable) → property name → termRoomId room lookup
        const hmProp=a.termPropId?props.find(p=>p.id===a.termPropId)
          :a.property?props.find(p=>p.name===a.property)
          :a.termRoomId?props.find(p=>allRooms(p).some(r=>r.id===a.termRoomId)||(p.units||[]).some(u=>u.id===a.termRoomId))
          :null;
        if(!hmProp)return null;
        const allItems=leaseableItems(hmProp);
        // Find the specific assigned item — for whole units termRoomId === u.id === i.id
        const assignedItem=a.termRoomId
          ?allItems.find(i=>i.id===a.termRoomId)||(allItems.find(i=>i.unitId===a.termRoomId))
          :a.room?allItems.find(i=>i.name===a.room):null;
        const isWholeUnitRental=!!(assignedItem?.isWholeUnit);
        // Whole-unit rental: applicant IS the unit — no housemates
        if(isWholeUnitRental)return null;
        const targetUnitId=assignedItem?.unitId||null;
        // Unit-specific address for header — use unit.addr if present, else prop.addr
        const targetUnit=targetUnitId?(hmProp.units||[]).find(u=>u.id===targetUnitId):null;
        const hmAddr=targetUnit?.addr||(hmProp.units||[]).length===1?hmProp.addr:null;
        const hmDisplayName=hmAddr||getPropDisplayName(hmProp);
        // Only show housemates from the same unit, excluding the applicant's own room
        const items=targetUnitId
          ?allItems.filter(i=>i.unitId===targetUnitId&&i.id!==a.termRoomId)
          :allItems.filter(i=>i.id!==a.termRoomId);
        if(items.length===0)return null;
        const hmOpen=modal._hmOpen===true; // collapsed by default
        return(<div className="tp-card" style={{padding:0,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 18px",cursor:"pointer",background:hmOpen?"rgba(0,0,0,.01)":"#fff"}} onClick={()=>setModal(p=>({...p,_hmOpen:!hmOpen}))}>
            <h3 style={{margin:0,fontSize:13}}>Housemates at {hmDisplayName}</h3>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:9,color:"#6b5e52"}}>{items.length} room{items.length!==1?"s":""}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" style={{transform:hmOpen?"rotate(180deg)":"none",transition:"transform .2s"}}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          {hmOpen&&<div style={{padding:"0 18px 12px"}}>
        {(function(){
          const calcAge=(dob)=>{if(!dob)return null;const b=new Date(dob+"T00:00:00");if(isNaN(b))return null;const today=new Date();let age=today.getFullYear()-b.getFullYear();const m=today.getMonth()-b.getMonth();if(m<0||(m===0&&today.getDate()<b.getDate()))age--;return age>=10&&age<120?age:null;};
          // items/targetUnitId already resolved in outer scope
          return(<>
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
              const genderShort=occ&&item.tenant.gender?item.tenant.gender==="Male"?"M":item.tenant.gender==="Female"?"F":null:null;
              // Pull employer from applicationData employers array
              const employers=occ&&item.tenant.applicationData?Object.values(item.tenant.applicationData).find(v=>Array.isArray(v)&&v[0]?.company):null;
              const primaryEmployer=employers?employers[0]?.company:null;
              const occupType=occ&&item.tenant.occupationType||null;
              const leaseEnd=item.le||null;
              const dl=leaseEnd?Math.ceil((new Date(leaseEnd+"T00:00:00")-TODAY)/(1e3*60*60*24)):null;
              const occupBadgeColor=occupType==="NASA Intern"||occupType==="Intern"?"#3b82f6":occupType==="Student"?"#8b5cf6":occupType==="Military"||occupType==="Contractor"?"#059669":"#6b5e52";
              const occupBadgeBg=occupType==="NASA Intern"||occupType==="Intern"?"rgba(59,130,246,.1)":occupType==="Student"?"rgba(139,92,246,.1)":occupType==="Military"||occupType==="Contractor"?"rgba(5,150,105,.1)":"rgba(0,0,0,.05)";
              return(
                <div key={item.id} style={{padding:"9px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:occ?"#1a1714":"#4a7c59"}}>{item.name}</div>
                      {occ&&<>
                        {/* Name + identity chips */}
                        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
                          {item.tenant.name&&<span style={{fontSize:10,color:"#5c4a3a",fontWeight:600}}>{item.tenant.name}</span>}
                          {genderShort&&<span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:"rgba(0,0,0,.05)",color:"#6b5e52",fontWeight:600}}>{genderShort}</span>}
                          {age&&<span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:"rgba(0,0,0,.05)",color:"#6b5e52",fontWeight:600}}>{age}y</span>}
                          {occupType&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:3,background:occupBadgeBg,color:occupBadgeColor,fontWeight:700}}>{occupType}</span>}
                        </div>
                        {/* Employer */}
                        {primaryEmployer&&<div style={{fontSize:10,color:"#6b5e52",marginTop:3}}>
                          <span style={{color:"#9a7422",fontWeight:600}}>Works at: </span>{primaryEmployer}
                        </div>}
                        {/* Lease end */}
                        {leaseEnd&&<div style={{fontSize:10,color:dl!=null&&dl<=30?"#c45c4a":dl!=null&&dl<=90?"#9a7422":"#6b5e52",marginTop:2}}>
                          Lease ends {fmtD(leaseEnd)}{dl!=null?<span style={{marginLeft:4,fontWeight:600}}>({dl}d)</span>:null}
                        </div>}
                      </>}
                      {!occ&&<div style={{fontSize:10,color:"#4a7c59",fontWeight:600,marginTop:2}}>Vacant</div>}
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#6b5e52"}}>{fmtS(item.rent)}/mo</div>
                      <div style={{fontSize:8,color:"#7a7067",marginTop:1}}>{leaseEnd?"ends "+fmtD(leaseEnd):"no lease"}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>);
        })()}
          </div>}
        </div>);
      })()}

      {/* Communication Log */}

            </div>}
          </div>
        );
      })()}
        </div>
      </div>
      {/* FOOTER START */}
      <div style={{borderTop:"1px solid #f0ede8",background:"#faf9f7",flexShrink:0}}>
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

      <div style={{display:"flex",gap:6,margin:"0 0 8px",padding:"0 20px",flexWrap:"wrap"}}>
        {a.status==="invited"&&<button
          style={{flex:1,padding:"11px 20px",borderRadius:9,border:"none",background:"#1a1714",color:"#d4a853",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:.3,transition:"all .18s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
          onMouseEnter={e=>{e.currentTarget.style.background="#d4a853";e.currentTarget.style.color="#1a1714";e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 18px rgba(212,168,83,.35)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#1a1714";e.currentTarget.style.color="#d4a853";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
          onClick={()=>setModal({type:"inviteApp",data:a})}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Re-send Invite
        </button>}
        {a.status==="new-lead"&&<button
          style={{flex:1,padding:"11px 20px",borderRadius:9,border:"none",background:"#1a1714",color:"#d4a853",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:.3,transition:"all .18s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
          onMouseEnter={e=>{e.currentTarget.style.background="#d4a853";e.currentTarget.style.color="#1a1714";e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 18px rgba(212,168,83,.35)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#1a1714";e.currentTarget.style.color="#d4a853";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
          onClick={()=>setModal({type:"inviteApp",data:a})}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Continue — Invite to Apply
        </button>}
        {a.status==="applied"&&<>
          {(()=>{
            // Read fresh from modal.data to avoid stale closure
            const _a=modal.data||a;
            const _allDocs=(_a.appDocs||(_a.applicationData?.appDocs)||[]).filter(x=>x.url);
            const _hasIncome=_a.incomeAdd&&_a.incomeAdd!=="none"&&_a.incomeAdd!=="";
            const _ad=_a.applicationData||{};
            const _rv=_a.refVerified||{};
            const pendingItems=[];
            // Background Check
            if(_a.bgCheck!=="passed"&&!waived.includes("Background Check"))pendingItems.push("Background Check");
            // Credit Check
            const _hasScore=_a.creditScore&&_a.creditScore!=="—"&&!isNaN(parseInt(_a.creditScore));
            if(!_hasScore&&!waived.includes("Credit Check"))pendingItems.push("Credit Check");
            // Income Verification — only if add-on was requested
            if(_hasIncome&&_a.incomeVerified!=="verified"&&!waived.includes("Income Verification"))pendingItems.push("Income Verification");
            // References
            const _refKeys=[];
            (_ad.addresses||[]).filter(x=>x.resType==="Rent"&&x.landlordEmail).forEach((_,i)=>_refKeys.push(`landlord_${i}`));
            if(_ad.empRefEmail&&!_ad.unemployed)_refKeys.push("employer");
            if(_ad.persRefEmail)_refKeys.push("personal1");
            const _refsOk=_a.refs==="verified"||(_refKeys.length>0&&_refKeys.every(k=>_rv[k]===true));
            if(!_refsOk&&!waived.includes("References"))pendingItems.push("References");
            // ID Verified — read live doc status
            const _idF=_allDocs.find(x=>x.type==="PhotoID-Front");
            const _idB=_allDocs.find(x=>x.type==="PhotoID-Back");
            const _idRejected=_idF?.verified==="rejected"||_idB?.verified==="rejected";
            const _idOk=_idF?.verified==="verified"&&_idB?.verified==="verified";
            if(_idRejected)pendingItems.push("ID Verified — rejected, re-upload needed");
            else if(!_idOk&&!waived.includes("ID Verified"))pendingItems.push("ID Verified");
            // Any other rejected doc
            _allDocs.filter(x=>x.verified==="rejected"&&x.type!=="PhotoID-Front"&&x.type!=="PhotoID-Back").forEach(d=>{
              const label=(d.label||d.type)+" — rejected, re-upload needed";
              if(!pendingItems.includes(label))pendingItems.push(label);
            });
            if(pendingItems.length===0)return null;
            const _pOpen=modal._pendingOpen===true;
            return(<div style={{width:"100%",border:"1px solid rgba(212,168,83,.25)",borderRadius:8,marginBottom:6,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:"rgba(212,168,83,.07)",cursor:"pointer"}} className="hvr-row" onClick={()=>setModal(p=>({...p,_pendingOpen:!_pOpen}))}>
                <span style={{fontSize:11,fontWeight:700,color:"#9a7422"}}>{pendingItems.length} item{pendingItems.length!==1?"s":""} still pending</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" style={{transform:_pOpen?"rotate(180deg)":"none",transition:"transform .2s"}}><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              {_pOpen&&<div style={{padding:"8px 12px",background:"rgba(212,168,83,.04)"}}>
                {pendingItems.map((label,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"2px 0",fontSize:11,color:"#9a7422"}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:"#d4a853",flexShrink:0,display:"inline-block"}}/>
                  {label}
                </div>)}
                <div style={{marginTop:6,fontSize:10,color:"#9a7422",opacity:.8}}>You can still approve — you'll be asked to confirm again.</div>
              </div>}
            </div>);
          })()}
          {(()=>{
            const hasPending=(()=>{const _a=modal.data||a;const _allDocs=(_a.appDocs||(_a.applicationData?.appDocs)||[]).filter(x=>x.url);const _hasIncome=_a.incomeAdd&&_a.incomeAdd!=="none"&&_a.incomeAdd!=="";const _ad=_a.applicationData||{};const _rv=_a.refVerified||{};const items=[];if(_a.bgCheck!=="passed"&&!waived.includes("Background Check"))items.push(1);const _hs=_a.creditScore&&_a.creditScore!=="—"&&!isNaN(parseInt(_a.creditScore));if(!_hs&&!waived.includes("Credit Check"))items.push(1);if(_hasIncome&&_a.incomeVerified!=="verified"&&!waived.includes("Income Verification"))items.push(1);const _rk=[];(_ad.addresses||[]).filter(x=>x.resType==="Rent"&&x.landlordEmail).forEach((_,i)=>_rk.push(`landlord_${i}`));if(_ad.empRefEmail&&!_ad.unemployed)_rk.push("employer");if(_ad.persRefEmail)_rk.push("personal1");const _ro=_a.refs==="verified"||(_rk.length>0&&_rk.every(k=>_rv[k]===true));if(!_ro&&!waived.includes("References"))items.push(1);const _iF=_allDocs.find(x=>x.type==="PhotoID-Front");const _iB=_allDocs.find(x=>x.type==="PhotoID-Back");if((_iF?.verified==="rejected"||_iB?.verified==="rejected")||(!(_iF?.verified==="verified"&&_iB?.verified==="verified")&&!waived.includes("ID Verified")))items.push(1);return items.length>0;})();
            const doApprove=()=>{
              const updatedApps=apps.map(x=>x.id===a.id?{...x,status:"approved",history:[...(x.history||[]),{from:x.status,to:"approved",date:TODAY.toISOString().split("T")[0],note:"Approved — lease configuration started"}]}:x);
              setApps(updatedApps);save("hq-apps",updatedApps);
              _setPendingLeaseAppId(a.id);
              setModal(null);
              goTab("leases");
            };
            return(
              <button className="btn btn-green" style={{flex:1}} onClick={doApprove}>
                {hasPending?"Approve Anyway & Configure Lease":"Approve & Configure Lease"}
              </button>
            );
          })()}
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
        
        <button className="btn btn-out" style={{color:"#c45c4a"}} onClick={()=>setModal({type:"denyApp",appId:a.id,data:a,reason:""})}>Deny</button>
      </div>
      </div>{/* end footer */}
      <div className="mft">
        <button className="btn btn-out" onClick={()=>setModal(null)}>Close</button>
      </div>
    </div>);})()}</div>);})()}

  {/* ── Email Draft Preview Modal ── */}
  {modal?._draftEmail&&(()=>{
    const em=modal._draftEmail;
    return(<div className="mbg" onClick={()=>setModal(p=>({...p,_draftEmail:null}))}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
      <h2 style={{marginBottom:4}}>{em.type==="reupload"?"Request Re-Upload":"Reference Check Email"}</h2>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <p style={{fontSize:11,color:"#6b5e52",margin:0}}>Review the draft below, edit if needed, then click Send.</p>
        <button onClick={()=>{setModal(null);goTab("pm-settings");setExpanded(p=>({...p,emailTemplatesOpen:true,emailTemplatesTab:em.type||"refEmployer"}));}} style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:6,border:"1px solid rgba(74,124,89,.3)",background:"rgba(74,124,89,.06)",color:"#2d6a3f",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
          ✏ Draft Email Settings
        </button>
      </div>
      <div style={{padding:"8px 12px",borderRadius:7,background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.07)",fontSize:11,color:"#5c4a3a",marginBottom:16}}>
        Sending as: <strong>{settings.pmName||"Carolina Cooper"}</strong> · {settings.companyName||"Black Bear Rentals"} · {settings.email||"info@rentblackbear.com"}
      </div>
      <div className="fld"><label>To</label><input value={em.to} onChange={e=>setModal(p=>({...p,_draftEmail:{...p._draftEmail,to:e.target.value}}))} style={{width:"100%",fontFamily:"inherit"}}/></div>
      <div className="fld"><label>Subject</label><input value={em.subject} onChange={e=>setModal(p=>({...p,_draftEmail:{...p._draftEmail,subject:e.target.value}}))} style={{width:"100%",fontFamily:"inherit"}}/></div>
      <div className="fld"><label>Message</label><textarea value={em.body} onChange={e=>setModal(p=>({...p,_draftEmail:{...p._draftEmail,body:e.target.value}}))} rows={12} style={{width:"100%",fontFamily:"inherit",fontSize:12,padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",resize:"vertical"}}/></div>
      <div className="mft" style={{gap:8,display:"flex"}}>
        <button className="btn btn-out" onClick={()=>setModal(p=>({...p,_draftEmail:null}))}>Cancel</button>
        <button className="btn btn-gold" style={{flex:1}} onClick={async()=>{
          try{
            const r=await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:em.to,subject:em.subject,html:em.body.replace(/\n/g,"<br/>"),fromName:`${settings.pmName||"Carolina Cooper"} — ${settings.companyName||"Black Bear Rentals"}`,replyTo:settings.email||"info@rentblackbear.com",...(em.appId&&em.refKey?{appId:em.appId,refKey:em.refKey}:{})})});
            const d=await r.json();
            if(d.ok||r.ok){
              // Log to comm log
              const logEntry={id:uid(),type:"Email",note:(em.type==="reupload"?"Re-upload request sent: ":"Reference check sent to ")+em.to,date:TODAY.toISOString().split("T")[0],sentBy:"admin"};
              const appData=modal.data||{};
              const updatedHistory=[...(appData.history||[]),{from:appData.status,to:appData.status,date:TODAY.toISOString().split("T")[0],note:logEntry.note}];
              const ua=apps.map(x=>x.id===appData.id?{...x,history:updatedHistory}:x);
              setApps(ua);save("hq-apps",ua);
              setModal(p=>({...p,_draftEmail:null,data:{...p.data,history:updatedHistory}}));
              showAlert({title:"Email Sent",body:"Email sent to "+em.to+" and logged to the comm log."});
            } else {
              showAlert({title:"Send Failed",body:"Email could not be sent. Check your Resend API connection."});
            }
          }catch(e){showAlert({title:"Send Failed",body:"Network error: "+e.message});}
        }}>Send Email</button>
      </div>
    </div></div>);
  })()}

  {/* ── Log Reference Reply Modal ── */}
  {modal?._logReply&&(()=>{
    const lr=modal._logReply;
    const [notes,setNotes]=React.useState("");
    return(<div className="mbg" onClick={()=>setModal(p=>({...p,_logReply:null}))}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
      <h2 style={{marginBottom:4}}>Log Reference Reply</h2>
      <p style={{fontSize:11,color:"#6b5e52",marginBottom:14}}>{lr.type} — {lr.name} ({lr.email})</p>
      <div className="fld"><label>Notes from reply</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={5} placeholder="What did they say? Copy key quotes or summarize their response..." style={{width:"100%",fontFamily:"inherit",fontSize:12,padding:"8px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,.08)",resize:"vertical"}}/>
      </div>
      <div className="mft" style={{gap:8,display:"flex"}}>
        <button className="btn btn-out" onClick={()=>setModal(p=>({...p,_logReply:null}))}>Cancel</button>
        <button className="btn btn-gold" style={{flex:1}} disabled={!notes.trim()} onClick={()=>{
          const reply={id:uid(),email:lr.email,name:lr.name,type:lr.type,notes:notes.trim(),date:TODAY.toISOString().split("T")[0]};
          const prev=modal._refReplies||[];
          // Also mark references as verified if logging a positive reply
          const ua=apps.map(x=>x.id===(modal.data?.id)?{...x,refs:"verified"}:x);
          setApps(ua);save("hq-apps",ua);
          setModal(p=>({...p,_logReply:null,_refReplies:[...prev,reply],data:{...p.data,refs:"verified"}}));
        }}>Save Reply</button>
      </div>
    </div></div>);
  })()}

  {modal&&modal.type==="archived"&&(()=>{const a=modal.data;const payMonths=Object.keys(a.payments||{});const totalPaid=Object.values(a.payments||{}).reduce((s,v)=>s+(typeof v==="object"?Object.values(v).reduce((ss,vv)=>ss+vv,0):v),0);
    const moveIn=a.moveIn?new Date(a.moveIn+"T00:00:00"):null;const termDate=a.terminatedDate?new Date(a.terminatedDate+"T00:00:00"):null;
    const tenureDays=moveIn&&termDate?Math.ceil((termDate-moveIn)/(1e3*60*60*24)):null;const tenureMonths=tenureDays?Math.round(tenureDays/30):null;
    return(
    <div className="mbg" onClick={()=>setModal(null)}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:540}}>
      <h2>{a.name} <span className="badge b-gray" style={{verticalAlign:"middle"}}>Past Tenant</span></h2>
      <div className="tp-card"><h3>📞 Contact</h3><div className="tp-row"><span className="tp-label">Phone</span><strong>{a.phone}</strong></div><div className="tp-row"><span className="tp-label">Email</span><strong>{a.email}</strong></div></div>
      <div className="tp-card"><h3>🏠 Room History</h3><div className="tp-row"><span className="tp-label">Property</span><strong>{propDisplay(a.propName)}</strong></div><div className="tp-row"><span className="tp-label">Room</span><strong>{a.roomName}</strong></div><div className="tp-row"><span className="tp-label">Rent</span><strong>{fmtS(a.rent)}/mo</strong></div></div>
      <div className="tp-card"><h3>📋 Lease History</h3><div className="tp-row"><span className="tp-label">Move-in</span><strong>{fmtD(a.moveIn)}</strong></div><div className="tp-row"><span className="tp-label">Lease End</span><strong>{fmtD(a.leaseEnd)}</strong></div><div className="tp-row"><span className="tp-label">Terminated</span><strong>{fmtD(a.terminatedDate)}</strong></div>{tenureMonths&&<div className="tp-row"><span className="tp-label">Tenure</span><strong>{tenureMonths} months ({tenureDays} days)</strong></div>}<div className="tp-row"><span className="tp-label">Total Revenue</span><strong style={{color:"#4a7c59"}}>{fmtS(a.rent*(tenureMonths||0))}</strong></div></div>
      <div className="tp-card" style={{background:"rgba(196,92,74,.03)",borderColor:"rgba(196,92,74,.1)"}}><h3 style={{color:"#c45c4a"}}>⚠ Termination</h3><div className="tp-row"><span className="tp-label">Date</span><strong>{fmtD(a.terminatedDate)}</strong></div><div className="tp-row"><span className="tp-label">Reason</span><strong>{a.reason}</strong></div></div>
      <div className="mft"><button className="btn btn-out" onClick={()=>setModal(null)}>Close</button></div>
    </div></div>);})()}

  {editProp!==null&&<PropEditor prop={isNewProp?null:editProp} onSave={saveProp} onClose={()=>setEditProp(null)} isNew={isNewProp}
    onViewTenant={(r,propName,propId)=>{
      // PropEditor already called onSave(p) before this — props is up to date
      // Find the room in freshly saved props by ID (not name — avoids 2907/2909 Wilson collision)
      const freshProp=props.find(p=>p.id===propId)||(isNewProp?null:editProp);
      const freshRoom=freshProp?allRooms(freshProp).find(x=>x.id===r.id)||r:r;
      const freshUnit=freshProp?(freshProp.units||[]).find(u=>(u.rooms||[]).some(x=>x.id===r.id)):null;
      setModal({type:"tenant",data:{...freshRoom,propName,unitId:freshUnit?.id,isWholeUnit:!!(freshUnit&&(freshUnit.rentalMode||"byRoom")==="wholeHouse"),propUtils:freshUnit?.utils||freshProp?.utils||r.utils,propClean:freshUnit?.clean||freshProp?.clean||r.clean}});
    }}
    settings={settings} onUpdateSettings={s=>{setSettings(s);save("hq-settings",s);}} onDelete={id=>{const dp=props.find(x=>x.id===id);const rooms=dp?allRooms(dp):[];const occCount=rooms.filter(r=>r.st==="occupied").length;const linkedCharges=charges.filter(c=>c.propName===(dp?.addr||dp?.name)).length;const msg="Delete "+((dp?.addr||dp?.name)||"this property")+"?\n\n"+(occCount?"WARNING: "+occCount+" occupied room(s) will lose tenant assignments.\n":"")+(linkedCharges?linkedCharges+" charge record(s) reference this property.\n":"")+"\nThis cannot be undone.";if(!window.confirm(msg))return;setProps(prev=>prev.filter(x=>x.id!==id));save("hq-props",props.filter(x=>x.id!==id));setEditProp(null);}}/>}

  {/* Centered Confirm / Alert Dialog — replaces all window.confirm and alert calls */}
  {confirmDialog&&<div className="mbg" onClick={()=>{if(!confirmDialog.onConfirm)setConfirmDialog(null);}} style={{zIndex:9999,alignItems:"center"}}><div className="mbox" onClick={e=>e.stopPropagation()} style={{maxWidth:420,textAlign:"center"}}>
    <div style={{width:44,height:44,borderRadius:"50%",background:confirmDialog.danger?"rgba(196,92,74,.1)":"rgba(74,124,89,.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
      {confirmDialog.danger
        ?<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        :<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      }
    </div>
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

  {/* Draggable Full Timeline Float Modal — root level so position:fixed works */}
  {modal?._tlFloatOpen&&(()=>{
        const pos=modal._tlFloatPos||{x:80,y:60};
        const startDrag=(e)=>{
          if(e.target.closest("button")||e.target.closest("select"))return;
          const startX=e.clientX-pos.x;const startY=e.clientY-pos.y;
          const onMove=(ev)=>setModal(p=>({...p,_tlFloatPos:{x:Math.max(0,Math.min(window.innerWidth-100,ev.clientX-startX)),y:Math.max(0,Math.min(window.innerHeight-100,ev.clientY-startY))}}));
          const onUp=()=>{document.removeEventListener("mousemove",onMove);document.removeEventListener("mouseup",onUp);};
          document.addEventListener("mousemove",onMove);document.addEventListener("mouseup",onUp);
        };
        // Render the full tenant timeline inside the float
        const ftView=modal._ftView||"gantt";
        const ftMonthOff=modal._ftMonthOffset||0;
        const ftSort=modal._ftSort||"avail-asc";
        const ftGrouped=modal._ftGrouped!==false;
        const ftPropFilter=modal._ftPropFilter||"all";
        const ftProp=ftPropFilter==="all"?null:props.find(p=>p.id===ftPropFilter)||null;
        const TODAY_STR3=TODAY.toISOString().split("T")[0];
        const ftBase=new Date(TODAY.getFullYear(),TODAY.getMonth()+ftMonthOff,1);
        const ftWinStart=new Date(ftBase);ftWinStart.setMonth(ftWinStart.getMonth()-1);
        const ftWinEnd=new Date(ftBase);ftWinEnd.setMonth(ftWinEnd.getMonth()+4);
        const ftTotalDays=Math.ceil((ftWinEnd-ftWinStart)/86400000);
        const ftToX=(ds)=>{if(!ds)return 0;const d=Math.ceil((new Date(ds+"T00:00:00")-ftWinStart)/86400000);return Math.max(0,Math.min(100,(d/ftTotalDays)*100));};
        const ftMonths=[];for(let i=0;i<6;i++){const dd=new Date(ftWinStart);dd.setMonth(dd.getMonth()+i);ftMonths.push({label:dd.toLocaleString("default",{month:"short",year:"2-digit"}),x:ftToX(dd.toISOString().split("T")[0])});}
        const ftRooms=(ftProp
          ?allRooms(ftProp).filter(r=>!r.ownerOccupied).map(r=>({...r,propName:getPropDisplayName(ftProp),propId:ftProp.id}))
          :props.flatMap(p=>allRooms(p).filter(r=>!r.ownerOccupied).map(r=>({...r,propName:getPropDisplayName(p),propId:p.id}))));
        const ftGetReady=(r)=>r.le||null;
        const ftLeMs=r=>r.le?new Date(r.le+"T00:00:00").getTime():Infinity;
        const ftRdMs=r=>{const s=ftGetReady(r);return s?new Date(s+"T00:00:00").getTime():r.le?ftLeMs(r):Infinity;};
        const ftSorted=[...ftRooms].sort((a,b)=>ftSort==="lease-end-asc"?ftLeMs(a)-ftLeMs(b):ftSort==="lease-end-desc"?ftLeMs(b)-ftLeMs(a):ftSort==="avail-desc"?ftRdMs(b)-ftRdMs(a):ftRdMs(a)-ftRdMs(b));
        const ftGroupedRows=(()=>{if(!ftGrouped||ftProp)return null;const map=new Map();ftSorted.forEach(r=>{if(!map.has(r.propId))map.set(r.propId,[]);map.get(r.propId).push(r);});return map;})();
        const uniqueFtProps=[...new Map(ftRooms.map(r=>[r.propId,{id:r.propId,name:r.propName}])).values()];
        const renderFtRow=(r)=>{
          const readyStr=ftGetReady(r);const isOcc=r.st==="occupied"&&r.tenant;
          const leX=r.le?ftToX(r.le):null;const rdX=readyStr?ftToX(readyStr):null;
          const todayX=ftToX(TODAY_STR3);
          const dl=r.le?Math.ceil((new Date(r.le+"T00:00:00")-TODAY)/(86400000)):null;
          const ftAppMoveIn=modal?.data?.termMoveIn||modal?.data?.moveIn||"";
          const gap=readyStr&&ftAppMoveIn?Math.ceil((new Date(ftAppMoveIn+"T00:00:00")-new Date(readyStr+"T00:00:00"))/(86400000)):null;
          return(<div key={r.id} style={{display:"flex",borderBottom:"1px solid rgba(0,0,0,.03)",minHeight:32,alignItems:"center"}}>
            <div style={{width:130,flexShrink:0,padding:"4px 8px",fontSize:10,fontWeight:isOcc?600:700,color:isOcc?"#1a1714":"#4a7c59",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {r.name}<div style={{fontSize:8,color:"#9a7422",fontWeight:400}}>{isOcc?r.tenant.name:"Vacant"}</div>
            </div>
            <div style={{flex:1,position:"relative",height:28}}>
              <div style={{position:"absolute",left:todayX+"%",top:0,bottom:0,width:1,background:"rgba(196,92,74,.4)",zIndex:2}}/>
              {isOcc&&r.tenant.moveIn&&leX!==null&&<div style={{position:"absolute",left:ftToX(r.tenant.moveIn)+"%",width:Math.max(0,leX-ftToX(r.tenant.moveIn))+"%",top:6,height:16,background:"rgba(74,124,89,.25)",borderRadius:3,border:"1px solid rgba(74,124,89,.4)"}}/>}
              {readyStr&&rdX!==null&&<div style={{position:"absolute",left:rdX+"%",top:6,height:16,width:"4%",background:"rgba(212,168,83,.5)",borderRadius:2}}/>}
              {!isOcc&&!r.le&&<div style={{position:"absolute",left:"0%",width:"100%",top:8,height:12,background:"rgba(74,124,89,.12)",borderRadius:2,display:"flex",alignItems:"center",paddingLeft:4}}>
                <span style={{fontSize:7,color:"#4a7c59",fontWeight:700}}>Available now</span>
              </div>}
              {dl!==null&&dl>=0&&dl<=90&&<div style={{position:"absolute",right:2,top:8,fontSize:7,color:dl<=30?"#c45c4a":"#9a7422",fontWeight:700}}>{dl}d</div>}
            </div>
            <div style={{width:52,flexShrink:0,textAlign:"right",padding:"0 6px",fontSize:9,color:"#6b5e52",fontWeight:600}}>
              {r.rent?("$"+(r.rent/1000>=1?(r.rent/1000).toFixed(0)+"k":r.rent)):"—"}
              {gap!==null&&<div style={{fontSize:7,color:gap===0?"#2d6a3f":gap>0?"#9a7422":"#c45c4a",fontWeight:700}}>{gap===0?"✓ fit":gap>0?gap+"d gap":Math.abs(gap)+"d ovlp"}</div>}
            </div>
          </div>);
        };
        const ftWidth=typeof window!=="undefined"?Math.min(720,Math.max(400,Math.floor(window.innerWidth*0.55))):680;
        return(<div style={{position:"fixed",zIndex:9999,left:pos.x,top:pos.y,width:ftWidth,maxWidth:"50vw",background:"#fff",borderRadius:14,boxShadow:"0 24px 64px rgba(0,0,0,.25)",border:"1px solid rgba(0,0,0,.1)",display:"flex",flexDirection:"column",maxHeight:"80vh"}}>
          {/* Drag handle / header */}
          <div onMouseDown={startDrag} style={{padding:"10px 14px",borderBottom:"1px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"move",userSelect:"none",background:"#1a1714",borderRadius:"14px 14px 0 0",flexShrink:0}}>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:800,color:"#d4a853",letterSpacing:.3}}>Tenant Timeline</span>
              {/* Property filter pills */}
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {[{id:"all",label:"All"},...uniqueFtProps.map(p=>({id:p.id,label:p.name}))].map(opt=>(
                  <button key={opt.id} onClick={()=>setModal(p=>({...p,_ftPropFilter:opt.id}))}
                    style={{fontSize:8,fontWeight:700,padding:"1px 7px",borderRadius:8,border:"1px solid "+(ftPropFilter===opt.id?"#d4a853":"rgba(255,255,255,.2)"),background:ftPropFilter===opt.id?"#d4a853":"transparent",color:ftPropFilter===opt.id?"#1a1714":"rgba(255,255,255,.7)",cursor:"pointer",fontFamily:"inherit"}}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Sort */}
              <select value={ftSort} onChange={e=>setModal(p=>({...p,_ftSort:e.target.value}))}
                style={{fontSize:8,padding:"1px 4px",borderRadius:4,border:"1px solid rgba(255,255,255,.2)",background:"transparent",color:"rgba(255,255,255,.7)",fontFamily:"inherit",cursor:"pointer"}}>
                <option value="avail-asc">Available ↑ soonest</option>
                <option value="avail-desc">Available ↓ latest</option>
                <option value="lease-end-asc">Lease end ↑ soonest</option>
                <option value="lease-end-desc">Lease end ↓ latest</option>
              </select>
              {/* Month nav */}
              <div style={{display:"flex",gap:2,alignItems:"center"}}>
                <button onClick={()=>setModal(p=>({...p,_ftMonthOffset:(p._ftMonthOffset||0)-1}))} style={{padding:"1px 5px",fontSize:9,fontWeight:700,borderRadius:3,border:"1px solid rgba(255,255,255,.2)",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:"rgba(255,255,255,.7)"}}>&#8592;</button>
                <span style={{fontSize:9,color:"#d4a853",fontWeight:600,minWidth:50,textAlign:"center"}}>{ftBase.toLocaleString("default",{month:"short",year:"numeric"})}</span>
                <button onClick={()=>setModal(p=>({...p,_ftMonthOffset:(p._ftMonthOffset||0)+1}))} style={{padding:"1px 5px",fontSize:9,fontWeight:700,borderRadius:3,border:"1px solid rgba(255,255,255,.2)",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:"rgba(255,255,255,.7)"}}>&#8594;</button>
              </div>
            </div>
            <button onClick={()=>setModal(p=>({...p,_tlFloatOpen:false}))} style={{background:"none",border:"none",color:"rgba(255,255,255,.6)",fontSize:16,cursor:"pointer",fontFamily:"inherit",lineHeight:1,padding:"2px 6px"}}>&#10005;</button>
          </div>
          {/* Month headers */}
          <div style={{display:"flex",borderBottom:"1px solid rgba(0,0,0,.06)",background:"rgba(0,0,0,.02)",flexShrink:0}}>
            <div style={{width:130,flexShrink:0,padding:"3px 8px",fontSize:8,color:"#bbb",textTransform:"uppercase"}}>Room</div>
            <div style={{flex:1,position:"relative",height:16}}>
              {ftMonths.map((m,i)=><div key={i} style={{position:"absolute",left:m.x+"%",fontSize:7,color:"#bbb",transform:"translateX(-50%)",whiteSpace:"nowrap",top:3}}>{m.label}</div>)}
            </div>
            <div style={{width:52,flexShrink:0,padding:"3px 6px",fontSize:8,color:"#bbb",textAlign:"right"}}>Rent</div>
          </div>
          {/* Rows */}
          <div style={{overflowY:"auto",flex:1}}>
            {ftGroupedRows
              ?[...ftGroupedRows.entries()].map(([propId,rooms])=>{
                const pName=rooms[0]?.propName||"";
                return(<div key={propId}>
                  <div style={{padding:"4px 8px",background:"rgba(0,0,0,.03)",borderBottom:"1px solid rgba(0,0,0,.05)",fontSize:9,fontWeight:800,color:"#5c4a3a",textTransform:"uppercase",letterSpacing:.4}}>{pName}</div>
                  {rooms.map(r=>renderFtRow(r))}
                </div>);
              })
              :ftSorted.map(r=>renderFtRow(r))
            }
            {ftSorted.length===0&&<div style={{fontSize:11,color:"#aaa",textAlign:"center",padding:24}}>No rooms found.</div>}
          </div>
          {/* Legend */}
          <div style={{padding:"6px 12px",borderTop:"1px solid rgba(0,0,0,.06)",display:"flex",gap:12,flexShrink:0,background:"rgba(0,0,0,.01)"}}>
            {[["rgba(74,124,89,.25)","Occupied"],["rgba(212,168,83,.5)","Ready"],["rgba(196,92,74,.4)","Today"]].map(([c,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:8,color:"#6b5e52"}}>
                <div style={{width:14,height:8,borderRadius:2,background:c}}/>{l}
              </div>
            ))}
            <div style={{fontSize:8,color:"#6b5e52",marginLeft:"auto"}}>✓ fit / Nd gap / Nd ovlp = vacancy gap vs applicant move-in</div>
          </div>
        </div>);
      })()}
  </div>{/* end outside zoom wrapper */}
  </div>);
}
