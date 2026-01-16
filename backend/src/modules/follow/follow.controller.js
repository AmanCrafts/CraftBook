import * as followService from "./follow.service.js";

/**
 * Follow Controller - HTTP Request Handler
 * Thin layer that handles HTTP requests and responses
 */

/**
 * Toggle follow on a user
 * POST /api/users/:userId/follow
 */
export async function toggleFollow(req, res, _next) {
  try {
    const { userId } = req.params;
    const { followerId } = req.body;

    if (!followerId) {
      return res.status(400).json({ error: "Follower ID is required" });
    }

    const result = await followService.toggleFollow(followerId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Toggle follow error:", error);
    res.status(500).json({
      error: "Error toggling follow",
      details: error.message,
    });
  }
}

/**
 * Check if user is following another user
 * GET /api/users/:userId/follow/check/:followerId
 */
export async function checkFollowing(req, res, _next) {
  try {
    const { userId, followerId } = req.params;

    const isFollowing = await followService.isFollowing(followerId, userId);
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error("Check following error:", error);
    res.status(500).json({
      error: "Error checking follow status",
      details: error.message,
    });
  }
}

/**
 * Get followers for a user
 * GET /api/users/:userId/followers
 */
export async function getFollowers(req, res, _next) {
  try {
    const { userId } = req.params;

    const result = await followService.getFollowers(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({
      error: "Error fetching followers",
      details: error.message,
    });
  }
}

/**
 * Get users that a user is following
 * GET /api/users/:userId/following
 */
export async function getFollowing(req, res, _next) {
  try {
    const { userId } = req.params;

    const result = await followService.getFollowing(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({
      error: "Error fetching following",
      details: error.message,
    });
  }
}

/**
 * Get follow stats for a user
 * GET /api/users/:userId/follow-stats
 */
export async function getFollowStats(req, res, _next) {
  try {
    const { userId } = req.params;

    const result = await followService.getFollowStats(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get follow stats error:", error);
    res.status(500).json({
      error: "Error fetching follow stats",
      details: error.message,
    });
  }
}

/**
 * Check follow status for multiple users (batch)
 * POST /api/users/follow/check-batch
 */
export async function checkFollowingBatch(req, res, _next) {
  try {
    const { followerId, userIds } = req.body;

    if (!followerId || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        error: "followerId and userIds array are required",
      });
    }

    const result = await followService.checkFollowingBatch(followerId, userIds);
    res.status(200).json(result);
  } catch (error) {
    console.error("Check following batch error:", error);
    res.status(500).json({
      error: "Error checking follow status",
      details: error.message,
    });
  }
}

export default {
  toggleFollow,
  checkFollowing,
  getFollowers,
  getFollowing,
  getFollowStats,
  checkFollowingBatch,
};
