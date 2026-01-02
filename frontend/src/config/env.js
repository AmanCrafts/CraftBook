// Environment Configuration - centralized access to environment variables

export const ENV = {
  // Backend API
  API_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
};

export default ENV;
