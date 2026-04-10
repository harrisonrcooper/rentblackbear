"use client";
import { syncTenantToSupabase } from "@/lib/syncTenant";
import PMSettings from "./components/PMSettings";
import Messages from "./components/MessagesV2";
import Announcements from "./components/Announcements";
import Reports from "./components/Reports";
import PropertiesList from "./components/PropertiesList";
import PortalOpsTab from "./components/PortalOpsTab";
// AccountingTab removed — features moved to Dashboard (anomaly alerts) and Reports (tax prep / lender packet)
import AppSetup from "./components/AppSetup";
import WebsiteSettings from "./components/WebsiteSettings";
import DashboardTab from "./components/DashboardTab";
import PortalPreview from "./components/PortalPreview";
import LeasesTab from "./components/LeasesTab";
import ThemeTab from "./components/ThemeTab";
import PropEditor from "./components/PropEditor";
import ScorecardTab from "./components/ScorecardTab";
import IdeasTab from "./components/IdeasTab";
import MoneyDashboard from "./components/MoneyDashboard";
import Ledger from "./components/Ledger";
import ApplicationsTab from "./components/ApplicationsTab";
import ModalRenderer from "./components/ModalRenderer";
import SmartImporter from "./components/SmartImporter";
import LedgerImporter from "./components/LedgerImporter";
import OnboardingWizard from "./components/OnboardingWizard";
import TenantsTab from "./components/TenantsTab";
import PaymentsTab from "./components/PaymentsTab";
import TenantTimeline from "./components/TenantTimeline";
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
const IconOnboarding=()=><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
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
const DEF_CHARGE_CATS=["Rent","Prorated Rent","Last Month Rent","Utilities","Late Fee","Security Deposit","Cleaning Fee","Damage Charge","Lock Change","Key Replacement","Move-In Fee","Move-Out Fee","Pet Violation","Smoking Violation","Guest Violation"];
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
const DEF_SETTINGS={companyName:"Black Bear Rentals",legalName:"Oak & Main Development LLC",pmName:"Carolina Cooper",phone:"(850) 696-8101",email:"info@rentblackbear.com",pmEmail:"blackbearhousing@gmail.com",city:"Huntsville, Alabama",tagline:"Huntsville's Turnkey Co-Living",heroHeadline:"Your Room Is Ready.",heroSubline:"Everything's Included.",heroDesc:"Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities — all handled.",adminFee:10,reminderTemplate:"Hi {firstName}, this is a friendly reminder that your {category} of {amount} was due on {dueDate}. Please log in to your tenant portal to view your balance and pay: {portalLink}\n\nIf you have already sent payment, please disregard this message. Thank you! — Black Bear Rentals",notifAppReceived:true,notifLeaseSent:true,notifLeaseSigned:true,notifPaymentReceived:true,notifMaintenanceRequest:true,notifPrescreen:true,showPayBadge:true,showAppBadge:true,adminPresetId:"forest",adminAccent:"#4a7c59",adminAccentRgb:"74,124,89",adminFont:"'Plus Jakarta Sans',system-ui,sans-serif",adminZoom:1,m2mIncrease:50,m2mNoticeDays:30,autoReminders:true,mobileTabs:["dashboard","tenants","applications","money"],couplesDefault:false,
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

// Property type → default unit config (kept here — passed as prop to PropertiesList)
const PROP_TYPES={
  SFH:{label:"SFH",units:[{name:"Main",label:""}]},
  Townhome:{label:"Townhome",units:[{name:"Main",label:""}]},
  Duplex:{label:"Duplex",units:[{name:"Unit A",label:"A"},{name:"Unit B",label:"B"}]},
  Triplex:{label:"Triplex",units:[{name:"Unit A",label:"A"},{name:"Unit B",label:"B"},{name:"Unit C",label:"C"}]},
  Fourplex:{label:"Fourplex",units:[{name:"Unit A",label:"A"},{name:"Unit B",label:"B"},{name:"Unit C",label:"C"},{name:"Unit D",label:"D"}]},
  ADU:{label:"ADU (Main + ADU)",units:[{name:"Main House",label:"Main"},{name:"ADU",label:"ADU"}]},
  Apartment:{label:"Apartment",units:[{name:"Unit 1",label:"1"}]},
};

// PropEditor + sub-components (PhotoEditor, PhotoManager, TourSceneManager,
// UtilTemplatesModal, LeasePricingModal, AddExistingTenantModal) extracted to
// ./components/PropEditor.jsx

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
.ob-row-hover:hover{background:rgba(128,128,128,.04)!important}
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
  .mn{left:0!important;padding-bottom:calc(60px + env(safe-area-inset-bottom))}
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
  .mft{flex-wrap:wrap}.mft button{flex:1;min-width:100px;min-height:44px}
  .fld input,.fld select,.fld textarea{font-size:16px!important;padding:10px 12px;min-height:44px}
  .sform-row{grid-template-columns:1fr}
  .pay-tab{padding:10px 12px;font-size:12px!important;min-height:44px}
  .card-bd{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .btn{padding:10px 14px;font-size:11px;min-height:44px}
  .btn-sm{padding:8px 10px;font-size:10px;min-height:44px}
  select,input[type="date"]{font-size:16px!important;min-width:0;min-height:44px}
  input[type="checkbox"],input[type="radio"]{min-width:22px;min-height:22px}
  .sn{min-height:44px}
  .pipe-card{padding:12px 12px 12px 30px;min-height:44px}
  .badge{padding:4px 10px;font-size:9px}
  .st-pill{padding:5px 12px;font-size:10px}
}

/* Small phone */
@media(max-width:420px){
  .kgrid{grid-template-columns:1fr}
  .kpi{padding:10px 8px}
  .kv{font-size:20px}
  .tbar h1{font-size:16px}
  .cnt{padding:10px}
  .pay-tab{padding:8px 6px;font-size:11px!important}
  .btn{font-size:10px;padding:8px 10px}
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
  // acctSubTab/acctSort/acctDrop/acctHideCols removed with Accounting tab
  const[reportPeriod,setReportPeriod]=useState({from:"",to:""});
  const[reportProp,setReportProp]=useState("all");
  const[activeReport,setActiveReport]=useState(null);
  const[expenses,setExpenses]=useState([]);
  const[mortgages,setMortgages]=useState([]);
  const[vendors,setVendors]=useState([]);
  const[improvements,setImprovements]=useState([]);
  const[subcats,setSubcats]=useState(STARTER_SUBCATS_BY_CAT);
  // acctOverviewMode removed with Accounting tab
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
  const[showSmartImport,setShowSmartImport]=useState(false);
  const[showLedgerImport,setShowLedgerImport]=useState(false);
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

  // ── Portal Ops state — data now managed inside PortalOpsTab via direct Supabase writes ──
  const[renewalOffers,setRenewalOffers]=useState([]);
  const[renewalForm,setRenewalForm]=useState({tenantId:"",proposedRent:"",term:"12",note:""});
  const[inspections,setInspections]=useState([]);

  useEffect(()=>{console.log("Admin init starting...");(async()=>{
    try{
    const[p,pay,mt,a,d,t,n,rk,iss,sc,st,th,id,ar,ch,cr,sd,svt,mo,sq,af,ls,lt,ex,mg,vn,im,sbc,dfu,_ro,_insp]=await Promise.all([
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
      // Portal ops data (utility bills, doc requests, amenities, surveys, packages) now loaded inside PortalOpsTab directly from Supabase tables
      db.loadRenewalOffers(),db.loadInspections([])
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
    setAppFields(migratedAf);setLeases(ls);setLeaseTemplates(lt);setLeaseTemplate(lt[0]||null);setExpenses(ex);setMortgages(mg);setVendors(vn);setImprovements(im);setSubcats(Array.isArray(sbc)?STARTER_SUBCATS_BY_CAT:sbc);setDismissedFollowUps(Array.isArray(dfu)?dfu:[]);setRenewalOffers(_ro||[]);setInspections(_insp||[]);setWidgetList(null);
    // Load renewal requests + unread message count
    fetch(SUPA_URL+"/rest/v1/messages?direction=eq.inbound&subject=like.Lease Renewal:*&order=created_at.desc",{headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY}}).then(r=>r.json()).then(d=>{if(Array.isArray(d))setRenewalRequests(d);}).catch(()=>{});
    fetch(SUPA_URL+"/rest/v1/messages?direction=eq.inbound&read=eq.false&select=id",{headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY}}).then(r=>r.json()).then(d=>{if(Array.isArray(d))setUnreadMsgCount(d.length);}).catch(()=>{});
    }catch(e){console.error("Admin init error:",e);}
    // One-time migration: rename "Utility Overage" → "Utilities" on existing charges
    setCharges(prev => {
      const needsMigration = prev.some(c => c.category === "Utility Overage");
      if (!needsMigration) return prev;
      const updated = prev.map(c => c.category === "Utility Overage" ? { ...c, category: "Utilities" } : c);
      save("hq-charges", updated);
      return updated;
    });

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
    // Portal ops data (utility bills, doc requests, amenities, surveys, packages) now saved directly to Supabase tables inside PortalOpsTab
    db.saveInspections(inspections),
    save("hq-dismissed-followups",dismissedFollowUps),
  ]);},800);return()=>clearTimeout(t);}},[props,payments,maint,apps,docs,txns,notifs,rocks,issues,scorecard,settings,theme,ideas,archive,charges,credits,sdLedger,savedThemes,monthly,screenQs,appFields,expenses,mortgages,vendors,improvements,subcats,renewalOffers,inspections,loaded,dismissedFollowUps]);

  // ─── Charge categories (defaults + custom from settings) ──────
  const CHARGE_CATS=useMemo(()=>{const custom=settings?.customChargeCats||[];return[...DEF_CHARGE_CATS,...custom.filter(c=>!DEF_CHARGE_CATS.includes(c))];},[settings?.customChargeCats]);

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
    /* ── Turnover gap calculation ──────────────────────────── */
    const turnoverGaps=[];
    const todayStr=TODAY.toISOString().split("T")[0];
    props.forEach(pr=>(pr.units||[]).forEach(u=>{
      (u.rooms||[]).forEach(r=>{
        if(!r.incomingTenant||!r.le||!r.incomingTenant.moveIn)return;
        const leEnd=r.le;const moveIn=r.incomingTenant.moveIn;
        if(moveIn>leEnd){
          const gapDays=Math.ceil((new Date(moveIn+"T00:00:00")-new Date(leEnd+"T00:00:00"))/(1e3*60*60*24));
          const dailyRent=Math.round((r.rent||0)/30);
          const gapCost=dailyRent*gapDays;
          turnoverGaps.push({roomId:r.id,roomName:r.name,propName:pr.addr||pr.name,currentTenant:r.tenant?.name||"",incomingTenant:r.incomingTenant.name,leaseEnd:leEnd,moveIn,gapDays,dailyRent,gapCost,rent:r.rent||0});
        }
      });
    }));
    const turnoverGapDays=turnoverGaps.reduce((s,g)=>s+g.gapDays,0);
    const turnoverGapCost=turnoverGaps.reduce((s,g)=>s+g.gapCost,0);

    const openMaint=maint.filter(x=>x.status!=="resolved").length;
    const activeApps=apps.length;
    const unreadNotifs=notifs.filter(x=>!x.read).length;
    const propBreakdown=props.map(pr=>{const rooms=allRooms(pr);const occR=rooms.filter(r=>r.st==="occupied");const vacR=rooms.filter(r=>r.st!=="occupied");
      const prjR=occR.reduce((s,r)=>s+r.rent,0);const fullR=rooms.reduce((s,r)=>s+r.rent,0);
      const collR=occR.reduce((s,r)=>s+((payments[r.id]&&payments[r.id][MO])||0),0);
      return{...pr,occCount:occR.length,vacCount:vacR.length,projected:prjR,fullOcc:fullR,collected:collR,occRooms:occR,vacRooms:vacR};
    });
    const needsAttention=apps.filter(a=>["new-lead","applied"].includes(a.status)).length;return{total,occ,full,proj,coll,due,vacs,expiring,unpaid,paid,openMaint,activeApps,unreadNotifs,needsAttention,propBreakdown,
      turnoverGaps,turnoverGapDays,turnoverGapCost,
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
            const dueDay=r.recurringDueDay||1;
            createCharge({roomId:r.id,tenantName:r.tenant.name,propName:pr.name,roomName:r.name,category:"Rent",desc:`${moLabel} Rent`,amount:r.rent,dueDate:`${mk}-${String(dueDay).padStart(2,"0")}`,sent:true,sentDate:TODAY.toISOString().split("T")[0]});
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
    ...(settings.onboardingActive?[{id:"onboarding",i:<IconOnboarding/>,l:"Onboarding",badge:null}]:[]),
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
    {id:"money",i:<IconDollar/>,l:"Money"},
    {id:"ledger",i:<IconBook/>,l:"Ledger"},
    // accounting tab removed
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
    // add-expense shortcut removed (use Ledger > Expenses instead)
  ];

  // Default sidebar config — can be customized per PM
  const DEF_SIDEBAR=[
    {label:"Overview",ids:["dashboard"]},
    {label:"Traction",ids:["scorecard","rocks","issues"]},
    {label:"Leasing",ids:["applications","app-setup"]},
    {label:"Tenants",ids:["tenants","portal","payments","timeline","portal-ops"]},
    {label:"Operations",ids:["maintenance"]},
    {label:"Documents",ids:["leases","documents"]},
    {label:"Financials",ids:["money","ledger","reports"]},
    {label:"Portfolio",ids:["properties"]},
    {label:"Communications",ids:["messages","announcements","notifications"]},
    {label:"Settings",ids:["pm-settings","theme"]},
    {label:"Website",ids:["website","ideas"]},
  ];
  const rawSidebarConfig=settings.sidebarConfig||DEF_SIDEBAR;
  const sidebarConfig=(()=>{
    // Migrate old IDs to new ones
    const ID_MAP={"site-settings":"pm-settings","settings_dummy":null,"configuration":"app-setup","accounting":"money","add-expense":null};
    let cfg=rawSidebarConfig.map(s=>({...s,ids:s.ids.map(id=>ID_MAP[id]!==undefined?ID_MAP[id]:id).filter(Boolean)})).filter(s=>s.ids.length>0);
    const allIds=()=>cfg.flatMap(s=>s.ids);
    // Inject missing tabs into sensible locations
    // add-expense injection removed with accounting tab
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
    // Auto-inject onboarding tab after dashboard when active
    if(settings.onboardingActive&&!allIds().includes("onboarding")){
      const dashSec=cfg.findIndex(s=>s.ids.includes("dashboard"));
      if(dashSec>=0){const di=cfg[dashSec].ids.indexOf("dashboard");cfg[dashSec].ids.splice(di+1,0,"onboarding");}
      else cfg.unshift({label:"Setup",ids:["onboarding"]});
    }
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
    const result=[];
    (u.rooms||[]).forEach(r=>{
      if(r.ownerOccupied)return;
      if(r.tenant)result.push({...r,propName:p.addr||p.name,propId:p.id,unitId:u.id,unitName:u.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,isWholeUnit:false});
      /* Include incoming future tenants as virtual entries so they appear in the Future tab */
      if(r.incomingTenant){
        result.push({...r,id:r.id+"_incoming",tenant:r.incomingTenant,rent:r.incomingTenant.rent||r.rent,le:r.incomingTenant.leaseEnd||"",propName:p.addr||p.name,propId:p.id,unitId:u.id,unitName:u.name,propUtils:u.utils||p.utils,propClean:u.clean||p.clean,isWholeUnit:false,isIncoming:true});
      }
    });
    return result;
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
          // accounting icon removed
          maintenance:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
          payments:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
          timeline:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="6" height="4" rx="1"/><rect x="3" y="10" width="10" height="4" rx="1"/><rect x="3" y="16" width="7" height="4" rx="1"/><line x1="12" y1="6" x2="21" y2="6"/><line x1="16" y1="12" x2="21" y2="12"/><line x1="13" y1="18" x2="21" y2="18"/></svg>,
          leases:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
          properties:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
          reports:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
        };
        const TAB_LABELS={dashboard:"Dashboard",tenants:"Tenants",applications:"Apply",maintenance:"Maint.",payments:"Ledger",timeline:"Timeline",leases:"Leases",properties:"Portfolio",reports:"Reports",money:"Money"};
        const mobTabs=(settings.mobileTabs||["dashboard","tenants","applications","money"]).slice(0,4);
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
            // add-expense shortcut removed
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
      <div className="tbar"><div><h1><span style={{color:"#d4a853",display:"flex",alignItems:"center"}}>{(tabs.find(t=>t.id===tab)||{}).i}</span> {(tabs.find(t=>t.id===tab)||{}).l}</h1><div className="tbar-sub">{MO}</div></div><div id="tbar-morph-slot" style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}></div></div>
      <div className="cnt">

      {/* ═══ ONBOARDING ═══ */}
      {tab==="onboarding"&&<OnboardingWizard
        props={props} setProps={setProps} charges={charges} setCharges={setCharges}
        sdLedger={sdLedger} setSdLedger={setSdLedger}
        settings={settings} setSettings={setSettings}
        leases={leases} setLeases={setLeases}
        save={save} uid={uid} createCharge={createCharge} TODAY={TODAY}
        allTenants={allTenants} goTab={goTab}
        supa={supa} showConfirm={showConfirm}
        onComplete={()=>{/* wizard handles settings save internally */}}
      />}

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
      {tab==="tenants"&&<TenantsTab
        allTenants={allTenants} archive={archive} props={props} settings={settings}
        payments={payments} obStatuses={obStatuses} renewalRequests={renewalRequests}
        charges={charges} uid={uid} leases={leases} maint={maint}
        tenantSearch={tenantSearch} setTenantSearch={setTenantSearch}
        tenantPropFilter={tenantPropFilter} setTenantPropFilter={setTenantPropFilter}
        tenantSel={tenantSel} setTenantSel={setTenantSel}
        drill={drill} setDrill={setDrill}
        setModal={setModal} setArchive={setArchive} setProps={setProps} setCharges={setCharges}
        setPayments={setPayments} setMaint={setMaint} setLeases={setLeases} setNotifs={setNotifs}
        createCharge={createCharge}
        setTenantProfileTab={setTenantProfileTab} setPiState={setPiState}
        fmtD={fmtD} fmtS={fmtS} getPropDisplayName={getPropDisplayName}
        TODAY={TODAY} MO={MO}
        onSmartImport={()=>setShowSmartImport(true)}
      />}

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
      {tab==="payments"&&<PaymentsTab
        payPeriod={payPeriod} setPayPeriod={setPayPeriod} paySubTab={paySubTab} setPaySubTab={setPaySubTab}
        payFilters={payFilters} setPayFilters={setPayFilters} expCharge={expCharge} setExpCharge={setExpCharge}
        depFilters={depFilters} setDepFilters={setDepFilters}
        setModal={setModal} setCharges={setCharges} setViewingLease={setViewingLease}
        setTenantProfileTab={setTenantProfileTab} setSettings={setSettings}
        settings={settings} charges={charges} props={props} leases={leases} sdLedger={sdLedger}
        m={m} allTenants={allTenants} occLeases={occLeases}
        getChargesForPeriod={getChargesForPeriod} chargeStatus={chargeStatus}
        fmtD={fmtD} fmtS={fmtS} getPropDisplayName={getPropDisplayName} propDisplay={propDisplay}
        roomSubLine={roomSubLine} allRooms={allRooms} openCreateCharge={openCreateCharge} GRACE={GRACE}
        CHARGE_CATS={CHARGE_CATS}
      />}

      {/* ═══ TENANT TIMELINE ═══ */}
      {tab==="timeline"&&<TenantTimeline
        props={props} settings={settings} setSettings={setSettings} save={save} TODAY={TODAY}
        ttView={ttView} setTtView={setTtView} ttPref={ttPref} setTtPref={setTtPref}
        ttPropFilter={ttPropFilter} setTtPropFilter={setTtPropFilter}
        ttSort={ttSort} setTtSort={setTtSort}
        ttMonthOffset={ttMonthOffset} setTtMonthOffset={setTtMonthOffset}
        ttGanttGrouped={ttGanttGrouped} setTtGanttGrouped={setTtGanttGrouped}
        setTenantProfileTab={setTenantProfileTab} setModal={setModal}
        getPropDisplayName={getPropDisplayName} fmtD={fmtD} goTab={goTab}
      />}

      {/* ═══ APPLICATIONS ═══ */}
      {tab==="applications"&&<ApplicationsTab
        apps={apps} setApps={setApps} props={props} settings={settings} setSettings={setSettings}
        charges={charges} leases={leases} setLeases={setLeases} archive={archive} obStatuses={obStatuses}
        renewalRequests={renewalRequests} dismissedFollowUps={dismissedFollowUps}
        setDismissedFollowUps={setDismissedFollowUps} expanded={expanded} setExpanded={setExpanded}
        modal={modal} setModal={setModal} bulkSel={bulkSel} setBulkSel={setBulkSel}
        appSearch={appSearch} setAppSearch={setAppSearch} appView={appView} setAppView={setAppView}
        appKpiFilter={appKpiFilter} setAppKpiFilter={setAppKpiFilter}
        portalLinkToken={portalLinkToken} setPortalLinkToken={setPortalLinkToken}
        portalLinkLoading={portalLinkLoading} setPortalLinkLoading={setPortalLinkLoading}
        setPiState={setPiState} goTab={goTab} setPaySubTab={setPaySubTab}
        payFilters={payFilters} setPayFilters={setPayFilters}
        save={save} fmtD={fmtD} fmtS={fmtS} allRooms={allRooms} findRoom={findRoom}
        getPropDisplayName={getPropDisplayName} chargeStatus={chargeStatus}
        TODAY={TODAY} uid={uid} showAlert={showAlert} showConfirm={showConfirm}
        createCharge={createCharge} setProps={setProps} setNotifs={setNotifs} setCharges={setCharges}
      />}

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

      {/* ═══ MONEY DASHBOARD ═══ */}
      {tab==="money"&&<MoneyDashboard charges={charges} expenses={expenses} credits={credits} sdLedger={sdLedger} mortgages={mortgages} props={props} settings={settings} vendors={vendors} improvements={improvements} goTab={goTab} setModal={setModal} createCharge={createCharge} TODAY={TODAY} />}

      {/* ═══ LEDGER ═══ */}
      {tab==="ledger"&&<>
        <div className="sec-hd"><div><h2>Ledger</h2></div><div style={{display:"flex",gap:8,alignItems:"center"}}><button className="btn btn-out" onClick={()=>setShowLedgerImport(true)} style={{fontSize:12,display:"flex",alignItems:"center",gap:4}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Import Charges</button></div></div>
        <Ledger charges={charges} expenses={expenses} credits={credits} sdLedger={sdLedger} mortgages={mortgages} improvements={improvements} props={props} vendors={vendors} settings={settings} subcats={subcats} TODAY={TODAY} setCharges={setCharges} setExpenses={setExpenses} setCredits={setCredits} setVendors={setVendors} setMortgages={setMortgages} setImprovements={setImprovements} setSubcats={setSubcats} createCharge={createCharge} recordPayment={recordPayment} setModal={setModal} uid={uid} adminGoTab={goTab} CHARGE_CATS={CHARGE_CATS} SCHED_E_CATS={SCHED_E_CATS} IMPROVEMENT_TYPES={IMPROVEMENT_TYPES} />
      </>}

      {/* Accounting tab removed — features in Dashboard + Reports */}
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
      {tab==="properties"&&<PropertiesList settings={settings} properties={props} setProperties={setProps} payments={payments} leaseableItems={leaseableItems} expanded={expanded} setExpanded={setExpanded} editProp={editProp} setEditProp={setEditProp} setIsNewProp={setIsNewProp} setTab={setTab} setModal={setModal} setBulkSel={setBulkSel} fmtS={fmtS} fmtD={fmtD} PROP_TYPES={PROP_TYPES} getPropDisplayName={getPropDisplayName} TODAY={TODAY} MO={MO} save={save} charges={charges} showConfirm={showConfirm} onDeleteProp={id=>{setProps(prev=>{const next=prev.filter(x=>x.id!==id);save("hq-props",next);return next;});setEditProp(null);}} />}

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
        setRocks={setRocks} setMaint={setMaint} setImprovements={setImprovements} setIssues={setIssues} setExpenses={setExpenses}
        showConfirm={showConfirm}
      />}

      {tab==="portal-ops"&&<PortalOpsTab settings={settings} properties={props} allTenants={allTenants} onDirtyChange={(dirty)=>{if(dirty&&templateEditorDirty)return;/* portal ops dirty tracking */}} />}

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
  {showSmartImport&&<SmartImporter props={props} setProps={setProps} settings={settings} uid={uid} createCharge={createCharge} setCharges={setCharges} setNotifs={setNotifs} setSdLedger={setSdLedger} setArchive={setArchive} charges={charges} TODAY={TODAY} onClose={()=>setShowSmartImport(false)} goTab={goTab} onImportComplete={()=>{const u={...settings,onboardingActive:true};setSettings(u);save("hq-settings",u);}} />}
  {showLedgerImport&&<LedgerImporter props={props} setProps={setProps} settings={settings} setSettings={setSettings} charges={charges} setCharges={setCharges} setSdLedger={setSdLedger} setNotifs={setNotifs} createCharge={createCharge} uid={uid} TODAY={TODAY} onClose={()=>setShowLedgerImport(false)} goTab={goTab} CHARGE_CATS={CHARGE_CATS} archive={archive} setArchive={setArchive} />}

  <ModalRenderer
    modal={modal} setModal={setModal}
    apps={apps} setApps={setApps}
    props={props} setProps={setProps}
    settings={settings} setSettings={setSettings}
    charges={charges} setCharges={setCharges}
    credits={credits} setCredits={setCredits}
    sdLedger={sdLedger} setSdLedger={setSdLedger}
    leases={leases} setLeases={setLeases}
    payments={payments}
    expenses={expenses} setExpenses={setExpenses}
    improvements={improvements} setImprovements={setImprovements}
    mortgages={mortgages} setMortgages={setMortgages}
    vendors={vendors} setVendors={setVendors}
    subcats={subcats} setSubcats={setSubcats}
    ideas={ideas} setIdeas={setIdeas}
    notifs={notifs} setNotifs={setNotifs}
    archive={archive}
    savedThemes={savedThemes} setSavedThemes={setSavedThemes}
    theme={theme}
    docs={docs}
    renewalOffers={renewalOffers} setRenewalOffers={setRenewalOffers}
    renewalForm={renewalForm} setRenewalForm={setRenewalForm}
    renewalRequests={renewalRequests}
    inspections={inspections}
    occLeases={occLeases}
    tenantProfileTab={tenantProfileTab} setTenantProfileTab={setTenantProfileTab}
    portalInviteState={portalInviteState} setPortalInviteState={setPortalInviteState}
    piState={piState} setPiState={setPiState}
    bulkSel={bulkSel} setBulkSel={setBulkSel}
    expanded={expanded} setExpanded={setExpanded}
    showConfetti={showConfetti} setShowConfetti={setShowConfetti}
    obStatuses={obStatuses} setObStatuses={setObStatuses}
    leaseTemplate={leaseTemplate}
    viewingLease={viewingLease} setViewingLease={setViewingLease}
    expCharge={expCharge} setExpCharge={setExpCharge}
    payFilters={payFilters} setPayFilters={setPayFilters}
    chargeStatus={chargeStatus}
    createCharge={createCharge}
    recordPayment={recordPayment}
    waiveCharge={waiveCharge}
    shakeModal={shakeModal}
    showAlert={showAlert}
    goTab={goTab}
    getPropDisplayName={getPropDisplayName}
    propDisplay={propDisplay}
    confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog}
    CHARGE_CATS={CHARGE_CATS}
  />


  {editProp!==null&&<PropEditor prop={isNewProp?null:editProp} onSave={saveProp} onClose={()=>setEditProp(null)} isNew={isNewProp}
    showAlert={showAlert} showConfirm={showConfirm}
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

  </div>{/* end outside zoom wrapper */}
  </div>);
}
