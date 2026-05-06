import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    file_path: { type: String, required: true },
  },
  { timestamps: true }
);

const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);

export default StudyMaterial;
