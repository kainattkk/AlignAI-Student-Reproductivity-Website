import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String, default: "Student" },
    email: { type: String, default: "student@example.com" },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      taskReminders: { type: Boolean, default: true },
      meetingReminders: { type: Boolean, default: true },
      newsDigest: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
