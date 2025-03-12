import { NextResponse } from "next/server";
import Budget from "@/lib/models/Budget";
import {dbConnect} from "@/lib/config/db";

export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find().sort({ month: -1 });
    return NextResponse.json({ budgets });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { month, budgets } = await req.json();
    if (!month || !budgets) {
      return NextResponse.json(
        { error: "Month and budgets are required" },
        { status: 400 }
      );
    }
    const newBudget = new Budget({ month, budgets });
    await newBudget.save();
    return NextResponse.json(
      { message: "Budget created", budget: newBudget },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
