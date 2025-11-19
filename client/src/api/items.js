import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// GET all items
export const getAllItems = async () => {
  const res = await api.get("/items");
  return res.data;
};

// GET one item
export const getItem = async (id) => {
  const res = await api.get(`/items/${id}`);
  return res.data;
};

// POST new item
export const addItem = async (itemData) => {
  const res = await api.post("/items", itemData);
  return res.data;
};

// POST review
export const addReview = async (id, data) => {
  const res = await api.post(`/items/${id}/review`, data);
  return res.data;
};

// DELETE review
export const deleteReview = async (itemId, reviewId) => {
  const res = await api.delete(`/items/${itemId}/review/${reviewId}`);
  return res.data;
};
