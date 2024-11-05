import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createChat,
  fetchChatTitle,
  fetchUserChats,
  fetchSpecificChatHistory,
  updateChat,
  editChatTitle,
  deleteChat,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.post("/chats", requireAuth(), createChat);
router.get("/chats/:id/title", requireAuth(), fetchChatTitle);
router.get("/userChats", requireAuth(), fetchUserChats);
router.get("/chats/:id", requireAuth(), fetchSpecificChatHistory);
router.put("/chats/:id", requireAuth(), updateChat);
router.put("/chats/:id/title", requireAuth(), editChatTitle);
router.delete("/chats/:id", requireAuth(), deleteChat);

export default router;
