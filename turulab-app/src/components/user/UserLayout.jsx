import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '../Header';

// Halaman-halaman publik yang tidak menggunakan layout sidebar
const publicPages = ['/', '/login', '/register'];

const UserLayout = ({ session }) => {
  const location = useLocation();

  if (!session || publicPages.includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#edf2f7]">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;