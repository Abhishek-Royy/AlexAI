import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatDeepSeek } from "@langchain/deepseek";

const groq = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  // other params...
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  temperature: 0,
  maxRetries: 2,
  // other params...
});


const deepseek = new ChatDeepSeek({
  model: "deepseek-reasoner",
  temperature: 0,
  // other params...
})

export const getModel = async (agent) => {
  switch (agent) {
    case "chat":
      return groq;
    case "search":
      return groq;
    case "coding":
      return deepseek;

    default:
      return groq;
  }
};
