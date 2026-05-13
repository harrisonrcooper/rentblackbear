// PDF documents for /admin/budget. Built on @react-pdf/renderer so
// every download is rendered fully client-side from the live state —
// no server round-trip, no template files, no font registration.
//
// Three reports:
//   * MonthlyStatementPDF — one-pager: income / expense breakdown,
//     property NOI, savings rate. Hand to a financial advisor or
//     paste into a refi packet.
//   * NetWorthStatementPDF — lender-ready signed statement: assets,
//     liabilities, totals, signature block. Print, sign, scan, send.
//   * ScheduleEPacketPDF — multi-property tax-ready packet: per-
//     property page (rents, line-itemized expenses, depreciation
//     calculation shown long-form) plus a consolidated summary.
//
// All money in cents at the boundary; rendered as $X,XXX.XX.
// Designed for US Letter, monochrome with one accent color.

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import {
  propertyMonthlyGross,
  propertyMonthlyExpenses,
  propertyMonthlyNet,
  computeNetWorthCents,
} from "./calc";
import { incomeMonthly, categoryMonthly } from "./money";

// ── Formatters ───────────────────────────────────────────────────────

const fmt = (cents) => {
  const n = (cents || 0) / 100;
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}$${abs}`;
};

const fmtPct = (bps) => {
  if (bps == null) return "—";
  return `${(bps / 100).toFixed(1)}%`;
};

const monthLabel = (isoOrDate) => {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(`${isoOrDate}-01T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const todayLong = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ── Shared styles ────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingHorizontal: 44,
    paddingBottom: 56,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#0d1424",
    lineHeight: 1.35,
  },
  brand: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4,
    color: "#5f6675",
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0d1424",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "#5f6675",
    marginBottom: 18,
  },
  hairline: {
    borderBottomWidth: 1,
    borderBottomColor: "#d6d9de",
    marginVertical: 12,
  },
  hero: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f4f5f7",
    borderRadius: 8,
    marginBottom: 14,
  },
  heroLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    color: "#5f6675",
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#0d1424",
  },
  heroMeta: {
    fontSize: 9,
    color: "#5f6675",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0d1424",
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#0d1424",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eaecef",
  },
  rowLabel: { color: "#0d1424", flex: 1 },
  rowSub: { color: "#5f6675", fontSize: 8, marginTop: 1 },
  rowValue: {
    fontFamily: "Helvetica-Bold",
    color: "#0d1424",
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 2,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#0d1424",
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#0d1424",
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#0d1424",
    textAlign: "right",
  },
  twoCol: { flexDirection: "row", gap: 18, marginTop: 6 },
  col: { flex: 1 },
  table: { marginTop: 4 },
  th: {
    flexDirection: "row",
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#0d1424",
  },
  thCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#0d1424",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  td: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eaecef",
  },
  tdCell: { fontSize: 9, color: "#0d1424" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    fontSize: 8,
    color: "#969ba8",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d9de",
  },
  pill: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#5f6675",
    letterSpacing: 1,
  },
  signatureWrap: {
    marginTop: 28,
    flexDirection: "row",
    gap: 24,
  },
  signatureLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#0d1424",
    minHeight: 28,
  },
  signatureLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#5f6675",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 8,
    color: "#5f6675",
    marginTop: 18,
    lineHeight: 1.45,
  },
});

