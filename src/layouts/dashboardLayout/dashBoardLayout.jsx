import { Outlet, useNavigate } from 'react-router-dom';
import './dashboardLayout.css'
import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const DashBoardLayout = () => {
    const { userId, isLoaded } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && !userId) {
            navigate('/sign-in');
        }
    }, [isLoaded, userId, navigate]);

    if(!isLoaded) return 'Loading';

    return (
        <div className='dashboardLayout'>
            <div className='menu'>
                Menu
            </div>
            <div className='content'>
                <Outlet/>
            </div>
        </div>
    );
}

export default DashBoardLayout;
