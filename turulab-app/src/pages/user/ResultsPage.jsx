import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const ResultsPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestPrediction = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Jika tidak ada user, kembali ke halaman login
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching results:', error);
      } else {
        setPrediction(data);
      }
      setLoading(false);
    };

    fetchLatestPrediction();
  }, [navigate]);

  const getRecommendation = (result, component) => {
    if (result === 'Baik') {
      return "Selamat! Kualitas tidur Anda sudah baik. Pertahankan pola tidur yang sehat dan rutin berolahraga untuk menjaga kualitasnya.";
    }
    // Rekomendasi berdasarkan komponen skor tertinggi
    const recommendations = {
      C1: [
        "Lakukan 'Sleep Journaling'. Sebelum tidur, luangkan waktu 5-10 menit untuk menuliskan pikiran, perasaan, atau kekhawatiran yang sedang dialami. Cara ini dapat membantu menenangkan pikiran dan memudahkan proses tidur.",
        "Bangun Rutinitas Malam yang Konsisten. Sediakan waktu sekitar 30 menit sebelum tidur untuk melakukan aktivitas yang menenangkan, misalnya membaca buku non-akademik, mendengarkan musik instrumental, atau podcast dengan alunan tenang. Rutinitas ini membantu tubuh mengenali 'waktu istirahat'.",
        "Latihan Pernapasan Dalam. Terapkan teknik pernapasan 4-7-8: tarik napas melalui hidung selama 4 detik, tahan 7 detik, lalu hembuskan perlahan selama 8 detik. Ulangi 3–5 kali untuk menenangkan tubuh dan pikiran.",
        "Kurangi Paparan Cahaya Biru. Usahakan untuk tidak menatap layar gawai atau laptop setidaknya 1 jam sebelum tidur. Jika harus menggunakan perangkat, aktifkan fitur night mode agar cahaya biru lebih teredam."
      ],
      C2: [
        "Terapkan 'Aturan 20 Menit'. Jika setelah 20 menit berbaring Anda belum tertidur, bangunlah dan lakukan aktivitas santai seperti membaca buku. Kembali ke tempat tidur hanya ketika rasa kantuk mulai muncul. Cara ini membantu otak mengasosiasikan kasur dengan tidur, bukan rasa frustrasi.",
        "Tetapkan 'Worry Time'. Sediakan 10–15 menit di sore hari untuk memikirkan kekhawatiran dan mencari solusinya. Dengan begitu, saat pikiran tersebut muncul menjelang tidur, Anda dapat mengingat bahwa hal itu sudah dipikirkan sebelumnya.",
        "Batasi Konsumsi Stimulan. Hindari kafein, teh, minuman energi, dan cokelat setidaknya 6 jam sebelum tidur. Makanan berat atau pedas juga sebaiknya dihindari 2–3 jam sebelum waktu tidur.",
        "Lakukan Relaksasi Otot Progresif. Mulailah dari ujung kaki, tegangkan otot selama 5 detik, lalu lepaskan. Lanjutkan ke betis, paha, perut, tangan, hingga seluruh tubuh terasa rileks.",
        "Mandi Air Hangat. Mandi 1–2 jam sebelum tidur dapat membantu menurunkan suhu inti tubuh setelahnya, sehingga tubuh lebih mudah merasa mengantuk."
      ],
      C3: [
        "Tetapkan Jadwal Tidur yang Teratur. Usahakan untuk tidur dan bangun pada jam yang sama setiap hari, termasuk di akhir pekan, agar ritme sirkadian tubuh tetap seimbang.",
        "Kelola Waktu Secara Efektif. Gunakan teknik manajemen waktu seperti Time Blocking atau Pomodoro untuk mengatur aktivitas di siang hari sehingga tidak perlu begadang.",
        "Lakukan Tidur Siang Singkat. Jika diperlukan, tidur siang 20–30 menit pada awal sore (sekitar pukul 13.00–15.00). Hindari tidur siang terlalu lama atau terlalu sore karena dapat mengganggu kualitas tidur malam.",
        "Sesuaikan Jam Tidur Secara Bertahap. Jika terbiasa tidur larut malam, majukan jam tidur 15 menit setiap beberapa hari hingga mencapai waktu tidur yang lebih ideal."
      ],
      C4: [
        "Gunakan Kasur Hanya untuk Tidur. Hindari belajar, makan, menonton film, atau menggunakan gawai di atas kasur. Tujuannya agar otak mengasosiasikan kasur hanya dengan tidur.",
        "Ciptakan Lingkungan Tidur yang Optimal. Pastikan kamar tidur cukup gelap, tenang, dan sejuk. Jika perlu, gunakan earplugs, eye mask, atau kipas angin untuk mendukung kenyamanan tidur.",
        "Batasi Asupan Cairan Sebelum Tidur. Mengurangi konsumsi air 1–2 jam sebelum tidur dapat membantu mencegah sering terbangun untuk ke kamar mandi.",
        "Rutin Berolahraga di Siang Hari. Olahraga ringan 30 menit pada siang atau sore hari dapat meningkatkan kualitas tidur. Namun, hindari olahraga berat menjelang waktu tidur."
      ],
      C5: [
        "Manfaatkan 'White Noise'. Jika lingkungan sekitar berisik, gunakan aplikasi white noise atau kipas angin untuk menciptakan suara latar yang stabil dan menutupi kebisingan.",
        "Kelola Stres Penyebab Mimpi Buruk. Lakukan aktivitas relaksasi seperti meditasi, menulis jurnal, atau mendengarkan musik tenang untuk menenangkan pikiran sebelum tidur.",
        "Perhatikan Posisi Tidur. Jika sering terbangun karena nyeri punggung atau leher, gunakan bantal tambahan atau ubah posisi tidur agar tubuh lebih nyaman.",
        "Gunakan Pakaian Tidur yang Tepat. Pilih pakaian tidur yang longgar dan berbahan nyaman, seperti katun, agar suhu tubuh tetap stabil sepanjang malam."
      ],
      C6: [
        "Konsultasikan dengan Tenaga Medis. Jangan memulai, menghentikan, atau mengubah dosis obat tidur tanpa saran dokter. Diskusikan juga alternatif non-obat bila memungkinkan.",
        "Pertimbangkan Pendekatan Alami. Minuman hangat seperti teh kamomil atau susu hangat dapat membantu tubuh lebih rileks sebelum tidur.",
        "Perbaiki Pola Tidur Sebelum Mengandalkan Obat. Fokuslah pada penerapan kebiasaan tidur sehat, karena perbaikan pola tidur sering kali cukup membantu mengatasi gangguan tidur ringan."
      ],
      C7: [
        "Manfaatkan Paparan Sinar Matahari Pagi. Begitu bangun tidur, buka jendela atau keluar sebentar untuk mendapatkan sinar matahari selama 10–15 menit. Hal ini membantu mengatur jam biologis dan meningkatkan kewaspadaan.",
        "Gunakan Kafein Secara Bijak. Jika mengonsumsi kopi, batasi jumlahnya dan hindari setelah pukul 14.00. Gunakan kafein sebagai penunjang, bukan pengganti tidur.",
        "Lakukan 'Micro-break' Singkat. Saat merasa mengantuk ketika belajar atau bekerja, berdirilah, lakukan peregangan, atau berjalan sebentar selama 5 menit untuk menyegarkan tubuh dan pikiran.",
        "Utamakan Keselamatan. Jika merasa sangat mengantuk, jangan memaksakan diri untuk mengemudi, terutama sepeda motor. Istirahat sejenak atau gunakan transportasi alternatif bila diperlukan.",
        "Perhatikan Asupan Cairan dan Gula Darah. Pastikan tubuh cukup terhidrasi dan konsumsi camilan sehat seperti buah atau kacang untuk menjaga energi tetap stabil sepanjang hari."
      ]
    };
    if (recommendations[component]) {
      return (
        <ul className="text-left list-disc ml-6">
          {recommendations[component].map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      );
    }
    return "Terdapat beberapa aspek tidur Anda yang perlu diperbaiki. Coba perbaiki jadwal tidur Anda dan ciptakan lingkungan tidur yang nyaman untuk hasil yang lebih baik.";
  };

  if (loading) {
    return <div className="text-center p-12">Menganalisis hasil Anda...</div>;
  }

  if (!prediction) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold">Hasil tidak ditemukan</h2>
        <p className="mt-4">Kami tidak dapat menemukan hasil prediksi Anda. Silakan coba isi kuesioner kembali.</p>
        <Link to="/kuesioner" className="mt-6 inline-block px-6 py-2 bg-primary text-white rounded-lg">
          Isi Kuesioner
        </Link>
      </div>
    );
  }

  const isGoodQuality = prediction.predicted_result === 'Baik';

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-gray-800">Hasil Analisis Tidur Anda</h1>
      <div className={`mt-8 p-8 rounded-xl shadow-lg border-4 ${isGoodQuality ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
        <p className="text-lg text-gray-600">Berdasarkan jawaban Anda, kualitas tidur Anda diprediksi:</p>
        <h2 className={`text-6xl font-extrabold my-4 ${isGoodQuality ? 'text-green-600' : 'text-red-600'}`}>
          {prediction.predicted_result}
        </h2>
        <div className="bg-white p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Rekomendasi Untuk Anda</h3>
          <p className="text-gray-600 mt-2">
            {getRecommendation(prediction.predicted_result, prediction.highest_score_component)}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <Link 
          to="/dashboard"
          className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;