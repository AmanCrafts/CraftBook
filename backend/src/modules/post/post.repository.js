import { prisma } from "../../config/database.js";

/**
 * Post Repository - Data Access Layer
 * Handles all database operations for posts
 */

/**
 * Create a new post
 */
export async function create(postData) {
  return await prisma.post.create({
    data: postData,
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });
}

/**
 * Find post by ID
 */
export async function findById(id) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });
}

/**
 * Get all posts
 */
export async function findAll() {
  return await prisma.post.findMany({
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Find posts by user ID
 */
export async function findByUserId(userId) {
  return await prisma.post.findMany({
    where: { authorId: userId },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Find posts by tag
 */
export async function findByTag(tag) {
  return await prisma.post.findMany({
    where: {
      tags: {
        has: tag,
      },
    },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Find posts by medium
 */
export async function findByMedium(medium) {
  return await prisma.post.findMany({
    where: { medium },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Find posts by tag and medium
 */
export async function findByTagAndMedium(tag, medium) {
  return await prisma.post.findMany({
    where: {
      tags: { has: tag },
      medium,
    },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Search posts by title
 */
export async function searchByTitle(title) {
  return await prisma.post.findMany({
    where: {
      title: {
        contains: title,
        mode: "insensitive",
      },
    },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Search posts by description
 */
export async function searchByDescription(description) {
  return await prisma.post.findMany({
    where: {
      description: {
        contains: description,
        mode: "insensitive",
      },
    },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get recent posts with pagination
 */
export async function findRecent({ limit = 10, cursor = null } = {}) {
  const query = {
    orderBy: { createdAt: "desc" },
    take: limit + 1, // Take one extra to check if there are more
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
  };

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1; // Skip the cursor itself
  }

  const posts = await prisma.post.findMany(query);

  const hasMore = posts.length > limit;
  const data = hasMore ? posts.slice(0, -1) : posts;
  const nextCursor = hasMore ? data[data.length - 1]?.id : null;

  return {
    posts: data,
    nextCursor,
    hasMore,
  };
}

/**
 * Get popular posts with pagination (ordered by likes count)
 */
export async function findPopular({ limit = 10, page = 1 } = {}) {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      take: limit,
      skip,
      include: {
        author: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
    }),
    prisma.post.count(),
  ]);

  return {
    posts,
    page,
    hasMore: skip + posts.length < total,
  };
}

/**
 * Get process posts
 */
export async function findProcessPosts() {
  return await prisma.post.findMany({
    where: { isProcessPost: true },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Update post
 */
export async function update(id, postData) {
  return await prisma.post.update({
    where: { id },
    data: postData,
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });
}

/**
 * Delete post
 */
export async function deletePost(id) {
  return await prisma.post.delete({
    where: { id },
  });
}

/**
 * Find posts from users that a user is following
 */
export async function findFollowingPosts(userIds) {
  return await prisma.post.findMany({
    where: {
      authorId: {
        in: userIds,
      },
    },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// Default export for compatibility
export default {
  create,
  findById,
  findAll,
  findByUserId,
  findByTag,
  findByMedium,
  findByTagAndMedium,
  searchByTitle,
  searchByDescription,
  findRecent,
  findPopular,
  findProcessPosts,
  findFollowingPosts,
  update,
  delete: deletePost,
};
