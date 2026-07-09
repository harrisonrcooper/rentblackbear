// Edge-safe session primitives for the shared-password admin gate.
//
// This module replaces Clerk. It is imported by middleware.ts (Edge
// runtime) AND by Node route handlers, so it may only use Web Crypto
// and btoa/atob — never `next/headers` or the node:crypto module.
// Cookie reading that needs next/headers lives in lib/auth.ts.
//
// Token format:  base64url(JSON payload) "." base64url(HMAC-SHA256 sig)
// The signature covers the encoded payload, so tampering with `uid`
// or `exp` invalidates the token.

export const SESSION_COOKIE = "bb_admin_session";

/** Session lifetime when the user ticks "keep me signed in". */
export const REMEMBER_ME_SECONDS = 60 * 60 * 24 * 30; // 30 days
/** Session lifetime otherwise — long enough for a working day. */
export const DEFAULT_SESSION_SECONDS = 60 * 60 * 12; // 12 hours

export interface SessionPayload {
  /** The principal id every downstream query keys on. See ADMIN_USER_ID. */
  uid: string;
  /** Unix seconds. */
  exp: number;
}

const encoder = new TextEncoder();

function requireSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or shorter than 32 chars. " +
        "Generate one with: openssl rand -hex 32",
    );
  }
  return secret;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(requireSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function toBase64Url(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  let s = input.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4 !== 0) s += "=";
  return atob(s);
}

function bytesToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return toBase64Url(binary);
}

async function sign(data: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(data));
  return bytesToBase64Url(sig);
}

/**
 * Compare two strings without leaking their contents through timing.
 * Both sides are hashed first so unequal lengths cost the same as equal
 * ones — a naive `a === b` short-circuits on the first differing byte.
 */
async function constantTimeEquals(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

/** True when `candidate` matches ADMIN_PASSWORD. Throws if unconfigured. */
export async function verifyPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not set — the admin gate has no password to check against.");
  }
  return constantTimeEquals(candidate, expected);
}

/** The single principal id the whole app runs as. */
export function adminUserId(): string {
  const uid = process.env.ADMIN_USER_ID;
  if (!uid) {
    throw new Error("ADMIN_USER_ID is not set — workspace-scoped data cannot be keyed.");
  }
  return uid;
}

export async function signSession(uid: string, ttlSeconds: number): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = toBase64Url(JSON.stringify({ uid, exp } satisfies SessionPayload));
  return `${body}.${await sign(body)}`;
}

/** Returns the payload, or null if the token is malformed, forged, or expired. */
export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;

  const body = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);

  let expectedSig: string;
  try {
    expectedSig = await sign(body);
  } catch {
    // Secret missing/short — fail closed rather than admitting the request.
    return null;
  }
  if (!(await constantTimeEquals(providedSig, expectedSig))) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(fromBase64Url(body));
  } catch {
    return null;
  }
  if (!payload?.uid || typeof payload.exp !== "number") return null;
  if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

  return payload;
}
