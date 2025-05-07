// server.js (ESM)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http"; // Import http
import { Server } from "socket.io"; // Import socket.io
import authRouter from "./routes/authRouter.js";
import tasksRouter from "./routes/taskRouter.js";

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app); // Create HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL, // Allow your frontend origin
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Attach io instance to the app
app.set("io", io);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// MongoDB connection and server start
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
