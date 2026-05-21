// Types shared by the budget importer + writer. Lives outside any
// "use server" boundary so it can be re-exported and consumed from
// both the parser (pure) and writer (Supabase I/O) modules.

export type Frequency =
  | "weekly"
  | "biweekly"
  | "semimonthly"
  | "monthly"
  | "yearly";

export type IncomeOwner = "harrison" | "wife" | "joint" | "other";
export type IncomeSourceType =
  | "salary"
  | "self_employment"
  | "rental"
  | "retirement"
  | "other";

export type CategoryGroup =
  | "giving"
  | "housing"
  | "transport"
  | "food"
  | "personal"
  | "kids"
  | "debt"
  | "yearly"
  | "retirement"
  | "other";

export type PropertyStatus = "operating" | "pipeline" | "sold" | "equity_only";

export type PropertyExpenseKind = "fixed" | "vacancy_pct" | "capex_pct";

export type AssetKind =
  | "cash"
  | "retirement"
  | "investment"
  | "vehicle"
  | "other";

export type DebtKind =
  | "student"
  | "auto"
  | "heloc"
  | "credit_card"
  | "personal"
  | "other";

export type BusinessExpenseFrequency = "monthly" | "yearly" | "quarterly";

export type YearlyExpenseCategory =
  | "insurance"
  | "tax"
  | "subscription"
  | "other";

export interface ImportCategory {
  label: string;
  group_key: CategoryGroup;
  default_biweekly_cents: number;
  default_monthly_cents: number;
  default_yearly_cents: number;
  sort_order: number;
}

export interface ImportIncomeSource {
  label: string;
  owner: IncomeOwner;
  source_type: IncomeSourceType;
  frequency: Frequency;
  net_amount_cents: number;
  notes?: string;
}

export interface ImportPropertyRoom {
  label: string;
  rent_cents: number;
  occupied: boolean;
  sort_order: number;
}

export interface ImportPropertyExpense {
  label: string;
  kind: PropertyExpenseKind;
  monthly_cents: number;
  pct_bps?: number | null;
  sort_order: number;
}

export interface ImportMaintenanceEvent {
  id?: string;
  date: string; // ISO YYYY-MM-DD
  vendor?: string;
  category?: "repair" | "improvement" | "cleaning" | "landscaping" | "inspection" | "other";
  amount_cents: number;
  note?: string;
}

export interface ImportProperty {
  label: string;
  address?: string | null;
  status: PropertyStatus;
  market_value_cents: number;
  mortgage_balance_cents: number;
  mortgage_payment_cents: number;
  mortgage_rate_bps?: number | null;
  mortgage_term_years?: number | null;
  mortgage_origin_date?: string | null;
  // Per-property HELOC (home-equity line of credit) — Harrison's
  // HELOCs are drawn against individual rentals. Optional: legacy
  // properties have none. `heloc_payment_cents` is a manual override;
  // when null/absent the payment is auto-computed interest-only from
  // balance × rate (see propertyHelocPayment in lib/calc.js).
  heloc_balance_cents?: number;
  heloc_rate_bps?: number | null;
  heloc_limit_cents?: number;
  heloc_payment_cents?: number | null;
  // Owner-occupied / house-hack share, in basis points (5000 = 50% of
  // the property is the owner's residence). When set, only the rental
  // share of fixed building costs counts as a rental expense — the
  // owner's portion is personal, not a rental cost. Absent → 0 → the
  // property is a pure rental.
  personal_use_bps?: number;
  vacancy_bps_override?: number | null;
  capex_bps_override?: number | null;
  sort_order: number;
  notes?: string | null;
  expenses: ImportPropertyExpense[];
  rooms: ImportPropertyRoom[];
  maintenance_log?: ImportMaintenanceEvent[];
  // Purchase data — drives Cash-on-Cash and depreciation more accurately.
  // Optional because legacy properties don't have it; falls back to
  // (market_value - mortgage_balance) and "today" when absent.
  purchase_price_cents?: number;
  purchase_date?: string | null; // ISO YYYY-MM-DD
  cash_invested_cents?: number; // down payment + closing + initial rehab
}

