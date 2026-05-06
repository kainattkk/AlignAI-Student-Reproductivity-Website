import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "general" },
    start_at: { type: Date, required: true },
    end_at: { type: Date, required: true },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
