import express from "express";

import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  getDashboardStats,
} from "../controllers/application.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { applicationSchema } from "../utils/validators.js";

const applicationRouter = express.Router();

/**
 * Application Routes
 */

// Protected Routes
applicationRouter.post(
  "/",
  authMiddleware,
  validate(applicationSchema),
  createApplication
);

applicationRouter.get("/", authMiddleware, getApplications);

applicationRouter.get("/stats/dashboard", authMiddleware, getDashboardStats);

applicationRouter.put(
  "/:uuid",
  authMiddleware,
  validate(applicationSchema),
  updateApplication
);

applicationRouter.delete("/:uuid", authMiddleware, deleteApplication);

export default applicationRouter;