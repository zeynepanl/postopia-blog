// components/admin/CategoryGraph.jsx
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Gerekli Chart.js bileşenlerini register ediyoruz.
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function CategoryGraph({ data }) {
  if (!data) return <p>Loading category data...</p>;

  // data dizisi örneğin: [{ _id: "Travel", count: 20 }, { _id: "Food", count: 15 }, ...]
  const labels = data.map((item) => item._id);
  const counts = data.map((item) => item.count);

  // Her kategori için rastgele renkler oluşturuyoruz.
  const backgroundColors = labels.map(() =>
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 0.6)`
  );

  const borderColors = backgroundColors.map((color) =>
    color.replace("0.6", "1")
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Blog Count",
        data: counts,
        backgroundColor: backgroundColors, // backgroundColors adını kullanıyoruz
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} />;
}
