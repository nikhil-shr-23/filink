import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import BaseCard from './BaseCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function TrackerCard({ data, reference, onDelete, onEdit }) {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Progress',
        data: data.trackerData || [0, 10, 5, 2, 20, 30],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white'
        }
      },
      x: {
        ticks: {
          color: 'white'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <BaseCard data={data} reference={reference} onDelete={onDelete} onEdit={onEdit}>
      <div className="h-40 mt-2">
        <Line data={chartData} options={options} />
      </div>
    </BaseCard>
  );
}

export default TrackerCard;