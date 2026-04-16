// lib/workspace.js
// Multi-tenant workspace isolation for PropOS / Black Bear Rentals SaaS.
//
// Two layers coexist here:
//
// 1) Legacy app_data prefix layer (getWorkspaceId, wsKey) — each
//    Clerk userId maps 1:1 to a workspace slug, and all app_data
//    keys get prefixed `{workspace_id}:{key}`. Kept until every
//    call site migrates to the new resolution helpers below.
//
// 2) New host-based resolution (getWorkspaceFromHost,
//    getCurrentWorkspace) — driven by the Host header and the
//    x-workspace-id request header that proxy.ts sets. This is the
//    path the Flagship admin / portal / marketing shells consume.

import { headers } from "next/headers";
import { getDomain, getWorkspace } from "./edge-config";

const WORKSPACE_HEADER = "x-workspace-id";

// ==========================================================
// Legacy prefix layer — still used by lib/supabase-client.js
// ==========================================================

/**
 * Server-side: resolve workspace from Clerk user metadata.
 * MVP: workspace_id = the Clerk userId itself.
 * Future: Supabase lookup → workspaces table → workspace_id.
 * @param {string|null} userId
 * @returns {string}
 */
export function getWorkspaceId(userId) {
  return userId || "default";
}

/**
 * Prefix a key with the workspace_id for app_data isolation.
 * If workspaceId is falsy or "default", returns the bare key
 * (backwards compat with pre-multi-tenant data).
 * @param {string|null} workspaceId
 * @param {string} key
 * @returns {string}
 */
export function wsKey(workspaceId, key) {
  if (!workspaceId || workspaceId === "default") return key;
  return `${workspaceId}:${key}`;
}

// ==========================================================
// Host-based resolution — used by proxy.ts + server routes
// ==========================================================

/**
 * Given a Host header value, return the workspace record (merged
 * with its domain metadata) or null.
 *
 * Used by proxy.ts during the incoming request pass so routing
 * decisions (marketing / admin / portal / custom-domain) and the
 * x-workspace-id request header can both be derived from one
 * lookup.
 *
 * @param {string|null} host
 * @returns {Promise<object|null>}
 */
export async function getWorkspaceFromHost(host) {
  const domain = await getDomain(host);
  if (!domain?.workspaceId) return null;
  const workspace = await getWorkspace(domain.workspaceId);
  if (!workspace) return null;
  return { ...workspace, domain };
}

/**
 * Server components / route handlers: resolve the current
 * workspace from the x-workspace-id header that proxy.ts attached
 * to the incoming request. Returns null when the header is
 * missing (local dev before proxy.ts is wired, scripts, etc.).
 *
 * @returns {Promise<object|null>}
 */
export async function getCurrentWorkspace() {
  let workspaceId = null;
  try {
    workspaceId = headers().get(WORKSPACE_HEADER);
  } catch {
    // Called outside a request scope (e.g. from a script).
    return null;
  }
  if (!workspaceId) return null;
  return getWorkspace(workspaceId);
}

export function getWorkspaceHeaderName() {
  return WORKSPACE_HEADER;
}
