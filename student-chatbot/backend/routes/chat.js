import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'Message required' });

    // Call Gemini API
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a reply.";

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ reply: 'Server error while processing your message.' });
  }
});

export default router;
