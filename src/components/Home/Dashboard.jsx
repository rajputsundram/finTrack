"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, TrendingUp, List } from "lucide-react";

// Custom tooltip component to ensure white text
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
        <p>{`${payload[0].name}: $${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions data from the backend API
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await axios.get("/api/transaction");
        // Expecting an object with a `transactions` array
        const fetchedTransactions = response.data?.transactions || [];
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  // Compute total expenses from the fetched transactions
  const totalExpenses = transactions.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0
  );

  // Group transactions by category for the pie chart breakdown
  const categoryMap = {};
  transactions.forEach((tx) => {
    const cat = tx.category;
    const amt = Number(tx.amount || 0);
    if (categoryMap[cat]) {
      categoryMap[cat] += amt;
    } else {
      categoryMap[cat] = amt;
    }
  });
  // Convert the grouped data into an array format for Recharts
  const categories = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
  }));

  // Define colors for the pie chart
  const COLORS = ["#4F46E5", "#22C55E", "#FACC15", "#EF4444", "#34D399"];

  // Sort transactions by date descending (assuming ISO format)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  // Get the most recent 3 transactions
  const recentTransactions = sortedTransactions.slice(0, 3);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 text-white">
        <h1 className="text-3xl font-extrabold text-blue-400 text-center mb-8">
          📊 Dashboard
        </h1>
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 mt-10 text-white">
      <h1 className="text-3xl font-extrabold text-white text-center mb-8">
        📊 Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Expenses Card */}
        <Card className="w-full bg-gray-800 text-white border border-gray-700 shadow-2xl rounded-xl">
          <CardHeader className="flex items-center space-x-4">
            <DollarSign className="text-blue-400" size={32} />
            <CardTitle className="text-xl">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-semibold">${totalExpenses}</p>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown Card */}
        <Card className="w-full bg-gray-800 text-white border border-gray-700 shadow-2xl rounded-xl">
          <CardHeader className="flex items-center space-x-4">
            <TrendingUp className="text-green-400" size={32} />
            <CardTitle className="text-xl">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ payload, percent }) =>
                    `${payload.category} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  layout="horizontal"
                  wrapperStyle={{ fontSize: "0.875rem", color: "#fff", marginTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions Card */}
        <Card className="w-full bg-gray-800 text-white border border-gray-700 shadow-2xl rounded-xl overflow-x-auto">
          <CardHeader className="flex items-center space-x-4">
            <List className="text-yellow-400" size={32} />
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="border border-gray-700 w-full">
              <TableHeader>
                <TableRow className="bg-gray-700">
                  <TableHead className="px-2 py-1">Date</TableHead>
                  <TableHead className="px-2 py-1">Description</TableHead>
                  <TableHead className="px-2 py-1">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="px-2 py-1 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="px-2 py-1 whitespace-normal break-words">
                      {transaction.description}
                    </TableCell>
                    <TableCell className="px-2 py-1 font-semibold whitespace-nowrap">
                      ${transaction.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
