"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SpendingInsights() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch and combine budget + transaction data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch budget and transaction endpoints concurrently
        const [budgetResponse, transactionResponse] = await Promise.all([
          axios.get("/api/budget"),
          axios.get("/api/transaction"),
        ]);

        console.info("Budget API Response:", budgetResponse.data);
        console.info("Transaction API Response:", transactionResponse.data);

        // 1) Extract the budgets array
        // budgetResponse.data should be: { budgets: [ { budgets: {...} }, ... ] }
        const budgetDocs = budgetResponse.data?.budgets || [];
        if (!Array.isArray(budgetDocs) || budgetDocs.length === 0) {
          console.error("No budget documents found");
          setData([]);
          setLoading(false);
          return;
        }

        // 2) Pick the first budget document (or filter by month if needed)
        const budgetDoc = budgetDocs[0];
        if (!budgetDoc || !budgetDoc.budgets) {
          console.error("Budget document missing 'budgets' field");
          setData([]);
          setLoading(false);
          return;
        }

        // budgets object, e.g. { "Personal/Home": 1000, "Business": 1500, "Others": 500 }
        const budgetsObj = budgetDoc.budgets;

        // 3) Extract the transactions array
        // transactionResponse.data should be: { transactions: [ {...}, ... ] }
        const transactionsArray = transactionResponse.data?.transactions || [];

        // 4) Build an array of { category, Budget, Actual }
        const combinedData = Object.entries(budgetsObj).map(([category, budgetAmount]) => {
          // Sum transaction amounts matching this category
          const totalSpent = transactionsArray
            .filter((tx) => tx.category === category)
            .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

          return {
            category,
            Budget: Number(budgetAmount) || 0,
            Actual: totalSpent,
          };
        });

        console.log("Combined Data:", combinedData);
        setData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Compute totals from the fetched data
  const totalBudget = data.reduce((sum, item) => sum + item.Budget, 0);
  const totalActual = data.reduce((sum, item) => sum + item.Actual, 0);
  const overspent = totalActual > totalBudget;
  // Avoid division by zero if totalBudget is 0
  const percentageSpent =
    totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;

  if (loading) {
    return (
      <Card className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-400">
            💸 Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-400">
            💸 Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-xl p-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-blue-400">
          💸 Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Budget vs Actual */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div className="text-center">
            <p className="text-sm text-gray-400">Total Budget</p>
            <p className="text-xl font-semibold text-blue-400">
              ${totalBudget}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Total Actual</p>
            <p
              className={`text-xl font-semibold ${
                overspent ? "text-red-400" : "text-green-400"
              }`}
            >
              ${totalActual}
            </p>
          </div>
        </div>

        {/* Overall Spending Progress */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-400 mb-2">Overall Spending Progress</p>
          <div className="relative">
            <Progress value={percentageSpent} className="h-4 bg-gray-700 rounded-full" />
            <p className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
              {percentageSpent}% of Budget Used
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          {data.map((item, index) => {
            const spentPercent = item.Budget > 0
              ? Math.round((item.Actual / item.Budget) * 100)
              : 0;

            return (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-gray-300">{item.category}</p>
                  <p
                    className={`text-sm font-semibold ${
                      item.Actual > item.Budget ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {spentPercent}%
                  </p>
                </div>
                <Progress value={spentPercent} className="h-2 bg-gray-700" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
