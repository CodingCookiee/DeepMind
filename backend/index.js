import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "./middleware/authMiddleware.js";
import chatRoutes from "./routes/chatRoutes.js";
import { connectToDatabase } from "./config/database.js";
import { imagekitInstance } from "./config/imagekit.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(clerkMiddleware());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Welcome to the Panda AI Backend API");
// });


app.get("/api/upload", (req, res) => {
  const result = imagekitInstance.getAuthenticationParameters();
  res.send(result);
});

app.use("/api", chatRoutes);


app
  .listen(port, async () => {
    await connectToDatabase();
    console.log(`Server running successfully on ${process.env.CLIENT_URL}:${port}`);
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
