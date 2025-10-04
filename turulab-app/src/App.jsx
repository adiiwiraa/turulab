import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';

import PublicRoute from './components/routes/PublicRoute';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import UserDashboard from './pages/user/UserDashboard';
import QuestionnaireForm from './pages/user/QuestionnaireForm';
import ResultsPage from './pages/user/ResultsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserListPage from './pages/admin/UserListPage';
import UserHistoryPage from './pages/admin/UserHistoryPage';
import UserLayout from './components/user/UserLayout';

// const UserDashboard = () => <div className="text-center"><h1>Dashboard Pengguna</h1></div>;
// const AdminDashboard = () => <div className="text-center"><h1>Dashboard Admin</h1></div>;
// const QuestionnaireForm = () => <div className="text-center"><h1>Form Kuesioner</h1></div>;
const NotFound = () => <div className="text-center"><h1>404 - Halaman Tidak Ditemukan</h1></div>;

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Memuat Aplikasi...</p></div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Route Publik */}
        <Route element={<Layout session={session} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute session={session}><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute session={session}><RegisterPage /></PublicRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Route User */}
        <Route element={<UserLayout session={session} />}>
          <Route path="/dashboard" element={<PrivateRoute session={session}><UserDashboard /></PrivateRoute>} />
          <Route path="/kuesioner" element={<PrivateRoute session={session}><QuestionnaireForm /></PrivateRoute>} />
          <Route path="/hasil" element={<PrivateRoute session={session}><ResultsPage /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Route Admin */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute session={session}>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="history" element={<UserHistoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
