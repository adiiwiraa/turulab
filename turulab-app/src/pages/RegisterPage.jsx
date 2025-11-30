import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [programStudi, setProgramStudi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Buat user di auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            nim: nim,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // 2. Buat/update profile dengan data lengkap
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          email: email,
          nim: nim,
          full_name: fullName,
          jenis_kelamin: jenisKelamin,
          angkatan: angkatan,
          program_studi: programStudi,
          role: "user",
        });

        if (profileError) {
          throw profileError;
        }

        toast.success("Pendaftaran berhasil!");
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Gagal mendaftar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 bg-gray-50 min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Buat Akun Baru
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              htmlFor="nim"
              className="block text-sm font-medium text-gray-700"
            >
              NIM (Nomor Induk Mahasiswa)
            </label>
            <input
              id="nim"
              type="text"
              required
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contoh: 2110512000"
            />
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Lengkap
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nama Anda"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="anda@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="jenisKelamin"
              className="block text-sm font-medium text-gray-700"
            >
              Jenis Kelamin
            </label>
            <select
              id="jenisKelamin"
              required
              value={jenisKelamin}
              onChange={(e) => setJenisKelamin(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="angkatan"
              className="block text-sm font-medium text-gray-700"
            >
              Angkatan
            </label>
            <select
              id="angkatan"
              required
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              htmlFor="programStudi"
              className="block text-sm font-medium text-gray-700"
            >
              Program Studi
            </label>
            <select
              id="programStudi"
              required
              value={programStudi}
              onChange={(e) => setProgramStudi(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border bg-primary border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-blue-500"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
