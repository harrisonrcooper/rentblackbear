import { auth } from "@/lib/auth";

import { resolveHousehold, isAuthorizedForBudget } from "@/actions/budget/_households";
import { buildKey } from "@/actions/build/_store";
import { loadVersioned, saveCas } from "@/lib/app-data";
import { BACKED_UP_COLLECTIONS, describeBundle, validateBundle } from "@/lib/build/backup";
import { collectionKey } from "@/lib/build/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/build/restore
 *
 * Body: { bundle, confirm?: true }
 *
 * Without `confirm`, this is a DRY RUN: the bundle is validated and described,
 * and nothing is written. That is the default on purpose — restore replaces
 * every room, vendor and reference the household has, and a mis-clicked
 * restore is exactly the data loss this whole subsystem exists to prevent.
 *
 * With `confirm`, the CURRENT state is archived to an immutable key first, so
 * a restore is itself undoable.
 */
export async function POST(req) {
  const { userId } = await auth();
  if (!userId || !isAuthorizedForBudget(userId)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Send a JSON body with a `bundle`." }, { status: 400 });
  }

  const { bundle, confirm } = body;
  const check = validateBundle(bundle);
  if (!check.ok) {
    return Response.json(
      { error: "That file is not a valid backup.", errors: check.errors, warnings: check.warnings },
      { status: 400 },
    );
  }

  const { workspaceKey } = resolveHousehold(userId);

  if (!confirm) {
    return Response.json({
      dryRun: true,
      willRestore: describeBundle(bundle),
      warnings: check.warnings,
      fromWorkspace: bundle.workspace,
      intoWorkspace: workspaceKey,
      differentWorkspace: bundle.workspace !== workspaceKey,
      message: "Nothing was written. Send { confirm: true } to apply.",
    });
  }

  try {
    // 1. Archive what is there now. A restore must be reversible.
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const current = await loadVersioned(buildKey(workspaceKey), null);
    if (current.value) {
      const res = await saveCas(`build:archive:pre-restore-${stamp}`, current.value, 0, null);
      if (!res.ok) throw new Error("Could not archive the current data; refusing to restore over it.");
    }

    // 2. Overwrite the blob, presenting the version we just read so a
    //    concurrent editor cannot be silently clobbered by the restore.
    const blobWrite = await saveCas(buildKey(workspaceKey), bundle.blob.value, current.version, null);
    if (!blobWrite.ok) {
      return Response.json(
        {
          error: blobWrite.conflict
            ? "Someone edited the planner while the restore was being prepared. Nothing was changed — reload and try again."
            : blobWrite.message,
        },
        { status: 409 },
      );
    }

    // 3. Replace each engine collection.
    const restored = {};
    for (const name of BACKED_UP_COLLECTIONS) {
      const items = Array.isArray(bundle.collections?.[name]) ? bundle.collections[name] : [];
      const key = collectionKey(workspaceKey, name);
      const cur = await loadVersioned(key, { items: [] });
      const res = await saveCas(key, { items }, cur.version, { items: [] });
      if (!res.ok) throw new Error(`Could not restore ${name}: ${res.message || "conflict"}`);
      restored[name] = items.length;
    }

    console.warn("[build/restore] restored", { workspaceKey, from: bundle.exported_at, restored });

    return Response.json({
      ok: true,
      restored,
      archivedAs: `build:archive:pre-restore-${stamp}`,
      summary: describeBundle(bundle),
    });
  } catch (e) {
    console.error("[build/restore] failed:", e?.message || e);
    return Response.json({ error: e?.message || "Restore failed." }, { status: 500 });
  }
}
