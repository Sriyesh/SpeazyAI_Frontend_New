"use client";

/**
 * Support Chatbot - Chat-style "Need Support" flow
 * Opens from Mello Assistant "Need Support?" button.
 * Desktop: right drawer | Mobile: full-screen bottom sheet
 * Uses a simple portal modal with chat bubbles instead of step-by-step.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useIsMobile } from "./ui/use-mobile";
import {
  ISSUE_TYPES,
  type IssueType,
  type SupportTicketPayload,
  submitSupportTicket,
} from "../utils/supportApi";
import { collectTechnicalInfo } from "../utils/technicalInfo";
import {
  Video,
  Upload,
  FileJson,
  CheckCircle2,
  Loader2,
  ImagePlus,
} from "lucide-react";

const STEPS = ["issue", "context", "attachments", "consent", "submit"] as const;
type Step = (typeof STEPS)[number];

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  step?: Step;
}

interface SupportChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
}

const HAR_INSTRUCTIONS = [
  "Open DevTools (F12 or Right-click → Inspect)",
  "Go to the Network tab",
  "Enable 'Preserve log'",
  "Reproduce the issue",
  "Right-click in the network list → Save all as HAR with content",
  "Upload the .har file below",
];

const bubbleBot = {
  alignSelf: "flex-start" as const,
  maxWidth: "85%",
  padding: "10px 14px",
  borderRadius: "16px 16px 16px 4px",
  backgroundColor: "#f1f5f9",
  color: "#1e293b",
  fontSize: 14,
  lineHeight: 1.45,
};
const bubbleUser = {
  alignSelf: "flex-end" as const,
  maxWidth: "85%",
  padding: "10px 14px",
  borderRadius: "16px 16px 4px 16px",
  backgroundColor: "#1E3A8A",
  color: "#fff",
  fontSize: 14,
  lineHeight: 1.45,
};

export function SupportChatbot({ open, onOpenChange, userEmail }: SupportChatbotProps) {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<Step>("issue");
  const [issueType, setIssueType] = useState<IssueType | "">("");
  const [pageUrl, setPageUrl] = useState("");
  const [whatTryingToDo, setWhatTryingToDo] = useState("");
  const [whatActuallyHappened, setWhatActuallyHappened] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [screenRecording, setScreenRecording] = useState<File | null>(null);
  const [harFile, setHarFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [issueKey, setIssueKey] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const initPageUrl = useCallback(() => {
    if (!pageUrl && typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, [pageUrl]);

  const handleOpen = (o: boolean) => {
    if (o) {
      setMessages([
        {
          id: "0",
          role: "bot",
          text: "What best describes your issue?",
          step: "issue",
        },
      ]);
      setStep("issue");
      setIssueType("");
      setPageUrl("");
      setWhatTryingToDo("");
      setWhatActuallyHappened("");
      setErrorMessage("");
      setScreenshots([]);
      setScreenRecording(null);
      setHarFile(null);
      setConsent(false);
      setIssueKey(null);
      setSubmitError(null);
      initPageUrl();
    }
    onOpenChange(o);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  const canProceedFromContext =
    pageUrl.trim() !== "" &&
    whatTryingToDo.trim() !== "" &&
    whatActuallyHappened.trim() !== "";

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const valid = Array.from(files).filter(
        (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
      );
      setScreenshots((prev) => [...prev, ...valid].slice(0, 5));
    }
    e.target.value = "";
  };

  const handleStartScreenRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      const chunks: BlobPart[] = [];
      mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setScreenRecording(new File([blob], "screen-recording.webm", { type: "video/webm" }));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
    } catch (err) {
      console.error("Screen record failed:", err);
      setSubmitError("Screen recording is not supported or was denied.");
    }
  };

  const handleStopScreenRecord = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  const isRecording = mediaRecorderRef.current?.state === "recording";

  const onSelectIssue = (t: IssueType) => {
    if (issueType) return;
    setIssueType(t);
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length), role: "user", text: t },
      {
        id: String(prev.length + 1),
        role: "bot",
        text: "Thanks. To help us fix this, please share the page URL, what you were trying to do, and what actually happened.",
        step: "context",
      },
    ]);
    setStep("context");
  };

  const onContextNext = () => {
    if (!canProceedFromContext) return;
    const summary = `Page: ${pageUrl}\nTrying: ${whatTryingToDo}\nHappened: ${whatActuallyHappened}${errorMessage ? `\nError: ${errorMessage}` : ""}`;
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length), role: "user", text: summary },
      {
        id: String(prev.length + 1),
        role: "bot",
        text: "You can add screenshots or a screen recording to help us (optional). When ready, continue below.",
        step: "attachments",
      },
    ]);
    setStep("attachments");
  };

  const onAttachmentsNext = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: String(prev.length),
        role: "bot",
        text: "Please confirm: we'll include your issue details, browser info, and any attachments in a support ticket. Check the box and submit.",
        step: "consent",
      },
    ]);
    setStep("consent");
  };

  const handleSubmit = async () => {
    if (!consent || !issueType) return;
    setSubmitting(true);
    setSubmitError(null);
    const techInfo = collectTechnicalInfo();
    const transcript = [
      `Issue Type: ${issueType}`,
      `Page: ${pageUrl}`,
      `Trying to do: ${whatTryingToDo}`,
      `What happened: ${whatActuallyHappened}`,
      errorMessage ? `Error: ${errorMessage}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const payload: SupportTicketPayload = {
      issueType: issueType as IssueType,
      pageUrl,
      whatTryingToDo,
      whatActuallyHappened,
      errorMessage,
      userEmail: userEmail || undefined,
      chatTranscript: transcript,
    };

    const result = await submitSupportTicket(
      payload,
      {
        screenshots: screenshots.length ? screenshots : undefined,
        screenRecording: screenRecording || undefined,
        harFile: harFile || undefined,
      },
      consent
    );

    setSubmitting(false);
    if (result.success && result.issueKey) {
      setIssueKey(result.issueKey);
      setMessages((prev) => [
        ...prev,
        {
          id: String(prev.length),
          role: "bot",
          text: `Ticket created: ${result.issueKey}. We've received your request and will follow up soon.`,
        },
      ]);
    } else {
      setSubmitError(result.error || "Failed to create ticket.");
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    display: "flex",
    justifyContent: isMobile ? "center" : "flex-end",
    alignItems: isMobile ? "flex-end" : "stretch",
  };
  const backdropStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    cursor: "pointer",
  };
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "relative",
        zIndex: 10001,
        width: "100%",
        maxWidth: "100%",
        maxHeight: "90vh",
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
        borderRadius: "16px 16px 0 0",
        overflow: "hidden",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }
    : {
        position: "relative",
        zIndex: 10001,
        width: "100%",
        maxWidth: 360,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
        borderLeft: "1px solid #e5e7eb",
        borderRadius: "12px 0 0 12px",
        overflow: "hidden",
      };

  const modalContent = open ? (
    <div
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-title"
    >
      <div
        style={backdropStyle}
        onClick={() => handleOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && handleOpen(false)}
      />
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            flexShrink: 0,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "#1E3A8A",
            color: "#fff",
            padding: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <h2 id="support-title" style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#fff" }}>
              Need Support?
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              style={{ color: "#fff", flexShrink: 0 }}
              onClick={() => handleOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            backgroundColor: "#ffffff",
            color: "#1e293b",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={msg.role === "bot" ? bubbleBot : bubbleUser}
            >
              {msg.text.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < msg.text.split("\n").length - 1 ? <br /> : null}
                </span>
              ))}
            </div>
          ))}

          {/* Inline step: Issue type choices */}
          {step === "issue" && (
            <div style={{ ...bubbleBot, display: "flex", flexDirection: "column", gap: 8 }}>
              {ISSUE_TYPES.map((t) => (
                <Button
                  key={t}
                  variant={issueType === t ? "default" : "outline"}
                  style={{
                    justifyContent: "flex-start",
                    height: "auto",
                    paddingTop: 10,
                    paddingBottom: 10,
                    color: issueType === t ? "#fff" : "#1e293b",
                    borderColor: "#e2e8f0",
                  }}
                  onClick={() => onSelectIssue(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          )}

          {/* Inline step: Context form */}
          {step === "context" && (
            <div style={{ ...bubbleBot, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <Label style={{ color: "#1e293b", fontSize: 13, fontWeight: 600 }}>Page URL</Label>
                <Input
                  value={pageUrl}
                  onChange={(e) => setPageUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ marginTop: 4, color: "#1e293b", backgroundColor: "#fff", border: "1px solid #e2e8f0" }}
                />
              </div>
              <div>
                <Label style={{ color: "#1e293b", fontSize: 13, fontWeight: 600 }}>What were you trying to do?</Label>
                <Input
                  value={whatTryingToDo}
                  onChange={(e) => setWhatTryingToDo(e.target.value)}
                  placeholder="e.g. Log in to my account"
                  style={{ marginTop: 4, color: "#1e293b", backgroundColor: "#fff", border: "1px solid #e2e8f0" }}
                />
              </div>
              <div>
                <Label style={{ color: "#1e293b", fontSize: 13, fontWeight: 600 }}>What actually happened?</Label>
                <Input
                  value={whatActuallyHappened}
                  onChange={(e) => setWhatActuallyHappened(e.target.value)}
                  placeholder="e.g. Page stayed blank"
                  style={{ marginTop: 4, color: "#1e293b", backgroundColor: "#fff", border: "1px solid #e2e8f0" }}
                />
              </div>
              <div>
                <Label style={{ color: "#1e293b", fontSize: 13, fontWeight: 600 }}>Error message (optional)</Label>
                <Input
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                  placeholder="Optional"
                  style={{ marginTop: 4, color: "#1e293b", backgroundColor: "#fff", border: "1px solid #e2e8f0" }}
                />
              </div>
              <Button
                onClick={onContextNext}
                disabled={!canProceedFromContext}
                style={{ color: "#fff", alignSelf: "flex-end" }}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Inline step: Attachments */}
          {step === "attachments" && (
            <div style={{ ...bubbleBot, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>Screenshots</span>
                <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 8px 0" }}>Up to 5 images (max 5MB each)</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleScreenshotUpload}
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} style={{ color: "#1e293b", borderColor: "#e2e8f0" }}>
                    <ImagePlus className="w-4 h-4 mr-1" /> Gallery
                  </Button>
                </div>
                {screenshots.length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {screenshots.map((f, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#1e293b", backgroundColor: "#e2e8f0", borderRadius: 6, padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        {f.name}
                        <button type="button" style={{ color: "#dc2626" }} onClick={() => setScreenshots((p) => p.filter((_, j) => j !== i))}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {!isMobile && (
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>Screen Recording</span>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 8px 0" }}>Record your tab/window</p>
                  {!screenRecording ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      {!isRecording ? (
                        <Button variant="outline" size="sm" onClick={handleStartScreenRecord} style={{ color: "#1e293b", borderColor: "#e2e8f0" }}>
                          <Video className="w-4 h-4 mr-1" /> Start Recording
                        </Button>
                      ) : (
                        <Button variant="destructive" size="sm" onClick={handleStopScreenRecord} style={{ color: "#fff" }}>
                          Stop Recording
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#16a34a" }}>
                      <CheckCircle2 className="w-4 h-4" /> {screenRecording.name}
                      <Button variant="ghost" size="sm" onClick={() => setScreenRecording(null)} style={{ color: "#1e293b" }}>Remove</Button>
                    </div>
                  )}
                </div>
              )}
              {isMobile && (
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>Video (optional)</span>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 8px 0" }}>Upload a video</p>
                  <input
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    id="video-upload"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f && f.size <= 25 * 1024 * 1024) setScreenRecording(f);
                      e.target.value = "";
                    }}
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("video-upload")?.click()} style={{ color: "#1e293b", borderColor: "#e2e8f0" }}>
                    <Upload className="w-4 h-4 mr-1" /> Upload Video
                  </Button>
                  {screenRecording && <span style={{ marginLeft: 8, fontSize: 14, color: "#16a34a" }}>{screenRecording.name}</span>}
                </div>
              )}
              {!isMobile && (
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>HAR file (optional)</span>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 8px 0" }}>Network log for debugging</p>
                  <ol style={{ listStyle: "decimal", listStylePosition: "inside", fontSize: 11, color: "#64748b", margin: "4px 0 8px 0", paddingLeft: 0 }}>
                    {HAR_INSTRUCTIONS.map((s, i) => (
                      <li key={i} style={{ marginBottom: 2 }}>{s}</li>
                    ))}
                  </ol>
                  <input
                    type="file"
                    accept=".har"
                    style={{ display: "none" }}
                    id="har-upload"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setHarFile(f);
                      e.target.value = "";
                    }}
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("har-upload")?.click()} style={{ color: "#1e293b", borderColor: "#e2e8f0" }}>
                    <FileJson className="w-4 h-4 mr-1" /> Upload HAR
                  </Button>
                  {harFile && <span style={{ marginLeft: 8, fontSize: 14, color: "#16a34a" }}>{harFile.name}</span>}
                </div>
              )}
              <Button onClick={onAttachmentsNext} style={{ color: "#fff", alignSelf: "flex-end" }}>
                Continue
              </Button>
            </div>
          )}

          {/* Inline step: Consent */}
          {step === "consent" && (
            <div style={{ ...bubbleBot, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, color: "#1e293b" }}>
                <strong>Summary</strong>: {issueType} — {pageUrl}
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Checkbox id="consent" checked={consent} onCheckedChange={(c) => setConsent(!!c)} />
                <Label htmlFor="consent" style={{ fontSize: 13, fontWeight: 400, cursor: "pointer", color: "#1e293b" }}>
                  I agree to share diagnostic information to help resolve this issue.
                </Label>
              </div>
              {submitError && <p style={{ fontSize: 13, color: "#dc2626" }}>{submitError}</p>}
              <Button onClick={handleSubmit} disabled={!consent || submitting} style={{ color: "#fff", alignSelf: "flex-end" }}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Ticket
              </Button>
            </div>
          )}

          {/* Success state */}
          {issueKey && (
            <div style={{ ...bubbleBot, border: "1px solid #86efac", backgroundColor: "#f0fdf4" }}>
              <p style={{ fontWeight: 600, color: "#166534", margin: 0 }}>Ticket created: {issueKey}</p>
              <p style={{ fontSize: 13, color: "#15803d", marginTop: 4 }}>We'll follow up soon.</p>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {issueKey && (
          <div
            style={{
              flexShrink: 0,
              borderTop: "1px solid #e5e7eb",
              padding: 16,
              backgroundColor: "#ffffff",
            }}
          >
            <Button type="button" onClick={() => handleOpen(false)} style={{ color: "#fff", width: "100%" }}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  ) : null;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
