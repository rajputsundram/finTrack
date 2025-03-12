"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SetBudget() {
  // Form state for current budget values (categories) - initialized with 0
  const [budgets, setBudgets] = useState<Record<string, number>>({
    "Personal/Home": 0,
    Business: 0,
    Others: 0,
  });

  // Month selected (format: yyyy-mm) defaults to current month
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().substring(0, 7)
  );

  // List of saved budget entries, now including an optional _id property from the API
  const [savedBudgets, setSavedBudgets] = useState<
    Array<{ _id?: string; month: string; budgets: Record<string, number> }>
  >([]);
  
  // Track which entry is being edited (-1 means new entry)
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  // Error state (optional)
  const [error, setError] = useState<string>("");

  // Fetch saved budgets from API on mount
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await axios.get("/api/budget");
        setSavedBudgets(res.data.budgets);
      } catch (err) {
        console.error("Error fetching budgets:", err);
        setError("Failed to fetch budgets");
      }
    };

    fetchBudgets();
  }, []);

  // Update a specific category's budget
  const handleBudgetChange = (category: string, value: string): void => {
    setBudgets((prev) => ({
      ...prev,
      [category]: Number(value) || 0,
    }));
  };

  // Update the selected month
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedMonth(e.target.value);
  };

  // Reset form to default state
  const resetForm = (): void => {
    setBudgets({ "Personal/Home": 0, Business: 0, Others: 0 });
    setSelectedMonth(new Date().toISOString().substring(0, 7));
    setEditingIndex(-1);
  };

  // Save budgets: create a new entry or update an existing one via API
  const handleSaveBudgets = async (): Promise<void> => {
    const budgetEntry = { month: selectedMonth, budgets };
    try {
      if (editingIndex === -1) {
        // POST a new budget
        const res = await axios.post("/api/budget", budgetEntry);
        // Append the returned document to the list
        setSavedBudgets((prev) => [...prev, res.data.budget]);
      } else {
        // Get the _id of the entry being edited
        const id = savedBudgets[editingIndex]._id;
        if (!id) return;
        const res = await axios.patch(`/api/budget/${id}`, budgetEntry);
        setSavedBudgets((prev) =>
          prev.map((entry, idx) =>
            idx === editingIndex ? res.data.budget : entry
          )
        );
      }
      // Clear form after successful save
      resetForm();
      setError("");
    } catch (err) {
      console.error("Error saving budget:", err);
      setError("Failed to save budget");
    }
  };

  // Load an existing entry into the form for editing
  const handleEdit = (index: number) => {
    const entry = savedBudgets[index];
    setSelectedMonth(entry.month);
    setBudgets(entry.budgets);
    setEditingIndex(index);
  };

  // Delete an entry via API
  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    try {
      const id = savedBudgets[index]._id;
      if (id) {
        await axios.delete(`/api/budget/${id}`);
      }
      setSavedBudgets((prev) => prev.filter((_, idx) => idx !== index));
      if (editingIndex === index) {
        resetForm();
      }
      setError("");
    } catch (err) {
      console.error("Error deleting budget:", err);
      setError("Failed to delete budget");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Main Page Heading */}
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Budget Settings
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Budget Form */}
        <Card className="flex-1 bg-gray-800 border-gray-700 shadow-lg rounded-lg">
          <CardHeader>
            {/* Updated heading color to white */}
            <CardTitle className="text-2xl font-bold text-white">
              Set Monthly Budgets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Month Selector */}
            <div>
              <Label className="block text-gray-300 mb-1">Select Month</Label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md"
              />
            </div>
            {/* Budget Inputs */}
            <div className="space-y-4">
              {Object.keys(budgets).map((category) => (
                <div key={category}>
                  <Label className="block text-gray-300 mb-1">
                    {category} Budget ($)
                  </Label>
                  <Input
                    type="number"
                    value={budgets[category] || ""}
                    onChange={(e) =>
                      handleBudgetChange(category, e.target.value)
                    }
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md"
                    placeholder="Enter budget"
                  />
                </div>
              ))}
            </div>
            <Button
              onClick={handleSaveBudgets}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 transition-colors rounded-md text-white py-2"
            >
              {editingIndex === -1 ? "Save Budgets" : "Update Budgets"}
            </Button>
          </CardContent>
        </Card>

        {/* Saved Budgets List */}
        <Card className="flex-1 bg-gray-800 border-gray-700 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Saved Budgets
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {savedBudgets.length === 0 ? (
              <p className="text-gray-400">No budgets saved yet.</p>
            ) : (
              <div className="max-h-96 overflow-y-scroll overflow-x-hidden pr-2">
                {savedBudgets.map((entry, index) => (
                  <Card
                    key={index}
                    className="bg-gray-800 border-gray-700 shadow rounded-lg transition-transform hover:scale-105 mb-4"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-white">
                        Month: {entry.month}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 p-4">
                      {Object.entries(entry.budgets).map(([cat, value]) => (
                        <div key={cat} className="flex justify-between">
                          <span className="text-gray-300">{cat}</span>
                          <span className="text-white">${value}</span>
                        </div>
                      ))}
                      <div className="flex space-x-4 mt-4">
                        <Button
                          onClick={() => handleEdit(index)}
                          className="flex-1 bg-green-500 hover:bg-green-600 transition-colors rounded-md text-white py-2"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(index)}
                          className="flex-1 bg-red-500 hover:bg-red-600 transition-colors rounded-md text-white py-2"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
