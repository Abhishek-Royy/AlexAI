import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { imageGenAgent } from "../agents/image.agent.js";

const workflow = new StateGraph(agentState);

// add the nodes
workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("imgGen", imageGenAgent);

// connect the edges
workflow.addEdge("__start__", "router");

workflow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "chat":
        return "chat";
      case "search":
        return "search";
      case "pdf":
        return "pdf";
      case "coding":
        return "coding";
      case "ppt":
        return "ppt";
      case "imgGen":
        return "imgGen";

      default:
        return "chat";
    }
  },
  {
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    ppt: "ppt",
    imgGen: "imgGen",
  },
);

// search and chat agent connection
workflow.addEdge("search", "chat");

// other connect to END
workflow.addEdge("chat", "__end__");
workflow.addEdge("coding", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("imgGen", "__end__");

// compile the workflow
export const graph = workflow.compile();
