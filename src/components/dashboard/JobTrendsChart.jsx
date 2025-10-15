// src/components/dashboard/JobTrendsChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

export default function JobTrendsChart({ timeseries = [] }) {
  const data = {
    labels: timeseries.map((t) => t.date),
    datasets: [
      {
        label: "Market interest",
        data: timeseries.map((t) => t.score),
        borderColor: "rgba(68,229,231,1)",
        backgroundColor: "rgba(68,229,231,0.12)",
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { ticks: { color: "#c7f7f8" } },
      y: { ticks: { color: "#c7f7f8" }, beginAtZero: false, suggestedMin: 30, suggestedMax: 100 },
    },
  };

  return <div role="img" aria-label="Job trends chart"><Line data={data} options={options} /></div>;
}
