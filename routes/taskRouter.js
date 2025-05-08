import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskByFilter,
  getTaskById,
  updateTask,
} from "../controller/taskController.js";

import { Router } from "express";
const router = Router();

router.use(authenticateToken);
router.route("/").get(getAllTasks,getTaskByFilter).post(createTask);
router.route("/:id").get(getTaskById).patch(updateTask).delete(deleteTask);

// router.get("/", getTaskByFilter);

export default router;
