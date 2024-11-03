import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_PUBLIC_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
