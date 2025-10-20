import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); 

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 900);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Function to fetch users
  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (debouncedSearch && debouncedSearch.trim() !== '') {
      const term = `%${debouncedSearch.trim()}%`;
      query = query.or(`full_name.ilike.${term},email.ilike.${term}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Gagal memuat pengguna: ' + error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch]);


  // Fungsi untuk MEMBUKA modal konfirmasi
  const handleDeleteUser = (userId, userFullName) => {
    setUserToDelete({ id: userId, fullName: userFullName });
    setIsModalOpen(true);
  };

  // Fungsi yang dijalankan SAAT KONFIRMASI di modal
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    const toastId = toast.loading(`Menghapus pengguna "${userToDelete.fullName}"...`);

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userToDelete.id);

    setIsModalOpen(false);
    const deletedUserName = userToDelete.fullName;
    setUserToDelete(null);

    if (error) {
      toast.error(`Gagal menghapus pengguna "${deletedUserName}": ${error.message}`, { id: toastId });
    } else {
      toast.success(`Pengguna "${deletedUserName}" berhasil dihapus.`, { id: toastId });
      fetchUsers(); // Refresh data
    }
  };


  if (loading) {
    return <div>Memuat daftar pengguna...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Pengguna</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-primary">Total {users.length} pengguna ditemukan</p>
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
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Lengkap</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal Bergabung</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.full_name}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${user.role === 'admin' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.full_name)}
                      className="text-red-600 font-bold hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                 <td colSpan="5" className="text-center py-10 text-gray-500">Tidak ada pengguna ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => { 
          setIsModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Konfirmasi Hapus Pengguna"
      >
        Anda yakin ingin menghapus pengguna <strong className='px-1'>{userToDelete?.fullName}</strong>? Tindakan ini tidak dapat dibatalkan.
      </ConfirmationModal>
    </div>
  );
};

export default UserListPage;