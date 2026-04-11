import apiClient from './apiClient';

export async function getReports(filter = '30d') {
  const { data } = await apiClient.get('/reports', { params: { filter } });
  return data;
}
