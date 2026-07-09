import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  DEFAULT_SESSION_SECONDS,
  REMEMBER_ME_SECONDS,
  adminUserId,
  signSession,
  verifyPassword,
} from "@/lib/auth-session";

export const runtime = "nodejs";
// Never cache an auth exchange.
export const dynamic = "force-dynamic";

// Throttle brute-force attempts. In-memory, so it resets on redeploy and
// is per-instance — adequate for a single-tenant admin gate, not a
// substitute for a shared store if this ever fronts multiple regions.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map(); // ip -> { count, firstAt }

function clientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.firstAt > WINDOW_MS) return false;
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(ip) {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
    return;
  }
  record.count += 1;
}

export async function POST(req) {
  const ip = clientIp(req);

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";
  const remember = body.remember === true;

  if (!password) {
    recordFailure(ip);
    return NextResponse.json({ error: "Enter your password." }, { status: 400 });
  }

  let ok;
  let uid;
  try {
    ok = await verifyPassword(password);
    uid = adminUserId();
  } catch (err) {
    // Misconfiguration, not a bad password. Loud in logs, vague to the client.
    console.error("[auth/login] admin gate misconfigured:", err?.message || err);
    return NextResponse.json({ error: "Sign-in is unavailable." }, { status: 500 });
  }

  if (!ok) {
    recordFailure(ip);
    console.warn("[auth/login] failed attempt", { ip });
    return NextResponse.json({ error: "That password is incorrect." }, { status: 401 });
  }

  attempts.delete(ip);

  const maxAge = remember ? REMEMBER_ME_SECONDS : DEFAULT_SESSION_SECONDS;
  const token = await signSession(uid, maxAge);

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}
