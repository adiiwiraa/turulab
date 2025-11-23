import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const ResultsPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestPrediction = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching results:", error);
      } else {
        setPrediction(data);
      }
      setLoading(false);
    };

    fetchLatestPrediction();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center p-12 font-bold">
        Menganalisis hasil Anda...
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold">Hasil tidak ditemukan</h2>
        <p className="mt-4">
          Kami tidak dapat menemukan hasil prediksi Anda. Silakan coba isi
          kuesioner kembali.
        </p>
        <Link
          to="/kuesioner"
          className="mt-6 inline-block px-6 py-2 bg-primary text-white rounded-lg"
        >
          Isi Kuesioner
        </Link>
      </div>
    );
  }

  const isGoodQuality = prediction.predicted_result === "Baik";

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        Hasil Analisis Tidur Anda
      </h1>
      <div
        className={`mt-8 p-8 rounded-xl shadow-lg border-4 ${
          isGoodQuality
            ? "border-green-400 bg-green-50"
            : "border-red-400 bg-red-50"
        }`}
      >
        <p className="text-lg text-gray-600">
          Berdasarkan jawaban Anda, kualitas tidur Anda diprediksi:
        </p>
        <h2
          className={`text-6xl font-extrabold my-4 ${
            isGoodQuality ? "text-green-600" : "text-red-600"
          }`}
        >
          {prediction.predicted_result}
        </h2>
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
