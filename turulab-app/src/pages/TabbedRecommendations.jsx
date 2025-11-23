import React, { useState } from "react";

// Data rekomendasi disesuaikan dengan file "Tabel Rekomendasi Praktis PSQI"
const RECOMMENDATIONS = {
  C1: [
    {
      title: "Teknik Relaksasi Otot",
      text: "Lakukan peregangan ringan atau Progressive Muscle Relaxation (tegangkan lalu lemaskan otot dari kaki ke kepala) sebelum tidur untuk membuang stres fisik.",
      citation:
        "Sulidah, S., et al. (2016). Effectiveness of Progressive Muscle Relaxation (PMR) on sleep quality. Indonesian Journal of Medicine and Health.",
    },
    {
      title: "Jurnal Syukur (Gratitude Journal)",
      text: "Tuliskan 3 hal baik yang terjadi hari ini sebelum tidur. Ini membantu mengalihkan pikiran dari kecemasan ke hal positif.",
      citation:
        "Jackowska, M., et al. (2016). The impact of a brief gratitude intervention on subjective well-being, biology and sleep. Journal of Health Psychology, 21(10), 2207–2217.",
    },
    {
      title: "Buat Rutinitas Menenangkan",
      text: "Lakukan aktivitas santai 30-60 menit sebelum tidur (misal: mandi air hangat, membaca buku cetak) sebagai sinyal bagi tubuh untuk istirahat.",
      citation:
        "Irish, L. A., et al. (2015). The role of sleep hygiene in promoting public health. Sleep Medicine Reviews, 22, 23-36.",
    },
  ],
  C2: [
    {
      title: "Aturan 20 Menit",
      text: "Jika tidak bisa tidur dalam ±20 menit, bangunlah dan pindah ke ruangan lain. Lakukan aktivitas membosankan hingga mengantuk. Jangan memaksakan diri di kasur.",
      citation:
        "Bootzin, R. R. (1972). Stimulus control treatment for insomnia. Proceedings of the American Psychological Association, 7, 395-396.",
    },
    {
      title: "Tulis Daftar Tugas (To-Do List)",
      text: "Jika pikiran Anda penuh dengan tugas besok, tuliskan semuanya di kertas 1 jam sebelum tidur agar otak tidak terus 'mengingat-ingat' saat di kasur.",
      citation:
        "Scullin, M. K., et al. (2018). The effects of bedtime writing on difficulty falling asleep. Journal of Experimental Psychology, 147(1), 139–146.",
    },
    {
      title: "Hindari Cahaya Biru",
      text: "Matikan HP, laptop, dan TV setidaknya 1 jam sebelum tidur karena cahaya layarnya menghambat hormon kantuk (melatonin).",
      citation:
        "Shechter, A., et al. (2018). Blocking nocturnal blue light for insomnia: A randomized controlled trial. Journal of Psychiatric Research, 96, 196-202.",
    },
  ],
  C3: [
    {
      title: "Jadwal Konsisten",
      text: "Tetapkan jam tidur dan bangun yang sama setiap hari, termasuk saat libur. Jangan biasakan 'balas dendam' tidur di akhir pekan.",
      citation:
        "Kang, J. H., & Chen, S. C. (2009). Effects of an irregular bedtime schedule on sleep quality. BMC Public Health, 9, 62.",
    },
    {
      title: "Olahraga Teratur",
      text: "Lakukan olahraga aerobik ringan (seperti jalan cepat) minimal 30 menit sehari, namun hindari olahraga berat 2 jam sebelum tidur.",
      citation:
        "Kredlow, M. A., et al. (2015). The effects of physical activity on sleep: a meta-analytic review. Journal of Behavioral Medicine, 38(3), 427-449.",
    },
    {
      title: "Prioritaskan Waktu Tidur",
      text: "Anggap tidur 7-8 jam sebagai kebutuhan medis, bukan kemewahan. Pasang alarm untuk mengingatkan waktu persiapan tidur (bedtime alarm).",
      citation:
        "Hirshkowitz, M., et al. (2015). National Sleep Foundation’s sleep time duration recommendations. Sleep Health, 1(1), 40-43.",
    },
  ],
  C4: [
    {
      title: "Tempat Tidur Hanya untuk Tidur",
      text: "Gunakan tempat tidur hanya untuk tidur dan aktivitas relaksasi. Jangan makan, kerja, atau main HP di kasur.",
      citation:
        "Spielman, A. J., Saskin, P., & Thorpy, M. J. (1987). Treatment of chronic insomnia by restriction of time in bed. Sleep, 10(1), 45-56.",
    },
    {
      title: "Batasi Waktu Berbaring",
      text: "Jika Anda sulit tidur, kurangi waktu berbaring di kasur agar sesuai dengan jam tidur asli Anda (Teknik Restriksi Tidur). Ini membuat tidur lebih padat.",
      citation:
        "Bootzin, R. R., & Perlis, M. L. (2011). Stimulus control therapy. Behavioral Treatments for Sleep Disorders, 21-30.",
    },
    {
      title: "Hindari Tidur Siang Panjang",
      text: "Batasi tidur siang maksimal 20 menit. Tidur siang yang terlalu lama bisa 'mencuri' rasa kantuk yang Anda butuhkan untuk malam hari.",
      citation:
        "Dutheil, F., et al. (2021). Effects of a Short Daytime Nap on the Cognitive Performance. Int J Environ Res Public Health, 18(19).",
    },
  ],
  C5: [
    {
      title: "Kamar Gelap & Sejuk",
      text: "Pastikan kamar benar-benar gelap (gunakan masker mata jika perlu) dan suhunya sejuk (sekitar 18-22°C).",
      citation:
        "Litton, E., et al. (2016). The efficacy of earplugs as a sleep hygiene strategy. Critical Care Medicine, 44(5), 992-999.",
    },
    {
      title: "Kelola Asupan Cairan",
      text: "Kurangi minum 2 jam sebelum tidur untuk mencegah terbangun karena ingin buang air kecil (Nokturia).",
      citation:
        "Bohra, A., & Bhuta, P. (2018). Nocturia: Causes, consequences, and management. Australian Journal of General Practice.",
    },
    {
      title: "Hindari Alkohol & Kafein",
      text: "Jangan minum kopi setelah jam 2 siang dan hindari alkohol sebelum tidur karena bisa membuat tidur tidak nyenyak dan sering terbangun.",
      citation:
        "Drake, C., et al. (2013). Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed. Journal of Clinical Sleep Medicine, 9(11), 1195–1200.",
    },
  ],
  C6: [
    {
      title: "Kurangi Bertahap (Tapering)",
      text: "Jangan berhenti mendadak. Konsultasikan dengan dokter untuk menurunkan dosis sedikit demi sedikit (misal: 10-25% per minggu).",
      citation:
        "Pottie, K., et al. (2018). Deprescribing benzodiazepine receptor agonists: Evidence-based clinical practice guideline. Canadian Family Physician, 64(5), 339-351.",
    },
    {
      title: "Terapi Perilaku (CBT-I)",
      text: "Gunakan perubahan kebiasaan (seperti poin-poin pada komponen lain) sebagai solusi utama jangka panjang, bukan obat.",
      citation:
        "Sateia, M. J., et al. (2017). Clinical practice guideline for the pharmacologic treatment of chronic insomnia in adults. Journal of Clinical Sleep Medicine, 13(2), 307-349.",
    },
    {
      title: "Edukasi Efek Samping",
      text: "Pahami bahwa obat tidur lama-kelamaan bisa kehilangan efeknya (toleransi) dan mengubah struktur alami tidur Anda.",
      citation:
        "Reeve, E., et al. (2017). Deprescribing benzodiazepine receptor agonists. PLoS One.",
    },
  ],
  C7: [
    {
      title: "Sinar Matahari Pagi",
      text: "Segera cari sinar matahari pagi saat bangun (15-30 menit) untuk meningkatkan energi dan kewaspadaan.",
      citation:
        "Terman, M., & Terman, J. S. (2005). Light therapy for seasonal and nonseasonal depression. CNS Spectrums, 10(8), 647-663.",
    },
    {
      title: "Tidur Siang Strategis (Power Nap)",
      text: "Jika sangat mengantuk, tidur sianglah sebentar saja (10-20 menit) sebelum jam 3 sore untuk mengembalikan fokus.",
      citation:
        "Milner, C. E., & Cote, K. A. (2009). Benefits of napping in healthy adults: impact of nap length, time of day, and experience with napping. Journal of Sleep Research, 18(2), 272-281.",
    },
    {
      title: "Bergerak Aktif",
      text: "Hindari duduk diam terlalu lama. Lakukan peregangan atau jalan kaki singkat saat merasa lesu di siang hari.",
      citation:
        "Kline, C. E. (2014). The bidirectional relationship between exercise and sleep. American Journal of Lifestyle Medicine.",
    },
  ],
};

