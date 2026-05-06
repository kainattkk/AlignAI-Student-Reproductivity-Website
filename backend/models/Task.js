import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    due_date: { type: Date, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ["high", "medium", "low"], default: "low" },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
