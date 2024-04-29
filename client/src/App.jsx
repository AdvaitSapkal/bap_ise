import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <ToastContainer
            position="top-center"
            autoClose={1500}
            limit={2}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="light"
          />
          <>
            <NavBar />
            <Outlet />
          </>
        </>
      ),
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/home',
          element: <Home />
        },
        // {
        //   path: '/dashboard',
        //   element: <Dashboard />
        // },
      ]
    }
  ]);

  return (
    <AnimatePresence >
      <div className="h-full w-full bg-[#E6E6FA]">
        <RouterProvider router={router} />
      </div>
    </AnimatePresence>
  )

}

export default App
