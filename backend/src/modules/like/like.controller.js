import likeService from "./like.service.js";
import userRepository from "../user/user.repository.js";

/**
 * Like Controller - HTTP Request Handler
 * Thin layer that handles HTTP requests and responses
 */

/**
 * Toggle like on a post
 * POST /api/posts/:postId/like
 */
export async function toggleLike(req, res, next) {
	try {
		const { postId } = req.params;
		const { userId } = req.body; // This is Firebase UID (googleId)

		if (!userId) {
			return res.status(400).json({
				error: "userId is required",
			});
		}

		// Convert Firebase UID to database user ID
		const user = await userRepository.findByGoogleId(userId);
		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		const result = await likeService.toggleLike(user.id, postId);
		res.status(200).json(result);
	} catch (error) {
		console.error("Error toggling like:", error);
		res.status(500).json({
			error: "Error toggling like",
			details: error.message,
		});
	}
}

/**
 * Get likes for a post
 * GET /api/posts/:postId/likes
 */
export async function getLikesByPostId(req, res, next) {
	try {
		const { postId } = req.params;
		const result = await likeService.getLikesByPostId(postId);
		res.status(200).json(result);
	} catch (error) {
		console.error("Error fetching likes:", error);
		res.status(500).json({
			error: "Error fetching likes",
			details: error.message,
		});
	}
}

/**
 * Check if user has liked a post
 * GET /api/posts/:postId/likes/check/:userId
 */
export async function checkUserLike(req, res, next) {
	try {
		const { postId, userId } = req.params; // userId is Firebase UID (googleId)
		
		// Convert Firebase UID to database user ID
		const user = await userRepository.findByGoogleId(userId);
		if (!user) {
			return res.status(200).json({ hasLiked: false });
		}

		const hasLiked = await likeService.hasUserLikedPost(user.id, postId);
		res.status(200).json({ hasLiked });
	} catch (error) {
		console.error("Error checking like:", error);
		res.status(500).json({
			error: "Error checking like",
			details: error.message,
		});
	}
}

export default {
	toggleLike,
	getLikesByPostId,
	checkUserLike,
};
