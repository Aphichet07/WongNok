import { apiClient } from "../utils/apiClient.js";

export const reviewService = {
    
    getByShopId: async (shopId) => {
        return await apiClient.get(`/review/shop/${shopId}`);
    },

    create: async (payload) => {
        return await apiClient.post(`/review/create`, payload);
    },

    update: async (reviewId, payload) => {
        return await apiClient.put(`/review/${reviewId}`, payload);
    },

    delete: async (reviewId) => {
        return await apiClient.delete(`/review/${reviewId}`);
    }
};