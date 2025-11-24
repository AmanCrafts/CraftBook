import express from "express";
import postController from "./post.controller.js";

const router = express.Router();

/**
 * Post Routes
 */

// GET /api/posts - Get all posts
router.get("/", postController.getAllPosts);

// GET /api/posts/recent - Get recent posts
router.get("/recent", postController.getRecentPosts);

// GET /api/posts/popular - Get popular posts
router.get("/popular", postController.getPopularPosts);

// GET /api/posts/process - Get process posts
router.get("/process", postController.getProcessPosts);

// GET /api/posts/user/:userId - Get posts by user ID
router.get("/user/:userId", postController.getPostsByUserId);

// GET /api/posts/tag/:tag - Search posts by tag
router.get("/tag/:tag", postController.searchPostsByTag);

// GET /api/posts/medium/:medium - Get posts by medium
router.get("/medium/:medium", postController.getPostsByMedium);

// GET /api/posts/tag/:tag/medium/:medium - Get posts by tag and medium
router.get("/tag/:tag/medium/:medium", postController.getPostsByTagAndMedium);

// GET /api/posts/search/title/:title - Search posts by title
router.get("/search/title/:title", postController.searchPostsByTitle);

// GET /api/posts/search/description/:description - Search posts by description
router.get(
  "/search/description/:description",
  postController.searchPostsByDescription,
);

// GET /api/posts/:id - Get post by ID
router.get("/:id", postController.getPostById);

// POST /api/posts - Create new post
router.post("/", postController.createPost);

// PUT /api/posts/:id - Update post
router.put("/:id", postController.updatePost);

// DELETE /api/posts/:id - Delete post
router.delete("/:id", postController.deletePost);

export default router;
