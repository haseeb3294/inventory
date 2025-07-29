import axios from "axios";

const API_URL = "http://localhost:5000/categories";

const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createCategory = async (categoryData, token) => {
  const config = {
    headers: {
      "x-auth-token": token,
    },
  };
  const response = await axios.post(API_URL, categoryData, config);
  return response.data;
};

export default { getCategories, createCategory };
