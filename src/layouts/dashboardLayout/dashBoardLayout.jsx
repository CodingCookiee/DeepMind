import { Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import ChatList from '../../Components/ChatList';

const DashBoardLayout = () => {
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
            <div className="content flex-grow bg-gray-900 p-5 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default DashBoardLayout;
