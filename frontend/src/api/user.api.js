import API_ENDPOINTS from "../constants/apiEndpoints";
import httpClient from "./httpClient";

// User API - all user-related API calls

export const userAPI = {
  // Get all users
  getAllUsers: async () => {
    return await httpClient.get(API_ENDPOINTS.USERS);
  },

  // Get user by ID
  getUserById: async (id) => {
    return await httpClient.get(API_ENDPOINTS.USER_BY_ID(id));
  },

  // Get user by Google ID
  getUserByGoogleId: async (googleId) => {
    return await httpClient.get(API_ENDPOINTS.USER_BY_GOOGLE_ID(googleId));
  },

  // Create new user
  createUser: async (userData) => {
    return await httpClient.post(API_ENDPOINTS.USERS, userData);
  },

  // Update user
  updateUser: async (id, userData) => {
    return await httpClient.put(API_ENDPOINTS.USER_BY_ID(id), userData);
  },

  // Delete user
  deleteUser: async (id) => {
    return await httpClient.delete(API_ENDPOINTS.USER_BY_ID(id));
  },
};

export default userAPI;
