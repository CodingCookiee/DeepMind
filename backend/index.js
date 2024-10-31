import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import UserChats from "./models/userChats.js";
import  { GoogleGenerativeAI } from "@google/generative-ai";
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
// Generate chat title using Google Gemini
const generateChatTitle = async (text) => {
  try {
    // Use the Google Gemini model instance to generate a response
    const result = await model.generateContent(`Provide a one sentence, single-line, maximum five words, concise 
      and title that captures the main idea of the following message: "${text}".
      Please provide only plain text without any markdown or symbols at the start.`);

    // Extract and clean the title from the response
    const title = result.response?.text ? result.response.text().trim().replace(/^#+\s*/, '') : null; // Use optional chaining


    return title || "Untitled Chat";
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "Untitled Chat"; // Fallback title in case of error
  }
};




// Endpoint to create a new chat
app.post("/api/chats", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    // Create a new Chat with a default title
    const newChat = new Chat({
      userId: userId,
      title: "New Chat", // Initial title
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();

    // Send response immediately with chat ID
    res.status(201).json({ chatId: savedChat._id });

    // Generate title based on the initial message asynchronously
    const chatTitle = await generateChatTitle(text);

    // Update the chat with the generated title
    await Chat.findByIdAndUpdate(savedChat._id, { title: chatTitle });

    // Check if user already has chat history
    const userChat = await UserChats.findOne({ userId: userId });

    if (!userChat) {
      // If no previous chats, create a new UserChats document
      const newUserChats = new UserChats({
        userId: userId,
        chats: [{ _id: savedChat._id, title: chatTitle }],
      });
      await newUserChats.save();
    } else {
      // If chats exist, push new chat into chats array
      await UserChats.findOneAndUpdate(
        { userId: userId },
        { $push: { chats: { _id: savedChat._id, title: chatTitle } } }
      );
    }
  } catch (error) {
    res.status(500).json({ error: "Error creating new chat" });
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


// Endpoint to fetch a specific chat
app.get("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId }); // Fix here
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error); 
    res.status(500).json({ error: "Error Fetching Chat" });
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
