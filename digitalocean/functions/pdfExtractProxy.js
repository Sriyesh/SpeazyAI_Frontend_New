// DigitalOcean Serverless Function - PDF Extract Proxy
// This function processes extracted PDF text with ChatGPT

export async function main(event) {
  // DigitalOcean Functions event structure
  const method = event.http?.method || event.method || 'POST';
  const headers = event.http?.headers || event.headers || {};
  const body = event.http?.body ? (typeof event.http.body === 'string' ? JSON.parse(event.http.body) : event.http.body) : (event.body || {});
  
  // CORS: Determine allowed origin (single value only)
  const requestOrigin = headers.origin || headers.Origin || "";
  const productionOrigin = process.env.ALLOWED_ORIGIN || "https://exeleratetechnology.com";
  
  // Check if origin is allowed
  let allowedOrigin = productionOrigin; // Default to production
  
  if (requestOrigin) {
    // Allow localhost for development
    if (requestOrigin === "http://localhost:3000" || requestOrigin === "http://127.0.0.1:3000") {
      allowedOrigin = requestOrigin;
    }
    // Allow DigitalOcean App Platform URLs (*.ondigitalocean.app)
    else if (requestOrigin.includes(".ondigitalocean.app")) {
      allowedOrigin = requestOrigin;
    }
    // Allow exact production domain match
    else if (requestOrigin === productionOrigin) {
      allowedOrigin = requestOrigin;
    }
  }
  
  // NEVER return "*" - always return a specific origin

  // Handle CORS preflight
  if (method === "OPTIONS") {
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
    const { pdf_base64, extracted_text, prompt } = body;

    // If we have extracted_text, process it with ChatGPT
    if (extracted_text) {
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

      const processingPrompt = prompt || 
        `Please extract only the main content text from the following PDF text. Exclude chapter titles, unit titles, headers, page numbers, image captions, and any other structural elements. Only return the paragraph content (the actual story text or body content). Do not include titles like "Unit 1", "Chapter X", or section headers. Return only the paragraph text without any commentary:\n\n${extracted_text.substring(0, 100000)}`;

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
              content: "You are a helpful assistant that extracts main content text from PDF files. Extract only paragraph content, excluding chapter titles, unit titles, headers, page numbers, image captions, and structural elements. Return only the story or body text without any titles or headers.",
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
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ text: extracted_text }),
        };
      }

      const data = await response.json();
      const processedText = data.choices?.[0]?.message?.content || extracted_text;

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ text: processedText }),
      };
    }

    // If we have pdf_base64, we would need a PDF parsing library on the server
    // For now, return an error suggesting client-side extraction
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
      },
      body: JSON.stringify({ 
        error: "Please extract PDF text client-side first, then send extracted_text for processing" 
      }),
    };
  } catch (error) {
    console.error("PDF Extract Proxy error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
