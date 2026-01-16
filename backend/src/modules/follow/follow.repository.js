import { prisma } from "../../config/database.js";

/**
 * Follow Repository - Data Access Layer
 * Handles all database operations for follows
 */

/**
 * Create a follow relationship
 */
export async function create(followerId, followingId) {
  return await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
      following: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
    },
  });
}

/**
 * Find follow by follower and following IDs
 */
export async function findByFollowerAndFollowing(followerId, followingId) {
  return await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
}

/**
 * Delete a follow relationship
 */
export async function deleteFollow(id) {
  return await prisma.follow.delete({
    where: { id },
  });
}

/**
 * Get followers for a user
 */
export async function findFollowers(userId) {
  return await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
          bio: true,
          medium: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get users that a user is following
 */
export async function findFollowing(userId) {
  return await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
          bio: true,
          medium: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Count followers for a user
 */
export async function countFollowers(userId) {
  return await prisma.follow.count({
    where: {
      followingId: userId,
    },
  });
}

/**
 * Count following for a user
 */
export async function countFollowing(userId) {
  return await prisma.follow.count({
    where: {
      followerId: userId,
    },
  });
}

/**
 * Get IDs of users that a user is following
 */
export async function getFollowingIds(userId) {
  const follows = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });
  return follows.map((f) => f.followingId);
}

/**
 * Check if user is following multiple users (batch)
 */
export async function checkFollowingBatch(followerId, userIds) {
  const follows = await prisma.follow.findMany({
    where: {
      followerId,
      followingId: {
        in: userIds,
      },
    },
    select: {
      followingId: true,
    },
  });

  const followingSet = new Set(follows.map((f) => f.followingId));
  return userIds.reduce((acc, userId) => {
    acc[userId] = followingSet.has(userId);
    return acc;
  }, {});
}

export default {
  create,
  findByFollowerAndFollowing,
  delete: deleteFollow,
  findFollowers,
  findFollowing,
  countFollowers,
  countFollowing,
  getFollowingIds,
  checkFollowingBatch,
};
