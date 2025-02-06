// components/admin/BlogTrendGraph.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Chart.js bileşenlerini register ediyoruz.
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BlogTrendGraph({ data }) {
  if (!data) return <p>Loading blog trend data...</p>;

  const chartData = {
    labels: data.labels, // örn: ["2023-11-01", "2023-11-02", ...]
    datasets: [
      {
        label: "Blogs Published",
        data: data.counts, // örn: [3, 5, 2, ...]
        borderColor: "#4ade80", // yeşil tonunda örnek renk
        backgroundColor: "rgba(74, 222, 80, 0.2)",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">Blog Publishing Trend</h3>
      <Line data={chartData} />
    </div>
  );
}
