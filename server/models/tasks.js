import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"], // Priority levels
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"], // Task status
    default: "Pending",
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a registered user
    ref: "Users",
    required: true,
  },
});

export default mongoose.model("Tasks", tasksSchema);
