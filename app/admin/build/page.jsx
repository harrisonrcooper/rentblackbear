// /admin/build — standalone new-construction home-build planner.
//
// Its own page, its own nav, its own app_data row — separate from the
// budget tracker. Auth-gated the same way as the budget app.

import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

import { fetchBuildState } from "@/actions/build/state";
import { isAuthorizedForBudget } from "@/actions/budget/_households";
import { isSectionId } from "@/lib/build/sections";
import BuildClient from "./BuildClient";

export const dynamic = "force-dynamic";

export default async function BuildPage({ searchParams }) {
  const { userId } = await auth();
  if (!userId) notFound();
  if (!isAuthorizedForBudget(userId)) notFound();

  // Deep links (?s=rooms&item=r0) resolve on the server, so a shared link
  // renders its section directly instead of flashing the dashboard first.
  const requested = typeof searchParams?.s === "string" ? searchParams.s : "";
  const initialSection = isSectionId(requested) ? requested : "overview";

  const result = await fetchBuildState();
  if (!result.ok) {
    return (
      <main style={{
        minHeight: "100vh", display: "grid", placeItems: "center",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        background: "#f7f9fc", color: "#1a1f36", padding: 32, textAlign: "center",
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Build planner unavailable</h1>
          <p style={{ color: "#5a6478", fontSize: 14 }}>{result.message}</p>
        </div>
      </main>
    );
  }

  return (
    <BuildClient
      initialState={result.state}
      initialVersion={result.version}
      initialSection={initialSection}
      userId={userId}
    />
  );
}
