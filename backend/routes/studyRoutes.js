import express from "express";
import StudyMaterial from "../models/StudyMaterial.js";
import StudyNote from "../models/StudyNote.js";
import { getRequestedUserEmail } from "../services/googleService.js";

const router = express.Router();

router.post("/materials/upload", async (req, res) => {
  const userEmail = getRequestedUserEmail(req);
  const fileName = String(req.body?.filename || "uploaded-file");
  const row = await StudyMaterial.create({
    userEmail,
    title: fileName,
    file_path: `uploads/${Date.now()}_${fileName}`,
  });
  return res.json({ ...row.toObject(), id: row._id });
});

router.post("/notes", async (req, res) => {
  const userEmail = getRequestedUserEmail(req);
  const row = await StudyNote.create({
    userEmail,
    title: String(req.body?.title || "Untitled"),
    content: String(req.body?.content || ""),
  });
  return res.json({ ...row.toObject(), id: row._id });
});

router.get("/notes", async (req, res) => {
  const userEmail = getRequestedUserEmail(req);
  const filter = userEmail ? { userEmail } : {};
  const notes = await StudyNote.find(filter).sort({ createdAt: -1 });
  if (!notes.length) {
    return res.json([{ id: "fallback-note", title: "Revision Plan", content: "Focus on algorithms and DBMS this week." }]);
  }
  return res.json(notes.map((note) => ({ ...note.toObject(), id: note._id })));
});

router.post("/ask", (req, res) => {
  const question = String(req.body?.question || "");
  const answer = question ? `AI assistant insight: ${question}` : "AI assistant insight: Please share your question.";
  return res.json({ answer });
});

router.post("/summarize", (req, res) => {
  const text = String(req.body?.question || "");
  return res.json({ answer: `Summary: ${text.slice(0, 180)}` });
});

router.post("/quiz", (req, res) => {
  const text = String(req.body?.question || "");
  return res.json({ answer: `Quiz based on: ${text}` });
});

export default router;
