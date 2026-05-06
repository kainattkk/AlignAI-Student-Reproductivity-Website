import mongoose from "mongoose";

const emailMessageSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      index: true,
    },
    externalId: { type: String, default: "", index: true },
    from: { type: String, default: "Unknown" },
    subject: { type: String, default: "(no subject)" },
    preview: { type: String, default: "" },
    read: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const EmailMessage = mongoose.model("EmailMessage", emailMessageSchema);

export default EmailMessage;
