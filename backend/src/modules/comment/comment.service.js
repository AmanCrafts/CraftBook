import commentRepository from "./comment.repository.js";

/**
 * Comment Service - Business Logic Layer
 * Contains all business logic for comment operations
 */

/**
 * Create a comment
 */
export async function createComment(commentData) {
  const { content, authorId, postId } = commentData;

  // Validation
  if (!content || !authorId || !postId) {
    throw new Error("content, authorId, and postId are required");
  }

  if (content.trim().length === 0) {
    throw new Error("Comment cannot be empty");
  }

  // Create comment
  return await commentRepository.create({
    content: content.trim(),
    author: { connect: { id: authorId } },
    post: { connect: { id: postId } },
  });
}

/**
 * Get comments for a post
 */
export async function getCommentsByPostId(postId) {
  const comments = await commentRepository.findByPostId(postId);
  const count = comments.length;

  return {
    count,
    comments,
  };
}

/**
 * Update a comment
 */
export async function updateComment(id, userId, content) {
  // Get comment
  const comment = await commentRepository.findById(id);

  if (!comment) {
    throw new Error("Comment not found");
  }

  // Check if user is the author
  if (comment.authorId !== userId) {
    throw new Error("Unauthorized to edit this comment");
  }

  if (content.trim().length === 0) {
    throw new Error("Comment cannot be empty");
  }

  return await commentRepository.update(id, content.trim());
}

/**
 * Delete a comment
 */
export async function deleteComment(id, userId) {
  // Get comment
  const comment = await commentRepository.findById(id);

  if (!comment) {
    throw new Error("Comment not found");
  }

  // Check if user is the author
  if (comment.authorId !== userId) {
    throw new Error("Unauthorized to delete this comment");
  }

  return await commentRepository.delete(id);
}

export default {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};
