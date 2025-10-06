import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import ClockImg from '../../assets/images/clock.png';
import DartImg from '../../assets/images/dart.png';
import LampImg from '../../assets/images/lamp.png';
import TabbedRecommendations from '../TabbedRecommendations';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Ambil data user yang sedang login
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        // 2. Ambil data prediksi terakhir dari user tersebut
        const { data: predictionData, error } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single(); // .single() untuk mengambil satu objek, bukan array

        if (error && error.code !== 'PGRST116') { // Abaikan error jika tidak ada baris ditemukan
          console.error('Error fetching prediction:', error);
        } else {
          setLastPrediction(predictionData);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return <div className="text-center p-12">Memuat data dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Sambutan */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Selamat Datang!</h1>
        <p className="text-lg text-gray-600 mt-2">
          Siap untuk memulai perjalanan tidur sehat Anda, {user?.user_metadata.full_name}?
        </p>
      </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Riwayat Prediksi Terakhir</h2>
          {lastPrediction ? (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Tanggal Prediksi</p>
                  <p className="font-medium text-gray-700">{formatDate(lastPrediction.created_at)}</p>
                </div>
                <span 
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    lastPrediction.predicted_result === 'Baik' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {lastPrediction.predicted_result}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800">Kualitas Tidur: {lastPrediction.predicted_result}</h3>
                <p className="text-gray-600 mt-2">
                  Rekomendasi kami berdasarkan nilai tertinggi dari hasil dibawah ini.
                </p>
              </div>
              <div className='mt-6 grid grid-cols-8 text-center'>
                <div className='text-start'>
                  <p className='text-sm text-gray-500'>Component</p>
                  <p className='text-sm text-gray-500 mt-2'>Score</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>C1</p>
                  <p className='font-medium text-gray-700 mt-2'>{lastPrediction.c1}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>C2</p>
                  <p className='font-medium text-gray-700 mt-2'>{lastPrediction.c2}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>C3</p>
                  <p className='font-medium text-gray-700 mt-2'>{lastPrediction.c3}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>C4</p>
                  <p className='font-medium text-gray-700 mt-2'>{lastPrediction.c4}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>C5</p>
                  <p className='font-medium text-gray-700 mt-2'>{lastPrediction.c5}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>C6</p>
                  <p className='font-medium text-gray-700 mt-2'>{lastPrediction.c6}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>C7</p>
                  <p className='font-medium text-gray-700 mt-2'>{lastPrediction.c7}</p>
                </div>
              </div>
              <div className='mt-6 flex items-center gap-x-6'>
                <p className='text-sm text-gray-500'>Total PSQI Score:</p>
                <p className='text-xl font-bold text-gray-800'>{lastPrediction.c1 + lastPrediction.c2 + lastPrediction.c3 + lastPrediction.c4 + lastPrediction.c5 + lastPrediction.c6 + lastPrediction.c7}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center border border-dashed">
              <h3 className="text-xl font-semibold text-gray-700">Belum Ada Riwayat</h3>
              <p className="text-gray-500 mt-2">Anda belum pernah mengisi kuesioner. Mulai sekarang untuk melihat hasilnya di sini.</p>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 h-full flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Mulai Tes Baru</h2>
            <p className="text-gray-600 mb-6">
              Isi kuesioner PSQI untuk mendapatkan analisis dan rekomendasi terbaru mengenai pola tidur Anda.
            </p>
            <Link 
              to="/kuesioner"
              className="w-full text-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Mulai Test
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Rekomendasi Tidur */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Rekomendasi Tidur Berdasarkan Komponen</h2>
        <TabbedRecommendations />
      </div>

    </div>
  );
};

export default UserDashboard;