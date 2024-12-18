import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, RefreshCw } from "lucide-react";

const Chat = ({ endpoint, title }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleEmbed = async () => {
    setIsEmbedding(true);
    try {
      // 각 채팅에 맞는 임베딩 엔드포인트 선택
      // const embedEndpoint =
      //   title === "LangChain Chat"
      //     ? "/pdf/embed/langchain-google"
      //     : "/pdf/embed/google";
      let embedEndpoint;
      switch (title) {
        case "LangChain Chat":
          embedEndpoint = "/pdf/embed/langchain-google";
          break;
        case "Google Chat":
          embedEndpoint = "/pdf/embed/google";
          break;
        case "Chat GPT":
          embedEndpoint = "/pdf/embed/gpt";
          break;
        case "Chat GPT V1":
          embedEndpoint = "/pdf/embed/gpt/v1";
          break;
        case "Chat Gemini":
          embedEndpoint = "/pdf/embed/gemini";
          break;

        case "Chat Gemini V1":
          embedEndpoint = "/pdf/embed/gemini/v1";
          break;
        default:
          embedEndpoint = "/pdf/embed/google";
          break;
      }

      await axios.post(embedEndpoint);

      const systemMessage = {
        text: "PDF embedding completed successfully.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, systemMessage]);
    } catch (error) {
      console.error("Error embedding PDF:", error);
      const errorMessage = {
        text: "Sorry, there was an error during PDF embedding.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsEmbedding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(endpoint, { message: input });
      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        text: "Sorry, there was an error processing your message.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* 헤더에 임베딩 버튼 추가 */}
      <div className="bg-gray-800 py-4 px-6 flex-none flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={handleEmbed}
          disabled={isEmbedding}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-600"
        >
          <RefreshCw
            size={20}
            className={`${isEmbedding ? "animate-spin" : ""}`}
          />
          {isEmbedding ? "Embedding..." : "Embed PDF"}
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  message.sender === "user" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <div className="font-bold mb-1">
                  {message.sender === "user" ? "You" : title}
                </div>
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="flex-none border-t border-gray-700 p-4 bg-gray-900">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600"
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
