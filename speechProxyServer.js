// A simple local proxy server for LanguageConfidence API
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.post("/speechProxy", async (req, res) => {
  try {
    // Get endpoint from query parameter, default to unscripted
    const targetEndpoint = req.query.endpoint || "https://apis.languageconfidence.ai/speech-assessment/unscripted/uk";
    
    // Forward only the fields the API expects (remove endpoint if it was in body)
    const { endpoint: _, ...apiBody } = req.body;
    
    const response = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.LC_API_KEY,
        "lc-beta-features": "false", // Force false since client sends it now
        ...(req.headers["lc-beta-features"] && { "lc-beta-features": req.headers["lc-beta-features"] }),
      },
      body: JSON.stringify(apiBody),
    });

    const data = await response.json();
    res.set("Access-Control-Allow-Origin", "*");
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Speech Proxy server running on http://localhost:${PORT}`));
