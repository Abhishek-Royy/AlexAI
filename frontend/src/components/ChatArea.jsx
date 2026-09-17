import React, { useEffect, useState } from "react";
import { FiMic, FiPaperclip, FiSend } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../apis/getMessages";
import { addMessages, setMessages } from "../redux/messageSlice";
import MessageBubble from "./MessageBubble";
import sendMessage from "../apis/sendMessage";

const MODES = [
  "chat",
  "search",
  "pdf",
  "ppt",
  "coding",
  "imgGen",
  "auto select",
];

function ChatArea() {
  const [activeMode, setActiveMode] = useState("chat");
  const [value, setValue] = useState("");

  // Selected conversation
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  // dispatch
  const dispatch = useDispatch();

  // call the messages
  useEffect(() => {
    const getMsg = async () => {
      if (selectedConversation) {
        try {
          const data = await getMessages(selectedConversation?._id);
          dispatch(setMessages(data));
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      }
    };
    getMsg();
  }, [selectedConversation]);

  const handleSend = async () => {
    const payload = {
      prompt: value.trim(),
      conversationId: selectedConversation?._id,
    };
    dispatch(addMessages({ role: "user", content: value.trim() }));
    setValue("")
    const data = await sendMessage(payload);
    dispatch(addMessages({ role: "assistant", content: data }));
    console.log(data);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 px-4 py-3 text-center text-gray-200 font-medium">
        {selectedConversation?.title || "New Chat"}
      </div>

      {/* Message List */}
      {/* <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length == 0 || !selectedConversation ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex flex-col gap-1.5 ">
              <h1 className="text-4xl sm:text-5xl font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                AlexAI
              </h1>
              <p className="text-2xl sm:text-3xl font-medium text-slate-300">
                How can I help you baccho?
              </p>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                Ask me anything - code,ideas,explanations or any questions.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
              {[
                "Design a Microservices Architecture",
                "Explain Rag",
                "Build Realtime Dashboard",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-sm text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
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
        )}
      </div> */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 || !selectedConversation ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-4xl sm:text-5xl font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                AlexAI
              </h1>
              <p className="text-2xl sm:text-3xl font-medium text-slate-300">
                How can I help you today?
              </p>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                Ask me anything - code, ideas, explanations or any questions.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
              {[
                "Design a Microservices Architecture",
                "Explain Rag",
                "Build Realtime Dashboard",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-sm text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.map((msg, i) => (
              <div key={msg?._id || i}>
                <MessageBubble role={msg?.role} content={msg?.content} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat input Field */}
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

        <div className="flex flex-col gap-2 bg-slate-800 rounded-2xl px-4 py-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Anything..."
            rows={1}
            className="w-full bg-transparent outline-none resize-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 text-white text-sm placeholder:text-gray-500 max-h-40"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 transition"
              >
                <FiPaperclip
                  size={16}
                  className="text-gray-300 hover:text-white transition"
                />
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 transition"
              >
                <FiMic
                  size={16}
                  className="text-gray-300 hover:text-white transition"
                />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={!value.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-400 cursor-pointer text-slate-900 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition"
            >
              <FiSend size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
