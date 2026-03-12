// app/api/chat/route.js
// Handles AI chat requests server-side so the API key stays secure.
// Set ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables.

const CHAT_CTX = `You are the AI assistant for Black Bear Rentals in Huntsville, AL. Rent by the bedroom. All rooms furnished with bed, dresser, TV. Google Fiber WiFi always included. Cleaning: 5-bed weekly, 3-bed biweekly. No pets, no smoking, no shoes. Quiet hours 10pm-7am weekdays, 11pm-10am weekends. SD = 1 month rent, secures room. First month rent due on/before move-in. No app fee, tenant pays for background check. 12-month standard lease, flexible for interns/contractors. Properties: Holmes House (SFH, 5bd, first $100 utils then split), Lee Drive East & West (Townhomes, 3bd, all utils included). Rooms $600-$850/mo. Be friendly and concise.`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({
        reply: "Our AI assistant is being set up. For questions, email info@rentblackbear.com or call (256) 555-0192!"
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
        system: CHAT_CTX,
        messages,
      }),
    });

    const data = await res.json();
    const reply = data.content?.map(c => c.text || "").join("") || "Sorry, I had trouble with that. Try again!";

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({
      reply: "Trouble connecting right now. Reach us at info@rentblackbear.com!"
    }, { status: 500 });
  }
}
