import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { SESSION_COOKIE, verifySession } from './lib/auth-session';

// Everything under /admin sits behind the shared-password gate.
// The tenant portal has its own Supabase auth and must NOT be
// double-protected here — hence the narrow matcher below.
//
// API routes are deliberately excluded: each handler calls `auth()`
// itself and returns 401 JSON rather than a redirect to an HTML page.
export default async function middleware(req: NextRequest) {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/sign-in';
  url.search = '';
  url.searchParams.set('redirect_url', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*'],
};
