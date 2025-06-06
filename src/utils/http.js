import API from './api';

export const getData = async (endpoint, params = {}) => {
  try {
    const response = await API.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`GET Error (${endpoint}):`, error.response?.data || error);
    throw error;
  }
};

export const postData = async (endpoint, payload) => {
  try {
    const response = await API.post(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error(`POST Error (${endpoint}):`, error.response?.data || error);
    throw error;
  }
};

export const putData = async (endpoint, payload) => {
  try {
    const response = await API.put(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error(`PUT Error (${endpoint}):`, error.response?.data || error);
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await API.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error(`DELETE Error (${endpoint}):`, error.response?.data || error);
    throw error;
  }
};
