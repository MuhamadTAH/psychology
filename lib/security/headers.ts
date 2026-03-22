/**
 * 🔒 SECURITY: HTTP Security Headers
 * 
 * Implements OWASP secure headers recommendations.
 * Apply these headers to all API responses for enhanced security.
 * 
 * Reference: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
 */

/**
 * Security headers to apply to all API responses
 */
export const SECURITY_HEADERS: Record<string, string> = {
    // OWASP: Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // OWASP: Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // OWASP: Enable XSS filter in older browsers
    'X-XSS-Protection': '1; mode=block',

    // OWASP: Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // OWASP: Restrict permissions/features
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',

    // Cache control for API responses - prevent caching of sensitive data
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
};

/**
 * Apply security headers to a Response object
 */
export function withSecurityHeaders(response: Response): Response {
    const newHeaders = new Headers(response.headers);

    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        // Don't override existing headers
        if (!newHeaders.has(key)) {
            newHeaders.set(key, value);
        }
    }

    // Clone response with new headers
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
}

/**
 * Create a JSON response with security headers
 */
export function secureJsonResponse(
    data: unknown,
    options: { status?: number; headers?: Record<string, string> } = {}
): Response {
    const { status = 200, headers = {} } = options;

    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...SECURITY_HEADERS,
            ...headers,
        },
    });
}
