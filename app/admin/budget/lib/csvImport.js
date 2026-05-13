// CSV importer for historical transaction backfill.
//
// Supports the export shapes you actually get from real tools:
//   - Mint (CSV export): Date, Description, Original Description, Amount, Transaction Type, Category, Account, Labels, Notes
//   - YNAB (Register export): Account, Flag, Date, Payee, Category Group/Category, Memo, Outflow, Inflow, Cleared
//   - Apple Card / Chase / Amex statements: Date, Description, Amount, Category, ...
//   - Generic: any header row whose columns we can heuristically map.
//
// Parsing is RFC-4180-ish (handles quoted cells with embedded commas
// and doubled quotes). Auto-detection scores each column header
// against a set of regex patterns and picks the best match. The
// caller can override mappings before commit.

import { predictCategory } from "./predict";

// Tiny but correct RFC-4180-style line parser. Streams char-by-char,
// tracks an in-quote state, and treats "" inside a quoted cell as a
// literal quote. Handles \r\n and \n line endings.
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else if (ch === "\r") { /* swallow */ }
      else cell += ch;
    }
  }
  // Trailing cell / row
  if (cell.length > 0 || row.length > 0) { row.push(cell); rows.push(row); }
  // Drop trailing empty rows.
  while (rows.length > 0 && rows[rows.length - 1].every((c) => c.trim() === "")) rows.pop();
  return rows;
}

// Column-detection scoring. Each field has a list of header regexes
// in priority order; first match wins. Generic + tool-specific
// patterns combined so Mint + YNAB + generic exports all "just work."
const FIELD_PATTERNS = {
  date:        [/^date$/i, /^trans.*date/i, /^posting.*date/i, /^when$/i],
  amount:      [/^amount$/i, /^total$/i, /^debit$/i],
  inflow:      [/^inflow$/i, /^credit$/i, /^deposit$/i, /^income$/i],
  outflow:     [/^outflow$/i, /^debit$/i, /^withdraw/i, /^spent$/i, /^expense$/i],
  description: [/^description$/i, /^payee$/i, /^merchant$/i, /^name$/i, /^vendor$/i, /^memo$/i],
  category:    [/^category$/i, /^category group/i, /^classification$/i, /^tag/i],
  note:        [/^note$/i, /^memo$/i, /^labels$/i, /^comment/i],
};

export function detectColumns(headers) {
  const map = {};
  const used = new Set();
  for (const field of Object.keys(FIELD_PATTERNS)) {
    const patterns = FIELD_PATTERNS[field];
    for (const pattern of patterns) {
      const idx = headers.findIndex((h, i) => !used.has(i) && pattern.test((h || "").trim()));
      if (idx >= 0) {
        map[field] = idx;
        used.add(idx);
        break;
      }
    }
  }
  return map;
}

// Normalize a date cell to ISO YYYY-MM-DD. Handles US-style M/D/YYYY,
// ISO YYYY-MM-DD, and ISO with timestamps. Returns null on failure.
function normalizeDate(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  // ISO already?
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  // US-style M/D/YY or M/D/YYYY
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    let y = parseInt(m[3], 10);
    if (y < 100) y += 2000;
    const mo = String(parseInt(m[1], 10)).padStart(2, "0");
    const d = String(parseInt(m[2], 10)).padStart(2, "0");
    return `${y}-${mo}-${d}`;
  }
  // Last resort: let Date() try.
  const dt = new Date(s);
  if (Number.isNaN(dt.getTime())) return null;
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

// "$1,234.56" → 123456 (cents). Negative on parens or leading "-".
function parseMoney(raw) {
  if (!raw) return 0;
  const s = String(raw).trim();
  if (!s) return 0;
  const isNeg = /^\(.*\)$/.test(s) || s.startsWith("-");
  const stripped = s.replace(/[^0-9.]/g, "");
  if (!stripped) return 0;
  const dollars = parseFloat(stripped);
  if (Number.isNaN(dollars)) return 0;
  const cents = Math.round(dollars * 100);
  return isNeg ? -cents : cents;
}

// Build importable rows from parsed CSV + a column mapping. Returns:
//   {
//     rows: [{ date, description, amount_cents, category_label, note }],
//     warnings: [...],
//   }
//
// Amount semantics:
//   - if outflow column exists, amount = outflow - inflow → POSITIVE
//     means money out (matches monthly_actuals convention)
//   - else if `amount` column exists, we infer: positive amount in
//     Mint/Apple etc. is income → we INVERT (-amount → outflow). YNAB
//     follows opposite convention — that's why outflow/inflow take
//     priority.
//   - Caller can supply `amountSign: "positive_is_outflow" |
//     "negative_is_outflow"` to override.
export function buildImportRows(parsed, columnMap, opts = {}) {
  const warnings = [];
  const rows = [];
  if (!parsed || parsed.length < 2) {
    return { rows, warnings: ["CSV has no data rows."] };
  }
  // Skip the header row.
  const dataRows = parsed.slice(1);
  const categoriesKnown = opts.categoriesKnown || [];
  const defaultCategory = opts.defaultCategory || null;

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (row.every((c) => (c || "").trim() === "")) continue;

    const dateRaw = columnMap.date != null ? row[columnMap.date] : "";
    const date = normalizeDate(dateRaw);
    if (!date) { warnings.push(`Row ${i + 2}: unrecognized date "${dateRaw}"`); continue; }

    let amount_cents = 0;
    if (columnMap.outflow != null || columnMap.inflow != null) {
      const out = columnMap.outflow != null ? parseMoney(row[columnMap.outflow]) : 0;
      const inn = columnMap.inflow  != null ? parseMoney(row[columnMap.inflow])  : 0;
      amount_cents = Math.abs(out) - Math.abs(inn);
    } else if (columnMap.amount != null) {
      const raw = parseMoney(row[columnMap.amount]);
      // Mint convention: positive = income, negative = expense. We
      // store positive = outflow, so invert.
      const sign = opts.amountSign === "positive_is_outflow" ? 1 : -1;
      amount_cents = raw * sign;
    } else {
      warnings.push(`Row ${i + 2}: no amount column mapped, skipping.`);
      continue;
    }

    if (amount_cents === 0) {
      warnings.push(`Row ${i + 2}: zero amount, skipping.`);
      continue;
    }

    const description = columnMap.description != null ? (row[columnMap.description] || "").trim() : "";
    const csvCategory = columnMap.category != null ? (row[columnMap.category] || "").trim() : "";

    // Resolve the category: first match the CSV's category label
    // against a known envelope (case-insensitive), then fall back to
    // predictCategory on the description, then defaultCategory.
    let category_label = null;
    if (csvCategory) {
      const lc = csvCategory.toLowerCase();
      const match = categoriesKnown.find((c) => c.toLowerCase() === lc);
      if (match) category_label = match;
    }
    if (!category_label && description) {
      const guess = predictCategory(description, categoriesKnown);
      if (guess) category_label = guess;
    }
    if (!category_label) category_label = defaultCategory;

    const note = columnMap.note != null && row[columnMap.note]
      ? String(row[columnMap.note]).trim()
      : description;

    rows.push({
      date,
      description,
      amount_cents,
      category_label,
      note,
    });
  }

  return { rows, warnings };
}
