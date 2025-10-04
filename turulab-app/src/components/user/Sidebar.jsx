import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white h-screen flex flex-col shadow-lg">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-primary">TuruLab</h1>
      </div>
      <nav className="flex-grow px-4">
        <ul>
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center p-3 my-2 rounded-lg transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-slate-100 text-primary font-bold'
                  : 'text-gray-500 hover:bg-gray-100 font-semibold'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              <span className="ml-4">Dashboard</span>
            </Link>
          </li>
          <li>
            <span className='px-3 text-sm font-semibold text-gray-400'>PAGES</span>
          </li>
          <li>
            <Link
              to="/kuesioner"
              className={`flex items-center p-3 my-2 rounded-lg transition-colors ${
                location.pathname === '/kuesioner'
                  ? 'bg-slate-100 text-primary font-bold'
                  : 'text-gray-500 hover:bg-gray-100 font-semibold'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span className="ml-4">Smart Prediction</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
              </svg>
              <span className="font-semibold ml-4">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
      {/* <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <span className="font-medium">Logout</span>
        </button>
      </div> */}
    </aside>
  );
};

export default Sidebar;