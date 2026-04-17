import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Sparkles, User } from "lucide-react"; // Optional: npm install lucide-react
import Layout from "./Layout";

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuestion(""); // Clear input early for better UX

    try {
      const res = await axios.post("http://localhost:5000/api/ai/ask", {
        question,
      });

      const aiMessage = {
        role: "ai",
        text: res.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "I'm having trouble connecting right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="flex flex-col h-[calc(100vh-150px)] max-w-4xl mx-auto w-full transition-colors duration-300">
      
      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <Sparkles size={48} className="text-blue-500" />
            <h2 className="text-2xl font-semibold dark:text-white">How can I help you today?</h2>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-4 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            } animate-in fade-in slide-in-from-bottom-2`}
          >
            {/* Avatar Circle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === "user" 
                ? "bg-blue-600 text-white" 
                : "bg-gradient-to-tr from-blue-400 to-purple-500 text-white"
            }`}>
              {msg.role === "user" ? <User size={16} /> : <Sparkles size={16} />}
            </div>

            {/* Message Content */}
            <div className={`max-w-[85%] px-1 py-1 rounded-lg ${
              msg.role === "user" 
                ? "bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl" 
                : "text-gray-800 dark:text-gray-200"
            }`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 items-center animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Sparkles size={16} className="text-gray-400" />
            </div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded shadow-sm"></div>
          </div>
        )}
      </div>

      {/* Input Area (Gemini Style Floating Bar) */}
      <div className="p-4 bg-transparent">
        <div className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && askAI()}
            placeholder="Enter a prompt here..."
            className="w-full pl-6 pr-14 py-4 bg-gray-200/50 dark:bg-gray-800 border-none rounded-full focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm hover:shadow-md transition-shadow outline-none"
          />
          <button
            onClick={askAI}
            disabled={loading || !question.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full transition-all"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-3 text-gray-400">
          AI Assistant can make mistakes. Check important info.
        </p>
      </div>
    </div>
    </Layout>
  );
};

export default AIChat;