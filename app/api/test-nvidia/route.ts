import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// This is a DEBUG endpoint. Visit http://localhost:3000/api/test-nvidia in your browser.
// It will show you exactly what's happening with the NVIDIA API.

export async function GET() {
    const debugInfo: Record<string, unknown> = {
        step: 'init',
        timestamp: new Date().toISOString(),
    };

    try {
        // Step 1: Check API key
        const apiKey = process.env.NVIDIA_API_KEY;
        debugInfo.step = '1_check_key';
        debugInfo.apiKeyPresent = !!apiKey;
        debugInfo.apiKeyLength = apiKey?.length ?? 0;
        debugInfo.apiKeyPrefix = apiKey?.substring(0, 10) + '...';

        if (!apiKey) {
            debugInfo.error = 'NVIDIA_API_KEY is not set in .env.local';
            return NextResponse.json(debugInfo, { status: 500 });
        }

        // Step 2: Initialize OpenAI client
        debugInfo.step = '2_init_client';
        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://integrate.api.nvidia.com/v1',
        });
        debugInfo.clientCreated = true;

        // Step 3: Make a simple test call
        debugInfo.step = '3_calling_api';
        debugInfo.model = 'meta/llama-3.1-405b-instruct';
        debugInfo.baseURL = 'https://integrate.api.nvidia.com/v1';

        const completion = await openai.chat.completions.create({
            model: 'meta/llama-3.1-405b-instruct',
            messages: [{ role: 'user', content: 'Say "NVIDIA API WORKS" and nothing else.' }],
            temperature: 0.1,
            max_tokens: 50,
            stream: false,
        });

        // Step 4: Check response
        debugInfo.step = '4_got_response';
        debugInfo.responseId = completion.id;
        debugInfo.model_used = completion.model;
        debugInfo.content = completion.choices[0]?.message?.content;
        debugInfo.finish_reason = completion.choices[0]?.finish_reason;
        debugInfo.success = true;

        return NextResponse.json(debugInfo);
    } catch (error: unknown) {
        debugInfo.step = 'ERROR';
        debugInfo.success = false;

        if (error instanceof OpenAI.APIError) {
            debugInfo.errorType = 'OpenAI.APIError';
            debugInfo.status = error.status;
            debugInfo.message = error.message;
            debugInfo.code = error.code;
            debugInfo.type = error.type;
        } else if (error instanceof Error) {
            debugInfo.errorType = 'Error';
            debugInfo.message = error.message;
            debugInfo.stack = error.stack?.split('\n').slice(0, 5);
        } else {
            debugInfo.errorType = 'Unknown';
            debugInfo.raw = String(error);
        }

        return NextResponse.json(debugInfo, { status: 500 });
    }
}
