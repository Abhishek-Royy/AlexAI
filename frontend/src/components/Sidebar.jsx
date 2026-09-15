

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiLogOut,
  FiUser,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MessageSquare, Sparkles, User } from "lucide-react";
import { getConversations } from "../apis/getConversations";
import {
  addConversation,
  setConversations,
  setSelectedConversation,
} from "../redux/consversationSlice";
import { createConversation } from "../apis/createCoversation";
import logOut from "../apis/logOut";
import { setUserdata } from "../redux/userSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const [imageError, setImageError] = useState(false);

  // user slice
  const { userData } = useSelector((state) => state.user);
  // conversation slice
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );

  // FETCH ALL CONVERSATIONS
  useEffect(() => {
    const getConv = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };
    getConv();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?._id]);

  // HANDLE CREATE CONVERSATION
  const handleCreateConversation = async () => {
    try {
      const data = await createConversation();
      dispatch(addConversation(data));
      dispatch(setSelectedConversation(data));
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-full bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-200`}
    >
      {/* Product header */}
      <div
        className={`flex items-center gap-2 px-3 pt-3 pb-1 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-base tracking-tight truncate">
              AlexAI
            </span>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Collapse sidebar"
          >
            <FiChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center pb-1">
          <button
            onClick={() => setCollapsed(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition"
            title="Expand sidebar"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}

      {/* New chat */}
      <div className="px-3 pb-2 pt-2">
        <button
          onClick={handleCreateConversation}
          className={`flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-2.5 font-medium transition ${
            collapsed ? "w-10 h-10 mx-auto" : "w-full"
          }`}
          title="New chat"
        >
          <FiPlus size={18} />
          {!collapsed && "New Chat"}
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-3">
        {!collapsed && conversations.length > 0 && (
          <p className="px-2 pt-1 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-gray-400">
            Recents
          </p>
        )}

        {conversations.length === 0 ? (
          !collapsed && (
            <p className="px-2 py-2 text-sm text-gray-500">
              No recent conversations
            </p>
          )
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => {
              const isActive = selectedConversation?._id === conv?._id;
              return (
                <button
                  key={conv._id}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  title={collapsed ? conv?.title || "New Chat" : undefined}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm border transition ${
                    collapsed ? "justify-center" : "text-left"
                  } ${
                    isActive
                      ? "bg-slate-800 border-indigo-500/40 text-white"
                      : "bg-transparent border-transparent text-gray-300 hover:bg-slate-800"
                  }`}
                >
                  <MessageSquare size={16} className="shrink-0" />
                  {!collapsed && (
                    <span className="truncate">
                      {conv?.title || "New Chat"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="p-3 border-t border-slate-800">
        {userData ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-800 transition">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
              {userData?.avatar && !imageError ? (
                <img
                  src={userData.avatar}
                  alt={userData?.name || "User avatar"}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <User size={16} className="text-gray-300" />
              )}
            </div>

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-sm text-gray-200 truncate">
                    {userData?.name || "user_name"}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    Free Plan
                  </span>
                </div>
                <button
                  title="Logout"
                  onClick={async () => {
                    try {
                      await logOut();
                    } catch (error) {
                      console.error("Logout error:", error);
                    } finally {
                      dispatch(setUserdata(null));
                    }
                  }}
                >
                  <FiLogOut
                    size={16}
                    className="text-gray-400 hover:text-white transition"
                  />
                </button>
              </>
            )}
          </div>
        ) : (
          !collapsed && (
            <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-2.5 text-sm font-medium transition">
              <FiUser size={15} />
              Login
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Sidebar;
