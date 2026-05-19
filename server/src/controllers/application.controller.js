import { db } from "../db/db.js";
import { applications } from "../schema/applications.js";
import { eq, and, sql } from "drizzle-orm";

/**
 * Application Controller
 */

export const createApplication = async (req, res) => {
  try {
    const { company, position, status, applicationDate, jobLink, notes } = req.body;

    await db.insert(applications).values({
      userId: req.user.uuid,
      company,
      position,
      status,
      applicationDate,
      jobLink,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Application created successfully",
    });
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create application",
    });
  }
};

export const getApplications = async (req, res) => {
  try {
    const userApplications = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, req.user.uuid))
      .orderBy(applications.createdAt, "desc"); // New: Sort by latest first

    res.status(200).json({
      success: true,
      data: userApplications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { company, position, status, applicationDate, jobLink, notes } = req.body;

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
          eq(applications.uuid, uuid),
          eq(applications.userId, req.user.uuid)
        )
      );

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
    });
  } catch (error) {
    console.error("Update Application Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application",
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { uuid } = req.params;

    await db
      .delete(applications)
      .where(
        and(
          eq(applications.uuid, uuid),
          eq(applications.userId, req.user.uuid)
        )
      );

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete application",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.uuid;

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
      success: true,
      data: {
        totalApplications: totalApplications[0]?.count || 0,
        acceptedApplications: acceptedApplications[0]?.count || 0,
        rejectedApplications: rejectedApplications[0]?.count || 0,
        interviewsScheduled: interviewsScheduled[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};