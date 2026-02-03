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
    const isScripted = typeof targetEndpoint === "string" && targetEndpoint.includes("speech-assessment/scripted");

    // Build API body: strip endpoint and expected_text; map expected_text → reference_text for scripted
    const { endpoint: _e, expected_text: expectedText, ...rest } = req.body;
    let apiBody = { ...rest };

    // Language Confidence scripted API does not accept "expected_text" — use "reference_text"
    const refField = process.env.LC_SCRIPT_FIELD || "reference_text";
    if (isScripted && expectedText != null && String(expectedText).trim() !== "") {
      apiBody[refField] = typeof expectedText === "string" ? expectedText : String(expectedText);
    }
    delete apiBody.expected_text;
    delete apiBody.script;

    // For scripted, send only whitelisted fields to avoid upstream 422 "Extra inputs are not permitted"
    if (isScripted) {
      apiBody = {
        audio_base64: apiBody.audio_base64,
        audio_format: apiBody.audio_format,
        ...(apiBody[refField] && { [refField]: apiBody[refField] }),
      };
    }

    const response = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.LC_API_KEY,
        "lc-beta-features": req.headers["lc-beta-features"] || "false",
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
