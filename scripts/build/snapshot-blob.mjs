#!/usr/bin/env node
// Immutable archive snapshot of the build planner's blob.
//
// Writes a copy to a NEW app_data row keyed `build:archive:<iso>` — a key
// nothing in the app ever reads, updates, or deletes. This is the insurance
// policy taken before any change to the write path: the owner's China vendor
// contacts and finish selections cannot be re-sourced if a bug scrambles them.
//
// Also drops a JSON copy in backups/ so a snapshot survives losing Supabase.
//
//   node scripts/build/snapshot-blob.mjs            # snapshot the build blob
//   node scripts/build/snapshot-blob.mjs --list     # list existing archives
//
// Idempotent in the sense that every run makes a new, additive row. It never
// overwrites. Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// and ADMIN_USER_ID in .env.local.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
const WORKSPACE = env.ADMIN_USER_ID;

if (!URL_ || !KEY || !WORKSPACE) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or ADMIN_USER_ID in .env.local");
  process.exit(1);
}

const headers = (prefer = "return=representation") => ({
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
  Prefer: prefer,
});

const ARCHIVE_PREFIX = "build:archive:";

async function list() {
  const res = await fetch(`${URL_}/rest/v1/app_data?key=like.${encodeURIComponent(ARCHIVE_PREFIX + "*")}&select=key,updated_at`, {
    headers: headers(),
  });
  const rows = await res.json();
  if (!rows.length) return console.log("No archives yet.");
  for (const r of rows) console.log(`  ${r.key}   (row written ${r.updated_at})`);
}

async function snapshot() {
  const sourceKey = `build:${WORKSPACE}`;

  const res = await fetch(`${URL_}/rest/v1/app_data?key=eq.${encodeURIComponent(sourceKey)}&select=value`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`read ${sourceKey} failed (${res.status}): ${await res.text()}`);

  const rows = await res.json();
  if (!rows.length || rows[0].value == null) throw new Error(`No blob at ${sourceKey} — refusing to snapshot nothing.`);

  const value = rows[0].value;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const archiveKey = `${ARCHIVE_PREFIX}${stamp}`;

  const counts = Object.entries(value)
    .filter(([, v]) => Array.isArray(v))
    .map(([k, v]) => `${k}=${v.length}`)
    .join(" ");

  // Plain INSERT, no on_conflict: a duplicate key must fail loudly rather
  // than silently overwrite an existing archive.
  const put = await fetch(`${URL_}/rest/v1/app_data`, {
    method: "POST",
    headers: headers("return=minimal"),
    body: JSON.stringify({ key: archiveKey, value }),
  });
  if (!put.ok) throw new Error(`archive write failed (${put.status}): ${await put.text()}`);

  mkdirSync(resolve(ROOT, "backups"), { recursive: true });
  const file = resolve(ROOT, "backups", `${archiveKey.replace(/:/g, "_")}.json`);
  writeFileSync(file, JSON.stringify(value, null, 2));

  console.log(`Archived ${sourceKey} -> ${archiveKey}`);
  console.log(`  db row:  app_data[${archiveKey}]  (never read, updated, or deleted by the app)`);
  console.log(`  on disk: ${file.replace(ROOT + "/", "")}`);
  console.log(`  content: ${counts}`);
}

const cmd = process.argv[2];
try {
  if (cmd === "--list") await list();
  else await snapshot();
} catch (e) {
  console.error("FAILED:", e.message);
  process.exit(1);
}
