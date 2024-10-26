import './chatList.css'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import ThemeContext from '../ThemeContext';


const ChatList = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <div className='chatList flex flex-col he-full '>
            <span className='title'> DASHBOARD</span>
            <Link to='/dashboard'>Create a new Chat</Link>
            <Link to='/'>Explore DeepMind</Link>
            <Link to='/'>Contact</Link>
            <hr className='border-none h-0.5 bg-slate-50 opacity-10 rounded-sm m-5'/>
            <div className='list'>
                <Link to='/'>Chat Title</Link>
                <Link to='/'>Chat Title</Link>
                <Link to='/'>Chat Title</Link>
                <Link to='/'>Chat Title</Link>
                <Link to='/'>Chat Title</Link>
                <Link to='/'>Chat Title</Link>
                <Link to='/'>Chat Title</Link>
                <Link to='/'>Chat Title</Link>
                <Link to='/'>Chat Title</Link>
                <Link to='/'>Chat Title</Link>
            </div>
            <hr/>
            <div className='upgrade flex items-start justify-start gap-0'>
                <img src={ theme === 'light'? '/logo-dark.png' : '/logo-light.png'} alt=''
                    className='bg-white rounded-full p-1 w-6 h-6'
                />
                <div className='texts flex flex-col items-center justify-center'>
                    <span>Upgrade to DeepMind Pro</span>
                    <span>Get unlimited access to all features</span> 
                </div>
            </div>
        </div>
    );
};




export default ChatList;
