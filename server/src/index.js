import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import applicationRouter from "./routes/application.route.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route to verify server is running
app.get("/", (req, res) => {
  res.json({ message: "TrackHire API Running" });
});

app.get("/api/auth/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 