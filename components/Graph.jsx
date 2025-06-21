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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Graph = ({ graphData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: Math.max(...graphData.map((i) => i[0])),
        ticks: {
          stepSize: 1,
          color: "rgba(236, 239, 244, 0.8)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.2)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(236, 239, 244, 0.8)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        displayColors: false,
        callbacks: {
          title: () => "",
          label: (context) => `WPM: ${context.parsed.y}`,
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4 rounded-lg shadow-md">
      <Line
        data={{
          labels: graphData.map((i) => i[0]),
          datasets: [
            {
              data: graphData.map((i) => i[1]),
              borderColor: "#61afef",
              tension: 0.8,
              borderWidth: 2,
              pointRadius: 0,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
};

export default Graph;
