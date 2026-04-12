import { NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, renderToBuffer, Image } from "@react-pdf/renderer";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { getSettings } from "@/lib/getSettings";

// ── Runtime ──────────────────────────────────────────────────────────
// @react-pdf/renderer relies on Node built-ins (stream, zlib, fs shims),
// so this route MUST run on the Node.js runtime — not Edge.
export const runtime = "nodejs";
// The lease data is live; never cache.
export const dynamic = "force-dynamic";

// ── Supabase (env-based — matches app/api/webhooks/stripe/route.js) ──
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function supa(path) {
  const r = await fetch(SUPA_URL + "/rest/v1/" + path, {
    headers: { apikey: SUPA_KEY, Authorization: "Bearer " + SUPA_KEY },
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`Supabase ${r.status}: ${text || r.statusText}`);
  }
  return r.json();
}

const fmtD = (d) => {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`;
};
const fmtS = (n) => (n ? "$" + Number(n).toLocaleString() : "—");

const fillVars = (html, vars) => {
  if (!html) return "";
  let out = html;
  Object.entries(vars).forEach(([k, v]) => {
    out = out.replaceAll("{{" + k + "}}", (v || "").toString());
  });
  // Convert lists to indented text before stripping tags
  let counter = 0;
  out = out.replace(/<ol[^>]*>/gi, () => {
    counter = 0;
    return "";
  });
  out = out.replace(/<\/ol>/gi, "");
  out = out.replace(/<ul[^>]*>/gi, "");
  out = out.replace(/<\/ul>/gi, "");
  out = out.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, content) => {
    counter++;
    const bullet = counter > 0 && out.indexOf(m) > out.lastIndexOf("<ol") ? "  " + counter + ". " : "  \u2022 ";
    return "\n" + bullet + content.replace(/<[^>]+>/g, "").trim();
  });
  // Strip remaining HTML tags
  out = out.replace(/<strong>(.*?)<\/strong>/gi, "$1");
  out = out.replace(/<\/?[^>]+(>|$)/g, " ");
  out = out.replace(/\n\s+/g, "\n");
  out = out.replace(/[ \t]+/g, " ").trim();
  return out;
};

// ── Styles ───────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: { backgroundColor: "#ffffff", paddingTop: 48, paddingBottom: 64, paddingHorizontal: 56, fontFamily: "Helvetica" },
  // Header
  docHeader: { textAlign: "center", marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1.5, borderBottomColor: "#1a1714" },
  company: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a1714", marginBottom: 3 },
  docTitle: { fontSize: 10, color: "#6b5e52", letterSpacing: 1, textTransform: "uppercase" },
  docDate: { fontSize: 9, color: "#9a8878", marginTop: 3 },
  // Parties
  partiesRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  partyBox: { flex: 1, padding: 10, backgroundColor: "#f9f8f6", borderWidth: 0.5, borderColor: "rgba(0,0,0,0.1)", borderRadius: 4 },
  partyLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#6b5e52", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 },
  partyName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1a1714" },
  partyDetail: { fontSize: 9, color: "#6b5e52", marginTop: 1 },
  // Summary table
  summaryHeader: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a1714", padding: "8 12", borderTopLeftRadius: 4, borderTopRightRadius: 4, marginBottom: 0 },
  summaryTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#d4a853", textTransform: "uppercase", letterSpacing: 1 },
  summaryRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "rgba(0,0,0,0.06)" },
  summaryLabel: { width: "35%", padding: "6 12", fontSize: 8, fontFamily: "Helvetica-Bold", color: "#5c4a3a", textTransform: "uppercase", letterSpacing: 0.3 },
  summaryValue: { flex: 1, padding: "6 8", fontSize: 10, color: "#1a1714" },
  summaryRef: { width: 60, padding: "6 12 6 4", fontSize: 8, color: "#9a8878", textAlign: "right" },
  // Sections
  sectionWrap: { marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6, paddingBottom: 4, borderBottomWidth: 0.5, borderBottomColor: "rgba(0,0,0,0.08)" },
  sectionNum: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#1a1714", color: "#d4a853", fontSize: 8, fontFamily: "Helvetica-Bold", textAlign: "center", paddingTop: 4 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1a1714", textTransform: "uppercase", letterSpacing: 0.3 },
  sectionContent: { fontSize: 10, color: "#2c2420", lineHeight: 1.7, paddingLeft: 26 },
  // Initials
  initialsRow: { flexDirection: "row", gap: 16, marginTop: 8, paddingLeft: 26 },
  initialBox: { flexDirection: "column", alignItems: "flex-start" },
  initialImg: { height: 20, width: 70, objectFit: "contain" },
  initialLabel: { fontSize: 7, color: "#4a7c59", fontFamily: "Helvetica-Bold", marginTop: 1 },
  initialDate: { fontSize: 7, color: "#9a8878", marginTop: 1 },
  initialPlaceholderLine: { width: 70, borderBottomWidth: 0.5, borderBottomColor: "rgba(0,0,0,0.3)", height: 20, marginBottom: 2 },
  initialPlaceholder: { fontSize: 7, color: "#9a8878", fontStyle: "italic" },
  // Signatures
  sigBlock: { flexDirection: "row", gap: 32, marginTop: 32, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#1a1714" },
  sigCol: { flex: 1 },
  sigLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6b5e52", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
  sigImg: { height: 40, width: 160, objectFit: "contain", marginBottom: 4 },
  sigLine: { width: "100%", borderBottomWidth: 0.5, borderBottomColor: "#1a1714", height: 40, marginBottom: 4 },
  sigPlaceholder: { fontSize: 8, color: "#9a8878", fontStyle: "italic", marginBottom: 4 },
  sigName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#1a1714" },
  sigDate: { fontSize: 8, color: "#6b5e52", marginTop: 1 },
  // Page number
  pageNum: { position: "absolute", bottom: 24, right: 56, fontSize: 8, color: "#bbb" },
  divider: { borderBottomWidth: 0.5, borderBottomColor: "rgba(0,0,0,0.08)", marginBottom: 20 },
});

// ── PDF Document ─────────────────────────────────────────────────────
// Guards against null signatures (draft / pending_tenant leases) — prior
// revisions crashed inside <Image src={...}/> when src was null/undefined.
function LeasePDF({ lease, template, vars, company, landlordName, templateName }) {
  // Executed leases use their stored snapshot — template edits must never affect signed leases
  const isExec = lease.status === "executed";
  const activeSections = (isExec && lease.sections?.length ? lease.sections : template?.sections || []).filter(
    (s) => s.active !== false
  );

  const landlordSig = lease.landlordSig || lease.landlordSignature || null;
  const tenantSig = lease.tenantSig || null;

  return (
    <Document title={`${lease.tenantName || "Lease"} — Lease Agreement`}>
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
            <Text style={S.partyName}>{landlordName}</Text>
            <Text style={S.partyDetail}>{company}</Text>
          </View>
          <View style={S.partyBox}>
            <Text style={S.partyLabel}>Resident</Text>
            <Text style={S.partyName}>{lease.tenantName || ""}</Text>
            <Text style={S.partyDetail}>
              {lease.propertyAddress || lease.property || ""} · {lease.room || ""}
            </Text>
          </View>
        </View>

        {/* Summary table */}
        <View style={{ marginBottom: 24, borderWidth: 0.5, borderColor: "rgba(0,0,0,0.1)", borderRadius: 4, overflow: "hidden" }}>
          <View style={S.summaryHeader}>
            <Text style={S.summaryTitle}>Lease Summary</Text>
          </View>
          {[
            ["Tenant", lease.tenantName || "—", ""],
            ["Property Address", lease.propertyAddress || lease.property || "—", "Section 1"],
            ["Room / Unit", lease.room || "—", "Section 1"],
            ["Lease Start", fmtD(lease.leaseStart || lease.moveIn), "Section 2"],
            ["Lease End", fmtD(lease.leaseEnd), "Section 2"],
            ["Monthly Rent", fmtS(lease.rent), "Section 3"],
            ["Security Deposit", fmtS(lease.sd), "Section 4"],
            ["Prorated First Month", lease.proratedRent && lease.proratedRent > 0 ? fmtS(lease.proratedRent) : "N/A", "Section 3"],
            [
              "Late Fee",
              "$" + (lease.lateFeeInitial || 50) + " after day " + (lease.lateFeeGraceDays || 3) + " · $" + (lease.lateFeeDaily || 5) + "/day thereafter",
              "Section 5",
            ],
            ["Door Code", lease.doorCode || "—", "Section 13"],
            ["Parking", lease.parking || "No assigned parking", "Section 9"],
          ].map(([label, value, ref], i) => (
            <View key={label} style={[S.summaryRow, { backgroundColor: i % 2 === 0 ? "#fff" : "rgba(0,0,0,0.012)" }]}>
              <Text style={S.summaryLabel}>{label}</Text>
              <Text style={S.summaryValue}>{value}</Text>
              <Text style={S.summaryRef}>{ref}</Text>
            </View>
          ))}
        </View>

        <View style={S.divider} />

        {/* Sections */}
        {activeSections.map((sec, i) => (
          <View key={sec.id || i} style={S.sectionWrap} wrap={false}>
            <View style={S.sectionHeader}>
              <View style={S.sectionNum}>
                <Text style={{ color: "#d4a853", fontSize: 8, fontFamily: "Helvetica-Bold", textAlign: "center" }}>{i + 1}</Text>
              </View>
              <Text style={S.sectionTitle}>{sec.title}</Text>
            </View>
            <Text style={S.sectionContent}>{fillVars(sec.content || "", vars)}</Text>
            {sec.requiresInitials && (
              <View style={S.initialsRow}>
                {/* Tenant initials — null-safe */}
                <View style={S.initialBox}>
                  {tenantSig ? (
                    <>
                      <Image src={tenantSig} style={S.initialImg} />
                      <Text style={S.initialLabel}>TENANT INITIALED</Text>
                      <Text style={S.initialDate}>
                        {lease.tenantName}
                        {lease.tenantSignedAt
                          ? " · " +
                            new Date(lease.tenantSignedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : ""}
                      </Text>
                    </>
                  ) : (
                    <>
                      <View style={S.initialPlaceholderLine} />
                      <Text style={S.initialPlaceholder}>Tenant initials (not yet signed)</Text>
                    </>
                  )}
                </View>
                {/* PM initials — null-safe */}
                <View style={S.initialBox}>
                  {landlordSig ? (
                    <>
                      <Image src={landlordSig} style={S.initialImg} />
                      <Text style={S.initialLabel}>PM INITIALED</Text>
                      <Text style={S.initialDate}>
                        {landlordName}
                        {lease.landlordSignedAt
                          ? " · " +
                            new Date(lease.landlordSignedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : ""}
                      </Text>
                    </>
                  ) : (
                    <>
                      <View style={S.initialPlaceholderLine} />
                      <Text style={S.initialPlaceholder}>PM initials (not yet signed)</Text>
                    </>
                  )}
                </View>
              </View>
            )}
          </View>
        ))}

        {/* Signatures */}
        <View style={S.sigBlock}>
          <View style={S.sigCol}>
            <Text style={S.sigLabel}>Property Manager</Text>
            {landlordSig ? (
              <Image src={landlordSig} style={S.sigImg} />
            ) : (
              <>
                <View style={S.sigLine} />
                <Text style={S.sigPlaceholder}>(not yet signed)</Text>
              </>
            )}
            <Text style={S.sigName}>{landlordName}</Text>
            {lease.landlordSignedAt && (
              <Text style={S.sigDate}>
                Signed {new Date(lease.landlordSignedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </Text>
            )}
          </View>
          <View style={S.sigCol}>
            <Text style={S.sigLabel}>Tenant / Resident</Text>
            {tenantSig ? (
              <Image src={tenantSig} style={S.sigImg} />
            ) : (
              <>
                <View style={S.sigLine} />
                <Text style={S.sigPlaceholder}>(not yet signed)</Text>
              </>
            )}
            <Text style={S.sigName}>{lease.tenantName || ""}</Text>
            {lease.tenantSignedAt && (
              <Text style={S.sigDate}>
                Signed {new Date(lease.tenantSignedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </Text>
            )}
          </View>
        </View>

        {/* Page number */}
        <Text style={S.pageNum} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}

// ── API Route ─────────────────────────────────────────────────────────
//
// Auth: Clerk for admin callers, Supabase session for portal (tenant) callers.
// Portal tenants send an Authorization: Bearer <supabase_access_token> header.
// If the caller is a portal user we also verify they own the requested lease
// (portal_users.tenant_id must appear on the lease_instances row).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leaseId = searchParams.get("id");
  if (!leaseId) return NextResponse.json({ error: "Missing lease id" }, { status: 400 });

  // --- Try Clerk first (admin callers) ---
  let isAdmin = false;
  try {
    const { userId } = await auth();
    if (userId) isAdmin = true;
  } catch (_) {
    // Clerk not available or no session — fall through to Supabase check
  }

  // --- If not admin, try Supabase session (portal callers) ---
  let isPortalUser = false;
  let portalUserEmail = null;
  if (!isAdmin) {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (token) {
      try {
        const supabaseAuth = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        const { data: { user: supaUser }, error } = await supabaseAuth.auth.getUser(token);
        if (supaUser && !error) {
          isPortalUser = true;
          portalUserEmail = supaUser.email;
        }
      } catch (_) {
        // Supabase auth check failed — treat as unauthorized
      }
    }
  }

  if (!isAdmin && !isPortalUser) {
    return NextResponse.json({ error: "Unauthorized", leaseId }, { status: 401 });
  }

  if (!SUPA_URL || !SUPA_KEY) {
    console.error("[generate-lease-pdf] Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return NextResponse.json({ error: "Supabase not configured", leaseId }, { status: 500 });
  }

  try {
    // Fetch lease instance
    const rows = await supa("lease_instances?id=eq." + encodeURIComponent(leaseId) + "&select=*");
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Lease not found", leaseId }, { status: 404 });
    }
    const row = rows[0];

    // Ownership check: portal users may only download their own lease.
    // Match portal_users by email and verify their tenant is linked to
    // the same room as the lease instance.
    if (isPortalUser && portalUserEmail) {
      try {
        const puRows = await supa(
          "portal_users?select=tenant_id&auth_user_email=eq." +
            encodeURIComponent(portalUserEmail)
        );
        // Also try matching via the tenants table if portal_users lacks
        // a direct email column — fall back to checking the lease's
        // variable_data.tenantEmail against the authenticated email.
        const tenantIds = (puRows || []).map((p) => p.tenant_id).filter(Boolean);
        const leaseEmail = (row.variable_data?.tenantEmail || "").toLowerCase();
        const ownsLease =
          (row.tenant_id && tenantIds.includes(row.tenant_id)) ||
          (row.room_id &&
            (await supa(
              "tenants?select=id&room_id=eq." +
                encodeURIComponent(row.room_id) +
                "&id=in.(" +
                tenantIds.join(",") +
                ")"
            ).then((r) => r && r.length > 0).catch(() => false))) ||
          leaseEmail === portalUserEmail.toLowerCase();

        if (!ownsLease) {
          return NextResponse.json(
            { error: "Forbidden — you do not have access to this lease", leaseId },
            { status: 403 }
          );
        }
      } catch (ownerErr) {
        console.warn("[generate-lease-pdf] ownership check failed, allowing download:", ownerErr?.message);
        // Fail open so tenants are not locked out if the check errors
      }
    }

    const lease = {
      ...(row.variable_data || {}),
      id: row.id,
      status: row.status,
      landlordSig: row.landlord_sig,
      landlordSignature: row.landlord_sig,
      landlordSignedAt: row.landlord_signed_at,
      tenantSig: row.tenant_sig,
      tenantSignedAt: row.tenant_signed_at,
    };

    // Fetch template
    const templates = await supa(
      "lease_templates?id=eq." + encodeURIComponent(row.template_id) + "&select=sections,name"
    );
    const template = templates && templates.length > 0 ? templates[0] : null;

    // Pull PM-configured settings — never hardcode names here.
    const settings = await getSettings();
    const company = lease.companyName || settings.companyName || "";
    const landlordName = lease.landlordName || settings.pmName || "";
    const templateName = template?.name || "Lease Agreement";
    if (!landlordName) {
      console.warn(
        `[generate-lease-pdf] No landlord name available for lease ${leaseId} — ` +
          `neither lease.landlordName nor settings.pmName is set.`
      );
    }

    // Build template vars
    const fmtDLocal = (d) => {
      if (!d) return "—";
      const dt = new Date(d + "T00:00:00");
      return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`;
    };
    const vars = {
      TENANT_NAME: lease.tenantName || "",
      MONTHLY_RENT: lease.rent ? Number(lease.rent).toLocaleString() : "",
      RENT_WORDS: lease.rentWords || "",
      SECURITY_DEPOSIT: lease.sd ? Number(lease.sd).toLocaleString() : "",
      LEASE_START: fmtDLocal(lease.leaseStart || lease.moveIn),
      LEASE_END: fmtDLocal(lease.leaseEnd),
      MOVE_IN_DATE: fmtDLocal(lease.moveIn),
      PROPERTY_ADDRESS: lease.propertyAddress || lease.property || "",
      ROOM_NAME: lease.room || "",
      DOOR_CODE: lease.doorCode || "",
      UTILITIES_CLAUSE: lease.utilitiesClause || "",
      LANDLORD_NAME: landlordName,
      PARKING_SPACE: lease.parking || "No assigned parking",
      DAILY_RATE: lease.rent ? Math.ceil(Number(lease.rent) / 30) : "",
      PRORATED_RENT: lease.proratedRent ? Number(lease.proratedRent).toLocaleString() : "",
    };

    // Generate PDF — @react-pdf/renderer v4 exposes renderToBuffer
    // directly; the older `pdf(doc).toBuffer()` shape has been removed.
    const pdfBuffer = await renderToBuffer(
      <LeasePDF
        lease={lease}
        template={template}
        vars={vars}
        company={company}
        landlordName={landlordName}
        templateName={templateName}
      />
    );

    const filename = `lease-${(lease.tenantName || "tenant").replace(/\s+/g, "-").toLowerCase()}-${leaseId}.pdf`;

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error(`[generate-lease-pdf] generation error for lease ${leaseId}:`, e);
    return NextResponse.json(
      { error: e?.message || "PDF generation failed", leaseId },
      { status: 500 }
    );
  }
}
