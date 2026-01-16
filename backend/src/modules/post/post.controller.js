import postService from "./post.service.js";

/**
 * Post Controller - HTTP Request Handler
 * Thin layer that handles HTTP requests and responses
 */

/**
 * Create a new post
 * POST /api/posts
 */
export async function createPost(req, res, _next) {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).json({
      error: "Error creating post",
      details: error.message,
    });
  }
}

/**
 * Get post by ID
 * GET /api/posts/:id
 */
export async function getPostById(req, res, _next) {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(id);
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(error.message === "Post not found" ? 404 : 500).json({
      error: "Error fetching post",
      details: error.message,
    });
  }
}

/**
 * Get all posts
 * GET /api/posts
 */
export async function getAllPosts(_req, res, _next) {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      error: "Error fetching posts",
      details: error.message,
    });
  }
}

/**
 * Get posts by user ID
 * GET /api/posts/user/:userId
 */
export async function getPostsByUserId(req, res, _next) {
  try {
    const { userId } = req.params;
    const posts = await postService.getPostsByUserId(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts for user:", error);
    res.status(500).json({
      error: "Error fetching posts for user",
      details: error.message,
    });
  }
}

/**
 * Search posts by tag
 * GET /api/posts/tag/:tag
 */
export async function searchPostsByTag(req, res, _next) {
  try {
    const { tag } = req.params;
    const posts = await postService.searchPostsByTag(tag);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error searching posts by tag:", error);
    res.status(500).json({
      error: "Error searching posts by tag",
      details: error.message,
    });
  }
}

/**
 * Get posts by medium
 * GET /api/posts/medium/:medium
 */
export async function getPostsByMedium(req, res, _next) {
  try {
    const { medium } = req.params;
    const posts = await postService.getPostsByMedium(medium);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by medium:", error);
    res.status(500).json({
      error: "Error fetching posts by medium",
      details: error.message,
    });
  }
}

/**
 * Get posts by tag and medium
 * GET /api/posts/tag/:tag/medium/:medium
 */
export async function getPostsByTagAndMedium(req, res, _next) {
  try {
    const { tag, medium } = req.params;
    const posts = await postService.getPostsByTagAndMedium(tag, medium);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by tag and medium:", error);
    res.status(500).json({
      error: "Error fetching posts by tag and medium",
      details: error.message,
    });
  }
}

/**
 * Search posts by title
 * GET /api/posts/search/title/:title
 */
export async function searchPostsByTitle(req, res, _next) {
  try {
    const { title } = req.params;
    const posts = await postService.searchPostsByTitle(title);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error searching posts by title:", error);
    res.status(500).json({
      error: "Error searching posts by title",
      details: error.message,
    });
  }
}

/**
 * Search posts by description
 * GET /api/posts/search/description/:description
 */
export async function searchPostsByDescription(req, res, _next) {
  try {
    const { description } = req.params;
    const posts = await postService.searchPostsByDescription(description);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error searching posts by description:", error);
    res.status(500).json({
      error: "Error searching posts by description",
      details: error.message,
    });
  }
}

/**
 * Get recent posts with pagination
 * GET /api/posts/recent?limit=10&cursor=xxx
 */
export async function getRecentPosts(req, res, _next) {
  try {
    const { limit = 10, cursor } = req.query;
    const result = await postService.getRecentPosts({
      limit: parseInt(limit, 10),
      cursor: cursor || null,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    res.status(500).json({
      error: "Error fetching recent posts",
      details: error.message,
    });
  }
}

/**
 * Get popular posts with pagination
 * GET /api/posts/popular?limit=10&page=1
 */
export async function getPopularPosts(req, res, _next) {
  try {
    const { limit = 10, page = 1 } = req.query;
    const result = await postService.getPopularPosts({
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    res.status(500).json({
      error: "Error fetching popular posts",
      details: error.message,
    });
  }
}

/**
 * Get process posts
 * GET /api/posts/process
 */
export async function getProcessPosts(_req, res, _next) {
  try {
    const posts = await postService.getProcessPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching process posts:", error);
    res.status(500).json({
      error: "Error fetching process posts",
      details: error.message,
    });
  }
}

/**
 * Update post
 * PUT /api/posts/:id
 */
export async function updatePost(req, res, _next) {
  try {
    const { id } = req.params;
    const post = await postService.updatePost(id, req.body);
    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(error.message === "Post not found" ? 404 : 500).json({
      error: "Error updating post",
      details: error.message,
    });
  }
}

/**
 * Delete post
 * DELETE /api/posts/:id
 */
export async function deletePost(req, res, _next) {
  try {
    const { id } = req.params;
    await postService.deletePost(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(error.message === "Post not found" ? 404 : 500).json({
      error: "Error deleting post",
      details: error.message,
    });
  }
}

/**
 * Get posts from followed users
 * POST /api/posts/following
 */
export async function getFollowingPosts(req, res, _next) {
  try {
    const { followingIds } = req.body;
    const posts = await postService.getFollowingPosts(followingIds);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching following posts:", error);
    res.status(500).json({
      error: "Error fetching following posts",
      details: error.message,
    });
  }
}

// Default export for compatibility
export default {
  createPost,
  getPostById,
  getAllPosts,
  getPostsByUserId,
  searchPostsByTag,
  getPostsByMedium,
  getPostsByTagAndMedium,
  searchPostsByTitle,
  searchPostsByDescription,
  getRecentPosts,
  getPopularPosts,
  getProcessPosts,
  getFollowingPosts,
  updatePost,
  deletePost,
};
