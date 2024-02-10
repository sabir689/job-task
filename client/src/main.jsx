import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Roots from './Roots/Roots';
import Home from './Pages/Home/Home';
import Task from './Pages/Tasks/Task';
import TaskCollect from './Pages/Tasks/TaskCollect';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots></Roots>,
    children:[
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/addTask",
        element: <Task></Task>
      },
      {
        path: "/taskCollect",
        element: <TaskCollect></TaskCollect>
      }

    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>,
)
