#!/usr/bin/env node
// Import the parts of "DREAMING HOME BUILD.xlsx" the seed never captured.
//
//   node scripts/build/import-workbook.mjs            # dry run — writes nothing
//   node scripts/build/import-workbook.mjs --apply    # snapshot, then write
//
// Dry run is the default because this writes to the owner's only copy of his
// vendor contacts. --apply takes an immutable archive first, then uses
// compare-and-swap so a concurrent edit in the browser cannot be clobbered.
//
// Safe to run twice: the planner is idempotent (scripts/build/plan-import.mjs).

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

import { applyToState, planImport, planSize } from "./plan-import.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function loadEnv() {
  const env = {};
  for (const line of readFileSync(resolve(ROOT, ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const WS = env.ADMIN_USER_ID;
if (!URL_ || !KEY || !WS) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or ADMIN_USER_ID.");
  process.exit(1);
}

const APPLY = process.argv.includes("--apply");
const headers = (prefer = "return=representation") => ({
  apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: prefer,
});

async function readRow(key) {
  const res = await fetch(`${URL_}/rest/v1/app_data?key=eq.${encodeURIComponent(key)}&select=value`, {
    headers: headers(), cache: "no-store",
  });
  if (!res.ok) throw new Error(`read ${key}: ${res.status}`);
  const rows = await res.json();
  return rows.length && rows[0].value ? rows[0].value : null;
}

/** Compare-and-swap, matching lib/app-data.ts exactly (including the legacy null-_v row). */
async function casWrite(key, value, expectedVersion) {
  const body = { ...value, _v: expectedVersion + 1 };
  const filter = expectedVersion === 0
    ? "value->>_v=is.null"
    : `value->>_v=eq.${expectedVersion}`;

  const res = await fetch(`${URL_}/rest/v1/app_data?key=eq.${encodeURIComponent(key)}&${filter}`, {
    method: "PATCH", headers: headers("return=representation"), body: JSON.stringify({ value: body }),
  });
  if (!res.ok) throw new Error(`write ${key}: ${res.status} ${await res.text()}`);
  const updated = await res.json();

  if (updated.length === 0) {
    if (expectedVersion !== 0) throw new Error(`CONFLICT on ${key}: someone edited it. Nothing written. Re-run.`);
    // No row at all — insert it.
    const ins = await fetch(`${URL_}/rest/v1/app_data`, {
      method: "POST", headers: headers("return=minimal"), body: JSON.stringify({ key, value: body }),
    });
    if (!ins.ok) throw new Error(`insert ${key}: ${ins.status}`);
  }
}

const versionOf = (v) => (v && typeof v._v === "number" ? v._v : 0);
const strip = (v) => { if (!v) return v; const c = { ...v }; delete c._v; return c; };
const newId = (p) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

// ── Go ───────────────────────────────────────────────────────────────

const blobKey = `build:${WS}`;
const tasksKey = `build:tasks:${WS}`;

const rawBlob = await readRow(blobKey);
if (!rawBlob) { console.error(`No data at ${blobKey}.`); process.exit(1); }
const rawTasks = await readRow(tasksKey);

const blobVersion = versionOf(rawBlob);
const tasksVersion = versionOf(rawTasks);
const state = strip(rawBlob);
const tasks = (strip(rawTasks)?.items) || [];

const plan = planImport(state, tasks);
const size = planSize(plan);

console.log(`\nWorkbook import — ${APPLY ? "APPLY" : "DRY RUN (nothing will be written)"}\n`);
console.log(`  blob version ${blobVersion}, tasks version ${tasksVersion}, ${tasks.length} existing tasks\n`);

const show = (label, rows, fmt) => {
  console.log(`  ${label}: ${rows.length}`);
  for (const r of rows) console.log(`     + ${fmt(r)}`);
};
show("References", plan.references, (r) => `${r.title} — ${r.url}`);
show("Wants", plan.wants, (w) => `${w.label} (${w.priority})`);
show("New selections", plan.newSelections, (s) => `${s.label} — ${s.choice}`);
show("Selection notes", plan.selectionNotes, (p) => `${p.label}: ${p.note.slice(0, 66)}…`);
show("Room notes", plan.roomNotes, (p) => `${p.name}: ${p.note.slice(0, 66)}…`);
show("Vendor notes", plan.vendorNotes, (p) => `${p.role}: ${p.note.slice(0, 66)}…`);
show("Sourcing tasks", plan.sourcingTasks, (t) => t.title);

console.log(`\n  skipped as already present: ${JSON.stringify(plan.skipped)}`);
console.log(`  total writes: ${size}\n`);

if (size === 0) { console.log("  Nothing to do. Already imported.\n"); process.exit(0); }

if (!APPLY) {
  console.log("  Re-run with --apply to write. Your data is untouched.\n");
  process.exit(0);
}

// Insurance before touching the only copy.
console.log("  Archiving current data…");
execFileSync("node", [resolve(ROOT, "scripts/build/snapshot-blob.mjs")], { stdio: "inherit" });

console.log("\n  Writing blob…");
await casWrite(blobKey, applyToState(state, plan, newId), blobVersion);

if (plan.sourcingTasks.length) {
  console.log("  Writing sourcing tasks…");
  const now = new Date().toISOString();
  const nextTasks = [
    ...tasks,
    ...plan.sourcingTasks.map((t) => ({
      id: newId("tsk"), created_at: now, updated_at: now,
      title: t.title, notes: t.notes, status: "todo", priority: "normal",
      due: null, assignee: "", entity_type: null, entity_id: null,
      parent_id: null, tags: t.tags, position: 0,
    })),
  ];
  await casWrite(tasksKey, { items: nextTasks }, tasksVersion);
}

console.log(`\n  Done. ${size} items imported.\n`);
