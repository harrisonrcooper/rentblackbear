// proxy.ts — Vercel / Next.js routing middleware.
//
// File name note:
//   Next.js 16 renamed middleware.ts -> proxy.ts for routing-layer
//   logic. This repo is still on Next 14.2, where proxy.ts is NOT
//   auto-detected — middleware.ts (the Clerk auth file) is what
//   actually runs today. When the repo upgrades to Next 16, this
//   file becomes the canonical routing middleware; until then it
//   documents the intended host routing + workspace resolution so
//   the logic is version-controlled and ready to activate.
//
// What it does:
//   1) Reads the Host header on every incoming request.
//   2) Looks up the domain in Edge Config (with a static fallback
//      in dev — see lib/edge-config.js).
//   3) Sets x-workspace-id on the request so server components +
//      route handlers can call getCurrentWorkspace() without
//      re-doing the Host lookup.
//   4) Rewrites + redirects based on the domain type:
//        marketing  -> serve the (marketing) route group; block
//                      /admin, /portal, /vendor, /investor paths.
//        admin      -> rewrite / to /admin, pass /admin/* through.
//        portal     -> rewrite / to /portal, pass /portal/* through,
//                      block /admin.
//        custom     -> identical to portal but the workspace was
//                      matched via its custom domain record.
//
// When merging this with Clerk's middleware.ts, run this logic
// FIRST (workspace resolution), then hand off to clerkMiddleware
// for /admin auth checks.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDomain } from "./lib/edge-config";

const HEADER_WORKSPACE = "x-workspace-id";
const HEADER_DOMAIN_TYPE = "x-domain-type";

// Prefixes that should never resolve on the marketing origin.
const NON_MARKETING_PREFIXES = [
  "/admin",
  "/portal",
  "/vendor",
  "/investor",
  "/apply",
  "/sign",
  "/lease",
];

function stripPort(host: string): string {
  const idx = host.indexOf(":");
  return idx === -1 ? host : host.slice(0, idx);
}

function isInternalPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json"
  );
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (isInternalPath(pathname)) {
    return NextResponse.next();
  }

  const rawHost = request.headers.get("host") || "";
  const hostLookup = rawHost.toLowerCase();
  const domain = (await getDomain(hostLookup)) || (await getDomain(stripPort(hostLookup)));

  // Unknown host — let the request through so the default marketing
  // experience (or a 404) serves, but tag it so observability can
  // distinguish "no workspace matched" from "no proxy ran".
  if (!domain) {
    const passthrough = NextResponse.next();
    passthrough.headers.set(HEADER_DOMAIN_TYPE, "unmatched");
    return passthrough;
  }

  // Build response headers first so the downstream handler sees them
  // on the request (via the reverse-proxy trick Next supports).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HEADER_DOMAIN_TYPE, domain.type);
  if (domain.workspaceId) {
    requestHeaders.set(HEADER_WORKSPACE, domain.workspaceId);
  }

  // --- Marketing ---
  if (domain.type === "marketing") {
    if (NON_MARKETING_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      const url = request.nextUrl.clone();
      url.hostname = "app.tenantory.com";
      url.pathname = pathname;
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // --- Admin ---
  if (domain.type === "admin") {
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.rewrite(url, { headers: requestHeaders });
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // --- Portal (incl. custom domains) ---
  if (domain.type === "portal" || domain.type === "custom") {
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/portal";
      return NextResponse.rewrite(url, { headers: requestHeaders });
    }
    if (pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.hostname = "app.tenantory.com";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Skip Next internals, static files, and most asset extensions.
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json).*)",
  ],
};
