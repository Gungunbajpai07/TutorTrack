const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // kept optional to avoid breaking existing data
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
    },
    fees: {
      type: Number,
      required: [true, "Fees amount is required"],
      min: [0, "Fees cannot be negative"],
    },
    paid: {
      type: Number,
      required: [true, "Paid amount is required"],
      min: [0, "Paid amount cannot be negative"],
    },
    date: {
      type: Date,
      required: [true, "Payment date is required"],
      default: Date.now,
    },
    attendance: {
      type: Number,
      default: 0,
      min: [0, "Attendance cannot be negative"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Student", studentSchema);
