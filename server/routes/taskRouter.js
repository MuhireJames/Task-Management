import express from "express";
import Users from "../models/users.js";
import Tasks from "../models/tasks.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply the middleware to all routes in this router
router.use(authenticateToken);

// Create new task
router.post("/", async (req, res) => {
  try {
    const { assigned_to, ...taskData } = req.body;

    // Create the task
    const task = await Tasks.create({ ...taskData, assigned_to });

    // Notify the assigned user via Socket.IO
    if (assigned_to) {
      const io = req.app.get("io"); // Get the Socket.IO instance from the app
      const user = await Users.findById(assigned_to);

      if (user) {
        io.to(assigned_to).emit("taskAssigned", {
          message: `You have been assigned a new task: ${task.title}`,
          task,
        });
      }
    }

    res.status(201).json({ task });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const username = req.user.username;
    const { priority, status, due_date } = req.query;

    const filters = {
      $or: [{ createdBy: username }, { assigned_to: username }],
    };

    if (priority) filters.priority = priority;
    if (status) filters.status = status;
    if (due_date) filters.due_date = new Date(due_date);

    const tasks = await Tasks.find(filters)
      .sort({ due_date: 1 })
      .populate("assigned_to", "username");

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedTask = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedTask) return res.status(404).json({ msg: "Task not found" });

    const io = req.app.get("io");
    io.emit("taskUpdated", updatedTask);

    res.status(200).json({ msg: "Task modified", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  if (!req.user.role.isAdmin) {
    return res.status(403).json({ error: "Only admins can delete tasks." });
  }

  try {
    const removedTask = await Tasks.findByIdAndDelete(req.params.id);
    if (!removedTask) return res.status(404).json({ msg: "Task not found" });

    res.status(200).json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/assign_task", async (req, res) => {
  const userId = req.user.id;
  const taskId = req.task.id;

  const task = await Tasks.findById(taskId);
  if (!task) return res.status(404).json({ msg: "Tasks not found" });

  const user = await Users.findById(userId);
  if (!user) return res.status(404).json({ msg: "User not found" });

  task.assigned_to = userId;
  await task.save();

  // Emit task assignment event
  const io = req.app.get("io");
  io.to(userId).emit("taskAssigned", {
    message: `You have been assigned a new task: ${task.title}`,
  });

  res.status(200).json({ msg: "Tasks assigned and user notified", task });
});

router.get("/tasks", authenticateToken, async (req, res) => {
  const { priority, status, due_date } = req.query;
  const filters = {};

  if (priority) filters.priority = priority;
  if (status) filters.status = status;
  if (due_date) filters.due_date = new Date(due_date);

  try {
    const tasks = await Tasks.find(filters);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
