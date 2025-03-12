import { NextResponse } from "next/server";
import Budget from "@/lib/models/Budget";
import {dbConnect} from "@/lib/config/db";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }
    const updatedData = await req.json();
    const updatedBudget = await Budget.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedBudget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Budget updated", budget: updatedBudget },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }
    const deletedBudget = await Budget.findByIdAndDelete(id);
    if (!deletedBudget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Budget deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
