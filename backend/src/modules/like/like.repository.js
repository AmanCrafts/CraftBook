import { prisma } from "../../config/database.js";

/**
 * Like Repository - Data Access Layer
 * Handles all database operations for likes
 */

/**
 * Create a like
 */
export async function create(likeData) {
  return await prisma.like.create({
    data: likeData,
    include: {
      user: {
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
 * Find like by user and post
 */
export async function findByUserAndPost(userId, postId) {
  return await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
}

/**
 * Delete a like
 */
export async function deleteLike(id) {
  return await prisma.like.delete({
    where: { id },
  });
}

/**
 * Get likes for a post
 */
export async function findByPostId(postId) {
  return await prisma.like.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get likes count for a post
 */
export async function countByPostId(postId) {
  return await prisma.like.count({
    where: { postId },
  });
}

export default {
  create,
  findByUserAndPost,
  delete: deleteLike,
  findByPostId,
  countByPostId,
};
