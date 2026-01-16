import express from "express";
import authRoutes from "../../modules/auth/auth.routes.js";
import commentRoutes from "../../modules/comment/comment.routes.js";
import followRoutes from "../../modules/follow/follow.routes.js";
import likeRoutes from "../../modules/like/like.routes.js";
import postRoutes from "../../modules/post/post.routes.js";
import uploadRoutes from "../../modules/upload/upload.routes.js";
import userRoutes from "../../modules/user/user.routes.js";

const router = express.Router();

/**
 * API v1 Routes
 */

// Health check
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "CraftBook API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount module routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/users", followRoutes);
router.use("/posts", postRoutes);
router.use("/posts", likeRoutes);
router.use("/posts", commentRoutes);
router.use("/upload", uploadRoutes);

export default router;
