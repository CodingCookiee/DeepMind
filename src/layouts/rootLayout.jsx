import './rootLayout.css'
import React from 'react';
import PropTypes from 'prop-types';
import { Link, Outlet } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react';
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/clerk-react';



const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <div className='flex flex-col pt-5 pb-5 pr-10 pl-10 h-screen'>
            <header className='flex items-center justify-between'>
           <Link to='/' className='flex items-center fw-bold gap-10px'>
           <img src='/logo.png' alt='' />
           <span>DeepMind</span> 
           </Link> 
           <div>
           <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
           </div>
        </header>
        <main className='flex-1 overflow-hidden'>
            <Outlet/>
        </main>
        </div>
        </ClerkProvider>
    );
};


RootLayout.propTypes = {

};


export default RootLayout;
