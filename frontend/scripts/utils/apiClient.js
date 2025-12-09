import { API_BASE_URL } from "../config.js";
import { authService } from "../api/authService.js";

export const apiClient = {
  request: async (endpoint, method = "GET", body = null) => {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = authService.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      if (response.status === 401 || response.status === 403) {
        authService.logout();
        return null; 
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "API Request Failed");
      }

      return await response.json();

    } catch (err) {
      throw err;
    }
  },

  get: (endpoint) => apiClient.request(endpoint, "GET"),
  post: (endpoint, body) => apiClient.request(endpoint, "POST", body),
  put: (endpoint, body) => apiClient.request(endpoint, "PUT", body),
  delete: (endpoint) => apiClient.request(endpoint, "DELETE"),
};