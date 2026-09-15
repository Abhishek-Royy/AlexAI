import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiEye, FiCode } from "react-icons/fi";

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState("code"); // "code" | "preview"

  // TODO: wire to real artifact content from redux/api
  const codeContent = "// generated code will appear here";

  if (collapsed) {
    return (
      <div className="w-10 h-full bg-slate-950 border-l border-slate-800 flex items-start justify-center pt-3">
        <button onClick={() => setCollapsed(false)}>
          <FiChevronLeft size={18} className="text-gray-400 hover:text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-100 h-full bg-slate-950 border-l border-slate-800 flex flex-col">
      <div className="border-b border-slate-800 px-3 py-2.5 flex items-center justify-between">
        <button onClick={() => setCollapsed(true)}>
          <FiChevronRight
            size={18}
            className="text-gray-400 hover:text-white"
          />
        </button>
        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setView("code")}
            className={`p-1.5 rounded-md ${view === "code" ? "bg-slate-700" : ""}`}
          >
            <FiCode size={16} className="text-gray-300" />
          </button>
          <button
            onClick={() => setView("preview")}
            className={`p-1.5 rounded-md ${view === "preview" ? "bg-slate-700" : ""}`}
          >
            <FiEye size={16} className="text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {view === "code" ? (
          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
            {codeContent}
          </pre>
        ) : (
          <div className="text-gray-400 text-sm text-center mt-10">
            Preview will render here
          </div>
        )}
      </div>
    </div>
  );
}

export default Artifact;