const TABS = [
  {
    key: "C1",
    label: "C1",
    description: "Kualitas Tidur Subjektif",
  },
  { key: "C2", label: "C2", description: "Latensi Tidur" },
  { key: "C3", label: "C3", description: "Durasi Tidur" },
  {
    key: "C4",
    label: "C4",
    description: "Efisiensi Tidur",
  },
  {
    key: "C5",
    label: "C5",
    description: "Gangguan Tidur",
  },
  {
    key: "C6",
    label: "C6",
    description: "Penggunaan Obat",
  },
  {
    key: "C7",
    label: "C7",
    description: "Disfungsi Siang Hari",
  },
];

const TabbedRecommendations = () => {
  const [activeTab, setActiveTab] = useState("C1");

  return (
    <div>
      {/* Tab Header */}
      <div className="flex flex-wrap border-b border-gray-300 bg-gray-50 rounded-t-lg">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-[60px] sm:min-w-fit px-2 sm:px-4 py-3 text-sm sm:text-base font-semibold border-b-2 transition-all duration-200 focus:outline-none ${
              activeTab === tab.key
                ? "border-primary text-primary bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-b-lg shadow-sm border border-gray-200 border-t-0">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {TABS.find((tab) => tab.key === activeTab)?.description}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Rekomendasi praktis berdasarkan referensi ilmiah.
          </p>
        </div>

        <div className="space-y-3">
          {RECOMMENDATIONS[activeTab].map((rec, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
            >
              {/* Icon / Number */}
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-primary font-bold text-sm">
                  {idx + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1">{rec.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {rec.text}
                </p>

                {/* Citation Section */}
                <div className="flex items-start gap-1 text-xs text-gray-500 bg-white p-2 rounded border border-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="italic">{rec.citation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabbedRecommendations;
