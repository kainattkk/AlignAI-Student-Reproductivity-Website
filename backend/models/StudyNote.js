import mongoose from "mongoose";

const studyNoteSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

const StudyNote = mongoose.model("StudyNote", studyNoteSchema);

export default StudyNote;
