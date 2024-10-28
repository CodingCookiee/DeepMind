// chatPage.js
import "./chatPage.css";
import React, { useContext } from "react";
import ThemeContext from "../../ThemeContext";
import NewPrompt from "../../Components/newPrompt/newPrompt";

const ChatPage = ({ messageCount = 40 }) => {
  const demoMessages = Array.from({ length: messageCount }, (_, index) => ({
    sender: index % 2 === 0 ? "ai" : "user",
    text: `Test Message ${index + 1} from ${index % 2 === 0 ? "AI" : "User"}`,
  }));

  const { theme } = useContext(ThemeContext);
  const userBg = theme === "light" ? "bg-slate-300" : "bg-neutral-700";
  const scrollbarClass =
    theme === "dark" ? "scrollbar-dark" : "scrollbar-light";

  return (
    <div className="chatPage h-full flex flex-col items-center relative">
      <div
        className={`wrapper flex-1 overflow-y-auto w-full flex justify-center ${scrollbarClass}`}
      >
        <div className="chat w-6/12 flex flex-col">
          {demoMessages.map((msg, index) => (
            <div
              key={index}
              className={`message p-5 ${
                msg.sender === "user"
                  ? `${userBg} rounded-3xl max-w-[90%] self-end ml-auto`
                  : "mt-10"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <NewPrompt />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
