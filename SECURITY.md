# 🔒 DuoLearn Security Documentation

## Overview

This document describes the security measures implemented in the DuoLearn application following OWASP best practices.

## Security Features Implemented

### 1. Rate Limiting (`lib/security/rate-limiter.ts`)

All API endpoints are protected with rate limiting:

| Endpoint Type | IP Limit | User Limit | Window |
|---------------|----------|------------|--------|
| AI (analytics-ai, chat) | 10/min | 20/min | 1 min |
| Standard | 30/min | 60/min | 1 min |
| Upload (pdf-extract) | 5/min | 10/min | 1 min |
| Email (send-coupon) | 3/min | 5/min | 1 min |
| Admin (lesson endpoints) | 20/min | 50/min | 1 min |

**Features:**
- Sliding window algorithm
- IP-based limiting for all requests
- User-based limiting for authenticated users (more generous)
- Graceful 429 responses with `Retry-After` header
- `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers

### 2. Input Validation (`lib/security/input-validator.ts`)

Schema-based validation for all user inputs:

**Validation Types:**
- `string` - with minLength, maxLength, pattern, enum support
- `email` - RFC 5322 compliant validation
- `number` - with min, max, enum support
- `boolean`
- `array` - with item validation
- `object` - with nested property validation
- `uuid`

**Features:**
- Strict mode rejects unexpected fields
- Type checking at runtime
- Length limits on all string inputs
- Pattern validation with regex
- XSS prevention through HTML entity encoding

**Predefined Schemas:**
- `ANALYTICS_AI_SCHEMA` - question field (max 1000 chars)
- `CHAT_SCHEMA` - message field (max 50000 chars)
- `SEND_COUPON_SCHEMA` - email, couponCode, name
- `DELETE_LESSON_SCHEMA` - lessonNumber or lessonId
- `EDIT_LESSON_SCHEMA` - lessonNumber, lessonId, updatedLesson
- `ADD_LESSON_SCHEMA` - flexible lesson structure

### 3. Secure API Key Handling (`lib/security/api-keys.ts`)

**Required Environment Variables:**
- `OPENAI_API_KEY` - OpenAI API key (sk-...)
- `RESEND_API_KEY` - Resend email API key (re_...)
- `CONVEX_DEPLOYMENT` - Convex deployment URL
- `CLERK_SECRET_KEY` - Clerk authentication key (sk_...)

**Features:**
- Pattern validation for API key formats
- Health check endpoint support
- Key masking for logging (shows first/last 4 chars only)
- Graceful 503 responses when keys are missing
- Development vs production error messages

### 4. Security Headers (`lib/security/headers.ts`)

All API responses include OWASP-recommended headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
Pragma: no-cache
Expires: 0
```

### 5. File Upload Security (`app/api/pdf-extract/route.ts`)

**Protections:**
- File type validation (MIME type, extension, magic bytes)
- File size limit (10MB maximum)
- UUID-based filenames (prevents path injection)
- Path traversal prevention
- Immediate cleanup of temp files
- Hardcoded script path (prevents command injection)
- Process timeout (60 seconds)

### 6. Code Execution Prevention

**Removed dangerous patterns:**
- ❌ `eval()` - Replaced with safe JSON.parse
- ❌ Dynamic `require()` - Not used
- ❌ User-controlled file paths - All paths are validated

## Endpoint Security Summary

| Endpoint | Rate Limit | Input Validation | Auth Required |
|----------|------------|------------------|---------------|
| `/api/analytics-ai` | AI (10/min) | ANALYTICS_AI_SCHEMA | Optional |
| `/api/chat` | AI (10/min) | CHAT_SCHEMA | Optional |
| `/api/send-coupon` | Email (3/min) | SEND_COUPON_SCHEMA | Optional |
| `/api/add-dark-psychology-lesson` | Admin (20/min) | ADD_LESSON_SCHEMA | Optional |
| `/api/delete-dark-psychology-lesson` | Admin (20/min) | DELETE_LESSON_SCHEMA | Optional |
| `/api/edit-dark-psychology-lesson` | Admin (20/min) | EDIT_LESSON_SCHEMA | Optional |
| `/api/get-dark-psychology-lessons` | Standard (30/min) | None (GET) | Optional |
| `/api/pdf-extract` | Upload (5/min) | File validation | Optional |

## Environment Setup

Create a `.env.local` file with the following variables:

```env
# Required
CONVEX_DEPLOYMENT=your-convex-deployment
CLERK_SECRET_KEY=sk_your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_your_clerk_publishable_key

# Optional (features won't work without these)
OPENAI_API_KEY=sk-your-openai-api-key
RESEND_API_KEY=re_your-resend-api-key
```

## Development vs Production

In development mode (`NODE_ENV=development`):
- Detailed error messages are shown
- API key configuration hints are provided

In production mode:
- Generic error messages protect implementation details
- No API key hints are exposed

## OWASP Compliance Checklist

- [x] A1: Injection - Input validation, parameterized queries
- [x] A2: Broken Authentication - Clerk authentication integration
- [x] A3: Sensitive Data Exposure - API keys in env vars, not in code
- [x] A4: XML External Entities - No XML processing
- [x] A5: Broken Access Control - Rate limiting, path validation
- [x] A6: Security Misconfiguration - Secure headers, no debug info in production
- [x] A7: Cross-Site Scripting (XSS) - Input sanitization, output encoding
- [x] A8: Insecure Deserialization - Safe JSON parsing, no eval()
- [x] A9: Components with Known Vulnerabilities - Keep dependencies updated
- [x] A10: Insufficient Logging - Console logging with sanitized data

## Maintenance

1. **Rotate API Keys**: Regularly rotate all API keys
2. **Update Dependencies**: Keep all packages up to date
3. **Monitor Rate Limits**: Adjust limits based on usage patterns
4. **Review Logs**: Check for unusual patterns or attacks
5. **Test Security**: Run security scans regularly

## Contact

For security issues, please contact the development team.
