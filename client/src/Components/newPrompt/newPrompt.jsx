// newPrompt.js
import "./newPrompt.css";
import React, { useContext, useRef, useEffect, useState } from "react";
import ThemeContext from "../../ThemeContext";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import Upload from "../upload/uploadData";
import model from "../../lib/gemini.js";
import Markdown from "react-markdown";

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
  const userBg = theme === "light" ? "bg-slate-300" : "bg-neutral-700";

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [img.dbData, img.isLoading, question, answer]);

  const add = async (text) => {
    setQuestion(text);

    const result = await chat.sendMessageStream(
      Object.entries(img.aiData).length ? [img.aiData, text] : [text]
    );
    let accumulatedText = '';
    for await (const chunk of result.stream){
      const chunkText = chunk.text();
      accumulatedText += chunkText
      setAnswer(accumulatedText);
    }
    
    setImg({
      isLoading: false,
      error: "",
      dbData: {},
      aiData: {},
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;
    add(text);

  };

  return (
    <>
      {img.isLoading && (
        <div
          className={`flex items-center justify-center p-4 ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
          <span className="ml-3">Loading . . .</span>
        </div>
      )}

      <IKImage
        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
        path={img.dbData?.filePath}
        width="380"
        transformation={[
          {
            width: 380,
            quality: 80,
            format: "webp",
            progressive: true,
          },
        ]}
        className="mt-4 mb-4"
      />
      {question && (
        <div
          className={`message user p-5 rounded-3xl max-w-[90%] self-end ml-auto ${userBg}`}
        >
          {question}
        </div>
      )}
      {answer && (
        <div className="message p-5">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat p-6" ref={endRef}></div>
      <form
        className={`newForm flex items-center w-6/12 gap-3 max-w-2xl 
        px-4 py-2 rounded-full absolute -bottom-2 ${newFormClasses}`}
        onSubmit={handleSubmit}
      >
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input
          name="text"
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
