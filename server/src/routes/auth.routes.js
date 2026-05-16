import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,  // ← Add this import
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";  // ← Add this import

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);  // ← Add this route

export default router;