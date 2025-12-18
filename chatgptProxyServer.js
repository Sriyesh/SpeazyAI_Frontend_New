// A simple local proxy server for OpenAI ChatGPT API
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle preflight requests
app.options("/chatgptProxy", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.post("/chatgptProxy", async (req, res) => {
  try {
    const { question, answer, level } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    // Construct the prompt for IELTS assessment
    const prompt = `You are an IELTS writing examiner. Please assess the following writing task according to IELTS Writing Task 2 standards.

Question/Prompt: ${question}

Student's Answer: ${answer}

Level: ${level}

Please provide:
1. An overall IELTS band score (0-9 scale)
2. Detailed feedback on:
   - Task Response (how well the answer addresses the question)
   - Coherence and Cohesion (organization and linking)
   - Lexical Resource (vocabulary range and accuracy)
   - Grammatical Range and Accuracy
3. Specific corrections - identify exact phrases/sentences from the student's answer that need improvement
4. Strengths of the writing

IMPORTANT: In the "corrections" array, identify specific text from the student's answer that needs improvement. Each correction should have:
- "original": the exact text from the student's answer (must match exactly)
- "corrected": the improved version
- "explanation": why this change improves the writing

Format your response as JSON with the following structure:
{
  "ieltsScore": <number>,
  "feedback": "<overall feedback text>",
  "originalText": "${answer.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
  "corrections": [
    {
      "original": "<exact text from student's answer that needs improvement>",
      "corrected": "<improved version>",
      "explanation": "<why this change is better>"
    }
  ],
  "breakdown": {
    "taskResponse": "<feedback>",
    "coherenceAndCohesion": "<feedback>",
    "lexicalResource": "<feedback>",
    "grammaticalRangeAndAccuracy": "<feedback>"
  },
  "suggestions": ["<suggestion1>", "<suggestion2>", ...],
  "strengths": ["<strength1>", "<strength2>", ...]
}

Be encouraging but honest. Adjust your expectations based on the level (beginner, intermediate, advanced). Find at least 2-5 specific corrections if there are errors.`;

    // Call OpenAI API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert IELTS writing examiner. Provide detailed, constructive feedback in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      return res.status(response.status).json({ error: `OpenAI API error: ${errorText}` });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: "No response from OpenAI" });
    }

    // Parse the JSON response
    let assessmentResult;
    try {
      assessmentResult = JSON.parse(content);
    } catch (parseError) {
      // If parsing fails, return the raw response as feedback
      assessmentResult = {
        ieltsScore: null,
        feedback: content,
        response: content,
      };
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.json(assessmentResult);
  } catch (err) {
    console.error("ChatGPT Proxy Error:", err);
    res.header("Access-Control-Allow-Origin", "*");
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ status: "ok", service: "chatgpt-proxy", port: process.env.PORT || 4001 });
});

const PORT = process.env.PORT || 4001; // Use different port to avoid conflict with speechProxyServer
app.listen(PORT, () => {
  console.log(`🤖 ChatGPT Proxy server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Make sure OPENAI_API_KEY is set in your .env file`);
});

