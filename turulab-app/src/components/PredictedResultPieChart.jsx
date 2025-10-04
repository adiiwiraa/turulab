import React from 'react';
import ReactApexChart from 'react-apexcharts';

const GENDERS = ['Laki-laki', 'Perempuan'];
const RESULTS = ['Baik', 'Buruk'];

// For each predicted_result, count Laki-laki and Perempuan
const getPieData = (history, result) => {
  return GENDERS.map(gender =>
    history.filter(h => h.jenis_kelamin === gender && h.predicted_result === result).length
  );
};

const chartOptions = result => ({
  chart: {
    type: 'pie',
    toolbar: { show: false }
  },
  labels: GENDERS,
  colors: ['#2563eb', '#eab308'], // blue for Laki-laki, yellow for Perempuan
  title: {
    text: `Kualitas Tidur - ${result}`,
    align: 'center',
    style: { fontSize: '16px', fontWeight: 'bold' }
  },
  legend: {
    position: 'left',
    horizontalAlign: 'center'
  },
  dataLabels: { enabled: true },
  tooltip: {
    y: {
      formatter: val => `${val} mahasiswa`
    }
  }
});

const PredictedResultPieChart = ({ history }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
    {RESULTS.map(result => (
      <div key={result} className="w-fit">
        <ReactApexChart
          options={chartOptions(result)}
          series={getPieData(history, result)}
          type="pie"
          height={300}
        />
      </div>
    ))}
  </div>
);

export default PredictedResultPieChart;
