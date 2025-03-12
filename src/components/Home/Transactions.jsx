"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category: "Personal/Home",
    id: null,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🔹 Fetch Transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/transaction");
      setTransactions(data.transactions);
      setLoading(false);
    } catch (err) {
      setError("Failed to load transactions");
      setLoading(false);
    }
  };

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.description || !formData.category) return;

    try {
      if (!formData.id) {  // Adding a new transaction
        const { data } = await axios.post("/api/transaction", {
          amount: formData.amount,
          date: formData.date,
          description: formData.description,
          category: formData.category,
        });
        setTransactions([...transactions, data.transaction]);
      } else { // Updating an existing transaction
        console.log("Updating Transaction with ID:", formData.id);
        const { data } = await axios.patch(`/api/transaction/${formData.id}`, {
          amount: formData.amount,
          date: formData.date,
          description: formData.description,
          category: formData.category,
        });
        setTransactions(
          transactions.map((t) => (t._id === formData.id ? data.transaction : t))
        );
      }
      resetForm();
    } catch (err) {
      console.error("Error saving transaction:", err);
      setError("Failed to save transaction");
    }
  };

  // 🔹 Edit Transaction
  const handleEdit = (transaction) => {
    // Format the date to show YYYY-MM-DD in the input.
    const formattedDate = transaction.date ? transaction.date.split("T")[0] : "";
    setFormData({
      amount: transaction.amount,
      date: formattedDate,
      description: transaction.description,
      category: transaction.category,
      id: transaction._id, // use _id as the identifier
    });
    setOpen(true);
  };

  // 🔹 Delete Transaction
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await axios.delete(`/api/transaction/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      setError("Failed to delete transaction");
    }
  };

  // 🔹 Reset Form
  const resetForm = () => {
    setFormData({
      amount: "",
      date: "",
      description: "",
      category: "Personal/Home",
      id: null,
    });
    setOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 mt-36 text-white bg-gray-900">
      <Card className="bg-gray-800 text-white border-gray-700">
        <CardHeader>
          <CardTitle>Manage Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Transactions List</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">Add Transaction</Button>
              </DialogTrigger>
              {/* Use a key so the Dialog re-renders when formData changes */}
              <DialogContent key={formData.id || "new"} className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>{formData.id ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                      value={formData.category}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        <SelectItem value="Personal/Home">Personal/Home</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                    {formData.id ? "Update" : "Add"} Transaction
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Table className="border border-gray-700">
            <TableHeader>
              <TableRow className="bg-gray-700">
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction._id} className="border-gray-700">
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(transaction)}
                        className="border-gray-500 text-gray-300"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(transaction._id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
