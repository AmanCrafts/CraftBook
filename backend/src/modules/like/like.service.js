import likeRepository from "./like.repository.js";

/**
 * Like Service - Business Logic Layer
 * Contains all business logic for like operations
 */

/**
 * Toggle like on a post
 * If user already liked, remove the like
 * If user hasn't liked, add the like
 */
export async function toggleLike(userId, postId) {
  // Check if like already exists
  const existingLike = await likeRepository.findByUserAndPost(userId, postId);

  if (existingLike) {
    // Unlike
    await likeRepository.delete(existingLike.id);
    return {
      liked: false,
      message: "Like removed",
    };
  } else {
    // Like
    const like = await likeRepository.create({
      user: { connect: { id: userId } },
      post: { connect: { id: postId } },
    });
    return {
      liked: true,
      message: "Post liked",
      like,
    };
  }
}

/**
 * Get likes for a post
 */
export async function getLikesByPostId(postId) {
  const likes = await likeRepository.findByPostId(postId);
  const count = likes.length;

  return {
    count,
    likes,
  };
}

/**
 * Check if user has liked a post
 */
export async function hasUserLikedPost(userId, postId) {
  const like = await likeRepository.findByUserAndPost(userId, postId);
  return !!like;
}

export default {
  toggleLike,
  getLikesByPostId,
  hasUserLikedPost,
};
