// express router
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
} from "../Controllers/chatControllers.js";

const router = express.Router();

router.post("/api/chats", requireAuth(), createChat);
router.get("/api/chats/:id/title", requireAuth(), fetchChatTitle);
router.get("/api/userChats", requireAuth(), fetchUserChats);
router.get("/api/chats/:id", requireAuth(), fetchSpecificChatHistory);
router.put("/api/chats/:id", requireAuth(), updateChat);
router.put("/api/chats/:id/title", requireAuth(), editChatTitle);
router.delete("/api/chats/:id", requireAuth(), deleteChat);

export default router;
