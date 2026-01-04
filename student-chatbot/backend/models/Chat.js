import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Message required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(message);

    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ reply: "Server error while processing your message." });
  }
});
