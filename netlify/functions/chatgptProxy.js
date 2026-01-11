exports.handler = async (event) => {
  const allowedOrigin = "https://speazyai.netlify.app";

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { mode, predicted_text, expected_text, question, answer, level, words, messages } = body;

    // New mode: generate word scores when all scores are 0
    if (mode === "generate_word_scores" && words) {
      const wordsList = Array.isArray(words) ? words : [];
      
      if (wordsList.length === 0) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: "words array is required" }),
        };
      }

      const wordTexts = wordsList.map((w) => (w.word_text || w).toString().trim()).filter(Boolean);
      
      if (wordTexts.length === 0) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: "No valid words provided" }),
        };
      }

      const prompt = `You are a pronunciation assessment assistant. Given a list of words from a speech assessment, generate believable pronunciation scores (0-100) for each word. 

The scores should:
- Range between 60-95 for most words (typical pronunciation scores)
- Vary naturally (not all the same)
- Be realistic (common words typically score higher, complex words may score lower)
- Avoid extremes (don't give all 100s or all 60s)

Words to score:
${wordTexts.slice(0, 200).join(", ")}

Return a JSON object mapping each word to a score (0-100):
{
  "word_scores": {
    "word1": 85,
    "word2": 78,
    ...
  }
}`;

      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return {
          statusCode: 500,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: "OpenAI API key not configured" }),
        };
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
              content: "Return only JSON. Generate realistic pronunciation scores (0-100) for words.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API Error:", errorText);
        return {
          statusCode: response.status,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: `OpenAI API error: ${errorText}` }),
        };
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        return {
          statusCode: 500,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: "No response from OpenAI" }),
        };
      }

      let result;
      try {
        result = JSON.parse(content);
      } catch {
        // Fallback: generate random scores between 70-90
        const fallbackScores = {};
        wordTexts.forEach((word) => {
          fallbackScores[word] = Math.floor(Math.random() * 21) + 70; // 70-90
        });
        result = { word_scores: fallbackScores };
      }

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Headers": "Content-Type",
        },
      body: JSON.stringify(result),
    };
  }

    // Chat mode: handle conversational chat with role-based system messages
    if (mode === "chat" && messages) {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return {
          statusCode: 500,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: "OpenAI API key not configured" }),
        };
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API Error:", errorText);
        return {
          statusCode: response.status,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: `OpenAI API error: ${errorText}` }),
        };
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        return {
          statusCode: 500,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: "No response from OpenAI" }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ response: content }),
      };
    }

    // New mode: speech word breakdown verification/cleanup
    if (mode === "speech_word_breakdown" || predicted_text || expected_text) {
      const predicted = (predicted_text || "").toString().trim();
      const expected = (expected_text || "").toString().trim();

      if (!predicted) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: "predicted_text is required" }),
        };
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

      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return {
          statusCode: 500,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: "OpenAI API key not configured" }),
        };
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
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
        return {
          statusCode: response.status,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: `OpenAI API error: ${errorText}` }),
        };
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        return {
          statusCode: 500,
          headers: { "Access-Control-Allow-Origin": allowedOrigin },
          body: JSON.stringify({ error: "No response from OpenAI" }),
        };
      }

      let result;
      try {
        result = JSON.parse(content);
      } catch {
        result = {
          display_source: "predicted",
          display_text: predicted,
          display_words: predicted.split(/\s+/).slice(0, 200),
        };
      }

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(result),
      };
    }

    if (!question || !answer) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
        body: JSON.stringify({ error: "Question and answer are required" }),
      };
    }

    // Construct the prompt for IELTS assessment
    const escapedAnswer = answer.replace(/"/g, '\\"').replace(/\n/g, '\\n');
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
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
        body: JSON.stringify({ error: "OpenAI API key not configured" }),
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
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
      return {
        statusCode: response.status,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
        body: JSON.stringify({ error: `OpenAI API error: ${errorText}` }),
      };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
        body: JSON.stringify({ error: "No response from OpenAI" }),
      };
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

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(assessmentResult),
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

