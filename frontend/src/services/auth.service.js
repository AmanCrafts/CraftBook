import { signOut as firebaseSignOut, getAuth } from "firebase/auth";
import userAPI from "../api/user.api";

// Authentication service - handles auth-related business logic

// Get Firebase Auth instance
const auth = getAuth();

// Sign out current user
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: error.message };
  }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

// Check if user has completed profile
export async function hasCompletedProfile(googleId) {
  try {
    const user = await userAPI.getUserByGoogleId(googleId);
    return !!user;
  } catch {
    return false;
  }
}

// Create or update user profile
export async function saveProfile(userData) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("No authenticated user");
    }

    // Check if user exists
    const hasProfile = await hasCompletedProfile(currentUser.uid);

    if (hasProfile) {
      // Update existing profile
      const existingUser = await userAPI.getUserByGoogleId(currentUser.uid);
      const updated = await userAPI.updateUser(existingUser.id, userData);
      return { success: true, data: updated };
    } else {
      // Create new profile
      const created = await userAPI.createUser({
        ...userData,
        googleId: currentUser.uid,
        email: currentUser.email,
        profilePicture: currentUser.photoURL,
      });
      return { success: true, data: created };
    }
  } catch (error) {
    console.error("Save profile error:", error);
    return { success: false, error: error.message };
  }
}

// Default export for compatibility
export default {
  signOut,
  getCurrentUser,
  hasCompletedProfile,
  saveProfile,
};
