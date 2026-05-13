// CSV builders + browser download helper. Pure JS / DOM only — runs
// fully client-side, no server round-trip.
//
// All exports treat money in cents internally and convert to plain
// dollar decimals at the boundary so the CSV imports cleanly into
// Excel / Numbers / Sheets / a CPA's tax software.

import { propertyMonthlyGross, propertyMonthlyExpenses } from "./calc";

// RFC-4180-ish quoting. Escapes embedded quotes by doubling, wraps a
// field in quotes whenever it contains a comma, newline, or quote.
function quoteCell(value) {
  if (value == null) return "";
  const s = String(value);
  if (s === "") return "";
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// `rows` = [{ col: value }] with a shared key shape. The first row
// drives the header. Missing keys render as empty cells.
export function toCSV(rows, columns) {
  if (!rows || rows.length === 0) return "";
  const headers = columns || Object.keys(rows[0]);
  const lines = [headers.map(quoteCell).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => quoteCell(row[h])).join(","));
  }
  return lines.join("\n") + "\n";
}

export function downloadCSV(filename, csv) {
  if (typeof window === "undefined") return;
  // BOM so Excel auto-detects UTF-8 instead of mojibake-ing dollar signs.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
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

const dollars = (cents) => (cents == null ? "" : (cents / 100).toFixed(2));

// IRS Schedule E-shaped row per operating + pipeline property. Land
// vs building split uses the 80/20 default we apply elsewhere; CPA
// can override in their software.
export function buildScheduleE(state, year = new Date().getFullYear()) {
  const rows = [];
  for (const p of state.properties || []) {
    const monthlyGross = propertyMonthlyGross(p);
    const monthlyExp = propertyMonthlyExpenses(p, state.settings);
    const annualGross = monthlyGross * 12;
    const annualExp = monthlyExp * 12;
    // 27.5-year straight-line depreciation on 80% building basis.
    const basis = p.purchase_price_cents ?? p.market_value_cents ?? 0;
    const annualDep = Math.round(basis * 0.8 / 27.5);
    const taxable = annualGross - annualExp - annualDep;
    rows.push({
      property: p.label,
      address: p.address || "",
      status: p.status,
      year,
      gross_rents_usd: dollars(annualGross),
      operating_expenses_usd: dollars(annualExp),
      mortgage_payment_annual_usd: dollars((p.mortgage_payment_cents || 0) * 12),
      depreciation_basis_usd: dollars(basis),
      annual_depreciation_usd: dollars(annualDep),
      net_taxable_income_usd: dollars(taxable),
      market_value_usd: dollars(p.market_value_cents),
      mortgage_balance_usd: dollars(p.mortgage_balance_cents),
      mortgage_rate_pct: p.mortgage_rate_bps != null ? (p.mortgage_rate_bps / 100).toFixed(3) : "",
      mortgage_origin_date: p.mortgage_origin_date || "",
    });
  }
  const columns = [
    "property", "address", "status", "year",
    "gross_rents_usd", "operating_expenses_usd", "mortgage_payment_annual_usd",
    "depreciation_basis_usd", "annual_depreciation_usd", "net_taxable_income_usd",
    "market_value_usd", "mortgage_balance_usd", "mortgage_rate_pct", "mortgage_origin_date",
  ];
  return { csv: toCSV(rows, columns), rowCount: rows.length };
}

// One row per logged expense entry — drops straight into a "transaction
// log" spreadsheet. Useful as the raw audit trail for a CPA.
export function buildMonthlyActuals(state) {
  const rows = (state.monthly_actuals || [])
    .slice()
    .sort((a, b) => {
      const ax = a.paid_on || a.month || "";
      const bx = b.paid_on || b.month || "";
      return ax < bx ? 1 : ax > bx ? -1 : 0;
    })
    .map((a) => ({
      date: a.paid_on || (a.month ? `${a.month}` : ""),
      month: a.month || "",
      category: a.category_label,
      amount_usd: dollars(a.amount_cents),
      note: a.note || "",
    }));
  return { csv: toCSV(rows, ["date", "month", "category", "amount_usd", "note"]), rowCount: rows.length };
}

// Daily net-worth + cash-flow history snapshot.
export function buildHistorySnapshot(state) {
  const rows = (state.history || [])
    .slice()
    .sort((a, b) => (a.day < b.day ? -1 : 1))
    .map((h) => ({
      day: h.day,
      net_worth_usd: dollars(h.net_worth_cents),
      personal_monthly_usd: dollars(h.personal_monthly_cents),
      rental_noi_usd: dollars(h.rental_noi_cents),
      hero_conservative_usd: dollars(h.hero_conservative_cents),
      saved_this_month_usd: dollars(h.saved_this_month_cents),
    }));
  return { csv: toCSV(rows, ["day", "net_worth_usd", "personal_monthly_usd", "rental_noi_usd", "hero_conservative_usd", "saved_this_month_usd"]), rowCount: rows.length };
}

// All active recurring bills.
export function buildBills(state) {
  const rows = (state.bills || [])
    .filter((b) => !b.archived_at)
    .map((b) => ({
      label: b.label,
      vendor: b.vendor || "",
      amount_usd: dollars(b.amount_cents),
      cadence: b.cadence,
      due_day: b.due_day ?? "",
      due_month: b.due_month ?? "",
      category: b.category_label || "",
      account: b.account || "",
      autopay: b.autopay ? "yes" : "no",
      last_paid: b.last_paid_at || "",
    }));
  return { csv: toCSV(rows, ["label", "vendor", "amount_usd", "cadence", "due_day", "due_month", "category", "account", "autopay", "last_paid"]), rowCount: rows.length };
}

// Full state JSON — backup / restore use case. Useful for CPA hand-
// off too: the whole picture in one blob.
export function buildFullSnapshotJSON(state) {
  return JSON.stringify(state, null, 2);
}

export function downloadJSON(filename, json) {
  if (typeof window === "undefined") return;
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
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

// Default-named filename like "schedule-e-2026.csv".
export function defaultFilename(kind, ext = "csv", suffix) {
  const date = new Date();
  const stamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return `rentblackbear-${kind}${suffix ? `-${suffix}` : ""}-${stamp}.${ext}`;
}
