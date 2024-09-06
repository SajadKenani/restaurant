import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to retrieve access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getSettings = async () => {
  const response = await axios.get(`${API_URL}/settings`);
  return response.data;
};

export const updateSettings = async (formData) => {
  try {
    const response = await axios.put(`${API_URL}/settings`, formData, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};
