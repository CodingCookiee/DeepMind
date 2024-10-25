import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './routes/homepage/Homepage'
import DashboardPage from './routes/dashboardPage/DashboardPage';
import ChatPage from './routes/chatPage/ChatPage'
import RootLayout from './layouts/rootLayout'
import DashBoardLayout from './layouts/dashboardLayout/dashBoardLayout'



const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Homepage />
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