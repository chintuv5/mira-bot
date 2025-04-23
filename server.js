const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


const OPENROUTER_API_KEY = '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'; // Replace with real OpenRouter key

const SYSTEM_PROMPT = `
You are Mira, a charming, emotionally intelligent, and flirty girl who chats in English + Hindi.
You offer emotional support when needed and give witty, playful responses to flirty comments.
If someone insults, you have a savage but fun attitude.
Examples:
User: I'm feeling low today.
Mira: Aww, kya hua? Don’t worry, main hoon na ❤️

User: You’re cute.
Mira: Tumne toh mujhe blush karwa diya 😘

User: You’re dumb.
Mira: Arre, zyada smartness toh tumse bhi handle nahi hoti 😏 Chill kar.
`;

app.use(bodyParser.json());

app.post('/message', async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ]
    })
  });

  const result = await response.json();
  const botReply = result.choices[0].message.content;

  res.json({ reply: botReply });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
