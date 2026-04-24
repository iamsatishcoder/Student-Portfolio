// src/services/api.js
import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:4000/api", // your backend URL
});

// Automatically attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const loginUser = (credentials) => API.post("/auth/login", credentials);

// Generic Authenticated GET, POST, PUT, DELETE for your pages
export const authGet = (url) => API.get(url);
export const authPost = (url, data) => API.post(url, data);
export const authPut = (url, data) => API.put(url, data);
export const authDelete = (url) => API.delete(url);

// Specific APIs
export const getProfile = () => API.get("/students/me");
export const getEducation = () => API.get("/education");
export const getSkills = () => API.get("/skills");
export const getProjects = () => API.get("/projects");

export default API;
