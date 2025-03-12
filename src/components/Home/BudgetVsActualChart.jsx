"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function BarChartComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetResponse, transactionResponse] = await Promise.all([
          axios.get("/api/budget"),
          axios.get("/api/transaction"),
        ]);

        const budgetData = budgetResponse.data;
        const budgetDocs = Array.isArray(budgetData.budgets) ? budgetData.budgets : [];

        if (budgetDocs.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const budgetDoc = budgetDocs[0];
        if (!budgetDoc || !budgetDoc.budgets) {
          setData([]);
          setLoading(false);
          return;
        }

        const budgetsObj = budgetDoc.budgets;
        const transactionsData = transactionResponse.data;
        const transactionsArray = Array.isArray(transactionsData.transactions)
          ? transactionsData.transactions
          : [];

        const combinedData = Object.entries(budgetsObj).map(([category, budgetAmount]) => {
          const totalSpent = transactionsArray
            .filter((tx) => tx.category === category)
            .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

          return {
            category,
            Budget: Number(budgetAmount) || 0,
            Actual: totalSpent,
          };
        });

        setData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700 shadow-2xl rounded-xl p-6 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400 tracking-wide text-center">
          💰 Budget vs Actual Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            <p className="mt-4 text-gray-400">Fetching data...</p>
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
              <XAxis dataKey="category" stroke="#ccc" tick={{ fill: "#ccc", fontSize: 14 }} />
              <YAxis stroke="#ccc" tick={{ fill: "#ccc", fontSize: 14 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  color: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "10px",
                }}
              />
              <Legend
                wrapperStyle={{ color: "#fff", fontSize: "14px", marginBottom: "10px" }}
                iconType="circle"
              />
              <Bar
                dataKey="Budget"
                fill="url(#budgetGradient)"
                radius={[10, 10, 0, 0]}
                barSize={45}
              />
              <Bar
                dataKey="Actual"
                fill="url(#actualGradient)"
                radius={[10, 10, 0, 0]}
                barSize={45}
              />
              <defs>
                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <p>No data available to display the chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
