import httpClient from "./httpClient";

const API_BASE = "/api/posts";

export const likeAPI = {
  // Toggle like on a post
  toggleLike: async (postId, userId) => {
    return await httpClient.post(`${API_BASE}/${postId}/like`, { userId });
  },

  // Get likes for a post
  getLikes: async (postId) => {
    return await httpClient.get(`${API_BASE}/${postId}/likes`);
  },

  // Check if user has liked a post
  checkUserLike: async (postId, userId) => {
    const response = await httpClient.get(
      `${API_BASE}/${postId}/likes/check/${userId}`
    );
    return response.hasLiked;
  },
};

export default likeAPI;
