import express from "express";
import Setting from "../models/Setting.js";
import { getRequestedUserEmail } from "../services/googleService.js";

const router = express.Router();

const defaultSettings = {
  username: "Student",
  email: "student@example.com",
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    meetingReminders: true,
    newsDigest: false,
  },
};

router.get("/", async (req, res) => {
  const userEmail = getRequestedUserEmail(req) || "anonymous@local";
  const settings = await Setting.findOneAndUpdate(
    { userEmail },
    { $setOnInsert: { ...defaultSettings, userEmail, email: userEmail } },
    { new: true, upsert: true }
  );
  return res.json(settings);
});

router.put("/", async (req, res) => {
  const userEmail = getRequestedUserEmail(req) || "anonymous@local";
  const payload = req.body || {};
  await Setting.findOneAndUpdate(
    { userEmail },
    { $set: { ...payload, userEmail } },
    { upsert: true, new: true }
  );
  return res.json({ message: "Settings saved", data: payload });
});

export default router;
