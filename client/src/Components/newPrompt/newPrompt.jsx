// newPrompt.js
import "./newPrompt.css";
import React, { useContext, useRef, useEffect, useState } from "react";
import ThemeContext from "../../ThemeContext";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import Upload from "../upload/Upload";

const NewPrompt = () => {
  const [img, setImg] = useState({
    isLoading: false,
    error: false,
    dbData: {},
  });

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
        className="mt-4"
      />
      <div className="endChat p-10" ref={endRef}></div>
      <form
        className={`newForm flex items-center w-6/12 gap-3 max-w-2xl 
                px-4 py-2 rounded-full absolute -bottom-2 ${newFormClasses}`}
      >
        {/* <label
          htmlFor="file"
          className="border-none rounded-3xl p-1 flex items-center justify-center cursor-pointer"
        >
          <img
            src={theme === "light" ? "/attach-dark.png" : "/attach-light.png"}
            alt=""
            className="w-6 h-6"
          />
        </label> */}
        <Upload setImg={setImg} />
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
