import { NextRequest, NextResponse } from "next/server";

// OLD QUIZ PROMPT - DISABLED
// const OLD_QUIZ_PROMPT = `...quiz prompt...`;

const SYSTEM_PROMPT = `You are a lesson creator for a Duolingo-style learning app. When the user provides text with multiple paragraphs/sections, create ONE LESSON per paragraph title/topic.

CRITICAL RULES:
1. Identify each paragraph title/topic in the text
2. Create ONE complete lesson for each paragraph with 2 STAGES
3. STAGES: Guided Practice → Active Recall (Quiz)
4. Extract information ONLY from the text (don't make up information)
5. Keep it simple, clear, and engaging
6. OUTPUT MUST BE VALID JSON ONLY - No extra text before or after

OUTPUT FORMAT (JSON):

You must return a JSON array of lesson objects. Each lesson must follow this exact structure:

[
  {
    "number": 1,
    "title": "Lesson title from paragraph topic",
    "practice": [
      {
        "type": "fill-in-blank",
        "sentence": "Sentence with ___ for blank",
        "correctAnswer": "correct word",
        "wrongOptions": ["wrong1", "wrong2", "wrong3"],
        "explanation": "Why this answer is correct"
      },
      {
        "type": "matching",
        "pairs": {
          "Term1": "Definition1",
          "Term2": "Definition2",
          "Term3": "Definition3"
        }
      },
      {
        "type": "sentence-building",
        "question": "Build a sentence using these words",
        "words": ["word1", "word2", "word3", "word4", "word5", "word6"],
        "correctSentence": "word1 word2 word3 word4 word5 word6"
      }
    ],
    "quiz": [
      {
        "type": "multiple-choice",
        "question": "Question text?",
        "options": [
          {"id": "A", "text": "Option A"},
          {"id": "B", "text": "Option B"},
          {"id": "C", "text": "Option C"},
          {"id": "D", "text": "Option D"}
        ],
        "correctAnswer": "B",
        "explanation": "Why this is the correct answer",
        "difficulty": "easy"
      },
      {
        "type": "true-false",
        "question": "True or false question?",
        "correctAnswer": "False",
        "explanation": "Why this is the correct answer",
        "difficulty": "medium"
      }
    ]
  }
]

EXAMPLE OUTPUT:

[
  {
    "number": 1,
    "title": "Propaganda",
    "practice": [
      {
        "type": "fill-in-blank",
        "sentence": "Propaganda is ___ manipulation directed at the masses",
        "correctAnswer": "covert",
        "wrongOptions": ["overt", "honest", "direct"],
        "explanation": "Propaganda works in hidden, covert ways to influence"
      },
      {
        "type": "matching",
        "pairs": {
          "Propaganda": "Covert manipulation",
          "Dialectics": "Presenting choices",
          "Misdirection": "Hiding facts"
        }
      },
      {
        "type": "sentence-building",
        "question": "Arrange these words to describe propaganda",
        "words": ["is", "propaganda", "covert", "manipulation", "that", "influences", "masses"],
        "correctSentence": "propaganda is covert manipulation that influences masses"
      }
    ],
    "quiz": [
      {
        "type": "multiple-choice",
        "question": "What is propaganda?",
        "options": [
          {"id": "A", "text": "Honest communication"},
          {"id": "B", "text": "Covert manipulation"},
          {"id": "C", "text": "Educational tool"},
          {"id": "D", "text": "News reporting"}
        ],
        "correctAnswer": "B",
        "explanation": "Propaganda is covert manipulation targeting the masses",
        "difficulty": "easy"
      },
      {
        "type": "true-false",
        "question": "Propaganda only uses verbal techniques",
        "correctAnswer": "False",
        "explanation": "It also uses non-verbal methods like music and imagery",
        "difficulty": "medium"
      }
    ]
  }
]

QUESTION TYPE DETAILS:

1. "sentence-building": User arranges words to form a correct sentence
   - Include 5-8 words that can form a meaningful sentence
   - Add 1-3 extra wrong words to make it challenging
   - The correctSentence should be grammatically correct
   - Example: Build a sentence about a topic from the lesson

IMPORTANT:
- Return ONLY valid JSON, no markdown code blocks, no extra text
- One lesson per paragraph/topic
- Include at least 3 practice exercises (fill-in-blank, matching, sentence-building), 2 quiz questions per lesson
- For sentence-building: provide words in random order, include some wrong words as distractors
- Difficulty levels: "easy", "medium", or "hard"
- Extract only from provided text`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "OpenAI API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "No response";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}