import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import PredictedResultChart from "../../components/PredictedResultChart";
import PredictedResultPieChart from "../../components/PredictedResultPieChart";
import PredictedResultCountChart from "../../components/PredictedResultCountChart";
import PredictedResultByAngkatanChart from "../../components/PredictedResultByAngkatanChart";
import TabbedRecommendations from "../TabbedRecommendations";

const StatCard = ({ title, value, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
      {title}
    </h3>
    {loading ? (
      <div className="mt-2 h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
    ) : (
      <p className="text-3xl font-semibold text-gray-800 mt-2">
        {value ?? "N/A"}
      </p>
    )}
  </div>
);

const AdminDashboard = () => {
  // State untuk statistik dasar (jumlah user & prediksi)
  const [stats, setStats] = useState({ users: null, predictions: null });
  const [loadingStats, setLoadingStats] = useState(true);

  // State untuk data riwayat (untuk grafik)
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Menggabungkan fetch stats dan history
  useEffect(() => {
    const fetchData = async () => {
      setLoadingStats(true);
      setLoadingHistory(true);

      const fetchStatsPromise = async () => {
        try {
          const { count: userCount, error: userError } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });
          if (userError) throw userError;

          const { count: predictionCount, error: predictionError } =
            await supabase
              .from("predictions")
              .select("*", { count: "exact", head: true });
          if (predictionError) throw predictionError;

          setStats({ users: userCount, predictions: predictionCount });
        } catch (error) {
          console.error("Error fetching stats:", error);
          toast.error(`Gagal memuat statistik: ${error.message}`);
          setStats({ users: "Error", predictions: "Error" });
        } finally {
          setLoadingStats(false);
        }
      };

      const fetchHistoryPromise = async () => {
        try {
          const { data: historyData, error: historyError } = await supabase
            .from("predictions")
            .select(`jenis_kelamin, angkatan, program_studi, predicted_result`)
            .order("created_at", { ascending: false });
          if (historyError) throw historyError;
          setHistory(historyData || []);
        } catch (error) {
          console.error("Error fetching history for charts:", error);
          toast.error(`Gagal memuat data grafik: ${error.message}`);
        } finally {
          setLoadingHistory(false);
        }
      };

      await Promise.all([fetchStatsPromise(), fetchHistoryPromise()]);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>

      {/* Section Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          title="Total Pengguna"
          value={stats.users}
          loading={loadingStats}
        />
        <StatCard
          title="Total Prediksi"
          value={stats.predictions}
          loading={loadingStats}
        />
      </div>

      {/* Section Grafik */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Visualisasi Data Prediksi
        </h2>
        {loadingHistory ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-64 flex justify-center items-center text-gray-400">
              Memuat Grafik...
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-64 flex justify-center items-center text-gray-400">
              Memuat Grafik...
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-64 flex justify-center items-center text-gray-400">
              Memuat Grafik...
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-64 flex justify-center items-center text-gray-400">
              Memuat Grafik...
            </div>
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
              <PredictedResultCountChart history={history} />
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
              <PredictedResultChart history={history} />
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
              <PredictedResultByAngkatanChart history={history} />
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
              <PredictedResultPieChart history={history} />
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center border border-dashed border-gray-300">
            <p className="text-gray-500">
              Belum ada data prediksi untuk ditampilkan dalam grafik.
            </p>
          </div>
        )}
      </div>

      {/* Section Rekomendasi */}
      <div className="mt-8 mb-15">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Rekomendasi Tidur Umum
        </h2>
        <TabbedRecommendations />
      </div>
    </div>
  );
};

export default AdminDashboard;
