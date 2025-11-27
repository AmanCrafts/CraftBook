import commentService from "./comment.service.js";

/**
 * Comment Controller - HTTP Request Handler
 * Thin layer that handles HTTP requests and responses
 */

/**
 * Create a comment
 * POST /api/posts/:postId/comments
 */
export async function createComment(req, res, next) {
	try {
		const { postId } = req.params;
		const { content, authorId } = req.body;

		if (!content || !authorId) {
			return res.status(400).json({
				error: "content and authorId are required",
			});
		}

		const comment = await commentService.createComment({
			content,
			authorId,
			postId,
		});

		res.status(201).json(comment);
	} catch (error) {
		console.error("Error creating comment:", error);
		res.status(400).json({
			error: "Error creating comment",
			details: error.message,
		});
	}
}

/**
 * Get comments for a post
 * GET /api/posts/:postId/comments
 */
export async function getCommentsByPostId(req, res, next) {
	try {
		const { postId } = req.params;
		const result = await commentService.getCommentsByPostId(postId);
		res.status(200).json(result);
	} catch (error) {
		console.error("Error fetching comments:", error);
		res.status(500).json({
			error: "Error fetching comments",
			details: error.message,
		});
	}
}

/**
 * Update a comment
 * PUT /api/comments/:id
 */
export async function updateComment(req, res, next) {
	try {
		const { id } = req.params;
		const { content, userId } = req.body;

		if (!content || !userId) {
			return res.status(400).json({
				error: "content and userId are required",
			});
		}

		const comment = await commentService.updateComment(id, userId, content);
		res.status(200).json(comment);
	} catch (error) {
		console.error("Error updating comment:", error);
		const statusCode = error.message.includes("Unauthorized") ? 403 : 400;
		res.status(statusCode).json({
			error: "Error updating comment",
			details: error.message,
		});
	}
}

/**
 * Delete a comment
 * DELETE /api/comments/:id
 */
export async function deleteComment(req, res, next) {
	try {
		const { id } = req.params;
		const { userId } = req.body;

		if (!userId) {
			return res.status(400).json({
				error: "userId is required",
			});
		}

		await commentService.deleteComment(id, userId);
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting comment:", error);
		const statusCode = error.message.includes("Unauthorized")
			? 403
			: error.message.includes("not found")
				? 404
				: 500;
		res.status(statusCode).json({
			error: "Error deleting comment",
			details: error.message,
		});
	}
}

export default {
	createComment,
	getCommentsByPostId,
	updateComment,
	deleteComment,
};
