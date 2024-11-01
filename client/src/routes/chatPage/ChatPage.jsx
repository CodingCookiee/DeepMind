// chatPage.js
import "./chatPage.css";
import React, { useContext } from "react";
import ThemeContext from "../../ThemeContext";
import NewPrompt from "../../Components/newPrompt/newPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const ChatPage = () => {
  const pathname = useLocation().pathname;
  const chatId = pathname.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const { theme } = useContext(ThemeContext);
  const userBg = theme === "light" ? "bg-slate-300" : "bg-neutral-700";
  const scrollbarClass =
    theme === "dark" ? "scrollbar-dark" : "scrollbar-light";
  const loadingBg = theme === "light" ? "bg-slate-300" : "bg-slate-700";

  return (
    <div className="chatPage h-full flex flex-col items-center relative">
      <div
        className={`wrapper flex-1 overflow-y-auto overflow-x-hidden w-full flex justify-center ${scrollbarClass}`}
      >
        <div className="chat w-6/12 flex flex-col">
          {isPending ? (
            <div>Processing...</div>
          ) : error ? (
            <div>Something went wrong</div>
          ) : (
            data?.history?.map((message, i) => (
              <React.Fragment key={i}>
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div
                  className={`message ${
                    message.role === "user"
                      ? "user message p-5 rounded-3xl max-w-[90%] self-end ml-auto"
                      : "message p-5"
                  }`}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </React.Fragment>
            ))
          )}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
