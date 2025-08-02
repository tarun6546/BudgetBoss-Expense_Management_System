const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    userid: {
      type:String,
      required: [true, "User ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      // enum: ["income", "expense"], // Assuming these are the only two types
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    reference: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    Date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const trasactionModel = mongoose.model("transaction", transactionSchema);
module.exports = trasactionModel;
