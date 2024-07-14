"use client";
import React from "react";
import ChartComponent from "./components/Chart/Chart";

const chartData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Tasks",
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(201, 203, 207, 0.2)",
      ],
      borderColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)",
        "rgb(201, 203, 207)",
      ],
      borderWidth: 1,
      hoverBackgroundColor: "rgba(66, 153, 225, 0.8)",
      hoverBorderColor: "rgba(66, 153, 225, 1)",
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

const chartOptions = {
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(200, 200, 200, 0.2)",
      },
    },
    x: {
      grid: {
        color: "rgba(200, 200, 200, 0.2)",
      },
    },
  },
};

const Home: React.FC = () => {
  return (
    <main className="flex flex-col min-h-screen ">
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-200 to-blue-400 card">
          <h3 className="card-text">Số Tasks</h3>
          <p className="card-amount">10</p>
        </div>
        <div className="bg-gradient-to-r from-green-200 to-green-400 card">
          <h3 className="card-text">Số Projects</h3>
          <p className="card-amount">5</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 card">
          <h3 className="card-text">Hoàn thành/Tham gia</h3>
          <p className="card-amount">7/8</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <ChartComponent chartData={chartData} chartType="line" />
        </div>
        <div className="w-full">
          <ChartComponent chartData={chartData} chartType="pie" />
        </div>
      </div>
      <div className="w-full mt-6">
        <ChartComponent chartData={chartData} chartType="radar" />
      </div>
    </main>
  );
};

export default Home;
