export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {}
  }

  const { phases, completedCount, totalCount, currentPhase } = body || {};

  if (!phases) {
    return res.status(400).json({ error: 'Missing phases data' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a career coaching assistant helping Brian, a senior marketing professional with 9 years at adidas Terrex, transition into AI-Enhanced Marketing Ops roles at Nike, HOKA, or Adidas at $110k+.

Here is his current AI career curriculum progress:
- Completed: ${completedCount} of ${totalCount} tasks
- Current phase: ${currentPhase}
- Phases data: ${JSON.stringify(phases, null, 2)}

Based on his completion rate and current phase, provide:
1. A brief assessment of his momentum (2-3 sentences)
2. The 2-3 highest-leverage tasks he should focus on next
3. One specific tip for accelerating his job search given his marketing background
4. An honest estimate of readiness for his target roles

Keep it direct, specific to his situation, and under 250 words. No generic advice.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || 'No response generated.';

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error('Optimize error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}