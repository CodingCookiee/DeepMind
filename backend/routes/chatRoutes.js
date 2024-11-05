import express from "express";
// import  from "../middleware/authMiddleware.js";
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

router.post("/chats", createChat);
router.get("/chats/:id/title", fetchChatTitle);
router.get("/userChats", fetchUserChats);
router.get("/chats/:id", fetchSpecificChatHistory);
router.put("/chats/:id", updateChat);
router.put("/chats/:id/title", editChatTitle);
router.delete("/chats/:id", deleteChat);

export default router;
