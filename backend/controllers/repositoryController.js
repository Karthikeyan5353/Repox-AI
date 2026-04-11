import { asyncHandler } from '../utils/asyncHandler.js';
import { getFileContent, getRepository, getRepositoryTree, listBranches, listCommits, listPullRequests, listRepositories, parseRepositoryUrl } from '../services/githubService.js';
import { getGithubToken } from '../services/settingsService.js';
import { find, findById, upsert } from '../services/dataStore.js';
import { analyzeSingleFile } from '../services/reviewService.js';

async function requireGithubToken() {
  const token = await getGithubToken();
  if (!token) {
    const error = new Error('GitHub token is not configured');
    error.status = 400;
    throw error;
  }
  return token;
}

export const syncRepositories = asyncHandler(async (request, response) => {
  const token = await requireGithubToken();
  const repositoryUrl = request.body.repositoryUrl?.trim();

  let sourceRepositories;
  if (repositoryUrl) {
    const { owner, repo } = parseRepositoryUrl(repositoryUrl);
    sourceRepositories = [await getRepository(token, owner, repo)];
  } else {
    sourceRepositories = await listRepositories(token);
  }

  const synchronized = [];
  for (const repository of sourceRepositories) {
    const pullRequests = await listPullRequests(token, repository.owner.login, repository.name, 'open');
    const branches = await listBranches(token, repository.owner.login, repository.name);

    const saved = await upsert(
      'repositories',
      { githubId: repository.id },
      {
        githubId: repository.id,
        owner: repository.owner.login,
        name: repository.name,
        fullName: repository.full_name,
        htmlUrl: repository.html_url,
        description: repository.description,
        private: repository.private,
        defaultBranch: repository.default_branch,
        language: repository.language,
        openPullRequestsCount: pullRequests.length,
        branchesCount: branches.length,
        lastPushedAt: repository.pushed_at,
        syncedAt: new Date().toISOString(),
      }
    );

    synchronized.push(saved);
  }

  response.json({
    count: synchronized.length,
    repositories: synchronized,
  });
});

export const listSavedRepositories = asyncHandler(async (request, response) => {
  const query = request.query.q?.trim();
  const filter = query
    ? {
        $or: [
          { fullName: { $regex: query, $options: 'i' } },
          { name: { $regex: query, $options: 'i' } },
        ],
      }
    : {};

  const repositories = await find('repositories', filter, { sort: { syncedAt: -1, updatedAt: -1 } });
  response.json(repositories);
});

export const getRepositoryDetails = asyncHandler(async (request, response) => {
  const token = await requireGithubToken();
  const repository = await findById('repositories', request.params.repositoryId);
  if (!repository) {
    const error = new Error('Repository not found');
    error.status = 404;
    throw error;
  }

  const [branches, commits, pullRequests] = await Promise.all([
    listBranches(token, repository.owner, repository.name),
    listCommits(token, repository.owner, repository.name),
    listPullRequests(token, repository.owner, repository.name, request.query.state || 'open'),
  ]);

  for (const pullRequest of pullRequests) {
    await upsert(
      'pullRequests',
      { githubId: pullRequest.id },
      {
        repository: repository._id,
        githubId: pullRequest.id,
        number: pullRequest.number,
        title: pullRequest.title,
        state: pullRequest.state,
        merged: Boolean(pullRequest.merged_at),
        author: pullRequest.user?.login,
        htmlUrl: pullRequest.html_url,
        baseBranch: pullRequest.base?.ref,
        headBranch: pullRequest.head?.ref,
        baseSha: pullRequest.base?.sha,
        headSha: pullRequest.head?.sha,
        createdAtGithub: pullRequest.created_at,
        updatedAtGithub: pullRequest.updated_at,
        mergedAt: pullRequest.merged_at,
      }
    );
  }

  response.json({
    repository,
    branches,
    commits,
    pullRequests,
  });
});

export const getRepositoryTreeController = asyncHandler(async (request, response) => {
  const token = await requireGithubToken();
  const repository = await findById('repositories', request.params.repositoryId);
  if (!repository) {
    const error = new Error('Repository not found');
    error.status = 404;
    throw error;
  }

  const tree = await getRepositoryTree(token, repository.owner, repository.name, request.query.ref || repository.defaultBranch);
  response.json(tree);
});

export const getRepositoryFileController = asyncHandler(async (request, response) => {
  const token = await requireGithubToken();
  const repository = await findById('repositories', request.params.repositoryId);
  if (!repository) {
    const error = new Error('Repository not found');
    error.status = 404;
    throw error;
  }

  const path = request.query.path;
  if (!path) {
    const error = new Error('File path is required');
    error.status = 400;
    throw error;
  }

  const content = await getFileContent(token, repository.owner, repository.name, path, request.query.ref || repository.defaultBranch);
  response.json({ path, content });
});

export const reviewSingleFileController = asyncHandler(async (request, response) => {
  const token = await requireGithubToken();
  const result = await analyzeSingleFile({
    repositoryId: request.params.repositoryId,
    filePath: request.body.filePath,
    ref: request.body.ref,
    token,
  });

  response.json(result);
});
