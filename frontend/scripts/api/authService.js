import { API_BASE_URL } from "../config.js";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export const authService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const userJson = localStorage.getItem(USER_KEY);
    console.log("userJson : ",userJson)
    return userJson ? JSON.parse(userJson) : null;
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    
    const data = await res.json();
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      console.log("data.user : ",data.user)
      if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data;
  },

  async signup(payload) {
    const res = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Signup failed");
    
    const data = await res.json();
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY); 
    localStorage.removeItem(USER_KEY); 
    
    window.location.href = "/frontend/index.html"; 
  }
};