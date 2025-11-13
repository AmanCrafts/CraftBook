// API Endpoints - centralized API endpoint definitions

export const API_ENDPOINTS = {
  // Auth Endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',

  // User Endpoints
  USERS: '/api/users',
  USER_BY_ID: (id) => `/api/users/${id}`,
  USER_BY_GOOGLE_ID: (googleId) => `/api/users/google/${googleId}`,
  
  // Post Endpoints
  POSTS: '/api/posts',
  POST_BY_ID: (id) => `/api/posts/${id}`,
  POSTS_RECENT: '/api/posts/recent',
  POSTS_POPULAR: '/api/posts/popular',
  POSTS_BY_USER: (userId) => `/api/posts/user/${userId}`,
  POSTS_BY_TAG: (tag) => `/api/posts/tag/${tag}`,
  POSTS_BY_MEDIUM: (medium) => `/api/posts/medium/${medium}`,

  // Upload Endpoints
  UPLOAD_IMAGE: '/api/upload',
  DELETE_IMAGE: (id) => `/api/upload/${id}`,
};

export default API_ENDPOINTS;
