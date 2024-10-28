// newPrompt.js
import "./newPrompt.css";
import React, { useContext, useRef, useEffect } from "react";
import ThemeContext from "../../ThemeContext";

const NewPrompt = () => {
  const { theme } = useContext(ThemeContext);
  const placeholderClasses =
    theme === "dark"
      ? "bg-neutral-800 text-white placeholder-gray-400"
      : "bg-slate-200 text-black placeholder-gray-600";
  const buttonClasses =
    theme === "dark"
      ? "bg-neutral-800 text-white hover:bg-neutral-600"
      : "bg-slate-200 text-black hover:bg-slate-300";
  const newFormClasses = theme === "dark" ? "bg-neutral-700" : "bg-white";
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <>
      <div className="endChat p-10" ref={endRef}></div>
      <form
        className={`newForm flex items-center w-6/12 gap-3 max-w-2xl 
                px-4 py-2 rounded-full absolute -bottom-2 ${newFormClasses}`}
      >
        <label
          htmlFor="file"
          className="border-none rounded-3xl p-1 flex items-center justify-center cursor-pointer"
        >
          <img
            src={theme === "light" ? "/attach-dark.png" : "/attach-light.png"}
            alt=""
            className="w-6 h-6"
          />
        </label>
        <input id="file" type="file" multiple={false} hidden />
        <input
          type="text"
          placeholder="Ask me Anything ..."
          className={`flex-grow p-3 rounded-full focus:outline-none ${placeholderClasses}`}
        />
        <button
          type="submit"
          className={`p-2 rounded-full flex items-center justify-center transition-colors ${buttonClasses}`}
        >
          <img src="/arrow.png" alt="Submit" className="w-6 h-6" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
