// API Endpoints - centralized API endpoint definitions

export const API_ENDPOINTS = {
  // Auth Endpoints
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",

  // User Endpoints
  USERS: "/api/users",
  USER_BY_ID: (id) => `/api/users/${id}`,
  USER_BY_GOOGLE_ID: (googleId) => `/api/users/google/${googleId}`,

  // Post Endpoints
  POSTS: "/api/posts",
  POST_BY_ID: (id) => `/api/posts/${id}`,
  POSTS_RECENT: "/api/posts/recent",
  POSTS_POPULAR: "/api/posts/popular",
  POSTS_BY_USER: (userId) => `/api/posts/user/${userId}`,
  POSTS_BY_TAG: (tag) => `/api/posts/tag/${tag}`,
  POSTS_BY_MEDIUM: (medium) => `/api/posts/medium/${medium}`,
  POSTS_SEARCH: "/api/posts/search",
  POSTS_MEDIUMS: "/api/posts/mediums",

  // Upload Endpoints
  UPLOAD_IMAGE: "/api/upload",
  DELETE_IMAGE: (id) => `/api/upload/${id}`,

  // Marketplace Endpoints
  LISTINGS: "/api/marketplace/listings",
  LISTING_BY_ID: (id) => `/api/marketplace/listings/${id}`,
  LISTINGS_SEARCH: "/api/marketplace/listings/search",
  ORDERS: "/api/marketplace/orders",
  ORDER_BY_ID: (id) => `/api/marketplace/orders/${id}`,
  ORDERS_BY_BUYER: (buyerId) => `/api/marketplace/orders/buyer/${buyerId}`,
  ORDERS_BY_SELLER: (sellerId) => `/api/marketplace/orders/seller/${sellerId}`,
  ORDER_STATUS: (id) => `/api/marketplace/orders/${id}/status`,

  // Hire Endpoints
  HIRE: "/api/hire",
  HIRE_BY_ID: (id) => `/api/hire/${id}`,
  HIRE_BY_CLIENT: (clientId) => `/api/hire/client/${clientId}`,
  HIRE_BY_ARTIST: (artistId) => `/api/hire/artist/${artistId}`,
  HIRE_RESPOND: (id) => `/api/hire/${id}/respond`,
  HIRE_STATUS: (id) => `/api/hire/${id}/status`,
  HIRE_CANCEL: (id) => `/api/hire/${id}/cancel`,
};

export default API_ENDPOINTS;
