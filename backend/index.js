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

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


app.use(express.json());


app.get("/api/upload", (req, res) => {
  const result = imagekitInstance.getAuthenticationParameters();
  res.send(result);
});

app.use("/api", chatRoutes);

// app.use(express.static(path.join(__dirname, '../client')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client', 'index.html'));
// });


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
