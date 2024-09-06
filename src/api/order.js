import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to retrieve access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(`${API_URL}/orders/${id}`);
  return response;
};

export const updateOrder = async (id, order) => {
  const response = await axios.put(`${API_URL}/orders/${id}`, order, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.data;
};
