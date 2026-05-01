import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  deadline: Date,
  priority: Number,
  completed: Boolean,
});

export default mongoose.model("Task", taskSchema);