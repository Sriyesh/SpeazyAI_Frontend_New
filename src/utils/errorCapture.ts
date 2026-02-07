/**
 * Error Capture Utilities
 * Global listeners for window.onerror and unhandledrejection.
 * Captures error messages, stack traces, source file, line/column for support tickets.
 */

export interface CapturedError {
  type: "error" | "unhandledrejection";
  message: string;
  stack?: string;
  source?: string;
  line?: number;
  column?: number;
  filename?: string;
  timestamp: string;
  userAgent?: string;
}

const capturedErrors: CapturedError[] = [];
const MAX_ERRORS = 50;

/**
 * Add an error to the capture log (used by global handlers)
 */
export function addCapturedError(error: Omit<CapturedError, "timestamp">): void {
  capturedErrors.push({
    ...error,
    timestamp: new Date().toISOString(),
  });
  if (capturedErrors.length > MAX_ERRORS) {
    capturedErrors.shift();
  }
}

/**
 * Get all captured errors for inclusion in support ticket
 */
export function getCapturedErrors(): CapturedError[] {
  return [...capturedErrors];
}

/**
 * Clear captured errors (e.g. after ticket submission)
 */
export function clearCapturedErrors(): void {
  capturedErrors.length = 0;
}

/**
 * Format captured errors as readable text for ticket description
 */
export function formatCapturedErrorsForTicket(): string {
  if (capturedErrors.length === 0) return "";

  const lines = [
    "\n--- Auto-Captured Frontend Errors ---",
    ...capturedErrors.map((e, i) => {
      const parts = [
        `[${i + 1}] ${e.type.toUpperCase()} @ ${e.timestamp}`,
        `Message: ${e.message}`,
      ];
      if (e.filename) parts.push(`File: ${e.filename}`);
      if (e.line != null) parts.push(`Line: ${e.line}`);
      if (e.column != null) parts.push(`Column: ${e.column}`);
      if (e.stack) parts.push(`Stack: ${e.stack}`);
      return parts.join("\n");
    }),
  ];
  return lines.join("\n\n");
}

/**
 * Install global error handlers. Call once when app mounts.
 * Returns cleanup function to remove listeners.
 */
export function installErrorCapture(): () => void {
  const handleError = (event: ErrorEvent) => {
    addCapturedError({
      type: "error",
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      stack: event.error?.stack,
      userAgent: navigator.userAgent,
    });
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const message =
      event.reason?.message ??
      (typeof event.reason === "string" ? event.reason : String(event.reason));
    const stack = event.reason?.stack;
    addCapturedError({
      type: "unhandledrejection",
      message,
      stack,
      userAgent: navigator.userAgent,
    });
  };

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  return () => {
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  };
}
