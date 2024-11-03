import "./newPrompt.css";
import React, { useContext, useRef, useEffect, useState } from "react";
import ThemeContext from "../../ThemeContext";
import { IKImage } from "imagekitio-react";
import Upload from "../upload/uploadData";
import model from "../../lib/gemini.js";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const { theme } = useContext(ThemeContext);
  const placeholderClasses = theme === "dark"
    ? "bg-neutral-800 text-white placeholder-gray-400"
    : "bg-slate-200 text-black placeholder-gray-600";
  const buttonClasses = theme === "dark"
    ? "bg-neutral-800 text-white hover:bg-neutral-600"
    : "bg-slate-200 text-black hover:bg-slate-300";
  const newFormClasses = theme === "dark" ? "bg-neutral-700" : "bg-white";
  const userBg = theme === "light" ? "bg-slate-300" : "bg-neutral-700";

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {}, // Stores image data from the upload
    aiData: {}, // Stores AI-related image data, if any
  });

  const chatHistory = data?.history?.map(({ role, parts, img }) => ({
    role: role || "user",
    parts: [{ text: parts?.[0]?.text || "" }],
    img, // Include image data if available in history
  })) || [
    {
      role: "user",
      parts: [{ text: "Hello, how can I help you?" }],
    },
  ];

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {},
  });

  const queryClient = useQueryClient();
  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [img.dbData, img.isLoading, question, answer, data]);

  // Optimistically add the new message to the local data
  const mutation = useMutation({
    mutationFn: () => {
      // Prepare the message body, attaching `img` if present
      const messageBody = {
        question: question.length ? question : undefined,
        answer,
        img: img.dbData?.filePath || undefined, // Attach img only if there's a valid file path
      };

      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageBody),
      }).then((res) => res.json());
    },
    onMutate: async () => {
      await queryClient.cancelQueries(["chat", data._id]);

      const previousChatData = queryClient.getQueryData(["chat", data._id]);

      // Optimistically update chat history with question, answer, and img if present
      queryClient.setQueryData(["chat", data._id], (oldData) => ({
        ...oldData,
        history: [
          ...oldData.history,
          {
            role: "user",
            parts: [{ text: question }],
            img: img.dbData?.filePath || null, // Only attach img here
          },
          { role: "model", parts: [{ text: answer }] },
        ],
      }));

      // Reset input fields and `img` state after message is sent
      formRef.current.reset();
      setQuestion("");
      setAnswer("");
      setImg({
        isLoading: false,
        error: "",
        dbData: {}, // Clear dbData so the image doesn't persist in future messages
        aiData: {},
      });

      return { previousChatData };
    },
    onError: (err, variables, context) => {
      console.error("Error updating chat:", err);
      queryClient.setQueryData(["chat", data._id], context.previousChatData);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        accumulatedText += chunk.text();
        setAnswer(accumulatedText);
      }

      mutation.mutate();
    } catch (err) {
      console.log("Error in sendMessageStream:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text, false);
    e.target.text.value = "";
  };

    // Initial chat run (if the chat has no history yet)
    const hasRun = useRef(false);
    useEffect(() => {
      if (!hasRun.current) {
        if (data?.history?.length === 1) {
          add(data.history[0].parts[0].text, true);
        }
        hasRun.current = true;
      }
    }, [data]);

  return (
    <>
      {img.isLoading && (
        <div className={`flex items-center justify-center p-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
          <span className="ml-3">Loading . . .</span>
        </div>
      )}

      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData.filePath}
          width="380"
          transformation={[{ width: 380, quality: 80, format: "webp", progressive: true }]}
          className="mt-4 mb-4"
        />
      )}

      {question && (
        <div className={`message user p-5 rounded-3xl max-w-[90%] self-end ml-auto ${userBg}`}>
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
        className={`newForm flex items-center w-6/12 gap-3 max-w-2xl px-4 py-2 rounded-full absolute -bottom-2 ${newFormClasses}`}
        onSubmit={handleSubmit}
        ref={formRef}
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
