import ENV from "./env";

// App Configuration - central configuration for the entire app

export const APP_CONFIG = {
  appName: "CraftBook",
  version: "1.0.0",
  environment: __DEV__ ? "development" : "production",
};

export const API_CONFIG = {
  baseURL: ENV.API_URL,
  timeout: 30000, // 30 seconds
};

export default {
  APP_CONFIG,
  API_CONFIG,
};
