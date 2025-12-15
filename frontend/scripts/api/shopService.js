import { API_BASE_URL } from "../config.js";
import { authService } from "./authService.js";

export const shopService = {
  async getRecommended() {
    const res = await fetch(`${API_BASE_URL}/shops/recommend`);
    if (!res.ok) throw new Error("Failed to fetch recommended shops");
    return await res.json();
  },
  async search(keyword){
    const res = await fetch(`${API_BASE_URL}/shops/search?q=${encodeURIComponent(keyword)}`);
    if (!res.ok) throw new Error("Search failed");
    return await res.json();
  }
  ,


  async searchByName(keyword) {
    const res = await fetch(`${API_BASE_URL}/shops/name`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: keyword || "" }),
    });
    if (!res.ok) throw new Error("Search failed");
    return await res.json();
  },

  async filterShops(queryString) {
    const res = await fetch(`${API_BASE_URL}/shops/filter?${queryString}`);
    if (!res.ok) throw new Error("Filter failed");
    return await res.json();
  },

  async createReview(payload) {
    const token = authService.getToken();
    console.log("Token : ", token)
    console.log("Payload : ", payload)
    const res = await fetch(`${API_BASE_URL}/review/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Review failed");
    return await res.json();
  },

  async  fetchNearbyShops(lat, lng) {
    try {
        const res = await fetch(`${API_BASE_URL}/shops/nearby?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error("Failed to fetch nearby shops");
        
        const shops = await res.json();
        return shops; 
    } catch (err) {
        console.error(err);
        return;
    }
}
};