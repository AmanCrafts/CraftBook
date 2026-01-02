import likeService from "./like.service.js";

/**
 * Like Controller - HTTP Request Handler
 * Thin layer that handles HTTP requests and responses
 */

/**
 * Toggle like on a post
 * POST /api/posts/:postId/like
 */
export async function toggleLike(req, res, _next) {
  try {
    const { postId } = req.params;
    const { userId } = req.body; // This is now the database user ID (cuid string)

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const result = await likeService.toggleLike(userId, postId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      error: "Error toggling like",
      details: error.message,
    });
  }
}

/**
 * Get likes for a post
 * GET /api/posts/:postId/likes
 */
export async function getLikesByPostId(req, res, _next) {
  try {
    const { postId } = req.params;
    const result = await likeService.getLikesByPostId(postId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({
      error: "Error fetching likes",
      details: error.message,
    });
  }
}

/**
 * Check if user has liked a post
 * GET /api/posts/:postId/likes/check/:userId
 */
export async function checkUserLike(req, res, _next) {
  try {
    const { postId, userId } = req.params; // userId is now the database user ID (cuid string)

    const hasLiked = await likeService.hasUserLikedPost(userId, postId);
    res.status(200).json({ hasLiked });
  } catch (error) {
    console.error("Error checking like:", error);
    res.status(500).json({
      error: "Error checking like",
      details: error.message,
    });
  }
}

export default {
  toggleLike,
  getLikesByPostId,
  checkUserLike,
};
