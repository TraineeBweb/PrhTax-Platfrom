import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Lazy initialize Gemini API client
  const getAi = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    return new GoogleGenAI({ apiKey: key });
  };

  // API: Health
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API: AI Analysis using Gemini 3.1 Pro Preview
  app.post("/api/analyze-video-client", async (req, res) => {
    try {
      const { prompt, videoContext } = req.body;
      const ai = getAi();

      if (!ai) {
        return res.json({
          success: true,
          source: "built-in-intelligence",
          response: `The client Prashantt (PR Accounting) has laid out clear automation requirements for bank statement processing in Drake Accounting:
1. **Intake & Extraction**: Read bank CSVs (Date, Raw Description, Amount).
2. **First Month Setup**: Segregate transactions and map unclassified items to Suspense Account #900.
3. **Vendor Rule Memory**: 80-90% of monthly transactions repeat; automatically match descriptions to GL accounts.
4. **Drake Export**: Format data for Drake Accounting's spreadsheet import format.
5. **Exception Report**: Alert CPA staff to review only the unmapped items, freeing up time for high-value tax advisory.`,
        });
      }

      const systemInstruction = `You are a Senior Accounting Systems & AI Automation Architect analyzing client requirements from video meetings and SOP documents. Focus on Drake Accounting integration, bank statement ingestion, suspense account 900 mapping, and keystroke/macro automation.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemInstruction}\n\nContext:\n${videoContext || ""}\n\nUser Question/Prompt:\n${prompt || "Provide a detailed executive breakdown of the client's request and automation roadmap."}`,
              },
            ],
          },
        ],
      });

      res.json({
        success: true,
        source: "gemini-3.1-pro-preview",
        response: response.text,
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate AI analysis",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
