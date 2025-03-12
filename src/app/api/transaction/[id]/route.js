import { NextResponse } from "next/server";
import TransactionModel from "@/lib/models/Transaction";
import { dbConnect } from "@/lib/config/db";

// 🔹 UPDATE Transaction (PATCH)
export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    // Await params in case it's a promise (to silence the warning)
    const awaitedParams = await Promise.resolve(params);
    const id = awaitedParams.id;
    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const updatedData = await req.json();
    const updatedTransaction = await TransactionModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction updated", transaction: updatedTransaction }, { status: 200 });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🔹 DELETE Transaction
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    // Await params in case it's a promise
    const awaitedParams = await Promise.resolve(params);
    const id = awaitedParams.id;
    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const deletedTransaction = await TransactionModel.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
