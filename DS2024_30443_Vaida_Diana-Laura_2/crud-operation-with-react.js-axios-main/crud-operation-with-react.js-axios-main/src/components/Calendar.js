import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";

const EnergyConsumptionChart = ({ deviceId }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [chartType, setChartType] = useState("line"); 

  useEffect(() => {
    if (deviceId && selectedDate) {
      fetchEnergyData();
    }
  }, [deviceId, selectedDate]);

  const fetchEnergyData = async () => {
    try {
      const response = await axios.get(`/event`);
      const data = response.data;

      
      const hours = [];
      const energyValues = [];

      data.forEach((record) => {
        const hour = new Date(record.hour * 1000).getHours(); 
        hours.push(`${hour}:00`);
        energyValues.push(record.energyConsumption);
      });

      setChartData({
        labels: hours,
        datasets: [
          {
            label: "Energy Consumption (kWh)",
            data: energyValues,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching energy data:", error);
    }
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h2>Energy Consumption Chart</h2>
      
      {}
      <label>
        Select Date:{" "}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>

      {}
      <div>
        <button onClick={() => setChartType("line")}>Line Chart</button>
        <button onClick={() => setChartType("bar")}>Bar Chart</button>
      </div>

      {}
      {chartData ? (
        chartType === "line" ? (
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        ) : (
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        )
      ) : (
        <p>Please select a date to view data.</p>
      )}
    </div>
  );
};

export default EnergyConsumptionChart;
