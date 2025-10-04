import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Komponen ini berfungsi untuk melindungi rute yang seharusnya hanya bisa diakses
 * oleh pengguna yang SUDAH login.
 * Jika pengguna belum login (tidak ada session), maka akan diarahkan ke halaman login.
 */
const PrivateRoute = ({ session, children }) => {
  const location = useLocation();

  if (!session) {
    // Jika tidak ada sesi aktif, arahkan pengguna ke halaman login.
    // Kita juga menyimpan lokasi halaman yang ingin diakses agar bisa kembali setelah login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika ada sesi, tampilkan komponen anak (halaman yang dilindungi).
  return children;
};

export default PrivateRoute;