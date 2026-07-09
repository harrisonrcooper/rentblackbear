// /admin/budget — household + rentals budget page.
//
// Server component: authenticates, hard-gates on BUDGET_OWNER_USER_ID
// while the feature is private to Harrison + wife, loads the initial
// state from app_data, and hands it to the client shell.
//
// All editing happens through server actions in `@/actions/budget/*`
// so the auth check is enforced on every write, not just initial load.

import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

import { fetchBudgetState } from "@/actions/budget/state";
import { isAuthorizedForBudget } from "@/actions/budget/_households";
import BudgetClient from "./BudgetClient";
import { ErrorBoundary } from "./primitives/ErrorBoundary";

export const dynamic = "force-dynamic";

// Route-specific PWA manifest so Chrome's "Add to Home screen" installs
// Budget as its own standalone app that opens directly to /admin/budget
// (not /admin). Overrides the root manifest via the Metadata API.
export const metadata = {
  manifest: "/budget.webmanifest",
};

export default async function BudgetPage() {
  const { userId } = await auth();
  if (!userId) notFound();

  // Multi-household auth: user must belong to at least one configured
  // household group, OR no groups are configured (private/dev mode).
  if (!isAuthorizedForBudget(userId)) notFound();

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
      <BudgetClient
        initialState={result.state}
        userId={userId}
        initialRegistry={result.registry}
        initialBudgetId={result.activeBudgetId}
      />
    </ErrorBoundary>
  );
}
