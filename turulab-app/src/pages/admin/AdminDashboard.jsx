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

  // State untuk filter semester
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Helper function untuk generate tahun ajaran options
  const getAcademicYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // Generate 5 tahun ajaran terakhir (dari tahun sekarang ke belakang)
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      years.push(`${year}/${year + 1}`);
    }
    return years;
  };

  // Helper function untuk menghitung range tanggal berdasarkan semester
  const getSemesterDateRange = (academicYear, semester) => {
    if (!academicYear || !semester) return null;

    // Parse tahun ajaran (format: "2025/2026")
    const [startYear, endYear] = academicYear.split("/").map(Number);

    if (semester === "Genap") {
      // Genap: Februari - Juli (bulan 2-7)
      return {
        start: `${startYear}-02-01T00:00:00.000Z`,
        end: `${startYear}-07-31T23:59:59.999Z`,
      };
    } else if (semester === "Ganjil") {
      // Ganjil: Agustus - Januari tahun berikutnya (bulan 8-12 tahun sekarang, bulan 1 tahun berikutnya)
      return {
        start: `${startYear}-08-01T00:00:00.000Z`,
        end: `${endYear}-01-31T23:59:59.999Z`,
      };
    }
    return null;
  };

  // Menggabungkan fetch stats dan history
  useEffect(() => {
    const fetchData = async () => {
      setLoadingStats(true);
      setLoadingHistory(true);

      const fetchStatsPromise = async () => {
        try {
          // Exclude admin dari user count
          const { count: userCount, error: userError } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .neq("role", "admin");
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
          let query = supabase
            .from("predictions")
            .select(
              `predicted_result, created_at, profiles!left ( jenis_kelamin, angkatan, program_studi )`
            )
            .order("created_at", { ascending: false });

          // Filter berdasarkan semester jika dipilih
          if (selectedAcademicYear) {
            if (selectedSemester) {
              // Filter per semester (6 bulan)
              const dateRange = getSemesterDateRange(
                selectedAcademicYear,
                selectedSemester
              );
              if (dateRange) {
                query = query
                  .gte("created_at", dateRange.start)
                  .lte("created_at", dateRange.end);
              }
            } else {
              // Jika hanya tahun ajaran dipilih, filter seluruh tahun ajaran (Agustus - Juli tahun berikutnya)
              const [startYear, endYear] = selectedAcademicYear
                .split("/")
                .map(Number);
              const startDate = `${startYear}-08-01T00:00:00.000Z`;
              const endDate = `${endYear}-07-31T23:59:59.999Z`;
              query = query
                .gte("created_at", startDate)
                .lte("created_at", endDate);
            }
          }

          const { data: historyData, error: historyError } = await query;
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
  }, [selectedAcademicYear, selectedSemester]);

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
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Visualisasi Data Prediksi
          </h2>

          {/* Filter Semester */}
          <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              <label
                htmlFor="filter-academic-year"
                className="text-sm font-medium text-gray-700"
              >
                Tahun Ajaran:
              </label>
              <select
                id="filter-academic-year"
                value={selectedAcademicYear}
                onChange={(e) => {
                  setSelectedAcademicYear(e.target.value);
                  // Reset semester jika tahun ajaran diubah
                  if (!e.target.value) {
                    setSelectedSemester("");
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-white"
              >
                <option value="">Semua Tahun</option>
                {getAcademicYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="filter-semester"
                className="text-sm font-medium text-gray-700"
              >
                Semester:
              </label>
              <select
                id="filter-semester"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedAcademicYear}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Semua Semester</option>
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>
        </div>
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
