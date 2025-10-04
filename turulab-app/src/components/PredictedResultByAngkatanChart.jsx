import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ANGKATAN = ['2021', '2022', '2023', '2024'];
const RESULTS = ['Baik', 'Buruk'];

const PredictedResultByAngkatanChart = ({ history }) => {
  // For each angkatan, count Baik/Buruk
  const counts = ANGKATAN.map(angkatan => {
    const baik = history.filter(h => h.angkatan === angkatan && h.predicted_result === 'Baik').length;
    const buruk = history.filter(h => h.angkatan === angkatan && h.predicted_result === 'Buruk').length;
    return { baik, buruk };
  });

  const series = [
    {
      name: 'Baik',
      data: counts.map(c => c.baik)
    },
    {
      name: 'Buruk',
      data: counts.map(c => c.buruk)
    }
  ];

  const options = {
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 8,
        borderRadiusApplication: 'end'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ANGKATAN,
      title: { text: 'Angkatan' }
    },
    yaxis: {
      title: { text: 'Jumlah Prediksi' }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    colors: ['#22c55e', '#ef4444'], // green for Baik, red for Buruk
    dataLabels: { enabled: true },
    tooltip: {
      y: {
        formatter: val => `${val} mahasiswa`
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Grafik Prediksi Kualitas Tidur per Angkatan</h2>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default PredictedResultByAngkatanChart;
