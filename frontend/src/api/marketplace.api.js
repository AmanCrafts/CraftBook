import API_ENDPOINTS from "../constants/apiEndpoints";
import httpClient from "./httpClient";

// Marketplace API - listings and orders

export const marketplaceAPI = {
  // Get all listings with optional filters
  getListings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);
    if (filters.medium) params.append("medium", filters.medium);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.sellerId) params.append("sellerId", filters.sellerId);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.page) params.append("page", filters.page);
    const queryStr = params.toString();
    return await httpClient.get(`${API_ENDPOINTS.LISTINGS}${queryStr ? `?${queryStr}` : ""}`);
  },

  // Get listing by ID
  getListingById: async (id) => {
    return await httpClient.get(API_ENDPOINTS.LISTING_BY_ID(id));
  },

  // Search listings
  searchListings: async (query) => {
    return await httpClient.get(`${API_ENDPOINTS.LISTINGS_SEARCH}?q=${encodeURIComponent(query)}`);
  },

  // Create new listing
  createListing: async (listingData) => {
    return await httpClient.post(API_ENDPOINTS.LISTINGS, listingData);
  },

  // Update listing
  updateListing: async (id, data) => {
    return await httpClient.put(API_ENDPOINTS.LISTING_BY_ID(id), data);
  },

  // Delete listing
  deleteListing: async (id, sellerId) => {
    return await httpClient.deleteRequest(API_ENDPOINTS.LISTING_BY_ID(id), { sellerId });
  },

  // Create order (buy artwork)
  createOrder: async (orderData) => {
    return await httpClient.post(API_ENDPOINTS.ORDERS, orderData);
  },

  // Get order by ID
  getOrderById: async (id) => {
    return await httpClient.get(API_ENDPOINTS.ORDER_BY_ID(id));
  },

  // Get orders as buyer
  getOrdersByBuyer: async (buyerId) => {
    return await httpClient.get(API_ENDPOINTS.ORDERS_BY_BUYER(buyerId));
  },

  // Get orders as seller
  getOrdersBySeller: async (sellerId) => {
    return await httpClient.get(API_ENDPOINTS.ORDERS_BY_SELLER(sellerId));
  },

  // Update order status
  updateOrderStatus: async (id, userId, status) => {
    return await httpClient.put(API_ENDPOINTS.ORDER_STATUS(id), { userId, status });
  },
};

export default marketplaceAPI;
