/**
 * 🧠 FILE PURPOSE
 * AI Analytics Assistant API endpoint.
 * Receives questions from the user, determines which analytics functions to call,
 * fetches data from Convex, and uses OpenAI to generate insightful answers.
 * 
 * 🔒 SECURITY FEATURES:
 * - Rate limiting (AI endpoint - 10 req/min per IP, 20 per authenticated user)
 * - Schema-based input validation
 * - Secure API key handling
 * - OWASP-compliant security headers
 */

import { NextRequest, NextResponse } from "next/server";
import { DATABASE_SCHEMA, SYSTEM_PROMPT } from "@/utils-lib/ai-schema";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import {
  rateLimit,
  createRateLimitResponse,
  getRateLimitHeaders,
  parseAndValidateBody,
  ANALYTICS_AI_SCHEMA,
  getApiKey,
  createApiKeyErrorResponse,
} from "@/lib/security";
import { SECURITY_HEADERS } from "@/lib/security/headers";

// 🔒 SECURITY: Type for validated request body
interface AnalyticsAIRequest {
  question: string;
}

// Step 1: Define the main POST handler
// This endpoint receives a question from the user and returns an AI-generated answer
export async function POST(req: NextRequest) {
  try {
    // 🔒 SECURITY: Get user ID for rate limiting (if authenticated)
    let userId: string | null = null;
    try {
      const { userId: authUserId } = await auth();
      userId = authUserId;
    } catch {
      // Not authenticated - will use IP-based rate limiting only
    }

    // 🔒 SECURITY: Apply rate limiting (AI endpoints are more restrictive)
    const rateLimitResult = rateLimit(req.headers, userId, 'ai', '/api/analytics-ai');

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult);
    }

    // 🔒 SECURITY: Validate and sanitize input
    const parseResult = await parseAndValidateBody<AnalyticsAIRequest>(
      req,
      ANALYTICS_AI_SCHEMA
    );

    if (!parseResult.success) {
      return parseResult.response;
    }

    const { question } = parseResult.data;

    // 🔒 SECURITY: Check if OpenAI API key is configured (never expose details)
    const apiKey = getApiKey('OPENAI_API_KEY');
    if (!apiKey) {
      return createApiKeyErrorResponse('OPENAI_API_KEY');
    }

    // Step 2: Determine which analytics functions to call based on the question
    // We'll use GPT to analyze the question and decide what data to fetch
    const planningResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Cheaper model for planning
        messages: [
          {
            role: "system",
            content: `${DATABASE_SCHEMA}

Based on the user's question, determine which analytics functions to call.
Return a JSON array of function names to call (no arguments needed - functions handle that).

Available functions:
- getTotalUsers
- getActiveUsers
- getEngagementOverview
- getLessonStats (requires lessonId)
- getAllDarkPsychLessonStats
- getTopLessons
- getStrugglingLessons
- getLessonCompletionBySection
- getStreakStats
- getResourceDistribution
- getLeagueStats
- getStudyFeatureStats
- getAchievementStats
- getPowerUpStats
- getAppHealthDashboard

Return format:
{
  "functions": ["functionName1", "functionName2"],
  "lessonId": "A1-1" // only if getLessonStats is needed
}

Examples:
Q: "How many active users?"
A: {"functions": ["getActiveUsers"]}

Q: "Show me app health"
A: {"functions": ["getAppHealthDashboard"]}

Q: "What are the hardest lessons?"
A: {"functions": ["getStrugglingLessons"]}

Q: "Tell me about lesson A1-1"
A: {"functions": ["getLessonStats"], "lessonId": "A1-1"}
`
          },
          {
            role: "user",
            content: question
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!planningResponse.ok) {
      // 🔒 SECURITY: Don't expose OpenAI error details in production
      console.error(`OpenAI planning error: ${planningResponse.statusText}`);
      throw new Error("Failed to process question - AI service error");
    }

    const planningData = await planningResponse.json();
    const plan = JSON.parse(planningData.choices[0].message.content);

    // 🔒 SECURITY: Validate plan has expected structure
    if (!plan.functions || !Array.isArray(plan.functions)) {
      throw new Error("Invalid AI response format");
    }

    // 🔒 SECURITY: Whitelist of allowed functions to prevent injection
    const ALLOWED_FUNCTIONS = new Set([
      'getTotalUsers', 'getActiveUsers', 'getEngagementOverview',
      'getLessonStats', 'getAllDarkPsychLessonStats', 'getTopLessons',
      'getStrugglingLessons', 'getLessonCompletionBySection', 'getStreakStats',
      'getResourceDistribution', 'getLeagueStats', 'getStudyFeatureStats',
      'getAchievementStats', 'getPowerUpStats', 'getAppHealthDashboard',
      'getUserGrowthOverTime', 'getRetentionMetrics', 'getEngagementOverTime'
    ]);

    // Step 3: Execute the planned queries on Convex
    const results: Record<string, unknown> = {};

    for (const functionName of plan.functions) {
      // 🔒 SECURITY: Only execute whitelisted functions
      if (!ALLOWED_FUNCTIONS.has(functionName)) {
        console.warn(`[SECURITY] Blocked non-whitelisted function: ${functionName}`);
        continue;
      }

      try {
        let data;

        switch (functionName) {
          case "getTotalUsers":
            data = await fetchQuery(api.analytics.getTotalUsers);
            break;
          case "getActiveUsers":
            data = await fetchQuery(api.analytics.getActiveUsers, { days: 7 });
            break;
          case "getEngagementOverview":
            data = await fetchQuery(api.analytics.getEngagementOverview);
            break;
          case "getLessonStats":
            if (plan.lessonId && typeof plan.lessonId === 'string') {
              // 🔒 SECURITY: Validate lessonId format
              if (/^[A-D]\d+-\d+$/.test(plan.lessonId)) {
                data = await fetchQuery(api.analytics.getLessonStats, { lessonId: plan.lessonId });
              }
            }
            break;
          case "getAllDarkPsychLessonStats":
            data = await fetchQuery(api.analytics.getAllDarkPsychLessonStats);
            break;
          case "getTopLessons":
            data = await fetchQuery(api.analytics.getTopLessons, { limit: 10 });
            break;
          case "getStrugglingLessons":
            data = await fetchQuery(api.analytics.getStrugglingLessons, { limit: 10 });
            break;
          case "getLessonCompletionBySection":
            data = await fetchQuery(api.analytics.getLessonCompletionBySection);
            break;
          case "getStreakStats":
            data = await fetchQuery(api.analytics.getStreakStats);
            break;
          case "getResourceDistribution":
            data = await fetchQuery(api.analytics.getResourceDistribution);
            break;
          case "getLeagueStats":
            data = await fetchQuery(api.analytics.getLeagueStats);
            break;
          case "getStudyFeatureStats":
            data = await fetchQuery(api.analytics.getStudyFeatureStats);
            break;
          case "getAchievementStats":
            data = await fetchQuery(api.analytics.getAchievementStats);
            break;
          case "getPowerUpStats":
            data = await fetchQuery(api.analytics.getPowerUpStats);
            break;
          case "getAppHealthDashboard":
            data = await fetchQuery(api.analytics.getAppHealthDashboard);
            break;
          case "getUserGrowthOverTime":
            data = await fetchQuery(api.analytics.getUserGrowthOverTime, { days: plan.days || 30 });
            break;
          case "getRetentionMetrics":
            data = await fetchQuery(api.analytics.getRetentionMetrics);
            break;
          case "getEngagementOverTime":
            data = await fetchQuery(api.analytics.getEngagementOverTime, { days: plan.days || 30 });
            break;
          default:
            console.warn(`Unknown function: ${functionName}`);
        }

        if (data !== undefined) {
          results[functionName] = data;
        }
      } catch (error) {
        console.error(`Error fetching ${functionName}:`, error);
        results[functionName] = { error: "Failed to fetch data" };
      }
    }

    // Step 4: Use GPT to analyze the data and generate a human-readable answer
    const analysisResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Better model for analysis
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: `User Question: ${question}

Data Retrieved:
${JSON.stringify(results, null, 2)}

Provide a clear, insightful answer with:
1. Key metrics highlighted in **bold**
2. Supporting numbers and percentages
3. Actionable insights or recommendations
4. Markdown formatting for readability

Be concise but thorough.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!analysisResponse.ok) {
      console.error(`OpenAI analysis error: ${analysisResponse.statusText}`);
      throw new Error("Failed to analyze data - AI service error");
    }

    const analysisData = await analysisResponse.json();
    const answer = analysisData.choices[0].message.content;

    // Step 5: Return the answer along with raw data
    // 🔒 SECURITY: Include rate limit headers in response
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    return NextResponse.json(
      {
        success: true,
        question,
        answer,
        data: results, // Include raw data for debugging or charts
        functionsUsed: plan.functions.filter((f: string) => ALLOWED_FUNCTIONS.has(f)),
      },
      {
        headers: {
          ...SECURITY_HEADERS,
          ...rateLimitHeaders,
        },
      }
    );

  } catch (error: unknown) {
    // 🔒 SECURITY: Don't expose internal error details
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Analytics AI error:", errorMessage);

    return NextResponse.json(
      {
        error: "Failed to process question",
        message: process.env.NODE_ENV === 'development' ? errorMessage : "An error occurred"
      },
      {
        status: 500,
        headers: SECURITY_HEADERS,
      }
    );
  }
}

// ✅ In this section we achieved:
// Complete AI analytics API with security hardening:
// 1. Rate limiting (IP + user-based)
// 2. Schema-based input validation
// 3. Whitelisted function execution
// 4. Secure API key handling
// 5. OWASP-compliant security headers

// Step 6: Optional GET handler for health check
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      message: "Analytics AI API is running",
      endpoint: "/api/analytics-ai",
      method: "POST",
      requiredBody: {
        question: "string - Your analytics question (max 1000 chars)"
      },
      examples: [
        "How many users are active?",
        "What are the top performing lessons?",
        "Show me engagement stats",
        "Which lessons are hardest?",
        "How many users completed Section B?",
      ]
    },
    {
      headers: SECURITY_HEADERS,
    }
  );
}

// ✅ Complete API endpoint ready with full security!
