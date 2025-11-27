import express from "express";
import likeController from "./like.controller.js";

const router = express.Router();

/**
 * Like Routes
 * All routes are prefixed with /api/posts/:postId
 */

// POST /api/posts/:postId/like - Toggle like on a post
router.post("/:postId/like", likeController.toggleLike);

// GET /api/posts/:postId/likes - Get all likes for a post
router.get("/:postId/likes", likeController.getLikesByPostId);

// GET /api/posts/:postId/likes/check/:userId - Check if user has liked a post
router.get("/:postId/likes/check/:userId", likeController.checkUserLike);

export default router;
