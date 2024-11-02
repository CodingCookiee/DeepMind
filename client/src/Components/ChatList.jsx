import "./chatList.css";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import ThemeContext from "../ThemeContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ChatList = () => {
  const queryClient = useQueryClient();
const { data, error, isPending } = useQuery({
  queryKey: ["userChats"],
  queryFn: () =>
    fetch(`${import.meta.env.VITE_API_URL}/api/userChats`, {
      credentials: "include",
    }).then((res) => res.json()),
});

  const { theme } = useContext(ThemeContext);
  const hoverBg = theme === "light" ? "hover:bg-slate-200" : "hover:bg-neutral-800";
  const loadingBg = theme === "light" ? "bg-slate-300" : "bg-slate-700";
  const scrollbarClass = theme === "dark" ? "scrollbar-dark" : "scrollbar-light";

  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState(null); // Track which chat menu is open

  // Refs to handle outside click
  const menuRef = useRef(null);
  const inputRef = useRef(null);

// Ensure individual chat history is fetched and not reused across chats
useEffect(() => {
  const intervalId = setInterval(() => {
    queryClient.invalidateQueries("userChats");
  }, 3000);
  return () => clearInterval(intervalId);
}, [queryClient]);


  // Close dropdown or edit input on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
      if (editingChatId && inputRef.current && !inputRef.current.contains(e.target)) {
        handleEditTitle(editingChatId);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen, editingChatId, queryClient]);
  

const handleEditTitle = async (chatId) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}/title`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newTitle }),
    });

    // Immediately refetch the chat list to get the reshuffled order
    queryClient.invalidateQueries("userChats");

    setEditingChatId(null); // Exit editing mode
  } catch (error) {
    console.error("Error updating title", error);
  }
};


  const handleDeleteChat = async (chatId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      });
      queryClient.invalidateQueries("userChats");
    } catch (error) {
      console.error("Error deleting chat", error);
    }
  };

  const handleRenameOnEnter = (e, chatId) => {
    if (e.key === "Enter") {
      handleEditTitle(chatId);
    }
  };

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
      <div className={`list flex flex-col overflow-y-auto flex-grow h-full ${scrollbarClass}`}>
        {isPending ? (
          <div className={`border ${theme === "light" ? "border-gray-300" : "border-gray-700"} shadow rounded-md p-4 max-w-sm w-full mx-auto`}>
            <div className="animate-pulse flex space-x-4">
              <div className={`rounded-full ${loadingBg} h-10 w-10`}></div>
              <div className="flex-1 space-y-6 py-1">
                <div className={`h-2 ${loadingBg} rounded`}></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className={`h-2 ${loadingBg} rounded col-span-2`}></div>
                        <div className={`h-2 ${loadingBg} rounded col-span-1`}></div>
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
            <div key={chat._id} className={`chatItem relative flex items-center justify-between px-2.5 py-2.5 rounded-md ${hoverBg} ` }>
              {editingChatId === chat._id ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => handleRenameOnEnter(e, chat._id)}
                  onBlur={() => handleEditTitle(chat._id)}
                  ref={inputRef} // Ref to detect outside click
                  className="bg-transparent border-b border-gray-400 focus:outline-none w-full"
                  autoFocus
                />
              ) : (
                <Link to={`/dashboard/chats/${chat._id}`} className="flex-grow">
                  <span className="font-semibold">{chat.title || "New Chat"}</span>
                </Link>
              )}

              {/* Options Button */}
              <img
                src={theme === 'light' ? '/ellipsis-dark.png' : '/ellipsis-light.png'}
                alt="Options"
                className="w-5 h-5 cursor-pointer"
                onClick={() => setMenuOpen(menuOpen === chat._id ? null : chat._id)}
              />

              {/* Dropdown Menu */}
              {menuOpen === chat._id && (
                <div ref={menuRef} className="absolute right-0 top-10 bg-white rounded-md shadow-lg z-10 w-32 text-sm">
                  <button
                    className={`block w-full px-4 py-2 ${hoverBg}`}
                    onClick={() => {
                      setEditingChatId(chat._id);
                      setNewTitle(chat.title);
                      setMenuOpen(null);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-red-600 hover:bg-red-100"
                    onClick={() => {
                      handleDeleteChat(chat._id);
                      setMenuOpen(null);
                    }}
                  >
                    Delete Chat
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No chats available</div>
        )}
      </div>
      <hr className="border-none h-0.5 bg-slate-50 opacity-10 rounded-sm mt-5 mb-5" />
      <div className="upgrade -mb-20 mt-auto flex items-center gap-2 text-xs">
        <img src="/panda.svg" alt="Upgrade to Pro" className="w-6 h-6 mb-8" />
        <div className="texts flex flex-col gap-1">
          <span className="font-semibold">Upgrade to PANDA AI Pro</span>
          <span className="text-slate-500">Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
