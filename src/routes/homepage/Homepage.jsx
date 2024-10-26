import "./homepage.css";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import ThemeContext from "../../ThemeContext";
import { TypeAnimation } from "react-type-animation";

const Homepage = () => {
  const { theme } = useContext(ThemeContext);
  const orbitalOpacity = theme === "dark" ? 0.05 : 0.3;
  const bgColorClass = theme === "light" ? "bg-transparent" : "bg-slate-950";
  const bgOpacity = theme === "light" ? "opacity-100" : "opacity-50";
  const [typingStatus, setTypingStatus] = useState('Human1')
  return (
    <div className="homepage flex items-center gap-28 h-screen relative ">
      <img
        src="/orbital.png"
        alt=""
        className="orbital absolute bottom-0 left-0 z-0"
        style={{ opacity: orbitalOpacity }}
      />
      <div className="left flex-1 flex flex-col items-center justify-center gap-4 text-center relative z-10">
        <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-fuchsia-500">
          Deep Mind
        </h1>
        <h2 className="font-bold">
          Creativity and Productivity at Your Fingertips
        </h2>
        <h3>
          Smart, reliable, and always available – that's your AI assistant.
          Discover, create, and accomplish more with the help of your AI
          assistant. From casual chats to complex questions, explore endless
          ideas and get answers instantly.
        </h3>
        <Link
          to="/dashboard"
          className="pt-3 pb-3 pr-7 pl-7 bg-indigo-500 rounded-2xl font-normal mt-5 hover:bg-white hover:text-indigo-500 hover:border-indigo-500 border z-10"
        >
          Get Started
        </Link>
      </div>
      <div className="right flex-1 flex items-center h-full relative z-10">
        <div
          className={`imgContainer flex items-center justify-center rounded-2xl h-2/4 w-4/5 ${bgColorClass} relative`}
        >
          <div className="bgContainer absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
            <div
              className={`bg bg-contain bg-center bg-repeat-x ${bgOpacity}`}
            ></div>
          </div>
          <img
            src="/bot.png"
            alt=""
            className="bot h-full w-full object-contain"
          />
          <div className="chat absolute  
          flex items-center gap-2 p-5 bg-slate-900 rounded-2xl">
          <img src={typingStatus === 'Human1' ? '/human1.jpeg' : typingStatus === 'Human2' ? '/human2.jpeg' : '/bot.png'} alt="" className="w-8 h-8 rounded-2xl object-cover	"/>
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                  "How can I boost my productivity with AI assistance?",
                  2000, ()=>{
                    setTypingStatus('Bot')
                },
                // wait 1s before replacing "Mice" with "Hamsters"
                "Leverage AI to streamline tasks and get instant answers.",
                2000, ()=>{
                    setTypingStatus('Human2')
                },
                "Can AI help me generate creative ideas?",
                2000, ()=>{
                    setTypingStatus('Bot')
                },
                "Absolutely, AI sparks fresh ideas and unique perspectives.",
                2000, ()=>{
                    setTypingStatus('Human1')
                }
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className='terms absolute bottom-20 left-2/4	-translate-x-2/4
      flex flex-col items-center gap-1'>
        <img src="/logo-light.png" alt="" className="bg-white rounded-full p-1	 w-7 h-7"/>
        <div className="links flex gap-1 text-gray-400">
            <Link to='/' className="font-extralight text-xs	">Terms of Service</Link>
            <span></span>
            <Link to='/' className="font-extralight text-xs	">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};
export default Homepage;
