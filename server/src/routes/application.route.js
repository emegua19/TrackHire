import express, { application } from "express";

import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  getDashboardStats,
} from "../controllers/application.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const applicationRouter = express.Router();

applicationRouter.post("/", authMiddleware, createApplication);
applicationRouter.get("/", authMiddleware, getApplications);
applicationRouter.put("/:id", authMiddleware, updateApplication);
applicationRouter.delete("/:id", authMiddleware, deleteApplication);
applicationRouter.get("/stats/dashboard", authMiddleware, getDashboardStats);

export default applicationRouter;