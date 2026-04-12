import { NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@clerk/nextjs/server";

// ── Runtime ──────────────────────────────────────────────────────────
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Supabase ─────────────────────────────────────────────────────────
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

// ── Helpers ──────────────────────────────────────────────────────────
const fmt = (n) => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtD = (d) => {
  if (!d) return "\u2014";
  const dt = new Date(d + "T00:00:00");
  return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`;
};
const today = () => new Date().toISOString().split("T")[0];

const allRooms = (prop) =>
  (prop.units || []).flatMap((u) =>
    u.ownerOccupied ? [] : (u.rooms || []).filter((r) => !r.ownerOccupied)
  );

// ── Styles ───────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
  },
  // Header
  headerBar: {
    backgroundColor: "#1a1714",
    padding: "12 16",
    borderRadius: 4,
    marginBottom: 16,
  },
  company: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  subtitle: { fontSize: 9, color: "#cccccc", marginTop: 2 },
  // Property header
  propHeader: {
    backgroundColor: "#f4f3f1",
    padding: "8 10",
    borderRadius: 3,
    marginBottom: 0,
    marginTop: 16,
  },
  propName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#1a1714" },
  propAddr: { fontSize: 8, color: "#6b5e52", marginTop: 1 },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a1714",
    padding: "6 0",
  },
  tableHeaderText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: "row",
    padding: "5 0",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e8e5e1",
  },
  tableRowAlt: {
    backgroundColor: "#fafaf9",
  },
  tableCell: {
    fontSize: 8.5,
    color: "#2c2420",
  },
  tableCellBold: {
    fontSize: 8.5,
    color: "#2c2420",
    fontFamily: "Helvetica-Bold",
  },
  vacantText: {
    fontSize: 8.5,
    color: "#9a8878",
    fontStyle: "italic",
  },
  // Summary
  summaryBox: {
    marginTop: 20,
    padding: "14 16",
    backgroundColor: "#f9f8f6",
    borderWidth: 0.5,
    borderColor: "#e0ddd8",
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1714",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d4d0cb",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: { fontSize: 9, color: "#6b5e52" },
  summaryValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1a1714" },
  summaryDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#d4d0cb",
    marginVertical: 6,
  },
  // Page number
  pageNum: { position: "absolute", bottom: 24, right: 40, fontSize: 7, color: "#bbb" },
  pageNumLeft: { position: "absolute", bottom: 24, left: 40, fontSize: 7, color: "#bbb" },
});

// Column widths (percentages of usable width)
const COL = {
  room: "18%",
  tenant: "22%",
  lease: "20%",
  rent: "14%",
  status: "13%",
  moveIn: "13%",
};

// ── PDF Document ─────────────────────────────────────────────────────
function RentRollPDF({ properties, mortgages, companyName, dateStr }) {
  // Aggregate stats
  let totalUnits = 0;
  let occupiedCount = 0;
  let totalMonthlyRent = 0;

  const propSections = properties.map((prop) => {
    const rooms = allRooms(prop);
    const rows = [];

    for (const unit of prop.units || []) {
      if (unit.ownerOccupied) continue;
      const isWhole = (unit.rentalMode || "byRoom") === "wholeHouse";

      if (isWhole) {
        const rep = (unit.rooms || []).find((r) => r.tenant);
        const isOcc = !!rep?.tenant;
        totalUnits++;
        if (isOcc) {
          occupiedCount++;
          totalMonthlyRent += Number(unit.rent || 0);
        }
        rows.push({
          room: unit.name || prop.name,
          tenant: rep?.tenant?.name || "VACANT",
          leaseStart: isOcc ? fmtD(rep.tenant.moveIn || rep.tenant.leaseStart) : "\u2014",
          leaseEnd: isOcc ? fmtD(rep.tenant.leaseEnd || rep.le) : "\u2014",
          rent: isOcc ? fmt(unit.rent || 0) : "\u2014",
          status: isOcc ? "Occupied" : "Vacant",
          moveIn: isOcc ? fmtD(rep.tenant.moveIn) : "\u2014",
          isVacant: !isOcc,
        });
      } else {
        for (const r of unit.rooms || []) {
          if (r.ownerOccupied) continue;
          const isOcc = r.st === "occupied" || !!r.tenant;
          totalUnits++;
          if (isOcc) {
            occupiedCount++;
            totalMonthlyRent += Number(r.rent || 0);
          }
          rows.push({
            room: r.name,
            tenant: r.tenant?.name || "VACANT",
            leaseStart: isOcc ? fmtD(r.tenant?.moveIn || r.tenant?.leaseStart) : "\u2014",
            leaseEnd: isOcc ? fmtD(r.tenant?.leaseEnd || r.le) : "\u2014",
            rent: isOcc ? fmt(r.rent || 0) : "\u2014",
            status: r.st === "notice" ? "Notice Given" : isOcc ? "Occupied" : "Vacant",
            moveIn: isOcc ? fmtD(r.tenant?.moveIn) : "\u2014",
            isVacant: !isOcc,
          });
        }
      }
    }

    return { prop, rooms, rows };
  });

  const occRate = totalUnits > 0 ? Math.round((occupiedCount / totalUnits) * 100) : 0;
  const annualIncome = totalMonthlyRent * 12;

  // Mortgage / DSCR
  const annualDebt = (mortgages || []).reduce((s, mg) => s + (mg.monthlyPI || 0) * 12, 0);
  const dscr = annualDebt > 0 ? (annualIncome / annualDebt) : null;

  return (
    <Document title={`Rent Roll - ${dateStr}`}>
      <Page size="LETTER" style={S.page}>
        {/* Header */}
        <View style={S.headerBar}>
          <Text style={S.company}>{companyName || "Rent Roll"}</Text>
          <Text style={S.subtitle}>Rent Roll  |  Generated {dateStr}</Text>
        </View>

        {/* Per-property tables */}
        {propSections.map(({ prop, rows }, pi) => (
          <View key={prop.id || pi} wrap={false} style={{ marginBottom: 8 }}>
            {/* Property name */}
            <View style={S.propHeader}>
              <Text style={S.propName}>{prop.displayName || prop.name}</Text>
              {prop.address && <Text style={S.propAddr}>{prop.address}</Text>}
            </View>

            {/* Table header */}
            <View style={S.tableHeader}>
              <Text style={[S.tableHeaderText, { width: COL.room, paddingLeft: 10 }]}>Room / Unit</Text>
              <Text style={[S.tableHeaderText, { width: COL.tenant }]}>Tenant</Text>
              <Text style={[S.tableHeaderText, { width: COL.lease }]}>Lease Period</Text>
              <Text style={[S.tableHeaderText, { width: COL.rent, textAlign: "right" }]}>Monthly Rent</Text>
              <Text style={[S.tableHeaderText, { width: COL.status, textAlign: "center" }]}>Status</Text>
              <Text style={[S.tableHeaderText, { width: COL.moveIn, textAlign: "right", paddingRight: 10 }]}>Move-In</Text>
            </View>

            {/* Table rows */}
            {rows.map((row, ri) => (
              <View key={ri} style={[S.tableRow, ri % 2 === 1 ? S.tableRowAlt : {}]}>
                <Text style={[S.tableCell, { width: COL.room, paddingLeft: 10 }]}>{row.room}</Text>
                <Text style={[row.isVacant ? S.vacantText : S.tableCellBold, { width: COL.tenant }]}>{row.tenant}</Text>
                <Text style={[S.tableCell, { width: COL.lease }]}>
                  {row.isVacant ? "\u2014" : `${row.leaseStart} \u2013 ${row.leaseEnd}`}
                </Text>
                <Text style={[S.tableCell, { width: COL.rent, textAlign: "right" }]}>{row.rent}</Text>
                <Text style={[S.tableCell, { width: COL.status, textAlign: "center", color: row.isVacant ? "#c45c4a" : row.status === "Notice Given" ? "#d4a853" : "#4a7c59" }]}>{row.status}</Text>
                <Text style={[S.tableCell, { width: COL.moveIn, textAlign: "right", paddingRight: 10 }]}>{row.moveIn}</Text>
              </View>
            ))}

            {rows.length === 0 && (
              <View style={[S.tableRow]}>
                <Text style={[S.vacantText, { paddingLeft: 10 }]}>No rooms configured</Text>
              </View>
            )}
          </View>
        ))}

        {/* Summary */}
        <View style={S.summaryBox}>
          <Text style={S.summaryTitle}>Portfolio Summary</Text>
          <View style={S.summaryRow}>
            <Text style={S.summaryLabel}>Total Units / Rooms</Text>
            <Text style={S.summaryValue}>{totalUnits}</Text>
          </View>
          <View style={S.summaryRow}>
            <Text style={S.summaryLabel}>Occupied</Text>
            <Text style={S.summaryValue}>{occupiedCount} ({occRate}%)</Text>
          </View>
          <View style={S.summaryRow}>
            <Text style={S.summaryLabel}>Vacant</Text>
            <Text style={S.summaryValue}>{totalUnits - occupiedCount}</Text>
          </View>
          <View style={S.summaryDivider} />
          <View style={S.summaryRow}>
            <Text style={S.summaryLabel}>Total Monthly Rent (Occupied)</Text>
            <Text style={S.summaryValue}>{fmt(totalMonthlyRent)}</Text>
          </View>
          <View style={S.summaryRow}>
            <Text style={S.summaryLabel}>Annual Projected Income</Text>
            <Text style={S.summaryValue}>{fmt(annualIncome)}</Text>
          </View>
          {annualDebt > 0 && (
            <>
              <View style={S.summaryDivider} />
              <View style={S.summaryRow}>
                <Text style={S.summaryLabel}>Annual Debt Service</Text>
                <Text style={S.summaryValue}>{fmt(annualDebt)}</Text>
              </View>
              {dscr != null && (
                <View style={S.summaryRow}>
                  <Text style={S.summaryLabel}>DSCR</Text>
                  <Text style={[S.summaryValue, { color: dscr >= 1.25 ? "#4a7c59" : "#c45c4a" }]}>{dscr.toFixed(2)}x</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Page number */}
        <Text style={S.pageNumLeft}>Confidential</Text>
        <Text style={S.pageNum} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}

// ── API Route ────────────────────────────────────────────────────────
export async function GET(request) {
  // Clerk admin gate
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error("[generate-rent-roll] Clerk auth() failed:", e?.message || e);
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 });
  }

  if (!SUPA_URL || !SUPA_KEY) {
    console.error("[generate-rent-roll] Missing Supabase env vars");
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    // Fetch data from app_data table
    const [propsRows, mortgageRows, settingsRows] = await Promise.all([
      supa("app_data?key=eq.hq-props&select=value"),
      supa("app_data?key=eq.hq-mortgages&select=value"),
      supa("app_data?key=eq.hq-settings&select=value"),
    ]);

    const properties = propsRows?.[0]?.value || [];
    const mortgages = mortgageRows?.[0]?.value || [];
    const settings = settingsRows?.[0]?.value || {};
    const companyName = settings.companyName || "";
    const dateStr = today();

    const pdfBuffer = await renderToBuffer(
      <RentRollPDF
        properties={Array.isArray(properties) ? properties : []}
        mortgages={Array.isArray(mortgages) ? mortgages : []}
        companyName={companyName}
        dateStr={dateStr}
      />
    );

    const filename = `rent-roll-${dateStr}.pdf`;

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error("[generate-rent-roll] generation error:", e);
    return NextResponse.json(
      { error: e?.message || "PDF generation failed" },
      { status: 500 }
    );
  }
}
