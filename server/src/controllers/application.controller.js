import { db } from "../db/db.js";
import { applications } from "../schema/applications.js";
import { eq, and, sql } from "drizzle-orm";

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const {
      company,
      position,
      status,
      applicationDate,
      jobLink,
      notes,
    } = req.body;

    await db.insert(applications).values({
      userId: req.user.id,
      company,
      position,
      status,
      applicationDate,
      jobLink,
      notes,
    });

    res.status(201).json({
      message: "Application created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all applications for the authenticated user
export const getApplications = async (req, res) => {
  try {
    const userApplications = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, req.user.id));

    res.status(200).json(userApplications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update an existing application
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company,
      position,
      status,
      applicationDate,
      jobLink,
      notes,
    } = req.body;

    await db
      .update(applications)
      .set({
        company,
        position,
        status,
        applicationDate,
        jobLink,
        notes,
      })
      .where(
        and(
          eq(applications.id, Number(id)),
          eq(applications.userId, req.user.id)
        )
      );

    res.status(200).json({
      message: "Application updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete an application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .delete(applications)
      .where(
        and(
          eq(applications.id, Number(id)),
          eq(applications.userId, req.user.id)
        )
      );

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get dashboard statistics for the authenticated user
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalApplications = await db
      .select({ count: sql`count(*)` })
      .from(applications)
      .where(eq(applications.userId, userId));

    const acceptedApplications = await db
      .select({ count: sql`count(*)` })
      .from(applications)
      .where(
        and(
          eq(applications.userId, userId),
          eq(applications.status, "Accepted")
        )
      );

    const rejectedApplications = await db
      .select({ count: sql`count(*)` })
      .from(applications)
      .where(
        and(
          eq(applications.userId, userId),
          eq(applications.status, "Rejected")
        )
      );

    const interviewsScheduled = await db
      .select({ count: sql`count(*)` })
      .from(applications)
      .where(
        and(
          eq(applications.userId, userId),
          eq(applications.status, "Interview")
        )
      );

    res.status(200).json({
      totalApplications: totalApplications[0].count,
      acceptedApplications: acceptedApplications[0].count,
      rejectedApplications: rejectedApplications[0].count,
      interviewsScheduled: interviewsScheduled[0].count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};