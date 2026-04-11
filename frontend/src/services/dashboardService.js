import apiClient from './apiClient';

export async function getDashboard(filter = '30d') {
  const { data } = await apiClient.get('/dashboard', { params: { filter } });
  return data;
}
