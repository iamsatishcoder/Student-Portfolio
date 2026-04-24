import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // notice /api added here
});

// Example APIs
export const getProfile = () => api.get("/students");
export const getEducation = () => api.get("/education");
export const getSkills = () => api.get("/skills");
export const getProjects = () => api.get("/projects");
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getUsers = () => api.get("/students");

export const updateProfile = (data) => api.post("/students", data);

export default api;
