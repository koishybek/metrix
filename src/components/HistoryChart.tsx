import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ReadingHistory } from '../types';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoryChartProps {
  history: ReadingHistory[];
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ history }) => {
  // Sort history by date ascending for chart
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const labels = sortedHistory.map(item => 
    format(parseISO(item.date), 'd MMM', { locale: ru })
  );

  const consumptionData = sortedHistory.map(item => item.consumption);

  // Styling for points: Highlight the last point
  const pointRadii = consumptionData.map((_, index) => index === consumptionData.length - 1 ? 6 : 4);
  const pointHoverRadii = consumptionData.map((_, index) => index === consumptionData.length - 1 ? 8 : 6);
  const pointColors = consumptionData.map((_, index) => index === consumptionData.length - 1 ? '#ef4444' : 'rgb(0, 102, 204)'); // Red for last point

  const data = {
    labels,
    datasets: [
      {
        label: 'Расход (м³)',
        data: consumptionData,
        borderColor: 'rgb(0, 102, 204)',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3, // Thicker line
        pointBackgroundColor: pointColors,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: pointColors,
        pointRadius: pointRadii,
        pointHoverRadius: pointHoverRadii,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: function(context: TooltipItem<'line'>[]) {
             return context[0].label;
          },
          label: function(context: TooltipItem<'line'>) {
            const value = context.parsed.y;
            return `Расход: ${value !== null ? value.toFixed(3) : '0'} м³`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Расход (м³)',
          color: '#9ca3af',
          font: {
            size: 11
          }
        },
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          font: {
            size: 10,
          },
          color: '#9ca3af',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Дата',
          color: '#9ca3af',
          font: {
            size: 11
          }
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          color: '#9ca3af',
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="w-full h-72 bg-card rounded-xl border p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">График расхода</h3>
      <div className="w-full h-[calc(100%-2rem)]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
