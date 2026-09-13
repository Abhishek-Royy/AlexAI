import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

const MODES = ["chat", "search", "pdf", "ppt", "coding", "imgGen", "auto select"];

function ChatArea() {
  const [activeMode, setActiveMode] = useState("chat");
  const [input, setInput] = useState("");

  // TODO: replace with real messages from redux/api
  const messages = [
    { id: 1, role: "assistant", text: "Hi! How can I help you today?" },
    { id: 2, role: "user", text: "Can you help me build a chat UI?" },
    { id: 3, role: "assistant", text: "Sure — here's a layout to start with." },
    { id: 4, role: "user", text: "Looks great, thanks!" },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    // TODO: dispatch send message
    setInput("");
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-900">
      <div className="border-b border-slate-800 px-4 py-3 text-center text-gray-200 font-medium">
        current chat
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md px-4 py-2.5 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-800 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="flex gap-2 mb-3 flex-wrap">
          {MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                activeMode === mode
                  ? "bg-white text-slate-900 border-white"
                  : "border-slate-700 text-gray-300 hover:bg-slate-800"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Input Area"
            className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-gray-500"
          />
          <button onClick={handleSend}>
            <FiSend size={18} className="text-gray-300 hover:text-white transition" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;