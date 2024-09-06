import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to retrieve access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getCategories = async () => {
  console.log("API_URL", API_URL);
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/categories/${id}`);
  return response.data;
};

export const createCategory = async (formData) => {
  const response = await axios.post(`${API_URL}/categories`, formData, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.data;
};

export const updateCategory = async ({ id, formData }) => {
  const response = await axios.put(`${API_URL}/categories/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error updating category: ${response.statusText}`);
  }
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.data;
};
