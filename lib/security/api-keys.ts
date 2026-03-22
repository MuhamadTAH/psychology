/**
 * 🔒 SECURITY: API Key Management
 * 
 * Utilities for secure API key handling following OWASP best practices:
 * - Never expose keys client-side
 * - Validate key configuration at startup
 * - Provide health check utilities
 * - Support key rotation
 * 
 * IMPORTANT: All API keys must be stored in environment variables.
 * Never commit keys to source control.
 */

/**
 * Required API keys configuration
 * List all API keys that should be configured in the environment
 */
export const REQUIRED_API_KEYS = {
    // OpenAI API key for AI features
    OPENAI_API_KEY: {
        name: 'OpenAI API Key',
        envVar: 'OPENAI_API_KEY',
        required: false, // Set to true if AI features are critical
        pattern: /^sk-[A-Za-z0-9-_]{20,}$/, // OpenAI key pattern
    },
    // Resend API key for email
    RESEND_API_KEY: {
        name: 'Resend API Key',
        envVar: 'RESEND_API_KEY',
        required: false, // Set to true if email is critical
        pattern: /^re_[A-Za-z0-9]{20,}$/, // Resend key pattern
    },
    // Convex deployment URL
    CONVEX_DEPLOYMENT: {
        name: 'Convex Deployment',
        envVar: 'CONVEX_DEPLOYMENT',
        required: true,
        pattern: /^.+$/, // Any non-empty string
    },
    // Clerk keys
    CLERK_SECRET_KEY: {
        name: 'Clerk Secret Key',
        envVar: 'CLERK_SECRET_KEY',
        required: true,
        pattern: /^sk_[A-Za-z0-9_-]+$/, // Clerk secret key pattern
    },
} as const;

export type ApiKeyName = keyof typeof REQUIRED_API_KEYS;

export interface ApiKeyStatus {
    name: string;
    configured: boolean;
    valid: boolean;
    error?: string;
}

/**
 * Validate that all required API keys are configured
 * Call this during app initialization or health checks
 */
export function validateApiKeyConfig(): {
    valid: boolean;
    keys: Record<string, ApiKeyStatus>;
    errors: string[];
} {
    const result: {
        valid: boolean;
        keys: Record<string, ApiKeyStatus>;
        errors: string[];
    } = {
        valid: true,
        keys: {},
        errors: [],
    };

    for (const [key, config] of Object.entries(REQUIRED_API_KEYS)) {
        const value = process.env[config.envVar];
        const status: ApiKeyStatus = {
            name: config.name,
            configured: !!value,
            valid: false,
        };

        if (!value) {
            if (config.required) {
                result.valid = false;
                status.error = `Required API key not configured: ${config.name}`;
                result.errors.push(status.error);
            } else {
                status.error = `Optional API key not configured: ${config.name}`;
            }
        } else {
            // Validate key format
            if (config.pattern.test(value)) {
                status.valid = true;
            } else {
                status.error = `API key has invalid format: ${config.name}`;
                if (config.required) {
                    result.valid = false;
                    result.errors.push(status.error);
                }
            }
        }

        result.keys[key] = status;
    }

    return result;
}

/**
 * Get a specific API key safely
 * Returns null if not configured (instead of undefined)
 * 
 * SECURITY: This function should only be called server-side
 */
export function getApiKey(keyName: ApiKeyName): string | null {
    const config = REQUIRED_API_KEYS[keyName];
    const value = process.env[config.envVar];

    if (!value) {
        return null;
    }

    // Validate format before returning
    if (!config.pattern.test(value)) {
        console.error(`[SECURITY] API key ${config.name} has invalid format`);
        return null;
    }

    return value;
}

/**
 * Check if a specific API key is configured and valid
 */
export function isApiKeyConfigured(keyName: ApiKeyName): boolean {
    return getApiKey(keyName) !== null;
}

/**
 * Health check for API key configuration
 * Use in /api/health or similar endpoints (sanitized output)
 */
export function checkApiKeyHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, 'available' | 'unavailable'>;
} {
    const result = validateApiKeyConfig();

    // Map to safe output (never expose actual keys or detailed errors)
    const services: Record<string, 'available' | 'unavailable'> = {};

    for (const [key, status] of Object.entries(result.keys)) {
        services[key] = status.configured && status.valid ? 'available' : 'unavailable';
    }

    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (!result.valid) {
        overallStatus = 'unhealthy';
    } else {
        // Check if any optional services are missing
        const hasUnavailable = Object.values(services).some(s => s === 'unavailable');
        if (hasUnavailable) {
            overallStatus = 'degraded';
        }
    }

    return { status: overallStatus, services };
}

/**
 * Mask an API key for logging (show first/last few chars only)
 * SECURITY: Never log full API keys
 */
export function maskApiKey(key: string): string {
    if (key.length < 12) {
        return '***';
    }
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

/**
 * Create error response for missing API key
 * SECURITY: Don't expose which specific key is missing in production
 */
export function createApiKeyErrorResponse(
    keyName: ApiKeyName,
    isDevelopment: boolean = process.env.NODE_ENV === 'development'
): Response {
    const config = REQUIRED_API_KEYS[keyName];

    const publicMessage = 'Service temporarily unavailable';
    const devMessage = `API key not configured: ${config.name}. Please add ${config.envVar} to your .env.local file.`;

    return new Response(
        JSON.stringify({
            error: 'Service Unavailable',
            message: isDevelopment ? devMessage : publicMessage,
        }),
        {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
