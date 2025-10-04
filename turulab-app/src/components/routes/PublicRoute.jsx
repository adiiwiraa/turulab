import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ session, children }) => {
  if (session) {
    // Jika ada sesi aktif, arahkan pengguna ke dashboard.
    // 'replace' digunakan agar pengguna tidak bisa kembali ke halaman login/register via tombol back browser.
    return <Navigate to="/dashboard" replace />;
  }

  // Jika tidak ada sesi, tampilkan komponen anak (halaman yang diminta).
  return children;
};

export default PublicRoute;
