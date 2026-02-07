/**
 * Technical Info Capture
 * Auto-capture browser, OS, device, screen, network info for support tickets.
 * Collected silently when user opens support flow.
 */

export interface TechnicalInfo {
  browser: string;
  browserVersion: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet";
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  currentPageUrl: string;
  timestamp: string;
  userAgent: string;
  networkType?: string;
  connectionEffectiveType?: string;
}

/**
 * Parse user agent for browser/OS (simplified, works for major browsers)
 */
function parseUserAgent(ua: string): { browser: string; browserVersion: string; os: string } {
  let browser = "Unknown";
  let browserVersion = "";
  let os = "Unknown";

  // Browser
  if (ua.includes("Edg/")) {
    browser = "Edge";
    const m = ua.match(/Edg\/(\d+)/);
    browserVersion = m ? m[1] : "";
  } else if (ua.includes("Chrome/") && !ua.includes("Chromium")) {
    browser = "Chrome";
    const m = ua.match(/Chrome\/(\d+)/);
    browserVersion = m ? m[1] : "";
  } else if (ua.includes("Firefox/")) {
    browser = "Firefox";
    const m = ua.match(/Firefox\/(\d+)/);
    browserVersion = m ? m[1] : "";
  } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    browser = "Safari";
    const m = ua.match(/Version\/(\d+)/);
    browserVersion = m ? m[1] : "";
  } else if (ua.includes("Opera") || ua.includes("OPR/")) {
    browser = "Opera";
    const m = ua.match(/(?:OPR|Opera)\/(\d+)/);
    browserVersion = m ? m[1] : "";
  }

  // OS
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS") || ua.includes("Macintosh")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return { browser, browserVersion, os };
}

/**
 * Detect device type from user agent and screen
 */
function getDeviceType(ua: string, width: number): "desktop" | "mobile" | "tablet" {
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (ua.includes("iPad") || (isMobileUA && width >= 768)) return "tablet";
  if (isMobileUA || width < 768) return "mobile";
  return "desktop";
}

/**
 * Collect all technical info. Safe to call from main thread.
 */
export function collectTechnicalInfo(): TechnicalInfo {
  const ua = navigator.userAgent;
  const parsed = parseUserAgent(ua);

  let networkType: string | undefined;
  let connectionEffectiveType: string | undefined;

  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string; type?: string };
    mozConnection?: { effectiveType?: string };
    webkitConnection?: { effectiveType?: string };
  };
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  if (conn) {
    connectionEffectiveType = conn.effectiveType;
    networkType = conn.type;
  }

  return {
    browser: parsed.browser,
    browserVersion: parsed.browserVersion,
    os: parsed.os,
    deviceType: getDeviceType(ua, window.innerWidth),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    currentPageUrl: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: ua,
    networkType,
    connectionEffectiveType,
  };
}

/**
 * Format technical info as readable text for ticket description
 */
export function formatTechnicalInfoForTicket(info: TechnicalInfo): string {
  const lines = [
    "--- Environment Details ---",
    `Browser: ${info.browser} ${info.browserVersion}`,
    `OS: ${info.os}`,
    `Device: ${info.deviceType}`,
    `Screen: ${info.screenWidth}x${info.screenHeight}`,
    `Viewport: ${info.viewportWidth}x${info.viewportHeight}`,
    `URL: ${info.currentPageUrl}`,
    `Timestamp: ${info.timestamp}`,
  ];
  if (info.connectionEffectiveType) {
    lines.push(`Network: ${info.connectionEffectiveType}`);
  }
  return lines.join("\n");
}
