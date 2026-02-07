/**
 * Support Route Handler - Creates Jira Bug tickets from support chatbot submissions
 * Accepts JSON body: { payload, screenshots[], screenRecording, harFile } (base64)
 * Sanitizes HAR, creates Jira issue, uploads attachments
 */

import { createJiraBug, sanitizeHar } from './jiraService.js';

/**
 * Handle support ticket submission (JSON body with base64 attachments)
 */
export async function handleSupportTicketJson(req, res) {
  try {
    const { payload, screenshots = [], screenRecording, harFile } = req.body || {};

    if (!payload) {
      return res.status(400).json({ success: false, error: 'Missing payload' });
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
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const summary = `[Support] ${issueType} - ${String(pageUrl).slice(0, 60)}`;
    const descriptionParts = [
      '## Chat Transcript',
      chatTranscript || '(none)',
      '',
      '## Steps to Reproduce',
      `1. User was trying to: ${whatTryingToDo}`,
      `2. What happened: ${whatActuallyHappened}`,
      errorMessage ? `3. Error message: ${errorMessage}` : '',
      '',
      technicalInfoText || '',
      '',
      capturedErrorsText ? '## Auto-Captured Errors' : '',
      capturedErrorsText || '',
    ];
    const description = descriptionParts.filter(Boolean).join('\n');

    const attachments = [];
    for (const s of screenshots) {
      if (s?.data) {
        attachments.push({
          filename: s.name || 'screenshot.png',
          blob: new Blob([Buffer.from(s.data, 'base64')], { type: s.mimetype || 'image/png' }),
        });
      }
    }
    if (screenRecording?.data) {
      attachments.push({
        filename: screenRecording.name || 'recording.webm',
        blob: new Blob([Buffer.from(screenRecording.data, 'base64')], { type: screenRecording.mimetype || 'video/webm' }),
      });
    }
    if (harFile?.data) {
      const harContent = Buffer.from(harFile.data, 'base64').toString('utf8');
      const sanitized = sanitizeHar(harContent);
      attachments.push({
        filename: (harFile.name || 'network.har').replace(/\.har$/i, '-sanitized.har'),
        blob: new Blob([JSON.stringify(sanitized)], { type: 'application/json' }),
      });
    }

    const issueKey = await createJiraBug({
      summary,
      description,
      attachments: attachments.map((a) => ({ filename: a.filename, blob: a.blob })),
    });

    const jiraDomain = process.env.JIRA_DOMAIN;
    const jiraUrl = jiraDomain ? `https://${jiraDomain}/browse/${issueKey}` : issueKey;
    console.log(`[Support] Created ${issueKey} for ${userEmail || 'anonymous'}. ${jiraUrl}`);

    res.json({ success: true, issueKey });
  } catch (err) {
    console.error('Support ticket error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create support ticket',
    });
  }
}
