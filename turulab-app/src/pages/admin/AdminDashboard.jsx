import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ClockImg from '../../assets/images/clock.png';
import DartImg from '../../assets/images/dart.png';
import LampImg from '../../assets/images/lamp.png';
import TabbedRecommendations from '../TabbedRecommendations';

const StatCard = ({ title, value, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    {loading ? (
      <p className="text-3xl font-semibold text-gray-800 mt-2">Memuat...</p>
    ) : (
      <p className="text-3xl font-semibold text-gray-800 mt-2">{value}</p>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, predictions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Ambil jumlah total pengguna
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Ambil jumlah total prediksi
      const { count: predictionCount } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true });

      setStats({ users: userCount, predictions: predictionCount });
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className='space-y-6'>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className='bg-white p-4 rounded-lg shadow-md border border-gray-200'>
          <p className='text-gray-400'>
            <span className='text-primary font-bold'>Prediction</span> | Prediction in just seconds
          </p>
          <div className='flex gap-x-3 mt-3'>
            <div className='w-3/5 h-auto flex justify-center items-center'>
              <img src={ClockImg} alt="" className='h-20'/>
            </div>
            <div>
              <p className='text-lg font-bold text-primary'>Under 1 Seconds</p>
              <p className='text-gray-600 mt-2 text-sm'>
                <span className='text-green-700 font-semibold'>The advantages</span> of quick predictions include faster decision-making and improved user experience.
              </p>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md border border-gray-200'>
          <p className='text-gray-400'>
            <span className='text-primary font-bold'>Accuracy</span> | Prediction model accuracy
          </p>
          <div className='flex gap-x-3 mt-3'>
            <div className='w-3/5 h-auto flex justify-center items-center'>
              <img src={DartImg} alt="" className='h-20'/>
            </div>
            <div>
              <p className='text-lg font-bold text-primary'>Accuracy 88%</p>
              <p className='text-gray-600 mt-2 text-sm'>
                <span className='text-green-700 font-semibold'>Ability to identify</span> sleep patterns effectively.
              </p>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md border border-gray-200'>
          <p className='text-gray-400'>
            <span className='text-primary font-bold'>How</span> | How It Works
          </p>
          <div className='flex gap-x-3 mt-3'>
            <div className='w-3/5 h-auto flex justify-center items-center'>
              <img src={LampImg} alt="" className='h-20'/>
            </div>
            <div>
              <p className='text-lg font-bold text-primary'>Click "Smart Prediction"</p>
              <p className='text-gray-600 mt-2 text-sm'>
                <span className='text-green-700 font-semibold'>Fill out</span> the PSQI questionnaire to get your sleep quality prediction.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Rekomendasi Tidur Berdasarkan Komponen</h2>
        <TabbedRecommendations />
      </div>
      
    </div>
  );
};

export default AdminDashboard;