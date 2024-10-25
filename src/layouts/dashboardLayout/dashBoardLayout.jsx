import { Outlet } from 'react-router-dom';
import './dashboardLayout.css'
import React from 'react';

const DashBoardLayout = () => {
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
