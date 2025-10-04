import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PROGRAMS = [
  'S1 Sistem Informasi',
  'S1 Informatika',
  'S1 Sains Data',
  'D3 Sistem Informasi'
];

const PredictedResultChart = ({ history }) => {
  // Get unique predicted_result values
  const RESULTS = ['Baik', 'Buruk'];

  // For each program_studi, count for each predicted_result
  const series = PROGRAMS.map(program => ({
    name: program,
    data: RESULTS.map(result =>
      history.filter(h => h.program_studi === program && h.predicted_result === result).length
    )
  }));

  const options = {
    chart: {
      type: 'bar',
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
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: RESULTS,
      title: { text: 'Predicted Result' }
    },
    yaxis: {
      title: { text: 'Jumlah Mahasiswa' }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    colors: ['#2563eb', '#22c55e', '#ef4444', '#eab308'], // blue, green, red, yellow for each program
    // dataLabels: { enabled: true },
    tooltip: {
      y: {
        formatter: val => `${val} mahasiswa`
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Grafik Program Studi berdasarkan Prediksi</h2>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default PredictedResultChart;
