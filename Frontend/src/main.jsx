import React from 'react'; // 👈 Add this import
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PhotoUpload from './pages/PhotoUpload.jsx';
import Header from './components/custom/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PestsideStore from './pages/PesticideStore.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/photo-upload',
    element: <PhotoUpload />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/pesticide-store',
    element: <PestsideStore />,
  }
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>  
    <Header />
    <RouterProvider router={router} />
  </React.StrictMode>
);