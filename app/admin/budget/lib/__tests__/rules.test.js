import { describe, it, expect } from "vitest";
import {
  applyRules,
  predictCategoryForTxn,
  suggestRuleFromTxn,
  describeRule,
} from "../rules";

const txn = (over = {}) => ({
  merchant_name: "Costco",
  name: "Costco Wholesale #1234",
  plaid_category_primary: "FOOD_AND_DRINK",
  plaid_category_detailed: "FOOD_AND_DRINK_GROCERIES",
  amount_cents: 12_345,
  date: "2026-05-10",
  ...over,
});

describe("applyRules", () => {
  it("returns null when rules array is empty", () => {
    expect(applyRules([], txn())).toBeNull();
  });

  it("matches by merchant_name contains (case-insensitive)", () => {
    const rules = [{
      id: "r1", enabled: true, match_field: "merchant_name", match_op: "contains",
      match_value: "costco", target_category_label: "Groceries",
    }];
    expect(applyRules(rules, txn())?.id).toBe("r1");
  });

  it("skips disabled rules", () => {
    const rules = [{
      id: "r1", enabled: false, match_field: "merchant_name", match_op: "contains",
      match_value: "costco", target_category_label: "Groceries",
    }];
    expect(applyRules(rules, txn())).toBeNull();
  });

  it("first matching rule wins (priority by array order)", () => {
    const rules = [
      { id: "r1", enabled: true, match_field: "merchant_name", match_op: "contains", match_value: "costco", target_category_label: "Groceries" },
      { id: "r2", enabled: true, match_field: "merchant_name", match_op: "contains", match_value: "costco", target_category_label: "Bulk" },
    ];
    expect(applyRules(rules, txn())?.id).toBe("r1");
  });

  it("supports starts_with against name field", () => {
    const rules = [{
      id: "r1", enabled: true, match_field: "name", match_op: "starts_with",
      match_value: "costco wholesale", target_category_label: "Groceries",
    }];
    expect(applyRules(rules, txn())?.id).toBe("r1");
  });

  it("supports equals against plaid_category", () => {
    const rules = [{
      id: "r1", enabled: true, match_field: "plaid_category", match_op: "contains",
      match_value: "GROCERIES", target_category_label: "Groceries",
    }];
    expect(applyRules(rules, txn())?.id).toBe("r1");
  });

  it("regex op gracefully ignores invalid regexes", () => {
    const rules = [{
      id: "r1", enabled: true, match_field: "merchant_name", match_op: "regex",
      match_value: "[unclosed", target_category_label: "Groceries",
    }];
    expect(applyRules(rules, txn())).toBeNull();
  });
});

describe("predictCategoryForTxn", () => {
  it("uses a matched rule and reports source=rule", () => {
    const rules = [{
      id: "r1", enabled: true, match_field: "merchant_name", match_op: "contains",
      match_value: "costco", target_category_label: "Groceries",
    }];
    const r = predictCategoryForTxn(rules, txn(), ["Groceries"]);
    expect(r.source).toBe("rule");
    expect(r.category).toBe("Groceries");
  });

  it("falls back to regex prediction when no rule matches", () => {
    const r = predictCategoryForTxn([], txn(), ["Groceries", "Gas", "Rent"]);
    // Regex predictor has a "costco" matcher that points to Groceries.
    expect(r.source).toBe("predict");
    expect(r.category).toBe("Groceries");
  });

  it("returns source=none when both rule + regex miss", () => {
    const r = predictCategoryForTxn([], txn({ merchant_name: "Obscure Local Shop" }), ["Rent"]);
    expect(r.source).toBe("none");
    expect(r.category).toBeNull();
  });
});

describe("suggestRuleFromTxn", () => {
  it("suggests merchant_name contains <merchant> when merchant is present", () => {
    const sug = suggestRuleFromTxn(txn(), "Groceries");
    expect(sug.match_field).toBe("merchant_name");
    expect(sug.match_op).toBe("contains");
    expect(sug.match_value).toBe("Costco");
    expect(sug.target_category_label).toBe("Groceries");
  });

  it("falls back to name + first two words when merchant is missing", () => {
    const sug = suggestRuleFromTxn(txn({ merchant_name: "" }), "Groceries");
    expect(sug.match_field).toBe("name");
    expect(sug.match_value).toBe("Costco Wholesale");
  });
});

describe("describeRule", () => {
  it("renders a readable summary", () => {
    const desc = describeRule({
      match_field: "merchant_name", match_op: "contains",
      match_value: "Costco", target_category_label: "Groceries",
    });
    expect(desc).toContain("Costco");
    expect(desc).toContain("Groceries");
    expect(desc).toContain("contains");
  });
});
