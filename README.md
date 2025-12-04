# 🌙 TuruLab

![Project Status](https://img.shields.io/badge/Status-Active-green) ![Tech Stack](https://img.shields.io/badge/Stack-Fullstack-blue)

**TuruLab** adalah aplikasi web prediksi yang dirancang untuk membantu Anda memahami kualitas tidur menggunakan standar klinis **PSQI (Pittsburgh Sleep Quality Index)** yang diperkuat dengan kecerdasan buatan.

Aplikasi ini tidak hanya memprediksi apakah kualitas tidur Anda "Baik" atau "Buruk", tetapi juga memberikan wawasan mendalam serta rekomendasi perbaikan yang dipersonalisasi berdasarkan komponen tidur PSQI.

---

## 🌟 Fitur Unggulan

- Menggunakan algoritma **Random Forest Classifier** untuk menghasilkan analisis cerdas dengan akurasi tinggi.
- Menyediakan antarmuka pengisian **Kuesioner PSQI** yang interaktif dan mudah digunakan oleh siapa saja.
- Memberikan **saran tindakan spesifik** berdasarkan komponen masalah tidur yang terdeteksi pada pengguna.
- Menyajikan **Dashboard Admin** yang lengkap untuk visualisasi data demografi dan tren tidur pengguna.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan arsitektur **Monorepo** modern yang efisien:

| Kategori     | Teknologi                                                                         | Kegunaan                                                              |
| :----------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| **Runtime**  | **[Bun](https://bun.sh)**                                                         | Menangani manajemen paket dan menjalankan script dengan sangat cepat. |
| **Frontend** | **[React + Vite](https://vitejs.dev)**                                            | Membangun antarmuka pengguna yang responsif.                          |
| **Styling**  | **[Tailwind CSS](https://tailwindcss.com)**                                       | Mendesain tampilan aplikasi yang modern.                              |
| **Backend**  | **[Python](https://www.python.org/) [Flask](https://flask.palletsprojects.com/)** | Menyediakan API untuk melayani model Machine Learning.                |
| **ML Model** | **[Scikit-learn](https://scikit-learn.org/)**                                     | Melakukan klasifikasi prediksi (Random Forest).                       |
| **Database** | **[Supabase](https://supabase.com)**                                              | Menyimpan data pengguna dan riwayat kuesioner.                        |

---

## 📂 Struktur Folder

```text
turulab/
├── package.json          # Pengontrol Utama (Script instalasi & runner)
├── turulab-app/          # Source code Frontend (React App)
├── turulab-backend/      # Source code Backend (Flask API & ML Model)
├── .gitignore
└── README.md
```

---

## 🚀 Panduan Cepat

Kami telah menyederhanakan proses instalasi. Anda tidak perlu mengatur frontend dan backend satu per satu secara manual.

### 1\. Prasyarat Sistem

Pastikan perangkat Anda telah terpasang:

- **[Bun](https://bun.sh/)** (Wajib untuk otomatisasi script).
- **Python 3.8+** (Wajib untuk backend).
- **Git**.

### 2\. Instalasi Otomatis

Jalankan perintah berikut di folder utama (`root`). Script ini akan otomatis mengunduh dependensi Frontend serta menyiapkan Virtual Environment untuk Backend.

```bash
bun install
```

_\> Harap tunggu hingga proses instalasi modul React dan pustaka Python selesai._

### 3\. Menjalankan Aplikasi

Setelah instalasi sukses, nyalakan seluruh sistem dengan satu perintah:

```bash
bun run start
```

Terminal akan menampilkan log dari dua layanan sekaligus:

- **Frontend** dapat diakses di `http://localhost:5173`
- **Backend API** berjalan di `http://127.0.0.1:5000`

---

## 🔌 Dokumentasi API

Bagian ini digunakan jika Anda ingin melakukan pengujian model prediksi secara manual tanpa melalui antarmuka website.

**Endpoint Target**
`POST /predict`

**Format Request (JSON)**

```json
{
  "P1": "23:00:00",
  "P2": 30,
  "P3": "05:00:00",
  "P4": 6.5,
  "P5_1": 1,
  "P5_2": 1,
  "P5_3": 0,
  "P5_4": 0,
  "P5_5": 0,
  "P5_6": 0,
  "P5_7": 0,
  "P5_8": 1,
  "P5_9": 0,
  "P5_10": 0,
  "P6": 2,
  "P7": 0,
  "P8": 1,
  "P9": 1
}
```

**Format Response**

```json
{
  "kualitas_tidur_prediksi": "Buruk",
  "komponen_tertinggi": "C3",
  "scores": { "C1": 1, "C2": 2, "C3": 3, ... }
}
```

---

<center>
  Dibuat dengan ❤️ untuk para pejuang tidur nyenyak.
</center>
