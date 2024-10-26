import './dashboardLayout.css'
import { Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import ChatList from '../../Components/ChatList';
import ThemeContext from '../../ThemeContext';

const DashBoardLayout = () => {
    const { theme } = useContext(ThemeContext)
    const contentBg = theme === 'light' ? 'bg-slate-200' : 'bg-neutral-800';
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && !userId) {
            navigate('/sign-in');
        }
    }, [isLoaded, userId, navigate]);

    if (!isLoaded) return 'Loading';

    return (
        <div className="dashboardLayout flex gap-3 pt-5 h-screen">
            <div className="menu flex-none w-56">
                <ChatList />
            </div>
            <div className={`content flex-grow p-5 overflow-y-auto ${contentBg} `}>
                <Outlet />
            </div>
        </div>
    );
};

export default DashBoardLayout;
