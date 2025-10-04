import React from 'react';
import ReactApexChart from 'react-apexcharts';

const RESULTS = ['Baik', 'Buruk'];

const PredictedResultCountChart = ({ history }) => {
  // Count for each predicted_result
  const counts = RESULTS.map(result =>
    history.filter(h => h.predicted_result === result).length
  );

  const series = [
    {
      name: 'Jumlah',
      data: counts
    }
  ];

  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      categories: RESULTS,
      title: { text: 'Predicted Result' }
    },
    yaxis: {
      title: { text: 'Jumlah' }
    },
    legend: {
      show: false
    },
    colors: ['#22c55e', '#ef4444'], // green for Baik, red for Buruk
    dataLabels: { enabled: true },
    tooltip: {
      y: {
        formatter: val => `${val} data`
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Grafik Jumlah Prediksi Baik vs Buruk</h2>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default PredictedResultCountChart;
