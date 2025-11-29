import userService from "./user.service.js";

/**
 * User Controller - HTTP Request Handler
 * Thin layer that handles HTTP requests and responses
 */

/**
 * Create a new user
 * POST /api/users
 */
export async function createUser(req, res, _next) {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }

    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(error.message.includes("already exists") ? 409 : 500).json({
      error: "Error creating user",
      details: error.message,
    });
  }
}

/**
 * Get user by ID
 * GET /api/users/:id
 */
export async function getUserById(req, res, _next) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(error.message === "User not found" ? 404 : 500).json({
      error: "Error fetching user",
      details: error.message,
    });
  }
}

/**
 * Get user by Google ID
 * GET /api/users/google/:googleId
 */
export async function getUserByGoogleId(req, res, _next) {
  try {
    const { googleId } = req.params;
    const user = await userService.getUserByGoogleId(googleId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by Google ID:", error);
    res.status(error.message === "User not found" ? 404 : 500).json({
      error: "Error fetching user by Google ID",
      details: error.message,
    });
  }
}

/**
 * Get all users
 * GET /api/users
 */
export async function getAllUsers(_req, res, _next) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Error fetching users",
      details: error.message,
    });
  }
}

/**
 * Update user
 * PUT /api/users/:id
 */
export async function updateUser(req, res, _next) {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(error.message === "User not found" ? 404 : 500).json({
      error: "Error updating user",
      details: error.message,
    });
  }
}

/**
 * Delete user
 * DELETE /api/users/:id
 */
export async function deleteUser(req, res, _next) {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(error.message === "User not found" ? 404 : 500).json({
      error: "Error deleting user",
      details: error.message,
    });
  }
}

// Default export for compatibility
export default {
  createUser,
  getUserById,
  getUserByGoogleId,
  getAllUsers,
  updateUser,
  deleteUser,
};
