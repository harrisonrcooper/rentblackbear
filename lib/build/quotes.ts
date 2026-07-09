// Contractor quotes and bids — pure comparison logic (brief section 6.9).
//
// Money is integer cents throughout; nothing here touches React or the
// network. The section imports these; tests drive them directly.
//
// The load-bearing idea is that a quote carries TWO totals: the number the
// builder wrote at the bottom (`total_cents`) and the sum of his own line
// items. Those two disagree more often than anyone admits — a transposed
// digit, a line dropped from the summary, "plus tax" left out. We surface the
// gap rather than silently trusting one, so the buyer sees it before he signs.

import type { BuildQuote } from "@/actions/build/_store";

/** Sum of quantity × unit_price over a quote's line items, in cents. */
export function linesTotalCents(quote: BuildQuote): number {
  const lines = quote.lines || [];
  return lines.reduce((sum, l) => sum + Math.round(l.quantity * l.unit_price_cents), 0);
}

/**
 * The number to compare and budget with. A stated total is authoritative when
 * present; otherwise fall back to the line items. `total_cents > 0` (not just
 * non-zero) because a stated total is never legitimately negative and 0 means
 * "not filled in yet", at which point the lines are the only signal we have.
 */
export function effectiveTotalCents(quote: BuildQuote): number {
  return quote.total_cents > 0 ? quote.total_cents : linesTotalCents(quote);
}

/**
 * True when the builder's stated total contradicts his own line items. Only
 * meaningful when he actually gave us both: a stated total AND at least one
 * line. With no stated total there is nothing to disagree with; with no lines
 * there is nothing to check it against.
 */
export function hasLineMismatch(quote: BuildQuote): boolean {
  const lines = quote.lines || [];
  if (quote.total_cents <= 0 || lines.length === 0) return false;
  return linesTotalCents(quote) !== quote.total_cents;
}

/** Group quotes by scope so like-for-like bids compare side by side. */
export function byScope(quotes: BuildQuote[]): Map<string, BuildQuote[]> {
  const map = new Map<string, BuildQuote[]>();
  for (const q of quotes) {
    const bucket = map.get(q.scope);
    if (bucket) bucket.push(q);
    else map.set(q.scope, [q]);
  }
  return map;
}

/** A declined bid is out of the running — never counts toward comparisons. */
function inRunning(bids: BuildQuote[]): BuildQuote[] {
  return bids.filter((b) => b.status !== "declined");
}

/** Lowest effective total among non-declined bids; null when there are none. */
export function lowestIn(bids: BuildQuote[]): number | null {
  const totals = inRunning(bids).map(effectiveTotalCents);
  if (totals.length === 0) return null;
  return Math.min(...totals);
}

/**
 * Highest minus lowest among non-declined bids — how far apart the field is.
 * Zero with fewer than two live bids: a single bid has no spread to speak of.
 */
export function spreadCents(bids: BuildQuote[]): number {
  const totals = inRunning(bids).map(effectiveTotalCents);
  if (totals.length < 2) return 0;
  return Math.max(...totals) - Math.min(...totals);
}

/** The accepted bid in a set, or null. */
export function acceptedIn(bids: BuildQuote[]): BuildQuote | null {
  return bids.find((b) => b.status === "accepted") || null;
}

/**
 * Accept one quote and decline every same-scope sibling in one move — you can
 * only hire one contractor for a job. Returns a NEW array; the input is never
 * mutated (React state must stay immutable, and callers rely on it). Quotes in
 * other scopes, and the target itself, are left untouched apart from the
 * status flip. A no-op copy comes back if the id isn't found.
 */
export function acceptQuote(quotes: BuildQuote[], id: string): BuildQuote[] {
  const target = quotes.find((q) => q.id === id);
  if (!target) return quotes.map((q) => ({ ...q }));
  return quotes.map((q) => {
    if (q.id === id) return { ...q, status: "accepted" };
    if (q.scope === target.scope) return { ...q, status: "declined" };
    return { ...q };
  });
}

/**
 * The costs-array row an accepted quote becomes. The caller passes this to
 * addRow("costs", …); the returned estimate is the quote's effective total so
 * the budget picks up the real number the buyer just committed to.
 */
export function budgetLineFor(quote: BuildQuote): { label: string; estimate_cents: number } {
  return {
    label: `${quote.scope} — ${quote.vendor}`,
    estimate_cents: effectiveTotalCents(quote),
  };
}
