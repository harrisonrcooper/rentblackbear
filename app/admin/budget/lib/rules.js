// Categorization rule engine.
//
// Rules are user-defined "always do this" overrides. Each rule says:
//
//   if <field> <op> <value> → put it in <target_category_label>
//
// Evaluated in array order; the first rule that matches wins. Rules
// are applied during Plaid sync (in syncPlaidTransactions) and during
// the inline accept flow (in case a new rule was just added and the
// inbox should re-classify on the fly).
//
// The hard-coded regex predictors in lib/predict still run as a
// fallback for transactions no rule matches — that's how new users
// without rules still get sensible defaults.

import { predictCategory } from "./predict";

function fieldValue(rule, txn) {
  if (rule.match_field === "merchant_name") return (txn.merchant_name || "").toString();
  if (rule.match_field === "name") return (txn.name || "").toString();
  if (rule.match_field === "plaid_category") {
    const a = txn.plaid_category_detailed || "";
    const b = txn.plaid_category_primary || "";
    return `${a} ${b}`.trim();
  }
  return "";
}

function ruleHits(rule, txn) {
  if (!rule.enabled) return false;
  const haystack = fieldValue(rule, txn);
  if (!haystack) return false;
  const needle = (rule.match_value || "").trim();
  if (!needle) return false;
  const op = rule.match_op || "contains";
  if (op === "contains") return haystack.toLowerCase().includes(needle.toLowerCase());
  if (op === "starts_with") return haystack.toLowerCase().startsWith(needle.toLowerCase());
  if (op === "equals") return haystack.trim().toLowerCase() === needle.toLowerCase();
  if (op === "regex") {
    try { return new RegExp(needle, "i").test(haystack); }
    catch { return false; }
  }
  return false;
}

// Returns the first matching rule (preserving the priority order of
// the array), or null if no rule matches.
export function applyRules(rules, txn) {
  if (!rules || rules.length === 0) return null;
  for (const r of rules) {
    if (ruleHits(r, txn)) return r;
  }
  return null;
}

// One-stop predictor: rule first, regex fallback. Returns:
//   { source: "rule" | "predict" | "none", category, rule_id }
export function predictCategoryForTxn(rules, txn, knownCategoryLabels) {
  const hit = applyRules(rules, txn);
  if (hit) {
    return { source: "rule", category: hit.target_category_label, rule_id: hit.id };
  }
  const guess = predictCategory(
    txn.merchant_name || txn.name || "",
    knownCategoryLabels || [],
  );
  if (guess) return { source: "predict", category: guess, rule_id: null };
  return { source: "none", category: null, rule_id: null };
}

// Build a sensible default rule from a transaction the user just
// categorized. Heuristic: match on `merchant_name` if Plaid gave us
// one (more stable than `name`, which often includes a date / city /
// terminal number), else fall back to the first two words of `name`.
export function suggestRuleFromTxn(txn, targetCategoryLabel) {
  const merchant = (txn.merchant_name || "").trim();
  if (merchant) {
    return {
      match_field: "merchant_name",
      match_op: "contains",
      match_value: merchant,
      target_category_label: targetCategoryLabel,
      enabled: true,
    };
  }
  const fallback = (txn.name || "").trim().split(/\s+/).slice(0, 2).join(" ");
  return {
    match_field: "name",
    match_op: "contains",
    match_value: fallback,
    target_category_label: targetCategoryLabel,
    enabled: true,
  };
}

// Compact display string for a rule, e.g. "Costco → Groceries · 14 hits"
export function describeRule(rule) {
  const field = rule.match_field.replace("_", " ");
  return `${field} ${rule.match_op.replace("_", " ")} "${rule.match_value}" → ${rule.target_category_label}`;
}

// Sweep existing inbox transactions and re-predict against the current
// rule set. Used after a new rule is created so the inbox updates in
// place (we don't need to wait for the next sync). Returns the new
// transactions array.
export function reapplyRulesToInbox(transactions, rules, knownCategoryLabels) {
  if (!transactions || transactions.length === 0) return transactions || [];
  return transactions.map((t) => {
    if (t.imported_at || t.dismissed_at) return t;
    const pred = predictCategoryForTxn(rules, t, knownCategoryLabels);
    if (pred.category && pred.category !== t.predicted_category_label) {
      return { ...t, predicted_category_label: pred.category };
    }
    return t;
  });
}
