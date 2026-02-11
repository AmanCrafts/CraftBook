import API_ENDPOINTS from "../constants/apiEndpoints";
import httpClient from "./httpClient";

// Hire API - artist hiring / commission requests

export const hireAPI = {
  // Create hire request
  createHireRequest: async (requestData) => {
    return await httpClient.post(API_ENDPOINTS.HIRE, requestData);
  },

  // Get hire request by ID
  getHireRequestById: async (id) => {
    return await httpClient.get(API_ENDPOINTS.HIRE_BY_ID(id));
  },

  // Get requests sent by client
  getHireRequestsByClient: async (clientId) => {
    return await httpClient.get(API_ENDPOINTS.HIRE_BY_CLIENT(clientId));
  },

  // Get requests received by artist
  getHireRequestsByArtist: async (artistId) => {
    return await httpClient.get(API_ENDPOINTS.HIRE_BY_ARTIST(artistId));
  },

  // Artist responds (accept/decline)
  respondToHireRequest: async (id, artistId, action, response) => {
    return await httpClient.put(API_ENDPOINTS.HIRE_RESPOND(id), {
      artistId,
      action,
      response,
    });
  },

  // Update hire request status
  updateHireRequestStatus: async (id, userId, status) => {
    return await httpClient.put(API_ENDPOINTS.HIRE_STATUS(id), { userId, status });
  },

  // Cancel hire request
  cancelHireRequest: async (id, clientId) => {
    return await httpClient.put(API_ENDPOINTS.HIRE_CANCEL(id), { clientId });
  },
};

export default hireAPI;
