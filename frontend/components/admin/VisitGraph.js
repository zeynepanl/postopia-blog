import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function VisitGraph() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">Total Visits</h3>
      <Line
        data={{
          labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          datasets: [
            {
              label: "Visits",
              data: [100, 150, 80, 170, 130, 140, 110, 120, 90, 105],
              borderColor: "#7C3AED",
              backgroundColor: "rgba(124, 58, 237, 0.2)",
            },
          ],
        }}
      />
    </div>
  );
}