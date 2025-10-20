import React from "react";
import { Link } from "react-router-dom";
import HeroBackround from "../assets/images/hero-bg2.jpg";
// import HeroShape from '../assets/images/hero-shape.svg';

const LandingPage = () => {
  return (
    <div className="space-y-16">
      <section
        className="bg-white relative"
        style={{
          backgroundImage: `url(${HeroBackround})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black opacity-30 h-full absolute top-0 left-0 right-0 bottom-0 w-full"></div>
        <div className="max-w-7xl mx-auto flex px-5 py-24 md:flex-row flex-col items-center h-[93vh] z-10 relative">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold mb-2">
              Selamat Datang di TuruLab!
            </span>
            <h1 className="title-font sm:text-5xl text-4xl mb-4 font-extrabold text-white leading-20">
              Temukan Kualitas Tidur
              <br className="hidden lg:inline-block" />
              Terbaik Anda Bersama TuruLab
            </h1>
            <p className="mb-8 leading-relaxed text-white">
              Analisis pola tidur Anda secara cerdas, dapatkan wawasan mendalam,
              dan terima rekomendasi yang dipersonalisasi untuk istirahat malam
              yang lebih baik.
            </p>
            <div className="flex justify-center">
              <Link
                to="/register"
                className="inline-flex text-white bg-primary border-0 py-3 px-8 focus:outline-none hover:bg-blue-700 rounded-lg text-lg font-semibold"
              >
                Mulai Sekarang
              </Link>
              <Link
                to="/login"
                className="ml-4 inline-flex text-gray-700 bg-gray-100 border border-gray-300 py-3 px-8 focus:outline-none hover:bg-gray-200 rounded-lg text-lg"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="lg:max-w-xl lg:w-full md:w-1/2 w-5/6 relative hidden md:block">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="blobShape">
                  <path
                    d="M25,-36.3C32.4,-34.3,38.2,-27.2,41.8,-19.2C45.4,-11.1,46.7,-2.1,43.4,4.8C40.1,11.7,32.3,16.4,25.6,19.8C19,23.3,13.5,25.4,7.7,27.9C1.8,30.4,-4.4,33.4,-11,33.3C-17.6,33.3,-24.5,30.2,-27.8,24.9C-31.1,19.6,-30.7,12,-30.1,5.3C-29.5,-1.3,-28.5,-7,-26.1,-11.7C-23.6,-16.5,-19.6,-20.4,-15,-23.7C-10.4,-27,-5.2,-29.7,1.8,-32.5C8.8,-35.4,17.7,-38.3,25,-36.3Z"
                    transform="translate(50 50)"
                  ></path>
                </clipPath>
              </defs>
              <image
                href="https://images.unsplash.com/photo-1487300001871-12053913095d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                x="0"
                y="0"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#blobShape)"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="py-16 bg-white rounded-xl shadow-sm">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">
              Bagaimana TuruLab Bekerja?
            </h2>
            <p className="mt-2 text-gray-600">
              Tiga langkah mudah untuk tidur yang lebih baik.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto px-4">
            <div className="p-6">
              <div className="text-5xl mb-4 text-blue-500">📝</div>
              <h3 className="text-xl font-semibold mb-2">Isi Kuesioner</h3>
              <p className="text-gray-600">
                Jawab beberapa pertanyaan dari Pittsburgh Sleep Quality Index
                (PSQI) untuk menganalisis tidur Anda.
              </p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4 text-blue-500">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Dapatkan Prediksi</h3>
              <p className="text-gray-600">
                Model Machine Learning kami akan memprediksi kualitas tidur Anda
                secara otomatis.
              </p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4 text-blue-500">💡</div>
              <h3 className="text-xl font-semibold mb-2">Terima Rekomendasi</h3>
              <p className="text-gray-600">
                Dapatkan saran yang dipersonalisasi untuk membantu Anda
                meningkatkan kualitas tidur setiap malam.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white py-16 md:py-20">
          <div className="container mx-auto flex px-5 md:flex-row flex-col items-center">
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
              <img
                className="object-cover object-center rounded-lg shadow-lg"
                alt="about"
                src="https://t3.ftcdn.net/jpg/04/86/85/38/360_F_486853867_FIUmRpKJi7JvqaIph73UZn32nN4FMcvJ.jpg"
              />
            </div>
            <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
              <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">
                Tentang Kami
              </h2>
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">
                Misi Kami Adalah Membantu Anda Tidur Lebih Nyenyak
              </h1>
              <p className="mb-8 leading-relaxed text-gray-600">
                Di TuruLab, kami percaya bahwa tidur berkualitas adalah pilar
                kesehatan. Kami menggabungkan metode klinis teruji (PSQI) dengan
                kekuatan kecerdasan buatan untuk memberikan Anda pemahaman yang
                jelas dan dapat ditindaklanjuti tentang pola tidur Anda. Tujuan
                kami sederhana: memberdayakan Anda untuk mencapai istirahat
                malam yang lebih baik demi kehidupan yang lebih sehat dan
                produktif.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto pt-6 pb-12 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Kenapa PSQI?</h2>
            <p className="mt-2 text-gray-600">
              <a
                href="https://www.sleep.pitt.edu/psqi"
                className="font-bold test-primary"
              >
                Pittsburgh Sleep Quality Index (PSQI)
              </a>{" "}
              adalah instrumen standar yang menilai kualitas tidur dalam sebulan
              terakhir melalui 7 komponen. Skor total membantu
              mengklasifikasikan kualitas tidur dan menentukan area perbaikan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
            <div className="p-y-6 flex items-center gap-x-4">
              <div className="text-5xl mb-4 text-blue-500">😴</div>
              <h3 className="text-xl font-semibold mb-2">
                Kualitas Tidur Subjektif
              </h3>
            </div>
            <div className="p-y-6 flex items-center gap-x-4">
              <div className="text-5xl mb-4 text-blue-500">⏰</div>
              <h3 className="text-xl font-semibold mb-2">Latensi Tidur</h3>
            </div>
            <div className="p-y-6 flex items-center gap-x-4">
              <div className="text-5xl mb-4 text-blue-500">🕐</div>
              <h3 className="text-xl font-semibold mb-2">Durasi Tidur</h3>
            </div>
            <div className="p-y-6 flex items-center gap-x-4">
              <div className="text-5xl mb-4 text-blue-500">📊</div>
              <h3 className="text-xl font-semibold mb-2">Efisiensi Tidur</h3>
            </div>
            <div className="p-y-6 flex items-center gap-x-4">
              <div className="text-5xl mb-4 text-blue-500">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Gangguan Tidur</h3>
            </div>
            <div className="p-y-6 flex items-center gap-x-4">
              <div className="text-5xl mb-4 text-blue-500">💊</div>
              <h3 className="text-xl font-semibold mb-2">
                Penggunaan Obat tidur
              </h3>
            </div>
            <div className="p-y-6 flex items-center gap-x-4">
              <div className="text-5xl mb-4 text-blue-500">☀️</div>
              <h3 className="text-xl font-semibold mb-2">
                Disfungsi Siang Hari
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-16 md:py-24 sm:px-6 lg:px-8">
        <div className="bg-white container mx-auto flex px-5 md:flex-row flex-col items-center py-12">
          <div className="container mx-auto flex px-5 md:flex-row flex-col-reverse items-center">
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 md:pr-10 lg:pr-0">
              {/* Ganti div ini dengan gambar/ilustrasi Anda */}
              {/* Anda bisa mencari ilustrasi "Random Forest algorithm" atau "Decision Tree Ensemble" */}
              <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center border border-gray-200">
                <img
                  src="https://uploads-ssl.webflow.com/61af164800e38cf1b6c60b55/64c0c20d61bda9e68f630468_Random%20forest.webp"
                  alt="Ilustrasi cara kerja Random Forest"
                  className="object-contain object-center rounded-lg h-full p-4"
                />
              </div>
            </div>
            <div className="lg:flex-grow md:w-1/2 lg:pl-16 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
              <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">
                Model Prediksi Kami
              </h2>
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">
                Memprediksi Kualitas Tidur dengan Random Forest
              </h1>
              <p className="mb-6 leading-relaxed text-gray-600">
                TuruLab memanfaatkan algoritma
                <strong> Random Forest Classifier</strong>, sebuah algoritma
                <em> ensemble learning</em> yang kuat. Metode ini bekerja dengan
                membangun <strong>kumpulan (forest)</strong> dari banyak{" "}
                <strong>pohon keputusan (decision trees)</strong> secara
                independen selama proses <em>training</em>.
              </p>
              <p className="mb-6 leading-relaxed text-gray-600">
                Setiap pohon dilatih pada <em>subset</em> data acak (teknik{" "}
                <em>bootstrap aggregating</em> atau <em>bagging</em>) dan
                mempertimbangkan <em>subset</em> fitur acak saat membelah{" "}
                <em>node</em>. Saat memprediksi kualitas tidur Anda, setiap
                pohon memberikan "suara" (klasifikasi). Hasil prediksi akhir
                adalah <strong>kelas mayoritas</strong> (Baik/Buruk) dari
                seluruh pohon di dalam <em>forest</em>.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 py-8 md:py-2 sm:px-6 lg:px-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 w-full md:text-left text-center">
            Keunggulan Random Forest untuk Analisis PSQI:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-2">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-center md:text-left">
              <h4 className="font-bold text-lg text-primary mb-2">📈 Akurat</h4>
              <p className="text-gray-600 text-sm">
                Efektif menangkap pola non-linear dan interaksi kompleks antar
                komponen PSQI untuk prediksi yang andal.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-center md:text-left">
              <h4 className="font-bold text-lg text-primary mb-2">💪 Robust</h4>
              <p className="text-gray-600 text-sm">
                Mengurangi <strong>overfitting</strong> dan lebih tahan terhadap{" "}
                <strong>noise</strong> atau variasi kecil dalam data jawaban
                Anda.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-center md:text-left">
              <h4 className="font-bold text-lg text-primary mb-2">
                ✅ Keputusan Prediksi Handal
              </h4>
              <p className="text-gray-600 text-sm">
                Menggabungkan banyak 'pendapat' pohon keputusan menghasilkan
                prediksi kualitas tidur yang lebih konsisten dan dapat
                diandalkan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
