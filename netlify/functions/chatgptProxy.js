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
    const { question, answer, level } = JSON.parse(event.body || "{}");

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
  "originalText": "${escapedAnswer}",
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

