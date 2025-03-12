
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Personal/Home", "Business", "Others"],
    required: true,
  },
});

// Use existing model if it exists, otherwise create a new one
const TransactionModel = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default TransactionModel;
