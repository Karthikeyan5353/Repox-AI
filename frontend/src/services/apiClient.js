import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';

const apiClient = axios.create({
  baseURL,
});

export default apiClient;
