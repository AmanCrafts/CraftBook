import httpClient from "./httpClient";

const API_BASE = "/api/posts";

export const commentAPI = {
	// Create a comment on a post
	createComment: async (postId, content, authorId) => {
		return await httpClient.post(`${API_BASE}/${postId}/comments`, {
			content,
			authorId,
		});
	},

	// Get comments for a post
	getComments: async (postId) => {
		return await httpClient.get(`${API_BASE}/${postId}/comments`);
	},

	// Update a comment
	updateComment: async (commentId, content, userId) => {
		return await httpClient.put(`/api/comments/${commentId}`, {
			content,
			userId,
		});
	},

	// Delete a comment
	deleteComment: async (commentId, userId) => {
		return await httpClient.delete(`/api/comments/${commentId}`, { userId });
	},
};

export default commentAPI;
