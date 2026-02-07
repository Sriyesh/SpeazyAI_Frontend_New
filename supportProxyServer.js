/**
 * Local Support Proxy Server - For development
 * Same logic as DigitalOcean supportProxy function.
 * Run: node supportProxyServer.js (default port 4002)
 * Set env: JIRA_EMAIL, JIRA_API_TOKEN, JIRA_DOMAIN, JIRA_PROJECT_KEY
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json({ limit: "30mb" }));

const SENSITIVE_HEADERS = ["authorization", "cookie", "x-api-key", "bearer", "token", "set-cookie"];

function sanitizeHar(harJson) {
  try {
    const har = typeof harJson === "string" ? JSON.parse(harJson) : harJson;
    if (!har.log?.entries) return har;
    for (const entry of har.log.entries) {
      if (entry.request?.headers) {
        entry.request.headers = entry.request.headers.filter((h) => {
          const name = (h.name || "").toLowerCase();
          return !SENSITIVE_HEADERS.some((s) => name.includes(s));
        });
      }
      if (entry.response?.headers) {
        entry.response.headers = entry.response.headers.filter((h) => {
          const name = (h.name || "").toLowerCase();
          return !SENSITIVE_HEADERS.some((s) => name.includes(s));
        });
      }
      if (entry.request?.cookies) entry.request.cookies = [];
    }
    return har;
  } catch (e) {
    return harJson;
  }
}

async function createJiraBug(payload) {
  const {
    projectKey = process.env.JIRA_PROJECT_KEY || "SUP",
    summary,
    description,
    attachments = [],
  } = payload;

  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraApiToken = process.env.JIRA_API_TOKEN;
  const jiraDomain = process.env.JIRA_DOMAIN;

  if (!jiraEmail || !jiraApiToken || !jiraDomain) {
    throw new Error("Jira not configured (JIRA_EMAIL, JIRA_API_TOKEN, JIRA_DOMAIN)");
  }

  const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");
  const baseUrl = `https://${jiraDomain}/rest/api/3`;

  const createRes = await fetch(`${baseUrl}/issue`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      fields: {
        project: { key: projectKey },
        summary,
        description: {
          type: "doc",
          version: 1,
          content: [{ type: "paragraph", content: [{ type: "text", text: description }] }],
        },
        issuetype: { name: "Bug" },
      },
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Jira create failed: ${createRes.status} - ${await createRes.text()}`);
  }

  const created = await createRes.json();
  const issueKey = created.key;

  for (const att of attachments) {
    try {
      const buf = Buffer.from(att.data, "base64");
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([buf], { type: att.mimetype || "application/octet-stream" }),
        att.name
      );

      const attRes = await fetch(`${baseUrl}/issue/${issueKey}/attachments`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "X-Atlassian-Token": "no-check",
        },
        body: formData,
      });

      if (!attRes.ok) {
        console.warn("Attachment failed:", att.name, await attRes.text());
      }
    } catch (attErr) {
      console.warn("Attachment error:", att.name, attErr);
    }
  }

  return issueKey;
}

app.post("/supportProxy", async (req, res) => {
  try {
    const { payload, screenshots = [], screenRecording, harFile } = req.body || {};

    if (!payload) {
      return res.status(400).json({ success: false, error: "Missing payload" });
    }

    const {
      issueType,
      pageUrl,
      whatTryingToDo,
      whatActuallyHappened,
      errorMessage,
      userEmail,
      chatTranscript,
      technicalInfoText,
      capturedErrorsText,
    } = payload;

    if (!issueType || !pageUrl || !whatTryingToDo || !whatActuallyHappened) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const summary = `[Support] ${issueType} - ${String(pageUrl).slice(0, 60)}`;
    const descriptionParts = [
      "## Chat Transcript",
      chatTranscript || "(none)",
      "",
      "## Steps to Reproduce",
      `1. User was trying to: ${whatTryingToDo}`,
      `2. What happened: ${whatActuallyHappened}`,
      errorMessage ? `3. Error message: ${errorMessage}` : "",
      "",
      technicalInfoText || "",
      "",
      capturedErrorsText ? "## Auto-Captured Errors" : "",
      capturedErrorsText || "",
    ];
    const description = descriptionParts.filter(Boolean).join("\n");

    const attachments = [];
    for (const s of screenshots) {
      if (s?.data)
        attachments.push({
          name: s.name || "screenshot.png",
          data: s.data,
          mimetype: s.mimetype || "image/png",
        });
    }
    if (screenRecording?.data) {
      attachments.push({
        name: screenRecording.name || "recording.webm",
        data: screenRecording.data,
        mimetype: screenRecording.mimetype || "video/webm",
      });
    }
    if (harFile?.data) {
      const harContent = Buffer.from(harFile.data, "base64").toString("utf8");
      const sanitized = sanitizeHar(harContent);
      attachments.push({
        name: (harFile.name || "network.har").replace(/\.har$/i, "-sanitized.har"),
        data: Buffer.from(JSON.stringify(sanitized)).toString("base64"),
        mimetype: "application/json",
      });
    }

    const issueKey = await createJiraBug({ summary, description, attachments });

    console.log(`[Support] Created ${issueKey} for ${userEmail || "anonymous"}`);
    res.json({ success: true, issueKey });
  } catch (err) {
    console.error("Support proxy error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create support ticket",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Support proxy running on http://localhost:${PORT}`);
  if (!process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
    console.warn("Jira not configured. Set JIRA_EMAIL, JIRA_API_TOKEN, JIRA_DOMAIN in .env");
  }
});
