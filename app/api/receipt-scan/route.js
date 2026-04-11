// app/api/receipt-scan/route.js
// Accepts a base64-encoded receipt image, sends to Claude Vision API,
// returns extracted fields: date, amount, vendor, description, category

import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
  // Clerk admin gate
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error("[receipt-scan] Clerk auth() failed:", e?.message || e);
    return Response.json({ ok: false, error: "Auth check failed" }, { status: 500 });
  }

  try {
    const { image, mediaType } = await request.json();
    if (!image) {
      return Response.json({ ok: false, error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ ok: false, error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType || "image/jpeg",
                  data: image,
                },
              },
              {
                type: "text",
                text: `You are a receipt data extractor for a property management expense tracker. Extract the following from this receipt image and return ONLY a JSON object with no other text, no markdown backticks, no explanation:

{
  "date": "YYYY-MM-DD format or null if not found",
  "amount": number (total amount paid, no dollar sign) or null,
  "vendor": "store/business name" or null,
  "description": "brief description of what was purchased, max 60 chars" or null,
  "category": "best match from this list: Advertising, Auto & Travel, Cleaning & Maintenance, Commissions, Insurance, Legal & Professional Fees, Management Fees, Mortgage Interest, Other Interest, Repairs, Supplies, Taxes — Property, Utilities, Depreciation, Other" or null
}

Important:
- For amount, use the TOTAL or AMOUNT DUE, not subtotal
- For date, convert to YYYY-MM-DD format
- For category, pick the closest match from the list provided
- If a field cannot be determined, set it to null
- Return ONLY the JSON object, nothing else`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return Response.json({ ok: false, error: data.error?.message || "API error" }, { status: 500 });
    }

    // Extract the text response
    const text = data.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!text) {
      return Response.json({ ok: false, error: "No response from AI" }, { status: 500 });
    }

    // Parse JSON — strip any backticks if present
    const clean = text.replace(/```json|```/g, "").trim();
    const fields = JSON.parse(clean);

    return Response.json({ ok: true, fields });
  } catch (err) {
    console.error("Receipt scan error:", err);
    return Response.json({ ok: false, error: "Failed to process receipt: " + err.message }, { status: 500 });
  }
}
