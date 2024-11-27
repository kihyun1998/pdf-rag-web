import React, { useState } from "react";
import Chat from "./Chat";

function App() {
  const [activeTab, setActiveTab] = useState("langchain"); // 기본값은 langchain

  const tabs = [
    { id: "langchain", title: "LangChain Chat", endpoint: "/chat" },
    { id: "google", title: "Google Chat", endpoint: "/chat-google" },
    { id: "gpt", title: "Chat GPT", endpoint: "/chat-gpt" },
    { id: "gemini", title: "Chat Gemini", endpoint: "/chat-gemini" },
    // { id: "korean", title: "Korean Chat", endpoint: "/chat-korean" },
  ];

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Tab Bar */}
      <div className="flex bg-gray-800 text-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === tab.id ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="flex-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`h-full ${activeTab === tab.id ? "block" : "hidden"}`}
          >
            <Chat endpoint={tab.endpoint} title={tab.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
