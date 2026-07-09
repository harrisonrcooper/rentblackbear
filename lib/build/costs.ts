// The build's money rollup. One implementation, because two screens print
// these numbers and they must never disagree.
//
// The bug this module exists to kill: "Revised cost" was computed as
// `sum(estimate_cents) + approved change orders`, ignoring `actual_cents`
// entirely. So a homeowner who diligently recorded that framing came in at
// $92,000 against a $70,000 estimate still saw a revised cost built on the
// $70,000 — and a "left to pay" and an "under budget" verdict derived from it.
// The same file computed the tax cost basis as `actual_cents || estimate_cents`,
// twelve lines below. Same file, two truths.
//
// A line's cost is what it ACTUALLY cost once you know, and what you think it
// will cost until then. That is the only definition under which the dashboard's
// headline number means anything.

export interface CostLineLike {
  estimate_cents?: number;
  actual_cents?: number;
  in_basis?: boolean;
}

export interface ChangeOrderLike {
  status?: string;
  kind?: string;
  amount_cents?: number;
}

const int = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? Math.trunc(v) : 0);

/** What this line costs, best current knowledge: actual if recorded, else estimate. */
export function lineCents(line: CostLineLike): number {
  const actual = int(line.actual_cents);
  return actual > 0 ? actual : int(line.estimate_cents);
}

export function estimateCents(lines: CostLineLike[]): number {
  return lines.reduce((s, c) => s + int(c.estimate_cents), 0);
}

/** Only lines with money actually spent. Summing zeros would imply nothing is spent. */
export function actualCents(lines: CostLineLike[]): number {
  return lines.reduce((s, c) => s + int(c.actual_cents), 0);
}

/** Approved change orders only. A credit subtracts; anything unapproved is not real yet. */
export function approvedChangeOrderCents(orders: ChangeOrderLike[]): number {
  return orders
    .filter((o) => o.status === "approved")
    .reduce((s, o) => s + (o.kind === "credit" ? -1 : 1) * int(o.amount_cents), 0);
}

/**
 * The build's current forecast cost: every line at its best-known price, plus
 * approved change orders. This is the number the dashboard leads with.
 */
export function revisedCents(lines: CostLineLike[], orders: ChangeOrderLike[]): number {
  return lines.reduce((s, c) => s + lineCents(c), 0) + approvedChangeOrderCents(orders);
}

/** Never negative: having paid more than the forecast means nothing is left to pay. */
export function leftToPayCents(revised: number, paidCents: number): number {
  return Math.max(0, revised - int(paidCents));
}

/** Actual minus estimate. Positive is over, negative is under. */
export function variance(estimate: number, actual: number): number {
  return int(actual) - int(estimate);
}

/** Lines that count toward the home's tax cost basis, at their best-known price. */
export function costBasisCents(lines: CostLineLike[]): number {
  return lines.filter((c) => c.in_basis !== false).reduce((s, c) => s + lineCents(c), 0);
}

/** Cost per square foot, rounded to whole cents. Zero when the size is unknown. */
export function perSquareFootCents(revised: number, sqft: number): number {
  return sqft > 0 ? Math.round(revised / sqft) : 0;
}
