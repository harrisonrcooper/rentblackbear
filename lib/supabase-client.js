// lib/supabase-client.js
// Centralized Supabase client for browser-side (client components).
// Uses NEXT_PUBLIC_ env vars. Import this instead of hardcoding credentials.

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPA_URL || !SUPA_KEY) {
  console.warn("[supabase-client] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/**
 * Low-level fetch wrapper for Supabase REST API.
 * @param {string} path - PostgREST path (e.g. "tenants?select=*")
 * @param {object} opts - fetch options (method, body, prefer, headers)
 */
export function supa(path, opts = {}) {
  return fetch(SUPA_URL + "/rest/v1/" + path, {
    ...opts,
    headers: {
      apikey: SUPA_KEY,
      Authorization: "Bearer " + SUPA_KEY,
      "Content-Type": "application/json",
      Prefer: opts.prefer || "return=representation",
      ...(opts.headers || {}),
    },
  });
}

/**
 * Load a value from the app_data key-value table.
 * Used for config/settings data that stays in app_data.
 * @param {string} key
 * @param {*} fallback
 */
export async function loadAppData(key, fallback) {
  try {
    const r = await supa("app_data?key=eq." + key + "&select=value");
    const d = await r.json();
    return d && d.length > 0 && d[0].value != null ? d[0].value : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Save a value to the app_data key-value table.
 * Used for config/settings data that stays in app_data.
 * @param {string} key
 * @param {*} data
 */
export async function saveAppData(key, data) {
  try {
    await supa("app_data", {
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: JSON.stringify({ key, value: data }),
    });
  } catch (e) {
    console.error("saveAppData error:", key, e);
  }
}

/**
 * Upload a file to Supabase Storage, return public URL.
 */
export async function uploadFile(bucket, path, file) {
  const r = await fetch(SUPA_URL + "/storage/v1/object/" + bucket + "/" + path, {
    method: "POST",
    headers: {
      apikey: SUPA_KEY,
      Authorization: "Bearer " + SUPA_KEY,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });
  if (!r.ok) throw new Error("Upload failed: " + (await r.text()));
  return SUPA_URL + "/storage/v1/object/public/" + bucket + "/" + path;
}
