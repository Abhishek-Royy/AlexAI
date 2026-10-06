import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";
export const getMemory = async (conversationId) => {
  if (!conversationId) return [];

  const key = `messages-${conversationId}`;
  try {
    const cached = await redis.get(key);

    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }

    const messages = await getMessages(conversationId);
    const validMessages = Array.isArray(messages) ? messages : [];

    if (validMessages.length > 0) {
      await redis.set(key, JSON.stringify(validMessages), "EX", 24 * 60 * 60); // valid for 1 day
    }

    return validMessages;
  } catch (error) {
    console.error("Error in getMemory:", error);
    return [];
  }
};

export const addMessage = async (conversationId, role, content) => {
  if (!conversationId || !content) return;

  const key = `messages-${conversationId}`;
  try {
    const rawMessages = await redis.get(key);
    let messages = [];

    if (rawMessages) {
      try {
        const parsed = JSON.parse(rawMessages);
        if (Array.isArray(parsed)) {
          messages = parsed;
        }
      } catch {
        messages = [];
      }
    }

    messages.push({
      role,
      content,
    });

    if (messages.length > 20) {
      messages.shift();
    }

    await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
  } catch (error) {
    console.error("Error in addMessage:", error);
  }
};
