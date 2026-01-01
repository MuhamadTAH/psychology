// 🧠 FILE PURPOSE
// AI Analytics Assistant API endpoint.
// Receives questions from the user, determines which analytics functions to call,
// fetches data from Convex, and uses OpenAI to generate insightful answers.
// This is the main orchestration layer between the user, the database, and the LLM.

import { NextRequest, NextResponse } from "next/server";
import { DATABASE_SCHEMA, SYSTEM_PROMPT } from "@/utils-lib/ai-schema";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

// Step 1: Define the main POST handler
// This endpoint receives a question from the user and returns an AI-generated answer
export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured",
          message: "Please add OPENAI_API_KEY to your .env.local file"
        },
        { status: 500 }
      );
    }

    // Step 2: Determine which analytics functions to call based on the question
    // We'll use GPT to analyze the question and decide what data to fetch
    const planningResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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
      throw new Error(`OpenAI planning API error: ${planningResponse.statusText}`);
    }

    const planningData = await planningResponse.json();
    const plan = JSON.parse(planningData.choices[0].message.content);

    // Step 3: Execute the planned queries on Convex
    const results: Record<string, any> = {};

    for (const functionName of plan.functions) {
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
            if (plan.lessonId) {
              data = await fetchQuery(api.analytics.getLessonStats, { lessonId: plan.lessonId });
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
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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
      throw new Error(`OpenAI analysis API error: ${analysisResponse.statusText}`);
    }

    const analysisData = await analysisResponse.json();
    const answer = analysisData.choices[0].message.content;

    // Step 5: Return the answer along with raw data
    return NextResponse.json({
      success: true,
      question,
      answer,
      data: results, // Include raw data for debugging or charts
      functionsUsed: plan.functions,
    });

  } catch (error: any) {
    console.error("Analytics AI error:", error);
    return NextResponse.json(
      {
        error: "Failed to process question",
        message: error.message
      },
      { status: 500 }
    );
  }
}

// ✅ In this section we achieved:
// Complete AI analytics API that:
// 1. Receives questions from users
// 2. Uses AI to determine which data to fetch
// 3. Queries Convex database through analytics functions
// 4. Uses AI to analyze data and generate insights
// 5. Returns formatted, actionable answers

// Step 6: Optional GET handler for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Analytics AI API is running",
    endpoint: "/api/analytics-ai",
    method: "POST",
    requiredBody: {
      question: "string - Your analytics question"
    },
    examples: [
      "How many users are active?",
      "What are the top performing lessons?",
      "Show me engagement stats",
      "Which lessons are hardest?",
      "How many users completed Section B?",
    ]
  });
}

// ✅ Complete API endpoint ready!
