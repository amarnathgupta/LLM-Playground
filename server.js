import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static files
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const {
      messages = [],
      temperature,
      top_p,
      max_tokens,
      top_k,
      frequency_penalty,
      presence_penalty,
    } = req.body;

    if (!messages.length) {
      return res.status(400).json({ error: "Messages required" });
    }

    const systemMessage = messages.find((m) => m.role === "system");

    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents,
      config: {
        temperature,
        topP: top_p,
        topK: top_k,
        frequencyPenalty: frequency_penalty,
        presencePenalty: presence_penalty,
        maxOutputTokens: max_tokens,
        systemInstruction: systemMessage?.content || "",
      },
    });

    const reply = response.text;
    res.json({ reply });
  } catch (error) {
    console.error("ERROR:", error);

    res.status(200).json({
      reply: "⚠️ Model is busy, please try again 🙏",
      error: true,
    });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
