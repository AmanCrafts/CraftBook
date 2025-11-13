import httpClient from './httpClient';
import API_ENDPOINTS from '../constants/apiEndpoints';

// Post API - all post-related API calls

export const postAPI = {
  // Get all posts
  getAllPosts: async () => {
    return await httpClient.get(API_ENDPOINTS.POSTS);
  },

  // Get post by ID
  getPostById: async (id) => {
    return await httpClient.get(API_ENDPOINTS.POST_BY_ID(id));
  },

  // Get recent posts
  getRecentPosts: async () => {
    return await httpClient.get(API_ENDPOINTS.POSTS_RECENT);
  },

  // Get popular posts
  getPopularPosts: async () => {
    return await httpClient.get(API_ENDPOINTS.POSTS_POPULAR);
  },

  // Get posts by user ID
  getPostsByUserId: async (userId) => {
    return await httpClient.get(API_ENDPOINTS.POSTS_BY_USER(userId));
  },

  // Create new post
  createPost: async (postData) => {
    return await httpClient.post(API_ENDPOINTS.POSTS, postData);
  },

  // Update post
  updatePost: async (id, postData) => {
    return await httpClient.put(API_ENDPOINTS.POST_BY_ID(id), postData);
  },

  // Delete post
  deletePost: async (id) => {
    return await httpClient.delete(API_ENDPOINTS.POST_BY_ID(id));
  },
};

export default postAPI;
