/**
 * Error Handler Middleware
 * Catches and formats errors
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        details: "Maximum file size is 10MB",
      });
    }
    return res.status(400).json({
      error: "File upload error",
      details: err.message,
    });
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "Duplicate entry",
        details: "A record with this value already exists",
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        error: "Record not found",
        details: err.message,
      });
    }
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: err.message,
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
};
