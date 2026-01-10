import { prisma } from "../../config/database.js";

/**
 * User Repository - Data Access Layer
 * Handles all database operations for users
 */

/**
 * Create a new user
 */
export async function create(userData) {
  return await prisma.user.create({
    data: userData,
  });
}

/**
 * Find user by ID
 */
export async function findById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

/**
 * Find user by email
 */
export async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Find user by Google ID
 */
export async function findByGoogleId(googleId) {
  return await prisma.user.findUnique({
    where: { googleId },
  });
}

/**
 * Get all users
 */
export async function findAll() {
  return await prisma.user.findMany();
}

/**
 * Update user
 */
export async function update(id, userData) {
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
}

/**
 * Delete user (cascade handled by Prisma schema)
 */
export async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

/**
 * Delete user with all related data (explicit cascade)
 * This deletes: posts, comments, likes, follows
 */
export async function deleteUserWithAllData(id) {
  // Use a transaction to ensure all deletions succeed or fail together
  return await prisma.$transaction(async (tx) => {
    // Delete all likes by this user
    await tx.like.deleteMany({
      where: { userId: id },
    });

    // Delete all comments by this user
    await tx.comment.deleteMany({
      where: { authorId: id },
    });

    // Delete all likes on user's posts
    await tx.like.deleteMany({
      where: {
        post: {
          authorId: id,
        },
      },
    });

    // Delete all comments on user's posts
    await tx.comment.deleteMany({
      where: {
        post: {
          authorId: id,
        },
      },
    });

    // Delete all posts by this user
    await tx.post.deleteMany({
      where: { authorId: id },
    });

    // Delete follow relationships
    await tx.follow.deleteMany({
      where: {
        OR: [{ followerId: id }, { followingId: id }],
      },
    });

    // Finally, delete the user
    return await tx.user.delete({
      where: { id },
    });
  });
}

// Default export for compatibility
export default {
  create,
  findById,
  findByEmail,
  findByGoogleId,
  findAll,
  update,
  delete: deleteUser,
  deleteUserWithAllData,
};
