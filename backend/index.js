// index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "./middleware/authMiddleware.js";
import chatRoutes from "./routes/chatRoutes.js";
import { connectToDatabase } from "./config/database.js";
import { imagekitInstance } from "./config/imagekit.js";
import path from "path";
import url from "url";

dotenv.config();
const port = parseInt(process.env.PORT || "8000", 10);

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// app.use(clerkMiddleware());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


// Parse incoming JSON
app.use(express.json());

// API Route for ImageKit Authentication
app.get("/api/upload", (req, res) => {
  try {
    const result = imagekitInstance.getAuthenticationParameters();
    res.json(result); // Send JSON response
  } catch (error) {
    res.status(500).json({ error: "ImageKit authentication error" });
  }
});

// API Routes
app.use("/api", chatRoutes);

// Serve Static Files for Frontend
// app.use(express.static(path.join(__dirname, "../client")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client", "index.html"));
// });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Server encountered an error" });
});

// Start Server
app
  .listen(port, async () => {
    await connectToDatabase();
    console.log(`Server running successfully on https://panda-ai.onrender.com:${port}`);
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
