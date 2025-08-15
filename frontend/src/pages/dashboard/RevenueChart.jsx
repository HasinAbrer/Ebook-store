// src/components/RevenueChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ monthlySales = [] }) => {
  const chartLabels = monthlySales.map(item => {
    const [year, month] = item._id.split('-');
    return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
  });

  const chartDataPoints = monthlySales.map(item => item.totalSales);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Sales',
        data: chartDataPoints,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className='h-full w-full'>
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueChart;