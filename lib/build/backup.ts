// Backup bundle: everything the planner knows, in one verifiable file.
//
// Two stores back the planner — the big JSONB blob and the engine collection
// rows — so a backup that captures one and not the other is worse than none.
// The bundle carries both, plus the version each was read at, so a restore can
// tell whether the live data has moved since the export.
//
// Uploaded images are NOT inlined. They live in Supabase Storage, which is
// replicated and is not the thing at risk; the bundle records their URLs so a
// restore can tell you if any are missing. (The brief asked for a zip of an
// /uploads folder — there isn't one, because uploads never touched local disk.)

import { loadVersioned } from "@/lib/app-data";

import { listAll } from "./collections";
import type { CollectionName, EngineRow } from "./collections";
import { buildKey } from "@/actions/build/_store";
import type { BuildState } from "@/actions/build/_store";

export const BACKUP_FORMAT = "dreambuild-backup";
export const BACKUP_VERSION = 1;

export const BACKED_UP_COLLECTIONS: CollectionName[] = [
  "tasks", "tags", "taggings", "comments", "activity", "attachments", "links",
];

export interface BackupBundle {
  format: typeof BACKUP_FORMAT;
  bundle_version: number;
  exported_at: string;
  workspace: string;
  blob: { version: number; value: BuildState };
  collections: Record<string, EngineRow[]>;
  /** Every Storage URL referenced by the data, so a restore can verify them. */
  storage_manifest: string[];
  /** Row counts, so a truncated file is obvious without diffing. */
  counts: Record<string, number>;
}

function storageUrls(state: BuildState): string[] {
  const urls = new Set<string>();
  for (const p of state.photos || []) if (p.url) urls.add(p.url);
  for (const b of state.boards || []) {
    for (const item of b.items || []) if (item.kind === "image" && item.url) urls.add(item.url);
  }
  return [...urls];
}

export async function exportBundle(workspaceId: string): Promise<BackupBundle> {
  const { value, version } = await loadVersioned<BuildState>(buildKey(workspaceId), null as unknown as BuildState);
  if (!value) throw new Error("No build data to export.");

  const collections: Record<string, EngineRow[]> = {};
  for (const name of BACKED_UP_COLLECTIONS) {
    collections[name] = await listAll<EngineRow>(workspaceId, name);
  }

  const counts: Record<string, number> = {};
  for (const [k, v] of Object.entries(value)) if (Array.isArray(v)) counts[k] = v.length;
  for (const [k, v] of Object.entries(collections)) counts[`collection:${k}`] = v.length;

  return {
    format: BACKUP_FORMAT,
    bundle_version: BACKUP_VERSION,
    exported_at: new Date().toISOString(),
    workspace: workspaceId,
    blob: { version, value },
    collections,
    storage_manifest: storageUrls(value),
    counts,
  };
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a bundle before it is allowed anywhere near live data.
 *
 * Deliberately strict: a restore overwrites everything, so a file that is
 * merely *probably* a backup gets rejected. `counts` is cross-checked against
 * the actual arrays, which catches a truncated or hand-edited file.
 */
export function validateBundle(raw: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: ["Not a JSON object."], warnings };
  }
  const b = raw as Partial<BackupBundle>;

  if (b.format !== BACKUP_FORMAT) errors.push(`Not a ${BACKUP_FORMAT} file.`);
  if (typeof b.bundle_version !== "number") errors.push("Missing bundle_version.");
  else if (b.bundle_version > BACKUP_VERSION) errors.push(`Bundle version ${b.bundle_version} is newer than this app understands (${BACKUP_VERSION}).`);

  if (!b.blob || typeof b.blob !== "object") errors.push("Missing blob.");
  else {
    if (typeof b.blob.version !== "number") errors.push("Missing blob.version.");
    const v = b.blob.value as unknown as Record<string, unknown> | undefined;
    if (!v || typeof v !== "object") errors.push("Missing blob.value.");
    else {
      for (const required of ["rooms", "team", "references", "selections"]) {
        if (!Array.isArray(v[required])) errors.push(`blob.value.${required} is not an array.`);
      }
    }
  }

  if (b.collections && typeof b.collections === "object") {
    for (const [name, rows] of Object.entries(b.collections)) {
      if (!Array.isArray(rows)) errors.push(`collections.${name} is not an array.`);
    }
  } else {
    warnings.push("Bundle has no engine collections — tasks and comments will be empty after restore.");
  }

  // Cross-check the declared counts against reality.
  if (b.counts && b.blob?.value) {
    const value = b.blob.value as unknown as Record<string, unknown>;
    for (const [k, expected] of Object.entries(b.counts)) {
      if (k.startsWith("collection:")) {
        const name = k.slice("collection:".length);
        const actual = (b.collections || {})[name]?.length ?? 0;
        if (actual !== expected) errors.push(`counts says ${k}=${expected} but the file has ${actual}.`);
      } else {
        const actual = Array.isArray(value[k]) ? (value[k] as unknown[]).length : -1;
        if (actual !== expected) errors.push(`counts says ${k}=${expected} but the file has ${actual < 0 ? "no array" : actual}.`);
      }
    }
  } else if (!b.counts) {
    warnings.push("Bundle has no counts — cannot verify it is complete.");
  }

  return { ok: errors.length === 0, errors, warnings };
}

/** A short, human summary of what restoring this file would put back. */
export function describeBundle(b: BackupBundle): string {
  const rooms = b.counts?.rooms ?? 0;
  const team = b.counts?.team ?? 0;
  const refs = b.counts?.references ?? 0;
  const tasks = b.counts?.["collection:tasks"] ?? 0;
  const when = b.exported_at?.slice(0, 10) ?? "unknown date";
  return `${rooms} rooms, ${team} vendors, ${refs} references, ${tasks} tasks — exported ${when}`;
}
