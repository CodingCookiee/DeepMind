import './chatList.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import ThemeContext from '../ThemeContext';

const ChatList = () => {
    const { theme } = useContext(ThemeContext);
    const hoverBg = theme === 'light' ? 'hover:bg-slate-200' : 'hover:bg-neutral-800';

    return (
        <div className="chatList flex flex-col p-5 h-5/6">
            <span className="title font-semibold text-xs mb-2.5">DASHBOARD</span>
            <hr className="border-none h-0.5 bg-slate-50 opacity-10 rounded-sm mb-5" />

            <span className="title font-semibold text-xs mb-2.5">RECENT CHATS</span>
            <div className="list flex flex-col overflow-y-auto flex-grow h-full">
                {Array.from({ length: 20 }).map((_, idx) => (
                    <Link key={idx} to="/" className={`p-2.5 rounded-xl ${hoverBg}`}>
                        Chat Title {idx + 1}
                    </Link>
                ))}
            </div>
            <hr className="border-none h-0.5 bg-slate-50 opacity-10 rounded-sm mt-5 mb-5" />
          
            <div className="upgrade -mb-16 mt-auto flex items-center gap-2 text-xs ">
                <img
                    src={theme === 'light' ? '/logo-dark.png' : '/logo-light.png'}
                    alt=""
                    className="rounded-full w-6 h-6 p-1 bg-white mb-8"
                />
                <div className="texts flex flex-col gap-1">
                    <span className="font-semibold">Upgrade to DeepMind Pro</span>
                    <span className="text-slate-300">Get unlimited access to all features</span>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
