export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: { message: data.error.message } });
    }

    const replyText = data.choices?.[0]?.message?.content || "Systems nominal, Boss.";

    return res.status(200).json({
      content: [{ type: 'text', text: replyText }]
    });

  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
}