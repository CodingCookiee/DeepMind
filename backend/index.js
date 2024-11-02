import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import UserChats from "./models/userChats.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "./models/chat.js";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "8000", 10);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(clerkMiddleware());
app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Successfully Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

// Initialize ImageKit instance
const imagekitInstance = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekitInstance.getAuthenticationParameters();
  res.send(result);
});

// Initialize Gemini with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_PUBLIC_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate chat title using Google Gemini
const generateChatTitle = async (text) => {
  try {
    const result =
      await model.generateContent(`Provide a one sentence, single-line, maximum five words, concise 
      and title that captures the main idea of the following message: "${text}". Please provide only plain text without any markdown or symbols at the start.`);

    const title = result.response?.text
      ? result.response
          .text()
          .trim()
          .replace(/^#+\s*/, "")
      : null;

    return title || "Untitled Chat";
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "Untitled Chat"; // Fallback title in case of error
  }
};

app.post("/api/chats", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    // Save chat with an initial message and ensure proper history structure
    const newChat = new Chat({
      userId,
      title: "New Chat",
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // Send back the new chat ID and temporary title immediately
    res.status(201).json({
      chatId: savedChat._id,
      title: 'New Chat',
    });

    // Generate chat title asynchronously and update it in the background
    const chatTitle = await generateChatTitle(text);
    
    // Update the chat title and the user's chat list concurrently
    await Promise.all([
      Chat.findByIdAndUpdate(savedChat._id, { title: chatTitle }),
      UserChats.updateOne(
        { userId },
        { $push: { chats: { _id: savedChat._id, title: chatTitle } } },
        { upsert: true }
      )
    ]);

    console.log(`Chat title updated to: ${chatTitle}`);
  } catch (error) {
    console.error("Error creating new chat:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error creating new chat" });
    }
  }
});


// New endpoint to fetch the latest chat title
app.get("/api/chats/:id/title", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.id;

  try {
    const chat = await Chat.findOne({ _id: chatId, userId }, "title");
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json({ title: chat.title });
  } catch (error) {
    console.error("Error fetching chat title:", error);
    res.status(500).json({ error: "Error Fetching Chat Title" });
  }
});

// Endpoint to fetch user chats
app.get("/api/userChats", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.findOne({ userId });
    if (!userChats) {
      return res.status(404).json({ error: "User Chats not found" });
    }
    res.status(200).json(userChats.chats);
  } catch (error) {
    res.status(500).json({ error: "Error Fetching User Chats" });
  }
});

// Fetch specific chat history and ensure correct chat ID and user ID
app.get("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.id;

  try {
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: "Error Fetching Chat" });
  }
});

// Endpoint to update chat history
app.put("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }] : []),
    { role: "model", parts: [{ text: answer }] }
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );

    if (!updatedChat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ error: "Error Updating Chat" });
  }
});


// Edit a chat title and move it to the top
app.put("/api/chats/:id/title", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.id;
  let { newTitle } = req.body;

  // Set default title if newTitle is empty or whitespace
  newTitle = newTitle.trim() || "New Chat";

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { title: newTitle },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Update the title in the user's chat list, if it exists
    const userChats = await UserChats.findOne({ userId });
    if (userChats) {
      userChats.chats = [
        { _id: chatId, title: newTitle },
        ...userChats.chats.filter((chat) => chat._id.toString() !== chatId),
      ];
      await userChats.save();
    } else {
      await UserChats.create({
        userId,
        chats: [{ _id: chatId, title: newTitle }],
      });
    }

    res.status(200).json({ title: newTitle });
  } catch (error) {
    console.error("Error updating chat title:", error);
    res.status(500).json({ error: "Error Updating Chat Title" });
  }
});


// Endpoint to delete a chat
app.delete("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.id;

  try {
    const deletedChat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!deletedChat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Remove from UserChats collection
    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Error Deleting Chat" });
  }
});

app
  .listen(port, "localhost", () => {
    connect();
    console.log(`Server running successfully on http://localhost:${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EACCES") {
      console.log(`Port ${port} requires elevated privileges. Try these solutions:
        1. Use a port number above 1024
        2. Run the command prompt as administrator`);
    } else {
      console.error("Server error:", err);
    }
  });
