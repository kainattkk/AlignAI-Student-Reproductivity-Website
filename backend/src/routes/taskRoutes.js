import express from "express";
import { createTask, getTasks } from "../controllers/taskController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createTask);
router.get("/", auth, getTasks);

export default router;