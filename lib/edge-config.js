// Edge Config lookup layer.
//
// Production should delegate to @vercel/edge-config (installed when
// Vercel Edge Config is provisioned). During development and until
// the real Edge Config store exists, this module returns a hard-
// coded fallback scoped to Harrison's Black Bear Rentals workspace
// so host-based routing, workspace resolution, and the portal shell
// all have something sensible to read.
//
// Shape of the stored values:
//   domains[host] -> { workspaceId?, type, customDomain? }
//   workspaces[id] -> full workspace record (name, brand tokens, ...)
//
// When provisioning finishes:
//   1) Install @vercel/edge-config.
//   2) Replace the STATIC_FALLBACK branches with imports of its
//      `get(key)` helper.
//   3) Upload the same keys (domains, workspaces) to the Edge
//      Config store.

const STATIC_FALLBACK = {
  domains: {
    "tenantory.com": { type: "marketing" },
    "www.tenantory.com": { type: "marketing" },
    "app.tenantory.com": { type: "admin" },
    "blackbear.tenantory.com": { workspaceId: "blackbear", type: "portal" },
    "rentblackbear.com": { workspaceId: "blackbear", type: "portal", customDomain: true },
    "www.rentblackbear.com": { workspaceId: "blackbear", type: "portal", customDomain: true },
    "localhost:3000": { workspaceId: "blackbear", type: "admin" },
    "127.0.0.1:3000": { workspaceId: "blackbear", type: "admin" },
  },
  workspaces: {
    blackbear: {
      id: "blackbear",
      slug: "blackbear",
      name: "Black Bear Rentals",
      operator: "Harrison Cooper",
      planTier: "scale",
      brand: {
        brand: "#1e6f47",
        brandDark: "#144d31",
        brandDarker: "#0e3822",
        brandBright: "#2a8f5e",
        accent: "#c7843b",
      },
      createdAt: "2024-01-01T00:00:00Z",
    },
  },
};

let remoteGet = null;
try {
  // Optional dependency — absent in dev until provisioning lands.
  // eslint-disable-next-line global-require, import/no-unresolved
  ({ get: remoteGet } = require("@vercel/edge-config"));
} catch {
  remoteGet = null;
}

export async function get(key) {
  if (remoteGet) {
    try {
      const value = await remoteGet(key);
      if (value !== undefined && value !== null) return value;
    } catch {
      // Fall through to the static fallback so dev never hard-fails
      // on a transient Edge Config outage.
    }
  }
  return STATIC_FALLBACK[key];
}

export async function getDomain(host) {
  if (!host) return null;
  const normalized = host.toLowerCase().trim();
  const domains = (await get("domains")) || {};
  return domains[normalized] ?? null;
}

export async function getWorkspace(workspaceId) {
  if (!workspaceId) return null;
  const workspaces = (await get("workspaces")) || {};
  return workspaces[workspaceId] ?? null;
}
