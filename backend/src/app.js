import cors from "cors";
import express from "express";
import apiV1Routes from "./api/v1/index.js";
import config from "./config/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";

/**
 * Initialize Express Application
 */
const app = express();

/**
 * Middleware Configuration
 */

// CORS
app.use(cors(config.cors));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
if (config.nodeEnv === "development") {
  app.use(requestLogger);
}

/**
 * Routes
 */

// Root endpoint
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "CraftBook API Server",
    version: "1.0.0",
    status: "running",
    environment: config.nodeEnv,
  });
});

// API v1 routes
app.use("/api", apiV1Routes);

/**
 * Error Handling
 */

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
