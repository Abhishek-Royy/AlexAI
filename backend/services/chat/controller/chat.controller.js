import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// create conversation function
export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("UserId with the help of Header: ", userId);

    // create conversation
    const conversation = await Conversation.create({
      userId: userId,
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ messgae: `create conversation error:${error}` });
  }
};

// Get conversation
export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("UserId with the help of Header: ", userId);

    // create conversation
    const conversations = await Conversation.find({
      userId: userId,
    }).sort({ updatedAt: -1 });
    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ messgae: `Get conversation error:${error}` });
  }
};

// update the conversation(update the title of the conversation)
export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;

    const conversation = await Conversation.findByIdAndUpdate({
      id,
      title,
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ messgae: `Update conversation error:${error}` });
  }
};

// save the message
export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;
    const message = await Message.create({
      conversationId,
      content,
      role,
    });
    return res.status(200).json(message);
  } catch (error) {
    return res
      .staus(5000)
      .json({ message: `Error during save message,  ${error}` });
  }
};

// make api for get all the message
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json(messages);
  } catch (error) {
    return res
      .staus(5000)
      .json({ message: `Error during get messages,  ${error}` });
  }
};
