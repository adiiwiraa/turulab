import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    nim: "",
    email: "",
    jenis_kelamin: "",
    angkatan: "",
    program_studi: "",
    no_telepon: "",
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          toast.error("User tidak ditemukan. Silakan login kembali.");
          navigate("/login");
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (profileData) {
          setIsAdmin(profileData.role === "admin");
          setProfile({
            full_name: profileData.full_name || "",
            nim: profileData.nim || "",
            email: profileData.email || user.email || "",
            jenis_kelamin: profileData.jenis_kelamin || "",
            angkatan: profileData.angkatan || "",
            program_studi: profileData.program_studi || "",
            no_telepon: profileData.no_telepon || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Gagal memuat data profil: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User tidak ditemukan. Silakan login kembali.");
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          nim: profile.nim,
          email: profile.email,
          jenis_kelamin: profile.jenis_kelamin,
          angkatan: profile.angkatan,
          program_studi: profile.program_studi,
          no_telepon: profile.no_telepon || null,
        })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui profil: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-12">
        <p>Memuat data profil...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profil Saya</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nama Lengkap
            </label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              disabled={isAdmin}
              required
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Nama Lengkap"
            />
          </div>

          <div>
            <label
              htmlFor="nim"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              NIM (Nomor Induk Mahasiswa)
            </label>
            <input
              id="nim"
              type="text"
              name="nim"
              value={profile.nim}
              onChange={handleChange}
              disabled={isAdmin}
              required
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Contoh: 2110512000"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={isAdmin}
              required
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="anda@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="jenis_kelamin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Jenis Kelamin
            </label>
            <select
              id="jenis_kelamin"
              name="jenis_kelamin"
              value={profile.jenis_kelamin}
              onChange={handleChange}
              disabled={isAdmin}
              required
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="angkatan"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Angkatan
            </label>
            <select
              id="angkatan"
              name="angkatan"
              value={profile.angkatan}
              onChange={handleChange}
              disabled={isAdmin}
              required
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="" disabled>
                Pilih Angkatan
              </option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="program_studi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Program Studi
            </label>
            <select
              id="program_studi"
              name="program_studi"
              value={profile.program_studi}
              onChange={handleChange}
              disabled={isAdmin}
              required
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="" disabled>
                Pilih Program Studi
              </option>
              <option value="S1 Sistem Informasi">S1 Sistem Informasi</option>
              <option value="S1 Informatika">S1 Informatika</option>
              <option value="S1 Sains Data">S1 Sains Data</option>
              <option value="D3 Sistem Informasi">D3 Sistem Informasi</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="no_telepon"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              No. Telepon{" "}
              <span className="text-gray-400 text-xs">(Opsional)</span>
            </label>
            <input
              id="no_telepon"
              type="text"
              name="no_telepon"
              value={profile.no_telepon}
              onChange={handleChange}
              disabled={isAdmin}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Contoh: 081234567890"
            />
          </div>

          {isAdmin && (
            <p className="text-sm text-yellow-600">
              Pengguna admin tidak dapat mengedit profil di halaman ini.
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving || isAdmin}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isAdmin
                ? "Edit Dinonaktifkan"
                : saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
