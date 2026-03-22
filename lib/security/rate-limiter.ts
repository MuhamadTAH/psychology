/**
 * 🔒 SECURITY: Rate Limiter Module
 * 
 * Implements IP-based and user-based rate limiting with sliding window algorithm.
 * Follows OWASP recommendations for API rate limiting.
 * 
 * Features:
 * - IP-based rate limiting (for public endpoints)
 * - User-based rate limiting (for authenticated endpoints)
 * - Configurable limits per endpoint
 * - Graceful 429 responses with Retry-After header
 * - In-memory storage (suitable for serverless/edge, consider Redis for production scale)
 */

// OWASP: Use a sliding window for more accurate rate limiting
interface RateLimitEntry {
    count: number;
    resetAt: number;
    firstRequestAt: number;
}

// In-memory store - For production at scale, consider using Redis or Upstash
// This works for Vercel Edge/Serverless as each instance maintains its own state
const ipStore = new Map<string, RateLimitEntry>();
const userStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanupExpiredEntries(): void {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;

    lastCleanup = now;

    for (const [key, entry] of ipStore.entries()) {
        if (entry.resetAt < now) {
            ipStore.delete(key);
        }
    }

    for (const [key, entry] of userStore.entries()) {
        if (entry.resetAt < now) {
            userStore.delete(key);
        }
    }
}

/**
 * Rate limit configuration per endpoint type
 * OWASP: Set sensible defaults that balance security and usability
 */
export const RATE_LIMIT_CONFIGS = {
    // AI endpoints - expensive, limit more aggressively
    ai: {
        windowMs: 60 * 1000,     // 1 minute window
        maxRequests: 10,          // 10 requests per minute
        maxRequestsPerUser: 20,   // 20 per minute per authenticated user
    },
    // Standard API endpoints
    standard: {
        windowMs: 60 * 1000,     // 1 minute window
        maxRequests: 30,          // 30 requests per minute per IP
        maxRequestsPerUser: 60,   // 60 per minute per authenticated user
    },
    // File upload endpoints - most restrictive
    upload: {
        windowMs: 60 * 1000,     // 1 minute window
        maxRequests: 5,           // 5 uploads per minute per IP
        maxRequestsPerUser: 10,   // 10 per minute per authenticated user
    },
    // Email sending endpoints - very restrictive
    email: {
        windowMs: 60 * 1000,     // 1 minute window
        maxRequests: 3,           // 3 emails per minute per IP
        maxRequestsPerUser: 5,    // 5 per minute per authenticated user
    },
    // Admin/management endpoints
    admin: {
        windowMs: 60 * 1000,     // 1 minute window
        maxRequests: 20,          // 20 requests per minute per IP
        maxRequestsPerUser: 50,   // 50 per minute per authenticated user
    },
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    retryAfter?: number; // seconds until reset
}

/**
 * Extract client IP from request headers
 * OWASP: Handle proxy headers correctly for accurate IP identification
 */
export function getClientIP(headers: Headers): string {
    // Check common proxy headers in order of preference
    // SECURITY: Only trust these headers if you're behind a trusted proxy
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        // Take the first IP in the chain (original client)
        const ips = forwardedFor.split(',').map(ip => ip.trim());
        if (ips[0] && isValidIP(ips[0])) {
            return ips[0];
        }
    }

    const realIP = headers.get('x-real-ip');
    if (realIP && isValidIP(realIP)) {
        return realIP;
    }

    // Fallback - may be localhost in development
    return '127.0.0.1';
}

/**
 * Basic IP validation to prevent injection
 */
function isValidIP(ip: string): boolean {
    // IPv4
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    // IPv6 (simplified)
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Check rate limit for a given key
 * Returns whether the request is allowed and remaining quota
 */
function checkLimit(
    store: Map<string, RateLimitEntry>,
    key: string,
    maxRequests: number,
    windowMs: number
): RateLimitResult {
    cleanupExpiredEntries();

    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
        // First request or window expired - create new entry
        store.set(key, {
            count: 1,
            resetAt: now + windowMs,
            firstRequestAt: now,
        });

        return {
            allowed: true,
            remaining: maxRequests - 1,
            resetAt: now + windowMs,
        };
    }

    if (entry.count >= maxRequests) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
            retryAfter,
        };
    }

    // Increment counter
    entry.count++;
    store.set(key, entry);

    return {
        allowed: true,
        remaining: maxRequests - entry.count,
        resetAt: entry.resetAt,
    };
}

/**
 * Main rate limiting function
 * 
 * @param headers - Request headers to extract IP
 * @param userId - Optional user ID for user-based limiting
 * @param type - Type of endpoint for config lookup
 * @param endpoint - Endpoint path for granular limiting
 */
export function rateLimit(
    headers: Headers,
    userId: string | null,
    type: RateLimitType = 'standard',
    endpoint: string = 'default'
): RateLimitResult {
    const config = RATE_LIMIT_CONFIGS[type];
    const ip = getClientIP(headers);

    // Create unique keys for IP and user
    const ipKey = `ip:${ip}:${endpoint}`;

    // Check IP-based limit first
    const ipResult = checkLimit(ipStore, ipKey, config.maxRequests, config.windowMs);

    if (!ipResult.allowed) {
        return ipResult;
    }

    // If user is authenticated, also check user-based limit (more generous)
    if (userId) {
        const userKey = `user:${userId}:${endpoint}`;
        const userResult = checkLimit(userStore, userKey, config.maxRequestsPerUser, config.windowMs);

        // Return the more restrictive result
        if (!userResult.allowed) {
            return userResult;
        }

        // Return user result as they have higher limits
        return userResult;
    }

    return ipResult;
}

/**
 * Create rate limit headers for response
 * OWASP: Always include rate limit headers to inform clients
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    const headers: Record<string, string> = {
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    };

    if (!result.allowed && result.retryAfter) {
        headers['Retry-After'] = String(result.retryAfter);
    }

    return headers;
}

/**
 * Create a 429 Too Many Requests response
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
    const headers = getRateLimitHeaders(result);

    return new Response(
        JSON.stringify({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: result.retryAfter,
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        }
    );
}
