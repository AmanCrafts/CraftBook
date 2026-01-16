import httpClient from "./httpClient";

// Follow API - all follow-related API calls

export const followAPI = {
  // Toggle follow on a user
  toggleFollow: async (userId, followerId) => {
    return await httpClient.post(`/api/users/${userId}/follow`, { followerId });
  },

  // Check if user is following another user
  checkFollowing: async (userId, followerId) => {
    return await httpClient.get(
      `/api/users/${userId}/follow/check/${followerId}`
    );
  },

  // Get followers for a user
  getFollowers: async (userId) => {
    return await httpClient.get(`/api/users/${userId}/followers`);
  },

  // Get users that a user is following
  getFollowing: async (userId) => {
    return await httpClient.get(`/api/users/${userId}/following`);
  },

  // Get follow stats for a user
  getFollowStats: async (userId) => {
    return await httpClient.get(`/api/users/${userId}/follow-stats`);
  },

  // Check follow status for multiple users (batch)
  checkFollowingBatch: async (followerId, userIds) => {
    return await httpClient.post("/api/users/follow/check-batch", {
      followerId,
      userIds,
    });
  },

  // Get posts from followed users
  getFollowingPosts: async (followingIds) => {
    return await httpClient.post("/api/posts/following", { followingIds });
  },

  // Get IDs of users that a user is following
  getFollowingIds: async (userId) => {
    const result = await httpClient.get(`/api/users/${userId}/following`);
    return result.following.map((user) => user.id);
  },
};

export default followAPI;
