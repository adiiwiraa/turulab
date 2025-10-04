import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800">
      <div className="container mx-auto px-5 py-14">
        <div className="flex flex-wrap md:text-left text-center order-first">
          {/* Kolom Brand dan Deskripsi */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-2xl mb-3">
              TuruLab
            </h2>
            <p className="text-gray-800 text-sm">
              Membantu Anda memahami dan meningkatkan kualitas tidur melalui teknologi cerdas.
            </p>
          </div>
          
          {/* Kolom Navigasi */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 mt-10 md:mt-0">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">NAVIGASI</h2>
            <nav className="list-none mb-10 space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
              <li><a href="#about" className="text-gray-600 hover:text-blue-600">Tentang</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-blue-600">Fitur</a></li>
            </nav>
          </div>
          
          {/* Kolom Legal (jika perlu) */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">LEGAL</h2>
            <nav className="list-none mb-10 space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Syarat & Ketentuan</a></li>
            </nav>
          </div>
          
        </div>
      </div>
      
      {/* Bagian Bawah Footer (Copyright & Social Media) */}
      <div className="bg-gray-900 bg-opacity-50">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            © 2025 TuruLab — Hak Cipta Dilindungi
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            <a href="#" className="text-gray-400 hover:text-white">
              <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="ml-3 text-gray-400 hover:text-white">
              <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a href="#" className="ml-3 text-gray-400 hover:text-white">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;