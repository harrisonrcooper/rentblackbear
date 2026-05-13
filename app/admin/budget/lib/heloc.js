// HELOC velocity-banking math. Both functions return zeros for any
// missing input rather than throwing — the drill renders a "configure
// me" prompt when key fields aren't set yet.

// ── Multi-strategy comparison ────────────────────────────────────────
//
// Runs five payoff strategies on the same underlying mortgage and
// returns a uniform shape so the UI can render them as overlaid lines
// + a comparison table:
//
//   Traditional      — minimum payment until zero
//   Extra Principal  — minimum + monthly extra applied straight to principal
//   HELOC Velocity   — sweep (surplus + extra) through HELOC, lump-onto-mortgage every 2 mo
//   Refinance        — same as Traditional but at the lower target rate
//   Refi + Extra     — refinance AND keep applying extra
//
// Each result carries `monthly_series` capped at 360 entries (30 yr).
// `totalInterest` includes any one-time `upfrontCost` (used for refi
// closing costs). `afterTaxInterest` applies the marginal-deduction
// approximation for whatever portion the caller flags as deductible.

const MAX_MONTHS = 600; // 50-year safety bound; mortgages should resolve well before this

function runFixedPayoff({ balance, rate, payment, extra = 0 }) {
  const series = [{ month: 0, balance }];
  let bal = balance;
  let totalInterest = 0;
  let months = 0;
  const pay = payment + extra;
  while (bal > 0 && months < MAX_MONTHS) {
    const interest = bal * rate;
    const principal = Math.min(bal, pay - interest);
    if (principal <= 0) return { series, totalInterest: Infinity, months: null };
    bal -= principal;
    totalInterest += interest;
    months++;
    series.push({ month: months, balance: Math.max(0, bal) });
  }
  return { series, totalInterest, months };
}

function runHelocSweepCore({ balance, rate, payment, helocRate, sweep }) {
  let bal = balance;
  let helocBal = 0;
  let totalInterest = 0;
  let months = 0;
  const series = [{ month: 0, balance: bal }];
  while (bal > 0 && months < MAX_MONTHS) {
    const interest = bal * rate;
    const principal = Math.min(bal, payment - interest);
    if (principal <= 0) return { series, totalInterest: Infinity, months: null };
    bal -= principal;
    totalInterest += interest;
    // Every other month, lump a sweep onto the mortgage from HELOC.
    if (sweep > 0 && bal > 0 && (months + 1) % 2 === 0) {
      const lump = Math.min(sweep * 2, bal);
      bal -= lump;
      helocBal += lump;
    }
    // Pay HELOC back from this month's surplus.
    const repay = Math.min(helocBal, sweep);
    helocBal -= repay;
    totalInterest += helocBal * helocRate;
    months++;
    series.push({ month: months, balance: Math.max(0, bal) });
  }
  return { series, totalInterest, months };
}

