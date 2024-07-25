const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    completed: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
  // { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
