import apiClient from './apiClient';

export async function getPullRequestDetails(repositoryId, pullRequestNumber) {
  const { data } = await apiClient.get(`/pull-requests/${repositoryId}/${pullRequestNumber}`);
  return data;
}

export async function reviewPullRequest(repositoryId, pullRequestNumber) {
  const { data } = await apiClient.post(`/pull-requests/${repositoryId}/${pullRequestNumber}/review`);
  return data;
}

export async function postReviewComments(reviewId) {
  const { data } = await apiClient.post('/pull-requests/comments/post', { reviewId });
  return data;
}
