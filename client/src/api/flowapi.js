import axios from 'axios';

const API_URL = 'http://localhost:5000/api/flows';

const createFlow = async (flowData) => {
  const response = await axios.post(API_URL, flowData);
  return response.data;
};

const getFlow = async (flowId) => {
  const response = await axios.get(`${API_URL}/${flowId}`);
  return response.data;
};

const updateFlow = async (flowId, flowData) => {
  const response = await axios.put(`${API_URL}/${flowId}`, flowData);
  return response.data;
};

const listFlows = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const deleteFlow = async (flowId) => {
  const response = await axios.delete(`${API_URL}/${flowId}`);
  return response.data;
};

export default {
  createFlow,
  getFlow,
  updateFlow,
  listFlows,
  deleteFlow
};