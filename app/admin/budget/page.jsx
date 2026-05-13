// /admin/budget — household + rentals budget page.
//
// Server component: authenticates, hard-gates on BUDGET_OWNER_USER_ID
// while the feature is private to Harrison + wife, loads the initial
// state from app_data, and hands it to the client shell.
//
// All editing happens through server actions in `@/actions/budget/*`
// so the auth check is enforced on every write, not just initial load.

import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { fetchBudgetState } from "@/actions/budget/state";
import { runScheduledBillPosts } from "@/actions/budget/bills";
import BudgetClient from "./BudgetClient";
import { ErrorBoundary } from "./primitives/ErrorBoundary";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const { userId } = await auth();
  if (!userId) notFound();

  // Accept either a single owner (legacy `BUDGET_OWNER_USER_ID`) or
  // a comma-separated list of owners (`BUDGET_OWNER_USER_IDS`). Empty
  // / unset = anyone authenticated can use the page.
  const singleOwner = process.env.BUDGET_OWNER_USER_ID;
  const multiOwner = process.env.BUDGET_OWNER_USER_IDS;
  const allowedIds = (multiOwner || singleOwner || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowedIds.length > 0 && !allowedIds.includes(userId)) notFound();

  // Run scheduled auto-posts before fetching state so the page renders
  // with any freshly-posted actuals visible. Idempotent — second
  // calls in the same period find nothing to do.
  await runScheduledBillPosts().catch(() => undefined);

  const result = await fetchBudgetState();
  if (!result.ok) {
    return (
      <main style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        background: "#f7f9fc",
        color: "#1a1f36",
        padding: 32,
        textAlign: "center",
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Budget unavailable</h1>
          <p style={{ color: "#5a6478", fontSize: 14 }}>{result.message}</p>
        </div>
      </main>
    );
  }

  return (
    <ErrorBoundary>
      <BudgetClient initialState={result.state} userId={userId} />
    </ErrorBoundary>
  );
}
