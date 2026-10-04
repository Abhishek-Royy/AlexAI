import axios from "axios"
export const getMessages = async (conversationId) => {
  try {
    const { data } = await axios.get(
      `${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`, //getting message
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
    
  }
};
