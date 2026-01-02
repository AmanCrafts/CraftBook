import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../user/user.repository.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "craftbook-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

/**
 * Auth Service - Handles authentication logic
 */

/**
 * Register a new user
 */
export async function register({ email, password, name }) {
  if (!email || !password || !name) {
    throw new Error("Email, password, and name are required");
  }

  // Check if user already exists
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await userRepository.create({
    email,
    password: hashedPassword,
    name,
  });

  // Generate token
  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

/**
 * Login user
 */
export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

/**
 * Verify token and get user
 */
export async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return sanitizeUser(user);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

/**
 * Generate JWT token
 */
function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Remove sensitive data from user object
 */
function sanitizeUser(user) {
  const { password, ...sanitized } = user;
  return sanitized;
}

export default {
  register,
  login,
  verifyToken,
};
