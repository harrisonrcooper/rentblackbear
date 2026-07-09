import { describe, it, expect } from "vitest";

import {
  linesTotalCents,
  effectiveTotalCents,
  hasLineMismatch,
  byScope,
  lowestIn,
  spreadCents,
  acceptedIn,
  acceptQuote,
  budgetLineFor,
} from "../quotes";
import type { BuildQuote, BuildQuoteLine, QuoteStatus } from "@/actions/build/_store";

function line(partial: Partial<BuildQuoteLine> = {}): BuildQuoteLine {
  return { id: "l", description: "", quantity: 1, unit_price_cents: 0, ...partial };
}

function quote(partial: Partial<BuildQuote> = {}): BuildQuote {
  return {
    id: "q",
    vendor: "Acme",
    scope: "Framing",
    date: null,
    status: "received" as QuoteStatus,
    total_cents: 0,
    lines: [],
    doc_url: "",
    notes: "",
    ...partial,
  };
}

describe("linesTotalCents", () => {
  it("sums quantity times unit price across lines", () => {
    const q = quote({
      lines: [
        line({ quantity: 3, unit_price_cents: 100_00 }),
        line({ quantity: 2, unit_price_cents: 250_00 }),
      ],
    });
    expect(linesTotalCents(q)).toBe(3 * 100_00 + 2 * 250_00);
  });

  it("is zero when there are no lines", () => {
    expect(linesTotalCents(quote({ lines: [] }))).toBe(0);
  });

  it("tolerates a missing lines array", () => {
    expect(linesTotalCents(quote({ lines: undefined as unknown as BuildQuoteLine[] }))).toBe(0);
  });

  it("rounds each line to whole cents so no fractional cents accumulate", () => {
    // A fractional quantity times an odd cent price must not leak sub-cent dust.
    const q = quote({ lines: [line({ quantity: 2.5, unit_price_cents: 333 })] });
    expect(linesTotalCents(q)).toBe(Math.round(2.5 * 333));
    expect(Number.isInteger(linesTotalCents(q))).toBe(true);
  });

  it("rounds each line independently, not the grand sum", () => {
    // The extended price a builder writes on each line is itself a whole-cent
    // number, so we round per line and then add. Two lines of 2.5 × 333¢ each
    // extend to round(832.5)=833¢, summing to 1666¢. Rounding the raw grand
    // total instead would give round(1665.0)=1665¢ — a single-line test can't
    // tell the two apart, which is why this one has two lines.
    const q = quote({
      lines: [
        line({ quantity: 2.5, unit_price_cents: 333 }),
        line({ quantity: 2.5, unit_price_cents: 333 }),
      ],
    });
    expect(linesTotalCents(q)).toBe(Math.round(2.5 * 333) * 2);
    expect(linesTotalCents(q)).toBe(1666);
  });
});

describe("effectiveTotalCents", () => {
  it("uses the stated total when it is positive", () => {
    const q = quote({ total_cents: 500_00, lines: [line({ quantity: 1, unit_price_cents: 1_00 })] });
    expect(effectiveTotalCents(q)).toBe(500_00);
  });

  it("falls back to the line total when there is no stated total", () => {
    const q = quote({ total_cents: 0, lines: [line({ quantity: 4, unit_price_cents: 25_00 })] });
    expect(effectiveTotalCents(q)).toBe(100_00);
  });

  it("is zero when neither a stated total nor lines exist", () => {
    expect(effectiveTotalCents(quote())).toBe(0);
  });
});

describe("hasLineMismatch", () => {
  it("flags a stated total that disagrees with its line items", () => {
    // Builder wrote $10,000 at the bottom but the lines add to $9,500.
    const q = quote({
      total_cents: 10_000_00,
      lines: [
        line({ quantity: 1, unit_price_cents: 5_000_00 }),
        line({ quantity: 1, unit_price_cents: 4_500_00 }),
      ],
    });
    expect(hasLineMismatch(q)).toBe(true);
  });

  it("does not flag when the stated total matches the lines exactly", () => {
    const q = quote({
      total_cents: 9_500_00,
      lines: [
        line({ quantity: 1, unit_price_cents: 5_000_00 }),
        line({ quantity: 1, unit_price_cents: 4_500_00 }),
      ],
    });
    expect(hasLineMismatch(q)).toBe(false);
  });

  it("does not flag when there is no stated total to check against", () => {
    const q = quote({ total_cents: 0, lines: [line({ quantity: 1, unit_price_cents: 5_000_00 })] });
    expect(hasLineMismatch(q)).toBe(false);
  });

  it("does not flag when there are no lines to check", () => {
    expect(hasLineMismatch(quote({ total_cents: 10_000_00, lines: [] }))).toBe(false);
  });

  it("does not flag a negative stated total (treated as absent)", () => {
    const q = quote({ total_cents: -5_00, lines: [line({ quantity: 1, unit_price_cents: 5_00 })] });
    expect(hasLineMismatch(q)).toBe(false);
  });

  it("flags a one-cent discrepancy — the whole point is exactness", () => {
    const q = quote({ total_cents: 100_01, lines: [line({ quantity: 1, unit_price_cents: 100_00 })] });
    expect(hasLineMismatch(q)).toBe(true);
  });
});

describe("byScope", () => {
  it("groups quotes under their scope, preserving order within a scope", () => {
    const a = quote({ id: "a", scope: "Framing" });
    const b = quote({ id: "b", scope: "Roofing" });
    const c = quote({ id: "c", scope: "Framing" });
    const map = byScope([a, b, c]);
    expect(map.get("Framing")).toEqual([a, c]);
    expect(map.get("Roofing")).toEqual([b]);
    expect(map.size).toBe(2);
  });

  it("returns an empty map for no quotes", () => {
    expect(byScope([]).size).toBe(0);
  });
});

