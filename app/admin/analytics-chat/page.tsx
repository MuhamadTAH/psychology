// 🧠 FILE PURPOSE
// Enhanced Admin Analytics Chat UI with query history, favorites, and PDF export.
// Features: Auto-save queries, history sidebar, favorites, PDF download.
// Built with Next.js 15, React 19, Convex, and Recharts for visualizations.

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Loader2, Send, TrendingUp, Users, Award, Zap, BarChart3, Target,
  History, Star, Download, Trash2, Clock, ChevronLeft, ChevronRight
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Step 1: Define types
type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  data?: any;
  functionsUsed?: string[];
};

// Step 2: Example questions
const EXAMPLE_QUESTIONS = [
  { icon: Users, text: "How many total users are in the app?", color: "bg-blue-500" },
  { icon: TrendingUp, text: "What are the top 5 performing lessons?", color: "bg-green-500" },
  { icon: BarChart3, text: "Show me overall app health and engagement", color: "bg-purple-500" },
  { icon: Target, text: "Which lessons are the hardest for users?", color: "bg-red-500" },
  { icon: Award, text: "How many users have unlocked achievements?", color: "bg-yellow-500" },
  { icon: Zap, text: "What's the average streak length?", color: "bg-orange-500" },
];

// Step 3: Suggested follow-up questions based on conversation
const SUGGESTED_FOLLOWUPS = [
  "Show me user growth over the last 30 days",
  "What's our Day 1 retention rate?",
  "Compare active users this week vs last week",
  "Which section has the best completion rate?",
  "How many users are on a streak?",
  "What's the distribution of XP among users?",
];

