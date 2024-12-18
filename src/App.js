import React, { useState } from "react";
import Chat from "./Chat";
import { ChevronDown } from "lucide-react";

const App = () => {
  const [activeChat, setActiveChat] = useState("langchain");
  const [isOpen, setIsOpen] = useState(false);

  const chats = [
    { id: "langchain", title: "LangChain Chat", endpoint: "/chat" },
    { id: "google", title: "Google Chat", endpoint: "/chat-google" },
    { id: "gpt", title: "Chat GPT", endpoint: "/chat-gpt" },
    { id: "gptv1", title: "Chat GPT V1", endpoint: "/chat-gpt-v1" },
    { id: "gemini", title: "Chat Gemini", endpoint: "/chat-gemini" },
  ];

  const activeOption = chats.find((chat) => chat.id === activeChat);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {/* Dropdown Container */}
      <div className="bg-gray-800 p-4">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <span>{activeOption?.title}</span>
            <ChevronDown
              className={`transform transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              size={20}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 rounded-lg overflow-hidden shadow-lg z-10">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-white hover:bg-gray-600 transition-colors ${
                    activeChat === chat.id ? "bg-blue-600" : ""
                  }`}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`h-full ${activeChat === chat.id ? "block" : "hidden"}`}
          >
            <Chat endpoint={chat.endpoint} title={chat.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
