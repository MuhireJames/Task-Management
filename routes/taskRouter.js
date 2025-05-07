import express from "express";

import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskByFilter,
  getTaskById,
  updateTask,
} from "../controller/taskController.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/", getTaskByFilter);

export default router;
