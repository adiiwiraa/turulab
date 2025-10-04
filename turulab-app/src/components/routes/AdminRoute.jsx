import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const AdminRoute = ({ session, children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session]);

  if (loading) {
    return <div>Memeriksa otorisasi...</div>;
  }

  if (!session) {
    // Jika tidak login, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== 'admin') {
    // Jika login tapi bukan admin, arahkan ke dashboard user
    return <Navigate to="/dashboard" replace />;
  }

  // Jika login dan adalah admin, tampilkan halaman
  return children;
};

export default AdminRoute;