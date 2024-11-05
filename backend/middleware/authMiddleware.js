import { clerkMiddleware, requireAuth } from "@clerk/express";

export { clerkMiddleware, requireAuth };

// Example logging
export const authLoggingMiddleware = (req, res, next) => {
    console.log("Auth Info:", req.auth); // This should log the userId if authentication is successful
    next();
};
