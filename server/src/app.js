import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import applicationRouter from "./routes/application.route.js";

const app = express();

/**
 * Middleware Configuration
 */
app.use(cors());
app.use(express.json());

/**
 * Public Routes
 */

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TrackHire API is running successfully",
    version: "1.0.0",
  });
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRouter);

/**
 * 404 - Not Found Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;