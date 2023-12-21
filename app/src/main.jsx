import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CreateApplication from './routes/CreateApplication';
import ErrorPage from './routes/Error.tsx';
import ResumeApplication, { loader as applicationLoader } from './routes/ResumeApplication.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateApplication />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/application/:id",
    element: <ResumeApplication />,
    loader: applicationLoader,
  },
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px]">
        <RouterProvider router={router} />
      </div>
    </div>
  </React.StrictMode >,
)
