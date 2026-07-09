import { auth } from "@/lib/auth";

import { resolveHousehold, isAuthorizedForBudget } from "@/actions/budget/_households";
import { exportBundle } from "@/lib/build/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/build/backup — download everything as one JSON file.
 *
 * Captures both stores (the blob and the engine collections) at the versions
 * they were read at, plus a manifest of every Storage image the data points to.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId || !isAuthorizedForBudget(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { workspaceKey } = resolveHousehold(userId);
    const bundle = await exportBundle(workspaceKey);

    const stamp = bundle.exported_at.slice(0, 19).replace(/[:T]/g, "-");
    const filename = `dreambuild-backup-${stamp}.json`;

    return new Response(JSON.stringify(bundle, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[build/backup] export failed:", e?.message || e);
    return Response.json({ error: "Could not build the backup." }, { status: 500 });
  }
}
