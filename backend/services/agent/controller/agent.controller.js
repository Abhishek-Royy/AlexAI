import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";
import redis from "../../../shared/redis/redis.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;



    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    await axios
      .post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
        conversationId,
        role: "user",
        content: prompt,
      })
      .catch((err) => {
        console.error(
          "Error saving user message to chat service:",
          err.message,
        );
      });

    // go with the graph
    const result = await graph.invoke({ prompt, conversationId });

    const response = result.aiResponse;

    // message add in redis
    await addMessage(conversationId, "user", prompt);

    if (response) {
      await addMessage(conversationId, "assistant", response);
      await axios
        .post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
          conversationId,
          role: "assistant",
          content: response,
        })
        .catch((err) => {
          console.error(
            "Error saving assistant message to chat service:",
            err.message,
          );
        });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in agent controller chat:", error);
    return res
      .status(500)
      .json({
        message: "Error in agent controller chat",
        error: error.message,
      });
  }
};
