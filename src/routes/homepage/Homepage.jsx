import './homepage.css';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ThemeContext from '../../ThemeContext';

const Homepage = () => {
    const { theme } = useContext(ThemeContext);
    const orbitalOpacity = theme === 'dark' ? 0.05 : 0.3; 
    const bgColorClass = theme === 'light' ? 'bg-transparent' : 'bg-slate-900';
    const bgOpacity = theme === 'light'? 'opacity-0' : 'opacity-30' 
    return (
        <div className="main-container flex items-center gap-28 h-screen relative">
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
                    Discover, create, and accomplish more with the help of your AI assistant.
                    From casual chats to complex questions, explore endless ideas and get answers instantly.
                </h3>
                <Link
                    to="/dashboard"
                    className="pt-3 pb-3 pr-7 pl-7 bg-indigo-500 rounded-2xl font-normal mt-5 hover:bg-white hover:text-indigo-500 hover:border-indigo-500 border z-10"
                >
                    Get Started
                </Link>
            </div>
            <div className="right flex-1 flex items-center h-full relative z-10">
                <div className={`imgContainer flex items-center justify-center rounded-2xl h-2/4 w-4/5 ${bgColorClass}`}>
                    <div className="bgContainer absolute top-0 left-0 overflow-hidden w-full h-full rounded-2xl">
                        <div className={`bg bg-clip-content ${bgOpacity}	`}></div>
                    </div>
                    <img src="/bot.png" alt="" className="bot h-full w-full object-contain" />
                </div>
            </div>
        </div>
    );
};

export default Homepage;
