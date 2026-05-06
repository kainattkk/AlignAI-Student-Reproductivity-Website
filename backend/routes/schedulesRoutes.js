import express from "express";
import Schedule from "../models/Schedule.js";
import { getRequestedUserEmail } from "../services/googleService.js";

const router = express.Router();

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

router.post("/", async (req, res) => {
  const startDate = toDate(req.body?.start_at);
  const endDate = toDate(req.body?.end_at);
  if (!startDate || !endDate || endDate <= startDate) {
    return res.status(400).json({ detail: "Invalid start_at or end_at" });
  }

  const userEmail = getRequestedUserEmail(req);
  const filter = {
    ...(userEmail ? { userEmail } : {}),
    start_at: { $lt: endDate.toISOString() },
    end_at: { $gt: startDate.toISOString() },
  };
  const hasConflict = await Schedule.exists(filter);
  if (hasConflict) {
    return res.status(409).json({ detail: "Schedule conflict detected" });
  }

  const row = await Schedule.create({
    userEmail,
    title: String(req.body?.title || "Untitled"),
    category: String(req.body?.category || "general"),
    start_at: startDate,
    end_at: endDate,
    location: String(req.body?.location || ""),
  });
  return res.json({ ...row.toObject(), id: row._id });
});

router.get("/", async (req, res) => {
  const userEmail = getRequestedUserEmail(req);
  const filter = userEmail ? { userEmail } : {};
  const schedules = await Schedule.find(filter).sort({ start_at: 1, createdAt: -1 });
  return res.json(schedules.map((item) => ({ ...item.toObject(), id: item._id })));
});

router.get("/available-slots", async (req, res) => {
  const fromAt = toDate(req.query.from_at);
  const toAt = toDate(req.query.to_at);
  const durationMinutes = Number(req.query.duration_minutes || 60);

  if (!fromAt || !toAt || toAt <= fromAt || durationMinutes <= 0) {
    return res.status(400).json({ detail: "Invalid range or duration_minutes" });
  }

  const durationMs = durationMinutes * 60 * 1000;
  const userEmail = getRequestedUserEmail(req);
  const filter = userEmail ? { userEmail } : {};
  const schedules = await Schedule.find(filter).sort({ start_at: 1 });
  const events = schedules
    .map((item) => ({ ...item.toObject(), startDate: toDate(item.start_at), endDate: toDate(item.end_at) }))
    .filter((item) => item.startDate && item.endDate && item.startDate >= fromAt && item.endDate <= toAt)
    .sort((a, b) => a.startDate - b.startDate);

  const slots = [];
  let pointer = fromAt.getTime();
  events.forEach((event) => {
    const eventStart = event.startDate.getTime();
    const eventEnd = event.endDate.getTime();
    if (eventStart - pointer >= durationMs) {
      slots.push({
        start_at: new Date(pointer).toISOString(),
        end_at: new Date(pointer + durationMs).toISOString(),
      });
    }
    pointer = Math.max(pointer, eventEnd);
  });

  if (toAt.getTime() - pointer >= durationMs) {
    slots.push({
      start_at: new Date(pointer).toISOString(),
      end_at: new Date(pointer + durationMs).toISOString(),
    });
  }

  return res.json({ slots });
});

export default router;
