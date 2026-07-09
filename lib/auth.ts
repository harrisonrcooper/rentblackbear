// Drop-in replacement for Clerk's server-side `auth()`.
//
// The app used to authenticate individual Clerk users. It now runs
// behind a single shared password (see lib/auth-session.ts), so every
// signed-in caller is the SAME principal: ADMIN_USER_ID.
//
// Call sites keep the Clerk shape — `const { userId, orgId } = await auth()`
// — so the ~20 route handlers and server actions that key data on
// `userId` (budget blobs, storage paths, workspace resolution) resolve
// exactly the rows they resolved before. Point ADMIN_USER_ID at the old
// Clerk user id and no data is orphaned.
//
// `orgId` is always null. The Clerk instance never had organizations
// enabled, so `orgId || userId` already collapsed to `userId` everywhere.

import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySession } from "./auth-session";

export interface AuthResult {
  userId: string | null;
  orgId: null;
}

/**
 * Reads the signed session cookie. Returns `{ userId: null }` when the
 * caller is anonymous — it never throws, matching how the optional-admin
 * call sites (send-sms, generate-lease-pdf) already treat a failed check.
 */
export async function auth(): Promise<AuthResult> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  return { userId: session?.uid ?? null, orgId: null };
}

/** True when the request carries a valid admin session. */
export async function isSignedIn(): Promise<boolean> {
  const { userId } = await auth();
  return userId !== null;
}
