const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: [true, "User ID is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
    },
    period: {
      type: String,
      enum: ["monthly", "weekly", "yearly"],
      default: "monthly",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const budgetModel = mongoose.model("budget", budgetSchema);
module.exports = budgetModel; 