import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { Configuration, OpenAIApi } from "openai";
import UserChats from "./models/userChats.js";
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

import { Configuration, OpenAIApi } from "openai";

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// Function to generate a dynamic chat title
const generateChatTitle = async (text) => {
  try {
    // Request a completion from OpenAI's GPT-3.5-turbo model
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Generate a short, descriptive title for the following message." },
        { role: "user", content: text },
      ],
      max_tokens: 10,  // Limit response length to a short title
      temperature: 0.7, // Control creativity
    });
    // Extract and return the title
    const title = response.data.choices[0].message.content.trim();
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
    // Generate title based on the initial message
    const chatTitle = await generateChatTitle(text);
    // Create a new Chat
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();

    // Check if user already has chat history
    const userChat = await UserChats.findOne({ userId: userId });

    if (!userChat) {
      // If no previous chats, create a new UserChats document
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: chatTitle,
          },
        ],
      });
      await newUserChats.save();
      res.status(201).json({ chatId: savedChat._id });
    } else {
      // If chats exist, push new chat into chats array
      await UserChats.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: chatTitle,
            },
          },
        }
      );
      res.status(201).json({ chatId: savedChat._id });
    }
  } catch (error) {
    res.status(500).json({ error: "Error creating chat" });
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
