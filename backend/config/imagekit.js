import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();
// Initialize ImageKit instance
export const imagekitInstance = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  });

