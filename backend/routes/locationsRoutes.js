import express from "express";
import Location from "../models/Location.js";
import { getRequestedUserEmail } from "../services/googleService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const userEmail = getRequestedUserEmail(req);
  const row = await Location.create({
    userEmail,
    name: String(req.body?.name || "Unknown"),
    productivity_hint: String(req.body?.productivity_hint || ""),
  });
  return res.json({ ...row.toObject(), id: row._id });
});

router.get("/suggestions", async (req, res) => {
  const userEmail = getRequestedUserEmail(req);
  const filter = userEmail ? { userEmail } : {};
  const locations = await Location.find(filter).sort({ createdAt: -1 });
  if (!locations.length) {
    return res.json({
      suggestions: ["Library Quiet Zone: Best for deep work between 9 AM - 12 PM"],
    });
  }
  return res.json({
    suggestions: locations.map((item) => `${item.name}: ${item.productivity_hint || "Good focus zone"}`),
  });
});

export default router;
