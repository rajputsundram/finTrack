import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  month: { type: String, required: true },
  budgets: { type: Map, of: Number, required: true }
});

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
