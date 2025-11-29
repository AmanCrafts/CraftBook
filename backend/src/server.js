import app from "./app.js";
import database from "./config/database.js";
import config from "./config/index.js";

/**
 * Server Configuration
 */
const PORT = config.port;

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();

    // Start listening
    const server = app.listen(PORT, () => {
      console.log("===================================");
      console.log(`CraftBook API Server is running`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`API v1: http://localhost:${PORT}/api`);
      console.log("===================================");
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("[SERVER] HTTP server closed");

        // Close database connection
        await database.disconnect();

        console.log("Server shutdown complete");
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error("Forcefully shutting down");
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("[SERVER] Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
