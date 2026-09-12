import Conversation from "../models/conversation.model";

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
