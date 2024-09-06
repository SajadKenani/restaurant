import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to retrieve access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getItems = async () => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data;
};

export const getItemById = async (id) => {
  const response = await axios.get(`${API_URL}/items/${id}`);
  return response.data;
};

export const createItem = async (formData) => {
  const response = await axios.post(`${API_URL}/items`, formData, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.data;
};

export const updateItem = async ({ id, formData }) => {
  const response = await axios.put(`${API_URL}/items/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error updating item: ${response.statusText}`);
  }
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await axios.delete(`${API_URL}/items/${id}`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.data;
};

export const getItemsByCategoryId = async (id) => {
  const response = await axios.get(`${API_URL}/items/category/${id}`);
  return response.data;
};
