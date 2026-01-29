// API Configuration for DigitalOcean Functions
// Update these URLs after deploying your functions to DigitalOcean

const isLocal = import.meta.env.DEV || window.location.hostname === 'localhost';

// DigitalOcean Function URLs
const DIGITALOCEAN_FUNCTIONS = {
  speechProxy: import.meta.env.VITE_SPEECH_PROXY_URL || 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/speechProxy',
  chatgptProxy: import.meta.env.VITE_CHATGPT_PROXY_URL || 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/chatgptProxy',
  authProxy: import.meta.env.VITE_AUTH_PROXY_URL || 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/authProxy',
  pdfProxy: import.meta.env.VITE_PDF_PROXY_URL || 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/pdfProxy',
  pdfExtractProxy: import.meta.env.VITE_PDF_EXTRACT_PROXY_URL || 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/pdfExtractProxy',
};

// Local development proxy URLs (if running proxy servers locally)
const LOCAL_PROXIES = {
  speechProxy: 'http://localhost:4000/speechProxy',
  chatgptProxy: 'http://localhost:4001/chatgptProxy',
  authProxy: 'http://localhost:4001/authProxy',
  pdfProxy: 'http://localhost:4001/pdfProxy',
  pdfExtractProxy: 'http://localhost:4001/pdfExtractProxy',
};

// Netlify function URLs (legacy - remove after migration)
const NETLIFY_FUNCTIONS = {
  speechProxy: '/.netlify/functions/speechProxy',
  chatgptProxy: '/.netlify/functions/chatgptProxy',
  authProxy: '/.netlify/functions/authProxy',
  pdfProxy: '/.netlify/functions/pdfProxy',
  pdfExtractProxy: '/.netlify/functions/pdfExtractProxy',
};

// Choose which API provider to use
// Set to 'digitalocean', 'local', or 'netlify'
// Defaults to 'local' when running on localhost, 'digitalocean' otherwise
const API_PROVIDER = (import.meta.env.VITE_API_PROVIDER || (isLocal ? 'local' : 'digitalocean')) as 'digitalocean' | 'local' | 'netlify';

// Get the appropriate URL based on provider and environment
function getApiUrl(functionName: keyof typeof DIGITALOCEAN_FUNCTIONS): string {
  if (isLocal && API_PROVIDER === 'local') {
    return LOCAL_PROXIES[functionName];
  }
  
  switch (API_PROVIDER) {
    case 'digitalocean':
      return DIGITALOCEAN_FUNCTIONS[functionName];
    case 'local':
      return LOCAL_PROXIES[functionName];
    case 'netlify':
      return NETLIFY_FUNCTIONS[functionName];
    default:
      return DIGITALOCEAN_FUNCTIONS[functionName];
  }
}

// Export API URLs
export const API_URLS = {
  speechProxy: getApiUrl('speechProxy'),
  chatgptProxy: getApiUrl('chatgptProxy'),
  authProxy: getApiUrl('authProxy'),
  pdfProxy: getApiUrl('pdfProxy'),
  pdfExtractProxy: getApiUrl('pdfExtractProxy'),
};

// Helper function to build speech proxy URL with endpoint query param
export function getSpeechProxyUrl(endpoint?: string): string {
  const baseUrl = API_URLS.speechProxy;
  if (endpoint && API_PROVIDER === 'digitalocean') {
    // For DigitalOcean, add endpoint as query parameter
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}endpoint=${encodeURIComponent(endpoint)}`;
  }
  if (endpoint && API_PROVIDER === 'netlify') {
    // For Netlify, add endpoint as query parameter
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}endpoint=${encodeURIComponent(endpoint)}`;
  }
  return baseUrl;
}

// Export provider info for debugging
export const API_CONFIG = {
  provider: API_PROVIDER,
  isLocal,
  urls: API_URLS,
};

// Base URL for direct Exelerate API calls (org, users, reading, ielts, etc.).
// Always use the full API host, same as: curl --location 'https://api.exeleratetechnology.com/api/...' --header 'Authorization: Bearer <token>'
export const getExelerateApiBase = (): string => {
  return 'https://api.exeleratetechnology.com';
};
