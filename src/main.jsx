import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import Homepage from './routes/homepage/Homepage'
import DashboardPage from './routes/dashboardPage/DashboardPage';
import ChatPage from './routes/chatPage/ChatPage'
import RootLayout from './layouts/rootLayout'
import DashBoardLayout from './layouts/dashboardLayout/dashBoardLayout'
import SignInPage from './routes/signinPage/signInPage'
import SignUpPage from './routes/signupPage/signUpPage'


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Homepage />
      },
      {
        path: '/sign-in/*',
        element: <SignInPage />
      },
      {
        path: '/sign-up/*',
        element: <SignUpPage />
      },
      {
        element:<DashBoardLayout/>,
        children:[
          {
            path:'/dashboard',
            element:<DashboardPage/>
          },
          {
            path:'/dashboard/chats/:id',
            element:<ChatPage/>
          },

        ]
      },
      
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)