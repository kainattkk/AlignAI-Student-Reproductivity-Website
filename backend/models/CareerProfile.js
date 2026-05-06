import mongoose from "mongoose";

const careerProfileSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    target_role: { type: String, default: "" },
    skills: { type: String, default: "" },
    interests: { type: String, default: "" },
    experience_level: { type: String, default: "" },
  },
  { timestamps: true }
);

const CareerProfile = mongoose.model("CareerProfile", careerProfileSchema);

export default CareerProfile;
