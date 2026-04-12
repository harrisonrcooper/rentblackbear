// app/api/receipt-scan/route.js
// Accepts a base64-encoded receipt image, sends to Claude Vision API,
// returns extracted fields: date, amount, vendor, description, category
// Hardened: retry logic, confidence scoring, input validation, duplicate detection

import { auth } from "@clerk/nextjs/server";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 5MB limit — base64 encodes ~33% larger, so 5MB file ≈ 6.67M base64 chars
const MAX_BASE64_LENGTH = 7_000_000;

async function supaGet(path) {
  const r = await fetch(SUPA_URL + "/rest/v1/" + path, {
    headers: { apikey: SUPA_KEY, Authorization: "Bearer " + SUPA_KEY },
  });
  if (!r.ok) return [];
  return r.json();
}

async function callAnthropicWithRetry(apiKey, body, maxRetries = 3) {
  const delays = [1000, 2000, 4000];
  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        // Don't retry 4xx client errors (except 429 rate limit)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          return { ok: false, error: data.error?.message || "API error", retryable: false, status: response.status };
        }
        lastError = { error: data.error?.message || `API error (${response.status})`, status: response.status };
        if (attempt < maxRetries - 1) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
          continue;
        }
        return { ok: false, error: lastError.error, retryable: true, status: lastError.status };
      }

      return { ok: true, data };
    } catch (e) {
      lastError = { error: e.message || "Network error" };
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, delays[attempt]));
        continue;
      }
      return { ok: false, error: lastError.error, retryable: true };
    }
  }

  return { ok: false, error: lastError?.error || "Max retries exceeded", retryable: true };
}

function checkDuplicate(expenses, fields) {
  if (!Array.isArray(expenses) || !fields.amount || !fields.vendor || !fields.date) return null;

  const targetDate = new Date(fields.date + "T00:00:00");
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  for (const exp of expenses) {
    if (!exp.amount || !exp.vendor || !exp.date) continue;
    const expAmount = Number(exp.amount);
    const fieldAmount = Number(fields.amount);
    if (Math.abs(expAmount - fieldAmount) > 0.01) continue;

    const expVendor = (exp.vendor || "").toLowerCase().trim();
    const fieldVendor = (fields.vendor || "").toLowerCase().trim();
    if (expVendor !== fieldVendor) continue;

    const expDate = new Date(exp.date + "T00:00:00");
    if (Math.abs(targetDate - expDate) <= sevenDays) {
      return { duplicate: true, existingId: exp.id };
    }
  }
  return null;
}

export async function POST(request) {
  // Clerk admin gate
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return Response.json({ ok: false, error: "Unauthorized", retryable: false }, { status: 401 });
    }

    var workspaceId = orgId || userId;
  } catch (e) {
    console.error("[receipt-scan] Clerk auth() failed:", e?.message || e);
    return Response.json({ ok: false, error: "Auth check failed", retryable: false }, { status: 500 });
  }

  try {
    const { image, mediaType } = await request.json();
    if (!image) {
      return Response.json({ ok: false, error: "No image provided", retryable: false }, { status: 400 });
    }

    // Input validation: reject images > 5MB
    if (image.length > MAX_BASE64_LENGTH) {
      return Response.json(
        { ok: false, error: "Image too large. Maximum size is 5MB.", retryable: false },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ ok: false, error: "ANTHROPIC_API_KEY not configured", retryable: false }, { status: 500 });
    }

    const result = await callAnthropicWithRetry(apiKey, {
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
  "category": "best match from this list: Advertising, Auto & Travel, Cleaning & Maintenance, Commissions, Insurance, Legal & Professional Fees, Management Fees, Mortgage Interest, Other Interest, Repairs, Supplies, Taxes — Property, Utilities, Depreciation, Other" or null,
  "confidence": a number between 0.0 and 1.0 indicating how confident you are in the overall extraction accuracy,
  "reasoning": "brief explanation of confidence level, e.g. 'clear receipt with all fields visible' or 'blurry image, amount uncertain'"
}

Important:
- For amount, use the TOTAL or AMOUNT DUE, not subtotal
- For date, convert to YYYY-MM-DD format
- For category, pick the closest match from the list provided
- If a field cannot be determined, set it to null
- For confidence: 1.0 = all fields clearly readable, 0.5 = some fields uncertain, 0.0 = cannot read receipt at all
- Return ONLY the JSON object, nothing else`,
            },
          ],
        },
      ],
    });

    if (!result.ok) {
      console.error("Anthropic API error after retries:", result.error);
      return Response.json(
        { ok: false, error: result.error, retryable: result.retryable ?? false },
        { status: result.status || 500 }
      );
    }

    // Extract the text response
    const text = result.data.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!text) {
      return Response.json({ ok: false, error: "No response from AI", retryable: true }, { status: 500 });
    }

    // Parse JSON — strip any backticks if present
    let fields;
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      fields = JSON.parse(clean);
    } catch (parseErr) {
      console.error("Receipt scan JSON parse failure:", text);
      return Response.json(
        { ok: false, error: "Failed to parse AI response. Please try again with a clearer image.", retryable: true },
        { status: 422 }
      );
    }

    // Extract confidence metadata
    const confidence = typeof fields.confidence === "number" ? fields.confidence : null;
    const reasoning = fields.reasoning || null;

    // Remove meta fields from the expense fields
    delete fields.confidence;
    delete fields.reasoning;

    // Build response
    const response = { ok: true, fields, confidence, reasoning };

    // Confidence warning
    if (confidence !== null && confidence < 0.5) {
      response.warning = "Low confidence scan. Please verify the extracted fields before saving.";
    }

    // Duplicate detection — load expenses and check
    try {
      const rows = await supaGet(
        `app_data?select=value&key=eq.hq-expenses&workspace_id=eq.${encodeURIComponent(workspaceId)}&limit=1`
      );
      const expenses = rows?.[0]?.value;
      if (Array.isArray(expenses)) {
        const dup = checkDuplicate(expenses, fields);
        if (dup) {
          response.duplicate = true;
          response.existingId = dup.existingId;
        }
      }
    } catch {
      // Duplicate check is best-effort, don't fail the scan
    }

    return Response.json(response);
  } catch (err) {
    console.error("Receipt scan error:", err);
    return Response.json(
      { ok: false, error: "Failed to process receipt: " + err.message, retryable: true },
      { status: 500 }
    );
  }
}
