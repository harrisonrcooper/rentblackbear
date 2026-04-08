// lib/supabase-server.js
// Centralized Supabase client for server-side (API routes, cron jobs).
// Uses env vars without NEXT_PUBLIC_ prefix when available.

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const headers = {
  apikey: SUPA_KEY,
  Authorization: `Bearer ${SUPA_KEY}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=representation",
};

/**
 * Low-level fetch wrapper for Supabase REST API (server-side).
 */
export function supa(path, opts = {}) {
  return fetch(SUPA_URL + "/rest/v1/" + path, {
    ...opts,
    headers: {
      ...headers,
      Prefer: opts.prefer || headers.Prefer,
      ...(opts.headers || {}),
    },
  });
}

/**
 * GET rows from a table with query string.
 * @param {string} table
 * @param {string} query - PostgREST query params (e.g. "select=id&pm_id=eq.abc")
 */
export async function supaGet(table, query = "") {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  return r.json();
}

/**
 * Upsert rows into a table.
 * @param {string} table
 * @param {object|object[]} data
 */
export async function supaUpsert(table, data) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const err = await r.text();
    console.error(`[supaUpsert] ${table} failed:`, err);
    return null;
  }
  return r.json();
}

/**
 * PATCH rows in a table.
 * @param {string} table - table name with filter (e.g. "tenants?id=eq.abc")
 * @param {object} updates
 */
export async function supaPatch(table, updates) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(updates),
  });
  if (!r.ok) {
    const err = await r.text();
    console.error(`[supaPatch] ${table} failed:`, err);
    return null;
  }
  return r.json();
}

/**
 * DELETE rows from a table.
 * @param {string} tableWithFilter - e.g. "tenants?id=eq.abc"
 */
export async function supaDelete(tableWithFilter) {
  return fetch(`${SUPA_URL}/rest/v1/${tableWithFilter}`, {
    method: "DELETE",
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
}

/**
 * Load from app_data key-value store (for config that stays there).
 */
export async function loadAppData(key, fallback) {
  try {
    const r = await supaGet("app_data", `key=eq.${key}&select=value`);
    return r?.[0]?.value ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Save to app_data key-value store.
 */
export async function saveAppData(key, data) {
  try {
    await supaUpsert("app_data", { key, value: data });
  } catch (e) {
    console.error("saveAppData error:", key, e);
  }
}
