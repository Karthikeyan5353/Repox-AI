import { asyncHandler } from '../utils/asyncHandler.js';
import { getFileContent, getPullRequest, getPullRequestFiles, listPullRequests } from '../services/githubService.js';
import { find, findById, upsert } from '../services/dataStore.js';
import { analyzePullRequest, postReviewToGithub } from '../services/reviewService.js';
import { getGithubToken } from '../services/settingsService.js';

async function requireGithubToken() {
  const token = await getGithubToken();
  if (!token) {
    const error = new Error('GitHub token is not configured');
    error.status = 400;
    throw error;
  }
  return token;
}

export const listPullRequestsController = asyncHandler(async (request, response) => {
  const token = await requireGithubToken();
  const repository = await findById('repositories', request.params.repositoryId);
  if (!repository) {
    const error = new Error('Repository not found');
    error.status = 404;
    throw error;
  }

  const pullRequests = await listPullRequests(token, repository.owner, repository.name, request.query.state || 'open');
  response.json(pullRequests);
});

export const getPullRequestDetailsController = asyncHandler(async (request, response) => {
  const token = await requireGithubToken();
  const repository = await findById('repositories', request.params.repositoryId);
  if (!repository) {
    const error = new Error('Repository not found');
    error.status = 404;
    throw error;
  }

  const pullNumber = Number(request.params.pullRequestNumber);
  const [pullRequest, files, reviews] = await Promise.all([
    getPullRequest(token, repository.owner, repository.name, pullNumber),
    getPullRequestFiles(token, repository.owner, repository.name, pullNumber),
    find('reviews', { repository: repository._id }, { sort: { createdAt: -1 } }),
  ]);

  const enrichedFiles = await Promise.all(
    files.map(async (file) => {
      const [baseContent, headContent] = await Promise.all([
        getFileContent(token, repository.owner, repository.name, file.filename, pullRequest.base.sha).catch(() => ''),
        getFileContent(token, repository.owner, repository.name, file.filename, pullRequest.head.sha).catch(() => ''),
      ]);

      return {
        ...file,
        baseContent,
        headContent,
      };
    })
  );

  await upsert(
    'pullRequests',
    { repository: repository._id, number: pullNumber },
    {
      repository: repository._id,
      githubId: pullRequest.id,
      number: pullRequest.number,
      title: pullRequest.title,
      state: pullRequest.state,
      merged: pullRequest.merged,
      author: pullRequest.user?.login,
      htmlUrl: pullRequest.html_url,
      baseBranch: pullRequest.base?.ref,
      headBranch: pullRequest.head?.ref,
      baseSha: pullRequest.base?.sha,
      headSha: pullRequest.head?.sha,
      additions: pullRequest.additions,
      deletions: pullRequest.deletions,
      changedFiles: pullRequest.changed_files,
      createdAtGithub: pullRequest.created_at,
      updatedAtGithub: pullRequest.updated_at,
      mergedAt: pullRequest.merged_at,
    }
  );

  response.json({
    pullRequest,
    files: enrichedFiles,
    reviews: reviews.filter((review) => review.pullRequestNumber === pullNumber),
  });
});

export const reviewPullRequestController = asyncHandler(async (request, response) => {
  const token = await requireGithubToken();
  const result = await analyzePullRequest({
    repositoryId: request.params.repositoryId,
    pullRequestNumber: Number(request.params.pullRequestNumber),
    token,
  });

  response.json(result.review);
});

export const postReviewCommentsController = asyncHandler(async (request, response) => {
  const token = await requireGithubToken();
  const result = await postReviewToGithub({
    reviewId: request.body.reviewId,
    token,
  });

  response.json(result);
});
