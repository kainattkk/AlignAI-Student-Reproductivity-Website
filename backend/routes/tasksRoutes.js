import express from "express";
import Task from "../models/Task.js";
import { getRequestedUserEmail } from "../services/googleService.js";

const router = express.Router();

const calculatePriority = (dueDateValue, progressValue) => {
  const dueDate = new Date(dueDateValue);
  if (Number.isNaN(dueDate.getTime())) return "low";
  const progress = Number(progressValue || 0);
  const daysLeft = (dueDate.getTime() - Date.now()) / (24 * 3600 * 1000);
  if (daysLeft <= 1 || progress < 30) return "high";
  if (daysLeft <= 3 || progress < 70) return "medium";
  return "low";
};

router.post("/", async (req, res) => {
  const userEmail = getRequestedUserEmail(req);
  const dueDate = String(req.body?.due_date || new Date().toISOString());
  const progress = Number(req.body?.progress || 0);

  const task = await Task.create({
    userEmail,
    title: String(req.body?.title || "Untitled"),
    description: String(req.body?.description || ""),
    due_date: dueDate,
    progress,
    completed: Boolean(req.body?.completed || false),
    priority: calculatePriority(dueDate, progress),
  });
  return res.json({ ...task.toObject(), id: task._id });
});

router.get("/", async (req, res) => {
  const userEmail = getRequestedUserEmail(req);
  const filter = userEmail ? { userEmail } : {};
  const tasks = await Task.find(filter).sort({ due_date: 1, createdAt: -1 });
  return res.json(tasks.map((task) => ({ ...task.toObject(), id: task._id })));
});

router.patch("/:task_id", async (req, res) => {
  const { task_id: taskId } = req.params;
  const userEmail = getRequestedUserEmail(req);
  const filter = userEmail ? { _id: taskId, userEmail } : { _id: taskId };
  const task = await Task.findOne(filter);
  if (!task) {
    return res.status(404).json({ detail: "Task not found" });
  }
  const patch = req.body || {};
  Object.keys(patch).forEach((key) => {
    task.set(key, patch[key]);
  });
  task.priority = calculatePriority(task.due_date, task.progress);
  await task.save();
  return res.json({ ...task.toObject(), id: task._id });
});

router.delete("/:task_id", async (req, res) => {
  const { task_id: taskId } = req.params;
  const userEmail = getRequestedUserEmail(req);
  const filter = userEmail ? { _id: taskId, userEmail } : { _id: taskId };
  const deleted = await Task.findOneAndDelete(filter);
  if (!deleted) {
    return res.status(404).json({ detail: "Task not found" });
  }
  return res.json({ message: "Task deleted" });
});

router.post("/:task_id/complete", async (req, res) => {
  const { task_id: taskId } = req.params;
  const userEmail = getRequestedUserEmail(req);
  const filter = userEmail ? { _id: taskId, userEmail } : { _id: taskId };
  const task = await Task.findOne(filter);
  if (!task) {
    return res.status(404).json({ detail: "Task not found" });
  }
  task.completed = true;
  task.progress = 100;
  task.priority = calculatePriority(task.due_date, task.progress);
  await task.save();
  return res.json({ ...task.toObject(), id: task._id });
});

export default router;
