import postRepository from "./post.repository.js";

/**
 * Post Service - Business Logic Layer
 * Contains all business logic for post operations
 */

/**
 * Create a new post
 */
export async function createPost(postData) {
  const {
    title,
    description,
    imageUrl,
    tags,
    processStages,
    medium,
    authorId,
    isProcessPost = false,
  } = postData;

  // Validation
  if (!title || !imageUrl || !authorId) {
    throw new Error("title, imageUrl, and authorId are required");
  }

  // Create post
  return await postRepository.create({
    title,
    description,
    imageUrl,
    tags,
    processStages,
    medium,
    isProcessPost,
    author: { connect: { id: authorId } },
  });
}

/**
 * Get post by ID
 */
export async function getPostById(id) {
  const post = await postRepository.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
}

/**
 * Get all posts
 */
export async function getAllPosts() {
  return await postRepository.findAll();
}

/**
 * Get posts by user ID
 */
export async function getPostsByUserId(userId) {
  return await postRepository.findByUserId(userId);
}

/**
 * Search posts by tag
 */
export async function searchPostsByTag(tag) {
  return await postRepository.findByTag(tag);
}

/**
 * Get posts by medium
 */
export async function getPostsByMedium(medium) {
  return await postRepository.findByMedium(medium);
}

/**
 * Get posts by tag and medium
 */
export async function getPostsByTagAndMedium(tag, medium) {
  return await postRepository.findByTagAndMedium(tag, medium);
}

/**
 * Search posts by title
 */
export async function searchPostsByTitle(title) {
  return await postRepository.searchByTitle(title);
}

/**
 * Search posts by description
 */
export async function searchPostsByDescription(description) {
  return await postRepository.searchByDescription(description);
}

/**
 * Get recent posts with pagination
 */
export async function getRecentPosts({ limit = 10, cursor = null } = {}) {
  return await postRepository.findRecent({ limit, cursor });
}

/**
 * Get popular posts with pagination
 */
export async function getPopularPosts({ limit = 10, page = 1 } = {}) {
  return await postRepository.findPopular({ limit, page });
}

/**
 * Get process posts
 */
export async function getProcessPosts() {
  return await postRepository.findProcessPosts();
}

/**
 * Get posts from users that a user is following
 */
export async function getFollowingPosts(followingIds) {
  if (!followingIds || followingIds.length === 0) {
    return [];
  }
  return await postRepository.findFollowingPosts(followingIds);
}

/**
 * Update post
 */
export async function updatePost(id, postData) {
  // Check if post exists
  await getPostById(id);

  // Update post
  return await postRepository.update(id, postData);
}

/**
 * Delete post
 */
export async function deletePost(id) {
  // Check if post exists
  await getPostById(id);

  // Delete post
  return await postRepository.delete(id);
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
