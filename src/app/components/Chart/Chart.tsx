"use client";
import React, { useEffect, useRef } from "react";
import { Chart, ChartData, ChartOptions, ChartType } from "chart.js";

interface ChartComponentProps {
  chartData: ChartData;
  chartOptions?: ChartOptions;
  chartType: ChartType;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  chartData,
  chartOptions,
  chartType,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chartInstance: Chart | null = null;

  useEffect(() => {
    if (chartRef.current && chartData) {
      chartInstance = new Chart(chartRef.current, {
        type: chartType,
        data: chartData,
        options: {
          ...chartOptions,
          plugins: {
            tooltip: {
              backgroundColor: "#ffffff",
              titleColor: "#000000",
              bodyColor: "#000000",
              borderColor: "#dddddd",
              borderWidth: 1,
              cornerRadius: 4,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartData, chartOptions]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <canvas ref={chartRef} className="w-full h-64" />
    </div>
  );
};

export default ChartComponent;
