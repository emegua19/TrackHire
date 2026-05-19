import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Hash a plain text password securely
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compare plain password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generate JWT access token
 * @param {Object} payload - Data to encode in token (usually {uuid, email})
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};