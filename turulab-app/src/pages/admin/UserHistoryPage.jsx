import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import ConfirmationModal from "../../components/ConfirmationModal";
import toast from "react-hot-toast";

const UserHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictionToDelete, setPredictionToDelete] = useState(null);

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
  const fetchHistory = async () => {
    setLoading(true);
    let query = supabase
      .from("predictions")
      .select(
        `
        id, jenis_kelamin, no_telepon, angkatan, program_studi,
        p1_usual_bed_time, p2_sleep_latency, p3_usual_wake_time, p4_sleep_duration,
        p5_1, p5_2, p5_3, p5_4, p5_5, p5_6, p5_7, p5_8, p5_9, p5_10, answer_p5_10,
        p6, p7, p8, p9, created_at, predicted_result,
        c1, c2, c3, c4, c5, c6, c7,
        profiles ( full_name, email, nim )
      `
      )
      .order("created_at", { ascending: false });

    // Filter berdasarkan pencarian nama atau email
    if (debouncedSearch && debouncedSearch.trim() !== "") {
      const term = `%${debouncedSearch.trim()}%`;
      query = query.or(
        "profiles.full_name.ilike." + term + ",profiles.email.ilike." + term
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching history:", error);
      toast.error("Gagal memuat riwayat: " + error.message);
    } else {
      setHistory(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [debouncedSearch]);

  // Fungsi untuk MEMBUKA modal konfirmasi hapus prediksi
  const handleDeletePrediction = (predictionId, userName) => {
    setPredictionToDelete({ id: predictionId, userName: userName });
    setIsModalOpen(true);
  };

  // Fungsi yang dijalankan SAAT KONFIRMASI di modal
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
      "ID Prediksi",
      "Nama Pengguna",
      "Email",
      "Nim",
      "Jenis Kelamin",
      "No Telepon",
      "Angkatan",
      "Program Studi",
      "P1",
      "P2",
      "P3",
      "P4",
      "P5_1",
      "P5_2",
      "P5_3",
      "P5_4",
      "P5_5",
      "P5_6",
      "P5_7",
      "P5_8",
      "P5_9",
      "P5_10",
      "Answer P5_10",
      "P6",
      "P7",
      "P8",
      "P9",
      "C1",
      "C2",
      "C3",
      "C4",
      "C5",
      "C6",
      "C7",
      "Total PSQI",
      "Hasil Prediksi",
    ];
    const csvContent = [
      headers.join(","),
      ...history.map((item) =>
        [
          item.id,
          item.profiles?.full_name || "N/A",
          item.profiles?.email || "N/A",
          item.profiles?.nim || "N/A",
          item.jenis_kelamin,
          item.no_telepon,
          item.angkatan,
          item.program_studi,
          `"${item.p1_usual_bed_time || ""}"`,
          item.p2_sleep_latency,
          `"${item.p3_usual_wake_time || ""}"`,
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
          `"${item.answer_p5_10 || ""}"`,
          item.p6,
          item.p7,
          item.p8,
          item.p9,
          item.c1,
          item.c2,
          item.c3,
          item.c4,
          item.c5,
          item.c6,
          item.c7,
          (item.c1 || 0) +
            (item.c2 || 0) +
            (item.c3 || 0) +
            (item.c4 || 0) +
            (item.c5 || 0) +
            (item.c6 || 0) +
            (item.c7 || 0), // Handle null score
          item.predicted_result,
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
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-primary">
            Data Riwayat Prediksi ({history.length} data)
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </form>
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
