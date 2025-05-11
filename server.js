import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "node:url";
import path from "path";

import authRouter from "./routes/authRouter.js";
import taskRouter from "./routes/taskRouter.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
const __dirname = dirname(fileURLToPath(import.meta.url));
const clientBuildPath = path.join(__dirname, "./client/dist");

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.set("io", io);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

// Serve static files from the frontend build
app.use(express.static(clientBuildPath));

// Catch-all route to serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(clientBuildPath, "index.html"));
});

// Handle 404 for undefined API routes
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Not found" });
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL, { useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
