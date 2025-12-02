import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/ConfirmationModal";

/**
 * Halaman Daftar Pengguna (User List)
 * Menampilkan daftar mahasiswa terdaftar dengan fitur pencarian, filter, dan hapus.
 * Admin di-exclude dari daftar ini untuk keamanan.
 */
const UserListPage = () => {
  // =========================================
  // 1. STATE MANAGEMENT
  // =========================================

  // Data State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedAngkatan, setSelectedAngkatan] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // =========================================
  // 2. HELPER FUNCTIONS & OPTIONS
  // =========================================

  // Debounce search input (mencegah request berlebih saat mengetik)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 900);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset ke halaman 1 jika filter/search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedAngkatan, selectedProdi]);

  // Generate opsi 5 tahun terakhir untuk dropdown Angkatan
  const getAngkatanOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 6; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  // Opsi Program Studi
  const getProdiOptions = () => {
    return [
      "S1 Sistem Informasi",
      "S1 Informatika",
      "S1 Sains Data",
      "D3 Sistem Informasi",
    ];
  };

  // =========================================
  // 3. DATA FETCHING (SUPABASE)
  // =========================================

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    // Base Query: Ambil semua profil kecuali Admin
    let query = supabase
      .from("profiles")
      .select(
        "id, full_name, email, role, created_at, nim, jenis_kelamin, angkatan, program_studi"
      )
      .neq("role", "admin") // Safety: Admin tidak boleh muncul/dihapus di sini
      .order("created_at", { ascending: false });

    // Apply Filter Search (Nama, Email, NIM, Prodi)
    if (debouncedSearch && debouncedSearch.trim() !== "") {
      const term = `%${debouncedSearch.trim()}%`;
      query = query.or(
        `full_name.ilike.${term},email.ilike.${term},nim.ilike.${term},program_studi.ilike.${term}`
      );
    }

    // Apply Filter Angkatan
    if (selectedAngkatan) {
      query = query.eq("angkatan", selectedAngkatan);
    }

    // Apply Filter Program Studi
    if (selectedProdi) {
      query = query.eq("program_studi", selectedProdi);
    }

    // Execute Query
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat pengguna: " + error.message);
      setUsers([]);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }, [debouncedSearch, selectedAngkatan, selectedProdi]);

  // Trigger fetch saat filter berubah
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // =========================================
  // 4. PAGINATION LOGIC
  // =========================================

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // =========================================
  // 5. ACTION HANDLERS
  // =========================================

  const handleDeleteUser = (userId, userFullName) => {
    setUserToDelete({ id: userId, fullName: userFullName });
    setIsModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    const toastId = toast.loading(
      `Menghapus pengguna "${userToDelete.fullName}" secara permanen...`
    );

    try {
      // Memanggil RPC function di Supabase (Stored Procedure) untuk hapus bersih
      const { error } = await supabase.rpc("delete_user_completely", {
        target_user_id: userToDelete.id,
      });

      if (error) throw error;

      setIsModalOpen(false);
      const deletedUserName = userToDelete.fullName;
      setUserToDelete(null);

      toast.success(`Pengguna "${deletedUserName}" berhasil dihapus.`, {
        id: toastId,
      });

      // Refresh data tanpa reload halaman
      fetchUsers();
    } catch (error) {
      console.error("Gagal menghapus:", error);
      setIsModalOpen(false);
      toast.error(`Gagal menghapus: ${error.message || error.details}`, {
        id: toastId,
      });
    }
  };

  // =========================================
  // 6. RENDER UI
  // =========================================

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Memuat daftar pengguna...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Pengguna</h1>
      </div>

      {/* --- CARD 1: FILTER & SEARCH --- */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative z-10">
        <p className="font-semibold text-primary mb-4">
          Total {users.length} mahasiswa terdaftar
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Angkatan */}
          <div className="flex items-center gap-2">
            <select
              value={selectedAngkatan}
              onChange={(e) => setSelectedAngkatan(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-white text-sm"
            >
              <option value="">Semua Angkatan</option>
              {getAngkatanOptions().map((year) => (
                <option key={year} value={year}>
                  Angkatan {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Prodi */}
          <div className="flex items-center gap-2">
            <select
              value={selectedProdi}
              onChange={(e) => setSelectedProdi(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-white text-sm"
            >
              <option value="">Semua Program Studi</option>
              {getProdiOptions().map((prodi) => (
                <option key={prodi} value={prodi}>
                  {prodi}
                </option>
              ))}
            </select>
          </div>

          {/* Input Search */}
          <div className="flex-1 min-w-[250px]">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Cari nama, email, NIM, atau prodi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-sm"
              />
            </form>
          </div>
        </div>
      </div>

      {/* --- CARD 2: TABEL & PAGINATION --- */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden relative z-0 flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-grow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Identitas (Nama/Email)
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  NIM
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Prodi
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Angkatan
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  L/P
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <div className="font-bold text-gray-800">
                        {user.full_name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      {user.nim || "-"}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      {user.program_studi || "-"}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      {user.angkatan || "-"}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      {user.jenis_kelamin || "-"}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <button
                        onClick={() =>
                          handleDeleteUser(user.id, user.full_name)
                        }
                        className="text-red-600 hover:text-red-900 font-medium text-xs border border-red-200 px-3 py-1 rounded transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-400 italic bg-gray-50"
                  >
                    Tidak ada mahasiswa ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {users.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Menampilkan {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, users.length)} dari {users.length}{" "}
              mahasiswa
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Prev
              </button>

              {/* Logic Nomor Halaman (Max 3 tombol) */}
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Konfirmasi Hapus Pengguna"
      >
        Anda yakin ingin menghapus pengguna{" "}
        <strong className="px-1">{userToDelete?.fullName}</strong>?
        <br />
        <span className="text-red-500 text-sm">
          Data yang dihapus tidak dapat dikembalikan.
        </span>
      </ConfirmationModal>
    </div>
  );
};

export default UserListPage;
