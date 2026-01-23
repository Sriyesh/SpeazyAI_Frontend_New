# Frontend Migration Guide

This guide helps you update your frontend code to use DigitalOcean Functions instead of Netlify Functions.

## Quick Start

1. **Update Environment Variables** (`.env` file):
   ```env
   VITE_API_PROVIDER=digitalocean
   VITE_SPEECH_PROXY_URL=https://your-speech-proxy-function-url
   VITE_CHATGPT_PROXY_URL=https://your-chatgpt-proxy-function-url
   VITE_AUTH_PROXY_URL=https://your-auth-proxy-function-url
   VITE_PDF_PROXY_URL=https://your-pdf-proxy-function-url
   VITE_PDF_EXTRACT_PROXY_URL=https://your-pdf-extract-proxy-function-url
   ```

2. **Use the new API config** in your components:
   ```typescript
   import { API_URLS, getSpeechProxyUrl } from '@/config/apiConfig';
   
   // Instead of: '/.netlify/functions/speechProxy'
   // Use: API_URLS.speechProxy
   
   // For speech proxy with endpoint:
   const url = getSpeechProxyUrl('https://apis.languageconfidence.ai/...');
   ```

## Files That Need Updates

The following files currently use Netlify functions and should be updated:

### High Priority (Core Functionality)

1. **`src/contexts/AuthContext.tsx`** (Line 318)
   - Current: `'/.netlify/functions/authProxy'`
   - Update to: `API_URLS.authProxy`

2. **`src/utils/pdfTextExtractor.ts`** (Lines 140, 213)
   - Current: `/.netlify/functions/pdfProxy` and `/.netlify/functions/pdfExtractProxy`
   - Update to: `API_URLS.pdfProxy` and `API_URLS.pdfExtractProxy`

### Audio Recorders

3. **`src/components/audioRecorder.tsx`** (Line 205)
4. **`src/components/speaking/SpeakingAudioRecorder.tsx`** (Line 205)
5. **`src/components/reading/ReadingAudioRecorder.tsx`** (Line 205)
6. **`src/components/ielts/IELTSAudioRecorder.tsx`** (Line 229)
   - Current: `/.netlify/functions/speechProxy`
   - Update to: Use `getSpeechProxyUrl(endpoint)` helper

### Assessment Results

7. **`src/components/SpeechAssessmentResults.tsx`** (Lines 78, 133, 307)
8. **`src/components/SpeakingAssessmentResults.tsx`** (Lines 76, 131, 307)
9. **`src/components/ReadingAssessmentResults.tsx`** (Lines 76, 132, 314)
   - Current: `/.netlify/functions/chatgptProxy` and `/.netlify/functions/speechProxy`
   - Update to: `API_URLS.chatgptProxy` and `API_URLS.speechProxy`

### IELTS Components

10. **`src/components/ielts/IELTSSpeakingTaskView.tsx`** (Lines 445, 698)
11. **`src/components/ielts/IELTSWritingTaskView.tsx`** (Lines 304, 366)
    - Current: `/.netlify/functions/speechProxy` and `/.netlify/functions/chatgptProxy`
    - Update to: `API_URLS.speechProxy` and `API_URLS.chatgptProxy`

### Other Components

12. **`src/components/modules/ListeningModulesPage.tsx`** (Line 350)
13. **`src/components/writing-practice/WritingPracticeQuestion.tsx`** (Line 234)
14. **`src/components/SpeechChatPage.tsx`** (Line 199)
    - Current: `/.netlify/functions/chatgptProxy`
    - Update to: `API_URLS.chatgptProxy`

## Migration Pattern

### Pattern 1: Simple Function Call

**Before:**
```typescript
const proxyUrl = isLocal 
  ? "http://localhost:4001/chatgptProxy" 
  : "/.netlify/functions/chatgptProxy";
```

**After:**
```typescript
import { API_URLS } from '@/config/apiConfig';

const proxyUrl = API_URLS.chatgptProxy;
```

### Pattern 2: Speech Proxy with Endpoint

**Before:**
```typescript
const netlifyProxyUrl = '/.netlify/functions/speechProxy?endpoint=https://apis.languageconfidence.ai/...';
```

**After:**
```typescript
import { getSpeechProxyUrl } from '@/config/apiConfig';

const proxyUrl = getSpeechProxyUrl('https://apis.languageconfidence.ai/...');
```

### Pattern 3: Conditional with Local Check

**Before:**
```typescript
const proxyUrl = isLocal 
  ? "http://localhost:4000/speechProxy" 
  : "/.netlify/functions/speechProxy";
```

**After:**
```typescript
import { API_URLS } from '@/config/apiConfig';

// The config already handles local vs production
const proxyUrl = API_URLS.speechProxy;
```

## Step-by-Step Migration

1. **Deploy all 5 functions** to DigitalOcean (see DEPLOYMENT_GUIDE.md)

2. **Create `.env` file** with your function URLs:
   ```env
   VITE_API_PROVIDER=digitalocean
   VITE_SPEECH_PROXY_URL=https://faas-blr1-xxxxx.doserverless.co/api/v1/web/namespace/speech-proxy
   VITE_CHATGPT_PROXY_URL=https://faas-blr1-xxxxx.doserverless.co/api/v1/web/namespace/chatgpt-proxy
   VITE_AUTH_PROXY_URL=https://faas-blr1-xxxxx.doserverless.co/api/v1/web/namespace/auth-proxy
   VITE_PDF_PROXY_URL=https://faas-blr1-xxxxx.doserverless.co/api/v1/web/namespace/pdf-proxy
   VITE_PDF_EXTRACT_PROXY_URL=https://faas-blr1-xxxxx.doserverless.co/api/v1/web/namespace/pdf-extract-proxy
   ```

3. **Update each file** listed above, replacing Netlify function URLs with `API_URLS.*` or `getSpeechProxyUrl()`

4. **Test locally**:
   ```bash
   npm run dev
   ```
   - Test authentication
   - Test speech recording
   - Test PDF processing
   - Test ChatGPT interactions

5. **Build and deploy**:
   ```bash
   npm run build
   ```

## Testing Checklist

After migration, test these features:

- [ ] User login/authentication
- [ ] Speech recording and assessment
- [ ] ChatGPT chat functionality
- [ ] PDF viewing and text extraction
- [ ] IELTS speaking tasks
- [ ] IELTS writing assessment
- [ ] Reading assessment
- [ ] Writing practice questions

## Rollback Plan

If you need to rollback to Netlify:

1. Set `VITE_API_PROVIDER=netlify` in `.env`
2. Or temporarily revert code changes
3. The config file supports both providers

## Notes

- The `apiConfig.ts` file handles environment switching automatically
- Local development will use local proxy servers if `VITE_API_PROVIDER=local`
- Production will use DigitalOcean Functions if `VITE_API_PROVIDER=digitalocean`
- All URLs are centralized in one config file for easy management