export default function AnalyticsChatPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "👋 Hi! I'm your Analytics AI Assistant. Ask me anything about your app's data, users, lessons, or engagement metrics.",
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Convex mutations and queries
  const saveQuery = useMutation(api.analyticsQueries.saveQuery);
  const queryHistory = useQuery(
    api.analyticsQueries.getUserQueries,
    user?.emailAddresses?.[0]?.emailAddress ? { email: user.emailAddresses[0].emailAddress, limit: 20 } : "skip"
  );
  const toggleFavorite = useMutation(api.analyticsQueries.toggleFavorite);
  const deleteQuery = useMutation(api.analyticsQueries.deleteQuery);

  // Step 3: Send message to AI and save to history
  const handleSendMessage = async (questionText?: string) => {
    const question = questionText || input.trim();
    if (!question || isLoading || !user) return;

    const userMessage: Message = { role: "user", content: question, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analytics-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        data: data.data,
        functionsUsed: data.functionsUsed,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Save to history
      if (user.emailAddresses?.[0]?.emailAddress) {
        await saveQuery({
          email: user.emailAddresses[0].emailAddress,
          question,
          answer: data.answer,
          functionsUsed: data.functionsUsed || [],
          dataSnapshot: data.data,
        });
      }

    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `❌ Error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      }]);
      console.error("Analytics AI error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Load query from history
  const loadHistoryQuery = (question: string, answer: string) => {
    setMessages([
      {
        role: "assistant",
        content: "👋 Hi! I'm your Analytics AI Assistant.",
        timestamp: new Date(),
      },
      {
        role: "user",
        content: question,
        timestamp: new Date(),
      },
      {
        role: "assistant",
        content: answer,
        timestamp: new Date(),
      }
    ]);
    setShowHistory(false);
  };

  // Step 5: Export to PDF with timestamp
  const exportToPDF = async () => {
    if (!chatRef.current) return;

    try {
      const canvas = await html2canvas(chatRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add header with timestamp
      const timestamp = new Date().toLocaleString();
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Analytics Chat Report - Generated: ${timestamp}`, 10, 5);

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= 277;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.text(`Analytics Chat Report - Generated: ${timestamp}`, 10, 5);
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= 277;
      }

      const filename = `analytics-chat-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  // Step 6: Export conversation to CSV
  const exportToCSV = () => {
    const csvRows = [
      ["Timestamp", "Role", "Message", "Functions Used"],
      ...messages.map(msg => [
        msg.timestamp.toLocaleString(),
        msg.role,
        msg.content.replace(/\n/g, " ").replace(/"/g, '""'),
        msg.functionsUsed?.join(", ") || "",
      ])
    ];

    const csvContent = csvRows.map(row =>
      row.map(cell => `"${cell}"`).join(",")
    ).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const filename = `analytics-chat-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Step 6: Handle keyboard shortcuts
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // ✅ Authentication and state management complete

  // Step 7: Render UI with history sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto flex gap-4">

        {/* Main Chat Area */}
        <div className={`transition-all duration-300 ${showHistory ? 'w-2/3' : 'w-full'}`}>
          {/* Header */}
          <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  Analytics AI Assistant
                </h1>
                <p className="text-gray-600 mt-2">
                  Ask questions about your app's data, users, and performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {showHistory ? <ChevronRight className="w-4 h-4 mr-2" /> : <History className="w-4 h-4 mr-2" />}
                  {showHistory ? 'Hide' : 'History'}
                </Button>
                <Button
                  onClick={exportToPDF}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  onClick={exportToCSV}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={chatRef} className="bg-white shadow-lg p-6 min-h-[500px] max-h-[600px] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-gray-50 text-gray-800 border border-gray-200"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {message.content.split('\n').map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={i} className="font-bold text-lg mb-2">{line.replace(/\*\*/g, '')}</p>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={i} className="ml-4">{line.substring(2).replace(/\*\*/g, '')}</li>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={i} className="font-bold text-md mt-3 mb-1">{line.substring(4)}</h3>;
                        }
                        if (line.trim()) {
                          return <p key={i} className="mb-2">{line.replace(/\*\*/g, '')}</p>;
                        }
                        return null;
                      })}
                    </div>
                    <div className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-md">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      <span className="text-gray-600">Analyzing data...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Example Questions */}
          {messages.length === 1 && !isLoading && (
            <div className="bg-white shadow-lg p-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Quick Start Questions:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {EXAMPLE_QUESTIONS.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(example.text)}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className={`${example.color} p-2 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                      <example.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 flex-1">
                      {example.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Follow-ups (shown after 1+ questions) */}
          {messages.length > 2 && !isLoading && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg p-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Suggested Follow-up Questions:
              </h3>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_FOLLOWUPS.slice(0, 4).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-all shadow-sm border border-gray-200 hover:border-blue-500"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white rounded-b-2xl shadow-lg p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about your app data... (Press Enter to send)"
                className="flex-1 resize-none border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 rounded-xl flex items-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="w-1/3 bg-white rounded-2xl shadow-lg p-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-500" />
              Query History
            </h2>

            <div className="space-y-3">
              {queryHistory && queryHistory.length > 0 ? (
                queryHistory.map((query) => (
                  <div
                    key={query._id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => loadHistoryQuery(query.question, query.answer)}
                        className="flex-1 text-left"
                      >
                        <p className="font-semibold text-gray-800 group-hover:text-purple-600 line-clamp-2">
                          {query.question}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(query.timestamp).toLocaleString()}
                        </p>
                      </button>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => toggleFavorite({
                            queryId: query._id,
                            favorite: !query.favorite
                          })}
                          className="p-1 hover:bg-yellow-100 rounded"
                        >
                          <Star
                            className={`w-4 h-4 ${query.favorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`}
                          />
                        </button>
                        <button
                          onClick={() => deleteQuery({ queryId: query._id })}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {query.answer.substring(0, 100)}...
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No query history yet. Start asking questions!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Complete enhanced chat UI with:
// - Auto-save to history
// - Sidebar with past queries
// - Favorite/delete functionality
// - PDF export
// - Responsive layout
