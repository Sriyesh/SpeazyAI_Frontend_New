/**
 * Support API Service
 * Submits support tickets to backend (creates Jira Bug + attachments).
 * Never exposes Jira credentials to frontend.
 */

import { collectTechnicalInfo, formatTechnicalInfoForTicket } from "./technicalInfo";
import { formatCapturedErrorsForTicket } from "./errorCapture";
import { API_URLS } from "../config/apiConfig";

/** Issue types for the guided flow */
export const ISSUE_TYPES = [
  "Website not loading",
  "Login / Authentication issue",
  "Payment / Checkout issue",
  "Bug / Error on page",
  "Other",
] as const;

export type IssueType = (typeof ISSUE_TYPES)[number];

/** Structured form data collected during chatbot flow */
export interface SupportTicketPayload {
  issueType: IssueType;
  pageUrl: string;
  whatTryingToDo: string;
  whatActuallyHappened: string;
  errorMessage: string;
  userEmail?: string;
  chatTranscript: string;
}

/** Response from support API */
export interface SupportTicketResponse {
  success: boolean;
  issueKey?: string;
  error?: string;
}

/** Max file sizes (bytes) */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_HAR_SIZE = 10 * 1024 * 1024; // 10MB


/** Convert File to base64 */
async function fileToBase64(file: File): Promise<{ name: string; data: string; mimetype: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = (reader.result as string).split(",")[1];
      resolve({ name: file.name, data: data || "", mimetype: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Submit support ticket with optional attachments.
 * Uses JSON + base64 for compatibility with DigitalOcean Functions (no multipart).
 * Backend creates Jira Bug and returns issue key.
 */
export async function submitSupportTicket(
  payload: SupportTicketPayload,
  attachments: {
    screenshots?: File[];
    screenRecording?: File;
    harFile?: File;
  },
  consentGiven: boolean
): Promise<SupportTicketResponse> {
  if (!consentGiven) {
    return { success: false, error: "You must agree to share diagnostic information." };
  }

  const technicalInfo = collectTechnicalInfo();
  const technicalText = formatTechnicalInfoForTicket(technicalInfo);
  const errorsText = formatCapturedErrorsForTicket();

  const ticketData = {
    ...payload,
    technicalInfo,
    technicalInfoText: technicalText,
    capturedErrorsText: errorsText,
    timestamp: new Date().toISOString(),
  };

  const body: Record<string, unknown> = {
    payload: ticketData,
    screenshots: [],
    screenRecording: null,
    harFile: null,
  };

  if (attachments.screenshots?.length) {
    for (const f of attachments.screenshots) {
      if (f.size > MAX_IMAGE_SIZE) {
        return { success: false, error: `Screenshot ${f.name} exceeds 5MB limit.` };
      }
      body.screenshots!.push(await fileToBase64(f));
    }
  }
  if (attachments.screenRecording) {
    if (attachments.screenRecording.size > MAX_VIDEO_SIZE) {
      return { success: false, error: "Screen recording exceeds 25MB limit." };
    }
    body.screenRecording = await fileToBase64(attachments.screenRecording);
  }
  if (attachments.harFile) {
    if (attachments.harFile.size > MAX_HAR_SIZE) {
      return { success: false, error: "HAR file exceeds 10MB limit." };
    }
    body.harFile = await fileToBase64(attachments.harFile);
  }

  const url = API_URLS.supportProxy;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      error: data.error || `Request failed: ${res.status}`,
    };
  }

  return {
    success: data.success ?? true,
    issueKey: data.issueKey,
    error: data.error,
  };
}
