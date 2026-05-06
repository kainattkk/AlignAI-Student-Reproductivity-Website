import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    productivity_hint: { type: String, default: "" },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;
