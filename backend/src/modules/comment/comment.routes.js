import express from "express";
import commentController from "./comment.controller.js";

const router = express.Router();

/**
 * Comment Routes
 */

// POST /api/posts/:postId/comments - Create a comment on a post
router.post("/:postId/comments", commentController.createComment);

// GET /api/posts/:postId/comments - Get all comments for a post
router.get("/:postId/comments", commentController.getCommentsByPostId);

// PUT /api/comments/:id - Update a comment
router.put("/comments/:id", commentController.updateComment);

// DELETE /api/comments/:id - Delete a comment
router.delete("/comments/:id", commentController.deleteComment);

export default router;
