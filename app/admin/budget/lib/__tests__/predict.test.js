import { describe, it, expect } from "vitest";
import { predictCategory, debugPredict } from "../predict";

describe("predictCategory — input shape tolerance", () => {
  it("accepts an array of bare label strings", () => {
    const out = predictCategory("Costco Wholesale", ["Groceries", "Gas", "Rent"]);
    expect(out).toBe("Groceries");
  });

  it("accepts an array of category objects with .label", () => {
    const out = predictCategory("Costco Wholesale", [
      { label: "Groceries", group_key: "food" },
      { label: "Gas", group_key: "transport" },
    ]);
    expect(out).toEqual({ label: "Groceries", group_key: "food" });
  });

  it("returns the SAME shape it received (string in → string out)", () => {
    const stringResult = predictCategory("Shell #4421", ["Gas", "Groceries"]);
    expect(typeof stringResult).toBe("string");
    const objectResult = predictCategory("Shell #4421", [{ label: "Gas" }, { label: "Groceries" }]);
    expect(typeof objectResult).toBe("object");
  });

  it("returns null on empty input", () => {
    expect(predictCategory("", ["Groceries"])).toBeNull();
    expect(predictCategory("Costco", [])).toBeNull();
    expect(predictCategory(null, ["Groceries"])).toBeNull();
    expect(predictCategory("Costco", null)).toBeNull();
  });

  it("tolerates objects with missing or empty .label", () => {
    const out = predictCategory("Costco", [{ group_key: "food" }, { label: "Groceries" }]);
    expect(out).toEqual({ label: "Groceries" });
  });
});

describe("predictCategory — curated predictors", () => {
  const cats = ["Groceries", "Gas", "Restaurants", "Amazon", "Subscriptions", "Cell"];

  it("Costco → Groceries", () => {
    expect(predictCategory("Costco Wholesale #1234", cats)).toBe("Groceries");
  });
  it("Shell → Gas", () => {
    expect(predictCategory("Shell #4421 GAS", cats)).toBe("Gas");
  });
  it("Chipotle → Restaurants (via 'restaur' hint substring)", () => {
    expect(predictCategory("Chipotle 0123", cats)).toBe("Restaurants");
  });
  it("Amazon → Amazon", () => {
    expect(predictCategory("AMZN Mktp", cats)).toBe("Amazon");
  });
  it("Spotify → Subscriptions (via 'subscription' hint substring)", () => {
    expect(predictCategory("Spotify Premium", cats)).toBe("Subscriptions");
  });
  it("T-Mobile → Cell", () => {
    expect(predictCategory("T-Mobile bill", cats)).toBe("Cell");
  });
});

describe("predictCategory — fallback substring match", () => {
  it("matches when description contains the category label verbatim", () => {
    // No curated predictor for "Yoga", but the description includes the
    // word — fallback substring match should pick it up.
    expect(predictCategory("yoga studio drop-in", ["Yoga", "Gas"])).toBe("Yoga");
  });

  it("returns null when nothing matches", () => {
    expect(predictCategory("Some obscure niche shop", ["Rent", "Mortgage"])).toBeNull();
  });
});

describe("debugPredict", () => {
  it("returns the matching predictor row", () => {
    const row = debugPredict("Costco Wholesale");
    expect(row).toBeDefined();
    expect(row.hints).toContain("grocer");
  });
  it("returns null when no predictor matches", () => {
    expect(debugPredict("zzzzz nothing matches this")).toBeNull();
  });
});
