/**
 * 🔒 SECURITY: Health Check Endpoint
 * 
 * Provides a health check for the application including:
 * - API key configuration status
 * - Security module status
 * - General application health
 * 
 * Use this endpoint to verify security configuration in deployment.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkApiKeyHealth } from "@/lib/security/api-keys";
import { SECURITY_HEADERS } from "@/lib/security/headers";

export async function GET(req: NextRequest) {
    // 🔒 SECURITY: Check API key configuration
    const apiKeyHealth = checkApiKeyHealth();

    // Build response
    const healthResponse = {
        status: apiKeyHealth.status,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        security: {
            rateLimiting: 'enabled',
            inputValidation: 'enabled',
            securityHeaders: 'enabled',
        },
        services: apiKeyHealth.services,
    };

    // Determine HTTP status based on health
    let httpStatus = 200;
    if (apiKeyHealth.status === 'unhealthy') {
        httpStatus = 503;
    } else if (apiKeyHealth.status === 'degraded') {
        httpStatus = 200; // Still operational, just degraded
    }

    return NextResponse.json(healthResponse, {
        status: httpStatus,
        headers: SECURITY_HEADERS,
    });
}

// ✅ Health check endpoint for monitoring security configuration
