import "./dashboardLayout.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import ChatList from "../../Components/ChatList";
import ThemeContext from "../../ThemeContext";
import mongoose from "mongoose";

const DashBoardLayout = () => {
  const { theme } = useContext(ThemeContext);
  const contentBg = theme === "light" ? "bg-slate-200" : "bg-neutral-800";
  const loadingBg = theme === "light" ? "bg-slate-300" : "bg-slate-700";
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [chatId, setChatId] = useState(null);
  
  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);


  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const extractedChatId = pathParts[pathParts.length - 1];
    const isValidChatId = mongoose.Types.ObjectId.isValid(extractedChatId);

    if (isValidChatId) {
      setChatId(extractedChatId); 
      const fetchChatTitle = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/chats/${extractedChatId}/title`,
            { credentials: "include" }
          );
          const result = await response.json();
          setChatTitle(result.title || "New Chat");
        } catch (error) {
          console.error("Failed to fetch chat title:", error);
        }
      };
      fetchChatTitle();
    } else {
      setChatTitle("New Chat");
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className={`border h-full w-full max-w-xl mt-5 ${theme === "light" ? "border-gray-300" : "border-gray-700"} shadow rounded-md p-4 mx-auto`}>
        <div className="animate-pulse flex space-x-4">
          <div className={`rounded-full ${loadingBg} `}></div>
          <div className="flex-1 space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className={`h-2 mt-10 mb-10 ${loadingBg} rounded w-3/4`}></div>
                <div className={`h-2 ${loadingBg} rounded w-1/2`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboardLayout flex gap-3 pt-5 h-full">
      <div className="menu flex-none w-56">
        <ChatList chatId={chatId} chatTitle={chatTitle} setChatTitle={setChatTitle} /> {/* Pass both chatId and chatTitle */}
      </div>
      <div className={`content flex-grow p-5 overflow-y-auto ${contentBg}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoardLayout;
