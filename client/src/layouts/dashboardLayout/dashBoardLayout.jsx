import './dashboardLayout.css'
import { Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import ChatList from '../../Components/ChatList';
import ThemeContext from '../../ThemeContext';

const DashBoardLayout = () => {
    const { theme } = useContext(ThemeContext)
    const contentBg = theme === 'light' ? 'bg-slate-200' : 'bg-neutral-800';
    const loadingBg = theme === 'light' ? 'bg-slate-300' : 'bg-slate-700';
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && !userId) {
            navigate('/sign-in');
        }
    }, [isLoaded, userId, navigate]);

    if (!isLoaded) return (
        <div className={`border ${theme === 'light' ? 'border-gray-300' : 'border-gray-700'} shadow rounded-md p-4 max-w-sm w-full mx-auto`}>
            <div className="animate-pulse flex space-x-4">
                <div className={`rounded-full ${loadingBg} h-10 w-10`}></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className={`h-2 ${loadingBg} rounded`}></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className={`h-2 ${loadingBg} rounded col-span-2`}></div>
                            <div className={`h-2 ${loadingBg} rounded col-span-1`}></div>
                        </div>
                        <div className={`h-2 ${loadingBg} rounded`}></div>
                    </div>
                </div>
            </div>
        </div>
    );

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