export interface ImportBusinessExpense {
  label: string;
  monthly_cents: number;
  frequency: BusinessExpenseFrequency;
  notes?: string;
  sort_order: number;
}

export interface ImportYearlyExpense {
  label: string;
  yearly_amount_cents: number;
  due_month?: number | null;
  category: YearlyExpenseCategory;
  notes?: string;
  sort_order: number;
}

export interface ImportAsset {
  label: string;
  kind: AssetKind;
  balance_cents: number;
  notes?: string;
  sort_order: number;
}

export interface ImportDebt {
  label: string;
  kind: DebtKind;
  balance_cents: number;
  original_amount_cents?: number | null;
  monthly_payment_cents: number;
  interest_rate_bps?: number | null;
  notes?: string;
  sort_order: number;
}

export interface ImportHelocModel {
  started_on?: string | null;
  home_value_cents: number;
  heloc_limit_cents: number;
  mortgage_balance_cents: number;
  mortgage_rate_bps?: number | null;
  mortgage_term_years?: number | null;
  mortgage_origin_date?: string | null;
  mortgage_payment_cents: number;
  heloc_rate_bps?: number | null;
  monthly_income_cents: number;
  monthly_expenses_cents: number;
  extra_payment_cents: number;
  notes?: string;
}

export interface ImportMomLoanPayment {
  paid_on: string; // ISO YYYY-MM-DD
  amount_cents: number;
  // Direction of the cash flow on this row:
  //   "in"  — money came FROM Mom (e.g. her paying off appliances)
  //   "out" — money went TO Mom (e.g. retirement support from cash flow)
  // Missing → "in" (legacy entries before the bidirectional model).
  direction?: "in" | "out";
  note?: string;
}

export interface ImportMomLoan {
  label: string;
  // Initial amount Mom owes Harrison (e.g. appliance purchase price).
  // Net balance = starting_balance + sum(out) − sum(in).
  // Positive → she still owes; negative → he now owes her.
  starting_balance_cents: number;
  // Suggested monthly payment amount — used to prefill the FAB "log
  // payment" shortcut, NOT enforced as a schedule.
  monthly_payment_cents: number;
  due_day?: number | null;
  notes?: string;
  payments: ImportMomLoanPayment[];
}

export interface ImportRetirementContribution {
  account_label: string;
  year: number;
  amount_cents: number;
  notes?: string;
}

export interface ImportMonthlyActual {
  id?: string; // client-generated, filled lazily on first read of legacy data
  category_label: string; // looked up to category_id by the writer
  month: string; // ISO YYYY-MM-01
  paid_on?: string; // ISO YYYY-MM-DD (defaults to first of month when absent)
  amount_cents: number;
  note?: string;
}

export interface ImportPayload {
  categories: ImportCategory[];
  income_sources: ImportIncomeSource[];
  properties: ImportProperty[];
  business_expenses: ImportBusinessExpense[];
  yearly_expenses: ImportYearlyExpense[];
  assets: ImportAsset[];
  debts: ImportDebt[];
  heloc_model: ImportHelocModel | null;
  mom_loans: ImportMomLoan[];
  retirement_contributions: ImportRetirementContribution[];
  monthly_actuals: ImportMonthlyActual[];
}

export interface ImportCounts {
  categories: number;
  income_sources: number;
  properties: number;
  property_expenses: number;
  property_rooms: number;
  business_expenses: number;
  yearly_expenses: number;
  assets: number;
  debts: number;
  heloc_model: number;
  mom_loans: number;
  mom_loan_payments: number;
  retirement_contributions: number;
  monthly_actuals: number;
}

export interface ImportResult {
  ok: boolean;
  counts: ImportCounts;
  warnings: string[];
  errors: string[];
}
