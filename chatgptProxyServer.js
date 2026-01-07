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
    const { mode, predicted_text, expected_text, question, answer, level } = req.body;

    // New mode: speech word breakdown verification/cleanup
    if (mode === "speech_word_breakdown" || predicted_text || expected_text) {
      const predicted = (predicted_text || "").toString().trim();
      const expected = (expected_text || "").toString().trim();

      if (!predicted) {
        return res.status(400).json({ error: "predicted_text is required" });
      }

      const prompt = `You are a transcript alignment assistant.

Input 1 (predicted_text): The ASR transcript of what the user actually said.
Input 2 (expected_text): The script the user was supposed to read. This can include noise like headings (UNIT/CHAPTER), page numbers, standalone question numbers, etc.

Your task: return a JSON object with a clean list of words to display in a "Pronunciation Breakdown" UI.

Rules:
- Prefer predicted_text for display unless it is empty or clearly unusable.
- Remove obvious noise tokens from expected_text (e.g., UNIT, CHAPTER, LESSON, standalone numbers like 7, 12, 13, etc).
- Output tokens (words) in reading order.
- Keep contractions like "it's", "don't" as a single token if they appear.
- Do NOT invent new content beyond predicted_text/expected_text.
- Limit to max 200 words.

Return JSON in this shape:
{
  "display_source": "predicted" | "expected" | "mixed",
  "display_text": "<string>",
  "display_words": ["word1", "word2", ...]
}

predicted_text:
${predicted.slice(0, 8000)}

expected_text:
${expected.slice(0, 8000)}`;

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
              content:
                "Return only JSON. You clean transcripts and produce token lists for UI display.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
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

      let result;
      try {
        result = JSON.parse(content);
      } catch {
        result = { display_source: "predicted", display_text: predicted, display_words: predicted.split(/\s+/).slice(0, 200) };
      }

      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      return res.json(result);
    }

    // Existing mode: IELTS writing assessment
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

// PDF Extraction Proxy endpoint
app.post("/pdfExtractProxy", async (req, res) => {
  try {
    const { pdf_base64, extracted_text, prompt } = req.body;

    // If we have extracted_text, process it with ChatGPT
    if (extracted_text) {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const processingPrompt = prompt || 
        `Please process and format the following text extracted from a PDF. Clean up any formatting issues, preserve paragraph structure, and return the cleaned text. Do not add any commentary, just return the cleaned text:\n\n${extracted_text.substring(0, 100000)}`;

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
              content: "You are a helpful assistant that processes and cleans text extracted from PDF files. Return only the cleaned text without any additional commentary.",
            },
            {
              role: "user",
              content: processingPrompt,
            },
          ],
          max_tokens: 4000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API Error:", errorText);
        // Return the raw extracted text if ChatGPT processing fails
        res.header("Access-Control-Allow-Origin", "*");
        return res.json({ text: extracted_text });
      }

      const data = await response.json();
      const processedText = data.choices?.[0]?.message?.content || extracted_text;

      res.header("Access-Control-Allow-Origin", "*");
      return res.json({ text: processedText });
    }

    // If we have pdf_base64, we would need a PDF parsing library on the server
    // For now, return an error suggesting client-side extraction
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(400).json({ 
      error: "Please extract PDF text client-side first, then send extracted_text for processing" 
    });
  } catch (err) {
    console.error("PDF Extract Proxy Error:", err);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: err.message });
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
