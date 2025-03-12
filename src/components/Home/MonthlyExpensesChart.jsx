"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export default function MonthlyExpensesChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await axios.get("/api/transaction");
        const transactions = response.data?.transactions || [];
        
        // Initialize month mapping for all 12 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthMap = {};
        months.forEach((m) => {
          monthMap[m] = 0;
        });

        // Sum the amounts for each month based on transaction date
        transactions.forEach((tx) => {
          const date = new Date(tx.date);
          const month = date.toLocaleString("default", { month: "short" });
          monthMap[month] += Number(tx.amount) || 0;
        });

        // Convert monthMap to an array suitable for Recharts
        const chartData = months.map((m) => ({
          month: m,
          expenses: monthMap[m],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching transactions data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">📊 Monthly Expenses</h2>
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">📊 Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <XAxis dataKey="month" stroke="#ddd" />
          <YAxis stroke="#ddd" />
          <Tooltip contentStyle={{ backgroundColor: "#333", borderRadius: "8px", color: "#fff" }} />
          <Legend />
          <Bar dataKey="expenses" fill="#4F46E5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
