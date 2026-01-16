import * as followRepository from "./follow.repository.js";

/**
 * Follow Service - Business Logic Layer
 * Contains all business logic for follow operations
 */

/**
 * Toggle follow on a user
 * If already following, unfollow
 * If not following, follow
 */
export async function toggleFollow(followerId, followingId) {
  // Can't follow yourself
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  // Check if already following
  const existingFollow = await followRepository.findByFollowerAndFollowing(
    followerId,
    followingId,
  );

  if (existingFollow) {
    // Unfollow
    await followRepository.delete(existingFollow.id);
    return {
      action: "unfollowed",
      isFollowing: false,
    };
  } else {
    // Follow
    await followRepository.create(followerId, followingId);
    return {
      action: "followed",
      isFollowing: true,
    };
  }
}

/**
 * Check if user is following another user
 */
export async function isFollowing(followerId, followingId) {
  const follow = await followRepository.findByFollowerAndFollowing(
    followerId,
    followingId,
  );
  return !!follow;
}

/**
 * Get followers for a user
 */
export async function getFollowers(userId) {
  const follows = await followRepository.findFollowers(userId);
  const count = follows.length;

  return {
    count,
    followers: follows.map((f) => f.follower),
  };
}

/**
 * Get users that a user is following
 */
export async function getFollowing(userId) {
  const follows = await followRepository.findFollowing(userId);
  const count = follows.length;

  return {
    count,
    following: follows.map((f) => f.following),
  };
}

/**
 * Get follow stats for a user
 */
export async function getFollowStats(userId) {
  const [followersCount, followingCount] = await Promise.all([
    followRepository.countFollowers(userId),
    followRepository.countFollowing(userId),
  ]);

  return {
    followers: followersCount,
    following: followingCount,
  };
}

/**
 * Get IDs of users that a user is following
 */
export async function getFollowingIds(userId) {
  return await followRepository.getFollowingIds(userId);
}

/**
 * Check if user is following multiple users (batch)
 */
export async function checkFollowingBatch(followerId, userIds) {
  return await followRepository.checkFollowingBatch(followerId, userIds);
}

export default {
  toggleFollow,
  isFollowing,
  getFollowers,
  getFollowing,
  getFollowStats,
  getFollowingIds,
  checkFollowingBatch,
};
