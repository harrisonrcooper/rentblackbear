import { describe, it, expect } from "vitest";
import { parseCSV, detectColumns, buildImportRows } from "../csvImport";

describe("parseCSV", () => {
  it("handles a basic CSV", () => {
    const rows = parseCSV("a,b,c\n1,2,3\n4,5,6\n");
    expect(rows).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
      ["4", "5", "6"],
    ]);
  });

  it("handles quoted cells containing commas", () => {
    const rows = parseCSV(`date,desc,amount\n2026-01-01,"Costco, MS",-45.00\n`);
    expect(rows[1]).toEqual(["2026-01-01", "Costco, MS", "-45.00"]);
  });

  it("handles doubled quotes as literal quote", () => {
    const rows = parseCSV(`a,b\n"she said ""hi""",2\n`);
    expect(rows[1][0]).toBe('she said "hi"');
  });

  it("handles \\r\\n line endings", () => {
    const rows = parseCSV("a,b\r\n1,2\r\n");
    expect(rows).toEqual([["a", "b"], ["1", "2"]]);
  });

  it("drops trailing empty rows", () => {
    const rows = parseCSV("a,b\n1,2\n\n\n");
    expect(rows).toEqual([["a", "b"], ["1", "2"]]);
  });
});

describe("detectColumns", () => {
  it("recognizes Mint headers", () => {
    const map = detectColumns(["Date", "Description", "Original Description", "Amount", "Transaction Type", "Category", "Account", "Labels", "Notes"]);
    expect(map.date).toBe(0);
    expect(map.description).toBe(1);
    expect(map.amount).toBe(3);
    expect(map.category).toBe(5);
  });

  it("recognizes YNAB headers", () => {
    const map = detectColumns(["Account", "Flag", "Date", "Payee", "Category Group/Category", "Memo", "Outflow", "Inflow", "Cleared"]);
    expect(map.date).toBe(2);
    expect(map.description).toBe(3);
    expect(map.outflow).toBe(6);
    expect(map.inflow).toBe(7);
  });

  it("returns an empty map when no headers match", () => {
    const map = detectColumns(["foo", "bar", "baz"]);
    expect(map).toEqual({});
  });
});

describe("buildImportRows", () => {
  it("converts a Mint-style export (negative=expense)", () => {
    const parsed = [
      ["Date", "Description", "Amount", "Category"],
      ["2026-01-15", "Costco", "-123.45", "Groceries"],
      ["2026-01-20", "Paycheck", "5000.00", "Income"],
    ];
    const columnMap = { date: 0, description: 1, amount: 2, category: 3 };
    const { rows } = buildImportRows(parsed, columnMap, {
      categoriesKnown: ["Groceries", "Income"],
      amountSign: "negative_is_outflow",
    });
    // Mint convention: negative amount = expense → positive in cents.
    expect(rows[0]).toMatchObject({ amount_cents: 12345, category_label: "Groceries" });
    // Positive Mint amount = income → negative cents (refund/inflow).
    expect(rows[1].amount_cents).toBe(-500_000);
  });

  it("converts a YNAB outflow/inflow split", () => {
    const parsed = [
      ["Date", "Payee", "Outflow", "Inflow"],
      ["2026-01-15", "Costco", "$123.45", ""],
      ["2026-01-20", "Tax refund", "", "$500.00"],
    ];
    const columnMap = { date: 0, description: 1, outflow: 2, inflow: 3 };
    const { rows } = buildImportRows(parsed, columnMap, { categoriesKnown: [], defaultCategory: "Other" });
    expect(rows[0].amount_cents).toBe(12345);
    expect(rows[1].amount_cents).toBe(-50000);
  });

  it("falls back to default category when CSV category not in known envelopes", () => {
    const parsed = [
      ["Date", "Amount", "Category"],
      ["2026-01-15", "-50.00", "Unknown Bucket"],
    ];
    const columnMap = { date: 0, amount: 1, category: 2 };
    const { rows } = buildImportRows(parsed, columnMap, {
      categoriesKnown: ["Groceries"],
      defaultCategory: "Other",
    });
    expect(rows[0].category_label).toBe("Other");
  });

  it("warns on unparseable dates and skips that row", () => {
    const parsed = [
      ["Date", "Amount"],
      ["not a date", "-10.00"],
      ["2026-01-01", "-20.00"],
    ];
    const columnMap = { date: 0, amount: 1 };
    const { rows, warnings } = buildImportRows(parsed, columnMap, { categoriesKnown: [] });
    expect(rows).toHaveLength(1);
    expect(warnings.some((w) => w.includes("unrecognized date"))).toBe(true);
  });
});
