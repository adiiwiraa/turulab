import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import ConfirmationModal from "../../components/ConfirmationModal";
import toast from "react-hot-toast";

/**
 * Halaman Riwayat Prediksi (User History)
 * * Fitur Utama:
 * 1. Menampilkan daftar riwayat prediksi tidur pengguna.
 * 2. Filter Lanjutan:
 * - Mode Kalender: Filter Multi-Select Tahun & Bulan.
 * - Mode Akademik: Filter berdasarkan Tahun Ajaran & Semester.
 * 3. Pencarian (Search) nama, NIM, atau prodi.
 * 4. Pagination (10 item per halaman).
 * 5. Download Laporan CSV dinamis sesuai filter.
 * 6. Hapus Data (Admin Only).
 */

const UserHistoryPage = () => {
  // =========================================
  // 1. STATE MANAGEMENT
  // =========================================

  // Data State
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filter Mode State ('calendar' | 'academic')
  const [filterMode, setFilterMode] = useState("calendar");

  // State: Mode Kalender (Multi-Select)
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // State: Mode Akademik (Single Select)
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictionToDelete, setPredictionToDelete] = useState(null);

  // =========================================
  // 2. HELPER FUNCTIONS & OPTIONS
  // =========================================

  // Generate opsi 6 tahun terakhir untuk filter tahun
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 6; i++) {
      years.push(String(currentYear - i));
    }
    return years;
  };

  // Generate opsi Tahun Ajaran (Format: 2024/2025)
  const getAcademicYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      years.push(`${year}/${year + 1}`);
    }
    return years;
  };

  // Opsi Bulan Statis
  const monthOptions = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  // Logic Tanggal Akademik (Semester Ganjil vs Genap)
  // Penting: Memastikan Genap mengambil tahun kedua dari format YYYY/YYYY
  const getSemesterDateRange = (academicYear, semester) => {
    if (!academicYear) return null;
    const [startYear, endYear] = academicYear.split("/").map(Number);

    if (semester === "Genap") {
      // Genap: Februari - Juli di TAHUN KEDUA
      return {
        start: `${endYear}-02-01T00:00:00.000Z`,
        end: `${endYear}-07-31T23:59:59.999Z`,
      };
    } else if (semester === "Ganjil") {
      // Ganjil: Agustus (Tahun 1) - Januari (Tahun 2)
      return {
        start: `${startYear}-08-01T00:00:00.000Z`,
        end: `${endYear}-01-31T23:59:59.999Z`,
      };
    } else {
      // Full Tahun Ajaran
      return {
        start: `${startYear}-08-01T00:00:00.000Z`,
        end: `${endYear}-07-31T23:59:59.999Z`,
      };
    }
  };

  // Helper untuk Toggle Selection pada Multi-Dropdown
  const toggleSelection = (value, state, setState) => {
    setState((prev) => {
      if (prev.includes(value)) return prev.filter((item) => item !== value);
      return [...prev, value];
    });
  };

  // =========================================
  // 3. EFFECTS (DEBOUNCE & RESET)
  // =========================================

  // Debounce search input untuk performa
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 900);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset Pagination ke Halaman 1 jika ada filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    filterMode,
    selectedYears,
    selectedMonths,
    selectedAcademicYear,
    selectedSemester,
  ]);

  // =========================================
  // 4. MAIN DATA FETCHING
  // =========================================

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("predictions")
      .select(
        `
        id, p1_usual_bed_time, p2_sleep_latency, p3_usual_wake_time, p4_sleep_duration,
        p5_1, p5_2, p5_3, p5_4, p5_5, p5_6, p5_7, p5_8, p5_9, p5_10, answer_p5_10,
        p6, p7, p8, p9, created_at, predicted_result,
        c1, c2, c3, c4, c5, c6, c7,
        profiles!left ( full_name, email, nim, jenis_kelamin, angkatan, program_studi, no_telepon )
      `
      )
      .order("created_at", { ascending: false });

    // --- FILTER LOGIC (SERVER-SIDE PRE-FILTERING) ---
    if (filterMode === "academic") {
      // Logic Akademik: Filter Range Tanggal Spesifik
      if (selectedAcademicYear) {
        const range = getSemesterDateRange(
          selectedAcademicYear,
          selectedSemester
        );
        if (range) {
          query = query
            .gte("created_at", range.start)
            .lte("created_at", range.end);
        }
      }
    } else {
      // Logic Kalender: Filter Range Tahun Kasar (Min-Max)
      if (selectedYears.length > 0) {
        const yearsNum = selectedYears.map(Number);
        const minYear = Math.min(...yearsNum);
        const maxYear = Math.max(...yearsNum);
        const startDate = `${minYear}-01-01T00:00:00.000Z`;
        const endDate = `${maxYear}-12-31T23:59:59.999Z`;
        query = query.gte("created_at", startDate).lte("created_at", endDate);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching history:", error);
      toast.error("Gagal memuat riwayat: " + error.message);
      setHistory([]);
    } else {
      let filteredData = data || [];

      // --- FILTER LOGIC (CLIENT-SIDE) ---

      // 1. Search Filter (Nama, Email, NIM, Prodi)
      if (debouncedSearch && debouncedSearch.trim() !== "") {
        const searchTerm = debouncedSearch.trim().toLowerCase();
        filteredData = filteredData.filter((item) => {
          const fullName = item.profiles?.full_name?.toLowerCase() || "";
          const email = item.profiles?.email?.toLowerCase() || "";
          const nim = item.profiles?.nim?.toLowerCase() || "";
          const prodi = item.profiles?.program_studi?.toLowerCase() || "";
          return (
            fullName.includes(searchTerm) ||
            email.includes(searchTerm) ||
            nim.includes(searchTerm) ||
            prodi.includes(searchTerm)
          );
        });
      }

      // 2. Calendar Specific Filter (Exact Match untuk Multi-Select Tahun & Bulan)
      if (filterMode === "calendar") {
        if (selectedYears.length > 0) {
          filteredData = filteredData.filter((item) => {
            if (!item.created_at) return false;
            const yearStr = String(new Date(item.created_at).getFullYear());
            return selectedYears.includes(yearStr);
          });
        }
        if (selectedMonths.length > 0) {
          filteredData = filteredData.filter((item) => {
            if (!item.created_at) return false;
            const monthStr = String(
              new Date(item.created_at).getMonth() + 1
            ).padStart(2, "0");
            return selectedMonths.includes(monthStr);
          });
        }
      }

      setHistory(filteredData);
    }
    setLoading(false);
  }, [
    debouncedSearch,
    filterMode,
    selectedYears,
    selectedMonths,
    selectedAcademicYear,
    selectedSemester,
  ]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // =========================================
  // 5. PAGINATION LOGIC
  // =========================================

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // =========================================
  // 6. ACTION HANDLERS
  // =========================================

  // Setup Modal Hapus
  const handleDeletePrediction = (predictionId, userName) => {
    setPredictionToDelete({ id: predictionId, userName: userName });
    setIsModalOpen(true);
  };

  // Eksekusi Hapus ke Supabase
  const confirmDeletePrediction = async () => {
    if (!predictionToDelete) return;
    const toastId = toast.loading(`Menghapus prediksi...`);
    const { error } = await supabase
      .from("predictions")
      .delete()
      .eq("id", predictionToDelete.id);
    setIsModalOpen(false);
    setPredictionToDelete(null);
    if (error) {
      toast.error(`Gagal: ${error.message}`, { id: toastId });
    } else {
      toast.success(`Berhasil dihapus.`, { id: toastId });
      fetchHistory();
    }
  };

  // Generate CSV File
  const downloadCSV = () => {
    let filename = "laporan_hasil_prediksi";
    // Nama file dinamis berdasarkan filter
    if (filterMode === "academic" && selectedAcademicYear) {
      const sem = selectedSemester
        ? `_${selectedSemester.toLowerCase()}`
        : "_full";
      filename += `_ta_${selectedAcademicYear.replace("/", "-")}${sem}`;
    } else if (filterMode === "calendar") {
      filename += "_mode_kalender";
    }

    const headers = [
      "id_prediksi",
      "nama_pengguna",
      "email",
      "nim",
      "jenis_kelamin",
      "no_telepon",
      "angkatan",
      "program_studi",
      "p1_waktu_tidur",
      "p2_latensi",
      "p3_waktu_bangun",
      "p4_durasi",
      "p5_1",
      "p5_2",
      "p5_3",
      "p5_4",
      "p5_5",
      "p5_6",
      "p5_7",
      "p5_8",
      "p5_9",
      "p5_10",
      "ket_lain",
      "p6",
      "p7",
      "p8",
      "p9",
      "c1",
      "c2",
      "c3",
      "c4",
      "c5",
      "c6",
      "c7",
      "total_psqi",
      "tanggal_tes",
      "hasil_prediksi",
    ];

    // Download FULL data (sesuai filter), bukan hanya yang tampil di halaman pagination
    const csvContent = [
      headers.join(","),
      ...history.map((item) =>
        [
          item.id || "",
          `"${item.profiles?.full_name || "N/A"}"`,
          `"${item.profiles?.email || "N/A"}"`,
          `"${item.profiles?.nim || "N/A"}"`,
          `"${item.profiles?.jenis_kelamin || ""}"`,
          `"${item.profiles?.no_telepon || ""}"`,
          `"${item.profiles?.angkatan || ""}"`,
          `"${item.profiles?.program_studi || ""}"`,
          `"${item.p1_usual_bed_time || ""}"`,
          item.p2_sleep_latency ?? "",
          `"${item.p3_usual_wake_time || ""}"`,
          item.p4_sleep_duration ?? "",
          item.p5_1 ?? "",
          item.p5_2 ?? "",
          item.p5_3 ?? "",
          item.p5_4 ?? "",
          item.p5_5 ?? "",
          item.p5_6 ?? "",
          item.p5_7 ?? "",
          item.p5_8 ?? "",
          item.p5_9 ?? "",
          item.p5_10 ?? "",
          `"${item.answer_p5_10 || ""}"`,
          item.p6 ?? "",
          item.p7 ?? "",
          item.p8 ?? "",
          item.p9 ?? "",
          item.c1 ?? "",
          item.c2 ?? "",
          item.c3 ?? "",
          item.c4 ?? "",
          item.c5 ?? "",
          item.c6 ?? "",
          item.c7 ?? "",
          (item.c1 || 0) +
            (item.c2 || 0) +
            (item.c3 || 0) +
            (item.c4 || 0) +
            (item.c5 || 0) +
            (item.c6 || 0) +
            (item.c7 || 0),
          `"${item.created_at ? new Date(item.created_at).toISOString() : ""}"`,
          `"${item.predicted_result || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Prediksi</h1>
        <button
          onClick={downloadCSV}
          disabled={history.length === 0}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>📥</span> Unduh Laporan CSV
        </button>
      </div>

      {/* --- CARD FILTER UTAMA --- */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative z-10">
        {/* Header & Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-100 pb-4 gap-4">
          <p className="font-semibold text-primary">
            Filter Data ({history.length} baris ditemukan)
          </p>

          {/* TAB SWITCHER: Kalender vs Akademik */}
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setFilterMode("calendar")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filterMode === "calendar"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📅 Periode Kalender
            </button>
            <button
              onClick={() => setFilterMode("academic")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filterMode === "academic"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🎓 Tahun Ajaran
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-4">
          {/* --- OPSI 1: MODE KALENDER (Multi-Select Tahun & Bulan) --- */}
          {filterMode === "calendar" && (
            <>
              {/* Filter Tahun (Multi-Dropdown) */}
              <div className="relative">
                <button
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between min-w-[140px] text-sm text-gray-700"
                >
                  <span className="truncate">
                    {selectedYears.length === 0
                      ? "Semua Tahun"
                      : `${selectedYears.length} Tahun`}
                  </span>
                  <span className="ml-2 text-xs">▼</span>
                </button>
                {isYearDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2">
                    {getYearOptions().map((year) => (
                      <label
                        key={year}
                        className="flex items-center px-2 py-1.5 hover:bg-gray-50 cursor-pointer rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedYears.includes(year)}
                          onChange={() =>
                            toggleSelection(
                              year,
                              selectedYears,
                              setSelectedYears
                            )
                          }
                          className="mr-2 h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{year}</span>
                      </label>
                    ))}
                    <button
                      onClick={() => setSelectedYears([])}
                      className="text-xs text-red-500 w-full text-left mt-2 px-2 hover:underline"
                    >
                      Reset Tahun
                    </button>
                  </div>
                )}
              </div>

              {/* Filter Bulan (Multi-Dropdown) */}
              <div className="relative">
                <button
                  onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between min-w-[140px] text-sm text-gray-700"
                >
                  <span className="truncate">
                    {selectedMonths.length === 0
                      ? "Semua Bulan"
                      : `${selectedMonths.length} Bulan`}
                  </span>
                  <span className="ml-2 text-xs">▼</span>
                </button>
                {isMonthDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto p-2">
                    {monthOptions.map((m) => (
                      <label
                        key={m.value}
                        className="flex items-center px-2 py-1.5 hover:bg-gray-50 cursor-pointer rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMonths.includes(m.value)}
                          onChange={() =>
                            toggleSelection(
                              m.value,
                              selectedMonths,
                              setSelectedMonths
                            )
                          }
                          className="mr-2 h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{m.label}</span>
                      </label>
                    ))}
                    <button
                      onClick={() => setSelectedMonths([])}
                      className="text-xs text-red-500 w-full text-left mt-2 px-2 hover:underline"
                    >
                      Reset Bulan
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* --- OPSI 2: MODE AKADEMIK (Tahun Ajaran & Semester) --- */}
          {filterMode === "academic" && (
            <>
              <div className="flex items-center gap-2">
                <select
                  value={selectedAcademicYear}
                  onChange={(e) => {
                    setSelectedAcademicYear(e.target.value);
                    if (!e.target.value) setSelectedSemester("");
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-purple-300 bg-white text-sm"
                >
                  <option value="">-- Pilih Tahun Ajaran --</option>
                  {getAcademicYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  disabled={!selectedAcademicYear}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-purple-300 bg-white disabled:bg-gray-100 text-sm"
                >
                  <option value="">Semua Semester</option>
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
            </>
          )}

          {/* Search Input (Global) */}
          <div className="flex-1 min-w-[200px]">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Cari Nama, NIM, atau Prodi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-sm"
              />
            </form>
          </div>
        </div>

        {/* Footer Keterangan Mode */}
        <div className="mt-4 text-xs text-gray-400 italic">
          {filterMode === "calendar"
            ? "*Mode Kalender: Menampilkan data berdasarkan tanggal Masehi (Jan-Des)."
            : "*Mode Akademik: Ganjil (Agu-Jan), Genap (Feb-Jul)."}
        </div>
      </div>

      {/* --- CARD TABEL DATA --- */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden relative z-0 flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-grow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mahasiswa
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  C1
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  C2
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  C3
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  C4
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  C5
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  C6
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  C7
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hasil
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <div className="font-bold text-gray-800">
                        {item.profiles?.full_name || "Dihapus"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.profiles?.nim} - {item.profiles?.program_studi}
                      </div>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">
                      {item.c1}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">
                      {item.c2}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">
                      {item.c3}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">
                      {item.c4}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">
                      {item.c5}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">
                      {item.c6}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">
                      {item.c7}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <span
                        className={`px-3 py-1 font-semibold rounded-full text-xs ${
                          item.predicted_result === "Baik"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.predicted_result}
                      </span>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <button
                        onClick={() =>
                          handleDeletePrediction(
                            item.id,
                            item.profiles?.full_name
                          )
                        }
                        className="text-red-600 hover:text-red-900 font-medium text-xs border border-red-200 px-2 py-1 rounded transition-colors"
                        disabled={!item.profiles}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="text-center py-10 text-gray-400 italic bg-gray-50"
                  >
                    Tidak ada data yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {history.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Menampilkan {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, history.length)} dari {history.length}{" "}
              data
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Prev
              </button>

              {/* Pagination Numbers (Max 3 visible around current) */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, currentPage - 2),
                  Math.min(totalPages, currentPage + 1)
                )
                .map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === number
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {number}
                  </button>
                ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPredictionToDelete(null);
        }}
        onConfirm={confirmDeletePrediction}
        title="Hapus Data Prediksi"
      >
        Anda yakin ingin menghapus data milik{" "}
        <strong>{predictionToDelete?.userName}</strong>?
      </ConfirmationModal>
    </div>
  );
};

export default UserHistoryPage;
