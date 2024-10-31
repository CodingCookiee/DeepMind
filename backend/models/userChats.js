import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    chats: [
        {
            _id: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
                default: "Untitled Chat",  // Fallback title if none is provided
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true,
});

export default mongoose.models.UserChats || mongoose.model("UserChats", userChatsSchema);
