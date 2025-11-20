import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "../components/Sidebar";

function PrivateLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default PrivateLayout;