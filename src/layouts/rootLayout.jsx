import './rootLayout.css'
import React from 'react';
import PropTypes from 'prop-types';
import { Link, Outlet } from 'react-router-dom'



const RootLayout = () => {
    return (
        <div className='flex flex-col pt-5 pb-5 pr-10 pl-10 h-screen'>
            <header>
           <Link to='/' className='flex items-center fw-bold gap-8px'>
           <img src='/logo.png' alt='' className='w-32px h-32px'/>
           <span >DeepMind</span> 
           </Link> 
           <div>
            User
           </div>
        </header>
        <main className='flex-1 overflow-hidden bg-black'>
            <Outlet/>
        </main>
        </div>
    );
};


RootLayout.propTypes = {

};


export default RootLayout;
