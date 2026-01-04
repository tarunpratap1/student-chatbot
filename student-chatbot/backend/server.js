// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();
// console.log('gemini api key: ', process.env.GEMINI_API_KEY)
// const app = express();
// app.use(cors());
// app.use(express.json());

// // Initialize Gemini client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Chat route
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ reply: "Message required" });

//     // Use Gemini 1.5 Flash (fast) or Pro (more capable)
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const result = await model.generateContent(message);

//     // Extract reply text
//     const reply = result.response.text();
//     res.json({ reply });
//   } catch (err) {
//     console.error("Gemini error:", err);
//     res.status(500).json({ reply: "Server error while processing your message." });
//   }
// });

// // Health check
// app.get("/", (req, res) => {
//   res.send("🚀 Gemini backend running!");
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });












import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// File upload setup
const upload = multer({ storage: multer.memoryStorage() });

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Chat route (existing) ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Message required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(message);

    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ reply: "Server error while processing your message." });
  }
});

// --- PDF Analyze route ---
app.post("/api/analyze-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ reply: "PDF file required" });

    const pdfData = await pdfParse(req.file.buffer);

    const text = pdfData.text?.slice(0, 20000) || "No text extracted from PDF.";

    const prompt = `Analyze this PDF content and provide:
- A concise summary (5–7 bullet points)
- Key concepts and definitions
- Any equations or data worth noting
- Suggested questions for a student to test understanding

PDF content:
${text}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);

    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("PDF analyze error:", err);
    res.status(500).json({ reply: "Failed to analyze PDF." });
  }
});

// --- Lens (Image Analysis) route ---
app.post("/api/analyze-image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ reply: "Image file required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: "Analyze this image and describe what you see." },
            { inlineData: { mimeType: req.file.mimetype, data: req.file.buffer.toString("base64") } },
          ],
        },
      ],
    });

    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("Image analyze error:", err);
    res.status(500).json({ reply: "Failed to analyze image." });
  }
});

// --- Health check ---
app.get("/", (req, res) => {
  res.send("🚀 PixelTalk backend with Chat, PDF Analyze & Lens running.");
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

