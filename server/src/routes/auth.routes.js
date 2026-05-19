import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../utils/validators.js";

const authRouter = express.Router();

/**
 * Authentication Routes
 */

// Public Routes with Validation
authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);

// Protected Route
authRouter.get("/me", authMiddleware, getCurrentUser);

export default authRouter;