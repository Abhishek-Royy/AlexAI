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

import { getModel } from "../config/llmModels.js";

export const chatAgent = async (state) => {
  try {
    const llm = await getModel("chat");

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

    if (!state?.prompt?.trim()) {
      throw new Error("No prompt provided in state.");
    }

    const response = await llm.invoke([
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: state.prompt,
      },
    ]);

    return {
      ...state,
      aiResponse: response.content,
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
