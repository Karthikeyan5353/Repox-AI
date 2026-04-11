import apiClient from './apiClient';

export async function getWorkspaceStatus() {
  const { data } = await apiClient.get('/settings/status');
  return data;
}

export async function connectGithub(token) {
  const { data } = await apiClient.post('/settings/github', { token });
  return data;
}

export async function connectOpenAi(apiKey, model) {
  const { data } = await apiClient.post('/settings/openai', { apiKey, model });
  return data;
}
