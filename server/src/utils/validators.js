import { z } from "zod";

/**
 * Auth Validators
 */
export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z.string()
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

/**
 * Application Validators
 */
export const applicationSchema = z.object({
  company: z.string()
    .trim()
    .min(2, "Company name is required")
    .max(100, "Company name is too long"),

  position: z.string()
    .trim()
    .min(2, "Job position is required")
    .max(150, "Job position is too long"),

  status: z.enum(["Applied", "Interview", "Accepted", "Rejected"], {
    errorMap: () => ({ message: "Status must be one of: Applied, Interview, Accepted, Rejected" }),
  }),

  applicationDate: z.string().optional().nullable().transform(val => val || null),

  jobLink: z.string()
    .url("Job link must be a valid URL")
    .optional()
    .nullable()
    .transform(val => val || null),

  notes: z.string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .nullable()
    .transform(val => val || null),
});