import "./dashboardPage.css";
import React, { useContext } from "react";
import ThemeContext from "../../ThemeContext";

const DashboardPage = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="dashboardPage h-full flex flex-col items-center">
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
        <div className="options w-full flex items-center justify-between gap-16">
          {/* Set a fixed height and ensure equal flex properties */}
          <div className="option flex flex-col gap-2.5 font-light text-sm p-5 border border-solid border-slate-400 rounded-2xl h-52 flex-1">
            <img src="/chat.png" alt="Create a New Chat" />
            <span>Create a New Chat</span>
          </div>
          <div className="option flex flex-col gap-2.5 font-light text-sm p-5 border border-solid border-slate-400 rounded-2xl h-52 flex-1">
            <img src="/code.png" alt="Help me with my Code" />
            <span>Help me with my Code</span>
          </div>
          <div className="option flex flex-col gap-2.5 font-light text-sm p-5 border border-solid border-slate-400 rounded-2xl h-52 flex-1">
            <img src="/image.png" alt="Analyze Images" />
            <span>Analyze Images</span>
          </div>
        </div>
      </div>
      <div className="formContainer mt-auto">
        <form>
          <input type="text" placeholder="Ask Anything . . ." />
          <button>
            <img src="/arrow.png" alt="arrow image" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
