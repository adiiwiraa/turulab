# TuruLab: Aplikasi Web Prediksi Kualitas Tidur

**TuruLab** adalah aplikasi web *full-stack* yang dirancang untuk membantu pengguna menganalisis dan memahami kualitas tidur mereka. Aplikasi ini menggunakan kuesioner **Pittsburgh Sleep Quality Index (PSQI)** yang dianalisis oleh model *machine learning* untuk memberikan prediksi kualitas tidur ("Baik" atau "Buruk").

Proyek ini dibangun dengan struktur monorepo yang terdiri dari:

  * **Frontend**: Dibuat dengan **React (Vite)** untuk antarmuka pengguna yang interaktif.
  * **Backend**: API yang dibuat dengan **Flask (Python)** untuk melayani model prediksi **Random Forest Classifier**.

-----

## 🛠️ Teknologi yang Digunakan

  * **Frontend**:
      * React.js
      * Vite
      * Tailwind CSS
  * **Backend**:
      * Python
      * Flask
      * Scikit-learn
      * Pandas

-----

## 📁 Struktur Folder

Proyek ini menggunakan struktur monorepo untuk mengelola frontend dan backend dalam satu repository.

```
turulab/
├── turulab-backend/      <-- Semua kode backend (Flask API)
├── turulab-app/          <-- Semua kode frontend (React App)
├── .gitignore
└── README.md
```

-----

## 🚀 Memulai Proyek

Berikut adalah langkah-langkah untuk melakukan instalasi dan menjalankan proyek ini di lingkungan lokal.

### 1\. Prasyarat

Pastikan Anda sudah menginstal:

  * Git
  * Python 3.8+
  * Node.js & npm

### 2\. Clone Repositori

```bash
git clone https://github.com/adiiwiraa/turulab.git
cd turulab
```

### 3\. Setup Backend (Flask)

Jalankan perintah ini dari **direktori utama (`turulab/`)**.

1.  **Masuk ke folder backend & buat virtual environment:**

    ```bash
    cd turulab-backend
    python -m venv venv
    source venv/bin/activate  # Untuk Windows: venv\Scripts\activate
    ```

2.  **Install semua pustaka yang dibutuhkan:**

    ```bash
    pip install -r requirements.txt
    ```

3.  **Kembali ke direktori utama:**

    ```bash
    cd ..
    ```

### 4\. Setup Frontend (React)

Jalankan perintah ini dari **direktori utama (`turulab/`)**.

1.  **Masuk ke folder frontend:**

    ```bash
    cd turulab-app
    ```

2.  **Install semua dependensi:**

    ```bash
    npm install
    ```

3.  **Kembali ke direktori utama:**

    ```bash
    cd ..
    ```

-----

## 🖥️ Menjalankan Aplikasi

Anda perlu menjalankan dua terminal secara terpisah, satu untuk backend dan satu untuk frontend.

### Menjalankan Backend Server

1.  Buka terminal di direktori utama (`turulab/`).
2.  Masuk ke folder backend dan aktifkan venv:
    ```bash
    cd turulab-backend
    source venv/bin/activate # atau venv\Scripts\activate untuk Windows
    ```
3.  Jalankan aplikasi Flask:
    ```bash
    flask run
    ```
    API akan berjalan di `http://127.0.0.1:5000`.

### Menjalankan Frontend Server

1.  Buka terminal **baru**.
2.  Masuk ke folder frontend:
    ```bash
    cd turulab-app
    ```
3.  Jalankan aplikasi React:
    ```bash
    npm run dev
    ```
    Aplikasi frontend akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

-----

## API Usage

Untuk berinteraksi langsung dengan API, kirim request **POST** ke endpoint `/predict` dengan data JSON yang berisi jawaban kuesioner mentah.

**Contoh menggunakan cURL:**

```bash
curl -X POST http://127.0.0.1:5000/predict \
-H "Content-Type: application/json" \
-d '{
    "P1": "11:00:00 PM", "P2": 30, "P3": "05:20:00 AM", "P4": 7.0,
    "P5_1": 1, "P5_2": 1, "P5_3": 0, "P5_4": 0, "P5_5": 0, "P5_6": 0,
    "P5_7": 0, "P5_8": 0, "P5_9": 0, "P5_10": 0, "P6": 2, "P7": 1,
    "P8": 2, "P9": 1
}'
```

**Contoh Respon Sukses:**

```json
{
  "kualitas_tidur_prediksi": "Baik"
}
```
