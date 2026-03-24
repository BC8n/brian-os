// api/optimize.js
// Vercel serverless function — proxies requests to Anthropic API.
// The API key lives in Vercel env vars, never exposed to the browser.
 
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set");
    return res.status(500).json({ error: "Server misconfiguration: missing API key" });
  }
 
  // Accept either { prompt } or { system, prompt } from the client
  const { prompt, system } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Missing required field: prompt" });
  }
 
  try {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    };
 
    // Include system prompt if provided
    if (system) body.system = system;
 
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
 
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", response.status, errData);
      return res.status(response.status).json({
        error: errData?.error?.message || `Anthropic returned ${response.status}`,
      });
    }
 
    const data = await response.json();
    const insight = data.content?.map(c => c.text || "").join("") || "";
 
    return res.status(200).json({ insight });
  } catch (err) {
    console.error("Handler exception:", err);
    return res.status(500).json({ error: "Could not generate insight" });
  }
}
 