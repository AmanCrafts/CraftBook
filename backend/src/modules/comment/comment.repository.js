import { prisma } from "../../config/database.js";

/**
 * Comment Repository - Data Access Layer
 * Handles all database operations for comments
 */

/**
 * Create a comment
 */
export async function create(commentData) {
	return await prisma.comment.create({
		data: commentData,
		include: {
			author: {
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
 * Find comment by ID
 */
export async function findById(id) {
	return await prisma.comment.findUnique({
		where: { id },
		include: {
			author: {
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
 * Get comments for a post
 */
export async function findByPostId(postId) {
	return await prisma.comment.findMany({
		where: { postId },
		include: {
			author: {
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
 * Get comments count for a post
 */
export async function countByPostId(postId) {
	return await prisma.comment.count({
		where: { postId },
	});
}

/**
 * Update comment
 */
export async function update(id, content) {
	return await prisma.comment.update({
		where: { id },
		data: { content },
		include: {
			author: {
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
 * Delete comment
 */
export async function deleteComment(id) {
	return await prisma.comment.delete({
		where: { id },
	});
}

export default {
	create,
	findById,
	findByPostId,
	countByPostId,
	update,
	delete: deleteComment,
};