// Re-usable row helpers — keeps doc bodies readable.
const Row = ({ label, sub, value }) => (
  <View style={s.row}>
    <View style={{ flex: 1 }}>
      <Text style={s.rowLabel}>{label}</Text>
      {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
    </View>
    <Text style={s.rowValue}>{value}</Text>
  </View>
);

const Total = ({ label, value }) => (
  <View style={s.totalRow}>
    <Text style={s.totalLabel}>{label}</Text>
    <Text style={s.totalValue}>{value}</Text>
  </View>
);

const Footer = ({ pageLabel = "" }) => (
  <View style={s.footer} fixed>
    <Text>Generated {todayLong()} · rentblackbear</Text>
    <Text style={s.pill}>{pageLabel || "CONFIDENTIAL"}</Text>
  </View>
);

// ── Monthly Statement ────────────────────────────────────────────────

// `month` is "YYYY-MM"; defaults to the current month.
export function MonthlyStatementPDF({ state, month }) {
  const m = month || todayISO().slice(0, 7);
  const settings = state.settings || {};

  const incomes = (state.income_sources || []).map((i) => ({
    label: i.label,
    owner: i.owner,
    monthly: incomeMonthly(i),
  }));
  const incomeTotal = incomes.reduce((sum, i) => sum + i.monthly, 0);

  // Group personal categories.
  const groupTotals = new Map();
  for (const c of state.categories || []) {
    const monthly = categoryMonthly(c);
    if (!monthly) continue;
    const key = c.group_key || "other";
    groupTotals.set(key, (groupTotals.get(key) || 0) + monthly);
  }
  const groupRows = Array.from(groupTotals.entries())
    .map(([key, monthly]) => ({ label: titleCase(key), monthly }))
    .sort((a, b) => b.monthly - a.monthly);
  const personalTotal = groupRows.reduce((sum, r) => sum + r.monthly, 0);

  // Property NOI table.
  const operating = (state.properties || []).filter((p) => p.status === "operating");
  const propertyRows = operating.map((p) => {
    const gross = propertyMonthlyGross(p);
    const exp = propertyMonthlyExpenses(p, settings);
    const noi = propertyMonthlyNet(p, settings);
    return {
      label: p.label,
      address: p.address,
      gross,
      exp,
      noi,
    };
  });
  const rentalGross = propertyRows.reduce((sum, p) => sum + p.gross, 0);
  const rentalExp = propertyRows.reduce((sum, p) => sum + p.exp, 0);
  const rentalNet = propertyRows.reduce((sum, p) => sum + p.noi, 0);

  // Logged spend for the month.
  const actualsThisMonth = (state.monthly_actuals || [])
    .filter((a) => (a.month || "").slice(0, 7) === m);
  const actualsTotal = actualsThisMonth.reduce((sum, a) => sum + (a.amount_cents || 0), 0);

  // Bills due in the month.
  const billsThisMonth = (state.bills || [])
    .filter((b) => !b.archived_at)
    .filter((b) => {
      if (b.cadence === "monthly") return true;
      if (b.cadence === "yearly") {
        const mm = parseInt(m.slice(5, 7), 10);
        return b.due_month === mm;
      }
      return false;
    });
  const billsTotal = billsThisMonth.reduce((sum, b) => sum + (b.amount_cents || 0), 0);

  const totalIncomeAllSources = incomeTotal + rentalGross;
  const totalExpenses = personalTotal + rentalExp;
  const netCashflow = totalIncomeAllSources - totalExpenses;
  const savingsRate = totalIncomeAllSources > 0
    ? Math.round((netCashflow / totalIncomeAllSources) * 1000) / 10
    : 0;

  return (
    <Document
      title={`Monthly Statement — ${monthLabel(m)}`}
      author="rentblackbear"
      subject="Monthly cash-flow statement"
    >
      <Page size="LETTER" style={s.page}>
        <Text style={s.brand}>RENTBLACKBEAR · MONTHLY STATEMENT</Text>
        <Text style={s.title}>{monthLabel(m)}</Text>
        <Text style={s.subtitle}>
          Income, expenses, property NOI, and net cash flow for the month.
        </Text>

        <View style={s.hero}>
          <Text style={s.heroLabel}>NET CASH FLOW</Text>
          <Text style={s.heroValue}>{fmt(netCashflow)}</Text>
          <Text style={s.heroMeta}>
            Savings rate {savingsRate.toFixed(1)}% · {fmt(totalIncomeAllSources)} in · {fmt(totalExpenses)} out
          </Text>
        </View>

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.sectionTitle}>Income</Text>
            {incomes.length === 0 ? (
              <Text style={s.rowSub}>No income sources tracked.</Text>
            ) : (
              incomes.map((i, idx) => (
                <Row
                  key={idx}
                  label={i.label}
                  sub={titleCase(i.owner)}
                  value={fmt(i.monthly)}
                />
              ))
            )}
            <Row label="Rental gross" sub="All operating properties" value={fmt(rentalGross)} />
            <Total label="Income total" value={fmt(totalIncomeAllSources)} />
          </View>

          <View style={s.col}>
            <Text style={s.sectionTitle}>Expenses</Text>
            {groupRows.length === 0 ? (
              <Text style={s.rowSub}>No expense categories tracked.</Text>
            ) : (
              groupRows.map((r, idx) => (
                <Row key={idx} label={r.label} value={fmt(r.monthly)} />
              ))
            )}
            <Row label="Rental operating" sub="Insurance, tax, repairs, mgmt" value={fmt(rentalExp)} />
            <Total label="Expense total" value={fmt(totalExpenses)} />
          </View>
        </View>

        <Text style={s.sectionTitle}>Property Net Operating Income</Text>
        {propertyRows.length === 0 ? (
          <Text style={s.rowSub}>No operating properties.</Text>
        ) : (
          <View style={s.table}>
            <View style={s.th}>
              <Text style={[s.thCell, { flex: 3 }]}>Property</Text>
              <Text style={[s.thCell, { flex: 1, textAlign: "right" }]}>Gross</Text>
              <Text style={[s.thCell, { flex: 1, textAlign: "right" }]}>Expenses</Text>
              <Text style={[s.thCell, { flex: 1, textAlign: "right" }]}>NOI</Text>
            </View>
            {propertyRows.map((p, idx) => (
              <View key={idx} style={s.td}>
                <View style={{ flex: 3 }}>
                  <Text style={s.tdCell}>{p.label}</Text>
                  {p.address ? <Text style={s.rowSub}>{p.address}</Text> : null}
                </View>
                <Text style={[s.tdCell, { flex: 1, textAlign: "right" }]}>{fmt(p.gross)}</Text>
                <Text style={[s.tdCell, { flex: 1, textAlign: "right" }]}>{fmt(p.exp)}</Text>
                <Text style={[s.tdCell, { flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{fmt(p.noi)}</Text>
              </View>
            ))}
            <Total label="Portfolio NOI" value={fmt(rentalNet)} />
          </View>
        )}

        {actualsThisMonth.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Logged spend this month</Text>
            <Text style={s.rowSub}>
              {actualsThisMonth.length} entries totalling {fmt(actualsTotal)}.
            </Text>
          </>
        ) : null}

        {billsThisMonth.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Bills due this month</Text>
            <View style={s.table}>
              {billsThisMonth.map((b, idx) => (
                <Row
                  key={idx}
                  label={b.label}
                  sub={`${b.vendor || ""}${b.due_day ? ` · day ${b.due_day}` : ""}${b.autopay ? " · autopay" : ""}`}
                  value={fmt(b.amount_cents)}
                />
              ))}
              <Total label="Bills total" value={fmt(billsTotal)} />
            </View>
          </>
        ) : null}

        <Footer pageLabel="MONTHLY · CONFIDENTIAL" />
      </Page>
    </Document>
  );
}

// ── Net Worth Statement ──────────────────────────────────────────────

export function NetWorthStatementPDF({ state }) {
  const settings = state.settings || {};
  const asOf = todayLong();

  // Properties — equity in operating + equity_only, market value as
  // an asset and mortgage balance as a liability.
  const properties = (state.properties || [])
    .filter((p) => p.status === "operating" || p.status === "equity_only" || p.status === "pipeline");

  const realEstateRows = properties.map((p) => ({
    label: p.label,
    sub: p.address || titleCase(p.status),
    value: p.market_value_cents,
  }));
  const realEstateTotal = realEstateRows.reduce((sum, r) => sum + r.value, 0);

  const mortgages = properties
    .filter((p) => (p.mortgage_balance_cents || 0) > 0)
    .map((p) => ({
      label: `${p.label} — mortgage`,
      sub: p.mortgage_rate_bps ? `${fmtPct(p.mortgage_rate_bps)} · ${fmt(p.mortgage_payment_cents)}/mo` : "",
      value: p.mortgage_balance_cents,
    }));
  const mortgageTotal = mortgages.reduce((sum, m) => sum + m.value, 0);

  // Cash, retirement, investment, vehicle/other grouped.
  const buckets = { cash: [], retirement: [], investment: [], vehicle: [], other: [] };
  for (const a of state.assets || []) {
    (buckets[a.kind] || buckets.other).push(a);
  }
  const sumBucket = (rows) => rows.reduce((sum, a) => sum + (a.balance_cents || 0), 0);
  const cashTotal = sumBucket(buckets.cash);
  const retirementTotal = sumBucket(buckets.retirement);
  const investmentTotal = sumBucket(buckets.investment);
  const otherAssetsTotal = sumBucket([...buckets.vehicle, ...buckets.other]);

  const debts = state.debts || [];
  const debtsTotal = debts.reduce((sum, d) => sum + (d.balance_cents || 0), 0);

  const totalAssets = realEstateTotal + cashTotal + retirementTotal + investmentTotal + otherAssetsTotal;
  const totalLiabilities = mortgageTotal + debtsTotal;
  const netWorth = totalAssets - totalLiabilities;

  // Sanity check: this should match the live hero number to the penny.
  const liveNet = computeNetWorthCents(state);

  return (
    <Document
      title="Statement of Net Worth"
      author="rentblackbear"
      subject="Personal financial statement"
    >
      <Page size="LETTER" style={s.page}>
        <Text style={s.brand}>RENTBLACKBEAR · STATEMENT OF NET WORTH</Text>
        <Text style={s.title}>Statement of Net Worth</Text>
        <Text style={s.subtitle}>As of {asOf}</Text>

        <View style={s.hero}>
          <Text style={s.heroLabel}>NET WORTH</Text>
          <Text style={s.heroValue}>{fmt(netWorth)}</Text>
          <Text style={s.heroMeta}>
            {fmt(totalAssets)} in assets · {fmt(totalLiabilities)} in liabilities
          </Text>
        </View>

        <Text style={s.sectionTitle}>Assets</Text>

        {realEstateRows.length > 0 ? (
          <>
            <Text style={[s.thCell, { marginTop: 6, marginBottom: 2 }]}>Real estate (fair market value)</Text>
            {realEstateRows.map((r, idx) => (
              <Row key={`re-${idx}`} label={r.label} sub={r.sub} value={fmt(r.value)} />
            ))}
            <View style={s.row}>
              <Text style={s.rowLabel}> </Text>
              <Text style={s.rowValue}>{fmt(realEstateTotal)} subtotal</Text>
            </View>
          </>
        ) : null}

        {buckets.cash.length > 0 ? (
          <>
            <Text style={[s.thCell, { marginTop: 6, marginBottom: 2 }]}>Cash &amp; equivalents</Text>
            {buckets.cash.map((a, idx) => (
              <Row key={`cash-${idx}`} label={a.label} value={fmt(a.balance_cents)} />
            ))}
            <View style={s.row}>
              <Text style={s.rowLabel}> </Text>
              <Text style={s.rowValue}>{fmt(cashTotal)} subtotal</Text>
            </View>
          </>
        ) : null}

        {buckets.retirement.length > 0 ? (
          <>
            <Text style={[s.thCell, { marginTop: 6, marginBottom: 2 }]}>Retirement accounts</Text>
            {buckets.retirement.map((a, idx) => (
              <Row key={`r-${idx}`} label={a.label} value={fmt(a.balance_cents)} />
            ))}
            <View style={s.row}>
              <Text style={s.rowLabel}> </Text>
              <Text style={s.rowValue}>{fmt(retirementTotal)} subtotal</Text>
            </View>
          </>
        ) : null}

        {buckets.investment.length > 0 ? (
          <>
            <Text style={[s.thCell, { marginTop: 6, marginBottom: 2 }]}>Brokerage / investment</Text>
            {buckets.investment.map((a, idx) => (
              <Row key={`i-${idx}`} label={a.label} value={fmt(a.balance_cents)} />
            ))}
            <View style={s.row}>
              <Text style={s.rowLabel}> </Text>
              <Text style={s.rowValue}>{fmt(investmentTotal)} subtotal</Text>
            </View>
          </>
        ) : null}

        {(buckets.vehicle.length + buckets.other.length) > 0 ? (
          <>
            <Text style={[s.thCell, { marginTop: 6, marginBottom: 2 }]}>Other assets</Text>
            {[...buckets.vehicle, ...buckets.other].map((a, idx) => (
              <Row key={`o-${idx}`} label={a.label} sub={titleCase(a.kind)} value={fmt(a.balance_cents)} />
            ))}
            <View style={s.row}>
              <Text style={s.rowLabel}> </Text>
              <Text style={s.rowValue}>{fmt(otherAssetsTotal)} subtotal</Text>
            </View>
          </>
        ) : null}

        <Total label="Total assets" value={fmt(totalAssets)} />

        <Text style={s.sectionTitle}>Liabilities</Text>

        {mortgages.length > 0 ? (
          <>
            <Text style={[s.thCell, { marginTop: 6, marginBottom: 2 }]}>Mortgages</Text>
            {mortgages.map((m, idx) => (
              <Row key={`m-${idx}`} label={m.label} sub={m.sub} value={fmt(m.value)} />
            ))}
            <View style={s.row}>
              <Text style={s.rowLabel}> </Text>
              <Text style={s.rowValue}>{fmt(mortgageTotal)} subtotal</Text>
            </View>
          </>
        ) : null}

        {debts.length > 0 ? (
          <>
            <Text style={[s.thCell, { marginTop: 6, marginBottom: 2 }]}>Consumer debt</Text>
            {debts.map((d, idx) => (
              <Row
                key={`d-${idx}`}
                label={d.label}
                sub={`${titleCase(d.kind)}${d.interest_rate_bps ? ` · ${fmtPct(d.interest_rate_bps)}` : ""}`}
                value={fmt(d.balance_cents)}
              />
            ))}
            <View style={s.row}>
              <Text style={s.rowLabel}> </Text>
              <Text style={s.rowValue}>{fmt(debtsTotal)} subtotal</Text>
            </View>
          </>
        ) : null}

        <Total label="Total liabilities" value={fmt(totalLiabilities)} />

        <View style={s.hairline} />
        <View style={s.totalRow}>
          <Text style={[s.totalLabel, { fontSize: 13 }]}>NET WORTH</Text>
          <Text style={[s.totalValue, { fontSize: 13 }]}>{fmt(netWorth)}</Text>
        </View>

        <View style={s.signatureWrap}>
          <View style={{ flex: 1 }}>
            <View style={s.signatureLine} />
            <Text style={s.signatureLabel}>SIGNATURE</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={s.signatureLine} />
            <Text style={s.signatureLabel}>DATE</Text>
          </View>
        </View>

        <Text style={s.disclaimer}>
          This is a self-prepared statement of personal net worth. It is not
          audited and has not been reviewed by a certified public accountant.
          Real estate values reflect the preparer&apos;s best estimate of fair
          market value as of the statement date. Mortgage and debt balances
          are stated as of the most recent statement available. Cross-check
          {liveNet === netWorth ? ` ` : ` (live computed: ${fmt(liveNet)}) `}
          against supporting documentation before relying on this statement
          for any lending, tax, or legal decision.
        </Text>

        <Footer pageLabel="NET WORTH · CONFIDENTIAL" />
      </Page>
    </Document>
  );
}

// ── Schedule E Packet ────────────────────────────────────────────────

export function ScheduleEPacketPDF({ state, year }) {
  const settings = state.settings || {};
  const taxYear = year ?? new Date().getFullYear();

  const properties = (state.properties || [])
    .filter((p) => p.status === "operating" || p.status === "pipeline")
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Per-property annualized line items.
  const propertyData = properties.map((p) => {
    const monthlyGross = propertyMonthlyGross(p);
    const monthlyExp = propertyMonthlyExpenses(p, settings);
    const annualGross = monthlyGross * 12;
    const annualExp = monthlyExp * 12;

    // 27.5-year straight-line on 80% building basis. Land is the
    // remaining 20%. Documented here so CPA can override.
    const basis = p.purchase_price_cents ?? p.market_value_cents ?? 0;
    const buildingBasis = Math.round(basis * 0.8);
    const annualDep = Math.round(buildingBasis / 27.5);

    // Itemize the fixed-cost expenses; collect vacancy + capex
    // separately since they're synthetic allowances.
    const fixed = (p.expenses || []).filter((e) => e.kind === "fixed");
    const vacancy = (p.expenses || []).filter((e) => e.kind === "vacancy_pct");
    const capex = (p.expenses || []).filter((e) => e.kind === "capex_pct");

    const vacancyMonthly = vacancy.reduce((sum, e) => {
      const pct = e.pct_bps ?? settings.default_vacancy_bps ?? 0;
      return sum + Math.round((monthlyGross * pct) / 10000);
    }, 0);
    const capexMonthly = capex.reduce((sum, e) => {
      const pct = e.pct_bps ?? settings.default_capex_bps ?? 0;
      return sum + Math.round((monthlyGross * pct) / 10000);
    }, 0);

    const mortgagePaymentAnnual = (p.mortgage_payment_cents || 0) * 12;
    const taxableIncome = annualGross - annualExp - annualDep;

    return {
      p,
      annualGross,
      annualExp,
      basis,
      buildingBasis,
      annualDep,
      taxableIncome,
      fixed,
      vacancyMonthly,
      capexMonthly,
      mortgagePaymentAnnual,
    };
  });

  const portfolioGross = propertyData.reduce((s, d) => s + d.annualGross, 0);
  const portfolioExp = propertyData.reduce((s, d) => s + d.annualExp, 0);
  const portfolioDep = propertyData.reduce((s, d) => s + d.annualDep, 0);
  const portfolioTaxable = propertyData.reduce((s, d) => s + d.taxableIncome, 0);

  return (
    <Document
      title={`Schedule E Tax Packet — TY ${taxYear}`}
      author="rentblackbear"
      subject="Rental property tax packet"
    >
      {/* Cover + summary */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.brand}>RENTBLACKBEAR · TAX PACKET</Text>
        <Text style={s.title}>Schedule E — Tax Year {taxYear}</Text>
        <Text style={s.subtitle}>
          Annualized rental property income, deductible expenses, and
          straight-line depreciation for filing IRS Form 1040, Schedule E.
        </Text>

        <View style={s.hero}>
          <Text style={s.heroLabel}>NET TAXABLE RENTAL INCOME · {taxYear}</Text>
          <Text style={s.heroValue}>{fmt(portfolioTaxable)}</Text>
          <Text style={s.heroMeta}>
            {fmt(portfolioGross)} gross · {fmt(portfolioExp)} operating · {fmt(portfolioDep)} depreciation
          </Text>
        </View>

        <Text style={s.sectionTitle}>Portfolio summary</Text>
        <View style={s.table}>
          <View style={s.th}>
            <Text style={[s.thCell, { flex: 3 }]}>Property</Text>
            <Text style={[s.thCell, { flex: 1, textAlign: "right" }]}>Gross</Text>
            <Text style={[s.thCell, { flex: 1, textAlign: "right" }]}>Op exp</Text>
            <Text style={[s.thCell, { flex: 1, textAlign: "right" }]}>Deprec</Text>
            <Text style={[s.thCell, { flex: 1, textAlign: "right" }]}>Taxable</Text>
          </View>
          {propertyData.map((d, idx) => (
            <View key={idx} style={s.td}>
              <View style={{ flex: 3 }}>
                <Text style={s.tdCell}>{d.p.label}</Text>
                {d.p.address ? <Text style={s.rowSub}>{d.p.address}</Text> : null}
              </View>
              <Text style={[s.tdCell, { flex: 1, textAlign: "right" }]}>{fmt(d.annualGross)}</Text>
              <Text style={[s.tdCell, { flex: 1, textAlign: "right" }]}>{fmt(d.annualExp)}</Text>
              <Text style={[s.tdCell, { flex: 1, textAlign: "right" }]}>{fmt(d.annualDep)}</Text>
              <Text style={[s.tdCell, { flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{fmt(d.taxableIncome)}</Text>
            </View>
          ))}
          <View style={s.totalRow}>
            <Text style={[s.totalLabel, { flex: 3 }]}>Totals</Text>
            <Text style={[s.totalValue, { flex: 1 }]}>{fmt(portfolioGross)}</Text>
            <Text style={[s.totalValue, { flex: 1 }]}>{fmt(portfolioExp)}</Text>
            <Text style={[s.totalValue, { flex: 1 }]}>{fmt(portfolioDep)}</Text>
            <Text style={[s.totalValue, { flex: 1 }]}>{fmt(portfolioTaxable)}</Text>
          </View>
        </View>

        <Text style={s.disclaimer}>
          Depreciation calculated as 27.5-year straight-line on 80% of basis
          (building) with the remaining 20% allocated to land. Vacancy and
          CapEx allowances are reflected in operating expenses as a
          percentage of gross rents per the property&apos;s settings. Mortgage
          interest, points, and origination fees are not modeled here —
          provide your CPA the year-end Form 1098 for each loan. Bonus
          depreciation, cost-segregation studies, and Section 179 elections
          are out of scope and should be applied at filing time.
        </Text>

        <Footer pageLabel={`SCHEDULE E · TY ${taxYear} · COVER`} />
      </Page>

      {/* One page per property */}
      {propertyData.map((d, idx) => (
        <Page key={idx} size="LETTER" style={s.page}>
          <Text style={s.brand}>SCHEDULE E · PROPERTY {idx + 1} OF {propertyData.length}</Text>
          <Text style={s.title}>{d.p.label}</Text>
          <Text style={s.subtitle}>{d.p.address || "—"}</Text>

          <View style={s.hero}>
            <Text style={s.heroLabel}>NET TAXABLE INCOME · {taxYear}</Text>
            <Text style={s.heroValue}>{fmt(d.taxableIncome)}</Text>
            <Text style={s.heroMeta}>{fmt(d.annualGross)} gross − {fmt(d.annualExp)} expenses − {fmt(d.annualDep)} depreciation</Text>
          </View>

          <Text style={s.sectionTitle}>Annual rents</Text>
          {(d.p.rooms || []).length > 0 ? (
            (d.p.rooms || []).map((r, ridx) => (
              <Row
                key={ridx}
                label={r.label}
                sub={r.occupied ? "Occupied" : "Vacant"}
                value={fmt((r.rent_cents || 0) * 12)}
              />
            ))
          ) : (
            <Text style={s.rowSub}>No rooms tracked — gross rents derived from property total.</Text>
          )}
          <Total label="Gross rents" value={fmt(d.annualGross)} />

          <Text style={s.sectionTitle}>Deductible operating expenses</Text>
          {d.fixed.map((e, eidx) => (
            <Row key={eidx} label={e.label} value={fmt((e.monthly_cents || 0) * 12)} />
          ))}
          {d.vacancyMonthly > 0 ? (
            <Row
              label="Vacancy allowance"
              sub={`${fmtPct(d.p.vacancy_bps_override ?? settings.default_vacancy_bps)} of gross rents`}
              value={fmt(d.vacancyMonthly * 12)}
            />
          ) : null}
          {d.capexMonthly > 0 ? (
            <Row
              label="CapEx reserve"
              sub={`${fmtPct(d.p.capex_bps_override ?? settings.default_capex_bps)} of gross rents`}
              value={fmt(d.capexMonthly * 12)}
            />
          ) : null}
          <Total label="Operating expenses" value={fmt(d.annualExp)} />

          <Text style={s.sectionTitle}>Depreciation</Text>
          <Row label="Cost basis" sub="Purchase price or market value at acquisition" value={fmt(d.basis)} />
          <Row label="Building basis (80%)" sub="Land excluded — 20% of basis" value={fmt(d.buildingBasis)} />
          <Row label="Recovery period" value="27.5 years (residential SL)" />
          <Total label="Annual depreciation" value={fmt(d.annualDep)} />

          {d.p.mortgage_balance_cents ? (
            <>
              <Text style={s.sectionTitle}>Mortgage (informational — not deducted here)</Text>
              <Row label="Balance" value={fmt(d.p.mortgage_balance_cents)} />
              <Row label="Annual payment" sub="P+I — request Form 1098 to split out interest" value={fmt(d.mortgagePaymentAnnual)} />
              {d.p.mortgage_rate_bps ? <Row label="Rate" value={fmtPct(d.p.mortgage_rate_bps)} /> : null}
              {d.p.mortgage_origin_date ? <Row label="Origin date" value={d.p.mortgage_origin_date} /> : null}
            </>
          ) : null}

          <Footer pageLabel={`SCHEDULE E · TY ${taxYear}`} />
        </Page>
      ))}
    </Document>
  );
}

function titleCase(s) {
  if (!s) return "";
  return String(s).split(/[\s_-]+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ── Lazy-loading + browser download helper ───────────────────────────

// react-pdf is huge. We don't want it in the main bundle, so the
// caller passes a *function* that returns the Document element and we
// dynamically import the renderer on demand.
export async function generateAndDownload(filename, makeDocument) {
  if (typeof window === "undefined") return;
  const { pdf } = await import("@react-pdf/renderer");
  const doc = makeDocument();
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
