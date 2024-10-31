import "./chatList.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import ThemeContext from "../ThemeContext";
import { useQuery } from "@tanstack/react-query";

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userChats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const { theme } = useContext(ThemeContext);
  const hoverBg =
    theme === "light" ? "hover:bg-slate-200" : "hover:bg-neutral-800";
  const loadingBg = theme === "light" ? "bg-slate-300" : "bg-slate-700";
  const scrollbarClass =
    theme === "dark" ? "scrollbar-dark" : "scrollbar-light";

  return (
    <div className="chatList flex flex-col p-5 h-5/6">
      <span className="title font-semibold text-xs mb-2.5">DASHBOARD</span>
      <Link to="/dashboard" className="font-normal text-base mb-2.5">
        Create a new Chat
      </Link>
      <Link to="/" className="font-normal text-base mb-2.5">
        Explore Lama AI
      </Link>
      <Link to="/" className="font-normal text-base mb-2.5">
        Contact
      </Link>
      <hr className="border-none h-0.5 bg-slate-50 opacity-10 rounded-sm mb-5" />

      <span className="title font-semibold text-xs mb-2.5">RECENT CHATS</span>
      <div
        className={`list flex flex-col overflow-y-auto flex-grow h-full ${scrollbarClass}`}
      >
        {isPending ? (
          <div
            className={`border ${theme === "light" ? "border-gray-300" : "border-gray-700"} shadow rounded-md p-4 max-w-sm w-full mx-auto`}
          >
            <div className="animate-pulse flex space-x-4">
              <div className={`rounded-full ${loadingBg} h-10 w-10`}></div>
              <div className="flex-1 space-y-6 py-1">
                <div className={`h-2 ${loadingBg} rounded`}></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div
                          className={`h-2 ${loadingBg} rounded col-span-2`}
                        ></div>
                        <div
                          className={`h-2 ${loadingBg} rounded col-span-1`}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className={`h-2 ${loadingBg} rounded`}></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div>Something went wrong</div>
        ) : data && data.length > 0 ? (
          data.map((chat) => (
            <Link
              to={`/dashboard/chats/${chat._id}`}
              key={chat._id}
              className={`chatItem flex items-center gap-2.5 px-2.5 py-2.5 rounded-md ${hoverBg} cursor-pointer`}
            >
              <div className="texts flex flex-col gap-1">
                <span className="font-semibold">
                  {chat.title || "Untitled Chat"}{" "}
                  {/* Display fallback if title is missing */}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div>No chats available</div>
        )}
      </div>
      <hr className="border-none h-0.5 bg-slate-50 opacity-10 rounded-sm mt-5 mb-5" />

      <div className="upgrade -mb-20 mt-auto flex items-center gap-2 text-xs ">
        <img src="/panda.svg" alt="" className="w-6 h-6 mb-8" />
        <div className="texts flex flex-col gap-1">
          <span className="font-semibold">Upgrade to PANDA AI Pro</span>
          <span className="text-slate-500">
            Get unlimited access to all features
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
