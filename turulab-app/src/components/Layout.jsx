import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ session }) => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} /> 
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;