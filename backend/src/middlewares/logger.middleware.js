/**
 * Request Logger Middleware
 * Logs incoming requests
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };

    // Color code by status
    if (res.statusCode >= 500) {
      console.error("[ERROR]", JSON.stringify(log));
    } else if (res.statusCode >= 400) {
      console.warn("⚠️ ", JSON.stringify(log));
    } else {
      console.log("[SUCCESS]", JSON.stringify(log));
    }
  });

  next();
};
