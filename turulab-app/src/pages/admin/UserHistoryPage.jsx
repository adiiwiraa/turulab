import React, { useState, useEffect } from 'react';
import PredictedResultChart from '../../components/PredictedResultChart';
import PredictedResultPieChart from '../../components/PredictedResultPieChart';
import PredictedResultCountChart from '../../components/PredictedResultCountChart';
import PredictedResultByAngkatanChart from '../../components/PredictedResultByAngkatanChart';
import { supabase } from '../../lib/supabaseClient';

const UserHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 900);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      let query = supabase
        .from('predictions')
        .select(`
          id,
          jenis_kelamin,
          no_telepon,
          angkatan,
          program_studi,
          p1_usual_bed_time,
          p2_sleep_latency,
          p3_usual_wake_time,
          p4_sleep_duration,
          p5_1,
          p5_2,
          p5_3,
          p5_4,
          p5_5,
          p5_6,
          p5_7,
          p5_8,
          p5_9,
          p5_10,
          answer_p5_10,
          p6,
          p7,
          p8,
          p9,
          created_at,
          predicted_result,
          profiles (
            full_name,
            email,
            nim
          )
        `)
        .order('created_at', { ascending: false });

      // If there is a search term, filter by user name or email
      if (debouncedSearch && debouncedSearch.trim() !== '') {
        const term = `%${debouncedSearch.trim()}%`;
        query = query.or('profiles.full_name.ilike.' + term + ',profiles.email.ilike.' + term);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching history:', error);
      } else {
        setHistory(data || []);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [debouncedSearch]);

  const downloadCSV = () => {
    const headers = [
      'ID Prediksi', 
      // 'Tanggal', 
      'Nama Pengguna', 
      'Email', 
      'Nim',
      'Jenis Kelamin',
      'No Telepon',
      'Angkatan',
      'Program Studi',
      'P1',
      'P2',
      'P3',
      'P4',
      'P5_1',
      'P5_2',
      'P5_3',
      'P5_4',
      'P5_5',
      'P5_6',
      'P5_7',
      'P5_8',
      'P5_9',
      'P5_10',
      'Answer P5_10',
      'P6',
      'P7',
      'P8',
      'P9',
      'Hasil Prediksi'
    ];
    const csvContent = [
      headers.join(','),
      ...history.map(item => [
        item.id,
        // new Date(item.created_at).toLocaleString('id-ID'),
        item.profiles.full_name,
        item.profiles.email,
        item.profiles.nim,
        item.jenis_kelamin,
        item.no_telepon,
        item.angkatan,
        item.program_studi,
        item.p1_usual_bed_time,
        item.p2_sleep_latency,
        item.p3_usual_wake_time,
        item.p4_sleep_duration,
        item.p5_1,
        item.p5_2,
        item.p5_3,
        item.p5_4,
        item.p5_5,
        item.p5_6,
        item.p5_7,
        item.p5_8,
        item.p5_9,
        item.p5_10,
        item.answer_p5_10,
        item.p6,
        item.p7,
        item.p8,
        item.p9,
        item.predicted_result
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'riwayat_prediksi.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return <div>Memuat riwayat prediksi...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Prediksi Pengguna</h1>
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
        >
          Unduh CSV
        </button>
      </div>

      <div className='bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8'>
        <PredictedResultCountChart history={history} />
      </div>
      <div className='bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8'>
        <PredictedResultChart history={history} />
      </div>
      <div className='bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8'>
        <PredictedResultByAngkatanChart history={history} />
      </div>
      <div className='bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8'>
        <PredictedResultPieChart history={history} />
      </div>
      

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-primary">Data Riwayat Prediksi</p>
          <form onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </form>
        </div>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Pengguna</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hasil Prediksi</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(item.created_at).toLocaleString('id-ID')}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div>{item.profiles.full_name}</div>
                  <div className="text-xs text-gray-500">{item.profiles.email}</div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                    item.predicted_result === 'Baik' 
                      ? 'bg-green-200 text-green-900' 
                      : 'bg-red-200 text-red-900'
                  }`}>
                    {item.predicted_result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserHistoryPage;