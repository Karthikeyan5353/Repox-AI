import apiClient from './apiClient';

export async function syncRepositories(repositoryUrl) {
  const { data } = await apiClient.post('/repositories/sync', { repositoryUrl });
  return data;
}

export async function getRepositories(query = '') {
  const { data } = await apiClient.get('/repositories', { params: { q: query } });
  return data;
}

export async function getRepositoryDetails(repositoryId, state = 'open') {
  const { data } = await apiClient.get(`/repositories/${repositoryId}`, { params: { state } });
  return data;
}

export async function getRepositoryTree(repositoryId, ref) {
  const { data } = await apiClient.get(`/repositories/${repositoryId}/tree`, { params: { ref } });
  return data;
}

export async function getRepositoryFile(repositoryId, path, ref) {
  const { data } = await apiClient.get(`/repositories/${repositoryId}/file`, {
    params: { path, ref },
  });
  return data;
}

export async function reviewSingleFile(repositoryId, filePath, ref) {
  const { data } = await apiClient.post(`/repositories/${repositoryId}/review-file`, {
    filePath,
    ref,
  });
  return data;
}
