import { API_CONFIG } from "../config";

// HTTP Client - centralized fetch wrapper for API calls

// Base URL and default headers
const baseURL = API_CONFIG.baseURL;
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Make HTTP request
async function request(endpoint, options = {}) {
  const url = `${baseURL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.error || "Request failed",
        details: data.details,
      };
    }

    return data;
  } catch (error) {
    console.error("HTTP Client Error:", error);
    throw error;
  }
}

// HTTP GET request
export function get(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    method: "GET",
  });
}

// HTTP POST request
export function post(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

// HTTP PUT request
export function put(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// HTTP DELETE request
export function deleteRequest(endpoint, body = null, options = {}) {
  const config = {
    ...options,
    method: "DELETE",
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  return request(endpoint, config);
}

// HTTP POST request for FormData (file uploads)
export function postFormData(endpoint, formData, options = {}) {
  const url = `${baseURL}${endpoint}`;
  const config = {
    ...options,
    method: "POST",
    headers: {
      // Don't set Content-Type header - let browser/fetch set it with boundary
      Accept: "application/json",
      ...options.headers,
    },
    body: formData,
  };

  // Use separate fetch for FormData to avoid JSON parsing issues
  return fetch(url, config)
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.error || "Request failed",
          details: data.details,
        };
      }

      return data;
    })
    .catch((error) => {
      console.error("HTTP Client Error:", error);
      throw error;
    });
}

// Default export for compatibility
export const httpClient = {
  request,
  get,
  post,
  put,
  delete: deleteRequest,
  postFormData,
};

export default httpClient;
