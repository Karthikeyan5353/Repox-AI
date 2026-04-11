import axios from 'axios';
import { withCache } from './cacheService.js';

const githubApi = 'https://api.github.com';

function buildHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function createError(error) {
  const status = error.response?.status || 500;
  const remaining = error.response?.headers?.['x-ratelimit-remaining'];
  const reset = error.response?.headers?.['x-ratelimit-reset'];
  const message =
    status === 403 && remaining === '0'
      ? `GitHub API rate limit reached. Retry after ${new Date(Number(reset) * 1000).toISOString()}`
      : error.response?.data?.message || error.message;
  const wrapped = new Error(message);
  wrapped.status = status;
  wrapped.details = error.response?.data || null;
  return wrapped;
}

async function githubRequest(token, config) {
  try {
    const response = await axios({
      baseURL: githubApi,
      headers: buildHeaders(token),
      ...config,
    });
    return response.data;
  } catch (error) {
    throw createError(error);
  }
}

export function parseRepositoryUrl(repositoryUrl) {
  const normalized = repositoryUrl.trim().replace(/\.git$/, '');
  const url = new URL(normalized);
  const segments = url.pathname.split('/').filter(Boolean);

  if (segments.length < 2) {
    throw new Error('Repository URL must include owner and repository name');
  }

  return {
    owner: segments[0],
    repo: segments[1],
    fullName: `${segments[0]}/${segments[1]}`,
  };
}

export async function getAuthenticatedUser(token) {
  return withCache(`github:user:${token.slice(-6)}`, 120, () =>
    githubRequest(token, {
      method: 'GET',
      url: '/user',
    })
  );
}

export async function listRepositories(token) {
  const repositories = [];
  let page = 1;

  while (page <= 5) {
    const items = await githubRequest(token, {
      method: 'GET',
      url: '/user/repos',
      params: {
        per_page: 100,
        sort: 'updated',
        page,
      },
    });

    repositories.push(...items);

    if (items.length < 100) {
      break;
    }

    page += 1;
  }

  return repositories;
}

export async function getRepository(token, owner, repo) {
  return githubRequest(token, {
    method: 'GET',
    url: `/repos/${owner}/${repo}`,
  });
}

export async function listBranches(token, owner, repo) {
  return githubRequest(token, {
    method: 'GET',
    url: `/repos/${owner}/${repo}/branches`,
    params: { per_page: 100 },
  });
}

export async function listCommits(token, owner, repo) {
  return githubRequest(token, {
    method: 'GET',
    url: `/repos/${owner}/${repo}/commits`,
    params: { per_page: 30 },
  });
}

export async function listPullRequests(token, owner, repo, state = 'open') {
  return githubRequest(token, {
    method: 'GET',
    url: `/repos/${owner}/${repo}/pulls`,
    params: {
      state,
      sort: 'updated',
      direction: 'desc',
      per_page: 50,
    },
  });
}

export async function getPullRequest(token, owner, repo, pullNumber) {
  return githubRequest(token, {
    method: 'GET',
    url: `/repos/${owner}/${repo}/pulls/${pullNumber}`,
  });
}

export async function getPullRequestFiles(token, owner, repo, pullNumber) {
  return githubRequest(token, {
    method: 'GET',
    url: `/repos/${owner}/${repo}/pulls/${pullNumber}/files`,
    params: {
      per_page: 100,
    },
  });
}

export async function getRepositoryTree(token, owner, repo, ref = 'HEAD') {
  const branchData = await githubRequest(token, {
    method: 'GET',
    url: `/repos/${owner}/${repo}/branches/${encodeURIComponent(ref)}`,
  }).catch(async () =>
    githubRequest(token, {
      method: 'GET',
      url: `/repos/${owner}/${repo}`,
    })
  );

  const treeRef = branchData.commit?.sha || branchData.default_branch || ref;
  const tree = await githubRequest(token, {
    method: 'GET',
    url: `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(treeRef)}`,
    params: { recursive: '1' },
  });

  return tree.tree || [];
}

export async function getFileContent(token, owner, repo, path, ref) {
  const encodedPath = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  const data = await githubRequest(token, {
    method: 'GET',
    url: `/repos/${owner}/${repo}/contents/${encodedPath}`,
    params: ref ? { ref } : {},
  });

  if (!data.content) {
    return '';
  }

  return Buffer.from(data.content, 'base64').toString('utf8');
}

export async function postIssueComment(token, owner, repo, pullNumber, body) {
  return githubRequest(token, {
    method: 'POST',
    url: `/repos/${owner}/${repo}/issues/${pullNumber}/comments`,
    data: { body },
  });
}

export async function postInlineComment(token, owner, repo, pullNumber, payload) {
  return githubRequest(token, {
    method: 'POST',
    url: `/repos/${owner}/${repo}/pulls/${pullNumber}/comments`,
    data: payload,
  });
}
