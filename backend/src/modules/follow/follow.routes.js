import express from "express";
import followController from "./follow.controller.js";

const router = express.Router();

/**
 * Follow Routes
 * All routes are prefixed with /api/users
 */

// POST /api/users/follow/check-batch - Check follow status for multiple users
router.post("/follow/check-batch", followController.checkFollowingBatch);

// POST /api/users/:userId/follow - Toggle follow on a user
router.post("/:userId/follow", followController.toggleFollow);

// GET /api/users/:userId/follow/check/:followerId - Check if user is following
router.get(
  "/:userId/follow/check/:followerId",
  followController.checkFollowing,
);

// GET /api/users/:userId/followers - Get followers for a user
router.get("/:userId/followers", followController.getFollowers);

// GET /api/users/:userId/following - Get users that a user is following
router.get("/:userId/following", followController.getFollowing);

// GET /api/users/:userId/follow-stats - Get follow stats
router.get("/:userId/follow-stats", followController.getFollowStats);

export default router;
