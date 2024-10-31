import "./dashboardPage.css";
import React, { useContext } from "react";
import ThemeContext from "../../ThemeContext";
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {

  const queryClient = useQueryClient();
  const navigate = useNavigate();
    
  // Mutations
    const mutation = useMutation({
      mutationFn: (text) => {
        return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
          method: 'POST',
          credentials: 'include',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text })
        }).then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json(); // Ensure you return the JSON response
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['userChats'] });
        navigate(`/dashboard/chats/${data.chatId}`);
      }, onError: (error) => {
      console.error('Error:', error);
    },
    })

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const text = e.target.text.value;
    if(!text) return;
    mutation.mutate(text);
  }

  const { theme } = useContext(ThemeContext);

  const formContainerClasses = theme === 'dark' ? 'bg-neutral-700' : 'bg-white';
  const placeholderClasses = theme === 'dark' 
    ? 'bg-neutral-800 text-white placeholder-gray-400' 
    : 'bg-slate-200 text-black placeholder-gray-600';
  const buttonClasses = theme === 'dark' 
    ? 'bg-neutral-800 text-white hover:bg-neutral-600' 
    : 'bg-slate-200 text-black hover:bg-slate-300';

  return (
    <div className="dashboardPage h-full flex flex-col items-center overflow-hidden ">
      <div className="texts flex-1 flex flex-col items-center justify-center w-3/6 gap-14">
        <div className="logo flex items-center gap-2 opacity-25">
          <img
            src='/panda.svg'
            alt="Logo"
            className="w-16 h-16"
          />
          <h1
            className="text-6xl font-bold bg-clip-text text-transparent
                     bg-gradient-to-r from-indigo-500 to-fuchsia-500"
          >
            PANDA AI
          </h1>
        </div>
        <div className="options w-full flex items-center justify-between gap-14">
          <div className="option flex flex-col gap-2.5 font-light text-sm p-5 border border-solid border-slate-400 rounded-2xl flex-1 shadow-md">
            <img src="/chat.png" alt="Create a New Chat" className="w-10 h-10 object-cover" />
            <span>Create a New Chat</span>
          </div>
          <div className="option flex flex-col gap-2.5 font-light text-sm p-5 border border-solid border-slate-400 rounded-2xl flex-1 shadow-md">
            <img src="/code.png" alt="Help with Code" className="w-10 h-10 object-cover" />
            <span>Help with Code</span>
          </div>
          <div className="option flex flex-col gap-2.5 font-light text-sm p-5 border border-solid border-slate-400 rounded-2xl flex-1 shadow-md">
            <img src="/image.png" alt="Analyze Images" className="w-10 h-10 object-cover"/>
            <span>Analyze Data</span>
          </div>
        </div>
      </div>
      <div className={`formContainer flex items-center mt-auto w-full
      max-w-2xl px-4 py-2.5 rounded-full shadow-lg ${formContainerClasses}`}>
        <form className="flex items-center
        justify-between w-full gap-3 "
        onSubmit={handleSubmit}>
          <input 
            name ='text'
            type="text" 
            placeholder="Ask me Anything ..." 
            className={`flex-grow p-3 rounded-full focus:outline-none ${placeholderClasses}`}
          />
          <button className={`p-2 rounded-full flex items-center justify-center transition-colors ${buttonClasses}`}>
            <img src="/arrow.png" alt="Submit" className="w-6 h-6"/>
          </button>
        </form>
      </div>
    </div>
  );
};
export default DashboardPage;