// Standard mortgage payment formula. Returns cents.
function amortizationPayment(principalCents, monthlyRate, totalMonths) {
  if (!principalCents || totalMonths <= 0) return 0;
  if (!monthlyRate) return Math.round(principalCents / totalMonths);
  const r = monthlyRate;
  const n = totalMonths;
  return Math.round(principalCents * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

export function computeStrategies(m, opts = {}) {
  const balance = m.mortgage_balance_cents || 0;
  const monthlyRate = (m.mortgage_rate_bps ?? 0) / 10000 / 12;
  const payment = m.mortgage_payment_cents || 0;
  const helocRate = (m.heloc_rate_bps ?? 0) / 10000 / 12;
  const extra = m.extra_payment_cents || 0;
  const surplus = Math.max(0, (m.monthly_income_cents || 0) - (m.monthly_expenses_cents || 0) - payment);

  const refiRateBps = opts.refiRateBps;
  const refiCost = opts.refiCostCents || 0;
  const marginalBps = opts.marginalBps ?? 0;
  const termYears = m.mortgage_term_years || 30;

  if (!balance || !payment || !monthlyRate) return [];

  const strategies = [];

  // 1) Traditional
  {
    const r = runFixedPayoff({ balance, rate: monthlyRate, payment });
    strategies.push({
      id: "traditional", label: "Traditional", color: "#9aa0aa",
      monthlyPayment: payment, ...r, upfrontCost: 0,
    });
  }

  // 2) Extra Principal (no HELOC, just send extra straight to the loan)
  if (extra > 0) {
    const r = runFixedPayoff({ balance, rate: monthlyRate, payment, extra });
    strategies.push({
      id: "extra_principal", label: "Extra to Principal", color: "#3b6fd1",
      monthlyPayment: payment + extra, ...r, upfrontCost: 0,
    });
  }

  // 3) HELOC Velocity (current strategy)
  if (helocRate > 0 && (surplus + extra) > 0) {
    const r = runHelocSweepCore({ balance, rate: monthlyRate, payment, helocRate, sweep: surplus + extra });
    strategies.push({
      id: "heloc", label: "HELOC Velocity", color: "#8c5ad9",
      monthlyPayment: payment, ...r, upfrontCost: 0,
    });
  }

  // 4 + 5) Refinance scenarios (only if a target rate is set and it
  // beats the current rate by something meaningful — otherwise it's
  // not a real option).
  if (refiRateBps && refiRateBps > 0 && refiRateBps < (m.mortgage_rate_bps ?? 0)) {
    const refiMonthlyRate = refiRateBps / 10000 / 12;
    const refiPayment = amortizationPayment(balance, refiMonthlyRate, termYears * 12);
    {
      const r = runFixedPayoff({ balance, rate: refiMonthlyRate, payment: refiPayment });
      strategies.push({
        id: "refi", label: "Refinance", color: "#138a60",
        monthlyPayment: refiPayment, ...r, upfrontCost: refiCost,
      });
    }
    if (extra > 0) {
      const r = runFixedPayoff({ balance, rate: refiMonthlyRate, payment: refiPayment, extra });
      strategies.push({
        id: "refi_extra", label: "Refi + Extra", color: "#c88318",
        monthlyPayment: refiPayment + extra, ...r, upfrontCost: refiCost,
      });
    }
  }

  // Roll up totals + tax-adjusted view + savings vs the baseline.
  const baseline = strategies.find((s) => s.id === "traditional");
  const baselineCost = baseline ? baseline.totalInterest : 0;
  for (const s of strategies) {
    s.totalCost = Math.round(s.totalInterest) + (s.upfrontCost || 0);
    s.savingsVsBaseline = Math.round(baselineCost - s.totalInterest - (s.upfrontCost || 0));
    s.yearsToPayoff = s.months != null ? s.months / 12 : null;
    // Marginal-rate tax adjustment: deductible portion of mortgage
    // interest. HELOC interest is treated as fully deductible here for
    // simplicity — refine when we wire actual TCJA "home-improvement
    // use" attribution.
    s.afterTaxCost = Math.round(s.totalCost * (1 - marginalBps / 10000));
    s.afterTaxSavings = Math.round((baselineCost * (1 - marginalBps / 10000)) - s.afterTaxCost);
  }

  return strategies;
}

export function defaultStrategyInputs(state) {
  const m = state.heloc_model || {};
  const currentRate = m.mortgage_rate_bps ?? 0;
  return {
    marginalBps: state.settings?.marginal_tax_bps ?? 2400, // 24% federal MFJ ballpark
    // Default refinance target: 100 bps below current, or 0 if current rate is <= 1%.
    refiRateBps: state.settings?.refi_target_rate_bps ?? Math.max(0, currentRate - 100),
    // Default refi closing costs: 3% of current mortgage balance.
    refiCostCents: state.settings?.refi_cost_cents ?? Math.round((m.mortgage_balance_cents || 0) * 0.03),
  };
}

// Month-by-month balance over up to 360 months. Used by the live
// chart in HelocDrill. Both series stop updating once balance hits 0
// so the line flattens at zero rather than going negative.
export function computeHelocSeries(m) {
  const mortBal = m.mortgage_balance_cents;
  const mortRate = (m.mortgage_rate_bps ?? 0) / 10000 / 12;
  const mortPay = m.mortgage_payment_cents;
  const surplus = Math.max(0, (m.monthly_income_cents - m.monthly_expenses_cents - mortPay));
  const extra = m.extra_payment_cents;
  if (!mortBal || !mortPay || !mortRate) return [];

  const sweep = surplus + extra;
  let tBal = mortBal;
  let hBal = mortBal;
  const out = [{ month: 0, traditional: tBal, heloc: hBal }];
  for (let i = 1; i <= 360; i++) {
    if (tBal > 0) {
      const interest = tBal * mortRate;
      const principal = Math.min(tBal, mortPay - interest);
      if (principal > 0) tBal -= principal; else tBal = 0;
    }
    if (hBal > 0) {
      const interest = hBal * mortRate;
      const principal = Math.min(hBal, mortPay - interest);
      if (principal > 0) hBal -= principal;
      // Bi-monthly sweep of extra principal via HELOC. The actual
      // HELOC strategy moves money back and forth; we model it
      // simply as "every other month, slam a chunk on the mortgage."
      if (sweep > 0 && hBal > 0 && i % 2 === 0) {
        const lump = Math.min(sweep * 2, hBal);
        hBal -= lump;
      }
      if (hBal < 0) hBal = 0;
    }
    out.push({ month: i, traditional: Math.max(0, tBal), heloc: Math.max(0, hBal) });
    if (tBal === 0 && hBal === 0) break;
  }
  return out;
}

// Summary numbers for the stat cards in the HELOC drill.
export function computeHelocPlan(m) {
  const mortBal = m.mortgage_balance_cents;
  const mortRate = (m.mortgage_rate_bps ?? 0) / 10000 / 12;
  const mortPay = m.mortgage_payment_cents;
  const helocRate = (m.heloc_rate_bps ?? 0) / 10000 / 12;
  const surplus = Math.max(0, (m.monthly_income_cents - m.monthly_expenses_cents - mortPay));
  const extra = m.extra_payment_cents;

  if (!mortBal || !mortPay || !mortRate) {
    return { tradMonths: null, tradInterest: 0, helocMonths: null, helocInterest: 0, savings: 0 };
  }

  let bal = mortBal;
  let tradMonths = 0;
  let tradInterest = 0;
  while (bal > 0 && tradMonths < 600) {
    const i = bal * mortRate;
    const p = Math.min(bal, mortPay - i);
    if (p <= 0) { tradMonths = null; break; }
    tradInterest += i;
    bal -= p;
    tradMonths++;
  }

  bal = mortBal;
  let helocBal = 0;
  let helocMonths = 0;
  let helocInterest = 0;
  const sweep = surplus + extra;
  while (bal > 0 && helocMonths < 600) {
    const mi = bal * mortRate;
    const mp = Math.min(bal, mortPay - mi);
    if (mp <= 0) { helocMonths = null; break; }
    helocInterest += mi;
    bal -= mp;
    if (sweep > 0 && bal > 0) {
      const lump = Math.min(sweep * 2, bal);
      bal -= lump;
      helocBal += lump;
    }
    const repay = Math.min(helocBal, sweep);
    helocBal -= repay;
    helocInterest += helocBal * helocRate;
    helocMonths++;
  }

  return {
    tradMonths,
    tradInterest: Math.round(tradInterest),
    helocMonths,
    helocInterest: Math.round(helocInterest),
    savings: Math.round((tradInterest || 0) - (helocInterest || 0)),
  };
}
