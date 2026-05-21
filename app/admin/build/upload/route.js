// Image upload for the build inspiration boards. Takes a file, stores
// it in the Supabase Storage `build-inspiration` bucket (public), and
// returns its URL. A route handler (not a server action) so large
// image bodies aren't capped.

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { isAuthorizedForBudget } from "@/actions/budget/_households";

export const dynamic = "force-dynamic";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);

export async function POST(req) {
  const { userId } = await auth();
  if (!userId || !isAuthorizedForBudget(userId)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  if (!SUPA_URL || !SUPA_KEY) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 500 });
  }

  let file;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return NextResponse.json({ error: "Bad upload." }, { status: 400 });
  }
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Images only (PNG, JPG, WEBP, GIF, AVIF)." }, { status: 400 });
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Image is over 20 MB." }, { status: 400 });
  }

  const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const rand = Math.random().toString(36).slice(2, 10);
  const path = `${userId}/${Date.now()}-${rand}.${ext}`;

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const res = await fetch(`${SUPA_URL}/storage/v1/object/build-inspiration/${path}`, {
      method: "POST",
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": file.type,
        "Cache-Control": "max-age=31536000",
      },
      body: buf,
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Upload failed (${res.status}).` }, { status: 500 });
    }
    const url = `${SUPA_URL}/storage/v1/object/public/build-inspiration/${path}`;
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed." }, { status: 500 });
  }
}
