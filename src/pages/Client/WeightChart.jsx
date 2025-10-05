import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../../api/axiosInstance';
import { Alert, Spinner } from 'react-bootstrap';
import '../../styles/WeightChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightChart = ({ clientId, refreshTrigger }) => {
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeightHistory = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      try {
        const response = await api.get(`/clients/${clientId}/weight-history`
        );
        setWeightData(response.data.weight_history);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch weight history');
      } finally {
        setLoading(false);
      }
    };

    fetchWeightHistory();
  }, [clientId, refreshTrigger]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (weightData.length === 0) return <Alert variant="info">No weight data available</Alert>;

  const chartData = {
    labels: weightData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightData.map(item => item.weight),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Weight Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div className="weight-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeightChart;