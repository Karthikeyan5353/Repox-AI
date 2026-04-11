import apiClient from './apiClient';

export async function getLearnings(query = '', usage = 'all') {
  const { data } = await apiClient.get('/learnings', { params: { q: query, usage } });
  return data;
}

export function getLearningExportUrl() {
  const base = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';
  return `${base}/learnings/export.csv`;
}
