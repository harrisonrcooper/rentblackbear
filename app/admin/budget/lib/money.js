// Money formatting + recurrence conversion helpers. Every monetary
// value crossing this module is in cents (integer); rates in basis
// points where applicable. No floats, ever.

export function fmtUsd(cents, opts = {}) {
  if (cents == null || isNaN(cents)) return "—";
  const n = cents / 100;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.compact ? 0 : (Math.abs(n) >= 1000 ? 0 : 2),
    maximumFractionDigits: opts.compact ? 0 : (Math.abs(n) >= 1000 ? 0 : 2),
  });
}

// Compact summary form used for tiles and big-number summaries.
// Examples: $0, $1.2k, $1.2M, $9.3M.
export function fmtCompact(cents) {
  if (cents == null || isNaN(cents)) return "—";
  const n = cents / 100;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}M`;
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${Math.round(n)}`;
}

// Standard pay-frequency conversions, always landing at "monthly" cents.
// 26 paychecks / 12 months keeps biweekly math honest (not just ×2).
export const biweeklyToMonthly = (bi) => Math.round((bi * 26) / 12);
export const yearlyToMonthly = (yr) => Math.round(yr / 12);

export function categoryMonthly(c) {
  // Source-of-truth precedence: explicit monthly_cents > biweekly→monthly
  // > yearly→monthly. Each category row stores all three columns so the
  // UI can flip the view without losing precision.
  if (c.default_monthly_cents) return c.default_monthly_cents;
  if (c.default_biweekly_cents) return biweeklyToMonthly(c.default_biweekly_cents);
  if (c.default_yearly_cents) return yearlyToMonthly(c.default_yearly_cents);
  return 0;
}

export function incomeMonthly(i) {
  switch (i.frequency) {
    case "weekly":      return Math.round((i.net_amount_cents * 52) / 12);
    case "biweekly":    return biweeklyToMonthly(i.net_amount_cents);
    case "semimonthly": return i.net_amount_cents * 2;
    case "monthly":     return i.net_amount_cents;
    case "yearly":      return yearlyToMonthly(i.net_amount_cents);
    default:            return i.net_amount_cents;
  }
}
