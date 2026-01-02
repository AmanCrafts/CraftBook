import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "craftbook_auth_token";

/**
 * Get stored auth token
 */
export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

/**
 * Clear auth token (logout)
 */
export async function clearToken() {
  return AsyncStorage.removeItem(TOKEN_KEY);
}

export default {
  getToken,
  clearToken,
};
