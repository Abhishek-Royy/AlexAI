import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut, FiUser, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { signOut } from "firebase/auth";
// import { auth } from "../../utils/firebase";
// import { clearUserdata } from "../redux/userSlice";

function Sidebar() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  // TODO: replace with real chats from redux/api
  const chats = userData?.chats || [
    { id: 1, title: "New conversation" },
    { id: 2, title: "React hooks question" },
    { id: 3, title: "Debug axios error" },
  ];

//   const handleLogout = async () => {
//     await signOut(auth);
//     dispatch(clearUserdata());
//   };

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-full bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-200`}
    >
      <div className={`flex items-center p-3 gap-2 ${collapsed ? "flex-col" : "justify-between"}`}>
        <button
          className={`flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-2.5 font-medium transition ${
            collapsed ? "w-10 h-10" : "flex-1"
          }`}
        >
          <FiPlus size={18} />
          {!collapsed && "New Chat"}
        </button>

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className="w-full text-left truncate text-gray-300 hover:bg-slate-800 rounded-lg px-3 py-2.5 text-sm transition"
            title={collapsed ? chat.title : undefined}
          >
            {!collapsed ? chat.title : chat.title.charAt(0)}
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-800 transition">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
            <FiUser size={16} className="text-gray-300" />
          </div>
          {!collapsed && (
            <>
              <span className="flex-1 text-sm text-gray-200 truncate">
                {userData?.name || "user_name"}
              </span>
              <button  title="Logout">
                <FiLogOut size={16} className="text-gray-400 hover:text-white transition" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;