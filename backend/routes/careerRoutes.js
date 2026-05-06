import express from "express";
import CareerProfile from "../models/CareerProfile.js";
import { getRequestedUserEmail } from "../services/googleService.js";

const router = express.Router();

router.post("/profile", async (req, res) => {
  const userEmail = getRequestedUserEmail(req) || "anonymous@local";
  const payload = req.body || {};
  const profile = await CareerProfile.findOneAndUpdate(
    { userEmail },
    {
      $set: {
        userEmail,
        target_role: String(payload.target_role || ""),
        skills: String(payload.skills || ""),
        interests: String(payload.interests || ""),
        experience_level: String(payload.experience_level || ""),
      },
    },
    { upsert: true, new: true }
  );
  return res.json(profile);
});

router.get("/recommendations", async (req, res) => {
  const userEmail = getRequestedUserEmail(req) || "anonymous@local";
  const profile = await CareerProfile.findOne({ userEmail });
  const skill = profile?.skills || "your strengths";
  return res.json({
    recommendations: [`Build projects around ${skill}`, "Apply to 3 internships weekly"],
  });
});

export default router;
