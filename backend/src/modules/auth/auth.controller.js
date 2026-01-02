import authService from "./auth.service.js";

/**
 * Auth Controller - HTTP Request Handler
 */

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register({ email, password, name });
    res.status(201).json(result);
  } catch (error) {
    console.error("Registration error:", error);
    const status = error.message.includes("already exists") ? 409 : 400;
    res.status(status).json({ error: error.message });
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: error.message });
  }
}

/**
 * Get current user (verify token)
 * GET /api/auth/me
 */
export async function getCurrentUser(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const user = await authService.verifyToken(token);
    res.status(200).json(user);
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: error.message });
  }
}

export default {
  register,
  login,
  getCurrentUser,
};
