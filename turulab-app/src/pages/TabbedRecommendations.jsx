import React, { useState } from 'react';

const RECOMMENDATIONS = {
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

const TABS = [
  { key: 'C1', label: 'C1', description: 'Kualitas Tidur Subjektif (Subjective Sleep Quality)' },
  { key: 'C2', label: 'C2', description: 'Latensi Tidur (Sleep Latency)' },
  { key: 'C3', label: 'C3', description: 'Durasi Tidur (Sleep Duration)' },
  { key: 'C4', label: 'C4', description: 'Efisiensi Tidur (Habitual Sleep Efficiency)' },
  { key: 'C5', label: 'C5', description: 'Gangguan Tidur (Sleep Disturbances)' },
  { key: 'C6', label: 'C6', description: 'Penggunaan Obat Tidur (Use of Sleeping Medication)' },
  { key: 'C7', label: 'C7', description: 'Disfungsi Siang Hari (Daytime Dysfunction)' }
];

const TabbedRecommendations = () => {
  const [activeTab, setActiveTab] = useState('C1');

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-gray-400 bg-white rounded-t-lg shadow">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 rounded py-2 font-semibold border-b-2 transition-colors duration-200 ${activeTab === tab.key ? 'bg-primary text-white border-blue-600' : 'text-gray-700 border-transparent hover:bg-blue-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow border border-gray-200">
        <h3 className="text-lg font-bold mb-2">Rekomendasi untuk {activeTab} {TABS.find(tab => tab.key === activeTab)?.description}</h3>
        <ul className="list-disc ml-6 text-left">
          {RECOMMENDATIONS[activeTab].map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TabbedRecommendations;