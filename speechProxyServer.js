// A simple local proxy server for LanguageConfidence API
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/speechProxy", async (req, res) => {
  try {
    const response = await fetch(
      "https://apis.languageconfidence.ai/speech-assessment/scripted/uk",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.LC_API_KEY,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.set("Access-Control-Allow-Origin", "*");
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Proxy server running on http://localhost:${PORT}`));
