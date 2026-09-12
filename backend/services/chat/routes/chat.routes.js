import express from "express";
import {
  createConversation,
  getAllMessages,
  getConversations,
  saveMessage,
  updateConversation,
} from "../controller/chat.controller.js";

const router = express.Router();

router.get("/create-conversation", createConversation);
router.get("/get-conversations", getConversations);
router.post("/save-message", saveMessage);
router.get("/get-messages/:conversationId", getAllMessages);
router.post("/update-conversation", updateConversation);


export default router;