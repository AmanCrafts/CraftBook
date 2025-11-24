import ENV from "./env";

// App Configuration - central configuration for the entire app

export const APP_CONFIG = {
  appName: "CraftBook",
  version: "1.0.0",
  environment: __DEV__ ? "development" : "production",
};

export const FIREBASE_CONFIG = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  databaseURL: ENV.FIREBASE_DATABASE_URL,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
  measurementId: ENV.FIREBASE_MEASUREMENT_ID,
};

export const API_CONFIG = {
  baseURL: ENV.API_URL,
  timeout: 30000, // 30 seconds
};

export default {
  APP_CONFIG,
  FIREBASE_CONFIG,
  API_CONFIG,
};
