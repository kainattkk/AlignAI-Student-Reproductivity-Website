import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "meeting" },
    start_at: { type: Date, required: true },
    end_at: { type: Date, required: true },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

const CalendarEvent = mongoose.model("CalendarEvent", calendarEventSchema);

export default CalendarEvent;
