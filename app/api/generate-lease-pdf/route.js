import { NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from "@react-pdf/renderer";

const SUPA_URL="https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";

const supa=async(path)=>{
  const r=await fetch(SUPA_URL+"/rest/v1/"+path,{headers:{"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY}});
  return r.json();
};

const fmtD=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;};
const fmtS=n=>n?"$"+Number(n).toLocaleString():"—";

const fillVars=(html,vars)=>{
  if(!html)return"";
  let out=html;
  Object.entries(vars).forEach(([k,v])=>{out=out.replaceAll("{{"+k+"}}",(v||"").toString());});
  // Strip HTML tags for PDF text rendering
  out=out.replace(/<strong>(.*?)<\/strong>/gi,"$1");
  out=out.replace(/<\/?[^>]+(>|$)/g," ");
  out=out.replace(/\s+/g," ").trim();
  return out;
};

// ── Styles ───────────────────────────────────────────────────────────
const S=StyleSheet.create({
  page:{backgroundColor:"#ffffff",paddingTop:48,paddingBottom:64,paddingHorizontal:56,fontFamily:"Helvetica"},
  // Header
  docHeader:{textAlign:"center",marginBottom:24,paddingBottom:16,borderBottomWidth:1.5,borderBottomColor:"#1a1714"},
  company:{fontSize:18,fontFamily:"Helvetica-Bold",color:"#1a1714",marginBottom:3},
  docTitle:{fontSize:10,color:"#6b5e52",letterSpacing:1,textTransform:"uppercase"},
  docDate:{fontSize:9,color:"#9a8878",marginTop:3},
  // Parties
  partiesRow:{flexDirection:"row",gap:12,marginBottom:20},
  partyBox:{flex:1,padding:10,backgroundColor:"#f9f8f6",borderWidth:0.5,borderColor:"rgba(0,0,0,0.1)",borderRadius:4},
  partyLabel:{fontSize:7,fontFamily:"Helvetica-Bold",color:"#6b5e52",textTransform:"uppercase",letterSpacing:0.8,marginBottom:3},
  partyName:{fontSize:11,fontFamily:"Helvetica-Bold",color:"#1a1714"},
  partyDetail:{fontSize:9,color:"#6b5e52",marginTop:1},
  // Summary table
  summaryHeader:{flexDirection:"row",alignItems:"center",backgroundColor:"#1a1714",padding:"8 12",borderRadius:"4 4 0 0",marginBottom:0},
  summaryTitle:{fontSize:8,fontFamily:"Helvetica-Bold",color:"#d4a853",textTransform:"uppercase",letterSpacing:1},
  summaryRow:{flexDirection:"row",borderBottomWidth:0.5,borderBottomColor:"rgba(0,0,0,0.06)"},
  summaryLabel:{width:"35%",padding:"6 12",fontSize:8,fontFamily:"Helvetica-Bold",color:"#5c4a3a",textTransform:"uppercase",letterSpacing:0.3},
  summaryValue:{flex:1,padding:"6 8",fontSize:10,color:"#1a1714"},
  summaryRef:{width:60,padding:"6 12 6 4",fontSize:8,color:"#9a8878",textAlign:"right"},
  // Sections
  sectionWrap:{marginBottom:20},
  sectionHeader:{flexDirection:"row",alignItems:"center",gap:8,marginBottom:6,paddingBottom:4,borderBottomWidth:0.5,borderBottomColor:"rgba(0,0,0,0.08)"},
  sectionNum:{width:18,height:18,borderRadius:9,backgroundColor:"#1a1714",color:"#d4a853",fontSize:8,fontFamily:"Helvetica-Bold",textAlign:"center",paddingTop:4},
  sectionTitle:{fontSize:11,fontFamily:"Helvetica-Bold",color:"#1a1714",textTransform:"uppercase",letterSpacing:0.3},
  sectionContent:{fontSize:10,color:"#2c2420",lineHeight:1.7,paddingLeft:26},
  // Initials
  initialsRow:{flexDirection:"row",gap:16,marginTop:8,paddingLeft:26},
  initialBox:{flexDirection:"column",alignItems:"flex-start"},
  initialImg:{height:20,width:70,objectFit:"contain"},
  initialLabel:{fontSize:7,color:"#4a7c59",fontFamily:"Helvetica-Bold",marginTop:1},
  initialDate:{fontSize:7,color:"#9a8878",marginTop:1},
  initialLine:{width:70,borderBottomWidth:0.5,borderBottomColor:"rgba(0,0,0,0.3)",height:20,marginBottom:2},
  initialPlaceholder:{fontSize:7,color:"#9a8878",fontStyle:"italic"},
  // Signatures
  sigBlock:{flexDirection:"row",gap:32,marginTop:32,paddingTop:16,borderTopWidth:1,borderTopColor:"#1a1714"},
  sigCol:{flex:1},
  sigLabel:{fontSize:8,fontFamily:"Helvetica-Bold",color:"#6b5e52",textTransform:"uppercase",letterSpacing:0.8,marginBottom:6},
  sigImg:{height:40,width:160,objectFit:"contain",marginBottom:4},
  sigLine:{width:"100%",borderBottomWidth:0.5,borderBottomColor:"#1a1714",height:40,marginBottom:4},
  sigName:{fontSize:10,fontFamily:"Helvetica-Bold",color:"#1a1714"},
  sigDate:{fontSize:8,color:"#6b5e52",marginTop:1},
  // Page number
  pageNum:{position:"absolute",bottom:24,right:56,fontSize:8,color:"#bbb"},
  divider:{borderBottomWidth:0.5,borderBottomColor:"rgba(0,0,0,0.08)",marginBottom:20},
});

// ── PDF Document ─────────────────────────────────────────────────────
function LeasePDF({lease,template,vars}){
  const activeSections=(template?.sections||[]).filter(s=>s.active!==false);
  const company=lease.companyName||"Black Bear Rentals";
  const templateName=template?.name||"Alabama Co-Living Lease Agreement";

  return(
    <Document title={`${lease.tenantName} — Lease Agreement`}>
      <Page size="LETTER" style={S.page}>

        {/* Header */}
        <View style={S.docHeader}>
          <Text style={S.company}>{company}</Text>
          <Text style={S.docTitle}>{templateName}</Text>
          <Text style={S.docDate}>Agreement Date: {fmtD(new Date().toISOString().split("T")[0])}</Text>
        </View>

        {/* Parties */}
        <View style={S.partiesRow}>
          <View style={S.partyBox}>
            <Text style={S.partyLabel}>Property Manager</Text>
            <Text style={S.partyName}>{lease.landlordName||"Carolina Cooper"}</Text>
            <Text style={S.partyDetail}>{company}</Text>
          </View>
          <View style={S.partyBox}>
            <Text style={S.partyLabel}>Resident</Text>
            <Text style={S.partyName}>{lease.tenantName||""}</Text>
            <Text style={S.partyDetail}>{lease.propertyAddress||lease.property||""} · {lease.room||""}</Text>
          </View>
        </View>

        {/* Summary table */}
        <View style={{marginBottom:24,borderWidth:0.5,borderColor:"rgba(0,0,0,0.1)",borderRadius:4,overflow:"hidden"}}>
          <View style={S.summaryHeader}>
            <Text style={S.summaryTitle}>Lease Summary</Text>
          </View>
          {[
            ["Tenant",lease.tenantName||"—",""],
            ["Property Address",lease.propertyAddress||lease.property||"—","Section 1"],
            ["Room / Unit",lease.room||"—","Section 1"],
            ["Lease Start",fmtD(lease.leaseStart||lease.moveIn),"Section 2"],
            ["Lease End",fmtD(lease.leaseEnd),"Section 2"],
            ["Monthly Rent",fmtS(lease.rent),"Section 3"],
            ["Security Deposit",fmtS(lease.sd),"Section 4"],
            ["Prorated First Month",lease.proratedRent&&lease.proratedRent>0?fmtS(lease.proratedRent):"N/A","Section 3"],
            ["Late Fee","$50 after the 3rd · $5/day thereafter","Section 5"],
            ["Door Code",lease.doorCode||"—","Section 13"],
            ["Parking",lease.parking||"No assigned parking","Section 9"],
          ].map(([label,value,ref],i)=>(
            <View key={label} style={[S.summaryRow,{backgroundColor:i%2===0?"#fff":"rgba(0,0,0,0.012)"}]}>
              <Text style={S.summaryLabel}>{label}</Text>
              <Text style={S.summaryValue}>{value}</Text>
              <Text style={S.summaryRef}>{ref}</Text>
            </View>
          ))}
        </View>

        <View style={S.divider}/>

        {/* Sections */}
        {activeSections.map((sec,i)=>(
          <View key={sec.id||i} style={S.sectionWrap} wrap={false}>
            <View style={S.sectionHeader}>
              <View style={S.sectionNum}><Text style={{color:"#d4a853",fontSize:8,fontFamily:"Helvetica-Bold",textAlign:"center"}}>{i+1}</Text></View>
              <Text style={S.sectionTitle}>{sec.title}</Text>
            </View>
            <Text style={S.sectionContent}>{fillVars(sec.content||"",vars)}</Text>
            {sec.requiresInitials&&(
              <View style={S.initialsRow}>
                {/* Tenant initials */}
                <View style={S.initialBox}>
                  {lease.tenantSig
                    ?<><Image src={lease.tenantSig} style={S.initialImg}/><Text style={S.initialLabel}>TENANT INITIALED</Text><Text style={S.initialDate}>{lease.tenantName}{lease.tenantSignedAt?" · "+new Date(lease.tenantSignedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}</Text></>
                    :<><View style={S.sigLine}/><Text style={S.initialPlaceholder}>Tenant initials</Text></>
                  }
                </View>
                {/* PM initials */}
                {(lease.landlordSig||lease.landlordSignature)&&(
                  <View style={S.initialBox}>
                    <Image src={lease.landlordSig||lease.landlordSignature} style={S.initialImg}/>
                    <Text style={S.initialLabel}>PM INITIALED</Text>
                    <Text style={S.initialDate}>{lease.landlordName||"Carolina Cooper"}{lease.landlordSignedAt?" · "+new Date(lease.landlordSignedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

        {/* Signatures */}
        <View style={S.sigBlock}>
          <View style={S.sigCol}>
            <Text style={S.sigLabel}>Property Manager</Text>
            {(lease.landlordSig||lease.landlordSignature)
              ?<Image src={lease.landlordSig||lease.landlordSignature} style={S.sigImg}/>
              :<View style={S.sigLine}/>
            }
            <Text style={S.sigName}>{lease.landlordName||"Carolina Cooper"}</Text>
            {lease.landlordSignedAt&&<Text style={S.sigDate}>Signed {new Date(lease.landlordSignedAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</Text>}
          </View>
          <View style={S.sigCol}>
            <Text style={S.sigLabel}>Tenant / Resident</Text>
            {lease.tenantSig
              ?<Image src={lease.tenantSig} style={S.sigImg}/>
              :<View style={S.sigLine}/>
            }
            <Text style={S.sigName}>{lease.tenantName||""}</Text>
            {lease.tenantSignedAt&&<Text style={S.sigDate}>Signed {new Date(lease.tenantSignedAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</Text>}
          </View>
        </View>

        {/* Page number */}
        <Text style={S.pageNum} render={({pageNumber,totalPages})=>`Page ${pageNumber} of ${totalPages}`} fixed/>
      </Page>
    </Document>
  );
}

// ── API Route ─────────────────────────────────────────────────────────
export async function GET(request){
  const {searchParams}=new URL(request.url);
  const leaseId=searchParams.get("id");
  if(!leaseId)return NextResponse.json({error:"Missing lease id"},{status:400});

  try{
    // Fetch lease instance
    const rows=await supa("lease_instances?id=eq."+leaseId+"&select=*");
    if(!rows||rows.length===0)return NextResponse.json({error:"Lease not found"},{status:404});
    const row=rows[0];
    const lease={...(row.variable_data||{}),id:row.id,status:row.status,
      landlordSig:row.landlord_sig,landlordSignature:row.landlord_sig,
      landlordSignedAt:row.landlord_signed_at,tenantSig:row.tenant_sig,
      tenantSignedAt:row.tenant_signed_at};

    // Fetch template
    const templates=await supa("lease_templates?id=eq."+row.template_id+"&select=sections,name");
    const template=templates&&templates.length>0?templates[0]:null;

    // Build vars
    const fmtDLocal=d=>{if(!d)return"—";const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;};
    const vars={
      TENANT_NAME:lease.tenantName||"",
      MONTHLY_RENT:lease.rent?Number(lease.rent).toLocaleString():"",
      RENT_WORDS:lease.rentWords||"",
      SECURITY_DEPOSIT:lease.sd?Number(lease.sd).toLocaleString():"",
      LEASE_START:fmtDLocal(lease.leaseStart||lease.moveIn),
      LEASE_END:fmtDLocal(lease.leaseEnd),
      MOVE_IN_DATE:fmtDLocal(lease.moveIn),
      PROPERTY_ADDRESS:lease.propertyAddress||lease.property||"",
      ROOM_NAME:lease.room||"",
      DOOR_CODE:lease.doorCode||"",
      UTILITIES_CLAUSE:lease.utilitiesClause||"",
      LANDLORD_NAME:lease.landlordName||"Carolina Cooper",
      PARKING_SPACE:lease.parking||"No assigned parking",
      DAILY_RATE:lease.rent?Math.ceil(Number(lease.rent)/30):"",
      PRORATED_RENT:lease.proratedRent?Number(lease.proratedRent).toLocaleString():"",
    };

    // Generate PDF
    const doc=<LeasePDF lease={lease} template={template} vars={vars}/>;
    const pdfBuffer=await pdf(doc).toBuffer();

    const filename=`lease-${(lease.tenantName||"tenant").replace(/\s+/g,"-").toLowerCase()}-${leaseId}.pdf`;

    return new Response(pdfBuffer,{
      headers:{
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename="${filename}"`,
      }
    });
  }catch(e){
    console.error("PDF generation error:",e);
    return NextResponse.json({error:e.message},{status:500});
  }
}
