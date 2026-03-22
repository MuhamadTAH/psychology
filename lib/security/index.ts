/**
 * 🔒 SECURITY: Main Security Module Export
 * 
 * Central export for all security utilities.
 * Import from this file for consistency across the codebase.
 */

// Rate limiting
export {
    rateLimit,
    getClientIP,
    getRateLimitHeaders,
    createRateLimitResponse,
    RATE_LIMIT_CONFIGS,
    type RateLimitType,
    type RateLimitResult,
} from './rate-limiter';

// Input validation
export {
    validateInput,
    parseAndValidateBody,
    sanitizeString,
    sanitizePath,
    createValidationErrorResponse,
    // Schemas
    ANALYTICS_AI_SCHEMA,
    CHAT_SCHEMA,
    SEND_COUPON_SCHEMA,
    DELETE_LESSON_SCHEMA,
    EDIT_LESSON_SCHEMA,
    ADD_LESSON_SCHEMA,
    COMMON_SCHEMAS,
    type ValidationSchema,
    type FieldSchema,
    type ValidationResult,
} from './input-validator';

// Security headers utility
export { withSecurityHeaders, SECURITY_HEADERS } from './headers';

// API key validation
export { validateApiKeyConfig, checkApiKeyHealth, getApiKey, createApiKeyErrorResponse } from './api-keys';
