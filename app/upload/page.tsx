"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, Send, Check, Lock } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UploadPage() {
  const router = useRouter();

  // 🚫 UPLOAD PAGE IS DISABLED
  // Redirect users to dark psychology dashboard instead
  useEffect(() => {
    router.push("/dark-psychology-dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f1419] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Upload Disabled</h1>
        <p className="text-gray-400 mb-6">
          The upload feature is currently disabled. You can start learning with the pre-loaded lessons.
        </p>
        <Button
          onClick={() => router.push("/dark-psychology-dashboard")}
          className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold px-8 py-6"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

function UploadPageDisabled() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isLesson1Completed, setIsLesson1Completed] = useState(false);

  // Chat states
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Convex mutation
  const saveUploadAndLessons = useMutation(api.lessons.saveUploadAndLessons);

  // Check if lesson 1 is completed
  useEffect(() => {
    const completed = localStorage.getItem('lesson1Completed') === 'true';
    setIsLesson1Completed(completed);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/pdf-extract", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);

      // If extraction successful, send text to GPT
      if (data.status === "success" && data.text && data.text.length > 0) {
        // Combine all text from pages
        const extractedText = data.text.map((t: any) => t.content).join("\n\n");

        // Add user message showing the extracted text
        const userMessage = { role: "user", content: extractedText };
        setMessages((prev) => [...prev, userMessage]);

        // Send to GPT
        setChatLoading(true);
        try {
          const chatRes = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: extractedText }),
          });

          const chatData = await chatRes.json();

          if (chatData.error) {
            alert(`GPT Error: ${chatData.error}`);
          } else {
            const assistantMessage = { role: "assistant", content: chatData.reply };
            setMessages((prev) => [...prev, assistantMessage]);

            // Check if response contains JSON lessons and save them
            const lessonsData = parseLessonsFromGPT(chatData.reply);
            if (lessonsData && lessonsData.length > 0) {
              try {
                const userEmail = localStorage.getItem('userEmail') || undefined;
                await saveUploadAndLessons({
                  userText: extractedText,
                  gptRawResponse: chatData.reply,
                  lessons: lessonsData,
                  email: userEmail,
                });
                alert(`Lessons saved successfully! Created ${lessonsData.length} lessons. Go to Learn page to start.`);
              } catch (error) {
                alert("Error saving lessons to database");
              }
            } else {
              alert("Failed to parse lessons from GPT response");
            }
          }
        } catch (chatErr) {
          alert("Error sending text to GPT");
        } finally {
          setChatLoading(false);
        }
      }
    } catch (err) {
      alert("Error extracting PDF");
    } finally {
      setLoading(false);
    }
  };

  const parseLessonsFromGPT = (text: string) => {
    try {
      // Try to extract JSON from response (GPT might wrap it in markdown code blocks)
      let jsonText = text.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Try to find JSON array in the text
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      // Step: Clean common JSON errors from GPT output
      // GPT sometimes generates JSON with trailing commas and missing braces
      jsonText = jsonText
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
        .replace(/,(\s*\n\s*[}\]])/g, '$1')  // Remove trailing commas before newline
        .replace(/"definition":\s*"([^"]*)"\s*\n/g, '"definition": "$1"}\n')  // Add missing } after definition
        .replace(/}\s*\n\s*]/g, '}\n        ]');  // Ensure proper closing

      // Try to parse JSON with better error handling
      let lessons;
      try {
        lessons = JSON.parse(jsonText);
      } catch (firstError) {
        // If first parse fails, try more aggressive fixes
        // Try to fix common patterns
        jsonText = jsonText
          .replace(/"\s*\n\s*}/g, '"}')  // Fix missing closing quote
          .replace(/},\s*]/g, '}]')  // Remove trailing comma before ]
          .replace(/],\s*}/g, ']}');  // Remove trailing comma before }

        try {
          lessons = JSON.parse(jsonText);
        } catch (secondError) {
          throw secondError;
        }
      }

      // Validate that it's an array
      if (!Array.isArray(lessons)) {
        return [];
      }
      return lessons;
    } catch (error) {
      return [];
    }
  };

  const parseQuizFromGPT = (text: string) => {
    try {
      // Check if this contains a matching question
      if (/\[MATCH\]/i.test(text)) {
        return parseMatchingFromText(text);
      }

      // Split by lines
      const lines = text.split('\n').filter(line => line.trim() !== '');

      const questions = [];
      let currentQuestion = '';
      let currentOptions: Array<string> = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if this is an option line (starts with a-, b-, c-, d-)
        if (/^[a-d][\-\)\.]\s*/i.test(line)) {
          currentOptions.push(line);
        } else if (currentOptions.length > 0 && currentQuestion) {
          // We have a complete question, parse it
          const parsedQuestion = parseQuestion(currentQuestion, currentOptions);
          if (parsedQuestion) {
            questions.push(parsedQuestion);
          }
          // Start new question
          currentQuestion = line;
          currentOptions = [];
        } else {
          // This is a question line
          currentQuestion = line.replace(/^\d+\.\s*/, '').trim();
        }
      }

      // Parse the last question
      if (currentQuestion && currentOptions.length > 0) {
        const parsedQuestion = parseQuestion(currentQuestion, currentOptions);
        if (parsedQuestion) {
          questions.push(parsedQuestion);
        }
      }

      return questions;
    } catch (error) {
      return [];
    }
  };

  const parseMatchingFromText = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    // Find question line (has [MATCH])
    const questionLine = lines.find(l => /\[MATCH\]/i.test(l));
    const question = questionLine ? questionLine.replace(/\[MATCH\]/i, '').trim() : '';

    // Find column A items (lines starting with numbers)
    const columnA = lines
      .filter(l => /^\d+\.\s+/.test(l))
      .map(l => {
        const match = l.match(/^(\d+)\.\s+(.+)/);
        return match ? { id: match[1], text: match[2].trim() } : null;
      })
      .filter(Boolean);

    // Find column B items (lines starting with letters)
    const columnB = lines
      .filter(l => /^[a-d]\)\s+/i.test(l))
      .map((l, index) => {
        const match = l.match(/^[a-d]\)\s+(.+)/i);
        return match ? { id: String.fromCharCode(97 + index), text: match[1].trim() } : null;
      })
      .filter(Boolean);

    // Find PAIRS line
    const pairsLine = lines.find(l => /PAIRS:/i.test(l));
    const correctPairs: { [key: string]: string } = {};
    if (pairsLine) {
      const matches = pairsLine.match(/(\d+)-([a-d])/gi);
      if (matches) {
        matches.forEach(pair => {
          const [num, letter] = pair.split('-');
          correctPairs[num] = letter.toLowerCase();
        });
      }
    }

    return [{
      type: 'matching',
      question,
      columnA,
      columnB,
      correctPairs
    }];
  };

  const parseQuestion = (questionText: string, optionLines: Array<string>) => {
    // Check if this is a matching question
    if (/\[MATCH\]/i.test(questionText)) {
      return parseMatchingQuestion(questionText, optionLines);
    }

    // Regular multiple choice / true-false
    let correctAnswer = "A"; // default

    const options = optionLines.map((line, index) => {
      const id = String.fromCharCode(65 + index); // A, B, C, D

      // Check if this line has [CORRECT] tag
      const hasCorrectTag = /\[CORRECT\]/i.test(line);
      if (hasCorrectTag) {
        correctAnswer = id;
      }

      // Remove the option prefix (a-, b-, etc.) and [CORRECT] tag
      const text = line
        .replace(/^[a-d][\-\)\.]\s*/i, '')
        .replace(/\[CORRECT\]/gi, '')
        .trim();

      return {
        id,
        text
      };
    });

    return {
      type: 'multiple-choice',
      question: questionText,
      options,
      correctAnswer
    };
  };

  const parseMatchingQuestion = (fullText: string, allLines: Array<string>) => {
    const question = fullText.replace(/\[MATCH\]/i, '').trim();

    // Find the section with column A (numbers)
    const columnALines = allLines.filter(line => /^\d+\.\s+/.test(line.trim()));
    const columnA = columnALines.map(line => {
      const match = line.match(/^(\d+)\.\s+(.+)/);
      return {
        id: match ? match[1] : '',
        text: match ? match[2].trim() : ''
      };
    });

    // Find the section with column B (letters)
    const columnBLines = allLines.filter(line => /^[a-d]\)\s+/i.test(line.trim()));
    const columnB = columnBLines.map((line, index) => {
      const match = line.match(/^[a-d]\)\s+(.+)/i);
      return {
        id: String.fromCharCode(97 + index), // a, b, c, d
        text: match ? match[1].trim() : ''
      };
    });

    // Find the PAIRS line
    const pairsLine = allLines.find(line => /PAIRS:/i.test(line));
    const pairs: { [key: string]: string } = {};
    if (pairsLine) {
      const pairsText = pairsLine.replace(/PAIRS:/i, '').trim();
      const pairMatches = pairsText.match(/(\d+)-([a-d])/gi);
      if (pairMatches) {
        pairMatches.forEach(pair => {
          const [num, letter] = pair.split('-');
          pairs[num] = letter;
        });
      }
    }

    return {
      type: 'matching',
      question,
      columnA,
      columnB,
      correctPairs: pairs
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await res.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        const assistantMessage = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, assistantMessage]);

        // Check if response contains JSON lessons
        const lessonsData = parseLessonsFromGPT(data.reply);
        if (lessonsData && lessonsData.length > 0) {
          // Save lessons to Convex
          try {
             + "...",
              lessonCount: lessonsData.length
            });
            const userEmail = localStorage.getItem('userEmail') || undefined;
            const result = await saveUploadAndLessons({
              userText: inputMessage,
              gptRawResponse: data.reply,
              lessons: lessonsData,
              email: userEmail,
            });
            alert(`Lessons saved successfully! Created ${lessonsData.length} lessons.`);
            // Navigate to learn page
            router.push('/learn');
          } catch (error: any) {
            alert(`Error saving lessons: ${error.message || error}`);
          }
        } else {
          // If no lessons, it might be a regular chat response
        }
      }
    } catch (err) {
      alert("Error sending message");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-col items-center gap-y-4 max-w-lg w-full">
            <h1 className="text-center font-bold text-neutral-800 text-2xl">
              Upload PDF Document
            </h1>
            <p className="text-muted-foreground text-center text-lg mb-6">
              Upload a PDF file to extract text and images.
            </p>

            {/* File Upload Section */}
            <div className="w-full space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-blue-50 rounded-full">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Choose a PDF file to upload
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF files up to 10MB are supported
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="pdf-upload"
                    disabled={loading}
                  />

                  <label htmlFor="pdf-upload">
                    <Button
                      variant="secondary"
                      className="cursor-pointer"
                      disabled={loading}
                      asChild
                    >
                      <span>
                        <FileText className="h-4 w-4 mr-2" />
                        Select PDF File
                      </span>
                    </Button>
                  </label>

                  {file && (
                    <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              {file && (
                <div className="space-y-4">
                  <Button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Extract PDF
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Results Section */}
            {result && result.status === "success" && (
              <div className="w-full mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Extraction Complete!
                    </h3>
                    <div className="space-y-2 text-sm text-green-700">
                      <p>✅ Extracted {result.text?.length || 0} text blocks</p>
                      <p>✅ Extracted {result.images?.length || 0} images</p>
                    </div>
                  </div>
                </div>

                {/* Text Preview */}
                {result.text && result.text.length > 0 && (
                  <div className="mt-4 p-4 bg-white rounded border max-h-60 overflow-y-auto">
                    <h4 className="font-medium text-gray-800 mb-2">Extracted Text:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      {result.text.map((t: any, i: number) => (
                        <p key={i} className="border-l-2 border-gray-200 pl-3">
                          <b className="text-gray-700">Page {t.page}:</b> {t.content}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images Preview */}
                {result.images && result.images.length > 0 && (
                  <div className="mt-4 p-4 bg-white rounded border">
                    <h4 className="font-medium text-gray-800 mb-2">Extracted Images:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {result.images.map((img: any, i: number) => (
                        <div key={i} className="border rounded p-2">
                          <p className="text-xs text-gray-500 mb-2">Page {img.page}</p>
                          <img
                            src={`data:image/png;base64,${img.image}`}
                            alt={`Page ${img.page}`}
                            className="w-full rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {result && result.status === "error" && (
              <div className="w-full mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error
                </h3>
                <p className="text-red-700">{result.error}</p>
              </div>
            )}

            {/* Lesson Circle */}
            <div className="w-full mt-8">
              <div className="flex justify-center">
                <button
                  onClick={() => router.push('/lesson')}
                  className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 relative"
                >
                  {isLesson1Completed ? (
                    <Check className="h-10 w-10 text-white" />
                  ) : (
                    <span className="text-white text-2xl font-bold">1</span>
                  )}
                </button>
              </div>
            </div>

            {/* Chat Section */}
            <div className="w-full mt-8">
              <div className="border border-gray-300 rounded-lg bg-white shadow-sm">
                <div className="border-b border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Chat with GPT</h3>
                  <p className="text-sm text-gray-500">Ask me anything!</p>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20">
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={chatLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={chatLoading || !inputMessage.trim()}
                      size="lg"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
