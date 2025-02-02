import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryGraph() {
  return (
    <div >
      <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
      <Pie
        data={{
          labels: ["Technology", "Sport"],
          datasets: [
            {
              data: [70, 30],
              backgroundColor: ["#6EE7B7", "#FCA5A5"],
            },
          ],
        }}
      />
    </div>
  );
}