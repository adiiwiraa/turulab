import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import ConfirmationModal from "../../components/ConfirmationModal";
import toast from "react-hot-toast";

const UserHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // State untuk filter waktu
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictionToDelete, setPredictionToDelete] = useState(null);

  // Helper function untuk generate tahun options (dari tahun terbaru ke tahun lama)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // Generate 10 tahun terakhir
    for (let i = 0; i < 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  // Helper function untuk generate bulan options
  const getMonthOptions = () => {
    return [
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
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 900);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fungsi untuk mengambil data riwayat
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("predictions")
      .select(
        `
        id,
        p1_usual_bed_time, p2_sleep_latency, p3_usual_wake_time, p4_sleep_duration,
        p5_1, p5_2, p5_3, p5_4, p5_5, p5_6, p5_7, p5_8, p5_9, p5_10, answer_p5_10,
        p6, p7, p8, p9, created_at, predicted_result,
        c1, c2, c3, c4, c5, c6, c7,
        profiles!left ( full_name, email, nim, jenis_kelamin, angkatan, program_studi, no_telepon )
      `
      )
      .order("created_at", { ascending: false });

    // Filter berdasarkan waktu (Tahun dan Bulan)
    if (selectedYear && selectedMonth) {
      // Filter untuk bulan tertentu di tahun tertentu
      const startDate = `${selectedYear}-${selectedMonth}-01T00:00:00.000Z`;
      // Hitung hari terakhir bulan dengan benar (bulan berikutnya, hari 0)
      const lastDay = new Date(
        parseInt(selectedYear),
        parseInt(selectedMonth),
        0
      ).getDate();
      const endDate = `${selectedYear}-${selectedMonth}-${String(
        lastDay
      ).padStart(2, "0")}T23:59:59.999Z`;
      query = query.gte("created_at", startDate).lte("created_at", endDate);
    } else if (selectedYear) {
      // Filter untuk seluruh tahun
      const startDate = `${selectedYear}-01-01T00:00:00.000Z`;
      const endDate = `${selectedYear}-12-31T23:59:59.999Z`;
      query = query.gte("created_at", startDate).lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching history:", error);
      toast.error("Gagal memuat riwayat: " + error.message);
      setHistory([]);
    } else {
      let filteredData = data || [];

      // Filter di client-side untuk semua field (Nama, Email, Angkatan, Program Studi)
      // Ini diperlukan karena Supabase tidak mendukung .or() dengan field relasi dan tabel utama sekaligus
      if (debouncedSearch && debouncedSearch.trim() !== "") {
        const searchTerm = debouncedSearch.trim().toLowerCase();
        filteredData = filteredData.filter((item) => {
          const fullName = item.profiles?.full_name?.toLowerCase() || "";
          const email = item.profiles?.email?.toLowerCase() || "";
          const angkatan = item.profiles?.angkatan?.toLowerCase() || "";
          const programStudi =
            item.profiles?.program_studi?.toLowerCase() || "";

          return (
            fullName.includes(searchTerm) ||
            email.includes(searchTerm) ||
            angkatan.includes(searchTerm) ||
            programStudi.includes(searchTerm)
          );
        });
      }

      setHistory(filteredData);
    }
    setLoading(false);
  }, [debouncedSearch, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Fungsi untuk modal konfirmasi hapus prediksi
  const handleDeletePrediction = (predictionId, userName) => {
    setPredictionToDelete({ id: predictionId, userName: userName });
    setIsModalOpen(true);
  };

  // Fungsi yang dijalankan di modal
  const confirmDeletePrediction = async () => {
    if (!predictionToDelete) return;

    const toastId = toast.loading(
      `Menghapus prediksi milik "${predictionToDelete.userName}"...`
    );

    // Logika penghapusan Supabase
    const { error } = await supabase
      .from("predictions")
      .delete()
      .eq("id", predictionToDelete.id);

    setIsModalOpen(false);
    const deletedUserName = predictionToDelete.userName;
    setPredictionToDelete(null); // Reset state

    if (error) {
      toast.error(
        `Gagal menghapus prediksi milik "${deletedUserName}": ${error.message}`,
        { id: toastId }
      );
    } else {
      toast.success(`Prediksi milik "${deletedUserName}" berhasil dihapus.`, {
        id: toastId,
      });
      fetchHistory(); // Refresh data tabel
    }
  };

  // Fungsi untuk mengunduh CSV
  const downloadCSV = () => {
    const headers = [
      "id_prediksi",
      "nama_pengguna",
      "email",
      "nim",
      "jenis_kelamin",
      "no_telepon",
      "angkatan",
      "program_studi",
      "p1_waktu_tidur_biasa",
      "p2_latensi_tidur",
      "p3_waktu_bangun_biasa",
      "p4_durasi_tidur",
      "p5_1_tidak_bisa_tidur_30_menit",
      "p5_2_terbangun_tengah_malam",
      "p5_3_bangun_ke_kamar_mandi",
      "p5_4_tidak_bisa_bernapas_nyaman",
      "p5_5_batuk_dengkur",
      "p5_6_terlalu_dingin",
      "p5_7_terlalu_panas",
      "p5_8_mimpi_buruk",
      "p5_9_nyeri_sakit",
      "p5_10_gangguan_lain",
      "ket_gangguan_lain",
      "p6_kualitas_tidur",
      "p7_obat_tidur",
      "p8_kesulitan_aktivitas",
      "p9_masalah_semangat",
      "c1_kualitas_subjektif",
      "c2_latensi_tidur",
      "c3_durasi_tidur",
      "c4_efisiensi_tidur",
      "c5_gangguan_tidur",
      "c6_obat_tidur",
      "c7_disfungsi_siang",
      "total_psqi",
      "tanggal_tes",
      "hasil_prediksi",
    ];
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
      link.setAttribute("download", "riwayat_prediksi.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Bersihkan URL object
    }
  };

  if (loading) {
    return <div>Memuat riwayat prediksi...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Riwayat Prediksi Pengguna
        </h1>
        <button
          onClick={downloadCSV}
          disabled={history.length === 0} // Disable jika tidak ada data
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Unduh CSV
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="mb-4">
          <p className="font-semibold text-primary mb-4">
            Data Riwayat Prediksi ({history.length} data)
          </p>

          {/* Filter Waktu dan Search */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Filter Tahun */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="filter-year"
                className="text-sm font-medium text-gray-700"
              >
                Tahun:
              </label>
              <select
                id="filter-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-white"
              >
                <option value="">Semua Tahun</option>
                {getYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Bulan */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="filter-month"
                className="text-sm font-medium text-gray-700"
              >
                Bulan:
              </label>
              <select
                id="filter-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                disabled={!selectedYear}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Semua Bulan</option>
                {getMonthOptions().map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 min-w-[250px]">
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Cari nama, email, angkatan, atau program studi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
              </form>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama Pengguna
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
                  Hasil Prediksi
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {new Date(item.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div>
                        {item.profiles?.full_name || "Pengguna Dihapus"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.profiles?.email || "-"}
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {item.c1}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {item.c2}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {item.c3}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {item.c4}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {item.c5}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {item.c6}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {item.c7}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                          item.predicted_result === "Baik"
                            ? "bg-green-200 text-green-900"
                            : "bg-red-200 text-red-900"
                        }`}
                      >
                        {item.predicted_result}
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() =>
                          handleDeletePrediction(
                            item.id,
                            item.profiles?.full_name || `ID ${item.id}`
                          )
                        }
                        className="text-red-600 hover:text-red-900 font-semibold"
                        disabled={!item.profiles}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-10 text-gray-500">
                    Tidak ada data riwayat prediksi ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPredictionToDelete(null);
        }}
        onConfirm={confirmDeletePrediction}
        title="Konfirmasi Hapus Prediksi"
      >
        Anda yakin ingin menghapus data prediksi milik
        <strong className="px-1">{predictionToDelete?.userName}</strong>?
        Tindakan ini tidak dapat dibatalkan.
      </ConfirmationModal>
    </div>
  );
};

export default UserHistoryPage;
