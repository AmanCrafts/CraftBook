import { get, post, put } from "./httpClient";

/**
 * Auth API - Authentication endpoints
 */

/**
 * Register a new user
 */
export async function register({ email, password, name }) {
  return post("/api/auth/register", { email, password, name });
}

/**
 * Login user
 */
export async function login({ email, password }) {
  return post("/api/auth/login", { email, password });
}

/**
 * Get current user (verify token)
 */
export async function getCurrentUser(token) {
  return get("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Change user email
 */
export async function changeEmail(newEmail, currentPassword, token) {
  return put(
    "/api/auth/email",
    { newEmail, currentPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

/**
 * Change user password
 */
export async function changePassword(currentPassword, newPassword, token) {
  return put(
    "/api/auth/password",
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export default {
  register,
  login,
  getCurrentUser,
  changeEmail,
  changePassword,
};
