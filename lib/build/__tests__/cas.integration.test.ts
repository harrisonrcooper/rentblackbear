// Integration test for the concurrency fix, against the real app_data table.
//
// Simulates the exact failure this work exists to prevent: two editors load
// the same blob, both edit, both save. Before compare-and-swap, the second
// save silently erased the first. Here it must be refused, merged, and retried
// with BOTH edits intact.
//
// Uses a scratch key that no app code reads. Skips when Supabase env is absent
// (CI) rather than failing.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { mergeBuildState } from "../merge";

// .env.local is not loaded by vitest — read it before importing the module
// under test, which snapshots process.env at import time.
function loadEnvLocal() {
  try {
    const text = readFileSync(resolve(__dirname, "../../../.env.local"), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — the suite will skip */
  }
}
loadEnvLocal();

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const d = configured ? describe : describe.skip;

const SCRATCH_KEY = "__cas_integration_test";

async function rawDelete(key: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  await fetch(`${url}/rest/v1/app_data?key=eq.${encodeURIComponent(key)}`, {
    method: "DELETE",
    headers: { apikey: svc, Authorization: `Bearer ${svc}` },
  });
}

/** Write a row the old way: no `_v` field, exactly like every pre-existing blob. */
async function rawInsertLegacy(key: string, value: unknown) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const res = await fetch(`${url}/rest/v1/app_data?on_conflict=key`, {
    method: "POST",
    headers: {
      apikey: svc,
      Authorization: `Bearer ${svc}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error(`legacy seed failed: ${res.status}`);
}

type Doc = {
  project_name: string;
  rooms: Array<{ id: string; name: string; must_haves?: string }>;
};

const seed: Doc = {
  project_name: "Our Dream Home",
  rooms: [{ id: "r0", name: "Kitchen", must_haves: "butler's pantry" }],
};

d("compare-and-swap against the live app_data table", () => {
  let loadVersioned: typeof import("../../app-data").loadVersioned;
  let saveCas: typeof import("../../app-data").saveCas;

  beforeAll(async () => {
    ({ loadVersioned, saveCas } = await import("../../app-data"));
    await rawDelete(SCRATCH_KEY);
  });
  afterAll(async () => { await rawDelete(SCRATCH_KEY); });

  it("creates the row at version 1 and never exposes the _v field", async () => {
    const created = await saveCas<Doc>(SCRATCH_KEY, seed, 0, seed);
    expect(created.ok).toBe(true);
    expect(created.version).toBe(1);

    const read = await loadVersioned<Doc>(SCRATCH_KEY, seed);
    expect(read.version).toBe(1);
    expect(read.value).toEqual(seed);
    expect("_v" in (read.value as object)).toBe(false);
  });

  it("refuses a stale write instead of clobbering it, and hands back the current state", async () => {
    // Both editors read version 1.
    const her = await loadVersioned<Doc>(SCRATCH_KEY, seed);
    const him = await loadVersioned<Doc>(SCRATCH_KEY, seed);
    expect(her.version).toBe(him.version);

    // She saves first, adding a room.
    const hers: Doc = { ...her.value, rooms: [...her.value.rooms, { id: "rA", name: "Sauna" }] };
    const herSave = await saveCas<Doc>(SCRATCH_KEY, hers, her.version, seed);
    expect(herSave.ok).toBe(true);
    expect(herSave.version).toBe(2);

    // He saves second, from the now-stale version 1, adding a different room.
    const his: Doc = { ...him.value, rooms: [...him.value.rooms, { id: "rB", name: "Pool house" }] };
    const hisSave = await saveCas<Doc>(SCRATCH_KEY, his, him.version, seed);

    expect(hisSave.ok).toBe(false);
    expect(hisSave.conflict).toBe(true);
    expect(hisSave.latest?.version).toBe(2);
    // The refusal handed back HER state, not his.
    expect(hisSave.latest?.value.rooms.map((r) => r.id)).toEqual(["r0", "rA"]);

    // Crucially: his write did not land.
    const afterRefusal = await loadVersioned<Doc>(SCRATCH_KEY, seed);
    expect(afterRefusal.value.rooms.map((r) => r.id)).toEqual(["r0", "rA"]);
  });

  it("merges and retries so both editors' rooms survive", async () => {
    const him = await loadVersioned<Doc>(SCRATCH_KEY, seed);        // version 2, her state
    // Reconstruct his in-flight edit from the version-1 base he started from.
    const hisBase: Doc = seed;
    const his: Doc = { ...seed, rooms: [...seed.rooms, { id: "rB", name: "Pool house" }] };

    const { merged, report } = mergeBuildState(hisBase, his, him.value);
    expect(report.conflicts).toEqual([]);
    expect(merged.rooms.map((r) => r.id).sort()).toEqual(["r0", "rA", "rB"]);

    const retry = await saveCas<Doc>(SCRATCH_KEY, merged, him.version, seed);
    expect(retry.ok).toBe(true);
    expect(retry.version).toBe(3);

    const final = await loadVersioned<Doc>(SCRATCH_KEY, seed);
    expect(final.version).toBe(3);
    expect(final.value.rooms.map((r) => r.id).sort()).toEqual(["r0", "rA", "rB"]);
  });

  // Regression: every blob that existed before this module shipped — including
  // the owner's real one — has no `_v`, so it reads as version 0 while the row
  // very much exists. Treating version 0 as "insert" made the first save 409
  // forever and the planner could never save again.
  it("upgrades a LEGACY row that has no _v, instead of colliding on insert", async () => {
    const legacyKey = `${SCRATCH_KEY}_legacy`;
    await rawDelete(legacyKey);
    await rawInsertLegacy(legacyKey, seed); // no _v, exactly like production

    const read = await loadVersioned<Doc>(legacyKey, seed);
    expect(read.version).toBe(0);          // reads as 0 …
    expect(read.value).toEqual(seed);      // … but the row is there

    const saved = await saveCas<Doc>(legacyKey, { ...seed, project_name: "Upgraded" }, 0, seed);
    expect(saved.ok).toBe(true);
    expect(saved.version).toBe(1);

    const after = await loadVersioned<Doc>(legacyKey, seed);
    expect(after.version).toBe(1);
    expect(after.value.project_name).toBe("Upgraded");

    await rawDelete(legacyKey);
  });

  it("two writers racing to upgrade the same legacy row: exactly one wins", async () => {
    const legacyKey = `${SCRATCH_KEY}_legacy_race`;
    await rawDelete(legacyKey);
    await rawInsertLegacy(legacyKey, seed);

    const [a, b] = await Promise.all([
      saveCas<Doc>(legacyKey, { ...seed, project_name: "A" }, 0, seed),
      saveCas<Doc>(legacyKey, { ...seed, project_name: "B" }, 0, seed),
    ]);

    const wins = [a, b].filter((r) => r.ok).length;
    expect(wins).toBe(1);
    const loser = [a, b].find((r) => !r.ok);
    expect(loser?.conflict).toBe(true);

    const after = await loadVersioned<Doc>(legacyKey, seed);
    expect(after.version).toBe(1);
    expect(["A", "B"]).toContain(after.value.project_name);

    await rawDelete(legacyKey);
  });

  it("a second stale writer at the same version also loses, exactly once", async () => {
    const a = await loadVersioned<Doc>(SCRATCH_KEY, seed);
    const first = await saveCas<Doc>(SCRATCH_KEY, { ...a.value, project_name: "A" }, a.version, seed);
    const second = await saveCas<Doc>(SCRATCH_KEY, { ...a.value, project_name: "B" }, a.version, seed);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
    expect(second.conflict).toBe(true);

    const final = await loadVersioned<Doc>(SCRATCH_KEY, seed);
    expect(final.value.project_name).toBe("A");
  });
});
