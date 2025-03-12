import { NextResponse } from "next/server";

import TransactionModel from "../../../lib/models/Transaction"; // Ensure correct path
import {dbConnect} from "../../../lib/config/db"; // Ensure you have a database connection utility

// 🔹 CREATE Transaction (POST)
export async function POST(req) {
  try {
    await dbConnect();
    const { amount, date, description, category } = await req.json();

    if (!amount || !description || !category) {
      return NextResponse.json(
        { error: "Amount, description, and category are required" },
        { status: 400 }
      );
    }

    const newTransaction = new TransactionModel({
      amount,
      date: date ? new Date(date) : new Date(),
      description,
      category,
    });

    await newTransaction.save();

    return NextResponse.json(
      { message: "Transaction saved successfully", transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🔹 READ All Transactions (GET)
export async function GET() {
  try {
    await dbConnect();
    const transactions = await TransactionModel.find().sort({ date: -1 }); // Sort by latest
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
