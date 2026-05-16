import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../db/db.js";
import { users } from "../schema/users.js";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    // Validate input
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
      
    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login an existing user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const user = existingUser[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate a JWT tokenfor the authenticated user
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get current logged-in user profile
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const userId = req.user.id;

    // Fetch user from database (exclude password for security)
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};