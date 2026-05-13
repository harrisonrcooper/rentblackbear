// Plaid API singleton. Server-only — never imported by a client
// component, never exposes secrets to the browser.
//
// Required env vars (set in .env.local for dev, Vercel project env
// for prod — do not commit these):
//
//   PLAID_CLIENT_ID         — from dashboard.plaid.com
//   PLAID_SECRET            — sandbox / development / production secret
//   PLAID_ENV               — "sandbox" | "development" | "production"
//                             (defaults to "sandbox")
//   PLAID_WEBHOOK_URL       — optional, e.g.
//                             https://rentblackbear.com/api/plaid/webhook
//   PLAID_REDIRECT_URI      — optional, only needed when running
//                             Plaid Link with OAuth institutions
//
// The "Plaid-Version" header is pinned. Bumping it is a breaking
// change that requires re-reading the dashboard's API changelog.

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

function env(): "sandbox" | "development" | "production" {
  const raw = (process.env.PLAID_ENV || "sandbox").toLowerCase();
  if (raw === "production" || raw === "development") return raw;
  return "sandbox";
}

let cached: PlaidApi | null = null;

export function getPlaidClient(): PlaidApi {
  if (cached) return cached;
  const config = new Configuration({
    basePath: PlaidEnvironments[env()],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "",
        "PLAID-SECRET": process.env.PLAID_SECRET || "",
        "Plaid-Version": "2020-09-14",
      },
    },
  });
  cached = new PlaidApi(config);
  return cached;
}

export function plaidEnv(): "sandbox" | "development" | "production" {
  return env();
}

export function plaidConfigured(): boolean {
  return Boolean(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);
}

export function plaidWebhookUrl(): string | undefined {
  return process.env.PLAID_WEBHOOK_URL || undefined;
}

export function plaidRedirectUri(): string | undefined {
  return process.env.PLAID_REDIRECT_URI || undefined;
}

// Plaid amounts are signed dollar amounts where POSITIVE = money
// leaving the account (outflow). We mirror that convention in cents
// internally so chip math (debit = expense) stays intuitive.
export function plaidAmountToCents(amount: number): number {
  return Math.round(amount * 100);
}
