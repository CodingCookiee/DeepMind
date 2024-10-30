import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import { clerkMiddleware, requireAuth } from '@clerk/express'
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";


dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "8000", 10);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(clerkMiddleware());
app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Successfully Connected to MongDB");
  } catch (error) {
    console.log(error);
  }
};

const imagekitInstance = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekitInstance.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats", requireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;

  try {
    // Create a new Chat
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();

    // Check if any user chat exists - Find one instead of find
    const userChat = await UserChats.findOne({ userId: userId });

    //if chat does not exists: Create a new chat and add it in the chats array
    if (!userChat) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
      res.status(201).json({ chatId: savedChat._id });
    } else {
      // if chat exists: push the chat to the existing array
      await UserChats.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
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



app.get('/api/userChats', requireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    try {
      const userChats = await UserChats.findOne({ userId });
      if (!userChats) {
        return res.status(404).json({ error: "User Chats not found" });
      }
      res.status(200).json(userChats.chats); // Corrected to return chats array
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
