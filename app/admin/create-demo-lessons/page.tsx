"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Lesson = {
  number: number;
  title: string;
  practice: any[];
  quiz?: any[];
};

export default function CreateDemoLessonsPage() {
  const saveLessons = useMutation(api.lessons.saveUploadAndLessons);
  const existingLessons = useQuery(api.lessons.getUserLessons, { email: "tarqmhamad9@gmail.com" });
  const [status, setStatus] = useState("Idle...");

  async function generateAndSave() {
    setStatus("Generating demo lessons...");

    // ----------------- LESSON 1: Birthday Party -----------------
    const lesson1: Lesson = {
      number: 1,
      title: "Birthday Party — Match the Sentences",
      practice: [
        {
          type: "matching",
          question: "Match the pictures to what happened during the party.",
          pairs: {
            "/images/party1.png": "It was my birthday party on Saturday. I invited all my friends.",
            "/images/party2.png": "My mother cooked the food.",
            "/images/party3.png": "The party started in the afternoon."
          }
        },
        {
          type: "matching",
          question: "Match the pictures to what happened during the party.",
          pairs: {
            "/images/party4.png": "I opened my presents.",
            "/images/party5.png": "We played party games.",
            "/images/party6.png": "We danced."
          }
        },
        {
          type: "matching",
          question: "Match the pictures to what happened during the party.",
          pairs: {
            "/images/party7.png": "The party finished in the evening.",
            "/images/party3.png": "The party started in the afternoon.",
            "/images/party5.png": "We played party games."
          }
        }
      ],
    };

    // ----------------- LESSON 2: Room Objects -----------------
    const lesson2: Lesson = {
      number: 2,
      title: "Objects in the Room (Image Matching)",
      practice: [
        {
          type: "matching",
          pairs: {
            "/images/room1.jpg": "Window",
            "/images/room2.jpg": "Television",
            "/images/room3.jpg": "Door",
            "/images/room4.jpg": "Radio"
          }
        }
      ]
    };

    // ----------------- LESSON 3: Actions -----------------
    const fillItems = [
      { sentence: "_____ the television", correct: "Turn on" },
      { sentence: "_____ the door", correct: "Open" },
      { sentence: "_____ the window", correct: "Close" },
      { sentence: "_____ the radio", correct: "Turn off" },
    ];

    const distractorPool = ["Turn on", "Turn off", "Open", "Close", "Press", "Start"];

    const fillPractice = fillItems.map(it => {
      const wrongs = distractorPool.filter(w => w !== it.correct).slice(0, 3);
      return {
        type: "fill-in-blank",
        sentence: it.sentence,
        correctAnswer: it.correct,
        wrongOptions: wrongs,
        explanation: `Use "${it.correct}" for this action.`
      };
    });

    const lesson3: Lesson = {
      number: 3,
      title: "Actions — TV / Door / Window / Radio",
      practice: fillPractice
    };

    // ----------------- LESSON 4: Daily Actions -----------------
    const lesson4: Lesson = {
      number: 4,
      title: "Describing Images",
      practice: [
        {
          type: "multiple-choice",
          question: "Describe the image.",
          image: "/images/party1.png",
          options: [
            { id: "A", text: "The TV is on." },
            { id: "B", text: "The TV is off." },
            { id: "C", text: "The TV is flying." },
            { id: "D", text: "The TV is eating food." }
          ],
          correctAnswer: "A",
          explanation: "The TV is on.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "Describe the image.",
          image: "/images/party1.png",
          options: [
            { id: "A", text: "The window is open." },
            { id: "B", text: "The window is closed." },
            { id: "C", text: "The window is broken." },
            { id: "D", text: "The window is moving." }
          ],
          correctAnswer: "A",
          explanation: "The window is open.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "Describe the image.",
          image: "/images/party1.png",
          options: [
            { id: "A", text: "The radio is playing music." },
            { id: "B", text: "The radio is cooking food." },
            { id: "C", text: "The radio is broken." },
            { id: "D", text: "The radio is flying." }
          ],
          correctAnswer: "A",
          explanation: "The radio is playing music.",
          difficulty: "easy"
        },
        {
          type: "sentence-building",
          question: "Arrange the words to make a correct sentence.",
          words: ["She", "is", "watching", "TV", "sleeping", "running"],
          correctSentence: "She is watching TV"
        },
        {
          type: "sentence-building",
          question: "Arrange the words to make a correct sentence.",
          words: ["He", "is", "listening", "to", "music", "eating", "walking"],
          correctSentence: "He is listening to music"
        },
      ],
    };
  

    // ----------------- Combine and Save -----------------
    const DEMO_LESSONS: Lesson[] = [lesson1, lesson2, lesson3, lesson4];

    await saveLessons({
      userText: "Demo Lessons (Enhanced)",
      gptRawResponse: JSON.stringify(DEMO_LESSONS),
      lessons: DEMO_LESSONS,
      email: "tarqmhamad9@gmail.com"
    });

    setStatus("✅ Lessons saved successfully!");
  }

  return (
    <div className="min-h-screen bg-[#1F2937] p-8 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Demo Lessons — Advanced</h1>
          <Button
            onClick={generateAndSave}
            className="bg-[#58CC02] hover:bg-[#46A302] text-black"
          >
            Save All Lessons
          </Button>
        </header>

        <div className="bg-[#1a2332] p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300">Status:</p>
          <p className="text-white mt-1">{status}</p>
        </div>

        <section className="bg-[#1a2332] p-4 rounded-lg border border-gray-700">
          <h2 className="text-lg font-semibold">Existing Lessons:</h2>
          <div className="mt-3 space-y-3">
            {!existingLessons && <div className="text-gray-300">Loading...</div>}
            {existingLessons && existingLessons.length === 0 && (
              <div className="text-gray-300">No lessons found.</div>
            )}
            {existingLessons &&
              existingLessons.map((lesson: any, i: number) => (
                <div key={lesson._id ?? i} className="p-2 bg-gray-900 rounded">
                  <div className="font-medium">
                    Lesson {lesson.number || lesson.lessonNumber}: {lesson.title}
                  </div>
                  <div className="text-sm text-gray-400">
                    Practice: {lesson.practice?.length ?? 0}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
