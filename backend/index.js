import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "./middleware/authMiddleware.js";
import chatRoutes from "./routes/chatRoutes.js";
import { connectToDatabase } from "./config/database.js";
import { imagekitInstance } from "./config/imagekit.js";

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


app.get("/api/upload", (req, res) => {
  const result = imagekitInstance.getAuthenticationParameters();
  res.send(result);
});

app.use(chatRoutes);


app
  .listen(port, "localhost", async () => {
    await connectToDatabase();
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
