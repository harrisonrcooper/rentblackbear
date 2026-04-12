// app/api/chat/route.js
// Handles AI chat requests server-side so the API key stays secure.
// Set ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables.

import { getSettings } from "@/lib/getSettings";

// Build chat context dynamically from settings — no hardcoded branding
function buildChatCtx(s) {
  if (s.chatCtx) return s.chatCtx; // Operator can override entirely via settings
  return `You are the AI assistant for ${s.companyName || "this property management company"} in ${s.city || ""}. Be friendly and concise. Answer questions about rooms, pricing, policies, and the application process based on what you know. If you don't know specifics, direct the visitor to email ${s.email || "us"} or call ${s.phone || "us"}.`;
}

// Max chars for a single user message. Chat is the most abuseable public route
// because every token hits the Anthropic billing meter — keep this tight.
const MAX_MESSAGE_CHARS = 4000;

export async function POST(request) {
  try {
    // ── Origin check ────────────────────────────────────────────────
    // Rejects requests from outside the operator's deploy domains.
    // TODO(saas-multitenant): drive this allowlist from settings.siteUrl
    // once per-tenant deploys land. The hardcoded rentblackbear.com entry
    // is the current operator deploy URL, not product branding.
    const ALLOWED_ORIGINS = [
      process.env.NEXT_PUBLIC_SITE_URL,
      "https://rentblackbear.com",
      "https://rentblackbear.vercel.app",
      "http://localhost:3000",
    ].filter(Boolean);
    const origin = request.headers.get("origin") || request.headers.get("referer") || "";
    const isAllowed = ALLOWED_ORIGINS.some(ok => origin.startsWith(ok));
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { message, history } = await request.json();

    // Max-size guard — Claude costs money per token
    if (typeof message !== "string" || message.length === 0) {
      return new Response(JSON.stringify({ error: "Message required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return new Response(JSON.stringify({ error: `Message too long (max ${MAX_MESSAGE_CHARS} characters)` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const s = await getSettings();
    if (!apiKey) {
      return Response.json({
        reply: `Our AI assistant is being set up. For questions, email ${s.email || "us"} or call ${s.phone || "us"}!`
      });
    }

    const messages = [
      ...(history || []).map(h => ({ role: h.role, content: h.content })),
      { role: "user", content: message }
    ];

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: buildChatCtx(s),
        messages,
      }),
    });

    const data = await res.json();
    const reply = data.content?.map(c => c.text || "").join("") || "Sorry, I had trouble with that. Try again!";

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({
      reply: "Trouble connecting right now. Please try again shortly!"
    }, { status: 500 });
  }
}
