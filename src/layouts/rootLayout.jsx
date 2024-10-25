import './rootLayout.css';
import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react';
import ThemeContext from '../ThemeContext';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const RootLayout = () => {
    const { theme } = useContext(ThemeContext);
    const logoSrc = theme === 'dark' ? '/logo-light.png' : '/logo-dark.png';
    const logoStyles = {
        backgroundColor: theme === 'dark' ? '#ffffff' : '#0000',
        padding: '5px',
        borderRadius: '50px',
      };
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <div
        className="flex flex-col pt-5 pb-5 pr-10 pl-10 h-screen"
      >
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center font-bold gap-10px">
            <img style={logoStyles} src={logoSrc} alt="DeepMind Logo" />
            <span className="font-medium font-sans">DeepMind</span>
          </Link>
          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </ClerkProvider>
  );
};export default RootLayout;
