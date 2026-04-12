// lib/workspace.js
// Multi-tenant workspace isolation for PropOS SaaS.
//
// MVP strategy: workspace_id = Clerk userId (each user = one workspace).
// Keys in app_data become `{workspace_id}:{key}` — e.g. `ws_abc:hq-props`.
// When workspace_id is null/undefined/"default", bare keys are used
// for full backwards compatibility with existing single-tenant data.

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
 * If workspaceId is falsy or "default", returns the bare key (backwards compat).
 * @param {string|null} workspaceId
 * @param {string} key
 * @returns {string}
 */
export function wsKey(workspaceId, key) {
  if (!workspaceId || workspaceId === "default") return key;
  return `${workspaceId}:${key}`;
}
