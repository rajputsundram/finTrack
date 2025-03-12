"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#FACC15", "#EF4444", "#34D399"];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="p-2 rounded-lg"
        style={{
          backgroundColor: "#333",
          color: "#fff",
          border: "1px solid #444",
        }}
      >
        <p className="font-bold">{label}</p>
        <p>{`${payload[0].name} : $${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryWisePieChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const response = await axios.get("/api/transaction");
        const transactions = response.data?.transactions || [];

        // Group transactions by category
        const categoryMap = {};
        transactions.forEach(({ category, amount }) => {
          if (categoryMap[category]) {
            categoryMap[category] += amount;
          } else {
            categoryMap[category] = amount;
          }
        });

        // Convert to array format
        const formattedData = Object.entries(categoryMap).map(([category, amount]) => ({
          category,
          amount,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching category data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full mx-auto">
        <h2 className="text-3xl font-extrabold text-blue-400 text-center mb-6">
          📊 Category-wise Expenses
        </h2>
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full mx-auto">
        <h2 className="text-3xl font-extrabold text-blue-400 text-center mb-6">
          📊 Category-wise Expenses
        </h2>
        <p className="text-center">No data available.</p>
      </div>
    );
  }

  // Compute total for accurate percentage calculation
  const totalAmount = data.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full mx-auto">
      <h2 className="text-3xl font-extrabold  text-center mb-6">
        📊 Category-wise Expenses
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ payload }) =>
              `${payload.category} (${((payload.amount / totalAmount) * 100).toFixed(1)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "#fff", fontSize: "14px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
