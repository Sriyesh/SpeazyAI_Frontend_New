// DigitalOcean Serverless Function - PDF Extract Proxy
// POST { extracted_text, prompt } → process with ChatGPT → return { text }

function parseBody(event) {
  let body = {};

  const raw = event?.__ow_body ?? event?.http?.body ?? event?.body ?? null;
  if (raw != null) {
    let str = raw;
    if (event?.__ow_isBase64Encoded && typeof raw === "string") {
      try {
        str = Buffer.from(raw, "base64").toString("utf8");
      } catch {
        str = raw;
      }
    }
    if (typeof str === "string" && str.trim()) {
      try {
        body = JSON.parse(str);
      } catch {
        body = {};
      }
    } else if (typeof str === "object") {
      body = str;
    }
  }

  if (!body.extracted_text && !body.prompt && (event?.extracted_text != null || event?.prompt != null)) {
    body = {
      extracted_text: event.extracted_text,
      prompt: event.prompt,
      pdf_base64: event.pdf_base64,
    };
  }

  if (event?.http?.body && typeof event.http.body === "object" && !body.extracted_text && event.http.body.extracted_text) {
    body = { ...body, ...event.http.body };
  }

  return body;
}

export async function main(event) {
  const method = event?.__ow_method ?? event?.http?.method ?? event?.method ?? "POST";

  if (method === "OPTIONS") {
    return { statusCode: 204 };
  }

  try {
    const body = parseBody(event);
    const { extracted_text, prompt, pdf_base64 } = body;

    if (extracted_text) {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "OpenAI API key not configured" }),
        };
      }

      const defaultPrompt = `Please extract only the main content text from the following PDF text. Exclude chapter titles, unit titles, headers, page numbers, image captions, and any other structural elements. Only return the paragraph content (the actual story text or body content). Do not include titles like "Unit 1", "Chapter X", or section headers. Return only the paragraph text without any commentary:\n\n`;
      const processingPrompt = (prompt && String(prompt).trim()) || defaultPrompt + extracted_text.substring(0, 100000);

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
            { role: "user", content: processingPrompt },
          ],
          max_tokens: 4000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("pdfExtractProxy OpenAI error:", errText.slice(0, 500));
        return {
          statusCode: 200,
          body: JSON.stringify({ text: extracted_text }),
        };
      }

      const data = await response.json();
      const processedText = data.choices?.[0]?.message?.content || extracted_text;

      return {
        statusCode: 200,
        body: JSON.stringify({ text: processedText }),
      };
    }

    if (pdf_base64) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Please extract PDF text client-side first, then send extracted_text for processing",
        }),
      };
    }

    console.error("pdfExtractProxy: missing extracted_text. Body keys:", Object.keys(body).join(", "));
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "extracted_text is required",
        hint: "POST JSON body with { extracted_text: string, prompt?: string }.",
      }),
    };
  } catch (err) {
    console.error("pdfExtractProxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Proxy failure",
        details: err?.message || "Server error",
      }),
    };
  }
}
