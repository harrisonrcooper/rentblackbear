// Optimistic-concurrency reads/writes for the `app_data` JSONB store.
//
// The legacy path (actions/budget/_writer.ts saveAppData) is a blind
// full-blob upsert: whoever writes last wins, and the other editor's work
// vanishes with no error. That is fine for a single tab and catastrophic
// for two — which is exactly how the build planner is used (both spouses).
//
// This module adds compare-and-swap without a schema migration. The version
// counter lives INSIDE the JSONB value under `_v`, and the update is filtered
// on it server-side:
//
//   PATCH /app_data?key=eq.<k>&value->>_v=eq.<expected>
//
// Postgres evaluates the filter and the write in one statement, so a stale
// writer updates zero rows and gets told, rather than silently overwriting.
// Callers recover by merging (see lib/build/merge.ts) and retrying.
//
// `_v` is stripped on read and stamped on write, so callers never see it.

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

/** The in-blob version field. Reserved — callers must not use this key. */
export const VERSION_FIELD = "_v";

export interface Versioned<T> {
  value: T;
  /** 0 means "no row exists yet". */
  version: number;
}

/**
 * Flat rather than a discriminated union on purpose: this repo compiles with
 * `strict: false`, under which TypeScript will not narrow a union by a
 * literal-boolean discriminant. Optional fields keep the call sites honest.
 */
export interface CasResult<T> {
  ok: boolean;
  /** Set when ok. The version now stored. */
  version?: number;
  /** Set when the write was refused because the stored version moved. */
  conflict?: boolean;
  /** Set when conflict: what the server actually holds, ready to merge. */
  latest?: Versioned<T>;
  /** Set when the write failed for any other reason. */
  message?: string;
}

function headers(prefer: string): Record<string, string> {
  return {
    apikey: SUPA_KEY,
    Authorization: `Bearer ${SUPA_KEY}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

function requireEnv(): void {
  if (!SUPA_URL || !SUPA_KEY) {
    throw new Error("Supabase env vars not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
}

function stripVersion<T>(raw: Record<string, unknown>): { value: T; version: number } {
  const rawVersion = raw[VERSION_FIELD];
  const version = typeof rawVersion === "number" ? rawVersion : 0;
  const clone = { ...raw };
  delete clone[VERSION_FIELD];
  return { value: clone as T, version };
}

/**
 * Read a blob plus its current version. A missing row yields
 * `{ value: fallback, version: 0 }` — which is also the version a first
 * write must present.
 */
export async function loadVersioned<T>(key: string, fallback: T): Promise<Versioned<T>> {
  requireEnv();
  const res = await fetch(
    `${SUPA_URL}/rest/v1/app_data?key=eq.${encodeURIComponent(key)}&select=value`,
    { headers: headers("return=representation"), cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error(`loadVersioned(${key}) failed (${res.status}): ${await res.text()}`);
  }
  const rows = (await res.json()) as Array<{ value: Record<string, unknown> | null }>;
  if (rows.length === 0 || rows[0].value == null) {
    return { value: fallback, version: 0 };
  }
  return stripVersion<T>(rows[0].value);
}

/**
 * Write `value` only if the stored version is still `expectedVersion`.
 *
 * Returns `{ ok: false, conflict: true, latest }` when someone else wrote
 * first — `latest` is the current server state, ready to merge against.
 * Never overwrites a newer row.
 */
export async function saveCas<T>(
  key: string,
  value: T,
  expectedVersion: number,
  fallback: T,
): Promise<CasResult<T>> {
  requireEnv();
  const nextVersion = expectedVersion + 1;
  const body = { ...(value as Record<string, unknown>), [VERSION_FIELD]: nextVersion };

  async function patchWhere(filter: string): Promise<CasResult<T> | null> {
    const res = await fetch(
      `${SUPA_URL}/rest/v1/app_data?key=eq.${encodeURIComponent(key)}&${filter}`,
      { method: "PATCH", headers: headers("return=representation"), body: JSON.stringify({ value: body }) },
    );
    if (!res.ok) {
      return { ok: false, message: `saveCas(${key}) failed (${res.status}): ${await res.text()}` };
    }
    const updated = (await res.json()) as unknown[];
    return updated.length > 0 ? { ok: true, version: nextVersion } : null; // null = filter matched nothing
  }

  // Version 0 has two meanings, and they are not distinguishable from the
  // read: either no row exists yet, or a LEGACY row exists that predates the
  // `_v` field (every blob written before this module shipped). Handle the
  // legacy row first — treating it as "no row" and inserting would collide on
  // the primary key forever, and the planner could never save again.
  if (expectedVersion === 0) {
    const upgraded = await patchWhere(`value->>${VERSION_FIELD}=is.null`);
    if (upgraded) return upgraded;

    const res = await fetch(`${SUPA_URL}/rest/v1/app_data`, {
      method: "POST",
      headers: headers("return=minimal"),
      body: JSON.stringify({ key, value: body }),
    });
    if (res.ok) return { ok: true, version: nextVersion };
    if (res.status === 409) {
      // The row appeared between our PATCH and our INSERT, already versioned.
      return { ok: false, conflict: true, latest: await loadVersioned<T>(key, fallback) };
    }
    return { ok: false, message: `saveCas(${key}) insert failed (${res.status}): ${await res.text()}` };
  }

  const result = await patchWhere(`value->>${VERSION_FIELD}=eq.${expectedVersion}`);
  if (result) return result;

  // Filter matched nothing: the version moved under us.
  return { ok: false, conflict: true, latest: await loadVersioned<T>(key, fallback) };
}
