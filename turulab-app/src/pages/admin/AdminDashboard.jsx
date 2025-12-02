import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";

// Components Imports
import PredictedResultChart from "../../components/PredictedResultChart";
import PredictedResultPieChart from "../../components/PredictedResultPieChart";
import PredictedResultCountChart from "../../components/PredictedResultCountChart";
import PredictedResultByAngkatanChart from "../../components/PredictedResultByAngkatanChart";
import TabbedRecommendations from "../TabbedRecommendations";

// =========================================
// 1. SUB-COMPONENTS
// =========================================

/**
 * Komponen Kartu Statistik Sederhana
 */
const StatCard = ({ title, value, loading, subtitle }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
      {title}
    </h3>
    {loading ? (
      <div className="mt-2 h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
    ) : (
      <div className="mt-2">
        <p className="text-3xl font-semibold text-gray-800">{value ?? "0"}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    )}
  </div>
);

// =========================================
// 2. MAIN COMPONENT
// =========================================

const AdminDashboard = () => {
  // =========================================
  // 3. STATE MANAGEMENT
  // =========================================

  const [stats, setStats] = useState({ users: 0, predictions: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // State Filter Waktu
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // =========================================
  // 4. HELPER FUNCTIONS
  // =========================================

  const getAcademicYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      years.push(`${year}/${year + 1}`);
    }
    return years;
  };

  const getSemesterDateRange = (academicYear, semester) => {
    if (!academicYear || !semester) return null;
    const [startYear, endYear] = academicYear.split("/").map(Number);

    if (semester === "Genap") {
      return {
        start: `${endYear}-02-01T00:00:00.000Z`,
        end: `${endYear}-07-31T23:59:59.999Z`,
      };
    } else if (semester === "Ganjil") {
      return {
        start: `${startYear}-08-01T00:00:00.000Z`,
        end: `${endYear}-01-31T23:59:59.999Z`,
      };
    }
    return null;
  };

  // =========================================
  // 5. DATA FETCHING (EFFECTS)
  // =========================================

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStats(true);
      setLoadingHistory(true);

      // --- 1. SIAPKAN LOGIKA FILTER TANGGAL (GLOBAL) ---
      // Kita hitung dulu startDate dan endDate di sini agar bisa dipakai
      // oleh STATS (Kartu) dan HISTORY (Grafik) secara bersamaan.

      let filterStart = null;
      let filterEnd = null;
      let filterDescription = "Sepanjang Waktu"; // Untuk subtitle kartu

      if (selectedAcademicYear) {
        if (selectedSemester) {
          // Filter Semester Spesifik
          const dateRange = getSemesterDateRange(
            selectedAcademicYear,
            selectedSemester
          );
          if (dateRange) {
            filterStart = dateRange.start;
            filterEnd = dateRange.end;
            filterDescription = `${selectedSemester} ${selectedAcademicYear}`;
          }
        } else {
          // Filter Satu Tahun Ajaran Penuh (Agustus - Juli)
          const [startYear, endYear] = selectedAcademicYear
            .split("/")
            .map(Number);
          filterStart = `${startYear}-08-01T00:00:00.000Z`;
          filterEnd = `${endYear}-07-31T23:59:59.999Z`;
          filterDescription = `TA ${selectedAcademicYear}`;
        }
      }

      // --- 2. FETCH STATISTICS (KARTU ATAS) ---
      const fetchStatsPromise = async () => {
        try {
          // Query Dasar User
          let userQuery = supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .neq("role", "admin");

          // Query Dasar Prediksi
          let predQuery = supabase
            .from("predictions")
            .select("*", { count: "exact", head: true });

          // TERAPKAN FILTER TANGGAL KE STATISTIK
          if (filterStart && filterEnd) {
            userQuery = userQuery
              .gte("created_at", filterStart)
              .lte("created_at", filterEnd);

            predQuery = predQuery
              .gte("created_at", filterStart)
              .lte("created_at", filterEnd);
          }

          const { count: userCount, error: userError } = await userQuery;
          if (userError) throw userError;

          const { count: predictionCount, error: predictionError } =
            await predQuery;
          if (predictionError) throw predictionError;

          setStats({
            users: userCount,
            predictions: predictionCount,
            periodLabel: filterDescription,
          });
        } catch (error) {
          console.error("Error fetching stats:", error);
          toast.error(`Gagal memuat statistik: ${error.message}`);
          setStats({ users: 0, predictions: 0 });
        } finally {
          setLoadingStats(false);
        }
      };

      // --- 3. FETCH HISTORY (GRAFIK BAWAH) ---
      const fetchHistoryPromise = async () => {
        try {
          let query = supabase
            .from("predictions")
            .select(
              `predicted_result, created_at, profiles!left ( jenis_kelamin, angkatan, program_studi )`
            )
            .order("created_at", { ascending: false });

          // TERAPKAN FILTER TANGGAL KE HISTORY
          if (filterStart && filterEnd) {
            query = query
              .gte("created_at", filterStart)
              .lte("created_at", filterEnd);
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

  // =========================================
  // 6. RENDER UI
  // =========================================

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>

      {/* --- SECTION 1: KARTU STATISTIK (Dinamis) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          title={
            selectedAcademicYear
              ? "Pengguna Baru (Terfilter)"
              : "Total Pengguna"
          }
          value={stats.users}
          loading={loadingStats}
          subtitle={stats.periodLabel}
        />
        <StatCard
          title={
            selectedAcademicYear ? "Prediksi (Terfilter)" : "Total Prediksi"
          }
          value={stats.predictions}
          loading={loadingStats}
          subtitle={stats.periodLabel}
        />
      </div>

      {/* --- SECTION 2: GRAFIK VISUALISASI --- */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Visualisasi Data Prediksi
          </h2>

          {/* Filter Bar */}
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
                  if (!e.target.value) setSelectedSemester("");
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

        {/* Chart Containers */}
        {loadingHistory ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-64 flex justify-center items-center text-gray-400"
              >
                Memuat Grafik...
              </div>
            ))}
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
              Belum ada data prediksi untuk periode {stats.periodLabel} ini.
            </p>
          </div>
        )}
      </div>

      {/* --- SECTION 3: REKOMENDASI UMUM --- */}
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
