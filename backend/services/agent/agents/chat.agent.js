// import { getModel } from "../config/llmModels.js";

// export const chatAgent = async (state) => {
//   const llm = await getModel("chat");
//   const systemPrompt = "You are AlexAI, an intelligent,smart AI Assistant";
//   const response = await llm.invoke([
//     {
//       role: "system",
//       content: systemPrompt,
//     },
//     {
//       role: "human",
//       content: state.prompt,
//     },
//   ]);
//   return {
//     ...state,
//     aiResponse: response.content,
//   };
// };

import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
  try {
    const llm = await getModel("chat");

    // get history of message
    const history = (await getMemory(state?.conversationId)) || [];

    const systemPrompt = `You are AlexAI, an intelligent and helpful AI assistant.

    Rules:
    - For simple questions, greetings, and short queries, respond naturally in plain text.
    - For technical, educational, coding or detailed topics, use clean Markdown.

Formatting guidelines for your responses:
- Use Markdown formatting throughout (headings, bold, bullet points, numbered lists) where it improves clarity.
- Wrap all code in fenced code blocks with the correct language tag (e.g. \`\`\`javascript).
- Use headings (##, ###) to break up longer explanations into sections.
- Use bullet points or numbered lists for steps, options, or comparisons instead of dense paragraphs.
- Keep paragraphs short and scannable — avoid large walls of text.
- Bold key terms or important warnings when relevant.
- For tables of comparable data, use a Markdown table.
- Be direct and clear; avoid unnecessary filler or repetition.`;

    const messages = [new SystemMessage(systemPrompt)];

    if (Array.isArray(history)) {
      history.forEach((msg) => {
        if (!msg || !msg.content) return;
        if (msg.role === "user") {
          messages.push(new HumanMessage(msg.content));
        } else if (msg.role === "assistant") {
          messages.push(new AIMessage(msg.content));
        }
      });
    }

    // Check if the current prompt was already added to history
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.content !== state.prompt) {
      if (state?.prompt?.trim()) {
        messages.push(new HumanMessage(state.prompt));
      }
    }

    if (!state?.prompt?.trim()) {
      throw new Error("No prompt provided in state.");
    }

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse:
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content),
    };
  } catch (error) {
    console.error("chatAgent failed:", error);
    return {
      ...state,
      aiResponse: null,
      error: error.message || "Failed to generate a response.",
    };
  }
};