describe("lowestIn", () => {
  it("returns the lowest effective total among live bids", () => {
    const bids = [
      quote({ id: "a", total_cents: 300_00 }),
      quote({ id: "b", total_cents: 250_00 }),
      quote({ id: "c", total_cents: 400_00 }),
    ];
    expect(lowestIn(bids)).toBe(250_00);
  });

  it("ignores declined bids even when they are cheapest", () => {
    const bids = [
      quote({ id: "a", total_cents: 300_00 }),
      quote({ id: "b", total_cents: 100_00, status: "declined" }),
    ];
    expect(lowestIn(bids)).toBe(300_00);
  });

  it("is null when every bid is declined", () => {
    const bids = [
      quote({ id: "a", total_cents: 300_00, status: "declined" }),
      quote({ id: "b", total_cents: 250_00, status: "declined" }),
    ];
    expect(lowestIn(bids)).toBeNull();
  });

  it("is null for an empty set", () => {
    expect(lowestIn([])).toBeNull();
  });

  it("uses line totals for bids with no stated total", () => {
    const bids = [
      quote({ id: "a", total_cents: 0, lines: [line({ quantity: 2, unit_price_cents: 90_00 })] }),
      quote({ id: "b", total_cents: 200_00 }),
    ];
    expect(lowestIn(bids)).toBe(180_00);
  });
});

describe("spreadCents", () => {
  it("is highest minus lowest among live bids", () => {
    const bids = [
      quote({ id: "a", total_cents: 250_00 }),
      quote({ id: "b", total_cents: 400_00 }),
      quote({ id: "c", total_cents: 300_00 }),
    ];
    expect(spreadCents(bids)).toBe(150_00);
  });

  it("is zero with a single live bid", () => {
    expect(spreadCents([quote({ total_cents: 250_00 })])).toBe(0);
  });

  it("is zero when declines leave fewer than two live bids", () => {
    const bids = [
      quote({ id: "a", total_cents: 250_00 }),
      quote({ id: "b", total_cents: 400_00, status: "declined" }),
    ];
    expect(spreadCents(bids)).toBe(0);
  });

  it("is zero for an empty set", () => {
    expect(spreadCents([])).toBe(0);
  });
});

describe("acceptedIn", () => {
  it("returns the accepted bid", () => {
    const accepted = quote({ id: "b", status: "accepted" });
    expect(acceptedIn([quote({ id: "a" }), accepted])).toBe(accepted);
  });

  it("is null when nothing is accepted", () => {
    expect(acceptedIn([quote({ id: "a" }), quote({ id: "b" })])).toBeNull();
  });
});

describe("acceptQuote", () => {
  const framingA = quote({ id: "a", scope: "Framing", status: "received" });
  const framingB = quote({ id: "b", scope: "Framing", status: "received" });
  const roofing = quote({ id: "c", scope: "Roofing", status: "received" });

  it("accepts the target and declines its same-scope siblings", () => {
    const out = acceptQuote([framingA, framingB, roofing], "a");
    expect(out.find((q) => q.id === "a")!.status).toBe("accepted");
    expect(out.find((q) => q.id === "b")!.status).toBe("declined");
  });

  it("leaves quotes in other scopes untouched", () => {
    const out = acceptQuote([framingA, framingB, roofing], "a");
    expect(out.find((q) => q.id === "c")!.status).toBe("received");
  });

  it("never mutates the input array or its rows", () => {
    const input = [framingA, framingB, roofing];
    const snapshot = input.map((q) => ({ ...q }));
    acceptQuote(input, "a");
    expect(input).toEqual(snapshot);
    expect(framingA.status).toBe("received");
    expect(framingB.status).toBe("received");
  });

  it("returns a new array with new row objects", () => {
    const input = [framingA, framingB];
    const out = acceptQuote(input, "a");
    expect(out).not.toBe(input);
    expect(out[0]).not.toBe(framingA);
  });

  it("re-accepting flips a previously declined sibling correctly", () => {
    // Buyer accepted A, then changes his mind and accepts B.
    const first = acceptQuote([framingA, framingB], "a");
    const second = acceptQuote(first, "b");
    expect(second.find((q) => q.id === "b")!.status).toBe("accepted");
    expect(second.find((q) => q.id === "a")!.status).toBe("declined");
  });

  it("is a harmless copy when the id is not found", () => {
    const input = [framingA, framingB];
    const out = acceptQuote(input, "missing");
    expect(out).toEqual(input);
    expect(out).not.toBe(input);
  });

  it("accepting the only bid in a scope declines no one", () => {
    const solo = quote({ id: "s", scope: "Plumbing", status: "received" });
    const out = acceptQuote([solo, roofing], "s");
    expect(out.find((q) => q.id === "s")!.status).toBe("accepted");
    expect(out.find((q) => q.id === "c")!.status).toBe("received");
  });
});

describe("budgetLineFor", () => {
  it("labels the cost line by scope and vendor, priced at the effective total", () => {
    const q = quote({ scope: "Framing", vendor: "Acme", total_cents: 42_000_00 });
    expect(budgetLineFor(q)).toEqual({
      label: "Framing — Acme",
      estimate_cents: 42_000_00,
    });
  });

  it("prices from the lines when there is no stated total", () => {
    const q = quote({
      scope: "Roofing",
      vendor: "Beta",
      total_cents: 0,
      lines: [line({ quantity: 3, unit_price_cents: 1_000_00 })],
    });
    expect(budgetLineFor(q).estimate_cents).toBe(3_000_00);
  });
});
