import axios from "axios";

const API_URL = "http://localhost:5000/products";

const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key]) params.append(key, filters[key]);
  });
  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

const getProduct = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createProduct = async (productData, token) => {
  const config = {
    headers: {
      "x-auth-token": token,
    },
  };
  const response = await axios.post(API_URL, productData, config);
  return response.data;
};

const updateProduct = async (id, productData, token) => {
  const config = {
    headers: {
      "x-auth-token": token,
    },
  };
  const response = await axios.put(`${API_URL}/${id}`, productData, config);
  return response.data;
};

const deleteProduct = async (id, token) => {
  const config = {
    headers: {
      "x-auth-token": token,
    },
  };
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
