import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function ReportsCard({ timeseries }) {
  const data = {
    labels: timeseries.map((d) => d.date),
    datasets: [
      {
        label: "Performance Score",
        data: timeseries.map((d) => d.score),
        borderColor: "rgba(68, 229, 231, 1)", // primary-500
        backgroundColor: "rgba(68, 229, 231, 0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "rgba(68, 229, 231, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#ecfcfd" } }, // text-primary-50
      tooltip: {
        backgroundColor: "#071717",
        titleColor: "#44e5e7",
        bodyColor: "#ecfcfd",
      },
    },
    scales: {
      x: { ticks: { color: "#c7f7f8" }, grid: { color: "rgba(255,255,255,0.05)" } },
      y: { ticks: { color: "#c7f7f8" }, grid: { color: "rgba(255,255,255,0.05)" } },
    },
  };

  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl bg-primary-1400 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      role="img"
      aria-label="Performance over time chart"
    >
      <h3 className="text-lg font-semibold text-primary-50 mb-4">Performance Reports</h3>
      <Line data={data} options={options} />
    </motion.div>
  );
}
