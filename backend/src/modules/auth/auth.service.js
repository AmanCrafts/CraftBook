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
  } catch {
    throw new Error("Invalid or expired token");
  }
}

/**
 * Change user email
 */
export async function changeEmail(userId, newEmail, currentPassword) {
  if (!newEmail || !currentPassword) {
    throw new Error("New email and current password are required");
  }

  // Get user with password
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw new Error("Current password is incorrect");
  }

  // Check if new email is already taken
  const existingUser = await userRepository.findByEmail(newEmail);
  if (existingUser && existingUser.id !== userId) {
    throw new Error("Email is already in use");
  }

  // Update email
  const updatedUser = await userRepository.update(userId, { email: newEmail });
  return sanitizeUser(updatedUser);
}

/**
 * Change user password
 */
export async function changePassword(userId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }

  // Get user with password
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await userRepository.update(userId, { password: hashedPassword });
  return { message: "Password updated successfully" };
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
  changeEmail,
  changePassword,
};
